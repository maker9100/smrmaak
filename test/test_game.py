import math
import random
from backend.game import Room, clear
from fastapi.testclient import TestClient
from backend.main import app


def ai_room():
    r=Room('TEST','ai')
    p=r.add('Tester')
    p.ready=True
    r.start()
    r.tick(3.1)
    return r,p


def test_ai_roster_and_no_cheats():
    r,p=ai_room()
    assert len(r.players)==6
    assert [sum(q.team==t for q in r.players.values()) for t in (0,1)]==[3,3]
    assert all(not any(q.cheats.values()) for q in r.players.values() if q.bot)
    for q in r.players.values():
        if q.bot:
            r.command(q,{'type':'toggle','key':'aim'})
            assert not q.cheats['aim']


def test_elimination_best_of_five():
    r,p=ai_room()
    for n in range(3):
        for q in r.players.values():
            if q.team==1:q.hp=0
        r.tick(.01)
        assert r.score==[n+1,0]
        if n<2:
            assert r.state=='ROUND_END'
            r.tick(4.1)
            r.tick(3.1)
    assert r.state=='MATCH_END'
    assert len(r.history)==3


def test_cheats_ammo_recoil_aim_and_damage():
    r,p=ai_room()
    p.x,p.y,p.yaw=2.5,1.5,.2
    target=next(q for q in r.players.values() if q.team==1)
    target.x,target.y,target.hp=6.5,1.5,100
    for q in r.players.values():q.bot=False
    for key in p.cheats:r.command(p,{'type':'toggle','key':key})
    p.ammo=0
    r.command(p,{'type':'input','aim':True,'fire':True})
    r.tick(.01)
    assert abs(p.yaw)<.001
    assert target.hp==75 and p.ammo==0 and p.kick==0
    for _ in range(3):
        p.cooldown=0
        r.shoot(p)
    assert target.hp==0 and target.deaths==1 and p.kills==1


def test_walls_and_reload():
    r,p=ai_room()
    assert not clear(3.5,3.5,6.5,3.5)
    p.ammo=0
    r.shoot(p)
    assert p.reload==1.5
    for q in r.players.values():q.bot=False
    r.tick(1.6)
    assert p.ammo==30 and p.reload==0
    p.x,p.y=1.3,1.5
    p.yaw=math.pi
    for _ in range(15):
        r.command(p,{'type':'input','f':1})
        r.tick(.03)
    assert p.x>=1.22


def test_local_capacity_ready_and_teams():
    r=Room('LOCAL','local')
    for i in range(6):
        p=r.add(str(i),i%2)
        p.ready=True
    r.start()
    assert len(r.players)==6 and not any(p.bot for p in r.players.values())


def test_timeout_and_disconnect():
    r,p=ai_room()
    for q in r.players.values(): q.bot=False
    r.timer=.001
    r.tick(.01)
    assert r.state=='PLAYING' and r.timer==30
    p.hp=75
    r.timer=.001
    r.tick(.01)
    assert r.score==[0,1]
    p.cheats['aim']=True
    r.remove(p.id)
    assert p.bot and not any(p.cheats.values())


def test_ai_finishes_match():
    random.seed(10)
    r,p=ai_room()
    p.bot=True
    for _ in range(24000):
        r.tick(1/30)
        if r.state=='MATCH_END': break
    assert r.state=='MATCH_END'
    assert max(r.score)==3 and sum(r.score)<=5


def test_websocket_and_invalid_room():
    with TestClient(app) as client:
        assert client.get('/').status_code==200
        assert client.get('/health').json()['status']=='ok'
        with client.websocket_connect('/ws') as ws:
            ws.send_json({'name':'Net','mode':'ai'})
            welcome=ws.receive_json()
            pid=welcome['ids'][0]
            ws.send_json({'type':'ready','id':pid})
            ws.send_json({'type':'start','id':pid})
            snap=ws.receive_json()
            assert snap['state']=='COUNTDOWN' and len(snap['players'])==6
        with client.websocket_connect('/ws') as ws:
            ws.send_json({'code':'MISSING'})
            assert ws.receive_json()['type']=='error'


def test_six_real_websocket_players():
    from contextlib import ExitStack
    with TestClient(app) as client, ExitStack() as stack:
        connections=[]
        code=''
        for i in range(6):
            ws=stack.enter_context(client.websocket_connect('/ws'))
            ws.send_json({'name':str(i),'mode':'local','code':code})
            w=ws.receive_json()
            code=w['code']
            connections.append((ws,w['ids'][0]))
        for ws,pid in connections:ws.send_json({'id':pid,'type':'ready'})
        # A state snapshot acknowledges all six readiness changes before start.
        host=connections[0][0]
        for _ in range(30):
            snap=host.receive_json()
            if len(snap.get('players',[]))==6 and all(p['ready'] for p in snap['players']): break
        host.send_json({'type':'start','id':connections[0][1]})
        for _ in range(30):
            snap=host.receive_json()
            if snap.get('state')=='COUNTDOWN':break
        assert snap['state']=='COUNTDOWN'
        assert [sum(p['team']==t for p in snap['players']) for t in (0,1)]==[3,3]
