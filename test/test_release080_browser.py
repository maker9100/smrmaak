import json
import os
from pathlib import Path
import pytest
from test_browser import browser,server_url,center,touch
from test_update070_browser import update_server,start

pytestmark=pytest.mark.skipif(os.getenv('CHEAT_FPS_BROWSER_TESTS')!='1',reason='Opt-in browser checks')


def test_real_3d_trajectory_and_static_batching(browser,update_server):
    c=browser.new_context(viewport={'width':900,'height':650},has_touch=True)
    page=c.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
    try:
        start(page,update_server)
        assert page.evaluate('!!renderer3d&&!renderer3d.lost')
        page.evaluate("selectWeapon(0,'axe')");page.wait_for_function('state.players.find(p=>p.id===ids[0]).weapon==="axe"')
        page.wait_for_function('renderer3d.trajectory.group.visible&&renderer3d.trajectory.geometry.drawRange.count>3')
        first=page.evaluate('Array.from(renderer3d.trajectory.array.slice(0,18))')
        page.evaluate('motion.get(ids[0]).pitch=.5')
        page.wait_for_function('(old)=>Array.from(renderer3d.trajectory.array.slice(0,18)).some((n,i)=>Math.abs(n-old[i])>.02)',arg=first)
        batch=page.evaluate('renderer3d.staticRoot.userData.batching')
        assert batch['saved']>0 and batch['after']<batch['before']*.65,batch
        page.wait_for_function('state.players.find(p=>p.id===ids[0]).equip===0')
        page.evaluate('tapFire(0)');page.wait_for_function('state.axes.length>0')
        try:page.wait_for_function('renderer3d.throwTrails.geometry.drawRange.count>0',timeout=10000)
        except Exception:
            pytest.fail(str(page.evaluate('({lost:renderer3d.lost,axes:state.axes,tracks:Array.from(renderer3d.throwTrails.tracks.values()),renderErrors:window.rendererErrors||null})'))+' errors='+str(errors))
        assert page.evaluate('renderer3d.axeEffects.tracks.size>0')
        assert not errors,errors
    finally:c.close()


def fallback(browser,width=844,height=390):
    c=browser.new_context(viewport={'width':width,'height':height},has_touch=True,is_mobile=True)
    c.add_init_script("Object.defineProperty(window,'CheatRenderer3D',{value:undefined,writable:false})")
    return c,c.new_page()


def test_mobile_hud_buttons_do_not_overlap_status_in_portrait_landscape_and_split(browser,server_url):
    c,page=fallback(browser)
    try:
        start(page,server_url)
        for width,height in [(844,390),(390,844),(320,700),(480,320)]:
            page.set_viewport_size({'width':width,'height':height});page.wait_for_function('(w)=>viewportWidth===w',arg=width)
            overlap=page.evaluate('''()=>{const r=viewportLayout()[0],b=document.querySelector('.stance-actions').getBoundingClientRect(),baseline=dockLayouts.get(0).baseline;return {b:{top:b.top,bottom:b.bottom},baseline,hit:b.top<baseline+49&&b.bottom>baseline};}''')
            assert not overlap['hit'],overlap
        page.evaluate('leave()');page.select_option('#mode','local');page.click('#create');page.check('#split');page.click('#hostLocal');page.wait_for_function('state?.state==="LOBBY"')
        for button in page.locator('[data-ready]').all():button.click()
        page.wait_for_function('state?.state==="PLAYING"')
        for width,height in [(844,390),(390,844),(320,700),(480,320)]:
            page.set_viewport_size({'width':width,'height':height});page.wait_for_function('(w)=>viewportWidth===w',arg=width)
            data=page.evaluate('''()=>viewportLayout().map((r,i)=>{const pane=document.querySelector(`.viewport-controls[data-slot="${i}"]`),b=pane.querySelector('.stance-actions').getBoundingClientRect(),a=pane.querySelector('.actions').getBoundingClientRect(),baseline=r.y+dockLayouts.get(i).baseline;return {i,baseline,top:b.top,bottom:b.bottom,hit:b.top<baseline+49&&b.bottom>baseline,buttonsOverlap:b.left<a.right&&b.right>a.left&&b.top<a.bottom&&b.bottom>a.top,inside:b.top>=r.y&&b.bottom<=r.y+r.h};})''')
            assert all(not x['hit'] and not x['buttonsOverlap'] and x['inside'] for x in data),data
            rectangles=page.evaluate('''()=>{const calls=[],before=rounded,old=state.log;rounded=(...a)=>{if(['#07191fc9','#081013e8'].includes(a[5]))calls.push({x:a[0],y:a[1],w:a[2],h:a[3],kind:a[5]});return before(...a);};try{state.log=[{killer:'K',victim:'V',team:0,weapon:'rifle'}];const p=state.players.find(p=>p.id===ids[0]),r=viewportLayout()[0];hud(p,p,state.players,r.w,r.h,0,r.h/2,performance.now());}finally{rounded=before;state.log=old;}return calls;}''')
            cards=[r for r in rectangles if r['kind']=='#07191fc9'];logs=[r for r in rectangles if r['kind']=='#081013e8']
            assert cards and logs,rectangles
            for a in cards:
                for k in logs:assert not (a['x']<k['x']+k['w'] and k['x']<a['x']+a['w'] and a['y']<k['y']+k['h'] and k['y']<a['y']+a['h']),rectangles
    finally:c.close()


def test_touch_cook_release_preserves_fuse_and_canvas_has_trajectory(browser,server_url):
    c,page=fallback(browser,900,650)
    try:
        page.goto(server_url);page.select_option('#roleChoice','guard');page.click('#create');page.wait_for_function('state?.state==="PLAYING"')
        page.keyboard.press('5');page.wait_for_function('state.players.find(p=>p.id===ids[0]).weapon==="grenade"&&state.players.find(p=>p.id===ids[0]).equip===0')
        assert page.evaluate('CheatThrowPhysics.predict(state.players.find(p=>p.id===ids[0]),state).length>4')
        cdp=c.new_cdp_session(page);x,y=center(page,'[data-action="fire"]');touch(cdp,'touchStart',[(1,x,y)])
        page.wait_for_function('state.players.find(p=>p.id===ids[0]).cooking')
        page.wait_for_function('state.players.find(p=>p.id===ids[0]).cook_time>.9')
        touch(cdp,'touchEnd',[]);page.wait_for_function('state.grenades.length>0')
        g=page.evaluate('state.grenades[0]');assert 0<g['fuse']<2.1,g
        assert page.evaluate('!state.players.find(p=>p.id===ids[0]).cooking')
    finally:c.close()


def test_holding_touch_three_seconds_explodes_in_hand_once(browser,server_url):
    c,page=fallback(browser,900,650)
    try:
        page.goto(server_url);page.select_option('#roleChoice','guard');page.click('#create');page.wait_for_function('state?.state==="PLAYING"')
        page.keyboard.press('5');page.wait_for_function('state.players.find(p=>p.id===ids[0]).weapon==="grenade"&&state.players.find(p=>p.id===ids[0]).equip===0')
        cdp=c.new_cdp_session(page);x,y=center(page,'[data-action="fire"]');touch(cdp,'touchStart',[(2,x,y)])
        page.wait_for_function('state.players.find(p=>p.id===ids[0]).cooking')
        page.wait_for_function('state.explosions.length>0',timeout=8000)
        p=page.evaluate('state.players.find(p=>p.id===ids[0])')
        assert p['hp']==140 and not p['cooking'] and p['shots']==1,p
        page.wait_for_timeout(1300);assert page.evaluate('state.players.find(p=>p.id===ids[0]).shots')==1
        touch(cdp,'touchEnd',[])
    finally:c.close()


def test_acknowledgement_correction_does_not_pull_held_movement_backwards(browser,server_url):
    c,page=fallback(browser,800,500)
    try:
        start(page,server_url)
        data=page.evaluate('''()=>{const traces=[];for(const skin of ['scout','guard','glowsquid'])for(const offset of [.9,-.9]){const p=state.players.find(p=>p.id===ids[0]),m=motion.get(p.id);resetInput();keys.add('KeyW');Object.assign(p,{skin,z:0,vz:0,crouch:false});Object.assign(m,{x:5.5,y:1.5,vx:0,vy:0,yaw:0,offsetX:offset,offsetY:0,speed_multiplier:ROLE_INFO[skin].speed});let before=m.x+m.offsetX,minimum=Infinity,maximum=0;for(let i=0;i<40;i++){predict(1/60,performance.now());const x=m.x+m.offsetX;minimum=Math.min(minimum,x-before);maximum=Math.max(maximum,x-before);before=x;}traces.push({skin,offset,minimum,maximum});}return traces;}''')
        assert all(d['minimum']>=-1e-7 and d['maximum']<.4 for d in data),data
    finally:c.close()


def test_explosion_is_presented_even_if_rendering_paused_past_server_event_window(browser,update_server):
    c,page=fallback(browser,800,500)
    try:
        start(page,update_server)
        page.evaluate('window.requestAnimationFrame=()=>0')
        page.wait_for_timeout(80)
        page.request.post(update_server+'/__test/act/grenade')
        page.wait_for_function('state.explosions.length>0')
        page.wait_for_function('state.explosions.length===0',timeout=6000)
        assert page.evaluate('Array.from(pendingExplosions.values()).some(e=>e.drawnAt===null)')
        value=page.evaluate('''()=>{frame(performance.now());return {events:frameExplosions.length,zero:frameExplosions.some(e=>e.visualAge===0),presented:Array.from(pendingExplosions.values()).every(e=>e.drawnAt!==null)};}''')
        assert value['events']>0 and value['zero'] and value['presented'],value
    finally:c.close()
