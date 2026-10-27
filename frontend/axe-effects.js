import * as THREE from 'three';
export class AxeEffects{
 constructor(scene){
  this.tracks=new Map();this.transform=new THREE.Object3D();this.meshes={};const steel=new THREE.MeshStandardMaterial({color:'#aebbb5',metalness:.78,roughness:.29}),wood=new THREE.MeshStandardMaterial({color:'#69573e',roughness:.87});
  const shape=new THREE.Shape();shape.moveTo(-.12,.07);shape.lineTo(.04,.07);shape.lineTo(.16,.15);shape.lineTo(.20,.02);shape.lineTo(.16,-.13);shape.lineTo(.02,-.06);shape.lineTo(-.12,-.06);shape.closePath();
  const blade=new THREE.ExtrudeGeometry(shape,{depth:.045,bevelEnabled:true,bevelSize:.006,bevelThickness:.004,bevelSegments:2,steps:1});blade.translate(0,.22,-.0225);
  const star=new THREE.Shape();for(let j=0;j<8;j++){const a=j*Math.PI/4,r=j%2?.035:.11;j?star.lineTo(Math.cos(a)*r,Math.sin(a)*r):star.moveTo(Math.cos(a)*r,Math.sin(a)*r);}star.closePath();
  const shapes={axe:[blade,steel],handle:[new THREE.CylinderGeometry(.018,.024,.62,12),wood],dagger:[new THREE.BoxGeometry(.035,.35,.012),steel],shuriken:[new THREE.ExtrudeGeometry(star,{depth:.01,bevelEnabled:false}),steel]};
  for(const [key,[geo,mat]] of Object.entries(shapes)){const m=new THREE.InstancedMesh(geo,mat,128);m.name='thrown-'+key;m.count=0;m.frustumCulled=false;scene.add(m);this.meshes[key]=m;}
 }
 update(axes,now,key){
  if(this.key!==key){this.key=key;this.tracks.clear();}const dt=Math.min(.12,Math.max(0,(now-(this.last||now))/1000));this.last=now;const alive=new Set(),counts={axe:0,handle:0,dagger:0,shuriken:0};
  for(const a of axes.slice(0,128)){alive.add(a.id);let t=this.tracks.get(a.id),target=new THREE.Vector3(a.x,a.z+(a.ground?.025:0),a.y);if(!t){t=target;this.tracks.set(a.id,t);}else t.lerp(target,1-Math.exp(-35*dt));const kind=a.weapon||'axe';this.transform.position.copy(t);this.transform.rotation.set(a.ground?Math.PI/2:now*.018,Math.atan2(a.vy,a.vx),a.ground?.3:0);this.transform.scale.setScalar(1);this.transform.updateMatrix();const keys=kind==='axe'?['axe','handle']:[kind];for(const k of keys){const mesh=this.meshes[k];if(mesh)mesh.setMatrixAt(counts[k]++,this.transform.matrix);}}
  for(const k of Object.keys(counts)){this.meshes[k].count=counts[k];this.meshes[k].instanceMatrix.needsUpdate=true;}for(const id of this.tracks.keys())if(!alive.has(id))this.tracks.delete(id);
 }
}
