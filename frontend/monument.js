/* Gold human monument with a two-sided, wind-deformed Mad Hackers flag. */
import * as THREE from 'three';
import {roundedBox,capsule,mergeStatic} from './graphics.js';
import {buildOperator,animateOperator,operatorGeometries} from './operators.js';
import {flagFontSource} from './flag-font.js';
let fontReady;
function readyFont(){
 if(!fontReady)fontReady=typeof FontFace==='function'?new FontFace('MadHackersFlag',flagFontSource).load().then(font=>{document.fonts.add(font);return true;}).catch(()=>false):Promise.resolve(false);
 return fontReady;
}
export function buildGoldenMonument(root){
 const group=new THREE.Group();group.name='golden-monument';root.add(group);
 const gold=new THREE.MeshStandardMaterial({color:'#d0a348',metalness:.84,roughness:.32,envMapIntensity:1.05});
 const geos={box:roundedBox,capsule,sphere:new THREE.SphereGeometry(1,24,16),cylinder:new THREE.CylinderGeometry(1,1,1,24),...operatorGeometries};
 for(const geo of Object.values(geos))geo.userData.shared=true;
 const part=(parent,key,tint,x,y,z,sx,sy,sz,records)=>{const node=new THREE.Mesh(geos[key],gold);node.position.set(x,y,z);node.scale.set(sx,sy,sz);parent.add(node);records.push({node,geometry:key,tint});return node;};
 const joint=(parent,x,y,z)=>{const g=new THREE.Group();g.position.set(x,y,z);parent.add(g);return g;};
 const p={id:'monument',skin:'scout',team:0,x:0,y:0,yaw:Math.PI/2,pitch:0,hp:150,shots:0,weapon:'axe',reload:0,vx:0,vy:0};
 const actor=buildOperator(p,part,joint);animateOperator(actor,p,.016,1000);
 for(const r of actor.records)if(r.weapon)r.node.removeFromParent();
 const bone=(node,a,b)=>{const start=new THREE.Vector3(...a),end=new THREE.Vector3(...b);node.position.copy(start).add(end).multiplyScalar(.5);node.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),end.clone().sub(start).normalize());node.scale.y=start.distanceTo(end);};
 for(const arm of actor.arms){
  const right=arm.side>0,shoulder=[arm.side*.235,.425,0],elbow=right?[.40,.28,.17]:[-.36,.17,.02],hand=right?[.40,.64,.29]:[-.30,-.02,.16];
  bone(arm.upper,shoulder,elbow);bone(arm.lower,elbow,hand);arm.hand.position.set(...hand);arm.hand.rotation.set(0,0,right?-.12:.18);
 }
 actor.root.position.set(20,1.72,12);actor.root.rotation.set(0,0,0);actor.root.scale.set(2.35,2.35,2.35);group.add(actor.root);
 const pole=new THREE.Mesh(new THREE.CylinderGeometry(.037,.046,6.1,24),gold);pole.position.set(20.94,5.1,12.68);group.add(pole);
 const finial=new THREE.Mesh(new THREE.SphereGeometry(.10,20,12),gold);finial.position.set(20.94,8.2,12.68);group.add(finial);
 mergeStatic(group);group.userData.human=true;group.userData.material='gold';
 const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=512;const ctx=canvas.getContext('2d'),texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
 let disposed=false;texture.addEventListener('dispose',()=>{disposed=true;});
 const paint=()=>{ctx.fillStyle='#123c32';ctx.fillRect(0,0,1024,512);ctx.strokeStyle='#dfc36f';ctx.lineWidth=12;ctx.strokeRect(18,18,988,476);ctx.strokeStyle='#a79b62';ctx.lineWidth=2;ctx.strokeRect(34,34,956,444);ctx.fillStyle='#f3df9b';ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='500 164px MadHackersFlag,"Noto Sans KR",sans-serif';ctx.fillText('매드해커스',512,248,900);ctx.font='500 33px sans-serif';ctx.fillText('MAD HACKERS',512,398);texture.needsUpdate=true;};
 paint();readyFont().then(()=>{if(!disposed)paint();});
 const flag=new THREE.Group();flag.name='mad-hackers-flag';flag.position.set(20.94,7.18,12.68);flag.userData.label='매드해커스';root.add(flag);
 const width=2.8,height=1.55,front=new THREE.PlaneGeometry(width,height,24,8);front.translate(width/2,0,0);
 const back=front.clone();back.scale(-1,1,1);back.translate(width,0,-.012);back.computeVertexNormals();
 const cloth=new THREE.MeshStandardMaterial({map:texture,color:'#ffffff',roughness:.88,metalness:0,side:THREE.FrontSide});
 const sheets=[front,back].map(geometry=>{const mesh=new THREE.Mesh(geometry,cloth);mesh.castShadow=mesh.receiveShadow=true;mesh.userData.base=new Float32Array(geometry.attributes.position.array);flag.add(mesh);return mesh;});
 root.userData.flagLabel='매드해커스';root.userData.statue='golden-human';
 return {root:flag,sheets,width};
}
export function animateMonument(flag,time){
 if(!flag)return;
 for(const mesh of flag.sheets){const attr=mesh.geometry.attributes.position,base=mesh.userData.base;
  for(let i=0;i<attr.count;i++){const x=base[i*3],y=base[i*3+1],u=x/flag.width;attr.setXYZ(i,x,y-Math.pow(u,1.6)*.10,base[i*3+2]+u*(Math.sin(x*3-time*2.2)*.13+Math.sin(y*3+x*1.3-time*1.4)*.06));}
  attr.needsUpdate=true;mesh.geometry.computeVertexNormals();
 }
}
