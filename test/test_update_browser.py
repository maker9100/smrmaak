import os
from pathlib import Path
import pytest
from test_browser import browser,server_url
pytestmark=pytest.mark.skipif(os.getenv('CHEAT_FPS_BROWSER_TESTS')!='1',reason='Opt-in browser checks')
def test_mechanisms_effects_environment_and_pose(browser,server_url):
 context=browser.new_context(viewport={'width':1000,'height':650})
 page=context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto(server_url);page.wait_for_function('arenaCatalog.length===5&&renderer3d?.mapKey',timeout=60000)
 page.evaluate('lastPreview=performance.now()+1e7')
 out=Path(__file__).resolve().parents[2]/'qa';out.mkdir(exist_ok=True)
 for key in ['freight','foundry','plaza','glory','railway']:
  data=page.evaluate('''key=>{
   const r=renderer3d,a=arenaCatalog.find(a=>a.id===key);r.loadMap(a.grid,a);r.resize(1000,650,2);r.updateMechanisms(5,{x:27,y:16.5,w:6,h:2,lift:7});
   const p={id:'test',skin:'scout',team:0,x:25,y:22,yaw:-Math.PI/2,pitch:0,hp:100,vx:0,vy:0,shots:0,reload:0,weapon:'rifle',cheats:{recoil:false}};
   r.inspect([p],1000,{x:30,y:17.5,height:4},1.15,.48,45);
   return {id:r.mechanisms.id,load:r.mechanisms.load?.position.y,hand:r.mechanisms.hand?.rotation.y,statue:!!r.staticRoot.getObjectByName('golden-monument'),env:!!r.staticRoot.getObjectByName('environment-'+key)};
  }''',key)
  assert data['env']
  if key=='freight':assert data['load']==7
  if key=='plaza':assert data['hand']<0
  if key=='glory':assert data['statue']
  page.locator('#world3d').screenshot(path=str(out/(key+'.png')))
 data=page.evaluate('''()=>{
  const r=renderer3d,a=arenaCatalog.find(a=>a.id==='railway');r.loadMap(a.grid,a);const p={id:'test',skin:'scout',team:0,x:7,y:17.5,yaw:0,pitch:0,hp:100,vx:0,vy:0,shots:0,reload:0,weapon:'rifle',cheats:{recoil:false}};
  r.inspect([p],2000,p,.7,.15,3.5);p.shots=1;r.inspect([p],2016,p,.7,.15,3.5);
  const op=r.actors.get('test');return {flashes:r.combatEffects.flashes.get('test').mesh.visible,cases:r.combatEffects.cases.count,gunHeight:op.gun.position.y,finite:op.records.every(p=>p.node.matrixWorld.elements.every(Number.isFinite))};
 }''')
 assert data['flashes'] and data['cases']>0 and data['gunHeight']>.35 and data['finite'],data
 page.locator('#world3d').screenshot(path=str(out/'operator.png'))
 assert not errors,errors
 context.close()
