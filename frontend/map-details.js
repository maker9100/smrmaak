/* Map-specific construction details, confined to existing solid footprints
 * or overhead clearance. Never introduces an invisible collision obstacle. */
import * as THREE from 'three';
export function enhanceLandmark(root,id,surfaces){
    if(!root||id==='railway')return;
    root.userData.detailRevision='landmarks-2';
    let count=0;
    const mesh=(geo,kind,tint,x,y,z)=>{const m=new THREE.Mesh(geo,surfaces.get(kind,tint));m.position.set(x,y,z);root.add(m);count++;return m;};
    const box=(x,y,z,w,h,d,k='metal',c='#819184')=>mesh(new THREE.BoxGeometry(w,h,d),k,c,x,y,z);
    const tube=(x,y,z,r,l,c='#8f9e8a',rotation=null)=>{const m=mesh(new THREE.CylinderGeometry(r,r,l,16),'metal',c,x,y,z);if(rotation)m.rotation.set(...rotation);return m;};
    const beam=(a,b,r=.025,c='#8f9e8a')=>{const start=new THREE.Vector3(...a),end=new THREE.Vector3(...b),m=tube(...start.clone().add(end).multiplyScalar(.5).toArray(),r,start.distanceTo(end),c);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),end.sub(start).normalize());return m;};
    const ring=(x,y,z,r,t=.025,c='#819184')=>{const m=mesh(new THREE.TorusGeometry(r,t,8,48),'metal',c,x,y,z);m.rotation.x=Math.PI/2;return m;};
    if(id==='freight'){
        // Twin plate girders, diagonal bracing, trolley wheels and hoist drum.
        for(const z of [11.55,12.45]){
            box(20,8.2,z,13,.16,.18,'paint','#b49d56');box(20,7.63,z,13,.13,.18,'paint','#b49d56');
            for(let i=0;i<13;i++)beam([13.7+i,7.68,z],[14.7+i,8.15,z],.045,'#af9654');
            for(const x of [19,21]){box(x,4,z,.14,7.7,.13,'metal','#6e7566');for(let y=.5;y<7.6;y+=.4)box(x,y,z,.52,.035,.08,'metal','#a39366');}
        }
        box(20,8.55,12,3.5,.12,1.8,'metal','#5f6c64');
        for(const z of [11.2,12.8]){beam([18.3,9.05,z],[21.7,9.05,z]);for(let x=18.3;x<=21.8;x+=.85)beam([x,8.55,z],[x,9.05,z]);}
        box(18.85,7.6,12.85,1.15,1.3,.85,'paint','#647f7e');
        for(const z of [12.40,13.30])box(18.85,7.8,z,.92,.65,.025,'glass','#536c70');
        box(18.85,8.3,12.85,1.3,.12,1,'metal','#7b8e80');
        tube(20.8,7.4,12,.32,1.15,'#3d4b48',[Math.PI/2,0,0]);
        for(const z of [11.85,12.15])beam([24,7.9,z],[24,3.7,z],.016,'#3e4640');
        for(const z of [11.65,12.35])tube(24,3.8,z,.25,.065,'#8b865a',[Math.PI/2,0,0]);
        for(const x of [19,21])box(x,.15,12,.8,.3,1.7,'metal','#6c7567');
    }else if(id==='foundry'){
        // Refractory furnace shell, rivet bands, insulated ducts and catwalk.
        for(let y=.6;y<4.6;y+=.52){box(20,y,10.12,3.65,.08,.07,'metal','#4e4a42');box(20,y,13.88,3.65,.08,.07,'metal','#4e4a42');}
        for(let y=3.8;y<9.6;y+=.48)ring(20,y,12,.735,.025,'#847864');
        for(const x of [18.25,21.75]){
            for(let y=.5;y<5.2;y+=.5)ring(x,y,12,.195,.025,'#a29375');
            box(x,2.7,10.28,.20,4.6,.15,'metal','#5b6257');
            for(let y=.5;y<4.9;y+=.3)box(x,y,10.16,.48,.035,.05,'metal','#8d927a');
        }
        for(const z of [10.15,13.85]){beam([18.12,5.65,z],[21.88,5.65,z]);beam([18.12,5.18,z],[21.88,5.18,z]);for(let x=18.12;x<22;x+=.75)beam([x,4.8,z],[x,5.65,z]);}
        tube(20,4.2,12,1.4,.22,'#6f6d5c');
        box(20,.22,10,3.3,.10,.24,'metal','#bfb284');
        for(let x=18.6;x<21.6;x+=.22){const m=box(x,.28,10,.11,.02,.2,'paint','#b99d58');m.rotation.y=.35;}
        for(const z of [10.08,13.92])for(const x of [18.55,21.45])tube(x,2,z,.07,1.4,'#5d5b4e');
        box(18.02,1.4,12,.05,1.5,.9,'metal','#5d6860');
        for(let j=0;j<6;j++)box(17.99,1+j*.14,12,.02,.035,.7,'metal','#959984');
    }else if(id==='plaza'){
        // Masonry courses, cornices, recessed glazing and copper roof seams.
        for(let y=.5;y<5.4;y+=.42)for(const z of [10.49,13.51])box(20,y,z,3,.014,.012,'stone','#8b8674');
        for(const x of [18.59,21.41])for(const z of [10.59,13.41])box(x,2.8,z,.18,5.1,.18,'stone','#d2c8ad');
        for(const y of [.42,5.25,5.7,8.42])box(20,y,12,y>6?2.65:3.35,.13,y>6?2.65:3.35,'stone','#c7bda3');
        for(const z of [10.48,13.52]){
            box(20,2.4,z,.77,1.5,.028,'glass','#465b59');
            for(const x of [19.56,20.44])box(x,2.4,z,.10,1.7,.13,'stone','#d0c4a7');
            box(20,3.22,z,1.03,.13,.16,'stone','#d0c4a7');box(20,1.59,z,1.03,.13,.18,'stone','#d0c4a7');
            box(20,2.4,z,.05,1.5,.05,'metal','#767c69');
        }
        for(let i=0;i<4;i++){
            const yaw=i*Math.PI/2,dir=new THREE.Vector3(Math.sin(yaw),0,Math.cos(yaw));
            beam([20,10.3,12],[20+dir.x*1.55,8.35,12+dir.z*1.55],.024,'#8c9c81');
        }
        for(const z of [10.72,13.28])box(20,7.2,z,2.4,.035,.04,'metal','#ad9e73');
    }else if(id==='observatory'){
        // Segmented dome, shutter aperture, equatorial mount and service panels.
        for(let i=0;i<16;i++){
            const yaw=i*Math.PI/8,points=[];for(let j=0;j<=16;j++){const t=j/16*Math.PI/2;points.push(new THREE.Vector3(20+Math.cos(yaw)*1.858*Math.sin(t),3.4+1.858*Math.cos(t),12+Math.sin(yaw)*1.858*Math.sin(t)));}
            mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),20,.014,5),'metal','#839aa3',0,0,0);
        }
        ring(20,3.42,12,1.87,.045,'#788d97');ring(20,3.55,12,1.86,.03,'#8b9da3');
        const dark=box(20,4.66,12.8,.67,1.25,.08,'rubber','#1c303b');dark.rotation.x=-.55;
        for(const x of [19.60,20.40]){const m=box(x,4.69,12.79,.07,1.34,.09,'metal','#bbc8c9');m.rotation.x=-.55;}
        const scopeRing=ring(21.02,6.4,12,.45,.045,'#718897');scopeRing.rotation.set(0,0,-.7);
        tube(20.2,4.7,12,.59,.2,'#6b8292',[0,0,-.7]);
        box(20,1.17,10.08,.85,2.1,.045,'paint','#6c8590');
        box(20.30,1.18,10.04,.04,.16,.06,'metal','#b8c5b9');
        for(const x of [18.42,21.58]){
            box(x,1.2,10.07,.38,.55,.04,'metal','#627e8b');
            for(let j=0;j<5;j++)box(x,1+j*.1,10.03,.32,.025,.035,'metal','#a8b9bd');
        }
        for(const z of [10.15,13.85])for(let x=18.15;x<22;x+=.74){beam([x,3.0,z],[x,3.62,z],.017,'#809aa5');}
        for(const z of [10.15,13.85])beam([18.15,3.62,z],[21.85,3.62,z],.02,'#809aa5');
    }
    root.userData.detailParts=count;
}
