import * as THREE from 'three';
import {predict} from './throw-physics.js';
export class Trajectory{
 constructor(scene){
  this.cache=new Map();this.data=null;this.group=new THREE.Group();this.group.name='throw-trajectory';scene.add(this.group);
  this.geometry=new THREE.BufferGeometry();this.array=new Float32Array(224*3);this.geometry.setAttribute('position',new THREE.BufferAttribute(this.array,3));this.geometry.setDrawRange(0,0);
  this.line=new THREE.Line(this.geometry,new THREE.LineDashedMaterial({color:'#72e5f1',dashSize:.18,gapSize:.12,transparent:true,opacity:.85,depthWrite:false,toneMapped:false}));this.line.frustumCulled=false;this.group.add(this.line);
  this.marker=new THREE.Mesh(new THREE.RingGeometry(.16,.23,28),new THREE.MeshBasicMaterial({color:'#72e5f1',side:THREE.DoubleSide,depthWrite:false,transparent:true,opacity:.9,toneMapped:false}));this.marker.rotation.x=-Math.PI/2;this.group.add(this.marker);this.group.visible=false;
 }
 update(data){const key=(data.code||'menu')+':'+data.round+':'+data.map_id;if(key!==this.key){this.key=key;this.cache.clear();this.group.visible=false;}this.data=data;}
 view(p,now){
  this.group.visible=!!this.data&&!p.spectating&&p.hp>0&&['axe','dagger','shuriken','grenade','flashbang','molotov'].includes(p.weapon)&&(p.ammo>0||p.cooking||(p.weapon!=='axe'&&p.cheats?.ammo));if(!this.group.visible)return;
  const signature=[p.weapon,p.x,p.y,p.z||0,p.yaw,p.pitch,p.crouch,p.cooking].map(v=>typeof v==='number'?Math.round(v*100)/100:v).join(':');let cache=this.cache.get(p.id);
  if(!cache||cache.signature!==signature&&now-cache.at>45||now-cache.at>100){cache={signature,at:now,points:predict(p,this.data)};this.cache.set(p.id,cache);}
  const points=cache.points;if(points.length<2){this.group.visible=false;return;}
  const count=Math.min(224,points.length);for(let i=0;i<count;i++){const v=points[i];this.array.set([v[0],v[2],v[1]],i*3);}this.geometry.setDrawRange(0,count);this.geometry.attributes.position.needsUpdate=true;this.line.computeLineDistances();
  const end=points[points.length-1];this.marker.position.set(end[0],Math.max(.025,end[2]),end[1]);this.marker.scale.setScalar(p.weapon==='grenade'?1.5:1);
  const tint=p.cooking&&3-p.cook_time<1?'#ff7355':p.weapon==='axe'?'#f2c779':'#72e5f1';this.line.material.color.set(tint);this.marker.material.color.set(tint);
 }
}

export class ThrowTrails{
 constructor(scene){
  this.tracks=new Map();this.geometry=new THREE.BufferGeometry();this.array=new Float32Array(4096*3);this.colors=new Float32Array(4096*3);this.geometry.setAttribute('position',new THREE.BufferAttribute(this.array,3));this.geometry.setAttribute('color',new THREE.BufferAttribute(this.colors,3));this.geometry.setDrawRange(0,0);
  this.lines=new THREE.LineSegments(this.geometry,new THREE.LineBasicMaterial({vertexColors:true,transparent:true,opacity:.62,depthWrite:false,toneMapped:false}));this.lines.frustumCulled=false;scene.add(this.lines);
 }
 ingest(data,now){
  const key=(data.code||'menu')+':'+(data.round||0)+':'+data.map_id;if(key!==this.key){this.key=key;this.tracks.clear();}
  for(const kind of ['axes','grenades'])for(const a of data[kind]||[]){const id=kind+':'+a.id;let t=this.tracks.get(id);if(!t){t={points:[],at:now,kind,presented:false};this.tracks.set(id,t);}const v=[a.x,a.z,a.y],prev=t.points[t.points.length-1];if(!prev||Math.hypot(v[0]-prev[0],v[1]-prev[1],v[2]-prev[2])>.035){t.points.push([...v,now]);if(t.points.length>32)t.points.shift();t.presented=false;}t.at=now;}
 }
 update(data,now){
  this.ingest(data,now);
  let n=0;const color=new THREE.Color();for(const [id,t] of this.tracks){if(now-t.at>(t.presented?350:2000)){this.tracks.delete(id);continue;}if(t.presented)while(t.points.length&&now-t.points[0][3]>800)t.points.shift();for(let i=1;i<t.points.length&&n<4094;i++){const a=t.points[i-1],b=t.points[i],fade=Math.max(.12,1-(now-a[3])/800);color.set(t.kind==='axes'?'#d5b56c':'#66d5e6').multiplyScalar(fade);this.array.set(a.slice(0,3),n*3);this.colors.set(color.toArray(),n++*3);this.array.set(b.slice(0,3),n*3);this.colors.set(color.toArray(),n++*3);}if(t.points.length>1)t.presented=true;}
  this.geometry.setDrawRange(0,n);this.geometry.attributes.position.needsUpdate=true;this.geometry.attributes.color.needsUpdate=true;
 }
}
