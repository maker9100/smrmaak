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
          "Room.ai=lambda self,p,dt:None;import backend.main as main;main.secrets.choice=lambda values:'freight';"
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
            kwargs=dict(executable_path=os.environ['CHEAT_FPS_BROWSER'],args=['--no-sandbox','--no-zygote','--single-process','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
        instance=pw.chromium.launch(headless=True,**kwargs)
        yield instance
        instance.close()

def start_split_ai(page):
    # Split AI remains covered at the protocol level; the simplified AI menu
    # deliberately has no split-screen or character setup controls.
    page.evaluate("""() => {const original=WebSocket.prototype.send;WebSocket.prototype.send=function(raw){const d=JSON.parse(raw);if(d.mode==='ai'){d.split=true;d.skins=['glowsquid','guard'];raw=JSON.stringify(d)}return original.call(this,raw)}}""")
    page.locator('#create').click()

@pytest.fixture
def game(browser,server_url):
    context=browser.new_context(viewport={'width':1280,'height':800},has_touch=True,is_mobile=True,device_scale_factor=1)
    page=context.new_page();errors=[]
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.goto(server_url);start_split_ai(page);page.wait_for_function('state?.state === "PLAYING"')
    yield page,context.new_cdp_session(page)
    context.close()
    assert not errors,errors

def touch(cdp,kind,points):
    cdp.send('Input.dispatchTouchEvent',dict(type=kind,touchPoints=[dict(id=p[0],x=p[1],y=p[2],radiusX=3,radiusY=3,force=1) for p in points]))

def tap(cdp,x,y,identifier=95):
    # Keep the physical contact at 30 ms even if a software GPU makes the
    # two CDP round trips take seconds. The browser creates real TouchEvents.
    stamp=time.time()
    cdp.send('Input.dispatchTouchEvent',dict(type='touchStart',timestamp=stamp,touchPoints=[dict(id=identifier,x=x,y=y,radiusX=3,radiusY=3,force=1)]))
    cdp.send('Input.dispatchTouchEvent',dict(type='touchEnd',timestamp=stamp+.03,touchPoints=[]))

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
    tap(cdp,280,280,5)
    page.wait_for_function('(n)=>state.players.find(p=>p.id===ids[0]).shots===n',arg=before[0]+1,timeout=15000)
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
    assert page.evaluate('state.players.filter(p=>!p.bot).map(p=>p.skin)')==['glowsquid','guard']
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
        page.evaluate("let image=document.createElement('canvas');image.id='gallery';image.width=1200;image.height=700;image.style.cssText='position:fixed;inset:0;z-index:100;width:1200px;height:700px';let g=image.getContext('2d');g.fillStyle='#132329';g.fillRect(0,0,1200,700);['scout','guard','glowsquid'].forEach((skin,i)=>{g.drawImage(humanSprite(i===2?1:0,skin,0,0),100+i*320,90,256,384);g.font='700 20px Arial';g.fillStyle='#d5eddf';g.fillText(skin.toUpperCase(),165+i*320,510)});document.body.append(image)")
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
            page.goto(server_url);page.locator('#mode').select_option('local');page.locator('#create').click();page.locator('#split').check()
            if code:page.locator('#code').fill(code);page.locator('#join').click()
            else:page.locator('#hostLocal').click()
            page.wait_for_selector('#lobby:not(.hidden)');code=page.locator('#roomCode').inner_text()
        for page in pages:
            for button in page.locator('[data-ready]').all():button.click()
        host=pages[0];host.wait_for_function('state.players.length===6&&state.players.every(p=>p.ready)')
        for page in pages:
            page.wait_for_selector('#playUI:not(.hidden)')
            assert page.locator('.joystick').count()==2
            assert page.evaluate('[0,1].map(t=>state.players.filter(p=>p.team===t&&!p.bot).length)')==[3,3]
    finally:
        context.close()


def test_hold_movement_across_countdown(browser,server_url):
    context=browser.new_context(viewport={'width':1280,'height':800},has_touch=True,is_mobile=True)
    try:
        page=context.new_page();page.goto(server_url);start_split_ai(page)
        page.wait_for_function('state?.state === "COUNTDOWN"')
        cdp=context.new_cdp_session(page);a=center(page,'[data-stick="0"]')
        before=page.evaluate('state.players.find(p=>p.id===ids[0]).x')
        touch(cdp,'touchStart',[(10,*a)]);touch(cdp,'touchMove',[(10,a[0],a[1]-35)])
        page.wait_for_function('state.state === "PLAYING"');page.wait_for_timeout(350)
        after=page.evaluate('state.players.find(p=>p.id===ids[0]).x')
        assert after>before+.2,('Held joystick was erased at countdown end',before,after)
        touch(cdp,'touchEnd',[])
    finally:context.close()


def test_mouse_fire_with_pointer_lock(browser,server_url):
    context=browser.new_context(viewport={'width':1280,'height':800})
    try:
        page=context.new_page();page.goto(server_url);page.locator('#create').click();page.wait_for_function('state?.state === "PLAYING"')
        page.mouse.click(600,350);page.wait_for_timeout(180)
        page.wait_for_function('document.pointerLockElement === canvas')
        before=shots(page)[0]
        page.mouse.down();page.wait_for_timeout(280);page.mouse.up();page.wait_for_timeout(100)
        assert shots(page)[0]>=before+2,'Clicks after pointer lock did not reach shooting handler'
    finally:context.close()


@pytest.fixture(scope='module')
def live_server_url():
    with socket.socket() as s:s.bind(('127.0.0.1',0));port=s.getsockname()[1]
    proc=subprocess.Popen([sys.executable,'-c',f"import uvicorn;import backend.main as m;m.secrets.choice=lambda values:'freight';uvicorn.run(m.app,host='127.0.0.1',port={port},log_level='error')"],cwd=Path(__file__).resolve().parents[1],stdout=subprocess.DEVNULL,stderr=subprocess.PIPE)
    url=f'http://127.0.0.1:{port}'
    try:
        for _ in range(100):
            if proc.poll() is not None:raise RuntimeError(proc.stderr.read().decode())
            try:urlopen(url+'/health',timeout=.2);break
            except OSError:time.sleep(.05)
        yield url
    finally:proc.terminate();proc.wait(timeout=5);proc.stderr.close()


def test_real_ai_with_simultaneous_sticks_look_and_shoot(browser,live_server_url):
    context=browser.new_context(viewport={'width':1200,'height':760},has_touch=True,is_mobile=True)
    try:
        page=context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
        page.goto(live_server_url);start_split_ai(page)
        page.wait_for_function('state?.state==="COUNTDOWN"')
        cdp=context.new_cdp_session(page);a,b=center(page,'[data-stick="0"]'),center(page,'[data-stick="1"]')
        touch(cdp,'touchStart',[(20,*a),(21,*b)])
        held=[(20,a[0],a[1]-35),(21,b[0],b[1]-35)]
        touch(cdp,'touchMove',held);page.wait_for_function('state.state==="PLAYING"');page.wait_for_timeout(500)
        assert page.evaluate('ids.every(id=>state.players.find(p=>p.id===id).x>3.3)')
        before=shots(page);yaw=page.evaluate('motion.get(ids[0]).yaw')
        fire=center(page,'[data-action="fire"][data-slot="1"]')
        touch(cdp,'touchStart',held+[(22,280,280),(23,*fire)])
        touch(cdp,'touchMove',held+[(22,390,230),(23,*fire)])
        page.wait_for_timeout(350);touch(cdp,'touchEnd',[]);page.wait_for_timeout(150)
        assert shots(page)[0]==before[0] and shots(page)[1]>=before[1]+2
        assert abs(page.evaluate('motion.get(ids[0]).yaw')-yaw)>.25
        assert page.evaluate('motion.get(ids[0]).pitch')>.1
        page.wait_for_function('state.players.some(p=>p.bot&&p.shots>0)',timeout=20000)
        assert page.evaluate('state.players.filter(p=>p.bot).every(p=>Object.values(p.cheats).every(v=>!v))')
        assert page.evaluate('contacts.size===0&&[0,1].every(i=>control(i).f===0&&control(i).fire.size===0)')
        assert not errors,errors
    finally:context.close()


def test_network_delay_does_not_drag_the_moving_camera_backwards(browser,server_url):
    context=browser.new_context(viewport={'width':800,'height':500})
    try:
        page=context.new_page();page.goto(server_url);page.locator('#create').click();page.wait_for_function('state?.state==="PLAYING"')
        page.evaluate('''() => {
            const original=ws.onmessage;ws.onmessage=e=>setTimeout(()=>original(e),100);
            const originalSend=ws.send.bind(ws);ws.send=data=>setTimeout(()=>{if(ws.readyState===1)originalSend(data)},100);
            window.walkTrace=[];window.tracing=true;
            // Sample with the same animation timestamp as prediction. Wall
            // time after software rendering includes variable drawing costs.
            const record=t=>{if(!window.tracing)return;const p=interpolated(t).find(p=>p.id===ids[0]);walkTrace.push({x:p.x,y:p.y,t});requestAnimationFrame(record)};requestAnimationFrame(record);
        }''')
        page.keyboard.down('w');page.wait_for_timeout(1400);page.keyboard.up('w')
        data=page.evaluate('tracing=false;walkTrace');page.wait_for_timeout(600)
        assert data[-1]['x']-data[0]['x']>6.8
        steps=[b['x']-a['x'] for a,b in zip(data,data[1:])]
        assert min(steps)>-.1,('Camera moved backwards under 200 ms delay',min(steps))
        assert all(abs(b['x']-a['x'])<max(.5,(b['t']-a['t'])/1000*7.2+.12) for a,b in zip(data,data[1:])),('Camera jumped relative to elapsed frame time',max(steps))
        assert page.evaluate('Math.abs(motion.get(ids[0]).x-state.players.find(p=>p.id===ids[0]).x)')<.5
    finally:context.close()


def test_minimal_start_menu_real_map_preview_and_solo_ai(browser,server_url):
    context=browser.new_context(viewport={'width':1366,'height':900},has_touch=True,is_mobile=True)
    try:
        page=context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
        page.goto(server_url);page.wait_for_function('previewMap.length>0&&renderer3d?.mapKey')
        assert page.locator('#menu input').count()==0
        assert page.locator('#menu select').count()==1
        assert page.locator('#menu button').all_text_contents()==['게임 시작','설정','종료']
        assert page.locator('#menu .poster,#quickCustom,#quickCheats,#skin0').count()==0
        assert page.request.get(server_url+'/health').json()['rooms']==0
        assert page.evaluate('renderer3d.mapKey===previewMap.join("")')
        for w,h in [(1366,900),(844,390),(390,844)]:
            page.set_viewport_size({'width':w,'height':h});page.wait_for_timeout(100)
            b=page.locator('#create').bounding_box();assert 0<=b['y']<b['y']+b['height']<=h
        page.screenshot(path=str(Path(__file__).resolve().parents[2]/'qa/menu-start.png'))
        page.locator('#create').click();page.wait_for_function('state?.state==="COUNTDOWN"')
        assert page.evaluate('ids.length===1&&state.quick&&state.players.length===6')
        assert page.evaluate('state.players.filter(p=>!p.bot).every(p=>Object.values(p.cheats).every(v=>!v))')
        page.locator('#pause').tap();page.locator('#settings .leave').click()
        page.locator('#mode').select_option('local');page.locator('#create').click()
        assert page.locator('#networkSetup').is_visible()
        assert not errors,errors
    finally:context.close()


def test_five_landmarks_and_local_map_selection(browser,server_url):
    context=browser.new_context(viewport={'width':1200,'height':760})
    try:
        page=context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
        page.goto(server_url);page.wait_for_function('arenaCatalog.length===5&&renderer3d?.mapKey')
        for i,key in enumerate(['freight','foundry','plaza','glory','railway']):
            result=page.evaluate("""i=>{lastPreview=performance.now()+100000;showPreview(i);renderer3d.preview(performance.now());return {id:renderer3d.arenaId,landmark:!!renderer3d.staticRoot.getObjectByName('landmark-'+arenaCatalog[i].id),same:renderer3d.mapKey===arenaCatalog[i].grid.join('')}}""",i)
            assert result==dict(id=key,landmark=True,same=True)
            page.screenshot(path=str(Path(__file__).resolve().parents[2]/f'qa/map-{key}.png'))
        page.locator('#mode').select_option('local');page.locator('#create').click()
        assert page.locator('#mapChoice option').count()==5
        page.locator('#mapChoice').select_option('glory');page.locator('#hostLocal').click()
        page.wait_for_function('state?.map_id==="observatory"')
        assert page.locator('#matchMap').input_value()=='glory'
        page.locator('#matchMap').select_option('railway');page.wait_for_function('state.map_id==="railway"')
        assert not errors,errors
    finally:context.close()
