/* Original articulated operators. Metres, two-bone IK and distance-driven gait. */
import * as THREE from 'three';
const lerp=THREE.MathUtils.lerp,clamp=THREE.MathUtils.clamp;
function profile(points){return new THREE.LatheGeometry(points.map(([r,y])=>new THREE.Vector2(r,y)),20);}
const face=profile([[.045,-.045],[.075,-.025],[.098,.035],[.104,.12],[.091,.185],[.055,.218],[0,.23]]).scale(1,1,.89);
const positions=face.attributes.position;for(let i=0;i<positions.count;i++)if(positions.getZ(i)>.080)positions.setZ(i,.080);face.computeVertexNormals();
export const operatorGeometries={head:face,
    torso:profile([[.28,-.5],[.42,-.44],[.47,-.2],[.5,.2],[.45,.41],[.31,.5]]).scale(1,1,.62),
    limb:profile([[.22,-.5],[.36,-.46],[.43,-.15],[.5,.30],[.40,.48],[.25,.5]]),
};
for(const g of Object.values(operatorGeometries))g.userData.shared=true;
const V=(x=0,y=0,z=0)=>new THREE.Vector3(x,y,z);
function solve(start,end,l1,l2,pole){
    const axis=end.clone().sub(start),distance=clamp(axis.length(),.002,l1+l2-.001);axis.normalize();
    const bend=pole.clone().sub(axis.clone().multiplyScalar(pole.dot(axis))).normalize();
    const along=(l1*l1-l2*l2+distance*distance)/(2*distance);
    return start.clone().addScaledVector(axis,along).addScaledVector(bend,Math.sqrt(Math.max(0,l1*l1-along*along)));
}
function bone(node,from,to){node.position.copy(from).add(to).multiplyScalar(.5);node.quaternion.setFromUnitVectors(V(0,1,0),to.clone().sub(from).normalize());node.scale.y=from.distanceTo(to);}
export function buildOperator(player,part,joint){
    const root=new THREE.Group(),records=[],team=player.team?'#ed785f':'#58c4ea',suit=player.skin==='rogue'?'#45504b':player.skin==='warden'?'#686d57':'#667369';
    const dark='#263338',plate='#394f54',skin='#bf967c';
    const add=(parent,g,c,x,y,z,sx,sy,sz,surface)=>{const n=part(parent,g,c,x,y,z,sx,sy,sz,records);if(surface)records.at(-1).surface=surface==='fabric'&&c===suit?'uniform':surface;return n;};
    const body=joint(root,0,.95,0),head=joint(body,0,.64,0),legs=[],arms=[];
    add(body,'torso',suit,0,.26,0,.48,.50,.44,'fabric');
    add(body,'sphere',suit,0,-.02,0,.225,.14,.14,'fabric');
    add(body,'torso',plate,0,.28,.065,.43,.38,.40,'fabric');
    add(body,'box','#263338',0,.01,0,.45,.065,.31,'rubber');
    add(body,'box','#8b9487',0,.01,.17,.075,.05,.018,'metal');
    add(body,'box','#465244',0,.29,-.16,.33,.35,.10,'fabric');
    for(const side of [-1,1]){
        add(body,'box',suit,side*.17,.32,.155,.045,.40,.033,'fabric');
        for(let row=0;row<4;row++)add(body,'box','#88947a',side*.14,.15+row*.058,.19,.14,.013,.012,'fabric');
        add(body,'box',team,side*.205,.47,.04,.014,.065,.13,'fabric');
        add(body,'box','#59695b',side*.11,.10,.22,.12,.17,.065,'fabric');
        add(body,'box','#5e6b58',side*.228,.06,-.05,.075,.17,.12,'fabric');
    }
    add(body,'box','#263338',-.14,.39,.19,.07,.12,.055,'rubber');
    add(body,'cylinder','#263338',-.14,.49,.19,.008,.14,.008,'rubber');
    add(body,'capsule',skin,0,.54,0,.105,.13,.11,'skin');
    // Anatomical jaw, skull and facial landmarks; all original geometry.
    add(head,'head',skin,0,0,.008,1,1,1,'skin');
    add(head,'box',skin,0,.065,.10,.022,.042,.03,'skin');
    add(head,'box','#996e5d',0,.009,.091,.042,.005,.006,'skin');
    for(const side of [-1,1]){
        add(head,'sphere',skin,side*.103,.07,.006,.018,.033,.021,'skin');
        add(head,'box','#886d58',side*.039,.104,.090,.027,.007,.006,'skin');
        add(head,'sphere','#263338',side*.039,.104,.094,.005,.004,.003,'rubber');
        add(head,'box','#695446',side*.039,.12,.091,.034,.007,.006,'fabric');
        add(head,'capsule','#3e4941',side*.101,.017,.073,.016,.16,.016,'fabric').rotation.z=side*.35;
        add(head,'box','#1c2a30',side*.143,.083,0,.04,.102,.075,'rubber');
        add(head,'box',plate,side*.145,.19,-.005,.028,.07,.075,'metal');
    }
    add(head,'sphere',suit,0,.197,-.018,.146,.099,.137,'fabric');
    add(head,'box',plate,0,.205,.078,.245,.036,.105,'metal');
    add(head,'box','#b6baa2',0,.27,.014,.035,.018,.05,'metal');
    add(head,'box','#527b80',0,.15,.12,.20,.035,.018,'glass');
    if(player.skin==='rogue')add(head,'sphere',suit,0,-.018,.03,.108,.073,.105,'fabric');
    for(const side of [-1,1]){
        const thigh=add(root,'limb',suit,0,0,0,.19,1,.20,'fabric'),shin=add(root,'limb',suit,0,0,0,.15,1,.16,'fabric');
        const knee=add(root,'box',plate,0,0,0,.15,.14,.055,'rubber'),boot=joint(root,0,0,0);
        add(boot,'box','#1c2a30',0,.035,.05,.18,.12,.30,'rubber');
        add(boot,'box','#596155',0,-.025,.05,.183,.025,.31,'rubber');
        add(boot,'capsule','#1c2a30',0,.11,-.01,.14,.15,.15,'rubber');
        for(let j=0;j<3;j++)add(boot,'box','#7c816d',0,.105-j*.018,.10,.09,.009,.012,'fabric');
        legs.push({side,thigh,shin,knee,boot});
        const upper=add(body,'limb',suit,0,0,0,.16,1,.17,'fabric'),lower=add(body,'limb',suit,0,0,0,.125,1,.135,'fabric'),hand=joint(body,0,0,0);
        add(hand,'sphere','#39493e',0,0,0,.064,.045,.085,'fabric');
        for(let f=0;f<4;f++)add(hand,'capsule','#39493e',-.039+f*.026,-.035,.02,.022,.065,.029,'fabric');
        add(hand,'capsule','#39493e',side*.063,-.012,.035,.026,.06,.032,'fabric').rotation.z=side*.6;
        arms.push({side,upper,lower,hand});
        add(body,'sphere',suit,side*.237,.43,0,.115,.105,.115,'fabric');
    }
    const gun=joint(body,.14,.39,.24),gunRecords={};
    for(const key of ['rifle','shotgun','pistol']){
        const start=records.length;
        const g=joint(gun,0,0,0),barrel=(z,l,r)=>{const n=add(g,'cylinder','#323d41',0,.03,z,r,l,r,'metal');n.rotation.x=Math.PI/2;};
        if(key==='pistol'){
            add(g,'box',dark,0,.015,.12,.055,.065,.22,'metal');
            add(g,'box',dark,0,-.065,.055,.048,.12,.065,'rubber').rotation.x=.16;
            barrel(.235,.035,.017);
        }else{
            add(g,'box',dark,0,0,.10,.09,.11,.30,'metal');
            add(g,'box',suit,0,-.015,-.10,.08,.12,.18,'rubber');
            add(g,'box',dark,0,-.105,.04,.06,.15,.08,'rubber');
            if(key==='rifle')add(g,'box',dark,0,-.12,.16,.07,.17,.10,'metal');
            barrel(.45,key==='shotgun'?.49:.42,key==='shotgun'?.026:.019);
            add(g,'box',key==='shotgun'?'#6e6452':suit,0,.01,.30,.08,.085,.18,'rubber');
            for(let j=0;j<5;j++)add(g,'box',dark,0,.07,.10+j*.04,.075,.012,.02,'metal');
        }
        add(g,'box','#96ac91',0,.07,.20,.014,.022,.02,'metal');
        for(const r of records.slice(start)){r.weapon=key;if(r.surface==='metal')r.surface='gunmetal';}gunRecords[key]=g;
    }
    return {root,body,head,legs,arms,gun,records,gunRecords,phase:0,lastX:player.x,lastY:player.y,skin:player.skin,team:player.team,weapon:'rifle',speed:0,dead:0,lastHp:100,lastShots:player.shots||0,shotTime:-10000,hurtTime:-10000};
}
export function animateOperator(a,p,dt,now){
    const distance=Math.hypot(p.x-a.lastX,p.y-a.lastY);a.lastX=p.x;a.lastY=p.y;
    if(distance<2)a.phase+=distance*2.5;
    if(p.shots>a.lastShots)a.shotTime=now;a.lastShots=p.shots;
    if(p.hp<a.lastHp)a.hurtTime=now;
    if(p.hp<=0&&a.lastHp>0)a.dead=now;if(p.hp>0)a.dead=0;a.lastHp=p.hp;
    a.weapon=p.weapon||'rifle';a.root.position.set(p.x,0,p.y);a.root.rotation.set(0,Math.PI/2-p.yaw,0);
    const blend=1-Math.exp(-dt*14);a.speed=lerp(a.speed,Math.min(1,Math.hypot(p.vx||0,p.vy||0)/7.2),blend);
    const forward=((p.vx||0)*Math.cos(p.yaw)+(p.vy||0)*Math.sin(p.yaw))/7.2;
    const lateral=(-(p.vx||0)*Math.sin(p.yaw)+(p.vy||0)*Math.cos(p.yaw))/7.2;
    const knock=Math.max(0,1-(now-a.hurtTime)/220),shot=Math.max(0,1-(now-a.shotTime)/160);
    a.body.position.y=.95-a.speed*.06+Math.cos(a.phase*2)*.012*a.speed;
    a.body.rotation.set(-forward*.07-(p.pitch||0)*.16+shot*.025,Math.sin(a.phase)*a.speed*.025,-lateral*.055-knock*.04);
    a.head.rotation.x=-(p.pitch||0)*.7;a.head.rotation.y=-a.body.rotation.y;
    const spec=p.weapon==='shotgun'?.7:p.weapon==='pistol'?1.25:1.5;
    const reload=p.reload>0?Math.sin((1-p.reload/spec)*Math.PI):0;
    a.gun.rotation.x=-(p.pitch||0)*.65+reload*.55-shot*.05;
    a.gun.rotation.z=-reload*.28;a.gun.position.z=.24-shot*.025;
    for(const {side,thigh,shin,knee,boot} of a.legs){
        const phase=a.phase+(side>0?Math.PI:0),s=Math.sin(phase),lift=Math.max(0,Math.cos(phase))*.105*a.speed;
        const foot=V(side*.145-s*lateral*.22,.038+lift,s*forward*.38);
        const hip=V(side*.135,.92-a.speed*.06,0),ankle=foot.clone().add(V(0,.015,-.015)),bend=solve(hip,ankle,.455,.455,V(0,0,1));
        bone(thigh,hip,bend);bone(shin,bend,ankle);knee.position.copy(bend).add(V(0,0,.073));boot.position.copy(foot);boot.rotation.x=-Math.max(0,s)*.14*a.speed;
    }
    for(const {side,upper,lower,hand} of a.arms){
        const shoulder=V(side*.235,.425,.005),grip=p.weapon==='pistol'?V(.14+side*.027,.32,.30):side>0?V(.14,.30,.28):V(.14,.395,.54);
        if(side<0&&reload>0)grip.set(-.08,.04-reload*.16,.34);
        const pivot=V(.14,.39,.24);grip.sub(pivot).applyEuler(a.gun.rotation).add(pivot);
        const reach=grip.clone().sub(shoulder);if(reach.length()>.609)grip.copy(shoulder).add(reach.setLength(.609));
        const elbow=solve(shoulder,grip,.31,.30,V(side*.8,-.5,-.4));bone(upper,shoulder,elbow);bone(lower,elbow,grip);hand.position.copy(grip);hand.rotation.set(-.5,a.gun.rotation.x,side*.15);
    }
    if(a.dead){const fall=clamp((now-a.dead)/550,0,1);a.root.position.y=.24*fall;a.root.rotation.z=fall*Math.PI/2;a.body.rotation.x=.12;}
    a.root.updateMatrixWorld(true);a.hp=p.hp;
}
