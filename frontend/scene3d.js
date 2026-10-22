/* Cheat FPS 0.2.6 — local, instanced 3D renderer. Build instructions in README.
 * No remote models, textures or runtime CDNs are required. */
import * as THREE from 'three';
const TAU=Math.PI*2, lerp=(a,b,t)=>a+(b-a)*t;
const box=new THREE.BoxGeometry(1,1,1), sphere=new THREE.SphereGeometry(1,10,7), cylinder=new THREE.CylinderGeometry(1,1,1,10);
const transform=new THREE.Object3D(), color=new THREE.Color();
class Batch {
    constructor(scene,geometry,capacity,material){
        this.mesh=new THREE.InstancedMesh(geometry,material,capacity);this.mesh.count=0;this.items=[];
        this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);this.mesh.frustumCulled=false;scene.add(this.mesh);
    }
    add(matrix,tint){let i=this.mesh.count++;this.mesh.setMatrixAt(i,matrix);this.mesh.setColorAt(i,color.set(tint));}
    commit(){this.mesh.instanceMatrix.needsUpdate=true;if(this.mesh.instanceColor)this.mesh.instanceColor.needsUpdate=true;}
}
function material(tint){return new THREE.MeshLambertMaterial({color:tint});}
function part(root,geometry,tint,x,y,z,sx,sy,sz,records){
    const node=new THREE.Object3D();node.position.set(x,y,z);node.scale.set(sx,sy,sz);root.add(node);records.push({node,geometry,tint});return node;
}
function joint(parent,x,y,z){const g=new THREE.Group();g.position.set(x,y,z);parent.add(g);return g;}
function actor(player){
    const root=new THREE.Group(),records=[],team=player.team?'#ed785f':'#58c4ea';
    const suit=player.skin==='rogue'?'#344348':player.skin==='warden'?'#69756b':'#6c7f87';
    const plate=player.skin==='rogue'?'#263338':'#394f54',skin='#bf967c',dark='#1c2a30';
    const width=player.skin==='warden'?1.14:player.skin==='rogue'?.94:1;
    const add=(parent,g,c,x,y,z,sx,sy,sz)=>part(parent,g,c,x,y,z,sx,sy,sz,records);
    const body=joint(root,0,.94,0);
    add(body,'box',suit,0,.27,0,.48*width,.55,.28);
    add(body,'box',plate,0,.32,.16,.44*width,.38,.09);
    add(body,'box',team,0,.48,.214,.36,.045,.018);
    add(body,'box',dark,0,0,.01,.5*width,.1,.3);
    add(body,'box','#8b9487',0,0,.175,.09,.07,.025);
    for(const x of [-.14,0,.14])add(body,'box','#59695b',x,.15,.22,.10,.14,.10);
    add(body,'box','#3a4b43',0,.29,-.21,.34,.44,.15);
    const head=joint(body,0,.64,0);
    add(head,'sphere',skin,0,.09,.015,.16,.20,.15);
    add(head,'sphere',plate,0,.18,-.015,.182,.148,.178);
    add(head,'box',dark,0,.11,.151,.27,.075,.035);
    add(head,'box',team,0,.115,.172,.22,.025,.008);
    add(head,'box','#4c615e',-.176,.07,0,.045,.11,.11);
    if(player.skin==='warden'){
        add(head,'box',plate,0,-.04,.13,.23,.10,.09);
        add(body,'box','#7e8b7b',0,.34,.22,.22,.21,.08);
    }else if(player.skin==='rogue'){
        add(head,'sphere',suit,0,.18,-.07,.205,.19,.17);
        add(head,'box',suit,0,-.05,.135,.27,.10,.09);
    }else add(head,'box',plate,0,.19,.12,.34,.035,.24);
    const legs=[];
    for(const side of [-1,1]){
        const leg=joint(root,side*.145,.91,0),knee=joint(leg,0,-.42,0);legs.push({leg,knee});
        add(leg,'box',suit,0,-.20,0,.19,.40,.22);
        add(knee,'box',suit,0,-.17,0,.165,.35,.19);
        add(knee,'box',plate,0,.015,.12,.18,.16,.055);
        add(knee,'box',dark,0,-.36,.07,.21,.13,.34);
        add(knee,'box','#687675',0,-.405,.075,.215,.035,.35);
        const arm=joint(body,side*.34*width,.44,.015);arm.rotation.x=-.62;
        add(arm,'box',suit,0,-.15,0,.18,.30,.20);
        add(arm,'box',plate,0,-.015,0,.23,.16,.25);
        add(arm,'box',team,side*.121,-.04,0,.012,.075,.14);
        const forearm=joint(arm,0,-.3,0);forearm.rotation.x=-.95;
        add(forearm,'box',suit,0,-.13,0,.145,.27,.16);
        add(forearm,'sphere',dark,0,-.28,0,.09,.105,.085);
    }
    const rifle=joint(body,.18,.22,.34);
    add(rifle,'box',dark,0,0,.05,.13,.15,.44);
    add(rifle,'box','#566a68',0,.065,.1,.11,.045,.44);
    add(rifle,'box',dark,0,-.12,.02,.085,.18,.11);
    add(rifle,'box',dark,0,.075,.14,.055,.09,.08);
    const barrel=add(rifle,'cylinder','#323d41',0,.02,.44,.033,.40,.033);barrel.rotation.x=Math.PI/2;
    add(rifle,'box',team,.072,.01,.04,.015,.05,.09);
    return {root,body,head,legs,records,phase:0,lastX:player.x,lastY:player.y,skin:player.skin,team:player.team};
}
export class CheatRenderer3D {
    constructor(canvas){
        this.canvas=canvas;this.renderer=new THREE.WebGLRenderer({canvas,alpha:false,antialias:false,powerPreference:'high-performance'});
        this.renderer.outputColorSpace=THREE.SRGBColorSpace;this.renderer.autoClear=false;
        this.renderer.setClearColor('#adc5ca');this.scene=new THREE.Scene();this.scene.fog=new THREE.Fog('#adc5ca',35,110);
        this.scene.add(new THREE.HemisphereLight('#e6f4ff','#52664d',2));
        const sun=new THREE.DirectionalLight('#ffddaa',2.2);sun.position.set(-7,16,9);this.scene.add(sun);
        this.camera=new THREE.PerspectiveCamera(60,1,.045,160);this.actors=new Map();this.mapKey='';this.staticRoot=new THREE.Group();this.scene.add(this.staticRoot);
        const actorMaterial=new THREE.MeshLambertMaterial({color:'white'});
        this.batches={box:new Batch(this.scene,box,360,actorMaterial),sphere:new Batch(this.scene,sphere,96,actorMaterial),cylinder:new Batch(this.scene,cylinder,40,actorMaterial)};
        this.weaponScene=new THREE.Scene();this.weaponScene.add(new THREE.HemisphereLight('#dfefff','#4b6256',2.2));
        const light=new THREE.DirectionalLight('#ffe5b9',2);light.position.set(-2,4,3);this.weaponScene.add(light);
        this.weaponCamera=new THREE.PerspectiveCamera(58,1,.01,10);this.weapon=new THREE.Group();this.weaponScene.add(this.weapon);this.createRifle();
        this.lastTime=0;this.width=1;this.height=1;this.scale=1;
        canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();this.lost=true;});
        canvas.addEventListener('webglcontextrestored',()=>{this.lost=false;});
    }
    createRifle(){
        const mesh=(geo,tint,x,y,z,sx,sy,sz)=>{const m=new THREE.Mesh(geo,material(tint));m.position.set(x,y,z);m.scale.set(sx,sy,sz);this.weapon.add(m);return m;};
        mesh(box,'#24373f',0,0,0,.13,.14,.42);
        mesh(box,'#667a78',0,.045,-.19,.105,.09,.30);
        mesh(box,'#26383e',0,-.03,.30,.115,.14,.23);
        mesh(box,'#102329',0,-.12,.065,.075,.22,.09).rotation.x=-.16;
        mesh(box,'#3a5053',0,-.14,-.08,.085,.21,.13).rotation.x=.12;
        const barrel=mesh(cylinder,'#233038',0,.018,-.51,.025,.37,.025);barrel.rotation.x=Math.PI/2;
        const muzzle=mesh(cylinder,'#6e7e7a',0,.018,-.705,.032,.065,.032);muzzle.rotation.x=Math.PI/2;
        mesh(box,'#1e2f35',0,.105,-.03,.045,.04,.10);
        mesh(box,'#91ad9e',-.026,.155,-.03,.013,.065,.035);mesh(box,'#91ad9e',.026,.155,-.03,.013,.065,.035);
        mesh(box,'#91ad9e',0,.185,-.03,.065,.012,.035);mesh(box,'#344b50',0,.139,-.36,.022,.08,.03);mesh(box,'#c8ff66',0,.178,-.36,.014,.02,.022);
        for(let i=0;i<8;i++)mesh(box,'#25373e',0,.098,-.34+i*.044,.115,.012,.018);
        for(const x of [-.07,.07])mesh(box,'#9bb09c',x,0,-.02,.014,.05,.09);
        mesh(sphere,'#455f4d',.08,-.13,.14,.08,.11,.10);
        mesh(box,'#647566',.13,-.25,.23,.14,.28,.18).rotation.z=.32;
        mesh(sphere,'#455f4d',-.06,-.09,-.27,.085,.07,.09);
        mesh(box,'#647566',-.14,-.22,-.18,.14,.29,.16).rotation.z=-.43;
        const flashMaterial=new THREE.MeshBasicMaterial({color:'#fff2ae',transparent:true,opacity:.88,depthWrite:false});
        this.flash=new THREE.Mesh(new THREE.SphereGeometry(1,6,4),flashMaterial);this.flash.position.set(0,.018,-.79);this.flash.scale.set(.045,.045,.15);this.weapon.add(this.flash);
    }
    loadMap(map,theme={}){
        const key=map.join('');if(this.mapKey===key&&this.arenaId===theme.id)return;this.mapKey=key;this.arenaId=theme.id;
        const W=this.mapWidth=map[0].length,D=this.mapDepth=map.length;
        this.renderer.setClearColor(theme.sky||'#adc5ca');this.scene.fog.color.set(theme.sky||'#adc5ca');
        this.staticRoot.traverse(o=>{if(o.isMesh){if(![box,sphere,cylinder].includes(o.geometry))o.geometry.dispose();o.material.map?.dispose();o.material.dispose();if(o.isInstancedMesh)o.dispose();}});
        this.staticRoot.clear();this.trainRoot=null;this.trainWheels=[];this.trackLights=[];
        const solid=map.join('').split('1').length-1,wallBatch=new Batch(this.staticRoot,box,solid*7+80,material('white'));
        const block=(x,y,z,sx,sy,sz,tint)=>{transform.position.set(x,y,z);transform.rotation.set(0,0,0);transform.scale.set(sx,sy,sz);transform.updateMatrix();wallBatch.add(transform.matrix,tint);};
        for(let z=0;z<D;z++)for(let x=0;x<W;x++){
            if(map[z][x]!=='1')continue;
            const bounds=theme.landmark_bounds,central=bounds&&x>=bounds[0]&&x<bounds[0]+bounds[2]&&z>=bounds[1]&&z<bounds[1]+bounds[3];
            if(central&&theme.id!=='freight')continue;
            const border=x===0||z===0||x===W-1||z===D-1,h=border?3.8:2.6,accent=theme.accent||'#829277';
            block(x+.5,h/2,z+.5,1,h,1,theme.wall||'#788a7c');
            block(x+.5,h-.13,z+.5,1.015,.22,1.015,'#9aa58c');
            block(x+.5,.12,z+.5,1.025,.24,1.025,'#374c51');
            block(x+.5,h*.64,z+.5,1.01,.12,1.01,accent);
            if(!border){block(x+.06,h/2,z+.5,.06,h-.2,1.02,'#596c67');block(x+.5,h/2,z+.06,1.02,h-.2,.06,'#596c67');}
            if(border&&x%6===0){block(x+.5,h/2,z+.5,.16,h,1.025,'#344e57');block(x+.5,h-.6,z+.5,.6,.12,1.03,'#d3dfb3');}
        }
        const image=document.createElement('canvas');image.width=image.height=128;const g=image.getContext('2d');
        g.fillStyle=theme.floor||'#70847b';g.fillRect(0,0,128,128);g.strokeStyle='#809088';g.lineWidth=2;g.strokeRect(0,0,128,128);
        g.strokeStyle='#637970';g.lineWidth=1;for(let n=16;n<128;n+=16){g.beginPath();g.moveTo(n,0);g.lineTo(n,128);g.stroke();}
        const texture=new THREE.CanvasTexture(image);texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.repeat.set(W/2,D/2);texture.colorSpace=THREE.SRGBColorSpace;
        const floor=new THREE.Mesh(new THREE.PlaneGeometry(W,D),new THREE.MeshLambertMaterial({map:texture}));floor.rotation.x=-Math.PI/2;floor.position.set(W/2,-.015,D/2);this.staticRoot.add(floor);
        for(const [x,tint] of [[5.5,'#68c4df'],[W-5.5,'#ef8b6a']]){
            for(const z of [9.5,17.5,25.5]){block(x,.008,z,2,.012,.06,tint);block(x,.008,z,.06,.012,2,tint);}
            block(x,.009,D/2,.10,.014,D-8,tint);
        }
        wallBatch.commit();
        for(const [z,rotation] of [[1.015,0],[D-1.015,Math.PI]]){
            const sign=document.createElement('canvas');sign.width=1024;sign.height=192;const q=sign.getContext('2d');
            q.fillStyle='#263d44';q.fillRect(0,0,1024,192);q.fillStyle='#cee58b';q.font='bold 55px sans-serif';q.textAlign='center';q.fillText((theme.id||'ARENA').toUpperCase(),512,92);q.font='22px sans-serif';q.fillStyle='#a4bab8';q.fillText('60 x 35 m',512,146);
            const tex=new THREE.CanvasTexture(sign);tex.colorSpace=THREE.SRGBColorSpace;
            const panel=new THREE.Mesh(new THREE.PlaneGeometry(9,1.7),new THREE.MeshBasicMaterial({map:tex}));panel.position.set(W/2,2.55,z);panel.rotation.y=rotation;this.staticRoot.add(panel);
        }
        this.landmark(theme.id||'freight');
    }
    landmark(id){
        const group=new THREE.Group();group.name='landmark-'+id;group.position.set(this.mapWidth/2-20,0,this.mapDepth/2-12);this.staticRoot.add(group);
        const add=(geometry,tint,x,y,z)=>{const m=new THREE.Mesh(geometry,material(tint));m.position.set(x,y,z);group.add(m);return m;};
        const cube=(c,x,y,z,w,h,d)=>add(new THREE.BoxGeometry(w,h,d),c,x,y,z);
        const tube=(c,x,y,z,r,h)=>add(new THREE.CylinderGeometry(r,r,h,12),c,x,y,z);
        if(id==='freight'){
            // Both supports stand inside the central blocked 4 x 5 m area.
            cube('#d6a24a',19,4,12,.38,8,.42);cube('#d6a24a',21,4,12,.38,8,.42);
            cube('#dfb653',20,8,12,13,.5,.7);cube('#4a6268',20,7.5,12,3,1.2,1.2);
            cube('#2d3a3e',24,5.7,12,.045,4.5,.045);tube('#cda347',24,3.4,12,.17,.45);
            for(let i=0;i<8;i++){const b=cube('#b4893d',15+i*1.4,7.6,12,.09,1.1,.09);b.rotation.z=i%2?.65:-.65;}
        }else if(id==='foundry'){
            cube('#473e39',20,.12,12,4,.24,5);cube('#473e39',20,2.4,12,3.7,4.8,3.7);tube('#6c6158',20,6.4,12,.72,6);
            tube('#3d3b38',20,9.6,12,.95,.38);
            for(const z of [10.12,13.88]){const glow=cube('#ff9c31',20,2,z,2.5,1.1,.04);glow.material.dispose();glow.material=new THREE.MeshBasicMaterial({color:'#ff9829'});}
            for(const x of [18.25,21.75])tube('#aa734a',x,2.7,12,.18,5.4);
            cube('#dd9f44',20,4.7,12,4,.17,4);
        }else if(id==='plaza'){
            cube('#b9ac8d',20,.15,12,4,.3,5);cube('#b9ac8d',20,2.7,12,3,5.4,3);cube('#6b6255',20,5.6,12,3.4,.3,3.4);
            cube('#d3c3a1',20,7,12,2.5,2.8,2.5);
            const roof=add(new THREE.ConeGeometry(2.2,2,4),'#557a73',20,9.3,12);roof.rotation.y=Math.PI/4;
            tube('#c7ac60',20,10.7,12,.045,1.1);
            for(let i=0;i<4;i++){
                const face=new THREE.Group();face.position.set(20,7.2,12);face.rotation.y=i*Math.PI/2;group.add(face);
                const dial=new THREE.Mesh(new THREE.CylinderGeometry(.88,.88,.05,32),material('#e5dfb6'));dial.rotation.x=Math.PI/2;dial.position.z=1.27;face.add(dial);
                const hand=new THREE.Mesh(new THREE.BoxGeometry(.07,.64,.06),material('#273a3c'));hand.position.set(0,.23,1.32);hand.rotation.z=-.45;face.add(hand);
                const short=new THREE.Mesh(new THREE.BoxGeometry(.5,.07,.06),material('#273a3c'));short.position.set(.17,0,1.33);face.add(short);
                for(let j=0;j<12;j++){const mark=new THREE.Mesh(new THREE.BoxGeometry(.045,.10,.04),material('#273a3c'));mark.position.set(Math.sin(j*Math.PI/6)*.72,Math.cos(j*Math.PI/6)*.72,1.32);mark.rotation.z=-j*Math.PI/6;face.add(mark);}
            }
        }else if(id==='observatory'){
            cube('#d1dce0',20,.12,12,4,.24,5);cube('#d1dce0',20,1.7,12,3.8,3.4,3.8);
            add(new THREE.SphereGeometry(1.85,24,12,0,Math.PI*2,0,Math.PI/2),'#b9ccd3',20,3.4,12);
            const scope=tube('#3e637e',20,5.2,12,.38,3.3);scope.rotation.z=-.7;
            const lens=tube('#7dd5e9',21.08,6.48,12,.43,.12);lens.rotation.z=-.7;
            cube('#263f59',20,3.45,12,.14,.1,3.9);
            tube('#95aab9',18.3,3.8,10.3,.055,7.6);
        }else if(id==='railway'){
            const before=new Set(group.children);
            cube('#444e45',20,.15,12,12,.3,4);cube('#54705d',20,1.2,12,11.8,1.1,3.7);
            const boiler=tube('#425b4b',21,2.65,12,.82,7.3);boiler.rotation.z=Math.PI/2;
            cube('#35473e',16.8,3.4,12,2.7,2.5,3.3);cube('#bbccbf',16.8,3.6,10.32,1.5,.9,.05);cube('#bbccbf',16.8,3.6,13.68,1.5,.9,.05);
            cube('#5b6b58',16.8,4.76,12,3.2,.2,3.7);const lamp=tube('#ffe3a0',25.93,2.2,12,.24,.12);lamp.rotation.z=Math.PI/2;tube('#3d4941',23.5,4,12,.28,1.6);
            for(const x of [16,18,20,22,24])for(const z of [10.08,13.92]){
                const pivot=new THREE.Group();pivot.position.set(x,.8,z);group.add(pivot);this.trainWheels.push(pivot);
                const w=new THREE.Mesh(new THREE.CylinderGeometry(.48,.48,.17,12),material('#252f30'));w.rotation.x=Math.PI/2;pivot.add(w);
                const spoke=new THREE.Mesh(new THREE.BoxGeometry(.73,.065,.19),material('#a8b3a0'));pivot.add(spoke);
            }
            this.trainRoot=new THREE.Group();this.trainRoot.name='moving-train';
            for(const mesh of [...group.children])if(!before.has(mesh))this.trainRoot.add(mesh);
            group.add(this.trainRoot);this.trainRoot.visible=false;
            for(const z of [10.4,13.6])cube('#a2aaa0',20,.04,z,this.mapWidth,.08,.08);
            for(let x=20-this.mapWidth/2;x<20+this.mapWidth/2;x+=1.5)cube('#635d48',x,.015,12,.22,.025,3.8);
            for(const z of [9.7,14.3])for(let x=21-this.mapWidth/2;x<20+this.mapWidth/2;x+=1){
                const stripe=cube(x%2?'#edb44c':'#343a32',x,.025,z,.8,.04,.20);stripe.rotation.y=.35;
            }
            for(const x of [23-this.mapWidth/2,17+this.mapWidth/2])for(const z of [9,15]){
                tube('#49594e',x,1.3,z,.07,2.6);cube('#273a34',x,2.6,z,.45,.7,.25);
                const lamp=add(new THREE.SphereGeometry(.15,10,8),'#6c3129',x,2.7,z-.17);
                lamp.material.dispose();lamp.material=new THREE.MeshBasicMaterial({color:'#6c3129'});this.trackLights.push(lamp);
            }
        }
    }
    updateTrain(train){
        if(!this.trainRoot)return;
        this.trainRoot.visible=!!train?.active;
        if(train){
            this.trainRoot.position.x=train.x-this.mapWidth/2;
            for(const wheel of this.trainWheels)wheel.rotation.z=-train.x/.48;
        }
        const flash=train&&(train.warning||train.active)&&Math.floor(train.elapsed*5)%2===0;
        for(const lamp of this.trackLights)lamp.material.color.set(flash?'#ff442e':'#6c3129');
    }
    resize(w,h,quality){
        const scale=Math.min(devicePixelRatio||1,quality===2?1.5:quality===4?1:.75,1600/Math.max(w,h));
        if(this.width!==w||this.height!==h||this.scale!==scale){this.width=w;this.height=h;this.scale=scale;this.renderer.setPixelRatio(scale);this.renderer.setSize(w,h,false);}
    }
    begin(roster,now){
        if(this.lost)return;
        const dt=Math.min(.1,(now-(this.lastTime||now))/1000);this.lastTime=now;
        for(const p of roster){
            let a=this.actors.get(p.id);
            if(!a||a.skin!==p.skin||a.team!==p.team){a=actor(p);this.actors.set(p.id,a);}
            const distance=Math.hypot(p.x-a.lastX,p.y-a.lastY);a.lastX=p.x;a.lastY=p.y;
            if(distance<2)a.phase+=distance*3;
            const speed=Math.min(1,Math.hypot(p.vx||0,p.vy||0)/7.2),step=Math.sin(a.phase)*.52*speed;
            a.root.position.set(p.x,0,p.y);a.root.rotation.y=Math.PI/2-p.yaw;
            a.body.position.y=.94+Math.abs(Math.sin(a.phase))*speed*.018;
            a.head.rotation.x=-(p.pitch||0)*.45;
            a.legs.forEach(({leg,knee},i)=>{leg.rotation.x=(i?1:-1)*step;knee.rotation.x=Math.max(0,(i?-1:1)*step)*.65;});
            a.root.updateMatrixWorld(true);a.hp=p.hp;
        }
        for(const id of this.actors.keys())if(!roster.some(p=>p.id===id))this.actors.delete(id);
        this.renderer.setScissorTest(false);this.renderer.clear();this.renderer.setScissorTest(true);
    }
    render(p,rect,fov,now,fx){
        if(this.lost)return;
        const r=this.renderer;r.setViewport(rect.x,this.height-rect.y-rect.h,rect.w,rect.h);r.setScissor(rect.x,this.height-rect.y-rect.h,rect.w,rect.h);
        const camera=this.camera,pitch=p.pitch||0,aspect=rect.w/rect.h;
        // A stable vertical FOV avoids a telescope view in tall split panes.
        const vertical=Math.max(56,Math.min(82,2*Math.atan(Math.tan(fov/2)/aspect)*180/Math.PI));
        camera.aspect=aspect;camera.fov=vertical*(fov<1?.88:1);camera.updateProjectionMatrix();
        camera.position.set(p.x,1.5,p.y);camera.lookAt(p.x+Math.cos(p.yaw)*Math.cos(pitch),1.5+Math.sin(pitch),p.y+Math.sin(p.yaw)*Math.cos(pitch));camera.updateMatrixWorld();
        for(const batch of Object.values(this.batches))batch.mesh.count=0;
        for(const [id,a] of this.actors){if(id===p.id||a.hp<=0)continue;for(const part of a.records)this.batches[part.geometry].add(part.node.matrixWorld,part.tint);}
        for(const batch of Object.values(this.batches))batch.commit();
        r.render(this.scene,camera);
        if(p.hp>0){
            const shot=now-(fx?.shotAt||0),moving=Math.min(1,Math.hypot(p.vx||0,p.vy||0)/7.2),stride=p.stride||now*.008;
            const ads=fov<1,reload=p.reload>0?Math.sin(p.reload/1.5*Math.PI):0,kick=p.cheats.recoil?0:Math.max(0,1-shot/110);
            this.weapon.position.set((ads?0:.23)+Math.sin(stride)*moving*.008,-.20-Math.abs(Math.cos(stride))*moving*.007-reload*.18,(ads?-.40:-.49)+kick*.05);
            this.weapon.rotation.set(kick*.055+reload*.35,reload*-.45,reload*-.45);
            this.flash.visible=shot>=0&&shot<65;
            this.weaponCamera.aspect=aspect;this.weaponCamera.fov=2*Math.atan(Math.tan(58*Math.PI/360)/Math.min(1,aspect))*180/Math.PI;this.weaponCamera.updateProjectionMatrix();r.clearDepth();r.render(this.weaponScene,this.weaponCamera);
        }
    }
    preview(now){
        if(this.lost)return;
        this.begin([],now);
        for(const batch of Object.values(this.batches)){batch.mesh.count=0;batch.commit();}
        const r=this.renderer;r.setViewport(0,0,this.width,this.height);r.setScissor(0,0,this.width,this.height);
        const angle=now*.000018,c=this.camera;c.aspect=this.width/this.height;c.fov=62;c.updateProjectionMatrix();
        c.position.set(this.mapWidth/2+25*Math.cos(angle),26,this.mapDepth/2+16*Math.sin(angle));c.lookAt(this.mapWidth/2,3.5,this.mapDepth/2);c.updateMatrixWorld();
        r.render(this.scene,c);
    }
    project(q,rect){
        const foot=new THREE.Vector3(q.x,.03,q.y).project(this.camera),head=new THREE.Vector3(q.x,2.02,q.y).project(this.camera);
        if(head.z>1||head.z< -1)return null;
        return {x:(head.x+1)*rect.w/2,top:(1-head.y)*rect.h/2,bottom:(1-foot.y)*rect.h/2};
    }
}
window.CheatRenderer3D=CheatRenderer3D;
