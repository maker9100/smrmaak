/* Original synthesized positional game audio. No remote recordings or downloads. */
(()=>{
 class CheatSound{
  constructor(){this.context=null;this.volume=.25;this.listeners=[];this.buffers=new Map();this.voices=0;this.steps=new Map();this.ambientAt=0;}
  unlock(){try{this.context ||= new (window.AudioContext||window.webkitAudioContext)();this.context.resume().catch(()=>{});}catch{}return this.context;}
  setListeners(list){this.listeners=list;}
  buffer(type,key){
   const c=this.context,id=type+':'+key;if(this.buffers.has(id))return this.buffers.get(id);
   const duration=type==='explosion'?.9:type==='reload'?.5:type==='ambient'?.6:type==='shot'?(key==='shotgun'?.65:key==='pistol'?.36:.43):.15;
   const b=c.createBuffer(1,Math.ceil(c.sampleRate*duration),c.sampleRate),d=b.getChannelData(0);let low=0;
   for(let i=0;i<d.length;i++){
    const t=i/c.sampleRate,n=Math.random()*2-1;low=low*.92+n*.08;
    if(type==='hit')d[i]=Math.sin(t*2*Math.PI*880)*Math.exp(-t*35)*.5;
    else if(type==='axe')d[i]=n*Math.sin(Math.min(1,t/.15)*Math.PI)*.4;
    else if(type==='switch'||type==='grenade')d[i]=n*Math.exp(-t*65);
    else if(type==='reload')d[i]=n*(Math.exp(-t*70)+Math.exp(-Math.abs(t-.19)*100)*.7+Math.exp(-Math.abs(t-.39)*100)*.5);
    else if(type==='step')d[i]=low*Math.exp(-t*24)*2;
    else if(type==='hurt')d[i]=low*Math.exp(-t*14);
    else if(type==='ambient')d[i]=key==='freight'?low*.3:low*.4+Math.sin(t*2*Math.PI*52)*.08;
    else if(type==='explosion')d[i]=(low*2+Math.sin(t*2*Math.PI*(62-t*32))*.3)*Math.exp(-t*4.5);
    else{const weight=key==='shotgun'?1:key==='pistol'?.55:.75,crack=(n-low)*Math.exp(-t/(key==='pistol'?.004:.006)),body=low*5*weight*Math.exp(-t/(key==='shotgun'?.105:.055)),bolt=n*.16*Math.exp(-Math.abs(t-.038)*230),echo=low*weight*.55*Math.exp(-Math.abs(t-.095)*24);d[i]=Math.tanh((crack*.9+body+bolt+echo)*1.4)*Math.min(1,t/.0003);}
   }
   this.buffers.set(id,b);return b;
  }
  play(type,key='rifle',source=null){
   const c=this.context;if(!c||c.state!=='running'||this.volume<=0||this.voices>=28)return;
   let gain=1,pan=0;
   if(source&&this.listeners.length){const listener=this.listeners.reduce((a,b)=>Math.hypot(a.x-source.x,a.y-source.y)<Math.hypot(b.x-source.x,b.y-source.y)?a:b);
    const distance=Math.hypot(source.x-listener.x,source.y-listener.y);gain=Math.max(0,1-distance/(type==='explosion'?65:45));if(gain<.015)return;
    pan=Math.sin(Math.atan2(source.y-listener.y,source.x-listener.x)-(listener.yaw||0))*.8;
   }
   const b=this.buffer(type,key),s=c.createBufferSource(),g=c.createGain(),f=c.createBiquadFilter(),p=c.createStereoPanner(),t=c.currentTime;
   s.buffer=b;f.type='lowpass';f.frequency.value=type==='shot'?(key==='pistol'?7200:key==='shotgun'?4400:6200):type==='step'?650:type==='ambient'?400:1800;p.pan.value=pan;
   const scale=type==='explosion'?.8:type==='shot'?.48:type==='ambient'?.1:type==='step'?.5:.18;
   g.gain.setValueAtTime(Math.max(.0001,gain*this.volume*scale),t);g.gain.exponentialRampToValueAtTime(.0001,t+b.duration);
   s.connect(f);f.connect(g);g.connect(p);p.connect(c.destination);this.voices++;s.onended=()=>{this.voices--;s.disconnect();f.disconnect();g.disconnect();p.disconnect();};s.start();
  }
  world(players,map,train,now){
   for(const p of players)if(p.hp>0&&Math.hypot(p.vx||0,p.vy||0)>1&&now>(this.steps.get(p.id)||0)){
    this.play('step','',p);this.steps.set(p.id,now+330*8/Math.max(4,Math.hypot(p.vx,p.vy)));
   }
   for(const id of this.steps.keys())if(!players.some(p=>p.id===id))this.steps.delete(id);
   if(now>this.ambientAt&&['foundry','freight','railway'].includes(map)){this.play('ambient',map,train?.active?train:null);this.ambientAt=now+550;}
  }
 }
 window.CheatSound=CheatSound;
})();
