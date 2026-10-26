import math
import pytest
from backend.arenas import ARENAS
from backend.game import Room
from backend.weapons import WEAPONS
from backend.combat import bullet_impact
from backend.hazards import train_hits

def duel(map_id='foundry'):
 r=Room('NEW','local',map_id);p=r.add('Shooter',0);q=r.add('Target',1)
 p.ready=q.ready=True;r.start();r.state='PLAYING';r.timer=120
 p.x,p.y,p.yaw=2.5,1.5,0;q.x,q.y=5.5,1.5;p.cheats['recoil']=True
 return r,p,q

def test_weapon_slots_and_grenade_stock():
 assert [(k,w['slot']) for k,w in WEAPONS.items()]==[('axe',1),('pistol',2),('rifle',3),('shotgun',4),('grenade',5)]
 r,p,q=duel();assert p.magazines['grenade']==1 and p.reserves['grenade']==3

@pytest.mark.parametrize('weapon',['rifle','pistol','shotgun','grenade'])
def test_infinite_empty_toggle_cadence_and_finite_return(weapon):
 r,p,q=duel();p.weapon=weapon;p.ammo=0;p.reserves[weapon]=0;p.reload=.2
 r.command(p,dict(type='toggle',key='ammo'));assert p.reload==0
 r.shoot(p);assert p.shots==1 and p.ammo==0 and p.reserves[weapon]==0
 r.shoot(p);assert p.shots==1
 p.cooldown=0;r.command(p,dict(type='toggle',key='ammo'));r.shoot(p);assert p.shots==1
 p.bot=True;r.command(p,dict(type='toggle',key='ammo'));assert not p.cheats['ammo']

def test_axe_range_cadence_walls_and_no_ammo_or_bullet_holes():
 r,p,q=duel();p.weapon='axe';p.ammo=0;q.x=4.4
 r.shoot(p);assert q.hp==60 and p.shots==1 and p.ammo==0 and not r.impacts
 r.shoot(p);assert q.hp==60
 p.cooldown=0;q.x=5;r.shoot(p);assert q.hp==60
 p.cooldown=0;p.x,p.y=9.5,6;q.x,q.y=10.6,6;r.shoot(p);assert q.hp==60

def test_grenade_throw_arc_reload_and_explosion_log():
 r,p,q=duel();p.weapon='grenade';p.ammo=1;p.pitch=.3;r.shoot(p)
 assert p.ammo==0 and len(r.grenades)==1 and p.reload==.75
 g=r.grenades[0];start=g['x'];r.update_grenades(.2);assert g['x']>start and g['z']>1.35
 q.x,q.y,q.hp=8,1.5,20;g.update(x=5.5,y=1.5,z=.12,vx=0,vy=0,vz=0,fuse=.01)
 r.update_grenades(.02);assert not r.grenades and r.explosions and q.hp==0
 assert p.kills==1 and q.deaths==1 and r.log[-1]['weapon']=='grenade'
 assert q.blood_seq==1

def test_grenade_wall_cover_and_no_friendly_fire():
 r,p,q=duel();r.state='LOBBY';ally=r.add('Ally',0);r.state='PLAYING'
 ally.x,ally.y=8,1.5;p.weapon='grenade';p.ammo=1;r.shoot(p)
 r.grenades[0].update(x=5.5,y=1.5,z=.12,vx=0,vy=0,vz=0,fuse=.01)
 hp=ally.hp;r.update_grenades(.02);assert ally.hp==hp and p.hp<150
 q.x,q.y=14.5,6;r.throw_grenade(p);r.grenades[-1].update(x=9,y=6,z=.12,vx=0,vy=0,vz=0,fuse=.01)
 hp=q.hp;r.update_grenades(.02);assert q.hp==hp

def test_shield_grant_priority_integer_regen_reentry_and_reset():
 r,p,q=duel('glory');p.x,p.y=24,17.5;r.update_shield(p,.1);assert p.shield==100
 r.apply_damage(p,40,True);assert p.shield==60 and p.hp==150 and p.blood_seq==0 and p.shield_seq==1
 p.x=5;r.update_shield(p,4);assert p.shield==60
 p.x=24;r.update_shield(p,.5);assert p.shield==60
 for _ in range(30):r.update_shield(p,1/60)
 assert p.shield==60
 for _ in range(60):r.update_shield(p,1/60)
 assert p.shield==80 and isinstance(p.shield,int)
 r.apply_damage(p,100,True);assert p.shield==0 and p.hp==130 and p.blood_seq==1
 r.new_round();assert p.hp==150 and p.shield==0 and not p.shield_unlocked

def test_crush_bypasses_full_shield_guard_once():
 r,p,q=duel('freight');p.hp=300;p.shield=100;p.x,p.y=29,27
 r.train_time=8;r.update_mechanisms();r.train_time=8.8;r.update_mechanisms()
 assert p.hp==0 and p.shield==0 and p.deaths==1
 r.update_mechanisms();assert p.deaths==1

def test_impact_normal_world_wall_and_train_rear_car():
 r,p,q=duel();p.x,p.y,p.yaw=9,6,0
 r.shoot(p);assert len(r.impacts)==1
 e=r.impacts[0];assert e['surface']=='world' and e['nx']==-1 and e['x']==10
 r,p,q=duel('railway');r.train_time=3+44/5.6;p.x,p.y,p.yaw=6,14,math.pi/2
 r.shoot(p);assert r.impacts[-1]['surface']=='train'
 assert train_hits(r.train_time,r.train_time+.01,(6,17.5),(6,17.5),r.arena['train'])
 assert not r.sight(6,14,6,21)

def test_impact_history_bounded_and_corpses_retained_until_round_reset():
 r,p,q=duel();r.state='LOBBY';extra=r.add('Extra',1);r.state='PLAYING';extra.x,extra.y=55,3
 for i in range(160):r.add_impact(dict(x=i,y=1,z=1))
 assert len(r.impacts)==128
 p.weapon='shotgun';q.hp=90;r.shoot(p);assert q.hp==0 and q.id in r.players
 position=(q.x,q.y);r.tick(.2);assert (q.x,q.y)==position and q.hp==0 and r.state=='PLAYING'
 r.new_round();assert q.hp==150 and not r.impacts and not r.grenades

def test_only_five_current_maps_and_glory_metadata():
 assert len(ARENAS)==5 and 'observatory' not in ARENAS and 'glory' in ARENAS
 assert ARENAS['glory']['shield']['capacity']==100
 assert len(ARENAS['railway']['train']['cars'])==3

def test_grenade_four_total_then_empty_and_client_cannot_refill():
 r,p,q=duel();p.weapon='grenade';p.ammo=1;q.x,q.y=55,1.5
 for n in range(4):
  p.cooldown=0;r.shoot(p);assert p.shots==n+1 and p.ammo==0
  for g in r.grenades:g.update(x=45,y=1.5,z=.12,vx=0,vy=0,vz=0)
  if n<3:
   r.tick(.76);assert p.ammo==1 and p.reserves['grenade']==2-n
 assert p.reserves['grenade']==0 and p.reload==0
 p.cooldown=0;r.command(p,dict(type='input',ammo=999,reserves={'grenade':999}));r.shoot(p);assert p.shots==4

def test_ai_reloads_reserve_grenades_for_later_throws_without_cheats(monkeypatch):
 # Keep the range fixed to isolate weapon choice/reload from route selection.
 from backend import ai
 monkeypatch.setattr(ai,'follow',lambda *args:False)
 r,p,q=duel('freight');p.bot=True;p.cheats={k:False for k in p.cheats};p.x=5.5;q.x=19.5;p.hp=q.hp=10000;r.train_time=9
 thrown=set()
 for _ in range(600):
  r.tick(.05)
  thrown.update(g['id'] for g in r.grenades if g['owner']==p.id)
 assert len(thrown)>=2 and p.reserves['grenade']<=2
 assert not any(p.cheats.values())

def test_ai_can_choose_and_swing_ammo_free_axe(monkeypatch):
 from backend import ai
 monkeypatch.setattr(ai,'follow',lambda *args:False)
 r,p,q=duel('freight');p.bot=True;p.cheats={k:False for k in p.cheats};q.x=4;q.hp=1000
 for _ in range(50):r.tick(.05)
 assert p.weapon=='axe' and q.hp<1000 and p.shots>0 and p.ammo==0
 assert not any(p.cheats.values())
