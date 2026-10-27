import * as THREE from 'three';
export class WorldEffects{
 constructor(owner){
  this.owner=owner;this.scene=owner.scene;this.key='';this.holes=[];this.lastImpact=0;this.cursor=0;this.positions=new Map();this.booms=new Map();this.transform=new THREE.Object3D();this.ray=new THREE.Raycaster();
  const c=document.createElement('canvas');c.width=c.height=64;const g=c.getContext('2d'),r=g.createRadialGradient(32,32,3,32,32,30);r.addColorStop(0,'#060b0c');r.addColorStop(.19,'#101615');r.addColorStop(.32,'#817c6bbb');r.addColorStop(.56,'#5a5c4b88');r.addColorStop(1,'#222c2000');g.fillStyle=r;g.fillRect(0,0,64,64);
  for(let i=0;i<9;i++){const a=i*2.399;g.strokeStyle='#13201cc0';g.lineWidth=1.5;g.beginPath();g.moveTo(32+Math.cos(a)*6,32+Math.sin(a)*6);g.lineTo(32+Math.cos(a)*20,32+Math.sin(a)*20);g.stroke();}
  const map=new THREE.CanvasTexture(c);map.colorSpace=THREE.SRGBColorSpace;
  this.decals=new THREE.InstancedMesh(new THREE.PlaneGeometry(.14,.14),new THREE.MeshBasicMaterial({map,transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2,alphaTest:.03}),128);this.decals.count=0;this.decals.frustumCulled=false;this.scene.add(this.decals);
  this.grenades=new THREE.InstancedMesh(new THREE.DodecahedronGeometry(.085,1),new THREE.MeshStandardMaterial({color:'#4e6642',roughness:.7,metalness:.4}),32);this.grenades.count=0;this.grenades.frustumCulled=false;this.scene.add(this.grenades);
  this.smoke=new THREE.InstancedMesh(new THREE.SphereGeometry(1,12,8),new THREE.MeshBasicMaterial({color:'#776f60',transparent:true,opacity:.38,depthWrite:false}),16);this.smoke.count=0;this.smoke.frustumCulled=false;this.scene.add(this.smoke);
  this.flash=new THREE.InstancedMesh(new THREE.SphereGeometry(1,12,8),new THREE.MeshBasicMaterial({color:'#ffbd58',transparent:true,opacity:.85,depthWrite:false,blending:THREE.AdditiveBlending,toneMapped:false}),16);this.flash.count=0;this.flash.frustumCulled=false;this.scene.add(this.flash);
  this.light=new THREE.PointLight('#ffb453',0,12,2);this.scene.add(this.light);this.last=0;
 }
 addHole(e,data){
  const owner=this.owner;owner.staticRoot.updateMatrixWorld(true);
  this.ray.set(new THREE.Vector3(e.ox,e.oz,e.oy),new THREE.Vector3(e.dx,e.dz,e.dy).normalize());this.ray.near=.02;this.ray.far=e.distance+2;
  const objects=e.surface==='train'?[owner.trainRoot]:e.surface==='crane'?[owner.mechanisms?.load]:e.surface==='clock'?[owner.mechanisms?.hand]:[owner.staticRoot];
  const hit=this.ray.intersectObjects(objects.filter(Boolean),true).find(h=>h.object.isMesh&&h.face);if(!hit)return;
  const n=hit.face.normal.clone().transformDirection(hit.object.matrixWorld),point=hit.point.clone().addScaledVector(n,.008);let anchor=null;
  if(e.surface==='train'&&owner.trainSnapshot)anchor={x:owner.trainSnapshot.x,y:owner.trainSnapshot.y,z:0};
  if(e.surface==='crane'&&data.crane)anchor={x:data.crane.x,y:data.crane.y,z:data.crane.lift};
  if(e.surface==='clock')anchor={x:30,y:17.5,z:0,angle:(data.world_time||0)*Math.PI*2/24};
  this.holes[this.cursor]={point,n,surface:e.surface,anchor};this.cursor=(this.cursor+1)%128;
 }
 update(data,now){
  const key=(data.code||'menu')+':'+(data.round||0)+':'+(data.map_id||'');if(key!==this.key){this.key=key;this.holes=[];this.lastImpact=0;this.cursor=0;this.positions.clear();this.booms.clear();}
  const dt=Math.min(.1,Math.max(0,(now-(this.last||now))/1000));this.last=now;
  for(const e of data.impacts||[])if(e.id>this.lastImpact){this.addHole(e,data);this.lastImpact=e.id;}
  let count=0;
  for(const h of this.holes){if(!h)continue;const point=h.point.clone(),normal=h.n.clone(),a=h.anchor;
   if(h.surface==='train'){if(!this.owner.trainSnapshot?.active)continue;point.x+=this.owner.trainSnapshot.x-a.x;}
   if(h.surface==='crane'&&data.crane){point.x+=data.crane.x-a.x;point.z+=data.crane.y-a.y;point.y+=data.crane.lift-a.z;}
   if(h.surface==='clock'){const delta=(data.world_time||0)*Math.PI*2/24-a.angle;point.sub(new THREE.Vector3(a.x,0,a.y)).applyAxisAngle(new THREE.Vector3(0,1,0),-delta).add(new THREE.Vector3(a.x,0,a.y));normal.applyAxisAngle(new THREE.Vector3(0,1,0),-delta);}
   this.transform.position.copy(point);this.transform.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),normal);this.transform.scale.set(1,1,1);this.transform.updateMatrix();this.decals.setMatrixAt(count++,this.transform.matrix);
  }this.decals.count=count;this.decals.instanceMatrix.needsUpdate=true;
  count=0;const alive=new Set();for(const g of data.grenades||[]){if(count>=32)break;alive.add(g.id);let p=this.positions.get(g.id);const target=new THREE.Vector3(g.x,g.z,g.y);if(!p){p=target;this.positions.set(g.id,p);}else p.lerp(target,1-Math.exp(-28*dt));this.transform.position.copy(p);this.transform.rotation.set(now*.004,now*.003,0);this.transform.scale.set(g.kind==='molotov'?.65:1,g.kind==='molotov'?1.8:g.kind==='flashbang'?1.2:1,g.kind==='molotov'?.65:1);this.transform.updateMatrix();this.grenades.setColorAt(count,new THREE.Color(g.kind==='flashbang'?'#c1d1c5':g.kind==='molotov'?'#a9ac6c':'#ffffff'));this.grenades.setMatrixAt(count++,this.transform.matrix);}for(const id of this.positions.keys())if(!alive.has(id))this.positions.delete(id);this.grenades.count=count;this.grenades.instanceMatrix.needsUpdate=true;if(this.grenades.instanceColor)this.grenades.instanceColor.needsUpdate=true;
  let smoke=0,flash=0;this.light.intensity=0;
  for(const e of data.explosions||[]){if(!this.booms.has(e.id))this.booms.set(e.id,now-(e.visualAge??Math.min(.15,Math.max(0,(data.world_time||0)-e.time)))*1000);const age=(now-this.booms.get(e.id))/1000;if(age<0||age>1.1)continue;this.transform.position.set(e.x,e.z+.3+age*.6,e.y);this.transform.rotation.set(0,0,0);
   this.flash.material.color.set(e.kind==='flashbang'?'#f2ffff':e.kind==='molotov'?'#ff7321':'#ffbd58');
   if(age<.18&&flash<16){this.transform.scale.setScalar(.4+age*11);this.transform.updateMatrix();this.flash.setMatrixAt(flash++,this.transform.matrix);this.light.position.copy(this.transform.position);this.light.intensity=this.owner.quality===6?0:6*(1-age/.18);}
   if(smoke<16){this.transform.scale.setScalar(.5+age*2.1);this.transform.updateMatrix();this.smoke.setMatrixAt(smoke++,this.transform.matrix);}
  }for(const [id,t] of this.booms)if(now-t>3000&&!(data.explosions||[]).some(e=>e.id===id))this.booms.delete(id);this.smoke.count=smoke;this.flash.count=flash;this.smoke.instanceMatrix.needsUpdate=true;this.flash.instanceMatrix.needsUpdate=true;
 }
}
