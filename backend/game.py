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
