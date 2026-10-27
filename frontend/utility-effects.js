import * as THREE from 'three';
// Bounded flame geometry; all damage is still resolved on the server.
export class UtilityEffects{
 constructor(scene){
  this.t=new THREE.Object3D();this.flames=new THREE.InstancedMesh(new THREE.ConeGeometry(1,1,7),new THREE.MeshBasicMaterial({color:'#ff7e21',transparent:true,opacity:.75,blending:THREE.AdditiveBlending,depthWrite:false,toneMapped:false}),144);this.flames.count=0;this.flames.frustumCulled=false;scene.add(this.flames);
  this.embers=new THREE.InstancedMesh(new THREE.SphereGeometry(1,6,4),new THREE.MeshBasicMaterial({color:'#ffe08c',toneMapped:false}),144);this.embers.count=0;this.embers.frustumCulled=false;scene.add(this.embers);
  this.glow=new THREE.PointLight('#ff792e',0,10,2);scene.add(this.glow);
 }
 update(data,now){let n=0;this.glow.intensity=0;for(const f of data.fires||[]){const age=Math.max(0,f.end-(data.world_time||0)),fade=Math.min(1,age);for(let j=0;j<24&&n<144;j++){const a=j*2.399+f.id,r=Math.sqrt((j+.5)/24)*f.radius,osc=.5+.5*Math.sin(now*.008+j*1.7),height=(.3+osc*.75)*fade;this.t.position.set(f.x+Math.cos(a)*r,(f.z||.03)+height*.5,f.y+Math.sin(a)*r);this.t.rotation.set(0,a,.12*Math.sin(now*.006+j));this.t.scale.set(.22+osc*.16,height,.22+osc*.16);this.t.updateMatrix();this.flames.setMatrixAt(n,this.t.matrix);this.t.position.y+=.6+osc*.4;this.t.scale.setScalar(.018+.018*osc);this.t.updateMatrix();this.embers.setMatrixAt(n++,this.t.matrix);}this.glow.position.set(f.x,1,f.y);this.glow.intensity=fade*3;}this.flames.count=this.embers.count=n;this.flames.instanceMatrix.needsUpdate=true;this.embers.instanceMatrix.needsUpdate=true;}
}
