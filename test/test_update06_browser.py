import os
from pathlib import Path
import pytest
from test_browser import browser,server_url
pytestmark=pytest.mark.skipif(os.getenv('CHEAT_FPS_BROWSER_TESTS')!='1',reason='Opt-in browser checks')

def test_enemy_band_heat_and_detailed_weapons(browser,server_url):
 c=browser.new_context(viewport={'width':900,'height':650});page=c.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto(server_url);page.wait_for_function('renderer3d?.mapKey&&arenaCatalog.length===5')
 page.evaluate('window.requestAnimationFrame=()=>0');page.wait_for_timeout(150)
 result=page.evaluate('''()=>{
  lastPreview=performance.now()+1e7;document.querySelector('#world3d').style.visibility='visible';document.querySelector('#menu').classList.add('hidden');const r=renderer3d,a=arenaCatalog.find(a=>a.id==='foundry');r.loadMap(a.grid,a);r.resize(900,650,4);
  r.updateHeat([{x:5,y:5,radius:2.8,start:6,end:10}],5);const warning=r.heatMeshes[0].children[0].material.opacity;r.updateHeat([{x:5,y:5,radius:2.8,start:6,end:10}],7);const active=r.heatMeshes[0].children[0].material.opacity;
  const p={id:'one',team:0,skin:'scout',hp:100,ammo:30,reserves:{rifle:300},x:5,y:3,yaw:Math.PI/2,shots:0,vx:0,vy:0,reload:0,weapon:'rifle',cheats:{recoil:false}},q={...p,id:'two',team:1,x:5,y:7,yaw:-Math.PI/2};
  r.begin([p,q],1000);r.render(p,{x:0,y:0,w:900,h:650},1.12,1000,{});const red=r.batches['rubber:helmetBand'].mesh.count;
  q.team=0;r.begin([p,q],1016);r.render(p,{x:0,y:0,w:900,h:650},1.12,1016,{});const allied=r.batches['rubber:helmetBand'].mesh.count;
  q.team=1;r.begin([p,q],1032);r.render(p,{x:0,y:0,w:900,h:650},1.12,1032,{});
  p.reload=1;r.render(p,{x:0,y:0,w:900,h:650},1.12,1048,{});const first=r.weaponSway.get(p.id).reload;r.render(p,{x:0,y:0,w:900,h:650},1.12,1064,{});const second=r.weaponSway.get(p.id).reload;
  return {warning,active,red,allied,first,second,details:['rifle','pistol','shotgun'].map(k=>r.weaponModels[k].detail.children.length)};
 }''')
 assert result['active']>result['warning'] and result['red']==1 and result['allied']==0,result
 assert 0<result['first']<result['second']<1 and min(result['details'])>=20,result
 out=Path(__file__).resolve().parents[2]/'qa';out.mkdir(exist_ok=True);page.screenshot(path=str(out/'update06.png'))
 assert not errors,errors;c.close()
