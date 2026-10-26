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
 'glory':arena('glory','영광의 동상','매드해커스 깃발을 든 황금 동상과 회복 실드',
   mirrored([(10,5,6,2),(10,27,6,2),(12,12,3,7),(20,6,3,4),(20,24,3,4),(22,14,2,3),(25,3,3,2),(25,30,3,2)]),
   '#c6c9b4','#a19882','#98957e','#75d6ec'),
 'railway':arena('railway','철도 기지','선로를 통과하는 기관차',
   mirrored([(10,4,5,4),(10,10,3,3),(10,23,3,3),(10,29,5,3),(20,5,3,5),(20,26,3,5),(24,11,3,2),(24,22,3,2)])+[(28,5,4,2),(28,28,4,2)],
   '#b9c2b4','#7b7668','#7a806d','#c27b46',False),
}
# Keep a four-metre, continuous crossing through the end walls.
grid=ARENAS['railway']['grid']
for y in range(15,20):grid[y]='0'+grid[y][1:-1]+'0'
ARENAS['railway']['train']=dict(period=28.,warning=3.,start=-14.,end=94.,speed=5.6,y=17.5,length=12.,width=4.,damage=1000)
ARENAS['railway']['train']['cars']=[dict(offset=0,length=12.,width=4.),dict(offset=-12,length=11.5,width=3.5),dict(offset=-24,length=11.5,width=3.5)]
ARENAS['glory']['shield']=dict(x=30.,y=17.5,radius=8.,capacity=100,delay=5.,regen=20.)
# Above the existing pedestal: legs, torso, head and flag pole, in world metres.
ARENAS['glory']['ballistic_solids']=[
 [29.55,17.20,1.7,30.45,18.0,3.95],
 [29.40,17.08,3.95,30.62,18.03,5.30],
 [29.70,17.25,5.30,30.30,17.85,6.25],
 [30.89,18.13,2.05,30.99,18.23,8.30],
]
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
