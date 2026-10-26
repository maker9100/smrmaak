import math
import random
import pytest
from backend.arenas import ARENAS,PLAYER_RADIUS
from backend.game import Room,Player,wall,clear,walk


@pytest.mark.parametrize('key',list(ARENAS))
def test_exact_world_size_more_cover_and_six_spawn_bodies_are_clear(key):
    a=ARENAS[key];assert (a['width'],a['depth'],a['cell_size'])==(60,35,1)
    assert a['cover_count'] >= (13 if key=='plaza' else 17)
    for team in a['spawns']:
        for x,y in team:
            assert all(not wall(x+dx,y+dy,a['grid']) for dx in [-PLAYER_RADIUS,PLAYER_RADIUS] for dy in [-PLAYER_RADIUS,PLAYER_RADIUS])
    assert not wall(45.5,1.5,a['grid']) and wall(60,10,a['grid']) and wall(10,35,a['grid'])


def test_player_can_cross_the_old_world_boundary_without_changing_physical_speed():
    p=Player('walk','Walker',0,x=35,y=1.5)
    for _ in range(120):walk(p,1,0,1/60)
    assert p.x>53 and p.x<54
    assert clear(2.5,1.5,57.5,1.5)


@pytest.mark.parametrize('key',list(ARENAS))
def test_bots_use_multiple_behaviours_and_lanes_and_stay_out_of_walls(key):
    random.seed(714);r=Room('AI','ai',key);r.add('P').ready=True;r.start()
    for p in r.players.values():p.bot=True
    modes=set();styles=set();turn_samples=[];moved={p.id:0 for p in r.players.values()}
    previous={p.id:(p.x,p.y,p.yaw) for p in r.players.values()}
    for _ in range(1400):
        old_round=r.round;r.tick(.05)
        for p in r.players.values():
            if p.brain:modes.add(p.brain['mode']);styles.add(p.brain['style'])
            assert not any(p.cheats.values())
            assert all(not wall(p.x+dx,p.y+dy,r.map) for dx in [-.44,.44] for dy in [-.44,.44])
            old=previous[p.id]
            if old_round==r.round:
                moved[p.id]+=math.hypot(p.x-old[0],p.y-old[1])
                if p.hp>0:turn_samples.append(abs((p.yaw-old[2]+math.pi)%(2*math.pi)-math.pi))
            previous[p.id]=(p.x,p.y,p.yaw)
        if r.state=='MATCH_END':break
    assert {'flank','advance'}<=modes and len(modes)>=5,modes
    assert styles=={'flank','advance','roam'}
    assert min(moved.values())>5
    assert max(turn_samples)<=2.8*.05+.00001


def hidden_scenario(enemy):
    r=Room('H','local');p=r.add('Bot',0,True);q=r.add('Enemy',1)
    r.state='PLAYING';r.timer=120;p.x,p.y,p.yaw=5.5,17.5,0;q.x,q.y=enemy
    assert not r.sight(p.x,p.y,q.x,q.y)
    random.seed(81);r.ai(p,.05)
    return p


def test_hidden_enemy_position_does_not_change_a_bots_patrol_goal():
    a=hidden_scenario((40.5,17.5));b=hidden_scenario((45.5,19.5))
    assert a.brain['memory'] is None and b.brain['memory'] is None
    assert a.brain['goal']==b.brain['goal'] and a.route==b.route
    assert not a.inp['fire'] and not b.inp['fire']


def test_bot_searches_the_last_seen_position_instead_of_tracking_through_cover():
    random.seed(3);r=Room('M','local');p=r.add('Bot',0,True);q=r.add('Enemy',1)
    r.state='PLAYING';r.timer=120;p.x,p.y,p.yaw=5.5,17.5,0;q.x,q.y=9.5,17.5
    r.ai(p,.05);memory=p.brain['memory'];assert memory==(9.5,17.5)
    q.x,q.y=40.5,17.5;assert not r.sight(p.x,p.y,q.x,q.y)
    r.ai(p,.05)
    assert p.brain['memory']==memory and p.brain['memory_ttl']<6 and not p.inp['fire']


def test_bots_move_away_from_the_live_railway_warning():
    random.seed(91);r=Room('T','local','railway');p=r.add('Bot',0,True);r.add('Other',1)
    r.state='PLAYING';r.timer=120;p.x,p.y=30,17.5
    for _ in range(45):r.ai(p,.05)
    assert abs(p.y-17.5)>2.44 and not any(p.cheats.values())


def test_burst_fire_has_pauses_without_granting_any_cheats():
    random.seed(10);r=Room('B','local');p=r.add('Bot',0,True);q=r.add('Target',1)
    r.state='PLAYING';r.timer=120;p.x,p.y,p.yaw=5.5,1.5,0;q.x,q.y=10.5,1.5
    seen=[]
    for _ in range(120):
        r.ai(p,.05)
        if p.brain['target'] and p.reaction>1:seen.append(p.inp['fire'])
    assert True in seen and False in seen
    assert not any(p.cheats.values())
