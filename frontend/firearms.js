/* Original SG-12 pump shotgun and P-9 service pistol, with moving actions. */
import * as THREE from 'three';
import {roundedBox,capsule} from './graphics.js';
const cylinder=new THREE.CylinderGeometry(1,1,1,20);cylinder.userData.shared=true;
export function buildFirearm(key,surfaces){
    const root=new THREE.Group(),moving=new THREE.Group(),magazine=new THREE.Group(),support=new THREE.Group();root.name=key;root.add(moving,magazine,support);
    const mesh=(parent,geometry,tint,x,y,z,sx,sy,sz,kind='gunmetal')=>{const m=new THREE.Mesh(geometry,surfaces.get(kind,tint));m.position.set(x,y,z);m.scale.set(sx,sy,sz);parent.add(m);return m;};
    const box=(p,c,x,y,z,w,h,d,k)=>mesh(p,roundedBox,c,x,y,z,w,h,d,k);
    const tube=(p,c,x,y,z,r,l)=>{const m=mesh(p,cylinder,c,x,y,z,r,l,r);m.rotation.x=Math.PI/2;return m;};
    const dark='#27373d',steel='#798884',grip='#37453d';let muzzle;
    if(key==='axe'){
        const shape=new THREE.Shape();shape.moveTo(-.12,.07);shape.lineTo(.04,.07);shape.lineTo(.16,.15);shape.lineTo(.20,.02);shape.lineTo(.16,-.13);shape.lineTo(.02,-.06);shape.lineTo(-.12,-.06);shape.closePath();
        const blade=mesh(root,new THREE.ExtrudeGeometry(shape,{depth:.045,bevelEnabled:true,bevelSize:.006,bevelThickness:.004,bevelSegments:2,steps:1}),steel,0,.17,-.16,1,1,1);blade.geometry.translate(0,0,-.022);
        box(root,'#775f43',0,-.12,-.15,.035,.65,.036,'fabric');box(root,dark,0,-.39,-.15,.045,.10,.045,'rubber');
        for(let j=0;j<12;j++)box(root,'#343e37',0,-.09-j*.019,-.15,.04,.009,.042,'rubber');
        for(const x of [-.025,.025])mesh(root,cylinder,'#a2a991',x,.17,-.16,.008,.06,.008);
        box(root,dark,-.11,.18,-.16,.08,.045,.045);muzzle=-.2;
    }else if(key==='grenade'){
        mesh(root,new THREE.SphereGeometry(1,20,14),'#4e6148',0,-.015,-.08,.075,.10,.068,'metal');
        for(let row=0;row<5;row++)for(let side=0;side<8;side++){const a=side*Math.PI/4;const b=box(root,'#354a35',Math.cos(a)*.068,-.08+row*.032,-.08+Math.sin(a)*.062,.018,.023,.018);b.rotation.y=-a;}
        box(root,steel,0,.11,-.08,.042,.028,.045);box(root,steel,.046,.044,-.08,.018,.16,.04).rotation.z=.25;
        const ring=mesh(root,new THREE.TorusGeometry(.025,.004,8,20),steel,-.035,.12,-.08,1,1,1);ring.rotation.y=Math.PI/2;muzzle=-.1;
    }else if(key==='pistol'){
        box(root,dark,0,-.035,.015,.07,.075,.22);
        box(root,grip,0,-.115,.07,.064,.17,.085,'rubber').rotation.x=-.23;
        box(magazine,'#17272b',0,-.198,.09,.07,.022,.09,'rubber');box(magazine,'#65716b',0,-.14,.08,.05,.13,.065);
        box(moving,'#71807b',0,.025,-.015,.078,.075,.235);
        tube(root,'#18272b',0,.023,-.141,.022,.028);tube(root,steel,0,.023,-.15,.015,.012);
        box(moving,'#26373b',.040,.028,.01,.005,.029,.06);box(moving,steel,.043,.028,.01,.003,.010,.038);
        for(const x of [-.04,.04])for(let j=0;j<7;j++)box(moving,'#26373b',x,.025,.045+j*.011,.003,.048,.004);
        for(const x of [-.025,.025])box(moving,dark,x,.078,.075,.015,.032,.025);
        box(moving,'#b1c7a2',0,.074,-.10,.009,.019,.012);
        box(root,steel,.042,-.017,.072,.008,.012,.04);
        const guard=mesh(root,new THREE.TorusGeometry(.038,.006,8,20),dark,0,-.077,-.018,1,1,1);guard.rotation.y=Math.PI/2;
        box(root,dark,0,-.063,-.01,.009,.034,.008).rotation.x=-.3;
        muzzle=-.168;
    }else{
        box(root,dark,0,0,.01,.115,.135,.33);
        box(root,grip,0,-.045,.285,.09,.14,.26,'rubber');
        box(root,'#263633',0,-.055,.405,.10,.16,.04,'rubber');
        tube(root,steel,0,.018,-.42,.027,.57);tube(root,dark,0,-.047,-.34,.023,.43);
        tube(root,'#19272b',0,.018,-.713,.029,.025);
        box(moving,'#605b49',0,-.026,-.33,.094,.095,.25,'rubber');
        for(let j=0;j<9;j++)box(moving,dark,0,-.025,-.44+j*.026,.097,.085,.008,'rubber');
        box(root,'#15272b',.06,.018,.025,.007,.048,.11);box(root,steel,.065,.018,.025,.004,.016,.075);
        box(root,dark,0,-.13,.09,.065,.20,.085,'rubber').rotation.x=-.15;
        for(let j=0;j<5;j++)box(root,'#7d8979',0,.079,-.12+j*.045,.08,.014,.012);
        box(root,'#c8d4aa',0,.065,-.65,.012,.04,.018);
        const guard=mesh(root,new THREE.TorusGeometry(.046,.007,8,20),dark,0,-.107,.019,1,1,1);guard.rotation.y=Math.PI/2;
        tube(magazine,'#bb4233',-.03,-.11,-.04,.019,.065);tube(magazine,'#c3a45f',-.03,-.11,-.008,.019,.012);
        muzzle=-.735;
    }
    // Gloves follow the supporting hand and the pump, rather than floating.
    for(const side of [-1,1]){
        const parent=side<0?support:root,x=side<0?-.035:.035,z=side<0?(key==='pistol'?.04:-.33):.105;
        mesh(parent,capsule,'#667369',side*.10,-.25,z+.13,.13,.31,.14,'fabric').rotation.z=side*.33;
        mesh(parent,new THREE.SphereGeometry(1,16,10),'#3c4b3e',x,-.10,z,.069,.065,.08,'fabric');
        for(let f=0;f<4;f++)mesh(parent,capsule,'#3c4b3e',x-.035+f*.023,-.12,z-.04,.021,.06,.03,'fabric').rotation.x=-.7;
    }
    const light=new THREE.PointLight('#ffb861',0,2,.9);light.position.set(0,.02,muzzle);root.add(light);
    const flash=new THREE.Mesh(new THREE.SphereGeometry(1,6,4),new THREE.MeshBasicMaterial({color:'#ffdea0',transparent:true,opacity:.8,depthWrite:false,blending:THREE.AdditiveBlending,toneMapped:false}));flash.position.copy(light.position);flash.scale.set(key==='shotgun'?.075:.035,.05,key==='shotgun'?.23:.10);root.add(flash);
    return {root,moving,magazine,support,light,flash};
}
export function animateFirearm(model,key,shot,reload){
    if(key==='axe'||key==='grenade'){model.support.position.y=-reload*.10;return;}
    const cycle=shot>=0&&shot<600?Math.sin(Math.max(0,(shot-80)/520)*Math.PI):0;
    model.moving.position.z=key==='pistol'?Math.max(0,1-shot/105)*.038:cycle*.12;
    model.support.position.z=key==='shotgun'?cycle*.12:0;
    model.support.position.y=-reload*.14;
    model.magazine.position.y=-reload*.17;
    if(key==='shotgun'){model.magazine.visible=reload>0;model.magazine.position.set(-reload*.09,-reload*.17,reload*.08);model.support.position.x=-reload*.08;}else model.support.position.set(reload*.035,-reload*.17,reload*.03);
}

// Small readable first-person details, with shared geometry and original design.
export function detailFirearm(model,key,surfaces){
 const root=model.root,detail=new THREE.Group();detail.name='weapon-details';root.add(detail);
 const add=(geo,c,x,y,z,sx,sy,sz)=>{const m=new THREE.Mesh(geo,surfaces.get('gunmetal',c));m.position.set(x,y,z);m.scale.set(sx,sy,sz);detail.add(m);return m;};
 // Every slot receives the same hand, fastener and material finish standard.
 for(const side of [-1,1]){
  const parent=side<0?(model.support||root):root,x=side<0?(key==='rifle'?-.06:-.035):.035,z=side<0?(key==='rifle'?-.27:key==='pistol'?.04:-.33):.105;
  for(let j=0;j<4;j++){const knuckle=new THREE.Mesh(roundedBox,surfaces.get('rubber','#3b493f'));knuckle.position.set(x-.035+j*.023,-.051,z-.006);knuckle.scale.set(.019,.013,.035);parent.add(knuckle);}
  const cuff=new THREE.Mesh(roundedBox,surfaces.get('fabric','#6b7c67'));cuff.position.set(side*.08,-.175,z+.06);cuff.scale.set(.10,.022,.075);parent.add(cuff);
 }
 if(key==='axe'){
  for(const side of [-1,1]){
   add(roundedBox,'#d5d7bf',.16,.17,-.16+side*.029,.027,.20,.006).rotation.z=-.12;
   const rivet=add(cylinder,'#c2b995',0,.17,-.16+side*.028,.012,.008,.012);rivet.rotation.x=Math.PI/2;
   add(roundedBox,'#9c8964',side*.02,-.12,-.15,.003,.28,.016);
  }
 }else if(key==='grenade'){
  const collar=add(cylinder,'#8a9983',0,.096,-.08,.042,.023,.042);
  for(const side of [-1,1]){const pin=add(cylinder,'#bec5aa',side*.042,.105,-.08,.006,.018,.006);pin.rotation.z=Math.PI/2;}
  for(let j=0;j<3;j++)add(roundedBox,'#a59b62',-.02+j*.02,.015,-.146,.011,.025,.003);
 }
 model.root.userData.detailStandard='cohesive-070-r1';
 if(key==='axe'||key==='grenade'){model.detail=detail;return;}
 const length=key==='pistol'?.16:key==='shotgun'?.53:.47,width=key==='pistol'?.043:.069;
 for(const side of [-1,1]){
  for(const z of [-.09,.065]){const screw=add(cylinder,'#a4aba1',side*width,-.018,z,.009,.008,.009);screw.rotation.z=Math.PI/2;add(roundedBox,'#283338',side*(width+.005),-.018,z,.003,.003,.012);}
  for(let j=0;j<5;j++)add(roundedBox,'#202d31',side*width,-.13+j*.018,.07,.005,.006,.052);
 }
 const port=add(roundedBox,'#172125',width+.002,.012,-.015,.004,.036,key==='pistol'?.045:.09);
 add(roundedBox,'#9ba99e',width+.008,.008,-.015,.009,.009,.04);
 if(key!=='pistol'){
  const ring=add(cylinder,'#81918d',0,.018,-length,.035,.025,.035);ring.rotation.x=Math.PI/2;
  add(roundedBox,'#273c3b',-.075,.025,.11,.018,.018,.048);
  add(roundedBox,'#85958b',0,.091,-.11,.026,.022,.045);
 }else{
  add(roundedBox,'#adba9d',-.023,.079,.074,.007,.008,.006);add(roundedBox,'#adba9d',.023,.079,.074,.007,.008,.006);
 }
 model.detail=detail;
}
