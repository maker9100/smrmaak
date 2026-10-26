"""Deterministic geometry queries for server-authorized bullet impacts."""
import math

def ray_box(origin,direction,bounds,limit):
    enter,leave=0.,limit;normal=(0.,0.,0.)
    for axis,(o,d,lo,hi) in enumerate(zip(origin,direction,bounds[:3],bounds[3:])):
        if abs(d)<1e-9:
            if not lo<=o<=hi:return None
            continue
        a,b=(lo-o)/d,(hi-o)/d;n=-1 if d>0 else 1
        if a>b:a,b=b,a
        if a>enter:
            enter=a;normal=tuple(n if i==axis else 0 for i in range(3))
        leave=min(leave,b)
        if enter>leave:return None
    return (enter,normal) if .01<enter<=limit else None

def bullet_impact(room,p,yaw,pitch,limit):
    direction=(math.cos(yaw)*math.cos(pitch),math.sin(yaw)*math.cos(pitch),math.sin(pitch))
    origin=(p.x,p.y,1.5);best=None
    def test(bounds,surface='world',anchor=None,angle=0):
        nonlocal best
        o,d=origin,direction
        if angle:
            cx,cy=anchor['x'],anchor['y'];c,s=math.cos(angle),math.sin(angle)
            o=((o[0]-cx)*c+(o[1]-cy)*s,-(o[0]-cx)*s+(o[1]-cy)*c,o[2]);d=(d[0]*c+d[1]*s,-d[0]*s+d[1]*c,d[2])
        result=ray_box(o,d,bounds,limit)
        if not result:return
        dist,n=result
        if angle:
            c,s=math.cos(angle),math.sin(angle);n=(n[0]*c-n[1]*s,n[0]*s+n[1]*c,n[2])
        if best is None or dist<best['distance']:
            best=dict(x=origin[0]+direction[0]*dist,y=origin[1]+direction[1]*dist,z=origin[2]+direction[2]*dist,nx=n[0],ny=n[1],nz=n[2],surface=surface,anchor=anchor,distance=dist,
                      ox=origin[0],oy=origin[1],oz=origin[2],dx=direction[0],dy=direction[1],dz=direction[2])
    # DDA checks only cells crossed by the shot, not every map cell.
    x,y=int(p.x),int(p.y);dx,dy=direction[:2]
    sx=1 if dx>0 else -1;sy=1 if dy>0 else -1
    tx=abs(1/dx) if dx else math.inf;ty=abs(1/dy) if dy else math.inf
    nx=((x+1-p.x) if dx>0 else p.x-x)*tx if dx else math.inf
    ny=((y+1-p.y) if dy>0 else p.y-y)*ty if dy else math.inf
    for _ in range(150):
        if min(nx,ny)>limit:break
        if nx<ny:x+=sx;nx+=tx
        else:y+=sy;ny+=ty
        if not (0<=y<len(room.map) and 0<=x<len(room.map[0])):break
        if room.map[y][x]=='1':
            # The crane load is queried as actual 3D machinery below.
            crane=room.crane_state
            if crane and crane['x']<=x<crane['x']+crane['w'] and crane['y']<=y<crane['y']+crane['h']:continue
            outer=x in (0,59) or y in (0,34)
            test((x,y,0,x+1,y+1,3.8 if outer else 2.6))
            if best:break
    if direction[2]<-.001:
        dist=-origin[2]/direction[2]
        if 0<dist<=limit and (best is None or dist<best['distance']):
            best=dict(x=origin[0]+direction[0]*dist,y=origin[1]+direction[1]*dist,z=0,nx=0,ny=0,nz=1,surface='world',anchor=None,distance=dist,ox=p.x,oy=p.y,oz=1.5,dx=direction[0],dy=direction[1],dz=direction[2])
    for bounds in room.arena.get('ballistic_solids',[]):test(bounds)
    if room.arena.get('train'):
        from .hazards import train_pose
        cfg=room.arena['train'];pose=train_pose(room.train_time,cfg)
        if pose['active']:
            for car in cfg['cars']:
                x=pose['x']+car['offset'];test((x-car['length']/2,cfg['y']-car['width']/2,0,x+car['length']/2,cfg['y']+car['width']/2,4.8),'train',dict(x=pose['x'],y=cfg['y'],z=0))
    c=room.crane_state
    if c:test((c['x'],c['y'],c['lift'],c['x']+c['w'],c['y']+c['h'],c['lift']+2.6),'crane',dict(x=c['x'],y=c['y'],z=c['lift']))
    cfg=room.arena.get('clock')
    if cfg:
        a=room.train_time*2*math.pi/cfg['period'];test((3,-.4,.78,13,.4,1.15),'clock',dict(x=cfg['x'],y=cfg['y'],z=0,angle=a),a)
    return best
