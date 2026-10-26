/* One construction/detail standard for all five arenas. Original local assets. */
import * as THREE from 'three';
import {Builder,mergeStatic} from './graphics.js';

import {ART,ART_REVISION} from './art-palettes.js';
export {ART,ART_REVISION};

function facade(b,p,x,z,w,d,h,side,index){
 const front=side===0?z+d/2:side===1?z-d/2:z;
 b.box(x,h/2,z,w,h,d,p.kind,p.wall);
 b.box(x,.38,z,w+.08,.76,d+.08,'concrete',p.trim);
 b.box(x,h-.14,z,w+.26,.3,d+.26,'stone',p.trim);
 b.box(x,h+.12,z,w+.10,.22,d+.10,'metal',p.roof);
 const faces=side<2?[{axis:'z',face:front,out:side===0?1:-1,length:w,center:x}]:[{axis:'x',face:side===2?x+w/2:x-w/2,out:side===2?1:-1,length:d,center:z}];
 for(const f of faces){
  const panel=(u,y,ww,hh,depth,kind,c,offset=0)=>f.axis==='z'?b.box(u,y,f.face+f.out*offset,ww,hh,depth,kind,c):b.box(f.face+f.out*offset,y,u,depth,hh,ww,kind,c);
  for(let y=2.25;y<h-1;y+=2.65){
   if(p.urban)panel(f.center,y-1.08,f.length+.04,.12,.14,'stone',p.trim,.05);
   for(let u=f.center-f.length/2+1.35;u<f.center+f.length/2-.8;u+=2.2){
    panel(u,y,1.30,1.67,.09,'stone',p.trim,.04);
    panel(u,y+.025,1.06,1.42,.035,'glass',p.glass,.098);
    panel(u,y,.055,1.42,.04,'metal',p.trim,.13);
    panel(u,y+.08,1.06,.05,.04,'metal',p.trim,.13);
    panel(u,y-.85,1.48,.10,.28,'stone',p.trim,.12);
    if(p.urban)panel(u,y+.93,1.44,.10,.22,'stone',p.trim,.10);
   }
  }
  panel(f.center,.95,1.28,1.9,.08,'metal',p.trim,.08);
  panel(f.center-.42,1.05,.05,.24,.06,'metal','#b8b4a0',.14);
  for(const u of [f.center-f.length/2+.18,f.center+f.length/2-.18]){
   panel(u,h/2,.18,h,.19,p.urban?'stone':'metal',p.trim,.10);
   if(p.urban)for(let y=.9;y<h-.3;y+=.46)panel(u,y,.25,.025,.22,'stone',p.wall,.13);
  }
  const pipe=f.center+f.length/2-.5;
  panel(pipe,h/2,.07,h,.09,'metal',p.roof,.18);
  for(let y=1;y<h;y+=2)panel(pipe,y,.18,.08,.13,'metal',p.trim,.20);
 }
 // Roof vents and parapets remain outside the playable collision grid.
 b.box(x,h+.35,z-d/2,w,.65,.16,'metal',p.roof);
 b.box(x,h+.35,z+d/2,w,.65,.16,'metal',p.roof);
 b.box(x-w/2,h+.35,z,.16,.65,d,'metal',p.roof);
 b.box(x+w/2,h+.35,z,.16,.65,d,'metal',p.roof);
 b.box(x-w*.22,h+.5,z,1.3,.8,1.1,'metal',p.trim);
 for(let i=0;i<5;i++)b.box(x-w*.22,h+.28+i*.11,z-.57,1.15,.025,.04,'metal',p.wall);
 b.tube(x+w*.25,h+1.05,z,.20,2.0,'metal',p.trim);
 if(p.urban){
  for(const zz of [z-d*.25,z+d*.25])b.box(x,h+.63,zz,w*.8,.17,.34,'stone',p.trim);
 }else{
  for(let xx=x-w/2+.4;xx<x+w/2;xx+=.65)b.box(xx,h+.27,z,.06,.08,d,'metal',p.trim);
 }
}

export function dressArenas(root,map,theme,surfaces){
 const id=theme.id,p=ART[id]||ART.railway,g=new THREE.Group();g.name='cohesive-world-details';root.add(g);
 const b=new Builder(g,surfaces),covers=root.userData.coverFootprints||[];let coverParts=0;
 for(const r of covers){
  const before=b.count,cargo=id==='freight'||id==='railway',trim=cargo?'#596c69':p.trim;
  // Feet, recessed panels and joints fit the existing 2.6 m solid volumes.
  if(cargo){
   for(const z of [r.y+.015,r.y+r.d-.015]){
    for(let x=r.x+.22;x<r.x+r.w-.12;x+=.32)b.box(x,1.31,z,.045,2.34,.045,'paint',trim);
    b.box(r.x+r.w/2,2.45,z,r.w-.14,.075,.075,'metal',trim);
    b.box(r.x+r.w/2,.19,z,r.w-.14,.075,.075,'metal',trim);
   }
   for(const x of [r.x+.015,r.x+r.w-.015])for(let z=r.y+.22;z<r.y+r.d-.12;z+=.32)b.box(x,1.31,z,.045,2.34,.045,'paint',trim);
   for(const x of [r.x+.13,r.x+r.w-.13])for(const z of [r.y+.13,r.y+r.d-.13]){
    b.box(x,2.52,z,.23,.16,.23,'metal','#51645e');
    b.box(x,.15,z,.23,.16,.23,'metal','#51645e');
   }
   // Both end doors have locking bars and hinge blocks.
   for(const x of [r.x+.05,r.x+r.w-.05])for(const z of [r.y+r.d*.27,r.y+r.d*.73]){
    b.tube(x,1.3,z,.025,2.12,'metal','#9ba99d');
    for(const y of [.45,1.25,2.15])b.box(x,y,z,.09,.08,.13,'metal','#788a80');
   }
  }else{
   for(const x of [r.x+.13,r.x+r.w-.13])for(const z of [r.y+.13,r.y+r.d-.13])b.box(x,1.3,z,.25,2.46,.25,id==='foundry'?'metal':'stone',trim);
   for(const z of [r.y+.025,r.y+r.d-.025]){
    b.box(r.x+r.w/2,1.3,z,Math.max(.25,r.w-.55),1.7,.07,id==='foundry'?'metal':'stone',id==='foundry'?'#64726b':p.wall);
    b.box(r.x+r.w/2,.43,z,Math.max(.25,r.w-.4),.10,.14,'stone',trim);
    b.box(r.x+r.w/2,2.18,z,Math.max(.25,r.w-.4),.10,.14,'stone',trim);
    if(id==='foundry')for(let x=r.x+.45;x<r.x+r.w-.2;x+=.55){b.box(x,2.2,z,.13,.07,.09,'metal','#d0ad65');b.box(x,.44,z,.13,.07,.09,'metal','#d0ad65');}
   }
   for(const y of [.2,2.5])b.box(r.x+r.w/2,y,r.y+r.d/2,r.w-.03,.12,r.d-.03,id==='foundry'?'metal':'stone',trim);
  }
  coverParts+=b.count-before;
 }
 // Eight finished facades on every map, using one window/trim/roof standard.
 // Harbor keeps its northern sea vista; railway keeps the end gates open.
 let facades=0;
 const sites=id==='freight'?[[8,43,1],[25,44,1],[43,43,1],[58,44,1],[-9,5,2],[-9,27,2],[69,5,3],[69,28,3]]:
  [[7,-9,0],[25,-10,0],[45,-9,0],[8,44,1],[28,45,1],[49,44,1],[-9,7,2],[69,28,3]];
 sites.forEach(([x,z,side],i)=>{const w=side<2?12:8,d=side<2?8:11,h=(p.urban?10:7)+(i%3)*2.65;facade(b,p,x,z,w,d,h,side,i);facades++;});
 // Close to the arena, details stay inside solid perimeter walls.
 for(let x=6;x<57;x+=10)for(const z of [.8,34.2]){
  b.box(x,.34,z,1.5,.6,.22,'metal',p.trim);
  for(let k=0;k<4;k++)b.box(x,.2+k*.1,z-.13,1.25,.025,.04,'metal',p.wall);
 }
 b.finish();
 root.userData.detailParts=(root.userData.detailParts||0)+g.userData.detailParts;
 root.userData.artDirection={revision:ART_REVISION,facades,covers:covers.length,coverParts,facadeStandard:'framed-glazing-roof-drainage',detailParts:g.userData.detailParts};
 return g;
}

export function finishLandmark(root,id,surfaces){
 if(!root)return;
 const g=new THREE.Group();g.name='landmark-finish';root.add(g);const p=ART[id],b=new Builder(g,surfaces);
 if(id==='glory'){
  for(const z of [9.56,14.44]){
   for(const y of [.35,1.31,1.59])b.box(20,y,z,3.72,.07,.09,'stone','#d8cdb4');
   b.box(20,.89,z,2.85,.48,.07,'stone','#938c76');
   for(let x=18.75;x<21.3;x+=.36)b.box(x,.89,z,.045,.35,.10,'metal','#b9b9a1');
  }
  for(const x of [18.28,21.72])for(const z of [9.94,14.06]){
   b.box(x,.9,z,.22,1.05,.22,'stone','#d3c9ae');
   b.box(x,.38,z,.31,.14,.31,'stone','#9c967e');
  }
  // A modest cyan inlay relates the monument to its shield ring.
  for(const z of [9.61,14.39])b.box(20,1.4,z,3.3,.035,.025,'glow','#70d7e2');
 }else if(id==='freight'||id==='foundry'){
  for(const x of [18.5,21.5])for(const z of [10,14]){
   b.box(x,.1,z,.55,.2,.5,'metal',p.trim);
   for(const xx of [-.16,.16])for(const zz of [-.14,.14])b.tube(x+xx,.22,z+zz,.035,.055,'metal','#a7ad98');
  }
 }else if(id==='plaza'){
  for(const x of [18.17,21.83])for(const z of [9.85,14.15]){
   b.box(x,.15,z,.3,.3,.3,'stone','#c5b998');
   for(let y=.4;y<2.4;y+=.26)b.box(x,y,z,.12,.018,.12,'stone','#8e8770');
  }
 }
 b.finish();root.userData.finishRevision=ART_REVISION;
}
