"""Actual browser, WebSocket, audio, decals, bodies, weapons and menu recovery."""
import os
import socket
import subprocess
import sys
import time
from pathlib import Path
from urllib.request import urlopen
import pytest
from test_browser import browser

pytestmark=pytest.mark.skipif(os.getenv('CHEAT_FPS_BROWSER_TESTS')!='1',reason='Opt-in browser checks')

@pytest.fixture(scope='module')
def update_server():
 with socket.socket() as s:s.bind(('127.0.0.1',0));port=s.getsockname()[1]
 code='''
import uvicorn,math
from backend.main import app,rooms,peers
from backend.game import Room
Room.ai=lambda self,p,dt:None
import backend.main as main
main.secrets.choice=lambda values:'freight'
@app.post('/__test/act/{name}')
async def act(name:str):
 if name=='disconnect':
  for ws in list(peers):await ws.close(code=1012)
  return {'ok':True}
 for r in list(rooms.values()):
  p=next((p for p in r.players.values() if not p.bot),None)
  if not p:continue
  q=next(p2 for p2 in r.players.values() if p2.team!=p.team)
  if name=='marks':
   p.x,p.y,p.yaw,p.pitch=9,6,0,0;p.weapon='rifle';p.ammo=30;p.cooldown=p.equip=p.reload=0;r.shoot(p)
  elif name=='blood':r.weapon_damage(p,q,25,'rifle')
  elif name=='grenade':
   p.x,p.y=2.5,1.5;p.hp=300;q.x,q.y,q.hp=8,1.5,40;p.weapon='grenade';p.ammo=1;p.cooldown=p.equip=p.reload=0;r.shoot(p)
   r.grenades[-1].update(x=5.5,y=1.5,z=.12,vx=0,vy=0,vz=0,fuse=.4)
  elif name=='glory':
   r.map_id='glory';r.new_round();r.state='PLAYING';p.x,p.y=24,17.5;r.update_shield(p,.1)
  elif name=='shield_partial':r.apply_damage(p,25,True)
  elif name=='shield_break':r.apply_damage(p,p.shield,True)
  elif name=='shield_restore':p.damage_age=6;r.update_shield(p,1)
  elif name=='shield_lethal':r.weapon_damage(q,p,p.hp+p.shield,'rifle')
  elif name=='spectate':
   ally=next(a for a in r.players.values() if a.team==p.team and a.id!=p.id);ally.x,ally.y,ally.yaw=7.5,17.5,0
   r.weapon_damage(q,p,1000,'rifle')
  elif name=='train':
   r.map_id='railway';r.new_round();r.state='PLAYING';r.train_time=3+44/5.6;p.x,p.y,p.yaw,p.pitch=6,14,math.pi/2,0;p.weapon='rifle';p.ammo=30;p.cooldown=0;r.shoot(p)
 return {'ok':True}
uvicorn.run(app,host='127.0.0.1',port=PORT,log_level='error')
'''.replace('PORT',str(port))
 proc=subprocess.Popen([sys.executable,'-c',code],cwd=Path(__file__).resolve().parents[1],stdout=subprocess.DEVNULL,stderr=subprocess.PIPE)
 url=f'http://127.0.0.1:{port}'
 try:
  for _ in range(100):
   if proc.poll() is not None:raise RuntimeError(proc.stderr.read().decode())
   try:urlopen(url+'/health',timeout=.2);break
   except OSError:time.sleep(.05)
  yield url
 finally:proc.terminate();proc.wait(timeout=5);proc.stderr.close()

def start(page,url):
 page.goto(url);page.evaluate('options.quality=6;resize()');page.click('#create');page.wait_for_function('state?.state==="PLAYING"',timeout=30000)

def test_live_five_slots_audio_infinite_and_menu_after_disconnect(browser,update_server):
 c=browser.new_context(viewport={'width':900,'height':650},has_touch=True);page=c.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 start(page,update_server)
 for number,key in enumerate(['axe','pistol','rifle','shotgun','grenade'],1):
  page.keyboard.press(str(number));page.wait_for_function('(key)=>state.players.find(p=>p.id===ids[0]).weapon===key',arg=key)
  page.wait_for_function('state.players.find(p=>p.id===ids[0]).equip===0')
  assert page.evaluate('(k)=>renderer3d.weaponModels[k].root.visible',key)
 page.click('[data-game-cheat="ammo"]');page.wait_for_function('state.players.find(p=>p.id===ids[0]).cheats.ammo')
 page.evaluate('tapFire(0)');page.wait_for_function('state.players.find(p=>p.id===ids[0]).shots>0')
 assert page.evaluate('state.players.find(p=>p.id===ids[0]).ammo')==1
 assert page.evaluate('audio.state')=='running'
 page.request.post(update_server+'/__test/act/disconnect');page.wait_for_function('ids.length===0&&state===null&&!document.querySelector("#menu").classList.contains("hidden")')
 page.wait_for_function('document.querySelector("#world3d").style.visibility==="visible"&&renderer3d.actors.size===0&&previewIndex>=0')
 assert page.locator('#create').is_enabled() and page.locator('#previewCaption').inner_text()
 assert not errors,errors;c.close()

def test_real_blood_decals_grenade_glory_shield_third_person_and_bodies(browser,update_server):
 c=browser.new_context(viewport={'width':900,'height':650});page=c.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 start(page,update_server)
 page.request.post(update_server+'/__test/act/blood');page.wait_for_function('renderer3d.combatEffects.drops.count>0')
 page.request.post(update_server+'/__test/act/marks');page.wait_for_function('renderer3d.worldEffects.decals.count>0')
 page.evaluate("()=>{window.sawSmoke=false;const fx=renderer3d.worldEffects,original=fx.update.bind(fx);fx.update=(...a)=>{original(...a);if(fx.smoke.count>0)window.sawSmoke=true;};}");page.request.post(update_server+'/__test/act/grenade');page.wait_for_function('window.sawSmoke')
 page.request.post(update_server+'/__test/act/glory');page.wait_for_function('state.map_id==="glory"&&state.players.find(p=>p.id===ids[0]).shield===100')
 assert page.evaluate('!!renderer3d.staticRoot.getObjectByName("golden-monument")')
 page.request.post(update_server+'/__test/act/spectate');page.wait_for_function('state.players.find(p=>p.id===ids[0]).hp===0')
 page.wait_for_function('renderer3d.camera.position.y>1.65')
 data=page.evaluate('''()=>{const r=renderer3d,roster=interpolated(performance.now()),owner=roster.find(p=>p.id===ids[0]),p=roster.find(p=>p.team===owner.team&&p.hp>0),now=performance.now()+8000;r.begin(roster,now);r.render({...p,spectating:true},{x:0,y:0,w:900,h:650},1.12,now,{});return {head:r.batches['skin:head'].mesh.count,dead:r.actors.get(owner.id).hp,camera:r.camera.position.toArray(),target:[p.x,p.y]};}''')
 assert data['head']==6 and data['dead']==0 and data['camera'][1]>1.65,data
 out=Path(__file__).resolve().parents[2]/'qa';out.mkdir(exist_ok=True);page.screenshot(path=str(out/'spectate070.png'))
 page.request.post(update_server+'/__test/act/train');page.wait_for_function('state.map_id==="railway"&&renderer3d.worldEffects.decals.count>0')
 data=page.evaluate('''()=>({wagons:renderer3d.trainRoot.getObjectByName('container-wagons').children.length,x:renderer3d.worldEffects.decals.instanceMatrix.array[12]})''')
 assert data['wagons']==2
 page.wait_for_timeout(300);after=page.evaluate('renderer3d.worldEffects.decals.instanceMatrix.array[12]');assert after>data['x']
 assert not errors,errors;c.close()

def test_canvas_fallback_has_all_weapons_and_recovers_menu(browser,update_server):
 c=browser.new_context(viewport={'width':390,'height':844},has_touch=True,is_mobile=True);c.add_init_script("Object.defineProperty(window,'CheatRenderer3D',{value:undefined,writable:false})")
 page=c.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)));start(page,update_server)
 assert page.evaluate('renderer3d===null')
 for key in ['axe','pistol','rifle','shotgun','grenade']:
  page.evaluate('key=>selectWeapon(0,key)',key);page.wait_for_function('(key)=>state.players.find(p=>p.id===ids[0]).weapon===key',arg=key);page.wait_for_function('state.players.find(p=>p.id===ids[0]).equip===0')
 page.request.post(update_server+'/__test/act/spectate');page.wait_for_function('state.players.find(p=>p.id===ids[0]).hp===0')
 assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
 page.request.post(update_server+'/__test/act/disconnect');page.wait_for_function('ids.length===0&&state===null&&previewIndex>=0')
 assert not errors,errors;c.close()
