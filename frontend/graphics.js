/* Original procedural surfaces and architecture, generated locally at startup. */
import * as THREE from 'three';
import {ART,ART_REVISION} from './art-palettes.js';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
export const roundedBox=new RoundedBoxGeometry(1,1,1,1,.065);
export const capsule=new THREE.CapsuleGeometry(.5,1,5,12).scale(1,.5,1);
export function random(seed){return ()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};}
const clamp=n=>Math.max(0,Math.min(255,n));
function noise(n,seed){
    const rng=random(seed),a=Float32Array.from({length:n*n},()=>rng());
    return (u,v)=>{let x=u*n,y=v*n,ix=Math.floor(x),iy=Math.floor(y);x-=ix;y-=iy;x=x*x*(3-2*x);y=y*y*(3-2*y);
        const at=(xx,yy)=>a[((yy+n)%n)*n+(xx+n)%n];return THREE.MathUtils.lerp(THREE.MathUtils.lerp(at(ix,iy),at(ix+1,iy),x),THREE.MathUtils.lerp(at(ix,iy+1),at(ix+1,iy+1),x),y);};
}
function canvas(w,h=w){const c=document.createElement('canvas');c.width=w;c.height=h;return c;}
function textures(kind){
    const N=512,c=canvas(N),g=c.getContext('2d'),pixels=g.createImageData(N,N),heights=new Float32Array(N*N);
    const low=noise(8,11),mid=noise(32,88),fine=noise(128,95),rng=random(73);
    for(let y=0;y<N;y++)for(let x=0;x<N;x++){
        const u=x/N,v=y/N,a=low(u,v),b=mid(u,v),f=fine(u,v),grain=rng()-.5,p=(y*N+x)*4;
        let lum=211+(a-.5)*12+(b-.5)*8+grain*18,h=.45+b*.008+f*.008,green=0,blue=0;
        if(kind==='asphalt'){lum=153+a*12+grain*32;h+=grain*.035;}
        else if(kind==='brick'){
            const row=Math.floor(y/48),xx=(x+(row%2)*64)%128,seam=xx<2||y%48<2;
            lum=seam?145:200+(a-.5)*16+(b-.5)*9+grain*14;green=seam?0:-14;blue=seam?0:-23;h=seam?.42:.46+f*.006;
        }
        else if(kind==='rock'){lum=170+(a-.5)*64+(b-.5)*35+grain*20;h=.45+a*.12+b*.05;}
        else if(kind==='stone'){
            const row=Math.floor(y/128),xx=(x+row%2*128)%256,seam=xx<3||y%128<3;
            lum=seam?85:215+(a-.5)*34+(b-.5)*17+grain*16;h=seam?.12:h;
        }else if(kind==='metal'||kind==='paint'){
            const rib=kind==='paint'?Math.pow((Math.cos(u*Math.PI*32)+1)/2,10):0;
            const edge=Math.min(x%128,128-x%128,y%128,128-y%128);const rust=Math.max(0,(a*.65+b*.35-.70)*3.2)+(edge<3?Math.max(0,b-.45)*.6:0);lum=220+(a-.5)*13+grain*8-rib*16-rust*26;green=-rust*34;blue=-rust*49;h=.4+b*.020+rib*.14;
            if(y%128<2||x%128<2){lum-=24;h-=.03;}
        }else if(kind==='gunmetal'){const brushing=Math.sin(y*2.1+x*.035)*2,wear=Math.max(0,b-.68)*65;lum=219+grain*5+(f-.5)*5+brushing+wear;h=.5+grain*.002;}
        else if(kind==='water'){const wave=Math.sin(u*53+Math.sin(v*31))*Math.cos(v*47-u*11);lum=203+wave*18;h=.5+wave*.065;}
        else if(kind==='molten'){const crust=Math.pow(Math.max(0,a*.65+b*.35-.38),.55);lum=255-crust*190;green=-crust*45;blue=-crust*75;h=.5+crust*.05;}
        else if(kind==='fabric'||kind==='uniform'){
            const weave=(x%4<2?1:-1)*(y%4<2?1:-1);lum=212+b*17+weave*8+grain*10;if(kind==='uniform'){const patch=a*.65+b*.35;lum-=patch<.42?55:patch>.57?24:0;green+=patch<.42?-3:3;blue-=patch>.57?12:0;}h=.45+weave*.025;
        }else if(kind==='skin'){lum=238+b*10+grain*5;h=.5+f*.01;}
        else if(kind==='rubber'){lum=170+b*20+grain*12;h=.5+f*.03;}
        if(kind==='concrete'||kind==='asphalt'){
            const crack=Math.abs(Math.sin(u*27+Math.sin(v*18)*1.5)+Math.sin(v*31)*.25);
            if(crack<.008&&a<.6){lum-=30;h-=.025;}if(a<.22)lum-=7;
        }
        pixels.data[p]=clamp(lum);pixels.data[p+1]=clamp(lum+green);pixels.data[p+2]=clamp(lum+blue);pixels.data[p+3]=255;heights[y*N+x]=h;
    }
    g.putImageData(pixels,0,0);const nc=canvas(N),ng=nc.getContext('2d'),normal=ng.createImageData(N,N),rc=canvas(N),rg=rc.getContext('2d'),rough=rg.createImageData(N,N);
    const sample=(x,y)=>heights[((y+N)%N)*N+(x+N)%N];
    for(let y=0;y<N;y++)for(let x=0;x<N;x++){
        const i=(y*N+x)*4,dx=(sample(x-1,y)-sample(x+1,y))*2,dy=(sample(x,y-1)-sample(x,y+1))*2,len=Math.hypot(dx,dy,1);
        normal.data[i]=(dx/len*.5+.5)*255;normal.data[i+1]=(dy/len*.5+.5)*255;normal.data[i+2]=(1/len*.5+.5)*255;normal.data[i+3]=255;
        const value=(kind==='water'?65:kind==='molten'?100:kind==='gunmetal'?145:kind==='metal'?145:kind==='paint'?185:kind==='skin'?195:235)+(sample(x,y)-.5)*90;
        rough.data[i]=rough.data[i+1]=rough.data[i+2]=clamp(value);rough.data[i+3]=255;
    }
    ng.putImageData(normal,0,0);rg.putImageData(rough,0,0);
    const tex=(source,color=false)=>{const t=new THREE.CanvasTexture(source);t.wrapS=t.wrapT=THREE.RepeatWrapping;if(color)t.colorSpace=THREE.SRGBColorSpace;return t;};
    return {map:tex(c,true),normalMap:tex(nc),roughnessMap:tex(rc)};
}
export class Surfaces{
    constructor(renderer){this.cache=new Map();this.textures=new Map();this.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());this.currentQuality=4;}
    get(kind,tint='#ffffff'){
        const key=kind+tint;if(this.cache.has(key))return this.cache.get(key);
        let m;
        if(kind==='glow')m=new THREE.MeshBasicMaterial({color:tint,toneMapped:false});
        else if(kind==='glass')m=new THREE.MeshPhysicalMaterial({color:tint,metalness:.25,roughness:.19,clearcoat:.8,envMapIntensity:.65});
        else{
            if(!this.textures.has(kind)){const maps=textures(kind);for(const t of Object.values(maps))t.anisotropy=this.currentQuality===6?1:this.currentQuality===4?Math.min(4,this.anisotropy):this.anisotropy;this.textures.set(kind,maps);}
            m=new THREE.MeshStandardMaterial({...this.textures.get(kind),color:tint,metalness:kind==='water'?.25:kind==='molten'?.45:(kind==='metal'||kind==='gunmetal')?.68:kind==='paint'?.22:0,roughness:kind==='water'?.4:1,normalScale:new THREE.Vector2(kind==='skin'?.15:kind==='water'?1.1:.7,kind==='skin'?.15:kind==='water'?1.1:.7),envMapIntensity:['metal','gunmetal','water'].includes(kind)?.85:.3});
            if(kind==='molten'){m.emissive.set(tint);m.emissiveMap=this.textures.get(kind).map;m.emissiveIntensity=1.3;}
        }
        m.userData.persistent=true;m.userData.surface=kind;this.cache.set(key,m);return m;
    }
    quality(q){this.currentQuality=q;for(const maps of this.textures.values())for(const t of Object.values(maps))t.anisotropy=q===6?1:q===4?Math.min(4,this.anisotropy):this.anisotropy;}
}
export function skyTexture(id){
    const c=canvas(1024,512),g=c.getContext('2d'),night=id==='observatory',palette=ART[id]?.sky||['#6a8496','#b7c8cd','#dfccaa'],gradient=g.createLinearGradient(0,0,0,512);
    gradient.addColorStop(0,night?'#102037':palette[0]);gradient.addColorStop(.43,night?'#526987':palette[1]);gradient.addColorStop(.55,night?'#ad9b92':palette[2]);gradient.addColorStop(1,'#747f76');g.fillStyle=gradient;g.fillRect(0,0,1024,512);
    const rng=random(11);for(let i=0;i<100;i++){
        const x=rng()*1024,y=80+rng()*140,rx=20+rng()*110,ry=5+rng()*12;g.save();g.translate(x,y);g.scale(1,ry/rx);
        const cloud=g.createRadialGradient(0,0,1,0,0,rx);cloud.addColorStop(0,night?'rgba(183,175,167,.12)':'rgba(246,239,223,.17)');cloud.addColorStop(1,'rgba(230,228,216,0)');g.fillStyle=cloud;g.fillRect(-rx,-rx,rx*2,rx*2);g.restore();
    }
    if(night){g.fillStyle='#e8eee8';for(let i=0;i<90;i++){g.globalAlpha=rng()*.6;g.fillRect(rng()*1024,rng()*150,1,1);}g.globalAlpha=1;}
    const texture=new THREE.CanvasTexture(c);texture.mapping=THREE.EquirectangularReflectionMapping;texture.colorSpace=THREE.SRGBColorSpace;return texture;
}
export function contactTexture(){const c=canvas(128),g=c.getContext('2d'),rad=g.createRadialGradient(64,64,8,64,64,62);rad.addColorStop(0,'rgba(8,14,11,.6)');rad.addColorStop(.55,'rgba(8,14,11,.27)');rad.addColorStop(1,'rgba(8,14,11,0)');g.fillStyle=rad;g.fillRect(0,0,128,128);return new THREE.CanvasTexture(c);}
function label(root,title,sub,x,y,z,yaw=0,w=1.5,warning=false){
    const c=canvas(512,256),g=c.getContext('2d'),rng=random(112);g.fillStyle=warning?'#c4a25c':'#c6c3ad';g.fillRect(0,0,512,256);g.strokeStyle='#38433b';g.lineWidth=8;g.strokeRect(10,10,492,236);g.fillStyle='#344039';g.textAlign='center';g.font='bold 54px sans-serif';g.fillText(title,256,112,460);g.font='22px sans-serif';g.fillText(sub,256,172,460);
    for(let i=0;i<1600;i++){g.fillStyle=`rgba(50,43,25,${rng()*.17})`;g.fillRect(rng()*512,rng()*256,1+rng()*7,1+rng()*3);}
    const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;
    const mesh=new THREE.Mesh(new THREE.PlaneGeometry(w,w*.5),new THREE.MeshStandardMaterial({map:tex,roughness:.9,side:THREE.DoubleSide}));mesh.position.set(x,y,z);mesh.rotation.y=yaw;root.add(mesh);
}
export class Builder{
    constructor(root,surfaces){this.root=root;this.surfaces=surfaces;this.groups=new Map();this.count=0;}
    add(geometry,kind,tint,x,y,z,rotation){const matrix=new THREE.Matrix4(),q=new THREE.Quaternion();if(rotation)q.setFromEuler(new THREE.Euler(...rotation));matrix.compose(new THREE.Vector3(x,y,z),q,new THREE.Vector3(1,1,1));geometry.applyMatrix4(matrix);const mat=this.surfaces.get(kind,tint),list=this.groups.get(mat)||[];list.push(geometry);this.groups.set(mat,list);this.count++;}
    box(x,y,z,w,h,d,kind='concrete',tint='#adae9e',rotation=null){
        const geo=new THREE.BoxGeometry(w,h,d),uv=geo.attributes.uv;for(let i=0;i<uv.count;i++){const face=Math.floor(i/4);uv.setXY(i,uv.getX(i)*(face<2?d:w)/2,uv.getY(i)*(face<4?h:d)/2);}this.add(geo,kind,tint,x,y,z,rotation);
    }
    tube(x,y,z,r,h,kind='metal',tint='#87968a',rotation=null){this.add(new THREE.CylinderGeometry(r,r,h,12),kind,tint,x,y,z,rotation);}
    beveled(x,y,z,w,h,d,kind='concrete',tint='#adae9e'){const geo=new RoundedBoxGeometry(w,h,d,2,Math.min(.065,Math.min(w,h,d)*.07));this.add(geo,kind,tint,x,y,z);}
    finish(){for(const [mat,parts] of this.groups){const mesh=new THREE.Mesh(mergeGeometries(parts),mat);mesh.castShadow=mat.userData.surface!=='glow';mesh.receiveShadow=true;mesh.name='architecture-'+mat.userData.surface;this.root.add(mesh);for(const p of parts)p.dispose();}this.root.userData.detailParts=this.count;}
}
export function rectangles(map,accept){
    const seen=new Set(),out=[],W=map[0].length;const free=(x,y)=>map[y]?.[x]==='1'&&!seen.has(y*W+x)&&accept(x,y);
    for(let y=0;y<map.length;y++)for(let x=0;x<W;x++)if(free(x,y)){
        let w=1,d=1;while(free(x+w,y))w++;while(y+d<map.length&&Array.from({length:w},(_,i)=>free(x+i,y+d)).every(Boolean))d++;
        for(let yy=y;yy<y+d;yy++)for(let xx=x;xx<x+w;xx++)seen.add(yy*W+xx);out.push({x,y,w,d});
    }return out;
}
function groundMarks(root,W,D,id){
    const c=canvas(2048,1024),g=c.getContext('2d'),rng=random(101),sx=2048/W,sy=1024/D;
    for(let i=0;i<450;i++){const x=rng()*2048,y=rng()*1024,r=2+rng()*35;g.globalAlpha=.02+rng()*.045;g.fillStyle='#202a21';g.beginPath();g.ellipse(x,y,r,r*.4,0,0,Math.PI*2);g.fill();}
    g.globalAlpha=.43;g.strokeStyle='#cdbb76';g.lineWidth=3;g.setLineDash([12,8]);for(const x of [5.5,W-5.5]){g.beginPath();g.moveTo(x*sx,2*sy);g.lineTo(x*sx,(D-2)*sy);g.stroke();}
    g.setLineDash([]);g.font='bold 44px sans-serif';g.fillStyle='#cac3a4';g.textAlign='center';for(const [x,t] of [[5.5,'01'],[W-5.5,'02']])for(const y of [9.5,17.5,25.5]){g.save();g.translate(x*sx,y*sy);g.rotate(Math.PI/2);g.fillText(t,0,0);g.restore();}
    if(id==='railway'){g.strokeStyle='#d3aa54';g.lineWidth=5;for(const y of [14.9,20.1]){g.beginPath();g.moveTo(0,y*sy);g.lineTo(2048,y*sy);g.stroke();}}
    g.globalCompositeOperation='destination-out';g.globalAlpha=.4;for(let i=0;i<6500;i++)g.fillRect(rng()*2048,rng()*1024,1+rng()*4,1+rng()*2);
    const texture=new THREE.CanvasTexture(c);texture.colorSpace=THREE.SRGBColorSpace;const mesh=new THREE.Mesh(new THREE.PlaneGeometry(W,D),new THREE.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-1}));mesh.rotation.x=-Math.PI/2;mesh.position.set(W/2,.007,D/2);root.add(mesh);
}
export function buildWorld(root,map,theme,surfaces){
    const W=map[0].length,D=map.length,id=theme.id,b=new Builder(root,surfaces),rng=random(21),bounds=theme.landmark_bounds;
    const floorGeo=new THREE.PlaneGeometry(W,D),uv=floorGeo.attributes.uv;for(let i=0;i<uv.count;i++)uv.setXY(i,uv.getX(i)*W/4,uv.getY(i)*D/4);
    const floor=new THREE.Mesh(floorGeo,surfaces.get(['plaza','glory'].includes(id)?'stone':id==='railway'?'asphalt':'concrete',ART[id]?.floor||'#a3afb3'));floor.rotation.x=-Math.PI/2;floor.position.set(W/2,-.015,D/2);floor.receiveShadow=true;floor.name='arena-floor';root.add(floor);
    const border=(x,y)=>x===0||y===0||x===W-1||y===D-1;
    for(const r of rectangles(map,border)){const x=r.x+r.w/2,z=r.y+r.d/2;b.box(x,1.9,z,r.w,3.8,r.d);b.box(x,.24,z,r.w+.03,.48,r.d+.03,'concrete','#6e7d71');b.box(x,3.78,z,r.w+.08,.17,r.d+.08,'metal','#819184');}
    const central=(x,y)=>bounds&&x>=bounds[0]&&y>=bounds[1]&&x<bounds[0]+bounds[2]&&y<bounds[1]+bounds[3];
    const covers=rectangles(map,(x,y)=>!border(x,y)&&!(central(x,y)&&id!=='freight'));
    const contact=new THREE.MeshBasicMaterial({map:contactTexture(),transparent:true,depthWrite:false,opacity:.7});
    for(let i=0;i<covers.length;i++){
        const r=covers[i],x=r.x+r.w/2,z=r.y+r.d/2,cargo=id==='freight'||id==='railway',research=id==='observatory';
        const tint=cargo?(id==='freight'?['#627d82','#aaa084','#896e58','#6e806b']:['#697c78','#a69d86','#8e7e67','#7f8a77'])[i%4]:id==='plaza'?'#baac8f':id==='glory'?'#b7b09a':research?'#b4c0c1':'#95958a';
        b.beveled(x,1.3,z,r.w,2.6,r.d,cargo?'paint':research?'metal':id==='plaza'?'stone':'concrete',tint);
        b.box(x,.09,z,r.w+.035,.18,r.d+.035,'concrete','#667466');b.box(x,2.58,z,r.w+.045,.13,r.d+.045,'metal','#849181');
        if(cargo){
            for(const xx of [r.x+.08,r.x+r.w-.08])for(const zz of [r.y+.08,r.y+r.d-.08])b.box(xx,1.35,zz,.13,2.5,.13,'metal','#8b9c8c');
            for(const zz of [z-.28,z+.28]){b.tube(r.x+.017,1.3,zz,.027,2.15);b.box(r.x-.013,1.22,zz,.045,.09,.22,'metal','#c9c3a0');}
            if(r.w>=3)label(root,'C-'+String(i+1).padStart(2,'0'),'GROSS WT 24 000 KG',x,1.8,r.y-.012,Math.PI,1.1);
        }else if(research||id==='foundry'){
            b.box(x,1.6,r.y-.02,Math.min(r.w-.2,1.6),.7,.045,'metal','#52666c');for(let j=0;j<7;j++)b.box(x,1.35+j*.08,r.y-.05,Math.min(r.w-.3,1.45),.023,.035,'metal','#9cac9b');
            if(r.w>=3)label(root,research?'RESEARCH':'CAUTION',research?'AUTHORIZED PERSONNEL':'HIGH VOLTAGE',x,.65,r.y-.013,Math.PI,1.1,!research);
        }else{b.box(x,.30,z,r.w+.06,.19,r.d+.06,'stone','#c9bea1');b.box(x,2.42,z,r.w+.09,.20,r.d+.09,'stone','#c9bea1');}
        const shadow=new THREE.Mesh(new THREE.PlaneGeometry(r.w+2,r.d+2),contact);shadow.rotation.x=-Math.PI/2;shadow.position.set(x,.002,z);root.add(shadow);
    }
    // Utility pipes and lamps remain in the blocked perimeter footprint.
    for(let x=3;x<W-2;x+=6)for(const z of [.5,D-.5]){b.box(x,2,z,.32,4,.42,'concrete','#979d8f');b.tube(x+.22,2.9,z,.055,1.6);b.box(x,3.15,z>.5?D-1.025:1.025,.8,.22,.18,'metal','#3e5052');b.box(x,3.13,z>.5?D-1.13:1.13,.62,.075,.025,'glow','#e9d9a8');}
    for(const z of [.35,D-.35]){b.tube(W/2,3.35,z,.065,W-3,'metal','#a08f71',[0,0,Math.PI/2]);b.tube(W/2,2.93,z,.035,W-3,'metal','#7e9183',[0,0,Math.PI/2]);}
    for(const [z,yaw] of [[1.02,0],[D-1.02,Math.PI]])label(root,id.toUpperCase(),'SECTOR  /  60 x 35 M',W/2,2.15,z,yaw,4.5);
    // Map-specific facades are built by the shared art-direction module.
    for(const z of [-3,D+3]){const pts=[];for(let i=0;i<=24;i++)pts.push(new THREE.Vector3(-2+i*(W+4)/24,10-Math.sin(i/24*Math.PI)*2,z));root.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),32,.018,4),surfaces.get('rubber','#38443b')));}
    groundMarks(root,W,D,id);b.finish();root.userData.coverFootprints=covers;root.userData.graphicsRevision=ART_REVISION;return floor;
}

// Keep group transforms (train and wheels) while merging their static parts.
export function mergeStatic(root,excluded=new Set()){
    const groups=new Map();
    for(const child of [...root.children]){
        if(excluded.has(child))continue;
        if(child.isGroup){mergeStatic(child,excluded);continue;}
        if(!child.isMesh||excluded.has(child)||child.material.transparent)continue;
        child.updateMatrix();const geo=child.geometry.clone().applyMatrix4(child.matrix);
        const layout=(geo.index?'indexed:':'plain:')+Object.keys(geo.attributes).sort().join(',');
        let layouts=groups.get(child.material);if(!layouts){layouts=new Map();groups.set(child.material,layouts);}const list=layouts.get(layout)||[];list.push(geo);layouts.set(layout,list);
        root.remove(child);if(!child.geometry.userData.shared)child.geometry.dispose();
    }
    for(const [material,layouts] of groups)for(const list of layouts.values()){
        const merged=new THREE.Mesh(mergeGeometries(list),material);merged.castShadow=merged.receiveShadow=true;root.add(merged);for(const g of list)g.dispose();
    }
}
