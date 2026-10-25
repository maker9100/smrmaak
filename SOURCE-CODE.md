# Cheat FPS v0.5.0 전체 프로젝트 소스

## backend/__init__.py
``````
"""Cheat FPS server package."""

``````

## backend/ai.py
``````
"""Ordinary bots: bounded vision, remembered sightings, cover, flanks and bursts."""
import math
import random
from .game import angle, wall, move, clear


def free_point(room,x,y):
    width,height=len(room.map[0]),len(room.map)
    x=max(1,min(width-2,int(x)));y=max(1,min(height-2,int(y)))
    for radius in range(10):
        cells=[(xx,yy) for yy in range(y-radius,y+radius+1) for xx in range(x-radius,x+radius+1)
               if max(abs(xx-x),abs(yy-y))==radius and not wall(xx+.5,yy+.5,room.map)]
        if cells:
            xx,yy=min(cells,key=lambda v:(v[0]-x)**2+(v[1]-y)**2)
            return xx+.5,yy+.5
    return x+.5,y+.5


def cover_points(room):
    cache=getattr(room,'_cover_cache',{})
    if room.map_id not in cache:
        grid=room.map
        cache[room.map_id]=[(x+.5,y+.5) for y in range(3,len(grid)-3) for x in range(3,len(grid[0])-3)
                           if (x+y)%2==0 and grid[y][x]=='0' and any(wall(x+dx+.5,y+dy+.5,grid) for dx,dy in [(1,0),(-1,0),(0,1),(0,-1)])]
        room._cover_cache=cache
    return cache[room.map_id]


def tactical_goal(room,p,target,mode,side):
    dx,dy=target.x-p.x,target.y-p.y;distance=max(.1,math.hypot(dx,dy));ux,uy=dx/distance,dy/distance
    if mode=='strafe':return free_point(room,p.x-uy*side*random.uniform(3,5),p.y+ux*side*random.uniform(3,5))
    points=cover_points(room)
    candidates=random.sample(points,min(90,len(points)))
    scored=[]
    for x,y in candidates:
        travel=math.hypot(x-p.x,y-p.y);enemy_distance=math.hypot(x-target.x,y-target.y)
        if not 2<travel<14 or enemy_distance<5:continue
        hidden=not room.sight(x,y,target.x,target.y)
        lateral=((x-p.x)*-uy+(y-p.y)*ux)*side
        progress=distance-enemy_distance
        if mode=='advance' and progress<1.5:continue
        if mode=='retreat' and enemy_distance<distance+1:continue
        score=travel*.3+abs(enemy_distance-13)*.3+random.random()*2
        if mode in ('cover','retreat'):score+=-5 if hidden else 4
        if mode=='flank':score-=min(8,lateral)*.7
        for ally in room.players.values():
            if ally.id!=p.id and ally.team==p.team and ally.hp>0:score+=max(0,3-math.hypot(x-ally.x,y-ally.y))*2
        scored.append((score,(x,y)))
    if scored:return min(scored,key=lambda item:item[0])[1]
    forward=-5 if mode=='retreat' else min(6,max(0,distance-9))
    return free_point(room,p.x+ux*forward-uy*side*4,p.y+uy*forward+ux*side*4)


def patrol_goal(room,p,brain):
    w,h=len(room.map[0]),len(room.map);step=brain['step'];brain['step']+=1
    # The three styles approach through different lanes, then change lanes.
    lane=(brain['lane']+(step//3 if brain['style']=='roam' else step//4))%3
    fractions=(.32,.55,.76,.55) if brain['style']!='advance' else (.40,.60,.78,.52)
    x=w*fractions[step%4];x=x if p.team==0 else w-x
    y=h*(.22,.50,.78)[lane]
    return free_point(room,x+random.uniform(-2,2),y+random.uniform(-2,2))


def follow(room,p,goal,dt,look):
    brain=p.brain
    if not p.route:return False
    brain['smooth']-=dt
    if brain['smooth']<=0:
        brain['smooth']=.2
        for i in range(min(5,len(p.route))-1,0,-1):
            x,y=p.route[i]
            if all(clear(p.x+a,p.y+b,x+a,y+b,room.map) for a in (-.44,.44) for b in (-.44,.44)):
                del p.route[:i];break
    x,y=p.route[0];dx,dy=x-p.x,y-p.y;distance=math.hypot(dx,dy)
    if distance<.07:p.route.pop(0);return True
    speed=brain['speed']*(.74 if look else 1)
    step=min(distance,speed*dt);mx,my=dx/distance*step,dy/distance*step
    for ally in room.players.values():
        if ally.id==p.id or ally.team!=p.team or ally.hp<=0:continue
        ax,ay=p.x-ally.x,p.y-ally.y;d=math.hypot(ax,ay)
        if .02<d<1.3:mx+=ax/d*(1.3-d)*dt;my+=ay/d*(1.3-d)*dt
    if not look:
        desired=math.atan2(dy,dx);p.yaw=angle(p.yaw+max(-2.8*dt,min(2.8*dt,angle(desired-p.yaw))))
        p.pitch*=max(0,1-dt*4)
    old=(p.x,p.y);steps=max(1,math.ceil(max(abs(mx),abs(my))/.2))
    for _ in range(steps):move(p,mx/steps,my/steps,room.map)
    moved=math.hypot(p.x-old[0],p.y-old[1])
    brain['stuck']=brain['stuck']+dt if moved<.01 else 0
    if brain['stuck']>.8:brain['plan']=0;brain['stuck']=0;p.route=[]
    return True


def update_ai(room,p,dt):
    if not p.brain:
        slot=[q.id for q in room.players.values() if q.team==p.team].index(p.id)
        p.brain=dict(style=('flank','advance','roam')[slot%3],lane=slot%3,mode='patrol',step=0,
                     plan=0,speed=random.uniform(4.1,5.0),side=random.choice([-1,1]),memory=None,memory_ttl=0,
                     goal=None,burst=0,rest=0,stuck=0,smooth=0,target=None,wait=0)
    b=p.brain;b['plan']-=dt;b['memory_ttl']=max(0,b['memory_ttl']-dt);b['rest']=max(0,b['rest']-dt)
    enemies=[q for q in room.players.values() if q.team!=p.team and q.hp>0]
    visible=[q for q in enemies if math.hypot(q.x-p.x,q.y-p.y)<55 and abs(angle(math.atan2(q.y-p.y,q.x-p.x)-p.yaw))<1.85 and room.sight(p.x,p.y,q.x,q.y)]
    target=min(visible,key=lambda q:math.hypot(q.x-p.x,q.y-p.y)) if visible else None
    p.inp={'fire':False,'aim':False,'reload':p.ammo<6 and (not target or b['mode'] in ('cover','retreat'))}
    if target:
        if b['target']!=target.id:p.reaction=0;b['plan']=0
        b['target']=target.id;b['memory']=(target.x,target.y);b['memory_ttl']=6
        desired=math.atan2(target.y-p.y,target.x-p.x);error=angle(desired-p.yaw)
        p.yaw=angle(p.yaw+max(-1.7*dt,min(1.7*dt,error)));p.pitch=math.atan2(-.3,math.hypot(target.x-p.x,target.y-p.y))
        p.reaction+=dt
        if b['rest']<=0:
            if b['burst']<=0:b['burst']=random.uniform(.45,.9)
            b['burst']-=dt
            p.inp['fire']=abs(error)<.16 and p.reaction>.65
            if b['burst']<=0:b['rest']=random.uniform(.25,.65)
    else:
        p.reaction=0;b['target']=None
        # Share only a teammate's recently observed position, never unseen enemy state.
        if b['memory_ttl']<=0:
            reports=[a.brain for a in room.players.values() if a.team==p.team and a.id!=p.id and a.hp>0 and a.brain.get('memory_ttl',0)>4 and math.hypot(a.x-p.x,a.y-p.y)<24]
            if reports:b['memory']=reports[0]['memory'];b['memory_ttl']=3;b['plan']=0
    if target and p.equip==0:
        d=math.hypot(target.x-p.x,target.y-p.y)
        desired='shotgun' if d<10 else 'rifle'
        if p.magazines.get(desired,0)==0 and p.reserves.get(desired,0)==0:desired='pistol'
        if p.ammo==0 and p.reserves[p.weapon]==0:
            desired=next((k for k in ('rifle','pistol','shotgun') if p.magazines[k]>0 or p.reserves[k]>0),desired)
        if desired!=p.weapon and b['rest']<=0:room.equip_weapon(p,desired);b['rest']=.5
    if p.ammo==0:p.inp['reload']=True
    # Reload proactively behind cover, with a route away from pressure.
    if p.reload>0 and target:b['plan']=min(b['plan'],.15)

    clock=room.arena.get('clock')
    if clock:
        dx,dy=p.x-clock['x'],p.y-clock['y'];d=math.hypot(dx,dy)
        future=(room.train_time+.65)*2*math.pi/clock['period']
        if clock['inner']<d<clock['length']+1 and abs(angle(math.atan2(dy,dx)-future))<.45:
            goal=free_point(room,clock['x']+dx/max(.1,d)*15.6,clock['y']+dy/max(.1,d)*15.6)
            b['mode']='evade_clock';b['goal']=goal;p.route=room.path(p,goal);b['plan']=.7
    config=room.arena.get('train');evade=False
    if config and abs(p.y-config['y'])<3.1:
        from .hazards import train_pose
        train=train_pose(room.train_time,config)
        evade=train['warning'] or (train['active'] and abs(train['x']-p.x)<14)
    if evade:
        mode='evade_train';goal=free_point(room,p.x+random.uniform(-1,1),config['y']+(-5 if p.y<config['y'] else 5));p.inp['fire']=False
        if b['mode']!=mode or not p.route:b['mode']=mode;b['goal']=goal;p.route=room.path(p,goal)
        b['plan']=.2
    elif b['plan']<=0 or (not p.route and b['wait']<=0):
        if target:
            d=math.hypot(target.x-p.x,target.y-p.y)
            if p.hp<45 or p.reload>0:mode='retreat'
            elif d>22:mode=random.choice(['advance','advance','flank'])
            elif d<8:mode=random.choice(['retreat','strafe'])
            else:mode=random.choice(['strafe','flank','cover','advance']+(['flank'] if b['style']=='flank' else []))
            b['side']*=-1 if random.random()<.55 else 1
            goal=tactical_goal(room,p,target,mode,b['side'])
        elif b['memory_ttl']>0 and b['memory'] and math.hypot(p.x-b['memory'][0],p.y-b['memory'][1])>1.2:
            mode='search';goal=free_point(room,*b['memory'])
        else:mode='patrol';goal=patrol_goal(room,p,b)
        b['mode']=mode;b['goal']=goal;b['plan']=random.uniform(.9,1.8);p.route=room.path(p,goal);b['wait']=random.uniform(.15,.45)
    if p.route:follow(room,p,b['goal'],dt,bool(target))
    else:b['wait']-=dt

``````

## backend/arenas.py
``````
"""Five 60 x 35 metre arenas. One grid cell is one metre everywhere."""
WIDTH, DEPTH = 60, 35
PLAYER_RADIUS = .44
SPAWN_Y = (9.5,17.5,25.5)


def layout(rectangles):
    cells=[['1' if x in (0,WIDTH-1) or y in (0,DEPTH-1) else '0' for x in range(WIDTH)] for y in range(DEPTH)]
    for x,y,w,h in rectangles:
        for yy in range(y,y+h):
            for xx in range(x,x+w):cells[yy][xx]='1'
    return [''.join(row) for row in cells]


def mirrored(rects):
    return rects+[(WIDTH-x-w,y,w,h) for x,y,w,h in rects]


def arena(key,name,landmark,rects,sky,wall,floor,accent,central=True):
    bounds=[28,15,4,5] if central else None
    covers=rects+([tuple(bounds)] if bounds else [])
    grid=layout(covers)
    return dict(id=key,name=name,landmark=landmark,width=WIDTH,depth=DEPTH,cell_size=1,
                landmark_bounds=bounds,cover_count=len(covers),grid=grid,sky=sky,wall=wall,floor=floor,accent=accent,
                spawns=[[[5.5,y] for y in SPAWN_Y],[[WIDTH-5.5,y] for y in SPAWN_Y]])


ARENAS={
 'freight':arena('freight','컨테이너 항만','대형 갠트리 크레인',
   mirrored([(10,5,5,3),(10,12,3,5),(10,22,5,3),(10,29,5,2),(20,4,3,5),(20,13,3,4),(20,23,3,5)])+[(27,7,6,2),(27,26,6,2)],
   '#adc5ca','#627a80','#70847b','#5da9bf'),
 'foundry':arena('foundry','제련소','용광로와 굴뚝',
   mirrored([(10,4,4,4),(10,14,4,3),(10,25,4,5),(20,7,2,7),(20,21,2,7),(24,3,3,3),(24,29,3,3),(24,16,2,3)]),
   '#b6a798','#78675b','#796e62','#ef9c40'),
 'plaza':arena('plaza','시계 광장','중앙 시계탑',
   mirrored([(11,5,6,2),(11,28,6,2),(12,13,2,5),(21,9,3,3),(21,23,3,3),(25,5,2,2),(25,28,2,2),(21,16,2,3)]),
   '#c4d0ce','#aa9b7e','#a09c84','#9b6657'),
 'observatory':arena('observatory','천문관측소','돔과 대형 망원경',
   mirrored([(10,5,6,2),(10,27,6,2),(12,12,3,7),(20,6,3,4),(20,24,3,4),(22,14,2,3),(25,3,3,2),(25,30,3,2)]),
   '#273c5b','#758698','#566b82','#83c9ed'),
 'railway':arena('railway','철도 기지','선로를 통과하는 기관차',
   mirrored([(10,4,5,4),(10,10,3,3),(10,23,3,3),(10,29,5,3),(20,5,3,5),(20,26,3,5),(24,11,3,2),(24,22,3,2)])+[(28,5,4,2),(28,28,4,2)],
   '#b9c2b4','#7b7668','#7a806d','#c27b46',False),
}
# Keep a four-metre, continuous crossing through the end walls.
grid=ARENAS['railway']['grid']
for y in range(15,20):grid[y]='0'+grid[y][1:-1]+'0'
ARENAS['railway']['train']=dict(period=24.,warning=3.,start=-14.,end=74.,speed=5.6,y=17.5,length=12.,width=4.,damage=100)
# One lifted container shuttles between two marked landing pads.
ARENAS['freight']['crane'] = dict(period=20., warning=3., travel=6.,
    pads=[[27,7,6,2],[27,26,6,2]])
for x,y,w,h in ARENAS['freight']['crane']['pads']:
    grid=[list(row) for row in ARENAS['freight']['grid']]
    for yy in range(y,y+h):
        for xx in range(x,x+w): grid[yy][xx]='0'
    ARENAS['freight']['grid']=[''.join(row) for row in grid]
# Twelve clock-hour shelters surrounding the central tower.
import math
ring=[(round(30+14.5*math.cos(i*math.pi/6)-1),round(17.5+14.5*math.sin(i*math.pi/6)-1),2,2) for i in range(12)]
ARENAS['plaza']['grid']=layout(ring+[(28,15,4,5)])
ARENAS['plaza']['cover_count']=13
ARENAS['plaza']['clock']=dict(x=30.,y=17.5,period=24.,inner=3.,length=13.,width=.32,damage=35,hit_interval=1.)
DEFAULT_ARENA='freight' 
MAP=ARENAS[DEFAULT_ARENA]['grid']

``````

## backend/game.py
``````
"""Authoritative 60 Hz arena simulation. No client damage or position is trusted."""
import math
import random
import secrets
from collections import deque
from dataclasses import dataclass, field, asdict

from .arenas import ARENAS, DEFAULT_ARENA, MAP, PLAYER_RADIUS
from .hazards import train_pose, train_hits, segment_box
from .weapons import WEAPONS

CHEATS = ('aim', 'esp', 'recoil')
AIM_CONE = .95
MOVE_SPEED = 8.0
MOVE_ACCEL = 22.0

def angle(a):
    return (a + math.pi) % (2 * math.pi) - math.pi

def wall(x, y, grid=MAP):
    return not (0 <= x < len(grid[0]) and 0 <= y < len(grid)) or grid[int(y)][int(x)] == '1'

def clear(x, y, xx, yy, grid=MAP):
    if wall(x,y,grid) or wall(xx,yy,grid): return False
    cx,cy,ex,ey=math.floor(x),math.floor(y),math.floor(xx),math.floor(yy)
    dx,dy=xx-x,yy-y;sx=1 if dx>0 else -1;sy=1 if dy>0 else -1
    tx=abs(1/dx) if dx else math.inf;ty=abs(1/dy) if dy else math.inf
    nx=((cx+1-x) if dx>0 else (x-cx))*tx if dx else math.inf
    ny=((cy+1-y) if dy>0 else (y-cy))*ty if dy else math.inf
    for _ in range(len(grid)+len(grid[0])+2):
        if (cx,cy)==(ex,ey): return True
        if abs(nx-ny)<1e-10:
            if wall(cx+sx+.5,cy+.5,grid) or wall(cx+.5,cy+sy+.5,grid): return False
            cx+=sx;cy+=sy;nx+=tx;ny+=ty
        elif nx<ny:cx+=sx;nx+=tx
        else:cy+=sy;ny+=ty
        if wall(cx+.5,cy+.5,grid): return False
    return False


def move(p, dx, dy, grid=MAP):
    for axis, delta in [('x', dx), ('y', dy)]:
        x, y = p.x, p.y
        if axis == 'x': x += delta
        else: y += delta
        if all(not wall(x+a, y+b,grid) for a in (-PLAYER_RADIUS,PLAYER_RADIUS) for b in (-PLAYER_RADIUS,PLAYER_RADIUS)):
            setattr(p, axis, getattr(p, axis)+delta)

def walk(p, f, s, dt, aiming=False, grid=MAP):
    """Accelerate along a normalized analog input, with friction on release."""
    length = max(1, math.hypot(f, s))
    speed = 5.7 if aiming else MOVE_SPEED
    tx = (math.cos(p.yaw)*f-math.sin(p.yaw)*s)*speed/length
    ty = (math.sin(p.yaw)*f+math.cos(p.yaw)*s)*speed/length
    blend = 1-math.exp(-MOVE_ACCEL*dt)
    dx = tx*dt + (p.vx-tx)*blend/MOVE_ACCEL
    dy = ty*dt + (p.vy-ty)*blend/MOVE_ACCEL
    p.vx += (tx-p.vx)*blend
    p.vy += (ty-p.vy)*blend
    ox, oy = p.x, p.y
    # Small collision steps prevent tunnelling when a frame is delayed.
    steps = max(1, math.ceil(max(abs(dx),abs(dy))/.24))
    for _ in range(steps): move(p, dx/steps, dy/steps,grid)
    if abs(p.x-ox) < .00001: p.vx = 0
    if abs(p.y-oy) < .00001: p.vy = 0

@dataclass
class Player:
    id: str
    name: str
    team: int
    bot: bool = False
    skin: str = 'scout'
    x: float = 2.5
    y: float = 2.5
    yaw: float = 0
    pitch: float = 0
    vx: float = 0
    vy: float = 0
    seq: int = 0
    input_age: float = 0
    tap_serial: int = 0
    tap_pending: float = 0
    reaction: float = 0
    hp: int = 100
    kills: int = 0
    deaths: int = 0
    weapon: str = 'rifle'
    magazines: dict = field(default_factory=lambda:{k:v['capacity'] for k,v in WEAPONS.items()})
    reserves: dict = field(default_factory=lambda:{k:v['reserve'] for k,v in WEAPONS.items()})
    hazard_cooldown: float = 0
    equip: float = 0
    ammo: int = 30
    reload: float = 0
    cooldown: float = 0
    kick: float = 0
    shots: int = 0
    hit: int = 0
    ready: bool = False
    cheats: dict = field(default_factory=lambda:dict.fromkeys(CHEATS,False))
    inp: dict = field(default_factory=dict)
    stale: float = 0
    think: float = 0
    route: list = field(default_factory=list)
    brain: dict = field(default_factory=dict)

class Room:
    def __init__(self, code, mode, map_id=DEFAULT_ARENA):
        self.code, self.mode = code, mode
        if map_id not in ARENAS: raise ValueError('존재하지 않는 맵입니다.')
        self.map_id = map_id
        self.players = {}
        self.host = None
        self.state = 'LOBBY'
        self.timer = 0
        self.round = 0
        self.score = [0,0]
        self.history = []
        self.log = []
        self.message = ''
        self.quick = False
        self.train_time = 0.
        self.dynamic_grid = None
        self.crane_index = 0
        self.crane_cycle = 0
        self.crane_state = None

    @property
    def arena(self): return ARENAS[self.map_id]

    @property
    def map(self): return self.dynamic_grid or self.arena['grid']

    def add(self, name, team=0, bot=False):
        if self.state != 'LOBBY': raise ValueError('진행 중인 방입니다.')
        if self.mode == 'ai' and not bot: team = 0
        if sum(p.team == team for p in self.players.values()) >= 3:
            if self.mode == 'ai': raise ValueError('플레이어 팀이 가득 찼습니다.')
            team = 1-team
        if sum(p.team == team for p in self.players.values()) >= 3:
            raise ValueError('방이 가득 찼습니다.')
        p = Player(secrets.token_hex(4), name[:16] or '치터', team, bot)
        self.players[p.id] = p
        if self.host is None and not bot: self.host = p.id
        return p

    def remove(self, pid):
        p = self.players.get(pid)
        if not p: return
        if self.state in ('PLAYING','COUNTDOWN','ROUND_END'):
            # Keep the match roster but never give replacement AI cheats.
            p.bot = True
            p.name = p.name[:12] + '·AI'
            p.cheats = dict.fromkeys(CHEATS,False)
            p.inp = {}
        else: del self.players[pid]
        humans = [q.id for q in self.players.values() if not q.bot]
        if self.host == pid: self.host = humans[0] if humans else None

    def start_error(self):
        if self.state != 'LOBBY': return '대기실에서만 시작할 수 있습니다.'
        humans = [p for p in self.players.values() if not p.bot]
        if not humans: return '플레이어가 필요합니다.'
        if self.mode == 'local' and not all(any(p.team == t for p in humans) for t in (0,1)):
            return 'BLUE와 RED에 각각 1명 이상 참가해야 합니다.'
        if not all(p.ready for p in humans): return '참가자 전원이 준비해야 합니다. 분할 화면도 각각 준비해 주세요.'
        return ''

    def start(self):
        reason = self.start_error()
        if reason: raise ValueError(reason)
        if self.mode == 'ai':
            for team in (0,1):
                while sum(p.team == team for p in self.players.values()) < 3:
                    i = sum(p.team == team for p in self.players.values())
                    self.add('GUARD '+str(len(self.players)+1),team,True).skin = ('scout','warden','rogue')[i]
        self.score, self.history, self.round, self.log = [0,0], [], 0, []
        for p in self.players.values(): p.kills = p.deaths = 0
        self.new_round()

    def new_round(self):
        self.train_time = 0.
        self.dynamic_grid = None
        self.crane_index = self.crane_cycle = 0
        self.update_mechanisms()
        self.round += 1
        self.state, self.timer = 'COUNTDOWN', 3
        for team in (0,1):
            for i,p in enumerate(q for q in self.players.values() if q.team == team):
                p.x,p.y = self.arena['spawns'][team][i]
                p.yaw = 0 if team == 0 else math.pi
                p.brain = {}
                p.magazines = {k:v['capacity'] for k,v in WEAPONS.items()}
                p.reserves = {k:v['reserve'] for k,v in WEAPONS.items()}
                p.hazard_cooldown = 0
                p.hp,p.ammo,p.reload,p.cooldown,p.kick = 100,WEAPONS[p.weapon]['capacity'],0,0,0
                p.equip = 0
                p.inp,p.route = {},[]
                p.vx,p.vy,p.stale = 0,0,0
                p.pitch,p.input_age,p.tap_pending,p.reaction = 0,0,0,0
        self.message = f'ROUND {self.round}'

    def finish(self, winner, reason):
        if self.state != 'PLAYING': return
        self.score[winner] += 1
        self.history.append({'round':self.round,'winner':winner,'reason':reason})
        self.message = ('BLUE' if winner == 0 else 'RED')+' 승리 · '+reason
        self.state, self.timer = ('MATCH_END',0) if self.score[winner] == 3 else ('ROUND_END',4)

    def command(self, p, data):
        op = data.get('type')
        if op == 'input':
            def num(key):
                v = data.get(key,0)
                return max(-1,min(1,float(v))) if isinstance(v,(int,float)) and math.isfinite(v) else 0
            p.inp = {k:num(k) for k in ('f','s','turn')}
            p.inp.update({k:data.get(k) is True for k in ('fire','aim','reload')})
            yaw = data.get('yaw')
            if isinstance(yaw,(int,float)) and math.isfinite(yaw) and not p.bot and p.hp > 0:
                p.yaw = angle(yaw)
            pitch = data.get('pitch')
            if isinstance(pitch,(int,float)) and math.isfinite(pitch) and not p.bot and p.hp > 0:
                p.pitch = max(-1.15,min(1.15,pitch))
            seq = data.get('seq')
            if isinstance(seq,int) and p.seq < seq <= 2**53:
                p.seq,p.input_age = seq,0
            p.stale = 0
        elif op == 'shoot' and not p.bot and p.hp > 0 and self.state == 'PLAYING':
            serial = data.get('serial')
            if isinstance(serial,int) and p.tap_serial < serial <= 2**53:
                p.tap_serial = serial
                # A tap is an edge, not a short-lived input state. It survives
                # coalesced WebSocket messages but still obeys weapon cadence.
                p.tap_pending = .2
        elif op == 'reload' and not p.bot and p.hp > 0 and self.state == 'PLAYING':
            self.reload_weapon(p)
        elif op == 'weapon' and not p.bot and p.hp > 0 and self.state in ('PLAYING','COUNTDOWN'):
            self.equip_weapon(p,data.get('weapon'))
        elif op == 'toggle' and data.get('key') in CHEATS and not p.bot:
            p.cheats[data['key']] = not p.cheats[data['key']]
        elif op == 'custom' and self.state == 'LOBBY':
            p.name = str(data.get('name',p.name))[:16] or '치터'
            if data.get('skin') in ('scout','warden','rogue'): p.skin = data['skin']
            team = data.get('team',p.team)
            if team in (0,1) and team != p.team and self.mode == 'local':
                if sum(q.team == team for q in self.players.values()) >= 3: raise ValueError('그 팀은 가득 찼습니다.')
                p.team = team
            p.ready = False
        elif op == 'map' and self.state == 'LOBBY' and self.mode == 'local' and p.id == self.host:
            if data.get('map_id') not in ARENAS: raise ValueError('존재하지 않는 맵입니다.')
            self.map_id = data['map_id']
            for q in self.players.values(): q.ready = False
        elif op == 'ready' and self.state == 'LOBBY':
            p.ready = not p.ready
            if self.mode == 'local' and not self.start_error(): self.start()
        elif op == 'start' and p.id == self.host: self.start()
        elif op == 'lobby' and p.id == self.host and self.state == 'MATCH_END':
            self.players = {i:q for i,q in self.players.items() if not q.bot}
            for q in self.players.values(): q.ready = False
            self.state = 'LOBBY'
        elif op == 'rematch' and p.id == self.host and self.state == 'MATCH_END' and self.quick:
            self.map_id = secrets.choice(tuple(ARENAS))
            self.players = {i:q for i,q in self.players.items() if not q.bot}
            for q in self.players.values(): q.ready = True
            self.state = 'LOBBY'
            self.start()

    def path(self, p, target):
        end = (int(target[0]),int(target[1])) if isinstance(target,(tuple,list)) else (int(target.x),int(target.y))
        start = (int(p.x),int(p.y))
        queue, prev = deque([start]), {start:None}
        while queue:
            v = queue.popleft()
            if v == end: break
            for dx,dy in ((1,0),(-1,0),(0,1),(0,-1)):
                w = v[0]+dx,v[1]+dy
                if w not in prev and not wall(w[0]+.5,w[1]+.5,self.map):
                    prev[w] = v
                    queue.append(w)
        route = []
        if end in prev:
            while end != start:
                route.append((end[0]+.5,end[1]+.5))
                end = prev[end]
        return route[::-1]

    def ai(self,p,dt):
        from .ai import update_ai
        update_ai(self,p,dt)

    def sight(self,x,y,xx,yy):
        if not clear(x,y,xx,yy,self.map): return False
        config = self.arena.get('train')
        if config:
            train = train_pose(self.train_time,config)
            if train['active'] and segment_box(x,y,xx,yy,train['x']-config['length']/2,
                    train['y']-config['width']/2,train['x']+config['length']/2,train['y']+config['width']/2):
                return False
        return True

    def assist_aim(self,p):
        """Acquire a visible enemy before the shot, including queued mobile taps."""
        if p.bot or p.hp <= 0 or not p.cheats['aim'] or self.state != 'PLAYING': return
        targets = [q for q in self.players.values() if q.team != p.team and q.hp > 0
                   and math.hypot(q.x-p.x,q.y-p.y) <= WEAPONS[p.weapon]['range']
                   and abs(angle(math.atan2(q.y-p.y,q.x-p.x)-p.yaw)) < AIM_CONE
                   and self.sight(p.x,p.y,q.x,q.y)]
        if not targets: return
        q = min(targets,key=lambda q:(abs(angle(math.atan2(q.y-p.y,q.x-p.x)-p.yaw)),math.hypot(q.x-p.x,q.y-p.y),q.id))
        p.yaw = math.atan2(q.y-p.y,q.x-p.x)
        p.pitch = math.atan2(-.3,math.hypot(q.x-p.x,q.y-p.y))

    def equip_weapon(self,p,key):
        if not isinstance(key,str) or key not in WEAPONS or key == p.weapon or p.equip > 0: return
        p.magazines[p.weapon] = p.ammo
        p.weapon = key
        p.ammo = p.magazines[key]
        p.reload = 0
        p.equip = .35
        p.cooldown = max(p.cooldown,.35)
        p.tap_pending = 0

    def reload_weapon(self,p):
        spec = WEAPONS[p.weapon]
        if p.ammo < spec['capacity'] and p.reload == 0 and p.equip == 0 and p.reserves[p.weapon] > 0:
            p.reload = spec['reload_time']

    def shoot(self,p):
        spec = WEAPONS[p.weapon]
        if p.weapon == 'shotgun' and p.ammo > 0 and p.reload > 0 and p.cooldown == 0 and p.equip == 0:
            p.reload = 0
        if p.cooldown > 0 or p.reload > 0 or p.equip > 0: return
        if p.ammo <= 0:
            self.reload_weapon(p)
            return
        p.cooldown = max(.30,spec['interval']) if p.bot else spec['interval']
        p.shots += 1
        p.ammo -= 1
        p.magazines[p.weapon] = p.ammo
        self.assist_aim(p)
        recoil = random.uniform(-.09,.09) if p.bot else (0 if p.cheats['recoil'] else random.uniform(-p.kick,p.kick))
        damage = {}
        # Each pellet traces independently, hits the nearest visible enemy and
        # never penetrates walls, the train, or another enemy. No client hit list.
        for i in range(spec['pellets']):
            if spec['pellets'] > 1:
                theta = i * math.pi * (3-math.sqrt(5))
                radius = math.sqrt((i+.5)/spec['pellets']) * spec['spread']
                horizontal,vertical = math.cos(theta)*radius,math.sin(theta)*radius
            else:
                horizontal,vertical = random.uniform(-spec['spread'],spec['spread']),0
            direction = p.yaw + recoil + horizontal
            candidates = []
            for q in self.players.values():
                if q.hp <= 0 or q.team == p.team: continue
                d = math.hypot(q.x-p.x,q.y-p.y)
                height = 1.5 + math.tan(p.pitch+vertical)*d
                if d <= spec['range'] and 0 < height < 1.96 and abs(angle(math.atan2(q.y-p.y,q.x-p.x)-direction)) <= math.atan2(.56,d) and self.sight(p.x,p.y,q.x,q.y):
                    candidates.append((d,q))
            if candidates:
                d,q = min(candidates,key=lambda z:z[0])
                falloff = max(.2,1-max(0,d-7)/25) if p.weapon == 'shotgun' else 1
                amount = max(1,round(spec['damage']*falloff*(.64 if p.bot else 1)))
                damage[q.id] = damage.get(q.id,0) + amount
        if not p.cheats['recoil']: p.kick = min(.13,p.kick+spec['recoil'])
        for pid,amount in damage.items():
            q = self.players[pid]
            q.hp = max(0,q.hp-amount)
            p.hit += 1
            if q.hp == 0:
                p.kills += 1
                q.deaths += 1
                self.log.append({'killer':p.name,'victim':q.name,'team':p.team,'weapon':p.weapon})
                self.log = self.log[-6:]

    def tick(self,dt):
        if self.state in ('COUNTDOWN','ROUND_END'):
            self.timer -= dt
            if self.timer <= 0:
                if self.state == 'COUNTDOWN': self.state,self.timer = 'PLAYING',120
                else: self.new_round()
            return
        if self.state != 'PLAYING': return
        self.timer -= dt
        train_before = self.train_time
        self.train_time += dt
        self.update_mechanisms()
        train_config = self.arena.get('train')
        for p in list(self.players.values()):
            if p.hp <= 0: continue
            old_position = (p.x,p.y)
            p.hazard_cooldown = max(0,p.hazard_cooldown-dt)
            p.cooldown = max(0,p.cooldown-dt)
            p.equip = max(0,p.equip-dt)
            spec = WEAPONS[p.weapon]
            p.kick = max(0,p.kick-dt*.055)
            if p.reload > 0:
                p.reload = max(0,p.reload-dt)
                if p.reload == 0:
                    amount = min(1 if p.weapon == 'shotgun' else spec['capacity']-p.ammo, p.reserves[p.weapon])
                    p.ammo += amount
                    p.reserves[p.weapon] -= amount
                    p.magazines[p.weapon] = p.ammo
                    if p.weapon == 'shotgun' and p.ammo < spec['capacity'] and p.reserves[p.weapon] > 0:
                        p.reload = spec['reload_time']
            if p.bot:
                ox,oy = p.x,p.y
                self.ai(p,dt)
                p.vx,p.vy = (p.x-ox)/dt,(p.y-oy)/dt
            else:
                p.stale += dt
                if p.stale > .4: p.inp = {}
                p.yaw = angle(p.yaw+p.inp.get('turn',0)*3.2*dt)
                f,s = p.inp.get('f',0),p.inp.get('s',0)
                walk(p,f,s,dt,p.inp.get('aim'),self.map)
                p.input_age += dt
            if train_config and train_hits(train_before,self.train_time,old_position,(p.x,p.y),train_config):
                p.hp = max(0,p.hp-train_config['damage'])
                if p.hp == 0:
                    p.deaths += 1
                    p.vx=p.vy=0
                    p.inp={}
                    self.log.append(dict(killer='기차',victim=p.name,team=None,cause='train'))
                    self.log=self.log[-6:]
                    continue
            if self.clock_hit(p,old_position,train_before,self.train_time):
                continue
            if p.inp.get('aim') or p.inp.get('fire') or p.tap_pending > 0:
                self.assist_aim(p)
            if p.inp.get('reload'): self.reload_weapon(p)
            if p.inp.get('fire') or p.tap_pending > 0:
                shots = p.shots
                self.shoot(p)
                if p.shots > shots: p.tap_pending = 0
            p.tap_pending = max(0,p.tap_pending-dt)
        alive = [sum(p.hp>0 and p.team==t for p in self.players.values()) for t in (0,1)]
        if alive == [0,0]:
            self.round -= 1
            self.new_round()
            self.message = '양 팀 동시 녹아웃 · 같은 라운드 재시작'
        elif 0 in alive: self.finish(0 if alive[0] else 1,'전원 녹아웃')
        elif self.timer <= 0:
            values = [(alive[t],sum(p.hp for p in self.players.values() if p.team==t)) for t in (0,1)]
            if values[0] != values[1]: self.finish(0 if values[0]>values[1] else 1,'시간 종료 · 생존자/체력 우세')
            else:
                self.timer = 30
                self.message = '동률 · 30초 연장전'

    def update_mechanisms(self):
        cfg=self.arena.get('crane')
        if not cfg: return
        t=self.train_time;cycle=self.crane_cycle;phase=t-cycle*cfg['period']
        elapsed=max(0,t-getattr(self,'mechanism_time',0));self.mechanism_time=t
        previous_lift=(self.crane_state or {}).get('lift',0)
        descent=max(0,previous_lift-6*elapsed)
        source=cfg['pads'][self.crane_index];target=cfg['pads'][1-self.crane_index]
        moving=phase>=cfg['warning'] and cycle>=self.crane_cycle
        progress=min(1,max(0,(phase-cfg['warning'])/cfg['travel'])) if moving else 0
        blocked=any(p.hp>0 and target[0]-.5<p.x<target[0]+target[2]+.5 and target[1]-.5<p.y<target[1]+target[3]+.5 for p in self.players.values())
        if moving and progress>=1 and not blocked and descent<=0:
            self.crane_index=1-self.crane_index;self.crane_cycle=int(t/cfg['period'])+1
            source=cfg['pads'][self.crane_index];moving=False;progress=0
        # If the pad is occupied, hold the load overhead and retry next tick.
        travel=max(0,min(1,(progress-.2)/.6))
        x=source[0]+(target[0]-source[0])*travel
        y=source[1]+(target[1]-source[1])*travel
        lift=min(1,progress*5,(1-progress)*5)*7 if moving else 0
        if moving and progress>=.8 and blocked: lift=max(3.5,lift)
        elif moving and progress>=1: lift=descent
        self.crane_state=dict(x=x,y=y,w=source[2],h=source[3],lift=lift,moving=moving,blocked=blocked,warning=0<=phase<cfg['warning'],progress=progress)
        # Raised loads stop blocking floor travel/shots; low loads use conservative cells.
        grid=[list(row) for row in self.arena['grid']]
        if lift<2.1:
            for yy in range(int(y),math.ceil(y+source[3])):
                for xx in range(int(x),math.ceil(x+source[2])): grid[yy][xx]='1'
        result=[''.join(row) for row in grid]
        if result!=self.dynamic_grid:
            self.dynamic_grid=result;self._cover_cache={}
            for p in self.players.values():
                p.route=[]
                if p.brain: p.brain['plan']=0

    def clock_hit(self,p,old,t0,t1):
        cfg=self.arena.get('clock')
        if not cfg or p.hazard_cooldown>0: return False
        # Sweep player and rotating hand at <= .04 radians and .2 m intervals.
        steps=max(1,math.ceil((t1-t0)*2*math.pi/cfg['period']/.04),math.ceil(math.dist(old,(p.x,p.y))/.2))
        for i in range(steps+1):
            u=i/steps;a=(t0+(t1-t0)*u)*2*math.pi/cfg['period']
            dx=old[0]+(p.x-old[0])*u-cfg['x'];dy=old[1]+(p.y-old[1])*u-cfg['y']
            along=dx*math.cos(a)+dy*math.sin(a);across=-dx*math.sin(a)+dy*math.cos(a)
            if cfg['inner']-PLAYER_RADIUS<along<cfg['length']+PLAYER_RADIUS and abs(across)<cfg['width']/2+PLAYER_RADIUS and not wall(p.x,p.y,self.map):
                p.hp=max(0,p.hp-cfg['damage']);p.hazard_cooldown=cfg['hit_interval']
                if p.hp==0:
                    p.deaths+=1;p.vx=p.vy=0;p.inp={}
                    self.log.append(dict(killer='시계탑 시침',victim=p.name,team=None,cause='clock'));self.log=self.log[-6:]
                    return True
                break
        return False

    def snapshot(self):
        players = []
        for p in self.players.values():
            d = asdict(p)
            for k in ('inp','route','think','stale','tap_pending','tap_serial','reaction','brain'): d.pop(k)
            players.append(d)
        train = train_pose(self.train_time,self.arena['train']) if 'train' in self.arena else None
        reason = self.start_error()
        return dict(type='state',world_time=self.train_time,crane=self.crane_state,grid=self.map,weapons=WEAPONS,can_start=not reason,start_hint=reason,train=train,map_id=self.map_id,arena=self.arena,code=self.code,mode=self.mode,quick=self.quick,host=self.host,state=self.state,timer=max(0,self.timer),round=self.round,score=self.score,history=self.history,log=self.log,message=self.message,players=players)

``````

## backend/hazards.py
``````
"""Server-owned periodic train motion and continuous collision tests (metres)."""
import math
from .arenas import PLAYER_RADIUS


def train_pose(elapsed, config):
    phase = elapsed % config['period']
    travel = (config['end']-config['start']) / config['speed']
    active = config['warning'] <= phase < config['warning']+travel
    x = config['start'] + config['speed']*(phase-config['warning']) if active else config['start']
    return dict(elapsed=elapsed, x=x, y=config['y'], active=active,
                warning=phase < config['warning'],
                next_in=config['warning']-phase if phase < config['warning'] else config['period']-phase+config['warning'])


def segment_box(x0, y0, x1, y1, left, bottom, right, top):
    """Closed segment vs AABB, including starting overlaps and parallel edges."""
    enter, leave = 0., 1.
    for origin, delta, lo, hi in ((x0,x1-x0,left,right),(y0,y1-y0,bottom,top)):
        if abs(delta) < 1e-12:
            if not lo <= origin <= hi: return False
        else:
            a,b = sorted(((lo-origin)/delta,(hi-origin)/delta))
            enter,leave = max(enter,a),min(leave,b)
            if enter > leave: return False
    return True


def train_hits(t0, t1, old, new, config):
    """Sweep relative movement; split at off-map resets to avoid ghost impacts."""
    if t1 <= t0: return False
    travel = (config['end']-config['start'])/config['speed']
    for cycle in range(math.floor(t0/config['period']),math.floor(t1/config['period'])+1):
        start = cycle*config['period']+config['warning']
        a,b = max(t0,start),min(t1,start+travel)
        if b < a: continue
        u,v = (a-t0)/(t1-t0),(b-t0)/(t1-t0)
        ax = old[0]+(new[0]-old[0])*u-(config['start']+config['speed']*(a-start))
        bx = old[0]+(new[0]-old[0])*v-(config['start']+config['speed']*(b-start))
        ay = old[1]+(new[1]-old[1])*u-config['y']
        by = old[1]+(new[1]-old[1])*v-config['y']
        hx,hy = config['length']/2+PLAYER_RADIUS,config['width']/2+PLAYER_RADIUS
        if segment_box(ax,ay,bx,by,-hx,-hy,hx,hy): return True
    return False

``````

## backend/main.py
``````
import asyncio
import contextlib
import json
import secrets
from contextlib import asynccontextmanager
from pathlib import Path
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from .game import Room, MAP
from .arenas import ARENAS, DEFAULT_ARENA

rooms = {}
peers = {}
ROOT = Path(__file__).resolve().parent.parent / 'frontend'

async def simulation():
    loop = asyncio.get_running_loop()
    last = loop.time()
    accumulator = 0
    while True:
        await asyncio.sleep(1/60)
        now = loop.time()
        dt,last = min(.1,now-last),now
        for room in list(rooms.values()): room.tick(dt)
        accumulator += dt
        if accumulator >= 1/30:
            accumulator %= 1/30
            snapshots = {code:room.snapshot() for code,room in rooms.items()}
            for ws,peer in list(peers.items()):
                q = peer['queue']
                if q.full():
                    with contextlib.suppress(asyncio.QueueEmpty): q.get_nowait()
                q.put_nowait(snapshots[peer['room'].code])

@asynccontextmanager
async def lifespan(app):
    task = asyncio.create_task(simulation())
    yield
    task.cancel()
    with contextlib.suppress(asyncio.CancelledError): await task

app = FastAPI(lifespan=lifespan)
app.mount('/static', StaticFiles(directory=ROOT), name='static')

@app.get('/')
async def index(): return FileResponse(ROOT / 'index.html',headers={'Cache-Control':'no-cache'})

@app.get('/health')
async def health(): return {'status':'ok','version':'0.5.0','rooms':len(rooms)}

@app.get('/arena')
async def arena(): return {'map':MAP}

@app.get('/arenas')
async def arenas(): return {'arenas':list(ARENAS.values())}

async def sender(ws,queue):
    while True:
        data = await queue.get()
        await asyncio.wait_for(ws.send_json(data),timeout=5)

@app.websocket('/ws')
async def socket(ws:WebSocket):
    await ws.accept()
    room = None
    owned = []
    task = None
    try:
        raw = await asyncio.wait_for(ws.receive_text(),10)
        if len(raw)>4096: return
        hello = json.loads(raw)
        code = str(hello.get('code','')).strip().upper()
        if code:
            room = rooms.get(code)
            if not room: raise ValueError('방 코드를 확인해 주세요.')
        else:
            if len(rooms)>=100: raise ValueError('서버가 가득 찼습니다.')
            code = secrets.token_hex(3).upper()
            while code in rooms: code = secrets.token_hex(3).upper()
            mode = 'local' if hello.get('mode')=='local' else 'ai'
            chosen = hello.get('map_id',DEFAULT_ARENA) if mode=='local' else secrets.choice(tuple(ARENAS))
            room = Room(code,mode,chosen)
            rooms[code] = room
        count = 2 if hello.get('split') is True else 1
        free = (3 if room.mode=='ai' else 6)-len([p for p in room.players.values() if not p.bot])
        if count > free: raise ValueError('요청한 인원만큼 빈 자리가 없습니다.')
        for i in range(count):
            p = room.add(str(hello.get('name','치터'))+(f' P{i+1}' if count>1 else ''),i if count>1 else 0)
            skins = hello.get('skins',[])
            if isinstance(skins,list) and i < len(skins) and skins[i] in ('scout','warden','rogue'): p.skin = skins[i]
            loadouts = hello.get('cheats',[])
            if isinstance(loadouts,list) and i < len(loadouts) and isinstance(loadouts[i],dict):
                p.cheats = {key:loadouts[i].get(key) is True for key in p.cheats}
            owned.append(p.id)
        # AI quick play still has a private server match; there is no room UI.
        if room.mode == 'ai' and hello.get('quick') is True and not hello.get('code'):
            room.quick = True
            for pid in owned: room.players[pid].ready = True
            room.start()
        await ws.send_json({'type':'welcome','version':'0.5.0','ids':owned,'map':room.map,'map_id':room.map_id,'arena':room.arena,'code':code,'quick':room.quick})
        queue = asyncio.Queue(maxsize=3)
        peers[ws] = {'room':room,'queue':queue}
        task = asyncio.create_task(sender(ws,queue))
        window,count_msg = asyncio.get_running_loop().time(),0
        while True:
            raw = await ws.receive_text()
            if len(raw)>4096: await ws.close(code=1009); break
            now = asyncio.get_running_loop().time()
            if now-window>=1: window,count_msg=now,0
            count_msg += 1
            if count_msg>150: continue
            try:
                data = json.loads(raw)
                if not isinstance(data,dict): continue
                if data.get('type') == 'ping':
                    if not queue.full(): queue.put_nowait({'type':'pong','sent':data.get('sent')})
                    continue
                pid = data.get('id',owned[0])
                if pid in owned and pid in room.players: room.command(room.players[pid],data)
            except (ValueError,TypeError) as e:
                if not queue.full(): queue.put_nowait({'type':'error','message':str(e)})
    except (WebSocketDisconnect, asyncio.TimeoutError): pass
    except (ValueError,TypeError,AttributeError) as e:
        with contextlib.suppress(Exception): await ws.send_json({'type':'error','message':str(e)})
    finally:
        peers.pop(ws,None)
        if task:
            task.cancel()
            with contextlib.suppress(asyncio.CancelledError,Exception): await task
        if room:
            for pid in owned: room.remove(pid)
            if not any(not p.bot for p in room.players.values()): rooms.pop(room.code,None)
        with contextlib.suppress(Exception): await ws.close()

``````

## backend/weapons.py
``````
"""Server-owned weapon specifications; clients cannot submit damage or ammunition."""
WEAPONS = {
    'rifle': dict(name='AR', label='AR', slot=1, reserve=300, capacity=30, interval=.115, reload_time=1.5,
                  damage=25, pellets=1, spread=0., range=65., recoil=.022),
    'shotgun': dict(name='산탄총', label='산탄총', slot=3, reserve=36, capacity=6, interval=1.0, reload_time=.7,
                    damage=100, pellets=1, spread=.006, range=28., recoil=.065),
    'pistol': dict(name='권총', label='권총', slot=2, reserve=120, capacity=12, interval=.27, reload_time=1.25,
                   damage=31, pellets=1, spread=.004, range=42., recoil=.032),
}

``````

## frontend/THREE-LICENSE.txt
``````
The MIT License

Copyright © 2010-2025 three.js authors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

``````

## frontend/combat-effects.js
``````
import * as THREE from 'three';
// Bounded reusable pools: no geometry/material allocation per shot.
export class CombatEffects{
 constructor(scene){
  this.scene=scene;this.flashes=new Map();this.shells=[];this.cursor=0;
  this.geometry=new THREE.SphereGeometry(1,7,5);
  this.fire=new THREE.MeshBasicMaterial({color:'#ffe4a0',transparent:true,opacity:.95,depthWrite:false,blending:THREE.AdditiveBlending,toneMapped:false});
  this.cases=new THREE.InstancedMesh(new THREE.CylinderGeometry(.009,.009,.045,7),new THREE.MeshStandardMaterial({color:'#c5a45e',metalness:.7,roughness:.35}),96);this.cases.count=0;this.cases.frustumCulled=false;scene.add(this.cases);this.transform=new THREE.Object3D();
 }
 update(actors,dt,now){
  for(const [id,a] of actors){
   let f=this.flashes.get(id);if(!f){const mesh=new THREE.Mesh(this.geometry,this.fire);mesh.visible=false;this.scene.add(mesh);f={mesh,shots:a.lastShots,until:0};this.flashes.set(id,f);}
   if(a.lastShots>f.shots){
    f.until=now+85;
    const pos=a.gun.localToWorld(new THREE.Vector3(.08,.04,.15));
    const right=new THREE.Vector3(1,0,0).applyQuaternion(a.root.quaternion);
    for(let i=0;i<Math.min(3,a.lastShots-f.shots);i++){
     const shell={p:pos.clone(),v:right.clone().multiplyScalar(1.6+Math.random()).add(new THREE.Vector3(0,1.7+Math.random(),0)),life:2.4,spin:Math.random()*6,shotgun:a.weapon==='shotgun'};
     this.shells[this.cursor]=shell;this.cursor=(this.cursor+1)%96;
    }
   }
   f.shots=a.lastShots;f.mesh.position.copy(a.gun.localToWorld(new THREE.Vector3(0,.03,a.weapon==='pistol'?.27:.72)));
   a.gun.getWorldQuaternion(f.mesh.quaternion);f.mesh.scale.set(a.weapon==='shotgun'?.12:.075,.08,a.weapon==='shotgun'?.37:.22);f.mesh.visible=now<f.until&&a.hp>0;
  }
  for(const [id,f] of this.flashes)if(!actors.has(id)){this.scene.remove(f.mesh);this.flashes.delete(id);}
  let count=0;for(const c of this.shells){if(!c||c.life<=0)continue;c.life-=dt;c.v.y-=9.8*dt;c.p.addScaledVector(c.v,dt);if(c.p.y<.035){c.p.y=.035;c.v.y=Math.abs(c.v.y)*.3;c.v.x*=.6;c.v.z*=.6;}c.spin+=dt*12;
   this.transform.position.copy(c.p);this.transform.rotation.set(c.spin,c.spin*.6,c.spin*.3);this.transform.scale.set(c.shotgun?1.7:1,c.shotgun?1.4:1,c.shotgun?1.7:1);this.transform.updateMatrix();this.cases.setMatrixAt(count,this.transform.matrix);this.cases.setColorAt(count++,new THREE.Color(c.shotgun?'#b34b35':'#c5a45e'));
  }this.cases.count=count;this.cases.instanceMatrix.needsUpdate=true;if(this.cases.instanceColor)this.cases.instanceColor.needsUpdate=true;
 }
 view(id,now){for(const [key,f] of this.flashes)f.mesh.visible=key!==id&&now<f.until;}
}

``````

## frontend/environment.js
``````
/* Original map-specific scenery and server-clock-driven machinery. */
import * as THREE from 'three';
import {mergeStatic} from './graphics.js';
export function environment(root,id,surfaces){
 const g=new THREE.Group();g.name='environment-'+id;root.add(g);
 const mesh=(geo,kind,c,x,y,z)=>{const m=new THREE.Mesh(geo,surfaces.get(kind,c));m.position.set(x,y,z);g.add(m);return m;};
 const box=(x,y,z,w,h,d,k,c)=>mesh(new THREE.BoxGeometry(w,h,d),k,c,x,y,z);
 if(id==='freight'){
  mesh(new THREE.PlaneGeometry(220,180),'glass','#376477',30,-.25,-65).rotation.x=-Math.PI/2;
  box(30,-.5,17.5,77,1,47,'concrete','#7b827c');
  // Ocean-going cargo vessel beyond the quay, bow and bridge distinct in silhouette.
  const ship=new THREE.Group();ship.name='cargo-ship';ship.position.set(28,0,-31);g.add(ship);
  const shape=new THREE.Shape();shape.moveTo(-35,-5);shape.lineTo(29,-5);shape.lineTo(39,0);shape.lineTo(29,5);shape.lineTo(-35,5);shape.closePath();
  const hull=new THREE.Mesh(new THREE.ExtrudeGeometry(shape,{depth:6,bevelEnabled:true,bevelSize:.4,bevelThickness:.4,bevelSegments:1,steps:1}),surfaces.get('paint','#384b53'));hull.rotation.x=-Math.PI/2;ship.add(hull);
  const sb=(x,y,z,w,h,d,c)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),surfaces.get('paint',c));m.position.set(x,y,z);ship.add(m);};
  sb(-26,9,0,12,6,9,'#d1d3c3');sb(-26,13,0,13,2,10,'#dce1d1');sb(-26,13,-5.05,10,1,.08,'#365662');sb(-26,13,5.05,10,1,.08,'#365662');sb(-29,16,0,2,5,2,'#ab7952');
  for(let x=-16;x<26;x+=7)for(let z=-3;z<=3;z+=3)for(let y=7;y<12;y+=2.5)sb(x,y,z,6.5,2.4,2.8,['#a17157','#75857a','#748d99'][Math.abs(x+z)%3]);
  for(const x of [-8,60]){box(x,10,-10,.5,20,.6,'metal','#bb9b55');box(x+5,20,-10,15,.5,.6,'metal','#bb9b55');}
 }else if(id==='foundry'){
  box(30,-.5,17.5,140,1,120,'concrete','#4d4841');
  for(let i=0;i<16;i++){
   const x=-12+(i%8)*12,z=i<8?-10:46,r=3+(i%3);
   mesh(new THREE.CylinderGeometry(r,r+.4,.18,13),'glow',i%2?'#ff8d22':'#ffbd42',x,.05,z);
   const rim=mesh(new THREE.TorusGeometry(r+.2,.28,6,22),'metal','#49443d',x,.05,z);rim.rotation.x=Math.PI/2;
   for(let j=0;j<4;j++)mesh(new THREE.DodecahedronGeometry(.7+(j%2),0),'metal','#514b43',x+Math.cos(j*1.57)*(r+1),.5,z+Math.sin(j*1.57)*(r+1));
  }
  for(const x of [-16,76])for(const z of [0,25]){mesh(new THREE.CylinderGeometry(2.5,3.5,18,12),'metal','#675c51',x,9,z);mesh(new THREE.CylinderGeometry(.7,1,27,10),'concrete','#675f52',x+4,13,z+4);box(x,5,z,10,1,8,'metal','#967d52');}
 }else if(id==='observatory'){
  mesh(new THREE.CylinderGeometry(53,65,16,40),'rock','#566270',30,-8,17.5);
  for(let i=0;i<22;i++){
   const a=i*Math.PI*2/22,r=62+(i%3)*10,h=25+(i*7%25),x=30+Math.cos(a)*r,z=17.5+Math.sin(a)*r;
   const geo=new THREE.ConeGeometry(19+(i%3)*4,h,11,5);const pos=geo.attributes.position;for(let j=0;j<pos.count;j++){const x=pos.getX(j),y=pos.getY(j),z=pos.getZ(j),k=1+.14*Math.sin(x*.7+z*.37+i);pos.setXYZ(j,x*k+Math.sin(y*.15+i)*2,y,z*k);}geo.computeVertexNormals();
   const mountain=mesh(geo,'rock',i%2?'#687b89':'#526674',x,h/2-5,z);mountain.rotation.y=i;
   const snow=mesh(new THREE.ConeGeometry(6+(i%3),h*.28,7),'rock','#cad8dc',x,h-5-h*.14,z);snow.rotation.y=i;
  }
  for(let i=0;i<38;i++){const a=i*2.399,r=42+(i%4)*3,x=30+Math.cos(a)*r,z=17.5+Math.sin(a)*r;mesh(new THREE.CylinderGeometry(.18,.24,3,6),'metal','#59584a',x,1,z);mesh(new THREE.ConeGeometry(1.6,6,7),'fabric','#354c44',x,3,z);}
 }
 mergeStatic(g);return g;
}
export function machinery(root,id,surfaces,landmark){
 const g=new THREE.Group();g.name='machinery';root.add(g);const state={root:g,id};
 const box=(parent,x,y,z,w,h,d,c)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),surfaces.get('paint',c));m.position.set(x,y,z);parent.add(m);return m;};
 if(id==='freight'){
  const load=new THREE.Group();load.name='crane-load';g.add(load);state.load=load;
  box(load,0,1.3,0,6,2.6,2,'#b3a078');
  for(let x=-2.9;x<3;x+=.35)for(const z of [-1.01,1.01])box(load,x,1.3,z,.045,2.5,.03,'#8d836a');
  for(const x of [-3,3])for(const z of [-1,1])box(load,x,1.3,z,.12,2.6,.12,'#6b766e');
  state.cables=[];for(const x of [-2.6,2.6]){const m=box(g,30+x,5,8,.035,5,.035,'#303a3b');state.cables.push(m);}
  state.trolley=box(g,30,11,8,7,.7,2,'#d1ae58');
  for(const x of [26.5,33.5])box(g,x,11.5,17.5,.4,.7,25,'#c1a056');
  // Landing pads are signals, not extra collisions.
  for(const z of [8,27])for(const x of [26.6,33.4])box(g,x,.025,z,.13,.05,3,'#e8bc5f');
  mergeStatic(load);
 }else if(id==='plaza'){
  state.hand=new THREE.Group();state.hand.name='clock-hazard';state.hand.position.set(30,.95,17.5);g.add(state.hand);
  box(state.hand,8,0,0,10,.24,.32,'#b79a51');box(state.hand,12.4,.02,0,1.2,.3,.8,'#d5bc73');
  for(let x=3.5;x<13;x+=.8)box(state.hand,x,.14,0,.3,.04,.33,'#3a3830');
  mergeStatic(state.hand);
 }else if(id==='observatory'){
  state.dome=new THREE.Group();state.dome.name='rotating-dome';state.dome.position.set(20,3.4,12);landmark.add(state.dome);
  for(const child of [...landmark.children]){
   if(child===state.dome||!child.isMesh)continue;
   child.geometry.computeBoundingBox();const b=child.geometry.boundingBox.clone();child.updateMatrix();b.applyMatrix4(child.matrix);
   if(b.min.y>=3.35){child.position.sub(state.dome.position);state.dome.add(child);}
  }
 }
 return state;
}
export function animateMachinery(m,time,crane){
 if(!m)return;
 if(m.hand)m.hand.rotation.y=-time*Math.PI*2/24;
 if(m.dome)m.dome.rotation.y=time*.12;
 if(m.load){
  const c=crane||{x:27,y:7,w:6,h:2,lift:0};m.load.position.set(c.x+c.w/2,c.lift,c.y+c.h/2);
  m.trolley.position.set(c.x+c.w/2,11,c.y+c.h/2);
  m.cables.forEach((n,i)=>{const bottom=c.lift+2.6;n.position.set(c.x+c.w/2+(i?2.6:-2.6),(11+bottom)/2,c.y+c.h/2);n.scale.y=(11-bottom)/5;});
 }
}

``````

## frontend/firearms.js
``````
/* Original SG-12 pump shotgun and P-9 service pistol, with moving actions. */
import * as THREE from 'three';
import {roundedBox,capsule} from './graphics.js';
const cylinder=new THREE.CylinderGeometry(1,1,1,20);cylinder.userData.shared=true;
export function buildFirearm(key,surfaces){
    const root=new THREE.Group(),moving=new THREE.Group(),magazine=new THREE.Group(),support=new THREE.Group();root.name=key;root.add(moving,magazine,support);
    const mesh=(parent,geometry,tint,x,y,z,sx,sy,sz,kind='gunmetal')=>{const m=new THREE.Mesh(geometry,surfaces.get(kind,tint));m.position.set(x,y,z);m.scale.set(sx,sy,sz);parent.add(m);return m;};
    const box=(p,c,x,y,z,w,h,d,k)=>mesh(p,roundedBox,c,x,y,z,w,h,d,k);
    const tube=(p,c,x,y,z,r,l)=>{const m=mesh(p,cylinder,c,x,y,z,r,l,r);m.rotation.x=Math.PI/2;return m;};
    const dark='#27373d',steel='#798884',grip='#37453d';let muzzle;
    if(key==='pistol'){
        box(root,dark,0,-.035,.015,.07,.075,.22);
        box(root,grip,0,-.115,.07,.064,.17,.085,'rubber').rotation.x=-.23;
        box(magazine,'#17272b',0,-.198,.09,.07,.022,.09,'rubber');box(magazine,'#65716b',0,-.14,.08,.05,.13,.065);
        box(moving,'#71807b',0,.025,-.015,.078,.075,.235);
        tube(root,'#18272b',0,.023,-.141,.022,.028);tube(root,steel,0,.023,-.15,.015,.012);
        box(moving,'#26373b',.040,.028,.01,.005,.029,.06);box(moving,steel,.043,.028,.01,.003,.010,.038);
        for(const x of [-.04,.04])for(let j=0;j<7;j++)box(moving,'#26373b',x,.025,.045+j*.011,.003,.048,.004);
        for(const x of [-.025,.025])box(moving,dark,x,.078,.075,.015,.032,.025);
        box(moving,'#b1c7a2',0,.074,-.10,.009,.019,.012);
        box(root,steel,.042,-.017,.072,.008,.012,.04);
        const guard=mesh(root,new THREE.TorusGeometry(.038,.006,8,20),dark,0,-.077,-.018,1,1,1);guard.rotation.y=Math.PI/2;
        box(root,dark,0,-.063,-.01,.009,.034,.008).rotation.x=-.3;
        muzzle=-.168;
    }else{
        box(root,dark,0,0,.01,.115,.135,.33);
        box(root,grip,0,-.045,.285,.09,.14,.26,'rubber');
        box(root,'#263633',0,-.055,.405,.10,.16,.04,'rubber');
        tube(root,steel,0,.018,-.42,.027,.57);tube(root,dark,0,-.047,-.34,.023,.43);
        tube(root,'#19272b',0,.018,-.713,.029,.025);
        box(moving,'#605b49',0,-.026,-.33,.094,.095,.25,'rubber');
        for(let j=0;j<9;j++)box(moving,dark,0,-.025,-.44+j*.026,.097,.085,.008,'rubber');
        box(root,'#15272b',.06,.018,.025,.007,.048,.11);box(root,steel,.065,.018,.025,.004,.016,.075);
        box(root,dark,0,-.13,.09,.065,.20,.085,'rubber').rotation.x=-.15;
        for(let j=0;j<5;j++)box(root,'#7d8979',0,.079,-.12+j*.045,.08,.014,.012);
        box(root,'#c8d4aa',0,.065,-.65,.012,.04,.018);
        const guard=mesh(root,new THREE.TorusGeometry(.046,.007,8,20),dark,0,-.107,.019,1,1,1);guard.rotation.y=Math.PI/2;
        tube(magazine,'#bb4233',-.03,-.11,-.04,.019,.065);tube(magazine,'#c3a45f',-.03,-.11,-.008,.019,.012);
        muzzle=-.735;
    }
    // Gloves follow the supporting hand and the pump, rather than floating.
    for(const side of [-1,1]){
        const parent=side<0?support:root,x=side<0?-.035:.035,z=side<0?(key==='pistol'?.04:-.33):.105;
        mesh(parent,capsule,'#667369',side*.10,-.25,z+.13,.13,.31,.14,'fabric').rotation.z=side*.33;
        mesh(parent,new THREE.SphereGeometry(1,16,10),'#3c4b3e',x,-.10,z,.069,.065,.08,'fabric');
        for(let f=0;f<4;f++)mesh(parent,capsule,'#3c4b3e',x-.035+f*.023,-.12,z-.04,.021,.06,.03,'fabric').rotation.x=-.7;
    }
    const light=new THREE.PointLight('#ffb861',0,2,.9);light.position.set(0,.02,muzzle);root.add(light);
    const flash=new THREE.Mesh(new THREE.SphereGeometry(1,6,4),new THREE.MeshBasicMaterial({color:'#ffdea0',transparent:true,opacity:.8,depthWrite:false,blending:THREE.AdditiveBlending,toneMapped:false}));flash.position.copy(light.position);flash.scale.set(key==='shotgun'?.075:.035,.05,key==='shotgun'?.23:.10);root.add(flash);
    return {root,moving,magazine,support,light,flash};
}
export function animateFirearm(model,key,shot,reload){
    const cycle=shot>=0&&shot<600?Math.sin(Math.max(0,(shot-80)/520)*Math.PI):0;
    model.moving.position.z=key==='pistol'?Math.max(0,1-shot/105)*.038:cycle*.12;
    model.support.position.z=key==='shotgun'?cycle*.12:0;
    model.support.position.y=-reload*.14;
    model.magazine.position.y=-reload*.17;
    if(key==='shotgun'){model.magazine.visible=reload>0;model.magazine.position.set(-reload*.09,-reload*.17,reload*.08);model.support.position.x=-reload*.08;}else model.support.position.set(reload*.035,-reload*.17,reload*.03);
}

``````

## frontend/game.js
``````
'use strict';
// Cheat FPS 0.5.0: frame-rate camera, analog controls and authoritative server.
const $ = id => document.getElementById(id);
const canvas = $('game'), ctx = canvas.getContext('2d', {alpha:true});
let renderer3d=null, viewportWidth=innerWidth,viewportHeight=innerHeight;
try{if(window.CheatRenderer3D)renderer3d=new window.CheatRenderer3D($('world3d'));}catch(error){console.warn('Canvas fallback:',error.message);}
$('graphicsStatus').textContent=renderer3d?'그래픽: 3D · v0.5.0':'그래픽: 2D 호환 모드 (WebGL2 사용 불가) · v0.5.0';
const CHEATS = ['aim','esp','recoil'];
const LABELS = ['AIM','ESP','NO RECOIL'];
const AIM_CONE=.95;
const WEAPON_ORDER=['rifle','pistol','shotgun'];
const WEAPON_INFO={rifle:{name:'AR',capacity:30,reload_time:1.5},shotgun:{name:'산탄총',capacity:6,reload_time:.7},pistol:{name:'권총',capacity:12,reload_time:1.25}};
function weaponSpec(p){return state?.weapons?.[p.weapon]||WEAPON_INFO[p.weapon]||WEAPON_INFO.rifle;}
const weaponMenus=new Map();
function selectWeapon(i,key){if(!WEAPON_ORDER.includes(key))return;send({type:'weapon',weapon:key},ids[i]);weaponMenus.set(i,performance.now()+3000);}
function cycleWeapon(i=0){const p=state?.players.find(p=>p.id===ids[i]);if(!active()||!p||p.hp<=0)return;const open=(weaponMenus.get(i)||0)>performance.now();weaponMenus.set(i,performance.now()+4500);if(open)selectWeapon(i,WEAPON_ORDER[(WEAPON_ORDER.indexOf(p.weapon||'rifle')+1)%3]);syncControls();}

const contacts = new Map(), sentInputs = new Map();
const nativeTouch = 'ontouchstart' in window;
let tapSerial=0;
const keys = new Set(), local = new Map(), motion = new Map(), samples = new Map();
const effects = new Map(), padEdges = new Map(), spriteCache = new Map(), wallCache = new Map(), weaponCache = new Map();
let ws=null, state=null, ids=[], map=[], phase='', controlIds='', lobbyStamp='';
let closedByUser=false, audio=null, toastTimer, lastFrame=performance.now(), snapshotAt=0;
let rtt=60, pingAt=0, lastSend=0, seq=0, mouseSlot=0, frameMs=16;
let options={sensitivity:1,volume:.25,quality:4};
try { Object.assign(options,JSON.parse(localStorage.getItem('cheat-fps-options')||'{}')); } catch {}
options.sensitivity=Math.max(.3,Math.min(3,Number(options.sensitivity)||1));
options.quality=[2,4,6].includes(Number(options.quality))?Number(options.quality):4;
const touchDevice = matchMedia('(any-pointer:coarse)').matches || navigator.maxTouchPoints>0;
document.body.classList.toggle('touch-device',touchDevice);
const loadouts = [Object.fromEntries(CHEATS.map(k=>[k,false])),Object.fromEntries(CHEATS.map(k=>[k,false]))];
const esc = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const wrap=a=>Math.atan2(Math.sin(a),Math.cos(a));
const mix=(a,b,t)=>a+(b-a)*t;
function control(i) {
    if(!local.has(i)) local.set(i,{f:0,s:0,turn:0,ads:false,fire:new Set(),fireUntil:0,snapUntil:0,reloadUntil:0,look:new Map(),stick:null,view:0,mouseFire:false,mouseAim:false,input:{f:0,s:0,turn:0,aim:false,fire:false,reload:false}});
    return local.get(i);
}
function active(){return state&&['COUNTDOWN','PLAYING','ROUND_END'].includes(state.state)&&!$('settings').open;}
function toast(s){$('toast').textContent=s;$('toast').style.display='block';clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').style.display='none',3500);}
function send(data,id){if(ws?.readyState===WebSocket.OPEN&&ws.bufferedAmount<65536)ws.send(JSON.stringify({...data,id:id||ids[0]}));}
function sound(hit=false,weapon='rifle'){
    if(!audio||audio.state!=='running'||options.volume<=0)return;
    const o=audio.createOscillator(),g=audio.createGain(),t=audio.currentTime;
    o.type=hit?'sine':'sawtooth';o.frequency.setValueAtTime(hit?960:weapon==='shotgun'?90:weapon==='pistol'?220:160,t);o.frequency.exponentialRampToValueAtTime(hit?600:45,t+.075);
    g.gain.setValueAtTime(options.volume*.11,t);g.gain.exponentialRampToValueAtTime(.001,t+.1);
    o.connect(g);g.connect(audio.destination);o.start();o.stop(t+.11);
}
function audioOn(){try{audio ||= new (window.AudioContext||window.webkitAudioContext)();audio.resume().catch(()=>{});}catch{}}
function resetInput(){
    keys.clear();contacts.clear();
    for(const c of local.values()){
        c.f=c.s=c.turn=0;c.ads=c.mouseFire=c.mouseAim=false;c.fire.clear();c.fireUntil=c.snapUntil=c.reloadUntil=0;c.look.clear();c.stick=null;
        c.input={f:0,s:0,turn:0,aim:false,fire:false,reload:false};
    }
    document.querySelectorAll('.stick-knob').forEach(el=>el.style.transform='translate(0,0)');
    document.querySelectorAll('.pressed,.joystick.active').forEach(el=>el.classList.remove('pressed','active'));
    ids.forEach(id=>send({type:'input',f:0,s:0,turn:0,fire:false,aim:false,reload:false},id));
}
function showScreen(name){
    ['menu','lobby','playUI','result'].forEach(id=>$(id).classList.toggle('hidden',id!==name));
    document.body.classList.toggle('playing',name==='playUI');
    if(name==='menu')previewIndex=-1;
    document.body.classList.toggle('split-play',name==='playUI'&&ids.length===2);
}
function syncMenu(){ $('create').textContent='게임 시작'; }
$('mode').onchange=syncMenu;
syncMenu();
let previewMap=[],lastPreview=0,arenaCatalog=[],previewIndex=-1,currentArena=null;
let renderTrain=null;
function trainAt(config,elapsed){
    if(!config)return null;
    const phase=elapsed%config.period,active=phase>=config.warning&&phase<config.warning+(config.end-config.start)/config.speed;
    return {...config,elapsed,active,warning:phase<config.warning,x:active?config.start+config.speed*(phase-config.warning):config.start,
        next_in:phase<config.warning?config.warning-phase:config.period-phase+config.warning};
}
function loadArena(arena){currentArena=arena;map=arena.grid;renderer3d?.loadMap(map,arena);}
function showPreview(index){
    if(!arenaCatalog.length)return;
    previewIndex=index%arenaCatalog.length;const arena=arenaCatalog[previewIndex];previewMap=arena.grid;
    renderer3d?.loadMap(previewMap,arena);$('previewCaption').textContent=arena.name+' / '+arena.landmark;
}
fetch('/arenas').then(r=>{if(!r.ok)throw new Error('arenas');return r.json();}).then(d=>{
    arenaCatalog=d.arenas;
    for(const el of [$('mapChoice'),$('matchMap')])el.innerHTML=arenaCatalog.map(a=>`<option value="${a.id}">${a.name}</option>`).join('');
    $('mapChoice').onchange=()=>{$('mapLandmark').textContent=arenaCatalog.find(a=>a.id===$('mapChoice').value)?.landmark||'';};$('mapChoice').onchange();
    $('matchMap').onchange=()=>send({type:'map',map_id:$('matchMap').value});
    previewMap=arenaCatalog[0].grid;if(!ids.length)showPreview(0);
}).catch(()=>toast('맵 목록을 불러오지 못했다. 새로고침해 주세요.'));
function connect(join=false){
    const old=ws;ws=null;old?.close();resetInput();closedByUser=false;audioOn();state=null;phase='';ids=[];seq=0;
    samples.clear();motion.clear();effects.clear();local.clear();sentInputs.clear();controlIds='';lobbyStamp='';spriteCache.clear();
    showScreen('menu');$('create').disabled=$('join').disabled=true;toast('경기를 준비하는 중…');
    const socket=new WebSocket(`${location.protocol==='https:'?'wss':'ws'}://${location.host}/ws`);ws=socket;
    socket.onopen=()=>socket.send(JSON.stringify({mode:$('mode').value,map_id:$('mapChoice').value||'freight',code:join?$('code').value.trim():'',name:$('mode').value==='ai'?'PLAYER':$('name').value,split:$('mode').value==='local'&&$('split').checked,quick:!join&&$('mode').value==='ai',skins:['scout','warden'],cheats:loadouts}));
    socket.onmessage=e=>{
        if(ws!==socket)return;
        const d=JSON.parse(e.data);
        if(d.type==='welcome'){if(d.version!=='0.5.0'){closedByUser=true;socket.close();toast('업데이트 파일의 버전이 다릅니다. backend와 frontend를 모두 교체한 뒤 재배포해 주세요.');return;}ids=d.ids;loadArena(d.arena);buildControls();toast(d.quick?'AI전 시작 · 화면 드래그 회전 / 탭 발사':`방 ${d.code} · 접속 완료`);}
        else if(d.type==='error')toast(d.message);
        else if(d.type==='pong'&&typeof d.sent==='number')rtt=mix(rtt,clamp(performance.now()-d.sent,0,600),.25);
        else if(d.type==='state')receive(d);
    };
    socket.onerror=()=>toast('서버 연결 실패. 잠시 후 다시 시작해 주세요.');
    socket.onclose=()=>{if(ws!==socket)return;resetInput();state=null;$('create').disabled=$('join').disabled=false;showScreen('menu');document.exitPointerLock?.();if(!closedByUser)toast('연결이 종료되었다. 다시 게임을 시작해 주세요.');};
}
$('create').onclick=()=>{if($('mode').value==='ai')connect();else $('networkSetup').showModal();};
$('hostLocal').onclick=()=>{$('networkSetup').close();connect();};
$('networkClose').onclick=()=>$('networkSetup').close();
$('join').onclick=()=>{if(!$('code').value.trim()){toast('방 코드를 입력해 주세요.');return;}$('networkSetup').close();connect(true);};
function leave(){closedByUser=true;resetInput();const old=ws;ws=null;old?.close();state=null;document.exitPointerLock?.();$('settings').close();$('networkSetup').close();$('create').disabled=$('join').disabled=false;showScreen('menu');}
document.querySelectorAll('.leave').forEach(b=>b.onclick=leave);
$('exit').onclick=()=>{leave();toast('게임을 종료했다. 탭을 닫으면 된다.');};
function settings(){resetInput();document.exitPointerLock?.();['sensitivity','volume','quality'].forEach(k=>$(k).value=options[k]);$('settings').showModal();}
$('pause').onclick=$('settingsOpen').onclick=settings;
$('settingsClose').onclick=()=>{$('settings').close();};
$('settings').addEventListener('cancel',resetInput);
['sensitivity','volume','quality'].forEach(k=>$(k).oninput=()=>{options[k]=Number($(k).value);if(k==='quality')resize();try{localStorage.setItem('cheat-fps-options',JSON.stringify(options));}catch{}});
$('start').onclick=()=>send({type:'start'});
$('again').onclick=()=>send({type:state?.quick?'rematch':'lobby'});
function toggles(p){return CHEATS.map((k,i)=>`<button class="${p.cheats[k]?'on':''}" data-toggle="${k}" data-id="${p.id}">${LABELS[i]}</button>`).join('');}
function lobby(d){
    $('roomCode').textContent=d.code;
    const teams=[0,1].map(t=>d.players.filter(p=>!p.bot&&p.team===t).length);
    $('modeInfo').textContent=`${d.mode==='local'?'로컬 대전':'AI전'} · BLUE ${teams[0]} vs RED ${teams[1]} · ${d.arena.name}`;
    $('matchMap').value=d.map_id;$('matchMap').disabled=!ids.includes(d.host);
    const stamp=JSON.stringify(d.players.map(p=>[p.id,p.name,p.team,p.skin,p.ready,p.cheats]));
    $('start').disabled=!ids.includes(d.host)||!d.can_start;
    $('start').textContent=d.mode==='local'&&!d.can_start?'모두 준비하면 자동 시작':'경기 시작';
    $('controlsInfo').textContent=d.start_hint||(d.mode==='local'?'양 팀 각 1명 이상 · 참가자 전원 준비 시 자동 시작 (팀당 최대 3명).':'참가자가 모두 준비하면 방장이 시작한다.');
    if(stamp===lobbyStamp)return;
    const editing=$('custom').contains(document.activeElement)&&['INPUT','SELECT'].includes(document.activeElement.tagName);
    $('roster').innerHTML=[0,1].map(t=>`<div class="card ${t?'red':'blue'}"><h3>${t?'RED':'BLUE'} / ${d.players.filter(p=>p.team===t).length} OF 3</h3>${d.players.filter(p=>p.team===t).map(p=>`<div class="member"><span>${esc(p.name)} ${p.id===d.host?'♛':''}</span><span>${p.ready?'준비 완료':'편성 중'}</span></div>`).join('')}</div>`).join('');
    if(editing)return;
    lobbyStamp=stamp;
    $('custom').innerHTML=ids.map((id,i)=>{const p=d.players.find(p=>p.id===id);if(!p)return '';return `<div class="card"><h3>PLAYER ${i+1}</h3><label>콜사인<input data-name="${id}" value="${esc(p.name)}" maxlength="16"></label><label>캐릭터<select data-skin="${id}">${['scout','warden','rogue'].map(s=>`<option ${p.skin===s?'selected':''}>${s}</option>`).join('')}</select></label><label>팀<select data-team="${id}" ${d.mode==='ai'?'disabled':''}><option value="0" ${p.team===0?'selected':''}>BLUE</option><option value="1" ${p.team===1?'selected':''}>RED</option></select></label><div class="toggles">${toggles(p)}</div><button data-ready="${id}" class="${p.ready?'on':''}">${p.ready?'준비 취소':'준비 완료'}</button></div>`;}).join('');
}
$('custom').onchange=e=>{
    const el=e.target,id=el.dataset.name||el.dataset.skin||el.dataset.team;if(!id)return;
    const c=el.closest('.card');send({type:'custom',name:c.querySelector('input').value,skin:c.querySelector('[data-skin]').value,team:Number(c.querySelector('[data-team]').value)},id);
};
$('custom').onclick=e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.ready)send({type:'ready'},b.dataset.ready);if(b.dataset.toggle)send({type:'toggle',key:b.dataset.toggle},b.dataset.id);};
function results(d){
    $('resultTitle').textContent=`${d.score[0]>d.score[1]?'BLUE':'RED'} TEAM VICTORY`;$('finalScore').textContent=d.score.join(' : ');
    $('rounds').innerHTML=d.history.map(h=>`<span>R${h.round} · ${h.winner?'RED':'BLUE'}<br><small>${esc(h.reason)}</small></span>`).join('');
    $('stats').innerHTML='<table><thead><tr><th>플레이어</th><th>팀</th><th>킬</th><th>데스</th></tr></thead><tbody>'+d.players.map(p=>`<tr><td>${esc(p.name)}</td><td>${p.team?'RED':'BLUE'}</td><td>${p.kills}</td><td>${p.deaths}</td></tr>`).join('')+'</tbody></table>';
    $('again').disabled=!ids.includes(d.host);$('again').textContent=d.quick?'AI전 다시 플레이':'대기실로 / 재경기';
}
function receive(d){
    const now=performance.now(),oldRound=state?.round;
    if(d.arena&&(d.map_id!==currentArena?.id||(renderer3d&&renderer3d.arenaId!==d.map_id)))loadArena(d.arena);
    const respawn=oldRound!==d.round || (state?.state!=='COUNTDOWN'&&d.state==='COUNTDOWN');
    state=d;snapshotAt=now;
    if(d.grid)map=d.grid;
    if(phase!==d.state){phase=d.state;if(['LOBBY','MATCH_END'].includes(phase))resetInput();showScreen(phase==='LOBBY'?'lobby':phase==='MATCH_END'?'result':'playUI');if(phase==='LOBBY'){lobbyStamp='';document.exitPointerLock?.();}if(phase==='MATCH_END'){document.exitPointerLock?.();results(d);}}
    for(const p of d.players){
        const list=samples.get(p.id)||[];if(respawn)list.length=0;list.push({...p,time:now});if(list.length>12)list.shift();samples.set(p.id,list);
        const prev=effects.get(p.id);
        if(prev){if(p.shots>prev.shots){prev.shotAt=now;if(ids.includes(p.id))sound(false,p.weapon);}if(p.hit>prev.hit){prev.hitAt=now;if(ids.includes(p.id))sound(true);}if(p.hp<prev.hp)prev.hurtAt=now;}
        effects.set(p.id,{...prev,shots:p.shots,hit:p.hit,hp:p.hp});
        const slot=ids.indexOf(p.id);
        if(slot>=0){
            let m=motion.get(p.id);
            if(!m||respawn){
                m={x:p.x,y:p.y,yaw:p.yaw,pitch:p.pitch||0,vx:0,vy:0,offsetX:0,offsetY:0,kick:p.kick||0,stride:0,fov:1.12};
                motion.set(p.id,m);sentInputs.set(p.id,[]);
            }else if(d.state==='PLAYING'&&p.hp>0){
                reconcile(p,m,now);
            }
            if(p.hp===0){m.vx=m.vy=0;}

        }
    }
    if(d.state==='LOBBY')lobby(d);
    syncControls();
}
function protect(e){if(e.cancelable)e.preventDefault();}
function capture(el,e){try{el.setPointerCapture(e.pointerId);}catch{}}
function buildControls(){
    if(controlIds===ids.join(':'))return;controlIds=ids.join(':');
    $('viewControls').innerHTML=ids.map((id,i)=>`<section class="viewport-controls" data-slot="${i}"><div class="weapon-selector hidden">${WEAPON_ORDER.map((key,n)=>`<button data-action="select-weapon" data-weapon="${key}" data-slot="${i}"><b>${n+1}</b><span class="gun-symbol gun-${key}"></span><span>${WEAPON_INFO[key].name}</span></button>`).join('')}</div><div class="look-surface" data-look="${i}"></div><div class="control-hint">P${i+1} · ${i?'↑↓←→ / J,L 회전 / Enter 발사':'WASD / Q,E 회전 / Space 발사'}<br>터치: 이동 · 탭 발사 · 드래그 회전 / 무기 F·O</div><div class="joystick" data-stick="${i}" aria-label="P${i+1} 이동 조이스틱"><div class="stick-knob"></div></div><div class="actions"><button data-action="aim" data-slot="${i}">조준</button><button data-action="fire" class="fire-button" data-slot="${i}">발사</button><button data-action="reload" data-slot="${i}">장전</button></div><button data-action="spectate" data-slot="${i}" class="spectate-button hidden">관전 전환</button><div class="view-cheats"><button data-action="weapon" data-slot="${i}" aria-label="P${i+1} 무기 전환">무기 ↻</button>${CHEATS.map((key,j)=>`<button data-game-cheat="${key}" data-slot="${i}">${LABELS[j]}</button>`).join('')}</div></section>`).join('');
    resize();
}
function clearSelection(){
    if(active()&&document.getSelection()?.rangeCount)document.getSelection().removeAllRanges();
}
function tapFire(i){
    const p=state?.players.find(p=>p.id===ids[i]);
    if(!active()||state.state!=='PLAYING'||!p||p.hp<=0)return;
    const now=performance.now();control(i).snapUntil=now+220;
    assistLocal(i,now,true);
    transmit();send({type:'shoot',serial:++tapSerial},ids[i]);
}
// Touch Events are cancelled before Safari can start selection, a long-press
// callout or a compatibility mouse click. Pointer Events handle mouse and pen.
// Every contact keeps its original owner, even when it crosses the split line.
function inputTime(event){
    const stamp=Number(event.timeStamp);
    if(!Number.isFinite(stamp)||stamp<0)return performance.now();
    return stamp>1e12?stamp-performance.timeOrigin:stamp;
}
function beginContact(key,x,y,target,kind,button=0,time=performance.now()){
    if(!active())return;
    const el=target.closest?.('[data-stick],[data-look],[data-action],[data-game-cheat],#pause');
    if(!el)return;
    clearSelection();audioOn();
    if(el.id==='pause'){settings();return;}
    const i=Number(el.dataset.stick??el.dataset.look??el.dataset.slot),c=control(i);
    const g={el,i,x,y,startX:x,startY:y,time,drag:false,kind,button};
    if(el.dataset.stick!==undefined){
        if(c.stick!==null)return;
        c.stick=key;g.role='stick';el.classList.add('active');
    }else if(el.dataset.look!==undefined){
        if(c.look.size)return;
        g.role='look';c.look.set(key,g);mouseSlot=i;
        if(kind==='mouse'&&button===2){c.mouseAim=true;g.role='aim';}
        else if(kind==='mouse'&&canvas.requestPointerLock){
            try{const promise=canvas.requestPointerLock();promise?.catch(()=>{});}catch{}
        }
    }else if(el.dataset.gameCheat){
        send({type:'toggle',key:el.dataset.gameCheat},ids[i]);g.role='button';
    }else{
        g.role=el.dataset.action;
        if(g.role==='fire'){c.fire.add(key);el.classList.add('pressed');tapFire(i);}
        if(g.role==='reload')send({type:'reload'},ids[i]);
        if(g.role==='aim')c.ads=!c.ads;
        if(g.role==='spectate')c.view++;
        if(g.role==='weapon')cycleWeapon(i);
        if(g.role==='select-weapon')selectWeapon(i,el.dataset.weapon);
    }
    contacts.set(key,g);if(g.role==='stick')moveContact(key,x,y);
}
function moveContact(key,x,y){
    const g=contacts.get(key);if(!g||!active())return;
    const c=control(g.i);
    if(g.role==='stick'){
        const r=g.el.getBoundingClientRect(),radius=r.width*.38;
        let dx=(x-r.left-r.width/2)/radius,dy=(y-r.top-r.height/2)/radius;
        const length=Math.max(1,Math.hypot(dx,dy));dx/=length;dy/=length;
        c.s=Math.abs(dx)<.07?0:dx;c.f=Math.abs(dy)<.07?0:-dy;
        g.el.querySelector('.stick-knob').style.transform=`translate(${dx*radius}px,${dy*radius}px)`;
    }else if(g.role==='look'&&document.pointerLockElement!==canvas){
        if(Math.hypot(x-g.startX,y-g.startY)>8)g.drag=true;
        if(g.drag)rotateLocal(g.i,(x-g.x)*.0035*options.sensitivity,-(y-g.y)*.0035*options.sensitivity);
    }
    g.x=x;g.y=y;
}
function endContact(key,x,y,cancelled=false,time=performance.now()){
    const g=contacts.get(key);if(!g)return;
    const c=control(g.i);
    // Some browsers coalesce all movement into the final touchend position.
    const moved=Math.hypot(x-g.startX,y-g.startY)>8;
    if(g.role==='look'){
        if(!cancelled&&moved)moveContact(key,x,y);
        // Use event creation times: GPU/shader work may delay handlers by
        // seconds even though the user's physical contact lasted 30 ms.
        if(!cancelled&&!moved&&!g.drag&&time-g.time>=0&&time-g.time<320&&document.pointerLockElement!==canvas)tapFire(g.i);
    }
    if(g.role==='stick'&&c.stick===key){c.stick=null;c.f=c.s=0;g.el.querySelector('.stick-knob').style.transform='translate(0,0)';g.el.classList.remove('active');}
    c.look.delete(key);c.fire.delete(key);g.el.classList.remove('pressed');
    if(g.kind==='mouse'){c.mouseFire=c.mouseAim=false;}
    contacts.delete(key);
}
for(const kind of ['touchstart','touchmove','touchend','touchcancel']){
    document.addEventListener(kind,e=>{
        if(!active())return;
        const touches=Array.from(e.changedTouches||[]);
        const belongs=touches.some(t=>contacts.has('t'+t.identifier)||t.target.closest?.('#playUI'));
        if(!belongs)return;protect(e);
        for(const t of touches){
            const key='t'+t.identifier;
            if(kind==='touchstart')beginContact(key,t.clientX,t.clientY,t.target,'touch',0,inputTime(e));
            else if(kind==='touchmove')moveContact(key,t.clientX,t.clientY);
            else endContact(key,t.clientX,t.clientY,kind==='touchcancel',inputTime(e));
        }
    },{capture:true,passive:false});
}
$('playUI').addEventListener('pointerdown',e=>{
    if(e.pointerType==='touch'&&nativeTouch)return;
    if(!active())return;protect(e);
    beginContact('p'+e.pointerId,e.clientX,e.clientY,e.target,e.pointerType,e.button,inputTime(e));
    if(document.pointerLockElement!==canvas)capture(e.target,e);
});
window.addEventListener('pointermove',e=>{if(e.pointerType==='touch'&&nativeTouch)return;moveContact('p'+e.pointerId,e.clientX,e.clientY);});
for(const name of ['pointerup','pointercancel','lostpointercapture'])window.addEventListener(name,e=>{
    if(e.pointerType==='touch'&&nativeTouch)return;
    endContact('p'+e.pointerId,e.clientX,e.clientY,name!=='pointerup',inputTime(e));
});
document.addEventListener('selectionchange',clearSelection);
function syncControls(){
    ids.forEach((id,i)=>{const p=state?.players.find(p=>p.id===id);if(!p)return;const panel=document.querySelector(`.viewport-controls[data-slot="${i}"]`);if(!panel)return;
        panel.querySelectorAll('[data-game-cheat]').forEach(b=>b.classList.toggle('on',p.cheats[b.dataset.gameCheat]));
        panel.querySelector('[data-action="spectate"]').classList.toggle('hidden',p.hp>0);
        panel.querySelector('[data-action="weapon"]').textContent=weaponSpec(p).name+' ↻';
        const menu=panel.querySelector('.weapon-selector');menu.classList.toggle('hidden',performance.now()>(weaponMenus.get(i)||0));menu.querySelectorAll('button').forEach(b=>b.classList.toggle('selected',b.dataset.weapon===p.weapon));
        panel.querySelector('[data-action="aim"]').classList.toggle('on',control(i).ads);
    });
}
['contextmenu','selectstart','dragstart','gesturestart'].forEach(name=>document.addEventListener(name,e=>{if(e.target===canvas||e.target.closest?.('#playUI')){if(e.cancelable)e.preventDefault();}}, {passive:false}));
window.addEventListener('keydown',e=>{
    if(['INPUT','SELECT','TEXTAREA'].includes(e.target.tagName))return;
    if(e.code==='Escape'){if(active())settings();return;}if($('settings').open)return;
    if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code)&&state)e.preventDefault();keys.add(e.code);
    if(!e.repeat){const one=['Digit1','Digit2','Digit3'].indexOf(e.code),two=['Digit7','Digit8','Digit9'].indexOf(e.code);if(one>=0)selectWeapon(0,WEAPON_ORDER[one]);if(two>=0&&ids[1])selectWeapon(1,WEAPON_ORDER[two]);const cheat=['KeyZ','KeyX','KeyC'].indexOf(e.code);if(cheat>=0)send({type:'toggle',key:CHEATS[cheat]});if(e.code==='KeyR')send({type:'reload'},ids[0]);if(e.code==='KeyP'&&ids[1])send({type:'reload'},ids[1]);if(e.code==='KeyF')cycleWeapon(0);if(e.code==='KeyO'&&ids[1])cycleWeapon(1);if(e.code==='KeyV')ids.forEach((_,i)=>control(i).view++);}
});
window.addEventListener('keyup',e=>keys.delete(e.code));
window.addEventListener('blur',resetInput);
document.addEventListener('visibilitychange',()=>{if(document.hidden)resetInput();});
window.addEventListener('pointerup',e=>{if(e.pointerType==='mouse')for(const c of local.values())c.mouseFire=c.mouseAim=false;});
document.addEventListener('pointerlockchange',()=>{if(!document.pointerLockElement){for(const c of local.values())c.mouseFire=c.mouseAim=false;}});
document.addEventListener('mousedown',e=>{
    if(document.pointerLockElement!==canvas||!active())return;
    protect(e);const c=control(mouseSlot);if(e.button===0)c.mouseFire=true;if(e.button===2)c.mouseAim=true;
});
document.addEventListener('mouseup',e=>{for(const c of local.values()){if(e.button===0)c.mouseFire=false;if(e.button===2)c.mouseAim=false;}});
document.addEventListener('mousemove',e=>{if(document.pointerLockElement===canvas&&active())rotateLocal(mouseSlot,e.movementX*.0025*options.sensitivity,-e.movementY*.0025*options.sensitivity);});
function rotateLocal(i,delta,vertical=0){const m=motion.get(ids[i]);if(m&&active()){m.yaw=wrap(m.yaw+delta);m.pitch=clamp((m.pitch||0)+vertical,-1.15,1.15);}}
const down=k=>keys.has(k)?1:0;
function inputs(i,now){
    const c=control(i),has=active(),p=state?.players.find(p=>p.id===ids[i]);
    let f=c.f+(i?down('ArrowUp')-down('ArrowDown'):down('KeyW')-down('KeyS'));
    let s=c.s+(i?down('ArrowRight')-down('ArrowLeft'):down('KeyD')-down('KeyA'));
    let turn=i?down('KeyL')-down('KeyJ'):down('KeyE')-down('KeyQ');
    let fire=c.mouseFire||c.fire.size>0||now<c.fireUntil||!!down(i?'Enter':'Space');
    let aim=c.ads||c.mouseAim||!!down(i?'ShiftRight':'ShiftLeft');
    let reload=now<c.reloadUntil||!!down(i?'KeyP':'KeyR');
    const pads=navigator.getGamepads?Array.from(navigator.getGamepads()).filter(Boolean):[],pad=pads[i];
    if(pad&&has){const dz=v=>Math.abs(v||0)>.16?v:0;f-=dz(pad.axes[1]);s+=dz(pad.axes[0]);turn+=dz(pad.axes[2]);fire ||=pad.buttons[7]?.pressed;aim ||=pad.buttons[6]?.pressed;reload ||=pad.buttons[0]?.pressed;const weaponEdge=`${i}:weapon`;if(pad.buttons[3]?.pressed&&!padEdges.get(weaponEdge))cycleWeapon(i);padEdges.set(weaponEdge,!!pad.buttons[3]?.pressed);[12,13,14].forEach((b,j)=>{const k=`${i}:${b}`,pressed=!!pad.buttons[b]?.pressed;if(pressed&&!padEdges.get(k))send({type:'toggle',key:CHEATS[j]},ids[i]);padEdges.set(k,pressed);});}
    if(!has||p?.hp<=0){f=s=turn=0;fire=aim=reload=false;}
    const len=Math.max(1,Math.hypot(f,s));return c.input={f:f/len,s:s/len,turn:clamp(turn,-1,1),fire:!!fire,aim:!!aim,reload:!!reload};
}
function transmit(){
    if(!state||!ids.length)return;const now=performance.now();seq++;
    ids.forEach((id,i)=>{
        assistLocal(i,now);
        const input=inputs(i,now),m=motion.get(id),packet={type:'input',...input,turn:0,yaw:m?.yaw,pitch:m?.pitch||0,seq};
        send(packet,id);const history=sentInputs.get(id)||[];
        history.push({...packet,time:now});if(history.length>150)history.shift();sentInputs.set(id,history);
    });
    if(now-pingAt>1500){pingAt=now;send({type:'ping',sent:now});}
}
setInterval(transmit,1000/30);
function wall(x,y){return !map[Math.floor(y)]||map[Math.floor(y)][Math.floor(x)]!=='0';}
function moveClient(p,dx,dy){
    for(const [axis,delta] of [['x',dx],['y',dy]]){const x=p.x+(axis==='x'?delta:0),y=p.y+(axis==='y'?delta:0);if([-.44,.44].every(a=>[-.44,.44].every(b=>!wall(x+a,y+b))))p[axis]+=delta;else p[axis==='x'?'vx':'vy']=0;}
}
function ray(x,y,a){
    const dx=Math.cos(a),dy=Math.sin(a);let mx=Math.floor(x),my=Math.floor(y),side=0;
    const ddx=Math.abs(1/(dx||1e-9)),ddy=Math.abs(1/(dy||1e-9)),sx=dx<0?-1:1,sy=dy<0?-1:1;
    let tx=(dx<0?x-mx:mx+1-x)*ddx,ty=(dy<0?y-my:my+1-y)*ddy;
    for(let i=0;i<(map[0].length+map.length+4);i++){if(tx<ty){tx+=ddx;mx+=sx;side=0;}else{ty+=ddy;my+=sy;side=1;}if(wall(mx+.5,my+.5))break;}
    const hit={d:Math.max(.03,side?ty-ddy:tx-ddx),side,mx,my,frac:side?(x+dx*(ty-ddy))%1:(y+dy*(tx-ddx))%1};
    if(renderTrain?.active){
        const t=renderTrain;let enter=0,leave=hit.d,face=0;
        for(const [origin,direction,lo,hi,axis] of [[x,dx,t.x-t.length/2,t.x+t.length/2,0],[y,dy,t.y-t.width/2,t.y+t.width/2,1]]){
            if(Math.abs(direction)<1e-9){if(origin<lo||origin>hi){leave=-1;break;}}
            else{const a=(lo-origin)/direction,b=(hi-origin)/direction;if(Math.min(a,b)>enter){enter=Math.min(a,b);face=axis;}leave=Math.min(leave,Math.max(a,b));}
        }
        if(enter<=leave&&leave>=0)return {d:Math.max(.03,enter),side:face,mx:10,my:6,frac:((face?x+dx*enter:y+dy*enter)%1+1)%1,train:true};
    }
    return hit;
}
function visible(p,q){const d=Math.hypot(q.x-p.x,q.y-p.y);return ray(p.x,p.y,Math.atan2(q.y-p.y,q.x-p.x)).d>=d-.6;}
function integrate(m,input,dt){
    const speed=input.aim?5.7:8.0,yaw=input.yaw??m.yaw;
    const tx=(Math.cos(yaw)*input.f-Math.sin(yaw)*input.s)*speed,ty=(Math.sin(yaw)*input.f+Math.cos(yaw)*input.s)*speed;
    const blend=1-Math.exp(-22*dt),dx=tx*dt+(m.vx-tx)*blend/22,dy=ty*dt+(m.vy-ty)*blend/22;
    m.vx=mix(m.vx,tx,blend);m.vy=mix(m.vy,ty,blend);
    const steps=Math.max(1,Math.ceil(Math.max(Math.abs(dx),Math.abs(dy))/.24));
    for(let n=0;n<steps;n++)moveClient(m,dx/steps,dy/steps);
}
function reconcile(p,m,now){
    const history=sentInputs.get(p.id)||[],ack=history.findIndex(h=>h.seq===p.seq);
    if(ack<0)return;
    // Replay only the portion not yet simulated by the server. The visual
    // offset decays independently, so snapshots never directly yank the view.
    // motion is at lastFrame, not the later message-receive time. Replaying
    // past that boundary would count the same movement again next frame.
    const replayAt=Math.min(now,lastFrame);
    const target={x:p.x,y:p.y,vx:p.vx||0,vy:p.vy||0,yaw:p.yaw};
    let consumed=p.input_age||0,total=0;
    for(let j=ack;j<history.length;j++){
        const h=history[j];if(h.time>=replayAt)break;
        const duration=Math.max(0,(Math.min(history[j+1]?.time??replayAt,replayAt)-h.time)/1000);
        const skip=Math.min(duration,consumed);consumed-=skip;
        const dt=Math.min(duration-skip,.4-total);
        if(dt>0){integrate(target,h,dt);total+=dt;}
        if(total>=.4)break;
    }
    const dx=m.x-target.x,dy=m.y-target.y;
    if(Math.hypot(dx,dy)>4){m.offsetX=m.offsetY=0;}else{m.offsetX+=dx;m.offsetY+=dy;}
    m.x=target.x;m.y=target.y;m.vx=target.vx;m.vy=target.vy;
    if(ack>0)history.splice(0,ack);
}
function assistLocal(i,now,shot=false){
    const p=state?.players.find(p=>p.id===ids[i]),m=motion.get(ids[i]);
    if(!active()||state.state!=='PLAYING'||!p||!m||p.bot||p.hp<=0||!p.cheats.aim)return;
    const input=inputs(i,now);
    if(!shot&&!input.aim&&!input.fire&&now>=control(i).snapUntil)return;
    const me={...p,...m},targets=state.players.filter(q=>q.hp>0&&q.team!==p.team&&Math.hypot(q.x-m.x,q.y-m.y)<=(weaponSpec(p).range||65)&&Math.abs(wrap(Math.atan2(q.y-m.y,q.x-m.x)-m.yaw))<AIM_CONE&&visible(me,q));
    targets.sort((a,b)=>Math.abs(wrap(Math.atan2(a.y-m.y,a.x-m.x)-m.yaw))-Math.abs(wrap(Math.atan2(b.y-m.y,b.x-m.x)-m.yaw))||Math.hypot(a.x-m.x,a.y-m.y)-Math.hypot(b.x-m.x,b.y-m.y)||a.id.localeCompare(b.id));
    if(targets.length){
        const q=targets[0];m.yaw=Math.atan2(q.y-m.y,q.x-m.x);m.pitch=Math.atan2(-.3,Math.hypot(q.x-m.x,q.y-m.y));
        m.lockTarget=q.id;m.lockUntil=now+220;
    }else{m.lockTarget=null;m.lockUntil=0;}
}
function predict(dt,now){
    ids.forEach((id,i)=>{
        const p=state.players.find(p=>p.id===id),m=motion.get(id);if(!p||!m)return;const input=inputs(i,now);m.yaw=wrap(m.yaw+input.turn*3.2*dt);
        const ox=m.x,oy=m.y;
        if(state.state==='PLAYING'&&p.hp>0)integrate(m,{...input,yaw:m.yaw},dt);else m.vx=m.vy=0;
        m.stride+=Math.hypot(m.x-ox,m.y-oy)*2.25;
        const decay=Math.exp(-15*dt);m.offsetX*=decay;m.offsetY*=decay;
        assistLocal(i,now);
        m.kick=mix(m.kick,p.kick||0,1-Math.exp(-20*dt));m.fov=mix(m.fov,input.aim?.88:1.12,1-Math.exp(-12*dt));
    });
}
function interpolated(now){
    return state.players.map(p=>{
        const own=motion.get(p.id);if(ids.includes(p.id)&&p.hp>0&&own)return {...p,...own,x:own.x+own.offsetX,y:own.y+own.offsetY};
        const list=samples.get(p.id)||[],time=now-75;let a=list[0],b=list[list.length-1];if(!a)return p;
        for(let j=1;j<list.length;j++){if(list[j].time>=time){a=list[j-1];b=list[j];break;}a=list[j];}
        const t=a===b?1:clamp((time-a.time)/(b.time-a.time),0,1),yaw=wrap(a.yaw+wrap(b.yaw-a.yaw)*t);
        return {...p,x:mix(a.x,b.x,t),y:mix(a.y,b.y,t),yaw,pitch:mix(a.pitch||0,b.pitch||0,t),vx:mix(a.vx||0,b.vx||0,t),vy:mix(a.vy||0,b.vy||0,t)};
    });
}

// Human silhouettes are built once and cached. Their limbs animate independently
// of server snapshots; eight facing directions give depth to the 2.5D arena.
function humanSprite(team,skin,direction,step){
    const key=`${team}:${skin}:${direction}:${step}`;if(spriteCache.has(key))return spriteCache.get(key);
    const image=document.createElement('canvas');image.width=128;image.height=192;
    const g=image.getContext('2d'),a=direction*Math.PI/4,front=Math.cos(a),side=Math.sin(a);
    const accent=team?'#ef735f':'#63ceef',dark=team?'#763f3a':'#305e70';
    const suit=skin==='rogue'?'#303b40':skin==='warden'?'#626e67':'#54636b';
    const phase=Math.sin(step*Math.PI/4),swing=phase*6,wide=skin==='warden'?1.14:skin==='rogue'?.91:1;
    const cx=64,bodyW=(25+Math.abs(front)*11)*wide;
    const poly=(points,color,stroke='#141f24')=>{g.beginPath();points.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.closePath();g.fillStyle=color;g.fill();if(stroke){g.lineWidth=1.5;g.strokeStyle=stroke;g.stroke();}};
    const oval=(x,y,rx,ry,color)=>{g.beginPath();g.ellipse(x,y,rx,ry,0,0,Math.PI*2);g.fillStyle=color;g.fill();};
    const capsule=(x1,y1,x2,y2,width,color)=>{g.lineCap='round';g.strokeStyle='#18232a';g.lineWidth=width+3;g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke();g.strokeStyle=color;g.lineWidth=width;g.stroke();};
    const metal=g.createLinearGradient(40,0,84,0);metal.addColorStop(0,'#788b91');metal.addColorStop(.45,'#526770');metal.addColorStop(1,'#263c47');
    const limb=(sign,far)=>{
        const x=cx+sign*(8+Math.abs(front)*4),offset=sign*swing;
        capsule(x,116,x+offset,143,13,far?'#26353d':suit);
        capsule(x+offset,143,x+offset*.4,168,12,far?'#283239':'#44545b');
        oval(x+offset,142,8,7,far?'#303d43':'#687776');
        poly([[x+offset*.4-8,163],[x+offset*.4+7,163],[x+offset*.4+10+side*4,176],[x+offset*.4-10+side*4,178]],'#202c32');
        g.fillStyle='#718182';g.fillRect(x+offset*.4-8,173,17,3);
    };
    limb(side>=0?-1:1,true);
    if(front<-.25){poly([[cx-bodyW*.55,68],[cx+bodyW*.65,68],[cx+bodyW*.7,107],[cx-bodyW*.55,110]],'#2b3a3f');g.fillStyle=dark;g.fillRect(cx-bodyW*.48,75,bodyW*.9,23);}
    const arm=(sign,far)=>{
        const x=cx+sign*bodyW*.6,elbowX=x+sign*5+side*8,handX=cx+side*28+sign*8;
        capsule(x,72,elbowX,95,13,far?'#2b3a40':suit);
        capsule(elbowX,95,handX,91,10,far?'#26353b':'#5e7174');
        oval(x,73,skin==='warden'?12:10,12,far?'#263b43':'#58757b');
        g.fillStyle=far?dark:accent;g.fillRect(x-5,68,10,5);oval(handX,91,7,6,'#263c3d');
    };
    arm(side>=0?-1:1,true);
    poly([[cx-bodyW*.6,68],[cx-bodyW*.36,58],[cx+bodyW*.36,58],[cx+bodyW*.6,68],[cx+bodyW*.49,116],[cx-bodyW*.49,116]],metal);
    poly([[cx-bodyW*.43,72],[cx+bodyW*.43,72],[cx+bodyW*.38,101],[cx-bodyW*.36,101]],front>0?dark:'#344c51');
    g.fillStyle=accent;g.fillRect(cx-bodyW*.38,70,bodyW*.76,5);
    if(front>.1){
        for(let j=0;j<3;j++){g.fillStyle='#7c8d84';g.fillRect(cx-16+j*11,92,9,16);g.fillStyle='#3c5656';g.fillRect(cx-15+j*11,94,7,2);}
        g.fillStyle='#b4beb0';g.fillRect(cx-3,76,6,9);
        if(skin==='warden'){poly([[cx-16,77],[cx+16,77],[cx+13,88],[cx-13,88]],'#82968c');g.fillStyle=accent;g.fillRect(cx-10,81,20,3);}
        if(skin==='rogue'){poly([[cx-16,70],[cx-9,70],[cx+16,99],[cx+9,102]],'#8b9f8a');}
    }else{g.strokeStyle='#6c8582';g.lineWidth=2;g.strokeRect(cx-12,79,24,18);}
    g.fillStyle='#1c2d33';g.fillRect(cx-bodyW*.48,110,bodyW*.96,8);g.fillStyle='#a3b1a4';g.fillRect(cx-4,110,8,6);
    limb(side>=0?1:-1,false);
    // Neck, helmet, ears, face shield and a headset remain human proportions.
    g.fillStyle='#bb9881';g.fillRect(cx-6+side*3,52,12,13);
    const headX=cx+side*4;
    oval(headX,43,15,18,'#bda58d');
    oval(headX,36,18*wide,17,skin==='rogue'?'#263c42':metal);
    if(skin==='rogue'){poly([[headX-19,38],[headX-15,24],[headX,16],[headX+16,24],[headX+20,38]],'#263c42');}
    if(skin==='scout'){g.fillStyle='#c1d5cc';g.fillRect(headX-4,20,8,7);g.fillStyle=accent;g.fillRect(headX-2,21,4,3);}
    if(skin==='warden'){g.strokeStyle='#9ba99d';g.lineWidth=2;g.beginPath();g.moveTo(headX-18,29);g.lineTo(headX+18,29);g.stroke();}
    poly([[headX-17*wide,34],[headX+17*wide,34],[headX+16*wide,45],[headX-16*wide,45]],front>=-.1?'#152d36':'#526e72');
    if(front>=-.1){
        const visor=g.createLinearGradient(headX-14,32,headX+14,43);visor.addColorStop(0,'#b9f7ed');visor.addColorStop(.45,accent);visor.addColorStop(1,'#244b58');
        g.fillStyle=visor;g.fillRect(headX-13+side*3,35,23-Math.abs(side)*8,6);
        g.fillStyle='#4d6667';g.fillRect(headX-9+side*4,46,18-Math.abs(side)*6,9);
        g.strokeStyle='#a2b8b2';g.lineWidth=1;g.beginPath();g.moveTo(headX-6,51);g.lineTo(headX+5,51);g.stroke();
    }else{g.fillStyle=accent;g.fillRect(headX-9,35,18,4);}
    oval(headX+(side>=0?14:-14),42,4,8,'#273d45');
    g.strokeStyle='#749593';g.lineWidth=2;g.beginPath();g.moveTo(headX+(side>=0?14:-14),42);g.lineTo(headX+side*9,54);g.stroke();
    arm(side>=0?1:-1,false);
    // Rifle in both hands; side views show its barrel, front views its muzzle.
    g.save();g.translate(cx+side*17,89);g.rotate(side*.14);
    const gunWidth=22+Math.abs(side)*29;
    poly([[-gunWidth*.5,-5],[gunWidth*.5,-5],[gunWidth*.5,4],[-gunWidth*.5,6]],'#24353f');
    g.fillStyle='#819b9f';g.fillRect(-gunWidth*.42,-4,gunWidth*.67,2);
    g.fillStyle='#192b34';g.fillRect(gunWidth*.5-1,-2,8+Math.abs(side)*11,4);
    g.fillStyle=accent;g.fillRect(-4,-4,6,2);
    poly([[-5,4],[3,4],[1,18],[-6,18]],'#304752');g.restore();
    spriteCache.set(key,image);return image;
}
function line(x1,y1,x2,y2,color,width=1){ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();}
function textAt(s,x,y,size=14,color='#e8f0eb',align='left'){
    ctx.font=`${size>=18?'700 ':'600 '}${size}px Arial,sans-serif`;ctx.fillStyle=color;ctx.textAlign=align;ctx.fillText(s,x,y);
}
function rounded(x,y,w,h,r,color){ctx.fillStyle=color;ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill();}
function ground(p,w,h,horizon,proj){
    const sky=ctx.createLinearGradient(0,0,0,horizon);sky.addColorStop(0,'#273b4a');sky.addColorStop(.7,'#738b91');sky.addColorStop(1,'#bac5b5');ctx.fillStyle=sky;ctx.fillRect(0,0,w,horizon);
    const floor=ctx.createLinearGradient(0,horizon,0,h);floor.addColorStop(0,'#586863');floor.addColorStop(.16,'#3d4e4b');floor.addColorStop(1,'#162626');ctx.fillStyle=floor;ctx.fillRect(0,horizon,w,h-horizon);
    const co=Math.cos(p.yaw),si=Math.sin(p.yaw);
    const cam=(x,y)=>({z:(x-p.x)*co+(y-p.y)*si,u:-(x-p.x)*si+(y-p.y)*co});
    const grid=(x,y,xx,yy)=>{
        let a=cam(x,y),b=cam(xx,yy);if(a.z<.08&&b.z<.08)return;
        if(a.z<.08){const t=(.08-a.z)/(b.z-a.z);a={z:.08,u:mix(a.u,b.u,t)};}if(b.z<.08){const t=(.08-b.z)/(a.z-b.z);b={z:.08,u:mix(b.u,a.u,t)};}
        line(w/2+a.u*proj/a.z,horizon+proj*1.5/a.z,w/2+b.u*proj/b.z,horizon+proj*1.5/b.z,'#99aaa11c');
    };
    ctx.save();ctx.beginPath();ctx.rect(0,horizon,w,h-horizon);ctx.clip();
    for(let x=1;x<map[0].length;x+=2)grid(x,1,x,map.length-1);for(let y=1;y<map.length;y+=2)grid(1,y,map[0].length-1,y);
    ctx.restore();
}
function wallMaterial(pillar,brightness){
    const level=Math.round(brightness/4),key=`${pillar}:${level}`;if(wallCache.has(key))return wallCache.get(key);
    const image=document.createElement('canvas');image.width=64;image.height=128;const g=image.getContext('2d');
    g.fillStyle=`hsl(${pillar?185:174} 10% ${level*4}%)`;g.fillRect(0,0,64,128);
    g.fillStyle=`hsl(185 13% ${clamp(level*4-16,12,60)}%)`;g.fillRect(0,83,64,45);
    g.fillStyle=pillar?'#d6ba65':'#a7c5bc';g.globalAlpha=.7;g.fillRect(0,15,64,4);g.globalAlpha=1;
    g.fillStyle='#0b202549';g.fillRect(0,0,2,128);g.fillRect(62,0,2,128);
    g.fillStyle='#d8ece12b';g.fillRect(0,0,64,2);g.fillStyle='#09202670';g.fillRect(0,81,64,2);
    g.fillStyle='#17323822';g.fillRect(10,47,44,1);g.fillRect(10,27,44,1);
    if(pillar==='train'){
        g.fillStyle='#354f3e';g.fillRect(0,0,64,128);g.fillStyle='#b6c9ae';g.fillRect(5,17,54,28);
        g.fillStyle='#182d2e';g.fillRect(8,20,48,22);g.fillStyle='#d6a847';g.fillRect(0,80,64,12);
        g.fillStyle='#1a2528';g.fillRect(0,111,64,17);g.fillStyle='#929e82';g.fillRect(0,58,64,3);
    }
    wallCache.set(key,image);return image;
}
function walls(p,w,h,horizon,proj,fov){
    const columns=Math.ceil(w/options.quality),width=w/columns,depths=new Float32Array(columns);
    const co=Math.cos(p.yaw),si=Math.sin(p.yaw),lens=Math.tan(fov/2);
    for(let i=0;i<columns;i++){
        const camera=(2*(i+.5)/columns-1)*lens,angle=p.yaw+Math.atan(camera),hit=ray(p.x,p.y,angle);
        const z=hit.d/Math.sqrt(1+camera*camera),pillar=hit.mx>0&&hit.mx<map[0].length-1&&hit.my>0&&hit.my<map.length-1,wallHeight=hit.train?4.8:pillar?2.6:3.8,height=proj*wallHeight/z,top=horizon-proj*(wallHeight-1.5)/z,x=i*width;
        depths[i]=z;
        const brightness=clamp(70-z*1.25-(hit.side?9:0),18,70),shade=pillar?brightness-3:brightness;
        const texture=wallMaterial(hit.train?'train':pillar,shade),dy=Math.max(0,top),bottom=Math.min(h,top+height),dh=bottom-dy;
        if(dh>0)ctx.drawImage(texture,Math.floor(hit.frac*63),128*(dy-top)/height,1,128*dh/height,x,dy,width+.6,dh);
    }
    return {depths,width,co,si};
}
function characters(p,roster,w,h,horizon,proj,depth,now){
    const {co,si,depths,width}=depth;
    const projected=roster.filter(q=>q.id!==p.id&&q.hp>0).map(q=>{
        const dx=q.x-p.x,dy=q.y-p.y,z=dx*co+dy*si,u=-dx*si+dy*co;
        return {q,z,x:w/2+u*proj/z,size:proj/z};
    }).filter(t=>t.z>.12).sort((a,b)=>b.z-a.z);
    for(const {q,z,x,size} of projected){
        const hh=size*1.88,ww=hh*128/192,left=x-ww/2,top=horizon+size*1.5-hh;
        if(left>w||left+ww<0)continue;
        const start=clamp(Math.floor(left/width),0,depths.length-1),end=clamp(Math.ceil((left+ww)/width),0,depths.length-1);
        let seen=false;ctx.save();ctx.beginPath();
        let run=-1;
        for(let j=start;j<=end+1;j++){
            const exposed=j<=end&&z<depths[j]+.025;
            if(exposed){seen=true;if(run<0)run=j;}
            else if(run>=0){ctx.rect(run*width,0,(j-run)*width,h);run=-1;}
        }
        ctx.clip();
        if(seen){
            ctx.fillStyle='#03151366';ctx.beginPath();ctx.ellipse(x,horizon+size*1.48,ww*.47,Math.max(2,hh*.045),0,0,Math.PI*2);ctx.fill();
            const facing=wrap(q.yaw-Math.atan2(p.y-q.y,p.x-q.x)),direction=(Math.round(facing/(Math.PI/4))+8)%8;
            const speed=Math.hypot(q.vx||0,q.vy||0),step=speed>.25?Math.floor(now/68+q.x*.4+q.y*.3)%8:0;
            ctx.globalAlpha=clamp(1-z/60,.6,1);ctx.drawImage(humanSprite(q.team,q.skin,direction,step),left,top,ww,hh);ctx.globalAlpha=1;
            const fired=now-(effects.get(q.id)?.shotAt||0);if(fired<65){ctx.fillStyle='#ffe6a5';ctx.beginPath();ctx.arc(x+Math.sin(facing)*ww*.15,top+hh*.46,Math.max(2,hh*.045),0,Math.PI*2);ctx.fill();}
        }
        ctx.restore();
        const allied=q.team===p.team,esp=!allied&&p.cheats.esp;
        if((seen&&allied)||esp){
            const color=allied?'#7bd9ed':'#ff8e7b',font=clamp(ww*.13,9,13),labelY=clamp(top-12,100,h-140);
            if(esp){ctx.strokeStyle=color;ctx.lineWidth=1.5;ctx.setLineDash(seen?[]:[4,3]);ctx.strokeRect(left+ww*.16,top+hh*.08,ww*.68,hh*.84);ctx.setLineDash([]);}
            textAt(`${q.name} · ${q.hp}`,x,labelY,font,color,'center');ctx.fillStyle='#0d1c21c9';ctx.fillRect(x-24,labelY+5,48,3);ctx.fillStyle=color;ctx.fillRect(x-24,labelY+5,48*q.hp/100,3);
        }
    }
}
function rifleModel(team){
    if(weaponCache.has(team))return weaponCache.get(team);
    const image=document.createElement('canvas');image.width=image.height=720;
    const g=image.getContext('2d');g.scale(2,2);g.translate(180,335);
    const stroke=(x1,y1,x2,y2,color,width)=>{g.strokeStyle=color;g.lineWidth=width;g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke();};
    const shape=(points,fill,stroke='#111e23')=>{g.beginPath();points.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.closePath();g.fillStyle=fill;g.fill();if(stroke){g.strokeStyle=stroke;g.lineWidth=2;g.stroke();}};
    const steel=g.createLinearGradient(-60,0,80,0);steel.addColorStop(0,'#596e76');steel.addColorStop(.38,'#9bafb1');steel.addColorStop(.42,'#4b636e');steel.addColorStop(1,'#21333e');
    const sleeve=team?'#6b4843':'#3a5966';
    shape([[-150,25],[-106,-60],[-50,-114],[-23,-102],[-38,-53],[-69,20]],sleeve);
    shape([[122,25],[103,-69],[50,-116],[15,-83],[51,-31],[64,25]],sleeve);
    shape([[-44,-120],[-23,-141],[12,-126],[20,-103],[-2,-81],[-27,-93]],'#42584f');
    // Stock, magazine, receiver, handguard and barrel, in perspective.
    shape([[-21,12],[-62,-67],[-42,-150],[12,-138],[51,-45],[55,12]],'#273b45');
    shape([[-22,-56],[-50,-126],[-26,-187],[22,-170],[46,-107],[20,-45]],steel);
    shape([[-2,-45],[-20,-78],[-16,-114],[26,-104],[35,-58],[16,-34]],'#1d323e');
    shape([[-35,-127],[-34,-189],[-19,-229],[13,-229],[34,-187],[28,-134]],steel);
    shape([[-16,-226],[-10,-271],[8,-271],[15,-226]],'#263d47');
    g.fillStyle='#8aa3a4';g.fillRect(-10,-263,3,36);g.fillStyle='#10252e';g.fillRect(-11,-276,22,8);
    for(let y=-207;y<-141;y+=12){stroke(-26,y,24,y+2,'#18313c',4);stroke(-24,y-3,16,y-1,'#a0b9b14d',1);}
    shape([[-10,-183],[-12,-205],[13,-205],[15,-181]],'#182a32');g.fillStyle='#607e7e';g.fillRect(-7,-200,15,3);
    g.strokeStyle='#9caeaa';g.lineWidth=2;g.strokeRect(-4,-198,10,12);
    g.fillStyle=team?'#ff8a78':'#7cd9ef';g.fillRect(-28,-145,8,19);
    g.save();g.translate(-20,-87);g.rotate(-.24);g.font='600 8px Arial';g.fillStyle='#abbeb8';g.fillText('CHEAT / AR',0,0);g.restore();
    [[-20,-117],[24,-117],[-21,-158],[19,-174]].forEach(([x,y])=>{g.fillStyle='#a9b6af';g.beginPath();g.arc(x,y,2,0,Math.PI*2);g.fill();});
    shape([[36,-109],[61,-112],[79,-90],[73,-60],[48,-68],[26,-92]],'#405c51');
    weaponCache.set(team,image);return image;
}
function secondaryModel(key){
    if(weaponCache.has(key))return weaponCache.get(key);
    const image=document.createElement('canvas');image.width=image.height=360;const g=image.getContext('2d');
    g.translate(180,335);g.lineJoin='round';g.lineWidth=3;g.strokeStyle='#1c2d30';
    const box=(x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(x,y,w,h);g.strokeRect(x,y,w,h);};
    box(-85,-65,58,70,'#526b55');box(28,-60,58,80,'#526b55');
    if(key==='pistol'){
        box(-21,-130,43,130,'#293d40');box(-25,-219,50,107,'#73847e');box(-16,-226,32,16,'#23383d');
        box(-10,-239,20,15,'#1d2d31');box(-25,-140,50,15,'#3f5555');
        for(let j=0;j<6;j++)box(-25,-133+j*7,50,3,'#1b3036');
    }else{
        box(-31,-143,62,165,'#3b4c48');box(-25,-201,50,97,'#798982');box(-13,-297,26,100,'#354b50');
        box(-24,-253,48,87,'#746c51');for(let j=0;j<8;j++)box(-24,-245+j*9,48,3,'#283d3c');
        box(-15,-304,30,13,'#1b3036');box(-5,-319,10,18,'#bfd6a5');
    }
    box(-60,-95,44,56,'#405a49');box(16,-80,44,63,'#405a49');weaponCache.set(key,image);return image;
}
function rifle(p,m,w,h,now){
    const fx=effects.get(p.id)||{},shot=now-(fx.shotAt||0),flash=shot>=0&&shot<55;
    const moving=Math.min(1,Math.hypot(m?.vx||0,m?.vy||0)/7.2),stride=m?.stride||0;
    const ads=m?.fov<1,scale=Math.min(w*.72,h*.72)/330;
    const bobX=Math.sin(stride)*moving*4,bobY=Math.abs(Math.cos(stride))*moving*4;
    const kick=p.cheats.recoil?0:Math.max(0,1-shot/115)*8;
    ctx.save();ctx.translate(w*(ads?.50:.61)+bobX,h+18+bobY+kick);ctx.scale(scale,scale);
    if(p.reload>0){ctx.translate(45,Math.sin(p.reload/weaponSpec(p).reload_time*Math.PI)*85);ctx.rotate(Math.sin(p.reload/weaponSpec(p).reload_time*Math.PI)*.3);}
    ctx.drawImage(p.weapon&&p.weapon!=='rifle'?secondaryModel(p.weapon):rifleModel(p.team),-180,-335,360,360);
    if(flash){
        const glow=ctx.createRadialGradient(0,-278,1,0,-278,55);glow.addColorStop(0,'#fffbe8');glow.addColorStop(.3,'#ffc673d0');glow.addColorStop(1,'#ffac4300');ctx.fillStyle=glow;ctx.fillRect(-60,-338,120,120);
        ctx.beginPath();[[-4,-278],[-19,-303],[-7,-299],[0,-323],[8,-300],[25,-298],[6,-276]].forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fillStyle='#fff1b7';ctx.fill();
    }
    ctx.restore();
}
function radar(p,roster,x,y,size){
    rounded(x,y,size,size,5,'#071c23a3');const scale=(size-14)/Math.max(map[0].length,map.length);
    for(let yy=0;yy<map.length;yy++)for(let xx=0;xx<map[yy].length;xx++)if(map[yy][xx]==='1'){ctx.fillStyle='#839a9660';ctx.fillRect(x+7+xx*scale,y+7+yy*scale,scale,scale);}
    for(const q of roster){if(q.hp<=0||q.team!==p.team&&!p.cheats.esp)continue;ctx.fillStyle=q.id===p.id?'#d5ff68':q.team===p.team?'#72d5ed':'#ff8573';ctx.beginPath();ctx.arc(x+7+q.x*scale,y+7+q.y*scale,q.id===p.id?3:2.2,0,Math.PI*2);ctx.fill();}
    line(x+7+p.x*scale,y+7+p.y*scale,x+7+(p.x+Math.cos(p.yaw)*1.5)*scale,y+7+(p.y+Math.sin(p.yaw)*1.5)*scale,'#d5ff68',1.5);
}
function hud(p,owner,roster,w,h,index,horizon,now){
    const compact=w<560,alive=[0,1].map(t=>state.players.filter(q=>q.hp>0&&q.team===t).length),font=compact?Math.min(15,w/18):19;
    const scoreWidth=Math.min(w-14,compact?270:334);
    rounded(w/2-scoreWidth/2,12,scoreWidth,54,7,'#07171fbc');
    textAt(`BLUE ${alive[0]}   ${state.score[0]} : ${state.score[1]}   ${alive[1]} RED`,w/2,34,font,'#e0efea','center');
    textAt(`${state.arena?.name||''} · R${state.round}/5 · ${Math.ceil(state.timer)}s`,w/2,54,11,'#d0f773','center');
    if(renderTrain&&state.state==='PLAYING'&&owner.hp>0){
        const danger=renderTrain.active||renderTrain.warning;
        const label=renderTrain.active?'기차 통과 중 · 충돌 즉사':renderTrain.warning?`기차 진입 ${Math.ceil(renderTrain.next_in)}초 · 선로 주의`:`다음 기차 ${Math.ceil(renderTrain.next_in)}초`;
        rounded(w/2-Math.min(145,w*.43),70,Math.min(290,w*.86),24,4,danger?'#642e22de':'#07171fbc');
        textAt(label,w/2,86,compact?10:12,danger?'#ffce7b':'#b8c7b5','center');
    }
    if(state.arena?.clock)textAt('회전 시침 주의 · 접촉 피해 35',w/2,85,11,'#ffce7b','center');
    if(state.crane&&(state.crane.moving||state.crane.warning))textAt(state.crane.blocked?'크레인 착지 대기 · 표시 구역에서 이동':'크레인 가동 · 엄폐물 이동 중',w/2,85,11,'#ffce7b','center');
    textAt(`P${index+1} / ${owner.name}${owner.hp<=0?' · 관전':''}`,14,compact?83:88,11,owner.team?'#ffab97':'#a2dcec');
    // Health and ammunition sit above the touch controls, per viewport.
    const touch=touchDevice||ids.length===2,baseline=touch?h-(h<530?208:252):h-66;
    const cardWidth=Math.min(compact?112:138,w*.43),hudFont=w<300?15:19;
    rounded(12,baseline,cardWidth,49,5,'#07191fc9');
    textAt(`HP ${owner.hp}`,23,baseline+22,hudFont,owner.hp<30?'#ff8c76':'#e9f1e9');
    ctx.fillStyle='#314643';ctx.fillRect(23,baseline+31,cardWidth-23,5);ctx.fillStyle=owner.hp<30?'#ef735e':'#c6ff47';ctx.fillRect(23,baseline+31,(cardWidth-23)*owner.hp/100,5);
    const ammo=String(p.ammo).padStart(2,'0');rounded(w-cardWidth-12,baseline,cardWidth,49,5,'#07191fc9');
    textAt(p.reload>0?'RELOADING':`${ammo} / ${p.reserves?.[p.weapon]??0}`,w-24,baseline+22,p.reload>0?Math.min(13,hudFont):hudFont,'#e9f1e9','right');textAt(weaponSpec(p).name,w-24,baseline+39,w<300?7:9,'#8ca9a5','right');
    if(p.weapon==='shotgun'&&p.cooldown>0){textAt('펌프 · '+p.cooldown.toFixed(1)+'s',w-24,baseline-8,11,'#ffc66c','right');}
    if(owner.hp>0&&owner.cheats.aim){
        const m=motion.get(owner.id),locked=m?.lockTarget&&now<m.lockUntil;
        textAt(locked?'AIM LOCK':'AIM · 조준/발사 시 자동 고정',w/2,horizon+38,compact?9:11,locked?'#ffce7b':'#b9d58e','center');
    }
    const gap=6+Math.min(12,p.kick*75),cross=owner.hp>0?'#d9ff75':'#c6dcd5';
    line(w/2-gap-8,horizon,w/2-gap,horizon,cross,1.5);line(w/2+gap,horizon,w/2+gap+8,horizon,cross,1.5);line(w/2,horizon-gap-8,w/2,horizon-gap,cross,1.5);line(w/2,horizon+gap,w/2,horizon+gap+8,cross,1.5);ctx.fillStyle=cross;ctx.fillRect(w/2-1,horizon-1,2,2);
    if(now-(effects.get(p.id)?.hitAt||0)<180){for(const sign of [-1,1]){line(w/2+sign*8,horizon+8,w/2+sign*14,horizon+14,'#fff5d1',2);line(w/2+sign*8,horizon-8,w/2+sign*14,horizon-14,'#fff5d1',2);}}
    if(p.cheats.esp&&w>350){radar(p,roster,14,compact?112:127,compact?85:106);textAt('ESP / LIVE',18,compact?107:121,9,'#d4f77e');}
    if(!compact){state.log.slice(-4).forEach((e,j)=>{textAt(`${e.killer}  ›  ${e.victim}`,w-14,108+j*18,10,e.cause==='train'?'#ffce7b':e.team?'#ffac9b':'#96dbe8','right');});}
    if(owner.hp<=0){rounded(w/2-115,76,230,48,5,'#07191fd4');textAt('KNOCKED OUT',w/2,96,15,'#ff9a84','center');textAt(p.id!==owner.id?`관전: ${p.name}`:'남은 아군 없음',w/2,113,10,'#afc3bd','center');}
    if(state.state==='COUNTDOWN'||state.state==='ROUND_END'){
        rounded(w/2-Math.min(210,w*.42),h*.33-37,Math.min(420,w*.84),95,8,'#061921bb');
        textAt(state.state==='COUNTDOWN'?`ROUND ${state.round} · ${Math.ceil(state.timer)}`:state.message,w/2,h*.33,compact?20:27,'#edffe3','center');
        textAt(state.state==='COUNTDOWN'?(state.message.includes('동시 녹아웃')?state.message:state.train?'기차 충돌 즉사 · 선로에서 대기하지 마세요':'준비 · 치트 토글을 선택하세요'):'다음 라운드를 준비하는 중',w/2,h*.33+26,11,'#adc5b9','center');
    }
    const hurt=now-(effects.get(owner.id)?.hurtAt||0);if(hurt>=0&&hurt<300){ctx.strokeStyle=`rgba(242,79,62,${(1-hurt/300)*.6})`;ctx.lineWidth=14;ctx.strokeRect(3,3,w-6,h-6);}
}
function labels3d(p,roster,rect){
    for(const q of roster){
        if(q.hp<=0||q.id===p.id)continue;
        const enemy=q.team!==p.team;if(enemy&&!p.cheats.esp&&!visible(p,q))continue;
        const box=renderer3d.project(q,rect);if(!box)continue;
        const height=box.bottom-box.top,width=Math.max(10,height*.37),tint=enemy?'#ff9681':'#81e2ff';
        if(enemy&&p.cheats.esp){ctx.strokeStyle=tint;ctx.lineWidth=1.5;ctx.strokeRect(box.x-width/2,box.top,width,height);}
        if(height>12&&(p.cheats.esp||!enemy)){
            textAt(`${q.name} · ${q.hp}`,box.x,box.top-12,Math.min(11,Math.max(8,height*.12)),tint,'center');
            ctx.fillStyle='#163132';ctx.fillRect(box.x-22,box.top-8,44,3);ctx.fillStyle=tint;ctx.fillRect(box.x-22,box.top-8,44*q.hp/100,3);
        }
    }
}
function view(index,roster,w,h,now,rect){
    const owner=roster.find(p=>p.id===ids[index]);if(!owner)return;
    let p=owner;const c=control(index);
    if(owner.hp<=0){const alive=roster.filter(q=>q.team===owner.team&&q.hp>0);if(alive.length)p=alive[c.view%alive.length];}
    const m=motion.get(p.id),fov=p.id===owner.id&&m?m.fov:1.12;
    if(renderer3d&&!renderer3d.lost){
        renderer3d.render(p,rect,fov,now,effects.get(p.id));labels3d(p,roster,rect);
    }else{
        const proj=w/(2*Math.tan(fov/2)),horizon=h*.5+Math.tan(p.pitch||0)*proj;
        ground(p,w,h,horizon,proj);const depth=walls(p,w,h,horizon,proj,fov);
        characters(p,roster,w,h,horizon,proj,depth,now);
        if(p.hp>0)rifle(p,m,w,h,now);
    }
    hud(p,owner,roster,w,h,index,h*.5,now);
}
function viewportLayout(){
    const vertical=ids.length===2&&viewportWidth<viewportHeight;
    return ids.map((_,i)=>({x:vertical?0:i*viewportWidth/ids.length,y:vertical?i*viewportHeight/2:0,w:vertical?viewportWidth:viewportWidth/ids.length,h:vertical?viewportHeight/2:viewportHeight}));
}
function resize(){
    viewportWidth=Math.round(window.visualViewport?.width||innerWidth);viewportHeight=Math.round(window.visualViewport?.height||innerHeight);
    document.documentElement.style.setProperty('--app-height',viewportHeight+'px');
    const ratio=Math.min(devicePixelRatio||1,1,1440/Math.max(viewportWidth,viewportHeight));
    const width=Math.max(1,Math.round(viewportWidth*ratio)),height=Math.max(1,Math.round(viewportHeight*ratio));
    if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;}
    ctx.setTransform(width/viewportWidth,0,0,height/viewportHeight,0,0);
    renderer3d?.resize(viewportWidth,viewportHeight,options.quality);
    viewportLayout().forEach((r,i)=>{const el=document.querySelector(`.viewport-controls[data-slot="${i}"]`);if(el){Object.assign(el.style,{left:r.x+'px',top:r.y+'px',width:r.w+'px',height:r.h+'px',bottom:'auto'});el.classList.toggle('compact-pane',r.h<530);}});
    document.body.classList.toggle('portrait-split',ids.length===2&&viewportWidth<viewportHeight);
}
window.addEventListener('resize',resize);window.visualViewport?.addEventListener('resize',resize);resize();
// Canvas fallback draws the same server map as an isometric overview.
function previewFallback(now){
    ctx.fillStyle='#243b3e';ctx.fillRect(0,0,viewportWidth,viewportHeight);
    const scale=Math.min(viewportWidth/(previewMap[0].length+previewMap.length)*1.1,viewportHeight/(previewMap[0].length+previewMap.length)*1.3),cx=viewportWidth*.65,cy=viewportHeight*.24;
    for(let y=0;y<previewMap.length;y++)for(let x=0;x<previewMap[y].length;x++){
        const px=cx+(x-y-(previewMap[0].length-previewMap.length)/2)*scale*.85,py=cy+(x+y)*scale*.4,solid=previewMap[y][x]==='1',lift=solid?scale*.9:0;
        ctx.beginPath();ctx.moveTo(px,py-lift);ctx.lineTo(px+scale*.85,py+scale*.4-lift);ctx.lineTo(px,py+scale*.8-lift);ctx.lineTo(px-scale*.85,py+scale*.4-lift);ctx.closePath();ctx.fillStyle=solid?'#8b9c8d':'#556d63';ctx.fill();ctx.strokeStyle='#304d47';ctx.stroke();
        if(solid){ctx.beginPath();ctx.moveTo(px-scale*.85,py+scale*.4-lift);ctx.lineTo(px,py+scale*.8-lift);ctx.lineTo(px,py+scale*.8);ctx.lineTo(px-scale*.85,py+scale*.4);ctx.closePath();ctx.fillStyle='#3b5653';ctx.fill();ctx.beginPath();ctx.moveTo(px,py+scale*.8-lift);ctx.lineTo(px+scale*.85,py+scale*.4-lift);ctx.lineTo(px+scale*.85,py+scale*.4);ctx.lineTo(px,py+scale*.8);ctx.closePath();ctx.fillStyle=x<8?'#497c85':'#776153';ctx.fill();}
    }
}
function frame(now){
    const dt=Math.min(.15,Math.max(0,(now-lastFrame)/1000));frameMs=mix(frameMs,now-lastFrame,.05);lastFrame=now;
    ctx.clearRect(0,0,viewportWidth,viewportHeight);
    if(state&&map.length&&['COUNTDOWN','PLAYING','ROUND_END'].includes(state.state)){
        $('world3d').style.visibility='visible';
        renderTrain=trainAt(state.arena?.train,(state.train?.elapsed||0)+(state.state==='PLAYING'?Math.min(.25,(now-snapshotAt)/1000):0));
        renderer3d?.updateTrain(renderTrain);
        renderer3d?.updateMechanisms((state.world_time||0)+(state.state==='PLAYING'?Math.min(.25,(now-snapshotAt)/1000):0),state.crane);
        predict(dt,now);const roster=interpolated(now),rects=viewportLayout();renderer3d?.begin(roster,now);
        for(let i=0;i<ids.length;i++){const r=rects[i];ctx.save();ctx.translate(r.x,r.y);ctx.beginPath();ctx.rect(0,0,r.w,r.h);ctx.clip();view(i,roster,r.w,r.h,now,r);ctx.restore();}
        if(ids.length===2){const r=rects[1];if(r.y)line(0,r.y,viewportWidth,r.y,'#07191f',3);else line(r.x,0,r.x,viewportHeight,'#07191f',3);}
    }else if(!ids.length&&!$('menu').classList.contains('hidden')&&previewMap.length){
        const due=!document.hidden&&now-lastPreview>50;
        if(due){const next=Math.floor(now/12000)%Math.max(1,arenaCatalog.length);if(next!==previewIndex)showPreview(next);}
        renderTrain=trainAt(arenaCatalog[previewIndex]?.train,now/1000);
        if(renderer3d&&!renderer3d.lost){$('world3d').style.visibility='visible';if(due){renderer3d.updateTrain(renderTrain);renderer3d.updateMechanisms(now/1000,null);renderer3d.preview(now);}}
        else{$('world3d').style.visibility='hidden';previewFallback(now);}
        if(due)lastPreview=now;
    }else{$('world3d').style.visibility='hidden';ctx.fillStyle='#0a1013';ctx.fillRect(0,0,viewportWidth,viewportHeight);}
    requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

``````

## frontend/graphics.js
``````
/* Original procedural surfaces and architecture, generated locally at startup. */
import * as THREE from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
export const roundedBox=new RoundedBoxGeometry(1,1,1,1,.065);
export const capsule=new THREE.CapsuleGeometry(.5,1,5,12).scale(1,.5,1);
export function random(seed){return ()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};}
const clamp=n=>Math.max(0,Math.min(255,n));
function noise(n,seed){
    const rng=random(seed),a=Float32Array.from({length:n*n},()=>rng());
    return (u,v)=>{let x=u*n,y=v*n,ix=Math.floor(x),iy=Math.floor(y);x-=ix;y-=iy;x=x*x*(3-2*x);y=y*y*(3-2*y);
        const at=(xx,yy)=>a[((yy+n)%n)*n+(xx+n)%n];return THREE.MathUtils.lerp(THREE.MathUtils.lerp(at(ix,iy),at(ix+1,iy),x),THREE.MathUtils.lerp(at(ix,iy+1),at(ix+1,iy+1),x),y);};
}
function canvas(w,h=w){const c=document.createElement('canvas');c.width=w;c.height=h;return c;}
function textures(kind){
    const N=512,c=canvas(N),g=c.getContext('2d'),pixels=g.createImageData(N,N),heights=new Float32Array(N*N);
    const low=noise(8,11),mid=noise(32,88),fine=noise(128,95),rng=random(73);
    for(let y=0;y<N;y++)for(let x=0;x<N;x++){
        const u=x/N,v=y/N,a=low(u,v),b=mid(u,v),f=fine(u,v),grain=rng()-.5,p=(y*N+x)*4;
        let lum=211+(a-.5)*12+(b-.5)*8+grain*18,h=.45+b*.008+f*.008,green=0,blue=0;
        if(kind==='asphalt'){lum=153+a*12+grain*32;h+=grain*.035;}
        else if(kind==='brick'){
            const row=Math.floor(y/48),xx=(x+(row%2)*64)%128,seam=xx<2||y%48<2;
            lum=seam?145:200+(a-.5)*16+(b-.5)*9+grain*14;green=seam?0:-14;blue=seam?0:-23;h=seam?.42:.46+f*.006;
        }
        else if(kind==='rock'){lum=170+(a-.5)*64+(b-.5)*35+grain*20;h=.45+a*.12+b*.05;}
        else if(kind==='stone'){
            const row=Math.floor(y/128),xx=(x+row%2*128)%256,seam=xx<3||y%128<3;
            lum=seam?85:215+(a-.5)*34+(b-.5)*17+grain*16;h=seam?.12:h;
        }else if(kind==='metal'||kind==='paint'){
            const rib=kind==='paint'?Math.pow((Math.cos(u*Math.PI*32)+1)/2,10):0;
            const rust=Math.max(0,(a*.65+b*.35-.59)*5);lum=221+(a-.5)*15+grain*10-rib*23-rust*35;green=-rust*57;blue=-rust*89;h=.4+b*.025+rib*.20;
            if(y%128<2||x%128<2){lum-=24;h-=.03;}
        }else if(kind==='gunmetal'){lum=226+grain*7+(f-.5)*5;h=.5+grain*.001;}
        else if(kind==='fabric'||kind==='uniform'){
            const weave=(x%4<2?1:-1)*(y%4<2?1:-1);lum=212+b*17+weave*8+grain*10;if(kind==='uniform'){const patch=a*.65+b*.35;lum-=patch<.42?55:patch>.57?24:0;green+=patch<.42?-3:3;blue-=patch>.57?12:0;}h=.45+weave*.025;
        }else if(kind==='skin'){lum=238+b*10+grain*5;h=.5+f*.01;}
        else if(kind==='rubber'){lum=170+b*20+grain*12;h=.5+f*.03;}
        if(kind==='concrete'||kind==='asphalt'){
            const crack=Math.abs(Math.sin(u*27+Math.sin(v*18)*1.5)+Math.sin(v*31)*.25);
            if(crack<.008&&a<.6){lum-=30;h-=.025;}if(a<.22)lum-=7;
        }
        pixels.data[p]=clamp(lum);pixels.data[p+1]=clamp(lum+green);pixels.data[p+2]=clamp(lum+blue);pixels.data[p+3]=255;heights[y*N+x]=h;
    }
    g.putImageData(pixels,0,0);const nc=canvas(N),ng=nc.getContext('2d'),normal=ng.createImageData(N,N),rc=canvas(N),rg=rc.getContext('2d'),rough=rg.createImageData(N,N);
    const sample=(x,y)=>heights[((y+N)%N)*N+(x+N)%N];
    for(let y=0;y<N;y++)for(let x=0;x<N;x++){
        const i=(y*N+x)*4,dx=(sample(x-1,y)-sample(x+1,y))*2,dy=(sample(x,y-1)-sample(x,y+1))*2,len=Math.hypot(dx,dy,1);
        normal.data[i]=(dx/len*.5+.5)*255;normal.data[i+1]=(dy/len*.5+.5)*255;normal.data[i+2]=(1/len*.5+.5)*255;normal.data[i+3]=255;
        const value=(kind==='gunmetal'?175:kind==='metal'?145:kind==='paint'?185:kind==='skin'?195:235)+(sample(x,y)-.5)*60;
        rough.data[i]=rough.data[i+1]=rough.data[i+2]=clamp(value);rough.data[i+3]=255;
    }
    ng.putImageData(normal,0,0);rg.putImageData(rough,0,0);
    const tex=(source,color=false)=>{const t=new THREE.CanvasTexture(source);t.wrapS=t.wrapT=THREE.RepeatWrapping;if(color)t.colorSpace=THREE.SRGBColorSpace;return t;};
    return {map:tex(c,true),normalMap:tex(nc),roughnessMap:tex(rc)};
}
export class Surfaces{
    constructor(renderer){this.cache=new Map();this.textures=new Map();this.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());this.currentQuality=4;}
    get(kind,tint='#ffffff'){
        const key=kind+tint;if(this.cache.has(key))return this.cache.get(key);
        let m;
        if(kind==='glow')m=new THREE.MeshBasicMaterial({color:tint,toneMapped:false});
        else if(kind==='glass')m=new THREE.MeshPhysicalMaterial({color:tint,metalness:.35,roughness:.12,clearcoat:1});
        else{
            if(!this.textures.has(kind)){const maps=textures(kind);for(const t of Object.values(maps))t.anisotropy=this.currentQuality===6?1:this.currentQuality===4?Math.min(4,this.anisotropy):this.anisotropy;this.textures.set(kind,maps);}
            m=new THREE.MeshStandardMaterial({...this.textures.get(kind),color:tint,metalness:(kind==='metal'||kind==='gunmetal')?.6:kind==='paint'?.18:0,roughness:1,normalScale:new THREE.Vector2(kind==='skin'?.15:.6,kind==='skin'?.15:.6),envMapIntensity:kind==='metal'?.8:.25});
        }
        m.userData.persistent=true;m.userData.surface=kind;this.cache.set(key,m);return m;
    }
    quality(q){this.currentQuality=q;for(const maps of this.textures.values())for(const t of Object.values(maps))t.anisotropy=q===6?1:q===4?Math.min(4,this.anisotropy):this.anisotropy;}
}
export function skyTexture(id){
    const c=canvas(1024,512),g=c.getContext('2d'),night=id==='observatory',gradient=g.createLinearGradient(0,0,0,512);
    gradient.addColorStop(0,night?'#102037':'#6a8496');gradient.addColorStop(.43,night?'#526987':'#b7c8cd');gradient.addColorStop(.55,night?'#ad9b92':'#dfccaa');gradient.addColorStop(1,'#747f76');g.fillStyle=gradient;g.fillRect(0,0,1024,512);
    const rng=random(11);for(let i=0;i<100;i++){
        const x=rng()*1024,y=80+rng()*140,rx=20+rng()*110,ry=5+rng()*12;g.save();g.translate(x,y);g.scale(1,ry/rx);
        const cloud=g.createRadialGradient(0,0,1,0,0,rx);cloud.addColorStop(0,night?'rgba(183,175,167,.12)':'rgba(246,239,223,.17)');cloud.addColorStop(1,'rgba(230,228,216,0)');g.fillStyle=cloud;g.fillRect(-rx,-rx,rx*2,rx*2);g.restore();
    }
    if(night){g.fillStyle='#e8eee8';for(let i=0;i<90;i++){g.globalAlpha=rng()*.6;g.fillRect(rng()*1024,rng()*150,1,1);}g.globalAlpha=1;}
    const texture=new THREE.CanvasTexture(c);texture.mapping=THREE.EquirectangularReflectionMapping;texture.colorSpace=THREE.SRGBColorSpace;return texture;
}
export function contactTexture(){const c=canvas(128),g=c.getContext('2d'),rad=g.createRadialGradient(64,64,8,64,64,62);rad.addColorStop(0,'rgba(8,14,11,.6)');rad.addColorStop(.55,'rgba(8,14,11,.27)');rad.addColorStop(1,'rgba(8,14,11,0)');g.fillStyle=rad;g.fillRect(0,0,128,128);return new THREE.CanvasTexture(c);}
function label(root,title,sub,x,y,z,yaw=0,w=1.5,warning=false){
    const c=canvas(512,256),g=c.getContext('2d'),rng=random(112);g.fillStyle=warning?'#c4a25c':'#c6c3ad';g.fillRect(0,0,512,256);g.strokeStyle='#38433b';g.lineWidth=8;g.strokeRect(10,10,492,236);g.fillStyle='#344039';g.textAlign='center';g.font='bold 54px sans-serif';g.fillText(title,256,112,460);g.font='22px sans-serif';g.fillText(sub,256,172,460);
    for(let i=0;i<1600;i++){g.fillStyle=`rgba(50,43,25,${rng()*.17})`;g.fillRect(rng()*512,rng()*256,1+rng()*7,1+rng()*3);}
    const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;
    const mesh=new THREE.Mesh(new THREE.PlaneGeometry(w,w*.5),new THREE.MeshStandardMaterial({map:tex,roughness:.9,side:THREE.DoubleSide}));mesh.position.set(x,y,z);mesh.rotation.y=yaw;root.add(mesh);
}
class Builder{
    constructor(root,surfaces){this.root=root;this.surfaces=surfaces;this.groups=new Map();this.count=0;}
    add(geometry,kind,tint,x,y,z,rotation){const matrix=new THREE.Matrix4(),q=new THREE.Quaternion();if(rotation)q.setFromEuler(new THREE.Euler(...rotation));matrix.compose(new THREE.Vector3(x,y,z),q,new THREE.Vector3(1,1,1));geometry.applyMatrix4(matrix);const mat=this.surfaces.get(kind,tint),list=this.groups.get(mat)||[];list.push(geometry);this.groups.set(mat,list);this.count++;}
    box(x,y,z,w,h,d,kind='concrete',tint='#adae9e',rotation=null){
        const geo=new THREE.BoxGeometry(w,h,d),uv=geo.attributes.uv;for(let i=0;i<uv.count;i++){const face=Math.floor(i/4);uv.setXY(i,uv.getX(i)*(face<2?d:w)/2,uv.getY(i)*(face<4?h:d)/2);}this.add(geo,kind,tint,x,y,z,rotation);
    }
    tube(x,y,z,r,h,kind='metal',tint='#87968a',rotation=null){this.add(new THREE.CylinderGeometry(r,r,h,12),kind,tint,x,y,z,rotation);}
    finish(){for(const [mat,parts] of this.groups){const mesh=new THREE.Mesh(mergeGeometries(parts),mat);mesh.castShadow=mat.userData.surface!=='glow';mesh.receiveShadow=true;mesh.name='architecture-'+mat.userData.surface;this.root.add(mesh);for(const p of parts)p.dispose();}this.root.userData.detailParts=this.count;}
}
export function rectangles(map,accept){
    const seen=new Set(),out=[],W=map[0].length;const free=(x,y)=>map[y]?.[x]==='1'&&!seen.has(y*W+x)&&accept(x,y);
    for(let y=0;y<map.length;y++)for(let x=0;x<W;x++)if(free(x,y)){
        let w=1,d=1;while(free(x+w,y))w++;while(y+d<map.length&&Array.from({length:w},(_,i)=>free(x+i,y+d)).every(Boolean))d++;
        for(let yy=y;yy<y+d;yy++)for(let xx=x;xx<x+w;xx++)seen.add(yy*W+xx);out.push({x,y,w,d});
    }return out;
}
function groundMarks(root,W,D,id){
    const c=canvas(2048,1024),g=c.getContext('2d'),rng=random(101),sx=2048/W,sy=1024/D;
    for(let i=0;i<450;i++){const x=rng()*2048,y=rng()*1024,r=2+rng()*35;g.globalAlpha=.02+rng()*.045;g.fillStyle='#202a21';g.beginPath();g.ellipse(x,y,r,r*.4,0,0,Math.PI*2);g.fill();}
    g.globalAlpha=.43;g.strokeStyle='#cdbb76';g.lineWidth=3;g.setLineDash([12,8]);for(const x of [5.5,W-5.5]){g.beginPath();g.moveTo(x*sx,2*sy);g.lineTo(x*sx,(D-2)*sy);g.stroke();}
    g.setLineDash([]);g.font='bold 44px sans-serif';g.fillStyle='#cac3a4';g.textAlign='center';for(const [x,t] of [[5.5,'01'],[W-5.5,'02']])for(const y of [9.5,17.5,25.5]){g.save();g.translate(x*sx,y*sy);g.rotate(Math.PI/2);g.fillText(t,0,0);g.restore();}
    if(id==='railway'){g.strokeStyle='#d3aa54';g.lineWidth=5;for(const y of [14.9,20.1]){g.beginPath();g.moveTo(0,y*sy);g.lineTo(2048,y*sy);g.stroke();}}
    g.globalCompositeOperation='destination-out';g.globalAlpha=.4;for(let i=0;i<6500;i++)g.fillRect(rng()*2048,rng()*1024,1+rng()*4,1+rng()*2);
    const texture=new THREE.CanvasTexture(c);texture.colorSpace=THREE.SRGBColorSpace;const mesh=new THREE.Mesh(new THREE.PlaneGeometry(W,D),new THREE.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-1}));mesh.rotation.x=-Math.PI/2;mesh.position.set(W/2,.007,D/2);root.add(mesh);
}
export function buildWorld(root,map,theme,surfaces){
    const W=map[0].length,D=map.length,id=theme.id,b=new Builder(root,surfaces),rng=random(21),bounds=theme.landmark_bounds;
    const floorGeo=new THREE.PlaneGeometry(W,D),uv=floorGeo.attributes.uv;for(let i=0;i<uv.count;i++)uv.setXY(i,uv.getX(i)*W/4,uv.getY(i)*D/4);
    const floor=new THREE.Mesh(floorGeo,surfaces.get(id==='plaza'?'stone':id==='railway'?'asphalt':'concrete',id==='plaza'?'#b5b09c':id==='observatory'?'#a3afb3':'#b7b9a9'));floor.rotation.x=-Math.PI/2;floor.position.set(W/2,-.015,D/2);floor.receiveShadow=true;floor.name='arena-floor';root.add(floor);
    const border=(x,y)=>x===0||y===0||x===W-1||y===D-1;
    for(const r of rectangles(map,border)){const x=r.x+r.w/2,z=r.y+r.d/2;b.box(x,1.9,z,r.w,3.8,r.d);b.box(x,.24,z,r.w+.03,.48,r.d+.03,'concrete','#6e7d71');b.box(x,3.78,z,r.w+.08,.17,r.d+.08,'metal','#819184');}
    const central=(x,y)=>bounds&&x>=bounds[0]&&y>=bounds[1]&&x<bounds[0]+bounds[2]&&y<bounds[1]+bounds[3];
    const covers=rectangles(map,(x,y)=>!border(x,y)&&!(central(x,y)&&id!=='freight'));
    const contact=new THREE.MeshBasicMaterial({map:contactTexture(),transparent:true,depthWrite:false,opacity:.7});
    for(let i=0;i<covers.length;i++){
        const r=covers[i],x=r.x+r.w/2,z=r.y+r.d/2,cargo=id==='freight'||id==='railway',research=id==='observatory';
        const tint=cargo?['#829a9c','#b3ae90','#a4866a','#84917c'][i%4]:id==='plaza'?'#c3b69a':research?'#b4c0c1':'#a4a294';
        b.box(x,1.3,z,r.w,2.6,r.d,cargo?'paint':research?'metal':id==='plaza'?'stone':'concrete',tint);
        b.box(x,.09,z,r.w+.035,.18,r.d+.035,'concrete','#667466');b.box(x,2.58,z,r.w+.045,.13,r.d+.045,'metal','#849181');
        if(cargo){
            for(const xx of [r.x+.08,r.x+r.w-.08])for(const zz of [r.y+.08,r.y+r.d-.08])b.box(xx,1.35,zz,.13,2.5,.13,'metal','#8b9c8c');
            for(const zz of [z-.28,z+.28]){b.tube(r.x+.017,1.3,zz,.027,2.15);b.box(r.x-.013,1.22,zz,.045,.09,.22,'metal','#c9c3a0');}
            if(r.w>=3)label(root,'C-'+String(i+1).padStart(2,'0'),'GROSS WT 24 000 KG',x,1.8,r.y-.012,Math.PI,1.1);
        }else if(research||id==='foundry'){
            b.box(x,1.6,r.y-.02,Math.min(r.w-.2,1.6),.7,.045,'metal','#52666c');for(let j=0;j<7;j++)b.box(x,1.35+j*.08,r.y-.05,Math.min(r.w-.3,1.45),.023,.035,'metal','#9cac9b');
            if(r.w>=3)label(root,research?'RESEARCH':'CAUTION',research?'AUTHORIZED PERSONNEL':'HIGH VOLTAGE',x,.65,r.y-.013,Math.PI,1.1,!research);
        }else{b.box(x,.30,z,r.w+.06,.19,r.d+.06,'stone','#c9bea1');b.box(x,2.42,z,r.w+.09,.20,r.d+.09,'stone','#c9bea1');}
        const shadow=new THREE.Mesh(new THREE.PlaneGeometry(r.w+2,r.d+2),contact);shadow.rotation.x=-Math.PI/2;shadow.position.set(x,.002,z);root.add(shadow);
    }
    // Utility pipes and lamps remain in the blocked perimeter footprint.
    for(let x=3;x<W-2;x+=6)for(const z of [.5,D-.5]){b.box(x,2,z,.32,4,.42,'concrete','#979d8f');b.tube(x+.22,2.9,z,.055,1.6);b.box(x,3.15,z>.5?D-1.025:1.025,.8,.22,.18,'metal','#3e5052');b.box(x,3.13,z>.5?D-1.13:1.13,.62,.075,.025,'glow','#e9d9a8');}
    for(const z of [.35,D-.35]){b.tube(W/2,3.35,z,.065,W-3,'metal','#a08f71',[0,0,Math.PI/2]);b.tube(W/2,2.93,z,.035,W-3,'metal','#7e9183',[0,0,Math.PI/2]);}
    for(const [z,yaw] of [[1.02,0],[D-1.02,Math.PI]])label(root,id.toUpperCase(),'SECTOR  /  60 x 35 M',W/2,2.15,z,yaw,4.5);
    // Background buildings sit outside the playable area, leaving lanes intact.
    for(let i=0;i<(['freight','foundry','observatory'].includes(id)?0:18);i++){
        const side=i%4,along=2+Math.floor(i/4)*14,depth=7+rng()*5,h=7+rng()*11,x=side<2?along:side===2?-depth/2-4:W+depth/2+4,z=side>=2?along*.5:side===0?-depth/2-4:D+depth/2+4,w=side<2?10+rng()*4:depth,d=side<2?depth:8+rng()*4;
        // Keep the train's approach/departure corridor clear outside the gates.
        if(id==='railway'&&side>=2&&Math.abs(z-17.5)<d/2+3)continue;
        b.box(x,h/2,z,w,h,d,i%2?'brick':'concrete',['#8c9189','#aaac9b','#93958a'][i%3]);b.box(x,h+.12,z,w+.25,.24,d+.25,'metal','#7f8c7e');
        for(let level=2;level<h-1;level+=2.5){
            if(side<2)for(let xx=x-w/2+1.2;xx<x+w/2-.5;xx+=2){b.box(xx,level,z+(side===0?d/2:-d/2)*1.001,1.03,1.2,.025,'glass','#506972');b.box(xx,level,z+(side===0?d/2:-d/2)*1.003,.07,1.2,.04,'metal','#8c9685');}
            else for(let zz=z-d/2+1;zz<z+d/2-.5;zz+=2)b.box(x+(side===2?w/2:-w/2)*1.001,level,zz,.025,1.2,1,'glass','#506972');
        }
        if(i%3===0){b.tube(x,h+1.3,z,.35,2.6);b.box(x,h+.65,z+1.2,1.5,1.3,1,'metal','#8c9b88');}if(i%5===0)b.tube(x,h+4,z,.55,8,'concrete','#a19a86');
    }
    for(const z of [-3,D+3]){const pts=[];for(let i=0;i<=24;i++)pts.push(new THREE.Vector3(-2+i*(W+4)/24,10-Math.sin(i/24*Math.PI)*2,z));root.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),32,.018,4),surfaces.get('rubber','#38443b')));}
    groundMarks(root,W,D,id);b.finish();root.userData.coverFootprints=covers;root.userData.graphicsRevision='industrial-1';return floor;
}

// Keep group transforms (train and wheels) while merging their static parts.
export function mergeStatic(root,excluded=new Set()){
    const groups=new Map();
    for(const child of [...root.children]){
        if(child.isGroup){mergeStatic(child,excluded);continue;}
        if(!child.isMesh||excluded.has(child)||child.material.transparent)continue;
        child.updateMatrix();const geo=child.geometry.clone().applyMatrix4(child.matrix);
        const layout=(geo.index?'indexed:':'plain:')+Object.keys(geo.attributes).sort().join(',');
        let layouts=groups.get(child.material);if(!layouts){layouts=new Map();groups.set(child.material,layouts);}const list=layouts.get(layout)||[];list.push(geo);layouts.set(layout,list);
        root.remove(child);if(!child.geometry.userData.shared)child.geometry.dispose();
    }
    for(const [material,layouts] of groups)for(const list of layouts.values()){
        const merged=new THREE.Mesh(mergeGeometries(list),material);merged.castShadow=merged.receiveShadow=true;root.add(merged);for(const g of list)g.dispose();
    }
}

``````

## frontend/index.html
``````
<!doctype html>
<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"><title>Cheat FPS</title><link rel="stylesheet" href="/static/style.css?v=0.5.0"></head>
<body>
<canvas id="world3d" aria-hidden="true"></canvas>
<canvas id="game"></canvas>
<main id="menu" class="screen"><div class="menu-content"><h1>CHEAT<span>FPS</span></h1><div class="menu-actions"><label for="mode">모드</label><select id="mode"><option value="ai">AI전</option><option value="local">로컬 대전</option></select><button id="create" class="primary">게임 시작</button><div class="menu-links"><button id="settingsOpen">설정</button><button id="exit">종료</button></div></div></div><div id="previewCaption" aria-live="off"></div><small class="menu-version">v0.5.0</small></main>
<dialog id="networkSetup"><h2>로컬 대전</h2><p>양 팀 각 1명 이상 · 참가자 전원 준비 시 자동 시작.<br>2인 분할 화면도 각자 준비 완료를 눌러 주세요.</p><label>콜사인<input id="name" maxlength="16" value="CHEATER"></label><label class="check"><input type="checkbox" id="split">같은 기기에서 2인 참가</label><label>맵<select id="mapChoice"></select></label><p id="mapLandmark"></p><button id="hostLocal" class="primary">방 만들기</button><div id="joinRow" class="join"><input id="code" maxlength="6" placeholder="6자리 방 코드"><button id="join">참가</button></div><button id="networkClose">돌아가기</button></dialog>
<div id="lobby" class="screen hidden"><div class="wide"><div class="eyebrow">PRE-MATCH / TEAM ASSEMBLY</div><h2>팀 편성 <span id="roomCode"></span></h2><p id="modeInfo"></p><label>맵<select id="matchMap"></select></label><div id="roster" class="teams"></div><div id="custom" class="teams"></div><p>치트 버튼은 장착과 활성화를 동시에 전환한다. 경기 중에도 제한 없이 변경할 수 있다.</p><div class="row"><button id="start" class="primary">경기 시작</button><button class="leave">메인 메뉴</button></div><p id="controlsInfo"></p></div></div>
<div id="playUI" class="hidden"><div id="viewControls"></div><button id="pause" class="floating">☰ / ESC</button></div>
<div id="result" class="screen hidden"><div class="wide"><div class="eyebrow">SENTENCE COMPLETE</div><h2 id="resultTitle"></h2><h1 id="finalScore"></h1><div id="rounds"></div><div id="stats"></div><div class="row"><button id="again" class="primary">다시 플레이</button><button class="leave">메인 메뉴</button></div></div></div>
<dialog id="settings"><h2>설정 & 조작</h2><p id="graphicsStatus"></p><label>시점 감도<input id="sensitivity" type="range" min="0.3" max="3" step="0.1"></label><label>사운드<input id="volume" type="range" min="0" max="1" step="0.05"></label><label>렌더 품질<select id="quality"><option value="2">높음</option><option value="4">보통 · 자동 최적화</option><option value="6">낮음 · 그림자 끄기</option></select></label><p>높음: 정밀 그림자·고해상도.<br>보통: 지형 그림자·자동 해상도 조절.<br>낮음: 재질과 모델 유지, 그림자·보조 조명 축소.</p><p>1P: WASD 이동 · 마우스 / Q,E 회전<br>좌클릭 / Space 발사 · 우클릭 / Shift 조준<br>R 장전 · 1/2/3 무기 · Z/X/C 치트 · F 무기 HUD · V 관전 대상 변경<br>2P: 방향키 이동 · J,L 회전 · Enter 발사<br>오른쪽 Shift 조준 · P 장전 · 7/8/9 무기 · O 무기 HUD · 치트는 화면 버튼<br>게임패드: 좌 스틱 이동 · 우 스틱 회전<br>RT 발사 · LT 조준 · A 장전 · Y 무기 HUD · 방향패드 치트</p><p>모바일: 각 화면 왼쪽 조이스틱으로 이동.<br>빈 화면을 짧게 탭하면 발사, 드래그하면 회전.<br>발사 버튼을 누르면 연사. 조준 버튼은 토글이다.<br>AIM: 켠 뒤 조준 또는 발사하면 자동 고정.<br>2인 화면은 가로 모드에서 좌우, 세로 모드에서 위아래로 나뉜다.</p><button id="settingsClose" class="primary">닫기 / 계속</button><button class="leave">메인 메뉴</button></dialog>
<div id="toast" role="status"></div>
<script src="/static/renderer3d.js?v=0.5.0"></script>
<script src="/static/game.js?v=0.5.0"></script></body></html>

``````

## frontend/locomotive.js
``````
/* Original compact B-B diesel shunter. Model coordinates are metres. */
import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';

function paintMaps(surfaces){
    if(surfaces.dieselFinish)return surfaces.dieselFinish;
    let seed=93;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
    const c=document.createElement('canvas');c.width=c.height=512;const g=c.getContext('2d'),pixels=g.createImageData(512,512);
    for(let i=0;i<pixels.data.length;i+=4){const v=224+(random()-.5)*11;pixels.data[i]=pixels.data[i+1]=pixels.data[i+2]=v;pixels.data[i+3]=255;}g.putImageData(pixels,0,0);
    for(let i=0;i<550;i++){g.strokeStyle=`rgba(75,77,67,${.015+random()*.055})`;const x=random()*512,y=random()*512;g.beginPath();g.moveTo(x,y);g.lineTo(x+random()*24,y+random()*2);g.stroke();}
    const map=new THREE.CanvasTexture(c);map.colorSpace=THREE.SRGBColorSpace;map.wrapS=map.wrapT=THREE.RepeatWrapping;map.anisotropy=4;
    const result={map};surfaces.dieselFinish=result;return result;
}

function material(surfaces,key,tint,roughness=.7,metalness=.35){
    const id='diesel:'+key;if(surfaces.cache.has(id))return surfaces.cache.get(id);
    const m=new THREE.MeshStandardMaterial({...paintMaps(surfaces),color:tint,roughness,metalness,envMapIntensity:.8});m.userData.persistent=true;m.userData.surface='locomotive';surfaces.cache.set(id,m);return m;
}

function decal(root,text,x,y,z,w,h,yaw=0){
    const c=document.createElement('canvas');c.width=512;c.height=128;const g=c.getContext('2d');g.clearRect(0,0,512,128);g.fillStyle='#e8e5d4';g.font='500 76px monospace';g.textAlign='center';g.fillText(text,256,88,490);
    const texture=new THREE.CanvasTexture(c);texture.colorSpace=THREE.SRGBColorSpace;
    const mesh=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshStandardMaterial({map:texture,transparent:true,depthWrite:false,roughness:.85,polygonOffset:true,polygonOffsetFactor:-1}));mesh.position.set(x,y,z);mesh.rotation.y=yaw;root.add(mesh);
}

function hazardMaterial(){
    const c=document.createElement('canvas');c.width=512;c.height=128;const g=c.getContext('2d');g.fillStyle='#d2b75e';g.fillRect(0,0,512,128);g.fillStyle='#303631';
    for(let x=-128;x<640;x+=96){g.beginPath();g.moveTo(x,0);g.lineTo(x+47,0);g.lineTo(x-81,128);g.lineTo(x-128,128);g.closePath();g.fill();}
    const texture=new THREE.CanvasTexture(c);texture.colorSpace=THREE.SRGBColorSpace;return new THREE.MeshStandardMaterial({map:texture,roughness:.78,metalness:.25});
}

export function buildDieselLocomotive(surfaces){
    const root=new THREE.Group();root.name='diesel-locomotive';const wheels=[],fans=[];
    const body=material(surfaces,'body','#405a5b',.67,.32),cream=material(surfaces,'cream','#b9b6a1',.7,.25),frame=material(surfaces,'frame','#353f3c',.82,.5);
    const cast=material(surfaces,'cast','#414b47',.82,.55),steel=material(surfaces,'steel','#a3aaa0',.32,.85),dark=material(surfaces,'dark','#222b29',.88,.25),safety=material(surfaces,'safety','#d9bc6b',.64,.35);
    const glassKey='diesel:glass';if(!surfaces.cache.has(glassKey)){const m=new THREE.MeshPhysicalMaterial({color:'#385962',roughness:.13,metalness:.12,clearcoat:1,transparent:true,opacity:.76,depthWrite:false,side:THREE.DoubleSide});m.userData.persistent=true;surfaces.cache.set(glassKey,m);}const glass=surfaces.cache.get(glassKey);
    const lensKey='diesel:headlight';if(!surfaces.cache.has(lensKey)){const m=new THREE.MeshStandardMaterial({color:'#fff1cc',emissive:'#e9c788',emissiveIntensity:.65,roughness:.15,metalness:.1});m.userData.persistent=true;surfaces.cache.set(lensKey,m);}const lens=surfaces.cache.get(lensKey);
    const tail=material(surfaces,'tail-lamp','#aa5240',.18,.1);tail.emissive.set('#7c2012');tail.emissiveIntensity=.35;
    function add(parent,geometry,mat,x,y,z){const m=new THREE.Mesh(geometry,mat);m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;parent.add(m);return m;}
    function box(parent,mat,x,y,z,w,h,d,r=0){return add(parent,r?new RoundedBoxGeometry(w,h,d,1,r):new THREE.BoxGeometry(w,h,d),mat,x,y,z);}
    function cylinder(parent,mat,x,y,z,r,length,axis='y',segments=16){const m=add(parent,new THREE.CylinderGeometry(r,r,length,segments),mat,x,y,z);if(axis==='z')m.rotation.x=Math.PI/2;if(axis==='x')m.rotation.z=Math.PI/2;return m;}
    function rod(parent,mat,a,b,r=.025){const start=new THREE.Vector3(...a),end=new THREE.Vector3(...b),d=end.clone().sub(start);const m=add(parent,new THREE.CylinderGeometry(r,r,d.length(),8),mat,...start.clone().add(end).multiplyScalar(.5).toArray());m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());return m;}
    function ring(parent,mat,x,y,z,r,tube=.025,axis='z'){const m=add(parent,new THREE.TorusGeometry(r,tube,6,24),mat,x,y,z);if(axis==='y')m.rotation.x=Math.PI/2;if(axis==='x')m.rotation.y=Math.PI/2;return m;}

    // Chassis, underfloor fuel tank, crossmembers and two independent bogies.
    box(root,frame,0,1.18,0,10.7,.25,3.45,.025);
    for(const z of [-1.35,1.35])box(root,frame,0,.99,z,10.0,.26,.16);
    box(root,frame,0,.67,0,3.0,.68,1.72,.08);for(const x of [-1.24,1.24])box(root,steel,x,.66,0,.07,.61,1.76);
    cylinder(root,steel,.8,.85,1.03,.10,.22,'z');box(root,dark,-.65,.49,0,1.2,.18,1.4,.03);
    for(const center of [-3.12,3.12]){
        const bogie=new THREE.Group();bogie.position.set(center,.14,0);bogie.name='bogie';root.add(bogie);
        box(bogie,cast,0,.68,0,2.5,.30,2.12,.06);box(bogie,dark,0,.82,0,1.45,.12,1.45);
        for(const side of [-1,1]){
            box(bogie,cast,0,.64,side*1.04,2.48,.28,.17,.045);
            for(const xx of [-.76,.76]){
                box(bogie,cast,xx,.60,side*1.06,.40,.40,.22,.045);cylinder(bogie,steel,xx,.58,side*1.20,.11,.055,'z');
                // Helical suspension, tucked above the journal boxes.
                const points=[];for(let i=0;i<=32;i++){const a=i/32*Math.PI*6;points.push(new THREE.Vector3(Math.cos(a)*.105,i/32*.33,Math.sin(a)*.105));}
                add(bogie,new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),28,.024,5,false),steel,xx,.77,side*.99);
            }
            cylinder(bogie,cast,0,.53,side*1.13,.085,.70,'x');
            rod(bogie,steel,[-1.1,.40,side*.97],[1.1,.40,side*.97],.027);
        }
        for(const xx of [-.76,.76]){
            cylinder(bogie,steel,xx,.56,0,.085,1.74,'z');box(bogie,cast,xx,.66,0,.42,.30,.84,.035);
            for(const side of [-1,1]){
                const wheel=new THREE.Group();wheel.position.set(xx,.56,side*.82);bogie.add(wheel);wheels.push(wheel);
                cylinder(wheel,steel,0,0,0,.48,.18,'z',28);
                cylinder(wheel,cast,0,0,side*.10,.36,.035,'z',24);
                cylinder(wheel,steel,0,0,side*.14,.15,.10,'z',20);
                ring(wheel,steel,0,0,side*.125,.38,.022);
                cylinder(wheel,steel,0,0,-side*.10,.495,.028,'z',28);
                for(let j=0;j<6;j++){const a=j*Math.PI/3;cylinder(wheel,steel,Math.cos(a)*.23,Math.sin(a)*.23,side*.13,.023,.025,'z',6);}
                box(bogie,dark,xx+.38,.57,side*.78,.09,.27,.18,.015);
            }
        }
    }

    // Flat walkways frame a narrow, chamfered long hood rather than a boiler.
    for(const side of [-1,1]){
        box(root,cast,0,1.36,side*1.58,10.65,.065,.50,.012);
        for(let x=-5;x<5.1;x+=.24)box(root,steel,x,1.398,side*1.58,.028,.012,.42);
    }
    const hoodShape=new THREE.Shape();hoodShape.moveTo(-1.22,0);hoodShape.lineTo(1.22,0);hoodShape.lineTo(1.22,1.30);hoodShape.lineTo(.98,1.55);hoodShape.lineTo(-.98,1.55);hoodShape.lineTo(-1.22,1.30);hoodShape.closePath();
    const hood=new THREE.ExtrudeGeometry(hoodShape,{depth:6.85,bevelEnabled:true,bevelSize:.025,bevelThickness:.025,bevelSegments:1,steps:1});hood.rotateY(Math.PI/2);add(root,hood,body,-2.02,1.46,0);
    box(root,body,5.03,2.15,0,.38,1.35,2.38,.035);box(root,cream,5.233,1.98,0,.025,.17,2.30);
    box(root,body,-4.94,1.89,0,.75,.91,2.63,.04);box(root,cream,-4.94,2.37,0,.79,.10,2.66,.025);
    for(const side of [-1,1]){
        box(root,cream,1.38,1.98,side*1.235,6.78,.17,.024);
        // Engine-access doors: thin seams, hinges and individual handles.
        for(let i=0;i<5;i++){
            const x=-1.43+i*.71;box(root,body,x,2.32,side*1.25,.65,1.12,.025,.008);
            for(const xx of [x-.325,x+.325])box(root,cast,xx,2.30,side*1.27,.012,1.14,.012);
            rod(root,steel,[x+.20,2.16,side*1.30],[x+.20,2.39,side*1.30],.016);
            for(const y of [1.86,2.73])box(root,steel,x-.24,y,side*1.28,.045,.055,.025,.005);
        }
        // A recessed radiator grille with actual louver depth.
        box(root,dark,3.49,2.29,side*1.254,1.82,1.14,.035);
        for(let i=0;i<22;i++)box(root,cast,2.64+i*.081,2.29,side*1.29,.029,1.08,.055);
        for(const y of [1.72,2.86])box(root,steel,3.49,y,side*1.28,1.9,.035,.04);
        decal(root,'CF 040',1.0,2.82,side*1.282,1.23,.28,side<0?Math.PI:0);
    }

    // Raised cab, separate glazing and a simple interior behind the glass.
    box(root,body,-3.25,2.10,0,2.78,1.34,3.02,.045);box(root,cream,-3.25,2.88,0,2.81,.22,3.05,.025);
    const roofProfile=new THREE.Shape();roofProfile.moveTo(-4.76,4.02);roofProfile.lineTo(-4.56,4.30);roofProfile.lineTo(-1.98,4.30);roofProfile.lineTo(-1.75,4.02);roofProfile.closePath();
    const roof=new THREE.ExtrudeGeometry(roofProfile,{depth:3.23,bevelEnabled:true,bevelSize:.035,bevelThickness:.025,bevelSegments:1});add(root,roof,cream,0,0,-1.615);
    for(const side of [-1,1]){
        for(const x of [-4.55,-3.55,-1.96])box(root,cream,x,3.51,side*1.49,.085,1.05,.11,.012);
        box(root,cream,-3.25,3.0,side*1.51,2.66,.075,.11);
        box(root,cream,-3.25,4.0,side*1.51,2.66,.065,.11);
        const sidePane=add(root,new THREE.PlaneGeometry(2.48,.88),glass,-3.25,3.5,side*1.518);if(side<0)sidePane.rotation.y=Math.PI;
        box(root,cast,-3.26,3.50,side*1.533,.035,.88,.025);
        box(root,cast,-4.05,2.16,side*1.524,.015,1.25,.015);box(root,cast,-2.53,2.16,side*1.524,.015,1.25,.015);
        rod(root,steel,[-2.75,2.26,side*1.57],[-2.75,2.50,side*1.57],.022);
        decal(root,'040',-3.25,2.37,side*1.55,.70,.25,side<0?Math.PI:0);
        // Cab seats and control stand stay visible through the glazing.
        box(root,dark,-3.36,2.72,side*.65,.64,.16,.59,.045);box(root,dark,-3.60,3.04,side*.65,.16,.63,.60,.045);
        cylinder(root,steel,-3.36,2.38,side*.65,.045,.60);box(root,cast,-2.28,2.97,side*.56,.38,.34,.82,.025);
        rod(root,cream,[-3.0,3.91,side*1.62],[-3.0,4.0,side*1.94],.025);
        box(root,dark,-3.0,3.94,side*1.90,.24,.30,.065,.025);
    }
    for(const end of [-1,1]){
        const windshield=new THREE.Group();windshield.position.set(end>0?-1.91:-4.61,3.5,0);windshield.rotation.z=end>0?.18:-.07;root.add(windshield);
        for(const side of [-1,1]){
            const z=side*.71;
            for(const zz of [z-.64,z+.64])box(windshield,dark,0,0,zz,.08,1.02,.045,.008);
            for(const y of [-.49,.49])box(windshield,dark,0,y,z,.08,.055,1.32,.008);
            const pane=add(windshield,new THREE.PlaneGeometry(1.24,.91),glass,end*.045,0,z);pane.rotation.y=end>0?Math.PI/2:-Math.PI/2;
            rod(windshield,dark,[end*.075,-.43,z-.25],[end*.075,.25,z+.20],.012);
            rod(windshield,dark,[end*.085,.12,z+.09],[end*.085,.38,z+.33],.018);
        }
        box(windshield,cream,0,0,0,.11,1.03,.10,.012);
    }
    box(root,dark,-3.0,4.36,0,.78,.12,.62,.025);cylinder(root,steel,-3.6,4.58,0,.025,.48);box(root,cream,-3.6,4.83,0,.05,.025,.05);

    // Roof fans and a short diesel exhaust replace the steam chimney.
    for(const x of [3.12,4.18]){
        cylinder(root,dark,x,3.065,0,.47,.07,'y',28);ring(root,steel,x,3.12,0,.46,.025,'y');
        const fan=new THREE.Group();fan.position.set(x,3.125,0);root.add(fan);fans.push(fan);
        cylinder(fan,steel,0,0,0,.105,.07,'y');for(let i=0;i<7;i++){const angle=i*Math.PI*2/7;const blade=box(fan,cast,Math.cos(angle)*.25,0,Math.sin(angle)*.25,.40,.025,.12,.012);blade.rotation.y=-angle+.22;}
        for(const zz of [-.30,-.15,0,.15,.30])rod(root,cast,[x-.39,3.17,zz],[x+.39,3.17,zz],.012);
    }
    for(const z of [-.35,.35]){cylinder(root,frame,-.18,3.26,z,.105,.43);ring(root,steel,-.18,3.48,z,.105,.014,'y');}

    // Narrow handrails, four corner stairways, lamps and air/coupler gear.
    for(const side of [-1,1]){
        for(const x of [-4.85,-3.6,-2.4,-1.2,0,1.2,2.4,3.6,4.85])rod(root,safety,[x,1.42,side*1.82],[x,2.24,side*1.82],.025);
        for(const y of [1.83,2.24])rod(root,safety,[-4.85,y,side*1.82],[4.85,y,side*1.82],.025);
        for(const end of [-1,1]){
            for(let j=0;j<4;j++)box(root,cast,end*(5.31-j*.055),.31+j*.27,side*1.78,.48,.065,.42,.01);
            rod(root,safety,[end*5.35,.57,side*1.90],[end*4.85,2.24,side*1.82],.028);
            cylinder(root,frame,end*5.30,2.52,side*.67,.18,.12,'x',24);
            cylinder(root,end>0?lens:tail,end*5.38,2.52,side*.67,.135,.025,'x',24);
        }
    }
    const hazard=hazardMaterial();
    for(const end of [-1,1]){
        box(root,frame,end*5.31,1.09,0,.23,.42,3.82,.025);
        const stripes=add(root,new THREE.PlaneGeometry(3.70,.34),hazard,end*5.435,1.09,0);stripes.rotation.y=end>0?Math.PI/2:-Math.PI/2;
        for(const z of [-1.05,1.05]){cylinder(root,frame,end*5.56,.94,z,.09,.28,'x');cylinder(root,steel,end*5.73,.94,z,.20,.07,'x',24);}
        box(root,cast,end*5.69,.86,0,.48,.28,.28,.035);box(root,steel,end*5.94,.87,.08,.10,.22,.27,.025);
        cylinder(root,steel,end*5.91,1.0,0,.034,.30);box(root,cast,end*5.96,.86,-.12,.08,.13,.16,.018);
        const hosePoints=[[end*5.42,1.03,.47],[end*5.57,.60,.51],[end*5.73,.43,.45],[end*5.79,.65,.35]].map(p=>new THREE.Vector3(...p));
        add(root,new THREE.TubeGeometry(new THREE.CatmullRomCurve3(hosePoints),16,.035,7),dark,0,0,0);
        box(root,safety,end*5.45,1.09,.48,.045,.10,.11,.012);
        for(const z of [-.39,.39])cylinder(root,frame,end*5.31,1.84,z,.095,.08,'x');
        if(end>0){
            for(const side of [-1,1]){
                const vertices=[5.81,.22,0,5.48,.22,side*1.62,5.45,.84,side*1.62,5.76,.84,0];
                const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));geometry.setIndex(side>0?[0,2,1,0,3,2]:[0,1,2,0,2,3]);geometry.computeVertexNormals();
                const m=add(root,geometry,frame,0,0,0);m.material=frame;
                rod(root,steel,[5.81,.22,0],[5.48,.22,side*1.62],.025);
            }
        }
    }
    root.userData.model='compact-diesel-shunter';root.userData.axles=4;root.userData.nominalEnvelope=[12,4,4.86];
    return {root,wheels,fans};
}

export function buildRailTrack(root,length,surfaces){
    const timber=material(surfaces,'timber','#625e4c',.94,.02),rail=material(surfaces,'rail','#9ba49a',.30,.85),web=material(surfaces,'rail-web','#606c64',.66,.75),clips=material(surfaces,'rail-clips','#3e4942',.8,.6);
    let ballast=surfaces.cache.get('diesel:ballast');
    if(!ballast){
        const c=document.createElement('canvas');c.width=c.height=512;const g=c.getContext('2d');g.fillStyle='#76776b';g.fillRect(0,0,512,512);let seed=71;const rand=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
        for(let i=0;i<6000;i++){const shade=Math.floor(65+rand()*91);g.fillStyle=`rgb(${shade},${shade+3},${shade-6})`;g.beginPath();g.ellipse(rand()*512,rand()*512,1+rand()*4,1+rand()*3,rand()*6.28,0,6.28);g.fill();}
        const map=new THREE.CanvasTexture(c);map.wrapS=map.wrapT=THREE.RepeatWrapping;map.repeat.set(length/3.5,1);map.colorSpace=THREE.SRGBColorSpace;map.anisotropy=4;ballast=new THREE.MeshStandardMaterial({map,roughness:1,metalness:0});ballast.userData.persistent=true;surfaces.cache.set('diesel:ballast',ballast);
    }
    const bed=new THREE.Mesh(new THREE.PlaneGeometry(length,3.6),ballast);bed.rotation.x=-Math.PI/2;bed.position.set(20,.009,12);bed.receiveShadow=true;root.add(bed);
    const box=(mat,x,y,z,w,h,d)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;root.add(m);return m;};
    for(const z of [11.28,12.72]){
        box(web,20,.095,z,length,.030,.16);box(web,20,.150,z,length,.080,.035);box(rail,20,.205,z,length,.030,.075);
    }
    for(let x=20-length/2+.25;x<20+length/2;x+=.58){
        box(timber,x,.04,12,.22,.08,2.6);
        for(const z of [11.28,12.72]){
            box(clips,x,.092,z,.28,.025,.29);
            for(const side of [-1,1]){
                box(clips,x,.128,z+side*.104,.12,.04,.04);
                const bolt=new THREE.Mesh(new THREE.CylinderGeometry(.023,.023,.022,6),rail);bolt.position.set(x,.116,z+side*.115);root.add(bolt);
            }
        }
    }
}

``````

## frontend/map-details.js
``````
/* Map-specific construction details, confined to existing solid footprints
 * or overhead clearance. Never introduces an invisible collision obstacle. */
import * as THREE from 'three';
export function enhanceLandmark(root,id,surfaces){
    if(!root||id==='railway')return;
    root.userData.detailRevision='landmarks-2';
    let count=0;
    const mesh=(geo,kind,tint,x,y,z)=>{const m=new THREE.Mesh(geo,surfaces.get(kind,tint));m.position.set(x,y,z);root.add(m);count++;return m;};
    const box=(x,y,z,w,h,d,k='metal',c='#819184')=>mesh(new THREE.BoxGeometry(w,h,d),k,c,x,y,z);
    const tube=(x,y,z,r,l,c='#8f9e8a',rotation=null)=>{const m=mesh(new THREE.CylinderGeometry(r,r,l,16),'metal',c,x,y,z);if(rotation)m.rotation.set(...rotation);return m;};
    const beam=(a,b,r=.025,c='#8f9e8a')=>{const start=new THREE.Vector3(...a),end=new THREE.Vector3(...b),m=tube(...start.clone().add(end).multiplyScalar(.5).toArray(),r,start.distanceTo(end),c);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),end.sub(start).normalize());return m;};
    const ring=(x,y,z,r,t=.025,c='#819184')=>{const m=mesh(new THREE.TorusGeometry(r,t,8,48),'metal',c,x,y,z);m.rotation.x=Math.PI/2;return m;};
    if(id==='freight'){
        // Twin plate girders, diagonal bracing, trolley wheels and hoist drum.
        for(const z of [11.55,12.45]){
            box(20,8.2,z,13,.16,.18,'paint','#b49d56');box(20,7.63,z,13,.13,.18,'paint','#b49d56');
            for(let i=0;i<13;i++)beam([13.7+i,7.68,z],[14.7+i,8.15,z],.045,'#af9654');
            for(const x of [19,21]){box(x,4,z,.14,7.7,.13,'metal','#6e7566');for(let y=.5;y<7.6;y+=.4)box(x,y,z,.52,.035,.08,'metal','#a39366');}
        }
        box(20,8.55,12,3.5,.12,1.8,'metal','#5f6c64');
        for(const z of [11.2,12.8]){beam([18.3,9.05,z],[21.7,9.05,z]);for(let x=18.3;x<=21.8;x+=.85)beam([x,8.55,z],[x,9.05,z]);}
        box(18.85,7.6,12.85,1.15,1.3,.85,'paint','#647f7e');
        for(const z of [12.40,13.30])box(18.85,7.8,z,.92,.65,.025,'glass','#536c70');
        box(18.85,8.3,12.85,1.3,.12,1,'metal','#7b8e80');
        tube(20.8,7.4,12,.32,1.15,'#3d4b48',[Math.PI/2,0,0]);
        for(const z of [11.85,12.15])beam([24,7.9,z],[24,3.7,z],.016,'#3e4640');
        for(const z of [11.65,12.35])tube(24,3.8,z,.25,.065,'#8b865a',[Math.PI/2,0,0]);
        for(const x of [19,21])box(x,.15,12,.8,.3,1.7,'metal','#6c7567');
    }else if(id==='foundry'){
        // Refractory furnace shell, rivet bands, insulated ducts and catwalk.
        for(let y=.6;y<4.6;y+=.52){box(20,y,10.12,3.65,.08,.07,'metal','#4e4a42');box(20,y,13.88,3.65,.08,.07,'metal','#4e4a42');}
        for(let y=3.8;y<9.6;y+=.48)ring(20,y,12,.735,.025,'#847864');
        for(const x of [18.25,21.75]){
            for(let y=.5;y<5.2;y+=.5)ring(x,y,12,.195,.025,'#a29375');
            box(x,2.7,10.28,.20,4.6,.15,'metal','#5b6257');
            for(let y=.5;y<4.9;y+=.3)box(x,y,10.16,.48,.035,.05,'metal','#8d927a');
        }
        for(const z of [10.15,13.85]){beam([18.12,5.65,z],[21.88,5.65,z]);beam([18.12,5.18,z],[21.88,5.18,z]);for(let x=18.12;x<22;x+=.75)beam([x,4.8,z],[x,5.65,z]);}
        tube(20,4.2,12,1.4,.22,'#6f6d5c');
        box(20,.22,10,3.3,.10,.24,'metal','#bfb284');
        for(let x=18.6;x<21.6;x+=.22){const m=box(x,.28,10,.11,.02,.2,'paint','#b99d58');m.rotation.y=.35;}
        for(const z of [10.08,13.92])for(const x of [18.55,21.45])tube(x,2,z,.07,1.4,'#5d5b4e');
        box(18.02,1.4,12,.05,1.5,.9,'metal','#5d6860');
        for(let j=0;j<6;j++)box(17.99,1+j*.14,12,.02,.035,.7,'metal','#959984');
    }else if(id==='plaza'){
        // Masonry courses, cornices, recessed glazing and copper roof seams.
        for(let y=.5;y<5.4;y+=.42)for(const z of [10.49,13.51])box(20,y,z,3,.014,.012,'stone','#8b8674');
        for(const x of [18.59,21.41])for(const z of [10.59,13.41])box(x,2.8,z,.18,5.1,.18,'stone','#d2c8ad');
        for(const y of [.42,5.25,5.7,8.42])box(20,y,12,y>6?2.65:3.35,.13,y>6?2.65:3.35,'stone','#c7bda3');
        for(const z of [10.48,13.52]){
            box(20,2.4,z,.77,1.5,.028,'glass','#465b59');
            for(const x of [19.56,20.44])box(x,2.4,z,.10,1.7,.13,'stone','#d0c4a7');
            box(20,3.22,z,1.03,.13,.16,'stone','#d0c4a7');box(20,1.59,z,1.03,.13,.18,'stone','#d0c4a7');
            box(20,2.4,z,.05,1.5,.05,'metal','#767c69');
        }
        for(let i=0;i<4;i++){
            const yaw=i*Math.PI/2,dir=new THREE.Vector3(Math.sin(yaw),0,Math.cos(yaw));
            beam([20,10.3,12],[20+dir.x*1.55,8.35,12+dir.z*1.55],.024,'#8c9c81');
        }
        for(const z of [10.72,13.28])box(20,7.2,z,2.4,.035,.04,'metal','#ad9e73');
    }else if(id==='observatory'){
        // Segmented dome, shutter aperture, equatorial mount and service panels.
        for(let i=0;i<16;i++){
            const yaw=i*Math.PI/8,points=[];for(let j=0;j<=16;j++){const t=j/16*Math.PI/2;points.push(new THREE.Vector3(20+Math.cos(yaw)*1.858*Math.sin(t),3.4+1.858*Math.cos(t),12+Math.sin(yaw)*1.858*Math.sin(t)));}
            mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),20,.014,5),'metal','#839aa3',0,0,0);
        }
        ring(20,3.42,12,1.87,.045,'#788d97');ring(20,3.55,12,1.86,.03,'#8b9da3');
        const dark=box(20,4.66,12.8,.67,1.25,.08,'rubber','#1c303b');dark.rotation.x=-.55;
        for(const x of [19.60,20.40]){const m=box(x,4.69,12.79,.07,1.34,.09,'metal','#bbc8c9');m.rotation.x=-.55;}
        const scopeRing=ring(21.02,6.4,12,.45,.045,'#718897');scopeRing.rotation.set(0,0,-.7);
        tube(20.2,4.7,12,.59,.2,'#6b8292',[0,0,-.7]);
        box(20,1.17,10.08,.85,2.1,.045,'paint','#6c8590');
        box(20.30,1.18,10.04,.04,.16,.06,'metal','#b8c5b9');
        for(const x of [18.42,21.58]){
            box(x,1.2,10.07,.38,.55,.04,'metal','#627e8b');
            for(let j=0;j<5;j++)box(x,1+j*.1,10.03,.32,.025,.035,'metal','#a8b9bd');
        }
        for(const z of [10.15,13.85])for(let x=18.15;x<22;x+=.74){beam([x,3.0,z],[x,3.62,z],.017,'#809aa5');}
        for(const z of [10.15,13.85])beam([18.15,3.62,z],[21.85,3.62,z],.02,'#809aa5');
    }
    root.userData.detailParts=count;
}

``````

## frontend/operators.js
``````
/* Original articulated operators. Metres, two-bone IK and distance-driven gait. */
import * as THREE from 'three';
const lerp=THREE.MathUtils.lerp,clamp=THREE.MathUtils.clamp;
function profile(points){return new THREE.LatheGeometry(points.map(([r,y])=>new THREE.Vector2(r,y)),20);}
const face=profile([[.045,-.045],[.075,-.025],[.098,.035],[.104,.12],[.091,.185],[.055,.218],[0,.23]]).scale(1,1,.89);
const positions=face.attributes.position;for(let i=0;i<positions.count;i++)if(positions.getZ(i)>.080)positions.setZ(i,.080);face.computeVertexNormals();
export const operatorGeometries={head:face,
    torso:profile([[.28,-.5],[.42,-.44],[.47,-.2],[.5,.2],[.45,.41],[.31,.5]]).scale(1,1,.62),
    limb:profile([[.22,-.5],[.36,-.46],[.43,-.15],[.5,.30],[.40,.48],[.25,.5]]),
};
for(const g of Object.values(operatorGeometries))g.userData.shared=true;
const V=(x=0,y=0,z=0)=>new THREE.Vector3(x,y,z);
function solve(start,end,l1,l2,pole){
    const axis=end.clone().sub(start),distance=clamp(axis.length(),.002,l1+l2-.001);axis.normalize();
    const bend=pole.clone().sub(axis.clone().multiplyScalar(pole.dot(axis))).normalize();
    const along=(l1*l1-l2*l2+distance*distance)/(2*distance);
    return start.clone().addScaledVector(axis,along).addScaledVector(bend,Math.sqrt(Math.max(0,l1*l1-along*along)));
}
function bone(node,from,to){node.position.copy(from).add(to).multiplyScalar(.5);node.quaternion.setFromUnitVectors(V(0,1,0),to.clone().sub(from).normalize());node.scale.y=from.distanceTo(to);}
export function buildOperator(player,part,joint){
    const root=new THREE.Group(),records=[],team=player.team?'#ed785f':'#58c4ea',suit=player.skin==='rogue'?'#45504b':player.skin==='warden'?'#686d57':'#667369';
    const dark='#263338',plate='#394f54',skin='#bf967c';
    const add=(parent,g,c,x,y,z,sx,sy,sz,surface)=>{const n=part(parent,g,c,x,y,z,sx,sy,sz,records);if(surface)records.at(-1).surface=surface==='fabric'&&c===suit?'uniform':surface;return n;};
    const body=joint(root,0,.95,0),head=joint(body,0,.64,0),legs=[],arms=[];
    add(body,'torso',suit,0,.26,0,.48,.50,.44,'fabric');
    add(body,'sphere',suit,0,-.02,0,.225,.14,.14,'fabric');
    add(body,'torso',plate,0,.28,.065,.43,.38,.40,'fabric');
    add(body,'box','#263338',0,.01,0,.45,.065,.31,'rubber');
    add(body,'box','#8b9487',0,.01,.17,.075,.05,.018,'metal');
    add(body,'box','#465244',0,.29,-.16,.33,.35,.10,'fabric');
    for(const side of [-1,1]){
        add(body,'box',suit,side*.17,.32,.155,.045,.40,.033,'fabric');
        for(let row=0;row<4;row++)add(body,'box','#88947a',side*.14,.15+row*.058,.19,.14,.013,.012,'fabric');
        add(body,'box',team,side*.205,.47,.04,.014,.065,.13,'fabric');
        add(body,'box','#59695b',side*.11,.10,.22,.12,.17,.065,'fabric');
        add(body,'box','#5e6b58',side*.228,.06,-.05,.075,.17,.12,'fabric');
    }
    add(body,'box','#263338',-.14,.39,.19,.07,.12,.055,'rubber');
    add(body,'cylinder','#263338',-.14,.49,.19,.008,.14,.008,'rubber');
    add(body,'capsule',skin,0,.54,0,.105,.13,.11,'skin');
    // Anatomical jaw, skull and facial landmarks; all original geometry.
    add(head,'head',skin,0,0,.008,1,1,1,'skin');
    add(head,'box',skin,0,.065,.10,.022,.042,.03,'skin');
    add(head,'box','#996e5d',0,.009,.091,.042,.005,.006,'skin');
    for(const side of [-1,1]){
        add(head,'sphere',skin,side*.103,.07,.006,.018,.033,.021,'skin');
        add(head,'box','#886d58',side*.039,.104,.090,.027,.007,.006,'skin');
        add(head,'sphere','#263338',side*.039,.104,.094,.005,.004,.003,'rubber');
        add(head,'box','#695446',side*.039,.12,.091,.034,.007,.006,'fabric');
        add(head,'capsule','#3e4941',side*.101,.017,.073,.016,.16,.016,'fabric').rotation.z=side*.35;
        add(head,'box','#1c2a30',side*.143,.083,0,.04,.102,.075,'rubber');
        add(head,'box',plate,side*.145,.19,-.005,.028,.07,.075,'metal');
    }
    add(head,'sphere',suit,0,.197,-.018,.146,.099,.137,'fabric');
    add(head,'box',plate,0,.205,.078,.245,.036,.105,'metal');
    add(head,'box','#b6baa2',0,.27,.014,.035,.018,.05,'metal');
    add(head,'box','#527b80',0,.15,.12,.20,.035,.018,'glass');
    if(player.skin==='rogue')add(head,'sphere',suit,0,-.018,.03,.108,.073,.105,'fabric');
    for(const side of [-1,1]){
        const thigh=add(root,'limb',suit,0,0,0,.19,1,.20,'fabric'),shin=add(root,'limb',suit,0,0,0,.15,1,.16,'fabric');
        const knee=add(root,'box',plate,0,0,0,.15,.14,.055,'rubber'),boot=joint(root,0,0,0);
        add(boot,'box','#1c2a30',0,.035,.05,.18,.12,.30,'rubber');
        add(boot,'box','#596155',0,-.025,.05,.183,.025,.31,'rubber');
        add(boot,'capsule','#1c2a30',0,.11,-.01,.14,.15,.15,'rubber');
        for(let j=0;j<3;j++)add(boot,'box','#7c816d',0,.105-j*.018,.10,.09,.009,.012,'fabric');
        legs.push({side,thigh,shin,knee,boot});
        const upper=add(body,'limb',suit,0,0,0,.16,1,.17,'fabric'),lower=add(body,'limb',suit,0,0,0,.125,1,.135,'fabric'),hand=joint(body,0,0,0);
        add(hand,'sphere','#39493e',0,0,0,.064,.045,.085,'fabric');
        for(let f=0;f<4;f++)add(hand,'capsule','#39493e',-.039+f*.026,-.035,.02,.022,.065,.029,'fabric');
        add(hand,'capsule','#39493e',side*.063,-.012,.035,.026,.06,.032,'fabric').rotation.z=side*.6;
        arms.push({side,upper,lower,hand});
        add(body,'sphere',suit,side*.237,.43,0,.115,.105,.115,'fabric');
    }
    const gun=joint(body,.14,.39,.24),gunRecords={};
    for(const key of ['rifle','shotgun','pistol']){
        const start=records.length;
        const g=joint(gun,0,0,0),barrel=(z,l,r)=>{const n=add(g,'cylinder','#323d41',0,.03,z,r,l,r,'metal');n.rotation.x=Math.PI/2;};
        if(key==='pistol'){
            add(g,'box',dark,0,.015,.12,.055,.065,.22,'metal');
            add(g,'box',dark,0,-.065,.055,.048,.12,.065,'rubber').rotation.x=.16;
            barrel(.235,.035,.017);
        }else{
            add(g,'box',dark,0,0,.10,.09,.11,.30,'metal');
            add(g,'box',suit,0,-.015,-.10,.08,.12,.18,'rubber');
            add(g,'box',dark,0,-.105,.04,.06,.15,.08,'rubber');
            if(key==='rifle')add(g,'box',dark,0,-.12,.16,.07,.17,.10,'metal');
            barrel(.45,key==='shotgun'?.49:.42,key==='shotgun'?.026:.019);
            add(g,'box',key==='shotgun'?'#6e6452':suit,0,.01,.30,.08,.085,.18,'rubber');
            for(let j=0;j<5;j++)add(g,'box',dark,0,.07,.10+j*.04,.075,.012,.02,'metal');
        }
        add(g,'box','#96ac91',0,.07,.20,.014,.022,.02,'metal');
        for(const r of records.slice(start)){r.weapon=key;if(r.surface==='metal')r.surface='gunmetal';}gunRecords[key]=g;
    }
    return {root,body,head,legs,arms,gun,records,gunRecords,phase:0,lastX:player.x,lastY:player.y,skin:player.skin,team:player.team,weapon:'rifle',speed:0,dead:0,lastHp:100,lastShots:player.shots||0,shotTime:-10000,hurtTime:-10000};
}
export function animateOperator(a,p,dt,now){
    const distance=Math.hypot(p.x-a.lastX,p.y-a.lastY);a.lastX=p.x;a.lastY=p.y;
    if(distance<2)a.phase+=distance*2.5;
    if(p.shots>a.lastShots)a.shotTime=now;a.lastShots=p.shots;
    if(p.hp<a.lastHp)a.hurtTime=now;
    if(p.hp<=0&&a.lastHp>0)a.dead=now;if(p.hp>0)a.dead=0;a.lastHp=p.hp;
    a.weapon=p.weapon||'rifle';a.root.position.set(p.x,0,p.y);a.root.rotation.set(0,Math.PI/2-p.yaw,0);
    const blend=1-Math.exp(-dt*14);a.speed=lerp(a.speed,Math.min(1,Math.hypot(p.vx||0,p.vy||0)/7.2),blend);
    const forward=((p.vx||0)*Math.cos(p.yaw)+(p.vy||0)*Math.sin(p.yaw))/7.2;
    const lateral=(-(p.vx||0)*Math.sin(p.yaw)+(p.vy||0)*Math.cos(p.yaw))/7.2;
    const knock=Math.max(0,1-(now-a.hurtTime)/220),shot=Math.max(0,1-(now-a.shotTime)/160);
    a.body.position.y=.95-a.speed*.06+Math.cos(a.phase*2)*.012*a.speed;
    a.body.rotation.set(-forward*.07-(p.pitch||0)*.16+shot*.025,Math.sin(a.phase)*a.speed*.025,-lateral*.055-knock*.04);
    a.head.rotation.x=-(p.pitch||0)*.7;a.head.rotation.y=-a.body.rotation.y;
    const spec=p.weapon==='shotgun'?.7:p.weapon==='pistol'?1.25:1.5;
    const reload=p.reload>0?Math.sin((1-p.reload/spec)*Math.PI):0;
    a.gun.rotation.x=-(p.pitch||0)*.65+reload*.55-shot*.05;
    a.gun.rotation.z=-reload*.28;a.gun.position.z=.24-shot*.025;
    for(const {side,thigh,shin,knee,boot} of a.legs){
        const phase=a.phase+(side>0?Math.PI:0),s=Math.sin(phase),lift=Math.max(0,Math.cos(phase))*.105*a.speed;
        const foot=V(side*.145-s*lateral*.22,.038+lift,s*forward*.38);
        const hip=V(side*.135,.92-a.speed*.06,0),ankle=foot.clone().add(V(0,.015,-.015)),bend=solve(hip,ankle,.455,.455,V(0,0,1));
        bone(thigh,hip,bend);bone(shin,bend,ankle);knee.position.copy(bend).add(V(0,0,.073));boot.position.copy(foot);boot.rotation.x=-Math.max(0,s)*.14*a.speed;
    }
    for(const {side,upper,lower,hand} of a.arms){
        const shoulder=V(side*.235,.425,.005),grip=p.weapon==='pistol'?V(.14+side*.027,.32,.30):side>0?V(.14,.30,.28):V(.14,.395,.54);
        if(side<0&&reload>0)grip.set(-.08,.04-reload*.16,.34);
        const pivot=V(.14,.39,.24);grip.sub(pivot).applyEuler(a.gun.rotation).add(pivot);
        const reach=grip.clone().sub(shoulder);if(reach.length()>.609)grip.copy(shoulder).add(reach.setLength(.609));
        const elbow=solve(shoulder,grip,.31,.30,V(side*.8,-.5,-.4));bone(upper,shoulder,elbow);bone(lower,elbow,grip);hand.position.copy(grip);hand.rotation.set(-.5,a.gun.rotation.x,side*.15);
    }
    if(a.dead){const fall=clamp((now-a.dead)/550,0,1);a.root.position.y=.24*fall;a.root.rotation.z=fall*Math.PI/2;a.body.rotation.x=.12;}
    a.root.updateMatrixWorld(true);a.hp=p.hp;
}

``````

## frontend/renderer3d.js
``````
(()=>{var Ul=0,ec=1,Nl=2;var nc=1,fo=2,yn=3,Rn=0,Ne=1,He=2,Ln=0,hi=1,Un=2,ic=3,sc=4,Fl=5,Xn=100,Ol=101,Bl=102,zl=103,Hl=104,kl=200,Vl=201,Gl=202,Wl=203,Fr=204,Or=205,Xl=206,ql=207,Yl=208,Zl=209,Jl=210,$l=211,Kl=212,Ql=213,jl=214,po=0,mo=1,go=2,ui=3,_o=4,xo=5,yo=6,vo=7,rc=0,th=1,eh=2,Nn=0,nh=1,ih=2,sh=3,Mo=4,rh=5,oh=6,ah=7;var oc=300,gi=301,_i=302,es=303,bo=304,er=306,Cn=1e3,Wn=1001,Br=1002,Oe=1003,ch=1004;var nr=1005;var an=1006,So=1007;var jn=1008;var un=1009,ac=1010,cc=1011,ns=1012,Eo=1013,ti=1014,dn=1015,is=1016,To=1017,wo=1018,ss=1020,lc=35902,hc=35899,uc=1021,dc=1022,Qe=1023,Vi=1026,rs=1027,Ao=1028,Ro=1029,fc=1030,Co=1031;var Io=1033,ir=33776,sr=33777,rr=33778,or=33779,Po=35840,Do=35841,Lo=35842,Uo=35843,No=36196,Fo=37492,Oo=37496,Bo=37808,zo=37809,Ho=37810,ko=37811,Vo=37812,Go=37813,Wo=37814,Xo=37815,qo=37816,Yo=37817,Zo=37818,Jo=37819,$o=37820,Ko=37821,Qo=36492,jo=36494,ta=36495,ea=36283,na=36284,ia=36285,sa=36286;var Rs=2300,zr=2301,Nr=2302,Wa=2400,Xa=2401,qa=2402;var lh=3200,hh=3201;var pc=0,uh=1,Fn="",ue="srgb",di="srgb-linear",Cs="linear",ne="srgb";var ci=7680;var Ya=519,dh=512,fh=513,ph=514,mc=515,mh=516,gh=517,_h=518,xh=519,Za=35044,gc=35048;var _c="300 es",on=2e3,Is=2001;var In=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){let n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){let n=this._listeners;if(n===void 0)return;let s=n[t];if(s!==void 0){let r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){let e=this._listeners;if(e===void 0)return;let n=e[t.type];if(n!==void 0){t.target=this;let s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,t);t.target=null}}},Ae=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],al=1234567,Es=Math.PI/180,Gi=180/Math.PI;function xi(){let i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Ae[i&255]+Ae[i>>8&255]+Ae[i>>16&255]+Ae[i>>24&255]+"-"+Ae[t&255]+Ae[t>>8&255]+"-"+Ae[t>>16&15|64]+Ae[t>>24&255]+"-"+Ae[e&63|128]+Ae[e>>8&255]+"-"+Ae[e>>16&255]+Ae[e>>24&255]+Ae[n&255]+Ae[n>>8&255]+Ae[n>>16&255]+Ae[n>>24&255]).toLowerCase()}function Gt(i,t,e){return Math.max(t,Math.min(e,i))}function xc(i,t){return(i%t+t)%t}function Tu(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function wu(i,t,e){return i!==t?(e-i)/(t-i):0}function Ts(i,t,e){return(1-e)*i+e*t}function Au(i,t,e,n){return Ts(i,t,1-Math.exp(-e*n))}function Ru(i,t=1){return t-Math.abs(xc(i,t*2)-t)}function Cu(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function Iu(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function Pu(i,t){return i+Math.floor(Math.random()*(t-i+1))}function Du(i,t){return i+Math.random()*(t-i)}function Lu(i){return i*(.5-Math.random())}function Uu(i){i!==void 0&&(al=i);let t=al+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Nu(i){return i*Es}function Fu(i){return i*Gi}function Ou(i){return(i&i-1)===0&&i!==0}function Bu(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function zu(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Hu(i,t,e,n,s){let r=Math.cos,o=Math.sin,a=r(e/2),l=o(e/2),c=r((t+n)/2),h=o((t+n)/2),u=r((t-n)/2),f=o((t-n)/2),p=r((n-t)/2),g=o((n-t)/2);switch(s){case"XYX":i.set(a*h,l*u,l*f,a*c);break;case"YZY":i.set(l*f,a*h,l*u,a*c);break;case"ZXZ":i.set(l*u,l*f,a*h,a*c);break;case"XZX":i.set(a*h,l*g,l*p,a*c);break;case"YXY":i.set(l*p,a*h,l*g,a*c);break;case"ZYZ":i.set(l*g,l*p,a*h,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Hi(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function De(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}var fn={DEG2RAD:Es,RAD2DEG:Gi,generateUUID:xi,clamp:Gt,euclideanModulo:xc,mapLinear:Tu,inverseLerp:wu,lerp:Ts,damp:Au,pingpong:Ru,smoothstep:Cu,smootherstep:Iu,randInt:Pu,randFloat:Du,randFloatSpread:Lu,seededRandom:Uu,degToRad:Nu,radToDeg:Fu,isPowerOfTwo:Ou,ceilPowerOfTwo:Bu,floorPowerOfTwo:zu,setQuaternionFromProperEuler:Hu,normalize:De,denormalize:Hi},at=class i{constructor(t=0,e=0){i.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Gt(this.x,t.x,e.x),this.y=Gt(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=Gt(this.x,t,e),this.y=Gt(this.y,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Gt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(Gt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*s+t.x,this.y=r*s+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},cn=class{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,o,a){let l=n[s+0],c=n[s+1],h=n[s+2],u=n[s+3],f=r[o+0],p=r[o+1],g=r[o+2],y=r[o+3];if(a===0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u;return}if(a===1){t[e+0]=f,t[e+1]=p,t[e+2]=g,t[e+3]=y;return}if(u!==y||l!==f||c!==p||h!==g){let m=1-a,d=l*f+c*p+h*g+u*y,x=d>=0?1:-1,M=1-d*d;if(M>Number.EPSILON){let T=Math.sqrt(M),A=Math.atan2(T,d*x);m=Math.sin(m*A)/T,a=Math.sin(a*A)/T}let v=a*x;if(l=l*m+f*v,c=c*m+p*v,h=h*m+g*v,u=u*m+y*v,m===1-a){let T=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=T,c*=T,h*=T,u*=T}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,s,r,o){let a=n[s],l=n[s+1],c=n[s+2],h=n[s+3],u=r[o],f=r[o+1],p=r[o+2],g=r[o+3];return t[e]=a*g+h*u+l*p-c*f,t[e+1]=l*g+h*f+c*u-a*p,t[e+2]=c*g+h*p+a*f-l*u,t[e+3]=h*g-a*u-l*f-c*p,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){let n=t._x,s=t._y,r=t._z,o=t._order,a=Math.cos,l=Math.sin,c=a(n/2),h=a(s/2),u=a(r/2),f=l(n/2),p=l(s/2),g=l(r/2);switch(o){case"XYZ":this._x=f*h*u+c*p*g,this._y=c*p*u-f*h*g,this._z=c*h*g+f*p*u,this._w=c*h*u-f*p*g;break;case"YXZ":this._x=f*h*u+c*p*g,this._y=c*p*u-f*h*g,this._z=c*h*g-f*p*u,this._w=c*h*u+f*p*g;break;case"ZXY":this._x=f*h*u-c*p*g,this._y=c*p*u+f*h*g,this._z=c*h*g+f*p*u,this._w=c*h*u-f*p*g;break;case"ZYX":this._x=f*h*u-c*p*g,this._y=c*p*u+f*h*g,this._z=c*h*g-f*p*u,this._w=c*h*u+f*p*g;break;case"YZX":this._x=f*h*u+c*p*g,this._y=c*p*u+f*h*g,this._z=c*h*g-f*p*u,this._w=c*h*u-f*p*g;break;case"XZY":this._x=f*h*u-c*p*g,this._y=c*p*u-f*h*g,this._z=c*h*g+f*p*u,this._w=c*h*u+f*p*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){let n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,n=e[0],s=e[4],r=e[8],o=e[1],a=e[5],l=e[9],c=e[2],h=e[6],u=e[10],f=n+a+u;if(f>0){let p=.5/Math.sqrt(f+1);this._w=.25/p,this._x=(h-l)*p,this._y=(r-c)*p,this._z=(o-s)*p}else if(n>a&&n>u){let p=2*Math.sqrt(1+n-a-u);this._w=(h-l)/p,this._x=.25*p,this._y=(s+o)/p,this._z=(r+c)/p}else if(a>u){let p=2*Math.sqrt(1+a-n-u);this._w=(r-c)/p,this._x=(s+o)/p,this._y=.25*p,this._z=(l+h)/p}else{let p=2*Math.sqrt(1+u-n-a);this._w=(o-s)/p,this._x=(r+c)/p,this._y=(l+h)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Gt(this.dot(t),-1,1)))}rotateTowards(t,e){let n=this.angleTo(t);if(n===0)return this;let s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let n=t._x,s=t._y,r=t._z,o=t._w,a=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+o*a+s*c-r*l,this._y=s*h+o*l+r*a-n*c,this._z=r*h+o*c+n*l-s*a,this._w=o*h-n*a-s*l-r*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);let n=this._x,s=this._y,r=this._z,o=this._w,a=o*t._w+n*t._x+s*t._y+r*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;let l=1-a*a;if(l<=Number.EPSILON){let p=1-e;return this._w=p*o+e*this._w,this._x=p*n+e*this._x,this._y=p*s+e*this._y,this._z=p*r+e*this._z,this.normalize(),this}let c=Math.sqrt(l),h=Math.atan2(c,a),u=Math.sin((1-e)*h)/c,f=Math.sin(e*h)/c;return this._w=o*u+this._w*f,this._x=n*u+this._x*f,this._y=s*u+this._y*f,this._z=r*u+this._z*f,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){let t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},P=class i{constructor(t=0,e=0,n=0){i.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(cl.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(cl.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(t){let e=this.x,n=this.y,s=this.z,r=t.x,o=t.y,a=t.z,l=t.w,c=2*(o*s-a*n),h=2*(a*e-r*s),u=2*(r*n-o*e);return this.x=e+l*c+o*u-a*h,this.y=n+l*h+a*c-r*u,this.z=s+l*u+r*h-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Gt(this.x,t.x,e.x),this.y=Gt(this.y,t.y,e.y),this.z=Gt(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=Gt(this.x,t,e),this.y=Gt(this.y,t,e),this.z=Gt(this.z,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Gt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let n=t.x,s=t.y,r=t.z,o=e.x,a=e.y,l=e.z;return this.x=s*l-r*a,this.y=r*o-n*l,this.z=n*a-s*o,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return xa.copy(this).projectOnVector(t),this.sub(xa)}reflect(t){return this.sub(xa.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(Gt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){let s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},xa=new P,cl=new cn,kt=class i{constructor(t,e,n,s,r,o,a,l,c){i.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,l,c)}set(t,e,n,s,r,o,a,l,c){let h=this.elements;return h[0]=t,h[1]=s,h[2]=a,h[3]=e,h[4]=r,h[5]=l,h[6]=n,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],h=n[4],u=n[7],f=n[2],p=n[5],g=n[8],y=s[0],m=s[3],d=s[6],x=s[1],M=s[4],v=s[7],T=s[2],A=s[5],C=s[8];return r[0]=o*y+a*x+l*T,r[3]=o*m+a*M+l*A,r[6]=o*d+a*v+l*C,r[1]=c*y+h*x+u*T,r[4]=c*m+h*M+u*A,r[7]=c*d+h*v+u*C,r[2]=f*y+p*x+g*T,r[5]=f*m+p*M+g*A,r[8]=f*d+p*v+g*C,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8];return e*o*h-e*a*c-n*r*h+n*a*l+s*r*c-s*o*l}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],u=h*o-a*c,f=a*l-h*r,p=c*r-o*l,g=e*u+n*f+s*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let y=1/g;return t[0]=u*y,t[1]=(s*c-h*n)*y,t[2]=(a*n-s*o)*y,t[3]=f*y,t[4]=(h*e-s*l)*y,t[5]=(s*r-a*e)*y,t[6]=p*y,t[7]=(n*l-c*e)*y,t[8]=(o*e-n*r)*y,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,o,a){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+t,-s*c,s*l,-s*(-c*o+l*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(ya.makeScale(t,e)),this}rotate(t){return this.premultiply(ya.makeRotation(-t)),this}translate(t,e){return this.premultiply(ya.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}},ya=new kt;function yc(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function Ps(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function yh(){let i=Ps("canvas");return i.style.display="block",i}var ll={};function Wi(i){i in ll||(ll[i]=!0,console.warn(i))}function vh(i,t,e){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}var hl=new kt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),ul=new kt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function ku(){let i={enabled:!0,workingColorSpace:di,spaces:{},convert:function(s,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===ne&&(s.r=An(s.r),s.g=An(s.g),s.b=An(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===ne&&(s.r=ki(s.r),s.g=ki(s.g),s.b=ki(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Fn?Cs:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,o){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return Wi("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return Wi("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[di]:{primaries:t,whitePoint:n,transfer:Cs,toXYZ:hl,fromXYZ:ul,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:ue},outputColorSpaceConfig:{drawingBufferColorSpace:ue}},[ue]:{primaries:t,whitePoint:n,transfer:ne,toXYZ:hl,fromXYZ:ul,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:ue}}}),i}var Kt=ku();function An(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function ki(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var Ai,Hr=class{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{Ai===void 0&&(Ai=Ps("canvas")),Ai.width=t.width,Ai.height=t.height;let s=Ai.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(t,0,0,t.width,t.height),n=Ai}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let e=Ps("canvas");e.width=t.width,e.height=t.height;let n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);let s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=An(r[o]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){let e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(An(e[n]/255)*255):e[n]=An(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},Vu=0,Xi=class{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Vu++}),this.uuid=xi(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){let e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):e instanceof VideoFrame?t.set(e.displayHeight,e.displayWidth,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(va(s[o].image)):r.push(va(s[o]))}else r=va(s);n.url=r}return e||(t.images[this.uuid]=n),n}};function va(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Hr.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var Gu=0,Ma=new P,Le=class i extends In{constructor(t=i.DEFAULT_IMAGE,e=i.DEFAULT_MAPPING,n=Wn,s=Wn,r=an,o=jn,a=Qe,l=un,c=i.DEFAULT_ANISOTROPY,h=Fn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Gu++}),this.uuid=xi(),this.name="",this.source=new Xi(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new at(0,0),this.repeat=new at(1,1),this.center=new at(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new kt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Ma).x}get height(){return this.source.getSize(Ma).y}get depth(){return this.source.getSize(Ma).z}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(let e in t){let n=t[e];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){console.warn(`THREE.Texture.setValues(): property '${e}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==oc)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Cn:t.x=t.x-Math.floor(t.x);break;case Wn:t.x=t.x<0?0:1;break;case Br:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Cn:t.y=t.y-Math.floor(t.y);break;case Wn:t.y=t.y<0?0:1;break;case Br:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}};Le.DEFAULT_IMAGE=null;Le.DEFAULT_MAPPING=oc;Le.DEFAULT_ANISOTROPY=1;var ee=class i{constructor(t=0,e=0,n=0,s=1){i.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*s+o[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r,l=t.elements,c=l[0],h=l[4],u=l[8],f=l[1],p=l[5],g=l[9],y=l[2],m=l[6],d=l[10];if(Math.abs(h-f)<.01&&Math.abs(u-y)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+f)<.1&&Math.abs(u+y)<.1&&Math.abs(g+m)<.1&&Math.abs(c+p+d-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;let M=(c+1)/2,v=(p+1)/2,T=(d+1)/2,A=(h+f)/4,C=(u+y)/4,I=(g+m)/4;return M>v&&M>T?M<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(M),s=A/n,r=C/n):v>T?v<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(v),n=A/s,r=I/s):T<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(T),n=C/r,s=I/r),this.set(n,s,r,e),this}let x=Math.sqrt((m-g)*(m-g)+(u-y)*(u-y)+(f-h)*(f-h));return Math.abs(x)<.001&&(x=1),this.x=(m-g)/x,this.y=(u-y)/x,this.z=(f-h)/x,this.w=Math.acos((c+p+d-1)/2),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Gt(this.x,t.x,e.x),this.y=Gt(this.y,t.y,e.y),this.z=Gt(this.z,t.z,e.z),this.w=Gt(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=Gt(this.x,t,e),this.y=Gt(this.y,t,e),this.z=Gt(this.z,t,e),this.w=Gt(this.w,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Gt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},kr=class extends In{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:an,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new ee(0,0,t,e),this.scissorTest=!1,this.viewport=new ee(0,0,t,e);let s={width:t,height:e,depth:n.depth},r=new Le(s);this.textures=[];let o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(t={}){let e={minFilter:an,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n,this.textures[s].isArrayTexture=this.textures[s].image.depth>1;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;let s=Object.assign({},t.textures[e].image);this.textures[e].source=new Xi(s)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},gn=class extends kr{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}},Ds=class extends Le{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Oe,this.minFilter=Oe,this.wrapR=Wn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}};var Vr=class extends Le{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Oe,this.minFilter=Oe,this.wrapR=Wn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var _n=class{constructor(t=new P(1/0,1/0,1/0),e=new P(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(nn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(nn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let n=nn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);let n=t.geometry;if(n!==void 0){let r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,nn):nn.fromBufferAttribute(r,o),nn.applyMatrix4(t.matrixWorld),this.expandByPoint(nn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),fr.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),fr.copy(n.boundingBox)),fr.applyMatrix4(t.matrixWorld),this.union(fr)}let s=t.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,nn),nn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(gs),pr.subVectors(this.max,gs),Ri.subVectors(t.a,gs),Ci.subVectors(t.b,gs),Ii.subVectors(t.c,gs),On.subVectors(Ci,Ri),Bn.subVectors(Ii,Ci),si.subVectors(Ri,Ii);let e=[0,-On.z,On.y,0,-Bn.z,Bn.y,0,-si.z,si.y,On.z,0,-On.x,Bn.z,0,-Bn.x,si.z,0,-si.x,-On.y,On.x,0,-Bn.y,Bn.x,0,-si.y,si.x,0];return!ba(e,Ri,Ci,Ii,pr)||(e=[1,0,0,0,1,0,0,0,1],!ba(e,Ri,Ci,Ii,pr))?!1:(mr.crossVectors(On,Bn),e=[mr.x,mr.y,mr.z],ba(e,Ri,Ci,Ii,pr))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,nn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(nn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(bn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),bn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),bn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),bn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),bn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),bn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),bn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),bn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(bn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}},bn=[new P,new P,new P,new P,new P,new P,new P,new P],nn=new P,fr=new _n,Ri=new P,Ci=new P,Ii=new P,On=new P,Bn=new P,si=new P,gs=new P,pr=new P,mr=new P,ri=new P;function ba(i,t,e,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){ri.fromArray(i,r);let a=s.x*Math.abs(ri.x)+s.y*Math.abs(ri.y)+s.z*Math.abs(ri.z),l=t.dot(ri),c=e.dot(ri),h=n.dot(ri);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}var Wu=new _n,_s=new P,Sa=new P,qn=class{constructor(t=new P,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let n=this.center;e!==void 0?n.copy(e):Wu.setFromPoints(t).getCenter(n);let s=0;for(let r=0,o=t.length;r<o;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;_s.subVectors(t,this.center);let e=_s.lengthSq();if(e>this.radius*this.radius){let n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(_s,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Sa.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(_s.copy(t.center).add(Sa)),this.expandByPoint(_s.copy(t.center).sub(Sa))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}},Sn=new P,Ea=new P,gr=new P,zn=new P,Ta=new P,_r=new P,wa=new P,Gr=class{constructor(t=new P,e=new P(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Sn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);let n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let e=Sn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Sn.copy(this.origin).addScaledVector(this.direction,e),Sn.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){Ea.copy(t).add(e).multiplyScalar(.5),gr.copy(e).sub(t).normalize(),zn.copy(this.origin).sub(Ea);let r=t.distanceTo(e)*.5,o=-this.direction.dot(gr),a=zn.dot(this.direction),l=-zn.dot(gr),c=zn.lengthSq(),h=Math.abs(1-o*o),u,f,p,g;if(h>0)if(u=o*l-a,f=o*a-l,g=r*h,u>=0)if(f>=-g)if(f<=g){let y=1/h;u*=y,f*=y,p=u*(u+o*f+2*a)+f*(o*u+f+2*l)+c}else f=r,u=Math.max(0,-(o*f+a)),p=-u*u+f*(f+2*l)+c;else f=-r,u=Math.max(0,-(o*f+a)),p=-u*u+f*(f+2*l)+c;else f<=-g?(u=Math.max(0,-(-o*r+a)),f=u>0?-r:Math.min(Math.max(-r,-l),r),p=-u*u+f*(f+2*l)+c):f<=g?(u=0,f=Math.min(Math.max(-r,-l),r),p=f*(f+2*l)+c):(u=Math.max(0,-(o*r+a)),f=u>0?r:Math.min(Math.max(-r,-l),r),p=-u*u+f*(f+2*l)+c);else f=o>0?-r:r,u=Math.max(0,-(o*f+a)),p=-u*u+f*(f+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(Ea).addScaledVector(gr,f),p}intersectSphere(t,e){Sn.subVectors(t.center,this.origin);let n=Sn.dot(this.direction),s=Sn.dot(Sn)-n*n,r=t.radius*t.radius;if(s>r)return null;let o=Math.sqrt(r-s),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,e):this.at(a,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){let n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){let e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,o,a,l,c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,f=this.origin;return c>=0?(n=(t.min.x-f.x)*c,s=(t.max.x-f.x)*c):(n=(t.max.x-f.x)*c,s=(t.min.x-f.x)*c),h>=0?(r=(t.min.y-f.y)*h,o=(t.max.y-f.y)*h):(r=(t.max.y-f.y)*h,o=(t.min.y-f.y)*h),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),u>=0?(a=(t.min.z-f.z)*u,l=(t.max.z-f.z)*u):(a=(t.max.z-f.z)*u,l=(t.min.z-f.z)*u),n>l||a>s)||((a>n||n!==n)&&(n=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,Sn)!==null}intersectTriangle(t,e,n,s,r){Ta.subVectors(e,t),_r.subVectors(n,t),wa.crossVectors(Ta,_r);let o=this.direction.dot(wa),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;zn.subVectors(this.origin,t);let l=a*this.direction.dot(_r.crossVectors(zn,_r));if(l<0)return null;let c=a*this.direction.dot(Ta.cross(zn));if(c<0||l+c>o)return null;let h=-a*zn.dot(wa);return h<0?null:this.at(h/o,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},se=class i{constructor(t,e,n,s,r,o,a,l,c,h,u,f,p,g,y,m){i.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,l,c,h,u,f,p,g,y,m)}set(t,e,n,s,r,o,a,l,c,h,u,f,p,g,y,m){let d=this.elements;return d[0]=t,d[4]=e,d[8]=n,d[12]=s,d[1]=r,d[5]=o,d[9]=a,d[13]=l,d[2]=c,d[6]=h,d[10]=u,d[14]=f,d[3]=p,d[7]=g,d[11]=y,d[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){let e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){let e=this.elements,n=t.elements,s=1/Pi.setFromMatrixColumn(t,0).length(),r=1/Pi.setFromMatrixColumn(t,1).length(),o=1/Pi.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,n=t.x,s=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(t.order==="XYZ"){let f=o*h,p=o*u,g=a*h,y=a*u;e[0]=l*h,e[4]=-l*u,e[8]=c,e[1]=p+g*c,e[5]=f-y*c,e[9]=-a*l,e[2]=y-f*c,e[6]=g+p*c,e[10]=o*l}else if(t.order==="YXZ"){let f=l*h,p=l*u,g=c*h,y=c*u;e[0]=f+y*a,e[4]=g*a-p,e[8]=o*c,e[1]=o*u,e[5]=o*h,e[9]=-a,e[2]=p*a-g,e[6]=y+f*a,e[10]=o*l}else if(t.order==="ZXY"){let f=l*h,p=l*u,g=c*h,y=c*u;e[0]=f-y*a,e[4]=-o*u,e[8]=g+p*a,e[1]=p+g*a,e[5]=o*h,e[9]=y-f*a,e[2]=-o*c,e[6]=a,e[10]=o*l}else if(t.order==="ZYX"){let f=o*h,p=o*u,g=a*h,y=a*u;e[0]=l*h,e[4]=g*c-p,e[8]=f*c+y,e[1]=l*u,e[5]=y*c+f,e[9]=p*c-g,e[2]=-c,e[6]=a*l,e[10]=o*l}else if(t.order==="YZX"){let f=o*l,p=o*c,g=a*l,y=a*c;e[0]=l*h,e[4]=y-f*u,e[8]=g*u+p,e[1]=u,e[5]=o*h,e[9]=-a*h,e[2]=-c*h,e[6]=p*u+g,e[10]=f-y*u}else if(t.order==="XZY"){let f=o*l,p=o*c,g=a*l,y=a*c;e[0]=l*h,e[4]=-u,e[8]=c*h,e[1]=f*u+y,e[5]=o*h,e[9]=p*u-g,e[2]=g*u-p,e[6]=a*h,e[10]=y*u+f}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Xu,t,qu)}lookAt(t,e,n){let s=this.elements;return Ge.subVectors(t,e),Ge.lengthSq()===0&&(Ge.z=1),Ge.normalize(),Hn.crossVectors(n,Ge),Hn.lengthSq()===0&&(Math.abs(n.z)===1?Ge.x+=1e-4:Ge.z+=1e-4,Ge.normalize(),Hn.crossVectors(n,Ge)),Hn.normalize(),xr.crossVectors(Ge,Hn),s[0]=Hn.x,s[4]=xr.x,s[8]=Ge.x,s[1]=Hn.y,s[5]=xr.y,s[9]=Ge.y,s[2]=Hn.z,s[6]=xr.z,s[10]=Ge.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],h=n[1],u=n[5],f=n[9],p=n[13],g=n[2],y=n[6],m=n[10],d=n[14],x=n[3],M=n[7],v=n[11],T=n[15],A=s[0],C=s[4],I=s[8],b=s[12],_=s[1],w=s[5],L=s[9],U=s[13],H=s[2],B=s[6],z=s[10],Y=s[14],V=s[3],lt=s[7],_t=s[11],vt=s[15];return r[0]=o*A+a*_+l*H+c*V,r[4]=o*C+a*w+l*B+c*lt,r[8]=o*I+a*L+l*z+c*_t,r[12]=o*b+a*U+l*Y+c*vt,r[1]=h*A+u*_+f*H+p*V,r[5]=h*C+u*w+f*B+p*lt,r[9]=h*I+u*L+f*z+p*_t,r[13]=h*b+u*U+f*Y+p*vt,r[2]=g*A+y*_+m*H+d*V,r[6]=g*C+y*w+m*B+d*lt,r[10]=g*I+y*L+m*z+d*_t,r[14]=g*b+y*U+m*Y+d*vt,r[3]=x*A+M*_+v*H+T*V,r[7]=x*C+M*w+v*B+T*lt,r[11]=x*I+M*L+v*z+T*_t,r[15]=x*b+M*U+v*Y+T*vt,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],o=t[1],a=t[5],l=t[9],c=t[13],h=t[2],u=t[6],f=t[10],p=t[14],g=t[3],y=t[7],m=t[11],d=t[15];return g*(+r*l*u-s*c*u-r*a*f+n*c*f+s*a*p-n*l*p)+y*(+e*l*p-e*c*f+r*o*f-s*o*p+s*c*h-r*l*h)+m*(+e*c*u-e*a*p-r*o*u+n*o*p+r*a*h-n*c*h)+d*(-s*a*h-e*l*u+e*a*f+s*o*u-n*o*f+n*l*h)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){let s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],u=t[9],f=t[10],p=t[11],g=t[12],y=t[13],m=t[14],d=t[15],x=u*m*c-y*f*c+y*l*p-a*m*p-u*l*d+a*f*d,M=g*f*c-h*m*c-g*l*p+o*m*p+h*l*d-o*f*d,v=h*y*c-g*u*c+g*a*p-o*y*p-h*a*d+o*u*d,T=g*u*l-h*y*l-g*a*f+o*y*f+h*a*m-o*u*m,A=e*x+n*M+s*v+r*T;if(A===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let C=1/A;return t[0]=x*C,t[1]=(y*f*r-u*m*r-y*s*p+n*m*p+u*s*d-n*f*d)*C,t[2]=(a*m*r-y*l*r+y*s*c-n*m*c-a*s*d+n*l*d)*C,t[3]=(u*l*r-a*f*r-u*s*c+n*f*c+a*s*p-n*l*p)*C,t[4]=M*C,t[5]=(h*m*r-g*f*r+g*s*p-e*m*p-h*s*d+e*f*d)*C,t[6]=(g*l*r-o*m*r-g*s*c+e*m*c+o*s*d-e*l*d)*C,t[7]=(o*f*r-h*l*r+h*s*c-e*f*c-o*s*p+e*l*p)*C,t[8]=v*C,t[9]=(g*u*r-h*y*r-g*n*p+e*y*p+h*n*d-e*u*d)*C,t[10]=(o*y*r-g*a*r+g*n*c-e*y*c-o*n*d+e*a*d)*C,t[11]=(h*a*r-o*u*r-h*n*c+e*u*c+o*n*p-e*a*p)*C,t[12]=T*C,t[13]=(h*y*s-g*u*s+g*n*f-e*y*f-h*n*m+e*u*m)*C,t[14]=(g*a*s-o*y*s-g*n*l+e*y*l+o*n*m-e*a*m)*C,t[15]=(o*u*s-h*a*s+h*n*l-e*u*l-o*n*f+e*a*f)*C,this}scale(t){let e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){let e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let n=Math.cos(e),s=Math.sin(e),r=1-n,o=t.x,a=t.y,l=t.z,c=r*o,h=r*a;return this.set(c*o+n,c*a-s*l,c*l+s*a,0,c*a+s*l,h*a+n,h*l-s*o,0,c*l-s*a,h*l+s*o,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,o){return this.set(1,n,r,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){let s=this.elements,r=e._x,o=e._y,a=e._z,l=e._w,c=r+r,h=o+o,u=a+a,f=r*c,p=r*h,g=r*u,y=o*h,m=o*u,d=a*u,x=l*c,M=l*h,v=l*u,T=n.x,A=n.y,C=n.z;return s[0]=(1-(y+d))*T,s[1]=(p+v)*T,s[2]=(g-M)*T,s[3]=0,s[4]=(p-v)*A,s[5]=(1-(f+d))*A,s[6]=(m+x)*A,s[7]=0,s[8]=(g+M)*C,s[9]=(m-x)*C,s[10]=(1-(f+y))*C,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){let s=this.elements,r=Pi.set(s[0],s[1],s[2]).length(),o=Pi.set(s[4],s[5],s[6]).length(),a=Pi.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],sn.copy(this);let c=1/r,h=1/o,u=1/a;return sn.elements[0]*=c,sn.elements[1]*=c,sn.elements[2]*=c,sn.elements[4]*=h,sn.elements[5]*=h,sn.elements[6]*=h,sn.elements[8]*=u,sn.elements[9]*=u,sn.elements[10]*=u,e.setFromRotationMatrix(sn),n.x=r,n.y=o,n.z=a,this}makePerspective(t,e,n,s,r,o,a=on,l=!1){let c=this.elements,h=2*r/(e-t),u=2*r/(n-s),f=(e+t)/(e-t),p=(n+s)/(n-s),g,y;if(l)g=r/(o-r),y=o*r/(o-r);else if(a===on)g=-(o+r)/(o-r),y=-2*o*r/(o-r);else if(a===Is)g=-o/(o-r),y=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=f,c[12]=0,c[1]=0,c[5]=u,c[9]=p,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=y,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,s,r,o,a=on,l=!1){let c=this.elements,h=2/(e-t),u=2/(n-s),f=-(e+t)/(e-t),p=-(n+s)/(n-s),g,y;if(l)g=1/(o-r),y=o/(o-r);else if(a===on)g=-2/(o-r),y=-(o+r)/(o-r);else if(a===Is)g=-1/(o-r),y=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=0,c[12]=f,c[1]=0,c[5]=u,c[9]=0,c[13]=p,c[2]=0,c[6]=0,c[10]=g,c[14]=y,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}},Pi=new P,sn=new se,Xu=new P(0,0,0),qu=new P(1,1,1),Hn=new P,xr=new P,Ge=new P,dl=new se,fl=new cn,Xe=class i{constructor(t=0,e=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){let s=t.elements,r=s[0],o=s[4],a=s[8],l=s[1],c=s[5],h=s[9],u=s[2],f=s[6],p=s[10];switch(e){case"XYZ":this._y=Math.asin(Gt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,p),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Gt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Gt(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,p),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Gt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,p),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(Gt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,p));break;case"XZY":this._z=Math.asin(-Gt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return dl.makeRotationFromQuaternion(t),this.setFromRotationMatrix(dl,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return fl.setFromEuler(this),this.setFromQuaternion(fl,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Xe.DEFAULT_ORDER="XYZ";var Ls=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},Yu=0,pl=new P,Di=new cn,En=new se,yr=new P,xs=new P,Zu=new P,Ju=new cn,ml=new P(1,0,0),gl=new P(0,1,0),_l=new P(0,0,1),xl={type:"added"},$u={type:"removed"},Li={type:"childadded",child:null},Aa={type:"childremoved",child:null},_e=class i extends In{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Yu++}),this.uuid=xi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let t=new P,e=new Xe,n=new cn,s=new P(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new se},normalMatrix:{value:new kt}}),this.matrix=new se,this.matrixWorld=new se,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Ls,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Di.setFromAxisAngle(t,e),this.quaternion.multiply(Di),this}rotateOnWorldAxis(t,e){return Di.setFromAxisAngle(t,e),this.quaternion.premultiply(Di),this}rotateX(t){return this.rotateOnAxis(ml,t)}rotateY(t){return this.rotateOnAxis(gl,t)}rotateZ(t){return this.rotateOnAxis(_l,t)}translateOnAxis(t,e){return pl.copy(t).applyQuaternion(this.quaternion),this.position.add(pl.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(ml,t)}translateY(t){return this.translateOnAxis(gl,t)}translateZ(t){return this.translateOnAxis(_l,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(En.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?yr.copy(t):yr.set(t,e,n);let s=this.parent;this.updateWorldMatrix(!0,!1),xs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?En.lookAt(xs,yr,this.up):En.lookAt(yr,xs,this.up),this.quaternion.setFromRotationMatrix(En),s&&(En.extractRotation(s.matrixWorld),Di.setFromRotationMatrix(En),this.quaternion.premultiply(Di.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(xl),Li.child=t,this.dispatchEvent(Li),Li.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent($u),Aa.child=t,this.dispatchEvent(Aa),Aa.child=null),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),En.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),En.multiply(t.parent.matrixWorld)),t.applyMatrix4(En),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(xl),Li.child=t,this.dispatchEvent(Li),Li.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){let o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(xs,t,Zu),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(xs,Ju,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){let e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){let n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(t){let e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(a=>({...a})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(t),s.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let u=l[c];r(t.shapes,u)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(t.materials,this.material[l]));s.material=a}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){let l=this.animations[a];s.animations.push(r(t.animations,l))}}if(e){let a=o(t.geometries),l=o(t.materials),c=o(t.textures),h=o(t.images),u=o(t.shapes),f=o(t.skeletons),p=o(t.animations),g=o(t.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),f.length>0&&(n.skeletons=f),p.length>0&&(n.animations=p),g.length>0&&(n.nodes=g)}return n.object=s,n;function o(a){let l=[];for(let c in a){let h=a[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){let s=t.children[n];this.add(s.clone())}return this}};_e.DEFAULT_UP=new P(0,1,0);_e.DEFAULT_MATRIX_AUTO_UPDATE=!0;_e.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var rn=new P,Tn=new P,Ra=new P,wn=new P,Ui=new P,Ni=new P,yl=new P,Ca=new P,Ia=new P,Pa=new P,Da=new ee,La=new ee,Ua=new ee,Gn=class i{constructor(t=new P,e=new P,n=new P){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),rn.subVectors(t,e),s.cross(rn);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){rn.subVectors(s,e),Tn.subVectors(n,e),Ra.subVectors(t,e);let o=rn.dot(rn),a=rn.dot(Tn),l=rn.dot(Ra),c=Tn.dot(Tn),h=Tn.dot(Ra),u=o*c-a*a;if(u===0)return r.set(0,0,0),null;let f=1/u,p=(c*l-a*h)*f,g=(o*h-a*l)*f;return r.set(1-p-g,g,p)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,wn)===null?!1:wn.x>=0&&wn.y>=0&&wn.x+wn.y<=1}static getInterpolation(t,e,n,s,r,o,a,l){return this.getBarycoord(t,e,n,s,wn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,wn.x),l.addScaledVector(o,wn.y),l.addScaledVector(a,wn.z),l)}static getInterpolatedAttribute(t,e,n,s,r,o){return Da.setScalar(0),La.setScalar(0),Ua.setScalar(0),Da.fromBufferAttribute(t,e),La.fromBufferAttribute(t,n),Ua.fromBufferAttribute(t,s),o.setScalar(0),o.addScaledVector(Da,r.x),o.addScaledVector(La,r.y),o.addScaledVector(Ua,r.z),o}static isFrontFacing(t,e,n,s){return rn.subVectors(n,e),Tn.subVectors(t,e),rn.cross(Tn).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return rn.subVectors(this.c,this.b),Tn.subVectors(this.a,this.b),rn.cross(Tn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return i.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return i.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,r){return i.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return i.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return i.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){let n=this.a,s=this.b,r=this.c,o,a;Ui.subVectors(s,n),Ni.subVectors(r,n),Ca.subVectors(t,n);let l=Ui.dot(Ca),c=Ni.dot(Ca);if(l<=0&&c<=0)return e.copy(n);Ia.subVectors(t,s);let h=Ui.dot(Ia),u=Ni.dot(Ia);if(h>=0&&u<=h)return e.copy(s);let f=l*u-h*c;if(f<=0&&l>=0&&h<=0)return o=l/(l-h),e.copy(n).addScaledVector(Ui,o);Pa.subVectors(t,r);let p=Ui.dot(Pa),g=Ni.dot(Pa);if(g>=0&&p<=g)return e.copy(r);let y=p*c-l*g;if(y<=0&&c>=0&&g<=0)return a=c/(c-g),e.copy(n).addScaledVector(Ni,a);let m=h*g-p*u;if(m<=0&&u-h>=0&&p-g>=0)return yl.subVectors(r,s),a=(u-h)/(u-h+(p-g)),e.copy(s).addScaledVector(yl,a);let d=1/(m+y+f);return o=y*d,a=f*d,e.copy(n).addScaledVector(Ui,o).addScaledVector(Ni,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},Mh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},kn={h:0,s:0,l:0},vr={h:0,s:0,l:0};function Na(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}var zt=class{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){let s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=ue){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Kt.colorSpaceToWorking(this,e),this}setRGB(t,e,n,s=Kt.workingColorSpace){return this.r=t,this.g=e,this.b=n,Kt.colorSpaceToWorking(this,s),this}setHSL(t,e,n,s=Kt.workingColorSpace){if(t=xc(t,1),e=Gt(e,0,1),n=Gt(n,0,1),e===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=Na(o,r,t+1/3),this.g=Na(o,r,t),this.b=Na(o,r,t-1/3)}return Kt.colorSpaceToWorking(this,s),this}setStyle(t,e=ue){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r,o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){let r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=ue){let n=Mh[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=An(t.r),this.g=An(t.g),this.b=An(t.b),this}copyLinearToSRGB(t){return this.r=ki(t.r),this.g=ki(t.g),this.b=ki(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=ue){return Kt.workingToColorSpace(Re.copy(this),t),Math.round(Gt(Re.r*255,0,255))*65536+Math.round(Gt(Re.g*255,0,255))*256+Math.round(Gt(Re.b*255,0,255))}getHexString(t=ue){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Kt.workingColorSpace){Kt.workingToColorSpace(Re.copy(this),e);let n=Re.r,s=Re.g,r=Re.b,o=Math.max(n,s,r),a=Math.min(n,s,r),l,c,h=(a+o)/2;if(a===o)l=0,c=0;else{let u=o-a;switch(c=h<=.5?u/(o+a):u/(2-o-a),o){case n:l=(s-r)/u+(s<r?6:0);break;case s:l=(r-n)/u+2;break;case r:l=(n-s)/u+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=Kt.workingColorSpace){return Kt.workingToColorSpace(Re.copy(this),e),t.r=Re.r,t.g=Re.g,t.b=Re.b,t}getStyle(t=ue){Kt.workingToColorSpace(Re.copy(this),t);let e=Re.r,n=Re.g,s=Re.b;return t!==ue?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(kn),this.setHSL(kn.h+t,kn.s+e,kn.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(kn),t.getHSL(vr);let n=Ts(kn.h,vr.h,e),s=Ts(kn.s,vr.s,e),r=Ts(kn.l,vr.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Re=new zt;zt.NAMES=Mh;var Ku=0,Yn=class extends In{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Ku++}),this.uuid=xi(),this.name="",this.type="Material",this.blending=hi,this.side=Rn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Fr,this.blendDst=Or,this.blendEquation=Xn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new zt(0,0,0),this.blendAlpha=0,this.depthFunc=ui,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Ya,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ci,this.stencilZFail=ci,this.stencilZPass=ci,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let e in t){let n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==hi&&(n.blending=this.blending),this.side!==Rn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Fr&&(n.blendSrc=this.blendSrc),this.blendDst!==Or&&(n.blendDst=this.blendDst),this.blendEquation!==Xn&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==ui&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Ya&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==ci&&(n.stencilFail=this.stencilFail),this.stencilZFail!==ci&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==ci&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let o=[];for(let a in r){let l=r[a];delete l.metadata,o.push(l)}return o}if(e){let r=s(t.textures),o=s(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let e=t.clippingPlanes,n=null;if(e!==null){let s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}},we=class extends Yn{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new zt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Xe,this.combine=rc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}};var ye=new P,Mr=new at,Qu=0,Ce=class{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Qu++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Za,this.updateRanges=[],this.gpuType=dn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Mr.fromBufferAttribute(this,e),Mr.applyMatrix3(t),this.setXY(e,Mr.x,Mr.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)ye.fromBufferAttribute(this,e),ye.applyMatrix3(t),this.setXYZ(e,ye.x,ye.y,ye.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)ye.fromBufferAttribute(this,e),ye.applyMatrix4(t),this.setXYZ(e,ye.x,ye.y,ye.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)ye.fromBufferAttribute(this,e),ye.applyNormalMatrix(t),this.setXYZ(e,ye.x,ye.y,ye.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)ye.fromBufferAttribute(this,e),ye.transformDirection(t),this.setXYZ(e,ye.x,ye.y,ye.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Hi(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=De(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Hi(e,this.array)),e}setX(t,e){return this.normalized&&(e=De(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Hi(e,this.array)),e}setY(t,e){return this.normalized&&(e=De(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Hi(e,this.array)),e}setZ(t,e){return this.normalized&&(e=De(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Hi(e,this.array)),e}setW(t,e){return this.normalized&&(e=De(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=De(e,this.array),n=De(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=De(e,this.array),n=De(n,this.array),s=De(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=De(e,this.array),n=De(n,this.array),s=De(s,this.array),r=De(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Za&&(t.usage=this.usage),t}};var Us=class extends Ce{constructor(t,e,n){super(new Uint16Array(t),e,n)}};var Ns=class extends Ce{constructor(t,e,n){super(new Uint32Array(t),e,n)}};var Zt=class extends Ce{constructor(t,e,n){super(new Float32Array(t),e,n)}},ju=0,Ke=new se,Fa=new _e,Fi=new P,We=new _n,ys=new _n,Ee=new P,ve=class i extends In{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:ju++}),this.uuid=xi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(yc(t)?Ns:Us)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new kt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return Ke.makeRotationFromQuaternion(t),this.applyMatrix4(Ke),this}rotateX(t){return Ke.makeRotationX(t),this.applyMatrix4(Ke),this}rotateY(t){return Ke.makeRotationY(t),this.applyMatrix4(Ke),this}rotateZ(t){return Ke.makeRotationZ(t),this.applyMatrix4(Ke),this}translate(t,e,n){return Ke.makeTranslation(t,e,n),this.applyMatrix4(Ke),this}scale(t,e,n){return Ke.makeScale(t,e,n),this.applyMatrix4(Ke),this}lookAt(t){return Fa.lookAt(t),Fa.updateMatrix(),this.applyMatrix4(Fa.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Fi).negate(),this.translate(Fi.x,Fi.y,Fi.z),this}setFromPoints(t){let e=this.getAttribute("position");if(e===void 0){let n=[];for(let s=0,r=t.length;s<r;s++){let o=t[s];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Zt(n,3))}else{let n=Math.min(t.length,e.count);for(let s=0;s<n;s++){let r=t[s];e.setXYZ(s,r.x,r.y,r.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new _n);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new P(-1/0,-1/0,-1/0),new P(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){let r=e[n];We.setFromBufferAttribute(r),this.morphTargetsRelative?(Ee.addVectors(this.boundingBox.min,We.min),this.boundingBox.expandByPoint(Ee),Ee.addVectors(this.boundingBox.max,We.max),this.boundingBox.expandByPoint(Ee)):(this.boundingBox.expandByPoint(We.min),this.boundingBox.expandByPoint(We.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new qn);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new P,1/0);return}if(t){let n=this.boundingSphere.center;if(We.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){let a=e[r];ys.setFromBufferAttribute(a),this.morphTargetsRelative?(Ee.addVectors(We.min,ys.min),We.expandByPoint(Ee),Ee.addVectors(We.max,ys.max),We.expandByPoint(Ee)):(We.expandByPoint(ys.min),We.expandByPoint(ys.max))}We.getCenter(n);let s=0;for(let r=0,o=t.count;r<o;r++)Ee.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(Ee));if(e)for(let r=0,o=e.length;r<o;r++){let a=e[r],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)Ee.fromBufferAttribute(a,c),l&&(Fi.fromBufferAttribute(t,c),Ee.add(Fi)),s=Math.max(s,n.distanceToSquared(Ee))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=e.position,s=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Ce(new Float32Array(4*n.count),4));let o=this.getAttribute("tangent"),a=[],l=[];for(let I=0;I<n.count;I++)a[I]=new P,l[I]=new P;let c=new P,h=new P,u=new P,f=new at,p=new at,g=new at,y=new P,m=new P;function d(I,b,_){c.fromBufferAttribute(n,I),h.fromBufferAttribute(n,b),u.fromBufferAttribute(n,_),f.fromBufferAttribute(r,I),p.fromBufferAttribute(r,b),g.fromBufferAttribute(r,_),h.sub(c),u.sub(c),p.sub(f),g.sub(f);let w=1/(p.x*g.y-g.x*p.y);isFinite(w)&&(y.copy(h).multiplyScalar(g.y).addScaledVector(u,-p.y).multiplyScalar(w),m.copy(u).multiplyScalar(p.x).addScaledVector(h,-g.x).multiplyScalar(w),a[I].add(y),a[b].add(y),a[_].add(y),l[I].add(m),l[b].add(m),l[_].add(m))}let x=this.groups;x.length===0&&(x=[{start:0,count:t.count}]);for(let I=0,b=x.length;I<b;++I){let _=x[I],w=_.start,L=_.count;for(let U=w,H=w+L;U<H;U+=3)d(t.getX(U+0),t.getX(U+1),t.getX(U+2))}let M=new P,v=new P,T=new P,A=new P;function C(I){T.fromBufferAttribute(s,I),A.copy(T);let b=a[I];M.copy(b),M.sub(T.multiplyScalar(T.dot(b))).normalize(),v.crossVectors(A,b);let w=v.dot(l[I])<0?-1:1;o.setXYZW(I,M.x,M.y,M.z,w)}for(let I=0,b=x.length;I<b;++I){let _=x[I],w=_.start,L=_.count;for(let U=w,H=w+L;U<H;U+=3)C(t.getX(U+0)),C(t.getX(U+1)),C(t.getX(U+2))}}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Ce(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let f=0,p=n.count;f<p;f++)n.setXYZ(f,0,0,0);let s=new P,r=new P,o=new P,a=new P,l=new P,c=new P,h=new P,u=new P;if(t)for(let f=0,p=t.count;f<p;f+=3){let g=t.getX(f+0),y=t.getX(f+1),m=t.getX(f+2);s.fromBufferAttribute(e,g),r.fromBufferAttribute(e,y),o.fromBufferAttribute(e,m),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),a.fromBufferAttribute(n,g),l.fromBufferAttribute(n,y),c.fromBufferAttribute(n,m),a.add(h),l.add(h),c.add(h),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(y,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let f=0,p=e.count;f<p;f+=3)s.fromBufferAttribute(e,f+0),r.fromBufferAttribute(e,f+1),o.fromBufferAttribute(e,f+2),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),n.setXYZ(f+0,h.x,h.y,h.z),n.setXYZ(f+1,h.x,h.y,h.z),n.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Ee.fromBufferAttribute(t,e),Ee.normalize(),t.setXYZ(e,Ee.x,Ee.y,Ee.z)}toNonIndexed(){function t(a,l){let c=a.array,h=a.itemSize,u=a.normalized,f=new c.constructor(l.length*h),p=0,g=0;for(let y=0,m=l.length;y<m;y++){a.isInterleavedBufferAttribute?p=l[y]*a.data.stride+a.offset:p=l[y]*h;for(let d=0;d<h;d++)f[g++]=c[p++]}return new Ce(f,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new i,n=this.index.array,s=this.attributes;for(let a in s){let l=s[a],c=t(l,n);e.setAttribute(a,c)}let r=this.morphAttributes;for(let a in r){let l=[],c=r[a];for(let h=0,u=c.length;h<u;h++){let f=c[h],p=t(f,n);l.push(p)}e.morphAttributes[a]=l}e.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,l=o.length;a<l;a++){let c=o[a];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){let t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};let e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});let n=this.attributes;for(let l in n){let c=n[l];t.data.attributes[l]=c.toJSON(t.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let u=0,f=c.length;u<f;u++){let p=c[u];h.push(p.toJSON(t.data))}h.length>0&&(s[l]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(t.data.boundingSphere=a.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let n=t.index;n!==null&&this.setIndex(n.clone());let s=t.attributes;for(let c in s){let h=s[c];this.setAttribute(c,h.clone(e))}let r=t.morphAttributes;for(let c in r){let h=[],u=r[c];for(let f=0,p=u.length;f<p;f++)h.push(u[f].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;let o=t.groups;for(let c=0,h=o.length;c<h;c++){let u=o[c];this.addGroup(u.start,u.count,u.materialIndex)}let a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());let l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},vl=new se,oi=new Gr,br=new qn,Ml=new P,Sr=new P,Er=new P,Tr=new P,Oa=new P,wr=new P,bl=new P,Ar=new P,Lt=class extends _e{constructor(t=new ve,e=new we){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(s,t);let a=this.morphTargetInfluences;if(r&&a){wr.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let h=a[l],u=r[l];h!==0&&(Oa.fromBufferAttribute(u,t),o?wr.addScaledVector(Oa,h):wr.addScaledVector(Oa.sub(e),h))}e.add(wr)}return e}raycast(t,e){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),br.copy(n.boundingSphere),br.applyMatrix4(r),oi.copy(t.ray).recast(t.near),!(br.containsPoint(oi.origin)===!1&&(oi.intersectSphere(br,Ml)===null||oi.origin.distanceToSquared(Ml)>(t.far-t.near)**2))&&(vl.copy(r).invert(),oi.copy(t.ray).applyMatrix4(vl),!(n.boundingBox!==null&&oi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,oi)))}_computeIntersections(t,e,n){let s,r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,f=r.groups,p=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,y=f.length;g<y;g++){let m=f[g],d=o[m.materialIndex],x=Math.max(m.start,p.start),M=Math.min(a.count,Math.min(m.start+m.count,p.start+p.count));for(let v=x,T=M;v<T;v+=3){let A=a.getX(v),C=a.getX(v+1),I=a.getX(v+2);s=Rr(this,d,t,n,c,h,u,A,C,I),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{let g=Math.max(0,p.start),y=Math.min(a.count,p.start+p.count);for(let m=g,d=y;m<d;m+=3){let x=a.getX(m),M=a.getX(m+1),v=a.getX(m+2);s=Rr(this,o,t,n,c,h,u,x,M,v),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,y=f.length;g<y;g++){let m=f[g],d=o[m.materialIndex],x=Math.max(m.start,p.start),M=Math.min(l.count,Math.min(m.start+m.count,p.start+p.count));for(let v=x,T=M;v<T;v+=3){let A=v,C=v+1,I=v+2;s=Rr(this,d,t,n,c,h,u,A,C,I),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{let g=Math.max(0,p.start),y=Math.min(l.count,p.start+p.count);for(let m=g,d=y;m<d;m+=3){let x=m,M=m+1,v=m+2;s=Rr(this,o,t,n,c,h,u,x,M,v),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}};function td(i,t,e,n,s,r,o,a){let l;if(t.side===Ne?l=n.intersectTriangle(o,r,s,!0,a):l=n.intersectTriangle(s,r,o,t.side===Rn,a),l===null)return null;Ar.copy(a),Ar.applyMatrix4(i.matrixWorld);let c=e.ray.origin.distanceTo(Ar);return c<e.near||c>e.far?null:{distance:c,point:Ar.clone(),object:i}}function Rr(i,t,e,n,s,r,o,a,l,c){i.getVertexPosition(a,Sr),i.getVertexPosition(l,Er),i.getVertexPosition(c,Tr);let h=td(i,t,e,n,Sr,Er,Tr,bl);if(h){let u=new P;Gn.getBarycoord(bl,Sr,Er,Tr,u),s&&(h.uv=Gn.getInterpolatedAttribute(s,a,l,c,u,new at)),r&&(h.uv1=Gn.getInterpolatedAttribute(r,a,l,c,u,new at)),o&&(h.normal=Gn.getInterpolatedAttribute(o,a,l,c,u,new P),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let f={a,b:l,c,normal:new P,materialIndex:0};Gn.getNormal(Sr,Er,Tr,f.normal),h.face=f,h.barycoord=u}return h}var de=class i extends ve{constructor(t=1,e=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};let a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);let l=[],c=[],h=[],u=[],f=0,p=0;g("z","y","x",-1,-1,n,e,t,o,r,0),g("z","y","x",1,-1,n,e,-t,o,r,1),g("x","z","y",1,1,t,n,e,s,o,2),g("x","z","y",1,-1,t,n,-e,s,o,3),g("x","y","z",1,-1,t,e,n,s,r,4),g("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new Zt(c,3)),this.setAttribute("normal",new Zt(h,3)),this.setAttribute("uv",new Zt(u,2));function g(y,m,d,x,M,v,T,A,C,I,b){let _=v/C,w=T/I,L=v/2,U=T/2,H=A/2,B=C+1,z=I+1,Y=0,V=0,lt=new P;for(let _t=0;_t<z;_t++){let vt=_t*w-U;for(let Ht=0;Ht<B;Ht++){let Jt=Ht*_-L;lt[y]=Jt*x,lt[m]=vt*M,lt[d]=H,c.push(lt.x,lt.y,lt.z),lt[y]=0,lt[m]=0,lt[d]=A>0?1:-1,h.push(lt.x,lt.y,lt.z),u.push(Ht/C),u.push(1-_t/I),Y+=1}}for(let _t=0;_t<I;_t++)for(let vt=0;vt<C;vt++){let Ht=f+vt+B*_t,Jt=f+vt+B*(_t+1),te=f+(vt+1)+B*(_t+1),$t=f+(vt+1)+B*_t;l.push(Ht,Jt,$t),l.push(Jt,te,$t),V+=6}a.addGroup(p,V,b),p+=V,f+=Y}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};function yi(i){let t={};for(let e in i){t[e]={};for(let n in i[e]){let s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function Ie(i){let t={};for(let e=0;e<i.length;e++){let n=yi(i[e]);for(let s in n)t[s]=n[s]}return t}function ed(i){let t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function vc(i){let t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Kt.workingColorSpace}var bh={clone:yi,merge:Ie},nd=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,id=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,ln=class extends Yn{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=nd,this.fragmentShader=id,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=yi(t.uniforms),this.uniformsGroups=ed(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){let e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(let s in this.uniforms){let o=this.uniforms[s].value;o&&o.isTexture?e.uniforms[s]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[s]={type:"m4",value:o.toArray()}:e.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}},Fs=class extends _e{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new se,this.projectionMatrix=new se,this.projectionMatrixInverse=new se,this.coordinateSystem=on,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},Vn=new P,Sl=new at,El=new at,Te=class extends Fs{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let e=.5*this.getFilmHeight()/t;this.fov=Gi*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan(Es*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Gi*2*Math.atan(Math.tan(Es*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){Vn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Vn.x,Vn.y).multiplyScalar(-t/Vn.z),Vn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Vn.x,Vn.y).multiplyScalar(-t/Vn.z)}getViewSize(t,e){return this.getViewBounds(t,Sl,El),e.subVectors(El,Sl)}setViewOffset(t,e,n,s,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,e=t*Math.tan(Es*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s,o=this.view;if(this.view!==null&&this.view.enabled){let l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*s/l,e-=o.offsetY*n/c,s*=o.width/l,n*=o.height/c}let a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}},Oi=-90,Bi=1,Wr=class extends _e{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new Te(Oi,Bi,t,e);s.layers=this.layers,this.add(s);let r=new Te(Oi,Bi,t,e);r.layers=this.layers,this.add(r);let o=new Te(Oi,Bi,t,e);o.layers=this.layers,this.add(o);let a=new Te(Oi,Bi,t,e);a.layers=this.layers,this.add(a);let l=new Te(Oi,Bi,t,e);l.layers=this.layers,this.add(l);let c=new Te(Oi,Bi,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let t=this.coordinateSystem,e=this.children.concat(),[n,s,r,o,a,l]=e;for(let c of e)this.remove(c);if(t===on)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===Is)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,l,c,h]=this.children,u=t.getRenderTarget(),f=t.getActiveCubeFace(),p=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;let y=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,r),t.setRenderTarget(n,1,s),t.render(e,o),t.setRenderTarget(n,2,s),t.render(e,a),t.setRenderTarget(n,3,s),t.render(e,l),t.setRenderTarget(n,4,s),t.render(e,c),n.texture.generateMipmaps=y,t.setRenderTarget(n,5,s),t.render(e,h),t.setRenderTarget(u,f,p),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}},Os=class extends Le{constructor(t=[],e=gi,n,s,r,o,a,l,c,h){super(t,e,n,s,r,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}},Xr=class extends gn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;let n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new Os(s),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new de(5,5,5),r=new ln({name:"CubemapFromEquirect",uniforms:yi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Ne,blending:Ln});r.uniforms.tEquirect.value=e;let o=new Lt(s,r),a=e.minFilter;return e.minFilter===jn&&(e.minFilter=an),new Wr(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e=!0,n=!0,s=!0){let r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,s);t.setRenderTarget(r)}},Yt=class extends _e{constructor(){super(),this.isGroup=!0,this.type="Group"}},sd={type:"move"},qi=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Yt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Yt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new P,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new P),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Yt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new P,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new P),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let e=this._hand;if(e)for(let n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,o=null,a=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(let y of t.hand.values()){let m=e.getJointPose(y,n),d=this._getHandJoint(c,y);m!==null&&(d.matrix.fromArray(m.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,d.jointRadius=m.radius),d.visible=m!==null}let h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],f=h.position.distanceTo(u.position),p=.02,g=.005;c.inputState.pinching&&f>p+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&f<=p-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(sd)))}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){let n=new Yt;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}},Bs=class i{constructor(t,e=25e-5){this.isFogExp2=!0,this.name="",this.color=new zt(t),this.density=e}clone(){return new i(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}};var Yi=class extends _e{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Xe,this.environmentIntensity=1,this.environmentRotation=new Xe,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}};var qr=class extends Le{constructor(t=null,e=1,n=1,s,r,o,a,l,c=Oe,h=Oe,u,f){super(null,o,a,l,c,h,s,r,u,f),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Zi=class extends Ce{constructor(t,e,n,s=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){let t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}},zi=new se,Tl=new se,Cr=[],wl=new _n,rd=new se,vs=new Lt,Ms=new qn,Zn=class extends Lt{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new Zi(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,rd)}computeBoundingBox(){let t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new _n),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,zi),wl.copy(t.boundingBox).applyMatrix4(zi),this.boundingBox.union(wl)}computeBoundingSphere(){let t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new qn),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,zi),Ms.copy(t.boundingSphere).applyMatrix4(zi),this.boundingSphere.union(Ms)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){let n=e.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,o=t*r+1;for(let a=0;a<n.length;a++)n[a]=s[o+a]}raycast(t,e){let n=this.matrixWorld,s=this.count;if(vs.geometry=this.geometry,vs.material=this.material,vs.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Ms.copy(this.boundingSphere),Ms.applyMatrix4(n),t.ray.intersectsSphere(Ms)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,zi),Tl.multiplyMatrices(n,zi),vs.matrixWorld=Tl,vs.raycast(t,Cr);for(let o=0,a=Cr.length;o<a;o++){let l=Cr[o];l.instanceId=r,l.object=this,e.push(l)}Cr.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new Zi(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}setMorphAt(t,e){let n=e.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new qr(new Float32Array(s*this.count),s,this.count,Ao,dn));let r=this.morphTexture.source.data.data,o=0;for(let c=0;c<n.length;c++)o+=n[c];let a=this.geometry.morphTargetsRelative?1:1-o,l=s*t;r[l]=a,r.set(n,l+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},Ba=new P,od=new P,ad=new kt,mn=class{constructor(t=new P(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){let s=Ba.subVectors(n,e).cross(od.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){let n=t.delta(Ba),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;let r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){let e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){let n=e||ad.getNormalMatrix(t),s=this.coplanarPoint(Ba).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}},ai=new qn,cd=new at(.5,.5),Ir=new P,Ji=class{constructor(t=new mn,e=new mn,n=new mn,s=new mn,r=new mn,o=new mn){this.planes=[t,e,n,s,r,o]}set(t,e,n,s,r,o){let a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(t){let e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=on,n=!1){let s=this.planes,r=t.elements,o=r[0],a=r[1],l=r[2],c=r[3],h=r[4],u=r[5],f=r[6],p=r[7],g=r[8],y=r[9],m=r[10],d=r[11],x=r[12],M=r[13],v=r[14],T=r[15];if(s[0].setComponents(c-o,p-h,d-g,T-x).normalize(),s[1].setComponents(c+o,p+h,d+g,T+x).normalize(),s[2].setComponents(c+a,p+u,d+y,T+M).normalize(),s[3].setComponents(c-a,p-u,d-y,T-M).normalize(),n)s[4].setComponents(l,f,m,v).normalize(),s[5].setComponents(c-l,p-f,d-m,T-v).normalize();else if(s[4].setComponents(c-l,p-f,d-m,T-v).normalize(),e===on)s[5].setComponents(c+l,p+f,d+m,T+v).normalize();else if(e===Is)s[5].setComponents(l,f,m,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),ai.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),ai.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(ai)}intersectsSprite(t){ai.center.set(0,0,0);let e=cd.distanceTo(t.center);return ai.radius=.7071067811865476+e,ai.applyMatrix4(t.matrixWorld),this.intersectsSphere(ai)}intersectsSphere(t){let e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){let e=this.planes;for(let n=0;n<6;n++){let s=e[n];if(Ir.x=s.normal.x>0?t.max.x:t.min.x,Ir.y=s.normal.y>0?t.max.y:t.min.y,Ir.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Ir)<0)return!1}return!0}containsPoint(t){let e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var Be=class extends Le{constructor(t,e,n,s,r,o,a,l,c){super(t,e,n,s,r,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}},zs=class extends Le{constructor(t,e,n=ti,s,r,o,a=Oe,l=Oe,c,h=Vi,u=1){if(h!==Vi&&h!==rs)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let f={width:t,height:e,depth:u};super(f,s,r,o,a,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new Xi(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){let e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}},Hs=class extends Le{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}},ks=class i extends ve{constructor(t=1,e=1,n=4,s=8,r=1){super(),this.type="CapsuleGeometry",this.parameters={radius:t,height:e,capSegments:n,radialSegments:s,heightSegments:r},e=Math.max(0,e),n=Math.max(1,Math.floor(n)),s=Math.max(3,Math.floor(s)),r=Math.max(1,Math.floor(r));let o=[],a=[],l=[],c=[],h=e/2,u=Math.PI/2*t,f=e,p=2*u+f,g=n*2+r,y=s+1,m=new P,d=new P;for(let x=0;x<=g;x++){let M=0,v=0,T=0,A=0;if(x<=n){let b=x/n,_=b*Math.PI/2;v=-h-t*Math.cos(_),T=t*Math.sin(_),A=-t*Math.cos(_),M=b*u}else if(x<=n+r){let b=(x-n)/r;v=-h+b*e,T=t,A=0,M=u+b*f}else{let b=(x-n-r)/n,_=b*Math.PI/2;v=h+t*Math.sin(_),T=t*Math.cos(_),A=t*Math.sin(_),M=u+f+b*u}let C=Math.max(0,Math.min(1,M/p)),I=0;x===0?I=.5/s:x===g&&(I=-.5/s);for(let b=0;b<=s;b++){let _=b/s,w=_*Math.PI*2,L=Math.sin(w),U=Math.cos(w);d.x=-T*U,d.y=v,d.z=T*L,a.push(d.x,d.y,d.z),m.set(-T*U,A,T*L),m.normalize(),l.push(m.x,m.y,m.z),c.push(_+I,C)}if(x>0){let b=(x-1)*y;for(let _=0;_<s;_++){let w=b+_,L=b+_+1,U=x*y+_,H=x*y+_+1;o.push(w,L,U),o.push(L,H,U)}}}this.setIndex(o),this.setAttribute("position",new Zt(a,3)),this.setAttribute("normal",new Zt(l,3)),this.setAttribute("uv",new Zt(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radius,t.height,t.capSegments,t.radialSegments,t.heightSegments)}};var ce=class i extends ve{constructor(t=1,e=1,n=1,s=32,r=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:l};let c=this;s=Math.floor(s),r=Math.floor(r);let h=[],u=[],f=[],p=[],g=0,y=[],m=n/2,d=0;x(),o===!1&&(t>0&&M(!0),e>0&&M(!1)),this.setIndex(h),this.setAttribute("position",new Zt(u,3)),this.setAttribute("normal",new Zt(f,3)),this.setAttribute("uv",new Zt(p,2));function x(){let v=new P,T=new P,A=0,C=(e-t)/n;for(let I=0;I<=r;I++){let b=[],_=I/r,w=_*(e-t)+t;for(let L=0;L<=s;L++){let U=L/s,H=U*l+a,B=Math.sin(H),z=Math.cos(H);T.x=w*B,T.y=-_*n+m,T.z=w*z,u.push(T.x,T.y,T.z),v.set(B,C,z).normalize(),f.push(v.x,v.y,v.z),p.push(U,1-_),b.push(g++)}y.push(b)}for(let I=0;I<s;I++)for(let b=0;b<r;b++){let _=y[b][I],w=y[b+1][I],L=y[b+1][I+1],U=y[b][I+1];(t>0||b!==0)&&(h.push(_,w,U),A+=3),(e>0||b!==r-1)&&(h.push(w,L,U),A+=3)}c.addGroup(d,A,0),d+=A}function M(v){let T=g,A=new at,C=new P,I=0,b=v===!0?t:e,_=v===!0?1:-1;for(let L=1;L<=s;L++)u.push(0,m*_,0),f.push(0,_,0),p.push(.5,.5),g++;let w=g;for(let L=0;L<=s;L++){let H=L/s*l+a,B=Math.cos(H),z=Math.sin(H);C.x=b*z,C.y=m*_,C.z=b*B,u.push(C.x,C.y,C.z),f.push(0,_,0),A.x=B*.5+.5,A.y=z*.5*_+.5,p.push(A.x,A.y),g++}for(let L=0;L<s;L++){let U=T+L,H=w+L;v===!0?h.push(H,H+1,U):h.push(H+1,H,U),I+=3}c.addGroup(d,I,v===!0?1:2),d+=I}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},Pn=class i extends ce{constructor(t=1,e=1,n=32,s=1,r=!1,o=0,a=Math.PI*2){super(0,t,e,n,s,r,o,a),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(t){return new i(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},Yr=class i extends ve{constructor(t=[],e=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:s};let r=[],o=[];a(s),c(n),h(),this.setAttribute("position",new Zt(r,3)),this.setAttribute("normal",new Zt(r.slice(),3)),this.setAttribute("uv",new Zt(o,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function a(x){let M=new P,v=new P,T=new P;for(let A=0;A<e.length;A+=3)p(e[A+0],M),p(e[A+1],v),p(e[A+2],T),l(M,v,T,x)}function l(x,M,v,T){let A=T+1,C=[];for(let I=0;I<=A;I++){C[I]=[];let b=x.clone().lerp(v,I/A),_=M.clone().lerp(v,I/A),w=A-I;for(let L=0;L<=w;L++)L===0&&I===A?C[I][L]=b:C[I][L]=b.clone().lerp(_,L/w)}for(let I=0;I<A;I++)for(let b=0;b<2*(A-I)-1;b++){let _=Math.floor(b/2);b%2===0?(f(C[I][_+1]),f(C[I+1][_]),f(C[I][_])):(f(C[I][_+1]),f(C[I+1][_+1]),f(C[I+1][_]))}}function c(x){let M=new P;for(let v=0;v<r.length;v+=3)M.x=r[v+0],M.y=r[v+1],M.z=r[v+2],M.normalize().multiplyScalar(x),r[v+0]=M.x,r[v+1]=M.y,r[v+2]=M.z}function h(){let x=new P;for(let M=0;M<r.length;M+=3){x.x=r[M+0],x.y=r[M+1],x.z=r[M+2];let v=m(x)/2/Math.PI+.5,T=d(x)/Math.PI+.5;o.push(v,1-T)}g(),u()}function u(){for(let x=0;x<o.length;x+=6){let M=o[x+0],v=o[x+2],T=o[x+4],A=Math.max(M,v,T),C=Math.min(M,v,T);A>.9&&C<.1&&(M<.2&&(o[x+0]+=1),v<.2&&(o[x+2]+=1),T<.2&&(o[x+4]+=1))}}function f(x){r.push(x.x,x.y,x.z)}function p(x,M){let v=x*3;M.x=t[v+0],M.y=t[v+1],M.z=t[v+2]}function g(){let x=new P,M=new P,v=new P,T=new P,A=new at,C=new at,I=new at;for(let b=0,_=0;b<r.length;b+=9,_+=6){x.set(r[b+0],r[b+1],r[b+2]),M.set(r[b+3],r[b+4],r[b+5]),v.set(r[b+6],r[b+7],r[b+8]),A.set(o[_+0],o[_+1]),C.set(o[_+2],o[_+3]),I.set(o[_+4],o[_+5]),T.copy(x).add(M).add(v).divideScalar(3);let w=m(T);y(A,_+0,x,w),y(C,_+2,M,w),y(I,_+4,v,w)}}function y(x,M,v,T){T<0&&x.x===1&&(o[M]=x.x-1),v.x===0&&v.z===0&&(o[M]=T/2/Math.PI+.5)}function m(x){return Math.atan2(x.z,-x.x)}function d(x){return Math.atan2(-x.y,Math.sqrt(x.x*x.x+x.z*x.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.vertices,t.indices,t.radius,t.details)}},Vs=class i extends Yr{constructor(t=1,e=0){let n=(1+Math.sqrt(5))/2,s=1/n,r=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-s,-n,0,-s,n,0,s,-n,0,s,n,-s,-n,0,-s,n,0,s,-n,0,s,n,0,-n,0,-s,n,0,-s,-n,0,s,n,0,s],o=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(r,o,t,e),this.type="DodecahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new i(t.radius,t.detail)}};var qe=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(t,e){let n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){let e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){let e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){let t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let e=[],n,s=this.getPoint(0),r=0;e.push(0);for(let o=1;o<=t;o++)n=this.getPoint(o/t),r+=n.distanceTo(s),e.push(r),s=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){let n=this.getLengths(),s=0,r=n.length,o;e?o=e:o=t*n[r-1];let a=0,l=r-1,c;for(;a<=l;)if(s=Math.floor(a+(l-a)/2),c=n[s]-o,c<0)a=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===o)return s/(r-1);let h=n[s],f=n[s+1]-h,p=(o-h)/f;return(s+p)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);let o=this.getPoint(s),a=this.getPoint(r),l=e||(o.isVector2?new at:new P);return l.copy(a).sub(o).normalize(),l}getTangentAt(t,e){let n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e=!1){let n=new P,s=[],r=[],o=[],a=new P,l=new se;for(let p=0;p<=t;p++){let g=p/t;s[p]=this.getTangentAt(g,new P)}r[0]=new P,o[0]=new P;let c=Number.MAX_VALUE,h=Math.abs(s[0].x),u=Math.abs(s[0].y),f=Math.abs(s[0].z);h<=c&&(c=h,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),f<=c&&n.set(0,0,1),a.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],a),o[0].crossVectors(s[0],r[0]);for(let p=1;p<=t;p++){if(r[p]=r[p-1].clone(),o[p]=o[p-1].clone(),a.crossVectors(s[p-1],s[p]),a.length()>Number.EPSILON){a.normalize();let g=Math.acos(Gt(s[p-1].dot(s[p]),-1,1));r[p].applyMatrix4(l.makeRotationAxis(a,g))}o[p].crossVectors(s[p],r[p])}if(e===!0){let p=Math.acos(Gt(r[0].dot(r[t]),-1,1));p/=t,s[0].dot(a.crossVectors(r[0],r[t]))>0&&(p=-p);for(let g=1;g<=t;g++)r[g].applyMatrix4(l.makeRotationAxis(s[g],p*g)),o[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){let t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}},$i=class extends qe{constructor(t=0,e=0,n=1,s=1,r=0,o=Math.PI*2,a=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=l}getPoint(t,e=new at){let n=e,s=Math.PI*2,r=this.aEndAngle-this.aStartAngle,o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(o?r=0:r=s),this.aClockwise===!0&&!o&&(r===s?r=-s:r=r-s);let a=this.aStartAngle+t*r,l=this.aX+this.xRadius*Math.cos(a),c=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){let h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),f=l-this.aX,p=c-this.aY;l=f*h-p*u+this.aX,c=f*u+p*h+this.aY}return n.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){let t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}},Zr=class extends $i{constructor(t,e,n,s,r,o){super(t,e,n,n,s,r,o),this.isArcCurve=!0,this.type="ArcCurve"}};function Mc(){let i=0,t=0,e=0,n=0;function s(r,o,a,l){i=r,t=a,e=-3*r+3*o-2*a-l,n=2*r-2*o+a+l}return{initCatmullRom:function(r,o,a,l,c){s(o,a,c*(a-r),c*(l-o))},initNonuniformCatmullRom:function(r,o,a,l,c,h,u){let f=(o-r)/c-(a-r)/(c+h)+(a-o)/h,p=(a-o)/h-(l-o)/(h+u)+(l-a)/u;f*=h,p*=h,s(o,a,f,p)},calc:function(r){let o=r*r,a=o*r;return i+t*r+e*o+n*a}}}var Pr=new P,za=new Mc,Ha=new Mc,ka=new Mc,hn=class extends qe{constructor(t=[],e=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=s}getPoint(t,e=new P){let n=e,s=this.points,r=s.length,o=(r-(this.closed?0:1))*t,a=Math.floor(o),l=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:l===0&&a===r-1&&(a=r-2,l=1);let c,h;this.closed||a>0?c=s[(a-1)%r]:(Pr.subVectors(s[0],s[1]).add(s[0]),c=Pr);let u=s[a%r],f=s[(a+1)%r];if(this.closed||a+2<r?h=s[(a+2)%r]:(Pr.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=Pr),this.curveType==="centripetal"||this.curveType==="chordal"){let p=this.curveType==="chordal"?.5:.25,g=Math.pow(c.distanceToSquared(u),p),y=Math.pow(u.distanceToSquared(f),p),m=Math.pow(f.distanceToSquared(h),p);y<1e-4&&(y=1),g<1e-4&&(g=y),m<1e-4&&(m=y),za.initNonuniformCatmullRom(c.x,u.x,f.x,h.x,g,y,m),Ha.initNonuniformCatmullRom(c.y,u.y,f.y,h.y,g,y,m),ka.initNonuniformCatmullRom(c.z,u.z,f.z,h.z,g,y,m)}else this.curveType==="catmullrom"&&(za.initCatmullRom(c.x,u.x,f.x,h.x,this.tension),Ha.initCatmullRom(c.y,u.y,f.y,h.y,this.tension),ka.initCatmullRom(c.z,u.z,f.z,h.z,this.tension));return n.set(za.calc(l),Ha.calc(l),ka.calc(l)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){let s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(new P().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}};function Al(i,t,e,n,s){let r=(n-t)*.5,o=(s-e)*.5,a=i*i,l=i*a;return(2*e-2*n+r+o)*l+(-3*e+3*n-2*r-o)*a+r*i+e}function ld(i,t){let e=1-i;return e*e*t}function hd(i,t){return 2*(1-i)*i*t}function ud(i,t){return i*i*t}function ws(i,t,e,n){return ld(i,t)+hd(i,e)+ud(i,n)}function dd(i,t){let e=1-i;return e*e*e*t}function fd(i,t){let e=1-i;return 3*e*e*i*t}function pd(i,t){return 3*(1-i)*i*i*t}function md(i,t){return i*i*i*t}function As(i,t,e,n,s){return dd(i,t)+fd(i,e)+pd(i,n)+md(i,s)}var Gs=class extends qe{constructor(t=new at,e=new at,n=new at,s=new at){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new at){let n=e,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(As(t,s.x,r.x,o.x,a.x),As(t,s.y,r.y,o.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},Jr=class extends qe{constructor(t=new P,e=new P,n=new P,s=new P){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new P){let n=e,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(As(t,s.x,r.x,o.x,a.x),As(t,s.y,r.y,o.y,a.y),As(t,s.z,r.z,o.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},Ws=class extends qe{constructor(t=new at,e=new at){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new at){let n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new at){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},$r=class extends qe{constructor(t=new P,e=new P){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new P){let n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new P){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Xs=class extends qe{constructor(t=new at,e=new at,n=new at){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new at){let n=e,s=this.v0,r=this.v1,o=this.v2;return n.set(ws(t,s.x,r.x,o.x),ws(t,s.y,r.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},qs=class extends qe{constructor(t=new P,e=new P,n=new P){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new P){let n=e,s=this.v0,r=this.v1,o=this.v2;return n.set(ws(t,s.x,r.x,o.x),ws(t,s.y,r.y,o.y),ws(t,s.z,r.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Ys=class extends qe{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new at){let n=e,s=this.points,r=(s.length-1)*t,o=Math.floor(r),a=r-o,l=s[o===0?o:o-1],c=s[o],h=s[o>s.length-2?s.length-1:o+1],u=s[o>s.length-3?s.length-1:o+2];return n.set(Al(a,l.x,c.x,h.x,u.x),Al(a,l.y,c.y,h.y,u.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(s.clone())}return this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){let s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(new at().fromArray(s))}return this}},Kr=Object.freeze({__proto__:null,ArcCurve:Zr,CatmullRomCurve3:hn,CubicBezierCurve:Gs,CubicBezierCurve3:Jr,EllipseCurve:$i,LineCurve:Ws,LineCurve3:$r,QuadraticBezierCurve:Xs,QuadraticBezierCurve3:qs,SplineCurve:Ys}),Qr=class extends qe{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){let t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){let n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Kr[n](e,t))}return this}getPoint(t,e){let n=t*this.getLength(),s=this.getCurveLengths(),r=0;for(;r<s.length;){if(s[r]>=n){let o=s[r]-n,a=this.curves[r],l=a.getLength(),c=l===0?0:1-o/l;return a.getPointAt(c,e)}r++}return null}getLength(){let t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let t=[],e=0;for(let n=0,s=this.curves.length;n<s;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){let e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){let e=[],n;for(let s=0,r=this.curves;s<r.length;s++){let o=r[s],a=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,l=o.getPoints(a);for(let c=0;c<l.length;c++){let h=l[c];n&&n.equals(h)||(e.push(h),n=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){let s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){let t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){let s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){let s=t.curves[e];this.curves.push(new Kr[s.type]().fromJSON(s))}return this}},Zs=class extends Qr{constructor(t){super(),this.type="Path",this.currentPoint=new at,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){let n=new Ws(this.currentPoint.clone(),new at(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,s){let r=new Xs(this.currentPoint.clone(),new at(t,e),new at(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(t,e,n,s,r,o){let a=new Gs(this.currentPoint.clone(),new at(t,e),new at(n,s),new at(r,o));return this.curves.push(a),this.currentPoint.set(r,o),this}splineThru(t){let e=[this.currentPoint.clone()].concat(t),n=new Ys(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,s,r,o){let a=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+a,e+l,n,s,r,o),this}absarc(t,e,n,s,r,o){return this.absellipse(t,e,n,n,s,r,o),this}ellipse(t,e,n,s,r,o,a,l){let c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+c,e+h,n,s,r,o,a,l),this}absellipse(t,e,n,s,r,o,a,l){let c=new $i(t,e,n,s,r,o,a,l);if(this.curves.length>0){let u=c.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(c);let h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){let t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}},Dn=class extends Zs{constructor(t){super(t),this.uuid=xi(),this.type="Shape",this.holes=[]}getPointsHoles(t){let e=[];for(let n=0,s=this.holes.length;n<s;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){let s=t.holes[e];this.holes.push(s.clone())}return this}toJSON(){let t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){let s=this.holes[e];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){let s=t.holes[e];this.holes.push(new Zs().fromJSON(s))}return this}};function gd(i,t,e=2){let n=t&&t.length,s=n?t[0]*e:i.length,r=Sh(i,0,s,e,!0),o=[];if(!r||r.next===r.prev)return o;let a,l,c;if(n&&(r=Md(i,t,r,e)),i.length>80*e){a=1/0,l=1/0;let h=-1/0,u=-1/0;for(let f=e;f<s;f+=e){let p=i[f],g=i[f+1];p<a&&(a=p),g<l&&(l=g),p>h&&(h=p),g>u&&(u=g)}c=Math.max(h-a,u-l),c=c!==0?32767/c:0}return Js(r,o,e,a,l,c,0),o}function Sh(i,t,e,n,s){let r;if(s===Dd(i,t,e,n)>0)for(let o=t;o<e;o+=n)r=Rl(o/n|0,i[o],i[o+1],r);else for(let o=e-n;o>=t;o-=n)r=Rl(o/n|0,i[o],i[o+1],r);return r&&Ki(r,r.next)&&(Ks(r),r=r.next),r}function fi(i,t){if(!i)return i;t||(t=i);let e=i,n;do if(n=!1,!e.steiner&&(Ki(e,e.next)||me(e.prev,e,e.next)===0)){if(Ks(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function Js(i,t,e,n,s,r,o){if(!i)return;!o&&r&&wd(i,n,s,r);let a=i;for(;i.prev!==i.next;){let l=i.prev,c=i.next;if(r?xd(i,n,s,r):_d(i)){t.push(l.i,i.i,c.i),Ks(i),i=c.next,a=c.next;continue}if(i=c,i===a){o?o===1?(i=yd(fi(i),t),Js(i,t,e,n,s,r,2)):o===2&&vd(i,t,e,n,s,r):Js(fi(i),t,e,n,s,r,1);break}}}function _d(i){let t=i.prev,e=i,n=i.next;if(me(t,e,n)>=0)return!1;let s=t.x,r=e.x,o=n.x,a=t.y,l=e.y,c=n.y,h=Math.min(s,r,o),u=Math.min(a,l,c),f=Math.max(s,r,o),p=Math.max(a,l,c),g=n.next;for(;g!==t;){if(g.x>=h&&g.x<=f&&g.y>=u&&g.y<=p&&Ss(s,a,r,l,o,c,g.x,g.y)&&me(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function xd(i,t,e,n){let s=i.prev,r=i,o=i.next;if(me(s,r,o)>=0)return!1;let a=s.x,l=r.x,c=o.x,h=s.y,u=r.y,f=o.y,p=Math.min(a,l,c),g=Math.min(h,u,f),y=Math.max(a,l,c),m=Math.max(h,u,f),d=Ja(p,g,t,e,n),x=Ja(y,m,t,e,n),M=i.prevZ,v=i.nextZ;for(;M&&M.z>=d&&v&&v.z<=x;){if(M.x>=p&&M.x<=y&&M.y>=g&&M.y<=m&&M!==s&&M!==o&&Ss(a,h,l,u,c,f,M.x,M.y)&&me(M.prev,M,M.next)>=0||(M=M.prevZ,v.x>=p&&v.x<=y&&v.y>=g&&v.y<=m&&v!==s&&v!==o&&Ss(a,h,l,u,c,f,v.x,v.y)&&me(v.prev,v,v.next)>=0))return!1;v=v.nextZ}for(;M&&M.z>=d;){if(M.x>=p&&M.x<=y&&M.y>=g&&M.y<=m&&M!==s&&M!==o&&Ss(a,h,l,u,c,f,M.x,M.y)&&me(M.prev,M,M.next)>=0)return!1;M=M.prevZ}for(;v&&v.z<=x;){if(v.x>=p&&v.x<=y&&v.y>=g&&v.y<=m&&v!==s&&v!==o&&Ss(a,h,l,u,c,f,v.x,v.y)&&me(v.prev,v,v.next)>=0)return!1;v=v.nextZ}return!0}function yd(i,t){let e=i;do{let n=e.prev,s=e.next.next;!Ki(n,s)&&Th(n,e,e.next,s)&&$s(n,s)&&$s(s,n)&&(t.push(n.i,e.i,s.i),Ks(e),Ks(e.next),e=i=s),e=e.next}while(e!==i);return fi(e)}function vd(i,t,e,n,s,r){let o=i;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&Cd(o,a)){let l=wh(o,a);o=fi(o,o.next),l=fi(l,l.next),Js(o,t,e,n,s,r,0),Js(l,t,e,n,s,r,0);return}a=a.next}o=o.next}while(o!==i)}function Md(i,t,e,n){let s=[];for(let r=0,o=t.length;r<o;r++){let a=t[r]*n,l=r<o-1?t[r+1]*n:i.length,c=Sh(i,a,l,n,!1);c===c.next&&(c.steiner=!0),s.push(Rd(c))}s.sort(bd);for(let r=0;r<s.length;r++)e=Sd(s[r],e);return e}function bd(i,t){let e=i.x-t.x;if(e===0&&(e=i.y-t.y,e===0)){let n=(i.next.y-i.y)/(i.next.x-i.x),s=(t.next.y-t.y)/(t.next.x-t.x);e=n-s}return e}function Sd(i,t){let e=Ed(i,t);if(!e)return t;let n=wh(e,i);return fi(n,n.next),fi(e,e.next)}function Ed(i,t){let e=t,n=i.x,s=i.y,r=-1/0,o;if(Ki(i,e))return e;do{if(Ki(i,e.next))return e.next;if(s<=e.y&&s>=e.next.y&&e.next.y!==e.y){let u=e.x+(s-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(u<=n&&u>r&&(r=u,o=e.x<e.next.x?e:e.next,u===n))return o}e=e.next}while(e!==t);if(!o)return null;let a=o,l=o.x,c=o.y,h=1/0;e=o;do{if(n>=e.x&&e.x>=l&&n!==e.x&&Eh(s<c?n:r,s,l,c,s<c?r:n,s,e.x,e.y)){let u=Math.abs(s-e.y)/(n-e.x);$s(e,i)&&(u<h||u===h&&(e.x>o.x||e.x===o.x&&Td(o,e)))&&(o=e,h=u)}e=e.next}while(e!==a);return o}function Td(i,t){return me(i.prev,i,t.prev)<0&&me(t.next,i,i.next)<0}function wd(i,t,e,n){let s=i;do s.z===0&&(s.z=Ja(s.x,s.y,t,e,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,Ad(s)}function Ad(i){let t,e=1;do{let n=i,s;i=null;let r=null;for(t=0;n;){t++;let o=n,a=0;for(let c=0;c<e&&(a++,o=o.nextZ,!!o);c++);let l=e;for(;a>0||l>0&&o;)a!==0&&(l===0||!o||n.z<=o.z)?(s=n,n=n.nextZ,a--):(s=o,o=o.nextZ,l--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;n=o}r.nextZ=null,e*=2}while(t>1);return i}function Ja(i,t,e,n,s){return i=(i-e)*s|0,t=(t-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,i|t<<1}function Rd(i){let t=i,e=i;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==i);return e}function Eh(i,t,e,n,s,r,o,a){return(s-o)*(t-a)>=(i-o)*(r-a)&&(i-o)*(n-a)>=(e-o)*(t-a)&&(e-o)*(r-a)>=(s-o)*(n-a)}function Ss(i,t,e,n,s,r,o,a){return!(i===o&&t===a)&&Eh(i,t,e,n,s,r,o,a)}function Cd(i,t){return i.next.i!==t.i&&i.prev.i!==t.i&&!Id(i,t)&&($s(i,t)&&$s(t,i)&&Pd(i,t)&&(me(i.prev,i,t.prev)||me(i,t.prev,t))||Ki(i,t)&&me(i.prev,i,i.next)>0&&me(t.prev,t,t.next)>0)}function me(i,t,e){return(t.y-i.y)*(e.x-t.x)-(t.x-i.x)*(e.y-t.y)}function Ki(i,t){return i.x===t.x&&i.y===t.y}function Th(i,t,e,n){let s=Lr(me(i,t,e)),r=Lr(me(i,t,n)),o=Lr(me(e,n,i)),a=Lr(me(e,n,t));return!!(s!==r&&o!==a||s===0&&Dr(i,e,t)||r===0&&Dr(i,n,t)||o===0&&Dr(e,i,n)||a===0&&Dr(e,t,n))}function Dr(i,t,e){return t.x<=Math.max(i.x,e.x)&&t.x>=Math.min(i.x,e.x)&&t.y<=Math.max(i.y,e.y)&&t.y>=Math.min(i.y,e.y)}function Lr(i){return i>0?1:i<0?-1:0}function Id(i,t){let e=i;do{if(e.i!==i.i&&e.next.i!==i.i&&e.i!==t.i&&e.next.i!==t.i&&Th(e,e.next,i,t))return!0;e=e.next}while(e!==i);return!1}function $s(i,t){return me(i.prev,i,i.next)<0?me(i,t,i.next)>=0&&me(i,i.prev,t)>=0:me(i,t,i.prev)<0||me(i,i.next,t)<0}function Pd(i,t){let e=i,n=!1,s=(i.x+t.x)/2,r=(i.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&s<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==i);return n}function wh(i,t){let e=$a(i.i,i.x,i.y),n=$a(t.i,t.x,t.y),s=i.next,r=t.prev;return i.next=t,t.prev=i,e.next=s,s.prev=e,n.next=e,e.prev=n,r.next=n,n.prev=r,n}function Rl(i,t,e,n){let s=$a(i,t,e);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function Ks(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function $a(i,t,e){return{i,x:t,y:e,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function Dd(i,t,e,n){let s=0;for(let r=t,o=e-n;r<e;r+=n)s+=(i[o]-i[r])*(i[r+1]+i[o+1]),o=r;return s}var Ka=class{static triangulate(t,e,n=2){return gd(t,e,n)}},li=class i{static area(t){let e=t.length,n=0;for(let s=e-1,r=0;r<e;s=r++)n+=t[s].x*t[r].y-t[r].x*t[s].y;return n*.5}static isClockWise(t){return i.area(t)<0}static triangulateShape(t,e){let n=[],s=[],r=[];Cl(t),Il(n,t);let o=t.length;e.forEach(Cl);for(let l=0;l<e.length;l++)s.push(o),o+=e[l].length,Il(n,e[l]);let a=Ka.triangulate(n,s);for(let l=0;l<a.length;l+=3)r.push(a.slice(l,l+3));return r}};function Cl(i){let t=i.length;t>2&&i[t-1].equals(i[0])&&i.pop()}function Il(i,t){for(let e=0;e<t.length;e++)i.push(t[e].x),i.push(t[e].y)}var Jn=class i extends ve{constructor(t=new Dn([new at(.5,.5),new at(-.5,.5),new at(-.5,-.5),new at(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];let n=this,s=[],r=[];for(let a=0,l=t.length;a<l;a++){let c=t[a];o(c)}this.setAttribute("position",new Zt(s,3)),this.setAttribute("uv",new Zt(r,2)),this.computeVertexNormals();function o(a){let l=[],c=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,u=e.depth!==void 0?e.depth:1,f=e.bevelEnabled!==void 0?e.bevelEnabled:!0,p=e.bevelThickness!==void 0?e.bevelThickness:.2,g=e.bevelSize!==void 0?e.bevelSize:p-.1,y=e.bevelOffset!==void 0?e.bevelOffset:0,m=e.bevelSegments!==void 0?e.bevelSegments:3,d=e.extrudePath,x=e.UVGenerator!==void 0?e.UVGenerator:Ld,M,v=!1,T,A,C,I;d&&(M=d.getSpacedPoints(h),v=!0,f=!1,T=d.computeFrenetFrames(h,!1),A=new P,C=new P,I=new P),f||(m=0,p=0,g=0,y=0);let b=a.extractPoints(c),_=b.shape,w=b.holes;if(!li.isClockWise(_)){_=_.reverse();for(let tt=0,K=w.length;tt<K;tt++){let $=w[tt];li.isClockWise($)&&(w[tt]=$.reverse())}}function U(tt){let $=10000000000000001e-36,J=tt[0];for(let ht=1;ht<=tt.length;ht++){let nt=ht%tt.length,ut=tt[nt],Ot=ut.x-J.x,Ft=ut.y-J.y,R=Ot*Ot+Ft*Ft,S=Math.max(Math.abs(ut.x),Math.abs(ut.y),Math.abs(J.x),Math.abs(J.y)),k=$*S*S;if(R<=k){tt.splice(nt,1),ht--;continue}J=ut}}U(_),w.forEach(U);let H=w.length,B=_;for(let tt=0;tt<H;tt++){let K=w[tt];_=_.concat(K)}function z(tt,K,$){return K||console.error("THREE.ExtrudeGeometry: vec does not exist"),tt.clone().addScaledVector(K,$)}let Y=_.length;function V(tt,K,$){let J,ht,nt,ut=tt.x-K.x,Ot=tt.y-K.y,Ft=$.x-tt.x,R=$.y-tt.y,S=ut*ut+Ot*Ot,k=ut*R-Ot*Ft;if(Math.abs(k)>Number.EPSILON){let X=Math.sqrt(S),j=Math.sqrt(Ft*Ft+R*R),q=K.x-Ot/X,At=K.y+ut/X,ct=$.x-R/j,Et=$.y+Ft/j,Tt=((ct-q)*R-(Et-At)*Ft)/(ut*R-Ot*Ft);J=q+ut*Tt-tt.x,ht=At+Ot*Tt-tt.y;let it=J*J+ht*ht;if(it<=2)return new at(J,ht);nt=Math.sqrt(it/2)}else{let X=!1;ut>Number.EPSILON?Ft>Number.EPSILON&&(X=!0):ut<-Number.EPSILON?Ft<-Number.EPSILON&&(X=!0):Math.sign(Ot)===Math.sign(R)&&(X=!0),X?(J=-Ot,ht=ut,nt=Math.sqrt(S)):(J=ut,ht=Ot,nt=Math.sqrt(S/2))}return new at(J/nt,ht/nt)}let lt=[];for(let tt=0,K=B.length,$=K-1,J=tt+1;tt<K;tt++,$++,J++)$===K&&($=0),J===K&&(J=0),lt[tt]=V(B[tt],B[$],B[J]);let _t=[],vt,Ht=lt.concat();for(let tt=0,K=H;tt<K;tt++){let $=w[tt];vt=[];for(let J=0,ht=$.length,nt=ht-1,ut=J+1;J<ht;J++,nt++,ut++)nt===ht&&(nt=0),ut===ht&&(ut=0),vt[J]=V($[J],$[nt],$[ut]);_t.push(vt),Ht=Ht.concat(vt)}let Jt;if(m===0)Jt=li.triangulateShape(B,w);else{let tt=[],K=[];for(let $=0;$<m;$++){let J=$/m,ht=p*Math.cos(J*Math.PI/2),nt=g*Math.sin(J*Math.PI/2)+y;for(let ut=0,Ot=B.length;ut<Ot;ut++){let Ft=z(B[ut],lt[ut],nt);Ct(Ft.x,Ft.y,-ht),J===0&&tt.push(Ft)}for(let ut=0,Ot=H;ut<Ot;ut++){let Ft=w[ut];vt=_t[ut];let R=[];for(let S=0,k=Ft.length;S<k;S++){let X=z(Ft[S],vt[S],nt);Ct(X.x,X.y,-ht),J===0&&R.push(X)}J===0&&K.push(R)}}Jt=li.triangulateShape(tt,K)}let te=Jt.length,$t=g+y;for(let tt=0;tt<Y;tt++){let K=f?z(_[tt],Ht[tt],$t):_[tt];v?(C.copy(T.normals[0]).multiplyScalar(K.x),A.copy(T.binormals[0]).multiplyScalar(K.y),I.copy(M[0]).add(C).add(A),Ct(I.x,I.y,I.z)):Ct(K.x,K.y,0)}for(let tt=1;tt<=h;tt++)for(let K=0;K<Y;K++){let $=f?z(_[K],Ht[K],$t):_[K];v?(C.copy(T.normals[tt]).multiplyScalar($.x),A.copy(T.binormals[tt]).multiplyScalar($.y),I.copy(M[tt]).add(C).add(A),Ct(I.x,I.y,I.z)):Ct($.x,$.y,u/h*tt)}for(let tt=m-1;tt>=0;tt--){let K=tt/m,$=p*Math.cos(K*Math.PI/2),J=g*Math.sin(K*Math.PI/2)+y;for(let ht=0,nt=B.length;ht<nt;ht++){let ut=z(B[ht],lt[ht],J);Ct(ut.x,ut.y,u+$)}for(let ht=0,nt=w.length;ht<nt;ht++){let ut=w[ht];vt=_t[ht];for(let Ot=0,Ft=ut.length;Ot<Ft;Ot++){let R=z(ut[Ot],vt[Ot],J);v?Ct(R.x,R.y+M[h-1].y,M[h-1].x+$):Ct(R.x,R.y,u+$)}}}Z(),et();function Z(){let tt=s.length/3;if(f){let K=0,$=Y*K;for(let J=0;J<te;J++){let ht=Jt[J];St(ht[2]+$,ht[1]+$,ht[0]+$)}K=h+m*2,$=Y*K;for(let J=0;J<te;J++){let ht=Jt[J];St(ht[0]+$,ht[1]+$,ht[2]+$)}}else{for(let K=0;K<te;K++){let $=Jt[K];St($[2],$[1],$[0])}for(let K=0;K<te;K++){let $=Jt[K];St($[0]+Y*h,$[1]+Y*h,$[2]+Y*h)}}n.addGroup(tt,s.length/3-tt,0)}function et(){let tt=s.length/3,K=0;yt(B,K),K+=B.length;for(let $=0,J=w.length;$<J;$++){let ht=w[$];yt(ht,K),K+=ht.length}n.addGroup(tt,s.length/3-tt,1)}function yt(tt,K){let $=tt.length;for(;--$>=0;){let J=$,ht=$-1;ht<0&&(ht=tt.length-1);for(let nt=0,ut=h+m*2;nt<ut;nt++){let Ot=Y*nt,Ft=Y*(nt+1),R=K+J+Ot,S=K+ht+Ot,k=K+ht+Ft,X=K+J+Ft;Xt(R,S,k,X)}}}function Ct(tt,K,$){l.push(tt),l.push(K),l.push($)}function St(tt,K,$){oe(tt),oe(K),oe($);let J=s.length/3,ht=x.generateTopUV(n,s,J-3,J-2,J-1);D(ht[0]),D(ht[1]),D(ht[2])}function Xt(tt,K,$,J){oe(tt),oe(K),oe(J),oe(K),oe($),oe(J);let ht=s.length/3,nt=x.generateSideWallUV(n,s,ht-6,ht-3,ht-2,ht-1);D(nt[0]),D(nt[1]),D(nt[3]),D(nt[1]),D(nt[2]),D(nt[3])}function oe(tt){s.push(l[tt*3+0]),s.push(l[tt*3+1]),s.push(l[tt*3+2])}function D(tt){r.push(tt.x),r.push(tt.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON(),e=this.parameters.shapes,n=this.parameters.options;return Ud(e,n,t)}static fromJSON(t,e){let n=[];for(let r=0,o=t.shapes.length;r<o;r++){let a=e[t.shapes[r]];n.push(a)}let s=t.options.extrudePath;return s!==void 0&&(t.options.extrudePath=new Kr[s.type]().fromJSON(s)),new i(n,t.options)}},Ld={generateTopUV:function(i,t,e,n,s){let r=t[e*3],o=t[e*3+1],a=t[n*3],l=t[n*3+1],c=t[s*3],h=t[s*3+1];return[new at(r,o),new at(a,l),new at(c,h)]},generateSideWallUV:function(i,t,e,n,s,r){let o=t[e*3],a=t[e*3+1],l=t[e*3+2],c=t[n*3],h=t[n*3+1],u=t[n*3+2],f=t[s*3],p=t[s*3+1],g=t[s*3+2],y=t[r*3],m=t[r*3+1],d=t[r*3+2];return Math.abs(a-h)<Math.abs(o-c)?[new at(o,1-l),new at(c,1-u),new at(f,1-g),new at(y,1-d)]:[new at(a,1-l),new at(h,1-u),new at(p,1-g),new at(m,1-d)]}};function Ud(i,t,e){if(e.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){let r=i[n];e.shapes.push(r.uuid)}else e.shapes.push(i.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}var Qs=class i extends ve{constructor(t=[new at(0,-.5),new at(.5,0),new at(0,.5)],e=12,n=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:e,phiStart:n,phiLength:s},e=Math.floor(e),s=Gt(s,0,Math.PI*2);let r=[],o=[],a=[],l=[],c=[],h=1/e,u=new P,f=new at,p=new P,g=new P,y=new P,m=0,d=0;for(let x=0;x<=t.length-1;x++)switch(x){case 0:m=t[x+1].x-t[x].x,d=t[x+1].y-t[x].y,p.x=d*1,p.y=-m,p.z=d*0,y.copy(p),p.normalize(),l.push(p.x,p.y,p.z);break;case t.length-1:l.push(y.x,y.y,y.z);break;default:m=t[x+1].x-t[x].x,d=t[x+1].y-t[x].y,p.x=d*1,p.y=-m,p.z=d*0,g.copy(p),p.x+=y.x,p.y+=y.y,p.z+=y.z,p.normalize(),l.push(p.x,p.y,p.z),y.copy(g)}for(let x=0;x<=e;x++){let M=n+x*h*s,v=Math.sin(M),T=Math.cos(M);for(let A=0;A<=t.length-1;A++){u.x=t[A].x*v,u.y=t[A].y,u.z=t[A].x*T,o.push(u.x,u.y,u.z),f.x=x/e,f.y=A/(t.length-1),a.push(f.x,f.y);let C=l[3*A+0]*v,I=l[3*A+1],b=l[3*A+0]*T;c.push(C,I,b)}}for(let x=0;x<e;x++)for(let M=0;M<t.length-1;M++){let v=M+x*t.length,T=v,A=v+t.length,C=v+t.length+1,I=v+1;r.push(T,A,I),r.push(C,I,A)}this.setIndex(r),this.setAttribute("position",new Zt(o,3)),this.setAttribute("uv",new Zt(a,2)),this.setAttribute("normal",new Zt(c,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.points,t.segments,t.phiStart,t.phiLength)}};var Me=class i extends ve{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};let r=t/2,o=e/2,a=Math.floor(n),l=Math.floor(s),c=a+1,h=l+1,u=t/a,f=e/l,p=[],g=[],y=[],m=[];for(let d=0;d<h;d++){let x=d*f-o;for(let M=0;M<c;M++){let v=M*u-r;g.push(v,-x,0),y.push(0,0,1),m.push(M/a),m.push(1-d/l)}}for(let d=0;d<l;d++)for(let x=0;x<a;x++){let M=x+c*d,v=x+c*(d+1),T=x+1+c*(d+1),A=x+1+c*d;p.push(M,v,A),p.push(v,T,A)}this.setIndex(p),this.setAttribute("position",new Zt(g,3)),this.setAttribute("normal",new Zt(y,3)),this.setAttribute("uv",new Zt(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.widthSegments,t.heightSegments)}};var Ye=class i extends ve{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));let l=Math.min(o+a,Math.PI),c=0,h=[],u=new P,f=new P,p=[],g=[],y=[],m=[];for(let d=0;d<=n;d++){let x=[],M=d/n,v=0;d===0&&o===0?v=.5/e:d===n&&l===Math.PI&&(v=-.5/e);for(let T=0;T<=e;T++){let A=T/e;u.x=-t*Math.cos(s+A*r)*Math.sin(o+M*a),u.y=t*Math.cos(o+M*a),u.z=t*Math.sin(s+A*r)*Math.sin(o+M*a),g.push(u.x,u.y,u.z),f.copy(u).normalize(),y.push(f.x,f.y,f.z),m.push(A+v,1-M),x.push(c++)}h.push(x)}for(let d=0;d<n;d++)for(let x=0;x<e;x++){let M=h[d][x+1],v=h[d][x],T=h[d+1][x],A=h[d+1][x+1];(d!==0||o>0)&&p.push(M,v,A),(d!==n-1||l<Math.PI)&&p.push(v,T,A)}this.setIndex(p),this.setAttribute("position",new Zt(g,3)),this.setAttribute("normal",new Zt(y,3)),this.setAttribute("uv",new Zt(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}};var ze=class i extends ve{constructor(t=1,e=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);let o=[],a=[],l=[],c=[],h=new P,u=new P,f=new P;for(let p=0;p<=n;p++)for(let g=0;g<=s;g++){let y=g/s*r,m=p/n*Math.PI*2;u.x=(t+e*Math.cos(m))*Math.cos(y),u.y=(t+e*Math.cos(m))*Math.sin(y),u.z=e*Math.sin(m),a.push(u.x,u.y,u.z),h.x=t*Math.cos(y),h.y=t*Math.sin(y),f.subVectors(u,h).normalize(),l.push(f.x,f.y,f.z),c.push(g/s),c.push(p/n)}for(let p=1;p<=n;p++)for(let g=1;g<=s;g++){let y=(s+1)*p+g-1,m=(s+1)*(p-1)+g-1,d=(s+1)*(p-1)+g,x=(s+1)*p+g;o.push(y,m,x),o.push(m,d,x)}this.setIndex(o),this.setAttribute("position",new Zt(a,3)),this.setAttribute("normal",new Zt(l,3)),this.setAttribute("uv",new Zt(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}};var xn=class i extends ve{constructor(t=new qs(new P(-1,-1,0),new P(-1,1,0),new P(1,1,0)),e=64,n=1,s=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:t,tubularSegments:e,radius:n,radialSegments:s,closed:r};let o=t.computeFrenetFrames(e,r);this.tangents=o.tangents,this.normals=o.normals,this.binormals=o.binormals;let a=new P,l=new P,c=new at,h=new P,u=[],f=[],p=[],g=[];y(),this.setIndex(g),this.setAttribute("position",new Zt(u,3)),this.setAttribute("normal",new Zt(f,3)),this.setAttribute("uv",new Zt(p,2));function y(){for(let M=0;M<e;M++)m(M);m(r===!1?e:0),x(),d()}function m(M){h=t.getPointAt(M/e,h);let v=o.normals[M],T=o.binormals[M];for(let A=0;A<=s;A++){let C=A/s*Math.PI*2,I=Math.sin(C),b=-Math.cos(C);l.x=b*v.x+I*T.x,l.y=b*v.y+I*T.y,l.z=b*v.z+I*T.z,l.normalize(),f.push(l.x,l.y,l.z),a.x=h.x+n*l.x,a.y=h.y+n*l.y,a.z=h.z+n*l.z,u.push(a.x,a.y,a.z)}}function d(){for(let M=1;M<=e;M++)for(let v=1;v<=s;v++){let T=(s+1)*(M-1)+(v-1),A=(s+1)*M+(v-1),C=(s+1)*M+v,I=(s+1)*(M-1)+v;g.push(T,A,I),g.push(A,C,I)}}function x(){for(let M=0;M<=e;M++)for(let v=0;v<=s;v++)c.x=M/e,c.y=v/s,p.push(c.x,c.y)}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON();return t.path=this.parameters.path.toJSON(),t}static fromJSON(t){return new i(new Kr[t.path.type]().fromJSON(t.path),t.tubularSegments,t.radius,t.radialSegments,t.closed)}};var Ue=class extends Yn{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new zt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new zt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=pc,this.normalScale=new at(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Xe,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}},pi=class extends Ue{constructor(t){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new at(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return Gt(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new zt(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new zt(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new zt(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(t)}get anisotropy(){return this._anisotropy}set anisotropy(t){this._anisotropy>0!=t>0&&this.version++,this._anisotropy=t}get clearcoat(){return this._clearcoat}set clearcoat(t){this._clearcoat>0!=t>0&&this.version++,this._clearcoat=t}get iridescence(){return this._iridescence}set iridescence(t){this._iridescence>0!=t>0&&this.version++,this._iridescence=t}get dispersion(){return this._dispersion}set dispersion(t){this._dispersion>0!=t>0&&this.version++,this._dispersion=t}get sheen(){return this._sheen}set sheen(t){this._sheen>0!=t>0&&this.version++,this._sheen=t}get transmission(){return this._transmission}set transmission(t){this._transmission>0!=t>0&&this.version++,this._transmission=t}copy(t){return super.copy(t),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=t.anisotropy,this.anisotropyRotation=t.anisotropyRotation,this.anisotropyMap=t.anisotropyMap,this.clearcoat=t.clearcoat,this.clearcoatMap=t.clearcoatMap,this.clearcoatRoughness=t.clearcoatRoughness,this.clearcoatRoughnessMap=t.clearcoatRoughnessMap,this.clearcoatNormalMap=t.clearcoatNormalMap,this.clearcoatNormalScale.copy(t.clearcoatNormalScale),this.dispersion=t.dispersion,this.ior=t.ior,this.iridescence=t.iridescence,this.iridescenceMap=t.iridescenceMap,this.iridescenceIOR=t.iridescenceIOR,this.iridescenceThicknessRange=[...t.iridescenceThicknessRange],this.iridescenceThicknessMap=t.iridescenceThicknessMap,this.sheen=t.sheen,this.sheenColor.copy(t.sheenColor),this.sheenColorMap=t.sheenColorMap,this.sheenRoughness=t.sheenRoughness,this.sheenRoughnessMap=t.sheenRoughnessMap,this.transmission=t.transmission,this.transmissionMap=t.transmissionMap,this.thickness=t.thickness,this.thicknessMap=t.thicknessMap,this.attenuationDistance=t.attenuationDistance,this.attenuationColor.copy(t.attenuationColor),this.specularIntensity=t.specularIntensity,this.specularIntensityMap=t.specularIntensityMap,this.specularColor.copy(t.specularColor),this.specularColorMap=t.specularColorMap,this}};var jr=class extends Yn{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=lh,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},to=class extends Yn{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}};function Ur(i,t){return!i||i.constructor===t?i:typeof t.BYTES_PER_ELEMENT=="number"?new t(i):Array.prototype.slice.call(i)}function Nd(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}var mi=class{constructor(t,e,n,s){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new e.constructor(n),this.sampleValues=e,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,n=this._cachedIndex,s=e[n],r=e[n-1];n:{t:{let o;e:{i:if(!(t<s)){for(let a=n+2;;){if(s===void 0){if(t<r)break i;return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=s,s=e[++n],t<s)break t}o=e.length;break e}if(!(t>=r)){let a=e[1];t<a&&(n=2,r=a);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(s=r,r=e[--n-1],t>=r)break t}o=n,n=0;break e}break n}for(;n<o;){let a=n+o>>>1;t<e[a]?o=a:n=a+1}if(s=e[n],r=e[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,t,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=t*s;for(let o=0;o!==s;++o)e[o]=n[r+o];return e}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},eo=class extends mi{constructor(t,e,n,s){super(t,e,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Wa,endingEnd:Wa}}intervalChanged_(t,e,n){let s=this.parameterPositions,r=t-2,o=t+1,a=s[r],l=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case Xa:r=t,a=2*e-n;break;case qa:r=s.length-2,a=e+s[r]-s[r+1];break;default:r=t,a=n}if(l===void 0)switch(this.getSettings_().endingEnd){case Xa:o=t,l=2*n-e;break;case qa:o=1,l=n+s[1]-s[0];break;default:o=t-1,l=e}let c=(n-e)*.5,h=this.valueSize;this._weightPrev=c/(e-a),this._weightNext=c/(l-n),this._offsetPrev=r*h,this._offsetNext=o*h}interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,h=this._offsetPrev,u=this._offsetNext,f=this._weightPrev,p=this._weightNext,g=(n-e)/(s-e),y=g*g,m=y*g,d=-f*m+2*f*y-f*g,x=(1+f)*m+(-1.5-2*f)*y+(-.5+f)*g+1,M=(-1-p)*m+(1.5+p)*y+.5*g,v=p*m-p*y;for(let T=0;T!==a;++T)r[T]=d*o[h+T]+x*o[c+T]+M*o[l+T]+v*o[u+T];return r}},no=class extends mi{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,h=(n-e)/(s-e),u=1-h;for(let f=0;f!==a;++f)r[f]=o[c+f]*u+o[l+f]*h;return r}},io=class extends mi{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t){return this.copySampleValue_(t-1)}},Ze=class{constructor(t,e,n,s){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=Ur(e,this.TimeBufferType),this.values=Ur(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,n;if(e.toJSON!==this.toJSON)n=e.toJSON(t);else{n={name:t.name,times:Ur(t.times,Array),values:Ur(t.values,Array)};let s=t.getInterpolation();s!==t.DefaultInterpolation&&(n.interpolation=s)}return n.type=t.ValueTypeName,n}InterpolantFactoryMethodDiscrete(t){return new io(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new no(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new eo(this.times,this.values,this.getValueSize(),t)}setInterpolation(t){let e;switch(t){case Rs:e=this.InterpolantFactoryMethodDiscrete;break;case zr:e=this.InterpolantFactoryMethodLinear;break;case Nr:e=this.InterpolantFactoryMethodSmooth;break}if(e===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Rs;case this.InterpolantFactoryMethodLinear:return zr;case this.InterpolantFactoryMethodSmooth:return Nr}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]+=t}return this}scale(t){if(t!==1){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]*=t}return this}trim(t,e){let n=this.times,s=n.length,r=0,o=s-1;for(;r!==s&&n[r]<t;)++r;for(;o!==-1&&n[o]>e;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let t=!0,e=this.getValueSize();e-Math.floor(e)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),t=!1);let n=this.times,s=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),t=!1);let o=null;for(let a=0;a!==r;a++){let l=n[a];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,l),t=!1;break}if(o!==null&&o>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,l,o),t=!1;break}o=l}if(s!==void 0&&Nd(s))for(let a=0,l=s.length;a!==l;++a){let c=s[a];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,c),t=!1;break}}return t}optimize(){let t=this.times.slice(),e=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===Nr,r=t.length-1,o=1;for(let a=1;a<r;++a){let l=!1,c=t[a],h=t[a+1];if(c!==h&&(a!==1||c!==t[0]))if(s)l=!0;else{let u=a*n,f=u-n,p=u+n;for(let g=0;g!==n;++g){let y=e[u+g];if(y!==e[f+g]||y!==e[p+g]){l=!0;break}}}if(l){if(a!==o){t[o]=t[a];let u=a*n,f=o*n;for(let p=0;p!==n;++p)e[f+p]=e[u+p]}++o}}if(r>0){t[o]=t[r];for(let a=r*n,l=o*n,c=0;c!==n;++c)e[l+c]=e[a+c];++o}return o!==t.length?(this.times=t.slice(0,o),this.values=e.slice(0,o*n)):(this.times=t,this.values=e),this}clone(){let t=this.times.slice(),e=this.values.slice(),n=this.constructor,s=new n(this.name,t,e);return s.createInterpolant=this.createInterpolant,s}};Ze.prototype.ValueTypeName="";Ze.prototype.TimeBufferType=Float32Array;Ze.prototype.ValueBufferType=Float32Array;Ze.prototype.DefaultInterpolation=zr;var $n=class extends Ze{constructor(t,e,n){super(t,e,n)}};$n.prototype.ValueTypeName="bool";$n.prototype.ValueBufferType=Array;$n.prototype.DefaultInterpolation=Rs;$n.prototype.InterpolantFactoryMethodLinear=void 0;$n.prototype.InterpolantFactoryMethodSmooth=void 0;var so=class extends Ze{constructor(t,e,n,s){super(t,e,n,s)}};so.prototype.ValueTypeName="color";var ro=class extends Ze{constructor(t,e,n,s){super(t,e,n,s)}};ro.prototype.ValueTypeName="number";var oo=class extends mi{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(n-e)/(s-e),c=t*a;for(let h=c+a;c!==h;c+=4)cn.slerpFlat(r,0,o,c-a,o,c,l);return r}},js=class extends Ze{constructor(t,e,n,s){super(t,e,n,s)}InterpolantFactoryMethodLinear(t){return new oo(this.times,this.values,this.getValueSize(),t)}};js.prototype.ValueTypeName="quaternion";js.prototype.InterpolantFactoryMethodSmooth=void 0;var Kn=class extends Ze{constructor(t,e,n){super(t,e,n)}};Kn.prototype.ValueTypeName="string";Kn.prototype.ValueBufferType=Array;Kn.prototype.DefaultInterpolation=Rs;Kn.prototype.InterpolantFactoryMethodLinear=void 0;Kn.prototype.InterpolantFactoryMethodSmooth=void 0;var ao=class extends Ze{constructor(t,e,n,s){super(t,e,n,s)}};ao.prototype.ValueTypeName="vector";var co=class{constructor(t,e,n){let s=this,r=!1,o=0,a=0,l,c=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this.abortController=new AbortController,this.itemStart=function(h){a++,r===!1&&s.onStart!==void 0&&s.onStart(h,o,a),r=!0},this.itemEnd=function(h){o++,s.onProgress!==void 0&&s.onProgress(h,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,u){return c.push(h,u),this},this.removeHandler=function(h){let u=c.indexOf(h);return u!==-1&&c.splice(u,2),this},this.getHandler=function(h){for(let u=0,f=c.length;u<f;u+=2){let p=c[u],g=c[u+1];if(p.global&&(p.lastIndex=0),p.test(h))return g}return null},this.abort=function(){return this.abortController.abort(),this.abortController=new AbortController,this}}},Ah=new co,lo=class{constructor(t){this.manager=t!==void 0?t:Ah,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(t,e){let n=this;return new Promise(function(s,r){n.load(t,s,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}abort(){return this}};lo.DEFAULT_MATERIAL_NAME="__DEFAULT";var Qi=class extends _e{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new zt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){let e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}},ji=class extends Qi{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(_e.DEFAULT_UP),this.updateMatrix(),this.groundColor=new zt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}},Va=new se,Pl=new P,Dl=new P,ho=class{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new at(512,512),this.mapType=un,this.map=null,this.mapPass=null,this.matrix=new se,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ji,this._frameExtents=new at(1,1),this._viewportCount=1,this._viewports=[new ee(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){let e=this.camera,n=this.matrix;Pl.setFromMatrixPosition(t.matrixWorld),e.position.copy(Pl),Dl.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Dl),e.updateMatrixWorld(),Va.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Va,e.coordinateSystem,e.reversedDepth),e.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Va)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}};var Ll=new se,bs=new P,Ga=new P,Qa=class extends ho{constructor(){super(new Te(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new at(4,2),this._viewportCount=6,this._viewports=[new ee(2,1,1,1),new ee(0,1,1,1),new ee(3,1,1,1),new ee(1,1,1,1),new ee(3,0,1,1),new ee(1,0,1,1)],this._cubeDirections=[new P(1,0,0),new P(-1,0,0),new P(0,0,1),new P(0,0,-1),new P(0,1,0),new P(0,-1,0)],this._cubeUps=[new P(0,1,0),new P(0,1,0),new P(0,1,0),new P(0,1,0),new P(0,0,1),new P(0,0,-1)]}updateMatrices(t,e=0){let n=this.camera,s=this.matrix,r=t.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),bs.setFromMatrixPosition(t.matrixWorld),n.position.copy(bs),Ga.copy(n.position),Ga.add(this._cubeDirections[e]),n.up.copy(this._cubeUps[e]),n.lookAt(Ga),n.updateMatrixWorld(),s.makeTranslation(-bs.x,-bs.y,-bs.z),Ll.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ll,n.coordinateSystem,n.reversedDepth)}},Qn=class extends Qi{constructor(t,e,n=0,s=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new Qa}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}},tr=class extends Fs{constructor(t=-1,e=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-t,o=n+t,a=s+e,l=s-e;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}},ja=class extends ho{constructor(){super(new tr(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},ts=class extends Qi{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(_e.DEFAULT_UP),this.updateMatrix(),this.target=new _e,this.shadow=new ja}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}};var uo=class extends Te{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}};var bc="\\[\\]\\.:\\/",Fd=new RegExp("["+bc+"]","g"),Sc="[^"+bc+"]",Od="[^"+bc.replace("\\.","")+"]",Bd=/((?:WC+[\/:])*)/.source.replace("WC",Sc),zd=/(WCOD+)?/.source.replace("WCOD",Od),Hd=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Sc),kd=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Sc),Vd=new RegExp("^"+Bd+zd+Hd+kd+"$"),Gd=["material","materials","bones","map"],tc=class{constructor(t,e,n){let s=n||he.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,s)}getValue(t,e){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(t,e)}setValue(t,e){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].unbind()}},he=class i{constructor(t,e,n){this.path=e,this.parsedPath=n||i.parseTrackName(e),this.node=i.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,n){return t&&t.isAnimationObjectGroup?new i.Composite(t,e,n):new i(t,e,n)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(Fd,"")}static parseTrackName(t){let e=Vd.exec(t);if(e===null)throw new Error("PropertyBinding: Cannot parse trackName: "+t);let n={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);Gd.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+t);return n}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){let n=t.skeleton.getBoneByName(e);if(n!==void 0)return n}if(t.children){let n=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===e||a.uuid===e)return a;let l=n(a.children);if(l)return l}return null},s=n(t.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)t[e++]=n[s]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++]}_setValue_array_setNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node,e=this.parsedPath,n=e.objectName,s=e.propertyName,r=e.propertyIndex;if(t||(t=i.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=e.objectIndex;switch(n){case"materials":if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let h=0;h<t.length;h++)if(t[h].name===c){c=h;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[n]}if(c!==void 0){if(t[c]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[c]}}let o=t[s];if(o===void 0){let c=e.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",t);return}let a=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?a=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!t.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};he.Composite=tc;he.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};he.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};he.prototype.GetterByBindingType=[he.prototype._getValue_direct,he.prototype._getValue_array,he.prototype._getValue_arrayElement,he.prototype._getValue_toArray];he.prototype.SetterByBindingTypeAndVersioning=[[he.prototype._setValue_direct,he.prototype._setValue_direct_setNeedsUpdate,he.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[he.prototype._setValue_array,he.prototype._setValue_array_setNeedsUpdate,he.prototype._setValue_array_setMatrixWorldNeedsUpdate],[he.prototype._setValue_arrayElement,he.prototype._setValue_arrayElement_setNeedsUpdate,he.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[he.prototype._setValue_fromArray,he.prototype._setValue_fromArray_setNeedsUpdate,he.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var N0=new Float32Array(1);function Ec(i,t,e,n){let s=Wd(n);switch(e){case uc:return i*t;case Ao:return i*t/s.components*s.byteLength;case Ro:return i*t/s.components*s.byteLength;case fc:return i*t*2/s.components*s.byteLength;case Co:return i*t*2/s.components*s.byteLength;case dc:return i*t*3/s.components*s.byteLength;case Qe:return i*t*4/s.components*s.byteLength;case Io:return i*t*4/s.components*s.byteLength;case ir:case sr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case rr:case or:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Do:case Uo:return Math.max(i,16)*Math.max(t,8)/4;case Po:case Lo:return Math.max(i,8)*Math.max(t,8)/2;case No:case Fo:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Oo:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Bo:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case zo:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case Ho:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case ko:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case Vo:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case Go:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case Wo:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case Xo:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case qo:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case Yo:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case Zo:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case Jo:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case $o:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case Ko:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case Qo:case jo:case ta:return Math.ceil(i/4)*Math.ceil(t/4)*16;case ea:case na:return Math.ceil(i/4)*Math.ceil(t/4)*8;case ia:case sa:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function Wd(i){switch(i){case un:case ac:return{byteLength:1,components:1};case ns:case cc:case is:return{byteLength:2,components:1};case To:case wo:return{byteLength:2,components:4};case ti:case Eo:case dn:return{byteLength:4,components:1};case lc:case hc:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"180"}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="180");function Kh(){let i=null,t=!1,e=null,n=null;function s(r,o){e(r,o),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function Kd(i){let t=new WeakMap;function e(a,l){let c=a.array,h=a.usage,u=c.byteLength,f=i.createBuffer();i.bindBuffer(l,f),i.bufferData(l,c,h),a.onUploadCallback();let p;if(c instanceof Float32Array)p=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)p=i.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?p=i.HALF_FLOAT:p=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)p=i.SHORT;else if(c instanceof Uint32Array)p=i.UNSIGNED_INT;else if(c instanceof Int32Array)p=i.INT;else if(c instanceof Int8Array)p=i.BYTE;else if(c instanceof Uint8Array)p=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)p=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:f,type:p,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:u}}function n(a,l,c){let h=l.array,u=l.updateRanges;if(i.bindBuffer(c,a),u.length===0)i.bufferSubData(c,0,h);else{u.sort((p,g)=>p.start-g.start);let f=0;for(let p=1;p<u.length;p++){let g=u[f],y=u[p];y.start<=g.start+g.count+1?g.count=Math.max(g.count,y.start+y.count-g.start):(++f,u[f]=y)}u.length=f+1;for(let p=0,g=u.length;p<g;p++){let y=u[p];i.bufferSubData(c,y.start*h.BYTES_PER_ELEMENT,h,y.start,y.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);let l=t.get(a);l&&(i.deleteBuffer(l.buffer),t.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let h=t.get(a);(!h||h.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let c=t.get(a);if(c===void 0)t.set(a,e(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:s,remove:r,update:o}}var Qd=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,jd=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,tf=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,ef=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,nf=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,sf=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,rf=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,of=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,af=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,cf=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,lf=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,hf=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,uf=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,df=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,ff=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,pf=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,mf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,gf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,_f=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,xf=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,yf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,vf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Mf=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,bf=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Sf=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Ef=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Tf=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,wf=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Af=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Rf=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Cf="gl_FragColor = linearToOutputTexel( gl_FragColor );",If=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Pf=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Df=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Lf=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Uf=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Nf=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Ff=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Of=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Bf=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,zf=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Hf=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,kf=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Vf=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Gf=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Wf=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Xf=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,qf=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Yf=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Zf=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Jf=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,$f=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Kf=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Qf=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,jf=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,tp=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,ep=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,np=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,ip=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,sp=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,rp=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,op=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,ap=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,cp=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,lp=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,hp=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,up=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,dp=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,fp=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,pp=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,mp=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,gp=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,_p=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,xp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,yp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,vp=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Mp=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,bp=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Sp=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Ep=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Tp=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,wp=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Ap=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Rp=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Cp=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Ip=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Pp=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Dp=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Lp=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Up=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow( sampler2D shadow, vec2 uv, float compare ) {
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare, distribution.x );
		#endif
		if ( hard_shadow != 1.0 ) {
			float distance = compare - distribution.x;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,Np=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Fp=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Op=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Bp=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,zp=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Hp=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,kp=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Vp=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Gp=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Wp=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Xp=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,qp=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Yp=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Zp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Jp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,$p=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Kp=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,Qp=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,jp=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,tm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,em=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,nm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,im=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,sm=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,rm=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,om=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,am=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,cm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,lm=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,hm=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,um=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,dm=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,fm=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,pm=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,mm=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,gm=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,_m=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,xm=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,ym=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,vm=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Mm=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,bm=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Sm=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Em=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Tm=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,wm=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Am=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Rm=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Cm=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Im=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Pm=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Wt={alphahash_fragment:Qd,alphahash_pars_fragment:jd,alphamap_fragment:tf,alphamap_pars_fragment:ef,alphatest_fragment:nf,alphatest_pars_fragment:sf,aomap_fragment:rf,aomap_pars_fragment:of,batching_pars_vertex:af,batching_vertex:cf,begin_vertex:lf,beginnormal_vertex:hf,bsdfs:uf,iridescence_fragment:df,bumpmap_pars_fragment:ff,clipping_planes_fragment:pf,clipping_planes_pars_fragment:mf,clipping_planes_pars_vertex:gf,clipping_planes_vertex:_f,color_fragment:xf,color_pars_fragment:yf,color_pars_vertex:vf,color_vertex:Mf,common:bf,cube_uv_reflection_fragment:Sf,defaultnormal_vertex:Ef,displacementmap_pars_vertex:Tf,displacementmap_vertex:wf,emissivemap_fragment:Af,emissivemap_pars_fragment:Rf,colorspace_fragment:Cf,colorspace_pars_fragment:If,envmap_fragment:Pf,envmap_common_pars_fragment:Df,envmap_pars_fragment:Lf,envmap_pars_vertex:Uf,envmap_physical_pars_fragment:Xf,envmap_vertex:Nf,fog_vertex:Ff,fog_pars_vertex:Of,fog_fragment:Bf,fog_pars_fragment:zf,gradientmap_pars_fragment:Hf,lightmap_pars_fragment:kf,lights_lambert_fragment:Vf,lights_lambert_pars_fragment:Gf,lights_pars_begin:Wf,lights_toon_fragment:qf,lights_toon_pars_fragment:Yf,lights_phong_fragment:Zf,lights_phong_pars_fragment:Jf,lights_physical_fragment:$f,lights_physical_pars_fragment:Kf,lights_fragment_begin:Qf,lights_fragment_maps:jf,lights_fragment_end:tp,logdepthbuf_fragment:ep,logdepthbuf_pars_fragment:np,logdepthbuf_pars_vertex:ip,logdepthbuf_vertex:sp,map_fragment:rp,map_pars_fragment:op,map_particle_fragment:ap,map_particle_pars_fragment:cp,metalnessmap_fragment:lp,metalnessmap_pars_fragment:hp,morphinstance_vertex:up,morphcolor_vertex:dp,morphnormal_vertex:fp,morphtarget_pars_vertex:pp,morphtarget_vertex:mp,normal_fragment_begin:gp,normal_fragment_maps:_p,normal_pars_fragment:xp,normal_pars_vertex:yp,normal_vertex:vp,normalmap_pars_fragment:Mp,clearcoat_normal_fragment_begin:bp,clearcoat_normal_fragment_maps:Sp,clearcoat_pars_fragment:Ep,iridescence_pars_fragment:Tp,opaque_fragment:wp,packing:Ap,premultiplied_alpha_fragment:Rp,project_vertex:Cp,dithering_fragment:Ip,dithering_pars_fragment:Pp,roughnessmap_fragment:Dp,roughnessmap_pars_fragment:Lp,shadowmap_pars_fragment:Up,shadowmap_pars_vertex:Np,shadowmap_vertex:Fp,shadowmask_pars_fragment:Op,skinbase_vertex:Bp,skinning_pars_vertex:zp,skinning_vertex:Hp,skinnormal_vertex:kp,specularmap_fragment:Vp,specularmap_pars_fragment:Gp,tonemapping_fragment:Wp,tonemapping_pars_fragment:Xp,transmission_fragment:qp,transmission_pars_fragment:Yp,uv_pars_fragment:Zp,uv_pars_vertex:Jp,uv_vertex:$p,worldpos_vertex:Kp,background_vert:Qp,background_frag:jp,backgroundCube_vert:tm,backgroundCube_frag:em,cube_vert:nm,cube_frag:im,depth_vert:sm,depth_frag:rm,distanceRGBA_vert:om,distanceRGBA_frag:am,equirect_vert:cm,equirect_frag:lm,linedashed_vert:hm,linedashed_frag:um,meshbasic_vert:dm,meshbasic_frag:fm,meshlambert_vert:pm,meshlambert_frag:mm,meshmatcap_vert:gm,meshmatcap_frag:_m,meshnormal_vert:xm,meshnormal_frag:ym,meshphong_vert:vm,meshphong_frag:Mm,meshphysical_vert:bm,meshphysical_frag:Sm,meshtoon_vert:Em,meshtoon_frag:Tm,points_vert:wm,points_frag:Am,shadow_vert:Rm,shadow_frag:Cm,sprite_vert:Im,sprite_frag:Pm},ft={common:{diffuse:{value:new zt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new kt},alphaMap:{value:null},alphaMapTransform:{value:new kt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new kt}},envmap:{envMap:{value:null},envMapRotation:{value:new kt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new kt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new kt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new kt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new kt},normalScale:{value:new at(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new kt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new kt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new kt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new kt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new zt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new zt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new kt},alphaTest:{value:0},uvTransform:{value:new kt}},sprite:{diffuse:{value:new zt(16777215)},opacity:{value:1},center:{value:new at(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new kt},alphaMap:{value:null},alphaMapTransform:{value:new kt},alphaTest:{value:0}}},vn={basic:{uniforms:Ie([ft.common,ft.specularmap,ft.envmap,ft.aomap,ft.lightmap,ft.fog]),vertexShader:Wt.meshbasic_vert,fragmentShader:Wt.meshbasic_frag},lambert:{uniforms:Ie([ft.common,ft.specularmap,ft.envmap,ft.aomap,ft.lightmap,ft.emissivemap,ft.bumpmap,ft.normalmap,ft.displacementmap,ft.fog,ft.lights,{emissive:{value:new zt(0)}}]),vertexShader:Wt.meshlambert_vert,fragmentShader:Wt.meshlambert_frag},phong:{uniforms:Ie([ft.common,ft.specularmap,ft.envmap,ft.aomap,ft.lightmap,ft.emissivemap,ft.bumpmap,ft.normalmap,ft.displacementmap,ft.fog,ft.lights,{emissive:{value:new zt(0)},specular:{value:new zt(1118481)},shininess:{value:30}}]),vertexShader:Wt.meshphong_vert,fragmentShader:Wt.meshphong_frag},standard:{uniforms:Ie([ft.common,ft.envmap,ft.aomap,ft.lightmap,ft.emissivemap,ft.bumpmap,ft.normalmap,ft.displacementmap,ft.roughnessmap,ft.metalnessmap,ft.fog,ft.lights,{emissive:{value:new zt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Wt.meshphysical_vert,fragmentShader:Wt.meshphysical_frag},toon:{uniforms:Ie([ft.common,ft.aomap,ft.lightmap,ft.emissivemap,ft.bumpmap,ft.normalmap,ft.displacementmap,ft.gradientmap,ft.fog,ft.lights,{emissive:{value:new zt(0)}}]),vertexShader:Wt.meshtoon_vert,fragmentShader:Wt.meshtoon_frag},matcap:{uniforms:Ie([ft.common,ft.bumpmap,ft.normalmap,ft.displacementmap,ft.fog,{matcap:{value:null}}]),vertexShader:Wt.meshmatcap_vert,fragmentShader:Wt.meshmatcap_frag},points:{uniforms:Ie([ft.points,ft.fog]),vertexShader:Wt.points_vert,fragmentShader:Wt.points_frag},dashed:{uniforms:Ie([ft.common,ft.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Wt.linedashed_vert,fragmentShader:Wt.linedashed_frag},depth:{uniforms:Ie([ft.common,ft.displacementmap]),vertexShader:Wt.depth_vert,fragmentShader:Wt.depth_frag},normal:{uniforms:Ie([ft.common,ft.bumpmap,ft.normalmap,ft.displacementmap,{opacity:{value:1}}]),vertexShader:Wt.meshnormal_vert,fragmentShader:Wt.meshnormal_frag},sprite:{uniforms:Ie([ft.sprite,ft.fog]),vertexShader:Wt.sprite_vert,fragmentShader:Wt.sprite_frag},background:{uniforms:{uvTransform:{value:new kt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Wt.background_vert,fragmentShader:Wt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new kt}},vertexShader:Wt.backgroundCube_vert,fragmentShader:Wt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Wt.cube_vert,fragmentShader:Wt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Wt.equirect_vert,fragmentShader:Wt.equirect_frag},distanceRGBA:{uniforms:Ie([ft.common,ft.displacementmap,{referencePosition:{value:new P},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Wt.distanceRGBA_vert,fragmentShader:Wt.distanceRGBA_frag},shadow:{uniforms:Ie([ft.lights,ft.fog,{color:{value:new zt(0)},opacity:{value:1}}]),vertexShader:Wt.shadow_vert,fragmentShader:Wt.shadow_frag}};vn.physical={uniforms:Ie([vn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new kt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new kt},clearcoatNormalScale:{value:new at(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new kt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new kt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new kt},sheen:{value:0},sheenColor:{value:new zt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new kt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new kt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new kt},transmissionSamplerSize:{value:new at},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new kt},attenuationDistance:{value:0},attenuationColor:{value:new zt(0)},specularColor:{value:new zt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new kt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new kt},anisotropyVector:{value:new at},anisotropyMap:{value:null},anisotropyMapTransform:{value:new kt}}]),vertexShader:Wt.meshphysical_vert,fragmentShader:Wt.meshphysical_frag};var ra={r:0,b:0,g:0},vi=new Xe,Dm=new se;function Lm(i,t,e,n,s,r,o){let a=new zt(0),l=r===!0?0:1,c,h,u=null,f=0,p=null;function g(M){let v=M.isScene===!0?M.background:null;return v&&v.isTexture&&(v=(M.backgroundBlurriness>0?e:t).get(v)),v}function y(M){let v=!1,T=g(M);T===null?d(a,l):T&&T.isColor&&(d(T,1),v=!0);let A=i.xr.getEnvironmentBlendMode();A==="additive"?n.buffers.color.setClear(0,0,0,1,o):A==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||v)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(M,v){let T=g(v);T&&(T.isCubeTexture||T.mapping===er)?(h===void 0&&(h=new Lt(new de(1,1,1),new ln({name:"BackgroundCubeMaterial",uniforms:yi(vn.backgroundCube.uniforms),vertexShader:vn.backgroundCube.vertexShader,fragmentShader:vn.backgroundCube.fragmentShader,side:Ne,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(A,C,I){this.matrixWorld.copyPosition(I.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),vi.copy(v.backgroundRotation),vi.x*=-1,vi.y*=-1,vi.z*=-1,T.isCubeTexture&&T.isRenderTargetTexture===!1&&(vi.y*=-1,vi.z*=-1),h.material.uniforms.envMap.value=T,h.material.uniforms.flipEnvMap.value=T.isCubeTexture&&T.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=v.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(Dm.makeRotationFromEuler(vi)),h.material.toneMapped=Kt.getTransfer(T.colorSpace)!==ne,(u!==T||f!==T.version||p!==i.toneMapping)&&(h.material.needsUpdate=!0,u=T,f=T.version,p=i.toneMapping),h.layers.enableAll(),M.unshift(h,h.geometry,h.material,0,0,null)):T&&T.isTexture&&(c===void 0&&(c=new Lt(new Me(2,2),new ln({name:"BackgroundMaterial",uniforms:yi(vn.background.uniforms),vertexShader:vn.background.vertexShader,fragmentShader:vn.background.fragmentShader,side:Rn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=T,c.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,c.material.toneMapped=Kt.getTransfer(T.colorSpace)!==ne,T.matrixAutoUpdate===!0&&T.updateMatrix(),c.material.uniforms.uvTransform.value.copy(T.matrix),(u!==T||f!==T.version||p!==i.toneMapping)&&(c.material.needsUpdate=!0,u=T,f=T.version,p=i.toneMapping),c.layers.enableAll(),M.unshift(c,c.geometry,c.material,0,0,null))}function d(M,v){M.getRGB(ra,vc(i)),n.buffers.color.setClear(ra.r,ra.g,ra.b,v,o)}function x(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return a},setClearColor:function(M,v=1){a.set(M),l=v,d(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(M){l=M,d(a,l)},render:y,addToRenderList:m,dispose:x}}function Um(i,t){let e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=f(null),r=s,o=!1;function a(_,w,L,U,H){let B=!1,z=u(U,L,w);r!==z&&(r=z,c(r.object)),B=p(_,U,L,H),B&&g(_,U,L,H),H!==null&&t.update(H,i.ELEMENT_ARRAY_BUFFER),(B||o)&&(o=!1,v(_,w,L,U),H!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(H).buffer))}function l(){return i.createVertexArray()}function c(_){return i.bindVertexArray(_)}function h(_){return i.deleteVertexArray(_)}function u(_,w,L){let U=L.wireframe===!0,H=n[_.id];H===void 0&&(H={},n[_.id]=H);let B=H[w.id];B===void 0&&(B={},H[w.id]=B);let z=B[U];return z===void 0&&(z=f(l()),B[U]=z),z}function f(_){let w=[],L=[],U=[];for(let H=0;H<e;H++)w[H]=0,L[H]=0,U[H]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:w,enabledAttributes:L,attributeDivisors:U,object:_,attributes:{},index:null}}function p(_,w,L,U){let H=r.attributes,B=w.attributes,z=0,Y=L.getAttributes();for(let V in Y)if(Y[V].location>=0){let _t=H[V],vt=B[V];if(vt===void 0&&(V==="instanceMatrix"&&_.instanceMatrix&&(vt=_.instanceMatrix),V==="instanceColor"&&_.instanceColor&&(vt=_.instanceColor)),_t===void 0||_t.attribute!==vt||vt&&_t.data!==vt.data)return!0;z++}return r.attributesNum!==z||r.index!==U}function g(_,w,L,U){let H={},B=w.attributes,z=0,Y=L.getAttributes();for(let V in Y)if(Y[V].location>=0){let _t=B[V];_t===void 0&&(V==="instanceMatrix"&&_.instanceMatrix&&(_t=_.instanceMatrix),V==="instanceColor"&&_.instanceColor&&(_t=_.instanceColor));let vt={};vt.attribute=_t,_t&&_t.data&&(vt.data=_t.data),H[V]=vt,z++}r.attributes=H,r.attributesNum=z,r.index=U}function y(){let _=r.newAttributes;for(let w=0,L=_.length;w<L;w++)_[w]=0}function m(_){d(_,0)}function d(_,w){let L=r.newAttributes,U=r.enabledAttributes,H=r.attributeDivisors;L[_]=1,U[_]===0&&(i.enableVertexAttribArray(_),U[_]=1),H[_]!==w&&(i.vertexAttribDivisor(_,w),H[_]=w)}function x(){let _=r.newAttributes,w=r.enabledAttributes;for(let L=0,U=w.length;L<U;L++)w[L]!==_[L]&&(i.disableVertexAttribArray(L),w[L]=0)}function M(_,w,L,U,H,B,z){z===!0?i.vertexAttribIPointer(_,w,L,H,B):i.vertexAttribPointer(_,w,L,U,H,B)}function v(_,w,L,U){y();let H=U.attributes,B=L.getAttributes(),z=w.defaultAttributeValues;for(let Y in B){let V=B[Y];if(V.location>=0){let lt=H[Y];if(lt===void 0&&(Y==="instanceMatrix"&&_.instanceMatrix&&(lt=_.instanceMatrix),Y==="instanceColor"&&_.instanceColor&&(lt=_.instanceColor)),lt!==void 0){let _t=lt.normalized,vt=lt.itemSize,Ht=t.get(lt);if(Ht===void 0)continue;let Jt=Ht.buffer,te=Ht.type,$t=Ht.bytesPerElement,Z=te===i.INT||te===i.UNSIGNED_INT||lt.gpuType===Eo;if(lt.isInterleavedBufferAttribute){let et=lt.data,yt=et.stride,Ct=lt.offset;if(et.isInstancedInterleavedBuffer){for(let St=0;St<V.locationSize;St++)d(V.location+St,et.meshPerAttribute);_.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=et.meshPerAttribute*et.count)}else for(let St=0;St<V.locationSize;St++)m(V.location+St);i.bindBuffer(i.ARRAY_BUFFER,Jt);for(let St=0;St<V.locationSize;St++)M(V.location+St,vt/V.locationSize,te,_t,yt*$t,(Ct+vt/V.locationSize*St)*$t,Z)}else{if(lt.isInstancedBufferAttribute){for(let et=0;et<V.locationSize;et++)d(V.location+et,lt.meshPerAttribute);_.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=lt.meshPerAttribute*lt.count)}else for(let et=0;et<V.locationSize;et++)m(V.location+et);i.bindBuffer(i.ARRAY_BUFFER,Jt);for(let et=0;et<V.locationSize;et++)M(V.location+et,vt/V.locationSize,te,_t,vt*$t,vt/V.locationSize*et*$t,Z)}}else if(z!==void 0){let _t=z[Y];if(_t!==void 0)switch(_t.length){case 2:i.vertexAttrib2fv(V.location,_t);break;case 3:i.vertexAttrib3fv(V.location,_t);break;case 4:i.vertexAttrib4fv(V.location,_t);break;default:i.vertexAttrib1fv(V.location,_t)}}}}x()}function T(){I();for(let _ in n){let w=n[_];for(let L in w){let U=w[L];for(let H in U)h(U[H].object),delete U[H];delete w[L]}delete n[_]}}function A(_){if(n[_.id]===void 0)return;let w=n[_.id];for(let L in w){let U=w[L];for(let H in U)h(U[H].object),delete U[H];delete w[L]}delete n[_.id]}function C(_){for(let w in n){let L=n[w];if(L[_.id]===void 0)continue;let U=L[_.id];for(let H in U)h(U[H].object),delete U[H];delete L[_.id]}}function I(){b(),o=!0,r!==s&&(r=s,c(r.object))}function b(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:I,resetDefaultState:b,dispose:T,releaseStatesOfGeometry:A,releaseStatesOfProgram:C,initAttributes:y,enableAttribute:m,disableUnusedAttributes:x}}function Nm(i,t,e){let n;function s(c){n=c}function r(c,h){i.drawArrays(n,c,h),e.update(h,n,1)}function o(c,h,u){u!==0&&(i.drawArraysInstanced(n,c,h,u),e.update(h,n,u))}function a(c,h,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,h,0,u);let p=0;for(let g=0;g<u;g++)p+=h[g];e.update(p,n,1)}function l(c,h,u,f){if(u===0)return;let p=t.get("WEBGL_multi_draw");if(p===null)for(let g=0;g<c.length;g++)o(c[g],h[g],f[g]);else{p.multiDrawArraysInstancedWEBGL(n,c,0,h,0,f,0,u);let g=0;for(let y=0;y<u;y++)g+=h[y]*f[y];e.update(g,n,1)}}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function Fm(i,t,e,n){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){let C=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(C){return!(C!==Qe&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(C){let I=C===is&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(C!==un&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&C!==dn&&!I)}function l(C){if(C==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp",h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);let u=e.logarithmicDepthBuffer===!0,f=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),p=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),y=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),d=i.getParameter(i.MAX_VERTEX_ATTRIBS),x=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),M=i.getParameter(i.MAX_VARYING_VECTORS),v=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),T=g>0,A=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:u,reversedDepthBuffer:f,maxTextures:p,maxVertexTextures:g,maxTextureSize:y,maxCubemapSize:m,maxAttributes:d,maxVertexUniforms:x,maxVaryings:M,maxFragmentUniforms:v,vertexTextures:T,maxSamples:A}}function Om(i){let t=this,e=null,n=0,s=!1,r=!1,o=new mn,a=new kt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){let p=u.length!==0||f||n!==0||s;return s=f,n=u.length,p},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,f){e=h(u,f,0)},this.setState=function(u,f,p){let g=u.clippingPlanes,y=u.clipIntersection,m=u.clipShadows,d=i.get(u);if(!s||g===null||g.length===0||r&&!m)r?h(null):c();else{let x=r?0:n,M=x*4,v=d.clippingState||null;l.value=v,v=h(g,f,M,p);for(let T=0;T!==M;++T)v[T]=e[T];d.clippingState=v,this.numIntersection=y?this.numPlanes:0,this.numPlanes+=x}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(u,f,p,g){let y=u!==null?u.length:0,m=null;if(y!==0){if(m=l.value,g!==!0||m===null){let d=p+y*4,x=f.matrixWorldInverse;a.getNormalMatrix(x),(m===null||m.length<d)&&(m=new Float32Array(d));for(let M=0,v=p;M!==y;++M,v+=4)o.copy(u[M]).applyMatrix4(x,a),o.normal.toArray(m,v),m[v+3]=o.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=y,t.numIntersection=0,m}}function Bm(i){let t=new WeakMap;function e(o,a){return a===es?o.mapping=gi:a===bo&&(o.mapping=_i),o}function n(o){if(o&&o.isTexture){let a=o.mapping;if(a===es||a===bo)if(t.has(o)){let l=t.get(o).texture;return e(l,o.mapping)}else{let l=o.image;if(l&&l.height>0){let c=new Xr(l.height);return c.fromEquirectangularTexture(i,o),t.set(o,c),o.addEventListener("dispose",s),e(c.texture,o.mapping)}else return null}}return o}function s(o){let a=o.target;a.removeEventListener("dispose",s);let l=t.get(a);l!==void 0&&(t.delete(a),l.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}var as=4,Rh=[.125,.215,.35,.446,.526,.582],Si=20,Tc=new tr,Ch=new zt,wc=null,Ac=0,Rc=0,Cc=!1,bi=(1+Math.sqrt(5))/2,os=1/bi,Ih=[new P(-bi,os,0),new P(bi,os,0),new P(-os,0,bi),new P(os,0,bi),new P(0,bi,-os),new P(0,bi,os),new P(-1,1,-1),new P(1,1,-1),new P(-1,1,1),new P(1,1,1)],zm=new P,ls=class{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100,r={}){let{size:o=256,position:a=zm}=r;wc=this._renderer.getRenderTarget(),Ac=this._renderer.getActiveCubeFace(),Rc=this._renderer.getActiveMipmapLevel(),Cc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(t,n,s,l,a),e>0&&this._blur(l,0,0,e),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Lh(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Dh(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(wc,Ac,Rc),this._renderer.xr.enabled=Cc,t.scissorTest=!1,oa(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===gi||t.mapping===_i?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),wc=this._renderer.getRenderTarget(),Ac=this._renderer.getActiveCubeFace(),Rc=this._renderer.getActiveMipmapLevel(),Cc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:an,minFilter:an,generateMipmaps:!1,type:is,format:Qe,colorSpace:di,depthBuffer:!1},s=Ph(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Ph(t,e,n);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Hm(r)),this._blurMaterial=km(r,t,e)}return s}_compileMaterial(t){let e=new Lt(this._lodPlanes[0],t);this._renderer.compile(e,Tc)}_sceneToCubeUV(t,e,n,s,r){let l=new Te(90,1,e,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,f=u.autoClear,p=u.toneMapping;u.getClearColor(Ch),u.toneMapping=Nn,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(s),u.clearDepth(),u.setRenderTarget(null));let y=new we({name:"PMREM.Background",side:Ne,depthWrite:!1,depthTest:!1}),m=new Lt(new de,y),d=!1,x=t.background;x?x.isColor&&(y.color.copy(x),t.background=null,d=!0):(y.color.copy(Ch),d=!0);for(let M=0;M<6;M++){let v=M%3;v===0?(l.up.set(0,c[M],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[M],r.y,r.z)):v===1?(l.up.set(0,0,c[M]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[M],r.z)):(l.up.set(0,c[M],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[M]));let T=this._cubeSize;oa(s,v*T,M>2?T:0,T,T),u.setRenderTarget(s),d&&u.render(m,l),u.render(t,l)}m.geometry.dispose(),m.material.dispose(),u.toneMapping=p,u.autoClear=f,t.background=x}_textureToCubeUV(t,e){let n=this._renderer,s=t.mapping===gi||t.mapping===_i;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Lh()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Dh());let r=s?this._cubemapMaterial:this._equirectMaterial,o=new Lt(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=t;let l=this._cubeSize;oa(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(o,Tc)}_applyPMREM(t){let e=this._renderer,n=e.autoClear;e.autoClear=!1;let s=this._lodPlanes.length;for(let r=1;r<s;r++){let o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=Ih[(s-r-1)%Ih.length];this._blur(t,r-1,r,o,a)}e.autoClear=n}_blur(t,e,n,s,r){let o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,s,"latitudinal",r),this._halfBlur(o,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,o,a){let l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let h=3,u=new Lt(this._lodPlanes[s],c),f=c.uniforms,p=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*p):2*Math.PI/(2*Si-1),y=r/g,m=isFinite(r)?1+Math.floor(h*y):Si;m>Si&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Si}`);let d=[],x=0;for(let C=0;C<Si;++C){let I=C/y,b=Math.exp(-I*I/2);d.push(b),C===0?x+=b:C<m&&(x+=2*b)}for(let C=0;C<d.length;C++)d[C]=d[C]/x;f.envMap.value=t.texture,f.samples.value=m,f.weights.value=d,f.latitudinal.value=o==="latitudinal",a&&(f.poleAxis.value=a);let{_lodMax:M}=this;f.dTheta.value=g,f.mipInt.value=M-n;let v=this._sizeLods[s],T=3*v*(s>M-as?s-M+as:0),A=4*(this._cubeSize-v);oa(e,T,A,3*v,2*v),l.setRenderTarget(e),l.render(u,Tc)}};function Hm(i){let t=[],e=[],n=[],s=i,r=i-as+1+Rh.length;for(let o=0;o<r;o++){let a=Math.pow(2,s);e.push(a);let l=1/a;o>i-as?l=Rh[o-i+as-1]:o===0&&(l=0),n.push(l);let c=1/(a-2),h=-c,u=1+c,f=[h,h,u,h,u,u,h,h,u,u,h,u],p=6,g=6,y=3,m=2,d=1,x=new Float32Array(y*g*p),M=new Float32Array(m*g*p),v=new Float32Array(d*g*p);for(let A=0;A<p;A++){let C=A%3*2/3-1,I=A>2?0:-1,b=[C,I,0,C+2/3,I,0,C+2/3,I+1,0,C,I,0,C+2/3,I+1,0,C,I+1,0];x.set(b,y*g*A),M.set(f,m*g*A);let _=[A,A,A,A,A,A];v.set(_,d*g*A)}let T=new ve;T.setAttribute("position",new Ce(x,y)),T.setAttribute("uv",new Ce(M,m)),T.setAttribute("faceIndex",new Ce(v,d)),t.push(T),s>as&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function Ph(i,t,e){let n=new gn(i,t,e);return n.texture.mapping=er,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function oa(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function km(i,t,e){let n=new Float32Array(Si),s=new P(0,1,0);return new ln({name:"SphericalGaussianBlur",defines:{n:Si,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:zc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Ln,depthTest:!1,depthWrite:!1})}function Dh(){return new ln({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:zc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Ln,depthTest:!1,depthWrite:!1})}function Lh(){return new ln({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:zc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Ln,depthTest:!1,depthWrite:!1})}function zc(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function Vm(i){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){let l=a.mapping,c=l===es||l===bo,h=l===gi||l===_i;if(c||h){let u=t.get(a),f=u!==void 0?u.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==f)return e===null&&(e=new ls(i)),u=c?e.fromEquirectangular(a,u):e.fromCubemap(a,u),u.texture.pmremVersion=a.pmremVersion,t.set(a,u),u.texture;if(u!==void 0)return u.texture;{let p=a.image;return c&&p&&p.height>0||h&&p&&s(p)?(e===null&&(e=new ls(i)),u=c?e.fromEquirectangular(a):e.fromCubemap(a),u.texture.pmremVersion=a.pmremVersion,t.set(a,u),a.addEventListener("dispose",r),u.texture):null}}}return a}function s(a){let l=0,c=6;for(let h=0;h<c;h++)a[h]!==void 0&&l++;return l===c}function r(a){let l=a.target;l.removeEventListener("dispose",r);let c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:o}}function Gm(i){let t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){let s=e(n);return s===null&&Wi("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function Wm(i,t,e,n){let s={},r=new WeakMap;function o(u){let f=u.target;f.index!==null&&t.remove(f.index);for(let g in f.attributes)t.remove(f.attributes[g]);f.removeEventListener("dispose",o),delete s[f.id];let p=r.get(f);p&&(t.remove(p),r.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,e.memory.geometries--}function a(u,f){return s[f.id]===!0||(f.addEventListener("dispose",o),s[f.id]=!0,e.memory.geometries++),f}function l(u){let f=u.attributes;for(let p in f)t.update(f[p],i.ARRAY_BUFFER)}function c(u){let f=[],p=u.index,g=u.attributes.position,y=0;if(p!==null){let x=p.array;y=p.version;for(let M=0,v=x.length;M<v;M+=3){let T=x[M+0],A=x[M+1],C=x[M+2];f.push(T,A,A,C,C,T)}}else if(g!==void 0){let x=g.array;y=g.version;for(let M=0,v=x.length/3-1;M<v;M+=3){let T=M+0,A=M+1,C=M+2;f.push(T,A,A,C,C,T)}}else return;let m=new(yc(f)?Ns:Us)(f,1);m.version=y;let d=r.get(u);d&&t.remove(d),r.set(u,m)}function h(u){let f=r.get(u);if(f){let p=u.index;p!==null&&f.version<p.version&&c(u)}else c(u);return r.get(u)}return{get:a,update:l,getWireframeAttribute:h}}function Xm(i,t,e){let n;function s(f){n=f}let r,o;function a(f){r=f.type,o=f.bytesPerElement}function l(f,p){i.drawElements(n,p,r,f*o),e.update(p,n,1)}function c(f,p,g){g!==0&&(i.drawElementsInstanced(n,p,r,f*o,g),e.update(p,n,g))}function h(f,p,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,p,0,r,f,0,g);let m=0;for(let d=0;d<g;d++)m+=p[d];e.update(m,n,1)}function u(f,p,g,y){if(g===0)return;let m=t.get("WEBGL_multi_draw");if(m===null)for(let d=0;d<f.length;d++)c(f[d]/o,p[d],y[d]);else{m.multiDrawElementsInstancedWEBGL(n,p,0,r,f,0,y,0,g);let d=0;for(let x=0;x<g;x++)d+=p[x]*y[x];e.update(d,n,1)}}this.setMode=s,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function qm(i){let t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case i.TRIANGLES:e.triangles+=a*(r/3);break;case i.LINES:e.lines+=a*(r/2);break;case i.LINE_STRIP:e.lines+=a*(r-1);break;case i.LINE_LOOP:e.lines+=a*r;break;case i.POINTS:e.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function Ym(i,t,e){let n=new WeakMap,s=new ee;function r(o,a,l){let c=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=h!==void 0?h.length:0,f=n.get(a);if(f===void 0||f.count!==u){let b=function(){C.dispose(),n.delete(a),a.removeEventListener("dispose",b)};f!==void 0&&f.texture.dispose();let p=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,y=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],d=a.morphAttributes.normal||[],x=a.morphAttributes.color||[],M=0;p===!0&&(M=1),g===!0&&(M=2),y===!0&&(M=3);let v=a.attributes.position.count*M,T=1;v>t.maxTextureSize&&(T=Math.ceil(v/t.maxTextureSize),v=t.maxTextureSize);let A=new Float32Array(v*T*4*u),C=new Ds(A,v,T,u);C.type=dn,C.needsUpdate=!0;let I=M*4;for(let _=0;_<u;_++){let w=m[_],L=d[_],U=x[_],H=v*T*4*_;for(let B=0;B<w.count;B++){let z=B*I;p===!0&&(s.fromBufferAttribute(w,B),A[H+z+0]=s.x,A[H+z+1]=s.y,A[H+z+2]=s.z,A[H+z+3]=0),g===!0&&(s.fromBufferAttribute(L,B),A[H+z+4]=s.x,A[H+z+5]=s.y,A[H+z+6]=s.z,A[H+z+7]=0),y===!0&&(s.fromBufferAttribute(U,B),A[H+z+8]=s.x,A[H+z+9]=s.y,A[H+z+10]=s.z,A[H+z+11]=U.itemSize===4?s.w:1)}}f={count:u,texture:C,size:new at(v,T)},n.set(a,f),a.addEventListener("dispose",b)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",o.morphTexture,e);else{let p=0;for(let y=0;y<c.length;y++)p+=c[y];let g=a.morphTargetsRelative?1:1-p;l.getUniforms().setValue(i,"morphTargetBaseInfluence",g),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",f.texture,e),l.getUniforms().setValue(i,"morphTargetsTextureSize",f.size)}return{update:r}}function Zm(i,t,e,n){let s=new WeakMap;function r(l){let c=n.render.frame,h=l.geometry,u=t.get(l,h);if(s.get(u)!==c&&(t.update(u),s.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),s.get(l)!==c&&(e.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){let f=l.skeleton;s.get(f)!==c&&(f.update(),s.set(f,c))}return u}function o(){s=new WeakMap}function a(l){let c=l.target;c.removeEventListener("dispose",a),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:r,dispose:o}}var Qh=new Le,Uh=new zs(1,1),jh=new Ds,tu=new Vr,eu=new Os,Nh=[],Fh=[],Oh=new Float32Array(16),Bh=new Float32Array(9),zh=new Float32Array(4);function hs(i,t,e){let n=i[0];if(n<=0||n>0)return i;let s=t*e,r=Nh[s];if(r===void 0&&(r=new Float32Array(s),Nh[s]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,i[o].toArray(r,a)}return r}function be(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Se(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function la(i,t){let e=Fh[t];e===void 0&&(e=new Int32Array(t),Fh[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function Jm(i,t){let e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function $m(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(be(e,t))return;i.uniform2fv(this.addr,t),Se(e,t)}}function Km(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(be(e,t))return;i.uniform3fv(this.addr,t),Se(e,t)}}function Qm(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(be(e,t))return;i.uniform4fv(this.addr,t),Se(e,t)}}function jm(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(be(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Se(e,t)}else{if(be(e,n))return;zh.set(n),i.uniformMatrix2fv(this.addr,!1,zh),Se(e,n)}}function tg(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(be(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Se(e,t)}else{if(be(e,n))return;Bh.set(n),i.uniformMatrix3fv(this.addr,!1,Bh),Se(e,n)}}function eg(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(be(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Se(e,t)}else{if(be(e,n))return;Oh.set(n),i.uniformMatrix4fv(this.addr,!1,Oh),Se(e,n)}}function ng(i,t){let e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function ig(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(be(e,t))return;i.uniform2iv(this.addr,t),Se(e,t)}}function sg(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(be(e,t))return;i.uniform3iv(this.addr,t),Se(e,t)}}function rg(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(be(e,t))return;i.uniform4iv(this.addr,t),Se(e,t)}}function og(i,t){let e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function ag(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(be(e,t))return;i.uniform2uiv(this.addr,t),Se(e,t)}}function cg(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(be(e,t))return;i.uniform3uiv(this.addr,t),Se(e,t)}}function lg(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(be(e,t))return;i.uniform4uiv(this.addr,t),Se(e,t)}}function hg(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(Uh.compareFunction=mc,r=Uh):r=Qh,e.setTexture2D(t||r,s)}function ug(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||tu,s)}function dg(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||eu,s)}function fg(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||jh,s)}function pg(i){switch(i){case 5126:return Jm;case 35664:return $m;case 35665:return Km;case 35666:return Qm;case 35674:return jm;case 35675:return tg;case 35676:return eg;case 5124:case 35670:return ng;case 35667:case 35671:return ig;case 35668:case 35672:return sg;case 35669:case 35673:return rg;case 5125:return og;case 36294:return ag;case 36295:return cg;case 36296:return lg;case 35678:case 36198:case 36298:case 36306:case 35682:return hg;case 35679:case 36299:case 36307:return ug;case 35680:case 36300:case 36308:case 36293:return dg;case 36289:case 36303:case 36311:case 36292:return fg}}function mg(i,t){i.uniform1fv(this.addr,t)}function gg(i,t){let e=hs(t,this.size,2);i.uniform2fv(this.addr,e)}function _g(i,t){let e=hs(t,this.size,3);i.uniform3fv(this.addr,e)}function xg(i,t){let e=hs(t,this.size,4);i.uniform4fv(this.addr,e)}function yg(i,t){let e=hs(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function vg(i,t){let e=hs(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function Mg(i,t){let e=hs(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function bg(i,t){i.uniform1iv(this.addr,t)}function Sg(i,t){i.uniform2iv(this.addr,t)}function Eg(i,t){i.uniform3iv(this.addr,t)}function Tg(i,t){i.uniform4iv(this.addr,t)}function wg(i,t){i.uniform1uiv(this.addr,t)}function Ag(i,t){i.uniform2uiv(this.addr,t)}function Rg(i,t){i.uniform3uiv(this.addr,t)}function Cg(i,t){i.uniform4uiv(this.addr,t)}function Ig(i,t,e){let n=this.cache,s=t.length,r=la(e,s);be(n,r)||(i.uniform1iv(this.addr,r),Se(n,r));for(let o=0;o!==s;++o)e.setTexture2D(t[o]||Qh,r[o])}function Pg(i,t,e){let n=this.cache,s=t.length,r=la(e,s);be(n,r)||(i.uniform1iv(this.addr,r),Se(n,r));for(let o=0;o!==s;++o)e.setTexture3D(t[o]||tu,r[o])}function Dg(i,t,e){let n=this.cache,s=t.length,r=la(e,s);be(n,r)||(i.uniform1iv(this.addr,r),Se(n,r));for(let o=0;o!==s;++o)e.setTextureCube(t[o]||eu,r[o])}function Lg(i,t,e){let n=this.cache,s=t.length,r=la(e,s);be(n,r)||(i.uniform1iv(this.addr,r),Se(n,r));for(let o=0;o!==s;++o)e.setTexture2DArray(t[o]||jh,r[o])}function Ug(i){switch(i){case 5126:return mg;case 35664:return gg;case 35665:return _g;case 35666:return xg;case 35674:return yg;case 35675:return vg;case 35676:return Mg;case 5124:case 35670:return bg;case 35667:case 35671:return Sg;case 35668:case 35672:return Eg;case 35669:case 35673:return Tg;case 5125:return wg;case 36294:return Ag;case 36295:return Rg;case 36296:return Cg;case 35678:case 36198:case 36298:case 36306:case 35682:return Ig;case 35679:case 36299:case 36307:return Pg;case 35680:case 36300:case 36308:case 36293:return Dg;case 36289:case 36303:case 36311:case 36292:return Lg}}var Pc=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=pg(e.type)}},Dc=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Ug(e.type)}},Lc=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){let s=this.seq;for(let r=0,o=s.length;r!==o;++r){let a=s[r];a.setValue(t,e[a.id],n)}}},Ic=/(\w+)(\])?(\[|\.)?/g;function Hh(i,t){i.seq.push(t),i.map[t.id]=t}function Ng(i,t,e){let n=i.name,s=n.length;for(Ic.lastIndex=0;;){let r=Ic.exec(n),o=Ic.lastIndex,a=r[1],l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===s){Hh(e,c===void 0?new Pc(a,i,t):new Dc(a,i,t));break}else{let u=e.map[a];u===void 0&&(u=new Lc(a),Hh(e,u)),e=u}}}var cs=class{constructor(t,e){this.seq=[],this.map={};let n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){let r=t.getActiveUniform(e,s),o=t.getUniformLocation(e,r.name);Ng(r,o,this)}}setValue(t,e,n,s){let r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){let s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,o=e.length;r!==o;++r){let a=e[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(t,l.value,s)}}static seqWithValue(t,e){let n=[];for(let s=0,r=t.length;s!==r;++s){let o=t[s];o.id in e&&n.push(o)}return n}};function kh(i,t,e){let n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}var Fg=37297,Og=0;function Bg(i,t){let e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=s;o<r;o++){let a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}var Vh=new kt;function zg(i){Kt._getMatrix(Vh,Kt.workingColorSpace,i);let t=`mat3( ${Vh.elements.map(e=>e.toFixed(4))} )`;switch(Kt.getTransfer(i)){case Cs:return[t,"LinearTransferOETF"];case ne:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function Gh(i,t,e){let n=i.getShaderParameter(t,i.COMPILE_STATUS),r=(i.getShaderInfoLog(t)||"").trim();if(n&&r==="")return"";let o=/ERROR: 0:(\d+)/.exec(r);if(o){let a=parseInt(o[1]);return e.toUpperCase()+`

`+r+`

`+Bg(i.getShaderSource(t),a)}else return r}function Hg(i,t){let e=zg(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function kg(i,t){let e;switch(t){case nh:e="Linear";break;case ih:e="Reinhard";break;case sh:e="Cineon";break;case Mo:e="ACESFilmic";break;case oh:e="AgX";break;case ah:e="Neutral";break;case rh:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}var aa=new P;function Vg(){Kt.getLuminanceCoefficients(aa);let i=aa.x.toFixed(4),t=aa.y.toFixed(4),e=aa.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Gg(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(ar).join(`
`)}function Wg(i){let t=[];for(let e in i){let n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function Xg(i,t){let e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(t,s),o=r.name,a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:i.getAttribLocation(t,o),locationSize:a}}return e}function ar(i){return i!==""}function Wh(i,t){let e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Xh(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var qg=/^[ \t]*#include +<([\w\d./]+)>/gm;function Uc(i){return i.replace(qg,Zg)}var Yg=new Map;function Zg(i,t){let e=Wt[t];if(e===void 0){let n=Yg.get(t);if(n!==void 0)e=Wt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return Uc(e)}var Jg=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function qh(i){return i.replace(Jg,$g)}function $g(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Yh(i){let t=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function Kg(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===nc?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===fo?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===yn&&(t="SHADOWMAP_TYPE_VSM"),t}function Qg(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case gi:case _i:t="ENVMAP_TYPE_CUBE";break;case er:t="ENVMAP_TYPE_CUBE_UV";break}return t}function jg(i){let t="ENVMAP_MODE_REFLECTION";return i.envMap&&i.envMapMode===_i&&(t="ENVMAP_MODE_REFRACTION"),t}function t0(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case rc:t="ENVMAP_BLENDING_MULTIPLY";break;case th:t="ENVMAP_BLENDING_MIX";break;case eh:t="ENVMAP_BLENDING_ADD";break}return t}function e0(i){let t=i.envMapCubeUVHeight;if(t===null)return null;let e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function n0(i,t,e,n){let s=i.getContext(),r=e.defines,o=e.vertexShader,a=e.fragmentShader,l=Kg(e),c=Qg(e),h=jg(e),u=t0(e),f=e0(e),p=Gg(e),g=Wg(r),y=s.createProgram(),m,d,x=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(ar).join(`
`),m.length>0&&(m+=`
`),d=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(ar).join(`
`),d.length>0&&(d+=`
`)):(m=[Yh(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ar).join(`
`),d=[Yh(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Nn?"#define TONE_MAPPING":"",e.toneMapping!==Nn?Wt.tonemapping_pars_fragment:"",e.toneMapping!==Nn?kg("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Wt.colorspace_pars_fragment,Hg("linearToOutputTexel",e.outputColorSpace),Vg(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(ar).join(`
`)),o=Uc(o),o=Wh(o,e),o=Xh(o,e),a=Uc(a),a=Wh(a,e),a=Xh(a,e),o=qh(o),a=qh(a),e.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,d=["#define varying in",e.glslVersion===_c?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===_c?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+d);let M=x+m+o,v=x+d+a,T=kh(s,s.VERTEX_SHADER,M),A=kh(s,s.FRAGMENT_SHADER,v);s.attachShader(y,T),s.attachShader(y,A),e.index0AttributeName!==void 0?s.bindAttribLocation(y,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(y,0,"position"),s.linkProgram(y);function C(w){if(i.debug.checkShaderErrors){let L=s.getProgramInfoLog(y)||"",U=s.getShaderInfoLog(T)||"",H=s.getShaderInfoLog(A)||"",B=L.trim(),z=U.trim(),Y=H.trim(),V=!0,lt=!0;if(s.getProgramParameter(y,s.LINK_STATUS)===!1)if(V=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,y,T,A);else{let _t=Gh(s,T,"vertex"),vt=Gh(s,A,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(y,s.VALIDATE_STATUS)+`

Material Name: `+w.name+`
Material Type: `+w.type+`

Program Info Log: `+B+`
`+_t+`
`+vt)}else B!==""?console.warn("THREE.WebGLProgram: Program Info Log:",B):(z===""||Y==="")&&(lt=!1);lt&&(w.diagnostics={runnable:V,programLog:B,vertexShader:{log:z,prefix:m},fragmentShader:{log:Y,prefix:d}})}s.deleteShader(T),s.deleteShader(A),I=new cs(s,y),b=Xg(s,y)}let I;this.getUniforms=function(){return I===void 0&&C(this),I};let b;this.getAttributes=function(){return b===void 0&&C(this),b};let _=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return _===!1&&(_=s.getProgramParameter(y,Fg)),_},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(y),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Og++,this.cacheKey=t,this.usedTimes=1,this.program=y,this.vertexShader=T,this.fragmentShader=A,this}var i0=0,Nc=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){let e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(t);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(t){let e=this.materialCache.get(t);for(let n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let e=this.materialCache,n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){let e=this.shaderCache,n=e.get(t);return n===void 0&&(n=new Fc(t),e.set(t,n)),n}},Fc=class{constructor(t){this.id=i0++,this.code=t,this.usedTimes=0}};function s0(i,t,e,n,s,r,o){let a=new Ls,l=new Nc,c=new Set,h=[],u=s.logarithmicDepthBuffer,f=s.vertexTextures,p=s.precision,g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function y(b){return c.add(b),b===0?"uv":`uv${b}`}function m(b,_,w,L,U){let H=L.fog,B=U.geometry,z=b.isMeshStandardMaterial?L.environment:null,Y=(b.isMeshStandardMaterial?e:t).get(b.envMap||z),V=Y&&Y.mapping===er?Y.image.height:null,lt=g[b.type];b.precision!==null&&(p=s.getMaxPrecision(b.precision),p!==b.precision&&console.warn("THREE.WebGLProgram.getParameters:",b.precision,"not supported, using",p,"instead."));let _t=B.morphAttributes.position||B.morphAttributes.normal||B.morphAttributes.color,vt=_t!==void 0?_t.length:0,Ht=0;B.morphAttributes.position!==void 0&&(Ht=1),B.morphAttributes.normal!==void 0&&(Ht=2),B.morphAttributes.color!==void 0&&(Ht=3);let Jt,te,$t,Z;if(lt){let jt=vn[lt];Jt=jt.vertexShader,te=jt.fragmentShader}else Jt=b.vertexShader,te=b.fragmentShader,l.update(b),$t=l.getVertexShaderID(b),Z=l.getFragmentShaderID(b);let et=i.getRenderTarget(),yt=i.state.buffers.depth.getReversed(),Ct=U.isInstancedMesh===!0,St=U.isBatchedMesh===!0,Xt=!!b.map,oe=!!b.matcap,D=!!Y,tt=!!b.aoMap,K=!!b.lightMap,$=!!b.bumpMap,J=!!b.normalMap,ht=!!b.displacementMap,nt=!!b.emissiveMap,ut=!!b.metalnessMap,Ot=!!b.roughnessMap,Ft=b.anisotropy>0,R=b.clearcoat>0,S=b.dispersion>0,k=b.iridescence>0,X=b.sheen>0,j=b.transmission>0,q=Ft&&!!b.anisotropyMap,At=R&&!!b.clearcoatMap,ct=R&&!!b.clearcoatNormalMap,Et=R&&!!b.clearcoatRoughnessMap,Tt=k&&!!b.iridescenceMap,it=k&&!!b.iridescenceThicknessMap,gt=X&&!!b.sheenColorMap,Ut=X&&!!b.sheenRoughnessMap,Rt=!!b.specularMap,pt=!!b.specularColorMap,Vt=!!b.specularIntensityMap,N=j&&!!b.transmissionMap,ot=j&&!!b.thicknessMap,dt=!!b.gradientMap,Mt=!!b.alphaMap,st=b.alphaTest>0,Q=!!b.alphaHash,wt=!!b.extensions,Bt=Nn;b.toneMapped&&(et===null||et.isXRRenderTarget===!0)&&(Bt=i.toneMapping);let ae={shaderID:lt,shaderType:b.type,shaderName:b.name,vertexShader:Jt,fragmentShader:te,defines:b.defines,customVertexShaderID:$t,customFragmentShaderID:Z,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:p,batching:St,batchingColor:St&&U._colorsTexture!==null,instancing:Ct,instancingColor:Ct&&U.instanceColor!==null,instancingMorph:Ct&&U.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:et===null?i.outputColorSpace:et.isXRRenderTarget===!0?et.texture.colorSpace:di,alphaToCoverage:!!b.alphaToCoverage,map:Xt,matcap:oe,envMap:D,envMapMode:D&&Y.mapping,envMapCubeUVHeight:V,aoMap:tt,lightMap:K,bumpMap:$,normalMap:J,displacementMap:f&&ht,emissiveMap:nt,normalMapObjectSpace:J&&b.normalMapType===uh,normalMapTangentSpace:J&&b.normalMapType===pc,metalnessMap:ut,roughnessMap:Ot,anisotropy:Ft,anisotropyMap:q,clearcoat:R,clearcoatMap:At,clearcoatNormalMap:ct,clearcoatRoughnessMap:Et,dispersion:S,iridescence:k,iridescenceMap:Tt,iridescenceThicknessMap:it,sheen:X,sheenColorMap:gt,sheenRoughnessMap:Ut,specularMap:Rt,specularColorMap:pt,specularIntensityMap:Vt,transmission:j,transmissionMap:N,thicknessMap:ot,gradientMap:dt,opaque:b.transparent===!1&&b.blending===hi&&b.alphaToCoverage===!1,alphaMap:Mt,alphaTest:st,alphaHash:Q,combine:b.combine,mapUv:Xt&&y(b.map.channel),aoMapUv:tt&&y(b.aoMap.channel),lightMapUv:K&&y(b.lightMap.channel),bumpMapUv:$&&y(b.bumpMap.channel),normalMapUv:J&&y(b.normalMap.channel),displacementMapUv:ht&&y(b.displacementMap.channel),emissiveMapUv:nt&&y(b.emissiveMap.channel),metalnessMapUv:ut&&y(b.metalnessMap.channel),roughnessMapUv:Ot&&y(b.roughnessMap.channel),anisotropyMapUv:q&&y(b.anisotropyMap.channel),clearcoatMapUv:At&&y(b.clearcoatMap.channel),clearcoatNormalMapUv:ct&&y(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Et&&y(b.clearcoatRoughnessMap.channel),iridescenceMapUv:Tt&&y(b.iridescenceMap.channel),iridescenceThicknessMapUv:it&&y(b.iridescenceThicknessMap.channel),sheenColorMapUv:gt&&y(b.sheenColorMap.channel),sheenRoughnessMapUv:Ut&&y(b.sheenRoughnessMap.channel),specularMapUv:Rt&&y(b.specularMap.channel),specularColorMapUv:pt&&y(b.specularColorMap.channel),specularIntensityMapUv:Vt&&y(b.specularIntensityMap.channel),transmissionMapUv:N&&y(b.transmissionMap.channel),thicknessMapUv:ot&&y(b.thicknessMap.channel),alphaMapUv:Mt&&y(b.alphaMap.channel),vertexTangents:!!B.attributes.tangent&&(J||Ft),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!B.attributes.color&&B.attributes.color.itemSize===4,pointsUvs:U.isPoints===!0&&!!B.attributes.uv&&(Xt||Mt),fog:!!H,useFog:b.fog===!0,fogExp2:!!H&&H.isFogExp2,flatShading:b.flatShading===!0&&b.wireframe===!1,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:yt,skinning:U.isSkinnedMesh===!0,morphTargets:B.morphAttributes.position!==void 0,morphNormals:B.morphAttributes.normal!==void 0,morphColors:B.morphAttributes.color!==void 0,morphTargetsCount:vt,morphTextureStride:Ht,numDirLights:_.directional.length,numPointLights:_.point.length,numSpotLights:_.spot.length,numSpotLightMaps:_.spotLightMap.length,numRectAreaLights:_.rectArea.length,numHemiLights:_.hemi.length,numDirLightShadows:_.directionalShadowMap.length,numPointLightShadows:_.pointShadowMap.length,numSpotLightShadows:_.spotShadowMap.length,numSpotLightShadowsWithMaps:_.numSpotLightShadowsWithMaps,numLightProbes:_.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:b.dithering,shadowMapEnabled:i.shadowMap.enabled&&w.length>0,shadowMapType:i.shadowMap.type,toneMapping:Bt,decodeVideoTexture:Xt&&b.map.isVideoTexture===!0&&Kt.getTransfer(b.map.colorSpace)===ne,decodeVideoTextureEmissive:nt&&b.emissiveMap.isVideoTexture===!0&&Kt.getTransfer(b.emissiveMap.colorSpace)===ne,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===He,flipSided:b.side===Ne,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:wt&&b.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(wt&&b.extensions.multiDraw===!0||St)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return ae.vertexUv1s=c.has(1),ae.vertexUv2s=c.has(2),ae.vertexUv3s=c.has(3),c.clear(),ae}function d(b){let _=[];if(b.shaderID?_.push(b.shaderID):(_.push(b.customVertexShaderID),_.push(b.customFragmentShaderID)),b.defines!==void 0)for(let w in b.defines)_.push(w),_.push(b.defines[w]);return b.isRawShaderMaterial===!1&&(x(_,b),M(_,b),_.push(i.outputColorSpace)),_.push(b.customProgramCacheKey),_.join()}function x(b,_){b.push(_.precision),b.push(_.outputColorSpace),b.push(_.envMapMode),b.push(_.envMapCubeUVHeight),b.push(_.mapUv),b.push(_.alphaMapUv),b.push(_.lightMapUv),b.push(_.aoMapUv),b.push(_.bumpMapUv),b.push(_.normalMapUv),b.push(_.displacementMapUv),b.push(_.emissiveMapUv),b.push(_.metalnessMapUv),b.push(_.roughnessMapUv),b.push(_.anisotropyMapUv),b.push(_.clearcoatMapUv),b.push(_.clearcoatNormalMapUv),b.push(_.clearcoatRoughnessMapUv),b.push(_.iridescenceMapUv),b.push(_.iridescenceThicknessMapUv),b.push(_.sheenColorMapUv),b.push(_.sheenRoughnessMapUv),b.push(_.specularMapUv),b.push(_.specularColorMapUv),b.push(_.specularIntensityMapUv),b.push(_.transmissionMapUv),b.push(_.thicknessMapUv),b.push(_.combine),b.push(_.fogExp2),b.push(_.sizeAttenuation),b.push(_.morphTargetsCount),b.push(_.morphAttributeCount),b.push(_.numDirLights),b.push(_.numPointLights),b.push(_.numSpotLights),b.push(_.numSpotLightMaps),b.push(_.numHemiLights),b.push(_.numRectAreaLights),b.push(_.numDirLightShadows),b.push(_.numPointLightShadows),b.push(_.numSpotLightShadows),b.push(_.numSpotLightShadowsWithMaps),b.push(_.numLightProbes),b.push(_.shadowMapType),b.push(_.toneMapping),b.push(_.numClippingPlanes),b.push(_.numClipIntersection),b.push(_.depthPacking)}function M(b,_){a.disableAll(),_.supportsVertexTextures&&a.enable(0),_.instancing&&a.enable(1),_.instancingColor&&a.enable(2),_.instancingMorph&&a.enable(3),_.matcap&&a.enable(4),_.envMap&&a.enable(5),_.normalMapObjectSpace&&a.enable(6),_.normalMapTangentSpace&&a.enable(7),_.clearcoat&&a.enable(8),_.iridescence&&a.enable(9),_.alphaTest&&a.enable(10),_.vertexColors&&a.enable(11),_.vertexAlphas&&a.enable(12),_.vertexUv1s&&a.enable(13),_.vertexUv2s&&a.enable(14),_.vertexUv3s&&a.enable(15),_.vertexTangents&&a.enable(16),_.anisotropy&&a.enable(17),_.alphaHash&&a.enable(18),_.batching&&a.enable(19),_.dispersion&&a.enable(20),_.batchingColor&&a.enable(21),_.gradientMap&&a.enable(22),b.push(a.mask),a.disableAll(),_.fog&&a.enable(0),_.useFog&&a.enable(1),_.flatShading&&a.enable(2),_.logarithmicDepthBuffer&&a.enable(3),_.reversedDepthBuffer&&a.enable(4),_.skinning&&a.enable(5),_.morphTargets&&a.enable(6),_.morphNormals&&a.enable(7),_.morphColors&&a.enable(8),_.premultipliedAlpha&&a.enable(9),_.shadowMapEnabled&&a.enable(10),_.doubleSided&&a.enable(11),_.flipSided&&a.enable(12),_.useDepthPacking&&a.enable(13),_.dithering&&a.enable(14),_.transmission&&a.enable(15),_.sheen&&a.enable(16),_.opaque&&a.enable(17),_.pointsUvs&&a.enable(18),_.decodeVideoTexture&&a.enable(19),_.decodeVideoTextureEmissive&&a.enable(20),_.alphaToCoverage&&a.enable(21),b.push(a.mask)}function v(b){let _=g[b.type],w;if(_){let L=vn[_];w=bh.clone(L.uniforms)}else w=b.uniforms;return w}function T(b,_){let w;for(let L=0,U=h.length;L<U;L++){let H=h[L];if(H.cacheKey===_){w=H,++w.usedTimes;break}}return w===void 0&&(w=new n0(i,_,b,r),h.push(w)),w}function A(b){if(--b.usedTimes===0){let _=h.indexOf(b);h[_]=h[h.length-1],h.pop(),b.destroy()}}function C(b){l.remove(b)}function I(){l.dispose()}return{getParameters:m,getProgramCacheKey:d,getUniforms:v,acquireProgram:T,releaseProgram:A,releaseShaderCache:C,programs:h,dispose:I}}function r0(){let i=new WeakMap;function t(o){return i.has(o)}function e(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function s(o,a,l){i.get(o)[a]=l}function r(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:r}}function o0(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function Zh(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function Jh(){let i=[],t=0,e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function o(u,f,p,g,y,m){let d=i[t];return d===void 0?(d={id:u.id,object:u,geometry:f,material:p,groupOrder:g,renderOrder:u.renderOrder,z:y,group:m},i[t]=d):(d.id=u.id,d.object=u,d.geometry=f,d.material=p,d.groupOrder=g,d.renderOrder=u.renderOrder,d.z=y,d.group=m),t++,d}function a(u,f,p,g,y,m){let d=o(u,f,p,g,y,m);p.transmission>0?n.push(d):p.transparent===!0?s.push(d):e.push(d)}function l(u,f,p,g,y,m){let d=o(u,f,p,g,y,m);p.transmission>0?n.unshift(d):p.transparent===!0?s.unshift(d):e.unshift(d)}function c(u,f){e.length>1&&e.sort(u||o0),n.length>1&&n.sort(f||Zh),s.length>1&&s.sort(f||Zh)}function h(){for(let u=t,f=i.length;u<f;u++){let p=i[u];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:a,unshift:l,finish:h,sort:c}}function a0(){let i=new WeakMap;function t(n,s){let r=i.get(n),o;return r===void 0?(o=new Jh,i.set(n,[o])):s>=r.length?(o=new Jh,r.push(o)):o=r[s],o}function e(){i=new WeakMap}return{get:t,dispose:e}}function c0(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new P,color:new zt};break;case"SpotLight":e={position:new P,direction:new P,color:new zt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new P,color:new zt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new P,skyColor:new zt,groundColor:new zt};break;case"RectAreaLight":e={color:new zt,position:new P,halfWidth:new P,halfHeight:new P};break}return i[t.id]=e,e}}}function l0(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new at};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new at};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new at,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}var h0=0;function u0(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function d0(i){let t=new c0,e=l0(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new P);let s=new P,r=new se,o=new se;function a(c){let h=0,u=0,f=0;for(let b=0;b<9;b++)n.probe[b].set(0,0,0);let p=0,g=0,y=0,m=0,d=0,x=0,M=0,v=0,T=0,A=0,C=0;c.sort(u0);for(let b=0,_=c.length;b<_;b++){let w=c[b],L=w.color,U=w.intensity,H=w.distance,B=w.shadow&&w.shadow.map?w.shadow.map.texture:null;if(w.isAmbientLight)h+=L.r*U,u+=L.g*U,f+=L.b*U;else if(w.isLightProbe){for(let z=0;z<9;z++)n.probe[z].addScaledVector(w.sh.coefficients[z],U);C++}else if(w.isDirectionalLight){let z=t.get(w);if(z.color.copy(w.color).multiplyScalar(w.intensity),w.castShadow){let Y=w.shadow,V=e.get(w);V.shadowIntensity=Y.intensity,V.shadowBias=Y.bias,V.shadowNormalBias=Y.normalBias,V.shadowRadius=Y.radius,V.shadowMapSize=Y.mapSize,n.directionalShadow[p]=V,n.directionalShadowMap[p]=B,n.directionalShadowMatrix[p]=w.shadow.matrix,x++}n.directional[p]=z,p++}else if(w.isSpotLight){let z=t.get(w);z.position.setFromMatrixPosition(w.matrixWorld),z.color.copy(L).multiplyScalar(U),z.distance=H,z.coneCos=Math.cos(w.angle),z.penumbraCos=Math.cos(w.angle*(1-w.penumbra)),z.decay=w.decay,n.spot[y]=z;let Y=w.shadow;if(w.map&&(n.spotLightMap[T]=w.map,T++,Y.updateMatrices(w),w.castShadow&&A++),n.spotLightMatrix[y]=Y.matrix,w.castShadow){let V=e.get(w);V.shadowIntensity=Y.intensity,V.shadowBias=Y.bias,V.shadowNormalBias=Y.normalBias,V.shadowRadius=Y.radius,V.shadowMapSize=Y.mapSize,n.spotShadow[y]=V,n.spotShadowMap[y]=B,v++}y++}else if(w.isRectAreaLight){let z=t.get(w);z.color.copy(L).multiplyScalar(U),z.halfWidth.set(w.width*.5,0,0),z.halfHeight.set(0,w.height*.5,0),n.rectArea[m]=z,m++}else if(w.isPointLight){let z=t.get(w);if(z.color.copy(w.color).multiplyScalar(w.intensity),z.distance=w.distance,z.decay=w.decay,w.castShadow){let Y=w.shadow,V=e.get(w);V.shadowIntensity=Y.intensity,V.shadowBias=Y.bias,V.shadowNormalBias=Y.normalBias,V.shadowRadius=Y.radius,V.shadowMapSize=Y.mapSize,V.shadowCameraNear=Y.camera.near,V.shadowCameraFar=Y.camera.far,n.pointShadow[g]=V,n.pointShadowMap[g]=B,n.pointShadowMatrix[g]=w.shadow.matrix,M++}n.point[g]=z,g++}else if(w.isHemisphereLight){let z=t.get(w);z.skyColor.copy(w.color).multiplyScalar(U),z.groundColor.copy(w.groundColor).multiplyScalar(U),n.hemi[d]=z,d++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=ft.LTC_FLOAT_1,n.rectAreaLTC2=ft.LTC_FLOAT_2):(n.rectAreaLTC1=ft.LTC_HALF_1,n.rectAreaLTC2=ft.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=f;let I=n.hash;(I.directionalLength!==p||I.pointLength!==g||I.spotLength!==y||I.rectAreaLength!==m||I.hemiLength!==d||I.numDirectionalShadows!==x||I.numPointShadows!==M||I.numSpotShadows!==v||I.numSpotMaps!==T||I.numLightProbes!==C)&&(n.directional.length=p,n.spot.length=y,n.rectArea.length=m,n.point.length=g,n.hemi.length=d,n.directionalShadow.length=x,n.directionalShadowMap.length=x,n.pointShadow.length=M,n.pointShadowMap.length=M,n.spotShadow.length=v,n.spotShadowMap.length=v,n.directionalShadowMatrix.length=x,n.pointShadowMatrix.length=M,n.spotLightMatrix.length=v+T-A,n.spotLightMap.length=T,n.numSpotLightShadowsWithMaps=A,n.numLightProbes=C,I.directionalLength=p,I.pointLength=g,I.spotLength=y,I.rectAreaLength=m,I.hemiLength=d,I.numDirectionalShadows=x,I.numPointShadows=M,I.numSpotShadows=v,I.numSpotMaps=T,I.numLightProbes=C,n.version=h0++)}function l(c,h){let u=0,f=0,p=0,g=0,y=0,m=h.matrixWorldInverse;for(let d=0,x=c.length;d<x;d++){let M=c[d];if(M.isDirectionalLight){let v=n.directional[u];v.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),v.direction.sub(s),v.direction.transformDirection(m),u++}else if(M.isSpotLight){let v=n.spot[p];v.position.setFromMatrixPosition(M.matrixWorld),v.position.applyMatrix4(m),v.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),v.direction.sub(s),v.direction.transformDirection(m),p++}else if(M.isRectAreaLight){let v=n.rectArea[g];v.position.setFromMatrixPosition(M.matrixWorld),v.position.applyMatrix4(m),o.identity(),r.copy(M.matrixWorld),r.premultiply(m),o.extractRotation(r),v.halfWidth.set(M.width*.5,0,0),v.halfHeight.set(0,M.height*.5,0),v.halfWidth.applyMatrix4(o),v.halfHeight.applyMatrix4(o),g++}else if(M.isPointLight){let v=n.point[f];v.position.setFromMatrixPosition(M.matrixWorld),v.position.applyMatrix4(m),f++}else if(M.isHemisphereLight){let v=n.hemi[y];v.direction.setFromMatrixPosition(M.matrixWorld),v.direction.transformDirection(m),y++}}}return{setup:a,setupView:l,state:n}}function $h(i){let t=new d0(i),e=[],n=[];function s(h){c.camera=h,e.length=0,n.length=0}function r(h){e.push(h)}function o(h){n.push(h)}function a(){t.setup(e)}function l(h){t.setupView(e,h)}let c={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:a,setupLightsView:l,pushLight:r,pushShadow:o}}function f0(i){let t=new WeakMap;function e(s,r=0){let o=t.get(s),a;return o===void 0?(a=new $h(i),t.set(s,[a])):r>=o.length?(a=new $h(i),o.push(a)):a=o[r],a}function n(){t=new WeakMap}return{get:e,dispose:n}}var p0=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,m0=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function g0(i,t,e){let n=new Ji,s=new at,r=new at,o=new ee,a=new jr({depthPacking:hh}),l=new to,c={},h=e.maxTextureSize,u={[Rn]:Ne,[Ne]:Rn,[He]:He},f=new ln({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new at},radius:{value:4}},vertexShader:p0,fragmentShader:m0}),p=f.clone();p.defines.HORIZONTAL_PASS=1;let g=new ve;g.setAttribute("position",new Ce(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let y=new Lt(g,f),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=nc;let d=this.type;this.render=function(A,C,I){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||A.length===0)return;let b=i.getRenderTarget(),_=i.getActiveCubeFace(),w=i.getActiveMipmapLevel(),L=i.state;L.setBlending(Ln),L.buffers.depth.getReversed()===!0?L.buffers.color.setClear(0,0,0,0):L.buffers.color.setClear(1,1,1,1),L.buffers.depth.setTest(!0),L.setScissorTest(!1);let U=d!==yn&&this.type===yn,H=d===yn&&this.type!==yn;for(let B=0,z=A.length;B<z;B++){let Y=A[B],V=Y.shadow;if(V===void 0){console.warn("THREE.WebGLShadowMap:",Y,"has no shadow.");continue}if(V.autoUpdate===!1&&V.needsUpdate===!1)continue;s.copy(V.mapSize);let lt=V.getFrameExtents();if(s.multiply(lt),r.copy(V.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/lt.x),s.x=r.x*lt.x,V.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/lt.y),s.y=r.y*lt.y,V.mapSize.y=r.y)),V.map===null||U===!0||H===!0){let vt=this.type!==yn?{minFilter:Oe,magFilter:Oe}:{};V.map!==null&&V.map.dispose(),V.map=new gn(s.x,s.y,vt),V.map.texture.name=Y.name+".shadowMap",V.camera.updateProjectionMatrix()}i.setRenderTarget(V.map),i.clear();let _t=V.getViewportCount();for(let vt=0;vt<_t;vt++){let Ht=V.getViewport(vt);o.set(r.x*Ht.x,r.y*Ht.y,r.x*Ht.z,r.y*Ht.w),L.viewport(o),V.updateMatrices(Y,vt),n=V.getFrustum(),v(C,I,V.camera,Y,this.type)}V.isPointLightShadow!==!0&&this.type===yn&&x(V,I),V.needsUpdate=!1}d=this.type,m.needsUpdate=!1,i.setRenderTarget(b,_,w)};function x(A,C){let I=t.update(y);f.defines.VSM_SAMPLES!==A.blurSamples&&(f.defines.VSM_SAMPLES=A.blurSamples,p.defines.VSM_SAMPLES=A.blurSamples,f.needsUpdate=!0,p.needsUpdate=!0),A.mapPass===null&&(A.mapPass=new gn(s.x,s.y)),f.uniforms.shadow_pass.value=A.map.texture,f.uniforms.resolution.value=A.mapSize,f.uniforms.radius.value=A.radius,i.setRenderTarget(A.mapPass),i.clear(),i.renderBufferDirect(C,null,I,f,y,null),p.uniforms.shadow_pass.value=A.mapPass.texture,p.uniforms.resolution.value=A.mapSize,p.uniforms.radius.value=A.radius,i.setRenderTarget(A.map),i.clear(),i.renderBufferDirect(C,null,I,p,y,null)}function M(A,C,I,b){let _=null,w=I.isPointLight===!0?A.customDistanceMaterial:A.customDepthMaterial;if(w!==void 0)_=w;else if(_=I.isPointLight===!0?l:a,i.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0||C.alphaToCoverage===!0){let L=_.uuid,U=C.uuid,H=c[L];H===void 0&&(H={},c[L]=H);let B=H[U];B===void 0&&(B=_.clone(),H[U]=B,C.addEventListener("dispose",T)),_=B}if(_.visible=C.visible,_.wireframe=C.wireframe,b===yn?_.side=C.shadowSide!==null?C.shadowSide:C.side:_.side=C.shadowSide!==null?C.shadowSide:u[C.side],_.alphaMap=C.alphaMap,_.alphaTest=C.alphaToCoverage===!0?.5:C.alphaTest,_.map=C.map,_.clipShadows=C.clipShadows,_.clippingPlanes=C.clippingPlanes,_.clipIntersection=C.clipIntersection,_.displacementMap=C.displacementMap,_.displacementScale=C.displacementScale,_.displacementBias=C.displacementBias,_.wireframeLinewidth=C.wireframeLinewidth,_.linewidth=C.linewidth,I.isPointLight===!0&&_.isMeshDistanceMaterial===!0){let L=i.properties.get(_);L.light=I}return _}function v(A,C,I,b,_){if(A.visible===!1)return;if(A.layers.test(C.layers)&&(A.isMesh||A.isLine||A.isPoints)&&(A.castShadow||A.receiveShadow&&_===yn)&&(!A.frustumCulled||n.intersectsObject(A))){A.modelViewMatrix.multiplyMatrices(I.matrixWorldInverse,A.matrixWorld);let U=t.update(A),H=A.material;if(Array.isArray(H)){let B=U.groups;for(let z=0,Y=B.length;z<Y;z++){let V=B[z],lt=H[V.materialIndex];if(lt&&lt.visible){let _t=M(A,lt,b,_);A.onBeforeShadow(i,A,C,I,U,_t,V),i.renderBufferDirect(I,null,U,_t,A,V),A.onAfterShadow(i,A,C,I,U,_t,V)}}}else if(H.visible){let B=M(A,H,b,_);A.onBeforeShadow(i,A,C,I,U,B,null),i.renderBufferDirect(I,null,U,B,A,null),A.onAfterShadow(i,A,C,I,U,B,null)}}let L=A.children;for(let U=0,H=L.length;U<H;U++)v(L[U],C,I,b,_)}function T(A){A.target.removeEventListener("dispose",T);for(let I in c){let b=c[I],_=A.target.uuid;_ in b&&(b[_].dispose(),delete b[_])}}}var _0={[po]:mo,[go]:yo,[_o]:vo,[ui]:xo,[mo]:po,[yo]:go,[vo]:_o,[xo]:ui};function x0(i,t){function e(){let N=!1,ot=new ee,dt=null,Mt=new ee(0,0,0,0);return{setMask:function(st){dt!==st&&!N&&(i.colorMask(st,st,st,st),dt=st)},setLocked:function(st){N=st},setClear:function(st,Q,wt,Bt,ae){ae===!0&&(st*=Bt,Q*=Bt,wt*=Bt),ot.set(st,Q,wt,Bt),Mt.equals(ot)===!1&&(i.clearColor(st,Q,wt,Bt),Mt.copy(ot))},reset:function(){N=!1,dt=null,Mt.set(-1,0,0,0)}}}function n(){let N=!1,ot=!1,dt=null,Mt=null,st=null;return{setReversed:function(Q){if(ot!==Q){let wt=t.get("EXT_clip_control");Q?wt.clipControlEXT(wt.LOWER_LEFT_EXT,wt.ZERO_TO_ONE_EXT):wt.clipControlEXT(wt.LOWER_LEFT_EXT,wt.NEGATIVE_ONE_TO_ONE_EXT),ot=Q;let Bt=st;st=null,this.setClear(Bt)}},getReversed:function(){return ot},setTest:function(Q){Q?et(i.DEPTH_TEST):yt(i.DEPTH_TEST)},setMask:function(Q){dt!==Q&&!N&&(i.depthMask(Q),dt=Q)},setFunc:function(Q){if(ot&&(Q=_0[Q]),Mt!==Q){switch(Q){case po:i.depthFunc(i.NEVER);break;case mo:i.depthFunc(i.ALWAYS);break;case go:i.depthFunc(i.LESS);break;case ui:i.depthFunc(i.LEQUAL);break;case _o:i.depthFunc(i.EQUAL);break;case xo:i.depthFunc(i.GEQUAL);break;case yo:i.depthFunc(i.GREATER);break;case vo:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}Mt=Q}},setLocked:function(Q){N=Q},setClear:function(Q){st!==Q&&(ot&&(Q=1-Q),i.clearDepth(Q),st=Q)},reset:function(){N=!1,dt=null,Mt=null,st=null,ot=!1}}}function s(){let N=!1,ot=null,dt=null,Mt=null,st=null,Q=null,wt=null,Bt=null,ae=null;return{setTest:function(jt){N||(jt?et(i.STENCIL_TEST):yt(i.STENCIL_TEST))},setMask:function(jt){ot!==jt&&!N&&(i.stencilMask(jt),ot=jt)},setFunc:function(jt,Mn,pn){(dt!==jt||Mt!==Mn||st!==pn)&&(i.stencilFunc(jt,Mn,pn),dt=jt,Mt=Mn,st=pn)},setOp:function(jt,Mn,pn){(Q!==jt||wt!==Mn||Bt!==pn)&&(i.stencilOp(jt,Mn,pn),Q=jt,wt=Mn,Bt=pn)},setLocked:function(jt){N=jt},setClear:function(jt){ae!==jt&&(i.clearStencil(jt),ae=jt)},reset:function(){N=!1,ot=null,dt=null,Mt=null,st=null,Q=null,wt=null,Bt=null,ae=null}}}let r=new e,o=new n,a=new s,l=new WeakMap,c=new WeakMap,h={},u={},f=new WeakMap,p=[],g=null,y=!1,m=null,d=null,x=null,M=null,v=null,T=null,A=null,C=new zt(0,0,0),I=0,b=!1,_=null,w=null,L=null,U=null,H=null,B=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),z=!1,Y=0,V=i.getParameter(i.VERSION);V.indexOf("WebGL")!==-1?(Y=parseFloat(/^WebGL (\d)/.exec(V)[1]),z=Y>=1):V.indexOf("OpenGL ES")!==-1&&(Y=parseFloat(/^OpenGL ES (\d)/.exec(V)[1]),z=Y>=2);let lt=null,_t={},vt=i.getParameter(i.SCISSOR_BOX),Ht=i.getParameter(i.VIEWPORT),Jt=new ee().fromArray(vt),te=new ee().fromArray(Ht);function $t(N,ot,dt,Mt){let st=new Uint8Array(4),Q=i.createTexture();i.bindTexture(N,Q),i.texParameteri(N,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(N,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let wt=0;wt<dt;wt++)N===i.TEXTURE_3D||N===i.TEXTURE_2D_ARRAY?i.texImage3D(ot,0,i.RGBA,1,1,Mt,0,i.RGBA,i.UNSIGNED_BYTE,st):i.texImage2D(ot+wt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,st);return Q}let Z={};Z[i.TEXTURE_2D]=$t(i.TEXTURE_2D,i.TEXTURE_2D,1),Z[i.TEXTURE_CUBE_MAP]=$t(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),Z[i.TEXTURE_2D_ARRAY]=$t(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Z[i.TEXTURE_3D]=$t(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),et(i.DEPTH_TEST),o.setFunc(ui),$(!1),J(ec),et(i.CULL_FACE),tt(Ln);function et(N){h[N]!==!0&&(i.enable(N),h[N]=!0)}function yt(N){h[N]!==!1&&(i.disable(N),h[N]=!1)}function Ct(N,ot){return u[N]!==ot?(i.bindFramebuffer(N,ot),u[N]=ot,N===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=ot),N===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=ot),!0):!1}function St(N,ot){let dt=p,Mt=!1;if(N){dt=f.get(ot),dt===void 0&&(dt=[],f.set(ot,dt));let st=N.textures;if(dt.length!==st.length||dt[0]!==i.COLOR_ATTACHMENT0){for(let Q=0,wt=st.length;Q<wt;Q++)dt[Q]=i.COLOR_ATTACHMENT0+Q;dt.length=st.length,Mt=!0}}else dt[0]!==i.BACK&&(dt[0]=i.BACK,Mt=!0);Mt&&i.drawBuffers(dt)}function Xt(N){return g!==N?(i.useProgram(N),g=N,!0):!1}let oe={[Xn]:i.FUNC_ADD,[Ol]:i.FUNC_SUBTRACT,[Bl]:i.FUNC_REVERSE_SUBTRACT};oe[zl]=i.MIN,oe[Hl]=i.MAX;let D={[kl]:i.ZERO,[Vl]:i.ONE,[Gl]:i.SRC_COLOR,[Fr]:i.SRC_ALPHA,[Jl]:i.SRC_ALPHA_SATURATE,[Yl]:i.DST_COLOR,[Xl]:i.DST_ALPHA,[Wl]:i.ONE_MINUS_SRC_COLOR,[Or]:i.ONE_MINUS_SRC_ALPHA,[Zl]:i.ONE_MINUS_DST_COLOR,[ql]:i.ONE_MINUS_DST_ALPHA,[$l]:i.CONSTANT_COLOR,[Kl]:i.ONE_MINUS_CONSTANT_COLOR,[Ql]:i.CONSTANT_ALPHA,[jl]:i.ONE_MINUS_CONSTANT_ALPHA};function tt(N,ot,dt,Mt,st,Q,wt,Bt,ae,jt){if(N===Ln){y===!0&&(yt(i.BLEND),y=!1);return}if(y===!1&&(et(i.BLEND),y=!0),N!==Fl){if(N!==m||jt!==b){if((d!==Xn||v!==Xn)&&(i.blendEquation(i.FUNC_ADD),d=Xn,v=Xn),jt)switch(N){case hi:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Un:i.blendFunc(i.ONE,i.ONE);break;case ic:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case sc:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}else switch(N){case hi:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Un:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case ic:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case sc:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}x=null,M=null,T=null,A=null,C.set(0,0,0),I=0,m=N,b=jt}return}st=st||ot,Q=Q||dt,wt=wt||Mt,(ot!==d||st!==v)&&(i.blendEquationSeparate(oe[ot],oe[st]),d=ot,v=st),(dt!==x||Mt!==M||Q!==T||wt!==A)&&(i.blendFuncSeparate(D[dt],D[Mt],D[Q],D[wt]),x=dt,M=Mt,T=Q,A=wt),(Bt.equals(C)===!1||ae!==I)&&(i.blendColor(Bt.r,Bt.g,Bt.b,ae),C.copy(Bt),I=ae),m=N,b=!1}function K(N,ot){N.side===He?yt(i.CULL_FACE):et(i.CULL_FACE);let dt=N.side===Ne;ot&&(dt=!dt),$(dt),N.blending===hi&&N.transparent===!1?tt(Ln):tt(N.blending,N.blendEquation,N.blendSrc,N.blendDst,N.blendEquationAlpha,N.blendSrcAlpha,N.blendDstAlpha,N.blendColor,N.blendAlpha,N.premultipliedAlpha),o.setFunc(N.depthFunc),o.setTest(N.depthTest),o.setMask(N.depthWrite),r.setMask(N.colorWrite);let Mt=N.stencilWrite;a.setTest(Mt),Mt&&(a.setMask(N.stencilWriteMask),a.setFunc(N.stencilFunc,N.stencilRef,N.stencilFuncMask),a.setOp(N.stencilFail,N.stencilZFail,N.stencilZPass)),nt(N.polygonOffset,N.polygonOffsetFactor,N.polygonOffsetUnits),N.alphaToCoverage===!0?et(i.SAMPLE_ALPHA_TO_COVERAGE):yt(i.SAMPLE_ALPHA_TO_COVERAGE)}function $(N){_!==N&&(N?i.frontFace(i.CW):i.frontFace(i.CCW),_=N)}function J(N){N!==Ul?(et(i.CULL_FACE),N!==w&&(N===ec?i.cullFace(i.BACK):N===Nl?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):yt(i.CULL_FACE),w=N}function ht(N){N!==L&&(z&&i.lineWidth(N),L=N)}function nt(N,ot,dt){N?(et(i.POLYGON_OFFSET_FILL),(U!==ot||H!==dt)&&(i.polygonOffset(ot,dt),U=ot,H=dt)):yt(i.POLYGON_OFFSET_FILL)}function ut(N){N?et(i.SCISSOR_TEST):yt(i.SCISSOR_TEST)}function Ot(N){N===void 0&&(N=i.TEXTURE0+B-1),lt!==N&&(i.activeTexture(N),lt=N)}function Ft(N,ot,dt){dt===void 0&&(lt===null?dt=i.TEXTURE0+B-1:dt=lt);let Mt=_t[dt];Mt===void 0&&(Mt={type:void 0,texture:void 0},_t[dt]=Mt),(Mt.type!==N||Mt.texture!==ot)&&(lt!==dt&&(i.activeTexture(dt),lt=dt),i.bindTexture(N,ot||Z[N]),Mt.type=N,Mt.texture=ot)}function R(){let N=_t[lt];N!==void 0&&N.type!==void 0&&(i.bindTexture(N.type,null),N.type=void 0,N.texture=void 0)}function S(){try{i.compressedTexImage2D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function k(){try{i.compressedTexImage3D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function X(){try{i.texSubImage2D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function j(){try{i.texSubImage3D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function q(){try{i.compressedTexSubImage2D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function At(){try{i.compressedTexSubImage3D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function ct(){try{i.texStorage2D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Et(){try{i.texStorage3D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Tt(){try{i.texImage2D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function it(){try{i.texImage3D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function gt(N){Jt.equals(N)===!1&&(i.scissor(N.x,N.y,N.z,N.w),Jt.copy(N))}function Ut(N){te.equals(N)===!1&&(i.viewport(N.x,N.y,N.z,N.w),te.copy(N))}function Rt(N,ot){let dt=c.get(ot);dt===void 0&&(dt=new WeakMap,c.set(ot,dt));let Mt=dt.get(N);Mt===void 0&&(Mt=i.getUniformBlockIndex(ot,N.name),dt.set(N,Mt))}function pt(N,ot){let Mt=c.get(ot).get(N);l.get(ot)!==Mt&&(i.uniformBlockBinding(ot,Mt,N.__bindingPointIndex),l.set(ot,Mt))}function Vt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},lt=null,_t={},u={},f=new WeakMap,p=[],g=null,y=!1,m=null,d=null,x=null,M=null,v=null,T=null,A=null,C=new zt(0,0,0),I=0,b=!1,_=null,w=null,L=null,U=null,H=null,Jt.set(0,0,i.canvas.width,i.canvas.height),te.set(0,0,i.canvas.width,i.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:et,disable:yt,bindFramebuffer:Ct,drawBuffers:St,useProgram:Xt,setBlending:tt,setMaterial:K,setFlipSided:$,setCullFace:J,setLineWidth:ht,setPolygonOffset:nt,setScissorTest:ut,activeTexture:Ot,bindTexture:Ft,unbindTexture:R,compressedTexImage2D:S,compressedTexImage3D:k,texImage2D:Tt,texImage3D:it,updateUBOMapping:Rt,uniformBlockBinding:pt,texStorage2D:ct,texStorage3D:Et,texSubImage2D:X,texSubImage3D:j,compressedTexSubImage2D:q,compressedTexSubImage3D:At,scissor:gt,viewport:Ut,reset:Vt}}function y0(i,t,e,n,s,r,o){let a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new at,h=new WeakMap,u,f=new WeakMap,p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(R,S){return p?new OffscreenCanvas(R,S):Ps("canvas")}function y(R,S,k){let X=1,j=Ft(R);if((j.width>k||j.height>k)&&(X=k/Math.max(j.width,j.height)),X<1)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap||typeof VideoFrame<"u"&&R instanceof VideoFrame){let q=Math.floor(X*j.width),At=Math.floor(X*j.height);u===void 0&&(u=g(q,At));let ct=S?g(q,At):u;return ct.width=q,ct.height=At,ct.getContext("2d").drawImage(R,0,0,q,At),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+j.width+"x"+j.height+") to ("+q+"x"+At+")."),ct}else return"data"in R&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+j.width+"x"+j.height+")."),R;return R}function m(R){return R.generateMipmaps}function d(R){i.generateMipmap(R)}function x(R){return R.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:R.isWebGL3DRenderTarget?i.TEXTURE_3D:R.isWebGLArrayRenderTarget||R.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function M(R,S,k,X,j=!1){if(R!==null){if(i[R]!==void 0)return i[R];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let q=S;if(S===i.RED&&(k===i.FLOAT&&(q=i.R32F),k===i.HALF_FLOAT&&(q=i.R16F),k===i.UNSIGNED_BYTE&&(q=i.R8)),S===i.RED_INTEGER&&(k===i.UNSIGNED_BYTE&&(q=i.R8UI),k===i.UNSIGNED_SHORT&&(q=i.R16UI),k===i.UNSIGNED_INT&&(q=i.R32UI),k===i.BYTE&&(q=i.R8I),k===i.SHORT&&(q=i.R16I),k===i.INT&&(q=i.R32I)),S===i.RG&&(k===i.FLOAT&&(q=i.RG32F),k===i.HALF_FLOAT&&(q=i.RG16F),k===i.UNSIGNED_BYTE&&(q=i.RG8)),S===i.RG_INTEGER&&(k===i.UNSIGNED_BYTE&&(q=i.RG8UI),k===i.UNSIGNED_SHORT&&(q=i.RG16UI),k===i.UNSIGNED_INT&&(q=i.RG32UI),k===i.BYTE&&(q=i.RG8I),k===i.SHORT&&(q=i.RG16I),k===i.INT&&(q=i.RG32I)),S===i.RGB_INTEGER&&(k===i.UNSIGNED_BYTE&&(q=i.RGB8UI),k===i.UNSIGNED_SHORT&&(q=i.RGB16UI),k===i.UNSIGNED_INT&&(q=i.RGB32UI),k===i.BYTE&&(q=i.RGB8I),k===i.SHORT&&(q=i.RGB16I),k===i.INT&&(q=i.RGB32I)),S===i.RGBA_INTEGER&&(k===i.UNSIGNED_BYTE&&(q=i.RGBA8UI),k===i.UNSIGNED_SHORT&&(q=i.RGBA16UI),k===i.UNSIGNED_INT&&(q=i.RGBA32UI),k===i.BYTE&&(q=i.RGBA8I),k===i.SHORT&&(q=i.RGBA16I),k===i.INT&&(q=i.RGBA32I)),S===i.RGB&&(k===i.UNSIGNED_INT_5_9_9_9_REV&&(q=i.RGB9_E5),k===i.UNSIGNED_INT_10F_11F_11F_REV&&(q=i.R11F_G11F_B10F)),S===i.RGBA){let At=j?Cs:Kt.getTransfer(X);k===i.FLOAT&&(q=i.RGBA32F),k===i.HALF_FLOAT&&(q=i.RGBA16F),k===i.UNSIGNED_BYTE&&(q=At===ne?i.SRGB8_ALPHA8:i.RGBA8),k===i.UNSIGNED_SHORT_4_4_4_4&&(q=i.RGBA4),k===i.UNSIGNED_SHORT_5_5_5_1&&(q=i.RGB5_A1)}return(q===i.R16F||q===i.R32F||q===i.RG16F||q===i.RG32F||q===i.RGBA16F||q===i.RGBA32F)&&t.get("EXT_color_buffer_float"),q}function v(R,S){let k;return R?S===null||S===ti||S===ss?k=i.DEPTH24_STENCIL8:S===dn?k=i.DEPTH32F_STENCIL8:S===ns&&(k=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):S===null||S===ti||S===ss?k=i.DEPTH_COMPONENT24:S===dn?k=i.DEPTH_COMPONENT32F:S===ns&&(k=i.DEPTH_COMPONENT16),k}function T(R,S){return m(R)===!0||R.isFramebufferTexture&&R.minFilter!==Oe&&R.minFilter!==an?Math.log2(Math.max(S.width,S.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?S.mipmaps.length:1}function A(R){let S=R.target;S.removeEventListener("dispose",A),I(S),S.isVideoTexture&&h.delete(S)}function C(R){let S=R.target;S.removeEventListener("dispose",C),_(S)}function I(R){let S=n.get(R);if(S.__webglInit===void 0)return;let k=R.source,X=f.get(k);if(X){let j=X[S.__cacheKey];j.usedTimes--,j.usedTimes===0&&b(R),Object.keys(X).length===0&&f.delete(k)}n.remove(R)}function b(R){let S=n.get(R);i.deleteTexture(S.__webglTexture);let k=R.source,X=f.get(k);delete X[S.__cacheKey],o.memory.textures--}function _(R){let S=n.get(R);if(R.depthTexture&&(R.depthTexture.dispose(),n.remove(R.depthTexture)),R.isWebGLCubeRenderTarget)for(let X=0;X<6;X++){if(Array.isArray(S.__webglFramebuffer[X]))for(let j=0;j<S.__webglFramebuffer[X].length;j++)i.deleteFramebuffer(S.__webglFramebuffer[X][j]);else i.deleteFramebuffer(S.__webglFramebuffer[X]);S.__webglDepthbuffer&&i.deleteRenderbuffer(S.__webglDepthbuffer[X])}else{if(Array.isArray(S.__webglFramebuffer))for(let X=0;X<S.__webglFramebuffer.length;X++)i.deleteFramebuffer(S.__webglFramebuffer[X]);else i.deleteFramebuffer(S.__webglFramebuffer);if(S.__webglDepthbuffer&&i.deleteRenderbuffer(S.__webglDepthbuffer),S.__webglMultisampledFramebuffer&&i.deleteFramebuffer(S.__webglMultisampledFramebuffer),S.__webglColorRenderbuffer)for(let X=0;X<S.__webglColorRenderbuffer.length;X++)S.__webglColorRenderbuffer[X]&&i.deleteRenderbuffer(S.__webglColorRenderbuffer[X]);S.__webglDepthRenderbuffer&&i.deleteRenderbuffer(S.__webglDepthRenderbuffer)}let k=R.textures;for(let X=0,j=k.length;X<j;X++){let q=n.get(k[X]);q.__webglTexture&&(i.deleteTexture(q.__webglTexture),o.memory.textures--),n.remove(k[X])}n.remove(R)}let w=0;function L(){w=0}function U(){let R=w;return R>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+R+" texture units while this GPU supports only "+s.maxTextures),w+=1,R}function H(R){let S=[];return S.push(R.wrapS),S.push(R.wrapT),S.push(R.wrapR||0),S.push(R.magFilter),S.push(R.minFilter),S.push(R.anisotropy),S.push(R.internalFormat),S.push(R.format),S.push(R.type),S.push(R.generateMipmaps),S.push(R.premultiplyAlpha),S.push(R.flipY),S.push(R.unpackAlignment),S.push(R.colorSpace),S.join()}function B(R,S){let k=n.get(R);if(R.isVideoTexture&&ut(R),R.isRenderTargetTexture===!1&&R.isExternalTexture!==!0&&R.version>0&&k.__version!==R.version){let X=R.image;if(X===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(X.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Z(k,R,S);return}}else R.isExternalTexture&&(k.__webglTexture=R.sourceTexture?R.sourceTexture:null);e.bindTexture(i.TEXTURE_2D,k.__webglTexture,i.TEXTURE0+S)}function z(R,S){let k=n.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&k.__version!==R.version){Z(k,R,S);return}e.bindTexture(i.TEXTURE_2D_ARRAY,k.__webglTexture,i.TEXTURE0+S)}function Y(R,S){let k=n.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&k.__version!==R.version){Z(k,R,S);return}e.bindTexture(i.TEXTURE_3D,k.__webglTexture,i.TEXTURE0+S)}function V(R,S){let k=n.get(R);if(R.version>0&&k.__version!==R.version){et(k,R,S);return}e.bindTexture(i.TEXTURE_CUBE_MAP,k.__webglTexture,i.TEXTURE0+S)}let lt={[Cn]:i.REPEAT,[Wn]:i.CLAMP_TO_EDGE,[Br]:i.MIRRORED_REPEAT},_t={[Oe]:i.NEAREST,[ch]:i.NEAREST_MIPMAP_NEAREST,[nr]:i.NEAREST_MIPMAP_LINEAR,[an]:i.LINEAR,[So]:i.LINEAR_MIPMAP_NEAREST,[jn]:i.LINEAR_MIPMAP_LINEAR},vt={[dh]:i.NEVER,[xh]:i.ALWAYS,[fh]:i.LESS,[mc]:i.LEQUAL,[ph]:i.EQUAL,[_h]:i.GEQUAL,[mh]:i.GREATER,[gh]:i.NOTEQUAL};function Ht(R,S){if(S.type===dn&&t.has("OES_texture_float_linear")===!1&&(S.magFilter===an||S.magFilter===So||S.magFilter===nr||S.magFilter===jn||S.minFilter===an||S.minFilter===So||S.minFilter===nr||S.minFilter===jn)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(R,i.TEXTURE_WRAP_S,lt[S.wrapS]),i.texParameteri(R,i.TEXTURE_WRAP_T,lt[S.wrapT]),(R===i.TEXTURE_3D||R===i.TEXTURE_2D_ARRAY)&&i.texParameteri(R,i.TEXTURE_WRAP_R,lt[S.wrapR]),i.texParameteri(R,i.TEXTURE_MAG_FILTER,_t[S.magFilter]),i.texParameteri(R,i.TEXTURE_MIN_FILTER,_t[S.minFilter]),S.compareFunction&&(i.texParameteri(R,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(R,i.TEXTURE_COMPARE_FUNC,vt[S.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(S.magFilter===Oe||S.minFilter!==nr&&S.minFilter!==jn||S.type===dn&&t.has("OES_texture_float_linear")===!1)return;if(S.anisotropy>1||n.get(S).__currentAnisotropy){let k=t.get("EXT_texture_filter_anisotropic");i.texParameterf(R,k.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(S.anisotropy,s.getMaxAnisotropy())),n.get(S).__currentAnisotropy=S.anisotropy}}}function Jt(R,S){let k=!1;R.__webglInit===void 0&&(R.__webglInit=!0,S.addEventListener("dispose",A));let X=S.source,j=f.get(X);j===void 0&&(j={},f.set(X,j));let q=H(S);if(q!==R.__cacheKey){j[q]===void 0&&(j[q]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,k=!0),j[q].usedTimes++;let At=j[R.__cacheKey];At!==void 0&&(j[R.__cacheKey].usedTimes--,At.usedTimes===0&&b(S)),R.__cacheKey=q,R.__webglTexture=j[q].texture}return k}function te(R,S,k){return Math.floor(Math.floor(R/k)/S)}function $t(R,S,k,X){let q=R.updateRanges;if(q.length===0)e.texSubImage2D(i.TEXTURE_2D,0,0,0,S.width,S.height,k,X,S.data);else{q.sort((it,gt)=>it.start-gt.start);let At=0;for(let it=1;it<q.length;it++){let gt=q[At],Ut=q[it],Rt=gt.start+gt.count,pt=te(Ut.start,S.width,4),Vt=te(gt.start,S.width,4);Ut.start<=Rt+1&&pt===Vt&&te(Ut.start+Ut.count-1,S.width,4)===pt?gt.count=Math.max(gt.count,Ut.start+Ut.count-gt.start):(++At,q[At]=Ut)}q.length=At+1;let ct=i.getParameter(i.UNPACK_ROW_LENGTH),Et=i.getParameter(i.UNPACK_SKIP_PIXELS),Tt=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,S.width);for(let it=0,gt=q.length;it<gt;it++){let Ut=q[it],Rt=Math.floor(Ut.start/4),pt=Math.ceil(Ut.count/4),Vt=Rt%S.width,N=Math.floor(Rt/S.width),ot=pt,dt=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,Vt),i.pixelStorei(i.UNPACK_SKIP_ROWS,N),e.texSubImage2D(i.TEXTURE_2D,0,Vt,N,ot,dt,k,X,S.data)}R.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,ct),i.pixelStorei(i.UNPACK_SKIP_PIXELS,Et),i.pixelStorei(i.UNPACK_SKIP_ROWS,Tt)}}function Z(R,S,k){let X=i.TEXTURE_2D;(S.isDataArrayTexture||S.isCompressedArrayTexture)&&(X=i.TEXTURE_2D_ARRAY),S.isData3DTexture&&(X=i.TEXTURE_3D);let j=Jt(R,S),q=S.source;e.bindTexture(X,R.__webglTexture,i.TEXTURE0+k);let At=n.get(q);if(q.version!==At.__version||j===!0){e.activeTexture(i.TEXTURE0+k);let ct=Kt.getPrimaries(Kt.workingColorSpace),Et=S.colorSpace===Fn?null:Kt.getPrimaries(S.colorSpace),Tt=S.colorSpace===Fn||ct===Et?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,S.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,S.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Tt);let it=y(S.image,!1,s.maxTextureSize);it=Ot(S,it);let gt=r.convert(S.format,S.colorSpace),Ut=r.convert(S.type),Rt=M(S.internalFormat,gt,Ut,S.colorSpace,S.isVideoTexture);Ht(X,S);let pt,Vt=S.mipmaps,N=S.isVideoTexture!==!0,ot=At.__version===void 0||j===!0,dt=q.dataReady,Mt=T(S,it);if(S.isDepthTexture)Rt=v(S.format===rs,S.type),ot&&(N?e.texStorage2D(i.TEXTURE_2D,1,Rt,it.width,it.height):e.texImage2D(i.TEXTURE_2D,0,Rt,it.width,it.height,0,gt,Ut,null));else if(S.isDataTexture)if(Vt.length>0){N&&ot&&e.texStorage2D(i.TEXTURE_2D,Mt,Rt,Vt[0].width,Vt[0].height);for(let st=0,Q=Vt.length;st<Q;st++)pt=Vt[st],N?dt&&e.texSubImage2D(i.TEXTURE_2D,st,0,0,pt.width,pt.height,gt,Ut,pt.data):e.texImage2D(i.TEXTURE_2D,st,Rt,pt.width,pt.height,0,gt,Ut,pt.data);S.generateMipmaps=!1}else N?(ot&&e.texStorage2D(i.TEXTURE_2D,Mt,Rt,it.width,it.height),dt&&$t(S,it,gt,Ut)):e.texImage2D(i.TEXTURE_2D,0,Rt,it.width,it.height,0,gt,Ut,it.data);else if(S.isCompressedTexture)if(S.isCompressedArrayTexture){N&&ot&&e.texStorage3D(i.TEXTURE_2D_ARRAY,Mt,Rt,Vt[0].width,Vt[0].height,it.depth);for(let st=0,Q=Vt.length;st<Q;st++)if(pt=Vt[st],S.format!==Qe)if(gt!==null)if(N){if(dt)if(S.layerUpdates.size>0){let wt=Ec(pt.width,pt.height,S.format,S.type);for(let Bt of S.layerUpdates){let ae=pt.data.subarray(Bt*wt/pt.data.BYTES_PER_ELEMENT,(Bt+1)*wt/pt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,st,0,0,Bt,pt.width,pt.height,1,gt,ae)}S.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,st,0,0,0,pt.width,pt.height,it.depth,gt,pt.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,st,Rt,pt.width,pt.height,it.depth,0,pt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else N?dt&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,st,0,0,0,pt.width,pt.height,it.depth,gt,Ut,pt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,st,Rt,pt.width,pt.height,it.depth,0,gt,Ut,pt.data)}else{N&&ot&&e.texStorage2D(i.TEXTURE_2D,Mt,Rt,Vt[0].width,Vt[0].height);for(let st=0,Q=Vt.length;st<Q;st++)pt=Vt[st],S.format!==Qe?gt!==null?N?dt&&e.compressedTexSubImage2D(i.TEXTURE_2D,st,0,0,pt.width,pt.height,gt,pt.data):e.compressedTexImage2D(i.TEXTURE_2D,st,Rt,pt.width,pt.height,0,pt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):N?dt&&e.texSubImage2D(i.TEXTURE_2D,st,0,0,pt.width,pt.height,gt,Ut,pt.data):e.texImage2D(i.TEXTURE_2D,st,Rt,pt.width,pt.height,0,gt,Ut,pt.data)}else if(S.isDataArrayTexture)if(N){if(ot&&e.texStorage3D(i.TEXTURE_2D_ARRAY,Mt,Rt,it.width,it.height,it.depth),dt)if(S.layerUpdates.size>0){let st=Ec(it.width,it.height,S.format,S.type);for(let Q of S.layerUpdates){let wt=it.data.subarray(Q*st/it.data.BYTES_PER_ELEMENT,(Q+1)*st/it.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,Q,it.width,it.height,1,gt,Ut,wt)}S.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,it.width,it.height,it.depth,gt,Ut,it.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,Rt,it.width,it.height,it.depth,0,gt,Ut,it.data);else if(S.isData3DTexture)N?(ot&&e.texStorage3D(i.TEXTURE_3D,Mt,Rt,it.width,it.height,it.depth),dt&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,it.width,it.height,it.depth,gt,Ut,it.data)):e.texImage3D(i.TEXTURE_3D,0,Rt,it.width,it.height,it.depth,0,gt,Ut,it.data);else if(S.isFramebufferTexture){if(ot)if(N)e.texStorage2D(i.TEXTURE_2D,Mt,Rt,it.width,it.height);else{let st=it.width,Q=it.height;for(let wt=0;wt<Mt;wt++)e.texImage2D(i.TEXTURE_2D,wt,Rt,st,Q,0,gt,Ut,null),st>>=1,Q>>=1}}else if(Vt.length>0){if(N&&ot){let st=Ft(Vt[0]);e.texStorage2D(i.TEXTURE_2D,Mt,Rt,st.width,st.height)}for(let st=0,Q=Vt.length;st<Q;st++)pt=Vt[st],N?dt&&e.texSubImage2D(i.TEXTURE_2D,st,0,0,gt,Ut,pt):e.texImage2D(i.TEXTURE_2D,st,Rt,gt,Ut,pt);S.generateMipmaps=!1}else if(N){if(ot){let st=Ft(it);e.texStorage2D(i.TEXTURE_2D,Mt,Rt,st.width,st.height)}dt&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,gt,Ut,it)}else e.texImage2D(i.TEXTURE_2D,0,Rt,gt,Ut,it);m(S)&&d(X),At.__version=q.version,S.onUpdate&&S.onUpdate(S)}R.__version=S.version}function et(R,S,k){if(S.image.length!==6)return;let X=Jt(R,S),j=S.source;e.bindTexture(i.TEXTURE_CUBE_MAP,R.__webglTexture,i.TEXTURE0+k);let q=n.get(j);if(j.version!==q.__version||X===!0){e.activeTexture(i.TEXTURE0+k);let At=Kt.getPrimaries(Kt.workingColorSpace),ct=S.colorSpace===Fn?null:Kt.getPrimaries(S.colorSpace),Et=S.colorSpace===Fn||At===ct?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,S.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,S.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Et);let Tt=S.isCompressedTexture||S.image[0].isCompressedTexture,it=S.image[0]&&S.image[0].isDataTexture,gt=[];for(let Q=0;Q<6;Q++)!Tt&&!it?gt[Q]=y(S.image[Q],!0,s.maxCubemapSize):gt[Q]=it?S.image[Q].image:S.image[Q],gt[Q]=Ot(S,gt[Q]);let Ut=gt[0],Rt=r.convert(S.format,S.colorSpace),pt=r.convert(S.type),Vt=M(S.internalFormat,Rt,pt,S.colorSpace),N=S.isVideoTexture!==!0,ot=q.__version===void 0||X===!0,dt=j.dataReady,Mt=T(S,Ut);Ht(i.TEXTURE_CUBE_MAP,S);let st;if(Tt){N&&ot&&e.texStorage2D(i.TEXTURE_CUBE_MAP,Mt,Vt,Ut.width,Ut.height);for(let Q=0;Q<6;Q++){st=gt[Q].mipmaps;for(let wt=0;wt<st.length;wt++){let Bt=st[wt];S.format!==Qe?Rt!==null?N?dt&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,wt,0,0,Bt.width,Bt.height,Rt,Bt.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,wt,Vt,Bt.width,Bt.height,0,Bt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):N?dt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,wt,0,0,Bt.width,Bt.height,Rt,pt,Bt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,wt,Vt,Bt.width,Bt.height,0,Rt,pt,Bt.data)}}}else{if(st=S.mipmaps,N&&ot){st.length>0&&Mt++;let Q=Ft(gt[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,Mt,Vt,Q.width,Q.height)}for(let Q=0;Q<6;Q++)if(it){N?dt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,0,0,gt[Q].width,gt[Q].height,Rt,pt,gt[Q].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,Vt,gt[Q].width,gt[Q].height,0,Rt,pt,gt[Q].data);for(let wt=0;wt<st.length;wt++){let ae=st[wt].image[Q].image;N?dt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,wt+1,0,0,ae.width,ae.height,Rt,pt,ae.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,wt+1,Vt,ae.width,ae.height,0,Rt,pt,ae.data)}}else{N?dt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,0,0,Rt,pt,gt[Q]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,Vt,Rt,pt,gt[Q]);for(let wt=0;wt<st.length;wt++){let Bt=st[wt];N?dt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,wt+1,0,0,Rt,pt,Bt.image[Q]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,wt+1,Vt,Rt,pt,Bt.image[Q])}}}m(S)&&d(i.TEXTURE_CUBE_MAP),q.__version=j.version,S.onUpdate&&S.onUpdate(S)}R.__version=S.version}function yt(R,S,k,X,j,q){let At=r.convert(k.format,k.colorSpace),ct=r.convert(k.type),Et=M(k.internalFormat,At,ct,k.colorSpace),Tt=n.get(S),it=n.get(k);if(it.__renderTarget=S,!Tt.__hasExternalTextures){let gt=Math.max(1,S.width>>q),Ut=Math.max(1,S.height>>q);j===i.TEXTURE_3D||j===i.TEXTURE_2D_ARRAY?e.texImage3D(j,q,Et,gt,Ut,S.depth,0,At,ct,null):e.texImage2D(j,q,Et,gt,Ut,0,At,ct,null)}e.bindFramebuffer(i.FRAMEBUFFER,R),nt(S)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,X,j,it.__webglTexture,0,ht(S)):(j===i.TEXTURE_2D||j>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&j<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,X,j,it.__webglTexture,q),e.bindFramebuffer(i.FRAMEBUFFER,null)}function Ct(R,S,k){if(i.bindRenderbuffer(i.RENDERBUFFER,R),S.depthBuffer){let X=S.depthTexture,j=X&&X.isDepthTexture?X.type:null,q=v(S.stencilBuffer,j),At=S.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ct=ht(S);nt(S)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ct,q,S.width,S.height):k?i.renderbufferStorageMultisample(i.RENDERBUFFER,ct,q,S.width,S.height):i.renderbufferStorage(i.RENDERBUFFER,q,S.width,S.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,At,i.RENDERBUFFER,R)}else{let X=S.textures;for(let j=0;j<X.length;j++){let q=X[j],At=r.convert(q.format,q.colorSpace),ct=r.convert(q.type),Et=M(q.internalFormat,At,ct,q.colorSpace),Tt=ht(S);k&&nt(S)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Tt,Et,S.width,S.height):nt(S)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Tt,Et,S.width,S.height):i.renderbufferStorage(i.RENDERBUFFER,Et,S.width,S.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function St(R,S){if(S&&S.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,R),!(S.depthTexture&&S.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let X=n.get(S.depthTexture);X.__renderTarget=S,(!X.__webglTexture||S.depthTexture.image.width!==S.width||S.depthTexture.image.height!==S.height)&&(S.depthTexture.image.width=S.width,S.depthTexture.image.height=S.height,S.depthTexture.needsUpdate=!0),B(S.depthTexture,0);let j=X.__webglTexture,q=ht(S);if(S.depthTexture.format===Vi)nt(S)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,j,0,q):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,j,0);else if(S.depthTexture.format===rs)nt(S)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,j,0,q):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,j,0);else throw new Error("Unknown depthTexture format")}function Xt(R){let S=n.get(R),k=R.isWebGLCubeRenderTarget===!0;if(S.__boundDepthTexture!==R.depthTexture){let X=R.depthTexture;if(S.__depthDisposeCallback&&S.__depthDisposeCallback(),X){let j=()=>{delete S.__boundDepthTexture,delete S.__depthDisposeCallback,X.removeEventListener("dispose",j)};X.addEventListener("dispose",j),S.__depthDisposeCallback=j}S.__boundDepthTexture=X}if(R.depthTexture&&!S.__autoAllocateDepthBuffer){if(k)throw new Error("target.depthTexture not supported in Cube render targets");let X=R.texture.mipmaps;X&&X.length>0?St(S.__webglFramebuffer[0],R):St(S.__webglFramebuffer,R)}else if(k){S.__webglDepthbuffer=[];for(let X=0;X<6;X++)if(e.bindFramebuffer(i.FRAMEBUFFER,S.__webglFramebuffer[X]),S.__webglDepthbuffer[X]===void 0)S.__webglDepthbuffer[X]=i.createRenderbuffer(),Ct(S.__webglDepthbuffer[X],R,!1);else{let j=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,q=S.__webglDepthbuffer[X];i.bindRenderbuffer(i.RENDERBUFFER,q),i.framebufferRenderbuffer(i.FRAMEBUFFER,j,i.RENDERBUFFER,q)}}else{let X=R.texture.mipmaps;if(X&&X.length>0?e.bindFramebuffer(i.FRAMEBUFFER,S.__webglFramebuffer[0]):e.bindFramebuffer(i.FRAMEBUFFER,S.__webglFramebuffer),S.__webglDepthbuffer===void 0)S.__webglDepthbuffer=i.createRenderbuffer(),Ct(S.__webglDepthbuffer,R,!1);else{let j=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,q=S.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,q),i.framebufferRenderbuffer(i.FRAMEBUFFER,j,i.RENDERBUFFER,q)}}e.bindFramebuffer(i.FRAMEBUFFER,null)}function oe(R,S,k){let X=n.get(R);S!==void 0&&yt(X.__webglFramebuffer,R,R.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),k!==void 0&&Xt(R)}function D(R){let S=R.texture,k=n.get(R),X=n.get(S);R.addEventListener("dispose",C);let j=R.textures,q=R.isWebGLCubeRenderTarget===!0,At=j.length>1;if(At||(X.__webglTexture===void 0&&(X.__webglTexture=i.createTexture()),X.__version=S.version,o.memory.textures++),q){k.__webglFramebuffer=[];for(let ct=0;ct<6;ct++)if(S.mipmaps&&S.mipmaps.length>0){k.__webglFramebuffer[ct]=[];for(let Et=0;Et<S.mipmaps.length;Et++)k.__webglFramebuffer[ct][Et]=i.createFramebuffer()}else k.__webglFramebuffer[ct]=i.createFramebuffer()}else{if(S.mipmaps&&S.mipmaps.length>0){k.__webglFramebuffer=[];for(let ct=0;ct<S.mipmaps.length;ct++)k.__webglFramebuffer[ct]=i.createFramebuffer()}else k.__webglFramebuffer=i.createFramebuffer();if(At)for(let ct=0,Et=j.length;ct<Et;ct++){let Tt=n.get(j[ct]);Tt.__webglTexture===void 0&&(Tt.__webglTexture=i.createTexture(),o.memory.textures++)}if(R.samples>0&&nt(R)===!1){k.__webglMultisampledFramebuffer=i.createFramebuffer(),k.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,k.__webglMultisampledFramebuffer);for(let ct=0;ct<j.length;ct++){let Et=j[ct];k.__webglColorRenderbuffer[ct]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,k.__webglColorRenderbuffer[ct]);let Tt=r.convert(Et.format,Et.colorSpace),it=r.convert(Et.type),gt=M(Et.internalFormat,Tt,it,Et.colorSpace,R.isXRRenderTarget===!0),Ut=ht(R);i.renderbufferStorageMultisample(i.RENDERBUFFER,Ut,gt,R.width,R.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ct,i.RENDERBUFFER,k.__webglColorRenderbuffer[ct])}i.bindRenderbuffer(i.RENDERBUFFER,null),R.depthBuffer&&(k.__webglDepthRenderbuffer=i.createRenderbuffer(),Ct(k.__webglDepthRenderbuffer,R,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(q){e.bindTexture(i.TEXTURE_CUBE_MAP,X.__webglTexture),Ht(i.TEXTURE_CUBE_MAP,S);for(let ct=0;ct<6;ct++)if(S.mipmaps&&S.mipmaps.length>0)for(let Et=0;Et<S.mipmaps.length;Et++)yt(k.__webglFramebuffer[ct][Et],R,S,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ct,Et);else yt(k.__webglFramebuffer[ct],R,S,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ct,0);m(S)&&d(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(At){for(let ct=0,Et=j.length;ct<Et;ct++){let Tt=j[ct],it=n.get(Tt),gt=i.TEXTURE_2D;(R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(gt=R.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(gt,it.__webglTexture),Ht(gt,Tt),yt(k.__webglFramebuffer,R,Tt,i.COLOR_ATTACHMENT0+ct,gt,0),m(Tt)&&d(gt)}e.unbindTexture()}else{let ct=i.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(ct=R.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(ct,X.__webglTexture),Ht(ct,S),S.mipmaps&&S.mipmaps.length>0)for(let Et=0;Et<S.mipmaps.length;Et++)yt(k.__webglFramebuffer[Et],R,S,i.COLOR_ATTACHMENT0,ct,Et);else yt(k.__webglFramebuffer,R,S,i.COLOR_ATTACHMENT0,ct,0);m(S)&&d(ct),e.unbindTexture()}R.depthBuffer&&Xt(R)}function tt(R){let S=R.textures;for(let k=0,X=S.length;k<X;k++){let j=S[k];if(m(j)){let q=x(R),At=n.get(j).__webglTexture;e.bindTexture(q,At),d(q),e.unbindTexture()}}}let K=[],$=[];function J(R){if(R.samples>0){if(nt(R)===!1){let S=R.textures,k=R.width,X=R.height,j=i.COLOR_BUFFER_BIT,q=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,At=n.get(R),ct=S.length>1;if(ct)for(let Tt=0;Tt<S.length;Tt++)e.bindFramebuffer(i.FRAMEBUFFER,At.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Tt,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,At.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Tt,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,At.__webglMultisampledFramebuffer);let Et=R.texture.mipmaps;Et&&Et.length>0?e.bindFramebuffer(i.DRAW_FRAMEBUFFER,At.__webglFramebuffer[0]):e.bindFramebuffer(i.DRAW_FRAMEBUFFER,At.__webglFramebuffer);for(let Tt=0;Tt<S.length;Tt++){if(R.resolveDepthBuffer&&(R.depthBuffer&&(j|=i.DEPTH_BUFFER_BIT),R.stencilBuffer&&R.resolveStencilBuffer&&(j|=i.STENCIL_BUFFER_BIT)),ct){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,At.__webglColorRenderbuffer[Tt]);let it=n.get(S[Tt]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,it,0)}i.blitFramebuffer(0,0,k,X,0,0,k,X,j,i.NEAREST),l===!0&&(K.length=0,$.length=0,K.push(i.COLOR_ATTACHMENT0+Tt),R.depthBuffer&&R.resolveDepthBuffer===!1&&(K.push(q),$.push(q),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,$)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,K))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),ct)for(let Tt=0;Tt<S.length;Tt++){e.bindFramebuffer(i.FRAMEBUFFER,At.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Tt,i.RENDERBUFFER,At.__webglColorRenderbuffer[Tt]);let it=n.get(S[Tt]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,At.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Tt,i.TEXTURE_2D,it,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,At.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.resolveDepthBuffer===!1&&l){let S=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[S])}}}function ht(R){return Math.min(s.maxSamples,R.samples)}function nt(R){let S=n.get(R);return R.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&S.__useRenderToTexture!==!1}function ut(R){let S=o.render.frame;h.get(R)!==S&&(h.set(R,S),R.update())}function Ot(R,S){let k=R.colorSpace,X=R.format,j=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||k!==di&&k!==Fn&&(Kt.getTransfer(k)===ne?(X!==Qe||j!==un)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",k)),S}function Ft(R){return typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement?(c.width=R.naturalWidth||R.width,c.height=R.naturalHeight||R.height):typeof VideoFrame<"u"&&R instanceof VideoFrame?(c.width=R.displayWidth,c.height=R.displayHeight):(c.width=R.width,c.height=R.height),c}this.allocateTextureUnit=U,this.resetTextureUnits=L,this.setTexture2D=B,this.setTexture2DArray=z,this.setTexture3D=Y,this.setTextureCube=V,this.rebindTextures=oe,this.setupRenderTarget=D,this.updateRenderTargetMipmap=tt,this.updateMultisampleRenderTarget=J,this.setupDepthRenderbuffer=Xt,this.setupFrameBufferTexture=yt,this.useMultisampledRTT=nt}function v0(i,t){function e(n,s=Fn){let r,o=Kt.getTransfer(s);if(n===un)return i.UNSIGNED_BYTE;if(n===To)return i.UNSIGNED_SHORT_4_4_4_4;if(n===wo)return i.UNSIGNED_SHORT_5_5_5_1;if(n===lc)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===hc)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===ac)return i.BYTE;if(n===cc)return i.SHORT;if(n===ns)return i.UNSIGNED_SHORT;if(n===Eo)return i.INT;if(n===ti)return i.UNSIGNED_INT;if(n===dn)return i.FLOAT;if(n===is)return i.HALF_FLOAT;if(n===uc)return i.ALPHA;if(n===dc)return i.RGB;if(n===Qe)return i.RGBA;if(n===Vi)return i.DEPTH_COMPONENT;if(n===rs)return i.DEPTH_STENCIL;if(n===Ao)return i.RED;if(n===Ro)return i.RED_INTEGER;if(n===fc)return i.RG;if(n===Co)return i.RG_INTEGER;if(n===Io)return i.RGBA_INTEGER;if(n===ir||n===sr||n===rr||n===or)if(o===ne)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===ir)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===sr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===rr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===or)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===ir)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===sr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===rr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===or)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Po||n===Do||n===Lo||n===Uo)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Po)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Do)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Lo)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Uo)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===No||n===Fo||n===Oo)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===No||n===Fo)return o===ne?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Oo)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Bo||n===zo||n===Ho||n===ko||n===Vo||n===Go||n===Wo||n===Xo||n===qo||n===Yo||n===Zo||n===Jo||n===$o||n===Ko)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Bo)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===zo)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Ho)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===ko)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Vo)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Go)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Wo)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Xo)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===qo)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Yo)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Zo)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Jo)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===$o)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Ko)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Qo||n===jo||n===ta)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===Qo)return o===ne?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===jo)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===ta)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===ea||n===na||n===ia||n===sa)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===ea)return r.COMPRESSED_RED_RGTC1_EXT;if(n===na)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===ia)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===sa)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===ss?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}var M0=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,b0=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,Oc=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){let n=new Hs(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){let e=t.cameras[0].viewport,n=new ln({vertexShader:M0,fragmentShader:b0,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new Lt(new Me(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Bc=class extends In{constructor(t,e){super();let n=this,s=null,r=1,o=null,a="local-floor",l=1,c=null,h=null,u=null,f=null,p=null,g=null,y=typeof XRWebGLBinding<"u",m=new Oc,d={},x=e.getContextAttributes(),M=null,v=null,T=[],A=[],C=new at,I=null,b=new Te;b.viewport=new ee;let _=new Te;_.viewport=new ee;let w=[b,_],L=new uo,U=null,H=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Z){let et=T[Z];return et===void 0&&(et=new qi,T[Z]=et),et.getTargetRaySpace()},this.getControllerGrip=function(Z){let et=T[Z];return et===void 0&&(et=new qi,T[Z]=et),et.getGripSpace()},this.getHand=function(Z){let et=T[Z];return et===void 0&&(et=new qi,T[Z]=et),et.getHandSpace()};function B(Z){let et=A.indexOf(Z.inputSource);if(et===-1)return;let yt=T[et];yt!==void 0&&(yt.update(Z.inputSource,Z.frame,c||o),yt.dispatchEvent({type:Z.type,data:Z.inputSource}))}function z(){s.removeEventListener("select",B),s.removeEventListener("selectstart",B),s.removeEventListener("selectend",B),s.removeEventListener("squeeze",B),s.removeEventListener("squeezestart",B),s.removeEventListener("squeezeend",B),s.removeEventListener("end",z),s.removeEventListener("inputsourceschange",Y);for(let Z=0;Z<T.length;Z++){let et=A[Z];et!==null&&(A[Z]=null,T[Z].disconnect(et))}U=null,H=null,m.reset();for(let Z in d)delete d[Z];t.setRenderTarget(M),p=null,f=null,u=null,s=null,v=null,$t.stop(),n.isPresenting=!1,t.setPixelRatio(I),t.setSize(C.width,C.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Z){r=Z,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Z){a=Z,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(Z){c=Z},this.getBaseLayer=function(){return f!==null?f:p},this.getBinding=function(){return u===null&&y&&(u=new XRWebGLBinding(s,e)),u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(Z){if(s=Z,s!==null){if(M=t.getRenderTarget(),s.addEventListener("select",B),s.addEventListener("selectstart",B),s.addEventListener("selectend",B),s.addEventListener("squeeze",B),s.addEventListener("squeezestart",B),s.addEventListener("squeezeend",B),s.addEventListener("end",z),s.addEventListener("inputsourceschange",Y),x.xrCompatible!==!0&&await e.makeXRCompatible(),I=t.getPixelRatio(),t.getSize(C),y&&"createProjectionLayer"in XRWebGLBinding.prototype){let yt=null,Ct=null,St=null;x.depth&&(St=x.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,yt=x.stencil?rs:Vi,Ct=x.stencil?ss:ti);let Xt={colorFormat:e.RGBA8,depthFormat:St,scaleFactor:r};u=this.getBinding(),f=u.createProjectionLayer(Xt),s.updateRenderState({layers:[f]}),t.setPixelRatio(1),t.setSize(f.textureWidth,f.textureHeight,!1),v=new gn(f.textureWidth,f.textureHeight,{format:Qe,type:un,depthTexture:new zs(f.textureWidth,f.textureHeight,Ct,void 0,void 0,void 0,void 0,void 0,void 0,yt),stencilBuffer:x.stencil,colorSpace:t.outputColorSpace,samples:x.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}else{let yt={antialias:x.antialias,alpha:!0,depth:x.depth,stencil:x.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(s,e,yt),s.updateRenderState({baseLayer:p}),t.setPixelRatio(1),t.setSize(p.framebufferWidth,p.framebufferHeight,!1),v=new gn(p.framebufferWidth,p.framebufferHeight,{format:Qe,type:un,colorSpace:t.outputColorSpace,stencilBuffer:x.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(a),$t.setContext(s),$t.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function Y(Z){for(let et=0;et<Z.removed.length;et++){let yt=Z.removed[et],Ct=A.indexOf(yt);Ct>=0&&(A[Ct]=null,T[Ct].disconnect(yt))}for(let et=0;et<Z.added.length;et++){let yt=Z.added[et],Ct=A.indexOf(yt);if(Ct===-1){for(let Xt=0;Xt<T.length;Xt++)if(Xt>=A.length){A.push(yt),Ct=Xt;break}else if(A[Xt]===null){A[Xt]=yt,Ct=Xt;break}if(Ct===-1)break}let St=T[Ct];St&&St.connect(yt)}}let V=new P,lt=new P;function _t(Z,et,yt){V.setFromMatrixPosition(et.matrixWorld),lt.setFromMatrixPosition(yt.matrixWorld);let Ct=V.distanceTo(lt),St=et.projectionMatrix.elements,Xt=yt.projectionMatrix.elements,oe=St[14]/(St[10]-1),D=St[14]/(St[10]+1),tt=(St[9]+1)/St[5],K=(St[9]-1)/St[5],$=(St[8]-1)/St[0],J=(Xt[8]+1)/Xt[0],ht=oe*$,nt=oe*J,ut=Ct/(-$+J),Ot=ut*-$;if(et.matrixWorld.decompose(Z.position,Z.quaternion,Z.scale),Z.translateX(Ot),Z.translateZ(ut),Z.matrixWorld.compose(Z.position,Z.quaternion,Z.scale),Z.matrixWorldInverse.copy(Z.matrixWorld).invert(),St[10]===-1)Z.projectionMatrix.copy(et.projectionMatrix),Z.projectionMatrixInverse.copy(et.projectionMatrixInverse);else{let Ft=oe+ut,R=D+ut,S=ht-Ot,k=nt+(Ct-Ot),X=tt*D/R*Ft,j=K*D/R*Ft;Z.projectionMatrix.makePerspective(S,k,X,j,Ft,R),Z.projectionMatrixInverse.copy(Z.projectionMatrix).invert()}}function vt(Z,et){et===null?Z.matrixWorld.copy(Z.matrix):Z.matrixWorld.multiplyMatrices(et.matrixWorld,Z.matrix),Z.matrixWorldInverse.copy(Z.matrixWorld).invert()}this.updateCamera=function(Z){if(s===null)return;let et=Z.near,yt=Z.far;m.texture!==null&&(m.depthNear>0&&(et=m.depthNear),m.depthFar>0&&(yt=m.depthFar)),L.near=_.near=b.near=et,L.far=_.far=b.far=yt,(U!==L.near||H!==L.far)&&(s.updateRenderState({depthNear:L.near,depthFar:L.far}),U=L.near,H=L.far),L.layers.mask=Z.layers.mask|6,b.layers.mask=L.layers.mask&3,_.layers.mask=L.layers.mask&5;let Ct=Z.parent,St=L.cameras;vt(L,Ct);for(let Xt=0;Xt<St.length;Xt++)vt(St[Xt],Ct);St.length===2?_t(L,b,_):L.projectionMatrix.copy(b.projectionMatrix),Ht(Z,L,Ct)};function Ht(Z,et,yt){yt===null?Z.matrix.copy(et.matrixWorld):(Z.matrix.copy(yt.matrixWorld),Z.matrix.invert(),Z.matrix.multiply(et.matrixWorld)),Z.matrix.decompose(Z.position,Z.quaternion,Z.scale),Z.updateMatrixWorld(!0),Z.projectionMatrix.copy(et.projectionMatrix),Z.projectionMatrixInverse.copy(et.projectionMatrixInverse),Z.isPerspectiveCamera&&(Z.fov=Gi*2*Math.atan(1/Z.projectionMatrix.elements[5]),Z.zoom=1)}this.getCamera=function(){return L},this.getFoveation=function(){if(!(f===null&&p===null))return l},this.setFoveation=function(Z){l=Z,f!==null&&(f.fixedFoveation=Z),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=Z)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(L)},this.getCameraTexture=function(Z){return d[Z]};let Jt=null;function te(Z,et){if(h=et.getViewerPose(c||o),g=et,h!==null){let yt=h.views;p!==null&&(t.setRenderTargetFramebuffer(v,p.framebuffer),t.setRenderTarget(v));let Ct=!1;yt.length!==L.cameras.length&&(L.cameras.length=0,Ct=!0);for(let D=0;D<yt.length;D++){let tt=yt[D],K=null;if(p!==null)K=p.getViewport(tt);else{let J=u.getViewSubImage(f,tt);K=J.viewport,D===0&&(t.setRenderTargetTextures(v,J.colorTexture,J.depthStencilTexture),t.setRenderTarget(v))}let $=w[D];$===void 0&&($=new Te,$.layers.enable(D),$.viewport=new ee,w[D]=$),$.matrix.fromArray(tt.transform.matrix),$.matrix.decompose($.position,$.quaternion,$.scale),$.projectionMatrix.fromArray(tt.projectionMatrix),$.projectionMatrixInverse.copy($.projectionMatrix).invert(),$.viewport.set(K.x,K.y,K.width,K.height),D===0&&(L.matrix.copy($.matrix),L.matrix.decompose(L.position,L.quaternion,L.scale)),Ct===!0&&L.cameras.push($)}let St=s.enabledFeatures;if(St&&St.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&y){u=n.getBinding();let D=u.getDepthInformation(yt[0]);D&&D.isValid&&D.texture&&m.init(D,s.renderState)}if(St&&St.includes("camera-access")&&y){t.state.unbindTexture(),u=n.getBinding();for(let D=0;D<yt.length;D++){let tt=yt[D].camera;if(tt){let K=d[tt];K||(K=new Hs,d[tt]=K);let $=u.getCameraImage(tt);K.sourceTexture=$}}}}for(let yt=0;yt<T.length;yt++){let Ct=A[yt],St=T[yt];Ct!==null&&St!==void 0&&St.update(Ct,et,c||o)}Jt&&Jt(Z,et),et.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:et}),g=null}let $t=new Kh;$t.setAnimationLoop(te),this.setAnimationLoop=function(Z){Jt=Z},this.dispose=function(){}}},Mi=new Xe,S0=new se;function E0(i,t){function e(m,d){m.matrixAutoUpdate===!0&&m.updateMatrix(),d.value.copy(m.matrix)}function n(m,d){d.color.getRGB(m.fogColor.value,vc(i)),d.isFog?(m.fogNear.value=d.near,m.fogFar.value=d.far):d.isFogExp2&&(m.fogDensity.value=d.density)}function s(m,d,x,M,v){d.isMeshBasicMaterial||d.isMeshLambertMaterial?r(m,d):d.isMeshToonMaterial?(r(m,d),u(m,d)):d.isMeshPhongMaterial?(r(m,d),h(m,d)):d.isMeshStandardMaterial?(r(m,d),f(m,d),d.isMeshPhysicalMaterial&&p(m,d,v)):d.isMeshMatcapMaterial?(r(m,d),g(m,d)):d.isMeshDepthMaterial?r(m,d):d.isMeshDistanceMaterial?(r(m,d),y(m,d)):d.isMeshNormalMaterial?r(m,d):d.isLineBasicMaterial?(o(m,d),d.isLineDashedMaterial&&a(m,d)):d.isPointsMaterial?l(m,d,x,M):d.isSpriteMaterial?c(m,d):d.isShadowMaterial?(m.color.value.copy(d.color),m.opacity.value=d.opacity):d.isShaderMaterial&&(d.uniformsNeedUpdate=!1)}function r(m,d){m.opacity.value=d.opacity,d.color&&m.diffuse.value.copy(d.color),d.emissive&&m.emissive.value.copy(d.emissive).multiplyScalar(d.emissiveIntensity),d.map&&(m.map.value=d.map,e(d.map,m.mapTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,e(d.alphaMap,m.alphaMapTransform)),d.bumpMap&&(m.bumpMap.value=d.bumpMap,e(d.bumpMap,m.bumpMapTransform),m.bumpScale.value=d.bumpScale,d.side===Ne&&(m.bumpScale.value*=-1)),d.normalMap&&(m.normalMap.value=d.normalMap,e(d.normalMap,m.normalMapTransform),m.normalScale.value.copy(d.normalScale),d.side===Ne&&m.normalScale.value.negate()),d.displacementMap&&(m.displacementMap.value=d.displacementMap,e(d.displacementMap,m.displacementMapTransform),m.displacementScale.value=d.displacementScale,m.displacementBias.value=d.displacementBias),d.emissiveMap&&(m.emissiveMap.value=d.emissiveMap,e(d.emissiveMap,m.emissiveMapTransform)),d.specularMap&&(m.specularMap.value=d.specularMap,e(d.specularMap,m.specularMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest);let x=t.get(d),M=x.envMap,v=x.envMapRotation;M&&(m.envMap.value=M,Mi.copy(v),Mi.x*=-1,Mi.y*=-1,Mi.z*=-1,M.isCubeTexture&&M.isRenderTargetTexture===!1&&(Mi.y*=-1,Mi.z*=-1),m.envMapRotation.value.setFromMatrix4(S0.makeRotationFromEuler(Mi)),m.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=d.reflectivity,m.ior.value=d.ior,m.refractionRatio.value=d.refractionRatio),d.lightMap&&(m.lightMap.value=d.lightMap,m.lightMapIntensity.value=d.lightMapIntensity,e(d.lightMap,m.lightMapTransform)),d.aoMap&&(m.aoMap.value=d.aoMap,m.aoMapIntensity.value=d.aoMapIntensity,e(d.aoMap,m.aoMapTransform))}function o(m,d){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,d.map&&(m.map.value=d.map,e(d.map,m.mapTransform))}function a(m,d){m.dashSize.value=d.dashSize,m.totalSize.value=d.dashSize+d.gapSize,m.scale.value=d.scale}function l(m,d,x,M){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,m.size.value=d.size*x,m.scale.value=M*.5,d.map&&(m.map.value=d.map,e(d.map,m.uvTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,e(d.alphaMap,m.alphaMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest)}function c(m,d){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,m.rotation.value=d.rotation,d.map&&(m.map.value=d.map,e(d.map,m.mapTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,e(d.alphaMap,m.alphaMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest)}function h(m,d){m.specular.value.copy(d.specular),m.shininess.value=Math.max(d.shininess,1e-4)}function u(m,d){d.gradientMap&&(m.gradientMap.value=d.gradientMap)}function f(m,d){m.metalness.value=d.metalness,d.metalnessMap&&(m.metalnessMap.value=d.metalnessMap,e(d.metalnessMap,m.metalnessMapTransform)),m.roughness.value=d.roughness,d.roughnessMap&&(m.roughnessMap.value=d.roughnessMap,e(d.roughnessMap,m.roughnessMapTransform)),d.envMap&&(m.envMapIntensity.value=d.envMapIntensity)}function p(m,d,x){m.ior.value=d.ior,d.sheen>0&&(m.sheenColor.value.copy(d.sheenColor).multiplyScalar(d.sheen),m.sheenRoughness.value=d.sheenRoughness,d.sheenColorMap&&(m.sheenColorMap.value=d.sheenColorMap,e(d.sheenColorMap,m.sheenColorMapTransform)),d.sheenRoughnessMap&&(m.sheenRoughnessMap.value=d.sheenRoughnessMap,e(d.sheenRoughnessMap,m.sheenRoughnessMapTransform))),d.clearcoat>0&&(m.clearcoat.value=d.clearcoat,m.clearcoatRoughness.value=d.clearcoatRoughness,d.clearcoatMap&&(m.clearcoatMap.value=d.clearcoatMap,e(d.clearcoatMap,m.clearcoatMapTransform)),d.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=d.clearcoatRoughnessMap,e(d.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),d.clearcoatNormalMap&&(m.clearcoatNormalMap.value=d.clearcoatNormalMap,e(d.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(d.clearcoatNormalScale),d.side===Ne&&m.clearcoatNormalScale.value.negate())),d.dispersion>0&&(m.dispersion.value=d.dispersion),d.iridescence>0&&(m.iridescence.value=d.iridescence,m.iridescenceIOR.value=d.iridescenceIOR,m.iridescenceThicknessMinimum.value=d.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=d.iridescenceThicknessRange[1],d.iridescenceMap&&(m.iridescenceMap.value=d.iridescenceMap,e(d.iridescenceMap,m.iridescenceMapTransform)),d.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=d.iridescenceThicknessMap,e(d.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),d.transmission>0&&(m.transmission.value=d.transmission,m.transmissionSamplerMap.value=x.texture,m.transmissionSamplerSize.value.set(x.width,x.height),d.transmissionMap&&(m.transmissionMap.value=d.transmissionMap,e(d.transmissionMap,m.transmissionMapTransform)),m.thickness.value=d.thickness,d.thicknessMap&&(m.thicknessMap.value=d.thicknessMap,e(d.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=d.attenuationDistance,m.attenuationColor.value.copy(d.attenuationColor)),d.anisotropy>0&&(m.anisotropyVector.value.set(d.anisotropy*Math.cos(d.anisotropyRotation),d.anisotropy*Math.sin(d.anisotropyRotation)),d.anisotropyMap&&(m.anisotropyMap.value=d.anisotropyMap,e(d.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=d.specularIntensity,m.specularColor.value.copy(d.specularColor),d.specularColorMap&&(m.specularColorMap.value=d.specularColorMap,e(d.specularColorMap,m.specularColorMapTransform)),d.specularIntensityMap&&(m.specularIntensityMap.value=d.specularIntensityMap,e(d.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,d){d.matcap&&(m.matcap.value=d.matcap)}function y(m,d){let x=t.get(d).light;m.referencePosition.value.setFromMatrixPosition(x.matrixWorld),m.nearDistance.value=x.shadow.camera.near,m.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function T0(i,t,e,n){let s={},r={},o=[],a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(x,M){let v=M.program;n.uniformBlockBinding(x,v)}function c(x,M){let v=s[x.id];v===void 0&&(g(x),v=h(x),s[x.id]=v,x.addEventListener("dispose",m));let T=M.program;n.updateUBOMapping(x,T);let A=t.render.frame;r[x.id]!==A&&(f(x),r[x.id]=A)}function h(x){let M=u();x.__bindingPointIndex=M;let v=i.createBuffer(),T=x.__size,A=x.usage;return i.bindBuffer(i.UNIFORM_BUFFER,v),i.bufferData(i.UNIFORM_BUFFER,T,A),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,M,v),v}function u(){for(let x=0;x<a;x++)if(o.indexOf(x)===-1)return o.push(x),x;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(x){let M=s[x.id],v=x.uniforms,T=x.__cache;i.bindBuffer(i.UNIFORM_BUFFER,M);for(let A=0,C=v.length;A<C;A++){let I=Array.isArray(v[A])?v[A]:[v[A]];for(let b=0,_=I.length;b<_;b++){let w=I[b];if(p(w,A,b,T)===!0){let L=w.__offset,U=Array.isArray(w.value)?w.value:[w.value],H=0;for(let B=0;B<U.length;B++){let z=U[B],Y=y(z);typeof z=="number"||typeof z=="boolean"?(w.__data[0]=z,i.bufferSubData(i.UNIFORM_BUFFER,L+H,w.__data)):z.isMatrix3?(w.__data[0]=z.elements[0],w.__data[1]=z.elements[1],w.__data[2]=z.elements[2],w.__data[3]=0,w.__data[4]=z.elements[3],w.__data[5]=z.elements[4],w.__data[6]=z.elements[5],w.__data[7]=0,w.__data[8]=z.elements[6],w.__data[9]=z.elements[7],w.__data[10]=z.elements[8],w.__data[11]=0):(z.toArray(w.__data,H),H+=Y.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,L,w.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function p(x,M,v,T){let A=x.value,C=M+"_"+v;if(T[C]===void 0)return typeof A=="number"||typeof A=="boolean"?T[C]=A:T[C]=A.clone(),!0;{let I=T[C];if(typeof A=="number"||typeof A=="boolean"){if(I!==A)return T[C]=A,!0}else if(I.equals(A)===!1)return I.copy(A),!0}return!1}function g(x){let M=x.uniforms,v=0,T=16;for(let C=0,I=M.length;C<I;C++){let b=Array.isArray(M[C])?M[C]:[M[C]];for(let _=0,w=b.length;_<w;_++){let L=b[_],U=Array.isArray(L.value)?L.value:[L.value];for(let H=0,B=U.length;H<B;H++){let z=U[H],Y=y(z),V=v%T,lt=V%Y.boundary,_t=V+lt;v+=lt,_t!==0&&T-_t<Y.storage&&(v+=T-_t),L.__data=new Float32Array(Y.storage/Float32Array.BYTES_PER_ELEMENT),L.__offset=v,v+=Y.storage}}}let A=v%T;return A>0&&(v+=T-A),x.__size=v,x.__cache={},this}function y(x){let M={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(M.boundary=4,M.storage=4):x.isVector2?(M.boundary=8,M.storage=8):x.isVector3||x.isColor?(M.boundary=16,M.storage=12):x.isVector4?(M.boundary=16,M.storage=16):x.isMatrix3?(M.boundary=48,M.storage=48):x.isMatrix4?(M.boundary=64,M.storage=64):x.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",x),M}function m(x){let M=x.target;M.removeEventListener("dispose",m);let v=o.indexOf(M.__bindingPointIndex);o.splice(v,1),i.deleteBuffer(s[M.id]),delete s[M.id],delete r[M.id]}function d(){for(let x in s)i.deleteBuffer(s[x]);o=[],s={},r={}}return{bind:l,update:c,dispose:d}}var ca=class{constructor(t={}){let{canvas:e=yh(),context:n=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:f=!1}=t;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=o;let g=new Uint32Array(4),y=new Int32Array(4),m=null,d=null,x=[],M=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Nn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let v=this,T=!1;this._outputColorSpace=ue;let A=0,C=0,I=null,b=-1,_=null,w=new ee,L=new ee,U=null,H=new zt(0),B=0,z=e.width,Y=e.height,V=1,lt=null,_t=null,vt=new ee(0,0,z,Y),Ht=new ee(0,0,z,Y),Jt=!1,te=new Ji,$t=!1,Z=!1,et=new se,yt=new P,Ct=new ee,St={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Xt=!1;function oe(){return I===null?V:1}let D=n;function tt(E,F){return e.getContext(E,F)}try{let E={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${"180"}`),e.addEventListener("webglcontextlost",dt,!1),e.addEventListener("webglcontextrestored",Mt,!1),e.addEventListener("webglcontextcreationerror",st,!1),D===null){let F="webgl2";if(D=tt(F,E),D===null)throw tt(F)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(E){throw console.error("THREE.WebGLRenderer: "+E.message),E}let K,$,J,ht,nt,ut,Ot,Ft,R,S,k,X,j,q,At,ct,Et,Tt,it,gt,Ut,Rt,pt,Vt;function N(){K=new Gm(D),K.init(),Rt=new v0(D,K),$=new Fm(D,K,t,Rt),J=new x0(D,K),$.reversedDepthBuffer&&f&&J.buffers.depth.setReversed(!0),ht=new qm(D),nt=new r0,ut=new y0(D,K,J,nt,$,Rt,ht),Ot=new Bm(v),Ft=new Vm(v),R=new Kd(D),pt=new Um(D,R),S=new Wm(D,R,ht,pt),k=new Zm(D,S,R,ht),it=new Ym(D,$,ut),ct=new Om(nt),X=new s0(v,Ot,Ft,K,$,pt,ct),j=new E0(v,nt),q=new a0,At=new f0(K),Tt=new Lm(v,Ot,Ft,J,k,p,l),Et=new g0(v,k,$),Vt=new T0(D,ht,$,J),gt=new Nm(D,K,ht),Ut=new Xm(D,K,ht),ht.programs=X.programs,v.capabilities=$,v.extensions=K,v.properties=nt,v.renderLists=q,v.shadowMap=Et,v.state=J,v.info=ht}N();let ot=new Bc(v,D);this.xr=ot,this.getContext=function(){return D},this.getContextAttributes=function(){return D.getContextAttributes()},this.forceContextLoss=function(){let E=K.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){let E=K.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return V},this.setPixelRatio=function(E){E!==void 0&&(V=E,this.setSize(z,Y,!1))},this.getSize=function(E){return E.set(z,Y)},this.setSize=function(E,F,G=!0){if(ot.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}z=E,Y=F,e.width=Math.floor(E*V),e.height=Math.floor(F*V),G===!0&&(e.style.width=E+"px",e.style.height=F+"px"),this.setViewport(0,0,E,F)},this.getDrawingBufferSize=function(E){return E.set(z*V,Y*V).floor()},this.setDrawingBufferSize=function(E,F,G){z=E,Y=F,V=G,e.width=Math.floor(E*G),e.height=Math.floor(F*G),this.setViewport(0,0,E,F)},this.getCurrentViewport=function(E){return E.copy(w)},this.getViewport=function(E){return E.copy(vt)},this.setViewport=function(E,F,G,W){E.isVector4?vt.set(E.x,E.y,E.z,E.w):vt.set(E,F,G,W),J.viewport(w.copy(vt).multiplyScalar(V).round())},this.getScissor=function(E){return E.copy(Ht)},this.setScissor=function(E,F,G,W){E.isVector4?Ht.set(E.x,E.y,E.z,E.w):Ht.set(E,F,G,W),J.scissor(L.copy(Ht).multiplyScalar(V).round())},this.getScissorTest=function(){return Jt},this.setScissorTest=function(E){J.setScissorTest(Jt=E)},this.setOpaqueSort=function(E){lt=E},this.setTransparentSort=function(E){_t=E},this.getClearColor=function(E){return E.copy(Tt.getClearColor())},this.setClearColor=function(){Tt.setClearColor(...arguments)},this.getClearAlpha=function(){return Tt.getClearAlpha()},this.setClearAlpha=function(){Tt.setClearAlpha(...arguments)},this.clear=function(E=!0,F=!0,G=!0){let W=0;if(E){let O=!1;if(I!==null){let rt=I.texture.format;O=rt===Io||rt===Co||rt===Ro}if(O){let rt=I.texture.type,mt=rt===un||rt===ti||rt===ns||rt===ss||rt===To||rt===wo,bt=Tt.getClearColor(),xt=Tt.getClearAlpha(),Dt=bt.r,Nt=bt.g,It=bt.b;mt?(g[0]=Dt,g[1]=Nt,g[2]=It,g[3]=xt,D.clearBufferuiv(D.COLOR,0,g)):(y[0]=Dt,y[1]=Nt,y[2]=It,y[3]=xt,D.clearBufferiv(D.COLOR,0,y))}else W|=D.COLOR_BUFFER_BIT}F&&(W|=D.DEPTH_BUFFER_BIT),G&&(W|=D.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),D.clear(W)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",dt,!1),e.removeEventListener("webglcontextrestored",Mt,!1),e.removeEventListener("webglcontextcreationerror",st,!1),Tt.dispose(),q.dispose(),At.dispose(),nt.dispose(),Ot.dispose(),Ft.dispose(),k.dispose(),pt.dispose(),Vt.dispose(),X.dispose(),ot.dispose(),ot.removeEventListener("sessionstart",pn),ot.removeEventListener("sessionend",el),ni.stop()};function dt(E){E.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),T=!0}function Mt(){console.log("THREE.WebGLRenderer: Context Restored."),T=!1;let E=ht.autoReset,F=Et.enabled,G=Et.autoUpdate,W=Et.needsUpdate,O=Et.type;N(),ht.autoReset=E,Et.enabled=F,Et.autoUpdate=G,Et.needsUpdate=W,Et.type=O}function st(E){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function Q(E){let F=E.target;F.removeEventListener("dispose",Q),wt(F)}function wt(E){Bt(E),nt.remove(E)}function Bt(E){let F=nt.get(E).programs;F!==void 0&&(F.forEach(function(G){X.releaseProgram(G)}),E.isShaderMaterial&&X.releaseShaderCache(E))}this.renderBufferDirect=function(E,F,G,W,O,rt){F===null&&(F=St);let mt=O.isMesh&&O.matrixWorld.determinant()<0,bt=yu(E,F,G,W,O);J.setMaterial(W,mt);let xt=G.index,Dt=1;if(W.wireframe===!0){if(xt=S.getWireframeAttribute(G),xt===void 0)return;Dt=2}let Nt=G.drawRange,It=G.attributes.position,qt=Nt.start*Dt,ie=(Nt.start+Nt.count)*Dt;rt!==null&&(qt=Math.max(qt,rt.start*Dt),ie=Math.min(ie,(rt.start+rt.count)*Dt)),xt!==null?(qt=Math.max(qt,0),ie=Math.min(ie,xt.count)):It!=null&&(qt=Math.max(qt,0),ie=Math.min(ie,It.count));let ge=ie-qt;if(ge<0||ge===1/0)return;pt.setup(O,W,bt,G,xt);let le,re=gt;if(xt!==null&&(le=R.get(xt),re=Ut,re.setIndex(le)),O.isMesh)W.wireframe===!0?(J.setLineWidth(W.wireframeLinewidth*oe()),re.setMode(D.LINES)):re.setMode(D.TRIANGLES);else if(O.isLine){let Pt=W.linewidth;Pt===void 0&&(Pt=1),J.setLineWidth(Pt*oe()),O.isLineSegments?re.setMode(D.LINES):O.isLineLoop?re.setMode(D.LINE_LOOP):re.setMode(D.LINE_STRIP)}else O.isPoints?re.setMode(D.POINTS):O.isSprite&&re.setMode(D.TRIANGLES);if(O.isBatchedMesh)if(O._multiDrawInstances!==null)Wi("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),re.renderMultiDrawInstances(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount,O._multiDrawInstances);else if(K.get("WEBGL_multi_draw"))re.renderMultiDraw(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount);else{let Pt=O._multiDrawStarts,fe=O._multiDrawCounts,Qt=O._multiDrawCount,ke=xt?R.get(xt).bytesPerElement:1,wi=nt.get(W).currentProgram.getUniforms();for(let Ve=0;Ve<Qt;Ve++)wi.setValue(D,"_gl_DrawID",Ve),re.render(Pt[Ve]/ke,fe[Ve])}else if(O.isInstancedMesh)re.renderInstances(qt,ge,O.count);else if(G.isInstancedBufferGeometry){let Pt=G._maxInstanceCount!==void 0?G._maxInstanceCount:1/0,fe=Math.min(G.instanceCount,Pt);re.renderInstances(qt,ge,fe)}else re.render(qt,ge)};function ae(E,F,G){E.transparent===!0&&E.side===He&&E.forceSinglePass===!1?(E.side=Ne,E.needsUpdate=!0,dr(E,F,G),E.side=Rn,E.needsUpdate=!0,dr(E,F,G),E.side=He):dr(E,F,G)}this.compile=function(E,F,G=null){G===null&&(G=E),d=At.get(G),d.init(F),M.push(d),G.traverseVisible(function(O){O.isLight&&O.layers.test(F.layers)&&(d.pushLight(O),O.castShadow&&d.pushShadow(O))}),E!==G&&E.traverseVisible(function(O){O.isLight&&O.layers.test(F.layers)&&(d.pushLight(O),O.castShadow&&d.pushShadow(O))}),d.setupLights();let W=new Set;return E.traverse(function(O){if(!(O.isMesh||O.isPoints||O.isLine||O.isSprite))return;let rt=O.material;if(rt)if(Array.isArray(rt))for(let mt=0;mt<rt.length;mt++){let bt=rt[mt];ae(bt,G,O),W.add(bt)}else ae(rt,G,O),W.add(rt)}),d=M.pop(),W},this.compileAsync=function(E,F,G=null){let W=this.compile(E,F,G);return new Promise(O=>{function rt(){if(W.forEach(function(mt){nt.get(mt).currentProgram.isReady()&&W.delete(mt)}),W.size===0){O(E);return}setTimeout(rt,10)}K.get("KHR_parallel_shader_compile")!==null?rt():setTimeout(rt,10)})};let jt=null;function Mn(E){jt&&jt(E)}function pn(){ni.stop()}function el(){ni.start()}let ni=new Kh;ni.setAnimationLoop(Mn),typeof self<"u"&&ni.setContext(self),this.setAnimationLoop=function(E){jt=E,ot.setAnimationLoop(E),E===null?ni.stop():ni.start()},ot.addEventListener("sessionstart",pn),ot.addEventListener("sessionend",el),this.render=function(E,F){if(F!==void 0&&F.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(T===!0)return;if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),F.parent===null&&F.matrixWorldAutoUpdate===!0&&F.updateMatrixWorld(),ot.enabled===!0&&ot.isPresenting===!0&&(ot.cameraAutoUpdate===!0&&ot.updateCamera(F),F=ot.getCamera()),E.isScene===!0&&E.onBeforeRender(v,E,F,I),d=At.get(E,M.length),d.init(F),M.push(d),et.multiplyMatrices(F.projectionMatrix,F.matrixWorldInverse),te.setFromProjectionMatrix(et,on,F.reversedDepth),Z=this.localClippingEnabled,$t=ct.init(this.clippingPlanes,Z),m=q.get(E,x.length),m.init(),x.push(m),ot.enabled===!0&&ot.isPresenting===!0){let rt=v.xr.getDepthSensingMesh();rt!==null&&ga(rt,F,-1/0,v.sortObjects)}ga(E,F,0,v.sortObjects),m.finish(),v.sortObjects===!0&&m.sort(lt,_t),Xt=ot.enabled===!1||ot.isPresenting===!1||ot.hasDepthSensing()===!1,Xt&&Tt.addToRenderList(m,E),this.info.render.frame++,$t===!0&&ct.beginShadows();let G=d.state.shadowsArray;Et.render(G,E,F),$t===!0&&ct.endShadows(),this.info.autoReset===!0&&this.info.reset();let W=m.opaque,O=m.transmissive;if(d.setupLights(),F.isArrayCamera){let rt=F.cameras;if(O.length>0)for(let mt=0,bt=rt.length;mt<bt;mt++){let xt=rt[mt];il(W,O,E,xt)}Xt&&Tt.render(E);for(let mt=0,bt=rt.length;mt<bt;mt++){let xt=rt[mt];nl(m,E,xt,xt.viewport)}}else O.length>0&&il(W,O,E,F),Xt&&Tt.render(E),nl(m,E,F);I!==null&&C===0&&(ut.updateMultisampleRenderTarget(I),ut.updateRenderTargetMipmap(I)),E.isScene===!0&&E.onAfterRender(v,E,F),pt.resetDefaultState(),b=-1,_=null,M.pop(),M.length>0?(d=M[M.length-1],$t===!0&&ct.setGlobalState(v.clippingPlanes,d.state.camera)):d=null,x.pop(),x.length>0?m=x[x.length-1]:m=null};function ga(E,F,G,W){if(E.visible===!1)return;if(E.layers.test(F.layers)){if(E.isGroup)G=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(F);else if(E.isLight)d.pushLight(E),E.castShadow&&d.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||te.intersectsSprite(E)){W&&Ct.setFromMatrixPosition(E.matrixWorld).applyMatrix4(et);let mt=k.update(E),bt=E.material;bt.visible&&m.push(E,mt,bt,G,Ct.z,null)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||te.intersectsObject(E))){let mt=k.update(E),bt=E.material;if(W&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),Ct.copy(E.boundingSphere.center)):(mt.boundingSphere===null&&mt.computeBoundingSphere(),Ct.copy(mt.boundingSphere.center)),Ct.applyMatrix4(E.matrixWorld).applyMatrix4(et)),Array.isArray(bt)){let xt=mt.groups;for(let Dt=0,Nt=xt.length;Dt<Nt;Dt++){let It=xt[Dt],qt=bt[It.materialIndex];qt&&qt.visible&&m.push(E,mt,qt,G,Ct.z,It)}}else bt.visible&&m.push(E,mt,bt,G,Ct.z,null)}}let rt=E.children;for(let mt=0,bt=rt.length;mt<bt;mt++)ga(rt[mt],F,G,W)}function nl(E,F,G,W){let O=E.opaque,rt=E.transmissive,mt=E.transparent;d.setupLightsView(G),$t===!0&&ct.setGlobalState(v.clippingPlanes,G),W&&J.viewport(w.copy(W)),O.length>0&&ur(O,F,G),rt.length>0&&ur(rt,F,G),mt.length>0&&ur(mt,F,G),J.buffers.depth.setTest(!0),J.buffers.depth.setMask(!0),J.buffers.color.setMask(!0),J.setPolygonOffset(!1)}function il(E,F,G,W){if((G.isScene===!0?G.overrideMaterial:null)!==null)return;d.state.transmissionRenderTarget[W.id]===void 0&&(d.state.transmissionRenderTarget[W.id]=new gn(1,1,{generateMipmaps:!0,type:K.has("EXT_color_buffer_half_float")||K.has("EXT_color_buffer_float")?is:un,minFilter:jn,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Kt.workingColorSpace}));let rt=d.state.transmissionRenderTarget[W.id],mt=W.viewport||w;rt.setSize(mt.z*v.transmissionResolutionScale,mt.w*v.transmissionResolutionScale);let bt=v.getRenderTarget(),xt=v.getActiveCubeFace(),Dt=v.getActiveMipmapLevel();v.setRenderTarget(rt),v.getClearColor(H),B=v.getClearAlpha(),B<1&&v.setClearColor(16777215,.5),v.clear(),Xt&&Tt.render(G);let Nt=v.toneMapping;v.toneMapping=Nn;let It=W.viewport;if(W.viewport!==void 0&&(W.viewport=void 0),d.setupLightsView(W),$t===!0&&ct.setGlobalState(v.clippingPlanes,W),ur(E,G,W),ut.updateMultisampleRenderTarget(rt),ut.updateRenderTargetMipmap(rt),K.has("WEBGL_multisampled_render_to_texture")===!1){let qt=!1;for(let ie=0,ge=F.length;ie<ge;ie++){let le=F[ie],re=le.object,Pt=le.geometry,fe=le.material,Qt=le.group;if(fe.side===He&&re.layers.test(W.layers)){let ke=fe.side;fe.side=Ne,fe.needsUpdate=!0,sl(re,G,W,Pt,fe,Qt),fe.side=ke,fe.needsUpdate=!0,qt=!0}}qt===!0&&(ut.updateMultisampleRenderTarget(rt),ut.updateRenderTargetMipmap(rt))}v.setRenderTarget(bt,xt,Dt),v.setClearColor(H,B),It!==void 0&&(W.viewport=It),v.toneMapping=Nt}function ur(E,F,G){let W=F.isScene===!0?F.overrideMaterial:null;for(let O=0,rt=E.length;O<rt;O++){let mt=E[O],bt=mt.object,xt=mt.geometry,Dt=mt.group,Nt=mt.material;Nt.allowOverride===!0&&W!==null&&(Nt=W),bt.layers.test(G.layers)&&sl(bt,F,G,xt,Nt,Dt)}}function sl(E,F,G,W,O,rt){E.onBeforeRender(v,F,G,W,O,rt),E.modelViewMatrix.multiplyMatrices(G.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),O.onBeforeRender(v,F,G,W,E,rt),O.transparent===!0&&O.side===He&&O.forceSinglePass===!1?(O.side=Ne,O.needsUpdate=!0,v.renderBufferDirect(G,F,W,O,E,rt),O.side=Rn,O.needsUpdate=!0,v.renderBufferDirect(G,F,W,O,E,rt),O.side=He):v.renderBufferDirect(G,F,W,O,E,rt),E.onAfterRender(v,F,G,W,O,rt)}function dr(E,F,G){F.isScene!==!0&&(F=St);let W=nt.get(E),O=d.state.lights,rt=d.state.shadowsArray,mt=O.state.version,bt=X.getParameters(E,O.state,rt,F,G),xt=X.getProgramCacheKey(bt),Dt=W.programs;W.environment=E.isMeshStandardMaterial?F.environment:null,W.fog=F.fog,W.envMap=(E.isMeshStandardMaterial?Ft:Ot).get(E.envMap||W.environment),W.envMapRotation=W.environment!==null&&E.envMap===null?F.environmentRotation:E.envMapRotation,Dt===void 0&&(E.addEventListener("dispose",Q),Dt=new Map,W.programs=Dt);let Nt=Dt.get(xt);if(Nt!==void 0){if(W.currentProgram===Nt&&W.lightsStateVersion===mt)return ol(E,bt),Nt}else bt.uniforms=X.getUniforms(E),E.onBeforeCompile(bt,v),Nt=X.acquireProgram(bt,xt),Dt.set(xt,Nt),W.uniforms=bt.uniforms;let It=W.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(It.clippingPlanes=ct.uniform),ol(E,bt),W.needsLights=Mu(E),W.lightsStateVersion=mt,W.needsLights&&(It.ambientLightColor.value=O.state.ambient,It.lightProbe.value=O.state.probe,It.directionalLights.value=O.state.directional,It.directionalLightShadows.value=O.state.directionalShadow,It.spotLights.value=O.state.spot,It.spotLightShadows.value=O.state.spotShadow,It.rectAreaLights.value=O.state.rectArea,It.ltc_1.value=O.state.rectAreaLTC1,It.ltc_2.value=O.state.rectAreaLTC2,It.pointLights.value=O.state.point,It.pointLightShadows.value=O.state.pointShadow,It.hemisphereLights.value=O.state.hemi,It.directionalShadowMap.value=O.state.directionalShadowMap,It.directionalShadowMatrix.value=O.state.directionalShadowMatrix,It.spotShadowMap.value=O.state.spotShadowMap,It.spotLightMatrix.value=O.state.spotLightMatrix,It.spotLightMap.value=O.state.spotLightMap,It.pointShadowMap.value=O.state.pointShadowMap,It.pointShadowMatrix.value=O.state.pointShadowMatrix),W.currentProgram=Nt,W.uniformsList=null,Nt}function rl(E){if(E.uniformsList===null){let F=E.currentProgram.getUniforms();E.uniformsList=cs.seqWithValue(F.seq,E.uniforms)}return E.uniformsList}function ol(E,F){let G=nt.get(E);G.outputColorSpace=F.outputColorSpace,G.batching=F.batching,G.batchingColor=F.batchingColor,G.instancing=F.instancing,G.instancingColor=F.instancingColor,G.instancingMorph=F.instancingMorph,G.skinning=F.skinning,G.morphTargets=F.morphTargets,G.morphNormals=F.morphNormals,G.morphColors=F.morphColors,G.morphTargetsCount=F.morphTargetsCount,G.numClippingPlanes=F.numClippingPlanes,G.numIntersection=F.numClipIntersection,G.vertexAlphas=F.vertexAlphas,G.vertexTangents=F.vertexTangents,G.toneMapping=F.toneMapping}function yu(E,F,G,W,O){F.isScene!==!0&&(F=St),ut.resetTextureUnits();let rt=F.fog,mt=W.isMeshStandardMaterial?F.environment:null,bt=I===null?v.outputColorSpace:I.isXRRenderTarget===!0?I.texture.colorSpace:di,xt=(W.isMeshStandardMaterial?Ft:Ot).get(W.envMap||mt),Dt=W.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,Nt=!!G.attributes.tangent&&(!!W.normalMap||W.anisotropy>0),It=!!G.morphAttributes.position,qt=!!G.morphAttributes.normal,ie=!!G.morphAttributes.color,ge=Nn;W.toneMapped&&(I===null||I.isXRRenderTarget===!0)&&(ge=v.toneMapping);let le=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,re=le!==void 0?le.length:0,Pt=nt.get(W),fe=d.state.lights;if($t===!0&&(Z===!0||E!==_)){let Pe=E===_&&W.id===b;ct.setState(W,E,Pe)}let Qt=!1;W.version===Pt.__version?(Pt.needsLights&&Pt.lightsStateVersion!==fe.state.version||Pt.outputColorSpace!==bt||O.isBatchedMesh&&Pt.batching===!1||!O.isBatchedMesh&&Pt.batching===!0||O.isBatchedMesh&&Pt.batchingColor===!0&&O.colorTexture===null||O.isBatchedMesh&&Pt.batchingColor===!1&&O.colorTexture!==null||O.isInstancedMesh&&Pt.instancing===!1||!O.isInstancedMesh&&Pt.instancing===!0||O.isSkinnedMesh&&Pt.skinning===!1||!O.isSkinnedMesh&&Pt.skinning===!0||O.isInstancedMesh&&Pt.instancingColor===!0&&O.instanceColor===null||O.isInstancedMesh&&Pt.instancingColor===!1&&O.instanceColor!==null||O.isInstancedMesh&&Pt.instancingMorph===!0&&O.morphTexture===null||O.isInstancedMesh&&Pt.instancingMorph===!1&&O.morphTexture!==null||Pt.envMap!==xt||W.fog===!0&&Pt.fog!==rt||Pt.numClippingPlanes!==void 0&&(Pt.numClippingPlanes!==ct.numPlanes||Pt.numIntersection!==ct.numIntersection)||Pt.vertexAlphas!==Dt||Pt.vertexTangents!==Nt||Pt.morphTargets!==It||Pt.morphNormals!==qt||Pt.morphColors!==ie||Pt.toneMapping!==ge||Pt.morphTargetsCount!==re)&&(Qt=!0):(Qt=!0,Pt.__version=W.version);let ke=Pt.currentProgram;Qt===!0&&(ke=dr(W,F,O));let wi=!1,Ve=!1,ms=!1,pe=ke.getUniforms(),Je=Pt.uniforms;if(J.useProgram(ke.program)&&(wi=!0,Ve=!0,ms=!0),W.id!==b&&(b=W.id,Ve=!0),wi||_!==E){J.buffers.depth.getReversed()&&E.reversedDepth!==!0&&(E._reversedDepth=!0,E.updateProjectionMatrix()),pe.setValue(D,"projectionMatrix",E.projectionMatrix),pe.setValue(D,"viewMatrix",E.matrixWorldInverse);let Fe=pe.map.cameraPosition;Fe!==void 0&&Fe.setValue(D,yt.setFromMatrixPosition(E.matrixWorld)),$.logarithmicDepthBuffer&&pe.setValue(D,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(W.isMeshPhongMaterial||W.isMeshToonMaterial||W.isMeshLambertMaterial||W.isMeshBasicMaterial||W.isMeshStandardMaterial||W.isShaderMaterial)&&pe.setValue(D,"isOrthographic",E.isOrthographicCamera===!0),_!==E&&(_=E,Ve=!0,ms=!0)}if(O.isSkinnedMesh){pe.setOptional(D,O,"bindMatrix"),pe.setOptional(D,O,"bindMatrixInverse");let Pe=O.skeleton;Pe&&(Pe.boneTexture===null&&Pe.computeBoneTexture(),pe.setValue(D,"boneTexture",Pe.boneTexture,ut))}O.isBatchedMesh&&(pe.setOptional(D,O,"batchingTexture"),pe.setValue(D,"batchingTexture",O._matricesTexture,ut),pe.setOptional(D,O,"batchingIdTexture"),pe.setValue(D,"batchingIdTexture",O._indirectTexture,ut),pe.setOptional(D,O,"batchingColorTexture"),O._colorsTexture!==null&&pe.setValue(D,"batchingColorTexture",O._colorsTexture,ut));let $e=G.morphAttributes;if(($e.position!==void 0||$e.normal!==void 0||$e.color!==void 0)&&it.update(O,G,ke),(Ve||Pt.receiveShadow!==O.receiveShadow)&&(Pt.receiveShadow=O.receiveShadow,pe.setValue(D,"receiveShadow",O.receiveShadow)),W.isMeshGouraudMaterial&&W.envMap!==null&&(Je.envMap.value=xt,Je.flipEnvMap.value=xt.isCubeTexture&&xt.isRenderTargetTexture===!1?-1:1),W.isMeshStandardMaterial&&W.envMap===null&&F.environment!==null&&(Je.envMapIntensity.value=F.environmentIntensity),Ve&&(pe.setValue(D,"toneMappingExposure",v.toneMappingExposure),Pt.needsLights&&vu(Je,ms),rt&&W.fog===!0&&j.refreshFogUniforms(Je,rt),j.refreshMaterialUniforms(Je,W,V,Y,d.state.transmissionRenderTarget[E.id]),cs.upload(D,rl(Pt),Je,ut)),W.isShaderMaterial&&W.uniformsNeedUpdate===!0&&(cs.upload(D,rl(Pt),Je,ut),W.uniformsNeedUpdate=!1),W.isSpriteMaterial&&pe.setValue(D,"center",O.center),pe.setValue(D,"modelViewMatrix",O.modelViewMatrix),pe.setValue(D,"normalMatrix",O.normalMatrix),pe.setValue(D,"modelMatrix",O.matrixWorld),W.isShaderMaterial||W.isRawShaderMaterial){let Pe=W.uniformsGroups;for(let Fe=0,_a=Pe.length;Fe<_a;Fe++){let ii=Pe[Fe];Vt.update(ii,ke),Vt.bind(ii,ke)}}return ke}function vu(E,F){E.ambientLightColor.needsUpdate=F,E.lightProbe.needsUpdate=F,E.directionalLights.needsUpdate=F,E.directionalLightShadows.needsUpdate=F,E.pointLights.needsUpdate=F,E.pointLightShadows.needsUpdate=F,E.spotLights.needsUpdate=F,E.spotLightShadows.needsUpdate=F,E.rectAreaLights.needsUpdate=F,E.hemisphereLights.needsUpdate=F}function Mu(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return A},this.getActiveMipmapLevel=function(){return C},this.getRenderTarget=function(){return I},this.setRenderTargetTextures=function(E,F,G){let W=nt.get(E);W.__autoAllocateDepthBuffer=E.resolveDepthBuffer===!1,W.__autoAllocateDepthBuffer===!1&&(W.__useRenderToTexture=!1),nt.get(E.texture).__webglTexture=F,nt.get(E.depthTexture).__webglTexture=W.__autoAllocateDepthBuffer?void 0:G,W.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(E,F){let G=nt.get(E);G.__webglFramebuffer=F,G.__useDefaultFramebuffer=F===void 0};let bu=D.createFramebuffer();this.setRenderTarget=function(E,F=0,G=0){I=E,A=F,C=G;let W=!0,O=null,rt=!1,mt=!1;if(E){let xt=nt.get(E);if(xt.__useDefaultFramebuffer!==void 0)J.bindFramebuffer(D.FRAMEBUFFER,null),W=!1;else if(xt.__webglFramebuffer===void 0)ut.setupRenderTarget(E);else if(xt.__hasExternalTextures)ut.rebindTextures(E,nt.get(E.texture).__webglTexture,nt.get(E.depthTexture).__webglTexture);else if(E.depthBuffer){let It=E.depthTexture;if(xt.__boundDepthTexture!==It){if(It!==null&&nt.has(It)&&(E.width!==It.image.width||E.height!==It.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");ut.setupDepthRenderbuffer(E)}}let Dt=E.texture;(Dt.isData3DTexture||Dt.isDataArrayTexture||Dt.isCompressedArrayTexture)&&(mt=!0);let Nt=nt.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(Nt[F])?O=Nt[F][G]:O=Nt[F],rt=!0):E.samples>0&&ut.useMultisampledRTT(E)===!1?O=nt.get(E).__webglMultisampledFramebuffer:Array.isArray(Nt)?O=Nt[G]:O=Nt,w.copy(E.viewport),L.copy(E.scissor),U=E.scissorTest}else w.copy(vt).multiplyScalar(V).floor(),L.copy(Ht).multiplyScalar(V).floor(),U=Jt;if(G!==0&&(O=bu),J.bindFramebuffer(D.FRAMEBUFFER,O)&&W&&J.drawBuffers(E,O),J.viewport(w),J.scissor(L),J.setScissorTest(U),rt){let xt=nt.get(E.texture);D.framebufferTexture2D(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_CUBE_MAP_POSITIVE_X+F,xt.__webglTexture,G)}else if(mt){let xt=F;for(let Dt=0;Dt<E.textures.length;Dt++){let Nt=nt.get(E.textures[Dt]);D.framebufferTextureLayer(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0+Dt,Nt.__webglTexture,G,xt)}}else if(E!==null&&G!==0){let xt=nt.get(E.texture);D.framebufferTexture2D(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,xt.__webglTexture,G)}b=-1},this.readRenderTargetPixels=function(E,F,G,W,O,rt,mt,bt=0){if(!(E&&E.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let xt=nt.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&mt!==void 0&&(xt=xt[mt]),xt){J.bindFramebuffer(D.FRAMEBUFFER,xt);try{let Dt=E.textures[bt],Nt=Dt.format,It=Dt.type;if(!$.textureFormatReadable(Nt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!$.textureTypeReadable(It)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}F>=0&&F<=E.width-W&&G>=0&&G<=E.height-O&&(E.textures.length>1&&D.readBuffer(D.COLOR_ATTACHMENT0+bt),D.readPixels(F,G,W,O,Rt.convert(Nt),Rt.convert(It),rt))}finally{let Dt=I!==null?nt.get(I).__webglFramebuffer:null;J.bindFramebuffer(D.FRAMEBUFFER,Dt)}}},this.readRenderTargetPixelsAsync=async function(E,F,G,W,O,rt,mt,bt=0){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let xt=nt.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&mt!==void 0&&(xt=xt[mt]),xt)if(F>=0&&F<=E.width-W&&G>=0&&G<=E.height-O){J.bindFramebuffer(D.FRAMEBUFFER,xt);let Dt=E.textures[bt],Nt=Dt.format,It=Dt.type;if(!$.textureFormatReadable(Nt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!$.textureTypeReadable(It))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let qt=D.createBuffer();D.bindBuffer(D.PIXEL_PACK_BUFFER,qt),D.bufferData(D.PIXEL_PACK_BUFFER,rt.byteLength,D.STREAM_READ),E.textures.length>1&&D.readBuffer(D.COLOR_ATTACHMENT0+bt),D.readPixels(F,G,W,O,Rt.convert(Nt),Rt.convert(It),0);let ie=I!==null?nt.get(I).__webglFramebuffer:null;J.bindFramebuffer(D.FRAMEBUFFER,ie);let ge=D.fenceSync(D.SYNC_GPU_COMMANDS_COMPLETE,0);return D.flush(),await vh(D,ge,4),D.bindBuffer(D.PIXEL_PACK_BUFFER,qt),D.getBufferSubData(D.PIXEL_PACK_BUFFER,0,rt),D.deleteBuffer(qt),D.deleteSync(ge),rt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(E,F=null,G=0){let W=Math.pow(2,-G),O=Math.floor(E.image.width*W),rt=Math.floor(E.image.height*W),mt=F!==null?F.x:0,bt=F!==null?F.y:0;ut.setTexture2D(E,0),D.copyTexSubImage2D(D.TEXTURE_2D,G,0,0,mt,bt,O,rt),J.unbindTexture()};let Su=D.createFramebuffer(),Eu=D.createFramebuffer();this.copyTextureToTexture=function(E,F,G=null,W=null,O=0,rt=null){rt===null&&(O!==0?(Wi("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),rt=O,O=0):rt=0);let mt,bt,xt,Dt,Nt,It,qt,ie,ge,le=E.isCompressedTexture?E.mipmaps[rt]:E.image;if(G!==null)mt=G.max.x-G.min.x,bt=G.max.y-G.min.y,xt=G.isBox3?G.max.z-G.min.z:1,Dt=G.min.x,Nt=G.min.y,It=G.isBox3?G.min.z:0;else{let $e=Math.pow(2,-O);mt=Math.floor(le.width*$e),bt=Math.floor(le.height*$e),E.isDataArrayTexture?xt=le.depth:E.isData3DTexture?xt=Math.floor(le.depth*$e):xt=1,Dt=0,Nt=0,It=0}W!==null?(qt=W.x,ie=W.y,ge=W.z):(qt=0,ie=0,ge=0);let re=Rt.convert(F.format),Pt=Rt.convert(F.type),fe;F.isData3DTexture?(ut.setTexture3D(F,0),fe=D.TEXTURE_3D):F.isDataArrayTexture||F.isCompressedArrayTexture?(ut.setTexture2DArray(F,0),fe=D.TEXTURE_2D_ARRAY):(ut.setTexture2D(F,0),fe=D.TEXTURE_2D),D.pixelStorei(D.UNPACK_FLIP_Y_WEBGL,F.flipY),D.pixelStorei(D.UNPACK_PREMULTIPLY_ALPHA_WEBGL,F.premultiplyAlpha),D.pixelStorei(D.UNPACK_ALIGNMENT,F.unpackAlignment);let Qt=D.getParameter(D.UNPACK_ROW_LENGTH),ke=D.getParameter(D.UNPACK_IMAGE_HEIGHT),wi=D.getParameter(D.UNPACK_SKIP_PIXELS),Ve=D.getParameter(D.UNPACK_SKIP_ROWS),ms=D.getParameter(D.UNPACK_SKIP_IMAGES);D.pixelStorei(D.UNPACK_ROW_LENGTH,le.width),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,le.height),D.pixelStorei(D.UNPACK_SKIP_PIXELS,Dt),D.pixelStorei(D.UNPACK_SKIP_ROWS,Nt),D.pixelStorei(D.UNPACK_SKIP_IMAGES,It);let pe=E.isDataArrayTexture||E.isData3DTexture,Je=F.isDataArrayTexture||F.isData3DTexture;if(E.isDepthTexture){let $e=nt.get(E),Pe=nt.get(F),Fe=nt.get($e.__renderTarget),_a=nt.get(Pe.__renderTarget);J.bindFramebuffer(D.READ_FRAMEBUFFER,Fe.__webglFramebuffer),J.bindFramebuffer(D.DRAW_FRAMEBUFFER,_a.__webglFramebuffer);for(let ii=0;ii<xt;ii++)pe&&(D.framebufferTextureLayer(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,nt.get(E).__webglTexture,O,It+ii),D.framebufferTextureLayer(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,nt.get(F).__webglTexture,rt,ge+ii)),D.blitFramebuffer(Dt,Nt,mt,bt,qt,ie,mt,bt,D.DEPTH_BUFFER_BIT,D.NEAREST);J.bindFramebuffer(D.READ_FRAMEBUFFER,null),J.bindFramebuffer(D.DRAW_FRAMEBUFFER,null)}else if(O!==0||E.isRenderTargetTexture||nt.has(E)){let $e=nt.get(E),Pe=nt.get(F);J.bindFramebuffer(D.READ_FRAMEBUFFER,Su),J.bindFramebuffer(D.DRAW_FRAMEBUFFER,Eu);for(let Fe=0;Fe<xt;Fe++)pe?D.framebufferTextureLayer(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,$e.__webglTexture,O,It+Fe):D.framebufferTexture2D(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,$e.__webglTexture,O),Je?D.framebufferTextureLayer(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,Pe.__webglTexture,rt,ge+Fe):D.framebufferTexture2D(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,Pe.__webglTexture,rt),O!==0?D.blitFramebuffer(Dt,Nt,mt,bt,qt,ie,mt,bt,D.COLOR_BUFFER_BIT,D.NEAREST):Je?D.copyTexSubImage3D(fe,rt,qt,ie,ge+Fe,Dt,Nt,mt,bt):D.copyTexSubImage2D(fe,rt,qt,ie,Dt,Nt,mt,bt);J.bindFramebuffer(D.READ_FRAMEBUFFER,null),J.bindFramebuffer(D.DRAW_FRAMEBUFFER,null)}else Je?E.isDataTexture||E.isData3DTexture?D.texSubImage3D(fe,rt,qt,ie,ge,mt,bt,xt,re,Pt,le.data):F.isCompressedArrayTexture?D.compressedTexSubImage3D(fe,rt,qt,ie,ge,mt,bt,xt,re,le.data):D.texSubImage3D(fe,rt,qt,ie,ge,mt,bt,xt,re,Pt,le):E.isDataTexture?D.texSubImage2D(D.TEXTURE_2D,rt,qt,ie,mt,bt,re,Pt,le.data):E.isCompressedTexture?D.compressedTexSubImage2D(D.TEXTURE_2D,rt,qt,ie,le.width,le.height,re,le.data):D.texSubImage2D(D.TEXTURE_2D,rt,qt,ie,mt,bt,re,Pt,le);D.pixelStorei(D.UNPACK_ROW_LENGTH,Qt),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,ke),D.pixelStorei(D.UNPACK_SKIP_PIXELS,wi),D.pixelStorei(D.UNPACK_SKIP_ROWS,Ve),D.pixelStorei(D.UNPACK_SKIP_IMAGES,ms),rt===0&&F.generateMipmaps&&D.generateMipmap(fe),J.unbindTexture()},this.initRenderTarget=function(E){nt.get(E).__webglFramebuffer===void 0&&ut.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?ut.setTextureCube(E,0):E.isData3DTexture?ut.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?ut.setTexture2DArray(E,0):ut.setTexture2D(E,0),J.unbindTexture()},this.resetState=function(){A=0,C=0,I=null,J.reset(),pt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return on}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;let e=this.getContext();e.drawingBufferColorSpace=Kt._getDrawingBufferColorSpace(t),e.unpackColorSpace=Kt._getUnpackColorSpace()}};var ha=class{constructor(t){this.scene=t,this.flashes=new Map,this.shells=[],this.cursor=0,this.geometry=new Ye(1,7,5),this.fire=new we({color:"#ffe4a0",transparent:!0,opacity:.95,depthWrite:!1,blending:Un,toneMapped:!1}),this.cases=new Zn(new ce(.009,.009,.045,7),new Ue({color:"#c5a45e",metalness:.7,roughness:.35}),96),this.cases.count=0,this.cases.frustumCulled=!1,t.add(this.cases),this.transform=new _e}update(t,e,n){for(let[r,o]of t){let a=this.flashes.get(r);if(!a){let l=new Lt(this.geometry,this.fire);l.visible=!1,this.scene.add(l),a={mesh:l,shots:o.lastShots,until:0},this.flashes.set(r,a)}if(o.lastShots>a.shots){a.until=n+85;let l=o.gun.localToWorld(new P(.08,.04,.15)),c=new P(1,0,0).applyQuaternion(o.root.quaternion);for(let h=0;h<Math.min(3,o.lastShots-a.shots);h++){let u={p:l.clone(),v:c.clone().multiplyScalar(1.6+Math.random()).add(new P(0,1.7+Math.random(),0)),life:2.4,spin:Math.random()*6,shotgun:o.weapon==="shotgun"};this.shells[this.cursor]=u,this.cursor=(this.cursor+1)%96}}a.shots=o.lastShots,a.mesh.position.copy(o.gun.localToWorld(new P(0,.03,o.weapon==="pistol"?.27:.72))),o.gun.getWorldQuaternion(a.mesh.quaternion),a.mesh.scale.set(o.weapon==="shotgun"?.12:.075,.08,o.weapon==="shotgun"?.37:.22),a.mesh.visible=n<a.until&&o.hp>0}for(let[r,o]of this.flashes)t.has(r)||(this.scene.remove(o.mesh),this.flashes.delete(r));let s=0;for(let r of this.shells)!r||r.life<=0||(r.life-=e,r.v.y-=9.8*e,r.p.addScaledVector(r.v,e),r.p.y<.035&&(r.p.y=.035,r.v.y=Math.abs(r.v.y)*.3,r.v.x*=.6,r.v.z*=.6),r.spin+=e*12,this.transform.position.copy(r.p),this.transform.rotation.set(r.spin,r.spin*.6,r.spin*.3),this.transform.scale.set(r.shotgun?1.7:1,r.shotgun?1.4:1,r.shotgun?1.7:1),this.transform.updateMatrix(),this.cases.setMatrixAt(s,this.transform.matrix),this.cases.setColorAt(s++,new zt(r.shotgun?"#b34b35":"#c5a45e")));this.cases.count=s,this.cases.instanceMatrix.needsUpdate=!0,this.cases.instanceColor&&(this.cases.instanceColor.needsUpdate=!0)}view(t,e){for(let[n,s]of this.flashes)s.mesh.visible=n!==t&&e<s.until}};function Hc(i,t=!1){let e=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),r={},o={},a=i[0].morphTargetsRelative,l=new ve,c=0;for(let h=0;h<i.length;++h){let u=i[h],f=0;if(e!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let p in u.attributes){if(!n.has(p))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+p+'" attribute exists among all geometries, or in none of them.'),null;r[p]===void 0&&(r[p]=[]),r[p].push(u.attributes[p]),f++}if(f!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(a!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let p in u.morphAttributes){if(!s.has(p))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;o[p]===void 0&&(o[p]=[]),o[p].push(u.morphAttributes[p])}if(t){let p;if(e)p=u.index.count;else if(u.attributes.position!==void 0)p=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,p,h),c+=p}}if(e){let h=0,u=[];for(let f=0;f<i.length;++f){let p=i[f].index;for(let g=0;g<p.count;++g)u.push(p.getX(g)+h);h+=i[f].attributes.position.count}l.setIndex(u)}for(let h in r){let u=nu(r[h]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;l.setAttribute(h,u)}for(let h in o){let u=o[h][0].length;if(u===0)break;l.morphAttributes=l.morphAttributes||{},l.morphAttributes[h]=[];for(let f=0;f<u;++f){let p=[];for(let y=0;y<o[h].length;++y)p.push(o[h][y][f]);let g=nu(p);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;l.morphAttributes[h].push(g)}}return l}function nu(i){let t,e,n,s=-1,r=0;for(let c=0;c<i.length;++c){let h=i[c];if(t===void 0&&(t=h.array.constructor),t!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=h.itemSize),e!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=h.gpuType),s!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.count*e}let o=new t(r),a=new Ce(o,e,n),l=0;for(let c=0;c<i.length;++c){let h=i[c];if(h.isInterleavedBufferAttribute){let u=l/e;for(let f=0,p=h.count;f<p;f++)for(let g=0;g<e;g++){let y=h.getComponent(f,g);a.setComponent(f+u,g,y)}}else o.set(h.array,l);l+=h.count*e}return s!==void 0&&(a.gpuType=s),a}var cr=new P;function je(i,t,e,n,s,r){let o=2*Math.PI*s/4,a=Math.max(r-2*s,0),l=Math.PI/4;cr.copy(t),cr[n]=0,cr.normalize();let c=.5*o/(o+a),h=1-cr.angleTo(i)/l;return Math.sign(cr[e])===1?h*c:a/(o+a)+c+c*(1-h)}var us=class i extends de{constructor(t=1,e=1,n=1,s=2,r=.1){let o=s*2+1;if(r=Math.min(t/2,e/2,n/2,r),super(1,1,1,o,o,o),this.type="RoundedBoxGeometry",this.parameters={width:t,height:e,depth:n,segments:s,radius:r},o===1)return;let a=this.toNonIndexed();this.index=null,this.attributes.position=a.attributes.position,this.attributes.normal=a.attributes.normal,this.attributes.uv=a.attributes.uv;let l=new P,c=new P,h=new P(t,e,n).divideScalar(2).subScalar(r),u=this.attributes.position.array,f=this.attributes.normal.array,p=this.attributes.uv.array,g=u.length/6,y=new P,m=.5/o;for(let d=0,x=0;d<u.length;d+=3,x+=2)switch(l.fromArray(u,d),c.copy(l),c.x-=Math.sign(c.x)*m,c.y-=Math.sign(c.y)*m,c.z-=Math.sign(c.z)*m,c.normalize(),u[d+0]=h.x*Math.sign(l.x)+c.x*r,u[d+1]=h.y*Math.sign(l.y)+c.y*r,u[d+2]=h.z*Math.sign(l.z)+c.z*r,f[d+0]=c.x,f[d+1]=c.y,f[d+2]=c.z,Math.floor(d/g)){case 0:y.set(1,0,0),p[x+0]=je(y,c,"z","y",r,n),p[x+1]=1-je(y,c,"y","z",r,e);break;case 1:y.set(-1,0,0),p[x+0]=1-je(y,c,"z","y",r,n),p[x+1]=1-je(y,c,"y","z",r,e);break;case 2:y.set(0,1,0),p[x+0]=1-je(y,c,"x","z",r,t),p[x+1]=je(y,c,"z","x",r,n);break;case 3:y.set(0,-1,0),p[x+0]=1-je(y,c,"x","z",r,t),p[x+1]=1-je(y,c,"z","x",r,n);break;case 4:y.set(0,0,1),p[x+0]=1-je(y,c,"x","y",r,t),p[x+1]=1-je(y,c,"y","x",r,e);break;case 5:y.set(0,0,-1),p[x+0]=je(y,c,"x","y",r,t),p[x+1]=1-je(y,c,"y","x",r,e);break}}static fromJSON(t){return new i(t.width,t.height,t.depth,t.segments,t.radius)}};var fa=new us(1,1,1,1,.065),ds=new ks(.5,1,5,12).scale(1,.5,1);function fs(i){return()=>(i=Math.imul(i,1664525)+1013904223>>>0,i/4294967296)}var ua=i=>Math.max(0,Math.min(255,i));function kc(i,t){let e=fs(t),n=Float32Array.from({length:i*i},()=>e());return(s,r)=>{let o=s*i,a=r*i,l=Math.floor(o),c=Math.floor(a);o-=l,a-=c,o=o*o*(3-2*o),a=a*a*(3-2*a);let h=(u,f)=>n[(f+i)%i*i+(u+i)%i];return fn.lerp(fn.lerp(h(l,c),h(l+1,c),o),fn.lerp(h(l,c+1),h(l+1,c+1),o),a)}}function Ei(i,t=i){let e=document.createElement("canvas");return e.width=i,e.height=t,e}function w0(i){let e=Ei(512),n=e.getContext("2d"),s=n.createImageData(512,512),r=new Float32Array(512*512),o=kc(8,11),a=kc(32,88),l=kc(128,95),c=fs(73);for(let x=0;x<512;x++)for(let M=0;M<512;M++){let v=M/512,T=x/512,A=o(v,T),C=a(v,T),I=l(v,T),b=c()-.5,_=(x*512+M)*4,w=211+(A-.5)*12+(C-.5)*8+b*18,L=.45+C*.008+I*.008,U=0,H=0;if(i==="asphalt")w=153+A*12+b*32,L+=b*.035;else if(i==="brick"){let B=Math.floor(x/48),z=(M+B%2*64)%128,Y=z<2||x%48<2;w=Y?145:200+(A-.5)*16+(C-.5)*9+b*14,U=Y?0:-14,H=Y?0:-23,L=Y?.42:.46+I*.006}else if(i==="rock")w=170+(A-.5)*64+(C-.5)*35+b*20,L=.45+A*.12+C*.05;else if(i==="stone"){let B=Math.floor(x/128),z=(M+B%2*128)%256,Y=z<3||x%128<3;w=Y?85:215+(A-.5)*34+(C-.5)*17+b*16,L=Y?.12:L}else if(i==="metal"||i==="paint"){let B=i==="paint"?Math.pow((Math.cos(v*Math.PI*32)+1)/2,10):0,z=Math.max(0,(A*.65+C*.35-.59)*5);w=221+(A-.5)*15+b*10-B*23-z*35,U=-z*57,H=-z*89,L=.4+C*.025+B*.2,(x%128<2||M%128<2)&&(w-=24,L-=.03)}else if(i==="gunmetal")w=226+b*7+(I-.5)*5,L=.5+b*.001;else if(i==="fabric"||i==="uniform"){let B=(M%4<2?1:-1)*(x%4<2?1:-1);if(w=212+C*17+B*8+b*10,i==="uniform"){let z=A*.65+C*.35;w-=z<.42?55:z>.57?24:0,U+=z<.42?-3:3,H-=z>.57?12:0}L=.45+B*.025}else i==="skin"?(w=238+C*10+b*5,L=.5+I*.01):i==="rubber"&&(w=170+C*20+b*12,L=.5+I*.03);(i==="concrete"||i==="asphalt")&&(Math.abs(Math.sin(v*27+Math.sin(T*18)*1.5)+Math.sin(T*31)*.25)<.008&&A<.6&&(w-=30,L-=.025),A<.22&&(w-=7)),s.data[_]=ua(w),s.data[_+1]=ua(w+U),s.data[_+2]=ua(w+H),s.data[_+3]=255,r[x*512+M]=L}n.putImageData(s,0,0);let h=Ei(512),u=h.getContext("2d"),f=u.createImageData(512,512),p=Ei(512),g=p.getContext("2d"),y=g.createImageData(512,512),m=(x,M)=>r[(M+512)%512*512+(x+512)%512];for(let x=0;x<512;x++)for(let M=0;M<512;M++){let v=(x*512+M)*4,T=(m(M-1,x)-m(M+1,x))*2,A=(m(M,x-1)-m(M,x+1))*2,C=Math.hypot(T,A,1);f.data[v]=(T/C*.5+.5)*255,f.data[v+1]=(A/C*.5+.5)*255,f.data[v+2]=(1/C*.5+.5)*255,f.data[v+3]=255;let I=(i==="gunmetal"?175:i==="metal"?145:i==="paint"?185:i==="skin"?195:235)+(m(M,x)-.5)*60;y.data[v]=y.data[v+1]=y.data[v+2]=ua(I),y.data[v+3]=255}u.putImageData(f,0,0),g.putImageData(y,0,0);let d=(x,M=!1)=>{let v=new Be(x);return v.wrapS=v.wrapT=Cn,M&&(v.colorSpace=ue),v};return{map:d(e,!0),normalMap:d(h),roughnessMap:d(p)}}var da=class{constructor(t){this.cache=new Map,this.textures=new Map,this.anisotropy=Math.min(8,t.capabilities.getMaxAnisotropy()),this.currentQuality=4}get(t,e="#ffffff"){let n=t+e;if(this.cache.has(n))return this.cache.get(n);let s;if(t==="glow")s=new we({color:e,toneMapped:!1});else if(t==="glass")s=new pi({color:e,metalness:.35,roughness:.12,clearcoat:1});else{if(!this.textures.has(t)){let r=w0(t);for(let o of Object.values(r))o.anisotropy=this.currentQuality===6?1:this.currentQuality===4?Math.min(4,this.anisotropy):this.anisotropy;this.textures.set(t,r)}s=new Ue({...this.textures.get(t),color:e,metalness:t==="metal"||t==="gunmetal"?.6:t==="paint"?.18:0,roughness:1,normalScale:new at(t==="skin"?.15:.6,t==="skin"?.15:.6),envMapIntensity:t==="metal"?.8:.25})}return s.userData.persistent=!0,s.userData.surface=t,this.cache.set(n,s),s}quality(t){this.currentQuality=t;for(let e of this.textures.values())for(let n of Object.values(e))n.anisotropy=t===6?1:t===4?Math.min(4,this.anisotropy):this.anisotropy}};function Wc(i){let t=Ei(1024,512),e=t.getContext("2d"),n=i==="observatory",s=e.createLinearGradient(0,0,0,512);s.addColorStop(0,n?"#102037":"#6a8496"),s.addColorStop(.43,n?"#526987":"#b7c8cd"),s.addColorStop(.55,n?"#ad9b92":"#dfccaa"),s.addColorStop(1,"#747f76"),e.fillStyle=s,e.fillRect(0,0,1024,512);let r=fs(11);for(let a=0;a<100;a++){let l=r()*1024,c=80+r()*140,h=20+r()*110,u=5+r()*12;e.save(),e.translate(l,c),e.scale(1,u/h);let f=e.createRadialGradient(0,0,1,0,0,h);f.addColorStop(0,n?"rgba(183,175,167,.12)":"rgba(246,239,223,.17)"),f.addColorStop(1,"rgba(230,228,216,0)"),e.fillStyle=f,e.fillRect(-h,-h,h*2,h*2),e.restore()}if(n){e.fillStyle="#e8eee8";for(let a=0;a<90;a++)e.globalAlpha=r()*.6,e.fillRect(r()*1024,r()*150,1,1);e.globalAlpha=1}let o=new Be(t);return o.mapping=es,o.colorSpace=ue,o}function Xc(){let i=Ei(128),t=i.getContext("2d"),e=t.createRadialGradient(64,64,8,64,64,62);return e.addColorStop(0,"rgba(8,14,11,.6)"),e.addColorStop(.55,"rgba(8,14,11,.27)"),e.addColorStop(1,"rgba(8,14,11,0)"),t.fillStyle=e,t.fillRect(0,0,128,128),new Be(i)}function Vc(i,t,e,n,s,r,o=0,a=1.5,l=!1){let c=Ei(512,256),h=c.getContext("2d"),u=fs(112);h.fillStyle=l?"#c4a25c":"#c6c3ad",h.fillRect(0,0,512,256),h.strokeStyle="#38433b",h.lineWidth=8,h.strokeRect(10,10,492,236),h.fillStyle="#344039",h.textAlign="center",h.font="bold 54px sans-serif",h.fillText(t,256,112,460),h.font="22px sans-serif",h.fillText(e,256,172,460);for(let g=0;g<1600;g++)h.fillStyle=`rgba(50,43,25,${u()*.17})`,h.fillRect(u()*512,u()*256,1+u()*7,1+u()*3);let f=new Be(c);f.colorSpace=ue;let p=new Lt(new Me(a,a*.5),new Ue({map:f,roughness:.9,side:He}));p.position.set(n,s,r),p.rotation.y=o,i.add(p)}var Gc=class{constructor(t,e){this.root=t,this.surfaces=e,this.groups=new Map,this.count=0}add(t,e,n,s,r,o,a){let l=new se,c=new cn;a&&c.setFromEuler(new Xe(...a)),l.compose(new P(s,r,o),c,new P(1,1,1)),t.applyMatrix4(l);let h=this.surfaces.get(e,n),u=this.groups.get(h)||[];u.push(t),this.groups.set(h,u),this.count++}box(t,e,n,s,r,o,a="concrete",l="#adae9e",c=null){let h=new de(s,r,o),u=h.attributes.uv;for(let f=0;f<u.count;f++){let p=Math.floor(f/4);u.setXY(f,u.getX(f)*(p<2?o:s)/2,u.getY(f)*(p<4?r:o)/2)}this.add(h,a,l,t,e,n,c)}tube(t,e,n,s,r,o="metal",a="#87968a",l=null){this.add(new ce(s,s,r,12),o,a,t,e,n,l)}finish(){for(let[t,e]of this.groups){let n=new Lt(Hc(e),t);n.castShadow=t.userData.surface!=="glow",n.receiveShadow=!0,n.name="architecture-"+t.userData.surface,this.root.add(n);for(let s of e)s.dispose()}this.root.userData.detailParts=this.count}};function iu(i,t){let e=new Set,n=[],s=i[0].length,r=(o,a)=>i[a]?.[o]==="1"&&!e.has(a*s+o)&&t(o,a);for(let o=0;o<i.length;o++)for(let a=0;a<s;a++)if(r(a,o)){let l=1,c=1;for(;r(a+l,o);)l++;for(;o+c<i.length&&Array.from({length:l},(h,u)=>r(a+u,o+c)).every(Boolean);)c++;for(let h=o;h<o+c;h++)for(let u=a;u<a+l;u++)e.add(h*s+u);n.push({x:a,y:o,w:l,d:c})}return n}function A0(i,t,e,n){let s=Ei(2048,1024),r=s.getContext("2d"),o=fs(101),a=2048/t,l=1024/e;for(let u=0;u<450;u++){let f=o()*2048,p=o()*1024,g=2+o()*35;r.globalAlpha=.02+o()*.045,r.fillStyle="#202a21",r.beginPath(),r.ellipse(f,p,g,g*.4,0,0,Math.PI*2),r.fill()}r.globalAlpha=.43,r.strokeStyle="#cdbb76",r.lineWidth=3,r.setLineDash([12,8]);for(let u of[5.5,t-5.5])r.beginPath(),r.moveTo(u*a,2*l),r.lineTo(u*a,(e-2)*l),r.stroke();r.setLineDash([]),r.font="bold 44px sans-serif",r.fillStyle="#cac3a4",r.textAlign="center";for(let[u,f]of[[5.5,"01"],[t-5.5,"02"]])for(let p of[9.5,17.5,25.5])r.save(),r.translate(u*a,p*l),r.rotate(Math.PI/2),r.fillText(f,0,0),r.restore();if(n==="railway"){r.strokeStyle="#d3aa54",r.lineWidth=5;for(let u of[14.9,20.1])r.beginPath(),r.moveTo(0,u*l),r.lineTo(2048,u*l),r.stroke()}r.globalCompositeOperation="destination-out",r.globalAlpha=.4;for(let u=0;u<6500;u++)r.fillRect(o()*2048,o()*1024,1+o()*4,1+o()*2);let c=new Be(s);c.colorSpace=ue;let h=new Lt(new Me(t,e),new we({map:c,transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-1}));h.rotation.x=-Math.PI/2,h.position.set(t/2,.007,e/2),i.add(h)}function su(i,t,e,n){let s=t[0].length,r=t.length,o=e.id,a=new Gc(i,n),l=fs(21),c=e.landmark_bounds,h=new Me(s,r),u=h.attributes.uv;for(let d=0;d<u.count;d++)u.setXY(d,u.getX(d)*s/4,u.getY(d)*r/4);let f=new Lt(h,n.get(o==="plaza"?"stone":o==="railway"?"asphalt":"concrete",o==="plaza"?"#b5b09c":o==="observatory"?"#a3afb3":"#b7b9a9"));f.rotation.x=-Math.PI/2,f.position.set(s/2,-.015,r/2),f.receiveShadow=!0,f.name="arena-floor",i.add(f);let p=(d,x)=>d===0||x===0||d===s-1||x===r-1;for(let d of iu(t,p)){let x=d.x+d.w/2,M=d.y+d.d/2;a.box(x,1.9,M,d.w,3.8,d.d),a.box(x,.24,M,d.w+.03,.48,d.d+.03,"concrete","#6e7d71"),a.box(x,3.78,M,d.w+.08,.17,d.d+.08,"metal","#819184")}let g=(d,x)=>c&&d>=c[0]&&x>=c[1]&&d<c[0]+c[2]&&x<c[1]+c[3],y=iu(t,(d,x)=>!p(d,x)&&!(g(d,x)&&o!=="freight")),m=new we({map:Xc(),transparent:!0,depthWrite:!1,opacity:.7});for(let d=0;d<y.length;d++){let x=y[d],M=x.x+x.w/2,v=x.y+x.d/2,T=o==="freight"||o==="railway",A=o==="observatory",C=T?["#829a9c","#b3ae90","#a4866a","#84917c"][d%4]:o==="plaza"?"#c3b69a":A?"#b4c0c1":"#a4a294";if(a.box(M,1.3,v,x.w,2.6,x.d,T?"paint":A?"metal":o==="plaza"?"stone":"concrete",C),a.box(M,.09,v,x.w+.035,.18,x.d+.035,"concrete","#667466"),a.box(M,2.58,v,x.w+.045,.13,x.d+.045,"metal","#849181"),T){for(let b of[x.x+.08,x.x+x.w-.08])for(let _ of[x.y+.08,x.y+x.d-.08])a.box(b,1.35,_,.13,2.5,.13,"metal","#8b9c8c");for(let b of[v-.28,v+.28])a.tube(x.x+.017,1.3,b,.027,2.15),a.box(x.x-.013,1.22,b,.045,.09,.22,"metal","#c9c3a0");x.w>=3&&Vc(i,"C-"+String(d+1).padStart(2,"0"),"GROSS WT 24 000 KG",M,1.8,x.y-.012,Math.PI,1.1)}else if(A||o==="foundry"){a.box(M,1.6,x.y-.02,Math.min(x.w-.2,1.6),.7,.045,"metal","#52666c");for(let b=0;b<7;b++)a.box(M,1.35+b*.08,x.y-.05,Math.min(x.w-.3,1.45),.023,.035,"metal","#9cac9b");x.w>=3&&Vc(i,A?"RESEARCH":"CAUTION",A?"AUTHORIZED PERSONNEL":"HIGH VOLTAGE",M,.65,x.y-.013,Math.PI,1.1,!A)}else a.box(M,.3,v,x.w+.06,.19,x.d+.06,"stone","#c9bea1"),a.box(M,2.42,v,x.w+.09,.2,x.d+.09,"stone","#c9bea1");let I=new Lt(new Me(x.w+2,x.d+2),m);I.rotation.x=-Math.PI/2,I.position.set(M,.002,v),i.add(I)}for(let d=3;d<s-2;d+=6)for(let x of[.5,r-.5])a.box(d,2,x,.32,4,.42,"concrete","#979d8f"),a.tube(d+.22,2.9,x,.055,1.6),a.box(d,3.15,x>.5?r-1.025:1.025,.8,.22,.18,"metal","#3e5052"),a.box(d,3.13,x>.5?r-1.13:1.13,.62,.075,.025,"glow","#e9d9a8");for(let d of[.35,r-.35])a.tube(s/2,3.35,d,.065,s-3,"metal","#a08f71",[0,0,Math.PI/2]),a.tube(s/2,2.93,d,.035,s-3,"metal","#7e9183",[0,0,Math.PI/2]);for(let[d,x]of[[1.02,0],[r-1.02,Math.PI]])Vc(i,o.toUpperCase(),"SECTOR  /  60 x 35 M",s/2,2.15,d,x,4.5);for(let d=0;d<(["freight","foundry","observatory"].includes(o)?0:18);d++){let x=d%4,M=2+Math.floor(d/4)*14,v=7+l()*5,T=7+l()*11,A=x<2?M:x===2?-v/2-4:s+v/2+4,C=x>=2?M*.5:x===0?-v/2-4:r+v/2+4,I=x<2?10+l()*4:v,b=x<2?v:8+l()*4;if(!(o==="railway"&&x>=2&&Math.abs(C-17.5)<b/2+3)){a.box(A,T/2,C,I,T,b,d%2?"brick":"concrete",["#8c9189","#aaac9b","#93958a"][d%3]),a.box(A,T+.12,C,I+.25,.24,b+.25,"metal","#7f8c7e");for(let _=2;_<T-1;_+=2.5)if(x<2)for(let w=A-I/2+1.2;w<A+I/2-.5;w+=2)a.box(w,_,C+(x===0?b/2:-b/2)*1.001,1.03,1.2,.025,"glass","#506972"),a.box(w,_,C+(x===0?b/2:-b/2)*1.003,.07,1.2,.04,"metal","#8c9685");else for(let w=C-b/2+1;w<C+b/2-.5;w+=2)a.box(A+(x===2?I/2:-I/2)*1.001,_,w,.025,1.2,1,"glass","#506972");d%3===0&&(a.tube(A,T+1.3,C,.35,2.6),a.box(A,T+.65,C+1.2,1.5,1.3,1,"metal","#8c9b88")),d%5===0&&a.tube(A,T+4,C,.55,8,"concrete","#a19a86")}}for(let d of[-3,r+3]){let x=[];for(let M=0;M<=24;M++)x.push(new P(-2+M*(s+4)/24,10-Math.sin(M/24*Math.PI)*2,d));i.add(new Lt(new xn(new hn(x),32,.018,4),n.get("rubber","#38443b")))}return A0(i,s,r,o),a.finish(),i.userData.coverFootprints=y,i.userData.graphicsRevision="industrial-1",f}function Ti(i,t=new Set){let e=new Map;for(let n of[...i.children]){if(n.isGroup){Ti(n,t);continue}if(!n.isMesh||t.has(n)||n.material.transparent)continue;n.updateMatrix();let s=n.geometry.clone().applyMatrix4(n.matrix),r=(s.index?"indexed:":"plain:")+Object.keys(s.attributes).sort().join(","),o=e.get(n.material);o||(o=new Map,e.set(n.material,o));let a=o.get(r)||[];a.push(s),o.set(r,a),i.remove(n),n.geometry.userData.shared||n.geometry.dispose()}for(let[n,s]of e)for(let r of s.values()){let o=new Lt(Hc(r),n);o.castShadow=o.receiveShadow=!0,i.add(o);for(let a of r)a.dispose()}}function ru(i,t,e){let n=new Yt;n.name="environment-"+t,i.add(n);let s=(o,a,l,c,h,u)=>{let f=new Lt(o,e.get(a,l));return f.position.set(c,h,u),n.add(f),f},r=(o,a,l,c,h,u,f,p)=>s(new de(c,h,u),f,p,o,a,l);if(t==="freight"){s(new Me(220,180),"glass","#376477",30,-.25,-65).rotation.x=-Math.PI/2,r(30,-.5,17.5,77,1,47,"concrete","#7b827c");let o=new Yt;o.name="cargo-ship",o.position.set(28,0,-31),n.add(o);let a=new Dn;a.moveTo(-35,-5),a.lineTo(29,-5),a.lineTo(39,0),a.lineTo(29,5),a.lineTo(-35,5),a.closePath();let l=new Lt(new Jn(a,{depth:6,bevelEnabled:!0,bevelSize:.4,bevelThickness:.4,bevelSegments:1,steps:1}),e.get("paint","#384b53"));l.rotation.x=-Math.PI/2,o.add(l);let c=(h,u,f,p,g,y,m)=>{let d=new Lt(new de(p,g,y),e.get("paint",m));d.position.set(h,u,f),o.add(d)};c(-26,9,0,12,6,9,"#d1d3c3"),c(-26,13,0,13,2,10,"#dce1d1"),c(-26,13,-5.05,10,1,.08,"#365662"),c(-26,13,5.05,10,1,.08,"#365662"),c(-29,16,0,2,5,2,"#ab7952");for(let h=-16;h<26;h+=7)for(let u=-3;u<=3;u+=3)for(let f=7;f<12;f+=2.5)c(h,f,u,6.5,2.4,2.8,["#a17157","#75857a","#748d99"][Math.abs(h+u)%3]);for(let h of[-8,60])r(h,10,-10,.5,20,.6,"metal","#bb9b55"),r(h+5,20,-10,15,.5,.6,"metal","#bb9b55")}else if(t==="foundry"){r(30,-.5,17.5,140,1,120,"concrete","#4d4841");for(let o=0;o<16;o++){let a=-12+o%8*12,l=o<8?-10:46,c=3+o%3;s(new ce(c,c+.4,.18,13),"glow",o%2?"#ff8d22":"#ffbd42",a,.05,l);let h=s(new ze(c+.2,.28,6,22),"metal","#49443d",a,.05,l);h.rotation.x=Math.PI/2;for(let u=0;u<4;u++)s(new Vs(.7+u%2,0),"metal","#514b43",a+Math.cos(u*1.57)*(c+1),.5,l+Math.sin(u*1.57)*(c+1))}for(let o of[-16,76])for(let a of[0,25])s(new ce(2.5,3.5,18,12),"metal","#675c51",o,9,a),s(new ce(.7,1,27,10),"concrete","#675f52",o+4,13,a+4),r(o,5,a,10,1,8,"metal","#967d52")}else if(t==="observatory"){s(new ce(53,65,16,40),"rock","#566270",30,-8,17.5);for(let o=0;o<22;o++){let a=o*Math.PI*2/22,l=62+o%3*10,c=25+o*7%25,h=30+Math.cos(a)*l,u=17.5+Math.sin(a)*l,f=new Pn(19+o%3*4,c,11,5),p=f.attributes.position;for(let m=0;m<p.count;m++){let d=p.getX(m),x=p.getY(m),M=p.getZ(m),v=1+.14*Math.sin(d*.7+M*.37+o);p.setXYZ(m,d*v+Math.sin(x*.15+o)*2,x,M*v)}f.computeVertexNormals();let g=s(f,"rock",o%2?"#687b89":"#526674",h,c/2-5,u);g.rotation.y=o;let y=s(new Pn(6+o%3,c*.28,7),"rock","#cad8dc",h,c-5-c*.14,u);y.rotation.y=o}for(let o=0;o<38;o++){let a=o*2.399,l=42+o%4*3,c=30+Math.cos(a)*l,h=17.5+Math.sin(a)*l;s(new ce(.18,.24,3,6),"metal","#59584a",c,1,h),s(new Pn(1.6,6,7),"fabric","#354c44",c,3,h)}}return Ti(n),n}function ou(i,t,e,n){let s=new Yt;s.name="machinery",i.add(s);let r={root:s,id:t},o=(a,l,c,h,u,f,p,g)=>{let y=new Lt(new de(u,f,p),e.get("paint",g));return y.position.set(l,c,h),a.add(y),y};if(t==="freight"){let a=new Yt;a.name="crane-load",s.add(a),r.load=a,o(a,0,1.3,0,6,2.6,2,"#b3a078");for(let l=-2.9;l<3;l+=.35)for(let c of[-1.01,1.01])o(a,l,1.3,c,.045,2.5,.03,"#8d836a");for(let l of[-3,3])for(let c of[-1,1])o(a,l,1.3,c,.12,2.6,.12,"#6b766e");r.cables=[];for(let l of[-2.6,2.6]){let c=o(s,30+l,5,8,.035,5,.035,"#303a3b");r.cables.push(c)}r.trolley=o(s,30,11,8,7,.7,2,"#d1ae58");for(let l of[26.5,33.5])o(s,l,11.5,17.5,.4,.7,25,"#c1a056");for(let l of[8,27])for(let c of[26.6,33.4])o(s,c,.025,l,.13,.05,3,"#e8bc5f");Ti(a)}else if(t==="plaza"){r.hand=new Yt,r.hand.name="clock-hazard",r.hand.position.set(30,.95,17.5),s.add(r.hand),o(r.hand,8,0,0,10,.24,.32,"#b79a51"),o(r.hand,12.4,.02,0,1.2,.3,.8,"#d5bc73");for(let a=3.5;a<13;a+=.8)o(r.hand,a,.14,0,.3,.04,.33,"#3a3830");Ti(r.hand)}else if(t==="observatory"){r.dome=new Yt,r.dome.name="rotating-dome",r.dome.position.set(20,3.4,12),n.add(r.dome);for(let a of[...n.children]){if(a===r.dome||!a.isMesh)continue;a.geometry.computeBoundingBox();let l=a.geometry.boundingBox.clone();a.updateMatrix(),l.applyMatrix4(a.matrix),l.min.y>=3.35&&(a.position.sub(r.dome.position),r.dome.add(a))}}return r}function au(i,t,e){if(i&&(i.hand&&(i.hand.rotation.y=-t*Math.PI*2/24),i.dome&&(i.dome.rotation.y=t*.12),i.load)){let n=e||{x:27,y:7,w:6,h:2,lift:0};i.load.position.set(n.x+n.w/2,n.lift,n.y+n.h/2),i.trolley.position.set(n.x+n.w/2,11,n.y+n.h/2),i.cables.forEach((s,r)=>{let o=n.lift+2.6;s.position.set(n.x+n.w/2+(r?2.6:-2.6),(11+o)/2,n.y+n.h/2),s.scale.y=(11-o)/5})}}var R0=fn.lerp,lu=fn.clamp;function Yc(i){return new Qs(i.map(([t,e])=>new at(t,e)),20)}var Zc=Yc([[.045,-.045],[.075,-.025],[.098,.035],[.104,.12],[.091,.185],[.055,.218],[0,.23]]).scale(1,1,.89),qc=Zc.attributes.position;for(let i=0;i<qc.count;i++)qc.getZ(i)>.08&&qc.setZ(i,.08);Zc.computeVertexNormals();var Jc={head:Zc,torso:Yc([[.28,-.5],[.42,-.44],[.47,-.2],[.5,.2],[.45,.41],[.31,.5]]).scale(1,1,.62),limb:Yc([[.22,-.5],[.36,-.46],[.43,-.15],[.5,.3],[.4,.48],[.25,.5]])};for(let i of Object.values(Jc))i.userData.shared=!0;var tn=(i=0,t=0,e=0)=>new P(i,t,e);function cu(i,t,e,n,s){let r=t.clone().sub(i),o=lu(r.length(),.002,e+n-.001);r.normalize();let a=s.clone().sub(r.clone().multiplyScalar(s.dot(r))).normalize(),l=(e*e-n*n+o*o)/(2*o);return i.clone().addScaledVector(r,l).addScaledVector(a,Math.sqrt(Math.max(0,e*e-l*l)))}function pa(i,t,e){i.position.copy(t).add(e).multiplyScalar(.5),i.quaternion.setFromUnitVectors(tn(0,1,0),e.clone().sub(t).normalize()),i.scale.y=t.distanceTo(e)}function hu(i,t,e){let n=new Yt,s=[],r=i.team?"#ed785f":"#58c4ea",o=i.skin==="rogue"?"#45504b":i.skin==="warden"?"#686d57":"#667369",a="#263338",l="#394f54",c="#bf967c",h=(d,x,M,v,T,A,C,I,b,_)=>{let w=t(d,x,M,v,T,A,C,I,b,s);return _&&(s.at(-1).surface=_==="fabric"&&M===o?"uniform":_),w},u=e(n,0,.95,0),f=e(u,0,.64,0),p=[],g=[];h(u,"torso",o,0,.26,0,.48,.5,.44,"fabric"),h(u,"sphere",o,0,-.02,0,.225,.14,.14,"fabric"),h(u,"torso",l,0,.28,.065,.43,.38,.4,"fabric"),h(u,"box","#263338",0,.01,0,.45,.065,.31,"rubber"),h(u,"box","#8b9487",0,.01,.17,.075,.05,.018,"metal"),h(u,"box","#465244",0,.29,-.16,.33,.35,.1,"fabric");for(let d of[-1,1]){h(u,"box",o,d*.17,.32,.155,.045,.4,.033,"fabric");for(let x=0;x<4;x++)h(u,"box","#88947a",d*.14,.15+x*.058,.19,.14,.013,.012,"fabric");h(u,"box",r,d*.205,.47,.04,.014,.065,.13,"fabric"),h(u,"box","#59695b",d*.11,.1,.22,.12,.17,.065,"fabric"),h(u,"box","#5e6b58",d*.228,.06,-.05,.075,.17,.12,"fabric")}h(u,"box","#263338",-.14,.39,.19,.07,.12,.055,"rubber"),h(u,"cylinder","#263338",-.14,.49,.19,.008,.14,.008,"rubber"),h(u,"capsule",c,0,.54,0,.105,.13,.11,"skin"),h(f,"head",c,0,0,.008,1,1,1,"skin"),h(f,"box",c,0,.065,.1,.022,.042,.03,"skin"),h(f,"box","#996e5d",0,.009,.091,.042,.005,.006,"skin");for(let d of[-1,1])h(f,"sphere",c,d*.103,.07,.006,.018,.033,.021,"skin"),h(f,"box","#886d58",d*.039,.104,.09,.027,.007,.006,"skin"),h(f,"sphere","#263338",d*.039,.104,.094,.005,.004,.003,"rubber"),h(f,"box","#695446",d*.039,.12,.091,.034,.007,.006,"fabric"),h(f,"capsule","#3e4941",d*.101,.017,.073,.016,.16,.016,"fabric").rotation.z=d*.35,h(f,"box","#1c2a30",d*.143,.083,0,.04,.102,.075,"rubber"),h(f,"box",l,d*.145,.19,-.005,.028,.07,.075,"metal");h(f,"sphere",o,0,.197,-.018,.146,.099,.137,"fabric"),h(f,"box",l,0,.205,.078,.245,.036,.105,"metal"),h(f,"box","#b6baa2",0,.27,.014,.035,.018,.05,"metal"),h(f,"box","#527b80",0,.15,.12,.2,.035,.018,"glass"),i.skin==="rogue"&&h(f,"sphere",o,0,-.018,.03,.108,.073,.105,"fabric");for(let d of[-1,1]){let x=h(n,"limb",o,0,0,0,.19,1,.2,"fabric"),M=h(n,"limb",o,0,0,0,.15,1,.16,"fabric"),v=h(n,"box",l,0,0,0,.15,.14,.055,"rubber"),T=e(n,0,0,0);h(T,"box","#1c2a30",0,.035,.05,.18,.12,.3,"rubber"),h(T,"box","#596155",0,-.025,.05,.183,.025,.31,"rubber"),h(T,"capsule","#1c2a30",0,.11,-.01,.14,.15,.15,"rubber");for(let b=0;b<3;b++)h(T,"box","#7c816d",0,.105-b*.018,.1,.09,.009,.012,"fabric");p.push({side:d,thigh:x,shin:M,knee:v,boot:T});let A=h(u,"limb",o,0,0,0,.16,1,.17,"fabric"),C=h(u,"limb",o,0,0,0,.125,1,.135,"fabric"),I=e(u,0,0,0);h(I,"sphere","#39493e",0,0,0,.064,.045,.085,"fabric");for(let b=0;b<4;b++)h(I,"capsule","#39493e",-.039+b*.026,-.035,.02,.022,.065,.029,"fabric");h(I,"capsule","#39493e",d*.063,-.012,.035,.026,.06,.032,"fabric").rotation.z=d*.6,g.push({side:d,upper:A,lower:C,hand:I}),h(u,"sphere",o,d*.237,.43,0,.115,.105,.115,"fabric")}let y=e(u,.14,.39,.24),m={};for(let d of["rifle","shotgun","pistol"]){let x=s.length,M=e(y,0,0,0),v=(T,A,C)=>{let I=h(M,"cylinder","#323d41",0,.03,T,C,A,C,"metal");I.rotation.x=Math.PI/2};if(d==="pistol")h(M,"box",a,0,.015,.12,.055,.065,.22,"metal"),h(M,"box",a,0,-.065,.055,.048,.12,.065,"rubber").rotation.x=.16,v(.235,.035,.017);else{h(M,"box",a,0,0,.1,.09,.11,.3,"metal"),h(M,"box",o,0,-.015,-.1,.08,.12,.18,"rubber"),h(M,"box",a,0,-.105,.04,.06,.15,.08,"rubber"),d==="rifle"&&h(M,"box",a,0,-.12,.16,.07,.17,.1,"metal"),v(.45,d==="shotgun"?.49:.42,d==="shotgun"?.026:.019),h(M,"box",d==="shotgun"?"#6e6452":o,0,.01,.3,.08,.085,.18,"rubber");for(let T=0;T<5;T++)h(M,"box",a,0,.07,.1+T*.04,.075,.012,.02,"metal")}h(M,"box","#96ac91",0,.07,.2,.014,.022,.02,"metal");for(let T of s.slice(x))T.weapon=d,T.surface==="metal"&&(T.surface="gunmetal");m[d]=M}return{root:n,body:u,head:f,legs:p,arms:g,gun:y,records:s,gunRecords:m,phase:0,lastX:i.x,lastY:i.y,skin:i.skin,team:i.team,weapon:"rifle",speed:0,dead:0,lastHp:100,lastShots:i.shots||0,shotTime:-1e4,hurtTime:-1e4}}function uu(i,t,e,n){let s=Math.hypot(t.x-i.lastX,t.y-i.lastY);i.lastX=t.x,i.lastY=t.y,s<2&&(i.phase+=s*2.5),t.shots>i.lastShots&&(i.shotTime=n),i.lastShots=t.shots,t.hp<i.lastHp&&(i.hurtTime=n),t.hp<=0&&i.lastHp>0&&(i.dead=n),t.hp>0&&(i.dead=0),i.lastHp=t.hp,i.weapon=t.weapon||"rifle",i.root.position.set(t.x,0,t.y),i.root.rotation.set(0,Math.PI/2-t.yaw,0);let r=1-Math.exp(-e*14);i.speed=R0(i.speed,Math.min(1,Math.hypot(t.vx||0,t.vy||0)/7.2),r);let o=((t.vx||0)*Math.cos(t.yaw)+(t.vy||0)*Math.sin(t.yaw))/7.2,a=(-(t.vx||0)*Math.sin(t.yaw)+(t.vy||0)*Math.cos(t.yaw))/7.2,l=Math.max(0,1-(n-i.hurtTime)/220),c=Math.max(0,1-(n-i.shotTime)/160);i.body.position.y=.95-i.speed*.06+Math.cos(i.phase*2)*.012*i.speed,i.body.rotation.set(-o*.07-(t.pitch||0)*.16+c*.025,Math.sin(i.phase)*i.speed*.025,-a*.055-l*.04),i.head.rotation.x=-(t.pitch||0)*.7,i.head.rotation.y=-i.body.rotation.y;let h=t.weapon==="shotgun"?.7:t.weapon==="pistol"?1.25:1.5,u=t.reload>0?Math.sin((1-t.reload/h)*Math.PI):0;i.gun.rotation.x=-(t.pitch||0)*.65+u*.55-c*.05,i.gun.rotation.z=-u*.28,i.gun.position.z=.24-c*.025;for(let{side:f,thigh:p,shin:g,knee:y,boot:m}of i.legs){let d=i.phase+(f>0?Math.PI:0),x=Math.sin(d),M=Math.max(0,Math.cos(d))*.105*i.speed,v=tn(f*.145-x*a*.22,.038+M,x*o*.38),T=tn(f*.135,.92-i.speed*.06,0),A=v.clone().add(tn(0,.015,-.015)),C=cu(T,A,.455,.455,tn(0,0,1));pa(p,T,C),pa(g,C,A),y.position.copy(C).add(tn(0,0,.073)),m.position.copy(v),m.rotation.x=-Math.max(0,x)*.14*i.speed}for(let{side:f,upper:p,lower:g,hand:y}of i.arms){let m=tn(f*.235,.425,.005),d=t.weapon==="pistol"?tn(.14+f*.027,.32,.3):f>0?tn(.14,.3,.28):tn(.14,.395,.54);f<0&&u>0&&d.set(-.08,.04-u*.16,.34);let x=tn(.14,.39,.24);d.sub(x).applyEuler(i.gun.rotation).add(x);let M=d.clone().sub(m);M.length()>.609&&d.copy(m).add(M.setLength(.609));let v=cu(m,d,.31,.3,tn(f*.8,-.5,-.4));pa(p,m,v),pa(g,v,d),y.position.copy(d),y.rotation.set(-.5,i.gun.rotation.x,f*.15)}if(i.dead){let f=lu((n-i.dead)/550,0,1);i.root.position.y=.24*f,i.root.rotation.z=f*Math.PI/2,i.body.rotation.x=.12}i.root.updateMatrixWorld(!0),i.hp=t.hp}var du=new ce(1,1,1,20);du.userData.shared=!0;function fu(i,t){let e=new Yt,n=new Yt,s=new Yt,r=new Yt;e.name=i,e.add(n,s,r);let o=(y,m,d,x,M,v,T,A,C,I="gunmetal")=>{let b=new Lt(m,t.get(I,d));return b.position.set(x,M,v),b.scale.set(T,A,C),y.add(b),b},a=(y,m,d,x,M,v,T,A,C)=>o(y,fa,m,d,x,M,v,T,A,C),l=(y,m,d,x,M,v,T)=>{let A=o(y,du,m,d,x,M,v,T,v);return A.rotation.x=Math.PI/2,A},c="#27373d",h="#798884",u="#37453d",f;if(i==="pistol"){a(e,c,0,-.035,.015,.07,.075,.22),a(e,u,0,-.115,.07,.064,.17,.085,"rubber").rotation.x=-.23,a(s,"#17272b",0,-.198,.09,.07,.022,.09,"rubber"),a(s,"#65716b",0,-.14,.08,.05,.13,.065),a(n,"#71807b",0,.025,-.015,.078,.075,.235),l(e,"#18272b",0,.023,-.141,.022,.028),l(e,h,0,.023,-.15,.015,.012),a(n,"#26373b",.04,.028,.01,.005,.029,.06),a(n,h,.043,.028,.01,.003,.01,.038);for(let m of[-.04,.04])for(let d=0;d<7;d++)a(n,"#26373b",m,.025,.045+d*.011,.003,.048,.004);for(let m of[-.025,.025])a(n,c,m,.078,.075,.015,.032,.025);a(n,"#b1c7a2",0,.074,-.1,.009,.019,.012),a(e,h,.042,-.017,.072,.008,.012,.04);let y=o(e,new ze(.038,.006,8,20),c,0,-.077,-.018,1,1,1);y.rotation.y=Math.PI/2,a(e,c,0,-.063,-.01,.009,.034,.008).rotation.x=-.3,f=-.168}else{a(e,c,0,0,.01,.115,.135,.33),a(e,u,0,-.045,.285,.09,.14,.26,"rubber"),a(e,"#263633",0,-.055,.405,.1,.16,.04,"rubber"),l(e,h,0,.018,-.42,.027,.57),l(e,c,0,-.047,-.34,.023,.43),l(e,"#19272b",0,.018,-.713,.029,.025),a(n,"#605b49",0,-.026,-.33,.094,.095,.25,"rubber");for(let m=0;m<9;m++)a(n,c,0,-.025,-.44+m*.026,.097,.085,.008,"rubber");a(e,"#15272b",.06,.018,.025,.007,.048,.11),a(e,h,.065,.018,.025,.004,.016,.075),a(e,c,0,-.13,.09,.065,.2,.085,"rubber").rotation.x=-.15;for(let m=0;m<5;m++)a(e,"#7d8979",0,.079,-.12+m*.045,.08,.014,.012);a(e,"#c8d4aa",0,.065,-.65,.012,.04,.018);let y=o(e,new ze(.046,.007,8,20),c,0,-.107,.019,1,1,1);y.rotation.y=Math.PI/2,l(s,"#bb4233",-.03,-.11,-.04,.019,.065),l(s,"#c3a45f",-.03,-.11,-.008,.019,.012),f=-.735}for(let y of[-1,1]){let m=y<0?r:e,d=y<0?-.035:.035,x=y<0?i==="pistol"?.04:-.33:.105;o(m,ds,"#667369",y*.1,-.25,x+.13,.13,.31,.14,"fabric").rotation.z=y*.33,o(m,new Ye(1,16,10),"#3c4b3e",d,-.1,x,.069,.065,.08,"fabric");for(let M=0;M<4;M++)o(m,ds,"#3c4b3e",d-.035+M*.023,-.12,x-.04,.021,.06,.03,"fabric").rotation.x=-.7}let p=new Qn("#ffb861",0,2,.9);p.position.set(0,.02,f),e.add(p);let g=new Lt(new Ye(1,6,4),new we({color:"#ffdea0",transparent:!0,opacity:.8,depthWrite:!1,blending:Un,toneMapped:!1}));return g.position.copy(p.position),g.scale.set(i==="shotgun"?.075:.035,.05,i==="shotgun"?.23:.1),e.add(g),{root:e,moving:n,magazine:s,support:r,light:p,flash:g}}function pu(i,t,e,n){let s=e>=0&&e<600?Math.sin(Math.max(0,(e-80)/520)*Math.PI):0;i.moving.position.z=t==="pistol"?Math.max(0,1-e/105)*.038:s*.12,i.support.position.z=t==="shotgun"?s*.12:0,i.support.position.y=-n*.14,i.magazine.position.y=-n*.17,t==="shotgun"?(i.magazine.visible=n>0,i.magazine.position.set(-n*.09,-n*.17,n*.08),i.support.position.x=-n*.08):i.support.position.set(n*.035,-n*.17,n*.03)}function mu(i,t,e){if(!i||t==="railway")return;i.userData.detailRevision="landmarks-2";let n=0,s=(c,h,u,f,p,g)=>{let y=new Lt(c,e.get(h,u));return y.position.set(f,p,g),i.add(y),n++,y},r=(c,h,u,f,p,g,y="metal",m="#819184")=>s(new de(f,p,g),y,m,c,h,u),o=(c,h,u,f,p,g="#8f9e8a",y=null)=>{let m=s(new ce(f,f,p,16),"metal",g,c,h,u);return y&&m.rotation.set(...y),m},a=(c,h,u=.025,f="#8f9e8a")=>{let p=new P(...c),g=new P(...h),y=o(...p.clone().add(g).multiplyScalar(.5).toArray(),u,p.distanceTo(g),f);return y.quaternion.setFromUnitVectors(new P(0,1,0),g.sub(p).normalize()),y},l=(c,h,u,f,p=.025,g="#819184")=>{let y=s(new ze(f,p,8,48),"metal",g,c,h,u);return y.rotation.x=Math.PI/2,y};if(t==="freight"){for(let c of[11.55,12.45]){r(20,8.2,c,13,.16,.18,"paint","#b49d56"),r(20,7.63,c,13,.13,.18,"paint","#b49d56");for(let h=0;h<13;h++)a([13.7+h,7.68,c],[14.7+h,8.15,c],.045,"#af9654");for(let h of[19,21]){r(h,4,c,.14,7.7,.13,"metal","#6e7566");for(let u=.5;u<7.6;u+=.4)r(h,u,c,.52,.035,.08,"metal","#a39366")}}r(20,8.55,12,3.5,.12,1.8,"metal","#5f6c64");for(let c of[11.2,12.8]){a([18.3,9.05,c],[21.7,9.05,c]);for(let h=18.3;h<=21.8;h+=.85)a([h,8.55,c],[h,9.05,c])}r(18.85,7.6,12.85,1.15,1.3,.85,"paint","#647f7e");for(let c of[12.4,13.3])r(18.85,7.8,c,.92,.65,.025,"glass","#536c70");r(18.85,8.3,12.85,1.3,.12,1,"metal","#7b8e80"),o(20.8,7.4,12,.32,1.15,"#3d4b48",[Math.PI/2,0,0]);for(let c of[11.85,12.15])a([24,7.9,c],[24,3.7,c],.016,"#3e4640");for(let c of[11.65,12.35])o(24,3.8,c,.25,.065,"#8b865a",[Math.PI/2,0,0]);for(let c of[19,21])r(c,.15,12,.8,.3,1.7,"metal","#6c7567")}else if(t==="foundry"){for(let c=.6;c<4.6;c+=.52)r(20,c,10.12,3.65,.08,.07,"metal","#4e4a42"),r(20,c,13.88,3.65,.08,.07,"metal","#4e4a42");for(let c=3.8;c<9.6;c+=.48)l(20,c,12,.735,.025,"#847864");for(let c of[18.25,21.75]){for(let h=.5;h<5.2;h+=.5)l(c,h,12,.195,.025,"#a29375");r(c,2.7,10.28,.2,4.6,.15,"metal","#5b6257");for(let h=.5;h<4.9;h+=.3)r(c,h,10.16,.48,.035,.05,"metal","#8d927a")}for(let c of[10.15,13.85]){a([18.12,5.65,c],[21.88,5.65,c]),a([18.12,5.18,c],[21.88,5.18,c]);for(let h=18.12;h<22;h+=.75)a([h,4.8,c],[h,5.65,c])}o(20,4.2,12,1.4,.22,"#6f6d5c"),r(20,.22,10,3.3,.1,.24,"metal","#bfb284");for(let c=18.6;c<21.6;c+=.22){let h=r(c,.28,10,.11,.02,.2,"paint","#b99d58");h.rotation.y=.35}for(let c of[10.08,13.92])for(let h of[18.55,21.45])o(h,2,c,.07,1.4,"#5d5b4e");r(18.02,1.4,12,.05,1.5,.9,"metal","#5d6860");for(let c=0;c<6;c++)r(17.99,1+c*.14,12,.02,.035,.7,"metal","#959984")}else if(t==="plaza"){for(let c=.5;c<5.4;c+=.42)for(let h of[10.49,13.51])r(20,c,h,3,.014,.012,"stone","#8b8674");for(let c of[18.59,21.41])for(let h of[10.59,13.41])r(c,2.8,h,.18,5.1,.18,"stone","#d2c8ad");for(let c of[.42,5.25,5.7,8.42])r(20,c,12,c>6?2.65:3.35,.13,c>6?2.65:3.35,"stone","#c7bda3");for(let c of[10.48,13.52]){r(20,2.4,c,.77,1.5,.028,"glass","#465b59");for(let h of[19.56,20.44])r(h,2.4,c,.1,1.7,.13,"stone","#d0c4a7");r(20,3.22,c,1.03,.13,.16,"stone","#d0c4a7"),r(20,1.59,c,1.03,.13,.18,"stone","#d0c4a7"),r(20,2.4,c,.05,1.5,.05,"metal","#767c69")}for(let c=0;c<4;c++){let h=c*Math.PI/2,u=new P(Math.sin(h),0,Math.cos(h));a([20,10.3,12],[20+u.x*1.55,8.35,12+u.z*1.55],.024,"#8c9c81")}for(let c of[10.72,13.28])r(20,7.2,c,2.4,.035,.04,"metal","#ad9e73")}else if(t==="observatory"){for(let u=0;u<16;u++){let f=u*Math.PI/8,p=[];for(let g=0;g<=16;g++){let y=g/16*Math.PI/2;p.push(new P(20+Math.cos(f)*1.858*Math.sin(y),3.4+1.858*Math.cos(y),12+Math.sin(f)*1.858*Math.sin(y)))}s(new xn(new hn(p),20,.014,5),"metal","#839aa3",0,0,0)}l(20,3.42,12,1.87,.045,"#788d97"),l(20,3.55,12,1.86,.03,"#8b9da3");let c=r(20,4.66,12.8,.67,1.25,.08,"rubber","#1c303b");c.rotation.x=-.55;for(let u of[19.6,20.4]){let f=r(u,4.69,12.79,.07,1.34,.09,"metal","#bbc8c9");f.rotation.x=-.55}l(21.02,6.4,12,.45,.045,"#718897").rotation.set(0,0,-.7),o(20.2,4.7,12,.59,.2,"#6b8292",[0,0,-.7]),r(20,1.17,10.08,.85,2.1,.045,"paint","#6c8590"),r(20.3,1.18,10.04,.04,.16,.06,"metal","#b8c5b9");for(let u of[18.42,21.58]){r(u,1.2,10.07,.38,.55,.04,"metal","#627e8b");for(let f=0;f<5;f++)r(u,1+f*.1,10.03,.32,.025,.035,"metal","#a8b9bd")}for(let u of[10.15,13.85])for(let f=18.15;f<22;f+=.74)a([f,3,u],[f,3.62,u],.017,"#809aa5");for(let u of[10.15,13.85])a([18.15,3.62,u],[21.85,3.62,u],.02,"#809aa5")}i.userData.detailParts=n}function C0(i){if(i.dieselFinish)return i.dieselFinish;let t=93,e=()=>(t=Math.imul(t,1664525)+1013904223>>>0,t/4294967296),n=document.createElement("canvas");n.width=n.height=512;let s=n.getContext("2d"),r=s.createImageData(512,512);for(let l=0;l<r.data.length;l+=4){let c=224+(e()-.5)*11;r.data[l]=r.data[l+1]=r.data[l+2]=c,r.data[l+3]=255}s.putImageData(r,0,0);for(let l=0;l<550;l++){s.strokeStyle=`rgba(75,77,67,${.015+e()*.055})`;let c=e()*512,h=e()*512;s.beginPath(),s.moveTo(c,h),s.lineTo(c+e()*24,h+e()*2),s.stroke()}let o=new Be(n);o.colorSpace=ue,o.wrapS=o.wrapT=Cn,o.anisotropy=4;let a={map:o};return i.dieselFinish=a,a}function en(i,t,e,n=.7,s=.35){let r="diesel:"+t;if(i.cache.has(r))return i.cache.get(r);let o=new Ue({...C0(i),color:e,roughness:n,metalness:s,envMapIntensity:.8});return o.userData.persistent=!0,o.userData.surface="locomotive",i.cache.set(r,o),o}function gu(i,t,e,n,s,r,o,a=0){let l=document.createElement("canvas");l.width=512,l.height=128;let c=l.getContext("2d");c.clearRect(0,0,512,128),c.fillStyle="#e8e5d4",c.font="500 76px monospace",c.textAlign="center",c.fillText(t,256,88,490);let h=new Be(l);h.colorSpace=ue;let u=new Lt(new Me(r,o),new Ue({map:h,transparent:!0,depthWrite:!1,roughness:.85,polygonOffset:!0,polygonOffsetFactor:-1}));u.position.set(e,n,s),u.rotation.y=a,i.add(u)}function I0(){let i=document.createElement("canvas");i.width=512,i.height=128;let t=i.getContext("2d");t.fillStyle="#d2b75e",t.fillRect(0,0,512,128),t.fillStyle="#303631";for(let n=-128;n<640;n+=96)t.beginPath(),t.moveTo(n,0),t.lineTo(n+47,0),t.lineTo(n-81,128),t.lineTo(n-128,128),t.closePath(),t.fill();let e=new Be(i);return e.colorSpace=ue,new Ue({map:e,roughness:.78,metalness:.25})}function _u(i){let t=new Yt;t.name="diesel-locomotive";let e=[],n=[],s=en(i,"body","#405a5b",.67,.32),r=en(i,"cream","#b9b6a1",.7,.25),o=en(i,"frame","#353f3c",.82,.5),a=en(i,"cast","#414b47",.82,.55),l=en(i,"steel","#a3aaa0",.32,.85),c=en(i,"dark","#222b29",.88,.25),h=en(i,"safety","#d9bc6b",.64,.35),u="diesel:glass";if(!i.cache.has(u)){let _=new pi({color:"#385962",roughness:.13,metalness:.12,clearcoat:1,transparent:!0,opacity:.76,depthWrite:!1,side:He});_.userData.persistent=!0,i.cache.set(u,_)}let f=i.cache.get(u),p="diesel:headlight";if(!i.cache.has(p)){let _=new Ue({color:"#fff1cc",emissive:"#e9c788",emissiveIntensity:.65,roughness:.15,metalness:.1});_.userData.persistent=!0,i.cache.set(p,_)}let g=i.cache.get(p),y=en(i,"tail-lamp","#aa5240",.18,.1);y.emissive.set("#7c2012"),y.emissiveIntensity=.35;function m(_,w,L,U,H,B){let z=new Lt(w,L);return z.position.set(U,H,B),z.castShadow=z.receiveShadow=!0,_.add(z),z}function d(_,w,L,U,H,B,z,Y,V=0){return m(_,V?new us(B,z,Y,1,V):new de(B,z,Y),w,L,U,H)}function x(_,w,L,U,H,B,z,Y="y",V=16){let lt=m(_,new ce(B,B,z,V),w,L,U,H);return Y==="z"&&(lt.rotation.x=Math.PI/2),Y==="x"&&(lt.rotation.z=Math.PI/2),lt}function M(_,w,L,U,H=.025){let B=new P(...L),z=new P(...U),Y=z.clone().sub(B),V=m(_,new ce(H,H,Y.length(),8),w,...B.clone().add(z).multiplyScalar(.5).toArray());return V.quaternion.setFromUnitVectors(new P(0,1,0),Y.normalize()),V}function v(_,w,L,U,H,B,z=.025,Y="z"){let V=m(_,new ze(B,z,6,24),w,L,U,H);return Y==="y"&&(V.rotation.x=Math.PI/2),Y==="x"&&(V.rotation.y=Math.PI/2),V}d(t,o,0,1.18,0,10.7,.25,3.45,.025);for(let _ of[-1.35,1.35])d(t,o,0,.99,_,10,.26,.16);d(t,o,0,.67,0,3,.68,1.72,.08);for(let _ of[-1.24,1.24])d(t,l,_,.66,0,.07,.61,1.76);x(t,l,.8,.85,1.03,.1,.22,"z"),d(t,c,-.65,.49,0,1.2,.18,1.4,.03);for(let _ of[-3.12,3.12]){let w=new Yt;w.position.set(_,.14,0),w.name="bogie",t.add(w),d(w,a,0,.68,0,2.5,.3,2.12,.06),d(w,c,0,.82,0,1.45,.12,1.45);for(let L of[-1,1]){d(w,a,0,.64,L*1.04,2.48,.28,.17,.045);for(let U of[-.76,.76]){d(w,a,U,.6,L*1.06,.4,.4,.22,.045),x(w,l,U,.58,L*1.2,.11,.055,"z");let H=[];for(let B=0;B<=32;B++){let z=B/32*Math.PI*6;H.push(new P(Math.cos(z)*.105,B/32*.33,Math.sin(z)*.105))}m(w,new xn(new hn(H),28,.024,5,!1),l,U,.77,L*.99)}x(w,a,0,.53,L*1.13,.085,.7,"x"),M(w,l,[-1.1,.4,L*.97],[1.1,.4,L*.97],.027)}for(let L of[-.76,.76]){x(w,l,L,.56,0,.085,1.74,"z"),d(w,a,L,.66,0,.42,.3,.84,.035);for(let U of[-1,1]){let H=new Yt;H.position.set(L,.56,U*.82),w.add(H),e.push(H),x(H,l,0,0,0,.48,.18,"z",28),x(H,a,0,0,U*.1,.36,.035,"z",24),x(H,l,0,0,U*.14,.15,.1,"z",20),v(H,l,0,0,U*.125,.38,.022),x(H,l,0,0,-U*.1,.495,.028,"z",28);for(let B=0;B<6;B++){let z=B*Math.PI/3;x(H,l,Math.cos(z)*.23,Math.sin(z)*.23,U*.13,.023,.025,"z",6)}d(w,c,L+.38,.57,U*.78,.09,.27,.18,.015)}}}for(let _ of[-1,1]){d(t,a,0,1.36,_*1.58,10.65,.065,.5,.012);for(let w=-5;w<5.1;w+=.24)d(t,l,w,1.398,_*1.58,.028,.012,.42)}let T=new Dn;T.moveTo(-1.22,0),T.lineTo(1.22,0),T.lineTo(1.22,1.3),T.lineTo(.98,1.55),T.lineTo(-.98,1.55),T.lineTo(-1.22,1.3),T.closePath();let A=new Jn(T,{depth:6.85,bevelEnabled:!0,bevelSize:.025,bevelThickness:.025,bevelSegments:1,steps:1});A.rotateY(Math.PI/2),m(t,A,s,-2.02,1.46,0),d(t,s,5.03,2.15,0,.38,1.35,2.38,.035),d(t,r,5.233,1.98,0,.025,.17,2.3),d(t,s,-4.94,1.89,0,.75,.91,2.63,.04),d(t,r,-4.94,2.37,0,.79,.1,2.66,.025);for(let _ of[-1,1]){d(t,r,1.38,1.98,_*1.235,6.78,.17,.024);for(let w=0;w<5;w++){let L=-1.43+w*.71;d(t,s,L,2.32,_*1.25,.65,1.12,.025,.008);for(let U of[L-.325,L+.325])d(t,a,U,2.3,_*1.27,.012,1.14,.012);M(t,l,[L+.2,2.16,_*1.3],[L+.2,2.39,_*1.3],.016);for(let U of[1.86,2.73])d(t,l,L-.24,U,_*1.28,.045,.055,.025,.005)}d(t,c,3.49,2.29,_*1.254,1.82,1.14,.035);for(let w=0;w<22;w++)d(t,a,2.64+w*.081,2.29,_*1.29,.029,1.08,.055);for(let w of[1.72,2.86])d(t,l,3.49,w,_*1.28,1.9,.035,.04);gu(t,"CF 040",1,2.82,_*1.282,1.23,.28,_<0?Math.PI:0)}d(t,s,-3.25,2.1,0,2.78,1.34,3.02,.045),d(t,r,-3.25,2.88,0,2.81,.22,3.05,.025);let C=new Dn;C.moveTo(-4.76,4.02),C.lineTo(-4.56,4.3),C.lineTo(-1.98,4.3),C.lineTo(-1.75,4.02),C.closePath();let I=new Jn(C,{depth:3.23,bevelEnabled:!0,bevelSize:.035,bevelThickness:.025,bevelSegments:1});m(t,I,r,0,0,-1.615);for(let _ of[-1,1]){for(let L of[-4.55,-3.55,-1.96])d(t,r,L,3.51,_*1.49,.085,1.05,.11,.012);d(t,r,-3.25,3,_*1.51,2.66,.075,.11),d(t,r,-3.25,4,_*1.51,2.66,.065,.11);let w=m(t,new Me(2.48,.88),f,-3.25,3.5,_*1.518);_<0&&(w.rotation.y=Math.PI),d(t,a,-3.26,3.5,_*1.533,.035,.88,.025),d(t,a,-4.05,2.16,_*1.524,.015,1.25,.015),d(t,a,-2.53,2.16,_*1.524,.015,1.25,.015),M(t,l,[-2.75,2.26,_*1.57],[-2.75,2.5,_*1.57],.022),gu(t,"040",-3.25,2.37,_*1.55,.7,.25,_<0?Math.PI:0),d(t,c,-3.36,2.72,_*.65,.64,.16,.59,.045),d(t,c,-3.6,3.04,_*.65,.16,.63,.6,.045),x(t,l,-3.36,2.38,_*.65,.045,.6),d(t,a,-2.28,2.97,_*.56,.38,.34,.82,.025),M(t,r,[-3,3.91,_*1.62],[-3,4,_*1.94],.025),d(t,c,-3,3.94,_*1.9,.24,.3,.065,.025)}for(let _ of[-1,1]){let w=new Yt;w.position.set(_>0?-1.91:-4.61,3.5,0),w.rotation.z=_>0?.18:-.07,t.add(w);for(let L of[-1,1]){let U=L*.71;for(let B of[U-.64,U+.64])d(w,c,0,0,B,.08,1.02,.045,.008);for(let B of[-.49,.49])d(w,c,0,B,U,.08,.055,1.32,.008);let H=m(w,new Me(1.24,.91),f,_*.045,0,U);H.rotation.y=_>0?Math.PI/2:-Math.PI/2,M(w,c,[_*.075,-.43,U-.25],[_*.075,.25,U+.2],.012),M(w,c,[_*.085,.12,U+.09],[_*.085,.38,U+.33],.018)}d(w,r,0,0,0,.11,1.03,.1,.012)}d(t,c,-3,4.36,0,.78,.12,.62,.025),x(t,l,-3.6,4.58,0,.025,.48),d(t,r,-3.6,4.83,0,.05,.025,.05);for(let _ of[3.12,4.18]){x(t,c,_,3.065,0,.47,.07,"y",28),v(t,l,_,3.12,0,.46,.025,"y");let w=new Yt;w.position.set(_,3.125,0),t.add(w),n.push(w),x(w,l,0,0,0,.105,.07,"y");for(let L=0;L<7;L++){let U=L*Math.PI*2/7,H=d(w,a,Math.cos(U)*.25,0,Math.sin(U)*.25,.4,.025,.12,.012);H.rotation.y=-U+.22}for(let L of[-.3,-.15,0,.15,.3])M(t,a,[_-.39,3.17,L],[_+.39,3.17,L],.012)}for(let _ of[-.35,.35])x(t,o,-.18,3.26,_,.105,.43),v(t,l,-.18,3.48,_,.105,.014,"y");for(let _ of[-1,1]){for(let w of[-4.85,-3.6,-2.4,-1.2,0,1.2,2.4,3.6,4.85])M(t,h,[w,1.42,_*1.82],[w,2.24,_*1.82],.025);for(let w of[1.83,2.24])M(t,h,[-4.85,w,_*1.82],[4.85,w,_*1.82],.025);for(let w of[-1,1]){for(let L=0;L<4;L++)d(t,a,w*(5.31-L*.055),.31+L*.27,_*1.78,.48,.065,.42,.01);M(t,h,[w*5.35,.57,_*1.9],[w*4.85,2.24,_*1.82],.028),x(t,o,w*5.3,2.52,_*.67,.18,.12,"x",24),x(t,w>0?g:y,w*5.38,2.52,_*.67,.135,.025,"x",24)}}let b=I0();for(let _ of[-1,1]){d(t,o,_*5.31,1.09,0,.23,.42,3.82,.025);let w=m(t,new Me(3.7,.34),b,_*5.435,1.09,0);w.rotation.y=_>0?Math.PI/2:-Math.PI/2;for(let U of[-1.05,1.05])x(t,o,_*5.56,.94,U,.09,.28,"x"),x(t,l,_*5.73,.94,U,.2,.07,"x",24);d(t,a,_*5.69,.86,0,.48,.28,.28,.035),d(t,l,_*5.94,.87,.08,.1,.22,.27,.025),x(t,l,_*5.91,1,0,.034,.3),d(t,a,_*5.96,.86,-.12,.08,.13,.16,.018);let L=[[_*5.42,1.03,.47],[_*5.57,.6,.51],[_*5.73,.43,.45],[_*5.79,.65,.35]].map(U=>new P(...U));m(t,new xn(new hn(L),16,.035,7),c,0,0,0),d(t,h,_*5.45,1.09,.48,.045,.1,.11,.012);for(let U of[-.39,.39])x(t,o,_*5.31,1.84,U,.095,.08,"x");if(_>0)for(let U of[-1,1]){let H=[5.81,.22,0,5.48,.22,U*1.62,5.45,.84,U*1.62,5.76,.84,0],B=new ve;B.setAttribute("position",new Zt(H,3)),B.setIndex(U>0?[0,2,1,0,3,2]:[0,1,2,0,2,3]),B.computeVertexNormals();let z=m(t,B,o,0,0,0);z.material=o,M(t,l,[5.81,.22,0],[5.48,.22,U*1.62],.025)}}return t.userData.model="compact-diesel-shunter",t.userData.axles=4,t.userData.nominalEnvelope=[12,4,4.86],{root:t,wheels:e,fans:n}}function xu(i,t,e){let n=en(e,"timber","#625e4c",.94,.02),s=en(e,"rail","#9ba49a",.3,.85),r=en(e,"rail-web","#606c64",.66,.75),o=en(e,"rail-clips","#3e4942",.8,.6),a=e.cache.get("diesel:ballast");if(!a){let h=document.createElement("canvas");h.width=h.height=512;let u=h.getContext("2d");u.fillStyle="#76776b",u.fillRect(0,0,512,512);let f=71,p=()=>(f=Math.imul(f,1664525)+1013904223>>>0,f/4294967296);for(let y=0;y<6e3;y++){let m=Math.floor(65+p()*91);u.fillStyle=`rgb(${m},${m+3},${m-6})`,u.beginPath(),u.ellipse(p()*512,p()*512,1+p()*4,1+p()*3,p()*6.28,0,6.28),u.fill()}let g=new Be(h);g.wrapS=g.wrapT=Cn,g.repeat.set(t/3.5,1),g.colorSpace=ue,g.anisotropy=4,a=new Ue({map:g,roughness:1,metalness:0}),a.userData.persistent=!0,e.cache.set("diesel:ballast",a)}let l=new Lt(new Me(t,3.6),a);l.rotation.x=-Math.PI/2,l.position.set(20,.009,12),l.receiveShadow=!0,i.add(l);let c=(h,u,f,p,g,y,m)=>{let d=new Lt(new de(g,y,m),h);return d.position.set(u,f,p),d.castShadow=d.receiveShadow=!0,i.add(d),d};for(let h of[11.28,12.72])c(r,20,.095,h,t,.03,.16),c(r,20,.15,h,t,.08,.035),c(s,20,.205,h,t,.03,.075);for(let h=20-t/2+.25;h<20+t/2;h+=.58){c(n,h,.04,12,.22,.08,2.6);for(let u of[11.28,12.72]){c(o,h,.092,u,.28,.025,.29);for(let f of[-1,1]){c(o,h,.128,u+f*.104,.12,.04,.04);let p=new Lt(new ce(.023,.023,.022,6),s);p.position.set(h,.116,u+f*.115),i.add(p)}}}}var ps,Ky=Math.PI*2,$c=(i,t,e)=>i+(t-i)*e,xe=fa,Kc=new Ye(1,20,14),Qc=new ce(1,1,1,16),jc={box:xe,sphere:Kc,cylinder:Qc,capsule:ds,...Jc};for(let i of Object.values(jc))i.userData.shared=!0;var lr=new _e,P0=new zt,ma=class{constructor(t,e,n,s){this.mesh=new Zn(e,s,n),this.mesh.count=0,this.items=[],this.mesh.instanceMatrix.setUsage(gc),this.mesh.frustumCulled=!1,this.mesh.castShadow=!1,this.mesh.receiveShadow=!0,t.add(this.mesh)}add(t,e){let n=this.mesh.count++;if(n>=this.mesh.instanceMatrix.count)throw Error("Character instance buffer full");this.mesh.setMatrixAt(n,t),this.mesh.setColorAt(n,P0.set(e))}commit(){this.mesh.instanceMatrix.needsUpdate=!0,this.mesh.instanceColor&&(this.mesh.instanceColor.needsUpdate=!0)}};function hr(i){return ps.get("metal",i)}function D0(i,t,e,n,s,r,o,a,l,c){let h=new _e;h.position.set(n,s,r),h.scale.set(o,a,l),i.add(h);let u=e==="#bf967c"?"skin":["#1c2a30","#323d41","#263338","#394f54"].includes(e)?"metal":"fabric";return c.push({node:h,geometry:t,tint:e,surface:u}),h}function L0(i,t,e,n){let s=new Yt;return s.position.set(t,e,n),i.add(s),s}function U0(i){return hu(i,D0,L0)}var tl=class{constructor(t){this.canvas=t,this.renderer=new ca({canvas:t,alpha:!1,antialias:!1,powerPreference:"high-performance"}),this.renderer.outputColorSpace=ue,this.renderer.toneMapping=Mo,this.renderer.toneMappingExposure=1.1,this.renderer.autoClear=!1,this.renderer.shadowMap.type=fo,this.renderer.shadowMap.autoUpdate=!1,this.surfaces=ps=new da(this.renderer),this.scene=new Yi,this.scene.fog=new Bs("#b6beb7",.009),this.ambient=new ji("#c7d8e1","#687562",1.9),this.scene.add(this.ambient),this.sun=new ts("#ffe0b0",3),this.sun.position.set(10,45,4),this.sun.target.position.set(30,0,17.5),this.scene.add(this.sun,this.sun.target),this.sun.castShadow=!0,Object.assign(this.sun.shadow.camera,{left:-43,right:43,top:34,bottom:-34,near:.5,far:120}),this.sun.shadow.bias=-12e-5,this.sun.shadow.normalBias=.04,this.sun.shadow.radius=2,this.camera=new Te(60,1,.045,190),this.actors=new Map,this.mapKey="",this.staticRoot=new Yt,this.scene.add(this.staticRoot),this.batches={},this.skies=new Map,this.weaponScene=new Yi,this.weaponScene.add(new ji("#dfebee","#68775c",2.2));let e=new ts("#ffe3b8",2.2);e.position.set(-2,4,3),this.weaponScene.add(e),this.weaponCamera=new Te(58,1,.01,10),this.weapon=new Yt,this.weaponScene.add(this.weapon),this.createRifle(),this.weaponModels={rifle:{root:this.weapon,flash:this.flash,light:this.muzzleLight}};for(let s of["shotgun","pistol"]){let r=fu(s,this.surfaces);this.weaponModels[s]=r,r.root.visible=!1,this.weaponScene.add(r.root)}this.prepareReflections(),this.localLights=[],this.quality=0,this.lastShadow=-1e3,this.shadowDirty=!0,this.setQuality(4);let n=new we({map:Xc(),transparent:!0,depthWrite:!1,opacity:.65});this.actorShadows=new Zn(new Me(1.1,1.1),n,6),this.actorShadows.count=0,this.actorShadows.frustumCulled=!1,this.scene.add(this.actorShadows),this.combatEffects=new ha(this.scene),this.lastTime=0,this.width=1,this.height=1,this.scale=1,this.weaponSway=new Map,this.autoScale=1,this.frameCounter=0,this.frameBudget=32,t.addEventListener("webglcontextlost",s=>{s.preventDefault(),this.lost=!0}),t.addEventListener("webglcontextrestored",()=>{this.prepareReflections(),this.shadowDirty=!0,this.lost=!1})}prepareReflections(){let t=Wc("freight"),e=new ls(this.renderer);this.environmentTarget?.dispose(),this.environmentTarget=e.fromEquirectangular(t),t.dispose(),e.dispose(),this.scene.environment=this.weaponScene.environment=this.environmentTarget.texture}setQuality(t){if(this.quality===t)return;this.quality=t,this.autoScale=1,this.frameCounter=0,this.frameBudget=32,this.renderer.shadowMap.enabled=t!==6;let e=t===2?2048:1024;this.sun.shadow.mapSize.x!==e&&(this.sun.shadow.map?.dispose(),this.sun.shadow.map=null,this.sun.shadow.mapSize.set(e,e)),this.surfaces.quality(t),this.shadowDirty=!0;for(let n of this.localLights||[])n.visible=t!==6;for(let n of Object.values(this.batches))n.mesh.castShadow=t===2}createRifle(){this.rifleSupport=new Yt,this.rifleMagazineGroup=new Yt,this.weapon.add(this.rifleSupport,this.rifleMagazineGroup);let t=(a,l,c,h,u,f,p,g)=>{let y=["#455f4d","#647566"].includes(l)?"fabric":l==="#102329"?"rubber":"gunmetal",m=new Lt(a,ps.get(y,l));return m.position.set(c,h,u),m.scale.set(f,p,g),this.weapon.add(m),m};t(xe,"#24373f",0,0,0,.13,.14,.42),t(xe,"#667a78",0,.045,-.19,.105,.09,.3),t(xe,"#26383e",0,-.03,.3,.115,.14,.23),t(xe,"#102329",0,-.12,.065,.075,.22,.09).rotation.x=-.16,this.rifleMagazine=t(xe,"#3a5053",0,-.14,-.08,.085,.21,.13),this.rifleMagazine.rotation.x=.12,this.rifleMagazineGroup.add(this.rifleMagazine);let e=t(Qc,"#233038",0,.018,-.51,.025,.37,.025);e.rotation.x=Math.PI/2;let n=t(Qc,"#6e7e7a",0,.018,-.705,.032,.065,.032);n.rotation.x=Math.PI/2,t(xe,"#1e2f35",0,.105,-.03,.045,.04,.1),t(xe,"#91ad9e",-.026,.155,-.03,.013,.065,.035),t(xe,"#91ad9e",.026,.155,-.03,.013,.065,.035),t(xe,"#91ad9e",0,.185,-.03,.065,.012,.035),t(xe,"#344b50",0,.139,-.36,.022,.08,.03),t(xe,"#c8ff66",0,.178,-.36,.014,.02,.022);for(let a=0;a<8;a++)t(xe,"#25373e",0,.098,-.34+a*.044,.115,.012,.018);for(let a of[-.07,.07])t(xe,"#9bb09c",a,0,-.02,.014,.05,.09);t(Kc,"#455f4d",.08,-.13,.14,.08,.11,.1),t(xe,"#647566",.13,-.25,.23,.14,.28,.18).rotation.z=.32,this.rifleSupport.add(t(Kc,"#455f4d",-.06,-.09,-.27,.085,.07,.09));let s=t(xe,"#647566",-.14,-.22,-.18,.14,.29,.16);s.rotation.z=-.43,this.rifleSupport.add(s),t(xe,"#182c26",.073,.012,.04,.008,.05,.1),t(xe,"#b5a478",.079,.012,.04,.006,.013,.07),t(xe,"#a1ad96",.079,-.037,.13,.012,.022,.034);for(let a=0;a<4;a++)this.rifleMagazineGroup.add(t(xe,"#7b8a70",0,-.08-a*.055,-.14,.077,.012,.01));for(let a of[-1,1]){for(let l=0;l<5;l++)t(xe,"#1e332c",a*.061,.01,-.33+l*.05,.007,.035,.023);for(let l=0;l<4;l++){let c=t(ds,"#455f4d",a*.065-.04+l*.027,-.1,a>0?.08:-.3,.024,.07,.03);c.rotation.x=-.6,a<0&&this.rifleSupport.add(c)}}let r=new Lt(new ze(.043,.007,8,20),hr("#7d8b73"));r.position.set(0,-.11,.04),r.rotation.y=Math.PI/2,this.weapon.add(r),this.muzzleLight=new Qn("#ffb861",0,2,.9),this.muzzleLight.position.set(0,.018,-.79),this.weapon.add(this.muzzleLight);let o=new we({color:"#ffdea0",transparent:!0,opacity:.8,depthWrite:!1,blending:Un,toneMapped:!1});this.flash=new Lt(new Ye(1,6,4),o),this.flash.position.set(0,.018,-.79),this.flash.scale.set(.045,.045,.15),this.weapon.add(this.flash)}loadMap(t,e={}){let n=t.join("");if(this.mapKey===n&&this.arenaId===e.id)return;this.mapKey=n,this.arenaId=e.id,this.mapWidth=t[0].length,this.mapDepth=t.length;let s=e.id==="observatory";this.skies.has(e.id)||this.skies.set(e.id,Wc(e.id)),this.scene.background=this.skies.get(e.id),this.scene.fog.color.set(s?"#738493":"#b6beb7"),this.scene.fog.density=s?.011:.009,this.sun.color.set(s?"#d0dcf0":"#ffe0b0"),this.sun.intensity=s?1.8:3,this.ambient.color.set(s?"#a9bfdf":"#c7d8e1");let r=new Set,o=new Set,a=new Set;this.staticRoot.traverse(l=>{if(l.isMesh){if(l.geometry.userData.shared||r.add(l.geometry),!l.material.userData.persistent){o.add(l.material);for(let c of Object.values(l.material))c?.isTexture&&a.add(c)}l.isInstancedMesh&&l.dispose()}}),r.forEach(l=>l.dispose()),o.forEach(l=>l.dispose()),a.forEach(l=>l.dispose()),this.staticRoot.clear(),this.trainRoot=null,this.trainWheels=[],this.trainFans=[],this.trackLights=[];for(let l of this.localLights)this.scene.remove(l);if(this.localLights=[],su(this.staticRoot,t,e,this.surfaces),this.landmark(e.id||"freight"),mu(this.staticRoot.getObjectByName("landmark-"+(e.id||"freight")),e.id||"freight",this.surfaces),ru(this.staticRoot,e.id,this.surfaces),this.mechanisms=ou(this.staticRoot,e.id,this.surfaces,this.staticRoot.getObjectByName("landmark-"+e.id)),Ti(this.staticRoot.getObjectByName("landmark-"+(e.id||"freight")),new Set(this.trackLights)),this.staticRoot.traverse(l=>{l.isMesh&&!l.material.transparent&&(l.castShadow=!0,l.receiveShadow=!0)}),s||e.id==="foundry"){let l=new Qn(s?"#88c0ef":"#ff8e38",s?18:35,15,2);l.position.set(30,3.1,s?15:14.9),l.visible=this.quality!==6,this.scene.add(l),this.localLights.push(l)}this.shadowDirty=!0}landmark(t){let e=new Yt;e.name="landmark-"+t,e.position.set(this.mapWidth/2-20,0,this.mapDepth/2-12),this.staticRoot.add(e);let n=(o,a,l,c,h)=>{let u=["#7dd5e9","#bbccbf"].includes(a)?"glass":t==="plaza"?"stone":t==="observatory"?"paint":"metal",f=new Lt(o,ps.get(u,a));return f.position.set(l,c,h),e.add(f),f},s=(o,a,l,c,h,u,f)=>n(new de(h,u,f),o,a,l,c),r=(o,a,l,c,h,u)=>n(new ce(h,h,u,12),o,a,l,c);if(t==="freight"){s("#d6a24a",19,4,12,.38,8,.42),s("#d6a24a",21,4,12,.38,8,.42),s("#dfb653",20,8,12,13,.5,.7),s("#4a6268",20,7.5,12,3,1.2,1.2),s("#2d3a3e",24,5.7,12,.045,4.5,.045),r("#cda347",24,3.4,12,.17,.45);for(let o=0;o<8;o++){let a=s("#b4893d",15+o*1.4,7.6,12,.09,1.1,.09);a.rotation.z=o%2?.65:-.65}}else if(t==="foundry"){s("#473e39",20,.12,12,4,.24,5),s("#473e39",20,2.4,12,3.7,4.8,3.7),r("#6c6158",20,6.4,12,.72,6),r("#3d3b38",20,9.6,12,.95,.38);for(let o of[10.12,13.88]){let a=s("#ff9c31",20,2,o,2.5,1.1,.04);a.material.dispose(),a.material=new we({color:"#ff9829"})}for(let o of[18.25,21.75])r("#aa734a",o,2.7,12,.18,5.4);s("#dd9f44",20,4.7,12,4,.17,4)}else if(t==="plaza"){s("#b9ac8d",20,.15,12,4,.3,5),s("#b9ac8d",20,2.7,12,3,5.4,3),s("#6b6255",20,5.6,12,3.4,.3,3.4),s("#d3c3a1",20,7,12,2.5,2.8,2.5);let o=n(new Pn(2.2,2,4),"#557a73",20,9.3,12);o.rotation.y=Math.PI/4,r("#c7ac60",20,10.7,12,.045,1.1);for(let a=0;a<4;a++){let l=new Yt;l.position.set(20,7.2,12),l.rotation.y=a*Math.PI/2,e.add(l);let c=new Lt(new ce(.88,.88,.05,32),hr("#e5dfb6"));c.rotation.x=Math.PI/2,c.position.z=1.27,l.add(c);let h=new Lt(new de(.07,.64,.06),hr("#273a3c"));h.position.set(0,.23,1.32),h.rotation.z=-.45,l.add(h);let u=new Lt(new de(.5,.07,.06),hr("#273a3c"));u.position.set(.17,0,1.33),l.add(u);for(let f=0;f<12;f++){let p=new Lt(new de(.045,.1,.04),hr("#273a3c"));p.position.set(Math.sin(f*Math.PI/6)*.72,Math.cos(f*Math.PI/6)*.72,1.32),p.rotation.z=-f*Math.PI/6,l.add(p)}}}else if(t==="observatory"){s("#d1dce0",20,.12,12,4,.24,5),s("#d1dce0",20,1.7,12,3.8,3.4,3.8),n(new Ye(1.85,24,12,0,Math.PI*2,0,Math.PI/2),"#b9ccd3",20,3.4,12);let o=r("#3e637e",20,5.2,12,.38,3.3);o.rotation.z=-.7;let a=r("#7dd5e9",21.08,6.48,12,.43,.12);a.rotation.z=-.7,s("#263f59",20,3.45,12,.14,.1,3.9),r("#95aab9",18.3,3.8,10.3,.055,7.6)}else if(t==="railway"){let o=_u(this.surfaces);o.root.position.set(20,0,12),this.trainRoot=new Yt,this.trainRoot.name="moving-train",this.trainRoot.add(o.root),e.add(this.trainRoot),this.trainRoot.visible=!1,this.trainWheels=o.wheels,this.trainFans=o.fans,xu(e,this.mapWidth,this.surfaces);for(let a of[9.7,14.3])for(let l=21-this.mapWidth/2;l<20+this.mapWidth/2;l+=1){let c=s(l%2?"#edb44c":"#343a32",l,.025,a,.8,.04,.2);c.rotation.y=.35}for(let a of[23-this.mapWidth/2,17+this.mapWidth/2])for(let l of[9,15]){r("#49594e",a,1.3,l,.07,2.6),s("#273a34",a,2.6,l,.45,.7,.25);let c=n(new Ye(.15,10,8),"#6c3129",a,2.7,l-.17);c.material.dispose(),c.material=new we({color:"#6c3129"}),this.trackLights.push(c)}}}updateMechanisms(t,e){au(this.mechanisms,t,e),this.mechanisms&&Math.floor(t*6)!==this.mechanismShadow&&(this.mechanismShadow=Math.floor(t*6),this.shadowDirty=!0)}updateTrain(t){if(!this.trainRoot)return;if(this.trainRoot.visible!==!!t?.active&&(this.shadowDirty=!0),this.trainRoot.visible=!!t?.active,t){this.trainRoot.position.x=t.x-this.mapWidth/2;for(let n of this.trainWheels)n.rotation.z=-t.x/.48;for(let n of this.trainFans||[])n.rotation.y=t.elapsed*6}let e=t&&(t.warning||t.active)&&Math.floor(t.elapsed*5)%2===0;for(let n of this.trackLights)n.material.color.set(e?"#ff442e":"#6c3129")}resize(t,e,n){this.setQuality(n);let s=Math.min(devicePixelRatio||1,n===2?1.5:n===4?1:.7,1800/Math.max(t,e))*(this.autoScale||1);(this.width!==t||this.height!==e||this.scale!==s)&&(this.width=t,this.height=e,this.scale=s,this.renderer.setPixelRatio(s),this.renderer.setSize(t,e,!1))}begin(t,e){if(this.lost)return;let n=e-(this.lastTime||e),s=Math.max(0,Math.min(.1,n/1e3));this.lastTime=e,t.length>0&&this.quality!==2&&++this.frameCounter>8&&n>0&&n<1500&&(this.frameBudget=$c(this.frameBudget,n,.18),this.frameCounter%8===0&&this.frameBudget>55&&this.autoScale>.55?(this.autoScale=Math.max(.55,this.autoScale*.85),this.resize(this.width,this.height,this.quality)):this.frameCounter%120===0&&this.frameBudget<24&&this.autoScale<1&&(this.autoScale=Math.min(1,this.autoScale+.05),this.resize(this.width,this.height,this.quality)));for(let o of t){let a=this.actors.get(o.id);(!a||a.skin!==o.skin||a.team!==o.team)&&(a=U0(o),this.actors.set(o.id,a)),uu(a,o,s,e)}for(let o of this.actors.keys())t.some(a=>a.id===o)||this.actors.delete(o);this.combatEffects.update(this.actors,s,e);let r=0;for(let o of t)o.hp>0&&r<6&&(lr.position.set(o.x,.009,o.y),lr.rotation.set(-Math.PI/2,0,0),lr.scale.set(1,1,1),lr.updateMatrix(),this.actorShadows.setMatrixAt(r++,lr.matrix));this.actorShadows.count=r,this.actorShadows.instanceMatrix.needsUpdate=!0,this.renderer.shadowMap.enabled&&(this.shadowDirty||(this.quality===2||this.trainRoot?.visible)&&e-this.lastShadow>(this.quality===2?80:180))&&(this.renderer.shadowMap.needsUpdate=!0,this.lastShadow=e,this.shadowDirty=!1),this.renderer.setScissorTest(!1),this.renderer.clear(),this.renderer.setScissorTest(!0)}render(t,e,n,s,r){if(this.lost)return;let o=this.renderer;o.setViewport(e.x,this.height-e.y-e.h,e.w,e.h),o.setScissor(e.x,this.height-e.y-e.h,e.w,e.h);let a=this.camera,l=t.pitch||0,c=e.w/e.h,h=Math.max(56,Math.min(82,2*Math.atan(Math.tan(n/2)/c)*180/Math.PI));a.aspect=c,a.fov=h*(n<1?.88:1),a.updateProjectionMatrix(),a.position.set(t.x,1.5,t.y),a.lookAt(t.x+Math.cos(t.yaw)*Math.cos(l),1.5+Math.sin(l),t.y+Math.sin(t.yaw)*Math.cos(l)),a.updateMatrixWorld();for(let u of Object.values(this.batches))u.mesh.count=0;for(let[u,f]of this.actors)if(!(u===t.id||f.hp<=0&&s-f.dead>5e3))for(let p of f.records){if(p.weapon&&p.weapon!==f.weapon)continue;let g=p.surface+":"+p.geometry;this.batches[g]||(this.batches[g]=new ma(this.scene,jc[p.geometry],1024,ps.get(p.surface)),this.batches[g].mesh.castShadow=this.quality===2),this.batches[g].add(p.node.matrixWorld,p.tint)}for(let u of Object.values(this.batches))u.commit();if(this.combatEffects.view(t.id,s),o.render(this.scene,a),t.hp>0){let u=s-(r?.shotAt||0),f=Math.min(1,Math.hypot(t.vx||0,t.vy||0)/7.2),p=t.stride||s*.008,g=t.weapon||"rifle",y=g==="shotgun"?.7:g==="pistol"?1.25:1.5,m=this.weaponModels[g]||this.weaponModels.rifle,d=m.root;this.activeWeapon=g;for(let C of Object.values(this.weaponModels))C.root.visible=C===m;let x=n<1,M=t.reload>0?Math.sin(t.reload/y*Math.PI):0,v=t.cheats.recoil?0:Math.max(0,1-u/110),T=this.weaponSway.get(t.id);T||(T={yaw:t.yaw,pitch:l,x:0,y:0},this.weaponSway.set(t.id,T));let A=Math.atan2(Math.sin(t.yaw-T.yaw),Math.cos(t.yaw-T.yaw));T.x=$c(T.x,fn.clamp(A,-.04,.04),.35),T.y=$c(T.y,fn.clamp(l-T.pitch,-.03,.03),.35),T.yaw=t.yaw,T.pitch=l,d.position.set((x?0:.19)+Math.sin(p)*f*.008,-.2-Math.abs(Math.cos(p))*f*.007-M*.18,(x?-.42:-.54)+v*.04),d.rotation.set(v*(g==="shotgun"?.11:g==="pistol"?.085:.045)+M*.35+T.y,M*-.4-T.x,M*-.4-T.x*.5),d.position.y-=Math.min(1,(t.equip||0)/.35)*.25,g!=="rifle"?pu(m,g,u,M):(this.rifleSupport.position.set(.1*M,-.16*M,.17*M),this.rifleMagazineGroup.position.y=-M*.18),m.flash.visible=u>=0&&u<65,m.light.intensity=m.flash.visible&&this.quality!==6?2.5:0,this.weaponCamera.aspect=c,this.weaponCamera.fov=2*Math.atan(Math.tan(58*Math.PI/360)/Math.min(1,c))*180/Math.PI,this.weaponCamera.updateProjectionMatrix(),o.clearDepth(),o.render(this.weaponScene,this.weaponCamera)}}inspect(t,e,n,s=-2.5,r=.3,o=3.6){if(this.lost)return;this.begin(t,e);for(let h of Object.values(this.batches))h.mesh.count=0;for(let h of this.actors.values())for(let u of h.records){if(u.weapon&&u.weapon!==h.weapon)continue;let f=u.surface+":"+u.geometry;this.batches[f]||(this.batches[f]=new ma(this.scene,jc[u.geometry],1024,ps.get(u.surface))),this.batches[f].mesh.castShadow=this.quality===2,this.batches[f].add(u.node.matrixWorld,u.tint)}for(let h of Object.values(this.batches))h.commit();let a=this.renderer,l=this.camera;l.aspect=this.width/this.height,l.fov=45,l.updateProjectionMatrix();let c=n.height??1;l.position.set(n.x+Math.cos(s)*o,c+Math.sin(r)*o,n.y+Math.sin(s)*o),l.lookAt(n.x,c,n.y),l.updateMatrixWorld(),a.setViewport(0,0,this.width,this.height),a.setScissor(0,0,this.width,this.height),a.render(this.scene,l)}preview(t){if(this.lost)return;this.begin([],t);for(let r of Object.values(this.batches))r.mesh.count=0,r.commit();let e=this.renderer;e.setViewport(0,0,this.width,this.height),e.setScissor(0,0,this.width,this.height);let n=t*18e-6,s=this.camera;s.aspect=this.width/this.height,s.fov=62,s.updateProjectionMatrix(),s.position.set(this.mapWidth/2+25*Math.cos(n),26,this.mapDepth/2+16*Math.sin(n)),s.lookAt(this.mapWidth/2,3.5,this.mapDepth/2),s.updateMatrixWorld(),e.render(this.scene,s)}project(t,e){let n=new P(t.x,.03,t.y).project(this.camera),s=new P(t.x,2.02,t.y).project(this.camera);return s.z>1||s.z<-1?null:{x:(s.x+1)*e.w/2,top:(1-s.y)*e.h/2,bottom:(1-n.y)*e.h/2}}};window.CheatRenderer3D=tl;})();
/*! Bundled license information:

three/build/three.core.js:
three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2025 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/

``````

## frontend/scene3d.js
``````
/* Cheat FPS 0.4.0 — local, instanced 3D renderer. Build instructions in README.
 * No remote models, textures or runtime CDNs are required. */
import * as THREE from 'three';
import {CombatEffects} from './combat-effects.js';
import {environment,machinery,animateMachinery} from './environment.js';
import {buildOperator,animateOperator,operatorGeometries} from './operators.js';
import {buildFirearm,animateFirearm} from './firearms.js';
import {enhanceLandmark} from './map-details.js';
import {buildDieselLocomotive,buildRailTrack} from './locomotive.js';
import {Surfaces,roundedBox,capsule,skyTexture,contactTexture,buildWorld,mergeStatic} from './graphics.js';
let surfaces;
const TAU=Math.PI*2, lerp=(a,b,t)=>a+(b-a)*t;
const box=roundedBox,sphere=new THREE.SphereGeometry(1,20,14),cylinder=new THREE.CylinderGeometry(1,1,1,16);
const geometries={box,sphere,cylinder,capsule,...operatorGeometries};for(const g of Object.values(geometries))g.userData.shared=true;
const transform=new THREE.Object3D(), color=new THREE.Color();
class Batch {
    constructor(scene,geometry,capacity,material){
        this.mesh=new THREE.InstancedMesh(geometry,material,capacity);this.mesh.count=0;this.items=[];
        this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);this.mesh.frustumCulled=false;this.mesh.castShadow=false;this.mesh.receiveShadow=true;scene.add(this.mesh);
    }
    add(matrix,tint){let i=this.mesh.count++;if(i>=this.mesh.instanceMatrix.count)throw Error('Character instance buffer full');this.mesh.setMatrixAt(i,matrix);this.mesh.setColorAt(i,color.set(tint));}
    commit(){this.mesh.instanceMatrix.needsUpdate=true;if(this.mesh.instanceColor)this.mesh.instanceColor.needsUpdate=true;}
}
function material(tint){return surfaces.get('metal',tint);}
function part(root,geometry,tint,x,y,z,sx,sy,sz,records){
    const node=new THREE.Object3D();node.position.set(x,y,z);node.scale.set(sx,sy,sz);root.add(node);const surface=tint==='#bf967c'?'skin':['#1c2a30','#323d41','#263338','#394f54'].includes(tint)?'metal':'fabric';records.push({node,geometry,tint,surface});return node;
}
function joint(parent,x,y,z){const g=new THREE.Group();g.position.set(x,y,z);parent.add(g);return g;}
function actor(player){return buildOperator(player,part,joint);}
export class CheatRenderer3D {
    constructor(canvas){
        // High quality supersamples via pixel ratio; avoid a multisample
        // framebuffer on every mobile/split view at the default quality.
        this.canvas=canvas;this.renderer=new THREE.WebGLRenderer({canvas,alpha:false,antialias:false,powerPreference:'high-performance'});
        this.renderer.outputColorSpace=THREE.SRGBColorSpace;this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.1;this.renderer.autoClear=false;
        this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;this.renderer.shadowMap.autoUpdate=false;
        this.surfaces=surfaces=new Surfaces(this.renderer);this.scene=new THREE.Scene();this.scene.fog=new THREE.FogExp2('#b6beb7',.009);
        this.ambient=new THREE.HemisphereLight('#c7d8e1','#687562',1.9);this.scene.add(this.ambient);
        this.sun=new THREE.DirectionalLight('#ffe0b0',3);this.sun.position.set(10,45,4);this.sun.target.position.set(30,0,17.5);this.scene.add(this.sun,this.sun.target);this.sun.castShadow=true;
        Object.assign(this.sun.shadow.camera,{left:-43,right:43,top:34,bottom:-34,near:.5,far:120});this.sun.shadow.bias=-.00012;this.sun.shadow.normalBias=.04;this.sun.shadow.radius=2;
        this.camera=new THREE.PerspectiveCamera(60,1,.045,190);this.actors=new Map();this.mapKey='';this.staticRoot=new THREE.Group();this.scene.add(this.staticRoot);this.batches={};this.skies=new Map();
        this.weaponScene=new THREE.Scene();this.weaponScene.add(new THREE.HemisphereLight('#dfebee','#68775c',2.2));
        const light=new THREE.DirectionalLight('#ffe3b8',2.2);light.position.set(-2,4,3);this.weaponScene.add(light);
        this.weaponCamera=new THREE.PerspectiveCamera(58,1,.01,10);this.weapon=new THREE.Group();this.weaponScene.add(this.weapon);this.createRifle();
        this.weaponModels={rifle:{root:this.weapon,flash:this.flash,light:this.muzzleLight}};
        for(const key of ['shotgun','pistol']){const model=buildFirearm(key,this.surfaces);this.weaponModels[key]=model;model.root.visible=false;this.weaponScene.add(model.root);}
        this.prepareReflections();this.localLights=[];this.quality=0;this.lastShadow=-1000;this.shadowDirty=true;this.setQuality(4);
        const shadowMat=new THREE.MeshBasicMaterial({map:contactTexture(),transparent:true,depthWrite:false,opacity:.65});
        this.actorShadows=new THREE.InstancedMesh(new THREE.PlaneGeometry(1.1,1.1),shadowMat,6);this.actorShadows.count=0;this.actorShadows.frustumCulled=false;this.scene.add(this.actorShadows);
        this.combatEffects=new CombatEffects(this.scene);this.lastTime=0;this.width=1;this.height=1;this.scale=1;this.weaponSway=new Map();this.autoScale=1;this.frameCounter=0;this.frameBudget=32;
        canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();this.lost=true;});
        canvas.addEventListener('webglcontextrestored',()=>{this.prepareReflections();this.shadowDirty=true;this.lost=false;});
    }
    prepareReflections(){
        const sky=skyTexture('freight'),pmrem=new THREE.PMREMGenerator(this.renderer);this.environmentTarget?.dispose();this.environmentTarget=pmrem.fromEquirectangular(sky);sky.dispose();pmrem.dispose();this.scene.environment=this.weaponScene.environment=this.environmentTarget.texture;
    }
    setQuality(quality){
        if(this.quality===quality)return;this.quality=quality;this.autoScale=1;this.frameCounter=0;this.frameBudget=32;this.renderer.shadowMap.enabled=quality!==6;
        const size=quality===2?2048:1024;if(this.sun.shadow.mapSize.x!==size){this.sun.shadow.map?.dispose();this.sun.shadow.map=null;this.sun.shadow.mapSize.set(size,size);}this.surfaces.quality(quality);this.shadowDirty=true;
        for(const light of this.localLights||[])light.visible=quality!==6;
        for(const batch of Object.values(this.batches))batch.mesh.castShadow=quality===2;
    }
    createRifle(){
        this.rifleSupport=new THREE.Group();this.rifleMagazineGroup=new THREE.Group();this.weapon.add(this.rifleSupport,this.rifleMagazineGroup);
        const mesh=(geo,tint,x,y,z,sx,sy,sz)=>{const kind=['#455f4d','#647566'].includes(tint)?'fabric':tint==='#102329'?'rubber':'gunmetal';const m=new THREE.Mesh(geo,surfaces.get(kind,tint));m.position.set(x,y,z);m.scale.set(sx,sy,sz);this.weapon.add(m);return m;};
        mesh(box,'#24373f',0,0,0,.13,.14,.42);
        mesh(box,'#667a78',0,.045,-.19,.105,.09,.30);
        mesh(box,'#26383e',0,-.03,.30,.115,.14,.23);
        mesh(box,'#102329',0,-.12,.065,.075,.22,.09).rotation.x=-.16;
        this.rifleMagazine=mesh(box,'#3a5053',0,-.14,-.08,.085,.21,.13);this.rifleMagazine.rotation.x=.12;this.rifleMagazineGroup.add(this.rifleMagazine);
        const barrel=mesh(cylinder,'#233038',0,.018,-.51,.025,.37,.025);barrel.rotation.x=Math.PI/2;
        const muzzle=mesh(cylinder,'#6e7e7a',0,.018,-.705,.032,.065,.032);muzzle.rotation.x=Math.PI/2;
        mesh(box,'#1e2f35',0,.105,-.03,.045,.04,.10);
        mesh(box,'#91ad9e',-.026,.155,-.03,.013,.065,.035);mesh(box,'#91ad9e',.026,.155,-.03,.013,.065,.035);
        mesh(box,'#91ad9e',0,.185,-.03,.065,.012,.035);mesh(box,'#344b50',0,.139,-.36,.022,.08,.03);mesh(box,'#c8ff66',0,.178,-.36,.014,.02,.022);
        for(let i=0;i<8;i++)mesh(box,'#25373e',0,.098,-.34+i*.044,.115,.012,.018);
        for(const x of [-.07,.07])mesh(box,'#9bb09c',x,0,-.02,.014,.05,.09);
        mesh(sphere,'#455f4d',.08,-.13,.14,.08,.11,.10);
        mesh(box,'#647566',.13,-.25,.23,.14,.28,.18).rotation.z=.32;
        this.rifleSupport.add(mesh(sphere,'#455f4d',-.06,-.09,-.27,.085,.07,.09));
        const leftSleeve=mesh(box,'#647566',-.14,-.22,-.18,.14,.29,.16);leftSleeve.rotation.z=-.43;this.rifleSupport.add(leftSleeve);
        // Receiver port, fire selector, magazine ribs and a proper trigger guard.
        mesh(box,'#182c26',.073,.012,.04,.008,.05,.10);
        mesh(box,'#b5a478',.079,.012,.04,.006,.013,.07);
        mesh(box,'#a1ad96',.079,-.037,.13,.012,.022,.034);
        for(let j=0;j<4;j++)this.rifleMagazineGroup.add(mesh(box,'#7b8a70',0,-.08-j*.055,-.14,.077,.012,.01));
        for(const side of [-1,1]){
            for(let j=0;j<5;j++)mesh(box,'#1e332c',side*.061,.01,-.33+j*.05,.007,.035,.023);
            for(let finger=0;finger<4;finger++){const f=mesh(capsule,'#455f4d',side*.065-.04+finger*.027,-.10,side>0?.08:-.30,.024,.07,.03);f.rotation.x=-.6;if(side<0)this.rifleSupport.add(f);}
        }
        const guard=new THREE.Mesh(new THREE.TorusGeometry(.043,.007,8,20),material('#7d8b73'));guard.position.set(0,-.11,.04);guard.rotation.y=Math.PI/2;this.weapon.add(guard);
        this.muzzleLight=new THREE.PointLight('#ffb861',0,2,.9);this.muzzleLight.position.set(0,.018,-.79);this.weapon.add(this.muzzleLight);
        const flashMaterial=new THREE.MeshBasicMaterial({color:'#ffdea0',transparent:true,opacity:.8,depthWrite:false,blending:THREE.AdditiveBlending,toneMapped:false});
        this.flash=new THREE.Mesh(new THREE.SphereGeometry(1,6,4),flashMaterial);this.flash.position.set(0,.018,-.79);this.flash.scale.set(.045,.045,.15);this.weapon.add(this.flash);
    }
    loadMap(map,theme={}){
        const key=map.join('');if(this.mapKey===key&&this.arenaId===theme.id)return;this.mapKey=key;this.arenaId=theme.id;
        this.mapWidth=map[0].length;this.mapDepth=map.length;const night=theme.id==='observatory';
        if(!this.skies.has(theme.id))this.skies.set(theme.id,skyTexture(theme.id));this.scene.background=this.skies.get(theme.id);
        this.scene.fog.color.set(night?'#738493':'#b6beb7');this.scene.fog.density=night?.011:.009;this.sun.color.set(night?'#d0dcf0':'#ffe0b0');this.sun.intensity=night?1.8:3;this.ambient.color.set(night?'#a9bfdf':'#c7d8e1');
        const geos=new Set(),mats=new Set(),textures=new Set();
        this.staticRoot.traverse(o=>{if(!o.isMesh)return;if(!o.geometry.userData.shared)geos.add(o.geometry);if(!o.material.userData.persistent){mats.add(o.material);for(const t of Object.values(o.material))if(t?.isTexture)textures.add(t);}if(o.isInstancedMesh)o.dispose();});
        geos.forEach(g=>g.dispose());mats.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());this.staticRoot.clear();
        this.trainRoot=null;this.trainWheels=[];this.trainFans=[];this.trackLights=[];
        for(const light of this.localLights)this.scene.remove(light);this.localLights=[];
        buildWorld(this.staticRoot,map,theme,this.surfaces);this.landmark(theme.id||'freight');
        enhanceLandmark(this.staticRoot.getObjectByName('landmark-'+(theme.id||'freight')),theme.id||'freight',this.surfaces);
        environment(this.staticRoot,theme.id,this.surfaces);
        this.mechanisms=machinery(this.staticRoot,theme.id,this.surfaces,this.staticRoot.getObjectByName('landmark-'+theme.id));
        mergeStatic(this.staticRoot.getObjectByName('landmark-'+(theme.id||'freight')),new Set(this.trackLights));
        this.staticRoot.traverse(o=>{if(o.isMesh&&!o.material.transparent){o.castShadow=true;o.receiveShadow=true;}});
        if(night||theme.id==='foundry'){
            const light=new THREE.PointLight(night?'#88c0ef':'#ff8e38',night?18:35,15,2);light.position.set(30,3.1,night?15:14.9);light.visible=this.quality!==6;this.scene.add(light);this.localLights.push(light);
        }
        this.shadowDirty=true;
    }
    landmark(id){
        const group=new THREE.Group();group.name='landmark-'+id;group.position.set(this.mapWidth/2-20,0,this.mapDepth/2-12);this.staticRoot.add(group);
        const add=(geometry,tint,x,y,z)=>{const kind=['#7dd5e9','#bbccbf'].includes(tint)?'glass':id==='plaza'?'stone':id==='observatory'?'paint':'metal';const m=new THREE.Mesh(geometry,surfaces.get(kind,tint));m.position.set(x,y,z);group.add(m);return m;};
        const cube=(c,x,y,z,w,h,d)=>add(new THREE.BoxGeometry(w,h,d),c,x,y,z);
        const tube=(c,x,y,z,r,h)=>add(new THREE.CylinderGeometry(r,r,h,12),c,x,y,z);
        if(id==='freight'){
            // Both supports stand inside the central blocked 4 x 5 m area.
            cube('#d6a24a',19,4,12,.38,8,.42);cube('#d6a24a',21,4,12,.38,8,.42);
            cube('#dfb653',20,8,12,13,.5,.7);cube('#4a6268',20,7.5,12,3,1.2,1.2);
            cube('#2d3a3e',24,5.7,12,.045,4.5,.045);tube('#cda347',24,3.4,12,.17,.45);
            for(let i=0;i<8;i++){const b=cube('#b4893d',15+i*1.4,7.6,12,.09,1.1,.09);b.rotation.z=i%2?.65:-.65;}
        }else if(id==='foundry'){
            cube('#473e39',20,.12,12,4,.24,5);cube('#473e39',20,2.4,12,3.7,4.8,3.7);tube('#6c6158',20,6.4,12,.72,6);
            tube('#3d3b38',20,9.6,12,.95,.38);
            for(const z of [10.12,13.88]){const glow=cube('#ff9c31',20,2,z,2.5,1.1,.04);glow.material.dispose();glow.material=new THREE.MeshBasicMaterial({color:'#ff9829'});}
            for(const x of [18.25,21.75])tube('#aa734a',x,2.7,12,.18,5.4);
            cube('#dd9f44',20,4.7,12,4,.17,4);
        }else if(id==='plaza'){
            cube('#b9ac8d',20,.15,12,4,.3,5);cube('#b9ac8d',20,2.7,12,3,5.4,3);cube('#6b6255',20,5.6,12,3.4,.3,3.4);
            cube('#d3c3a1',20,7,12,2.5,2.8,2.5);
            const roof=add(new THREE.ConeGeometry(2.2,2,4),'#557a73',20,9.3,12);roof.rotation.y=Math.PI/4;
            tube('#c7ac60',20,10.7,12,.045,1.1);
            for(let i=0;i<4;i++){
                const face=new THREE.Group();face.position.set(20,7.2,12);face.rotation.y=i*Math.PI/2;group.add(face);
                const dial=new THREE.Mesh(new THREE.CylinderGeometry(.88,.88,.05,32),material('#e5dfb6'));dial.rotation.x=Math.PI/2;dial.position.z=1.27;face.add(dial);
                const hand=new THREE.Mesh(new THREE.BoxGeometry(.07,.64,.06),material('#273a3c'));hand.position.set(0,.23,1.32);hand.rotation.z=-.45;face.add(hand);
                const short=new THREE.Mesh(new THREE.BoxGeometry(.5,.07,.06),material('#273a3c'));short.position.set(.17,0,1.33);face.add(short);
                for(let j=0;j<12;j++){const mark=new THREE.Mesh(new THREE.BoxGeometry(.045,.10,.04),material('#273a3c'));mark.position.set(Math.sin(j*Math.PI/6)*.72,Math.cos(j*Math.PI/6)*.72,1.32);mark.rotation.z=-j*Math.PI/6;face.add(mark);}
            }
        }else if(id==='observatory'){
            cube('#d1dce0',20,.12,12,4,.24,5);cube('#d1dce0',20,1.7,12,3.8,3.4,3.8);
            add(new THREE.SphereGeometry(1.85,24,12,0,Math.PI*2,0,Math.PI/2),'#b9ccd3',20,3.4,12);
            const scope=tube('#3e637e',20,5.2,12,.38,3.3);scope.rotation.z=-.7;
            const lens=tube('#7dd5e9',21.08,6.48,12,.43,.12);lens.rotation.z=-.7;
            cube('#263f59',20,3.45,12,.14,.1,3.9);
            tube('#95aab9',18.3,3.8,10.3,.055,7.6);
        }else if(id==='railway'){
            const model=buildDieselLocomotive(this.surfaces);
            model.root.position.set(20,0,12);
            this.trainRoot=new THREE.Group();this.trainRoot.name='moving-train';
            this.trainRoot.add(model.root);group.add(this.trainRoot);this.trainRoot.visible=false;
            this.trainWheels=model.wheels;this.trainFans=model.fans;
            buildRailTrack(group,this.mapWidth,this.surfaces);
            for(const z of [9.7,14.3])for(let x=21-this.mapWidth/2;x<20+this.mapWidth/2;x+=1){
                const stripe=cube(x%2?'#edb44c':'#343a32',x,.025,z,.8,.04,.20);stripe.rotation.y=.35;
            }
            for(const x of [23-this.mapWidth/2,17+this.mapWidth/2])for(const z of [9,15]){
                tube('#49594e',x,1.3,z,.07,2.6);cube('#273a34',x,2.6,z,.45,.7,.25);
                const lamp=add(new THREE.SphereGeometry(.15,10,8),'#6c3129',x,2.7,z-.17);
                lamp.material.dispose();lamp.material=new THREE.MeshBasicMaterial({color:'#6c3129'});this.trackLights.push(lamp);
            }
        }
    }
    updateMechanisms(time,crane){animateMachinery(this.mechanisms,time,crane);if(this.mechanisms&&Math.floor(time*6)!==this.mechanismShadow){this.mechanismShadow=Math.floor(time*6);this.shadowDirty=true;}}
    updateTrain(train){
        if(!this.trainRoot)return;
        if(this.trainRoot.visible!==!!train?.active)this.shadowDirty=true;
        this.trainRoot.visible=!!train?.active;
        if(train){
            this.trainRoot.position.x=train.x-this.mapWidth/2;
            for(const wheel of this.trainWheels)wheel.rotation.z=-train.x/.48;
            for(const fan of this.trainFans||[])fan.rotation.y=train.elapsed*6;
        }
        const flash=train&&(train.warning||train.active)&&Math.floor(train.elapsed*5)%2===0;
        for(const lamp of this.trackLights)lamp.material.color.set(flash?'#ff442e':'#6c3129');
    }
    resize(w,h,quality){
        this.setQuality(quality);const scale=Math.min(devicePixelRatio||1,quality===2?1.5:quality===4?1:.7,1800/Math.max(w,h))*(this.autoScale||1);
        if(this.width!==w||this.height!==h||this.scale!==scale){this.width=w;this.height=h;this.scale=scale;this.renderer.setPixelRatio(scale);this.renderer.setSize(w,h,false);}
    }
    begin(roster,now){
        if(this.lost)return;
        const elapsed=now-(this.lastTime||now),dt=Math.max(0,Math.min(.1,elapsed/1000));this.lastTime=now;
        if(roster.length>0&&this.quality!==2&&++this.frameCounter>8&&elapsed>0&&elapsed<1500){
            this.frameBudget=lerp(this.frameBudget,elapsed,.18);
            if(this.frameCounter%8===0&&this.frameBudget>55&&this.autoScale>.55){this.autoScale=Math.max(.55,this.autoScale*.85);this.resize(this.width,this.height,this.quality);}
            else if(this.frameCounter%120===0&&this.frameBudget<24&&this.autoScale<1){this.autoScale=Math.min(1,this.autoScale+.05);this.resize(this.width,this.height,this.quality);}
        }
        for(const p of roster){
            let a=this.actors.get(p.id);
            if(!a||a.skin!==p.skin||a.team!==p.team){a=actor(p);this.actors.set(p.id,a);}
            animateOperator(a,p,dt,now);
        }
        for(const id of this.actors.keys())if(!roster.some(p=>p.id===id))this.actors.delete(id);
        this.combatEffects.update(this.actors,dt,now);
        let shadowIndex=0;for(const p of roster)if(p.hp>0&&shadowIndex<6){transform.position.set(p.x,.009,p.y);transform.rotation.set(-Math.PI/2,0,0);transform.scale.set(1,1,1);transform.updateMatrix();this.actorShadows.setMatrixAt(shadowIndex++,transform.matrix);}this.actorShadows.count=shadowIndex;this.actorShadows.instanceMatrix.needsUpdate=true;
        if(this.renderer.shadowMap.enabled&&(this.shadowDirty||((this.quality===2||this.trainRoot?.visible)&&now-this.lastShadow>(this.quality===2?80:180)))){this.renderer.shadowMap.needsUpdate=true;this.lastShadow=now;this.shadowDirty=false;}
        this.renderer.setScissorTest(false);this.renderer.clear();this.renderer.setScissorTest(true);
    }
    render(p,rect,fov,now,fx){
        if(this.lost)return;
        const r=this.renderer;r.setViewport(rect.x,this.height-rect.y-rect.h,rect.w,rect.h);r.setScissor(rect.x,this.height-rect.y-rect.h,rect.w,rect.h);
        const camera=this.camera,pitch=p.pitch||0,aspect=rect.w/rect.h;
        // A stable vertical FOV avoids a telescope view in tall split panes.
        const vertical=Math.max(56,Math.min(82,2*Math.atan(Math.tan(fov/2)/aspect)*180/Math.PI));
        camera.aspect=aspect;camera.fov=vertical*(fov<1?.88:1);camera.updateProjectionMatrix();
        camera.position.set(p.x,1.5,p.y);camera.lookAt(p.x+Math.cos(p.yaw)*Math.cos(pitch),1.5+Math.sin(pitch),p.y+Math.sin(p.yaw)*Math.cos(pitch));camera.updateMatrixWorld();
        for(const batch of Object.values(this.batches))batch.mesh.count=0;
        for(const [id,a] of this.actors){if(id===p.id||(a.hp<=0&&now-a.dead>5000))continue;for(const part of a.records){if(part.weapon&&part.weapon!==a.weapon)continue;const key=part.surface+':'+part.geometry;if(!this.batches[key]){this.batches[key]=new Batch(this.scene,geometries[part.geometry],1024,surfaces.get(part.surface));this.batches[key].mesh.castShadow=this.quality===2;}this.batches[key].add(part.node.matrixWorld,part.tint);}}
        for(const batch of Object.values(this.batches))batch.commit();
        this.combatEffects.view(p.id,now);
        r.render(this.scene,camera);
        if(p.hp>0){
            const shot=now-(fx?.shotAt||0),moving=Math.min(1,Math.hypot(p.vx||0,p.vy||0)/7.2),stride=p.stride||now*.008;
            const key=p.weapon||'rifle',duration=key==='shotgun'?.7:key==='pistol'?1.25:1.5;
            const model=this.weaponModels[key]||this.weaponModels.rifle,weapon=model.root;this.activeWeapon=key;
            for(const m of Object.values(this.weaponModels))m.root.visible=m===model;
            const ads=fov<1,reload=p.reload>0?Math.sin(p.reload/duration*Math.PI):0,kick=p.cheats.recoil?0:Math.max(0,1-shot/110);
            let sway=this.weaponSway.get(p.id);if(!sway){sway={yaw:p.yaw,pitch,x:0,y:0};this.weaponSway.set(p.id,sway);}
            const delta=Math.atan2(Math.sin(p.yaw-sway.yaw),Math.cos(p.yaw-sway.yaw));sway.x=lerp(sway.x,THREE.MathUtils.clamp(delta,-.04,.04),.35);sway.y=lerp(sway.y,THREE.MathUtils.clamp(pitch-sway.pitch,-.03,.03),.35);sway.yaw=p.yaw;sway.pitch=pitch;
            weapon.position.set((ads?0:.19)+Math.sin(stride)*moving*.008,-.20-Math.abs(Math.cos(stride))*moving*.007-reload*.18,(ads?-.42:-.54)+kick*.04);
            weapon.rotation.set(kick*(key==='shotgun'?.11:key==='pistol'?.085:.045)+reload*.35+sway.y,reload*-.4-sway.x,reload*-.4-sway.x*.5);
            weapon.position.y-=Math.min(1,(p.equip||0)/.35)*.25;
            if(key!=='rifle')animateFirearm(model,key,shot,reload);
            else{this.rifleSupport.position.set(.10*reload,-.16*reload,.17*reload);this.rifleMagazineGroup.position.y=-reload*.18;}
            model.flash.visible=shot>=0&&shot<65;model.light.intensity=model.flash.visible&&this.quality!==6?2.5:0;
            this.weaponCamera.aspect=aspect;this.weaponCamera.fov=2*Math.atan(Math.tan(58*Math.PI/360)/Math.min(1,aspect))*180/Math.PI;this.weaponCamera.updateProjectionMatrix();r.clearDepth();r.render(this.weaponScene,this.weaponCamera);
        }
    }
    inspect(roster,now,target,orbit=-2.5,elevation=.3,radius=3.6){
        if(this.lost)return;this.begin(roster,now);
        for(const batch of Object.values(this.batches))batch.mesh.count=0;
        for(const a of this.actors.values())for(const part of a.records){
            if(part.weapon&&part.weapon!==a.weapon)continue;
            const key=part.surface+':'+part.geometry;
            if(!this.batches[key])this.batches[key]=new Batch(this.scene,geometries[part.geometry],1024,surfaces.get(part.surface));
            this.batches[key].mesh.castShadow=this.quality===2;this.batches[key].add(part.node.matrixWorld,part.tint);
        }
        for(const batch of Object.values(this.batches))batch.commit();
        const r=this.renderer,c=this.camera;c.aspect=this.width/this.height;c.fov=45;c.updateProjectionMatrix();
        const focus=target.height??1;c.position.set(target.x+Math.cos(orbit)*radius,focus+Math.sin(elevation)*radius,target.y+Math.sin(orbit)*radius);c.lookAt(target.x,focus,target.y);c.updateMatrixWorld();
        r.setViewport(0,0,this.width,this.height);r.setScissor(0,0,this.width,this.height);r.render(this.scene,c);
    }
    preview(now){
        if(this.lost)return;
        this.begin([],now);
        for(const batch of Object.values(this.batches)){batch.mesh.count=0;batch.commit();}
        const r=this.renderer;r.setViewport(0,0,this.width,this.height);r.setScissor(0,0,this.width,this.height);
        const angle=now*.000018,c=this.camera;c.aspect=this.width/this.height;c.fov=62;c.updateProjectionMatrix();
        c.position.set(this.mapWidth/2+25*Math.cos(angle),26,this.mapDepth/2+16*Math.sin(angle));c.lookAt(this.mapWidth/2,3.5,this.mapDepth/2);c.updateMatrixWorld();
        r.render(this.scene,c);
    }
    project(q,rect){
        const foot=new THREE.Vector3(q.x,.03,q.y).project(this.camera),head=new THREE.Vector3(q.x,2.02,q.y).project(this.camera);
        if(head.z>1||head.z< -1)return null;
        return {x:(head.x+1)*rect.w/2,top:(1-head.y)*rect.h/2,bottom:(1-foot.y)*rect.h/2};
    }
}
window.CheatRenderer3D=CheatRenderer3D;

``````

## frontend/style.css
``````
:root { color-scheme:dark; --bg:#0a1013; --ink:#e6eee9; --acid:#c6ff47; --line:#34433f; }
* { box-sizing:border-box; }
html,body { margin:0; height:100%; overscroll-behavior:none; }
body { background:var(--bg); color:var(--ink); font-family:Arial,'Malgun Gothic',sans-serif; overflow:hidden; }
button,input,select { font:inherit; }
button { background:#182222; border:1px solid var(--line); color:var(--ink); padding:13px 20px; cursor:pointer; border-radius:5px; }
button:hover { border-color:var(--acid); }
button:disabled { opacity:.4; cursor:default; }
button.primary { background:var(--acid); color:#10190c; font-weight:800; border:0; }
.screen { position:fixed; inset:0; overflow:auto; padding:5vh 7vw; background:radial-gradient(ellipse at 80% 20%,#233127,#0a1013 70%); z-index:4; }
.hidden { display:none!important; }
#menu { display:flex; justify-content:space-between; gap:5vw; }
.shell { max-width:500px; }
.eyebrow { letter-spacing:3px; color:var(--acid); font-size:11px; font-weight:bold; }
h1 { font-size:clamp(64px,9vw,128px); line-height:.85; letter-spacing:-6px; margin:35px 0 25px; }
h1 span { display:block; color:var(--acid); }
h2 { font-size:30px; letter-spacing:-1px; }
.tagline { font-size:21px; }
.story,p,small { color:#a8b8ae; line-height:1.65; }
.form { display:grid; gap:12px; margin:24px 0; }
label { display:grid; gap:7px; font-size:13px; }
input,select { background:#101b1b; color:var(--ink); border:1px solid var(--line); padding:12px; border-radius:4px; min-width:0; }
input[type=checkbox] { width:18px; height:18px; }
.check { display:flex; align-items:center; }
.join,.row { display:flex; gap:10px; flex-wrap:wrap; }
.join input { flex:1; }
.poster { border-left:1px solid var(--line); padding:8vh 0 0 5vw; flex:1; max-width:550px; background:repeating-linear-gradient(135deg,transparent,transparent 50px,#c6ff4704 51px,#c6ff4704 53px); }
.poster b { color:var(--acid); font-size:20px; }
.poster h2 { font-size:clamp(40px,6vw,85px); line-height:1; font-style:italic; }
.poster div { font:18px/2 monospace; color:#779082; }
.poster p { margin-top:70px; letter-spacing:5px; }
.wide { max-width:1050px; margin:auto; }
#roomCode { color:var(--acid); font:24px monospace; margin-left:20px; }
.teams { display:grid; grid-template-columns:1fr 1fr; gap:20px; margin:20px 0; }
.card { background:#142020; border:1px solid var(--line); padding:18px; border-radius:6px; }
.blue { border-top:3px solid #55caff; }
.red { border-top:3px solid #ff776a; }
.member { display:flex; justify-content:space-between; border-bottom:1px solid var(--line); padding:12px 0; font-size:14px; }
.toggles { display:flex; gap:6px; flex-wrap:wrap; margin:12px 0; }
.toggles button { padding:9px; font-size:11px; }
.on { background:var(--acid)!important; color:#10190c!important; }
canvas { display:block; position:fixed; inset:0; width:100%; height:100%; touch-action:none; }
/* iOS callouts and selection must be disabled on every gameplay descendant. */
#game,#playUI,#playUI * { -webkit-user-select:none; user-select:none; -webkit-touch-callout:none; -webkit-tap-highlight-color:transparent; touch-action:none; }
body.playing { touch-action:none; -webkit-user-select:none; user-select:none; -webkit-touch-callout:none; }
body.playing input,body.playing select { -webkit-user-select:text; user-select:text; touch-action:auto; }
#playUI { position:fixed; inset:0; z-index:2; pointer-events:none; overflow:hidden; }
#viewControls { position:absolute; inset:0; }
.viewport-controls { position:absolute; top:0; bottom:0; overflow:hidden; --stick:116px; --action:58px; }
.look-surface { position:absolute; inset:0; pointer-events:auto; cursor:crosshair; }
.control-hint { position:absolute; top:104px; left:12px; right:12px; font:10px/1.5 Arial; color:#bdccc0b0; pointer-events:none; }
.joystick { position:absolute; left:18px; bottom:64px; width:var(--stick); height:var(--stick); border:1px solid #b5dfc67a; border-radius:50%; background:radial-gradient(circle,#14252075 0 31%,#29453d55 32% 70%,#05151177 71%); pointer-events:auto; }
.joystick:before,.joystick:after { content:''; position:absolute; background:#c6ff471f; pointer-events:none; }
.joystick:before { left:49%; top:12%; width:1px; height:76%; }
.joystick:after { top:49%; left:12%; height:1px; width:76%; }
.stick-knob { position:absolute; left:50%; top:50%; width:44%; height:44%; margin-left:-22%; margin-top:-22%; border-radius:50%; background:linear-gradient(145deg,#88ad9977,#213b2df0); border:1px solid #c6ff47a0; box-shadow:0 4px 14px #0008; pointer-events:none; }
.joystick.active .stick-knob { background:#c6ff4777; }
.actions { position:absolute; right:14px; bottom:65px; display:grid; grid-template-columns:var(--action) var(--action); gap:7px; pointer-events:none; }
.actions button { pointer-events:auto; height:var(--action); padding:0; background:#0d211dd6; border:1px solid #b5dfc670; color:#e9f6ef; font-size:12px; border-radius:12px; }
.actions .fire-button { grid-column:2; grid-row:1 / span 2; height:calc(var(--action)*2 + 7px); background:#a5df2929; border-color:#c6ff47a0; font-weight:bold; }
.actions .pressed { background:#c6ff4788!important; }
.view-cheats { position:absolute; bottom:12px; left:12px; right:12px; display:flex; justify-content:center; gap:5px; pointer-events:none; }
.view-cheats button { pointer-events:auto; font-size:10px; padding:10px 9px; background:#0c1918d9; }
.spectate-button { position:absolute; right:14px; top:86px; padding:8px; pointer-events:auto; font-size:11px; }
.floating { position:fixed; right:12px; top:12px; z-index:3; padding:8px; pointer-events:auto; }
body:not(.touch-device):not(.split-play) .joystick,body:not(.touch-device):not(.split-play) .actions { display:none; }
dialog { background:#142020; color:var(--ink); border:1px solid var(--line); border-radius:8px; max-width:520px; max-height:90vh; overflow:auto; z-index:10; }
dialog::backdrop { background:#000a; }
dialog label { margin:15px 0; }
#toast { position:fixed; top:18px; left:50%; transform:translateX(-50%); padding:12px 20px; background:#c6ff47; color:#142020; z-index:20; display:none; border-radius:5px; max-width:90vw; pointer-events:none; }
table { border-collapse:collapse; width:100%; margin:20px 0; }
td,th { padding:12px; text-align:left; border-bottom:1px solid var(--line); }
#rounds { display:flex; gap:8px; flex-wrap:wrap; }
#rounds span { padding:10px; background:#172525; }
@media(max-width:700px) { .poster{display:none}.screen{padding:25px 6vw}.teams{grid-template-columns:1fr}h1{font-size:65px;margin:22px 0}.shell{width:100%}.form{margin:15px 0}.story{font-size:13px}.card{padding:12px}table{font-size:12px}td,th{padding:7px} }
@media(max-height:530px) { .viewport-controls{--stick:94px;--action:44px}.joystick{bottom:53px;left:12px}.actions{bottom:53px;right:10px;gap:5px}.actions .fire-button{height:93px}.view-cheats{bottom:8px;gap:3px}.view-cheats button{font-size:9px;padding:8px 6px}.control-hint{display:none}.spectate-button{top:62px} }
@media(max-width:650px) { body.split-play .viewport-controls{--stick:76px;--action:36px}body.split-play .joystick{left:6px}body.split-play .actions{right:6px;gap:4px}body.split-play .actions .fire-button{height:76px}body.split-play .view-cheats{left:4px;right:4px;gap:2px}body.split-play .view-cheats button{padding:8px 4px;font-size:8px}body.split-play .control-hint{font-size:8px} }
@media(max-width:650px) { body.split-play .floating{top:70px;right:6px;font-size:10px;padding:5px}body.split-play .control-hint{display:none} }

/* 0.2.1: rendered panes and touch bounds share visualViewport dimensions. */
html,body { overscroll-behavior:none; }
#world3d,#game,#playUI { height:var(--app-height,100dvh); }
#world3d { z-index:0;pointer-events:none; }
#game { z-index:1; }
.screen { z-index:4; }
body.playing { position:fixed;inset:0;overflow:hidden; }
.compact-pane { --stick:94px;--action:44px; }
.compact-pane .joystick { bottom:53px;left:12px; }
.compact-pane .actions { bottom:53px;right:10px;gap:5px; }
.compact-pane .actions .fire-button { height:93px; }
.compact-pane .view-cheats { bottom:8px;gap:3px; }
.compact-pane .view-cheats button { font-size:9px;padding:8px 6px; }
.compact-pane .control-hint { display:none; }
.compact-pane .spectate-button { top:62px; }
body.portrait-split .viewport-controls { --stick:94px;--action:44px; }
body.portrait-split .actions .fire-button { height:93px; }
body.portrait-split .view-cheats button { padding:8px 6px;font-size:9px; }
body.portrait-split .floating { top:70px; }

/* v0.2.2: actual arena preview with a compact title menu. */
#menu { display:flex;align-items:center;padding:40px 7vw;background:linear-gradient(90deg,rgba(5,14,17,.96) 0%,rgba(5,14,17,.84) 27%,rgba(5,14,17,.22) 66%,rgba(5,14,17,.06)); }
.menu-content { width:min(340px,85vw); }
#menu h1 { font-size:clamp(72px,8vw,118px);margin:0 0 40px;line-height:.88;letter-spacing:-5px; }
.menu-actions { display:flex;flex-direction:column;gap:12px; }
.menu-actions label { margin:0;color:#c4d5cb;font-size:13px; }
.menu-actions select { width:100%;background:#0b1a1be6; }
.menu-actions .primary { margin-top:8px;min-height:54px; }
.menu-links { display:flex;gap:28px;margin-top:6px; }
.menu-links button { border:0;background:transparent;padding:10px 0;color:#c7d6cc; }
.menu-links button:hover { color:var(--acid); }
.menu-version { position:absolute;bottom:16px;left:7vw;color:#b3c4b58c;font:11px monospace; }
#networkSetup label { display:flex;margin:14px 0;gap:10px; }
#networkSetup label:not(.check) { flex-direction:column; }
#networkSetup .join { margin:16px 0; }
@media(max-height:560px){#menu{padding:20px 6vw}#menu h1{font-size:62px;margin-bottom:20px}.menu-content{width:280px}.menu-actions{gap:7px}.menu-actions .primary{min-height:44px}.menu-links{margin-top:0}.menu-version{bottom:9px;left:auto;right:15px}}
@media(max-width:600px){#menu{background:linear-gradient(90deg,#050e11e8,#050e1188);padding:28px 8vw}.menu-content{width:min(310px,84vw)}#menu h1{font-size:86px;margin-bottom:34px}}

#previewCaption { position:absolute;bottom:24px;right:30px;color:#d3dfd6c0;font-size:12px;letter-spacing:1px;text-align:right;max-width:55%;text-shadow:0 1px 4px #000;pointer-events:none; }
#mapLandmark { font-size:12px;color:#aec4bc; }

.view-cheats [data-action="weapon"]{min-width:66px;color:#e7e6c9;}

.weapon-selector{position:absolute;top:100px;left:50%;transform:translateX(-50%);display:flex;gap:6px;z-index:8;pointer-events:auto;width:min(94%,390px)}
.weapon-selector button{flex:1;min-width:0;display:flex;flex-direction:column;align-items:center;gap:7px;padding:9px 4px;background:#171b18e8;border:1px solid #9e8243;color:#d6ad5a;border-radius:3px;font-size:12px}
.weapon-selector button.selected{background:#79602add;border-color:#ffe0a0;color:#ffe3a1;box-shadow:inset 0 -3px #ffc85a}
.weapon-selector b{align-self:flex-start;font-size:15px}.gun-symbol{display:block;position:relative;height:7px;width:58px;background:currentColor;margin:7px 0 12px;border-radius:2px}.gun-symbol:after{content:'';position:absolute;width:9px;height:13px;left:16px;top:5px;background:currentColor;transform:skew(-12deg)}.gun-pistol{width:29px;height:9px}.gun-shotgun{width:65px;height:5px}.gun-shotgun:after{left:7px;width:17px;height:8px}
@media(max-height:550px){.weapon-selector{top:70px}.weapon-selector button{gap:2px;padding:5px;font-size:10px}}

``````

## package-lock.json
``````
{
  "name": "cheat-fps-renderer",
  "version": "0.5.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "cheat-fps-renderer",
      "version": "0.5.0",
      "devDependencies": {
        "esbuild": "0.28.2",
        "three": "0.180.0"
      }
    },
    "node_modules/@esbuild/aix-ppc64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/aix-ppc64/-/aix-ppc64-0.28.2.tgz",
      "integrity": "sha512-XExcO+dvLKvVtNTibSTBej1NCAbaGhWn9Ww1ZPx80qsahhPFe/8jgWP0IchNe0F3HwkU7n8ejhH8bjonqht8mQ==",
      "cpu": [
        "ppc64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "aix"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/android-arm": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/android-arm/-/android-arm-0.28.2.tgz",
      "integrity": "sha512-kXXoiPVVGQcnIYGOeaovwOURpniDBpSq4A03qkQ+BMQqtGG6HYap3xne9C1O1yo4TR3qxlCX5IqqmX6fFo2Lqg==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/android-arm64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/android-arm64/-/android-arm64-0.28.2.tgz",
      "integrity": "sha512-5YfKeeI8qWfBZIX+u2xZC3Zlb3Os/gLS2sbEKM+I4ZOcsWmHS2WLysCcQZDAFRslDUU5Oiq44gf6PYN1vGwG5A==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/android-x64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/android-x64/-/android-x64-0.28.2.tgz",
      "integrity": "sha512-O387ite7SzUyCcy3JQX4P4bLtEA7bLLkx+esve5JHnyYfNTxcVpXZo9jhdB0lTKN44gztELTdU7nS8Nr16Fs1Q==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/darwin-arm64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/darwin-arm64/-/darwin-arm64-0.28.2.tgz",
      "integrity": "sha512-n4KqkOQrraxHJcgjM1RvwbigfQKIKJVpM7xp+KsxiyUSrRdIXnt73VhrPAx0fV44hgfmIVKjxMN9J1t5jySVkw==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/darwin-x64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/darwin-x64/-/darwin-x64-0.28.2.tgz",
      "integrity": "sha512-uq6suIWYP37qzGddBKPw5QEQPi6HiLGsO7UmkpfyaYNQ3D+rN6w6WfwH+nuqcGXWvawGwxOEroO4YGnFh95azw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/freebsd-arm64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/freebsd-arm64/-/freebsd-arm64-0.28.2.tgz",
      "integrity": "sha512-n+I0BTSRIoy+d6RPKnEVwql5UwBJolytvY4mAOIEJorKlqgPII8ix6slVVrfZ5Tnj7glIZvloylbB/EJPMWEXw==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "freebsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/freebsd-x64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/freebsd-x64/-/freebsd-x64-0.28.2.tgz",
      "integrity": "sha512-78XJTJkvPs0kz2w61301PJjXl4g7q3JqiYMZ/M/yVI73EHBrCRTgkhu9oqG7vPqq+a/yadEW8aD+agKlk5xrmg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "freebsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-arm": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-arm/-/linux-arm-0.28.2.tgz",
      "integrity": "sha512-XlDnu2q5yoqems+xay6wSAcg9DDD7K9RLKZEBOMZm3ckNpJBvOX20tSfby8KfrrhINDyv9V2YVZKY/SpoGJI8w==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-arm64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-arm64/-/linux-arm64-0.28.2.tgz",
      "integrity": "sha512-pW4AC0P3it8c7do9MVM4p51FzHzdM/TZrerurgRcHJ2WTa1VQ1CIq18xncfpBJw4ojkiZZrKW2yIBWBP92j6Ug==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-ia32": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-ia32/-/linux-ia32-0.28.2.tgz",
      "integrity": "sha512-CYbnj78HsIeA+DhgUKgFCfvNsTHFhMMrinUrMZpDXJXKN8T3XViTZ/+wtHeVxEWY8ewSzTFN+nRmSwO2tZaLUQ==",
      "cpu": [
        "ia32"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-loong64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-loong64/-/linux-loong64-0.28.2.tgz",
      "integrity": "sha512-buwkd8nsph4R+ajRvw0qM5Hja/TXQow3ptzWO2EbG/cqcIkHloRrdlBtQlshyYGTNFvfkfJ5tpPLVkY4DtsPfQ==",
      "cpu": [
        "loong64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-mips64el": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-mips64el/-/linux-mips64el-0.28.2.tgz",
      "integrity": "sha512-ZVykbDyk7519VwiNb9Lcj9m8XM6v5V9uKPvrEMkkEedVewf+0itkhahp4HDpgERXhwLRpWFypsGbG/J8s0QjJA==",
      "cpu": [
        "mips64el"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-ppc64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-ppc64/-/linux-ppc64-0.28.2.tgz",
      "integrity": "sha512-CAXl+Dtd9UUuJd8pKKdwh6MLm3MUMiqMPmhZ3tTSXPqfyQ3vDl6R5hZdZ/kYojK4ofXtdfSv1tFq8XzWx3heNQ==",
      "cpu": [
        "ppc64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-riscv64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-riscv64/-/linux-riscv64-0.28.2.tgz",
      "integrity": "sha512-GeXCej4IQtU1B+QlDV8W/RRvbzI3O/Stss+/bCXv4lZls5WGRtu2a+3JkA3i4qIUlMXpcHebWpF8AkJhATowuA==",
      "cpu": [
        "riscv64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-s390x": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-s390x/-/linux-s390x-0.28.2.tgz",
      "integrity": "sha512-3H1weTYZPxt/WOhByszQZybS9w5lKzUn1FDMsgEChbHWQwHYQQRfBxgCcZvPhjHfKyJjIievvMmEUawJrdY9Dg==",
      "cpu": [
        "s390x"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-x64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-x64/-/linux-x64-0.28.2.tgz",
      "integrity": "sha512-4xTZr1FUmSoQW4XIWmit3tzQrUTZM+N3P0XV8xROKYF50XfI7xeO90+1bZvNwxIufQ9hDQVRJH5YhgPVF8A/HQ==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/netbsd-arm64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/netbsd-arm64/-/netbsd-arm64-0.28.2.tgz",
      "integrity": "sha512-sSATRjPeDBg3pdgHoQfoYBob11Kk1FGa9lui5RIHZCoCkJa9QKlvl3/vKz2usCmYYjs7ymJR/2Nnsqe+Hjt5nw==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "netbsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/netbsd-x64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/netbsd-x64/-/netbsd-x64-0.28.2.tgz",
      "integrity": "sha512-lqnzCV+mM0gIADaKihiCg6ifgfU2L3h5E33rNQBN1Y4MaVGnzryzmvvf7UHxprpQdE8hpqLolJ9Rl+SkIRDpyw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "netbsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/openbsd-arm64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/openbsd-arm64/-/openbsd-arm64-0.28.2.tgz",
      "integrity": "sha512-AL2qJILH7lNjrDmCQDvdxMfAUIv8KMNZOvrwAQ8i8//ntL9FflhOyMJ8OZSMBb8/AWXe3/5v5S20y3zCoZWKoQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "openbsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/openbsd-x64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/openbsd-x64/-/openbsd-x64-0.28.2.tgz",
      "integrity": "sha512-QtiuPytchRyC4rwUKhexJdQKvDuZ6hWloi3igqPQNUJCS1/v9EiO3UTOXR6A3FoMo4fnAKbWJdqaIwhOzh8qEw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "openbsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/openharmony-arm64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/openharmony-arm64/-/openharmony-arm64-0.28.2.tgz",
      "integrity": "sha512-WkhYDmpTjLvGlScA1rwjRUmhl4k8oXR3cIbtqWmELgU/dFeHHlEllxDvdWcNJV9rbzCexB5vz8gtNewWLgCT7Q==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "openharmony"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/sunos-x64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/sunos-x64/-/sunos-x64-0.28.2.tgz",
      "integrity": "sha512-GPMSkTOtMnv2U2F8gxe4Io6qmVs+YKyp832Etqqxr0hFngmXQ3rzwytelm3GIn7T4VviRUlf3sOgBOiTdvaf7g==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "sunos"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/win32-arm64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/win32-arm64/-/win32-arm64-0.28.2.tgz",
      "integrity": "sha512-PIhhEkE9uPBleRBrQEJpUn7MBnibZzbGzYWPmY3x+YoVg/95zbjB4CxPPOQ8l5tYYM4mMaCthF8/1DIfBQQyWQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/win32-ia32": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/win32-ia32/-/win32-ia32-0.28.2.tgz",
      "integrity": "sha512-YmJbfTlvU7Sdn9BB+4PRES4oB6pxgS37MAONj+hBr/cpXS1aBPKXxNnDbu+QCWPj0o9dgyxeq79g6c5P8KeuYA==",
      "cpu": [
        "ia32"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/win32-x64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/win32-x64/-/win32-x64-0.28.2.tgz",
      "integrity": "sha512-5ebpxr3nWMzrL/rnUI755Jkuee0bHL/Gq0WTF9lvcpv73wAp5eu8MfBUgWK9bhWvZjj7yX8etf/8tI8Ney695g==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/esbuild": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/esbuild/-/esbuild-0.28.2.tgz",
      "integrity": "sha512-HKVLS8dvII+xoKW9kmqxbRKrnWEXfJJr/FZhhJmiqIB0e053QNYFqOBouTMO/k5sID4MvCiUCvv8b9M4h32wIA==",
      "dev": true,
      "hasInstallScript": true,
      "license": "MIT",
      "bin": {
        "esbuild": "bin/esbuild"
      },
      "engines": {
        "node": ">=18"
      },
      "optionalDependencies": {
        "@esbuild/aix-ppc64": "0.28.2",
        "@esbuild/android-arm": "0.28.2",
        "@esbuild/android-arm64": "0.28.2",
        "@esbuild/android-x64": "0.28.2",
        "@esbuild/darwin-arm64": "0.28.2",
        "@esbuild/darwin-x64": "0.28.2",
        "@esbuild/freebsd-arm64": "0.28.2",
        "@esbuild/freebsd-x64": "0.28.2",
        "@esbuild/linux-arm": "0.28.2",
        "@esbuild/linux-arm64": "0.28.2",
        "@esbuild/linux-ia32": "0.28.2",
        "@esbuild/linux-loong64": "0.28.2",
        "@esbuild/linux-mips64el": "0.28.2",
        "@esbuild/linux-ppc64": "0.28.2",
        "@esbuild/linux-riscv64": "0.28.2",
        "@esbuild/linux-s390x": "0.28.2",
        "@esbuild/linux-x64": "0.28.2",
        "@esbuild/netbsd-arm64": "0.28.2",
        "@esbuild/netbsd-x64": "0.28.2",
        "@esbuild/openbsd-arm64": "0.28.2",
        "@esbuild/openbsd-x64": "0.28.2",
        "@esbuild/openharmony-arm64": "0.28.2",
        "@esbuild/sunos-x64": "0.28.2",
        "@esbuild/win32-arm64": "0.28.2",
        "@esbuild/win32-ia32": "0.28.2",
        "@esbuild/win32-x64": "0.28.2"
      }
    },
    "node_modules/three": {
      "version": "0.180.0",
      "resolved": "https://registry.npmjs.org/three/-/three-0.180.0.tgz",
      "integrity": "sha512-o+qycAMZrh+TsE01GqWUxUIKR1AL0S8pq7zDkYOQw8GqfX8b8VoCKYUoHbhiX5j+7hr8XsuHDVU6+gkQJQKg9w==",
      "dev": true,
      "license": "MIT"
    }
  }
}

``````

## package.json
``````
{
  "name": "cheat-fps-renderer",
  "version": "0.5.0",
  "private": true,
  "description": "Optional build tools; Render serves the already bundled renderer.",
  "scripts": {
    "build:renderer": "esbuild frontend/scene3d.js --bundle --format=iife --minify --target=safari15 --outfile=frontend/renderer3d.js"
  },
  "devDependencies": {
    "three": "0.180.0",
    "esbuild": "0.28.2"
  }
}

``````

## render.yaml
``````
services:
  - type: web
    name: cheat-fps
    runtime: python
    plan: free
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn backend.main:app --host 0.0.0.0 --port $PORT --workers 1
    healthCheckPath: /health
    envVars:
      - key: PYTHON_VERSION
        value: 3.11.11

``````

## requirements-dev.txt
``````
-r requirements.txt
pytest==9.1.1
httpx==0.28.1
playwright==1.63.0

``````

## requirements.txt
``````
fastapi==0.115.12
uvicorn[standard]==0.34.2

``````

## tests/test_aim.py
``````
import math

import pytest
from backend.game import CHEATS, Room


def duel(arena='freight'):
    room=Room('AIM','local',arena)
    p=room.add('Shooter',0);q=room.add('Target',1)
    room.state='PLAYING';room.timer=120
    p.x,p.y,p.yaw,p.pitch=2.5,1.5,.8,.7
    q.x,q.y=6.5,1.5
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

``````

## tests/test_aim_browser.py
``````
"""Real mobile taps and keyboard fire against authoritative stationary targets."""
import os
import socket
import subprocess
import sys
import time
from pathlib import Path
from urllib.request import urlopen

import pytest
from test_browser import browser, center, start_split_ai, touch, tap

pytestmark=pytest.mark.skipif(os.getenv('CHEAT_FPS_BROWSER_TESTS')!='1',reason='Opt-in browser checks')


@pytest.fixture(scope='module')
def aim_server():
    with socket.socket() as sock:
        sock.bind(('127.0.0.1',0));port=sock.getsockname()[1]
    code='''
import math,uvicorn
import backend.main as main
from backend.game import Room,CHEATS
main.secrets.choice=lambda values:'freight'
Room.ai=lambda self,p,dt:None
@main.app.post('/__test/aim/setup')
def setup():
    for r in main.rooms.values():
        people=[p for p in r.players.values() if not p.bot]
        enemies=[p for p in r.players.values() if p.team==1]
        for p in r.players.values():
            p.x,p.y=17.5,8.5;p.hp=100;p.shots=p.hit=0
            p.cheats=dict.fromkeys(CHEATS,False);p.cooldown=p.kick=p.reload=0;p.ammo=30
            p.inp={};p.tap_pending=0;p.vx=p.vy=0
        for i,p in enumerate(people):
            p.x,p.y,p.yaw,p.pitch=(2.5 if i==0 else 17.5),1.5,(.8 if i==0 else math.pi-.8),.7
            enemies[i].x,enemies[i].y=(6.5 if i==0 else 13.5),1.5
        for p in enemies[len(people):]:p.x,p.y=1.5,1.5
        return {'humans':[p.id for p in people],'targets':[p.id for p in enemies[:len(people)]]}
    return {}
uvicorn.run(main.app,host='127.0.0.1',port=PORT,log_level='error')
'''.replace('PORT',str(port))
    proc=subprocess.Popen([sys.executable,'-c',code],cwd=Path(__file__).resolve().parents[1],stdout=subprocess.DEVNULL,stderr=subprocess.PIPE)
    url=f'http://127.0.0.1:{port}'
    try:
        for _ in range(100):
            if proc.poll() is not None:raise RuntimeError(proc.stderr.read().decode())
            try:urlopen(url+'/health',timeout=.2);break
            except OSError:time.sleep(.05)
        else:raise RuntimeError('Server startup timeout')
        yield url
    finally:proc.terminate();proc.wait(timeout=5);proc.stderr.close()


def reset_targets(page,url):
    data=page.request.post(url+'/__test/aim/setup').json()
    page.wait_for_function('state.players.filter(p=>!p.bot).every(p=>p.y===1.5&&!p.cheats.aim&&p.shots===0)')
    page.evaluate('''() => {resetInput();ids.forEach((id,i)=>{const p=state.players.find(p=>p.id===id),m=motion.get(id);Object.assign(m,{x:p.x,y:p.y,yaw:i?Math.PI-.8:.8,pitch:.7,offsetX:0,offsetY:0,vx:0,vy:0});});transmit();}''')
    return data


@pytest.mark.parametrize('split',[False,True])
def test_mobile_tap_aim_and_three_cheats_per_player(browser,aim_server,split):
    context=browser.new_context(viewport={'width':1180,'height':760},has_touch=True,is_mobile=True)
    errors=[]
    try:
        page=context.new_page();page.on('pageerror',lambda e:errors.append(str(e)));page.goto(aim_server)
        if split:start_split_ai(page)
        else:page.locator('#create').click()
        page.wait_for_function('state?.state==="PLAYING"');data=reset_targets(page,aim_server)
        cdp=context.new_cdp_session(page)
        if not split:
            page.evaluate('''()=>{const before=ws.onmessage;ws.onmessage=e=>setTimeout(()=>before(e),120)}''')
        for i,pid in enumerate(data['humans']):
            assert page.locator(f'.viewport-controls[data-slot="{i}"] [data-game-cheat]').count()==3
            button=f'[data-game-cheat="aim"][data-slot="{i}"]'
            page.locator(button).tap()
            if split:page.wait_for_function('(id)=>state.players.find(p=>p.id===id).cheats.aim',arg=pid)
            assert page.evaluate('i=>!control(i).ads',i)
            area=page.locator(f'[data-look="{i}"]').bounding_box();x,y=area['x']+area['width']*.55,area['y']+area['height']*.38
            tap(cdp,x,y,40+i)
            target=data['targets'][i]
            try:page.wait_for_function('(id)=>state.players.find(p=>p.id===id).hp===75',arg=target,timeout=15000)
            except Exception:
                pytest.fail(str(page.evaluate('''({i,x,y})=>({i,phase:state.state,players:state.players.map(p=>({id:p.id,team:p.team,bot:p.bot,x:p.x,y:p.y,yaw:p.yaw,pitch:p.pitch,hp:p.hp,shots:p.shots,ammo:p.ammo,cheats:p.cheats})),motion:ids.map(id=>motion.get(id)),element:document.elementFromPoint(x,y)?.outerHTML})''',dict(i=i,x=x,y=y))))
            assert page.evaluate('id=>{const p=state.players.find(p=>p.id===id);return p.shots===1&&p.ammo===29}',pid)
            assert page.evaluate('(i)=>{const m=motion.get(ids[i]);return Math.abs(wrap(m.yaw-(i?Math.PI:0)))<.05&&m.pitch<0}',i)
            assert page.evaluate('i=>!!motion.get(ids[i]).lockTarget&&!control(i).ads',i)
        assert page.locator('[data-game-cheat="ammo"],[data-toggle="ammo"]').count()==0
        assert page.evaluate('state.players.every(p=>Object.keys(p.cheats).sort().join(",")==="aim,esp,recoil")')
        page.evaluate('''()=>{window.sentCheatPackets=[];const sendBefore=ws.send.bind(ws);ws.send=raw=>{const d=JSON.parse(raw);if(d.type==='toggle')sentCheatPackets.push(d);sendBefore(raw)}}''')
        page.keyboard.press('4');page.keyboard.press('0');page.wait_for_timeout(80)
        assert page.evaluate('sentCheatPackets.length===0')
        assert not errors,errors
    finally:context.close()


def test_hip_fire_and_ads_work_and_toggle_off_stops_aim(browser,aim_server):
    context=browser.new_context(viewport={'width':1100,'height':720})
    errors=[]
    try:
        page=context.new_page();page.on('pageerror',lambda e:errors.append(str(e)));page.goto(aim_server)
        page.locator('#create').click();page.wait_for_function('state?.state==="PLAYING"')
        data=reset_targets(page,aim_server);pid=data['humans'][0];target=data['targets'][0]
        page.keyboard.press('1');page.wait_for_function('state.players.find(p=>p.id===ids[0]).cheats.aim')
        page.keyboard.down('Space');page.wait_for_function('state.players.find(p=>p.team===1&&p.y===1.5).hp<100');page.keyboard.up('Space')
        assert page.evaluate('!control(0).ads&&Math.abs(motion.get(ids[0]).yaw)<.05')
        data=reset_targets(page,aim_server)
        # No AIM: an identical off-target tap must miss.
        page.keyboard.down('Space');page.wait_for_function('state.players.find(p=>p.id===ids[0]).shots>0');page.keyboard.up('Space')
        assert page.evaluate('id=>state.players.find(p=>p.id===id).hp===100',target)
        page.keyboard.press('1');page.wait_for_function('state.players.find(p=>p.id===ids[0]).cheats.aim')
        page.keyboard.down('Shift');page.wait_for_function('Math.abs(motion.get(ids[0]).yaw)<.05')
        page.keyboard.up('Shift')
        assert page.evaluate('id=>state.players.find(p=>p.id===id).hp===100',target)
        # Toggle removal takes effect immediately on subsequent shots.
        page.keyboard.press('1');page.wait_for_function('!state.players.find(p=>p.id===ids[0]).cheats.aim')
        page.evaluate('motion.get(ids[0]).yaw=.8;motion.get(ids[0]).pitch=.7')
        before=page.evaluate('state.players.find(p=>p.id===ids[0]).shots')
        page.keyboard.down('Space');page.wait_for_function('(n)=>state.players.find(p=>p.id===ids[0]).shots>n',arg=before);page.keyboard.up('Space')
        assert page.evaluate('id=>state.players.find(p=>p.id===id).hp===100',target)
        assert not errors,errors
    finally:context.close()

``````

## tests/test_arenas.py
``````
import random
from collections import deque
from unittest.mock import patch
import pytest
from fastapi.testclient import TestClient
from backend.arenas import ARENAS
from backend.game import Room, clear
from backend.main import app

@pytest.mark.parametrize('key',list(ARENAS))
def test_every_map_is_connected_and_all_six_spawns_are_safe(key):
    grid=ARENAS[key]['grid'];assert len(grid)==35 and all(len(row)==60 for row in grid)
    seen={(5,9)};queue=deque(seen)
    while queue:
        x,y=queue.popleft()
        for dx,dy in [(1,0),(-1,0),(0,1),(0,-1)]:
            v=x+dx,y+dy
            if 0<=v[0]<60 and 0<=v[1]<35 and grid[v[1]][v[0]]=='0' and v not in seen:seen.add(v);queue.append(v)
    assert len(seen)==sum(row.count('0') for row in grid)
    assert all((int(x),int(y)) in seen for team in ARENAS[key]['spawns'] for x,y in team)
    room=Room('T','local',key)
    for i in range(6):room.add(str(i),i%2).ready=True
    room.start()
    assert all(grid[int(p.y)][int(p.x)]=='0' for p in room.players.values())

@pytest.mark.parametrize('key',list(ARENAS))
def test_ai_can_finish_a_full_match_on_each_map(key):
    random.seed(42)
    room=Room('AI','ai',key);room.add('human').ready=True;room.start()
    for p in room.players.values():p.bot=True
    for _ in range(15000):
        room.tick(.05)
        if room.state=='MATCH_END':break
    assert room.state=='MATCH_END' and max(room.score)==3
    assert not any(any(p.cheats.values()) for p in room.players.values())


def test_collision_and_shooting_use_the_room_map_not_a_global_grid():
    a=Room('A','ai','freight');b=Room('B','ai','foundry')
    assert clear(21.5,3.5,27.5,3.5,a.map)
    assert not clear(21.5,3.5,27.5,3.5,b.map)
    for room in [a,b]:
        p=room.add('Shooter',0);q=room.add('Target',1,True)
        p.x,p.y,p.yaw=21.5,3.5,0;q.x,q.y=27.5,3.5;p.cheats['recoil']=True;room.shoot(p)
        assert q.hp==(75 if room is a else 100)


def test_only_local_host_can_select_a_map_and_selection_resets_ready():
    r=Room('L','local');host=r.add('Host');guest=r.add('Guest',1)
    host.ready=guest.ready=True
    r.command(guest,{'type':'map','map_id':'plaza'});assert r.map_id=='freight'
    r.command(host,{'type':'map','map_id':'plaza'});assert r.map_id=='plaza'
    assert not any(p.ready for p in r.players.values())
    r.state='PLAYING';r.command(host,{'type':'map','map_id':'railway'});assert r.map_id=='plaza'


def test_catalog_and_local_selection_and_ai_random_choice_are_networked():
    with TestClient(app) as c:
        catalog=c.get('/arenas').json()['arenas'];assert len(catalog)==5
        assert len({tuple(a['grid']) for a in catalog})==5
        assert len({a['landmark'] for a in catalog})==5
        for key in ARENAS:
            with c.websocket_connect('/ws') as ws:
                ws.send_json({'mode':'local','map_id':key});w=ws.receive_json()
                assert w['map_id']==key and w['map']==ARENAS[key]['grid']
            with patch('backend.main.secrets.choice',return_value=key),c.websocket_connect('/ws') as ws:
                ws.send_json({'mode':'ai','map_id':'not-a-map','quick':True});w=ws.receive_json()
                assert w['map_id']==key
                snap=ws.receive_json();assert snap['arena']==ARENAS[key] and snap['state']=='COUNTDOWN'

``````

## tests/test_browser.py
``````
"""Optional real Chromium / DOM / Canvas / WebSocket / multi-touch checks.
AI is paused only in this fixture; normal AI matches are tested in test_game.py.
"""
import os
import socket
import subprocess
import sys
import time
from pathlib import Path
from urllib.request import urlopen
import pytest

pytestmark=pytest.mark.skipif(os.getenv('CHEAT_FPS_BROWSER_TESTS')!='1',reason='Opt-in browser checks')

@pytest.fixture(scope='module')
def server_url():
    with socket.socket() as s:
        s.bind(('127.0.0.1',0));port=s.getsockname()[1]
    code=("import uvicorn;from backend.game import Room;from backend.main import app,rooms;"
          "Room.ai=lambda self,p,dt:None;import backend.main as main;main.secrets.choice=lambda values:'freight';"
          "exec(\"@app.post('/__test/finish')\\ndef finish():\\n"
          " for r in rooms.values():\\n"
          "  if r.quick and r.state=='PLAYING':\\n"
          "   r.score=[2,0];r.round=3;r.history=[{'round':1,'winner':0,'reason':'검증'},{'round':2,'winner':0,'reason':'검증'}];r.finish(0,'검증')\\n"
          " return {'ok':True}\\n\");"
          f"uvicorn.run(app,host='127.0.0.1',port={port},log_level='error')")
    proc=subprocess.Popen([sys.executable,'-c',code],cwd=Path(__file__).resolve().parents[1],stdout=subprocess.DEVNULL,stderr=subprocess.PIPE)
    url=f'http://127.0.0.1:{port}'
    try:
        for _ in range(100):
            if proc.poll() is not None:raise RuntimeError(proc.stderr.read().decode())
            try:urlopen(url+'/health',timeout=.2);break
            except OSError:time.sleep(.05)
        else:raise RuntimeError('Test server startup timeout')
        yield url
    finally:proc.terminate();proc.wait(timeout=5);proc.stderr.close()

@pytest.fixture
def browser():
    playwright=pytest.importorskip('playwright.sync_api')
    with playwright.sync_playwright() as pw:
        kwargs={}
        if os.getenv('CHEAT_FPS_BROWSER'):
            kwargs=dict(executable_path=os.environ['CHEAT_FPS_BROWSER'],args=['--no-sandbox','--no-zygote','--single-process','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
        instance=pw.chromium.launch(headless=True,**kwargs)
        yield instance
        instance.close()

def start_split_ai(page):
    # Split AI remains covered at the protocol level; the simplified AI menu
    # deliberately has no split-screen or character setup controls.
    page.evaluate("""() => {const original=WebSocket.prototype.send;WebSocket.prototype.send=function(raw){const d=JSON.parse(raw);if(d.mode==='ai'){d.split=true;d.skins=['rogue','warden'];raw=JSON.stringify(d)}return original.call(this,raw)}}""")
    page.locator('#create').click()

@pytest.fixture
def game(browser,server_url):
    context=browser.new_context(viewport={'width':1280,'height':800},has_touch=True,is_mobile=True,device_scale_factor=1)
    page=context.new_page();errors=[]
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.goto(server_url);start_split_ai(page);page.wait_for_function('state?.state === "PLAYING"')
    yield page,context.new_cdp_session(page)
    context.close()
    assert not errors,errors

def touch(cdp,kind,points):
    cdp.send('Input.dispatchTouchEvent',dict(type=kind,touchPoints=[dict(id=p[0],x=p[1],y=p[2],radiusX=3,radiusY=3,force=1) for p in points]))

def tap(cdp,x,y,identifier=95):
    # Keep the physical contact at 30 ms even if a software GPU makes the
    # two CDP round trips take seconds. The browser creates real TouchEvents.
    stamp=time.time()
    cdp.send('Input.dispatchTouchEvent',dict(type='touchStart',timestamp=stamp,touchPoints=[dict(id=identifier,x=x,y=y,radiusX=3,radiusY=3,force=1)]))
    cdp.send('Input.dispatchTouchEvent',dict(type='touchEnd',timestamp=stamp+.03,touchPoints=[]))

def center(page,selector):
    b=page.locator(selector).bounding_box();return b['x']+b['width']/2,b['y']+b['height']/2

def shots(page):return page.evaluate('ids.map(id=>state.players.find(p=>p.id===id).shots)')

def test_independent_analog_controls_and_fire(game):
    page,cdp=game;a,b=center(page,'[data-stick="0"]'),center(page,'[data-stick="1"]')
    before=page.evaluate('ids.map(id=>{let p=state.players.find(p=>p.id===id);return [p.x,p.y]})')
    touch(cdp,'touchStart',[(1,*a),(2,*b)]);touch(cdp,'touchMove',[(1,a[0],a[1]-38),(2,b[0]+38,b[1])])
    page.wait_for_timeout(350);touch(cdp,'touchEnd',[]);page.wait_for_timeout(150)
    after=page.evaluate('ids.map(id=>{let p=state.players.find(p=>p.id===id);return [p.x,p.y]})')
    assert after[0][0]>before[0][0]+.3 and after[1][1]>before[1][1]+.3
    assert abs(after[0][1]-before[0][1])<.05 and abs(after[1][0]-before[1][0])<.05
    before_shots=shots(page);fire=center(page,'[data-action="fire"][data-slot="1"]')
    touch(cdp,'touchStart',[(3,*fire)]);page.wait_for_timeout(380);touch(cdp,'touchEnd',[]);page.wait_for_timeout(100)
    after_shots=shots(page)
    assert after_shots[1]>=before_shots[1]+2 and after_shots[0]==before_shots[0]
    assert page.evaluate('control(0).f===0&&control(1).s===0&&control(1).fire.size===0')

def test_tap_drag_long_press_cancel_and_blur(game):
    page,cdp=game;before,yaw=shots(page),page.evaluate('motion.get(ids[0]).yaw')
    touch(cdp,'touchStart',[(4,280,280)]);touch(cdp,'touchMove',[(4,430,280)]);touch(cdp,'touchEnd',[])
    page.wait_for_timeout(150)
    assert shots(page)==before and abs(page.evaluate('motion.get(ids[0]).yaw')-yaw)>.3
    tap(cdp,280,280,5)
    page.wait_for_function('(n)=>state.players.find(p=>p.id===ids[0]).shots===n',arg=before[0]+1,timeout=15000)
    assert shots(page)[0]==before[0]+1
    a=center(page,'[data-stick="0"]');touch(cdp,'touchStart',[(6,*a)]);touch(cdp,'touchMove',[(6,a[0],a[1]-30)])
    page.wait_for_timeout(1400)
    assert page.evaluate('getSelection().toString()')==''
    assert page.locator('[data-stick="0"]').evaluate('el=>getComputedStyle(el).userSelect')=='none'
    assert not page.locator('[data-stick="0"]').evaluate('el=>el.dispatchEvent(new Event("contextmenu",{bubbles:true,cancelable:true}))')
    touch(cdp,'touchCancel',[])
    assert page.evaluate('control(0).f===0&&control(0).stick===null')
    fire=center(page,'[data-action="fire"][data-slot="0"]');touch(cdp,'touchStart',[(7,*fire)])
    page.evaluate('window.dispatchEvent(new Event("blur"))')
    assert page.evaluate('control(0).fire.size===0&&!control(0).input.fire');touch(cdp,'touchCancel',[])

def test_quick_ai_settings_results_rematch_and_resize(game,server_url):
    page,cdp=game
    assert page.locator('#lobby').is_hidden() and page.locator('.joystick').count()==2
    assert page.evaluate('state.quick&&state.players.length===6')
    assert page.evaluate('state.players.filter(p=>!p.bot).map(p=>p.skin)')==['rogue','warden']
    page.locator('#pause').tap();assert page.locator('#settings').is_visible()
    assert page.locator('#quality').input_value()=='4';page.locator('#settingsClose').click()
    for size in [(844,390),(390,844),(1366,900)]:
        page.set_viewport_size({'width':size[0],'height':size[1]});page.wait_for_timeout(100)
        for i in range(2):
            pane=page.locator(f'.viewport-controls[data-slot="{i}"]').bounding_box()
            stick=page.locator(f'[data-stick="{i}"]').bounding_box();fire=page.locator(f'[data-action="fire"][data-slot="{i}"]').bounding_box()
            assert pane['x']<=stick['x']<stick['x']+stick['width']<=pane['x']+pane['width']
            assert pane['x']<=fire['x']<fire['x']+fire['width']<=pane['x']+pane['width']
            assert stick['x']+stick['width']<fire['x']
    directory=os.getenv('CHEAT_FPS_SCREENSHOT_DIR')
    if directory:
        Path(directory).mkdir(parents=True,exist_ok=True);page.screenshot(path=str(Path(directory)/'mobile-split.png'))
        page.evaluate("let image=document.createElement('canvas');image.id='gallery';image.width=1200;image.height=700;image.style.cssText='position:fixed;inset:0;z-index:100;width:1200px;height:700px';let g=image.getContext('2d');g.fillStyle='#132329';g.fillRect(0,0,1200,700);['scout','warden','rogue'].forEach((skin,i)=>{g.drawImage(humanSprite(i===2?1:0,skin,0,0),100+i*320,90,256,384);g.font='700 20px Arial';g.fillStyle='#d5eddf';g.fillText(skin.toUpperCase(),165+i*320,510)});document.body.append(image)")
        page.locator('#gallery').screenshot(path=str(Path(directory)/'character-models.png'));page.locator('#gallery').evaluate('el=>el.remove()')
    page.request.post(server_url+'/__test/finish');page.wait_for_selector('#result:not(.hidden)')
    assert page.locator('#stats tbody tr').count()==6 and page.locator('#rounds span').count()==3
    assert page.locator('#finalScore').inner_text()=='3 : 0'
    page.locator('#again').click();page.wait_for_function('state?.state==="COUNTDOWN"&&state.score[0]===0')
    assert page.locator('#lobby').is_hidden() and page.locator('#playUI').is_visible()

def test_local_three_devices_with_two_players_each(browser,server_url):
    context=browser.new_context(viewport={'width':1200,'height':800})
    try:
        pages=[context.new_page() for _ in range(3)];code=''
        for page in pages:
            page.goto(server_url);page.locator('#mode').select_option('local');page.locator('#create').click();page.locator('#split').check()
            if code:page.locator('#code').fill(code);page.locator('#join').click()
            else:page.locator('#hostLocal').click()
            page.wait_for_selector('#lobby:not(.hidden)');code=page.locator('#roomCode').inner_text()
        for page in pages:
            for button in page.locator('[data-ready]').all():button.click()
        host=pages[0];host.wait_for_function('state.players.length===6&&state.players.every(p=>p.ready)')
        for page in pages:
            page.wait_for_selector('#playUI:not(.hidden)')
            assert page.locator('.joystick').count()==2
            assert page.evaluate('[0,1].map(t=>state.players.filter(p=>p.team===t&&!p.bot).length)')==[3,3]
    finally:
        context.close()


def test_hold_movement_across_countdown(browser,server_url):
    context=browser.new_context(viewport={'width':1280,'height':800},has_touch=True,is_mobile=True)
    try:
        page=context.new_page();page.goto(server_url);start_split_ai(page)
        page.wait_for_function('state?.state === "COUNTDOWN"')
        cdp=context.new_cdp_session(page);a=center(page,'[data-stick="0"]')
        before=page.evaluate('state.players.find(p=>p.id===ids[0]).x')
        touch(cdp,'touchStart',[(10,*a)]);touch(cdp,'touchMove',[(10,a[0],a[1]-35)])
        page.wait_for_function('state.state === "PLAYING"');page.wait_for_timeout(350)
        after=page.evaluate('state.players.find(p=>p.id===ids[0]).x')
        assert after>before+.2,('Held joystick was erased at countdown end',before,after)
        touch(cdp,'touchEnd',[])
    finally:context.close()


def test_mouse_fire_with_pointer_lock(browser,server_url):
    context=browser.new_context(viewport={'width':1280,'height':800})
    try:
        page=context.new_page();page.goto(server_url);page.locator('#create').click();page.wait_for_function('state?.state === "PLAYING"')
        page.mouse.click(600,350);page.wait_for_timeout(180)
        page.wait_for_function('document.pointerLockElement === canvas')
        before=shots(page)[0]
        page.mouse.down();page.wait_for_timeout(280);page.mouse.up();page.wait_for_timeout(100)
        assert shots(page)[0]>=before+2,'Clicks after pointer lock did not reach shooting handler'
    finally:context.close()


@pytest.fixture(scope='module')
def live_server_url():
    with socket.socket() as s:s.bind(('127.0.0.1',0));port=s.getsockname()[1]
    proc=subprocess.Popen([sys.executable,'-c',f"import uvicorn;import backend.main as m;m.secrets.choice=lambda values:'freight';uvicorn.run(m.app,host='127.0.0.1',port={port},log_level='error')"],cwd=Path(__file__).resolve().parents[1],stdout=subprocess.DEVNULL,stderr=subprocess.PIPE)
    url=f'http://127.0.0.1:{port}'
    try:
        for _ in range(100):
            if proc.poll() is not None:raise RuntimeError(proc.stderr.read().decode())
            try:urlopen(url+'/health',timeout=.2);break
            except OSError:time.sleep(.05)
        yield url
    finally:proc.terminate();proc.wait(timeout=5);proc.stderr.close()


def test_real_ai_with_simultaneous_sticks_look_and_shoot(browser,live_server_url):
    context=browser.new_context(viewport={'width':1200,'height':760},has_touch=True,is_mobile=True)
    try:
        page=context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
        page.goto(live_server_url);start_split_ai(page)
        page.wait_for_function('state?.state==="COUNTDOWN"')
        cdp=context.new_cdp_session(page);a,b=center(page,'[data-stick="0"]'),center(page,'[data-stick="1"]')
        touch(cdp,'touchStart',[(20,*a),(21,*b)])
        held=[(20,a[0],a[1]-35),(21,b[0],b[1]-35)]
        touch(cdp,'touchMove',held);page.wait_for_function('state.state==="PLAYING"');page.wait_for_timeout(500)
        assert page.evaluate('ids.every(id=>state.players.find(p=>p.id===id).x>3.3)')
        before=shots(page);yaw=page.evaluate('motion.get(ids[0]).yaw')
        fire=center(page,'[data-action="fire"][data-slot="1"]')
        touch(cdp,'touchStart',held+[(22,280,280),(23,*fire)])
        touch(cdp,'touchMove',held+[(22,390,230),(23,*fire)])
        page.wait_for_timeout(350);touch(cdp,'touchEnd',[]);page.wait_for_timeout(150)
        assert shots(page)[0]==before[0] and shots(page)[1]>=before[1]+2
        assert abs(page.evaluate('motion.get(ids[0]).yaw')-yaw)>.25
        assert page.evaluate('motion.get(ids[0]).pitch')>.1
        page.wait_for_function('state.players.some(p=>p.bot&&p.shots>0)',timeout=20000)
        assert page.evaluate('state.players.filter(p=>p.bot).every(p=>Object.values(p.cheats).every(v=>!v))')
        assert page.evaluate('contacts.size===0&&[0,1].every(i=>control(i).f===0&&control(i).fire.size===0)')
        assert not errors,errors
    finally:context.close()


def test_network_delay_does_not_drag_the_moving_camera_backwards(browser,server_url):
    context=browser.new_context(viewport={'width':800,'height':500})
    try:
        page=context.new_page();page.goto(server_url);page.locator('#create').click();page.wait_for_function('state?.state==="PLAYING"')
        page.evaluate('''() => {
            const original=ws.onmessage;ws.onmessage=e=>setTimeout(()=>original(e),100);
            const originalSend=ws.send.bind(ws);ws.send=data=>setTimeout(()=>{if(ws.readyState===1)originalSend(data)},100);
            window.walkTrace=[];window.tracing=true;
            // Sample with the same animation timestamp as prediction. Wall
            // time after software rendering includes variable drawing costs.
            const record=t=>{if(!window.tracing)return;const p=interpolated(t).find(p=>p.id===ids[0]);walkTrace.push({x:p.x,y:p.y,t});requestAnimationFrame(record)};requestAnimationFrame(record);
        }''')
        page.keyboard.down('w');page.wait_for_timeout(1400);page.keyboard.up('w')
        data=page.evaluate('tracing=false;walkTrace');page.wait_for_timeout(600)
        assert data[-1]['x']-data[0]['x']>6.8
        steps=[b['x']-a['x'] for a,b in zip(data,data[1:])]
        assert min(steps)>-.1,('Camera moved backwards under 200 ms delay',min(steps))
        assert all(abs(b['x']-a['x'])<max(.5,(b['t']-a['t'])/1000*7.2+.12) for a,b in zip(data,data[1:])),('Camera jumped relative to elapsed frame time',max(steps))
        assert page.evaluate('Math.abs(motion.get(ids[0]).x-state.players.find(p=>p.id===ids[0]).x)')<.5
    finally:context.close()


def test_minimal_start_menu_real_map_preview_and_solo_ai(browser,server_url):
    context=browser.new_context(viewport={'width':1366,'height':900},has_touch=True,is_mobile=True)
    try:
        page=context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
        page.goto(server_url);page.wait_for_function('previewMap.length>0&&renderer3d?.mapKey')
        assert page.locator('#menu input').count()==0
        assert page.locator('#menu select').count()==1
        assert page.locator('#menu button').all_text_contents()==['게임 시작','설정','종료']
        assert page.locator('#menu .poster,#quickCustom,#quickCheats,#skin0').count()==0
        assert page.request.get(server_url+'/health').json()['rooms']==0
        assert page.evaluate('renderer3d.mapKey===previewMap.join("")')
        for w,h in [(1366,900),(844,390),(390,844)]:
            page.set_viewport_size({'width':w,'height':h});page.wait_for_timeout(100)
            b=page.locator('#create').bounding_box();assert 0<=b['y']<b['y']+b['height']<=h
        page.screenshot(path=str(Path(__file__).resolve().parents[2]/'qa/menu-start.png'))
        page.locator('#create').click();page.wait_for_function('state?.state==="COUNTDOWN"')
        assert page.evaluate('ids.length===1&&state.quick&&state.players.length===6')
        assert page.evaluate('state.players.filter(p=>!p.bot).every(p=>Object.values(p.cheats).every(v=>!v))')
        page.locator('#pause').tap();page.locator('#settings .leave').click()
        page.locator('#mode').select_option('local');page.locator('#create').click()
        assert page.locator('#networkSetup').is_visible()
        assert not errors,errors
    finally:context.close()


def test_five_landmarks_and_local_map_selection(browser,server_url):
    context=browser.new_context(viewport={'width':1200,'height':760})
    try:
        page=context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
        page.goto(server_url);page.wait_for_function('arenaCatalog.length===5&&renderer3d?.mapKey')
        for i,key in enumerate(['freight','foundry','plaza','observatory','railway']):
            result=page.evaluate("""i=>{lastPreview=performance.now()+100000;showPreview(i);renderer3d.preview(performance.now());return {id:renderer3d.arenaId,landmark:!!renderer3d.staticRoot.getObjectByName('landmark-'+arenaCatalog[i].id),same:renderer3d.mapKey===arenaCatalog[i].grid.join('')}}""",i)
            assert result==dict(id=key,landmark=True,same=True)
            page.screenshot(path=str(Path(__file__).resolve().parents[2]/f'qa/map-{key}.png'))
        page.locator('#mode').select_option('local');page.locator('#create').click()
        assert page.locator('#mapChoice option').count()==5
        page.locator('#mapChoice').select_option('observatory');page.locator('#hostLocal').click()
        page.wait_for_function('state?.map_id==="observatory"')
        assert page.locator('#matchMap').input_value()=='observatory'
        page.locator('#matchMap').select_option('railway');page.wait_for_function('state.map_id==="railway"')
        assert not errors,errors
    finally:context.close()

``````

## tests/test_game.py
``````
import math
import random
from backend.game import Room, Player, clear, walk
from fastapi.testclient import TestClient
from backend.main import app


def ai_room():
    r=Room('TEST','ai')
    p=r.add('Tester')
    p.ready=True
    r.start()
    r.tick(3.1)
    return r,p


def test_ai_roster_and_no_cheats():
    r,p=ai_room()
    assert len(r.players)==6
    assert [sum(q.team==t for q in r.players.values()) for t in (0,1)]==[3,3]
    assert all(not any(q.cheats.values()) for q in r.players.values() if q.bot)
    for q in r.players.values():
        if q.bot:
            r.command(q,{'type':'toggle','key':'aim'})
            assert not q.cheats['aim']


def test_elimination_best_of_five():
    r,p=ai_room()
    for n in range(3):
        for q in r.players.values():
            if q.team==1:q.hp=0
        r.tick(.01)
        assert r.score==[n+1,0]
        if n<2:
            assert r.state=='ROUND_END'
            r.tick(4.1)
            r.tick(3.1)
    assert r.state=='MATCH_END'
    assert len(r.history)==3


def test_cheats_recoil_aim_and_damage():
    r,p=ai_room()
    p.x,p.y,p.yaw=2.5,1.5,.2
    target=next(q for q in r.players.values() if q.team==1)
    target.x,target.y,target.hp=6.5,1.5,100
    for q in r.players.values():q.bot=False
    for key in p.cheats:r.command(p,{'type':'toggle','key':key})
    p.ammo=30
    r.command(p,{'type':'input','aim':True,'fire':True})
    r.tick(.01)
    assert abs(p.yaw)<.001
    assert target.hp==75 and p.ammo==29 and p.kick==0
    for _ in range(3):
        p.cooldown=0
        r.shoot(p)
    assert target.hp==0 and target.deaths==1 and p.kills==1


def test_walls_and_reload():
    r,p=ai_room()
    assert not clear(9.5,6.5,15.5,6.5)
    p.ammo=0
    r.shoot(p)
    assert p.reload==1.5
    for q in r.players.values():q.bot=False
    r.tick(1.6)
    assert p.ammo==30 and p.reload==0
    p.x,p.y=1.5,1.5
    p.yaw=math.pi
    for _ in range(15):
        r.command(p,{'type':'input','f':1})
        r.tick(.03)
    assert p.x>=1.44


def test_local_capacity_ready_and_teams():
    r=Room('LOCAL','local')
    for i in range(6):
        p=r.add(str(i),i%2)
        p.ready=True
    r.start()
    assert len(r.players)==6 and not any(p.bot for p in r.players.values())


def test_timeout_and_disconnect():
    r,p=ai_room()
    for q in r.players.values(): q.bot=False
    r.timer=.001
    r.tick(.01)
    assert r.state=='PLAYING' and r.timer==30
    p.hp=75
    r.timer=.001
    r.tick(.01)
    assert r.score==[0,1]
    p.cheats['aim']=True
    r.remove(p.id)
    assert p.bot and not any(p.cheats.values())


def test_ai_finishes_match():
    random.seed(10)
    r,p=ai_room()
    p.bot=True
    for _ in range(24000):
        r.tick(1/30)
        if r.state=='MATCH_END': break
    assert r.state=='MATCH_END'
    assert max(r.score)==3 and sum(r.score)<=5


def test_websocket_and_invalid_room():
    with TestClient(app) as client:
        assert client.get('/').status_code==200
        assert client.get('/health').json()['status']=='ok'
        with client.websocket_connect('/ws') as ws:
            ws.send_json({'name':'Net','mode':'ai'})
            welcome=ws.receive_json()
            pid=welcome['ids'][0]
            ws.send_json({'type':'ready','id':pid})
            ws.send_json({'type':'start','id':pid})
            snap=ws.receive_json()
            assert snap['state']=='COUNTDOWN' and len(snap['players'])==6
        with client.websocket_connect('/ws') as ws:
            ws.send_json({'code':'MISSING'})
            assert ws.receive_json()['type']=='error'


def test_six_real_websocket_players():
    from contextlib import ExitStack
    with TestClient(app) as client, ExitStack() as stack:
        connections=[]
        code=''
        for i in range(6):
            ws=stack.enter_context(client.websocket_connect('/ws'))
            ws.send_json({'name':str(i),'mode':'local','code':code})
            w=ws.receive_json()
            code=w['code']
            connections.append((ws,w['ids'][0]))
        for ws,pid in connections:ws.send_json({'id':pid,'type':'ready'})
        # The final readiness message automatically starts the match.
        host=connections[0][0]
        for _ in range(30):
            snap=host.receive_json()
            if len(snap.get('players',[]))==6 and all(p['ready'] for p in snap['players']): break
        for _ in range(30):
            snap=host.receive_json()
            if snap.get('state')=='COUNTDOWN':break
        assert snap['state']=='COUNTDOWN'
        assert [sum(p['team']==t for p in snap['players']) for t in (0,1)]==[3,3]


def test_analog_acceleration_release_and_diagonal_speed():
    p=Player('a','Walker',0,x=2,y=1.5)
    walk(p,1,0,1/60)
    assert 0<p.vx<3.6
    for _ in range(30): walk(p,.5,0,1/60)
    assert abs(p.vx-4.0)<.001
    start=p.x
    for _ in range(30): walk(p,0,0,1/60)
    assert p.x-start<.2 and abs(p.vx)<.001
    a=Player('b','Diagonal',0,x=2,y=1.5)
    walk(a,1,1,.1)
    assert math.hypot(a.vx,a.vy)<=8.0


def test_absolute_yaw_and_malformed_input_are_safe():
    r,p=ai_room()
    r.command(p,{'type':'input','yaw':math.pi*3+.2,'seq':12,'f':float('nan'),'s':'bad'})
    assert abs(p.yaw-(-math.pi+.2))<.001 and p.seq==12
    assert p.inp['f']==p.inp['s']==0
    before=p.yaw
    r.command(p,{'type':'input','yaw':float('inf'),'seq':2})
    assert p.yaw==before and p.seq==12


def test_quick_ai_skips_lobby_for_two_humans_and_pings():
    with TestClient(app) as client:
        with client.websocket_connect('/ws') as ws:
            ws.send_json({'name':'Quick','mode':'ai','quick':True,'split':True,
                          'skins':['rogue','warden'],'cheats':[{'ammo':True},{'esp':True}]})
            w=ws.receive_json()
            assert w['quick'] and len(w['ids'])==2
            snap=ws.receive_json()
            assert snap['quick'] and snap['state']=='COUNTDOWN'
            humans=[p for p in snap['players'] if not p['bot']]
            assert len(humans)==2 and all(p['team']==0 for p in humans)
            assert [p['skin'] for p in humans]==['rogue','warden']
            assert set(humans[0]['cheats'])=={'aim','esp','recoil'} and humans[1]['cheats']['esp']
            assert all(not any(p['cheats'].values()) for p in snap['players'] if p['bot'])
            ws.send_json({'type':'ping','sent':123})
            for _ in range(10):
                reply=ws.receive_json()
                if reply['type']=='pong':break
            assert reply=={'type':'pong','sent':123}


def test_quick_ai_rematch_starts_without_readiness_ui():
    r,p=ai_room()
    r.quick=True
    p.skin='rogue'
    p.cheats['esp']=True
    r.state='MATCH_END'
    r.score=[3,1]
    r.command(p,{'type':'rematch'})
    assert r.state=='COUNTDOWN' and r.score==[0,0] and r.round==1
    assert len(r.players)==6 and p.skin=='rogue' and p.cheats['esp']
    assert all(not any(q.cheats.values()) for q in r.players.values() if q.bot)


def test_tap_survives_release_before_the_simulation_tick():
    r,p=ai_room()
    for q in r.players.values():q.bot=False
    r.command(p,{'type':'shoot','serial':1})
    r.command(p,{'type':'input','fire':False})
    r.tick(1/60)
    assert p.shots==1
    r.command(p,{'type':'shoot','serial':1})
    for _ in range(20):r.tick(1/60)
    assert p.shots==1,'Repeated tap serial fired twice'
    r.command(p,{'type':'shoot','serial':2})
    r.tick(1/60)
    assert p.shots==2


def test_vertical_aim_hits_body_but_not_the_sky():
    r,p=ai_room()
    for q in r.players.values():q.bot=False
    target=next(q for q in r.players.values() if q.team==1)
    p.x,p.y,p.yaw,p.pitch=2.5,1.5,0,.7
    target.x,target.y,target.hp=6.5,1.5,100
    p.cheats['recoil']=True
    r.shoot(p)
    assert target.hp==100
    p.cooldown=0
    r.command(p,{'type':'input','pitch':math.atan2(-.3,4)})
    r.shoot(p)
    assert target.hp==75
    r.command(p,{'type':'input','pitch':float('nan')})
    assert math.isfinite(p.pitch)


def test_walk_is_independent_of_render_frame_rate():
    positions=[]
    for rate in [20,60,120]:
        p=Player('walk','Walker',0,x=2.5,y=1.5)
        for _ in range(rate):walk(p,1,0,1/rate)
        positions.append(p.x)
    assert max(positions)-min(positions)<.00001

``````

## tests/test_graphics_browser.py
``````
"""Optional real WebGL material, resource lifetime and quality checks."""
import os
import pytest
from test_browser import browser,server_url

pytestmark=pytest.mark.skipif(os.getenv('CHEAT_FPS_BROWSER_TESTS')!='1',reason='Opt-in browser checks')


def test_all_map_materials_match_collision_and_survive_repeated_map_changes(browser,server_url):
    context=browser.new_context(viewport={'width':800,'height':500})
    try:
        page=context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
        page.on('console',lambda m:errors.append(m.text) if m.type=='error' else None)
        page.goto(server_url);page.wait_for_function('arenaCatalog.length===5&&renderer3d?.mapKey',timeout=60000)
        counts=[]
        for cycle in range(3):
            for i in range(5):
                data=page.evaluate('''i=>{
                    lastPreview=performance.now()+100000;showPreview(i);const r=renderer3d,a=arenaCatalog[i];r.preview(30000);
                    const covers=r.staticRoot.userData.coverFootprints;
                    const overlap=covers.every(c=>Array.from({length:c.d},(_,y)=>Array.from({length:c.w},(_,x)=>a.grid[c.y+y][c.x+x]==='1').every(Boolean)).every(Boolean));
                    return {size:[r.mapWidth,r.mapDepth],overlap,parts:r.staticRoot.userData.detailParts,
                        textured:r.staticRoot.children.filter(o=>o.name.startsWith('architecture-')).every(o=>o.material.isMeshStandardMaterial||o.material.isMeshPhysicalMaterial||o.material.userData.surface==='glow'),
                        maps:Array.from(r.surfaces.textures.values()).every(m=>m.map.image.width===512&&m.normalMap.image.width===512&&m.roughnessMap.image.width===512),
                        environment:!!r.scene.environment,background:!!r.scene.background,textures:r.renderer.info.memory.textures,geometries:r.renderer.info.memory.geometries};
                }''',i)
                assert data['size']==[60,35] and data['overlap']
                assert data['parts']>200 and data['textured'] and data['maps']
                assert data['environment'] and data['background']
            counts.append((data['textures'],data['geometries']))
        assert counts[-1][0]<=counts[0][0]+3 and counts[-1][1]<=counts[0][1]+3,counts
        assert not errors,errors
    finally:context.close()


def test_detailed_models_and_quality_switches_render_in_a_live_match(browser,server_url):
    context=browser.new_context(viewport={'width':800,'height':500},has_touch=True,is_mobile=True)
    try:
        page=context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
        page.on('console',lambda m:errors.append(m.text) if m.type=='error' else None)
        page.goto(server_url);page.locator('#create').click();page.wait_for_function('state?.state==="PLAYING"',timeout=60000)
        data=page.evaluate('''()=>({actors:renderer3d.actors.size,details:Array.from(renderer3d.actors.values()).map(a=>a.records.length),
            kinds:Object.keys(renderer3d.batches),capacity:Object.values(renderer3d.batches).every(b=>b.mesh.count<=b.mesh.instanceMatrix.count),
            bevel:renderer3d.weapon.children.some(o=>o.geometry?.type==='RoundedBoxGeometry'),shadows:renderer3d.actorShadows.count})''')
        assert data['actors']==6 and min(data['details'])>=60
        assert {'skin:sphere','glass:box','fabric:capsule'}<=set(data['kinds'])
        assert data['capacity'] and data['bevel'] and data['shadows']==6
        page.locator('#pause').tap()
        for value,size,enabled in [('6',1024,False),('2',2048,True),('4',1024,True)]:
            page.locator('#quality').select_option(value)
            assert page.evaluate('renderer3d.renderer.shadowMap.enabled') is enabled
            assert page.evaluate('renderer3d.sun.shadow.mapSize.x')==size
        page.locator('#settingsClose').click()
        assert not errors,errors
    finally:context.close()

``````

## tests/test_local_browser.py
``````
import os
import pytest
from test_browser import browser,server_url

pytestmark=pytest.mark.skipif(os.getenv('CHEAT_FPS_BROWSER_TESTS')!='1',reason='Opt-in browser checks')


def open_local(page,url,split=False,code=''):
    page.goto(url);page.locator('#mode').select_option('local');page.locator('#create').click()
    if split:page.locator('#split').check()
    if code:page.locator('#code').fill(code);page.locator('#join').click()
    else:page.locator('#hostLocal').click()
    page.wait_for_function('state?.state==="LOBBY"')


def test_one_device_split_waits_for_both_ready_then_starts_two_players(browser,server_url):
    context=browser.new_context(viewport={'width':1180,'height':760},has_touch=True,is_mobile=True)
    errors=[]
    try:
        page=context.new_page();page.on('pageerror',lambda e:errors.append(str(e)))
        open_local(page,server_url,split=True)
        assert page.locator('[data-ready]').count()==2 and page.locator('#start').is_disabled()
        a,b=page.evaluate('ids')
        page.locator(f'[data-ready="{a}"]').tap()
        page.wait_for_function('state.players.find(p=>p.id===ids[0]).ready')
        assert page.evaluate('state.state==="LOBBY"&&!state.players.find(p=>p.id===ids[1]).ready')
        assert page.locator('#start').is_disabled()
        page.locator(f'[data-ready="{b}"]').tap()
        page.wait_for_function('state?.state==="COUNTDOWN"')
        assert page.evaluate('state.players.length===2&&state.players.every(p=>!p.bot)&&[0,1].every(t=>state.players.filter(p=>p.team===t).length===1)')
        page.wait_for_function('state?.state==="PLAYING"')
        assert page.locator('.joystick').count()==2 and page.locator('#playUI').is_visible()
        assert not errors,errors
    finally:context.close()


def test_two_devices_cannot_start_on_one_team_then_auto_start_one_vs_one(browser,server_url):
    context=browser.new_context(viewport={'width':1180,'height':760})
    errors=[]
    try:
        a=context.new_page();b=context.new_page()
        for page in [a,b]:page.on('pageerror',lambda e:errors.append(str(e)))
        open_local(a,server_url);open_local(b,server_url,code=a.evaluate('state.code'))
        a.wait_for_function('state.players.length===2')
        a.locator('[data-ready]').click();b.locator('[data-ready]').click()
        a.wait_for_function('state.players.every(p=>p.ready)')
        assert a.evaluate('state.state==="LOBBY"&&!state.can_start')
        assert a.locator('#start').is_disabled() and '각각 1명' in a.locator('#controlsInfo').inner_text()
        b.locator('[data-team]').select_option('1')
        b.wait_for_function('state.players.find(p=>p.id===ids[0]).team===1&&!state.players.find(p=>p.id===ids[0]).ready')
        assert b.evaluate('state.state==="LOBBY"')
        b.locator('[data-ready]').click()
        for page in [a,b]:
            page.wait_for_function('state?.state==="COUNTDOWN"')
            assert page.evaluate('ids.length===1&&state.players.length===2&&state.players.every(p=>!p.bot)')
        assert not errors,errors
    finally:context.close()

``````

## tests/test_local_start.py
``````
from contextlib import ExitStack

import pytest
from fastapi.testclient import TestClient
from backend.game import Room
from backend.main import app


@pytest.mark.parametrize('blue,red',[(1,1),(2,1),(1,2),(3,3)])
def test_any_occupied_teams_start_when_the_last_human_readies_without_filling_bots(blue,red):
    room=Room('LOCAL','local')
    players=[room.add(str(i),team) for team,count in [(0,blue),(1,red)] for i in range(count)]
    for p in players[:-1]:
        room.command(p,dict(type='ready'))
        assert room.state=='LOBBY'
    room.command(players[-1],dict(type='ready'))
    assert room.state=='COUNTDOWN' and room.round==1
    assert len(room.players)==blue+red and not any(p.bot for p in players)
    assert [sum(p.team==t for p in players) for t in (0,1)]==[blue,red]


@pytest.mark.parametrize('blue,red',[(1,0),(0,2),(0,0)])
def test_empty_team_or_empty_lobby_cannot_start_even_if_everyone_readies(blue,red):
    room=Room('LOCAL','local')
    for team,count in [(0,blue),(1,red)]:
        for i in range(count):room.command(room.add(str(i),team),dict(type='ready'))
    assert room.state=='LOBBY' and not room.snapshot()['can_start']
    with pytest.raises(ValueError):room.start()


def test_one_unready_player_blocks_three_player_match_and_the_host_cannot_bypass_it():
    room=Room('LOCAL','local');a=room.add('Host',0);b=room.add('Guest',1);c=room.add('Third',0)
    room.command(a,dict(type='ready'));room.command(b,dict(type='ready'))
    assert room.state=='LOBBY' and not c.ready
    with pytest.raises(ValueError):room.command(a,dict(type='start'))
    room.command(c,dict(type='ready'));assert room.state=='COUNTDOWN'


def test_team_change_resets_readiness_and_one_sided_ready_players_stay_in_lobby():
    room=Room('LOCAL','local');a=room.add('Host',0);b=room.add('Guest',0)
    room.command(a,dict(type='ready'));room.command(b,dict(type='ready'))
    assert room.state=='LOBBY' and '각각 1명' in room.snapshot()['start_hint']
    room.command(b,dict(type='custom',team=1));assert not b.ready
    assert room.state=='LOBBY' and not room.snapshot()['can_start']
    room.command(b,dict(type='ready'));assert room.state=='COUNTDOWN'


def test_map_change_resets_everyone_before_automatic_start():
    room=Room('LOCAL','local');a=room.add('Host',0);b=room.add('Guest',1)
    room.command(a,dict(type='ready'));room.command(a,dict(type='map',map_id='railway'))
    assert not a.ready and not b.ready
    room.command(b,dict(type='ready'));assert room.state=='LOBBY'
    room.command(a,dict(type='ready'));assert room.state=='COUNTDOWN' and room.map_id=='railway'


def test_one_vs_one_finishes_a_best_of_five_and_can_return_to_lobby_and_restart():
    room=Room('LOCAL','local');a=room.add('Host',0);b=room.add('Guest',1)
    for p in [a,b]:room.command(p,dict(type='ready'))
    for n in range(3):
        room.tick(3.1);assert room.state=='PLAYING'
        b.hp=0;room.tick(.01);assert room.score==[n+1,0]
        if n<2:room.tick(4.1)
    assert room.state=='MATCH_END' and len(room.players)==2
    room.command(a,dict(type='lobby'));assert room.state=='LOBBY' and not any(p.ready for p in room.players.values())
    for p in [a,b]:room.command(p,dict(type='ready'))
    assert room.state=='COUNTDOWN' and room.score==[0,0] and room.round==1


def until(ws,predicate):
    for _ in range(60):
        data=ws.receive_json()
        if predicate(data):return data
    raise AssertionError('Expected WebSocket state was not received')


def test_real_split_connection_requires_both_players_to_ready_then_auto_starts():
    with TestClient(app) as client,client.websocket_connect('/ws') as ws:
        ws.send_json(dict(mode='local',split=True));welcome=ws.receive_json();a,b=welcome['ids']
        ws.send_json(dict(type='ready',id=a))
        state=until(ws,lambda d:d.get('type')=='state' and d['players'][0]['ready'])
        assert state['state']=='LOBBY' and not state['players'][1]['ready'] and not state['can_start']
        ws.send_json(dict(type='start',id=a));assert until(ws,lambda d:d.get('type')=='error')
        ws.send_json(dict(type='ready',id=b))
        state=until(ws,lambda d:d.get('state')=='COUNTDOWN')
        assert len(state['players'])==2 and all(p['ready'] and not p['bot'] for p in state['players'])
        assert {p['team'] for p in state['players']}=={0,1}


def test_real_separate_connections_can_start_one_vs_one_after_team_assignment():
    with TestClient(app) as client,ExitStack() as stack:
        host=stack.enter_context(client.websocket_connect('/ws'));host.send_json(dict(mode='local'))
        a=host.receive_json();guest=stack.enter_context(client.websocket_connect('/ws'))
        guest.send_json(dict(code=a['code']));b=guest.receive_json()
        host.send_json(dict(type='ready',id=a['ids'][0]))
        guest.send_json(dict(type='custom',team=1,id=b['ids'][0]))
        guest.send_json(dict(type='ready',id=b['ids'][0]))
        state=until(host,lambda d:d.get('state')=='COUNTDOWN')
        assert len(state['players'])==2 and {p['team'] for p in state['players']}=={0,1}

``````

## tests/test_train.py
``````
import math
from unittest.mock import patch

import pytest
from fastapi.testclient import TestClient

from backend.arenas import ARENAS
from backend.game import Room, clear
from backend.hazards import train_pose, train_hits
from backend.main import app

C=ARENAS['railway']['train']
HIT_TIME=3+44/5.6


def match():
    room=Room('TRAIN','local','railway')
    for i in range(6): room.add(str(i),i//3).ready=True
    room.start();room.state='PLAYING';room.timer=120
    return room,list(room.players.values())


def test_train_warning_travel_wait_and_reset():
    assert train_pose(0,C)['warning'] and not train_pose(2.99,C)['active']
    assert train_pose(3,C)['x']==-14 and train_pose(3,C)['active']
    assert train_pose(8,C)['x']==pytest.approx(14)
    assert not train_pose(20,C)['active'] and not train_pose(20,C)['warning']
    assert train_pose(24,C)['warning'] and train_pose(27,C)['x']==-14


def test_continuous_collision_catches_a_train_crossing_between_ticks():
    assert train_hits(3,19,(30,17.5),(30,17.5),C)
    assert train_hits(10.4,11.4,(30,14.5),(30,20.5),C)
    assert not train_hits(3,19,(30,20),(30,20),C)
    assert not train_hits(0,2.99,(30,17.5),(30,17.5),C)


def test_offmap_reset_does_not_sweep_through_the_arena():
    assert not train_hits(23.9,24.1,(30,17.5),(30,17.5),C)
    assert not train_hits(19,27.01,(30,17.5),(30,17.5),C)


@pytest.mark.parametrize('bot',[False,True])
def test_train_kills_humans_and_noncheating_ai_once_without_kill_credit(bot):
    room,players=match();victim=players[0]
    victim.bot=bot;victim.x,victim.y=30,17.5;room.train_time=HIT_TIME
    with patch.object(room,'ai',return_value=None):
        room.tick(1/60);room.tick(1/60)
    assert victim.hp==0 and victim.deaths==1
    assert sum(p.kills for p in players)==0
    assert room.log==[dict(killer='기차',victim=victim.name,team=None,cause='train')]
    assert room.state=='PLAYING' and len(room.snapshot()['players'])==6
    assert not any(victim.cheats.values())


def test_train_team_elimination_ends_the_round_and_freezes_the_train():
    room,players=match()
    for p in players[:3]:p.x,p.y=30,17.5
    room.train_time=HIT_TIME;room.tick(1/60)
    assert room.state=='ROUND_END' and room.score==[0,1]
    assert all(p.hp==0 for p in players[:3]) and all(p.hp==100 for p in players[3:])
    elapsed=room.train_time;room.tick(.5);assert room.train_time==elapsed
    room.new_round();assert room.train_time==0 and all(p.hp==100 for p in players)
    room.tick(1);assert room.train_time==0


def test_train_can_end_a_match():
    room,players=match();room.score=[0,2]
    for p in players[:3]:p.x,p.y=30,17.5
    room.train_time=HIT_TIME;room.tick(1/60)
    assert room.state=='MATCH_END' and room.score==[0,3]
    assert all(p.deaths==1 for p in players[:3])


def test_simultaneous_elimination_replays_the_same_round_without_awarding_a_team():
    room,players=match();old_round=room.round
    for p in players:p.x,p.y=30,17.5
    room.train_time=HIT_TIME;room.tick(1/60)
    assert room.round==old_round and room.state=='COUNTDOWN' and room.score==[0,0]
    assert room.history==[] and all(p.deaths==1 and p.hp==100 for p in players)
    assert room.train_time==0 and '동시 녹아웃' in room.message


def test_train_blocks_sight_and_bullets_and_the_crossing_is_clear_between_passes():
    room,players=match();p,q=players[0],players[3]
    p.x,p.y,p.yaw=30,14.5,math.pi/2;q.x,q.y=30,20.5
    assert clear(p.x,p.y,q.x,q.y,room.map)
    room.train_time=HIT_TIME;assert not room.sight(p.x,p.y,q.x,q.y)
    room.shoot(p);assert q.hp==100
    room.train_time=20;p.cooldown=0;assert room.sight(p.x,p.y,q.x,q.y)
    room.shoot(p);assert q.hp==75


def test_train_state_is_room_scoped_and_cannot_be_set_by_client_input():
    room,players=match();room.train_time=8
    other=Room('OTHER','local','railway')
    room.command(players[0],dict(type='input',train_time=0,train={'x':999}))
    assert room.snapshot()['train']['x']==pytest.approx(14)
    assert other.snapshot()['train']['elapsed']==0
    assert Room('NO','ai','freight').snapshot()['train'] is None


def test_train_metadata_and_clock_reach_websocket_clients():
    with TestClient(app) as client:
        with patch('backend.main.secrets.choice',return_value='railway'),client.websocket_connect('/ws') as ws:
            ws.send_json(dict(mode='ai',quick=True))
            welcome=ws.receive_json();snapshot=ws.receive_json()
            assert welcome['arena']['train']==C
            assert snapshot['train']==train_pose(0,C)
            assert snapshot['map_id']=='railway' and len(snapshot['players'])==6

``````

## tests/test_train_browser.py
``````
"""Opt-in checks with real WebSockets and the bundled renderer; no production test APIs."""
import os
import socket
import subprocess
import sys
import time
from pathlib import Path
from urllib.request import urlopen

import pytest
from test_browser import browser

pytestmark=pytest.mark.skipif(os.getenv('CHEAT_FPS_BROWSER_TESTS')!='1',reason='Opt-in browser checks')


@pytest.fixture(scope='module')
def train_server():
    with socket.socket() as sock:
        sock.bind(('127.0.0.1',0));port=sock.getsockname()[1]
    code='''
import uvicorn
from backend.main import app,rooms
from backend.game import Room
Room.ai=lambda self,p,dt:None
@app.post('/__test/train/{action}')
def control_train(action:str):
    for room in rooms.values():
        if action=='start':
            for p in room.players.values():p.ready=True
            room.start()
        elif action=='move':
            room.train_time=6
            for p in room.players.values():p.y=2.5
        elif action=='hit':
            room.train_time=3+44/5.6
            victims=[]
            for p in room.players.values():
                if not any(q.team==p.team for q in victims):
                    p.x,p.y=30,17.5;victims.append(p)
            return {'victims':[p.id for p in victims]}
    return {'ok':True}
uvicorn.run(app,host='127.0.0.1',port=PORT,log_level='error')
'''.replace('PORT',str(port))
    proc=subprocess.Popen([sys.executable,'-c',code],cwd=Path(__file__).resolve().parents[1],stdout=subprocess.DEVNULL,stderr=subprocess.PIPE)
    url=f'http://127.0.0.1:{port}'
    try:
        for _ in range(100):
            if proc.poll() is not None:raise RuntimeError(proc.stderr.read().decode())
            try:urlopen(url+'/health',timeout=.2);break
            except OSError:time.sleep(.05)
        else:raise RuntimeError('Server startup timeout')
        yield url
    finally:proc.terminate();proc.wait(timeout=5);proc.stderr.close()


@pytest.mark.parametrize('fallback',[False,True])
def test_three_split_clients_share_train_motion_collision_and_spectating(browser,train_server,fallback):
    # Three clients share one software GPU in CI. Low quality and a small
    # framebuffer isolate synchronization; high/balanced are tested separately.
    context=browser.new_context(viewport={'width':480,'height':320},has_touch=True,is_mobile=True)
    context.add_init_script("localStorage.setItem('cheat-fps-options',JSON.stringify({quality:6}))")
    errors=[]
    try:
        pages=[context.new_page() for _ in range(3)]
        for page in pages:
            page.on('pageerror',lambda e:errors.append(str(e)))
            if fallback:page.add_init_script("window.CheatRenderer3D=undefined;Object.defineProperty(window,'CheatRenderer3D',{value:undefined,writable:false})")
            page.goto(train_server)
            page.locator('#mode').select_option('local');page.locator('#create').click();page.locator('#split').check()
        pages[0].locator('#mapChoice').select_option('railway');pages[0].locator('#hostLocal').click()
        pages[0].wait_for_function('state?.state==="LOBBY"');code=pages[0].evaluate('state.code')
        for page in pages[1:]:
            page.locator('#code').fill(code);page.locator('#join').click();page.wait_for_function('state?.state==="LOBBY"')
        pages[0].wait_for_function('state.players.length===6')
        pages[0].request.post(train_server+'/__test/train/start')
        for page in pages:page.wait_for_function('state?.state==="PLAYING"')
        assert pages[0].evaluate('renderTrain.warning&&!renderTrain.active')
        if not fallback:assert pages[0].evaluate('!renderer3d.trainRoot.visible')
        pages[0].request.post(train_server+'/__test/train/move')
        for page in pages:page.wait_for_function('renderTrain?.active')
        starts=[page.evaluate('renderTrain.x') for page in pages]
        pages[0].wait_for_timeout(300)
        for i,page in enumerate(pages):
            # Animation delivery can be slower on a shared software GPU;
            # speed is asserted against the server clock in test_train.py.
            page.wait_for_function('(x)=>renderTrain.active&&renderTrain.x>x+.3',arg=starts[i],timeout=15000)
            if not fallback:
                assert page.evaluate('renderer3d.trainRoot.visible&&Math.abs(renderer3d.trainRoot.position.x-(renderTrain.x-renderer3d.mapWidth/2))<.001')
            else:
                assert page.evaluate('renderer3d===null&&ray(renderTrain.x,13,Math.PI/2).train===true')
            # The renderer interpolates the server clock, bounded to 250 ms.
            page.wait_for_function('renderTrain.elapsed>=state.train.elapsed&&renderTrain.elapsed-state.train.elapsed<=.251')
        result=pages[0].request.post(train_server+'/__test/train/hit').json();victims=result['victims']
        for page in pages:
            page.wait_for_function('(v)=>v.every(id=>state.players.find(p=>p.id===id).hp===0)',arg=victims)
            assert page.evaluate('(v)=>v.every(id=>state.players.find(p=>p.id===id).deaths===1)',victims)
            assert page.evaluate('state.log.filter(e=>e.cause==="train").length===2')
            assert page.evaluate('state.state==="PLAYING"&&state.players.every(p=>p.kills===0)')
        # First client owns one player on each team; both independently spectate.
        assert pages[0].evaluate('ids.every(id=>state.players.find(p=>p.id===id).hp===0)')
        assert pages[0].locator('.spectate-button:not(.hidden)').count()==2
        assert not errors,errors
    finally:context.close()

``````

## tests/test_update.py
``````
import pytest
from backend.game import Room,wall
from backend.weapons import WEAPONS
from test_weapons import duel

@pytest.mark.parametrize('key',WEAPONS)
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

def test_crane_grid_lifts_transports_waits_and_lands_without_crushing():
 r,p,q=duel();r.update_mechanisms();assert wall(29,8,r.map)
 r.train_time=5;r.update_mechanisms();assert not wall(29,8,r.map) and r.crane_state['lift']>2
 q.x,q.y=29,27
 r.train_time=9;r.update_mechanisms();assert r.crane_state['blocked'] and r.crane_state['lift']>=3.5
 r.train_time=22;r.update_mechanisms();assert r.crane_state['blocked'] and not wall(29,27,r.map)
 q.x,q.y=50,2;r.train_time+=1;r.update_mechanisms();assert wall(29,27,r.map) and not wall(29,8,r.map)
 assert not r.crane_state['moving'] and r.crane_state['lift']==0
 r.train_time=45;r.update_mechanisms();assert r.crane_state['moving']

def test_clock_damage_cooldown_knockout_and_snapshot_time():
 r=Room('CLOCK','local','plaza');p=r.add('p');q=r.add('q',1);r.state='PLAYING';r.timer=120
 p.x,p.y=37,17.5;q.x,q.y=3,3
 assert not r.clock_hit(p,(37,17.5),0,.016);assert p.hp==65
 r.clock_hit(p,(37,17.5),0,.016);assert p.hp==65
 p.hazard_cooldown=0;r.clock_hit(p,(37,17.5),0,.016);assert p.hp==30
 p.hazard_cooldown=0;assert r.clock_hit(p,(37,17.5),0,.016);assert p.hp==0 and p.deaths==1
 assert r.snapshot()['log'][-1]['cause']=='clock'

def test_ai_selects_close_weapon_without_cheats():
 r,p,q=duel();p.bot=True;p.cheats=dict.fromkeys(p.cheats,False);q.x=7
 r.ai(p,.05);assert p.weapon=='shotgun' and not any(p.cheats.values())

``````

## tests/test_update_browser.py
``````
import os
from pathlib import Path
import pytest
from test_browser import browser,server_url
pytestmark=pytest.mark.skipif(os.getenv('CHEAT_FPS_BROWSER_TESTS')!='1',reason='Opt-in browser checks')
def test_mechanisms_effects_environment_and_pose(browser,server_url):
 context=browser.new_context(viewport={'width':1000,'height':650})
 page=context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto(server_url);page.wait_for_function('arenaCatalog.length===5&&renderer3d?.mapKey',timeout=60000)
 page.evaluate('lastPreview=performance.now()+1e7')
 out=Path(__file__).resolve().parents[2]/'qa';out.mkdir(exist_ok=True)
 for key in ['freight','foundry','plaza','observatory','railway']:
  data=page.evaluate('''key=>{
   const r=renderer3d,a=arenaCatalog.find(a=>a.id===key);r.loadMap(a.grid,a);r.resize(1000,650,2);r.updateMechanisms(5,{x:27,y:16.5,w:6,h:2,lift:7});
   const p={id:'test',skin:'scout',team:0,x:25,y:22,yaw:-Math.PI/2,pitch:0,hp:100,vx:0,vy:0,shots:0,reload:0,weapon:'rifle',cheats:{recoil:false}};
   r.inspect([p],1000,{x:30,y:17.5,height:4},1.15,.48,45);
   return {id:r.mechanisms.id,load:r.mechanisms.load?.position.y,hand:r.mechanisms.hand?.rotation.y,dome:r.mechanisms.dome?.rotation.y,env:!!r.staticRoot.getObjectByName('environment-'+key)};
  }''',key)
  assert data['env']
  if key=='freight':assert data['load']==7
  if key=='plaza':assert data['hand']<0
  if key=='observatory':assert data['dome']>.5
  page.locator('#world3d').screenshot(path=str(out/(key+'.png')))
 data=page.evaluate('''()=>{
  const r=renderer3d,a=arenaCatalog.find(a=>a.id==='railway');r.loadMap(a.grid,a);const p={id:'test',skin:'scout',team:0,x:7,y:17.5,yaw:0,pitch:0,hp:100,vx:0,vy:0,shots:0,reload:0,weapon:'rifle',cheats:{recoil:false}};
  r.inspect([p],2000,p,.7,.15,3.5);p.shots=1;r.inspect([p],2016,p,.7,.15,3.5);
  const op=r.actors.get('test');return {flashes:r.combatEffects.flashes.get('test').mesh.visible,cases:r.combatEffects.cases.count,gunHeight:op.gun.position.y,finite:op.records.every(p=>p.node.matrixWorld.elements.every(Number.isFinite))};
 }''')
 assert data['flashes'] and data['cases']>0 and data['gunHeight']>.35 and data['finite'],data
 page.locator('#world3d').screenshot(path=str(out/'operator.png'))
 assert not errors,errors
 context.close()

``````

## tests/test_weapons.py
``````
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
    far.x,far.y=8,1.5;ally.x,ally.y=4,1.5
    p.weapon='shotgun';r.shoot(p)
    assert q.hp==0 and far.hp==100 and ally.hp==100


@pytest.mark.parametrize('key',WEAPONS)
def test_walls_and_train_block_every_weapon(key):
    r,p,q=duel();p.weapon=key;p.x,p.y=9,6;q.x,q.y=17,6;r.shoot(p);assert q.hp==100
    r=Room('TRAIN','local','railway');p=r.add('Shooter',0);q=r.add('Target',1)
    r.state='PLAYING';r.train_time=3+44/5.6
    p.weapon=key;p.x,p.y,p.yaw,p.pitch=30,14.5,math.pi/2,0;q.x,q.y=30,20.5
    r.shoot(p);assert q.hp==100


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

``````

## tests/test_weapons_browser.py
``````
"""Live WebSocket selection, split ownership and actual first/third person models."""
import os
import pytest
from test_browser import browser,server_url,start_split_ai

pytestmark=pytest.mark.skipif(os.getenv('CHEAT_FPS_BROWSER_TESTS')!='1',reason='Opt-in browser checks')


def test_live_weapon_switch_fire_reload_and_split_ownership(browser,server_url):
    context=browser.new_context(viewport={'width':1000,'height':700},has_touch=True,is_mobile=True)
    try:
        page=context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
        page.goto(server_url);page.evaluate('options.quality=6;resize()');start_split_ai(page)
        page.wait_for_function('state?.state==="PLAYING"',timeout=60000)
        for key,capacity in [('pistol',12),('shotgun',6),('rifle',30)]:
            page.locator('[data-action="weapon"][data-slot="0"]').tap()
            page.locator(f'[data-weapon="{key}"][data-slot="0"]').tap()
            page.wait_for_function('(key)=>state.players.find(p=>p.id===ids[0]).weapon===key',arg=key)
            page.wait_for_timeout(400)
            assert page.evaluate('state.players.find(p=>p.id===ids[1]).weapon')=='rifle'
            assert page.evaluate('state.players.find(p=>p.id===ids[0]).ammo')==capacity
            before=page.evaluate('state.players.find(p=>p.id===ids[0]).shots')
            page.evaluate('tapFire(0)')
            page.wait_for_function('(before)=>state.players.find(p=>p.id===ids[0]).shots>before',arg=before)
            assert page.evaluate('state.players.find(p=>p.id===ids[0]).ammo')==capacity-1
            page.evaluate("""()=>{window.reloadSeen=false;ws.addEventListener('message',e=>{const d=JSON.parse(e.data);if(d.type==='state'&&d.players.find(p=>p.id===ids[0])?.reload>0)window.reloadSeen=true;});}""")
            page.locator('[data-action="reload"][data-slot="0"]').tap()
            page.wait_for_function('window.reloadSeen')
            page.wait_for_function('(capacity)=>state.players.find(p=>p.id===ids[0]).ammo===capacity',arg=capacity,timeout=15000)
        page.keyboard.press('o');page.keyboard.press('8');page.wait_for_function('state.players.find(p=>p.id===ids[1]).weapon==="pistol"')
        assert page.evaluate('state.players.find(p=>p.id===ids[0]).weapon')=='rifle'
        models=page.evaluate('''()=>Object.fromEntries(Object.entries(renderer3d.weaponModels).map(([key,m])=>[key,{parts:(()=>{let n=0;m.root.traverse(o=>{if(o.isMesh)n++;});return n;})(),flash:!!m.flash,light:!!m.light}]))''')
        assert set(models)=={'rifle','shotgun','pistol'}
        assert all(m['parts']>20 and m['flash'] and m['light'] for m in models.values())
        assert not errors,errors
    finally:context.close()


def test_articulated_operator_and_all_landmark_details(browser,server_url):
    context=browser.new_context(viewport={'width':736,'height':500})
    try:
        page=context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
        page.goto(server_url);page.wait_for_function('arenaCatalog.length===5&&renderer3d?.mapKey',timeout=60000)
        data=page.evaluate('''()=>{
            lastPreview=performance.now()+1e6;const r=renderer3d;r.resize(736,500,6);
            const maps=arenaCatalog.map(a=>{r.loadMap(a.grid,a);const l=r.staticRoot.getObjectByName('landmark-'+a.id);return {id:a.id,parts:l.userData.detailParts||0,diesel:!!l.getObjectByName('diesel-locomotive')};});
            const p={id:'inspect',skin:'scout',team:0,x:7,y:17.5,yaw:0,pitch:0,vx:5,vy:0,hp:100,shots:0,reload:0,weapon:'shotgun',cheats:{recoil:false}};
            r.inspect([p],1000,p);const a=r.actors.get(p.id),first=a.legs[0].boot.position.toArray();
            p.x+=.6;r.inspect([p],1100,p);const second=a.legs[0].boot.position.toArray();
            const finite=a.records.every(v=>v.node.matrixWorld.elements.every(Number.isFinite));
            const feet=a.legs.every(v=>v.boot.position.y>=.037);
            const bones=a.arms.every(v=>Math.abs(v.upper.scale.y-.31)<.003&&Math.abs(v.lower.scale.y-.30)<.003);
            p.hp=0;r.inspect([p],1200,p);r.inspect([p],1800,p);
            return {maps,finite,feet,bones,first,second,parts:a.records.length,fall:a.root.rotation.z};
        }''')
        assert all(m['parts']>=40 or m['diesel'] for m in data['maps'])
        assert data['finite'] and data['feet'] and data['bones'],data
        assert data['first']!=data['second'] and data['parts']>=100 and data['fall']>1.5
        assert not errors,errors
    finally:context.close()

``````

## tests/test_webkit.py
``````
"""WebKit engine touch routing checks; these do not emulate physical iPad OS UI."""
import os
import pytest
from test_browser import server_url, center, shots, start_split_ai

pytestmark=pytest.mark.skipif(os.getenv('CHEAT_FPS_WEBKIT_TESTS')!='1',reason='Opt-in WebKit checks')

@pytest.fixture
def safari(server_url):
    from playwright.sync_api import sync_playwright
    with sync_playwright() as pw:
        browser=pw.webkit.launch(headless=True)
        context=browser.new_context(viewport={'width':1180,'height':820},has_touch=True,is_mobile=True)
        page=context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
        page.goto(server_url);start_split_ai(page)
        page.wait_for_function('state?.state==="COUNTDOWN"')
        print('WebKit renderer:',page.evaluate('renderer3d ? "WebGL2" : "Canvas fallback"'))
        yield page
        context.close();browser.close()
        assert not errors,errors


def finger(page,kind,identifier,x,y):
    return page.evaluate('''({kind,id,x,y})=>{
        window.testTouches ||= new Map();
        const prev=testTouches.get(id),target=prev?.target||document.elementFromPoint(x,y);
        const touch={identifier:id,target,clientX:x,clientY:y,pageX:x,pageY:y,screenX:x,screenY:y,radiusX:3,radiusY:3,force:1};
        if(kind==='touchend'||kind==='touchcancel')testTouches.delete(id);else testTouches.set(id,touch);
        const touches=Array.from(testTouches.values());
        const e=new Event(kind,{bubbles:true,cancelable:true});
        Object.defineProperties(e,{touches:{value:touches},targetTouches:{value:touches.filter(t=>t.target===target)},changedTouches:{value:[touch]}});
        target.dispatchEvent(e);return e.defaultPrevented;
    }''',{'kind':kind,'id':identifier,'x':x,'y':y})


def test_webkit_held_sticks_and_long_press(safari):
    page=safari;a,b=center(page,'[data-stick="0"]'),center(page,'[data-stick="1"]')
    assert finger(page,'touchstart',1,*a)
    assert finger(page,'touchstart',2,*b)
    finger(page,'touchmove',1,a[0],a[1]-35);finger(page,'touchmove',2,b[0]+35,b[1])
    page.wait_for_function('state.state==="PLAYING"');page.wait_for_timeout(900)
    assert page.evaluate('state.players.find(p=>p.id===ids[0]).x')>4
    assert page.evaluate('state.players.find(p=>p.id===ids[1]).y')>7
    assert page.evaluate('getSelection().toString()')==''
    assert page.locator('[data-stick="0"]').evaluate("el=>getComputedStyle(el).userSelect")=='none'
    if page.evaluate("CSS.supports('-webkit-touch-callout','none')"):
        assert page.locator('[data-stick="0"]').evaluate("el=>getComputedStyle(el).webkitTouchCallout")=='none'
    assert not page.locator('[data-stick="0"]').evaluate('el=>el.dispatchEvent(new Event("contextmenu",{bubbles:true,cancelable:true}))')
    finger(page,'touchcancel',1,a[0],a[1]-35);finger(page,'touchend',2,b[0]+35,b[1])
    assert page.evaluate('[0,1].every(i=>control(i).stick===null&&control(i).f===0&&control(i).s===0)')


def test_webkit_tap_drag_final_position_and_pause(safari):
    page=safari;page.wait_for_function('state.state==="PLAYING"');before=shots(page)
    # A coalesced swipe has only touchstart and touchend, with a different end position.
    finger(page,'touchstart',3,280,280);finger(page,'touchend',3,430,230);page.wait_for_timeout(150)
    assert shots(page)==before
    assert page.evaluate('motion.get(ids[0]).pitch')>.1
    page.touchscreen.tap(280,280);page.wait_for_timeout(200)
    assert shots(page)[0]==before[0]+1 and shots(page)[1]==before[1]
    fire=center(page,'[data-action="fire"][data-slot="1"]')
    finger(page,'touchstart',5,*fire);page.wait_for_timeout(350);finger(page,'touchend',5,*fire);page.wait_for_timeout(100)
    assert shots(page)[1]>=before[1]+2
    page.locator('#pause').tap();assert page.locator('#settings').is_visible()
    assert page.evaluate('contacts.size===0');page.locator('#settingsClose').tap()
    page.set_viewport_size({'width':390,'height':844});page.wait_for_timeout(150)
    assert page.evaluate('viewportLayout()[1].y>0&&viewportLayout()[1].w===viewportWidth')

``````

## tests/test_wide_ai.py
``````
import math
import random
import pytest
from backend.arenas import ARENAS,PLAYER_RADIUS
from backend.game import Room,Player,wall,clear,walk


@pytest.mark.parametrize('key',list(ARENAS))
def test_exact_world_size_more_cover_and_six_spawn_bodies_are_clear(key):
    a=ARENAS[key];assert (a['width'],a['depth'],a['cell_size'])==(60,35,1)
    assert a['cover_count'] >= (13 if key=='plaza' else 17)
    for team in a['spawns']:
        for x,y in team:
            assert all(not wall(x+dx,y+dy,a['grid']) for dx in [-PLAYER_RADIUS,PLAYER_RADIUS] for dy in [-PLAYER_RADIUS,PLAYER_RADIUS])
    assert not wall(45.5,1.5,a['grid']) and wall(60,10,a['grid']) and wall(10,35,a['grid'])


def test_player_can_cross_the_old_world_boundary_without_changing_physical_speed():
    p=Player('walk','Walker',0,x=35,y=1.5)
    for _ in range(120):walk(p,1,0,1/60)
    assert p.x>50 and p.x<51
    assert clear(2.5,1.5,57.5,1.5)


@pytest.mark.parametrize('key',list(ARENAS))
def test_bots_use_multiple_behaviours_and_lanes_and_stay_out_of_walls(key):
    random.seed(714);r=Room('AI','ai',key);r.add('P').ready=True;r.start()
    for p in r.players.values():p.bot=True
    modes=set();styles=set();turn_samples=[];moved={p.id:0 for p in r.players.values()}
    previous={p.id:(p.x,p.y,p.yaw) for p in r.players.values()}
    for _ in range(1400):
        old_round=r.round;r.tick(.05)
        for p in r.players.values():
            if p.brain:modes.add(p.brain['mode']);styles.add(p.brain['style'])
            assert not any(p.cheats.values())
            assert all(not wall(p.x+dx,p.y+dy,r.map) for dx in [-.44,.44] for dy in [-.44,.44])
            old=previous[p.id]
            if old_round==r.round:
                moved[p.id]+=math.hypot(p.x-old[0],p.y-old[1])
                if p.hp>0:turn_samples.append(abs((p.yaw-old[2]+math.pi)%(2*math.pi)-math.pi))
            previous[p.id]=(p.x,p.y,p.yaw)
        if r.state=='MATCH_END':break
    assert {'flank','patrol','advance'}<=modes and len(modes)>=5,modes
    assert styles=={'flank','advance','roam'}
    assert min(moved.values())>5
    assert max(turn_samples)<=2.8*.05+.00001


def hidden_scenario(enemy):
    r=Room('H','local');p=r.add('Bot',0,True);q=r.add('Enemy',1)
    r.state='PLAYING';r.timer=120;p.x,p.y,p.yaw=5.5,17.5,0;q.x,q.y=enemy
    assert not r.sight(p.x,p.y,q.x,q.y)
    random.seed(81);r.ai(p,.05)
    return p


def test_hidden_enemy_position_does_not_change_a_bots_patrol_goal():
    a=hidden_scenario((40.5,17.5));b=hidden_scenario((45.5,19.5))
    assert a.brain['memory'] is None and b.brain['memory'] is None
    assert a.brain['goal']==b.brain['goal'] and a.route==b.route
    assert not a.inp['fire'] and not b.inp['fire']


def test_bot_searches_the_last_seen_position_instead_of_tracking_through_cover():
    random.seed(3);r=Room('M','local');p=r.add('Bot',0,True);q=r.add('Enemy',1)
    r.state='PLAYING';r.timer=120;p.x,p.y,p.yaw=5.5,17.5,0;q.x,q.y=9.5,17.5
    r.ai(p,.05);memory=p.brain['memory'];assert memory==(9.5,17.5)
    q.x,q.y=40.5,17.5;assert not r.sight(p.x,p.y,q.x,q.y)
    r.ai(p,.05)
    assert p.brain['memory']==memory and p.brain['memory_ttl']<6 and not p.inp['fire']


def test_bots_move_away_from_the_live_railway_warning():
    random.seed(91);r=Room('T','local','railway');p=r.add('Bot',0,True);r.add('Other',1)
    r.state='PLAYING';r.timer=120;p.x,p.y=30,17.5
    for _ in range(45):r.ai(p,.05)
    assert abs(p.y-17.5)>3.1 and not any(p.cheats.values())


def test_burst_fire_has_pauses_without_granting_any_cheats():
    random.seed(10);r=Room('B','local');p=r.add('Bot',0,True);q=r.add('Target',1)
    r.state='PLAYING';r.timer=120;p.x,p.y,p.yaw=5.5,1.5,0;q.x,q.y=10.5,1.5
    seen=[]
    for _ in range(120):
        r.ai(p,.05)
        if p.brain['target'] and p.reaction>1:seen.append(p.inp['fire'])
    assert True in seen and False in seen
    assert not any(p.cheats.values())

``````

## tests/test_wide_browser.py
``````
"""World metres agree between five maps, camera, ray casting and train."""
import os
import pytest
from test_browser import browser,server_url

pytestmark=pytest.mark.skipif(os.getenv('CHEAT_FPS_BROWSER_TESTS')!='1',reason='Opt-in browser checks')


def test_five_expanded_maps_render_and_use_the_full_world_coordinates(browser,server_url):
    context=browser.new_context(viewport={'width':1200,'height':760})
    try:
        page=context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
        page.goto(server_url);page.wait_for_function('arenaCatalog.length===5&&renderer3d?.mapKey')
        for index in range(5):
            data=page.evaluate('''i=>{
                lastPreview=performance.now()+100000;
                const a=arenaCatalog[i];showPreview(i);loadArena(a);
                const r=renderer3d;
                const floor=r.staticRoot.children.find(o=>o.geometry?.type==='PlaneGeometry'&&o.geometry.parameters.width===60);
                const walls=r.staticRoot.children.filter(o=>o.name.startsWith('architecture-'));
                const mark=r.staticRoot.getObjectByName('landmark-'+a.id);
                const train=trainAt(a.train,3+44/5.6);r.updateTrain(train);
                const cameraPlayer={id:'probe',x:45.5,y:1.5,yaw:0,pitch:0,hp:100,cheats:{recoil:false},reload:0};
                r.begin([],performance.now());r.render(cameraPlayer,{x:0,y:0,w:1200,h:760},1.12,performance.now());
                const result={size:[r.mapWidth,r.mapDepth],floor:[floor.geometry.parameters.width,floor.geometry.parameters.height],
                    capacityOk:walls.length>0&&walls.every(o=>Array.from(o.geometry.attributes.position.array).every(Number.isFinite)),landmark:[mark.position.x,mark.position.z],
                    camera:[r.camera.position.x,r.camera.position.y,r.camera.position.z],ray:ray(45.5,1.5,0).d,
                    train:a.train?{visible:r.trainRoot.visible,x:r.trainRoot.position.x,y:train.y}:null};
                r.preview(performance.now());return result;
            }''',index)
            assert data['size']==[60,35] and data['floor']==[60,35]
            assert data['capacityOk'] and data['landmark']==[10,5.5]
            assert data['camera']==[45.5,1.5,1.5] and data['ray']==pytest.approx(13.5)
            if index==4:
                assert data['train']['visible'] and data['train']['x']==pytest.approx(0)
                assert data['train']['y']==17.5
            else:assert data['train'] is None
        assert not errors,errors
    finally:context.close()

``````
