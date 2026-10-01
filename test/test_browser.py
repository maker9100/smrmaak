"""Optional real Chromium / DOM / Canvas / WebSocket / multi-touch checks.
AI is paused only in this fixture; normal AI matches are tested in test_game.py.
"""
import os
import socket
import subprocess
import sys
import time
from pathlib import Path
from urllib.request import urlopen
import pytest

pytestmark=pytest.mark.skipif(os.getenv('CHEAT_FPS_BROWSER_TESTS')!='1',reason='Opt-in browser checks')

@pytest.fixture(scope='module')
def server_url():
    with socket.socket() as s:
        s.bind(('127.0.0.1',0));port=s.getsockname()[1]
    code=("import uvicorn;from backend.game import Room;from backend.main import app,rooms;"
          "Room.ai=lambda self,p,dt:None;"
          "exec(\"@app.post('/__test/finish')\\ndef finish():\\n"
          " for r in rooms.values():\\n"
          "  if r.quick and r.state=='PLAYING':\\n"
          "   r.score=[2,0];r.round=3;r.history=[{'round':1,'winner':0,'reason':'검증'},{'round':2,'winner':0,'reason':'검증'}];r.finish(0,'검증')\\n"
          " return {'ok':True}\\n\");"
          f"uvicorn.run(app,host='127.0.0.1',port={port},log_level='error')")
    proc=subprocess.Popen([sys.executable,'-c',code],cwd=Path(__file__).resolve().parents[1],stdout=subprocess.DEVNULL,stderr=subprocess.PIPE)
    url=f'http://127.0.0.1:{port}'
    try:
        for _ in range(100):
            if proc.poll() is not None:raise RuntimeError(proc.stderr.read().decode())
            try:urlopen(url+'/health',timeout=.2);break
            except OSError:time.sleep(.05)
        else:raise RuntimeError('Test server startup timeout')
        yield url
    finally:proc.terminate();proc.wait(timeout=5);proc.stderr.close()

@pytest.fixture
def browser():
    playwright=pytest.importorskip('playwright.sync_api')
    with playwright.sync_playwright() as pw:
        kwargs={}
        if os.getenv('CHEAT_FPS_BROWSER'):
            kwargs=dict(executable_path=os.environ['CHEAT_FPS_BROWSER'],args=['--no-sandbox','--no-zygote','--single-process','--disable-gpu'])
        instance=pw.chromium.launch(headless=True,**kwargs)
        yield instance
        instance.close()

@pytest.fixture
def game(browser,server_url):
    context=browser.new_context(viewport={'width':1280,'height':800},has_touch=True,is_mobile=True,device_scale_factor=1)
    page=context.new_page();errors=[]
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.goto(server_url);page.locator('#split').check()
    page.locator('#skin0').select_option('rogue');page.locator('#skin1').select_option('warden')
    page.locator('#create').click();page.wait_for_function('state?.state === "PLAYING"')
    yield page,context.new_cdp_session(page)
    context.close()
    assert not errors,errors

def touch(cdp,kind,points):
    cdp.send('Input.dispatchTouchEvent',dict(type=kind,touchPoints=[dict(id=p[0],x=p[1],y=p[2],radiusX=3,radiusY=3,force=1) for p in points]))

def center(page,selector):
    b=page.locator(selector).bounding_box();return b['x']+b['width']/2,b['y']+b['height']/2

def shots(page):return page.evaluate('ids.map(id=>state.players.find(p=>p.id===id).shots)')

def test_independent_analog_controls_and_fire(game):
    page,cdp=game;a,b=center(page,'[data-stick="0"]'),center(page,'[data-stick="1"]')
    before=page.evaluate('ids.map(id=>{let p=state.players.find(p=>p.id===id);return [p.x,p.y]})')
    touch(cdp,'touchStart',[(1,*a),(2,*b)]);touch(cdp,'touchMove',[(1,a[0],a[1]-38),(2,b[0]+38,b[1])])
    page.wait_for_timeout(350);touch(cdp,'touchEnd',[]);page.wait_for_timeout(150)
    after=page.evaluate('ids.map(id=>{let p=state.players.find(p=>p.id===id);return [p.x,p.y]})')
    assert after[0][0]>before[0][0]+.3 and after[1][1]>before[1][1]+.3
    assert abs(after[0][1]-before[0][1])<.05 and abs(after[1][0]-before[1][0])<.05
    before_shots=shots(page);fire=center(page,'[data-action="fire"][data-slot="1"]')
    touch(cdp,'touchStart',[(3,*fire)]);page.wait_for_timeout(380);touch(cdp,'touchEnd',[]);page.wait_for_timeout(100)
    after_shots=shots(page)
    assert after_shots[1]>=before_shots[1]+2 and after_shots[0]==before_shots[0]
    assert page.evaluate('control(0).f===0&&control(1).s===0&&control(1).fire.size===0')

def test_tap_drag_long_press_cancel_and_blur(game):
    page,cdp=game;before,yaw=shots(page),page.evaluate('motion.get(ids[0]).yaw')
    touch(cdp,'touchStart',[(4,280,280)]);touch(cdp,'touchMove',[(4,430,280)]);touch(cdp,'touchEnd',[])
    page.wait_for_timeout(150)
    assert shots(page)==before and abs(page.evaluate('motion.get(ids[0]).yaw')-yaw)>.3
    touch(cdp,'touchStart',[(5,280,280)]);touch(cdp,'touchEnd',[]);page.wait_for_timeout(150)
    assert shots(page)[0]==before[0]+1
    a=center(page,'[data-stick="0"]');touch(cdp,'touchStart',[(6,*a)]);touch(cdp,'touchMove',[(6,a[0],a[1]-30)])
    page.wait_for_timeout(1400)
    assert page.evaluate('getSelection().toString()')==''
    assert page.locator('[data-stick="0"]').evaluate('el=>getComputedStyle(el).userSelect')=='none'
    assert not page.locator('[data-stick="0"]').evaluate('el=>el.dispatchEvent(new Event("contextmenu",{bubbles:true,cancelable:true}))')
    touch(cdp,'touchCancel',[])
    assert page.evaluate('control(0).f===0&&control(0).stick===null')
    fire=center(page,'[data-action="fire"][data-slot="0"]');touch(cdp,'touchStart',[(7,*fire)])
    page.evaluate('window.dispatchEvent(new Event("blur"))')
    assert page.evaluate('control(0).fire.size===0&&!control(0).input.fire');touch(cdp,'touchCancel',[])

def test_quick_ai_settings_results_rematch_and_resize(game,server_url):
    page,cdp=game
    assert page.locator('#lobby').is_hidden() and page.locator('.joystick').count()==2
    assert page.evaluate('state.quick&&state.players.length===6')
    assert page.evaluate('state.players.filter(p=>!p.bot).map(p=>p.skin)')==['rogue','warden']
    page.locator('#pause').tap();assert page.locator('#settings').is_visible()
    assert page.locator('#quality').input_value()=='4';page.locator('#settingsClose').click()
    for size in [(844,390),(390,844),(1366,900)]:
        page.set_viewport_size({'width':size[0],'height':size[1]});page.wait_for_timeout(100)
        for i in range(2):
            pane=page.locator(f'.viewport-controls[data-slot="{i}"]').bounding_box()
            stick=page.locator(f'[data-stick="{i}"]').bounding_box();fire=page.locator(f'[data-action="fire"][data-slot="{i}"]').bounding_box()
            assert pane['x']<=stick['x']<stick['x']+stick['width']<=pane['x']+pane['width']
            assert pane['x']<=fire['x']<fire['x']+fire['width']<=pane['x']+pane['width']
            assert stick['x']+stick['width']<fire['x']
    directory=os.getenv('CHEAT_FPS_SCREENSHOT_DIR')
    if directory:
        Path(directory).mkdir(parents=True,exist_ok=True);page.screenshot(path=str(Path(directory)/'mobile-split.png'))
        page.evaluate("let image=document.createElement('canvas');image.id='gallery';image.width=1200;image.height=700;image.style.cssText='position:fixed;inset:0;z-index:100;width:1200px;height:700px';let g=image.getContext('2d');g.fillStyle='#132329';g.fillRect(0,0,1200,700);['scout','warden','rogue'].forEach((skin,i)=>{g.drawImage(humanSprite(i===2?1:0,skin,0,0),100+i*320,90,256,384);g.font='700 20px Arial';g.fillStyle='#d5eddf';g.fillText(skin.toUpperCase(),165+i*320,510)});document.body.append(image)")
        page.locator('#gallery').screenshot(path=str(Path(directory)/'character-models.png'));page.locator('#gallery').evaluate('el=>el.remove()')
    page.request.post(server_url+'/__test/finish');page.wait_for_selector('#result:not(.hidden)')
    assert page.locator('#stats tbody tr').count()==6 and page.locator('#rounds span').count()==3
    assert page.locator('#finalScore').inner_text()=='3 : 0'
    page.locator('#again').click();page.wait_for_function('state?.state==="COUNTDOWN"&&state.score[0]===0')
    assert page.locator('#lobby').is_hidden() and page.locator('#playUI').is_visible()

def test_local_three_devices_with_two_players_each(browser,server_url):
    context=browser.new_context(viewport={'width':1200,'height':800})
    try:
        pages=[context.new_page() for _ in range(3)];code=''
        for page in pages:
            page.goto(server_url);page.locator('#mode').select_option('local');page.locator('#split').check()
            if code:page.locator('#code').fill(code);page.locator('#join').click()
            else:page.locator('#create').click()
            page.wait_for_selector('#lobby:not(.hidden)');code=page.locator('#roomCode').inner_text()
        for page in pages:
            for button in page.locator('[data-ready]').all():button.click()
        host=pages[0];host.wait_for_function('state.players.length===6&&state.players.every(p=>p.ready)')
        host.locator('#start').click()
        for page in pages:
            page.wait_for_selector('#playUI:not(.hidden)')
            assert page.locator('.joystick').count()==2
            assert page.evaluate('[0,1].map(t=>state.players.filter(p=>p.team===t&&!p.bot).length)')==[3,3]
    finally:
        context.close()
