import * as THREE from 'three';
export class AxeEffects{
 constructor(scene){
  this.items=[];this.tracks=new Map();const steel=new THREE.MeshStandardMaterial({color:'#a9b1a4',metalness:.7,roughness:.35}),wood=new THREE.MeshStandardMaterial({color:'#69573e',roughness:.9});
  const shape=new THREE.Shape();shape.moveTo(-.12,.07);shape.lineTo(.04,.07);shape.lineTo(.16,.15);shape.lineTo(.20,.02);shape.lineTo(.16,-.13);shape.lineTo(.02,-.06);shape.lineTo(-.12,-.06);shape.closePath();
  const bladeGeometry=new THREE.ExtrudeGeometry(shape,{depth:.045,bevelEnabled:true,bevelSize:.006,bevelThickness:.004,bevelSegments:2,steps:1});bladeGeometry.translate(0,0,-.0225);
  const gripGeometry=new THREE.TorusGeometry(.024,.004,6,12),rubber=new THREE.MeshStandardMaterial({color:'#303e34',roughness:.85});
  for(let i=0;i<6;i++){const root=new THREE.Group();root.name='thrown-axe';const handle=new THREE.Mesh(new THREE.CylinderGeometry(.018,.024,.62,16),wood),blade=new THREE.Mesh(bladeGeometry,steel);blade.position.set(0,.22,0);root.add(handle,blade);for(let j=0;j<9;j++){const ring=new THREE.Mesh(gripGeometry,rubber);ring.rotation.x=Math.PI/2;ring.position.y=-.25+j*.022;root.add(ring);}scene.add(root);root.visible=false;this.items.push(root);}
 }
 update(axes,now,key){
  if(this.key!==key){this.key=key;this.tracks.clear();}const dt=Math.min(.12,Math.max(0,(now-(this.last||now))/1000));this.last=now;const alive=new Set();
  this.items.forEach((mesh,i)=>{const a=axes[i];mesh.visible=!!a;if(!a)return;alive.add(a.id);let track=this.tracks.get(a.id);const target=new THREE.Vector3(a.x,a.z+(a.ground?.025:0),a.y);if(!track){track=target.clone();this.tracks.set(a.id,track);}else track.lerp(target,1-Math.exp(-35*dt));mesh.position.copy(track);mesh.rotation.set(a.ground?Math.PI/2:now*.018,Math.atan2(a.vy,a.vx),a.ground?.3:0);});
  for(const id of this.tracks.keys())if(!alive.has(id))this.tracks.delete(id);
 }
}
