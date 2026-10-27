(()=>{var ph=0,Ic=1,mh=2;var Pc=1,Bo=2,Cn=3,fn=0,He=1,we=2,Vn=0,Ai=1,An=2,Dc=3,Uc=4,gh=5,ti=100,xh=101,Ah=102,_h=103,yh=104,vh=200,Mh=201,bh=202,Eh=203,io=204,so=205,Sh=206,wh=207,Th=208,Rh=209,Ch=210,Ih=211,Ph=212,Dh=213,Uh=214,Fo=0,No=1,Oo=2,_i=3,zo=4,Ho=5,ko=6,Go=7,Lc=0,Lh=1,Bh=2,Wn=0,Fh=1,Nh=2,Oh=3,Vo=4,zh=5,Hh=6,kh=7;var Bc=300,wi=301,Ti=302,fs=303,Wo=304,pr=306,zn=1e3,$n=1001,ro=1002,Ge=1003,Gh=1004;var mr=1005;var pn=1006,Xo=1007;var ri=1008;var _n=1009,Fc=1010,Nc=1011,ps=1012,Yo=1013,oi=1014,yn=1015,ms=1016,qo=1017,Qo=1018,gs=1020,Oc=35902,zc=35899,Hc=1021,kc=1022,rn=1023,Ki=1026,xs=1027,Zo=1028,Jo=1029,Gc=1030,Ko=1031;var jo=1033,gr=33776,xr=33777,Ar=33778,_r=33779,$o=35840,ta=35841,ea=35842,na=35843,ia=36196,sa=37492,ra=37496,oa=37808,aa=37809,ca=37810,la=37811,ha=37812,ua=37813,da=37814,fa=37815,pa=37816,ma=37817,ga=37818,xa=37819,Aa=37820,_a=37821,ya=36492,va=36494,Ma=36495,ba=36283,Ea=36284,Sa=36285,wa=36286;var Hs=2300,oo=2301,no=2302,Ac=2400,_c=2401,yc=2402;var Vh=3200,Wh=3201;var Vc=0,Xh=1,Xn="",ie="srgb",yi="srgb-linear",ks="linear",re="srgb";var gi=7680;var vc=519,Yh=512,qh=513,Qh=514,Wc=515,Zh=516,Jh=517,Kh=518,jh=519,Mc=35044,Xc=35048;var Yc="300 es",dn=2e3,Gs=2001;var Hn=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){let n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){let n=this._listeners;if(n===void 0)return;let s=n[t];if(s!==void 0){let r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){let e=this._listeners;if(e===void 0)return;let n=e[t.type];if(n!==void 0){t.target=this;let s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,t);t.target=null}}},Le=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Bl=1234567,Fs=Math.PI/180,ji=180/Math.PI;function Ri(){let i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Le[i&255]+Le[i>>8&255]+Le[i>>16&255]+Le[i>>24&255]+"-"+Le[t&255]+Le[t>>8&255]+"-"+Le[t>>16&15|64]+Le[t>>24&255]+"-"+Le[e&63|128]+Le[e>>8&255]+"-"+Le[e>>16&255]+Le[e>>24&255]+Le[n&255]+Le[n>>8&255]+Le[n>>16&255]+Le[n>>24&255]).toLowerCase()}function Xt(i,t,e){return Math.max(t,Math.min(e,i))}function qc(i,t){return(i%t+t)%t}function gd(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function xd(i,t,e){return i!==t?(e-i)/(t-i):0}function Ns(i,t,e){return(1-e)*i+e*t}function Ad(i,t,e,n){return Ns(i,t,1-Math.exp(-e*n))}function _d(i,t=1){return t-Math.abs(qc(i,t*2)-t)}function yd(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function vd(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function Md(i,t){return i+Math.floor(Math.random()*(t-i+1))}function bd(i,t){return i+Math.random()*(t-i)}function Ed(i){return i*(.5-Math.random())}function Sd(i){i!==void 0&&(Bl=i);let t=Bl+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function wd(i){return i*Fs}function Td(i){return i*ji}function Rd(i){return(i&i-1)===0&&i!==0}function Cd(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Id(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Pd(i,t,e,n,s){let r=Math.cos,o=Math.sin,a=r(e/2),l=o(e/2),c=r((t+n)/2),h=o((t+n)/2),u=r((t-n)/2),d=o((t-n)/2),p=r((n-t)/2),x=o((n-t)/2);switch(s){case"XYX":i.set(a*h,l*u,l*d,a*c);break;case"YZY":i.set(l*d,a*h,l*u,a*c);break;case"ZXZ":i.set(l*u,l*d,a*h,a*c);break;case"XZX":i.set(a*h,l*x,l*p,a*c);break;case"YXY":i.set(l*p,a*h,l*x,a*c);break;case"ZYZ":i.set(l*x,l*p,a*h,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Zi(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Oe(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}var vn={DEG2RAD:Fs,RAD2DEG:ji,generateUUID:Ri,clamp:Xt,euclideanModulo:qc,mapLinear:gd,inverseLerp:xd,lerp:Ns,damp:Ad,pingpong:_d,smoothstep:yd,smootherstep:vd,randInt:Md,randFloat:bd,randFloatSpread:Ed,seededRandom:Sd,degToRad:wd,radToDeg:Td,isPowerOfTwo:Rd,ceilPowerOfTwo:Cd,floorPowerOfTwo:Id,setQuaternionFromProperEuler:Pd,normalize:Oe,denormalize:Zi},ot=class i{constructor(t=0,e=0){i.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Xt(this.x,t.x,e.x),this.y=Xt(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=Xt(this.x,t,e),this.y=Xt(this.y,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Xt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(Xt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*s+t.x,this.y=r*s+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},mn=class{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,o,a){let l=n[s+0],c=n[s+1],h=n[s+2],u=n[s+3],d=r[o+0],p=r[o+1],x=r[o+2],g=r[o+3];if(a===0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u;return}if(a===1){t[e+0]=d,t[e+1]=p,t[e+2]=x,t[e+3]=g;return}if(u!==g||l!==d||c!==p||h!==x){let m=1-a,f=l*d+c*p+h*x+u*g,A=f>=0?1:-1,v=1-f*f;if(v>Number.EPSILON){let R=Math.sqrt(v),b=Math.atan2(R,f*A);m=Math.sin(m*b)/R,a=Math.sin(a*b)/R}let y=a*A;if(l=l*m+d*y,c=c*m+p*y,h=h*m+x*y,u=u*m+g*y,m===1-a){let R=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=R,c*=R,h*=R,u*=R}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,s,r,o){let a=n[s],l=n[s+1],c=n[s+2],h=n[s+3],u=r[o],d=r[o+1],p=r[o+2],x=r[o+3];return t[e]=a*x+h*u+l*p-c*d,t[e+1]=l*x+h*d+c*u-a*p,t[e+2]=c*x+h*p+a*d-l*u,t[e+3]=h*x-a*u-l*d-c*p,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){let n=t._x,s=t._y,r=t._z,o=t._order,a=Math.cos,l=Math.sin,c=a(n/2),h=a(s/2),u=a(r/2),d=l(n/2),p=l(s/2),x=l(r/2);switch(o){case"XYZ":this._x=d*h*u+c*p*x,this._y=c*p*u-d*h*x,this._z=c*h*x+d*p*u,this._w=c*h*u-d*p*x;break;case"YXZ":this._x=d*h*u+c*p*x,this._y=c*p*u-d*h*x,this._z=c*h*x-d*p*u,this._w=c*h*u+d*p*x;break;case"ZXY":this._x=d*h*u-c*p*x,this._y=c*p*u+d*h*x,this._z=c*h*x+d*p*u,this._w=c*h*u-d*p*x;break;case"ZYX":this._x=d*h*u-c*p*x,this._y=c*p*u+d*h*x,this._z=c*h*x-d*p*u,this._w=c*h*u+d*p*x;break;case"YZX":this._x=d*h*u+c*p*x,this._y=c*p*u+d*h*x,this._z=c*h*x-d*p*u,this._w=c*h*u-d*p*x;break;case"XZY":this._x=d*h*u-c*p*x,this._y=c*p*u-d*h*x,this._z=c*h*x+d*p*u,this._w=c*h*u+d*p*x;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){let n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,n=e[0],s=e[4],r=e[8],o=e[1],a=e[5],l=e[9],c=e[2],h=e[6],u=e[10],d=n+a+u;if(d>0){let p=.5/Math.sqrt(d+1);this._w=.25/p,this._x=(h-l)*p,this._y=(r-c)*p,this._z=(o-s)*p}else if(n>a&&n>u){let p=2*Math.sqrt(1+n-a-u);this._w=(h-l)/p,this._x=.25*p,this._y=(s+o)/p,this._z=(r+c)/p}else if(a>u){let p=2*Math.sqrt(1+a-n-u);this._w=(r-c)/p,this._x=(s+o)/p,this._y=.25*p,this._z=(l+h)/p}else{let p=2*Math.sqrt(1+u-n-a);this._w=(o-s)/p,this._x=(r+c)/p,this._y=(l+h)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Xt(this.dot(t),-1,1)))}rotateTowards(t,e){let n=this.angleTo(t);if(n===0)return this;let s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let n=t._x,s=t._y,r=t._z,o=t._w,a=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+o*a+s*c-r*l,this._y=s*h+o*l+r*a-n*c,this._z=r*h+o*c+n*l-s*a,this._w=o*h-n*a-s*l-r*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);let n=this._x,s=this._y,r=this._z,o=this._w,a=o*t._w+n*t._x+s*t._y+r*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;let l=1-a*a;if(l<=Number.EPSILON){let p=1-e;return this._w=p*o+e*this._w,this._x=p*n+e*this._x,this._y=p*s+e*this._y,this._z=p*r+e*this._z,this.normalize(),this}let c=Math.sqrt(l),h=Math.atan2(c,a),u=Math.sin((1-e)*h)/c,d=Math.sin(e*h)/c;return this._w=o*u+this._w*d,this._x=n*u+this._x*d,this._y=s*u+this._y*d,this._z=r*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){let t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},I=class i{constructor(t=0,e=0,n=0){i.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Fl.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Fl.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(t){let e=this.x,n=this.y,s=this.z,r=t.x,o=t.y,a=t.z,l=t.w,c=2*(o*s-a*n),h=2*(a*e-r*s),u=2*(r*n-o*e);return this.x=e+l*c+o*u-a*h,this.y=n+l*h+a*c-r*u,this.z=s+l*u+r*h-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Xt(this.x,t.x,e.x),this.y=Xt(this.y,t.y,e.y),this.z=Xt(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=Xt(this.x,t,e),this.y=Xt(this.y,t,e),this.z=Xt(this.z,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Xt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let n=t.x,s=t.y,r=t.z,o=e.x,a=e.y,l=e.z;return this.x=s*l-r*a,this.y=r*o-n*l,this.z=n*a-s*o,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Xa.copy(this).projectOnVector(t),this.sub(Xa)}reflect(t){return this.sub(Xa.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(Xt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){let s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Xa=new I,Fl=new mn,Vt=class i{constructor(t,e,n,s,r,o,a,l,c){i.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,l,c)}set(t,e,n,s,r,o,a,l,c){let h=this.elements;return h[0]=t,h[1]=s,h[2]=a,h[3]=e,h[4]=r,h[5]=l,h[6]=n,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],h=n[4],u=n[7],d=n[2],p=n[5],x=n[8],g=s[0],m=s[3],f=s[6],A=s[1],v=s[4],y=s[7],R=s[2],b=s[5],T=s[8];return r[0]=o*g+a*A+l*R,r[3]=o*m+a*v+l*b,r[6]=o*f+a*y+l*T,r[1]=c*g+h*A+u*R,r[4]=c*m+h*v+u*b,r[7]=c*f+h*y+u*T,r[2]=d*g+p*A+x*R,r[5]=d*m+p*v+x*b,r[8]=d*f+p*y+x*T,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8];return e*o*h-e*a*c-n*r*h+n*a*l+s*r*c-s*o*l}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],u=h*o-a*c,d=a*l-h*r,p=c*r-o*l,x=e*u+n*d+s*p;if(x===0)return this.set(0,0,0,0,0,0,0,0,0);let g=1/x;return t[0]=u*g,t[1]=(s*c-h*n)*g,t[2]=(a*n-s*o)*g,t[3]=d*g,t[4]=(h*e-s*l)*g,t[5]=(s*r-a*e)*g,t[6]=p*g,t[7]=(n*l-c*e)*g,t[8]=(o*e-n*r)*g,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,o,a){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+t,-s*c,s*l,-s*(-c*o+l*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(Ya.makeScale(t,e)),this}rotate(t){return this.premultiply(Ya.makeRotation(-t)),this}translate(t,e){return this.premultiply(Ya.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}},Ya=new Vt;function Qc(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function Vs(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function $h(){let i=Vs("canvas");return i.style.display="block",i}var Nl={};function $i(i){i in Nl||(Nl[i]=!0,console.warn(i))}function tu(i,t,e){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}var Ol=new Vt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),zl=new Vt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Dd(){let i={enabled:!0,workingColorSpace:yi,spaces:{},convert:function(s,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===re&&(s.r=On(s.r),s.g=On(s.g),s.b=On(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===re&&(s.r=Ji(s.r),s.g=Ji(s.g),s.b=Ji(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Xn?ks:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,o){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return $i("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return $i("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[yi]:{primaries:t,whitePoint:n,transfer:ks,toXYZ:Ol,fromXYZ:zl,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:ie},outputColorSpaceConfig:{drawingBufferColorSpace:ie}},[ie]:{primaries:t,whitePoint:n,transfer:re,toXYZ:Ol,fromXYZ:zl,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:ie}}}),i}var jt=Dd();function On(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Ji(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var Fi,ao=class{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{Fi===void 0&&(Fi=Vs("canvas")),Fi.width=t.width,Fi.height=t.height;let s=Fi.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(t,0,0,t.width,t.height),n=Fi}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let e=Vs("canvas");e.width=t.width,e.height=t.height;let n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);let s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=On(r[o]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){let e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(On(e[n]/255)*255):e[n]=On(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},Ud=0,ts=class{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Ud++}),this.uuid=Ri(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){let e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):e instanceof VideoFrame?t.set(e.displayHeight,e.displayWidth,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(qa(s[o].image)):r.push(qa(s[o]))}else r=qa(s);n.url=r}return e||(t.images[this.uuid]=n),n}};function qa(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?ao.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var Ld=0,Qa=new I,ze=class i extends Hn{constructor(t=i.DEFAULT_IMAGE,e=i.DEFAULT_MAPPING,n=$n,s=$n,r=pn,o=ri,a=rn,l=_n,c=i.DEFAULT_ANISOTROPY,h=Xn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Ld++}),this.uuid=Ri(),this.name="",this.source=new ts(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new ot(0,0),this.repeat=new ot(1,1),this.center=new ot(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Vt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Qa).x}get height(){return this.source.getSize(Qa).y}get depth(){return this.source.getSize(Qa).z}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(let e in t){let n=t[e];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){console.warn(`THREE.Texture.setValues(): property '${e}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Bc)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case zn:t.x=t.x-Math.floor(t.x);break;case $n:t.x=t.x<0?0:1;break;case ro:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case zn:t.y=t.y-Math.floor(t.y);break;case $n:t.y=t.y<0?0:1;break;case ro:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}};ze.DEFAULT_IMAGE=null;ze.DEFAULT_MAPPING=Bc;ze.DEFAULT_ANISOTROPY=1;var se=class i{constructor(t=0,e=0,n=0,s=1){i.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*s+o[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r,l=t.elements,c=l[0],h=l[4],u=l[8],d=l[1],p=l[5],x=l[9],g=l[2],m=l[6],f=l[10];if(Math.abs(h-d)<.01&&Math.abs(u-g)<.01&&Math.abs(x-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+g)<.1&&Math.abs(x+m)<.1&&Math.abs(c+p+f-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;let v=(c+1)/2,y=(p+1)/2,R=(f+1)/2,b=(h+d)/4,T=(u+g)/4,P=(x+m)/4;return v>y&&v>R?v<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(v),s=b/n,r=T/n):y>R?y<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(y),n=b/s,r=P/s):R<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(R),n=T/r,s=P/r),this.set(n,s,r,e),this}let A=Math.sqrt((m-x)*(m-x)+(u-g)*(u-g)+(d-h)*(d-h));return Math.abs(A)<.001&&(A=1),this.x=(m-x)/A,this.y=(u-g)/A,this.z=(d-h)/A,this.w=Math.acos((c+p+f-1)/2),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Xt(this.x,t.x,e.x),this.y=Xt(this.y,t.y,e.y),this.z=Xt(this.z,t.z,e.z),this.w=Xt(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=Xt(this.x,t,e),this.y=Xt(this.y,t,e),this.z=Xt(this.z,t,e),this.w=Xt(this.w,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Xt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},co=class extends Hn{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:pn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new se(0,0,t,e),this.scissorTest=!1,this.viewport=new se(0,0,t,e);let s={width:t,height:e,depth:n.depth},r=new ze(s);this.textures=[];let o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(t={}){let e={minFilter:pn,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n,this.textures[s].isArrayTexture=this.textures[s].image.depth>1;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;let s=Object.assign({},t.textures[e].image);this.textures[e].source=new ts(s)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},Sn=class extends co{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}},Ws=class extends ze{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Ge,this.minFilter=Ge,this.wrapR=$n,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}};var lo=class extends ze{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Ge,this.minFilter=Ge,this.wrapR=$n,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var nn=class{constructor(t=new I(1/0,1/0,1/0),e=new I(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(ln.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(ln.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let n=ln.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);let n=t.geometry;if(n!==void 0){let r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,ln):ln.fromBufferAttribute(r,o),ln.applyMatrix4(t.matrixWorld),this.expandByPoint(ln);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Dr.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Dr.copy(n.boundingBox)),Dr.applyMatrix4(t.matrixWorld),this.union(Dr)}let s=t.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,ln),ln.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Ts),Ur.subVectors(this.max,Ts),Ni.subVectors(t.a,Ts),Oi.subVectors(t.b,Ts),zi.subVectors(t.c,Ts),Yn.subVectors(Oi,Ni),qn.subVectors(zi,Oi),di.subVectors(Ni,zi);let e=[0,-Yn.z,Yn.y,0,-qn.z,qn.y,0,-di.z,di.y,Yn.z,0,-Yn.x,qn.z,0,-qn.x,di.z,0,-di.x,-Yn.y,Yn.x,0,-qn.y,qn.x,0,-di.y,di.x,0];return!Za(e,Ni,Oi,zi,Ur)||(e=[1,0,0,0,1,0,0,0,1],!Za(e,Ni,Oi,zi,Ur))?!1:(Lr.crossVectors(Yn,qn),e=[Lr.x,Lr.y,Lr.z],Za(e,Ni,Oi,zi,Ur))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,ln).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(ln).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Un[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Un[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Un[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Un[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Un[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Un[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Un[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Un[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Un),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}},Un=[new I,new I,new I,new I,new I,new I,new I,new I],ln=new I,Dr=new nn,Ni=new I,Oi=new I,zi=new I,Yn=new I,qn=new I,di=new I,Ts=new I,Ur=new I,Lr=new I,fi=new I;function Za(i,t,e,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){fi.fromArray(i,r);let a=s.x*Math.abs(fi.x)+s.y*Math.abs(fi.y)+s.z*Math.abs(fi.z),l=t.dot(fi),c=e.dot(fi),h=n.dot(fi);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}var Bd=new nn,Rs=new I,Ja=new I,kn=class{constructor(t=new I,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let n=this.center;e!==void 0?n.copy(e):Bd.setFromPoints(t).getCenter(n);let s=0;for(let r=0,o=t.length;r<o;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Rs.subVectors(t,this.center);let e=Rs.lengthSq();if(e>this.radius*this.radius){let n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(Rs,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Ja.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Rs.copy(t.center).add(Ja)),this.expandByPoint(Rs.copy(t.center).sub(Ja))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}},Ln=new I,Ka=new I,Br=new I,Qn=new I,ja=new I,Fr=new I,$a=new I,es=class{constructor(t=new I,e=new I(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Ln)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);let n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let e=Ln.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Ln.copy(this.origin).addScaledVector(this.direction,e),Ln.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){Ka.copy(t).add(e).multiplyScalar(.5),Br.copy(e).sub(t).normalize(),Qn.copy(this.origin).sub(Ka);let r=t.distanceTo(e)*.5,o=-this.direction.dot(Br),a=Qn.dot(this.direction),l=-Qn.dot(Br),c=Qn.lengthSq(),h=Math.abs(1-o*o),u,d,p,x;if(h>0)if(u=o*l-a,d=o*a-l,x=r*h,u>=0)if(d>=-x)if(d<=x){let g=1/h;u*=g,d*=g,p=u*(u+o*d+2*a)+d*(o*u+d+2*l)+c}else d=r,u=Math.max(0,-(o*d+a)),p=-u*u+d*(d+2*l)+c;else d=-r,u=Math.max(0,-(o*d+a)),p=-u*u+d*(d+2*l)+c;else d<=-x?(u=Math.max(0,-(-o*r+a)),d=u>0?-r:Math.min(Math.max(-r,-l),r),p=-u*u+d*(d+2*l)+c):d<=x?(u=0,d=Math.min(Math.max(-r,-l),r),p=d*(d+2*l)+c):(u=Math.max(0,-(o*r+a)),d=u>0?r:Math.min(Math.max(-r,-l),r),p=-u*u+d*(d+2*l)+c);else d=o>0?-r:r,u=Math.max(0,-(o*d+a)),p=-u*u+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(Ka).addScaledVector(Br,d),p}intersectSphere(t,e){Ln.subVectors(t.center,this.origin);let n=Ln.dot(this.direction),s=Ln.dot(Ln)-n*n,r=t.radius*t.radius;if(s>r)return null;let o=Math.sqrt(r-s),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,e):this.at(a,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){let n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){let e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,o,a,l,c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(t.min.x-d.x)*c,s=(t.max.x-d.x)*c):(n=(t.max.x-d.x)*c,s=(t.min.x-d.x)*c),h>=0?(r=(t.min.y-d.y)*h,o=(t.max.y-d.y)*h):(r=(t.max.y-d.y)*h,o=(t.min.y-d.y)*h),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),u>=0?(a=(t.min.z-d.z)*u,l=(t.max.z-d.z)*u):(a=(t.max.z-d.z)*u,l=(t.min.z-d.z)*u),n>l||a>s)||((a>n||n!==n)&&(n=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,Ln)!==null}intersectTriangle(t,e,n,s,r){ja.subVectors(e,t),Fr.subVectors(n,t),$a.crossVectors(ja,Fr);let o=this.direction.dot($a),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Qn.subVectors(this.origin,t);let l=a*this.direction.dot(Fr.crossVectors(Qn,Fr));if(l<0)return null;let c=a*this.direction.dot(ja.cross(Qn));if(c<0||l+c>o)return null;let h=-a*Qn.dot($a);return h<0?null:this.at(h/o,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},te=class i{constructor(t,e,n,s,r,o,a,l,c,h,u,d,p,x,g,m){i.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,l,c,h,u,d,p,x,g,m)}set(t,e,n,s,r,o,a,l,c,h,u,d,p,x,g,m){let f=this.elements;return f[0]=t,f[4]=e,f[8]=n,f[12]=s,f[1]=r,f[5]=o,f[9]=a,f[13]=l,f[2]=c,f[6]=h,f[10]=u,f[14]=d,f[3]=p,f[7]=x,f[11]=g,f[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){let e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){let e=this.elements,n=t.elements,s=1/Hi.setFromMatrixColumn(t,0).length(),r=1/Hi.setFromMatrixColumn(t,1).length(),o=1/Hi.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,n=t.x,s=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(t.order==="XYZ"){let d=o*h,p=o*u,x=a*h,g=a*u;e[0]=l*h,e[4]=-l*u,e[8]=c,e[1]=p+x*c,e[5]=d-g*c,e[9]=-a*l,e[2]=g-d*c,e[6]=x+p*c,e[10]=o*l}else if(t.order==="YXZ"){let d=l*h,p=l*u,x=c*h,g=c*u;e[0]=d+g*a,e[4]=x*a-p,e[8]=o*c,e[1]=o*u,e[5]=o*h,e[9]=-a,e[2]=p*a-x,e[6]=g+d*a,e[10]=o*l}else if(t.order==="ZXY"){let d=l*h,p=l*u,x=c*h,g=c*u;e[0]=d-g*a,e[4]=-o*u,e[8]=x+p*a,e[1]=p+x*a,e[5]=o*h,e[9]=g-d*a,e[2]=-o*c,e[6]=a,e[10]=o*l}else if(t.order==="ZYX"){let d=o*h,p=o*u,x=a*h,g=a*u;e[0]=l*h,e[4]=x*c-p,e[8]=d*c+g,e[1]=l*u,e[5]=g*c+d,e[9]=p*c-x,e[2]=-c,e[6]=a*l,e[10]=o*l}else if(t.order==="YZX"){let d=o*l,p=o*c,x=a*l,g=a*c;e[0]=l*h,e[4]=g-d*u,e[8]=x*u+p,e[1]=u,e[5]=o*h,e[9]=-a*h,e[2]=-c*h,e[6]=p*u+x,e[10]=d-g*u}else if(t.order==="XZY"){let d=o*l,p=o*c,x=a*l,g=a*c;e[0]=l*h,e[4]=-u,e[8]=c*h,e[1]=d*u+g,e[5]=o*h,e[9]=p*u-x,e[2]=x*u-p,e[6]=a*h,e[10]=g*u+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Fd,t,Nd)}lookAt(t,e,n){let s=this.elements;return qe.subVectors(t,e),qe.lengthSq()===0&&(qe.z=1),qe.normalize(),Zn.crossVectors(n,qe),Zn.lengthSq()===0&&(Math.abs(n.z)===1?qe.x+=1e-4:qe.z+=1e-4,qe.normalize(),Zn.crossVectors(n,qe)),Zn.normalize(),Nr.crossVectors(qe,Zn),s[0]=Zn.x,s[4]=Nr.x,s[8]=qe.x,s[1]=Zn.y,s[5]=Nr.y,s[9]=qe.y,s[2]=Zn.z,s[6]=Nr.z,s[10]=qe.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],h=n[1],u=n[5],d=n[9],p=n[13],x=n[2],g=n[6],m=n[10],f=n[14],A=n[3],v=n[7],y=n[11],R=n[15],b=s[0],T=s[4],P=s[8],M=s[12],_=s[1],S=s[5],D=s[9],L=s[13],z=s[2],F=s[6],H=s[10],q=s[14],G=s[3],lt=s[7],At=s[11],vt=s[15];return r[0]=o*b+a*_+l*z+c*G,r[4]=o*T+a*S+l*F+c*lt,r[8]=o*P+a*D+l*H+c*At,r[12]=o*M+a*L+l*q+c*vt,r[1]=h*b+u*_+d*z+p*G,r[5]=h*T+u*S+d*F+p*lt,r[9]=h*P+u*D+d*H+p*At,r[13]=h*M+u*L+d*q+p*vt,r[2]=x*b+g*_+m*z+f*G,r[6]=x*T+g*S+m*F+f*lt,r[10]=x*P+g*D+m*H+f*At,r[14]=x*M+g*L+m*q+f*vt,r[3]=A*b+v*_+y*z+R*G,r[7]=A*T+v*S+y*F+R*lt,r[11]=A*P+v*D+y*H+R*At,r[15]=A*M+v*L+y*q+R*vt,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],o=t[1],a=t[5],l=t[9],c=t[13],h=t[2],u=t[6],d=t[10],p=t[14],x=t[3],g=t[7],m=t[11],f=t[15];return x*(+r*l*u-s*c*u-r*a*d+n*c*d+s*a*p-n*l*p)+g*(+e*l*p-e*c*d+r*o*d-s*o*p+s*c*h-r*l*h)+m*(+e*c*u-e*a*p-r*o*u+n*o*p+r*a*h-n*c*h)+f*(-s*a*h-e*l*u+e*a*d+s*o*u-n*o*d+n*l*h)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){let s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],u=t[9],d=t[10],p=t[11],x=t[12],g=t[13],m=t[14],f=t[15],A=u*m*c-g*d*c+g*l*p-a*m*p-u*l*f+a*d*f,v=x*d*c-h*m*c-x*l*p+o*m*p+h*l*f-o*d*f,y=h*g*c-x*u*c+x*a*p-o*g*p-h*a*f+o*u*f,R=x*u*l-h*g*l-x*a*d+o*g*d+h*a*m-o*u*m,b=e*A+n*v+s*y+r*R;if(b===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let T=1/b;return t[0]=A*T,t[1]=(g*d*r-u*m*r-g*s*p+n*m*p+u*s*f-n*d*f)*T,t[2]=(a*m*r-g*l*r+g*s*c-n*m*c-a*s*f+n*l*f)*T,t[3]=(u*l*r-a*d*r-u*s*c+n*d*c+a*s*p-n*l*p)*T,t[4]=v*T,t[5]=(h*m*r-x*d*r+x*s*p-e*m*p-h*s*f+e*d*f)*T,t[6]=(x*l*r-o*m*r-x*s*c+e*m*c+o*s*f-e*l*f)*T,t[7]=(o*d*r-h*l*r+h*s*c-e*d*c-o*s*p+e*l*p)*T,t[8]=y*T,t[9]=(x*u*r-h*g*r-x*n*p+e*g*p+h*n*f-e*u*f)*T,t[10]=(o*g*r-x*a*r+x*n*c-e*g*c-o*n*f+e*a*f)*T,t[11]=(h*a*r-o*u*r-h*n*c+e*u*c+o*n*p-e*a*p)*T,t[12]=R*T,t[13]=(h*g*s-x*u*s+x*n*d-e*g*d-h*n*m+e*u*m)*T,t[14]=(x*a*s-o*g*s-x*n*l+e*g*l+o*n*m-e*a*m)*T,t[15]=(o*u*s-h*a*s+h*n*l-e*u*l-o*n*d+e*a*d)*T,this}scale(t){let e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){let e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let n=Math.cos(e),s=Math.sin(e),r=1-n,o=t.x,a=t.y,l=t.z,c=r*o,h=r*a;return this.set(c*o+n,c*a-s*l,c*l+s*a,0,c*a+s*l,h*a+n,h*l-s*o,0,c*l-s*a,h*l+s*o,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,o){return this.set(1,n,r,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){let s=this.elements,r=e._x,o=e._y,a=e._z,l=e._w,c=r+r,h=o+o,u=a+a,d=r*c,p=r*h,x=r*u,g=o*h,m=o*u,f=a*u,A=l*c,v=l*h,y=l*u,R=n.x,b=n.y,T=n.z;return s[0]=(1-(g+f))*R,s[1]=(p+y)*R,s[2]=(x-v)*R,s[3]=0,s[4]=(p-y)*b,s[5]=(1-(d+f))*b,s[6]=(m+A)*b,s[7]=0,s[8]=(x+v)*T,s[9]=(m-A)*T,s[10]=(1-(d+g))*T,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){let s=this.elements,r=Hi.set(s[0],s[1],s[2]).length(),o=Hi.set(s[4],s[5],s[6]).length(),a=Hi.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],hn.copy(this);let c=1/r,h=1/o,u=1/a;return hn.elements[0]*=c,hn.elements[1]*=c,hn.elements[2]*=c,hn.elements[4]*=h,hn.elements[5]*=h,hn.elements[6]*=h,hn.elements[8]*=u,hn.elements[9]*=u,hn.elements[10]*=u,e.setFromRotationMatrix(hn),n.x=r,n.y=o,n.z=a,this}makePerspective(t,e,n,s,r,o,a=dn,l=!1){let c=this.elements,h=2*r/(e-t),u=2*r/(n-s),d=(e+t)/(e-t),p=(n+s)/(n-s),x,g;if(l)x=r/(o-r),g=o*r/(o-r);else if(a===dn)x=-(o+r)/(o-r),g=-2*o*r/(o-r);else if(a===Gs)x=-o/(o-r),g=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=p,c[13]=0,c[2]=0,c[6]=0,c[10]=x,c[14]=g,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,s,r,o,a=dn,l=!1){let c=this.elements,h=2/(e-t),u=2/(n-s),d=-(e+t)/(e-t),p=-(n+s)/(n-s),x,g;if(l)x=1/(o-r),g=o/(o-r);else if(a===dn)x=-2/(o-r),g=-(o+r)/(o-r);else if(a===Gs)x=-1/(o-r),g=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=p,c[2]=0,c[6]=0,c[10]=x,c[14]=g,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}},Hi=new I,hn=new te,Fd=new I(0,0,0),Nd=new I(1,1,1),Zn=new I,Nr=new I,qe=new I,Hl=new te,kl=new mn,Ze=class i{constructor(t=0,e=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){let s=t.elements,r=s[0],o=s[4],a=s[8],l=s[1],c=s[5],h=s[9],u=s[2],d=s[6],p=s[10];switch(e){case"XYZ":this._y=Math.asin(Xt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,p),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Xt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Xt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,p),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Xt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,p),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(Xt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,p));break;case"XZY":this._z=Math.asin(-Xt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Hl.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Hl,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return kl.setFromEuler(this),this.setFromQuaternion(kl,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Ze.DEFAULT_ORDER="XYZ";var ns=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},Od=0,Gl=new I,ki=new mn,Bn=new te,Or=new I,Cs=new I,zd=new I,Hd=new mn,Vl=new I(1,0,0),Wl=new I(0,1,0),Xl=new I(0,0,1),Yl={type:"added"},kd={type:"removed"},Gi={type:"childadded",child:null},tc={type:"childremoved",child:null},ge=class i extends Hn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Od++}),this.uuid=Ri(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let t=new I,e=new Ze,n=new mn,s=new I(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new te},normalMatrix:{value:new Vt}}),this.matrix=new te,this.matrixWorld=new te,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new ns,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return ki.setFromAxisAngle(t,e),this.quaternion.multiply(ki),this}rotateOnWorldAxis(t,e){return ki.setFromAxisAngle(t,e),this.quaternion.premultiply(ki),this}rotateX(t){return this.rotateOnAxis(Vl,t)}rotateY(t){return this.rotateOnAxis(Wl,t)}rotateZ(t){return this.rotateOnAxis(Xl,t)}translateOnAxis(t,e){return Gl.copy(t).applyQuaternion(this.quaternion),this.position.add(Gl.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Vl,t)}translateY(t){return this.translateOnAxis(Wl,t)}translateZ(t){return this.translateOnAxis(Xl,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Bn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Or.copy(t):Or.set(t,e,n);let s=this.parent;this.updateWorldMatrix(!0,!1),Cs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Bn.lookAt(Cs,Or,this.up):Bn.lookAt(Or,Cs,this.up),this.quaternion.setFromRotationMatrix(Bn),s&&(Bn.extractRotation(s.matrixWorld),ki.setFromRotationMatrix(Bn),this.quaternion.premultiply(ki.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Yl),Gi.child=t,this.dispatchEvent(Gi),Gi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(kd),tc.child=t,this.dispatchEvent(tc),tc.child=null),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Bn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Bn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Bn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Yl),Gi.child=t,this.dispatchEvent(Gi),Gi.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){let o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Cs,t,zd),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Cs,Hd,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){let e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){let n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(t){let e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(a=>({...a})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(t),s.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let u=l[c];r(t.shapes,u)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(t.materials,this.material[l]));s.material=a}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){let l=this.animations[a];s.animations.push(r(t.animations,l))}}if(e){let a=o(t.geometries),l=o(t.materials),c=o(t.textures),h=o(t.images),u=o(t.shapes),d=o(t.skeletons),p=o(t.animations),x=o(t.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),p.length>0&&(n.animations=p),x.length>0&&(n.nodes=x)}return n.object=s,n;function o(a){let l=[];for(let c in a){let h=a[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){let s=t.children[n];this.add(s.clone())}return this}};ge.DEFAULT_UP=new I(0,1,0);ge.DEFAULT_MATRIX_AUTO_UPDATE=!0;ge.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var un=new I,Fn=new I,ec=new I,Nn=new I,Vi=new I,Wi=new I,ql=new I,nc=new I,ic=new I,sc=new I,rc=new se,oc=new se,ac=new se,jn=class i{constructor(t=new I,e=new I,n=new I){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),un.subVectors(t,e),s.cross(un);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){un.subVectors(s,e),Fn.subVectors(n,e),ec.subVectors(t,e);let o=un.dot(un),a=un.dot(Fn),l=un.dot(ec),c=Fn.dot(Fn),h=Fn.dot(ec),u=o*c-a*a;if(u===0)return r.set(0,0,0),null;let d=1/u,p=(c*l-a*h)*d,x=(o*h-a*l)*d;return r.set(1-p-x,x,p)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,Nn)===null?!1:Nn.x>=0&&Nn.y>=0&&Nn.x+Nn.y<=1}static getInterpolation(t,e,n,s,r,o,a,l){return this.getBarycoord(t,e,n,s,Nn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Nn.x),l.addScaledVector(o,Nn.y),l.addScaledVector(a,Nn.z),l)}static getInterpolatedAttribute(t,e,n,s,r,o){return rc.setScalar(0),oc.setScalar(0),ac.setScalar(0),rc.fromBufferAttribute(t,e),oc.fromBufferAttribute(t,n),ac.fromBufferAttribute(t,s),o.setScalar(0),o.addScaledVector(rc,r.x),o.addScaledVector(oc,r.y),o.addScaledVector(ac,r.z),o}static isFrontFacing(t,e,n,s){return un.subVectors(n,e),Fn.subVectors(t,e),un.cross(Fn).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return un.subVectors(this.c,this.b),Fn.subVectors(this.a,this.b),un.cross(Fn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return i.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return i.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,r){return i.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return i.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return i.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){let n=this.a,s=this.b,r=this.c,o,a;Vi.subVectors(s,n),Wi.subVectors(r,n),nc.subVectors(t,n);let l=Vi.dot(nc),c=Wi.dot(nc);if(l<=0&&c<=0)return e.copy(n);ic.subVectors(t,s);let h=Vi.dot(ic),u=Wi.dot(ic);if(h>=0&&u<=h)return e.copy(s);let d=l*u-h*c;if(d<=0&&l>=0&&h<=0)return o=l/(l-h),e.copy(n).addScaledVector(Vi,o);sc.subVectors(t,r);let p=Vi.dot(sc),x=Wi.dot(sc);if(x>=0&&p<=x)return e.copy(r);let g=p*c-l*x;if(g<=0&&c>=0&&x<=0)return a=c/(c-x),e.copy(n).addScaledVector(Wi,a);let m=h*x-p*u;if(m<=0&&u-h>=0&&p-x>=0)return ql.subVectors(r,s),a=(u-h)/(u-h+(p-x)),e.copy(s).addScaledVector(ql,a);let f=1/(m+g+d);return o=g*f,a=d*f,e.copy(n).addScaledVector(Vi,o).addScaledVector(Wi,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},eu={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Jn={h:0,s:0,l:0},zr={h:0,s:0,l:0};function cc(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}var Nt=class{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){let s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=ie){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,jt.colorSpaceToWorking(this,e),this}setRGB(t,e,n,s=jt.workingColorSpace){return this.r=t,this.g=e,this.b=n,jt.colorSpaceToWorking(this,s),this}setHSL(t,e,n,s=jt.workingColorSpace){if(t=qc(t,1),e=Xt(e,0,1),n=Xt(n,0,1),e===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=cc(o,r,t+1/3),this.g=cc(o,r,t),this.b=cc(o,r,t-1/3)}return jt.colorSpaceToWorking(this,s),this}setStyle(t,e=ie){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r,o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){let r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=ie){let n=eu[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=On(t.r),this.g=On(t.g),this.b=On(t.b),this}copyLinearToSRGB(t){return this.r=Ji(t.r),this.g=Ji(t.g),this.b=Ji(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=ie){return jt.workingToColorSpace(Be.copy(this),t),Math.round(Xt(Be.r*255,0,255))*65536+Math.round(Xt(Be.g*255,0,255))*256+Math.round(Xt(Be.b*255,0,255))}getHexString(t=ie){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=jt.workingColorSpace){jt.workingToColorSpace(Be.copy(this),e);let n=Be.r,s=Be.g,r=Be.b,o=Math.max(n,s,r),a=Math.min(n,s,r),l,c,h=(a+o)/2;if(a===o)l=0,c=0;else{let u=o-a;switch(c=h<=.5?u/(o+a):u/(2-o-a),o){case n:l=(s-r)/u+(s<r?6:0);break;case s:l=(r-n)/u+2;break;case r:l=(n-s)/u+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=jt.workingColorSpace){return jt.workingToColorSpace(Be.copy(this),e),t.r=Be.r,t.g=Be.g,t.b=Be.b,t}getStyle(t=ie){jt.workingToColorSpace(Be.copy(this),t);let e=Be.r,n=Be.g,s=Be.b;return t!==ie?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(Jn),this.setHSL(Jn.h+t,Jn.s+e,Jn.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Jn),t.getHSL(zr);let n=Ns(Jn.h,zr.h,e),s=Ns(Jn.s,zr.s,e),r=Ns(Jn.l,zr.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Be=new Nt;Nt.NAMES=eu;var Gd=0,Gn=class extends Hn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Gd++}),this.uuid=Ri(),this.name="",this.type="Material",this.blending=Ai,this.side=fn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=io,this.blendDst=so,this.blendEquation=ti,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Nt(0,0,0),this.blendAlpha=0,this.depthFunc=_i,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=vc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=gi,this.stencilZFail=gi,this.stencilZPass=gi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let e in t){let n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Ai&&(n.blending=this.blending),this.side!==fn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==io&&(n.blendSrc=this.blendSrc),this.blendDst!==so&&(n.blendDst=this.blendDst),this.blendEquation!==ti&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==_i&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==vc&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==gi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==gi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==gi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let o=[];for(let a in r){let l=r[a];delete l.metadata,o.push(l)}return o}if(e){let r=s(t.textures),o=s(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let e=t.clippingPlanes,n=null;if(e!==null){let s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}},ae=class extends Gn{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Nt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ze,this.combine=Lc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}};var Se=new I,Hr=new ot,Vd=0,ve=class{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Vd++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Mc,this.updateRanges=[],this.gpuType=yn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Hr.fromBufferAttribute(this,e),Hr.applyMatrix3(t),this.setXY(e,Hr.x,Hr.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Se.fromBufferAttribute(this,e),Se.applyMatrix3(t),this.setXYZ(e,Se.x,Se.y,Se.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Se.fromBufferAttribute(this,e),Se.applyMatrix4(t),this.setXYZ(e,Se.x,Se.y,Se.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Se.fromBufferAttribute(this,e),Se.applyNormalMatrix(t),this.setXYZ(e,Se.x,Se.y,Se.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Se.fromBufferAttribute(this,e),Se.transformDirection(t),this.setXYZ(e,Se.x,Se.y,Se.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Zi(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Oe(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Zi(e,this.array)),e}setX(t,e){return this.normalized&&(e=Oe(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Zi(e,this.array)),e}setY(t,e){return this.normalized&&(e=Oe(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Zi(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Oe(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Zi(e,this.array)),e}setW(t,e){return this.normalized&&(e=Oe(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Oe(e,this.array),n=Oe(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=Oe(e,this.array),n=Oe(n,this.array),s=Oe(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=Oe(e,this.array),n=Oe(n,this.array),s=Oe(s,this.array),r=Oe(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Mc&&(t.usage=this.usage),t}};var Xs=class extends ve{constructor(t,e,n){super(new Uint16Array(t),e,n)}};var Ys=class extends ve{constructor(t,e,n){super(new Uint32Array(t),e,n)}};var zt=class extends ve{constructor(t,e,n){super(new Float32Array(t),e,n)}},Wd=0,en=new te,lc=new ge,Xi=new I,Qe=new nn,Is=new nn,Pe=new I,ue=class i extends Hn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Wd++}),this.uuid=Ri(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Qc(t)?Ys:Xs)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new Vt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return en.makeRotationFromQuaternion(t),this.applyMatrix4(en),this}rotateX(t){return en.makeRotationX(t),this.applyMatrix4(en),this}rotateY(t){return en.makeRotationY(t),this.applyMatrix4(en),this}rotateZ(t){return en.makeRotationZ(t),this.applyMatrix4(en),this}translate(t,e,n){return en.makeTranslation(t,e,n),this.applyMatrix4(en),this}scale(t,e,n){return en.makeScale(t,e,n),this.applyMatrix4(en),this}lookAt(t){return lc.lookAt(t),lc.updateMatrix(),this.applyMatrix4(lc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Xi).negate(),this.translate(Xi.x,Xi.y,Xi.z),this}setFromPoints(t){let e=this.getAttribute("position");if(e===void 0){let n=[];for(let s=0,r=t.length;s<r;s++){let o=t[s];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new zt(n,3))}else{let n=Math.min(t.length,e.count);for(let s=0;s<n;s++){let r=t[s];e.setXYZ(s,r.x,r.y,r.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new nn);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new I(-1/0,-1/0,-1/0),new I(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){let r=e[n];Qe.setFromBufferAttribute(r),this.morphTargetsRelative?(Pe.addVectors(this.boundingBox.min,Qe.min),this.boundingBox.expandByPoint(Pe),Pe.addVectors(this.boundingBox.max,Qe.max),this.boundingBox.expandByPoint(Pe)):(this.boundingBox.expandByPoint(Qe.min),this.boundingBox.expandByPoint(Qe.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new kn);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new I,1/0);return}if(t){let n=this.boundingSphere.center;if(Qe.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){let a=e[r];Is.setFromBufferAttribute(a),this.morphTargetsRelative?(Pe.addVectors(Qe.min,Is.min),Qe.expandByPoint(Pe),Pe.addVectors(Qe.max,Is.max),Qe.expandByPoint(Pe)):(Qe.expandByPoint(Is.min),Qe.expandByPoint(Is.max))}Qe.getCenter(n);let s=0;for(let r=0,o=t.count;r<o;r++)Pe.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(Pe));if(e)for(let r=0,o=e.length;r<o;r++){let a=e[r],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)Pe.fromBufferAttribute(a,c),l&&(Xi.fromBufferAttribute(t,c),Pe.add(Xi)),s=Math.max(s,n.distanceToSquared(Pe))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=e.position,s=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new ve(new Float32Array(4*n.count),4));let o=this.getAttribute("tangent"),a=[],l=[];for(let P=0;P<n.count;P++)a[P]=new I,l[P]=new I;let c=new I,h=new I,u=new I,d=new ot,p=new ot,x=new ot,g=new I,m=new I;function f(P,M,_){c.fromBufferAttribute(n,P),h.fromBufferAttribute(n,M),u.fromBufferAttribute(n,_),d.fromBufferAttribute(r,P),p.fromBufferAttribute(r,M),x.fromBufferAttribute(r,_),h.sub(c),u.sub(c),p.sub(d),x.sub(d);let S=1/(p.x*x.y-x.x*p.y);isFinite(S)&&(g.copy(h).multiplyScalar(x.y).addScaledVector(u,-p.y).multiplyScalar(S),m.copy(u).multiplyScalar(p.x).addScaledVector(h,-x.x).multiplyScalar(S),a[P].add(g),a[M].add(g),a[_].add(g),l[P].add(m),l[M].add(m),l[_].add(m))}let A=this.groups;A.length===0&&(A=[{start:0,count:t.count}]);for(let P=0,M=A.length;P<M;++P){let _=A[P],S=_.start,D=_.count;for(let L=S,z=S+D;L<z;L+=3)f(t.getX(L+0),t.getX(L+1),t.getX(L+2))}let v=new I,y=new I,R=new I,b=new I;function T(P){R.fromBufferAttribute(s,P),b.copy(R);let M=a[P];v.copy(M),v.sub(R.multiplyScalar(R.dot(M))).normalize(),y.crossVectors(b,M);let S=y.dot(l[P])<0?-1:1;o.setXYZW(P,v.x,v.y,v.z,S)}for(let P=0,M=A.length;P<M;++P){let _=A[P],S=_.start,D=_.count;for(let L=S,z=S+D;L<z;L+=3)T(t.getX(L+0)),T(t.getX(L+1)),T(t.getX(L+2))}}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new ve(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let d=0,p=n.count;d<p;d++)n.setXYZ(d,0,0,0);let s=new I,r=new I,o=new I,a=new I,l=new I,c=new I,h=new I,u=new I;if(t)for(let d=0,p=t.count;d<p;d+=3){let x=t.getX(d+0),g=t.getX(d+1),m=t.getX(d+2);s.fromBufferAttribute(e,x),r.fromBufferAttribute(e,g),o.fromBufferAttribute(e,m),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),a.fromBufferAttribute(n,x),l.fromBufferAttribute(n,g),c.fromBufferAttribute(n,m),a.add(h),l.add(h),c.add(h),n.setXYZ(x,a.x,a.y,a.z),n.setXYZ(g,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let d=0,p=e.count;d<p;d+=3)s.fromBufferAttribute(e,d+0),r.fromBufferAttribute(e,d+1),o.fromBufferAttribute(e,d+2),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Pe.fromBufferAttribute(t,e),Pe.normalize(),t.setXYZ(e,Pe.x,Pe.y,Pe.z)}toNonIndexed(){function t(a,l){let c=a.array,h=a.itemSize,u=a.normalized,d=new c.constructor(l.length*h),p=0,x=0;for(let g=0,m=l.length;g<m;g++){a.isInterleavedBufferAttribute?p=l[g]*a.data.stride+a.offset:p=l[g]*h;for(let f=0;f<h;f++)d[x++]=c[p++]}return new ve(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new i,n=this.index.array,s=this.attributes;for(let a in s){let l=s[a],c=t(l,n);e.setAttribute(a,c)}let r=this.morphAttributes;for(let a in r){let l=[],c=r[a];for(let h=0,u=c.length;h<u;h++){let d=c[h],p=t(d,n);l.push(p)}e.morphAttributes[a]=l}e.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,l=o.length;a<l;a++){let c=o[a];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){let t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};let e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});let n=this.attributes;for(let l in n){let c=n[l];t.data.attributes[l]=c.toJSON(t.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let u=0,d=c.length;u<d;u++){let p=c[u];h.push(p.toJSON(t.data))}h.length>0&&(s[l]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(t.data.boundingSphere=a.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let n=t.index;n!==null&&this.setIndex(n.clone());let s=t.attributes;for(let c in s){let h=s[c];this.setAttribute(c,h.clone(e))}let r=t.morphAttributes;for(let c in r){let h=[],u=r[c];for(let d=0,p=u.length;d<p;d++)h.push(u[d].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;let o=t.groups;for(let c=0,h=o.length;c<h;c++){let u=o[c];this.addGroup(u.start,u.count,u.materialIndex)}let a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());let l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},Ql=new te,pi=new es,kr=new kn,Zl=new I,Gr=new I,Vr=new I,Wr=new I,hc=new I,Xr=new I,Jl=new I,Yr=new I,xt=class extends ge{constructor(t=new ue,e=new ae){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(s,t);let a=this.morphTargetInfluences;if(r&&a){Xr.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let h=a[l],u=r[l];h!==0&&(hc.fromBufferAttribute(u,t),o?Xr.addScaledVector(hc,h):Xr.addScaledVector(hc.sub(e),h))}e.add(Xr)}return e}raycast(t,e){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),kr.copy(n.boundingSphere),kr.applyMatrix4(r),pi.copy(t.ray).recast(t.near),!(kr.containsPoint(pi.origin)===!1&&(pi.intersectSphere(kr,Zl)===null||pi.origin.distanceToSquared(Zl)>(t.far-t.near)**2))&&(Ql.copy(r).invert(),pi.copy(t.ray).applyMatrix4(Ql),!(n.boundingBox!==null&&pi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,pi)))}_computeIntersections(t,e,n){let s,r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,p=r.drawRange;if(a!==null)if(Array.isArray(o))for(let x=0,g=d.length;x<g;x++){let m=d[x],f=o[m.materialIndex],A=Math.max(m.start,p.start),v=Math.min(a.count,Math.min(m.start+m.count,p.start+p.count));for(let y=A,R=v;y<R;y+=3){let b=a.getX(y),T=a.getX(y+1),P=a.getX(y+2);s=qr(this,f,t,n,c,h,u,b,T,P),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{let x=Math.max(0,p.start),g=Math.min(a.count,p.start+p.count);for(let m=x,f=g;m<f;m+=3){let A=a.getX(m),v=a.getX(m+1),y=a.getX(m+2);s=qr(this,o,t,n,c,h,u,A,v,y),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let x=0,g=d.length;x<g;x++){let m=d[x],f=o[m.materialIndex],A=Math.max(m.start,p.start),v=Math.min(l.count,Math.min(m.start+m.count,p.start+p.count));for(let y=A,R=v;y<R;y+=3){let b=y,T=y+1,P=y+2;s=qr(this,f,t,n,c,h,u,b,T,P),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{let x=Math.max(0,p.start),g=Math.min(l.count,p.start+p.count);for(let m=x,f=g;m<f;m+=3){let A=m,v=m+1,y=m+2;s=qr(this,o,t,n,c,h,u,A,v,y),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}};function Xd(i,t,e,n,s,r,o,a){let l;if(t.side===He?l=n.intersectTriangle(o,r,s,!0,a):l=n.intersectTriangle(s,r,o,t.side===fn,a),l===null)return null;Yr.copy(a),Yr.applyMatrix4(i.matrixWorld);let c=e.ray.origin.distanceTo(Yr);return c<e.near||c>e.far?null:{distance:c,point:Yr.clone(),object:i}}function qr(i,t,e,n,s,r,o,a,l,c){i.getVertexPosition(a,Gr),i.getVertexPosition(l,Vr),i.getVertexPosition(c,Wr);let h=Xd(i,t,e,n,Gr,Vr,Wr,Jl);if(h){let u=new I;jn.getBarycoord(Jl,Gr,Vr,Wr,u),s&&(h.uv=jn.getInterpolatedAttribute(s,a,l,c,u,new ot)),r&&(h.uv1=jn.getInterpolatedAttribute(r,a,l,c,u,new ot)),o&&(h.normal=jn.getInterpolatedAttribute(o,a,l,c,u,new I),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let d={a,b:l,c,normal:new I,materialIndex:0};jn.getNormal(Gr,Vr,Wr,d.normal),h.face=d,h.barycoord=u}return h}var pe=class i extends ue{constructor(t=1,e=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};let a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);let l=[],c=[],h=[],u=[],d=0,p=0;x("z","y","x",-1,-1,n,e,t,o,r,0),x("z","y","x",1,-1,n,e,-t,o,r,1),x("x","z","y",1,1,t,n,e,s,o,2),x("x","z","y",1,-1,t,n,-e,s,o,3),x("x","y","z",1,-1,t,e,n,s,r,4),x("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new zt(c,3)),this.setAttribute("normal",new zt(h,3)),this.setAttribute("uv",new zt(u,2));function x(g,m,f,A,v,y,R,b,T,P,M){let _=y/T,S=R/P,D=y/2,L=R/2,z=b/2,F=T+1,H=P+1,q=0,G=0,lt=new I;for(let At=0;At<H;At++){let vt=At*S-L;for(let Gt=0;Gt<F;Gt++){let Jt=Gt*_-D;lt[g]=Jt*A,lt[m]=vt*v,lt[f]=z,c.push(lt.x,lt.y,lt.z),lt[g]=0,lt[m]=0,lt[f]=b>0?1:-1,h.push(lt.x,lt.y,lt.z),u.push(Gt/T),u.push(1-At/P),q+=1}}for(let At=0;At<P;At++)for(let vt=0;vt<T;vt++){let Gt=d+vt+F*At,Jt=d+vt+F*(At+1),ne=d+(vt+1)+F*(At+1),Kt=d+(vt+1)+F*At;l.push(Gt,Jt,Kt),l.push(Jt,ne,Kt),G+=6}a.addGroup(p,G,M),p+=G,d+=q}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};function Ci(i){let t={};for(let e in i){t[e]={};for(let n in i[e]){let s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function Fe(i){let t={};for(let e=0;e<i.length;e++){let n=Ci(i[e]);for(let s in n)t[s]=n[s]}return t}function Yd(i){let t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function Zc(i){let t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:jt.workingColorSpace}var nu={clone:Ci,merge:Fe},qd=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Qd=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,gn=class extends Gn{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=qd,this.fragmentShader=Qd,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Ci(t.uniforms),this.uniformsGroups=Yd(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){let e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(let s in this.uniforms){let o=this.uniforms[s].value;o&&o.isTexture?e.uniforms[s]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[s]={type:"m4",value:o.toArray()}:e.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}},qs=class extends ge{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new te,this.projectionMatrix=new te,this.projectionMatrixInverse=new te,this.coordinateSystem=dn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},Kn=new I,Kl=new ot,jl=new ot,De=class extends qs{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let e=.5*this.getFilmHeight()/t;this.fov=ji*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan(Fs*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return ji*2*Math.atan(Math.tan(Fs*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){Kn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Kn.x,Kn.y).multiplyScalar(-t/Kn.z),Kn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Kn.x,Kn.y).multiplyScalar(-t/Kn.z)}getViewSize(t,e){return this.getViewBounds(t,Kl,jl),e.subVectors(jl,Kl)}setViewOffset(t,e,n,s,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,e=t*Math.tan(Fs*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s,o=this.view;if(this.view!==null&&this.view.enabled){let l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*s/l,e-=o.offsetY*n/c,s*=o.width/l,n*=o.height/c}let a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}},Yi=-90,qi=1,ho=class extends ge{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new De(Yi,qi,t,e);s.layers=this.layers,this.add(s);let r=new De(Yi,qi,t,e);r.layers=this.layers,this.add(r);let o=new De(Yi,qi,t,e);o.layers=this.layers,this.add(o);let a=new De(Yi,qi,t,e);a.layers=this.layers,this.add(a);let l=new De(Yi,qi,t,e);l.layers=this.layers,this.add(l);let c=new De(Yi,qi,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let t=this.coordinateSystem,e=this.children.concat(),[n,s,r,o,a,l]=e;for(let c of e)this.remove(c);if(t===dn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===Gs)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,l,c,h]=this.children,u=t.getRenderTarget(),d=t.getActiveCubeFace(),p=t.getActiveMipmapLevel(),x=t.xr.enabled;t.xr.enabled=!1;let g=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,r),t.setRenderTarget(n,1,s),t.render(e,o),t.setRenderTarget(n,2,s),t.render(e,a),t.setRenderTarget(n,3,s),t.render(e,l),t.setRenderTarget(n,4,s),t.render(e,c),n.texture.generateMipmaps=g,t.setRenderTarget(n,5,s),t.render(e,h),t.setRenderTarget(u,d,p),t.xr.enabled=x,n.texture.needsPMREMUpdate=!0}},Qs=class extends ze{constructor(t=[],e=wi,n,s,r,o,a,l,c,h){super(t,e,n,s,r,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}},uo=class extends Sn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;let n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new Qs(s),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new pe(5,5,5),r=new gn({name:"CubemapFromEquirect",uniforms:Ci(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:He,blending:Vn});r.uniforms.tEquirect.value=e;let o=new xt(s,r),a=e.minFilter;return e.minFilter===ri&&(e.minFilter=pn),new ho(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e=!0,n=!0,s=!0){let r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,s);t.setRenderTarget(r)}},Dt=class extends ge{constructor(){super(),this.isGroup=!0,this.type="Group"}},Zd={type:"move"},is=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Dt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Dt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new I,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new I),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Dt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new I,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new I),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let e=this._hand;if(e)for(let n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,o=null,a=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(let g of t.hand.values()){let m=e.getJointPose(g,n),f=this._getHandJoint(c,g);m!==null&&(f.matrix.fromArray(m.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=m.radius),f.visible=m!==null}let h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],d=h.position.distanceTo(u.position),p=.02,x=.005;c.inputState.pinching&&d>p+x?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&d<=p-x&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Zd)))}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){let n=new Dt;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}},Zs=class i{constructor(t,e=25e-5){this.isFogExp2=!0,this.name="",this.color=new Nt(t),this.density=e}clone(){return new i(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}};var ss=class extends ge{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Ze,this.environmentIntensity=1,this.environmentRotation=new Ze,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}};var fo=class extends ze{constructor(t=null,e=1,n=1,s,r,o,a,l,c=Ge,h=Ge,u,d){super(null,o,a,l,c,h,s,r,u,d),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var rs=class extends ve{constructor(t,e,n,s=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){let t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}},Qi=new te,$l=new te,Qr=[],th=new nn,Jd=new te,Ps=new xt,Ds=new kn,Ve=class extends xt{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new rs(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,Jd)}computeBoundingBox(){let t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new nn),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Qi),th.copy(t.boundingBox).applyMatrix4(Qi),this.boundingBox.union(th)}computeBoundingSphere(){let t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new kn),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Qi),Ds.copy(t.boundingSphere).applyMatrix4(Qi),this.boundingSphere.union(Ds)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){let n=e.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,o=t*r+1;for(let a=0;a<n.length;a++)n[a]=s[o+a]}raycast(t,e){let n=this.matrixWorld,s=this.count;if(Ps.geometry=this.geometry,Ps.material=this.material,Ps.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Ds.copy(this.boundingSphere),Ds.applyMatrix4(n),t.ray.intersectsSphere(Ds)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,Qi),$l.multiplyMatrices(n,Qi),Ps.matrixWorld=$l,Ps.raycast(t,Qr);for(let o=0,a=Qr.length;o<a;o++){let l=Qr[o];l.instanceId=r,l.object=this,e.push(l)}Qr.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new rs(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}setMorphAt(t,e){let n=e.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new fo(new Float32Array(s*this.count),s,this.count,Zo,yn));let r=this.morphTexture.source.data.data,o=0;for(let c=0;c<n.length;c++)o+=n[c];let a=this.geometry.morphTargetsRelative?1:1-o,l=s*t;r[l]=a,r.set(n,l+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},uc=new I,Kd=new I,jd=new Vt,En=class{constructor(t=new I(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){let s=uc.subVectors(n,e).cross(Kd.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){let n=t.delta(uc),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;let r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){let e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){let n=e||jd.getNormalMatrix(t),s=this.coplanarPoint(uc).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}},mi=new kn,$d=new ot(.5,.5),Zr=new I,os=class{constructor(t=new En,e=new En,n=new En,s=new En,r=new En,o=new En){this.planes=[t,e,n,s,r,o]}set(t,e,n,s,r,o){let a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(t){let e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=dn,n=!1){let s=this.planes,r=t.elements,o=r[0],a=r[1],l=r[2],c=r[3],h=r[4],u=r[5],d=r[6],p=r[7],x=r[8],g=r[9],m=r[10],f=r[11],A=r[12],v=r[13],y=r[14],R=r[15];if(s[0].setComponents(c-o,p-h,f-x,R-A).normalize(),s[1].setComponents(c+o,p+h,f+x,R+A).normalize(),s[2].setComponents(c+a,p+u,f+g,R+v).normalize(),s[3].setComponents(c-a,p-u,f-g,R-v).normalize(),n)s[4].setComponents(l,d,m,y).normalize(),s[5].setComponents(c-l,p-d,f-m,R-y).normalize();else if(s[4].setComponents(c-l,p-d,f-m,R-y).normalize(),e===dn)s[5].setComponents(c+l,p+d,f+m,R+y).normalize();else if(e===Gs)s[5].setComponents(l,d,m,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),mi.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),mi.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(mi)}intersectsSprite(t){mi.center.set(0,0,0);let e=$d.distanceTo(t.center);return mi.radius=.7071067811865476+e,mi.applyMatrix4(t.matrixWorld),this.intersectsSphere(mi)}intersectsSphere(t){let e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){let e=this.planes;for(let n=0;n<6;n++){let s=e[n];if(Zr.x=s.normal.x>0?t.max.x:t.min.x,Zr.y=s.normal.y>0?t.max.y:t.min.y,Zr.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Zr)<0)return!1}return!0}containsPoint(t){let e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var vi=class extends Gn{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Nt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}},po=new I,mo=new I,eh=new te,Us=new es,Jr=new kn,dc=new I,nh=new I,as=class extends ge{constructor(t=new ue,e=new vi){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){let t=this.geometry;if(t.index===null){let e=t.attributes.position,n=[0];for(let s=1,r=e.count;s<r;s++)po.fromBufferAttribute(e,s-1),mo.fromBufferAttribute(e,s),n[s]=n[s-1],n[s]+=po.distanceTo(mo);t.setAttribute("lineDistance",new zt(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){let n=this.geometry,s=this.matrixWorld,r=t.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Jr.copy(n.boundingSphere),Jr.applyMatrix4(s),Jr.radius+=r,t.ray.intersectsSphere(Jr)===!1)return;eh.copy(s).invert(),Us.copy(t.ray).applyMatrix4(eh);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,h=n.index,d=n.attributes.position;if(h!==null){let p=Math.max(0,o.start),x=Math.min(h.count,o.start+o.count);for(let g=p,m=x-1;g<m;g+=c){let f=h.getX(g),A=h.getX(g+1),v=Kr(this,t,Us,l,f,A,g);v&&e.push(v)}if(this.isLineLoop){let g=h.getX(x-1),m=h.getX(p),f=Kr(this,t,Us,l,g,m,x-1);f&&e.push(f)}}else{let p=Math.max(0,o.start),x=Math.min(d.count,o.start+o.count);for(let g=p,m=x-1;g<m;g+=c){let f=Kr(this,t,Us,l,g,g+1,g);f&&e.push(f)}if(this.isLineLoop){let g=Kr(this,t,Us,l,x-1,p,x-1);g&&e.push(g)}}}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function Kr(i,t,e,n,s,r,o){let a=i.geometry.attributes.position;if(po.fromBufferAttribute(a,s),mo.fromBufferAttribute(a,r),e.distanceSqToSegment(po,mo,dc,nh)>n)return;dc.applyMatrix4(i.matrixWorld);let c=t.ray.origin.distanceTo(dc);if(!(c<t.near||c>t.far))return{distance:c,point:nh.clone().applyMatrix4(i.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:i}}var ih=new I,sh=new I,Js=class extends as{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let t=this.geometry;if(t.index===null){let e=t.attributes.position,n=[];for(let s=0,r=e.count;s<r;s+=2)ih.fromBufferAttribute(e,s),sh.fromBufferAttribute(e,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+ih.distanceTo(sh);t.setAttribute("lineDistance",new zt(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}};var Ue=class extends ze{constructor(t,e,n,s,r,o,a,l,c){super(t,e,n,s,r,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}},Ks=class extends ze{constructor(t,e,n=oi,s,r,o,a=Ge,l=Ge,c,h=Ki,u=1){if(h!==Ki&&h!==xs)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let d={width:t,height:e,depth:u};super(d,s,r,o,a,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new ts(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){let e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}},js=class extends ze{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}},Mi=class i extends ue{constructor(t=1,e=1,n=4,s=8,r=1){super(),this.type="CapsuleGeometry",this.parameters={radius:t,height:e,capSegments:n,radialSegments:s,heightSegments:r},e=Math.max(0,e),n=Math.max(1,Math.floor(n)),s=Math.max(3,Math.floor(s)),r=Math.max(1,Math.floor(r));let o=[],a=[],l=[],c=[],h=e/2,u=Math.PI/2*t,d=e,p=2*u+d,x=n*2+r,g=s+1,m=new I,f=new I;for(let A=0;A<=x;A++){let v=0,y=0,R=0,b=0;if(A<=n){let M=A/n,_=M*Math.PI/2;y=-h-t*Math.cos(_),R=t*Math.sin(_),b=-t*Math.cos(_),v=M*u}else if(A<=n+r){let M=(A-n)/r;y=-h+M*e,R=t,b=0,v=u+M*d}else{let M=(A-n-r)/n,_=M*Math.PI/2;y=h+t*Math.sin(_),R=t*Math.cos(_),b=t*Math.sin(_),v=u+d+M*u}let T=Math.max(0,Math.min(1,v/p)),P=0;A===0?P=.5/s:A===x&&(P=-.5/s);for(let M=0;M<=s;M++){let _=M/s,S=_*Math.PI*2,D=Math.sin(S),L=Math.cos(S);f.x=-R*L,f.y=y,f.z=R*D,a.push(f.x,f.y,f.z),m.set(-R*L,b,R*D),m.normalize(),l.push(m.x,m.y,m.z),c.push(_+P,T)}if(A>0){let M=(A-1)*g;for(let _=0;_<s;_++){let S=M+_,D=M+_+1,L=A*g+_,z=A*g+_+1;o.push(S,D,L),o.push(D,z,L)}}}this.setIndex(o),this.setAttribute("position",new zt(a,3)),this.setAttribute("normal",new zt(l,3)),this.setAttribute("uv",new zt(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radius,t.height,t.capSegments,t.radialSegments,t.heightSegments)}},$s=class i extends ue{constructor(t=1,e=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:s},e=Math.max(3,e);let r=[],o=[],a=[],l=[],c=new I,h=new ot;o.push(0,0,0),a.push(0,0,1),l.push(.5,.5);for(let u=0,d=3;u<=e;u++,d+=3){let p=n+u/e*s;c.x=t*Math.cos(p),c.y=t*Math.sin(p),o.push(c.x,c.y,c.z),a.push(0,0,1),h.x=(o[d]/t+1)/2,h.y=(o[d+1]/t+1)/2,l.push(h.x,h.y)}for(let u=1;u<=e;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new zt(o,3)),this.setAttribute("normal",new zt(a,3)),this.setAttribute("uv",new zt(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radius,t.segments,t.thetaStart,t.thetaLength)}},Zt=class i extends ue{constructor(t=1,e=1,n=1,s=32,r=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:l};let c=this;s=Math.floor(s),r=Math.floor(r);let h=[],u=[],d=[],p=[],x=0,g=[],m=n/2,f=0;A(),o===!1&&(t>0&&v(!0),e>0&&v(!1)),this.setIndex(h),this.setAttribute("position",new zt(u,3)),this.setAttribute("normal",new zt(d,3)),this.setAttribute("uv",new zt(p,2));function A(){let y=new I,R=new I,b=0,T=(e-t)/n;for(let P=0;P<=r;P++){let M=[],_=P/r,S=_*(e-t)+t;for(let D=0;D<=s;D++){let L=D/s,z=L*l+a,F=Math.sin(z),H=Math.cos(z);R.x=S*F,R.y=-_*n+m,R.z=S*H,u.push(R.x,R.y,R.z),y.set(F,T,H).normalize(),d.push(y.x,y.y,y.z),p.push(L,1-_),M.push(x++)}g.push(M)}for(let P=0;P<s;P++)for(let M=0;M<r;M++){let _=g[M][P],S=g[M+1][P],D=g[M+1][P+1],L=g[M][P+1];(t>0||M!==0)&&(h.push(_,S,L),b+=3),(e>0||M!==r-1)&&(h.push(S,D,L),b+=3)}c.addGroup(f,b,0),f+=b}function v(y){let R=x,b=new ot,T=new I,P=0,M=y===!0?t:e,_=y===!0?1:-1;for(let D=1;D<=s;D++)u.push(0,m*_,0),d.push(0,_,0),p.push(.5,.5),x++;let S=x;for(let D=0;D<=s;D++){let z=D/s*l+a,F=Math.cos(z),H=Math.sin(z);T.x=M*H,T.y=m*_,T.z=M*F,u.push(T.x,T.y,T.z),d.push(0,_,0),b.x=F*.5+.5,b.y=H*.5*_+.5,p.push(b.x,b.y),x++}for(let D=0;D<s;D++){let L=R+D,z=S+D;y===!0?h.push(z,z+1,L):h.push(z+1,z,L),P+=3}c.addGroup(f,P,y===!0?1:2),f+=P}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},wn=class i extends Zt{constructor(t=1,e=1,n=32,s=1,r=!1,o=0,a=Math.PI*2){super(0,t,e,n,s,r,o,a),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(t){return new i(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},go=class i extends ue{constructor(t=[],e=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:s};let r=[],o=[];a(s),c(n),h(),this.setAttribute("position",new zt(r,3)),this.setAttribute("normal",new zt(r.slice(),3)),this.setAttribute("uv",new zt(o,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function a(A){let v=new I,y=new I,R=new I;for(let b=0;b<e.length;b+=3)p(e[b+0],v),p(e[b+1],y),p(e[b+2],R),l(v,y,R,A)}function l(A,v,y,R){let b=R+1,T=[];for(let P=0;P<=b;P++){T[P]=[];let M=A.clone().lerp(y,P/b),_=v.clone().lerp(y,P/b),S=b-P;for(let D=0;D<=S;D++)D===0&&P===b?T[P][D]=M:T[P][D]=M.clone().lerp(_,D/S)}for(let P=0;P<b;P++)for(let M=0;M<2*(b-P)-1;M++){let _=Math.floor(M/2);M%2===0?(d(T[P][_+1]),d(T[P+1][_]),d(T[P][_])):(d(T[P][_+1]),d(T[P+1][_+1]),d(T[P+1][_]))}}function c(A){let v=new I;for(let y=0;y<r.length;y+=3)v.x=r[y+0],v.y=r[y+1],v.z=r[y+2],v.normalize().multiplyScalar(A),r[y+0]=v.x,r[y+1]=v.y,r[y+2]=v.z}function h(){let A=new I;for(let v=0;v<r.length;v+=3){A.x=r[v+0],A.y=r[v+1],A.z=r[v+2];let y=m(A)/2/Math.PI+.5,R=f(A)/Math.PI+.5;o.push(y,1-R)}x(),u()}function u(){for(let A=0;A<o.length;A+=6){let v=o[A+0],y=o[A+2],R=o[A+4],b=Math.max(v,y,R),T=Math.min(v,y,R);b>.9&&T<.1&&(v<.2&&(o[A+0]+=1),y<.2&&(o[A+2]+=1),R<.2&&(o[A+4]+=1))}}function d(A){r.push(A.x,A.y,A.z)}function p(A,v){let y=A*3;v.x=t[y+0],v.y=t[y+1],v.z=t[y+2]}function x(){let A=new I,v=new I,y=new I,R=new I,b=new ot,T=new ot,P=new ot;for(let M=0,_=0;M<r.length;M+=9,_+=6){A.set(r[M+0],r[M+1],r[M+2]),v.set(r[M+3],r[M+4],r[M+5]),y.set(r[M+6],r[M+7],r[M+8]),b.set(o[_+0],o[_+1]),T.set(o[_+2],o[_+3]),P.set(o[_+4],o[_+5]),R.copy(A).add(v).add(y).divideScalar(3);let S=m(R);g(b,_+0,A,S),g(T,_+2,v,S),g(P,_+4,y,S)}}function g(A,v,y,R){R<0&&A.x===1&&(o[v]=A.x-1),y.x===0&&y.z===0&&(o[v]=R/2/Math.PI+.5)}function m(A){return Math.atan2(A.z,-A.x)}function f(A){return Math.atan2(-A.y,Math.sqrt(A.x*A.x+A.z*A.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.vertices,t.indices,t.radius,t.details)}},ei=class i extends go{constructor(t=1,e=0){let n=(1+Math.sqrt(5))/2,s=1/n,r=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-s,-n,0,-s,n,0,s,-n,0,s,n,-s,-n,0,-s,n,0,s,-n,0,s,n,0,-n,0,-s,n,0,-s,-n,0,s,n,0,s],o=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(r,o,t,e),this.type="DodecahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new i(t.radius,t.detail)}};var Je=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(t,e){let n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){let e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){let e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){let t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let e=[],n,s=this.getPoint(0),r=0;e.push(0);for(let o=1;o<=t;o++)n=this.getPoint(o/t),r+=n.distanceTo(s),e.push(r),s=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){let n=this.getLengths(),s=0,r=n.length,o;e?o=e:o=t*n[r-1];let a=0,l=r-1,c;for(;a<=l;)if(s=Math.floor(a+(l-a)/2),c=n[s]-o,c<0)a=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===o)return s/(r-1);let h=n[s],d=n[s+1]-h,p=(o-h)/d;return(s+p)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);let o=this.getPoint(s),a=this.getPoint(r),l=e||(o.isVector2?new ot:new I);return l.copy(a).sub(o).normalize(),l}getTangentAt(t,e){let n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e=!1){let n=new I,s=[],r=[],o=[],a=new I,l=new te;for(let p=0;p<=t;p++){let x=p/t;s[p]=this.getTangentAt(x,new I)}r[0]=new I,o[0]=new I;let c=Number.MAX_VALUE,h=Math.abs(s[0].x),u=Math.abs(s[0].y),d=Math.abs(s[0].z);h<=c&&(c=h,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),d<=c&&n.set(0,0,1),a.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],a),o[0].crossVectors(s[0],r[0]);for(let p=1;p<=t;p++){if(r[p]=r[p-1].clone(),o[p]=o[p-1].clone(),a.crossVectors(s[p-1],s[p]),a.length()>Number.EPSILON){a.normalize();let x=Math.acos(Xt(s[p-1].dot(s[p]),-1,1));r[p].applyMatrix4(l.makeRotationAxis(a,x))}o[p].crossVectors(s[p],r[p])}if(e===!0){let p=Math.acos(Xt(r[0].dot(r[t]),-1,1));p/=t,s[0].dot(a.crossVectors(r[0],r[t]))>0&&(p=-p);for(let x=1;x<=t;x++)r[x].applyMatrix4(l.makeRotationAxis(s[x],p*x)),o[x].crossVectors(s[x],r[x])}return{tangents:s,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){let t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}},cs=class extends Je{constructor(t=0,e=0,n=1,s=1,r=0,o=Math.PI*2,a=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=l}getPoint(t,e=new ot){let n=e,s=Math.PI*2,r=this.aEndAngle-this.aStartAngle,o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(o?r=0:r=s),this.aClockwise===!0&&!o&&(r===s?r=-s:r=r-s);let a=this.aStartAngle+t*r,l=this.aX+this.xRadius*Math.cos(a),c=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){let h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=l-this.aX,p=c-this.aY;l=d*h-p*u+this.aX,c=d*u+p*h+this.aY}return n.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){let t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}},xo=class extends cs{constructor(t,e,n,s,r,o){super(t,e,n,n,s,r,o),this.isArcCurve=!0,this.type="ArcCurve"}};function Jc(){let i=0,t=0,e=0,n=0;function s(r,o,a,l){i=r,t=a,e=-3*r+3*o-2*a-l,n=2*r-2*o+a+l}return{initCatmullRom:function(r,o,a,l,c){s(o,a,c*(a-r),c*(l-o))},initNonuniformCatmullRom:function(r,o,a,l,c,h,u){let d=(o-r)/c-(a-r)/(c+h)+(a-o)/h,p=(a-o)/h-(l-o)/(h+u)+(l-a)/u;d*=h,p*=h,s(o,a,d,p)},calc:function(r){let o=r*r,a=o*r;return i+t*r+e*o+n*a}}}var jr=new I,fc=new Jc,pc=new Jc,mc=new Jc,xn=class extends Je{constructor(t=[],e=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=s}getPoint(t,e=new I){let n=e,s=this.points,r=s.length,o=(r-(this.closed?0:1))*t,a=Math.floor(o),l=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:l===0&&a===r-1&&(a=r-2,l=1);let c,h;this.closed||a>0?c=s[(a-1)%r]:(jr.subVectors(s[0],s[1]).add(s[0]),c=jr);let u=s[a%r],d=s[(a+1)%r];if(this.closed||a+2<r?h=s[(a+2)%r]:(jr.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=jr),this.curveType==="centripetal"||this.curveType==="chordal"){let p=this.curveType==="chordal"?.5:.25,x=Math.pow(c.distanceToSquared(u),p),g=Math.pow(u.distanceToSquared(d),p),m=Math.pow(d.distanceToSquared(h),p);g<1e-4&&(g=1),x<1e-4&&(x=g),m<1e-4&&(m=g),fc.initNonuniformCatmullRom(c.x,u.x,d.x,h.x,x,g,m),pc.initNonuniformCatmullRom(c.y,u.y,d.y,h.y,x,g,m),mc.initNonuniformCatmullRom(c.z,u.z,d.z,h.z,x,g,m)}else this.curveType==="catmullrom"&&(fc.initCatmullRom(c.x,u.x,d.x,h.x,this.tension),pc.initCatmullRom(c.y,u.y,d.y,h.y,this.tension),mc.initCatmullRom(c.z,u.z,d.z,h.z,this.tension));return n.set(fc.calc(l),pc.calc(l),mc.calc(l)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){let s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(new I().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}};function rh(i,t,e,n,s){let r=(n-t)*.5,o=(s-e)*.5,a=i*i,l=i*a;return(2*e-2*n+r+o)*l+(-3*e+3*n-2*r-o)*a+r*i+e}function tf(i,t){let e=1-i;return e*e*t}function ef(i,t){return 2*(1-i)*i*t}function nf(i,t){return i*i*t}function Os(i,t,e,n){return tf(i,t)+ef(i,e)+nf(i,n)}function sf(i,t){let e=1-i;return e*e*e*t}function rf(i,t){let e=1-i;return 3*e*e*i*t}function of(i,t){return 3*(1-i)*i*i*t}function af(i,t){return i*i*i*t}function zs(i,t,e,n,s){return sf(i,t)+rf(i,e)+of(i,n)+af(i,s)}var tr=class extends Je{constructor(t=new ot,e=new ot,n=new ot,s=new ot){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new ot){let n=e,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(zs(t,s.x,r.x,o.x,a.x),zs(t,s.y,r.y,o.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},Ao=class extends Je{constructor(t=new I,e=new I,n=new I,s=new I){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new I){let n=e,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(zs(t,s.x,r.x,o.x,a.x),zs(t,s.y,r.y,o.y,a.y),zs(t,s.z,r.z,o.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},er=class extends Je{constructor(t=new ot,e=new ot){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new ot){let n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new ot){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},_o=class extends Je{constructor(t=new I,e=new I){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new I){let n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new I){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},nr=class extends Je{constructor(t=new ot,e=new ot,n=new ot){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new ot){let n=e,s=this.v0,r=this.v1,o=this.v2;return n.set(Os(t,s.x,r.x,o.x),Os(t,s.y,r.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},ir=class extends Je{constructor(t=new I,e=new I,n=new I){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new I){let n=e,s=this.v0,r=this.v1,o=this.v2;return n.set(Os(t,s.x,r.x,o.x),Os(t,s.y,r.y,o.y),Os(t,s.z,r.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},sr=class extends Je{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new ot){let n=e,s=this.points,r=(s.length-1)*t,o=Math.floor(r),a=r-o,l=s[o===0?o:o-1],c=s[o],h=s[o>s.length-2?s.length-1:o+1],u=s[o>s.length-3?s.length-1:o+2];return n.set(rh(a,l.x,c.x,h.x,u.x),rh(a,l.y,c.y,h.y,u.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(s.clone())}return this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){let s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(new ot().fromArray(s))}return this}},yo=Object.freeze({__proto__:null,ArcCurve:xo,CatmullRomCurve3:xn,CubicBezierCurve:tr,CubicBezierCurve3:Ao,EllipseCurve:cs,LineCurve:er,LineCurve3:_o,QuadraticBezierCurve:nr,QuadraticBezierCurve3:ir,SplineCurve:sr}),vo=class extends Je{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){let t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){let n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new yo[n](e,t))}return this}getPoint(t,e){let n=t*this.getLength(),s=this.getCurveLengths(),r=0;for(;r<s.length;){if(s[r]>=n){let o=s[r]-n,a=this.curves[r],l=a.getLength(),c=l===0?0:1-o/l;return a.getPointAt(c,e)}r++}return null}getLength(){let t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let t=[],e=0;for(let n=0,s=this.curves.length;n<s;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){let e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){let e=[],n;for(let s=0,r=this.curves;s<r.length;s++){let o=r[s],a=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,l=o.getPoints(a);for(let c=0;c<l.length;c++){let h=l[c];n&&n.equals(h)||(e.push(h),n=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){let s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){let t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){let s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){let s=t.curves[e];this.curves.push(new yo[s.type]().fromJSON(s))}return this}},rr=class extends vo{constructor(t){super(),this.type="Path",this.currentPoint=new ot,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){let n=new er(this.currentPoint.clone(),new ot(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,s){let r=new nr(this.currentPoint.clone(),new ot(t,e),new ot(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(t,e,n,s,r,o){let a=new tr(this.currentPoint.clone(),new ot(t,e),new ot(n,s),new ot(r,o));return this.curves.push(a),this.currentPoint.set(r,o),this}splineThru(t){let e=[this.currentPoint.clone()].concat(t),n=new sr(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,s,r,o){let a=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+a,e+l,n,s,r,o),this}absarc(t,e,n,s,r,o){return this.absellipse(t,e,n,n,s,r,o),this}ellipse(t,e,n,s,r,o,a,l){let c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+c,e+h,n,s,r,o,a,l),this}absellipse(t,e,n,s,r,o,a,l){let c=new cs(t,e,n,s,r,o,a,l);if(this.curves.length>0){let u=c.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(c);let h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){let t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}},Ke=class extends rr{constructor(t){super(t),this.uuid=Ri(),this.type="Shape",this.holes=[]}getPointsHoles(t){let e=[];for(let n=0,s=this.holes.length;n<s;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){let s=t.holes[e];this.holes.push(s.clone())}return this}toJSON(){let t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){let s=this.holes[e];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){let s=t.holes[e];this.holes.push(new rr().fromJSON(s))}return this}};function cf(i,t,e=2){let n=t&&t.length,s=n?t[0]*e:i.length,r=iu(i,0,s,e,!0),o=[];if(!r||r.next===r.prev)return o;let a,l,c;if(n&&(r=ff(i,t,r,e)),i.length>80*e){a=1/0,l=1/0;let h=-1/0,u=-1/0;for(let d=e;d<s;d+=e){let p=i[d],x=i[d+1];p<a&&(a=p),x<l&&(l=x),p>h&&(h=p),x>u&&(u=x)}c=Math.max(h-a,u-l),c=c!==0?32767/c:0}return or(r,o,e,a,l,c,0),o}function iu(i,t,e,n,s){let r;if(s===Ef(i,t,e,n)>0)for(let o=t;o<e;o+=n)r=oh(o/n|0,i[o],i[o+1],r);else for(let o=e-n;o>=t;o-=n)r=oh(o/n|0,i[o],i[o+1],r);return r&&ls(r,r.next)&&(cr(r),r=r.next),r}function bi(i,t){if(!i)return i;t||(t=i);let e=i,n;do if(n=!1,!e.steiner&&(ls(e,e.next)||ye(e.prev,e,e.next)===0)){if(cr(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function or(i,t,e,n,s,r,o){if(!i)return;!o&&r&&Af(i,n,s,r);let a=i;for(;i.prev!==i.next;){let l=i.prev,c=i.next;if(r?hf(i,n,s,r):lf(i)){t.push(l.i,i.i,c.i),cr(i),i=c.next,a=c.next;continue}if(i=c,i===a){o?o===1?(i=uf(bi(i),t),or(i,t,e,n,s,r,2)):o===2&&df(i,t,e,n,s,r):or(bi(i),t,e,n,s,r,1);break}}}function lf(i){let t=i.prev,e=i,n=i.next;if(ye(t,e,n)>=0)return!1;let s=t.x,r=e.x,o=n.x,a=t.y,l=e.y,c=n.y,h=Math.min(s,r,o),u=Math.min(a,l,c),d=Math.max(s,r,o),p=Math.max(a,l,c),x=n.next;for(;x!==t;){if(x.x>=h&&x.x<=d&&x.y>=u&&x.y<=p&&Bs(s,a,r,l,o,c,x.x,x.y)&&ye(x.prev,x,x.next)>=0)return!1;x=x.next}return!0}function hf(i,t,e,n){let s=i.prev,r=i,o=i.next;if(ye(s,r,o)>=0)return!1;let a=s.x,l=r.x,c=o.x,h=s.y,u=r.y,d=o.y,p=Math.min(a,l,c),x=Math.min(h,u,d),g=Math.max(a,l,c),m=Math.max(h,u,d),f=bc(p,x,t,e,n),A=bc(g,m,t,e,n),v=i.prevZ,y=i.nextZ;for(;v&&v.z>=f&&y&&y.z<=A;){if(v.x>=p&&v.x<=g&&v.y>=x&&v.y<=m&&v!==s&&v!==o&&Bs(a,h,l,u,c,d,v.x,v.y)&&ye(v.prev,v,v.next)>=0||(v=v.prevZ,y.x>=p&&y.x<=g&&y.y>=x&&y.y<=m&&y!==s&&y!==o&&Bs(a,h,l,u,c,d,y.x,y.y)&&ye(y.prev,y,y.next)>=0))return!1;y=y.nextZ}for(;v&&v.z>=f;){if(v.x>=p&&v.x<=g&&v.y>=x&&v.y<=m&&v!==s&&v!==o&&Bs(a,h,l,u,c,d,v.x,v.y)&&ye(v.prev,v,v.next)>=0)return!1;v=v.prevZ}for(;y&&y.z<=A;){if(y.x>=p&&y.x<=g&&y.y>=x&&y.y<=m&&y!==s&&y!==o&&Bs(a,h,l,u,c,d,y.x,y.y)&&ye(y.prev,y,y.next)>=0)return!1;y=y.nextZ}return!0}function uf(i,t){let e=i;do{let n=e.prev,s=e.next.next;!ls(n,s)&&ru(n,e,e.next,s)&&ar(n,s)&&ar(s,n)&&(t.push(n.i,e.i,s.i),cr(e),cr(e.next),e=i=s),e=e.next}while(e!==i);return bi(e)}function df(i,t,e,n,s,r){let o=i;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&vf(o,a)){let l=ou(o,a);o=bi(o,o.next),l=bi(l,l.next),or(o,t,e,n,s,r,0),or(l,t,e,n,s,r,0);return}a=a.next}o=o.next}while(o!==i)}function ff(i,t,e,n){let s=[];for(let r=0,o=t.length;r<o;r++){let a=t[r]*n,l=r<o-1?t[r+1]*n:i.length,c=iu(i,a,l,n,!1);c===c.next&&(c.steiner=!0),s.push(yf(c))}s.sort(pf);for(let r=0;r<s.length;r++)e=mf(s[r],e);return e}function pf(i,t){let e=i.x-t.x;if(e===0&&(e=i.y-t.y,e===0)){let n=(i.next.y-i.y)/(i.next.x-i.x),s=(t.next.y-t.y)/(t.next.x-t.x);e=n-s}return e}function mf(i,t){let e=gf(i,t);if(!e)return t;let n=ou(e,i);return bi(n,n.next),bi(e,e.next)}function gf(i,t){let e=t,n=i.x,s=i.y,r=-1/0,o;if(ls(i,e))return e;do{if(ls(i,e.next))return e.next;if(s<=e.y&&s>=e.next.y&&e.next.y!==e.y){let u=e.x+(s-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(u<=n&&u>r&&(r=u,o=e.x<e.next.x?e:e.next,u===n))return o}e=e.next}while(e!==t);if(!o)return null;let a=o,l=o.x,c=o.y,h=1/0;e=o;do{if(n>=e.x&&e.x>=l&&n!==e.x&&su(s<c?n:r,s,l,c,s<c?r:n,s,e.x,e.y)){let u=Math.abs(s-e.y)/(n-e.x);ar(e,i)&&(u<h||u===h&&(e.x>o.x||e.x===o.x&&xf(o,e)))&&(o=e,h=u)}e=e.next}while(e!==a);return o}function xf(i,t){return ye(i.prev,i,t.prev)<0&&ye(t.next,i,i.next)<0}function Af(i,t,e,n){let s=i;do s.z===0&&(s.z=bc(s.x,s.y,t,e,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,_f(s)}function _f(i){let t,e=1;do{let n=i,s;i=null;let r=null;for(t=0;n;){t++;let o=n,a=0;for(let c=0;c<e&&(a++,o=o.nextZ,!!o);c++);let l=e;for(;a>0||l>0&&o;)a!==0&&(l===0||!o||n.z<=o.z)?(s=n,n=n.nextZ,a--):(s=o,o=o.nextZ,l--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;n=o}r.nextZ=null,e*=2}while(t>1);return i}function bc(i,t,e,n,s){return i=(i-e)*s|0,t=(t-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,i|t<<1}function yf(i){let t=i,e=i;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==i);return e}function su(i,t,e,n,s,r,o,a){return(s-o)*(t-a)>=(i-o)*(r-a)&&(i-o)*(n-a)>=(e-o)*(t-a)&&(e-o)*(r-a)>=(s-o)*(n-a)}function Bs(i,t,e,n,s,r,o,a){return!(i===o&&t===a)&&su(i,t,e,n,s,r,o,a)}function vf(i,t){return i.next.i!==t.i&&i.prev.i!==t.i&&!Mf(i,t)&&(ar(i,t)&&ar(t,i)&&bf(i,t)&&(ye(i.prev,i,t.prev)||ye(i,t.prev,t))||ls(i,t)&&ye(i.prev,i,i.next)>0&&ye(t.prev,t,t.next)>0)}function ye(i,t,e){return(t.y-i.y)*(e.x-t.x)-(t.x-i.x)*(e.y-t.y)}function ls(i,t){return i.x===t.x&&i.y===t.y}function ru(i,t,e,n){let s=to(ye(i,t,e)),r=to(ye(i,t,n)),o=to(ye(e,n,i)),a=to(ye(e,n,t));return!!(s!==r&&o!==a||s===0&&$r(i,e,t)||r===0&&$r(i,n,t)||o===0&&$r(e,i,n)||a===0&&$r(e,t,n))}function $r(i,t,e){return t.x<=Math.max(i.x,e.x)&&t.x>=Math.min(i.x,e.x)&&t.y<=Math.max(i.y,e.y)&&t.y>=Math.min(i.y,e.y)}function to(i){return i>0?1:i<0?-1:0}function Mf(i,t){let e=i;do{if(e.i!==i.i&&e.next.i!==i.i&&e.i!==t.i&&e.next.i!==t.i&&ru(e,e.next,i,t))return!0;e=e.next}while(e!==i);return!1}function ar(i,t){return ye(i.prev,i,i.next)<0?ye(i,t,i.next)>=0&&ye(i,i.prev,t)>=0:ye(i,t,i.prev)<0||ye(i,i.next,t)<0}function bf(i,t){let e=i,n=!1,s=(i.x+t.x)/2,r=(i.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&s<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==i);return n}function ou(i,t){let e=Ec(i.i,i.x,i.y),n=Ec(t.i,t.x,t.y),s=i.next,r=t.prev;return i.next=t,t.prev=i,e.next=s,s.prev=e,n.next=e,e.prev=n,r.next=n,n.prev=r,n}function oh(i,t,e,n){let s=Ec(i,t,e);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function cr(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function Ec(i,t,e){return{i,x:t,y:e,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function Ef(i,t,e,n){let s=0;for(let r=t,o=e-n;r<e;r+=n)s+=(i[o]-i[r])*(i[r+1]+i[o+1]),o=r;return s}var Sc=class{static triangulate(t,e,n=2){return cf(t,e,n)}},xi=class i{static area(t){let e=t.length,n=0;for(let s=e-1,r=0;r<e;s=r++)n+=t[s].x*t[r].y-t[r].x*t[s].y;return n*.5}static isClockWise(t){return i.area(t)<0}static triangulateShape(t,e){let n=[],s=[],r=[];ah(t),ch(n,t);let o=t.length;e.forEach(ah);for(let l=0;l<e.length;l++)s.push(o),o+=e[l].length,ch(n,e[l]);let a=Sc.triangulate(n,s);for(let l=0;l<a.length;l+=3)r.push(a.slice(l,l+3));return r}};function ah(i){let t=i.length;t>2&&i[t-1].equals(i[0])&&i.pop()}function ch(i,t){for(let e=0;e<t.length;e++)i.push(t[e].x),i.push(t[e].y)}var sn=class i extends ue{constructor(t=new Ke([new ot(.5,.5),new ot(-.5,.5),new ot(-.5,-.5),new ot(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];let n=this,s=[],r=[];for(let a=0,l=t.length;a<l;a++){let c=t[a];o(c)}this.setAttribute("position",new zt(s,3)),this.setAttribute("uv",new zt(r,2)),this.computeVertexNormals();function o(a){let l=[],c=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,u=e.depth!==void 0?e.depth:1,d=e.bevelEnabled!==void 0?e.bevelEnabled:!0,p=e.bevelThickness!==void 0?e.bevelThickness:.2,x=e.bevelSize!==void 0?e.bevelSize:p-.1,g=e.bevelOffset!==void 0?e.bevelOffset:0,m=e.bevelSegments!==void 0?e.bevelSegments:3,f=e.extrudePath,A=e.UVGenerator!==void 0?e.UVGenerator:Sf,v,y=!1,R,b,T,P;f&&(v=f.getSpacedPoints(h),y=!0,d=!1,R=f.computeFrenetFrames(h,!1),b=new I,T=new I,P=new I),d||(m=0,p=0,x=0,g=0);let M=a.extractPoints(c),_=M.shape,S=M.holes;if(!xi.isClockWise(_)){_=_.reverse();for(let tt=0,K=S.length;tt<K;tt++){let J=S[tt];xi.isClockWise(J)&&(S[tt]=J.reverse())}}function L(tt){let J=10000000000000001e-36,Z=tt[0];for(let ht=1;ht<=tt.length;ht++){let nt=ht%tt.length,ut=tt[nt],Ht=ut.x-Z.x,Ot=ut.y-Z.y,C=Ht*Ht+Ot*Ot,E=Math.max(Math.abs(ut.x),Math.abs(ut.y),Math.abs(Z.x),Math.abs(Z.y)),k=J*E*E;if(C<=k){tt.splice(nt,1),ht--;continue}Z=ut}}L(_),S.forEach(L);let z=S.length,F=_;for(let tt=0;tt<z;tt++){let K=S[tt];_=_.concat(K)}function H(tt,K,J){return K||console.error("THREE.ExtrudeGeometry: vec does not exist"),tt.clone().addScaledVector(K,J)}let q=_.length;function G(tt,K,J){let Z,ht,nt,ut=tt.x-K.x,Ht=tt.y-K.y,Ot=J.x-tt.x,C=J.y-tt.y,E=ut*ut+Ht*Ht,k=ut*C-Ht*Ot;if(Math.abs(k)>Number.EPSILON){let X=Math.sqrt(E),$=Math.sqrt(Ot*Ot+C*C),Y=K.x-Ht/X,Rt=K.y+ut/X,ct=J.x-C/$,St=J.y+Ot/$,wt=((ct-Y)*C-(St-Rt)*Ot)/(ut*C-Ht*Ot);Z=Y+ut*wt-tt.x,ht=Rt+Ht*wt-tt.y;let it=Z*Z+ht*ht;if(it<=2)return new ot(Z,ht);nt=Math.sqrt(it/2)}else{let X=!1;ut>Number.EPSILON?Ot>Number.EPSILON&&(X=!0):ut<-Number.EPSILON?Ot<-Number.EPSILON&&(X=!0):Math.sign(Ht)===Math.sign(C)&&(X=!0),X?(Z=-Ht,ht=ut,nt=Math.sqrt(E)):(Z=ut,ht=Ht,nt=Math.sqrt(E/2))}return new ot(Z/nt,ht/nt)}let lt=[];for(let tt=0,K=F.length,J=K-1,Z=tt+1;tt<K;tt++,J++,Z++)J===K&&(J=0),Z===K&&(Z=0),lt[tt]=G(F[tt],F[J],F[Z]);let At=[],vt,Gt=lt.concat();for(let tt=0,K=z;tt<K;tt++){let J=S[tt];vt=[];for(let Z=0,ht=J.length,nt=ht-1,ut=Z+1;Z<ht;Z++,nt++,ut++)nt===ht&&(nt=0),ut===ht&&(ut=0),vt[Z]=G(J[Z],J[nt],J[ut]);At.push(vt),Gt=Gt.concat(vt)}let Jt;if(m===0)Jt=xi.triangulateShape(F,S);else{let tt=[],K=[];for(let J=0;J<m;J++){let Z=J/m,ht=p*Math.cos(Z*Math.PI/2),nt=x*Math.sin(Z*Math.PI/2)+g;for(let ut=0,Ht=F.length;ut<Ht;ut++){let Ot=H(F[ut],lt[ut],nt);It(Ot.x,Ot.y,-ht),Z===0&&tt.push(Ot)}for(let ut=0,Ht=z;ut<Ht;ut++){let Ot=S[ut];vt=At[ut];let C=[];for(let E=0,k=Ot.length;E<k;E++){let X=H(Ot[E],vt[E],nt);It(X.x,X.y,-ht),Z===0&&C.push(X)}Z===0&&K.push(C)}}Jt=xi.triangulateShape(tt,K)}let ne=Jt.length,Kt=x+g;for(let tt=0;tt<q;tt++){let K=d?H(_[tt],Gt[tt],Kt):_[tt];y?(T.copy(R.normals[0]).multiplyScalar(K.x),b.copy(R.binormals[0]).multiplyScalar(K.y),P.copy(v[0]).add(T).add(b),It(P.x,P.y,P.z)):It(K.x,K.y,0)}for(let tt=1;tt<=h;tt++)for(let K=0;K<q;K++){let J=d?H(_[K],Gt[K],Kt):_[K];y?(T.copy(R.normals[tt]).multiplyScalar(J.x),b.copy(R.binormals[tt]).multiplyScalar(J.y),P.copy(v[tt]).add(T).add(b),It(P.x,P.y,P.z)):It(J.x,J.y,u/h*tt)}for(let tt=m-1;tt>=0;tt--){let K=tt/m,J=p*Math.cos(K*Math.PI/2),Z=x*Math.sin(K*Math.PI/2)+g;for(let ht=0,nt=F.length;ht<nt;ht++){let ut=H(F[ht],lt[ht],Z);It(ut.x,ut.y,u+J)}for(let ht=0,nt=S.length;ht<nt;ht++){let ut=S[ht];vt=At[ht];for(let Ht=0,Ot=ut.length;Ht<Ot;Ht++){let C=H(ut[Ht],vt[Ht],Z);y?It(C.x,C.y+v[h-1].y,v[h-1].x+J):It(C.x,C.y,u+J)}}}Q(),et();function Q(){let tt=s.length/3;if(d){let K=0,J=q*K;for(let Z=0;Z<ne;Z++){let ht=Jt[Z];Et(ht[2]+J,ht[1]+J,ht[0]+J)}K=h+m*2,J=q*K;for(let Z=0;Z<ne;Z++){let ht=Jt[Z];Et(ht[0]+J,ht[1]+J,ht[2]+J)}}else{for(let K=0;K<ne;K++){let J=Jt[K];Et(J[2],J[1],J[0])}for(let K=0;K<ne;K++){let J=Jt[K];Et(J[0]+q*h,J[1]+q*h,J[2]+q*h)}}n.addGroup(tt,s.length/3-tt,0)}function et(){let tt=s.length/3,K=0;yt(F,K),K+=F.length;for(let J=0,Z=S.length;J<Z;J++){let ht=S[J];yt(ht,K),K+=ht.length}n.addGroup(tt,s.length/3-tt,1)}function yt(tt,K){let J=tt.length;for(;--J>=0;){let Z=J,ht=J-1;ht<0&&(ht=tt.length-1);for(let nt=0,ut=h+m*2;nt<ut;nt++){let Ht=q*nt,Ot=q*(nt+1),C=K+Z+Ht,E=K+ht+Ht,k=K+ht+Ot,X=K+Z+Ot;qt(C,E,k,X)}}}function It(tt,K,J){l.push(tt),l.push(K),l.push(J)}function Et(tt,K,J){le(tt),le(K),le(J);let Z=s.length/3,ht=A.generateTopUV(n,s,Z-3,Z-2,Z-1);U(ht[0]),U(ht[1]),U(ht[2])}function qt(tt,K,J,Z){le(tt),le(K),le(Z),le(K),le(J),le(Z);let ht=s.length/3,nt=A.generateSideWallUV(n,s,ht-6,ht-3,ht-2,ht-1);U(nt[0]),U(nt[1]),U(nt[3]),U(nt[1]),U(nt[2]),U(nt[3])}function le(tt){s.push(l[tt*3+0]),s.push(l[tt*3+1]),s.push(l[tt*3+2])}function U(tt){r.push(tt.x),r.push(tt.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON(),e=this.parameters.shapes,n=this.parameters.options;return wf(e,n,t)}static fromJSON(t,e){let n=[];for(let r=0,o=t.shapes.length;r<o;r++){let a=e[t.shapes[r]];n.push(a)}let s=t.options.extrudePath;return s!==void 0&&(t.options.extrudePath=new yo[s.type]().fromJSON(s)),new i(n,t.options)}},Sf={generateTopUV:function(i,t,e,n,s){let r=t[e*3],o=t[e*3+1],a=t[n*3],l=t[n*3+1],c=t[s*3],h=t[s*3+1];return[new ot(r,o),new ot(a,l),new ot(c,h)]},generateSideWallUV:function(i,t,e,n,s,r){let o=t[e*3],a=t[e*3+1],l=t[e*3+2],c=t[n*3],h=t[n*3+1],u=t[n*3+2],d=t[s*3],p=t[s*3+1],x=t[s*3+2],g=t[r*3],m=t[r*3+1],f=t[r*3+2];return Math.abs(a-h)<Math.abs(o-c)?[new ot(o,1-l),new ot(c,1-u),new ot(d,1-x),new ot(g,1-f)]:[new ot(a,1-l),new ot(h,1-u),new ot(p,1-x),new ot(m,1-f)]}};function wf(i,t,e){if(e.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){let r=i[n];e.shapes.push(r.uuid)}else e.shapes.push(i.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}var lr=class i extends ue{constructor(t=[new ot(0,-.5),new ot(.5,0),new ot(0,.5)],e=12,n=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:e,phiStart:n,phiLength:s},e=Math.floor(e),s=Xt(s,0,Math.PI*2);let r=[],o=[],a=[],l=[],c=[],h=1/e,u=new I,d=new ot,p=new I,x=new I,g=new I,m=0,f=0;for(let A=0;A<=t.length-1;A++)switch(A){case 0:m=t[A+1].x-t[A].x,f=t[A+1].y-t[A].y,p.x=f*1,p.y=-m,p.z=f*0,g.copy(p),p.normalize(),l.push(p.x,p.y,p.z);break;case t.length-1:l.push(g.x,g.y,g.z);break;default:m=t[A+1].x-t[A].x,f=t[A+1].y-t[A].y,p.x=f*1,p.y=-m,p.z=f*0,x.copy(p),p.x+=g.x,p.y+=g.y,p.z+=g.z,p.normalize(),l.push(p.x,p.y,p.z),g.copy(x)}for(let A=0;A<=e;A++){let v=n+A*h*s,y=Math.sin(v),R=Math.cos(v);for(let b=0;b<=t.length-1;b++){u.x=t[b].x*y,u.y=t[b].y,u.z=t[b].x*R,o.push(u.x,u.y,u.z),d.x=A/e,d.y=b/(t.length-1),a.push(d.x,d.y);let T=l[3*b+0]*y,P=l[3*b+1],M=l[3*b+0]*R;c.push(T,P,M)}}for(let A=0;A<e;A++)for(let v=0;v<t.length-1;v++){let y=v+A*t.length,R=y,b=y+t.length,T=y+t.length+1,P=y+1;r.push(R,b,P),r.push(T,P,b)}this.setIndex(r),this.setAttribute("position",new zt(o,3)),this.setAttribute("uv",new zt(a,2)),this.setAttribute("normal",new zt(c,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.points,t.segments,t.phiStart,t.phiLength)}};var me=class i extends ue{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};let r=t/2,o=e/2,a=Math.floor(n),l=Math.floor(s),c=a+1,h=l+1,u=t/a,d=e/l,p=[],x=[],g=[],m=[];for(let f=0;f<h;f++){let A=f*d-o;for(let v=0;v<c;v++){let y=v*u-r;x.push(y,-A,0),g.push(0,0,1),m.push(v/a),m.push(1-f/l)}}for(let f=0;f<l;f++)for(let A=0;A<a;A++){let v=A+c*f,y=A+c*(f+1),R=A+1+c*(f+1),b=A+1+c*f;p.push(v,y,b),p.push(y,R,b)}this.setIndex(p),this.setAttribute("position",new zt(x,3)),this.setAttribute("normal",new zt(g,3)),this.setAttribute("uv",new zt(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.widthSegments,t.heightSegments)}},ni=class i extends ue{constructor(t=.5,e=1,n=32,s=1,r=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:n,phiSegments:s,thetaStart:r,thetaLength:o},n=Math.max(3,n),s=Math.max(1,s);let a=[],l=[],c=[],h=[],u=t,d=(e-t)/s,p=new I,x=new ot;for(let g=0;g<=s;g++){for(let m=0;m<=n;m++){let f=r+m/n*o;p.x=u*Math.cos(f),p.y=u*Math.sin(f),l.push(p.x,p.y,p.z),c.push(0,0,1),x.x=(p.x/e+1)/2,x.y=(p.y/e+1)/2,h.push(x.x,x.y)}u+=d}for(let g=0;g<s;g++){let m=g*(n+1);for(let f=0;f<n;f++){let A=f+m,v=A,y=A+n+1,R=A+n+2,b=A+1;a.push(v,y,b),a.push(y,R,b)}}this.setIndex(a),this.setAttribute("position",new zt(l,3)),this.setAttribute("normal",new zt(c,3)),this.setAttribute("uv",new zt(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}};var Me=class i extends ue{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));let l=Math.min(o+a,Math.PI),c=0,h=[],u=new I,d=new I,p=[],x=[],g=[],m=[];for(let f=0;f<=n;f++){let A=[],v=f/n,y=0;f===0&&o===0?y=.5/e:f===n&&l===Math.PI&&(y=-.5/e);for(let R=0;R<=e;R++){let b=R/e;u.x=-t*Math.cos(s+b*r)*Math.sin(o+v*a),u.y=t*Math.cos(o+v*a),u.z=t*Math.sin(s+b*r)*Math.sin(o+v*a),x.push(u.x,u.y,u.z),d.copy(u).normalize(),g.push(d.x,d.y,d.z),m.push(b+y,1-v),A.push(c++)}h.push(A)}for(let f=0;f<n;f++)for(let A=0;A<e;A++){let v=h[f][A+1],y=h[f][A],R=h[f+1][A],b=h[f+1][A+1];(f!==0||o>0)&&p.push(v,y,b),(f!==n-1||l<Math.PI)&&p.push(y,R,b)}this.setIndex(p),this.setAttribute("position",new zt(x,3)),this.setAttribute("normal",new zt(g,3)),this.setAttribute("uv",new zt(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}};var Te=class i extends ue{constructor(t=1,e=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);let o=[],a=[],l=[],c=[],h=new I,u=new I,d=new I;for(let p=0;p<=n;p++)for(let x=0;x<=s;x++){let g=x/s*r,m=p/n*Math.PI*2;u.x=(t+e*Math.cos(m))*Math.cos(g),u.y=(t+e*Math.cos(m))*Math.sin(g),u.z=e*Math.sin(m),a.push(u.x,u.y,u.z),h.x=t*Math.cos(g),h.y=t*Math.sin(g),d.subVectors(u,h).normalize(),l.push(d.x,d.y,d.z),c.push(x/s),c.push(p/n)}for(let p=1;p<=n;p++)for(let x=1;x<=s;x++){let g=(s+1)*p+x-1,m=(s+1)*(p-1)+x-1,f=(s+1)*(p-1)+x,A=(s+1)*p+x;o.push(g,m,A),o.push(m,f,A)}this.setIndex(o),this.setAttribute("position",new zt(a,3)),this.setAttribute("normal",new zt(l,3)),this.setAttribute("uv",new zt(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}};var Tn=class i extends ue{constructor(t=new ir(new I(-1,-1,0),new I(-1,1,0),new I(1,1,0)),e=64,n=1,s=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:t,tubularSegments:e,radius:n,radialSegments:s,closed:r};let o=t.computeFrenetFrames(e,r);this.tangents=o.tangents,this.normals=o.normals,this.binormals=o.binormals;let a=new I,l=new I,c=new ot,h=new I,u=[],d=[],p=[],x=[];g(),this.setIndex(x),this.setAttribute("position",new zt(u,3)),this.setAttribute("normal",new zt(d,3)),this.setAttribute("uv",new zt(p,2));function g(){for(let v=0;v<e;v++)m(v);m(r===!1?e:0),A(),f()}function m(v){h=t.getPointAt(v/e,h);let y=o.normals[v],R=o.binormals[v];for(let b=0;b<=s;b++){let T=b/s*Math.PI*2,P=Math.sin(T),M=-Math.cos(T);l.x=M*y.x+P*R.x,l.y=M*y.y+P*R.y,l.z=M*y.z+P*R.z,l.normalize(),d.push(l.x,l.y,l.z),a.x=h.x+n*l.x,a.y=h.y+n*l.y,a.z=h.z+n*l.z,u.push(a.x,a.y,a.z)}}function f(){for(let v=1;v<=e;v++)for(let y=1;y<=s;y++){let R=(s+1)*(v-1)+(y-1),b=(s+1)*v+(y-1),T=(s+1)*v+y,P=(s+1)*(v-1)+y;x.push(R,b,P),x.push(b,T,P)}}function A(){for(let v=0;v<=e;v++)for(let y=0;y<=s;y++)c.x=v/e,c.y=y/s,p.push(c.x,c.y)}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON();return t.path=this.parameters.path.toJSON(),t}static fromJSON(t){return new i(new yo[t.path.type]().fromJSON(t.path),t.tubularSegments,t.radius,t.radialSegments,t.closed)}};var xe=class extends Gn{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Nt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Nt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Vc,this.normalScale=new ot(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ze,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}},Ei=class extends xe{constructor(t){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new ot(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return Xt(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Nt(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Nt(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Nt(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(t)}get anisotropy(){return this._anisotropy}set anisotropy(t){this._anisotropy>0!=t>0&&this.version++,this._anisotropy=t}get clearcoat(){return this._clearcoat}set clearcoat(t){this._clearcoat>0!=t>0&&this.version++,this._clearcoat=t}get iridescence(){return this._iridescence}set iridescence(t){this._iridescence>0!=t>0&&this.version++,this._iridescence=t}get dispersion(){return this._dispersion}set dispersion(t){this._dispersion>0!=t>0&&this.version++,this._dispersion=t}get sheen(){return this._sheen}set sheen(t){this._sheen>0!=t>0&&this.version++,this._sheen=t}get transmission(){return this._transmission}set transmission(t){this._transmission>0!=t>0&&this.version++,this._transmission=t}copy(t){return super.copy(t),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=t.anisotropy,this.anisotropyRotation=t.anisotropyRotation,this.anisotropyMap=t.anisotropyMap,this.clearcoat=t.clearcoat,this.clearcoatMap=t.clearcoatMap,this.clearcoatRoughness=t.clearcoatRoughness,this.clearcoatRoughnessMap=t.clearcoatRoughnessMap,this.clearcoatNormalMap=t.clearcoatNormalMap,this.clearcoatNormalScale.copy(t.clearcoatNormalScale),this.dispersion=t.dispersion,this.ior=t.ior,this.iridescence=t.iridescence,this.iridescenceMap=t.iridescenceMap,this.iridescenceIOR=t.iridescenceIOR,this.iridescenceThicknessRange=[...t.iridescenceThicknessRange],this.iridescenceThicknessMap=t.iridescenceThicknessMap,this.sheen=t.sheen,this.sheenColor.copy(t.sheenColor),this.sheenColorMap=t.sheenColorMap,this.sheenRoughness=t.sheenRoughness,this.sheenRoughnessMap=t.sheenRoughnessMap,this.transmission=t.transmission,this.transmissionMap=t.transmissionMap,this.thickness=t.thickness,this.thicknessMap=t.thicknessMap,this.attenuationDistance=t.attenuationDistance,this.attenuationColor.copy(t.attenuationColor),this.specularIntensity=t.specularIntensity,this.specularIntensityMap=t.specularIntensityMap,this.specularColor.copy(t.specularColor),this.specularColorMap=t.specularColorMap,this}};var Mo=class extends Gn{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Vh,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},bo=class extends Gn{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}};var hr=class extends vi{constructor(t){super(),this.isLineDashedMaterial=!0,this.type="LineDashedMaterial",this.scale=1,this.dashSize=3,this.gapSize=1,this.setValues(t)}copy(t){return super.copy(t),this.scale=t.scale,this.dashSize=t.dashSize,this.gapSize=t.gapSize,this}};function eo(i,t){return!i||i.constructor===t?i:typeof t.BYTES_PER_ELEMENT=="number"?new t(i):Array.prototype.slice.call(i)}function Tf(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}var Si=class{constructor(t,e,n,s){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new e.constructor(n),this.sampleValues=e,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,n=this._cachedIndex,s=e[n],r=e[n-1];n:{t:{let o;e:{i:if(!(t<s)){for(let a=n+2;;){if(s===void 0){if(t<r)break i;return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=s,s=e[++n],t<s)break t}o=e.length;break e}if(!(t>=r)){let a=e[1];t<a&&(n=2,r=a);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(s=r,r=e[--n-1],t>=r)break t}o=n,n=0;break e}break n}for(;n<o;){let a=n+o>>>1;t<e[a]?o=a:n=a+1}if(s=e[n],r=e[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,t,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=t*s;for(let o=0;o!==s;++o)e[o]=n[r+o];return e}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},Eo=class extends Si{constructor(t,e,n,s){super(t,e,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Ac,endingEnd:Ac}}intervalChanged_(t,e,n){let s=this.parameterPositions,r=t-2,o=t+1,a=s[r],l=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case _c:r=t,a=2*e-n;break;case yc:r=s.length-2,a=e+s[r]-s[r+1];break;default:r=t,a=n}if(l===void 0)switch(this.getSettings_().endingEnd){case _c:o=t,l=2*n-e;break;case yc:o=1,l=n+s[1]-s[0];break;default:o=t-1,l=e}let c=(n-e)*.5,h=this.valueSize;this._weightPrev=c/(e-a),this._weightNext=c/(l-n),this._offsetPrev=r*h,this._offsetNext=o*h}interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,h=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,p=this._weightNext,x=(n-e)/(s-e),g=x*x,m=g*x,f=-d*m+2*d*g-d*x,A=(1+d)*m+(-1.5-2*d)*g+(-.5+d)*x+1,v=(-1-p)*m+(1.5+p)*g+.5*x,y=p*m-p*g;for(let R=0;R!==a;++R)r[R]=f*o[h+R]+A*o[c+R]+v*o[l+R]+y*o[u+R];return r}},So=class extends Si{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,h=(n-e)/(s-e),u=1-h;for(let d=0;d!==a;++d)r[d]=o[c+d]*u+o[l+d]*h;return r}},wo=class extends Si{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t){return this.copySampleValue_(t-1)}},je=class{constructor(t,e,n,s){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=eo(e,this.TimeBufferType),this.values=eo(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,n;if(e.toJSON!==this.toJSON)n=e.toJSON(t);else{n={name:t.name,times:eo(t.times,Array),values:eo(t.values,Array)};let s=t.getInterpolation();s!==t.DefaultInterpolation&&(n.interpolation=s)}return n.type=t.ValueTypeName,n}InterpolantFactoryMethodDiscrete(t){return new wo(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new So(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new Eo(this.times,this.values,this.getValueSize(),t)}setInterpolation(t){let e;switch(t){case Hs:e=this.InterpolantFactoryMethodDiscrete;break;case oo:e=this.InterpolantFactoryMethodLinear;break;case no:e=this.InterpolantFactoryMethodSmooth;break}if(e===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Hs;case this.InterpolantFactoryMethodLinear:return oo;case this.InterpolantFactoryMethodSmooth:return no}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]+=t}return this}scale(t){if(t!==1){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]*=t}return this}trim(t,e){let n=this.times,s=n.length,r=0,o=s-1;for(;r!==s&&n[r]<t;)++r;for(;o!==-1&&n[o]>e;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let t=!0,e=this.getValueSize();e-Math.floor(e)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),t=!1);let n=this.times,s=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),t=!1);let o=null;for(let a=0;a!==r;a++){let l=n[a];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,l),t=!1;break}if(o!==null&&o>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,l,o),t=!1;break}o=l}if(s!==void 0&&Tf(s))for(let a=0,l=s.length;a!==l;++a){let c=s[a];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,c),t=!1;break}}return t}optimize(){let t=this.times.slice(),e=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===no,r=t.length-1,o=1;for(let a=1;a<r;++a){let l=!1,c=t[a],h=t[a+1];if(c!==h&&(a!==1||c!==t[0]))if(s)l=!0;else{let u=a*n,d=u-n,p=u+n;for(let x=0;x!==n;++x){let g=e[u+x];if(g!==e[d+x]||g!==e[p+x]){l=!0;break}}}if(l){if(a!==o){t[o]=t[a];let u=a*n,d=o*n;for(let p=0;p!==n;++p)e[d+p]=e[u+p]}++o}}if(r>0){t[o]=t[r];for(let a=r*n,l=o*n,c=0;c!==n;++c)e[l+c]=e[a+c];++o}return o!==t.length?(this.times=t.slice(0,o),this.values=e.slice(0,o*n)):(this.times=t,this.values=e),this}clone(){let t=this.times.slice(),e=this.values.slice(),n=this.constructor,s=new n(this.name,t,e);return s.createInterpolant=this.createInterpolant,s}};je.prototype.ValueTypeName="";je.prototype.TimeBufferType=Float32Array;je.prototype.ValueBufferType=Float32Array;je.prototype.DefaultInterpolation=oo;var ii=class extends je{constructor(t,e,n){super(t,e,n)}};ii.prototype.ValueTypeName="bool";ii.prototype.ValueBufferType=Array;ii.prototype.DefaultInterpolation=Hs;ii.prototype.InterpolantFactoryMethodLinear=void 0;ii.prototype.InterpolantFactoryMethodSmooth=void 0;var To=class extends je{constructor(t,e,n,s){super(t,e,n,s)}};To.prototype.ValueTypeName="color";var Ro=class extends je{constructor(t,e,n,s){super(t,e,n,s)}};Ro.prototype.ValueTypeName="number";var Co=class extends Si{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(n-e)/(s-e),c=t*a;for(let h=c+a;c!==h;c+=4)mn.slerpFlat(r,0,o,c-a,o,c,l);return r}},ur=class extends je{constructor(t,e,n,s){super(t,e,n,s)}InterpolantFactoryMethodLinear(t){return new Co(this.times,this.values,this.getValueSize(),t)}};ur.prototype.ValueTypeName="quaternion";ur.prototype.InterpolantFactoryMethodSmooth=void 0;var si=class extends je{constructor(t,e,n){super(t,e,n)}};si.prototype.ValueTypeName="string";si.prototype.ValueBufferType=Array;si.prototype.DefaultInterpolation=Hs;si.prototype.InterpolantFactoryMethodLinear=void 0;si.prototype.InterpolantFactoryMethodSmooth=void 0;var Io=class extends je{constructor(t,e,n,s){super(t,e,n,s)}};Io.prototype.ValueTypeName="vector";var Po=class{constructor(t,e,n){let s=this,r=!1,o=0,a=0,l,c=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this.abortController=new AbortController,this.itemStart=function(h){a++,r===!1&&s.onStart!==void 0&&s.onStart(h,o,a),r=!0},this.itemEnd=function(h){o++,s.onProgress!==void 0&&s.onProgress(h,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,u){return c.push(h,u),this},this.removeHandler=function(h){let u=c.indexOf(h);return u!==-1&&c.splice(u,2),this},this.getHandler=function(h){for(let u=0,d=c.length;u<d;u+=2){let p=c[u],x=c[u+1];if(p.global&&(p.lastIndex=0),p.test(h))return x}return null},this.abort=function(){return this.abortController.abort(),this.abortController=new AbortController,this}}},au=new Po,Do=class{constructor(t){this.manager=t!==void 0?t:au,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(t,e){let n=this;return new Promise(function(s,r){n.load(t,s,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}abort(){return this}};Do.DEFAULT_MATERIAL_NAME="__DEFAULT";var hs=class extends ge{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Nt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){let e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}},us=class extends hs{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(ge.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Nt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}},gc=new te,lh=new I,hh=new I,Uo=class{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ot(512,512),this.mapType=_n,this.map=null,this.mapPass=null,this.matrix=new te,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new os,this._frameExtents=new ot(1,1),this._viewportCount=1,this._viewports=[new se(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){let e=this.camera,n=this.matrix;lh.setFromMatrixPosition(t.matrixWorld),e.position.copy(lh),hh.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(hh),e.updateMatrixWorld(),gc.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(gc,e.coordinateSystem,e.reversedDepth),e.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(gc)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}};var uh=new te,Ls=new I,xc=new I,wc=class extends Uo{constructor(){super(new De(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new ot(4,2),this._viewportCount=6,this._viewports=[new se(2,1,1,1),new se(0,1,1,1),new se(3,1,1,1),new se(1,1,1,1),new se(3,0,1,1),new se(1,0,1,1)],this._cubeDirections=[new I(1,0,0),new I(-1,0,0),new I(0,0,1),new I(0,0,-1),new I(0,1,0),new I(0,-1,0)],this._cubeUps=[new I(0,1,0),new I(0,1,0),new I(0,1,0),new I(0,1,0),new I(0,0,1),new I(0,0,-1)]}updateMatrices(t,e=0){let n=this.camera,s=this.matrix,r=t.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),Ls.setFromMatrixPosition(t.matrixWorld),n.position.copy(Ls),xc.copy(n.position),xc.add(this._cubeDirections[e]),n.up.copy(this._cubeUps[e]),n.lookAt(xc),n.updateMatrixWorld(),s.makeTranslation(-Ls.x,-Ls.y,-Ls.z),uh.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(uh,n.coordinateSystem,n.reversedDepth)}},Rn=class extends hs{constructor(t,e,n=0,s=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new wc}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}},dr=class extends qs{constructor(t=-1,e=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-t,o=n+t,a=s+e,l=s-e;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}},Tc=class extends Uo{constructor(){super(new dr(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},ds=class extends hs{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(ge.DEFAULT_UP),this.updateMatrix(),this.target=new ge,this.shadow=new Tc}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}};var Lo=class extends De{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}};var Kc="\\[\\]\\.:\\/",Rf=new RegExp("["+Kc+"]","g"),jc="[^"+Kc+"]",Cf="[^"+Kc.replace("\\.","")+"]",If=/((?:WC+[\/:])*)/.source.replace("WC",jc),Pf=/(WCOD+)?/.source.replace("WCOD",Cf),Df=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",jc),Uf=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",jc),Lf=new RegExp("^"+If+Pf+Df+Uf+"$"),Bf=["material","materials","bones","map"],Rc=class{constructor(t,e,n){let s=n||fe.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,s)}getValue(t,e){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(t,e)}setValue(t,e){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].unbind()}},fe=class i{constructor(t,e,n){this.path=e,this.parsedPath=n||i.parseTrackName(e),this.node=i.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,n){return t&&t.isAnimationObjectGroup?new i.Composite(t,e,n):new i(t,e,n)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(Rf,"")}static parseTrackName(t){let e=Lf.exec(t);if(e===null)throw new Error("PropertyBinding: Cannot parse trackName: "+t);let n={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);Bf.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+t);return n}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){let n=t.skeleton.getBoneByName(e);if(n!==void 0)return n}if(t.children){let n=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===e||a.uuid===e)return a;let l=n(a.children);if(l)return l}return null},s=n(t.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)t[e++]=n[s]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++]}_setValue_array_setNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node,e=this.parsedPath,n=e.objectName,s=e.propertyName,r=e.propertyIndex;if(t||(t=i.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=e.objectIndex;switch(n){case"materials":if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let h=0;h<t.length;h++)if(t[h].name===c){c=h;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[n]}if(c!==void 0){if(t[c]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[c]}}let o=t[s];if(o===void 0){let c=e.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",t);return}let a=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?a=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!t.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};fe.Composite=Rc;fe.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};fe.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};fe.prototype.GetterByBindingType=[fe.prototype._getValue_direct,fe.prototype._getValue_array,fe.prototype._getValue_arrayElement,fe.prototype._getValue_toArray];fe.prototype.SetterByBindingTypeAndVersioning=[[fe.prototype._setValue_direct,fe.prototype._setValue_direct_setNeedsUpdate,fe.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[fe.prototype._setValue_array,fe.prototype._setValue_array_setNeedsUpdate,fe.prototype._setValue_array_setMatrixWorldNeedsUpdate],[fe.prototype._setValue_arrayElement,fe.prototype._setValue_arrayElement_setNeedsUpdate,fe.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[fe.prototype._setValue_fromArray,fe.prototype._setValue_fromArray_setNeedsUpdate,fe.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var Rx=new Float32Array(1);var dh=new te,fr=class{constructor(t,e,n=0,s=1/0){this.ray=new es(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new ns,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return dh.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(dh),this}intersectObject(t,e=!0,n=[]){return Cc(t,this,n,e),n.sort(fh),n}intersectObjects(t,e=!0,n=[]){for(let s=0,r=t.length;s<r;s++)Cc(t[s],this,n,e);return n.sort(fh),n}};function fh(i,t){return i.distance-t.distance}function Cc(i,t,e,n){let s=!0;if(i.layers.test(t.layers)&&i.raycast(t,e)===!1&&(s=!1),s===!0&&n===!0){let r=i.children;for(let o=0,a=r.length;o<a;o++)Cc(r[o],t,e,!0)}}function $c(i,t,e,n){let s=Ff(n);switch(e){case Hc:return i*t;case Zo:return i*t/s.components*s.byteLength;case Jo:return i*t/s.components*s.byteLength;case Gc:return i*t*2/s.components*s.byteLength;case Ko:return i*t*2/s.components*s.byteLength;case kc:return i*t*3/s.components*s.byteLength;case rn:return i*t*4/s.components*s.byteLength;case jo:return i*t*4/s.components*s.byteLength;case gr:case xr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Ar:case _r:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case ta:case na:return Math.max(i,16)*Math.max(t,8)/4;case $o:case ea:return Math.max(i,8)*Math.max(t,8)/2;case ia:case sa:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case ra:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case oa:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case aa:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case ca:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case la:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case ha:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case ua:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case da:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case fa:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case pa:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case ma:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case ga:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case xa:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case Aa:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case _a:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case ya:case va:case Ma:return Math.ceil(i/4)*Math.ceil(t/4)*16;case ba:case Ea:return Math.ceil(i/4)*Math.ceil(t/4)*8;case Sa:case wa:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function Ff(i){switch(i){case _n:case Fc:return{byteLength:1,components:1};case ps:case Nc:case ms:return{byteLength:2,components:1};case qo:case Qo:return{byteLength:2,components:4};case oi:case Yo:case yn:return{byteLength:4,components:1};case Oc:case zc:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"180"}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="180");function Pu(){let i=null,t=!1,e=null,n=null;function s(r,o){e(r,o),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function Vf(i){let t=new WeakMap;function e(a,l){let c=a.array,h=a.usage,u=c.byteLength,d=i.createBuffer();i.bindBuffer(l,d),i.bufferData(l,c,h),a.onUploadCallback();let p;if(c instanceof Float32Array)p=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)p=i.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?p=i.HALF_FLOAT:p=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)p=i.SHORT;else if(c instanceof Uint32Array)p=i.UNSIGNED_INT;else if(c instanceof Int32Array)p=i.INT;else if(c instanceof Int8Array)p=i.BYTE;else if(c instanceof Uint8Array)p=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)p=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:p,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:u}}function n(a,l,c){let h=l.array,u=l.updateRanges;if(i.bindBuffer(c,a),u.length===0)i.bufferSubData(c,0,h);else{u.sort((p,x)=>p.start-x.start);let d=0;for(let p=1;p<u.length;p++){let x=u[d],g=u[p];g.start<=x.start+x.count+1?x.count=Math.max(x.count,g.start+g.count-x.start):(++d,u[d]=g)}u.length=d+1;for(let p=0,x=u.length;p<x;p++){let g=u[p];i.bufferSubData(c,g.start*h.BYTES_PER_ELEMENT,h,g.start,g.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);let l=t.get(a);l&&(i.deleteBuffer(l.buffer),t.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let h=t.get(a);(!h||h.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let c=t.get(a);if(c===void 0)t.set(a,e(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:s,remove:r,update:o}}var Wf=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Xf=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Yf=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,qf=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Qf=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Zf=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Jf=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Kf=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,jf=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,$f=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,tp=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,ep=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,np=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,ip=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,sp=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,rp=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,op=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,ap=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,cp=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,lp=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,hp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,up=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,dp=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,fp=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,pp=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,mp=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,gp=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,xp=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Ap=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,_p=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,yp="gl_FragColor = linearToOutputTexel( gl_FragColor );",vp=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Mp=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,bp=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Ep=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Sp=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,wp=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Tp=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Rp=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Cp=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Ip=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Pp=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Dp=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Up=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Lp=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Bp=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Fp=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Np=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Op=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,zp=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Hp=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,kp=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Gp=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Vp=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Wp=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Xp=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Yp=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,qp=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Qp=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Zp=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Jp=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Kp=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,jp=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,$p=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,tm=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,em=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,nm=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,im=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,sm=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,rm=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,om=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,am=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,cm=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,lm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,hm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,um=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,dm=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,fm=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,pm=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,mm=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,gm=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,xm=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Am=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,_m=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,ym=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,vm=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Mm=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,bm=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Em=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Sm=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow( sampler2D shadow, vec2 uv, float compare ) {
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare, distribution.x );
		#endif
		if ( hard_shadow != 1.0 ) {
			float distance = compare - distribution.x;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,wm=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Tm=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Rm=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Cm=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Im=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Pm=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Dm=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Um=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Lm=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Bm=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Fm=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Nm=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Om=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,zm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Hm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,km=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Gm=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,Vm=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Wm=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Xm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Ym=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,qm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Qm=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Zm=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Jm=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Km=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,jm=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,$m=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,t0=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,e0=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,n0=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,i0=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,s0=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,r0=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,o0=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,a0=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,c0=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,l0=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,h0=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,u0=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,d0=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,f0=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,p0=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,m0=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,g0=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,x0=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,A0=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,_0=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,y0=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,v0=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,M0=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Yt={alphahash_fragment:Wf,alphahash_pars_fragment:Xf,alphamap_fragment:Yf,alphamap_pars_fragment:qf,alphatest_fragment:Qf,alphatest_pars_fragment:Zf,aomap_fragment:Jf,aomap_pars_fragment:Kf,batching_pars_vertex:jf,batching_vertex:$f,begin_vertex:tp,beginnormal_vertex:ep,bsdfs:np,iridescence_fragment:ip,bumpmap_pars_fragment:sp,clipping_planes_fragment:rp,clipping_planes_pars_fragment:op,clipping_planes_pars_vertex:ap,clipping_planes_vertex:cp,color_fragment:lp,color_pars_fragment:hp,color_pars_vertex:up,color_vertex:dp,common:fp,cube_uv_reflection_fragment:pp,defaultnormal_vertex:mp,displacementmap_pars_vertex:gp,displacementmap_vertex:xp,emissivemap_fragment:Ap,emissivemap_pars_fragment:_p,colorspace_fragment:yp,colorspace_pars_fragment:vp,envmap_fragment:Mp,envmap_common_pars_fragment:bp,envmap_pars_fragment:Ep,envmap_pars_vertex:Sp,envmap_physical_pars_fragment:Fp,envmap_vertex:wp,fog_vertex:Tp,fog_pars_vertex:Rp,fog_fragment:Cp,fog_pars_fragment:Ip,gradientmap_pars_fragment:Pp,lightmap_pars_fragment:Dp,lights_lambert_fragment:Up,lights_lambert_pars_fragment:Lp,lights_pars_begin:Bp,lights_toon_fragment:Np,lights_toon_pars_fragment:Op,lights_phong_fragment:zp,lights_phong_pars_fragment:Hp,lights_physical_fragment:kp,lights_physical_pars_fragment:Gp,lights_fragment_begin:Vp,lights_fragment_maps:Wp,lights_fragment_end:Xp,logdepthbuf_fragment:Yp,logdepthbuf_pars_fragment:qp,logdepthbuf_pars_vertex:Qp,logdepthbuf_vertex:Zp,map_fragment:Jp,map_pars_fragment:Kp,map_particle_fragment:jp,map_particle_pars_fragment:$p,metalnessmap_fragment:tm,metalnessmap_pars_fragment:em,morphinstance_vertex:nm,morphcolor_vertex:im,morphnormal_vertex:sm,morphtarget_pars_vertex:rm,morphtarget_vertex:om,normal_fragment_begin:am,normal_fragment_maps:cm,normal_pars_fragment:lm,normal_pars_vertex:hm,normal_vertex:um,normalmap_pars_fragment:dm,clearcoat_normal_fragment_begin:fm,clearcoat_normal_fragment_maps:pm,clearcoat_pars_fragment:mm,iridescence_pars_fragment:gm,opaque_fragment:xm,packing:Am,premultiplied_alpha_fragment:_m,project_vertex:ym,dithering_fragment:vm,dithering_pars_fragment:Mm,roughnessmap_fragment:bm,roughnessmap_pars_fragment:Em,shadowmap_pars_fragment:Sm,shadowmap_pars_vertex:wm,shadowmap_vertex:Tm,shadowmask_pars_fragment:Rm,skinbase_vertex:Cm,skinning_pars_vertex:Im,skinning_vertex:Pm,skinnormal_vertex:Dm,specularmap_fragment:Um,specularmap_pars_fragment:Lm,tonemapping_fragment:Bm,tonemapping_pars_fragment:Fm,transmission_fragment:Nm,transmission_pars_fragment:Om,uv_pars_fragment:zm,uv_pars_vertex:Hm,uv_vertex:km,worldpos_vertex:Gm,background_vert:Vm,background_frag:Wm,backgroundCube_vert:Xm,backgroundCube_frag:Ym,cube_vert:qm,cube_frag:Qm,depth_vert:Zm,depth_frag:Jm,distanceRGBA_vert:Km,distanceRGBA_frag:jm,equirect_vert:$m,equirect_frag:t0,linedashed_vert:e0,linedashed_frag:n0,meshbasic_vert:i0,meshbasic_frag:s0,meshlambert_vert:r0,meshlambert_frag:o0,meshmatcap_vert:a0,meshmatcap_frag:c0,meshnormal_vert:l0,meshnormal_frag:h0,meshphong_vert:u0,meshphong_frag:d0,meshphysical_vert:f0,meshphysical_frag:p0,meshtoon_vert:m0,meshtoon_frag:g0,points_vert:x0,points_frag:A0,shadow_vert:_0,shadow_frag:y0,sprite_vert:v0,sprite_frag:M0},ft={common:{diffuse:{value:new Nt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Vt},alphaMap:{value:null},alphaMapTransform:{value:new Vt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Vt}},envmap:{envMap:{value:null},envMapRotation:{value:new Vt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Vt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Vt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Vt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Vt},normalScale:{value:new ot(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Vt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Vt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Vt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Vt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Nt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Nt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Vt},alphaTest:{value:0},uvTransform:{value:new Vt}},sprite:{diffuse:{value:new Nt(16777215)},opacity:{value:1},center:{value:new ot(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Vt},alphaMap:{value:null},alphaMapTransform:{value:new Vt},alphaTest:{value:0}}},In={basic:{uniforms:Fe([ft.common,ft.specularmap,ft.envmap,ft.aomap,ft.lightmap,ft.fog]),vertexShader:Yt.meshbasic_vert,fragmentShader:Yt.meshbasic_frag},lambert:{uniforms:Fe([ft.common,ft.specularmap,ft.envmap,ft.aomap,ft.lightmap,ft.emissivemap,ft.bumpmap,ft.normalmap,ft.displacementmap,ft.fog,ft.lights,{emissive:{value:new Nt(0)}}]),vertexShader:Yt.meshlambert_vert,fragmentShader:Yt.meshlambert_frag},phong:{uniforms:Fe([ft.common,ft.specularmap,ft.envmap,ft.aomap,ft.lightmap,ft.emissivemap,ft.bumpmap,ft.normalmap,ft.displacementmap,ft.fog,ft.lights,{emissive:{value:new Nt(0)},specular:{value:new Nt(1118481)},shininess:{value:30}}]),vertexShader:Yt.meshphong_vert,fragmentShader:Yt.meshphong_frag},standard:{uniforms:Fe([ft.common,ft.envmap,ft.aomap,ft.lightmap,ft.emissivemap,ft.bumpmap,ft.normalmap,ft.displacementmap,ft.roughnessmap,ft.metalnessmap,ft.fog,ft.lights,{emissive:{value:new Nt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Yt.meshphysical_vert,fragmentShader:Yt.meshphysical_frag},toon:{uniforms:Fe([ft.common,ft.aomap,ft.lightmap,ft.emissivemap,ft.bumpmap,ft.normalmap,ft.displacementmap,ft.gradientmap,ft.fog,ft.lights,{emissive:{value:new Nt(0)}}]),vertexShader:Yt.meshtoon_vert,fragmentShader:Yt.meshtoon_frag},matcap:{uniforms:Fe([ft.common,ft.bumpmap,ft.normalmap,ft.displacementmap,ft.fog,{matcap:{value:null}}]),vertexShader:Yt.meshmatcap_vert,fragmentShader:Yt.meshmatcap_frag},points:{uniforms:Fe([ft.points,ft.fog]),vertexShader:Yt.points_vert,fragmentShader:Yt.points_frag},dashed:{uniforms:Fe([ft.common,ft.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Yt.linedashed_vert,fragmentShader:Yt.linedashed_frag},depth:{uniforms:Fe([ft.common,ft.displacementmap]),vertexShader:Yt.depth_vert,fragmentShader:Yt.depth_frag},normal:{uniforms:Fe([ft.common,ft.bumpmap,ft.normalmap,ft.displacementmap,{opacity:{value:1}}]),vertexShader:Yt.meshnormal_vert,fragmentShader:Yt.meshnormal_frag},sprite:{uniforms:Fe([ft.sprite,ft.fog]),vertexShader:Yt.sprite_vert,fragmentShader:Yt.sprite_frag},background:{uniforms:{uvTransform:{value:new Vt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Yt.background_vert,fragmentShader:Yt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Vt}},vertexShader:Yt.backgroundCube_vert,fragmentShader:Yt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Yt.cube_vert,fragmentShader:Yt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Yt.equirect_vert,fragmentShader:Yt.equirect_frag},distanceRGBA:{uniforms:Fe([ft.common,ft.displacementmap,{referencePosition:{value:new I},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Yt.distanceRGBA_vert,fragmentShader:Yt.distanceRGBA_frag},shadow:{uniforms:Fe([ft.lights,ft.fog,{color:{value:new Nt(0)},opacity:{value:1}}]),vertexShader:Yt.shadow_vert,fragmentShader:Yt.shadow_frag}};In.physical={uniforms:Fe([In.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Vt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Vt},clearcoatNormalScale:{value:new ot(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Vt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Vt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Vt},sheen:{value:0},sheenColor:{value:new Nt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Vt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Vt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Vt},transmissionSamplerSize:{value:new ot},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Vt},attenuationDistance:{value:0},attenuationColor:{value:new Nt(0)},specularColor:{value:new Nt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Vt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Vt},anisotropyVector:{value:new ot},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Vt}}]),vertexShader:Yt.meshphysical_vert,fragmentShader:Yt.meshphysical_frag};var Ta={r:0,b:0,g:0},Ii=new Ze,b0=new te;function E0(i,t,e,n,s,r,o){let a=new Nt(0),l=r===!0?0:1,c,h,u=null,d=0,p=null;function x(v){let y=v.isScene===!0?v.background:null;return y&&y.isTexture&&(y=(v.backgroundBlurriness>0?e:t).get(y)),y}function g(v){let y=!1,R=x(v);R===null?f(a,l):R&&R.isColor&&(f(R,1),y=!0);let b=i.xr.getEnvironmentBlendMode();b==="additive"?n.buffers.color.setClear(0,0,0,1,o):b==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||y)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(v,y){let R=x(y);R&&(R.isCubeTexture||R.mapping===pr)?(h===void 0&&(h=new xt(new pe(1,1,1),new gn({name:"BackgroundCubeMaterial",uniforms:Ci(In.backgroundCube.uniforms),vertexShader:In.backgroundCube.vertexShader,fragmentShader:In.backgroundCube.fragmentShader,side:He,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(b,T,P){this.matrixWorld.copyPosition(P.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),Ii.copy(y.backgroundRotation),Ii.x*=-1,Ii.y*=-1,Ii.z*=-1,R.isCubeTexture&&R.isRenderTargetTexture===!1&&(Ii.y*=-1,Ii.z*=-1),h.material.uniforms.envMap.value=R,h.material.uniforms.flipEnvMap.value=R.isCubeTexture&&R.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=y.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(b0.makeRotationFromEuler(Ii)),h.material.toneMapped=jt.getTransfer(R.colorSpace)!==re,(u!==R||d!==R.version||p!==i.toneMapping)&&(h.material.needsUpdate=!0,u=R,d=R.version,p=i.toneMapping),h.layers.enableAll(),v.unshift(h,h.geometry,h.material,0,0,null)):R&&R.isTexture&&(c===void 0&&(c=new xt(new me(2,2),new gn({name:"BackgroundMaterial",uniforms:Ci(In.background.uniforms),vertexShader:In.background.vertexShader,fragmentShader:In.background.fragmentShader,side:fn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=R,c.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,c.material.toneMapped=jt.getTransfer(R.colorSpace)!==re,R.matrixAutoUpdate===!0&&R.updateMatrix(),c.material.uniforms.uvTransform.value.copy(R.matrix),(u!==R||d!==R.version||p!==i.toneMapping)&&(c.material.needsUpdate=!0,u=R,d=R.version,p=i.toneMapping),c.layers.enableAll(),v.unshift(c,c.geometry,c.material,0,0,null))}function f(v,y){v.getRGB(Ta,Zc(i)),n.buffers.color.setClear(Ta.r,Ta.g,Ta.b,y,o)}function A(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return a},setClearColor:function(v,y=1){a.set(v),l=y,f(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(v){l=v,f(a,l)},render:g,addToRenderList:m,dispose:A}}function S0(i,t){let e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=d(null),r=s,o=!1;function a(_,S,D,L,z){let F=!1,H=u(L,D,S);r!==H&&(r=H,c(r.object)),F=p(_,L,D,z),F&&x(_,L,D,z),z!==null&&t.update(z,i.ELEMENT_ARRAY_BUFFER),(F||o)&&(o=!1,y(_,S,D,L),z!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(z).buffer))}function l(){return i.createVertexArray()}function c(_){return i.bindVertexArray(_)}function h(_){return i.deleteVertexArray(_)}function u(_,S,D){let L=D.wireframe===!0,z=n[_.id];z===void 0&&(z={},n[_.id]=z);let F=z[S.id];F===void 0&&(F={},z[S.id]=F);let H=F[L];return H===void 0&&(H=d(l()),F[L]=H),H}function d(_){let S=[],D=[],L=[];for(let z=0;z<e;z++)S[z]=0,D[z]=0,L[z]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:S,enabledAttributes:D,attributeDivisors:L,object:_,attributes:{},index:null}}function p(_,S,D,L){let z=r.attributes,F=S.attributes,H=0,q=D.getAttributes();for(let G in q)if(q[G].location>=0){let At=z[G],vt=F[G];if(vt===void 0&&(G==="instanceMatrix"&&_.instanceMatrix&&(vt=_.instanceMatrix),G==="instanceColor"&&_.instanceColor&&(vt=_.instanceColor)),At===void 0||At.attribute!==vt||vt&&At.data!==vt.data)return!0;H++}return r.attributesNum!==H||r.index!==L}function x(_,S,D,L){let z={},F=S.attributes,H=0,q=D.getAttributes();for(let G in q)if(q[G].location>=0){let At=F[G];At===void 0&&(G==="instanceMatrix"&&_.instanceMatrix&&(At=_.instanceMatrix),G==="instanceColor"&&_.instanceColor&&(At=_.instanceColor));let vt={};vt.attribute=At,At&&At.data&&(vt.data=At.data),z[G]=vt,H++}r.attributes=z,r.attributesNum=H,r.index=L}function g(){let _=r.newAttributes;for(let S=0,D=_.length;S<D;S++)_[S]=0}function m(_){f(_,0)}function f(_,S){let D=r.newAttributes,L=r.enabledAttributes,z=r.attributeDivisors;D[_]=1,L[_]===0&&(i.enableVertexAttribArray(_),L[_]=1),z[_]!==S&&(i.vertexAttribDivisor(_,S),z[_]=S)}function A(){let _=r.newAttributes,S=r.enabledAttributes;for(let D=0,L=S.length;D<L;D++)S[D]!==_[D]&&(i.disableVertexAttribArray(D),S[D]=0)}function v(_,S,D,L,z,F,H){H===!0?i.vertexAttribIPointer(_,S,D,z,F):i.vertexAttribPointer(_,S,D,L,z,F)}function y(_,S,D,L){g();let z=L.attributes,F=D.getAttributes(),H=S.defaultAttributeValues;for(let q in F){let G=F[q];if(G.location>=0){let lt=z[q];if(lt===void 0&&(q==="instanceMatrix"&&_.instanceMatrix&&(lt=_.instanceMatrix),q==="instanceColor"&&_.instanceColor&&(lt=_.instanceColor)),lt!==void 0){let At=lt.normalized,vt=lt.itemSize,Gt=t.get(lt);if(Gt===void 0)continue;let Jt=Gt.buffer,ne=Gt.type,Kt=Gt.bytesPerElement,Q=ne===i.INT||ne===i.UNSIGNED_INT||lt.gpuType===Yo;if(lt.isInterleavedBufferAttribute){let et=lt.data,yt=et.stride,It=lt.offset;if(et.isInstancedInterleavedBuffer){for(let Et=0;Et<G.locationSize;Et++)f(G.location+Et,et.meshPerAttribute);_.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=et.meshPerAttribute*et.count)}else for(let Et=0;Et<G.locationSize;Et++)m(G.location+Et);i.bindBuffer(i.ARRAY_BUFFER,Jt);for(let Et=0;Et<G.locationSize;Et++)v(G.location+Et,vt/G.locationSize,ne,At,yt*Kt,(It+vt/G.locationSize*Et)*Kt,Q)}else{if(lt.isInstancedBufferAttribute){for(let et=0;et<G.locationSize;et++)f(G.location+et,lt.meshPerAttribute);_.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=lt.meshPerAttribute*lt.count)}else for(let et=0;et<G.locationSize;et++)m(G.location+et);i.bindBuffer(i.ARRAY_BUFFER,Jt);for(let et=0;et<G.locationSize;et++)v(G.location+et,vt/G.locationSize,ne,At,vt*Kt,vt/G.locationSize*et*Kt,Q)}}else if(H!==void 0){let At=H[q];if(At!==void 0)switch(At.length){case 2:i.vertexAttrib2fv(G.location,At);break;case 3:i.vertexAttrib3fv(G.location,At);break;case 4:i.vertexAttrib4fv(G.location,At);break;default:i.vertexAttrib1fv(G.location,At)}}}}A()}function R(){P();for(let _ in n){let S=n[_];for(let D in S){let L=S[D];for(let z in L)h(L[z].object),delete L[z];delete S[D]}delete n[_]}}function b(_){if(n[_.id]===void 0)return;let S=n[_.id];for(let D in S){let L=S[D];for(let z in L)h(L[z].object),delete L[z];delete S[D]}delete n[_.id]}function T(_){for(let S in n){let D=n[S];if(D[_.id]===void 0)continue;let L=D[_.id];for(let z in L)h(L[z].object),delete L[z];delete D[_.id]}}function P(){M(),o=!0,r!==s&&(r=s,c(r.object))}function M(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:P,resetDefaultState:M,dispose:R,releaseStatesOfGeometry:b,releaseStatesOfProgram:T,initAttributes:g,enableAttribute:m,disableUnusedAttributes:A}}function w0(i,t,e){let n;function s(c){n=c}function r(c,h){i.drawArrays(n,c,h),e.update(h,n,1)}function o(c,h,u){u!==0&&(i.drawArraysInstanced(n,c,h,u),e.update(h,n,u))}function a(c,h,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,h,0,u);let p=0;for(let x=0;x<u;x++)p+=h[x];e.update(p,n,1)}function l(c,h,u,d){if(u===0)return;let p=t.get("WEBGL_multi_draw");if(p===null)for(let x=0;x<c.length;x++)o(c[x],h[x],d[x]);else{p.multiDrawArraysInstancedWEBGL(n,c,0,h,0,d,0,u);let x=0;for(let g=0;g<u;g++)x+=h[g]*d[g];e.update(x,n,1)}}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function T0(i,t,e,n){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){let T=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(T.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(T){return!(T!==rn&&n.convert(T)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(T){let P=T===ms&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(T!==_n&&n.convert(T)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&T!==yn&&!P)}function l(T){if(T==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";T="mediump"}return T==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp",h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);let u=e.logarithmicDepthBuffer===!0,d=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),p=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),x=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),f=i.getParameter(i.MAX_VERTEX_ATTRIBS),A=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),v=i.getParameter(i.MAX_VARYING_VECTORS),y=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),R=x>0,b=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:u,reversedDepthBuffer:d,maxTextures:p,maxVertexTextures:x,maxTextureSize:g,maxCubemapSize:m,maxAttributes:f,maxVertexUniforms:A,maxVaryings:v,maxFragmentUniforms:y,vertexTextures:R,maxSamples:b}}function R0(i){let t=this,e=null,n=0,s=!1,r=!1,o=new En,a=new Vt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){let p=u.length!==0||d||n!==0||s;return s=d,n=u.length,p},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){e=h(u,d,0)},this.setState=function(u,d,p){let x=u.clippingPlanes,g=u.clipIntersection,m=u.clipShadows,f=i.get(u);if(!s||x===null||x.length===0||r&&!m)r?h(null):c();else{let A=r?0:n,v=A*4,y=f.clippingState||null;l.value=y,y=h(x,d,v,p);for(let R=0;R!==v;++R)y[R]=e[R];f.clippingState=y,this.numIntersection=g?this.numPlanes:0,this.numPlanes+=A}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(u,d,p,x){let g=u!==null?u.length:0,m=null;if(g!==0){if(m=l.value,x!==!0||m===null){let f=p+g*4,A=d.matrixWorldInverse;a.getNormalMatrix(A),(m===null||m.length<f)&&(m=new Float32Array(f));for(let v=0,y=p;v!==g;++v,y+=4)o.copy(u[v]).applyMatrix4(A,a),o.normal.toArray(m,y),m[y+3]=o.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=g,t.numIntersection=0,m}}function C0(i){let t=new WeakMap;function e(o,a){return a===fs?o.mapping=wi:a===Wo&&(o.mapping=Ti),o}function n(o){if(o&&o.isTexture){let a=o.mapping;if(a===fs||a===Wo)if(t.has(o)){let l=t.get(o).texture;return e(l,o.mapping)}else{let l=o.image;if(l&&l.height>0){let c=new uo(l.height);return c.fromEquirectangularTexture(i,o),t.set(o,c),o.addEventListener("dispose",s),e(c.texture,o.mapping)}else return null}}return o}function s(o){let a=o.target;a.removeEventListener("dispose",s);let l=t.get(a);l!==void 0&&(t.delete(a),l.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}var _s=4,cu=[.125,.215,.35,.446,.526,.582],Ui=20,tl=new dr,lu=new Nt,el=null,nl=0,il=0,sl=!1,Di=(1+Math.sqrt(5))/2,As=1/Di,hu=[new I(-Di,As,0),new I(Di,As,0),new I(-As,0,Di),new I(As,0,Di),new I(0,Di,-As),new I(0,Di,As),new I(-1,1,-1),new I(1,1,-1),new I(-1,1,1),new I(1,1,1)],I0=new I,vs=class{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100,r={}){let{size:o=256,position:a=I0}=r;el=this._renderer.getRenderTarget(),nl=this._renderer.getActiveCubeFace(),il=this._renderer.getActiveMipmapLevel(),sl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(t,n,s,l,a),e>0&&this._blur(l,0,0,e),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=fu(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=du(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(el,nl,il),this._renderer.xr.enabled=sl,t.scissorTest=!1,Ra(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===wi||t.mapping===Ti?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),el=this._renderer.getRenderTarget(),nl=this._renderer.getActiveCubeFace(),il=this._renderer.getActiveMipmapLevel(),sl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:pn,minFilter:pn,generateMipmaps:!1,type:ms,format:rn,colorSpace:yi,depthBuffer:!1},s=uu(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=uu(t,e,n);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=P0(r)),this._blurMaterial=D0(r,t,e)}return s}_compileMaterial(t){let e=new xt(this._lodPlanes[0],t);this._renderer.compile(e,tl)}_sceneToCubeUV(t,e,n,s,r){let l=new De(90,1,e,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,d=u.autoClear,p=u.toneMapping;u.getClearColor(lu),u.toneMapping=Wn,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(s),u.clearDepth(),u.setRenderTarget(null));let g=new ae({name:"PMREM.Background",side:He,depthWrite:!1,depthTest:!1}),m=new xt(new pe,g),f=!1,A=t.background;A?A.isColor&&(g.color.copy(A),t.background=null,f=!0):(g.color.copy(lu),f=!0);for(let v=0;v<6;v++){let y=v%3;y===0?(l.up.set(0,c[v],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[v],r.y,r.z)):y===1?(l.up.set(0,0,c[v]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[v],r.z)):(l.up.set(0,c[v],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[v]));let R=this._cubeSize;Ra(s,y*R,v>2?R:0,R,R),u.setRenderTarget(s),f&&u.render(m,l),u.render(t,l)}m.geometry.dispose(),m.material.dispose(),u.toneMapping=p,u.autoClear=d,t.background=A}_textureToCubeUV(t,e){let n=this._renderer,s=t.mapping===wi||t.mapping===Ti;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=fu()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=du());let r=s?this._cubemapMaterial:this._equirectMaterial,o=new xt(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=t;let l=this._cubeSize;Ra(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(o,tl)}_applyPMREM(t){let e=this._renderer,n=e.autoClear;e.autoClear=!1;let s=this._lodPlanes.length;for(let r=1;r<s;r++){let o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=hu[(s-r-1)%hu.length];this._blur(t,r-1,r,o,a)}e.autoClear=n}_blur(t,e,n,s,r){let o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,s,"latitudinal",r),this._halfBlur(o,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,o,a){let l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let h=3,u=new xt(this._lodPlanes[s],c),d=c.uniforms,p=this._sizeLods[n]-1,x=isFinite(r)?Math.PI/(2*p):2*Math.PI/(2*Ui-1),g=r/x,m=isFinite(r)?1+Math.floor(h*g):Ui;m>Ui&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Ui}`);let f=[],A=0;for(let T=0;T<Ui;++T){let P=T/g,M=Math.exp(-P*P/2);f.push(M),T===0?A+=M:T<m&&(A+=2*M)}for(let T=0;T<f.length;T++)f[T]=f[T]/A;d.envMap.value=t.texture,d.samples.value=m,d.weights.value=f,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);let{_lodMax:v}=this;d.dTheta.value=x,d.mipInt.value=v-n;let y=this._sizeLods[s],R=3*y*(s>v-_s?s-v+_s:0),b=4*(this._cubeSize-y);Ra(e,R,b,3*y,2*y),l.setRenderTarget(e),l.render(u,tl)}};function P0(i){let t=[],e=[],n=[],s=i,r=i-_s+1+cu.length;for(let o=0;o<r;o++){let a=Math.pow(2,s);e.push(a);let l=1/a;o>i-_s?l=cu[o-i+_s-1]:o===0&&(l=0),n.push(l);let c=1/(a-2),h=-c,u=1+c,d=[h,h,u,h,u,u,h,h,u,u,h,u],p=6,x=6,g=3,m=2,f=1,A=new Float32Array(g*x*p),v=new Float32Array(m*x*p),y=new Float32Array(f*x*p);for(let b=0;b<p;b++){let T=b%3*2/3-1,P=b>2?0:-1,M=[T,P,0,T+2/3,P,0,T+2/3,P+1,0,T,P,0,T+2/3,P+1,0,T,P+1,0];A.set(M,g*x*b),v.set(d,m*x*b);let _=[b,b,b,b,b,b];y.set(_,f*x*b)}let R=new ue;R.setAttribute("position",new ve(A,g)),R.setAttribute("uv",new ve(v,m)),R.setAttribute("faceIndex",new ve(y,f)),t.push(R),s>_s&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function uu(i,t,e){let n=new Sn(i,t,e);return n.texture.mapping=pr,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Ra(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function D0(i,t,e){let n=new Float32Array(Ui),s=new I(0,1,0);return new gn({name:"SphericalGaussianBlur",defines:{n:Ui,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:pl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Vn,depthTest:!1,depthWrite:!1})}function du(){return new gn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:pl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Vn,depthTest:!1,depthWrite:!1})}function fu(){return new gn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:pl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Vn,depthTest:!1,depthWrite:!1})}function pl(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function U0(i){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){let l=a.mapping,c=l===fs||l===Wo,h=l===wi||l===Ti;if(c||h){let u=t.get(a),d=u!==void 0?u.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==d)return e===null&&(e=new vs(i)),u=c?e.fromEquirectangular(a,u):e.fromCubemap(a,u),u.texture.pmremVersion=a.pmremVersion,t.set(a,u),u.texture;if(u!==void 0)return u.texture;{let p=a.image;return c&&p&&p.height>0||h&&p&&s(p)?(e===null&&(e=new vs(i)),u=c?e.fromEquirectangular(a):e.fromCubemap(a),u.texture.pmremVersion=a.pmremVersion,t.set(a,u),a.addEventListener("dispose",r),u.texture):null}}}return a}function s(a){let l=0,c=6;for(let h=0;h<c;h++)a[h]!==void 0&&l++;return l===c}function r(a){let l=a.target;l.removeEventListener("dispose",r);let c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:o}}function L0(i){let t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){let s=e(n);return s===null&&$i("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function B0(i,t,e,n){let s={},r=new WeakMap;function o(u){let d=u.target;d.index!==null&&t.remove(d.index);for(let x in d.attributes)t.remove(d.attributes[x]);d.removeEventListener("dispose",o),delete s[d.id];let p=r.get(d);p&&(t.remove(p),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function a(u,d){return s[d.id]===!0||(d.addEventListener("dispose",o),s[d.id]=!0,e.memory.geometries++),d}function l(u){let d=u.attributes;for(let p in d)t.update(d[p],i.ARRAY_BUFFER)}function c(u){let d=[],p=u.index,x=u.attributes.position,g=0;if(p!==null){let A=p.array;g=p.version;for(let v=0,y=A.length;v<y;v+=3){let R=A[v+0],b=A[v+1],T=A[v+2];d.push(R,b,b,T,T,R)}}else if(x!==void 0){let A=x.array;g=x.version;for(let v=0,y=A.length/3-1;v<y;v+=3){let R=v+0,b=v+1,T=v+2;d.push(R,b,b,T,T,R)}}else return;let m=new(Qc(d)?Ys:Xs)(d,1);m.version=g;let f=r.get(u);f&&t.remove(f),r.set(u,m)}function h(u){let d=r.get(u);if(d){let p=u.index;p!==null&&d.version<p.version&&c(u)}else c(u);return r.get(u)}return{get:a,update:l,getWireframeAttribute:h}}function F0(i,t,e){let n;function s(d){n=d}let r,o;function a(d){r=d.type,o=d.bytesPerElement}function l(d,p){i.drawElements(n,p,r,d*o),e.update(p,n,1)}function c(d,p,x){x!==0&&(i.drawElementsInstanced(n,p,r,d*o,x),e.update(p,n,x))}function h(d,p,x){if(x===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,p,0,r,d,0,x);let m=0;for(let f=0;f<x;f++)m+=p[f];e.update(m,n,1)}function u(d,p,x,g){if(x===0)return;let m=t.get("WEBGL_multi_draw");if(m===null)for(let f=0;f<d.length;f++)c(d[f]/o,p[f],g[f]);else{m.multiDrawElementsInstancedWEBGL(n,p,0,r,d,0,g,0,x);let f=0;for(let A=0;A<x;A++)f+=p[A]*g[A];e.update(f,n,1)}}this.setMode=s,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function N0(i){let t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case i.TRIANGLES:e.triangles+=a*(r/3);break;case i.LINES:e.lines+=a*(r/2);break;case i.LINE_STRIP:e.lines+=a*(r-1);break;case i.LINE_LOOP:e.lines+=a*r;break;case i.POINTS:e.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function O0(i,t,e){let n=new WeakMap,s=new se;function r(o,a,l){let c=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=h!==void 0?h.length:0,d=n.get(a);if(d===void 0||d.count!==u){let M=function(){T.dispose(),n.delete(a),a.removeEventListener("dispose",M)};d!==void 0&&d.texture.dispose();let p=a.morphAttributes.position!==void 0,x=a.morphAttributes.normal!==void 0,g=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],f=a.morphAttributes.normal||[],A=a.morphAttributes.color||[],v=0;p===!0&&(v=1),x===!0&&(v=2),g===!0&&(v=3);let y=a.attributes.position.count*v,R=1;y>t.maxTextureSize&&(R=Math.ceil(y/t.maxTextureSize),y=t.maxTextureSize);let b=new Float32Array(y*R*4*u),T=new Ws(b,y,R,u);T.type=yn,T.needsUpdate=!0;let P=v*4;for(let _=0;_<u;_++){let S=m[_],D=f[_],L=A[_],z=y*R*4*_;for(let F=0;F<S.count;F++){let H=F*P;p===!0&&(s.fromBufferAttribute(S,F),b[z+H+0]=s.x,b[z+H+1]=s.y,b[z+H+2]=s.z,b[z+H+3]=0),x===!0&&(s.fromBufferAttribute(D,F),b[z+H+4]=s.x,b[z+H+5]=s.y,b[z+H+6]=s.z,b[z+H+7]=0),g===!0&&(s.fromBufferAttribute(L,F),b[z+H+8]=s.x,b[z+H+9]=s.y,b[z+H+10]=s.z,b[z+H+11]=L.itemSize===4?s.w:1)}}d={count:u,texture:T,size:new ot(y,R)},n.set(a,d),a.addEventListener("dispose",M)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",o.morphTexture,e);else{let p=0;for(let g=0;g<c.length;g++)p+=c[g];let x=a.morphTargetsRelative?1:1-p;l.getUniforms().setValue(i,"morphTargetBaseInfluence",x),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",d.texture,e),l.getUniforms().setValue(i,"morphTargetsTextureSize",d.size)}return{update:r}}function z0(i,t,e,n){let s=new WeakMap;function r(l){let c=n.render.frame,h=l.geometry,u=t.get(l,h);if(s.get(u)!==c&&(t.update(u),s.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),s.get(l)!==c&&(e.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){let d=l.skeleton;s.get(d)!==c&&(d.update(),s.set(d,c))}return u}function o(){s=new WeakMap}function a(l){let c=l.target;c.removeEventListener("dispose",a),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:r,dispose:o}}var Du=new ze,pu=new Ks(1,1),Uu=new Ws,Lu=new lo,Bu=new Qs,mu=[],gu=[],xu=new Float32Array(16),Au=new Float32Array(9),_u=new Float32Array(4);function Ms(i,t,e){let n=i[0];if(n<=0||n>0)return i;let s=t*e,r=mu[s];if(r===void 0&&(r=new Float32Array(s),mu[s]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,i[o].toArray(r,a)}return r}function Re(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Ce(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function Pa(i,t){let e=gu[t];e===void 0&&(e=new Int32Array(t),gu[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function H0(i,t){let e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function k0(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Re(e,t))return;i.uniform2fv(this.addr,t),Ce(e,t)}}function G0(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Re(e,t))return;i.uniform3fv(this.addr,t),Ce(e,t)}}function V0(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Re(e,t))return;i.uniform4fv(this.addr,t),Ce(e,t)}}function W0(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(Re(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Ce(e,t)}else{if(Re(e,n))return;_u.set(n),i.uniformMatrix2fv(this.addr,!1,_u),Ce(e,n)}}function X0(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(Re(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Ce(e,t)}else{if(Re(e,n))return;Au.set(n),i.uniformMatrix3fv(this.addr,!1,Au),Ce(e,n)}}function Y0(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(Re(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Ce(e,t)}else{if(Re(e,n))return;xu.set(n),i.uniformMatrix4fv(this.addr,!1,xu),Ce(e,n)}}function q0(i,t){let e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function Q0(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Re(e,t))return;i.uniform2iv(this.addr,t),Ce(e,t)}}function Z0(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Re(e,t))return;i.uniform3iv(this.addr,t),Ce(e,t)}}function J0(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Re(e,t))return;i.uniform4iv(this.addr,t),Ce(e,t)}}function K0(i,t){let e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function j0(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Re(e,t))return;i.uniform2uiv(this.addr,t),Ce(e,t)}}function $0(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Re(e,t))return;i.uniform3uiv(this.addr,t),Ce(e,t)}}function tg(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Re(e,t))return;i.uniform4uiv(this.addr,t),Ce(e,t)}}function eg(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(pu.compareFunction=Wc,r=pu):r=Du,e.setTexture2D(t||r,s)}function ng(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||Lu,s)}function ig(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||Bu,s)}function sg(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||Uu,s)}function rg(i){switch(i){case 5126:return H0;case 35664:return k0;case 35665:return G0;case 35666:return V0;case 35674:return W0;case 35675:return X0;case 35676:return Y0;case 5124:case 35670:return q0;case 35667:case 35671:return Q0;case 35668:case 35672:return Z0;case 35669:case 35673:return J0;case 5125:return K0;case 36294:return j0;case 36295:return $0;case 36296:return tg;case 35678:case 36198:case 36298:case 36306:case 35682:return eg;case 35679:case 36299:case 36307:return ng;case 35680:case 36300:case 36308:case 36293:return ig;case 36289:case 36303:case 36311:case 36292:return sg}}function og(i,t){i.uniform1fv(this.addr,t)}function ag(i,t){let e=Ms(t,this.size,2);i.uniform2fv(this.addr,e)}function cg(i,t){let e=Ms(t,this.size,3);i.uniform3fv(this.addr,e)}function lg(i,t){let e=Ms(t,this.size,4);i.uniform4fv(this.addr,e)}function hg(i,t){let e=Ms(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function ug(i,t){let e=Ms(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function dg(i,t){let e=Ms(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function fg(i,t){i.uniform1iv(this.addr,t)}function pg(i,t){i.uniform2iv(this.addr,t)}function mg(i,t){i.uniform3iv(this.addr,t)}function gg(i,t){i.uniform4iv(this.addr,t)}function xg(i,t){i.uniform1uiv(this.addr,t)}function Ag(i,t){i.uniform2uiv(this.addr,t)}function _g(i,t){i.uniform3uiv(this.addr,t)}function yg(i,t){i.uniform4uiv(this.addr,t)}function vg(i,t,e){let n=this.cache,s=t.length,r=Pa(e,s);Re(n,r)||(i.uniform1iv(this.addr,r),Ce(n,r));for(let o=0;o!==s;++o)e.setTexture2D(t[o]||Du,r[o])}function Mg(i,t,e){let n=this.cache,s=t.length,r=Pa(e,s);Re(n,r)||(i.uniform1iv(this.addr,r),Ce(n,r));for(let o=0;o!==s;++o)e.setTexture3D(t[o]||Lu,r[o])}function bg(i,t,e){let n=this.cache,s=t.length,r=Pa(e,s);Re(n,r)||(i.uniform1iv(this.addr,r),Ce(n,r));for(let o=0;o!==s;++o)e.setTextureCube(t[o]||Bu,r[o])}function Eg(i,t,e){let n=this.cache,s=t.length,r=Pa(e,s);Re(n,r)||(i.uniform1iv(this.addr,r),Ce(n,r));for(let o=0;o!==s;++o)e.setTexture2DArray(t[o]||Uu,r[o])}function Sg(i){switch(i){case 5126:return og;case 35664:return ag;case 35665:return cg;case 35666:return lg;case 35674:return hg;case 35675:return ug;case 35676:return dg;case 5124:case 35670:return fg;case 35667:case 35671:return pg;case 35668:case 35672:return mg;case 35669:case 35673:return gg;case 5125:return xg;case 36294:return Ag;case 36295:return _g;case 36296:return yg;case 35678:case 36198:case 36298:case 36306:case 35682:return vg;case 35679:case 36299:case 36307:return Mg;case 35680:case 36300:case 36308:case 36293:return bg;case 36289:case 36303:case 36311:case 36292:return Eg}}var ol=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=rg(e.type)}},al=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Sg(e.type)}},cl=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){let s=this.seq;for(let r=0,o=s.length;r!==o;++r){let a=s[r];a.setValue(t,e[a.id],n)}}},rl=/(\w+)(\])?(\[|\.)?/g;function yu(i,t){i.seq.push(t),i.map[t.id]=t}function wg(i,t,e){let n=i.name,s=n.length;for(rl.lastIndex=0;;){let r=rl.exec(n),o=rl.lastIndex,a=r[1],l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===s){yu(e,c===void 0?new ol(a,i,t):new al(a,i,t));break}else{let u=e.map[a];u===void 0&&(u=new cl(a),yu(e,u)),e=u}}}var ys=class{constructor(t,e){this.seq=[],this.map={};let n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){let r=t.getActiveUniform(e,s),o=t.getUniformLocation(e,r.name);wg(r,o,this)}}setValue(t,e,n,s){let r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){let s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,o=e.length;r!==o;++r){let a=e[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(t,l.value,s)}}static seqWithValue(t,e){let n=[];for(let s=0,r=t.length;s!==r;++s){let o=t[s];o.id in e&&n.push(o)}return n}};function vu(i,t,e){let n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}var Tg=37297,Rg=0;function Cg(i,t){let e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=s;o<r;o++){let a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}var Mu=new Vt;function Ig(i){jt._getMatrix(Mu,jt.workingColorSpace,i);let t=`mat3( ${Mu.elements.map(e=>e.toFixed(4))} )`;switch(jt.getTransfer(i)){case ks:return[t,"LinearTransferOETF"];case re:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function bu(i,t,e){let n=i.getShaderParameter(t,i.COMPILE_STATUS),r=(i.getShaderInfoLog(t)||"").trim();if(n&&r==="")return"";let o=/ERROR: 0:(\d+)/.exec(r);if(o){let a=parseInt(o[1]);return e.toUpperCase()+`

`+r+`

`+Cg(i.getShaderSource(t),a)}else return r}function Pg(i,t){let e=Ig(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function Dg(i,t){let e;switch(t){case Fh:e="Linear";break;case Nh:e="Reinhard";break;case Oh:e="Cineon";break;case Vo:e="ACESFilmic";break;case Hh:e="AgX";break;case kh:e="Neutral";break;case zh:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}var Ca=new I;function Ug(){jt.getLuminanceCoefficients(Ca);let i=Ca.x.toFixed(4),t=Ca.y.toFixed(4),e=Ca.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Lg(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(yr).join(`
`)}function Bg(i){let t=[];for(let e in i){let n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function Fg(i,t){let e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(t,s),o=r.name,a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:i.getAttribLocation(t,o),locationSize:a}}return e}function yr(i){return i!==""}function Eu(i,t){let e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Su(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var Ng=/^[ \t]*#include +<([\w\d./]+)>/gm;function ll(i){return i.replace(Ng,zg)}var Og=new Map;function zg(i,t){let e=Yt[t];if(e===void 0){let n=Og.get(t);if(n!==void 0)e=Yt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return ll(e)}var Hg=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function wu(i){return i.replace(Hg,kg)}function kg(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Tu(i){let t=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function Gg(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Pc?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===Bo?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Cn&&(t="SHADOWMAP_TYPE_VSM"),t}function Vg(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case wi:case Ti:t="ENVMAP_TYPE_CUBE";break;case pr:t="ENVMAP_TYPE_CUBE_UV";break}return t}function Wg(i){let t="ENVMAP_MODE_REFLECTION";return i.envMap&&i.envMapMode===Ti&&(t="ENVMAP_MODE_REFRACTION"),t}function Xg(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Lc:t="ENVMAP_BLENDING_MULTIPLY";break;case Lh:t="ENVMAP_BLENDING_MIX";break;case Bh:t="ENVMAP_BLENDING_ADD";break}return t}function Yg(i){let t=i.envMapCubeUVHeight;if(t===null)return null;let e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function qg(i,t,e,n){let s=i.getContext(),r=e.defines,o=e.vertexShader,a=e.fragmentShader,l=Gg(e),c=Vg(e),h=Wg(e),u=Xg(e),d=Yg(e),p=Lg(e),x=Bg(r),g=s.createProgram(),m,f,A=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,x].filter(yr).join(`
`),m.length>0&&(m+=`
`),f=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,x].filter(yr).join(`
`),f.length>0&&(f+=`
`)):(m=[Tu(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,x,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(yr).join(`
`),f=[Tu(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,x,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Wn?"#define TONE_MAPPING":"",e.toneMapping!==Wn?Yt.tonemapping_pars_fragment:"",e.toneMapping!==Wn?Dg("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Yt.colorspace_pars_fragment,Pg("linearToOutputTexel",e.outputColorSpace),Ug(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(yr).join(`
`)),o=ll(o),o=Eu(o,e),o=Su(o,e),a=ll(a),a=Eu(a,e),a=Su(a,e),o=wu(o),a=wu(a),e.isRawShaderMaterial!==!0&&(A=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,f=["#define varying in",e.glslVersion===Yc?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Yc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);let v=A+m+o,y=A+f+a,R=vu(s,s.VERTEX_SHADER,v),b=vu(s,s.FRAGMENT_SHADER,y);s.attachShader(g,R),s.attachShader(g,b),e.index0AttributeName!==void 0?s.bindAttribLocation(g,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(g,0,"position"),s.linkProgram(g);function T(S){if(i.debug.checkShaderErrors){let D=s.getProgramInfoLog(g)||"",L=s.getShaderInfoLog(R)||"",z=s.getShaderInfoLog(b)||"",F=D.trim(),H=L.trim(),q=z.trim(),G=!0,lt=!0;if(s.getProgramParameter(g,s.LINK_STATUS)===!1)if(G=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,g,R,b);else{let At=bu(s,R,"vertex"),vt=bu(s,b,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(g,s.VALIDATE_STATUS)+`

Material Name: `+S.name+`
Material Type: `+S.type+`

Program Info Log: `+F+`
`+At+`
`+vt)}else F!==""?console.warn("THREE.WebGLProgram: Program Info Log:",F):(H===""||q==="")&&(lt=!1);lt&&(S.diagnostics={runnable:G,programLog:F,vertexShader:{log:H,prefix:m},fragmentShader:{log:q,prefix:f}})}s.deleteShader(R),s.deleteShader(b),P=new ys(s,g),M=Fg(s,g)}let P;this.getUniforms=function(){return P===void 0&&T(this),P};let M;this.getAttributes=function(){return M===void 0&&T(this),M};let _=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return _===!1&&(_=s.getProgramParameter(g,Tg)),_},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(g),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Rg++,this.cacheKey=t,this.usedTimes=1,this.program=g,this.vertexShader=R,this.fragmentShader=b,this}var Qg=0,hl=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){let e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(t);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(t){let e=this.materialCache.get(t);for(let n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let e=this.materialCache,n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){let e=this.shaderCache,n=e.get(t);return n===void 0&&(n=new ul(t),e.set(t,n)),n}},ul=class{constructor(t){this.id=Qg++,this.code=t,this.usedTimes=0}};function Zg(i,t,e,n,s,r,o){let a=new ns,l=new hl,c=new Set,h=[],u=s.logarithmicDepthBuffer,d=s.vertexTextures,p=s.precision,x={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(M){return c.add(M),M===0?"uv":`uv${M}`}function m(M,_,S,D,L){let z=D.fog,F=L.geometry,H=M.isMeshStandardMaterial?D.environment:null,q=(M.isMeshStandardMaterial?e:t).get(M.envMap||H),G=q&&q.mapping===pr?q.image.height:null,lt=x[M.type];M.precision!==null&&(p=s.getMaxPrecision(M.precision),p!==M.precision&&console.warn("THREE.WebGLProgram.getParameters:",M.precision,"not supported, using",p,"instead."));let At=F.morphAttributes.position||F.morphAttributes.normal||F.morphAttributes.color,vt=At!==void 0?At.length:0,Gt=0;F.morphAttributes.position!==void 0&&(Gt=1),F.morphAttributes.normal!==void 0&&(Gt=2),F.morphAttributes.color!==void 0&&(Gt=3);let Jt,ne,Kt,Q;if(lt){let ee=In[lt];Jt=ee.vertexShader,ne=ee.fragmentShader}else Jt=M.vertexShader,ne=M.fragmentShader,l.update(M),Kt=l.getVertexShaderID(M),Q=l.getFragmentShaderID(M);let et=i.getRenderTarget(),yt=i.state.buffers.depth.getReversed(),It=L.isInstancedMesh===!0,Et=L.isBatchedMesh===!0,qt=!!M.map,le=!!M.matcap,U=!!q,tt=!!M.aoMap,K=!!M.lightMap,J=!!M.bumpMap,Z=!!M.normalMap,ht=!!M.displacementMap,nt=!!M.emissiveMap,ut=!!M.metalnessMap,Ht=!!M.roughnessMap,Ot=M.anisotropy>0,C=M.clearcoat>0,E=M.dispersion>0,k=M.iridescence>0,X=M.sheen>0,$=M.transmission>0,Y=Ot&&!!M.anisotropyMap,Rt=C&&!!M.clearcoatMap,ct=C&&!!M.clearcoatNormalMap,St=C&&!!M.clearcoatRoughnessMap,wt=k&&!!M.iridescenceMap,it=k&&!!M.iridescenceThicknessMap,gt=X&&!!M.sheenColorMap,Bt=X&&!!M.sheenRoughnessMap,Ct=!!M.specularMap,pt=!!M.specularColorMap,Wt=!!M.specularIntensityMap,B=$&&!!M.transmissionMap,at=$&&!!M.thicknessMap,dt=!!M.gradientMap,Mt=!!M.alphaMap,st=M.alphaTest>0,j=!!M.alphaHash,Tt=!!M.extensions,kt=Wn;M.toneMapped&&(et===null||et.isXRRenderTarget===!0)&&(kt=i.toneMapping);let he={shaderID:lt,shaderType:M.type,shaderName:M.name,vertexShader:Jt,fragmentShader:ne,defines:M.defines,customVertexShaderID:Kt,customFragmentShaderID:Q,isRawShaderMaterial:M.isRawShaderMaterial===!0,glslVersion:M.glslVersion,precision:p,batching:Et,batchingColor:Et&&L._colorsTexture!==null,instancing:It,instancingColor:It&&L.instanceColor!==null,instancingMorph:It&&L.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:et===null?i.outputColorSpace:et.isXRRenderTarget===!0?et.texture.colorSpace:yi,alphaToCoverage:!!M.alphaToCoverage,map:qt,matcap:le,envMap:U,envMapMode:U&&q.mapping,envMapCubeUVHeight:G,aoMap:tt,lightMap:K,bumpMap:J,normalMap:Z,displacementMap:d&&ht,emissiveMap:nt,normalMapObjectSpace:Z&&M.normalMapType===Xh,normalMapTangentSpace:Z&&M.normalMapType===Vc,metalnessMap:ut,roughnessMap:Ht,anisotropy:Ot,anisotropyMap:Y,clearcoat:C,clearcoatMap:Rt,clearcoatNormalMap:ct,clearcoatRoughnessMap:St,dispersion:E,iridescence:k,iridescenceMap:wt,iridescenceThicknessMap:it,sheen:X,sheenColorMap:gt,sheenRoughnessMap:Bt,specularMap:Ct,specularColorMap:pt,specularIntensityMap:Wt,transmission:$,transmissionMap:B,thicknessMap:at,gradientMap:dt,opaque:M.transparent===!1&&M.blending===Ai&&M.alphaToCoverage===!1,alphaMap:Mt,alphaTest:st,alphaHash:j,combine:M.combine,mapUv:qt&&g(M.map.channel),aoMapUv:tt&&g(M.aoMap.channel),lightMapUv:K&&g(M.lightMap.channel),bumpMapUv:J&&g(M.bumpMap.channel),normalMapUv:Z&&g(M.normalMap.channel),displacementMapUv:ht&&g(M.displacementMap.channel),emissiveMapUv:nt&&g(M.emissiveMap.channel),metalnessMapUv:ut&&g(M.metalnessMap.channel),roughnessMapUv:Ht&&g(M.roughnessMap.channel),anisotropyMapUv:Y&&g(M.anisotropyMap.channel),clearcoatMapUv:Rt&&g(M.clearcoatMap.channel),clearcoatNormalMapUv:ct&&g(M.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:St&&g(M.clearcoatRoughnessMap.channel),iridescenceMapUv:wt&&g(M.iridescenceMap.channel),iridescenceThicknessMapUv:it&&g(M.iridescenceThicknessMap.channel),sheenColorMapUv:gt&&g(M.sheenColorMap.channel),sheenRoughnessMapUv:Bt&&g(M.sheenRoughnessMap.channel),specularMapUv:Ct&&g(M.specularMap.channel),specularColorMapUv:pt&&g(M.specularColorMap.channel),specularIntensityMapUv:Wt&&g(M.specularIntensityMap.channel),transmissionMapUv:B&&g(M.transmissionMap.channel),thicknessMapUv:at&&g(M.thicknessMap.channel),alphaMapUv:Mt&&g(M.alphaMap.channel),vertexTangents:!!F.attributes.tangent&&(Z||Ot),vertexColors:M.vertexColors,vertexAlphas:M.vertexColors===!0&&!!F.attributes.color&&F.attributes.color.itemSize===4,pointsUvs:L.isPoints===!0&&!!F.attributes.uv&&(qt||Mt),fog:!!z,useFog:M.fog===!0,fogExp2:!!z&&z.isFogExp2,flatShading:M.flatShading===!0&&M.wireframe===!1,sizeAttenuation:M.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:yt,skinning:L.isSkinnedMesh===!0,morphTargets:F.morphAttributes.position!==void 0,morphNormals:F.morphAttributes.normal!==void 0,morphColors:F.morphAttributes.color!==void 0,morphTargetsCount:vt,morphTextureStride:Gt,numDirLights:_.directional.length,numPointLights:_.point.length,numSpotLights:_.spot.length,numSpotLightMaps:_.spotLightMap.length,numRectAreaLights:_.rectArea.length,numHemiLights:_.hemi.length,numDirLightShadows:_.directionalShadowMap.length,numPointLightShadows:_.pointShadowMap.length,numSpotLightShadows:_.spotShadowMap.length,numSpotLightShadowsWithMaps:_.numSpotLightShadowsWithMaps,numLightProbes:_.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:M.dithering,shadowMapEnabled:i.shadowMap.enabled&&S.length>0,shadowMapType:i.shadowMap.type,toneMapping:kt,decodeVideoTexture:qt&&M.map.isVideoTexture===!0&&jt.getTransfer(M.map.colorSpace)===re,decodeVideoTextureEmissive:nt&&M.emissiveMap.isVideoTexture===!0&&jt.getTransfer(M.emissiveMap.colorSpace)===re,premultipliedAlpha:M.premultipliedAlpha,doubleSided:M.side===we,flipSided:M.side===He,useDepthPacking:M.depthPacking>=0,depthPacking:M.depthPacking||0,index0AttributeName:M.index0AttributeName,extensionClipCullDistance:Tt&&M.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Tt&&M.extensions.multiDraw===!0||Et)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:M.customProgramCacheKey()};return he.vertexUv1s=c.has(1),he.vertexUv2s=c.has(2),he.vertexUv3s=c.has(3),c.clear(),he}function f(M){let _=[];if(M.shaderID?_.push(M.shaderID):(_.push(M.customVertexShaderID),_.push(M.customFragmentShaderID)),M.defines!==void 0)for(let S in M.defines)_.push(S),_.push(M.defines[S]);return M.isRawShaderMaterial===!1&&(A(_,M),v(_,M),_.push(i.outputColorSpace)),_.push(M.customProgramCacheKey),_.join()}function A(M,_){M.push(_.precision),M.push(_.outputColorSpace),M.push(_.envMapMode),M.push(_.envMapCubeUVHeight),M.push(_.mapUv),M.push(_.alphaMapUv),M.push(_.lightMapUv),M.push(_.aoMapUv),M.push(_.bumpMapUv),M.push(_.normalMapUv),M.push(_.displacementMapUv),M.push(_.emissiveMapUv),M.push(_.metalnessMapUv),M.push(_.roughnessMapUv),M.push(_.anisotropyMapUv),M.push(_.clearcoatMapUv),M.push(_.clearcoatNormalMapUv),M.push(_.clearcoatRoughnessMapUv),M.push(_.iridescenceMapUv),M.push(_.iridescenceThicknessMapUv),M.push(_.sheenColorMapUv),M.push(_.sheenRoughnessMapUv),M.push(_.specularMapUv),M.push(_.specularColorMapUv),M.push(_.specularIntensityMapUv),M.push(_.transmissionMapUv),M.push(_.thicknessMapUv),M.push(_.combine),M.push(_.fogExp2),M.push(_.sizeAttenuation),M.push(_.morphTargetsCount),M.push(_.morphAttributeCount),M.push(_.numDirLights),M.push(_.numPointLights),M.push(_.numSpotLights),M.push(_.numSpotLightMaps),M.push(_.numHemiLights),M.push(_.numRectAreaLights),M.push(_.numDirLightShadows),M.push(_.numPointLightShadows),M.push(_.numSpotLightShadows),M.push(_.numSpotLightShadowsWithMaps),M.push(_.numLightProbes),M.push(_.shadowMapType),M.push(_.toneMapping),M.push(_.numClippingPlanes),M.push(_.numClipIntersection),M.push(_.depthPacking)}function v(M,_){a.disableAll(),_.supportsVertexTextures&&a.enable(0),_.instancing&&a.enable(1),_.instancingColor&&a.enable(2),_.instancingMorph&&a.enable(3),_.matcap&&a.enable(4),_.envMap&&a.enable(5),_.normalMapObjectSpace&&a.enable(6),_.normalMapTangentSpace&&a.enable(7),_.clearcoat&&a.enable(8),_.iridescence&&a.enable(9),_.alphaTest&&a.enable(10),_.vertexColors&&a.enable(11),_.vertexAlphas&&a.enable(12),_.vertexUv1s&&a.enable(13),_.vertexUv2s&&a.enable(14),_.vertexUv3s&&a.enable(15),_.vertexTangents&&a.enable(16),_.anisotropy&&a.enable(17),_.alphaHash&&a.enable(18),_.batching&&a.enable(19),_.dispersion&&a.enable(20),_.batchingColor&&a.enable(21),_.gradientMap&&a.enable(22),M.push(a.mask),a.disableAll(),_.fog&&a.enable(0),_.useFog&&a.enable(1),_.flatShading&&a.enable(2),_.logarithmicDepthBuffer&&a.enable(3),_.reversedDepthBuffer&&a.enable(4),_.skinning&&a.enable(5),_.morphTargets&&a.enable(6),_.morphNormals&&a.enable(7),_.morphColors&&a.enable(8),_.premultipliedAlpha&&a.enable(9),_.shadowMapEnabled&&a.enable(10),_.doubleSided&&a.enable(11),_.flipSided&&a.enable(12),_.useDepthPacking&&a.enable(13),_.dithering&&a.enable(14),_.transmission&&a.enable(15),_.sheen&&a.enable(16),_.opaque&&a.enable(17),_.pointsUvs&&a.enable(18),_.decodeVideoTexture&&a.enable(19),_.decodeVideoTextureEmissive&&a.enable(20),_.alphaToCoverage&&a.enable(21),M.push(a.mask)}function y(M){let _=x[M.type],S;if(_){let D=In[_];S=nu.clone(D.uniforms)}else S=M.uniforms;return S}function R(M,_){let S;for(let D=0,L=h.length;D<L;D++){let z=h[D];if(z.cacheKey===_){S=z,++S.usedTimes;break}}return S===void 0&&(S=new qg(i,_,M,r),h.push(S)),S}function b(M){if(--M.usedTimes===0){let _=h.indexOf(M);h[_]=h[h.length-1],h.pop(),M.destroy()}}function T(M){l.remove(M)}function P(){l.dispose()}return{getParameters:m,getProgramCacheKey:f,getUniforms:y,acquireProgram:R,releaseProgram:b,releaseShaderCache:T,programs:h,dispose:P}}function Jg(){let i=new WeakMap;function t(o){return i.has(o)}function e(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function s(o,a,l){i.get(o)[a]=l}function r(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:r}}function Kg(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function Ru(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function Cu(){let i=[],t=0,e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function o(u,d,p,x,g,m){let f=i[t];return f===void 0?(f={id:u.id,object:u,geometry:d,material:p,groupOrder:x,renderOrder:u.renderOrder,z:g,group:m},i[t]=f):(f.id=u.id,f.object=u,f.geometry=d,f.material=p,f.groupOrder=x,f.renderOrder=u.renderOrder,f.z=g,f.group=m),t++,f}function a(u,d,p,x,g,m){let f=o(u,d,p,x,g,m);p.transmission>0?n.push(f):p.transparent===!0?s.push(f):e.push(f)}function l(u,d,p,x,g,m){let f=o(u,d,p,x,g,m);p.transmission>0?n.unshift(f):p.transparent===!0?s.unshift(f):e.unshift(f)}function c(u,d){e.length>1&&e.sort(u||Kg),n.length>1&&n.sort(d||Ru),s.length>1&&s.sort(d||Ru)}function h(){for(let u=t,d=i.length;u<d;u++){let p=i[u];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:a,unshift:l,finish:h,sort:c}}function jg(){let i=new WeakMap;function t(n,s){let r=i.get(n),o;return r===void 0?(o=new Cu,i.set(n,[o])):s>=r.length?(o=new Cu,r.push(o)):o=r[s],o}function e(){i=new WeakMap}return{get:t,dispose:e}}function $g(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new I,color:new Nt};break;case"SpotLight":e={position:new I,direction:new I,color:new Nt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new I,color:new Nt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new I,skyColor:new Nt,groundColor:new Nt};break;case"RectAreaLight":e={color:new Nt,position:new I,halfWidth:new I,halfHeight:new I};break}return i[t.id]=e,e}}}function tx(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ot};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ot};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ot,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}var ex=0;function nx(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function ix(i){let t=new $g,e=tx(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new I);let s=new I,r=new te,o=new te;function a(c){let h=0,u=0,d=0;for(let M=0;M<9;M++)n.probe[M].set(0,0,0);let p=0,x=0,g=0,m=0,f=0,A=0,v=0,y=0,R=0,b=0,T=0;c.sort(nx);for(let M=0,_=c.length;M<_;M++){let S=c[M],D=S.color,L=S.intensity,z=S.distance,F=S.shadow&&S.shadow.map?S.shadow.map.texture:null;if(S.isAmbientLight)h+=D.r*L,u+=D.g*L,d+=D.b*L;else if(S.isLightProbe){for(let H=0;H<9;H++)n.probe[H].addScaledVector(S.sh.coefficients[H],L);T++}else if(S.isDirectionalLight){let H=t.get(S);if(H.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){let q=S.shadow,G=e.get(S);G.shadowIntensity=q.intensity,G.shadowBias=q.bias,G.shadowNormalBias=q.normalBias,G.shadowRadius=q.radius,G.shadowMapSize=q.mapSize,n.directionalShadow[p]=G,n.directionalShadowMap[p]=F,n.directionalShadowMatrix[p]=S.shadow.matrix,A++}n.directional[p]=H,p++}else if(S.isSpotLight){let H=t.get(S);H.position.setFromMatrixPosition(S.matrixWorld),H.color.copy(D).multiplyScalar(L),H.distance=z,H.coneCos=Math.cos(S.angle),H.penumbraCos=Math.cos(S.angle*(1-S.penumbra)),H.decay=S.decay,n.spot[g]=H;let q=S.shadow;if(S.map&&(n.spotLightMap[R]=S.map,R++,q.updateMatrices(S),S.castShadow&&b++),n.spotLightMatrix[g]=q.matrix,S.castShadow){let G=e.get(S);G.shadowIntensity=q.intensity,G.shadowBias=q.bias,G.shadowNormalBias=q.normalBias,G.shadowRadius=q.radius,G.shadowMapSize=q.mapSize,n.spotShadow[g]=G,n.spotShadowMap[g]=F,y++}g++}else if(S.isRectAreaLight){let H=t.get(S);H.color.copy(D).multiplyScalar(L),H.halfWidth.set(S.width*.5,0,0),H.halfHeight.set(0,S.height*.5,0),n.rectArea[m]=H,m++}else if(S.isPointLight){let H=t.get(S);if(H.color.copy(S.color).multiplyScalar(S.intensity),H.distance=S.distance,H.decay=S.decay,S.castShadow){let q=S.shadow,G=e.get(S);G.shadowIntensity=q.intensity,G.shadowBias=q.bias,G.shadowNormalBias=q.normalBias,G.shadowRadius=q.radius,G.shadowMapSize=q.mapSize,G.shadowCameraNear=q.camera.near,G.shadowCameraFar=q.camera.far,n.pointShadow[x]=G,n.pointShadowMap[x]=F,n.pointShadowMatrix[x]=S.shadow.matrix,v++}n.point[x]=H,x++}else if(S.isHemisphereLight){let H=t.get(S);H.skyColor.copy(S.color).multiplyScalar(L),H.groundColor.copy(S.groundColor).multiplyScalar(L),n.hemi[f]=H,f++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=ft.LTC_FLOAT_1,n.rectAreaLTC2=ft.LTC_FLOAT_2):(n.rectAreaLTC1=ft.LTC_HALF_1,n.rectAreaLTC2=ft.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=d;let P=n.hash;(P.directionalLength!==p||P.pointLength!==x||P.spotLength!==g||P.rectAreaLength!==m||P.hemiLength!==f||P.numDirectionalShadows!==A||P.numPointShadows!==v||P.numSpotShadows!==y||P.numSpotMaps!==R||P.numLightProbes!==T)&&(n.directional.length=p,n.spot.length=g,n.rectArea.length=m,n.point.length=x,n.hemi.length=f,n.directionalShadow.length=A,n.directionalShadowMap.length=A,n.pointShadow.length=v,n.pointShadowMap.length=v,n.spotShadow.length=y,n.spotShadowMap.length=y,n.directionalShadowMatrix.length=A,n.pointShadowMatrix.length=v,n.spotLightMatrix.length=y+R-b,n.spotLightMap.length=R,n.numSpotLightShadowsWithMaps=b,n.numLightProbes=T,P.directionalLength=p,P.pointLength=x,P.spotLength=g,P.rectAreaLength=m,P.hemiLength=f,P.numDirectionalShadows=A,P.numPointShadows=v,P.numSpotShadows=y,P.numSpotMaps=R,P.numLightProbes=T,n.version=ex++)}function l(c,h){let u=0,d=0,p=0,x=0,g=0,m=h.matrixWorldInverse;for(let f=0,A=c.length;f<A;f++){let v=c[f];if(v.isDirectionalLight){let y=n.directional[u];y.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(m),u++}else if(v.isSpotLight){let y=n.spot[p];y.position.setFromMatrixPosition(v.matrixWorld),y.position.applyMatrix4(m),y.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(m),p++}else if(v.isRectAreaLight){let y=n.rectArea[x];y.position.setFromMatrixPosition(v.matrixWorld),y.position.applyMatrix4(m),o.identity(),r.copy(v.matrixWorld),r.premultiply(m),o.extractRotation(r),y.halfWidth.set(v.width*.5,0,0),y.halfHeight.set(0,v.height*.5,0),y.halfWidth.applyMatrix4(o),y.halfHeight.applyMatrix4(o),x++}else if(v.isPointLight){let y=n.point[d];y.position.setFromMatrixPosition(v.matrixWorld),y.position.applyMatrix4(m),d++}else if(v.isHemisphereLight){let y=n.hemi[g];y.direction.setFromMatrixPosition(v.matrixWorld),y.direction.transformDirection(m),g++}}}return{setup:a,setupView:l,state:n}}function Iu(i){let t=new ix(i),e=[],n=[];function s(h){c.camera=h,e.length=0,n.length=0}function r(h){e.push(h)}function o(h){n.push(h)}function a(){t.setup(e)}function l(h){t.setupView(e,h)}let c={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:a,setupLightsView:l,pushLight:r,pushShadow:o}}function sx(i){let t=new WeakMap;function e(s,r=0){let o=t.get(s),a;return o===void 0?(a=new Iu(i),t.set(s,[a])):r>=o.length?(a=new Iu(i),o.push(a)):a=o[r],a}function n(){t=new WeakMap}return{get:e,dispose:n}}var rx=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,ox=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function ax(i,t,e){let n=new os,s=new ot,r=new ot,o=new se,a=new Mo({depthPacking:Wh}),l=new bo,c={},h=e.maxTextureSize,u={[fn]:He,[He]:fn,[we]:we},d=new gn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ot},radius:{value:4}},vertexShader:rx,fragmentShader:ox}),p=d.clone();p.defines.HORIZONTAL_PASS=1;let x=new ue;x.setAttribute("position",new ve(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let g=new xt(x,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Pc;let f=this.type;this.render=function(b,T,P){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||b.length===0)return;let M=i.getRenderTarget(),_=i.getActiveCubeFace(),S=i.getActiveMipmapLevel(),D=i.state;D.setBlending(Vn),D.buffers.depth.getReversed()===!0?D.buffers.color.setClear(0,0,0,0):D.buffers.color.setClear(1,1,1,1),D.buffers.depth.setTest(!0),D.setScissorTest(!1);let L=f!==Cn&&this.type===Cn,z=f===Cn&&this.type!==Cn;for(let F=0,H=b.length;F<H;F++){let q=b[F],G=q.shadow;if(G===void 0){console.warn("THREE.WebGLShadowMap:",q,"has no shadow.");continue}if(G.autoUpdate===!1&&G.needsUpdate===!1)continue;s.copy(G.mapSize);let lt=G.getFrameExtents();if(s.multiply(lt),r.copy(G.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/lt.x),s.x=r.x*lt.x,G.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/lt.y),s.y=r.y*lt.y,G.mapSize.y=r.y)),G.map===null||L===!0||z===!0){let vt=this.type!==Cn?{minFilter:Ge,magFilter:Ge}:{};G.map!==null&&G.map.dispose(),G.map=new Sn(s.x,s.y,vt),G.map.texture.name=q.name+".shadowMap",G.camera.updateProjectionMatrix()}i.setRenderTarget(G.map),i.clear();let At=G.getViewportCount();for(let vt=0;vt<At;vt++){let Gt=G.getViewport(vt);o.set(r.x*Gt.x,r.y*Gt.y,r.x*Gt.z,r.y*Gt.w),D.viewport(o),G.updateMatrices(q,vt),n=G.getFrustum(),y(T,P,G.camera,q,this.type)}G.isPointLightShadow!==!0&&this.type===Cn&&A(G,P),G.needsUpdate=!1}f=this.type,m.needsUpdate=!1,i.setRenderTarget(M,_,S)};function A(b,T){let P=t.update(g);d.defines.VSM_SAMPLES!==b.blurSamples&&(d.defines.VSM_SAMPLES=b.blurSamples,p.defines.VSM_SAMPLES=b.blurSamples,d.needsUpdate=!0,p.needsUpdate=!0),b.mapPass===null&&(b.mapPass=new Sn(s.x,s.y)),d.uniforms.shadow_pass.value=b.map.texture,d.uniforms.resolution.value=b.mapSize,d.uniforms.radius.value=b.radius,i.setRenderTarget(b.mapPass),i.clear(),i.renderBufferDirect(T,null,P,d,g,null),p.uniforms.shadow_pass.value=b.mapPass.texture,p.uniforms.resolution.value=b.mapSize,p.uniforms.radius.value=b.radius,i.setRenderTarget(b.map),i.clear(),i.renderBufferDirect(T,null,P,p,g,null)}function v(b,T,P,M){let _=null,S=P.isPointLight===!0?b.customDistanceMaterial:b.customDepthMaterial;if(S!==void 0)_=S;else if(_=P.isPointLight===!0?l:a,i.localClippingEnabled&&T.clipShadows===!0&&Array.isArray(T.clippingPlanes)&&T.clippingPlanes.length!==0||T.displacementMap&&T.displacementScale!==0||T.alphaMap&&T.alphaTest>0||T.map&&T.alphaTest>0||T.alphaToCoverage===!0){let D=_.uuid,L=T.uuid,z=c[D];z===void 0&&(z={},c[D]=z);let F=z[L];F===void 0&&(F=_.clone(),z[L]=F,T.addEventListener("dispose",R)),_=F}if(_.visible=T.visible,_.wireframe=T.wireframe,M===Cn?_.side=T.shadowSide!==null?T.shadowSide:T.side:_.side=T.shadowSide!==null?T.shadowSide:u[T.side],_.alphaMap=T.alphaMap,_.alphaTest=T.alphaToCoverage===!0?.5:T.alphaTest,_.map=T.map,_.clipShadows=T.clipShadows,_.clippingPlanes=T.clippingPlanes,_.clipIntersection=T.clipIntersection,_.displacementMap=T.displacementMap,_.displacementScale=T.displacementScale,_.displacementBias=T.displacementBias,_.wireframeLinewidth=T.wireframeLinewidth,_.linewidth=T.linewidth,P.isPointLight===!0&&_.isMeshDistanceMaterial===!0){let D=i.properties.get(_);D.light=P}return _}function y(b,T,P,M,_){if(b.visible===!1)return;if(b.layers.test(T.layers)&&(b.isMesh||b.isLine||b.isPoints)&&(b.castShadow||b.receiveShadow&&_===Cn)&&(!b.frustumCulled||n.intersectsObject(b))){b.modelViewMatrix.multiplyMatrices(P.matrixWorldInverse,b.matrixWorld);let L=t.update(b),z=b.material;if(Array.isArray(z)){let F=L.groups;for(let H=0,q=F.length;H<q;H++){let G=F[H],lt=z[G.materialIndex];if(lt&&lt.visible){let At=v(b,lt,M,_);b.onBeforeShadow(i,b,T,P,L,At,G),i.renderBufferDirect(P,null,L,At,b,G),b.onAfterShadow(i,b,T,P,L,At,G)}}}else if(z.visible){let F=v(b,z,M,_);b.onBeforeShadow(i,b,T,P,L,F,null),i.renderBufferDirect(P,null,L,F,b,null),b.onAfterShadow(i,b,T,P,L,F,null)}}let D=b.children;for(let L=0,z=D.length;L<z;L++)y(D[L],T,P,M,_)}function R(b){b.target.removeEventListener("dispose",R);for(let P in c){let M=c[P],_=b.target.uuid;_ in M&&(M[_].dispose(),delete M[_])}}}var cx={[Fo]:No,[Oo]:ko,[zo]:Go,[_i]:Ho,[No]:Fo,[ko]:Oo,[Go]:zo,[Ho]:_i};function lx(i,t){function e(){let B=!1,at=new se,dt=null,Mt=new se(0,0,0,0);return{setMask:function(st){dt!==st&&!B&&(i.colorMask(st,st,st,st),dt=st)},setLocked:function(st){B=st},setClear:function(st,j,Tt,kt,he){he===!0&&(st*=kt,j*=kt,Tt*=kt),at.set(st,j,Tt,kt),Mt.equals(at)===!1&&(i.clearColor(st,j,Tt,kt),Mt.copy(at))},reset:function(){B=!1,dt=null,Mt.set(-1,0,0,0)}}}function n(){let B=!1,at=!1,dt=null,Mt=null,st=null;return{setReversed:function(j){if(at!==j){let Tt=t.get("EXT_clip_control");j?Tt.clipControlEXT(Tt.LOWER_LEFT_EXT,Tt.ZERO_TO_ONE_EXT):Tt.clipControlEXT(Tt.LOWER_LEFT_EXT,Tt.NEGATIVE_ONE_TO_ONE_EXT),at=j;let kt=st;st=null,this.setClear(kt)}},getReversed:function(){return at},setTest:function(j){j?et(i.DEPTH_TEST):yt(i.DEPTH_TEST)},setMask:function(j){dt!==j&&!B&&(i.depthMask(j),dt=j)},setFunc:function(j){if(at&&(j=cx[j]),Mt!==j){switch(j){case Fo:i.depthFunc(i.NEVER);break;case No:i.depthFunc(i.ALWAYS);break;case Oo:i.depthFunc(i.LESS);break;case _i:i.depthFunc(i.LEQUAL);break;case zo:i.depthFunc(i.EQUAL);break;case Ho:i.depthFunc(i.GEQUAL);break;case ko:i.depthFunc(i.GREATER);break;case Go:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}Mt=j}},setLocked:function(j){B=j},setClear:function(j){st!==j&&(at&&(j=1-j),i.clearDepth(j),st=j)},reset:function(){B=!1,dt=null,Mt=null,st=null,at=!1}}}function s(){let B=!1,at=null,dt=null,Mt=null,st=null,j=null,Tt=null,kt=null,he=null;return{setTest:function(ee){B||(ee?et(i.STENCIL_TEST):yt(i.STENCIL_TEST))},setMask:function(ee){at!==ee&&!B&&(i.stencilMask(ee),at=ee)},setFunc:function(ee,Dn,bn){(dt!==ee||Mt!==Dn||st!==bn)&&(i.stencilFunc(ee,Dn,bn),dt=ee,Mt=Dn,st=bn)},setOp:function(ee,Dn,bn){(j!==ee||Tt!==Dn||kt!==bn)&&(i.stencilOp(ee,Dn,bn),j=ee,Tt=Dn,kt=bn)},setLocked:function(ee){B=ee},setClear:function(ee){he!==ee&&(i.clearStencil(ee),he=ee)},reset:function(){B=!1,at=null,dt=null,Mt=null,st=null,j=null,Tt=null,kt=null,he=null}}}let r=new e,o=new n,a=new s,l=new WeakMap,c=new WeakMap,h={},u={},d=new WeakMap,p=[],x=null,g=!1,m=null,f=null,A=null,v=null,y=null,R=null,b=null,T=new Nt(0,0,0),P=0,M=!1,_=null,S=null,D=null,L=null,z=null,F=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),H=!1,q=0,G=i.getParameter(i.VERSION);G.indexOf("WebGL")!==-1?(q=parseFloat(/^WebGL (\d)/.exec(G)[1]),H=q>=1):G.indexOf("OpenGL ES")!==-1&&(q=parseFloat(/^OpenGL ES (\d)/.exec(G)[1]),H=q>=2);let lt=null,At={},vt=i.getParameter(i.SCISSOR_BOX),Gt=i.getParameter(i.VIEWPORT),Jt=new se().fromArray(vt),ne=new se().fromArray(Gt);function Kt(B,at,dt,Mt){let st=new Uint8Array(4),j=i.createTexture();i.bindTexture(B,j),i.texParameteri(B,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(B,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Tt=0;Tt<dt;Tt++)B===i.TEXTURE_3D||B===i.TEXTURE_2D_ARRAY?i.texImage3D(at,0,i.RGBA,1,1,Mt,0,i.RGBA,i.UNSIGNED_BYTE,st):i.texImage2D(at+Tt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,st);return j}let Q={};Q[i.TEXTURE_2D]=Kt(i.TEXTURE_2D,i.TEXTURE_2D,1),Q[i.TEXTURE_CUBE_MAP]=Kt(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),Q[i.TEXTURE_2D_ARRAY]=Kt(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Q[i.TEXTURE_3D]=Kt(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),et(i.DEPTH_TEST),o.setFunc(_i),J(!1),Z(Ic),et(i.CULL_FACE),tt(Vn);function et(B){h[B]!==!0&&(i.enable(B),h[B]=!0)}function yt(B){h[B]!==!1&&(i.disable(B),h[B]=!1)}function It(B,at){return u[B]!==at?(i.bindFramebuffer(B,at),u[B]=at,B===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=at),B===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=at),!0):!1}function Et(B,at){let dt=p,Mt=!1;if(B){dt=d.get(at),dt===void 0&&(dt=[],d.set(at,dt));let st=B.textures;if(dt.length!==st.length||dt[0]!==i.COLOR_ATTACHMENT0){for(let j=0,Tt=st.length;j<Tt;j++)dt[j]=i.COLOR_ATTACHMENT0+j;dt.length=st.length,Mt=!0}}else dt[0]!==i.BACK&&(dt[0]=i.BACK,Mt=!0);Mt&&i.drawBuffers(dt)}function qt(B){return x!==B?(i.useProgram(B),x=B,!0):!1}let le={[ti]:i.FUNC_ADD,[xh]:i.FUNC_SUBTRACT,[Ah]:i.FUNC_REVERSE_SUBTRACT};le[_h]=i.MIN,le[yh]=i.MAX;let U={[vh]:i.ZERO,[Mh]:i.ONE,[bh]:i.SRC_COLOR,[io]:i.SRC_ALPHA,[Ch]:i.SRC_ALPHA_SATURATE,[Th]:i.DST_COLOR,[Sh]:i.DST_ALPHA,[Eh]:i.ONE_MINUS_SRC_COLOR,[so]:i.ONE_MINUS_SRC_ALPHA,[Rh]:i.ONE_MINUS_DST_COLOR,[wh]:i.ONE_MINUS_DST_ALPHA,[Ih]:i.CONSTANT_COLOR,[Ph]:i.ONE_MINUS_CONSTANT_COLOR,[Dh]:i.CONSTANT_ALPHA,[Uh]:i.ONE_MINUS_CONSTANT_ALPHA};function tt(B,at,dt,Mt,st,j,Tt,kt,he,ee){if(B===Vn){g===!0&&(yt(i.BLEND),g=!1);return}if(g===!1&&(et(i.BLEND),g=!0),B!==gh){if(B!==m||ee!==M){if((f!==ti||y!==ti)&&(i.blendEquation(i.FUNC_ADD),f=ti,y=ti),ee)switch(B){case Ai:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case An:i.blendFunc(i.ONE,i.ONE);break;case Dc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Uc:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",B);break}else switch(B){case Ai:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case An:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case Dc:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Uc:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",B);break}A=null,v=null,R=null,b=null,T.set(0,0,0),P=0,m=B,M=ee}return}st=st||at,j=j||dt,Tt=Tt||Mt,(at!==f||st!==y)&&(i.blendEquationSeparate(le[at],le[st]),f=at,y=st),(dt!==A||Mt!==v||j!==R||Tt!==b)&&(i.blendFuncSeparate(U[dt],U[Mt],U[j],U[Tt]),A=dt,v=Mt,R=j,b=Tt),(kt.equals(T)===!1||he!==P)&&(i.blendColor(kt.r,kt.g,kt.b,he),T.copy(kt),P=he),m=B,M=!1}function K(B,at){B.side===we?yt(i.CULL_FACE):et(i.CULL_FACE);let dt=B.side===He;at&&(dt=!dt),J(dt),B.blending===Ai&&B.transparent===!1?tt(Vn):tt(B.blending,B.blendEquation,B.blendSrc,B.blendDst,B.blendEquationAlpha,B.blendSrcAlpha,B.blendDstAlpha,B.blendColor,B.blendAlpha,B.premultipliedAlpha),o.setFunc(B.depthFunc),o.setTest(B.depthTest),o.setMask(B.depthWrite),r.setMask(B.colorWrite);let Mt=B.stencilWrite;a.setTest(Mt),Mt&&(a.setMask(B.stencilWriteMask),a.setFunc(B.stencilFunc,B.stencilRef,B.stencilFuncMask),a.setOp(B.stencilFail,B.stencilZFail,B.stencilZPass)),nt(B.polygonOffset,B.polygonOffsetFactor,B.polygonOffsetUnits),B.alphaToCoverage===!0?et(i.SAMPLE_ALPHA_TO_COVERAGE):yt(i.SAMPLE_ALPHA_TO_COVERAGE)}function J(B){_!==B&&(B?i.frontFace(i.CW):i.frontFace(i.CCW),_=B)}function Z(B){B!==ph?(et(i.CULL_FACE),B!==S&&(B===Ic?i.cullFace(i.BACK):B===mh?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):yt(i.CULL_FACE),S=B}function ht(B){B!==D&&(H&&i.lineWidth(B),D=B)}function nt(B,at,dt){B?(et(i.POLYGON_OFFSET_FILL),(L!==at||z!==dt)&&(i.polygonOffset(at,dt),L=at,z=dt)):yt(i.POLYGON_OFFSET_FILL)}function ut(B){B?et(i.SCISSOR_TEST):yt(i.SCISSOR_TEST)}function Ht(B){B===void 0&&(B=i.TEXTURE0+F-1),lt!==B&&(i.activeTexture(B),lt=B)}function Ot(B,at,dt){dt===void 0&&(lt===null?dt=i.TEXTURE0+F-1:dt=lt);let Mt=At[dt];Mt===void 0&&(Mt={type:void 0,texture:void 0},At[dt]=Mt),(Mt.type!==B||Mt.texture!==at)&&(lt!==dt&&(i.activeTexture(dt),lt=dt),i.bindTexture(B,at||Q[B]),Mt.type=B,Mt.texture=at)}function C(){let B=At[lt];B!==void 0&&B.type!==void 0&&(i.bindTexture(B.type,null),B.type=void 0,B.texture=void 0)}function E(){try{i.compressedTexImage2D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function k(){try{i.compressedTexImage3D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function X(){try{i.texSubImage2D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function $(){try{i.texSubImage3D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Y(){try{i.compressedTexSubImage2D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Rt(){try{i.compressedTexSubImage3D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function ct(){try{i.texStorage2D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function St(){try{i.texStorage3D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function wt(){try{i.texImage2D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function it(){try{i.texImage3D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function gt(B){Jt.equals(B)===!1&&(i.scissor(B.x,B.y,B.z,B.w),Jt.copy(B))}function Bt(B){ne.equals(B)===!1&&(i.viewport(B.x,B.y,B.z,B.w),ne.copy(B))}function Ct(B,at){let dt=c.get(at);dt===void 0&&(dt=new WeakMap,c.set(at,dt));let Mt=dt.get(B);Mt===void 0&&(Mt=i.getUniformBlockIndex(at,B.name),dt.set(B,Mt))}function pt(B,at){let Mt=c.get(at).get(B);l.get(at)!==Mt&&(i.uniformBlockBinding(at,Mt,B.__bindingPointIndex),l.set(at,Mt))}function Wt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},lt=null,At={},u={},d=new WeakMap,p=[],x=null,g=!1,m=null,f=null,A=null,v=null,y=null,R=null,b=null,T=new Nt(0,0,0),P=0,M=!1,_=null,S=null,D=null,L=null,z=null,Jt.set(0,0,i.canvas.width,i.canvas.height),ne.set(0,0,i.canvas.width,i.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:et,disable:yt,bindFramebuffer:It,drawBuffers:Et,useProgram:qt,setBlending:tt,setMaterial:K,setFlipSided:J,setCullFace:Z,setLineWidth:ht,setPolygonOffset:nt,setScissorTest:ut,activeTexture:Ht,bindTexture:Ot,unbindTexture:C,compressedTexImage2D:E,compressedTexImage3D:k,texImage2D:wt,texImage3D:it,updateUBOMapping:Ct,uniformBlockBinding:pt,texStorage2D:ct,texStorage3D:St,texSubImage2D:X,texSubImage3D:$,compressedTexSubImage2D:Y,compressedTexSubImage3D:Rt,scissor:gt,viewport:Bt,reset:Wt}}function hx(i,t,e,n,s,r,o){let a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new ot,h=new WeakMap,u,d=new WeakMap,p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function x(C,E){return p?new OffscreenCanvas(C,E):Vs("canvas")}function g(C,E,k){let X=1,$=Ot(C);if(($.width>k||$.height>k)&&(X=k/Math.max($.width,$.height)),X<1)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap||typeof VideoFrame<"u"&&C instanceof VideoFrame){let Y=Math.floor(X*$.width),Rt=Math.floor(X*$.height);u===void 0&&(u=x(Y,Rt));let ct=E?x(Y,Rt):u;return ct.width=Y,ct.height=Rt,ct.getContext("2d").drawImage(C,0,0,Y,Rt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+$.width+"x"+$.height+") to ("+Y+"x"+Rt+")."),ct}else return"data"in C&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+$.width+"x"+$.height+")."),C;return C}function m(C){return C.generateMipmaps}function f(C){i.generateMipmap(C)}function A(C){return C.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:C.isWebGL3DRenderTarget?i.TEXTURE_3D:C.isWebGLArrayRenderTarget||C.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function v(C,E,k,X,$=!1){if(C!==null){if(i[C]!==void 0)return i[C];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let Y=E;if(E===i.RED&&(k===i.FLOAT&&(Y=i.R32F),k===i.HALF_FLOAT&&(Y=i.R16F),k===i.UNSIGNED_BYTE&&(Y=i.R8)),E===i.RED_INTEGER&&(k===i.UNSIGNED_BYTE&&(Y=i.R8UI),k===i.UNSIGNED_SHORT&&(Y=i.R16UI),k===i.UNSIGNED_INT&&(Y=i.R32UI),k===i.BYTE&&(Y=i.R8I),k===i.SHORT&&(Y=i.R16I),k===i.INT&&(Y=i.R32I)),E===i.RG&&(k===i.FLOAT&&(Y=i.RG32F),k===i.HALF_FLOAT&&(Y=i.RG16F),k===i.UNSIGNED_BYTE&&(Y=i.RG8)),E===i.RG_INTEGER&&(k===i.UNSIGNED_BYTE&&(Y=i.RG8UI),k===i.UNSIGNED_SHORT&&(Y=i.RG16UI),k===i.UNSIGNED_INT&&(Y=i.RG32UI),k===i.BYTE&&(Y=i.RG8I),k===i.SHORT&&(Y=i.RG16I),k===i.INT&&(Y=i.RG32I)),E===i.RGB_INTEGER&&(k===i.UNSIGNED_BYTE&&(Y=i.RGB8UI),k===i.UNSIGNED_SHORT&&(Y=i.RGB16UI),k===i.UNSIGNED_INT&&(Y=i.RGB32UI),k===i.BYTE&&(Y=i.RGB8I),k===i.SHORT&&(Y=i.RGB16I),k===i.INT&&(Y=i.RGB32I)),E===i.RGBA_INTEGER&&(k===i.UNSIGNED_BYTE&&(Y=i.RGBA8UI),k===i.UNSIGNED_SHORT&&(Y=i.RGBA16UI),k===i.UNSIGNED_INT&&(Y=i.RGBA32UI),k===i.BYTE&&(Y=i.RGBA8I),k===i.SHORT&&(Y=i.RGBA16I),k===i.INT&&(Y=i.RGBA32I)),E===i.RGB&&(k===i.UNSIGNED_INT_5_9_9_9_REV&&(Y=i.RGB9_E5),k===i.UNSIGNED_INT_10F_11F_11F_REV&&(Y=i.R11F_G11F_B10F)),E===i.RGBA){let Rt=$?ks:jt.getTransfer(X);k===i.FLOAT&&(Y=i.RGBA32F),k===i.HALF_FLOAT&&(Y=i.RGBA16F),k===i.UNSIGNED_BYTE&&(Y=Rt===re?i.SRGB8_ALPHA8:i.RGBA8),k===i.UNSIGNED_SHORT_4_4_4_4&&(Y=i.RGBA4),k===i.UNSIGNED_SHORT_5_5_5_1&&(Y=i.RGB5_A1)}return(Y===i.R16F||Y===i.R32F||Y===i.RG16F||Y===i.RG32F||Y===i.RGBA16F||Y===i.RGBA32F)&&t.get("EXT_color_buffer_float"),Y}function y(C,E){let k;return C?E===null||E===oi||E===gs?k=i.DEPTH24_STENCIL8:E===yn?k=i.DEPTH32F_STENCIL8:E===ps&&(k=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):E===null||E===oi||E===gs?k=i.DEPTH_COMPONENT24:E===yn?k=i.DEPTH_COMPONENT32F:E===ps&&(k=i.DEPTH_COMPONENT16),k}function R(C,E){return m(C)===!0||C.isFramebufferTexture&&C.minFilter!==Ge&&C.minFilter!==pn?Math.log2(Math.max(E.width,E.height))+1:C.mipmaps!==void 0&&C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?E.mipmaps.length:1}function b(C){let E=C.target;E.removeEventListener("dispose",b),P(E),E.isVideoTexture&&h.delete(E)}function T(C){let E=C.target;E.removeEventListener("dispose",T),_(E)}function P(C){let E=n.get(C);if(E.__webglInit===void 0)return;let k=C.source,X=d.get(k);if(X){let $=X[E.__cacheKey];$.usedTimes--,$.usedTimes===0&&M(C),Object.keys(X).length===0&&d.delete(k)}n.remove(C)}function M(C){let E=n.get(C);i.deleteTexture(E.__webglTexture);let k=C.source,X=d.get(k);delete X[E.__cacheKey],o.memory.textures--}function _(C){let E=n.get(C);if(C.depthTexture&&(C.depthTexture.dispose(),n.remove(C.depthTexture)),C.isWebGLCubeRenderTarget)for(let X=0;X<6;X++){if(Array.isArray(E.__webglFramebuffer[X]))for(let $=0;$<E.__webglFramebuffer[X].length;$++)i.deleteFramebuffer(E.__webglFramebuffer[X][$]);else i.deleteFramebuffer(E.__webglFramebuffer[X]);E.__webglDepthbuffer&&i.deleteRenderbuffer(E.__webglDepthbuffer[X])}else{if(Array.isArray(E.__webglFramebuffer))for(let X=0;X<E.__webglFramebuffer.length;X++)i.deleteFramebuffer(E.__webglFramebuffer[X]);else i.deleteFramebuffer(E.__webglFramebuffer);if(E.__webglDepthbuffer&&i.deleteRenderbuffer(E.__webglDepthbuffer),E.__webglMultisampledFramebuffer&&i.deleteFramebuffer(E.__webglMultisampledFramebuffer),E.__webglColorRenderbuffer)for(let X=0;X<E.__webglColorRenderbuffer.length;X++)E.__webglColorRenderbuffer[X]&&i.deleteRenderbuffer(E.__webglColorRenderbuffer[X]);E.__webglDepthRenderbuffer&&i.deleteRenderbuffer(E.__webglDepthRenderbuffer)}let k=C.textures;for(let X=0,$=k.length;X<$;X++){let Y=n.get(k[X]);Y.__webglTexture&&(i.deleteTexture(Y.__webglTexture),o.memory.textures--),n.remove(k[X])}n.remove(C)}let S=0;function D(){S=0}function L(){let C=S;return C>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+C+" texture units while this GPU supports only "+s.maxTextures),S+=1,C}function z(C){let E=[];return E.push(C.wrapS),E.push(C.wrapT),E.push(C.wrapR||0),E.push(C.magFilter),E.push(C.minFilter),E.push(C.anisotropy),E.push(C.internalFormat),E.push(C.format),E.push(C.type),E.push(C.generateMipmaps),E.push(C.premultiplyAlpha),E.push(C.flipY),E.push(C.unpackAlignment),E.push(C.colorSpace),E.join()}function F(C,E){let k=n.get(C);if(C.isVideoTexture&&ut(C),C.isRenderTargetTexture===!1&&C.isExternalTexture!==!0&&C.version>0&&k.__version!==C.version){let X=C.image;if(X===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(X.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Q(k,C,E);return}}else C.isExternalTexture&&(k.__webglTexture=C.sourceTexture?C.sourceTexture:null);e.bindTexture(i.TEXTURE_2D,k.__webglTexture,i.TEXTURE0+E)}function H(C,E){let k=n.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&k.__version!==C.version){Q(k,C,E);return}e.bindTexture(i.TEXTURE_2D_ARRAY,k.__webglTexture,i.TEXTURE0+E)}function q(C,E){let k=n.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&k.__version!==C.version){Q(k,C,E);return}e.bindTexture(i.TEXTURE_3D,k.__webglTexture,i.TEXTURE0+E)}function G(C,E){let k=n.get(C);if(C.version>0&&k.__version!==C.version){et(k,C,E);return}e.bindTexture(i.TEXTURE_CUBE_MAP,k.__webglTexture,i.TEXTURE0+E)}let lt={[zn]:i.REPEAT,[$n]:i.CLAMP_TO_EDGE,[ro]:i.MIRRORED_REPEAT},At={[Ge]:i.NEAREST,[Gh]:i.NEAREST_MIPMAP_NEAREST,[mr]:i.NEAREST_MIPMAP_LINEAR,[pn]:i.LINEAR,[Xo]:i.LINEAR_MIPMAP_NEAREST,[ri]:i.LINEAR_MIPMAP_LINEAR},vt={[Yh]:i.NEVER,[jh]:i.ALWAYS,[qh]:i.LESS,[Wc]:i.LEQUAL,[Qh]:i.EQUAL,[Kh]:i.GEQUAL,[Zh]:i.GREATER,[Jh]:i.NOTEQUAL};function Gt(C,E){if(E.type===yn&&t.has("OES_texture_float_linear")===!1&&(E.magFilter===pn||E.magFilter===Xo||E.magFilter===mr||E.magFilter===ri||E.minFilter===pn||E.minFilter===Xo||E.minFilter===mr||E.minFilter===ri)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(C,i.TEXTURE_WRAP_S,lt[E.wrapS]),i.texParameteri(C,i.TEXTURE_WRAP_T,lt[E.wrapT]),(C===i.TEXTURE_3D||C===i.TEXTURE_2D_ARRAY)&&i.texParameteri(C,i.TEXTURE_WRAP_R,lt[E.wrapR]),i.texParameteri(C,i.TEXTURE_MAG_FILTER,At[E.magFilter]),i.texParameteri(C,i.TEXTURE_MIN_FILTER,At[E.minFilter]),E.compareFunction&&(i.texParameteri(C,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(C,i.TEXTURE_COMPARE_FUNC,vt[E.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(E.magFilter===Ge||E.minFilter!==mr&&E.minFilter!==ri||E.type===yn&&t.has("OES_texture_float_linear")===!1)return;if(E.anisotropy>1||n.get(E).__currentAnisotropy){let k=t.get("EXT_texture_filter_anisotropic");i.texParameterf(C,k.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(E.anisotropy,s.getMaxAnisotropy())),n.get(E).__currentAnisotropy=E.anisotropy}}}function Jt(C,E){let k=!1;C.__webglInit===void 0&&(C.__webglInit=!0,E.addEventListener("dispose",b));let X=E.source,$=d.get(X);$===void 0&&($={},d.set(X,$));let Y=z(E);if(Y!==C.__cacheKey){$[Y]===void 0&&($[Y]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,k=!0),$[Y].usedTimes++;let Rt=$[C.__cacheKey];Rt!==void 0&&($[C.__cacheKey].usedTimes--,Rt.usedTimes===0&&M(E)),C.__cacheKey=Y,C.__webglTexture=$[Y].texture}return k}function ne(C,E,k){return Math.floor(Math.floor(C/k)/E)}function Kt(C,E,k,X){let Y=C.updateRanges;if(Y.length===0)e.texSubImage2D(i.TEXTURE_2D,0,0,0,E.width,E.height,k,X,E.data);else{Y.sort((it,gt)=>it.start-gt.start);let Rt=0;for(let it=1;it<Y.length;it++){let gt=Y[Rt],Bt=Y[it],Ct=gt.start+gt.count,pt=ne(Bt.start,E.width,4),Wt=ne(gt.start,E.width,4);Bt.start<=Ct+1&&pt===Wt&&ne(Bt.start+Bt.count-1,E.width,4)===pt?gt.count=Math.max(gt.count,Bt.start+Bt.count-gt.start):(++Rt,Y[Rt]=Bt)}Y.length=Rt+1;let ct=i.getParameter(i.UNPACK_ROW_LENGTH),St=i.getParameter(i.UNPACK_SKIP_PIXELS),wt=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,E.width);for(let it=0,gt=Y.length;it<gt;it++){let Bt=Y[it],Ct=Math.floor(Bt.start/4),pt=Math.ceil(Bt.count/4),Wt=Ct%E.width,B=Math.floor(Ct/E.width),at=pt,dt=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,Wt),i.pixelStorei(i.UNPACK_SKIP_ROWS,B),e.texSubImage2D(i.TEXTURE_2D,0,Wt,B,at,dt,k,X,E.data)}C.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,ct),i.pixelStorei(i.UNPACK_SKIP_PIXELS,St),i.pixelStorei(i.UNPACK_SKIP_ROWS,wt)}}function Q(C,E,k){let X=i.TEXTURE_2D;(E.isDataArrayTexture||E.isCompressedArrayTexture)&&(X=i.TEXTURE_2D_ARRAY),E.isData3DTexture&&(X=i.TEXTURE_3D);let $=Jt(C,E),Y=E.source;e.bindTexture(X,C.__webglTexture,i.TEXTURE0+k);let Rt=n.get(Y);if(Y.version!==Rt.__version||$===!0){e.activeTexture(i.TEXTURE0+k);let ct=jt.getPrimaries(jt.workingColorSpace),St=E.colorSpace===Xn?null:jt.getPrimaries(E.colorSpace),wt=E.colorSpace===Xn||ct===St?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,E.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,E.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,wt);let it=g(E.image,!1,s.maxTextureSize);it=Ht(E,it);let gt=r.convert(E.format,E.colorSpace),Bt=r.convert(E.type),Ct=v(E.internalFormat,gt,Bt,E.colorSpace,E.isVideoTexture);Gt(X,E);let pt,Wt=E.mipmaps,B=E.isVideoTexture!==!0,at=Rt.__version===void 0||$===!0,dt=Y.dataReady,Mt=R(E,it);if(E.isDepthTexture)Ct=y(E.format===xs,E.type),at&&(B?e.texStorage2D(i.TEXTURE_2D,1,Ct,it.width,it.height):e.texImage2D(i.TEXTURE_2D,0,Ct,it.width,it.height,0,gt,Bt,null));else if(E.isDataTexture)if(Wt.length>0){B&&at&&e.texStorage2D(i.TEXTURE_2D,Mt,Ct,Wt[0].width,Wt[0].height);for(let st=0,j=Wt.length;st<j;st++)pt=Wt[st],B?dt&&e.texSubImage2D(i.TEXTURE_2D,st,0,0,pt.width,pt.height,gt,Bt,pt.data):e.texImage2D(i.TEXTURE_2D,st,Ct,pt.width,pt.height,0,gt,Bt,pt.data);E.generateMipmaps=!1}else B?(at&&e.texStorage2D(i.TEXTURE_2D,Mt,Ct,it.width,it.height),dt&&Kt(E,it,gt,Bt)):e.texImage2D(i.TEXTURE_2D,0,Ct,it.width,it.height,0,gt,Bt,it.data);else if(E.isCompressedTexture)if(E.isCompressedArrayTexture){B&&at&&e.texStorage3D(i.TEXTURE_2D_ARRAY,Mt,Ct,Wt[0].width,Wt[0].height,it.depth);for(let st=0,j=Wt.length;st<j;st++)if(pt=Wt[st],E.format!==rn)if(gt!==null)if(B){if(dt)if(E.layerUpdates.size>0){let Tt=$c(pt.width,pt.height,E.format,E.type);for(let kt of E.layerUpdates){let he=pt.data.subarray(kt*Tt/pt.data.BYTES_PER_ELEMENT,(kt+1)*Tt/pt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,st,0,0,kt,pt.width,pt.height,1,gt,he)}E.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,st,0,0,0,pt.width,pt.height,it.depth,gt,pt.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,st,Ct,pt.width,pt.height,it.depth,0,pt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else B?dt&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,st,0,0,0,pt.width,pt.height,it.depth,gt,Bt,pt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,st,Ct,pt.width,pt.height,it.depth,0,gt,Bt,pt.data)}else{B&&at&&e.texStorage2D(i.TEXTURE_2D,Mt,Ct,Wt[0].width,Wt[0].height);for(let st=0,j=Wt.length;st<j;st++)pt=Wt[st],E.format!==rn?gt!==null?B?dt&&e.compressedTexSubImage2D(i.TEXTURE_2D,st,0,0,pt.width,pt.height,gt,pt.data):e.compressedTexImage2D(i.TEXTURE_2D,st,Ct,pt.width,pt.height,0,pt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):B?dt&&e.texSubImage2D(i.TEXTURE_2D,st,0,0,pt.width,pt.height,gt,Bt,pt.data):e.texImage2D(i.TEXTURE_2D,st,Ct,pt.width,pt.height,0,gt,Bt,pt.data)}else if(E.isDataArrayTexture)if(B){if(at&&e.texStorage3D(i.TEXTURE_2D_ARRAY,Mt,Ct,it.width,it.height,it.depth),dt)if(E.layerUpdates.size>0){let st=$c(it.width,it.height,E.format,E.type);for(let j of E.layerUpdates){let Tt=it.data.subarray(j*st/it.data.BYTES_PER_ELEMENT,(j+1)*st/it.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,j,it.width,it.height,1,gt,Bt,Tt)}E.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,it.width,it.height,it.depth,gt,Bt,it.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,Ct,it.width,it.height,it.depth,0,gt,Bt,it.data);else if(E.isData3DTexture)B?(at&&e.texStorage3D(i.TEXTURE_3D,Mt,Ct,it.width,it.height,it.depth),dt&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,it.width,it.height,it.depth,gt,Bt,it.data)):e.texImage3D(i.TEXTURE_3D,0,Ct,it.width,it.height,it.depth,0,gt,Bt,it.data);else if(E.isFramebufferTexture){if(at)if(B)e.texStorage2D(i.TEXTURE_2D,Mt,Ct,it.width,it.height);else{let st=it.width,j=it.height;for(let Tt=0;Tt<Mt;Tt++)e.texImage2D(i.TEXTURE_2D,Tt,Ct,st,j,0,gt,Bt,null),st>>=1,j>>=1}}else if(Wt.length>0){if(B&&at){let st=Ot(Wt[0]);e.texStorage2D(i.TEXTURE_2D,Mt,Ct,st.width,st.height)}for(let st=0,j=Wt.length;st<j;st++)pt=Wt[st],B?dt&&e.texSubImage2D(i.TEXTURE_2D,st,0,0,gt,Bt,pt):e.texImage2D(i.TEXTURE_2D,st,Ct,gt,Bt,pt);E.generateMipmaps=!1}else if(B){if(at){let st=Ot(it);e.texStorage2D(i.TEXTURE_2D,Mt,Ct,st.width,st.height)}dt&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,gt,Bt,it)}else e.texImage2D(i.TEXTURE_2D,0,Ct,gt,Bt,it);m(E)&&f(X),Rt.__version=Y.version,E.onUpdate&&E.onUpdate(E)}C.__version=E.version}function et(C,E,k){if(E.image.length!==6)return;let X=Jt(C,E),$=E.source;e.bindTexture(i.TEXTURE_CUBE_MAP,C.__webglTexture,i.TEXTURE0+k);let Y=n.get($);if($.version!==Y.__version||X===!0){e.activeTexture(i.TEXTURE0+k);let Rt=jt.getPrimaries(jt.workingColorSpace),ct=E.colorSpace===Xn?null:jt.getPrimaries(E.colorSpace),St=E.colorSpace===Xn||Rt===ct?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,E.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,E.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,St);let wt=E.isCompressedTexture||E.image[0].isCompressedTexture,it=E.image[0]&&E.image[0].isDataTexture,gt=[];for(let j=0;j<6;j++)!wt&&!it?gt[j]=g(E.image[j],!0,s.maxCubemapSize):gt[j]=it?E.image[j].image:E.image[j],gt[j]=Ht(E,gt[j]);let Bt=gt[0],Ct=r.convert(E.format,E.colorSpace),pt=r.convert(E.type),Wt=v(E.internalFormat,Ct,pt,E.colorSpace),B=E.isVideoTexture!==!0,at=Y.__version===void 0||X===!0,dt=$.dataReady,Mt=R(E,Bt);Gt(i.TEXTURE_CUBE_MAP,E);let st;if(wt){B&&at&&e.texStorage2D(i.TEXTURE_CUBE_MAP,Mt,Wt,Bt.width,Bt.height);for(let j=0;j<6;j++){st=gt[j].mipmaps;for(let Tt=0;Tt<st.length;Tt++){let kt=st[Tt];E.format!==rn?Ct!==null?B?dt&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Tt,0,0,kt.width,kt.height,Ct,kt.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Tt,Wt,kt.width,kt.height,0,kt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):B?dt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Tt,0,0,kt.width,kt.height,Ct,pt,kt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Tt,Wt,kt.width,kt.height,0,Ct,pt,kt.data)}}}else{if(st=E.mipmaps,B&&at){st.length>0&&Mt++;let j=Ot(gt[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,Mt,Wt,j.width,j.height)}for(let j=0;j<6;j++)if(it){B?dt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,0,0,gt[j].width,gt[j].height,Ct,pt,gt[j].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,Wt,gt[j].width,gt[j].height,0,Ct,pt,gt[j].data);for(let Tt=0;Tt<st.length;Tt++){let he=st[Tt].image[j].image;B?dt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Tt+1,0,0,he.width,he.height,Ct,pt,he.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Tt+1,Wt,he.width,he.height,0,Ct,pt,he.data)}}else{B?dt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,0,0,Ct,pt,gt[j]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,Wt,Ct,pt,gt[j]);for(let Tt=0;Tt<st.length;Tt++){let kt=st[Tt];B?dt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Tt+1,0,0,Ct,pt,kt.image[j]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Tt+1,Wt,Ct,pt,kt.image[j])}}}m(E)&&f(i.TEXTURE_CUBE_MAP),Y.__version=$.version,E.onUpdate&&E.onUpdate(E)}C.__version=E.version}function yt(C,E,k,X,$,Y){let Rt=r.convert(k.format,k.colorSpace),ct=r.convert(k.type),St=v(k.internalFormat,Rt,ct,k.colorSpace),wt=n.get(E),it=n.get(k);if(it.__renderTarget=E,!wt.__hasExternalTextures){let gt=Math.max(1,E.width>>Y),Bt=Math.max(1,E.height>>Y);$===i.TEXTURE_3D||$===i.TEXTURE_2D_ARRAY?e.texImage3D($,Y,St,gt,Bt,E.depth,0,Rt,ct,null):e.texImage2D($,Y,St,gt,Bt,0,Rt,ct,null)}e.bindFramebuffer(i.FRAMEBUFFER,C),nt(E)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,X,$,it.__webglTexture,0,ht(E)):($===i.TEXTURE_2D||$>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&$<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,X,$,it.__webglTexture,Y),e.bindFramebuffer(i.FRAMEBUFFER,null)}function It(C,E,k){if(i.bindRenderbuffer(i.RENDERBUFFER,C),E.depthBuffer){let X=E.depthTexture,$=X&&X.isDepthTexture?X.type:null,Y=y(E.stencilBuffer,$),Rt=E.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ct=ht(E);nt(E)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ct,Y,E.width,E.height):k?i.renderbufferStorageMultisample(i.RENDERBUFFER,ct,Y,E.width,E.height):i.renderbufferStorage(i.RENDERBUFFER,Y,E.width,E.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Rt,i.RENDERBUFFER,C)}else{let X=E.textures;for(let $=0;$<X.length;$++){let Y=X[$],Rt=r.convert(Y.format,Y.colorSpace),ct=r.convert(Y.type),St=v(Y.internalFormat,Rt,ct,Y.colorSpace),wt=ht(E);k&&nt(E)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,wt,St,E.width,E.height):nt(E)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,wt,St,E.width,E.height):i.renderbufferStorage(i.RENDERBUFFER,St,E.width,E.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Et(C,E){if(E&&E.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,C),!(E.depthTexture&&E.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let X=n.get(E.depthTexture);X.__renderTarget=E,(!X.__webglTexture||E.depthTexture.image.width!==E.width||E.depthTexture.image.height!==E.height)&&(E.depthTexture.image.width=E.width,E.depthTexture.image.height=E.height,E.depthTexture.needsUpdate=!0),F(E.depthTexture,0);let $=X.__webglTexture,Y=ht(E);if(E.depthTexture.format===Ki)nt(E)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,$,0,Y):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,$,0);else if(E.depthTexture.format===xs)nt(E)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,$,0,Y):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,$,0);else throw new Error("Unknown depthTexture format")}function qt(C){let E=n.get(C),k=C.isWebGLCubeRenderTarget===!0;if(E.__boundDepthTexture!==C.depthTexture){let X=C.depthTexture;if(E.__depthDisposeCallback&&E.__depthDisposeCallback(),X){let $=()=>{delete E.__boundDepthTexture,delete E.__depthDisposeCallback,X.removeEventListener("dispose",$)};X.addEventListener("dispose",$),E.__depthDisposeCallback=$}E.__boundDepthTexture=X}if(C.depthTexture&&!E.__autoAllocateDepthBuffer){if(k)throw new Error("target.depthTexture not supported in Cube render targets");let X=C.texture.mipmaps;X&&X.length>0?Et(E.__webglFramebuffer[0],C):Et(E.__webglFramebuffer,C)}else if(k){E.__webglDepthbuffer=[];for(let X=0;X<6;X++)if(e.bindFramebuffer(i.FRAMEBUFFER,E.__webglFramebuffer[X]),E.__webglDepthbuffer[X]===void 0)E.__webglDepthbuffer[X]=i.createRenderbuffer(),It(E.__webglDepthbuffer[X],C,!1);else{let $=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Y=E.__webglDepthbuffer[X];i.bindRenderbuffer(i.RENDERBUFFER,Y),i.framebufferRenderbuffer(i.FRAMEBUFFER,$,i.RENDERBUFFER,Y)}}else{let X=C.texture.mipmaps;if(X&&X.length>0?e.bindFramebuffer(i.FRAMEBUFFER,E.__webglFramebuffer[0]):e.bindFramebuffer(i.FRAMEBUFFER,E.__webglFramebuffer),E.__webglDepthbuffer===void 0)E.__webglDepthbuffer=i.createRenderbuffer(),It(E.__webglDepthbuffer,C,!1);else{let $=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Y=E.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,Y),i.framebufferRenderbuffer(i.FRAMEBUFFER,$,i.RENDERBUFFER,Y)}}e.bindFramebuffer(i.FRAMEBUFFER,null)}function le(C,E,k){let X=n.get(C);E!==void 0&&yt(X.__webglFramebuffer,C,C.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),k!==void 0&&qt(C)}function U(C){let E=C.texture,k=n.get(C),X=n.get(E);C.addEventListener("dispose",T);let $=C.textures,Y=C.isWebGLCubeRenderTarget===!0,Rt=$.length>1;if(Rt||(X.__webglTexture===void 0&&(X.__webglTexture=i.createTexture()),X.__version=E.version,o.memory.textures++),Y){k.__webglFramebuffer=[];for(let ct=0;ct<6;ct++)if(E.mipmaps&&E.mipmaps.length>0){k.__webglFramebuffer[ct]=[];for(let St=0;St<E.mipmaps.length;St++)k.__webglFramebuffer[ct][St]=i.createFramebuffer()}else k.__webglFramebuffer[ct]=i.createFramebuffer()}else{if(E.mipmaps&&E.mipmaps.length>0){k.__webglFramebuffer=[];for(let ct=0;ct<E.mipmaps.length;ct++)k.__webglFramebuffer[ct]=i.createFramebuffer()}else k.__webglFramebuffer=i.createFramebuffer();if(Rt)for(let ct=0,St=$.length;ct<St;ct++){let wt=n.get($[ct]);wt.__webglTexture===void 0&&(wt.__webglTexture=i.createTexture(),o.memory.textures++)}if(C.samples>0&&nt(C)===!1){k.__webglMultisampledFramebuffer=i.createFramebuffer(),k.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,k.__webglMultisampledFramebuffer);for(let ct=0;ct<$.length;ct++){let St=$[ct];k.__webglColorRenderbuffer[ct]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,k.__webglColorRenderbuffer[ct]);let wt=r.convert(St.format,St.colorSpace),it=r.convert(St.type),gt=v(St.internalFormat,wt,it,St.colorSpace,C.isXRRenderTarget===!0),Bt=ht(C);i.renderbufferStorageMultisample(i.RENDERBUFFER,Bt,gt,C.width,C.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ct,i.RENDERBUFFER,k.__webglColorRenderbuffer[ct])}i.bindRenderbuffer(i.RENDERBUFFER,null),C.depthBuffer&&(k.__webglDepthRenderbuffer=i.createRenderbuffer(),It(k.__webglDepthRenderbuffer,C,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(Y){e.bindTexture(i.TEXTURE_CUBE_MAP,X.__webglTexture),Gt(i.TEXTURE_CUBE_MAP,E);for(let ct=0;ct<6;ct++)if(E.mipmaps&&E.mipmaps.length>0)for(let St=0;St<E.mipmaps.length;St++)yt(k.__webglFramebuffer[ct][St],C,E,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ct,St);else yt(k.__webglFramebuffer[ct],C,E,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ct,0);m(E)&&f(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(Rt){for(let ct=0,St=$.length;ct<St;ct++){let wt=$[ct],it=n.get(wt),gt=i.TEXTURE_2D;(C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(gt=C.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(gt,it.__webglTexture),Gt(gt,wt),yt(k.__webglFramebuffer,C,wt,i.COLOR_ATTACHMENT0+ct,gt,0),m(wt)&&f(gt)}e.unbindTexture()}else{let ct=i.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(ct=C.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(ct,X.__webglTexture),Gt(ct,E),E.mipmaps&&E.mipmaps.length>0)for(let St=0;St<E.mipmaps.length;St++)yt(k.__webglFramebuffer[St],C,E,i.COLOR_ATTACHMENT0,ct,St);else yt(k.__webglFramebuffer,C,E,i.COLOR_ATTACHMENT0,ct,0);m(E)&&f(ct),e.unbindTexture()}C.depthBuffer&&qt(C)}function tt(C){let E=C.textures;for(let k=0,X=E.length;k<X;k++){let $=E[k];if(m($)){let Y=A(C),Rt=n.get($).__webglTexture;e.bindTexture(Y,Rt),f(Y),e.unbindTexture()}}}let K=[],J=[];function Z(C){if(C.samples>0){if(nt(C)===!1){let E=C.textures,k=C.width,X=C.height,$=i.COLOR_BUFFER_BIT,Y=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Rt=n.get(C),ct=E.length>1;if(ct)for(let wt=0;wt<E.length;wt++)e.bindFramebuffer(i.FRAMEBUFFER,Rt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+wt,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,Rt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+wt,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,Rt.__webglMultisampledFramebuffer);let St=C.texture.mipmaps;St&&St.length>0?e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Rt.__webglFramebuffer[0]):e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Rt.__webglFramebuffer);for(let wt=0;wt<E.length;wt++){if(C.resolveDepthBuffer&&(C.depthBuffer&&($|=i.DEPTH_BUFFER_BIT),C.stencilBuffer&&C.resolveStencilBuffer&&($|=i.STENCIL_BUFFER_BIT)),ct){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Rt.__webglColorRenderbuffer[wt]);let it=n.get(E[wt]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,it,0)}i.blitFramebuffer(0,0,k,X,0,0,k,X,$,i.NEAREST),l===!0&&(K.length=0,J.length=0,K.push(i.COLOR_ATTACHMENT0+wt),C.depthBuffer&&C.resolveDepthBuffer===!1&&(K.push(Y),J.push(Y),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,J)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,K))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),ct)for(let wt=0;wt<E.length;wt++){e.bindFramebuffer(i.FRAMEBUFFER,Rt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+wt,i.RENDERBUFFER,Rt.__webglColorRenderbuffer[wt]);let it=n.get(E[wt]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,Rt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+wt,i.TEXTURE_2D,it,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Rt.__webglMultisampledFramebuffer)}else if(C.depthBuffer&&C.resolveDepthBuffer===!1&&l){let E=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[E])}}}function ht(C){return Math.min(s.maxSamples,C.samples)}function nt(C){let E=n.get(C);return C.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&E.__useRenderToTexture!==!1}function ut(C){let E=o.render.frame;h.get(C)!==E&&(h.set(C,E),C.update())}function Ht(C,E){let k=C.colorSpace,X=C.format,$=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||k!==yi&&k!==Xn&&(jt.getTransfer(k)===re?(X!==rn||$!==_n)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",k)),E}function Ot(C){return typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement?(c.width=C.naturalWidth||C.width,c.height=C.naturalHeight||C.height):typeof VideoFrame<"u"&&C instanceof VideoFrame?(c.width=C.displayWidth,c.height=C.displayHeight):(c.width=C.width,c.height=C.height),c}this.allocateTextureUnit=L,this.resetTextureUnits=D,this.setTexture2D=F,this.setTexture2DArray=H,this.setTexture3D=q,this.setTextureCube=G,this.rebindTextures=le,this.setupRenderTarget=U,this.updateRenderTargetMipmap=tt,this.updateMultisampleRenderTarget=Z,this.setupDepthRenderbuffer=qt,this.setupFrameBufferTexture=yt,this.useMultisampledRTT=nt}function ux(i,t){function e(n,s=Xn){let r,o=jt.getTransfer(s);if(n===_n)return i.UNSIGNED_BYTE;if(n===qo)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Qo)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Oc)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===zc)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===Fc)return i.BYTE;if(n===Nc)return i.SHORT;if(n===ps)return i.UNSIGNED_SHORT;if(n===Yo)return i.INT;if(n===oi)return i.UNSIGNED_INT;if(n===yn)return i.FLOAT;if(n===ms)return i.HALF_FLOAT;if(n===Hc)return i.ALPHA;if(n===kc)return i.RGB;if(n===rn)return i.RGBA;if(n===Ki)return i.DEPTH_COMPONENT;if(n===xs)return i.DEPTH_STENCIL;if(n===Zo)return i.RED;if(n===Jo)return i.RED_INTEGER;if(n===Gc)return i.RG;if(n===Ko)return i.RG_INTEGER;if(n===jo)return i.RGBA_INTEGER;if(n===gr||n===xr||n===Ar||n===_r)if(o===re)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===gr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===xr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Ar)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===_r)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===gr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===xr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Ar)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===_r)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===$o||n===ta||n===ea||n===na)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===$o)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===ta)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===ea)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===na)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===ia||n===sa||n===ra)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===ia||n===sa)return o===re?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===ra)return o===re?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===oa||n===aa||n===ca||n===la||n===ha||n===ua||n===da||n===fa||n===pa||n===ma||n===ga||n===xa||n===Aa||n===_a)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===oa)return o===re?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===aa)return o===re?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===ca)return o===re?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===la)return o===re?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===ha)return o===re?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===ua)return o===re?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===da)return o===re?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===fa)return o===re?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===pa)return o===re?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===ma)return o===re?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===ga)return o===re?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===xa)return o===re?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Aa)return o===re?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===_a)return o===re?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===ya||n===va||n===Ma)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===ya)return o===re?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===va)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Ma)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===ba||n===Ea||n===Sa||n===wa)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===ba)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Ea)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Sa)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===wa)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===gs?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}var dx=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,fx=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,dl=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){let n=new js(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){let e=t.cameras[0].viewport,n=new gn({vertexShader:dx,fragmentShader:fx,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new xt(new me(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},fl=class extends Hn{constructor(t,e){super();let n=this,s=null,r=1,o=null,a="local-floor",l=1,c=null,h=null,u=null,d=null,p=null,x=null,g=typeof XRWebGLBinding<"u",m=new dl,f={},A=e.getContextAttributes(),v=null,y=null,R=[],b=[],T=new ot,P=null,M=new De;M.viewport=new se;let _=new De;_.viewport=new se;let S=[M,_],D=new Lo,L=null,z=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Q){let et=R[Q];return et===void 0&&(et=new is,R[Q]=et),et.getTargetRaySpace()},this.getControllerGrip=function(Q){let et=R[Q];return et===void 0&&(et=new is,R[Q]=et),et.getGripSpace()},this.getHand=function(Q){let et=R[Q];return et===void 0&&(et=new is,R[Q]=et),et.getHandSpace()};function F(Q){let et=b.indexOf(Q.inputSource);if(et===-1)return;let yt=R[et];yt!==void 0&&(yt.update(Q.inputSource,Q.frame,c||o),yt.dispatchEvent({type:Q.type,data:Q.inputSource}))}function H(){s.removeEventListener("select",F),s.removeEventListener("selectstart",F),s.removeEventListener("selectend",F),s.removeEventListener("squeeze",F),s.removeEventListener("squeezestart",F),s.removeEventListener("squeezeend",F),s.removeEventListener("end",H),s.removeEventListener("inputsourceschange",q);for(let Q=0;Q<R.length;Q++){let et=b[Q];et!==null&&(b[Q]=null,R[Q].disconnect(et))}L=null,z=null,m.reset();for(let Q in f)delete f[Q];t.setRenderTarget(v),p=null,d=null,u=null,s=null,y=null,Kt.stop(),n.isPresenting=!1,t.setPixelRatio(P),t.setSize(T.width,T.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Q){r=Q,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Q){a=Q,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(Q){c=Q},this.getBaseLayer=function(){return d!==null?d:p},this.getBinding=function(){return u===null&&g&&(u=new XRWebGLBinding(s,e)),u},this.getFrame=function(){return x},this.getSession=function(){return s},this.setSession=async function(Q){if(s=Q,s!==null){if(v=t.getRenderTarget(),s.addEventListener("select",F),s.addEventListener("selectstart",F),s.addEventListener("selectend",F),s.addEventListener("squeeze",F),s.addEventListener("squeezestart",F),s.addEventListener("squeezeend",F),s.addEventListener("end",H),s.addEventListener("inputsourceschange",q),A.xrCompatible!==!0&&await e.makeXRCompatible(),P=t.getPixelRatio(),t.getSize(T),g&&"createProjectionLayer"in XRWebGLBinding.prototype){let yt=null,It=null,Et=null;A.depth&&(Et=A.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,yt=A.stencil?xs:Ki,It=A.stencil?gs:oi);let qt={colorFormat:e.RGBA8,depthFormat:Et,scaleFactor:r};u=this.getBinding(),d=u.createProjectionLayer(qt),s.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),y=new Sn(d.textureWidth,d.textureHeight,{format:rn,type:_n,depthTexture:new Ks(d.textureWidth,d.textureHeight,It,void 0,void 0,void 0,void 0,void 0,void 0,yt),stencilBuffer:A.stencil,colorSpace:t.outputColorSpace,samples:A.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{let yt={antialias:A.antialias,alpha:!0,depth:A.depth,stencil:A.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(s,e,yt),s.updateRenderState({baseLayer:p}),t.setPixelRatio(1),t.setSize(p.framebufferWidth,p.framebufferHeight,!1),y=new Sn(p.framebufferWidth,p.framebufferHeight,{format:rn,type:_n,colorSpace:t.outputColorSpace,stencilBuffer:A.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(a),Kt.setContext(s),Kt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function q(Q){for(let et=0;et<Q.removed.length;et++){let yt=Q.removed[et],It=b.indexOf(yt);It>=0&&(b[It]=null,R[It].disconnect(yt))}for(let et=0;et<Q.added.length;et++){let yt=Q.added[et],It=b.indexOf(yt);if(It===-1){for(let qt=0;qt<R.length;qt++)if(qt>=b.length){b.push(yt),It=qt;break}else if(b[qt]===null){b[qt]=yt,It=qt;break}if(It===-1)break}let Et=R[It];Et&&Et.connect(yt)}}let G=new I,lt=new I;function At(Q,et,yt){G.setFromMatrixPosition(et.matrixWorld),lt.setFromMatrixPosition(yt.matrixWorld);let It=G.distanceTo(lt),Et=et.projectionMatrix.elements,qt=yt.projectionMatrix.elements,le=Et[14]/(Et[10]-1),U=Et[14]/(Et[10]+1),tt=(Et[9]+1)/Et[5],K=(Et[9]-1)/Et[5],J=(Et[8]-1)/Et[0],Z=(qt[8]+1)/qt[0],ht=le*J,nt=le*Z,ut=It/(-J+Z),Ht=ut*-J;if(et.matrixWorld.decompose(Q.position,Q.quaternion,Q.scale),Q.translateX(Ht),Q.translateZ(ut),Q.matrixWorld.compose(Q.position,Q.quaternion,Q.scale),Q.matrixWorldInverse.copy(Q.matrixWorld).invert(),Et[10]===-1)Q.projectionMatrix.copy(et.projectionMatrix),Q.projectionMatrixInverse.copy(et.projectionMatrixInverse);else{let Ot=le+ut,C=U+ut,E=ht-Ht,k=nt+(It-Ht),X=tt*U/C*Ot,$=K*U/C*Ot;Q.projectionMatrix.makePerspective(E,k,X,$,Ot,C),Q.projectionMatrixInverse.copy(Q.projectionMatrix).invert()}}function vt(Q,et){et===null?Q.matrixWorld.copy(Q.matrix):Q.matrixWorld.multiplyMatrices(et.matrixWorld,Q.matrix),Q.matrixWorldInverse.copy(Q.matrixWorld).invert()}this.updateCamera=function(Q){if(s===null)return;let et=Q.near,yt=Q.far;m.texture!==null&&(m.depthNear>0&&(et=m.depthNear),m.depthFar>0&&(yt=m.depthFar)),D.near=_.near=M.near=et,D.far=_.far=M.far=yt,(L!==D.near||z!==D.far)&&(s.updateRenderState({depthNear:D.near,depthFar:D.far}),L=D.near,z=D.far),D.layers.mask=Q.layers.mask|6,M.layers.mask=D.layers.mask&3,_.layers.mask=D.layers.mask&5;let It=Q.parent,Et=D.cameras;vt(D,It);for(let qt=0;qt<Et.length;qt++)vt(Et[qt],It);Et.length===2?At(D,M,_):D.projectionMatrix.copy(M.projectionMatrix),Gt(Q,D,It)};function Gt(Q,et,yt){yt===null?Q.matrix.copy(et.matrixWorld):(Q.matrix.copy(yt.matrixWorld),Q.matrix.invert(),Q.matrix.multiply(et.matrixWorld)),Q.matrix.decompose(Q.position,Q.quaternion,Q.scale),Q.updateMatrixWorld(!0),Q.projectionMatrix.copy(et.projectionMatrix),Q.projectionMatrixInverse.copy(et.projectionMatrixInverse),Q.isPerspectiveCamera&&(Q.fov=ji*2*Math.atan(1/Q.projectionMatrix.elements[5]),Q.zoom=1)}this.getCamera=function(){return D},this.getFoveation=function(){if(!(d===null&&p===null))return l},this.setFoveation=function(Q){l=Q,d!==null&&(d.fixedFoveation=Q),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=Q)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(D)},this.getCameraTexture=function(Q){return f[Q]};let Jt=null;function ne(Q,et){if(h=et.getViewerPose(c||o),x=et,h!==null){let yt=h.views;p!==null&&(t.setRenderTargetFramebuffer(y,p.framebuffer),t.setRenderTarget(y));let It=!1;yt.length!==D.cameras.length&&(D.cameras.length=0,It=!0);for(let U=0;U<yt.length;U++){let tt=yt[U],K=null;if(p!==null)K=p.getViewport(tt);else{let Z=u.getViewSubImage(d,tt);K=Z.viewport,U===0&&(t.setRenderTargetTextures(y,Z.colorTexture,Z.depthStencilTexture),t.setRenderTarget(y))}let J=S[U];J===void 0&&(J=new De,J.layers.enable(U),J.viewport=new se,S[U]=J),J.matrix.fromArray(tt.transform.matrix),J.matrix.decompose(J.position,J.quaternion,J.scale),J.projectionMatrix.fromArray(tt.projectionMatrix),J.projectionMatrixInverse.copy(J.projectionMatrix).invert(),J.viewport.set(K.x,K.y,K.width,K.height),U===0&&(D.matrix.copy(J.matrix),D.matrix.decompose(D.position,D.quaternion,D.scale)),It===!0&&D.cameras.push(J)}let Et=s.enabledFeatures;if(Et&&Et.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&g){u=n.getBinding();let U=u.getDepthInformation(yt[0]);U&&U.isValid&&U.texture&&m.init(U,s.renderState)}if(Et&&Et.includes("camera-access")&&g){t.state.unbindTexture(),u=n.getBinding();for(let U=0;U<yt.length;U++){let tt=yt[U].camera;if(tt){let K=f[tt];K||(K=new js,f[tt]=K);let J=u.getCameraImage(tt);K.sourceTexture=J}}}}for(let yt=0;yt<R.length;yt++){let It=b[yt],Et=R[yt];It!==null&&Et!==void 0&&Et.update(It,et,c||o)}Jt&&Jt(Q,et),et.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:et}),x=null}let Kt=new Pu;Kt.setAnimationLoop(ne),this.setAnimationLoop=function(Q){Jt=Q},this.dispose=function(){}}},Pi=new Ze,px=new te;function mx(i,t){function e(m,f){m.matrixAutoUpdate===!0&&m.updateMatrix(),f.value.copy(m.matrix)}function n(m,f){f.color.getRGB(m.fogColor.value,Zc(i)),f.isFog?(m.fogNear.value=f.near,m.fogFar.value=f.far):f.isFogExp2&&(m.fogDensity.value=f.density)}function s(m,f,A,v,y){f.isMeshBasicMaterial||f.isMeshLambertMaterial?r(m,f):f.isMeshToonMaterial?(r(m,f),u(m,f)):f.isMeshPhongMaterial?(r(m,f),h(m,f)):f.isMeshStandardMaterial?(r(m,f),d(m,f),f.isMeshPhysicalMaterial&&p(m,f,y)):f.isMeshMatcapMaterial?(r(m,f),x(m,f)):f.isMeshDepthMaterial?r(m,f):f.isMeshDistanceMaterial?(r(m,f),g(m,f)):f.isMeshNormalMaterial?r(m,f):f.isLineBasicMaterial?(o(m,f),f.isLineDashedMaterial&&a(m,f)):f.isPointsMaterial?l(m,f,A,v):f.isSpriteMaterial?c(m,f):f.isShadowMaterial?(m.color.value.copy(f.color),m.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function r(m,f){m.opacity.value=f.opacity,f.color&&m.diffuse.value.copy(f.color),f.emissive&&m.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(m.map.value=f.map,e(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.bumpMap&&(m.bumpMap.value=f.bumpMap,e(f.bumpMap,m.bumpMapTransform),m.bumpScale.value=f.bumpScale,f.side===He&&(m.bumpScale.value*=-1)),f.normalMap&&(m.normalMap.value=f.normalMap,e(f.normalMap,m.normalMapTransform),m.normalScale.value.copy(f.normalScale),f.side===He&&m.normalScale.value.negate()),f.displacementMap&&(m.displacementMap.value=f.displacementMap,e(f.displacementMap,m.displacementMapTransform),m.displacementScale.value=f.displacementScale,m.displacementBias.value=f.displacementBias),f.emissiveMap&&(m.emissiveMap.value=f.emissiveMap,e(f.emissiveMap,m.emissiveMapTransform)),f.specularMap&&(m.specularMap.value=f.specularMap,e(f.specularMap,m.specularMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest);let A=t.get(f),v=A.envMap,y=A.envMapRotation;v&&(m.envMap.value=v,Pi.copy(y),Pi.x*=-1,Pi.y*=-1,Pi.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(Pi.y*=-1,Pi.z*=-1),m.envMapRotation.value.setFromMatrix4(px.makeRotationFromEuler(Pi)),m.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=f.reflectivity,m.ior.value=f.ior,m.refractionRatio.value=f.refractionRatio),f.lightMap&&(m.lightMap.value=f.lightMap,m.lightMapIntensity.value=f.lightMapIntensity,e(f.lightMap,m.lightMapTransform)),f.aoMap&&(m.aoMap.value=f.aoMap,m.aoMapIntensity.value=f.aoMapIntensity,e(f.aoMap,m.aoMapTransform))}function o(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,f.map&&(m.map.value=f.map,e(f.map,m.mapTransform))}function a(m,f){m.dashSize.value=f.dashSize,m.totalSize.value=f.dashSize+f.gapSize,m.scale.value=f.scale}function l(m,f,A,v){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.size.value=f.size*A,m.scale.value=v*.5,f.map&&(m.map.value=f.map,e(f.map,m.uvTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function c(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.rotation.value=f.rotation,f.map&&(m.map.value=f.map,e(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function h(m,f){m.specular.value.copy(f.specular),m.shininess.value=Math.max(f.shininess,1e-4)}function u(m,f){f.gradientMap&&(m.gradientMap.value=f.gradientMap)}function d(m,f){m.metalness.value=f.metalness,f.metalnessMap&&(m.metalnessMap.value=f.metalnessMap,e(f.metalnessMap,m.metalnessMapTransform)),m.roughness.value=f.roughness,f.roughnessMap&&(m.roughnessMap.value=f.roughnessMap,e(f.roughnessMap,m.roughnessMapTransform)),f.envMap&&(m.envMapIntensity.value=f.envMapIntensity)}function p(m,f,A){m.ior.value=f.ior,f.sheen>0&&(m.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),m.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(m.sheenColorMap.value=f.sheenColorMap,e(f.sheenColorMap,m.sheenColorMapTransform)),f.sheenRoughnessMap&&(m.sheenRoughnessMap.value=f.sheenRoughnessMap,e(f.sheenRoughnessMap,m.sheenRoughnessMapTransform))),f.clearcoat>0&&(m.clearcoat.value=f.clearcoat,m.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(m.clearcoatMap.value=f.clearcoatMap,e(f.clearcoatMap,m.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,e(f.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(m.clearcoatNormalMap.value=f.clearcoatNormalMap,e(f.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===He&&m.clearcoatNormalScale.value.negate())),f.dispersion>0&&(m.dispersion.value=f.dispersion),f.iridescence>0&&(m.iridescence.value=f.iridescence,m.iridescenceIOR.value=f.iridescenceIOR,m.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(m.iridescenceMap.value=f.iridescenceMap,e(f.iridescenceMap,m.iridescenceMapTransform)),f.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=f.iridescenceThicknessMap,e(f.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),f.transmission>0&&(m.transmission.value=f.transmission,m.transmissionSamplerMap.value=A.texture,m.transmissionSamplerSize.value.set(A.width,A.height),f.transmissionMap&&(m.transmissionMap.value=f.transmissionMap,e(f.transmissionMap,m.transmissionMapTransform)),m.thickness.value=f.thickness,f.thicknessMap&&(m.thicknessMap.value=f.thicknessMap,e(f.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=f.attenuationDistance,m.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(m.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(m.anisotropyMap.value=f.anisotropyMap,e(f.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=f.specularIntensity,m.specularColor.value.copy(f.specularColor),f.specularColorMap&&(m.specularColorMap.value=f.specularColorMap,e(f.specularColorMap,m.specularColorMapTransform)),f.specularIntensityMap&&(m.specularIntensityMap.value=f.specularIntensityMap,e(f.specularIntensityMap,m.specularIntensityMapTransform))}function x(m,f){f.matcap&&(m.matcap.value=f.matcap)}function g(m,f){let A=t.get(f).light;m.referencePosition.value.setFromMatrixPosition(A.matrixWorld),m.nearDistance.value=A.shadow.camera.near,m.farDistance.value=A.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function gx(i,t,e,n){let s={},r={},o=[],a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(A,v){let y=v.program;n.uniformBlockBinding(A,y)}function c(A,v){let y=s[A.id];y===void 0&&(x(A),y=h(A),s[A.id]=y,A.addEventListener("dispose",m));let R=v.program;n.updateUBOMapping(A,R);let b=t.render.frame;r[A.id]!==b&&(d(A),r[A.id]=b)}function h(A){let v=u();A.__bindingPointIndex=v;let y=i.createBuffer(),R=A.__size,b=A.usage;return i.bindBuffer(i.UNIFORM_BUFFER,y),i.bufferData(i.UNIFORM_BUFFER,R,b),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,v,y),y}function u(){for(let A=0;A<a;A++)if(o.indexOf(A)===-1)return o.push(A),A;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(A){let v=s[A.id],y=A.uniforms,R=A.__cache;i.bindBuffer(i.UNIFORM_BUFFER,v);for(let b=0,T=y.length;b<T;b++){let P=Array.isArray(y[b])?y[b]:[y[b]];for(let M=0,_=P.length;M<_;M++){let S=P[M];if(p(S,b,M,R)===!0){let D=S.__offset,L=Array.isArray(S.value)?S.value:[S.value],z=0;for(let F=0;F<L.length;F++){let H=L[F],q=g(H);typeof H=="number"||typeof H=="boolean"?(S.__data[0]=H,i.bufferSubData(i.UNIFORM_BUFFER,D+z,S.__data)):H.isMatrix3?(S.__data[0]=H.elements[0],S.__data[1]=H.elements[1],S.__data[2]=H.elements[2],S.__data[3]=0,S.__data[4]=H.elements[3],S.__data[5]=H.elements[4],S.__data[6]=H.elements[5],S.__data[7]=0,S.__data[8]=H.elements[6],S.__data[9]=H.elements[7],S.__data[10]=H.elements[8],S.__data[11]=0):(H.toArray(S.__data,z),z+=q.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,D,S.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function p(A,v,y,R){let b=A.value,T=v+"_"+y;if(R[T]===void 0)return typeof b=="number"||typeof b=="boolean"?R[T]=b:R[T]=b.clone(),!0;{let P=R[T];if(typeof b=="number"||typeof b=="boolean"){if(P!==b)return R[T]=b,!0}else if(P.equals(b)===!1)return P.copy(b),!0}return!1}function x(A){let v=A.uniforms,y=0,R=16;for(let T=0,P=v.length;T<P;T++){let M=Array.isArray(v[T])?v[T]:[v[T]];for(let _=0,S=M.length;_<S;_++){let D=M[_],L=Array.isArray(D.value)?D.value:[D.value];for(let z=0,F=L.length;z<F;z++){let H=L[z],q=g(H),G=y%R,lt=G%q.boundary,At=G+lt;y+=lt,At!==0&&R-At<q.storage&&(y+=R-At),D.__data=new Float32Array(q.storage/Float32Array.BYTES_PER_ELEMENT),D.__offset=y,y+=q.storage}}}let b=y%R;return b>0&&(y+=R-b),A.__size=y,A.__cache={},this}function g(A){let v={boundary:0,storage:0};return typeof A=="number"||typeof A=="boolean"?(v.boundary=4,v.storage=4):A.isVector2?(v.boundary=8,v.storage=8):A.isVector3||A.isColor?(v.boundary=16,v.storage=12):A.isVector4?(v.boundary=16,v.storage=16):A.isMatrix3?(v.boundary=48,v.storage=48):A.isMatrix4?(v.boundary=64,v.storage=64):A.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",A),v}function m(A){let v=A.target;v.removeEventListener("dispose",m);let y=o.indexOf(v.__bindingPointIndex);o.splice(y,1),i.deleteBuffer(s[v.id]),delete s[v.id],delete r[v.id]}function f(){for(let A in s)i.deleteBuffer(s[A]);o=[],s={},r={}}return{bind:l,update:c,dispose:f}}var Ia=class{constructor(t={}){let{canvas:e=$h(),context:n=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1}=t;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=o;let x=new Uint32Array(4),g=new Int32Array(4),m=null,f=null,A=[],v=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Wn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let y=this,R=!1;this._outputColorSpace=ie;let b=0,T=0,P=null,M=-1,_=null,S=new se,D=new se,L=null,z=new Nt(0),F=0,H=e.width,q=e.height,G=1,lt=null,At=null,vt=new se(0,0,H,q),Gt=new se(0,0,H,q),Jt=!1,ne=new os,Kt=!1,Q=!1,et=new te,yt=new I,It=new se,Et={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},qt=!1;function le(){return P===null?G:1}let U=n;function tt(w,N){return e.getContext(w,N)}try{let w={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${"180"}`),e.addEventListener("webglcontextlost",dt,!1),e.addEventListener("webglcontextrestored",Mt,!1),e.addEventListener("webglcontextcreationerror",st,!1),U===null){let N="webgl2";if(U=tt(N,w),U===null)throw tt(N)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(w){throw console.error("THREE.WebGLRenderer: "+w.message),w}let K,J,Z,ht,nt,ut,Ht,Ot,C,E,k,X,$,Y,Rt,ct,St,wt,it,gt,Bt,Ct,pt,Wt;function B(){K=new L0(U),K.init(),Ct=new ux(U,K),J=new T0(U,K,t,Ct),Z=new lx(U,K),J.reversedDepthBuffer&&d&&Z.buffers.depth.setReversed(!0),ht=new N0(U),nt=new Jg,ut=new hx(U,K,Z,nt,J,Ct,ht),Ht=new C0(y),Ot=new U0(y),C=new Vf(U),pt=new S0(U,C),E=new B0(U,C,ht,pt),k=new z0(U,E,C,ht),it=new O0(U,J,ut),ct=new R0(nt),X=new Zg(y,Ht,Ot,K,J,pt,ct),$=new mx(y,nt),Y=new jg,Rt=new sx(K),wt=new E0(y,Ht,Ot,Z,k,p,l),St=new ax(y,k,J),Wt=new gx(U,ht,J,Z),gt=new w0(U,K,ht),Bt=new F0(U,K,ht),ht.programs=X.programs,y.capabilities=J,y.extensions=K,y.properties=nt,y.renderLists=Y,y.shadowMap=St,y.state=Z,y.info=ht}B();let at=new fl(y,U);this.xr=at,this.getContext=function(){return U},this.getContextAttributes=function(){return U.getContextAttributes()},this.forceContextLoss=function(){let w=K.get("WEBGL_lose_context");w&&w.loseContext()},this.forceContextRestore=function(){let w=K.get("WEBGL_lose_context");w&&w.restoreContext()},this.getPixelRatio=function(){return G},this.setPixelRatio=function(w){w!==void 0&&(G=w,this.setSize(H,q,!1))},this.getSize=function(w){return w.set(H,q)},this.setSize=function(w,N,V=!0){if(at.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}H=w,q=N,e.width=Math.floor(w*G),e.height=Math.floor(N*G),V===!0&&(e.style.width=w+"px",e.style.height=N+"px"),this.setViewport(0,0,w,N)},this.getDrawingBufferSize=function(w){return w.set(H*G,q*G).floor()},this.setDrawingBufferSize=function(w,N,V){H=w,q=N,G=V,e.width=Math.floor(w*V),e.height=Math.floor(N*V),this.setViewport(0,0,w,N)},this.getCurrentViewport=function(w){return w.copy(S)},this.getViewport=function(w){return w.copy(vt)},this.setViewport=function(w,N,V,W){w.isVector4?vt.set(w.x,w.y,w.z,w.w):vt.set(w,N,V,W),Z.viewport(S.copy(vt).multiplyScalar(G).round())},this.getScissor=function(w){return w.copy(Gt)},this.setScissor=function(w,N,V,W){w.isVector4?Gt.set(w.x,w.y,w.z,w.w):Gt.set(w,N,V,W),Z.scissor(D.copy(Gt).multiplyScalar(G).round())},this.getScissorTest=function(){return Jt},this.setScissorTest=function(w){Z.setScissorTest(Jt=w)},this.setOpaqueSort=function(w){lt=w},this.setTransparentSort=function(w){At=w},this.getClearColor=function(w){return w.copy(wt.getClearColor())},this.setClearColor=function(){wt.setClearColor(...arguments)},this.getClearAlpha=function(){return wt.getClearAlpha()},this.setClearAlpha=function(){wt.setClearAlpha(...arguments)},this.clear=function(w=!0,N=!0,V=!0){let W=0;if(w){let O=!1;if(P!==null){let rt=P.texture.format;O=rt===jo||rt===Ko||rt===Jo}if(O){let rt=P.texture.type,mt=rt===_n||rt===oi||rt===ps||rt===gs||rt===qo||rt===Qo,bt=wt.getClearColor(),_t=wt.getClearAlpha(),Lt=bt.r,Ft=bt.g,Pt=bt.b;mt?(x[0]=Lt,x[1]=Ft,x[2]=Pt,x[3]=_t,U.clearBufferuiv(U.COLOR,0,x)):(g[0]=Lt,g[1]=Ft,g[2]=Pt,g[3]=_t,U.clearBufferiv(U.COLOR,0,g))}else W|=U.COLOR_BUFFER_BIT}N&&(W|=U.DEPTH_BUFFER_BIT),V&&(W|=U.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),U.clear(W)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",dt,!1),e.removeEventListener("webglcontextrestored",Mt,!1),e.removeEventListener("webglcontextcreationerror",st,!1),wt.dispose(),Y.dispose(),Rt.dispose(),nt.dispose(),Ht.dispose(),Ot.dispose(),k.dispose(),pt.dispose(),Wt.dispose(),X.dispose(),at.dispose(),at.removeEventListener("sessionstart",bn),at.removeEventListener("sessionend",Cl),hi.stop()};function dt(w){w.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),R=!0}function Mt(){console.log("THREE.WebGLRenderer: Context Restored."),R=!1;let w=ht.autoReset,N=St.enabled,V=St.autoUpdate,W=St.needsUpdate,O=St.type;B(),ht.autoReset=w,St.enabled=N,St.autoUpdate=V,St.needsUpdate=W,St.type=O}function st(w){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",w.statusMessage)}function j(w){let N=w.target;N.removeEventListener("dispose",j),Tt(N)}function Tt(w){kt(w),nt.remove(w)}function kt(w){let N=nt.get(w).programs;N!==void 0&&(N.forEach(function(V){X.releaseProgram(V)}),w.isShaderMaterial&&X.releaseShaderCache(w))}this.renderBufferDirect=function(w,N,V,W,O,rt){N===null&&(N=Et);let mt=O.isMesh&&O.matrixWorld.determinant()<0,bt=hd(w,N,V,W,O);Z.setMaterial(W,mt);let _t=V.index,Lt=1;if(W.wireframe===!0){if(_t=E.getWireframeAttribute(V),_t===void 0)return;Lt=2}let Ft=V.drawRange,Pt=V.attributes.position,Qt=Ft.start*Lt,oe=(Ft.start+Ft.count)*Lt;rt!==null&&(Qt=Math.max(Qt,rt.start*Lt),oe=Math.min(oe,(rt.start+rt.count)*Lt)),_t!==null?(Qt=Math.max(Qt,0),oe=Math.min(oe,_t.count)):Pt!=null&&(Qt=Math.max(Qt,0),oe=Math.min(oe,Pt.count));let be=oe-Qt;if(be<0||be===1/0)return;pt.setup(O,W,bt,V,_t);let de,ce=gt;if(_t!==null&&(de=C.get(_t),ce=Bt,ce.setIndex(de)),O.isMesh)W.wireframe===!0?(Z.setLineWidth(W.wireframeLinewidth*le()),ce.setMode(U.LINES)):ce.setMode(U.TRIANGLES);else if(O.isLine){let Ut=W.linewidth;Ut===void 0&&(Ut=1),Z.setLineWidth(Ut*le()),O.isLineSegments?ce.setMode(U.LINES):O.isLineLoop?ce.setMode(U.LINE_LOOP):ce.setMode(U.LINE_STRIP)}else O.isPoints?ce.setMode(U.POINTS):O.isSprite&&ce.setMode(U.TRIANGLES);if(O.isBatchedMesh)if(O._multiDrawInstances!==null)$i("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),ce.renderMultiDrawInstances(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount,O._multiDrawInstances);else if(K.get("WEBGL_multi_draw"))ce.renderMultiDraw(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount);else{let Ut=O._multiDrawStarts,Ae=O._multiDrawCounts,$t=O._multiDrawCount,Xe=_t?C.get(_t).bytesPerElement:1,Bi=nt.get(W).currentProgram.getUniforms();for(let Ye=0;Ye<$t;Ye++)Bi.setValue(U,"_gl_DrawID",Ye),ce.render(Ut[Ye]/Xe,Ae[Ye])}else if(O.isInstancedMesh)ce.renderInstances(Qt,be,O.count);else if(V.isInstancedBufferGeometry){let Ut=V._maxInstanceCount!==void 0?V._maxInstanceCount:1/0,Ae=Math.min(V.instanceCount,Ut);ce.renderInstances(Qt,be,Ae)}else ce.render(Qt,be)};function he(w,N,V){w.transparent===!0&&w.side===we&&w.forceSinglePass===!1?(w.side=He,w.needsUpdate=!0,Pr(w,N,V),w.side=fn,w.needsUpdate=!0,Pr(w,N,V),w.side=we):Pr(w,N,V)}this.compile=function(w,N,V=null){V===null&&(V=w),f=Rt.get(V),f.init(N),v.push(f),V.traverseVisible(function(O){O.isLight&&O.layers.test(N.layers)&&(f.pushLight(O),O.castShadow&&f.pushShadow(O))}),w!==V&&w.traverseVisible(function(O){O.isLight&&O.layers.test(N.layers)&&(f.pushLight(O),O.castShadow&&f.pushShadow(O))}),f.setupLights();let W=new Set;return w.traverse(function(O){if(!(O.isMesh||O.isPoints||O.isLine||O.isSprite))return;let rt=O.material;if(rt)if(Array.isArray(rt))for(let mt=0;mt<rt.length;mt++){let bt=rt[mt];he(bt,V,O),W.add(bt)}else he(rt,V,O),W.add(rt)}),f=v.pop(),W},this.compileAsync=function(w,N,V=null){let W=this.compile(w,N,V);return new Promise(O=>{function rt(){if(W.forEach(function(mt){nt.get(mt).currentProgram.isReady()&&W.delete(mt)}),W.size===0){O(w);return}setTimeout(rt,10)}K.get("KHR_parallel_shader_compile")!==null?rt():setTimeout(rt,10)})};let ee=null;function Dn(w){ee&&ee(w)}function bn(){hi.stop()}function Cl(){hi.start()}let hi=new Pu;hi.setAnimationLoop(Dn),typeof self<"u"&&hi.setContext(self),this.setAnimationLoop=function(w){ee=w,at.setAnimationLoop(w),w===null?hi.stop():hi.start()},at.addEventListener("sessionstart",bn),at.addEventListener("sessionend",Cl),this.render=function(w,N){if(N!==void 0&&N.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(R===!0)return;if(w.matrixWorldAutoUpdate===!0&&w.updateMatrixWorld(),N.parent===null&&N.matrixWorldAutoUpdate===!0&&N.updateMatrixWorld(),at.enabled===!0&&at.isPresenting===!0&&(at.cameraAutoUpdate===!0&&at.updateCamera(N),N=at.getCamera()),w.isScene===!0&&w.onBeforeRender(y,w,N,P),f=Rt.get(w,v.length),f.init(N),v.push(f),et.multiplyMatrices(N.projectionMatrix,N.matrixWorldInverse),ne.setFromProjectionMatrix(et,dn,N.reversedDepth),Q=this.localClippingEnabled,Kt=ct.init(this.clippingPlanes,Q),m=Y.get(w,A.length),m.init(),A.push(m),at.enabled===!0&&at.isPresenting===!0){let rt=y.xr.getDepthSensingMesh();rt!==null&&Va(rt,N,-1/0,y.sortObjects)}Va(w,N,0,y.sortObjects),m.finish(),y.sortObjects===!0&&m.sort(lt,At),qt=at.enabled===!1||at.isPresenting===!1||at.hasDepthSensing()===!1,qt&&wt.addToRenderList(m,w),this.info.render.frame++,Kt===!0&&ct.beginShadows();let V=f.state.shadowsArray;St.render(V,w,N),Kt===!0&&ct.endShadows(),this.info.autoReset===!0&&this.info.reset();let W=m.opaque,O=m.transmissive;if(f.setupLights(),N.isArrayCamera){let rt=N.cameras;if(O.length>0)for(let mt=0,bt=rt.length;mt<bt;mt++){let _t=rt[mt];Pl(W,O,w,_t)}qt&&wt.render(w);for(let mt=0,bt=rt.length;mt<bt;mt++){let _t=rt[mt];Il(m,w,_t,_t.viewport)}}else O.length>0&&Pl(W,O,w,N),qt&&wt.render(w),Il(m,w,N);P!==null&&T===0&&(ut.updateMultisampleRenderTarget(P),ut.updateRenderTargetMipmap(P)),w.isScene===!0&&w.onAfterRender(y,w,N),pt.resetDefaultState(),M=-1,_=null,v.pop(),v.length>0?(f=v[v.length-1],Kt===!0&&ct.setGlobalState(y.clippingPlanes,f.state.camera)):f=null,A.pop(),A.length>0?m=A[A.length-1]:m=null};function Va(w,N,V,W){if(w.visible===!1)return;if(w.layers.test(N.layers)){if(w.isGroup)V=w.renderOrder;else if(w.isLOD)w.autoUpdate===!0&&w.update(N);else if(w.isLight)f.pushLight(w),w.castShadow&&f.pushShadow(w);else if(w.isSprite){if(!w.frustumCulled||ne.intersectsSprite(w)){W&&It.setFromMatrixPosition(w.matrixWorld).applyMatrix4(et);let mt=k.update(w),bt=w.material;bt.visible&&m.push(w,mt,bt,V,It.z,null)}}else if((w.isMesh||w.isLine||w.isPoints)&&(!w.frustumCulled||ne.intersectsObject(w))){let mt=k.update(w),bt=w.material;if(W&&(w.boundingSphere!==void 0?(w.boundingSphere===null&&w.computeBoundingSphere(),It.copy(w.boundingSphere.center)):(mt.boundingSphere===null&&mt.computeBoundingSphere(),It.copy(mt.boundingSphere.center)),It.applyMatrix4(w.matrixWorld).applyMatrix4(et)),Array.isArray(bt)){let _t=mt.groups;for(let Lt=0,Ft=_t.length;Lt<Ft;Lt++){let Pt=_t[Lt],Qt=bt[Pt.materialIndex];Qt&&Qt.visible&&m.push(w,mt,Qt,V,It.z,Pt)}}else bt.visible&&m.push(w,mt,bt,V,It.z,null)}}let rt=w.children;for(let mt=0,bt=rt.length;mt<bt;mt++)Va(rt[mt],N,V,W)}function Il(w,N,V,W){let O=w.opaque,rt=w.transmissive,mt=w.transparent;f.setupLightsView(V),Kt===!0&&ct.setGlobalState(y.clippingPlanes,V),W&&Z.viewport(S.copy(W)),O.length>0&&Ir(O,N,V),rt.length>0&&Ir(rt,N,V),mt.length>0&&Ir(mt,N,V),Z.buffers.depth.setTest(!0),Z.buffers.depth.setMask(!0),Z.buffers.color.setMask(!0),Z.setPolygonOffset(!1)}function Pl(w,N,V,W){if((V.isScene===!0?V.overrideMaterial:null)!==null)return;f.state.transmissionRenderTarget[W.id]===void 0&&(f.state.transmissionRenderTarget[W.id]=new Sn(1,1,{generateMipmaps:!0,type:K.has("EXT_color_buffer_half_float")||K.has("EXT_color_buffer_float")?ms:_n,minFilter:ri,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:jt.workingColorSpace}));let rt=f.state.transmissionRenderTarget[W.id],mt=W.viewport||S;rt.setSize(mt.z*y.transmissionResolutionScale,mt.w*y.transmissionResolutionScale);let bt=y.getRenderTarget(),_t=y.getActiveCubeFace(),Lt=y.getActiveMipmapLevel();y.setRenderTarget(rt),y.getClearColor(z),F=y.getClearAlpha(),F<1&&y.setClearColor(16777215,.5),y.clear(),qt&&wt.render(V);let Ft=y.toneMapping;y.toneMapping=Wn;let Pt=W.viewport;if(W.viewport!==void 0&&(W.viewport=void 0),f.setupLightsView(W),Kt===!0&&ct.setGlobalState(y.clippingPlanes,W),Ir(w,V,W),ut.updateMultisampleRenderTarget(rt),ut.updateRenderTargetMipmap(rt),K.has("WEBGL_multisampled_render_to_texture")===!1){let Qt=!1;for(let oe=0,be=N.length;oe<be;oe++){let de=N[oe],ce=de.object,Ut=de.geometry,Ae=de.material,$t=de.group;if(Ae.side===we&&ce.layers.test(W.layers)){let Xe=Ae.side;Ae.side=He,Ae.needsUpdate=!0,Dl(ce,V,W,Ut,Ae,$t),Ae.side=Xe,Ae.needsUpdate=!0,Qt=!0}}Qt===!0&&(ut.updateMultisampleRenderTarget(rt),ut.updateRenderTargetMipmap(rt))}y.setRenderTarget(bt,_t,Lt),y.setClearColor(z,F),Pt!==void 0&&(W.viewport=Pt),y.toneMapping=Ft}function Ir(w,N,V){let W=N.isScene===!0?N.overrideMaterial:null;for(let O=0,rt=w.length;O<rt;O++){let mt=w[O],bt=mt.object,_t=mt.geometry,Lt=mt.group,Ft=mt.material;Ft.allowOverride===!0&&W!==null&&(Ft=W),bt.layers.test(V.layers)&&Dl(bt,N,V,_t,Ft,Lt)}}function Dl(w,N,V,W,O,rt){w.onBeforeRender(y,N,V,W,O,rt),w.modelViewMatrix.multiplyMatrices(V.matrixWorldInverse,w.matrixWorld),w.normalMatrix.getNormalMatrix(w.modelViewMatrix),O.onBeforeRender(y,N,V,W,w,rt),O.transparent===!0&&O.side===we&&O.forceSinglePass===!1?(O.side=He,O.needsUpdate=!0,y.renderBufferDirect(V,N,W,O,w,rt),O.side=fn,O.needsUpdate=!0,y.renderBufferDirect(V,N,W,O,w,rt),O.side=we):y.renderBufferDirect(V,N,W,O,w,rt),w.onAfterRender(y,N,V,W,O,rt)}function Pr(w,N,V){N.isScene!==!0&&(N=Et);let W=nt.get(w),O=f.state.lights,rt=f.state.shadowsArray,mt=O.state.version,bt=X.getParameters(w,O.state,rt,N,V),_t=X.getProgramCacheKey(bt),Lt=W.programs;W.environment=w.isMeshStandardMaterial?N.environment:null,W.fog=N.fog,W.envMap=(w.isMeshStandardMaterial?Ot:Ht).get(w.envMap||W.environment),W.envMapRotation=W.environment!==null&&w.envMap===null?N.environmentRotation:w.envMapRotation,Lt===void 0&&(w.addEventListener("dispose",j),Lt=new Map,W.programs=Lt);let Ft=Lt.get(_t);if(Ft!==void 0){if(W.currentProgram===Ft&&W.lightsStateVersion===mt)return Ll(w,bt),Ft}else bt.uniforms=X.getUniforms(w),w.onBeforeCompile(bt,y),Ft=X.acquireProgram(bt,_t),Lt.set(_t,Ft),W.uniforms=bt.uniforms;let Pt=W.uniforms;return(!w.isShaderMaterial&&!w.isRawShaderMaterial||w.clipping===!0)&&(Pt.clippingPlanes=ct.uniform),Ll(w,bt),W.needsLights=dd(w),W.lightsStateVersion=mt,W.needsLights&&(Pt.ambientLightColor.value=O.state.ambient,Pt.lightProbe.value=O.state.probe,Pt.directionalLights.value=O.state.directional,Pt.directionalLightShadows.value=O.state.directionalShadow,Pt.spotLights.value=O.state.spot,Pt.spotLightShadows.value=O.state.spotShadow,Pt.rectAreaLights.value=O.state.rectArea,Pt.ltc_1.value=O.state.rectAreaLTC1,Pt.ltc_2.value=O.state.rectAreaLTC2,Pt.pointLights.value=O.state.point,Pt.pointLightShadows.value=O.state.pointShadow,Pt.hemisphereLights.value=O.state.hemi,Pt.directionalShadowMap.value=O.state.directionalShadowMap,Pt.directionalShadowMatrix.value=O.state.directionalShadowMatrix,Pt.spotShadowMap.value=O.state.spotShadowMap,Pt.spotLightMatrix.value=O.state.spotLightMatrix,Pt.spotLightMap.value=O.state.spotLightMap,Pt.pointShadowMap.value=O.state.pointShadowMap,Pt.pointShadowMatrix.value=O.state.pointShadowMatrix),W.currentProgram=Ft,W.uniformsList=null,Ft}function Ul(w){if(w.uniformsList===null){let N=w.currentProgram.getUniforms();w.uniformsList=ys.seqWithValue(N.seq,w.uniforms)}return w.uniformsList}function Ll(w,N){let V=nt.get(w);V.outputColorSpace=N.outputColorSpace,V.batching=N.batching,V.batchingColor=N.batchingColor,V.instancing=N.instancing,V.instancingColor=N.instancingColor,V.instancingMorph=N.instancingMorph,V.skinning=N.skinning,V.morphTargets=N.morphTargets,V.morphNormals=N.morphNormals,V.morphColors=N.morphColors,V.morphTargetsCount=N.morphTargetsCount,V.numClippingPlanes=N.numClippingPlanes,V.numIntersection=N.numClipIntersection,V.vertexAlphas=N.vertexAlphas,V.vertexTangents=N.vertexTangents,V.toneMapping=N.toneMapping}function hd(w,N,V,W,O){N.isScene!==!0&&(N=Et),ut.resetTextureUnits();let rt=N.fog,mt=W.isMeshStandardMaterial?N.environment:null,bt=P===null?y.outputColorSpace:P.isXRRenderTarget===!0?P.texture.colorSpace:yi,_t=(W.isMeshStandardMaterial?Ot:Ht).get(W.envMap||mt),Lt=W.vertexColors===!0&&!!V.attributes.color&&V.attributes.color.itemSize===4,Ft=!!V.attributes.tangent&&(!!W.normalMap||W.anisotropy>0),Pt=!!V.morphAttributes.position,Qt=!!V.morphAttributes.normal,oe=!!V.morphAttributes.color,be=Wn;W.toneMapped&&(P===null||P.isXRRenderTarget===!0)&&(be=y.toneMapping);let de=V.morphAttributes.position||V.morphAttributes.normal||V.morphAttributes.color,ce=de!==void 0?de.length:0,Ut=nt.get(W),Ae=f.state.lights;if(Kt===!0&&(Q===!0||w!==_)){let Ne=w===_&&W.id===M;ct.setState(W,w,Ne)}let $t=!1;W.version===Ut.__version?(Ut.needsLights&&Ut.lightsStateVersion!==Ae.state.version||Ut.outputColorSpace!==bt||O.isBatchedMesh&&Ut.batching===!1||!O.isBatchedMesh&&Ut.batching===!0||O.isBatchedMesh&&Ut.batchingColor===!0&&O.colorTexture===null||O.isBatchedMesh&&Ut.batchingColor===!1&&O.colorTexture!==null||O.isInstancedMesh&&Ut.instancing===!1||!O.isInstancedMesh&&Ut.instancing===!0||O.isSkinnedMesh&&Ut.skinning===!1||!O.isSkinnedMesh&&Ut.skinning===!0||O.isInstancedMesh&&Ut.instancingColor===!0&&O.instanceColor===null||O.isInstancedMesh&&Ut.instancingColor===!1&&O.instanceColor!==null||O.isInstancedMesh&&Ut.instancingMorph===!0&&O.morphTexture===null||O.isInstancedMesh&&Ut.instancingMorph===!1&&O.morphTexture!==null||Ut.envMap!==_t||W.fog===!0&&Ut.fog!==rt||Ut.numClippingPlanes!==void 0&&(Ut.numClippingPlanes!==ct.numPlanes||Ut.numIntersection!==ct.numIntersection)||Ut.vertexAlphas!==Lt||Ut.vertexTangents!==Ft||Ut.morphTargets!==Pt||Ut.morphNormals!==Qt||Ut.morphColors!==oe||Ut.toneMapping!==be||Ut.morphTargetsCount!==ce)&&($t=!0):($t=!0,Ut.__version=W.version);let Xe=Ut.currentProgram;$t===!0&&(Xe=Pr(W,N,O));let Bi=!1,Ye=!1,ws=!1,_e=Xe.getUniforms(),$e=Ut.uniforms;if(Z.useProgram(Xe.program)&&(Bi=!0,Ye=!0,ws=!0),W.id!==M&&(M=W.id,Ye=!0),Bi||_!==w){Z.buffers.depth.getReversed()&&w.reversedDepth!==!0&&(w._reversedDepth=!0,w.updateProjectionMatrix()),_e.setValue(U,"projectionMatrix",w.projectionMatrix),_e.setValue(U,"viewMatrix",w.matrixWorldInverse);let ke=_e.map.cameraPosition;ke!==void 0&&ke.setValue(U,yt.setFromMatrixPosition(w.matrixWorld)),J.logarithmicDepthBuffer&&_e.setValue(U,"logDepthBufFC",2/(Math.log(w.far+1)/Math.LN2)),(W.isMeshPhongMaterial||W.isMeshToonMaterial||W.isMeshLambertMaterial||W.isMeshBasicMaterial||W.isMeshStandardMaterial||W.isShaderMaterial)&&_e.setValue(U,"isOrthographic",w.isOrthographicCamera===!0),_!==w&&(_=w,Ye=!0,ws=!0)}if(O.isSkinnedMesh){_e.setOptional(U,O,"bindMatrix"),_e.setOptional(U,O,"bindMatrixInverse");let Ne=O.skeleton;Ne&&(Ne.boneTexture===null&&Ne.computeBoneTexture(),_e.setValue(U,"boneTexture",Ne.boneTexture,ut))}O.isBatchedMesh&&(_e.setOptional(U,O,"batchingTexture"),_e.setValue(U,"batchingTexture",O._matricesTexture,ut),_e.setOptional(U,O,"batchingIdTexture"),_e.setValue(U,"batchingIdTexture",O._indirectTexture,ut),_e.setOptional(U,O,"batchingColorTexture"),O._colorsTexture!==null&&_e.setValue(U,"batchingColorTexture",O._colorsTexture,ut));let tn=V.morphAttributes;if((tn.position!==void 0||tn.normal!==void 0||tn.color!==void 0)&&it.update(O,V,Xe),(Ye||Ut.receiveShadow!==O.receiveShadow)&&(Ut.receiveShadow=O.receiveShadow,_e.setValue(U,"receiveShadow",O.receiveShadow)),W.isMeshGouraudMaterial&&W.envMap!==null&&($e.envMap.value=_t,$e.flipEnvMap.value=_t.isCubeTexture&&_t.isRenderTargetTexture===!1?-1:1),W.isMeshStandardMaterial&&W.envMap===null&&N.environment!==null&&($e.envMapIntensity.value=N.environmentIntensity),Ye&&(_e.setValue(U,"toneMappingExposure",y.toneMappingExposure),Ut.needsLights&&ud($e,ws),rt&&W.fog===!0&&$.refreshFogUniforms($e,rt),$.refreshMaterialUniforms($e,W,G,q,f.state.transmissionRenderTarget[w.id]),ys.upload(U,Ul(Ut),$e,ut)),W.isShaderMaterial&&W.uniformsNeedUpdate===!0&&(ys.upload(U,Ul(Ut),$e,ut),W.uniformsNeedUpdate=!1),W.isSpriteMaterial&&_e.setValue(U,"center",O.center),_e.setValue(U,"modelViewMatrix",O.modelViewMatrix),_e.setValue(U,"normalMatrix",O.normalMatrix),_e.setValue(U,"modelMatrix",O.matrixWorld),W.isShaderMaterial||W.isRawShaderMaterial){let Ne=W.uniformsGroups;for(let ke=0,Wa=Ne.length;ke<Wa;ke++){let ui=Ne[ke];Wt.update(ui,Xe),Wt.bind(ui,Xe)}}return Xe}function ud(w,N){w.ambientLightColor.needsUpdate=N,w.lightProbe.needsUpdate=N,w.directionalLights.needsUpdate=N,w.directionalLightShadows.needsUpdate=N,w.pointLights.needsUpdate=N,w.pointLightShadows.needsUpdate=N,w.spotLights.needsUpdate=N,w.spotLightShadows.needsUpdate=N,w.rectAreaLights.needsUpdate=N,w.hemisphereLights.needsUpdate=N}function dd(w){return w.isMeshLambertMaterial||w.isMeshToonMaterial||w.isMeshPhongMaterial||w.isMeshStandardMaterial||w.isShadowMaterial||w.isShaderMaterial&&w.lights===!0}this.getActiveCubeFace=function(){return b},this.getActiveMipmapLevel=function(){return T},this.getRenderTarget=function(){return P},this.setRenderTargetTextures=function(w,N,V){let W=nt.get(w);W.__autoAllocateDepthBuffer=w.resolveDepthBuffer===!1,W.__autoAllocateDepthBuffer===!1&&(W.__useRenderToTexture=!1),nt.get(w.texture).__webglTexture=N,nt.get(w.depthTexture).__webglTexture=W.__autoAllocateDepthBuffer?void 0:V,W.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(w,N){let V=nt.get(w);V.__webglFramebuffer=N,V.__useDefaultFramebuffer=N===void 0};let fd=U.createFramebuffer();this.setRenderTarget=function(w,N=0,V=0){P=w,b=N,T=V;let W=!0,O=null,rt=!1,mt=!1;if(w){let _t=nt.get(w);if(_t.__useDefaultFramebuffer!==void 0)Z.bindFramebuffer(U.FRAMEBUFFER,null),W=!1;else if(_t.__webglFramebuffer===void 0)ut.setupRenderTarget(w);else if(_t.__hasExternalTextures)ut.rebindTextures(w,nt.get(w.texture).__webglTexture,nt.get(w.depthTexture).__webglTexture);else if(w.depthBuffer){let Pt=w.depthTexture;if(_t.__boundDepthTexture!==Pt){if(Pt!==null&&nt.has(Pt)&&(w.width!==Pt.image.width||w.height!==Pt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");ut.setupDepthRenderbuffer(w)}}let Lt=w.texture;(Lt.isData3DTexture||Lt.isDataArrayTexture||Lt.isCompressedArrayTexture)&&(mt=!0);let Ft=nt.get(w).__webglFramebuffer;w.isWebGLCubeRenderTarget?(Array.isArray(Ft[N])?O=Ft[N][V]:O=Ft[N],rt=!0):w.samples>0&&ut.useMultisampledRTT(w)===!1?O=nt.get(w).__webglMultisampledFramebuffer:Array.isArray(Ft)?O=Ft[V]:O=Ft,S.copy(w.viewport),D.copy(w.scissor),L=w.scissorTest}else S.copy(vt).multiplyScalar(G).floor(),D.copy(Gt).multiplyScalar(G).floor(),L=Jt;if(V!==0&&(O=fd),Z.bindFramebuffer(U.FRAMEBUFFER,O)&&W&&Z.drawBuffers(w,O),Z.viewport(S),Z.scissor(D),Z.setScissorTest(L),rt){let _t=nt.get(w.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_CUBE_MAP_POSITIVE_X+N,_t.__webglTexture,V)}else if(mt){let _t=N;for(let Lt=0;Lt<w.textures.length;Lt++){let Ft=nt.get(w.textures[Lt]);U.framebufferTextureLayer(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0+Lt,Ft.__webglTexture,V,_t)}}else if(w!==null&&V!==0){let _t=nt.get(w.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,_t.__webglTexture,V)}M=-1},this.readRenderTargetPixels=function(w,N,V,W,O,rt,mt,bt=0){if(!(w&&w.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let _t=nt.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&mt!==void 0&&(_t=_t[mt]),_t){Z.bindFramebuffer(U.FRAMEBUFFER,_t);try{let Lt=w.textures[bt],Ft=Lt.format,Pt=Lt.type;if(!J.textureFormatReadable(Ft)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!J.textureTypeReadable(Pt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}N>=0&&N<=w.width-W&&V>=0&&V<=w.height-O&&(w.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+bt),U.readPixels(N,V,W,O,Ct.convert(Ft),Ct.convert(Pt),rt))}finally{let Lt=P!==null?nt.get(P).__webglFramebuffer:null;Z.bindFramebuffer(U.FRAMEBUFFER,Lt)}}},this.readRenderTargetPixelsAsync=async function(w,N,V,W,O,rt,mt,bt=0){if(!(w&&w.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let _t=nt.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&mt!==void 0&&(_t=_t[mt]),_t)if(N>=0&&N<=w.width-W&&V>=0&&V<=w.height-O){Z.bindFramebuffer(U.FRAMEBUFFER,_t);let Lt=w.textures[bt],Ft=Lt.format,Pt=Lt.type;if(!J.textureFormatReadable(Ft))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!J.textureTypeReadable(Pt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let Qt=U.createBuffer();U.bindBuffer(U.PIXEL_PACK_BUFFER,Qt),U.bufferData(U.PIXEL_PACK_BUFFER,rt.byteLength,U.STREAM_READ),w.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+bt),U.readPixels(N,V,W,O,Ct.convert(Ft),Ct.convert(Pt),0);let oe=P!==null?nt.get(P).__webglFramebuffer:null;Z.bindFramebuffer(U.FRAMEBUFFER,oe);let be=U.fenceSync(U.SYNC_GPU_COMMANDS_COMPLETE,0);return U.flush(),await tu(U,be,4),U.bindBuffer(U.PIXEL_PACK_BUFFER,Qt),U.getBufferSubData(U.PIXEL_PACK_BUFFER,0,rt),U.deleteBuffer(Qt),U.deleteSync(be),rt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(w,N=null,V=0){let W=Math.pow(2,-V),O=Math.floor(w.image.width*W),rt=Math.floor(w.image.height*W),mt=N!==null?N.x:0,bt=N!==null?N.y:0;ut.setTexture2D(w,0),U.copyTexSubImage2D(U.TEXTURE_2D,V,0,0,mt,bt,O,rt),Z.unbindTexture()};let pd=U.createFramebuffer(),md=U.createFramebuffer();this.copyTextureToTexture=function(w,N,V=null,W=null,O=0,rt=null){rt===null&&(O!==0?($i("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),rt=O,O=0):rt=0);let mt,bt,_t,Lt,Ft,Pt,Qt,oe,be,de=w.isCompressedTexture?w.mipmaps[rt]:w.image;if(V!==null)mt=V.max.x-V.min.x,bt=V.max.y-V.min.y,_t=V.isBox3?V.max.z-V.min.z:1,Lt=V.min.x,Ft=V.min.y,Pt=V.isBox3?V.min.z:0;else{let tn=Math.pow(2,-O);mt=Math.floor(de.width*tn),bt=Math.floor(de.height*tn),w.isDataArrayTexture?_t=de.depth:w.isData3DTexture?_t=Math.floor(de.depth*tn):_t=1,Lt=0,Ft=0,Pt=0}W!==null?(Qt=W.x,oe=W.y,be=W.z):(Qt=0,oe=0,be=0);let ce=Ct.convert(N.format),Ut=Ct.convert(N.type),Ae;N.isData3DTexture?(ut.setTexture3D(N,0),Ae=U.TEXTURE_3D):N.isDataArrayTexture||N.isCompressedArrayTexture?(ut.setTexture2DArray(N,0),Ae=U.TEXTURE_2D_ARRAY):(ut.setTexture2D(N,0),Ae=U.TEXTURE_2D),U.pixelStorei(U.UNPACK_FLIP_Y_WEBGL,N.flipY),U.pixelStorei(U.UNPACK_PREMULTIPLY_ALPHA_WEBGL,N.premultiplyAlpha),U.pixelStorei(U.UNPACK_ALIGNMENT,N.unpackAlignment);let $t=U.getParameter(U.UNPACK_ROW_LENGTH),Xe=U.getParameter(U.UNPACK_IMAGE_HEIGHT),Bi=U.getParameter(U.UNPACK_SKIP_PIXELS),Ye=U.getParameter(U.UNPACK_SKIP_ROWS),ws=U.getParameter(U.UNPACK_SKIP_IMAGES);U.pixelStorei(U.UNPACK_ROW_LENGTH,de.width),U.pixelStorei(U.UNPACK_IMAGE_HEIGHT,de.height),U.pixelStorei(U.UNPACK_SKIP_PIXELS,Lt),U.pixelStorei(U.UNPACK_SKIP_ROWS,Ft),U.pixelStorei(U.UNPACK_SKIP_IMAGES,Pt);let _e=w.isDataArrayTexture||w.isData3DTexture,$e=N.isDataArrayTexture||N.isData3DTexture;if(w.isDepthTexture){let tn=nt.get(w),Ne=nt.get(N),ke=nt.get(tn.__renderTarget),Wa=nt.get(Ne.__renderTarget);Z.bindFramebuffer(U.READ_FRAMEBUFFER,ke.__webglFramebuffer),Z.bindFramebuffer(U.DRAW_FRAMEBUFFER,Wa.__webglFramebuffer);for(let ui=0;ui<_t;ui++)_e&&(U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,nt.get(w).__webglTexture,O,Pt+ui),U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,nt.get(N).__webglTexture,rt,be+ui)),U.blitFramebuffer(Lt,Ft,mt,bt,Qt,oe,mt,bt,U.DEPTH_BUFFER_BIT,U.NEAREST);Z.bindFramebuffer(U.READ_FRAMEBUFFER,null),Z.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else if(O!==0||w.isRenderTargetTexture||nt.has(w)){let tn=nt.get(w),Ne=nt.get(N);Z.bindFramebuffer(U.READ_FRAMEBUFFER,pd),Z.bindFramebuffer(U.DRAW_FRAMEBUFFER,md);for(let ke=0;ke<_t;ke++)_e?U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,tn.__webglTexture,O,Pt+ke):U.framebufferTexture2D(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,tn.__webglTexture,O),$e?U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,Ne.__webglTexture,rt,be+ke):U.framebufferTexture2D(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,Ne.__webglTexture,rt),O!==0?U.blitFramebuffer(Lt,Ft,mt,bt,Qt,oe,mt,bt,U.COLOR_BUFFER_BIT,U.NEAREST):$e?U.copyTexSubImage3D(Ae,rt,Qt,oe,be+ke,Lt,Ft,mt,bt):U.copyTexSubImage2D(Ae,rt,Qt,oe,Lt,Ft,mt,bt);Z.bindFramebuffer(U.READ_FRAMEBUFFER,null),Z.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else $e?w.isDataTexture||w.isData3DTexture?U.texSubImage3D(Ae,rt,Qt,oe,be,mt,bt,_t,ce,Ut,de.data):N.isCompressedArrayTexture?U.compressedTexSubImage3D(Ae,rt,Qt,oe,be,mt,bt,_t,ce,de.data):U.texSubImage3D(Ae,rt,Qt,oe,be,mt,bt,_t,ce,Ut,de):w.isDataTexture?U.texSubImage2D(U.TEXTURE_2D,rt,Qt,oe,mt,bt,ce,Ut,de.data):w.isCompressedTexture?U.compressedTexSubImage2D(U.TEXTURE_2D,rt,Qt,oe,de.width,de.height,ce,de.data):U.texSubImage2D(U.TEXTURE_2D,rt,Qt,oe,mt,bt,ce,Ut,de);U.pixelStorei(U.UNPACK_ROW_LENGTH,$t),U.pixelStorei(U.UNPACK_IMAGE_HEIGHT,Xe),U.pixelStorei(U.UNPACK_SKIP_PIXELS,Bi),U.pixelStorei(U.UNPACK_SKIP_ROWS,Ye),U.pixelStorei(U.UNPACK_SKIP_IMAGES,ws),rt===0&&N.generateMipmaps&&U.generateMipmap(Ae),Z.unbindTexture()},this.initRenderTarget=function(w){nt.get(w).__webglFramebuffer===void 0&&ut.setupRenderTarget(w)},this.initTexture=function(w){w.isCubeTexture?ut.setTextureCube(w,0):w.isData3DTexture?ut.setTexture3D(w,0):w.isDataArrayTexture||w.isCompressedArrayTexture?ut.setTexture2DArray(w,0):ut.setTexture2D(w,0),Z.unbindTexture()},this.resetState=function(){b=0,T=0,P=null,Z.reset(),pt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return dn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;let e=this.getContext();e.drawingBufferColorSpace=jt._getDrawingBufferColorSpace(t),e.unpackColorSpace=jt._getUnpackColorSpace()}};function vr(i,t=!1){let e=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),r={},o={},a=i[0].morphTargetsRelative,l=new ue,c=0;for(let h=0;h<i.length;++h){let u=i[h],d=0;if(e!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let p in u.attributes){if(!n.has(p))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+p+'" attribute exists among all geometries, or in none of them.'),null;r[p]===void 0&&(r[p]=[]),r[p].push(u.attributes[p]),d++}if(d!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(a!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let p in u.morphAttributes){if(!s.has(p))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;o[p]===void 0&&(o[p]=[]),o[p].push(u.morphAttributes[p])}if(t){let p;if(e)p=u.index.count;else if(u.attributes.position!==void 0)p=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,p,h),c+=p}}if(e){let h=0,u=[];for(let d=0;d<i.length;++d){let p=i[d].index;for(let x=0;x<p.count;++x)u.push(p.getX(x)+h);h+=i[d].attributes.position.count}l.setIndex(u)}for(let h in r){let u=Fu(r[h]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;l.setAttribute(h,u)}for(let h in o){let u=o[h][0].length;if(u===0)break;l.morphAttributes=l.morphAttributes||{},l.morphAttributes[h]=[];for(let d=0;d<u;++d){let p=[];for(let g=0;g<o[h].length;++g)p.push(o[h][g][d]);let x=Fu(p);if(!x)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;l.morphAttributes[h].push(x)}}return l}function Fu(i){let t,e,n,s=-1,r=0;for(let c=0;c<i.length;++c){let h=i[c];if(t===void 0&&(t=h.array.constructor),t!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=h.itemSize),e!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=h.gpuType),s!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.count*e}let o=new t(r),a=new ve(o,e,n),l=0;for(let c=0;c<i.length;++c){let h=i[c];if(h.isInterleavedBufferAttribute){let u=l/e;for(let d=0,p=h.count;d<p;d++)for(let x=0;x<e;x++){let g=h.getComponent(d,x);a.setComponent(d+u,x,g)}}else o.set(h.array,l);l+=h.count*e}return s!==void 0&&(a.gpuType=s),a}function Nu(i,t,e){i.updateMatrixWorld(!0);let n=i.matrixWorld.clone().invert(),s=new Map,r=[],o=new Set,a=0,l=h=>{if(!(e.has(h)||!h.visible)){if(h.isMesh&&!h.isInstancedMesh&&h.name!=="arena-floor"&&!Array.isArray(h.material)){let u=h.material,d=u.userData.surface,p=u.userData.persistent&&d&&d!=="glow",x=u;if(p){let f="batched:"+d;x=t.cache.get(f),x||(x=t.get(d,"#ffffff").clone(),x.vertexColors=!0,x.userData.persistent=!0,x.userData.surface=d,t.cache.set(f,x))}let g=h.geometry.clone().applyMatrix4(new te().multiplyMatrices(n,h.matrixWorld));if(g.index){let f=g.toNonIndexed();g.dispose(),g=f}if(p){let f=g.attributes.position,A=g.attributes.normal,v=new Float32Array(f.count*3),y=u.color,R=new nn().setFromBufferAttribute(f),b=Math.max(.1,R.max.y-R.min.y);for(let T=0;T<f.count;T++){let P=(f.getY(T)-R.min.y)/b,M=d==="glass"?1:.88+.08*Math.min(1,P*3)+.04*Math.max(0,A?.getY(T)||0);v.set([y.r*M,y.g*M,y.b*M],T*3)}g.setAttribute("color",new ve(v,3))}g.attributes.uv||g.setAttribute("uv",new ve(new Float32Array(g.attributes.position.count*2),2)),g.attributes.normal||g.computeVertexNormals();for(let f of Object.keys(g.attributes))["position","normal","uv",...p?["color"]:[]].includes(f)||g.deleteAttribute(f);let m=s.get(x)||[];m.push(g),s.set(x,m),r.push(h),h.geometry.userData.shared||o.add(h.geometry),a++;return}for(let u of[...h.children])l(u)}};for(let h of[...i.children])l(h);for(let h of r)h.removeFromParent();for(let h of o)h.dispose();let c=0;for(let[h,u]of s){let d=vr(u);for(let x of u)x.dispose();if(!d)throw Error("Static geometry layouts differ");let p=new xt(d,h);p.name=h.userData.surface?"architecture-"+h.userData.surface:"world-detail-batch",p.castShadow=!h.transparent&&h.userData.surface!=="glow",p.receiveShadow=!0,i.add(p),c++}i.userData.batching={before:a,after:c,saved:a-c,revision:"world-batch-080"}}var Mr=new Map;function gl(i,t,e,n){for(let s of[-.46,.46])for(let r of[-.46,.46])if(i+s<0||t+r<0||t+r>=e.length||i+s>=e[0].length||e[Math.floor(t+r)][Math.floor(i+s)]!=="0")return!1;return!n.some(s=>["crane","train"].includes(s.kind)&&s.bounds[2]<1.9&&s.bounds[0]-.46<i&&i<s.bounds[3]+.46&&s.bounds[1]-.46<t&&t<s.bounds[4]+.46)}function ml(i,t,e,n){if(gl(i,t,e,n))return[i,t];let s=e.join(""),r=Mr.get(s);r||(r=[],e.forEach((l,c)=>{for(let h=0;h<l.length;h++)l[h]==="0"&&r.push([h+.5,c+.5])}),Mr.set(s,r),Mr.size>8&&Mr.delete(Mr.keys().next().value));let o=[i,t],a=1/0;for(let l of r){let c=(l[0]-i)**2+(l[1]-t)**2;c<a&&gl(...l,e,n)&&(o=l,a=c)}return o.slice()}function Ou(i,t,e,n){let s=null,r=t.map((o,a)=>o-i[a]);if(t[2]<=n&&r[2]<0){let o=Math.max(0,Math.min(1,(n-i[2])/r[2]));s={t:o,normal:[0,0,1],point:i.map((a,l)=>a+r[l]*o),kind:"floor"}}for(let o of e){let a=o.bounds;if(!o.angle&&(Math.max(i[0],t[0])+n<a[0]||Math.min(i[0],t[0])-n>a[3]||Math.max(i[1],t[1])+n<a[1]||Math.min(i[1],t[1])-n>a[4]||Math.max(i[2],t[2])+n<a[2]||Math.min(i[2],t[2])-n>a[5]))continue;let l=i.slice(),c=t.slice(),h=o.angle||0,u=Math.cos(h),d=Math.sin(h),[p,x]=o.pivot||[0,0];h&&(l.splice(0,2,(l[0]-p)*u+(l[1]-x)*d,-(l[0]-p)*d+(l[1]-x)*u),c.splice(0,2,(c[0]-p)*u+(c[1]-x)*d,-(c[0]-p)*d+(c[1]-x)*u));let g=o.bounds.slice(0,3).map(b=>b-n),m=o.bounds.slice(3).map(b=>b+n),f=c.map((b,T)=>b-l[T]),A=-1/0,v=1/0,y=[0,0,0];for(let b=0;b<3;b++)if(Math.abs(f[b])<1e-12){if(l[b]<g[b]||l[b]>m[b]){A=1/0;break}}else{let T=(g[b]-l[b])/f[b],P=(m[b]-l[b])/f[b],M=f[b]>0?-1:1;T>P&&([T,P]=[P,T]),T>A&&(A=T,y=[0,0,0],y[b]=M),v=Math.min(v,P)}if(A>v||v<0||A>1)continue;let R=null;if(A<0){let b=[];for(let M=0;M<3;M++)b.push([l[M]-g[M],M,-1],[m[M]-l[M],M,1]);b.sort((M,_)=>M[0]-_[0]||M[1]-_[1]||M[2]-_[2]);let[,T,P]=b[0];if(y=[0,0,0],y[T]=P,f.reduce((M,_,S)=>M+_*y[S],0)>=-1e-10)continue;R=l.slice(),R[T]=P<0?g[T]:m[T],A=0}s&&A>=s.t||(R||=l.map((b,T)=>b+f[T]*A),h&&(R.splice(0,2,R[0]*u-R[1]*d+p,R[0]*d+R[1]*u+x),y.splice(0,2,y[0]*u-y[1]*d,y[0]*d+y[1]*u)),s={t:Math.max(0,A),normal:y,point:R,kind:o.kind})}return s}function zu(i,t,e,n,s){let r=e==="axe"?.08:.12,o=e==="axe"?12:9.8;if(e==="axe"&&i.ground){[i.x,i.y]=ml(i.x,i.y,s,n);return}if(i.slide){let l=i.slide[0]-i.x,c=i.slide[1]-i.y,h=Math.hypot(l,c),u=Math.min(h,5*t);h>.001&&(i.x+=l/h*u,i.y+=c/h*u),(h<.05||gl(i.x,i.y,s,n))&&delete i.slide,i.vx=i.vy=i.vz=0;return}let a=t;for(let l=0;l<4;l++){let c=[i.x,i.y,i.z],h=[i.x+i.vx*a,i.y+i.vy*a,i.z+i.vz*a-o*a*a/2],u=Ou(c,h,n,r);if(!u){[i.x,i.y,i.z]=h,i.vz-=o*a;return}i.vz-=o*a*u.t;let d=u.normal;if([i.x,i.y,i.z]=u.point.map((p,x)=>p+d[x]*.001),e==="axe"){if(i.vx=i.vy=0,u.kind==="floor"){i.z=r,i.ground=!0,i.vz=0,[i.x,i.y]=ml(i.x,i.y,s,n);return}if(d[2]>.6){i.slide=ml(i.x,i.y,s,n),i.vz=0;return}i.vz=Math.min(0,i.vz)}else{let p=[i.vx,i.vy,i.vz],x=p.reduce((g,m,f)=>g+m*d[f],0);[i.vx,i.vy,i.vz]=p.map((g,m)=>(g-1.4*Math.min(0,x)*d[m])*(d[2]>.6&&m<2?.82:1)),d[2]>.6&&Math.abs(i.vz)<.24&&(i.vz=.24)}if(a*=1-u.t,a<1e-6)return}}function Hu(i,t=i.weapon){let e=t==="axe",n=(e?17:13)*Math.cos(i.pitch||0);return{x:i.x,y:i.y,z:(i.z||0)+(e?i.crouch?.975:1.5:i.crouch?.9:1.35),vx:Math.cos(i.yaw)*n,vy:Math.sin(i.yaw)*n,vz:e?2+17*Math.sin(i.pitch||0):4.2+8*Math.sin(i.pitch||0),ground:!1}}function xl(i,t){let e=i.weapon;if(!["axe","grenade"].includes(e)||i.hp<=0)return[];let n=Hu(i),s=t.projectile_boxes||[],r=t.arena?.grid||t.grid;if(!r?.length)return[];let o=e==="grenade"?Math.max(0,3-(i.cooking&&i.cook_time||0)):6,a=[[n.x,n.y,n.z]],l=Math.ceil(o*120),c=o/Math.max(1,l);for(let h=0;h<l;h++){if(zu(n,c,e,s,r),e==="axe"&&!n.ground&&(t.players||[]).some(u=>u.id!==i.id&&u.hp>0&&Math.hypot(u.x-n.x,u.y-n.y)<.5&&(u.z||0)<n.z&&n.z<(u.z||0)+1.96*(u.crouch?.65:1))){a.push([n.x,n.y,n.z]);break}if((h%4===3||n.ground||h===l-1)&&a.push([n.x,n.y,n.z]),n.ground)break}return a}typeof window<"u"&&(window.CheatThrowPhysics={launch:Hu,predict:xl,advance:zu,sweep:Ou});var Da=class{constructor(t){this.cache=new Map,this.data=null,this.group=new Dt,this.group.name="throw-trajectory",t.add(this.group),this.geometry=new ue,this.array=new Float32Array(672),this.geometry.setAttribute("position",new ve(this.array,3)),this.geometry.setDrawRange(0,0),this.line=new as(this.geometry,new hr({color:"#72e5f1",dashSize:.18,gapSize:.12,transparent:!0,opacity:.85,depthWrite:!1,toneMapped:!1})),this.line.frustumCulled=!1,this.group.add(this.line),this.marker=new xt(new ni(.16,.23,28),new ae({color:"#72e5f1",side:we,depthWrite:!1,transparent:!0,opacity:.9,toneMapped:!1})),this.marker.rotation.x=-Math.PI/2,this.group.add(this.marker),this.group.visible=!1}update(t){let e=(t.code||"menu")+":"+t.round+":"+t.map_id;e!==this.key&&(this.key=e,this.cache.clear(),this.group.visible=!1),this.data=t}view(t,e){if(this.group.visible=!!this.data&&!t.spectating&&t.hp>0&&["axe","grenade"].includes(t.weapon)&&(t.ammo>0||t.cooking||t.weapon!=="axe"&&t.cheats?.ammo),!this.group.visible)return;let n=[t.weapon,t.x,t.y,t.z||0,t.yaw,t.pitch,t.crouch,t.cooking].map(c=>typeof c=="number"?Math.round(c*100)/100:c).join(":"),s=this.cache.get(t.id);(!s||s.signature!==n&&e-s.at>45||e-s.at>100)&&(s={signature:n,at:e,points:xl(t,this.data)},this.cache.set(t.id,s));let r=s.points;if(r.length<2){this.group.visible=!1;return}let o=Math.min(224,r.length);for(let c=0;c<o;c++){let h=r[c];this.array.set([h[0],h[2],h[1]],c*3)}this.geometry.setDrawRange(0,o),this.geometry.attributes.position.needsUpdate=!0,this.line.computeLineDistances();let a=r[r.length-1];this.marker.position.set(a[0],Math.max(.025,a[2]),a[1]),this.marker.scale.setScalar(t.weapon==="grenade"?1.5:1);let l=t.cooking&&3-t.cook_time<1?"#ff7355":t.weapon==="axe"?"#f2c779":"#72e5f1";this.line.material.color.set(l),this.marker.material.color.set(l)}},Ua=class{constructor(t){this.tracks=new Map,this.geometry=new ue,this.array=new Float32Array(4096*3),this.colors=new Float32Array(4096*3),this.geometry.setAttribute("position",new ve(this.array,3)),this.geometry.setAttribute("color",new ve(this.colors,3)),this.geometry.setDrawRange(0,0),this.lines=new Js(this.geometry,new vi({vertexColors:!0,transparent:!0,opacity:.62,depthWrite:!1,toneMapped:!1})),this.lines.frustumCulled=!1,t.add(this.lines)}update(t,e){let n=(t.code||"menu")+":"+(t.round||0)+":"+t.map_id;n!==this.key&&(this.key=n,this.tracks.clear());for(let o of["axes","grenades"])for(let a of t[o]||[]){let l=o+":"+a.id,c=this.tracks.get(l);c||(c={points:[],at:e,kind:o},this.tracks.set(l,c));let h=[a.x,a.z,a.y],u=c.points[c.points.length-1];(!u||Math.hypot(h[0]-u[0],h[1]-u[1],h[2]-u[2])>.035)&&(c.points.push([...h,e]),c.points.length>25&&c.points.shift()),c.at=e}let s=0,r=new Nt;for(let[o,a]of this.tracks){if(e-a.at>350){this.tracks.delete(o);continue}for(;a.points.length&&e-a.points[0][3]>800;)a.points.shift();for(let l=1;l<a.points.length&&s<4094;l++){let c=a.points[l-1],h=a.points[l],u=Math.max(.05,1-(e-c[3])/800);r.set(a.kind==="axes"?"#d5b56c":"#66d5e6").multiplyScalar(u),this.array.set(c.slice(0,3),s*3),this.colors.set(r.toArray(),s++*3),this.array.set(h.slice(0,3),s*3),this.colors.set(r.toArray(),s++*3)}}this.geometry.setDrawRange(0,s),this.geometry.attributes.position.needsUpdate=!0,this.geometry.attributes.color.needsUpdate=!0}};var br="cohesive-080-r1",Pn={freight:{wall:"#8c9997",trim:"#485e62",glass:"#344e59",floor:"#89938d",kind:"paint",urban:!1,roof:"#536568",sky:["#5c829a","#afc5ca","#d6d4bd"],sun:"#ffe9cb",fog:"#b4c6c6",exposure:1.05},foundry:{wall:"#87796b",trim:"#444a47",glass:"#3b4d51",floor:"#787569",kind:"brick",urban:!1,roof:"#575b54",sky:["#777f86","#b0b4ae","#c6baa4"],sun:"#ffdbb8",fog:"#aaa596",exposure:1.02},plaza:{wall:"#b4a68c",trim:"#d1c7ab",glass:"#3d575c",floor:"#aba795",kind:"brick",urban:!0,roof:"#576e68",sky:["#718c9d","#bac8c8","#e6d5b2"],sun:"#ffe5bb",fog:"#c8c7b5",exposure:1.06},glory:{wall:"#bab6a3",trim:"#dbd4bc",glass:"#405e65",floor:"#b1af9f",kind:"stone",urban:!0,roof:"#65736b",sky:["#64879f","#b9ccd0","#e3dbbf"],sun:"#ffedcf",fog:"#c5ccc0",exposure:1.07},railway:{wall:"#978f7a",trim:"#5d6b60",glass:"#3b535b",floor:"#85867b",kind:"brick",urban:!1,roof:"#5c6860",sky:["#6b8694","#b8c7c7","#d7d4bc"],sun:"#ffe9ca",fog:"#bcc6bd",exposure:1.05}};var Er=new I;function on(i,t,e,n,s,r){let o=2*Math.PI*s/4,a=Math.max(r-2*s,0),l=Math.PI/4;Er.copy(t),Er[n]=0,Er.normalize();let c=.5*o/(o+a),h=1-Er.angleTo(i)/l;return Math.sign(Er[e])===1?h*c:a/(o+a)+c+c*(1-h)}var ai=class i extends pe{constructor(t=1,e=1,n=1,s=2,r=.1){let o=s*2+1;if(r=Math.min(t/2,e/2,n/2,r),super(1,1,1,o,o,o),this.type="RoundedBoxGeometry",this.parameters={width:t,height:e,depth:n,segments:s,radius:r},o===1)return;let a=this.toNonIndexed();this.index=null,this.attributes.position=a.attributes.position,this.attributes.normal=a.attributes.normal,this.attributes.uv=a.attributes.uv;let l=new I,c=new I,h=new I(t,e,n).divideScalar(2).subScalar(r),u=this.attributes.position.array,d=this.attributes.normal.array,p=this.attributes.uv.array,x=u.length/6,g=new I,m=.5/o;for(let f=0,A=0;f<u.length;f+=3,A+=2)switch(l.fromArray(u,f),c.copy(l),c.x-=Math.sign(c.x)*m,c.y-=Math.sign(c.y)*m,c.z-=Math.sign(c.z)*m,c.normalize(),u[f+0]=h.x*Math.sign(l.x)+c.x*r,u[f+1]=h.y*Math.sign(l.y)+c.y*r,u[f+2]=h.z*Math.sign(l.z)+c.z*r,d[f+0]=c.x,d[f+1]=c.y,d[f+2]=c.z,Math.floor(f/x)){case 0:g.set(1,0,0),p[A+0]=on(g,c,"z","y",r,n),p[A+1]=1-on(g,c,"y","z",r,e);break;case 1:g.set(-1,0,0),p[A+0]=1-on(g,c,"z","y",r,n),p[A+1]=1-on(g,c,"y","z",r,e);break;case 2:g.set(0,1,0),p[A+0]=1-on(g,c,"x","z",r,t),p[A+1]=on(g,c,"z","x",r,n);break;case 3:g.set(0,-1,0),p[A+0]=1-on(g,c,"x","z",r,t),p[A+1]=1-on(g,c,"z","x",r,n);break;case 4:g.set(0,0,1),p[A+0]=1-on(g,c,"x","y",r,t),p[A+1]=1-on(g,c,"y","x",r,e);break;case 5:g.set(0,0,-1),p[A+0]=on(g,c,"x","y",r,t),p[A+1]=1-on(g,c,"y","x",r,e);break}}static fromJSON(t){return new i(t.width,t.height,t.depth,t.segments,t.radius)}};var Ie=new ai(1,1,1,1,.065),ci=new Mi(.5,1,5,12).scale(1,.5,1);function Es(i){return()=>(i=Math.imul(i,1664525)+1013904223>>>0,i/4294967296)}var La=i=>Math.max(0,Math.min(255,i));function Al(i,t){let e=Es(t),n=Float32Array.from({length:i*i},()=>e());return(s,r)=>{let o=s*i,a=r*i,l=Math.floor(o),c=Math.floor(a);o-=l,a-=c,o=o*o*(3-2*o),a=a*a*(3-2*a);let h=(u,d)=>n[(d+i)%i*i+(u+i)%i];return vn.lerp(vn.lerp(h(l,c),h(l+1,c),o),vn.lerp(h(l,c+1),h(l+1,c+1),o),a)}}function Li(i,t=i){let e=document.createElement("canvas");return e.width=i,e.height=t,e}function xx(i){let e=Li(512),n=e.getContext("2d"),s=n.createImageData(512,512),r=new Float32Array(512*512),o=Al(8,11),a=Al(32,88),l=Al(128,95),c=Es(73);for(let A=0;A<512;A++)for(let v=0;v<512;v++){let y=v/512,R=A/512,b=o(y,R),T=a(y,R),P=l(y,R),M=c()-.5,_=(A*512+v)*4,S=211+(b-.5)*12+(T-.5)*8+M*18,D=.45+T*.008+P*.008,L=0,z=0;if(i==="asphalt")S=153+b*12+M*32,D+=M*.035;else if(i==="brick"){let F=Math.floor(A/48),H=(v+F%2*64)%128,q=H<2||A%48<2;S=q?145:200+(b-.5)*16+(T-.5)*9+M*14,L=q?0:-14,z=q?0:-23,D=q?.42:.46+P*.006}else if(i==="rock")S=170+(b-.5)*64+(T-.5)*35+M*20,D=.45+b*.12+T*.05;else if(i==="stone"){let F=Math.floor(A/128),H=(v+F%2*128)%256,q=H<3||A%128<3;S=q?85:215+(b-.5)*34+(T-.5)*17+M*16,D=q?.12:D}else if(i==="metal"||i==="paint"){let F=i==="paint"?Math.pow((Math.cos(y*Math.PI*32)+1)/2,10):0,H=Math.min(v%128,128-v%128,A%128,128-A%128),q=Math.max(0,(b*.65+T*.35-.7)*3.2)+(H<3?Math.max(0,T-.45)*.6:0);S=220+(b-.5)*13+M*8-F*16-q*26,L=-q*34,z=-q*49,D=.4+T*.02+F*.14,(A%128<2||v%128<2)&&(S-=24,D-=.03)}else if(i==="gunmetal"){let F=Math.sin(A*2.1+v*.035)*2,H=Math.max(0,T-.68)*65;S=219+M*5+(P-.5)*5+F+H,D=.5+M*.002}else if(i==="water"){let F=Math.sin(y*53+Math.sin(R*31))*Math.cos(R*47-y*11);S=203+F*18,D=.5+F*.065}else if(i==="molten"){let F=Math.pow(Math.max(0,b*.65+T*.35-.38),.55);S=255-F*190,L=-F*45,z=-F*75,D=.5+F*.05}else if(i==="fabric"||i==="uniform"){let F=(v%4<2?1:-1)*(A%4<2?1:-1);if(S=212+T*17+F*8+M*10,i==="uniform"){let H=b*.65+T*.35;S-=H<.42?55:H>.57?24:0,L+=H<.42?-3:3,z-=H>.57?12:0}D=.45+F*.025}else i==="skin"?(S=238+T*10+M*5,D=.5+P*.01):i==="rubber"&&(S=170+T*20+M*12,D=.5+P*.03);(i==="concrete"||i==="asphalt")&&(Math.abs(Math.sin(y*27+Math.sin(R*18)*1.5)+Math.sin(R*31)*.25)<.008&&b<.6&&(S-=30,D-=.025),b<.22&&(S-=7)),s.data[_]=La(S),s.data[_+1]=La(S+L),s.data[_+2]=La(S+z),s.data[_+3]=255,r[A*512+v]=D}n.putImageData(s,0,0);let h=Li(512),u=h.getContext("2d"),d=u.createImageData(512,512),p=Li(512),x=p.getContext("2d"),g=x.createImageData(512,512),m=(A,v)=>r[(v+512)%512*512+(A+512)%512];for(let A=0;A<512;A++)for(let v=0;v<512;v++){let y=(A*512+v)*4,R=(m(v-1,A)-m(v+1,A))*2,b=(m(v,A-1)-m(v,A+1))*2,T=Math.hypot(R,b,1);d.data[y]=(R/T*.5+.5)*255,d.data[y+1]=(b/T*.5+.5)*255,d.data[y+2]=(1/T*.5+.5)*255,d.data[y+3]=255;let P=(i==="water"?65:i==="molten"?100:i==="gunmetal"||i==="metal"?145:i==="paint"?185:i==="skin"?195:235)+(m(v,A)-.5)*90;g.data[y]=g.data[y+1]=g.data[y+2]=La(P),g.data[y+3]=255}u.putImageData(d,0,0),x.putImageData(g,0,0);let f=(A,v=!1)=>{let y=new Ue(A);return y.wrapS=y.wrapT=zn,v&&(y.colorSpace=ie),y};return{map:f(e,!0),normalMap:f(h),roughnessMap:f(p)}}var Ba=class{constructor(t){this.cache=new Map,this.textures=new Map,this.anisotropy=Math.min(8,t.capabilities.getMaxAnisotropy()),this.currentQuality=4}get(t,e="#ffffff"){let n=t+e;if(this.cache.has(n))return this.cache.get(n);let s;if(t==="glow")s=new ae({color:e,toneMapped:!1});else if(t==="glass")s=new Ei({color:e,metalness:.25,roughness:.19,clearcoat:.8,envMapIntensity:.65});else{if(!this.textures.has(t)){let r=xx(t);for(let o of Object.values(r))o.anisotropy=this.currentQuality===6?1:this.currentQuality===4?Math.min(4,this.anisotropy):this.anisotropy;this.textures.set(t,r)}s=new xe({...this.textures.get(t),color:e,metalness:t==="water"?.25:t==="molten"?.45:t==="metal"||t==="gunmetal"?.68:t==="paint"?.22:0,roughness:t==="water"?.4:1,normalScale:new ot(t==="skin"?.15:t==="water"?1.1:.7,t==="skin"?.15:t==="water"?1.1:.7),envMapIntensity:["metal","gunmetal","water"].includes(t)?.85:.3}),t==="molten"&&(s.emissive.set(e),s.emissiveMap=this.textures.get(t).map,s.emissiveIntensity=1.3)}return s.userData.persistent=!0,s.userData.surface=t,this.cache.set(n,s),s}quality(t){this.currentQuality=t;for(let e of this.textures.values())for(let n of Object.values(e))n.anisotropy=t===6?1:t===4?Math.min(4,this.anisotropy):this.anisotropy}};function yl(i){let t=Li(1024,512),e=t.getContext("2d"),n=i==="observatory",s=Pn[i]?.sky||["#6a8496","#b7c8cd","#dfccaa"],r=e.createLinearGradient(0,0,0,512);r.addColorStop(0,n?"#102037":s[0]),r.addColorStop(.43,n?"#526987":s[1]),r.addColorStop(.55,n?"#ad9b92":s[2]),r.addColorStop(1,"#747f76"),e.fillStyle=r,e.fillRect(0,0,1024,512);let o=Es(11);for(let l=0;l<100;l++){let c=o()*1024,h=80+o()*140,u=20+o()*110,d=5+o()*12;e.save(),e.translate(c,h),e.scale(1,d/u);let p=e.createRadialGradient(0,0,1,0,0,u);p.addColorStop(0,n?"rgba(183,175,167,.12)":"rgba(246,239,223,.17)"),p.addColorStop(1,"rgba(230,228,216,0)"),e.fillStyle=p,e.fillRect(-u,-u,u*2,u*2),e.restore()}if(n){e.fillStyle="#e8eee8";for(let l=0;l<90;l++)e.globalAlpha=o()*.6,e.fillRect(o()*1024,o()*150,1,1);e.globalAlpha=1}let a=new Ue(t);return a.mapping=fs,a.colorSpace=ie,a}function vl(){let i=Li(128),t=i.getContext("2d"),e=t.createRadialGradient(64,64,8,64,64,62);return e.addColorStop(0,"rgba(8,14,11,.6)"),e.addColorStop(.55,"rgba(8,14,11,.27)"),e.addColorStop(1,"rgba(8,14,11,0)"),t.fillStyle=e,t.fillRect(0,0,128,128),new Ue(i)}function _l(i,t,e,n,s,r,o=0,a=1.5,l=!1){let c=Li(512,256),h=c.getContext("2d"),u=Es(112);h.fillStyle=l?"#c4a25c":"#c6c3ad",h.fillRect(0,0,512,256),h.strokeStyle="#38433b",h.lineWidth=8,h.strokeRect(10,10,492,236),h.fillStyle="#344039",h.textAlign="center",h.font="bold 54px sans-serif",h.fillText(t,256,112,460),h.font="22px sans-serif",h.fillText(e,256,172,460);for(let x=0;x<1600;x++)h.fillStyle=`rgba(50,43,25,${u()*.17})`,h.fillRect(u()*512,u()*256,1+u()*7,1+u()*3);let d=new Ue(c);d.colorSpace=ie;let p=new xt(new me(a,a*.5),new xe({map:d,roughness:.9,side:we}));p.position.set(n,s,r),p.rotation.y=o,i.add(p)}var bs=class{constructor(t,e){this.root=t,this.surfaces=e,this.groups=new Map,this.count=0}add(t,e,n,s,r,o,a){let l=new te,c=new mn;a&&c.setFromEuler(new Ze(...a)),l.compose(new I(s,r,o),c,new I(1,1,1)),t.applyMatrix4(l);let h=this.surfaces.get(e,n),u=this.groups.get(h)||[];u.push(t),this.groups.set(h,u),this.count++}box(t,e,n,s,r,o,a="concrete",l="#adae9e",c=null){let h=new pe(s,r,o),u=h.attributes.uv;for(let d=0;d<u.count;d++){let p=Math.floor(d/4);u.setXY(d,u.getX(d)*(p<2?o:s)/2,u.getY(d)*(p<4?r:o)/2)}this.add(h,a,l,t,e,n,c)}tube(t,e,n,s,r,o="metal",a="#87968a",l=null){this.add(new Zt(s,s,r,12),o,a,t,e,n,l)}beveled(t,e,n,s,r,o,a="concrete",l="#adae9e"){let c=new ai(s,r,o,2,Math.min(.065,Math.min(s,r,o)*.07));this.add(c,a,l,t,e,n)}finish(){for(let[t,e]of this.groups){let n=new xt(vr(e),t);n.castShadow=t.userData.surface!=="glow",n.receiveShadow=!0,n.name="architecture-"+t.userData.surface,this.root.add(n);for(let s of e)s.dispose()}this.root.userData.detailParts=this.count}};function ku(i,t){let e=new Set,n=[],s=i[0].length,r=(o,a)=>i[a]?.[o]==="1"&&!e.has(a*s+o)&&t(o,a);for(let o=0;o<i.length;o++)for(let a=0;a<s;a++)if(r(a,o)){let l=1,c=1;for(;r(a+l,o);)l++;for(;o+c<i.length&&Array.from({length:l},(h,u)=>r(a+u,o+c)).every(Boolean);)c++;for(let h=o;h<o+c;h++)for(let u=a;u<a+l;u++)e.add(h*s+u);n.push({x:a,y:o,w:l,d:c})}return n}function Ax(i,t,e,n){let s=Li(2048,1024),r=s.getContext("2d"),o=Es(101),a=2048/t,l=1024/e;for(let u=0;u<450;u++){let d=o()*2048,p=o()*1024,x=2+o()*35;r.globalAlpha=.02+o()*.045,r.fillStyle="#202a21",r.beginPath(),r.ellipse(d,p,x,x*.4,0,0,Math.PI*2),r.fill()}r.globalAlpha=.43,r.strokeStyle="#cdbb76",r.lineWidth=3,r.setLineDash([12,8]);for(let u of[5.5,t-5.5])r.beginPath(),r.moveTo(u*a,2*l),r.lineTo(u*a,(e-2)*l),r.stroke();r.setLineDash([]),r.font="bold 44px sans-serif",r.fillStyle="#cac3a4",r.textAlign="center";for(let[u,d]of[[5.5,"01"],[t-5.5,"02"]])for(let p of[9.5,17.5,25.5])r.save(),r.translate(u*a,p*l),r.rotate(Math.PI/2),r.fillText(d,0,0),r.restore();if(n==="railway"){r.strokeStyle="#d3aa54",r.lineWidth=5;for(let u of[14.9,20.1])r.beginPath(),r.moveTo(0,u*l),r.lineTo(2048,u*l),r.stroke()}r.globalCompositeOperation="destination-out",r.globalAlpha=.4;for(let u=0;u<6500;u++)r.fillRect(o()*2048,o()*1024,1+o()*4,1+o()*2);let c=new Ue(s);c.colorSpace=ie;let h=new xt(new me(t,e),new ae({map:c,transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-1}));h.rotation.x=-Math.PI/2,h.position.set(t/2,.007,e/2),i.add(h)}function Gu(i,t,e,n){let s=t[0].length,r=t.length,o=e.id,a=new bs(i,n),l=Es(21),c=e.landmark_bounds,h=new me(s,r),u=h.attributes.uv;for(let f=0;f<u.count;f++)u.setXY(f,u.getX(f)*s/4,u.getY(f)*r/4);let d=new xt(h,n.get(["plaza","glory"].includes(o)?"stone":o==="railway"?"asphalt":"concrete",Pn[o]?.floor||"#a3afb3"));d.rotation.x=-Math.PI/2,d.position.set(s/2,-.015,r/2),d.receiveShadow=!0,d.name="arena-floor",i.add(d);let p=(f,A)=>f===0||A===0||f===s-1||A===r-1;for(let f of ku(t,p)){let A=f.x+f.w/2,v=f.y+f.d/2;a.box(A,1.9,v,f.w,3.8,f.d),a.box(A,.24,v,f.w+.03,.48,f.d+.03,"concrete","#6e7d71"),a.box(A,3.78,v,f.w+.08,.17,f.d+.08,"metal","#819184")}let x=(f,A)=>c&&f>=c[0]&&A>=c[1]&&f<c[0]+c[2]&&A<c[1]+c[3],g=ku(t,(f,A)=>!p(f,A)&&!(x(f,A)&&o!=="freight")),m=new ae({map:vl(),transparent:!0,depthWrite:!1,opacity:.7});for(let f=0;f<g.length;f++){let A=g[f],v=A.x+A.w/2,y=A.y+A.d/2,R=o==="freight"||o==="railway",b=o==="observatory",T=R?(o==="freight"?["#627d82","#aaa084","#896e58","#6e806b"]:["#697c78","#a69d86","#8e7e67","#7f8a77"])[f%4]:o==="plaza"?"#baac8f":o==="glory"?"#b7b09a":b?"#b4c0c1":"#95958a";if(a.beveled(v,1.3,y,A.w,2.6,A.d,R?"paint":b?"metal":o==="plaza"?"stone":"concrete",T),a.box(v,.09,y,A.w+.035,.18,A.d+.035,"concrete","#667466"),a.box(v,2.58,y,A.w+.045,.13,A.d+.045,"metal","#849181"),R){for(let M of[A.x+.08,A.x+A.w-.08])for(let _ of[A.y+.08,A.y+A.d-.08])a.box(M,1.35,_,.13,2.5,.13,"metal","#8b9c8c");for(let M of[y-.28,y+.28])a.tube(A.x+.017,1.3,M,.027,2.15),a.box(A.x-.013,1.22,M,.045,.09,.22,"metal","#c9c3a0");A.w>=3&&_l(i,"C-"+String(f+1).padStart(2,"0"),"GROSS WT 24 000 KG",v,1.8,A.y-.012,Math.PI,1.1)}else if(b||o==="foundry"){a.box(v,1.6,A.y-.02,Math.min(A.w-.2,1.6),.7,.045,"metal","#52666c");for(let M=0;M<7;M++)a.box(v,1.35+M*.08,A.y-.05,Math.min(A.w-.3,1.45),.023,.035,"metal","#9cac9b");A.w>=3&&_l(i,b?"RESEARCH":"CAUTION",b?"AUTHORIZED PERSONNEL":"HIGH VOLTAGE",v,.65,A.y-.013,Math.PI,1.1,!b)}else a.box(v,.3,y,A.w+.06,.19,A.d+.06,"stone","#c9bea1"),a.box(v,2.42,y,A.w+.09,.2,A.d+.09,"stone","#c9bea1");let P=new xt(new me(A.w+2,A.d+2),m);P.rotation.x=-Math.PI/2,P.position.set(v,.002,y),i.add(P)}for(let f=3;f<s-2;f+=6)for(let A of[.5,r-.5])a.box(f,2,A,.32,4,.42,"concrete","#979d8f"),a.tube(f+.22,2.9,A,.055,1.6),a.box(f,3.15,A>.5?r-1.025:1.025,.8,.22,.18,"metal","#3e5052"),a.box(f,3.13,A>.5?r-1.13:1.13,.62,.075,.025,"glow","#e9d9a8");for(let f of[.35,r-.35])a.tube(s/2,3.35,f,.065,s-3,"metal","#a08f71",[0,0,Math.PI/2]),a.tube(s/2,2.93,f,.035,s-3,"metal","#7e9183",[0,0,Math.PI/2]);for(let[f,A]of[[1.02,0],[r-1.02,Math.PI]])_l(i,o.toUpperCase(),"SECTOR  /  60 x 35 M",s/2,2.15,f,A,4.5);for(let f of[-3,r+3]){let A=[];for(let v=0;v<=24;v++)A.push(new I(-2+v*(s+4)/24,10-Math.sin(v/24*Math.PI)*2,f));i.add(new xt(new Tn(new xn(A),32,.018,4),n.get("rubber","#38443b")))}return Ax(i,s,r,o),a.finish(),i.userData.coverFootprints=g,i.userData.graphicsRevision=br,d}function Mn(i,t=new Set){let e=new Map;for(let n of[...i.children]){if(t.has(n))continue;if(n.isGroup){Mn(n,t);continue}if(!n.isMesh||t.has(n)||n.material.transparent)continue;n.updateMatrix();let s=n.geometry.clone().applyMatrix4(n.matrix),r=(s.index?"indexed:":"plain:")+Object.keys(s.attributes).sort().join(","),o=e.get(n.material);o||(o=new Map,e.set(n.material,o));let a=o.get(r)||[];a.push(s),o.set(r,a),i.remove(n),n.geometry.userData.shared||n.geometry.dispose()}for(let[n,s]of e)for(let r of s.values()){let o=new xt(vr(r),n);o.castShadow=o.receiveShadow=!0,i.add(o);for(let a of r)a.dispose()}}var Vu=vn.lerp,Xu=vn.clamp;function bl(i){return new lr(i.map(([t,e])=>new ot(t,e)),32)}var El=bl([[.045,-.045],[.075,-.025],[.098,.035],[.104,.12],[.091,.185],[.055,.218],[0,.23]]).scale(1,1,.89),Ml=El.attributes.position;for(let i=0;i<Ml.count;i++)Ml.getZ(i)>.08&&Ml.setZ(i,.08);El.computeVertexNormals();var Sr={head:El,helmetBand:new Te(1,.065,6,32),torso:bl([[.28,-.5],[.42,-.44],[.47,-.2],[.5,.2],[.45,.41],[.31,.5]]).scale(1,1,.62),limb:bl([[.22,-.5],[.36,-.46],[.43,-.15],[.5,.3],[.4,.48],[.25,.5]])};for(let i of Object.values(Sr))i.userData.shared=!0;var an=(i=0,t=0,e=0)=>new I(i,t,e);function Wu(i,t,e,n,s){let r=t.clone().sub(i),o=Xu(r.length(),.002,e+n-.001);r.normalize();let a=s.clone().sub(r.clone().multiplyScalar(s.dot(r))).normalize(),l=(e*e-n*n+o*o)/(2*o);return i.clone().addScaledVector(r,l).addScaledVector(a,Math.sqrt(Math.max(0,e*e-l*l)))}function Fa(i,t,e){i.position.copy(t).add(e).multiplyScalar(.5),i.quaternion.setFromUnitVectors(an(0,1,0),e.clone().sub(t).normalize()),i.scale.y=t.distanceTo(e)}function Na(i,t,e){let n=new Dt,s=[],r=i.team?"#ed785f":"#58c4ea",o=i.skin==="glowsquid"?"#315765":i.skin==="guard"?"#686d57":"#667369",a="#263338",l=i.skin==="guard"?"#35414a":i.skin==="glowsquid"?"#234b54":"#394f54",c=i.skin==="guard"?"#9c7058":i.skin==="glowsquid"?"#d7ad91":"#bf967c",h=(A,v,y,R,b,T,P,M,_,S)=>{let D=t(A,v,y,R,b,T,P,M,_,s);return S&&(s.at(-1).surface=S==="fabric"&&y===o?"uniform":S),D},u=e(n,0,.95,0),d=e(u,0,.64,0),p=[],x=[];n.userData.detailStandard="cohesive-080-r1",h(u,"torso",o,0,.26,0,.48,.5,.44,"fabric"),h(u,"sphere",o,0,-.02,0,.225,.14,.14,"fabric"),h(u,"torso",l,0,.28,.065,.43,.38,.4,"fabric"),h(u,"box","#263338",0,.01,0,.45,.065,.31,"rubber"),h(u,"box","#8b9487",0,.01,.17,.075,.05,.018,"metal"),h(u,"box","#465244",0,.29,-.16,.33,.35,.1,"fabric");for(let A of[-1,1]){h(u,"box",o,A*.17,.32,.155,.045,.4,.033,"fabric");for(let v=0;v<4;v++)h(u,"box","#88947a",A*.14,.15+v*.058,.19,.14,.013,.012,"fabric");h(u,"box",r,A*.205,.47,.04,.014,.065,.13,"fabric"),h(u,"box","#59695b",A*.11,.1,.22,.12,.17,.065,"fabric"),h(u,"box","#5e6b58",A*.228,.06,-.05,.075,.17,.12,"fabric");for(let v=0;v<5;v++)h(u,"box","#8b967c",A*.171,.2+v*.043,.176,.014,.005,.008,"fabric")}h(u,"box","#263338",-.14,.39,.19,.07,.12,.055,"rubber"),h(u,"cylinder","#263338",-.14,.49,.19,.008,.14,.008,"rubber"),h(u,"capsule",c,0,.54,0,.105,.13,.11,"skin"),h(d,"head",c,0,0,.008,1,1,1,"skin"),h(d,"capsule",c,0,.065,.1,.023,.048,.032,"skin");for(let A of[-1,1])h(d,"sphere","#d4d6c7",A*.039,.104,.094,.014,.009,.006,"skin"),h(d,"sphere","#222e29",A*.039,.104,.101,.005,.006,.003,"rubber");h(d,"box","#996e5d",0,.009,.091,.042,.005,.006,"skin");for(let A of[-1,1])h(d,"sphere",c,A*.103,.07,.006,.018,.033,.021,"skin"),h(d,"box","#886d58",A*.039,.104,.09,.027,.007,.006,"skin"),h(d,"sphere","#263338",A*.039,.104,.094,.005,.004,.003,"rubber"),h(d,"box","#695446",A*.039,.12,.091,.034,.007,.006,"fabric"),h(d,"capsule","#3e4941",A*.101,.017,.073,.016,.16,.016,"fabric").rotation.z=A*.35,h(d,"box","#1c2a30",A*.143,.083,0,.04,.102,.075,"rubber"),h(d,"box",l,A*.145,.19,-.005,.028,.07,.075,"metal");h(d,"sphere",o,0,.197,-.018,.146,.099,.137,"fabric");let g=h(d,"helmetBand","#ff332c",0,.19,-.018,.148,.136,.145,"rubber");g.rotation.x=Math.PI/2,s.at(-1).enemyBand=!0,h(d,"box",l,0,.205,.078,.245,.036,.105,"metal"),h(d,"box","#b6baa2",0,.27,.014,.035,.018,.05,"metal"),h(d,"box","#527b80",0,.15,.12,.2,.035,.018,"glass"),i.skin==="glowsquid"&&h(d,"sphere",o,0,-.018,.03,.108,.073,.105,"fabric");for(let A of[-1,1]){let v=h(n,"limb",o,0,0,0,.19,1,.2,"fabric"),y=h(n,"limb",o,0,0,0,.15,1,.16,"fabric"),R=h(n,"box",l,0,0,0,.15,.14,.055,"rubber"),b=e(n,0,0,0);h(b,"box","#1c2a30",0,.035,.05,.18,.12,.3,"rubber"),h(b,"box","#596155",0,-.025,.05,.183,.025,.31,"rubber"),h(b,"capsule","#1c2a30",0,.11,-.01,.14,.15,.15,"rubber");for(let _ of[-1,1])for(let S=0;S<5;S++)h(b,"box","#3b493e",_*.09,-.012,-.04+S*.055,.012,.02,.019,"rubber");for(let _=0;_<3;_++)h(b,"box","#7c816d",0,.105-_*.018,.1,.09,.009,.012,"fabric");p.push({side:A,thigh:v,shin:y,knee:R,boot:b});let T=h(u,"limb",o,0,0,0,.16,1,.17,"fabric"),P=h(u,"limb",o,0,0,0,.125,1,.135,"fabric"),M=e(u,0,0,0);h(M,"sphere","#39493e",0,0,0,.064,.045,.085,"fabric");for(let _=0;_<4;_++)h(M,"box","#50604c",-.039+_*.026,.031,.008,.018,.011,.036,"rubber");h(M,"box","#89917a",0,.025,-.054,.073,.009,.012,"fabric");for(let _=0;_<4;_++)h(M,"capsule","#39493e",-.039+_*.026,-.035,.02,.022,.065,.029,"fabric");h(M,"capsule","#39493e",A*.063,-.012,.035,.026,.06,.032,"fabric").rotation.z=A*.6,x.push({side:A,upper:T,lower:P,hand:M}),h(u,"sphere",o,A*.237,.43,0,.115,.105,.115,"fabric")}let m=e(u,.14,.39,.24),f={};for(let A of["axe","pistol","rifle","shotgun","grenade"]){let v=s.length,y=e(m,0,0,0),R=(b,T,P)=>{let M=h(y,"cylinder","#323d41",0,.03,b,P,T,P,"metal");M.rotation.x=Math.PI/2};if(A==="axe")h(y,"cylinder","#765c3e",0,.02,.18,.023,.62,.023,"fabric"),h(y,"box","#8c9993",.08,.27,.18,.26,.17,.055,"metal"),h(y,"box","#bbc0ac",.21,.25,.18,.035,.21,.06,"metal"),h(y,"box",a,-.09,.27,.18,.1,.055,.055,"metal");else if(A==="grenade"){h(y,"sphere","#4b5f42",0,.03,.17,.075,.1,.068,"metal");for(let b=0;b<4;b++)h(y,"box","#35482d",0,-.025+b*.035,.23,.1,.015,.012,"metal");h(y,"box","#8b9690",.04,.08,.17,.016,.14,.035,"metal"),h(y,"box","#b1bba1",0,.14,.17,.03,.025,.03,"metal")}else if(A==="pistol")h(y,"box",a,0,.015,.12,.055,.065,.22,"metal"),h(y,"box",a,0,-.065,.055,.048,.12,.065,"rubber").rotation.x=.16,R(.235,.035,.017);else{h(y,"box",a,0,0,.1,.09,.11,.3,"metal"),h(y,"box",o,0,-.015,-.1,.08,.12,.18,"rubber"),h(y,"box",a,0,-.105,.04,.06,.15,.08,"rubber"),A==="rifle"&&h(y,"box",a,0,-.12,.16,.07,.17,.1,"metal"),R(.45,A==="shotgun"?.49:.42,A==="shotgun"?.026:.019),h(y,"box",A==="shotgun"?"#6e6452":o,0,.01,.3,.08,.085,.18,"rubber");for(let b=0;b<5;b++)h(y,"box",a,0,.07,.1+b*.04,.075,.012,.02,"metal")}["axe","grenade"].includes(A)||h(y,"box","#96ac91",0,.07,.2,.014,.022,.02,"metal");for(let b of s.slice(v))b.weapon=A,b.surface==="metal"&&(b.surface="gunmetal");f[A]=y}if(i.skin==="guard"){for(let A of[-1,1])h(u,"sphere","#46525c",A*.27,.43,0,.13,.12,.16,"metal"),h(u,"box","#6a757b",A*.19,.22,.2,.13,.25,.05,"metal");h(d,"box","#526677",0,.075,.117,.21,.11,.022,"glass"),h(u,"torso","#53616a",0,.27,.11,.48,.4,.36,"metal"),n.scale.set(1.14,1.03,1.12)}else if(i.skin==="glowsquid"){h(u,"box","#235966",0,.28,-.22,.29,.36,.12,"metal");for(let A of[-1,1])h(u,"cylinder","#53e1de",A*.16,.29,-.24,.045,.35,.045,"glow"),h(u,"box","#58dddd",A*.14,.35,.215,.025,.24,.018,"glow"),h(d,"sphere","#71ede2",A*.046,.103,.105,.033,.028,.015,"glow");h(d,"capsule","#243f48",0,.025,.12,.1,.07,.08,"rubber"),n.scale.set(.96,1,1)}else h(d,"box","#263b39",0,.2,.19,.23,.025,.17,"fabric"),h(u,"capsule","#4b5849",.19,.2,-.21,.08,.32,.08,"fabric"),n.scale.set(.91,.98,.94);return{root:n,body:u,head:d,legs:p,arms:x,gun:m,records:s,gunRecords:f,phase:0,lastX:i.x,lastY:i.y,skin:i.skin,team:i.team,weapon:"rifle",speed:0,dead:0,lastHp:i.hp,lastShots:i.shots||0,shotTime:-1e4,hurtTime:-1e4}}function Oa(i,t,e,n){let s=Math.hypot(t.x-i.lastX,t.y-i.lastY);i.lastX=t.x,i.lastY=t.y,s<2&&(i.phase+=s*2.5),t.shots>i.lastShots&&(i.shotTime=n),i.lastShots=t.shots,t.hp<i.lastHp&&(i.hurtTime=n),t.hp<=0&&i.lastHp>0&&(i.dead=n),t.hp>0&&(i.dead=0),i.lastHp=t.hp,i.blood_seq=t.blood_seq||0,i.shield_seq=t.shield_seq||0,i.weapon=t.weapon||"rifle",i.shotWeapon=t.shot_weapon||i.weapon,i.root.position.set(t.x,t.z||0,t.y),i.baseScaleY||(i.baseScaleY=i.root.scale.y),i.root.scale.y=Vu(i.root.scale.y,i.baseScaleY*(t.crouch?.65:1),1-Math.exp(-24*e)),i.root.rotation.set(0,Math.PI/2-t.yaw,0);let r=1-Math.exp(-e*14);i.speed=Vu(i.speed,Math.min(1,Math.hypot(t.vx||0,t.vy||0)/7.2),r);let o=((t.vx||0)*Math.cos(t.yaw)+(t.vy||0)*Math.sin(t.yaw))/7.2,a=(-(t.vx||0)*Math.sin(t.yaw)+(t.vy||0)*Math.cos(t.yaw))/7.2,l=Math.max(0,1-(n-i.hurtTime)/220),c=Math.max(0,1-(n-i.shotTime)/160);i.body.position.y=.95-i.speed*.06+Math.cos(i.phase*2)*.012*i.speed,i.body.rotation.set(-o*.07-(t.pitch||0)*.16+c*.025,Math.sin(i.phase)*i.speed*.025,-a*.055-l*.04),i.head.rotation.x=-(t.pitch||0)*.7,i.head.rotation.y=-i.body.rotation.y;let h=t.weapon==="shotgun"?.7:t.weapon==="pistol"?1.25:1.5,u=t.reload>0?Math.sin((1-t.reload/h)*Math.PI):0;i.gun.rotation.x=-(t.pitch||0)*.65+u*.55-c*.05,i.gun.rotation.z=-u*.28-(t.weapon==="axe"?c*.8:0),t.weapon==="axe"&&(i.gun.rotation.x+=c*1.2),t.weapon==="grenade"&&(i.gun.rotation.x-=c*1.2),i.gun.position.z=.24-c*.025;for(let{side:d,thigh:p,shin:x,knee:g,boot:m}of i.legs){let f=i.phase+(d>0?Math.PI:0),A=Math.sin(f),v=Math.max(0,Math.cos(f))*.105*i.speed,y=an(d*.145-A*a*.22,.038+v,A*o*.38),R=an(d*.135,.92-i.speed*.06,0),b=y.clone().add(an(0,.015,-.015)),T=Wu(R,b,.455,.455,an(0,0,1));Fa(p,R,T),Fa(x,T,b),g.position.copy(T).add(an(0,0,.073)),m.position.copy(y),m.rotation.x=-Math.max(0,A)*.14*i.speed}for(let{side:d,upper:p,lower:x,hand:g}of i.arms){let m=an(d*.235,.425,.005),f=t.weapon==="pistol"?an(.14+d*.027,.32,.3):d>0?an(.14,.3,.28):an(.14,.395,.54);d<0&&u>0&&f.set(-.08,.04-u*.16,.34),t.weapon==="axe"&&f.set(d>0?.14:.06,d>0?.25:.4,.34),t.weapon==="grenade"&&f.set(d>0?.14:-.17,d>0?.32:.18,d>0?.3:.1);let A=an(.14,.39,.24);f.sub(A).applyEuler(i.gun.rotation).add(A);let v=f.clone().sub(m);v.length()>.609&&f.copy(m).add(v.setLength(.609));let y=Wu(m,f,.31,.3,an(d*.8,-.5,-.4));Fa(p,m,y),Fa(x,y,f),g.position.copy(f),g.rotation.set(-.5,i.gun.rotation.x,d*.15)}if(i.dead){let d=Xu((n-i.dead)/550,0,1);i.root.position.y=.24*d,i.root.rotation.z=d*Math.PI/2,i.body.rotation.x=.12}i.root.updateMatrixWorld(!0),i.hp=t.hp}var Yu='url(data:font/truetype;base64,AAEAAAASAQAABAAgQkFTRTuNWBIAAARsAAAA6kdQT1NEdEx1AAABPAAAAB5HU1VCmROFGgAACKgAAAKMT1MvMpNP5hQAAAJIAAAAYFNUQVR5nmqBAAAB5AAAACpjbWFwKHPkFwAABVgAAADsZ2FzcAAAABAAAAE0AAAACGdseWZCrSUBAAALNAAAEpZoZWFkItsf5QAAAhAAAAA2aGhlYQwLCJkAAAGcAAAAJGhtdHixQg8jAAADkAAAANpsb2Nhg+N/dQAAAqgAAABybWF4cAB2AeAAAAFcAAAAIG5hbWUxsFFOAAAGRAAAAmRwb3N0/4YAMgAAAXwAAAAgcHJlcGgGjIUAAAEsAAAAB3ZoZWEMhxcUAAABwAAAACR2bXR4FiEMmgAAAxwAAAByuAH/hbAEjQAAAQAB//8ADwABAAAACgAcABwAAURGTFQACAAEAAAAAP//AAAAAAAAAAEAAAA4Ad8APQAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAwAAAAAAAP+DADIAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAEiP7gAAALuPwR/csLbwABAAAAAAAAAAAAAAAAAAAANQABEAAB9P4MAAALuP8g/U8LbwAAAAEAAAAAAAAAAAAAAAAAAQABAAEACAABAAAAFAABAAAAHAACd2dodAEBAAAAAgABAAAAAAEOAfQAAAAAAAEAAAACAQZZlerjXw889QADA+gAAAAA3LAjLgAAAADfkrfW/BH76QtvBw8AAAAGAAIAAAAAAAAABAOzAfQABQAAAooCWAAAAEsCigJYAAABXgAyAUUAAAILAgAAAAAAAAAwAACDK988EAAAABYAAAAAQURCTwBAACDXUANw/4gAAASIASBgLgEHAAAAAAIfAt0AAAAgAAYAAAArACsAQABVAIUAqADaAPQBBwEUAUEBggGkAdkCMgJmApQCsQLaAv0DGQNYA5EDyQQDBDcEZAS2BQEFRwVqBWoFgAWVBb0F4gYgBkoGjAatBuYHPAdRB2UHjQewB+IICghICGgInAjuCQgJGwkoCUsAAAPoAAADcAB4AHkAVQB6AFMAMQAwAd8AgAB0AIEAdABkADAAMACBADAAMAB9ADAAMABrADEAMQCIADAAMQA/ADEDcACWAJYAjQCXAFwAkQCMAJUAjQB3AHAAcABiAHAASQB2AG8AdgBvAFwAMAAwAvwAMAAAA+gAZADhAAADmACRA5gAkgOYAFMDmAB4A5gAVwOYAksDmAJnA5gALgOYAJMDmACTA5gAkwOYAJMDmACNA5gATAOYAFsDmAAuA5gATAOYAFEDmAAuA5gAIAOYACgDmAAuA5gAMQOYACsDmAAuA5gALQOYAC4DmAAuA5gAMgEYAAADmABjA5gAYwOYACsDmABQA5gARwOYAFEDmABSA5gATwOYAE8DmAA/A5gAbAOYAHEDmAA1A5gATwOYAF0DmABFA5gARQOYAEUDmABFA5gAQAAA/rb+uvyW/I0AAAABAAEAcAAMAAAAAADMAAQAB0RGTFQAPmN5cmwALGdyZWsALGhhbmcAPmhhbmkAPmthbmEAPmxhdG4ALAAGAAAAAAADAAQAKAAiAIIAHgAGAAAAAAACAAQAFgAQAHAADAABAHgAAwPCAAAAAwAmAAAAaAAEAAdERkxUAD5jeXJsACxncmVrACxoYW5nAD5oYW5pAD5rYW5hAD5sYXRuACwABgAAAAAAAwAEACwAJgAiAB4ABgAAAAAAAgAEABoAFAAQAAwAAQAAAAH/iAADA0oAAAAD/64AAAAEaWNmYmljZnRpZGVvcm9tbgAAAAAAAgAAAAMAAAAUAAMAAQAAABQABADYAAAAMgAgAAQAEgAgEQMRBhEJEQ8REhFiEWURc7MAs1S03Lnkuji7wMDIwRzCpM6QzuTQbNV01cjXUP//AAAAIBEDEQYRCREPERIRYhFlEXOzALNUtNy55Lo4u8DAyMEcwqTOkM7k0GzVdNXI11D////h7v/u/e777vbu9O6l7qPulk0PTLxLNUYuRdtEVD9NPvo9czGIMTUvriqnKlQozQABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKAH4AAwABBAkAAACcAUoAAwABBAkAAQAmASQAAwABBAkAAgAOARYAAwABBAkAAwA+ANgAAwABBAkABAAmASQAAwABBAkABQBqAG4AAwABBAkABgAiAEwAAwABBAkADgA0ABgAAwABBAkBAQAMAAwAAwABBAkBDgAMAAAATQBlAGQAaQB1AG0AVwBlAGkAZwBoAHQAaAB0AHQAcAA6AC8ALwBzAGMAcgBpAHAAdABzAC4AcwBpAGwALgBvAHIAZwAvAE8ARgBMAE4AbwB0AG8AUwBhAG4AcwBLAFIALQBNAGUAZABpAHUAbQBWAGUAcgBzAGkAbwBuACAAMgAuADAAMAA0AC0ASAAyADsAaABvAHQAYwBvAG4AdgAgADEALgAwAC4AMQAxADgAOwBtAGEAawBlAG8AdABmAGUAeABlACAAMgAuADUALgA2ADUANgAwADMAMgAuADAAMAA0AC0ASAAyADsAQQBEAEIATwA7AE4AbwB0AG8AUwBhAG4AcwBLAFIALQBNAGUAZABpAHUAbQBSAGUAZwB1AGwAYQByAE4AbwB0AG8AIABTAGEAbgBzACAASwBSACAATQBlAGQAaQB1AG0AKABjACkAIAAyADAAMQA0AC0AMgAwADIAMQAgAEEAZABvAGIAZQAgACgAaAB0AHQAcAA6AC8ALwB3AHcAdwAuAGEAZABvAGIAZQAuAGMAbwBtAC8AKQAsACAAdwBpAHQAaAAgAFIAZQBzAGUAcgB2AGUAZAAgAEYAbwBuAHQAIABOAGEAbQBlACAAJwBTAG8AdQByAGMAZQAnAC4AAQAAAAoAggDEAAdERkxUAGpjeXJsAFRncmVrAFRoYW5nACxoYW5pAFRrYW5hAFRsYXRuAFQAGgABS09SIAAKAAD//wAFAAAAAQACAAMABAAA//8ABAAAAAEAAgAEABoAAUtPUiAACgAA//8AAwAAAAEAAwAEAAAAAP//AAIAAAABAAVjYWx0ADxjY21wADZsam1vACxsb2NsACZ2am1vACAAAAABAAgAAAABAAoAAAADAAQABQAGAAAAAQAAAAAAAQAJAAwBbgE8AS4BDADqAMoAqgCIAHAAKAAaABoAAQAAAAEACAABADgAHgAGAAAAAQAIAAMAAQAwAAEAKgABABQAAQAAAAsAAgADAAIABgAAAAoAHQAFACAAMwAZAAEAAQABAAIAAgAPAB0AAAA0ADcADwAGAAAAAQAIAAMAAAABACYAAAABAAAABwABAAAAAQAIAAIADgAEADQANQA2ADcAAQAEAAcACAAJAB4ABgAAAAEACAADAAAAAQCsAAEAEgABAAAAAwABAAEAHgAGAAAAAQAIAAMAAAABAIwAAQASAAEAAAACAAEAAQAJAAYAAAABAAgAAwAAAAEAbAABABIAAQAAAAEAAQACAAcACAABAAAAAQAIAAIASgAKACoAKwAsAC0ALgAvADAAMQAyADMAAQAAAAEACAABACgAAAABAAAAAQAIAAIAGgAKACAAIQAiACMAJAAlACYAJwAoACkAAgACAAIABgAAAAoADgAFAAQAAAABAAgAAQBGAAQANAAiABgADgABAAQAHgACAAgAAQAEAA4AAgAEAAIADAAGAA0AAgAEAAwAAgACAAIADAAGAAsAAgAEAAoAAgADAAEABAACAAMABgAJAAUAZP+IA4QDcAADAAYACQAMAA8AABcRIREBASEBAREBIQEBEQFkAyD+cAE+/YQBXgE+/WQCfP7C/qIBPngD6PwYAh0Bmf4+/mcDMvylAZkBwvzOAZkAAgCRAZIDBgL4AAUACQAAEyEVIRUjNSEVIZECW/4JZAJ1/YsC+FTwMVMAAgCSAY0DBQL3AAMABwAAEyERIQEhFSGSAnP9jQIP/lUBqwL3/pYBGMYAAgBTAZIDRQMbAA8AHwAAATMVFA4DByc+BDU3MxUUHgMXBy4ENQGVXSVCXHE/LDhiUDoeElwfOVBiOCs/cVtDJQMbMDVeUT8sClUIIzI+RSQwMCRFPTIjCFUKLD9QXjUAAwB4AXcDBgL2AAMABwARAAABFQUnNyEVISUzFRQGByc2NjUCwv3CDBkCRv26Ag9mBxNlEwYCREgdUsVVVUU7mmUKY5M6AAQAVwGCAzoDHQADAA8AGwAfAAATIRUhBTIWFRQGIyImNTQ2FyIGFRQWMzI2NTQmJzMVI1cC4/0dAXSTmJiTlJiYlGFcXGFhXFyVaGgC1kseOjs7Ozs7OzpEGBkZGRkZGRj0hgADAksBQQM3Az8AAwAHAAsAAAEzESMDMxEjEzMVIwLfWFiUV1c+c3MDP/4CAez+FQEfSwAAAgJnAUIDGANAAAMABwAAATMVIxMzESMCZ6SkUWBgAmxVASn+AgABAC4BQQNpAZEAAwAAEyEVIS4DO/zFAZFQAAQAkwGWAwQC8AAFAAkADQAYAAATIRUjFSMBIREhEyMVMyUzMjY2NxcGBiMjkwEPt1gBVQEc/uTAZmb96zApTEwpCkFyQTAC8FPyAUT+pwEPxAgDCAlRDwcAAAQAkwGMAywC/AAFABEAHQAoAAATIRUjFSMBMxUUBgYHJz4CNTczFRQWFhcHLgI1BTMyNjY3FwYGIyOTAQ+3WAG7SB9GPDMzPRwLSRw9MTA8SB/+OjApTEwpCkFyQTAC91LzAUpGQnZZGUgTRVkxRkYxWUUTSBlZdkLLAgoIUQ8GAAAEAJMBlgMEAu8AAwAHAA0AEQAAEyERIRMjFTMTIRUjFSM1IRUhkwEc/uTBZmaUARG5WAEc/uQC7/6nAQ/EAQ5S8z9TAAQAkwGQAy0C/AADAAcAEwAfAAATIREhEyMVMxMzFRQGBgcnPgI1NzMVFBYWFwcuAjWTARz+5MFmZvpJH0c8MjI9HAxIHD4xMDxIHwL3/qgBDsQBE0ZCc1gZSBJEVzFGRjFXRBJIGFh0QgAGAI0BhAMsAwwAAwATAB8AIwAvADsAABMhFSEXMhYWFRQGBiMiJiY1NDY2FyIGFRQWMzI2NTQmJzMVIyUzFRQGBgcnPgI1NzMVFBYWFwcuAjWNASf+2ZQmPiUlPiYlPiYlPiYYICAYGCAgQVBQAVZIH0Y8MzM9HAtJHD0xMDxIHwLaUg4gNyQlNx8fNyUkNyBHGxkZHBwZGRvZbFxGQnZZGUgTRVkxRkYxWUUTSBlZdkIABQBM/64DOQNAAAMABwALABcAHQAAATMRIwMzFSMDMxEjATMyNjY3Fw4CIyMRIRUjESMC1WRkjKamQmJi/kU9P2plNQo3aG1BPQFS62cDQPxuAipWAav8rgECBAsKVgsLBAJNVf43AAAEAFv/rAMlA0AACwARABUAGQAANzMyNjY3Fw4CIyMRIRUhESMBMxEjAyEVIVtHVIV3PgtAe4hWRwGe/spoAmFpafQBIf7f4gUMC1YMDAUCYFT+KwJ+/GwCT1YAAAMALgAjA2oC7wADAAcADQAAEyEVIQchFSETIRUhESOTAnr9hmUDPPzEZQJy/fZoAZFVw1YCzFX+0gAFAEz/rgM6A0AAAwAHAAsADwATAAABMxEjAzMVIwMzESMBIREhASMRMwLWZGSCpaVHYmL+PwFh/p8BAJ6eA0D8bgItVAGn/KsDAv3AAe7+ZAAABABR/6wDJQNAAAMABwALAA8AABMhESEBIxEzATMRIwMhFSFRAaj+WAFB2toBKmlp1gEA/wAC6v2nAgb+TQJc/GwCT1YAAAMALgAhA2oC8wADAAcACwAANyEVIRMhESEBIREhLgM8/MRcAoD9gAIZ/k4BsndWAtL+RwFm/u0ABQAg/64DOgNAAA0AGwAfACMAJwAAEzMVFA4CByc+AzU3MxUUHgIXBy4DNSUzESMDMxUjAzMRI+NRGjVPNEIySDEYFFIVLUUuPTVMMRgB32RkgqWlRWJiAuylSo99ZR9OHVZqdTqlnjlxYlEZUx5feYtI8vxuAihWAa78qwAABAAo/6wDJQNAAAMAEQAfACMAAAEzFSMDMxUUDgIHJz4DNTczFRQeAhcHLgM1JTMRIwH4+fnpVSJBXTtBNlU9HxVUHzxUNT87XEAiAZhpaQIUVQE2llGZhWceUxpYcX1BlpY/e2tUGFQeY4CVT+H8bAAAAwAuACMDagMFAA8AHwAjAAABMxUUDgMHJz4ENTczFRQeAxcHLgQ1ASEVIQGQWyVEXXA9LjZiUjshFFshPFJiNi49cF1EJv6KAzz8xAMFRDxtX0w1DVcKKz9LVStERCxUTD4rClcNNUxfbTz9uVcAAAYAMf+tAzoDPwADAAcAFAAYABwAIAAAATMRIwMzFSMDMxQOAgcnPgM1JyEVISUzESMDFQUnAtZkZIilpe9jHkyGZzpZdEQd/QEh/t8BqmJisv7nDgM//G4CKlUBUV2un4s6SjJ0hpVSElWs/K4CLE4dWgAABQAr/60DIwM/AAwAEAAUABgAHAAAATMUDgIHJz4DNSUhFSEFFQUnATMRIwMzFSMBl2UkW556OmeNUyX+xwF4/ogBPP6kDwKLaWnA9vYC5Ga+rZY/UTR+kaZfDVSOUB9ZAVP8bgIrVgAEAC4AJANoAugAAwAHABMAFwAAEyEVIQMhFSEBMxUUBgYHJz4CNRcVBSeOAkL9vmADOvzGAnZnBBAVaBURBBf9yA4C6FX951YCxG1DhppgCVqXiEGOTh5WAAAHAC3/rgM4A0AAAwATACMAJwArAC8AMwAAEyEVIRcyFhYVFAYGIyImJjU0NjYXIgYGFRQWFjMyNjY1NCYmATMRIwMzFSMDMxEjATMVIy0Bvv5C3zpZNDRZOjhaMzNaOR4wGxswHh4vHBwvAalkZIGiokFiYv7HaGgCrFU0Nl8/P2A2NmA/P182WB83JiY4Hx84JiY3HwF1/G4CF1YBvvyrA06vAAYALv+tAyUDPwADABMAIwAnACsALwAAEyEVIQUyFhYVFAYGIyImJjU0NjYXIgYGFRQWFjMyNjY1NCYmAzMVIyUzESMDMxUjLgIY/egBDT5iODlhPj5iOTliPiI2ICA2IiI2Hx82V2lpAbZpaYjZ2QKyVUA3YD8+YDc3YD4/YDdYHzkmJTkfHzklJjkfAW6rt/xuAh5WAAUALgAVA2oDMQADAAcAFwAnACsAABMhFSEDIRUhATIWFhUUBgYjIiYmNTQ2NhciBgYVFBYWMzI2NjU0JiYDMxUjVALr/RUmAzz8xAGbXohKSoheXIlKSolcPVkvL1k9PlkvL1lxaGgCvFX+BFYCICtSOTlTKytSOjlSK1QXLB8gLBcXLCAfLBcBUKYAAwAyASYDGQM/AAMADQARAAABMxUjBScyNjY3Fw4CATMRIwJdlJT94w5Yx8xeB2DKwgIiYWECgVL2VAQLCkkODwYCBf3nAAIAYwCeAd4C2gAFAAkAABMhFSERIzUhFSFjAWj++mIBe/6FAtpV/kQqVQAAAgBjAJ4B0QLaAAMABwAAEyERIQEjETNjAW7+kgERtbUC2v3EAfD+WwAAAgArAKACEQLjAAsAFwAAEzMVFAYGByc+AjU3MxUUFhYXBy4CNelSK1tJQUNUJxlSJ1RCQUhbKwLjdWm1iChOInSWVHV1U5Z1Ik4oibRpAAADAFAAcgHiAtkAAwAOABIAAAEVBSclMxQGBgcnPgI1JSEVIQGe/r8NAS1lPo15P2Z+Ov7sATX+ywIQURdZ2HrgwE1JQqC9bBNUAAQARwBuAgADFAADABMAIwAnAAATIRUhFzIWFhUUBgYjIiYmNTQ2NhciBgYVFBYWMzI2NjU0JiYDMxUjRwG5/kffOFcyMlc4OFcyMlc4HS4aGi4dHi0aGi1QZ2cColUyN2BAPmE3N2E+QGA3WCA4JyU5ICA5JSc4IAFRogAEAFEAoAIfAt8ABQAJAA0AFwAAEzMVIxEjEzMRIxMjETMlMzI2NxcGBiMjUtJ5We3g4JRISP5+KCtUMQo0WC4oAt5U/koCC/3BAe3+ZQEFDVUMBAAEAFIAkwJHAuQADQAbACEAKwAAATMVFA4CByc+AzU3MxUUHgIXBy4DNSUzFSMRIzUzMjY3FwYGIyMBg0UHFi4oQictFgYQRQYWLCdAKC8XBv6/0nlZKCpVMAs1Vy4oAuR2S418YyJAHVhteT52dj55bVgdQiNkfI1LcVX+Sh0EDVQMBQAEAE8AmwIgAtsAAwAHAA0AEQAAEzMRIxMjETMTMxUjESM1MxUjT+DglElJaMZuWNXVAtv9wAHu/mQB7lL+UhJSAAAEAE8AkwJPAuMAAwAHABUAIwAAEzMRIxMjETMTMxUUDgIHJz4DNTczFRQeAhcHLgM1T+DglElJp0YHFi8oQicuFQYPRgYWLSdBKDAWBwLe/cAB7v5lAfJ1TIx8ZCJAHVhtej51dT56bVgdQSJkfY1LAAAGAD8AjwJEAvkAAwAPABsAHwAtADsAABMzFSMXMhYVFAYjIiY1NDYXIgYVFBYzMjY1NCYDMxUjNzMVFA4CByc+AzU3MxUUHgIXBy4DNT/393w1Pj41NT8/NRIUFBITExNFYGD3RQcWLihCJy0WBhBFBxUtJkAoLxcGAqlUFXZiZHV1ZGJ2WEM9PUVFPT1DARGKdHVMjHxkIkAdWG16PnV1PnptWB1BImR9jUsAAgBsAZkB7QMAAAUACQAAEyEVIRUjNSEVIWwBdP7uYgGB/n8DAFXvMlUAAgBxAZkB7QMAAAMABwAAEyERIQEjFTNxAXz+hAEgxMQDAP6ZARvPAAIANQGTAicDDgALABcAABMzFRQGBgcnPgI1NzMVFBYWFwcuAjX5UTNkSzNBVywaUStXQTJKZjIDDjtLf10ZTRNJYTY7OzZhSRNNGV1/SwAAAwBPAYcB8gMAAAMADQARAAATIRUhJTMVFAYHJzY2NRcVBSdqAWX+mwEmYgYSYBEFMP6eDwMAVFRMPZJeDFuLO1ZIH1MAAAQAXQGWAgIDJwADAA8AGwAfAAATIRUhFzIWFRQGIyImNTQ2FyIGFRQWMzI2NTQmJzMVI10Bpf5b0lFmZlBRZ2dRKjIyKikyMltjYwLmThU/NzdAQDc3P0IbGRkcHBkZG+Z1AAAEAEUBmQISAvoABQAPABMAFwAAEzMVIxUjNTMyNjcXBgYjIxMzESMTIxUzRdR7WSctVzMJNlowJ/bX14xBQQL6VO8tBQxKDQUBYf6fASDfAAQARQGOAjIDAQAFAA8AGwAnAAATMxUjFSM1MzI2NxcGBiMjATMVFAYGByc+AjU3MxUUFhYXBy4CNUXUelonLVczCTZaMCcBLkITMzQzKy4SEkMSLykxNDUTAvxU7ikFDUsNBAFoRj11XhxCFkpcLkZGLlxKFkMcX3U9AAAEAEUBmQIQAvoAAwAHAA0AEQAAEzMRIxMjFTMTMxUjFSM1MxUjRdfXjEFBa851WdTUAvr+nwEg3wEgUvM3UwAABABFAY4CPAMBAAMABwATAB8AABMzESMTIxUzEzMVFAYGByc+AjU3MxUUFhYXBy4CNUXX14xBQaxCEzM0MysuEhJCEjApMTQ1EwL8/qABIOABJUY9dV4cQhZKXC5GRi5cShZDHF91PQAGAEABjAI5AxQAAwAPABsAHwArADcAABMzFSMXMhYVFAYjIiY1NDYXIgYVFBYzMjY1NCYnMxUjNzMVFAYGByc+AjU3MxUUFhYXBy4CNUDl5XIvPz8vLkBALhAWFhARFhY5UFDvQxM0MzQrLhITQhIvKjIzNhIC4lILQTs8QUE8O0FFHBscHBwcGxzUbltGPXVeHEIWSlwuRkYuXEoWQxxfdT0AAAP+tv+u/6IDQAADAAcACwAAATMVIwMzESMTMxEj/tuPjyVUVJJaWgHvVgGU/KsDaPxuAAAC/rr/rP+NA0AAAwAHAAABMxUjEzMRI/66w8NzYGAB+1YBm/xsAAH8lgAa/9IAdAADAAAlIRUh/JYDPPzEdFoAA/yN/6z/jQNAAAkADQARAAAlJz4CNxcOAgEzFSMTMxEj/JoNUsHIXghhyLsB0MPDc2Bga1QBAgsMShEPAwIFVQEk/GwAAAA=) format("truetype")';var Sl;function _x(){return Sl||(Sl=typeof FontFace=="function"?new FontFace("MadHackersFlag",Yu).load().then(i=>(document.fonts.add(i),!0)).catch(()=>!1):Promise.resolve(!1)),Sl}function qu(i){let t=new Dt;t.name="golden-monument",i.add(t);let e=new xe({color:"#d0a348",metalness:.84,roughness:.32,envMapIntensity:1.05}),n={box:Ie,capsule:ci,sphere:new Me(1,24,16),cylinder:new Zt(1,1,1,24),...Sr};for(let T of Object.values(n))T.userData.shared=!0;let s=(T,P,M,_,S,D,L,z,F,H)=>{let q=new xt(n[P],e);return q.position.set(_,S,D),q.scale.set(L,z,F),T.add(q),H.push({node:q,geometry:P,tint:M}),q},r=(T,P,M,_)=>{let S=new Dt;return S.position.set(P,M,_),T.add(S),S},o={id:"monument",skin:"scout",team:0,x:0,y:0,yaw:Math.PI/2,pitch:0,hp:150,shots:0,weapon:"axe",reload:0,vx:0,vy:0},a=Na(o,s,r);Oa(a,o,.016,1e3);for(let T of a.records)T.weapon&&T.node.removeFromParent();let l=(T,P,M)=>{let _=new I(...P),S=new I(...M);T.position.copy(_).add(S).multiplyScalar(.5),T.quaternion.setFromUnitVectors(new I(0,1,0),S.clone().sub(_).normalize()),T.scale.y=_.distanceTo(S)};for(let T of a.arms){let P=T.side>0,M=[T.side*.235,.425,0],_=P?[.4,.28,.17]:[-.36,.17,.02],S=P?[.4,.64,.29]:[-.3,-.02,.16];l(T.upper,M,_),l(T.lower,_,S),T.hand.position.set(...S),T.hand.rotation.set(0,0,P?-.12:.18)}a.root.position.set(20,1.72,12),a.root.rotation.set(0,0,0),a.root.scale.set(2.35,2.35,2.35),t.add(a.root);let c=new xt(new Zt(.037,.046,6.1,24),e);c.position.set(20.94,5.1,12.68),t.add(c);let h=new xt(new Me(.1,20,12),e);h.position.set(20.94,8.2,12.68),t.add(h),Mn(t),t.userData.human=!0,t.userData.material="gold";let u=document.createElement("canvas");u.width=1024,u.height=512;let d=u.getContext("2d"),p=new Ue(u);p.colorSpace=ie;let x=!1;p.addEventListener("dispose",()=>{x=!0});let g=()=>{d.fillStyle="#123c32",d.fillRect(0,0,1024,512),d.strokeStyle="#dfc36f",d.lineWidth=12,d.strokeRect(18,18,988,476),d.strokeStyle="#a79b62",d.lineWidth=2,d.strokeRect(34,34,956,444),d.fillStyle="#f3df9b",d.textAlign="center",d.textBaseline="middle",d.font='500 164px MadHackersFlag,"Noto Sans KR",sans-serif',d.fillText("\uB9E4\uB4DC\uD574\uCEE4\uC2A4",512,248,900),d.font="500 33px sans-serif",d.fillText("MAD HACKERS",512,398),p.needsUpdate=!0};g(),_x().then(()=>{x||g()});let m=new Dt;m.name="mad-hackers-flag",m.position.set(20.94,7.18,12.68),m.userData.label="\uB9E4\uB4DC\uD574\uCEE4\uC2A4",i.add(m);let f=2.8,A=1.55,v=new me(f,A,24,8);v.translate(f/2,0,0);let y=v.clone();y.scale(-1,1,1),y.translate(f,0,-.012),y.computeVertexNormals();let R=new xe({map:p,color:"#ffffff",roughness:.88,metalness:0,side:fn}),b=[v,y].map(T=>{let P=new xt(T,R);return P.castShadow=P.receiveShadow=!0,P.userData.base=new Float32Array(T.attributes.position.array),m.add(P),P});return i.userData.flagLabel="\uB9E4\uB4DC\uD574\uCEE4\uC2A4",i.userData.statue="golden-human",{root:m,sheets:b,width:f}}function Qu(i,t){if(i)for(let e of i.sheets){let n=e.geometry.attributes.position,s=e.userData.base;for(let r=0;r<n.count;r++){let o=s[r*3],a=s[r*3+1],l=o/i.width;n.setXYZ(r,o,a-Math.pow(l,1.6)*.1,s[r*3+2]+l*(Math.sin(o*3-t*2.2)*.13+Math.sin(a*3+o*1.3-t*1.4)*.06))}n.needsUpdate=!0,e.geometry.computeVertexNormals()}}function yx(i,t,e,n,s,r,o,a,l){let c=a===0?n+r/2:a===1?n-r/2:n;i.box(e,o/2,n,s,o,r,t.kind,t.wall),i.box(e,.38,n,s+.08,.76,r+.08,"concrete",t.trim),i.box(e,o-.14,n,s+.26,.3,r+.26,"stone",t.trim),i.box(e,o+.12,n,s+.1,.22,r+.1,"metal",t.roof);let h=a<2?[{axis:"z",face:c,out:a===0?1:-1,length:s,center:e}]:[{axis:"x",face:a===2?e+s/2:e-s/2,out:a===2?1:-1,length:r,center:n}];for(let u of h){let d=(x,g,m,f,A,v,y,R=0)=>u.axis==="z"?i.box(x,g,u.face+u.out*R,m,f,A,v,y):i.box(u.face+u.out*R,g,x,A,f,m,v,y);for(let x=2.25;x<o-1;x+=2.65){t.urban&&d(u.center,x-1.08,u.length+.04,.12,.14,"stone",t.trim,.05);for(let g=u.center-u.length/2+1.35;g<u.center+u.length/2-.8;g+=2.2)d(g,x,1.3,1.67,.09,"stone",t.trim,.04),d(g,x+.025,1.06,1.42,.035,"glass",t.glass,.098),d(g,x,.055,1.42,.04,"metal",t.trim,.13),d(g,x+.08,1.06,.05,.04,"metal",t.trim,.13),d(g,x-.85,1.48,.1,.28,"stone",t.trim,.12),t.urban&&d(g,x+.93,1.44,.1,.22,"stone",t.trim,.1)}d(u.center,.95,1.28,1.9,.08,"metal",t.trim,.08),d(u.center-.42,1.05,.05,.24,.06,"metal","#b8b4a0",.14);for(let x of[u.center-u.length/2+.18,u.center+u.length/2-.18])if(d(x,o/2,.18,o,.19,t.urban?"stone":"metal",t.trim,.1),t.urban)for(let g=.9;g<o-.3;g+=.46)d(x,g,.25,.025,.22,"stone",t.wall,.13);let p=u.center+u.length/2-.5;d(p,o/2,.07,o,.09,"metal",t.roof,.18);for(let x=1;x<o;x+=2)d(p,x,.18,.08,.13,"metal",t.trim,.2)}i.box(e,o+.35,n-r/2,s,.65,.16,"metal",t.roof),i.box(e,o+.35,n+r/2,s,.65,.16,"metal",t.roof),i.box(e-s/2,o+.35,n,.16,.65,r,"metal",t.roof),i.box(e+s/2,o+.35,n,.16,.65,r,"metal",t.roof),i.box(e-s*.22,o+.5,n,1.3,.8,1.1,"metal",t.trim);for(let u=0;u<5;u++)i.box(e-s*.22,o+.28+u*.11,n-.57,1.15,.025,.04,"metal",t.wall);if(i.tube(e+s*.25,o+1.05,n,.2,2,"metal",t.trim),t.urban)for(let u of[n-r*.25,n+r*.25])i.box(e,o+.63,u,s*.8,.17,.34,"stone",t.trim);else for(let u=e-s/2+.4;u<e+s/2;u+=.65)i.box(u,o+.27,n,.06,.08,r,"metal",t.trim)}function Zu(i,t,e,n){let s=e.id,r=Pn[s]||Pn.railway,o=new Dt;o.name="cohesive-world-details",i.add(o);let a=new bs(o,n),l=i.userData.coverFootprints||[],c=0;for(let d of l){let p=a.count,x=s==="freight"||s==="railway",g=x?"#596c69":r.trim;if(x){for(let m of[d.y+.015,d.y+d.d-.015]){for(let f=d.x+.22;f<d.x+d.w-.12;f+=.32)a.box(f,1.31,m,.045,2.34,.045,"paint",g);a.box(d.x+d.w/2,2.45,m,d.w-.14,.075,.075,"metal",g),a.box(d.x+d.w/2,.19,m,d.w-.14,.075,.075,"metal",g)}for(let m of[d.x+.015,d.x+d.w-.015])for(let f=d.y+.22;f<d.y+d.d-.12;f+=.32)a.box(m,1.31,f,.045,2.34,.045,"paint",g);for(let m of[d.x+.13,d.x+d.w-.13])for(let f of[d.y+.13,d.y+d.d-.13])a.box(m,2.52,f,.23,.16,.23,"metal","#51645e"),a.box(m,.15,f,.23,.16,.23,"metal","#51645e");for(let m of[d.x+.05,d.x+d.w-.05])for(let f of[d.y+d.d*.27,d.y+d.d*.73]){a.tube(m,1.3,f,.025,2.12,"metal","#9ba99d");for(let A of[.45,1.25,2.15])a.box(m,A,f,.09,.08,.13,"metal","#788a80")}}else{for(let m of[d.x+.13,d.x+d.w-.13])for(let f of[d.y+.13,d.y+d.d-.13])a.box(m,1.3,f,.25,2.46,.25,s==="foundry"?"metal":"stone",g);for(let m of[d.y+.025,d.y+d.d-.025])if(a.box(d.x+d.w/2,1.3,m,Math.max(.25,d.w-.55),1.7,.07,s==="foundry"?"metal":"stone",s==="foundry"?"#64726b":r.wall),a.box(d.x+d.w/2,.43,m,Math.max(.25,d.w-.4),.1,.14,"stone",g),a.box(d.x+d.w/2,2.18,m,Math.max(.25,d.w-.4),.1,.14,"stone",g),s==="foundry")for(let f=d.x+.45;f<d.x+d.w-.2;f+=.55)a.box(f,2.2,m,.13,.07,.09,"metal","#d0ad65"),a.box(f,.44,m,.13,.07,.09,"metal","#d0ad65");for(let m of[.2,2.5])a.box(d.x+d.w/2,m,d.y+d.d/2,d.w-.03,.12,d.d-.03,s==="foundry"?"metal":"stone",g)}c+=a.count-p}let h=0;(s==="freight"?[[8,43,1],[25,44,1],[43,43,1],[58,44,1],[-9,5,2],[-9,27,2],[69,5,3],[69,28,3]]:[[7,-9,0],[25,-10,0],[45,-9,0],[8,44,1],[28,45,1],[49,44,1],[-9,7,2],[69,28,3]]).forEach(([d,p,x],g)=>{let m=x<2?12:8,f=x<2?8:11,A=(r.urban?10:7)+g%3*2.65;yx(a,r,d,p,m,f,A,x,g),h++});for(let d=6;d<57;d+=10)for(let p of[.8,34.2]){a.box(d,.34,p,1.5,.6,.22,"metal",r.trim);for(let x=0;x<4;x++)a.box(d,.2+x*.1,p-.13,1.25,.025,.04,"metal",r.wall)}return a.finish(),i.userData.detailParts=(i.userData.detailParts||0)+o.userData.detailParts,i.userData.artDirection={revision:br,facades:h,covers:l.length,coverParts:c,facadeStandard:"framed-glazing-roof-drainage",detailParts:o.userData.detailParts},o}function Ju(i,t,e){if(!i)return;let n=new Dt;n.name="landmark-finish",i.add(n);let s=Pn[t],r=new bs(n,e);if(t==="glory"){for(let o of[9.56,14.44]){for(let a of[.35,1.31,1.59])r.box(20,a,o,3.72,.07,.09,"stone","#d8cdb4");r.box(20,.89,o,2.85,.48,.07,"stone","#938c76");for(let a=18.75;a<21.3;a+=.36)r.box(a,.89,o,.045,.35,.1,"metal","#b9b9a1")}for(let o of[18.28,21.72])for(let a of[9.94,14.06])r.box(o,.9,a,.22,1.05,.22,"stone","#d3c9ae"),r.box(o,.38,a,.31,.14,.31,"stone","#9c967e");for(let o of[9.61,14.39])r.box(20,1.4,o,3.3,.035,.025,"glow","#70d7e2")}else if(t==="freight"||t==="foundry")for(let o of[18.5,21.5])for(let a of[10,14]){r.box(o,.1,a,.55,.2,.5,"metal",s.trim);for(let l of[-.16,.16])for(let c of[-.14,.14])r.tube(o+l,.22,a+c,.035,.055,"metal","#a7ad98")}else if(t==="plaza")for(let o of[18.17,21.83])for(let a of[9.85,14.15]){r.box(o,.15,a,.3,.3,.3,"stone","#c5b998");for(let l=.4;l<2.4;l+=.26)r.box(o,l,a,.12,.018,.12,"stone","#8e8770")}r.finish(),i.userData.finishRevision=br}var za=class{constructor(t){this.items=[],this.tracks=new Map;let e=new xe({color:"#a9b1a4",metalness:.7,roughness:.35}),n=new xe({color:"#69573e",roughness:.9}),s=new Ke;s.moveTo(-.12,.07),s.lineTo(.04,.07),s.lineTo(.16,.15),s.lineTo(.2,.02),s.lineTo(.16,-.13),s.lineTo(.02,-.06),s.lineTo(-.12,-.06),s.closePath();let r=new sn(s,{depth:.045,bevelEnabled:!0,bevelSize:.006,bevelThickness:.004,bevelSegments:2,steps:1});r.translate(0,0,-.0225);let o=new Te(.024,.004,6,12),a=new xe({color:"#303e34",roughness:.85});for(let l=0;l<6;l++){let c=new Dt;c.name="thrown-axe";let h=new xt(new Zt(.018,.024,.62,16),n),u=new xt(r,e);u.position.set(0,.22,0),c.add(h,u);for(let d=0;d<9;d++){let p=new xt(o,a);p.rotation.x=Math.PI/2,p.position.y=-.25+d*.022,c.add(p)}t.add(c),c.visible=!1,this.items.push(c)}}update(t,e,n){this.key!==n&&(this.key=n,this.tracks.clear());let s=Math.min(.12,Math.max(0,(e-(this.last||e))/1e3));this.last=e;let r=new Set;this.items.forEach((o,a)=>{let l=t[a];if(o.visible=!!l,!l)return;r.add(l.id);let c=this.tracks.get(l.id),h=new I(l.x,l.z+(l.ground?.025:0),l.y);c?c.lerp(h,1-Math.exp(-35*s)):(c=h.clone(),this.tracks.set(l.id,c)),o.position.copy(c),o.rotation.set(l.ground?Math.PI/2:e*.018,Math.atan2(l.vy,l.vx),l.ground?.3:0)});for(let o of this.tracks.keys())r.has(o)||this.tracks.delete(o)}};var Ha=class{constructor(t){this.owner=t,this.scene=t.scene,this.key="",this.holes=[],this.lastImpact=0,this.cursor=0,this.positions=new Map,this.booms=new Map,this.transform=new ge,this.ray=new fr;let e=document.createElement("canvas");e.width=e.height=64;let n=e.getContext("2d"),s=n.createRadialGradient(32,32,3,32,32,30);s.addColorStop(0,"#060b0c"),s.addColorStop(.19,"#101615"),s.addColorStop(.32,"#817c6bbb"),s.addColorStop(.56,"#5a5c4b88"),s.addColorStop(1,"#222c2000"),n.fillStyle=s,n.fillRect(0,0,64,64);for(let o=0;o<9;o++){let a=o*2.399;n.strokeStyle="#13201cc0",n.lineWidth=1.5,n.beginPath(),n.moveTo(32+Math.cos(a)*6,32+Math.sin(a)*6),n.lineTo(32+Math.cos(a)*20,32+Math.sin(a)*20),n.stroke()}let r=new Ue(e);r.colorSpace=ie,this.decals=new Ve(new me(.14,.14),new ae({map:r,transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2,alphaTest:.03}),128),this.decals.count=0,this.decals.frustumCulled=!1,this.scene.add(this.decals),this.grenades=new Ve(new ei(.085,1),new xe({color:"#4e6642",roughness:.7,metalness:.4}),32),this.grenades.count=0,this.grenades.frustumCulled=!1,this.scene.add(this.grenades),this.smoke=new Ve(new Me(1,12,8),new ae({color:"#776f60",transparent:!0,opacity:.38,depthWrite:!1}),16),this.smoke.count=0,this.smoke.frustumCulled=!1,this.scene.add(this.smoke),this.flash=new Ve(new Me(1,12,8),new ae({color:"#ffbd58",transparent:!0,opacity:.85,depthWrite:!1,blending:An,toneMapped:!1}),16),this.flash.count=0,this.flash.frustumCulled=!1,this.scene.add(this.flash),this.light=new Rn("#ffb453",0,12,2),this.scene.add(this.light),this.last=0}addHole(t,e){let n=this.owner;n.staticRoot.updateMatrixWorld(!0),this.ray.set(new I(t.ox,t.oz,t.oy),new I(t.dx,t.dz,t.dy).normalize()),this.ray.near=.02,this.ray.far=t.distance+2;let s=t.surface==="train"?[n.trainRoot]:t.surface==="crane"?[n.mechanisms?.load]:t.surface==="clock"?[n.mechanisms?.hand]:[n.staticRoot],r=this.ray.intersectObjects(s.filter(Boolean),!0).find(c=>c.object.isMesh&&c.face);if(!r)return;let o=r.face.normal.clone().transformDirection(r.object.matrixWorld),a=r.point.clone().addScaledVector(o,.008),l=null;t.surface==="train"&&n.trainSnapshot&&(l={x:n.trainSnapshot.x,y:n.trainSnapshot.y,z:0}),t.surface==="crane"&&e.crane&&(l={x:e.crane.x,y:e.crane.y,z:e.crane.lift}),t.surface==="clock"&&(l={x:30,y:17.5,z:0,angle:(e.world_time||0)*Math.PI*2/24}),this.holes[this.cursor]={point:a,n:o,surface:t.surface,anchor:l},this.cursor=(this.cursor+1)%128}update(t,e){let n=(t.code||"menu")+":"+(t.round||0)+":"+(t.map_id||"");n!==this.key&&(this.key=n,this.holes=[],this.lastImpact=0,this.cursor=0,this.positions.clear(),this.booms.clear());let s=Math.min(.1,Math.max(0,(e-(this.last||e))/1e3));this.last=e;for(let c of t.impacts||[])c.id>this.lastImpact&&(this.addHole(c,t),this.lastImpact=c.id);let r=0;for(let c of this.holes){if(!c)continue;let h=c.point.clone(),u=c.n.clone(),d=c.anchor;if(c.surface==="train"){if(!this.owner.trainSnapshot?.active)continue;h.x+=this.owner.trainSnapshot.x-d.x}if(c.surface==="crane"&&t.crane&&(h.x+=t.crane.x-d.x,h.z+=t.crane.y-d.y,h.y+=t.crane.lift-d.z),c.surface==="clock"){let p=(t.world_time||0)*Math.PI*2/24-d.angle;h.sub(new I(d.x,0,d.y)).applyAxisAngle(new I(0,1,0),-p).add(new I(d.x,0,d.y)),u.applyAxisAngle(new I(0,1,0),-p)}this.transform.position.copy(h),this.transform.quaternion.setFromUnitVectors(new I(0,0,1),u),this.transform.scale.set(1,1,1),this.transform.updateMatrix(),this.decals.setMatrixAt(r++,this.transform.matrix)}this.decals.count=r,this.decals.instanceMatrix.needsUpdate=!0,r=0;let o=new Set;for(let c of t.grenades||[]){if(r>=32)break;o.add(c.id);let h=this.positions.get(c.id),u=new I(c.x,c.z,c.y);h?h.lerp(u,1-Math.exp(-28*s)):(h=u,this.positions.set(c.id,h)),this.transform.position.copy(h),this.transform.rotation.set(e*.004,e*.003,0),this.transform.scale.set(1,1,1),this.transform.updateMatrix(),this.grenades.setMatrixAt(r++,this.transform.matrix)}for(let c of this.positions.keys())o.has(c)||this.positions.delete(c);this.grenades.count=r,this.grenades.instanceMatrix.needsUpdate=!0;let a=0,l=0;this.light.intensity=0;for(let c of t.explosions||[]){this.booms.has(c.id)||this.booms.set(c.id,e-(c.visualAge??Math.min(.15,Math.max(0,(t.world_time||0)-c.time)))*1e3);let h=(e-this.booms.get(c.id))/1e3;h<0||h>1.1||(this.transform.position.set(c.x,c.z+.3+h*.6,c.y),this.transform.rotation.set(0,0,0),h<.18&&l<16&&(this.transform.scale.setScalar(.4+h*11),this.transform.updateMatrix(),this.flash.setMatrixAt(l++,this.transform.matrix),this.light.position.copy(this.transform.position),this.light.intensity=this.owner.quality===6?0:6*(1-h/.18)),a<16&&(this.transform.scale.setScalar(.5+h*2.1),this.transform.updateMatrix(),this.smoke.setMatrixAt(a++,this.transform.matrix)))}for(let[c,h]of this.booms)e-h>3e3&&!(t.explosions||[]).some(u=>u.id===c)&&this.booms.delete(c);this.smoke.count=a,this.flash.count=l,this.smoke.instanceMatrix.needsUpdate=!0,this.flash.instanceMatrix.needsUpdate=!0}};var ka=class{constructor(t){this.particles=[],this.particleCursor=0,this.damageSeen=new Map,this.drops=new Ve(new Me(.025,5,4),new ae({color:"#ffffff"}),192),this.drops.count=0,this.drops.frustumCulled=!1,t.add(this.drops),this.scene=t,this.flashes=new Map,this.shells=[],this.cursor=0,this.geometry=new Me(1,7,5),this.fire=new ae({color:"#ffe4a0",transparent:!0,opacity:.95,depthWrite:!1,blending:An,toneMapped:!1}),this.cases=new Ve(new Zt(.009,.009,.045,7),new xe({color:"#c5a45e",metalness:.7,roughness:.35}),96),this.cases.count=0,this.cases.frustumCulled=!1,t.add(this.cases),this.transform=new ge}update(t,e,n){for(let[o,a]of t){let l=this.damageSeen.get(o),c=l&&a.blood_seq>l.blood,h=l&&a.shield_seq>l.shield;if(c||h)for(let d=0;d<14;d++)this.particles[this.particleCursor]={p:a.root.position.clone().add(new I((Math.random()-.5)*.2,1.15+Math.random()*.35,0)),v:new I((Math.random()-.5)*3,Math.random()*2,(Math.random()-.5)*3),life:.6+Math.random()*.3,blood:c},this.particleCursor=(this.particleCursor+1)%192;this.damageSeen.set(o,{blood:a.blood_seq,shield:a.shield_seq});let u=this.flashes.get(o);if(!u){let d=new xt(this.geometry,this.fire);d.visible=!1,this.scene.add(d),u={mesh:d,shots:a.lastShots,until:0},this.flashes.set(o,u)}if(a.lastShots>u.shots&&!["axe","grenade"].includes(a.shotWeapon||a.weapon)){u.until=n+85;let d=a.gun.localToWorld(new I(.08,.04,.15)),p=new I(1,0,0).applyQuaternion(a.root.quaternion);for(let x=0;x<Math.min(3,a.lastShots-u.shots);x++){let g={p:d.clone(),v:p.clone().multiplyScalar(1.6+Math.random()).add(new I(0,1.7+Math.random(),0)),life:2.4,spin:Math.random()*6,shotgun:a.weapon==="shotgun"};this.shells[this.cursor]=g,this.cursor=(this.cursor+1)%96}}u.shots=a.lastShots,u.mesh.position.copy(a.gun.localToWorld(new I(0,.03,a.weapon==="pistol"?.27:.72))),a.gun.getWorldQuaternion(u.mesh.quaternion),u.mesh.scale.set(a.weapon==="shotgun"?.12:.075,.08,a.weapon==="shotgun"?.37:.22),u.mesh.visible=n<u.until&&a.hp>0}for(let[o,a]of this.flashes)t.has(o)||(this.scene.remove(a.mesh),this.flashes.delete(o));for(let o of this.damageSeen.keys())t.has(o)||this.damageSeen.delete(o);let s=0;for(let o of this.particles)!o||o.life<=0||(o.life-=e,o.v.y-=7*e,o.p.addScaledVector(o.v,e),this.transform.position.copy(o.p),this.transform.rotation.set(0,0,0),this.transform.scale.set(1,Math.max(.3,o.life*2),1),this.transform.updateMatrix(),this.drops.setMatrixAt(s,this.transform.matrix),this.drops.setColorAt(s++,new Nt(o.blood?"#a61920":"#53ddff")));this.drops.count=s,this.drops.instanceMatrix.needsUpdate=!0,this.drops.instanceColor&&(this.drops.instanceColor.needsUpdate=!0);let r=0;for(let o of this.shells)!o||o.life<=0||(o.life-=e,o.v.y-=9.8*e,o.p.addScaledVector(o.v,e),o.p.y<.035&&(o.p.y=.035,o.v.y=Math.abs(o.v.y)*.3,o.v.x*=.6,o.v.z*=.6),o.spin+=e*12,this.transform.position.copy(o.p),this.transform.rotation.set(o.spin,o.spin*.6,o.spin*.3),this.transform.scale.set(o.shotgun?1.7:1,o.shotgun?1.4:1,o.shotgun?1.7:1),this.transform.updateMatrix(),this.cases.setMatrixAt(r,this.transform.matrix),this.cases.setColorAt(r++,new Nt(o.shotgun?"#b34b35":"#c5a45e")));this.cases.count=r,this.cases.instanceMatrix.needsUpdate=!0,this.cases.instanceColor&&(this.cases.instanceColor.needsUpdate=!0)}view(t,e){for(let[n,s]of this.flashes)s.mesh.visible=n!==t&&e<s.until}};function Ku(i,t,e){let n=new Dt;n.name="environment-"+t,i.add(n);let s=(o,a,l,c,h,u)=>{let d=new xt(o,e.get(a,l));return d.position.set(c,h,u),n.add(d),d},r=(o,a,l,c,h,u,d,p)=>s(new pe(c,h,u),d,p,o,a,l);if(t==="freight"){s(new me(220,180),"water","#376477",30,-.25,-65).rotation.x=-Math.PI/2,r(30,-.5,17.5,77,1,47,"concrete","#7b827c");let o=new Dt;o.name="cargo-ship",o.position.set(28,0,-31),n.add(o);let a=new Ke;a.moveTo(-35,-5),a.lineTo(29,-5),a.lineTo(39,0),a.lineTo(29,5),a.lineTo(-35,5),a.closePath();let l=new xt(new sn(a,{depth:6,bevelEnabled:!0,bevelSize:.4,bevelThickness:.4,bevelSegments:1,steps:1}),e.get("paint","#384b53"));l.rotation.x=-Math.PI/2,o.add(l);let c=(h,u,d,p,x,g,m)=>{let f=new xt(new pe(p,x,g),e.get("paint",m));f.position.set(h,u,d),o.add(f)};c(-26,9,0,12,6,9,"#d1d3c3"),c(-26,13,0,13,2,10,"#dce1d1"),c(-26,13,-5.05,10,1,.08,"#365662"),c(-26,13,5.05,10,1,.08,"#365662"),c(-29,16,0,2,5,2,"#ab7952");for(let h=-16;h<26;h+=7)for(let u=-3;u<=3;u+=3)for(let d=7;d<12;d+=2.5)c(h,d,u,6.5,2.4,2.8,["#a17157","#75857a","#748d99"][Math.abs(h+u)%3]);for(let h of[-8,60])r(h,10,-10,.5,20,.6,"metal","#bb9b55"),r(h+5,20,-10,15,.5,.6,"metal","#bb9b55")}else if(t==="foundry"){r(30,-.5,17.5,140,1,120,"concrete","#4d4841");for(let o=0;o<16;o++){let a=-12+o%8*12,l=o<8?-10:46,c=3+o%3;s(new Zt(c,c+.4,.18,13),"molten",o%2?"#ff8d22":"#ffbd42",a,.05,l);let h=s(new Te(c+.2,.28,6,22),"metal","#49443d",a,.05,l);h.rotation.x=Math.PI/2;for(let u=0;u<4;u++)s(new ei(.7+u%2,0),"metal","#514b43",a+Math.cos(u*1.57)*(c+1),.5,l+Math.sin(u*1.57)*(c+1))}for(let o of[-16,76])for(let a of[0,25])s(new Zt(2.5,3.5,18,12),"metal","#675c51",o,9,a),s(new Zt(.7,1,27,10),"concrete","#675f52",o+4,13,a+4),r(o,5,a,10,1,8,"metal","#967d52")}else if(t==="observatory"){s(new Zt(53,65,16,40),"rock","#566270",30,-8,17.5);for(let o=0;o<22;o++){let a=o*Math.PI*2/22,l=62+o%3*10,c=25+o*7%25,h=30+Math.cos(a)*l,u=17.5+Math.sin(a)*l,d=new wn(19+o%3*4,c,11,5),p=d.attributes.position;for(let m=0;m<p.count;m++){let f=p.getX(m),A=p.getY(m),v=p.getZ(m),y=1+.14*Math.sin(f*.7+v*.37+o);p.setXYZ(m,f*y+Math.sin(A*.15+o)*2,A,v*y)}d.computeVertexNormals();let x=s(d,"rock",o%2?"#687b89":"#526674",h,c/2-5,u);x.rotation.y=o;let g=s(new wn(6+o%3,c*.28,7),"rock","#cad8dc",h,c-5-c*.14,u);g.rotation.y=o}for(let o=0;o<38;o++){let a=o*2.399,l=42+o%4*3,c=30+Math.cos(a)*l,h=17.5+Math.sin(a)*l;s(new Zt(.18,.24,3,6),"metal","#59584a",c,1,h),s(new wn(1.6,6,7),"fabric","#354c44",c,3,h)}}return Mn(n),n}function ju(i,t,e,n){let s=new Dt;s.name="machinery",i.add(s);let r={root:s,id:t},o=(a,l,c,h,u,d,p,x)=>{let g=new xt(new pe(u,d,p),e.get("paint",x));return g.position.set(l,c,h),a.add(g),g};if(t==="freight"){let a=new Dt;a.name="crane-load",s.add(a),r.load=a,o(a,0,1.3,0,6,2.6,2,"#b3a078");for(let l=-2.9;l<3;l+=.35)for(let c of[-1.01,1.01])o(a,l,1.3,c,.045,2.5,.03,"#8d836a");for(let l of[-3,3])for(let c of[-1,1])o(a,l,1.3,c,.12,2.6,.12,"#6b766e");r.cables=[];for(let l of[-2.6,2.6]){let c=o(s,30+l,5,8,.035,5,.035,"#303a3b");r.cables.push(c)}r.trolley=o(s,30,11,8,7,.7,2,"#d1ae58");for(let l of[26.5,33.5])o(s,l,11.5,17.5,.4,.7,25,"#c1a056");for(let l of[8,27])for(let c of[26.6,33.4])o(s,c,.025,l,.13,.05,3,"#e8bc5f");Mn(a)}else if(t==="plaza"){r.hand=new Dt,r.hand.name="clock-hazard",r.hand.position.set(30,.95,17.5),s.add(r.hand),o(r.hand,8,0,0,10,.24,.32,"#b79a51"),o(r.hand,12.4,.02,0,1.2,.3,.8,"#d5bc73");for(let a=3.5;a<13;a+=.8)o(r.hand,a,.14,0,.3,.04,.33,"#3a3830");Mn(r.hand)}else if(t==="observatory"){r.dome=new Dt,r.dome.name="rotating-dome",r.dome.position.set(20,3.4,12),n.add(r.dome);for(let a of[...n.children]){if(a===r.dome||!a.isMesh)continue;a.geometry.computeBoundingBox();let l=a.geometry.boundingBox.clone();a.updateMatrix(),l.applyMatrix4(a.matrix),l.min.y>=3.35&&(a.position.sub(r.dome.position),r.dome.add(a))}}return r}function $u(i,t,e){if(i&&(i.hand&&(i.hand.rotation.y=-t*Math.PI*2/24),i.dome&&(i.dome.rotation.y=t*.12),i.load)){let n=e||{x:27,y:7,w:6,h:2,lift:0};i.load.position.set(n.x+n.w/2,n.lift,n.y+n.h/2),i.trolley.position.set(n.x+n.w/2,11,n.y+n.h/2),i.cables.forEach((s,r)=>{let o=n.lift+2.6;s.position.set(n.x+n.w/2+(r?2.6:-2.6),(11+o)/2,n.y+n.h/2),s.scale.y=(11-o)/5})}}function td(i,t,e,n){let s=new Dt;s.name="environment-finish",i.add(s);let r=(a,l,c,h,u,d)=>{let p=new xt(a,e.get(l,c));return p.position.set(h,u,d),s.add(p),p},o=(a,l,c,h,u,d,p,x)=>r(new pe(h,u,d),p,x,a,l,c);if(t==="glory"){for(let a of[-4,39])for(let l=3;l<60;l+=8)o(l,.5,a,4,1,1.4,"stone","#a6a08a"),o(l,.95,a,4.1,.12,1.5,"stone","#c6bda2"),r(new Zt(.15,.22,6,9),"metal","#655f4c",l,3,a-2),r(new wn(1.5,6,12),"fabric","#445d42",l,5,a-2);for(let a of[-4,64]){o(a,2,17.5,1,4,12,"stone","#c2b79d");for(let l=12;l<24;l+=3)r(new Zt(.28,.36,5,14),"stone","#d0c5ab",a,4,l)}}for(let a=4;a<57;a+=7)for(let l of[1.15,33.85]){o(a,.012,l,1,.02,.28,"metal","#35403e");for(let c=0;c<7;c++)o(a-.42+c*.14,.026,l,.045,.018,.25,"metal","#7e867c");r(new ei(.05+a%3*.025,0),"rock","#777a69",a+.7,.035,l+.04)}for(let a=2;a<33;a++)for(let l=2;l<58;l++)if(n[a][l]==="1"&&n[a-1][l]==="0"&&(l+a)%9===0){let c=r(new me(.55,1.1),"metal","#566154",l+.5,.58,a-.008);c.rotation.y=Math.PI}Mn(s)}var li=new Zt(1,1,1,20);li.userData.shared=!0;function ed(i,t){let e=new Dt,n=new Dt,s=new Dt,r=new Dt;e.name=i,e.add(n,s,r);let o=(g,m,f,A,v,y,R,b,T,P="gunmetal")=>{let M=new xt(m,t.get(P,f));return M.position.set(A,v,y),M.scale.set(R,b,T),g.add(M),M},a=(g,m,f,A,v,y,R,b,T)=>o(g,Ie,m,f,A,v,y,R,b,T),l=(g,m,f,A,v,y,R)=>{let b=o(g,li,m,f,A,v,y,R,y);return b.rotation.x=Math.PI/2,b},c="#27373d",h="#798884",u="#37453d",d;if(i==="axe"){let g=new Ke;g.moveTo(-.12,.07),g.lineTo(.04,.07),g.lineTo(.16,.15),g.lineTo(.2,.02),g.lineTo(.16,-.13),g.lineTo(.02,-.06),g.lineTo(-.12,-.06),g.closePath(),o(e,new sn(g,{depth:.045,bevelEnabled:!0,bevelSize:.006,bevelThickness:.004,bevelSegments:2,steps:1}),h,0,.17,-.16,1,1,1).geometry.translate(0,0,-.022),a(e,"#775f43",0,-.12,-.15,.035,.65,.036,"fabric"),a(e,c,0,-.39,-.15,.045,.1,.045,"rubber");for(let f=0;f<12;f++)a(e,"#343e37",0,-.09-f*.019,-.15,.04,.009,.042,"rubber");for(let f of[-.025,.025])o(e,li,"#a2a991",f,.17,-.16,.008,.06,.008);a(e,c,-.11,.18,-.16,.08,.045,.045),d=-.2}else if(i==="grenade"){o(e,new Me(1,20,14),"#4e6148",0,-.015,-.08,.075,.1,.068,"metal");for(let m=0;m<5;m++)for(let f=0;f<8;f++){let A=f*Math.PI/4,v=a(e,"#354a35",Math.cos(A)*.068,-.08+m*.032,-.08+Math.sin(A)*.062,.018,.023,.018);v.rotation.y=-A}a(e,h,0,.11,-.08,.042,.028,.045),a(e,h,.046,.044,-.08,.018,.16,.04).rotation.z=.25;let g=o(e,new Te(.025,.004,8,20),h,-.035,.12,-.08,1,1,1);g.rotation.y=Math.PI/2,d=-.1}else if(i==="pistol"){a(e,c,0,-.035,.015,.07,.075,.22),a(e,u,0,-.115,.07,.064,.17,.085,"rubber").rotation.x=-.23,a(s,"#17272b",0,-.198,.09,.07,.022,.09,"rubber"),a(s,"#65716b",0,-.14,.08,.05,.13,.065),a(n,"#71807b",0,.025,-.015,.078,.075,.235),l(e,"#18272b",0,.023,-.141,.022,.028),l(e,h,0,.023,-.15,.015,.012),a(n,"#26373b",.04,.028,.01,.005,.029,.06),a(n,h,.043,.028,.01,.003,.01,.038);for(let m of[-.04,.04])for(let f=0;f<7;f++)a(n,"#26373b",m,.025,.045+f*.011,.003,.048,.004);for(let m of[-.025,.025])a(n,c,m,.078,.075,.015,.032,.025);a(n,"#b1c7a2",0,.074,-.1,.009,.019,.012),a(e,h,.042,-.017,.072,.008,.012,.04);let g=o(e,new Te(.038,.006,8,20),c,0,-.077,-.018,1,1,1);g.rotation.y=Math.PI/2,a(e,c,0,-.063,-.01,.009,.034,.008).rotation.x=-.3,d=-.168}else{a(e,c,0,0,.01,.115,.135,.33),a(e,u,0,-.045,.285,.09,.14,.26,"rubber"),a(e,"#263633",0,-.055,.405,.1,.16,.04,"rubber"),l(e,h,0,.018,-.42,.027,.57),l(e,c,0,-.047,-.34,.023,.43),l(e,"#19272b",0,.018,-.713,.029,.025),a(n,"#605b49",0,-.026,-.33,.094,.095,.25,"rubber");for(let m=0;m<9;m++)a(n,c,0,-.025,-.44+m*.026,.097,.085,.008,"rubber");a(e,"#15272b",.06,.018,.025,.007,.048,.11),a(e,h,.065,.018,.025,.004,.016,.075),a(e,c,0,-.13,.09,.065,.2,.085,"rubber").rotation.x=-.15;for(let m=0;m<5;m++)a(e,"#7d8979",0,.079,-.12+m*.045,.08,.014,.012);a(e,"#c8d4aa",0,.065,-.65,.012,.04,.018);let g=o(e,new Te(.046,.007,8,20),c,0,-.107,.019,1,1,1);g.rotation.y=Math.PI/2,l(s,"#bb4233",-.03,-.11,-.04,.019,.065),l(s,"#c3a45f",-.03,-.11,-.008,.019,.012),d=-.735}for(let g of[-1,1]){let m=g<0?r:e,f=g<0?-.035:.035,A=g<0?i==="pistol"?.04:-.33:.105;o(m,ci,"#667369",g*.1,-.25,A+.13,.13,.31,.14,"fabric").rotation.z=g*.33,o(m,new Me(1,16,10),"#3c4b3e",f,-.1,A,.069,.065,.08,"fabric");for(let v=0;v<4;v++)o(m,ci,"#3c4b3e",f-.035+v*.023,-.12,A-.04,.021,.06,.03,"fabric").rotation.x=-.7}let p=new Rn("#ffb861",0,2,.9);p.position.set(0,.02,d),e.add(p);let x=new xt(new Me(1,6,4),new ae({color:"#ffdea0",transparent:!0,opacity:.8,depthWrite:!1,blending:An,toneMapped:!1}));return x.position.copy(p.position),x.scale.set(i==="shotgun"?.075:.035,.05,i==="shotgun"?.23:.1),e.add(x),{root:e,moving:n,magazine:s,support:r,light:p,flash:x}}function nd(i,t,e,n){if(t==="axe"||t==="grenade"){i.support.position.y=-n*.1;return}let s=e>=0&&e<600?Math.sin(Math.max(0,(e-80)/520)*Math.PI):0;i.moving.position.z=t==="pistol"?Math.max(0,1-e/105)*.038:s*.12,i.support.position.z=t==="shotgun"?s*.12:0,i.support.position.y=-n*.14,i.magazine.position.y=-n*.17,t==="shotgun"?(i.magazine.visible=n>0,i.magazine.position.set(-n*.09,-n*.17,n*.08),i.support.position.x=-n*.08):i.support.position.set(n*.035,-n*.17,n*.03)}function id(i,t,e){let n=i.root,s=new Dt;s.name="weapon-details",n.add(s);let r=(c,h,u,d,p,x,g,m)=>{let f=new xt(c,e.get("gunmetal",h));return f.position.set(u,d,p),f.scale.set(x,g,m),s.add(f),f};for(let c of[-1,1]){let h=c<0&&i.support||n,u=c<0?t==="rifle"?-.06:-.035:.035,d=c<0?t==="rifle"?-.27:t==="pistol"?.04:-.33:.105;for(let x=0;x<4;x++){let g=new xt(Ie,e.get("rubber","#3b493f"));g.position.set(u-.035+x*.023,-.051,d-.006),g.scale.set(.019,.013,.035),h.add(g)}let p=new xt(Ie,e.get("fabric","#6b7c67"));p.position.set(c*.08,-.175,d+.06),p.scale.set(.1,.022,.075),h.add(p)}if(t==="axe")for(let c of[-1,1]){r(Ie,"#d5d7bf",.16,.17,-.16+c*.029,.027,.2,.006).rotation.z=-.12;let h=r(li,"#c2b995",0,.17,-.16+c*.028,.012,.008,.012);h.rotation.x=Math.PI/2,r(Ie,"#9c8964",c*.02,-.12,-.15,.003,.28,.016)}else if(t==="grenade"){let c=r(li,"#8a9983",0,.096,-.08,.042,.023,.042);for(let h of[-1,1]){let u=r(li,"#bec5aa",h*.042,.105,-.08,.006,.018,.006);u.rotation.z=Math.PI/2}for(let h=0;h<3;h++)r(Ie,"#a59b62",-.02+h*.02,.015,-.146,.011,.025,.003)}if(i.root.userData.detailStandard="cohesive-080-r1",t==="axe"||t==="grenade"){i.detail=s;return}let o=t==="pistol"?.16:t==="shotgun"?.53:.47,a=t==="pistol"?.043:.069;for(let c of[-1,1]){for(let h of[-.09,.065]){let u=r(li,"#a4aba1",c*a,-.018,h,.009,.008,.009);u.rotation.z=Math.PI/2,r(Ie,"#283338",c*(a+.005),-.018,h,.003,.003,.012)}for(let h=0;h<5;h++)r(Ie,"#202d31",c*a,-.13+h*.018,.07,.005,.006,.052)}let l=r(Ie,"#172125",a+.002,.012,-.015,.004,.036,t==="pistol"?.045:.09);if(r(Ie,"#9ba99e",a+.008,.008,-.015,.009,.009,.04),t!=="pistol"){let c=r(li,"#81918d",0,.018,-o,.035,.025,.035);c.rotation.x=Math.PI/2,r(Ie,"#273c3b",-.075,.025,.11,.018,.018,.048),r(Ie,"#85958b",0,.091,-.11,.026,.022,.045)}else r(Ie,"#adba9d",-.023,.079,.074,.007,.008,.006),r(Ie,"#adba9d",.023,.079,.074,.007,.008,.006);i.detail=s}function sd(i,t,e){if(!i||t==="railway")return;i.userData.detailRevision="landmarks-2";let n=0,s=(c,h,u,d,p,x)=>{let g=new xt(c,e.get(h,u));return g.position.set(d,p,x),i.add(g),n++,g},r=(c,h,u,d,p,x,g="metal",m="#819184")=>s(new pe(d,p,x),g,m,c,h,u),o=(c,h,u,d,p,x="#8f9e8a",g=null)=>{let m=s(new Zt(d,d,p,16),"metal",x,c,h,u);return g&&m.rotation.set(...g),m},a=(c,h,u=.025,d="#8f9e8a")=>{let p=new I(...c),x=new I(...h),g=o(...p.clone().add(x).multiplyScalar(.5).toArray(),u,p.distanceTo(x),d);return g.quaternion.setFromUnitVectors(new I(0,1,0),x.sub(p).normalize()),g},l=(c,h,u,d,p=.025,x="#819184")=>{let g=s(new Te(d,p,8,48),"metal",x,c,h,u);return g.rotation.x=Math.PI/2,g};if(t==="freight"){for(let c of[11.55,12.45]){r(20,8.2,c,13,.16,.18,"paint","#b49d56"),r(20,7.63,c,13,.13,.18,"paint","#b49d56");for(let h=0;h<13;h++)a([13.7+h,7.68,c],[14.7+h,8.15,c],.045,"#af9654");for(let h of[19,21]){r(h,4,c,.14,7.7,.13,"metal","#6e7566");for(let u=.5;u<7.6;u+=.4)r(h,u,c,.52,.035,.08,"metal","#a39366")}}r(20,8.55,12,3.5,.12,1.8,"metal","#5f6c64");for(let c of[11.2,12.8]){a([18.3,9.05,c],[21.7,9.05,c]);for(let h=18.3;h<=21.8;h+=.85)a([h,8.55,c],[h,9.05,c])}r(18.85,7.6,12.85,1.15,1.3,.85,"paint","#647f7e");for(let c of[12.4,13.3])r(18.85,7.8,c,.92,.65,.025,"glass","#536c70");r(18.85,8.3,12.85,1.3,.12,1,"metal","#7b8e80"),o(20.8,7.4,12,.32,1.15,"#3d4b48",[Math.PI/2,0,0]);for(let c of[11.85,12.15])a([24,7.9,c],[24,3.7,c],.016,"#3e4640");for(let c of[11.65,12.35])o(24,3.8,c,.25,.065,"#8b865a",[Math.PI/2,0,0]);for(let c of[19,21])r(c,.15,12,.8,.3,1.7,"metal","#6c7567")}else if(t==="foundry"){for(let c=.6;c<4.6;c+=.52)r(20,c,10.12,3.65,.08,.07,"metal","#4e4a42"),r(20,c,13.88,3.65,.08,.07,"metal","#4e4a42");for(let c=3.8;c<9.6;c+=.48)l(20,c,12,.735,.025,"#847864");for(let c of[18.25,21.75]){for(let h=.5;h<5.2;h+=.5)l(c,h,12,.195,.025,"#a29375");r(c,2.7,10.28,.2,4.6,.15,"metal","#5b6257");for(let h=.5;h<4.9;h+=.3)r(c,h,10.16,.48,.035,.05,"metal","#8d927a")}for(let c of[10.15,13.85]){a([18.12,5.65,c],[21.88,5.65,c]),a([18.12,5.18,c],[21.88,5.18,c]);for(let h=18.12;h<22;h+=.75)a([h,4.8,c],[h,5.65,c])}o(20,4.2,12,1.4,.22,"#6f6d5c"),r(20,.22,10,3.3,.1,.24,"metal","#bfb284");for(let c=18.6;c<21.6;c+=.22){let h=r(c,.28,10,.11,.02,.2,"paint","#b99d58");h.rotation.y=.35}for(let c of[10.08,13.92])for(let h of[18.55,21.45])o(h,2,c,.07,1.4,"#5d5b4e");r(18.02,1.4,12,.05,1.5,.9,"metal","#5d6860");for(let c=0;c<6;c++)r(17.99,1+c*.14,12,.02,.035,.7,"metal","#959984")}else if(t==="plaza"){for(let c=.5;c<5.4;c+=.42)for(let h of[10.49,13.51])r(20,c,h,3,.014,.012,"stone","#8b8674");for(let c of[18.59,21.41])for(let h of[10.59,13.41])r(c,2.8,h,.18,5.1,.18,"stone","#d2c8ad");for(let c of[.42,5.25,5.7,8.42])r(20,c,12,c>6?2.65:3.35,.13,c>6?2.65:3.35,"stone","#c7bda3");for(let c of[10.48,13.52]){r(20,2.4,c,.77,1.5,.028,"glass","#465b59");for(let h of[19.56,20.44])r(h,2.4,c,.1,1.7,.13,"stone","#d0c4a7");r(20,3.22,c,1.03,.13,.16,"stone","#d0c4a7"),r(20,1.59,c,1.03,.13,.18,"stone","#d0c4a7"),r(20,2.4,c,.05,1.5,.05,"metal","#767c69")}for(let c=0;c<4;c++){let h=c*Math.PI/2,u=new I(Math.sin(h),0,Math.cos(h));a([20,10.3,12],[20+u.x*1.55,8.35,12+u.z*1.55],.024,"#8c9c81")}for(let c of[10.72,13.28])r(20,7.2,c,2.4,.035,.04,"metal","#ad9e73")}else if(t==="observatory"){for(let u=0;u<16;u++){let d=u*Math.PI/8,p=[];for(let x=0;x<=16;x++){let g=x/16*Math.PI/2;p.push(new I(20+Math.cos(d)*1.858*Math.sin(g),3.4+1.858*Math.cos(g),12+Math.sin(d)*1.858*Math.sin(g)))}s(new Tn(new xn(p),20,.014,5),"metal","#839aa3",0,0,0)}l(20,3.42,12,1.87,.045,"#788d97"),l(20,3.55,12,1.86,.03,"#8b9da3");let c=r(20,4.66,12.8,.67,1.25,.08,"rubber","#1c303b");c.rotation.x=-.55;for(let u of[19.6,20.4]){let d=r(u,4.69,12.79,.07,1.34,.09,"metal","#bbc8c9");d.rotation.x=-.55}l(21.02,6.4,12,.45,.045,"#718897").rotation.set(0,0,-.7),o(20.2,4.7,12,.59,.2,"#6b8292",[0,0,-.7]),r(20,1.17,10.08,.85,2.1,.045,"paint","#6c8590"),r(20.3,1.18,10.04,.04,.16,.06,"metal","#b8c5b9");for(let u of[18.42,21.58]){r(u,1.2,10.07,.38,.55,.04,"metal","#627e8b");for(let d=0;d<5;d++)r(u,1+d*.1,10.03,.32,.025,.035,"metal","#a8b9bd")}for(let u of[10.15,13.85])for(let d=18.15;d<22;d+=.74)a([d,3,u],[d,3.62,u],.017,"#809aa5");for(let u of[10.15,13.85])a([18.15,3.62,u],[21.85,3.62,u],.02,"#809aa5")}i.userData.detailParts=n}function vx(i){if(i.dieselFinish)return i.dieselFinish;let t=93,e=()=>(t=Math.imul(t,1664525)+1013904223>>>0,t/4294967296),n=document.createElement("canvas");n.width=n.height=512;let s=n.getContext("2d"),r=s.createImageData(512,512);for(let l=0;l<r.data.length;l+=4){let c=224+(e()-.5)*11;r.data[l]=r.data[l+1]=r.data[l+2]=c,r.data[l+3]=255}s.putImageData(r,0,0);for(let l=0;l<550;l++){s.strokeStyle=`rgba(75,77,67,${.015+e()*.055})`;let c=e()*512,h=e()*512;s.beginPath(),s.moveTo(c,h),s.lineTo(c+e()*24,h+e()*2),s.stroke()}let o=new Ue(n);o.colorSpace=ie,o.wrapS=o.wrapT=zn,o.anisotropy=4;let a={map:o};return i.dieselFinish=a,a}function cn(i,t,e,n=.7,s=.35){let r="diesel:"+t;if(i.cache.has(r))return i.cache.get(r);let o=new xe({...vx(i),color:e,roughness:n,metalness:s,envMapIntensity:.8});return o.userData.persistent=!0,o.userData.surface="locomotive",i.cache.set(r,o),o}function rd(i,t,e,n,s,r,o,a=0){let l=document.createElement("canvas");l.width=512,l.height=128;let c=l.getContext("2d");c.clearRect(0,0,512,128),c.fillStyle="#e8e5d4",c.font="500 76px monospace",c.textAlign="center",c.fillText(t,256,88,490);let h=new Ue(l);h.colorSpace=ie;let u=new xt(new me(r,o),new xe({map:h,transparent:!0,depthWrite:!1,roughness:.85,polygonOffset:!0,polygonOffsetFactor:-1}));u.position.set(e,n,s),u.rotation.y=a,i.add(u)}function Mx(){let i=document.createElement("canvas");i.width=512,i.height=128;let t=i.getContext("2d");t.fillStyle="#d2b75e",t.fillRect(0,0,512,128),t.fillStyle="#303631";for(let n=-128;n<640;n+=96)t.beginPath(),t.moveTo(n,0),t.lineTo(n+47,0),t.lineTo(n-81,128),t.lineTo(n-128,128),t.closePath(),t.fill();let e=new Ue(i);return e.colorSpace=ie,new xe({map:e,roughness:.78,metalness:.25})}function od(i){let t=new Dt;t.name="diesel-locomotive";let e=[],n=[],s=cn(i,"body","#405a5b",.67,.32),r=cn(i,"cream","#b9b6a1",.7,.25),o=cn(i,"frame","#353f3c",.82,.5),a=cn(i,"cast","#414b47",.82,.55),l=cn(i,"steel","#a3aaa0",.32,.85),c=cn(i,"dark","#222b29",.88,.25),h=cn(i,"safety","#d9bc6b",.64,.35),u="diesel:glass";if(!i.cache.has(u)){let _=new Ei({color:"#385962",roughness:.13,metalness:.12,clearcoat:1,transparent:!0,opacity:.76,depthWrite:!1,side:we});_.userData.persistent=!0,i.cache.set(u,_)}let d=i.cache.get(u),p="diesel:headlight";if(!i.cache.has(p)){let _=new xe({color:"#fff1cc",emissive:"#e9c788",emissiveIntensity:.65,roughness:.15,metalness:.1});_.userData.persistent=!0,i.cache.set(p,_)}let x=i.cache.get(p),g=cn(i,"tail-lamp","#aa5240",.18,.1);g.emissive.set("#7c2012"),g.emissiveIntensity=.35;function m(_,S,D,L,z,F){let H=new xt(S,D);return H.position.set(L,z,F),H.castShadow=H.receiveShadow=!0,_.add(H),H}function f(_,S,D,L,z,F,H,q,G=0){return m(_,G?new ai(F,H,q,1,G):new pe(F,H,q),S,D,L,z)}function A(_,S,D,L,z,F,H,q="y",G=16){let lt=m(_,new Zt(F,F,H,G),S,D,L,z);return q==="z"&&(lt.rotation.x=Math.PI/2),q==="x"&&(lt.rotation.z=Math.PI/2),lt}function v(_,S,D,L,z=.025){let F=new I(...D),H=new I(...L),q=H.clone().sub(F),G=m(_,new Zt(z,z,q.length(),8),S,...F.clone().add(H).multiplyScalar(.5).toArray());return G.quaternion.setFromUnitVectors(new I(0,1,0),q.normalize()),G}function y(_,S,D,L,z,F,H=.025,q="z"){let G=m(_,new Te(F,H,6,24),S,D,L,z);return q==="y"&&(G.rotation.x=Math.PI/2),q==="x"&&(G.rotation.y=Math.PI/2),G}f(t,o,0,1.18,0,10.7,.25,3.45,.025);for(let _ of[-1.35,1.35])f(t,o,0,.99,_,10,.26,.16);f(t,o,0,.67,0,3,.68,1.72,.08);for(let _ of[-1.24,1.24])f(t,l,_,.66,0,.07,.61,1.76);A(t,l,.8,.85,1.03,.1,.22,"z"),f(t,c,-.65,.49,0,1.2,.18,1.4,.03);for(let _ of[-3.12,3.12]){let S=new Dt;S.position.set(_,.14,0),S.name="bogie",t.add(S),f(S,a,0,.68,0,2.5,.3,2.12,.06),f(S,c,0,.82,0,1.45,.12,1.45);for(let D of[-1,1]){f(S,a,0,.64,D*1.04,2.48,.28,.17,.045);for(let L of[-.76,.76]){f(S,a,L,.6,D*1.06,.4,.4,.22,.045),A(S,l,L,.58,D*1.2,.11,.055,"z");let z=[];for(let F=0;F<=32;F++){let H=F/32*Math.PI*6;z.push(new I(Math.cos(H)*.105,F/32*.33,Math.sin(H)*.105))}m(S,new Tn(new xn(z),28,.024,5,!1),l,L,.77,D*.99)}A(S,a,0,.53,D*1.13,.085,.7,"x"),v(S,l,[-1.1,.4,D*.97],[1.1,.4,D*.97],.027)}for(let D of[-.76,.76]){A(S,l,D,.56,0,.085,1.74,"z"),f(S,a,D,.66,0,.42,.3,.84,.035);for(let L of[-1,1]){let z=new Dt;z.position.set(D,.56,L*.82),S.add(z),e.push(z),A(z,l,0,0,0,.48,.18,"z",28),A(z,a,0,0,L*.1,.36,.035,"z",24),A(z,l,0,0,L*.14,.15,.1,"z",20),y(z,l,0,0,L*.125,.38,.022),A(z,l,0,0,-L*.1,.495,.028,"z",28);for(let F=0;F<6;F++){let H=F*Math.PI/3;A(z,l,Math.cos(H)*.23,Math.sin(H)*.23,L*.13,.023,.025,"z",6)}f(S,c,D+.38,.57,L*.78,.09,.27,.18,.015)}}}for(let _ of[-1,1]){f(t,a,0,1.36,_*1.58,10.65,.065,.5,.012);for(let S=-5;S<5.1;S+=.24)f(t,l,S,1.398,_*1.58,.028,.012,.42)}let R=new Ke;R.moveTo(-1.22,0),R.lineTo(1.22,0),R.lineTo(1.22,1.3),R.lineTo(.98,1.55),R.lineTo(-.98,1.55),R.lineTo(-1.22,1.3),R.closePath();let b=new sn(R,{depth:6.85,bevelEnabled:!0,bevelSize:.025,bevelThickness:.025,bevelSegments:1,steps:1});b.rotateY(Math.PI/2),m(t,b,s,-2.02,1.46,0),f(t,s,5.03,2.15,0,.38,1.35,2.38,.035),f(t,r,5.233,1.98,0,.025,.17,2.3),f(t,s,-4.94,1.89,0,.75,.91,2.63,.04),f(t,r,-4.94,2.37,0,.79,.1,2.66,.025);for(let _ of[-1,1]){f(t,r,1.38,1.98,_*1.235,6.78,.17,.024);for(let S=0;S<5;S++){let D=-1.43+S*.71;f(t,s,D,2.32,_*1.25,.65,1.12,.025,.008);for(let L of[D-.325,D+.325])f(t,a,L,2.3,_*1.27,.012,1.14,.012);v(t,l,[D+.2,2.16,_*1.3],[D+.2,2.39,_*1.3],.016);for(let L of[1.86,2.73])f(t,l,D-.24,L,_*1.28,.045,.055,.025,.005)}f(t,c,3.49,2.29,_*1.254,1.82,1.14,.035);for(let S=0;S<22;S++)f(t,a,2.64+S*.081,2.29,_*1.29,.029,1.08,.055);for(let S of[1.72,2.86])f(t,l,3.49,S,_*1.28,1.9,.035,.04);rd(t,"CF 040",1,2.82,_*1.282,1.23,.28,_<0?Math.PI:0)}f(t,s,-3.25,2.1,0,2.78,1.34,3.02,.045),f(t,r,-3.25,2.88,0,2.81,.22,3.05,.025);let T=new Ke;T.moveTo(-4.76,4.02),T.lineTo(-4.56,4.3),T.lineTo(-1.98,4.3),T.lineTo(-1.75,4.02),T.closePath();let P=new sn(T,{depth:3.23,bevelEnabled:!0,bevelSize:.035,bevelThickness:.025,bevelSegments:1});m(t,P,r,0,0,-1.615);for(let _ of[-1,1]){for(let D of[-4.55,-3.55,-1.96])f(t,r,D,3.51,_*1.49,.085,1.05,.11,.012);f(t,r,-3.25,3,_*1.51,2.66,.075,.11),f(t,r,-3.25,4,_*1.51,2.66,.065,.11);let S=m(t,new me(2.48,.88),d,-3.25,3.5,_*1.518);_<0&&(S.rotation.y=Math.PI),f(t,a,-3.26,3.5,_*1.533,.035,.88,.025),f(t,a,-4.05,2.16,_*1.524,.015,1.25,.015),f(t,a,-2.53,2.16,_*1.524,.015,1.25,.015),v(t,l,[-2.75,2.26,_*1.57],[-2.75,2.5,_*1.57],.022),rd(t,"040",-3.25,2.37,_*1.55,.7,.25,_<0?Math.PI:0),f(t,c,-3.36,2.72,_*.65,.64,.16,.59,.045),f(t,c,-3.6,3.04,_*.65,.16,.63,.6,.045),A(t,l,-3.36,2.38,_*.65,.045,.6),f(t,a,-2.28,2.97,_*.56,.38,.34,.82,.025),v(t,r,[-3,3.91,_*1.62],[-3,4,_*1.94],.025),f(t,c,-3,3.94,_*1.9,.24,.3,.065,.025)}for(let _ of[-1,1]){let S=new Dt;S.position.set(_>0?-1.91:-4.61,3.5,0),S.rotation.z=_>0?.18:-.07,t.add(S);for(let D of[-1,1]){let L=D*.71;for(let F of[L-.64,L+.64])f(S,c,0,0,F,.08,1.02,.045,.008);for(let F of[-.49,.49])f(S,c,0,F,L,.08,.055,1.32,.008);let z=m(S,new me(1.24,.91),d,_*.045,0,L);z.rotation.y=_>0?Math.PI/2:-Math.PI/2,v(S,c,[_*.075,-.43,L-.25],[_*.075,.25,L+.2],.012),v(S,c,[_*.085,.12,L+.09],[_*.085,.38,L+.33],.018)}f(S,r,0,0,0,.11,1.03,.1,.012)}f(t,c,-3,4.36,0,.78,.12,.62,.025),A(t,l,-3.6,4.58,0,.025,.48),f(t,r,-3.6,4.83,0,.05,.025,.05);for(let _ of[3.12,4.18]){A(t,c,_,3.065,0,.47,.07,"y",28),y(t,l,_,3.12,0,.46,.025,"y");let S=new Dt;S.position.set(_,3.125,0),t.add(S),n.push(S),A(S,l,0,0,0,.105,.07,"y");for(let D=0;D<7;D++){let L=D*Math.PI*2/7,z=f(S,a,Math.cos(L)*.25,0,Math.sin(L)*.25,.4,.025,.12,.012);z.rotation.y=-L+.22}for(let D of[-.3,-.15,0,.15,.3])v(t,a,[_-.39,3.17,D],[_+.39,3.17,D],.012)}for(let _ of[-.35,.35])A(t,o,-.18,3.26,_,.105,.43),y(t,l,-.18,3.48,_,.105,.014,"y");for(let _ of[-1,1]){for(let S of[-4.85,-3.6,-2.4,-1.2,0,1.2,2.4,3.6,4.85])v(t,h,[S,1.42,_*1.82],[S,2.24,_*1.82],.025);for(let S of[1.83,2.24])v(t,h,[-4.85,S,_*1.82],[4.85,S,_*1.82],.025);for(let S of[-1,1]){for(let D=0;D<4;D++)f(t,a,S*(5.31-D*.055),.31+D*.27,_*1.78,.48,.065,.42,.01);v(t,h,[S*5.35,.57,_*1.9],[S*4.85,2.24,_*1.82],.028),A(t,o,S*5.3,2.52,_*.67,.18,.12,"x",24),A(t,S>0?x:g,S*5.38,2.52,_*.67,.135,.025,"x",24)}}let M=Mx();for(let _ of[-1,1]){f(t,o,_*5.31,1.09,0,.23,.42,3.82,.025);let S=m(t,new me(3.7,.34),M,_*5.435,1.09,0);S.rotation.y=_>0?Math.PI/2:-Math.PI/2;for(let L of[-1.05,1.05])A(t,o,_*5.56,.94,L,.09,.28,"x"),A(t,l,_*5.73,.94,L,.2,.07,"x",24);f(t,a,_*5.69,.86,0,.48,.28,.28,.035),f(t,l,_*5.94,.87,.08,.1,.22,.27,.025),A(t,l,_*5.91,1,0,.034,.3),f(t,a,_*5.96,.86,-.12,.08,.13,.16,.018);let D=[[_*5.42,1.03,.47],[_*5.57,.6,.51],[_*5.73,.43,.45],[_*5.79,.65,.35]].map(L=>new I(...L));m(t,new Tn(new xn(D),16,.035,7),c,0,0,0),f(t,h,_*5.45,1.09,.48,.045,.1,.11,.012);for(let L of[-.39,.39])A(t,o,_*5.31,1.84,L,.095,.08,"x");if(_>0)for(let L of[-1,1]){let z=[5.81,.22,0,5.48,.22,L*1.62,5.45,.84,L*1.62,5.76,.84,0],F=new ue;F.setAttribute("position",new zt(z,3)),F.setIndex(L>0?[0,2,1,0,3,2]:[0,1,2,0,2,3]),F.computeVertexNormals();let H=m(t,F,o,0,0,0);H.material=o,v(t,l,[5.81,.22,0],[5.48,.22,L*1.62],.025)}}return t.userData.model="compact-diesel-shunter",t.userData.axles=4,t.userData.nominalEnvelope=[12,4,4.86],{root:t,wheels:e,fans:n}}function ad(i,t,e){let n=cn(e,"timber","#625e4c",.94,.02),s=cn(e,"rail","#9ba49a",.3,.85),r=cn(e,"rail-web","#606c64",.66,.75),o=cn(e,"rail-clips","#3e4942",.8,.6),a=e.cache.get("diesel:ballast");if(!a){let h=document.createElement("canvas");h.width=h.height=512;let u=h.getContext("2d");u.fillStyle="#76776b",u.fillRect(0,0,512,512);let d=71,p=()=>(d=Math.imul(d,1664525)+1013904223>>>0,d/4294967296);for(let g=0;g<6e3;g++){let m=Math.floor(65+p()*91);u.fillStyle=`rgb(${m},${m+3},${m-6})`,u.beginPath(),u.ellipse(p()*512,p()*512,1+p()*4,1+p()*3,p()*6.28,0,6.28),u.fill()}let x=new Ue(h);x.wrapS=x.wrapT=zn,x.repeat.set(t/3.5,1),x.colorSpace=ie,x.anisotropy=4,a=new xe({map:x,roughness:1,metalness:0}),a.userData.persistent=!0,e.cache.set("diesel:ballast",a)}let l=new xt(new me(t,3.6),a);l.rotation.x=-Math.PI/2,l.position.set(20,.009,12),l.receiveShadow=!0,i.add(l);let c=(h,u,d,p,x,g,m)=>{let f=new xt(new pe(x,g,m),h);return f.position.set(u,d,p),f.castShadow=f.receiveShadow=!0,i.add(f),f};for(let h of[11.28,12.72])c(r,20,.095,h,t,.03,.16),c(r,20,.15,h,t,.08,.035),c(s,20,.205,h,t,.03,.075);for(let h=20-t/2+.25;h<20+t/2;h+=.58){c(n,h,.04,12,.22,.08,2.6);for(let u of[11.28,12.72]){c(o,h,.092,u,.28,.025,.29);for(let d of[-1,1]){c(o,h,.128,u+d*.104,.12,.04,.04);let p=new xt(new Zt(.023,.023,.022,6),s);p.position.set(h,.116,u+d*.115),i.add(p)}}}}function cd(i){let t=new Dt;t.name="container-wagons";let e=[],n=(s,r,o,a,l,c,h,u,d="metal")=>{let p=new xt(new ai(l,c,h,1,.03),i.get(d,u));return p.position.set(r,o,a),s.add(p),p};for(let s=0;s<2;s++){let r=new Dt;r.name="wagon-"+(s+1),r.position.x=-12*(s+1),t.add(r),n(r,0,.85,0,11.5,.35,3.5,"#384446"),n(r,0,.63,0,12.3,.15,.3,"#263439"),n(r,0,2.35,0,10.8,2.6,3.25,s?"#816451":"#587d81","paint");for(let o=-5.2;o<5.3;o+=.42)for(let a of[-1.64,1.64])n(r,o,2.35,a,.055,2.5,.035,"#4b5b5a");for(let o of[-5.4,5.4])for(let a of[-1.6,1.6])n(r,o,2.35,a,.13,2.6,.13,"#79887c");for(let o of[-.85,.85])n(r,-5.43,2.35,o,.04,2.5,1.5,"#7c8272","paint"),n(r,-5.48,2.35,o,.05,2.3,.055,"#a0a48e");for(let o of[-3.8,3.8]){n(r,o,.5,0,2.1,.3,2.7,"#2f3b3c");for(let a of[-.65,.65])for(let l of[-1.38,1.38]){let c=new xt(new Zt(.45,.45,.22,16),i.get("metal","#303a3e"));c.rotation.x=Math.PI/2,c.position.set(o+a,.45,l),r.add(c),e.push(c)}}for(let o of[-1.3,1.3])n(r,-5.75,.95,o,.035,.12,.22,"#ae4e3d","paint")}return{root:t,wheels:e}}var Ss,av=Math.PI*2,wr=(i,t,e)=>i+(t-i)*e,Ee=Ie,wl=new Me(1,24,16),Tl=new Zt(1,1,1,20),Cr={box:Ee,sphere:wl,cylinder:Tl,capsule:ci,...Sr},ld={...Cr,sphere:new Me(1,16,10),cylinder:new Zt(1,1,1,12),capsule:new Mi(.5,1,4,8).scale(1,.5,1)},bx={...ld,sphere:new Me(1,10,7),cylinder:new Zt(1,1,1,8)};for(let i of Object.values(Cr))i.userData.shared=!0;var Tr=new ge,Ex=new Nt,Ga=class{constructor(t,e,n,s){this.mesh=new Ve(e,s,n),this.mesh.count=0,this.items=[],this.mesh.instanceMatrix.setUsage(Xc),this.mesh.frustumCulled=!1,this.mesh.castShadow=!1,this.mesh.receiveShadow=!0,t.add(this.mesh)}add(t,e){let n=this.mesh.count++;if(n>=this.mesh.instanceMatrix.count)throw Error("Character instance buffer full");this.mesh.setMatrixAt(n,t),this.mesh.setColorAt(n,Ex.set(e))}commit(){this.mesh.instanceMatrix.needsUpdate=!0,this.mesh.instanceColor&&(this.mesh.instanceColor.needsUpdate=!0)}};function Rr(i){return Ss.get("metal",i)}function Sx(i,t,e,n,s,r,o,a,l,c){let h=new ge;h.position.set(n,s,r),h.scale.set(o,a,l),i.add(h);let u=e==="#bf967c"?"skin":["#1c2a30","#323d41","#263338","#394f54"].includes(e)?"metal":"fabric";return c.push({node:h,geometry:t,tint:e,surface:u,micro:Math.max(o,a,l)<.12}),h}function wx(i,t,e,n){let s=new Dt;return s.position.set(t,e,n),i.add(s),s}function Tx(i){return Na(i,Sx,wx)}var Rl=class{constructor(t){this.canvas=t,this.renderer=new Ia({canvas:t,alpha:!1,antialias:!0,powerPreference:"high-performance"}),this.renderer.outputColorSpace=ie,this.renderer.toneMapping=Vo,this.renderer.toneMappingExposure=1.1,this.renderer.autoClear=!1,this.renderer.shadowMap.type=Bo,this.renderer.shadowMap.autoUpdate=!1,this.surfaces=Ss=new Ba(this.renderer),this.scene=new ss,this.scene.fog=new Zs("#b6beb7",.009),this.ambient=new us("#c7d8e1","#687562",1.9),this.scene.add(this.ambient),this.sun=new ds("#ffe0b0",3),this.sun.position.set(10,45,4),this.sun.target.position.set(30,0,17.5),this.scene.add(this.sun,this.sun.target),this.sun.castShadow=!0,Object.assign(this.sun.shadow.camera,{left:-43,right:43,top:34,bottom:-34,near:.5,far:120}),this.sun.shadow.bias=-12e-5,this.sun.shadow.normalBias=.04,this.sun.shadow.radius=2,this.camera=new De(60,1,.045,190),this.actors=new Map,this.mapKey="",this.staticRoot=new Dt,this.scene.add(this.staticRoot),this.batches={},this.skies=new Map,this.weaponScene=new ss,this.weaponScene.add(new us("#dfebee","#68775c",2.2));let e=new ds("#ffe3b8",2.2);e.position.set(-2,4,3),this.weaponScene.add(e),this.weaponCamera=new De(58,1,.01,10),this.weapon=new Dt,this.weaponScene.add(this.weapon),this.createRifle(),this.weaponModels={rifle:{root:this.weapon,flash:this.flash,light:this.muzzleLight,support:this.rifleSupport}};for(let s of["axe","pistol","shotgun","grenade"]){let r=ed(s,this.surfaces);this.weaponModels[s]=r,r.root.visible=!1,this.weaponScene.add(r.root)}for(let[s,r]of Object.entries(this.weaponModels))id(r,s,this.surfaces);this.prepareReflections(),this.localLights=[],this.quality=0,this.lastShadow=-1e3,this.shadowDirty=!0,this.setQuality(4);let n=new ae({map:vl(),transparent:!0,depthWrite:!1,opacity:.65});this.actorShadows=new Ve(new me(1.1,1.1),n,6),this.actorShadows.count=0,this.actorShadows.frustumCulled=!1,this.scene.add(this.actorShadows),this.trajectory=new Da(this.scene),this.throwTrails=new Ua(this.scene),this.axeEffects=new za(this.scene),this.combatEffects=new ka(this.scene),this.worldEffects=new Ha(this),this.lastTime=0,this.width=1,this.height=1,this.scale=1,this.weaponSway=new Map,this.autoScale=1,this.frameCounter=0,this.frameBudget=32,t.addEventListener("webglcontextlost",s=>{s.preventDefault(),this.lost=!0}),t.addEventListener("webglcontextrestored",()=>{this.prepareReflections(this.arenaId||"freight"),this.shadowDirty=!0,this.lost=!1})}prepareReflections(t="freight"){let e=yl(t),n=new vs(this.renderer);this.environmentTarget?.dispose(),this.environmentTarget=n.fromEquirectangular(e),this.reflectionMap=t,e.dispose(),n.dispose(),this.scene.environment=this.weaponScene.environment=this.environmentTarget.texture}setQuality(t){if(this.quality===t)return;this.quality=t,this.autoScale=1,this.frameCounter=0,this.frameBudget=32,this.renderer.shadowMap.enabled=t!==6;let e=t===2?2048:1024;this.sun.shadow.mapSize.x!==e&&(this.sun.shadow.map?.dispose(),this.sun.shadow.map=null,this.sun.shadow.mapSize.set(e,e)),this.surfaces.quality(t),this.shadowDirty=!0;for(let n of this.localLights||[])n.visible=t!==6;for(let n of Object.values(this.batches))n.mesh.castShadow=t!==6}createRifle(){this.rifleSupport=new Dt,this.rifleMagazineGroup=new Dt,this.weapon.add(this.rifleSupport,this.rifleMagazineGroup);let t=(a,l,c,h,u,d,p,x)=>{let g=["#455f4d","#647566"].includes(l)?"fabric":l==="#102329"?"rubber":"gunmetal",m=new xt(a,Ss.get(g,l));return m.position.set(c,h,u),m.scale.set(d,p,x),this.weapon.add(m),m};t(Ee,"#24373f",0,0,0,.13,.14,.42),t(Ee,"#667a78",0,.045,-.19,.105,.09,.3),t(Ee,"#26383e",0,-.03,.3,.115,.14,.23),t(Ee,"#102329",0,-.12,.065,.075,.22,.09).rotation.x=-.16,this.rifleMagazine=t(Ee,"#3a5053",0,-.14,-.08,.085,.21,.13),this.rifleMagazine.rotation.x=.12,this.rifleMagazineGroup.add(this.rifleMagazine);let e=t(Tl,"#233038",0,.018,-.51,.025,.37,.025);e.rotation.x=Math.PI/2;let n=t(Tl,"#6e7e7a",0,.018,-.705,.032,.065,.032);n.rotation.x=Math.PI/2,t(Ee,"#1e2f35",0,.105,-.03,.045,.04,.1),t(Ee,"#91ad9e",-.026,.155,-.03,.013,.065,.035),t(Ee,"#91ad9e",.026,.155,-.03,.013,.065,.035),t(Ee,"#91ad9e",0,.185,-.03,.065,.012,.035),t(Ee,"#344b50",0,.139,-.36,.022,.08,.03),t(Ee,"#c8ff66",0,.178,-.36,.014,.02,.022);for(let a=0;a<8;a++)t(Ee,"#25373e",0,.098,-.34+a*.044,.115,.012,.018);for(let a of[-.07,.07])t(Ee,"#9bb09c",a,0,-.02,.014,.05,.09);t(wl,"#455f4d",.08,-.13,.14,.08,.11,.1),t(Ee,"#647566",.13,-.25,.23,.14,.28,.18).rotation.z=.32,this.rifleSupport.add(t(wl,"#455f4d",-.06,-.09,-.27,.085,.07,.09));let s=t(Ee,"#647566",-.14,-.22,-.18,.14,.29,.16);s.rotation.z=-.43,this.rifleSupport.add(s),t(Ee,"#182c26",.073,.012,.04,.008,.05,.1),t(Ee,"#b5a478",.079,.012,.04,.006,.013,.07),t(Ee,"#a1ad96",.079,-.037,.13,.012,.022,.034);for(let a=0;a<4;a++)this.rifleMagazineGroup.add(t(Ee,"#7b8a70",0,-.08-a*.055,-.14,.077,.012,.01));for(let a of[-1,1]){for(let l=0;l<5;l++)t(Ee,"#1e332c",a*.061,.01,-.33+l*.05,.007,.035,.023);for(let l=0;l<4;l++){let c=t(ci,"#455f4d",a*.065-.04+l*.027,-.1,a>0?.08:-.3,.024,.07,.03);c.rotation.x=-.6,a<0&&this.rifleSupport.add(c)}}let r=new xt(new Te(.043,.007,8,20),Rr("#7d8b73"));r.position.set(0,-.11,.04),r.rotation.y=Math.PI/2,this.weapon.add(r),this.muzzleLight=new Rn("#ffb861",0,2,.9),this.muzzleLight.position.set(0,.018,-.79),this.weapon.add(this.muzzleLight);let o=new ae({color:"#ffdea0",transparent:!0,opacity:.8,depthWrite:!1,blending:An,toneMapped:!1});this.flash=new xt(new Me(1,6,4),o),this.flash.position.set(0,.018,-.79),this.flash.scale.set(.045,.045,.15),this.weapon.add(this.flash)}loadMap(t,e={}){let n=t.join("");if(this.mapKey===n&&this.arenaId===e.id)return;this.mapKey=n,this.arenaId=e.id,this.collisionGrid=t,this.mapWidth=t[0].length,this.mapDepth=t.length;let s=e.id==="observatory";this.skies.has(e.id)||this.skies.set(e.id,yl(e.id)),this.scene.background=this.skies.get(e.id),this.reflectionMap!==e.id&&this.prepareReflections(e.id),this.scene.fog.color.set(s?"#738493":"#b6beb7"),this.scene.fog.density=s?.011:.009,this.sun.color.set(s?"#d0dcf0":"#ffe0b0"),this.sun.intensity=s?1.8:3,this.ambient.color.set(s?"#a9bfdf":"#c7d8e1");let r=new Set,o=new Set,a=new Set;if(this.staticRoot.traverse(c=>{if(!(!c.isMesh&&!c.isSprite)){if(c.geometry&&!c.geometry.userData.shared&&!c.isSprite&&r.add(c.geometry),!c.material.userData.persistent){o.add(c.material);for(let h of Object.values(c.material))h?.isTexture&&a.add(h)}c.isInstancedMesh&&c.dispose()}}),r.forEach(c=>c.dispose()),o.forEach(c=>c.dispose()),a.forEach(c=>c.dispose()),this.staticRoot.clear(),this.heatMeshes=[],this.monumentFlag=null,e.id==="foundry")for(let c=0;c<3;c++){let h=new Dt,u=new xt(new $s(1,48),new ae({color:"#ff2418",transparent:!0,opacity:.45,depthWrite:!1,side:we,toneMapped:!1}));u.rotation.x=-Math.PI/2,h.add(u);let d=new xt(new ni(.94,1,48),new ae({color:"#ff6655",side:we,depthWrite:!1,toneMapped:!1}));d.rotation.x=-Math.PI/2,d.position.y=.005,h.add(d),h.visible=!1,this.staticRoot.add(h),this.heatMeshes.push(h)}this.trainRoot=null,this.trainWheels=[],this.trainFans=[],this.trackLights=[];for(let c of this.localLights)this.scene.remove(c);if(this.localLights=[],Gu(this.staticRoot,t,e,this.surfaces),this.landmark(e.id||"freight"),sd(this.staticRoot.getObjectByName("landmark-"+(e.id||"freight")),e.id||"freight",this.surfaces),Ku(this.staticRoot,e.id,this.surfaces),td(this.staticRoot,e.id,this.surfaces,t),Zu(this.staticRoot,t,e,this.surfaces),Ju(this.staticRoot.getObjectByName("landmark-"+e.id),e.id,this.surfaces),this.mechanisms=ju(this.staticRoot,e.id,this.surfaces,this.staticRoot.getObjectByName("landmark-"+e.id)),Mn(this.staticRoot.getObjectByName("landmark-"+(e.id||"freight")),new Set([...this.trackLights,...this.trainWheels,...this.trainFans,...this.monumentFlag?[this.monumentFlag.root]:[]])),this.staticRoot.traverse(c=>{c.isMesh&&!c.material.transparent&&(c.castShadow=!0,c.receiveShadow=!0)}),s||e.id==="foundry"){let c=new Rn(s?"#88c0ef":"#ff8e38",s?18:35,15,2);c.position.set(30,3.1,s?15:14.9),c.visible=this.quality!==6,this.scene.add(c),this.localLights.push(c)}let l=Pn[e.id]||Pn.railway;this.scene.fog.color.set(l.fog),this.scene.fog.density=.0075,this.sun.color.set(l.sun),this.ambient.groundColor.set(e.id==="foundry"?"#62584b":"#5e6c5d"),this.ambient.intensity=1.05,this.sun.intensity=2.8,this.renderer.toneMappingExposure=l.exposure,Nu(this.staticRoot,this.surfaces,new Set([this.trainRoot,...this.trackLights,...this.heatMeshes,this.monumentFlag?.root,this.mechanisms?.load,this.mechanisms?.trolley,...this.mechanisms?.cables||[],this.mechanisms?.hand,this.mechanisms?.dome].filter(Boolean))),this.shadowDirty=!0}landmark(t){let e=new Dt;e.name="landmark-"+t,e.position.set(this.mapWidth/2-20,0,this.mapDepth/2-12),this.staticRoot.add(e);let n=(o,a,l,c,h)=>{let u=["#7dd5e9","#bbccbf"].includes(a)?"glass":t==="plaza"?"stone":t==="observatory"?"paint":"metal",d=new xt(o,Ss.get(u,a));return d.position.set(l,c,h),e.add(d),d},s=(o,a,l,c,h,u,d)=>n(new pe(h,u,d),o,a,l,c),r=(o,a,l,c,h,u)=>n(new Zt(h,h,u,12),o,a,l,c);if(t==="freight"){s("#d6a24a",19,4,12,.38,8,.42),s("#d6a24a",21,4,12,.38,8,.42),s("#dfb653",20,8,12,13,.5,.7),s("#4a6268",20,7.5,12,3,1.2,1.2),s("#2d3a3e",24,5.7,12,.045,4.5,.045),r("#cda347",24,3.4,12,.17,.45);for(let o=0;o<8;o++){let a=s("#b4893d",15+o*1.4,7.6,12,.09,1.1,.09);a.rotation.z=o%2?.65:-.65}}else if(t==="foundry"){s("#473e39",20,.12,12,4,.24,5),s("#473e39",20,2.4,12,3.7,4.8,3.7),r("#6c6158",20,6.4,12,.72,6),r("#3d3b38",20,9.6,12,.95,.38);for(let o of[10.12,13.88]){let a=s("#ff9c31",20,2,o,2.5,1.1,.04);a.material.dispose(),a.material=new ae({color:"#ff9829"})}for(let o of[18.25,21.75])r("#aa734a",o,2.7,12,.18,5.4);s("#dd9f44",20,4.7,12,4,.17,4)}else if(t==="plaza"){s("#b9ac8d",20,.15,12,4,.3,5),s("#b9ac8d",20,2.7,12,3,5.4,3),s("#6b6255",20,5.6,12,3.4,.3,3.4),s("#d3c3a1",20,7,12,2.5,2.8,2.5);let o=n(new wn(2.2,2,4),"#557a73",20,9.3,12);o.rotation.y=Math.PI/4,r("#c7ac60",20,10.7,12,.045,1.1);for(let a=0;a<4;a++){let l=new Dt;l.position.set(20,7.2,12),l.rotation.y=a*Math.PI/2,e.add(l);let c=new xt(new Zt(.88,.88,.05,32),Rr("#e5dfb6"));c.rotation.x=Math.PI/2,c.position.z=1.27,l.add(c);let h=new xt(new pe(.07,.64,.06),Rr("#273a3c"));h.position.set(0,.23,1.32),h.rotation.z=-.45,l.add(h);let u=new xt(new pe(.5,.07,.06),Rr("#273a3c"));u.position.set(.17,0,1.33),l.add(u);for(let d=0;d<12;d++){let p=new xt(new pe(.045,.1,.04),Rr("#273a3c"));p.position.set(Math.sin(d*Math.PI/6)*.72,Math.cos(d*Math.PI/6)*.72,1.32),p.rotation.z=-d*Math.PI/6,l.add(p)}}}else if(t==="glory"){s("#999581",20,.18,12,4,.36,5),s("#b9b29c",20,.8,12,3.6,1.25,4.5),s("#d0c5a9",20,1.55,12,4,.25,4.8),this.monumentFlag=qu(e);let o=new xt(new ni(7.85,8,96),new ae({color:"#52c9ed",transparent:!0,opacity:.6,side:we,depthWrite:!1}));o.rotation.x=-Math.PI/2,o.position.set(20,.025,12),e.add(o)}else if(t==="observatory"){s("#d1dce0",20,.12,12,4,.24,5),s("#d1dce0",20,1.7,12,3.8,3.4,3.8),n(new Me(1.85,24,12,0,Math.PI*2,0,Math.PI/2),"#b9ccd3",20,3.4,12);let o=r("#3e637e",20,5.2,12,.38,3.3);o.rotation.z=-.7;let a=r("#7dd5e9",21.08,6.48,12,.43,.12);a.rotation.z=-.7,s("#263f59",20,3.45,12,.14,.1,3.9),r("#95aab9",18.3,3.8,10.3,.055,7.6)}else if(t==="railway"){let o=od(this.surfaces);o.root.position.set(20,0,12),this.trainRoot=new Dt,this.trainRoot.name="moving-train";let a=cd(this.surfaces);a.root.position.set(20,0,12),Mn(a.root,new Set(a.wheels)),o.wheels.push(...a.wheels),this.trainRoot.add(a.root),this.trainRoot.add(o.root),e.add(this.trainRoot),this.trainRoot.visible=!1,this.trainWheels=o.wheels,this.trainFans=o.fans,ad(e,this.mapWidth,this.surfaces);for(let l of[9.7,14.3])for(let c=21-this.mapWidth/2;c<20+this.mapWidth/2;c+=1){let h=s(c%2?"#edb44c":"#343a32",c,.025,l,.8,.04,.2);h.rotation.y=.35}for(let l of[23-this.mapWidth/2,17+this.mapWidth/2])for(let c of[9,15]){r("#49594e",l,1.3,c,.07,2.6),s("#273a34",l,2.6,c,.45,.7,.25);let h=n(new Me(.15,10,8),"#6c3129",l,2.7,c-.17);h.material.dispose(),h.material=new ae({color:"#6c3129"}),this.trackLights.push(h)}}}updateHeat(t,e){for(let n=0;n<(this.heatMeshes||[]).length;n++){let s=this.heatMeshes[n],r=t[n];if(s.visible=!!r&&e<r.end,!s.visible)continue;s.position.set(r.x,.035,r.y),s.scale.set(r.radius,1,r.radius);let o=e>=r.start;s.children[0].material.opacity=o?.55:.12+Math.abs(Math.sin(e*7))*.16,s.children[1].material.color.set(o?"#ff392b":"#ffb09a")}}setHeatViewer(t){for(let e of this.heatMeshes||[])e.children[0].material.color.set(t==="glowsquid"?"#208cff":"#ff2418"),e.children[1].material.color.set(t==="glowsquid"?"#73d6ff":"#ff6655")}updateMechanisms(t,e){for(let n of["water","molten"]){let s=this.surfaces.textures.get(n);if(s)for(let r of Object.values(s))r.offset.set(t*(n==="water"?.007:.012),t*(n==="water"?.004:.003))}$u(this.mechanisms,t,e),Qu(this.monumentFlag,t),this.mechanisms&&Math.floor(t*6)!==this.mechanismShadow&&(this.mechanismShadow=Math.floor(t*6),this.shadowDirty=!0)}updateWorldEffects(t,e){this.worldEffects.update(t,e),this.axeEffects.update(t.axes||[],e,(t.code||"menu")+":"+t.round),this.trajectory.update(t),this.throwTrails.update(t,e)}updateTrain(t){if(this.trainSnapshot=t,!this.trainRoot)return;if(this.trainRoot.visible!==!!t?.active&&(this.shadowDirty=!0),this.trainRoot.visible=!!t?.active,t){this.trainRoot.position.x=t.x-this.mapWidth/2;for(let n of this.trainWheels)n.rotation.z=-t.x/.48;for(let n of this.trainFans||[])n.rotation.y=t.elapsed*6}let e=t&&(t.warning||t.active)&&Math.floor(t.elapsed*5)%2===0;for(let n of this.trackLights)n.material.color.set(e?"#ff442e":"#6c3129")}resize(t,e,n){this.setQuality(n);let s=Math.min(devicePixelRatio||1,n===2?1.5:n===4?1:.7,1800/Math.max(t,e))*(this.autoScale||1);(this.width!==t||this.height!==e||this.scale!==s)&&(this.width=t,this.height=e,this.scale=s,this.renderer.setPixelRatio(s),this.renderer.setSize(t,e,!1))}begin(t,e){if(this.lost)return;let n=e-(this.lastTime||e),s=Math.max(0,Math.min(.1,n/1e3));this.lastTime=e,t.length>0&&this.quality!==2&&++this.frameCounter>8&&n>0&&n<1500&&(this.frameBudget=wr(this.frameBudget,n,.18),this.frameCounter%8===0&&this.frameBudget>55&&this.autoScale>.55?(this.autoScale=Math.max(.55,this.autoScale*.85),this.resize(this.width,this.height,this.quality)):this.frameCounter%120===0&&this.frameBudget<24&&this.autoScale<1&&(this.autoScale=Math.min(1,this.autoScale+.05),this.resize(this.width,this.height,this.quality)));for(let o of t){let a=this.actors.get(o.id);(!a||a.skin!==o.skin||a.team!==o.team)&&(a=Tx(o),this.actors.set(o.id,a)),Oa(a,o,s,e)}for(let o of this.actors.keys())t.some(a=>a.id===o)||this.actors.delete(o);this.combatEffects.update(this.actors,s,e);let r=0;for(let o of t)o.hp>0&&r<6&&(Tr.position.set(o.x,.009,o.y),Tr.rotation.set(-Math.PI/2,0,0),Tr.scale.set(1,1,1),Tr.updateMatrix(),this.actorShadows.setMatrixAt(r++,Tr.matrix));this.actorShadows.count=r,this.actorShadows.instanceMatrix.needsUpdate=!0,this.renderer.shadowMap.enabled&&(this.shadowDirty||(this.quality!==6||this.trainRoot?.visible)&&e-this.lastShadow>(this.quality===2?80:180))&&(this.renderer.shadowMap.needsUpdate=!0,this.lastShadow=e,this.shadowDirty=!1),this.renderer.setScissorTest(!1),this.renderer.clear(),this.renderer.setScissorTest(!0)}render(t,e,n,s,r){if(this.lost)return;let o=this.renderer;o.setViewport(e.x,this.height-e.y-e.h,e.w,e.h),o.setScissor(e.x,this.height-e.y-e.h,e.w,e.h);let a=this.camera,l=t.pitch||0,c=e.w/e.h,h=Math.max(56,Math.min(82,2*Math.atan(Math.tan(n/2)/c)*180/Math.PI));a.aspect=c,a.fov=h*(n<1?.88:1),a.updateProjectionMatrix();let u=(t.z||0)+(t.eyeHeight??(t.crouch?.975:1.5));if(a.position.set(t.x,u,t.y),a.lookAt(t.x+Math.cos(t.yaw)*Math.cos(l),u+Math.sin(l),t.y+Math.sin(t.yaw)*Math.cos(l)),a.updateMatrixWorld(),t.spectating){let d=.15,p=t.yaw,x=this.collisionGrid;for(let g=.15;g<=3.8;g+=.1){let m=t.x-Math.cos(p)*g,f=t.y-Math.sin(p)*g;if([-.22,.22].some(v=>[-.22,.22].some(y=>!x?.[Math.floor(f+y)]||x[Math.floor(f+y)][Math.floor(m+v)]!=="0")))break;let A=this.trainSnapshot;if(A?.active&&(A.cars||[]).some(v=>Math.abs(m-(A.x+v.offset))<v.length/2+.2&&Math.abs(f-A.y)<v.width/2+.2))break;d=g}a.position.set(t.x-Math.cos(p)*d,(t.z||0)+1.65+d*.18,t.y-Math.sin(p)*d),a.lookAt(t.x+Math.cos(p)*1.4,t.hp>0?1.15:.45,t.y+Math.sin(p)*1.4),a.updateMatrixWorld()}for(let d of Object.values(this.batches))d.mesh.count=0;for(let[d,p]of this.actors){if(d===t.id&&!t.spectating)continue;let x=Math.hypot(p.root.position.x-t.x,p.root.position.z-t.y)>22;for(let g of p.records){if(g.weapon&&g.weapon!==p.weapon||g.enemyBand&&p.team===t.team||x&&g.micro&&!g.enemyBand)continue;let m=g.surface+":"+g.geometry;this.batches[m]||(this.batches[m]=new Ga(this.scene,Cr[g.geometry],1024,Ss.get(g.surface)),this.batches[m].mesh.castShadow=this.quality!==6),this.batches[m].mesh.geometry=(this.quality===2?Cr:this.quality===6?bx:ld)[g.geometry],this.batches[m].add(g.node.matrixWorld,g.tint)}}for(let d of Object.values(this.batches))d.commit();if(this.combatEffects.view(t.spectating?null:t.id,s),this.trajectory.view(t,s),o.render(this.scene,a),t.hp>0&&!t.spectating&&(t.cooking||t.weapon!=="axe"&&t.cheats.ammo||t.ammo>0||(t.reserves?.[t.weapon]||0)>0)){let d=s-(r?.shotWeapon&&r.shotWeapon!==t.weapon?-1e4:r?.shotAt||0),p=Math.min(1,Math.hypot(t.vx||0,t.vy||0)/7.2),x=t.stride||s*.008,g=t.weapon||"rifle",m=g==="shotgun"?.7:g==="pistol"?1.25:g==="grenade"?.75:1.5,f=this.weaponModels[g]||this.weaponModels.rifle,A=f.root;this.activeWeapon=g;for(let S of Object.values(this.weaponModels))S.root.visible=S===f;let v=n<1,y=t.reload>0?Math.sin(t.reload/m*Math.PI):0,R=t.cheats.recoil?0:Math.max(0,1-d/110),b=this.weaponSway.get(t.id);b||(b={yaw:t.yaw,pitch:l,x:0,y:0,reload:0,time:s,equip:0},this.weaponSway.set(t.id,b));let T=Math.min(.1,Math.max(.001,(s-b.time)/1e3)),P=1-Math.exp(-18*T);b.time=s,b.reload=wr(b.reload,y,P),b.equip=wr(b.equip,t.equip||0,P);let M=b.reload,_=Math.atan2(Math.sin(t.yaw-b.yaw),Math.cos(t.yaw-b.yaw));if(b.x=wr(b.x,vn.clamp(_/T*.016,-.04,.04),P),b.y=wr(b.y,vn.clamp((l-b.pitch)/T*.016,-.03,.03),P),b.yaw=t.yaw,b.pitch=l,A.position.set((v?0:.19)+Math.sin(x)*p*.008,-.2-Math.abs(Math.cos(x))*p*.007-M*.18,(v?-.42:-.54)+R*.04),A.rotation.set(R*(g==="shotgun"?.11:g==="pistol"?.085:.045)+M*.35+b.y,M*-.4-b.x,M*-.4-b.x*.5),A.position.y-=Math.min(1,b.equip/.35)*.25,t.cooking&&(A.position.y+=.06,A.rotation.x-=.22),g!=="rifle"?nd(f,g,d,M):(this.rifleSupport.position.set(.1*M,-.16*M,.17*M),this.rifleMagazineGroup.position.y=-M*.18),g==="axe"){let S=d>=0&&d<650?Math.sin(d/650*Math.PI):0;A.rotation.z-=S*1.1,A.rotation.x-=S*.65,A.position.x-=S*.18}if(g==="grenade"){let S=d>=0&&d<700?Math.sin(d/700*Math.PI):0;A.position.y-=S*.3,A.rotation.x-=S*.9}f.flash.visible=!["axe","grenade"].includes(g)&&d>=0&&d<65,f.light.intensity=f.flash.visible&&this.quality!==6?2.5:0,this.weaponCamera.aspect=c,this.weaponCamera.fov=2*Math.atan(Math.tan(58*Math.PI/360)/Math.min(1,c))*180/Math.PI,this.weaponCamera.updateProjectionMatrix(),o.clearDepth(),o.render(this.weaponScene,this.weaponCamera)}}inspect(t,e,n,s=-2.5,r=.3,o=3.6){if(this.lost)return;this.trajectory.group.visible=!1,this.begin(t,e);for(let h of Object.values(this.batches))h.mesh.count=0;for(let h of this.actors.values())for(let u of h.records){if(u.weapon&&u.weapon!==h.weapon)continue;let d=u.surface+":"+u.geometry;this.batches[d]||(this.batches[d]=new Ga(this.scene,Cr[u.geometry],1024,Ss.get(u.surface))),this.batches[d].mesh.castShadow=this.quality!==6,this.batches[d].add(u.node.matrixWorld,u.tint)}for(let h of Object.values(this.batches))h.commit();let a=this.renderer,l=this.camera;l.aspect=this.width/this.height,l.fov=45,l.updateProjectionMatrix();let c=n.height??1;l.position.set(n.x+Math.cos(s)*o,c+Math.sin(r)*o,n.y+Math.sin(s)*o),l.lookAt(n.x,c,n.y),l.updateMatrixWorld(),a.setViewport(0,0,this.width,this.height),a.setScissor(0,0,this.width,this.height),a.render(this.scene,l)}preview(t){if(this.lost)return;this.trajectory.group.visible=!1,this.begin([],t);for(let r of Object.values(this.batches))r.mesh.count=0,r.commit();let e=this.renderer;e.setViewport(0,0,this.width,this.height),e.setScissor(0,0,this.width,this.height);let n=t*18e-6,s=this.camera;s.aspect=this.width/this.height,s.fov=62,s.updateProjectionMatrix(),s.position.set(this.mapWidth/2+25*Math.cos(n),26,this.mapDepth/2+16*Math.sin(n)),s.lookAt(this.mapWidth/2,3.5,this.mapDepth/2),s.updateMatrixWorld(),e.render(this.scene,s)}project(t,e){let n=new I(t.x,(t.z||0)+.03,t.y).project(this.camera),s=new I(t.x,(t.z||0)+2.02*(t.crouch?.65:1),t.y).project(this.camera);return s.z>1||s.z<-1?null:{x:(s.x+1)*e.w/2,top:(1-s.y)*e.h/2,bottom:(1-n.y)*e.h/2}}};window.CheatRenderer3D=Rl;})();
/*! Bundled license information:

three/build/three.core.js:
three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2025 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
