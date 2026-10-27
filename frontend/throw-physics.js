/* Same swept collision and gravity as backend/projectiles.py; preview only. */
const freeCache=new Map();
export function canStand(x,y,grid,boxes){
 for(const a of [-.46,.46])for(const b of [-.46,.46])if(x+a<0||y+b<0||y+b>=grid.length||x+a>=grid[0].length||grid[Math.floor(y+b)][Math.floor(x+a)]!=='0')return false;
 return !boxes.some(b=>['crane','train'].includes(b.kind)&&b.bounds[2]<1.9&&b.bounds[0]-.46<x&&x<b.bounds[3]+.46&&b.bounds[1]-.46<y&&y<b.bounds[4]+.46);
}
export function safeFloor(x,y,grid,boxes){
 if(canStand(x,y,grid,boxes))return [x,y];
 const key=grid.join('');let points=freeCache.get(key);
 if(!points){points=[];grid.forEach((row,y)=>{for(let x=0;x<row.length;x++)if(row[x]==='0')points.push([x+.5,y+.5]);});freeCache.set(key,points);if(freeCache.size>8)freeCache.delete(freeCache.keys().next().value);}
 let best=[x,y],dist=Infinity;for(const p of points){const d=(p[0]-x)**2+(p[1]-y)**2;if(d<dist&&canStand(...p,grid,boxes)){best=p;dist=d;}}return best.slice();
}
export function sweep(start,end,boxes,radius){
 let best=null;const delta=end.map((v,i)=>v-start[i]);
 if(end[2]<=radius&&delta[2]<0){const t=Math.max(0,Math.min(1,(radius-start[2])/delta[2]));best={t,normal:[0,0,1],point:start.map((v,i)=>v+delta[i]*t),kind:'floor'};}
 for(const box of boxes){
  const bounds=box.bounds;if(!box.angle&&(Math.max(start[0],end[0])+radius<bounds[0]||Math.min(start[0],end[0])-radius>bounds[3]||Math.max(start[1],end[1])+radius<bounds[1]||Math.min(start[1],end[1])-radius>bounds[4]||Math.max(start[2],end[2])+radius<bounds[2]||Math.min(start[2],end[2])-radius>bounds[5]))continue;
  const a=start.slice(),b=end.slice(),angle=box.angle||0,c=Math.cos(angle),s=Math.sin(angle),[px,py]=box.pivot||[0,0];
  if(angle){a.splice(0,2,(a[0]-px)*c+(a[1]-py)*s,-(a[0]-px)*s+(a[1]-py)*c);b.splice(0,2,(b[0]-px)*c+(b[1]-py)*s,-(b[0]-px)*s+(b[1]-py)*c);}
  const lo=box.bounds.slice(0,3).map(v=>v-radius),hi=box.bounds.slice(3).map(v=>v+radius),d=b.map((v,i)=>v-a[i]);
  let enter=-Infinity,leave=Infinity,normal=[0,0,0];
  for(let i=0;i<3;i++){
   if(Math.abs(d[i])<1e-12){if(a[i]<lo[i]||a[i]>hi[i]){enter=Infinity;break;}}
   else{let t1=(lo[i]-a[i])/d[i],t2=(hi[i]-a[i])/d[i];const n=d[i]>0?-1:1;if(t1>t2)[t1,t2]=[t2,t1];if(t1>enter){enter=t1;normal=[0,0,0];normal[i]=n;}leave=Math.min(leave,t2);}
  }
  if(enter>leave||leave<0||enter>1)continue;
  let point=null;
  if(enter<0){const choices=[];for(let i=0;i<3;i++)choices.push([a[i]-lo[i],i,-1],[hi[i]-a[i],i,1]);choices.sort((a,b)=>a[0]-b[0]||a[1]-b[1]||a[2]-b[2]);const [,axis,n]=choices[0];normal=[0,0,0];normal[axis]=n;if(d.reduce((v,x,i)=>v+x*normal[i],0)>=-1e-10)continue;point=a.slice();point[axis]=n<0?lo[axis]:hi[axis];enter=0;}
  if(best&&enter>=best.t)continue;
  point ||=a.map((v,i)=>v+d[i]*enter);
  if(angle){point.splice(0,2,point[0]*c-point[1]*s+px,point[0]*s+point[1]*c+py);normal.splice(0,2,normal[0]*c-normal[1]*s,normal[0]*s+normal[1]*c);}
  best={t:Math.max(0,enter),normal,point,kind:box.kind};
 }
 return best;
}
export function advance(a,dt,kind,boxes,grid){
 const radius=kind==='axe'?.08:.12,gravity=kind==='axe'?12:9.8;
 if(kind==='axe'&&a.ground){[a.x,a.y]=safeFloor(a.x,a.y,grid,boxes);return;}
 if(a.slide){const dx=a.slide[0]-a.x,dy=a.slide[1]-a.y,dist=Math.hypot(dx,dy),step=Math.min(dist,5*dt);if(dist>.001){a.x+=dx/dist*step;a.y+=dy/dist*step;}if(dist<.05||canStand(a.x,a.y,grid,boxes))delete a.slide;a.vx=a.vy=a.vz=0;return;}
 let left=dt;
 for(let j=0;j<4;j++){
  const start=[a.x,a.y,a.z],end=[a.x+a.vx*left,a.y+a.vy*left,a.z+a.vz*left-gravity*left*left/2],hit=sweep(start,end,boxes,radius);
  if(!hit){[a.x,a.y,a.z]=end;a.vz-=gravity*left;return;}
  a.vz-=gravity*left*hit.t;const n=hit.normal;[a.x,a.y,a.z]=hit.point.map((v,i)=>v+n[i]*.001);
  if(kind==='axe'){
   a.vx=a.vy=0;
   if(hit.kind==='floor'){a.z=radius;a.ground=true;a.vz=0;[a.x,a.y]=safeFloor(a.x,a.y,grid,boxes);return;}
   if(n[2]>.6){a.slide=safeFloor(a.x,a.y,grid,boxes);a.vz=0;return;}a.vz=Math.min(0,a.vz);
  }else{const v=[a.vx,a.vy,a.vz],dot=v.reduce((z,x,i)=>z+x*n[i],0);[a.vx,a.vy,a.vz]=v.map((x,i)=>(x-1.4*Math.min(0,dot)*n[i])*(n[2]>.6&&i<2?.82:1));if(n[2]>.6&&Math.abs(a.vz)<.24)a.vz=.24;}
  left*=1-hit.t;if(left<1e-6)return;
 }
}
export function launch(p,kind=p.weapon){
 const axe=['axe','dagger','shuriken'].includes(kind),velocity=kind==='dagger'?21:kind==='shuriken'?24:17,speed=(axe?velocity:13)*Math.cos(p.pitch||0);
 return {x:p.x,y:p.y,z:(p.z||0)+(axe?(p.crouch?.975:1.5):(p.crouch?.9:1.35)),vx:Math.cos(p.yaw)*speed,vy:Math.sin(p.yaw)*speed,vz:axe?2+velocity*Math.sin(p.pitch||0):4.2+8*Math.sin(p.pitch||0),ground:false};
}
export function predict(p,data){
 const original=p.weapon,kind=['axe','dagger','shuriken'].includes(original)?'axe':'grenade';if(!['axe','dagger','shuriken','grenade','flashbang','molotov'].includes(original)||p.hp<=0)return [];
 const a=launch(p),boxes=data.projectile_boxes||[],grid=data.arena?.grid||data.grid;if(!grid?.length)return [];
 const limit=kind==='grenade'?Math.max(0,3-(p.cooking?p.cook_time||0:0)):6,points=[[a.x,a.y,a.z]];
 const steps=Math.ceil(limit*120),step=limit/Math.max(1,steps);
 for(let i=0;i<steps;i++){
  const old=[a.vx,a.vy,a.vz];advance(a,step,kind,boxes,grid);
  if(original==='molotov'&&(a.z<=.135||a.vx*old[0]+a.vy*old[1]<-1e-6||a.vz>old[2]+.02)){points.push([a.x,a.y,a.z]);break;}
  if(kind==='axe'&&!a.ground&&(data.players||[]).some(q=>q.id!==p.id&&q.hp>0&&Math.hypot(q.x-a.x,q.y-a.y)<.5&&(q.z||0)<a.z&&a.z<(q.z||0)+1.96*(q.crouch?.65:1))){points.push([a.x,a.y,a.z]);break;}
  if(i%4===3||a.ground||i===steps-1)points.push([a.x,a.y,a.z]);
  if(a.ground)break;
 }
 return points;
}
if(typeof window!=='undefined')window.CheatThrowPhysics={launch,predict,advance,sweep};
