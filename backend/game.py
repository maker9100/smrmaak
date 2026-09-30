"""Authoritative 30 Hz arena simulation. No client damage or position is trusted."""
import math
import random
import secrets
from collections import deque
from dataclasses import dataclass, field, asdict

MAP = [
 '11111111111111111111',
 '10000000000000000001',
 '10000000000000000001',
 '10001100000000110001',
 '10001100000000110001',
 '10000000011000000001',
 '10000000011000000001',
 '10001100000000110001',
 '10001100000000110001',
 '10000000000000000001',
 '10000000000000000001',
 '11111111111111111111',
]
CHEATS = ('aim', 'esp', 'recoil', 'ammo')

def angle(a):
    return (a + math.pi) % (2 * math.pi) - math.pi

def wall(x, y):
    return not (0 <= x < 20 and 0 <= y < 12) or MAP[int(y)][int(x)] == '1'

def clear(x, y, xx, yy):
    d = math.hypot(xx-x, yy-y)
    n = max(1, int(d / .07))
    return all(not wall(x+(xx-x)*i/n, y+(yy-y)*i/n) for i in range(n+1))

def move(p, dx, dy):
    for axis, delta in [('x', dx), ('y', dy)]:
        x, y = p.x, p.y
        if axis == 'x': x += delta
        else: y += delta
        if all(not wall(x+a, y+b) for a in (-.22,.22) for b in (-.22,.22)):
            setattr(p, axis, getattr(p, axis)+delta)

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
    hp: int = 100
    kills: int = 0
    deaths: int = 0
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

class Room:
    def __init__(self, code, mode):
        self.code, self.mode = code, mode
        self.players = {}
        self.host = None
        self.state = 'LOBBY'
        self.timer = 0
        self.round = 0
        self.score = [0,0]
        self.history = []
        self.log = []
        self.message = ''

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
            # Keep the six-player roster but never give replacement AI cheats.
            p.bot = True
            p.name = p.name[:12] + '·AI'
            p.cheats = dict.fromkeys(CHEATS,False)
            p.inp = {}
        else: del self.players[pid]
        humans = [q.id for q in self.players.values() if not q.bot]
        if self.host == pid: self.host = humans[0] if humans else None

    def start(self):
        if self.state != 'LOBBY': raise ValueError('대기실에서만 시작할 수 있습니다.')
        humans = [p for p in self.players.values() if not p.bot]
        if not all(p.ready for p in humans): raise ValueError('모든 플레이어가 준비해야 합니다.')
        if self.mode == 'local' and len(humans) != 6: raise ValueError('로컬 대전은 6명이 필요합니다. 기기당 2인 접속도 가능합니다.')
        if self.mode == 'ai':
            for team in (0,1):
                while sum(p.team == team for p in self.players.values()) < 3:
                    self.add('GUARD '+str(len(self.players)+1),team,True)
        self.score, self.history, self.round = [0,0], [], 0
        for p in self.players.values(): p.kills = p.deaths = 0
        self.new_round()

    def new_round(self):
        self.round += 1
        self.state, self.timer = 'COUNTDOWN', 3
        for team in (0,1):
            for i,p in enumerate(q for q in self.players.values() if q.team == team):
                p.x,p.y,p.yaw = (2.5 if team == 0 else 17.5), 2.5+i*3, (0 if team == 0 else math.pi)
                p.hp,p.ammo,p.reload,p.cooldown,p.kick = 100,30,0,0,0
                p.inp,p.route = {},[]
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
            p.stale = 0
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
        elif op == 'ready' and self.state == 'LOBBY': p.ready = not p.ready
        elif op == 'start' and p.id == self.host: self.start()
        elif op == 'lobby' and p.id == self.host and self.state == 'MATCH_END':
            self.players = {i:q for i,q in self.players.items() if not q.bot}
            for q in self.players.values(): q.ready = False
            self.state = 'LOBBY'

    def path(self, p, target):
        start, end = (int(p.x),int(p.y)), (int(target.x),int(target.y))
        queue, prev = deque([start]), {start:None}
        while queue:
            v = queue.popleft()
            if v == end: break
            for dx,dy in ((1,0),(-1,0),(0,1),(0,-1)):
                w = v[0]+dx,v[1]+dy
                if w not in prev and not wall(w[0]+.5,w[1]+.5):
                    prev[w] = v
                    queue.append(w)
        route = []
        if end in prev:
            while end != start:
                route.append((end[0]+.5,end[1]+.5))
                end = prev[end]
        return route[::-1]

    def ai(self,p,dt):
        enemies = [q for q in self.players.values() if q.team != p.team and q.hp > 0]
        if not enemies: return
        visible = [q for q in enemies if clear(p.x,p.y,q.x,q.y)]
        target = min(visible or enemies,key=lambda q:math.hypot(q.x-p.x,q.y-p.y))
        p.think -= dt
        if p.think <= 0:
            p.route = self.path(p,target)
            p.think = .65
        if visible:
            desired = math.atan2(target.y-p.y,target.x-p.x)
            error = angle(desired-p.yaw)
            p.yaw += max(-1.7*dt,min(1.7*dt,error))
            p.inp = {'fire':abs(error)<.16,'aim':False}
            if math.hypot(target.x-p.x,target.y-p.y)>5:
                move(p,math.cos(p.yaw)*1.6*dt,math.sin(p.yaw)*1.6*dt)
        else:
            p.inp = {}
            if p.route:
                x,y = p.route[0]
                d = math.hypot(x-p.x,y-p.y)
                if d < .15: p.route.pop(0)
                else:
                    p.yaw = math.atan2(y-p.y,x-p.x)
                    move(p,(x-p.x)/d*2.0*dt,(y-p.y)/d*2.0*dt)

    def shoot(self,p):
        if p.cooldown > 0 or (p.reload > 0 and not p.cheats['ammo']): return
        if not p.cheats['ammo'] and p.ammo <= 0:
            p.reload = 1.5
            return
        p.cooldown = .30 if p.bot else .115
        p.shots += 1
        if not p.cheats['ammo']: p.ammo -= 1
        spread = random.uniform(-.09,.09) if p.bot else (0 if p.cheats['recoil'] else random.uniform(-p.kick,p.kick))
        direction = p.yaw + spread
        candidates = []
        for q in self.players.values():
            if q.hp <= 0 or q.team == p.team: continue
            d = math.hypot(q.x-p.x,q.y-p.y)
            if abs(angle(math.atan2(q.y-p.y,q.x-p.x)-direction)) <= math.atan2(.28,d) and clear(p.x,p.y,q.x,q.y):
                candidates.append((d,q))
        if not p.cheats['recoil']: p.kick = min(.13,p.kick+.022)
        if candidates:
            q = min(candidates,key=lambda z:z[0])[1]
            q.hp = max(0,q.hp-(16 if p.bot else 25))
            p.hit += 1
            if q.hp == 0:
                p.kills += 1
                q.deaths += 1
                self.log.append({'killer':p.name,'victim':q.name,'team':p.team})
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
        for p in list(self.players.values()):
            if p.hp <= 0: continue
            p.cooldown = max(0,p.cooldown-dt)
            p.kick = max(0,p.kick-dt*.055)
            if p.reload > 0:
                p.reload = max(0,p.reload-dt)
                if p.reload == 0: p.ammo = 30
            if p.bot: self.ai(p,dt)
            else:
                p.stale += dt
                if p.stale > .4: p.inp = {}
                p.yaw = angle(p.yaw+p.inp.get('turn',0)*3.2*dt)
                f,s = p.inp.get('f',0),p.inp.get('s',0)
                length = max(1,math.hypot(f,s))
                speed = 2.6 if p.inp.get('aim') else 3.6
                move(p,(math.cos(p.yaw)*f-math.sin(p.yaw)*s)*speed*dt/length,(math.sin(p.yaw)*f+math.cos(p.yaw)*s)*speed*dt/length)
            if p.cheats['aim'] and p.inp.get('aim'):
                targets = [q for q in self.players.values() if q.team != p.team and q.hp > 0 and clear(p.x,p.y,q.x,q.y) and abs(angle(math.atan2(q.y-p.y,q.x-p.x)-p.yaw)) < .65]
                if targets:
                    q = min(targets,key=lambda q:abs(angle(math.atan2(q.y-p.y,q.x-p.x)-p.yaw)))
                    p.yaw = math.atan2(q.y-p.y,q.x-p.x)
            if p.inp.get('reload') and not p.cheats['ammo'] and p.ammo < 30 and p.reload == 0: p.reload = 1.5
            if p.inp.get('fire'): self.shoot(p)
        alive = [sum(p.hp>0 and p.team==t for p in self.players.values()) for t in (0,1)]
        if 0 in alive: self.finish(0 if alive[0] else 1,'전원 녹아웃')
        elif self.timer <= 0:
            values = [(alive[t],sum(p.hp for p in self.players.values() if p.team==t)) for t in (0,1)]
            if values[0] != values[1]: self.finish(0 if values[0]>values[1] else 1,'시간 종료 · 생존자/체력 우세')
            else:
                self.timer = 30
                self.message = '동률 · 30초 연장전'

    def snapshot(self):
        players = []
        for p in self.players.values():
            d = asdict(p)
            for k in ('inp','route','think','stale'): d.pop(k)
            players.append(d)
        return dict(type='state',code=self.code,mode=self.mode,host=self.host,state=self.state,timer=max(0,self.timer),round=self.round,score=self.score,history=self.history,log=self.log,message=self.message,players=players)
