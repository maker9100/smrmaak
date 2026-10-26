import math

import pytest
from backend.game import CHEATS, Room


def duel(arena='freight'):
    room=Room('AIM','local',arena)
    p=room.add('Shooter',0);q=room.add('Target',1)
    room.state='PLAYING';room.timer=120
    p.x,p.y,p.yaw,p.pitch=2.5,1.5,.8,.7
    q.x,q.y=6.5,1.5
    p.hp=q.hp=100
    return room,p,q


@pytest.mark.parametrize('action',['tap','hold','ads'])
def test_aim_corrects_horizontal_and_vertical_angle_without_requiring_ads_for_fire(action):
    room,p,q=duel();room.command(p,dict(type='toggle',key='aim'))
    if action=='tap':
        room.command(p,dict(type='shoot',serial=1))
        # An entire tap can arrive between ticks. Release must not erase it.
        room.command(p,dict(type='input',aim=False,fire=False,yaw=.8,pitch=.7))
    else:room.command(p,dict(type='input',aim=action=='ads',fire=action=='hold',yaw=.8,pitch=.7))
    room.tick(1/60)
    assert p.yaw==pytest.approx(0) and p.pitch==pytest.approx(math.atan2(-.3,4))
    assert q.hp==(100 if action=='ads' else 75)
    assert p.ammo==(30 if action=='ads' else 29)


def test_aim_toggle_off_stops_snapping_and_off_target_taps_miss():
    room,p,q=duel();room.command(p,dict(type='toggle',key='aim'))
    room.command(p,dict(type='toggle',key='aim'))
    room.command(p,dict(type='shoot',serial=1));room.tick(1/60)
    assert q.hp==100 and p.yaw==pytest.approx(.8)


def test_aim_works_for_a_shot_queued_while_the_weapon_is_on_cooldown():
    room,p,q=duel();p.cheats['aim']=True;p.cooldown=.05
    room.command(p,dict(type='shoot',serial=1))
    for _ in range(5):
        # Fresh look inputs cannot cancel authoritative aim immediately before shooting.
        room.command(p,dict(type='input',yaw=.8,pitch=.7,aim=False,fire=False))
        room.tick(1/60)
    assert q.hp==75 and p.shots==1 and p.ammo==29


@pytest.mark.parametrize('kind',['wall','train','behind','dead','teammate','bot'])
def test_aim_does_not_lock_invalid_or_occluded_targets(kind):
    room,p,q=duel('railway' if kind=='train' else 'freight');p.cheats['aim']=True
    p.pitch=0
    if kind=='wall':p.x,p.y,p.yaw=9.5,6.5,.3;q.x,q.y=15.5,6.5
    elif kind=='train':p.x,p.y,p.yaw=30,14.5,math.pi/2+.3;q.x,q.y=30,20.5;room.train_time=3+44/5.6
    elif kind=='behind':p.yaw=math.pi
    elif kind=='dead':q.hp=0
    elif kind=='teammate':q.team=p.team
    elif kind=='bot':p.bot=True
    before=(p.yaw,p.pitch)
    room.assist_aim(p)
    assert (p.yaw,p.pitch)==before


def test_centered_enemy_is_preferred_and_aim_can_reacquire_after_death():
    room,p,q=duel();p.cheats['aim']=True;p.yaw=0
    # Adding players is correctly limited to lobby; assemble this third slot there.
    room.state='LOBBY';other=room.add('Other',1);room.state='PLAYING'
    other.x,other.y=5.5,2.5
    room.assist_aim(p);assert p.yaw==0
    q.hp=0;room.assist_aim(p)
    assert p.yaw==pytest.approx(math.atan2(1,3))


def test_only_three_cheats_exist_and_the_removed_toggle_is_ignored():
    room,p,q=duel()
    assert CHEATS==('aim','esp','recoil')
    room.command(p,dict(type='toggle',key='ammo'))
    assert set(p.cheats)==set(CHEATS)


def test_all_remaining_cheats_still_consume_ammo_and_obey_reload():
    room,p,q=duel();p.cheats=dict.fromkeys(CHEATS,True)
    for _ in range(30):p.cooldown=0;room.shoot(p)
    assert p.shots==30 and p.ammo==0
    p.cooldown=0;room.shoot(p)
    assert p.shots==30 and p.reload==1.5
    room.shoot(p);assert p.shots==30 and p.ammo==0
    q.hp=100;room.tick(1.6)
    assert p.ammo==30 and p.reload==0
    p.ammo=12;room.command(p,dict(type='input',reload=True));room.tick(1/60)
    assert p.reload==1.5
    room.command(p,dict(type='input'));room.tick(1.6)
    assert p.ammo==30 and p.reload==0
