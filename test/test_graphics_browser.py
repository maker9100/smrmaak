"""Optional real WebGL material, resource lifetime and quality checks."""
import os
import pytest
from test_browser import browser,server_url

pytestmark=pytest.mark.skipif(os.getenv('CHEAT_FPS_BROWSER_TESTS')!='1',reason='Opt-in browser checks')


def test_all_map_materials_match_collision_and_survive_repeated_map_changes(browser,server_url):
    context=browser.new_context(viewport={'width':800,'height':500})
    try:
        page=context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
        page.on('console',lambda m:errors.append(m.text) if m.type=='error' else None)
        page.goto(server_url);page.wait_for_function('arenaCatalog.length===5&&renderer3d?.mapKey',timeout=60000)
        counts=[]
        for cycle in range(3):
            for i in range(5):
                data=page.evaluate('''i=>{
                    lastPreview=performance.now()+100000;showPreview(i);const r=renderer3d,a=arenaCatalog[i];r.preview(30000);
                    const covers=r.staticRoot.userData.coverFootprints;
                    const overlap=covers.every(c=>Array.from({length:c.d},(_,y)=>Array.from({length:c.w},(_,x)=>a.grid[c.y+y][c.x+x]==='1').every(Boolean)).every(Boolean));
                    return {size:[r.mapWidth,r.mapDepth],overlap,parts:r.staticRoot.userData.detailParts,
                        textured:r.staticRoot.children.filter(o=>o.name.startsWith('architecture-')).every(o=>o.material.isMeshStandardMaterial||o.material.isMeshPhysicalMaterial||o.material.userData.surface==='glow'),
                        maps:Array.from(r.surfaces.textures.values()).every(m=>m.map.image.width===512&&m.normalMap.image.width===512&&m.roughnessMap.image.width===512),
                        environment:!!r.scene.environment,background:!!r.scene.background,textures:r.renderer.info.memory.textures,geometries:r.renderer.info.memory.geometries};
                }''',i)
                assert data['size']==[60,35] and data['overlap']
                assert data['parts']>200 and data['textured'] and data['maps']
                assert data['environment'] and data['background']
            counts.append((data['textures'],data['geometries']))
        assert counts[-1][0]<=counts[0][0]+3 and counts[-1][1]<=counts[0][1]+3,counts
        assert not errors,errors
    finally:context.close()


def test_detailed_models_and_quality_switches_render_in_a_live_match(browser,server_url):
    context=browser.new_context(viewport={'width':800,'height':500},has_touch=True,is_mobile=True)
    try:
        page=context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
        page.on('console',lambda m:errors.append(m.text) if m.type=='error' else None)
        page.goto(server_url);page.locator('#create').click();page.wait_for_function('state?.state==="PLAYING"',timeout=60000)
        data=page.evaluate('''()=>({actors:renderer3d.actors.size,details:Array.from(renderer3d.actors.values()).map(a=>a.records.length),
            kinds:Object.keys(renderer3d.batches),capacity:Object.values(renderer3d.batches).every(b=>b.mesh.count<=b.mesh.instanceMatrix.count),
            bevel:renderer3d.weapon.children.some(o=>o.geometry?.type==='RoundedBoxGeometry'),shadows:renderer3d.actorShadows.count})''')
        assert data['actors']==6 and min(data['details'])>=60
        assert {'skin:sphere','glass:box','fabric:capsule'}<=set(data['kinds'])
        assert data['capacity'] and data['bevel'] and data['shadows']==6
        page.locator('#pause').tap()
        for value,size,enabled in [('6',1024,False),('2',2048,True),('4',1024,True)]:
            page.locator('#quality').select_option(value)
            assert page.evaluate('renderer3d.renderer.shadowMap.enabled') is enabled
            assert page.evaluate('renderer3d.sun.shadow.mapSize.x')==size
        page.locator('#settingsClose').click()
        assert not errors,errors
    finally:context.close()
