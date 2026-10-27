import os
from pathlib import Path
import pytest
from test_browser import browser,server_url,center,touch

pytestmark=pytest.mark.skipif(os.getenv('CHEAT_FPS_BROWSER_TESTS')!='1',reason='Opt-in browser checks')


def setup(browser,url,canvas=False):
    c=browser.new_context(viewport={'width':1000,'height':700},has_touch=True,is_mobile=True)
    c.add_init_script("localStorage.setItem('cheat-fps-options',JSON.stringify({quality:6}))")
    if canvas:c.add_init_script("Object.defineProperty(window,'CheatRenderer3D',{value:undefined,writable:false})")
    page=c.new_page();page.goto(url);return c,page


def equip(page,slot,key):
    page.keyboard.press(str(slot));page.wait_for_function('(k)=>state.players.find(p=>p.id===ids[0]).weapon===k',arg=key)
    page.wait_for_function('state.players.find(p=>p.id===ids[0]).equip===0')


def test_menu_pc_guide_equipment_fifth_column_and_short_layout(browser,server_url):
    c,page=setup(browser,server_url,True);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
    try:
        assert page.locator('.pc-guide').is_visible()
        page.select_option('#grenadeChoice','flashbang');page.select_option('#throwChoice','shuriken')
        for w,h in [(1000,700),(844,390),(390,844)]:
            page.set_viewport_size({'width':w,'height':h});page.wait_for_function('(w)=>viewportWidth===w',arg=w)
            b=page.locator('#create').bounding_box();assert b['y']>=0 and b['y']+b['height']<=h,(w,h,b)
        page.set_viewport_size({'width':1000,'height':700});page.click('#create');page.wait_for_function('state?.state==="PLAYING"')
        p=page.evaluate('state.players.find(p=>p.id===ids[0])');assert p['grenade_choice']=='flashbang' and p['throw_choice']=='shuriken'
        equip(page,1,'knife');equip(page,2,'pistol');equip(page,3,'rifle');equip(page,4,'shotgun');equip(page,5,'flashbang');equip(page,5,'shuriken')
        a=page.locator('[data-weapon="flashbang"]').bounding_box();b=page.locator('[data-weapon="shuriken"]').bounding_box();assert b['y']>=a['y']+a['height'] and abs(a['x']-b['x'])<2,(a,b)
        assert page.locator('.weapon-selector button').count()==6
        page.evaluate('tapFire(0)');page.wait_for_function('state.axes.some(a=>a.weapon==="shuriken")')
        assert page.evaluate('state.players.find(p=>p.id===ids[0]).ammo')==4
        assert not errors,errors
    finally:c.close()


def test_split_equipment_is_independent_and_both_ready_is_required(browser,server_url):
    c,page=setup(browser,server_url,True)
    try:
        page.select_option('#mode','local');page.click('#create');page.check('#split');page.click('#hostLocal');page.wait_for_function('state?.state==="LOBBY"')
        p,q=page.evaluate('ids')
        page.select_option(f'[data-equipment="{p}"][data-field="grenade_choice"]','flashbang')
        page.wait_for_function('state.players.find(p=>p.id===ids[0]).grenade_choice==="flashbang"')
        page.select_option(f'[data-equipment="{q}"][data-field="throw_choice"]','dagger')
        page.wait_for_function('state.players.find(p=>p.id===ids[1]).throw_choice==="dagger"')
        page.click(f'[data-ready="{p}"]');assert page.evaluate('state.state')=='LOBBY'
        page.click(f'[data-ready="{q}"]');page.wait_for_function('state?.state==="PLAYING"')
        assert page.locator('[data-weapon="flashbang"][data-slot="0"]').count()==1
        assert page.locator('[data-weapon="dagger"][data-slot="1"]').count()==1
    finally:c.close()


def test_actual_flash_cooking_and_release_with_mobile_button(browser,server_url):
    c,page=setup(browser,server_url,True)
    try:
        page.select_option('#roleChoice','guard');page.select_option('#grenadeChoice','flashbang');page.click('#create');page.wait_for_function('state?.state==="PLAYING"');equip(page,5,'flashbang')
        cdp=c.new_cdp_session(page);x,y=center(page,'[data-action="fire"]');touch(cdp,'touchStart',[(8,x,y)])
        page.wait_for_function('state.players.find(p=>p.id===ids[0]).cooking')
        page.wait_for_function('state.players.find(p=>p.id===ids[0]).flash_time>0',timeout=6000)
        p=page.evaluate('state.players.find(p=>p.id===ids[0])');assert p['hp']==300 and p['shots']==1 and not p['cooking']
        touch(cdp,'touchEnd',[])
    finally:c.close()


def test_3d_axe_clears_crosshair_fog_new_models_and_molotov_fire(browser,server_url):
    c,page=setup(browser,server_url);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
    try:
        page.select_option('#grenadeChoice','molotov');page.click('#create');page.wait_for_function('state?.state==="PLAYING"');assert page.evaluate('!!renderer3d&&!renderer3d.lost')
        equip(page,5,'molotov');equip(page,5,'axe');page.wait_for_function('renderer3d.activeWeapon==="axe"')
        info=page.evaluate('''()=>{const r=renderer3d,m=r.weaponModels.axe.root,V=r.weaponCamera.position.constructor;let minX=Infinity,minY=Infinity;const maxes=[];m.updateMatrixWorld(true);m.traverse(o=>{if(!o.isMesh||!o.visible)return;if(!o.geometry.boundingBox)o.geometry.computeBoundingBox();const b=o.geometry.boundingBox;for(const x of [b.min.x,b.max.x])for(const y of [b.min.y,b.max.y])for(const z of [b.min.z,b.max.z]){const v=new V(x,y,z).applyMatrix4(o.matrixWorld).project(r.weaponCamera);minX=Math.min(minX,v.x);minY=Math.min(minY,v.y);}});return {minX,scale:m.scale.x,models:['knife','dagger','shuriken','flashbang','molotov'].every(k=>r.weaponModels[k].detail.children.length>0),fog:r.scene.fog.density,exposure:r.renderer.toneMappingExposure,flash:r.weaponModels.axe.flash.visible};}''')
        assert info['minX']>.06 and info['scale']<.7 and info['models'] and not info['flash'] and info['fog']>=.019 and info['exposure']<1,info
        directory=Path(os.getenv('CHEAT_FPS_QA','/tmp/cheat-fps-081'));directory.mkdir(parents=True,exist_ok=True);page.screenshot(path=str(directory/'axe-081.png'))
        equip(page,5,'molotov');page.evaluate('tapFire(0)');page.wait_for_function('state.fires.length>0',timeout=6000)
        page.wait_for_function('renderer3d.utilityEffects.flames.count>0')
        page.screenshot(path=str(directory/'molotov-081.png'));assert not errors,errors
    finally:c.close()
