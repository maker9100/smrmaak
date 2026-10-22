"""Real mobile taps and keyboard fire against authoritative stationary targets."""
import os
import socket
import subprocess
import sys
import time
from pathlib import Path
from urllib.request import urlopen

import pytest
from test_browser import browser, center, start_split_ai, touch

pytestmark=pytest.mark.skipif(os.getenv('CHEAT_FPS_BROWSER_TESTS')!='1',reason='Opt-in browser checks')


@pytest.fixture(scope='module')
def aim_server():
    with socket.socket() as sock:
        sock.bind(('127.0.0.1',0));port=sock.getsockname()[1]
    code='''
import math,uvicorn
import backend.main as main
from backend.game import Room,CHEATS
main.secrets.choice=lambda values:'freight'
Room.ai=lambda self,p,dt:None
@main.app.post('/__test/aim/setup')
def setup():
    for r in main.rooms.values():
        people=[p for p in r.players.values() if not p.bot]
        enemies=[p for p in r.players.values() if p.team==1]
        for p in r.players.values():
            p.x,p.y=17.5,8.5;p.hp=100;p.shots=p.hit=0
            p.cheats=dict.fromkeys(CHEATS,False);p.cooldown=p.kick=p.reload=0;p.ammo=30
            p.inp={};p.tap_pending=0;p.vx=p.vy=0
        for i,p in enumerate(people):
            p.x,p.y,p.yaw,p.pitch=(2.5 if i==0 else 17.5),1.5,(.8 if i==0 else math.pi-.8),.7
            enemies[i].x,enemies[i].y=(6.5 if i==0 else 13.5),1.5
        for p in enemies[len(people):]:p.x,p.y=1.5,1.5
        return {'humans':[p.id for p in people],'targets':[p.id for p in enemies[:len(people)]]}
    return {}
uvicorn.run(main.app,host='127.0.0.1',port=PORT,log_level='error')
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


def reset_targets(page,url):
    data=page.request.post(url+'/__test/aim/setup').json()
    page.wait_for_function('state.players.filter(p=>!p.bot).every(p=>p.y===1.5&&!p.cheats.aim&&p.shots===0)')
    page.evaluate('''() => {resetInput();ids.forEach((id,i)=>{const p=state.players.find(p=>p.id===id),m=motion.get(id);Object.assign(m,{x:p.x,y:p.y,yaw:i?Math.PI-.8:.8,pitch:.7,offsetX:0,offsetY:0,vx:0,vy:0});});transmit();}''')
    return data


@pytest.mark.parametrize('split',[False,True])
def test_mobile_tap_aim_and_three_cheats_per_player(browser,aim_server,split):
    context=browser.new_context(viewport={'width':1180,'height':760},has_touch=True,is_mobile=True)
    errors=[]
    try:
        page=context.new_page();page.on('pageerror',lambda e:errors.append(str(e)));page.goto(aim_server)
        if split:start_split_ai(page)
        else:page.locator('#create').click()
        page.wait_for_function('state?.state==="PLAYING"');data=reset_targets(page,aim_server)
        cdp=context.new_cdp_session(page)
        if not split:
            page.evaluate('''()=>{const before=ws.onmessage;ws.onmessage=e=>setTimeout(()=>before(e),120)}''')
        for i,pid in enumerate(data['humans']):
            assert page.locator(f'.viewport-controls[data-slot="{i}"] [data-game-cheat]').count()==3
            button=f'[data-game-cheat="aim"][data-slot="{i}"]'
            page.locator(button).tap()
            if split:page.wait_for_function('(id)=>state.players.find(p=>p.id===id).cheats.aim',arg=pid)
            assert page.evaluate('i=>!control(i).ads',i)
            area=page.locator(f'[data-look="{i}"]').bounding_box();x,y=area['x']+area['width']*.55,area['y']+area['height']*.38
            touch(cdp,'touchStart',[(40+i,x,y)]);touch(cdp,'touchEnd',[])
            target=data['targets'][i]
            try:page.wait_for_function('(id)=>state.players.find(p=>p.id===id).hp===75',arg=target,timeout=5000)
            except Exception:
                pytest.fail(str(page.evaluate('''({i,x,y})=>({i,phase:state.state,players:state.players.map(p=>({id:p.id,team:p.team,bot:p.bot,x:p.x,y:p.y,yaw:p.yaw,pitch:p.pitch,hp:p.hp,shots:p.shots,ammo:p.ammo,cheats:p.cheats})),motion:ids.map(id=>motion.get(id)),element:document.elementFromPoint(x,y)?.outerHTML})''',dict(i=i,x=x,y=y))))
            assert page.evaluate('id=>{const p=state.players.find(p=>p.id===id);return p.shots===1&&p.ammo===29}',pid)
            assert page.evaluate('(i)=>{const m=motion.get(ids[i]);return Math.abs(wrap(m.yaw-(i?Math.PI:0)))<.05&&m.pitch<0}',i)
            assert page.evaluate('i=>!!motion.get(ids[i]).lockTarget&&!control(i).ads',i)
        assert page.locator('[data-game-cheat="ammo"],[data-toggle="ammo"]').count()==0
        assert page.evaluate('state.players.every(p=>Object.keys(p.cheats).sort().join(",")==="aim,esp,recoil")')
        page.evaluate('''()=>{window.sentCheatPackets=[];const sendBefore=ws.send.bind(ws);ws.send=raw=>{const d=JSON.parse(raw);if(d.type==='toggle')sentCheatPackets.push(d);sendBefore(raw)}}''')
        page.keyboard.press('4');page.keyboard.press('0');page.wait_for_timeout(80)
        assert page.evaluate('sentCheatPackets.length===0')
        assert not errors,errors
    finally:context.close()


def test_hip_fire_and_ads_work_and_toggle_off_stops_aim(browser,aim_server):
    context=browser.new_context(viewport={'width':1100,'height':720})
    errors=[]
    try:
        page=context.new_page();page.on('pageerror',lambda e:errors.append(str(e)));page.goto(aim_server)
        page.locator('#create').click();page.wait_for_function('state?.state==="PLAYING"')
        data=reset_targets(page,aim_server);pid=data['humans'][0];target=data['targets'][0]
        page.keyboard.press('1');page.wait_for_function('state.players.find(p=>p.id===ids[0]).cheats.aim')
        page.keyboard.down('Space');page.wait_for_function('state.players.find(p=>p.team===1&&p.y===1.5).hp<100');page.keyboard.up('Space')
        assert page.evaluate('!control(0).ads&&Math.abs(motion.get(ids[0]).yaw)<.05')
        data=reset_targets(page,aim_server)
        # No AIM: an identical off-target tap must miss.
        page.keyboard.down('Space');page.wait_for_function('state.players.find(p=>p.id===ids[0]).shots>0');page.keyboard.up('Space')
        assert page.evaluate('id=>state.players.find(p=>p.id===id).hp===100',target)
        page.keyboard.press('1');page.wait_for_function('state.players.find(p=>p.id===ids[0]).cheats.aim')
        page.keyboard.down('Shift');page.wait_for_function('Math.abs(motion.get(ids[0]).yaw)<.05')
        page.keyboard.up('Shift')
        assert page.evaluate('id=>state.players.find(p=>p.id===id).hp===100',target)
        # Toggle removal takes effect immediately on subsequent shots.
        page.keyboard.press('1');page.wait_for_function('!state.players.find(p=>p.id===ids[0]).cheats.aim')
        page.evaluate('motion.get(ids[0]).yaw=.8;motion.get(ids[0]).pitch=.7')
        before=page.evaluate('state.players.find(p=>p.id===ids[0]).shots')
        page.keyboard.down('Space');page.wait_for_function('(n)=>state.players.find(p=>p.id===ids[0]).shots>n',arg=before);page.keyboard.up('Space')
        assert page.evaluate('id=>state.players.find(p=>p.id===id).hp===100',target)
        assert not errors,errors
    finally:context.close()
