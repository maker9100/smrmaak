"""Opt-in checks with real WebSockets and the bundled renderer; no production test APIs."""
import os
import socket
import subprocess
import sys
import time
from pathlib import Path
from urllib.request import urlopen

import pytest
from test_browser import browser

pytestmark=pytest.mark.skipif(os.getenv('CHEAT_FPS_BROWSER_TESTS')!='1',reason='Opt-in browser checks')


@pytest.fixture(scope='module')
def train_server():
    with socket.socket() as sock:
        sock.bind(('127.0.0.1',0));port=sock.getsockname()[1]
    code='''
import uvicorn
from backend.main import app,rooms
from backend.game import Room
Room.ai=lambda self,p,dt:None
@app.post('/__test/train/{action}')
def control_train(action:str):
    for room in rooms.values():
        if action=='start':
            for p in room.players.values():p.ready=True
            room.start()
        elif action=='move':
            room.train_time=6
            for p in room.players.values():p.y=2.5
        elif action=='hit':
            room.train_time=3+44/5.6
            victims=[]
            for p in room.players.values():
                if not any(q.team==p.team for q in victims):
                    p.x,p.y=30,17.5;victims.append(p)
            return {'victims':[p.id for p in victims]}
    return {'ok':True}
uvicorn.run(app,host='127.0.0.1',port=PORT,log_level='error')
'''.replace('PORT',str(port))
    proc=subprocess.Popen([sys.executable,'-c',code],cwd=Path(__file__).resolve().parents[1],stdout=subprocess.DEVNULL,stderr=subprocess.PIPE)
    url=f'http://127.0.0.1:{port}'
    try:
        for _ in range(100):
            if proc.poll() is not None:raise RuntimeError(proc.stderr.read().decode())
            try:urlopen(url+'/health',timeout=.2);break
            except OSError:time.sleep(.05)
        else:raise RuntimeError('Server startup timeout')
        yield url
    finally:proc.terminate();proc.wait(timeout=5);proc.stderr.close()


@pytest.mark.parametrize('fallback',[False,True])
def test_three_split_clients_share_train_motion_collision_and_spectating(browser,train_server,fallback):
    context=browser.new_context(viewport={'width':1100,'height':720},has_touch=True,is_mobile=True)
    errors=[]
    try:
        pages=[context.new_page() for _ in range(3)]
        for page in pages:
            page.on('pageerror',lambda e:errors.append(str(e)))
            if fallback:page.add_init_script("window.CheatRenderer3D=undefined;Object.defineProperty(window,'CheatRenderer3D',{value:undefined,writable:false})")
            page.goto(train_server)
            page.locator('#mode').select_option('local');page.locator('#create').click();page.locator('#split').check()
        pages[0].locator('#mapChoice').select_option('railway');pages[0].locator('#hostLocal').click()
        pages[0].wait_for_function('state?.state==="LOBBY"');code=pages[0].evaluate('state.code')
        for page in pages[1:]:
            page.locator('#code').fill(code);page.locator('#join').click();page.wait_for_function('state?.state==="LOBBY"')
        pages[0].wait_for_function('state.players.length===6')
        pages[0].request.post(train_server+'/__test/train/start')
        for page in pages:page.wait_for_function('state?.state==="PLAYING"')
        assert pages[0].evaluate('renderTrain.warning&&!renderTrain.active')
        if not fallback:assert pages[0].evaluate('!renderer3d.trainRoot.visible')
        pages[0].request.post(train_server+'/__test/train/move')
        for page in pages:page.wait_for_function('renderTrain?.active')
        starts=[page.evaluate('renderTrain.x') for page in pages]
        pages[0].wait_for_timeout(300)
        for i,page in enumerate(pages):
            assert page.evaluate('renderTrain.x')>starts[i]+.3
            if not fallback:
                assert page.evaluate('renderer3d.trainRoot.visible&&Math.abs(renderer3d.trainRoot.position.x-(renderTrain.x-renderer3d.mapWidth/2))<.001')
            else:
                assert page.evaluate('renderer3d===null&&ray(renderTrain.x,13,Math.PI/2).train===true')
            # The renderer interpolates the server clock, bounded to 250 ms.
            page.wait_for_function('renderTrain.elapsed>=state.train.elapsed&&renderTrain.elapsed-state.train.elapsed<=.251')
        result=pages[0].request.post(train_server+'/__test/train/hit').json();victims=result['victims']
        for page in pages:
            page.wait_for_function('(v)=>v.every(id=>state.players.find(p=>p.id===id).hp===0)',arg=victims)
            assert page.evaluate('(v)=>v.every(id=>state.players.find(p=>p.id===id).deaths===1)',victims)
            assert page.evaluate('state.log.filter(e=>e.cause==="train").length===2')
            assert page.evaluate('state.state==="PLAYING"&&state.players.every(p=>p.kills===0)')
        # First client owns one player on each team; both independently spectate.
        assert pages[0].evaluate('ids.every(id=>state.players.find(p=>p.id===id).hp===0)')
        assert pages[0].locator('.spectate-button:not(.hidden)').count()==2
        assert not errors,errors
    finally:context.close()
