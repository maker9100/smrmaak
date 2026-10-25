import * as THREE from 'three';
// Bounded reusable pools: no geometry/material allocation per shot.
export class CombatEffects{
 constructor(scene){
  this.scene=scene;this.flashes=new Map();this.shells=[];this.cursor=0;
  this.geometry=new THREE.SphereGeometry(1,7,5);
  this.fire=new THREE.MeshBasicMaterial({color:'#ffe4a0',transparent:true,opacity:.95,depthWrite:false,blending:THREE.AdditiveBlending,toneMapped:false});
  this.cases=new THREE.InstancedMesh(new THREE.CylinderGeometry(.009,.009,.045,7),new THREE.MeshStandardMaterial({color:'#c5a45e',metalness:.7,roughness:.35}),96);this.cases.count=0;this.cases.frustumCulled=false;scene.add(this.cases);this.transform=new THREE.Object3D();
 }
 update(actors,dt,now){
  for(const [id,a] of actors){
   let f=this.flashes.get(id);if(!f){const mesh=new THREE.Mesh(this.geometry,this.fire);mesh.visible=false;this.scene.add(mesh);f={mesh,shots:a.lastShots,until:0};this.flashes.set(id,f);}
   if(a.lastShots>f.shots){
    f.until=now+85;
    const pos=a.gun.localToWorld(new THREE.Vector3(.08,.04,.15));
    const right=new THREE.Vector3(1,0,0).applyQuaternion(a.root.quaternion);
    for(let i=0;i<Math.min(3,a.lastShots-f.shots);i++){
     const shell={p:pos.clone(),v:right.clone().multiplyScalar(1.6+Math.random()).add(new THREE.Vector3(0,1.7+Math.random(),0)),life:2.4,spin:Math.random()*6,shotgun:a.weapon==='shotgun'};
     this.shells[this.cursor]=shell;this.cursor=(this.cursor+1)%96;
    }
   }
   f.shots=a.lastShots;f.mesh.position.copy(a.gun.localToWorld(new THREE.Vector3(0,.03,a.weapon==='pistol'?.27:.72)));
   a.gun.getWorldQuaternion(f.mesh.quaternion);f.mesh.scale.set(a.weapon==='shotgun'?.12:.075,.08,a.weapon==='shotgun'?.37:.22);f.mesh.visible=now<f.until&&a.hp>0;
  }
  for(const [id,f] of this.flashes)if(!actors.has(id)){this.scene.remove(f.mesh);this.flashes.delete(id);}
  let count=0;for(const c of this.shells){if(!c||c.life<=0)continue;c.life-=dt;c.v.y-=9.8*dt;c.p.addScaledVector(c.v,dt);if(c.p.y<.035){c.p.y=.035;c.v.y=Math.abs(c.v.y)*.3;c.v.x*=.6;c.v.z*=.6;}c.spin+=dt*12;
   this.transform.position.copy(c.p);this.transform.rotation.set(c.spin,c.spin*.6,c.spin*.3);this.transform.scale.set(c.shotgun?1.7:1,c.shotgun?1.4:1,c.shotgun?1.7:1);this.transform.updateMatrix();this.cases.setMatrixAt(count,this.transform.matrix);this.cases.setColorAt(count++,new THREE.Color(c.shotgun?'#b34b35':'#c5a45e'));
  }this.cases.count=count;this.cases.instanceMatrix.needsUpdate=true;if(this.cases.instanceColor)this.cases.instanceColor.needsUpdate=true;
 }
 view(id,now){for(const [key,f] of this.flashes)f.mesh.visible=key!==id&&now<f.until;}
}
