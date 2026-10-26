import math
from unittest.mock import patch

import pytest
from fastapi.testclient import TestClient

from backend.arenas import ARENAS
from backend.game import Room, clear
from backend.hazards import train_pose, train_hits
from backend.main import app

C=ARENAS['railway']['train']
HIT_TIME=3+44/5.6


def match():
    room=Room('TRAIN','local','railway')
    for i in range(6): room.add(str(i),i//3).ready=True
    room.start();room.state='PLAYING';room.timer=120
    return room,list(room.players.values())


def test_train_warning_travel_wait_and_reset():
    assert train_pose(0,C)['warning'] and not train_pose(2.99,C)['active']
    assert train_pose(3,C)['x']==-14 and train_pose(3,C)['active']
    assert train_pose(8,C)['x']==pytest.approx(14)
    assert not train_pose(20,C)['active'] and not train_pose(20,C)['warning']
    assert train_pose(24,C)['warning'] and train_pose(27,C)['x']==-14


def test_continuous_collision_catches_a_train_crossing_between_ticks():
    assert train_hits(3,19,(30,17.5),(30,17.5),C)
    assert train_hits(10.4,11.4,(30,14.5),(30,20.5),C)
    assert not train_hits(3,19,(30,20),(30,20),C)
    assert not train_hits(0,2.99,(30,17.5),(30,17.5),C)


def test_offmap_reset_does_not_sweep_through_the_arena():
    assert not train_hits(23.9,24.1,(30,17.5),(30,17.5),C)
    assert not train_hits(19,27.01,(30,17.5),(30,17.5),C)


@pytest.mark.parametrize('bot',[False,True])
def test_train_kills_humans_and_noncheating_ai_once_without_kill_credit(bot):
    room,players=match();victim=players[0]
    victim.bot=bot;victim.x,victim.y=30,17.5;room.train_time=HIT_TIME
    with patch.object(room,'ai',return_value=None):
        room.tick(1/60);room.tick(1/60)
    assert victim.hp==0 and victim.deaths==1
    assert sum(p.kills for p in players)==0
    assert room.log==[dict(killer='기차',victim=victim.name,team=None,cause='train')]
    assert room.state=='PLAYING' and len(room.snapshot()['players'])==6
    assert not any(victim.cheats.values())


def test_train_team_elimination_ends_the_round_and_freezes_the_train():
    room,players=match()
    for p in players[:3]:p.x,p.y=30,17.5
    room.train_time=HIT_TIME;room.tick(1/60)
    assert room.state=='ROUND_END' and room.score==[0,1]
    assert all(p.hp==0 for p in players[:3]) and all(p.hp==150 for p in players[3:])
    elapsed=room.train_time;room.tick(.5);assert room.train_time==elapsed
    room.new_round();assert room.train_time==0 and all(p.hp==150 for p in players)
    room.tick(1);assert room.train_time==0


def test_train_can_end_a_match():
    room,players=match();room.score=[0,2]
    for p in players[:3]:p.x,p.y=30,17.5
    room.train_time=HIT_TIME;room.tick(1/60)
    assert room.state=='MATCH_END' and room.score==[0,3]
    assert all(p.deaths==1 for p in players[:3])


def test_simultaneous_elimination_replays_the_same_round_without_awarding_a_team():
    room,players=match();old_round=room.round
    for p in players:p.x,p.y=30,17.5
    room.train_time=HIT_TIME;room.tick(1/60)
    assert room.round==old_round and room.state=='COUNTDOWN' and room.score==[0,0]
    assert room.history==[] and all(p.deaths==1 and p.hp==150 for p in players)
    assert room.train_time==0 and '동시 녹아웃' in room.message


def test_train_blocks_sight_and_bullets_and_the_crossing_is_clear_between_passes():
    room,players=match();p,q=players[0],players[3]
    p.x,p.y,p.yaw=30,14.5,math.pi/2;q.x,q.y=30,20.5
    assert clear(p.x,p.y,q.x,q.y,room.map)
    room.train_time=HIT_TIME;assert not room.sight(p.x,p.y,q.x,q.y)
    room.shoot(p);assert q.hp==150
    room.train_time=20;p.cooldown=0;assert room.sight(p.x,p.y,q.x,q.y)
    room.shoot(p);assert q.hp==125


def test_train_state_is_room_scoped_and_cannot_be_set_by_client_input():
    room,players=match();room.train_time=8
    other=Room('OTHER','local','railway')
    room.command(players[0],dict(type='input',train_time=0,train={'x':999}))
    assert room.snapshot()['train']['x']==pytest.approx(14)
    assert other.snapshot()['train']['elapsed']==0
    assert Room('NO','ai','freight').snapshot()['train'] is None


def test_train_metadata_and_clock_reach_websocket_clients():
    with TestClient(app) as client:
        with patch('backend.main.secrets.choice',return_value='railway'),client.websocket_connect('/ws') as ws:
            ws.send_json(dict(mode='ai',quick=True))
            welcome=ws.receive_json();snapshot=ws.receive_json()
            assert welcome['arena']['train']==C
            assert snapshot['train']==train_pose(0,C)
            assert snapshot['map_id']=='railway' and len(snapshot['players'])==6
