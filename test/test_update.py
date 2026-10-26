import pytest
from backend.game import Room,wall
from backend.weapons import WEAPONS
from test_weapons import duel

@pytest.mark.parametrize('key',['rifle','pistol','shotgun'])
def test_finite_reserve_reload_and_no_ammo_forgery(key):
 r,p,q=duel();p.weapon=key;p.ammo=0;p.reserves[key]=2
 r.command(p,dict(type='reload',ammo=999,reserves={key:999}))
 for _ in range(240):r.tick(1/60)
 assert p.ammo==2 and p.reserves[key]==0 and p.reload==0
 p.ammo=0;r.reload_weapon(p);assert p.reload==0
 r.shoot(p);assert p.shots==0
 r.new_round();assert p.reserves[key]==WEAPONS[key]['reserve']

def test_shotgun_interrupts_only_after_round_inserted_and_obeys_pump():
 r,p,q=duel();p.weapon='shotgun';p.ammo=0;r.reload_weapon(p)
 r.shoot(p);assert p.reload>0 and p.shots==0
 for _ in range(43):r.tick(1/60)
 assert p.ammo==1 and p.reload>0 and p.reserves['shotgun']==35
 q.x=35;r.shoot(p);assert p.shots==1 and p.reload==0 and p.ammo==0
 p.ammo=2
 for _ in range(59):r.tick(1/60)
 r.shoot(p);assert p.shots==1
 for _ in range(2):r.tick(1/60)
 r.shoot(p);assert p.shots==2


def test_clock_damage_cooldown_knockout_and_snapshot_time():
 r=Room('CLOCK','local','plaza');p=r.add('p');q=r.add('q',1);r.state='PLAYING';r.timer=120
 p.x,p.y=37,17.5;q.x,q.y=3,3;p.hp=100
 assert not r.clock_hit(p,(37,17.5),0,.016);assert p.hp==65
 r.clock_hit(p,(37,17.5),0,.016);assert p.hp==65
 p.hazard_cooldown=0;r.clock_hit(p,(37,17.5),0,.016);assert p.hp==30
 p.hazard_cooldown=0;assert r.clock_hit(p,(37,17.5),0,.016);assert p.hp==0 and p.deaths==1
 assert r.snapshot()['log'][-1]['cause']=='clock'

def test_ai_selects_close_weapon_without_cheats():
 r,p,q=duel();p.bot=True;p.cheats=dict.fromkeys(p.cheats,False);q.x=7
 r.ai(p,.05);assert p.weapon=='shotgun' and not any(p.cheats.values())
