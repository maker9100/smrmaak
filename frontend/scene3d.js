/* Cheat FPS 0.4.0 — local, instanced 3D renderer. Build instructions in README.
 * No remote models, textures or runtime CDNs are required. */
import * as THREE from 'three';
import {CombatEffects} from './combat-effects.js';
import {environment,machinery,animateMachinery} from './environment.js';
import {buildOperator,animateOperator,operatorGeometries} from './operators.js';
import {buildFirearm,animateFirearm,detailFirearm} from './firearms.js';
import {enhanceLandmark} from './map-details.js';
import {buildDieselLocomotive,buildRailTrack} from './locomotive.js';
import {Surfaces,roundedBox,capsule,skyTexture,contactTexture,buildWorld,mergeStatic} from './graphics.js';
let surfaces;
const TAU=Math.PI*2, lerp=(a,b,t)=>a+(b-a)*t;
const box=roundedBox,sphere=new THREE.SphereGeometry(1,20,14),cylinder=new THREE.CylinderGeometry(1,1,1,16);
const geometries={box,sphere,cylinder,capsule,...operatorGeometries};for(const g of Object.values(geometries))g.userData.shared=true;
const transform=new THREE.Object3D(), color=new THREE.Color();
class Batch {
    constructor(scene,geometry,capacity,material){
        this.mesh=new THREE.InstancedMesh(geometry,material,capacity);this.mesh.count=0;this.items=[];
        this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);this.mesh.frustumCulled=false;this.mesh.castShadow=false;this.mesh.receiveShadow=true;scene.add(this.mesh);
    }
    add(matrix,tint){let i=this.mesh.count++;if(i>=this.mesh.instanceMatrix.count)throw Error('Character instance buffer full');this.mesh.setMatrixAt(i,matrix);this.mesh.setColorAt(i,color.set(tint));}
    commit(){this.mesh.instanceMatrix.needsUpdate=true;if(this.mesh.instanceColor)this.mesh.instanceColor.needsUpdate=true;}
}
function material(tint){return surfaces.get('metal',tint);}
function part(root,geometry,tint,x,y,z,sx,sy,sz,records){
    const node=new THREE.Object3D();node.position.set(x,y,z);node.scale.set(sx,sy,sz);root.add(node);const surface=tint==='#bf967c'?'skin':['#1c2a30','#323d41','#263338','#394f54'].includes(tint)?'metal':'fabric';records.push({node,geometry,tint,surface});return node;
}
function joint(parent,x,y,z){const g=new THREE.Group();g.position.set(x,y,z);parent.add(g);return g;}
function actor(player){return buildOperator(player,part,joint);}
export class CheatRenderer3D {
    constructor(canvas){
        // High quality supersamples via pixel ratio; avoid a multisample
        // framebuffer on every mobile/split view at the default quality.
        this.canvas=canvas;this.renderer=new THREE.WebGLRenderer({canvas,alpha:false,antialias:false,powerPreference:'high-performance'});
        this.renderer.outputColorSpace=THREE.SRGBColorSpace;this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.1;this.renderer.autoClear=false;
        this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;this.renderer.shadowMap.autoUpdate=false;
        this.surfaces=surfaces=new Surfaces(this.renderer);this.scene=new THREE.Scene();this.scene.fog=new THREE.FogExp2('#b6beb7',.009);
        this.ambient=new THREE.HemisphereLight('#c7d8e1','#687562',1.9);this.scene.add(this.ambient);
        this.sun=new THREE.DirectionalLight('#ffe0b0',3);this.sun.position.set(10,45,4);this.sun.target.position.set(30,0,17.5);this.scene.add(this.sun,this.sun.target);this.sun.castShadow=true;
        Object.assign(this.sun.shadow.camera,{left:-43,right:43,top:34,bottom:-34,near:.5,far:120});this.sun.shadow.bias=-.00012;this.sun.shadow.normalBias=.04;this.sun.shadow.radius=2;
        this.camera=new THREE.PerspectiveCamera(60,1,.045,190);this.actors=new Map();this.mapKey='';this.staticRoot=new THREE.Group();this.scene.add(this.staticRoot);this.batches={};this.skies=new Map();
        this.weaponScene=new THREE.Scene();this.weaponScene.add(new THREE.HemisphereLight('#dfebee','#68775c',2.2));
        const light=new THREE.DirectionalLight('#ffe3b8',2.2);light.position.set(-2,4,3);this.weaponScene.add(light);
        this.weaponCamera=new THREE.PerspectiveCamera(58,1,.01,10);this.weapon=new THREE.Group();this.weaponScene.add(this.weapon);this.createRifle();
        this.weaponModels={rifle:{root:this.weapon,flash:this.flash,light:this.muzzleLight}};
        for(const key of ['shotgun','pistol']){const model=buildFirearm(key,this.surfaces);this.weaponModels[key]=model;model.root.visible=false;this.weaponScene.add(model.root);}
        for(const [key,model] of Object.entries(this.weaponModels))detailFirearm(model,key,this.surfaces);
        this.prepareReflections();this.localLights=[];this.quality=0;this.lastShadow=-1000;this.shadowDirty=true;this.setQuality(4);
        const shadowMat=new THREE.MeshBasicMaterial({map:contactTexture(),transparent:true,depthWrite:false,opacity:.65});
        this.actorShadows=new THREE.InstancedMesh(new THREE.PlaneGeometry(1.1,1.1),shadowMat,6);this.actorShadows.count=0;this.actorShadows.frustumCulled=false;this.scene.add(this.actorShadows);
        this.combatEffects=new CombatEffects(this.scene);this.lastTime=0;this.width=1;this.height=1;this.scale=1;this.weaponSway=new Map();this.autoScale=1;this.frameCounter=0;this.frameBudget=32;
        canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();this.lost=true;});
        canvas.addEventListener('webglcontextrestored',()=>{this.prepareReflections();this.shadowDirty=true;this.lost=false;});
    }
    prepareReflections(){
        const sky=skyTexture('freight'),pmrem=new THREE.PMREMGenerator(this.renderer);this.environmentTarget?.dispose();this.environmentTarget=pmrem.fromEquirectangular(sky);sky.dispose();pmrem.dispose();this.scene.environment=this.weaponScene.environment=this.environmentTarget.texture;
    }
    setQuality(quality){
        if(this.quality===quality)return;this.quality=quality;this.autoScale=1;this.frameCounter=0;this.frameBudget=32;this.renderer.shadowMap.enabled=quality!==6;
        const size=quality===2?2048:1024;if(this.sun.shadow.mapSize.x!==size){this.sun.shadow.map?.dispose();this.sun.shadow.map=null;this.sun.shadow.mapSize.set(size,size);}this.surfaces.quality(quality);this.shadowDirty=true;
        for(const light of this.localLights||[])light.visible=quality!==6;
        for(const batch of Object.values(this.batches))batch.mesh.castShadow=quality===2;
    }
    createRifle(){
        this.rifleSupport=new THREE.Group();this.rifleMagazineGroup=new THREE.Group();this.weapon.add(this.rifleSupport,this.rifleMagazineGroup);
        const mesh=(geo,tint,x,y,z,sx,sy,sz)=>{const kind=['#455f4d','#647566'].includes(tint)?'fabric':tint==='#102329'?'rubber':'gunmetal';const m=new THREE.Mesh(geo,surfaces.get(kind,tint));m.position.set(x,y,z);m.scale.set(sx,sy,sz);this.weapon.add(m);return m;};
        mesh(box,'#24373f',0,0,0,.13,.14,.42);
        mesh(box,'#667a78',0,.045,-.19,.105,.09,.30);
        mesh(box,'#26383e',0,-.03,.30,.115,.14,.23);
        mesh(box,'#102329',0,-.12,.065,.075,.22,.09).rotation.x=-.16;
        this.rifleMagazine=mesh(box,'#3a5053',0,-.14,-.08,.085,.21,.13);this.rifleMagazine.rotation.x=.12;this.rifleMagazineGroup.add(this.rifleMagazine);
        const barrel=mesh(cylinder,'#233038',0,.018,-.51,.025,.37,.025);barrel.rotation.x=Math.PI/2;
        const muzzle=mesh(cylinder,'#6e7e7a',0,.018,-.705,.032,.065,.032);muzzle.rotation.x=Math.PI/2;
        mesh(box,'#1e2f35',0,.105,-.03,.045,.04,.10);
        mesh(box,'#91ad9e',-.026,.155,-.03,.013,.065,.035);mesh(box,'#91ad9e',.026,.155,-.03,.013,.065,.035);
        mesh(box,'#91ad9e',0,.185,-.03,.065,.012,.035);mesh(box,'#344b50',0,.139,-.36,.022,.08,.03);mesh(box,'#c8ff66',0,.178,-.36,.014,.02,.022);
        for(let i=0;i<8;i++)mesh(box,'#25373e',0,.098,-.34+i*.044,.115,.012,.018);
        for(const x of [-.07,.07])mesh(box,'#9bb09c',x,0,-.02,.014,.05,.09);
        mesh(sphere,'#455f4d',.08,-.13,.14,.08,.11,.10);
        mesh(box,'#647566',.13,-.25,.23,.14,.28,.18).rotation.z=.32;
        this.rifleSupport.add(mesh(sphere,'#455f4d',-.06,-.09,-.27,.085,.07,.09));
        const leftSleeve=mesh(box,'#647566',-.14,-.22,-.18,.14,.29,.16);leftSleeve.rotation.z=-.43;this.rifleSupport.add(leftSleeve);
        // Receiver port, fire selector, magazine ribs and a proper trigger guard.
        mesh(box,'#182c26',.073,.012,.04,.008,.05,.10);
        mesh(box,'#b5a478',.079,.012,.04,.006,.013,.07);
        mesh(box,'#a1ad96',.079,-.037,.13,.012,.022,.034);
        for(let j=0;j<4;j++)this.rifleMagazineGroup.add(mesh(box,'#7b8a70',0,-.08-j*.055,-.14,.077,.012,.01));
        for(const side of [-1,1]){
            for(let j=0;j<5;j++)mesh(box,'#1e332c',side*.061,.01,-.33+j*.05,.007,.035,.023);
            for(let finger=0;finger<4;finger++){const f=mesh(capsule,'#455f4d',side*.065-.04+finger*.027,-.10,side>0?.08:-.30,.024,.07,.03);f.rotation.x=-.6;if(side<0)this.rifleSupport.add(f);}
        }
        const guard=new THREE.Mesh(new THREE.TorusGeometry(.043,.007,8,20),material('#7d8b73'));guard.position.set(0,-.11,.04);guard.rotation.y=Math.PI/2;this.weapon.add(guard);
        this.muzzleLight=new THREE.PointLight('#ffb861',0,2,.9);this.muzzleLight.position.set(0,.018,-.79);this.weapon.add(this.muzzleLight);
        const flashMaterial=new THREE.MeshBasicMaterial({color:'#ffdea0',transparent:true,opacity:.8,depthWrite:false,blending:THREE.AdditiveBlending,toneMapped:false});
        this.flash=new THREE.Mesh(new THREE.SphereGeometry(1,6,4),flashMaterial);this.flash.position.set(0,.018,-.79);this.flash.scale.set(.045,.045,.15);this.weapon.add(this.flash);
    }
    loadMap(map,theme={}){
        const key=map.join('');if(this.mapKey===key&&this.arenaId===theme.id)return;this.mapKey=key;this.arenaId=theme.id;
        this.mapWidth=map[0].length;this.mapDepth=map.length;const night=theme.id==='observatory';
        if(!this.skies.has(theme.id))this.skies.set(theme.id,skyTexture(theme.id));this.scene.background=this.skies.get(theme.id);
        this.scene.fog.color.set(night?'#738493':'#b6beb7');this.scene.fog.density=night?.011:.009;this.sun.color.set(night?'#d0dcf0':'#ffe0b0');this.sun.intensity=night?1.8:3;this.ambient.color.set(night?'#a9bfdf':'#c7d8e1');
        const geos=new Set(),mats=new Set(),textures=new Set();
        this.staticRoot.traverse(o=>{if(!o.isMesh)return;if(!o.geometry.userData.shared)geos.add(o.geometry);if(!o.material.userData.persistent){mats.add(o.material);for(const t of Object.values(o.material))if(t?.isTexture)textures.add(t);}if(o.isInstancedMesh)o.dispose();});
        geos.forEach(g=>g.dispose());mats.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());this.staticRoot.clear();
        this.heatMeshes=[];
        if(theme.id==='foundry')for(let i=0;i<3;i++){const group=new THREE.Group();const disk=new THREE.Mesh(new THREE.CircleGeometry(1,48),new THREE.MeshBasicMaterial({color:'#ff2418',transparent:true,opacity:.45,depthWrite:false,side:THREE.DoubleSide,toneMapped:false}));disk.rotation.x=-Math.PI/2;group.add(disk);const ring=new THREE.Mesh(new THREE.RingGeometry(.94,1,48),new THREE.MeshBasicMaterial({color:'#ff6655',side:THREE.DoubleSide,depthWrite:false,toneMapped:false}));ring.rotation.x=-Math.PI/2;ring.position.y=.005;group.add(ring);group.visible=false;this.staticRoot.add(group);this.heatMeshes.push(group);}
        this.trainRoot=null;this.trainWheels=[];this.trainFans=[];this.trackLights=[];
        for(const light of this.localLights)this.scene.remove(light);this.localLights=[];
        buildWorld(this.staticRoot,map,theme,this.surfaces);this.landmark(theme.id||'freight');
        enhanceLandmark(this.staticRoot.getObjectByName('landmark-'+(theme.id||'freight')),theme.id||'freight',this.surfaces);
        environment(this.staticRoot,theme.id,this.surfaces);
        this.mechanisms=machinery(this.staticRoot,theme.id,this.surfaces,this.staticRoot.getObjectByName('landmark-'+theme.id));
        mergeStatic(this.staticRoot.getObjectByName('landmark-'+(theme.id||'freight')),new Set(this.trackLights));
        this.staticRoot.traverse(o=>{if(o.isMesh&&!o.material.transparent){o.castShadow=true;o.receiveShadow=true;}});
        if(night||theme.id==='foundry'){
            const light=new THREE.PointLight(night?'#88c0ef':'#ff8e38',night?18:35,15,2);light.position.set(30,3.1,night?15:14.9);light.visible=this.quality!==6;this.scene.add(light);this.localLights.push(light);
        }
        this.shadowDirty=true;
    }
    landmark(id){
        const group=new THREE.Group();group.name='landmark-'+id;group.position.set(this.mapWidth/2-20,0,this.mapDepth/2-12);this.staticRoot.add(group);
        const add=(geometry,tint,x,y,z)=>{const kind=['#7dd5e9','#bbccbf'].includes(tint)?'glass':id==='plaza'?'stone':id==='observatory'?'paint':'metal';const m=new THREE.Mesh(geometry,surfaces.get(kind,tint));m.position.set(x,y,z);group.add(m);return m;};
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
            const model=buildDieselLocomotive(this.surfaces);
            model.root.position.set(20,0,12);
            this.trainRoot=new THREE.Group();this.trainRoot.name='moving-train';
            this.trainRoot.add(model.root);group.add(this.trainRoot);this.trainRoot.visible=false;
            this.trainWheels=model.wheels;this.trainFans=model.fans;
            buildRailTrack(group,this.mapWidth,this.surfaces);
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
    updateHeat(zones,time){for(let i=0;i<(this.heatMeshes||[]).length;i++){const mesh=this.heatMeshes[i],zone=zones[i];mesh.visible=!!zone&&time<zone.end;if(!mesh.visible)continue;mesh.position.set(zone.x,.035,zone.y);mesh.scale.set(zone.radius,1,zone.radius);const active=time>=zone.start;mesh.children[0].material.opacity=active?.55:.12+Math.abs(Math.sin(time*7))*.16;mesh.children[1].material.color.set(active?'#ff392b':'#ffb09a');}}
    setHeatViewer(skin){for(const mesh of this.heatMeshes||[]){mesh.children[0].material.color.set(skin==='glowsquid'?'#208cff':'#ff2418');mesh.children[1].material.color.set(skin==='glowsquid'?'#73d6ff':'#ff6655');}}
    updateMechanisms(time,crane){animateMachinery(this.mechanisms,time,crane);if(this.mechanisms&&Math.floor(time*6)!==this.mechanismShadow){this.mechanismShadow=Math.floor(time*6);this.shadowDirty=true;}}
    updateTrain(train){
        if(!this.trainRoot)return;
        if(this.trainRoot.visible!==!!train?.active)this.shadowDirty=true;
        this.trainRoot.visible=!!train?.active;
        if(train){
            this.trainRoot.position.x=train.x-this.mapWidth/2;
            for(const wheel of this.trainWheels)wheel.rotation.z=-train.x/.48;
            for(const fan of this.trainFans||[])fan.rotation.y=train.elapsed*6;
        }
        const flash=train&&(train.warning||train.active)&&Math.floor(train.elapsed*5)%2===0;
        for(const lamp of this.trackLights)lamp.material.color.set(flash?'#ff442e':'#6c3129');
    }
    resize(w,h,quality){
        this.setQuality(quality);const scale=Math.min(devicePixelRatio||1,quality===2?1.5:quality===4?1:.7,1800/Math.max(w,h))*(this.autoScale||1);
        if(this.width!==w||this.height!==h||this.scale!==scale){this.width=w;this.height=h;this.scale=scale;this.renderer.setPixelRatio(scale);this.renderer.setSize(w,h,false);}
    }
    begin(roster,now){
        if(this.lost)return;
        const elapsed=now-(this.lastTime||now),dt=Math.max(0,Math.min(.1,elapsed/1000));this.lastTime=now;
        if(roster.length>0&&this.quality!==2&&++this.frameCounter>8&&elapsed>0&&elapsed<1500){
            this.frameBudget=lerp(this.frameBudget,elapsed,.18);
            if(this.frameCounter%8===0&&this.frameBudget>55&&this.autoScale>.55){this.autoScale=Math.max(.55,this.autoScale*.85);this.resize(this.width,this.height,this.quality);}
            else if(this.frameCounter%120===0&&this.frameBudget<24&&this.autoScale<1){this.autoScale=Math.min(1,this.autoScale+.05);this.resize(this.width,this.height,this.quality);}
        }
        for(const p of roster){
            let a=this.actors.get(p.id);
            if(!a||a.skin!==p.skin||a.team!==p.team){a=actor(p);this.actors.set(p.id,a);}
            animateOperator(a,p,dt,now);
        }
        for(const id of this.actors.keys())if(!roster.some(p=>p.id===id))this.actors.delete(id);
        this.combatEffects.update(this.actors,dt,now);
        let shadowIndex=0;for(const p of roster)if(p.hp>0&&shadowIndex<6){transform.position.set(p.x,.009,p.y);transform.rotation.set(-Math.PI/2,0,0);transform.scale.set(1,1,1);transform.updateMatrix();this.actorShadows.setMatrixAt(shadowIndex++,transform.matrix);}this.actorShadows.count=shadowIndex;this.actorShadows.instanceMatrix.needsUpdate=true;
        if(this.renderer.shadowMap.enabled&&(this.shadowDirty||((this.quality===2||this.trainRoot?.visible)&&now-this.lastShadow>(this.quality===2?80:180)))){this.renderer.shadowMap.needsUpdate=true;this.lastShadow=now;this.shadowDirty=false;}
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
        for(const [id,a] of this.actors){if(id===p.id||(a.hp<=0&&now-a.dead>5000))continue;for(const part of a.records){if(part.weapon&&part.weapon!==a.weapon)continue;if(part.enemyBand&&a.team===p.team)continue;const key=part.surface+':'+part.geometry;if(!this.batches[key]){this.batches[key]=new Batch(this.scene,geometries[part.geometry],1024,surfaces.get(part.surface));this.batches[key].mesh.castShadow=this.quality===2;}this.batches[key].add(part.node.matrixWorld,part.tint);}}
        for(const batch of Object.values(this.batches))batch.commit();
        this.combatEffects.view(p.id,now);
        r.render(this.scene,camera);
        if(p.hp>0){
            const shot=now-(fx?.shotAt||0),moving=Math.min(1,Math.hypot(p.vx||0,p.vy||0)/7.2),stride=p.stride||now*.008;
            const key=p.weapon||'rifle',duration=key==='shotgun'?.7:key==='pistol'?1.25:1.5;
            const model=this.weaponModels[key]||this.weaponModels.rifle,weapon=model.root;this.activeWeapon=key;
            for(const m of Object.values(this.weaponModels))m.root.visible=m===model;
            const ads=fov<1,reloadTarget=p.reload>0?Math.sin(p.reload/duration*Math.PI):0,kick=p.cheats.recoil?0:Math.max(0,1-shot/110);
            let sway=this.weaponSway.get(p.id);if(!sway){sway={yaw:p.yaw,pitch,x:0,y:0,reload:0,time:now,equip:0};this.weaponSway.set(p.id,sway);}
            const step=Math.min(.1,Math.max(.001,(now-sway.time)/1000)),blend=1-Math.exp(-18*step);sway.time=now;sway.reload=lerp(sway.reload,reloadTarget,blend);sway.equip=lerp(sway.equip,p.equip||0,blend);const reload=sway.reload;
            const delta=Math.atan2(Math.sin(p.yaw-sway.yaw),Math.cos(p.yaw-sway.yaw));sway.x=lerp(sway.x,THREE.MathUtils.clamp(delta/step*.016,-.04,.04),blend);sway.y=lerp(sway.y,THREE.MathUtils.clamp((pitch-sway.pitch)/step*.016,-.03,.03),blend);sway.yaw=p.yaw;sway.pitch=pitch;
            weapon.position.set((ads?0:.19)+Math.sin(stride)*moving*.008,-.20-Math.abs(Math.cos(stride))*moving*.007-reload*.18,(ads?-.42:-.54)+kick*.04);
            weapon.rotation.set(kick*(key==='shotgun'?.11:key==='pistol'?.085:.045)+reload*.35+sway.y,reload*-.4-sway.x,reload*-.4-sway.x*.5);
            weapon.position.y-=Math.min(1,sway.equip/.35)*.25;
            if(key!=='rifle')animateFirearm(model,key,shot,reload);
            else{this.rifleSupport.position.set(.10*reload,-.16*reload,.17*reload);this.rifleMagazineGroup.position.y=-reload*.18;}
            model.flash.visible=shot>=0&&shot<65;model.light.intensity=model.flash.visible&&this.quality!==6?2.5:0;
            this.weaponCamera.aspect=aspect;this.weaponCamera.fov=2*Math.atan(Math.tan(58*Math.PI/360)/Math.min(1,aspect))*180/Math.PI;this.weaponCamera.updateProjectionMatrix();r.clearDepth();r.render(this.weaponScene,this.weaponCamera);
        }
    }
    inspect(roster,now,target,orbit=-2.5,elevation=.3,radius=3.6){
        if(this.lost)return;this.begin(roster,now);
        for(const batch of Object.values(this.batches))batch.mesh.count=0;
        for(const a of this.actors.values())for(const part of a.records){
            if(part.weapon&&part.weapon!==a.weapon)continue;
            const key=part.surface+':'+part.geometry;
            if(!this.batches[key])this.batches[key]=new Batch(this.scene,geometries[part.geometry],1024,surfaces.get(part.surface));
            this.batches[key].mesh.castShadow=this.quality===2;this.batches[key].add(part.node.matrixWorld,part.tint);
        }
        for(const batch of Object.values(this.batches))batch.commit();
        const r=this.renderer,c=this.camera;c.aspect=this.width/this.height;c.fov=45;c.updateProjectionMatrix();
        const focus=target.height??1;c.position.set(target.x+Math.cos(orbit)*radius,focus+Math.sin(elevation)*radius,target.y+Math.sin(orbit)*radius);c.lookAt(target.x,focus,target.y);c.updateMatrixWorld();
        r.setViewport(0,0,this.width,this.height);r.setScissor(0,0,this.width,this.height);r.render(this.scene,c);
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
