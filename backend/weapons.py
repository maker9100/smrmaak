"""Server-owned weapons. Slot, ammunition, damage and cadence are authoritative."""
WEAPONS = {
 'axe':dict(name='트렌치 도끼',label='도끼',slot=1,kind='throw',reserve=0,capacity=1,interval=.7,reload_time=0.,damage=90,pellets=0,spread=0.,range=35.,recoil=0.),
 'pistol':dict(name='권총',label='권총',slot=2,kind='gun',reserve=120,capacity=12,interval=.27,reload_time=1.25,damage=31,pellets=1,spread=.004,range=42.,recoil=.032),
 'rifle':dict(name='AR',label='AR',slot=3,kind='gun',reserve=300,capacity=30,interval=.115,reload_time=1.5,damage=25,pellets=1,spread=0.,range=65.,recoil=.022),
 'shotgun':dict(name='산탄총',label='산탄총',slot=4,kind='gun',reserve=36,capacity=6,interval=1.,reload_time=.7,damage=100,pellets=1,spread=.006,range=28.,recoil=.065),
 'grenade':dict(name='수류탄',label='수류탄',slot=5,kind='grenade',reserve=3,capacity=1,interval=1.,reload_time=.75,damage=160,pellets=0,spread=0.,range=25.,recoil=0.,radius=6.,fuse=2.5),
}
