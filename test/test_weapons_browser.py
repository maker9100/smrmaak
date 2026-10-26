"""Live WebSocket selection, split ownership and actual first/third person models."""
import os
import pytest
from test_browser import browser,server_url,start_split_ai

pytestmark=pytest.mark.skipif(os.getenv('CHEAT_FPS_BROWSER_TESTS')!='1',reason='Opt-in browser checks')


def test_live_weapon_switch_fire_reload_and_split_ownership(browser,server_url):
    context=browser.new_context(viewport={'width':1000,'height':700},has_touch=True,is_mobile=True)
    try:
        page=context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
        page.goto(server_url);page.evaluate('options.quality=6;resize()');start_split_ai(page)
        page.wait_for_function('state?.state==="PLAYING"',timeout=60000)
        for key,capacity in [('pistol',12),('shotgun',6),('rifle',30)]:
            page.locator('[data-action="weapon"][data-slot="0"]').tap()
            page.locator(f'[data-weapon="{key}"][data-slot="0"]').tap()
            page.wait_for_function('(key)=>state.players.find(p=>p.id===ids[0]).weapon===key',arg=key)
            page.wait_for_timeout(400)
            assert page.evaluate('state.players.find(p=>p.id===ids[1]).weapon')=='rifle'
            assert page.evaluate('state.players.find(p=>p.id===ids[0]).ammo')==capacity
            before=page.evaluate('state.players.find(p=>p.id===ids[0]).shots')
            page.evaluate('tapFire(0)')
            page.wait_for_function('(before)=>state.players.find(p=>p.id===ids[0]).shots>before',arg=before)
            assert page.evaluate('state.players.find(p=>p.id===ids[0]).ammo')==capacity-1
            page.evaluate("""()=>{window.reloadSeen=false;ws.addEventListener('message',e=>{const d=JSON.parse(e.data);if(d.type==='state'&&d.players.find(p=>p.id===ids[0])?.reload>0)window.reloadSeen=true;});}""")
            page.locator('[data-action="reload"][data-slot="0"]').tap()
            page.wait_for_function('window.reloadSeen')
            page.wait_for_function('(capacity)=>state.players.find(p=>p.id===ids[0]).ammo===capacity',arg=capacity,timeout=15000)
        page.keyboard.press('o');page.keyboard.press('8');page.wait_for_function('state.players.find(p=>p.id===ids[1]).weapon==="pistol"')
        assert page.evaluate('state.players.find(p=>p.id===ids[0]).weapon')=='rifle'
        models=page.evaluate('''()=>Object.fromEntries(Object.entries(renderer3d.weaponModels).map(([key,m])=>[key,{parts:(()=>{let n=0;m.root.traverse(o=>{if(o.isMesh)n++;});return n;})(),flash:!!m.flash,light:!!m.light}]))''')
        assert set(models)=={'axe','pistol','rifle','shotgun','grenade'}
        assert all(m['parts']>20 and m['flash'] and m['light'] for m in models.values())
        assert not errors,errors
    finally:context.close()


def test_articulated_operator_and_all_landmark_details(browser,server_url):
    context=browser.new_context(viewport={'width':736,'height':500})
    try:
        page=context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
        page.goto(server_url);page.wait_for_function('arenaCatalog.length===5&&renderer3d?.mapKey',timeout=60000)
        data=page.evaluate('''()=>{
            lastPreview=performance.now()+1e6;const r=renderer3d;r.resize(736,500,6);
            const maps=arenaCatalog.map(a=>{r.loadMap(a.grid,a);const l=r.staticRoot.getObjectByName('landmark-'+a.id);return {id:a.id,parts:l.userData.detailParts||0,statue:!!l.getObjectByName('statue-null'),diesel:!!l.getObjectByName('diesel-locomotive')};});
            const p={id:'inspect',skin:'scout',team:0,x:7,y:17.5,yaw:0,pitch:0,vx:5,vy:0,hp:100,shots:0,reload:0,weapon:'shotgun',cheats:{recoil:false}};
            r.inspect([p],1000,p);const a=r.actors.get(p.id),first=a.legs[0].boot.position.toArray();
            p.x+=.6;r.inspect([p],1100,p);const second=a.legs[0].boot.position.toArray();
            const finite=a.records.every(v=>v.node.matrixWorld.elements.every(Number.isFinite));
            const feet=a.legs.every(v=>v.boot.position.y>=.037);
            const bones=a.arms.every(v=>Math.abs(v.upper.scale.y-.31)<.003&&Math.abs(v.lower.scale.y-.30)<.003);
            p.hp=0;r.inspect([p],1200,p);r.inspect([p],1800,p);
            return {maps,finite,feet,bones,first,second,parts:a.records.length,fall:a.root.rotation.z};
        }''')
        assert all(m['parts']>=40 or m['diesel'] or m['statue'] for m in data['maps'])
        assert data['finite'] and data['feet'] and data['bones'],data
        assert data['first']!=data['second'] and data['parts']>=100 and data['fall']>1.5
        assert not errors,errors
    finally:context.close()
