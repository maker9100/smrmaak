from contextlib import ExitStack

import pytest
from fastapi.testclient import TestClient
from backend.game import Room
from backend.main import app


@pytest.mark.parametrize('blue,red',[(1,1),(2,1),(1,2),(3,3)])
def test_any_occupied_teams_start_when_the_last_human_readies_without_filling_bots(blue,red):
    room=Room('LOCAL','local')
    players=[room.add(str(i),team) for team,count in [(0,blue),(1,red)] for i in range(count)]
    for p in players[:-1]:
        room.command(p,dict(type='ready'))
        assert room.state=='LOBBY'
    room.command(players[-1],dict(type='ready'))
    assert room.state=='COUNTDOWN' and room.round==1
    assert len(room.players)==blue+red and not any(p.bot for p in players)
    assert [sum(p.team==t for p in players) for t in (0,1)]==[blue,red]


@pytest.mark.parametrize('blue,red',[(1,0),(0,2),(0,0)])
def test_empty_team_or_empty_lobby_cannot_start_even_if_everyone_readies(blue,red):
    room=Room('LOCAL','local')
    for team,count in [(0,blue),(1,red)]:
        for i in range(count):room.command(room.add(str(i),team),dict(type='ready'))
    assert room.state=='LOBBY' and not room.snapshot()['can_start']
    with pytest.raises(ValueError):room.start()


def test_one_unready_player_blocks_three_player_match_and_the_host_cannot_bypass_it():
    room=Room('LOCAL','local');a=room.add('Host',0);b=room.add('Guest',1);c=room.add('Third',0)
    room.command(a,dict(type='ready'));room.command(b,dict(type='ready'))
    assert room.state=='LOBBY' and not c.ready
    with pytest.raises(ValueError):room.command(a,dict(type='start'))
    room.command(c,dict(type='ready'));assert room.state=='COUNTDOWN'


def test_team_change_resets_readiness_and_one_sided_ready_players_stay_in_lobby():
    room=Room('LOCAL','local');a=room.add('Host',0);b=room.add('Guest',0)
    room.command(a,dict(type='ready'));room.command(b,dict(type='ready'))
    assert room.state=='LOBBY' and '각각 1명' in room.snapshot()['start_hint']
    room.command(b,dict(type='custom',team=1));assert not b.ready
    assert room.state=='LOBBY' and not room.snapshot()['can_start']
    room.command(b,dict(type='ready'));assert room.state=='COUNTDOWN'


def test_map_change_resets_everyone_before_automatic_start():
    room=Room('LOCAL','local');a=room.add('Host',0);b=room.add('Guest',1)
    room.command(a,dict(type='ready'));room.command(a,dict(type='map',map_id='railway'))
    assert not a.ready and not b.ready
    room.command(b,dict(type='ready'));assert room.state=='LOBBY'
    room.command(a,dict(type='ready'));assert room.state=='COUNTDOWN' and room.map_id=='railway'


def test_one_vs_one_finishes_a_best_of_five_and_can_return_to_lobby_and_restart():
    room=Room('LOCAL','local');a=room.add('Host',0);b=room.add('Guest',1)
    for p in [a,b]:room.command(p,dict(type='ready'))
    for n in range(3):
        room.tick(3.1);assert room.state=='PLAYING'
        b.hp=0;room.tick(.01);assert room.score==[n+1,0]
        if n<2:room.tick(4.1)
    assert room.state=='MATCH_END' and len(room.players)==2
    room.command(a,dict(type='lobby'));assert room.state=='LOBBY' and not any(p.ready for p in room.players.values())
    for p in [a,b]:room.command(p,dict(type='ready'))
    assert room.state=='COUNTDOWN' and room.score==[0,0] and room.round==1


def until(ws,predicate):
    for _ in range(60):
        data=ws.receive_json()
        if predicate(data):return data
    raise AssertionError('Expected WebSocket state was not received')


def test_real_split_connection_requires_both_players_to_ready_then_auto_starts():
    with TestClient(app) as client,client.websocket_connect('/ws') as ws:
        ws.send_json(dict(mode='local',split=True));welcome=ws.receive_json();a,b=welcome['ids']
        ws.send_json(dict(type='ready',id=a))
        state=until(ws,lambda d:d.get('type')=='state' and d['players'][0]['ready'])
        assert state['state']=='LOBBY' and not state['players'][1]['ready'] and not state['can_start']
        ws.send_json(dict(type='start',id=a));assert until(ws,lambda d:d.get('type')=='error')
        ws.send_json(dict(type='ready',id=b))
        state=until(ws,lambda d:d.get('state')=='COUNTDOWN')
        assert len(state['players'])==2 and all(p['ready'] and not p['bot'] for p in state['players'])
        assert {p['team'] for p in state['players']}=={0,1}


def test_real_separate_connections_can_start_one_vs_one_after_team_assignment():
    with TestClient(app) as client,ExitStack() as stack:
        host=stack.enter_context(client.websocket_connect('/ws'));host.send_json(dict(mode='local'))
        a=host.receive_json();guest=stack.enter_context(client.websocket_connect('/ws'))
        guest.send_json(dict(code=a['code']));b=guest.receive_json()
        host.send_json(dict(type='ready',id=a['ids'][0]))
        guest.send_json(dict(type='custom',team=1,id=b['ids'][0]))
        guest.send_json(dict(type='ready',id=b['ids'][0]))
        state=until(host,lambda d:d.get('state')=='COUNTDOWN')
        assert len(state['players'])==2 and {p['team'] for p in state['players']}=={0,1}
