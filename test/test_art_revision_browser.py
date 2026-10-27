"""Shield transitions and all-map visual resource regression in actual WebGL."""
import os
import pytest
from test_browser import browser
from test_update070_browser import update_server,start

pytestmark=pytest.mark.skipif(os.getenv('CHEAT_FPS_BROWSER_TESTS')!='1',reason='Opt-in browser checks')

def world_pixels(page):
 return page.evaluate('''()=>{const r=renderer3d,now=performance.now(),roster=interpolated(now),p=roster.find(p=>p.id===ids[0]);r.begin(roster,now);r.render(p,{x:0,y:0,w:innerWidth,h:innerHeight},1.12,now,{});const gl=r.renderer.getContext(),b=new Uint8Array(32*32*4);gl.readPixels(Math.floor(gl.drawingBufferWidth/2)-16,Math.floor(gl.drawingBufferHeight/2)-16,32,32,gl.RGBA,gl.UNSIGNED_BYTE,b);let bright=0;for(let i=0;i<b.length;i+=4)if(b[i]+b[i+1]+b[i+2]>60)bright++;return bright;}''')

def test_shield_depletion_does_not_blacken_world(browser,update_server):
 c=browser.new_context(viewport={'width':900,'height':650});page=c.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 start(page,update_server);page.request.post(update_server+'/__test/act/glory')
 page.wait_for_function('state.players.find(p=>p.id===ids[0]).shield===100')
 hp=page.evaluate('state.players.find(p=>p.id===ids[0]).hp');assert world_pixels(page)>200
 meter=page.locator('[data-shield-meter="0"]');assert meter.is_visible() and meter.get_attribute('aria-valuenow')=='100'
 assert meter.locator('.shield-track span').evaluate('el=>el.style.width')=='100%'
 page.request.post(update_server+'/__test/act/shield_partial');page.wait_for_function('state.players.find(p=>p.id===ids[0]).shield===75')
 page.wait_for_function('document.querySelector("[data-shield-meter]").getAttribute("aria-valuenow")==="75"')
 page.request.post(update_server+'/__test/act/shield_break');page.wait_for_function('state.players.find(p=>p.id===ids[0]).shield===0')
 page.wait_for_function('document.querySelector("[data-shield-meter]").hidden')
 assert page.evaluate('state.players.find(p=>p.id===ids[0]).hp')==hp
 assert world_pixels(page)>200
 page.request.post(update_server+'/__test/act/shield_restore');page.wait_for_function('state.players.find(p=>p.id===ids[0]).shield>0')
 page.wait_for_function('!document.querySelector("[data-shield-meter]").hidden')
 page.request.post(update_server+'/__test/act/shield_lethal');page.wait_for_function('state.players.find(p=>p.id===ids[0]).hp===0')
 page.wait_for_function('renderer3d.camera.position.y>1.65')
 assert not errors,errors;c.close()

def test_renderer_failure_with_empty_shield_keeps_canvas_game_running(browser,update_server):
 c=browser.new_context(viewport={'width':390,'height':700},has_touch=True,is_mobile=True);page=c.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 start(page,update_server);page.request.post(update_server+'/__test/act/glory')
 page.wait_for_function('state.players.find(p=>p.id===ids[0]).shield===100')
 page.request.post(update_server+'/__test/act/shield_break');page.wait_for_function('state.players.find(p=>p.id===ids[0]).shield===0')
 page.evaluate('()=>{renderer3d.render=()=>{throw new Error("test-only failed GPU frame")};}')
 page.wait_for_function('renderer3d.lost&&document.querySelector("#world3d").style.visibility==="hidden"')
 assert page.evaluate('(()=>{const d=ctx.getImageData(Math.floor(canvas.width/2),Math.floor(canvas.height/2),1,1).data;return d[0]+d[1]+d[2]>30;})()')
 assert page.locator('[data-shield-meter="0"]').is_hidden()
 page.request.post(update_server+'/__test/act/shield_restore');page.wait_for_function('!document.querySelector("[data-shield-meter]").hidden')
 meter=page.locator('[data-shield-meter="0"]').bounding_box();assert meter['x']>12 and meter['x']+meter['width']<390
 page.set_viewport_size({'width':320,'height':700});page.wait_for_function('viewportWidth===320')
 assert page.locator('.shield-value').evaluate('el=>el.scrollWidth<=el.clientWidth')
 assert not errors,errors;c.close()

def test_all_maps_share_finish_standard_and_flag_animates_after_merging(browser,update_server):
 c=browser.new_context(viewport={'width':900,'height':650});page=c.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto(update_server);page.wait_for_function('arenaCatalog.length===5&&renderer3d?.mapKey');page.evaluate('lastPreview=performance.now()+1e8')
 info=page.evaluate('''()=>{const r=renderer3d;return arenaCatalog.map(a=>{r.loadMap(a.grid,a);r.preview(1000);return {id:a.id,...r.staticRoot.userData.artDirection};});}''')
 assert len(info)==5 and all(a['facades']==8 and a['coverParts']>100 and a['revision']=='cohesive-080-r1' for a in info),info
 page.evaluate('''()=>{const a=arenaCatalog.find(a=>a.id==='glory');renderer3d.loadMap(a.grid,a);renderer3d.updateMechanisms(2,null);}''')
 page.wait_for_function('document.fonts.check("500 164px MadHackersFlag")')
 data=page.evaluate('''()=>{const r=renderer3d,g=r.staticRoot.getObjectByName('golden-monument'),f=r.staticRoot.getObjectByName('mad-hackers-flag'),sheets=r.monumentFlag.sheets,before=sheets[0].geometry.attributes.position.array.slice();r.updateMechanisms(3,null);return {gold:!!g&&g.userData.human,label:f.userData.label,attached:sheets.every(m=>m.parent===f),moved:before.some((v,i)=>v!==sheets[0].geometry.attributes.position.array[i]),finite:sheets.every(m=>Array.from(m.geometry.attributes.position.array).every(Number.isFinite)),models:Object.values(r.weaponModels).every(m=>m.root.userData.detailStandard==='cohesive-080-r1')};}''')
 assert data==dict(gold=True,label='매드해커스',attached=True,moved=True,finite=True,models=True),data
 page.evaluate('''()=>{const r=renderer3d;r.resize(900,650,4);r.inspect([],1000,{x:30,y:17.5,height:4},.95,.2,13);}''')
 from pathlib import Path
 out=Path(__file__).resolve().parents[2]/'qa';out.mkdir(exist_ok=True)
 page.evaluate('document.querySelector("#menu").style.visibility="hidden"')
 page.locator('#world3d').screenshot(path=str(out/'golden-statue.png'))
 for key in ['freight','foundry','plaza','glory','railway']:
  page.evaluate('''key=>{const r=renderer3d,a=arenaCatalog.find(a=>a.id===key);r.loadMap(a.grid,a);const time=11;r.updateMechanisms(time,null);r.updateTrain(a.train?{...a.train,elapsed:time,x:30,active:true,warning:false}:null);r.preview(45000);}''',key)
  page.locator('#world3d').screenshot(path=str(out/('finish-'+key+'.png')))
 assert not errors,errors;c.close()
