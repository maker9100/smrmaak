import os
import pytest
from test_browser import browser
from test_update070_browser import update_server,start
pytestmark=pytest.mark.skipif(os.getenv('CHEAT_FPS_BROWSER_TESTS')!='1',reason='Opt-in browser checks')

def test_jump_crouch_throw_pickup_and_audio(browser,update_server):
 c=browser.new_context(viewport={'width':900,'height':650},has_touch=True);page=c.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 start(page,update_server)
 page.keyboard.down('Space');page.wait_for_function('state.players.find(p=>p.id===ids[0]).z>.2');page.keyboard.up('Space');page.wait_for_function('state.players.find(p=>p.id===ids[0]).z===0')
 page.keyboard.down('ControlLeft');page.wait_for_function('state.players.find(p=>p.id===ids[0]).crouch');page.wait_for_function('renderer3d.camera.position.y<1.1');page.keyboard.up('ControlLeft');page.wait_for_function('!state.players.find(p=>p.id===ids[0]).crouch')
 page.keyboard.press('1');page.wait_for_function('state.players.find(p=>p.id===ids[0]).weapon==="axe"&&state.players.find(p=>p.id===ids[0]).equip===0')
 page.evaluate('motion.get(ids[0]).yaw=-Math.PI/2');page.wait_for_timeout(120);page.evaluate('tapFire(0)')
 page.wait_for_function('state.axes?.some(a=>a.ground)');assert page.locator('[data-weapon="axe"]').is_disabled()
 assert page.evaluate('renderer3d.axeEffects.items.some(m=>m.visible)')
 page.keyboard.press('1');assert page.evaluate('state.players.find(p=>p.id===ids[0]).weapon')!='axe'
 page.keyboard.down('w');page.wait_for_function('state.players.find(p=>p.id===ids[0]).magazines.axe===1',timeout=15000);page.keyboard.up('w')
 assert not page.locator('[data-weapon="axe"]').is_disabled()
 samples=page.evaluate('["rifle","pistol","shotgun"].map(k=>audioEngine.buffer("shot",k).duration)');assert len(set(samples))==3
 page.set_viewport_size({'width':390,'height':844});page.wait_for_function('viewportWidth===390')
 page.locator('[data-action="jump"]').tap();page.wait_for_function('state.players.find(p=>p.id===ids[0]).z>.2');page.wait_for_function('state.players.find(p=>p.id===ids[0]).z===0')
 page.locator('[data-action="crouch"]').tap();page.wait_for_function('state.players.find(p=>p.id===ids[0]).crouch')
 page.locator('[data-action="crouch"]').tap();page.wait_for_function('!state.players.find(p=>p.id===ids[0]).crouch')
 assert not errors,errors;c.close()
