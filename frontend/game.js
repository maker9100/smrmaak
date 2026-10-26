'use strict';
// Cheat FPS 0.6.0: frame-rate camera, analog controls and authoritative server.
const $ = id => document.getElementById(id);
const canvas = $('game'), ctx = canvas.getContext('2d', {alpha:true});
let renderer3d=null, viewportWidth=innerWidth,viewportHeight=innerHeight;
try{if(window.CheatRenderer3D)renderer3d=new window.CheatRenderer3D($('world3d'));}catch(error){console.warn('Canvas fallback:',error.message);}
$('graphicsStatus').textContent=renderer3d?'그래픽: 3D · v0.6.0':'그래픽: 2D 호환 모드 (WebGL2 사용 불가) · v0.6.0';
const CHEATS = ['aim','esp','recoil'];
const LABELS = ['AIM','ESP','NO RECOIL'];
const AIM_CONE=.95;
const WEAPON_ORDER=['rifle','pistol','shotgun'];
const WEAPON_INFO={rifle:{name:'AR',capacity:30,reload_time:1.5},shotgun:{name:'산탄총',capacity:6,reload_time:.7},pistol:{name:'권총',capacity:12,reload_time:1.25}};
function weaponSpec(p){return state?.weapons?.[p.weapon]||WEAPON_INFO[p.weapon]||WEAPON_INFO.rifle;}
const weaponMenus=new Map();
function selectWeapon(i,key){if(!WEAPON_ORDER.includes(key))return;send({type:'weapon',weapon:key},ids[i]);weaponMenus.set(i,performance.now()+3000);}
function weaponIcon(key){const paths={rifle:'M4 20h18l6-6h37v3h26v4H65v7H48l5 16H42l-5-16h-9l-5 10h-7l3-13H4z',pistol:'M18 13h53v12H46l-6 22H25l4-22H18z',shotgun:'M3 22h22l8-5h56v5H51v6H32l-7 8H13l3-9H3z'};return `<svg class="weapon-icon" viewBox="0 0 96 52" aria-hidden="true"><path fill="currentColor" d="${paths[key]}"/><path d="M32 18h21M34 21h17M31 31h5" stroke="#19201c" stroke-width="2"/></svg>`;}
function cycleWeapon(i=0){const p=state?.players.find(p=>p.id===ids[i]);if(!active()||!p||p.hp<=0)return;const open=(weaponMenus.get(i)||0)>performance.now();weaponMenus.set(i,performance.now()+4500);if(open)selectWeapon(i,WEAPON_ORDER[(WEAPON_ORDER.indexOf(p.weapon||'rifle')+1)%3]);syncControls();}

const contacts = new Map(), sentInputs = new Map();
const nativeTouch = 'ontouchstart' in window;
let tapSerial=0;
const keys = new Set(), local = new Map(), motion = new Map(), samples = new Map();
const effects = new Map(), padEdges = new Map(), spriteCache = new Map(), wallCache = new Map(), weaponCache = new Map();
let ws=null, state=null, ids=[], map=[], phase='', controlIds='', lobbyStamp='';
let closedByUser=false, audio=null, toastTimer, lastFrame=performance.now(), snapshotAt=0;
let rtt=60, pingAt=0, lastSend=0, seq=0, mouseSlot=0, frameMs=16;
let options={sensitivity:1,volume:.25,quality:4};
try { Object.assign(options,JSON.parse(localStorage.getItem('cheat-fps-options')||'{}')); } catch {}
options.sensitivity=Math.max(.3,Math.min(3,Number(options.sensitivity)||1));
options.quality=[2,4,6].includes(Number(options.quality))?Number(options.quality):4;
const touchDevice = matchMedia('(any-pointer:coarse)').matches || navigator.maxTouchPoints>0;
document.body.classList.toggle('touch-device',touchDevice);
const loadouts = [Object.fromEntries(CHEATS.map(k=>[k,false])),Object.fromEntries(CHEATS.map(k=>[k,false]))];
const esc = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const wrap=a=>Math.atan2(Math.sin(a),Math.cos(a));
const mix=(a,b,t)=>a+(b-a)*t;
function control(i) {
    if(!local.has(i)) local.set(i,{f:0,s:0,turn:0,ads:false,fire:new Set(),fireUntil:0,snapUntil:0,reloadUntil:0,look:new Map(),stick:null,view:0,mouseFire:false,mouseAim:false,input:{f:0,s:0,turn:0,aim:false,fire:false,reload:false}});
    return local.get(i);
}
function active(){return state&&['COUNTDOWN','PLAYING','ROUND_END'].includes(state.state)&&!$('settings').open;}
function toast(s){$('toast').textContent=s;$('toast').style.display='block';clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').style.display='none',3500);}
function send(data,id){if(ws?.readyState===WebSocket.OPEN&&ws.bufferedAmount<65536)ws.send(JSON.stringify({...data,id:id||ids[0]}));}
function sound(hit=false,weapon='rifle'){
    if(!audio||audio.state!=='running'||options.volume<=0)return;
    const o=audio.createOscillator(),g=audio.createGain(),t=audio.currentTime;
    o.type=hit?'sine':'sawtooth';o.frequency.setValueAtTime(hit?960:weapon==='shotgun'?90:weapon==='pistol'?220:160,t);o.frequency.exponentialRampToValueAtTime(hit?600:45,t+.075);
    g.gain.setValueAtTime(options.volume*.11,t);g.gain.exponentialRampToValueAtTime(.001,t+.1);
    o.connect(g);g.connect(audio.destination);o.start();o.stop(t+.11);
}
function audioOn(){try{audio ||= new (window.AudioContext||window.webkitAudioContext)();audio.resume().catch(()=>{});}catch{}}
function resetInput(){
    keys.clear();contacts.clear();
    for(const c of local.values()){
        c.f=c.s=c.turn=0;c.ads=c.mouseFire=c.mouseAim=false;c.fire.clear();c.fireUntil=c.snapUntil=c.reloadUntil=0;c.look.clear();c.stick=null;
        c.input={f:0,s:0,turn:0,aim:false,fire:false,reload:false};
    }
    document.querySelectorAll('.stick-knob').forEach(el=>el.style.transform='translate(0,0)');
    document.querySelectorAll('.pressed,.joystick.active').forEach(el=>el.classList.remove('pressed','active'));
    ids.forEach(id=>send({type:'input',f:0,s:0,turn:0,fire:false,aim:false,reload:false},id));
}
function showScreen(name){
    ['menu','lobby','playUI','result'].forEach(id=>$(id).classList.toggle('hidden',id!==name));
    document.body.classList.toggle('playing',name==='playUI');
    if(name==='menu')previewIndex=-1;
    document.body.classList.toggle('split-play',name==='playUI'&&ids.length===2);
}
function syncMenu(){ $('create').textContent='게임 시작'; }
$('mode').onchange=syncMenu;
syncMenu();
let previewMap=[],lastPreview=0,arenaCatalog=[],previewIndex=-1,currentArena=null;
let renderTrain=null;
function trainAt(config,elapsed){
    if(!config)return null;
    const phase=elapsed%config.period,active=phase>=config.warning&&phase<config.warning+(config.end-config.start)/config.speed;
    return {...config,elapsed,active,warning:phase<config.warning,x:active?config.start+config.speed*(phase-config.warning):config.start,
        next_in:phase<config.warning?config.warning-phase:config.period-phase+config.warning};
}
function loadArena(arena){currentArena=arena;map=arena.grid;renderer3d?.loadMap(map,arena);}
function showPreview(index){
    if(!arenaCatalog.length)return;
    previewIndex=index%arenaCatalog.length;const arena=arenaCatalog[previewIndex];previewMap=arena.grid;
    renderer3d?.loadMap(previewMap,arena);$('previewCaption').textContent=arena.name+' / '+arena.landmark;
}
fetch('/arenas').then(r=>{if(!r.ok)throw new Error('arenas');return r.json();}).then(d=>{
    arenaCatalog=d.arenas;
    for(const el of [$('mapChoice'),$('matchMap')])el.innerHTML=arenaCatalog.map(a=>`<option value="${a.id}">${a.name}</option>`).join('');
    $('mapChoice').onchange=()=>{$('mapLandmark').textContent=arenaCatalog.find(a=>a.id===$('mapChoice').value)?.landmark||'';};$('mapChoice').onchange();
    $('matchMap').onchange=()=>send({type:'map',map_id:$('matchMap').value});
    previewMap=arenaCatalog[0].grid;if(!ids.length)showPreview(0);
}).catch(()=>toast('맵 목록을 불러오지 못했다. 새로고침해 주세요.'));
function connect(join=false){
    const old=ws;ws=null;old?.close();resetInput();closedByUser=false;audioOn();state=null;phase='';ids=[];seq=0;
    samples.clear();motion.clear();effects.clear();local.clear();sentInputs.clear();controlIds='';lobbyStamp='';spriteCache.clear();
    showScreen('menu');$('create').disabled=$('join').disabled=true;toast('경기를 준비하는 중…');
    const socket=new WebSocket(`${location.protocol==='https:'?'wss':'ws'}://${location.host}/ws`);ws=socket;
    socket.onopen=()=>socket.send(JSON.stringify({mode:$('mode').value,map_id:$('mapChoice').value||'freight',code:join?$('code').value.trim():'',name:$('mode').value==='ai'?'PLAYER':$('name').value,split:$('mode').value==='local'&&$('split').checked,quick:!join&&$('mode').value==='ai',skins:['scout','warden'],cheats:loadouts}));
    socket.onmessage=e=>{
        if(ws!==socket)return;
        const d=JSON.parse(e.data);
        if(d.type==='welcome'){if(d.version!=='0.6.0'){closedByUser=true;socket.close();toast('업데이트 파일의 버전이 다릅니다. backend와 frontend를 모두 교체한 뒤 재배포해 주세요.');return;}ids=d.ids;loadArena(d.arena);buildControls();toast(d.quick?'AI전 시작 · 화면 드래그 회전 / 탭 발사':`방 ${d.code} · 접속 완료`);}
        else if(d.type==='error')toast(d.message);
        else if(d.type==='pong'&&typeof d.sent==='number')rtt=mix(rtt,clamp(performance.now()-d.sent,0,600),.25);
        else if(d.type==='state')receive(d);
    };
    socket.onerror=()=>toast('서버 연결 실패. 잠시 후 다시 시작해 주세요.');
    socket.onclose=()=>{if(ws!==socket)return;resetInput();state=null;$('create').disabled=$('join').disabled=false;showScreen('menu');document.exitPointerLock?.();if(!closedByUser)toast('연결이 종료되었다. 다시 게임을 시작해 주세요.');};
}
$('create').onclick=()=>{if($('mode').value==='ai')connect();else $('networkSetup').showModal();};
$('hostLocal').onclick=()=>{$('networkSetup').close();connect();};
$('networkClose').onclick=()=>$('networkSetup').close();
$('join').onclick=()=>{if(!$('code').value.trim()){toast('방 코드를 입력해 주세요.');return;}$('networkSetup').close();connect(true);};
function leave(){closedByUser=true;resetInput();const old=ws;ws=null;old?.close();state=null;document.exitPointerLock?.();$('settings').close();$('networkSetup').close();$('create').disabled=$('join').disabled=false;showScreen('menu');}
document.querySelectorAll('.leave').forEach(b=>b.onclick=leave);
$('exit').onclick=()=>{leave();toast('게임을 종료했다. 탭을 닫으면 된다.');};
function settings(){resetInput();document.exitPointerLock?.();['sensitivity','volume','quality'].forEach(k=>$(k).value=options[k]);$('settings').showModal();}
$('pause').onclick=$('settingsOpen').onclick=settings;
$('settingsClose').onclick=()=>{$('settings').close();};
$('settings').addEventListener('cancel',resetInput);
['sensitivity','volume','quality'].forEach(k=>$(k).oninput=()=>{options[k]=Number($(k).value);if(k==='quality')resize();try{localStorage.setItem('cheat-fps-options',JSON.stringify(options));}catch{}});
$('start').onclick=()=>send({type:'start'});
$('again').onclick=()=>send({type:state?.quick?'rematch':'lobby'});
function toggles(p){return CHEATS.map((k,i)=>`<button class="${p.cheats[k]?'on':''}" data-toggle="${k}" data-id="${p.id}">${LABELS[i]}</button>`).join('');}
function lobby(d){
    $('roomCode').textContent=d.code;
    const teams=[0,1].map(t=>d.players.filter(p=>!p.bot&&p.team===t).length);
    $('modeInfo').textContent=`${d.mode==='local'?'로컬 대전':'AI전'} · BLUE ${teams[0]} vs RED ${teams[1]} · ${d.arena.name}`;
    $('matchMap').value=d.map_id;$('matchMap').disabled=!ids.includes(d.host);
    const stamp=JSON.stringify(d.players.map(p=>[p.id,p.name,p.team,p.skin,p.ready,p.cheats]));
    $('start').disabled=!ids.includes(d.host)||!d.can_start;
    $('start').textContent=d.mode==='local'&&!d.can_start?'모두 준비하면 자동 시작':'경기 시작';
    $('controlsInfo').textContent=d.start_hint||(d.mode==='local'?'양 팀 각 1명 이상 · 참가자 전원 준비 시 자동 시작 (팀당 최대 3명).':'참가자가 모두 준비하면 방장이 시작한다.');
    if(stamp===lobbyStamp)return;
    const editing=$('custom').contains(document.activeElement)&&['INPUT','SELECT'].includes(document.activeElement.tagName);
    $('roster').innerHTML=[0,1].map(t=>`<div class="card ${t?'red':'blue'}"><h3>${t?'RED':'BLUE'} / ${d.players.filter(p=>p.team===t).length} OF 3</h3>${d.players.filter(p=>p.team===t).map(p=>`<div class="member"><span>${esc(p.name)} ${p.id===d.host?'♛':''}</span><span>${p.ready?'준비 완료':'편성 중'}</span></div>`).join('')}</div>`).join('');
    if(editing)return;
    lobbyStamp=stamp;
    $('custom').innerHTML=ids.map((id,i)=>{const p=d.players.find(p=>p.id===id);if(!p)return '';return `<div class="card"><h3>PLAYER ${i+1}</h3><label>콜사인<input data-name="${id}" value="${esc(p.name)}" maxlength="16"></label><label>캐릭터<select data-skin="${id}">${['scout','warden','rogue'].map(s=>`<option ${p.skin===s?'selected':''}>${s}</option>`).join('')}</select></label><label>팀<select data-team="${id}" ${d.mode==='ai'?'disabled':''}><option value="0" ${p.team===0?'selected':''}>BLUE</option><option value="1" ${p.team===1?'selected':''}>RED</option></select></label><div class="toggles">${toggles(p)}</div><button data-ready="${id}" class="${p.ready?'on':''}">${p.ready?'준비 취소':'준비 완료'}</button></div>`;}).join('');
}
$('custom').onchange=e=>{
    const el=e.target,id=el.dataset.name||el.dataset.skin||el.dataset.team;if(!id)return;
    const c=el.closest('.card');send({type:'custom',name:c.querySelector('input').value,skin:c.querySelector('[data-skin]').value,team:Number(c.querySelector('[data-team]').value)},id);
};
$('custom').onclick=e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.ready)send({type:'ready'},b.dataset.ready);if(b.dataset.toggle)send({type:'toggle',key:b.dataset.toggle},b.dataset.id);};
function results(d){
    $('resultTitle').textContent=`${d.score[0]>d.score[1]?'BLUE':'RED'} TEAM VICTORY`;$('finalScore').textContent=d.score.join(' : ');
    $('rounds').innerHTML=d.history.map(h=>`<span>R${h.round} · ${h.winner?'RED':'BLUE'}<br><small>${esc(h.reason)}</small></span>`).join('');
    $('stats').innerHTML='<table><thead><tr><th>플레이어</th><th>팀</th><th>킬</th><th>데스</th></tr></thead><tbody>'+d.players.map(p=>`<tr><td>${esc(p.name)}</td><td>${p.team?'RED':'BLUE'}</td><td>${p.kills}</td><td>${p.deaths}</td></tr>`).join('')+'</tbody></table>';
    $('again').disabled=!ids.includes(d.host);$('again').textContent=d.quick?'AI전 다시 플레이':'대기실로 / 재경기';
}
function receive(d){
    const now=performance.now(),oldRound=state?.round;
    if(d.arena&&(d.map_id!==currentArena?.id||(renderer3d&&renderer3d.arenaId!==d.map_id)))loadArena(d.arena);
    const respawn=oldRound!==d.round || (state?.state!=='COUNTDOWN'&&d.state==='COUNTDOWN');
    state=d;snapshotAt=now;
    if(d.grid)map=d.grid;
    if(phase!==d.state){phase=d.state;if(['LOBBY','MATCH_END'].includes(phase))resetInput();showScreen(phase==='LOBBY'?'lobby':phase==='MATCH_END'?'result':'playUI');if(phase==='LOBBY'){lobbyStamp='';document.exitPointerLock?.();}if(phase==='MATCH_END'){document.exitPointerLock?.();results(d);}}
    for(const p of d.players){
        const list=samples.get(p.id)||[];if(respawn)list.length=0;list.push({...p,time:now});if(list.length>12)list.shift();samples.set(p.id,list);
        const prev=effects.get(p.id);
        if(prev){if(p.shots>prev.shots){prev.shotAt=now;if(ids.includes(p.id))sound(false,p.weapon);}if(p.hit>prev.hit){prev.hitAt=now;if(ids.includes(p.id))sound(true);}if(p.hp<prev.hp)prev.hurtAt=now;}
        effects.set(p.id,{...prev,shots:p.shots,hit:p.hit,hp:p.hp});
        const slot=ids.indexOf(p.id);
        if(slot>=0){
            let m=motion.get(p.id);
            if(!m||respawn){
                m={x:p.x,y:p.y,yaw:p.yaw,pitch:p.pitch||0,vx:0,vy:0,offsetX:0,offsetY:0,kick:p.kick||0,stride:0,fov:1.12};
                motion.set(p.id,m);sentInputs.set(p.id,[]);
            }else if(d.state==='PLAYING'&&p.hp>0){
                reconcile(p,m,now);
            }
            if(p.hp===0){m.vx=m.vy=0;}

        }
    }
    if(d.state==='LOBBY')lobby(d);
    syncControls();
}
function protect(e){if(e.cancelable)e.preventDefault();}
function capture(el,e){try{el.setPointerCapture(e.pointerId);}catch{}}
function buildControls(){
    if(controlIds===ids.join(':'))return;controlIds=ids.join(':');
    $('viewControls').innerHTML=ids.map((id,i)=>`<section class="viewport-controls" data-slot="${i}"><div class="weapon-selector hidden">${WEAPON_ORDER.map((key,n)=>`<button data-action="select-weapon" data-weapon="${key}" data-slot="${i}"><b>${n+1}</b>${weaponIcon(key)}<span>${WEAPON_INFO[key].name}</span></button>`).join('')}</div><div class="look-surface" data-look="${i}"></div><div class="control-hint">P${i+1} · ${i?'↑↓←→ / J,L 회전 / Enter 발사':'WASD / Q,E 회전 / Space 발사'}<br>터치: 이동 · 탭 발사 · 드래그 회전 / 무기 F·O</div><div class="joystick" data-stick="${i}" aria-label="P${i+1} 이동 조이스틱"><div class="stick-knob"></div></div><div class="actions"><button data-action="aim" data-slot="${i}">조준</button><button data-action="fire" class="fire-button" data-slot="${i}">발사</button><button data-action="reload" data-slot="${i}">장전</button></div><button data-action="spectate" data-slot="${i}" class="spectate-button hidden">관전 전환</button><div class="view-cheats"><button data-action="weapon" data-slot="${i}" aria-label="P${i+1} 무기 전환">무기 ↻</button>${CHEATS.map((key,j)=>`<button data-game-cheat="${key}" data-slot="${i}">${LABELS[j]}</button>`).join('')}</div></section>`).join('');
    resize();
}
function clearSelection(){
    if(active()&&document.getSelection()?.rangeCount)document.getSelection().removeAllRanges();
}
function tapFire(i){
    const p=state?.players.find(p=>p.id===ids[i]);
    if(!active()||state.state!=='PLAYING'||!p||p.hp<=0)return;
    const now=performance.now();control(i).snapUntil=now+220;
    assistLocal(i,now,true);
    transmit();send({type:'shoot',serial:++tapSerial},ids[i]);
}
// Touch Events are cancelled before Safari can start selection, a long-press
// callout or a compatibility mouse click. Pointer Events handle mouse and pen.
// Every contact keeps its original owner, even when it crosses the split line.
function inputTime(event){
    const stamp=Number(event.timeStamp);
    if(!Number.isFinite(stamp)||stamp<0)return performance.now();
    return stamp>1e12?stamp-performance.timeOrigin:stamp;
}
function beginContact(key,x,y,target,kind,button=0,time=performance.now()){
    if(!active())return;
    const el=target.closest?.('[data-stick],[data-look],[data-action],[data-game-cheat],#pause');
    if(!el)return;
    clearSelection();audioOn();
    if(el.id==='pause'){settings();return;}
    const i=Number(el.dataset.stick??el.dataset.look??el.dataset.slot),c=control(i);
    const g={el,i,x,y,startX:x,startY:y,time,drag:false,kind,button};
    if(el.dataset.stick!==undefined){
        if(c.stick!==null)return;
        c.stick=key;g.role='stick';el.classList.add('active');
    }else if(el.dataset.look!==undefined){
        if(c.look.size)return;
        g.role='look';c.look.set(key,g);mouseSlot=i;
        if(kind==='mouse'&&button===2){c.mouseAim=true;g.role='aim';}
        else if(kind==='mouse'&&canvas.requestPointerLock){
            try{const promise=canvas.requestPointerLock();promise?.catch(()=>{});}catch{}
        }
    }else if(el.dataset.gameCheat){
        send({type:'toggle',key:el.dataset.gameCheat},ids[i]);g.role='button';
    }else{
        g.role=el.dataset.action;
        if(g.role==='fire'){c.fire.add(key);el.classList.add('pressed');tapFire(i);}
        if(g.role==='reload')send({type:'reload'},ids[i]);
        if(g.role==='aim')c.ads=!c.ads;
        if(g.role==='spectate')c.view++;
        if(g.role==='weapon')cycleWeapon(i);
        if(g.role==='select-weapon')selectWeapon(i,el.dataset.weapon);
    }
    contacts.set(key,g);if(g.role==='stick')moveContact(key,x,y);
}
function moveContact(key,x,y){
    const g=contacts.get(key);if(!g||!active())return;
    const c=control(g.i);
    if(g.role==='stick'){
        const r=g.el.getBoundingClientRect(),radius=r.width*.38;
        let dx=(x-r.left-r.width/2)/radius,dy=(y-r.top-r.height/2)/radius;
        const length=Math.max(1,Math.hypot(dx,dy));dx/=length;dy/=length;
        c.s=Math.abs(dx)<.07?0:dx;c.f=Math.abs(dy)<.07?0:-dy;
        g.el.querySelector('.stick-knob').style.transform=`translate(${dx*radius}px,${dy*radius}px)`;
    }else if(g.role==='look'&&document.pointerLockElement!==canvas){
        if(Math.hypot(x-g.startX,y-g.startY)>8)g.drag=true;
        if(g.drag)rotateLocal(g.i,(x-g.x)*.0035*options.sensitivity,-(y-g.y)*.0035*options.sensitivity);
    }
    g.x=x;g.y=y;
}
function endContact(key,x,y,cancelled=false,time=performance.now()){
    const g=contacts.get(key);if(!g)return;
    const c=control(g.i);
    // Some browsers coalesce all movement into the final touchend position.
    const moved=Math.hypot(x-g.startX,y-g.startY)>8;
    if(g.role==='look'){
        if(!cancelled&&moved)moveContact(key,x,y);
        // Use event creation times: GPU/shader work may delay handlers by
        // seconds even though the user's physical contact lasted 30 ms.
        if(!cancelled&&!moved&&!g.drag&&time-g.time>=0&&time-g.time<320&&document.pointerLockElement!==canvas)tapFire(g.i);
    }
    if(g.role==='stick'&&c.stick===key){c.stick=null;c.f=c.s=0;g.el.querySelector('.stick-knob').style.transform='translate(0,0)';g.el.classList.remove('active');}
    c.look.delete(key);c.fire.delete(key);g.el.classList.remove('pressed');
    if(g.kind==='mouse'){c.mouseFire=c.mouseAim=false;}
    contacts.delete(key);
}
for(const kind of ['touchstart','touchmove','touchend','touchcancel']){
    document.addEventListener(kind,e=>{
        if(!active())return;
        const touches=Array.from(e.changedTouches||[]);
        const belongs=touches.some(t=>contacts.has('t'+t.identifier)||t.target.closest?.('#playUI'));
        if(!belongs)return;protect(e);
        for(const t of touches){
            const key='t'+t.identifier;
            if(kind==='touchstart')beginContact(key,t.clientX,t.clientY,t.target,'touch',0,inputTime(e));
            else if(kind==='touchmove')moveContact(key,t.clientX,t.clientY);
            else endContact(key,t.clientX,t.clientY,kind==='touchcancel',inputTime(e));
        }
    },{capture:true,passive:false});
}
$('playUI').addEventListener('pointerdown',e=>{
    if(e.pointerType==='touch'&&nativeTouch)return;
    if(!active())return;protect(e);
    beginContact('p'+e.pointerId,e.clientX,e.clientY,e.target,e.pointerType,e.button,inputTime(e));
    if(document.pointerLockElement!==canvas)capture(e.target,e);
});
window.addEventListener('pointermove',e=>{if(e.pointerType==='touch'&&nativeTouch)return;moveContact('p'+e.pointerId,e.clientX,e.clientY);});
for(const name of ['pointerup','pointercancel','lostpointercapture'])window.addEventListener(name,e=>{
    if(e.pointerType==='touch'&&nativeTouch)return;
    endContact('p'+e.pointerId,e.clientX,e.clientY,name!=='pointerup',inputTime(e));
});
document.addEventListener('selectionchange',clearSelection);
function syncControls(){
    ids.forEach((id,i)=>{const p=state?.players.find(p=>p.id===id);if(!p)return;const panel=document.querySelector(`.viewport-controls[data-slot="${i}"]`);if(!panel)return;
        panel.querySelectorAll('[data-game-cheat]').forEach(b=>b.classList.toggle('on',p.cheats[b.dataset.gameCheat]));
        panel.querySelector('[data-action="spectate"]').classList.toggle('hidden',p.hp>0);
        panel.querySelector('[data-action="weapon"]').textContent=weaponSpec(p).name+' ↻';
        const menu=panel.querySelector('.weapon-selector');menu.classList.toggle('hidden',performance.now()>(weaponMenus.get(i)||0));menu.querySelectorAll('button').forEach(b=>b.classList.toggle('selected',b.dataset.weapon===p.weapon));
        panel.querySelector('[data-action="aim"]').classList.toggle('on',control(i).ads);
    });
}
['contextmenu','selectstart','dragstart','gesturestart'].forEach(name=>document.addEventListener(name,e=>{if(e.target===canvas||e.target.closest?.('#playUI')){if(e.cancelable)e.preventDefault();}}, {passive:false}));
window.addEventListener('keydown',e=>{
    if(['INPUT','SELECT','TEXTAREA'].includes(e.target.tagName))return;
    if(e.code==='Escape'){if(active())settings();return;}if($('settings').open)return;
    if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code)&&state)e.preventDefault();keys.add(e.code);
    if(!e.repeat){const one=['Digit1','Digit2','Digit3'].indexOf(e.code),two=['Digit7','Digit8','Digit9'].indexOf(e.code);if(one>=0)selectWeapon(0,WEAPON_ORDER[one]);if(two>=0&&ids[1])selectWeapon(1,WEAPON_ORDER[two]);const cheat=['KeyZ','KeyX','KeyC'].indexOf(e.code);if(cheat>=0)send({type:'toggle',key:CHEATS[cheat]});if(e.code==='KeyR')send({type:'reload'},ids[0]);if(e.code==='KeyP'&&ids[1])send({type:'reload'},ids[1]);if(e.code==='KeyF')cycleWeapon(0);if(e.code==='KeyO'&&ids[1])cycleWeapon(1);if(e.code==='KeyV')ids.forEach((_,i)=>control(i).view++);}
});
window.addEventListener('keyup',e=>keys.delete(e.code));
window.addEventListener('blur',resetInput);
document.addEventListener('visibilitychange',()=>{if(document.hidden)resetInput();});
window.addEventListener('pointerup',e=>{if(e.pointerType==='mouse')for(const c of local.values())c.mouseFire=c.mouseAim=false;});
document.addEventListener('pointerlockchange',()=>{if(!document.pointerLockElement){for(const c of local.values())c.mouseFire=c.mouseAim=false;}});
document.addEventListener('mousedown',e=>{
    if(document.pointerLockElement!==canvas||!active())return;
    protect(e);const c=control(mouseSlot);if(e.button===0)c.mouseFire=true;if(e.button===2)c.mouseAim=true;
});
document.addEventListener('mouseup',e=>{for(const c of local.values()){if(e.button===0)c.mouseFire=false;if(e.button===2)c.mouseAim=false;}});
document.addEventListener('mousemove',e=>{if(document.pointerLockElement===canvas&&active())rotateLocal(mouseSlot,e.movementX*.0025*options.sensitivity,-e.movementY*.0025*options.sensitivity);});
function rotateLocal(i,delta,vertical=0){const m=motion.get(ids[i]);if(m&&active()){m.yaw=wrap(m.yaw+delta);m.pitch=clamp((m.pitch||0)+vertical,-1.15,1.15);}}
const down=k=>keys.has(k)?1:0;
function inputs(i,now){
    const c=control(i),has=active(),p=state?.players.find(p=>p.id===ids[i]);
    let f=c.f+(i?down('ArrowUp')-down('ArrowDown'):down('KeyW')-down('KeyS'));
    let s=c.s+(i?down('ArrowRight')-down('ArrowLeft'):down('KeyD')-down('KeyA'));
    let turn=i?down('KeyL')-down('KeyJ'):down('KeyE')-down('KeyQ');
    let fire=c.mouseFire||c.fire.size>0||now<c.fireUntil||!!down(i?'Enter':'Space');
    let aim=c.ads||c.mouseAim||!!down(i?'ShiftRight':'ShiftLeft');
    let reload=now<c.reloadUntil||!!down(i?'KeyP':'KeyR');
    const pads=navigator.getGamepads?Array.from(navigator.getGamepads()).filter(Boolean):[],pad=pads[i];
    if(pad&&has){const dz=v=>Math.abs(v||0)>.16?v:0;f-=dz(pad.axes[1]);s+=dz(pad.axes[0]);turn+=dz(pad.axes[2]);fire ||=pad.buttons[7]?.pressed;aim ||=pad.buttons[6]?.pressed;reload ||=pad.buttons[0]?.pressed;const weaponEdge=`${i}:weapon`;if(pad.buttons[3]?.pressed&&!padEdges.get(weaponEdge))cycleWeapon(i);padEdges.set(weaponEdge,!!pad.buttons[3]?.pressed);[12,13,14].forEach((b,j)=>{const k=`${i}:${b}`,pressed=!!pad.buttons[b]?.pressed;if(pressed&&!padEdges.get(k))send({type:'toggle',key:CHEATS[j]},ids[i]);padEdges.set(k,pressed);});}
    if(!has||p?.hp<=0){f=s=turn=0;fire=aim=reload=false;}
    const len=Math.max(1,Math.hypot(f,s));return c.input={f:f/len,s:s/len,turn:clamp(turn,-1,1),fire:!!fire,aim:!!aim,reload:!!reload};
}
function transmit(){
    if(!state||!ids.length)return;const now=performance.now();seq++;
    ids.forEach((id,i)=>{
        assistLocal(i,now);
        const input=inputs(i,now),m=motion.get(id),packet={type:'input',...input,turn:0,yaw:m?.yaw,pitch:m?.pitch||0,seq};
        send(packet,id);const history=sentInputs.get(id)||[];
        history.push({...packet,time:now});if(history.length>150)history.shift();sentInputs.set(id,history);
    });
    if(now-pingAt>1500){pingAt=now;send({type:'ping',sent:now});}
}
setInterval(transmit,1000/30);
function wall(x,y){return !map[Math.floor(y)]||map[Math.floor(y)][Math.floor(x)]!=='0';}
function moveClient(p,dx,dy){
    for(const [axis,delta] of [['x',dx],['y',dy]]){const x=p.x+(axis==='x'?delta:0),y=p.y+(axis==='y'?delta:0);if([-.44,.44].every(a=>[-.44,.44].every(b=>!wall(x+a,y+b))))p[axis]+=delta;else p[axis==='x'?'vx':'vy']=0;}
}
function ray(x,y,a){
    const dx=Math.cos(a),dy=Math.sin(a);let mx=Math.floor(x),my=Math.floor(y),side=0;
    const ddx=Math.abs(1/(dx||1e-9)),ddy=Math.abs(1/(dy||1e-9)),sx=dx<0?-1:1,sy=dy<0?-1:1;
    let tx=(dx<0?x-mx:mx+1-x)*ddx,ty=(dy<0?y-my:my+1-y)*ddy;
    for(let i=0;i<(map[0].length+map.length+4);i++){if(tx<ty){tx+=ddx;mx+=sx;side=0;}else{ty+=ddy;my+=sy;side=1;}if(wall(mx+.5,my+.5))break;}
    const hit={d:Math.max(.03,side?ty-ddy:tx-ddx),side,mx,my,frac:side?(x+dx*(ty-ddy))%1:(y+dy*(tx-ddx))%1};
    if(renderTrain?.active){
        const t=renderTrain;let enter=0,leave=hit.d,face=0;
        for(const [origin,direction,lo,hi,axis] of [[x,dx,t.x-t.length/2,t.x+t.length/2,0],[y,dy,t.y-t.width/2,t.y+t.width/2,1]]){
            if(Math.abs(direction)<1e-9){if(origin<lo||origin>hi){leave=-1;break;}}
            else{const a=(lo-origin)/direction,b=(hi-origin)/direction;if(Math.min(a,b)>enter){enter=Math.min(a,b);face=axis;}leave=Math.min(leave,Math.max(a,b));}
        }
        if(enter<=leave&&leave>=0)return {d:Math.max(.03,enter),side:face,mx:10,my:6,frac:((face?x+dx*enter:y+dy*enter)%1+1)%1,train:true};
    }
    return hit;
}
function visible(p,q){const d=Math.hypot(q.x-p.x,q.y-p.y);return ray(p.x,p.y,Math.atan2(q.y-p.y,q.x-p.x)).d>=d-.6;}
function integrate(m,input,dt){
    const speed=input.aim?5.7:8.0,yaw=input.yaw??m.yaw;
    const tx=(Math.cos(yaw)*input.f-Math.sin(yaw)*input.s)*speed,ty=(Math.sin(yaw)*input.f+Math.cos(yaw)*input.s)*speed;
    const blend=1-Math.exp(-22*dt),dx=tx*dt+(m.vx-tx)*blend/22,dy=ty*dt+(m.vy-ty)*blend/22;
    m.vx=mix(m.vx,tx,blend);m.vy=mix(m.vy,ty,blend);
    const steps=Math.max(1,Math.ceil(Math.max(Math.abs(dx),Math.abs(dy))/.24));
    for(let n=0;n<steps;n++)moveClient(m,dx/steps,dy/steps);
}
function reconcile(p,m,now){
    const history=sentInputs.get(p.id)||[],ack=history.findIndex(h=>h.seq===p.seq);
    if(ack<0)return;
    // Replay only the portion not yet simulated by the server. The visual
    // offset decays independently, so snapshots never directly yank the view.
    // motion is at lastFrame, not the later message-receive time. Replaying
    // past that boundary would count the same movement again next frame.
    const replayAt=Math.min(now,lastFrame);
    const target={x:p.x,y:p.y,vx:p.vx||0,vy:p.vy||0,yaw:p.yaw};
    let consumed=p.input_age||0,total=0;
    for(let j=ack;j<history.length;j++){
        const h=history[j];if(h.time>=replayAt)break;
        const duration=Math.max(0,(Math.min(history[j+1]?.time??replayAt,replayAt)-h.time)/1000);
        const skip=Math.min(duration,consumed);consumed-=skip;
        const dt=Math.min(duration-skip,.4-total);
        if(dt>0){integrate(target,h,dt);total+=dt;}
        if(total>=.4)break;
    }
    const dx=m.x-target.x,dy=m.y-target.y;
    if(Math.hypot(dx,dy)>4){m.offsetX=m.offsetY=0;}else{m.offsetX+=dx;m.offsetY+=dy;}
    m.x=target.x;m.y=target.y;m.vx=target.vx;m.vy=target.vy;
    if(ack>0)history.splice(0,ack);
}
function assistLocal(i,now,shot=false){
    const p=state?.players.find(p=>p.id===ids[i]),m=motion.get(ids[i]);
    if(!active()||state.state!=='PLAYING'||!p||!m||p.bot||p.hp<=0||!p.cheats.aim)return;
    const input=inputs(i,now);
    if(!shot&&!input.aim&&!input.fire&&now>=control(i).snapUntil)return;
    const me={...p,...m},targets=state.players.filter(q=>q.hp>0&&q.team!==p.team&&Math.hypot(q.x-m.x,q.y-m.y)<=(weaponSpec(p).range||65)&&Math.abs(wrap(Math.atan2(q.y-m.y,q.x-m.x)-m.yaw))<AIM_CONE&&visible(me,q));
    targets.sort((a,b)=>Math.abs(wrap(Math.atan2(a.y-m.y,a.x-m.x)-m.yaw))-Math.abs(wrap(Math.atan2(b.y-m.y,b.x-m.x)-m.yaw))||Math.hypot(a.x-m.x,a.y-m.y)-Math.hypot(b.x-m.x,b.y-m.y)||a.id.localeCompare(b.id));
    if(targets.length){
        const q=targets[0];m.yaw=Math.atan2(q.y-m.y,q.x-m.x);m.pitch=Math.atan2(-.3,Math.hypot(q.x-m.x,q.y-m.y));
        m.lockTarget=q.id;m.lockUntil=now+220;
    }else{m.lockTarget=null;m.lockUntil=0;}
}
function predict(dt,now){
    ids.forEach((id,i)=>{
        const p=state.players.find(p=>p.id===id),m=motion.get(id);if(!p||!m)return;const input=inputs(i,now);m.yaw=wrap(m.yaw+input.turn*3.2*dt);
        const ox=m.x,oy=m.y;
        if(state.state==='PLAYING'&&p.hp>0)integrate(m,{...input,yaw:m.yaw},dt);else m.vx=m.vy=0;
        m.stride+=Math.hypot(m.x-ox,m.y-oy)*2.25;
        const decay=Math.exp(-15*dt);m.offsetX*=decay;m.offsetY*=decay;
        assistLocal(i,now);
        m.kick=mix(m.kick,p.kick||0,1-Math.exp(-20*dt));m.fov=mix(m.fov,input.aim?.88:1.12,1-Math.exp(-12*dt));
    });
}
function interpolated(now){
    return state.players.map(source=>{
        const elapsed=state.state==='PLAYING'?Math.min(.15,Math.max(0,(now-snapshotAt)/1000)):0;const p={...source,reload:Math.max(0,source.reload-elapsed),equip:Math.max(0,source.equip-elapsed),cooldown:Math.max(0,source.cooldown-elapsed)};
        const own=motion.get(p.id);if(ids.includes(p.id)&&p.hp>0&&own)return {...p,...own,x:own.x+own.offsetX,y:own.y+own.offsetY};
        const list=samples.get(p.id)||[],time=now-100;let a=list[0],b=list[list.length-1];if(!a)return p;
        for(let j=1;j<list.length;j++){if(list[j].time>=time){a=list[j-1];b=list[j];break;}a=list[j];}
        const t=a===b?1:clamp((time-a.time)/(b.time-a.time),0,1),yaw=wrap(a.yaw+wrap(b.yaw-a.yaw)*t);
        const extra=a===b&&p.hp>0?Math.min(.08,Math.max(0,(time-b.time)/1000)):0;let ex=(b.vx||0)*extra,ey=(b.vy||0)*extra;if([-.44,.44].some(x=>[-.44,.44].some(y=>wall(b.x+ex+x,b.y+ey+y))))ex=ey=0;
        return {...p,x:mix(a.x,b.x,t)+ex,y:mix(a.y,b.y,t)+ey,yaw,pitch:mix(a.pitch||0,b.pitch||0,t),vx:mix(a.vx||0,b.vx||0,t),vy:mix(a.vy||0,b.vy||0,t)};
    });
}

// Human silhouettes are built once and cached. Their limbs animate independently
// of server snapshots; eight facing directions give depth to the 2.5D arena.
function humanSprite(team,skin,direction,step){
    const key=`${team}:${skin}:${direction}:${step}`;if(spriteCache.has(key))return spriteCache.get(key);
    const image=document.createElement('canvas');image.width=128;image.height=192;
    const g=image.getContext('2d'),a=direction*Math.PI/4,front=Math.cos(a),side=Math.sin(a);
    const accent=team?'#ef735f':'#63ceef',dark=team?'#763f3a':'#305e70';
    const suit=skin==='rogue'?'#303b40':skin==='warden'?'#626e67':'#54636b';
    const phase=Math.sin(step*Math.PI/4),swing=phase*6,wide=skin==='warden'?1.14:skin==='rogue'?.91:1;
    const cx=64,bodyW=(25+Math.abs(front)*11)*wide;
    const poly=(points,color,stroke='#141f24')=>{g.beginPath();points.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.closePath();g.fillStyle=color;g.fill();if(stroke){g.lineWidth=1.5;g.strokeStyle=stroke;g.stroke();}};
    const oval=(x,y,rx,ry,color)=>{g.beginPath();g.ellipse(x,y,rx,ry,0,0,Math.PI*2);g.fillStyle=color;g.fill();};
    const capsule=(x1,y1,x2,y2,width,color)=>{g.lineCap='round';g.strokeStyle='#18232a';g.lineWidth=width+3;g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke();g.strokeStyle=color;g.lineWidth=width;g.stroke();};
    const metal=g.createLinearGradient(40,0,84,0);metal.addColorStop(0,'#788b91');metal.addColorStop(.45,'#526770');metal.addColorStop(1,'#263c47');
    const limb=(sign,far)=>{
        const x=cx+sign*(8+Math.abs(front)*4),offset=sign*swing;
        capsule(x,116,x+offset,143,13,far?'#26353d':suit);
        capsule(x+offset,143,x+offset*.4,168,12,far?'#283239':'#44545b');
        oval(x+offset,142,8,7,far?'#303d43':'#687776');
        poly([[x+offset*.4-8,163],[x+offset*.4+7,163],[x+offset*.4+10+side*4,176],[x+offset*.4-10+side*4,178]],'#202c32');
        g.fillStyle='#718182';g.fillRect(x+offset*.4-8,173,17,3);
    };
    limb(side>=0?-1:1,true);
    if(front<-.25){poly([[cx-bodyW*.55,68],[cx+bodyW*.65,68],[cx+bodyW*.7,107],[cx-bodyW*.55,110]],'#2b3a3f');g.fillStyle=dark;g.fillRect(cx-bodyW*.48,75,bodyW*.9,23);}
    const arm=(sign,far)=>{
        const x=cx+sign*bodyW*.6,elbowX=x+sign*5+side*8,handX=cx+side*28+sign*8;
        capsule(x,72,elbowX,95,13,far?'#2b3a40':suit);
        capsule(elbowX,95,handX,91,10,far?'#26353b':'#5e7174');
        oval(x,73,skin==='warden'?12:10,12,far?'#263b43':'#58757b');
        g.fillStyle=far?dark:accent;g.fillRect(x-5,68,10,5);oval(handX,91,7,6,'#263c3d');
    };
    arm(side>=0?-1:1,true);
    poly([[cx-bodyW*.6,68],[cx-bodyW*.36,58],[cx+bodyW*.36,58],[cx+bodyW*.6,68],[cx+bodyW*.49,116],[cx-bodyW*.49,116]],metal);
    poly([[cx-bodyW*.43,72],[cx+bodyW*.43,72],[cx+bodyW*.38,101],[cx-bodyW*.36,101]],front>0?dark:'#344c51');
    g.fillStyle=accent;g.fillRect(cx-bodyW*.38,70,bodyW*.76,5);
    if(front>.1){
        for(let j=0;j<3;j++){g.fillStyle='#7c8d84';g.fillRect(cx-16+j*11,92,9,16);g.fillStyle='#3c5656';g.fillRect(cx-15+j*11,94,7,2);}
        g.fillStyle='#b4beb0';g.fillRect(cx-3,76,6,9);
        if(skin==='warden'){poly([[cx-16,77],[cx+16,77],[cx+13,88],[cx-13,88]],'#82968c');g.fillStyle=accent;g.fillRect(cx-10,81,20,3);}
        if(skin==='rogue'){poly([[cx-16,70],[cx-9,70],[cx+16,99],[cx+9,102]],'#8b9f8a');}
    }else{g.strokeStyle='#6c8582';g.lineWidth=2;g.strokeRect(cx-12,79,24,18);}
    g.fillStyle='#1c2d33';g.fillRect(cx-bodyW*.48,110,bodyW*.96,8);g.fillStyle='#a3b1a4';g.fillRect(cx-4,110,8,6);
    limb(side>=0?1:-1,false);
    // Neck, helmet, ears, face shield and a headset remain human proportions.
    g.fillStyle='#bb9881';g.fillRect(cx-6+side*3,52,12,13);
    const headX=cx+side*4;
    oval(headX,43,15,18,'#bda58d');
    oval(headX,36,18*wide,17,skin==='rogue'?'#263c42':metal);
    if(skin==='rogue'){poly([[headX-19,38],[headX-15,24],[headX,16],[headX+16,24],[headX+20,38]],'#263c42');}
    if(skin==='scout'){g.fillStyle='#c1d5cc';g.fillRect(headX-4,20,8,7);g.fillStyle=accent;g.fillRect(headX-2,21,4,3);}
    if(skin==='warden'){g.strokeStyle='#9ba99d';g.lineWidth=2;g.beginPath();g.moveTo(headX-18,29);g.lineTo(headX+18,29);g.stroke();}
    poly([[headX-17*wide,34],[headX+17*wide,34],[headX+16*wide,45],[headX-16*wide,45]],front>=-.1?'#152d36':'#526e72');
    if(front>=-.1){
        const visor=g.createLinearGradient(headX-14,32,headX+14,43);visor.addColorStop(0,'#b9f7ed');visor.addColorStop(.45,accent);visor.addColorStop(1,'#244b58');
        g.fillStyle=visor;g.fillRect(headX-13+side*3,35,23-Math.abs(side)*8,6);
        g.fillStyle='#4d6667';g.fillRect(headX-9+side*4,46,18-Math.abs(side)*6,9);
        g.strokeStyle='#a2b8b2';g.lineWidth=1;g.beginPath();g.moveTo(headX-6,51);g.lineTo(headX+5,51);g.stroke();
    }else{g.fillStyle=accent;g.fillRect(headX-9,35,18,4);}
    oval(headX+(side>=0?14:-14),42,4,8,'#273d45');
    g.strokeStyle='#749593';g.lineWidth=2;g.beginPath();g.moveTo(headX+(side>=0?14:-14),42);g.lineTo(headX+side*9,54);g.stroke();
    arm(side>=0?1:-1,false);
    // Rifle in both hands; side views show its barrel, front views its muzzle.
    g.save();g.translate(cx+side*17,89);g.rotate(side*.14);
    const gunWidth=22+Math.abs(side)*29;
    poly([[-gunWidth*.5,-5],[gunWidth*.5,-5],[gunWidth*.5,4],[-gunWidth*.5,6]],'#24353f');
    g.fillStyle='#819b9f';g.fillRect(-gunWidth*.42,-4,gunWidth*.67,2);
    g.fillStyle='#192b34';g.fillRect(gunWidth*.5-1,-2,8+Math.abs(side)*11,4);
    g.fillStyle=accent;g.fillRect(-4,-4,6,2);
    poly([[-5,4],[3,4],[1,18],[-6,18]],'#304752');g.restore();
    spriteCache.set(key,image);return image;
}
function line(x1,y1,x2,y2,color,width=1){ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();}
function textAt(s,x,y,size=14,color='#e8f0eb',align='left'){
    ctx.font=`${size>=18?'700 ':'600 '}${size}px Arial,sans-serif`;ctx.fillStyle=color;ctx.textAlign=align;ctx.fillText(s,x,y);
}
function rounded(x,y,w,h,r,color){ctx.fillStyle=color;ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill();}
function ground(p,w,h,horizon,proj){
    const sky=ctx.createLinearGradient(0,0,0,horizon);sky.addColorStop(0,'#273b4a');sky.addColorStop(.7,'#738b91');sky.addColorStop(1,'#bac5b5');ctx.fillStyle=sky;ctx.fillRect(0,0,w,horizon);
    const floor=ctx.createLinearGradient(0,horizon,0,h);floor.addColorStop(0,'#586863');floor.addColorStop(.16,'#3d4e4b');floor.addColorStop(1,'#162626');ctx.fillStyle=floor;ctx.fillRect(0,horizon,w,h-horizon);
    const co=Math.cos(p.yaw),si=Math.sin(p.yaw);
    const cam=(x,y)=>({z:(x-p.x)*co+(y-p.y)*si,u:-(x-p.x)*si+(y-p.y)*co});
    const grid=(x,y,xx,yy)=>{
        let a=cam(x,y),b=cam(xx,yy);if(a.z<.08&&b.z<.08)return;
        if(a.z<.08){const t=(.08-a.z)/(b.z-a.z);a={z:.08,u:mix(a.u,b.u,t)};}if(b.z<.08){const t=(.08-b.z)/(a.z-b.z);b={z:.08,u:mix(b.u,a.u,t)};}
        line(w/2+a.u*proj/a.z,horizon+proj*1.5/a.z,w/2+b.u*proj/b.z,horizon+proj*1.5/b.z,'#99aaa11c');
    };
    ctx.save();ctx.beginPath();ctx.rect(0,horizon,w,h-horizon);ctx.clip();
    for(let x=1;x<map[0].length;x+=2)grid(x,1,x,map.length-1);for(let y=1;y<map.length;y+=2)grid(1,y,map[0].length-1,y);
    ctx.restore();
}
function wallMaterial(pillar,brightness){
    const level=Math.round(brightness/4),key=`${pillar}:${level}`;if(wallCache.has(key))return wallCache.get(key);
    const image=document.createElement('canvas');image.width=64;image.height=128;const g=image.getContext('2d');
    g.fillStyle=`hsl(${pillar?185:174} 10% ${level*4}%)`;g.fillRect(0,0,64,128);
    g.fillStyle=`hsl(185 13% ${clamp(level*4-16,12,60)}%)`;g.fillRect(0,83,64,45);
    g.fillStyle=pillar?'#d6ba65':'#a7c5bc';g.globalAlpha=.7;g.fillRect(0,15,64,4);g.globalAlpha=1;
    g.fillStyle='#0b202549';g.fillRect(0,0,2,128);g.fillRect(62,0,2,128);
    g.fillStyle='#d8ece12b';g.fillRect(0,0,64,2);g.fillStyle='#09202670';g.fillRect(0,81,64,2);
    g.fillStyle='#17323822';g.fillRect(10,47,44,1);g.fillRect(10,27,44,1);
    if(pillar==='train'){
        g.fillStyle='#354f3e';g.fillRect(0,0,64,128);g.fillStyle='#b6c9ae';g.fillRect(5,17,54,28);
        g.fillStyle='#182d2e';g.fillRect(8,20,48,22);g.fillStyle='#d6a847';g.fillRect(0,80,64,12);
        g.fillStyle='#1a2528';g.fillRect(0,111,64,17);g.fillStyle='#929e82';g.fillRect(0,58,64,3);
    }
    wallCache.set(key,image);return image;
}
function walls(p,w,h,horizon,proj,fov){
    const columns=Math.ceil(w/options.quality),width=w/columns,depths=new Float32Array(columns);
    const co=Math.cos(p.yaw),si=Math.sin(p.yaw),lens=Math.tan(fov/2);
    for(let i=0;i<columns;i++){
        const camera=(2*(i+.5)/columns-1)*lens,angle=p.yaw+Math.atan(camera),hit=ray(p.x,p.y,angle);
        const z=hit.d/Math.sqrt(1+camera*camera),pillar=hit.mx>0&&hit.mx<map[0].length-1&&hit.my>0&&hit.my<map.length-1,wallHeight=hit.train?4.8:pillar?2.6:3.8,height=proj*wallHeight/z,top=horizon-proj*(wallHeight-1.5)/z,x=i*width;
        depths[i]=z;
        const brightness=clamp(70-z*1.25-(hit.side?9:0),18,70),shade=pillar?brightness-3:brightness;
        const texture=wallMaterial(hit.train?'train':pillar,shade),dy=Math.max(0,top),bottom=Math.min(h,top+height),dh=bottom-dy;
        if(dh>0)ctx.drawImage(texture,Math.floor(hit.frac*63),128*(dy-top)/height,1,128*dh/height,x,dy,width+.6,dh);
    }
    return {depths,width,co,si};
}
function characters(p,roster,w,h,horizon,proj,depth,now){
    const {co,si,depths,width}=depth;
    const projected=roster.filter(q=>q.id!==p.id&&q.hp>0).map(q=>{
        const dx=q.x-p.x,dy=q.y-p.y,z=dx*co+dy*si,u=-dx*si+dy*co;
        return {q,z,x:w/2+u*proj/z,size:proj/z};
    }).filter(t=>t.z>.12).sort((a,b)=>b.z-a.z);
    for(const {q,z,x,size} of projected){
        const hh=size*1.88,ww=hh*128/192,left=x-ww/2,top=horizon+size*1.5-hh;
        if(left>w||left+ww<0)continue;
        const start=clamp(Math.floor(left/width),0,depths.length-1),end=clamp(Math.ceil((left+ww)/width),0,depths.length-1);
        let seen=false;ctx.save();ctx.beginPath();
        let run=-1;
        for(let j=start;j<=end+1;j++){
            const exposed=j<=end&&z<depths[j]+.025;
            if(exposed){seen=true;if(run<0)run=j;}
            else if(run>=0){ctx.rect(run*width,0,(j-run)*width,h);run=-1;}
        }
        ctx.clip();
        if(seen){
            ctx.fillStyle='#03151366';ctx.beginPath();ctx.ellipse(x,horizon+size*1.48,ww*.47,Math.max(2,hh*.045),0,0,Math.PI*2);ctx.fill();
            const facing=wrap(q.yaw-Math.atan2(p.y-q.y,p.x-q.x)),direction=(Math.round(facing/(Math.PI/4))+8)%8;
            const speed=Math.hypot(q.vx||0,q.vy||0),step=speed>.25?Math.floor(now/68+q.x*.4+q.y*.3)%8:0;
            ctx.globalAlpha=clamp(1-z/60,.6,1);ctx.drawImage(humanSprite(q.team,q.skin,direction,step),left,top,ww,hh);ctx.globalAlpha=1;
            if(q.team!==p.team){ctx.fillStyle='#ff332c';ctx.fillRect(x-ww*.16,top+hh*.14,ww*.32,Math.max(2,hh*.023));}
            const fired=now-(effects.get(q.id)?.shotAt||0);if(fired<65){ctx.fillStyle='#ffe6a5';ctx.beginPath();ctx.arc(x+Math.sin(facing)*ww*.15,top+hh*.46,Math.max(2,hh*.045),0,Math.PI*2);ctx.fill();}
        }
        ctx.restore();
        const allied=q.team===p.team,esp=!allied&&p.cheats.esp;
        if((seen&&allied)||esp){
            const color=allied?'#7bd9ed':'#ff8e7b',font=clamp(ww*.13,9,13),labelY=clamp(top-12,100,h-140);
            if(esp){ctx.strokeStyle=color;ctx.lineWidth=1.5;ctx.setLineDash(seen?[]:[4,3]);ctx.strokeRect(left+ww*.16,top+hh*.08,ww*.68,hh*.84);ctx.setLineDash([]);}
            textAt(`${q.name} · ${q.hp}`,x,labelY,font,color,'center');ctx.fillStyle='#0d1c21c9';ctx.fillRect(x-24,labelY+5,48,3);ctx.fillStyle=color;ctx.fillRect(x-24,labelY+5,48*q.hp/100,3);
        }
    }
}
function rifleModel(team){
    if(weaponCache.has(team))return weaponCache.get(team);
    const image=document.createElement('canvas');image.width=image.height=720;
    const g=image.getContext('2d');g.scale(2,2);g.translate(180,335);
    const stroke=(x1,y1,x2,y2,color,width)=>{g.strokeStyle=color;g.lineWidth=width;g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke();};
    const shape=(points,fill,stroke='#111e23')=>{g.beginPath();points.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.closePath();g.fillStyle=fill;g.fill();if(stroke){g.strokeStyle=stroke;g.lineWidth=2;g.stroke();}};
    const steel=g.createLinearGradient(-60,0,80,0);steel.addColorStop(0,'#596e76');steel.addColorStop(.38,'#9bafb1');steel.addColorStop(.42,'#4b636e');steel.addColorStop(1,'#21333e');
    const sleeve=team?'#6b4843':'#3a5966';
    shape([[-150,25],[-106,-60],[-50,-114],[-23,-102],[-38,-53],[-69,20]],sleeve);
    shape([[122,25],[103,-69],[50,-116],[15,-83],[51,-31],[64,25]],sleeve);
    shape([[-44,-120],[-23,-141],[12,-126],[20,-103],[-2,-81],[-27,-93]],'#42584f');
    // Stock, magazine, receiver, handguard and barrel, in perspective.
    shape([[-21,12],[-62,-67],[-42,-150],[12,-138],[51,-45],[55,12]],'#273b45');
    shape([[-22,-56],[-50,-126],[-26,-187],[22,-170],[46,-107],[20,-45]],steel);
    shape([[-2,-45],[-20,-78],[-16,-114],[26,-104],[35,-58],[16,-34]],'#1d323e');
    shape([[-35,-127],[-34,-189],[-19,-229],[13,-229],[34,-187],[28,-134]],steel);
    shape([[-16,-226],[-10,-271],[8,-271],[15,-226]],'#263d47');
    g.fillStyle='#8aa3a4';g.fillRect(-10,-263,3,36);g.fillStyle='#10252e';g.fillRect(-11,-276,22,8);
    for(let y=-207;y<-141;y+=12){stroke(-26,y,24,y+2,'#18313c',4);stroke(-24,y-3,16,y-1,'#a0b9b14d',1);}
    shape([[-10,-183],[-12,-205],[13,-205],[15,-181]],'#182a32');g.fillStyle='#607e7e';g.fillRect(-7,-200,15,3);
    g.strokeStyle='#9caeaa';g.lineWidth=2;g.strokeRect(-4,-198,10,12);
    g.fillStyle=team?'#ff8a78':'#7cd9ef';g.fillRect(-28,-145,8,19);
    g.save();g.translate(-20,-87);g.rotate(-.24);g.font='600 8px Arial';g.fillStyle='#abbeb8';g.fillText('CHEAT / AR',0,0);g.restore();
    [[-20,-117],[24,-117],[-21,-158],[19,-174]].forEach(([x,y])=>{g.fillStyle='#a9b6af';g.beginPath();g.arc(x,y,2,0,Math.PI*2);g.fill();});
    shape([[36,-109],[61,-112],[79,-90],[73,-60],[48,-68],[26,-92]],'#405c51');
    weaponCache.set(team,image);return image;
}
function secondaryModel(key){
    if(weaponCache.has(key))return weaponCache.get(key);
    const image=document.createElement('canvas');image.width=image.height=360;const g=image.getContext('2d');
    g.translate(180,335);g.lineJoin='round';g.lineWidth=3;g.strokeStyle='#1c2d30';
    const box=(x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(x,y,w,h);g.strokeRect(x,y,w,h);};
    box(-85,-65,58,70,'#526b55');box(28,-60,58,80,'#526b55');
    if(key==='pistol'){
        box(-21,-130,43,130,'#293d40');box(-25,-219,50,107,'#73847e');box(-16,-226,32,16,'#23383d');
        box(-10,-239,20,15,'#1d2d31');box(-25,-140,50,15,'#3f5555');
        for(let j=0;j<6;j++)box(-25,-133+j*7,50,3,'#1b3036');
    }else{
        box(-31,-143,62,165,'#3b4c48');box(-25,-201,50,97,'#798982');box(-13,-297,26,100,'#354b50');
        box(-24,-253,48,87,'#746c51');for(let j=0;j<8;j++)box(-24,-245+j*9,48,3,'#283d3c');
        box(-15,-304,30,13,'#1b3036');box(-5,-319,10,18,'#bfd6a5');
    }
    box(-60,-95,44,56,'#405a49');box(16,-80,44,63,'#405a49');weaponCache.set(key,image);return image;
}
function rifle(p,m,w,h,now){
    const fx=effects.get(p.id)||{},shot=now-(fx.shotAt||0),flash=shot>=0&&shot<55;
    const moving=Math.min(1,Math.hypot(m?.vx||0,m?.vy||0)/7.2),stride=m?.stride||0;
    const ads=m?.fov<1,scale=Math.min(w*.72,h*.72)/330;
    const bobX=Math.sin(stride)*moving*4,bobY=Math.abs(Math.cos(stride))*moving*4;
    const kick=p.cheats.recoil?0:Math.max(0,1-shot/115)*8;
    ctx.save();ctx.translate(w*(ads?.50:.61)+bobX,h+18+bobY+kick);ctx.scale(scale,scale);
    if(p.reload>0){ctx.translate(45,Math.sin(p.reload/weaponSpec(p).reload_time*Math.PI)*85);ctx.rotate(Math.sin(p.reload/weaponSpec(p).reload_time*Math.PI)*.3);}
    ctx.drawImage(p.weapon&&p.weapon!=='rifle'?secondaryModel(p.weapon):rifleModel(p.team),-180,-335,360,360);
    if(flash){
        const glow=ctx.createRadialGradient(0,-278,1,0,-278,55);glow.addColorStop(0,'#fffbe8');glow.addColorStop(.3,'#ffc673d0');glow.addColorStop(1,'#ffac4300');ctx.fillStyle=glow;ctx.fillRect(-60,-338,120,120);
        ctx.beginPath();[[-4,-278],[-19,-303],[-7,-299],[0,-323],[8,-300],[25,-298],[6,-276]].forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fillStyle='#fff1b7';ctx.fill();
    }
    ctx.restore();
}
function radar(p,roster,x,y,size){
    rounded(x,y,size,size,5,'#071c23a3');const scale=(size-14)/Math.max(map[0].length,map.length);
    for(let yy=0;yy<map.length;yy++)for(let xx=0;xx<map[yy].length;xx++)if(map[yy][xx]==='1'){ctx.fillStyle='#839a9660';ctx.fillRect(x+7+xx*scale,y+7+yy*scale,scale,scale);}
    for(const q of roster){if(q.hp<=0||q.team!==p.team&&!p.cheats.esp)continue;ctx.fillStyle=q.id===p.id?'#d5ff68':q.team===p.team?'#72d5ed':'#ff8573';ctx.beginPath();ctx.arc(x+7+q.x*scale,y+7+q.y*scale,q.id===p.id?3:2.2,0,Math.PI*2);ctx.fill();}
    line(x+7+p.x*scale,y+7+p.y*scale,x+7+(p.x+Math.cos(p.yaw)*1.5)*scale,y+7+(p.y+Math.sin(p.yaw)*1.5)*scale,'#d5ff68',1.5);
}
function hud(p,owner,roster,w,h,index,horizon,now){
    const compact=w<560,alive=[0,1].map(t=>state.players.filter(q=>q.hp>0&&q.team===t).length),font=compact?Math.min(15,w/18):19;
    const scoreWidth=Math.min(w-14,compact?270:334);
    rounded(w/2-scoreWidth/2,12,scoreWidth,54,7,'#07171fbc');
    textAt(`BLUE ${alive[0]}   ${state.score[0]} : ${state.score[1]}   ${alive[1]} RED`,w/2,34,font,'#e0efea','center');
    textAt(`${state.arena?.name||''} · R${state.round}/5 · ${Math.ceil(state.timer)}s`,w/2,54,11,'#d0f773','center');
    if(renderTrain&&state.state==='PLAYING'&&owner.hp>0){
        const danger=renderTrain.active||renderTrain.warning;
        const label=renderTrain.active?'기차 통과 중 · 충돌 즉사':renderTrain.warning?`기차 진입 ${Math.ceil(renderTrain.next_in)}초 · 선로 주의`:`다음 기차 ${Math.ceil(renderTrain.next_in)}초`;
        rounded(w/2-Math.min(145,w*.43),70,Math.min(290,w*.86),24,4,danger?'#642e22de':'#07171fbc');
        textAt(label,w/2,86,compact?10:12,danger?'#ffce7b':'#b8c7b5','center');
    }
    if(state.heat_zones?.length)textAt('제련소 · 붉은 장판에서 벗어나세요',w/2,85,11,'#ff8a78','center');
    if(state.arena?.clock)textAt('회전 시침 주의 · 접촉 피해 35',w/2,85,11,'#ffce7b','center');
    if(state.crane&&(state.crane.moving||state.crane.warning))textAt('크레인 가동 · 낙하 구역 압사 주의',w/2,85,11,'#ffce7b','center');
    textAt(`P${index+1} / ${owner.name}${owner.hp<=0?' · 관전':''}`,14,compact?83:88,11,owner.team?'#ffab97':'#a2dcec');
    // Health and ammunition sit above the touch controls, per viewport.
    const touch=touchDevice||ids.length===2,baseline=touch?h-(h<530?208:252):h-66;
    const cardWidth=Math.min(compact?112:138,w*.43),hudFont=w<300?15:19;
    rounded(12,baseline,cardWidth,49,5,'#07191fc9');
    textAt(`HP ${owner.hp}`,23,baseline+22,hudFont,owner.hp<30?'#ff8c76':'#e9f1e9');
    ctx.fillStyle='#314643';ctx.fillRect(23,baseline+31,cardWidth-23,5);ctx.fillStyle=owner.hp<30?'#ef735e':'#c6ff47';ctx.fillRect(23,baseline+31,(cardWidth-23)*owner.hp/100,5);
    const ammo=String(p.ammo).padStart(2,'0');rounded(w-cardWidth-12,baseline,cardWidth,49,5,'#07191fc9');
    textAt(p.reload>0?'RELOADING':`${ammo} / ${p.reserves?.[p.weapon]??0}`,w-24,baseline+22,p.reload>0?Math.min(13,hudFont):hudFont,'#e9f1e9','right');textAt(weaponSpec(p).name,w-24,baseline+39,w<300?7:9,'#8ca9a5','right');
    if(p.weapon==='shotgun'&&p.cooldown>0){textAt('펌프 · '+p.cooldown.toFixed(1)+'s',w-24,baseline-8,11,'#ffc66c','right');}
    if(owner.hp>0&&owner.cheats.aim){
        const m=motion.get(owner.id),locked=m?.lockTarget&&now<m.lockUntil;
        textAt(locked?'AIM LOCK':'AIM · 조준/발사 시 자동 고정',w/2,horizon+38,compact?9:11,locked?'#ffce7b':'#b9d58e','center');
    }
    const gap=6+Math.min(12,p.kick*75),cross=owner.hp>0?'#d9ff75':'#c6dcd5';
    line(w/2-gap-8,horizon,w/2-gap,horizon,cross,1.5);line(w/2+gap,horizon,w/2+gap+8,horizon,cross,1.5);line(w/2,horizon-gap-8,w/2,horizon-gap,cross,1.5);line(w/2,horizon+gap,w/2,horizon+gap+8,cross,1.5);ctx.fillStyle=cross;ctx.fillRect(w/2-1,horizon-1,2,2);
    if(now-(effects.get(p.id)?.hitAt||0)<180){for(const sign of [-1,1]){line(w/2+sign*8,horizon+8,w/2+sign*14,horizon+14,'#fff5d1',2);line(w/2+sign*8,horizon-8,w/2+sign*14,horizon-14,'#fff5d1',2);}}
    if(p.cheats.esp&&w>350){radar(p,roster,14,compact?112:127,compact?85:106);textAt('ESP / LIVE',18,compact?107:121,9,'#d4f77e');}
    const killWidth=Math.min(350,w-24),killX=w-killWidth-12,killY=compact?103:112;
    state.log.slice(compact?-2:-4).forEach((e,j)=>{const y=killY+j*32,cause=e.cause==='crane'?'압사':e.cause==='heat'?'화상':e.cause==='clock'?'시침':e.cause==='train'?'열차':WEAPON_INFO[e.weapon]?.name||'킬';rounded(killX,y,killWidth,28,4,'#081013e8');ctx.fillStyle=e.team===null?'#ff884f':e.team?'#ff746b':'#70d9ff';ctx.fillRect(killX,y,4,28);let label=`${e.killer}  [${cause}]  ${e.victim}`;ctx.font='bold 13px Arial';while(ctx.measureText(label).width>killWidth-20&&label.length>4)label=label.slice(0,-2);textAt(label,killX+11,y+19,13,'#fff4df');});
    if(owner.hp<=0){rounded(w/2-115,76,230,48,5,'#07191fd4');textAt('KNOCKED OUT',w/2,96,15,'#ff9a84','center');textAt(p.id!==owner.id?`관전: ${p.name}`:'남은 아군 없음',w/2,113,10,'#afc3bd','center');}
    if(state.state==='COUNTDOWN'||state.state==='ROUND_END'){
        rounded(w/2-Math.min(210,w*.42),h*.33-37,Math.min(420,w*.84),95,8,'#061921bb');
        textAt(state.state==='COUNTDOWN'?`ROUND ${state.round} · ${Math.ceil(state.timer)}`:state.message,w/2,h*.33,compact?20:27,'#edffe3','center');
        textAt(state.state==='COUNTDOWN'?(state.message.includes('동시 녹아웃')?state.message:state.train?'기차 충돌 즉사 · 선로에서 대기하지 마세요':'준비 · 치트 토글을 선택하세요'):'다음 라운드를 준비하는 중',w/2,h*.33+26,11,'#adc5b9','center');
    }
    const hurt=now-(effects.get(owner.id)?.hurtAt||0);if(hurt>=0&&hurt<300){ctx.strokeStyle=`rgba(242,79,62,${(1-hurt/300)*.6})`;ctx.lineWidth=14;ctx.strokeRect(3,3,w-6,h-6);}
}
function labels3d(p,roster,rect){
    for(const q of roster){
        if(q.hp<=0||q.id===p.id)continue;
        const enemy=q.team!==p.team;if(enemy&&!p.cheats.esp&&!visible(p,q))continue;
        const box=renderer3d.project(q,rect);if(!box)continue;
        const height=box.bottom-box.top,width=Math.max(10,height*.37),tint=enemy?'#ff9681':'#81e2ff';
        if(enemy&&p.cheats.esp){ctx.strokeStyle=tint;ctx.lineWidth=1.5;ctx.strokeRect(box.x-width/2,box.top,width,height);}
        if(height>12&&(p.cheats.esp||!enemy)){
            textAt(`${q.name} · ${q.hp}`,box.x,box.top-12,Math.min(11,Math.max(8,height*.12)),tint,'center');
            ctx.fillStyle='#163132';ctx.fillRect(box.x-22,box.top-8,44,3);ctx.fillStyle=tint;ctx.fillRect(box.x-22,box.top-8,44*q.hp/100,3);
        }
    }
}
function heatFallback(p,w,h,horizon,proj){
    const time=(state.world_time||0)+Math.min(.15,(performance.now()-snapshotAt)/1000);
    for(const z of state.heat_zones||[]){if(time>=z.end)continue;const points=[];for(let i=0;i<33;i++){const a=i*Math.PI/16,dx=z.x+Math.cos(a)*z.radius-p.x,dy=z.y+Math.sin(a)*z.radius-p.y,depth=dx*Math.cos(p.yaw)+dy*Math.sin(p.yaw);if(depth<.1){points.length=0;break;}points.push([w/2+(-dx*Math.sin(p.yaw)+dy*Math.cos(p.yaw))*proj/depth,horizon+1.5*proj/depth]);}if(points.length){ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fillStyle=time>=z.start?'#ff231b88':'#ff534633';ctx.fill();ctx.strokeStyle='#ff7868';ctx.lineWidth=3;ctx.stroke();}}
}
function view(index,roster,w,h,now,rect){
    const owner=roster.find(p=>p.id===ids[index]);if(!owner)return;
    let p=owner;const c=control(index);
    if(owner.hp<=0){const alive=roster.filter(q=>q.team===owner.team&&q.hp>0);if(alive.length)p=alive[c.view%alive.length];}
    const m=motion.get(p.id),fov=p.id===owner.id&&m?m.fov:1.12;
    if(renderer3d&&!renderer3d.lost){
        renderer3d.render(p,rect,fov,now,effects.get(p.id));labels3d(p,roster,rect);
    }else{
        const proj=w/(2*Math.tan(fov/2)),horizon=h*.5+Math.tan(p.pitch||0)*proj;
        ground(p,w,h,horizon,proj);heatFallback(p,w,h,horizon,proj);const depth=walls(p,w,h,horizon,proj,fov);
        characters(p,roster,w,h,horizon,proj,depth,now);
        if(p.hp>0)rifle(p,m,w,h,now);
    }
    hud(p,owner,roster,w,h,index,h*.5,now);
}
function viewportLayout(){
    const vertical=ids.length===2&&viewportWidth<viewportHeight;
    return ids.map((_,i)=>({x:vertical?0:i*viewportWidth/ids.length,y:vertical?i*viewportHeight/2:0,w:vertical?viewportWidth:viewportWidth/ids.length,h:vertical?viewportHeight/2:viewportHeight}));
}
function resize(){
    viewportWidth=Math.round(window.visualViewport?.width||innerWidth);viewportHeight=Math.round(window.visualViewport?.height||innerHeight);
    document.documentElement.style.setProperty('--app-height',viewportHeight+'px');
    const ratio=Math.min(devicePixelRatio||1,1,1440/Math.max(viewportWidth,viewportHeight));
    const width=Math.max(1,Math.round(viewportWidth*ratio)),height=Math.max(1,Math.round(viewportHeight*ratio));
    if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;}
    ctx.setTransform(width/viewportWidth,0,0,height/viewportHeight,0,0);
    renderer3d?.resize(viewportWidth,viewportHeight,options.quality);
    viewportLayout().forEach((r,i)=>{const el=document.querySelector(`.viewport-controls[data-slot="${i}"]`);if(el){Object.assign(el.style,{left:r.x+'px',top:r.y+'px',width:r.w+'px',height:r.h+'px',bottom:'auto'});el.classList.toggle('compact-pane',r.h<530);}});
    document.body.classList.toggle('portrait-split',ids.length===2&&viewportWidth<viewportHeight);
}
window.addEventListener('resize',resize);window.visualViewport?.addEventListener('resize',resize);resize();
// Canvas fallback draws the same server map as an isometric overview.
function previewFallback(now){
    ctx.fillStyle='#243b3e';ctx.fillRect(0,0,viewportWidth,viewportHeight);
    const scale=Math.min(viewportWidth/(previewMap[0].length+previewMap.length)*1.1,viewportHeight/(previewMap[0].length+previewMap.length)*1.3),cx=viewportWidth*.65,cy=viewportHeight*.24;
    for(let y=0;y<previewMap.length;y++)for(let x=0;x<previewMap[y].length;x++){
        const px=cx+(x-y-(previewMap[0].length-previewMap.length)/2)*scale*.85,py=cy+(x+y)*scale*.4,solid=previewMap[y][x]==='1',lift=solid?scale*.9:0;
        ctx.beginPath();ctx.moveTo(px,py-lift);ctx.lineTo(px+scale*.85,py+scale*.4-lift);ctx.lineTo(px,py+scale*.8-lift);ctx.lineTo(px-scale*.85,py+scale*.4-lift);ctx.closePath();ctx.fillStyle=solid?'#8b9c8d':'#556d63';ctx.fill();ctx.strokeStyle='#304d47';ctx.stroke();
        if(solid){ctx.beginPath();ctx.moveTo(px-scale*.85,py+scale*.4-lift);ctx.lineTo(px,py+scale*.8-lift);ctx.lineTo(px,py+scale*.8);ctx.lineTo(px-scale*.85,py+scale*.4);ctx.closePath();ctx.fillStyle='#3b5653';ctx.fill();ctx.beginPath();ctx.moveTo(px,py+scale*.8-lift);ctx.lineTo(px+scale*.85,py+scale*.4-lift);ctx.lineTo(px+scale*.85,py+scale*.4);ctx.lineTo(px,py+scale*.8);ctx.closePath();ctx.fillStyle=x<8?'#497c85':'#776153';ctx.fill();}
    }
}
function frame(now){
    const dt=Math.min(.15,Math.max(0,(now-lastFrame)/1000));frameMs=mix(frameMs,now-lastFrame,.05);lastFrame=now;
    ctx.clearRect(0,0,viewportWidth,viewportHeight);
    if(state&&map.length&&['COUNTDOWN','PLAYING','ROUND_END'].includes(state.state)){
        $('world3d').style.visibility='visible';
        renderTrain=trainAt(state.arena?.train,(state.train?.elapsed||0)+(state.state==='PLAYING'?Math.min(.25,(now-snapshotAt)/1000):0));
        renderer3d?.updateTrain(renderTrain);
        renderer3d?.updateHeat(state.heat_zones||[],(state.world_time||0)+(state.state==='PLAYING'?Math.min(.15,(now-snapshotAt)/1000):0));
        renderer3d?.updateMechanisms((state.world_time||0)+(state.state==='PLAYING'?Math.min(.25,(now-snapshotAt)/1000):0),state.crane);
        predict(dt,now);const roster=interpolated(now),rects=viewportLayout();renderer3d?.begin(roster,now);
        for(let i=0;i<ids.length;i++){const r=rects[i];ctx.save();ctx.translate(r.x,r.y);ctx.beginPath();ctx.rect(0,0,r.w,r.h);ctx.clip();view(i,roster,r.w,r.h,now,r);ctx.restore();}
        if(ids.length===2){const r=rects[1];if(r.y)line(0,r.y,viewportWidth,r.y,'#07191f',3);else line(r.x,0,r.x,viewportHeight,'#07191f',3);}
    }else if(!ids.length&&!$('menu').classList.contains('hidden')&&previewMap.length){
        const due=!document.hidden&&now-lastPreview>50;
        if(due){const next=Math.floor(now/12000)%Math.max(1,arenaCatalog.length);if(next!==previewIndex)showPreview(next);}
        renderTrain=trainAt(arenaCatalog[previewIndex]?.train,now/1000);
        if(renderer3d&&!renderer3d.lost){$('world3d').style.visibility='visible';if(due){renderer3d.updateTrain(renderTrain);renderer3d.updateMechanisms(now/1000,null);renderer3d.preview(now);}}
        else{$('world3d').style.visibility='hidden';previewFallback(now);}
        if(due)lastPreview=now;
    }else{$('world3d').style.visibility='hidden';ctx.fillStyle='#0a1013';ctx.fillRect(0,0,viewportWidth,viewportHeight);}
    requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
