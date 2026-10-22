"""World metres agree between five maps, camera, ray casting and train."""
import os
import pytest
from test_browser import browser,server_url

pytestmark=pytest.mark.skipif(os.getenv('CHEAT_FPS_BROWSER_TESTS')!='1',reason='Opt-in browser checks')


def test_five_expanded_maps_render_and_use_the_full_world_coordinates(browser,server_url):
    context=browser.new_context(viewport={'width':1200,'height':760})
    try:
        page=context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
        page.goto(server_url);page.wait_for_function('arenaCatalog.length===5&&renderer3d?.mapKey')
        for index in range(5):
            data=page.evaluate('''i=>{
                lastPreview=performance.now()+100000;
                const a=arenaCatalog[i];showPreview(i);loadArena(a);
                const r=renderer3d;
                const floor=r.staticRoot.children.find(o=>o.geometry?.type==='PlaneGeometry'&&o.geometry.parameters.width===60);
                const walls=r.staticRoot.children.find(o=>o.isInstancedMesh);
                const mark=r.staticRoot.getObjectByName('landmark-'+a.id);
                const train=trainAt(a.train,3+44/5.6);r.updateTrain(train);
                const cameraPlayer={id:'probe',x:45.5,y:1.5,yaw:0,pitch:0,hp:100,cheats:{recoil:false},reload:0};
                r.begin([],performance.now());r.render(cameraPlayer,{x:0,y:0,w:1200,h:760},1.12,performance.now());
                const result={size:[r.mapWidth,r.mapDepth],floor:[floor.geometry.parameters.width,floor.geometry.parameters.height],
                    capacityOk:walls.count<=walls.instanceMatrix.count,landmark:[mark.position.x,mark.position.z],
                    camera:[r.camera.position.x,r.camera.position.y,r.camera.position.z],ray:ray(45.5,1.5,0).d,
                    train:a.train?{visible:r.trainRoot.visible,x:r.trainRoot.position.x,y:train.y}:null};
                r.preview(performance.now());return result;
            }''',index)
            assert data['size']==[60,35] and data['floor']==[60,35]
            assert data['capacityOk'] and data['landmark']==[10,5.5]
            assert data['camera']==[45.5,1.5,1.5] and data['ray']==pytest.approx(13.5)
            if index==4:
                assert data['train']['visible'] and data['train']['x']==pytest.approx(0)
                assert data['train']['y']==17.5
            else:assert data['train'] is None
        assert not errors,errors
    finally:context.close()
