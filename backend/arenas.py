"""Five server-owned arenas. Geometry, collision and preview share this catalog."""

def layout(rectangles):
    cells=[['1' if x in (0,19) or y in (0,11) else '0' for x in range(20)] for y in range(12)]
    for x,y,w,h in rectangles:
        for yy in range(y,y+h):
            for xx in range(x,x+w):cells[yy][xx]='1'
    return [''.join(row) for row in cells]


def arena(key,name,landmark,rects,sky,wall,floor,accent):
    return dict(id=key,name=name,landmark=landmark,grid=layout(rects),sky=sky,wall=wall,floor=floor,accent=accent)

ARENAS={
 'freight':arena('freight','컨테이너 항만','대형 갠트리 크레인',
   [(4,3,2,2),(14,3,2,2),(9,5,2,2),(4,7,2,2),(14,7,2,2)],
   '#adc5ca','#627a80','#70847b','#5da9bf'),
 'foundry':arena('foundry','제련소','용광로와 굴뚝',
   [(4,2,2,2),(14,2,2,2),(7,4,1,4),(12,4,1,4),(9,5,2,2),(4,8,2,2),(14,8,2,2)],
   '#b6a798','#78675b','#796e62','#ef9c40'),
 'plaza':arena('plaza','시계 광장','중앙 시계탑',
   [(4,2,3,1),(13,2,3,1),(5,4,1,4),(14,4,1,4),(9,5,2,2),(4,9,3,1),(13,9,3,1)],
   '#c4d0ce','#aa9b7e','#a09c84','#9b6657'),
 'observatory':arena('observatory','천문관측소','돔과 대형 망원경',
   [(4,3,3,1),(13,3,3,1),(6,5,1,2),(13,5,1,2),(9,5,2,2),(4,8,3,1),(13,8,3,1)],
   '#273c5b','#758698','#566b82','#83c9ed'),
 'railway':arena('railway','철도 기지','선로를 통과하는 기관차',
   [(4,2,2,2),(14,2,2,2),(4,8,2,2),(14,8,2,2),(9,2,2,1),(9,9,2,1)],
   '#b9c2b4','#7b7668','#7a806d','#c27b46'),
}
# A clear central crossing; portals in the boundary align with the rails.
grid=ARENAS['railway']['grid']
for y in (5,6): grid[y]='0'+grid[y][1:-1]+'0'
ARENAS['railway']['train']=dict(period=18.,warning=3.,start=-7.,end=27.,
                               speed=2.8,y=6.,length=6.,width=2.,damage=100)
DEFAULT_ARENA='freight'
MAP=ARENAS[DEFAULT_ARENA]['grid']
