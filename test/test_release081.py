import math
import pytest
from fastapi.testclient import TestClient
from backend.main import app
from backend.game import Room
from backend.weapons import WEAPONS, GRENADE_TYPES, THROW_TYPES


def duel(grenade='grenade',throw='axe'):
    r=Room('081','local','freight');p=r.add('P');q=r.add('Q',1)
    r.configure_loadout(p,dict(grenade_choice=grenade,throw_choice=throw))
    p.skin='guard';p.ready=q.ready=True;r.start();r.state='PLAYING';r.timer=120
    p.x,p.y,p.yaw=2.5,1.5,0;q.x,q.y=54.5,25.5
    return r,p,q

@pytest.mark.parametrize('grenade',GRENADE_TYPES)
@pytest.mark.parametrize('throw',THROW_TYPES)
def test_selected_equipment_is_the_only_equippable_utility(grenade,throw):
    r,p,q=duel(grenade,throw)
    for key in GRENADE_TYPES+THROW_TYPES:
        assert r.available(p,key)==(key in (grenade,throw))
        p.equip=0;r.equip_weapon(p,key)
        if key in (grenade,throw):assert p.weapon==key
        else:assert p.weapon!=key
    r.command(p,dict(type='custom',grenade_choice='molotov',throw_choice='shuriken'))
    assert (p.grenade_choice,p.throw_choice)==(grenade,throw)

@pytest.mark.parametrize('key,capacity,reserve',[('dagger',1,4),('shuriken',5,15)])
def test_new_blade_stock_cadence_and_reload(key,capacity,reserve):
    r,p,q=duel(throw=key);r.equip_weapon(p,key);p.equip=p.cooldown=0
    for i in range(capacity):
        p.cooldown=0;r.shoot(p)
    assert p.ammo==0 and p.reserves[key]==reserve and len(r.axes)==capacity
    p.cooldown=0;r.shoot(p);assert len(r.axes)==capacity
    r.tick(WEAPONS[key]['reload_time']+.01)
    assert p.ammo==capacity and p.reserves[key]==reserve-capacity


def test_knife_is_infinite_melee_respects_range_and_cadence():
    r,p,q=duel();r.equip_weapon(p,'knife');p.equip=p.cooldown=0;q.x,q.y=4,1.5
    r.shoot(p);assert q.hp==80 and p.ammo==1 and not r.axes and not r.impacts
    r.shoot(p);assert q.hp==80
    p.cooldown=0;q.x=6;r.shoot(p);assert q.hp==80


def test_empty_weapons_fall_back_to_knife_and_unselected_cheats_cannot_equip():
    r,p,q=duel(grenade='flashbang',throw='dagger')
    for key in WEAPONS:p.magazines[key]=p.reserves[key]=0
    p.ammo=0;r.auto_weapon(p);assert p.weapon=='knife'
    p.cheats['ammo']=True;assert not r.available(p,'grenade') and not r.available(p,'axe')


def test_flash_affects_visible_target_and_ai_without_health_damage():
    r,p,q=duel(grenade='flashbang');q.x,q.y,q.yaw=5.5,1.5,math.pi
    r.explode_grenade(dict(kind='flashbang',owner=p.id,team=p.team,x=3.5,y=1.5,z=.9))
    assert q.hp==150 and q.flash_time>2 and q.flash_strength>.5
    q.bot=True;r.ai(q,.1);assert not q.inp['fire'] and q.shots==0
    q.bot=False;before=q.flash_time;r.tick(.1);assert q.flash_time<before


def test_flash_is_blocked_by_cover():
    r,p,q=duel(grenade='flashbang');p.x,p.y=9,6;q.x,q.y=17,6
    r.explode_grenade(dict(kind='flashbang',owner=p.id,team=p.team,x=9,y=6,z=.9))
    assert q.flash_time==0


def test_molotov_breaks_on_ground_and_fire_damages_then_expires():
    r,p,q=duel(grenade='molotov');p.weapon='molotov';p.ammo=1;r.shoot(p)
    for _ in range(200):
        r.train_time+=.01;r.update_grenades(.01)
        if r.fires:break
    assert r.fires and not r.grenades
    f=r.fires[0];q.x,q.y=f['x'],f['y'];before=q.hp;r.update_fires(.01)
    assert q.hp==before-20
    r.update_fires(.1);assert q.hp==before-20
    r.train_time=f['end']+.01;r.update_fires(.5);assert not r.fires

@pytest.mark.parametrize('key',['flashbang','molotov'])
def test_utility_keeps_three_second_pin_and_drops_original_kind(key):
    r,p,q=duel(grenade=key);p.weapon=key;p.ammo=1;p.inp={'fire':True};assert r.prime_grenade(p)
    p.cook_time=2.4;r.equip_weapon(p,'pistol')
    assert not p.cooking and r.grenades[0]['kind']==key and r.grenades[0]['fuse']==pytest.approx(.6)


def test_equipment_survives_round_reset_and_is_independent_per_split_player():
    with TestClient(app) as client:
        with client.websocket_connect('/ws') as ws:
            ws.send_json(dict(mode='local',split=True,equipment=[{'grenade_choice':'flashbang','throw_choice':'shuriken'},{'grenade_choice':'molotov','throw_choice':'dagger'}]))
            welcome=ws.receive_json();assert welcome['version']=='0.8.1'
            state=ws.receive_json();players=[next(p for p in state['players'] if p['id']==id) for id in welcome['ids']]
            assert [(p['grenade_choice'],p['throw_choice']) for p in players]==[('flashbang','shuriken'),('molotov','dagger')]
    r,p,q=duel('molotov','dagger');r.new_round();assert p.grenade_choice=='molotov' and p.throw_choice=='dagger'
    assert p.magazines['dagger']==1 and p.reserves['dagger']==4


def test_flash_strength_resets_before_a_later_weaker_flash():
    r,p,q=duel(grenade='flashbang');q.x,q.y,q.yaw=5.5,1.5,math.pi
    g=dict(kind='flashbang',owner=p.id,team=p.team,x=3.5,y=1.5,z=.9)
    r.explode_grenade(g);assert q.flash_strength>.5
    r.tick(5);assert q.flash_time==0 and q.flash_strength==0
    q.x=14.5;r.explode_grenade(g);assert 0<q.flash_strength<.3
