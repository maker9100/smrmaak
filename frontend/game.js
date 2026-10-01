'use strict';
// Cheat FPS 0.2.0: frame-rate camera, analog controls and authoritative server.
const $ = id => document.getElementById(id);
const canvas = $('game'), ctx = canvas.getContext('2d', {alpha:false});
const CHEATS = ['aim','esp','recoil','ammo'];
const LABELS = ['AIM','ESP','NO RECOIL','∞ AMMO'];
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
    if(!local.has(i)) local.set(i,{f:0,s:0,turn:0,ads:false,fire:new Set(),fireUntil:0,reloadUntil:0,look:new Map(),stick:null,view:0,mouseFire:false,mouseAim:false,input:{f:0,s:0,turn:0,aim:false,fire:false,reload:false}});
    return local.get(i);
}
function active(){return state&&['COUNTDOWN','PLAYING','ROUND_END'].includes(state.state)&&!$('settings').open;}
function toast(s){$('toast').textContent=s;$('toast').style.display='block';clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').style.display='none',3500);}
function send(data,id){if(ws?.readyState===WebSocket.OPEN&&ws.bufferedAmount<65536)ws.send(JSON.stringify({...data,id:id||ids[0]}));}
function sound(hit=false){
    if(!audio||options.volume<=0)return;
    const o=audio.createOscillator(),g=audio.createGain(),t=audio.currentTime;
    o.type=hit?'sine':'sawtooth';o.frequency.setValueAtTime(hit?960:160,t);o.frequency.exponentialRampToValueAtTime(hit?600:45,t+.075);
    g.gain.setValueAtTime(options.volume*.11,t);g.gain.exponentialRampToValueAtTime(.001,t+.1);
    o.connect(g);g.connect(audio.destination);o.start();o.stop(t+.11);
}
function audioOn(){try{audio ||= new (window.AudioContext||window.webkitAudioContext)();audio.resume();}catch{}}
function resetInput(){
    keys.clear();
    for(const c of local.values()){
        c.f=c.s=c.turn=0;c.ads=c.mouseFire=c.mouseAim=false;c.fire.clear();c.fireUntil=c.reloadUntil=0;c.look.clear();c.stick=null;
        c.input={f:0,s:0,turn:0,aim:false,fire:false,reload:false};
    }
    document.querySelectorAll('.stick-knob').forEach(el=>el.style.transform='translate(0,0)');
    document.querySelectorAll('.pressed,.joystick.active').forEach(el=>el.classList.remove('pressed','active'));
    ids.forEach(id=>send({type:'input',f:0,s:0,turn:0,fire:false,aim:false,reload:false},id));
}
function showScreen(name){
    ['menu','lobby','playUI','result'].forEach(id=>$(id).classList.toggle('hidden',id!==name));
    document.body.classList.toggle('playing',name==='playUI');
    document.body.classList.toggle('split-play',name==='playUI'&&ids.length===2);
}
function syncMenu(){
    const ai=$('mode').value==='ai',split=$('split').checked;
    $('create').textContent=ai?'AI전 바로 시작 →':'로컬 대전 방 만들기 →';
    $('quickCustom').classList.toggle('hidden',!ai);
    $('skinSecond').classList.toggle('hidden',!split);
    $('joinRow').classList.toggle('hidden',ai);
    $('quickCheats').innerHTML=[0,...(split?[1]:[])].map(i=>`<span>P${i+1}</span>`+CHEATS.map((k,j)=>`<button data-loadout="${i}" data-cheat="${k}" class="${loadouts[i][k]?'on':''}">${LABELS[j]}</button>`).join('')).join('');
}
$('mode').onchange=$('split').onchange=syncMenu;
$('quickCheats').onclick=e=>{const b=e.target.closest('[data-loadout]');if(!b)return;loadouts[+b.dataset.loadout][b.dataset.cheat]=!loadouts[+b.dataset.loadout][b.dataset.cheat];syncMenu();};
syncMenu();
function connect(join=false){
    const old=ws;ws=null;old?.close();resetInput();closedByUser=false;audioOn();state=null;phase='';ids=[];seq=0;
    samples.clear();motion.clear();effects.clear();local.clear();controlIds='';lobbyStamp='';spriteCache.clear();
    showScreen('menu');$('create').disabled=$('join').disabled=true;toast('경기를 준비하는 중…');
    const socket=new WebSocket(`${location.protocol==='https:'?'wss':'ws'}://${location.host}/ws`);ws=socket;
    socket.onopen=()=>socket.send(JSON.stringify({mode:$('mode').value,code:join?$('code').value.trim():'',name:$('name').value,split:$('split').checked,quick:!join&&$('mode').value==='ai',skins:[$('skin0').value,$('skin1').value],cheats:loadouts}));
    socket.onmessage=e=>{
        if(ws!==socket)return;
        const d=JSON.parse(e.data);
        if(d.type==='welcome'){ids=d.ids;map=d.map;buildControls();toast(d.quick?'AI전 시작 · 화면 드래그 회전 / 탭 발사':`방 ${d.code} · 접속 완료`);}
        else if(d.type==='error')toast(d.message);
        else if(d.type==='pong'&&typeof d.sent==='number')rtt=mix(rtt,clamp(performance.now()-d.sent,0,600),.25);
        else if(d.type==='state')receive(d);
    };
    socket.onerror=()=>toast('서버 연결 실패. 잠시 후 다시 시작해 주세요.');
    socket.onclose=()=>{if(ws!==socket)return;resetInput();state=null;$('create').disabled=$('join').disabled=false;showScreen('menu');document.exitPointerLock?.();if(!closedByUser)toast('연결이 종료되었다. 다시 게임을 시작해 주세요.');};
}
$('create').onclick=()=>connect();
$('join').onclick=()=>{$('code').value.trim()?connect(true):toast('방 코드를 입력해 주세요.');};
function leave(){closedByUser=true;resetInput();const old=ws;ws=null;old?.close();state=null;document.exitPointerLock?.();$('settings').close();$('create').disabled=$('join').disabled=false;showScreen('menu');}
document.querySelectorAll('.leave').forEach(b=>b.onclick=leave);
$('exit').onclick=()=>{leave();toast('게임을 종료했다. 탭을 닫으면 된다.');};
function settings(){resetInput();document.exitPointerLock?.();['sensitivity','volume','quality'].forEach(k=>$(k).value=options[k]);$('settings').showModal();}
$('pause').onclick=$('settingsOpen').onclick=settings;
$('settingsClose').onclick=()=>{$('settings').close();};
$('settings').addEventListener('cancel',resetInput);
['sensitivity','volume','quality'].forEach(k=>$(k).oninput=()=>{options[k]=Number($(k).value);try{localStorage.setItem('cheat-fps-options',JSON.stringify(options));}catch{}});
$('start').onclick=()=>send({type:'start'});
$('again').onclick=()=>send({type:state?.quick?'rematch':'lobby'});
function toggles(p){return CHEATS.map((k,i)=>`<button class="${p.cheats[k]?'on':''}" data-toggle="${k}" data-id="${p.id}">${LABELS[i]}</button>`).join('');}
function lobby(d){
    $('roomCode').textContent=d.code;
    $('modeInfo').textContent='인간 3 vs 3 · 다른 기기에서 같은 주소와 방 코드로 참가한다.';
    const stamp=JSON.stringify(d.players.map(p=>[p.id,p.name,p.team,p.skin,p.ready,p.cheats]));
    $('start').disabled=!ids.includes(d.host);
    if(stamp===lobbyStamp)return;
    const editing=$('custom').contains(document.activeElement)&&['INPUT','SELECT'].includes(document.activeElement.tagName);
    $('roster').innerHTML=[0,1].map(t=>`<div class="card ${t?'red':'blue'}"><h3>${t?'RED':'BLUE'} / ${d.players.filter(p=>p.team===t).length} OF 3</h3>${d.players.filter(p=>p.team===t).map(p=>`<div class="member"><span>${esc(p.name)} ${p.id===d.host?'♛':''}</span><span>${p.ready?'준비 완료':'편성 중'}</span></div>`).join('')}</div>`).join('');
    if(editing)return;
    lobbyStamp=stamp;
    $('custom').innerHTML=ids.map((id,i)=>{const p=d.players.find(p=>p.id===id);if(!p)return '';return `<div class="card"><h3>PLAYER ${i+1}</h3><label>콜사인<input data-name="${id}" value="${esc(p.name)}" maxlength="16"></label><label>캐릭터<select data-skin="${id}">${['scout','warden','rogue'].map(s=>`<option ${p.skin===s?'selected':''}>${s}</option>`).join('')}</select></label><label>팀<select data-team="${id}" ${d.mode==='ai'?'disabled':''}><option value="0" ${p.team===0?'selected':''}>BLUE</option><option value="1" ${p.team===1?'selected':''}>RED</option></select></label><div class="toggles">${toggles(p)}</div><button data-ready="${id}" class="${p.ready?'on':''}">${p.ready?'준비 취소':'준비 완료'}</button></div>`;}).join('');
    $('controlsInfo').textContent='각 팀 3명, 모두 준비 완료한 뒤 방장이 경기 시작.';
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
    const respawn=oldRound!==d.round || (state?.state==='MATCH_END'&&d.state==='COUNTDOWN');
    state=d;snapshotAt=now;
    if(phase!==d.state){phase=d.state;resetInput();showScreen(phase==='LOBBY'?'lobby':phase==='MATCH_END'?'result':'playUI');if(phase==='LOBBY'){lobbyStamp='';document.exitPointerLock?.();}if(phase==='MATCH_END'){document.exitPointerLock?.();results(d);}}
    for(const p of d.players){
        const list=samples.get(p.id)||[];if(respawn)list.length=0;list.push({...p,time:now});if(list.length>12)list.shift();samples.set(p.id,list);
        const prev=effects.get(p.id);
        if(prev){if(p.shots>prev.shots){prev.shotAt=now;if(ids.includes(p.id))sound();}if(p.hit>prev.hit){prev.hitAt=now;if(ids.includes(p.id))sound(true);}if(p.hp<prev.hp)prev.hurtAt=now;}
        effects.set(p.id,{...prev,shots:p.shots,hit:p.hit,hp:p.hp});
        const slot=ids.indexOf(p.id);
        if(slot>=0){
            let m=motion.get(p.id);
            if(!m||respawn){m={x:p.x,y:p.y,yaw:p.yaw,vx:0,vy:0,kick:p.kick||0,stride:0,fov:1.12};motion.set(p.id,m);}
            if(p.hp===0){m.vx=m.vy=0;}
            // The camera uses local yaw. Aim-lock corrections are predicted too.
            if(p.cheats.aim&&control(slot).input.aim&&p.seq>=seq-1)m.yaw=p.yaw;
        }
    }
    if(d.state==='LOBBY')lobby(d);
    syncControls();
}
function protect(e){if(e.cancelable)e.preventDefault();e.stopPropagation();}
function capture(el,e){try{el.setPointerCapture(e.pointerId);}catch{}}
function buildControls(){
    if(controlIds===ids.join(':'))return;controlIds=ids.join(':');
    $('viewControls').innerHTML=ids.map((id,i)=>`<section class="viewport-controls" data-slot="${i}" style="left:${i*100/ids.length}%;width:${100/ids.length}%"><div class="look-surface" data-look="${i}"></div><div class="control-hint">P${i+1} · ${i?'↑↓←→ / J,L 회전 / Enter 발사':'WASD / Q,E 회전 / Space 발사'}<br>터치: 조이스틱 이동 · 탭 발사 · 드래그 회전</div><div class="joystick" data-stick="${i}" aria-label="P${i+1} 이동 조이스틱"><div class="stick-knob"></div></div><div class="actions"><button data-action="aim" data-slot="${i}">조준</button><button data-action="fire" class="fire-button" data-slot="${i}">발사</button><button data-action="reload" data-slot="${i}">장전</button></div><button data-action="spectate" data-slot="${i}" class="spectate-button hidden">관전 전환</button><div class="view-cheats">${CHEATS.map((key,j)=>`<button data-game-cheat="${key}" data-slot="${i}">${LABELS[j]}</button>`).join('')}</div></section>`).join('');
    document.querySelectorAll('[data-stick]').forEach(el=>{
        const c=control(+el.dataset.stick),knob=el.querySelector('.stick-knob');
        const move=e=>{if(c.stick!==e.pointerId)return;protect(e);const r=el.getBoundingClientRect(),radius=r.width*.38;let dx=(e.clientX-r.left-r.width/2)/radius,dy=(e.clientY-r.top-r.height/2)/radius;const len=Math.max(1,Math.hypot(dx,dy));dx/=len;dy/=len;c.s=Math.abs(dx)<.07?0:dx;c.f=Math.abs(dy)<.07?0:-dy;knob.style.transform=`translate(${dx*radius}px,${dy*radius}px)`;};
        el.onpointerdown=e=>{if(!active())return;protect(e);if(c.stick!==null)return;audioOn();c.stick=e.pointerId;capture(el,e);el.classList.add('active');move(e);};
        el.onpointermove=move;
        const end=e=>{if(c.stick!==e.pointerId)return;protect(e);c.stick=null;c.f=c.s=0;knob.style.transform='translate(0,0)';el.classList.remove('active');};
        el.onpointerup=el.onpointercancel=el.onlostpointercapture=end;
    });
    document.querySelectorAll('[data-look]').forEach(el=>{
        const i=+el.dataset.look,c=control(i);
        el.onpointerdown=e=>{
            if(!active())return;protect(e);audioOn();
            if(e.pointerType==='mouse'){
                mouseSlot=i;if(e.button===2)c.mouseAim=true;else c.mouseFire=true;
                if(!touchDevice&&canvas.requestPointerLock){try{const p=canvas.requestPointerLock();p?.catch(()=>{});}catch{}}
                return;
            }
            if(c.look.size)return;
            capture(el,e);c.look.set(e.pointerId,{x:e.clientX,y:e.clientY,startX:e.clientX,startY:e.clientY,time:performance.now(),drag:false});
        };
        el.onpointermove=e=>{
            const g=c.look.get(e.pointerId);if(!g||!active())return;protect(e);
            const distance=Math.hypot(e.clientX-g.startX,e.clientY-g.startY);
            if(distance>9)g.drag=true;
            if(g.drag){const dx=e.clientX-g.x;rotateLocal(i,dx*.004*options.sensitivity);}
            g.x=e.clientX;g.y=e.clientY;
        };
        const end=e=>{
            const g=c.look.get(e.pointerId);if(g){protect(e);c.look.delete(e.pointerId);if(e.type==='pointerup'&&!g.drag&&performance.now()-g.time<360&&active()){c.fireUntil=performance.now()+70;transmit();}}
            if(e.pointerType==='mouse'){c.mouseFire=c.mouseAim=false;}
        };
        el.onpointerup=el.onpointercancel=el.onlostpointercapture=end;
    });
    document.querySelectorAll('[data-action]').forEach(b=>{
        const i=+b.dataset.slot,c=control(i),action=b.dataset.action;
        b.onpointerdown=e=>{protect(e);if(!active())return;audioOn();capture(b,e);if(action==='fire'){c.fire.add(e.pointerId);b.classList.add('pressed');}if(action==='reload')c.reloadUntil=performance.now()+200;if(action==='aim')c.ads=!c.ads;if(action==='spectate')c.view++;};
        const end=e=>{protect(e);if(action==='fire'){c.fire.delete(e.pointerId);if(!c.fire.size)b.classList.remove('pressed');}};
        b.onpointerup=b.onpointercancel=b.onlostpointercapture=end;
    });
    document.querySelectorAll('[data-game-cheat]').forEach(b=>b.onpointerdown=e=>{protect(e);if(state)send({type:'toggle',key:b.dataset.gameCheat},ids[+b.dataset.slot]);});
}
function syncControls(){
    ids.forEach((id,i)=>{const p=state?.players.find(p=>p.id===id);if(!p)return;const panel=document.querySelector(`.viewport-controls[data-slot="${i}"]`);if(!panel)return;
        panel.querySelectorAll('[data-game-cheat]').forEach(b=>b.classList.toggle('on',p.cheats[b.dataset.gameCheat]));
        panel.querySelector('[data-action="spectate"]').classList.toggle('hidden',p.hp>0);
        panel.querySelector('[data-action="aim"]').classList.toggle('on',control(i).ads);
    });
}
['contextmenu','selectstart','dragstart','gesturestart'].forEach(name=>document.addEventListener(name,e=>{if(e.target===canvas||e.target.closest?.('#playUI')){if(e.cancelable)e.preventDefault();}}, {passive:false}));
window.addEventListener('keydown',e=>{
    if(['INPUT','SELECT','TEXTAREA'].includes(e.target.tagName))return;
    if(e.code==='Escape'){if(active())settings();return;}if($('settings').open)return;
    if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code)&&state)e.preventDefault();keys.add(e.code);
    if(!e.repeat){const one=['Digit1','Digit2','Digit3','Digit4'].indexOf(e.code),two=['Digit7','Digit8','Digit9','Digit0'].indexOf(e.code);if(one>=0)send({type:'toggle',key:CHEATS[one]});if(two>=0&&ids[1])send({type:'toggle',key:CHEATS[two]},ids[1]);if(e.code==='KeyV')ids.forEach((_,i)=>control(i).view++);}
});
window.addEventListener('keyup',e=>keys.delete(e.code));
window.addEventListener('blur',resetInput);
document.addEventListener('visibilitychange',()=>{if(document.hidden)resetInput();});
window.addEventListener('pointerup',e=>{if(e.pointerType==='mouse')for(const c of local.values())c.mouseFire=c.mouseAim=false;});
document.addEventListener('pointerlockchange',()=>{if(!document.pointerLockElement){for(const c of local.values())c.mouseFire=c.mouseAim=false;}});
document.addEventListener('mousemove',e=>{if(document.pointerLockElement===canvas&&active())rotateLocal(mouseSlot,e.movementX*.0025*options.sensitivity);});
function rotateLocal(i,delta){const m=motion.get(ids[i]);if(m&&active())m.yaw=wrap(m.yaw+delta);}
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
    if(pad&&has){const dz=v=>Math.abs(v||0)>.16?v:0;f-=dz(pad.axes[1]);s+=dz(pad.axes[0]);turn+=dz(pad.axes[2]);fire ||=pad.buttons[7]?.pressed;aim ||=pad.buttons[6]?.pressed;reload ||=pad.buttons[0]?.pressed;[12,13,14,15].forEach((b,j)=>{const k=`${i}:${b}`,pressed=!!pad.buttons[b]?.pressed;if(pressed&&!padEdges.get(k))send({type:'toggle',key:CHEATS[j]},ids[i]);padEdges.set(k,pressed);});}
    if(!has||p?.hp<=0){f=s=turn=0;fire=aim=reload=false;}
    const len=Math.max(1,Math.hypot(f,s));return c.input={f:f/len,s:s/len,turn:clamp(turn,-1,1),fire:!!fire,aim:!!aim,reload:!!reload};
}
function transmit(){
    if(!state||!ids.length)return;const now=performance.now();seq++;
    ids.forEach((id,i)=>{const input=inputs(i,now),m=motion.get(id);send({type:'input',...input,turn:0,yaw:m?.yaw,seq},id);});
    if(now-pingAt>1500){pingAt=now;send({type:'ping',sent:now});}
}
setInterval(transmit,1000/30);
function wall(x,y){return !map[Math.floor(y)]||map[Math.floor(y)][Math.floor(x)]!=='0';}
function moveClient(p,dx,dy){
    for(const [axis,delta] of [['x',dx],['y',dy]]){const x=p.x+(axis==='x'?delta:0),y=p.y+(axis==='y'?delta:0);if([-.22,.22].every(a=>[-.22,.22].every(b=>!wall(x+a,y+b))))p[axis]+=delta;else p[axis==='x'?'vx':'vy']=0;}
}
function ray(x,y,a){
    const dx=Math.cos(a),dy=Math.sin(a);let mx=Math.floor(x),my=Math.floor(y),side=0;
    const ddx=Math.abs(1/(dx||1e-9)),ddy=Math.abs(1/(dy||1e-9)),sx=dx<0?-1:1,sy=dy<0?-1:1;
    let tx=(dx<0?x-mx:mx+1-x)*ddx,ty=(dy<0?y-my:my+1-y)*ddy;
    for(let i=0;i<80;i++){if(tx<ty){tx+=ddx;mx+=sx;side=0;}else{ty+=ddy;my+=sy;side=1;}if(wall(mx+.5,my+.5))break;}
    return {d:Math.max(.03,side?ty-ddy:tx-ddx),side,mx,my,frac:side?(x+dx*(ty-ddy))%1:(y+dy*(tx-ddx))%1};
}
function visible(p,q){const d=Math.hypot(q.x-p.x,q.y-p.y);return ray(p.x,p.y,Math.atan2(q.y-p.y,q.x-p.x)).d>=d-.3;}
function predict(dt,now){
    ids.forEach((id,i)=>{
        const p=state.players.find(p=>p.id===id),m=motion.get(id);if(!p||!m)return;const input=inputs(i,now);m.yaw=wrap(m.yaw+input.turn*3.2*dt);
        const speed=input.aim?2.6:3.6,blend=1-Math.exp(-22*dt),tx=(Math.cos(m.yaw)*input.f-Math.sin(m.yaw)*input.s)*speed,ty=(Math.sin(m.yaw)*input.f+Math.cos(m.yaw)*input.s)*speed;
        m.vx=mix(m.vx,tx,blend);m.vy=mix(m.vy,ty,blend);
        const ox=m.x,oy=m.y;if(state.state==='PLAYING'&&p.hp>0)moveClient(m,m.vx*dt,m.vy*dt);
        m.stride+=Math.hypot(m.x-ox,m.y-oy)*4.5;
        // Extrapolate the latest authoritative sample, then gently reconcile.
        const age=clamp((now-snapshotAt+rtt*.45)/1000,0,.12);
        const target={x:p.x,y:p.y,vx:p.vx||0,vy:p.vy||0};moveClient(target,target.vx*age,target.vy*age);
        const dx=target.x-m.x,dy=target.y-m.y;
        if(Math.hypot(dx,dy)>1.5){m.x=p.x;m.y=p.y;}else moveClient(m,dx*(1-Math.exp(-9*dt)),dy*(1-Math.exp(-9*dt)));
        if(p.cheats.aim&&input.aim&&p.hp>0){const me={...p,...m},targets=state.players.filter(q=>q.hp>0&&q.team!==p.team&&Math.abs(wrap(Math.atan2(q.y-m.y,q.x-m.x)-m.yaw))<.65&&visible(me,q));targets.sort((a,b)=>Math.abs(wrap(Math.atan2(a.y-m.y,a.x-m.x)-m.yaw))-Math.abs(wrap(Math.atan2(b.y-m.y,b.x-m.x)-m.yaw)));if(targets.length)m.yaw=Math.atan2(targets[0].y-m.y,targets[0].x-m.x);}
        m.kick=mix(m.kick,p.kick||0,1-Math.exp(-20*dt));m.fov=mix(m.fov,input.aim?.88:1.12,1-Math.exp(-12*dt));
    });
}
function interpolated(now){
    return state.players.map(p=>{
        const own=motion.get(p.id);if(ids.includes(p.id)&&p.hp>0&&own)return {...p,...own};
        const list=samples.get(p.id)||[],time=now-75;let a=list[0],b=list[list.length-1];if(!a)return p;
        for(let j=1;j<list.length;j++){if(list[j].time>=time){a=list[j-1];b=list[j];break;}a=list[j];}
        const t=a===b?1:clamp((time-a.time)/(b.time-a.time),0,1),yaw=wrap(a.yaw+wrap(b.yaw-a.yaw)*t);
        return {...p,x:mix(a.x,b.x,t),y:mix(a.y,b.y,t),yaw,vx:mix(a.vx||0,b.vx||0,t),vy:mix(a.vy||0,b.vy||0,t)};
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
        line(w/2+a.u*proj/a.z,horizon+proj*.5/a.z,w/2+b.u*proj/b.z,horizon+proj*.5/b.z,'#99aaa11c');
    };
    ctx.save();ctx.beginPath();ctx.rect(0,horizon,w,h-horizon);ctx.clip();
    for(let x=1;x<20;x+=1)grid(x,1,x,11);for(let y=1;y<12;y+=1)grid(1,y,19,y);
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
    wallCache.set(key,image);return image;
}
function walls(p,w,h,horizon,proj,fov){
    const columns=Math.ceil(w/options.quality),width=w/columns,depths=new Float32Array(columns);
    const co=Math.cos(p.yaw),si=Math.sin(p.yaw),lens=Math.tan(fov/2);
    for(let i=0;i<columns;i++){
        const camera=(2*(i+.5)/columns-1)*lens,angle=p.yaw+Math.atan(camera),hit=ray(p.x,p.y,angle);
        const z=hit.d/Math.sqrt(1+camera*camera),height=proj/z,top=horizon-height*.5,x=i*width;
        depths[i]=z;
        const pillar=hit.mx>1&&hit.mx<18&&hit.my>1&&hit.my<10;
        const brightness=clamp(70-z*2.5-(hit.side?9:0),18,70),shade=pillar?brightness-3:brightness;
        const texture=wallMaterial(pillar,shade),dy=Math.max(0,top),bottom=Math.min(h,top+height),dh=bottom-dy;
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
        const hh=size*.94,ww=hh*128/192,left=x-ww/2,top=horizon+size*.5-hh;
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
            ctx.fillStyle='#03151366';ctx.beginPath();ctx.ellipse(x,horizon+size*.45,ww*.47,Math.max(2,hh*.045),0,0,Math.PI*2);ctx.fill();
            const facing=wrap(q.yaw-Math.atan2(p.y-q.y,p.x-q.x)),direction=(Math.round(facing/(Math.PI/4))+8)%8;
            const speed=Math.hypot(q.vx||0,q.vy||0),step=speed>.25?Math.floor(now/68+q.x*.4+q.y*.3)%8:0;
            ctx.globalAlpha=clamp(1-z/60,.6,1);ctx.drawImage(humanSprite(q.team,q.skin,direction,step),left,top,ww,hh);ctx.globalAlpha=1;
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
function rifle(p,m,w,h,now){
    const fx=effects.get(p.id)||{},shot=now-(fx.shotAt||0),flash=shot>=0&&shot<55;
    const moving=Math.min(1,Math.hypot(m?.vx||0,m?.vy||0)/3.6),stride=m?.stride||0;
    const ads=m?.fov<1,scale=Math.min(w*.72,h*.72)/330;
    const bobX=Math.sin(stride)*moving*4,bobY=Math.abs(Math.cos(stride))*moving*4;
    const kick=p.cheats.recoil?0:Math.max(0,1-shot/115)*8;
    ctx.save();ctx.translate(w*(ads?.50:.61)+bobX,h+18+bobY+kick);ctx.scale(scale,scale);
    if(p.reload>0){ctx.translate(45,Math.sin(p.reload/1.5*Math.PI)*85);ctx.rotate(Math.sin(p.reload/1.5*Math.PI)*.3);}
    ctx.drawImage(rifleModel(p.team),-180,-335,360,360);
    if(flash){
        const glow=ctx.createRadialGradient(0,-278,1,0,-278,55);glow.addColorStop(0,'#fffbe8');glow.addColorStop(.3,'#ffc673d0');glow.addColorStop(1,'#ffac4300');ctx.fillStyle=glow;ctx.fillRect(-60,-338,120,120);
        ctx.beginPath();[[-4,-278],[-19,-303],[-7,-299],[0,-323],[8,-300],[25,-298],[6,-276]].forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fillStyle='#fff1b7';ctx.fill();
    }
    ctx.restore();
}
function radar(p,roster,x,y,size){
    rounded(x,y,size,size,5,'#071c23a3');const scale=(size-14)/20;
    for(let yy=0;yy<map.length;yy++)for(let xx=0;xx<map[yy].length;xx++)if(map[yy][xx]==='1'){ctx.fillStyle='#839a9660';ctx.fillRect(x+7+xx*scale,y+7+yy*scale,scale,scale);}
    for(const q of roster){if(q.hp<=0||q.team!==p.team&&!p.cheats.esp)continue;ctx.fillStyle=q.id===p.id?'#d5ff68':q.team===p.team?'#72d5ed':'#ff8573';ctx.beginPath();ctx.arc(x+7+q.x*scale,y+7+q.y*scale,q.id===p.id?3:2.2,0,Math.PI*2);ctx.fill();}
    line(x+7+p.x*scale,y+7+p.y*scale,x+7+(p.x+Math.cos(p.yaw)*1.5)*scale,y+7+(p.y+Math.sin(p.yaw)*1.5)*scale,'#d5ff68',1.5);
}
function hud(p,owner,roster,w,h,index,horizon,now){
    const compact=w<560,alive=[0,1].map(t=>state.players.filter(q=>q.hp>0&&q.team===t).length),font=compact?Math.min(15,w/18):19;
    const scoreWidth=Math.min(w-14,compact?270:334);
    rounded(w/2-scoreWidth/2,12,scoreWidth,54,7,'#07171fbc');
    textAt(`BLUE ${alive[0]}   ${state.score[0]} : ${state.score[1]}   ${alive[1]} RED`,w/2,34,font,'#e0efea','center');
    textAt(`ROUND ${state.round}/5 · ${Math.ceil(state.timer)}s`,w/2,54,11,'#d0f773','center');
    textAt(`P${index+1} / ${owner.name}${owner.hp<=0?' · 관전':''}`,14,compact?83:88,11,owner.team?'#ffab97':'#a2dcec');
    // Health and ammunition sit above the touch controls, per viewport.
    const touch=touchDevice||ids.length===2,baseline=touch?h-(h<530?208:252):h-66;
    const cardWidth=Math.min(compact?112:138,w*.43),hudFont=w<300?15:19;
    rounded(12,baseline,cardWidth,49,5,'#07191fc9');
    textAt(`HP ${owner.hp}`,23,baseline+22,hudFont,owner.hp<30?'#ff8c76':'#e9f1e9');
    ctx.fillStyle='#314643';ctx.fillRect(23,baseline+31,cardWidth-23,5);ctx.fillStyle=owner.hp<30?'#ef735e':'#c6ff47';ctx.fillRect(23,baseline+31,(cardWidth-23)*owner.hp/100,5);
    const ammo=p.cheats.ammo?'∞':String(p.ammo).padStart(2,'0');rounded(w-cardWidth-12,baseline,cardWidth,49,5,'#07191fc9');
    textAt(p.reload>0&&!p.cheats.ammo?'RELOADING':`${ammo} / 30`,w-24,baseline+22,p.reload>0?Math.min(13,hudFont):hudFont,'#e9f1e9','right');textAt('CHEAT AR · 5.56',w-24,baseline+39,w<300?7:9,'#8ca9a5','right');
    const gap=6+Math.min(12,p.kick*75),cross=owner.hp>0?'#d9ff75':'#c6dcd5';
    line(w/2-gap-8,horizon,w/2-gap,horizon,cross,1.5);line(w/2+gap,horizon,w/2+gap+8,horizon,cross,1.5);line(w/2,horizon-gap-8,w/2,horizon-gap,cross,1.5);line(w/2,horizon+gap,w/2,horizon+gap+8,cross,1.5);ctx.fillStyle=cross;ctx.fillRect(w/2-1,horizon-1,2,2);
    if(now-(effects.get(p.id)?.hitAt||0)<180){for(const sign of [-1,1]){line(w/2+sign*8,horizon+8,w/2+sign*14,horizon+14,'#fff5d1',2);line(w/2+sign*8,horizon-8,w/2+sign*14,horizon-14,'#fff5d1',2);}}
    if(p.cheats.esp&&w>350){radar(p,roster,14,compact?112:127,compact?85:106);textAt('ESP / LIVE',18,compact?107:121,9,'#d4f77e');}
    if(!compact){state.log.slice(-4).forEach((e,j)=>{textAt(`${e.killer}  ›  ${e.victim}`,w-14,88+j*18,10,e.team?'#ffac9b':'#96dbe8','right');});}
    if(owner.hp<=0){rounded(w/2-115,76,230,48,5,'#07191fd4');textAt('KNOCKED OUT',w/2,96,15,'#ff9a84','center');textAt(p.id!==owner.id?`관전: ${p.name}`:'남은 아군 없음',w/2,113,10,'#afc3bd','center');}
    if(state.state==='COUNTDOWN'||state.state==='ROUND_END'){
        rounded(w/2-Math.min(210,w*.42),h*.33-37,Math.min(420,w*.84),95,8,'#061921bb');
        textAt(state.state==='COUNTDOWN'?`ROUND ${state.round} · ${Math.ceil(state.timer)}`:state.message,w/2,h*.33,compact?20:27,'#edffe3','center');
        textAt(state.state==='COUNTDOWN'?'준비 · 치트 토글을 선택하세요':'다음 라운드를 준비하는 중',w/2,h*.33+26,11,'#adc5b9','center');
    }
    const hurt=now-(effects.get(owner.id)?.hurtAt||0);if(hurt>=0&&hurt<300){ctx.strokeStyle=`rgba(242,79,62,${(1-hurt/300)*.6})`;ctx.lineWidth=14;ctx.strokeRect(3,3,w-6,h-6);}
}
function view(index,roster,w,h,now){
    const owner=roster.find(p=>p.id===ids[index]);if(!owner)return;
    let p=owner;const c=control(index);
    if(owner.hp<=0){const alive=roster.filter(q=>q.team===owner.team&&q.hp>0);if(alive.length)p=alive[c.view%alive.length];}
    const m=motion.get(p.id),fov=p.id===owner.id&&m?m.fov:1.12;
    const horizon=h*.48+(owner.hp>0?Math.sin((m?.stride||0)*2)*Math.min(1,Math.hypot(m?.vx||0,m?.vy||0)/3.6)*1.2:0),proj=w/(2*Math.tan(fov/2));
    ground(p,w,h,horizon,proj);const depth=walls(p,w,h,horizon,proj,fov);
    characters(p,roster,w,h,horizon,proj,depth,now);
    if(p.hp>0)rifle(p,m,w,h,now);hud(p,owner,roster,w,h,index,horizon,now);
}
function resize(){
    // CSS coordinates stay identical for rendering and pointer hit testing.
    const ratio=Math.min(devicePixelRatio||1,1,1440/Math.max(innerWidth,innerHeight));
    const width=Math.max(1,Math.round(innerWidth*ratio)),height=Math.max(1,Math.round(innerHeight*ratio));
    if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;}
    ctx.setTransform(width/innerWidth,0,0,height/innerHeight,0,0);
}
window.addEventListener('resize',resize);resize();
function frame(now){
    const dt=Math.min(.05,(now-lastFrame)/1000);frameMs=mix(frameMs,now-lastFrame,.05);lastFrame=now;
    if(state&&map.length&&['COUNTDOWN','PLAYING','ROUND_END'].includes(state.state)){
        predict(dt,now);const roster=interpolated(now),w=innerWidth/ids.length,h=innerHeight;
        for(let i=0;i<ids.length;i++){ctx.save();ctx.translate(i*w,0);ctx.beginPath();ctx.rect(0,0,w,h);ctx.clip();view(i,roster,w,h,now);ctx.restore();}
        if(ids.length===2){line(innerWidth/2,0,innerWidth/2,h,'#07191f',3);}
    }else{ctx.fillStyle='#0a1013';ctx.fillRect(0,0,innerWidth,innerHeight);}
    requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
