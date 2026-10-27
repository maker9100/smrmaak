/* Merge world-space static parts across groups, retaining animated machinery. */
import * as THREE from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';

export function batchWorld(root,surfaces,excluded){
 root.updateMatrixWorld(true);const inverse=root.matrixWorld.clone().invert(),groups=new Map(),removed=[],geos=new Set();let before=0;
 const visit=node=>{
  if(excluded.has(node)||!node.visible)return;
  if(node.isMesh&&!node.isInstancedMesh&&node.name!=='arena-floor'&&!Array.isArray(node.material)){
   const source=node.material,kind=source.userData.surface,persistent=source.userData.persistent&&kind&&kind!=='glow';
   let material=source;
   if(persistent){const key='batched:'+kind;material=surfaces.cache.get(key);if(!material){material=surfaces.get(kind,'#ffffff').clone();material.vertexColors=true;material.userData.persistent=true;material.userData.surface=kind;surfaces.cache.set(key,material);}}
   let g=node.geometry.clone().applyMatrix4(new THREE.Matrix4().multiplyMatrices(inverse,node.matrixWorld));
   if(g.index){const plain=g.toNonIndexed();g.dispose();g=plain;}
   if(persistent){
    const position=g.attributes.position,normals=g.attributes.normal,colors=new Float32Array(position.count*3),base=source.color;
    const bound=new THREE.Box3().setFromBufferAttribute(position),span=Math.max(.1,bound.max.y-bound.min.y);
    for(let i=0;i<position.count;i++){const lower=(position.getY(i)-bound.min.y)/span,ao=kind==='glass'?1:.88+.08*Math.min(1,lower*3)+.04*Math.max(0,normals?.getY(i)||0);colors.set([base.r*ao,base.g*ao,base.b*ao],i*3);}g.setAttribute('color',new THREE.BufferAttribute(colors,3));
   }
   // Every group shares a vertex layout; UVs remain those of the original parts.
   if(!g.attributes.uv)g.setAttribute('uv',new THREE.BufferAttribute(new Float32Array(g.attributes.position.count*2),2));
   if(!g.attributes.normal)g.computeVertexNormals();
   for(const key of Object.keys(g.attributes))if(!['position','normal','uv',...(persistent?['color']:[])].includes(key))g.deleteAttribute(key);
   const list=groups.get(material)||[];list.push(g);groups.set(material,list);removed.push(node);if(!node.geometry.userData.shared)geos.add(node.geometry);before++;return;
  }
  for(const child of [...node.children])visit(child);
 };
 for(const child of [...root.children])visit(child);
 for(const n of removed)n.removeFromParent();for(const g of geos)g.dispose();
 let after=0;for(const [material,list] of groups){const merged=mergeGeometries(list);for(const g of list)g.dispose();if(!merged)throw Error('Static geometry layouts differ');const mesh=new THREE.Mesh(merged,material);mesh.name=material.userData.surface?'architecture-'+material.userData.surface:'world-detail-batch';mesh.castShadow=!material.transparent&&material.userData.surface!=='glow';mesh.receiveShadow=true;root.add(mesh);after++;}
 root.userData.batching={before,after,saved:before-after,revision:'world-batch-080'};
}
