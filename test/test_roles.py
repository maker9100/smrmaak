"""Role balance, passive authority, mobile prediction and per-round resets."""
import math
from unittest.mock import patch
import pytest
from fastapi.testclient import TestClient
from backend.roles import ROLES,BASE_HP
from backend.game import Room,Player,walk
from backend.main import app


def match(skin='scout',map_id='foundry',mode='local'):
 r=Room('ROLE','local',map_id);p=r.add('Player',0);q=r.add('Other',1)
 r.command(p,dict(type='custom',skin=skin));p.ready=q.ready=True;r.start();r.state='PLAYING';r.timer=120
 p.x,p.y=5,3;q.x,q.y=55,3
 return r,p,q

@pytest.mark.parametrize('skin,hp,speed',[('scout',150,1.2),('guard',300,.75),('glowsquid',200,1.15)])
def test_role_health_round_reset_and_serialized_stats(skin,hp,speed):
 assert BASE_HP==200
 r,p,q=match(skin);assert p.hp==hp
 p.hp=1;r.new_round();assert p.hp==hp
 s=r.snapshot()['players'][0];assert s['skin']==skin and s['max_hp']==hp and s['speed_multiplier']==speed
 assert s['role_name']==ROLES[skin]['name'] and not any(s['cheats'].values())

@pytest.mark.parametrize('skin',ROLES)
@pytest.mark.parametrize('aiming',[False,True])
def test_analog_speed_multipliers_and_diagonal_normalization(skin,aiming):
 grid=['0'*200]*200;p=Player('P','Mover',0,skin=skin,x=20,y=20)
 for _ in range(120):walk(p,1,0,1/60,aiming,grid)
 expected=(5.7 if aiming else 8)*ROLES[skin]['speed']
 assert math.hypot(p.vx,p.vy)==pytest.approx(expected,abs=.001)
 p=Player('D','Diagonal',0,skin=skin,x=20,y=20)
 for _ in range(120):walk(p,1,1,1/60,aiming,grid)
 assert math.hypot(p.vx,p.vy)==pytest.approx(expected,abs=.001)
 before=(p.x,p.y)
 for _ in range(60):walk(p,0,0,1/60,aiming,grid)
 assert math.hypot(p.vx,p.vy)<.001 and math.dist(before,(p.x,p.y))<.5

@pytest.mark.parametrize('skin',ROLES)
@pytest.mark.parametrize('bot',[False,True])
def test_foundry_heat_immunity_only_for_glowsquid(skin,bot):
 r,p,q=match(skin);p.bot=bot;hp=p.hp
 r.heat_zones=[dict(x=p.x,y=p.y,radius=2.8,start=0,end=10)]
 r.heat_hit(p,(p.x,p.y),0,.1)
 assert p.hp==hp-(0 if skin=='glowsquid' else 25)
 assert not any(p.cheats.values())
 r.environment_damage(p,35,'시침','clock');assert p.hp==hp-(35 if skin=='glowsquid' else 60)

@pytest.mark.parametrize('skin',ROLES)
def test_crane_is_still_lethal_for_all_health_values(skin):
 r,p,q=match(skin,'freight');p.x,p.y=29,27
 r.train_time=8;r.update_mechanisms();r.train_time=8.8;r.update_mechanisms()
 assert p.hp==0 and p.deaths==1 and r.log[-1]['cause']=='crane'
 r.train_time=9.1;r.update_mechanisms();assert p.deaths==1

@pytest.mark.parametrize('skin',ROLES)
def test_train_is_still_lethal_for_all_classes(skin):
 r,p,q=match(skin,'railway');p.x,p.y=30,17.5;r.train_time=3+44/5.6;r.tick(1/60)
 assert p.hp==0 and p.deaths==1 and r.log[-1]['cause']=='train'

@pytest.mark.parametrize('skin',ROLES)
def test_glowsquid_does_not_resist_bullets_or_allow_midmatch_class_change(skin):
 r,p,q=match(skin);p.x,p.y=2.5,1.5;q.x,q.y,q.yaw=5.5,1.5,math.pi
 hp=p.hp;q.cheats['recoil']=True;r.shoot(q);assert p.hp==hp-25
 r.command(p,dict(type='custom',skin='guard',hp=999,speed_multiplier=99));assert p.skin==skin and p.hp==hp-25
 r.command(p,dict(type='input',f=0,hp=999,skin='guard'));assert p.skin==skin and p.hp==hp-25

@pytest.mark.parametrize('invalid',['rocket',None,{},[],7])
def test_invalid_class_is_ignored_in_lobby(invalid):
 r=Room('SAFE','local');p=r.add('P');r.command(p,dict(type='custom',skin=invalid));assert p.skin=='scout' and p.hp==150

@pytest.mark.parametrize('skin',ROLES)
def test_ai_fill_has_all_three_classes_and_no_cheats(skin):
 r=Room('AI','ai');p=r.add('P');r.command(p,dict(type='custom',skin=skin));p.ready=True;r.start()
 for team in (0,1):assert {p.skin for p in r.players.values() if p.team==team}==set(ROLES)
 assert all(p.hp==ROLES[p.skin]['hp'] and not any(p.cheats.values()) for p in r.players.values())


def test_role_metadata_and_local_changes_are_websocket_authoritative():
 with TestClient(app) as client:
  assert client.get('/roles').json()==dict(base_hp=200,roles=ROLES)
  with client.websocket_connect('/ws') as ws:
   ws.send_json(dict(mode='local',skins=['guard']))
   welcome=ws.receive_json();assert welcome['version']=='0.6.5'
   state=ws.receive_json();p=state['players'][0];assert p['skin']=='guard' and p['hp']==p['max_hp']==300
   ws.send_json(dict(type='custom',skin='glowsquid',hp=999))
   for _ in range(12):
    state=ws.receive_json();p=state['players'][0]
    if p['skin']=='glowsquid':break
   assert p['skin']=='glowsquid' and p['hp']==200 and p['speed_multiplier']==1.15
