"""Class statistics and passive abilities; these are not toggle cheats."""
BASE_HP = 200
ROLES = {
    'scout': dict(name='Scout', hp=150, speed=1.20, heat_immune=False),
    'guard': dict(name='Guard', hp=300, speed=.75, heat_immune=False),
    'glowsquid': dict(name='Glowsquid', hp=200, speed=1.15, heat_immune=True),
}
def profile(skin):
    return ROLES.get(skin, dict(name='Operator', hp=BASE_HP, speed=1.0, heat_immune=False))
