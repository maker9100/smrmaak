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
                     plan=0,speed=random.uniform(3.6,4.5),side=random.choice([-1,1]),memory=None,memory_ttl=0,
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
    else:p.reaction=0;b['target']=None
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
