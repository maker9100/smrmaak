/* Original map-specific scenery and server-clock-driven machinery. */
import * as THREE from 'three';
import {mergeStatic} from './graphics.js';
export function environment(root,id,surfaces){
 const g=new THREE.Group();g.name='environment-'+id;root.add(g);
 const mesh=(geo,kind,c,x,y,z)=>{const m=new THREE.Mesh(geo,surfaces.get(kind,c));m.position.set(x,y,z);g.add(m);return m;};
 const box=(x,y,z,w,h,d,k,c)=>mesh(new THREE.BoxGeometry(w,h,d),k,c,x,y,z);
 if(id==='freight'){
  mesh(new THREE.PlaneGeometry(220,180),'glass','#376477',30,-.25,-65).rotation.x=-Math.PI/2;
  box(30,-.5,17.5,77,1,47,'concrete','#7b827c');
  // Ocean-going cargo vessel beyond the quay, bow and bridge distinct in silhouette.
  const ship=new THREE.Group();ship.name='cargo-ship';ship.position.set(28,0,-31);g.add(ship);
  const shape=new THREE.Shape();shape.moveTo(-35,-5);shape.lineTo(29,-5);shape.lineTo(39,0);shape.lineTo(29,5);shape.lineTo(-35,5);shape.closePath();
  const hull=new THREE.Mesh(new THREE.ExtrudeGeometry(shape,{depth:6,bevelEnabled:true,bevelSize:.4,bevelThickness:.4,bevelSegments:1,steps:1}),surfaces.get('paint','#384b53'));hull.rotation.x=-Math.PI/2;ship.add(hull);
  const sb=(x,y,z,w,h,d,c)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),surfaces.get('paint',c));m.position.set(x,y,z);ship.add(m);};
  sb(-26,9,0,12,6,9,'#d1d3c3');sb(-26,13,0,13,2,10,'#dce1d1');sb(-26,13,-5.05,10,1,.08,'#365662');sb(-26,13,5.05,10,1,.08,'#365662');sb(-29,16,0,2,5,2,'#ab7952');
  for(let x=-16;x<26;x+=7)for(let z=-3;z<=3;z+=3)for(let y=7;y<12;y+=2.5)sb(x,y,z,6.5,2.4,2.8,['#a17157','#75857a','#748d99'][Math.abs(x+z)%3]);
  for(const x of [-8,60]){box(x,10,-10,.5,20,.6,'metal','#bb9b55');box(x+5,20,-10,15,.5,.6,'metal','#bb9b55');}
 }else if(id==='foundry'){
  box(30,-.5,17.5,140,1,120,'concrete','#4d4841');
  for(let i=0;i<16;i++){
   const x=-12+(i%8)*12,z=i<8?-10:46,r=3+(i%3);
   mesh(new THREE.CylinderGeometry(r,r+.4,.18,13),'glow',i%2?'#ff8d22':'#ffbd42',x,.05,z);
   const rim=mesh(new THREE.TorusGeometry(r+.2,.28,6,22),'metal','#49443d',x,.05,z);rim.rotation.x=Math.PI/2;
   for(let j=0;j<4;j++)mesh(new THREE.DodecahedronGeometry(.7+(j%2),0),'metal','#514b43',x+Math.cos(j*1.57)*(r+1),.5,z+Math.sin(j*1.57)*(r+1));
  }
  for(const x of [-16,76])for(const z of [0,25]){mesh(new THREE.CylinderGeometry(2.5,3.5,18,12),'metal','#675c51',x,9,z);mesh(new THREE.CylinderGeometry(.7,1,27,10),'concrete','#675f52',x+4,13,z+4);box(x,5,z,10,1,8,'metal','#967d52');}
 }else if(id==='observatory'){
  mesh(new THREE.CylinderGeometry(53,65,16,40),'rock','#566270',30,-8,17.5);
  for(let i=0;i<22;i++){
   const a=i*Math.PI*2/22,r=62+(i%3)*10,h=25+(i*7%25),x=30+Math.cos(a)*r,z=17.5+Math.sin(a)*r;
   const geo=new THREE.ConeGeometry(19+(i%3)*4,h,11,5);const pos=geo.attributes.position;for(let j=0;j<pos.count;j++){const x=pos.getX(j),y=pos.getY(j),z=pos.getZ(j),k=1+.14*Math.sin(x*.7+z*.37+i);pos.setXYZ(j,x*k+Math.sin(y*.15+i)*2,y,z*k);}geo.computeVertexNormals();
   const mountain=mesh(geo,'rock',i%2?'#687b89':'#526674',x,h/2-5,z);mountain.rotation.y=i;
   const snow=mesh(new THREE.ConeGeometry(6+(i%3),h*.28,7),'rock','#cad8dc',x,h-5-h*.14,z);snow.rotation.y=i;
  }
  for(let i=0;i<38;i++){const a=i*2.399,r=42+(i%4)*3,x=30+Math.cos(a)*r,z=17.5+Math.sin(a)*r;mesh(new THREE.CylinderGeometry(.18,.24,3,6),'metal','#59584a',x,1,z);mesh(new THREE.ConeGeometry(1.6,6,7),'fabric','#354c44',x,3,z);}
 }
 mergeStatic(g);return g;
}
export function machinery(root,id,surfaces,landmark){
 const g=new THREE.Group();g.name='machinery';root.add(g);const state={root:g,id};
 const box=(parent,x,y,z,w,h,d,c)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),surfaces.get('paint',c));m.position.set(x,y,z);parent.add(m);return m;};
 if(id==='freight'){
  const load=new THREE.Group();load.name='crane-load';g.add(load);state.load=load;
  box(load,0,1.3,0,6,2.6,2,'#b3a078');
  for(let x=-2.9;x<3;x+=.35)for(const z of [-1.01,1.01])box(load,x,1.3,z,.045,2.5,.03,'#8d836a');
  for(const x of [-3,3])for(const z of [-1,1])box(load,x,1.3,z,.12,2.6,.12,'#6b766e');
  state.cables=[];for(const x of [-2.6,2.6]){const m=box(g,30+x,5,8,.035,5,.035,'#303a3b');state.cables.push(m);}
  state.trolley=box(g,30,11,8,7,.7,2,'#d1ae58');
  for(const x of [26.5,33.5])box(g,x,11.5,17.5,.4,.7,25,'#c1a056');
  // Landing pads are signals, not extra collisions.
  for(const z of [8,27])for(const x of [26.6,33.4])box(g,x,.025,z,.13,.05,3,'#e8bc5f');
  mergeStatic(load);
 }else if(id==='plaza'){
  state.hand=new THREE.Group();state.hand.name='clock-hazard';state.hand.position.set(30,.95,17.5);g.add(state.hand);
  box(state.hand,8,0,0,10,.24,.32,'#b79a51');box(state.hand,12.4,.02,0,1.2,.3,.8,'#d5bc73');
  for(let x=3.5;x<13;x+=.8)box(state.hand,x,.14,0,.3,.04,.33,'#3a3830');
  mergeStatic(state.hand);
 }else if(id==='observatory'){
  state.dome=new THREE.Group();state.dome.name='rotating-dome';state.dome.position.set(20,3.4,12);landmark.add(state.dome);
  for(const child of [...landmark.children]){
   if(child===state.dome||!child.isMesh)continue;
   child.geometry.computeBoundingBox();const b=child.geometry.boundingBox.clone();child.updateMatrix();b.applyMatrix4(child.matrix);
   if(b.min.y>=3.35){child.position.sub(state.dome.position);state.dome.add(child);}
  }
 }
 return state;
}
export function animateMachinery(m,time,crane){
 if(!m)return;
 if(m.hand)m.hand.rotation.y=-time*Math.PI*2/24;
 if(m.dome)m.dome.rotation.y=time*.12;
 if(m.load){
  const c=crane||{x:27,y:7,w:6,h:2,lift:0};m.load.position.set(c.x+c.w/2,c.lift,c.y+c.h/2);
  m.trolley.position.set(c.x+c.w/2,11,c.y+c.h/2);
  m.cables.forEach((n,i)=>{const bottom=c.lift+2.6;n.position.set(c.x+c.w/2+(i?2.6:-2.6),(11+bottom)/2,c.y+c.h/2);n.scale.y=(11-bottom)/5;});
 }
}
