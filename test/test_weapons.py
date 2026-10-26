import math
import pytest
from backend.game import Room
from backend.weapons import WEAPONS


def duel():
    r=Room('GUN','local','freight');p=r.add('Shooter',0);q=r.add('Target',1)
    r.state='PLAYING';r.timer=120
    p.x,p.y,p.yaw,p.pitch=2.5,1.5,0,0
    q.x,q.y=5.5,1.5
    p.cheats['recoil']=True
    p.hp=q.hp=100
    return r,p,q


@pytest.mark.parametrize('key',WEAPONS)
def test_server_owns_capacity_cadence_reload_and_round_reset(key):
    r,p,q=duel();r.equip_weapon(p,key);p.equip=p.cooldown=0
    capacity=WEAPONS[key]['capacity'];assert p.ammo==capacity
    r.shoot(p);assert p.ammo==capacity-1 and p.shots==1
    r.shoot(p);assert p.shots==1
    p.cooldown=0;p.ammo=0;r.shoot(p)
    assert p.reload==WEAPONS[key]['reload_time']
    q.hp=100;r.tick(p.reload/2);assert p.ammo==0
    r.tick(p.reload+.001);assert p.ammo==(1 if key=='shotgun' else capacity)
    r.new_round();assert p.weapon==key and p.ammo==capacity


def test_switch_preserves_each_magazine_and_cannot_reset_shotgun_cooldown():
    r,p,q=duel();r.equip_weapon(p,'shotgun');p.equip=p.cooldown=0
    r.shoot(p);remaining=p.cooldown
    r.equip_weapon(p,'pistol');assert p.ammo==12 and p.magazines['shotgun']==5
    assert p.cooldown==remaining
    r.equip_weapon(p,'rifle');assert p.weapon=='pistol'
    p.equip=0;r.equip_weapon(p,'shotgun');assert p.ammo==5 and p.cooldown==remaining


def test_cancelled_reload_never_grants_ammunition():
    r,p,q=duel();p.ammo=4;p.reload=.4
    r.equip_weapon(p,'pistol');assert p.reload==0
    p.equip=0;r.equip_weapon(p,'rifle');assert p.ammo==4


@pytest.mark.parametrize('bad',[None,'rocket',[],{},7])
def test_invalid_selection_cannot_crash_or_change_weapon(bad):
    r,p,q=duel();r.command(p,dict(type='weapon',weapon=bad,ammo=999,damage=999))
    assert p.weapon=='rifle' and p.ammo==30


def test_shotgun_close_range_is_lethal_but_long_range_falls_off():
    r,p,q=duel();p.weapon='shotgun';p.ammo=6;r.shoot(p)
    assert q.hp==0 and p.kills==1 and q.deaths==1 and p.hit==1
    r,p,q=duel();p.weapon='shotgun';q.x=23
    r.shoot(p);assert 0<q.hp<100
    q.hp=100;q.x=32;p.cooldown=0;r.shoot(p);assert q.hp==100


def test_slug_stops_at_nearest_enemy_and_do_not_hit_teammate():
    r,p,q=duel()
    # Add another enemy before entering PLAYING.
    r.state='LOBBY';far=r.add('Behind',1);ally=r.add('Ally',0);r.state='PLAYING'
    far.x,far.y=8,1.5;ally.x,ally.y=4,1.5;far.hp=ally.hp=100
    p.weapon='shotgun';r.shoot(p)
    assert q.hp==0 and far.hp==100 and ally.hp==100


@pytest.mark.parametrize('key',WEAPONS)
def test_walls_and_train_block_every_weapon(key):
    r,p,q=duel();p.weapon=key;p.x,p.y=9,6;q.x,q.y=17,6;r.shoot(p);assert q.hp==100
    r=Room('TRAIN','local','railway');p=r.add('Shooter',0);q=r.add('Target',1)
    r.state='PLAYING';r.train_time=3+44/5.6
    p.weapon=key;p.x,p.y,p.yaw,p.pitch=30,14.5,math.pi/2,0;q.x,q.y=30,20.5
    r.shoot(p);assert q.hp==150


def test_switch_authorization_and_snapshot():
    r,p,q=duel();p.bot=True;r.command(p,dict(type='weapon',weapon='pistol'));assert p.weapon=='rifle'
    p.bot=False;p.hp=0;r.command(p,dict(type='weapon',weapon='pistol'));assert p.weapon=='rifle'
    p.hp=100;r.command(p,dict(type='weapon',weapon='pistol'))
    snap=r.snapshot();assert snap['weapons']==WEAPONS and snap['players'][0]['weapon']=='pistol'


def test_aim_applies_to_new_weapons_without_bot_cheats():
    for key in ('shotgun','pistol'):
        r,p,q=duel();p.weapon=key;p.yaw=.7;p.pitch=.5;p.cheats['aim']=True
        r.shoot(p);assert p.yaw==0 and q.hp<100


@pytest.mark.parametrize('key',WEAPONS)
def test_reload_button_is_an_edge_not_an_expiring_input_pulse(key):
    r,p,q=duel();p.weapon=key;p.ammo=0
    r.command(p,dict(type='reload'))
    r.command(p,dict(type='input',reload=False))
    assert p.reload==WEAPONS[key]['reload_time']
    r.tick(WEAPONS[key]['reload_time']+.01)
    assert p.ammo==(1 if key=='shotgun' else WEAPONS[key]['capacity'])
