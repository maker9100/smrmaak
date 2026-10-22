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
