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

rooms = {}
peers = {}
ROOT = Path(__file__).resolve().parent.parent / 'frontend'

async def simulation():
    loop = asyncio.get_running_loop()
    last = loop.time()
    frame = 0
    while True:
        await asyncio.sleep(1/30)
        now = loop.time()
        dt,last = min(.1,now-last),now
        frame += 1
        for room in list(rooms.values()): room.tick(dt)
        if frame % 2 == 0:
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
async def index(): return FileResponse(ROOT / 'index.html')

@app.get('/health')
async def health(): return {'status':'ok','rooms':len(rooms)}

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
            room = Room(code,'local' if hello.get('mode')=='local' else 'ai')
            rooms[code] = room
        count = 2 if hello.get('split') is True else 1
        free = (3 if room.mode=='ai' else 6)-len([p for p in room.players.values() if not p.bot])
        if count > free: raise ValueError('요청한 인원만큼 빈 자리가 없습니다.')
        for i in range(count):
            p = room.add(str(hello.get('name','치터'))+(f' P{i+1}' if count>1 else ''),i if count>1 else 0)
            owned.append(p.id)
        await ws.send_json({'type':'welcome','ids':owned,'map':MAP,'code':code})
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
