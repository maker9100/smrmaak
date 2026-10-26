import math
from backend.game import Room

def game(skin='scout'):
 r=Room('ACT','local','freight');p=r.add('P',0);q=r.add('Q',1);p.skin=skin;p.ready=q.ready=True;r.start();r.state='PLAYING';r.timer=120;p.x,p.y,p.yaw=5.5,1.5,0;q.x,q.y=12,1.5
 return r,p,q

def test_jump_role_heights_and_hold_does_not_repeat():
 heights=[]
 for skin in ['scout','glowsquid','guard']:
  r,p,q=game(skin);p.inp={'jump':True};p.stale=-100;highest=0
  for _ in range(100):r.tick(.01);highest=max(highest,p.z)
  heights.append(highest);assert p.z==0
 assert abs(heights[0]/heights[1]-1.2)<.015 and abs(heights[2]/heights[1]-.9)<.015

def test_crouch_and_forged_height():
 r,p,q=game();r.command(p,dict(type='input',crouch=True,z=999,vz=999));r.tick(.02)
 assert p.crouch and p.z==0

def test_headshot_rifle_double_damage_shotgun_excluded():
 for weapon,expected in [('rifle',50),('pistol',62),('shotgun',100)]:
  r,p,q=game();q.hp=300;p.weapon=weapon;p.ammo=5;p.cheats['recoil']=True;p.pitch=math.atan2(.22,q.x-p.x)
  r.shoot(p);assert q.hp==300-expected

def test_axe_hit_returns_but_ground_requires_pickup():
 r,p,q=game();p.weapon='axe';p.ammo=1;q.hp=300;r.shoot(p);assert p.magazines['axe']==0
 for _ in range(70):r.update_axes(.01)
 assert q.hp<300 and p.magazines['axe']==1 and not r.axes
 r,p,q=game();p.weapon='axe';p.ammo=1;q.x=50;r.shoot(p)
 for _ in range(200):r.update_axes(.01)
 assert r.axes and r.axes[0]['ground'] and not r.available(p,'axe')
 a=r.axes[0];p.x,p.y=a['x'],a['y'];r.update_axes(.01)
 assert not r.axes and r.available(p,'axe')

def test_empty_weapon_selection_blocked_and_infinite_does_not_duplicate_axe():
 r,p,q=game();p.magazines['pistol']=0;p.reserves['pistol']=0;r.equip_weapon(p,'pistol');assert p.weapon=='rifle'
 p.weapon='axe';p.ammo=1;p.cheats['ammo']=True;q.x=50;r.shoot(p)
 assert len(r.axes)==1 and not r.available(p,'axe')


def test_aim_accounts_for_jump_and_crouched_target():
 r,p,q=game();p.z=1;p.crouch=True;q.crouch=True;p.cheats['aim']=True
 r.shoot(p);assert q.hp==125
