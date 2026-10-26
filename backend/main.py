import asyncio
import contextlib
import json
import secrets
import logging
from contextlib import asynccontextmanager
from pathlib import Path
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from .game import Room, MAP
from .roles import ROLES
from .arenas import ARENAS, DEFAULT_ARENA

logger=logging.getLogger('cheat-fps')
simulation_task=None
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
        failed=[]
        for code,room in list(rooms.items()):
            try:room.tick(dt)
            except Exception:
                logger.exception('Match %s failed',code);failed.append(code)
        for ws,peer in list(peers.items()):
            if peer['room'].code in failed:
                with contextlib.suppress(Exception):await ws.send_json({'type':'error','message':'경기 처리 오류가 발생했다. 게임을 다시 시작해 주세요.'});await ws.close(code=1011)
        for code in failed:rooms.pop(code,None)
        accumulator += dt
        if accumulator >= 1/30:
            accumulator %= 1/30
            snapshots = {code:json.dumps(room.snapshot(),separators=(',',':'),ensure_ascii=False) for code,room in rooms.items()}
            for ws,peer in list(peers.items()):
                if peer['room'].code not in snapshots:continue
                q = peer['queue']
                if q.full():
                    with contextlib.suppress(asyncio.QueueEmpty): q.get_nowait()
                q.put_nowait(snapshots[peer['room'].code])

@asynccontextmanager
async def lifespan(app):
    global simulation_task
    task = simulation_task = asyncio.create_task(simulation())
    yield
    task.cancel()
    with contextlib.suppress(asyncio.CancelledError): await task

app = FastAPI(lifespan=lifespan)
app.mount('/static', StaticFiles(directory=ROOT), name='static')

@app.get('/')
async def index(): return FileResponse(ROOT / 'index.html',headers={'Cache-Control':'no-cache'})

@app.get('/health')
async def health():
    healthy=simulation_task is not None and not simulation_task.done()
    return JSONResponse({'status':'ok' if healthy else 'error','version':'0.7.0','rooms':len(rooms)},status_code=200 if healthy else 503)

@app.get('/arena')
async def arena(): return {'map':MAP}

@app.get('/roles')
async def roles(): return {'base_hp':200,'roles':ROLES}

@app.get('/arenas')
async def arenas(): return {'arenas':list(ARENAS.values())}

async def sender(ws,queue):
    while True:
        data = await queue.get()
        await asyncio.wait_for(ws.send_text(data) if isinstance(data,str) else ws.send_json(data),timeout=5)

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
            if isinstance(skins,list) and i < len(skins) and isinstance(skins[i],str) and skins[i] in ROLES:
                p.skin = skins[i];p.hp = ROLES[p.skin]['hp']
            loadouts = hello.get('cheats',[])
            if isinstance(loadouts,list) and i < len(loadouts) and isinstance(loadouts[i],dict):
                p.cheats = {key:loadouts[i].get(key) is True for key in p.cheats}
            owned.append(p.id)
        # AI quick play still has a private server match; there is no room UI.
        if room.mode == 'ai' and hello.get('quick') is True and not hello.get('code'):
            room.quick = True
            for pid in owned: room.players[pid].ready = True
            room.start()
        await ws.send_json({'type':'welcome','version':'0.7.0','ids':owned,'map':room.map,'map_id':room.map_id,'arena':room.arena,'code':code,'quick':room.quick})
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
