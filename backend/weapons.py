"""Server-owned weapon specifications; clients cannot submit damage or ammunition."""
WEAPONS = {
    'rifle': dict(name='AR', label='AR', slot=1, reserve=300, capacity=30, interval=.115, reload_time=1.5,
                  damage=25, pellets=1, spread=0., range=65., recoil=.022),
    'shotgun': dict(name='산탄총', label='산탄총', slot=3, reserve=36, capacity=6, interval=1.0, reload_time=.7,
                    damage=100, pellets=1, spread=.006, range=28., recoil=.065),
    'pistol': dict(name='권총', label='권총', slot=2, reserve=120, capacity=12, interval=.27, reload_time=1.25,
                   damage=31, pellets=1, spread=.004, range=42., recoil=.032),
}
