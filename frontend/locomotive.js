/* Original compact B-B diesel shunter. Model coordinates are metres. */
import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';

function paintMaps(surfaces){
    if(surfaces.dieselFinish)return surfaces.dieselFinish;
    let seed=93;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
    const c=document.createElement('canvas');c.width=c.height=512;const g=c.getContext('2d'),pixels=g.createImageData(512,512);
    for(let i=0;i<pixels.data.length;i+=4){const v=224+(random()-.5)*11;pixels.data[i]=pixels.data[i+1]=pixels.data[i+2]=v;pixels.data[i+3]=255;}g.putImageData(pixels,0,0);
    for(let i=0;i<550;i++){g.strokeStyle=`rgba(75,77,67,${.015+random()*.055})`;const x=random()*512,y=random()*512;g.beginPath();g.moveTo(x,y);g.lineTo(x+random()*24,y+random()*2);g.stroke();}
    const map=new THREE.CanvasTexture(c);map.colorSpace=THREE.SRGBColorSpace;map.wrapS=map.wrapT=THREE.RepeatWrapping;map.anisotropy=4;
    const result={map};surfaces.dieselFinish=result;return result;
}

function material(surfaces,key,tint,roughness=.7,metalness=.35){
    const id='diesel:'+key;if(surfaces.cache.has(id))return surfaces.cache.get(id);
    const m=new THREE.MeshStandardMaterial({...paintMaps(surfaces),color:tint,roughness,metalness,envMapIntensity:.8});m.userData.persistent=true;m.userData.surface='locomotive';surfaces.cache.set(id,m);return m;
}

function decal(root,text,x,y,z,w,h,yaw=0){
    const c=document.createElement('canvas');c.width=512;c.height=128;const g=c.getContext('2d');g.clearRect(0,0,512,128);g.fillStyle='#e8e5d4';g.font='500 76px monospace';g.textAlign='center';g.fillText(text,256,88,490);
    const texture=new THREE.CanvasTexture(c);texture.colorSpace=THREE.SRGBColorSpace;
    const mesh=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshStandardMaterial({map:texture,transparent:true,depthWrite:false,roughness:.85,polygonOffset:true,polygonOffsetFactor:-1}));mesh.position.set(x,y,z);mesh.rotation.y=yaw;root.add(mesh);
}

function hazardMaterial(){
    const c=document.createElement('canvas');c.width=512;c.height=128;const g=c.getContext('2d');g.fillStyle='#d2b75e';g.fillRect(0,0,512,128);g.fillStyle='#303631';
    for(let x=-128;x<640;x+=96){g.beginPath();g.moveTo(x,0);g.lineTo(x+47,0);g.lineTo(x-81,128);g.lineTo(x-128,128);g.closePath();g.fill();}
    const texture=new THREE.CanvasTexture(c);texture.colorSpace=THREE.SRGBColorSpace;return new THREE.MeshStandardMaterial({map:texture,roughness:.78,metalness:.25});
}

export function buildDieselLocomotive(surfaces){
    const root=new THREE.Group();root.name='diesel-locomotive';const wheels=[],fans=[];
    const body=material(surfaces,'body','#405a5b',.67,.32),cream=material(surfaces,'cream','#b9b6a1',.7,.25),frame=material(surfaces,'frame','#353f3c',.82,.5);
    const cast=material(surfaces,'cast','#414b47',.82,.55),steel=material(surfaces,'steel','#a3aaa0',.32,.85),dark=material(surfaces,'dark','#222b29',.88,.25),safety=material(surfaces,'safety','#d9bc6b',.64,.35);
    const glassKey='diesel:glass';if(!surfaces.cache.has(glassKey)){const m=new THREE.MeshPhysicalMaterial({color:'#385962',roughness:.13,metalness:.12,clearcoat:1,transparent:true,opacity:.76,depthWrite:false,side:THREE.DoubleSide});m.userData.persistent=true;surfaces.cache.set(glassKey,m);}const glass=surfaces.cache.get(glassKey);
    const lensKey='diesel:headlight';if(!surfaces.cache.has(lensKey)){const m=new THREE.MeshStandardMaterial({color:'#fff1cc',emissive:'#e9c788',emissiveIntensity:.65,roughness:.15,metalness:.1});m.userData.persistent=true;surfaces.cache.set(lensKey,m);}const lens=surfaces.cache.get(lensKey);
    const tail=material(surfaces,'tail-lamp','#aa5240',.18,.1);tail.emissive.set('#7c2012');tail.emissiveIntensity=.35;
    function add(parent,geometry,mat,x,y,z){const m=new THREE.Mesh(geometry,mat);m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;parent.add(m);return m;}
    function box(parent,mat,x,y,z,w,h,d,r=0){return add(parent,r?new RoundedBoxGeometry(w,h,d,1,r):new THREE.BoxGeometry(w,h,d),mat,x,y,z);}
    function cylinder(parent,mat,x,y,z,r,length,axis='y',segments=16){const m=add(parent,new THREE.CylinderGeometry(r,r,length,segments),mat,x,y,z);if(axis==='z')m.rotation.x=Math.PI/2;if(axis==='x')m.rotation.z=Math.PI/2;return m;}
    function rod(parent,mat,a,b,r=.025){const start=new THREE.Vector3(...a),end=new THREE.Vector3(...b),d=end.clone().sub(start);const m=add(parent,new THREE.CylinderGeometry(r,r,d.length(),8),mat,...start.clone().add(end).multiplyScalar(.5).toArray());m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());return m;}
    function ring(parent,mat,x,y,z,r,tube=.025,axis='z'){const m=add(parent,new THREE.TorusGeometry(r,tube,6,24),mat,x,y,z);if(axis==='y')m.rotation.x=Math.PI/2;if(axis==='x')m.rotation.y=Math.PI/2;return m;}

    // Chassis, underfloor fuel tank, crossmembers and two independent bogies.
    box(root,frame,0,1.18,0,10.7,.25,3.45,.025);
    for(const z of [-1.35,1.35])box(root,frame,0,.99,z,10.0,.26,.16);
    box(root,frame,0,.67,0,3.0,.68,1.72,.08);for(const x of [-1.24,1.24])box(root,steel,x,.66,0,.07,.61,1.76);
    cylinder(root,steel,.8,.85,1.03,.10,.22,'z');box(root,dark,-.65,.49,0,1.2,.18,1.4,.03);
    for(const center of [-3.12,3.12]){
        const bogie=new THREE.Group();bogie.position.set(center,.14,0);bogie.name='bogie';root.add(bogie);
        box(bogie,cast,0,.68,0,2.5,.30,2.12,.06);box(bogie,dark,0,.82,0,1.45,.12,1.45);
        for(const side of [-1,1]){
            box(bogie,cast,0,.64,side*1.04,2.48,.28,.17,.045);
            for(const xx of [-.76,.76]){
                box(bogie,cast,xx,.60,side*1.06,.40,.40,.22,.045);cylinder(bogie,steel,xx,.58,side*1.20,.11,.055,'z');
                // Helical suspension, tucked above the journal boxes.
                const points=[];for(let i=0;i<=32;i++){const a=i/32*Math.PI*6;points.push(new THREE.Vector3(Math.cos(a)*.105,i/32*.33,Math.sin(a)*.105));}
                add(bogie,new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),28,.024,5,false),steel,xx,.77,side*.99);
            }
            cylinder(bogie,cast,0,.53,side*1.13,.085,.70,'x');
            rod(bogie,steel,[-1.1,.40,side*.97],[1.1,.40,side*.97],.027);
        }
        for(const xx of [-.76,.76]){
            cylinder(bogie,steel,xx,.56,0,.085,1.74,'z');box(bogie,cast,xx,.66,0,.42,.30,.84,.035);
            for(const side of [-1,1]){
                const wheel=new THREE.Group();wheel.position.set(xx,.56,side*.82);bogie.add(wheel);wheels.push(wheel);
                cylinder(wheel,steel,0,0,0,.48,.18,'z',28);
                cylinder(wheel,cast,0,0,side*.10,.36,.035,'z',24);
                cylinder(wheel,steel,0,0,side*.14,.15,.10,'z',20);
                ring(wheel,steel,0,0,side*.125,.38,.022);
                cylinder(wheel,steel,0,0,-side*.10,.495,.028,'z',28);
                for(let j=0;j<6;j++){const a=j*Math.PI/3;cylinder(wheel,steel,Math.cos(a)*.23,Math.sin(a)*.23,side*.13,.023,.025,'z',6);}
                box(bogie,dark,xx+.38,.57,side*.78,.09,.27,.18,.015);
            }
        }
    }

    // Flat walkways frame a narrow, chamfered long hood rather than a boiler.
    for(const side of [-1,1]){
        box(root,cast,0,1.36,side*1.58,10.65,.065,.50,.012);
        for(let x=-5;x<5.1;x+=.24)box(root,steel,x,1.398,side*1.58,.028,.012,.42);
    }
    const hoodShape=new THREE.Shape();hoodShape.moveTo(-1.22,0);hoodShape.lineTo(1.22,0);hoodShape.lineTo(1.22,1.30);hoodShape.lineTo(.98,1.55);hoodShape.lineTo(-.98,1.55);hoodShape.lineTo(-1.22,1.30);hoodShape.closePath();
    const hood=new THREE.ExtrudeGeometry(hoodShape,{depth:6.85,bevelEnabled:true,bevelSize:.025,bevelThickness:.025,bevelSegments:1,steps:1});hood.rotateY(Math.PI/2);add(root,hood,body,-2.02,1.46,0);
    box(root,body,5.03,2.15,0,.38,1.35,2.38,.035);box(root,cream,5.233,1.98,0,.025,.17,2.30);
    box(root,body,-4.94,1.89,0,.75,.91,2.63,.04);box(root,cream,-4.94,2.37,0,.79,.10,2.66,.025);
    for(const side of [-1,1]){
        box(root,cream,1.38,1.98,side*1.235,6.78,.17,.024);
        // Engine-access doors: thin seams, hinges and individual handles.
        for(let i=0;i<5;i++){
            const x=-1.43+i*.71;box(root,body,x,2.32,side*1.25,.65,1.12,.025,.008);
            for(const xx of [x-.325,x+.325])box(root,cast,xx,2.30,side*1.27,.012,1.14,.012);
            rod(root,steel,[x+.20,2.16,side*1.30],[x+.20,2.39,side*1.30],.016);
            for(const y of [1.86,2.73])box(root,steel,x-.24,y,side*1.28,.045,.055,.025,.005);
        }
        // A recessed radiator grille with actual louver depth.
        box(root,dark,3.49,2.29,side*1.254,1.82,1.14,.035);
        for(let i=0;i<22;i++)box(root,cast,2.64+i*.081,2.29,side*1.29,.029,1.08,.055);
        for(const y of [1.72,2.86])box(root,steel,3.49,y,side*1.28,1.9,.035,.04);
        decal(root,'CF 040',1.0,2.82,side*1.282,1.23,.28,side<0?Math.PI:0);
    }

    // Raised cab, separate glazing and a simple interior behind the glass.
    box(root,body,-3.25,2.10,0,2.78,1.34,3.02,.045);box(root,cream,-3.25,2.88,0,2.81,.22,3.05,.025);
    const roofProfile=new THREE.Shape();roofProfile.moveTo(-4.76,4.02);roofProfile.lineTo(-4.56,4.30);roofProfile.lineTo(-1.98,4.30);roofProfile.lineTo(-1.75,4.02);roofProfile.closePath();
    const roof=new THREE.ExtrudeGeometry(roofProfile,{depth:3.23,bevelEnabled:true,bevelSize:.035,bevelThickness:.025,bevelSegments:1});add(root,roof,cream,0,0,-1.615);
    for(const side of [-1,1]){
        for(const x of [-4.55,-3.55,-1.96])box(root,cream,x,3.51,side*1.49,.085,1.05,.11,.012);
        box(root,cream,-3.25,3.0,side*1.51,2.66,.075,.11);
        box(root,cream,-3.25,4.0,side*1.51,2.66,.065,.11);
        const sidePane=add(root,new THREE.PlaneGeometry(2.48,.88),glass,-3.25,3.5,side*1.518);if(side<0)sidePane.rotation.y=Math.PI;
        box(root,cast,-3.26,3.50,side*1.533,.035,.88,.025);
        box(root,cast,-4.05,2.16,side*1.524,.015,1.25,.015);box(root,cast,-2.53,2.16,side*1.524,.015,1.25,.015);
        rod(root,steel,[-2.75,2.26,side*1.57],[-2.75,2.50,side*1.57],.022);
        decal(root,'040',-3.25,2.37,side*1.55,.70,.25,side<0?Math.PI:0);
        // Cab seats and control stand stay visible through the glazing.
        box(root,dark,-3.36,2.72,side*.65,.64,.16,.59,.045);box(root,dark,-3.60,3.04,side*.65,.16,.63,.60,.045);
        cylinder(root,steel,-3.36,2.38,side*.65,.045,.60);box(root,cast,-2.28,2.97,side*.56,.38,.34,.82,.025);
        rod(root,cream,[-3.0,3.91,side*1.62],[-3.0,4.0,side*1.94],.025);
        box(root,dark,-3.0,3.94,side*1.90,.24,.30,.065,.025);
    }
    for(const end of [-1,1]){
        const windshield=new THREE.Group();windshield.position.set(end>0?-1.91:-4.61,3.5,0);windshield.rotation.z=end>0?.18:-.07;root.add(windshield);
        for(const side of [-1,1]){
            const z=side*.71;
            for(const zz of [z-.64,z+.64])box(windshield,dark,0,0,zz,.08,1.02,.045,.008);
            for(const y of [-.49,.49])box(windshield,dark,0,y,z,.08,.055,1.32,.008);
            const pane=add(windshield,new THREE.PlaneGeometry(1.24,.91),glass,end*.045,0,z);pane.rotation.y=end>0?Math.PI/2:-Math.PI/2;
            rod(windshield,dark,[end*.075,-.43,z-.25],[end*.075,.25,z+.20],.012);
            rod(windshield,dark,[end*.085,.12,z+.09],[end*.085,.38,z+.33],.018);
        }
        box(windshield,cream,0,0,0,.11,1.03,.10,.012);
    }
    box(root,dark,-3.0,4.36,0,.78,.12,.62,.025);cylinder(root,steel,-3.6,4.58,0,.025,.48);box(root,cream,-3.6,4.83,0,.05,.025,.05);

    // Roof fans and a short diesel exhaust replace the steam chimney.
    for(const x of [3.12,4.18]){
        cylinder(root,dark,x,3.065,0,.47,.07,'y',28);ring(root,steel,x,3.12,0,.46,.025,'y');
        const fan=new THREE.Group();fan.position.set(x,3.125,0);root.add(fan);fans.push(fan);
        cylinder(fan,steel,0,0,0,.105,.07,'y');for(let i=0;i<7;i++){const angle=i*Math.PI*2/7;const blade=box(fan,cast,Math.cos(angle)*.25,0,Math.sin(angle)*.25,.40,.025,.12,.012);blade.rotation.y=-angle+.22;}
        for(const zz of [-.30,-.15,0,.15,.30])rod(root,cast,[x-.39,3.17,zz],[x+.39,3.17,zz],.012);
    }
    for(const z of [-.35,.35]){cylinder(root,frame,-.18,3.26,z,.105,.43);ring(root,steel,-.18,3.48,z,.105,.014,'y');}

    // Narrow handrails, four corner stairways, lamps and air/coupler gear.
    for(const side of [-1,1]){
        for(const x of [-4.85,-3.6,-2.4,-1.2,0,1.2,2.4,3.6,4.85])rod(root,safety,[x,1.42,side*1.82],[x,2.24,side*1.82],.025);
        for(const y of [1.83,2.24])rod(root,safety,[-4.85,y,side*1.82],[4.85,y,side*1.82],.025);
        for(const end of [-1,1]){
            for(let j=0;j<4;j++)box(root,cast,end*(5.31-j*.055),.31+j*.27,side*1.78,.48,.065,.42,.01);
            rod(root,safety,[end*5.35,.57,side*1.90],[end*4.85,2.24,side*1.82],.028);
            cylinder(root,frame,end*5.30,2.52,side*.67,.18,.12,'x',24);
            cylinder(root,end>0?lens:tail,end*5.38,2.52,side*.67,.135,.025,'x',24);
        }
    }
    const hazard=hazardMaterial();
    for(const end of [-1,1]){
        box(root,frame,end*5.31,1.09,0,.23,.42,3.82,.025);
        const stripes=add(root,new THREE.PlaneGeometry(3.70,.34),hazard,end*5.435,1.09,0);stripes.rotation.y=end>0?Math.PI/2:-Math.PI/2;
        for(const z of [-1.05,1.05]){cylinder(root,frame,end*5.56,.94,z,.09,.28,'x');cylinder(root,steel,end*5.73,.94,z,.20,.07,'x',24);}
        box(root,cast,end*5.69,.86,0,.48,.28,.28,.035);box(root,steel,end*5.94,.87,.08,.10,.22,.27,.025);
        cylinder(root,steel,end*5.91,1.0,0,.034,.30);box(root,cast,end*5.96,.86,-.12,.08,.13,.16,.018);
        const hosePoints=[[end*5.42,1.03,.47],[end*5.57,.60,.51],[end*5.73,.43,.45],[end*5.79,.65,.35]].map(p=>new THREE.Vector3(...p));
        add(root,new THREE.TubeGeometry(new THREE.CatmullRomCurve3(hosePoints),16,.035,7),dark,0,0,0);
        box(root,safety,end*5.45,1.09,.48,.045,.10,.11,.012);
        for(const z of [-.39,.39])cylinder(root,frame,end*5.31,1.84,z,.095,.08,'x');
        if(end>0){
            for(const side of [-1,1]){
                const vertices=[5.81,.22,0,5.48,.22,side*1.62,5.45,.84,side*1.62,5.76,.84,0];
                const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));geometry.setIndex(side>0?[0,2,1,0,3,2]:[0,1,2,0,2,3]);geometry.computeVertexNormals();
                const m=add(root,geometry,frame,0,0,0);m.material=frame;
                rod(root,steel,[5.81,.22,0],[5.48,.22,side*1.62],.025);
            }
        }
    }
    root.userData.model='compact-diesel-shunter';root.userData.axles=4;root.userData.nominalEnvelope=[12,4,4.86];
    return {root,wheels,fans};
}

export function buildRailTrack(root,length,surfaces){
    const timber=material(surfaces,'timber','#625e4c',.94,.02),rail=material(surfaces,'rail','#9ba49a',.30,.85),web=material(surfaces,'rail-web','#606c64',.66,.75),clips=material(surfaces,'rail-clips','#3e4942',.8,.6);
    let ballast=surfaces.cache.get('diesel:ballast');
    if(!ballast){
        const c=document.createElement('canvas');c.width=c.height=512;const g=c.getContext('2d');g.fillStyle='#76776b';g.fillRect(0,0,512,512);let seed=71;const rand=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
        for(let i=0;i<6000;i++){const shade=Math.floor(65+rand()*91);g.fillStyle=`rgb(${shade},${shade+3},${shade-6})`;g.beginPath();g.ellipse(rand()*512,rand()*512,1+rand()*4,1+rand()*3,rand()*6.28,0,6.28);g.fill();}
        const map=new THREE.CanvasTexture(c);map.wrapS=map.wrapT=THREE.RepeatWrapping;map.repeat.set(length/3.5,1);map.colorSpace=THREE.SRGBColorSpace;map.anisotropy=4;ballast=new THREE.MeshStandardMaterial({map,roughness:1,metalness:0});ballast.userData.persistent=true;surfaces.cache.set('diesel:ballast',ballast);
    }
    const bed=new THREE.Mesh(new THREE.PlaneGeometry(length,3.6),ballast);bed.rotation.x=-Math.PI/2;bed.position.set(20,.009,12);bed.receiveShadow=true;root.add(bed);
    const box=(mat,x,y,z,w,h,d)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;root.add(m);return m;};
    for(const z of [11.28,12.72]){
        box(web,20,.095,z,length,.030,.16);box(web,20,.150,z,length,.080,.035);box(rail,20,.205,z,length,.030,.075);
    }
    for(let x=20-length/2+.25;x<20+length/2;x+=.58){
        box(timber,x,.04,12,.22,.08,2.6);
        for(const z of [11.28,12.72]){
            box(clips,x,.092,z,.28,.025,.29);
            for(const side of [-1,1]){
                box(clips,x,.128,z+side*.104,.12,.04,.04);
                const bolt=new THREE.Mesh(new THREE.CylinderGeometry(.023,.023,.022,6),rail);bolt.position.set(x,.116,z+side*.115);root.add(bolt);
            }
        }
    }
}
