"""Swept 3D throwable collision. All coordinates are x/y ground, z height."""
import math
from functools import lru_cache
from .hazards import train_pose


@lru_cache(maxsize=8)
def static_geometry(grid):
    seen=set(); boxes=[]; free=[]
    for y,row in enumerate(grid):
        for x,cell in enumerate(row):
            if cell=='0':
                free.append((x+.5,y+.5))
                continue
            if (x,y) in seen:continue
            height=3.8 if x in (0,len(row)-1) or y in (0,len(grid)-1) else 2.6
            def valid(xx,yy):
                return (0<=yy<len(grid) and 0<=xx<len(row) and grid[yy][xx]=='1'
                        and (xx,yy) not in seen and
                        (3.8 if xx in (0,len(row)-1) or yy in (0,len(grid)-1) else 2.6)==height)
            w=1
            while valid(x+w,y):w+=1
            d=1
            while all(valid(xx,y+d) for xx in range(x,x+w)):d+=1
            for yy in range(y,y+d):
                for xx in range(x,x+w):seen.add((xx,yy))
            boxes.append(dict(bounds=(x,y,0,x+w,y+d,height),kind='world'))
    return boxes,free


def world_geometry(room):
    boxes=list(static_geometry(tuple(room.arena['grid']))[0])
    boxes.extend(dict(bounds=tuple(b),kind='world') for b in room.arena.get('ballistic_solids',[]))
    w,h=room.arena['width'],room.arena['depth']
    for b in [(-100,-100,-100,0,h+100,100),(w,-100,-100,w+100,h+100,100),
              (0,-100,-100,w,0,100),(0,h,-100,w,h+100,100)]:
        boxes.append(dict(bounds=b,kind='boundary'))
    c=room.crane_state
    if c:boxes.append(dict(bounds=(c['x'],c['y'],c['lift'],c['x']+c['w'],c['y']+c['h'],c['lift']+2.6),kind='crane'))
    cfg=room.arena.get('train')
    if cfg:
        pose=train_pose(room.train_time,cfg)
        if pose['active']:
            for car in cfg['cars']:
                x=pose['x']+car['offset']
                boxes.append(dict(bounds=(x-car['length']/2,cfg['y']-car['width']/2,0,
                                          x+car['length']/2,cfg['y']+car['width']/2,4.8),kind='train'))
    clock=room.arena.get('clock')
    if clock:boxes.append(dict(bounds=(3,-.4,.78,13,.4,1.15),kind='clock',
                              angle=room.train_time*2*math.pi/clock['period'],pivot=(clock['x'],clock['y'])))
    return boxes


def sweep(start,end,boxes,radius):
    best=None;delta=[end[i]-start[i] for i in range(3)]
    if end[2]<=radius and delta[2]<0:
        t=max(0,min(1,(radius-start[2])/delta[2]))
        best=dict(t=t,normal=(0,0,1),point=[start[i]+delta[i]*t for i in range(3)],kind='floor')
    for box in boxes:
        bounds=box['bounds']
        if not box.get('angle') and any(max(start[i],end[i])+radius<bounds[i] or min(start[i],end[i])-radius>bounds[i+3] for i in range(3)):continue
        a=list(start);b=list(end);angle=box.get('angle',0);c,s=math.cos(angle),math.sin(angle)
        if angle:
            px,py=box['pivot']
            a[:2]=[(a[0]-px)*c+(a[1]-py)*s,-(a[0]-px)*s+(a[1]-py)*c]
            b[:2]=[(b[0]-px)*c+(b[1]-py)*s,-(b[0]-px)*s+(b[1]-py)*c]
        lo=[v-radius for v in box['bounds'][:3]];hi=[v+radius for v in box['bounds'][3:]]
        d=[b[i]-a[i] for i in range(3)];enter,leave=-math.inf,math.inf;normal=[0,0,0]
        for i in range(3):
            if abs(d[i])<1e-12:
                if a[i]<lo[i] or a[i]>hi[i]:enter=math.inf;break
            else:
                t1,t2=(lo[i]-a[i])/d[i],(hi[i]-a[i])/d[i];n=-1 if d[i]>0 else 1
                if t1>t2:t1,t2=t2,t1
                if t1>enter:enter=t1;normal=[n if j==i else 0 for j in range(3)]
                leave=min(leave,t2)
        if enter>leave or leave<0 or enter>1:continue
        point=None
        if enter<0:
            choices=[(a[i]-lo[i],i,-1) for i in range(3)]+[(hi[i]-a[i],i,1) for i in range(3)]
            _,axis,n=min(choices);normal=[n if j==axis else 0 for j in range(3)]
            if sum(d[i]*normal[i] for i in range(3))>=-1e-10:continue
            point=list(a);point[axis]=lo[axis] if n<0 else hi[axis];enter=0
        if best and enter>=best['t']:continue
        if point is None:point=[a[i]+d[i]*enter for i in range(3)]
        if angle:
            point[:2]=[point[0]*c-point[1]*s+px,point[0]*s+point[1]*c+py]
            normal[:2]=[normal[0]*c-normal[1]*s,normal[0]*s+normal[1]*c]
        best=dict(t=max(0,enter),normal=normal,point=point,kind=box['kind'])
    return best


def can_stand(x,y,grid,boxes):
    if not all(0<=y+b<len(grid) and 0<=x+a<len(grid[0]) and grid[int(y+b)][int(x+a)]=='0'
               for a in (-.46,.46) for b in (-.46,.46)):return False
    return not any(b['kind'] in ('crane','train') and b['bounds'][2]<1.9 and
                   b['bounds'][0]-.46<x<b['bounds'][3]+.46 and b['bounds'][1]-.46<y<b['bounds'][4]+.46 for b in boxes)


def safe_floor(x,y,grid,boxes):
    if can_stand(x,y,grid,boxes):return x,y
    candidates=static_geometry(tuple(grid))[1]
    return min((p for p in candidates if can_stand(*p,grid,boxes)),
               key=lambda p:(p[0]-x)**2+(p[1]-y)**2,default=(x,y))


def advance(a,dt,kind,boxes,grid):
    radius=.08 if kind=='axe' else .12;gravity=12 if kind=='axe' else 9.8
    if kind=='axe' and a.get('ground'):
        a['x'],a['y']=safe_floor(a['x'],a['y'],grid,boxes);return
    slide=a.get('slide')
    if slide:
        dx,dy=slide[0]-a['x'],slide[1]-a['y'];dist=math.hypot(dx,dy);step=min(dist,5*dt)
        if dist>.001:a['x']+=dx/dist*step;a['y']+=dy/dist*step
        if dist<.05 or can_stand(a['x'],a['y'],grid,boxes):a.pop('slide',None)
        a['vx']=a['vy']=a['vz']=0
        return
    left=dt
    for _ in range(4):
        start=[a['x'],a['y'],a['z']]
        end=[a['x']+a['vx']*left,a['y']+a['vy']*left,a['z']+a['vz']*left-gravity*left*left/2]
        hit=sweep(start,end,boxes,radius)
        if not hit:
            a['x'],a['y'],a['z']=end;a['vz']-=gravity*left;return
        elapsed=left*hit['t'];a['vz']-=gravity*elapsed
        n=hit['normal'];a['x'],a['y'],a['z']=[hit['point'][i]+n[i]*.001 for i in range(3)]
        if kind=='axe':
            a['vx']=a['vy']=0
            if hit['kind']=='floor':
                a['z']=radius;a['ground']=True;a['vz']=0
                a['x'],a['y']=safe_floor(a['x'],a['y'],grid,boxes);return
            if n[2]>.6:
                a['slide']=list(safe_floor(a['x'],a['y'],grid,boxes));a['vz']=0;return
            a['vz']=min(0,a['vz'])
        else:
            v=[a['vx'],a['vy'],a['vz']];dot=sum(v[i]*n[i] for i in range(3))
            v=[(v[i]-1.4*min(0,dot)*n[i])*(.82 if n[2]>.6 and i<2 else 1) for i in range(3)]
            a['vx'],a['vy'],a['vz']=v
            if n[2]>.6 and abs(a['vz'])<.24:a['vz']=.24
        left*=1-hit['t']
        if left<1e-6:return
