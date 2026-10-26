import pytest
from backend.game import Room,wall


def room(key):
 r=Room('TEST','local',key);p=r.add('Blue',0);q=r.add('Red',1);r.state='PLAYING';r.timer=120
 p.hp=q.hp=100
 return r,p,q

@pytest.mark.parametrize('team',[0,1])
def test_crane_crushes_both_teams_and_logs_once(team):
 r,p,q=room('freight');victim=[p,q][team];other=[q,p][team]
 victim.x,victim.y=29,27;other.x,other.y=5,3
 r.train_time=8;r.update_mechanisms();assert victim.hp==100
 r.train_time=8.8;r.update_mechanisms();assert victim.hp==0 and victim.deaths==1
 assert r.log[-1]['cause']=='crane'
 r.train_time=9.1;r.update_mechanisms();assert victim.deaths==1
 assert wall(29,27,r.map)


def test_random_heat_is_floor_only_warns_and_resets():
 r,p,q=room('foundry');r.train_time=4;r.update_heat()
 assert len(r.heat_zones)==3
 zones=r.heat_zones
 assert all(z['start']==6 and z['end']==10 and not wall(z['x'],z['y'],r.map) for z in zones)
 p.x,p.y=zones[0]['x'],zones[0]['y']
 r.heat_hit(p,(p.x,p.y),4,5);assert p.hp==100
 r.heat_hit(p,(p.x,p.y),6,6.1);assert p.hp==75
 r.heat_hit(p,(p.x,p.y),6.1,6.2);assert p.hp==75
 for _ in range(3):p.heat_cooldown=0;r.heat_hit(p,(p.x,p.y),7,7.1)
 assert p.hp==0 and p.deaths==1 and r.log[-1]['cause']=='heat'
 assert r.snapshot()['heat_zones']==zones
 r.new_round();assert not r.heat_zones and p.hp==150


def test_heat_sweeps_crossing_and_does_not_hit_outside():
 r,p,q=room('foundry');r.heat_zones=[dict(x=8,y=8,radius=2.8,start=0,end=5)]
 p.x,p.y=13,8;r.heat_hit(p,(3,8),1,1.1);assert p.hp==75
 q.x,q.y=13,13;r.heat_hit(q,(3,13),1,1.1);assert q.hp==100


def test_other_maps_never_spawn_heat():
 for key in ['freight','plaza','glory','railway']:
  r,p,q=room(key);r.train_time=40;r.update_heat();assert not r.heat_zones
