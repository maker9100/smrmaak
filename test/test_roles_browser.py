"""Real Chromium role selection, split ownership, models and passive cues."""
import os
from pathlib import Path
import pytest
from test_browser import browser,server_url
pytestmark=pytest.mark.skipif(os.getenv('CHEAT_FPS_BROWSER_TESTS')!='1',reason='Opt-in browser checks')

def test_mobile_class_choice_and_quick_match_stats(browser,server_url):
 c=browser.new_context(viewport={'width':736,'height':500},has_touch=True,is_mobile=True)
 page=c.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto(server_url);page.wait_for_function('arenaCatalog.length===5&&renderer3d?.mapKey')
 page.select_option('#roleChoice','glowsquid');assert '화상 면역' in page.locator('#roleInfo').inner_text()
 page.click('#create');page.wait_for_function('state?.state==="PLAYING"',timeout=30000)
 data=page.evaluate('''()=>{const p=state.players.find(p=>p.id===ids[0]);return {hp:p.hp,max:p.max_hp,speed:p.speed_multiplier,skin:p.skin,roles:state.players.map(p=>p.skin),cheats:state.players.filter(p=>p.bot).some(p=>Object.values(p.cheats).some(Boolean)),motion:motion.get(p.id).speed_multiplier};}''')
 assert data['hp']==data['max']==200 and data['speed']==data['motion']==1.15 and data['skin']=='glowsquid',data
 assert set(data['roles'])=={'scout','guard','glowsquid'} and not data['cheats']
 assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
 page.locator('#pause').tap();page.locator('#settings .leave').tap();page.select_option('#roleChoice','guard');page.reload();assert page.locator('#roleChoice').input_value()=='guard'
 assert not errors,errors;c.close()

def test_two_local_players_choose_independent_roles_and_ready(browser,server_url):
 c=browser.new_context(viewport={'width':1000,'height':700},has_touch=True);page=c.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto(server_url);page.evaluate('options.quality=6;resize()');page.select_option('#mode','local');page.click('#create');page.check('#split');page.click('#hostLocal');page.wait_for_function('state?.state==="LOBBY"')
 first,second=page.evaluate('ids');page.select_option(f'[data-skin="{first}"]','guard');page.wait_for_function('state.players.find(p=>p.id===ids[0]).skin==="guard"')
 page.select_option(f'[data-skin="{second}"]','glowsquid');page.wait_for_function('state.players.find(p=>p.id===ids[1]).skin==="glowsquid"')
 page.click(f'[data-ready="{first}"]');page.wait_for_function('state.players.find(p=>p.id===ids[0]).ready')
 assert page.evaluate('state.state')=='LOBBY'
 page.click(f'[data-ready="{second}"]');page.wait_for_function('state?.state==="PLAYING"',timeout=30000)
 data=page.evaluate('ids.map(id=>{const p=state.players.find(p=>p.id===id);return [p.skin,p.hp,p.speed_multiplier,motion.get(id).speed_multiplier]})')
 assert data==[['guard',300,.75,.75],['glowsquid',200,1.15,1.15]],data
 assert page.locator('.viewport-controls').count()==2
 assert not errors,errors;c.close()

def test_human_models_blue_heat_per_view_and_enemy_esp_blink(browser,server_url):
 c=browser.new_context(viewport={'width':1000,'height':650});page=c.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto(server_url);page.wait_for_function('renderer3d?.mapKey&&arenaCatalog.length===5');page.evaluate('window.requestAnimationFrame=()=>0');page.wait_for_timeout(150)
 data=page.evaluate('''()=>{
  lastPreview=performance.now()+1e7;document.querySelector('#menu').classList.add('hidden');document.querySelector('#world3d').style.visibility='visible';const r=renderer3d,a=arenaCatalog.find(a=>a.id==='foundry');r.loadMap(a.grid,a);r.resize(1000,650,4);
  const p={id:'one',team:0,skin:'glowsquid',role_name:'Glowsquid',hp:200,max_hp:200,x:5,y:15,yaw:Math.PI,pitch:0,shots:0,vx:0,vy:0,reload:0,weapon:'rifle',cheats:{recoil:false,esp:true}};
  const q={...p,id:'two',skin:'scout',team:1,hp:150,max_hp:150,y:17},z={...p,id:'three',skin:'guard',hp:300,max_hp:300,y:19};
  const roster=[p,q,z];state={players:roster,state:'PLAYING',round:1,timer:100,score:[0,0],arena:a,heat_zones:[{x:5,y:5,radius:2.8,start:6,end:10}],log:[]};map=a.grid;ids=['one','two'];r.updateHeat(state.heat_zones,7);r.begin(roster,1000);
  view(0,roster,500,650,1000,{x:0,y:0,w:500,h:650});const blue=r.heatMeshes[0].children[0].material.color.getHexString();
  view(1,roster,500,650,1016,{x:500,y:0,w:500,h:650});const red=r.heatMeshes[0].children[0].material.color.getHexString();
  const original=performance.now.bind(performance);performance.now=()=>180;const blink1=espTint(p);performance.now=()=>360;const blink2=espTint(p);performance.now=original;
  const scales=[...r.actors.values()].map(a=>a.root.scale.toArray()),parts=[...r.actors.values()].map(a=>a.records.length),human=[...r.actors.values()].every(a=>a.arms.length===2&&a.legs.length===2);
  state=null;ids=[];ctx.clearRect(0,0,1000,650);r.inspect(roster,1100,{x:5,y:17,height:1},Math.PI,.08,4);
  return {blue,red,blink1,blink2,scales,parts,human};
 }''')
 assert data['blue']=='208cff' and data['red']=='ff2418',data
 assert {data['blink1'],data['blink2']}=={'#44ffff','#e8ff25'},data
 assert len(set(tuple(s) for s in data['scales']))==3 and min(data['parts'])>=100 and data['human'],data
 out=Path(__file__).resolve().parents[2]/'qa';out.mkdir(exist_ok=True);page.screenshot(path=str(out/'roles065.png'))
 assert not errors,errors;c.close()
