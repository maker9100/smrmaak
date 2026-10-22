import random
from collections import deque
from unittest.mock import patch
import pytest
from fastapi.testclient import TestClient
from backend.arenas import ARENAS
from backend.game import Room, clear
from backend.main import app

@pytest.mark.parametrize('key',list(ARENAS))
def test_every_map_is_connected_and_all_six_spawns_are_safe(key):
    grid=ARENAS[key]['grid'];assert len(grid)==35 and all(len(row)==60 for row in grid)
    seen={(5,9)};queue=deque(seen)
    while queue:
        x,y=queue.popleft()
        for dx,dy in [(1,0),(-1,0),(0,1),(0,-1)]:
            v=x+dx,y+dy
            if 0<=v[0]<60 and 0<=v[1]<35 and grid[v[1]][v[0]]=='0' and v not in seen:seen.add(v);queue.append(v)
    assert len(seen)==sum(row.count('0') for row in grid)
    assert all((int(x),int(y)) in seen for team in ARENAS[key]['spawns'] for x,y in team)
    room=Room('T','local',key)
    for i in range(6):room.add(str(i),i%2).ready=True
    room.start()
    assert all(grid[int(p.y)][int(p.x)]=='0' for p in room.players.values())

@pytest.mark.parametrize('key',list(ARENAS))
def test_ai_can_finish_a_full_match_on_each_map(key):
    random.seed(42)
    room=Room('AI','ai',key);room.add('human').ready=True;room.start()
    for p in room.players.values():p.bot=True
    for _ in range(15000):
        room.tick(.05)
        if room.state=='MATCH_END':break
    assert room.state=='MATCH_END' and max(room.score)==3
    assert not any(any(p.cheats.values()) for p in room.players.values())


def test_collision_and_shooting_use_the_room_map_not_a_global_grid():
    a=Room('A','ai','freight');b=Room('B','ai','foundry')
    assert clear(21.5,3.5,27.5,3.5,a.map)
    assert not clear(21.5,3.5,27.5,3.5,b.map)
    for room in [a,b]:
        p=room.add('Shooter',0);q=room.add('Target',1,True)
        p.x,p.y,p.yaw=21.5,3.5,0;q.x,q.y=27.5,3.5;p.cheats['recoil']=True;room.shoot(p)
        assert q.hp==(75 if room is a else 100)


def test_only_local_host_can_select_a_map_and_selection_resets_ready():
    r=Room('L','local');host=r.add('Host');guest=r.add('Guest',1)
    host.ready=guest.ready=True
    r.command(guest,{'type':'map','map_id':'plaza'});assert r.map_id=='freight'
    r.command(host,{'type':'map','map_id':'plaza'});assert r.map_id=='plaza'
    assert not any(p.ready for p in r.players.values())
    r.state='PLAYING';r.command(host,{'type':'map','map_id':'railway'});assert r.map_id=='plaza'


def test_catalog_and_local_selection_and_ai_random_choice_are_networked():
    with TestClient(app) as c:
        catalog=c.get('/arenas').json()['arenas'];assert len(catalog)==5
        assert len({tuple(a['grid']) for a in catalog})==5
        assert len({a['landmark'] for a in catalog})==5
        for key in ARENAS:
            with c.websocket_connect('/ws') as ws:
                ws.send_json({'mode':'local','map_id':key});w=ws.receive_json()
                assert w['map_id']==key and w['map']==ARENAS[key]['grid']
            with patch('backend.main.secrets.choice',return_value=key),c.websocket_connect('/ws') as ws:
                ws.send_json({'mode':'ai','map_id':'not-a-map','quick':True});w=ws.receive_json()
                assert w['map_id']==key
                snap=ws.receive_json();assert snap['arena']==ARENAS[key] and snap['state']=='COUNTDOWN'
