import copy
import json
import math
import shutil
import subprocess
from pathlib import Path
from unittest.mock import patch
import pytest
from backend.game import Room
from backend.projectiles import advance, can_stand, world_geometry, sweep


def duel(map_id='freight'):
    r=Room('080','local',map_id);p=r.add('P');q=r.add('Q',1)
    p.skin='guard';p.ready=q.ready=True;r.start();r.state='PLAYING';r.timer=120
    p.x,p.y,p.yaw=5.5,1.5,0;q.x,q.y=54.5,25.5
    return r,p,q


def test_axe_over_cover_lands_on_reachable_floor_and_stays_unavailable_until_pickup():
    r,p,q=duel();p.x,p.y,p.pitch,p.weapon,p.ammo=27,6.5,.4,'axe',1;r.shoot(p)
    for _ in range(400):r.update_axes(.01)
    a=r.axes[0];assert a['ground'] and can_stand(a['x'],a['y'],r.arena['grid'],world_geometry(r))
    assert not r.available(p,'axe')
    p.x,p.y=a['x'],a['y'];r.update_axes(.01)
    assert r.available(p,'axe') and not r.axes


def test_grenade_bounces_on_cover_top_and_never_enters_its_solid_volume():
    r,p,q=duel();p.x,p.y,p.pitch,p.weapon,p.ammo=32,6.5,.4,'grenade',1;r.shoot(p)
    top_seen=False
    for _ in range(290):
        r.update_grenades(.01)
        for g in r.grenades:
            assert not r.projectile_blocked(g['x'],g['y'],g['z'])
            top_seen |= 45<g['x']<50 and 5<g['y']<8 and g['z']>=2.72
    assert top_seen


def test_swept_collision_catches_thin_obstacle_even_at_high_speed():
    hit=sweep([0,0,1],[20,0,1],[{'bounds':[10,-1,0,10.05,1,2.6],'kind':'world'}],.08)
    assert hit and hit['point'][0]==pytest.approx(9.92) and hit['normal']==[-1,0,0]


def test_ai_aims_at_airborne_and_crouched_body_without_cheats():
    from backend import ai
    r,p,q=duel();p.bot=True;q.x,q.y,q.z=17.5,1.5,1.32;q.crouch=True
    with patch.object(ai,'follow',lambda *args:False):
        for _ in range(30):r.ai(p,.05)
    wanted=math.atan2(q.z+.78-1.5,12)
    assert p.pitch==pytest.approx(wanted) and p.pitch>0 and not any(p.cheats.values())
    p.equip=p.cooldown=p.reload=p.kick=0;p.weapon='rifle';p.ammo=30
    with patch('backend.game.random.uniform',lambda a,b:0):r.shoot(p)
    assert q.hp<150


def hold(r,p):
    p.weapon='grenade';p.ammo=1;p.equip=p.cooldown=p.reload=0;p.inp={'fire':True};p.stale=-100
    assert r.prime_grenade(p)


def test_grenade_detonates_in_hand_at_three_seconds_and_consumes_one_only():
    r,p,q=duel();hold(r,p)
    for _ in range(299):r.tick(.01)
    assert p.cooking and p.hp==300 and not r.explosions and p.ammo==0
    r.tick(.011)
    assert not p.cooking and p.hp==140 and len(r.explosions)==1 and not r.grenades
    assert p.reserves['grenade']==3 and p.shots==1
    for _ in range(120):r.tick(.01)
    assert not p.cooking and p.shots==1  # requires a new press, not a stuck held key


def test_releasing_cooked_grenade_keeps_remaining_fuse():
    r,p,q=duel();hold(r,p)
    for _ in range(100):r.tick(.01)
    p.inp={'fire':False};r.tick(.01)
    assert not p.cooking and len(r.grenades)==1
    assert r.grenades[0]['fuse']==pytest.approx(1.99)
    assert p.shots==1 and p.ammo==0 and p.reserves['grenade']==3


def test_switching_weapons_drops_armed_grenade_and_cannot_reset_fuse():
    r,p,q=duel();hold(r,p);p.cook_time=2.25
    r.equip_weapon(p,'rifle')
    assert p.weapon=='rifle' and not p.cooking and len(r.grenades)==1
    g=r.grenades[0];assert g['fuse']==pytest.approx(.75) and g['vx']==g['vy']==0
    assert p.magazines['grenade']==0 and p.reserves['grenade']==3


@pytest.mark.parametrize('cause',['weapon','hazard','disconnect'])
def test_death_or_disconnect_drops_live_grenade_once(cause):
    r,p,q=duel();hold(r,p);p.cook_time=1.5
    if cause=='weapon':r.weapon_damage(q,p,1000,'rifle')
    elif cause=='hazard':r.environment_damage(p,1000,'기차','train')
    else:r.remove(p.id)
    assert not p.cooking and len(r.grenades)==1 and r.grenades[0]['fuse']==pytest.approx(1.5)
    assert p.magazines['grenade']==0


def test_input_timeout_releases_instead_of_defusing_and_forged_timer_is_ignored():
    r,p,q=duel();hold(r,p);p.cook_time=2
    r.command(p,{'type':'input','fire':True,'cook_time':-999,'cooking':False,'fuse':99})
    assert p.cook_time==2 and p.cooking
    r.tick(.41)
    assert not p.cooking and r.grenades[0]['fuse']==pytest.approx(.59)


def test_round_reset_clears_armed_grenades_and_restores_inventory():
    r,p,q=duel();hold(r,p);r.new_round()
    assert not p.cooking and p.cook_time==0 and not p.cook_blocked and p.magazines['grenade']==1
    assert not r.grenades and not r.explosions


def test_explosion_casualty_keeps_their_dropped_armed_grenade_in_the_room():
    r,p,q=duel();hold(r,p);p.cook_time=1;p.hp=1
    r.throw_grenade(q);r.grenades[-1].update(x=p.x,y=p.y,z=.9,vx=0,vy=0,vz=0,fuse=.01)
    r.update_grenades(.02)
    assert p.hp==0 and len(r.grenades)==1
    assert r.grenades[0]['owner']==p.id and r.grenades[0]['fuse']==pytest.approx(2)
    r.update_grenades(2.01)
    assert not r.grenades and len(r.explosions)==2


@pytest.mark.parametrize('kind',['axe','grenade'])
@pytest.mark.parametrize('map_id',['freight','plaza'])
def test_browser_preview_physics_matches_server_advance(kind,map_id):
    node=shutil.which('node')
    if not node:pytest.skip('Node is only needed to cross-check client preview math')
    r,p,q=duel(map_id);p.x,p.y,p.pitch=32,6.5,.4
    a=dict(x=p.x,y=p.y,z=1.5 if kind=='axe' else 1.35,vx=(17 if kind=='axe' else 13)*math.cos(p.pitch),vy=0,vz=(2+17*math.sin(p.pitch)) if kind=='axe' else 4.2+8*math.sin(p.pitch),ground=False)
    boxes=world_geometry(r);data=dict(a=copy.deepcopy(a),boxes=boxes,grid=r.arena['grid'],kind=kind)
    for _ in range(240):advance(a,.01,kind,boxes,r.arena['grid'])
    script="import fs from 'node:fs';const {advance}=await import('data:text/javascript;base64,'+fs.readFileSync('frontend/throw-physics.js').toString('base64'));const d=JSON.parse(fs.readFileSync(0,'utf8'));for(let i=0;i<240;i++)advance(d.a,.01,d.kind,d.boxes,d.grid);process.stdout.write(JSON.stringify(d.a));"
    result=subprocess.run([node,'--input-type=module','-e',script],input=json.dumps(data),text=True,capture_output=True,cwd=Path(__file__).resolve().parents[1],check=True)
    predicted=json.loads(result.stdout)
    for key in ('x','y','z','vx','vy','vz'):assert predicted[key]==pytest.approx(a[key],abs=1e-7)
    assert predicted['ground']==a['ground']
