import{c as ow,a as Mm,f as iw}from"./CGs25f5Q.js";import{f as aw,p as cw,c as to,s as _p,t as lw,a as uw,k as Ns,Z as Ol,U as Mp,r as eo}from"./CPN3W99e.js";import{d as hw,s as dw}from"./Cf1jdkyt.js";import{i as pw}from"./CO7pLaZ9.js";import{r as fw,a as mw,k as gw}from"./CZv5_2PD.js";import"./DVul_Cmu.js";import{I as xw,s as bw}from"./Cg977V2y.js";import{l as yw,s as ww}from"./COovbC_N.js";import{P as Iw}from"./BZAaL_2o.js";import{M as vw}from"./CXrKfc7O.js";import{_ as Cw}from"./PPVm8Dsz.js";function kw(n,t){for(var e=0;e<t.length;e++){const s=t[e];if(typeof s!="string"&&!Array.isArray(s)){for(const r in s)if(r!=="default"&&!(r in n)){const o=Object.getOwnPropertyDescriptor(s,r);o&&Object.defineProperty(n,r,o.get?o:{enumerable:!0,get:()=>s[r]})}}}return Object.freeze(Object.defineProperty(n,Symbol.toStringTag,{value:"Module"}))}function $w(n,t){const e=yw(t,["children","$$slots","$$events","$$legacy"]);const s=[["rect",{x:"14",y:"3",width:"5",height:"18",rx:"1"}],["rect",{x:"5",y:"3",width:"5",height:"18",rx:"1"}]];xw(n,ww({name:"pause"},()=>e,{get iconNode(){return s},children:(r,o)=>{var i=ow(),a=aw(i);bw(a,t,"default",{}),Mm(r,i)},$$slots:{default:!0}}))}var Sw=iw('<div class="metronome svelte-1lsk5dc"><div class="controls svelte-1lsk5dc"><button><!></button> <div class="bpm-control svelte-1lsk5dc"><span class="bpm-display svelte-1lsk5dc"> </span> <input type="range" min="40" max="240" class="bpm-slider svelte-1lsk5dc"/></div></div></div>');function e6(n,t){cw(t,!0);let e=Mp(120),s=Mp(!1),r=null,o=null;function i(){Ns(s)?c():a()}function a(){o||(o=new AudioContext),Ol(s,!0);const C=60/Ns(e)*1e3;l(),r=window.setInterval(l,C)}function c(){Ol(s,!1),r&&(clearInterval(r),r=null)}function l(){if(!o)return;const C=o.createOscillator(),N=o.createGain();C.connect(N),N.connect(o.destination),C.frequency.value=1e3,N.gain.value=.5,C.start(),N.gain.exponentialRampToValueAtTime(.001,o.currentTime+.1),C.stop(o.currentTime+.1),t.onTick?.(Date.now())}function u(C){const N=C.target;Ol(e,parseInt(N.value),!0),Ns(s)&&(c(),a())}var h=Sw(),d=to(h),p=to(d);let f;p.__click=i;var m=to(p);{var g=C=>{$w(C,{size:20})},x=C=>{Iw(C,{size:20})};pw(m,C=>{Ns(s)?C(g):C(x,!1)})}eo(p);var b=_p(p,2),w=to(b),y=to(w);eo(w);var I=_p(w,2);fw(I),I.__input=u,eo(b),eo(d),eo(h),lw(()=>{f=mw(p,1,"toggle-btn svelte-1lsk5dc",null,f,{playing:Ns(s)}),dw(y,`${Ns(e)??""} BPM`),gw(I,Ns(e))}),Mm(n,h),uw()}hw(["click","input"]);class Nw{constructor(t={}){this.options=t,this.options={velocity:100,channel:0,...t}}listeners=[];activeNotes=new Set;currentOctave=4;rootNoteOffset=0;rootNoteName="C";addEventListener(t,e){t==="midimessage"&&this.listeners.push(e)}removeEventListener(t,e){if(t==="midimessage"){const s=this.listeners.indexOf(e);s>-1&&this.listeners.splice(s,1)}}pressKey(t,e=this.options.velocity||100){if(this.activeNotes.has(t))return;this.activeNotes.add(t);const s=this.createMidiMessage(144,t,e);this.dispatchMidiEvent(s)}releaseKey(t){if(!this.activeNotes.has(t))return;this.activeNotes.delete(t);const e=this.createMidiMessage(128,t,0);this.dispatchMidiEvent(e)}releaseAllKeys(){for(const t of this.activeNotes)this.releaseKey(t)}getActiveNotes(){return Array.from(this.activeNotes)}playChord(t,e=this.options.velocity||100){t.forEach(s=>this.pressKey(s,e))}setOctave(t){this.currentOctave=Math.max(0,Math.min(8,t))}getOctave(){return this.currentOctave}setRootNote(t){const e={C:0,"C#":1,Db:1,D:2,"D#":3,Eb:3,E:4,F:5,"F#":6,Gb:6,G:7,"G#":8,Ab:8,A:9,"A#":10,Bb:10,B:11};this.rootNoteOffset=e[t]||0,this.rootNoteName=t}getRootNote(){return this.rootNoteName}createMidiMessage(t,e,s){return new Uint8Array([t|(this.options.channel||0),e,s])}dispatchMidiEvent(t){const e={data:t,timeStamp:performance.now(),type:"midimessage"};this.listeners.forEach(s=>s(e))}}function Tw(n="Virtual MIDI Keyboard"){const t=new Nw,e={id:"virtual-midi-input",manufacturer:"Virtual",name:n,type:"input",version:"1.0.0",state:"connected",connection:"open",onmidimessage:null,onstatechange:null,addEventListener:t.addEventListener.bind(t),removeEventListener:t.removeEventListener.bind(t),dispatchEvent:()=>!1,open:()=>Promise.resolve(e),close:()=>Promise.resolve(e),_virtualInput:t};return Object.defineProperty(e,"onmidimessage",{get(){return this._onmidimessage},set(i){this._onmidimessage=i,i&&t.addEventListener("midimessage",i)}}),{inputs:new Map([["virtual-midi-input",e]]),outputs:new Map,sysexEnabled:!1,onstatechange:null,addEventListener:()=>{},removeEventListener:()=>{},dispatchEvent:()=>!1,getVirtualInput:()=>t}}const Lm={z:0,x:2,c:4,v:5,f:5,b:7,n:9,m:11,",":12,".":14,"/":16,s:1,d:3,g:6,h:8,j:10,l:13,";":15,"'":17,q:12,w:14,e:16,r:17,t:19,y:21,u:23,i:24,o:26,p:28,"[":29,"]":31,2:1,3:3,5:6,6:8,7:10,9:13,0:15,"=":20};function Lp(n,t){const e={},s=n*12+12;let r=0;t&&(r={C:0,"C#":1,Db:1,D:2,"D#":3,Eb:3,E:4,F:5,"F#":6,Gb:6,G:7,"G#":8,Ab:8,A:9,"A#":10,Bb:10,B:11}[t]||0);for(const[o,i]of Object.entries(Lm)){const a=s+r+i;a>=24&&a<=127&&(e[o]=a)}return e}function Pp(n,t=!1){const e=new Set;function s(o){if(!t)return;const i=o.key.toLowerCase();console.debug("Key pressed:",i);const a=Lp(n.getOctave(),n.getRootNote());if(a[i]&&!e.has(i)){e.add(i);const c=a[i];console.debug(`Pressing MIDI note ${c} for key '${i}' (octave ${n.getOctave()})`),n.pressKey(c),o.preventDefault()}}function r(o){if(!t)return;const i=o.key.toLowerCase(),a=Lp(n.getOctave(),n.getRootNote());if(a[i]&&e.has(i)){e.delete(i);const c=a[i];console.debug(`Releasing MIDI note ${c} for key '${i}' (octave ${n.getOctave()})`),n.releaseKey(c),o.preventDefault()}}return t?console.debug("Virtual keyboard input setup complete. Available keys:",Object.keys(Lm),"Base octave:",n.getOctave()):console.debug("Virtual keyboard input setup (keyboard disabled)"),document.addEventListener("keydown",s),document.addEventListener("keyup",r),()=>{console.debug("Virtual keyboard input cleanup"),document.removeEventListener("keydown",s),document.removeEventListener("keyup",r)}}const Ew=1e-7,Rw=1e-4;class Pm{constructor(t,e){this.backend=t,this.dataMover=e,this.data=new WeakMap,this.dataIdsCount=0}get(t){return this.data.has(t)||this.dataMover.moveData(this.backend,t),this.data.get(t)}set(t,e){this.dataIdsCount++,this.data.set(t,e)}has(t){return this.data.has(t)}delete(t){return this.dataIdsCount--,this.data.delete(t)}numDataIds(){return this.dataIdsCount}}class Uu{refCount(t){return Ke("refCount")}incRef(t){return Ke("incRef")}timerAvailable(){return!0}time(t){return Ke("time")}read(t){return Ke("read")}readSync(t){return Ke("readSync")}readToGPU(t,e){return Ke("readToGPU")}numDataIds(){return Ke("numDataIds")}disposeData(t,e){return Ke("disposeData")}write(t,e,s){return Ke("write")}move(t,e,s,r,o){return Ke("move")}memory(){return Ke("memory")}floatPrecision(){return Ke("floatPrecision")}epsilon(){return this.floatPrecision()===32?Ew:Rw}dispose(){return Ke("dispose")}}function Ke(n){throw new Error(`'${n}' not yet implemented or not found in the registry. This kernel may not be supported by the tfjs backend you have chosen`)}function Dw(n){let t=n.length,e=0;for(;t>0;)e=Math.random()*t|0,t--,pr(n,t,e)}function Gs(n,t,e){return Math.max(n,Math.min(t,e))}function Gu(n){return n%2===0?n:n+1}function pr(n,t,e){const s=n[t];n[t]=n[e],n[e]=s}function Aw(n){let t=0;for(let e=0;e<n.length;e++)t+=n[e];return t}function S(n,t){if(!n)throw new Error(typeof t=="string"?t:t())}function un(n,t,e=""){S(Tt(n,t),()=>e+` Shapes ${n} and ${t} must match`)}function Bm(n){S(n!=null,()=>"The input to the tensor constructor must be a non-null value.")}function kr(n,t=[],e=!1){if(t==null&&(t=[]),Array.isArray(n)||_n(n)&&!e)for(let s=0;s<n.length;++s)kr(n[s],t,e);else t.push(n);return t}function q(n){if(n.length===0)return 1;let t=n[0];for(let e=1;e<n.length;e++)t*=n[e];return t}function Tt(n,t){if(n===t)return!0;if(n==null||t==null||n.length!==t.length)return!1;for(let e=0;e<n.length;e++)if(n[e]!==t[e])return!1;return!0}function $r(n){return n%1===0}function su(n){const t=Math.ceil(Math.sqrt(n));return[t,Math.ceil(n/t)]}function br(n,t){return t<=n.length?n:n+" ".repeat(t-n.length)}function Bp(n,t=r=>0,e,s=setTimeout){return new Promise((r,o)=>{let i=0;const a=()=>{if(n()){r();return}i++;const c=t(i);if(e!=null&&i>=e){o();return}s(a,c)};a()})}function zm(n,t){let e=1,s=-1;for(let o=0;o<n.length;++o)if(n[o]>=0)e*=n[o];else if(n[o]===-1){if(s!==-1)throw Error(`Shapes can only have 1 implicit size. Found -1 at dim ${s} and dim ${o}`);s=o}else if(n[o]<0)throw Error(`Shapes can not be < 0. Found ${n[o]} at dim ${o}`);if(s===-1){if(t>0&&t!==e)throw Error(`Size(${t}) must match the product of shape ${n}`);return n}if(e===0)throw Error(`Cannot infer the missing size in [${n}] when there are 0 elements`);if(t%e!==0)throw Error(`The implicit shape can't be a fractional number. Got ${t} / ${e}`);const r=n.slice();return r[s]=t/e,r}function wt(n,t){const e=t.length;return n=n==null?t.map((s,r)=>r):[].concat(n),S(n.every(s=>s>=-e&&s<e),()=>`All values in axis param must be in range [-${e}, ${e}) but got axis ${n}`),S(n.every(s=>$r(s)),()=>`All values in axis param must be integers but got axis ${n}`),n.map(s=>s<0?e+s:s)}function gs(n,t){const e=[],s=[],r=t!=null&&Array.isArray(t)&&t.length===0,o=t==null||r?null:wt(t,n).sort();let i=0;for(let a=0;a<n.length;++a){if(o!=null){if(o[i]===a&&n[a]!==1)throw new Error(`Can't squeeze axis ${a} since its dim '${n[a]}' is not 1`);(o[i]==null||o[i]>a)&&n[a]===1&&(e.push(n[a]),s.push(a)),o[i]<=a&&i++}n[a]!==1&&(e.push(n[a]),s.push(a))}return{newShape:e,keptDims:s}}function be(n,t){let e=null;if(n==null||n==="float32")e=new Float32Array(t);else if(n==="int32")e=new Int32Array(t);else if(n==="bool")e=new Uint8Array(t);else throw new Error(`Unknown data type ${n}`);return e}function de(n,t){let e=null;if(n==null||n==="float32")e=new Float32Array(t);else if(n==="int32")e=new Int32Array(t);else if(n==="bool")e=new Uint8Array(t);else if(n==="string")e=new Array(t);else throw new Error(`Unknown data type ${n}`);return e}function Fw(n,t){for(let e=0;e<n.length;e++){const s=n[e];if(isNaN(s)||!isFinite(s))throw Error(`A tensor of type ${t} being uploaded contains ${s}.`)}}function Ow(n){return n==="bool"||n==="complex64"||n==="float32"||n==="int32"||n==="string"}function Vm(n,t){return!(t==="complex64"||t==="float32"&&n!=="complex64"||t==="int32"&&n!=="float32"&&n!=="complex64"||t==="bool"&&n==="bool")}function _n(n){return n instanceof Float32Array||n instanceof Int32Array||n instanceof Uint8Array||n instanceof Uint8ClampedArray}function ru(n){if(n==="float32"||n==="int32")return 4;if(n==="complex64")return 8;if(n==="bool")return 1;throw new Error(`Unknown dtype ${n}`)}function _w(n){if(n==null)return 0;let t=0;return n.forEach(e=>t+=e.length),t}function Eo(n){return typeof n=="string"||n instanceof String}function Mw(n){return typeof n=="boolean"}function ou(n){return typeof n=="number"}function Ro(n){return Array.isArray(n)?Ro(n[0]):n instanceof Float32Array?"float32":n instanceof Int32Array||n instanceof Uint8Array||n instanceof Uint8ClampedArray?"int32":ou(n)?"float32":Eo(n)?"string":Mw(n)?"bool":"float32"}function iu(n){return!!(n&&n.constructor&&n.call&&n.apply)}function au(n,t){for(let e=t;e<n;++e)if(n%e===0)return e;return n}function ht(n){const t=n.length;if(t<2)return[];const e=new Array(t-1);e[t-2]=n[t-1];for(let s=t-3;s>=0;--s)e[s]=e[s+1]*n[s+1];return e}function Wm(n,t,e,s=!1){const r=new Array;if(t.length===1){const o=t[0]*(s?2:1);for(let i=0;i<o;i++)r[i]=e[n+i]}else{const o=t[0],i=t.slice(1),a=i.reduce((c,l)=>c*l)*(s?2:1);for(let c=0;c<o;c++)r[c]=Wm(n+c*a,i,e,s)}return r}function In(n,t,e=!1){if(n.length===0)return t[0];const s=n.reduce((r,o)=>r*o)*(e?2:1);if(s===0)return[];if(s!==t.length)throw new Error(`[${n}] does not match the input size ${t.length}${e?" for a complex tensor":""}.`);return Wm(0,n,t,e)}function Hu(n,t){const e=ke(n,t);for(let s=0;s<e.length;s++)e[s]=1;return e}function ke(n,t){if(t==null||t==="float32"||t==="complex64")return new Float32Array(n);if(t==="int32")return new Int32Array(n);if(t==="bool")return new Uint8Array(n);throw new Error(`Unknown data type ${t}`)}function Um(n,t){const e=n.reduce((s,r)=>s*r,1);if(t==null||t==="float32")return In(n,new Float32Array(e));if(t==="int32")return In(n,new Int32Array(e));if(t==="bool")return In(n,new Uint8Array(e));throw new Error(`Unknown data type ${t}`)}function Gm(n){n.forEach(t=>{S(Number.isInteger(t)&&t>=0,()=>`Tensor must have a shape comprised of positive integers but got shape [${n}].`)})}function Dn(n,t,e){if(t===0)return 0;if(t===1)return n[0];let s=n[n.length-1];for(let r=0;r<n.length-1;++r)s+=e[r]*n[r];return s}function Lr(n,t,e){if(t===0)return[];if(t===1)return[n];const s=new Array(t);for(let r=0;r<s.length-1;++r)s[r]=Math.floor(n/e[r]),n-=s[r]*e[r];return s[s.length-1]=n,s}function Hm(n){return n&&n.then&&typeof n.then=="function"}const zp="tfjsflags";class Lw{constructor(t){this.global=t,this.flags={},this.flagRegistry={},this.urlFlags={},this.getQueryParams=Pw,this.populateURLFlags()}setPlatform(t,e){this.platform!=null&&(W().getBool("IS_TEST")||W().getBool("PROD")||console.warn(`Platform ${this.platformName} has already been set. Overwriting the platform with ${t}.`)),this.platformName=t,this.platform=e}registerFlag(t,e,s){if(this.flagRegistry[t]={evaluationFn:e,setHook:s},this.urlFlags[t]!=null){const r=this.urlFlags[t];W().getBool("IS_TEST")||W().getBool("PROD")||console.warn(`Setting feature override from URL ${t}: ${r}.`),this.set(t,r)}}async getAsync(t){return t in this.flags?this.flags[t]:(this.flags[t]=await this.evaluateFlag(t),this.flags[t])}get(t){if(t in this.flags)return this.flags[t];const e=this.evaluateFlag(t);if(Hm(e))throw new Error(`Flag ${t} cannot be synchronously evaluated. Please use getAsync() instead.`);return this.flags[t]=e,this.flags[t]}getNumber(t){return this.get(t)}getBool(t){return this.get(t)}getFlags(){return this.flags}get features(){return this.flags}set(t,e){if(this.flagRegistry[t]==null)throw new Error(`Cannot set flag ${t} as it has not been registered.`);this.flags[t]=e,this.flagRegistry[t].setHook!=null&&this.flagRegistry[t].setHook(e)}evaluateFlag(t){if(this.flagRegistry[t]==null)throw new Error(`Cannot evaluate flag '${t}': no evaluation function found.`);return this.flagRegistry[t].evaluationFn()}setFlags(t){this.flags=Object.assign({},t)}reset(){this.flags={},this.urlFlags={},this.populateURLFlags()}populateURLFlags(){if(typeof this.global>"u"||typeof this.global.location>"u"||typeof this.global.location.search>"u")return;const t=this.getQueryParams(this.global.location.search);zp in t&&t[zp].split(",").forEach(s=>{const[r,o]=s.split(":");this.urlFlags[r]=zw(r,o)})}}function Pw(n){const t={};return n.replace(/[?&]([^=?&]+)(?:=([^&]*))?/g,(e,...s)=>(Bw(t,s[0],s[1]),s.join("="))),t}function Bw(n,t,e){n[decodeURIComponent(t)]=decodeURIComponent(e||"")}function zw(n,t){if(t=t.toLowerCase(),t==="true"||t==="false")return t==="true";if(`${+t}`===t)return+t;throw new Error(`Could not parse value flag value ${t} for flag ${n}.`)}function W(){return qm}let qm=null;function Vw(n){qm=n}let _l;function Km(){if(_l==null){let n;if(typeof window<"u")n=window;else if(typeof global<"u")n=global;else if(typeof process<"u")n=process;else if(typeof self<"u")n=self;else throw new Error("Could not find a global object");_l=n}return _l}function Ww(){const n=Km();return n._tfGlobals==null&&(n._tfGlobals=new Map),n._tfGlobals}function qu(n,t){const e=Ww();if(e.has(n))return e.get(n);{const s=t();return e.set(n,s),e.get(n)}}const tc="Abs",Do="Acos",Ao="Acosh",Pr="Add",Ku="AddN",ju="All",Xu="Any",ec="ArgMax",nc="ArgMin",Fo="Asin",Oo="Asinh",_o="Atan",Mo="Atanh",Lo="Atan2",sc="AvgPool",Yu="AvgPoolGrad",rc="AvgPool3D",Zu="AvgPool3DGrad",oc="BatchMatMul",ic="BatchToSpaceND",Ju="Bincount",Uw="BroadcastTo",jm="BroadcastArgs",Po="Cast",Bo="Ceil",zo="ClipByValue",Qu="Complex",ac="ComplexAbs",cc="Concat",lc="Conv2D",th="Conv2DBackpropFilter",uc="Conv2DBackpropInput",hc="Conv3D",eh="Conv3DBackpropFilterV2",nh="Conv3DBackpropInputV2",Vo="Cos",Wo="Cosh",sh="Cumprod",dc="Cumsum",rh="CropAndResize",Xm="DenseBincount",oh="DepthToSpace",pc="DepthwiseConv2dNative",ih="DepthwiseConv2dNativeBackpropFilter",ah="DepthwiseConv2dNativeBackpropInput",Ym="Diag",fc="Dilation2D",cu="Dilation2DBackpropInput",lu="Dilation2DBackpropFilter",Uo="RealDiv",Zm="Einsum",Go="Elu",ch="EluGrad",Ho="Erf",mc="Equal",qo="Exp",gc="ExpandDims",Ko="Expm1",lh="FFT",uh="Fill",hh="FlipLeftRight",jo="Floor",Xo="FloorDiv",xc="FusedBatchNorm",bc="GatherV2",Jm="GatherNd",yc="Greater",Yo="GreaterEqual",Zo="Identity",dh="IFFT",ph="Imag",Jo="IsFinite",Qo="IsInf",ti="IsNan",wc="LeakyRelu",Ic="Less",vc="LessEqual",Qm="LinSpace",ei="Log",ni="Log1p",Cc="LogicalAnd",kc="LogicalNot",$c="LogicalOr",Gw="LogSoftmax",Sc="LRN",fh="LRNGrad",Nc="Max",si="Maximum",Tc="MaxPool",mh="MaxPoolGrad",Ec="MaxPool3D",gh="MaxPool3DGrad",tg="MaxPoolWithArgmax",Rc="Mean",Dc="Min",ri="Minimum",Ac="MirrorPad",oi="Mod",eg="Multinomial",ii="Multiply",Fc="Neg",Oc="NotEqual",xh="NonMaxSuppressionV3",bh="NonMaxSuppressionV4",yh="NonMaxSuppressionV5",_c="OnesLike",Mc="OneHot",Lc="Pack",Pc="PadV2",ai="Pow",Bc="Prelu",zc="Prod",ng="RaggedGather",sg="RaggedTensorToTensor",wh="Range",Ih="Real",ci="Reciprocal",li="Relu",Vc="Reshape",Wc="ResizeNearestNeighbor",vh="ResizeNearestNeighborGrad",Uc="ResizeBilinear",Ch="ResizeBilinearGrad",ui="Relu6",Gc="Reverse",hi="Round",di="Rsqrt",rg="ScatterNd",og="SearchSorted",Hc="Select",pi="Selu",qc="Slice",fi="Sin",mi="Sinh",gi="Sign",xi="Sigmoid",bi="Softplus",yi="Sqrt",Kc="Sum",jc="SpaceToBatchND",Xc="SplitV",Yc="Softmax",kh="SparseFillEmptyRows",$h="SparseReshape",Sh="SparseSegmentMean",Nh="SparseSegmentSum",ig="SparseToDense",wi="SquaredDifference",Th="Square",Eh="StridedSlice",Rh="StringNGrams",Dh="StringSplit",Ah="StringToHashBucketFast",Ii="Sub",vi="Tan",Ci="Tanh",ki="Tile",Fh="TopK",Oh="Transform",yr="Transpose",_h="Unique",Zc="Unpack",Jc="UnsortedSegmentSum",Qc="ZerosLike",$i="Step",Hw="FromPixels",Mh="RotateWithOffset",Sa="_FusedMatMul",Na="FusedConv2D",ag="FusedDepthwiseConv2D";function je(...n){W().getBool("IS_TEST")||W().getBool("PROD")||console.warn(...n)}function qw(...n){W().getBool("IS_TEST")||W().getBool("PROD")||console.log(...n)}const Ta=qu("kernelRegistry",()=>new Map),uu=qu("gradRegistry",()=>new Map);function Vp(n,t){const e=lg(n,t);return Ta.get(e)}function Wp(n){return uu.get(n)}function Up(n){const t=Ta.entries(),e=[];for(;;){const{done:s,value:r}=t.next();if(s)break;const[o,i]=r,[a]=o.split("_");a===n&&e.push(i)}return e}function cg(n){const{kernelName:t,backendName:e}=n,s=lg(t,e);Ta.has(s)&&je(`The kernel '${t}' for backend '${e}' is already registered`),Ta.set(s,n)}function Kw(n){const{kernelName:t}=n;uu.has(t)&&W().getBool("DEBUG")&&je(`Overriding the gradient for '${t}'`),uu.set(t,n)}function lg(n,t){return`${t}_${n}`}function jw(n){return n&&n.__esModule&&Object.prototype.hasOwnProperty.call(n,"default")?n.default:n}function ug(n){if(Object.prototype.hasOwnProperty.call(n,"__esModule"))return n;var t=n.default;if(typeof t=="function"){var e=function s(){var r=!1;try{r=this instanceof s}catch{}return r?Reflect.construct(t,arguments,this.constructor):t.apply(this,arguments)};e.prototype=t.prototype}else e={};return Object.defineProperty(e,"__esModule",{value:!0}),Object.keys(n).forEach(function(s){var r=Object.getOwnPropertyDescriptor(n,s);Object.defineProperty(e,s,r.get?r:{enumerable:!0,get:function(){return n[s]}})}),e}var Ml,Gp;function Xw(){if(Gp)return Ml;Gp=1,Ml=t;var n=null;try{n=new WebAssembly.Instance(new WebAssembly.Module(new Uint8Array([0,97,115,109,1,0,0,0,1,13,2,96,0,1,127,96,4,127,127,127,127,1,127,3,7,6,0,1,1,1,1,1,6,6,1,127,1,65,0,11,7,50,6,3,109,117,108,0,1,5,100,105,118,95,115,0,2,5,100,105,118,95,117,0,3,5,114,101,109,95,115,0,4,5,114,101,109,95,117,0,5,8,103,101,116,95,104,105,103,104,0,0,10,191,1,6,4,0,35,0,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,126,34,4,66,32,135,167,36,0,32,4,167,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,127,34,4,66,32,135,167,36,0,32,4,167,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,128,34,4,66,32,135,167,36,0,32,4,167,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,129,34,4,66,32,135,167,36,0,32,4,167,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,130,34,4,66,32,135,167,36,0,32,4,167,11])),{}).exports}catch{}function t(k,v,R){this.low=k|0,this.high=v|0,this.unsigned=!!R}t.prototype.__isLong__,Object.defineProperty(t.prototype,"__isLong__",{value:!0});function e(k){return(k&&k.__isLong__)===!0}t.isLong=e;var s={},r={};function o(k,v){var R,_,P;return v?(k>>>=0,(P=0<=k&&k<256)&&(_=r[k],_)?_:(R=a(k,(k|0)<0?-1:0,!0),P&&(r[k]=R),R)):(k|=0,(P=-128<=k&&k<128)&&(_=s[k],_)?_:(R=a(k,k<0?-1:0,!1),P&&(s[k]=R),R))}t.fromInt=o;function i(k,v){if(isNaN(k))return v?b:x;if(v){if(k<0)return b;if(k>=f)return N}else{if(k<=-m)return T;if(k+1>=m)return C}return k<0?i(-k,v).neg():a(k%p|0,k/p|0,v)}t.fromNumber=i;function a(k,v,R){return new t(k,v,R)}t.fromBits=a;var c=Math.pow;function l(k,v,R){if(k.length===0)throw Error("empty string");if(k==="NaN"||k==="Infinity"||k==="+Infinity"||k==="-Infinity")return x;if(typeof v=="number"?(R=v,v=!1):v=!!v,R=R||10,R<2||36<R)throw RangeError("radix");var _;if((_=k.indexOf("-"))>0)throw Error("interior hyphen");if(_===0)return l(k.substring(1),v,R).neg();for(var P=i(c(R,8)),L=x,B=0;B<k.length;B+=8){var U=Math.min(8,k.length-B),V=parseInt(k.substring(B,B+U),R);if(U<8){var H=i(c(R,U));L=L.mul(H).add(i(V))}else L=L.mul(P),L=L.add(i(V))}return L.unsigned=v,L}t.fromString=l;function u(k,v){return typeof k=="number"?i(k,v):typeof k=="string"?l(k,v):a(k.low,k.high,typeof v=="boolean"?v:k.unsigned)}t.fromValue=u;var h=65536,d=1<<24,p=h*h,f=p*p,m=f/2,g=o(d),x=o(0);t.ZERO=x;var b=o(0,!0);t.UZERO=b;var w=o(1);t.ONE=w;var y=o(1,!0);t.UONE=y;var I=o(-1);t.NEG_ONE=I;var C=a(-1,2147483647,!1);t.MAX_VALUE=C;var N=a(-1,-1,!0);t.MAX_UNSIGNED_VALUE=N;var T=a(0,-2147483648,!1);t.MIN_VALUE=T;var $=t.prototype;return $.toInt=function(){return this.unsigned?this.low>>>0:this.low},$.toNumber=function(){return this.unsigned?(this.high>>>0)*p+(this.low>>>0):this.high*p+(this.low>>>0)},$.toString=function(v){if(v=v||10,v<2||36<v)throw RangeError("radix");if(this.isZero())return"0";if(this.isNegative())if(this.eq(T)){var R=i(v),_=this.div(R),P=_.mul(R).sub(this);return _.toString(v)+P.toInt().toString(v)}else return"-"+this.neg().toString(v);for(var L=i(c(v,6),this.unsigned),B=this,U="";;){var V=B.div(L),H=B.sub(V.mul(L)).toInt()>>>0,K=H.toString(v);if(B=V,B.isZero())return K+U;for(;K.length<6;)K="0"+K;U=""+K+U}},$.getHighBits=function(){return this.high},$.getHighBitsUnsigned=function(){return this.high>>>0},$.getLowBits=function(){return this.low},$.getLowBitsUnsigned=function(){return this.low>>>0},$.getNumBitsAbs=function(){if(this.isNegative())return this.eq(T)?64:this.neg().getNumBitsAbs();for(var v=this.high!=0?this.high:this.low,R=31;R>0&&(v&1<<R)==0;R--);return this.high!=0?R+33:R+1},$.isZero=function(){return this.high===0&&this.low===0},$.eqz=$.isZero,$.isNegative=function(){return!this.unsigned&&this.high<0},$.isPositive=function(){return this.unsigned||this.high>=0},$.isOdd=function(){return(this.low&1)===1},$.isEven=function(){return(this.low&1)===0},$.equals=function(v){return e(v)||(v=u(v)),this.unsigned!==v.unsigned&&this.high>>>31===1&&v.high>>>31===1?!1:this.high===v.high&&this.low===v.low},$.eq=$.equals,$.notEquals=function(v){return!this.eq(v)},$.neq=$.notEquals,$.ne=$.notEquals,$.lessThan=function(v){return this.comp(v)<0},$.lt=$.lessThan,$.lessThanOrEqual=function(v){return this.comp(v)<=0},$.lte=$.lessThanOrEqual,$.le=$.lessThanOrEqual,$.greaterThan=function(v){return this.comp(v)>0},$.gt=$.greaterThan,$.greaterThanOrEqual=function(v){return this.comp(v)>=0},$.gte=$.greaterThanOrEqual,$.ge=$.greaterThanOrEqual,$.compare=function(v){if(e(v)||(v=u(v)),this.eq(v))return 0;var R=this.isNegative(),_=v.isNegative();return R&&!_?-1:!R&&_?1:this.unsigned?v.high>>>0>this.high>>>0||v.high===this.high&&v.low>>>0>this.low>>>0?-1:1:this.sub(v).isNegative()?-1:1},$.comp=$.compare,$.negate=function(){return!this.unsigned&&this.eq(T)?T:this.not().add(w)},$.neg=$.negate,$.add=function(v){e(v)||(v=u(v));var R=this.high>>>16,_=this.high&65535,P=this.low>>>16,L=this.low&65535,B=v.high>>>16,U=v.high&65535,V=v.low>>>16,H=v.low&65535,K=0,j=0,Y=0,Z=0;return Z+=L+H,Y+=Z>>>16,Z&=65535,Y+=P+V,j+=Y>>>16,Y&=65535,j+=_+U,K+=j>>>16,j&=65535,K+=R+B,K&=65535,a(Y<<16|Z,K<<16|j,this.unsigned)},$.subtract=function(v){return e(v)||(v=u(v)),this.add(v.neg())},$.sub=$.subtract,$.multiply=function(v){if(this.isZero())return x;if(e(v)||(v=u(v)),n){var R=n.mul(this.low,this.high,v.low,v.high);return a(R,n.get_high(),this.unsigned)}if(v.isZero())return x;if(this.eq(T))return v.isOdd()?T:x;if(v.eq(T))return this.isOdd()?T:x;if(this.isNegative())return v.isNegative()?this.neg().mul(v.neg()):this.neg().mul(v).neg();if(v.isNegative())return this.mul(v.neg()).neg();if(this.lt(g)&&v.lt(g))return i(this.toNumber()*v.toNumber(),this.unsigned);var _=this.high>>>16,P=this.high&65535,L=this.low>>>16,B=this.low&65535,U=v.high>>>16,V=v.high&65535,H=v.low>>>16,K=v.low&65535,j=0,Y=0,Z=0,tt=0;return tt+=B*K,Z+=tt>>>16,tt&=65535,Z+=L*K,Y+=Z>>>16,Z&=65535,Z+=B*H,Y+=Z>>>16,Z&=65535,Y+=P*K,j+=Y>>>16,Y&=65535,Y+=L*H,j+=Y>>>16,Y&=65535,Y+=B*V,j+=Y>>>16,Y&=65535,j+=_*K+P*H+L*V+B*U,j&=65535,a(Z<<16|tt,j<<16|Y,this.unsigned)},$.mul=$.multiply,$.divide=function(v){if(e(v)||(v=u(v)),v.isZero())throw Error("division by zero");if(n){if(!this.unsigned&&this.high===-2147483648&&v.low===-1&&v.high===-1)return this;var R=(this.unsigned?n.div_u:n.div_s)(this.low,this.high,v.low,v.high);return a(R,n.get_high(),this.unsigned)}if(this.isZero())return this.unsigned?b:x;var _,P,L;if(this.unsigned){if(v.unsigned||(v=v.toUnsigned()),v.gt(this))return b;if(v.gt(this.shru(1)))return y;L=b}else{if(this.eq(T)){if(v.eq(w)||v.eq(I))return T;if(v.eq(T))return w;var B=this.shr(1);return _=B.div(v).shl(1),_.eq(x)?v.isNegative()?w:I:(P=this.sub(v.mul(_)),L=_.add(P.div(v)),L)}else if(v.eq(T))return this.unsigned?b:x;if(this.isNegative())return v.isNegative()?this.neg().div(v.neg()):this.neg().div(v).neg();if(v.isNegative())return this.div(v.neg()).neg();L=x}for(P=this;P.gte(v);){_=Math.max(1,Math.floor(P.toNumber()/v.toNumber()));for(var U=Math.ceil(Math.log(_)/Math.LN2),V=U<=48?1:c(2,U-48),H=i(_),K=H.mul(v);K.isNegative()||K.gt(P);)_-=V,H=i(_,this.unsigned),K=H.mul(v);H.isZero()&&(H=w),L=L.add(H),P=P.sub(K)}return L},$.div=$.divide,$.modulo=function(v){if(e(v)||(v=u(v)),n){var R=(this.unsigned?n.rem_u:n.rem_s)(this.low,this.high,v.low,v.high);return a(R,n.get_high(),this.unsigned)}return this.sub(this.div(v).mul(v))},$.mod=$.modulo,$.rem=$.modulo,$.not=function(){return a(~this.low,~this.high,this.unsigned)},$.and=function(v){return e(v)||(v=u(v)),a(this.low&v.low,this.high&v.high,this.unsigned)},$.or=function(v){return e(v)||(v=u(v)),a(this.low|v.low,this.high|v.high,this.unsigned)},$.xor=function(v){return e(v)||(v=u(v)),a(this.low^v.low,this.high^v.high,this.unsigned)},$.shiftLeft=function(v){return e(v)&&(v=v.toInt()),(v&=63)===0?this:v<32?a(this.low<<v,this.high<<v|this.low>>>32-v,this.unsigned):a(0,this.low<<v-32,this.unsigned)},$.shl=$.shiftLeft,$.shiftRight=function(v){return e(v)&&(v=v.toInt()),(v&=63)===0?this:v<32?a(this.low>>>v|this.high<<32-v,this.high>>v,this.unsigned):a(this.high>>v-32,this.high>=0?0:-1,this.unsigned)},$.shr=$.shiftRight,$.shiftRightUnsigned=function(v){if(e(v)&&(v=v.toInt()),v&=63,v===0)return this;var R=this.high;if(v<32){var _=this.low;return a(_>>>v|R<<32-v,R>>>v,this.unsigned)}else return v===32?a(R,0,this.unsigned):a(R>>>v-32,0,this.unsigned)},$.shru=$.shiftRightUnsigned,$.shr_u=$.shiftRightUnsigned,$.toSigned=function(){return this.unsigned?a(this.low,this.high,!1):this},$.toUnsigned=function(){return this.unsigned?this:a(this.low,this.high,!0)},$.toBytes=function(v){return v?this.toBytesLE():this.toBytesBE()},$.toBytesLE=function(){var v=this.high,R=this.low;return[R&255,R>>>8&255,R>>>16&255,R>>>24,v&255,v>>>8&255,v>>>16&255,v>>>24]},$.toBytesBE=function(){var v=this.high,R=this.low;return[v>>>24,v>>>16&255,v>>>8&255,v&255,R>>>24,R>>>16&255,R>>>8&255,R&255]},t.fromBytes=function(v,R,_){return _?t.fromBytesLE(v,R):t.fromBytesBE(v,R)},t.fromBytesLE=function(v,R){return new t(v[0]|v[1]<<8|v[2]<<16|v[3]<<24,v[4]|v[5]<<8|v[6]<<16|v[7]<<24,R)},t.fromBytesBE=function(v,R){return new t(v[4]<<24|v[5]<<16|v[6]<<8|v[7],v[0]<<24|v[1]<<16|v[2]<<8|v[3],R)},Ml}var hg=Xw();const dg=jw(hg),Yw=kw({__proto__:null,default:dg},[hg]);const _s=dg||Yw;function tl(n){return _s.fromString(n,!0,16)}const pg=tl("c3a5c85c97cb3127"),Os=tl("b492b66fbe98f273"),Ne=tl("9ae16a3b2f90404f");function hu(n){return n.xor(n.shru(47))}function fg(n,t,e){const s=n.slice(t,t+e);return _s.fromBytes(Array.from(s),!0,!0)}function Mt(n,t){return fg(n,t,8)}function Hp(n,t){return fg(n,t,4)}function ue(n,t){return t===0?n:n.shru(t).or(n.shl(64-t))}function is(n,t,e=tl("9ddfea08eb382d69")){let s=n.xor(t).mul(e);s=s.xor(s.shru(47));let r=t.xor(s).mul(e);return r=r.xor(r.shru(47)),r=r.mul(e),r}function Zw(n,t,e,s,r,o){r=r.add(n),o=ue(o.add(r).add(s),21);const i=r;return r=r.add(t),r=r.add(e),o=o.add(ue(r,44)),[r.add(s),o.add(i)]}function Qi(n,t,e,s){return Zw(Mt(n,t),Mt(n,t+8),Mt(n,t+16),Mt(n,t+24),e,s)}function Jw(n,t=n.length){if(t>=8){const e=Ne.add(t*2),s=Mt(n,0).add(Ne),r=Mt(n,t-8),o=ue(r,37).mul(e).add(s),i=ue(s,25).add(r).mul(e);return is(o,i,e)}if(t>=4){const e=Ne.add(t*2),s=Hp(n,0);return is(s.shl(3).add(t),Hp(n,t-4),e)}if(t>0){const e=n[0],s=n[t>>1],r=n[t-1],o=e+(s<<8),i=t+(r<<2);return hu(Ne.mul(o).xor(pg.mul(i))).mul(Ne)}return Ne}function Qw(n,t=n.length){const e=Ne.add(t*2),s=Mt(n,0).mul(Os),r=Mt(n,8),o=Mt(n,t-8).mul(e),i=Mt(n,t-16).mul(Ne);return is(ue(s.add(r),43).add(ue(o,30)).add(i),s.add(ue(r.add(Ne),18)).add(o),e)}function tI(n,t=n.length){const e=Ne.add(t*2),s=Mt(n,0).mul(Ne),r=Mt(n,8),o=Mt(n,t-8).mul(e),i=Mt(n,t-16).mul(Ne),a=ue(s.add(r),43).add(ue(o,30)).add(i),c=is(a,s.add(ue(r.add(Ne),18)).add(o),e),l=Mt(n,16).mul(e),u=Mt(n,24),h=a.add(Mt(n,t-32)).mul(e),d=c.add(Mt(n,t-24)).mul(e);return is(ue(l.add(u),43).add(ue(h,30)).add(d),l.add(ue(u.add(s),18)).add(h),e)}function eI(n,t=n.length){const e=_s.fromNumber(81,!0);if(t<=32)return t<=16?Jw(n,t):Qw(n,t);if(t<=64)return tI(n,t);let s=e,r=e.mul(Os).add(113),o=hu(r.mul(Ne).add(113)).mul(Ne),i=[_s.UZERO,_s.UZERO],a=[_s.UZERO,_s.UZERO];s=s.mul(Ne).add(Mt(n,0));let c=0;const l=(t-1>>6)*64,u=l+(t-1&63)-63;do s=ue(s.add(r).add(i[0]).add(Mt(n,c+8)),37).mul(Os),r=ue(r.add(i[1]).add(Mt(n,c+48)),42).mul(Os),s=s.xor(a[1]),r=r.add(i[0]).add(Mt(n,c+40)),o=ue(o.add(a[0]),33).mul(Os),i=Qi(n,c,i[1].mul(Os),s.add(a[0])),a=Qi(n,c+32,o.add(a[1]),r.add(Mt(n,c+16))),[o,s]=[s,o],c+=64;while(c!==l);const h=Os.add(o.and(255).shl(1));return c=u,a[0]=a[0].add(t-1&63),i[0]=i[0].add(a[0]),a[0]=a[0].add(i[0]),s=ue(s.add(r).add(i[0]).add(Mt(n,c+8)),37).mul(h),r=ue(r.add(i[1]).add(Mt(n,c+48)),42).mul(h),s=s.xor(a[1].mul(9)),r=r.add(i[0].mul(9).add(Mt(n,c+40))),o=ue(o.add(a[0]),33).mul(h),i=Qi(n,c,i[1].mul(h),s.add(a[0])),a=Qi(n,c+32,o.add(a[1]),r.add(Mt(n,c+16))),[o,s]=[s,o],is(is(i[0],a[0],h).add(hu(r).mul(pg)).add(o),is(i[1],a[1],h).add(s),h)}function xs(n,t){return t==="string"?as(n):sr([n],t)}function nI(n,t){return n instanceof Float32Array&&t==="float32"||n instanceof Int32Array&&t==="int32"||n instanceof Uint8Array&&t==="bool"}function sr(n,t){if(t==="string")throw new Error("Cannot convert a string[] to a TypedArray");if(Array.isArray(n)&&(n=kr(n)),W().getBool("DEBUG")&&Fw(n,t),nI(n,t))return n;if(t==null||t==="float32"||t==="complex64")return new Float32Array(n);if(t==="int32")return new Int32Array(n);if(t==="bool"){const e=new Uint8Array(n.length);for(let s=0;s<e.length;++s)Math.round(n[s])!==0&&(e[s]=1);return e}else throw new Error(`Unknown data type ${t}`)}function Fe(){return W().platform.now()}function as(n,t="utf-8"){return t=t||"utf-8",W().platform.encode(n,t)}function us(n,t="utf-8"){return t=t||"utf-8",W().platform.decode(n,t)}class sI{constructor(t,e){this.backendTimer=t,this.logger=e,e==null&&(this.logger=new oI)}profileKernel(t,e,s){let r;const o=()=>{r=s()};let i;const a=Fe();if(this.backendTimer.timerAvailable())i=this.backendTimer.time(o);else{o();for(const l of r)l.dataSync();i=Promise.resolve({kernelMs:Fe()-a})}if(W().getBool("CHECK_COMPUTATION_FOR_ERRORS"))for(let l=0;l<r.length;l++){const u=r[l];u.data().then(h=>{rI(h,u.dtype,t)})}return{kernelName:t,outputs:r,inputs:e,timeMs:i.then(l=>l.kernelMs),extraInfo:i.then(l=>l.getExtraProfileInfo!=null?l.getExtraProfileInfo():"")}}logKernelProfile(t){const{kernelName:e,outputs:s,timeMs:r,inputs:o,extraInfo:i}=t;s.forEach(a=>{Promise.all([a.data(),r,i]).then(c=>{this.logger.logKernelProfile(e,a,c[0],c[1],o,c[2])})})}}function rI(n,t,e){if(t!=="float32")return!1;for(let s=0;s<n.length;s++){const r=n[s];if(isNaN(r)||!isFinite(r))return console.warn(`Found ${r} in the result of '${e}'`),!0}return!1}class oI{logKernelProfile(t,e,s,r,o,i){const a=typeof r=="number"?br(`${r}ms`,9):r.error,c=br(t,25),l=e.rank,u=e.size,h=br(e.shape.toString(),14);let d="";for(const p in o){const f=o[p];if(f!=null){const m=f.shape||e.shape,g=m.length;d+=`${p}: ${g}D ${g>0?m:""} `}}console.log(`%c${c}	%c${a}	%c${l}D ${h}	%c${u}	%c${d}	%c${i}`,"font-weight:bold","color:red","color:blue","color: orange","color: green","color: steelblue")}}function iI(n,t,e){const s={},r={};for(let c=0;c<t.length;c++)s[t[c].id]=!0;for(let c=0;c<n.length;c++){const l=n[c],u=l.inputs;for(const h in u){const d=u[h];let p=!1;for(let f=0;f<t.length;f++)if(s[d.id]){l.outputs.forEach(m=>s[m.id]=!0),p=!0,r[l.id]=!0;break}if(p)break}}const o={};o[e.id]=!0;const i={};for(let c=n.length-1;c>=0;c--){const l=n[c],u=l.inputs;for(let h=0;h<l.outputs.length;h++)if(o[l.outputs[h].id]){for(const d in u)o[u[d].id]=!0,i[l.id]=!0;break}}const a=[];for(let c=0;c<n.length;c++){const l=n[c];if(r[l.id]&&i[l.id]){const u={};for(const d in l.inputs){const p=l.inputs[d];s[p.id]&&(u[d]=p)}const h=Object.assign({},l);h.inputs=u,h.outputs=l.outputs,a.push(h)}}return a}function aI(n,t,e,s){for(let r=t.length-1;r>=0;r--){const o=t[r],i=[];if(o.outputs.forEach(c=>{const l=n[c.id];l!=null?i.push(l):i.push(null)}),o.gradient==null)throw new Error(`Cannot compute gradient: gradient function not found for ${o.kernelName}.`);const a=o.gradient(i);for(const c in o.inputs){if(!(c in a))throw new Error(`Cannot backprop through input ${c}. Available gradients found: ${Object.keys(a)}.`);const l=e(()=>a[c]());if(l.dtype!=="float32")throw new Error(`Error in gradient for op ${o.kernelName}. The gradient of input ${c} must have 'float32' dtype, but has '${l.dtype}'`);const u=o.inputs[c];if(!Tt(l.shape,u.shape))throw new Error(`Error in gradient for op ${o.kernelName}. The gradient of input '${c}' has shape '${l.shape}', which does not match the shape of the input '${u.shape}'`);if(n[u.id]==null)n[u.id]=l;else{const h=n[u.id];n[u.id]=s(h,l),h.dispose()}}}}const qp=20,no=3,Ll=7;function cI(n,t,e,s){const r=ht(t),o=lI(n,t,e,r),i=t.length,a=fa(n,t,e,r,o),c=["Tensor"];return s&&(c.push(`  dtype: ${e}`),c.push(`  rank: ${i}`),c.push(`  shape: [${t}]`),c.push("  values:")),c.push(a.map(l=>"    "+l).join(`
`)),c.join(`
`)}function lI(n,t,e,s){const r=q(t),o=s[s.length-1],i=new Array(o).fill(0),a=t.length,c=e==="complex64"?uo(n):n;if(a>1)for(let l=0;l<r/o;l++){const u=l*o;for(let h=0;h<o;h++)i[h]=Math.max(i[h],lo(c[u+h],0,e).length)}return i}function lo(n,t,e){let s;return Array.isArray(n)?s=`${parseFloat(n[0].toFixed(Ll))} + ${parseFloat(n[1].toFixed(Ll))}j`:Eo(n)?s=`'${n}'`:e==="bool"?s=mg(n):s=parseFloat(n.toFixed(Ll)).toString(),br(s,t)}function mg(n){return n===0?"false":"true"}function fa(n,t,e,s,r,o=!0){const i=e==="complex64"?2:1,a=t[0],c=t.length;if(c===0){if(e==="complex64"){const m=uo(n);return[lo(m[0],0,e)]}return e==="bool"?[mg(n[0])]:[n[0].toString()]}if(c===1){if(a>qp){const g=no*i;let x=Array.from(n.slice(0,g)),b=Array.from(n.slice((a-no)*i,a*i));return e==="complex64"&&(x=uo(x),b=uo(b)),["["+x.map((w,y)=>lo(w,r[y],e)).join(", ")+", ..., "+b.map((w,y)=>lo(w,r[a-no+y],e)).join(", ")+"]"]}return["["+(e==="complex64"?uo(n):Array.from(n)).map((g,x)=>lo(g,r[x],e)).join(", ")+"]"]}const l=t.slice(1),u=s.slice(1),h=s[0]*i,d=[];if(a>qp){for(let m=0;m<no;m++){const g=m*h,x=g+h;d.push(...fa(n.slice(g,x),l,e,u,r,!1))}d.push("...");for(let m=a-no;m<a;m++){const g=m*h,x=g+h;d.push(...fa(n.slice(g,x),l,e,u,r,m===a-1))}}else for(let m=0;m<a;m++){const g=m*h,x=g+h;d.push(...fa(n.slice(g,x),l,e,u,r,m===a-1))}const p=c===2?",":"";d[0]="["+d[0]+p;for(let m=1;m<d.length-1;m++)d[m]=" "+d[m]+p;let f=`,
`;for(let m=2;m<c;m++)f+=`
`;return d[d.length-1]=" "+d[d.length-1]+"]"+(o?"":f),d}function uo(n){const t=[];for(let e=0;e<n.length;e+=2)t.push([n[e],n[e+1]]);return t}class ve{constructor(t,e,s){if(this.dtype=e,this.shape=t.slice(),this.size=q(t),s!=null){const r=s.length;S(r===this.size,()=>`Length of values '${r}' does not match the size inferred by the shape '${this.size}'.`)}if(e==="complex64")throw new Error("complex64 dtype TensorBuffers are not supported. Please create a TensorBuffer for the real and imaginary parts separately and call tf.complex(real, imag).");this.values=s||de(e,this.size),this.strides=ht(t)}set(t,...e){e.length===0&&(e=[0]),S(e.length===this.rank,()=>`The number of provided coordinates (${e.length}) must match the rank (${this.rank})`);const s=this.locToIndex(e);this.values[s]=t}get(...t){t.length===0&&(t=[0]);let e=0;for(const r of t){if(r<0||r>=this.shape[e]){const o=`Requested out of range element at ${t}.   Buffer shape=${this.shape}`;throw new Error(o)}e++}let s=t[t.length-1];for(let r=0;r<t.length-1;++r)s+=this.strides[r]*t[r];return this.values[s]}locToIndex(t){if(this.rank===0)return 0;if(this.rank===1)return t[0];let e=t[t.length-1];for(let s=0;s<t.length-1;++s)e+=this.strides[s]*t[s];return e}indexToLoc(t){if(this.rank===0)return[];if(this.rank===1)return[t];const e=new Array(this.shape.length);for(let s=0;s<e.length-1;++s)e[s]=Math.floor(t/this.strides[s]),t-=e[s]*this.strides[s];return e[e.length-1]=t,e}get rank(){return this.shape.length}toTensor(){return xn().makeTensor(this.values,this.shape,this.dtype)}}let xn=null,fr=null;function uI(n){xn=n}function hI(n){fr=n}class ne{constructor(t,e,s,r){this.kept=!1,this.isDisposedInternal=!1,this.shape=t.slice(),this.dtype=e||"float32",this.size=q(t),this.strides=ht(t),this.dataId=s,this.id=r,this.rankType=this.rank<5?this.rank.toString():"higher"}get rank(){return this.shape.length}async buffer(){const t=await this.data();return fr.buffer(this.shape,this.dtype,t)}bufferSync(){return fr.buffer(this.shape,this.dtype,this.dataSync())}async array(){const t=await this.data();return In(this.shape,t,this.dtype==="complex64")}arraySync(){return In(this.shape,this.dataSync(),this.dtype==="complex64")}async data(){this.throwIfDisposed();const t=xn().read(this.dataId);if(this.dtype==="string"){const e=await t;try{return e.map(s=>us(s))}catch{throw new Error("Failed to decode the string bytes into utf-8. To get the original bytes, call tensor.bytes().")}}return t}dataToGPU(t){return this.throwIfDisposed(),xn().readToGPU(this.dataId,t)}dataSync(){this.throwIfDisposed();const t=xn().readSync(this.dataId);if(this.dtype==="string")try{return t.map(e=>us(e))}catch{throw new Error("Failed to decode the string bytes into utf-8. To get the original bytes, call tensor.bytes().")}return t}async bytes(){this.throwIfDisposed();const t=await xn().read(this.dataId);return this.dtype==="string"?t:new Uint8Array(t.buffer)}dispose(){this.isDisposed||(xn().disposeTensor(this),this.isDisposedInternal=!0)}get isDisposed(){return this.isDisposedInternal}throwIfDisposed(){if(this.isDisposed)throw new Error("Tensor is disposed.")}print(t=!1){return fr.print(this,t)}clone(){return this.throwIfDisposed(),fr.clone(this)}toString(t=!1){const e=this.dataSync();return cI(e,this.shape,this.dtype,t)}cast(t){return this.throwIfDisposed(),fr.cast(this,t)}variable(t=!0,e,s){return this.throwIfDisposed(),xn().makeVariable(this,t,e,s)}}Object.defineProperty(ne,Symbol.hasInstance,{value:n=>!!n&&n.data!=null&&n.dataSync!=null&&n.throwIfDisposed!=null});function G(){return qu("Tensor",()=>ne)}G();class Ea extends ne{constructor(t,e,s,r){super(t.shape,t.dtype,t.dataId,r),this.trainable=e,this.name=s}assign(t){if(t.dtype!==this.dtype)throw new Error(`dtype of the new value (${t.dtype}) and previous value (${this.dtype}) must match`);if(!Tt(t.shape,this.shape))throw new Error(`shape of the new value (${t.shape}) and previous value (${this.shape}) must match`);xn().disposeTensor(this),this.dataId=t.dataId,xn().incRef(this,null)}dispose(){xn().disposeVariable(this),this.isDisposedInternal=!0}}Object.defineProperty(Ea,Symbol.hasInstance,{value:n=>n instanceof ne&&n.assign!=null&&n.assign instanceof Function});var Kp;(function(n){n.R0="R0",n.R1="R1",n.R2="R2",n.R3="R3",n.R4="R4",n.R5="R5",n.R6="R6"})(Kp||(Kp={}));var du;(function(n){n.float32="float32",n.int32="int32",n.bool="int32",n.complex64="complex64"})(du||(du={}));var pu;(function(n){n.float32="float32",n.int32="int32",n.bool="bool",n.complex64="complex64"})(pu||(pu={}));var fu;(function(n){n.float32="float32",n.int32="float32",n.bool="float32",n.complex64="complex64"})(fu||(fu={}));var mu;(function(n){n.float32="complex64",n.int32="complex64",n.bool="complex64",n.complex64="complex64"})(mu||(mu={}));const dI={float32:fu,int32:du,bool:pu,complex64:mu};function Ve(n,t){if(n==="string"||t==="string"){if(n==="string"&&t==="string")return"string";throw new Error(`Can not upcast ${n} with ${t}`)}return dI[n][t]}function Lh(n){return Ve(n,"int32")}function Zt(n,t){if(n.dtype===t.dtype)return[n,t];const e=Ve(n.dtype,t.dtype);return[n.cast(e),t.cast(e)]}function n6(n,t){S(n.dtype===t.dtype,()=>`The dtypes of the first(${n.dtype}) and second(${t.dtype}) input must match`)}function gg(n){const t=[];return xg(n,t,new Set),t}function xg(n,t,e){if(n==null)return;if(n instanceof ne){t.push(n);return}if(!pI(n))return;const s=n;for(const r in s){const o=s[r];e.has(o)||(e.add(o),xg(o,t,e))}}function pI(n){return Array.isArray(n)||typeof n=="object"}function Pl(n){return n.kernelName!=null}class jp{constructor(){this.registeredVariables={},this.nextTapeNodeId=0,this.numBytes=0,this.numTensors=0,this.numStringTensors=0,this.numDataBuffers=0,this.gradientDepth=0,this.kernelDepth=0,this.scopeStack=[],this.numDataMovesStack=[],this.nextScopeId=0,this.tensorInfo=new WeakMap,this.profiling=!1,this.activeProfile={newBytes:0,newTensors:0,peakBytes:0,kernels:[],result:null,get kernelNames(){return Array.from(new Set(this.kernels.map(t=>t.name)))}}}dispose(){for(const t in this.registeredVariables)this.registeredVariables[t].dispose()}}class Sr{constructor(t){this.ENV=t,this.registry={},this.registryFactory={},this.pendingBackendInitId=0,this.state=new jp}async ready(){if(this.pendingBackendInit!=null)return this.pendingBackendInit.then(()=>{});if(this.backendInstance!=null)return;const t=this.getSortedBackends();for(let e=0;e<t.length;e++){const s=t[e];if(await this.initializeBackend(s).success){await this.setBackend(s);return}}throw new Error("Could not initialize any backends, all backend initializations failed.")}get backend(){if(this.pendingBackendInit!=null)throw new Error(`Backend '${this.backendName}' has not yet been initialized. Make sure to await tf.ready() or await tf.setBackend() before calling other methods`);if(this.backendInstance==null){const{name:t,asyncInit:e}=this.initializeBackendsAndReturnBest();if(e)throw new Error(`The highest priority backend '${t}' has not yet been initialized. Make sure to await tf.ready() or await tf.setBackend() before calling other methods`);this.setBackend(t)}return this.backendInstance}backendNames(){return Object.keys(this.registryFactory)}findBackend(t){if(!(t in this.registry))if(t in this.registryFactory){const{asyncInit:e}=this.initializeBackend(t);if(e)return null}else return null;return this.registry[t]}findBackendFactory(t){return t in this.registryFactory?this.registryFactory[t].factory:null}registerBackend(t,e,s=1){return t in this.registryFactory?(je(`${t} backend was already registered. Reusing existing backend factory.`),!1):(this.registryFactory[t]={factory:e,priority:s},!0)}async setBackend(t){if(this.registryFactory[t]==null)throw new Error(`Backend name '${t}' not found in registry`);if(this.backendName=t,this.registry[t]==null){this.backendInstance=null;const{success:e,asyncInit:s}=this.initializeBackend(t);if(!(s?await e:e))return!1}return this.backendInstance=this.registry[t],this.setupRegisteredKernels(),this.profiler=new sI(this.backendInstance),!0}setupRegisteredKernels(){Up(this.backendName).forEach(e=>{e.setupFunc!=null&&e.setupFunc(this.backendInstance)})}disposeRegisteredKernels(t){Up(t).forEach(s=>{s.disposeFunc!=null&&s.disposeFunc(this.registry[t])})}initializeBackend(t){const e=this.registryFactory[t];if(e==null)throw new Error(`Cannot initialize backend ${t}, no registration found.`);try{const s=e.factory();if(s&&!(s instanceof Uu)&&typeof s.then=="function"){const r=++this.pendingBackendInitId,o=s.then(i=>r<this.pendingBackendInitId?!1:(this.registry[t]=i,this.pendingBackendInit=null,!0)).catch(i=>(r<this.pendingBackendInitId||(this.pendingBackendInit=null,je(`Initialization of backend ${t} failed`),je(i.stack||i.message)),!1));return this.pendingBackendInit=o,{success:o,asyncInit:!0}}else return this.registry[t]=s,{success:!0,asyncInit:!1}}catch(s){return je(`Initialization of backend ${t} failed`),je(s.stack||s.message),{success:!1,asyncInit:!1}}}removeBackend(t){if(!(t in this.registryFactory))throw new Error(`${t} backend not found in registry`);this.backendName===t&&this.pendingBackendInit!=null&&this.pendingBackendInitId++,t in this.registry&&(this.disposeRegisteredKernels(t),this.registry[t].dispose(),delete this.registry[t]),delete this.registryFactory[t],this.backendName===t&&(this.pendingBackendInit=null,this.backendName=null,this.backendInstance=null)}getSortedBackends(){if(Object.keys(this.registryFactory).length===0)throw new Error("No backend found in registry.");return Object.keys(this.registryFactory).sort((t,e)=>this.registryFactory[e].priority-this.registryFactory[t].priority)}initializeBackendsAndReturnBest(){const t=this.getSortedBackends();for(let e=0;e<t.length;e++){const s=t[e],{success:r,asyncInit:o}=this.initializeBackend(s);if(o||r)return{name:s,asyncInit:o}}throw new Error("Could not initialize any backends, all backend initializations failed.")}moveData(t,e){const s=this.state.tensorInfo.get(e),r=s.backend,o=this.readSync(e),i=r.refCount(e);r.disposeData(e,!0),s.backend=t,t.move(e,o,s.shape,s.dtype,i),this.shouldCheckForMemLeaks()&&this.state.numDataMovesStack[this.state.numDataMovesStack.length-1]++}tidy(t,e){let s=null;if(e==null){if(typeof t!="function")throw new Error("Please provide a function to tidy()");e=t}else{if(typeof t!="string"&&!(t instanceof String))throw new Error("When calling with two arguments, the first argument to tidy() must be a string");if(typeof e!="function")throw new Error("When calling with two arguments, the 2nd argument to tidy() must be a function");s=t}let r;return this.scopedRun(()=>this.startScope(s),()=>this.endScope(r),()=>(r=e(),r instanceof Promise&&console.error("Cannot return a Promise inside of tidy."),r))}scopedRun(t,e,s){t();try{const r=s();return e(),r}catch(r){throw e(),r}}nextTensorId(){return Sr.nextTensorId++}nextVariableId(){return Sr.nextVariableId++}clone(t){const e=A.runKernel(Zo,{x:t}),s={x:t},r=i=>({x:()=>{const a="float32",c={x:i},l={dtype:a};return A.runKernel(Po,c,l)}}),o=[];return this.addTapeNode(this.state.activeScope.name,s,[e],r,o,{}),e}runKernel(t,e,s){if(this.backendName==null&&this.backend,!(Vp(t,this.backendName)!=null))throw new Error(`Kernel '${t}' not registered for backend '${this.backendName}'`);return this.runKernelFunc({kernelName:t,inputs:e,attrs:s})}shouldCheckForMemLeaks(){return this.ENV.getBool("IS_TEST")}checkKernelForMemLeak(t,e,s){const r=this.backend.numDataIds();let o=0;s.forEach(c=>{o+=c.dtype==="complex64"?3:1});const i=this.state.numDataMovesStack[this.state.numDataMovesStack.length-1],a=r-e-o-i;if(a>0)throw new Error(`Backend '${this.backendName}' has an internal memory leak (${a} data ids) after running '${t}'`)}runKernelFunc(t){let e,s=[];const r=this.isTapeOn(),o=this.state.numBytes,i=this.state.numTensors;this.shouldCheckForMemLeaks()&&this.state.numDataMovesStack.push(0);let a;this.backendName==null&&this.backend;let c;const l=Pl(t)?t.kernelName:this.state.activeScope!=null?this.state.activeScope.name:"";if(Pl(t)){const{kernelName:f,inputs:m,attrs:g}=t;this.backendName==null&&this.backend;const x=Vp(f,this.backendName);S(x!=null,()=>`Cannot find registered kernel '${f}' for backend '${this.backendName}'`),a=()=>{const b=this.backend.numDataIds();c=x.kernelFunc({inputs:m,attrs:g,backend:this.backend});const w=Array.isArray(c)?c:[c];this.shouldCheckForMemLeaks()&&this.checkKernelForMemLeak(f,b,w);const y=w.map(I=>I.rank!=null?I:this.makeTensorFromTensorInfo(I));if(r){const I=this.getTensorsForGradient(f,m,y);s=this.saveTensorsForBackwardMode(I)}return y}}else{const{forwardFunc:f}=t,m=g=>{r&&(s=g.map(x=>this.keep(this.clone(x))))};a=()=>{const g=this.backend.numDataIds();c=this.tidy(()=>f(this.backend,m));const x=Array.isArray(c)?c:[c];return this.shouldCheckForMemLeaks()&&this.checkKernelForMemLeak(l,g,x),x}}const{inputs:u,attrs:h}=t,d=Pl(t)?null:t.backwardsFunc;let p;return this.scopedRun(()=>this.state.kernelDepth++,()=>this.state.kernelDepth--,()=>{!this.ENV.getBool("DEBUG")&&!this.state.profiling?e=a():(p=this.profiler.profileKernel(l,u,()=>a()),this.ENV.getBool("DEBUG")&&this.profiler.logKernelProfile(p),e=p.outputs)}),r&&this.addTapeNode(l,u,e,d,s,h),this.state.profiling&&this.state.activeProfile.kernels.push({name:l,bytesAdded:this.state.numBytes-o,totalBytesSnapshot:this.state.numBytes,tensorsAdded:this.state.numTensors-i,totalTensorsSnapshot:this.state.numTensors,inputShapes:Object.keys(u).map(f=>u[f]!=null?u[f].shape:null),outputShapes:e.map(f=>f.shape),kernelTimeMs:p.timeMs,extraInfo:p.extraInfo}),Array.isArray(c)?e:e[0]}saveTensorsForBackwardMode(t){return t.map(s=>this.keep(this.clone(s)))}getTensorsForGradient(t,e,s){const r=Wp(t);if(r!=null){const o=r.inputsToSave||[],i=r.outputsToSave||[];let a;r.saveAllInputs?(S(Array.isArray(e),()=>"saveAllInputs is true, expected inputs to be an array."),a=Object.keys(e).map(l=>e[l])):a=o.map(l=>e[l]);const c=s.filter((l,u)=>i[u]);return a.concat(c)}return[]}makeTensor(t,e,s,r){if(t==null)throw new Error("Values passed to engine.makeTensor() are null");s=s||"float32",r=r||this.backend;let o=t;s==="string"&&Eo(t[0])&&(o=t.map(c=>as(c)));const i=r.write(o,e,s),a=new ne(e,s,i,this.nextTensorId());if(this.trackTensor(a,r),s==="string"){const c=this.state.tensorInfo.get(i),l=_w(o);this.state.numBytes+=l-c.bytes,c.bytes=l}return a}makeTensorFromDataId(t,e,s,r){s=s||"float32";const o={dataId:t,shape:e,dtype:s};return this.makeTensorFromTensorInfo(o,r)}makeTensorFromTensorInfo(t,e){const{dataId:s,shape:r,dtype:o}=t,i=new ne(r,o,s,this.nextTensorId());return this.trackTensor(i,e),i}makeVariable(t,e=!0,s,r){s=s||this.nextVariableId().toString(),r!=null&&r!==t.dtype&&(t=t.cast(r));const o=new Ea(t,e,s,this.nextTensorId());if(this.state.registeredVariables[o.name]!=null)throw new Error(`Variable with name ${o.name} was already registered`);return this.state.registeredVariables[o.name]=o,this.incRef(o,this.backend),o}trackTensor(t,e){this.state.numTensors++,t.dtype==="string"&&this.state.numStringTensors++;let s=0;t.dtype!=="complex64"&&t.dtype!=="string"&&(s=t.size*ru(t.dtype)),this.state.numBytes+=s,this.state.tensorInfo.has(t.dataId)||(this.state.numDataBuffers++,this.state.tensorInfo.set(t.dataId,{backend:e||this.backend,dtype:t.dtype,shape:t.shape,bytes:s})),t instanceof Ea||this.track(t)}incRef(t,e){this.trackTensor(t,e),this.backend.incRef(t.dataId)}removeDataId(t,e){this.state.tensorInfo.has(t)&&this.state.tensorInfo.get(t).backend===e&&(this.state.tensorInfo.delete(t),this.state.numDataBuffers--)}disposeTensor(t){if(!this.state.tensorInfo.has(t.dataId))return;const e=this.state.tensorInfo.get(t.dataId);if(this.state.numTensors--,t.dtype==="string"&&(this.state.numStringTensors--,this.state.numBytes-=e.bytes),t.dtype!=="complex64"&&t.dtype!=="string"){const s=t.size*ru(t.dtype);this.state.numBytes-=s}e.backend.disposeData(t.dataId)&&this.removeDataId(t.dataId,e.backend)}disposeVariables(){for(const t in this.state.registeredVariables){const e=this.state.registeredVariables[t];this.disposeVariable(e)}}disposeVariable(t){this.disposeTensor(t),this.state.registeredVariables[t.name]!=null&&delete this.state.registeredVariables[t.name]}memory(){const t=this.backend.memory();return t.numTensors=this.state.numTensors,t.numDataBuffers=this.state.numDataBuffers,t.numBytes=this.state.numBytes,this.state.numStringTensors>0&&(t.unreliable=!0,t.reasons==null&&(t.reasons=[]),t.reasons.push("Memory usage by string tensors is approximate (2 bytes per character)")),t}async profile(t){this.state.profiling=!0;const e=this.state.numBytes,s=this.state.numTensors;this.state.activeProfile.kernels=[],this.state.activeProfile.result=await t(),this.state.profiling=!1,this.state.activeProfile.peakBytes=Math.max(...this.state.activeProfile.kernels.map(r=>r.totalBytesSnapshot)),this.state.activeProfile.newBytes=this.state.numBytes-e,this.state.activeProfile.newTensors=this.state.numTensors-s;for(const r of this.state.activeProfile.kernels)r.kernelTimeMs=await r.kernelTimeMs,r.extraInfo=await r.extraInfo;return this.state.activeProfile}isTapeOn(){return this.state.gradientDepth>0&&this.state.kernelDepth===0}addTapeNode(t,e,s,r,o,i){const a={id:this.state.nextTapeNodeId++,kernelName:t,inputs:e,outputs:s,saved:o},c=Wp(t);c!=null&&(r=c.gradFunc),r!=null&&(a.gradient=l=>(l=l.map((u,h)=>{if(u==null){const d=s[h],p=ke(d.size,d.dtype);return this.makeTensor(p,d.shape,d.dtype)}return u}),r(l.length>1?l:l[0],o,i))),this.state.activeTape.push(a)}keep(t){return t.kept=!0,t}startTape(){this.state.gradientDepth===0&&(this.state.activeTape=[]),this.state.gradientDepth++}endTape(){this.state.gradientDepth--}startScope(t){const e={track:[],name:"unnamed scope",id:this.state.nextScopeId++};t&&(e.name=t),this.state.scopeStack.push(e),this.state.activeScope=e}endScope(t){const e=gg(t),s=new Set(e.map(o=>o.id));for(let o=0;o<this.state.activeScope.track.length;o++){const i=this.state.activeScope.track[o];!i.kept&&!s.has(i.id)&&i.dispose()}const r=this.state.scopeStack.pop();this.state.activeScope=this.state.scopeStack.length===0?null:this.state.scopeStack[this.state.scopeStack.length-1],e.forEach(o=>{!o.kept&&o.scopeId===r.id&&this.track(o)})}gradients(t,e,s,r=!1){if(S(e.length>0,()=>"gradients() received an empty list of xs."),s!=null&&s.dtype!=="float32")throw new Error(`dy must have 'float32' dtype, but has '${s.dtype}'`);const o=this.scopedRun(()=>this.startTape(),()=>this.endTape(),()=>this.tidy("forward",t));S(o instanceof ne,()=>"The result y returned by f() must be a tensor.");const i=iI(this.state.activeTape,e,o);if(!r&&i.length===0&&e.length>0)throw new Error("Cannot compute gradient of y=f(x) with respect to x. Make sure that the f you passed encloses all operations that lead from x to y.");return this.tidy("backward",()=>{const a={};a[o.id]=s??fI(o.shape),aI(a,i,l=>this.tidy(l),mI);const c=e.map(l=>a[l.id]);return this.state.gradientDepth===0&&(this.state.activeTape.forEach(l=>{for(const u of l.saved)u.dispose()}),this.state.activeTape=null),{value:o,grads:c}})}customGrad(t){return S(iu(t),()=>"The f passed in customGrad(f) must be a function."),(...e)=>{S(e.every(a=>a instanceof ne),()=>"The args passed in customGrad(f)(x1, x2,...) must all be tensors");let s;const r={};e.forEach((a,c)=>{r[c]=a});const o=(a,c)=>(s=t(...e,c),S(s.value instanceof ne,()=>"The function f passed in customGrad(f) must return an object where `obj.value` is a tensor"),S(iu(s.gradFunc),()=>"The function f passed in customGrad(f) must return an object where `obj.gradFunc` is a function."),s.value),i=(a,c)=>{const l=s.gradFunc(a,c),u=Array.isArray(l)?l:[l];S(u.length===e.length,()=>"The function f passed in customGrad(f) must return an object where `obj.gradFunc` is a function that returns the same number of tensors as inputs passed to f(...)."),S(u.every(d=>d instanceof ne),()=>"The function f passed in customGrad(f) must return an object where `obj.gradFunc` is a function that returns a list of only tensors.");const h={};return u.forEach((d,p)=>{h[p]=()=>d}),h};return this.runKernelFunc({forwardFunc:o,backwardsFunc:i,inputs:r})}}readSync(t){return this.state.tensorInfo.get(t).backend.readSync(t)}read(t){return this.state.tensorInfo.get(t).backend.read(t)}readToGPU(t,e){return this.state.tensorInfo.get(t).backend.readToGPU(t,e)}async time(t){const e=Fe(),s=await this.backend.time(t);return s.wallMs=Fe()-e,s}track(t){return this.state.activeScope!=null&&(t.scopeId=this.state.activeScope.id,this.state.activeScope.track.push(t)),t}get registeredVariables(){return this.state.registeredVariables}reset(){this.pendingBackendInitId++,this.state.dispose(),this.ENV.reset(),this.state=new jp;for(const t in this.registry)this.disposeRegisteredKernels(t),this.registry[t].dispose(),delete this.registry[t];this.backendName=null,this.backendInstance=null,this.pendingBackendInit=null}}Sr.nextTensorId=0;Sr.nextVariableId=0;function fI(n){const t=Hu(q(n),"float32");return A.makeTensor(t,n,"float32")}function bg(){const n=Km();if(n._tfengine==null){const t=new Lw(n);n._tfengine=new Sr(t)}return Vw(n._tfengine.ENV),uI(()=>n._tfengine),n._tfengine}const A=bg();function mI(n,t){const e={a:n,b:t};return A.runKernel(Pr,e)}function gI(){return typeof navigator<"u"&&navigator!=null}function yg(n){if(n||gI()){if(n||(n=navigator),n.product==="ReactNative")return!0;const t=n.userAgent||n.vendor||(typeof window<"u"?window.opera:"");if(!t){const e=n;return e.userAgentData&&e.userAgentData.mobile}return/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(t)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(t.substr(0,4))}return!1}function wg(){return typeof window<"u"&&window.document!=null||typeof WorkerGlobalScope<"u"}const We=W();We.registerFlag("DEBUG",()=>!1,n=>{n&&console.warn("Debugging mode is ON. The output of every math call will be downloaded to CPU and checked for NaNs. This significantly impacts performance.")});We.registerFlag("IS_BROWSER",()=>wg());We.registerFlag("IS_NODE",()=>typeof process<"u"&&typeof process.versions<"u"&&typeof process.versions.node<"u");We.registerFlag("IS_CHROME",()=>typeof navigator<"u"&&navigator!=null&&navigator.userAgent!=null&&/Chrome/.test(navigator.userAgent)&&/Google Inc/.test(navigator.vendor));We.registerFlag("PROD",()=>!1);We.registerFlag("TENSORLIKE_CHECK_SHAPE_CONSISTENCY",()=>We.getBool("DEBUG"));We.registerFlag("DEPRECATION_WARNINGS_ENABLED",()=>!0);We.registerFlag("IS_TEST",()=>!1);We.registerFlag("CHECK_COMPUTATION_FOR_ERRORS",()=>!0);We.registerFlag("WRAP_TO_IMAGEBITMAP",()=>!1);We.registerFlag("ENGINE_COMPILE_ONLY",()=>!1);We.registerFlag("CANVAS2D_WILL_READ_FREQUENTLY_FOR_GPU",()=>!1);We.registerFlag("USE_SETTIMEOUTCUSTOM",()=>!1);function el(n,t){let e=n;if(_n(n))return t==="string"?[]:[n.length];if(!Array.isArray(n))return[];const s=[];for(;Array.isArray(e)||_n(e)&&t!=="string";)s.push(e.length),e=e[0];return Array.isArray(n)&&W().getBool("TENSORLIKE_CHECK_SHAPE_CONSISTENCY")&&Ig(n,s,[]),s}function Ig(n,t,e){if(e=e||[],!Array.isArray(n)&&!_n(n)){S(t.length===0,()=>`Element arr[${e.join("][")}] is a primitive, but should be an array/TypedArray of ${t[0]} elements`);return}S(t.length>0,()=>`Element arr[${e.join("][")}] should be a primitive, but is an array of ${n.length} elements`),S(n.length===t[0],()=>`Element arr[${e.join("][")}] should have ${t[0]} elements, but has ${n.length} elements`);const s=t.slice(1);for(let r=0;r<n.length;++r)Ig(n[r],s,e.concat(r))}function Xp(n,t,e,s){if(n!=="string_or_numeric"){if(n==null)throw new Error("Expected dtype cannot be null.");if(n!=="numeric"&&n!==t||n==="numeric"&&t==="string")throw new Error(`Argument '${e}' passed to '${s}' must be ${n} tensor, but got ${t} tensor`)}}function E(n,t,e,s="numeric"){if(n instanceof ne)return Xp(s,n.dtype,t,e),n;let r=Ro(n);if(r!=="string"&&["bool","int32","float32"].indexOf(s)>=0&&(r=s),Xp(s,r,t,e),n==null||!_n(n)&&!Array.isArray(n)&&typeof n!="number"&&typeof n!="boolean"&&typeof n!="string"){const c=n==null?"null":n.constructor.name;throw new Error(`Argument '${t}' passed to '${e}' must be a Tensor or TensorLike, but got '${c}'`)}const o=el(n,r);!_n(n)&&!Array.isArray(n)&&(n=[n]);const a=r!=="string"?sr(n,r):kr(n,[],!0);return A.makeTensor(a,o,r)}function vg(n,t,e,s="numeric"){if(!Array.isArray(n))throw new Error(`Argument ${t} passed to ${e} must be a \`Tensor[]\` or \`TensorLike[]\``);return n.map((o,i)=>E(o,`${t}[${i}]`,e,s))}const xI="__op";function F(n){const t=Object.keys(n);if(t.length!==1)throw new Error(`Please provide an object with a single key (operation name) mapping to a function. Got an object with ${t.length} keys.`);let e=t[0];const s=n[e];e.endsWith("_")&&(e=e.substring(0,e.length-1)),e=e+xI;const r=(...o)=>{A.startScope(e);try{const i=s(...o);return Hm(i)&&console.error("Cannot return a Promise inside of tidy."),A.endScope(i),i}catch(i){throw A.endScope(null),i}};return Object.defineProperty(r,"name",{value:e,configurable:!0}),r}function bI(n,t){const e=E(n,"real","complex"),s=E(t,"imag","complex");un(e.shape,s.shape,`real and imag shapes, ${e.shape} and ${s.shape}, must match in call to tf.complex().`);const r={real:e,imag:s};return A.runKernel(Qu,r)}const Hs=F({complex_:bI});function nl(n,t,e,s){if(s==null&&(s=Ro(n)),s==="complex64")throw new Error("Cannot construct a complex64 tensor directly. Please use tf.complex(real, imag).");if(!_n(n)&&!Array.isArray(n)&&typeof n!="number"&&typeof n!="boolean"&&typeof n!="string")throw new Error("values passed to tensor(values) must be a number/boolean/string or an array of numbers/booleans/strings, or a TypedArray");if(t!=null){Gm(t);const r=q(t),o=q(e);S(r===o,()=>`Based on the provided shape, [${t}], the tensor should have ${r} values but has ${o}`);for(let i=0;i<e.length;++i){const a=e[i],c=i===e.length-1?a!==q(t.slice(i)):!0;S(e[i]===t[i]||!c,()=>`Error creating a new Tensor. Inferred shape (${e}) does not match the provided shape (${t}). `)}}return!_n(n)&&!Array.isArray(n)&&(n=[n]),t=t||e,n=s!=="string"?sr(n,s):kr(n,[],!0),A.makeTensor(n,t,s)}function ma(n,t,e){const s=el(n,e);return nl(n,t,s,e)}const Yp={float32:4,float16:2,int32:4,uint16:2,uint8:1,bool:1,complex64:8};const Ra=4;async function Zp(n,t){const e=[],s=[],r=Array.isArray(n)?n.map(i=>i.name):Object.keys(n);for(let i=0;i<r.length;++i){const a=r[i],c=Array.isArray(n)?n[i].tensor:n[a];if(c.dtype!=="float32"&&c.dtype!=="int32"&&c.dtype!=="bool"&&c.dtype!=="string"&&c.dtype!=="complex64")throw new Error(`Unsupported dtype in weight '${a}': ${c.dtype}`);const l={name:a,shape:c.shape,dtype:c.dtype};if(c.dtype==="string"){const u=new Promise(async h=>{const d=await c.bytes(),p=d.reduce((g,x)=>g+x.length,0)+Ra*d.length,f=new Uint8Array(p);let m=0;for(let g=0;g<d.length;g++){const x=d[g],b=new Uint8Array(new Uint32Array([x.length]).buffer);f.set(b,m),m+=Ra,f.set(x,m),m+=x.length}h(f)});s.push(u)}else s.push(c.data());t!=null&&(l.group=t),e.push(l)}const o=await Promise.all(s);return{data:yI(o),specs:e}}function s6(n,t){const e={};let s,r=0;for(const o of t){const i=o.name,a=o.dtype,c=o.shape,l=q(c);let u;if("quantization"in o){const h=o.quantization;if(h.dtype==="uint8"||h.dtype==="uint16"){if(!("min"in h&&"scale"in h))throw new Error(`Weight ${o.name} with quantization ${h.dtype} doesn't have corresponding metadata min and scale.`)}else if(h.dtype==="float16"){if(a!=="float32")throw new Error(`Weight ${o.name} is quantized with ${h.dtype} which only supports weights of type float32 not ${a}.`)}else throw new Error(`Weight ${o.name} has unknown quantization dtype ${h.dtype}. Supported quantization dtypes are: 'uint8', 'uint16', and 'float16'.`);const d=Yp[h.dtype],p=n.slice(r,r+l*d),f=h.dtype==="uint8"?new Uint8Array(p):new Uint16Array(p);if(a==="float32")if(h.dtype==="uint8"||h.dtype==="uint16"){u=new Float32Array(f.length);for(let m=0;m<f.length;m++){const g=f[m];u[m]=g*h.scale+h.min}}else if(h.dtype==="float16")s===void 0&&(s=NI()),u=s(f);else throw new Error(`Unsupported quantization type ${h.dtype} for weight type float32.`);else if(a==="int32"){if(h.dtype!=="uint8"&&h.dtype!=="uint16")throw new Error(`Unsupported quantization type ${h.dtype} for weight type int32.`);u=new Int32Array(f.length);for(let m=0;m<f.length;m++){const g=f[m];u[m]=Math.round(g*h.scale+h.min)}}else throw new Error(`Unsupported dtype in weight '${i}': ${a}`);r+=l*d}else if(a==="string"){const h=q(o.shape);u=[];for(let d=0;d<h;d++){const p=new Uint32Array(n.slice(r,r+Ra))[0];r+=Ra;const f=new Uint8Array(n.slice(r,r+p));u.push(f),r+=p}}else{const h=Yp[a],d=n.slice(r,r+l*h);if(a==="float32")u=new Float32Array(d);else if(a==="int32")u=new Int32Array(d);else if(a==="bool")u=new Uint8Array(d);else if(a==="complex64"){u=new Float32Array(d);const p=new Float32Array(u.length/2),f=new Float32Array(u.length/2);for(let x=0;x<p.length;x++)p[x]=u[x*2],f[x]=u[x*2+1];const m=ma(p,c,"float32"),g=ma(f,c,"float32");e[i]=Hs(m,g),m.dispose(),g.dispose()}else throw new Error(`Unsupported dtype in weight '${i}': ${a}`);r+=l*h}a!=="complex64"&&(e[i]=ma(u,c,a))}return e}function yI(n){if(n===null)throw new Error(`Invalid input value: ${JSON.stringify(n)}`);let t=0;const e=[];n.forEach(o=>{if(t+=o.byteLength,e.push(o.byteLength===o.buffer.byteLength?o:new o.constructor(o)),!(o instanceof Float32Array||o instanceof Int32Array||o instanceof Uint8Array))throw new Error(`Unsupported TypedArray subtype: ${o.constructor.name}`)});const s=new Uint8Array(t);let r=0;return e.forEach(o=>{s.set(new Uint8Array(o.buffer),r),r+=o.byteLength}),s.buffer}const Ph=typeof Buffer<"u"&&(typeof Blob>"u"||typeof atob>"u"||typeof btoa>"u");function Jp(n){return Ph?Buffer.byteLength(n):new Blob([n]).size}function wI(n){if(Ph)return Buffer.from(n).toString("base64");const t=new Uint8Array(n);let e="";for(let s=0,r=t.length;s<r;s++)e+=String.fromCharCode(t[s]);return btoa(e)}function II(n){if(Ph){const s=Buffer.from(n,"base64");return s.buffer.slice(s.byteOffset,s.byteOffset+s.byteLength)}const t=atob(n),e=new Uint8Array(t.length);for(let s=0;s<t.length;++s)e.set([t.charCodeAt(s)],s);return e.buffer}function vI(n){if(n.length===1)return n[0];let t=0;n.forEach(r=>{t+=r.byteLength});const e=new Uint8Array(t);let s=0;return n.forEach(r=>{e.set(new Uint8Array(r),s),s+=r.byteLength}),e.buffer}function r6(n){const t="/";for(n=n.trim();n.endsWith(t);)n=n.slice(0,n.length-1);const e=n.split(t);return e[e.length-1]}function o6(n,t){const e={modelTopology:n.modelTopology,format:n.format,generatedBy:n.generatedBy,convertedBy:n.convertedBy,weightsManifest:t};return n.signature!=null&&(e.signature=n.signature),n.userDefinedMetadata!=null&&(e.userDefinedMetadata=n.userDefinedMetadata),n.modelInitializer!=null&&(e.modelInitializer=n.modelInitializer),n.trainingConfig!=null&&(e.trainingConfig=n.trainingConfig),e}function CI(n,t,e){const s={modelTopology:n.modelTopology,format:n.format,generatedBy:n.generatedBy,convertedBy:n.convertedBy};if(n.trainingConfig!=null&&(s.trainingConfig=n.trainingConfig),n.weightsManifest!=null){if(!t)throw new Error("modelJSON has weightsManifest but weightSpecs is null");if(!e)throw new Error("modelJSON has weightsManifest but weightData is null");s.weightSpecs=t,s.weightData=e}return n.signature!=null&&(s.signature=n.signature),n.userDefinedMetadata!=null&&(s.userDefinedMetadata=n.userDefinedMetadata),n.modelInitializer!=null&&(s.modelInitializer=n.modelInitializer),s}async function i6(n,t){let e,s;return n.weightsManifest!=null&&([e,s]=await t(n.weightsManifest)),CI(n,e,s)}function Cg(n){if(n.modelTopology instanceof ArrayBuffer)throw new Error("Expected JSON model topology, received ArrayBuffer.");return{dateSaved:new Date,modelTopologyType:"JSON",modelTopologyBytes:n.modelTopology==null?0:Jp(JSON.stringify(n.modelTopology)),weightSpecsBytes:n.weightSpecs==null?0:Jp(JSON.stringify(n.weightSpecs)),weightDataBytes:n.weightData==null?0:n.weightData.byteLength}}function a6(n){const t=[];for(const e of n)t.push(...e.weights);return t}function kI(){const n=e=>{let s=e<<13,r=0;for(;(s&8388608)===0;)r-=8388608,s<<=1;return s&=-8388609,r+=947912704,s|r},t=new Uint32Array(2048);t[0]=0;for(let e=1;e<1024;e++)t[e]=n(e);for(let e=1024;e<2048;e++)t[e]=939524096+(e-1024<<13);return t}function $I(){const n=new Uint32Array(64);n[0]=0,n[31]=1199570944,n[32]=2147483648,n[63]=3347054592;for(let t=1;t<31;t++)n[t]=t<<23;for(let t=33;t<63;t++)n[t]=2147483648+(t-32<<23);return n}function SI(){const n=new Uint32Array(64);for(let t=0;t<64;t++)n[t]=1024;return n[0]=n[32]=0,n}function NI(){const n=kI(),t=$I(),e=SI();return s=>{const r=new ArrayBuffer(4*s.length),o=new Uint32Array(r);for(let i=0;i<s.length;i++){const a=s[i],c=n[e[a>>10]+(a&1023)]+t[a>>10];o[i]=c}return new Float32Array(r)}}class ee{constructor(){this.saveRouters=[],this.loadRouters=[]}static getInstance(){return ee.instance==null&&(ee.instance=new ee),ee.instance}static registerSaveRouter(t){ee.getInstance().saveRouters.push(t)}static registerLoadRouter(t){ee.getInstance().loadRouters.push(t)}static getSaveHandlers(t){return ee.getHandlers(t,"save")}static getLoadHandlers(t,e){return ee.getHandlers(t,"load",e)}static getHandlers(t,e,s){const r=[];return(e==="load"?ee.getInstance().loadRouters:ee.getInstance().saveRouters).forEach(i=>{const a=i(t,s);a!==null&&r.push(a)}),r}}const c6=n=>ee.registerSaveRouter(n),l6=n=>ee.registerLoadRouter(n),TI=n=>ee.getSaveHandlers(n),u6=(n,t)=>ee.getLoadHandlers(n,t);const gu="tensorflowjs",xu=1,Ps="models_store",rs="model_info_store";function kg(){if(!W().getBool("IS_BROWSER"))throw new Error("Failed to obtain IndexedDB factory because the current environmentis not a web browser.");const n=typeof window>"u"?self:window,t=n.indexedDB||n.mozIndexedDB||n.webkitIndexedDB||n.msIndexedDB||n.shimIndexedDB;if(t==null)throw new Error("The current browser does not appear to support IndexedDB.");return t}function bu(n){const t=n.result;t.createObjectStore(Ps,{keyPath:"modelPath"}),t.createObjectStore(rs,{keyPath:"modelPath"})}class qs{constructor(t){if(this.indexedDB=kg(),t==null||!t)throw new Error("For IndexedDB, modelPath must not be null, undefined or empty.");this.modelPath=t}async save(t){if(t.modelTopology instanceof ArrayBuffer)throw new Error("BrowserLocalStorage.save() does not support saving model topology in binary formats yet.");return this.databaseAction(this.modelPath,t)}async load(){return this.databaseAction(this.modelPath)}databaseAction(t,e){return new Promise((s,r)=>{const o=this.indexedDB.open(gu,xu);o.onupgradeneeded=()=>bu(o),o.onsuccess=()=>{const i=o.result;if(e==null){const a=i.transaction(Ps,"readonly"),l=a.objectStore(Ps).get(this.modelPath);l.onsuccess=()=>{if(l.result==null)return i.close(),r(new Error(`Cannot find model with path '${this.modelPath}' in IndexedDB.`));s(l.result.modelArtifacts)},l.onerror=u=>(i.close(),r(l.error)),a.oncomplete=()=>i.close()}else{const a=Cg(e),c=i.transaction(rs,"readwrite");let l=c.objectStore(rs);const u=l.put({modelPath:this.modelPath,modelArtifactsInfo:a});let h;u.onsuccess=()=>{h=i.transaction(Ps,"readwrite");const p=h.objectStore(Ps).put({modelPath:this.modelPath,modelArtifacts:e,modelArtifactsInfo:a});p.onsuccess=()=>s({modelArtifactsInfo:a}),p.onerror=f=>{l=c.objectStore(rs);const m=l.delete(this.modelPath);m.onsuccess=()=>(i.close(),r(p.error)),m.onerror=g=>(i.close(),r(p.error))}},u.onerror=d=>(i.close(),r(u.error)),c.oncomplete=()=>{h==null?i.close():h.oncomplete=()=>i.close()}}},o.onerror=i=>r(o.error)})}}qs.URL_SCHEME="indexeddb://";const $g=n=>W().getBool("IS_BROWSER")&&!Array.isArray(n)&&n.startsWith(qs.URL_SCHEME)?EI(n.slice(qs.URL_SCHEME.length)):null;ee.registerSaveRouter($g);ee.registerLoadRouter($g);function EI(n){return new qs(n)}function RI(n){return n.startsWith(qs.URL_SCHEME)?n.slice(qs.URL_SCHEME.length):n}class DI{constructor(){this.indexedDB=kg()}async listModels(){return new Promise((t,e)=>{const s=this.indexedDB.open(gu,xu);s.onupgradeneeded=()=>bu(s),s.onsuccess=()=>{const r=s.result,o=r.transaction(rs,"readonly"),a=o.objectStore(rs).getAll();a.onsuccess=()=>{const c={};for(const l of a.result)c[l.modelPath]=l.modelArtifactsInfo;t(c)},a.onerror=c=>(r.close(),e(a.error)),o.oncomplete=()=>r.close()},s.onerror=r=>e(s.error)})}async removeModel(t){return t=RI(t),new Promise((e,s)=>{const r=this.indexedDB.open(gu,xu);r.onupgradeneeded=()=>bu(r),r.onsuccess=()=>{const o=r.result,i=o.transaction(rs,"readwrite"),a=i.objectStore(rs),c=a.get(t);let l;c.onsuccess=()=>{if(c.result==null)return o.close(),s(new Error(`Cannot find model with path '${t}' in IndexedDB.`));{const u=a.delete(t),h=()=>{l=o.transaction(Ps,"readwrite");const p=l.objectStore(Ps).delete(t);p.onsuccess=()=>e(c.result.modelArtifactsInfo),p.onerror=f=>s(c.error)};u.onsuccess=h,u.onerror=d=>(h(),o.close(),s(c.error))}},c.onerror=u=>(o.close(),s(c.error)),i.oncomplete=()=>{l==null?o.close():l.oncomplete=()=>o.close()}},r.onerror=o=>s(r.error)})}}const Un="/",mr="tensorflowjs_models",Sg="info",AI="model_topology",FI="weight_specs",OI="weight_data",_I="model_metadata";function Ng(n){return{info:[mr,n,Sg].join(Un),topology:[mr,n,AI].join(Un),weightSpecs:[mr,n,FI].join(Un),weightData:[mr,n,OI].join(Un),modelMetadata:[mr,n,_I].join(Un)}}function Tg(n){for(const t of Object.values(n))window.localStorage.removeItem(t)}function MI(n){const t=n.split(Un);if(t.length<3)throw new Error(`Invalid key format: ${n}`);return t.slice(1,t.length-1).join(Un)}function LI(n){return n.startsWith(Ks.URL_SCHEME)?n.slice(Ks.URL_SCHEME.length):n}class Ks{constructor(t){if(!W().getBool("IS_BROWSER")||typeof window>"u"||typeof window.localStorage>"u")throw new Error("The current environment does not support local storage.");if(this.LS=window.localStorage,t==null||!t)throw new Error("For local storage, modelPath must not be null, undefined or empty.");this.modelPath=t,this.keys=Ng(this.modelPath)}async save(t){if(t.modelTopology instanceof ArrayBuffer)throw new Error("BrowserLocalStorage.save() does not support saving model topology in binary formats yet.");{const e=JSON.stringify(t.modelTopology),s=JSON.stringify(t.weightSpecs),r=Cg(t);try{this.LS.setItem(this.keys.info,JSON.stringify(r)),this.LS.setItem(this.keys.topology,e),this.LS.setItem(this.keys.weightSpecs,s),this.LS.setItem(this.keys.weightData,wI(t.weightData));const o={format:t.format,generatedBy:t.generatedBy,convertedBy:t.convertedBy,signature:t.signature!=null?t.signature:void 0,userDefinedMetadata:t.userDefinedMetadata!=null?t.userDefinedMetadata:void 0,modelInitializer:t.modelInitializer!=null?t.modelInitializer:void 0,trainingConfig:t.trainingConfig!=null?t.trainingConfig:void 0};return this.LS.setItem(this.keys.modelMetadata,JSON.stringify(o)),{modelArtifactsInfo:r}}catch{throw Tg(this.keys),new Error(`Failed to save model '${this.modelPath}' to local storage: size quota being exceeded is a possible cause of this failure: modelTopologyBytes=${r.modelTopologyBytes}, weightSpecsBytes=${r.weightSpecsBytes}, weightDataBytes=${r.weightDataBytes}.`)}}}async load(){const t=JSON.parse(this.LS.getItem(this.keys.info));if(t==null)throw new Error(`In local storage, there is no model with name '${this.modelPath}'`);if(t.modelTopologyType!=="JSON")throw new Error("BrowserLocalStorage does not support loading non-JSON model topology yet.");const e={},s=JSON.parse(this.LS.getItem(this.keys.topology));if(s==null)throw new Error(`In local storage, the topology of model '${this.modelPath}' is missing.`);e.modelTopology=s;const r=JSON.parse(this.LS.getItem(this.keys.weightSpecs));if(r==null)throw new Error(`In local storage, the weight specs of model '${this.modelPath}' are missing.`);e.weightSpecs=r;const o=this.LS.getItem(this.keys.modelMetadata);if(o!=null){const a=JSON.parse(o);e.format=a.format,e.generatedBy=a.generatedBy,e.convertedBy=a.convertedBy,a.signature!=null&&(e.signature=a.signature),a.userDefinedMetadata!=null&&(e.userDefinedMetadata=a.userDefinedMetadata),a.modelInitializer!=null&&(e.modelInitializer=a.modelInitializer),a.trainingConfig!=null&&(e.trainingConfig=a.trainingConfig)}const i=this.LS.getItem(this.keys.weightData);if(i==null)throw new Error(`In local storage, the binary weight values of model '${this.modelPath}' are missing.`);return e.weightData=II(i),e}}Ks.URL_SCHEME="localstorage://";const Eg=n=>W().getBool("IS_BROWSER")&&!Array.isArray(n)&&n.startsWith(Ks.URL_SCHEME)?PI(n.slice(Ks.URL_SCHEME.length)):null;ee.registerSaveRouter(Eg);ee.registerLoadRouter(Eg);function PI(n){return new Ks(n)}class BI{constructor(){S(W().getBool("IS_BROWSER"),()=>"Current environment is not a web browser"),S(typeof window>"u"||typeof window.localStorage<"u",()=>"Current browser does not appear to support localStorage"),this.LS=window.localStorage}async listModels(){const t={},e=mr+Un,s=Un+Sg;for(let r=0;r<this.LS.length;++r){const o=this.LS.key(r);if(o.startsWith(e)&&o.endsWith(s)){const i=MI(o);t[i]=JSON.parse(this.LS.getItem(o))}}return t}async removeModel(t){t=LI(t);const e=Ng(t);if(this.LS.getItem(e.info)==null)throw new Error(`Cannot find model at path '${t}'`);const s=JSON.parse(this.LS.getItem(e.info));return Tg(e),s}}const wr="://";class Se{constructor(){this.managers={}}static getInstance(){return Se.instance==null&&(Se.instance=new Se),Se.instance}static registerManager(t,e){S(t!=null,()=>"scheme must not be undefined or null."),t.endsWith(wr)&&(t=t.slice(0,t.indexOf(wr))),S(t.length>0,()=>"scheme must not be an empty string.");const s=Se.getInstance();S(s.managers[t]==null,()=>`A model store manager is already registered for scheme '${t}'.`),s.managers[t]=e}static getManager(t){const e=Se.getInstance().managers[t];if(e==null)throw new Error(`Cannot find model manager for scheme '${t}'`);return e}static getSchemes(){return Object.keys(Se.getInstance().managers)}}function ga(n){if(n.indexOf(wr)===-1)throw new Error(`The url string provided does not contain a scheme. Supported schemes are: ${Se.getSchemes().join(",")}`);return{scheme:n.split(wr)[0],path:n.split(wr)[1]}}async function Rg(n,t,e=!1){S(n!==t,()=>`Old path and new path are the same: '${n}'`);const s=ee.getLoadHandlers(n);S(s.length>0,()=>`Copying failed because no load handler is found for source URL ${n}.`),S(s.length<2,()=>`Copying failed because more than one (${s.length}) load handlers for source URL ${n}.`);const r=s[0],o=ee.getSaveHandlers(t);S(o.length>0,()=>`Copying failed because no save handler is found for destination URL ${t}.`),S(o.length<2,()=>`Copying failed because more than one (${s.length}) save handlers for destination URL ${t}.`);const i=o[0],a=ga(n).scheme,c=ga(n).path,l=a===ga(n).scheme,u=await r.load();e&&l&&await Se.getManager(a).removeModel(c);const h=await i.save(u);return e&&!l&&await Se.getManager(a).removeModel(c),h.modelArtifactsInfo}async function h6(){const n=Se.getSchemes(),t={};for(const e of n){const s=await Se.getManager(e).listModels();for(const r in s){const o=e+wr+r;t[o]=s[r]}}return t}async function d6(n){const t=ga(n);return Se.getManager(t.scheme).removeModel(t.path)}async function p6(n,t){return Rg(n,t,!1)}async function f6(n,t){return Rg(n,t,!0)}class zI{constructor(){this.messageName="setTimeoutCustom",this.functionRefs=[],this.handledMessageCount=0,this.hasEventListener=!1}fetch(t,e){return fetch(t,e)}now(){return performance.now()}encode(t,e){if(e!=="utf-8"&&e!=="utf8")throw new Error(`Browser's encoder only supports utf-8, but got ${e}`);return this.textEncoder==null&&(this.textEncoder=new TextEncoder),this.textEncoder.encode(t)}decode(t,e){return new TextDecoder(e).decode(t)}setTimeoutCustom(t,e){if(!window||!W().getBool("USE_SETTIMEOUTCUSTOM")){setTimeout(t,e);return}this.functionRefs.push(t),setTimeout(()=>{window.postMessage({name:this.messageName,index:this.functionRefs.length-1},"*")},e),this.hasEventListener||(this.hasEventListener=!0,window.addEventListener("message",s=>{if(s.source===window&&s.data.name===this.messageName){s.stopPropagation();const r=this.functionRefs[s.data.index];r(),this.handledMessageCount++,this.handledMessageCount===this.functionRefs.length&&(this.functionRefs=[],this.handledMessageCount=0)}},!0))}}if(W().get("IS_BROWSER")){W().setPlatform("browser",new zI);try{Se.registerManager(Ks.URL_SCHEME,new BI)}catch{}try{Se.registerManager(qs.URL_SCHEME,new DI)}catch{}}const VI={importFetch:()=>require("node-fetch")};let Bl;class WI{constructor(){this.util=require("util"),this.textEncoder=new this.util.TextEncoder}fetch(t,e){return W().global.fetch!=null?W().global.fetch(t,e):(Bl==null&&(Bl=VI.importFetch()),Bl(t,e))}now(){const t=process.hrtime();return t[0]*1e3+t[1]/1e6}encode(t,e){if(e!=="utf-8"&&e!=="utf8")throw new Error(`Node built-in encoder only supports utf-8, but got ${e}`);return this.textEncoder.encode(t)}decode(t,e){return t.length===0?"":new this.util.TextDecoder(e).decode(t)}}W().get("IS_NODE")&&!W().get("IS_BROWSER")&&W().setPlatform("node",new WI);function yt(n,t="float32",e){return t=t||"float32",Gm(n),new ve(n,t,e)}function UI(n,t){const e=E(n,"x","cast");if(!Ow(t))throw new Error(`Failed to cast to unknown dtype ${t}`);if(t==="string"&&e.dtype!=="string"||t!=="string"&&e.dtype==="string")throw new Error("Only strings can be casted to strings");const s={x:e},r={dtype:t};return A.runKernel(Po,s,r)}const nt=F({cast_:UI});function GI(n){const e={x:E(n,"x","clone","string_or_numeric")};return A.runKernel(Zo,e)}const zs=F({clone_:GI});function HI(n,t=!1){console.log(n.toString(t))}bg();const qI={buffer:yt,cast:nt,clone:zs,print:HI};hI(qI);function KI(n,t,e=!1,s=!1){let r=E(n,"a","matMul"),o=E(t,"b","matMul");[r,o]=Zt(r,o);const i={a:r,b:o},a={transposeA:e,transposeB:s};return A.runKernel(oc,i,a)}const Nt=F({matMul_:KI});function jI(n,t,e=1,s=0,r="int32"){if(t<2)throw new Error(`Error in oneHot: depth must be >=2, but it is ${t}`);const i={indices:E(n,"indices","oneHot","int32")},a={dtype:r,depth:t,onValue:e,offValue:s};return A.runKernel(Mc,i,a)}const Dg=F({oneHot_:jI});function ss(){return A}function Qp(){return A.memory()}function z(n,t){return A.tidy(n,t)}function It(n){gg(n).forEach(e=>e.dispose())}function Mn(n){return A.keep(n)}function Ag(n,t,e=1){return A.registerBackend(n,t,e)}function XI(){return A.backend}function YI(n){const e={input:E(n,"input","imag")};return A.runKernel(ph,e)}const Bh=F({imag_:YI});function ZI(n){const e={x:E(n,"x","neg")};return A.runKernel(Fc,e)}const qt=F({neg_:ZI});function JI(n){const e={input:E(n,"input","real")};return A.runKernel(Ih,e)}const Da=F({real_:JI});function QI(n,t,e){const s=E(n,"x","transpose");if(t==null&&(t=s.shape.map((i,a)=>a).reverse()),S(s.rank===t.length,()=>`Error in transpose: rank of input ${s.rank} must match length of perm ${t}.`),t.forEach(i=>{S(i>=0&&i<s.rank,()=>`All entries in 'perm' must be between 0 and ${s.rank-1} but got ${t}`)}),s.rank<=1)return s.clone();const r={x:s},o={perm:t};return s.dtype==="complex64"?z(()=>{let i=Da(s),a=Bh(s);return i=A.runKernel(yr,{x:i},o),a=A.runKernel(yr,{x:a},o),e&&(a=qt(a)),Hs(i,a)}):A.runKernel(yr,r,o)}const Ct=F({transpose_:QI});function Nr(n,t){const e=n.length,s=[];for(let r=0;r<e;r++){const o=e-1-r,i=n[o]||1;(t[t.length-1-r]||1)>1&&i===1&&s.unshift(o)}return s}function ce(n,t){const e=[];for(let s=0;s<t.length;s++){const r=n[n.length-s-1],o=t.length-s-1,i=t[o];(r==null||r===1&&i>1)&&e.unshift(o)}return e}function mt(n,t){const e=[],s=Math.max(n.length,t.length);for(let r=0;r<s;r++){let o=n[n.length-r-1];o==null&&(o=1);let i=t[t.length-r-1];if(i==null&&(i=1),o===1)e.unshift(i);else if(i===1)e.unshift(o);else if(o!==i){const a=`Operands could not be broadcast together with shapes ${n} and ${t}.`;throw Error(a)}else e.unshift(o)}return e}function zh(n,t){const e=n.shape.length,s=t.shape.length;if(e<1)throw new Error(`tf.gatherND() expects the input to be rank 1 or higher, but the rank was ${e}.`);if(s<1)throw new Error(`tf.gatherND() expects the indices to be rank 1 or higher, but the rank was ${s}.`);if(t.dtype!=="int32")throw new Error(`tf.gatherND() expects the indices to be int32 type, but the dtype was ${t.dtype}.`);if(t.shape[s-1]>e)throw new Error(`index innermost dimension length must be <= tensor rank; saw: ${t.shape[s-1]} vs. ${e}`);if(q(n.shape)===0)throw new Error(`Requested more than 0 entries, but input is empty. Input shape: ${n.shape}.`);const r=t.shape,o=r[r.length-1];let i=1;for(let h=0;h<r.length-1;++h)i*=r[h];const a=n.shape,c=r.slice();c.pop();let l=1;for(let h=o;h<e;++h)l*=a[h],c.push(a[h]);const u=[...ht(n.shape).map(h=>h/l),1].slice(0,o);return[c,i,l,u]}function Fg(n,t,e){const s=t.rank>1?t.shape[t.rank-1]:1,r=t.rank>1?t.rank-1:1,o=`Must have updates.shape = indices.shape[:batchDim] + shape[sliceDim:], got updates.shape: ${e.shape}, indices.shape: ${t.shape}, shape: ${n}, sliceDim: ${s}, and batchDim: ${r}.`;if(e.rank<r)throw new Error(o+` update.rank < ${r}. `);if(n.length<s+(e.rank-r))throw new Error(o+` Output shape length < ${s+(e.rank-r)}`);if(e.rank!==r+n.length-s)throw new Error(o+` update.rank != ${r+n.length-s}`);for(let i=0;i<r;++i)if(e.shape[i]!==t.shape[i])throw new Error(o+` updates.shape[${i}] (${e.shape[i]}) != indices.shape[${i}] (${t.shape[i]}).`);for(let i=0;i<e.rank-r;++i)if(e.shape[i+r]!==n[i+s])throw new Error(o+` updates.shape[${i+r}] (${e.shape[i+r]}) != shape[${i+r}] (${n[i+r]})`)}function tv(n,t,e){if(t.rank<1)throw new Error(`tf.scatterND() expects the indices to be rank 1 or higher, but the rank was ${t.rank}.`);if(n.rank<1)throw new Error(`tf.scatterND() expects the updates to be rank 1 or higher, but the rank was ${n.rank}.`);if(t.dtype!=="int32")throw new Error(`The dtype of 'indices' should be int32, but got dtype: ${t.dtype}`);if(e.length<1)throw new Error(`Output rank must be greater or equal to 1, but got shape: ${e}`);if(e.length===0){if(t.size===0)throw new Error(`Indices specified for empty output. indices shape: ${t.shape}`);if(n.size===0)throw new Error(`Updates specified for empty output. updates shape: ${n.shape}`)}Fg(e,t,n)}function Si(n,t,e){const s=t.shape.length,r=s>1?t.shape[s-1]:1,o=e.length;let i=1;for(let h=r;h<o;++h)i*=e[h];const a=r<1?1:r,c=q(t.shape)/a,l=[...ht(e.slice(0,r)),1],u=q(e);return{sliceRank:r,numUpdates:c,sliceSize:i,strides:l,outputSize:u}}const yu=-2,ev=-1;function Vh(n,t,e){const s=n.shape.length;S(s===t.length,()=>`Error in slice${s}D: Length of begin ${t} must match the rank of the array (${s}).`),S(s===e.length,()=>`Error in slice${s}D: Length of size ${e} must match the rank of the array (${s}).`);for(let r=0;r<s;++r)S(t[r]+e[r]<=n.shape[r],()=>`Error in slice${s}D: begin[${r}] + size[${r}] (${t[r]+e[r]}) would overflow input.shape[${r}] (${n.shape[r]})`)}function nv(n){const t=[];let e=0;for(;n>0;)n&1&&t.push(e),n/=2,e++;return t}function Wh(n,t,e){const s=[];for(let r=0;r<n.length;r++)s[r]=Math.ceil((t[r]-n[r])/e[r]);return s}function Og(n,t,e,s){const r=[...n];for(let o=r.length;o<s.length;o++)r.push(1);for(let o=0;o<e;o++)o===0?r[t]=1:(r.splice(t,0,1),r.pop());return r}function _g(n,t,e){return e<=n?e:e-(t-1)}function Mg(n,t){const e=[];for(let s=0;s<n;s++)e.push(t+s);return e}function sv(n,t,e,s,r,o,i,a,c){const l=n.length;let u=new Array(l),h=new Array(l),d=new Array(l);if(t.length&&e>0){const p=t[0],f=e+1;u=Lg(i,p,f,s,n),h=Pg(a,p,f,r,n),d=Og(o,p,f,n)}else for(let p=0;p<l;p++)u[p]=zg(i,s,o,n,p,c),h[p]=Vg(a,r,o,n,p,c),d[p]=Bg(o,p,c);return{begin:u,end:h,strides:d}}function Lg(n,t,e,s,r){const o=[...r],i=Mg(e,t);for(let a=0;a<o.length;a++)if(i.indexOf(a)>-1)o[a]=0;else{const c=_g(t,e,a);let l=s[c];n&1<<c&&(l=0),o[a]=l}return o}function Pg(n,t,e,s,r){const o=[...r],i=Mg(e,t);for(let a=0;a<o.length;a++)if(i.indexOf(a)>-1)o[a]=Number.MAX_SAFE_INTEGER;else{const c=_g(t,e,a);let l=s[c];n&1<<c&&(l=Number.MAX_SAFE_INTEGER),o[a]=l}for(let a=0;a<o.length;a++){const c=r[a];o[a]<0&&(o[a]+=c),o[a]=Gs(0,o[a],r[a])}return o}function Bg(n,t,e){let s=n[t];return(e&1<<t||s==null)&&(s=1),s}function zg(n,t,e,s,r,o){let i=t[r];const a=e[r]||1;(n&1<<r||o&1<<r||i==null)&&(a>0?i=Number.MIN_SAFE_INTEGER:i=Number.MAX_SAFE_INTEGER);const c=s[r];return i<0&&(i+=c),i=Gs(0,i,c-1),i}function Vg(n,t,e,s,r,o){let i=t[r];const a=e[r]||1;(n&1<<r||o&1<<r||i==null)&&(a>0?i=Number.MAX_SAFE_INTEGER:i=Number.MIN_SAFE_INTEGER);const c=s[r];return i<0&&(i+=c),a>0?i=Gs(0,i,c):i=Gs(-1,i,c-1),i}function Uh(n,t,e){let s=e.length;for(let r=0;r<e.length;r++)if(e[r]>1){s=r;break}for(let r=s+1;r<e.length;r++)if(t[r]>0||e[r]!==n[r])return!1;return!0}function Gh(n,t){let e=n.length>0?n[n.length-1]:1;for(let s=0;s<n.length-1;s++)e+=n[s]*t[s];return e}function sl(n,t,e){let s;const r=n.shape.length;typeof t=="number"?s=[t,...new Array(r-1).fill(0)]:t.length<r?s=t.concat(new Array(r-t.length).fill(0)):s=t.slice(),s.forEach(i=>{S(i!==-1,()=>"slice() does not support negative begin indexing.")});let o;return e==null?o=new Array(r).fill(-1):typeof e=="number"?o=[e,...new Array(r-1).fill(-1)]:e.length<r?o=e.concat(new Array(r-e.length).fill(-1)):o=e,o=o.map((i,a)=>i>=0?i:(S(i===-1,()=>`Negative size values should be exactly -1 but got ${i} for the slice() size at index ${a}.`),n.shape[a]-s[a])),[s,o]}function Hh(n,t,e,s,r,o,i,a,c){let l;if(s==null?(l=new Array(t.length),l.fill(1)):l=s,i!=null&&(i&i-1)!==0)throw new Error("Multiple ellipses in slice is not allowed.");let u=!1;const h={dims:l.length,numAddAxisAfterEllipsis:0,begin:t.slice(),end:e.slice(),strides:l.slice(),beginMask:r,endMask:o,ellipsisMask:i,newAxisMask:a,shrinkAxisMask:c};for(let w=0;w<h.dims;w++)u&&(1<<w&a)!==0&&h.numAddAxisAfterEllipsis++,1<<w&i&&(u=!0);u||(h.ellipsisMask|=1<<h.dims,h.dims++);const d={dims:n.length,beginMask:0,endMask:0,beginValid:!1,endValid:!1};rv(h,d);let p=!0,f=!0,m=!0;const g=[],x=[];for(let w=0;w<n.length;++w){if(d.strides[w]===0)throw Error(`strides[${w}] must be non-zero`);const y=!!(d.shrinkAxisMask&1<<w),I=n[w];if(I===-1){g.push(y?1:-1);continue}const C=[d.beginMask&1<<w,d.endMask&1<<w],N=[d.strides[w]>0?0:-1,d.strides[w]>0?I:I-1];if(y&&d.strides[w]<=0)throw Error("only stride 1 allowed on non-range indexing.");m=m&&d.strides[w]===1;const T=!!(d.beginMask&1<<w&&d.endMask&1<<w);if(d.beginValid&&d.endValid){if(y){const R=d.begin[w]<0?I+d.begin[w]:d.begin[w];if(d.begin[w]=R,d.end[w]=d.begin[w]+1,R<0||R>=I)throw Error(`slice index ${d.begin[w]} of dimension ${w} out of bounds.`)}else d.begin[w]=tf(d.begin[w],0,d.strides[w],I,C,N),d.end[w]=tf(d.end[w],1,d.strides[w],I,C,N);const v=d.strides[w]===1&&d.begin[w]===0&&d.end[w]===I;p=p&&v,f=f&&(w===0&&d.strides[w]===1||v)}else p=p&&d.strides[w]===1&&T,f=f&&(w===0&&d.strides[w]===1||T);let $,k=!1;if(d.beginValid&&d.endValid?($=d.end[w]-d.begin[w],k=!0):y?($=1,k=!0):T&&I>=0&&(d.strides[w]<0?$=-I:$=I,k=!0),k){let v;$===0||$<0!=d.strides[w]<0?v=0:v=Math.trunc($/d.strides[w])+($%d.strides[w]!==0?1:0),g.push(v)}else g.push(-1)}for(let w=0;w<d.finalShapeGatherIndices.length;++w){const y=d.finalShapeGatherIndices[w];y>=0?x.push(g[y]):y===yu&&x.push(1)}return{finalShapeSparse:x.filter((w,y)=>d.finalShapeGatherIndices[y]!==yu),finalShape:x,isIdentity:p,sliceDim0:f,isSimpleSlice:m,begin:d.begin,end:d.end,strides:d.strides}}function rv(n,t){t.beginMask=0,t.endMask=0,t.shrinkAxisMask=0;let e=0;t.beginValid=n.begin!=null,t.endValid=n.end!=null,t.begin=new Array(t.dims),t.end=new Array(t.dims),t.strides=new Array(t.dims),t.finalShapeGatherIndices=[],t.finalShapeGatherIndicesSparse=[],t.inputShapeGatherIndicesSparse=new Array(t.dims);for(let s=0;s<n.dims;s++)if(1<<s&n.ellipsisMask){const r=Math.min(t.dims-(n.dims-s)+1+n.numAddAxisAfterEllipsis,t.dims);for(;e<r;e++)t.begin[e]=0,t.end[e]=0,t.strides[e]=1,t.beginMask|=1<<e,t.endMask|=1<<e,t.finalShapeGatherIndices.push(e),t.finalShapeGatherIndicesSparse.push(-1),t.inputShapeGatherIndicesSparse[e]=s}else if(1<<s&n.newAxisMask)t.finalShapeGatherIndices.push(yu),t.finalShapeGatherIndicesSparse.push(-1);else{if(e===t.begin.length)throw Error(`Index out of range using input dim ${e}; input has only ${t.dims} dims, ${t.begin.length}.`);n.begin!=null&&(t.begin[e]=n.begin[s]),n.end!=null&&(t.end[e]=n.end[s]),t.strides[e]=n.strides[s],n.beginMask&1<<s&&(t.beginMask|=1<<e),n.endMask&1<<s&&(t.endMask|=1<<e),n.shrinkAxisMask&1<<s?(t.finalShapeGatherIndices.push(ev),t.finalShapeGatherIndicesSparse.push(-1),t.shrinkAxisMask|=1<<e):(t.finalShapeGatherIndices.push(e),t.finalShapeGatherIndicesSparse.push(s)),t.inputShapeGatherIndicesSparse[e]=s,e++}}function tf(n,t,e,s,r,o){if(r[t])return e>0?o[t]:o[t+1&1];{const i=n<0?s+n:n;return i<o[0]?o[0]:i>o[1]?o[1]:i}}const ov=Object.freeze(Object.defineProperty({__proto__:null,assertParamsValid:Vh,computeFlatOffset:Gh,computeOutShape:Wh,getNormalizedAxes:sv,isSliceContinous:Uh,maskToAxes:nv,parseSliceParams:sl,sliceInfo:Hh,startForAxis:zg,startIndicesWithElidedDims:Lg,stopForAxis:Vg,stopIndicesWithElidedDims:Pg,stridesForAxis:Bg,stridesWithElidedDims:Og},Symbol.toStringTag,{value:"Module"}));class Br{getClassName(){return this.constructor.className}static fromConfig(t,e){return new t(e)}}class sn{constructor(){this.classNameMap={}}static getMap(){return sn.instance==null&&(sn.instance=new sn),sn.instance}static register(t){sn.getMap().classNameMap[t.className]=[t,t.fromConfig]}}function X(n){S(n.className!=null,()=>"Class being registered does not have the static className property defined."),S(typeof n.className=="string",()=>"className is required to be a string, but got type "+typeof n.className),S(n.className.length>0,()=>"Class being registered has an empty-string as its className, which is disallowed."),sn.register(n)}function iv(n,t){let e=E(n,"a","add"),s=E(t,"b","add");[e,s]=Zt(e,s);const r={a:e,b:s};return A.runKernel(Pr,r)}const J=F({add_:iv});function av(n,t){let e=E(n,"a","floorDiv"),s=E(t,"b","floorDiv");[e,s]=Zt(e,s);const r={a:e,b:s};return A.runKernel(Xo,r)}const Wg=F({floorDiv_:av});function cv(n,t){let e=E(n,"a","div"),s=E(t,"b","div");if([e,s]=Zt(e,s),e.dtype==="int32"&&s.dtype==="int32")return Wg(e,s);const r={a:e,b:s},o={};return A.runKernel(Uo,r,o)}const ut=F({div_:cv});function lv(n,t){let e=E(n,"a","mul"),s=E(t,"b","mul");[e,s]=Zt(e,s);const r={a:e,b:s};return A.runKernel(ii,r)}const D=F({mul_:lv});function uv(n){const t=E(n,"x","abs");if(t.dtype==="complex64"){const e={x:t};return A.runKernel(ac,e)}else{const e={x:t};return A.runKernel(tc,e)}}const le=F({abs_:uv});function hv(n){const e={x:E(n,"x","acos")};return A.runKernel(Do,e)}const dv=F({acos_:hv});function pv(n){const e={x:E(n,"x","acosh")};return A.runKernel(Ao,e)}const fv=F({acosh_:pv});function mv(n,t=null,e=!1){const r={x:E(n,"x","all","bool")},o={axis:t,keepDims:e};return A.runKernel(ju,r,o)}const Ug=F({all_:mv});function gv(n,t=null,e=!1){const r={x:E(n,"x","any","bool")},o={axis:t,keepDims:e};return A.runKernel(Xu,r,o)}const wu=F({any_:gv});function xv(n,t=0){const s={x:E(n,"x","argMax")},r={axis:t};return A.runKernel(ec,s,r)}const yo=F({argMax_:xv});function bv(n,t=0){const s={x:E(n,"x","argMin")},r={axis:t};return A.runKernel(nc,s,r)}const yv=F({argMin_:bv});function wv(n){const e={x:E(n,"x","asin")};return A.runKernel(Fo,e)}const Iv=F({asin_:wv});function vv(n){const e={x:E(n,"x","asinh")};return A.runKernel(Oo,e)}const Cv=F({asinh_:vv});function kv(n){const e={x:E(n,"x","atan")};return A.runKernel(_o,e)}const $v=F({atan_:kv});function Sv(n,t){let e=E(n,"a","atan2"),s=E(t,"b","atan2");[e,s]=Zt(e,s);const r={a:e,b:s};return A.runKernel(Lo,r)}const Nv=F({atan2_:Sv});function Tv(n){const e={x:E(n,"x","atanh")};return A.runKernel(Mo,e)}const Ev=F({atanh_:Tv});function Ni(n,t,e,s,r="NHWC",o){const i=n[3],a=[...t,i],c=Xn(r);return ye(n,a,e,o,s,null,null,c)}function hn(n,t,e,s,r,o,i="channelsLast"){const[a,c]=Aa(t);let l;if(i==="channelsLast")l=[a,c,n[3],n[3]];else if(i==="channelsFirst")l=[a,c,n[1],n[1]];else throw new Error(`Unknown dataFormat ${i}`);return ye(n,l,e,s,r,o,!1,i)}function jn(n,t,e,s,r,o,i="NDHWC"){const[a,c,l]=Iu(t);let u,h;if(i==="NDHWC")h="channelsLast",u=[a,c,l,n[4],n[4]];else if(i==="NCDHW")h="channelsFirst",u=[a,c,l,n[1],n[1]];else throw new Error(`Unknown dataFormat ${i}`);return bs(n,u,e,s,r,!1,h,o)}function ye(n,t,e,s,r,o,i=!1,a="channelsLast"){let[c,l,u,h]=[-1,-1,-1,-1];if(a==="channelsLast")[c,l,u,h]=n;else if(a==="channelsFirst")[c,h,l,u]=n;else throw new Error(`Unknown dataFormat ${a}`);const[d,p,,f]=t,[m,g]=Aa(e),[x,b]=Aa(s),w=Ir(d,x),y=Ir(p,b),{padInfo:I,outHeight:C,outWidth:N}=Av(r,l,u,m,g,w,y,o,a),T=i?f*h:f;let $;return a==="channelsFirst"?$=[c,T,C,N]:a==="channelsLast"&&($=[c,C,N,T]),{batchSize:c,dataFormat:a,inHeight:l,inWidth:u,inChannels:h,outHeight:C,outWidth:N,outChannels:T,padInfo:I,strideHeight:m,strideWidth:g,filterHeight:d,filterWidth:p,effectiveFilterHeight:w,effectiveFilterWidth:y,dilationHeight:x,dilationWidth:b,inShape:n,outShape:$,filterShape:t}}function bs(n,t,e,s,r,o=!1,i="channelsLast",a){let[c,l,u,h,d]=[-1,-1,-1,-1,-1];if(i==="channelsLast")[c,l,u,h,d]=n;else if(i==="channelsFirst")[c,d,l,u,h]=n;else throw new Error(`Unknown dataFormat ${i}`);const[p,f,m,,g]=t,[x,b,w]=Iu(e),[y,I,C]=Iu(s),N=Ir(p,y),T=Ir(f,I),$=Ir(m,C),{padInfo:k,outDepth:v,outHeight:R,outWidth:_}=Fv(r,l,u,h,x,b,w,N,T,$,a),P=o?g*d:g;let L;return i==="channelsFirst"?L=[c,P,v,R,_]:i==="channelsLast"&&(L=[c,v,R,_,P]),{batchSize:c,dataFormat:i,inDepth:l,inHeight:u,inWidth:h,inChannels:d,outDepth:v,outHeight:R,outWidth:_,outChannels:P,padInfo:k,strideDepth:x,strideHeight:b,strideWidth:w,filterDepth:p,filterHeight:f,filterWidth:m,effectiveFilterDepth:N,effectiveFilterHeight:T,effectiveFilterWidth:$,dilationDepth:y,dilationHeight:I,dilationWidth:C,inShape:n,outShape:L,filterShape:t}}function Rv(n,t,e,s,r){s==null&&(s=qh(n,t,e));const o=n[0],i=n[1],a=Vs((o-t+2*s)/e+1,r),c=Vs((i-t+2*s)/e+1,r);return[a,c]}function Dv(n,t,e,s,r,o){r==null&&(r=qh(n,t,s));const i=n[0],a=n[1],c=n[2],l=Vs((i-t+2*r)/s+1,o),u=Vs((a-t+2*r)/s+1,o),h=Vs((c-t+2*r)/s+1,o);return[l,u,h,e]}function qh(n,t,e,s=1){const r=Ir(t,s);return Math.floor((n[0]*(e-1)-e+r)/2)}function Aa(n){return typeof n=="number"?[n,n,n]:n.length===2?[n[0],n[1],1]:n}function Iu(n){return typeof n=="number"?[n,n,n]:n}function Ir(n,t){return t<=1?n:n+(n-1)*(t-1)}function Av(n,t,e,s,r,o,i,a,c){let l,u,h;if(typeof n=="number"){l={top:n,bottom:n,left:n,right:n,type:n===0?"VALID":"NUMBER"};const p=Rv([t,e],o,s,n,a);u=p[0],h=p[1]}else if(n==="same"){u=Math.ceil(t/s),h=Math.ceil(e/r);const d=Math.max(0,(u-1)*s+o-t),p=Math.max(0,(h-1)*r+i-e),f=Math.floor(d/2),m=d-f,g=Math.floor(p/2),x=p-g;l={top:f,bottom:m,left:g,right:x,type:"SAME"}}else if(n==="valid")l={top:0,bottom:0,left:0,right:0,type:"VALID"},u=Math.ceil((t-o+1)/s),h=Math.ceil((e-i+1)/r);else if(typeof n=="object"){const d=c==="channelsLast"?n[1][0]:n[2][0],p=c==="channelsLast"?n[1][1]:n[2][1],f=c==="channelsLast"?n[2][0]:n[3][0],m=c==="channelsLast"?n[2][1]:n[3][1];l={top:d,bottom:p,left:f,right:m,type:d===0&&p===0&&f===0&&m===0?"VALID":"EXPLICIT"},u=Vs((t-o+d+p)/s+1,a),h=Vs((e-i+f+m)/r+1,a)}else throw Error(`Unknown padding parameter: ${n}`);return{padInfo:l,outHeight:u,outWidth:h}}function Fv(n,t,e,s,r,o,i,a,c,l,u){let h,d,p,f;if(typeof n=="number"){h={top:n,bottom:n,left:n,right:n,front:n,back:n,type:n===0?"VALID":"NUMBER"};const g=Dv([t,e,s,1],a,1,r,n,u);d=g[0],p=g[1],f=g[2]}else if(n==="same"){d=Math.ceil(t/r),p=Math.ceil(e/o),f=Math.ceil(s/i);const m=(d-1)*r+a-t,g=(p-1)*o+c-e,x=(f-1)*i+l-s,b=Math.floor(m/2),w=m-b,y=Math.floor(g/2),I=g-y,C=Math.floor(x/2),N=x-C;h={top:y,bottom:I,left:C,right:N,front:b,back:w,type:"SAME"}}else if(n==="valid")h={top:0,bottom:0,left:0,right:0,front:0,back:0,type:"VALID"},d=Math.ceil((t-a+1)/r),p=Math.ceil((e-c+1)/o),f=Math.ceil((s-l+1)/i);else throw Error(`Unknown padding parameter: ${n}`);return{padInfo:h,outDepth:d,outHeight:p,outWidth:f}}function Vs(n,t){if(!t)return Math.trunc(n);switch(t){case"round":return Math.round(n);case"ceil":return Math.ceil(n);case"floor":return Math.floor(n);default:throw new Error(`Unknown roundingMode ${t}`)}}function js(n){const[t,e,s]=Aa(n);return t===1&&e===1&&s===1}function $e(n,t){return js(n)||js(t)}function Xn(n){if(n==="NHWC")return"channelsLast";if(n==="NCHW")return"channelsFirst";throw new Error(`Unknown dataFormat ${n}`)}function Le(n,t,e){if(e!=null){if(typeof t=="string")throw Error(`Error in ${n}: pad must be an integer when using dimRoundingMode ${e} but got pad ${t}.`);if(typeof t=="number")S($r(t),()=>`Error in ${n}: pad must be an integer when using dimRoundingMode ${e} but got pad ${t}.`);else if(typeof t=="object")t.forEach(s=>{s.forEach(r=>{S($r(r),()=>`Error in ${n}: pad must be an integer when using dimRoundingMode ${e} but got pad ${r}.`)})});else throw Error(`Error in ${n}: Unknown padding parameter: ${t}`)}}function Ov(n,t){const s={x:E(n,"x","reshape","string_or_numeric")},r={shape:t};return A.runKernel(Vc,s,r)}const M=F({reshape_:Ov});function _v(n,t,e,s,r){const o=E(n,"x","avgPool","float32"),i=1;S($e(e,i),()=>`Error in avgPool: Either strides or dilations must be 1. Got strides ${e} and dilations '${i}'`);let a=o,c=!1;o.rank===3&&(c=!0,a=M(o,[1,o.shape[0],o.shape[1],o.shape[2]])),S(a.rank===4,()=>`Error in avgPool: x must be rank 4 but got rank ${a.rank}.`),Le("avgPool",s,r);const l={x:a},u={filterSize:t,strides:e,pad:s,dimRoundingMode:r};let h=A.runKernel(sc,l,u);return h=nt(h,o.dtype),c?M(h,[h.shape[1],h.shape[2],h.shape[3]]):h}const Kh=F({avgPool_:_v});function Mv(n,t,e,s,r,o="NDHWC"){const i=E(n,"x","avgPool3d","float32");let a=i,c=!1;i.rank===4&&(c=!0,a=M(i,[1,i.shape[0],i.shape[1],i.shape[2],i.shape[3]])),S(a.rank===5,()=>`Error in avgPool3d: x must be rank 5 but got rank ${a.rank}.`),S(o==="NDHWC",()=>`Error in avgPool3d: Only NDHWC is currently supported, but got dataFormat of ${o}`),Le("avgPool3d",s,r);const l={x:a},u={filterSize:t,strides:e,pad:s,dimRoundingMode:r,dataFormat:o};let h=A.runKernel(rc,l,u);return h=nt(h,a.dtype),c?M(h,[h.shape[1],h.shape[2],h.shape[3],h.shape[4]]):h}const Lv=F({avgPool3d_:Mv});function Pv(n,t=0){S(n.length>=1,()=>"Pass at least one tensor to concat");const e=vg(n,"tensors","concat","string_or_numeric");if(e[0].dtype==="complex64"&&e.forEach(o=>{if(o.dtype!=="complex64")throw new Error(`Cannot concatenate complex64 tensors with a tensor
          with dtype ${o.dtype}. `)}),e.length===1)return zs(e[0]);const s=e,r={axis:t};return A.runKernel(cc,s,r)}const Ce=F({concat_:Pv});function Bv(n){const e={x:E(n,"x","sigmoid","float32")};return A.runKernel(xi,e)}const zr=F({sigmoid_:Bv});function zv(n,t,e){const s=E(n,"x","slice","string_or_numeric");if(s.rank===0)throw new Error("Slicing scalar is not possible");const r={x:s},o={begin:t,size:e};return A.runKernel(qc,r,o)}const Ft=F({slice_:zv});function Vv(n){const e={x:E(n,"x","tanh","float32")};return A.runKernel(Ci,e)}const jh=F({tanh_:Vv});function Wv(n,t,e){const s=E(n,"x","batchToSpaceND"),r=t.reduce((a,c)=>a*c);S(s.rank>=1+t.length,()=>`input rank is ${s.rank} but should be > than blockShape.length ${t.length}`),S(e.length===t.length,()=>`crops.length is ${e.length} but should be equal to blockShape.length  ${t.length}`),S(s.shape[0]%r===0,()=>`input tensor batch is ${s.shape[0]} but is not divisible by the product of the elements of blockShape ${t.join(" * ")} === ${r}`);const o={x:s},i={blockShape:t,crops:e};return A.runKernel(ic,o,i)}const Xh=F({batchToSpaceND_:Wv});function Uv(n){let t;return n.rank===0||n.rank===1?t=M(n,[1,1,1,n.size]):n.rank===2?t=M(n,[1,1,n.shape[0],n.shape[1]]):n.rank===3?t=M(n,[1,n.shape[0],n.shape[1],n.shape[2]]):t=n,t}function Gv(n,t,e,s,r,o){o==null&&(o=.001);const i=E(n,"x","batchNorm"),a=E(t,"mean","batchNorm"),c=E(e,"variance","batchNorm");let l;r!=null&&(l=E(r,"scale","batchNorm"));let u;s!=null&&(u=E(s,"offset","batchNorm")),S(a.rank===c.rank,()=>"Batch normalization gradient requires mean and variance to have equal ranks."),S(u==null||a.rank===u.rank,()=>"Batch normalization gradient requires mean and offset to have equal ranks."),S(l==null||a.rank===l.rank,()=>"Batch normalization gradient requires mean and scale to have equal ranks.");const d={x:Uv(i),scale:l,offset:u,mean:a,variance:c},p={varianceEpsilon:o},f=A.runKernel(xc,d,p);return M(f,i.shape)}const rl=F({batchNorm_:Gv});function Hv(n,t,e,s,r,o){const i=E(n,"x","batchNorm"),a=E(t,"mean","batchNorm"),c=E(e,"variance","batchNorm");let l;r!=null&&(l=E(r,"scale","batchNorm"));let u;return s!=null&&(u=E(s,"offset","batchNorm")),S(i.rank===2,()=>`Error in batchNorm2D: x must be rank 2 but got rank ${i.rank}.`),S(a.rank===2||a.rank===1,()=>`Error in batchNorm2D: mean must be rank 2 or rank 1 but got rank ${a.rank}.`),S(c.rank===2||c.rank===1,()=>`Error in batchNorm2D: variance must be rank 2 or rank 1 but got rank ${c.rank}.`),l!=null&&S(l.rank===2||l.rank===1,()=>`Error in batchNorm2D: scale must be rank 2 or rank 1 but got rank ${l.rank}.`),u!=null&&S(u.rank===2||u.rank===1,()=>`Error in batchNorm2D: offset must be rank 2 or rank 1 but got rank ${u.rank}.`),rl(i,a,c,u,l,o)}const qv=F({batchNorm2d_:Hv});function Kv(n,t,e,s,r,o){const i=E(n,"x","batchNorm"),a=E(t,"mean","batchNorm"),c=E(e,"variance","batchNorm");let l;r!=null&&(l=E(r,"scale","batchNorm"));let u;return s!=null&&(u=E(s,"offset","batchNorm")),S(i.rank===3,()=>`Error in batchNorm3D: x must be rank 3 but got rank ${i.rank}.`),S(a.rank===3||a.rank===1,()=>`Error in batchNorm3D: mean must be rank 3 or rank 1 but got rank ${a.rank}.`),S(c.rank===3||c.rank===1,()=>`Error in batchNorm3D: variance must be rank 3 or rank 1 but got rank ${c.rank}.`),l!=null&&S(l.rank===3||l.rank===1,()=>`Error in batchNorm3D: scale must be rank 3 or rank 1 but got rank ${l.rank}.`),u!=null&&S(u.rank===3||u.rank===1,()=>`Error in batchNorm3D: offset must be rank 3 or rank 1 but got rank ${u.rank}.`),rl(i,a,c,u,l,o)}const jv=F({batchNorm3d_:Kv});function Xv(n,t,e,s,r,o){const i=E(n,"x","batchNorm"),a=E(t,"mean","batchNorm"),c=E(e,"variance","batchNorm");let l;r!=null&&(l=E(r,"scale","batchNorm"));let u;return s!=null&&(u=E(s,"offset","batchNorm")),S(i.rank===4,()=>`Error in batchNorm4D: x must be rank 4 but got rank ${i.rank}.`),S(a.rank===4||a.rank===1,()=>`Error in batchNorm4D: mean must be rank 4 or rank 1 but got rank ${a.rank}.`),S(c.rank===4||c.rank===1,()=>`Error in batchNorm4D: variance must be rank 4 or rank 1 but got rank ${c.rank}.`),l!=null&&S(l.rank===4||l.rank===1,()=>`Error in batchNorm4D: scale must be rank 4 or rank 1 but got rank ${l.rank}.`),u!=null&&S(u.rank===4||u.rank===1,()=>`Error in batchNorm4D: offset must be rank 4 or rank 1 but got rank ${u.rank}.`),rl(i,a,c,u,l,o)}const Yv=F({batchNorm4d_:Xv});function Zv(n,t,e){const s=E(n,"x","bincount"),r=E(t,"weights","bincount");S(s.dtype==="int32",()=>`Error in bincount: input dtype must be int32, but got ${s.dtype}`),S(e>=0,()=>`size must be non-negative, but got ${e}.`),S(r.size===s.size||r.size===0,()=>`Error in bincount: weights must have the same size as input or0-length, but got input shape: ${s.shape}, weights shape: ${r.shape}.`);const o={x:s,weights:r},i={size:e};return A.runKernel(Ju,o,i)}const Jv=F({bincount_:Zv});function Qv(n,t){let e=E(n,"broadcastTo","x");const s=e.shape;if(t.some(l=>!(l>0)||l%1!==0))throw new Error(`broadcastTo(): Invalid broadcast shape [${t}].`);if(t.length<e.rank)throw new Error(`broadcastTo(): shape.length=${t.length} < input.rank=${e.rank}.`);if(t.length>e.rank){const l=e.shape.slice();for(;l.length<t.length;)l.unshift(1);e=M(e,l)}const r=e.shape,o=Array.from(t);for(let l=t.length-1;l>=0;l--)if(r[l]===t[l])o[l]=1;else if(e.shape[l]!==1)throw new Error(`broadcastTo(): [${s}] cannot be broadcast to [${t}].`);if(o.map((l,u)=>l>1?u:-1).filter(l=>l>=0).length===0)return zs(e);const a={x:e},c={reps:o};return A.runKernel(ki,a,c)}const xo=F({broadcastTo_:Qv});function tC(n){const e={x:E(n,"x","ceil","float32")};return A.runKernel(Bo,e)}const eC=F({ceil_:tC});function Ti(n,t,e){const s={shape:n,value:t,dtype:e};return A.runKernel(uh,{},s)}function nC(n,t,e){const s=E(n,"x","clipByValue");if(S(t<=e,()=>`Error in clip: min (${t}) must be less than or equal to max (${e}).`),t===e)return Ti(s.shape,t,s.dtype);const r={x:s},o={clipValueMin:t,clipValueMax:e};return A.runKernel(zo,r,o)}const Ze=F({clipByValue_:nC});function sC(n){return Ce(n,0)}const rC=F({concat1d_:sC});function oC(n,t){return Ce(n,t)}const iC=F({concat2d_:oC});function aC(n,t){return Ce(n,t)}const cC=F({concat3d_:aC});function lC(n,t){return Ce(n,t)}const uC=F({concat4d_:lC});function hC(n,t,e,s,r="NHWC",o=[1,1],i){const a=E(n,"x","conv2d","float32"),c=E(t,"filter","conv2d","float32");let l=a,u=!1;a.rank===3&&(u=!0,l=M(a,[1,a.shape[0],a.shape[1],a.shape[2]])),S(l.rank===4,()=>`Error in conv2d: input must be rank 4, but got rank ${l.rank}.`),S(c.rank===4,()=>`Error in conv2d: filter must be rank 4, but got rank ${c.rank}.`),Le("conv2d",s,i);const h=r==="NHWC"?l.shape[3]:l.shape[1];S(h===c.shape[2],()=>`Error in conv2d: depth of input (${h}) must match input depth for filter ${c.shape[2]}.`),S($e(e,o),()=>`Error in conv2D: Either strides or dilations must be 1. Got strides ${e} and dilations '${o}'`);const d={x:l,filter:c},p={strides:e,pad:s,dataFormat:r,dilations:o,dimRoundingMode:i},f=A.runKernel(lc,d,p);return u?M(f,[f.shape[1],f.shape[2],f.shape[3]]):f}const Xs=F({conv2d_:hC});function dC(n,t,e,s,r="NWC",o=1,i){const a=E(n,"x","conv1d"),c=E(t,"filter","conv1d");let l=a,u=!1;a.rank===2&&(u=!0,l=M(a,[1,a.shape[0],a.shape[1]])),S(l.rank===3,()=>`Error in conv1d: input must be rank 3, but got rank ${l.rank}.`),S(c.rank===3,()=>`Error in conv1d: filter must be rank 3, but got rank ${c.rank}.`),Le("conv1d",s,i),S(l.shape[2]===c.shape[1],()=>`Error in conv1d: depth of input (${l.shape[2]}) must match input depth for filter ${c.shape[1]}.`),S($e(e,o),()=>`Error in conv1D: Either stride or dilation must be 1. Got stride ${e} and dilation '${o}'`),S(r==="NWC",()=>`Error in conv1d: got dataFormat of ${r} but only NWC is currently supported.`);const h=M(c,[1,c.shape[0],c.shape[1],c.shape[2]]),d=M(l,[l.shape[0],1,l.shape[1],l.shape[2]]),g=Xs(d,h,[1,e],s,"NHWC",[1,o],i);return u?M(g,[g.shape[2],g.shape[3]]):M(g,[g.shape[0],g.shape[2],g.shape[3]])}const Gg=F({conv1d_:dC});function pC(n,t,e,s,r,o="NHWC",i){S(n.length===t.rank,()=>`Length of inShape (${n.length}) and rank of dy (${t.rank}) must match`);let a=n,c=t,l=!1;t.rank===3&&(l=!0,c=M(t,[1,t.shape[0],t.shape[1],t.shape[2]]),a=[1,n[0],n[1],n[2]]),S(a.length===4,()=>`Error in conv2dDerInput: inShape must be length 4, but got length ${a.length}.`),S(c.rank===4,()=>`Error in conv2dDerInput: dy must be rank 4, but got rank ${c.rank}`),S(e.rank===4,()=>`Error in conv2dDerInput: filter must be rank 4, but got rank ${e.rank}`);const u=o==="NHWC"?a[3]:a[1],h=o==="NHWC"?c.shape[3]:c.shape[1];S(u===e.shape[2],()=>`Error in conv2dDerInput: depth of input (${u}) must match input depth for filter ${e.shape[2]}.`),S(h===e.shape[3],()=>`Error in conv2dDerInput: depth of output (${h}) must match output depth for filter ${e.shape[3]}.`),Le("conv2dDerInput",r,i);const d={dy:c,filter:e},p={strides:s,pad:r,dataFormat:o,dimRoundingMode:i,inputShape:a},f=A.runKernel(uc,d,p);return l?M(f,[f.shape[1],f.shape[2],f.shape[3]]):f}const Yh=F({conv2DBackpropInput_:pC});function fC(n,t,e,s,r,o){const i=E(n,"x","conv2dTranspose"),a=E(t,"filter","conv2dTranspose");return Yh(e,i,a,s,r,"NHWC",o)}const Hg=F({conv2dTranspose_:fC});function mC(n,t,e,s,r="NDHWC",o=[1,1,1]){const i=E(n,"x","conv3d"),a=E(t,"filter","conv3d");let c=i,l=!1;i.rank===4&&(l=!0,c=M(i,[1,i.shape[0],i.shape[1],i.shape[2],i.shape[3]])),S(c.rank===5,()=>`Error in conv3d: input must be rank 5, but got rank ${c.rank}.`),S(a.rank===5,()=>`Error in conv3d: filter must be rank 5, but got rank ${a.rank}.`),S(c.shape[4]===a.shape[3],()=>`Error in conv3d: depth of input (${c.shape[4]}) must match input depth for filter ${a.shape[3]}.`),S($e(e,o),()=>`Error in conv3D: Either strides or dilations must be 1. Got strides ${e} and dilations '${o}'`),S(r==="NDHWC",()=>`Error in conv3d: got dataFormat of ${r} but only NDHWC is currently supported.`);const u={x:c,filter:a},h={strides:e,pad:s,dataFormat:r,dilations:o},d=A.runKernel(hc,u,h);return l?M(d,[d.shape[1],d.shape[2],d.shape[3],d.shape[4]]):d}const gC=F({conv3d_:mC});function xC(n,t,e,s,r){S(n.length===t.rank,()=>`Length of inShape (${n.length}) and rank of dy (${t.rank}) must match`);let o=n,i=t,a=!1;t.rank===4&&(a=!0,i=M(t,[1,t.shape[0],t.shape[1],t.shape[2],t.shape[3]]),o=[1,n[0],n[1],n[2],n[3]]);const c=o[4],l=i.shape[4];S(o.length===5,()=>`Error in conv3dDerInput: inShape must be length 5, but got length ${o.length}.`),S(i.rank===5,()=>`Error in conv3dDerInput: dy must be rank 5, but got rank ${i.rank}`),S(e.rank===5,()=>`Error in conv3dDerInput: filter must be rank 5, but got rank ${e.rank}`),S(c===e.shape[3],()=>`Error in conv3dDerInput: depth of input (${c}) must match input depth for filter ${e.shape[3]}.`),S(l===e.shape[4],()=>`Error in conv3dDerInput: depth of output (${l}) must match output depth for filter ${e.shape[4]}.`);const u={dy:i,filter:e},h={pad:r,strides:s,inputShape:o},d=A.runKernel(nh,u,h);return a?M(d,[d.shape[1],d.shape[2],d.shape[3],d.shape[4]]):d}const qg=F({conv3DBackpropInput_:xC});function bC(n,t,e,s,r){const o=E(n,"x","conv3dTranspose"),i=E(t,"filter","conv3dTranspose");return qg(e,o,i,s,r)}const yC=F({conv3dTranspose_:bC});function wC(n){const e={x:E(n,"x","cos","float32")};return A.runKernel(Vo,e)}const Zh=F({cos_:wC});function IC(n){const e={x:E(n,"x","cosh","float32")};return A.runKernel(Wo,e)}const Kg=F({cosh_:IC});function vC(n,t=0,e=!1,s=!1){const o={x:E(n,"x","cumprod")},i={axis:t,exclusive:e,reverse:s};return A.runKernel(sh,o,i)}const vu=F({cumprod_:vC});function CC(n,t=0,e=!1,s=!1){const o={x:E(n,"x","cumsum")},i={axis:t,exclusive:e,reverse:s};return A.runKernel(dc,o,i)}const jg=F({cumsum_:CC});function kC(n,t,e="NHWC"){const s=E(n,"x","depthToSpace","float32"),r=e==="NHWC"?s.shape[1]:s.shape[2],o=e==="NHWC"?s.shape[2]:s.shape[3],i=e==="NHWC"?s.shape[3]:s.shape[1];S(t>1,()=>`blockSize should be > 1 for depthToSpace, but was: ${t}`),S(r*t>=0,()=>`Negative dimension size caused by overflow when multiplying
    ${r} and ${t}  for depthToSpace with input shape
    ${s.shape}`),S(o*t>=0,()=>`Negative dimension size caused by overflow when multiplying
    ${o} and ${t} for depthToSpace with input shape
        ${s.shape}`),S(i%(t*t)===0,()=>`Dimension size must be evenly divisible by ${t*t} but is ${i} for depthToSpace with input shape ${s.shape}`);const a={x:s},c={blockSize:t,dataFormat:e};return A.runKernel(oh,a,c)}const $C=F({depthToSpace_:kC});function SC(n,t,e,s,r="NHWC",o=[1,1],i){const a=E(n,"x","depthwiseConv2d","float32"),c=E(t,"filter","depthwiseConv2d","float32");let l=a,u=!1;a.rank===3&&(u=!0,l=M(a,[1,a.shape[0],a.shape[1],a.shape[2]])),S(l.rank===4,()=>`Error in depthwiseConv2d: input must be rank 4, but got rank ${l.rank}.`),S(c.rank===4,()=>`Error in depthwiseConv2d: filter must be rank 4, but got rank ${c.rank}.`);const h=r==="NHWC"?l.shape[3]:l.shape[1];S(h===c.shape[2],()=>`Error in depthwiseConv2d: number of input channels (${h}) must match the inChannels dimension in filter ${c.shape[2]}.`),Le("depthwiseConv2d",s,i);const d={x:l,filter:c},p={strides:e,pad:s,dataFormat:r,dilations:o,dimRoundingMode:i},f=A.runKernel(pc,d,p);return u?M(f,[f.shape[1],f.shape[2],f.shape[3]]):f}const Jh=F({depthwiseConv2d_:SC});function NC(n,t,e,s,r=[1,1],o="NHWC"){const i=E(n,"x","dilation2d"),a=E(t,"filter","dilation2d");S(i.rank===3||i.rank===4,()=>`Error in dilation2d: input must be rank 3 or 4, but got rank ${i.rank}.`),S(a.rank===3,()=>`Error in dilation2d: filter must be rank 3, but got rank ${a.rank}.`),S(o==="NHWC",()=>`Error in dilation2d: Only NHWC is currently supported, but got dataFormat of ${o}`);let c=i,l=!1;i.rank===3&&(c=M(i,[1,i.shape[0],i.shape[1],i.shape[2]]),l=!0);const u={x:c,filter:a},h={strides:e,pad:s,dilations:r},d=A.runKernel(fc,u,h);return l?M(d,[d.shape[1],d.shape[2],d.shape[3]]):d}const TC=F({dilation2d_:NC});function EC(n,t){let e=E(n,"a","equal","string_or_numeric"),s=E(t,"b","equal","string_or_numeric");[e,s]=Zt(e,s),mt(e.shape,s.shape);const r={a:e,b:s};return A.runKernel(mc,r)}const Ln=F({equal_:EC});function RC(n,t,e){const s=E(t,"a","where"),r=E(e,"b","where"),o=E(n,"condition","where","bool"),i=mt(mt(o.shape,s.shape),r.shape),a=xo(o,i),c=xo(s,i),l=xo(r,i),u={condition:a,t:c,e:l};return A.runKernel(Hc,u)}const Ue=F({where_:RC});function DC(n){const e={x:E(n,"x","zerosLike")};return A.runKernel(Qc,e)}const $t=F({zerosLike_:DC});function AC(n,t){let e=E(n,"a","div"),s=E(t,"b","div");[e,s]=Zt(e,s);const r=ut(e,s),o=$t(r),i=Ln(s,o);return Ue(i,o,r)}const FC=F({divNoNan_:AC});function OC(n,t){const e=E(n,"t1","dot"),s=E(t,"t2","dot");S((e.rank===1||e.rank===2)&&(s.rank===1||s.rank===2),()=>`Error in dot: inputs must all be rank 1 or 2, but got ranks ${e.rank} and ${s.rank}.`);const r=e.rank===1?e.size:e.shape[1],o=s.rank===1?s.size:s.shape[0];if(S(r===o,()=>`Error in dot: inner dimensions of inputs must match, but got ${r} and ${o}.`),e.rank===1&&s.rank===1){const i=M(e,[1,-1]),a=M(s,[-1,1]),c=Nt(i,a);return M(c,[])}else if(e.rank===1&&s.rank===2){const i=M(e,[1,-1]),a=M(s,[s.shape[0],s.shape[1]]),c=Nt(i,a);return M(c,[c.size])}else if(e.rank===2&&s.rank===1){const i=M(s,[-1,1]),a=Nt(e,i);return M(a,[a.size])}else{const i=M(s,[s.shape[0],s.shape[1]]);return Nt(e,i)}}const _C=F({dot_:OC});function MC(n){const e={x:E(n,"x","elu","float32")};return A.runKernel(Go,e)}const ol=F({elu_:MC});function LC(n){let t=E(n,"x","erf");S(t.dtype==="int32"||t.dtype==="float32",()=>"Input dtype must be `int32` or `float32`."),t.dtype==="int32"&&(t=nt(t,"float32"));const e={x:t};return A.runKernel(Ho,e)}const PC=F({erf_:LC});function Qh(n,t){for(let e=0;e<n.length;++e)if(n[n.length-e-1]!==t-1-e)return!1;return!0}function Xg(n,t,e){const s=n.length+t.length,r=[];let o=0,i=0;for(let a=0;a<s;a++)e.indexOf(a)===-1?r.push(n[o++]):r.push(t[i++]);return r}function fe(n,t){const e=[],s=n.length;for(let o=0;o<s;o++)t.indexOf(o)===-1&&e.push(n[o]);const r=t.map(o=>n[o]);return[e,r]}function Jt(n,t){const e=t.map(s=>1);return Xg(n,e,t)}function we(n,t,e){S(Qh(t,e),()=>`${n} supports only inner-most axes for now. Got axes ${t} and rank-${e} input.`)}function Kt(n,t){if(Qh(n,t))return null;const e=[];for(let s=0;s<t;++s)n.indexOf(s)===-1&&e.push(s);return n.forEach(s=>e.push(s)),e}function ys(n){return n.map((t,e)=>[e,t]).sort((t,e)=>t[1]-e[1]).map(t=>t[0])}function Qt(n,t){const e=[];for(let s=t-n;s<t;++s)e.push(s);return e}function BC(n,t=null,e=!1){const r={x:E(n,"x","max")},o={reductionIndices:t,keepDims:e};return A.runKernel(Nc,r,o)}const An=F({max_:BC});function zC(n,t=null,e=!1){const r={x:E(n,"x","min")},o={axis:t,keepDims:e};return A.runKernel(Dc,r,o)}const Cu=F({min_:zC});function VC(n,t){let e=E(n,"base","pow"),s=E(t,"exp","pow");[e,s]=Zt(e,s);const r={a:e,b:s};return A.runKernel(ai,r)}const Tr=F({pow_:VC});function ft(n,t){if((_n(n)&&t!=="string"||Array.isArray(n))&&t!=="complex64")throw new Error("Error creating a new Scalar: value must be a primitive (number|boolean|string)");if(t==="string"&&_n(n)&&!(n instanceof Uint8Array))throw new Error("When making a scalar from encoded string, the value must be `Uint8Array`.");return nl(n,[],[],t)}function WC(n){const e={x:E(n,"x","sqrt","float32")};return A.runKernel(yi,e)}const Ee=F({sqrt_:WC});function UC(n){const t=E(n,"x","square"),e={};return A.runKernel("Square",{x:t},e)}const Lt=F({square_:UC});function GC(n,t=null,e=!1){let s=E(n,"x","sum");s.dtype==="bool"&&(s=nt(s,"int32"));const r={x:s},o={axis:t,keepDims:e};return A.runKernel(Kc,r,o)}const it=F({sum_:GC});function HC(n,t="euclidean",e=null,s=!1){n=E(n,"x","norm");const r=Yg(n,t,e);let o=r.shape;if(s){const i=wt(e,n.shape);o=Jt(r.shape,i)}return M(r,o)}function Yg(n,t,e=null){if(n.rank===0)return le(n);if(n.rank!==1&&e===null)return Yg(M(n,[-1]),t,e);if(n.rank===1||typeof e=="number"||Array.isArray(e)&&e.length===1){if(t===1)return it(le(n),e);if(t===1/0)return An(le(n),e);if(t===-1/0)return Cu(le(n),e);if(t==="euclidean"||t===2)return Ee(it(Tr(le(n),ft(2,"int32")),e));throw new Error(`Error in norm: invalid ord value: ${t}`)}if(Array.isArray(e)&&e.length===2){if(t===1)return An(it(le(n),e[0]),e[1]-1);if(t===1/0)return An(it(le(n),e[1]),e[0]);if(t===-1/0)return Cu(it(le(n),e[1]),e[0]);if(t==="fro"||t==="euclidean")return Ee(it(Lt(n),e));throw new Error(`Error in norm: invalid ord value: ${t}`)}throw new Error(`Error in norm: invalid axis: ${e}`)}const il=F({norm_:HC});function qC(n,t=null,e=!1){return il(n,"euclidean",t,e)}const KC=F({euclideanNorm_:qC});function jC(n){const e={x:E(n,"x","exp")};return A.runKernel(qo,e)}const an=F({exp_:jC});function XC(n,t=0){const e=E(n,"x","expandDims","string_or_numeric");S(t<=e.rank,()=>"Axis must be <= rank of the tensor");const s={input:e},r={dim:t};return A.runKernel(gc,s,r)}const nn=F({expandDims_:XC});function YC(n){const e={x:E(n,"x","expm1")};return A.runKernel(Ko,e)}const ZC=F({expm1_:YC});function JC(n,t){const e=E(n,"x","tile","string_or_numeric");S(e.rank===t.length,()=>`Error in transpose: rank of input ${e.rank} must match length of reps ${t}.`);const s={x:e},r={reps:t};return A.runKernel(ki,s,r)}const wn=F({tile_:JC});function QC(n,t,e,s="float32"){t==null&&(t=n);const r=yt([n,t],s),o=n<=t?n:t;for(let a=0;a<o;++a)r.set(1,a,a);const i=M(r.toTensor(),[n,t]);if(e==null)return i;if(e.length===1)return wn(nn(i,0),[e[0],1,1]);if(e.length===2)return wn(nn(nn(i,0),0),[e[0],e[1],1,1]);if(e.length===3)return wn(nn(nn(nn(i,0),0),0),[e[0],e[1],e[2],1,1]);throw new Error(`eye() currently supports only 1D and 2D batchShapes, but received ${e.length}D.`)}const Zg=F({eye_:QC});function tk(n){const e={x:E(n,"x","floor","float32")};return A.runKernel(jo,e)}const al=F({floor_:tk});function ek(n,t,e=0,s=0){const r=E(n,"x","gather"),o=E(t,"indices","gather","int32"),i={x:r,indices:o},a={axis:e,batchDims:s};return A.runKernel(bc,i,a)}const td=F({gather_:ek});function nk(n,t){let e=E(n,"a","greater","string_or_numeric"),s=E(t,"b","greater","string_or_numeric");[e,s]=Zt(e,s),mt(e.shape,s.shape);const r={a:e,b:s};return A.runKernel(yc,r)}const dn=F({greater_:nk});function sk(n,t){let e=E(n,"a","greaterEqual","string_or_numeric"),s=E(t,"b","greaterEqual","string_or_numeric");[e,s]=Zt(e,s),mt(e.shape,s.shape);const r={a:e,b:s};return A.runKernel(Yo,r)}const Vr=F({greaterEqual_:sk});function rk(n){const e={x:E(n,"x","isFinite")};return A.runKernel(Jo,e)}const ok=F({isFinite_:rk});function ik(n){const e={x:E(n,"x","isInf")};return A.runKernel(Qo,e)}const ak=F({isInf_:ik});function ck(n){const e={x:E(n,"x","isNaN")};return A.runKernel(ti,e)}const lk=F({isNaN_:ck});function uk(n,t=.2){const s={x:E(n,"x","leakyRelu")},r={alpha:t};return A.runKernel(wc,s,r)}const ed=F({leakyRelu_:uk});function hk(n,t){let e=E(n,"a","less","string_or_numeric"),s=E(t,"b","less","string_or_numeric");[e,s]=Zt(e,s),mt(e.shape,s.shape);const r={a:e,b:s};return A.runKernel(Ic,r)}const Jg=F({less_:hk});function dk(n,t){let e=E(n,"a","lessEqual","string_or_numeric"),s=E(t,"b","lessEqual","string_or_numeric");[e,s]=Zt(e,s),mt(e.shape,s.shape);const r={a:e,b:s};return A.runKernel(vc,r)}const Wr=F({lessEqual_:dk});function pk(n,t=5,e=1,s=1,r=.5){const o=E(n,"x","localResponseNormalization");S(o.rank===4||o.rank===3,()=>`Error in localResponseNormalization: x must be rank 3 or 4 but got
               rank ${o.rank}.`),S($r(t),()=>`Error in localResponseNormalization: depthRadius must be an integer but got depthRadius ${t}.`);let i=o,a=!1;o.rank===3&&(a=!0,i=M(o,[1,o.shape[0],o.shape[1],o.shape[2]]));const c={x:i},l={depthRadius:t,bias:e,alpha:s,beta:r},u=A.runKernel(Sc,c,l);return a?M(u,[u.shape[1],u.shape[2],u.shape[3]]):u}const fk=F({localResponseNormalization_:pk});function mk(n){const e={x:E(n,"x","log","float32")};return A.runKernel(ei,e)}const cn=F({log_:mk});function gk(n){const e={x:E(n,"x","log1p")};return A.runKernel(ni,e)}const nd=F({log1p_:gk});function xk(n,t){S(iu(n),()=>"The f passed in variableGrads(f) must be a function"),S(t==null||Array.isArray(t)&&t.every(l=>l instanceof Ea),()=>"The varList passed in variableGrads(f, varList) must be an array of variables");const e=t!=null;if(!e){t=[];for(const l in A.registeredVariables)t.push(A.registeredVariables[l])}const s=e?t.filter(l=>!l.trainable):null,r=t.length;t=t.filter(l=>l.trainable),S(t.length>0,()=>`variableGrads() expects at least one of the input variables to be trainable, but none of the ${r} variables is trainable.`);const o=!0,{value:i,grads:a}=A.gradients(n,t,null,o);S(a.some(l=>l!=null),()=>"Cannot find a connection between any variable and the result of the loss function y=f(x). Please make sure the operations that use variables are inside the function f passed to minimize()."),S(i.rank===0,()=>`The f passed in variableGrads(f) must return a scalar, but it returned a rank-${i.rank} tensor`);const c={};return t.forEach((l,u)=>{a[u]!=null&&(c[l.name]=a[u])}),s?.forEach(l=>c[l.name]=null),{value:i,grads:c}}function Ys(n){return A.customGrad(n)}function bk(n){const e={x:E(n,"x","softplus")};return A.runKernel(bi,e)}const Ei=F({softplus_:bk});function yk(n){const t=E(n,"x","logSigmoid");return Ys(s=>({value:qt(Ei(qt(s))),gradFunc:i=>D(i,zr(qt(s)))}))(t)}const wk=F({logSigmoid_:yk});function Ik(n,t){let e=E(n,"a","sub"),s=E(t,"b","sub");[e,s]=Zt(e,s);const r={a:e,b:s};return A.runKernel(Ii,r)}const at=F({sub_:Ik});function vk(n,t=-1){const e=E(n,"logits","logSoftmax");if(t===-1&&(t=e.rank-1),t!==e.rank-1)throw Error(`Log Softmax along a non-last dimension is not yet supported. Logits was rank ${e.rank} and axis was ${t}`);return Ys((r,o)=>{const a=An(r,t,!0),c=at(r,a),l=at(nt(c,"float32"),cn(it(an(c),t,!0)));return o([l]),{value:l,gradFunc:(h,d)=>{const[p]=d,f=!0,m=an(p);return at(h,D(it(h,t,f),m))}}})(e)}const Qg=F({logSoftmax_:vk});function Ck(n,t=null,e=!1){const s=E(n,"x","logSumExp"),r=wt(t,s.shape),o=An(s,r,!0),i=at(s,o),a=an(i),c=it(a,r),l=cn(c),u=J(M(o,l.shape),l);if(e){const h=Jt(u.shape,r);return M(u,h)}return u}const tx=F({logSumExp_:Ck});function kk(n,t){const e=E(n,"a","logicalAnd","bool"),s=E(t,"b","logicalAnd","bool");mt(e.shape,s.shape);const r={a:e,b:s};return A.runKernel(Cc,r)}const qn=F({logicalAnd_:kk});function $k(n){const e={x:E(n,"x","logicalNot","bool")};return A.runKernel(kc,e)}const sd=F({logicalNot_:$k});function Sk(n,t){const e=E(n,"a","logicalOr","bool"),s=E(t,"b","logicalOr","bool");mt(e.shape,s.shape);const r={a:e,b:s};return A.runKernel($c,r)}const ex=F({logicalOr_:Sk});function Nk(n,t){const e=E(n,"a","logicalXor","bool"),s=E(t,"b","logicalXor","bool");return mt(e.shape,s.shape),qn(ex(n,t),sd(qn(n,t)))}const Tk=F({logicalXor_:Nk});function Ek(n,t,e,s,r){const o=E(n,"x","maxPool"),i=1;let a=o,c=!1;o.rank===3&&(c=!0,a=M(o,[1,o.shape[0],o.shape[1],o.shape[2]])),S(a.rank===4,()=>`Error in maxPool: input must be rank 4 but got rank ${a.rank}.`),S($e(e,i),()=>`Error in maxPool: Either strides or dilations must be 1. Got strides ${e} and dilations '${i}'`),Le("maxPool",s,r);const l={x:a},u={filterSize:t,strides:e,pad:s,dimRoundingMode:r},h=A.runKernel(Tc,l,u);return c?M(h,[h.shape[1],h.shape[2],h.shape[3]]):h}const rd=F({maxPool_:Ek});function Rk(n,t=[1,1,1],e,s,r,o="NDHWC"){const i=E(n,"x","maxPool3d");let a=i,c=!1;i.rank===4&&(c=!0,a=M(i,[1,i.shape[0],i.shape[1],i.shape[2],i.shape[3]])),S(a.rank===5,()=>`Error in maxPool3d: x must be rank 5 but got rank ${a.rank}.`),S(o==="NDHWC",()=>`Error in maxPool3d: Only NDHWC is currently supported, but got dataFormat of ${o}`),Le("maxPool3d",s,r);const l={x:a},u={filterSize:t,strides:e,pad:s,dimRoundingMode:r,dataFormat:o},h=A.runKernel(Ec,l,u);return c?M(h,[h.shape[1],h.shape[2],h.shape[3],h.shape[4]]):h}const Dk=F({maxPool3d_:Rk});function Ak(n,t){let e=E(n,"a","maximum"),s=E(t,"b","maximum");[e,s]=Zt(e,s),e.dtype==="bool"&&(e=nt(e,"int32"),s=nt(s,"int32")),mt(e.shape,s.shape);const r={a:e,b:s};return A.runKernel(si,r)}const ws=F({maximum_:Ak});function Fk(n,t=null,e=!1){const r={x:E(n,"x","mean")},o={axis:t,keepDims:e};return A.runKernel(Rc,r,o)}const Yt=F({mean_:Fk});function he(n,t="float32"){if(t==="complex64"){const s=he(n,"float32"),r=he(n,"float32");return Hs(s,r)}const e=ke(q(n),t);return A.makeTensor(e,n,t)}function Is(n,t="float32"){if(t==="complex64"){const s=Is(n,"float32"),r=he(n,"float32");return Hs(s,r)}const e=Hu(q(n),t);return A.makeTensor(e,n,t)}function Ok(n,t){let e=E(n,"a","minimum"),s=E(t,"b","minimum");[e,s]=Zt(e,s),e.dtype==="bool"&&(e=nt(e,"int32"),s=nt(s,"int32")),mt(e.shape,s.shape);const r={a:e,b:s};return A.runKernel(ri,r)}const cl=F({minimum_:Ok});function _k(n,t,e){S(e==="reflect"||e==="symmetric",()=>`Invalid mode. Mode must be either reflect or symmetric. Got ${e}.`);const s=E(n,"x","mirrorPad");if(s.rank===0)throw new Error("mirrorPad(scalar) is not defined. Pass non-scalar to mirrorPad");S(t.length===s.rank,()=>`Padding doesn't match input. Must be ${s.rank}. Got ${t.length}.`);const r=e==="reflect"?1:0;for(let a=0;a<s.rank;a++)S(t[a].length===2,()=>"Invalid number of paddings. Must be length of 2 each."),S(t[a][0]>=0&&t[a][0]<=s.shape[a]-r&&t[a][1]>=0&&t[a][1]<=s.shape[a]-r,()=>`Padding in dimension ${a} cannot be greater than or equal to ${s.shape[a]-r} or less than 0 for input of shape ${s.shape}`);const o={paddings:t,mode:e},i={x:s};return A.runKernel(Ac,i,o)}const Mk=F({mirrorPad_:_k});function Lk(n,t){let e=E(n,"a","mod"),s=E(t,"b","mod");[e,s]=Zt(e,s);const r={a:e,b:s};return A.runKernel(oi,r)}const Pk=F({mod_:Lk});function Bk(n,t=null,e=!1){n=E(n,"x","moments");const s=wt(t,n.shape),r=Yt(n,s,e);let o=r.shape;e||(o=Jt(r.shape,s));const i=Lt(at(nt(n,"float32"),M(r,o))),a=Yt(i,s,e);return{mean:r,variance:a}}const od=F({moments_:Bk});function zk(n,t){let e=E(n,"a","notEqual","string_or_numeric"),s=E(t,"b","notEqual","string_or_numeric");[e,s]=Zt(e,s),mt(e.shape,s.shape);const r={a:e,b:s};return A.runKernel(Oc,r)}const wo=F({notEqual_:zk});function Vk(n){const e={x:E(n,"x","onesLike")};return A.runKernel(_c,e)}const ln=F({onesLike_:Vk});function Wk(n,t,e=0){const s=E(n,"x","pad");if(s.rank===0)throw new Error("pad(scalar) is not defined. Pass non-scalar to pad");const r={paddings:t,constantValue:e},o={x:s};return A.runKernel(Pc,o,r)}const id=F({pad_:Wk});function Uk(n,t,e){const s=E(n,"x","spaceToBatchND");S(s.rank>=1+t.length,()=>`input rank ${s.rank} should be > than [blockShape] ${t.length}`),S(e.length===t.length,()=>`paddings.shape[0] ${e.length} must be equal to [blockShape] ${t.length}`),S(s.shape.reduce((i,a,c)=>c>0&&c<=t.length?i&&(a+e[c-1][0]+e[c-1][1])%t[c-1]===0:i,!0),()=>`input spatial dimensions ${s.shape.slice(1)} with paddings ${e.toString()} must be divisible by blockShapes ${t.toString()}`);const r={x:s},o={blockShape:t,paddings:e};return A.runKernel(jc,r,o)}const ad=F({spaceToBatchND_:Uk});function Gk(n,t,e,s,r,o,i){r==null&&(r=[1,1]),o==null&&(o=1),s===0&&(s="valid");const a=E(n,"x","maxPool");let c=a,l=!1;a.rank===3&&(l=!0,c=M(a,[1,a.shape[0],a.shape[1],a.shape[2]])),S($e(o,r),()=>`Error in pool: Either strides or dilations must be 1. Got strides ${o} and dilations '${r}'`);const u=hn(c.shape,t,o,r,s),h=[u.dilationHeight,u.dilationWidth];let d;s==="same"?d=qk([u.filterHeight,u.filterWidth],h):d=[[0,0],[0,0]];const p=h[0]===1&&h[1]===1,[f,m]=Hk([u.inHeight,u.inWidth],h,d),g=p?s:"valid",x=p?c:ad(c,h,f),w=(e==="avg"?()=>Kh(x,t,o,g,i):()=>rd(x,t,o,g,i))(),y=p?w:Xh(w,h,m);return l?M(y,[y.shape[1],y.shape[2],y.shape[3]]):y}function Hk(n,t,e){const s=e.map(u=>u[0]),r=e.map(u=>u[1]),o=n.concat(s,r),i=t.map((u,h)=>(u-o[h]%u)%u),a=r.map((u,h)=>u+i[h]),c=t.map((u,h)=>[s[h],a[h]]),l=t.map((u,h)=>[0,i[h]]);return[c,l]}function qk(n,t){const s=n.map((i,a)=>i+(i-1)*(t[a]-1)).map(i=>i-1),r=s.map(i=>Math.floor(i/2)),o=s.map((i,a)=>i-r[a]);return s.map((i,a)=>[r[a],o[a]])}const Kk=F({pool_:Gk});function jk(n,t){const e=E(n,"x","prelu"),s=E(t,"alpha","prelu"),r={x:e,alpha:s};return A.runKernel(Bc,r)}const cd=F({prelu_:jk});function Xk(n,t=null,e=!1){let s=E(n,"x","prod");s.dtype==="bool"&&(s=nt(s,"int32"));const r={x:s},o={axis:t,keepDims:e};return A.runKernel(zc,r,o)}const Yk=F({prod_:Xk});var xa={exports:{}},Zk=xa.exports,ef;function Jk(){return ef||(ef=1,function(n){(function(t,e,s){function r(c){var l=this,u=a();l.next=function(){var h=2091639*l.s0+l.c*23283064365386963e-26;return l.s0=l.s1,l.s1=l.s2,l.s2=h-(l.c=h|0)},l.c=1,l.s0=u(" "),l.s1=u(" "),l.s2=u(" "),l.s0-=u(c),l.s0<0&&(l.s0+=1),l.s1-=u(c),l.s1<0&&(l.s1+=1),l.s2-=u(c),l.s2<0&&(l.s2+=1),u=null}function o(c,l){return l.c=c.c,l.s0=c.s0,l.s1=c.s1,l.s2=c.s2,l}function i(c,l){var u=new r(c),h=l&&l.state,d=u.next;return d.int32=function(){return u.next()*4294967296|0},d.double=function(){return d()+(d()*2097152|0)*11102230246251565e-32},d.quick=d,h&&(typeof h=="object"&&o(h,u),d.state=function(){return o(u,{})}),d}function a(){var c=4022871197,l=function(u){u=String(u);for(var h=0;h<u.length;h++){c+=u.charCodeAt(h);var d=.02519603282416938*c;c=d>>>0,d-=c,d*=c,c=d>>>0,d-=c,c+=d*4294967296}return(c>>>0)*23283064365386963e-26};return l}e&&e.exports?e.exports=i:this.alea=i})(Zk,n)}(xa)),xa.exports}var ba={exports:{}},Qk=ba.exports,nf;function t$(){return nf||(nf=1,function(n){(function(t,e,s){function r(a){var c=this,l="";c.x=0,c.y=0,c.z=0,c.w=0,c.next=function(){var h=c.x^c.x<<11;return c.x=c.y,c.y=c.z,c.z=c.w,c.w^=c.w>>>19^h^h>>>8},a===(a|0)?c.x=a:l+=a;for(var u=0;u<l.length+64;u++)c.x^=l.charCodeAt(u)|0,c.next()}function o(a,c){return c.x=a.x,c.y=a.y,c.z=a.z,c.w=a.w,c}function i(a,c){var l=new r(a),u=c&&c.state,h=function(){return(l.next()>>>0)/4294967296};return h.double=function(){do var d=l.next()>>>11,p=(l.next()>>>0)/4294967296,f=(d+p)/(1<<21);while(f===0);return f},h.int32=l.next,h.quick=h,u&&(typeof u=="object"&&o(u,l),h.state=function(){return o(l,{})}),h}e&&e.exports?e.exports=i:this.xor128=i})(Qk,n)}(ba)),ba.exports}var ya={exports:{}},e$=ya.exports,sf;function n$(){return sf||(sf=1,function(n){(function(t,e,s){function r(a){var c=this,l="";c.next=function(){var h=c.x^c.x>>>2;return c.x=c.y,c.y=c.z,c.z=c.w,c.w=c.v,(c.d=c.d+362437|0)+(c.v=c.v^c.v<<4^(h^h<<1))|0},c.x=0,c.y=0,c.z=0,c.w=0,c.v=0,a===(a|0)?c.x=a:l+=a;for(var u=0;u<l.length+64;u++)c.x^=l.charCodeAt(u)|0,u==l.length&&(c.d=c.x<<10^c.x>>>4),c.next()}function o(a,c){return c.x=a.x,c.y=a.y,c.z=a.z,c.w=a.w,c.v=a.v,c.d=a.d,c}function i(a,c){var l=new r(a),u=c&&c.state,h=function(){return(l.next()>>>0)/4294967296};return h.double=function(){do var d=l.next()>>>11,p=(l.next()>>>0)/4294967296,f=(d+p)/(1<<21);while(f===0);return f},h.int32=l.next,h.quick=h,u&&(typeof u=="object"&&o(u,l),h.state=function(){return o(l,{})}),h}e&&e.exports?e.exports=i:this.xorwow=i})(e$,n)}(ya)),ya.exports}var wa={exports:{}},s$=wa.exports,rf;function r$(){return rf||(rf=1,function(n){(function(t,e,s){function r(a){var c=this;c.next=function(){var u=c.x,h=c.i,d,p;return d=u[h],d^=d>>>7,p=d^d<<24,d=u[h+1&7],p^=d^d>>>10,d=u[h+3&7],p^=d^d>>>3,d=u[h+4&7],p^=d^d<<7,d=u[h+7&7],d=d^d<<13,p^=d^d<<9,u[h]=p,c.i=h+1&7,p};function l(u,h){var d,p=[];if(h===(h|0))p[0]=h;else for(h=""+h,d=0;d<h.length;++d)p[d&7]=p[d&7]<<15^h.charCodeAt(d)+p[d+1&7]<<13;for(;p.length<8;)p.push(0);for(d=0;d<8&&p[d]===0;++d);for(d==8?p[7]=-1:p[d],u.x=p,u.i=0,d=256;d>0;--d)u.next()}l(c,a)}function o(a,c){return c.x=a.x.slice(),c.i=a.i,c}function i(a,c){a==null&&(a=+new Date);var l=new r(a),u=c&&c.state,h=function(){return(l.next()>>>0)/4294967296};return h.double=function(){do var d=l.next()>>>11,p=(l.next()>>>0)/4294967296,f=(d+p)/(1<<21);while(f===0);return f},h.int32=l.next,h.quick=h,u&&(u.x&&o(u,l),h.state=function(){return o(l,{})}),h}e&&e.exports?e.exports=i:this.xorshift7=i})(s$,n)}(wa)),wa.exports}var Ia={exports:{}},o$=Ia.exports,of;function i$(){return of||(of=1,function(n){(function(t,e,s){function r(a){var c=this;c.next=function(){var u=c.w,h=c.X,d=c.i,p,f;return c.w=u=u+1640531527|0,f=h[d+34&127],p=h[d=d+1&127],f^=f<<13,p^=p<<17,f^=f>>>15,p^=p>>>12,f=h[d]=f^p,c.i=d,f+(u^u>>>16)|0};function l(u,h){var d,p,f,m,g,x=[],b=128;for(h===(h|0)?(p=h,h=null):(h=h+"\0",p=0,b=Math.max(b,h.length)),f=0,m=-32;m<b;++m)h&&(p^=h.charCodeAt((m+32)%h.length)),m===0&&(g=p),p^=p<<10,p^=p>>>15,p^=p<<4,p^=p>>>13,m>=0&&(g=g+1640531527|0,d=x[m&127]^=p+g,f=d==0?f+1:0);for(f>=128&&(x[(h&&h.length||0)&127]=-1),f=127,m=4*128;m>0;--m)p=x[f+34&127],d=x[f=f+1&127],p^=p<<13,d^=d<<17,p^=p>>>15,d^=d>>>12,x[f]=p^d;u.w=g,u.X=x,u.i=f}l(c,a)}function o(a,c){return c.i=a.i,c.w=a.w,c.X=a.X.slice(),c}function i(a,c){a==null&&(a=+new Date);var l=new r(a),u=c&&c.state,h=function(){return(l.next()>>>0)/4294967296};return h.double=function(){do var d=l.next()>>>11,p=(l.next()>>>0)/4294967296,f=(d+p)/(1<<21);while(f===0);return f},h.int32=l.next,h.quick=h,u&&(u.X&&o(u,l),h.state=function(){return o(l,{})}),h}e&&e.exports?e.exports=i:this.xor4096=i})(o$,n)}(Ia)),Ia.exports}var va={exports:{}},a$=va.exports,af;function c$(){return af||(af=1,function(n){(function(t,e,s){function r(a){var c=this,l="";c.next=function(){var h=c.b,d=c.c,p=c.d,f=c.a;return h=h<<25^h>>>7^d,d=d-p|0,p=p<<24^p>>>8^f,f=f-h|0,c.b=h=h<<20^h>>>12^d,c.c=d=d-p|0,c.d=p<<16^d>>>16^f,c.a=f-h|0},c.a=0,c.b=0,c.c=-1640531527,c.d=1367130551,a===Math.floor(a)?(c.a=a/4294967296|0,c.b=a|0):l+=a;for(var u=0;u<l.length+20;u++)c.b^=l.charCodeAt(u)|0,c.next()}function o(a,c){return c.a=a.a,c.b=a.b,c.c=a.c,c.d=a.d,c}function i(a,c){var l=new r(a),u=c&&c.state,h=function(){return(l.next()>>>0)/4294967296};return h.double=function(){do var d=l.next()>>>11,p=(l.next()>>>0)/4294967296,f=(d+p)/(1<<21);while(f===0);return f},h.int32=l.next,h.quick=h,u&&(typeof u=="object"&&o(u,l),h.state=function(){return o(l,{})}),h}e&&e.exports?e.exports=i:this.tychei=i})(a$,n)}(va)),va.exports}var Ca={exports:{}};const l$={},u$=Object.freeze(Object.defineProperty({__proto__:null,default:l$},Symbol.toStringTag,{value:"Module"})),h$=ug(u$);var d$=Ca.exports,cf;function p$(){return cf||(cf=1,function(n){(function(t,e,s){var r=256,o=6,i=52,a="random",c=s.pow(r,o),l=s.pow(2,i),u=l*2,h=r-1,d;function p(y,I,C){var N=[];I=I==!0?{entropy:!0}:I||{};var T=x(g(I.entropy?[y,w(e)]:y??b(),3),N),$=new f(N),k=function(){for(var v=$.g(o),R=c,_=0;v<l;)v=(v+_)*r,R*=r,_=$.g(1);for(;v>=u;)v/=2,R/=2,_>>>=1;return(v+_)/R};return k.int32=function(){return $.g(4)|0},k.quick=function(){return $.g(4)/4294967296},k.double=k,x(w($.S),e),(I.pass||C||function(v,R,_,P){return P&&(P.S&&m(P,$),v.state=function(){return m($,{})}),_?(s[a]=v,R):v})(k,T,"global"in I?I.global:this==s,I.state)}function f(y){var I,C=y.length,N=this,T=0,$=N.i=N.j=0,k=N.S=[];for(C||(y=[C++]);T<r;)k[T]=T++;for(T=0;T<r;T++)k[T]=k[$=h&$+y[T%C]+(I=k[T])],k[$]=I;(N.g=function(v){for(var R,_=0,P=N.i,L=N.j,B=N.S;v--;)R=B[P=h&P+1],_=_*r+B[h&(B[P]=B[L=h&L+R])+(B[L]=R)];return N.i=P,N.j=L,_})(r)}function m(y,I){return I.i=y.i,I.j=y.j,I.S=y.S.slice(),I}function g(y,I){var C=[],N=typeof y,T;if(I&&N=="object")for(T in y)try{C.push(g(y[T],I-1))}catch{}return C.length?C:N=="string"?y:y+"\0"}function x(y,I){for(var C=y+"",N,T=0;T<C.length;)I[h&T]=h&(N^=I[h&T]*19)+C.charCodeAt(T++);return w(I)}function b(){try{var y;return d&&(y=d.randomBytes)?y=y(r):(y=new Uint8Array(r),(t.crypto||t.msCrypto).getRandomValues(y)),w(y)}catch{var I=t.navigator,C=I&&I.plugins;return[+new Date,t,C,t.screen,w(e)]}}function w(y){return String.fromCharCode.apply(0,y)}if(x(s.random(),e),n.exports){n.exports=p;try{d=h$}catch{}}else s["seed"+a]=p})(typeof self<"u"?self:d$,[],Math)}(Ca)),Ca.exports}var zl,lf;function f$(){if(lf)return zl;lf=1;var n=Jk(),t=t$(),e=n$(),s=r$(),r=i$(),o=c$(),i=p$();return i.alea=n,i.xor128=t,i.xorwow=e,i.xorshift7=s,i.xor4096=r,i.tychei=o,zl=i,zl}var ll=f$();class ld{constructor(t,e,s,r,o){this.mean=t,this.stdDev=e,this.dtype=s,this.nextVal=NaN,this.truncated=r,this.truncated&&(this.upper=this.mean+this.stdDev*2,this.lower=this.mean-this.stdDev*2);const i=o||Math.random();this.random=ll.alea(i.toString())}nextValue(){if(!isNaN(this.nextVal)){const r=this.nextVal;return this.nextVal=NaN,r}let t,e,s=!1;for(;!s;){let r,o,i;do r=2*this.random()-1,o=2*this.random()-1,i=r*r+o*o;while(i>=1||i===0);const a=Math.sqrt(-2*Math.log(i)/i);t=this.mean+this.stdDev*r*a,e=this.mean+this.stdDev*o*a,(!this.truncated||this.isValidTruncated(t))&&(s=!0)}return(!this.truncated||this.isValidTruncated(e))&&(this.nextVal=this.convertValue(e)),this.convertValue(t)}convertValue(t){return this.dtype==null||this.dtype==="float32"?t:Math.round(t)}isValidTruncated(t){return t<=this.upper&&t>=this.lower}}class m6{constructor(t,e,s,r){this.alpha=t,this.beta=1/e,this.dtype=s;const o=r||Math.random();this.randu=ll.alea(o.toString()),this.randn=new ld(0,1,s,!1,this.randu()),t<1?this.d=t+2/3:this.d=t-1/3,this.c=1/Math.sqrt(9*this.d)}nextValue(){let t,e,s,r,o,i;for(;;){do r=this.randn.nextValue(),i=1+this.c*r;while(i<=0);if(i*=i*i,t=r*r,e=1-.331*t*t,s=.5*t+this.d*(1-i+Math.log(i)),o=this.randu(),o<e||Math.log(o)<s)break}return i=1/this.beta*this.d*i,this.alpha<1&&(i*=Math.pow(this.randu(),1/this.alpha)),this.convertValue(i)}convertValue(t){return this.dtype==="float32"?t:Math.round(t)}}class m${constructor(t=0,e=1,s,r){if(this.canReturnFloat=()=>this.dtype==null||this.dtype==="float32",this.min=t,this.range=e-t,this.dtype=s,r==null&&(r=Math.random()),typeof r=="number"&&(r=r.toString()),!this.canReturnFloat()&&this.range<=1)throw new Error(`The difference between ${t} - ${e} <= 1 and dtype is not float`);this.random=ll.alea(r)}convertValue(t){return this.canReturnFloat()?t:Math.round(t)}nextValue(){return this.convertValue(this.min+this.range*this.random())}}function g$(n,t=0,e=1,s,r){if(s!=null&&s==="bool")throw new Error(`Unsupported data type ${s}`);const o=new ld(t,e,s,!1,r),i=yt(n,s);for(let a=0;a<i.values.length;a++)i.values[a]=o.nextValue();return i.toTensor()}const x$=F({randomNormal_:g$});function b$(n,t=0,e=1,s="float32",r){const o=yt(n,s),i=new m$(t,e,null,r);for(let a=0;a<o.values.length;a++)o.values[a]=i.nextValue();return o.toTensor()}const ul=F({randomUniform_:b$});function Fa(n,t,e=1,s="float32"){if(e===0)throw new Error("Cannot have a step of zero");const r={start:n,stop:t,step:e,dtype:s};return A.runKernel(wh,{},r)}function y$(n){const e={x:E(n,"x","reciprocal")};return A.runKernel(ci,e)}const w$=F({reciprocal_:y$});function I$(n){const e={x:E(n,"x","relu")};return A.runKernel(li,e)}const Yn=F({relu_:I$});function v$(n){const e={x:E(n,"x","relu6")};return A.runKernel(ui,e)}const nx=F({relu6_:v$});function C$(n,t){const s={x:E(n,"x","reverse")},r={dims:t};return A.runKernel(Gc,s,r)}const Zs=F({reverse_:C$});function k$(n){const e={x:E(n,"x","round")};return A.runKernel(hi,e)}const sx=F({round_:k$});function $$(n){const e={x:E(n,"x","rsqrt","float32")};return A.runKernel(di,e)}const rx=F({rsqrt_:$$});function S$(n){const e={x:E(n,"x","selu")};return A.runKernel(pi,e)}const ox=F({selu_:S$});function N$(n,t,e,s,r,o=[1,1],i="NHWC"){const a=E(n,"x","separableConv2d"),c=E(t,"depthwiseFilter","separableConv2d"),l=E(e,"pointwiseFilter","separableConv2d");let u=a,h=!1;if(a.rank===3&&(h=!0,u=M(a,[1,a.shape[0],a.shape[1],a.shape[2]])),i==="NCHW")throw new Error("separableConv2d currently does not support dataFormat NCHW; only NHWC is supported");S(u.rank===4,()=>`Error in separableConv2d: input must be rank 4, but got rank ${u.rank}.`),S(c.rank===4,()=>`Error in separableConv2d: depthwise filter must be rank 4, but got rank ${c.rank}.`),S(l.rank===4,()=>`Error in separableConv2d: pointwise filter must be rank 4, but got rank ${c.rank}.`),S(l.shape[0]===1,()=>`Error in separableConv2d: the first dimension of pointwise filter  must be 1, but got ${l.shape[0]}.`),S(l.shape[1]===1,()=>`Error in separableConv2d: the second dimension of pointwise filter must be 1, but got ${l.shape[1]}.`);const d=c.shape[2],p=c.shape[3];S(l.shape[2]===d*p,()=>`Error in separableConv2d: the third dimension of pointwise filter must be ${d*p}, but got ${l.shape[2]}.`);const f=Jh(u,c,s,r,i,o),g=Xs(f,l,1,"valid",i);return h?M(g,[g.shape[1],g.shape[2],g.shape[3]]):g}const ix=F({separableConv2d_:N$});function T$(n){const e={x:E(n,"x","sign")};return A.runKernel(gi,e)}const E$=F({sign_:T$});function R$(n){const e={x:E(n,"x","sin","float32")};return A.runKernel(fi,e)}const ax=F({sin_:R$});function D$(n){const e={x:E(n,"x","sinh")};return A.runKernel(mi,e)}const cx=F({sinh_:D$});function A$(n,t,e){const s=E(n,"x","slice1d");return S(s.rank===1,()=>`slice1d expects a rank-1 tensor, but got a rank-${s.rank} tensor`),Ft(s,[t],[e])}const ud=F({slice1d_:A$});function F$(n,t,e){const s=E(n,"x","slice2d");return S(s.rank===2,()=>`slice2d expects a rank-2 tensor, but got a rank-${s.rank} tensor`),Ft(s,t,e)}const lx=F({slice2d_:F$});function O$(n,t,e){const s=E(n,"x","slice3d");return S(s.rank===3,()=>`slice3d expects a rank-3 tensor, but got a rank-${s.rank} tensor`),Ft(s,t,e)}const hd=F({slice3d_:O$});function _$(n,t,e){const s=E(n,"x","slice4d");return S(s.rank===4,()=>`slice4d expects a rank-4 tensor, but got a rank-${s.rank} tensor`),Ft(s,t,e)}const Oa=F({slice4d_:_$});function M$(n,t=-1){const e=E(n,"logits","softmax","float32");if(t===-1&&(t=e.rank-1),t!==e.rank-1)throw Error(`Softmax along a non-last dimension is not yet supported. Logits was rank ${e.rank} and dim was ${t}`);const s={logits:e},r={dim:t};return A.runKernel(Yc,s,r)}const dd=F({softmax_:M$});function L$(n){S(n.dtype==="complex64",()=>`The dtype for tf.spectral.fft() must be complex64 but got ${n.dtype}.`);const t={input:n};return A.runKernel(lh,t)}const pd=F({fft_:L$});function P$(n){S(n.dtype==="complex64",()=>`The dtype for tf.spectral.ifft() must be complex64 but got ${n.dtype}.`);const t={input:n};return A.runKernel(dh,t)}const _a=F({ifft_:P$});function B$(n){const t=n.shape[n.shape.length-1],e=n.size/t;let s;if(t<=2){const r=M(n,[e,t]);s=_a(r)}else{const r=[e,2*(t-1)],o=M(Da(n),[e,t]),i=M(Bh(n),[e,t]),a=Zs(Ft(o,[0,1],[e,t-2]),1),c=D(Zs(Ft(i,[0,1],[e,t-2]),1),ft(-1)),l=Ce([o,a],1),u=Ce([i,c],1),h=M(Hs(l,u),[r[0],r[1]]);s=_a(h)}if(s=Da(s),n.rank===3&&n.shape[0]!==0){const r=s,o=n.shape[0];s=M(s,[o,s.shape[0]/o,s.shape[1]]),r.dispose()}return s}const ux=F({irfft_:B$});function z$(n,t,e=0){const r={x:E(n,"x","split")},o={numOrSizeSplits:t,axis:e};return A.runKernel(Xc,r,o)}const Ye=F({split_:z$});function V$(n,t){S(n.dtype==="float32",()=>`The dtype for rfft() must be real value but got ${n.dtype}`);let e=n.shape[n.shape.length-1];const s=n.size/e;let r;if(t!=null&&t<e){const f=n.shape.map(g=>0),m=n.shape.map(g=>g);m[n.shape.length-1]=t,r=Ft(n,f,m),e=t}else if(t!=null&&t>e){const f=n.shape.map(m=>m);f[n.shape.length-1]=t-e,r=Ce([n,he(f)],n.shape.length-1),e=t}else r=n;const o=$t(r),i=M(Hs(r,o),[s,e]),a=pd(i),c=Math.floor(e/2)+1,l=Da(a),u=Bh(a),h=Ye(l,[c,e-c],l.shape.length-1),d=Ye(u,[c,e-c],u.shape.length-1),p=r.shape.slice();return p[r.shape.length-1]=c,M(Hs(h[0],d[0]),p)}const fd=F({rfft_:V$});function W$(n,t){let e=E(n,"a","squaredDifference"),s=E(t,"b","squaredDifference");[e,s]=Zt(e,s),mt(e.shape,s.shape);const r={a:e,b:s},o={};return A.runKernel(wi,r,o)}const hx=F({squaredDifference_:W$});function U$(n,t){const e=E(n,"x","squeeze","string_or_numeric");return M(e,gs(e.shape,t).newShape)}const Ri=F({squeeze_:U$});function G$(n,t=0){const e=vg(n,"tensors","stack","string_or_numeric");S(e.length>=1,()=>"Pass at least one tensor to tf.stack"),e.length>0&&S(t<=e[0].rank,()=>"Axis must be <= rank of the tensor");const s=e,r={axis:t};return A.runKernel(Lc,s,r)}const Js=F({stack_:G$});function H$(n,t=0){const s={x:E(n,"x","step")},r={alpha:t};return A.runKernel($i,s,r)}const Di=F({step_:H$});function q$(n,t,e,s,r=0,o=0,i=0,a=0,c=0){const u={x:E(n,"x","stridedSlice","string_or_numeric")},h={begin:t,end:e,strides:s,beginMask:r,endMask:o,ellipsisMask:i,newAxisMask:a,shrinkAxisMask:c};return A.runKernel(Eh,u,h)}const K$=F({stridedSlice_:q$});function j$(n){const e={x:E(n,"x","tan","float32")};return A.runKernel(vi,e)}const X$=F({tan_:j$});function ze(n,t){Bm(n);const e=el(n,t);if(e.length!==1)throw new Error("tensor1d() requires values to be a flat/TypedArray");return nl(n,null,e,t)}function ka(n,t,e){if(Bm(n),t!=null&&t.length!==2)throw new Error("tensor2d() requires shape to have two numbers");const s=el(n,e);if(s.length!==2&&s.length!==1)throw new Error("tensor2d() requires values to be number[][] or flat/TypedArray");if(s.length===1&&t==null)throw new Error("tensor2d() requires shape to be provided when `values` are a flat/TypedArray");return nl(n,t,s,e)}function Y$(n,t=1,e=!0){const s=E(n,"x","topk");if(s.rank===0)throw new Error("topk() expects the input to be of rank 1 or higher");const r=s.shape[s.shape.length-1];if(t<0)throw new Error(`'k' passed to topk() must be >= 0 but got ${t}`);if(t>r)throw new Error(`'k' passed to topk() must be <= the last dimension (${r}) but got ${t}`);const o={x:s},i={k:t,sorted:e},[a,c]=A.runKernel(Fh,o,i);return{values:a,indices:c}}const Z$=F({topk_:Y$});function J$(n,t=0,e=1,s,r){if(s!=null&&s==="bool")throw new Error("Unsupported data type $ { dtype }");const o=new ld(t,e,s,!0,r),i=yt(n,s);for(let a=0;a<i.values.length;a++)i.values[a]=o.nextValue();return i.toTensor()}const dx=F({truncatedNormal_:J$});function Q$(n,t=0){const e=E(n,"x","unique","string_or_numeric");S(e.rank>0,()=>"The input tensor must be at least 1D");const s={x:e},r={axis:t},[o,i]=A.runKernel(_h,s,r);return{values:o,indices:i}}const tS=F({unique_:Q$});function eS(n,t,e){const s=E(n,"x","unsortedSegmentSum"),r=E(t,"segmentIds","unsortedSegmentSum","int32");S($r(e),()=>"numSegments must be of dtype int");const o={x:s,segmentIds:r},i={numSegments:e};return A.runKernel(Jc,o,i)}const px=F({unsortedSegmentSum_:eS});function nS(n,t=0){const e=E(n,"x","unstack","string_or_numeric");S(t>=-e.shape.length&&t<e.shape.length,()=>`Axis = ${t} is not in [-${e.shape.length}, ${e.shape.length})`);const s={value:e},r={axis:t};return A.runKernel(Zc,s,r)}const Er=F({unstack_:nS});function sS(n,t=!0,e,s){return A.makeVariable(n,t,e,s)}function fx(n,t){const e=[];for(let o=0;o<t.length;o++)t[o]&&e.push(o);const s=yt(n,"int32"),r=yt([e.length,n.length],"int32");for(let o=0;o<e.length;o++){const i=s.indexToLoc(e[o]),a=o*n.length;r.values.set(i,a)}return r.toTensor()}function rS(n,t){if(t==null)return n.shape.slice();if(Tt(n.shape,t))return t;if(n.shape.length===t.length){const e=[];for(let s=0;s<n.shape.length;s++)t[s]==null&&n.shape[s]!=null?e.push(n.shape[s]):e.push(t[s]);return e}return t}function oS(n,t,e,s){const r=E(n,"x","dropout");if(S(r.dtype==="float32",()=>`x has to be a floating point tensor since it's going to be scaled, but got a ${r.dtype} tensor instead.`),S(t>=0&&t<1,()=>`rate must be a float in the range [0, 1), but got ${t}.`),t===0)return n instanceof ne?r.clone():r;const o=rS(r,e),i=1-t,a=ut(al(J(ul(o,0,1,"float32",s),i)),i);return D(r,a)}const iS=F({dropout_:oS});function aS(n){return Math.floor(Math.pow(2,Math.ceil(Math.log(n)/Math.log(2))))}function mx(n,t,e){const s=1-n%2,r=new Float32Array(n);for(let o=0;o<n;++o){const i=2*Math.PI*o/(n+s-1);r[o]=t-e*Math.cos(i)}return ze(r,"float32")}function cS(n,t,e,s,r,o="NHWC",i){let a=n;n.rank===3&&(a=M(n,[1,n.shape[0],n.shape[1],n.shape[2]]));let c=t;c.rank===3&&(c=M(t,[1,t.shape[0],t.shape[1],t.shape[2]])),S(a.rank===4,()=>`Error in conv2dDerFilter: input must be rank 4, but got shape ${a.shape}.`),S(c.rank===4,()=>`Error in conv2dDerFilter: dy must be rank 4, but got shape ${c.shape}.`),S(e.length===4,()=>`Error in conv2dDerFilter: filterShape must be length 4, but got ${e}.`);const l=o==="NHWC"?a.shape[3]:a.shape[1],u=o==="NHWC"?c.shape[3]:c.shape[1];S(l===e[2],()=>`Error in conv2dDerFilter: depth of input ${l}) must match input depth in filter (${e[2]}.`),S(u===e[3],()=>`Error in conv2dDerFilter: depth of dy (${u}) must match output depth for filter (${e[3]}).`),Le("conv2dDerFilter",r,i);const h={x:a,dy:c},d={strides:s,pad:r,dataFormat:o,dimRoundingMode:i,filterShape:e};return A.runKernel(th,h,d)}const md=F({conv2DBackpropFilter_:cS});function gd(n,t,e){if(e==null||e==="linear")return n;if(e==="relu")return D(n,Di(t));throw new Error(`Cannot compute gradient for fused activation ${e}.`)}function xd(n,t){let e=t;const s=ce(n.shape,t.shape);return s.length>0&&(e=it(e,s)),M(e,n.shape)}function bd(n,t,e,s){if(t==="linear")return n;if(t==="relu")return Yn(n);if(t==="elu")return ol(n);if(t==="relu6")return nx(n);if(t==="prelu")return cd(n,e);if(t==="leakyrelu")return ed(n,s);if(t==="sigmoid")return zr(n);throw new Error(`Unknown fused activation ${t}.`)}const yd=(n,t)=>!(n>0)||t==="linear";function lS({x:n,filter:t,strides:e,pad:s,dataFormat:r="NHWC",dilations:o=[1,1],dimRoundingMode:i,bias:a,activation:c="linear",preluActivationWeights:l,leakyreluAlpha:u}){if(c=c||"linear",yd(A.state.gradientDepth,c)===!1){S(r==="NHWC",()=>`Error in fused conv2d: got dataFormat of ${r} but only NHWC is currently supported for the case of gradient depth is 0 and the activation is not linear.`);let C=Xs(n,t,e,s,r,o,i);return a!=null&&(C=J(C,a)),bd(C,c,l,u)}const h=E(n,"x","conv2d","float32"),d=E(t,"filter","conv2d","float32");let p=h,f=!1;h.rank===3&&(f=!0,p=M(h,[1,h.shape[0],h.shape[1],h.shape[2]])),S(p.rank===4,()=>`Error in fused conv2d: input must be rank 4, but got rank ${p.rank}.`),S(d.rank===4,()=>`Error in fused conv2d: filter must be rank 4, but got rank ${d.rank}.`),Le("fused conv2d",s,i);const m=r==="NHWC"?p.shape[3]:p.shape[1];S(d.shape[2]===m,()=>`Error in conv2d: depth of input (${m}) must match input depth for filter ${d.shape[2]}.`),S($e(e,o),()=>`Error in conv2D: Either strides or dilations must be 1. Got strides ${e} and dilations '${o}'`);const g=ye(p.shape,d.shape,e,o,s,i);let x;a!=null&&(x=E(a,"bias","fused conv2d"),[x]=Zt(x,h),r==="NHWC"?mt(g.outShape,x.shape):(S(x.shape.length<=1,()=>`Error in fused conv2d: only supports scalar or 1-D Tensor bias for NCHW format but got the bias of rank-${x.shape.length}.`),S(x.shape.length===0||x.shape[0]===g.outChannels||x.shape[0]===1,()=>`Error in fused conv2d: bias shape (${x.shape}) is not compatible with the number of output channels (${g.outChannels})`)));let b;if(l!=null){const C=l.shape;if(S(C.length<=1||C.length===3,()=>`Error in fused conv2d: only supports scalar, 1-D Tensor or 3-D Tensor PReLU activation weights but got a tensor of rank-${C.length}.`),C.length===1)S(C[0]===1||C[0]===g.outChannels,()=>`Error in fused conv2d: PReLU activation weights (${C}) is not compatible with the number of output channels (${g.outChannels}).`);else if(C.length===3)try{mt(C,g.outShape)}catch{const T=`Error in fused conv2d: PReLU activation weights (${C}) is not compatible with the output shape of the conv2d (${g.outShape}).`;throw Error(T)}b=E(l,"prelu weights","fused conv2d")}const w=(C,N)=>{S(r==="NHWC",()=>`Error in gradient of fused conv2D: got dataFormat of ${r} but only NHWC is currently supported.`);const[T,$,k,v]=N,R=gd(C,k,c);S(js(o),()=>`Error in gradient of fused conv2D: dilation rates greater than 1 are not yet supported in gradients. Got dilations '${o}'`);const _=Yh($.shape,R,T,e,s),P=md($,R,T.shape,e,s),L=[_,P];if(v!=null){const B=xd(v,R);L.push(B)}return L},y={x:p,filter:d,bias:x,preluActivationWeights:b},I={strides:e,pad:s,dataFormat:r,dilations:o,dimRoundingMode:i,activation:c,leakyreluAlpha:u};return a==null?Ys((N,T,$)=>{let k=A.runKernel(Na,y,I);return $([T,N,k]),f&&(k=M(k,[k.shape[1],k.shape[2],k.shape[3]])),{value:k,gradFunc:w}})(p,d):Ys((N,T,$,k)=>{let v=A.runKernel(Na,y,I);return k([T,N,v,$]),f&&(v=M(v,[v.shape[1],v.shape[2],v.shape[3]])),{value:v,gradFunc:w}})(p,d,x)}const uS=F({fusedConv2d_:lS});function hS(n,t,e,s,r,o=[1,1],i){let a=n;n.rank===3&&(a=M(n,[1,n.shape[0],n.shape[1],n.shape[2]]));let c=t;c.rank===3&&(c=M(t,[1,t.shape[0],t.shape[1],t.shape[2]]));const l={x:a,dy:c},u={strides:s,pad:r,dimRoundingMode:i,dilations:o,filterShape:e};return A.runKernel(ih,l,u)}const dS=F({depthwiseConv2dNativeBackpropFilter_:hS});function pS(n,t,e,s,r,o=[1,1],i){let a=t,c=!1;t.rank===3&&(c=!0,a=M(t,[1,t.shape[0],t.shape[1],t.shape[2]]));const l={dy:a,filter:e},u={strides:s,pad:r,dimRoundingMode:i,dilations:o,inputShape:n},h=A.runKernel(ah,l,u);return c?M(h,[h.shape[1],h.shape[2],h.shape[3]]):h}const fS=F({depthwiseConv2dNativeBackpropInput_:pS});function mS({a:n,b:t,transposeA:e=!1,transposeB:s=!1,bias:r,activation:o="linear",preluActivationWeights:i,leakyreluAlpha:a=.2}){if(yd(A.state.gradientDepth,o)===!1){let v=Nt(n,t,e,s);return r!=null&&(v=J(v,r)),bd(v,o,i,a)}let c=E(n,"a","fused matMul"),l=E(t,"b","fused matMul");[c,l]=Zt(c,l);const u=e?c.shape[c.rank-2]:c.shape[c.rank-1],h=s?l.shape[l.rank-1]:l.shape[l.rank-2],d=e?c.shape[c.rank-1]:c.shape[c.rank-2],p=s?l.shape[l.rank-2]:l.shape[l.rank-1],f=c.shape.slice(0,-2),m=l.shape.slice(0,-2),g=q(f),x=q(m);S(u===h,()=>`Error in fused matMul: inner shapes (${u}) and (${h}) of Tensors with shapes ${c.shape} and ${l.shape} and transposeA=${e} and transposeB=${s} must match.`);const w=mt(c.shape.slice(0,-2),l.shape.slice(0,-2)).concat([d,p]),y=e?M(c,[g,u,d]):M(c,[g,d,u]),I=s?M(l,[x,p,h]):M(l,[x,h,p]);let C;r!=null&&(C=E(r,"bias","fused matMul"),[C]=Zt(C,c),mt(w,C.shape));let N;i!=null&&(N=E(i,"prelu weights","fused matMul"));const T=(v,R)=>{const[_,P,L,B]=R,U=gd(M(v,L.shape),L,o);let V,H;if(!e&&!s?(V=Nt(U,P,!1,!0),H=Nt(_,U,!0,!1)):!e&&s?(V=Nt(U,P,!1,!1),H=Nt(U,_,!0,!1)):e&&!s?(V=Nt(P,U,!1,!0),H=Nt(_,U,!1,!1)):(V=Nt(P,U,!0,!0),H=Nt(U,_,!0,!0)),r!=null){const K=xd(B,U);return[V,H,K]}else return[V,H]},$={a:y,b:I,bias:C,preluActivationWeights:N},k={transposeA:e,transposeB:s,activation:o,leakyreluAlpha:a};return r==null?Ys((R,_,P)=>{const L=A.runKernel(Sa,$,k);return P([R,_,L]),{value:M(L,w),gradFunc:T}})(y,I):Ys((R,_,P,L)=>{const B=A.runKernel(Sa,$,k);return L([R,_,B,P]),{value:M(B,w),gradFunc:T}})(y,I,C)}const uf=F({fusedMatMul_:mS});function gS(n){return mx(n,.54,.46)}const xS=F({hammingWindow_:gS});function bS(n){return mx(n,.5,.5)}const gx=F({hannWindow_:bS});function yS(n,t,e,s=!1,r=0){let o=0;const i=[];for(;o+t<=n.size;)i.push(Ft(n,o,t)),o+=e;if(s)for(;o<n.size;){const a=o+t-n.size,c=Ce([Ft(n,o,t-a),Ti([a],r)]);i.push(c),o+=e}return i.length===0?ka([],[0,t]):M(Ce(i),[i.length,t])}const xx=F({frame_:yS});function wS(n,t,e,s,r=gx){s==null&&(s=aS(t));const o=xx(n,t,e),i=D(o,r(t));return fd(i,s)}const IS=F({stft_:wS});function vS(n,t,e,s,r="bilinear",o=0){const i=E(n,"image","cropAndResize"),a=E(t,"boxes","cropAndResize","float32"),c=E(e,"boxInd","cropAndResize","int32"),l=a.shape[0];S(i.rank===4,()=>`Error in cropAndResize: image must be rank 4,but got rank ${i.rank}.`),S(a.rank===2&&a.shape[1]===4,()=>`Error in cropAndResize: boxes must be have size [${l},4] but had shape ${a.shape}.`),S(c.rank===1&&c.shape[0]===l,()=>`Error in cropAndResize: boxInd must be have size [${l}] but had shape ${a.shape}.`),S(s.length===2,()=>`Error in cropAndResize: cropSize must be of length 2, but got length ${s.length}.`),S(s[0]>=1&&s[1]>=1,()=>`cropSize must be atleast [1,1], but was ${s}`),S(r==="bilinear"||r==="nearest",()=>`method must be bilinear or nearest, but was ${r}`);const u={image:i,boxes:a,boxInd:c},h={method:r,extrapolationValue:o,cropSize:s};return A.runKernel(rh,u,h)}const CS=F({cropAndResize_:vS});function kS(n){const t=E(n,"image","flipLeftRight","float32");S(t.rank===4,()=>`Error in flipLeftRight: image must be rank 4,but got rank ${t.rank}.`);const e={image:t};return A.runKernel(hh,e,{})}const $S=F({flipLeftRight_:kS});function SS(n){const t=E(n,"image","grayscaleToRGB"),e=t.rank-1,s=t.shape[e];S(t.rank>=2,()=>`Error in grayscaleToRGB: images must be at least rank 2, but got rank ${t.rank}.`),S(s===1,()=>`Error in grayscaleToRGB: last dimension of a grayscale image should be size 1, but got size ${s}.`);const r=new Array(t.rank);return r.fill(1,0,e),r[e]=3,wn(t,r)}const NS=F({grayscaleToRGB_:SS});function TS(n,t,e=0,s=.5){const r=E(n,"image","rotateWithOffset","float32");S(r.rank===4,()=>`Error in rotateWithOffset: image must be rank 4,but got rank ${r.rank}.`);const o={image:r},i={radians:t,fillValue:e,center:s};return A.runKernel(Mh,o,i)}const ES=F({rotateWithOffset_:TS});function Ur(n,t,e,s,r,o){s==null&&(s=.5),r==null&&(r=Number.NEGATIVE_INFINITY),o==null&&(o=0);const i=n.shape[0];return e=Math.min(e,i),S(0<=s&&s<=1,()=>`iouThreshold must be in [0, 1], but was '${s}'`),S(n.rank===2,()=>`boxes must be a 2D tensor, but was of rank '${n.rank}'`),S(n.shape[1]===4,()=>`boxes must have 4 columns, but 2nd dimension was ${n.shape[1]}`),S(t.rank===1,()=>"scores must be a 1D tensor"),S(t.shape[0]===i,()=>`scores has incompatible shape with boxes. Expected ${i}, but was ${t.shape[0]}`),S(0<=o&&o<=1,()=>`softNmsSigma must be in [0, 1], but was '${o}'`),{maxOutputSize:e,iouThreshold:s,scoreThreshold:r,softNmsSigma:o}}function RS(n,t,e,s=.5,r=Number.NEGATIVE_INFINITY){const o=E(n,"boxes","nonMaxSuppression","float32"),i=E(t,"scores","nonMaxSuppression","float32"),a=Ur(o,i,e,s,r);e=a.maxOutputSize,s=a.iouThreshold,r=a.scoreThreshold;const c={maxOutputSize:e,iouThreshold:s,scoreThreshold:r};return A.runKernel(xh,{boxes:o,scores:i},c)}const DS=F({nonMaxSuppression_:RS});function AS(n,t,e){const s=FS(n,t,e),r=s<0?-(s+1):s;n.splice(r,0,t)}function FS(n,t,e){return _S(n,t,e||OS)}function OS(n,t){return n>t?1:n<t?-1:0}function _S(n,t,e){let s=0,r=n.length,o=0,i=!1;for(;s<r;){o=s+(r-s>>>1);const a=e(t,n[o]);a>0?s=o+1:(r=o,i=!a)}return i?s:-s-1}function wd(n,t,e,s,r){return Cd(n,t,e,s,r,0)}function Id(n,t,e,s,r,o){return Cd(n,t,e,s,r,0,!1,o,!0)}function vd(n,t,e,s,r,o){return Cd(n,t,e,s,r,o,!0)}function Cd(n,t,e,s,r,o,i=!1,a=!1,c=!1){const l=[];for(let g=0;g<t.length;g++)t[g]>r&&l.push({score:t[g],boxIndex:g,suppressBeginIndex:0});l.sort(hf);const u=o>0?-.5/o:0,h=[],d=[];for(;h.length<e&&l.length>0;){const g=l.pop(),{score:x,boxIndex:b,suppressBeginIndex:w}=g;if(x<r)break;let y=!1;for(let I=h.length-1;I>=w;--I){const C=MS(n,b,h[I]);if(C>=s){y=!0;break}if(g.score=g.score*LS(s,u,C),g.score<=r)break}g.suppressBeginIndex=h.length,y||(g.score===x?(h.push(b),d.push(g.score)):g.score>r&&AS(l,g,hf))}const p=h.length,f=e-p;a&&f>0&&(h.push(...new Array(f).fill(0)),d.push(...new Array(f).fill(0)));const m={selectedIndices:h};return i&&(m.selectedScores=d),c&&(m.validOutputs=p),m}function MS(n,t,e){const s=n.subarray(t*4,t*4+4),r=n.subarray(e*4,e*4+4),o=Math.min(s[0],s[2]),i=Math.min(s[1],s[3]),a=Math.max(s[0],s[2]),c=Math.max(s[1],s[3]),l=Math.min(r[0],r[2]),u=Math.min(r[1],r[3]),h=Math.max(r[0],r[2]),d=Math.max(r[1],r[3]),p=(a-o)*(c-i),f=(h-l)*(d-u);if(p<=0||f<=0)return 0;const m=Math.max(o,l),g=Math.max(i,u),x=Math.min(a,h),b=Math.min(c,d),w=Math.max(x-m,0)*Math.max(b-g,0);return w/(p+f-w)}function LS(n,t,e){const s=Math.exp(t*e*e);return e<=n?s:0}function hf(n,t){return n.score-t.score||n.score===t.score&&t.boxIndex-n.boxIndex}async function PS(n,t,e,s=.5,r=Number.NEGATIVE_INFINITY){const o=E(n,"boxes","nonMaxSuppressionAsync"),i=E(t,"scores","nonMaxSuppressionAsync"),a=Ur(o,i,e,s,r);e=a.maxOutputSize,s=a.iouThreshold,r=a.scoreThreshold;const c=await Promise.all([o.data(),i.data()]),l=c[0],u=c[1],{selectedIndices:h}=wd(l,u,e,s,r);return o!==n&&o.dispose(),i!==t&&i.dispose(),ze(h,"int32")}const BS=PS;function zS(n,t,e,s=.5,r=Number.NEGATIVE_INFINITY,o=0){const i=E(n,"boxes","nonMaxSuppression"),a=E(t,"scores","nonMaxSuppression"),c=Ur(i,a,e,s,r,o);e=c.maxOutputSize,s=c.iouThreshold,r=c.scoreThreshold,o=c.softNmsSigma;const l={boxes:i,scores:a},u={maxOutputSize:e,iouThreshold:s,scoreThreshold:r,softNmsSigma:o},h=A.runKernel(yh,l,u);return{selectedIndices:h[0],selectedScores:h[1]}}const VS=F({nonMaxSuppressionWithScore_:zS});async function WS(n,t,e,s=.5,r=Number.NEGATIVE_INFINITY,o=0){const i=E(n,"boxes","nonMaxSuppressionAsync"),a=E(t,"scores","nonMaxSuppressionAsync"),c=Ur(i,a,e,s,r,o);e=c.maxOutputSize,s=c.iouThreshold,r=c.scoreThreshold,o=c.softNmsSigma;const l=await Promise.all([i.data(),a.data()]),u=l[0],h=l[1],{selectedIndices:d,selectedScores:p}=vd(u,h,e,s,r,o);return i!==n&&i.dispose(),a!==t&&a.dispose(),{selectedIndices:ze(d,"int32"),selectedScores:ze(p)}}const US=WS;function GS(n,t,e,s=.5,r=Number.NEGATIVE_INFINITY,o=!1){const i=E(n,"boxes","nonMaxSuppression"),a=E(t,"scores","nonMaxSuppression"),c=Ur(i,a,e,s,r,null),l=c.maxOutputSize,u=c.iouThreshold,h=c.scoreThreshold,d={boxes:i,scores:a},p={maxOutputSize:l,iouThreshold:u,scoreThreshold:h,padToMaxOutputSize:o},f=A.runKernel(bh,d,p);return{selectedIndices:f[0],validOutputs:f[1]}}const HS=F({nonMaxSuppressionPadded_:GS});async function qS(n,t,e,s=.5,r=Number.NEGATIVE_INFINITY,o=!1){const i=E(n,"boxes","nonMaxSuppressionAsync"),a=E(t,"scores","nonMaxSuppressionAsync"),c=Ur(i,a,e,s,r,null),l=c.maxOutputSize,u=c.iouThreshold,h=c.scoreThreshold,[d,p]=await Promise.all([i.data(),a.data()]),{selectedIndices:f,validOutputs:m}=Id(d,p,l,u,h,o);return i!==n&&i.dispose(),a!==t&&a.dispose(),{selectedIndices:ze(f,"int32"),validOutputs:ft(m,"int32")}}const KS=qS;function jS(n,t,e=!1,s=!1){const r=E(n,"images","resizeBilinear");S(r.rank===3||r.rank===4,()=>`Error in resizeBilinear: x must be rank 3 or 4, but got rank ${r.rank}.`),S(t.length===2,()=>`Error in resizeBilinear: new shape must 2D, but got shape ${t}.`),S(s===!1||e===!1,()=>"Error in resizeBilinear: If halfPixelCenters is true, alignCorners must be false.");let o=r,i=!1;r.rank===3&&(i=!0,o=M(r,[1,r.shape[0],r.shape[1],r.shape[2]]));const a={images:o},c={alignCorners:e,halfPixelCenters:s,size:t},l=A.runKernel(Uc,a,c);return i?M(l,[l.shape[1],l.shape[2],l.shape[3]]):l}const bx=F({resizeBilinear_:jS});function XS(n,t,e=!1,s=!1){const r=E(n,"images","resizeNearestNeighbor");S(r.rank===3||r.rank===4,()=>`Error in resizeNearestNeighbor: x must be rank 3 or 4, but got rank ${r.rank}.`),S(t.length===2,()=>`Error in resizeNearestNeighbor: new shape must 2D, but got shape ${t}.`),S(r.dtype==="float32"||r.dtype==="int32",()=>"`images` must have `int32` or `float32` as dtype"),S(s===!1||e===!1,()=>"Error in resizeNearestNeighbor: If halfPixelCenters is true, alignCorners must be false.");let o=r,i=!1;r.rank===3&&(i=!0,o=M(r,[1,r.shape[0],r.shape[1],r.shape[2]]));const a={images:o},c={alignCorners:e,halfPixelCenters:s,size:t},l=A.runKernel(Wc,a,c);return i?M(l,[l.shape[1],l.shape[2],l.shape[3]]):l}const yx=F({resizeNearestNeighbor_:XS});function YS(n,t="binary",e=!1,s=.5){const r=E(n,"image","threshold"),o=.2989,i=.587,a=.114,c=r.shape[0]*r.shape[1];let l=D(ze([s]),255),u,h,d,p;if(S(r.rank===3,()=>`Error in threshold: image must be rank 3,but got rank ${r.rank}.`),S(r.shape[2]===3||r.shape[2]===1,()=>`Error in threshold: image color channel must be equal to 3 or 1but got ${r.shape[2]}.`),S(r.dtype==="int32"||r.dtype==="float32",()=>`Error in dtype: image dtype must be int32 or float32,but got dtype ${r.dtype}.`),S(t==="otsu"||t==="binary",()=>`Method must be binary or otsu, but was ${t}`),r.shape[2]===3){[u,h,d]=Ye(r,[1,1,1],-1);const g=D(u,o),x=D(h,i),b=D(d,a);p=J(J(g,x),b)}else p=n;if(t==="otsu"){const g=Jv(nt(sx(p),"int32"),ma([]),256);l=ZS(g,c)}const f=e?Wr(p,l):dn(p,l);return nt(D(f,255),"int32")}function ZS(n,t){let e=ze([-1]),s=ze([0]),r=ze([0]),o,i,a,c,l,u;for(let h=0;h<n.size-1;h++){o=Ft(n,0,h+1),i=Ft(n,h+1),l=ut(it(o),t),u=ut(it(i),t);const d=it(D(o,Fa(0,o.size)));a=ut(d,it(o));const p=Ti(i.shape,o.size),f=J(Fa(0,i.size),p),m=D(i,f);c=ut(it(m),it(i));const g=at(a,c),x=at(a,c),b=D(l,u);r=D(D(b,g),x);const w=dn(r,s);s=Ue(w,r,s),e=Ue(w,ze([h]),e)}return e}const JS=F({threshold_:YS});function QS(n,t,e="nearest",s="constant",r=0,o){const i=E(n,"image","transform","float32"),a=E(t,"transforms","transform","float32");S(i.rank===4,()=>`Error in transform: image must be rank 4,but got rank ${i.rank}.`),S(a.rank===2&&(a.shape[0]===i.shape[0]||a.shape[0]===1)&&a.shape[1]===8,()=>"Error in transform: Input transform should be batch x 8 or 1 x 8"),S(o==null||o.length===2,()=>`Error in transform: outputShape must be [height, width] or null, but got ${o}.`);const c={image:i,transforms:a},l={interpolation:e,fillMode:s,fillValue:r,outputShape:o};return A.runKernel(Oh,c,l)}const t2=F({transform_:QS});function e2(n,t,e){S(t%1===0,()=>`bandPart(): numLower must be an integer, got ${t}.`),S(e%1===0,()=>`bandPart(): numUpper must be an integer, got ${e}.`);const s=E(n,"a","bandPart");S(s.rank>=2,()=>`bandPart(): Rank must be at least 2, got ${s.rank}.`);const r=s.shape,[o,i]=s.shape.slice(-2);if(!(t<=o))throw new Error(`bandPart(): numLower (${t}) must not be greater than the number of rows (${o}).`);if(!(e<=i))throw new Error(`bandPart(): numUpper (${e}) must not be greater than the number of columns (${i}).`);t<0&&(t=o),e<0&&(e=i);const a=M(Fa(0,o,1,"int32"),[-1,1]),c=Fa(0,i,1,"int32"),l=at(a,c),u=qn(Wr(l,ft(+t,"int32")),Vr(l,ft(-e,"int32"))),h=he([o,i],s.dtype);return M(Js(Er(M(s,[-1,o,i])).map(d=>Ue(u,d,h))),r)}const n2=F({bandPart_:e2});function s2(n){let t;if(Array.isArray(n)){t=!1,S(n!=null&&n.length>0,()=>"Gram-Schmidt process: input must not be null, undefined, or empty");const r=n[0].shape[0];for(let o=1;o<n.length;++o)S(n[o].shape[0]===r,()=>`Gram-Schmidt: Non-unique lengths found in the input vectors: (${n[o].shape[0]} vs. ${r})`)}else t=!0,n=Ye(n,n.shape[0],0).map(r=>Ri(r,[0]));S(n.length<=n[0].shape[0],()=>`Gram-Schmidt: Number of vectors (${n.length}) exceeds number of dimensions (${n[0].shape[0]}).`);const e=[],s=n;for(let r=0;r<n.length;++r)e.push(A.tidy(()=>{let o=s[r];if(r>0)for(let i=0;i<r;++i){const a=D(it(D(e[i],o)),e[i]);o=at(o,a)}return ut(o,il(o,"euclidean"))}));return t?Js(e,0):e}const r2=F({gramSchmidt_:s2});function o2(n,t=!1){if(S(n.rank>=2,()=>`qr() requires input tensor to have a rank >= 2, but got rank ${n.rank}`),n.rank===2)return df(n,t);{const e=n.shape.slice(0,n.shape.length-2).reduce((c,l)=>c*l),s=Er(M(n,[e,n.shape[n.shape.length-2],n.shape[n.shape.length-1]]),0),r=[],o=[];s.forEach(c=>{const[l,u]=df(c,t);r.push(l),o.push(u)});const i=M(Js(r,0),n.shape),a=M(Js(o,0),n.shape);return[i,a]}}function df(n,t=!1){return A.tidy(()=>{S(n.shape.length===2,()=>`qr2d() requires a 2D Tensor, but got a ${n.shape.length}D Tensor.`);const e=n.shape[0],s=n.shape[1];let r=Zg(e),o=zs(n);const i=ka([[1]],[1,1]);let a=zs(i);const c=e>=s?s:e;for(let l=0;l<c;++l){const u=o,h=a,d=r;[a,o,r]=A.tidy(()=>{const p=Ft(o,[l,l],[e-l,1]),f=il(p),m=Ft(o,[l,l],[1,1]),g=Ue(dn(m,0),ka([[-1]]),ka([[1]])),x=at(m,D(g,f)),b=ut(p,x);b.shape[0]===1?a=zs(i):a=Ce([i,Ft(b,[1,0],[b.shape[0]-1,b.shape[1]])],0);const w=qt(ut(Nt(g,x),f)),y=Ft(o,[l,0],[e-l,s]),I=D(w,a),C=Ct(a);if(l===0)o=at(y,Nt(I,Nt(C,y)));else{const $=at(y,Nt(I,Nt(C,y)));o=Ce([Ft(o,[0,0],[l,s]),$],0)}const N=Ct(I),T=Ft(r,[0,l],[e,r.shape[1]-l]);if(l===0)r=at(T,Nt(Nt(T,a),N));else{const $=at(T,Nt(Nt(T,a),N));r=Ce([Ft(r,[0,0],[e,l]),$],1)}return[a,o,r]}),It([u,h,d])}return!t&&e>s&&(r=Ft(r,[0,0],[e,s]),o=Ft(o,[0,0],[s,s])),[r,o]})}const i2=F({qr_:o2});var _e;(function(n){n[n.NONE=0]="NONE",n[n.MEAN=1]="MEAN",n[n.SUM=2]="SUM",n[n.SUM_BY_NONZERO_WEIGHTS=3]="SUM_BY_NONZERO_WEIGHTS"})(_e||(_e={}));function a2(n,t,e=_e.SUM_BY_NONZERO_WEIGHTS){const s=E(n,"losses","computeWeightedLoss");let r=null;t!=null&&(r=E(t,"weights","computeWeightedLoss"));const o=r==null?s:D(s,r);if(e===_e.NONE)return o;if(e===_e.SUM)return it(o);if(e===_e.MEAN){if(r==null)return Yt(o);{const i=s.size/r.size,a=ut(it(o),it(r));return i>1?ut(a,ft(i)):a}}if(e===_e.SUM_BY_NONZERO_WEIGHTS){if(r==null)return ut(it(o),ft(s.size));{const i=D(r,Is(s.shape)),a=nt(it(wo(i,ft(0))),"float32");return ut(it(o),a)}}throw Error(`Unknown reduction: ${e}`)}const Zn=F({computeWeightedLoss_:a2});function c2(n,t,e,s=_e.SUM_BY_NONZERO_WEIGHTS){const r=E(n,"labels","absoluteDifference"),o=E(t,"predictions","absoluteDifference");let i=null;e!=null&&(i=E(e,"weights","absoluteDifference")),un(r.shape,o.shape,"Error in absoluteDifference: ");const a=le(at(r,o));return Zn(a,i,s)}const l2=F({absoluteDifference_:c2});function u2(n,t,e,s,r=_e.SUM_BY_NONZERO_WEIGHTS){const o=E(n,"labels","cosineDistance"),i=E(t,"predictions","cosineDistance");let a=null;s!=null&&(a=E(s,"weights","cosineDistance")),un(o.shape,i.shape,"Error in cosineDistance: ");const c=ft(1),l=at(c,it(D(o,i),e,!0));return Zn(l,a,r)}const h2=F({cosineDistance_:u2});function d2(n,t,e,s=_e.SUM_BY_NONZERO_WEIGHTS){let r=E(n,"labels","hingeLoss");const o=E(t,"predictions","hingeLoss");let i=null;e!=null&&(i=E(e,"weights","hingeLoss")),un(r.shape,o.shape,"Error in hingeLoss: ");const a=ft(1);r=at(D(ft(2),r),a);const c=Yn(at(a,D(r,o)));return Zn(c,i,s)}const p2=F({hingeLoss_:d2});function f2(n,t,e,s=1,r=_e.SUM_BY_NONZERO_WEIGHTS){const o=E(n,"labels","huberLoss"),i=E(t,"predictions","huberLoss");let a=null;e!=null&&(a=E(e,"weights","huberLoss")),un(o.shape,i.shape,"Error in huberLoss: ");const c=ft(s),l=le(at(i,o)),u=cl(l,c),h=at(l,u),d=J(D(ft(.5),Lt(u)),D(c,h));return Zn(d,a,r)}const m2=F({huberLoss_:f2});function g2(n,t,e,s=1e-7,r=_e.SUM_BY_NONZERO_WEIGHTS){const o=E(n,"labels","logLoss"),i=E(t,"predictions","logLoss");let a=null;e!=null&&(a=E(e,"weights","logLoss")),un(o.shape,i.shape,"Error in logLoss: ");const c=ft(1),l=ft(s),u=qt(D(o,cn(J(i,l)))),h=D(at(c,o),cn(J(at(c,i),l))),d=at(u,h);return Zn(d,a,r)}const x2=F({logLoss_:g2});function b2(n,t,e,s=_e.SUM_BY_NONZERO_WEIGHTS){const r=E(n,"labels","meanSquaredError"),o=E(t,"predictions","meanSquaredError");let i=null;e!=null&&(i=E(e,"weights","meanSquaredError")),un(r.shape,o.shape,"Error in meanSquaredError: ");const a=hx(r,o);return Zn(a,i,s)}const y2=F({meanSquaredError_:b2});function w2(n,t){const e=E(n,"labels","sigmoidCrossEntropyWithLogits"),s=E(t,"logits","sigmoidCrossEntropyWithLogits");un(e.shape,s.shape,"Error in sigmoidCrossEntropyWithLogits: ");const r=Yn(s),o=D(s,e),i=nd(an(qt(le(s))));return J(at(r,o),i)}function I2(n,t,e,s=0,r=_e.SUM_BY_NONZERO_WEIGHTS){let o=E(n,"multiClassLabels","sigmoidCrossEntropy");const i=E(t,"logits","sigmoidCrossEntropy");let a=null;if(e!=null&&(a=E(e,"weights","sigmoidCrossEntropy")),un(o.shape,i.shape,"Error in sigmoidCrossEntropy: "),s>0){const l=ft(s),u=ft(1),h=ft(.5);o=J(D(o,at(u,l)),D(h,l))}const c=w2(o,i);return Zn(c,a,r)}const v2=F({sigmoidCrossEntropy_:I2});function C2(n,t,e=-1){if(e===-1&&(e=t.rank-1),e!==t.rank-1)throw Error(`Softmax cross entropy along a non-last dimension is not yet supported. Labels / logits was rank ${t.rank} and dim was ${e}`);return Ys((r,o,i)=>{const c=tx(o,[e],!0),l=at(nt(o,"float32"),c);i([r,l]);const u=qt(D(l,r));return{value:it(u,[e]),gradFunc:(p,f)=>{const[m,g]=f,x=Jt(p.shape,[e]);return[D(M(p,x),at(nt(m,"float32"),an(g))),D(M(p,x),at(an(g),nt(m,"float32")))]}}})(n,t)}function k2(n,t,e,s=0,r=_e.SUM_BY_NONZERO_WEIGHTS){let o=E(n,"onehotLabels","softmaxCrossEntropy");const i=E(t,"logits","softmaxCrossEntropy");let a=null;if(e!=null&&(a=E(e,"weights","softmaxCrossEntropy")),un(o.shape,i.shape,"Error in softmaxCrossEntropy: "),s>0){const l=ft(s),u=ft(1),h=ft(o.shape[1]);o=J(D(o,at(u,l)),ut(l,h))}const c=C2(o,i);return Zn(c,a,r)}const $2=F({softmaxCrossEntropy_:k2});function S2(n,t,e,s){const r=E(n,"indices","sparseFillEmptyRows","int32"),o=E(t,"values","sparseFillEmptyRows"),i=E(e,"denseShape","sparseFillEmptyRows","int32"),a=E(s,"defaultValue","sparseFillEmptyRows",o.dtype);if(r.rank!==2)throw new Error(`Indices should be Tensor2D but received shape
        ${r.shape}`);if(o.rank!==1)throw new Error(`Values should be Tensor1D but received shape ${o.shape}`);if(i.rank!==1)throw new Error(`Dense shape should be Tensor1D but received shape ${i.shape}`);if(a.rank!==0)throw new Error(`Default value should be a scalar but received shape ${a.shape}`);const c={indices:r,values:o,denseShape:i,defaultValue:a},l=A.runKernel(kh,c);return{outputIndices:l[0],outputValues:l[1],emptyRowIndicator:l[2],reverseIndexMap:l[3]}}const N2=F({sparseFillEmptyRows_:S2});function T2(n,t,e){const s=E(n,"inputIndices","sparseReshape","int32"),r=E(t,"inputShape","sparseReshape","int32"),o=E(e,"newShape","sparseReshape","int32");if(s.rank!==2)throw new Error(`Input indices should be Tensor2D but received shape
        ${s.shape}`);if(r.rank!==1)throw new Error(`Input shape should be Tensor1D but received shape ${r.shape}`);if(o.rank!==1)throw new Error(`New shape should be Tensor1D but received shape ${o.shape}`);const i={inputIndices:s,inputShape:r,newShape:o},a=A.runKernel($h,i);return{outputIndices:a[0],outputShape:a[1]}}const E2=F({sparseReshape_:T2});function R2(n,t,e){const s=E(n,"data","sparseSegmentMean"),r=E(t,"indices","sparseSegmentMean","int32"),o=E(e,"segmentIds","sparseSegmentMean","int32");if(s.rank<1)throw new Error("Data should be at least 1 dimensional but received scalar");if(r.rank!==1)throw new Error(`Indices should be Tensor1D but received shape
          ${r.shape}`);if(o.rank!==1)throw new Error(`Segment ids should be Tensor1D but received shape
          ${o.shape}`);const i={data:s,indices:r,segmentIds:o};return A.runKernel(Sh,i)}const D2=F({sparseSegmentMean_:R2});function A2(n,t,e){const s=E(n,"data","sparseSegmentSum"),r=E(t,"indices","sparseSegmentSum","int32"),o=E(e,"segmentIds","sparseSegmentSum","int32");if(s.rank<1)throw new Error("Data should be at least 1 dimensional but received scalar");if(r.rank!==1)throw new Error(`Indices should be Tensor1D but received shape
         ${r.shape}`);if(o.rank!==1)throw new Error(`Segment ids should be Tensor1D but received shape
         ${o.shape}`);const i={data:s,indices:r,segmentIds:o};return A.runKernel(Nh,i)}const F2=F({sparseSegmentSum_:A2});function O2(n,t,e,s,r,o,i,a){const c=E(n,"data","stringNGrams","string");if(c.dtype!=="string")throw new Error("Data must be of datatype string");if(c.shape.length!==1)throw new Error(`Data must be a vector, saw: ${c.shape}`);const l=E(t,"dataSplits","stringNGrams");if(l.dtype!=="int32")throw new Error("Data splits must be of datatype int32");const u={separator:e,nGramWidths:s,leftPad:r,rightPad:o,padWidth:i,preserveShortSequences:a},h={data:c,dataSplits:l},d=A.runKernel(Rh,h,u);return{nGrams:d[0],nGramsSplits:d[1]}}const _2=F({stringNGrams_:O2});function M2(n,t,e=!0){const s=E(n,"input","stringSplit","string"),r=E(t,"delimiter","stringSplit","string");if(s.rank!==1)throw new Error(`Input should be Tensor1D but received shape ${s.shape}`);if(r.rank!==0)throw new Error(`Delimiter should be a scalar but received shape ${r.shape}`);const o={skipEmpty:e},i={input:s,delimiter:r},a=A.runKernel(Dh,i,o);return{indices:a[0],values:a[1],shape:a[2]}}const L2=F({stringSplit_:M2});function P2(n,t){const e=E(n,"input","stringToHashBucketFast","string"),s={numBuckets:t};if(t<=0)throw new Error("Number of buckets must be at least 1");const r={input:e};return A.runKernel(Ah,r,s)}const B2=F({stringToHashBucketFast_:P2});const g6={fft:pd,ifft:_a,rfft:fd,irfft:ux},x6={hammingWindow:xS,hannWindow:gx,frame:xx,stft:IS},ta={flipLeftRight:$S,grayscaleToRGB:NS,resizeNearestNeighbor:yx,resizeBilinear:bx,rotateWithOffset:ES,cropAndResize:CS,nonMaxSuppression:DS,nonMaxSuppressionAsync:BS,nonMaxSuppressionWithScore:VS,nonMaxSuppressionWithScoreAsync:US,nonMaxSuppressionPadded:HS,nonMaxSuppressionPaddedAsync:KS,threshold:JS,transform:t2},z2={bandPart:n2,gramSchmidt:r2,qr:i2},b6={absoluteDifference:l2,computeWeightedLoss:Zn,cosineDistance:h2,hingeLoss:p2,huberLoss:m2,logLoss:x2,meanSquaredError:y2,sigmoidCrossEntropy:v2,softmaxCrossEntropy:$2},y6={sparseFillEmptyRows:N2,sparseReshape:E2,sparseSegmentMean:D2,sparseSegmentSum:F2},w6={stringNGrams:_2,stringSplit:L2,stringToHashBucketFast:B2};class vs extends Br{minimize(t,e=!1,s){const{value:r,grads:o}=this.computeGradients(t,s);if(s!=null){const i=s.map(a=>({name:a.name,tensor:o[a.name]}));this.applyGradients(i)}else this.applyGradients(o);return It(o),e?r:(r.dispose(),null)}get iterations(){return this.iterations_==null&&(this.iterations_=0),this.iterations_}incrementIterations(){this.iterations_=this.iterations+1}computeGradients(t,e){return xk(t,e)}dispose(){this.iterations_!=null&&It(this.iterations_)}async saveIterations(){return this.iterations_==null&&(this.iterations_=0),{name:"iter",tensor:ft(this.iterations_,"int32")}}async getWeights(){throw new Error("getWeights() is not implemented for this optimizer yet.")}async setWeights(t){throw new Error(`setWeights() is not implemented for this optimizer class ${this.getClassName()}`)}async extractIterations(t){return this.iterations_=(await t[0].tensor.data())[0],t.slice(1)}}Object.defineProperty(vs,Symbol.hasInstance,{value:n=>n.minimize!=null&&n.computeGradients!=null&&n.applyGradients!=null});class kd extends vs{constructor(t,e,s=null){super(),this.learningRate=t,this.rho=e,this.epsilon=s,this.accumulatedGrads=[],this.accumulatedUpdates=[],s==null&&(this.epsilon=A.backend.epsilon())}applyGradients(t){(Array.isArray(t)?t.map(s=>s.name):Object.keys(t)).forEach((s,r)=>{const o=A.registeredVariables[s],i=!1;this.accumulatedGrads[r]==null&&(this.accumulatedGrads[r]={originalName:`${s}/accum_grad`,variable:z(()=>$t(o).variable(i))}),this.accumulatedUpdates[r]==null&&(this.accumulatedUpdates[r]={originalName:`${s}/accum_var`,variable:z(()=>$t(o).variable(i))});const a=Array.isArray(t)?t[r].tensor:t[s];if(a==null)return;const c=this.accumulatedGrads[r].variable,l=this.accumulatedUpdates[r].variable;z(()=>{const u=J(D(c,this.rho),D(Lt(a),1-this.rho)),h=D(ut(Ee(J(l,this.epsilon)),Ee(J(c,this.epsilon))),a),d=J(D(l,this.rho),D(Lt(h),1-this.rho));c.assign(u),l.assign(d);const p=J(D(h,-this.learningRate),o);o.assign(p)})}),this.incrementIterations()}dispose(){this.accumulatedUpdates!=null&&(It(this.accumulatedGrads.map(t=>t.variable)),It(this.accumulatedUpdates.map(t=>t.variable)))}async getWeights(){const t=[...this.accumulatedGrads,...this.accumulatedUpdates];return[await this.saveIterations()].concat(t.map(e=>({name:e.originalName,tensor:e.variable})))}async setWeights(t){t=await this.extractIterations(t);const e=t.length/2,s=!1;this.accumulatedGrads=t.slice(0,e).map(r=>({originalName:r.name,variable:r.tensor.variable(s)})),this.accumulatedUpdates=t.slice(e,e*2).map(r=>({originalName:r.name,variable:r.tensor.variable(s)}))}getConfig(){return{learningRate:this.learningRate,rho:this.rho,epsilon:this.epsilon}}static fromConfig(t,e){return new t(e.learningRate,e.rho,e.epsilon)}}kd.className="Adadelta";X(kd);class $d extends vs{constructor(t,e=.1){super(),this.learningRate=t,this.initialAccumulatorValue=e,this.accumulatedGrads=[]}applyGradients(t){(Array.isArray(t)?t.map(s=>s.name):Object.keys(t)).forEach((s,r)=>{const o=A.registeredVariables[s];this.accumulatedGrads[r]==null&&(this.accumulatedGrads[r]={originalName:`${s}/accumulator`,variable:z(()=>Ti(o.shape,this.initialAccumulatorValue).variable(!1))});const i=Array.isArray(t)?t[r].tensor:t[s];if(i==null)return;const a=this.accumulatedGrads[r].variable;z(()=>{const c=J(a,Lt(i));a.assign(c);const l=J(D(ut(i,Ee(J(c,A.backend.epsilon()))),-this.learningRate),o);o.assign(l)})}),this.incrementIterations()}dispose(){this.accumulatedGrads!=null&&It(this.accumulatedGrads.map(t=>t.variable))}async getWeights(){return[await this.saveIterations()].concat(this.accumulatedGrads.map(t=>({name:t.originalName,tensor:t.variable})))}async setWeights(t){t=await this.extractIterations(t);const e=!1;this.accumulatedGrads=t.map(s=>({originalName:s.name,variable:s.tensor.variable(e)}))}getConfig(){return{learningRate:this.learningRate,initialAccumulatorValue:this.initialAccumulatorValue}}static fromConfig(t,e){return new t(e.learningRate,e.initialAccumulatorValue)}}$d.className="Adagrad";X($d);class Sd extends vs{constructor(t,e,s,r=null){super(),this.learningRate=t,this.beta1=e,this.beta2=s,this.epsilon=r,this.accumulatedFirstMoment=[],this.accumulatedSecondMoment=[],z(()=>{this.accBeta1=ft(e).variable(),this.accBeta2=ft(s).variable()}),r==null&&(this.epsilon=A.backend.epsilon())}applyGradients(t){const e=Array.isArray(t)?t.map(s=>s.name):Object.keys(t);z(()=>{const s=at(1,this.accBeta1),r=at(1,this.accBeta2);e.forEach((o,i)=>{const a=A.registeredVariables[o],c=!1;this.accumulatedFirstMoment[i]==null&&(this.accumulatedFirstMoment[i]={originalName:`${o}/m`,variable:z(()=>$t(a).variable(c))}),this.accumulatedSecondMoment[i]==null&&(this.accumulatedSecondMoment[i]={originalName:`${o}/v`,variable:z(()=>$t(a).variable(c))});const l=Array.isArray(t)?t[i].tensor:t[o];if(l==null)return;const u=this.accumulatedFirstMoment[i].variable,h=this.accumulatedSecondMoment[i].variable,d=J(D(u,this.beta1),D(l,1-this.beta1)),p=J(D(h,this.beta2),D(Lt(l),1-this.beta2)),f=ut(d,s),m=ut(p,r);u.assign(d),h.assign(p);const g=J(D(ut(f,J(Ee(m),this.epsilon)),-this.learningRate),a);a.assign(g)}),this.accBeta1.assign(D(this.accBeta1,this.beta1)),this.accBeta2.assign(D(this.accBeta2,this.beta2))}),this.incrementIterations()}dispose(){this.accBeta1.dispose(),this.accBeta2.dispose(),this.accumulatedFirstMoment!=null&&It(this.accumulatedFirstMoment.map(t=>t.variable)),this.accumulatedSecondMoment!=null&&It(this.accumulatedSecondMoment.map(t=>t.variable))}async getWeights(){const t=[...this.accumulatedFirstMoment,...this.accumulatedSecondMoment];return[await this.saveIterations()].concat(t.map(e=>({name:e.originalName,tensor:e.variable})))}async setWeights(t){t=await this.extractIterations(t),z(()=>{this.accBeta1.assign(Tr(this.beta1,this.iterations_+1)),this.accBeta2.assign(Tr(this.beta2,this.iterations_+1))});const e=t.length/2,s=!1;this.accumulatedFirstMoment=t.slice(0,e).map(r=>({originalName:r.name,variable:r.tensor.variable(s)})),this.accumulatedSecondMoment=t.slice(e,e*2).map(r=>({originalName:r.name,variable:r.tensor.variable(s)}))}getConfig(){return{learningRate:this.learningRate,beta1:this.beta1,beta2:this.beta2,epsilon:this.epsilon}}static fromConfig(t,e){return new t(e.learningRate,e.beta1,e.beta2,e.epsilon)}}Sd.className="Adam";X(Sd);class Nd extends vs{constructor(t,e,s,r=null,o=0){super(),this.learningRate=t,this.beta1=e,this.beta2=s,this.epsilon=r,this.decay=o,this.accumulatedFirstMoment=[],this.accumulatedWeightedInfNorm=[],z(()=>{this.iteration=ft(0).variable(),this.accBeta1=ft(e).variable()}),r==null&&(this.epsilon=A.backend.epsilon())}applyGradients(t){const e=Array.isArray(t)?t.map(s=>s.name):Object.keys(t);z(()=>{const s=at(1,this.accBeta1),r=ut(-this.learningRate,J(D(this.iteration,this.decay),1));e.forEach((o,i)=>{const a=A.registeredVariables[o],c=!1;this.accumulatedFirstMoment[i]==null&&(this.accumulatedFirstMoment[i]={originalName:`${o}/m`,variable:$t(a).variable(c)}),this.accumulatedWeightedInfNorm[i]==null&&(this.accumulatedWeightedInfNorm[i]={originalName:`${o}/v`,variable:$t(a).variable(c)});const l=Array.isArray(t)?t[i].tensor:t[o];if(l==null)return;const u=this.accumulatedFirstMoment[i].variable,h=this.accumulatedWeightedInfNorm[i].variable,d=J(D(u,this.beta1),D(l,1-this.beta1)),p=D(h,this.beta2),f=le(l),m=ws(p,f);u.assign(d),h.assign(m);const g=J(D(ut(r,s),ut(d,J(m,this.epsilon))),a);a.assign(g)}),this.iteration.assign(J(this.iteration,1)),this.accBeta1.assign(D(this.accBeta1,this.beta1))}),this.incrementIterations()}dispose(){this.accBeta1.dispose(),this.iteration.dispose(),this.accumulatedFirstMoment!=null&&It(this.accumulatedFirstMoment.map(t=>t.variable)),this.accumulatedWeightedInfNorm!=null&&It(this.accumulatedWeightedInfNorm.map(t=>t.variable))}async getWeights(){throw new Error("getWeights() is not implemented for Adamax yet.")}async setWeights(t){throw new Error("setWeights() is not implemented for Adamax yet.")}getConfig(){return{learningRate:this.learningRate,beta1:this.beta1,beta2:this.beta2,epsilon:this.epsilon,decay:this.decay}}static fromConfig(t,e){return new t(e.learningRate,e.beta1,e.beta2,e.epsilon,e.decay)}}Nd.className="Adamax";X(Nd);class hl extends vs{constructor(t){super(),this.learningRate=t,this.setLearningRate(t)}applyGradients(t){(Array.isArray(t)?t.map(s=>s.name):Object.keys(t)).forEach((s,r)=>{const o=Array.isArray(t)?t[r].tensor:t[s];if(o==null)return;const i=A.registeredVariables[s];z(()=>{const a=J(D(this.c,o),i);i.assign(a)})}),this.incrementIterations()}setLearningRate(t){this.learningRate=t,this.c!=null&&this.c.dispose(),this.c=Mn(ft(-t))}dispose(){this.c.dispose()}async getWeights(){return[await this.saveIterations()]}async setWeights(t){if(t=await this.extractIterations(t),t.length!==0)throw new Error("SGD optimizer does not have settable weights.")}getConfig(){return{learningRate:this.learningRate}}static fromConfig(t,e){return new t(e.learningRate)}}hl.className="SGD";X(hl);class Td extends hl{constructor(t,e,s=!1){super(t),this.learningRate=t,this.momentum=e,this.useNesterov=s,this.accumulations=[],this.m=ft(this.momentum)}applyGradients(t){(Array.isArray(t)?t.map(s=>s.name):Object.keys(t)).forEach((s,r)=>{const o=A.registeredVariables[s];this.accumulations[r]==null&&(this.accumulations[r]={originalName:`${s}/momentum`,variable:z(()=>$t(o).variable(!1))});const i=this.accumulations[r].variable,a=Array.isArray(t)?t[r].tensor:t[s];a!=null&&z(()=>{let c;const l=J(D(this.m,i),a);this.useNesterov?c=J(D(this.c,J(a,D(l,this.m))),o):c=J(D(this.c,l),o),i.assign(l),o.assign(c)})}),this.incrementIterations()}dispose(){this.m.dispose(),this.accumulations!=null&&It(this.accumulations.map(t=>t.variable))}setMomentum(t){this.momentum=t}async getWeights(){return[await this.saveIterations()].concat(this.accumulations.map(t=>({name:t.originalName,tensor:t.variable})))}async setWeights(t){t=await this.extractIterations(t);const e=!1;this.accumulations=t.map(s=>({originalName:s.name,variable:s.tensor.variable(e)}))}getConfig(){return{learningRate:this.learningRate,momentum:this.momentum,useNesterov:this.useNesterov}}static fromConfig(t,e){return new t(e.learningRate,e.momentum,e.useNesterov)}}Td.className="Momentum";X(Td);class Ed extends vs{constructor(t,e=.9,s=0,r=null,o=!1){if(super(),this.learningRate=t,this.decay=e,this.momentum=s,this.epsilon=r,this.accumulatedMeanSquares=[],this.accumulatedMoments=[],this.accumulatedMeanGrads=[],this.centered=o,r==null&&(this.epsilon=A.backend.epsilon()),t==null)throw new Error("learningRate for RMSPropOptimizer must be defined.")}applyGradients(t){(Array.isArray(t)?t.map(s=>s.name):Object.keys(t)).forEach((s,r)=>{const o=A.registeredVariables[s],i=!1;this.accumulatedMeanSquares[r]==null&&(this.accumulatedMeanSquares[r]={originalName:`${s}/rms`,variable:z(()=>$t(o).variable(i))}),this.accumulatedMoments[r]==null&&(this.accumulatedMoments[r]={originalName:`${s}/momentum`,variable:z(()=>$t(o).variable(i))}),this.accumulatedMeanGrads[r]==null&&this.centered&&(this.accumulatedMeanGrads[r]={originalName:`${s}/mg`,variable:z(()=>$t(o).variable(i))});const a=Array.isArray(t)?t[r].tensor:t[s];if(a==null)return;const c=this.accumulatedMeanSquares[r].variable,l=this.accumulatedMoments[r].variable;z(()=>{const u=J(D(c,this.decay),D(Lt(a),1-this.decay));if(this.centered){const h=this.accumulatedMeanGrads[r].variable,d=J(D(h,this.decay),D(a,1-this.decay)),p=ut(D(a,this.learningRate),Ee(at(u,J(Lt(d),this.epsilon)))),f=J(D(l,this.momentum),p);c.assign(u),h.assign(d),l.assign(f);const m=at(o,f);o.assign(m)}else{const h=J(D(c,this.decay),D(Lt(a),1-this.decay)),d=J(D(l,this.momentum),ut(D(a,this.learningRate),Ee(J(h,this.epsilon))));c.assign(h),l.assign(d);const p=at(o,d);o.assign(p)}})}),this.incrementIterations()}dispose(){this.accumulatedMeanSquares!=null&&It(this.accumulatedMeanSquares.map(t=>t.variable)),this.accumulatedMeanGrads!=null&&this.centered&&It(this.accumulatedMeanGrads.map(t=>t.variable)),this.accumulatedMoments!=null&&It(this.accumulatedMoments.map(t=>t.variable))}async getWeights(){const t=[...this.accumulatedMeanSquares,...this.accumulatedMoments];return this.centered&&t.push(...this.accumulatedMeanGrads),[await this.saveIterations()].concat(t.map(e=>({name:e.originalName,tensor:e.variable})))}async setWeights(t){t=await this.extractIterations(t);const e=this.centered?t.length/3:t.length/2,s=!1;this.accumulatedMeanSquares=t.slice(0,e).map(r=>({originalName:r.name,variable:r.tensor.variable(s)})),this.accumulatedMoments=t.slice(e,e*2).map(r=>({originalName:r.name,variable:r.tensor.variable(s)})),this.centered&&(this.accumulatedMeanGrads=t.slice(e*2,e*3).map(r=>({originalName:r.name,variable:r.tensor.variable(s)})))}getConfig(){return{learningRate:this.learningRate,decay:this.decay,momentum:this.momentum,epsilon:this.epsilon,centered:this.centered}}static fromConfig(t,e){return new t(e.learningRate,e.decay,e.momentum,e.epsilon,e.centered)}}Ed.className="RMSProp";X(Ed);class Ts{static sgd(t){return new hl(t)}static momentum(t,e,s=!1){return new Td(t,e,s)}static rmsprop(t,e=.9,s=0,r=null,o=!1){return new Ed(t,e,s,r,o)}static adam(t=.001,e=.9,s=.999,r=null){return new Sd(t,e,s,r)}static adadelta(t=.001,e=.95,s=null){return new kd(t,e,s)}static adamax(t=.002,e=.9,s=.999,r=null,o=0){return new Nd(t,e,s,r,o)}static adagrad(t,e=.1){return new $d(t,e)}}const lr={sgd:Ts.sgd,momentum:Ts.momentum,adadelta:Ts.adadelta,adagrad:Ts.adagrad,rmsprop:Ts.rmsprop,adamax:Ts.adamax,adam:Ts.adam};const V2=typeof requestAnimationFrame<"u"?requestAnimationFrame:typeof setImmediate<"u"?setImmediate:n=>n();function wx(){return new Promise(n=>V2(()=>n()))}function Rd(n,t){const e=n[0].length;n.forEach((r,o)=>{S(r.length===e,()=>`Error in concat${e}D: rank of tensors[${o}] must be the same as the rank of the rest (${e})`)}),S(t>=0&&t<e,()=>`Error in concat${e}D: axis must be between 0 and ${e-1}.`);const s=n[0];n.forEach((r,o)=>{for(let i=0;i<e;i++)S(i===t||r[i]===s[i],()=>`Error in concat${e}D: Shape of tensors[${o}] (${r}) does not match the shape of the rest (${s}) along the non-concatenated axis ${o}.`)})}function Fn(n,t){const e=n[0].slice();for(let s=1;s<n.length;s++)e[t]+=n[s][t];return e}var bn;(function(n){n[n.FIRST_DIM_SIZE=0]="FIRST_DIM_SIZE",n[n.VALUE_ROWIDS=1]="VALUE_ROWIDS",n[n.ROW_LENGTHS=2]="ROW_LENGTHS",n[n.ROW_SPLITS=3]="ROW_SPLITS",n[n.ROW_LIMITS=4]="ROW_LIMITS",n[n.ROW_STARTS=5]="ROW_STARTS"})(bn||(bn={}));function Ix(n,t,e){let s=new Array;if(e==null&&t==null)return s;if(t==null)for(;s.length<n+e.length;)s.push(-1);else s=t.slice();if(e==null)return s;if(n+e.length!==s.length)throw new Error(`rt input.shape and shape=${t} are incompatible: rt input.rank = ${n+e.length}, but shape.rank = ${s.length}`);for(let r=1;r<e.length;++r){const o=e[r],i=s[s.length-e.length+r],a=s[i];if(o>=0)if(a>=0){if(a!==o)throw new Error(`rt input.shape and shape=${t} are incompatible: rt input.shape[${r+n}] = ${o} but shape[${r+n}] = ${a}`)}else s[i]=o}return s}function vx(n){const t={FIRST_DIM_SIZE:bn.FIRST_DIM_SIZE,VALUE_ROWIDS:bn.VALUE_ROWIDS,ROW_LENGTHS:bn.ROW_LENGTHS,ROW_SPLITS:bn.ROW_SPLITS,ROW_LIMITS:bn.ROW_LIMITS,ROW_STARTS:bn.ROW_STARTS},e=[];for(const s of n)if(s in t)e.push(t[s]);else break;return e}function Cx(n){return n.length===0?0:n[0]===bn.FIRST_DIM_SIZE?n.length-1:n.length}function kx(n,t){if(n==null||t==null)return;const e=n.length,s=t.length;if(e>=s)throw new Error(`defaultValue.shape=${n} and ragged tensor flatValues.shape=${t}, are incompatible: defaultValue.rank = ${e} must be less than ragged tensor input flatValues.rank = ${s})`);for(let r=0;r<Math.min(e,s-1);++r){const o=n[r],i=t[r+1];if(o>=0&&i>=0&&o!==1&&o!==i)throw new Error(`defaultValue.shape=${n}, and ragged tensor input flatValues.shape=${t} are incompatible: defaultValue.shape[${r-n.length}] = ${o} but ragged tensor input.flatValues.shape[${r-n.length}] = ${i}`)}}const Dd=30;function dl(n){return n<=Dd?n:au(n,Math.floor(Math.sqrt(n)))}function Ad(n,t,e){const s=e*(typeof n=="number"?n:n[0]),r=t*(typeof n=="number"?n:n[1]);return[s,r]}function Ai(n,t,e,s=!0){let r=[];if(s)r=r.concat(t.slice(0)),r.push(n[0]/e),r=r.concat(n.slice(1));else{r=r.concat(n[0]);const o=t.length;for(let i=0;i<o;++i)r=r.concat([n[i+1]/t[i],t[i]]);r=r.concat(n.slice(o+1))}return r}function Fi(n,t,e=!0){const s=[];if(e){s.push(t);for(let r=t+1;r<n;++r)r<=2*t?(s.push(r),s.push(r-(t+1))):s.push(r)}else{const r=[],o=[];for(let i=1;i<n;++i)i>=t*2+1||i%2===1?o.push(i):r.push(i);s.push(...r),s.push(0),s.push(...o)}return s}function Oi(n,t,e,s=!0){const r=[];s?r.push(n[0]/e):r.push(n[0]*e);for(let o=1;o<n.length;++o)o<=t.length?s?r.push(t[o-1]*n[o]):r.push(n[o]/t[o-1]):r.push(n[o]);return r}function Fd(n,t){const e=[0];for(let s=0;s<t;++s)e.push(n[s][0]);return e}function Od(n,t,e){const s=n.slice(0,1);for(let r=0;r<e;++r)s.push(n[r+1]-t[r][0]-t[r][1]);return s}const pl=1.7580993408473768,fl=1.0507009873554805;const _d=.3275911,Md=.254829592,Ld=-.284496736,Pd=1.421413741,Bd=-1.453152027,zd=1.061405429;function Kn(n,t){if(n.length!==t.length)throw new Error(`Cannot merge real and imag arrays of different lengths. real:${n.length}, imag: ${t.length}.`);const e=new Float32Array(n.length*2);for(let s=0;s<e.length;s+=2)e[s]=n[s/2],e[s+1]=t[s/2];return e}function $x(n){const t=new Float32Array(n.length/2),e=new Float32Array(n.length/2);for(let s=0;s<n.length;s+=2)t[s/2]=n[s],e[s/2]=n[s+1];return{real:t,imag:e}}function Sx(n){const t=Math.ceil(n.length/4),e=new Float32Array(t),s=new Float32Array(t);for(let r=0;r<n.length;r+=4)e[Math.floor(r/4)]=n[r],s[Math.floor(r/4)]=n[r+1];return{real:e,imag:s}}function Nx(n){const t=Math.floor(n.length/4),e=new Float32Array(t),s=new Float32Array(t);for(let r=2;r<n.length;r+=4)e[Math.floor(r/4)]=n[r],s[Math.floor(r/4)]=n[r+1];return{real:e,imag:s}}function Vd(n,t){const e=n[t*2],s=n[t*2+1];return{real:e,imag:s}}function Tx(n,t,e,s){n[s*2]=t,n[s*2+1]=e}function Ex(n,t){const e=new Float32Array(n/2),s=new Float32Array(n/2);for(let r=0;r<Math.ceil(n/2);r++){const o=(t?2:-2)*Math.PI*(r/n);e[r]=Math.cos(o),s[r]=Math.sin(o)}return{real:e,imag:s}}function Rx(n,t,e){const s=(e?2:-2)*Math.PI*(n/t),r=Math.cos(s),o=Math.sin(s);return{real:r,imag:o}}const Vl="->",W2=/->/g,pf=",",ff="...";function Wd(n,t){n=n.replace(/\s/g,"");const e=(n.length-n.replace(W2,"").length)/Vl.length;if(e<1)throw new Error("Equations without an arrow are not supported.");if(e>1)throw new Error(`Equation must contain exactly one arrow ("${Vl}").`);const[s,r]=n.split(Vl);S(s.indexOf(ff)===-1,()=>`The ellipsis notation ("${ff}") is not supported yet.`);const o=s.split(pf),i=o.length;if(t!==i)throw new Error(`Expected ${i} input tensors, received ${t}`);if(i>2)throw new Error("Support for more than 2 input tensors is not implemented yet.");const a=[];for(let d=0;d<r.length;++d){const p=r[d];if(!o.some(f=>f.indexOf(p)!==-1))throw new Error(`Output subscripts contain the label ${p} not present in the input subscripts.`);a.indexOf(p)===-1&&a.push(p)}for(let d=0;d<s.length;++d){const p=s[d];a.indexOf(p)===-1&&p!==pf&&a.push(p)}const c=new Array(o.length);for(let d=0;d<i;++d){if(new Set(o[d].split("")).size!==o[d].length)throw new Error(`Found duplicate axes in input component ${o[d]}. Support for duplicate axes in input is not implemented yet.`);c[d]=[];for(let p=0;p<o[d].length;++p)c[d].push(a.indexOf(o[d][p]))}const l=a.length,u=r.length,h=[];for(let d=u;d<l;++d)h.push(d);return{allDims:a,summedDims:h,idDims:c}}function Ud(n,t){let e=new Array(n);e.fill(-1);for(let r=0;r<t.length;++r)e[t[r]]=r;const s=[];for(let r=0;r<n;++r)e[r]===-1&&s.push(r);return e=e.filter(r=>r!==-1),{permutationIndices:e,expandDims:s}}function Gd(n,t,e){const s=new Array(n);for(let r=0;r<e.length;++r){const o=e[r].shape;for(let i=0;i<t[r].length;++i)s[t[r][i]]===void 0?s[t[r][i]]=o[i]:S(s[t[r][i]]===o[i],()=>`Expected dimension ${s[t[r][i]]} at axis ${i} of input shaped ${JSON.stringify(o)}, but got dimension ${o[i]}`)}}function Hd(n,t){const e=n,s=[];let r=0;n.length===0&&e.push(-1),r=n.length+1;for(let i=0;i<r;++i)s.push([]);const o=[];for(let i=0;i<e.length;++i){const a=e[i],c=U2(t,a);for(const l of c)o.indexOf(l)===-1&&(s[i].push(l),o.push(l))}return{path:e,steps:s}}function qd(n){return n.every((t,e)=>t===e)}function U2(n,t){const e=[];for(let s=0;s<n.length;++s)(n[s].length===0||n[s].indexOf(t)!==-1||t===-1)&&e.push(s);return e}function Kd(n,t,e=0){let s=[];if(typeof t=="number")S(n.shape[e]%t===0,()=>"Number of splits must evenly divide the axis."),s=new Array(t).fill(n.shape[e]/t);else{const r=t.reduce((i,a)=>(a===-1&&(i+=1),i),0);S(r<=1,()=>"There should be only one negative value in split array.");const o=t.indexOf(-1);if(o!==-1){const i=t.reduce((a,c)=>c>0?a+c:a);t[o]=n.shape[e]-i}S(n.shape[e]===t.reduce((i,a)=>i+a),()=>"The sum of sizes must match the size of the axis dimension."),s=t}return s}function Dx(n){return`Received SparseTensor with denseShape[0] = 0 but
  indices.shape[0] = ${n}`}function Ax(n,t){return`indices(${n}, 0) is invalid: ${t} < 0`}function Fx(n,t,e){return`indices(${n}, 0) is invalid: ${t} >= ${e}`}function Ox(n,t){return`only one output dimension may be -1, not both ${n} and ${t}`}function _x(n,t){return`size ${n} must be non-negative, not ${t}`}function Mx(){return"reshape cannot infer the missing input size for an empty tensor unless all specified input sizes are non-zero"}function Lx(n,t){const e=q(n),s=q(t);return`Input to reshape is a SparseTensor with ${e}
  dense values, but the requested shape requires a multiple of ${s}. inputShape=${n} outputShape= ${t}`}function Px(n,t){const e=q(n),s=q(t);return`Input to reshape is a tensor with ${e} dense values, but the requested shape has ${s}. inputShape=${n} outputShape=${t}`}function ku(){return"segment ids must be >= 0"}function Bx(){return"segment ids are not increasing"}function zx(n,t){return`Segment id ${n} out of range [0, ${t}), possibly because segmentIds input is not sorted.`}function Vx(n,t,e){return`Bad: indices[${n}] == ${t} out of range [0, ${e})`}function Wx(n,t){let e=!1,s;for(n<=Dd?(s=n,e=!0):s=au(n,Math.floor(Math.sqrt(n)));!e;)s>t||s===n?e=!0:s=au(n,s+1);return s}function Ux(n,t,e){const s=[],r=n.length;for(let o=0;o<r;o++)o!==t?s.push(n[o]):s.push(e);return s}function jd(n,t,e,s){const r=t.shape.length,o=n.shape.length;if(s!==0&&(s<-r||s>r))throw new Error(`Expect batchDims in the range of [-${r}, ${r}], but got ${s}`);if(s<0&&(s+=r),s>o)throw new Error(`batchDims (${s}) must be less than rank(x) (
    ${o}).`);if(e<s)throw new Error(`batchDims (${s}) must be less than or equal to axis (${e}).`);for(let h=0;h<s;++h)if(n.shape[h]!==t.shape[h])throw new Error(`x.shape[${h}]: ${n.shape[h]} should be equal to indices.shape[${h}]: ${t.shape[h]}.`);const i=n.shape[e],a=[];let c=1,l=1,u=1;for(let h=0;h<s;++h)a.push(n.shape[h]),c*=n.shape[h];for(let h=s;h<e;h++)a.push(n.shape[h]),l*=n.shape[h];for(let h=s;h<r;h++)a.push(t.shape[h]);for(let h=e+1;h<o;h++)a.push(n.shape[h]),u*=n.shape[h];return{batchSize:c,sliceSize:u,outerSize:l,dimSize:i,outputShape:a}}const G2=Object.freeze(Object.defineProperty({__proto__:null,collectGatherOpShapeInfo:jd,computeOutShape:Ux,segOpComputeOptimalWindowSize:Wx},Symbol.toStringTag,{value:"Module"}));function Qs(n){try{return n.map(t=>us(t))}catch(t){throw new Error(`Failed to decode encoded string bytes into utf-8, error: ${t}`)}}function Gx(n){return n.map(t=>as(t))}const H2=Object.freeze(Object.defineProperty({__proto__:null,ERF_A1:Md,ERF_A2:Ld,ERF_A3:Pd,ERF_A4:Bd,ERF_A5:zd,ERF_P:_d,PARALLELIZE_THRESHOLD:Dd,get RowPartitionType(){return bn},SELU_SCALE:fl,SELU_SCALEALPHA:pl,applyActivation:bd,assertAndGetBroadcastShape:mt,assertAxesAreInnerMostDims:we,assertParamsConsistent:Rd,assignToTypedArray:Tx,axesAreInnerMostDims:Qh,calculateShapes:Si,checkEinsumDimSizes:Gd,checkPadOnDimRoundingMode:Le,combineLocations:Xg,combineRaggedTensorToTensorShapes:Ix,complexWithEvenIndex:Sx,complexWithOddIndex:Nx,computeConv2DInfo:ye,computeConv3DInfo:bs,computeDefaultPad:qh,computeDilation2DInfo:Ni,computeOptimalWindowSize:dl,computeOutAndReduceShapes:fe,computeOutShape:Fn,computePool2DInfo:hn,computePool3DInfo:jn,convertConv2DDataFormat:Xn,decodeEinsumEquation:Wd,eitherStridesOrDilationsAreOne:$e,expandShapeToKeepDim:Jt,exponent:Rx,exponents:Ex,fromStringArrayToUint8:Gx,fromUint8ToStringArray:Qs,getAxesPermutation:Kt,getBroadcastDims:Nr,getComplexWithIndex:Vd,getEinsumComputePath:Hd,getEinsumPermutation:Ud,getFusedBiasGradient:xd,getFusedDyActivation:gd,getImageCenter:Ad,getInnerMostAxes:Qt,getPermuted:Fi,getRaggedRank:Cx,getReductionAxes:ce,getReshaped:Ai,getReshapedPermuted:Oi,getRowPartitionTypesHelper:vx,getSliceBeginCoords:Fd,getSliceSize:Od,getSparseFillEmptyRowsIndicesDenseShapeMismatch:Dx,getSparseFillEmptyRowsNegativeIndexErrorMessage:Ax,getSparseFillEmptyRowsOutOfRangeIndexErrorMessage:Fx,getSparseReshapeEmptyTensorZeroOutputDimErrorMessage:Mx,getSparseReshapeInputOutputMismatchErrorMessage:Px,getSparseReshapeInputOutputMultipleErrorMessage:Lx,getSparseReshapeMultipleNegativeOneOutputDimErrorMessage:Ox,getSparseReshapeNegativeOutputDimErrorMessage:_x,getSparseSegmentReductionIndicesOutOfRangeErrorMessage:Vx,getSparseSegmentReductionNegativeSegmentIdsErrorMessage:ku,getSparseSegmentReductionNonIncreasingSegmentIdsErrorMessage:Bx,getSparseSegmentReductionSegmentIdOutOfRangeErrorMessage:zx,getUndoAxesPermutation:ys,isIdentityPermutation:qd,log:qw,mergeRealAndImagArrays:Kn,prepareAndValidate:zh,prepareSplitSize:Kd,segment_util:G2,shouldFuse:yd,slice_util:ov,splitRealAndImagArrays:$x,tupleValuesAreOne:js,upcastType:Ve,validateDefaultValueShape:kx,validateInput:tv,validateUpdateShape:Fg,warn:je},Symbol.toStringTag,{value:"Module"}));const Hx={kernelName:tc,inputsToSave:["x"],gradFunc:(n,t)=>{const[e]=t;return{x:()=>D(n,Di(nt(e,"float32"),-1))}}};const q2={kernelName:Do,inputsToSave:["x"],gradFunc:(n,t)=>{const[e]=t;return{x:()=>{const s=Lt(nt(e,"float32")),r=Ee(at(ft(1),s));return qt(ut(n,r))}}}};const K2={kernelName:Ao,inputsToSave:["x"],gradFunc:(n,t)=>{const[e]=t;return{x:()=>{const s=Ee(at(Lt(nt(e,"float32")),1));return ut(n,s)}}}};const j2={kernelName:Pr,inputsToSave:["a","b"],gradFunc:(n,t)=>{const[e,s]=t,r=mt(e.shape,s.shape);return{a:()=>{let a=n;const c=ce(e.shape,r);return c.length>0&&(a=it(a,c)),M(a,e.shape)},b:()=>{let a=n;const c=ce(s.shape,r);return c.length>0&&(a=it(a,c)),M(a,s.shape)}}}};const X2={kernelName:Ku,saveAllInputs:!0,gradFunc:(n,t)=>{const e={};return t.forEach((s,r)=>{e[r]=()=>n.clone()}),e}};const Y2={kernelName:ec,inputsToSave:["x"],gradFunc:(n,t)=>{const[e]=t;return{x:()=>$t(e)}}};const Z2={kernelName:nc,inputsToSave:["x"],gradFunc:(n,t)=>{const[e]=t;return{x:()=>$t(e)}}};const J2={kernelName:Fo,inputsToSave:["x"],gradFunc:(n,t)=>{const[e]=t;return{x:()=>ut(n,Ee(at(ft(1),Lt(nt(e,"float32")))))}}};const Q2={kernelName:Oo,inputsToSave:["x"],gradFunc:(n,t)=>{const[e]=t;return{x:()=>{const s=Ee(J(ft(1),Lt(nt(e,"float32"))));return ut(n,s)}}}};const tN={kernelName:Lo,inputsToSave:["a","b"],gradFunc:(n,t)=>{const[e,s]=t,r=mt(e.shape,s.shape);return{a:()=>{const a=J(Lt(e),Lt(s));let c=D(n,ut(s,a));const l=ce(e.shape,r);return l.length>0&&(c=it(c,l)),M(c,e.shape)},b:()=>{const a=J(Lt(e),Lt(s));let c=qt(D(n,ut(e,a)));const l=ce(s.shape,r);return l.length>0&&(c=it(c,l)),M(c,s.shape)}}}};const eN={kernelName:_o,inputsToSave:["x"],gradFunc:(n,t)=>{const[e]=t;return{x:()=>ut(n,J(Lt(nt(e,"float32")),1))}}};const nN={kernelName:Mo,inputsToSave:["x"],gradFunc:(n,t)=>{const[e]=t;return{x:()=>ut(n,at(ft(1),Lt(nt(e,"float32"))))}}};function sN(n,t,e,s,r,o){const i=E(n,"dy","avgPool3dGrad"),a=E(t,"input","avgPool3dGrad");let c=i,l=a,u=!1;a.rank===4&&(u=!0,c=M(i,[1,i.shape[0],i.shape[1],i.shape[2],i.shape[3]]),l=M(a,[1,a.shape[0],a.shape[1],a.shape[2],a.shape[3]])),S(c.rank===5,()=>`Error in avgPool3dGrad: dy must be rank 5 but got rank ${c.rank}.`),S(l.rank===5,()=>`Error in avgPool3dGrad: input must be rank 5 but got rank ${l.rank}.`),Le("avgPool3dGrad",r,o);const h={dy:c,input:l},d={filterSize:e,strides:s,pad:r,dimRoundingMode:o},p=A.runKernel(Zu,h,d);return u?M(p,[p.shape[1],p.shape[2],p.shape[3],p.shape[4]]):p}const rN=F({avgPool3dGrad_:sN});const oN={kernelName:rc,inputsToSave:["x"],gradFunc:(n,t,e)=>{const[s]=t,{filterSize:r,strides:o,pad:i,dimRoundingMode:a}=e;return{x:()=>rN(n,s,r,o,i,a)}}};function iN(n,t,e,s,r){const o=E(n,"dy","avgPoolGrad"),i=E(t,"input","avgPoolGrad");S(i.rank===o.rank,()=>`Rank of input (${i.rank}) does not match rank of dy (${o.rank})`);let a=i,c=o,l=!1;i.rank===3&&(l=!0,a=M(i,[1,i.shape[0],i.shape[1],i.shape[2]]),c=M(o,[1,o.shape[0],o.shape[1],o.shape[2]])),S(c.rank===4,()=>`Error in avgPoolGrad: dy must be rank 4 but got rank ${c.rank}.`),S(a.rank===4,()=>`Error in avgPoolGrad: input must be rank 4 but got rank ${a.rank}.`);const u={dy:c,input:a},h={filterSize:e,strides:s,pad:r},d=A.runKernel(Yu,u,h);return l?M(d,[d.shape[1],d.shape[2],d.shape[3]]):d}const aN=F({avgPoolGrad_:iN});const cN={kernelName:sc,inputsToSave:["x"],gradFunc:(n,t,e)=>{const[s]=t,{filterSize:r,strides:o,pad:i}=e;return{x:()=>aN(n,s,r,o,i)}}};const lN={kernelName:oc,inputsToSave:["a","b"],gradFunc:(n,t,e)=>{const[s,r]=t,{transposeA:o,transposeB:i}=e;return!o&&!i?{a:()=>Nt(n,r,!1,!0),b:()=>Nt(s,n,!0,!1)}:!o&&i?{a:()=>Nt(n,r,!1,!1),b:()=>Nt(n,s,!0,!1)}:o&&!i?{a:()=>Nt(r,n,!1,!0),b:()=>Nt(s,n,!1,!1)}:{a:()=>Nt(r,n,!0,!0),b:()=>Nt(n,s,!0,!0)}}};const uN={kernelName:ic,gradFunc:(n,t,e)=>{const{blockShape:s,crops:r}=e;return{x:()=>ad(n,s,r)}}};const hN={kernelName:Uw,gradFunc:(n,t,e)=>{const s=e,r=s.inputShape,o=s.shape,i=Array.from(o);for(let c=r.length-1;c>=0;c--)if(r[c]===o[c])i[c]=1;else if(r[c]!==1)throw new Error(`broadcastTo(): [${r}] cannot be broadcast to [${o}].`);const a=[];for(let c=0;c<i.length;c++)i[c]>1&&a.push(c);return{x:()=>it(n,a,!0)}}};const dN={kernelName:Po,gradFunc:n=>({x:()=>n.clone()})};const pN={kernelName:Bo,gradFunc:n=>({x:()=>$t(n)})};const fN={kernelName:zo,inputsToSave:["x"],gradFunc:(n,t,e)=>{const[s]=t,{clipValueMin:r,clipValueMax:o}=e;return{x:()=>Ue(qn(Vr(s,r),Wr(s,o)),n,$t(n))}}};const mN={kernelName:ac,inputsToSave:["x"],gradFunc:Hx.gradFunc};const gN={kernelName:cc,saveAllInputs:!0,gradFunc:(n,t,e)=>{const s=t.map(c=>c.shape),{axis:r}=e,o=wt(r,t[0].shape)[0],i=s.map(c=>c[o]);return Ye(n,i,o).map(c=>()=>c)}};const xN={kernelName:lc,inputsToSave:["x","filter"],gradFunc:(n,t,e)=>{const[s,r]=t,{dilations:o,strides:i,pad:a,dataFormat:c}=e;return S(js(o),()=>`Error in gradient of conv2D: dilation rates greater than 1 are not yet supported in gradients. Got dilations '${o}'`),{x:()=>Yh(s.shape,n,r,i,a,c),filter:()=>md(s,n,r.shape,i,a,c)}}};const bN={kernelName:uc,inputsToSave:["dy","filter"],gradFunc:(n,t,e)=>{const[s,r]=t,{strides:o,pad:i,dataFormat:a,dimRoundingMode:c}=e;return{dy:()=>Xs(n,r,o,i,a,1,c),filter:()=>md(n,s,r.shape,o,i,a,c)}}};function yN(n,t,e,s,r){let o=n;n.rank===4&&(o=M(n,[1,n.shape[0],n.shape[1],n.shape[2],n.shape[3]]));let i=t;i.rank===4&&(i=M(t,[1,t.shape[0],t.shape[1],t.shape[2],t.shape[3]])),S(o.rank===5,()=>`Error in conv3dDerFilter: input must be rank 5, but got shape ${o.shape}.`),S(i.rank===5,()=>`Error in conv3dDerFilter: dy must be rank 5, but got shape ${i.shape}.`),S(e.length===5,()=>`Error in conv3dDerFilter: filterShape must be length 5, but got ${e}.`),S(o.shape[4]===e[3],()=>`Error in conv3dDerFilter: depth of input ${o.shape[4]}) must match input depth in filter (${e[3]}.`),S(i.shape[4]===e[4],()=>`Error in conv3dDerFilter: depth of dy (${i.shape[4]}) must match output depth for filter (${e[4]}).`);const a={x:o,dy:i},c={strides:s,pad:r,filterShape:e};return A.runKernel(eh,a,c)}const wN=F({conv3DBackpropFilter_:yN});const IN={kernelName:hc,inputsToSave:["x","filter"],gradFunc:(n,t,e)=>{const{dilations:s,strides:r,pad:o}=e;S(js(s),()=>`Error in gradient of conv3D: dilation rates greater than 1 are not yet supported in gradients. Got dilations '${s}'`);const[i,a]=t;return{x:()=>qg(i.shape,n,a,r,o),filter:()=>wN(i,n,a.shape,r,o)}}};const vN={kernelName:Vo,inputsToSave:["x"],gradFunc:(n,t)=>{const[e]=t;return{x:()=>D(qt(ax(nt(e,"float32"))),n)}}};const CN={kernelName:Wo,inputsToSave:["x"],gradFunc:(n,t)=>{const[e]=t;return{x:()=>D(cx(nt(e,"float32")),n)}}};const kN={kernelName:dc,inputsToSave:["x"],gradFunc:(n,t,e)=>{const[s]=t,{axis:r,exclusive:o,reverse:i}=e;return{x:()=>{const a=Kt([r],s.rank);let c=jg(n,r,o,!i);return a!=null&&(c=Ct(c,a)),c}}}};const $N={kernelName:pc,inputsToSave:["x","filter"],gradFunc:(n,t,e)=>{const{dilations:s,strides:r,pad:o,dimRoundingMode:i}=e,a=s??[1,1];S(js(a),()=>`Error in gradient of depthwiseConv2dNative: dilation rates greater than 1 are not yet supported. Got dilations '${a}'`);const[c,l]=t;return S(c.rank===4,()=>`Error in gradient of depthwiseConv2dNative: input must be rank 4, but got rank ${c.rank}.`),S(l.rank===4,()=>`Error in gradient of depthwiseConv2dNative: filter must be rank 4, but got rank ${l.rank}.`),S(c.shape[3]===l.shape[2],()=>`Error in gradient of depthwiseConv2d: number of input channels (${c.shape[3]}) must match the inChannels dimension in filter ${l.shape[2]}.`),S($e(r,a),()=>`Error in gradient of depthwiseConv2d: Either strides or dilations must be  1. Got strides ${r} and dilations '${a}'.`),Le("depthwiseConv2d",o,i),{x:()=>fS(c.shape,n,l,r,o,a,i),filter:()=>dS(c,n,l.shape,r,o,a,i)}}};const SN={kernelName:fc,inputsToSave:["x","filter"],gradFunc:(n,t,e)=>{const[s,r]=t,o={x:s,filter:r,dy:n},i={x:s,filter:r,dy:n};return{x:()=>A.runKernel(cu,o,e),filter:()=>A.runKernel(lu,i,e)}}};const NN={kernelName:Go,outputsToSave:[!0],gradFunc:(n,t)=>{const[e]=t,s={dy:n,y:e};return{x:()=>A.runKernel(ch,s)}}};const TN={kernelName:Ho,inputsToSave:["x"],gradFunc:(n,t)=>{const[e]=t,s=D(an(qt(Lt(e))),2/Math.sqrt(Math.PI));return{x:()=>D(n,s)}}};const EN={kernelName:qo,outputsToSave:[!0],gradFunc:(n,t)=>{const[e]=t;return{x:()=>D(n,e)}}};const RN={kernelName:gc,inputsToSave:["input"],gradFunc:(n,t)=>{const[e]=t;return{input:()=>M(n,e.shape)}}};const DN={kernelName:Ko,inputsToSave:["x"],gradFunc:(n,t)=>{const[e]=t;return{x:()=>D(n,an(e))}}};const AN={kernelName:jo,gradFunc:n=>({x:()=>$t(n)})};const FN={kernelName:Xo,inputsToSave:["a","b"],gradFunc:(n,t)=>{const[e,s]=t,r=mt(e.shape,s.shape);return{a:()=>{const a=ut(n,nt(s,"float32")),c=ce(e.shape,r);return c.length>0?M(it(a,c),e.shape):a},b:()=>{let a=D(n,nt(e,"float32"));const c=ce(s.shape,r);c.length>0&&(a=M(it(a,c),s.shape));const l=Lt(s);return qt(ut(a,nt(l,"float32")))}}}};const ON={kernelName:xc,inputsToSave:["x","mean","variance","scale"],gradFunc:(n,t,e)=>{const{varianceEpsilon:s}=e,[r,o,i,a]=t,c=a??ft(1),l=ce(o.shape,r.shape),u=[];if(o.rank===1){for(let y=0;y<r.shape.length-1;++y)u.push(r.shape[y]);u.push(1)}const h=at(r,o),d=D(n,c),p=rx(J(i,ft(s))),f=D(D(D(p,p),p),ft(-.5));return{x:()=>o.rank===1?M(D(D(n,wn(M(p,[1,1,1,o.shape[0]]),u)),c),r.shape):M(D(D(n,p),c),r.shape),mean:()=>{let y=D(D(p,ft(-1)),d);return o.rank===1&&(y=it(y,l)),M(y,o.shape)},variance:()=>{let y=D(D(f,h),d);return o.rank===1&&(y=it(y,l)),M(y,o.shape)},scale:()=>{const y=D(h,p);let I=D(n,y);return o.rank===1&&(I=it(I,l)),M(I,o.shape)},offset:()=>{let y=n;return o.rank===1&&(y=it(y,l)),M(y,o.shape)}}}};const _N={kernelName:bc,inputsToSave:["x","indices"],gradFunc:(n,t,e)=>{const[s,r]=t,{axis:o}=e,i=wt(o,s.shape)[0];return{x:()=>{const c=s.shape,l=r.size,u=c.slice(0,i),h=u.length,d=c.slice(o,c.length).slice(1),p=d.length,f=mf(0,h),m=mf(h+1,h+1+p),g=gf([u,[l],d]),x=M(n,g),b=M(r,[l]),w=gf([[h],f,m]),y=Ct(x,w);let I=px(y,b,s.shape[i]);const C=ys(w);return I=Ct(I,C),I},indices:()=>r}}};function mf(n,t){const e=[];for(let s=n;s<t;++s)e.push(s);return e}function gf(n){const t=[];for(let e=0;e<n.length;++e)for(let s=0;s<n[e].length;++s)t.push(n[e][s]);return t}const MN={kernelName:Yo,inputsToSave:["a","b"],gradFunc:(n,t)=>{const[e,s]=t;return{a:()=>$t(e),b:()=>$t(s)}}};const LN={kernelName:Zo,gradFunc:n=>({x:()=>nt(n,"float32")})};const PN={kernelName:Jo,gradFunc:n=>({x:()=>$t(n)})};const BN={kernelName:Qo,gradFunc:n=>({x:()=>$t(n)})};const zN={kernelName:ti,gradFunc:n=>({x:()=>$t(n)})};const VN={kernelName:wc,inputsToSave:["x"],gradFunc:(n,t,e)=>{const[s]=t,{alpha:r}=e,o=dn(s,0);return{x:()=>Ue(o,n,D(n,r))}}};const WN={kernelName:ni,inputsToSave:["x"],gradFunc:(n,t)=>{const[e]=t;return{x:()=>ut(n,J(e,1))}}};const UN={kernelName:ei,inputsToSave:["x"],gradFunc:(n,t)=>{const[e]=t;return{x:()=>ut(n,nt(e,"float32"))}}};const GN={kernelName:Gw,inputsToSave:[],outputsToSave:[!0],gradFunc:(n,t,e)=>{const[s]=t,{axis:r}=e;return{logits:()=>{const i=an(s);return at(n,D(it(n,r,!0),i))}}}};function HN(n,t,e,s=5,r=1,o=1,i=.5){const a={x:n,y:t,dy:e},c={depthRadius:s,bias:r,alpha:o,beta:i};return A.runKernel(fh,a,c)}const qN=F({localResponseNormalizationBackprop_:HN});const KN={kernelName:Sc,inputsToSave:["x"],outputsToSave:[!0],gradFunc:(n,t,e)=>{const[s,r]=t,{depthRadius:o,bias:i,alpha:a,beta:c}=e;return{x:()=>qN(s,r,n,o,i,a,c)}}};function qx(n,t,e,s){return t.rank<e.rank&&(t=M(t,Jt(t.shape,s))),n.rank<e.rank&&(n=M(n,Jt(n.shape,s))),{x:()=>D(n,nt(Ln(e,t),n.dtype))}}const xf={kernelName:Nc,inputsToSave:["x"],outputsToSave:[!0],gradFunc:(n,t,e)=>{const s=e,{reductionIndices:r}=s,o=t[0],i=t[1],a=wt(r,o.shape),c=qx(n,i,o,a);return{x:()=>c.x()}}};const jN={kernelName:si,inputsToSave:["a","b"],gradFunc:(n,t)=>{const[e,s]=t;return{a:()=>D(n,nt(Vr(e,s),"float32")),b:()=>D(n,nt(Jg(e,s),"float32"))}}};function XN(n,t,e,s,r,o,i){const a=E(n,"dy","maxPool3dGrad"),c=E(t,"input","maxPool3dGrad"),l=E(e,"output","maxPool3dGrad");let u=a,h=c,d=l,p=!1;c.rank===4&&(p=!0,u=M(a,[1,a.shape[0],a.shape[1],a.shape[2],a.shape[3]]),h=M(c,[1,c.shape[0],c.shape[1],c.shape[2],c.shape[3]]),d=M(l,[1,l.shape[0],l.shape[1],l.shape[2],l.shape[3]])),S(u.rank===5,()=>`Error in maxPool3dGrad: dy must be rank 5 but got rank ${u.rank}.`),S(h.rank===5,()=>`Error in maxPool3dGrad: input must be rank 5 but got rank ${h.rank}.`),S(d.rank===5,()=>`Error in maxPool3dGrad: output must be rank 5 but got rank ${d.rank}.`),Le("maxPool3dGrad",o,i);const f={dy:u,input:h,output:d},m={filterSize:s,strides:r,pad:o,dimRoundingMode:i},g=A.runKernel(gh,f,m);return p?M(g,[g.shape[1],g.shape[2],g.shape[3],g.shape[4]]):g}const YN=F({maxPool3dGrad_:XN});const ZN={kernelName:Ec,inputsToSave:["x"],outputsToSave:[!0],gradFunc:(n,t,e)=>{const[s,r]=t,{filterSize:o,strides:i,pad:a,dimRoundingMode:c}=e;return{x:()=>YN(n,s,r,o,i,a,c)}}};function JN(n,t,e,s,r,o,i){const a=E(n,"dy","maxPoolGrad"),c=E(t,"input","maxPoolGrad"),l=E(e,"output","maxPoolGrad");S(c.rank===a.rank,()=>`Rank of input (${c.rank}) does not match rank of dy (${a.rank})`),S(a.rank===4,()=>`Error in maxPoolGrad: dy must be rank 4 but got rank ${a.rank}.`),S(c.rank===4,()=>`Error in maxPoolGrad: input must be rank 4 but got rank ${c.rank}.`),Le("maxPoolGrad",o,i);const u={dy:a,input:c,output:l},h={filterSize:s,strides:r,pad:o,dimRoundingMode:i};return A.runKernel(mh,u,h)}const QN=F({maxPoolGrad_:JN});const tT={kernelName:Tc,inputsToSave:["x"],outputsToSave:[!0],gradFunc:(n,t,e)=>{const[s,r]=t,{filterSize:o,strides:i,pad:a}=e;return{x:()=>QN(n,s,r,o,i,a)}}};const eT={kernelName:Rc,inputsToSave:["x"],gradFunc:(n,t,e)=>{const[s]=t,{axis:r}=e,o=wt(r,s.shape),a=fe(s.shape,o)[1],c=q(a);return{x:()=>{const u=s.shape.slice();o.forEach(p=>{u[p]=1});const h=M(n,u);return ut(D(h,Is(s.shape,"float32")),c)}}}};const nT={kernelName:Dc,inputsToSave:["x"],outputsToSave:[!0],gradFunc:(n,t,e)=>{const s=e,{axis:r}=s,[o,i]=t,a=wt(r,o.shape),c=qx(n,i,o,a);return{x:()=>c.x()}}};const sT={kernelName:ri,inputsToSave:["a","b"],gradFunc:(n,t)=>{const[e,s]=t;return{a:()=>D(n,nt(Wr(e,s),"float32")),b:()=>D(n,nt(dn(e,s),"float32"))}}};const rT={kernelName:Ac,inputsToSave:["x"],gradFunc:(n,t,e)=>{const s=t[0],{paddings:r}=e,o=r.map(i=>i[0]);return{x:()=>Ft(n,o,s.shape)}}};const oT={kernelName:oi,inputsToSave:["a","b"],gradFunc:(n,t)=>{const[e,s]=t,r=mt(e.shape,s.shape);return{a:()=>{const a=ce(e.shape,r);return a.length>0?M(it(n,a),e.shape):n},b:()=>{const a=D(n,qt(al(ut(e,s)))),c=ce(s.shape,r);return c.length>0?M(it(a,c),s.shape):a}}}};const iT={kernelName:ii,inputsToSave:["a","b"],gradFunc:(n,t)=>{const[e,s]=t,r=mt(e.shape,s.shape);return{a:()=>{const a=D(n,nt(s,"float32")),c=ce(e.shape,r);return c.length>0?M(it(a,c),e.shape):a},b:()=>{const a=D(n,nt(e,"float32")),c=ce(s.shape,r);return c.length>0?M(it(a,c),s.shape):a}}}};const aT={kernelName:Fc,gradFunc:n=>({x:()=>qt(n)})};const cT={kernelName:Mc,inputsToSave:["indices"],gradFunc:(n,t)=>{const e=t[0];return{indices:()=>he(e.shape,"float32")}}};const lT={kernelName:_c,gradFunc:n=>({x:()=>$t(n)})};const uT={kernelName:Lc,saveAllInputs:!0,gradFunc:(n,t,e)=>{const{axis:s}=e;return Er(n,s).map(o=>()=>o)}};const bf={kernelName:Pc,inputsToSave:["x"],gradFunc:(n,t,e)=>{const s=t[0],{paddings:r}=e,o=r.map(i=>i[0]);return{x:()=>Ft(n,o,s.shape)}}};const hT={kernelName:ai,inputsToSave:["a","b"],outputsToSave:[!0],gradFunc:(n,t)=>{const[e,s,r]=t,o=e,i=s,a=mt(o.shape,i.shape);return{a:()=>{const u=nt(i,"float32");let h=D(n,D(u,Tr(o,at(u,ft(1)))));const d=ce(o.shape,a);return d.length>0&&(h=it(h,d)),M(h,o.shape)},b:()=>{const u=dn(o,0),h=Ue(u,cn(o),$t(o));let d=D(n,D(r,h));const p=ce(i.shape,a);return p.length>0&&(d=it(d,p)),M(d,i.shape)}}}};const dT={kernelName:Bc,inputsToSave:["x","alpha"],gradFunc:(n,t)=>{const[e,s]=t,r=dn(e,0);return{x:()=>Ue(r,n,D(n,s)),alpha:()=>{let o=Ue(r,$t(n),D(n,e));const i=ce(s.shape,n.shape);return i.length>0&&(o=it(o,i)),M(o,s.shape)}}}};function pT(n,t,e){const s=n.shape.slice();s[e]=1;const r=M(t,s),o=vu(n,e,!0,!1),i=vu(n,e,!0,!0),a=D(o,i);return D(r,a)}function fT(n,t,e){const s=n.shape.length,r=s-e.length,o=Kt(e,s);let i=n;o!=null&&(i=Ct(n,o));const a=i.shape.slice(),l=a.splice(s-e.length,e.length).reduce((d,p)=>d*p,1);a.push(l);const u=i.reshape(a);let h=pT(u,t,r);if(h=h.reshape(i.shape),o!=null){const d=ys(o);h=Ct(h,d)}return h}const mT={kernelName:zc,inputsToSave:["x"],gradFunc:(n,t,e)=>{const[s]=t,{axis:r}=e;let o=[];return r==null?o=s.shape.map((i,a)=>a):typeof r=="number"?o=[r]:o=r,{x:()=>fT(s,n,o)}}};const gT={kernelName:Uo,inputsToSave:["a","b"],gradFunc:(n,t)=>{const[e,s]=t,r=mt(e.shape,s.shape);return{a:()=>{const a=ut(n,nt(s,"float32")),c=ce(e.shape,r);return c.length>0?M(it(a,c),e.shape):a},b:()=>{let a=D(n,nt(e,"float32"));const c=ce(s.shape,r);c.length>0&&(a=M(it(a,c),s.shape));const l=Lt(s);return qt(ut(a,nt(l,"float32")))}}}};const xT={kernelName:ci,inputsToSave:["x"],gradFunc:(n,t)=>{const[e]=t;return{x:()=>ut(n,qt(Lt(e)))}}};const bT={kernelName:ui,inputsToSave:["x"],gradFunc:(n,t)=>{const[e]=t,s=D(Wr(e,6),Di(e));return{x:()=>D(n,nt(s,"float32"))}}};const yT={kernelName:li,inputsToSave:["x"],gradFunc:(n,t)=>{const[e]=t;return{x:()=>D(n,nt(Di(e),"float32"))}}};const wT={kernelName:Vc,inputsToSave:["x"],gradFunc:(n,t)=>{const[e]=t;return{x:()=>M(n,e.shape)}}};const IT={kernelName:Uc,inputsToSave:["images"],gradFunc:(n,t,e)=>{const[s]=t,r={dy:n,images:s};return{images:()=>A.runKernel(Ch,r,e)}}};const vT={kernelName:Wc,inputsToSave:["images"],gradFunc:(n,t,e)=>{const[s]=t,r={dy:n,images:s};return{images:()=>A.runKernel(vh,r,e)}}};const CT={kernelName:Gc,gradFunc:(n,t,e)=>{const{dims:s}=e,r=wt(s,n.shape);return{x:()=>Zs(n,r)}}};const kT={kernelName:hi,gradFunc:n=>({x:()=>$t(n)})};const $T={kernelName:di,inputsToSave:["x"],gradFunc:(n,t)=>{const[e]=t;return{x:()=>qt(ut(n,D(Tr(e,1.5),2)))}}};const ST={kernelName:Hc,inputsToSave:["condition"],gradFunc:(n,t)=>{const[e]=t;return{condition:()=>nt($t(e),"float32"),t:()=>D(n,nt(e,n.dtype)),e:()=>D(n,nt(sd(e),n.dtype))}}};const NT={kernelName:pi,inputsToSave:["x"],gradFunc:(n,t)=>{const[e]=t;return{x:()=>{const s=dn(e,ft(0)),r=ft(pl),o=ft(fl),i=D(n,o),a=D(D(n,r),an(nt(e,"float32")));return Ue(s,i,a)}}}};const TT={kernelName:xi,outputsToSave:[!0],gradFunc:(n,t)=>{const[e]=t;return{x:()=>D(n,D(e,at(ft(1),e)))}}};const ET={kernelName:gi,gradFunc:n=>({x:()=>$t(n)})};const RT={kernelName:fi,inputsToSave:["x"],gradFunc:(n,t)=>{const[e]=t;return{x:()=>D(Zh(nt(e,"float32")),n)}}};const DT={kernelName:mi,inputsToSave:["x"],gradFunc:(n,t)=>{const[e]=t;return{x:()=>D(Kg(nt(e,"float32")),n)}}};const AT={kernelName:qc,inputsToSave:["x"],gradFunc:(n,t,e)=>{const[s]=t,{begin:r,size:o}=e,i=s.shape,[a,c]=sl(s,r,o),l=[];for(let u=0;u<n.rank;u++)l.push([a[u],i[u]-a[u]-c[u]]);return{x:()=>id(n,l)}}};const FT={kernelName:Yc,outputsToSave:[!0],gradFunc:(n,t,e)=>{const[s]=t,{dim:r}=e,o=!0,i=D(n,s);return{logits:()=>at(i,D(it(i,[r],o),s))}}};const OT={kernelName:bi,inputsToSave:["x"],gradFunc:(n,t)=>{const[e]=t;return{x:()=>D(n,zr(e))}}};const yf={kernelName:jc,gradFunc:(n,t,e)=>{const{blockShape:s,paddings:r}=e;return{x:()=>Xh(n,s,r)}}};const wf={kernelName:Xc,gradFunc:(n,t,e)=>{const{axis:s}=e;return{x:()=>Ce(n,s)}}};const _T={kernelName:yi,inputsToSave:["x"],gradFunc:(n,t)=>{const[e]=t;return{x:()=>ut(n,D(Ee(nt(e,"float32")),2))}}};const MT={kernelName:Th,inputsToSave:["x"],gradFunc:(n,t)=>{const[e]=t;return{x:()=>D(n,D(nt(e,"float32"),2))}}};const LT={kernelName:wi,inputsToSave:["a","b"],gradFunc:(n,t)=>{const[e,s]=t,r=ft(2);return{a:()=>D(n,D(r,at(e,s))),b:()=>D(n,D(r,at(s,e)))}}};const PT={kernelName:$i,gradFunc:n=>({x:()=>$t(n)})};const BT={kernelName:Ii,inputsToSave:["a","b"],gradFunc:(n,t)=>{const[e,s]=t,r=mt(e.shape,s.shape);return{a:()=>{let a=n;const c=ce(e.shape,r);return c.length>0&&(a=it(a,c)),M(a,e.shape)},b:()=>{let a=n;const c=ce(s.shape,r);return c.length>0&&(a=it(a,c)),M(qt(a),s.shape)}}}};const zT={kernelName:Kc,inputsToSave:["x"],gradFunc:(n,t,e)=>{const[s]=t,r=s.shape.slice(),{axis:o}=e;wt(o,s.shape).forEach(l=>{r[l]=1});const a=M(n,r),c=D(a,Is(s.shape,"float32"));return{x:()=>c}}};const VT={kernelName:vi,inputsToSave:["x"],gradFunc:(n,t)=>{const[e]=t;return{x:()=>ut(n,Lt(Zh(e)))}}};const WT={kernelName:Ci,outputsToSave:[!0],gradFunc:(n,t)=>{const[e]=t;return{x:()=>D(at(ft(1),Lt(e)),n)}}};const UT={kernelName:ki,inputsToSave:["x"],gradFunc:(n,t,e)=>{const[s]=t,{reps:r}=e;return{x:()=>{let i=$t(s);if(s.rank===1)for(let a=0;a<r[0];++a)i=J(i,Ft(n,[a*s.shape[0]],[s.shape[0]]));else if(s.rank===2)for(let a=0;a<r[0];++a)for(let c=0;c<r[1];++c)i=J(i,Ft(n,[a*s.shape[0],c*s.shape[1]],[s.shape[0],s.shape[1]]));else if(s.rank===3)for(let a=0;a<r[0];++a)for(let c=0;c<r[1];++c)for(let l=0;l<r[2];++l)i=J(i,Ft(n,[a*s.shape[0],c*s.shape[1],l*s.shape[2]],[s.shape[0],s.shape[1],s.shape[2]]));else if(s.rank===4)for(let a=0;a<r[0];++a)for(let c=0;c<r[1];++c)for(let l=0;l<r[2];++l)for(let u=0;u<r[3];++u)i=J(i,Ft(n,[a*s.shape[0],c*s.shape[1],l*s.shape[2],u*s.shape[3]],[s.shape[0],s.shape[1],s.shape[2],s.shape[3]]));else throw new Error(`Gradient for tile operation is not implemented for rank-${s.rank} tensors yet.`);return i}}}};const GT={kernelName:yr,gradFunc:(n,t,e)=>{const s=e,{perm:r}=s,o=ys(r);return{x:()=>Ct(n,o)}}};const HT={kernelName:Zc,gradFunc:(n,t,e)=>{const s=e,{axis:r}=s;return{value:()=>Js(n,r)}}};const qT={kernelName:Jc,inputsToSave:["segmentIds"],gradFunc:(n,t)=>{const[e]=t;return{x:()=>KT(n,e)}}};function KT(n,t){const e=ws(t,$t(t)),s=td(n,e);let r=Vr(t,ft(0,"int32"));const o=s.rank-r.rank;for(let a=0;a<o;++a)r=nn(r,a+1);r=qn(r,Is(s.shape,"bool"));const i=$t(s);return Ue(r,s,i)}const jT={kernelName:Qc,gradFunc:n=>({x:()=>$t(n)})};const XT=[Hx,q2,K2,j2,X2,Y2,Z2,J2,Q2,tN,eN,nN,oN,cN,lN,uN,hN,dN,pN,fN,mN,gN,bN,xN,IN,vN,CN,kN,$N,SN,gT,NN,TN,EN,RN,DN,FN,AN,ON,_N,MN,LN,PN,BN,zN,VN,WN,UN,GN,KN,xf,xf,jN,ZN,tT,eT,nT,sT,rT,oT,iT,aT,cT,lT,uT,bf,bf,hT,dT,mT,xT,bT,yT,wT,IT,vT,CT,kT,$T,ST,NT,TT,ET,RT,DT,AT,FT,OT,yf,yf,wf,wf,_T,LT,MT,PT,BT,zT,VT,WT,UT,GT,HT,qT,jT];for(const n of XT)Kw(n);G().prototype.abs=function(){return this.throwIfDisposed(),le(this)};G().prototype.acos=function(){return this.throwIfDisposed(),dv(this)};G().prototype.acosh=function(){return this.throwIfDisposed(),fv(this)};G().prototype.add=function(n){return this.throwIfDisposed(),J(this,n)};G().prototype.all=function(n,t){return this.throwIfDisposed(),Ug(this,n,t)};G().prototype.any=function(n,t){return this.throwIfDisposed(),wu(this,n,t)};G().prototype.argMax=function(n){return this.throwIfDisposed(),yo(this,n)};G().prototype.argMin=function(n){return this.throwIfDisposed(),yv(this,n)};G().prototype.asScalar=function(){return this.throwIfDisposed(),S(this.size===1,()=>"The array must have only 1 element."),M(this,[])};G().prototype.asType=function(n){return this.throwIfDisposed(),nt(this,n)};G().prototype.as1D=function(){return this.throwIfDisposed(),M(this,[this.size])};G().prototype.as2D=function(n,t){return this.throwIfDisposed(),M(this,[n,t])};G().prototype.as3D=function(n,t,e){return this.throwIfDisposed(),M(this,[n,t,e])};G().prototype.as4D=function(n,t,e,s){return this.throwIfDisposed(),M(this,[n,t,e,s])};G().prototype.as5D=function(n,t,e,s,r){return this.throwIfDisposed(),M(this,[n,t,e,s,r])};G().prototype.asin=function(){return this.throwIfDisposed(),Iv(this)};G().prototype.asinh=function(){return this.throwIfDisposed(),Cv(this)};G().prototype.atan=function(){return this.throwIfDisposed(),$v(this)};G().prototype.atan2=function(n){return this.throwIfDisposed(),Nv(this,n)};G().prototype.atanh=function(){return this.throwIfDisposed(),Ev(this)};G().prototype.avgPool=function(n,t,e,s){return this.throwIfDisposed(),Kh(this,n,t,e,s)};G().prototype.batchToSpaceND=function(n,t){return this.throwIfDisposed(),Xh(this,n,t)};G().prototype.batchNorm=function(n,t,e,s,r){return this.throwIfDisposed(),rl(this,n,t,e,s,r)};G().prototype.broadcastTo=function(n){return this.throwIfDisposed(),xo(this,n)};G().prototype.cast=function(n){return this.throwIfDisposed(),nt(this,n)};G().prototype.ceil=function(){return this.throwIfDisposed(),eC(this)};G().prototype.clipByValue=function(n,t){return this.throwIfDisposed(),Ze(this,n,t)};G().prototype.concat=function(n,t){return this.throwIfDisposed(),n instanceof ne&&(n=[n]),Ce([this,...n],t)};G().prototype.conv1d=function(n,t,e,s,r,o){return this.throwIfDisposed(),Gg(this,n,t,e,s,r,o)};G().prototype.conv2dTranspose=function(n,t,e,s,r){return this.throwIfDisposed(),Hg(this,n,t,e,s,r)};G().prototype.conv2d=function(n,t,e,s,r,o){return this.throwIfDisposed(),Xs(this,n,t,e,s,r,o)};G().prototype.cos=function(){return this.throwIfDisposed(),Zh(this)};G().prototype.cosh=function(){return this.throwIfDisposed(),Kg(this)};G().prototype.cumprod=function(n,t,e){return this.throwIfDisposed(),vu(this,n,t,e)};G().prototype.cumsum=function(n,t,e){return this.throwIfDisposed(),jg(this,n,t,e)};G().prototype.depthToSpace=function(n,t){return this.throwIfDisposed(),$C(this,n,t)};G().prototype.depthwiseConv2d=function(n,t,e,s,r,o){return this.throwIfDisposed(),Jh(this,n,t,e,s,r,o)};G().prototype.dilation2d=function(n,t,e,s,r){return this.throwIfDisposed(),TC(this,n,t,e,s,r)};G().prototype.divNoNan=function(n){return this.throwIfDisposed(),FC(this,n)};G().prototype.div=function(n){return this.throwIfDisposed(),ut(this,n)};G().prototype.dot=function(n){return this.throwIfDisposed(),_C(this,n)};G().prototype.elu=function(){return this.throwIfDisposed(),ol(this)};G().prototype.equal=function(n){return this.throwIfDisposed(),Ln(this,n)};G().prototype.erf=function(){return this.throwIfDisposed(),PC(this)};G().prototype.euclideanNorm=function(n,t){return this.throwIfDisposed(),KC(this,n,t)};G().prototype.exp=function(){return this.throwIfDisposed(),an(this)};G().prototype.expandDims=function(n){return this.throwIfDisposed(),nn(this,n)};G().prototype.expm1=function(){return this.throwIfDisposed(),ZC(this)};G().prototype.fft=function(){return this.throwIfDisposed(),pd(this)};G().prototype.flatten=function(){return this.throwIfDisposed(),M(this,[this.size])};G().prototype.floor=function(){return this.throwIfDisposed(),al(this)};G().prototype.floorDiv=function(n){return this.throwIfDisposed(),Wg(this,n)};G().prototype.gather=function(n,t){return this.throwIfDisposed(),td(this,n,t)};G().prototype.greaterEqual=function(n){return this.throwIfDisposed(),Vr(this,n)};G().prototype.greater=function(n){return this.throwIfDisposed(),dn(this,n)};G().prototype.ifft=function(){return this.throwIfDisposed(),_a(this)};G().prototype.irfft=function(){return this.throwIfDisposed(),ux(this)};G().prototype.isFinite=function(){return this.throwIfDisposed(),ok(this)};G().prototype.isInf=function(){return this.throwIfDisposed(),ak(this)};G().prototype.isNaN=function(){return this.throwIfDisposed(),lk(this)};G().prototype.leakyRelu=function(n){return this.throwIfDisposed(),ed(this,n)};G().prototype.lessEqual=function(n){return this.throwIfDisposed(),Wr(this,n)};G().prototype.less=function(n){return this.throwIfDisposed(),Jg(this,n)};G().prototype.localResponseNormalization=function(n,t,e,s){return this.throwIfDisposed(),fk(this,n,t,e,s)};G().prototype.logSigmoid=function(){return this.throwIfDisposed(),wk(this)};G().prototype.logSoftmax=function(n){return this.throwIfDisposed(),Qg(this,n)};G().prototype.logSumExp=function(n,t){return this.throwIfDisposed(),tx(this,n,t)};G().prototype.log=function(){return this.throwIfDisposed(),cn(this)};G().prototype.log1p=function(){return this.throwIfDisposed(),nd(this)};G().prototype.logicalAnd=function(n){return this.throwIfDisposed(),qn(this,n)};G().prototype.logicalNot=function(){return this.throwIfDisposed(),sd(this)};G().prototype.logicalOr=function(n){return this.throwIfDisposed(),ex(this,n)};G().prototype.logicalXor=function(n){return this.throwIfDisposed(),Tk(this,n)};G().prototype.matMul=function(n,t,e){return this.throwIfDisposed(),Nt(this,n,t,e)};G().prototype.maxPool=function(n,t,e,s){return this.throwIfDisposed(),rd(this,n,t,e,s)};G().prototype.max=function(n,t){return this.throwIfDisposed(),An(this,n,t)};G().prototype.maximum=function(n){return this.throwIfDisposed(),ws(this,n)};G().prototype.mean=function(n,t){return this.throwIfDisposed(),Yt(this,n,t)};G().prototype.min=function(n,t){return this.throwIfDisposed(),Cu(this,n,t)};G().prototype.minimum=function(n){return this.throwIfDisposed(),cl(this,n)};G().prototype.mirrorPad=function(n,t){return this.throwIfDisposed(),Mk(this,n,t)};G().prototype.mod=function(n){return this.throwIfDisposed(),Pk(this,n)};G().prototype.mul=function(n){return this.throwIfDisposed(),D(this,n)};G().prototype.neg=function(){return this.throwIfDisposed(),qt(this)};G().prototype.norm=function(n,t,e){return this.throwIfDisposed(),il(this,n,t,e)};G().prototype.notEqual=function(n){return this.throwIfDisposed(),wo(this,n)};G().prototype.oneHot=function(n,t=1,e=0){return this.throwIfDisposed(),Dg(this,n,t,e)};G().prototype.onesLike=function(){return this.throwIfDisposed(),ln(this)};G().prototype.pad=function(n,t){return this.throwIfDisposed(),id(this,n,t)};G().prototype.pool=function(n,t,e,s,r,o){return this.throwIfDisposed(),Kk(this,n,t,e,s,r,o)};G().prototype.pow=function(n){return this.throwIfDisposed(),Tr(this,n)};G().prototype.prelu=function(n){return this.throwIfDisposed(),cd(this,n)};G().prototype.prod=function(n,t){return this.throwIfDisposed(),Yk(this,n,t)};G().prototype.reciprocal=function(){return this.throwIfDisposed(),w$(this)};G().prototype.relu=function(){return this.throwIfDisposed(),Yn(this)};G().prototype.relu6=function(){return this.throwIfDisposed(),nx(this)};G().prototype.reshapeAs=function(n){return this.throwIfDisposed(),M(this,n.shape)};G().prototype.reshape=function(n){return this.throwIfDisposed(),M(this,n)};G().prototype.resizeBilinear=function(n,t,e){return this.throwIfDisposed(),bx(this,n,t,e)};G().prototype.resizeNearestNeighbor=function(n,t,e){return this.throwIfDisposed(),yx(this,n,t,e)};G().prototype.reverse=function(n){return this.throwIfDisposed(),Zs(this,n)};G().prototype.rfft=function(){return this.throwIfDisposed(),fd(this)};G().prototype.round=function(){return this.throwIfDisposed(),sx(this)};G().prototype.rsqrt=function(){return this.throwIfDisposed(),rx(this)};G().prototype.selu=function(){return this.throwIfDisposed(),ox(this)};G().prototype.separableConv2d=function(n,t,e,s,r,o){return this.throwIfDisposed(),ix(this,n,t,e,s,r,o)};G().prototype.sigmoid=function(){return this.throwIfDisposed(),zr(this)};G().prototype.sign=function(){return this.throwIfDisposed(),E$(this)};G().prototype.sin=function(){return this.throwIfDisposed(),ax(this)};G().prototype.sinh=function(){return this.throwIfDisposed(),cx(this)};G().prototype.slice=function(n,t){return this.throwIfDisposed(),Ft(this,n,t)};G().prototype.softmax=function(n){return this.throwIfDisposed(),dd(this,n)};G().prototype.softplus=function(){return this.throwIfDisposed(),Ei(this)};G().prototype.spaceToBatchND=function(n,t){return this.throwIfDisposed(),ad(this,n,t)};G().prototype.split=function(n,t){return this.throwIfDisposed(),Ye(this,n,t)};G().prototype.sqrt=function(){return this.throwIfDisposed(),Ee(this)};G().prototype.square=function(){return this.throwIfDisposed(),Lt(this)};G().prototype.squaredDifference=function(n){return this.throwIfDisposed(),hx(this,n)};G().prototype.squeeze=function(n){return this.throwIfDisposed(),Ri(this,n)};G().prototype.stack=function(n,t){this.throwIfDisposed();const e=n instanceof ne?[this,n]:[this,...n];return Js(e,t)};G().prototype.step=function(n){return this.throwIfDisposed(),Di(this,n)};G().prototype.stridedSlice=function(n,t,e,s,r,o,i,a){return this.throwIfDisposed(),K$(this,n,t,e,s,r,o,i,a)};G().prototype.sub=function(n){return this.throwIfDisposed(),at(this,n)};G().prototype.sum=function(n,t){return this.throwIfDisposed(),it(this,n,t)};G().prototype.tan=function(){return this.throwIfDisposed(),X$(this)};G().prototype.tanh=function(){return this.throwIfDisposed(),jh(this)};G().prototype.tile=function(n){return this.throwIfDisposed(),wn(this,n)};G().prototype.toBool=function(){return this.throwIfDisposed(),nt(this,"bool")};G().prototype.toFloat=function(){return this.throwIfDisposed(),nt(this,"float32")};G().prototype.toInt=function(){return this.throwIfDisposed(),nt(this,"int32")};G().prototype.topk=function(n,t){return this.throwIfDisposed(),Z$(this,n,t)};G().prototype.transpose=function(n){return this.throwIfDisposed(),Ct(this,n)};G().prototype.unique=function(n){return this.throwIfDisposed(),tS(this,n)};G().prototype.unsortedSegmentSum=function(n,t){return this.throwIfDisposed(),px(this,n,t)};G().prototype.unstack=function(n){return this.throwIfDisposed(),Er(this,n)};G().prototype.where=function(n,t){return this.throwIfDisposed(),Ue(n,this,t)};G().prototype.zerosLike=function(){return this.throwIfDisposed(),$t(this)};class Nn extends Error{constructor(t){super(t),Object.setPrototypeOf(this,Nn.prototype)}}class rn extends Error{constructor(t){super(t),Object.setPrototypeOf(this,rn.prototype)}}class O extends Error{constructor(t){super(t),Object.setPrototypeOf(this,O.prototype)}}class bt extends Error{constructor(t){super(t),Object.setPrototypeOf(this,bt.prototype)}}class Xd extends Error{constructor(t){super(t),Object.setPrototypeOf(this,Xd.prototype)}}class Kx{constructor(t){this.maxEntries=t||100,this.cache=new Map}get(t){let e;return this.cache.has(t)&&(e=this.cache.get(t),this.cache.delete(t),this.cache.set(t,e)),e}put(t,e){if(this.cache.has(t))this.cache.delete(t);else if(this.cache.size>=this.maxEntries){const s=this.cache.keys().next().value;this.cache.delete(s)}this.cache.set(t,e)}getMaxEntries(){return this.maxEntries}setMaxEntries(t){if(t<0)throw new Error(`The maxEntries of LRU caches must be at least 0, but got ${t}.`);if(this.maxEntries>t)for(let e=0;e<this.maxEntries-t;e++){const s=this.cache.keys().next().value;this.cache.delete(s)}this.maxEntries=t}}function tr(n,t){if(Array.isArray(n)){let e=[];for(let s=0;s<t;s++)e=e.concat(n);return e}else{const e=new Array(t);return e.fill(n),e}}function Tn(n,t){if(!n)throw new Xd(t)}function If(n,t){let e=0;for(const s of n)s===t&&e++;return e}function Oe(n){return n.length===1?n[0]:n}function Vt(n){return Array.isArray(n)?n:[n]}function Wn(n){const e=n.replace(/(.)([A-Z][a-z0-9]+)/g,"$1_$2").replace(/([a-z])([A-Z])/g,"$1_$2").toLowerCase();return e[0]!=="_"?e:"private"+e}function Ms(n){return n.length<=1||n.indexOf("_")===-1?n:n.replace(/[_]+(\w|$)/g,(t,e)=>e.toUpperCase())}let Qe={};function Yd(n){if(n==null)return null;const t={};return t.className=n.getClassName(),t.config=n.getConfig(),t}function $u(n){if(!(n==null||typeof n!="object"))if(Array.isArray(n))n.forEach(t=>$u(t));else{const t=Object.keys(n);for(const e of t){const s=n[e];s!=null&&typeof s=="object"&&(!Array.isArray(s)&&s.type==="ndarray"&&typeof s.value=="number"?n[e]=s.value:$u(s))}}}function _i(n,t={},e={},s="object",r=!1){if(typeof n=="string"){const o=n;let i;if(o in e)i=e[o];else if(o in Qe)i=Qe[o];else if(i=t[o],i==null)throw new O(`Unknown ${s}: ${n}. This may be due to one of the following reasons:
1. The ${s} is defined in Python, in which case it needs to be ported to TensorFlow.js or your JavaScript code.
2. The custom ${s} is defined in JavaScript, but is not registered properly with tf.serialization.registerClass().`);return i}else{const o=n;if(o.className==null||o.config==null)throw new O(`${s}: Improper config format: ${JSON.stringify(o)}.
'className' and 'config' must set.`);const i=o.className;let a,c;if(i in e?[a,c]=e[i]:i in Qe?[a,c]=Qe.className:i in t&&([a,c]=t[i]),a==null)throw new O(`Unknown ${s}: ${i}. This may be due to one of the following reasons:
1. The ${s} is defined in Python, in which case it needs to be ported to TensorFlow.js or your JavaScript code.
2. The custom ${s} is defined in JavaScript, but is not registered properly with tf.serialization.registerClass().`);if(c!=null){const l={};for(const p of Object.keys(Qe))l[p]=Qe[p];for(const p of Object.keys(e))l[p]=e[p];const u=o.config;u.customObjects=l;const h=Object.assign({},Qe);for(const p of Object.keys(e))Qe[p]=e[p];$u(o.config);const d=c(a,o.config,e,r);return Qe=Object.assign({},h),d}else{const l=Object.assign({},Qe);for(const h of Object.keys(e))Qe[h]=e[h];const u=new a(o.config);return Qe=Object.assign({},l),u}}}function YT(n,t){return n<t?-1:n>t?1:0}function ea(n,t){return-1*YT(n,t)}function cs(n){if(n==null)return n;const t=[];for(const e of n)t.indexOf(e)===-1&&t.push(e);return t}function ZT(n){if(n==null)throw new O(`Invalid value in obj: ${JSON.stringify(n)}`);for(const t in n)if(n.hasOwnProperty(t))return!1;return!0}function rr(n,t,e){if(e!=null&&n.indexOf(e)<0)throw new O(`${e} is not a valid ${t}.  Valid values are ${n} or null/undefined.`)}function Zd(n,t,e=0,s=1/0){return Tn(e>=0),Tn(s>=e),Array.isArray(n)&&n.length>=e&&n.length<=s&&n.every(r=>typeof r===t)}function pe(n,t){Array.isArray(n)?(S(n.length>0,()=>`${t} is unexpectedly an empty array.`),n.forEach((e,s)=>pe(e,`element ${s+1} of ${t}`))):S(Number.isInteger(n)&&n>0,()=>`Expected ${t} to be a positive integer, but got ${jx(n)}.`)}function jx(n){return n===null?"null":Array.isArray(n)?"["+n.map(t=>jx(t)).join(",")+"]":typeof n=="string"?`"${n}"`:`${n}`}function JT(n,t,e){let s=e!=null?e():Fe(),r;return(...i)=>{const a=e!=null?e():Fe();return a-s<t||(s=a,r=n(...i)),r}}function Xx(n){return n==="relu"?"relu":n==="linear"?"linear":n==="elu"?"elu":null}let QT=0;function Yx(){return QT++}const na={};function ml(n=""){return n in na||(na[n]=0),na[n]+=1,n+na[n].toString()}const tE=["channelsFirst","channelsLast"],eE=["nearest","bilinear"],nE=["valid","same","causal"],sE=["max","avg"],rE=["sum","mul","concat","ave"];const ur=new Map;function te(n){rr(tE,"DataFormat",n)}function oE(n){rr(eE,"InterpolationFormat",n)}function Je(n){rr(nE,"PaddingMode",n)}function Zx(n){rr(sE,"PoolMode",n)}const bo=[],vf="/";function Ws(n,t){bo.push(n);try{const e=t();return bo.pop(),e}catch(e){throw bo.pop(),e}}function iE(){return bo.length===0?"":bo.join(vf)+vf}function Jx(n){if(!tb(n))throw new Error("Not a valid tensor name: '"+n+"'");return iE()+n}function Qx(n){if(!tb(n))throw new Error("Not a valid tensor name: '"+n+"'");ur.has(n)||ur.set(n,0);const t=ur.get(n);if(ur.set(n,ur.get(n)+1),t>0){const e=`${n}_${t}`;return ur.set(e,1),e}else return n}const aE=new RegExp(/^[A-Za-z0-9][-A-Za-z0-9\._\/]*$/);function tb(n){return!!n.match(aE)}function cE(n){return n===parseInt(n.toString(),10)}function ls(n,t,e){t==null&&(t=0),e==null&&(e=n.length);let s=1;for(let r=t;r<e;++r)s*=n[r];return s}function Rr(n){if(n.length===0)return Number.NaN;let t=Number.POSITIVE_INFINITY;for(let e=0;e<n.length;e++){const s=n[e];s<t&&(t=s)}return t}function hs(n){if(n.length===0)return Number.NaN;let t=Number.NEGATIVE_INFINITY;for(let e=0;e<n.length;e++){const s=n[e];s>t&&(t=s)}return t}function Cn(n,t){if(t<n)throw new O(`end (${t}) < begin (${n}) is forbidden.`);const e=[];for(let s=n;s<t;++s)e.push(s);return e}let Wl;function re(){return Wl==null&&(Wl=XI().epsilon()),Wl}function kn(){return"channelsLast"}function Mi(n,t){return nt(n,t)}function Li(n,t=-1){const e=n.shape.slice();return t<0&&(t=e.length+t+1),e.splice(t,0,1),M(n,e)}function lE(n,t){return z(()=>{if(n.shape.length!==2)throw new O(`repeat() expects a rank-2 tensor, but received a rank-${n.shape.length} tensor.`);const e=Li(n,1);return Su(e,[1,t,1])})}function uE(n){const t=[ls(n.shape)];return M(n,t)}function hE(n){if(n.rank<=1)throw new O(`batchFlatten requires a minimum rank of 2. Got rank: ${n.rank}.`);const t=[n.shape[0],ls(n.shape,1)];return M(n,t)}function Us(n,t,e){return z(()=>{switch(n.rank){case 1:return ud(n,t,e);case 2:return lx(n,[t,0],[e,n.shape[1]]);case 3:return hd(n,[t,0,0],[e,n.shape[1],n.shape[2]]);case 4:return Oa(n,[t,0,0,0],[e,n.shape[1],n.shape[2],n.shape[3]]);case 5:return Ft(n,[t,0,0,0,0],[e,n.shape[1],n.shape[2],n.shape[3],n.shape[4]]);case 6:return Ft(n,[t,0,0,0,0,0],[e,n.shape[1],n.shape[2],n.shape[3],n.shape[4],n.shape[5]]);default:throw new O(`sliceAlongFirstAxis() received an unsupported tensor rank: ${n.rank}`)}})}function Ul(n,t,e){return z(()=>{switch(n.rank){case 1:return ud(n,t,e);case 2:return lx(n,[0,t],[n.shape[0],e]);case 3:return hd(n,[0,0,t],[n.shape[0],n.shape[1],e]);case 4:return Oa(n,[0,0,0,t],[n.shape[0],n.shape[1],n.shape[2],e]);default:throw new O(`sliceAlongLastAxis() received an unsupported tensor rank: ${n.rank}`)}})}function sa(n,t,e,s){return z(()=>{switch(n.rank){case 1:return ud(n,t,e);case 2:switch(s){case 1:return Us(n,t,e);case 2:return Ul(n,t,e);default:throw new O(`The axis is not within the rank of the tensor ${s}`)}case 3:switch(s){case 1:return Us(n,t,e);case 2:return hd(n,[0,t,0],[n.shape[0],e,n.shape[2]]);case 3:return Ul(n,t,e);default:throw new O(`The axis is not within the rank of the tensor ${s}`)}case 4:switch(s){case 1:return Us(n,t,e);case 2:return Oa(n,[0,t,0,0],[n.shape[0],e,n.shape[2],n.shape[3]]);case 3:return Oa(n,[0,0,t,0],[n.shape[0],n.shape[1],e,n.shape[3]]);case 4:return Ul(n,t,e);default:throw new O(`The axis is not within the rank of the tensor ${s}`)}default:throw new O(`sliceAlongLastAxis() received an unsupported tensor rank: ${n.rank}`)}})}function Jd(n,t=-1){let e;return t<0&&(e=n[0].rank,e!==0?t=e:t=0),t===n[0].rank&&(t=-1),Ce(n,t)}function Cf(n,t){switch(n.rank){case 1:return rC([n,t]);case 2:return iC([n,t],0);case 3:return cC([n,t],0);case 4:return uC([n,t],0);default:throw new O(`concatAlongFirstAxis() received an unsupported tensor rank: ${n.rank}`)}}function Su(n,t){if(Array.isArray(t)||(t=[t]),n.rank!==t.length)throw new O(`The length of input n (${t.length}) does not match the number of dimensions in input x (${n.rank})`);return wn(n,t)}function gl(n,t=0,e=1,s,r){return x$(n,t,e,s,r)}function On(n,t,e,s){if(n.rank<2||t.rank<2)throw new bt(`dot requires both inputs to be rank >= 2 but got x shape = ${n.shape} and y shape = ${t.shape}`);if(t.rank>=3){const r=n.shape.slice(-1)[0],o=t.shape.slice(-2)[0];if(r!==o)throw new bt(`If rank y >= 3, then the second last dim of y must equal the last dim of x but got x shape = ${n.shape} and  y shape = ${t.shape}`)}if(n.rank===2&&t.rank===2)return uf({a:n,b:t,transposeA:!1,transposeB:!1,bias:s?Nu(n.rank,s,kn()):null,activation:e});{const r=n.shape.slice(),o=r.pop();n=M(n,[-1,o]);const i=t.shape.slice(),a=i.pop(),c=i.pop(),l=[...i,a],u=Array.from({length:t.rank},(f,m)=>m===0?t.rank-2:m<=t.rank-2?m-1:m);t=M(Ct(t,u),[c,-1]);const h=[...r,...l];return M(uf({a:n,b:t,transposeA:!1,transposeB:!1,bias:s?Nu(n.rank,s,kn()):null,activation:e}),h)}}function eb(n,t,e){return z(()=>(Array.isArray(t)?t=ze(t,"int32"):t=nt(t,"int32"),td(n,t,e)))}function Pi(n){return D(n,n)}function Nu(n,t,e){const s=t.shape;if(t.rank!==1&&t.rank!==n)throw new O(`Unexpected bias dimensions: ${t.rank}; expected it to be 1 or ${n}`);if(n===5){if(e==="channelsFirst")return s.length===1?M(t,[1,s[0],1,1,1]):M(t,[1,s[3],s[0],s[1],s[2]]);if(e==="channelsLast")return s.length===1?M(t,[1,1,1,1,s[0]]):M(t,[1].concat(s))}else if(n===4){if(e==="channelsFirst")return s.length===1?M(t,[1,s[0],1,1]):M(t,[1,s[2],s[0],s[1]]);if(e==="channelsLast")return s.length===1?M(t,[1,1,1,s[0]]):M(t,[1].concat(s))}else if(n===3){if(e==="channelsFirst")return s.length===1?M(t,[1,s[0],1]):M(t,[1,s[1],s[0]]);if(e==="channelsLast")return s.length===1?M(t,[1,1,s[0]]):M(t,[1].concat(s))}else if(n<3)return t;throw new O(`Unsupported input rank by biasAdd: ${t.rank}`)}function Sn(n,t,e){return z(()=>(e==null&&(e=kn()),te(e),J(n,Nu(n.rank,t,e))))}function dE(n,t=1){if(t!==1)throw new bt(`Support for alpha values other than 1 (${t}) is not implemented yet.`);return ol(n)}function pE(n){return z(()=>ut(n,J(le(n),1)))}function nb(n,t,e,s){return z(()=>iS(n,t,e,s))}function fE(n){return z(()=>{const t=J(.5,D(.2,n));return Ze(t,0,1)})}function Bi(n,t,e=!1){return e?n():t()}const mE=["fanIn","fanOut","fanAvg"],gE=["normal","uniform","truncatedNormal"];function xE(n){rr(mE,"FanMode",n)}function bE(n){rr(gE,"Distribution",n)}class pn extends Br{fromConfigUsesCustomObjects(){return!1}getConfig(){return{}}}class sb extends pn{apply(t,e){return he(t,e)}}sb.className="Zeros";X(sb);class Qd extends pn{apply(t,e){return Is(t,e)}}Qd.className="Ones";X(Qd);class rb extends pn{constructor(t){if(super(),typeof t!="object")throw new O(`Expected argument of type ConstantConfig but got ${t}`);if(t.value===void 0)throw new O(`config must have value set but got ${t}`);this.value=t.value}apply(t,e){return z(()=>D(ft(this.value),Is(t,e)))}getConfig(){return{value:this.value}}}rb.className="Constant";X(rb);class ob extends pn{constructor(t){super(),this.DEFAULT_MINVAL=-.05,this.DEFAULT_MAXVAL=.05,this.minval=t.minval||this.DEFAULT_MINVAL,this.maxval=t.maxval||this.DEFAULT_MAXVAL,this.seed=t.seed}apply(t,e){return ul(t,this.minval,this.maxval,e)}getConfig(){return{minval:this.minval,maxval:this.maxval,seed:this.seed}}}ob.className="RandomUniform";X(ob);class ib extends pn{constructor(t){super(),this.DEFAULT_MEAN=0,this.DEFAULT_STDDEV=.05,this.mean=t.mean||this.DEFAULT_MEAN,this.stddev=t.stddev||this.DEFAULT_STDDEV,this.seed=t.seed}apply(t,e){if(e=e||"float32",e!=="float32"&&e!=="int32")throw new bt(`randomNormal does not support dType ${e}.`);return gl(t,this.mean,this.stddev,e,this.seed)}getConfig(){return{mean:this.mean,stddev:this.stddev,seed:this.seed}}}ib.className="RandomNormal";X(ib);class ab extends pn{constructor(t){super(),this.DEFAULT_MEAN=0,this.DEFAULT_STDDEV=.05,this.mean=t.mean||this.DEFAULT_MEAN,this.stddev=t.stddev||this.DEFAULT_STDDEV,this.seed=t.seed}apply(t,e){if(e=e||"float32",e!=="float32"&&e!=="int32")throw new bt(`truncatedNormal does not support dType ${e}.`);return dx(t,this.mean,this.stddev,e,this.seed)}getConfig(){return{mean:this.mean,stddev:this.stddev,seed:this.seed}}}ab.className="TruncatedNormal";X(ab);class cb extends pn{constructor(t){super(),this.gain=t.gain!=null?t.gain:1}apply(t,e){return z(()=>{if(t.length!==2||t[0]!==t[1])throw new O("Identity matrix initializer can only be used for 2D square matrices.");return D(this.gain,Zg(t[0]))})}getConfig(){return{gain:this.gain}}}cb.className="Identity";X(cb);function yE(n,t="channelsLast"){let e,s;if(te(t),n.length===2)e=n[0],s=n[1];else if([3,4,5].indexOf(n.length)!==-1){if(t==="channelsFirst"){const r=ls(n,2);e=n[1]*r,s=n[0]*r}else if(t==="channelsLast"){const r=ls(n,0,n.length-2);e=n[n.length-2]*r,s=n[n.length-1]*r}}else{const r=ls(n);e=Math.sqrt(r),s=Math.sqrt(r)}return[e,s]}class Ge extends pn{constructor(t){if(super(),t.scale<0)throw new O(`scale must be a positive float. Got: ${t.scale}`);this.scale=t.scale==null?1:t.scale,this.mode=t.mode==null?"fanIn":t.mode,xE(this.mode),this.distribution=t.distribution==null?"normal":t.distribution,bE(this.distribution),this.seed=t.seed}apply(t,e){const s=yE(t),r=s[0],o=s[1];let i=this.scale;if(this.mode==="fanIn"?i/=Math.max(1,r):this.mode==="fanOut"?i/=Math.max(1,o):i/=Math.max(1,(r+o)/2),this.distribution==="normal"){const a=Math.sqrt(i);if(e=e||"float32",e!=="float32"&&e!=="int32")throw new bt(`${this.getClassName()} does not support dType ${e}.`);return dx(t,0,a,e,this.seed)}else{const a=Math.sqrt(3*i);return ul(t,-a,a,e)}}getConfig(){return{scale:this.scale,mode:this.mode,distribution:this.distribution,seed:this.seed}}}Ge.className="VarianceScaling";X(Ge);class tp extends Ge{constructor(t){super({scale:1,mode:"fanAvg",distribution:"uniform",seed:t==null?null:t.seed})}getClassName(){return Ge.className}}tp.className="GlorotUniform";X(tp);class ep extends Ge{constructor(t){super({scale:1,mode:"fanAvg",distribution:"normal",seed:t==null?null:t.seed})}getClassName(){return Ge.className}}ep.className="GlorotNormal";X(ep);class np extends Ge{constructor(t){super({scale:2,mode:"fanIn",distribution:"normal",seed:t==null?null:t.seed})}getClassName(){return Ge.className}}np.className="HeNormal";X(np);class sp extends Ge{constructor(t){super({scale:2,mode:"fanIn",distribution:"uniform",seed:t==null?null:t.seed})}getClassName(){return Ge.className}}sp.className="HeUniform";X(sp);class rp extends Ge{constructor(t){super({scale:1,mode:"fanIn",distribution:"normal",seed:t==null?null:t.seed})}getClassName(){return Ge.className}}rp.className="LeCunNormal";X(rp);class op extends Ge{constructor(t){super({scale:1,mode:"fanIn",distribution:"uniform",seed:t==null?null:t.seed})}getClassName(){return Ge.className}}op.className="LeCunNormal";X(op);class lb extends pn{constructor(t){if(super(),this.DEFAULT_GAIN=1,this.gain=t.gain==null?this.DEFAULT_GAIN:t.gain,this.seed=t.seed,this.seed!=null)throw new bt("Random seed is not implemented for Orthogonal Initializer yet.")}apply(t,e){return z(()=>{if(t.length<2)throw new bt("Shape must be at least 2D.");t[0]*t[1]>2e3&&console.warn(`Orthogonal initializer is being called on a matrix with more than 2000 (${t[0]*t[1]}) elements: Slowness may result.`);const s=t[0]>t[1]?[t[1],t[0]]:t,r=gl(s,0,1,"float32");let o=z2.gramSchmidt(r);return t[0]>t[1]&&(o=Ct(o)),D(this.gain,o)})}getConfig(){return{gain:this.gain,seed:this.seed}}}lb.className="Orthogonal";X(lb);const kf={constant:"Constant",glorotNormal:"GlorotNormal",glorotUniform:"GlorotUniform",heNormal:"HeNormal",heUniform:"HeUniform",identity:"Identity",leCunNormal:"LeCunNormal",leCunUniform:"LeCunUniform",ones:"Ones",orthogonal:"Orthogonal",randomNormal:"RandomNormal",randomUniform:"RandomUniform",truncatedNormal:"TruncatedNormal",varianceScaling:"VarianceScaling",zeros:"Zeros"};function $f(n,t={}){return _i(n,sn.getMap().classNameMap,t,"initializer")}function Ht(n){return Yd(n)}function Ut(n){if(typeof n=="string"){const t=n in kf?kf[n]:n;if(t==="GlorotNormal")return new ep;if(t==="GlorotUniform")return new tp;if(t==="HeNormal")return new np;if(t==="HeUniform")return new sp;if(t==="LeCunNormal")return new rp;if(t==="LeCunUniform")return new op;{const e={};return e.className=t,e.config={},$f(e)}}else return n instanceof pn?n:$f(n)}function Tu(n){return Array.isArray(n)&&Array.isArray(n[0])}function Ma(n){return n.length===0?[]:Array.isArray(n[0])?n:[n]}function gt(n){let t;if(Array.isArray(n)){if(n.length!==1)throw new O(`Expected Tensor length to be 1; got ${n.length}`);t=n[0]}else t=n;return t}function Rt(n){if(Array.isArray(n)&&Array.isArray(n[0])){if(n.length===1)return n=n,n[0];throw new O(`Expected exactly 1 Shape; got ${n.length}`)}else return n}function La(n){let t=0;for(const e of n)e.shape.length===0?t+=1:t+=e.shape.reduce((s,r)=>s*r);return t}const Sf="Variable";class wE{constructor(t,e="float32",s=Sf,r=!0,o=null){this.dtype=e??"float32",this.shape=t.shape,this.id=Yx(),s=s??Sf,this.originalName=Jx(s),this.name=Qx(this.originalName),this.trainable_=r,this.constraint=o,this.val=sS(t,this.trainable_,this.name,this.dtype)}read(){return this.assertNotDisposed(),this.val}write(t){return this.assertNotDisposed(),IE(this.val,t),this.val.id!==t.id&&(this.val.assign(t),this.constraint!=null&&this.val.assign(this.constraint.apply(this.val))),this}dispose(){this.assertNotDisposed(),this.val.dispose()}assertNotDisposed(){if(this.val.isDisposed)throw new Error(`LayersVariable ${this.name} is already disposed.`)}get trainable(){return this.trainable_}set trainable(t){this.trainable_=t,this.val.trainable=t}}function IE(n,t){if(n.shape.toString()!==t.shape.toString())throw new Error("Shape mismatch: "+JSON.stringify(n.shape)+" vs. "+JSON.stringify(t.shape))}function Eu(n){return n.map(t=>t.read())}function ip(n){n.forEach(t=>{t[0].write(t[1])})}class oe{constructor(t){this.dtype=t.dtype,this.shape=t.shape,t.shape!=null?this.ndim=t.shape.length:this.ndim=t.ndim,this.maxNDim=t.maxNDim,this.minNDim=t.minNDim,this.axes=t.axes||{}}}class Rn{constructor(t,e,s,r,o,i,a){this.dtype=t,this.shape=e,this.sourceLayer=s,this.inputs=r,this.callArgs=o,this.outputTensorIndex=a,this.id=Yx(),i!=null&&(this.originalName=Jx(i),this.name=Qx(this.originalName)),this.rank=e.length}}let vE=0;class xl{constructor(t,e){this.callArgs=e,this.id=vE++,this.outboundLayer=t.outboundLayer,this.inboundLayers=t.inboundLayers,this.nodeIndices=t.nodeIndices,this.tensorIndices=t.tensorIndices,this.inputTensors=t.inputTensors,this.outputTensors=t.outputTensors,this.inputMasks=t.inputMasks,this.outputMasks=t.outputMasks,this.inputShapes=t.inputShapes,this.outputShapes=t.outputShapes;for(const s of t.inboundLayers)s?.outboundNodes.push(this);t.outboundLayer.inboundNodes.push(this)}getConfig(){const t=[];for(const e of this.inboundLayers)e!=null?t.push(e.name):t.push(null);return{outboundLayer:this.outboundLayer?this.outboundLayer.name:null,inboundLayers:t,nodeIndices:this.nodeIndices,tensorIndices:this.tensorIndices}}}let CE=0;class kt extends Br{constructor(t={}){super(),this._callHook=null,this._addedWeightNames=[],this._stateful=!1,this.id=CE++,this.activityRegularizer=null,this.inputSpec=null,this.supportsMasking=!1,this._trainableWeights=[],this._nonTrainableWeights=[],this._losses=[],this._updates=[],this._built=!1,this.inboundNodes=[],this.outboundNodes=[];let e=t.name;if(!e){const s=this.getClassName();e=Wn(s)+"_"+ml(s)}if(this.name=e,this.trainable_=t.trainable==null?!0:t.trainable,t.inputShape!=null||t.batchInputShape!=null){let s;if(t.batchInputShape!=null)s=t.batchInputShape;else if(t.inputShape!=null){let o=null;t.batchSize!=null&&(o=t.batchSize),s=[o].concat(t.inputShape)}this.batchInputShape=s;let r=t.dtype;r==null&&(r=t.inputDType),r==null&&(r="float32"),this.dtype=r}t.weights!=null?this.initialWeights=t.weights:this.initialWeights=null,this._refCount=null,this.fastWeightInitDuringBuild=!1}static nodeKey(t,e){return t.name+"_ib-"+e.toString()}getNodeAtIndex(t,e){if(this.inboundNodes.length===0)throw new rn(`The layer has never been called and thus has no defined ${e}.`);if(this.inboundNodes.length<=t)throw new O(`Asked to get ${e} at node ${t}, but the layer has only ${this.inboundNodes.length} inbound nodes.`);return this.inboundNodes[t]}getInputAt(t){return Oe(this.getNodeAtIndex(t,"input").inputTensors)}getOutputAt(t){return Oe(this.getNodeAtIndex(t,"output").outputTensors)}get input(){if(this.inboundNodes.length>1)throw new Nn(`Layer ${this.name} has multiple inbound nodes, hence the notion of "layer input" is ill-defined. Use \`getInputAt(nodeIndex)\` instead.`);if(this.inboundNodes.length===0)throw new Nn(`Layer ${this.name} is not connected, no input to return.`);return Oe(this.getNodeAtIndex(0,"input").inputTensors)}get output(){if(this.inboundNodes.length===0)throw new Nn(`Layer ${this.name} has no inbound nodes.`);if(this.inboundNodes.length>1)throw new Nn(`Layer ${this.name} has multiple inbound nodes, hence the notion of "layer output" is ill-defined. Use \`getOutputAt(nodeIndex)\` instead.`);return Oe(this.getNodeAtIndex(0,"output").outputTensors)}get losses(){return this._losses}calculateLosses(){return this.losses.map(t=>t())}get updates(){return this._updates}get built(){return this._built}set built(t){this._built=t}get trainable(){return this.trainable_}set trainable(t){this._trainableWeights.forEach(e=>e.trainable=t),this.trainable_=t}get trainableWeights(){return this.trainable_?this._trainableWeights.filter(t=>t.trainable):[]}set trainableWeights(t){this._trainableWeights=t}get nonTrainableWeights(){return this.trainable?this._trainableWeights.filter(t=>!t.trainable).concat(this._nonTrainableWeights):this._trainableWeights.concat(this._nonTrainableWeights)}set nonTrainableWeights(t){this._nonTrainableWeights=t}get weights(){return this.trainableWeights.concat(this.nonTrainableWeights)}get stateful(){return this._stateful}resetStates(){if(!this.stateful)throw new Error("Cannot call the resetStates() method of a non-stateful Layer object.")}assertInputCompatibility(t){if(t=Vt(t),this.inputSpec==null||this.inputSpec.length===0)return;const e=Vt(this.inputSpec);if(t.length!==e.length)throw new O(`Layer ${this.name} expects ${e.length} inputs, but it received ${t.length} input tensors. Input received: ${t}`);for(let s=0;s<t.length;s++){const r=t[s],o=e[s];if(o==null)continue;const i=r.rank;if(o.ndim!=null&&i!==o.ndim)throw new O(`Input ${s} is incompatible with layer ${this.name}: expected ndim=${o.ndim}, found ndim=${i}`);if(o.maxNDim!=null&&i>o.maxNDim)throw new O(`Input ${s} is incompatible with layer ${this.name}: expected max_ndim=${o.maxNDim}, found ndim=${i}`);if(o.minNDim!=null&&i<o.minNDim)throw new O(`Input ${s} is incompatible with layer ${this.name}: expected min_ndim=${o.minNDim}, found ndim=${i}.`);if(o.dtype!=null&&r.dtype!==o.dtype)throw new O(`Input ${s} is incompatible with layer ${this.name} : expected dtype=${o.dtype}, found dtype=${r.dtype}.`);if(o.axes){const a=r.shape;for(const c in o.axes){const l=Number(c),u=o.axes[c],h=l>=0?a[l]:a[a.length+l];if(u!=null&&[u,null].indexOf(h)===-1)throw new O(`Input ${s} is incompatible with layer ${this.name}: expected axis ${l} of input shape to have value ${u} but got shape ${a}.`)}}if(o.shape!=null)for(let a=0;a<o.shape.length;++a){const c=o.shape[a],l=r.shape[a];if(c!=null&&l!=null&&c!==l)throw new O(`Input ${s} is incompatible with layer ${this.name}: expected shape=${o.shape}, found shape=${r.shape}.`)}}}call(t,e){return t}invokeCallHook(t,e){this._callHook!=null&&this._callHook(t,e)}setCallHook(t){this._callHook=t}clearCallHook(){this._callHook=null}apply(t,e){e=e||{},this.assertNotDisposed();const s=Vt(t);let r=!0;for(const i of s)if(!(i instanceof Rn)){r=!1;break}let o=!0;for(const i of s)if(i instanceof Rn){o=!1;break}if(r===o)throw new O("Arguments to apply() must be all SymbolicTensors or all Tensors");return Ws(this.name,()=>{if(!this.built){this.assertInputCompatibility(t);const i=[];for(const a of Vt(t))i.push(a.shape);this.build(Oe(i)),this.built=!0,this.initialWeights&&this.setWeights(this.initialWeights),this._refCount===null&&o&&(this._refCount=1)}if(this.assertInputCompatibility(t),o){let i=this.call(t,e);const a=Vt(i),c=[];for(let l of a)s.indexOf(l)!==-1&&(l=l.clone()),c.push(l);if(i=Oe(c),this.activityRegularizer!=null)throw new bt("Layer invocation in the presence of activity regularizer(s) is not supported yet.");return i}else{const i=kE(t),a=this.computeOutputShape(i);let c;const l=$E(t);if(this.warnOnIncompatibleInputShape(Array.isArray(t)?i[0]:i),a!=null&&a.length>0&&Array.isArray(a[0])?c=a.map((u,h)=>new Rn(l,u,this,Vt(t),e,this.name,h)):c=new Rn(l,a,this,Vt(t),e,this.name),this.addInboundNode(t,c,null,null,i,a,e),this._refCount++,this.activityRegularizer!=null)throw new bt("Layer invocation in the presence of activity regularizer(s) is not supported yet.");return c}})}warnOnIncompatibleInputShape(t){if(this.batchInputShape!=null)if(t.length!==this.batchInputShape.length)console.warn(`The rank of the input tensor provided (shape: ${JSON.stringify(t)}) does not match that of the batchInputShape (${JSON.stringify(this.batchInputShape)}) of the layer ${this.name}`);else{let e=!1;this.batchInputShape.forEach((s,r)=>{s!=null&&t[r]!=null&&t[r]!==s&&(e=!0)}),e&&console.warn(`The shape of the input tensor (${JSON.stringify(t)}) does not match the expectation of layer ${this.name}: ${JSON.stringify(this.batchInputShape)}`)}}get outputShape(){if(this.inboundNodes==null||this.inboundNodes.length===0)throw new Nn(`The layer ${this.name} has never been called and thus has no defined output shape.`);const t=[];for(const e of this.inboundNodes){const s=JSON.stringify(e.outputShapes);t.indexOf(s)===-1&&t.push(s)}if(t.length===1){const e=this.inboundNodes[0].outputShapes;return Array.isArray(e)&&Array.isArray(e[0])&&e.length===1?e[0]:e}else throw new Nn(`The layer ${this.name} has multiple inbound nodes with different output shapes. Hence the notion of "output shape" is ill-defined for the layer.`)}countParams(){if(!this.built)throw new rn(`You tried to call countParams() on ${this.name}, but the layer is not built yet. Build it first by calling build(batchInputShape).`);return La(this.weights)}build(t){this.built=!0}getWeights(t=!1){return Eu(t?this.trainableWeights:this.weights)}setWeights(t){z(()=>{const e=this.weights;if(e.length!==t.length)throw new O(`You called setWeights(weights) on layer "${this.name}" with a weight list of length ${t.length}, but the layer was expecting ${e.length} weights. Provided weights: ${t}...`);if(e.length===0)return;const s=[],r=Eu(e);for(let o=0;o<r.length;++o){const i=r[o],a=e[o],c=t[o];if(!Tt(i.shape,c.shape))throw new O(`Layer weight shape ${i.shape} not compatible with provided weight shape ${c.shape}`);s.push([a,c])}ip(s)})}addWeight(t,e,s,r,o,i,a,c){if(this._addedWeightNames.indexOf(t)!==-1)throw new O(`Duplicate weight name ${t} for layer ${this.name}`);this._addedWeightNames.push(t),s==null&&(s="float32"),this.fastWeightInitDuringBuild&&(r=c!=null?c():Ut("zeros"));const l=r.apply(e,s),u=new wE(l,s,t,i,a);return l.dispose(),o!=null&&this.addLoss(()=>o.apply(u.read())),i==null&&(i=!0),i?this._trainableWeights.push(u):this._nonTrainableWeights.push(u),u}setFastWeightInitDuringBuild(t){this.fastWeightInitDuringBuild=t}addLoss(t){t==null||Array.isArray(t)&&t.length===0||(t=Vt(t),this._losses!==void 0&&this._losses!==null&&this.losses.push(...t))}computeOutputShape(t){return t}computeMask(t,e){if(!this.supportsMasking){if(e!=null)if(Array.isArray(e))e.forEach(s=>{if(s!=null)throw new TypeError(`Layer ${this.name} does not support masking, but was passed an inputMask.`)});else throw new TypeError(`Layer ${this.name} does not support masking, but was passed an inputMask.`);return null}return e}addInboundNode(t,e,s,r,o,i,a=null){const c=Vt(t);e=Vt(e),s=Vt(s),r=Vt(r),o=Ma(o),i=Ma(i);const l=[],u=[],h=[];for(const d of c)l.push(d.sourceLayer),u.push(d.nodeIndex),h.push(d.tensorIndex);new xl({outboundLayer:this,inboundLayers:l,nodeIndices:u,tensorIndices:h,inputTensors:c,outputTensors:e,inputMasks:s,outputMasks:r,inputShapes:o,outputShapes:i},a);for(let d=0;d<e.length;d++)e[d].sourceLayer=this,e[d].nodeIndex=this.inboundNodes.length-1,e[d].tensorIndex=d}getConfig(){const t={name:this.name,trainable:this.trainable};return this.batchInputShape!=null&&(t.batchInputShape=this.batchInputShape),this.dtype!=null&&(t.dtype=this.dtype),t}disposeWeights(){return this.weights.forEach(t=>t.dispose()),this.weights.length}assertNotDisposed(){if(this._refCount===0)throw new Error(`Layer '${this.name}' is already disposed.`)}dispose(){if(!this.built)throw new Error(`Cannot dispose Layer ${this.name} because it has not been built yet.`);if(this._refCount===null)throw new Error(`Cannot dispose Layer ${this.name} because it has not been used yet.`);this.assertNotDisposed();let t=0;return--this._refCount===0&&(t=this.disposeWeights()),{refCountAfterDispose:this._refCount,numDisposedVariables:t}}}function kE(n){n=Vt(n);const t=[];for(const e of n)t.push(e.shape);return Oe(t)}function $E(n){return"float32"}function ub(n,t,e){if((t==null||e!=null&&e>0)&&(t=n.sourceLayer,e=n.nodeIndex),t.inboundNodes.length===0)return[n];{const s=t.inboundNodes[e];if(s.inboundLayers.length===0)return s.inputTensors;{const r=[];for(let o=0;o<s.inboundLayers.length;o++){const i=s.inputTensors[o],a=s.inboundLayers[o],c=s.nodeIndices[o],l=ub(i,a,c);for(const u of l)r.indexOf(u)===-1&&r.push(u)}return r}}}class zi extends kt{constructor(t){if(super({dtype:t.dtype,name:t.name!=null?t.name:ml("input").toString()}),t.batchSize==null&&(t.batchSize=null),t.sparse==null&&(t.sparse=!1),this.trainable=!1,this.built=!0,this.sparse=t.sparse,t.inputShape!=null&&t.batchInputShape!=null)throw new O("Only provide the inputShape OR batchInputShape argument to inputLayer, not both at the same time.");let e=t.batchInputShape;if(e==null){if(t.inputShape==null)throw new O("An InputLayer should be passed either a `batchInputShape` or an `inputShape`.");e=[t.batchSize].concat(t.inputShape)}else if(t.batchSize!=null)throw new O("Cannot specify batchSize if batchInputShape is specified when creating an InputLayer.");const s=t.dtype||"float32";this.batchInputShape=e,this.dtype=s,this.inputSpec=[{shape:e}];const r=new Rn(this.dtype,this.batchInputShape,this,[],{},this.name);r.nodeIndex=0,r.tensorIndex=0,new xl({outboundLayer:this,inboundLayers:[],nodeIndices:[],tensorIndices:[],inputTensors:[r],outputTensors:[r],inputMasks:[null],outputMasks:[null],inputShapes:[e],outputShapes:[e]})}apply(t,e){throw new O(`Cannot pass any input to an InputLayer's apply() method. InputLayer name: ${this.name}`)}dispose(){return{refCountAfterDispose:this._refCount,numDisposedVariables:0}}getConfig(){return{batchInputShape:this.batchInputShape,dtype:this.dtype,sparse:this.sparse,name:this.name}}}zi.className="InputLayer";X(zi);function SE(n){if(n.batchShape==null&&n.shape==null)throw new Error("Please provide to Input either a `shape` or a `batchShape` argument. Note that `shape` does not include the batch dimension.");if(n.batchShape!=null&&n.shape!=null)throw new O("Please provide either a `shape` or `batchShape` argument to Input, but not both.");let t=n.batchShape;n.shape!=null&&t==null&&(t=[null].concat(n.shape));let e=n.dtype;return e==null&&(e="float32"),new zi({batchInputShape:t,name:n.name,dtype:e,sparse:n.sparse}).inboundNodes[0].outputTensors[0]}function NE(n,t){if(n.dtype==null||n.dtype===t.dtype)return t;try{return nt(t,n.dtype)}catch{throw new O(`The dtype of the feed (${t.dtype}) can not be cast to the dtype of the key '${n.name}' (${n.dtype}).`)}}class os{constructor(t){if(this.id2Value={},this.id2Mask={},this.name2Id={},t instanceof os)for(const e in t.id2Value)this.id2Value[e]=t.id2Value[e],e in t.id2Mask&&(this.id2Mask[e]=t.id2Mask[e]);else{if(t==null)return;for(const e of t)this.add(e.key,e.value)}}add(t,e,s){if(this.id2Value[t.id]==null)this.id2Value[t.id]=NE(t,e),this.name2Id[t.name]=t.id,s!=null&&(this.id2Mask[t.id]=s);else throw new O(`Duplicate key: name=${t.name}, id=${t.id}`);return this}addFeed(t){this.add(t.key,t.value)}hasKey(t){return this.id2Value[t.id]!=null}names(){return Object.keys(this.name2Id)}getValue(t){if(t instanceof Rn){if(this.id2Value[t.id]==null)throw new O(`Nonexistent key: ${t.name}`);return this.id2Value[t.id]}else{const e=this.name2Id[t];if(e==null)throw new O(`Feed dict has no SymbolicTensor name: ${t}`);return this.id2Value[e]}}getMask(t){if(t instanceof Rn){if(this.id2Value[t.id]==null)throw new O(`Nonexistent key: ${t.name}`);return this.id2Mask[t.id]}else{const e=this.name2Id[t];if(e==null)throw new O(`Feed dict has no SymbolicTensor name: ${t}`);return this.id2Mask[e]}}disposeMasks(){this.id2Mask!=null&&It(this.id2Mask)}}const Pa=new Kx,Ba=new Kx;function TE(n){Pa?.setMaxEntries(n),Ba?.setMaxEntries(n)}function ho(n,t,e,s){const r=e==null?!1:e.training,o=Array.isArray(n),i=o?n:[n],a=i.map(f=>f.name),c=[],l=t.names();for(const f of a)l.indexOf(f)!==-1?c.push(t.getValue(f)):c.push(null);const u=a.join(",")+"|"+t.names().sort().join(",");let h=Pa.get(u),d;if(h==null){const f=EE(i,t);h=f.sorted,d=f.recipientCounts,Pa.put(u,h),Ba.put(u,d)}d={},r||Object.assign(d,Ba.get(u));const p=new os(t);for(let f=0;f<h.length;++f){const m=h[f],g=m.sourceLayer;if(g instanceof zi)continue;const x=[],b=[],w=[];let y=!1;for(const $ of m.inputs){const k=p.getValue($),v=p.getMask($);x.push(k),b.push(v),v!=null&&(y=!0),r||(d[$.name]--,d[$.name]===0&&!t.hasKey($)&&a.indexOf($.name)===-1&&!k.isDisposed&&$.sourceLayer.stateful!==!0&&w.push(k))}y&&(e=e||{},e.mask=b[0]);const I=Vt(g.apply(x,e));let C=null;g.supportsMasking&&(C=g.computeMask(x,b));const N=DE(m),T=Array.isArray(N)?N:[N];for(let $=0;$<T.length;++$){p.hasKey(T[$])||p.add(T[$],I[$],Array.isArray(C)?C[0]:C);const k=a.indexOf(T[$].name);k!==-1&&(c[k]=I[$])}r||It(w)}return p.disposeMasks(),o?c:c[0]}function EE(n,t){S(n!=null&&n.length>0,()=>"Expected at least one fetch, got none");let e=[],s={};if(n.length===1){const r=Nf(n[0],t);e=r.sorted,s=r.recipientMap}else{const r=new Set;for(const o of n){const{sorted:i,recipientMap:a}=Nf(o,t);for(const c of i)r.has(c.name)||(e.push(c),r.add(c.name));for(const c in a)s[c]==null&&(s[c]=new Set),a[c].forEach(l=>s[c].add(l))}}return{sorted:e,recipientCounts:RE(s)}}function RE(n){const t={};for(const e in n)t[e]=n[e].size;return t}function Nf(n,t){const e=new Set,s=[],r={};for(const a of t.names())e.add(a);const o=[],i=[];for(o.push(n);o.length>0;){const a=o[o.length-1];if(e.has(a.name)){o.pop();continue}const c=i[i.length-1]===o.length-1;if(a.inputs.length===0||c)o.pop(),s.push(a),e.add(a.name),c&&i.pop();else{i.push(o.length-1);for(const l of a.inputs)r[l.name]==null&&(r[l.name]=new Set),r[l.name].add(a.name),!e.has(l.name)&&o.push(l)}}return{sorted:s,recipientMap:r}}function DE(n){let t;if(n.sourceLayer.inboundNodes.length===1)t=n.sourceLayer.output;else{let e=null;for(let s=0;s<n.sourceLayer.inboundNodes.length;++s)for(const r of n.sourceLayer.inboundNodes[s].outputTensors)if(r.id===n.id){e=s;break}t=n.sourceLayer.getOutputAt(e)}return t}const AE=W();AE.registerFlag("TOPOLOGICAL_SORT_CACHE_MAX_ENTRIES",()=>100,TE);function ap(n,t){return z(()=>Ee(it(D(n,n),t,!0)))}class Vi extends Br{getConfig(){return{}}}class hb extends Vi{constructor(t){super(),this.defaultMaxValue=2,this.defaultAxis=0,this.maxValue=t.maxValue!=null?t.maxValue:this.defaultMaxValue,this.axis=t.axis!=null?t.axis:this.defaultAxis}apply(t){return z(()=>{const e=ap(t,this.axis),s=Ze(e,0,this.maxValue);return D(t,ut(s,J(re(),e)))})}getConfig(){return{maxValue:this.maxValue,axis:this.axis}}}hb.className="MaxNorm";X(hb);class db extends Vi{constructor(t){super(),this.defaultAxis=0,this.axis=t.axis!=null?t.axis:this.defaultAxis}apply(t){return z(()=>ut(t,J(re(),ap(t,this.axis))))}getConfig(){return{axis:this.axis}}}db.className="UnitNorm";X(db);class pb extends Vi{apply(t){return Yn(t)}}pb.className="NonNeg";X(pb);class fb extends Vi{constructor(t){super(),this.defaultMinValue=0,this.defaultMaxValue=1,this.defaultRate=1,this.defaultAxis=0,this.minValue=t.minValue!=null?t.minValue:this.defaultMinValue,this.maxValue=t.maxValue!=null?t.maxValue:this.defaultMaxValue,this.rate=t.rate!=null?t.rate:this.defaultRate,this.axis=t.axis!=null?t.axis:this.defaultAxis}apply(t){return z(()=>{const e=ap(t,this.axis),s=J(D(this.rate,Ze(e,this.minValue,this.maxValue)),D(1-this.rate,e));return D(t,ut(s,J(re(),e)))})}getConfig(){return{minValue:this.minValue,maxValue:this.maxValue,rate:this.rate,axis:this.axis}}}fb.className="MinMaxNorm";X(fb);const Tf={maxNorm:"MaxNorm",minMaxNorm:"MinMaxNorm",nonNeg:"NonNeg",unitNorm:"UnitNorm"};function ie(n){return Yd(n)}function Ef(n,t={}){return _i(n,sn.getMap().classNameMap,t,"constraint")}function ae(n){if(n==null)return null;if(typeof n=="string"){const e={className:n in Tf?Tf[n]:n,config:{}};return Ef(e)}else return n instanceof Vi?n:Ef(n)}async function Es(n){if(n==null)return;const t=[],e=[],s=[];for(const r in n){const o=n[r];if(typeof o!="number"){const i=o;t.push(i.data()),e.push(r),s.push(i)}}if(t.length>0){const r=await Promise.all(t);for(let o=0;o<r.length;++o)n[e[o]]=r[o][0];It(s)}}function mb(n){if(n!=null)for(const t in n){const e=n[t];typeof e!="number"&&e.dispose()}}var Rf;(function(n){n[n.SILENT=0]="SILENT",n[n.VERBOSE=1]="VERBOSE"})(Rf||(Rf={}));const FE=125;class Io{constructor(){this.validationData=null}setParams(t){this.params=t}async onEpochBegin(t,e){}async onEpochEnd(t,e){}async onBatchBegin(t,e){}async onBatchEnd(t,e){}async onTrainBegin(t){}async onTrainEnd(t){}setModel(t){}}class OE{constructor(t,e=10){t==null&&(t=[]),this.callbacks=t,this.queueLength=e}append(t){this.callbacks.push(t)}setParams(t){for(const e of this.callbacks)e.setParams(t)}setModel(t){for(const e of this.callbacks)e.setModel(t)}async onEpochBegin(t,e){e==null&&(e={});for(const s of this.callbacks)await s.onEpochBegin(t,e)}async onEpochEnd(t,e){e==null&&(e={});for(const s of this.callbacks)await s.onEpochEnd(t,e)}async onBatchBegin(t,e){e==null&&(e={});for(const s of this.callbacks)await s.onBatchBegin(t,e)}async onBatchEnd(t,e){e==null&&(e={});for(const s of this.callbacks)await s.onBatchEnd(t,e)}async onTrainBegin(t){t==null&&(t={});for(const e of this.callbacks)await e.onTrainBegin(t)}async onTrainEnd(t){t==null&&(t={});for(const e of this.callbacks)await e.onTrainEnd(t)}}class _E extends Io{constructor(){super()}async onEpochBegin(t){this.seen=0,this.totals={}}async onBatchEnd(t,e){e==null&&(e={});const s=e.size==null?0:e.size;this.seen+=s;for(const r in e){const o=e[r];if(typeof o=="number")this.totals.hasOwnProperty(r)||(this.totals[r]=0),this.totals[r]=this.totals[r]+o*s;else{let i;r in this.totals?i=this.totals[r]:this.totals[r]=0;const a=z(()=>J(this.totals[r],D(o,s)));this.totals[r]=a,i?.dispose()}}}async onEpochEnd(t,e){if(e!=null)for(const s of this.params.metrics)this.totals[s]!=null&&(typeof this.totals[s]=="number"?e[s]=this.totals[s]/this.seen:z(()=>{const r=D(ut(1,this.seen),this.totals[s]);e[s]=r,this.totals[s].dispose(),Mn(e[s])}))}}class ME extends Io{async onTrainBegin(t){this.epoch=[],this.history={}}async onEpochEnd(t,e){e==null&&(e={}),this.epoch.push(t);for(const s in e)this.history[s]==null&&(this.history[s]=[]),this.history[s].push(e[s])}async syncData(){const t=[],e=[],s=[];for(const o in this.history){const i=this.history[o];for(let a=0;a<i.length;++a)if(typeof i[a]!="number"){const c=i[a];t.push(c.data()),e.push(o),s.push(a)}}const r=await Promise.all(t);for(let o=0;o<r.length;++o)this.history[e[o]][s[o]].dispose(),this.history[e[o]][s[o]]=r[o][0]}}class LE extends Io{constructor(t,e){if(super(),this.currentEpoch=0,this.nowFunc=t.nowFunc,this.nextFrameFunc=t.nextFrameFunc||wx,this.yieldEvery=e||"auto",this.yieldEvery==="auto"&&(this.yieldEvery=FE),this.yieldEvery==="never"&&t.onYield!=null)throw new Error("yieldEvery is `never` but you provided an `onYield` callback. Either change `yieldEvery` or remove the callback");ou(this.yieldEvery)&&(this.maybeWait=JT(this.maybeWait.bind(this),this.yieldEvery,this.nowFunc)),this.trainBegin=t.onTrainBegin,this.trainEnd=t.onTrainEnd,this.epochBegin=t.onEpochBegin,this.epochEnd=t.onEpochEnd,this.batchBegin=t.onBatchBegin,this.batchEnd=t.onBatchEnd,this.yield=t.onYield}async maybeWait(t,e,s){const r=[];this.yield!=null&&(await Es(s),r.push(this.yield(t,e,s))),r.push(this.nextFrameFunc()),await Promise.all(r)}async onEpochBegin(t,e){this.currentEpoch=t,this.epochBegin!=null&&(await Es(e),await this.epochBegin(t,e))}async onEpochEnd(t,e){const s=[];this.epochEnd!=null&&(await Es(e),s.push(this.epochEnd(t,e))),this.yieldEvery==="epoch"&&s.push(this.nextFrameFunc()),await Promise.all(s)}async onBatchBegin(t,e){this.batchBegin!=null&&(await Es(e),await this.batchBegin(t,e))}async onBatchEnd(t,e){const s=[];this.batchEnd!=null&&(await Es(e),s.push(this.batchEnd(t,e))),this.yieldEvery==="batch"?s.push(this.nextFrameFunc()):ou(this.yieldEvery)&&s.push(this.maybeWait(this.currentEpoch,t,e)),await Promise.all(s)}async onTrainBegin(t){this.trainBegin!=null&&(await Es(t),await this.trainBegin(t))}async onTrainEnd(t){this.trainEnd!=null&&(await Es(t),await this.trainEnd(t))}}function gb(n,t){return n==null&&(n={}),n instanceof Io?[n]:Array.isArray(n)&&n[0]instanceof Io?n:Vt(n).map(s=>new LE(s,t))}class en{constructor(){}static registerCallbackConstructor(t,e){S(t>=0&&Number.isInteger(t),()=>`Verbosity level is expected to be an integer >= 0, but got ${t}`),en.checkForDuplicate(e),en.constructors[t]==null&&(en.constructors[t]=[]),en.constructors[t].push(e)}static checkForDuplicate(t){for(const e in en.constructors)en.constructors[+e].forEach(r=>{if(r===t)throw new O("Duplicate callback constructor.")})}static clear(){en.constructors={}}static createCallbacks(t){const e=[];for(const s in en.constructors){const r=+s;t>=r&&e.push(...en.constructors[r])}return e.map(s=>new s)}}en.constructors={};function xb(n,t,e,s,r,o,i,a,c){const l=new ME,u=[new _E,...en.createCallbacks(t)];n!=null&&u.push(...n),u.push(l);const h=new OE(u);return h.setParams({epochs:e,initialEpoch:s,samples:r,steps:o,batchSize:i,verbose:t,doValidation:a,metrics:c}),{callbackList:h,history:l}}function Hn(n,t={},e=!1){return _i(n,sn.getMap().classNameMap,t,"layer",e)}function za(n,t){return z(()=>{n.dtype!=="float32"&&(n=nt(n,"float32"));const e=it(Pi(n),t,!0),s=Ti(e.shape,re()),r=Ee(ws(e,s));return ut(n,r)})}function bl(n,t){return z(()=>Yt(Pi(at(t,n)),-1))}function cp(n,t){return z(()=>Yt(le(at(t,n)),-1))}function lp(n,t){return z(()=>{const e=at(n,t),s=Ze(le(n),re(),Number.MAX_VALUE),r=le(ut(e,s));return D(100,Yt(r,-1))})}function PE(n,t){return z(()=>{const e=Ze(t,re(),Number.MAX_VALUE),s=cn(J(1,e)),r=Ze(n,re(),Number.MAX_VALUE),o=cn(J(1,r));return Yt(Pi(at(s,o)),-1)})}function BE(n,t){return z(()=>{const e=ws(0,at(1,D(n,t)));return Yt(Pi(e),-1)})}function zE(n,t){return z(()=>{const e=ws(0,at(1,D(n,t)));return Yt(e,-1)})}function VE(n,t){return z(()=>{const e=it(D(n,t),-1),s=An(D(at(1,n),t),-1);return ws(0,J(1,at(s,e)))})}function WE(n,t){return z(()=>{const e=Math.log(2),s=at(t,n),r=at(J(s,Ei(D(-2,s))),e);return Yt(r,-1)})}function vo(n,t,e=!1){return z(()=>{if(e)t=dd(t);else{const s=it(t,t.shape.length-1,!0);t=ut(t,s)}return t=Ze(t,re(),1-re()),qt(it(D(nt(n,"float32"),cn(t)),t.shape.length-1))})}function Va(n,t,e=!1){return z(()=>{const s=nt(al(uE(n)),"int32");t=Ze(t,re(),1-re());const r=t.shape,o=M(Dg(s,r[r.length-1]),r);return vo(o,t,e)})}function UE(n,t){if(!Tt(n.shape,t.shape))throw new O(`logits and labels must have the same shape, but got shapes ${JSON.stringify(n.shape)} and ${JSON.stringify(t.shape)}`);return z(()=>{const e=Yn(t),s=qt(le(t));return J(at(e,D(t,n)),nd(an(s)))})}function yl(n,t){return z(()=>{let e;return e=Ze(t,re(),1-re()),e=cn(ut(e,at(1,e))),Yt(UE(n,e),-1)})}function GE(n,t){return z(()=>{const e=Ze(n,re(),1),s=Ze(t,re(),1);return it(D(n,cn(ut(e,s))),-1)})}function HE(n,t){return z(()=>{const e=cn(J(re(),t));return Yt(at(t,D(n,e)),-1)})}function bb(n,t){return z(()=>{const e=za(n,-1),s=za(t,-1),r=D(e,s);return qt(it(r,-1))})}const Wa={meanSquaredError:bl,meanAbsoluteError:cp,meanAbsolutePercentageError:lp,meanSquaredLogarithmicError:PE,squaredHinge:BE,hinge:zE,categoricalHinge:VE,logcosh:WE,categoricalCrossentropy:vo,sparseCategoricalCrossentropy:Va,binaryCrossentropy:yl,kullbackLeiblerDivergence:GE,poisson:HE,cosineProximity:bb};function Gl(n){if(typeof n=="string"){if(n in Wa)return Wa[n];let t=`Unknown loss ${n}`;throw n.toLowerCase().includes("softmaxcrossentropy")&&(t=`Unknown loss ${n}. Use "categoricalCrossentropy" as the string name for tf.losses.softmaxCrossEntropy`),new O(t)}else return n}function yb(n,t){return z(()=>{const e=D(.5,ln(t)),s=Mi(dn(t,e),n.dtype);return Yt(Ln(n,s),-1)})}function wb(n,t){return z(()=>Mi(Ln(yo(n,-1),yo(t,-1)),"float32"))}function qE(n,t){return z(()=>nt(it(qn(Ln(n,1),Ln(t,1))),"float32"))}function KE(n,t){return z(()=>nt(it(qn(Ln(n,0),Ln(t,1))),"float32"))}function jE(n,t){return z(()=>{const e=qE(n,t),s=KE(n,t),r=J(e,s);return nt(Ue(dn(r,0),ut(e,r),0),"float32")})}function XE(n,t){return yl(n,t)}function YE(n,t){return n.rank===t.rank&&(n=Ri(n,[n.rank-1])),t=yo(t,-1),t.dtype!==n.dtype&&(t=nt(t,n.dtype)),nt(Ln(n,t),"float32")}const ZE=bl,JE=bl,QE=cp,tR=cp,eR=lp,nR=lp,Ib=vo,sR=bb,vb=Va,Ua={binaryAccuracy:yb,categoricalAccuracy:wb,precision:jE,categoricalCrossentropy:Ib,sparseCategoricalCrossentropy:vb,mse:ZE,MSE:JE,mae:QE,MAE:tR,mape:eR,MAPE:nR,cosine:sR};function rR(n){if(typeof n=="string"&&n in Ua)return Ua[n];if(typeof n!="string"&&n!=null)return n;throw new O(`Unknown metric ${n}`)}function ra(n){if(Tn(n!==null,`Unknown LossOrMetricFn ${n}`),typeof n=="string")return n;{let t;for(const e of Object.keys(Wa))if(Wa[e]===n){t=e;break}if(t!==void 0)return t;for(const e of Object.keys(Ua))if(Ua[e]===n){t=e;break}return t!==void 0?t:n.name}}function oR(n){const t={Adagrad:()=>lr.adagrad(.01),Adadelta:()=>lr.adadelta(1,.95,re()),Adam:()=>lr.adam(.001,.9,.999,re()),Adamax:()=>lr.adamax(.002,.9,.999,re(),0),RMSProp:()=>lr.rmsprop(.001,.9,0,re()),SGD:()=>lr.sgd(.01)};if(t.adagrad=t.Adagrad,t.adadelta=t.Adadelta,t.adam=t.Adam,t.adamax=t.Adamax,t.rmsprop=t.RMSProp,t.sgd=t.SGD,n in t)return t[n]();throw new O(`Unknown Optimizer ${n}`)}const Df=1*1024*1024;function Af(n,t,e=!1){if(n==null||typeof n!="object"||Object.getPrototypeOf(n)!==Object.prototype||!Ru(n))throw new Error("User-defined metadata is expected to be a JSON object, but is not.");if(e){const s=JSON.stringify(n);s.length>Df&&console.warn(`User-defined metadata of model "${t}" is too large in size (length=${s.length} when serialized). It is not recommended to store such large objects in user-defined metadata. Please make sure its serialized length is <= ${Df}.`)}}function Ru(n){if(n===null)return!0;if(typeof n=="object")if(Object.getPrototypeOf(n)===Object.prototype){const t=Object.keys(n);for(const e of t)if(typeof e!="string"||!Ru(n[e]))return!1;return!0}else if(Array.isArray(n)){for(const t of n)if(!Ru(t))return!1;return!0}else return!1;else{const t=typeof n;return t==="string"||t==="number"||t==="boolean"}}function iR(n,t,e,s=console.log){const r=cR(n),o=["Layer (type)","Input Shape","Output shape","Param #"];r?(t=t||90,e=e||[.32,.61,.89,1]):(t=t||115,e=e||[.24,.48,.7,.8,1]),e[e.length-1]<=1&&(e=e.map(u=>Math.floor(t*u)));let i;if(!r){o.push("Receives inputs"),i=[];for(const u in n.nodesByDepth)i.push(...n.nodesByDepth[u])}s("_".repeat(t)),Ga(o,e,s),s("=".repeat(t));const a=n.layers;for(let u=0;u<a.length;++u)r?lR(a[u],e,s):uR(a[u],e,i,s),s((u===a.length-1?"=":"_").repeat(t));n.checkTrainableWeightsConsistency();const c=aR(n),l=La(n.nonTrainableWeights);s(`Total params: ${c+l}`),s(`Trainable params: ${c}`),s(`Non-trainable params: ${l}`),s("_".repeat(t))}function aR(n){let t;return n.collectedTrainableWeights!=null?t=La(n.collectedTrainableWeights):t=La(n.trainableWeights),t}function cR(n){let t=!0;const e=[],s=[];for(const r in n.nodesByDepth)e.push(n.nodesByDepth[r]);for(const r of e){if(r.length>1||r.length===1&&r[0].inboundLayers.length>1){t=!1;break}s.push(...r)}if(t)for(const r of n.layers){let o=!1;for(const i of r.inboundNodes)if(s.indexOf(i)!==-1)if(o){t=!1;break}else o=!0;if(!t)break}return t}function Ga(n,t,e=console.log){let s="";for(let r=0;r<n.length;++r)r>0&&(s=s.slice(0,s.length-1)+" "),s+=n[r],s=s.slice(0,t[r]),s+=" ".repeat(t[r]-s.length);e(s)}function lR(n,t,e){let s,r;try{r=n.inboundNodes.map(c=>JSON.stringify(c.inputShapes)).join(",")}catch{r="multiple"}try{s=JSON.stringify(n.outputShape)}catch{s="multiple"}const o=n.name,i=n.getClassName(),a=[`${o} (${i})`,r,s,n.countParams().toString()];Ga(a,t,e)}function uR(n,t,e,s){let r,o;try{o=n.inboundNodes.map(h=>JSON.stringify(h.inputShapes)).join(",")}catch{o="multiple"}try{r=JSON.stringify(n.outputShape)}catch{r="multiple"}const i=[];for(const h of n.inboundNodes)if(!(e!=null&&e.length>0&&e.indexOf(h)===-1))for(let d=0;d<h.inboundLayers.length;++d){const p=h.inboundLayers[d].name,f=h.nodeIndices[d],m=h.tensorIndices[d];i.push(`${p}[${f}][${m}]`)}const a=n.name,c=n.getClassName(),l=i.length===0?"":i[0],u=[`${a} (${c})`,o,r,n.countParams().toString(),l];Ga(u,t,s);for(let h=1;h<i.length;++h)Ga(["","","","",i[h]],t,s)}function Cb(n,t,e){return(n==="inboundNodes"||n==="outputLayers"||n==="inputLayers")&&t===0&&typeof e=="string"}function Du(n,t){if(n===null)return null;if(typeof n=="string")return Ms(n);if(typeof n=="number"||typeof n=="boolean")return n;if(n instanceof Array){const e=[],s=n.length;for(let r=0;r<s;++r){const o=n[r];Cb(t,r,o)?e.push(o):e.push(Du(o,t))}return e}else{const e={};for(const s of Object.keys(n)){const r=n[s];if(s==="name"&&typeof r=="string")e[s]=r;else{const o=Ms(s);e[o]=Du(r,o)}}return e}}function Au(n,t){if(n==null)return null;if(typeof n=="string")return Wn(n);if(typeof n=="number"||typeof n=="boolean")return n;if(n instanceof Array){const e=[],s=n.length;for(let r=0;r<s;++r){const o=n[r];Cb(t,r,o)?e.push(o):e.push(Au(o,t))}return e}else{const e={};for(const s of Object.keys(n)){const r=n[s],o=Wn(s);(s==="name"||s==="className")&&typeof r=="string"?e[o]=r:e[o]=Au(r,s)}return e}}const kb="3.21.0";class gn extends kt{constructor(t){if(super({}),this.containerNodes=new Set,this.name=t.name,this.name==null){const b=this.getClassName().toLowerCase();this.name=ml(b)}if(this.supportsMasking=!1,this.trainable_=!0,Array.isArray(t.inputs)?this.inputs=t.inputs.slice():this.inputs=[t.inputs],Array.isArray(t.outputs)?this.outputs=t.outputs.slice():this.outputs=[t.outputs],cs(this.inputs).length!==this.inputs.length)throw new O(`The list of inputs passed to the model is redundant. All inputs should only appear once. Found: ${this.inputs.map(b=>b.name)}`);cs(this.outputs).length!==this.outputs.length&&console.warn(`The list of outputs passed to the model is redundant. All outputs should only appear once. Found: ${this.outputs.map(b=>b.name)}`),this.inputLayers=[],this.inputLayersNodeIndices=[],this.inputLayersTensorIndices=[],this.outputLayers=[],this.outputLayersNodeIndices=[],this.outputLayersTensorIndices=[],this.layers=[],this.internalContainerRefs=[];for(const b of this.outputs){const w=b.sourceLayer,y=b.nodeIndex,I=b.tensorIndex;this.outputLayers.push(w),this.outputLayersNodeIndices.push(y),this.outputLayersTensorIndices.push(I)}for(const b of this.inputs){const w=b.sourceLayer,y=b.nodeIndex,I=b.tensorIndex;Tn(y===0,"input layer has >1 nodes"),Tn(I===0,"input layer has >1 tensors"),this.inputLayers.push(w),this.inputLayersNodeIndices.push(y),this.inputLayersTensorIndices.push(I)}this.inputNames=[],this.outputNames=[],this.feedInputShapes=[],this.feedInputNames=[],this.feedOutputNames=[];for(let b=0;b<this.inputLayers.length;b++){const w=this.inputLayers[b];if(!(w instanceof zi))throw new TypeError(`Input layers to a LayersModel must be InputLayer objects. Received inputs: ${t.inputs}. Input ${b} (0-based) originates from layer type ${w.getClassName()}.`);this.inputNames.push(w.name),this.feedInputShapes.push(w.batchInputShape),this.feedInputNames.push(w.name)}for(const b of this.outputLayers)this.outputNames.push(b.name);this.internalInputShapes=this.inputs.map(b=>b.shape),this.internalOutputShapes=this.outputs.map(b=>b.shape);const e={},s={},r={},o={},i={},a=[],c=(b,w,y,I,C,N)=>{(I==null||C==null||N==null)&&(I=b.sourceLayer,C=b.nodeIndex,N=b.tensorIndex);const T=I.inboundNodes[C];if(y.indexOf(T)!==-1)throw new rn(`The tensor ${b.name} at layer "${I.name}" is part of a cycle.`);if(w.indexOf(T)!==-1)return;this.containerNodes.add(gn.nodeKey(I,C)),I.id in i||(i[I.id]=Object.keys(i).length),y.indexOf(T)===-1&&y.push(T);const $=T.inboundLayers.length;for(let k=0;k<$;k++){const v=T.inputTensors[k],R=T.inboundLayers[k],_=T.nodeIndices[k],P=T.tensorIndices[k];c(v,w,y,R,_,P)}for(w.push(T);y.indexOf(T)>=0;)y.splice(y.indexOf(T),1);a.push(T)},l=[],u=[];for(const b of this.outputs)c(b,l,u);const h=a.slice().reverse();for(const b of h){s[b.id]=b,b.id in e||(e[b.id]=0);let w=e[b.id];const y=r[b.outboundLayer.id]==null?0:r[b.outboundLayer.id];w=Math.max(w,y),r[b.outboundLayer.id]=w,o[b.outboundLayer.id]=b.outboundLayer,e[b.id]=w;for(let I=0;I<b.inboundLayers.length;I++){const C=b.inboundLayers[I],N=b.nodeIndices[I],T=C.inboundNodes[N],$=e[T.id]==null?0:e[T.id];e[T.id]=Math.max(w+1,$),s[T.id]=T}}const d={};for(const b in e){const w=e[b];w in d||(d[w]=[]),d[w].push(s[b])}const p={};for(const b in r){const w=r[b];w in p||(p[w]=[]),p[w].push(o[b])}let f=Object.keys(p).map(b=>parseInt(b,10)).sort(ea);this.layers=[];for(const b of f){const w=p[b];w.sort((y,I)=>{const C=i[y.id],N=i[I.id];return C<N?-1:C>N?1:0});for(const y of w)y instanceof gn&&this.internalContainerRefs.push(y),this.layers.push(y)}this.layersByDepth=p,f=Object.keys(d).map(b=>parseInt(b,10)).sort(ea);const m=this.inputs.slice(),g=[];for(const b of f)for(const w of d[b]){const y=w.outboundLayer;if(y!=null){for(const I of w.inputTensors)if(m.indexOf(I)===-1)throw new rn(`Graph disconnected: cannot obtain value for tensor ${I} at layer "${y.name}". The following previous layers were accessed without issue: ${g}`);for(const I of w.outputTensors)m.push(I);g.push(y.name)}}this.nodesByDepth=d;const x=this.layers.map(b=>b.name);for(const b of x){const w=x.filter(y=>y===b).length;if(w!==1)throw new rn(`The name "${b}" is used ${w} times in the model. All layer names should be unique. Layer names: `+JSON.stringify(x))}this.outboundNodes=[],this.inboundNodes=[],new xl({outboundLayer:this,inboundLayers:[],nodeIndices:[],tensorIndices:[],inputTensors:this.inputs,outputTensors:this.outputs,inputMasks:this.inputs.map(b=>null),outputMasks:this.outputs.map(b=>null),inputShapes:this.inputs.map(b=>b.shape),outputShapes:this.outputs.map(b=>b.shape)}),this.built=!0,this._refCount=1}assertNotDisposed(){if(this._refCount===0)throw new Error(`Container '${this.name}' is already disposed.`)}dispose(){this.assertNotDisposed();const t={refCountAfterDispose:null,numDisposedVariables:0};if(--this._refCount===0){for(const e of this.layers)t.numDisposedVariables+=e.dispose().numDisposedVariables;for(const e of this.internalContainerRefs)t.numDisposedVariables+=e.dispose().numDisposedVariables}return t.refCountAfterDispose=this._refCount,t}get trainable(){return this.trainable_}set trainable(t){this.layers.forEach(e=>{e._trainableWeights.forEach(s=>s.trainable=t)}),this.trainable_=t}get trainableWeights(){if(this._trainableWeights.length>0)throw new O("Container instance unexpectedly contains _trainableWeights.The trainable weights of a Container are a union of the trainable weights of its consituent Layers. Its own _trainableWeights must remain an empty Array.");if(!this.trainable)return[];let t=[];for(const e of this.layers)t=t.concat(e.trainableWeights);return t}get nonTrainableWeights(){const t=[];for(const e of this.layers)t.push(...e.nonTrainableWeights);if(!this.trainable){const e=[];for(const s of this.layers)e.push(...s.trainableWeights);return e.concat(t)}return t}get weights(){return this.trainableWeights.concat(this.nonTrainableWeights)}loadWeights(t,e=!0){const s={};let r=0;for(const i of this.layers)for(const a of i.weights){if(s[a.originalName]!=null)throw new O(`Duplicate weight name: ${a.originalName}`);s[a.originalName]=a,r++}const o=[];for(const i in t){let a=i;if(s[i]==null){const c=i.split("/");a=c.slice(0,-2).concat([c[c.length-1]]).join("/")}if(s[a]!=null)o.push([s[a],t[i]]);else if(e)throw new O(`Provided weight data has no target variable: ${i}`);delete s[a]}if(e){const i=[];for(const a in s)i.push(a);if(i.length>0)throw new O(`${i.length} of ${r} weights are not set: ${i}`)}ip(o)}updatedConfig(){const t=this.getConfig(),e={};return e.className=this.getClassName(),e.config=t,e.kerasVersion=`tfjs-layers ${kb}`,e.backend="TensorFlow.js",e}toJSON(t,e=!0){const s=Au(this.updatedConfig());return e?JSON.stringify(s):s}call(t,e){return z(()=>{t=Vt(t);const s=new os;for(let r=0;r<this.inputs.length;++r)s.add(this.inputs[r],t[r]);return ho(this.outputs,s,e)})}computeMask(t,e){return z(()=>{t=Vt(t);let s;return e==null?s=tr(null,t.length):s=Vt(e),this.runInternalGraph(t,s)[1]})}computeOutputShape(t){const e=Ma(t);if(e.length!==this.inputLayers.length)throw new O(`Invalid inputShape argument ${t}: model has ${this.inputLayers.length} tensor inputs.`);const s={};for(let a=0;a<e.length;a++){const c=this.inputLayers[a],l=e[a],u=c.name+"_0_0";s[u]=l}const r=Object.keys(this.nodesByDepth).map(a=>parseInt(a,10)).sort(ea);if(r.length>1)for(const a of r){const c=this.nodesByDepth[a];for(const l of c){const u=l.outboundLayer;if(this.inputLayers.map(m=>m.id).indexOf(u.id)!==-1)continue;const h=[];for(let m=0;m<l.inboundLayers.length;m++){const g=l.inboundLayers[m],x=l.nodeIndices[m],b=l.tensorIndices[m],w=`${g.name}_${x}_${b}`,y=s[w];h.push(y)}const d=u.computeOutputShape(Oe(h)),p=Ma(d),f=u.inboundNodes.indexOf(l);for(let m=0;m<p.length;m++){const g=`${u.name}_${f}_${m}`;s[g]=p[m]}}}const o=[],i=[];for(let a=0;a<this.outputLayers.length;a++){const c=this.outputLayers[a],l=this.outputLayersNodeIndices[a],u=this.outputLayersTensorIndices[a],h=`${c.name}_${l}_${u}`;i.push(h)}for(let a=0;a<i.length;a++){const c=i[a];Tn(c in s),o.push(s[c])}return Oe(o)}runInternalGraph(t,e){e==null&&(e=tr(null,t.length));const s={};for(let c=0;c<this.inputs.length;++c){const l=this.inputs[c],u=t[c],h=e[c];s[l.id]=[u,h]}const r=Object.keys(this.nodesByDepth).map(c=>parseInt(c,10)).sort(ea);for(const c of r){const l=this.nodesByDepth[c];for(const u of l){const h=u.outboundLayer,d=u.inputTensors,p=u.outputTensors,f=new Array;for(const m of d)m.id in s&&f.push(s[m.id]);if(f.length===d.length){let m={},g,x,b,w;if(u.callArgs!=null&&(m=u.callArgs),f.length===1){const[y,I]=f[0];m.mask==null&&(m.mask=I),b=Vt(h.call(y,m)),w=Vt(h.computeMask(y,I)),g=[y],x=[I]}else g=f.map(y=>y[0]),x=f.map(y=>y[1]),m.mask==null&&(m.mask=x),b=Vt(h.call(g,m)),w=Vt(h.computeMask(g,x));if(h.activityRegularizer)throw new bt("LayersModel invocation with concrete Tensor value(s) in the presence of activity regularizer(s) is not supported yet.");for(let y=0;y<p.length;++y){const I=p[y],C=b[y],N=w[y];s[I.id]=[C,N]}}}}const o=[],i=[],a=[];for(const c of this.outputs){Tn(c.id in s,`Could not compute output ${c.name} : ${c.id}`);const[l,u]=s[c.id];a.push(l.shape),o.push(l),i.push(u)}return[o,i,a]}buildNodeConversionMap(t){const e={};let s;for(const r of this.layers){s=r instanceof gn?1:0;for(let o=0;o<r.inboundNodes.length;o++){const i=gn.nodeKey(r,o);this.containerNodes.has(i)&&(e[i]=s,s+=1)}}return e}getLayer(t,e){if(e!=null){if(this.layers.length<=e)throw new O(`Was asked to retrieve layer at index ${e}, but model only has ${this.layers.length} layer(s).`);return this.layers[e]}else if(t==null)throw new O("Provide either a layer name or layer index");for(const s of this.layers)if(s.name===t)return s;throw new O(`No such layer: ${t}`)}calculateLosses(){return z(()=>{const t=[];for(const e of this.layers)for(let s=0;s<e.inboundNodes.length;++s){const r=gn.nodeKey(e,s);this.containerNodes.has(r)&&t.push(...e.calculateLosses())}return t})}getConfig(){const t={name:this.name},e=this.buildNodeConversionMap(this.layers),s=[];for(const i of this.layers){const a=i.getClassName(),c=i.getConfig(),l=[];for(let h=0;h<i.inboundNodes.length;h++){const d=i.inboundNodes[h],p=gn.nodeKey(i,h);let f={};if(this.containerNodes.has(p)){if(d.callArgs)try{JSON.stringify(d.callArgs),f=d.callArgs}catch{console.warn(`Layer ${i.name} was passed non-serializable keyword arguments: ${d.callArgs}. They will not be included in the serialized model (and thus will be missing at deserialization time).`),f={}}if(d.inboundLayers.length>0){const m=[];for(let g=0;g<d.inboundLayers.length;g++){const x=d.inboundLayers[g],b=d.nodeIndices[g],w=d.tensorIndices[g],y=gn.nodeKey(x,b);let I=e[y];I==null&&(I=0),m.push([x.name,I,w,f])}l.push(m)}}}const u={};u.name=i.name,u.className=a,u.config=c,u.inboundNodes=l,s.push(u)}t.layers=s;const r=[];for(let i=0;i<this.inputLayers.length;i++){const a=this.inputLayers[i],c=this.inputLayersNodeIndices[i],l=gn.nodeKey(a,c);if(!this.containerNodes.has(l))continue;let u=e[l];u==null&&(u=0);const h=this.inputLayersTensorIndices[i];r.push([a.name,u,h])}t.inputLayers=r;const o=[];for(let i=0;i<this.outputLayers.length;i++){const a=this.outputLayers[i],c=this.outputLayersNodeIndices[i],l=gn.nodeKey(a,c);if(!this.containerNodes.has(l))continue;let u=e[l];u==null&&(u=0);const h=this.outputLayersTensorIndices[i];o.push([a.name,u,h])}return t.outputLayers=o,t}static fromConfig(t,e,s={},r=!1){const o={},i={};function a(g,x){g.name in i?i[g.name].push(x):i[g.name]=[x]}function c(g,x){const b=[];let w;for(const y of x){const I=y[0],C=y[1],N=y[2];if(w=y[3]==null?{}:y[3],!(I in o)){a(g,x);return}const T=o[I];if(T.inboundNodes.length<=C){a(g,x);return}const $=T.inboundNodes[C];b.push($.outputTensors[N])}b.length>0&&g.apply(Oe(b),w)}function l(g){const x=g.name,b=Hn(g,e.customObjects!=null?e.customObjects:{});b.setFastWeightInitDuringBuild(r),o[x]=b,g.inboundNodes.forEach(y=>{if(!(y instanceof Array))throw new O(`Corrupted configuration, expected array for nodeData: ${y}`);a(b,y)})}const u=e.name,h=e.layers;for(const g of h)l(g);for(;!ZT(i);)for(const g of h){const x=o[g.name];if(x.name in i){const b=i[x.name];delete i[x.name];for(const w of b)c(x,w)}}const d=[],p=[],f=e.inputLayers;for(const g of f){const x=g[0],b=g[1],w=g[2];Tn(x in o);const I=o[x].inboundNodes[b].outputTensors;d.push(I[w])}const m=e.outputLayers;for(const g of m){const x=g[0],b=g[1],w=g[2];Tn(x in o);const I=o[x].inboundNodes[b].outputTensors;p.push(I[w])}return new t({inputs:d,outputs:p,name:u})}get stateful(){if(this._stateful)throw new O("Container instance unexpectedly has _stateful = true. The statefulness of a Container is determined by the Layers it contains. Its _stateful property must remain the default false.");for(const t of this.layers)if(t.stateful)return!0;return!1}resetStates(){z(()=>{this.layers.forEach(t=>{t.stateful&&t.resetStates()})})}}function hR(n,t,e){const s=t.length;if(n==null||Array.isArray(n)&&n.length===0)return t.map(r=>null);if(s===1)return Array.isArray(n)&&n.length===1?n:typeof n=="object"&&t[0]in n?[n[t[0]]]:[n];if(Array.isArray(n)){if(n.length!==s)throw new Error(`Provided ${e} is an array of ${n.length} element(s), but the model has ${s} outputs. Make sure a set of weights is provided for each model output.`);return n}else if(typeof n=="object"&&Object.keys(n).length>0&&typeof n[Object.keys(n)[0]]=="object"){const r=[];return t.forEach(o=>{o in n?r.push(n[o]):r.push(null)}),r}else throw new Error(`The model has multiple (${s}) outputs, so ${e} must be either an array with ${s} elements or an object with ${t} keys. Provided ${e} not understood: ${JSON.stringify(n)}`)}function $b(n,t){return hR(n,t,"classWeight")}async function Sb(n,t,e,s){if(e!=null){const r=z(()=>{if(n.shape.length===1)return zs(n);if(n.shape.length===2){if(n.shape[1]>1)return yo(n,1);if(n.shape[1]===1)return M(n,[n.shape[0]]);throw new Error(`Encountered unexpected last-dimension size (${n.shape[1]}) during handling of class weights. The size is expected to be >= 1.`)}else throw new Error(`Unexpected rank of target (y) tensor (${n.rank}) during handling of class weights. The rank is expected to be 1 or 2.`)}),o=Array.from(await r.data());It(r);const i=[];return o.forEach(a=>{if(e[a]==null)throw new Error(`classWeight must contain all classes in the training data. The class ${a} exists in the data but not in classWeight`);i.push(e[a])}),ze(i,"float32")}else return null}function dR(n,t){return D(n,t)}const pR=32;function Nb(n,t){let e,s;const r=t;e=r.xs,s=r.ys,S(e!=null&&s!=null,()=>`A Dataset iterator for fitDataset() is expected to generate objects of the form \`{xs: xVal, ys: yVal}\`, where the two values may be \`tf.Tensor\`, an array of Tensors, or a map of string to Tensor.  The provided Dataset instead generates ${t}`);const o=Ff("input",n.inputNames,e),i=Ff("output",n.outputNames,s),a=o[0].shape[0];S(o.length===n.inputs.length,()=>`LayersModel has ${n.inputs.length} inputs, but the dataset provides ${o.length} inputs.  (Expected input keys: ${JSON.stringify(n.inputNames)})`),S(i.length===n.outputs.length,()=>`LayersModel has ${n.outputs.length} outputs, but the dataset provides ${i.length} outputs.  (Expected output keys: ${JSON.stringify(n.outputNames)})`);for(let c=0;c<o.length;c++)S(o[c].shape[0]===a,()=>`Batch size mismatch: input ${n.inputNames[c]} has ${o[c].shape[0]}; expected  ${a} based on input ${n.inputNames[0]}.`);for(let c=0;c<i.length;c++)S(i[c].shape[0]===a,()=>`Batch size mismatch: output ${n.outputNames[c]} has ${i[c].shape[0]}; expected  ${a} based on input ${n.inputNames[0]}.`);return{xs:o,ys:i}}function Ff(n,t,e){if(e instanceof ne)return[e];if(Array.isArray(e))return S(e.length===t.length,()=>`Received an array of ${e.length} Tensors, but expected ${t.length} to match the ${n} keys ${t}.`),e;{const s=[];for(const r of t){if(e[r]==null)throw new O(`The feature data generated by the dataset lacks the required ${n} key '${r}'.`);s.push(e[r])}return s}}function fR(n){if(n.length===3)throw new bt("Validation with sample weights is not implemented yet.");return{xs:n[0],ys:n[1]}}async function mR(n,t,e){const s=e.batchesPerEpoch!=null;if(S(n.optimizer!=null,()=>"You must compile a model before training/testing. Use LayersModel.compile(modelCompileConfig)."),S(e!=null,()=>"For fitDataset(), the 2nd argument (config) is required, but it is not provided in this call."),S(e.epochs!=null&&e.epochs>0&&Number.isInteger(e.epochs),()=>`For fitDataset(), config.epochs is expected to be a positive integer, but got ${e.epochs}`),S(!s||e.batchesPerEpoch>0&&Number.isInteger(e.batchesPerEpoch),()=>`For fitDataset(), config.batchesPerEpoch is expected to be a positive integer if specified, but got ${e.batchesPerEpoch}`),S(e.validationSplit==null,()=>"`validationSplit` is not supported by `fitDataset()`. Use validationData instead."),n.isTraining)throw new Error("Cannot start training because another fit() call is ongoing.");n.isTraining=!0;try{const r=e.validationData!=null;let o,i;if(r)if(Of(e.validationData))S(e.validationBatches==null||e.validationBatches>0&&Number.isInteger(e.validationBatches),()=>`For fitDataset() with dataset-based validation, config.validationBatches is expected not to be provided, or to be a positive integer, but got ${e.validationBatches}`);else{const g=fR(e.validationData);o=g.xs,i=g.ys}const a=n.makeTrainFunction(),c=n.getDedupedMetricsNames();let l;r?l=c.slice().concat(c.map(g=>"val_"+g)):l=c.slice();const u=gb(e.callbacks,e.yieldEvery),h=e.verbose==null?1:e.verbose,{callbackList:d,history:p}=xb(u,h,e.epochs,null,null,gR(t,e),null,r,l);d.setModel(n),n.history=p,await d.onTrainBegin(),n.stopTraining_=!1;let f=e.initialEpoch==null?0:e.initialEpoch,m=await t.iterator();for(;f<e.epochs;){const g={};await d.onEpochBegin(f);let x=0,b=0;for(s||(m=await t.iterator());!s||x<e.batchesPerEpoch;){const w=await m.next();if(s&&w.done){console.warn(`You provided \`batchesPerEpoch\` as ${e.batchesPerEpoch}, but your dataset iterator ran out of data after ${x} batches; interrupting training. Make sure that your dataset can generate at least \`batchesPerEpoch * epochs\` batches (in this case, ${e.batchesPerEpoch*e.epochs} batches). You may need to use the repeat() function when building your dataset.`);break}if(w.value!=null){const{xs:y,ys:I}=Nb(n,w.value),C={};C.batch=b,C.size=y[0].shape[0],await d.onBatchBegin(b,C);const N=[];if(e.classWeight!=null){const k=$b(e.classWeight,n.outputNames);for(let v=0;v<k.length;++v)N.push(await Sb(I[v],null,k[v]))}const T=y.concat(I).concat(N),$=a(T);It(T);for(let k=0;k<c.length;++k){const v=c[k],R=$[k];C[v]=R,Mn(R)}await d.onBatchEnd(b,C),mb(C),b++,x++}if(s?x>=e.batchesPerEpoch:w.done){if(r){let y;Of(e.validationData)?y=Vt(await n.evaluateDataset(e.validationData,{batches:e.validationBatches})):y=Vt(n.evaluate(o,i,{batchSize:e.validationBatchSize==null?pR:e.validationBatchSize,verbose:0}));for(let I=0;I<n.metricsNames.length;++I)g[`val_${n.metricsNames[I]}`]=y[I]}break}if(n.stopTraining_)break}if(await d.onEpochEnd(f,g),f++,n.stopTraining_)break}return await d.onTrainEnd(),await n.history.syncData(),n.history}finally{n.isTraining=!1}}function gR(n,t){let e=null;return t.batchesPerEpoch!=null?e=t.batchesPerEpoch:Number.isFinite(n.size)&&(e=n.size),e}function Of(n){return typeof n.iterator=="function"}function xR(n){return typeof n.next=="function"}async function bR(n,t,e){e=e||{};const s=e.batches!=null,r=n.testFunction;let o=[];if(e.verbose>0)throw new bt("Verbose mode is not implemented yet.");S(!s||e.batches>0&&Number.isInteger(e.batches),()=>`Test loop expects \`batches\` to be a positive integer, but received ${JSON.stringify(e.batches)}`);const i=xR(t)?t:await t.iterator();let a=0,c=0;for(;!s||c<e.batches;){const l=await i.next();if(o=z(()=>{if(l.value){const{xs:u,ys:h}=Nb(n,l.value),d=u.concat(h),p=z(()=>r(d));if(It(d),c===0)for(let m=0;m<p.length;++m)o.push(ft(0));const f=d[0].shape[0];for(let m=0;m<p.length;++m){const g=p[m],x=o[m];o[m]=z(()=>J(o[m],D(f,g))),c>0&&It(x)}It(p),a+=f,++c}return o}),l.done){s&&console.warn(`Your dataset iterator ran out of data during evaluateDataset(). Interrupting evalution. Make sure that your dataset can generate at least \`batches\` batches (in this case, ${e.batches} batches). You may need to use the repeat() function when building your dataset.`);break}}for(let l=0;l<o.length;++l){const u=o[l];o[l]=ut(o[l],a),It(u)}return Oe(o)}function Fu(n){S(n>0&&Number.isInteger(n),()=>`batchSize is required to be a positive integer, but got ${n}`)}function po(n,t,e){return n==null?[null]:Array.isArray(n)?n.map(s=>Us(s,t,e-t)):Us(n,t,e-t)}function up(n,t){return z(()=>n==null?null:Array.isArray(n)?n.map(e=>up(e,t)):eb(n,t.dtype==="int32"?t:nt(t,"int32")))}function Ou(n,t){const e=[];let s=0,r=null;for(;s<n;)r=s+t,r>=n&&(r=n),e.push([s,r]),s=r;return e}async function yR(n,t,e,s,r,o,i,a,c,l,u,h,d,p,f){r==null&&(r=32),o==null&&(o=1),u==null&&(u=!0),d==null&&(d=0);let m=!1;c!=null&&l!=null&&(m=!0);const g=n.checkNumSamples(e,r,p,"steps_per_epoch");let x;g!=null&&(x=Cn(0,g)),i==null&&(i=1);const{callbackList:b,history:w}=xb(a,i,o,d,g,p,r,m,h);b.setModel(n),n.history=w,await b.onTrainBegin(),n.stopTraining_=!1;for(let y=d;y<o;++y){await b.onEpochBegin(y);const I={};{if(u==="batch")throw new bt("batch shuffling is not implemneted yet");u&&Dw(x);const C=ze(x),N=Ou(g,r);for(let T=0;T<N.length;++T){const $={};if(await b.onBatchBegin(T,$),z(()=>{const k=N[T][0],v=N[T][1],R=Us(C,k,v-k);$.batch=T,$.size=v-k;const _=up(e,R),P=t(_);for(let L=0;L<s.length;++L){const B=s[L],U=P[L];$[B]=U,Mn(U)}if(T===N.length-1&&m){const L=n.testLoop(c,l,r);for(let B=0;B<s.length;++B){const U=s[B],V=L[B];Mn(V),I["val_"+U]=V}}}),await b.onBatchEnd(T,$),mb($),n.stopTraining_)break}C.dispose()}if(await b.onEpochEnd(y,I),n.stopTraining_)break}return await b.onTrainEnd(),await n.history.syncData(),n.history}async function wR(n,t,e,s={}){if(n.isTraining)throw new Error("Cannot start training because another fit() call is ongoing.");n.isTraining=!0;let r,o,i,a,c,l,u,h,d;try{const p=s.batchSize==null?32:s.batchSize;Fu(p);const m=await n.standardizeUserData(t,e,s.sampleWeight,s.classWeight,!1,p);r=m[0],o=m[1],d=m[2];let g=!1,x;if(s.validationData!=null&&s.validationData.length>0){if(g=!0,s.validationData.length===2)c=s.validationData[0],l=s.validationData[1];else throw s.validationData.length===3?new bt("validationData including sample weights is not supported yet."):new O(`When passing validation data, it must contain 2 (valX, valY) or 3 (valX, valY, valSampleWeight) items; ${s.validationData} is invalid.`);const k=await n.standardizeUserData(c,l,null,null,!0,p);u=k[0],h=k[1],x=u.concat(h)}else if(s.validationSplit!=null&&s.validationSplit>0&&s.validationSplit<1){g=!0;const $=Math.floor(r[0].shape[0]*(1-s.validationSplit)),k=r[0].shape[0];u=po(r,$,k),i=r,r=po(r,0,$),h=po(o,$,k),a=o,o=po(o,0,$),x=u.concat(h)}else s.validationSteps!=null&&(g=!0);const b=r.concat(o).concat(d);n.checkTrainableWeightsConsistency();const w=n.makeTrainFunction(),y=n.getDedupedMetricsNames();let I,C;g?(n.makeTestFunction(),I=n.testFunction,C=y.slice().concat(y.map($=>"val_"+$))):(I=null,x=[],C=y.slice());const N=gb(s.callbacks,s.yieldEvery);return await yR(n,w,b,y,p,s.epochs,s.verbose,N,I,x,s.shuffle,C,s.initialEpoch,null,null)}finally{n.isTraining=!1,yn(r,t),yn(o,e),yn(i,t),yn(a,e),yn(u,c),yn(h,l),d!=null&&It(d)}}function Tb(n){const t=[];n instanceof ne&&(n=[n]);for(let e=0;e<n.length;++e){const s=n[e];if(s.rank===1)t.push(Li(s,1));else{if(s.rank===0)throw new Error("Expected tensor to be at least 1D, but received a 0D tensor (scalar).");t.push(s)}}return t}function yn(n,t){if(n==null)return;const e=[];if(t instanceof ne)e.push(t.id);else if(Array.isArray(t))t.forEach(r=>e.push(r.id));else if(t!=null)for(const r in t){const o=t[r];e.push(o.id)}const s=[];if(n instanceof ne)e.indexOf(n.id)===-1&&s.push(n);else if(Array.isArray(n))n.forEach(r=>{e.indexOf(r.id)===-1&&s.push(r)});else if(n!=null)for(const r in n){const o=n[r];e.indexOf(o.id)===-1&&s.push(o)}s.forEach(r=>{r.isDisposed||r.dispose()})}function IR(n){return n instanceof ne}function _u(n){return Array.isArray(n)}function _f(n){return!IR(n)&&!_u(n)}function Mf(n,t,e,s=!0,r=""){if(t==null||t.length===0){if(n!=null){let i=!1;if(_u(n)&&n.length>0)i=!0;else if(_f(n)){for(const a in n)if(n.hasOwnProperty(a)){i=!0;break}}else i=!0;if(i)throw new O(`Error when checking model ${r} expected no data, but got ${n}`)}return[]}if(n==null)return t.map(i=>null);let o;if(_f(n)){n=n,o=[];for(const i of t){if(n[i]==null)throw new O(`No data provided for "${i}". Need data for each key in: ${t}`);o.push(n[i])}}else if(_u(n)){if(n=n,n.length!==t.length)throw new O(`Error when checking model ${r}: the Array of Tensors that you are passing to your model is not the size the model expected. Expected to see ${t.length} Tensor(s), but instead got the following list of Tensor(s): ${n}`);o=n}else{if(n=n,t.length>1)throw new O(`The model ${r} expects ${t.length} Tensor(s), but only received one Tensor. Found: Tensor with shape ${n.shape}`);o=[n]}if(o=Tb(o),e!=null)for(let i=0;i<t.length;++i){if(e[i]==null)continue;const a=o[i];if(a.shape.length!==e[i].length)throw new O(`Error when checking ${r}: expected ${t[i]} to have ${e[i].length} dimension(s). but got array with shape ${a.shape}`);for(let c=0;c<e[i].length;++c){if(c===0&&!s)continue;const l=a.shape[c],u=e[i][c];if(u!=null&&u>=0&&l!==u)throw new O(`${r} expected a batch of elements where each example has shape [${e[i].slice(1,e[i].length)}] (i.e.,tensor shape [*,${e[i].slice(1,e[i].length)}]) but the ${r} received an input with ${a.shape[0]} examples, each with shape [${a.shape.slice(1,a.shape.length)}] (tensor shape [${a.shape}])`)}}return o}function vR(n,t,e){const s=cs(n.map(o=>o.shape[0]));s.sort();const r=cs(t.map(o=>o.shape[0]));if(r.sort(),s.length>1)throw new O(`All input Tensors (x) should have the same number of samples. Got array shapes: ${JSON.stringify(n.map(o=>o.shape))}`);if(r.length>1)throw new O(`All target Tensors (y) should have the same number of samples. Got array shapes: ${JSON.stringify(t.map(o=>o.shape))}`);if(s.length>0&&r.length>0&&!Tt(s,r))throw new O(`Input Tensors should have the same number of samples as target Tensors. Found ${s[0]} input sample(s) and ${r[0]} target sample(s).`)}function CR(n,t,e){const s=[bl,yl,vo];for(let r=0;r<n.length;++r){const o=n[r],i=t[r],a=e[r];if(i!=null){if(i===vo&&o.shape[o.shape.length-1]===1)throw new O(`You are passing a target array of shape ${o.shape} while using a loss 'categorical_crossentropy'. 'categorical_crossentropy'expects targets to be binary matrices (1s and 0s) of shape [samples, classes].`);if(s.indexOf(i)!==-1){const c=o.shape.slice(1),l=a.slice(1);for(let u=0;u<c.length;++u){const h=c[u],d=l[u];if(d!=null&&h!==d)throw new O(`A target Tensor with shape ${o.shape} was passed for an output of shape ${a}, while using a loss function that expects targets to have the same shape as the output.`)}}}}}function Lf(n,t,e,s=!0,r=""){let o;if(Array.isArray(n)){if(n.length!==t.length)throw new O(`Error when checking model ${r}: the Array of Tensors that you are passing to your model is not the size the the model expected. Expected to see ${t.length} Tensor(s), but instead got ${n.length} Tensors(s).`);o=n}else{if(t.length>1)throw new O(`The model expects ${t.length} ${r} Tensors, but only received one Tensor. Found: array with shape ${JSON.stringify(n.shape)}.`);o=[n]}if(e!=null)for(let i=0;i<t.length;++i){if(e[i]==null)continue;const a=o[i];if(a.shape.length!==e[i].length)throw new O(`Error when checking ${r}: expected ${t[i]} to have ${e[i].length} dimension(s), but got array with shape ${JSON.stringify(a.shape)}`);for(let c=0;c<e[i].length;++c){if(c===0&&!s)continue;const l=a.shape[c],u=e[i][c];if(u!=null&&u!==l)throw new O(`Error when checking ${r}: expected ${t[i]} to have shape ${JSON.stringify(e[i])} but got array with shape ${JSON.stringify(a.shape)}.`)}}}function kR(n,t){if(n==null||Array.isArray(n)&&n.length===0)return t.map(s=>[]);let e;if(typeof n=="string"||typeof n=="function")e=[n];else if(Array.isArray(n)||typeof n=="object")e=n;else throw new TypeError(`Type of metrics argument not understood. Expected an string,function, Array, or Object, found: ${n}`);if(Array.isArray(e))return t.map(s=>e);{const s=[];for(const r of t){let o=e.hasOwnProperty(r)?e[r]:[];Array.isArray(o)||(o=[o]),s.push(o)}return s}}const $R="layers-model";class vr extends gn{constructor(t){super(t),this.isTraining=!1}summary(t,e,s=console.log){if(!this.built)throw new O("This model has never been called, thus its weights have not been created yet. So no summary can be displayed. Build the model first (e.g., by calling it on some test data).");iR(this,t,e,s)}compile(t){if(t.loss==null&&(t.loss=[]),this.loss=t.loss,typeof t.optimizer=="string")this.optimizer_=oR(t.optimizer),this.isOptimizerOwned=!0;else{if(!(t.optimizer instanceof vs))throw new O("User-defined optimizer must be an instance of tf.Optimizer.");this.optimizer_=t.optimizer,this.isOptimizerOwned=!1}let e=[];if(!Array.isArray(t.loss)&&typeof t.loss!="string"&&typeof t.loss!="function"){t.loss=t.loss;for(const i in t.loss)if(this.outputNames.indexOf(i)===-1)throw new O(`Unknown entry in loss dictionary: "${i}". Only expected the following keys: ${this.outputNames}`);for(const i of this.outputNames)t.loss[i]==null&&console.warn(`Output "${i}" is missing from loss dictionary. We assume this was done on purpose, and we will not be expecting data to be passed to ${i} during training`),e.push(Gl(t.loss[i]))}else if(Array.isArray(t.loss)){if(t.loss.length!==this.outputs.length)throw new O(`When passing an Array as loss, it should have one entry per model output. The model has ${this.outputs.length} output(s), but you passed loss=${t.loss}.`);e=t.loss.map(a=>Gl(a))}else{const i=Gl(t.loss);this.outputs.forEach(a=>{e.push(i)})}this.lossFunctions=e,this.feedOutputNames=[],this.feedOutputShapes=[],this.feedLossFns=[];for(let i=0;i<this.outputs.length;++i){const a=this.internalOutputShapes[i],c=this.outputNames[i];this.feedOutputNames.push(c),this.feedOutputShapes.push(a),this.feedLossFns.push(this.lossFunctions[i])}const s=[];this.metrics=t.metrics,this.metricsNames=["loss"],this.metricsTensors=[],Ws("loss",()=>{for(let i=0;i<this.outputs.length;++i){if(s.indexOf(i)!==-1)continue;const a=this.lossFunctions[i];this.outputs.length>1&&(this.metricsTensors.push([a,i]),this.metricsNames.push(this.outputNames[i]+"_loss"))}});const r=kR(t.metrics,this.outputNames),o=(i,a,c)=>{this.outputNames.length>1&&(a=this.outputNames[i]+"_"+a),this.metricsNames.push(a),this.metricsTensors.push([c,i])};Ws("metric",()=>{for(let i=0;i<this.outputs.length;++i){if(s.indexOf(i)!==-1)continue;const a=r[i];(l=>{const u="";let h,d,p;for(const f of l){if(typeof f=="string"&&["accuracy","acc","crossentropy","ce"].indexOf(f)!==-1){const g=this.internalOutputShapes[i];g[g.length-1]===1||this.lossFunctions[i]===yl?["accuracy","acc"].indexOf(f)!==-1?d=yb:["crossentropy","ce"].indexOf(f)!==-1&&(d=XE):this.lossFunctions[i]===Va?["accuracy","acc"].indexOf(f)!==-1?d=YE:["crossentropy","ce"].indexOf(f)!==-1&&(d=vb):["accuracy","acc"].indexOf(f)!==-1?d=wb:["crossentropy","ce"].indexOf(f)!==-1&&(d=Ib);let x;["accuracy","acc"].indexOf(f)!==-1?x="acc":["crossentropy","ce"].indexOf(f)!==-1&&(x="ce"),p=d,h=u+x}else p=rR(f),h=u+ra(f);let m;Ws(h,()=>{m=p}),o(i,h,m)}})(a)}}),this.collectedTrainableWeights=this.trainableWeights}checkTrainableWeightsConsistency(){this.collectedTrainableWeights!=null&&this.trainableWeights.length!==this.collectedTrainableWeights.length&&console.warn("Discrepancy between trainableweights and collected trainable weights. Did you set `model.trainable` without calling `model.compile()` afterwards?")}evaluate(t,e,s={}){const r=s.batchSize==null?32:s.batchSize;Fu(r);const i=this.standardizeUserDataXY(t,e,!0,r);try{const a=i[0].concat(i[1]);this.makeTestFunction();const c=this.testFunction,l=this.testLoop(c,a,r,s.verbose,s.steps);return Oe(l)}finally{yn(i[0],t),yn(i[1],e)}}async evaluateDataset(t,e){return this.makeTestFunction(),bR(this,t,e)}checkNumSamples(t,e,s,r="steps"){let o;if(s!=null){if(o=null,e!=null)throw new O(`If ${r} is set, batchSize must be null or undefined.Got batchSize = ${e}`)}else if(t!=null)Array.isArray(t)?o=t[0].shape[0]:o=t.shape[0];else throw new O(`Either the input data should have a defined shape, or ${r} shoud be specified.`);return o}execute(t,e){if(Array.isArray(e)&&e.length===0)throw new O("`outputs` is an empty Array, which is not allowed.");const s=Array.isArray(e),r=s?e:[e],o=this.retrieveSymbolicTensors(r),i=new os;if(t instanceof ne&&(t=[t]),Array.isArray(t)){if(t.length!==this.inputs.length)throw new O(`The number of inputs provided (${t.length}) does not match the number of inputs of this model (${this.inputs.length}).`);for(let c=0;c<this.inputs.length;++c)i.add(this.inputs[c],t[c])}else for(const c of this.inputs){const l=t[c.name];if(l==null)throw new O(`No value is provided for the model's input ${c.name}`);i.add(c,l)}const a=ho(o,i);return s?a:a[0]}retrieveSymbolicTensors(t){const e=tr(null,t.length);let s=t.length;for(const r of this.layers){const o=Array.isArray(r.output)?r.output:[r.output],i=o.map(a=>a.name);for(let a=0;a<t.length;++a){const c=i.indexOf(t[a]);if(c!==-1&&(e[a]=o[c],s--),s===0)break}if(s===0)break}if(s>0){const r=[];throw e.forEach((o,i)=>{o==null&&r.push(t[i])}),new O(`Cannot find SymbolicTensors for output name(s): ${JSON.stringify(r)}`)}return e}predictLoop(t,e=32,s=!1){return z(()=>{const r=this.checkNumSamples(t);if(s)throw new bt("Verbose predictLoop() is not implemented yet.");const o=Ou(r,e),i=this.outputs.map(a=>[]);for(let a=0;a<o.length;++a)z(()=>{const l=o[a][0],u=o[a][1],h=po(t,l,u),d=[];if(Array.isArray(h))for(let f=0;f<h.length;++f)d.push({key:this.inputs[f],value:h[f]});else d.push({key:this.inputs[0],value:h});const p=new os(d);return ho(this.outputs,p)}).forEach((l,u)=>i[u].push(l));return Oe(i.map(a=>Ce(a,0)))})}predict(t,e={}){const s=Tb(t);Lf(s,this.inputNames,this.feedInputShapes,!1);try{const r=e.batchSize==null?32:e.batchSize;return Fu(r),this.predictLoop(s,r)}finally{yn(s,t)}}predictOnBatch(t){Lf(t,this.inputNames,this.feedInputShapes,!0);const e=(Array.isArray(t)?t[0]:t).shape[0];return this.predictLoop(t,e)}standardizeUserDataXY(t,e,s=!0,r){if(this.optimizer_==null)throw new rn("You must compile a model before training/testing. Use LayersModel.compile(modelCompileArgs).");const o=[];for(let i=0;i<this.feedOutputShapes.length;++i){const a=this.feedOutputShapes[i];this.feedLossFns[i]===Va?o.push(a.slice(0,a.length-1).concat([1])):o.push(a)}if(t=Mf(t,this.feedInputNames,this.feedInputShapes,!1,"input"),e=Mf(e,this.feedOutputNames,o,!1,"target"),vR(t,e),CR(e,this.feedLossFns,this.feedOutputShapes),this.stateful&&r!=null&&r>0&&t[0].shape[0]%r!==0)throw new O(`In a stateful network, you should only pass inputs with a number of samples that is divisible by the batch size ${r}. Found: ${t[0].shape[0]} sample(s).`);return[t,e]}async standardizeUserData(t,e,s,r,o=!0,i){const[a,c]=this.standardizeUserDataXY(t,e,o,i);if(s!=null)throw new Error("sample weight is not supported yet.");let l=null;if(r!=null){const u=$b(r,this.outputNames);l=[];for(let h=0;h<u.length;++h)l.push(await Sb(c[h],null,u[h]))}return[a,c,l]}testLoop(t,e,s,r=0,o){return z(()=>{const i=this.checkNumSamples(e,s,o,"steps"),a=[];if(r>0)throw new bt("Verbose mode is not implemented yet.");if(o!=null)throw new bt("steps mode in testLoop() is not implemented yet");{const c=Ou(i,s),l=ze(Cn(0,i));for(let u=0;u<c.length;++u){const h=c[u][0],d=c[u][1],p=Us(l,h,d-h),f=up(e,p),m=t(f);if(u===0)for(let g=0;g<m.length;++g)a.push(ft(0));for(let g=0;g<m.length;++g){const x=m[g];a[g]=J(a[g],D(d-h,x))}}for(let u=0;u<a.length;++u)a[u]=ut(a[u],i)}return a})}getDedupedMetricsNames(){const t=this.metricsNames,e=[];for(let s=0;s<t.length;++s){const r=t[s];let o=r;if(If(t,r)>1){const i=If(t.slice(0,s),r);o+=`_${i}`}e.push(o)}return e}makeTrainFunction(){return t=>{const e=[],s=t.slice(0,this.inputs.length),r=t.slice(this.inputs.length,this.inputs.length+this.outputs.length),o=t.slice(this.inputs.length+this.outputs.length,this.inputs.length+this.outputs.length*2),i=[],a=()=>{const h=[];for(let m=0;m<this.inputs.length;++m)h.push({key:this.inputs[m],value:s[m]});const d=new os(h),p=ho(this.outputs,d,{training:!0});let f;for(let m=0;m<this.lossFunctions.length;++m){const g=this.lossFunctions[m];let x=g(r[m],p[m]);o[m]!=null&&(x=dR(x,o[m]));const b=Yt(x);e.push(b),m===0?f=x:f=J(f,x)}for(let m=0;m<this.metricsTensors.length;++m){let g;if(this.outputs.length>1&&m<this.outputs.length)g=e[m];else{const x=this.metricsTensors[m][0],b=this.metricsTensors[m][1];g=Yt(x(r[b],p[b]))}Mn(g),i.push(g)}return f=Yt(f),this.calculateLosses().forEach(m=>{f=J(f,m)}),f},c=this.collectedTrainableWeights.map(h=>h.read());return[this.optimizer_.minimize(a,!0,c)].concat(i)}}makeTestFunction(){this.testFunction=t=>z(()=>{const e=[];let s;const r=t.slice(0,this.inputs.length),o=t.slice(this.inputs.length,this.inputs.length+this.outputs.length),i=[];for(let l=0;l<this.inputs.length;++l)i.push({key:this.inputs[l],value:r[l]});const a=new os(i),c=ho(this.outputs,a);for(let l=0;l<this.lossFunctions.length;++l){const u=this.lossFunctions[l],h=Yt(u(o[l],c[l]));l===0?s=h:s=J(s,h),e.push(s)}for(let l=0;l<this.metricsTensors.length;++l){const u=this.metricsTensors[l][0],h=this.metricsTensors[l][1],d=Yt(u(o[h],c[h]));e.push(d)}return e})}async fit(t,e,s={}){return wR(this,t,e,s)}async fitDataset(t,e){return mR(this,t,e)}async trainOnBatch(t,e){const s=await this.standardizeUserData(t,e),r=s[0],o=s[1],a=this.makeTrainFunction()(r.concat(o)),c=[];for(const l of a){const u=await l.data();c.push(u[0])}return It(a),yn(s[0],t),yn(s[1],e),Oe(c)}getNamedWeights(t){const e=[],s=t!=null&&t.trainableOnly,r=s?this.trainableWeights:this.weights,o=this.getWeights(s);for(let i=0;i<r.length;++i)s&&!r[i].trainable||e.push({name:r[i].originalName,tensor:o[i]});return e}set stopTraining(t){this.stopTraining_=t}get stopTraining(){return this.stopTraining_}get optimizer(){return this.optimizer_}set optimizer(t){this.optimizer_!==t&&(this.optimizer_=t,this.isOptimizerOwned=!1)}dispose(){const t=super.dispose();if(t.refCountAfterDispose===0&&this.optimizer!=null&&this.isOptimizerOwned){const e=Qp().numTensors;this.optimizer_.dispose(),t.numDisposedVariables+=e-Qp().numTensors}return t}getLossIdentifiers(){let t;if(typeof this.loss=="string")t=Wn(this.loss);else if(Array.isArray(this.loss)){for(const e of this.loss)if(typeof e!="string")throw new Error("Serialization of non-string loss is not supported.");t=this.loss.map(e=>Wn(e))}else{const e=Object.keys(this.loss);t={};const s=this.loss;for(const r of e)if(typeof s[r]=="string")t[r]=Wn(s[r]);else throw new Error("Serialization of non-string loss is not supported.")}return t}getMetricIdentifiers(){if(typeof this.metrics=="string"||typeof this.metrics=="function")return[Wn(ra(this.metrics))];if(Array.isArray(this.metrics))return this.metrics.map(t=>Wn(ra(t)));{const t={};for(const e in this.metrics)t[e]=Wn(ra(this.metrics[e]));return t}}getTrainingConfig(){return{loss:this.getLossIdentifiers(),metrics:this.getMetricIdentifiers(),optimizer_config:{class_name:this.optimizer.getClassName(),config:this.optimizer.getConfig()}}}loadTrainingConfig(t){if(t.weighted_metrics!=null)throw new Error("Loading weight_metrics is not supported yet.");if(t.loss_weights!=null)throw new Error("Loading loss_weights is not supported yet.");if(t.sample_weight_mode!=null)throw new Error("Loading sample_weight_mode is not supported yet.");const e=Du(t.optimizer_config),s=Hn(e);let r;if(typeof t.loss=="string")r=Ms(t.loss);else if(Array.isArray(t.loss))r=t.loss.map(i=>Ms(i));else if(t.loss!=null){r={};for(const i in t.loss)r[i]=Ms(t.loss[i])}let o;if(Array.isArray(t.metrics))o=t.metrics.map(i=>Ms(i));else if(t.metrics!=null){o={};for(const i in t.metrics)o[i]=Ms(t.metrics[i])}this.compile({loss:r,metrics:o,optimizer:s})}async save(t,e){if(typeof t=="string"){const l=TI(t);if(l.length===0)throw new O(`Cannot find any save handlers for URL '${t}'`);if(l.length>1)throw new O(`Found more than one (${l.length}) save handlers for URL '${t}'`);t=l[0]}if(t.save==null)throw new O("LayersModel.save() cannot proceed because the IOHandler provided does not have the `save` attribute defined.");const s=await Zp(this.getNamedWeights(e)),a={modelTopology:this.toJSON(null,!1),format:$R,generatedBy:`TensorFlow.js tfjs-layers v${kb}`,convertedBy:null};if((e==null?!1:e.includeOptimizer)&&this.optimizer!=null){a.trainingConfig=this.getTrainingConfig();const l="optimizer",{data:u,specs:h}=await Zp(await this.optimizer.getWeights(),l);s.specs.push(...h),s.data=vI([s.data,u])}return this.userDefinedMetadata!=null&&(Af(this.userDefinedMetadata,this.name,!0),a.userDefinedMetadata=this.userDefinedMetadata),a.weightData=s.data,a.weightSpecs=s.specs,t.save(a)}setUserDefinedMetadata(t){Af(t,this.name),this.userDefinedMetadata=t}getUserDefinedMetadata(){return this.userDefinedMetadata}}vr.className="Model";X(vr);class Eb extends vr{}Eb.className="Functional";X(Eb);class Co extends vr{constructor(t){if(super({inputs:[],outputs:[]}),t=t||{},this.trainable=!0,this.built=!1,this.name=t.name!=null?t.name:ml("sequential_"),t.layers!=null)for(const e of t.layers)this.add(e)}checkShape(t){if(t.inboundNodes[0].outputTensors[0].shape.some(s=>s<0))throw new O(`Negative dimension size caused by adding layer ${t.name} with input shape [${t.inboundNodes[0].inputTensors[0].shape}]`)}add(t){const e=t instanceof Co||t instanceof vr;let s;if(e){if(s=t,s.outputs.length!==1)throw new O("All layers in a Sequential model should have a single output tensor. For multi-output layers, use the functional API.");if(s.inputs.length!==1)throw new O("All layers in a Sequential model should have a single input tensor. For multi-input layers, use the functional API.")}if(this.outputs.length===0){if(t.inboundNodes.length===0){if(t.batchInputShape==null)throw new O("The first layer in a Sequential model must get an `inputShape` or `batchInputShape` argument.");const r=SE({batchShape:t.batchInputShape,dtype:t.dtype,name:t.name+"_input"});t.apply(r)}if(e)this.outputs=s.outputs,this.inputs=s.inputs;else{if(t.inboundNodes.length!==1)throw new O(`A layer added to a Sequential model must not already be connected somewhere else. LayersModel received layer ${t.name} which has ${t.inboundNodes.length} pre-existing inbound connections.`);if(t.inboundNodes[0].outputTensors.length!==1)throw new O("All layers in a Sequential model should have a single output tensor. For multi-output layers, use the functional API.");this.checkShape(t),this.outputs=[t.inboundNodes[0].outputTensors[0]],this.inputs=ub(this.outputs[0])}this.inboundNodes=[],new xl({outboundLayer:this,inboundLayers:[],nodeIndices:[],tensorIndices:[],inputTensors:this.inputs,outputTensors:this.outputs,inputMasks:tr(null,this.inputs.length),outputMasks:[null],inputShapes:this.inputs.map(r=>r.shape),outputShapes:this.outputs[0].shape})}else{const r=t.apply(this.outputs[0]);if(Array.isArray(r))throw new TypeError("All layers in a Sequential model should have a single output tensor. For multi-output layers, use the functional API.");this.checkShape(t),this.outputs=[r],this.inboundNodes[0].outputTensors=this.outputs,this.inboundNodes[0].outputShapes=[this.outputs[0].shape]}this.layers.push(t),this.built=!1}pop(){if(this.layers.length===0)throw new TypeError("There are no layers in the model.");if(this.layers.pop(),this.layers.length===0)this.outputs=[],this.inboundNodes=[],this.outboundNodes=[];else{const t=this.layers.length-1;this.layers[t].outboundNodes=[],this.outputs=[this.layers[t].output],this.inboundNodes[0].outputTensors=this.outputs,this.inboundNodes[0].outputShapes=[this.outputs[0].shape]}}call(t,e){return this.model==null&&this.build(),this.model.call(t,e)}build(t){if(Rt(t),this.inputs.length===0||this.outputs.length===0)throw new TypeError("Sequential model cannot be built: model is empty. Add some layers first.");this.model=new vr({inputs:this.inputs,outputs:this.outputs[0],name:this.name+"_model"}),this.model.trainable=this.trainable,this.supportsMasking=this.model.supportsMasking,this.inputLayers=this.model.inputLayers,this.inputLayersNodeIndices=this.model.inputLayersNodeIndices,this.inputLayersTensorIndices=this.model.inputLayersTensorIndices,this.outputLayers=this.model.outputLayers,this.outputLayersNodeIndices=this.model.outputLayersNodeIndices,this.outputLayersTensorIndices=this.model.outputLayersTensorIndices,this.nodesByDepth=this.model.nodesByDepth,this.containerNodes=this.model.containerNodes,this.outputNames=this.model.outputNames,this.inputNames=this.model.inputNames,this.built=!0}countParams(){return this.built||this.build(),super.countParams()}summary(t,e,s=console.log){this.built||this.build(),super.summary(t,e,s)}setWeights(t){this.model==null&&this.build(),this.model.setWeights(t)}evaluate(t,e,s={}){if(!this.built)throw new rn("The model needs to be compiled before being used.");return this.model.evaluate(t,e,s)}async evaluateDataset(t,e){if(!this.built)throw new rn("The model needs to be compiled before being used.");return this.model.evaluateDataset(t,e)}predict(t,e={}){return this.model==null&&this.build(),this.model.predict(t,e)}predictOnBatch(t){return this.model==null&&this.build(),this.model.predictOnBatch(t)}compile(t){this.build(),this.model.compile(t),this.optimizer_=this.model.optimizer,this.isOptimizerOwned=this.model.isOptimizerOwned,this.loss=this.model.loss,this.metrics=this.model.metrics,this.metricsTensors=this.model.metricsTensors,this.metricsNames=this.model.metricsNames}get optimizer(){return this.model==null?void 0:this.model.optimizer}set optimizer(t){this.model.optimizer=t}async fit(t,e,s={}){if(!this.built)throw new rn("The model needs to be compiled before being used.");return this.model.fit(t,e,s)}async fitDataset(t,e){if(!this.built)throw new rn("The model needs to be compiled before being used.");return this.model.fitDataset(t,e)}async trainOnBatch(t,e){return this.model.trainOnBatch(t,e)}static fromConfig(t,e,s={},r=!1){let o,i={};if(e instanceof Array){if(e[0].className==null||e[0].className==="Merge")throw new O("Legacy serialization format not supported yet.");o=e}else S(e.layers!=null,()=>"When the config data for a Sequential model is not an Array, it must be an Object that contains the 'layers' field."),o=e.layers,delete e.layers,i=e;const a=new t(i);if(!(a instanceof Co))throw new bt(`Sequential.fromConfig called on non-Sequential input: ${a}`);for(const c of o){const u=Hn(c,void 0,r);r&&u.setFastWeightInitDuringBuild(!0),a.add(u)}return a}set stopTraining(t){if(this.model==null)throw new O("Cannot set the stopTraining property of a sequential model before it is compiled.");this.model.stopTraining=t}get stopTraining(){if(this.model==null)throw new O("Cannot get the stopTraining property of a sequential model before it is compiled.");return this.model.stopTraining}getConfig(){const t=[];for(const e of this.layers){const s={};s.className=e.getClassName(),s.config=e.getConfig(),t.push(s)}return{name:this.name,layers:t}}}Co.className="Sequential";X(Co);let Pe=class extends Br{getConfig(){return{}}};class Rb extends Pe{apply(t,e=1){return dE(t,e)}}Rb.className="elu";X(Rb);class Db extends Pe{apply(t){return ox(t)}}Db.className="selu";X(Db);class Ab extends Pe{apply(t){return Yn(t)}}Ab.className="relu";X(Ab);class Fb extends Pe{apply(t){return z(()=>cl(6,Yn(t)))}}Fb.className="relu6";X(Fb);class Ob extends Pe{apply(t){return t}}Ob.className="linear";X(Ob);class _b extends Pe{apply(t){return zr(t)}}_b.className="sigmoid";X(_b);class Mb extends Pe{apply(t){return fE(t)}}Mb.className="hardSigmoid";X(Mb);class Lb extends Pe{apply(t){return Ei(t)}}Lb.className="softplus";X(Lb);class Pb extends Pe{apply(t){return pE(t)}}Pb.className="softsign";X(Pb);class Bb extends Pe{apply(t){return jh(t)}}Bb.className="tanh";X(Bb);let hp=class extends Pe{apply(t,e=-1){return dd(t,e)}};hp.className="softmax";X(hp);class zb extends Pe{apply(t,e=-1){return Qg(t,e)}}zb.className="logSoftmax";X(zb);class Vb extends Pe{apply(t,e=1){return z(()=>D(zr(D(t,e)),t))}}Vb.className="swish";X(Vb);class Wb extends Pe{apply(t){return z(()=>D(t,jh(Ei(t))))}}Wb.className="mish";X(Wb);function ds(n){return n.getClassName()}function Hl(n,t={}){return _i(n,sn.getMap().classNameMap,t,"activation")}function ps(n){if(n==null){const t={};return t.className="linear",t.config={},Hl(t)}if(typeof n=="string"){const t={};return t.className=n,t.config={},Hl(t)}else return n instanceof Pe?n:Hl(n)}function SR(n){if(n!=null&&typeof n!="object")throw new Error(`Argument to L1L2 regularizer's constructor is expected to be an object, but received: ${n}`)}class Ub extends Br{}class Gb extends Ub{constructor(t){super(),SR(t),this.l1=t==null||t.l1==null?.01:t.l1,this.l2=t==null||t.l2==null?.01:t.l2,this.hasL1=this.l1!==0,this.hasL2=this.l2!==0}apply(t){return z(()=>{let e=he([1]);return this.hasL1&&(e=J(e,it(D(this.l1,le(t))))),this.hasL2&&(e=J(e,it(D(this.l2,Pi(t))))),M(e,[])})}getConfig(){return{l1:this.l1,l2:this.l2}}static fromConfig(t,e){return new t({l1:e.l1,l2:e.l2})}}Gb.className="L1L2";X(Gb);const Pf={l1l2:"L1L2"};function Ot(n){return Yd(n)}function Bf(n,t={}){return _i(n,sn.getMap().classNameMap,t,"regularizer")}function Gt(n){if(n==null)return null;if(typeof n=="string"){const e={className:n in Pf?Pf[n]:n,config:{}};return Bf(e)}else return n instanceof Ub?n:Bf(n)}class Hb extends kt{constructor(t){super(t??{}),this.supportsMasking=!0,t!=null&&(this.maxValue=t.maxValue)}call(t,e){t=gt(t);let s=Yn(t);return this.maxValue!=null&&(s=Ze(s,0,this.maxValue)),s}computeOutputShape(t){return t}getConfig(){const t={maxValue:this.maxValue},e=super.getConfig();return Object.assign(t,e),t}}Hb.className="ReLU";X(Hb);class qb extends kt{constructor(t){super(t??{}),this.DEFAULT_ALPHA=.3,t==null&&(t={}),this.alpha=t.alpha==null?this.DEFAULT_ALPHA:t.alpha}call(t,e){const s=gt(t);return ed(s,this.alpha)}computeOutputShape(t){return t}getConfig(){const t={alpha:this.alpha},e=super.getConfig();return Object.assign(t,e),t}}qb.className="LeakyReLU";X(qb);class Kb extends kt{constructor(t){if(super(t??{}),this.DEFAULT_ALPHA_INITIALIZER="zeros",t==null&&(t={}),this.supportsMasking=!0,this.alphaInitializer=Ut(t.alphaInitializer||this.DEFAULT_ALPHA_INITIALIZER),this.alphaRegularizer=Gt(t.alphaRegularizer),this.alphaConstraint=ae(t.alphaConstraint),t.sharedAxes==null)this.sharedAxes=null;else if(Array.isArray(t.sharedAxes))this.sharedAxes=t.sharedAxes;else if(typeof t.sharedAxes=="number")this.sharedAxes=[t.sharedAxes];else throw new O(`Expected sharedAxes to be a number or an array of numbers, but got ${t.sharedAxes}`)}build(t){t=Rt(t);const e=t.slice(1);if(this.sharedAxes!=null)for(const r of this.sharedAxes)e[r-1]=1;this.alpha=this.addWeight("alpha",e,"float32",this.alphaInitializer,this.alphaRegularizer,!0,this.alphaConstraint);const s={};if(this.sharedAxes!=null)for(let r=1;r<t.length;++r)s[r]=t[r];this.inputSpec=[new oe({ndim:t.length,axes:s})],this.built=!0}call(t,e){return t=gt(t),cd(t,this.alpha.read())}getConfig(){const t={alphaInitializer:Ht(this.alphaInitializer),alphaRegularizer:Ot(this.alphaRegularizer),alphaConstraint:ie(this.alphaConstraint),sharedAxes:this.sharedAxes},e=super.getConfig();return Object.assign(t,e),t}}Kb.className="PReLU";X(Kb);let jb=class extends kt{constructor(t){if(super(t??{}),this.DEFAULT_ALPHA=1,t==null&&(t={}),t.alpha!=null&&t.alpha!==this.DEFAULT_ALPHA)throw new bt(`Non-default alpha value (${t.alpha}) is not supported by the ELU layer yet.`);this.alpha=t.alpha==null?this.DEFAULT_ALPHA:t.alpha}call(t,e){const s=gt(t);return ol(s)}computeOutputShape(t){return t}getConfig(){const t={alpha:this.alpha},e=super.getConfig();return Object.assign(t,e),t}};jb.className="ELU";X(jb);class Xb extends kt{constructor(t){super(t??{}),this.DEFAULT_THETA=1,t==null&&(t={}),this.theta=t.theta==null?this.DEFAULT_THETA:t.theta}call(t,e){const s=gt(t);return D(s,nt(dn(s,this.theta),"float32"))}computeOutputShape(t){return t}getConfig(){const t={theta:this.theta},e=super.getConfig();return Object.assign(t,e),t}}Xb.className="ThresholdedReLU";X(Xb);class Yb extends kt{constructor(t){super(t??{}),this.DEFAULT_AXIS=1,t==null&&(t={}),this.softmax=new hp().apply,this.axis=t.axis==null?this.DEFAULT_AXIS:t.axis}call(t,e){const s=gt(t);return this.softmax(s,this.axis)}computeOutputShape(t){return t}getConfig(){const t={axis:this.axis},e=super.getConfig();return Object.assign(t,e),t}}Yb.className="Softmax";X(Yb);function Cr(n,t,e){if(typeof n=="number")return tr(n,t);if(n.length!==t)throw new O(`The ${e} argument must be an integer or tuple of ${t} integers. Received: ${n.length} elements.`);for(let s=0;s<t;++s){const r=n[s];if(!cE(r))throw new O(`The ${e} argument must be an integer or tuple of ${t} integers. Received: ${JSON.stringify(n)} including a non-integer number ${r}`)}return n}function vn(n,t,e,s,r=1){if(n==null)return n;const o=t+(t-1)*(r-1);let i;return e==="same"?i=n:i=n-o+1,Math.floor((i+s-1)/s)}function En(n,t,e,s){if(n==null)return null;if(s==="valid")n=n*t+hs([e-t,0]);else if(s==="same")n=n*t;else throw new O(`Unsupport padding mode: ${s}.`);return n}function dp(n,t){return z(()=>(te(t),t==="channelsFirst"?Ct(n,[0,2,3,1]):n))}function Zb(n,t){return z(()=>(te(t),t==="channelsFirst"?Ct(n,[0,2,3,4,1]):n))}function NR(n,t,e,s=1,r="valid",o,i=1){return z(()=>{if(o==null&&(o=kn()),te(o),n.shape.length!==3)throw new O(`The input of a conv1dWithBias operation should be 3, but is ${n.shape.length} instead.`);if(t.shape.length!==3)throw new O(`The kernel for a conv1dWithBias operation should be 3, but is ${t.shape.length} instead`);if(e!=null&&e.shape.length!==1)throw new O(`The bias for a conv1dWithBias operation should be 1, but is ${t.shape.length} instead`);if(o==="channelsFirst"&&(n=Ct(n,[0,2,1])),r==="causal")throw new bt("The support for CAUSAL padding mode in conv1dWithBias is not implemented yet.");let a=Gg(n,t,s,r==="same"?"same":"valid","NWC",i);return e!=null&&(a=Sn(a,e)),a})}function zf(n,t,e,s=[1,1],r="valid",o,i,a=null){return z(()=>{if(o==null&&(o=kn()),te(o),n.rank!==3&&n.rank!==4)throw new O(`conv2dWithBiasActivation expects input to be of rank 3 or 4, but received ${n.rank}.`);if(t.rank!==3&&t.rank!==4)throw new O(`conv2dWithBiasActivation expects kernel to be of rank 3 or 4, but received ${n.rank}.`);let c=dp(n,o);if(r==="causal")throw new bt("The support for CAUSAL padding mode in conv1dWithBias is not implemented yet.");return c=uS({x:c,filter:t,strides:s,pad:r==="same"?"same":"valid",dilations:i,dataFormat:"NHWC",bias:e,activation:a}),o==="channelsFirst"&&(c=Ct(c,[0,3,1,2])),c})}function TR(n,t,e,s=[1,1,1],r="valid",o,i){return z(()=>{if(o==null&&(o=kn()),te(o),n.rank!==4&&n.rank!==5)throw new O(`conv3dWithBias expects input to be of rank 4 or 5, but received ${n.rank}.`);if(t.rank!==4&&t.rank!==5)throw new O(`conv3dWithBias expects kernel to be of rank 4 or 5, but received ${n.rank}.`);let a=Zb(n,o);if(r==="causal")throw new bt("The support for CAUSAL padding mode in conv3dWithBias is not implemented yet.");return a=gC(a,t,s,r==="same"?"same":"valid","NDHWC",i),e!=null&&(a=Sn(a,e)),o==="channelsFirst"&&(a=Ct(a,[0,4,1,2,3])),a})}class wl extends kt{constructor(t,e){if(super(e),this.bias=null,this.DEFAULT_KERNEL_INITIALIZER="glorotNormal",this.DEFAULT_BIAS_INITIALIZER="zeros",wl.verifyArgs(e),this.rank=t,pe(this.rank,"rank"),this.rank!==1&&this.rank!==2&&this.rank!==3)throw new bt(`Convolution layer for rank other than 1, 2, or 3 (${this.rank}) is not implemented yet.`);if(this.kernelSize=Cr(e.kernelSize,t,"kernelSize"),this.strides=Cr(e.strides==null?1:e.strides,t,"strides"),this.padding=e.padding==null?"valid":e.padding,Je(this.padding),this.dataFormat=e.dataFormat==null?"channelsLast":e.dataFormat,te(this.dataFormat),this.activation=ps(e.activation),this.useBias=e.useBias==null?!0:e.useBias,this.biasInitializer=Ut(e.biasInitializer||this.DEFAULT_BIAS_INITIALIZER),this.biasConstraint=ae(e.biasConstraint),this.biasRegularizer=Gt(e.biasRegularizer),this.activityRegularizer=Gt(e.activityRegularizer),this.dilationRate=Cr(e.dilationRate==null?1:e.dilationRate,t,"dilationRate"),this.rank===1&&Array.isArray(this.dilationRate)&&this.dilationRate.length!==1)throw new O(`dilationRate must be a number or an array of a single number for 1D convolution, but received ${JSON.stringify(this.dilationRate)}`);if(this.rank===2){if(typeof this.dilationRate=="number")this.dilationRate=[this.dilationRate,this.dilationRate];else if(this.dilationRate.length!==2)throw new O(`dilationRate must be a number or array of two numbers for 2D convolution, but received ${JSON.stringify(this.dilationRate)}`)}else if(this.rank===3){if(typeof this.dilationRate=="number")this.dilationRate=[this.dilationRate,this.dilationRate,this.dilationRate];else if(this.dilationRate.length!==3)throw new O(`dilationRate must be a number or array of three numbers for 3D convolution, but received ${JSON.stringify(this.dilationRate)}`)}}static verifyArgs(t){if(Tn("kernelSize"in t,"required key 'kernelSize' not in config"),typeof t.kernelSize!="number"&&!Zd(t.kernelSize,"number",1,3))throw new O(`BaseConv expects config.kernelSize to be number or number[] with length 1, 2, or 3, but received ${JSON.stringify(t.kernelSize)}.`)}getConfig(){const t={kernelSize:this.kernelSize,strides:this.strides,padding:this.padding,dataFormat:this.dataFormat,dilationRate:this.dilationRate,activation:ds(this.activation),useBias:this.useBias,biasInitializer:Ht(this.biasInitializer),biasRegularizer:Ot(this.biasRegularizer),activityRegularizer:Ot(this.activityRegularizer),biasConstraint:ie(this.biasConstraint)},e=super.getConfig();return Object.assign(t,e),t}}class Gr extends wl{constructor(t,e){super(t,e),this.kernel=null,Gr.verifyArgs(e),this.filters=e.filters,pe(this.filters,"filters"),this.kernelInitializer=Ut(e.kernelInitializer||this.DEFAULT_KERNEL_INITIALIZER),this.kernelConstraint=ae(e.kernelConstraint),this.kernelRegularizer=Gt(e.kernelRegularizer)}build(t){t=Rt(t);const e=this.dataFormat==="channelsFirst"?1:t.length-1;if(t[e]==null)throw new O(`The channel dimension of the input should be defined. Found ${t[e]}`);const s=t[e],r=this.kernelSize.concat([s,this.filters]);this.kernel=this.addWeight("kernel",r,null,this.kernelInitializer,this.kernelRegularizer,!0,this.kernelConstraint),this.useBias&&(this.bias=this.addWeight("bias",[this.filters],null,this.biasInitializer,this.biasRegularizer,!0,this.biasConstraint)),this.inputSpec=[{ndim:this.rank+2,axes:{[e]:s}}],this.built=!0}call(t,e){return z(()=>{t=gt(t);let s;const r=this.bias==null?null:this.bias.read(),o=Xx(this.activation.getClassName());if(o!=null&&this.rank===2)s=zf(t,this.kernel.read(),r,this.strides,this.padding,this.dataFormat,this.dilationRate,o);else{if(this.rank===1)s=NR(t,this.kernel.read(),r,this.strides[0],this.padding,this.dataFormat,this.dilationRate[0]);else if(this.rank===2)s=zf(t,this.kernel.read(),r,this.strides,this.padding,this.dataFormat,this.dilationRate);else if(this.rank===3)s=TR(t,this.kernel.read(),r,this.strides,this.padding,this.dataFormat,this.dilationRate);else throw new bt("convolutions greater than 3D are not implemented yet.");this.activation!=null&&(s=this.activation.apply(s))}return s})}computeOutputShape(t){t=Rt(t);const e=[],s=this.dataFormat==="channelsLast"?t.slice(1,t.length-1):t.slice(2);for(let o=0;o<s.length;++o){const i=vn(s[o],this.kernelSize[o],this.padding,this.strides[o],typeof this.dilationRate=="number"?this.dilationRate:this.dilationRate[o]);e.push(i)}let r=[t[0]];return this.dataFormat==="channelsLast"?(r=r.concat(e),r.push(this.filters)):(r.push(this.filters),r=r.concat(e)),r}getConfig(){const t={filters:this.filters,kernelInitializer:Ht(this.kernelInitializer),kernelRegularizer:Ot(this.kernelRegularizer),kernelConstraint:ie(this.kernelConstraint)},e=super.getConfig();return Object.assign(t,e),t}static verifyArgs(t){if(!("filters"in t)||typeof t.filters!="number"||t.filters<1)throw new O(`Convolution layer expected config.filters to be a 'number' > 0 but got ${JSON.stringify(t.filters)}`)}}class Wi extends Gr{constructor(t){super(2,t),Wi.verifyArgs(t)}getConfig(){const t=super.getConfig();return delete t.rank,t}static verifyArgs(t){if(typeof t.kernelSize!="number"&&!Zd(t.kernelSize,"number",1,2))throw new O(`Conv2D expects config.kernelSize to be number or number[] with length 1 or 2, but received ${JSON.stringify(t.kernelSize)}.`)}}Wi.className="Conv2D";X(Wi);class Ui extends Gr{constructor(t){super(3,t),Ui.verifyArgs(t)}getConfig(){const t=super.getConfig();return delete t.rank,t}static verifyArgs(t){if(typeof t.kernelSize!="number"&&!(Array.isArray(t.kernelSize)&&(t.kernelSize.length===1||t.kernelSize.length===3)))throw new O(`Conv3D expects config.kernelSize to be number or [number, number, number], but received ${JSON.stringify(t.kernelSize)}.`)}}Ui.className="Conv3D";X(Ui);class Jb extends Wi{constructor(t){if(super(t),this.inputSpec=[new oe({ndim:4})],this.padding!=="same"&&this.padding!=="valid")throw new O(`Conv2DTranspose currently supports only padding modes 'same' and 'valid', but received padding mode ${this.padding}`)}build(t){if(t=Rt(t),t.length!==4)throw new O("Input should have rank 4; Received input shape: "+JSON.stringify(t));const e=this.dataFormat==="channelsFirst"?1:t.length-1;if(t[e]==null)throw new O("The channel dimension of the inputs should be defined. Found `None`.");const s=t[e],r=this.kernelSize.concat([this.filters,s]);this.kernel=this.addWeight("kernel",r,"float32",this.kernelInitializer,this.kernelRegularizer,!0,this.kernelConstraint),this.useBias&&(this.bias=this.addWeight("bias",[this.filters],"float32",this.biasInitializer,this.biasRegularizer,!0,this.biasConstraint)),this.inputSpec=[new oe({ndim:4,axes:{[e]:s}})],this.built=!0}call(t,e){return z(()=>{let s=gt(t);if(s.shape.length!==4)throw new O(`Conv2DTranspose.call() expects input tensor to be rank-4, but received a tensor of rank-${s.shape.length}`);const r=s.shape,o=r[0];let i,a;this.dataFormat==="channelsFirst"?(i=2,a=3):(i=1,a=2);const c=r[i],l=r[a],u=this.kernelSize[0],h=this.kernelSize[1],d=this.strides[0],p=this.strides[1],f=En(c,d,u,this.padding),m=En(l,p,h,this.padding),g=[o,f,m,this.filters];this.dataFormat!=="channelsLast"&&(s=Ct(s,[0,2,3,1]));let x=Hg(s,this.kernel.read(),g,this.strides,this.padding);return this.dataFormat!=="channelsLast"&&(x=Ct(x,[0,3,1,2])),this.bias!=null&&(x=Sn(x,this.bias.read(),this.dataFormat)),this.activation!=null&&(x=this.activation.apply(x)),x})}computeOutputShape(t){t=Rt(t);const e=t.slice();let s,r,o;this.dataFormat==="channelsFirst"?(s=1,r=2,o=3):(s=3,r=1,o=2);const i=this.kernelSize[0],a=this.kernelSize[1],c=this.strides[0],l=this.strides[1];return e[s]=this.filters,e[r]=En(e[r],c,i,this.padding),e[o]=En(e[o],l,a,this.padding),e}getConfig(){const t=super.getConfig();return delete t.dilationRate,t}}Jb.className="Conv2DTranspose";X(Jb);class Qb extends Ui{constructor(t){if(super(t),this.inputSpec=[new oe({ndim:5})],this.padding!=="same"&&this.padding!=="valid")throw new O(`Conv3DTranspose currently supports only padding modes 'same' and 'valid', but received padding mode ${this.padding}`)}build(t){if(t=Rt(t),t.length!==5)throw new O("Input should have rank 5; Received input shape: "+JSON.stringify(t));const e=this.dataFormat==="channelsFirst"?1:t.length-1;if(t[e]==null)throw new O("The channel dimension of the inputs should be defined. Found `None`.");const s=t[e],r=this.kernelSize.concat([this.filters,s]);this.kernel=this.addWeight("kernel",r,"float32",this.kernelInitializer,this.kernelRegularizer,!0,this.kernelConstraint),this.useBias&&(this.bias=this.addWeight("bias",[this.filters],"float32",this.biasInitializer,this.biasRegularizer,!0,this.biasConstraint)),this.inputSpec=[new oe({ndim:5,axes:{[e]:s}})],this.built=!0}call(t,e){return z(()=>{let s=gt(t);if(s.shape.length!==5)throw new O(`Conv3DTranspose.call() expects input tensor to be rank-4, but received a tensor of rank-${s.shape.length}`);const r=s.shape,o=r[0];let i,a,c;this.dataFormat==="channelsFirst"?(c=2,i=3,a=4):(c=1,i=2,a=3);const l=r[c],u=r[i],h=r[a],d=this.kernelSize[0],p=this.kernelSize[1],f=this.kernelSize[2],m=this.strides[0],g=this.strides[1],x=this.strides[2],b=En(l,m,d,this.padding),w=En(u,g,p,this.padding),y=En(h,x,f,this.padding),I=[o,b,w,y,this.filters];this.dataFormat!=="channelsLast"&&(s=Ct(s,[0,2,3,4,1]));let C=yC(s,this.kernel.read(),I,this.strides,this.padding);return this.dataFormat!=="channelsLast"&&(C=Ct(C,[0,4,1,2,3])),this.bias!==null&&(C=Sn(C,this.bias.read(),this.dataFormat)),this.activation!==null&&(C=this.activation.apply(C)),C})}computeOutputShape(t){t=Rt(t);const e=t.slice();let s,r,o,i;this.dataFormat==="channelsFirst"?(s=1,r=2,o=3,i=4):(s=4,r=1,o=2,i=3);const a=this.kernelSize[0],c=this.kernelSize[1],l=this.kernelSize[2],u=this.strides[0],h=this.strides[1],d=this.strides[2];return e[s]=this.filters,e[r]=En(e[r],u,a,this.padding),e[o]=En(e[o],h,c,this.padding),e[i]=En(e[i],d,l,this.padding),e}getConfig(){const t=super.getConfig();return delete t.dilationRate,t}}Qb.className="Conv3DTranspose";X(Qb);class t0 extends Gr{constructor(t,e){if(super(t,e),this.DEFAULT_DEPTHWISE_INITIALIZER="glorotUniform",this.DEFAULT_POINTWISE_INITIALIZER="glorotUniform",this.depthwiseKernel=null,this.pointwiseKernel=null,e.filters==null)throw new O("The `filters` configuration field is required by SeparableConv, but is unspecified.");if(e.kernelInitializer!=null||e.kernelRegularizer!=null||e.kernelConstraint!=null)throw new O("Fields kernelInitializer, kernelRegularizer and kernelConstraint are invalid for SeparableConv2D. Use depthwiseInitializer, depthwiseRegularizer, depthwiseConstraint, pointwiseInitializer, pointwiseRegularizer and pointwiseConstraint instead.");if(e.padding!=null&&e.padding!=="same"&&e.padding!=="valid")throw new O(`SeparableConv${this.rank}D supports only padding modes: 'same' and 'valid', but received ${JSON.stringify(e.padding)}`);this.depthMultiplier=e.depthMultiplier==null?1:e.depthMultiplier,this.depthwiseInitializer=Ut(e.depthwiseInitializer||this.DEFAULT_DEPTHWISE_INITIALIZER),this.depthwiseRegularizer=Gt(e.depthwiseRegularizer),this.depthwiseConstraint=ae(e.depthwiseConstraint),this.pointwiseInitializer=Ut(e.depthwiseInitializer||this.DEFAULT_POINTWISE_INITIALIZER),this.pointwiseRegularizer=Gt(e.pointwiseRegularizer),this.pointwiseConstraint=ae(e.pointwiseConstraint)}build(t){if(t=Rt(t),t.length<this.rank+2)throw new O(`Inputs to SeparableConv${this.rank}D should have rank ${this.rank+2}, but received input shape: ${JSON.stringify(t)}`);const e=this.dataFormat==="channelsFirst"?1:t.length-1;if(t[e]==null||t[e]<0)throw new O(`The channel dimension of the inputs should be defined, but found ${JSON.stringify(t[e])}`);const s=t[e],r=this.kernelSize.concat([s,this.depthMultiplier]),o=[];for(let a=0;a<this.rank;++a)o.push(1);o.push(s*this.depthMultiplier,this.filters);const i=!0;this.depthwiseKernel=this.addWeight("depthwise_kernel",r,"float32",this.depthwiseInitializer,this.depthwiseRegularizer,i,this.depthwiseConstraint),this.pointwiseKernel=this.addWeight("pointwise_kernel",o,"float32",this.pointwiseInitializer,this.pointwiseRegularizer,i,this.pointwiseConstraint),this.useBias?this.bias=this.addWeight("bias",[this.filters],"float32",this.biasInitializer,this.biasRegularizer,i,this.biasConstraint):this.bias=null,this.inputSpec=[new oe({ndim:this.rank+2,axes:{[e]:s}})],this.built=!0}call(t,e){return z(()=>{t=gt(t);let s;if(this.rank===1)throw new bt("1D separable convolution is not implemented yet.");return this.rank===2&&(this.dataFormat==="channelsFirst"&&(t=Ct(t,[0,2,3,1])),s=ix(t,this.depthwiseKernel.read(),this.pointwiseKernel.read(),this.strides,this.padding,this.dilationRate,"NHWC")),this.useBias&&(s=Sn(s,this.bias.read(),this.dataFormat)),this.activation!=null&&(s=this.activation.apply(s)),this.dataFormat==="channelsFirst"&&(s=Ct(s,[0,3,1,2])),s})}getConfig(){const t=super.getConfig();return delete t.rank,delete t.kernelInitializer,delete t.kernelRegularizer,delete t.kernelConstraint,t.depthwiseInitializer=Ht(this.depthwiseInitializer),t.pointwiseInitializer=Ht(this.pointwiseInitializer),t.depthwiseRegularizer=Ot(this.depthwiseRegularizer),t.pointwiseRegularizer=Ot(this.pointwiseRegularizer),t.depthwiseConstraint=ie(this.depthwiseConstraint),t.pointwiseConstraint=ie(this.pointwiseConstraint),t}}t0.className="SeparableConv";class e0 extends t0{constructor(t){super(2,t)}}e0.className="SeparableConv2D";X(e0);class Il extends Gr{constructor(t){super(1,t),Il.verifyArgs(t),this.inputSpec=[{ndim:3}]}getConfig(){const t=super.getConfig();return delete t.rank,delete t.dataFormat,t}static verifyArgs(t){if(typeof t.kernelSize!="number"&&!Zd(t.kernelSize,"number",1,1))throw new O(`Conv1D expects config.kernelSize to be number or number[] with length 1, but received ${JSON.stringify(t.kernelSize)}.`)}}Il.className="Conv1D";X(Il);class n0 extends kt{constructor(t){super(t),typeof t.cropping=="number"?this.cropping=[[t.cropping,t.cropping],[t.cropping,t.cropping]]:typeof t.cropping[0]=="number"?this.cropping=[[t.cropping[0],t.cropping[0]],[t.cropping[1],t.cropping[1]]]:this.cropping=t.cropping,this.dataFormat=t.dataFormat===void 0?"channelsLast":t.dataFormat,this.inputSpec=[{ndim:4}]}computeOutputShape(t){return this.dataFormat==="channelsFirst"?[t[0],t[1],t[2]-this.cropping[0][0]-this.cropping[0][1],t[3]-this.cropping[1][0]-this.cropping[1][1]]:[t[0],t[1]-this.cropping[0][0]-this.cropping[0][1],t[2]-this.cropping[1][0]-this.cropping[1][1],t[3]]}call(t,e){return z(()=>{if(t=gt(t),this.dataFormat==="channelsLast"){const s=sa(t,this.cropping[0][0],t.shape[1]-this.cropping[0][0]-this.cropping[0][1],2);return sa(s,this.cropping[1][0],t.shape[2]-this.cropping[1][1]-this.cropping[1][0],3)}else{const s=sa(t,this.cropping[0][0],t.shape[2]-this.cropping[0][0]-this.cropping[0][1],3);return sa(s,this.cropping[1][0],t.shape[3]-this.cropping[1][1]-this.cropping[1][0],4)}})}getConfig(){const t={cropping:this.cropping,dataFormat:this.dataFormat},e=super.getConfig();return Object.assign(t,e),t}}n0.className="Cropping2D";X(n0);class s0 extends kt{constructor(t){super(t),this.DEFAULT_SIZE=[2,2],this.inputSpec=[{ndim:4}],this.size=t.size==null?this.DEFAULT_SIZE:t.size,this.dataFormat=t.dataFormat==null?"channelsLast":t.dataFormat,te(this.dataFormat),this.interpolation=t.interpolation==null?"nearest":t.interpolation,oE(this.interpolation)}computeOutputShape(t){if(this.dataFormat==="channelsFirst"){const e=t[2]==null?null:this.size[0]*t[2],s=t[3]==null?null:this.size[1]*t[3];return[t[0],t[1],e,s]}else{const e=t[1]==null?null:this.size[0]*t[1],s=t[2]==null?null:this.size[1]*t[2];return[t[0],e,s,t[3]]}}call(t,e){return z(()=>{let s=gt(t);const r=s.shape;if(this.dataFormat==="channelsFirst"){s=Ct(s,[0,2,3,1]);const o=this.size[0]*r[2],i=this.size[1]*r[3],a=this.interpolation==="nearest"?ta.resizeNearestNeighbor(s,[o,i]):ta.resizeBilinear(s,[o,i]);return Ct(a,[0,3,1,2])}else{const o=this.size[0]*r[1],i=this.size[1]*r[2];return this.interpolation==="nearest"?ta.resizeNearestNeighbor(s,[o,i]):ta.resizeBilinear(s,[o,i])}})}getConfig(){const t={size:this.size,dataFormat:this.dataFormat,interpolation:this.interpolation},e=super.getConfig();return Object.assign(t,e),t}}s0.className="UpSampling2D";X(s0);function ER(n,t,e=[1,1],s="valid",r,o){return z(()=>{r==null&&(r=kn()),te(r);let i=dp(n,r);if(n.rank!==4)throw new O(`Input for depthwiseConv2d is required to be 4-D, but is instead ${n.rank}-D`);if(t.rank!==4)throw new O(`depthwiseKernel is required to be 4-D, but is instead ${t.rank}-D`);return i=Jh(i,t,e,s==="same"?"same":"valid","NHWC",o),r==="channelsFirst"&&(i=Ct(i,[0,3,1,2])),i})}class r0 extends wl{constructor(t){super(2,t),this.depthwiseKernel=null,this.depthMultiplier=t.depthMultiplier==null?1:t.depthMultiplier,this.depthwiseInitializer=Ut(t.depthwiseInitializer||this.DEFAULT_KERNEL_INITIALIZER),this.depthwiseConstraint=ae(t.depthwiseConstraint),this.depthwiseRegularizer=Gt(t.depthwiseRegularizer)}build(t){if(t=Rt(t),t.length<4)throw new O(`Inputs to DepthwiseConv2D should have rank 4. Received input shape: ${JSON.stringify(t)}.`);const e=this.dataFormat==="channelsFirst"?1:3;if(t[e]==null||t[e]<0)throw new O(`The channel dimension of the inputs to DepthwiseConv2D should be defined, but is not (${t[e]}).`);const s=t[e],r=[this.kernelSize[0],this.kernelSize[1],s,this.depthMultiplier];this.depthwiseKernel=this.addWeight("depthwise_kernel",r,null,this.depthwiseInitializer,this.depthwiseRegularizer,!0,this.depthwiseConstraint),this.useBias?this.bias=this.addWeight("bias",[s*this.depthMultiplier],null,this.biasInitializer,this.biasRegularizer,!0,this.biasConstraint):this.bias=null,this.built=!0}call(t,e){return z(()=>{t=gt(t);let s=ER(t,this.depthwiseKernel.read(),this.strides,this.padding,this.dataFormat,null);return this.useBias&&(s=Sn(s,this.bias.read(),this.dataFormat)),this.activation!=null&&(s=this.activation.apply(s)),s})}computeOutputShape(t){t=Rt(t);const e=this.dataFormat==="channelsFirst"?t[2]:t[1],s=this.dataFormat==="channelsFirst"?t[3]:t[2],r=this.dataFormat==="channelsFirst"?t[1]*this.depthMultiplier:t[3]*this.depthMultiplier,o=vn(e,this.kernelSize[0],this.padding,this.strides[0]),i=vn(s,this.kernelSize[1],this.padding,this.strides[1]);return this.dataFormat==="channelsFirst"?[t[0],r,o,i]:[t[0],o,i,r]}getConfig(){const t=super.getConfig();return t.depthMultiplier=this.depthMultiplier,t.depthwiseInitializer=Ht(this.depthwiseInitializer),t.depthwiseRegularizer=Ot(this.depthwiseRegularizer),t.depthwiseConstraint=ie(this.depthwiseRegularizer),t}}r0.className="DepthwiseConv2D";X(r0);function o0(n,t,e,s){if(Array.isArray(n)){if(t!=null||e!=null)throw new O("When inputs is an array, neither initialState or constants should be provided");s!=null&&(e=n.slice(n.length-s,n.length),n=n.slice(0,n.length-s)),n.length>1&&(t=n.slice(1,n.length)),n=n[0]}function r(o){return o==null||Array.isArray(o)?o:[o]}return t=r(t),e=r(e),{inputs:n,initialState:t,constants:e}}function i0(n,t,e,s=!1,r,o,i=!1,a=!1){return z(()=>{const c=t.shape.length;if(c<3)throw new O(`Input should be at least 3D, but is ${c}D.`);const l=[1,0].concat(Cn(2,c));t=Ct(t,l),i&&console.warn("Backend rnn(): the unroll = true option is not applicable to the imperative deeplearn.js backend."),r!=null&&(r=nt(nt(r,"bool"),"float32"),r.rank===c-1&&(r=nn(r,-1)),r=Ct(r,l)),s&&(t=Zs(t,0),r!=null&&(r=Zs(r,0)));const u=[];let h,d=e;const p=t.shape[0],f=Er(t);let m;r!=null&&(m=Er(r));for(let x=0;x<p;++x){const b=f[x],w=z(()=>n(b,d));if(r==null)h=w[0],d=w[1];else{const y=z(()=>{const I=m[x],C=at(ln(I),I),N=J(D(w[0],I),D(d[0],C)),T=d.map(($,k)=>J(D(w[1][k],I),D($,C)));return{output:N,newStates:T}});h=y.output,d=y.newStates}a&&u.push(h)}let g;return a&&(g=Js(u,1)),[h,g,d]})}class Cs extends kt{constructor(t){super(t);let e;if(t.cell==null)throw new O("cell property is missing for the constructor of RNN.");if(Array.isArray(t.cell)?e=new mp({cells:t.cell}):e=t.cell,e.stateSize==null)throw new O("The RNN cell should have an attribute `stateSize` (tuple of integers, one integer per RNN state).");this.cell=e,this.returnSequences=t.returnSequences==null?!1:t.returnSequences,this.returnState=t.returnState==null?!1:t.returnState,this.goBackwards=t.goBackwards==null?!1:t.goBackwards,this._stateful=t.stateful==null?!1:t.stateful,this.unroll=t.unroll==null?!1:t.unroll,this.supportsMasking=!0,this.inputSpec=[new oe({ndim:3})],this.stateSpec=null,this.states_=null,this.numConstants=null,this.keptStates=[]}getStates(){if(this.states_==null){const t=Array.isArray(this.cell.stateSize)?this.cell.stateSize.length:1;return Cn(0,t).map(e=>null)}else return this.states_}setStates(t){this.states_=t}computeOutputShape(t){Tu(t)&&(t=t[0]),t=t;let e=this.cell.stateSize;Array.isArray(e)||(e=[e]);const s=e[0];let r;if(this.returnSequences?r=[t[0],t[1],s]:r=[t[0],s],this.returnState){const o=[];for(const i of e)o.push([t[0],i]);return[r].concat(o)}else return r}computeMask(t,e){return z(()=>{Array.isArray(e)&&(e=e[0]);const s=this.returnSequences?e:null;if(this.returnState){const r=this.states.map(o=>null);return[s].concat(r)}else return s})}get states(){if(this.states_==null){const t=Array.isArray(this.cell.stateSize)?this.cell.stateSize.length:1,e=[];for(let s=0;s<t;++s)e.push(null);return e}else return this.states_}set states(t){this.states_=t}build(t){if(this.numConstants!=null)throw new bt("Constants support is not implemented in RNN yet.");Tu(t)&&(t=t[0]),t=t;const e=this.stateful?t[0]:null,s=t.slice(2);this.inputSpec[0]=new oe({shape:[e,null,...s]});const r=[t[0]].concat(t.slice(2));this.cell.build(r);let o;if(Array.isArray(this.cell.stateSize)?o=this.cell.stateSize:o=[this.cell.stateSize],this.stateSpec!=null){if(!Tt(this.stateSpec.map(i=>i.shape[i.shape.length-1]),o))throw new O(`An initialState was passed that is not compatible with cell.stateSize. Received stateSpec=${this.stateSpec}; However cell.stateSize is ${this.cell.stateSize}`)}else this.stateSpec=o.map(i=>new oe({shape:[null,i]}));this.stateful&&this.resetStates()}resetStates(t,e=!1){z(()=>{if(!this.stateful)throw new Nn("Cannot call resetStates() on an RNN Layer that is not stateful.");const s=this.inputSpec[0].shape[0];if(s==null)throw new O("If an RNN is stateful, it needs to know its batch size. Specify the batch size of your input tensors: \n- If using a Sequential model, specify the batch size by passing a `batchInputShape` option to your first layer.\n- If using the functional API, specify the batch size by passing a `batchShape` option to your Input layer.");if(this.states_==null)Array.isArray(this.cell.stateSize)?this.states_=this.cell.stateSize.map(r=>he([s,r])):this.states_=[he([s,this.cell.stateSize])];else if(t==null)It(this.states_),this.keptStates!=null&&(It(this.keptStates),this.keptStates=[]),Array.isArray(this.cell.stateSize)?this.states_=this.cell.stateSize.map(r=>he([s,r])):this.states_[0]=he([s,this.cell.stateSize]);else{if(Array.isArray(t)||(t=[t]),t.length!==this.states_.length)throw new O(`Layer ${this.name} expects ${this.states_.length} state(s), but it received ${t.length} state value(s). Input received: ${t}`);e===!0?this.keptStates.push(this.states_.slice()):It(this.states_);for(let r=0;r<this.states_.length;++r){const o=t[r],i=Array.isArray(this.cell.stateSize)?this.cell.stateSize[r]:this.cell.stateSize,a=[s,i];if(!Tt(o.shape,a))throw new O(`State ${r} is incompatible with layer ${this.name}: expected shape=${a}, received shape=${o.shape}`);this.states_[r]=o}}this.states_=this.states_.map(r=>Mn(r.clone()))})}apply(t,e){let s=e==null?null:e.initialState,r=e==null?null:e.constants;e==null&&(e={});const o=o0(t,s,r,this.numConstants);t=o.inputs,s=o.initialState,r=o.constants;let i=[],a=[];if(s!=null){e.initialState=s,i=i.concat(s),this.stateSpec=[];for(const l of s)this.stateSpec.push(new oe({shape:l.shape}));a=a.concat(this.stateSpec)}if(r!=null&&(e.constants=r,i=i.concat(r),this.numConstants=r.length),i[0]instanceof Rn){const l=[t].concat(i),u=this.inputSpec.concat(a),h=this.inputSpec;this.inputSpec=u;const d=super.apply(l,e);return this.inputSpec=h,d}else return super.apply(t,e)}call(t,e){return z(()=>{const s=e==null?null:e.mask,r=e==null?null:e.training;let o=e==null?null:e.initialState;t=gt(t),o==null&&(this.stateful?o=this.states_:o=this.getInitialState(t));const i=Array.isArray(this.cell.stateSize)?this.cell.stateSize.length:1;if(o.length!==i)throw new O(`RNN Layer has ${i} state(s) but was passed ${o.length} initial state(s).`);this.unroll&&console.warn("Ignoring unroll = true for RNN layer, due to imperative backend.");const a={training:r},l=i0((f,m)=>{const g=this.cell.call([f].concat(m),a);return[g[0],g.slice(1)]},t,o,this.goBackwards,s,null,this.unroll,this.returnSequences),u=l[0],h=l[1],d=l[2];this.stateful&&this.resetStates(d,r);const p=this.returnSequences?h:u;return this.returnState?[p].concat(d):p})}getInitialState(t){return z(()=>{let e=he(t.shape);return e=it(e,[1,2]),e=Li(e),Array.isArray(this.cell.stateSize)?this.cell.stateSize.map(s=>s>1?Su(e,[1,s]):e):this.cell.stateSize>1?[Su(e,[1,this.cell.stateSize])]:[e]})}get trainableWeights(){return this.trainable?this.cell.trainableWeights:[]}get nonTrainableWeights(){return this.trainable?this.cell.nonTrainableWeights:this.cell.weights}setFastWeightInitDuringBuild(t){super.setFastWeightInitDuringBuild(t),this.cell!=null&&this.cell.setFastWeightInitDuringBuild(t)}getConfig(){const t=super.getConfig(),e={returnSequences:this.returnSequences,returnState:this.returnState,goBackwards:this.goBackwards,stateful:this.stateful,unroll:this.unroll};this.numConstants!=null&&(e.numConstants=this.numConstants);const s=this.cell.getConfig();return this.getClassName()===Cs.className&&(e.cell={className:this.cell.getClassName(),config:s}),Object.assign({},s,t,e)}static fromConfig(t,e,s={}){const r=e.cell,o=Hn(r,s);return new t(Object.assign(e,{cell:o}))}}Cs.className="RNN";X(Cs);class vl extends kt{}class pp extends vl{constructor(t){super(t),this.DEFAULT_ACTIVATION="tanh",this.DEFAULT_KERNEL_INITIALIZER="glorotNormal",this.DEFAULT_RECURRENT_INITIALIZER="orthogonal",this.DEFAULT_BIAS_INITIALIZER="zeros",this.units=t.units,pe(this.units,"units"),this.activation=ps(t.activation==null?this.DEFAULT_ACTIVATION:t.activation),this.useBias=t.useBias==null?!0:t.useBias,this.kernelInitializer=Ut(t.kernelInitializer||this.DEFAULT_KERNEL_INITIALIZER),this.recurrentInitializer=Ut(t.recurrentInitializer||this.DEFAULT_RECURRENT_INITIALIZER),this.biasInitializer=Ut(t.biasInitializer||this.DEFAULT_BIAS_INITIALIZER),this.kernelRegularizer=Gt(t.kernelRegularizer),this.recurrentRegularizer=Gt(t.recurrentRegularizer),this.biasRegularizer=Gt(t.biasRegularizer),this.kernelConstraint=ae(t.kernelConstraint),this.recurrentConstraint=ae(t.recurrentConstraint),this.biasConstraint=ae(t.biasConstraint),this.dropout=Rr([1,hs([0,t.dropout==null?0:t.dropout])]),this.recurrentDropout=Rr([1,hs([0,t.recurrentDropout==null?0:t.recurrentDropout])]),this.dropoutFunc=t.dropoutFunc,this.stateSize=this.units,this.dropoutMask=null,this.recurrentDropoutMask=null}build(t){t=Rt(t),this.kernel=this.addWeight("kernel",[t[t.length-1],this.units],null,this.kernelInitializer,this.kernelRegularizer,!0,this.kernelConstraint),this.recurrentKernel=this.addWeight("recurrent_kernel",[this.units,this.units],null,this.recurrentInitializer,this.recurrentRegularizer,!0,this.recurrentConstraint),this.useBias?this.bias=this.addWeight("bias",[this.units],null,this.biasInitializer,this.biasRegularizer,!0,this.biasConstraint):this.bias=null,this.built=!0}call(t,e){return z(()=>{if(t=t,t.length!==2)throw new O(`SimpleRNNCell expects 2 input Tensors, got ${t.length}.`);let s=t[1];t=t[0];const r=e.training==null?!1:e.training;0<this.dropout&&this.dropout<1&&this.dropoutMask==null&&(this.dropoutMask=fs({ones:()=>ln(t),rate:this.dropout,training:r,dropoutFunc:this.dropoutFunc})),0<this.recurrentDropout&&this.recurrentDropout<1&&this.recurrentDropoutMask==null&&(this.recurrentDropoutMask=fs({ones:()=>ln(s),rate:this.recurrentDropout,training:r,dropoutFunc:this.dropoutFunc}));let o;const i=this.dropoutMask,a=this.recurrentDropoutMask;i!=null?o=On(D(t,i),this.kernel.read()):o=On(t,this.kernel.read()),this.bias!=null&&(o=Sn(o,this.bias.read())),a!=null&&(s=D(s,a));let c=J(o,On(s,this.recurrentKernel.read()));return this.activation!=null&&(c=this.activation.apply(c)),[c,c]})}getConfig(){const t=super.getConfig(),e={units:this.units,activation:ds(this.activation),useBias:this.useBias,kernelInitializer:Ht(this.kernelInitializer),recurrentInitializer:Ht(this.recurrentInitializer),biasInitializer:Ht(this.biasInitializer),kernelRegularizer:Ot(this.kernelRegularizer),recurrentRegularizer:Ot(this.recurrentRegularizer),biasRegularizer:Ot(this.biasRegularizer),activityRegularizer:Ot(this.activityRegularizer),kernelConstraint:ie(this.kernelConstraint),recurrentConstraint:ie(this.recurrentConstraint),biasConstraint:ie(this.biasConstraint),dropout:this.dropout,recurrentDropout:this.recurrentDropout};return Object.assign({},t,e)}}pp.className="SimpleRNNCell";X(pp);class a0 extends Cs{constructor(t){t.cell=new pp(t),super(t)}call(t,e){return z(()=>{this.cell.dropoutMask!=null&&(It(this.cell.dropoutMask),this.cell.dropoutMask=null),this.cell.recurrentDropoutMask!=null&&(It(this.cell.recurrentDropoutMask),this.cell.recurrentDropoutMask=null);const s=e==null?null:e.mask,r=e==null?null:e.training,o=e==null?null:e.initialState;return super.call(t,{mask:s,training:r,initialState:o})})}static fromConfig(t,e){return new t(e)}}a0.className="SimpleRNN";X(a0);class fp extends vl{constructor(t){if(super(t),this.DEFAULT_ACTIVATION="tanh",this.DEFAULT_RECURRENT_ACTIVATION="hardSigmoid",this.DEFAULT_KERNEL_INITIALIZER="glorotNormal",this.DEFAULT_RECURRENT_INITIALIZER="orthogonal",this.DEFAULT_BIAS_INITIALIZER="zeros",t.resetAfter)throw new O("GRUCell does not support reset_after parameter set to true.");this.units=t.units,pe(this.units,"units"),this.activation=ps(t.activation===void 0?this.DEFAULT_ACTIVATION:t.activation),this.recurrentActivation=ps(t.recurrentActivation===void 0?this.DEFAULT_RECURRENT_ACTIVATION:t.recurrentActivation),this.useBias=t.useBias==null?!0:t.useBias,this.kernelInitializer=Ut(t.kernelInitializer||this.DEFAULT_KERNEL_INITIALIZER),this.recurrentInitializer=Ut(t.recurrentInitializer||this.DEFAULT_RECURRENT_INITIALIZER),this.biasInitializer=Ut(t.biasInitializer||this.DEFAULT_BIAS_INITIALIZER),this.kernelRegularizer=Gt(t.kernelRegularizer),this.recurrentRegularizer=Gt(t.recurrentRegularizer),this.biasRegularizer=Gt(t.biasRegularizer),this.kernelConstraint=ae(t.kernelConstraint),this.recurrentConstraint=ae(t.recurrentConstraint),this.biasConstraint=ae(t.biasConstraint),this.dropout=Rr([1,hs([0,t.dropout==null?0:t.dropout])]),this.recurrentDropout=Rr([1,hs([0,t.recurrentDropout==null?0:t.recurrentDropout])]),this.dropoutFunc=t.dropoutFunc,this.implementation=t.implementation,this.stateSize=this.units,this.dropoutMask=null,this.recurrentDropoutMask=null}build(t){t=Rt(t);const e=t[t.length-1];this.kernel=this.addWeight("kernel",[e,this.units*3],null,this.kernelInitializer,this.kernelRegularizer,!0,this.kernelConstraint),this.recurrentKernel=this.addWeight("recurrent_kernel",[this.units,this.units*3],null,this.recurrentInitializer,this.recurrentRegularizer,!0,this.recurrentConstraint),this.useBias?this.bias=this.addWeight("bias",[this.units*3],null,this.biasInitializer,this.biasRegularizer,!0,this.biasConstraint):this.bias=null,this.built=!0}call(t,e){return z(()=>{if(t=t,t.length!==2)throw new O(`GRUCell expects 2 input Tensors (inputs, h, c), got ${t.length}.`);const s=e.training==null?!1:e.training;let r=t[1];t=t[0],0<this.dropout&&this.dropout<1&&this.dropoutMask==null&&(this.dropoutMask=fs({ones:()=>ln(t),rate:this.dropout,training:s,count:3,dropoutFunc:this.dropoutFunc})),0<this.recurrentDropout&&this.recurrentDropout<1&&this.recurrentDropoutMask==null&&(this.recurrentDropoutMask=fs({ones:()=>ln(r),rate:this.recurrentDropout,training:s,count:3,dropoutFunc:this.dropoutFunc}));const o=this.dropoutMask,i=this.recurrentDropoutMask;let a,c,l;0<this.dropout&&this.dropout<1&&(t=D(t,o[0]));let u=On(t,this.kernel.read());this.useBias&&(u=Sn(u,this.bias.read())),0<this.recurrentDropout&&this.recurrentDropout<1&&(r=D(r,i[0]));const h=this.recurrentKernel.read(),[d,p]=Ye(h,[2*this.units,this.units],h.rank-1),f=On(r,d),[m,g,x]=Ye(u,3,u.rank-1),[b,w]=Ye(f,2,f.rank-1);a=this.recurrentActivation.apply(J(m,b)),c=this.recurrentActivation.apply(J(g,w));const y=On(D(c,r),p);l=this.activation.apply(J(x,y));const I=J(D(a,r),D(J(1,qt(a)),l));return[I,I]})}getConfig(){const t=super.getConfig(),e={units:this.units,activation:ds(this.activation),recurrentActivation:ds(this.recurrentActivation),useBias:this.useBias,kernelInitializer:Ht(this.kernelInitializer),recurrentInitializer:Ht(this.recurrentInitializer),biasInitializer:Ht(this.biasInitializer),kernelRegularizer:Ot(this.kernelRegularizer),recurrentRegularizer:Ot(this.recurrentRegularizer),biasRegularizer:Ot(this.biasRegularizer),activityRegularizer:Ot(this.activityRegularizer),kernelConstraint:ie(this.kernelConstraint),recurrentConstraint:ie(this.recurrentConstraint),biasConstraint:ie(this.biasConstraint),dropout:this.dropout,recurrentDropout:this.recurrentDropout,implementation:this.implementation,resetAfter:!1};return Object.assign({},t,e)}}fp.className="GRUCell";X(fp);class c0 extends Cs{constructor(t){t.implementation===0&&console.warn("`implementation=0` has been deprecated, and now defaults to `implementation=1`. Please update your layer call."),t.cell=new fp(t),super(t)}call(t,e){return z(()=>{this.cell.dropoutMask!=null&&(It(this.cell.dropoutMask),this.cell.dropoutMask=null),this.cell.recurrentDropoutMask!=null&&(It(this.cell.recurrentDropoutMask),this.cell.recurrentDropoutMask=null);const s=e==null?null:e.mask,r=e==null?null:e.training,o=e==null?null:e.initialState;return super.call(t,{mask:s,training:r,initialState:o})})}static fromConfig(t,e){return e.implmentation===0&&(e.implementation=1),new t(e)}}c0.className="GRU";X(c0);class Cl extends vl{constructor(t){super(t),this.DEFAULT_ACTIVATION="tanh",this.DEFAULT_RECURRENT_ACTIVATION="hardSigmoid",this.DEFAULT_KERNEL_INITIALIZER="glorotNormal",this.DEFAULT_RECURRENT_INITIALIZER="orthogonal",this.DEFAULT_BIAS_INITIALIZER="zeros",this.units=t.units,pe(this.units,"units"),this.activation=ps(t.activation===void 0?this.DEFAULT_ACTIVATION:t.activation),this.recurrentActivation=ps(t.recurrentActivation===void 0?this.DEFAULT_RECURRENT_ACTIVATION:t.recurrentActivation),this.useBias=t.useBias==null?!0:t.useBias,this.kernelInitializer=Ut(t.kernelInitializer||this.DEFAULT_KERNEL_INITIALIZER),this.recurrentInitializer=Ut(t.recurrentInitializer||this.DEFAULT_RECURRENT_INITIALIZER),this.biasInitializer=Ut(t.biasInitializer||this.DEFAULT_BIAS_INITIALIZER),this.unitForgetBias=t.unitForgetBias,this.kernelRegularizer=Gt(t.kernelRegularizer),this.recurrentRegularizer=Gt(t.recurrentRegularizer),this.biasRegularizer=Gt(t.biasRegularizer),this.kernelConstraint=ae(t.kernelConstraint),this.recurrentConstraint=ae(t.recurrentConstraint),this.biasConstraint=ae(t.biasConstraint),this.dropout=Rr([1,hs([0,t.dropout==null?0:t.dropout])]),this.recurrentDropout=Rr([1,hs([0,t.recurrentDropout==null?0:t.recurrentDropout])]),this.dropoutFunc=t.dropoutFunc,this.implementation=t.implementation,this.stateSize=[this.units,this.units],this.dropoutMask=null,this.recurrentDropoutMask=null}build(t){var e;t=Rt(t);const s=t[t.length-1];this.kernel=this.addWeight("kernel",[s,this.units*4],null,this.kernelInitializer,this.kernelRegularizer,!0,this.kernelConstraint),this.recurrentKernel=this.addWeight("recurrent_kernel",[this.units,this.units*4],null,this.recurrentInitializer,this.recurrentRegularizer,!0,this.recurrentConstraint);let r;if(this.useBias){if(this.unitForgetBias){const o=this.biasInitializer,i=this.units;r=new(e=class extends pn{apply(c,l){const u=o.apply([i]),h=new Qd().apply([i]),d=o.apply([i*2]);return Cf(Cf(u,h),d)}},e.className="CustomInit",e)}else r=this.biasInitializer;this.bias=this.addWeight("bias",[this.units*4],null,r,this.biasRegularizer,!0,this.biasConstraint)}else this.bias=null;this.built=!0}call(t,e){return z(()=>{const s=e.training==null?!1:e.training;if(t=t,t.length!==3)throw new O(`LSTMCell expects 3 input Tensors (inputs, h, c), got ${t.length}.`);let r=t[1];const o=t[2];t=t[0],0<this.dropout&&this.dropout<1&&this.dropoutMask==null&&(this.dropoutMask=fs({ones:()=>ln(t),rate:this.dropout,training:s,count:4,dropoutFunc:this.dropoutFunc})),0<this.recurrentDropout&&this.recurrentDropout<1&&this.recurrentDropoutMask==null&&(this.recurrentDropoutMask=fs({ones:()=>ln(r),rate:this.recurrentDropout,training:s,count:4,dropoutFunc:this.dropoutFunc}));const i=this.dropoutMask,a=this.recurrentDropoutMask;let c,l,u,h;0<this.dropout&&this.dropout<1&&(t=D(t,i[0]));let d=On(t,this.kernel.read());0<this.recurrentDropout&&this.recurrentDropout<1&&(r=D(r,a[0])),d=J(d,On(r,this.recurrentKernel.read())),this.useBias&&(d=Sn(d,this.bias.read()));const[p,f,m,g]=Ye(d,4,d.rank-1);c=this.recurrentActivation.apply(p),l=this.recurrentActivation.apply(f),u=J(D(l,o),D(c,this.activation.apply(m))),h=this.recurrentActivation.apply(g);const x=D(h,this.activation.apply(u));return[x,x,u]})}getConfig(){const t=super.getConfig(),e={units:this.units,activation:ds(this.activation),recurrentActivation:ds(this.recurrentActivation),useBias:this.useBias,kernelInitializer:Ht(this.kernelInitializer),recurrentInitializer:Ht(this.recurrentInitializer),biasInitializer:Ht(this.biasInitializer),unitForgetBias:this.unitForgetBias,kernelRegularizer:Ot(this.kernelRegularizer),recurrentRegularizer:Ot(this.recurrentRegularizer),biasRegularizer:Ot(this.biasRegularizer),activityRegularizer:Ot(this.activityRegularizer),kernelConstraint:ie(this.kernelConstraint),recurrentConstraint:ie(this.recurrentConstraint),biasConstraint:ie(this.biasConstraint),dropout:this.dropout,recurrentDropout:this.recurrentDropout,implementation:this.implementation};return Object.assign({},t,e)}}Cl.className="LSTMCell";X(Cl);class l0 extends Cs{constructor(t){t.implementation===0&&console.warn("`implementation=0` has been deprecated, and now defaults to `implementation=1`. Please update your layer call."),t.cell=new Cl(t),super(t)}call(t,e){return z(()=>{this.cell.dropoutMask!=null&&(It(this.cell.dropoutMask),this.cell.dropoutMask=null),this.cell.recurrentDropoutMask!=null&&(It(this.cell.recurrentDropoutMask),this.cell.recurrentDropoutMask=null);const s=e==null?null:e.mask,r=e==null?null:e.training,o=e==null?null:e.initialState;return super.call(t,{mask:s,training:r,initialState:o})})}static fromConfig(t,e){return e.implmentation===0&&(e.implementation=1),new t(e)}}l0.className="LSTM";X(l0);class mp extends vl{constructor(t){super(t),this.cells=t.cells}get stateSize(){const t=[];for(const e of this.cells.slice().reverse())Array.isArray(e.stateSize)?t.push(...e.stateSize):t.push(e.stateSize);return t}call(t,e){return z(()=>{t=t;let s=t.slice(1);const r=[];for(const a of this.cells.slice().reverse())Array.isArray(a.stateSize)?r.push(s.splice(0,a.stateSize.length)):r.push(s.splice(0,1));r.reverse();const o=[];let i;for(let a=0;a<this.cells.length;++a){const c=this.cells[a];s=r[a],a===0?i=[t[0]].concat(s):i=[i[0]].concat(s),i=c.call(i,e),o.push(i.slice(1))}s=[];for(const a of o.slice().reverse())s.push(...a);return[i[0]].concat(s)})}build(t){Tu(t)&&(t=t[0]),t=t;let e;this.cells.forEach((s,r)=>{Ws(`RNNCell_${r}`,()=>{s.build(t),Array.isArray(s.stateSize)?e=s.stateSize[0]:e=s.stateSize,t=[t[0],e]})}),this.built=!0}getConfig(){const t=super.getConfig(),e=o=>({className:o.getClassName(),config:o.getConfig()}),r={cells:this.cells.map(e)};return Object.assign({},t,r)}static fromConfig(t,e,s={}){const r=[];for(const o of e.cells)r.push(Hn(o,s));return new t({cells:r})}get trainableWeights(){if(!this.trainable)return[];const t=[];for(const e of this.cells)t.push(...e.trainableWeights);return t}get nonTrainableWeights(){const t=[];for(const e of this.cells)t.push(...e.nonTrainableWeights);if(!this.trainable){const e=[];for(const s of this.cells)e.push(...s.trainableWeights);return e.concat(t)}return t}getWeights(){const t=[];for(const e of this.cells)t.push(...e.weights);return Eu(t)}setWeights(t){const e=[];for(const s of this.cells){const r=s.weights.length,o=t.splice(r);for(let i=0;i<s.weights.length;++i)e.push([s.weights[i],o[i]])}ip(e)}}mp.className="StackedRNNCells";X(mp);function fs(n){const{ones:t,rate:e,training:s=!1,count:r=1,dropoutFunc:o}=n,i=()=>o!=null?o(t(),e):nb(t(),e),a=()=>Bi(i,t,s);return!r||r<=1?Mn(a().clone()):Array(r).fill(void 0).map(a).map(l=>Mn(l.clone()))}var RR=function(n,t){var e={};for(var s in n)Object.prototype.hasOwnProperty.call(n,s)&&t.indexOf(s)<0&&(e[s]=n[s]);if(n!=null&&typeof Object.getOwnPropertySymbols=="function")for(var r=0,s=Object.getOwnPropertySymbols(n);r<s.length;r++)t.indexOf(s[r])<0&&Object.prototype.propertyIsEnumerable.call(n,s[r])&&(e[s[r]]=n[s[r]]);return e};class u0 extends Cs{constructor(t){if(t.unroll)throw new bt("Unrolling is not possible with convolutional RNNs.");if(Array.isArray(t.cell))throw new bt("It is not possible at the moment to stack convolutional cells.");super(t),this.inputSpec=[new oe({ndim:5})]}call(t,e){return z(()=>{if(this.cell.dropoutMask!=null&&(It(this.cell.dropoutMask),this.cell.dropoutMask=null),this.cell.recurrentDropoutMask!=null&&(It(this.cell.recurrentDropoutMask),this.cell.recurrentDropoutMask=null),e&&e.constants)throw new O("ConvRNN2D cell does not support constants");const s=e==null?null:e.mask,r=e==null?null:e.training,o=e==null?null:e.initialState;return super.call(t,{mask:s,training:r,initialState:o})})}computeOutputShape(t){let e=this.computeSingleOutputShape(t);return this.returnSequences||(e=[e[0],...e.slice(2)]),this.returnState&&(e=[e,...Array(2).fill([t[0],...e.slice(-3)])]),e}getInitialState(t){return z(()=>{const{stateSize:e}=this.cell,s=t.shape,r=this.computeSingleOutputShape(s),o=[r[0],...r.slice(2)],i=he(o);return Array.isArray(e)?Array(e.length).fill(i):[i]})}resetStates(t,e=!1){z(()=>{if(!this.stateful)throw new Nn("Cannot call resetStates() on an RNN Layer that is not stateful.");const s=this.inputSpec[0].shape,r=this.computeSingleOutputShape(s),o=[r[0],...r.slice(2)];if(s[0]==null)throw new O("If an RNN is stateful, it needs to know its batch size. Specify the batch size of your input tensors: \n- If using a Sequential model, specify the batch size by passing a `batchInputShape` option to your first layer.\n- If using the functional API, specify the batch size by passing a `batchShape` option to your Input layer.");if(this.getStates()==null)Array.isArray(this.cell.stateSize)?this.states_=this.cell.stateSize.map(()=>he(o)):this.states_=[he(o)];else if(t==null)It(this.states_),this.keptStates!=null&&(It(this.keptStates),this.keptStates=[]),Array.isArray(this.cell.stateSize)?this.states_=this.cell.stateSize.map(()=>he(o)):this.states_[0]=he(o);else{if(Array.isArray(t)||(t=[t]),t.length!==this.states_.length)throw new O(`Layer ${this.name} expects ${this.states_.length} state(s), but it received ${t.length} state value(s). Input received: ${t}`);e?this.keptStates.push(this.states_.slice()):It(this.states_);for(let a=0;a<this.states_.length;++a){const c=t[a],l=o;if(!Tt(c.shape,l))throw new O(`State ${a} is incompatible with layer ${this.name}: expected shape=${l}, received shape=${c.shape}`);this.states_[a]=c}}this.states_=this.states_.map(a=>Mn(a.clone()))})}computeSingleOutputShape(t){const{dataFormat:e,filters:s,kernelSize:r,padding:o,strides:i,dilationRate:a}=this.cell,c=e==="channelsFirst",l=t[c?3:2],u=t[c?4:3],h=vn(l,r[0],o,i[0],a[0]),d=vn(u,r[1],o,i[1],a[1]);return[...t.slice(0,2),...c?[s,h,d]:[h,d,s]]}}u0.className="ConvRNN2D";class gp extends Cl{constructor(t){const{filters:e,kernelSize:s,strides:r,padding:o,dataFormat:i,dilationRate:a}=t;super(Object.assign({},t,{units:e})),this.filters=e,pe(this.filters,"filters"),this.kernelSize=Cr(s,2,"kernelSize"),this.kernelSize.forEach(c=>pe(c,"kernelSize")),this.strides=Cr(r||1,2,"strides"),this.strides.forEach(c=>pe(c,"strides")),this.padding=o||"valid",Je(this.padding),this.dataFormat=i||"channelsLast",te(this.dataFormat),this.dilationRate=Cr(a||1,2,"dilationRate"),this.dilationRate.forEach(c=>pe(c,"dilationRate"))}build(t){var e;t=Rt(t);const s=this.dataFormat==="channelsFirst"?1:t.length-1;if(t[s]==null)throw new O(`The channel dimension of the input should be defined. Found ${t[s]}`);const r=t[s],o=4,i=this.kernelSize.concat([r,this.filters*o]);this.kernel=this.addWeight("kernel",i,null,this.kernelInitializer,this.kernelRegularizer,!0,this.kernelConstraint);const a=this.kernelSize.concat([this.filters,this.filters*o]);if(this.recurrentKernel=this.addWeight("recurrent_kernel",a,null,this.recurrentInitializer,this.recurrentRegularizer,!0,this.recurrentConstraint),this.useBias){let c;if(this.unitForgetBias){const l=this.biasInitializer,u=this.filters;c=new(e=class extends pn{apply(d,p){const f=l.apply([u]),m=Is([u]),g=l.apply([u*2]);return Jd([f,m,g])}},e.className="CustomInit",e)}else c=this.biasInitializer;this.bias=this.addWeight("bias",[this.filters*o],null,c,this.biasRegularizer,!0,this.biasConstraint)}this.built=!0}call(t,e){return z(()=>{if(t.length!==3)throw new O(`ConvLSTM2DCell expects 3 input Tensors (inputs, h, c), got ${t.length}.`);const s=e.training||!1,r=t[0],o=t[1],i=t[2],a=4;0<this.dropout&&this.dropout<1&&this.dropoutMask==null&&(this.dropoutMask=fs({ones:()=>ln(r),rate:this.dropout,training:s,count:a,dropoutFunc:this.dropoutFunc}));const c=this.dropoutMask,l=(K,j,Y)=>!j||!j[Y]?K:D(j[Y],K);let u=l(r,c,0),h=l(r,c,1),d=l(r,c,2),p=l(r,c,3);0<this.recurrentDropout&&this.recurrentDropout<1&&this.recurrentDropoutMask==null&&(this.recurrentDropoutMask=fs({ones:()=>ln(o),rate:this.recurrentDropout,training:s,count:a,dropoutFunc:this.dropoutFunc}));const f=this.recurrentDropoutMask;let m=l(o,f,0),g=l(o,f,1),x=l(o,f,2),b=l(o,f,3);const w=3,[y,I,C,N]=Ye(this.kernel.read(),a,w),[T,$,k,v]=this.useBias?Ye(this.bias.read(),a):[null,null,null,null];u=this.inputConv(u,y,T,this.padding),h=this.inputConv(h,I,$,this.padding),d=this.inputConv(d,C,k,this.padding),p=this.inputConv(p,N,v,this.padding);const[R,_,P,L]=Ye(this.recurrentKernel.read(),a,w);m=this.recurrentConv(m,R),g=this.recurrentConv(g,_),x=this.recurrentConv(x,P),b=this.recurrentConv(b,L);const B=this.recurrentActivation.apply(J(u,m)),U=this.recurrentActivation.apply(J(h,g)),V=J(D(U,i),D(B,this.activation.apply(J(d,x)))),H=D(this.recurrentActivation.apply(J(p,b)),this.activation.apply(V));return[H,H,V]})}getConfig(){const t=super.getConfig(),{units:e}=t,s=RR(t,["units"]),r={filters:this.filters,kernelSize:this.kernelSize,padding:this.padding,dataFormat:this.dataFormat,dilationRate:this.dilationRate,strides:this.strides};return Object.assign({},s,r)}inputConv(t,e,s,r){const o=Xs(t,e,this.strides,r||"valid",this.dataFormat==="channelsFirst"?"NCHW":"NHWC",this.dilationRate);return s?Sn(o,s,this.dataFormat):o}recurrentConv(t,e){return Xs(t,e,1,"same",this.dataFormat==="channelsFirst"?"NCHW":"NHWC")}}gp.className="ConvLSTM2DCell";X(gp);class h0 extends u0{constructor(t){const e=new gp(t);super(Object.assign({},t,{cell:e}))}static fromConfig(t,e){return new t(e)}}h0.className="ConvLSTM2D";X(h0);class xp extends kt{constructor(t){super(t),this.rate=Math.max(Math.min(t.rate,1),0),this.noiseShape=t.noiseShape,this.seed=t.seed,this.supportsMasking=!0}getNoiseShape(t){if(this.noiseShape==null)return this.noiseShape;const e=t.shape,s=[];for(let r=0;r<this.noiseShape.length;++r)s.push(this.noiseShape[r]==null?e[r]:this.noiseShape[r]);return s}call(t,e){return z(()=>{this.invokeCallHook(t,e);const s=gt(t);if(0<this.rate&&this.rate<1){const r=e.training==null?!1:e.training,o=this.getNoiseShape(s);return Bi(()=>nb(s,this.rate,o,this.seed),()=>s,r)}return t})}getConfig(){const t={rate:this.rate,noiseShape:this.noiseShape,seed:this.seed},e=super.getConfig();return Object.assign(t,e),t}dispose(){return super.dispose()}}xp.className="Dropout";X(xp);class d0 extends xp{constructor(t){super(t),this.inputSpec=[{ndim:3}]}getNoiseShape(t){const e=t.shape;return[e[0],1,e[2]]}}d0.className="SpatialDropout1D";X(d0);class p0 extends kt{constructor(t){if(super(t),this.activation=null,this.useBias=!0,this.kernel=null,this.bias=null,this.DEFAULT_KERNEL_INITIALIZER="glorotNormal",this.DEFAULT_BIAS_INITIALIZER="zeros",t.batchInputShape==null&&t.inputShape==null&&t.inputDim!=null){let e=null;t.batchSize!=null&&(e=t.batchSize),this.batchInputShape=[e,t.inputDim]}this.units=t.units,pe(this.units,"units"),this.activation=ps(t.activation),t.useBias!=null&&(this.useBias=t.useBias),this.kernelInitializer=Ut(t.kernelInitializer||this.DEFAULT_KERNEL_INITIALIZER),this.biasInitializer=Ut(t.biasInitializer||this.DEFAULT_BIAS_INITIALIZER),this.kernelConstraint=ae(t.kernelConstraint),this.biasConstraint=ae(t.biasConstraint),this.kernelRegularizer=Gt(t.kernelRegularizer),this.biasRegularizer=Gt(t.biasRegularizer),this.activityRegularizer=Gt(t.activityRegularizer),this.supportsMasking=!0,this.inputSpec=[{minNDim:2}]}build(t){t=Rt(t);const e=t[t.length-1];this.kernel==null&&(this.kernel=this.addWeight("kernel",[e,this.units],null,this.kernelInitializer,this.kernelRegularizer,!0,this.kernelConstraint),this.useBias&&(this.bias=this.addWeight("bias",[this.units],null,this.biasInitializer,this.biasRegularizer,!0,this.biasConstraint))),this.inputSpec=[{minNDim:2,axes:{[-1]:e}}],this.built=!0}computeOutputShape(t){t=Rt(t);const e=t.slice();return e[e.length-1]=this.units,e}call(t,e){return z(()=>{this.invokeCallHook(t,e);const s=gt(t),r=Xx(this.activation.getClassName());let o;return r!=null?o=On(s,this.kernel.read(),r,this.bias?this.bias.read():null):(o=On(s,this.kernel.read()),this.bias!=null&&(o=Sn(o,this.bias.read())),this.activation!=null&&(o=this.activation.apply(o))),o})}getConfig(){const t={units:this.units,activation:ds(this.activation),useBias:this.useBias,kernelInitializer:Ht(this.kernelInitializer),biasInitializer:Ht(this.biasInitializer),kernelRegularizer:Ot(this.kernelRegularizer),biasRegularizer:Ot(this.biasRegularizer),activityRegularizer:Ot(this.activityRegularizer),kernelConstraint:ie(this.kernelConstraint),biasConstraint:ie(this.biasConstraint)},e=super.getConfig();return Object.assign(t,e),t}}p0.className="Dense";X(p0);class f0 extends kt{constructor(t){t=t||{},super(t),this.inputSpec=[{minNDim:3}],this.dataFormat=t.dataFormat}computeOutputShape(t){t=Rt(t);for(const e of t.slice(1))if(e==null)throw new O(`The shape of the input to "Flatten" is not fully defined (got ${t.slice(1)}). Make sure to pass a complete "input_shape" or "batch_input_shape" argument to the first layer in your model.`);return[t[0],ls(t,1)]}call(t,e){return z(()=>{this.invokeCallHook(t,e);let s=gt(t);if(this.dataFormat==="channelsFirst"&&s.rank>1){const r=[0];for(let o=2;o<s.rank;++o)r.push(o);r.push(1),s=Ct(s,r)}return hE(s)})}getConfig(){const t={};this.dataFormat!=null&&(t.dataFormat=this.dataFormat);const e=super.getConfig();return Object.assign(t,e),t}}f0.className="Flatten";X(f0);class m0 extends kt{constructor(t){super(t),this.supportsMasking=!0,this.activation=ps(t.activation)}call(t,e){return z(()=>{this.invokeCallHook(t,e);const s=gt(t);return this.activation.apply(s)})}getConfig(){const t={activation:ds(this.activation)},e=super.getConfig();return Object.assign(t,e),t}}m0.className="Activation";X(m0);class g0 extends kt{constructor(t){super(t),this.n=t.n,this.inputSpec=[{ndim:2}]}computeOutputShape(t){return[t[0],this.n,t[1]]}call(t,e){return z(()=>(t=gt(t),lE(t,this.n)))}getConfig(){const t={n:this.n},e=super.getConfig();return Object.assign(t,e),t}}g0.className="RepeatVector";X(g0);class x0 extends kt{constructor(t){super(t),this.targetShape=t.targetShape;for(let e=0;e<this.targetShape.length;++e)this.isUnknown(this.targetShape[e])&&(this.targetShape[e]=null)}isUnknown(t){return t<0||t==null}fixUnknownDimension(t,e){const s="Total size of new array must be unchanged.",r=e.slice();let o=1,i=null;for(let c=0;c<r.length;++c){const l=r[c];if(this.isUnknown(l))if(i===null)i=c;else throw new O("Can only specifiy one unknown dimension.");else o*=l}const a=ls(t);if(i!==null){if(o===0||a%o!==0)throw new O(s);r[i]=a/o}else if(a!==o)throw new O(s);return r}computeOutputShape(t){let e=!1;for(let s=0;s<t.length;++s)if(this.isUnknown(t[s])){e=!0;break}return e?t.slice(0,1).concat(this.targetShape):t.slice(0,1).concat(this.fixUnknownDimension(t.slice(1),this.targetShape))}call(t,e){return z(()=>{this.invokeCallHook(t,e);const s=gt(t),r=s.shape,o=r.slice(0,1).concat(this.fixUnknownDimension(r.slice(1),this.targetShape));return M(s,o)})}getConfig(){const t={targetShape:this.targetShape},e=super.getConfig();return Object.assign(t,e),t}}x0.className="Reshape";X(x0);class b0 extends kt{constructor(t){if(super(t),t.dims==null)throw new Error("Required configuration field `dims` is missing during Permute constructor call.");if(!Array.isArray(t.dims))throw new Error(`Permute constructor requires \`dims\` to be an Array, but received ${t.dims} instead.`);const e=Cn(1,t.dims.length+1);if(!Tt(t.dims.slice().sort(),e))throw new Error("Invalid permutation `dims`: "+JSON.stringify(t.dims)+" `dims` must contain consecutive integers starting from 1.");this.dims=t.dims,this.dimsIncludingBatch=[0].concat(this.dims),this.inputSpec=[new oe({ndim:this.dims.length+1})]}computeOutputShape(t){t=Rt(t);const e=t.slice();return this.dims.forEach((s,r)=>{e[r+1]=t[s]}),e}call(t,e){return Ct(gt(t),this.dimsIncludingBatch)}getConfig(){const t={dims:this.dims},e=super.getConfig();return Object.assign(t,e),t}}b0.className="Permute";X(b0);class y0 extends kt{constructor(t){super(t??{}),this.supportsMasking=!0,t!=null?this.maskValue=t.maskValue==null?0:t.maskValue:this.maskValue=0}computeOutputShape(t){return t}getConfig(){const t=super.getConfig(),e={maskValue:this.maskValue};return Object.assign(e,t),e}computeMask(t,e){const s=gt(t);return wu(wo(s,this.maskValue),-1)}call(t,e){return z(()=>{this.invokeCallHook(t,e);const s=gt(t),i=wu(wo(s,this.maskValue),-1,!0);return D(s,nt(i,s.dtype))})}}y0.className="Masking";X(y0);class w0 extends kt{constructor(t){if(super(t),this.embeddings=null,this.DEFAULT_EMBEDDINGS_INITIALIZER="randomUniform",t.batchInputShape==null&&t.inputShape==null){let e=null;t.batchSize!=null&&(e=t.batchSize),t.inputLength==null?this.batchInputShape=[e,null]:this.batchInputShape=[e].concat(Vt(t.inputLength))}this.inputDim=t.inputDim,pe(this.inputDim,"inputDim"),this.outputDim=t.outputDim,pe(this.outputDim,"outputDim"),this.embeddingsInitializer=Ut(t.embeddingsInitializer||this.DEFAULT_EMBEDDINGS_INITIALIZER),this.embeddingsRegularizer=Gt(t.embeddingsRegularizer),this.activityRegularizer=Gt(t.activityRegularizer),this.embeddingsConstraint=ae(t.embeddingsConstraint),this.maskZero=t.maskZero,this.supportsMasking=t.maskZero,this.inputLength=t.inputLength}build(t){this.embeddings=this.addWeight("embeddings",[this.inputDim,this.outputDim],this.dtype,this.embeddingsInitializer,this.embeddingsRegularizer,!0,this.embeddingsConstraint),this.built=!0}warnOnIncompatibleInputShape(t){}computeMask(t,e){return z(()=>this.maskZero?(t=gt(t),wo(t,$t(t))):null)}computeOutputShape(t){if(t=Rt(t),this.inputLength==null)return[...t,this.outputDim];const e=Vt(this.inputLength);if(e.length!==t.length-1)throw new O(`"inputLength" is ${this.inputLength}, but received input shape has shape ${t}`);{let s=0;for(let r=0;r<e.length;++r){const o=e[r],i=t[r+1];if(o!=null&&i!=null&&o!==i)throw new O(`"inputLength" is ${this.inputLength}, but received input shape has shape ${t}`);o==null&&(e[s]=i),s++}}return[t[0],...e,this.outputDim]}call(t,e){return z(()=>{this.invokeCallHook(t,e);let s=gt(t);s.dtype!=="int32"&&(s=Mi(s,"int32"));const r=eb(this.embeddings.read(),M(s,[s.size]));return M(r,Rt(this.computeOutputShape(s.shape)))})}getConfig(){const t={inputDim:this.inputDim,outputDim:this.outputDim,embeddingsInitializer:Ht(this.embeddingsInitializer),embeddingsRegularizer:Ot(this.embeddingsRegularizer),activityRegularizer:Ot(this.activityRegularizer),embeddingsConstraint:ie(this.embeddingsConstraint),maskZero:this.maskZero,inputLength:this.inputLength},e=super.getConfig();return Object.assign(t,e),t}}w0.className="Embedding";X(w0);class or extends kt{constructor(t){super(t||{}),this.supportsMasking=!0}mergeFunction(t){throw new bt}computeElementwiseOpOutputShape(t,e){if(t==null||e==null)return null;if(t.length<e.length)return this.computeElementwiseOpOutputShape(e,t);if(e.length===0)return t;const s=t.slice(0,t.length-e.length);for(let r=0;r<e.length;++r){const o=t[t.length-e.length+r],i=e[r];if(o==null||i==null||o<0||i<0)s.push(null);else if(o===1)s.push(i);else if(i===1)s.push(o);else{if(o!==i)throw new O("Operands could not be broadcast together with shapes "+JSON.stringify(t)+" "+JSON.stringify(e));s.push(o)}}return s}build(t){if(Array.isArray(t)&&!Array.isArray(t[0])&&(t=[Rt(t)]),t=t,t.length<2)throw new O(`A merge layer should be called on an Array of at least 2 inputs. Got ${t.length} input(s).`);let e=[];for(const o of t)o!=null&&o[0]!==null&&e.push(o[0]);if(e=cs(e),e.length>1)throw new O(`Can not merge tensors with different batch sizes. Got tensors with shapes: ${JSON.stringify(t)}.`);let s=t[0]==null?null:t[0].slice(1);for(let o=1;o<t.length;++o){const i=t[o]==null?null:t[o].slice(1);s=this.computeElementwiseOpOutputShape(s,i)}const r=t.map(o=>o.length);t.indexOf(null)===-1&&cs(r).length===1?this.reshapeRequired=!1:this.reshapeRequired=!0}call(t,e){return z(()=>{if(t=t,this.reshapeRequired){const s=[],r=t.map(o=>o.rank);if(r.indexOf(null)===-1){const o=hs(r);for(let i of t){const a=i.rank;for(let c=0;c<o-a;++c)i=Li(i,1);s.push(i)}return this.mergeFunction(s)}else{let o=!1;for(const c of t){const l=c.rank;if(l==null){const u=c.shape,h=u[0],d=u.slice(1).concat([h]);let p=M(c,[h].concat(ls(u.slice(1))));p=Ct(p,[1,0]),p=M(p,d),s.push(p),o=!0}else if(l>1){const u=Cn(1,l).concat([0]);s.push(Ct(c,u)),o=!0}else s.push(c)}let i=this.mergeFunction(s);const a=i.rank;if(o){if(a==null){const c=i.shape,l=c.length,u=c[l-1],h=[u].concat(c.slice(0,c.length-1));i=M(Ct(M(i,[-1,u]),[1,0]),h)}else if(a>1){const c=[a-1].concat(Cn(0,a-1));i=Ct(i,c)}}return i}}else return this.mergeFunction(t)})}computeOutputShape(t){t=t;let e;t[0]==null?e=null:e=t[0].slice(1);for(let r=1;r<t.length;++r){const o=t[r]==null?null:t[r].slice(1);e=this.computeElementwiseOpOutputShape(e,o)}let s=[];for(const r of t)r!=null&&r[0]!==null&&s.push(r[0]);return s=cs(s),s.length===1?e=s.concat(e):e=[null].concat(e),e}computeMask(t,e){return z(()=>{if(e==null)return null;if(!Array.isArray(e))throw new O("`mask` should be an Array");if(!Array.isArray(t))throw new O("`inputs` should be an Array");if(e.length!==t.length)throw new O(`The Array 'inputs' and 'mask' are expected to have the same length, but have different lengths (${t.length} vs ${e.length})`);if(e.every(r=>r==null))return null;e=e.map(r=>r==null?r:nn(r,0));let s=e[0];for(let r=1;r<e.length-1;++r)s=qn(s,e[r]);return s})}}class I0 extends or{constructor(t){super(t)}mergeFunction(t){return z(()=>{let e=t[0].clone();for(let s=1;s<t.length;++s)e=J(e,t[s]);return e})}}I0.className="Add";X(I0);class v0 extends or{constructor(t){super(t)}mergeFunction(t){return z(()=>{let e=t[0].clone();for(let s=1;s<t.length;++s)e=D(e,t[s]);return e})}}v0.className="Multiply";X(v0);class C0 extends or{constructor(t){super(t)}mergeFunction(t){return z(()=>{let e=t[0].clone();for(let s=1;s<t.length;++s)e=J(e,t[s]);return D(1/t.length,e)})}}C0.className="Average";X(C0);class k0 extends or{constructor(t){super(t)}mergeFunction(t){return z(()=>{let e=t[0];for(let s=1;s<t.length;++s)e=ws(e,t[s]);return e})}}k0.className="Maximum";X(k0);class $0 extends or{constructor(t){super(t)}mergeFunction(t){return z(()=>{let e=t[0];for(let s=1;s<t.length;++s)e=cl(e,t[s]);return e})}}$0.className="Minimum";X($0);class S0 extends or{constructor(t){super(t),this.DEFAULT_AXIS=-1,t==null&&(t={}),this.axis=t.axis==null?this.DEFAULT_AXIS:t.axis,this.supportsMasking=!0,this.reshapeRequired=!1}build(t){if(!(Array.isArray(t)&&Array.isArray(t[0]))||t.length===1)throw new O("A `Concatenate` layer should be called on a list of at least 2 inputs");t=t;let e=!0;for(const r of t)if(r!=null){e=!1;break}if(e)return;const s=[];for(let r=0;r<t.length;++r){const o=t[r].slice();o.splice(this.axis,1);let i=!1;for(const a of s)if(Tt(a,o)){i=!0;break}i||s.push(o)}if(s.length>1)throw new O("A `Concatenate` layer requires inputs with matching shapes except for the concat axis. Got input shapes: "+JSON.stringify(t))}mergeFunction(t){return z(()=>Jd(t,this.axis))}computeOutputShape(t){if(!(Array.isArray(t)&&Array.isArray(t[0])))throw new O("A `Concatenate` layer should be called on a list of inputs.");const e=t,s=e[0].slice(),r=this.axis<0?s.length+this.axis:this.axis;for(const o of e.slice(1)){if(s[r]==null||o[r]==null){s[r]=null;break}s[r]+=o[r]}return s}computeMask(t,e){if(e==null)return null;if(!Array.isArray(e))throw new O("`mask` should be an array for Concatenate");if(!Array.isArray(t))throw new O("`inputs` should be an array for Concatenate");if(e.length!==t.length)throw new O(`Mismatch in the length of mask (${e.length}) and the legnth of inputs (${t.length})`);return z(()=>{let s=!0;if(e.forEach(i=>{if(i!=null){s=!1;return}}),s)return null;const r=[];for(let i=0;i<t.length;++i)e[i]==null?r.push(nt(ln(t[i]),"bool")):e[i].rank<t[i].rank?r.push(nn(e[i],-1)):r.push(e[i]);const o=Ce(r,this.axis);return Ug(o,-1,!1)})}getConfig(){const t={axis:this.axis},e=super.getConfig();return Object.assign(t,e),t}}S0.className="Concatenate";X(S0);function so(n,t){for(;n<0;)n+=t;return n}function DR(n,t,e){if(n.shape.length>3||t.shape.length>3)throw new bt("batchDot is not implemented for tensors of 4D or higher rank yet");if(S(n.shape.length>=2,()=>`batchDot requires the rank of x to be >= 2, but got ${n.shape.length}`),S(n.shape.length>=2,()=>`batchDot requires the rank of y to be >= 2, but got ${t.shape.length}`),typeof e=="number"&&(e=[e,e]),n.dtype==="complex64"||t.dtype==="complex64")throw new bt("batchDot is not implemented for complex64-type Tensors yet.");const s=n.shape.length,r=t.shape.length;e==null&&(e=[s-1,r-2]);const o=e;return z(()=>{let i;if(s>r){i=s-r;const c=[];for(let l=0;l<i;++l)c.push(1);t=M(t,t.shape.concat(c))}else if(r>s){i=r-s;const c=[];for(let l=0;l<i;++l)c.push(1);n=M(n,n.shape.concat(c))}else i=0;let a;if(n.shape.length===2&&t.shape.length===2)o[0]===o[1]?a=it(D(n,t),o[0]):a=it(D(Ct(n,[1,0]),t),o[1]);else{const c=o[0]!==n.shape.length-1,l=o[1]===t.shape.length-1;a=Nt(n,t,c,l)}if(i>0){let c;s>r?c=s+r-3:c=s-1;const l=[];for(let u=c;u<c+i;++u)l.push(u);a=Ri(a,l)}return a.shape.length===1&&(a=nn(a,1)),a})}class N0 extends or{constructor(t){super(t),this.axes=t.axes,this.normalize=t.normalize==null?!1:t.normalize,this.supportsMasking=!0,this.reshapeRequired=!1}build(t){S(Array.isArray(t)&&t.length===2&&Array.isArray(t[0])&&Array.isArray(t[1]),()=>"A `Dot` layer should be called on a list of exactly 2 inputs.");const e=t[0],s=t[1];if(e.length>3||s.length>3)throw new bt("Dot layer does not support tensors of 4D or higher rank yet.");const r=this.interpretAxes(e,s);if(e[r[0]]!==s[r[1]])throw new O(`Dimension incompatibility: ${e[r[0]]} !== ${s[r[1]]}`)}mergeFunction(t){if(t.length!==2)throw new O(`A \`Dot\` layer must be called on exactly 2 inputs, but received ${t.length} input(s).`);let e=t[0],s=t[1],r;return Array.isArray(this.axes)?r=this.axes.map((o,i)=>so(o,t[i].shape.length)):r=[so(this.axes,e.shape.length),so(this.axes,s.shape.length)],this.normalize&&(e=za(e,r[0]),s=za(s,r[1])),DR(e,s,r)}interpretAxes(t,e){let s;return Array.isArray(this.axes)?s=this.axes:s=[so(this.axes,t.length),so(this.axes,e.length)],s}computeOutputShape(t){S(Array.isArray(t)&&t.length===2&&Array.isArray(t[0])&&Array.isArray(t[1]),()=>"A `Dot` layer should be called on a list of exactly 2 inputs.");const e=t[0].slice(),s=t[1].slice();if(e.length>3||s.length>3)throw new bt("Dot layer does not support tensors of 4D or higher rank yet.");const r=this.interpretAxes(e,s);e.splice(r[0],1),s.splice(r[1],1),s.splice(0,1);const o=e.concat(s);return o.length===1&&o.push(1),o}computeMask(t,e){return null}getConfig(){const t={axes:this.axes,normalize:this.normalize},e=super.getConfig();return Object.assign(t,e),t}}N0.className="Dot";X(N0);class T0 extends kt{constructor(t){super(t),this.supportsMasking=!0,this.stddev=t.stddev}computeOutputShape(t){return t}getConfig(){const t=super.getConfig(),e={stddev:this.stddev};return Object.assign(e,t),e}call(t,e){return z(()=>{this.invokeCallHook(t,e);const s=gt(t);return Bi(()=>J(gl(s.shape,0,this.stddev),s),()=>s,e.training||!1)})}}T0.className="GaussianNoise";X(T0);class E0 extends kt{constructor(t){super(t),this.supportsMasking=!0,this.rate=t.rate}computeOutputShape(t){return t}getConfig(){const t=super.getConfig(),e={rate:this.rate};return Object.assign(e,t),e}call(t,e){return z(()=>{this.invokeCallHook(t,e);const s=gt(t);return this.rate>0&&this.rate<1?Bi(()=>{const o=Math.sqrt(this.rate/(1-this.rate));return D(s,gl(s.shape,1,o))},()=>s,e.training||!1):s})}}E0.className="GaussianDropout";X(E0);class R0 extends kt{constructor(t){super(t),this.supportsMasking=!0,this.rate=t.rate,this.noiseShape=t.noiseShape}_getNoiseShape(t){return this.noiseShape||gt(t).shape}computeOutputShape(t){return t}getConfig(){const t=super.getConfig(),e={rate:this.rate};return Object.assign(e,t),e}call(t,e){return z(()=>{if(this.rate<1&&this.rate>0){const s=this._getNoiseShape(t);return Bi(()=>{const o=gt(t),a=-1.6732632423543772*1.0507009873554805;let c=Vr(ul(s),this.rate);c=Mi(c,"float32");const l=((1-this.rate)*(1+this.rate*a**2))**-.5,u=-l*a*this.rate,h=J(D(o,c),D(J(c,-1),a));return J(D(h,l),u)},()=>gt(t),e.training||!1)}return t})}}R0.className="AlphaDropout";X(R0);function ko(n,t,e,s,r,o=.001){let i;if(n.rank===2)i=qv(n,t,e,s,r,o);else if(n.rank===3)i=jv(n,t,e,s,r,o);else if(n.rank===4)i=Yv(n,t,e,s,r,o);else throw new bt(`batchNormalization is not implemented for array of rank ${n.rank} yet`);return i}function AR(n,t,e,s,r=.001){return z(()=>{const o=od(n,s),i=o.mean,a=o.variance;return[ko(n,i,a,e,t,r),i,a]})}function FR(n,t,e,s,r=.001){return z(()=>{const o=od(n,s),i=o.mean,a=o.variance,c=[];for(const f of Cn(0,n.rank))s.indexOf(f)!==-1?c.push(1):c.push(n.shape[f]);const l=M(i,c),u=M(a,c),h=t==null?null:M(t,c),d=e==null?null:M(e,c);return[ko(n,l,u,d,h,r),i,a]})}function OR(n,t,e,s,r=.001){return Tt(s.slice().sort(),Cn(0,n.rank-1))?AR(n,t,e,s,r):FR(n,t,e,s,r)}class D0 extends kt{constructor(t){t==null&&(t={}),super(t),this.supportsMasking=!0,this.axis=t.axis==null?-1:t.axis,this.momentum=t.momentum==null?.99:t.momentum,this.epsilon=t.epsilon==null?.001:t.epsilon,this.center=t.center==null?!0:t.center,this.scale=t.scale==null?!0:t.scale,this.betaInitializer=Ut(t.betaInitializer||"zeros"),this.gammaInitializer=Ut(t.gammaInitializer||"ones"),this.movingMeanInitializer=Ut(t.movingMeanInitializer||"zeros"),this.movingVarianceInitializer=Ut(t.movingVarianceInitializer||"ones"),this.betaConstraint=ae(t.betaConstraint),this.gammaConstraint=ae(t.gammaConstraint),this.betaRegularizer=Gt(t.betaRegularizer),this.gammaRegularizer=Gt(t.gammaRegularizer)}build(t){t=Rt(t);const e=this.axis>=0?this.axis:this.axis+t.length,s=t[e];if(s==null)throw new O(`Axis ${e} of input tensor should have a defined dimension but the layer received an input with shape ${JSON.stringify(t)}.`);this.inputSpec=[new oe({ndim:t.length,axes:{[e]:s}})];const r=[s];this.scale&&(this.gamma=this.addWeight("gamma",r,null,this.gammaInitializer,this.gammaRegularizer,!0,this.gammaConstraint)),this.center&&(this.beta=this.addWeight("beta",r,null,this.betaInitializer,this.betaRegularizer,!0,this.betaConstraint)),this.movingMean=this.addWeight("moving_mean",r,null,this.movingMeanInitializer,null,!1),this.movingVariance=this.addWeight("moving_variance",r,null,this.movingVarianceInitializer,null,!1),this.built=!0}call(t,e){return z(()=>{const s=e.training==null?!1:e.training,r=gt(t),o=r.shape,i=o.length,a=Cn(0,i),c=this.axis>=0?this.axis:this.axis+i;a.splice(c,1);const l=tr(1,i);l[c]=o[c];const u=a.slice();u.sort();const h=!Tt(u,Cn(0,i).slice(0,i-1)),d=()=>{if(h){const b=M(this.movingMean.read(),l),w=M(this.movingVariance.read(),l),y=this.center?M(this.beta.read(),l):null,I=this.scale?M(this.gamma.read(),l):null;return ko(r,b,w,y,I,this.epsilon)}else return ko(r,this.movingMean.read(),this.movingVariance.read(),this.beta==null?null:this.beta.read(),this.gamma==null?null:this.gamma.read(),this.epsilon)};if(!s)return d();const[p,f,m]=OR(r,this.gamma.read(),this.beta.read(),a,this.epsilon),g=(b,w,y)=>{z(()=>{const I=1-y,C=b.read(),N=D(at(C,w),I);b.write(at(C,N))})};return(()=>{g(this.movingMean,f,this.momentum),g(this.movingVariance,m,this.momentum)})(),p})}getConfig(){const t={axis:this.axis,momentum:this.momentum,epsilon:this.epsilon,center:this.center,scale:this.scale,betaInitializer:Ht(this.betaInitializer),gammaInitializer:Ht(this.gammaInitializer),movingMeanInitializer:Ht(this.movingMeanInitializer),movingVarianceInitializer:Ht(this.movingVarianceInitializer),betaRegularizer:Ot(this.betaRegularizer),gammaRegularizer:Ot(this.gammaRegularizer),betaConstraint:ie(this.betaConstraint),gammaConstraint:ie(this.gammaConstraint)},e=super.getConfig();return Object.assign(t,e),t}}D0.className="BatchNormalization";X(D0);class A0 extends kt{constructor(t){if(t==null&&(t={}),super(t),this.axis=t.axis==null?-1:t.axis,typeof this.axis=="number"){if(!Number.isInteger(this.axis))throw new Error(`Expected axis to be an integer, but received ${this.axis}`)}else if(Array.isArray(this.axis)){for(const e of this.axis)if(!Number.isInteger(e))throw new Error(`Expected axis to be an array of integers, but received ${JSON.stringify(this.axis)}`)}else throw new Error(`Expected axis to be an integer or an array of integers, but received ${JSON.stringify(this.axis)}`);this.epsilon=t.epsilon==null?.001:t.epsilon,this.center=t.center==null?!0:t.center,this.scale=t.scale==null?!0:t.scale,this.betaInitializer=Ut(t.betaInitializer||"zeros"),this.gammaInitializer=Ut(t.gammaInitializer||"ones"),this.betaRegularizer=Gt(t.betaRegularizer),this.gammaRegularizer=Gt(t.gammaRegularizer),this.supportsMasking=!0}build(t){t=Rt(t);const e=t.length;typeof this.axis=="number"&&(this.axis=[this.axis]);for(let o=0;o<this.axis.length;++o)this.axis[o]<0&&(this.axis[o]+=e);for(const o of this.axis)if(o<0||o>=e)throw new Error(`Invalid axis: ${o}`);if(this.axis.length!==cs(this.axis).length)throw new Error(`Found duplicate axes in: ${this.axis}`);const s=this.axis.map(o=>t[o]),r=!0;this.scale?this.gamma=this.addWeight("gamma",s,"float32",this.gammaInitializer,this.gammaRegularizer,r):this.gamma=null,this.center?this.beta=this.addWeight("beta",s,"float32",this.betaInitializer,this.betaRegularizer,r):this.beta=null,this.built=!0}call(t,e){const s=gt(t),r=s.shape,o=r.length;return z(()=>{let{mean:a,variance:c}=od(s,this.axis,!0);const l=tr(1,o);for(const m of this.axis)l[m]=r[m];const u=m=>m!=null&&m.shape.length!==o?M(m,l):m;let h=this.scale?u(this.gamma.read()):null,d=this.center?u(this.beta.read()):null;const p=[],f=[];for(let m=0;m<o;++m)this.axis.indexOf(m)!==-1?(p.push(r[m]),f.push(1)):(p.push(1),f.push(r[m]));return a=wn(a,p),c=wn(c,p),h!=null&&(h=wn(h,f)),d!=null&&(d=wn(d,f)),ko(s,a,c,d,h,this.epsilon)})}getConfig(){const t={axis:this.axis,epsilon:this.epsilon,center:this.center,scale:this.scale,betaInitializer:Ht(this.betaInitializer),gammaInitializer:Ht(this.gammaInitializer),betaRegularizer:Ot(this.betaRegularizer),gammaRegularizer:Ot(this.gammaRegularizer)},e=super.getConfig();return Object.assign(t,e),t}}A0.className="LayerNormalization";X(A0);function _R(n,t,e){return z(()=>{if(n.rank!==4)throw new O(`temporalPadding expects input tensor to be 4-D, but received a ${n.rank}-D tensor.`);if(t==null&&(t=[[1,1],[1,1]]),t.length!==2||t[0].length!==2||t[1].length!==2)throw new O("spatial2dPadding expects `padding` to be an Array of two Arrays, each of which is an Array of two integers.");if(e==null&&(e=kn()),e!=="channelsLast"&&e!=="channelsFirst")throw new O(`Unknown data format: ${e}. Supported data formats are 'channelsLast' and 'channelsFirst.`);let s;return e==="channelsFirst"?s=[[0,0],[0,0],t[0],t[1]]:s=[[0,0],t[0],t[1],[0,0]],id(n,s)})}class F0 extends kt{constructor(t){if(t==null&&(t={}),super(t),this.dataFormat=t.dataFormat==null?kn():t.dataFormat,t.padding==null)this.padding=[[1,1],[1,1]];else if(typeof t.padding=="number")this.padding=[[t.padding,t.padding],[t.padding,t.padding]];else{if(t.padding=t.padding,t.padding.length!==2)throw new O(`ZeroPadding2D expects padding to be a length-2 array, but received a length-${t.padding.length} array.`);let e,s;if(typeof t.padding[0]=="number")e=[t.padding[0],t.padding[0]],s=[t.padding[1],t.padding[1]];else{if(t.padding=t.padding,t.padding[0].length!==2)throw new O(`ZeroPadding2D expects height padding to be a length-2 array, but received a length-${t.padding[0].length} array.`);if(e=t.padding[0],t.padding[1].length!==2)throw new O(`ZeroPadding2D expects width padding to be a length-2 array, but received a length-${t.padding[1].length} array.`);s=t.padding[1]}this.padding=[e,s]}this.inputSpec=[new oe({ndim:4})]}computeOutputShape(t){t=Rt(t);let e,s;return this.dataFormat==="channelsFirst"?(t[2]!=null&&t[2]>=0?e=t[2]+this.padding[0][0]+this.padding[0][1]:e=null,t[3]!=null&&t[3]>=0?s=t[3]+this.padding[1][0]+this.padding[1][1]:s=null,[t[0],t[1],e,s]):(t[1]!=null&&t[1]>=0?e=t[1]+this.padding[0][0]+this.padding[0][1]:e=null,t[2]!=null&&t[2]>=0?s=t[2]+this.padding[1][0]+this.padding[1][1]:s=null,[t[0],e,s,t[3]])}call(t,e){return z(()=>_R(gt(t),this.padding,this.dataFormat))}getConfig(){const t={padding:this.padding,dataFormat:this.dataFormat},e=super.getConfig();return Object.assign(t,e),t}}F0.className="ZeroPadding2D";X(F0);function kl(n,t,e,s,r,o){return z(()=>{te(r),Zx(o),Je(s),e==null&&(e=[1,1]),s==null&&(s="valid"),r==null&&(r=kn()),o==null&&(o="max"),n=dp(n,r);let i;const a=s==="same"?"same":"valid";return o==="max"?i=rd(n,t,e,a):i=Kh(n,t,e,a),r==="channelsFirst"&&(i=Ct(i,[0,3,1,2])),i})}function O0(n,t,e,s,r,o){return z(()=>{te(r),Zx(o),Je(s),e==null&&(e=[1,1,1]),s==null&&(s="valid"),r==null&&(r=kn()),o==null&&(o="max"),n=Zb(n,r);let i;const a=s==="same"?"same":"valid";return o==="max"?i=Dk(n,t,e,a):i=Lv(n,t,e,a),r==="channelsFirst"&&(i=Ct(i,[0,4,1,2,3])),i})}class _0 extends kt{constructor(t){if(t.poolSize==null&&(t.poolSize=2),super(t),typeof t.poolSize=="number")this.poolSize=[t.poolSize];else if(Array.isArray(t.poolSize)&&t.poolSize.length===1&&typeof t.poolSize[0]=="number")this.poolSize=t.poolSize;else throw new O(`poolSize for 1D convolutional layer must be a number or an Array of a single number, but received ${JSON.stringify(t.poolSize)}`);if(pe(this.poolSize,"poolSize"),t.strides==null)this.strides=this.poolSize;else if(typeof t.strides=="number")this.strides=[t.strides];else if(Array.isArray(t.strides)&&t.strides.length===1&&typeof t.strides[0]=="number")this.strides=t.strides;else throw new O(`strides for 1D convolutional layer must be a number or an Array of a single number, but received ${JSON.stringify(t.strides)}`);pe(this.strides,"strides"),this.padding=t.padding==null?"valid":t.padding,Je(this.padding),this.inputSpec=[new oe({ndim:3})]}computeOutputShape(t){t=Rt(t);const e=vn(t[1],this.poolSize[0],this.padding,this.strides[0]);return[t[0],e,t[2]]}call(t,e){return z(()=>{this.invokeCallHook(t,e),t=Li(gt(t),2);const s=this.poolingFunction(gt(t),[this.poolSize[0],1],[this.strides[0],1],this.padding,"channelsLast");return Ri(s,[2])})}getConfig(){const t={poolSize:this.poolSize,padding:this.padding,strides:this.strides},e=super.getConfig();return Object.assign(t,e),t}}class M0 extends _0{constructor(t){super(t)}poolingFunction(t,e,s,r,o){return te(o),Je(r),kl(t,e,s,r,o,"max")}}M0.className="MaxPooling1D";X(M0);class L0 extends _0{constructor(t){super(t)}poolingFunction(t,e,s,r,o){return te(o),Je(r),kl(t,e,s,r,o,"avg")}}L0.className="AveragePooling1D";X(L0);class P0 extends kt{constructor(t){if(t.poolSize==null&&(t.poolSize=[2,2]),super(t),this.poolSize=Array.isArray(t.poolSize)?t.poolSize:[t.poolSize,t.poolSize],t.strides==null)this.strides=this.poolSize;else if(Array.isArray(t.strides)){if(t.strides.length!==2)throw new O(`If the strides property of a 2D pooling layer is an Array, it is expected to have a length of 2, but received length ${t.strides.length}.`);this.strides=t.strides}else this.strides=[t.strides,t.strides];pe(this.poolSize,"poolSize"),pe(this.strides,"strides"),this.padding=t.padding==null?"valid":t.padding,this.dataFormat=t.dataFormat==null?"channelsLast":t.dataFormat,te(this.dataFormat),Je(this.padding),this.inputSpec=[new oe({ndim:4})]}computeOutputShape(t){t=Rt(t);let e=this.dataFormat==="channelsFirst"?t[2]:t[1],s=this.dataFormat==="channelsFirst"?t[3]:t[2];return e=vn(e,this.poolSize[0],this.padding,this.strides[0]),s=vn(s,this.poolSize[1],this.padding,this.strides[1]),this.dataFormat==="channelsFirst"?[t[0],t[1],e,s]:[t[0],e,s,t[3]]}call(t,e){return z(()=>(this.invokeCallHook(t,e),this.poolingFunction(gt(t),this.poolSize,this.strides,this.padding,this.dataFormat)))}getConfig(){const t={poolSize:this.poolSize,padding:this.padding,strides:this.strides,dataFormat:this.dataFormat},e=super.getConfig();return Object.assign(t,e),t}}class B0 extends P0{constructor(t){super(t)}poolingFunction(t,e,s,r,o){return te(o),Je(r),kl(t,e,s,r,o,"max")}}B0.className="MaxPooling2D";X(B0);class z0 extends P0{constructor(t){super(t)}poolingFunction(t,e,s,r,o){return te(o),Je(r),kl(t,e,s,r,o,"avg")}}z0.className="AveragePooling2D";X(z0);class V0 extends kt{constructor(t){if(t.poolSize==null&&(t.poolSize=[2,2,2]),super(t),this.poolSize=Array.isArray(t.poolSize)?t.poolSize:[t.poolSize,t.poolSize,t.poolSize],t.strides==null)this.strides=this.poolSize;else if(Array.isArray(t.strides)){if(t.strides.length!==3)throw new O(`If the strides property of a 3D pooling layer is an Array, it is expected to have a length of 3, but received length ${t.strides.length}.`);this.strides=t.strides}else this.strides=[t.strides,t.strides,t.strides];pe(this.poolSize,"poolSize"),pe(this.strides,"strides"),this.padding=t.padding==null?"valid":t.padding,this.dataFormat=t.dataFormat==null?"channelsLast":t.dataFormat,te(this.dataFormat),Je(this.padding),this.inputSpec=[new oe({ndim:5})]}computeOutputShape(t){t=Rt(t);let e=this.dataFormat==="channelsFirst"?t[2]:t[1],s=this.dataFormat==="channelsFirst"?t[3]:t[2],r=this.dataFormat==="channelsFirst"?t[4]:t[3];return e=vn(e,this.poolSize[0],this.padding,this.strides[0]),s=vn(s,this.poolSize[1],this.padding,this.strides[1]),r=vn(r,this.poolSize[2],this.padding,this.strides[2]),this.dataFormat==="channelsFirst"?[t[0],t[1],e,s,r]:[t[0],e,s,r,t[4]]}call(t,e){return z(()=>(this.invokeCallHook(t,e),this.poolingFunction(gt(t),this.poolSize,this.strides,this.padding,this.dataFormat)))}getConfig(){const t={poolSize:this.poolSize,padding:this.padding,strides:this.strides,dataFormat:this.dataFormat},e=super.getConfig();return Object.assign(t,e),t}}class W0 extends V0{constructor(t){super(t)}poolingFunction(t,e,s,r,o){return te(o),Je(r),O0(t,e,s,r,o,"max")}}W0.className="MaxPooling3D";X(W0);class U0 extends V0{constructor(t){super(t)}poolingFunction(t,e,s,r,o){return te(o),Je(r),O0(t,e,s,r,o,"avg")}}U0.className="AveragePooling3D";X(U0);class G0 extends kt{constructor(t){super(t),this.inputSpec=[new oe({ndim:3})]}computeOutputShape(t){return[t[0],t[2]]}call(t,e){throw new bt}}class H0 extends G0{constructor(t){super(t||{})}call(t,e){return z(()=>{const s=gt(t);return Yt(s,1)})}}H0.className="GlobalAveragePooling1D";X(H0);class q0 extends G0{constructor(t){super(t||{})}call(t,e){return z(()=>{const s=gt(t);return An(s,1)})}}q0.className="GlobalMaxPooling1D";X(q0);class K0 extends kt{constructor(t){super(t),this.dataFormat=t.dataFormat==null?"channelsLast":t.dataFormat,te(this.dataFormat),this.inputSpec=[new oe({ndim:4})]}computeOutputShape(t){return t=t,this.dataFormat==="channelsLast"?[t[0],t[3]]:[t[0],t[1]]}call(t,e){throw new bt}getConfig(){const t={dataFormat:this.dataFormat},e=super.getConfig();return Object.assign(t,e),t}}class j0 extends K0{call(t,e){return z(()=>{const s=gt(t);return this.dataFormat==="channelsLast"?Yt(s,[1,2]):Yt(s,[2,3])})}}j0.className="GlobalAveragePooling2D";X(j0);class X0 extends K0{call(t,e){return z(()=>{const s=gt(t);return this.dataFormat==="channelsLast"?An(s,[1,2]):An(s,[2,3])})}}X0.className="GlobalMaxPooling2D";X(X0);class Y0 extends kt{constructor(t){super(t),this.layer=t.layer}build(t){this.built=!0}get trainable(){return this.layer!=null?this.layer.trainable:!1}set trainable(t){this.layer!=null&&(this.layer.trainable=t)}get trainableWeights(){return this.layer.trainableWeights}get nonTrainableWeights(){return this.layer.nonTrainableWeights}get updates(){return this.layer._updates}get losses(){return this.layer.losses}getWeights(){return this.layer.getWeights()}setWeights(t){this.layer.setWeights(t)}getConfig(){const t={layer:{className:this.layer.getClassName(),config:this.layer.getConfig()}},e=super.getConfig();return Object.assign(t,e),t}setFastWeightInitDuringBuild(t){super.setFastWeightInitDuringBuild(t),this.layer!=null&&this.layer.setFastWeightInitDuringBuild(t)}static fromConfig(t,e,s={}){const r=e.layer,o=Hn(r,s);delete e.layer;const i={layer:o};return Object.assign(i,e),new t(i)}}class Z0 extends Y0{constructor(t){super(t),this.supportsMasking=!0}build(t){if(t=Rt(t),t.length<3)throw new O(`TimeDistributed layer expects an input shape >= 3D, but received input shape ${JSON.stringify(t)}`);this.inputSpec=[{shape:t}];const e=[t[0]].concat(t.slice(2));this.layer.built||(this.layer.build(e),this.layer.built=!0),super.build(t)}computeOutputShape(t){t=Rt(t);const e=[t[0]].concat(t.slice(2)),s=this.layer.computeOutputShape(e),r=t[1];return[s[0],r].concat(s.slice(1))}call(t,e){return z(()=>(t=gt(t),i0((i,a)=>[gt(this.layer.call(i,e)),[]],t,[],!1,null,null,!1,!0)[1]))}}Z0.className="TimeDistributed";X(Z0);function MR(n){rr(rE,"BidirectionalMergeMode",n)}const LR="concat";class J0 extends Y0{constructor(t){super(t);const e=t.layer.getConfig(),s={};s.className=t.layer.getClassName(),s.config=e,this.forwardLayer=Hn(s),e.goBackwards=e.goBackwards!==!0;const r={};if(r.className=t.layer.getClassName(),r.config=e,this.backwardLayer=Hn(r),this.forwardLayer.name="forward_"+this.forwardLayer.name,this.backwardLayer.name="backward_"+this.backwardLayer.name,this.mergeMode=t.mergeMode===void 0?LR:t.mergeMode,MR(this.mergeMode),t.weights)throw new bt("weights support is not implemented for Bidirectional layer yet.");this._stateful=t.layer.stateful,this.returnSequences=t.layer.returnSequences,this.returnState=t.layer.returnState,this.supportsMasking=!0,this._trainable=!0,this.inputSpec=t.layer.inputSpec,this.numConstants=null}get trainable(){return this._trainable}set trainable(t){this._trainable=t,this.forwardLayer!=null&&(this.forwardLayer.trainable=t),this.backwardLayer!=null&&(this.backwardLayer.trainable=t)}getWeights(){return this.forwardLayer.getWeights().concat(this.backwardLayer.getWeights())}setWeights(t){const e=t.length,s=Math.floor(e/2);this.forwardLayer.setWeights(t.slice(0,s)),this.backwardLayer.setWeights(t.slice(s))}computeOutputShape(t){let e=this.forwardLayer.computeOutputShape(t);Array.isArray(e)&&Array.isArray(e[0])||(e=[e]),e=e;let s,r,o;return this.returnState&&(o=e.slice(1)),s=e[0],s=s,this.mergeMode==="concat"?(s[s.length-1]*=2,r=[s]):this.mergeMode==null?r=[s,s.slice()]:r=[s],this.returnState?this.mergeMode==null?r.concat(o).concat(o.slice()):[s].concat(o).concat(o.slice()):Oe(r)}apply(t,e){let s=e==null?null:e.initialState,r=e==null?null:e.constants;e==null&&(e={});const o=o0(t,s,r,this.numConstants);if(t=o.inputs,s=o.initialState,r=o.constants,Array.isArray(t)&&(s=t.slice(1),t=t[0]),(s==null||s.length===0)&&r==null)return super.apply(t,e);const i=[],a=[];if(s!=null){const l=s.length;if(l%2>0)throw new O("When passing `initialState` to a Bidrectional RNN, the state should be an Array containing the states of the underlying RNNs.");e.initialState=s,i.push(...s);const u=s.map(h=>new oe({shape:h.shape}));this.forwardLayer.stateSpec=u.slice(0,l/2),this.backwardLayer.stateSpec=u.slice(l/2),a.push(...u)}if(r!=null)throw new bt("Support for constants in Bidirectional layers is not implemented yet.");const c=i[0]instanceof Rn;for(const l of i)if(l instanceof Rn!==c)throw new O("The initial state of a Bidirectional layer cannot be specified as a mix of symbolic and non-symbolic tensors");if(c){const l=[t].concat(i),u=this.inputSpec.concat(a),h=this.inputSpec;this.inputSpec=u;const d=super.apply(l,e);return this.inputSpec=h,d}else return super.apply(t,e)}call(t,e){return z(()=>{const s=e.initialState;let r,o;if(s==null)r=this.forwardLayer.call(t,e),o=this.backwardLayer.call(t,e);else{const c=s.slice(0,s.length/2),l=s.slice(s.length/2);r=this.forwardLayer.call(t,Object.assign(e,{initialState:c})),o=this.backwardLayer.call(t,Object.assign(e,{initialState:l}))}let i;this.returnState&&(Array.isArray(r)&&(i=r.slice(1).concat(o.slice(1))),r=r[0],o=o[0]),this.returnSequences&&(o=Zs(o,1));let a;return this.mergeMode==="concat"?a=Jd([r,o]):this.mergeMode==="sum"?a=J(r,o):this.mergeMode==="ave"?a=D(.5,J(r,o)):this.mergeMode==="mul"?a=D(r,o):this.mergeMode==null&&(a=[r,o]),this.returnState?this.mergeMode==null?a.concat(i):[a].concat(i):a})}resetStates(t){this.forwardLayer.resetStates(),this.backwardLayer.resetStates()}build(t){Ws(this.forwardLayer.name,()=>{this.forwardLayer.build(t)}),Ws(this.backwardLayer.name,()=>{this.backwardLayer.build(t)}),this.built=!0}computeMask(t,e){Array.isArray(e)&&(e=e[0]);let s;if(this.returnSequences?this.mergeMode==null?s=[e,e]:s=e:this.mergeMode==null?s=[null,null]:s=null,this.returnState){const o=this.forwardLayer.states.map(i=>null);return Array.isArray(s)?s.concat(o).concat(o):[s].concat(o).concat(o)}else return s}get trainableWeights(){return this.forwardLayer.trainableWeights.concat(this.backwardLayer.trainableWeights)}get nonTrainableWeights(){return this.forwardLayer.nonTrainableWeights.concat(this.backwardLayer.nonTrainableWeights)}setFastWeightInitDuringBuild(t){super.setFastWeightInitDuringBuild(t),this.forwardLayer!=null&&this.forwardLayer.setFastWeightInitDuringBuild(t),this.backwardLayer!=null&&this.backwardLayer.setFastWeightInitDuringBuild(t)}getConfig(){const t={mergeMode:this.mergeMode},e=super.getConfig();return Object.assign(t,e),t}static fromConfig(t,e){const s=Hn(e.layer);if(delete e.layer,e.numConstants!=null)throw new bt("Deserialization of a Bidirectional layer with numConstants present is not supported yet.");const r=e;return r.layer=s,new t(r)}}J0.className="Bidirectional";X(J0);class Q0 extends kt{constructor(t){super(t),this.scale=t.scale,t.offset?this.offset=t.offset:this.offset=0}getConfig(){const t={scale:this.scale,offset:this.offset},e=super.getConfig();return Object.assign(t,e),t}call(t,e){return z(()=>(t=gt(t),t.dtype!=="float32"&&(t=Mi(t,"float32")),J(D(t,this.scale),this.offset)))}}Q0.className="Rescaling";X(Q0);const PR=W();PR.registerFlag("KEEP_INTERMEDIATE_TENSORS",()=>!1,n=>{n&&console.warn("Keep intermediate tensors is ON. This will print the values of all intermediate tensors during model inference. Not all models support this mode. For details, check e2e/benchmarks/ model_config.js. This significantly impacts performance.")});var Vf;(function(n){n[n.DT_INVALID=0]="DT_INVALID",n[n.DT_FLOAT=1]="DT_FLOAT",n[n.DT_DOUBLE=2]="DT_DOUBLE",n[n.DT_INT32=3]="DT_INT32",n[n.DT_UINT8=4]="DT_UINT8",n[n.DT_INT16=5]="DT_INT16",n[n.DT_INT8=6]="DT_INT8",n[n.DT_STRING=7]="DT_STRING",n[n.DT_COMPLEX64=8]="DT_COMPLEX64",n[n.DT_INT64=9]="DT_INT64",n[n.DT_BOOL=10]="DT_BOOL",n[n.DT_QINT8=11]="DT_QINT8",n[n.DT_QUINT8=12]="DT_QUINT8",n[n.DT_QINT32=13]="DT_QINT32",n[n.DT_BFLOAT16=14]="DT_BFLOAT16",n[n.DT_QINT16=15]="DT_QINT16",n[n.DT_QUINT16=16]="DT_QUINT16",n[n.DT_UINT16=17]="DT_UINT16",n[n.DT_COMPLEX128=18]="DT_COMPLEX128",n[n.DT_HALF=19]="DT_HALF",n[n.DT_RESOURCE=20]="DT_RESOURCE",n[n.DT_VARIANT=21]="DT_VARIANT",n[n.DT_UINT32=22]="DT_UINT32",n[n.DT_UINT64=23]="DT_UINT64",n[n.DT_FLOAT_REF=101]="DT_FLOAT_REF",n[n.DT_DOUBLE_REF=102]="DT_DOUBLE_REF",n[n.DT_INT32_REF=103]="DT_INT32_REF",n[n.DT_UINT8_REF=104]="DT_UINT8_REF",n[n.DT_INT16_REF=105]="DT_INT16_REF",n[n.DT_INT8_REF=106]="DT_INT8_REF",n[n.DT_STRING_REF=107]="DT_STRING_REF",n[n.DT_COMPLEX64_REF=108]="DT_COMPLEX64_REF",n[n.DT_INT64_REF=109]="DT_INT64_REF",n[n.DT_BOOL_REF=110]="DT_BOOL_REF",n[n.DT_QINT8_REF=111]="DT_QINT8_REF",n[n.DT_QUINT8_REF=112]="DT_QUINT8_REF",n[n.DT_QINT32_REF=113]="DT_QINT32_REF",n[n.DT_BFLOAT16_REF=114]="DT_BFLOAT16_REF",n[n.DT_QINT16_REF=115]="DT_QINT16_REF",n[n.DT_QUINT16_REF=116]="DT_QUINT16_REF",n[n.DT_UINT16_REF=117]="DT_UINT16_REF",n[n.DT_COMPLEX128_REF=118]="DT_COMPLEX128_REF",n[n.DT_HALF_REF=119]="DT_HALF_REF",n[n.DT_RESOURCE_REF=120]="DT_RESOURCE_REF",n[n.DT_VARIANT_REF=121]="DT_VARIANT_REF",n[n.DT_UINT32_REF=122]="DT_UINT32_REF",n[n.DT_UINT64_REF=123]="DT_UINT64_REF"})(Vf||(Vf={}));var Wf;(function(n){(function(t){t[t.LEGACY=0]="LEGACY",t[t.V1=1]="V1",t[t.V2=2]="V2"})(n.CheckpointFormatVersion||(n.CheckpointFormatVersion={}))})(Wf||(Wf={}));var Uf;(function(n){n[n.FAIL=0]="FAIL",n[n.SHORTEST=1]="SHORTEST",n[n.LONGEST=2]="LONGEST"})(Uf||(Uf={}));function rt(n,t){Array.isArray(n)||(n=[n]),n.forEach(e=>{e!=null&&S(e.dtype!=="complex64",()=>`${t} does not support complex64 tensors in the CPU backend.`)})}const BR=fx;class $l extends Uu{constructor(){super(),this.blockSize=48,this.firstUse=!0,this.data=new Pm(this,ss())}nextDataId(){return $l.nextDataId++}write(t,e,s){this.firstUse&&(this.firstUse=!1,W().get("IS_NODE")&&je(`
============================
Hi, looks like you are running TensorFlow.js in Node.js. To speed things up dramatically, install our node backend, visit https://github.com/tensorflow/tfjs-node for more details. 
============================`));const r={id:this.nextDataId()};return this.data.set(r,{values:t,dtype:s,refCount:1}),r}makeTensorInfo(t,e,s){let r;if(e==="string"&&s!=null&&s.length>0&&Eo(s[0])){const o=s.map(i=>as(i));r=this.write(o,t,e)}else r=this.write(s,t,e);return{dataId:r,shape:t,dtype:e}}refCount(t){return this.data.has(t)?this.data.get(t).refCount:0}incRef(t){const e=this.data.get(t);e.refCount++}decRef(t){if(this.data.has(t)){const e=this.data.get(t);e.refCount--}}move(t,e,s,r,o){this.data.set(t,{values:e,dtype:r,refCount:o})}numDataIds(){return this.data.numDataIds()}async read(t){return this.readSync(t)}readSync(t){const{dtype:e,complexTensorInfos:s}=this.data.get(t);if(e==="complex64"){const r=this.readSync(s.real.dataId),o=this.readSync(s.imag.dataId);return Kn(r,o)}return this.data.get(t).values}bufferSync(t){const e=this.readSync(t.dataId);if(t.dtype==="string")try{const s=e.map(r=>us(r));return yt(t.shape,t.dtype,s)}catch{throw new Error("Failed to decode encoded string bytes into utf-8")}return yt(t.shape,t.dtype,e)}makeOutput(t,e,s){return ss().makeTensorFromTensorInfo(this.makeTensorInfo(e,s,t),this)}disposeData(t,e=!1){if(this.data.has(t)){if(this.data.get(t).refCount--,!e&&this.data.get(t).refCount>0)return!1;const{complexTensorInfos:s}=this.data.get(t);s!=null&&(this.disposeData(s.real.dataId,!0),this.disposeData(s.imag.dataId,!0)),this.data.delete(t)}return!0}disposeIntermediateTensorInfo(t){this.disposeData(t.dataId)}async time(t){const e=Fe();return t(),{kernelMs:Fe()-e}}memory(){return{unreliable:!0,reasons:["The reported memory is an upper bound. Due to automatic garbage collection, the true allocated memory may be less."]}}where(t){rt([t],"where");const e=this.readSync(t.dataId);return BR(t.shape,e)}dispose(){}floatPrecision(){return 32}epsilon(){return super.epsilon()}}$l.nextDataId=0;function t1(n){const t=new Float32Array(n.length);for(let e=0;e<n.length;++e)t[e]=Math.abs(n[e]);return t}const zR=n=>{const{x:t}=n.inputs,e=n.backend;rt(t,"abs");let s=new Float32Array(q(t.shape));const r=e.data.get(t.dataId).values;return s=t1(r),e.makeOutput(s,t.shape,t.dtype)},VR={kernelName:tc,backendName:"cpu",kernelFunc:zR};function se(n){return(t,e,s,r,o)=>{const i=mt(t,e),a=i.length,c=ht(i),l=q(i),u=be(o,l),h=t.length,d=e.length,p=ht(t),f=ht(e),m=Nr(t,i),g=Nr(e,i);if(m.length+g.length===0)for(let x=0;x<u.length;++x)u[x]=n(s[x%s.length],r[x%r.length]);else for(let x=0;x<u.length;++x){const b=Lr(x,a,c),w=b.slice(-h);m.forEach(N=>w[N]=0);const y=Dn(w,h,p),I=b.slice(-d);g.forEach(N=>I[N]=0);const C=Dn(I,d,f);u[x]=n(s[y],r[C])}return[u,i]}}function Be(n){const{inputs:t,backend:e}=n,{real:s,imag:r}=t,o=e.data.get(s.dataId).values,i=e.data.get(r.dataId).values,a=e.makeTensorInfo(s.shape,"complex64"),c=e.data.get(a.dataId);return c.complexTensorInfos={real:e.makeTensorInfo(s.shape,"float32",o),imag:e.makeTensorInfo(r.shape,"float32",i)},a}const WR={kernelName:Qu,backendName:"cpu",kernelFunc:Be};function Ha(n,t,e="float32"){if(e==="complex64"){const r=Ha(n,t,"float32"),o=Ha(n,t,"float32");return Be({inputs:{real:r,imag:o},backend:n})}const s=ke(q(t),e);return n.makeTensorInfo(t,e,s)}function Pn(n){const{inputs:t,backend:e}=n,{x:s}=t;return e.incRef(s.dataId),{dataId:s.dataId,shape:s.shape,dtype:s.dtype}}const UR={kernelName:Zo,backendName:"cpu",kernelFunc:Pn};function er(n){const{inputs:t,backend:e}=n,{input:s}=t,r=e.data.get(s.dataId).complexTensorInfos.real,o=e.data.get(r.dataId).values;return e.makeTensorInfo(r.shape,r.dtype,o)}const GR={kernelName:Ih,backendName:"cpu",kernelFunc:er};function e1(n,t,e,s){if(s==="int32"){const r=Int32Array.from(n);return[t,"int32",r]}if(s==="bool"){const r=sr([0],e),[o,i]=se((a,c)=>a!==c?1:0)(t,[],n,r,"bool");return[i,"bool",o]}throw new Error(`Error in Cast: failed to cast ${e} to ${s}`)}function ms(n){const{inputs:t,backend:e,attrs:s}=n,{x:r}=t,{dtype:o}=s;if(o==="complex64"){if(r.dtype==="complex64")return Pn({inputs:{x:r},backend:e});const u=Ha(e,r.shape,r.dtype),h=ms({inputs:{x:r},backend:e,attrs:{dtype:"float32"}}),d=Be({inputs:{real:h,imag:u},backend:e});return e.disposeIntermediateTensorInfo(u),e.disposeIntermediateTensorInfo(h),d}if(r.dtype==="complex64"){const u=er({inputs:{input:r},backend:e}),h=ms({inputs:{x:u},backend:e,attrs:{dtype:o}});return e.disposeIntermediateTensorInfo(u),h}if(!Vm(r.dtype,o)){const u=Pn({inputs:{x:r},backend:e});return{dataId:u.dataId,shape:u.shape,dtype:o}}const i=e.data.get(r.dataId).values,[a,c,l]=e1(i,r.shape,r.dtype,o);return e.makeTensorInfo(a,c,l)}const HR={kernelName:Po,backendName:"cpu",kernelFunc:ms};function me(n,t,e,s){return e==null?({inputs:r,backend:o})=>{const{a:i,b:a}=r,c=o;rt([i,a],n);const l=c.data.get(i.dataId).values,u=c.data.get(a.dataId).values,h=i.dtype==="string"?Qs(l):l,d=i.dtype==="string"?Qs(u):u,p=s||i.dtype,[f,m]=t(i.shape,a.shape,h,d,p);return c.makeTensorInfo(m,p,f)}:({inputs:r,backend:o})=>{const{a:i,b:a}=r,c=o;if(i.dtype==="complex64"||a.dtype==="complex64"){const l=ms({inputs:{x:i},backend:c,attrs:{dtype:"complex64"}}),u=c.data.get(l.dataId),h=u.complexTensorInfos.real,d=u.complexTensorInfos.imag,p=c.data.get(h.dataId).values,f=c.data.get(d.dataId).values,m=ms({inputs:{x:a},backend:c,attrs:{dtype:"complex64"}}),g=c.data.get(m.dataId),x=g.complexTensorInfos.real,b=g.complexTensorInfos.imag,w=c.data.get(x.dataId).values,y=c.data.get(b.dataId).values,[I,C,N]=e(i.shape,a.shape,p,f,w,y),T=c.makeTensorInfo(N,"float32",I),$=c.makeTensorInfo(N,"float32",C),k=Be({inputs:{real:T,imag:$},backend:c});return c.disposeIntermediateTensorInfo(l),c.disposeIntermediateTensorInfo(m),c.disposeIntermediateTensorInfo(T),c.disposeIntermediateTensorInfo($),k}else{const l=c.data.get(i.dataId).values,u=c.data.get(a.dataId).values,h=s||i.dtype,[d,p]=t(i.shape,a.shape,l,u,h);return c.makeTensorInfo(p,h,d)}}}function bp(n){return(t,e,s,r,o,i)=>{const a=mt(t,e),c=q(a),l=a.length,u=ht(a),h=be("float32",c),d=be("float32",c),p=Nr(t,a),f=Nr(e,a),m=Kn(s,r),g=Kn(o,i),x=t.length,b=ht(t),w=e.length,y=ht(e);if(p.length+f.length===0)for(let I=0;I<h.length;I++){const C=I%m.length,N=I%g.length,T=n(m[C*2],m[C*2+1],g[N*2],g[N*2+1]);h[I]=T.real,d[I]=T.imag}else for(let I=0;I<h.length;I++){const C=Lr(I,l,u),N=C.slice(-x);p.forEach(R=>N[R]=0);const T=Dn(N,x,b),$=C.slice(-w);f.forEach(R=>$[R]=0);const k=Dn($,w,y),v=n(m[T*2],m[T*2+1],g[k*2],g[k*2+1]);h[I]=v.real,d[I]=v.imag}return[h,d,a]}}const n1=se((n,t)=>n+t),qR=bp((n,t,e,s)=>({real:n+e,imag:t+s})),Dr=me(Pr,n1,qR),KR={kernelName:Pr,backendName:"cpu",kernelFunc:Dr};function yp(n,t,e,s,r){const o=q(s),i=ke(r,e);for(let a=0;a<n.length;a++){const c=n[a];if(c<0)throw new Error("Input x must be non-negative!");c>=r||(o>0?i[c]+=t[a]:i[c]+=1)}return i}function s1(n,t,e,s=!1){const r=n.shape[0],o=n.shape[1],i=yt([r,e],t.dtype);for(let a=0;a<r;a++)for(let c=0;c<o;c++){const l=n.get(a,c);if(l<0)throw new Error("Input x must be non-negative!");l>=e||(s?i.set(1,a,l):t.size>0?i.set(i.get(a,l)+t.get(a,c),a,l):i.set(i.get(a,l)+1,a,l))}return i}function ks(n){return(t,e,s)=>{const r=be(e,t.length);for(let o=0;o<t.length;++o)r[o]=n(t[o],s);return r}}function Dt(n,t,e){return({inputs:s,attrs:r,backend:o})=>{const{x:i}=s;if(rt(i,n),i.dtype==="string"||e==="string")throw new Error("unaryKernelFunc does not support string input/output");const a=o,c=a.data.get(i.dataId).values,l=q(i.shape),u=e||i.dtype,h=de(u,l);for(let d=0;d<l;++d)h[d]=t(c[d],r);return a.makeTensorInfo(i.shape,u,h)}}function Hr(n,t,e){return({inputs:s,attrs:r,backend:o})=>{const{x:i}=s;if(rt(i,n),i.dtype==="string"||e==="string")throw new Error("unaryKernelFunc does not support string input/output");const a=o,c=a.data.get(i.dataId).values,l=e||i.dtype,u=t(c,l,r);return a.makeTensorInfo(i.shape,l,u)}}const r1=ks(n=>Math.ceil(n)),jR=Hr(Bo,r1),XR={kernelName:Bo,backendName:"cpu",kernelFunc:jR};function o1(n,t,e,s){const r=de(e,q(t));if(s&&e!=="string"){let o=0;n.forEach(i=>{const a=q(i.shape);r.set(i.vals,o),o+=a})}else{let o=0;n.forEach(i=>{const a=e==="string"?Qs(i.vals):i.vals;let c=0;for(let l=0;l<i.shape[0];++l){const u=l*t[1]+o;for(let h=0;h<i.shape[1];++h)r[u+h]=a[c++]}o+=i.shape[1]})}return r}const i1=se((n,t)=>n===t?1:0),a1=me(mc,i1,null,"bool"),YR={kernelName:mc,backendName:"cpu",kernelFunc:a1};const c1=ks(n=>Math.exp(n)),l1=Hr(qo,c1,"float32"),ZR={kernelName:qo,backendName:"cpu",kernelFunc:l1};const u1=ks(n=>Math.expm1(n)),JR=Hr(Ko,u1),QR={kernelName:Ko,backendName:"cpu",kernelFunc:JR};const h1=ks(n=>Math.floor(n)),tD=Hr(jo,h1),eD={kernelName:jo,backendName:"cpu",kernelFunc:tD};function d1(n,t,e,s,r,o,i,a,c){const l=yt([s,o],e);for(let u=0;u<s;u++){const h=[];let d=0;for(let p=0;p<r;p++){const f=n[u*r+p];d+=f*i[p],h.push(f)}if(d<0||d>=c/o)throw new Error(`Invalid indices: ${h} does not index into ${a}`);for(let p=0;p<o;p++)l.values[u*o+p]=t.get(...t.indexToLoc(d*o+p))}return l}function p1(n,t,e){const s=yt(e,n.dtype);for(let r=0;r<s.size;++r){const i=s.indexToLoc(r).slice(),a=i[0],c=i[2],l=t.locToIndex([a,c]);i[2]=t.values[l];const u=n.locToIndex(i);0<=u&&u<n.values.length&&(s.values[r]=n.values[u])}return s}const f1=se((n,t)=>n>t?1:0),nD=me(yc,f1,null,"bool"),sD={kernelName:yc,backendName:"cpu",kernelFunc:nD};const m1=se((n,t)=>n>=t?1:0),rD=me(Yo,m1,null,"bool"),oD={kernelName:Yo,backendName:"cpu",kernelFunc:rD};const g1=se((n,t)=>n<t?1:0),iD=me(Ic,g1,null,"bool"),aD={kernelName:Ic,backendName:"cpu",kernelFunc:iD};const x1=se((n,t)=>n<=t?1:0),cD=me(vc,x1,null,"bool"),lD={kernelName:vc,backendName:"cpu",kernelFunc:cD};function b1(n,t,e){const s=(t-n)/(e-1),r=ke(e,"float32");r[0]=n;for(let o=1;o<r.length;o++)r[o]=r[o-1]+s;return r}const y1=ks(n=>Math.log(n)),uD=Hr(ei,y1),hD={kernelName:ei,backendName:"cpu",kernelFunc:uD};function w1(n,t,e,s){const r=be(s,q(e));for(let o=0;o<r.length;++o){const i=o*t;let a=n[i];for(let c=0;c<t;++c){const l=n[i+c];(Number.isNaN(l)||l>a)&&(a=l)}r[o]=a}return r}const I1=se((n,t)=>Math.max(n,t)),dD=me(si,I1),pD={kernelName:si,backendName:"cpu",kernelFunc:dD};const v1=se((n,t)=>Math.min(n,t)),fD=me(ri,v1),mD={kernelName:ri,backendName:"cpu",kernelFunc:fD};const wp=se((n,t)=>n*t),gD=bp((n,t,e,s)=>({real:n*e-t*s,imag:n*s+t*e})),Sl=me(ii,wp,gD),xD={kernelName:ii,backendName:"cpu",kernelFunc:Sl};function C1(n,t,e){const s=xs(-1,e);return wp([],t,s,n,e)}function bD(n){const{inputs:t,backend:e}=n,{x:s}=t;rt(s,"neg");const r=e.data.get(s.dataId).values,[o,i]=C1(r,s.shape,s.dtype);return e.makeTensorInfo(i,s.dtype,o)}const yD={kernelName:Fc,backendName:"cpu",kernelFunc:bD};const k1=se((n,t)=>n!==t?1:0),wD=me(Oc,k1,null,"bool"),ID={kernelName:Oc,backendName:"cpu",kernelFunc:wD};function Ip(n,t,e,s,r){const o=t.length,i=q(t),a=ht(t),c=ht(r),l=be(e,q(r));for(let u=0;u<i;++u){const h=Lr(u,o,a),d=new Array(h.length);for(let f=0;f<d.length;f++)d[f]=h[s[f]];const p=Dn(d,o,c);l[p]=n[u]}return l}function Me(n){const{inputs:t,attrs:e,backend:s}=n,{x:r}=t,{perm:o}=e;rt(r,"transpose");const i=r.shape.length,a=new Array(i);for(let h=0;h<a.length;h++)a[h]=r.shape[o[h]];const c=s.data.get(r.dataId).values,l=Ip(c,r.shape,r.dtype,o,a);return{dataId:s.write(l,a,r.dtype),shape:a,dtype:r.dtype}}const vD={kernelName:yr,backendName:"cpu",kernelFunc:Me};function $1(n,t,e,s){const[r,o]=fe(n,s),i=Ve(t,"int32"),a=ke(q(r),i),c=q(o);for(let l=0;l<a.length;++l){const u=l*c;let h=1;for(let d=0;d<c;++d)h*=e[u+d];a[l]=h}return{outVals:a,outShape:r,outDtype:i}}function CD(n){const{inputs:t,backend:e,attrs:s}=n,{x:r}=t,{axis:o,keepDims:i}=s;rt(r,"prod");const a=r.shape.length,c=wt(o,r.shape),l=Kt(c,a);let u=c,h=r;const d=[];l!=null&&(h=Me({inputs:{x:r},backend:e,attrs:{perm:l}}),d.push(h),u=Qt(u.length,a));const p=e.data.get(h.dataId).values,{outVals:f,outShape:m,outDtype:g}=$1(h.shape,h.dtype,p,u);let x=m;return i&&(x=Jt(m,c)),d.forEach(b=>e.disposeIntermediateTensorInfo(b)),e.makeTensorInfo(x,g,f)}const kD={kernelName:zc,backendName:"cpu",kernelFunc:CD};function $D(n,t,e){n.forEach((s,r)=>{if(s<0||s>=e){const o=Lr(r,t.length,ht(t)).join(",");throw new Error(`indices[${o}] = ${s} is not in [0, ${e})`)}})}function SD(n,t){for(let e=0;e<n.length;++e){const s=n[e],r=e===n.length-1?t:n[e+1].length;if(s.length===0)throw new Error("Ragged splits may not be empty");if(s[0]<0)throw new Error("Ragged splits must be non-negative");if(s[s.length-1]>r)throw new Error("Ragged splits must not point past values");for(let o=1;o<s.length;++o)if(s[o-1]>s[o])throw new Error("Ragged splits must be sorted in ascending order")}}function ND(n,t,e,s){const r=[];let o=0;const i=t.length-1+e.length,a=new Array(i).fill(null).map(()=>[0]);SD(e,s);let c=1;for(let l=0;l<t.length-1;++l){c*=t[l];const u=t[l+1];for(let h=1;h<c+1;++h)a[l].push(h*u)}for(let l=0;l<n.length;++l){let u=n[l],h=n[l]+1;for(let d=0;d<e.length;++d){const p=e[d],f=d+t.length-1;if(f>=0){const m=a[f],g=m[m.length-1]-p[u];for(let x=u;x<h;++x)a[f].push(p[x+1]+g)}u=p[u],h=p[h]}h!==u&&(r.push([u,h]),o+=h-u)}return{outSplits:a,valueSlices:r,numValues:o}}function TD(n){const t=[];for(let e=0;e<n.length;++e){const s=n[e].length,r=de("int32",s);t.push(r),n[e].forEach((o,i)=>r[i]=o)}return t}function Gf(n,t){const e=n.slice(0,t);for(;e.length<t;)e.push(1);for(let s=t;s<n.length;s++)e[t-1]*=n[s];return e}function ED(n,t,e,s,r,o){const i=Gf(t,2)[1],a=Gf(o,2)[1];let c=0;for(const l of e)for(let u=l[0];u<l[1];++u){for(let h=0;h<s;++h)r[c*a+h]=n[u*i+h];++c}}function RD(n,t,e,s,r){const o=t.slice();o[0]=r;const i=de(e,q(o)),a=n.length,c=a===0?0:a/t[0];return ED(n,t,s,c,i,o),[i,o]}function S1(n,t,e,s,r,o,i,a){if(n.length===0)throw new Error("paramsNestedSplits must be non empty");if(t[0].length===0)throw new Error("Split tensors must not be scalars");const c=t[0][0]-1;if($D(o,i,c),s.length===0)throw new Error("params.rank must be nonzero");const l=s[0],{outSplits:u,valueSlices:h,numValues:d}=ND(o,i,n,l),p=TD(u),f=RD(e,s,r,h,d);return[p,f[0],f[1]]}var tn=bn;class qa{constructor(t,e,s,r,o,i,a,c,l,u){this.shape=t,this.shapeShape=e,this.values=s,this.valuesShape=r,this.valuesDType=o,this.defaultValue=i,this.defaultValueShape=a,this.rowPartitionValues=c,this.rowPartitionValuesShapes=l,this.rowPartitionTypes=vx(u),this.raggedRank=Cx(this.rowPartitionTypes)}getRowPartitionTypeByDimension(t){return this.rowPartitionTypes[0]===tn.FIRST_DIM_SIZE?this.rowPartitionTypes[t+1]:this.rowPartitionTypes[t]}getRowPartitionTensor(t){return this.rowPartitionTypes[0]===tn.FIRST_DIM_SIZE?this.rowPartitionValues[t+1]:this.rowPartitionValues[t]}getMaxWidth(t){const e=this.getRowPartitionTensor(t-1);switch(this.getRowPartitionTypeByDimension(t-1)){case tn.VALUE_ROWIDS:return qa.getMaxWidthValueRowID(e);case tn.ROW_SPLITS:return qa.getMaxWidthRowSplit(e);default:throw new Error(`Cannot handle partition type ${tn[this.getRowPartitionTypeByDimension(t-1)]}`)}}static getMaxWidthRowSplit(t){const e=t.length;if(e===0||e===1)return 0;let s=0;for(let r=0;r<e-1;++r){const o=t[r+1]-t[r];o>s&&(s=o)}return s}static getMaxWidthValueRowID(t){const e=t.length;if(e===0)return 0;let s=0,r=t[0],o=0;for(let i=1;i<e;++i){const a=t[i];a!==r&&(r=a,o=Math.max(i-s,o),s=i)}return Math.max(e-s,o)}tensorShapeFromTensor(t,e,s=!0){if(e.length===0){if(t[0]===-1)return[];throw new Error("The only valid scalar shape tensor is the fully unknown shape specified as -1.")}return qf(t,s)}calculateOutputSize(t){const e=this.valuesShape,s=this.defaultValueShape;kx(s,e);const r=this.tensorShapeFromTensor(this.shape,this.shapeShape),i=Ix(this.raggedRank,r,e);i[0]<0&&(i[0]=t);for(let a=1;a<=this.raggedRank;++a)i[a]<0&&(i[a]=this.getMaxWidth(a));return i}calculateFirstParentOutputIndex(t,e,s){const r=Math.min(t,s),o=[];let i=0;for(let a=0;a<r;++a,i+=e)o.push(i);for(let a=r;a<t;++a)o.push(-1);return S(o.length===t,()=>"Final length of result must be equal to firstDimension."),o}calculateOutputIndexRowSplit(t,e,s,r){const o=t.length,i=[];for(let a=0;a<o-1;++a){const c=t[a+1]-t[a];let l=Math.min(r,c),u=e[a];u===-1&&(l=0);for(let h=0;h<l;++h)i.push(u),u+=s;for(let h=0;h<c-l;++h)i.push(-1)}if(o>0&&i.length!==t[o-1])throw new Error("Invalid row split size.");return i}calculateOutputIndexValueRowID(t,e,s,r){const o=t.length,i=[];if(o===0)return[];let a=0,c=t[0];if(c>=e.length)throw new Error(`Got currentValueRowId=${c}, which is not less than ${e.length}`);let l=e[c];i.push(l);for(let u=1;u<o;++u){const h=t[u];if(h===c)l>=0&&(++a,a<r?l+=s:l=-1);else{if(a=0,c=h,h>=e.length)throw new Error(`Got nextValueRowId=${h} which is not less than ${e.length}`);l=e[h]}i.push(l)}if(i.length!==t.length)throw new Error("Invalid row ids.");return i}calculateOutputIndex(t,e,s,r){const o=this.getRowPartitionTensor(t),i=this.getRowPartitionTypeByDimension(t);switch(i){case tn.VALUE_ROWIDS:return this.calculateOutputIndexValueRowID(o,e,s,r);case tn.ROW_SPLITS:if(o.length-1>e.length)throw new Error(`Row partition size is greater than output size: ${o.length-1} > ${e.length}`);return this.calculateOutputIndexRowSplit(o,e,s,r);default:throw new Error(`Unsupported partition type: ${tn[i]}`)}}getFirstDimensionSize(){const t=this.rowPartitionValues[0];if(this.rowPartitionTypes.length===0)throw new Error("No row_partition_types given.");const e=this.rowPartitionTypes[0];switch(e){case tn.FIRST_DIM_SIZE:return t[0];case tn.VALUE_ROWIDS:throw new Error("Cannot handle VALUE_ROWIDS in first dimension.");case tn.ROW_SPLITS:return this.rowPartitionValuesShapes[0][0]-1;default:throw new Error(`Cannot handle type ${tn[e]}`)}}compute(){if(this.rowPartitionValues[0].length<=0)throw new Error("Invalid first partition input. Tensor requires at least one element.");const e=this.getFirstDimensionSize(),s=this.calculateOutputSize(e),r=new Array(this.raggedRank+1);r[r.length-1]=1;for(let c=r.length-2;c>=0;--c)r[c]=r[c+1]*s[c+1];const o=qf(s,!1),i=de(this.valuesDType,q(o));if(r[0]*s[0]>0){let c=this.calculateFirstParentOutputIndex(e,r[0],s[0]);for(let l=1;l<=this.raggedRank;++l)c=this.calculateOutputIndex(l-1,c,r[l],s[l]);this.setOutput(this.raggedRank,c,i,o)}return[o,i]}setOutput(t,e,s,r){if(s.length===0)return;const o=this.values,i=s;let a=r.slice();a=a.slice(t+1);const c=q(a),l=e.length;let u=this.defaultValue;if(u.length!==c&&u.length!==1){const f=this.defaultValueShape;z(()=>{const m=M(u,f);u=xo(m,a).dataSync()})}let h=0,d=0,p=0;for(let f=0;f<=l;++f){let m=f<l?e[f]:-1;if(m===p){++p;continue}if(d<p){const g=o.subarray(h*c),x=i.subarray(d*c),b=(p-d)*c;Hf(x,g,b)}if(f>=l){const g=s.length;m=Math.floor(g/c)}if(m>p)if(this.defaultValue.length===1)i.subarray(p*c,m*c).fill(this.defaultValue[0]),p=m;else for(;m>p;){const g=i.slice(p*c);Hf(g,u,c),++p}m<0?(h=f+1,d=p):(h=f,d=p,p=d+1)}}}function Hf(n,t,e){for(let s=0;s<e;s++)n[s]=t[s]}function qf(n,t){const e=[];for(let s of n){if(s<0){if(!t)throw new Error(`Dimension ${s} must be >= 0`);if(s<-1)throw new Error(`Dimension ${s} must be >= -1`);s=-1}e.push(s)}return e}function N1(n,t,e,s,r,o,i,a,c,l){return new qa(n,t,e,s,r,o,i,a,c,l).compute()}function T1(n,t,e,s){const r=n===t,o=n<t&&e<0,i=t<n&&e>1;if(r||o||i)return ke(0,s);const a=Math.abs(Math.ceil((t-n)/e)),c=ke(a,s);t<n&&e===1&&(e=-1),c[0]=n;for(let l=1;l<c.length;l++)c[l]=c[l-1]+e;return c}const E1=ks(n=>1/Math.sqrt(n)),DD=Hr(di,E1),AD={kernelName:di,backendName:"cpu",kernelFunc:DD};function gr(n,t,e,s,r,o,i,a,c,l){const u=[s/r,r],h=n.values,d=t.values;if(s===0)return yt(e,t.dtype);const p=yt(u,t.dtype);typeof c=="string"||typeof c=="number"?p.values.fill(c):typeof c=="boolean"&&p.values.fill(+c);for(let f=0;f<o;f++){const m=[];let g=0;for(let x=0;x<i;x++){const b=h[f*i+x];m.push(b),g+=b*a[x]}if(g<0||g>=s/r)throw new Error(`Invalid indices: ${m} does not index into ${e}`);for(let x=0;x<r;x++)l?p.values[g*r+x]+=d[f*r+x]:p.values[g*r+x]=t.rank===0?d[0]:d[f*r+x]}return p}const FD=ks(n=>1/(1+Math.exp(-n))),R1=Dt(xi,n=>1/(1+Math.exp(-n))),OD={kernelName:xi,backendName:"cpu",kernelFunc:R1};function D1(n,t,e,s,r){const o=Uh(s,t,e),i=q(e),a=ht(s);if(o){const h=Gh(t,a);return r==="string"?n.slice(h,h+i):n.subarray(h,h+i)}const c=r==="string"?Qs(n):n,l=yt(s,r,c),u=yt(e,r);for(let h=0;h<u.size;++h){const d=u.indexToLoc(h),p=d.map((f,m)=>f+t[m]);u.set(l.get(...p),...d)}return r==="string"?Gx(u.values):u.values}function nr(n){const{inputs:t,backend:e,attrs:s}=n,{x:r}=t,{begin:o,size:i}=s;rt(r,"slice");const[a,c]=sl(r,o,i);Vh(r,a,c);const l=e.data.get(r.dataId).values,u=D1(l,a,c,r.shape,r.dtype);return e.makeTensorInfo(c,r.dtype,u)}const _D={kernelName:qc,backendName:"cpu",kernelFunc:nr};function A1(n,t,e,s,r,o,i){const a=t[0],c=o[0],l=new Array(c),u=new Array(a),h=t[1];if(c===0){if(a!==0)throw new Error(Dx(a));const g=de(e,0),x=de(r,0);return[g,[0,h],x,l,u]}let d=!0,p=0;const f=new Array(c).fill(0);for(let g=0;g<a;++g){const x=n[g*h];if(x<0)throw new Error(Ax(g,x));if(x>=c)throw new Error(Fx(g,x,c));++f[x],d=d&&x>=p,p=x}let m=!0;for(let g=0;g<c;++g){const x=f[g]===0;l[g]=x,m=m&&!x,f[g]=Math.max(f[g],1),g>0&&(f[g]+=f[g-1])}if(m&&d){const g=n,x=s;for(let b=0;b<a;++b)u[b]=b;return[g,[a,h],x,l,u]}else{const g=f[c-1],x=de(e,g*h),b=de(r,g),w=new Array(c).fill(0);for(let y=0;y<a;++y){const I=n[y*h],C=w[I],N=(I===0?0:f[I-1])+C;w[I]++;for(let T=0;T<h;++T)x[N*h+T]=n[y*h+T];b[N]=s[y],u[y]=N}for(let y=0;y<c;++y)if(w[y]===0){const C=y===0?0:f[y-1];x[C*h+0]=y;for(let N=1;N<h;++N)x[C*h+N]=0;b[C]=i}return[x,[g,h],b,l,u]}}function F1(n,t,e,s,r){const o=q(s),i=t[0],a=r.length,c=[];let l=1,u=-1;for(let g=0;g<a;++g){const x=r[g];if(x===-1){if(u!==-1)throw new Error(Ox(u,g));u=g,c.push(1)}else{if(x<0)throw new Error(_x(g,x));l*=x,c.push(x)}}if(u!==-1){if(l<=0)throw new Error(Mx());const g=Math.trunc(o/l);if(l*g!==o)throw new Error(Lx(s,c));c[u]=g}if(q(c)!==o)throw new Error(Px(s,c));const d=s.length,p=[];if(d>0){p[d-1]=1;for(let g=d-2;g>=0;--g)p[g]=p[g+1]*s[g+1]}const f=[];if(a>0){f[a-1]=1;for(let g=a-2;g>=0;--g)f[g]=f[g+1]*c[g+1]}const m=de(e,i*a);for(let g=0;g<i;++g){let x=0;for(let b=0;b<d;++b)x+=n[g*d+b]*p[b];for(let b=0;b<a;++b)m[g*a+b]=Math.trunc(x/f[b]),x%=f[b]}return[m,[i,a],c]}function vp(n,t,e,s,r,o=!1,i=0){const a=s.length,c=[t[0],n.length/t[0]],l=c[1],h=a>0?r[a-1]+1:0;if(h<0)throw new Error(ku());const d=t.slice();d[0]=h;const p=d.reduce((w,y)=>w*y,1),f=de(e,p);if(a===0)return h>0&&f.fill(i),[f,d];if(h<=0)throw new Error(ku());let m=0,g=1,x=0,b=r[m];for(;;){let w=0;if(g<a){if(w=r[g],b===w){++g;continue}if(b>=w)throw new Error(Bx())}if(b<0||b>=h)throw new Error(zx(b,h));b>x&&f.fill(i,x*l,b*l);for(let y=m;y<g;++y){const I=s[y];if(I<0||I>=c[0])throw new Error(Vx(y,s[y],c[0]));for(let C=0;C<l;C++)f[b*l+C]+=n[I*l+C]}if(o)for(let y=0;y<l;y++)f[b*l+y]/=g-m;if(m=g,++g,x=b+1,b=w,g>a)break}return x<h&&f.fill(i,x*l,h*l),[f,d]}const MD=ks(n=>Math.sqrt(n)),LD=Dt(yi,n=>Math.sqrt(n)),PD={kernelName:yi,backendName:"cpu",kernelFunc:LD};const O1=se((n,t)=>{const e=n-t;return e*e}),BD=me(wi,O1),zD={kernelName:wi,backendName:"cpu",kernelFunc:BD};function _1(n,t,e,s){const r=yt(n,t.dtype);for(let o=0;o<r.size;o++){const i=r.indexToLoc(o),a=new Array(i.length);for(let c=0;c<a.length;c++)a[c]=i[c]*e[c]+s[c];r.set(t.get(...a),...i)}return r}class VD{constructor(t,e,s,r,o,i){this.separator=as(t),this.nGramWidths=e,this.leftPad=as(s),this.rightPad=as(r),this.padWidth=o,this.preserveShort=i}getPadWidth(t){return Math.min(this.padWidth<0?t-1:this.padWidth,t-1)}getNumNGrams(t,e){const s=this.getPadWidth(e);return Math.max(0,t+2*s-e+1)}createNGrams(t,e,s,r,o,i){for(let a=0;a<o;++a){const c=this.getPadWidth(i),l=Math.max(0,c-a),u=Math.max(0,c-(o-(a+1))),h=i-(l+u),d=e+(l>0?0:a-c);let p=0;p+=l*this.leftPad.length;for(let b=0;b<h;++b)p+=t[d+b].length;p+=u*this.rightPad.length;const f=l+u+h-1;p+=f*this.separator.length,s[r+a]=new Uint8Array(p);const m=s[r+a];let g=0;const x=b=>b.forEach(w=>m[g++]=w);for(let b=0;b<l;++b)x(this.leftPad),x(this.separator);for(let b=0;b<h-1;++b)x(t[d+b]),x(this.separator);if(h>0){x(t[d+h-1]);for(let b=0;b<u;++b)x(this.separator),x(this.rightPad)}else{for(let b=0;b<u-1;++b)x(this.rightPad),x(this.separator);x(this.rightPad)}}}compute(t,e){const s=t.length,r=e.length;if(r>0){let c=e[0];if(c!==0)throw new Error(`First split value must be 0, got ${c}`);for(let l=1;l<r;++l){let u=e[l]>=c;if(u=u&&e[l]<=s,!u)throw new Error(`Invalid split value ${e[l]}, must be in [${c}, ${s}]`);c=e[l]}if(c!==s)throw new Error(`Last split value must be data size. Expected ${s}, got ${c}`)}const o=r-1,i=de("int32",r);if(s===0||r===0){const c=new Array(s);for(let l=0;l<=o;++l)i[l]=0;return[c,i]}i[0]=0;for(let c=1;c<=o;++c){const l=e[c]-e[c-1];let u=0;this.nGramWidths.forEach(h=>{u+=this.getNumNGrams(l,h)}),this.preserveShort&&l>0&&u===0&&(u=1),i[c]=i[c-1]+u}const a=new Array(i[o]);for(let c=0;c<o;++c){const l=e[c];let u=i[c];if(this.nGramWidths.forEach(h=>{const d=e[c+1]-e[c],p=this.getNumNGrams(d,h);this.createNGrams(t,l,a,u,p,h),u+=p}),this.preserveShort&&u===i[c]){const h=e[c+1]-e[c];if(h===0)continue;const d=h+2*this.padWidth;this.createNGrams(t,l,a,u,1,d)}}return[a,i]}}function M1(n,t,e,s,r,o,i,a){return new VD(e,s,r,o,i,a).compute(n,t)}function WD(n,t,e,s){if(!n.length)return;if(t.length===0){for(let o=0;o<n.length;++o)s.push(n.subarray(o,o+1));return}if(t.length===1){const o=t[0];let i=n.indexOf(o);for(;i!==-1;){const a=n.subarray(0,i);(!e||a.length!==0)&&s.push(a),n=n.subarray(i+1),i=n.indexOf(o)}(!e||n.length!==0)&&s.push(n);return}let r=0;for(let o=0;o<n.length+1;o++)if(o===n.length||t.indexOf(n[o])!==-1){const i=n.subarray(r,o);(!e||i.length!==0)&&s.push(i),r=o+1}}function L1(n,t,e){const s=n.length,r=[];let o=0,i=0;const a=new Array(s);for(let d=0;d<s;++d){const p=r.length;WD(n[d],t,e,r);const f=r.length-p;a[d]=f,o+=f,i=Math.max(i,f)}const c=de("int32",o*2),l=new Array(o),u=[s,i];let h=0;for(let d=0;d<s;++d)for(let p=0;p<a[d];++p)c[h*2]=d,c[h*2+1]=p,l[h]=r[h],++h;return[c,l,u]}function P1(n,t){const e=de("int32",n.length);for(let s=0;s<n.length;++s)e[s]=eI(n[s]).modulo(t).getLowBitsUnsigned();return e}const B1=se((n,t)=>n-t),UD=bp((n,t,e,s)=>({real:n-e,imag:t-s})),Cp=me(Ii,B1,UD),GD={kernelName:Ii,backendName:"cpu",kernelFunc:Cp};function z1(n,t){const e=new Array(n.rank);for(let r=0;r<e.length;r++)e[r]=n.shape[r]*t[r];const s=yt(e,n.dtype);for(let r=0;r<s.values.length;++r){const o=s.indexToLoc(r),i=new Array(n.rank);for(let c=0;c<i.length;c++)i[c]=o[c]%n.shape[c];const a=n.locToIndex(i);s.values[r]=n.values[a]}return s}const fo=(n,t)=>{const e=t.value-n.value;return e===0?n.index-t.index:e};function V1(n,t,e=0,s=n.length-1){for(;s>e;){if(s-e>600){const a=s-e+1,c=t-e+1,l=Math.log(a),u=.5*Math.exp(2*l/3),h=.5*Math.sqrt(l*u*(a-u)/a)*Math.sign(c-a/2),d=Math.max(e,Math.floor(t-c*u/a+h)),p=Math.min(s,Math.floor(t+(a-c)*u/a+h));V1(n,t,d,p)}const r=n[t];let o=e,i=s;for(pr(n,e,t),fo(n[s],r)>0&&pr(n,e,s);o<i;){for(pr(n,o,i),o++,i--;fo(n[o],r)<0;)o=o+1;for(;fo(n[i],r)>0;)i=i-1}fo(n[e],r)===0?pr(n,e,i):(i=i+1,pr(n,i,s)),i<=t&&(e=i+1),t<=i&&(s=i-1)}}function W1(n,t,e,s,r){const o=t[t.length-1],[i,a]=[n.length/o,o],c=be(e,i*s),l=be("int32",i*s);for(let h=0;h<i;h++){const d=h*a,p=n.subarray(d,d+a);let f=new Array(p.length);p.forEach((b,w)=>f[w]={value:b,index:w}),s<f.length&&(V1(f,s),f=f.slice(0,s)),r&&f.sort(fo);const m=h*s,g=c.subarray(m,m+s),x=l.subarray(m,m+s);for(let b=0;b<s;b++)g[b]=f[b].value,x[b]=f[b].index}const u=t.slice();return u[u.length-1]=s,[yt(u,e,c),yt(u,"int32",l)]}function U1(n,t,e,s){const r=wt(t,e)[0],o=[1,e[0],1];for(let f=0;f<r;f++)o[0]*=e[f];o[1]=e[r];for(let f=r+1;f<e.length;f++)o[2]*=e[f];const i={},a=new Int32Array(e[r]),c=new ve(o,s,n),l=[],u=o[0]===1&&o[2]===1;for(let f=0;f<e[r];f++){let m;if(u)m=n[f].toString();else{const g=[];for(let x=0;x<o[0];x++)for(let b=0;b<o[2];b++)g.push(c.get(x,f,b));m=g.join(",")}if(i[m]!==void 0)a[f]=i[m];else{const g=Object.keys(i).length;i[m]=g,a[f]=g,l.push(f)}}const h=o.slice();h[1]=Object.keys(i).length;const d=new ve(h,s);l.forEach((f,m)=>{for(let g=0;g<o[0];g++)for(let x=0;x<o[2];x++)d.set(c.get(g,f,x),g,m,x)});const p=e.slice();return p[r]=h[1],{outputValues:d.values,outputShape:p,indices:a}}const HD=Object.freeze(Object.defineProperty({__proto__:null,addImpl:n1,bincountImpl:yp,bincountReduceImpl:s1,castImpl:e1,ceilImpl:r1,concatImpl:o1,equalImpl:i1,expImpl:c1,expm1Impl:u1,floorImpl:h1,gatherNdImpl:d1,gatherV2Impl:p1,greaterEqualImpl:m1,greaterImpl:f1,lessEqualImpl:x1,lessImpl:g1,linSpaceImpl:b1,logImpl:y1,maxImpl:w1,maximumImpl:I1,minimumImpl:v1,multiplyImpl:wp,negImpl:C1,notEqualImpl:k1,prodImpl:$1,raggedGatherImpl:S1,raggedTensorToTensorImpl:N1,rangeImpl:T1,rsqrtImpl:E1,scatterImpl:gr,sigmoidImpl:FD,simpleAbsImpl:t1,sliceImpl:D1,sparseFillEmptyRowsImpl:A1,sparseReshapeImpl:F1,sparseSegmentReductionImpl:vp,sqrtImpl:MD,squaredDifferenceImpl:O1,stridedSliceImpl:_1,stringNGramsImpl:M1,stringSplitImpl:L1,stringToHashBucketFastImpl:P1,subImpl:B1,tileImpl:z1,topKImpl:W1,transposeImpl:Ip,uniqueImpl:U1},Symbol.toStringTag,{value:"Module"}));Ag("cpu",()=>new $l,1);const G1=Dt(Go,n=>n>=0?n:Math.exp(n)-1),qD={kernelName:Go,backendName:"cpu",kernelFunc:G1};function H1(n){const{inputs:t,backend:e,attrs:s}=n,{x:r}=t,{alpha:o}=s;rt([r],"leakyRelu");const i=q(r.shape),a=e.data.get(r.dataId).values,c=be("float32",i);for(let l=0;l<a.length;l++)c[l]=a[l]<0?o*a[l]:a[l];return e.makeTensorInfo(r.shape,"float32",c)}const KD={kernelName:wc,backendName:"cpu",kernelFunc:H1};const jD=se((n,t)=>n<0?t*n:n);function q1(n){const{inputs:t,backend:e}=n,{x:s,alpha:r}=t;rt([s,r],"prelu");const o=e.data.get(s.dataId).values,i=e.data.get(r.dataId).values,[a,c]=jD(s.shape,r.shape,o,i,"float32");return e.makeTensorInfo(c,"float32",a)}const XD={kernelName:Bc,backendName:"cpu",kernelFunc:q1};const K1=Dt(li,n=>Math.max(0,n)),YD={kernelName:li,backendName:"cpu",kernelFunc:K1};const j1=Dt(ui,n=>Math.min(Math.max(0,n),6)),ZD={kernelName:ui,backendName:"cpu",kernelFunc:j1};function Ka(n,t,e,s,r){if(e==="linear")return Pn({inputs:{x:t},backend:n});if(e==="relu")return K1({inputs:{x:t},backend:n});if(e==="elu")return G1({inputs:{x:t},backend:n});if(e==="relu6")return j1({inputs:{x:t},backend:n});if(e==="prelu")return q1({inputs:{x:t,alpha:s},backend:n});if(e==="leakyrelu")return H1({inputs:{x:t},backend:n,attrs:{alpha:r}});if(e==="sigmoid")return R1({inputs:{x:t},backend:n});throw new Error(`Activation ${e} has not been implemented for the CPU backend.`)}function Pt(n){const{inputs:t,backend:e,attrs:s}=n,{x:r}=t,{shape:o}=s,i=q(r.shape),a=zm(o,i),c=q(a);S(i===c,()=>`The new shape (${a}) has ${c} elements and the old shape (${r.shape}) has ${i} elements. The new shape and old shape must have the same number of elements.`),e.incRef(r.dataId);const l=e.data.get(r.dataId);if(l.complexTensorInfos!=null){const u=l.complexTensorInfos.real,h=l.complexTensorInfos.imag;u.shape=a,h.shape=a}return{dataId:r.dataId,shape:a,dtype:r.dtype}}const JD={kernelName:Vc,backendName:"cpu",kernelFunc:Pt};function X1(n){const{inputs:t,backend:e,attrs:s}=n,{a:r,b:o}=t,{transposeA:i,transposeB:a}=s;rt([r,o],"matMul");const c=r.shape.length,l=o.shape.length,u=i?r.shape[c-2]:r.shape[c-1],h=a?o.shape[l-1]:o.shape[l-2],d=i?r.shape[c-1]:r.shape[c-2],p=a?o.shape[l-2]:o.shape[l-1],f=r.shape.slice(0,-2),m=o.shape.slice(0,-2),g=q(f),x=q(m),w=mt(r.shape.slice(0,-2),o.shape.slice(0,-2)).concat([d,p]);S(u===h,()=>`Error in matMul: inner shapes (${u}) and (${h}) of Tensors with shapes ${r.shape} and ${o.shape} and transposeA=${i} and transposeB=${a} must match.`);const y=i?[g,u,d]:[g,d,u],I=a?[x,p,h]:[x,h,p],C=Pt({inputs:{x:r},backend:e,attrs:{shape:y}}),N=Pt({inputs:{x:o},backend:e,attrs:{shape:I}}),T=i?C.shape[1]:C.shape[2],$=i?C.shape[2]:C.shape[1],k=a?N.shape[1]:N.shape[2],v=Math.max(g,x),R=e.data.get(C.dataId).values,_=e.data.get(N.dataId).values,P=ht(C.shape),L=ht(N.shape),[B,U,V]=i?[P[0],1,P[1]]:[P[0],P[1],1],[H,K,j]=a?[1,L[1],L[0]]:[L[1],1,L[0]],Y=$*k,Z=yt([v,$,k],C.dtype),tt=Z.values,Q=e.blockSize;for(let st=0;st<v;st++)for(let ct=0;ct<$;ct+=Q)for(let dt=0;dt<k;dt+=Q)for(let pt=0;pt<T;pt+=Q){const xt=Math.min(ct+Q,$),vt=Math.min(dt+Q,k),Et=Math.min(pt+Q,T);for(let _t=ct;_t<xt;_t++)for(let zt=dt;zt<vt;zt++){let Wt=0;for(let At=pt;At<Et;At++){const jt=Math.min(st,g-1)*B,Xt=Math.min(st,x-1)*j,Bn=R[jt+_t*U+At*V],ge=_[At*H+zt*K+Xt];Wt+=Bn*ge}tt[st*Y+(_t*k+zt)]+=Wt}}return e.disposeIntermediateTensorInfo(C),e.disposeIntermediateTensorInfo(N),e.makeTensorInfo(w,Z.dtype,Z.values)}const QD={kernelName:oc,backendName:"cpu",kernelFunc:X1};function tA(n){const{inputs:t,backend:e,attrs:s}=n,{a:r,b:o,bias:i,preluActivationWeights:a}=t,{transposeA:c,transposeB:l,activation:u,leakyreluAlpha:h}=s;let d,p,f;const m=[];d=X1({inputs:{a:r,b:o},attrs:{transposeA:c,transposeB:l},backend:e}),i&&(p=Dr({inputs:{a:d,b:i},backend:e}),m.push(d),d=p),u&&(f=Ka(e,d,u,a,h),m.push(d),d=f);for(const x of m)e.disposeIntermediateTensorInfo(x);return d}const eA={kernelName:Sa,backendName:"cpu",kernelFunc:tA};const nA=Dt(Do,n=>Math.acos(n)),sA={kernelName:Do,backendName:"cpu",kernelFunc:nA};const rA=Dt(Ao,n=>Math.acosh(n)),oA={kernelName:Ao,backendName:"cpu",kernelFunc:rA};function iA(n){const{inputs:t,backend:e}=n,s=t;rt(t,"addN");const r=s.map(a=>e.data.get(a.dataId).values),o=yt(s[0].shape,s[0].dtype),i=o.values;for(let a=0;a<s.length;a++){const c=r[a];for(let l=0;l<i.length;l++)i[l]+=c[l]}return e.makeTensorInfo(o.shape,o.dtype,o.values)}const aA={kernelName:Ku,backendName:"cpu",kernelFunc:iA};function cA(n){const{inputs:t,backend:e,attrs:s}=n,{x:r}=t,{axis:o,keepDims:i}=s;rt(r,"all");const a=wt(o,r.shape);let c=a;const l=Kt(c,r.shape.length);let u=r;l!=null&&(u=Me({inputs:{x:r},backend:e,attrs:{perm:l}}),c=Qt(c.length,r.shape.length)),we("all",c,u.shape.length);const[h,d]=fe(u.shape,c),p=q(d),f=ke(q(h),u.dtype),m=e.data.get(u.dataId).values;for(let x=0;x<f.length;++x){const b=x*p;let w=m[b];for(let y=0;y<p;++y){const I=m[b+y];w=w&&I}f[x]=w}l!=null&&e.disposeIntermediateTensorInfo(u);const g=e.makeTensorInfo(h,u.dtype,f);if(i){const x=Jt(h,a),b=Pt({inputs:{x:g},backend:e,attrs:{shape:x}});return e.disposeIntermediateTensorInfo(g),b}return g}const lA={kernelName:ju,backendName:"cpu",kernelFunc:cA};function uA(n){const{inputs:t,backend:e,attrs:s}=n,{x:r}=t,{axis:o,keepDims:i}=s;rt(r,"any");const a=wt(o,r.shape);let c=a;const l=Kt(c,r.shape.length);let u=r;l!=null&&(u=Me({inputs:{x:r},backend:e,attrs:{perm:l}}),c=Qt(c.length,r.shape.length)),we("any",c,u.shape.length);const[h,d]=fe(u.shape,c),p=q(d),f=ke(q(h),u.dtype),m=e.data.get(u.dataId).values;for(let x=0;x<f.length;++x){const b=x*p;let w=m[b];for(let y=0;y<p;++y){const I=m[b+y];w=w||I}f[x]=w}l!=null&&e.disposeIntermediateTensorInfo(u);const g=e.makeTensorInfo(h,u.dtype,f);if(i){const x=Jt(h,a),b=Pt({inputs:{x:g},backend:e,attrs:{shape:x}});return e.disposeIntermediateTensorInfo(g),b}return g}const hA={kernelName:Xu,backendName:"cpu",kernelFunc:uA};function dA(n){const{inputs:t,backend:e,attrs:s}=n,{x:r}=t,{axis:o}=s;rt(r,"argMax");let i=wt(o,r.shape);const a=Kt(i,r.shape.length);let c=r;const l=[];a!=null&&(c=Me({inputs:{x:r},backend:e,attrs:{perm:a}}),l.push(c),i=Qt(i.length,c.shape.length)),i=[i[0]],we("argMax",i,c.shape.length);const[u,h]=fe(c.shape,i),d=q(u),p=ke(d,"int32"),f=q(h),m=e.data.get(c.dataId).values;for(let g=0;g<p.length;++g){const x=g*f;let b=m[x],w=0;for(let y=0;y<f;++y){const I=m[x+y];I>b&&(b=I,w=y)}p[g]=w}return l.forEach(g=>e.disposeIntermediateTensorInfo(g)),e.makeTensorInfo(u,"int32",p)}const pA={kernelName:ec,backendName:"cpu",kernelFunc:dA};function fA(n){const{inputs:t,backend:e,attrs:s}=n,{x:r}=t,{axis:o}=s;rt(r,"argMin");let i=wt(o,r.shape);const a=Kt(i,r.shape.length);let c=r;const l=[];a!=null&&(c=Me({inputs:{x:r},backend:e,attrs:{perm:a}}),l.push(c),i=Qt(i.length,c.shape.length)),i=[i[0]],we("argMin",i,c.shape.length);const[u,h]=fe(c.shape,i),d=q(u),p=ke(d,"int32"),f=q(h),m=e.data.get(c.dataId).values;for(let g=0;g<p.length;++g){const x=g*f;let b=m[x],w=0;for(let y=0;y<f;++y){const I=m[x+y];I<b&&(b=I,w=y)}p[g]=w}return l.forEach(g=>e.disposeIntermediateTensorInfo(g)),e.makeTensorInfo(u,"int32",p)}const mA={kernelName:nc,backendName:"cpu",kernelFunc:fA};const gA=Dt(Fo,n=>Math.asin(n)),xA={kernelName:Fo,backendName:"cpu",kernelFunc:gA};const bA=Dt(Oo,n=>Math.asinh(n)),yA={kernelName:Oo,backendName:"cpu",kernelFunc:bA};const wA=Dt(_o,n=>Math.atan(n)),IA={kernelName:_o,backendName:"cpu",kernelFunc:wA};const vA=se((n,t)=>Math.atan2(n,t)),CA=me(Lo,vA),kA={kernelName:Lo,backendName:"cpu",kernelFunc:CA};const $A=Dt(Mo,n=>Math.atanh(n)),SA={kernelName:Mo,backendName:"cpu",kernelFunc:$A};function kp(n,t,e,s,r,o){const i=r.strideHeight,a=r.strideWidth,c=r.dilationHeight,l=r.dilationWidth,u=r.effectiveFilterHeight,h=r.effectiveFilterWidth,d=r.padInfo.top,p=r.padInfo.left,f=o==="max"?Number.NEGATIVE_INFINITY:Number.POSITIVE_INFINITY,m=yt(r.outShape,e),g=m.values,x=r.outShape[1]*r.outShape[2]*r.outShape[3],b=r.outShape[2]*r.outShape[3],w=r.outShape[3];for(let y=0;y<r.batchSize;++y){const I=y*x,C=y*s[0];for(let N=0;N<r.inChannels;++N)for(let T=0;T<r.outHeight;++T){const $=T*i-d,k=Math.max(0,$),v=Math.min(r.inHeight,u+$),R=I+T*b;for(let _=0;_<r.outWidth;++_){const P=_*a-p,L=Math.max(0,P),B=Math.min(r.inWidth,h+P);let U=f,V=0,H=0;for(let j=k;j<v;j+=c){const Y=C+j*s[1];for(let Z=L;Z<B;Z+=l){const tt=Y+Z*s[2],Q=n[tt+N];o==="max"&&Q>U?U=Q:o==="avg"&&(V+=Q,H++)}if(isNaN(U))break}const K=R+_*w+N;g[K]=o==="avg"?V/H:U}}}return m}function Y1(n,t,e,s,r=!1,o=!1){const i=yt(s.outShape,"int32"),a=s.strideHeight,c=s.strideWidth,l=s.dilationHeight,u=s.dilationWidth,h=s.effectiveFilterHeight,d=s.effectiveFilterWidth,p=s.padInfo.top,f=s.padInfo.left,m=yt(t,e,n);for(let g=0;g<s.batchSize;++g)for(let x=0;x<s.inChannels;++x)for(let b=0;b<s.outHeight;++b){const w=b*a-p;let y=w;for(;y<0;)y+=l;const I=Math.min(s.inHeight,h+w);for(let C=0;C<s.outWidth;++C){const N=C*c-f;let T=N;for(;T<0;)T+=u;const $=Math.min(s.inWidth,d+N);let k=Number.NEGATIVE_INFINITY,v=-1;for(let R=y;R<I;R+=l){const _=R-w;for(let P=T;P<$;P+=u){const L=P-N,B=m.get(g,R,P,x);B>k&&(k=B,r?v=o?((g*s.inHeight+R)*s.inWidth+P)*s.inChannels+x:(R*s.inWidth+P)*s.inChannels+x:v=_*d+L)}}i.set(v,g,b,C,x)}}return i}function Z1(n,t,e,s,r,o){const i=r.strideDepth,a=r.strideHeight,c=r.strideWidth,l=r.dilationDepth,u=r.dilationHeight,h=r.dilationWidth,d=r.effectiveFilterDepth,p=r.effectiveFilterHeight,f=r.effectiveFilterWidth,m=r.padInfo.front,g=r.padInfo.top,x=r.padInfo.left,b=o==="max"?Number.NEGATIVE_INFINITY:Number.POSITIVE_INFINITY,w=yt(r.outShape,e),y=w.values,I=r.outShape[1]*r.outShape[2]*r.outShape[3]*r.outShape[4],C=r.outShape[2]*r.outShape[3]*r.outShape[4],N=r.outShape[3]*r.outShape[4],T=r.outShape[4];for(let $=0;$<r.batchSize;++$){const k=$*I,v=$*s[0];for(let R=0;R<r.inChannels;++R)for(let _=0;_<r.outDepth;++_){const P=_*i-m;let L=P;for(;L<0;)L+=l;const B=Math.min(r.inDepth,d+P),U=k+_*C;for(let V=0;V<r.outHeight;++V){const H=V*a-g;let K=H;for(;K<0;)K+=u;const j=Math.min(r.inHeight,p+H),Y=U+V*N;for(let Z=0;Z<r.outWidth;++Z){const tt=Z*c-x;let Q=tt;for(;Q<0;)Q+=h;const st=Math.min(r.inWidth,f+tt),ct=Y+Z*T;let dt=b,pt=0,xt=0;for(let Et=L;Et<B;Et+=l){const _t=v+Et*s[1];for(let zt=K;zt<j;zt+=u){const Wt=_t+zt*s[2];for(let At=Q;At<st;At+=h){const jt=Wt+At*s[3],Xt=n[jt+R];if(o==="max"&&Xt>dt?dt=Xt:o==="avg"&&(pt+=Xt,xt++),isNaN(dt))break}if(isNaN(dt))break}if(isNaN(dt))break}const vt=ct+R;y[vt]=o==="avg"?pt/xt:dt}}}}return w}function NA(n,t){const e=yt(t.outShape,"int32"),s=t.strideDepth,r=t.strideHeight,o=t.strideWidth,i=t.dilationDepth,a=t.dilationHeight,c=t.dilationWidth,l=t.effectiveFilterDepth,u=t.effectiveFilterHeight,h=t.effectiveFilterWidth,d=t.padInfo.front,p=t.padInfo.top,f=t.padInfo.left;for(let m=0;m<t.batchSize;++m)for(let g=0;g<t.inChannels;++g)for(let x=0;x<t.outDepth;++x){const b=x*s-d;let w=b;for(;w<0;)w+=i;const y=Math.min(t.inDepth,l+b);for(let I=0;I<t.outHeight;++I){const C=I*r-p;let N=C;for(;N<0;)N+=a;const T=Math.min(t.inHeight,u+C);for(let $=0;$<t.outWidth;++$){const k=$*o-f;let v=k;for(;v<0;)v+=c;const R=Math.min(t.inWidth,h+k);let _=Number.NEGATIVE_INFINITY,P=-1;for(let L=w;L<y;L+=i){const B=L-b;for(let U=N;U<T;U+=a){const V=U-C;for(let H=v;H<R;H+=c){const K=H-k,j=n.get(m,L,U,H,g);j>=_&&(_=j,P=B*u*h+V*u+K)}}}e.set(P,m,x,I,$,g)}}}return e}function TA(n){const{inputs:t,backend:e,attrs:s}=n,{x:r}=t;rt(r,"avgPool");const{filterSize:o,strides:i,pad:a,dimRoundingMode:c}=s,l=1;S($e(i,l),()=>`Error in avgPool: Either strides or dilations must be 1. Got strides ${i} and dilations '${l}'`);const u=hn(r.shape,o,i,l,a,c);let h;if(u.filterWidth===1&&u.filterHeight===1&&Tt(u.inShape,u.outShape))h=Pn({inputs:{x:r},backend:e});else{const d=e.data.get(r.dataId).values,p=ht(r.shape),f=kp(d,r.shape,r.dtype,p,u,"avg");h=e.makeTensorInfo(u.outShape,r.dtype,f.values)}return h}const EA={kernelName:sc,backendName:"cpu",kernelFunc:TA};function RA(n){const{inputs:t,backend:e,attrs:s}=n,{x:r}=t,{filterSize:o,strides:i,pad:a,dimRoundingMode:c,dataFormat:l}=s;rt(r,"avgPool3d");const u=jn(r.shape,o,i,1,a,c,l),h=e.data.get(r.dataId).values,d=Z1(h,r.shape,r.dtype,ht(r.shape),u,"avg");return e.makeTensorInfo(d.shape,"float32",d.values)}const DA={kernelName:rc,backendName:"cpu",kernelFunc:RA};function AA(n){const{inputs:t,backend:e,attrs:s}=n,{dy:r,input:o}=t,{filterSize:i,strides:a,pad:c,dimRoundingMode:l}=s;rt([r,o],"avgPool3DGrad");const u=jn(o.shape,i,a,1,c,l),h=u.strideDepth,d=u.strideHeight,p=u.strideWidth,f=u.filterDepth,m=u.filterHeight,g=u.filterWidth,x=u.dilationDepth,b=u.dilationHeight,w=u.dilationWidth,y=u.effectiveFilterDepth,I=u.effectiveFilterHeight,C=u.effectiveFilterWidth,N=y-1-u.padInfo.front,T=C-1-u.padInfo.left,$=I-1-u.padInfo.top,k=yt(o.shape,"float32"),v=1/(f*m*g),R=e.bufferSync(r);for(let _=0;_<u.batchSize;++_)for(let P=0;P<u.inChannels;++P)for(let L=0;L<u.inDepth;++L)for(let B=0;B<u.inHeight;++B)for(let U=0;U<u.inWidth;++U){const V=L-N,H=B-$,K=U-T;let j=0;for(let Y=0;Y<y;Y+=x){const Z=(V+Y)/h;if(!(Z<0||Z>=u.outDepth||Math.floor(Z)!==Z))for(let tt=0;tt<I;tt+=b){const Q=(H+tt)/d;if(!(Q<0||Q>=u.outHeight||Math.floor(Q)!==Q))for(let st=0;st<C;st+=w){const ct=(K+st)/p;if(ct<0||ct>=u.outWidth||Math.floor(ct)!==ct)continue;const dt=R.get(_,Z,Q,ct,P);j+=dt}}}k.set(j*v,_,L,B,U,P)}return e.makeTensorInfo(k.shape,k.dtype,k.values)}const FA={kernelName:Zu,backendName:"cpu",kernelFunc:AA};function OA(n){const{inputs:t,backend:e,attrs:s}=n,{dy:r,input:o}=t,i=o;rt([r,o],"avgPoolGrad");const{filterSize:a,strides:c,pad:l}=s,u=hn(i.shape,a,c,1,l),h=u.strideHeight,d=u.strideWidth,p=u.filterHeight,f=u.filterWidth,m=u.dilationHeight,g=u.dilationWidth,x=u.effectiveFilterHeight,b=u.effectiveFilterWidth,w=b-1-u.padInfo.left,y=x-1-u.padInfo.top,I=yt(i.shape,"float32"),C=1/(p*f),N=e.data.get(r.dataId).values,T=yt(r.shape,"float32",N);for(let $=0;$<u.batchSize;++$)for(let k=0;k<u.inChannels;++k)for(let v=0;v<u.inHeight;++v)for(let R=0;R<u.inWidth;++R){const _=v-y,P=R-w;let L=0;for(let B=0;B<x;B+=m){const U=(_+B)/h;if(!(U<0||U>=u.outHeight||Math.floor(U)!==U))for(let V=0;V<b;V+=g){const H=(P+V)/d;if(H<0||H>=u.outWidth||Math.floor(H)!==H)continue;const K=T.get($,U,H,k);L+=K}}I.set(L*C,$,v,R,k)}return e.makeTensorInfo(I.shape,I.dtype,I.values)}const _A={kernelName:Yu,backendName:"cpu",kernelFunc:OA};function MA(n){const{inputs:t,backend:e,attrs:s}=n,{x:r,scale:o,offset:i,mean:a,variance:c}=t;S(a.shape.length===c.shape.length,()=>"Batch normalization gradient requires mean and variance to have equal ranks."),S(i==null||a.shape.length===i.shape.length,()=>"Batch normalization gradient requires mean and offset to have equal ranks."),S(o==null||a.shape.length===o.shape.length,()=>"Batch normalization gradient requires mean and scale to have equal ranks."),rt([r,a,c,o,i],"batchNorm");let{varianceEpsilon:l}=s;l==null&&(l=.001);const u=e.data.get(r.dataId).values,h=e.data.get(a.dataId).values,d=e.data.get(c.dataId).values,p=o?e.data.get(o.dataId).values:new Float32Array([1]),f=i?e.data.get(i.dataId).values:new Float32Array([0]),m=new Float32Array(u.length),g=f.length,x=p.length,b=d.length,w=h.length;let y=0,I=0,C=0,N=0;for(let T=0;T<u.length;++T)m[T]=f[y++]+(u[T]-h[I++])*p[C++]/Math.sqrt(d[N++]+l),y>=g&&(y=0),I>=w&&(I=0),C>=x&&(C=0),N>=b&&(N=0);return e.makeTensorInfo(r.shape,r.dtype,m)}const LA={kernelName:xc,backendName:"cpu",kernelFunc:MA};function PA(n){const{inputs:t,backend:e,attrs:s}=n,{x:r}=t,{blockShape:o,crops:i}=s;rt([r],"batchToSpaceND");const a=o.reduce((x,b)=>x*b),c=Ai(r.shape,o,a),l=Fi(c.length,o.length),u=Oi(r.shape,o,a),h=Fd(i,o.length),d=Od(u,i,o.length),p=Pt({inputs:{x:r},backend:e,attrs:{shape:c}}),f=Me({inputs:{x:p},backend:e,attrs:{perm:l}}),m=Pt({inputs:{x:f},backend:e,attrs:{shape:u}}),g=nr({inputs:{x:m},backend:e,attrs:{begin:h,size:d}});return e.disposeIntermediateTensorInfo(p),e.disposeIntermediateTensorInfo(f),e.disposeIntermediateTensorInfo(m),g}const BA={kernelName:ic,backendName:"cpu",kernelFunc:PA};function zA(n){const{inputs:t,backend:e,attrs:s}=n,{x:r,weights:o}=t,{size:i}=s,a=e.data.get(r.dataId).values,c=e.data.get(o.dataId).values,l=yp(a,c,o.dtype,o.shape,i);return e.makeTensorInfo([i],o.dtype,l)}const VA={kernelName:Ju,backendName:"cpu",kernelFunc:zA};function WA(n){const{inputs:t,backend:e}=n,{s0:s,s1:r}=t,o=e.data.get(s.dataId).values,i=e.data.get(r.dataId).values,a=mt(Array.from(o),Array.from(i));return e.makeTensorInfo([a.length],"int32",Int32Array.from(a))}const UA={kernelName:jm,backendName:"cpu",kernelFunc:WA};const GA=Dt(zo,(n,t)=>{const e=t;return n>e.clipValueMax?e.clipValueMax:n<e.clipValueMin?e.clipValueMin:n}),HA={kernelName:zo,backendName:"cpu",kernelFunc:GA};const qA=n=>{const{x:t}=n.inputs,e=n.backend,s=new Float32Array(q(t.shape)),r=e.data.get(t.dataId),o=r.complexTensorInfos.real,i=r.complexTensorInfos.imag,a=e.data.get(o.dataId).values,c=e.data.get(i.dataId).values;for(let l=0;l<a.length;l++){const u=a[l],h=c[l];s[l]=Math.hypot(u,h)}return e.makeOutput(s,t.shape,"float32")},KA={kernelName:ac,backendName:"cpu",kernelFunc:qA};function Ar(n){const{inputs:t,backend:e}=n,{input:s}=t,r=e.data.get(s.dataId).complexTensorInfos.imag,o=e.data.get(r.dataId).values;return e.makeTensorInfo(r.shape,r.dtype,o)}const jA={kernelName:ph,backendName:"cpu",kernelFunc:Ar};function Fr(n){const{inputs:t,backend:e,attrs:s}=n,{axis:r}=s,o=wt(r,t[0].shape)[0],i=t.map(m=>m.shape);Rd(i,o);let a=Fn(t.map(m=>m.shape),o);if(q(a)===0)return e.makeTensorInfo(a,t[0].dtype,[]);const c=t.filter(m=>q(m.shape)>0);if(c.length===1)return Pn({inputs:{x:c[0]},backend:e});if(c[0].dtype==="complex64"){const m=c.map(y=>er({inputs:{input:y},backend:e})),g=c.map(y=>Ar({inputs:{input:y},backend:e})),x=Fr({inputs:m,backend:e,attrs:{axis:o}}),b=Fr({inputs:g,backend:e,attrs:{axis:o}}),w=Be({inputs:{real:x,imag:b},backend:e});return m.forEach(y=>e.disposeIntermediateTensorInfo(y)),g.forEach(y=>e.disposeIntermediateTensorInfo(y)),e.disposeIntermediateTensorInfo(x),e.disposeIntermediateTensorInfo(b),w}const l=c.map(m=>{const x=[-1,q(m.shape.slice(o))];return Pt({inputs:{x:m},backend:e,attrs:{shape:x}})}),u=l.map(m=>({vals:e.data.get(m.dataId).values,shape:m.shape}));a=Fn(l.map(m=>m.shape),1);const h=l[0].shape[0]===1,d=o1(u,a,t[0].dtype,h),p=Fn(c.map(m=>m.shape),o),f=e.makeTensorInfo(p,t[0].dtype,d);return l.forEach(m=>e.disposeIntermediateTensorInfo(m)),f}const XA={kernelName:cc,backendName:"cpu",kernelFunc:Fr};function J1(n){const{inputs:t,backend:e,attrs:s}=n,{x:r,filter:o}=t,{strides:i,pad:a,dataFormat:c,dilations:l,dimRoundingMode:u}=s;rt([r,o],"conv2d");const h=Xn(c),d=ye(r.shape,o.shape,i,l,a,u,!1,h),p=d.filterHeight,f=d.filterWidth,m=d.dilationHeight,g=d.dilationWidth,x=d.padInfo.left,b=d.padInfo.top,w=d.dataFormat==="channelsLast",y=new ve(d.outShape,r.dtype),I=ht(r.shape),C=ht(o.shape),N=I[0],T=w?I[1]:I[2],$=w?I[2]:1,k=w?1:I[1],v=y.strides[0],R=w?y.strides[1]:y.strides[2],_=w?y.strides[2]:1,P=w?1:y.strides[1],L=e.data.get(r.dataId).values,B=e.data.get(o.dataId).values,U=y.values;for(let V=0;V<d.batchSize;++V){const H=V*N,K=V*v;for(let j=0;j<d.outHeight;++j){const Y=K+j*R,Z=j*d.strideHeight-b;for(let tt=0;tt<p;++tt){const Q=Z+tt*m;if(Q<0||Q>=d.inHeight)continue;const st=tt*C[0],ct=H+Q*T;for(let dt=0;dt<d.outWidth;++dt){const pt=Y+dt*_,xt=dt*d.strideWidth-x;for(let vt=0;vt<f;++vt){const Et=xt+vt*g;if(Et<0||Et>=d.inWidth)continue;const _t=st+vt*C[1],zt=ct+Et*$;let Wt=_t;for(let At=0;At<d.inChannels;++At){const jt=L[zt+At*k];for(let Xt=0;Xt<d.outChannels;++Xt)U[pt+Xt*P]+=jt*B[Wt+Xt];Wt+=d.outChannels}}}}}}return e.makeTensorInfo(y.shape,y.dtype,U)}const YA={kernelName:lc,backendName:"cpu",kernelFunc:J1};function ZA(n){const{inputs:t,backend:e,attrs:s}=n,{x:r,dy:o}=t,{strides:i,pad:a,dataFormat:c,dimRoundingMode:l,filterShape:u}=s;rt([r,o],"conv2dBackpropFilter");const h=Xn(c),d=ye(r.shape,u,i,1,a,l,!1,h),{strideHeight:p,strideWidth:f,filterHeight:m,filterWidth:g}=d,x=d.dataFormat==="channelsLast",b=new ve(d.filterShape,"float32"),w=d.padInfo.left,y=d.padInfo.top,I=e.data.get(r.dataId).values,C=e.data.get(o.dataId).values,N=new ve(r.shape,r.dtype,I),T=new ve(o.shape,o.dtype,C);for(let $=0;$<m;++$){const k=Math.max(0,Math.ceil((y-$)/p)),v=Math.min(d.outHeight,(d.inHeight+y-$)/p);for(let R=0;R<g;++R){const _=Math.max(0,Math.ceil((w-R)/f)),P=Math.min(d.outWidth,(d.inWidth+w-R)/f);for(let L=0;L<d.inChannels;++L)for(let B=0;B<d.outChannels;++B){let U=0;for(let V=0;V<d.batchSize;++V)for(let H=k;H<v;++H){const K=$+H*p-y;for(let j=_;j<P;++j){const Y=R+j*f-w;x?U+=N.get(V,K,Y,L)*T.get(V,H,j,B):U+=N.get(V,L,K,Y)*T.get(V,B,H,j)}}b.set(U,$,R,L,B)}}}return e.makeTensorInfo(b.shape,b.dtype,b.values)}const JA={kernelName:th,backendName:"cpu",kernelFunc:ZA};function QA(n){const{inputs:t,backend:e,attrs:s}=n,{dy:r,filter:o}=t,{inputShape:i,strides:a,pad:c,dataFormat:l,dimRoundingMode:u}=s;rt([r,o],"conv2dBackpropInput");const h=ht(o.shape),d=ht(r.shape);let p=Xn(l);const f=ye(i,o.shape,a,1,c,u,!1,p),m=new ve(f.inShape,"float32"),g=m.values,x=e.data.get(r.dataId).values,b=e.data.get(o.dataId).values,[w,y,I]=h,{batchSize:C,filterHeight:N,filterWidth:T,inChannels:$,inHeight:k,inWidth:v,outChannels:R,outHeight:_,outWidth:P,strideHeight:L,strideWidth:B}=f;p=f.dataFormat;const U=N-1-f.padInfo.top,V=T-1-f.padInfo.left,H=p==="channelsLast",K=m.strides[0],j=H?m.strides[1]:m.strides[2],Y=H?m.strides[2]:1,Z=H?1:m.strides[1],tt=d[0],Q=H?d[1]:d[2],st=H?d[2]:1,ct=H?1:d[1];for(let dt=0;dt<C;++dt)for(let pt=0;pt<$;++pt)for(let xt=0;xt<k;++xt){const vt=xt-U,Et=Math.max(0,Math.ceil(vt/L)),_t=Math.min(_,(N+vt)/L);for(let zt=0;zt<v;++zt){const Wt=zt-V,At=Math.max(0,Math.ceil(Wt/B)),jt=Math.min(P,(T+Wt)/B);let Xt=0;for(let ge=Et;ge<_t;++ge){const Qn=ge*L-vt;for(let qe=At;qe<jt;++qe){const Ss=qe*B-Wt,mn=tt*dt+Q*ge+st*qe,zn=w*(N-1-Qn)+y*(T-1-Ss)+I*pt;for(let ts=0;ts<R;++ts){const es=x[mn+ct*ts],ns=b[zn+ts];Xt+=es*ns}}}const Bn=K*dt+j*xt+Y*zt+Z*pt;g[Bn]=Xt}}return e.makeTensorInfo(m.shape,m.dtype,m.values)}const tF={kernelName:uc,backendName:"cpu",kernelFunc:QA};function eF(n){const{inputs:t,backend:e,attrs:s}=n,{x:r,filter:o}=t,{strides:i,pad:a,dilations:c}=s;rt([r,o],"conv3d");const l=bs(r.shape,o.shape,i,c,a),{filterDepth:u,filterHeight:h,filterWidth:d,dilationDepth:p,dilationHeight:f,dilationWidth:m,padInfo:g}=l,x=g.front,b=g.left,w=g.top,y=new ve(l.outShape,r.dtype),I=e.data.get(r.dataId).values,C=e.data.get(o.dataId).values,N=y.values,T=ht(r.shape),$=ht(o.shape);for(let k=0;k<l.batchSize;++k){const v=k*T[0],R=k*y.strides[0];for(let _=0;_<l.outDepth;++_){const P=R+_*y.strides[1],L=_*l.strideDepth-x;for(let B=0;B<u;++B){const U=L+B*p;if(U<0||U>=l.inDepth)continue;const V=B*$[0],H=v+U*T[1];for(let K=0;K<l.outHeight;++K){const j=P+K*y.strides[2],Y=K*l.strideHeight-w;for(let Z=0;Z<h;++Z){const tt=Y+Z*f;if(tt<0||tt>=l.inHeight)continue;const Q=V+Z*$[1],st=H+tt*T[2];for(let ct=0;ct<l.outWidth;++ct){const dt=j+ct*l.outChannels,pt=ct*l.strideWidth-b;for(let xt=0;xt<d;++xt){const vt=pt+xt*m;if(vt<0||vt>=l.inWidth)continue;const Et=Q+xt*$[2],_t=st+vt*l.inChannels;let zt=Et;for(let Wt=0;Wt<l.inChannels;++Wt){const At=I[_t+Wt];for(let jt=0;jt<l.outChannels;++jt)N[dt+jt]+=At*C[zt+jt];zt+=l.outChannels}}}}}}}}return e.makeTensorInfo(y.shape,y.dtype,y.values)}const nF={kernelName:hc,backendName:"cpu",kernelFunc:eF};function sF(n){const{inputs:t,backend:e,attrs:s}=n,{x:r,dy:o}=t,{strides:i,pad:a,filterShape:c}=s;rt([r,o],"conv3dBackpropFilterV2");const l=ht(r.shape),u=ht(o.shape),h=bs(r.shape,c,i,1,a),d=h.strideDepth,p=h.strideHeight,f=h.strideWidth,m=h.filterDepth,g=h.filterHeight,x=h.filterWidth,b=new ve(h.filterShape,"float32"),w=b.values,[y,I,C,N]=b.strides,T=e.data.get(o.dataId).values,[$,k,v,R]=u,_=e.data.get(r.dataId).values,[P,L,B,U]=l,V=h.padInfo.front,H=h.padInfo.left,K=h.padInfo.top;for(let j=0;j<m;++j){const Y=Math.max(0,Math.ceil((V-j)/d)),Z=Math.min(h.outDepth,(h.inDepth+V-j)/d),tt=j*y;for(let Q=0;Q<g;++Q){const st=Math.max(0,Math.ceil((K-Q)/p)),ct=Math.min(h.outHeight,(h.inHeight+K-Q)/p),dt=Q*I+tt;for(let pt=0;pt<x;++pt){const xt=Math.max(0,Math.ceil((H-pt)/f)),vt=Math.min(h.outWidth,(h.inWidth+H-pt)/f),Et=pt*C+dt;for(let _t=0;_t<h.inChannels;++_t){const zt=_t*N+Et;for(let Wt=0;Wt<h.outChannels;++Wt){let At=0;for(let jt=0;jt<h.batchSize;++jt){const Xt=jt*P,Bn=jt*$;for(let ge=Y;ge<Z;++ge){const qe=(j+ge*d-V)*L+Xt,Ss=ge*k+Bn;for(let mn=st;mn<ct;++mn){const ts=(Q+mn*p-K)*B+qe,es=mn*v+Ss;for(let ns=xt;ns<vt;++ns){const Al=(pt+ns*f-H)*U+ts,Fl=ns*R+es;At+=_[Al+_t]*T[Fl+Wt]}}}}w[zt+Wt]=At}}}}}return e.makeTensorInfo(b.shape,b.dtype,b.values)}const rF={kernelName:eh,backendName:"cpu",kernelFunc:sF};function oF(n){const{inputs:t,backend:e,attrs:s}=n,{dy:r,filter:o}=t,{pad:i,strides:a,inputShape:c}=s;rt([r],"conv3dBackpropInputV2");const l=ht(r.shape),u=ht(o.shape),h=bs(c,o.shape,a,1,i),d=new ve(h.inShape,"float32"),p=d.values,[f,m,g,x]=d.strides,b=e.data.get(r.dataId).values,[w,y,I,C]=l,N=e.data.get(o.dataId).values,[T,$,k,v]=u,{batchSize:R,filterDepth:_,filterHeight:P,filterWidth:L,inChannels:B,inDepth:U,inHeight:V,inWidth:H,outChannels:K,outDepth:j,outHeight:Y,outWidth:Z,strideDepth:tt,strideHeight:Q,strideWidth:st}=h,ct=_-1-h.padInfo.front,dt=P-1-h.padInfo.top,pt=L-1-h.padInfo.left;for(let xt=0;xt<R;++xt)for(let vt=0;vt<B;++vt)for(let Et=0;Et<U;++Et){const _t=Et-ct,zt=Math.max(0,Math.ceil(_t/tt)),Wt=Math.min(j,(_+_t)/tt);for(let At=0;At<V;++At){const jt=At-dt,Xt=Math.max(0,Math.ceil(jt/Q)),Bn=Math.min(Y,(P+jt)/Q);for(let ge=0;ge<H;++ge){const Qn=ge-pt,qe=Math.max(0,Math.ceil(Qn/st)),Ss=Math.min(Z,(L+Qn)/st);let mn=0;for(let zn=zt;zn<Wt;++zn){const ts=zn*tt-_t;for(let es=Xt;es<Bn;++es){const ns=es*Q-jt;for(let Qr=qe;Qr<Ss;++Qr){const Al=Qr*st-Qn,Fl=w*xt+y*zn+I*es+C*Qr,nw=T*(_-1-ts)+$*(P-1-ns)+k*(L-1-Al)+v*vt;for(let Ji=0;Ji<K;++Ji){const sw=b[Fl+Ji],rw=N[nw+Ji];mn+=sw*rw}}}}p[f*xt+m*Et+g*At+x*ge+vt]=mn}}}return e.makeTensorInfo(d.shape,d.dtype,d.values)}const iF={kernelName:nh,backendName:"cpu",kernelFunc:oF};const aF=Dt(Vo,n=>Math.cos(n)),cF={kernelName:Vo,backendName:"cpu",kernelFunc:aF};const lF=Dt(Wo,n=>Math.cosh(n)),uF={kernelName:Wo,backendName:"cpu",kernelFunc:lF};function hF(n){const{inputs:t,backend:e,attrs:s}=n,{image:r,boxes:o,boxInd:i}=t,{cropSize:a,method:c,extrapolationValue:l}=s,[u,h,d,p]=r.shape,f=o.shape[0],[m,g]=a,x=yt([f,m,g,p],"float32"),b=e.data.get(o.dataId).values,w=e.data.get(i.dataId).values,y=e.data.get(r.dataId).values,I=ht(r.shape),C=ht(x.shape);for(let N=0;N<f;N++){const T=N*4,$=b[T],k=b[T+1],v=b[T+2],R=b[T+3],_=w[N];if(_>=u)continue;const P=m>1?(v-$)*(h-1)/(m-1):0,L=g>1?(R-k)*(d-1)/(g-1):0;for(let B=0;B<m;B++){const U=m>1?$*(h-1)+B*P:.5*($+v)*(h-1);if(U<0||U>h-1){for(let V=0;V<g;V++)for(let H=0;H<p;H++){const K=H+V*C[2]+B*C[1]+N*C[0];x.values[K]=l}continue}if(c==="bilinear"){const V=Math.floor(U),H=Math.ceil(U),K=U-V;for(let j=0;j<g;j++){const Y=g>1?k*(d-1)+j*L:.5*(k+R)*(d-1);if(Y<0||Y>d-1){for(let st=0;st<p;st++){const ct=st+j*C[2]+B*C[1]+N*C[0];x.values[ct]=l}continue}const Z=Math.floor(Y),tt=Math.ceil(Y),Q=Y-Z;for(let st=0;st<p;st++){let ct=st+Z*I[2]+V*I[1]+_*I[0];const dt=y[ct];ct=st+tt*I[2]+V*I[1]+_*I[0];const pt=y[ct];ct=st+Z*I[2]+H*I[1]+_*I[0];const xt=y[ct];ct=st+tt*I[2]+H*I[1]+_*I[0];const vt=y[ct],Et=dt+(pt-dt)*Q,_t=xt+(vt-xt)*Q;ct=st+j*C[2]+B*C[1]+N*C[0],x.values[ct]=Et+(_t-Et)*K}}}else for(let V=0;V<g;++V){const H=g>1?k*(d-1)+V*L:.5*(k+R)*(d-1);if(H<0||H>d-1){for(let Y=0;Y<p;Y++){const Z=Y+V*C[2]+B*C[1]+N*C[0];x.values[Z]=l}continue}const K=Math.round(H),j=Math.round(U);for(let Y=0;Y<p;Y++){const Z=Y+K*I[2]+j*I[1]+_*I[0],tt=Y+V*C[2]+B*C[1]+N*C[0];x.values[tt]=y[Z]}}}}return e.makeTensorInfo(x.shape,x.dtype,x.values)}const dF={kernelName:rh,backendName:"cpu",kernelFunc:hF};function pF(n){const{inputs:t,backend:e,attrs:s}=n,{x:r}=t,{axis:o,exclusive:i,reverse:a}=s;rt(r,"cumprod");const c=Kt([o],r.shape.length);let l=r;c!=null&&(l=Me({inputs:{x:r},backend:e,attrs:{perm:c}}));const u=Qt(1,r.shape.length)[0];if(u!==l.shape.length-1)throw new Error(`backend.cumprod in CPU expects an inner-most axis=${l.shape.length-1} but got axis=${u}`);const h=Ve(l.dtype,"int32"),d=Hu(q(l.shape),h),p=e.data.get(l.dataId).values,f=l.shape[l.shape.length-1],m=a?(x,b)=>x+f-b-1:(x,b)=>x+b;for(let x=0;x<p.length;x+=f)for(let b=0;b<f;b++){const w=m(x,b);if(b===0)d[w]=i?1:p[w];else{const y=m(x,b-1);d[w]=i?p[y]*d[y]:p[w]*d[y]}}const g=e.makeTensorInfo(l.shape,h,d);if(c!=null){const x=ys(c),b=Me({inputs:{x:g},backend:e,attrs:{perm:x}});return e.disposeIntermediateTensorInfo(g),e.disposeIntermediateTensorInfo(l),b}return g}const fF={kernelName:sh,backendName:"cpu",kernelFunc:pF};function mF(n){const{inputs:t,backend:e,attrs:s}=n,{x:r}=t,{axis:o,exclusive:i,reverse:a}=s;rt(r,"cumsum");const c=Kt([o],r.shape.length);let l=r;c!=null&&(l=Me({inputs:{x:r},backend:e,attrs:{perm:c}}));const u=Qt(1,r.shape.length)[0];if(u!==l.shape.length-1)throw new Error(`backend.cumsum in CPU expects an inner-most axis=${l.shape.length-1} but got axis=${u}`);const h=Ve(l.dtype,"int32"),d=ke(q(l.shape),h),p=e.data.get(l.dataId).values,f=l.shape[l.shape.length-1],m=a?(x,b)=>x+f-b-1:(x,b)=>x+b;for(let x=0;x<p.length;x+=f)for(let b=0;b<f;b++){const w=m(x,b);if(b===0)d[w]=i?0:p[w];else{const y=m(x,b-1);d[w]=i?p[y]+d[y]:p[w]+d[y]}}const g=e.makeTensorInfo(l.shape,h,d);if(c!=null){const x=ys(c),b=Me({inputs:{x:g},backend:e,attrs:{perm:x}});return e.disposeIntermediateTensorInfo(g),e.disposeIntermediateTensorInfo(l),b}return g}const gF={kernelName:dc,backendName:"cpu",kernelFunc:mF};function xF(n){const{inputs:t,backend:e,attrs:s}=n,{x:r,weights:o}=t,{size:i,binaryOutput:a}=s;if(r.shape.length===1){const c=e.data.get(r.dataId).values,l=e.data.get(o.dataId).values,u=yp(c,l,o.dtype,o.shape,i);return e.makeTensorInfo([i],o.dtype,u)}else if(r.shape.length===2){const c=e.bufferSync(r),l=e.bufferSync(o),u=s1(c,l,i,a);return e.makeTensorInfo(u.shape,o.dtype,u.values)}throw new Error(`Error in denseBincount: input must be at most rank 2, but got rank${r.shape.length}.`)}const bF={kernelName:Xm,backendName:"cpu",kernelFunc:xF};function yF(n){const{inputs:t,backend:e,attrs:s}=n,{x:r}=t,{blockSize:o,dataFormat:i}=s;S(i==="NHWC",()=>`Only NHWC dataFormat supported on CPU for depthToSpace. Got ${i}`);const a=r.shape[0],c=r.shape[1],l=r.shape[2],u=r.shape[3],h=c*o,d=l*o,p=u/(o*o),f=e.data.get(r.dataId).values,m=new Float32Array(a*h*d*p);let g=0;for(let x=0;x<a;++x)for(let b=0;b<h;++b){const w=Math.floor(b/o),y=b%o;for(let I=0;I<d;++I){const C=Math.floor(I/o),N=I%o,T=(y*o+N)*p;for(let $=0;$<p;++$){const v=$+T+u*(C+l*(w+c*x));m[g++]=f[v]}}}return e.makeTensorInfo([a,h,d,p],r.dtype,m)}const wF={kernelName:oh,backendName:"cpu",kernelFunc:yF};function Q1(n){const{inputs:t,backend:e,attrs:s}=n,{x:r,filter:o}=t,{strides:i,pad:a,dilations:c,dimRoundingMode:l}=s;rt([r,o],"depthwiseConv2DNative");const u=ht(r.shape),h=ht(o.shape);let d=c;d==null&&(d=[1,1]),S($e(i,d),()=>`Error in depthwiseConv2d: Either strides or dilations must be 1. Got strides ${i} and dilations '${d}'`);const p=ye(r.shape,o.shape,i,d,a,l,!0),{filterHeight:f,filterWidth:m,dilationHeight:g,dilationWidth:x,padInfo:b}=p,w=b.left,y=b.top,I=p.outChannels/p.inChannels,C=new ve(p.outShape,r.dtype),N=e.data.get(r.dataId).values,T=e.data.get(o.dataId).values,$=C.values;for(let k=0;k<p.batchSize;++k){const v=k*u[0],R=k*C.strides[0];for(let _=0;_<p.outHeight;++_){const P=R+_*C.strides[1],L=_*p.strideHeight-y;for(let B=0;B<f;++B){const U=L+B*g;if(U<0||U>=p.inHeight)continue;const V=B*h[0],H=v+U*u[1];for(let K=0;K<p.outWidth;++K){const j=P+K*C.strides[2],Y=K*p.strideWidth-w;for(let Z=0;Z<m;++Z){const tt=Y+Z*x;if(tt<0||tt>=p.inWidth)continue;const Q=V+Z*h[1],st=H+tt*p.inChannels;let ct=j,dt=Q;for(let pt=0;pt<p.inChannels;++pt){const xt=N[st+pt];for(let vt=0;vt<I;++vt)$[ct+vt]+=xt*T[dt+vt];ct+=I,dt+=I}}}}}}return e.makeTensorInfo(C.shape,C.dtype,C.values)}const IF={kernelName:pc,backendName:"cpu",kernelFunc:Q1};function vF(n){const{inputs:t,backend:e,attrs:s}=n,{x:r,dy:o}=t,{strides:i,dilations:a,pad:c,dimRoundingMode:l,filterShape:u}=s;rt([r,o],"depthwiseConv2dNativeBackpropFilter");const h=ye(r.shape,u,i,a,c,l,!0),{strideHeight:d,strideWidth:p,filterHeight:f,filterWidth:m}=h,g=new ve(h.filterShape,"float32"),x=h.padInfo.left,b=h.padInfo.top,w=h.outChannels/h.inChannels,y=e.data.get(r.dataId).values,I=new ve(r.shape,r.dtype,y),C=e.data.get(o.dataId).values,N=new ve(o.shape,o.dtype,C);for(let T=0;T<f;++T){const $=Math.max(0,Math.ceil((b-T)/d)),k=Math.min(h.outHeight,(h.inHeight+b-T)/d);for(let v=0;v<m;++v){const R=Math.max(0,Math.ceil((x-v)/p)),_=Math.min(h.outWidth,(h.inWidth+x-v)/p);for(let P=0;P<h.outChannels;++P){const L=Math.trunc(P/w),B=P%w;let U=0;for(let V=0;V<h.batchSize;++V)for(let H=$;H<k;++H){const K=T+H*d-b;for(let j=R;j<_;++j){const Y=v+j*p-x;U+=I.get(V,K,Y,L)*N.get(V,H,j,P)}}g.set(U,T,v,L,B)}}}return e.makeTensorInfo(g.shape,g.dtype,g.values)}const CF={kernelName:ih,backendName:"cpu",kernelFunc:vF};function kF(n){const{inputs:t,backend:e,attrs:s}=n,{dy:r,filter:o}=t,{strides:i,dilations:a,pad:c,dimRoundingMode:l,inputShape:u}=s;rt([r,o],"depthwiseConv2DNativeBackpropInput");const h=ht(r.shape),d=ht(o.shape),p=ye(u,o.shape,i,a,c,l,!0),f=new ve(p.inShape,"float32"),m=f.values,[g,x,b]=f.strides,w=e.data.get(r.dataId).values,[y,I,C]=h,N=e.data.get(o.dataId).values,[T,$,k]=d,{batchSize:v,filterHeight:R,filterWidth:_,inChannels:P,inHeight:L,inWidth:B,outChannels:U,outHeight:V,outWidth:H,strideHeight:K,strideWidth:j}=p,Y=R-1-p.padInfo.top,Z=_-1-p.padInfo.left,tt=U/P;for(let Q=0;Q<v;++Q)for(let st=0;st<P;++st)for(let ct=0;ct<L;++ct){const dt=ct-Y,pt=Math.max(0,Math.ceil(dt/K)),xt=Math.min(V,(R+dt)/K);for(let vt=0;vt<B;++vt){const Et=vt-Z,_t=Math.max(0,Math.ceil(Et/j)),zt=Math.min(H,(_+Et)/j);let Wt=0;for(let At=pt;At<xt;++At){const jt=At*K-dt;for(let Xt=_t;Xt<zt;++Xt){const Bn=Xt*j-Et,ge=y*Q+I*At+C*Xt,Qn=T*(R-1-jt)+$*(_-1-Bn)+k*st;for(let qe=0;qe<tt;++qe){const Ss=st*tt+qe,mn=w[ge+Ss],zn=N[Qn+qe];Wt+=mn*zn}}}m[g*Q+x*ct+b*vt+st]=Wt}}return e.makeTensorInfo(f.shape,f.dtype,f.values)}const $F={kernelName:ah,backendName:"cpu",kernelFunc:kF};function SF(n){const{inputs:t,backend:e}=n,{x:s}=t,r=q(s.shape),o=e.data.get(s.dataId).values,i=yt([r,r],s.dtype),a=i.values;for(let l=0;l<o.length;l++)a[l*r+l]=o[l];const c=[...s.shape,...s.shape];return e.makeTensorInfo(c,i.dtype,i.values)}const NF={kernelName:Ym,backendName:"cpu",kernelFunc:SF};const TF={kernelName:fc,backendName:"cpu",kernelFunc:({inputs:n,backend:t,attrs:e})=>{const{x:s,filter:r}=n,{strides:o,pad:i,dilations:a}=e,c=t,l=c.data.get(s.dataId).values,u=s.shape.length,h=c.data.get(r.dataId).values,d=r.shape.length,{batchSize:p,inHeight:f,inWidth:m,inChannels:g,outHeight:x,outWidth:b,padInfo:w,strideHeight:y,strideWidth:I,filterHeight:C,filterWidth:N,dilationHeight:T,dilationWidth:$,outShape:k}=Ni(s.shape,r.shape,o,i,"NHWC",a),v=q(k),R=k.length,_=de(s.dtype,v);for(let L=0;L<p;++L)for(let B=0;B<x;++B){const U=B*y-w.top;for(let V=0;V<b;++V){const H=V*I-w.left;for(let K=0;K<g;++K){let j=Number.MIN_SAFE_INTEGER;for(let Z=0;Z<C;++Z){const tt=U+Z*T;if(tt>=0&&tt<f)for(let Q=0;Q<N;++Q){const st=H+Q*$;if(st>=0&&st<m){const ct=Dn([L,tt,st,K],u,ht(s.shape)),dt=Dn([Z,Q,K],d,ht(r.shape)),pt=l[ct]+h[dt];pt>j&&(j=pt)}}}const Y=Dn([L,B,V,K],R,ht(k));_[Y]=j}}}return{dataId:c.write(sr(_,s.dtype),k,s.dtype),shape:k,dtype:s.dtype}}};const EF={kernelName:lu,backendName:"cpu",kernelFunc:({inputs:n,backend:t,attrs:e})=>{const{x:s,filter:r,dy:o}=n,{strides:i,pad:a,dilations:c}=e,l=t,u=In(s.shape,l.data.get(s.dataId).values),h=In(r.shape,l.data.get(r.dataId).values),{batchSize:d,inHeight:p,inWidth:f,inChannels:m,outHeight:g,outWidth:x,padInfo:b,strideHeight:w,strideWidth:y,filterHeight:I,filterWidth:C,dilationHeight:N,dilationWidth:T,outShape:$}=Ni(s.shape,r.shape,i,a,"NHWC",c);S(o.rank===$.length,()=>`Error in ${lu}, dy must have the same rank as output ${$.length}, but got ${o.rank}`);const k=In($,l.data.get(o.dataId).values),v=Um(r.shape,r.dtype);for(let _=0;_<d;++_)for(let P=0;P<g;++P){const L=P*w-b.top;for(let B=0;B<x;++B){const U=B*y-b.left;for(let V=0;V<m;++V){let H=Number.MIN_SAFE_INTEGER,K=0,j=0;for(let Y=0;Y<I;++Y){const Z=L+Y*N;if(Z>=0&&Z<p)for(let tt=0;tt<C;++tt){const Q=U+tt*T;if(Q>=0&&Q<f){const st=u[_][Z][Q][V]+h[Y][tt][V];st>H&&(H=st,K=Y,j=tt)}}}v[K][j][V]+=k[_][P][B][V]}}}return{dataId:l.write(sr(v,s.dtype),r.shape,r.dtype),shape:r.shape,dtype:r.dtype}}};const RF={kernelName:cu,backendName:"cpu",kernelFunc:({inputs:n,backend:t,attrs:e})=>{const{x:s,filter:r,dy:o}=n,{strides:i,pad:a,dilations:c}=e,l=t,u=In(s.shape,l.data.get(s.dataId).values),h=In(r.shape,l.data.get(r.dataId).values),{batchSize:d,inHeight:p,inWidth:f,inChannels:m,outHeight:g,outWidth:x,padInfo:b,strideHeight:w,strideWidth:y,filterHeight:I,filterWidth:C,dilationHeight:N,dilationWidth:T,outShape:$}=Ni(s.shape,r.shape,i,a,"NHWC",c);S(o.rank===$.length,()=>`Error in ${cu}, dy must have the same rank as output ${$.length}, but got ${o.rank}`);const k=In($,l.data.get(o.dataId).values),v=Um(s.shape,s.dtype);for(let _=0;_<d;++_)for(let P=0;P<g;++P){const L=P*w-b.top;for(let B=0;B<x;++B){const U=B*y-b.left;for(let V=0;V<m;++V){let H=Number.MIN_SAFE_INTEGER,K=L<0?0:L,j=U<0?0:U;for(let Y=0;Y<I;++Y){const Z=L+Y*N;if(Z>=0&&Z<p)for(let tt=0;tt<C;++tt){const Q=U+tt*T;if(Q>=0&&Q<f){const st=u[_][Z][Q][V]+h[Y][tt][V];st>H&&(H=st,K=Z,j=Q)}}}v[_][K][j][V]+=k[_][P][B][V]}}}return{dataId:l.write(sr(v,s.dtype),s.shape,s.dtype),shape:s.shape,dtype:s.dtype}}};function Gi(n){const{inputs:t,backend:e,attrs:s}=n,{x:r}=t,{axis:o,keepDims:i}=s;rt(r,"sum");let a;r.dtype==="bool"?a=ms({inputs:{x:r},backend:e,attrs:{dtype:"int32"}}):a=Pn({inputs:{x:r},backend:e});const c=a.shape.length,l=wt(o,a.shape),u=Kt(l,c);let h=l,d=a;u!=null&&(d=Me({inputs:{x:a},backend:e,attrs:{perm:u}}),h=Qt(h.length,c)),we("sum",h,d.shape.length);const[p,f]=fe(d.shape,h),m=Ve(d.dtype,"int32");let g=Ha(e,p,m);const x=q(f),b=e.data.get(g.dataId).values,w=e.data.get(d.dataId).values;for(let y=0;y<b.length;++y){const I=y*x;let C=0;for(let N=0;N<x;++N)C+=w[I+N];b[y]=C}if(i){const y=Jt(g.shape,l),I=g;g=Pt({inputs:{x:g},backend:e,attrs:{shape:y}}),e.disposeIntermediateTensorInfo(I)}return e.disposeIntermediateTensorInfo(a),u!=null&&e.disposeIntermediateTensorInfo(d),g}const DF={kernelName:Kc,backendName:"cpu",kernelFunc:Gi};function AF(n){const{inputs:t,backend:e,attrs:s}=n,{equation:r}=s,o=t,{allDims:i,summedDims:a,idDims:c}=Wd(r,o.length);Gd(i.length,c,o);const{path:l,steps:u}=Hd(a,c),h=u.length;let d=null,p=i.length;const f=[];for(let m=0;m<h;++m){for(const g of u[m]){const{permutationIndices:x,expandDims:b}=Ud(p,c[g]);let w;qd(x)?w=o[g]:(w=Me({inputs:{x:o[g]},backend:e,attrs:{perm:x}}),f.push(w));const y=w.shape.slice();for(let I=0;I<b.length;++I)y.splice(b[I],0,1);Tt(w.shape,y)||(w=Pt({inputs:{x:w},backend:e,attrs:{shape:y}}),f.push(w)),d===null?d=w:(d=Sl({inputs:{a:w,b:d},backend:e}),f.push(d))}m<h-1&&(l[m]>=0&&(d=Gi({inputs:{x:d},backend:e,attrs:{axis:l[m]-(i.length-p),keepDims:!1}}),f.push(d)),p--)}for(const m of f)m!==d&&e.disposeIntermediateTensorInfo(m);return d}const FF={kernelName:Zm,backendName:"cpu",kernelFunc:AF};function OF(n){const{inputs:t,backend:e}=n,{dy:s,y:r}=t;rt([s,r],"eluGrad");const o=new Float32Array(q(r.shape)),i=e.data.get(r.dataId).values,a=e.data.get(s.dataId).values;for(let c=0;c<i.length;++c){const l=i[c];l>=1?o[c]=a[c]:o[c]=a[c]*(l+1)}return e.makeTensorInfo(r.shape,"float32",o)}const _F={kernelName:ch,backendName:"cpu",kernelFunc:OF};const MF=_d,LF=Md,PF=Ld,BF=Pd,zF=Bd,VF=zd,WF=Dt(Ho,n=>{const t=Math.sign(n),e=Math.abs(n),s=1/(1+MF*e);return t*(1-((((VF*s+zF)*s+BF)*s+PF)*s+LF)*s*Math.exp(-e*e))}),UF={kernelName:Ho,backendName:"cpu",kernelFunc:WF};function ja(n){const{inputs:t,backend:e,attrs:s}=n,{input:r}=t,{dim:o}=s,i=r.shape.length,a=r.shape.slice();let c=o;return o<0&&(S(-(i+1)<=o,()=>`Axis must be in the interval [${-(i+1)}, ${i}]`),c=i+o+1),a.splice(c,0,1),Pt({inputs:{x:r},backend:e,attrs:{shape:a}})}const GF={kernelName:gc,backendName:"cpu",kernelFunc:ja};const HF=se((n,t)=>n/t),$p=me(Uo,HF),Mu={kernelName:Uo,backendName:"cpu",kernelFunc:$p};function ty(n,t,e){const s=n.shape,r=s[0],o=s[1],i=e.data.get(n.dataId),a=i.complexTensorInfos.real,c=i.complexTensorInfos.imag,l=[r,o],u=q(l),h=be("float32",u),d=be("float32",u);for(let g=0;g<r;g++){const x=nr({inputs:{x:a},backend:e,attrs:{begin:[g,0],size:[1,o]}}),b=nr({inputs:{x:c},backend:e,attrs:{begin:[g,0],size:[1,o]}}),w=Be({inputs:{real:x,imag:b},backend:e}),{real:y,imag:I}=qF(w,t,e),C=Kn(y,I);for(let N=0;N<o;N++){const T=Vd(C,N);h[g*o+N]=T.real,d[g*o+N]=T.imag}e.disposeIntermediateTensorInfo(x),e.disposeIntermediateTensorInfo(b),e.disposeIntermediateTensorInfo(w)}const p=e.makeTensorInfo(l,"float32",h),f=e.makeTensorInfo(l,"float32",d),m=Be({inputs:{real:p,imag:f},backend:e});return e.disposeIntermediateTensorInfo(p),e.disposeIntermediateTensorInfo(f),m}function qF(n,t,e){const s=q(n.shape),r=e.data.get(n.dataId),o=e.data.get(r.complexTensorInfos.real.dataId).values,i=e.data.get(r.complexTensorInfos.imag.dataId).values;if(KF(s)){const a=Lu(o,i,s,t,e),c=[n.shape[0],n.shape[1]];if(t){const l=e.makeTensorInfo(c,"float32",a.real),u=e.makeTensorInfo(c,"float32",a.imag),h=e.makeTensorInfo([],"float32",xs(s,"float32")),d=Pn({inputs:{x:h},backend:e}),p=Mu.kernelFunc({inputs:{a:l,b:h},backend:e}),f=Mu.kernelFunc({inputs:{a:u,b:d},backend:e}),m=e.data.get(p.dataId).values,g=e.data.get(f.dataId).values;return e.disposeIntermediateTensorInfo(l),e.disposeIntermediateTensorInfo(u),e.disposeIntermediateTensorInfo(h),e.disposeIntermediateTensorInfo(d),e.disposeIntermediateTensorInfo(p),e.disposeIntermediateTensorInfo(f),{real:m,imag:g}}return a}else{const a=Kn(o,i),c=jF(a,s,t);return $x(c)}}function KF(n){return(n&n-1)===0}function Lu(n,t,e,s,r){if(e===1)return{real:n,imag:t};const o=Kn(n,t),i=e/2,a=Sx(o),c=a.real,l=a.imag,u=[c.length],h=r.makeTensorInfo(u,"float32",c),d=r.makeTensorInfo(u,"float32",l),p=Be({inputs:{real:h,imag:d},backend:r}),f=Nx(o),m=f.real,g=f.imag,x=[m.length],b=r.makeTensorInfo(x,"float32",m),w=r.makeTensorInfo(x,"float32",g),y=Be({inputs:{real:b,imag:w},backend:r}),I=Lu(c,l,i,s,r),C=I.real,N=I.imag,T=[C.length],$=r.makeTensorInfo(T,"float32",C),k=r.makeTensorInfo(T,"float32",N),v=Be({inputs:{real:$,imag:k},backend:r}),R=Lu(m,g,i,s,r),_=R.real,P=R.imag,L=[_.length],B=r.makeTensorInfo(L,"float32",_),U=r.makeTensorInfo(L,"float32",P),V=Be({inputs:{real:B,imag:U},backend:r}),H=Ex(e,s),K=[H.real.length],j=r.makeTensorInfo(K,"float32",H.real),Y=r.makeTensorInfo(K,"float32",H.imag),Z=Be({inputs:{real:j,imag:Y},backend:r}),tt=Sl({inputs:{a:Z,b:V},backend:r}),Q=Dr({inputs:{a:v,b:tt},backend:r}),st=Cp({inputs:{a:v,b:tt},backend:r}),ct=er({inputs:{input:Q},backend:r}),dt=er({inputs:{input:st},backend:r}),pt=Ar({inputs:{input:Q},backend:r}),xt=Ar({inputs:{input:st},backend:r}),vt=Fr({inputs:[ct,dt],backend:r,attrs:{axis:0}}),Et=Fr({inputs:[pt,xt],backend:r,attrs:{axis:0}}),_t=r.data.get(vt.dataId).values,zt=r.data.get(Et.dataId).values;return r.disposeIntermediateTensorInfo(h),r.disposeIntermediateTensorInfo(d),r.disposeIntermediateTensorInfo(p),r.disposeIntermediateTensorInfo(b),r.disposeIntermediateTensorInfo(w),r.disposeIntermediateTensorInfo(y),r.disposeIntermediateTensorInfo($),r.disposeIntermediateTensorInfo(k),r.disposeIntermediateTensorInfo(v),r.disposeIntermediateTensorInfo(B),r.disposeIntermediateTensorInfo(U),r.disposeIntermediateTensorInfo(V),r.disposeIntermediateTensorInfo(j),r.disposeIntermediateTensorInfo(Y),r.disposeIntermediateTensorInfo(Z),r.disposeIntermediateTensorInfo(tt),r.disposeIntermediateTensorInfo(Q),r.disposeIntermediateTensorInfo(st),r.disposeIntermediateTensorInfo(ct),r.disposeIntermediateTensorInfo(pt),r.disposeIntermediateTensorInfo(dt),r.disposeIntermediateTensorInfo(xt),r.disposeIntermediateTensorInfo(vt),r.disposeIntermediateTensorInfo(Et),{real:_t,imag:zt}}function jF(n,t,e){const s=new Float32Array(t*2);for(let r=0;r<t;r++){let o=0,i=0;for(let a=0;a<t;a++){const c=Rx(r*a,t,e),l=Vd(n,a);o+=l.real*c.real-l.imag*c.imag,i+=l.real*c.imag+l.imag*c.real}e&&(o/=t,i/=t),Tx(s,o,i,r)}return s}function XF(n){const{inputs:t,backend:e}=n,{input:s}=t,r=q(s.shape),o=s.shape[s.shape.length-1],i=r/o,a=Pt({inputs:{x:s},backend:e,attrs:{shape:[i,o]}}),c=ty(a,!1,e),l=Pt({inputs:{x:c},backend:e,attrs:{shape:s.shape}});return e.disposeIntermediateTensorInfo(a),e.disposeIntermediateTensorInfo(c),l}const YF={kernelName:lh,backendName:"cpu",kernelFunc:XF};function Sp(n){const{backend:t,attrs:e}=n,{shape:s,value:r,dtype:o}=e,i=o||Ro(r),a=de(i,q(s));return JF(a,r,i),t.makeTensorInfo(s,i,a)}const ZF={kernelName:uh,backendName:"cpu",kernelFunc:Sp};function JF(n,t,e){n.fill(t)}const QF={kernelName:hh,backendName:"cpu",kernelFunc:({inputs:n,attrs:t,backend:e})=>{const{image:s}=n,r=e,o=be(s.dtype,q(s.shape)),[i,a,c,l]=s.shape,u=r.data.get(s.dataId).values;for(let d=0;d<i;d++){const p=d*c*a*l;for(let f=0;f<a;f++){const m=f*(c*l);for(let g=0;g<c;g++){const x=g*l;for(let b=0;b<l;b++){const w=Math.round(c-g-1),y=p+m+x+b;let I=u[y];if(w>=0&&w<c){const C=w*l,N=p+m+C+b;I=u[N]}o[y]=I}}}}return{dataId:r.write(o,s.shape,s.dtype),shape:s.shape,dtype:s.dtype}}};const tO=se((n,t)=>Math.floor(n/t)),eO=me(Xo,tO,null,"int32"),nO={kernelName:Xo,backendName:"cpu",kernelFunc:eO};function sO(n){const{inputs:t,backend:e,attrs:s}=n,{x:r,filter:o,bias:i,preluActivationWeights:a}=t,{strides:c,pad:l,dataFormat:u,dilations:h,dimRoundingMode:d,activation:p,leakyreluAlpha:f}=s;let m=J1({inputs:{x:r,filter:o},backend:e,attrs:{strides:c,pad:l,dataFormat:u,dilations:h,dimRoundingMode:d}});if(i){const g=m;if(u==="NCHW"&&i.shape.length===1&&i.shape[0]!==1){const x=Pt({inputs:{x:i},backend:e,attrs:{shape:[i.shape[0],1,1]}});m=Dr({inputs:{a:m,b:x},backend:e}),e.disposeIntermediateTensorInfo(x)}else m=Dr({inputs:{a:m,b:i},backend:e});e.disposeIntermediateTensorInfo(g)}if(p){const g=m;if(u==="NCHW"&&p==="prelu"&&a.shape.length===1&&a.shape[0]!==1){const x=Pt({inputs:{x:a},backend:e,attrs:{shape:[a.shape[0],1,1]}});m=Ka(e,m,p,x,f),e.disposeIntermediateTensorInfo(x)}else m=Ka(e,m,p,a,f);e.disposeIntermediateTensorInfo(g)}return m}const rO={kernelName:Na,backendName:"cpu",kernelFunc:sO};function oO(n){const{inputs:t,backend:e,attrs:s}=n,{x:r,filter:o,bias:i,preluActivationWeights:a}=t,{strides:c,pad:l,dataFormat:u,dilations:h,dimRoundingMode:d,activation:p,leakyreluAlpha:f}=s;let m=Q1({inputs:{x:r,filter:o},backend:e,attrs:{strides:c,pad:l,dataFormat:u,dilations:h,dimRoundingMode:d}});if(i){const g=m;m=Dr({inputs:{a:m,b:i},backend:e}),e.disposeIntermediateTensorInfo(g)}if(p){const g=m;m=Ka(e,m,p,a,f),e.disposeIntermediateTensorInfo(g)}return m}const iO={kernelName:ag,backendName:"cpu",kernelFunc:oO};function aO(n){const{inputs:t,backend:e}=n,{params:s,indices:r}=t,o=q(s.shape),i=r.shape,a=i[i.length-1],[c,l,u,h]=zh(s,r);if(l===0)return e.makeTensorInfo(c,s.dtype,[]);const d=e.data.get(r.dataId).values,p=e.bufferSync(s),f=d1(d,p,s.dtype,l,a,u,h,s.shape,o);return e.makeTensorInfo(c,s.dtype,f.values)}const cO={kernelName:Jm,backendName:"cpu",kernelFunc:aO};function lO(n){const{inputs:t,backend:e,attrs:s}=n,{x:r,indices:o}=t,{axis:i,batchDims:a}=s;rt([r,o],"gatherV2");const c=wt(i,r.shape)[0],l=e.data.get(o.dataId).values,u=r.shape[c];for(let y=0;y<l.length;++y){const I=l[y];S(I<=u-1&&I>=0,()=>`GatherV2: the index value ${I} is not in [0, ${u-1}]`)}let h=a;a==null&&(h=0);const d=q(o.shape),p=jd(r,o,c,h),f=Pt({inputs:{x:r},backend:e,attrs:{shape:[p.batchSize,p.outerSize,p.dimSize,p.sliceSize]}}),m=Pt({inputs:{x:o},backend:e,attrs:{shape:[p.batchSize,d/p.batchSize]}}),g=[p.batchSize,p.outerSize,d/p.batchSize,p.sliceSize],x=e.bufferSync(m),b=e.bufferSync(f),w=p1(b,x,g);return e.disposeIntermediateTensorInfo(f),e.disposeIntermediateTensorInfo(m),e.makeTensorInfo(p.outputShape,w.dtype,w.values)}const uO={kernelName:bc,backendName:"cpu",kernelFunc:lO};function hO(n){const{inputs:t,backend:e}=n,{input:s}=t,r=q(s.shape),o=s.shape[s.shape.length-1],i=r/o,a=Pt({inputs:{x:s},backend:e,attrs:{shape:[i,o]}}),c=ty(a,!0,e),l=Pt({inputs:{x:c},backend:e,attrs:{shape:s.shape}});return e.disposeIntermediateTensorInfo(a),e.disposeIntermediateTensorInfo(c),l}const dO={kernelName:dh,backendName:"cpu",kernelFunc:hO};const pO=Dt(Jo,n=>Number.isFinite(n)?1:0,"bool"),fO={kernelName:Jo,backendName:"cpu",kernelFunc:pO};const mO=Dt(Qo,n=>Math.abs(n)===1/0?1:0,"bool"),gO={kernelName:Qo,backendName:"cpu",kernelFunc:mO};const xO=Dt(ti,n=>Number.isNaN(n)?1:0,"bool"),bO={kernelName:ti,backendName:"cpu",kernelFunc:xO};function yO(n){const{backend:t,attrs:e}=n,{start:s,stop:r,num:o}=e,i=b1(s,r,o);return t.makeTensorInfo([i.length],"float32",i)}const wO={kernelName:Qm,backendName:"cpu",kernelFunc:yO};const IO=Dt(ni,n=>Math.log1p(n)),vO={kernelName:ni,backendName:"cpu",kernelFunc:IO};const CO=se((n,t)=>n&&t),kO=me(Cc,CO,null,"bool"),$O={kernelName:Cc,backendName:"cpu",kernelFunc:kO};const SO=Dt(kc,n=>n?0:1,"bool"),NO={kernelName:kc,backendName:"cpu",kernelFunc:SO};const TO=se((n,t)=>n||t),EO=me($c,TO,null,"bool"),RO={kernelName:$c,backendName:"cpu",kernelFunc:EO};function DO(n){const{inputs:t,backend:e,attrs:s}=n,{x:r}=t,{depthRadius:o,bias:i,alpha:a,beta:c}=s;rt(r,"LRN");const l=r.shape[3],u=l-1,h=e.data.get(r.dataId).values,d=q(r.shape),p=new Float32Array(d);function f(m){const g=m%l;let x=m-g+Math.max(0,g-o);const b=m-g+Math.min(g+o,u);let w=0;for(;x<=b;x++){const y=h[x];w+=y*y}return w}for(let m=0;m<d;m++){const g=f(m),x=h[m]*Math.pow(i+a*g,-c);p[m]=x}return e.makeTensorInfo(r.shape,r.dtype,p)}const AO={kernelName:Sc,backendName:"cpu",kernelFunc:DO};function FO(n){const{inputs:t,backend:e,attrs:s}=n,{x:r,y:o,dy:i}=t,{depthRadius:a,bias:c,alpha:l,beta:u}=s;rt(i,"LRNGrad");const h=q(i.shape),d=i.shape[3],p=e.data.get(i.dataId).values,f=e.data.get(r.dataId).values,m=e.data.get(o.dataId).values,g=new Float32Array(h),x=h;for(let b=0;b<x;b++){const w=b%d,y=b-w+Math.max(0,w-a),I=b-w+Math.min(d,w+a+1);let C=0;for(let N=y;N<I;N++)C+=Math.pow(f[N],2);C=l*C+c;for(let N=y;N<I;N++){let T=-2*l*u*f[N]*m[b]/C;b===N&&(T+=Math.pow(C,-u)),T*=p[b],g[N]+=T}}return e.makeTensorInfo(i.shape,r.dtype,g)}const OO={kernelName:fh,backendName:"cpu",kernelFunc:FO};function ey(n){const{inputs:t,backend:e,attrs:s}=n,{x:r}=t,{reductionIndices:o,keepDims:i}=s,a=e;let c=r.shape;const l=c.length,u=wt(o,c);let h=u;const d=Kt(h,l);let p=a.data.get(r.dataId).values;if(d!=null){const y=new Array(l);for(let I=0;I<y.length;I++)y[I]=c[d[I]];p=Ip(p,c,r.dtype,d,y),h=Qt(h.length,l),c=y}rt(r,"max"),we("max",h,l);const[f,m]=fe(c,h),g=q(m),x=w1(p,g,f,r.dtype),b=a.write(x,f,r.dtype);let w=f;return i&&(w=Jt(f,u)),{dataId:b,shape:w,dtype:r.dtype}}const _O={kernelName:Nc,backendName:"cpu",kernelFunc:ey};function MO(n){const{inputs:t,backend:e,attrs:s}=n,{x:r}=t;rt(r,"maxPool");const{filterSize:o,strides:i,pad:a,dimRoundingMode:c}=s,l=1;S($e(i,l),()=>`Error in maxPool: Either strides or dilations must be 1. Got strides ${i} and dilations '${l}'`);const u=hn(r.shape,o,i,l,a,c);let h;if(u.filterWidth===1&&u.filterHeight===1&&Tt(u.inShape,u.outShape))h=Pn({inputs:{x:r},backend:e});else{const d=e.data.get(r.dataId).values,p=ht(r.shape),f=kp(d,r.shape,r.dtype,p,u,"max");h=e.makeTensorInfo(u.outShape,r.dtype,f.values)}return h}const LO={kernelName:Tc,backendName:"cpu",kernelFunc:MO};function PO(n){const{inputs:t,backend:e,attrs:s}=n,{x:r}=t,{filterSize:o,strides:i,pad:a,dimRoundingMode:c,dataFormat:l}=s;rt(r,"maxPool3d");const u=jn(r.shape,o,i,1,a,c,l),h=e.data.get(r.dataId).values,d=Z1(h,r.shape,r.dtype,ht(r.shape),u,"max");return e.makeTensorInfo(d.shape,"float32",d.values)}const BO={kernelName:Ec,backendName:"cpu",kernelFunc:PO};function zO(n){const{inputs:t,backend:e,attrs:s}=n,{dy:r,input:o}=t,{filterSize:i,strides:a,pad:c,dimRoundingMode:l}=s;rt([r,o],"maxPool3DGrad");const u=jn(o.shape,i,a,1,c,l),h=e.bufferSync(o),d=NA(h,u),p=u.strideDepth,f=u.strideHeight,m=u.strideWidth,g=u.dilationDepth,x=u.dilationHeight,b=u.dilationWidth,w=u.effectiveFilterDepth,y=u.effectiveFilterHeight,I=u.effectiveFilterWidth,C=w-1-u.padInfo.front,N=I-1-u.padInfo.left,T=y-1-u.padInfo.top,$=yt(o.shape,"float32"),k=e.bufferSync(r);for(let v=0;v<u.batchSize;++v)for(let R=0;R<u.inChannels;++R)for(let _=0;_<u.inDepth;++_)for(let P=0;P<u.inHeight;++P)for(let L=0;L<u.inWidth;++L){const B=_-C,U=P-T,V=L-N;let H=0;for(let K=0;K<w;K+=g){const j=(B+K)/p;if(!(j<0||j>=u.outDepth||Math.floor(j)!==j))for(let Y=0;Y<y;Y+=x){const Z=(U+Y)/f;if(!(Z<0||Z>=u.outHeight||Math.floor(Z)!==Z))for(let tt=0;tt<I;tt+=b){const Q=(V+tt)/m;if(Q<0||Q>=u.outWidth||Math.floor(Q)!==Q)continue;const st=w*y*I-1-d.get(v,j,Z,Q,R),ct=K*y*I+Y*I+tt,dt=st===ct?1:0;if(dt===0)continue;const pt=k.get(v,j,Z,Q,R);H+=pt*dt}}}$.set(H,v,_,P,L,R)}return e.makeTensorInfo($.shape,$.dtype,$.values)}const VO={kernelName:gh,backendName:"cpu",kernelFunc:zO};function WO(n){const{inputs:t,backend:e,attrs:s}=n,{dy:r,input:o,output:i}=t,a=o;rt([o,i],"maxPoolGrad");const{filterSize:c,strides:l,pad:u,dimRoundingMode:h}=s,d=hn(a.shape,c,l,1,u,h),p=e.data.get(a.dataId).values,f=yt(d.outShape,a.dtype,Y1(p,a.shape,a.dtype,d).values),m=d.strideHeight,g=d.strideWidth,x=d.dilationHeight,b=d.dilationWidth,w=d.effectiveFilterHeight,y=d.effectiveFilterWidth,I=y-1-d.padInfo.left,C=w-1-d.padInfo.top,N=yt(a.shape,"float32"),T=e.data.get(r.dataId).values,$=yt(r.shape,"float32",T);for(let k=0;k<d.batchSize;++k)for(let v=0;v<d.inChannels;++v)for(let R=0;R<d.inHeight;++R)for(let _=0;_<d.inWidth;++_){const P=R-C,L=_-I;let B=0;for(let U=0;U<w;U+=x){const V=(P+U)/m;if(!(V<0||V>=d.outHeight||Math.floor(V)!==V))for(let H=0;H<y;H+=b){const K=(L+H)/g;if(K<0||K>=d.outWidth||Math.floor(K)!==K)continue;const j=w*y-1-f.get(k,V,K,v),Y=U*y+H,Z=j===Y?1:0;if(Z===0)continue;const tt=$.get(k,V,K,v);B+=tt*Z}}N.set(B,k,R,_,v)}return e.makeTensorInfo(N.shape,N.dtype,N.values)}const UO={kernelName:mh,backendName:"cpu",kernelFunc:WO};function GO(n,t,e,s,r){const o=ht(t),i=kp(n,t,e,o,r,"max"),a=Y1(n,t,e,r,!0,s);return[i.values,a.values]}const HO={kernelName:tg,backendName:"cpu",kernelFunc:({inputs:n,attrs:t,backend:e})=>{const{x:s}=n,{filterSize:r,strides:o,pad:i,includeBatchInIndex:a}=t,c=e;rt(s,"MaxPoolWithArgmax");const l=c.data.get(s.dataId).values,u=hn(s.shape,r,o,[1,1],i),[h,d]=GO(l,s.shape,s.dtype,a,u),p=c.write(h,u.outShape,s.dtype),f=c.write(d,u.outShape,s.dtype);return[{dataId:p,shape:u.outShape,dtype:s.dtype},{dataId:f,shape:u.outShape,dtype:"int32"}]}};function qO(n){const{inputs:t,backend:e,attrs:s}=n,{x:r}=t,{axis:o,keepDims:i}=s,a=wt(o,r.shape),l=fe(r.shape,a)[1],u=q(l),h=[],d=e.makeTensorInfo([],"float32",new Float32Array([u]));h.push(d);const p=ms({inputs:{x:r},backend:e,attrs:{dtype:"float32"}});h.push(p);const f=$p({inputs:{a:p,b:d},backend:e});h.push(f);const m=Gi({inputs:{x:f},backend:e,attrs:{axis:o,keepDims:i}});return h.forEach(g=>e.disposeIntermediateTensorInfo(g)),m}const KO={kernelName:Rc,backendName:"cpu",kernelFunc:qO};function jO(n){const{inputs:t,backend:e,attrs:s}=n,{x:r}=t,{axis:o,keepDims:i}=s;rt(r,"min");const a=wt(o,r.shape);let c=a;const l=Kt(c,r.shape.length);let u=r;l!=null&&(u=Me({inputs:{x:r},backend:e,attrs:{perm:l}}),c=Qt(c.length,r.shape.length)),we("min",c,u.shape.length);const[h,d]=fe(u.shape,c),p=q(d),f=ke(q(h),u.dtype),m=e.data.get(u.dataId).values;for(let x=0;x<f.length;++x){const b=x*p;let w=m[b];for(let y=0;y<p;++y){const I=m[b+y];(Number.isNaN(I)||I<w)&&(w=I)}f[x]=w}l!=null&&e.disposeIntermediateTensorInfo(u);const g=e.makeTensorInfo(h,u.dtype,f);if(i){const x=Jt(h,a),b=Pt({inputs:{x:g},backend:e,attrs:{shape:x}});return e.disposeIntermediateTensorInfo(g),b}return g}const XO={kernelName:Dc,backendName:"cpu",kernelFunc:jO};function YO(n){const{inputs:t,backend:e,attrs:s}=n,{x:r}=t,{paddings:o,mode:i}=s;rt(r,"mirrorPad");const a=o.map((w,y)=>w[0]+r.shape[y]+w[1]),c=o.map(w=>w[0]),l=o.map((w,y)=>w[0]+r.shape[y]),u=i==="reflect"?0:1,h=e.data.get(r.dataId).values,d=r.shape.length,p=ht(r.shape),f=q(a),m=a.length,g=ht(a),x=be(r.dtype,f);for(let w=0;w<f;w++){let y=Lr(w,m,g);for(let C=0;C<m;C++)y[C]<c[C]?y[C]=c[C]*2-y[C]-u:y[C]>=l[C]&&(y[C]=(l[C]-1)*2-y[C]+u);y=y.map((C,N)=>C-c[N]);const I=Dn(y,d,p);x[w]=h[I]}return{dataId:e.write(x,a,r.dtype),shape:a,dtype:r.dtype}}const ZO={kernelName:Ac,backendName:"cpu",kernelFunc:YO};const JO=se((n,t)=>{const e=n%t;return n<0&&t<0||n>=0&&t>=0?e:(e+t)%t}),QO=me(oi,JO),t_={kernelName:oi,backendName:"cpu",kernelFunc:QO};function ny(n){const{inputs:t,backend:e,attrs:s}=n,{logits:r}=t,{dim:o}=s,i=r.shape.length;let a=o;if(a===-1&&(a=i-1),a!==i-1)throw Error(`Softmax along a non-last dimension is not yet supported. Logits was rank ${i} and dim was ${a}`);const c=wt([a],r.shape),l=ey({inputs:{x:r},backend:e,attrs:{reductionIndices:c,keepDims:!1}}),u=Jt(l.shape,c),h=Pt({inputs:{x:l},backend:e,attrs:{shape:u}}),d=Cp({inputs:{a:r,b:h},backend:e}),p=l1({inputs:{x:d},backend:e}),f=Gi({inputs:{x:p},backend:e,attrs:{axis:c,keepDims:!1}}),m=Pt({inputs:{x:f},backend:e,attrs:{shape:u}}),g=$p({inputs:{a:p,b:m},backend:e});return e.disposeIntermediateTensorInfo(l),e.disposeIntermediateTensorInfo(h),e.disposeIntermediateTensorInfo(d),e.disposeIntermediateTensorInfo(p),e.disposeIntermediateTensorInfo(f),e.disposeIntermediateTensorInfo(m),g}const e_={kernelName:Yc,backendName:"cpu",kernelFunc:ny};function n_(n){const{inputs:t,backend:e,attrs:s}=n,{logits:r}=t,{numSamples:o,seed:i,normalized:a}=s;rt(r,"multinomial");const c=a?r:ny({inputs:{logits:r},backend:e,attrs:{dim:-1}}),l=c.shape[0],u=c.shape[1],h=e.data.get(c.dataId).values,d=[l,o],p=ke(q(d),"int32");for(let f=0;f<l;++f){const m=f*u,g=new Float32Array(u-1);g[0]=h[m];for(let w=1;w<g.length;++w)g[w]=g[w-1]+h[m+w];const x=ll.alea(i.toString()),b=f*o;for(let w=0;w<o;++w){const y=x();p[b+w]=g.length;for(let I=0;I<g.length;I++)if(y<g[I]){p[b+w]=I;break}}}return a||e.disposeIntermediateTensorInfo(c),e.makeTensorInfo(d,"int32",p)}const s_={kernelName:eg,backendName:"cpu",kernelFunc:n_};const r_=wd;function o_(n){const{inputs:t,backend:e,attrs:s}=n,{boxes:r,scores:o}=t,{maxOutputSize:i,iouThreshold:a,scoreThreshold:c}=s;rt(r,"NonMaxSuppression");const l=e.data.get(r.dataId).values,u=e.data.get(o.dataId).values,{selectedIndices:h}=r_(l,u,i,a,c);return e.makeTensorInfo([h.length],"int32",new Int32Array(h))}const i_={kernelName:xh,backendName:"cpu",kernelFunc:o_};const a_=Id;function c_(n){const{inputs:t,backend:e,attrs:s}=n,{boxes:r,scores:o}=t,{maxOutputSize:i,iouThreshold:a,scoreThreshold:c,padToMaxOutputSize:l}=s;rt(r,"NonMaxSuppressionPadded");const u=e.data.get(r.dataId).values,h=e.data.get(o.dataId).values,{selectedIndices:d,validOutputs:p}=a_(u,h,i,a,c,l);return[e.makeTensorInfo([d.length],"int32",new Int32Array(d)),e.makeTensorInfo([],"int32",new Int32Array([p]))]}const l_={kernelName:bh,backendName:"cpu",kernelFunc:c_};const u_=vd;function h_(n){const{inputs:t,backend:e,attrs:s}=n,{boxes:r,scores:o}=t,{maxOutputSize:i,iouThreshold:a,scoreThreshold:c,softNmsSigma:l}=s;rt(r,"NonMaxSuppressionWithScore");const u=e.data.get(r.dataId).values,h=e.data.get(o.dataId).values,d=i,p=a,f=c,m=l,{selectedIndices:g,selectedScores:x}=u_(u,h,d,p,f,m);return[e.makeTensorInfo([g.length],"int32",new Int32Array(g)),e.makeTensorInfo([x.length],"float32",new Float32Array(x))]}const d_={kernelName:yh,backendName:"cpu",kernelFunc:h_};function p_(n){const{inputs:t,backend:e,attrs:s}=n,{indices:r}=t,{dtype:o,depth:i,onValue:a,offValue:c}=s;rt(r,"oneHot");const l=q(r.shape),u=new Float32Array(l*i);u.fill(c);const h=e.data.get(r.dataId).values;for(let d=0;d<l;++d)h[d]>=0&&h[d]<i&&(u[d*i+h[d]]=a);return e.makeTensorInfo([...r.shape,i],o,u)}const f_={kernelName:Mc,backendName:"cpu",kernelFunc:p_};function Xa(n){const{inputs:t,backend:e}=n,{x:s}=t;if(s.dtype==="string")throw new Error("zerosLike is not supported for string tensors");if(s.dtype==="complex64"){const r=er({inputs:{input:s},backend:e}),o=Xa({inputs:{x:r},backend:e}),i=Ar({inputs:{input:s},backend:e}),a=Xa({inputs:{x:i},backend:e}),c=Be({inputs:{real:o,imag:a},backend:e});return e.disposeIntermediateTensorInfo(r),e.disposeIntermediateTensorInfo(o),e.disposeIntermediateTensorInfo(i),e.disposeIntermediateTensorInfo(a),c}else return Sp({backend:e,attrs:{shape:s.shape,value:0,dtype:s.dtype}})}const m_={kernelName:Qc,backendName:"cpu",kernelFunc:Xa};function sy(n){const{inputs:t,backend:e}=n,{x:s}=t;if(s.dtype==="string")throw new Error("onesLike is not supported for string tensors");if(s.dtype==="complex64"){const r=er({inputs:{input:s},backend:e}),o=sy({inputs:{x:r},backend:e}),i=Ar({inputs:{input:s},backend:e}),a=Xa({inputs:{x:i},backend:e}),c=Be({inputs:{real:o,imag:a},backend:e});return e.disposeIntermediateTensorInfo(r),e.disposeIntermediateTensorInfo(o),e.disposeIntermediateTensorInfo(i),e.disposeIntermediateTensorInfo(a),c}else return Sp({backend:e,attrs:{shape:s.shape,value:1,dtype:s.dtype}})}const g_={kernelName:_c,backendName:"cpu",kernelFunc:sy};function ry(n){const{inputs:t,backend:e,attrs:s}=n,{axis:r}=s;if(t.length===1)return ja({inputs:{input:t[0]},backend:e,attrs:{dim:r}});const o=t[0].shape,i=t[0].dtype;t.forEach(u=>{un(o,u.shape,"All tensors passed to stack must have matching shapes"),S(i===u.dtype,()=>"All tensors passed to stack must have matching dtypes")});const a=[],c=t.map(u=>{const h=ja({inputs:{input:u},backend:e,attrs:{dim:r}});return a.push(h),h}),l=Fr({inputs:c,backend:e,attrs:{axis:r}});return a.forEach(u=>e.disposeIntermediateTensorInfo(u)),l}const x_={kernelName:Lc,backendName:"cpu",kernelFunc:ry};function b_(n){const{inputs:t,backend:e,attrs:s}=n,{x:r}=t,{paddings:o,constantValue:i}=s;rt(r,"pad");const a=o.map((b,w)=>b[0]+r.shape[w]+b[1]),c=o.map(b=>b[0]),l=e.data.get(r.dataId).values,u=q(r.shape),h=r.shape.length,d=ht(r.shape),p=q(a),f=a.length,m=ht(a),g=be(r.dtype,p);i!==0&&g.fill(i);for(let b=0;b<u;b++){const y=Lr(b,h,d).map((C,N)=>C+c[N]),I=Dn(y,f,m);g[I]=l[b]}return{dataId:e.write(g,a,r.dtype),shape:a,dtype:r.dtype}}const oy={kernelName:Pc,backendName:"cpu",kernelFunc:b_};const y_=se((n,t)=>Math.pow(n,t)),w_=me(ai,y_),I_={kernelName:ai,backendName:"cpu",kernelFunc:w_};function v_(n){const{inputs:t,backend:e,attrs:s}=n,{paramsNestedSplits:r,paramsDenseValues:o,indices:i}=t,{outputRaggedRank:a}=s,c=r.map(x=>e.data.get(x.dataId).values),l=r.map(x=>x.shape),u=e.data.get(o.dataId).values,h=e.data.get(i.dataId).values,[d,p,f]=S1(c,l,u,o.shape,o.dtype,h,i.shape),m=d.map(x=>e.makeTensorInfo([x.length],"int32",x)),g=e.makeTensorInfo(f,o.dtype,p);return m.concat([g])}const C_={kernelName:ng,backendName:"cpu",kernelFunc:v_};function k_(n){const{inputs:t,backend:e,attrs:s}=n,{shape:r,values:o,defaultValue:i,rowPartitionTensors:a}=t,{rowPartitionTypes:c}=s,l=e.data.get(r.dataId).values,u=e.data.get(o.dataId).values,h=e.data.get(i.dataId).values,d=a.map(g=>e.data.get(g.dataId).values),p=a.map(g=>g.shape),[f,m]=N1(l,r.shape,u,o.shape,o.dtype,h,i.shape,d,p,c);return e.makeTensorInfo(f,o.dtype,m)}const $_={kernelName:sg,backendName:"cpu",kernelFunc:k_};function S_(n){const{backend:t,attrs:e}=n,{start:s,stop:r,dtype:o,step:i}=e,a=T1(s,r,i,o);return t.makeTensorInfo([a.length],o,a)}const N_={kernelName:wh,backendName:"cpu",kernelFunc:S_};const T_=Dt(ci,n=>1/n),E_={kernelName:ci,backendName:"cpu",kernelFunc:T_};function R_(n){const{inputs:t,backend:e,attrs:s}=n,{images:r}=t,{alignCorners:o,halfPixelCenters:i,size:a}=s;rt(r,"resizeBilinear");const c=ht(r.shape),[l,u]=a,[h,d,p,f]=r.shape,m=e.data.get(r.dataId).values,g=new Float32Array(q([h,l,u,f])),x=[o&&l>1?d-1:d,o&&u>1?p-1:p],b=[o&&l>1?l-1:l,o&&u>1?u-1:u];let w=0;const y=x[0]/b[0],I=x[1]/b[1];for(let C=0;C<h;C++)for(let N=0;N<l;N++){let T;i?T=y*(N+.5)-.5:T=y*N;const $=Math.max(0,Math.floor(T)),k=T-$,v=Math.min(d-1,Math.ceil(T)),R=C*c[0]+$*c[1],_=C*c[0]+v*c[1];for(let P=0;P<u;P++){let L;i?L=I*(P+.5)-.5:L=I*P;const B=Math.max(0,Math.floor(L)),U=L-B,V=Math.min(p-1,Math.ceil(L)),H=R+B*c[2],K=_+B*c[2],j=R+V*c[2],Y=_+V*c[2];for(let Z=0;Z<f;Z++){const tt=m[H+Z],Q=m[K+Z],st=m[j+Z],ct=m[Y+Z],dt=tt+(st-tt)*U,pt=Q+(ct-Q)*U,xt=dt+(pt-dt)*k;g[w++]=xt}}}return e.makeTensorInfo([h,l,u,f],"float32",g)}const D_={kernelName:Uc,backendName:"cpu",kernelFunc:R_};function A_(n){const{inputs:t,backend:e,attrs:s}=n,{images:r,dy:o}=t,{alignCorners:i}=s;rt([o,r],"resizeBilinearGrad");const a=ht(r.shape),[c,l,u,h]=r.shape,[,d,p]=o.shape,f=new Float32Array(c*l*u*h),m=[i&&d>1?l-1:l,i&&p>1?u-1:u],g=[i&&d>1?d-1:d,i&&p>1?p-1:p],x=m[0]/g[0],b=m[1]/g[1],w=e.data.get(o.dataId).values;let y=0;for(let I=0;I<c;I++){const C=I*a[0];for(let N=0;N<d;N++){const T=N*x,$=Math.floor(T),k=Math.min(Math.ceil(T),l-1),v=C+$*a[1],R=C+k*a[1],_=T-$,P=1-_;for(let L=0;L<p;L++){const B=L*b,U=Math.floor(B),V=Math.min(Math.ceil(B),u-1),H=B-U,K=1-H,j=v+U*a[2],Y=v+V*a[2],Z=R+U*a[2],tt=R+V*a[2],Q=P*K,st=P*H,ct=_*K,dt=_*H;for(let pt=0;pt<h;pt++){const xt=w[y++];f[j+pt]+=xt*Q,f[Y+pt]+=xt*st,f[Z+pt]+=xt*ct,f[tt+pt]+=xt*dt}}}}return e.makeTensorInfo([c,u,l,h],"float32",f)}const F_={kernelName:Ch,backendName:"cpu",kernelFunc:A_};function O_(n){const{inputs:t,backend:e,attrs:s}=n,{images:r}=t,{alignCorners:o,halfPixelCenters:i,size:a}=s;rt(r,"resizeNearestNeighbor");const c=ht(r.shape),[l,u]=a,[h,d,p,f]=r.shape,m=e.data.get(r.dataId).values,g=new Float32Array(h*l*u*f),x=[o&&l>1?d-1:d,o&&u>1?p-1:p],b=[o&&l>1?l-1:l,o&&u>1?u-1:u],w=x[0]/b[0],y=x[1]/b[1];let I=0;for(let C=0;C<h;C++){const N=C*c[0];for(let T=0;T<l;T++){const $=i?w*(T+.5):w*T;let k=Math.min(d-1,o?Math.round($):Math.floor($));i&&(k=Math.max(0,k));const v=N+k*c[1];for(let R=0;R<u;R++){const _=i?y*(R+.5):y*R;let P=Math.min(p-1,o?Math.round(_):Math.floor(_));i&&(P=Math.max(0,P));const L=v+P*c[2];for(let B=0;B<f;B++){const U=m[L+B];g[I++]=U}}}}return e.makeTensorInfo([h,l,u,f],r.dtype,g)}const __={kernelName:Wc,backendName:"cpu",kernelFunc:O_};function M_(n){const{inputs:t,backend:e,attrs:s}=n,{images:r,dy:o}=t,{alignCorners:i}=s;rt([o,r],"resizeNearestNeighborGrad");const a=ht(r.shape),c=ht(o.shape),[l,u,h,d]=r.shape,[,p,f]=o.shape,m=new Float32Array(l*u*h*d),g=e.data.get(o.dataId).values,x=[i&&p>1?u-1:u,i&&f>1?h-1:h],b=[i&&p>1?p-1:p,i&&f>1?f-1:f],w=x[0]/b[0],y=x[1]/b[1],I=1/w,C=1/y,N=Math.ceil(I)*2+2,T=Math.ceil(C)*2+2;for(let $=0;$<l;$++){const k=$*a[0];for(let v=0;v<u;v++){const R=k+v*a[1],_=Math.floor(v*I),P=Math.floor(_-N/2);for(let L=0;L<h;L++){const B=R+L*a[2],U=Math.floor(L*C),V=Math.floor(U-T/2);for(let H=0;H<d;H++){let K=0;for(let j=0;j<N;j++){const Y=j+P;if(Y<0||Y>=p)continue;const Z=k+Y*c[1],tt=Y*w,Q=Math.min(u-1,i?Math.round(tt):Math.floor(tt));if(v===Q)for(let st=0;st<T;st++){const ct=st+V;if(ct<0||ct>=f)continue;const dt=Z+ct*c[2],pt=ct*y,xt=Math.min(h-1,i?Math.round(pt):Math.floor(pt));L===xt&&(K+=g[dt+H])}}m[B+H]=K}}}}return e.makeTensorInfo(r.shape,r.dtype,m)}const L_={kernelName:vh,backendName:"cpu",kernelFunc:M_};function P_(n){const{inputs:t,backend:e,attrs:s}=n,{x:r}=t,{dims:o}=s;rt(r,"reverse");const i=r.shape.length,a=wt(o,r.shape);if(i===0)return Pn({inputs:{x:r},backend:e});const c=new ve(r.shape,r.dtype),l=e.bufferSync(r);for(let u=0;u<c.size;u++){const h=c.indexToLoc(u),d=h.slice();a.forEach(p=>d[p]=r.shape[p]-1-d[p]),c.set(l.get(...d),...h)}return e.makeTensorInfo(c.shape,c.dtype,c.values)}const B_={kernelName:Gc,backendName:"cpu",kernelFunc:P_};const z_={kernelName:Mh,backendName:"cpu",kernelFunc:({inputs:n,attrs:t,backend:e})=>{const{image:s}=n,{radians:r,fillValue:o,center:i}=t,a=e,c=be(s.dtype,q(s.shape)),[l,u,h,d]=s.shape,[p,f]=Ad(i,u,h),m=255,g=Math.sin(r),x=Math.cos(r),b=a.data.get(s.dataId).values;for(let y=0;y<l;y++){const I=y*h*u*d;for(let C=0;C<u;C++){const N=C*(h*d);for(let T=0;T<h;T++){const $=T*d;for(let k=0;k<d;k++){const v=[l,C,T,k],R=v[2],_=v[1];let P=(R-p)*x-(_-f)*g,L=(R-p)*g+(_-f)*x;P=Math.round(P+p),L=Math.round(L+f);let B=o;if(typeof o!="number"&&(k===3?B=m:B=o[k]),P>=0&&P<h&&L>=0&&L<u){const V=L*(h*d),H=P*d,K=I+V+H+k;B=b[K]}const U=I+N+$+k;c[U]=B}}}}return{dataId:a.write(c,s.shape,s.dtype),shape:s.shape,dtype:s.dtype}}};const V_=Dt(hi,n=>{const t=Math.floor(n);return n-t<.5?Math.floor(n):n-t>.5?Math.ceil(n):t%2===0?t:t+1}),W_={kernelName:hi,backendName:"cpu",kernelFunc:V_};function U_(n){const{inputs:t,backend:e,attrs:s}=n,{indices:r,updates:o}=t,{shape:i}=s,{sliceRank:a,numUpdates:c,sliceSize:l,strides:u,outputSize:h}=Si(o,r,i),d=!0,p=e.bufferSync(r),f=e.bufferSync(o),m=gr(p,f,i,h,l,c,a,u,0,d);return e.makeTensorInfo(i,m.dtype,m.values)}const G_={kernelName:rg,backendName:"cpu",kernelFunc:U_};function H_(n,t){let e=0,s=n.length,r=0;for(;e<s;)r=Math.floor((e+s)/2),n[r]<t?e=r+1:s=r;return s}function q_(n,t){let e=0,s=n.length,r=0;for(;e<s;)r=Math.floor((e+s)/2),n[r]<=t?e=r+1:s=r;return s}function K_(n,t,e,s,r,o){const i=de("int32",e*r);for(let a=0;a<e;++a){const c=n.slice(a*s,(a+1)*s),l=a*r;for(let u=0;u<r;++u)i[l+u]=o==="left"?H_(c,t[u+l]):q_(c,t[u+l])}return i}function j_(n){const{inputs:t,backend:e,attrs:s}=n,{sortedSequence:r,values:o}=t,{side:i}=s,a=e.data.get(r.dataId).values,c=e.data.get(o.dataId).values,l=K_(a,c,r.shape[0],r.shape[1],o.shape[1],i);return e.makeTensorInfo(o.shape,"int32",l)}const X_={kernelName:og,backendName:"cpu",kernelFunc:j_};function Y_(n){const{inputs:t,backend:e}=n,{condition:s,t:r,e:o}=t;rt([s,r,o],"select");const i=s.shape.length,a=e.data.get(s.dataId).values,c=e.data.get(r.dataId).values,l=e.data.get(o.dataId).values,u=Ve(r.dtype,o.dtype),h=ke(q(r.shape),u);let d=0;const p=i===0||i>1||r.shape.length===1?1:q(r.shape.slice(1));for(let f=0;f<a.length;f++)for(let m=0;m<p;m++)a[f]===1?h[d++]=c[f]:h[d++]=l[f];return e.makeTensorInfo(r.shape,u,h)}const Z_={kernelName:Hc,backendName:"cpu",kernelFunc:Y_};const J_=pl,Q_=fl,tM=Dt(pi,n=>n>=0?Q_*n:J_*(Math.exp(n)-1)),eM={kernelName:pi,backendName:"cpu",kernelFunc:tM};const nM=Dt(gi,n=>n<0?-1:n>0?1:0),sM={kernelName:gi,backendName:"cpu",kernelFunc:nM};const rM=Dt(fi,n=>Math.sin(n)),oM={kernelName:fi,backendName:"cpu",kernelFunc:rM};const iM=Dt(mi,n=>Math.sinh(n)),aM={kernelName:mi,backendName:"cpu",kernelFunc:iM};const cM=11920928955078125e-23,Kf=Math.log(cM)+2,lM=Dt(bi,n=>{const t=n>-Kf,e=n<Kf,s=Math.exp(n);let r;return e?r=s:t?r=n:r=Math.log(1+s),r}),uM={kernelName:bi,backendName:"cpu",kernelFunc:lM};function hM(n){const{inputs:t,backend:e,attrs:s}=n,{x:r}=t,{blockShape:o,paddings:i}=s;rt([r],"spaceToBatchND");const a=q(o),c=[[0,0]];c.push(...i);for(let C=1+o.length;C<r.shape.length;++C)c.push([0,0]);const l=oy.kernelFunc({inputs:{x:r},backend:e,attrs:{paddings:c,constantValue:0}}),u=Ai(l.shape,o,a,!1),h=Fi(u.length,o.length,!1),d=Oi(l.shape,o,a,!1),m=Pt({inputs:{x:l},backend:e,attrs:{shape:u}}),b=Me({inputs:{x:m},backend:e,attrs:{perm:h}}),I=Pt({inputs:{x:b},backend:e,attrs:{shape:d}});return e.disposeIntermediateTensorInfo(l),e.disposeIntermediateTensorInfo(m),e.disposeIntermediateTensorInfo(b),I}const dM={kernelName:jc,backendName:"cpu",kernelFunc:hM};function pM(n){const{inputs:t,backend:e}=n,{indices:s,values:r,denseShape:o,defaultValue:i}=t;if(o.shape.length!==1)throw new Error(`Dense shape must be a vector, saw:
        ${o.shape}`);if(s.shape.length!==2)throw new Error(`Indices must be a matrix, saw:
        ${s.shape}`);if(r.shape.length!==1)throw new Error(`Values must be a vector, saw:
        ${r.shape}`);if(i.shape.length!==0)throw new Error(`Default value must be a scalar, saw:
        ${i.shape}`);const a=e.data.get(s.dataId).values,c=e.data.get(r.dataId).values,l=e.data.get(o.dataId).values,u=e.data.get(i.dataId).values[0],[h,d,p,f,m]=A1(a,s.shape,s.dtype,c,r.dtype,l,u);return[e.makeTensorInfo(d,s.dtype,h),e.makeTensorInfo([d[0]],r.dtype,p),e.makeTensorInfo([f.length],"bool",new Uint8Array(f.map(g=>Number(g)))),e.makeTensorInfo([m.length],s.dtype,new Int32Array(m))]}const fM={kernelName:kh,backendName:"cpu",kernelFunc:pM};function mM(n){const{inputs:t,backend:e}=n,{inputIndices:s,inputShape:r,newShape:o}=t;if(s.shape.length!==2)throw new Error(`Input indices should be a matrix but received shape
        ${s.shape}`);if(r.shape.length!==1)throw new Error(`Input shape should be a vector but received shape
        ${r.shape}`);if(o.shape.length!==1)throw new Error(`Target shape should be a vector but received shape ${o.shape}`);const i=Array.from(e.data.get(r.dataId).values),a=e.data.get(s.dataId).values,c=Array.from(e.data.get(o.dataId).values),[l,u,h]=F1(a,s.shape,s.dtype,i,c);return[e.makeTensorInfo(u,s.dtype,l),e.makeTensorInfo([h.length],o.dtype,new Int32Array(h))]}const gM={kernelName:$h,backendName:"cpu",kernelFunc:mM};function xM(n){const{inputs:t,backend:e}=n,{data:s,indices:r,segmentIds:o}=t;if(s.shape.length<1)throw new Error("Data should be at least 1 dimensional but received scalar");if(r.shape.length!==1)throw new Error(`Indices should be a vector but received shape
          ${r.shape}`);if(o.shape.length!==1)throw new Error(`Segment ids should be a vector but received shape
          ${o.shape}`);if(r.shape[0]!==o.shape[0])throw new Error("segmentIds and indices should have same size.");const i=e.data.get(s.dataId).values,a=e.data.get(r.dataId).values,c=e.data.get(o.dataId).values,[l,u]=vp(i,s.shape,s.dtype,a,c,!0);return e.makeTensorInfo(u,s.dtype,l)}const bM={kernelName:Sh,backendName:"cpu",kernelFunc:xM};function yM(n){const{inputs:t,backend:e}=n,{data:s,indices:r,segmentIds:o}=t;if(s.shape.length<1)throw new Error("Data should be at least 1 dimensional but received scalar");if(r.shape.length!==1)throw new Error(`Indices should be a vector but received shape
         ${r.shape}`);if(o.shape.length!==1)throw new Error(`Segment ids should be a vector but received shape
         ${o.shape}`);if(r.shape[0]!==o.shape[0])throw new Error("segmentIds and indices should have same size.");const i=e.data.get(s.dataId).values,a=e.data.get(r.dataId).values,c=e.data.get(o.dataId).values,[l,u]=vp(i,s.shape,s.dtype,a,c);return e.makeTensorInfo(u,s.dtype,l)}const wM={kernelName:Nh,backendName:"cpu",kernelFunc:yM};function IM(n){const{inputs:t,backend:e,attrs:s}=n,{sparseIndices:r,sparseValues:o,defaultValue:i}=t,{outputShape:a}=s,{sliceRank:c,numUpdates:l,sliceSize:u,strides:h,outputSize:d}=Si(o,r,a),p=!1,f=e.bufferSync(r);let m;switch(o.dtype){case"bool":{const g=e.bufferSync(o),x=!!e.data.get(i.dataId).values[0];m=gr(f,g,a,d,u,l,c,h,x,p);break}case"float32":{const g=e.bufferSync(o),x=e.data.get(i.dataId).values[0];m=gr(f,g,a,d,u,l,c,h,x,p);break}case"int32":{const g=e.bufferSync(o),x=e.data.get(i.dataId).values[0];m=gr(f,g,a,d,u,l,c,h,x,p);break}case"string":{const g=e.bufferSync(o),x=us(e.data.get(i.dataId).values[0]);m=gr(f,g,a,d,u,l,c,h,x,p);break}default:throw new Error(`Unsupported type ${o.dtype}`)}return e.makeTensorInfo(a,m.dtype,m.values)}const vM={kernelName:ig,backendName:"cpu",kernelFunc:IM};function CM(n){const{inputs:t,backend:e,attrs:s}=n,{x:r}=t,{numOrSizeSplits:o,axis:i}=s,a=wt(i,r.shape)[0],c=Kd(r,o,a),l=new Array(r.shape.length).fill(0),u=r.shape.slice();return c.map(h=>{const d=[...u];d[a]=h;const p=nr({inputs:{x:r},backend:e,attrs:{begin:l,size:d}});return l[a]+=h,p})}const kM={kernelName:Xc,backendName:"cpu",kernelFunc:CM};const $M={kernelName:Th,backendName:"cpu",kernelFunc:({inputs:n,backend:t})=>{const{x:e}=n,s=t;rt(e,"square");const r=s.data.get(e.dataId).values,o=new Float32Array(r.length);for(let a=0;a<r.length;++a){const c=r[a];o[a]=c*c}return{dataId:s.write(o,e.shape,e.dtype),shape:e.shape,dtype:e.dtype}}};const SM=Dt($i,(n,t)=>{const e=t;return isNaN(n)?NaN:n>0?1:e.alpha}),NM={kernelName:$i,backendName:"cpu",kernelFunc:SM};function TM(n){const{inputs:t,backend:e,attrs:s}=n,{x:r}=t,{begin:o,end:i,strides:a,beginMask:c,endMask:l,ellipsisMask:u,newAxisMask:h,shrinkAxisMask:d}=s;rt(r,"stridedSlice");const{finalShapeSparse:p,finalShape:f,isIdentity:m,sliceDim0:g,isSimpleSlice:x,begin:b,end:w,strides:y}=Hh(r.shape,o,i,a,c,l,u,h,d);let I;if(m)I=Pt({inputs:{x:r},backend:e,attrs:{shape:f}});else if(g||x){S(r.shape.length>=1,()=>`Input must have rank at least 1, got: ${r.shape.length}`);const C=Wh(b,w,y),N=nr({inputs:{x:r},backend:e,attrs:{begin:b,size:C}});I=Pt({inputs:{x:N},backend:e,attrs:{shape:f}}),e.disposeIntermediateTensorInfo(N)}else{const C=e.bufferSync(r),N=_1(p,C,y,b);I=e.makeTensorInfo(f,N.dtype,N.values)}return I}const EM={kernelName:Eh,backendName:"cpu",kernelFunc:TM};function RM(n){const{inputs:t,backend:e,attrs:s}=n,{separator:r,nGramWidths:o,leftPad:i,rightPad:a,padWidth:c,preserveShortSequences:l}=s,{data:u,dataSplits:h}=t,d=e.data.get(u.dataId).values,p=e.data.get(h.dataId).values,[f,m]=M1(d,p,r,o,i,a,c,l);return[e.makeTensorInfo([f.length],"string",f),e.makeTensorInfo(h.shape,"int32",m)]}const DM={kernelName:Rh,backendName:"cpu",kernelFunc:RM};function AM(n){const{inputs:t,backend:e,attrs:s}=n,{skipEmpty:r}=s,{input:o,delimiter:i}=t;if(o.dtype!=="string")throw new Error("Input must be of datatype string");if(o.shape.length!==1)throw new Error(`Input must be a vector, got shape: ${o.shape}`);if(i.shape.length!==0)throw new Error(`Delimiter must be a scalar, got shape: ${i.shape}`);const a=e.data.get(o.dataId).values,c=e.data.get(i.dataId).values[0],[l,u,h]=L1(a,c,r),d=u.length;return[e.makeTensorInfo([d,2],"int32",l),e.makeTensorInfo([d],"string",u),e.makeTensorInfo([2],"int32",new Int32Array(h))]}const FM={kernelName:Dh,backendName:"cpu",kernelFunc:AM};function OM(n){const{inputs:t,backend:e,attrs:s}=n,{numBuckets:r}=s,{input:o}=t;if(o.dtype!=="string")throw new Error("Input must be of datatype string");if(r<=0)throw new Error("Number of buckets must be at least 1");const i=e.data.get(o.dataId).values,a=P1(i,r);return e.makeTensorInfo(o.shape,"int32",a)}const _M={kernelName:Ah,backendName:"cpu",kernelFunc:OM};const MM=Dt(vi,n=>Math.tan(n)),LM={kernelName:vi,backendName:"cpu",kernelFunc:MM};const PM=Dt(Ci,n=>Math.tanh(n)),BM={kernelName:Ci,backendName:"cpu",kernelFunc:PM};function zM(n){const{inputs:t,backend:e,attrs:s}=n,{x:r}=t,{reps:o}=s;rt(r,"tile");const i=z1(e.bufferSync(r),o);return e.makeTensorInfo(i.shape,i.dtype,i.values)}const VM={kernelName:ki,backendName:"cpu",kernelFunc:zM};function WM(n){const{inputs:t,backend:e,attrs:s}=n,{x:r}=t,{k:o,sorted:i}=s;rt(r,"topk");const a=e.data.get(r.dataId).values,[c,l]=W1(a,r.shape,r.dtype,o,i);return[e.makeTensorInfo(c.shape,c.dtype,c.values),e.makeTensorInfo(l.shape,l.dtype,l.values)]}const UM={kernelName:Fh,backendName:"cpu",kernelFunc:WM};function GM(n){const{inputs:t,attrs:e,backend:s}=n,{image:r,transforms:o}=t,{interpolation:i,fillMode:a,fillValue:c,outputShape:l}=e,[u,h,d,p]=r.shape,[f,m]=l??[h,d],g=[u,f,m,p],x=ht(r.shape),b=x[0],w=x[1],y=x[2],I=ht(g),C=I[0],N=I[1],T=I[2],$=be(r.dtype,q(g));$.fill(c);const k=s.data.get(r.dataId).values,v=s.data.get(o.dataId).values;for(let _=0;_<u;++_){const P=o.shape[0]===1?v:v.subarray(_*8,_*8+8);for(let L=0;L<f;++L)for(let B=0;B<m;++B)for(let U=0;U<p;++U){let V;const H=P[6]*B+P[7]*L+1;if(H===0)continue;const K=(P[0]*B+P[1]*L+P[2])/H,j=(P[3]*B+P[4]*L+P[5])/H,Y=jf(K,d,a),Z=jf(j,h,a);switch(i){case"nearest":V=YM(k,h,d,b,w,y,_,Z,Y,U,c);break;case"bilinear":V=ZM(k,h,d,b,w,y,_,Z,Y,U,c);break;default:throw new Error(`Error in Transform: Expect 'nearest' or 'bilinear', but got ${i}`)}const tt=_*C+L*N+B*T+U;$[tt]=V}return s.makeTensorInfo(g,r.dtype,$)}return{dataId:s.write($,g,r.dtype),shape:r.shape,dtype:r.dtype}}const HM={kernelName:Oh,backendName:"cpu",kernelFunc:GM};function jf(n,t,e){switch(e){case"reflect":return qM(n,t);case"wrap":return KM(n,t);case"nearest":return XM(n,t);case"constant":default:return jM(n)}}function qM(n,t){let e=n;if(e<0)if(t<=1)e=0;else{const s=2*t;e<s&&(e=s*Math.trunc(-e/s)+e),e=e<-t?e+s:-e-1}else if(e>t-1)if(t<=1)e=0;else{const s=2*t;e-=s*Math.trunc(e/s),e>=t&&(e=s-e-1)}return Gs(0,e,t-1)}function KM(n,t){let e=n;if(e<0)if(t<=1)e=0;else{const s=t-1;e+=t*(Math.trunc(-e/s)+1)}else if(e>t-1)if(t<=1)e=0;else{const s=t-1;e-=t*Math.trunc(e/s)}return Gs(0,e,t-1)}function jM(n,t){return n}function XM(n,t){return Gs(0,n,t-1)}function mo(n,t,e,s,r,o,i,a,c,l,u){const h=i*s+a*r+c*o+l;return 0<=a&&a<t&&0<=c&&c<e?n[h]:u}function YM(n,t,e,s,r,o,i,a,c,l,u){const h=Math.round(a),d=Math.round(c);return mo(n,t,e,s,r,o,i,h,d,l,u)}function ZM(n,t,e,s,r,o,i,a,c,l,u){const h=Math.floor(a),d=Math.floor(c),p=h+1,f=d+1,m=(f-c)*mo(n,t,e,s,r,o,i,h,d,l,u)+(c-d)*mo(n,t,e,s,r,o,i,h,f,l,u),g=(f-c)*mo(n,t,e,s,r,o,i,p,d,l,u)+(c-d)*mo(n,t,e,s,r,o,i,p,f,l,u);return(p-a)*m+(a-h)*g}function JM(n){const{inputs:t,attrs:e,backend:s}=n,{axis:r}=e,{x:o}=t;rt(o,"unique");const i=s.data.get(o.dataId).values,{outputValues:a,outputShape:c,indices:l}=U1(i,r,o.shape,o.dtype);return[s.makeTensorInfo(c,o.dtype,a),s.makeTensorInfo([l.length],"int32",l)]}const QM={kernelName:_h,backendName:"cpu",kernelFunc:JM};function tL(n){const{inputs:t,backend:e,attrs:s}=n,{value:r}=t;let{axis:o}=s;o<0&&(o+=r.shape.length);const i=r.shape.length,a=r.shape[o],c=new Array(i-1);let l=0;for(let p=0;p<i;p++)p!==o&&(c[l++]=r.shape[p]);const u=new Array(i).fill(0),h=r.shape.slice();h[o]=1;const d=new Array(a);for(let p=0;p<d.length;p++){u[o]=p;const f=nr({inputs:{x:r},backend:e,attrs:{begin:u,size:h}});d[p]=Pt({inputs:{x:f},backend:e,attrs:{shape:c}}),e.disposeIntermediateTensorInfo(f)}return d}const eL={kernelName:Zc,backendName:"cpu",kernelFunc:tL};function nL(n){const{inputs:t,backend:e,attrs:s}=n,{x:r,segmentIds:o}=t,{numSegments:i}=s;rt(r,"unsortedSegmentSum");const a=r.shape.length,c=o.shape.length,l=[],u=[],h=a-c;let d=o;for(let f=0;f<h;++f){const m=ja({inputs:{input:d},backend:e,attrs:{dim:f+1}});d=m,u.push(m)}for(let f=0;f<i;++f){const m=xs(f,"int32"),g=e.makeTensorInfo([],"int32",m),x=a1({inputs:{a:g,b:d},backend:e}),b=ms({inputs:{x},backend:e,attrs:{dtype:"float32"}}),w=Sl({inputs:{a:b,b:r},backend:e}),y=Gi({inputs:{x:w},backend:e,attrs:{axis:0,keepDims:!1}});l.push(y),u.push(g),u.push(x),u.push(b),u.push(w),u.push(y)}const p=ry({inputs:l,backend:e,attrs:{axis:0}});return u.forEach(f=>e.disposeIntermediateTensorInfo(f)),p}const sL={kernelName:Jc,backendName:"cpu",kernelFunc:nL};const rL=[eA,VR,sA,oA,KR,aA,lA,hA,pA,mA,xA,yA,IA,kA,SA,EA,DA,FA,_A,QD,LA,BA,VA,UA,HR,XR,HA,WR,KA,XA,YA,JA,tF,nF,rF,iF,cF,uF,dF,fF,gF,bF,wF,IF,CF,$F,NF,TF,EF,RF,FF,qD,_F,YR,UF,ZR,GF,QR,YF,ZF,QF,eD,nO,rO,iO,cO,uO,sD,oD,UR,dO,jA,fO,gO,bO,KD,aD,lD,wO,hD,vO,$O,NO,RO,AO,OO,_O,pD,LO,BO,VO,UO,HO,KO,XO,mD,ZO,t_,s_,xD,yD,i_,l_,d_,ID,f_,g_,x_,oy,I_,XD,kD,C_,$_,N_,GR,Mu,E_,YD,ZD,JD,D_,F_,__,L_,B_,z_,W_,AD,G_,X_,Z_,eM,OD,sM,oM,aM,_D,e_,uM,dM,fM,gM,bM,wM,vM,kM,PD,$M,zD,NM,EM,DM,FM,_M,GD,DF,LM,BM,VM,UM,HM,vD,QM,eL,sL,m_];for(const n of rL)cg(n);const Ls={},oa={alpha:!1,antialias:!1,premultipliedAlpha:!1,preserveDrawingBuffer:!1,depth:!1,stencil:!1,failIfMajorPerformanceCaveat:!0};function oL(n,t){Ls[n]=t}function $n(n,t){if(!(n in Ls)||t!=null){const s=aL(n,t);if(s!==null)Ls[n]=s;else return console.log("Could not get context for WebGL version",n),null}const e=Ls[n];return e==null||e.isContextLost()?(delete Ls[n],$n(n)):(e.disable(e.DEPTH_TEST),e.disable(e.STENCIL_TEST),e.disable(e.BLEND),e.disable(e.DITHER),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SAMPLE_COVERAGE),e.enable(e.SCISSOR_TEST),e.enable(e.CULL_FACE),e.cullFace(e.BACK),Ls[n])}function iL(n){if(typeof OffscreenCanvas<"u"&&n===2)return new OffscreenCanvas(300,150);if(typeof document<"u")return document.createElement("canvas");throw new Error("Cannot create a canvas in this context")}function aL(n,t){if(n!==1&&n!==2)throw new Error("Cannot get WebGL rendering context, WebGL is disabled.");const e=t??iL(n);return e.addEventListener("webglcontextlost",s=>{s.preventDefault(),delete Ls[n]},!1),W().getBool("SOFTWARE_WEBGL_ENABLED")&&(oa.failIfMajorPerformanceCaveat=!1),n===1?e.getContext("webgl",oa)||e.getContext("experimental-webgl",oa):e.getContext("webgl2",oa)}var $o;(function(n){n[n.DENSE=0]="DENSE",n[n.SHARED_BATCH=1]="SHARED_BATCH"})($o||($o={}));var Xe;(function(n){n[n.RENDER=0]="RENDER",n[n.UPLOAD=1]="UPLOAD",n[n.PIXELS=2]="PIXELS",n[n.DOWNLOAD=3]="DOWNLOAD"})(Xe||(Xe={}));var xe;(function(n){n[n.UNPACKED_FLOAT16=0]="UNPACKED_FLOAT16",n[n.UNPACKED_FLOAT32=1]="UNPACKED_FLOAT32",n[n.PACKED_4X1_UNSIGNED_BYTE=2]="PACKED_4X1_UNSIGNED_BYTE",n[n.PACKED_2X2_FLOAT32=3]="PACKED_2X2_FLOAT32",n[n.PACKED_2X2_FLOAT16=4]="PACKED_2X2_FLOAT16"})(xe||(xe={}));function Hi(n,t){return[t,n]}function cL(n,t){return n*t}function ia(n){const t=q(n),e=Math.ceil(t/4);return su(e)}function qr(n,t){return[Math.max(1,Math.ceil(t/2)),Math.max(1,Math.ceil(n/2))]}function lL(n,t){const[e,s]=qr(n,t);return e*s*4}function Np(n,t){const e=n;let s,r,o,i,a,c,l,u,h,d;return W().getNumber("WEBGL_VERSION")===2?(s=e.R32F,r=e.R16F,o=e.RGBA16F,i=e.RGBA32F,a=e.RED,l=4,u=1,h=e.HALF_FLOAT,d=e.FLOAT,c=e.RGBA8):(s=n.RGBA,r=n.RGBA,o=n.RGBA,i=e.RGBA,a=n.RGBA,l=4,u=4,h=t!=null?t.HALF_FLOAT_OES:null,d=n.FLOAT,c=n.RGBA),{internalFormatFloat:s,internalFormatHalfFloat:r,internalFormatPackedHalfFloat:o,internalFormatPackedFloat:i,textureFormatFloat:a,downloadTextureFormat:c,downloadUnpackNumChannels:l,defaultNumChannels:u,textureTypeHalfFloat:h,textureTypeFloat:d}}function ot(n,t){const e=t();return W().getBool("DEBUG")&&uL(n),e}function uL(n){const t=n.getError();if(t!==n.NO_ERROR)throw new Error("WebGL Error: "+fL(n,t))}const hL=596e-10,dL=65504;function pL(n){return!!(W().getBool("WEBGL_RENDER_FLOAT32_ENABLED")||n===0||hL<Math.abs(n)&&Math.abs(n)<dL)}function fL(n,t){switch(t){case n.NO_ERROR:return"NO_ERROR";case n.INVALID_ENUM:return"INVALID_ENUM";case n.INVALID_VALUE:return"INVALID_VALUE";case n.INVALID_OPERATION:return"INVALID_OPERATION";case n.INVALID_FRAMEBUFFER_OPERATION:return"INVALID_FRAMEBUFFER_OPERATION";case n.OUT_OF_MEMORY:return"OUT_OF_MEMORY";case n.CONTEXT_LOST_WEBGL:return"CONTEXT_LOST_WEBGL";default:return`Unknown error code ${t}`}}function aa(n,t){return Jn(n,()=>n.getExtension(t),'Extension "'+t+'" not supported on this browser.')}function mL(n,t){const e=Jn(n,()=>n.createShader(n.VERTEX_SHADER),"Unable to create vertex WebGLShader.");if(ot(n,()=>n.shaderSource(e,t)),ot(n,()=>n.compileShader(e)),n.getShaderParameter(e,n.COMPILE_STATUS)===!1)throw console.log(n.getShaderInfoLog(e)),new Error("Failed to compile vertex shader.");return e}function gL(n,t){const e=Jn(n,()=>n.createShader(n.FRAGMENT_SHADER),"Unable to create fragment WebGLShader.");if(ot(n,()=>n.shaderSource(e,t)),ot(n,()=>n.compileShader(e)),W().get("ENGINE_COMPILE_ONLY"))return e;if(n.getShaderParameter(e,n.COMPILE_STATUS)===!1)throw iy(t,n.getShaderInfoLog(e)),new Error("Failed to compile fragment shader.");return e}const xL=/ERROR: [0-9]+:([0-9]+):/g;function iy(n,t){const e=xL.exec(t);if(e==null){console.log(`Couldn't parse line number in error: ${t}`),console.log(n);return}const s=+e[1],r=n.split(`
`),o=r.length.toString().length+2,i=r.map((h,d)=>br((d+1).toString(),o)+h);let a=0;for(let h=0;h<i.length;h++)a=Math.max(i[h].length,a);const c=i.slice(0,s-1),l=i.slice(s-1,s),u=i.slice(s);console.log(c.join(`
`)),console.log(t.split(`
`)[0]),console.log(`%c ${br(l[0],a)}`,"border:1px solid red; background-color:#e3d2d2; color:#a61717"),console.log(u.join(`
`))}function bL(n){return Jn(n,()=>n.createProgram(),"Unable to create WebGLProgram.")}function yL(n,t){if(ot(n,()=>n.linkProgram(t)),!W().get("ENGINE_COMPILE_ONLY")&&n.getProgramParameter(t,n.LINK_STATUS)===!1)throw console.log(n.getProgramInfoLog(t)),new Error("Failed to link vertex and fragment shaders.")}function ql(n,t){if(ot(n,()=>n.validateProgram(t)),n.getProgramParameter(t,n.VALIDATE_STATUS)===!1)throw console.log(n.getProgramInfoLog(t)),new Error("Shader program validation failed.")}function wL(n,t){const e=Jn(n,()=>n.createBuffer(),"Unable to create WebGLBuffer");return ot(n,()=>n.bindBuffer(n.ARRAY_BUFFER,e)),ot(n,()=>n.bufferData(n.ARRAY_BUFFER,t,n.STATIC_DRAW)),e}function IL(n,t){const e=Jn(n,()=>n.createBuffer(),"Unable to create WebGLBuffer");return ot(n,()=>n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e)),ot(n,()=>n.bufferData(n.ELEMENT_ARRAY_BUFFER,t,n.STATIC_DRAW)),e}function vL(n){return Jn(n,()=>n.createTexture(),"Unable to create WebGLTexture.")}function CL(n,t){const e=W().getNumber("WEBGL_MAX_TEXTURE_SIZE");if(n<=0||t<=0){const s=`[${n}x${t}]`;throw new Error("Requested texture size "+s+" is invalid.")}if(n>e||t>e){const s=`[${n}x${t}]`,r=`[${e}x${e}]`;throw new Error("Requested texture size "+s+" greater than WebGL maximum on this browser / GPU "+r+".")}}function kL(n){return Jn(n,()=>n.createFramebuffer(),"Unable to create WebGLFramebuffer.")}function Xf(n,t,e,s,r,o,i){const a=n.getAttribLocation(t,e);return a===-1?!1:(ot(n,()=>n.bindBuffer(n.ARRAY_BUFFER,s)),ot(n,()=>n.vertexAttribPointer(a,r,n.FLOAT,!1,o,i)),ot(n,()=>n.enableVertexAttribArray(a)),!0)}function $L(n,t,e){RL(n,e),ot(n,()=>n.activeTexture(n.TEXTURE0+e)),ot(n,()=>n.bindTexture(n.TEXTURE_2D,t))}function SL(n,t,e){return Jn(n,()=>n.getUniformLocation(t,e),'uniform "'+e+'" not present in program.')}function NL(n,t,e){return n.getUniformLocation(t,e)}function TL(n,t,e,s){ot(n,()=>$L(n,t,s)),ot(n,()=>n.uniform1i(e,s))}function Kl(n,t,e){ot(n,()=>n.bindFramebuffer(n.FRAMEBUFFER,e)),ot(n,()=>n.framebufferTexture2D(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,t,0))}function Yf(n,t){ot(n,()=>n.bindFramebuffer(n.FRAMEBUFFER,t)),ot(n,()=>n.framebufferTexture2D(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,null,0))}function ca(n){const t=n.checkFramebufferStatus(n.FRAMEBUFFER);if(t!==n.FRAMEBUFFER_COMPLETE)throw new Error("Error binding framebuffer: "+EL(n,t))}function EL(n,t){switch(t){case n.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:return"FRAMEBUFFER_INCOMPLETE_ATTACHMENT";case n.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:return"FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT";case n.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:return"FRAMEBUFFER_INCOMPLETE_DIMENSIONS";case n.FRAMEBUFFER_UNSUPPORTED:return"FRAMEBUFFER_UNSUPPORTED";default:return`unknown error ${t}`}}function Jn(n,t,e){const s=ot(n,()=>t());if(s==null)throw new Error(e);return s}function RL(n,t){const e=n.MAX_COMBINED_TEXTURE_IMAGE_UNITS-1,s=t+n.TEXTURE0;if(s<n.TEXTURE0||s>e){const r=`[gl.TEXTURE0, gl.TEXTURE${e}]`;throw new Error(`textureUnit must be in ${r}.`)}}function Or(n,t=2){return q(n.slice(0,n.length-t))}function _r(n){if(n.length===0)throw Error("Cannot get rows and columns of an empty shape array.");return[n.length>1?n[n.length-2]:1,n[n.length-1]]}function jl(n){let t=[1,1,1];return n.length===0||n.length===1&&n[0]===1||(t=[Or(n),..._r(n)]),t}function DL(n,t=!1){let e=W().getNumber("WEBGL_MAX_TEXTURE_SIZE"),s=W().getNumber("WEBGL_MAX_SIZE_FOR_NARROW_TEXTURE");s===1/0&&W().getBool("WEBGL_AUTO_SQUARIFY_NARROW_TEXTURE_SHAPE")&&(s=e/2),t&&(e=e*2,s=s*2,n=n.map((a,c)=>c>=n.length-2?Gu(n[c]):n[c]),n.length===1&&(n=[2,n[0]])),n.length!==2&&(n=gs(n).newShape);let r=q(n),o=null;n.length<=1&&r<=e?o=[1,r]:n.length===2&&n[0]<=e&&n[1]<=e?o=n:n.length===3&&n[0]*n[1]<=e&&n[2]<=e?o=[n[0]*n[1],n[2]]:n.length===3&&n[0]<=e&&n[1]*n[2]<=e?o=[n[0],n[1]*n[2]]:n.length===4&&n[0]*n[1]*n[2]<=e&&n[3]<=e?o=[n[0]*n[1]*n[2],n[3]]:n.length===4&&n[0]<=e&&n[1]*n[2]*n[3]<=e&&(o=[n[0],n[1]*n[2]*n[3]]);const i=o!=null&&Math.max(...o)>s&&Math.min(...o)<=(t?2:1)&&Math.min(...o)>0;if(o==null||i)if(t){const a=Or(n);let c=2,l=2;n.length&&([c,l]=_r(n)),r=a*(c/2)*(l/2),o=su(r).map(u=>u*2)}else o=su(r);return o}function la(n){return n%2===0}function Ya(n,t){if(n=n.slice(-2),t=t.slice(-2),Tt(n,t)||!n.length||!t.length||n[0]===0||n[1]===0||t[0]===0||t[1]===0)return!0;if(n.length!==t.length){const e=n.slice(-1)[0],s=t.slice(-1)[0];if(e===s||la(e)&&la(s)&&(n[0]===1||t[0]===1))return!0}return n[1]===t[1]&&la(n[0])&&la(t[0])}let Xl,Yl;function AL(n){if(Xl==null){const t=$n(n);Xl=t.getParameter(t.MAX_TEXTURE_SIZE)}return Xl}function FL(n){if(Yl==null){const t=$n(n);Yl=t.getParameter(t.MAX_TEXTURE_IMAGE_UNITS)}return Math.min(16,Yl)}function OL(n){if(n===0)return 0;let t;const e=$n(n);return on(e,"EXT_disjoint_timer_query_webgl2")&&n===2?t=2:on(e,"EXT_disjoint_timer_query")?t=1:t=0,t}function on(n,t){return n.getExtension(t)!=null}function Zf(n){try{if($n(n)!=null)return!0}catch(t){return console.log("Error when getting WebGL context: ",t),!1}return!1}function _L(n){if(n===0)return!1;const t=$n(n);if(n===1){if(!on(t,"OES_texture_float"))return!1}else if(!on(t,"EXT_color_buffer_float"))return!1;return Pu(t)}function ML(n){if(n===0)return!1;const t=$n(n);if(n===1){if(!on(t,"OES_texture_float")||!on(t,"WEBGL_color_buffer_float"))return!1}else{if(on(t,"EXT_color_buffer_float"))return Pu(t);const s="EXT_color_buffer_half_float";if(on(t,s)){const r=t.getExtension(s);return LL(t,r)}return!1}return Pu(t)}function Pu(n){const t=Np(n),e=n.createTexture();n.bindTexture(n.TEXTURE_2D,e),n.texImage2D(n.TEXTURE_2D,0,t.internalFormatFloat,1,1,0,t.textureFormatFloat,t.textureTypeFloat,null);const o=n.createFramebuffer();n.bindFramebuffer(n.FRAMEBUFFER,o),n.framebufferTexture2D(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,e,0);const i=n.checkFramebufferStatus(n.FRAMEBUFFER)===n.FRAMEBUFFER_COMPLETE;return n.bindTexture(n.TEXTURE_2D,null),n.bindFramebuffer(n.FRAMEBUFFER,null),n.deleteTexture(e),n.deleteFramebuffer(o),i}function LL(n,t){const e=Np(n,t),s=n.createTexture();n.bindTexture(n.TEXTURE_2D,s),n.texImage2D(n.TEXTURE_2D,0,e.internalFormatHalfFloat,1,1,0,e.textureFormatFloat,e.textureTypeHalfFloat,null);const i=n.createFramebuffer();n.bindFramebuffer(n.FRAMEBUFFER,i),n.framebufferTexture2D(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,s,0);const a=n.checkFramebufferStatus(n.FRAMEBUFFER)===n.FRAMEBUFFER_COMPLETE;return n.bindTexture(n.TEXTURE_2D,null),n.bindFramebuffer(n.FRAMEBUFFER,null),n.deleteTexture(s),n.deleteFramebuffer(i),a}function PL(n){return n!==2?!1:$n(n).fenceSync!=null}function qi(n,t){Array.isArray(n)||(n=[n]),n.forEach(e=>{e!=null&&S(e.dtype!=="complex64",()=>`${t} does not support complex64 tensors in the WebGL backend.`)})}const lt=W();lt.registerFlag("HAS_WEBGL",()=>lt.getNumber("WEBGL_VERSION")>0);lt.registerFlag("WEBGL_VERSION",()=>Zf(2)?2:Zf(1)?1:0);lt.registerFlag("WEBGL_CHECK_NUMERICAL_PROBLEMS",()=>!1);lt.registerFlag("WEBGL_BUFFER_SUPPORTED",()=>lt.get("WEBGL_VERSION")===2);lt.registerFlag("WEBGL_CPU_FORWARD",()=>!0);lt.registerFlag("WEBGL_FORCE_F16_TEXTURES",()=>!1);lt.registerFlag("WEBGL_PACK",()=>lt.getBool("HAS_WEBGL"));lt.registerFlag("WEBGL_PACK_NORMALIZATION",()=>lt.getBool("WEBGL_PACK"));lt.registerFlag("WEBGL_PACK_CLIP",()=>lt.getBool("WEBGL_PACK"));lt.registerFlag("WEBGL_PACK_DEPTHWISECONV",()=>lt.getBool("WEBGL_PACK"));lt.registerFlag("WEBGL_PACK_BINARY_OPERATIONS",()=>lt.getBool("WEBGL_PACK"));lt.registerFlag("WEBGL_PACK_UNARY_OPERATIONS",()=>lt.getBool("WEBGL_PACK"));lt.registerFlag("WEBGL_PACK_ARRAY_OPERATIONS",()=>lt.getBool("WEBGL_PACK"));lt.registerFlag("WEBGL_PACK_IMAGE_OPERATIONS",()=>lt.getBool("WEBGL_PACK"));lt.registerFlag("WEBGL_PACK_REDUCE",()=>lt.getBool("WEBGL_PACK"));lt.registerFlag("WEBGL_LAZILY_UNPACK",()=>lt.getBool("WEBGL_PACK"));lt.registerFlag("WEBGL_CONV_IM2COL",()=>lt.getBool("WEBGL_PACK"));lt.registerFlag("WEBGL_MAX_TEXTURE_SIZE",()=>AL(lt.getNumber("WEBGL_VERSION")));lt.registerFlag("WEBGL_MAX_TEXTURES_IN_SHADER",()=>FL(lt.getNumber("WEBGL_VERSION")));lt.registerFlag("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION",()=>{const n=lt.getNumber("WEBGL_VERSION");return n===0?0:OL(n)});lt.registerFlag("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE",()=>lt.getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION")>0&&!yg());lt.registerFlag("WEBGL_RENDER_FLOAT32_CAPABLE",()=>_L(lt.getNumber("WEBGL_VERSION")));lt.registerFlag("WEBGL_RENDER_FLOAT32_ENABLED",()=>lt.getBool("WEBGL_FORCE_F16_TEXTURES")?!1:lt.getBool("WEBGL_RENDER_FLOAT32_CAPABLE"));lt.registerFlag("WEBGL_DOWNLOAD_FLOAT_ENABLED",()=>ML(lt.getNumber("WEBGL_VERSION")));lt.registerFlag("WEBGL_FENCE_API_ENABLED",()=>PL(lt.getNumber("WEBGL_VERSION")));lt.registerFlag("WEBGL_SIZE_UPLOAD_UNIFORM",()=>lt.getBool("WEBGL_RENDER_FLOAT32_ENABLED")?4:0);lt.registerFlag("WEBGL_DELETE_TEXTURE_THRESHOLD",()=>-1,n=>{if(n<0&&n!==-1)throw new Error(`WEBGL_DELETE_TEXTURE_THRESHOLD must be -1 (indicating never delete) or at least 0, but got ${n}.`)});lt.registerFlag("WEBGL_FLUSH_THRESHOLD",()=>yg()?1:-1,n=>{if(n<0&&n!==-1)throw new Error(`WEBGL_FLUSH_THRESHOLD must be -1 (indicating never manual flush) or at least 0, but got ${n}.`)});lt.registerFlag("CPU_HANDOFF_SIZE_THRESHOLD",()=>128);lt.registerFlag("WEBGL_USE_SHAPES_UNIFORMS",()=>!1);lt.registerFlag("TOPK_LAST_DIM_CPU_HANDOFF_SIZE_THRESHOLD",()=>1e5);lt.registerFlag("TOPK_K_CPU_HANDOFF_THRESHOLD",()=>128);lt.registerFlag("WEBGL_EXP_CONV",()=>!1);lt.registerFlag("SOFTWARE_WEBGL_ENABLED",()=>lt.getBool("IS_TEST"));lt.registerFlag("WEBGL_MAX_SIZE_FOR_NARROW_TEXTURE",()=>1/0);lt.registerFlag("WEBGL_AUTO_SQUARIFY_NARROW_TEXTURE_SHAPE",()=>!1);lt.registerFlag("WEBGL2_ISNAN_CUSTOM",()=>!1);function De(){let n,t,e,s,r,o,i,a,c,l;return W().getNumber("WEBGL_VERSION")===2?(n="#version 300 es",t="in",e="out",s="in",r="texture",o="outputColor",i="out vec4 outputColor;",a=W().getBool("WEBGL2_ISNAN_CUSTOM")?`
      bool isnan_custom(float val) {
        uint floatToUint = floatBitsToUint(val);
        return (floatToUint & 0x7fffffffu) > 0x7f800000u;
      }

      bvec4 isnan_custom(vec4 val) {
        return bvec4(isnan_custom(val.x),
          isnan_custom(val.y), isnan_custom(val.z), isnan_custom(val.w));
      }

      #define isnan(value) isnan_custom(value)
    `:"",c="",l=`
      #define round(value) newRound(value)
      int newRound(float value) {
        return int(floor(value + 0.5));
      }

      ivec4 newRound(vec4 value) {
        return ivec4(floor(value + vec4(0.5)));
      }
    `):(n="",t="attribute",e="varying",s="varying",r="texture2D",o="gl_FragColor",i="",a=`
      #define isnan(value) isnan_custom(value)
      bool isnan_custom(float val) {
        return (val > 0. || val < 1. || val == 0.) ? false : true;
      }
      bvec4 isnan_custom(vec4 val) {
        return bvec4(isnan(val.x), isnan(val.y), isnan(val.z), isnan(val.w));
      }
    `,c=`
      uniform float INFINITY;

      bool isinf(float val) {
        return abs(val) == INFINITY;
      }
      bvec4 isinf(vec4 val) {
        return equal(abs(val), vec4(INFINITY));
      }
    `,l=`
      int round(float value) {
        return int(floor(value + 0.5));
      }

      ivec4 round(vec4 value) {
        return ivec4(floor(value + vec4(0.5)));
      }
    `),{version:n,attribute:t,varyingVs:e,varyingFs:s,texture2D:r,output:o,defineOutput:i,defineSpecialNaN:a,defineSpecialInf:c,defineRound:l}}function ir(n,t,e="index"){const s=ht(t);return s.map((r,o)=>{const i=`int ${n[o]} = ${e} / ${r}`,a=o===s.length-1?`int ${n[o+1]} = ${e} - ${n[o]} * ${r}`:`index -= ${n[o]} * ${r}`;return`${i}; ${a};`}).join("")}function Nl(n,t,e="index"){const s=ht(t);return s.map((r,o)=>{const i=`int ${n[o]} = ${e} / outShapeStrides[${o}]`,a=o===s.length-1?`int ${n[o+1]} = ${e} - ${n[o]} * outShapeStrides[${o}]`:`index -= ${n[o]} * outShapeStrides[${o}]`;return`${i}; ${a};`}).join("")}function BL(n,t){const e=n.length,s=n.map(o=>`${t}[${o}]`),r=new Array(e-1);r[e-2]=s[e-1];for(let o=e-3;o>=0;--o)r[o]=`(${r[o+1]} * ${s[o+1]})`;return r}function zL(n,t,e="index"){const s=n.map((o,i)=>i),r=BL(s,t);return r.map((o,i)=>{const a=`int ${n[i]} = ${e} / ${r[i]}`,c=i===r.length-1?`int ${n[i+1]} = ${e} - ${n[i]} * ${r[i]}`:`index -= ${n[i]} * ${r[i]}`;return`${a}; ${c};`}).join("")}function Tp(n){const t=ht(n).map(e=>e.toString());return`
  int getFlatIndex(ivec3 coords) {
    return coords.x * ${t[0]} + coords.y * ${t[1]} + coords.z;
  }
`}function Ep(){return`
  int getFlatIndex(ivec3 coords) {
    return coords.x * outShapeStrides[0] + coords.y * outShapeStrides[1] + coords.z;
  }
`}const ay=`
  const float FLOAT_MAX = 1.70141184e38;
  const float FLOAT_MIN = 1.17549435e-38;

  lowp vec4 encode_float(highp float v) {
    if (isnan(v)) {
      return vec4(255, 255, 255, 255);
    }

    highp float av = abs(v);

    if(av < FLOAT_MIN) {
      return vec4(0.0, 0.0, 0.0, 0.0);
    } else if(v > FLOAT_MAX) {
      return vec4(0.0, 0.0, 128.0, 127.0) / 255.0;
    } else if(v < -FLOAT_MAX) {
      return vec4(0.0, 0.0,  128.0, 255.0) / 255.0;
    }

    highp vec4 c = vec4(0,0,0,0);

    highp float e = floor(log2(av));
    highp float m = exp2(fract(log2(av))) - 1.0;

    c[2] = floor(128.0 * m);
    m -= c[2] / 128.0;
    c[1] = floor(32768.0 * m);
    m -= c[1] / 32768.0;
    c[0] = floor(8388608.0 * m);

    highp float ebias = e + 127.0;
    c[3] = floor(ebias / 2.0);
    ebias -= c[3] * 2.0;
    c[2] += floor(ebias) * 128.0;

    c[3] += 128.0 * step(0.0, -v);

    return c / 255.0;
  }
`;const{getBroadcastDims:cy}=H2;function VL(n,t,e){const s=[];if(n.forEach(p=>{const f=q(p.shapeInfo.logicalShape);if(p.shapeInfo.isUniform?s.push(`uniform float ${p.name}${f>1?`[${f}]`:""};`):(s.push(`uniform sampler2D ${p.name};`),s.push(`uniform int offset${p.name};`)),e.enableShapeUniforms){const{uniformShape:m}=Rp(e.packedInputs,p.shapeInfo.logicalShape,p.shapeInfo.texShape);switch(m.length){case 1:s.push(`uniform int ${p.name}Shape;`);break;case 2:s.push(`uniform ivec2 ${p.name}Shape;`);break;case 3:s.push(`uniform ivec3 ${p.name}Shape;`);break;case 4:s.push(`uniform ivec4 ${p.name}Shape;`);break}s.push(`uniform ivec2 ${p.name}TexShape;`)}}),e.enableShapeUniforms){switch(t.logicalShape.length){case 1:s.push("uniform int outShape;");break;case 2:s.push("uniform ivec2 outShape;"),s.push("uniform int outShapeStrides;");break;case 3:s.push("uniform ivec3 outShape;"),s.push("uniform ivec2 outShapeStrides;");break;case 4:s.push("uniform ivec4 outShape;"),s.push("uniform ivec3 outShapeStrides;");break}s.push("uniform ivec2 outTexShape;")}e.customUniforms&&e.customUniforms.forEach(p=>{s.push(`uniform ${p.type} ${p.name}${p.arrayIndex?`[${p.arrayIndex}]`:""};`)});const r=s.join(`
`),o=n.map(p=>WL(p,t,e.packedInputs,e.enableShapeUniforms)).join(`
`),i=t.texShape,a=De(),c=HL(a);let l,u,h=jL(a);return t.isPacked?(l=UL(t.logicalShape,i,e.enableShapeUniforms),u=KL(a)):(l=GL(t.logicalShape,i,e.enableShapeUniforms),u=qL(a)),e.packedInputs&&(h+=JL),[h,c,u,r,l,o,e.userCode].join(`
`)}function Kr(n,t=!1){const e=n.shapeInfo.logicalShape;switch(e.length){case 0:return uP(n,t);case 1:return dP(n,t);case 2:return fP(n,t);case 3:return gP(n,t);case 4:return bP(n,t);case 5:return yP(n);case 6:return wP(n);default:throw new Error(`${e.length}-D input sampling is not yet supported`)}}function ly(n,t){switch(n.shapeInfo.logicalShape.length){case 0:return lP(n);case 1:return hP(n,t);case 2:return pP(n,t);case 3:return mP(n,t);default:return xP(n,t)}}function WL(n,t,e=!1,s){let r="";e?r+=ly(n,s):r+=Kr(n,s);const o=n.shapeInfo.logicalShape,i=t.logicalShape;return o.length<=i.length&&(e?r+=IP(n,t):r+=vP(n,t)),r}function UL(n,t,e){switch(n.length){case 0:return uy();case 1:return QL(n,t,e);case 2:return aP(n,t,e);case 3:return eP(n,t,e);default:return sP(n,t,e)}}function GL(n,t,e){switch(n.length){case 0:return uy();case 1:return tP(n,t,e);case 2:return cP(n,t,e);case 3:return nP(n,t,e);case 4:return rP(n,t,e);case 5:return oP(n,t);case 6:return iP(n,t);default:throw new Error(`${n.length}-D output sampling is not yet supported`)}}function HL(n){return`
    float sampleTexture(sampler2D textureSampler, vec2 uv) {
      return ${n.texture2D}(textureSampler, uv).r;
    }
  `}function qL(n){return`
    void setOutput(float val) {
      ${n.output} = vec4(val, 0, 0, 0);
    }
  `}function KL(n){return`
    void setOutput(vec4 val) {
      ${n.output} = val;
    }
  `}function jL(n){return`${n.version}
    precision highp float;
    precision highp int;
    precision highp sampler2D;
    ${n.varyingFs} vec2 resultUV;
    ${n.defineOutput}
    const vec2 halfCR = vec2(0.5, 0.5);

    struct ivec5
    {
      int x;
      int y;
      int z;
      int w;
      int u;
    };

    struct ivec6
    {
      int x;
      int y;
      int z;
      int w;
      int u;
      int v;
    };

    uniform float NAN;
    ${n.defineSpecialNaN}
    ${n.defineSpecialInf}
    ${n.defineRound}

    int imod(int x, int y) {
      return x - y * (x / y);
    }

    int idiv(int a, int b, float sign) {
      int res = a / b;
      int mod = imod(a, b);
      if (sign < 0. && mod != 0) {
        res -= 1;
      }
      return res;
    }

    //Based on the work of Dave Hoskins
    //https://www.shadertoy.com/view/4djSRW
    #define HASHSCALE1 443.8975
    float random(float seed){
      vec2 p = resultUV * seed;
      vec3 p3  = fract(vec3(p.xyx) * HASHSCALE1);
      p3 += dot(p3, p3.yzx + 19.19);
      return fract((p3.x + p3.y) * p3.z);
    }

    ${XL}
    ${YL}
    ${ZL}
  `}const XL=`
vec2 uvFromFlat(int texNumR, int texNumC, int index) {
  int texR = index / texNumC;
  int texC = index - texR * texNumC;
  return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);
}
vec2 packedUVfrom1D(int texNumR, int texNumC, int index) {
  int texelIndex = index / 2;
  int texR = texelIndex / texNumC;
  int texC = texelIndex - texR * texNumC;
  return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);
}
`,YL=`
vec2 packedUVfrom2D(int texelsInLogicalRow, int texNumR,
  int texNumC, int row, int col) {
  int texelIndex = (row / 2) * texelsInLogicalRow + (col / 2);
  int texR = texelIndex / texNumC;
  int texC = texelIndex - texR * texNumC;
  return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);
}
`,ZL=`
vec2 packedUVfrom3D(int texNumR, int texNumC,
    int texelsInBatch, int texelsInLogicalRow, int b,
    int row, int col) {
  int index = b * texelsInBatch + (row / 2) * texelsInLogicalRow + (col / 2);
  int texR = index / texNumC;
  int texC = index - texR * texNumC;
  return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);
}
`,JL=`
  float getChannel(vec4 frag, vec2 innerDims) {
    vec2 modCoord = mod(innerDims, 2.);
    return modCoord.x == 0. ?
      (modCoord.y == 0. ? frag.r : frag.g) :
      (modCoord.y == 0. ? frag.b : frag.a);
  }
  float getChannel(vec4 frag, int dim) {
    float modCoord = mod(float(dim), 2.);
    return modCoord == 0. ? frag.r : frag.g;
  }
`;function uy(){return`
    int getOutputCoords() {
      return 0;
    }
  `}function QL(n,t,e){const s=[Math.ceil(t[0]/2),Math.ceil(t[1]/2)];return s[0]===1?e?`
      int getOutputCoords() {
        return 2 * int(resultUV.x * ceil(float(outTexShape[1]) / 2.0));
      }
    `:`
      int getOutputCoords() {
        return 2 * int(resultUV.x * ${s[1]}.0);
      }
    `:s[1]===1?e?`
      int getOutputCoords() {
        return 2 * int(resultUV.y * ceil(float(outTexShape[0]) / 2.0));
      }
    `:`
      int getOutputCoords() {
        return 2 * int(resultUV.y * ${s[0]}.0);
      }
    `:e?`
    int getOutputCoords() {
      ivec2 packedTexShape = ivec2(ceil(float(outTexShape[0]) / 2.0), ceil(float(outTexShape[1]) / 2.0));
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(packedTexShape[0], packedTexShape[1]));
      return 2 * (resTexRC.x * packedTexShape[1] + resTexRC.y);
    }
  `:`
    int getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(${s[0]}, ${s[1]}));
      return 2 * (resTexRC.x * ${s[1]} + resTexRC.y);
    }
  `}function tP(n,t,e){return t[0]===1?e?`
      int getOutputCoords() {
        return int(resultUV.x * float(outTexShape[1]));
      }
    `:`
      int getOutputCoords() {
        return int(resultUV.x * ${t[1]}.0);
      }
    `:t[1]===1?e?`
      int getOutputCoords() {
        return int(resultUV.y * float(outTexShape[0]));
      }
    `:`
      int getOutputCoords() {
        return int(resultUV.y * ${t[0]}.0);
      }
    `:e?`
    int getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(outTexShape[0], outTexShape[1]));
      return resTexRC.x * outTexShape[1] + resTexRC.y;
    }
  `:`
    int getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(${t[0]}, ${t[1]}));
      return resTexRC.x * ${t[1]} + resTexRC.y;
    }
  `}function eP(n,t,e){if(e)return`
    ivec3 getOutputCoords() {
      ivec2 packedTexShape = ivec2(ceil(float(outTexShape[0]) / 2.0), ceil(float(outTexShape[1]) / 2.0));
      int texelsInLogicalRow = int(ceil(float(outShape[2]) / 2.0));
      int texelsInBatch = texelsInLogicalRow * int(ceil(float(outShape[1]) / 2.0));
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(packedTexShape[0], packedTexShape[1]));
      int index = resTexRC.x * packedTexShape[1] + resTexRC.y;

      int b = index / texelsInBatch;
      index -= b * texelsInBatch;

      int r = 2 * (index / texelsInLogicalRow);
      int c = imod(index, texelsInLogicalRow) * 2;

      return ivec3(b, r, c);
    }
  `;const s=[Math.ceil(t[0]/2),Math.ceil(t[1]/2)],r=Math.ceil(n[2]/2),o=r*Math.ceil(n[1]/2);return`
    ivec3 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(${s[0]}, ${s[1]}));
      int index = resTexRC.x * ${s[1]} + resTexRC.y;

      int b = index / ${o};
      index -= b * ${o};

      int r = 2 * (index / ${r});
      int c = imod(index, ${r}) * 2;

      return ivec3(b, r, c);
    }
  `}function nP(n,t,e){if(e)return`
  ivec3 getOutputCoords() {
    ivec2 resTexRC = ivec2(resultUV.yx *
                           vec2(outTexShape[0], outTexShape[1]));
    int index = resTexRC.x * outTexShape[1] + resTexRC.y;
    ${Nl(["r","c","d"],n)}
    return ivec3(r, c, d);
  }
`;const s=ir(["r","c","d"],n);return`
    ivec3 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(${t[0]}, ${t[1]}));
      int index = resTexRC.x * ${t[1]} + resTexRC.y;
      ${s}
      return ivec3(r, c, d);
    }
  `}function sP(n,t,e){if(e)return`
    ivec4 getOutputCoords() {
      ivec2 packedTexShape = ivec2(ceil(float(outTexShape[0]) / 2.0), ceil(float(outTexShape[1]) / 2.0));
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(packedTexShape[0], packedTexShape[1]));
      int index = resTexRC.x * packedTexShape[1] + resTexRC.y;

      int texelsInLogicalRow = int(ceil(float(outShape[3]) / 2.0));
      int texelsInBatch = texelsInLogicalRow * int(ceil(float(outShape[2]) / 2.0));
      int texelsInBatchN = texelsInBatch * outShape[1];

      int b2 = index / texelsInBatchN;
      index -= b2 * texelsInBatchN;

      int b = index / texelsInBatch;
      index -= b * texelsInBatch;

      int r = 2 * (index / texelsInLogicalRow);
      int c = imod(index, texelsInLogicalRow) * 2;

      return ivec4(b2, b, r, c);
    }
  `;const s=[Math.ceil(t[0]/2),Math.ceil(t[1]/2)],r=Math.ceil(n[n.length-1]/2),o=r*Math.ceil(n[n.length-2]/2);let i=o,a="",c="b, r, c";for(let l=2;l<n.length-1;l++)i*=n[n.length-l-1],a=`
      int b${l} = index / ${i};
      index -= b${l} * ${i};
    `+a,c=`b${l}, `+c;return`
    ivec${n.length} getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(${s[0]}, ${s[1]}));
      int index = resTexRC.x * ${s[1]} + resTexRC.y;

      ${a}

      int b = index / ${o};
      index -= b * ${o};

      int r = 2 * (index / ${r});
      int c = imod(index, ${r}) * 2;

      return ivec${n.length}(${c});
    }
  `}function rP(n,t,e){if(e)return`
    ivec4 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
        vec2(outTexShape[0], outTexShape[1]));
      int index = resTexRC.x * outTexShape[1] + resTexRC.y;
      ${Nl(["r","c","d","d2"],n)}
      return ivec4(r, c, d, d2);
    }
  `;const s=ir(["r","c","d","d2"],n);return`
    ivec4 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
        vec2(${t[0]}, ${t[1]}));
      int index = resTexRC.x * ${t[1]} + resTexRC.y;
      ${s}
      return ivec4(r, c, d, d2);
    }
  `}function oP(n,t){const e=ir(["r","c","d","d2","d3"],n);return`
    ivec5 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx * vec2(${t[0]},
                             ${t[1]}));

      int index = resTexRC.x * ${t[1]} + resTexRC.y;

      ${e}

      ivec5 outShape = ivec5(r, c, d, d2, d3);
      return outShape;
    }
  `}function iP(n,t){const e=ir(["r","c","d","d2","d3","d4"],n);return`
    ivec6 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
        vec2(${t[0]}, ${t[1]}));
      int index = resTexRC.x * ${t[1]} + resTexRC.y;

      ${e}

      ivec6 result = ivec6(r, c, d, d2, d3, d4);
      return result;
    }
  `}function aP(n,t,e){const s=[Math.ceil(t[0]/2),Math.ceil(t[1]/2)];if(Tt(n,t))return e?`
      ivec2 getOutputCoords() {
        ivec2 packedTexShape = ivec2(ceil(float(outTexShape[0]) / 2.0), ceil(float(outTexShape[1]) / 2.0));
        return 2 * ivec2(resultUV.yx * vec2(packedTexShape[0], packedTexShape[1]));
      }
    `:`
      ivec2 getOutputCoords() {
        return 2 * ivec2(resultUV.yx * vec2(${s[0]}, ${s[1]}));
      }
    `;const r=Math.ceil(n[1]/2);return e?`
    ivec2 getOutputCoords() {
      ivec2 packedTexShape = ivec2(ceil(float(outTexShape[0]) / 2.0), ceil(float(outTexShape[1]) / 2.0));
      int texelsInLogicalRow = int(ceil(float(outShape[1]) / 2.0));
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(packedTexShape[0], packedTexShape[1]));

      int index = resTexRC.x * packedTexShape[1] + resTexRC.y;
      int r = 2 * (index / texelsInLogicalRow);
      int c = imod(index, texelsInLogicalRow) * 2;

      return ivec2(r, c);
    }
  `:`
    ivec2 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(${s[0]}, ${s[1]}));

      int index = resTexRC.x * ${s[1]} + resTexRC.y;
      int r = 2 * (index / ${r});
      int c = imod(index, ${r}) * 2;

      return ivec2(r, c);
    }
  `}function cP(n,t,e){return Tt(n,t)?e?`
      ivec2 getOutputCoords() {
        return ivec2(resultUV.yx * vec2(outTexShape[0], outTexShape[1]));
      }
    `:`
      ivec2 getOutputCoords() {
        return ivec2(resultUV.yx * vec2(${t[0]}, ${t[1]}));
      }
    `:n[1]===1?e?`
      ivec2 getOutputCoords() {
        ivec2 resTexRC = ivec2(resultUV.yx *
                               vec2(outTexShape[0], outTexShape[1]));
        int index = resTexRC.x * outTexShape[1] + resTexRC.y;
        return ivec2(index, 0);
      }
    `:`
      ivec2 getOutputCoords() {
        ivec2 resTexRC = ivec2(resultUV.yx *
                               vec2(${t[0]}, ${t[1]}));
        int index = resTexRC.x * ${t[1]} + resTexRC.y;
        return ivec2(index, 0);
      }
    `:n[0]===1?e?`
      ivec2 getOutputCoords() {
        ivec2 resTexRC = ivec2(resultUV.yx *
                               vec2(outTexShape[0], outTexShape[1]));
        int index = resTexRC.x * outTexShape[1] + resTexRC.y;
        return ivec2(0, index);
      }
    `:`
      ivec2 getOutputCoords() {
        ivec2 resTexRC = ivec2(resultUV.yx *
                               vec2(${t[0]}, ${t[1]}));
        int index = resTexRC.x * ${t[1]} + resTexRC.y;
        return ivec2(0, index);
      }
    `:e?`
    ivec2 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(outTexShape[0], outTexShape[1]));
      int index = resTexRC.x * outTexShape[1] + resTexRC.y;
      int r = index / outShape[1];
      int c = index - r * outShape[1];
      return ivec2(r, c);
    }
  `:`
    ivec2 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(${t[0]}, ${t[1]}));
      int index = resTexRC.x * ${t[1]} + resTexRC.y;
      int r = index / ${n[1]};
      int c = index - r * ${n[1]};
      return ivec2(r, c);
    }
  `}function ar(n){return`offset${n}`}function lP(n){const t=n.name,e="get"+t.charAt(0).toUpperCase()+t.slice(1),s=De();return`
    vec4 ${e}() {
      return ${s.texture2D}(${t}, halfCR);
    }
  `}function uP(n,t){const e=n.name,s="get"+e.charAt(0).toUpperCase()+e.slice(1);if(n.shapeInfo.isUniform)return`float ${s}() {return ${e};}`;const[r,o]=n.shapeInfo.texShape;if(r===1&&o===1)return`
      float ${s}() {
        return sampleTexture(${e}, halfCR);
      }
    `;const i=ar(e);if(t)return`
    float ${s}() {
      vec2 uv = uvFromFlat(${e}TexShape[0], ${e}TexShape[1], ${i});
      return sampleTexture(${e}, uv);
    }
  `;const[a,c]=n.shapeInfo.texShape;return`
    float ${s}() {
      vec2 uv = uvFromFlat(${a}, ${c}, ${i});
      return sampleTexture(${e}, uv);
    }
  `}function hP(n,t){const e=n.name,s="get"+e.charAt(0).toUpperCase()+e.slice(1),r=n.shapeInfo.texShape,o=De();if(t)return`
    vec4 ${s}(int index) {
      ivec2 packedTexShape = ivec2(ceil(float(${e}TexShape[0]) / 2.0), ceil(float(${e}TexShape[1]) / 2.0));
      vec2 uv = packedUVfrom1D(
        packedTexShape[0], packedTexShape[1], index);
      return ${o.texture2D}(${e}, uv);
    }
  `;const i=[Math.ceil(r[0]/2),Math.ceil(r[1]/2)];return`
    vec4 ${s}(int index) {
      vec2 uv = packedUVfrom1D(
        ${i[0]}, ${i[1]}, index);
      return ${o.texture2D}(${e}, uv);
    }
  `}function dP(n,t){const e=n.name,s="get"+e.charAt(0).toUpperCase()+e.slice(1);if(n.shapeInfo.isUniform)return`
      float ${s}(int index) {
        ${jr(n)}
      }
    `;const r=n.shapeInfo.texShape,o=r[0],i=r[1];if(i===1&&o===1)return`
      float ${s}(int index) {
        return sampleTexture(${e}, halfCR);
      }
    `;const a=ar(e);return i===1?t?`
      float ${s}(int index) {
        vec2 uv = vec2(0.5, (float(index + ${a}) + 0.5) / float(${e}TexShape[0]));
        return sampleTexture(${e}, uv);
      }
    `:`
      float ${s}(int index) {
        vec2 uv = vec2(0.5, (float(index + ${a}) + 0.5) / ${o}.0);
        return sampleTexture(${e}, uv);
      }
    `:o===1?t?`
      float ${s}(int index) {
        vec2 uv = vec2((float(index + ${a}) + 0.5) / float(${e}TexShape[1]), 0.5);
        return sampleTexture(${e}, uv);
      }
    `:`
      float ${s}(int index) {
        vec2 uv = vec2((float(index + ${a}) + 0.5) / ${i}.0, 0.5);
        return sampleTexture(${e}, uv);
      }
    `:t?`
    float ${s}(int index) {
      vec2 uv = uvFromFlat(${e}TexShape[0], ${e}TexShape[1], index + ${a});
      return sampleTexture(${e}, uv);
    }
  `:`
    float ${s}(int index) {
      vec2 uv = uvFromFlat(${o}, ${i}, index + ${a});
      return sampleTexture(${e}, uv);
    }
  `}function pP(n,t){const e=n.shapeInfo.logicalShape,s=n.name,r="get"+s.charAt(0).toUpperCase()+s.slice(1),o=n.shapeInfo.texShape,i=o[0],a=o[1],c=De();if(o!=null&&Tt(e,o))return t?`
      vec4 ${r}(int row, int col) {
        vec2 uv = (vec2(col, row) + halfCR) / vec2(${s}TexShape[1], ${s}TexShape[0]);

        return ${c.texture2D}(${s}, uv);
      }
    `:`
      vec4 ${r}(int row, int col) {
        vec2 uv = (vec2(col, row) + halfCR) / vec2(${a}.0, ${i}.0);

        return ${c.texture2D}(${s}, uv);
      }
    `;if(t)return`
    vec4 ${r}(int row, int col) {
      ivec2 packedTexShape = ivec2(ceil(float(${s}TexShape[0]) / 2.0), ceil(float(${s}TexShape[1]) / 2.0));
      int valuesPerRow = int(ceil(float(${s}Shape[1]) / 2.0));
      vec2 uv = packedUVfrom2D(valuesPerRow, packedTexShape[0], packedTexShape[1], row, col);
      return ${c.texture2D}(${s}, uv);
    }
  `;const l=[Math.ceil(o[0]/2),Math.ceil(o[1]/2)],u=Math.ceil(e[1]/2);return`
    vec4 ${r}(int row, int col) {
      vec2 uv = packedUVfrom2D(${u}, ${l[0]}, ${l[1]}, row, col);
      return ${c.texture2D}(${s}, uv);
    }
  `}function fP(n,t){const e=n.shapeInfo.logicalShape,s=n.name,r="get"+s.charAt(0).toUpperCase()+s.slice(1),o=n.shapeInfo.texShape;if(o!=null&&Tt(e,o)){if(t)return`
      float ${r}(int row, int col) {
        vec2 uv = (vec2(col, row) + halfCR) / vec2(${s}TexShape[1], ${s}TexShape[0]);
        return sampleTexture(${s}, uv);
      }
    `;const d=o[0],p=o[1];return`
    float ${r}(int row, int col) {
      vec2 uv = (vec2(col, row) + halfCR) / vec2(${p}.0, ${d}.0);
      return sampleTexture(${s}, uv);
    }
  `}const{newShape:i,keptDims:a}=gs(e),c=i;if(c.length<e.length){const d=Xr(n,c),p=["row","col"];return`
      ${Kr(d,t)}
      float ${r}(int row, int col) {
        return ${r}(${Yr(p,a)});
      }
    `}if(n.shapeInfo.isUniform)return`
      float ${r}(int row, int col) {
        int index = round(dot(vec2(row, col), vec2(${e[1]}, 1)));
        ${jr(n)}
      }
    `;const l=o[0],u=o[1],h=ar(s);return u===1?t?`
      float ${r}(int row, int col) {
        float index = dot(vec3(row, col, ${h}), vec3(${s}Shape[1], 1, 1));
        vec2 uv = vec2(0.5, (index + 0.5) / float(${s}TexShape[0]));
        return sampleTexture(${s}, uv);
      }
    `:`
    float ${r}(int row, int col) {
      float index = dot(vec3(row, col, ${h}), vec3(${e[1]}, 1, 1));
      vec2 uv = vec2(0.5, (index + 0.5) / ${l}.0);
      return sampleTexture(${s}, uv);
    }
  `:l===1?t?`
      float ${r}(int row, int col) {
        float index = dot(vec3(row, col, ${h}), vec3(${s}Shape[1], 1, 1));
        vec2 uv = vec2((index + 0.5) / float(${s}TexShape[1]), 0.5);
        return sampleTexture(${s}, uv);
      }
    `:`
    float ${r}(int row, int col) {
      float index = dot(vec3(row, col, ${h}), vec3(${e[1]}, 1, 1));
      vec2 uv = vec2((index + 0.5) / ${u}.0, 0.5);
      return sampleTexture(${s}, uv);
    }
  `:t?`
      float ${r}(int row, int col) {
        // Explicitly use integer operations as dot() only works on floats.
        int index = row * ${s}Shape[1] + col + ${h};
        vec2 uv = uvFromFlat(${s}TexShape[0], ${s}TexShape[1], index);
        return sampleTexture(${s}, uv);
      }
    `:`
  float ${r}(int row, int col) {
    // Explicitly use integer operations as dot() only works on floats.
    int index = row * ${e[1]} + col + ${h};
    vec2 uv = uvFromFlat(${l}, ${u}, index);
    return sampleTexture(${s}, uv);
  }
`}function mP(n,t){const e=n.shapeInfo.logicalShape,s=n.name,r="get"+s.charAt(0).toUpperCase()+s.slice(1),o=n.shapeInfo.texShape,i=[Math.ceil(o[0]/2),Math.ceil(o[1]/2)];if(e[0]===1){const d=e.slice(1),p=[1,2],f=Xr(n,d),m=["b","row","col"];return`
        ${ly(f,t)}
        vec4 ${r}(int b, int row, int col) {
          return ${r}(${Yr(m,p)});
        }
      `}const a=De();if(t)return`
    vec4 ${r}(int b, int row, int col) {
      ivec2 packedTexShape = ivec2(ceil(float(${s}TexShape[0]) / 2.0), ceil(float(${s}TexShape[1]) / 2.0));
      int valuesPerRow = int(ceil(float(${s}Shape[2]) / 2.0));
      int texelsInBatch = valuesPerRow * int(ceil(float(${s}Shape[1]) / 2.0));
      vec2 uv = packedUVfrom3D(
        packedTexShape[0], packedTexShape[1], texelsInBatch, valuesPerRow, b, row, col);
      return ${a.texture2D}(${s}, uv);
    }
  `;const c=i[0],l=i[1],u=Math.ceil(e[2]/2),h=u*Math.ceil(e[1]/2);return`
    vec4 ${r}(int b, int row, int col) {
      vec2 uv = packedUVfrom3D(
        ${c}, ${l}, ${h}, ${u}, b, row, col);
      return ${a.texture2D}(${s}, uv);
    }
  `}function gP(n,t){const e=n.shapeInfo.logicalShape,s=n.name,r="get"+s.charAt(0).toUpperCase()+s.slice(1),o=e[1]*e[2],i=e[2],{newShape:a,keptDims:c}=gs(e),l=a;if(l.length<e.length){const m=Xr(n,l),g=["row","col","depth"];return`
        ${Kr(m,t)}
        float ${r}(int row, int col, int depth) {
          return ${r}(${Yr(g,c)});
        }
      `}if(n.shapeInfo.isUniform)return`
      float ${r}(int row, int col, int depth) {
        int index = round(dot(vec3(row, col, depth),
                          vec3(${o}, ${i}, 1)));
        ${jr(n)}
      }
    `;const u=n.shapeInfo.texShape,h=u[0],d=u[1],p=n.shapeInfo.flatOffset;if(d===o&&p==null)return t?`
      float ${r}(int row, int col, int depth) {
        int stride1 = ${s}Shape[2];
        float texR = float(row);
        float texC = dot(vec2(col, depth), vec2(stride1, 1));
        vec2 uv = (vec2(texC, texR) + halfCR) /
                   vec2(${s}TexShape[1], ${s}TexShape[0]);
        return sampleTexture(${s}, uv);
      }
    `:`
        float ${r}(int row, int col, int depth) {
          float texR = float(row);
          float texC = dot(vec2(col, depth), vec2(${i}, 1));
          vec2 uv = (vec2(texC, texR) + halfCR) /
                     vec2(${d}.0, ${h}.0);
          return sampleTexture(${s}, uv);
        }
      `;if(d===i&&p==null)return t?`
      float ${r}(int row, int col, int depth) {
        float texR = dot(vec2(row, col), vec2(${s}Shape[1], 1));
        float texC = float(depth);
        vec2 uv = (vec2(texC, texR) + halfCR) / vec2(${s}TexShape[1], ${s}TexShape[0]);
        return sampleTexture(${s}, uv);
      }
    `:`
    float ${r}(int row, int col, int depth) {
      float texR = dot(vec2(row, col), vec2(${e[1]}, 1));
      float texC = float(depth);
      vec2 uv = (vec2(texC, texR) + halfCR) / vec2(${d}.0, ${h}.0);
      return sampleTexture(${s}, uv);
    }
  `;const f=ar(s);return t?`
    float ${r}(int row, int col, int depth) {
      // Explicitly use integer operations as dot() only works on floats.
      int stride0 = ${s}Shape[1] * ${s}Shape[2];
      int stride1 = ${s}Shape[2];
      int index = row * stride0 + col * stride1 + depth + ${f};
      vec2 uv = uvFromFlat(${s}TexShape[0], ${s}TexShape[1], index);
      return sampleTexture(${s}, uv);
    }
    `:`
      float ${r}(int row, int col, int depth) {
        // Explicitly use integer operations as dot() only works on floats.
        int index = row * ${o} + col * ${i} + depth + ${f};
        vec2 uv = uvFromFlat(${h}, ${d}, index);
        return sampleTexture(${s}, uv);
      }
  `}function xP(n,t){const e=n.name,s="get"+e.charAt(0).toUpperCase()+e.slice(1),r=De();if(t)return`
    vec4 ${s}(int b2, int b, int row, int col) {
      int valuesPerRow = int(ceil(float(${e}Shape[3]) / 2.0));
      int texelsInBatch = valuesPerRow * int(ceil(float(${e}Shape[2]) / 2.0));
      int index = b * texelsInBatch + (row / 2) * valuesPerRow + (col / 2);
      texelsInBatch *= ${e}Shape[1];
      index = b2 * texelsInBatch + index;
      ivec2 packedTexShape = ivec2(ceil(float(${e}TexShape[0]) / 2.0), ceil(float(${e}TexShape[1]) / 2.0));
      int texR = index / packedTexShape[1];
      int texC = index - texR * packedTexShape[1];
      vec2 uv = (vec2(texC, texR) + halfCR) / vec2(packedTexShape[1], packedTexShape[0]); return ${r.texture2D}(${e}, uv);
    }
  `;const o=n.shapeInfo.logicalShape,i=o.length,a=n.shapeInfo.texShape,c=[Math.ceil(a[0]/2),Math.ceil(a[1]/2)],l=c[0],u=c[1],h=Math.ceil(o[i-1]/2);let d=h*Math.ceil(o[i-2]/2),p="int b, int row, int col",f=`b * ${d} + (row / 2) * ${h} + (col / 2)`;for(let m=2;m<i-1;m++)p=`int b${m}, `+p,d*=o[i-m-1],f=`b${m} * ${d} + `+f;return`
    vec4 ${s}(${p}) {
      int index = ${f};
      int texR = index / ${u};
      int texC = index - texR * ${u};
      vec2 uv = (vec2(texC, texR) + halfCR) / vec2(${u}, ${l});
      return ${r.texture2D}(${e}, uv);
    }
  `}function bP(n,t){const e=n.shapeInfo.logicalShape,s=n.name,r="get"+s.charAt(0).toUpperCase()+s.slice(1),o=e[3],i=e[2]*o,a=e[1]*i,{newShape:c,keptDims:l}=gs(e);if(c.length<e.length){const b=Xr(n,c),w=["row","col","depth","depth2"];return`
      ${Kr(b,t)}
      float ${r}(int row, int col, int depth, int depth2) {
        return ${r}(${Yr(w,l)});
      }
    `}if(n.shapeInfo.isUniform)return`
      float ${r}(int row, int col, int depth, int depth2) {
        int index = round(dot(vec4(row, col, depth, depth2),
                          vec4(${a}, ${i}, ${o}, 1)));
        ${jr(n)}
      }
    `;const u=n.shapeInfo.flatOffset,h=n.shapeInfo.texShape,d=h[0],p=h[1],f=`int stride2 = ${s}Shape[3];`,m=`int stride1 = ${s}Shape[2] * stride2;`,g=`int stride0 = ${s}Shape[1] * stride1;`;if(p===a&&u==null)return t?`
      float ${r}(int row, int col, int depth, int depth2) {
        ${f}
        ${m}
        float texR = float(row);
        float texC =
            dot(vec3(col, depth, depth2),
                vec3(stride1, stride2, 1));
        vec2 uv = (vec2(texC, texR) + halfCR) /
                   vec2(${s}TexShape[1], ${s}TexShape[0]);
        return sampleTexture(${s}, uv);
      }
    `:`
      float ${r}(int row, int col, int depth, int depth2) {
        float texR = float(row);
        float texC =
            dot(vec3(col, depth, depth2),
                vec3(${i}, ${o}, 1));
        vec2 uv = (vec2(texC, texR) + halfCR) /
                   vec2(${p}.0, ${d}.0);
        return sampleTexture(${s}, uv);
      }
    `;if(p===o&&u==null)return t?`
      float ${r}(int row, int col, int depth, int depth2) {
        float texR = dot(vec3(row, col, depth),
                         vec3(${s}Shape[1] * ${s}Shape[2], ${s}Shape[2], 1));
        float texC = float(depth2);
        vec2 uv = (vec2(texC, texR) + halfCR) /
                  vec2(${s}TexShape[1], ${s}TexShape[0]);
        return sampleTexture(${s}, uv);
      }
    `:`
      float ${r}(int row, int col, int depth, int depth2) {
        float texR = dot(vec3(row, col, depth),
                         vec3(${e[1]*e[2]}, ${e[2]}, 1));
        float texC = float(depth2);
        vec2 uv = (vec2(texC, texR) + halfCR) /
                  vec2(${p}.0, ${d}.0);
        return sampleTexture(${s}, uv);
      }
    `;const x=ar(s);return t?`
    float ${r}(int row, int col, int depth, int depth2) {
      // Explicitly use integer operations as dot() only works on floats.
      ${f}
      ${m}
      ${g}
      int index = row * stride0 + col * stride1 +
          depth * stride2 + depth2;
      vec2 uv = uvFromFlat(${s}TexShape[0], ${s}TexShape[1], index + ${x});
      return sampleTexture(${s}, uv);
    }
  `:`
    float ${r}(int row, int col, int depth, int depth2) {
      // Explicitly use integer operations as dot() only works on floats.
      int index = row * ${a} + col * ${i} +
          depth * ${o} + depth2;
      vec2 uv = uvFromFlat(${d}, ${p}, index + ${x});
      return sampleTexture(${s}, uv);
    }
  `}function yP(n){const t=n.shapeInfo.logicalShape,e=n.name,s="get"+e.charAt(0).toUpperCase()+e.slice(1),r=t[4],o=t[3]*r,i=t[2]*o,a=t[1]*i,{newShape:c,keptDims:l}=gs(t);if(c.length<t.length){const m=Xr(n,c),g=["row","col","depth","depth2","depth3"];return`
      ${Kr(m)}
      float ${s}(int row, int col, int depth, int depth2, int depth3) {
        return ${s}(${Yr(g,l)});
      }
    `}if(n.shapeInfo.isUniform)return`
      float ${s}(int row, int col, int depth, int depth2, int depth3) {
        float index = dot(
          vec4(row, col, depth, depth2),
          vec4(${a}, ${i}, ${o}, ${r})) +
          depth3;
        ${jr(n)}
      }
    `;const u=n.shapeInfo.flatOffset,h=n.shapeInfo.texShape,d=h[0],p=h[1];if(p===a&&u==null)return`
      float ${s}(int row, int col, int depth, int depth2, int depth3) {
        int texR = row;
        float texC = dot(vec4(col, depth, depth2, depth3),
                         vec4(${i}, ${o}, ${r}, 1));
        vec2 uv = (vec2(texC, texR) + halfCR) /
                   vec2(${p}.0, ${d}.0);
        return sampleTexture(${e}, uv);
      }
    `;if(p===r&&u==null)return`
      float ${s}(int row, int col, int depth, int depth2, int depth3) {
        float texR = dot(
          vec4(row, col, depth, depth2),
          vec4(${t[1]*t[2]*t[3]},
               ${t[2]*t[3]}, ${t[3]}, 1));
        int texC = depth3;
        vec2 uv = (vec2(texC, texR) + halfCR) /
                  vec2(${p}.0, ${d}.0);
        return sampleTexture(${e}, uv);
      }
    `;const f=ar(e);return`
    float ${s}(int row, int col, int depth, int depth2, int depth3) {
      // Explicitly use integer operations as dot() only works on floats.
      int index = row * ${a} + col * ${i} + depth * ${o} +
          depth2 * ${r} + depth3 + ${f};
      vec2 uv = uvFromFlat(${d}, ${p}, index);
      return sampleTexture(${e}, uv);
    }
  `}function wP(n){const t=n.shapeInfo.logicalShape,e=n.name,s="get"+e.charAt(0).toUpperCase()+e.slice(1),{newShape:r,keptDims:o}=gs(t);if(r.length<t.length){const g=Xr(n,r),x=["row","col","depth","depth2","depth3","depth4"];return`
      ${Kr(g)}
      float ${s}(int row, int col, int depth,
                    int depth2, int depth3, int depth4) {
        return ${s}(${Yr(x,o)});
      }
    `}const i=t[5],a=t[4]*i,c=t[3]*a,l=t[2]*c,u=t[1]*l;if(n.shapeInfo.isUniform)return`
      float ${s}(int row, int col, int depth,
                  int depth2, int depth3, int depth4) {
        int index = round(dot(
          vec4(row, col, depth, depth2),
          vec4(${u}, ${l}, ${c}, ${a})) +
          dot(
            vec2(depth3, depth4),
            vec2(${i}, 1)));
        ${jr(n)}
      }
    `;const h=n.shapeInfo.flatOffset,d=n.shapeInfo.texShape,p=d[0],f=d[1];if(f===u&&h==null)return`
      float ${s}(int row, int col, int depth,
                    int depth2, int depth3, int depth4) {
        int texR = row;
        float texC = dot(vec4(col, depth, depth2, depth3),
          vec4(${l}, ${c}, ${a}, ${i})) +
               float(depth4);
        vec2 uv = (vec2(texC, texR) + halfCR) /
                   vec2(${f}.0, ${p}.0);
        return sampleTexture(${e}, uv);
      }
    `;if(f===i&&h==null)return`
      float ${s}(int row, int col, int depth,
                    int depth2, int depth3, int depth4) {
        float texR = dot(vec4(row, col, depth, depth2),
          vec4(${t[1]*t[2]*t[3]*t[4]},
               ${t[2]*t[3]*t[4]},
               ${t[3]*t[4]},
               ${t[4]})) + float(depth3);
        int texC = depth4;
        vec2 uv = (vec2(texC, texR) + halfCR) /
                  vec2(${f}.0, ${p}.0);
        return sampleTexture(${e}, uv);
      }
    `;const m=ar(e);return`
    float ${s}(int row, int col, int depth,
                  int depth2, int depth3, int depth4) {
      // Explicitly use integer operations as dot() only works on floats.
      int index = row * ${u} + col * ${l} + depth * ${c} +
          depth2 * ${a} + depth3 * ${i} + depth4 + ${m};
      vec2 uv = uvFromFlat(${p}, ${f}, index);
      return sampleTexture(${e}, uv);
    }
  `}function jr(n){const t=n.name,e=q(n.shapeInfo.logicalShape);return e<2?`return ${t};`:`
    for (int i = 0; i < ${e}; i++) {
      if (i == index) {
        return ${t}[i];
      }
    }
  `}function IP(n,t){const e=n.name,s=e.charAt(0).toUpperCase()+e.slice(1),r="get"+s+"AtOutCoords",o=n.shapeInfo.logicalShape.length,i=t.logicalShape.length,a=cy(n.shapeInfo.logicalShape,t.logicalShape),c=Bt(i),l=i-o;let u;const h=["x","y","z","w","u","v"];o===0?u="":i<2&&a.length>=1?u="coords = 0;":u=a.map(b=>`coords.${h[b+l]} = 0;`).join(`
`);let d="";i<2&&o>0?d="coords":d=n.shapeInfo.logicalShape.map((b,w)=>`coords.${h[w+l]}`).join(", ");let p="return outputValue;";const m=q(n.shapeInfo.logicalShape)===1,x=q(t.logicalShape)===1;if(o===1&&!m&&!x)p=`
      return vec4(outputValue.xy, outputValue.xy);
    `;else if(m&&!x)i===1?p=`
        return vec4(outputValue.x, outputValue.x, 0., 0.);
      `:p=`
        return vec4(outputValue.x);
      `;else if(a.length){const b=o-2,w=o-1;a.indexOf(b)>-1&&a.indexOf(w)>-1?p="return vec4(outputValue.x);":a.indexOf(b)>-1?p="return vec4(outputValue.x, outputValue.y, outputValue.x, outputValue.y);":a.indexOf(w)>-1&&(p="return vec4(outputValue.xx, outputValue.zz);")}return`
    vec4 ${r}() {
      ${c} coords = getOutputCoords();
      ${u}
      vec4 outputValue = get${s}(${d});
      ${p}
    }
  `}function vP(n,t){const e=n.name,s=e.charAt(0).toUpperCase()+e.slice(1),r="get"+s+"AtOutCoords",o=t.texShape,i=n.shapeInfo.texShape,a=n.shapeInfo.logicalShape.length,c=t.logicalShape.length;if(!n.shapeInfo.isUniform&&a===c&&n.shapeInfo.flatOffset==null&&Tt(i,o))return`
      float ${r}() {
        return sampleTexture(${e}, resultUV);
      }
    `;const l=Bt(c),u=cy(n.shapeInfo.logicalShape,t.logicalShape),h=c-a;let d;const p=["x","y","z","w","u","v"];a===0?d="":c<2&&u.length>=1?d="coords = 0;":d=u.map(m=>`coords.${p[m+h]} = 0;`).join(`
`);let f="";return c<2&&a>0?f="coords":f=n.shapeInfo.logicalShape.map((m,g)=>`coords.${p[g+h]}`).join(", "),`
    float ${r}() {
      ${l} coords = getOutputCoords();
      ${d}
      return get${s}(${f});
    }
  `}function Bt(n){if(n<=1)return"int";if(n===2)return"ivec2";if(n===3)return"ivec3";if(n===4)return"ivec4";if(n===5)return"ivec5";if(n===6)return"ivec6";throw Error(`GPU for rank ${n} is not yet supported`)}function Rp(n,t,e){const{newShape:s,keptDims:r}=gs(t),o=t.length,i=n&&o===3&&t[0]===1,a=i?t.slice(1):s,c=!n&&o>1&&!Tt(t,e)&&s.length<o||i;return{useSqueezeShape:c,uniformShape:c?a:t,keptDims:r}}function Xr(n,t){const e=JSON.parse(JSON.stringify(n));return e.shapeInfo.logicalShape=t,e}function Yr(n,t){return t.map(e=>n[e]).join(", ")}function CP(n,t,e,s){const r=e.map((u,h)=>{const d={logicalShape:u.shape,texShape:u.isUniform?null:u.texData.texShape,isUniform:u.isUniform,isPacked:u.isUniform?!1:u.texData.isPacked,flatOffset:null};return u.texData!=null&&u.texData.slice!=null&&u.texData.slice.flatOffset>0&&(d.flatOffset=u.texData.slice.flatOffset),{name:t.variableNames[h],shapeInfo:d}}),o=r.map(u=>u.shapeInfo),i={logicalShape:s.shape,texShape:s.texData.texShape,isUniform:!1,isPacked:s.texData.isPacked,flatOffset:null},a=VL(r,i,t),c=gL(n.gl,a),l=n.createProgram(c);return W().get("ENGINE_COMPILE_ONLY")?{program:t,fragmentShader:c,source:a,webGLProgram:l,inShapeInfos:o,outShapeInfo:i,uniformLocations:null,customUniformLocations:null,infLoc:null,nanLoc:null,inShapesLocations:null,inTexShapesLocations:null,outShapeLocation:null,outShapeStridesLocation:null,outTexShapeLocation:null}:Object.assign({program:t,fragmentShader:c,source:a,webGLProgram:l,inShapeInfos:o,outShapeInfo:i},hy(n,t,l))}function hy(n,t,e){const s={},r={},o={},i=[];let a,c,l,u=null,h=null;h=n.getUniformLocation(e,"NAN",!1),W().getNumber("WEBGL_VERSION")===1&&(u=n.getUniformLocation(e,"INFINITY",!1));const d=!1;for(let p=0;p<t.variableNames.length;p++){const f=t.variableNames[p];s[f]=n.getUniformLocation(e,f,d),s[`offset${f}`]=n.getUniformLocation(e,`offset${f}`,d),t.enableShapeUniforms&&(r[`${f}Shape`]=n.getUniformLocation(e,`${f}Shape`,d),o[`${f}TexShape`]=n.getUniformLocation(e,`${f}TexShape`,d))}return t.enableShapeUniforms&&(a=n.getUniformLocation(e,"outShape",d),l=n.getUniformLocation(e,"outShapeStrides",d),c=n.getUniformLocation(e,"outTexShape",d)),t.customUniforms&&t.customUniforms.forEach((p,f)=>{i[f]=n.getUniformLocation(e,p.name,d)}),{uniformLocations:s,customUniformLocations:i,infLoc:u,nanLoc:h,inShapesLocations:r,inTexShapesLocations:o,outShapeLocation:a,outShapeStridesLocation:l,outTexShapeLocation:c}}function Jf(n,t){if(n.length!==t.length)throw Error(`Binary was compiled with ${n.length} inputs, but was executed with ${t.length} inputs`);n.forEach((e,s)=>{const r=e.logicalShape,o=t[s],i=o.shape;if(!Tt(r,i))throw Error(`Binary was compiled with different shapes than the current args. Shapes ${r} and ${i} must match`);if(e.isUniform&&o.isUniform)return;const a=e.texShape,c=o.isUniform?null:o.texData.texShape;if(!Tt(a,c))throw Error(`Binary was compiled with different texture shapes than the current args. Shape ${a} and ${c} must match`)})}function kP(n,t,e,s,r){t.program.enableShapeUniforms||(Jf(t.inShapeInfos,e),Jf([t.outShapeInfo],[s]));const o=s.texData.texture,i=s.texData.texShape;s.texData.isPacked?n.setOutputPackedMatrixTexture(o.texture,i[0],i[1]):n.setOutputMatrixTexture(o.texture,i[0],i[1]),n.setProgram(t.webGLProgram),W().getNumber("WEBGL_VERSION")===1&&t.infLoc!==null&&n.gl.uniform1f(t.infLoc,1/0),t.nanLoc!==null&&n.gl.uniform1f(t.nanLoc,NaN),e.forEach((c,l)=>{const u=t.program.variableNames[l],h=t.uniformLocations[u],d=t.uniformLocations[`offset${u}`],p=t.inShapesLocations[`${u}Shape`],f=t.inTexShapesLocations[`${u}TexShape`];if(p){const{uniformShape:m}=Rp(t.program.packedInputs,c.shape,c.texData.texShape);switch(m.length){case 1:n.gl.uniform1iv(p,new Int32Array(m));break;case 2:n.gl.uniform2iv(p,new Int32Array(m));break;case 3:n.gl.uniform3iv(p,new Int32Array(m));break;case 4:n.gl.uniform4iv(p,new Int32Array(m));break}}if(f&&n.gl.uniform2i(f,c.texData.texShape[0],c.texData.texShape[1]),h!=null){if(c.isUniform){if(q(c.shape)<2)n.gl.uniform1f(h,c.uniformValues[0]);else{let m=c.uniformValues;m instanceof Float32Array||(m=new Float32Array(m)),n.gl.uniform1fv(h,m)}return}c.texData.slice!=null&&d!=null&&n.gl.uniform1i(d,c.texData.slice.flatOffset),n.setInputMatrixTexture(c.texData.texture.texture,h,l)}});const a=t.outShapeLocation;if(a)switch(s.shape.length){case 1:n.gl.uniform1iv(a,new Int32Array(s.shape));break;case 2:n.gl.uniform2iv(a,new Int32Array(s.shape));break;case 3:n.gl.uniform3iv(a,new Int32Array(s.shape));break;case 4:n.gl.uniform4iv(a,new Int32Array(s.shape));break}if(t.outShapeStridesLocation){const c=ht(s.shape);switch(s.shape.length){case 2:n.gl.uniform1iv(t.outShapeStridesLocation,new Int32Array(c));break;case 3:n.gl.uniform2iv(t.outShapeStridesLocation,new Int32Array(c));break;case 4:n.gl.uniform3iv(t.outShapeStridesLocation,new Int32Array(c));break}}t.outTexShapeLocation&&n.gl.uniform2i(t.outTexShapeLocation,s.texData.texShape[0],s.texData.texShape[1]),t.program.customUniforms&&r&&t.program.customUniforms.forEach((c,l)=>{const u=t.customUniformLocations[l],h=r[l];if(c.type==="float")n.gl.uniform1fv(u,h);else if(c.type==="vec2")n.gl.uniform2fv(u,h);else if(c.type==="vec3")n.gl.uniform3fv(u,h);else if(c.type==="vec4")n.gl.uniform4fv(u,h);else if(c.type==="int")n.gl.uniform1iv(u,h);else if(c.type==="ivec2")n.gl.uniform2iv(u,h);else if(c.type==="ivec3")n.gl.uniform3iv(u,h);else if(c.type==="ivec4")n.gl.uniform4iv(u,h);else throw Error(`uniform type ${c.type} is not supported yet.`)}),n.executeProgram()}function $P(n,t,e){let s="";t.concat(e).forEach(i=>{const a=i.texData!=null&&i.texData.slice!=null&&i.texData.slice.flatOffset>0;if(n.enableShapeUniforms&&!i.isUniform){const c=i.texData.texShape,{useSqueezeShape:l,uniformShape:u,keptDims:h}=Rp(n.packedInputs,i.shape,c);let d="",p="",f="";if(u.length===1&&n.packedInputs){const I=[Math.ceil(c[0]/2),Math.ceil(c[1]/2)];d=`${I[0]>1}_${I[1]>1}`}else if(u.length===2&&!n.packedInputs)p=`${u[0]>1}_${u[1]>1}`;else if(u.length>2&&!n.packedInputs){const I=ht(u);f=`${I[0]===c[1]}_${I[I.length-1]===c[1]}`}const m=i.shape.length,g=u.length===2&&Tt(i.shape,c),x=q(i.shape)===1,b=Nr(i.shape,e.shape),w=!n.packedInputs&&m===e.shape.length&&Tt(c,e.texData.texShape),y=n.packedInputs||u.length>2?"":`${c[0]>1}_${c[1]>1}`;s+=`${m}_${w}_${l?h:""}_${u.length}_${x}_${b}_${g}_${d}_${p}_${f}_${y}_${a}`}else{const c=i.isUniform?"uniform":i.texData.texShape;s+=`${i.shape}_${c}_${a}`}});const r=n.userCode;let o=n.constructor.name;return o+="_"+s+"_"+r+`${W().getNumber("WEBGL_VERSION")}`,o}function Ae(n){return W().getBool("WEBGL_USE_SHAPES_UNIFORMS")&&n<=4}class SP{constructor(t){this.variableNames=["A"],this.packedInputs=!1,this.packedOutput=!0,this.outPackingScheme=$o.DENSE,this.customUniforms=[{name:"texShape",type:"ivec2"}];const e=De();this.outputShape=t,this.enableShapeUniforms=Ae(this.outputShape.length),this.userCode=`
      ivec3 outCoordsFromFlatIndex(int index) {
        ${this.enableShapeUniforms?Nl(["r","c","d"],t):ir(["r","c","d"],t)}
        return ivec3(r, c, d);
      }

      void main() {
        ivec2 resTexRC = ivec2(resultUV.yx * vec2(texShape[0], texShape[1]));
        int index = 4 * (resTexRC.x * texShape[1] + resTexRC.y);

        vec4 result = vec4(0.);

        for (int i=0; i<4; i++) {
          int flatIndex = index + i;
          ivec3 rc = outCoordsFromFlatIndex(flatIndex);
          result[i] = getA(rc.x, rc.y, rc.z);
        }

        ${e.output} = result;
      }
    `}}class NP{constructor(t){this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!0,this.outPackingScheme=$o.DENSE,this.customUniforms=[{name:"texShape",type:"ivec2"}];const e=De();this.outputShape=t,this.enableShapeUniforms=Ae(this.outputShape.length),this.userCode=`
      ivec3 outCoordsFromFlatIndex(int index) {
        ${this.enableShapeUniforms?Nl(["r","c","d"],t):ir(["r","c","d"],t)}
        return ivec3(r, c, d);
      }

      void main() {
        ivec2 resTexRC = ivec2(resultUV.yx * vec2(texShape[0], texShape[1]));
        int index = 4 * (resTexRC.x * texShape[1] + resTexRC.y);

        vec4 result = vec4(0.);

        for (int i=0; i<4; i++) {
          int flatIndex = index + i;
          ivec3 rc = outCoordsFromFlatIndex(flatIndex);
          result[i] = getChannel(getA(rc.x, rc.y, rc.z), vec2(rc.y, rc.z));
        }

        ${e.output} = result;
      }
    `}}class TP{constructor(t){this.variableNames=["A"],this.outTexUsage=Xe.DOWNLOAD;const e=De();this.outputShape=t,this.userCode=`
      ${ay}

      void main() {
        float x = getAAtOutCoords();
        ${e.output} = encode_float(x);
      }
    `}}class EP{constructor(t){this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!1,this.outTexUsage=Xe.DOWNLOAD;const e=De();this.outputShape=t,this.userCode=`
      ${ay}

      void main() {
        ivec3 coords = getOutputCoords();
        float x = getChannel(getAAtOutCoords(), vec2(coords.y, coords.z));
        ${e.output} = encode_float(x);
      }
    `}}class RP{constructor(t,e=!1){this.variableNames=["A"],this.customUniforms=[{name:"texShape",type:"ivec2"}];const s=De();this.outputShape=t,this.enableShapeUniforms=Ae(this.outputShape.length);let r="result";e&&(r="floor(result * 255. + 0.5)"),this.userCode=`
      ${this.enableShapeUniforms?Ep():Tp(t)}

      void main() {
        ivec3 coords = getOutputCoords();

        int flatIndex = getFlatIndex(coords);
        int offset = imod(flatIndex, 4);

        flatIndex = idiv(flatIndex, 4, 1.);

        int r = flatIndex / texShape[1];
        int c = imod(flatIndex, texShape[1]);
        vec2 uv = (vec2(c, r) + halfCR) / vec2(texShape[1], texShape[0]);
        vec4 values = ${s.texture2D}(A, uv);

        float result;

        if(offset == 0) {
          result = values[0];
        } else if(offset == 1) {
          result = values[1];
        } else if(offset == 2) {
          result = values[2];
        } else {
          result = values[3];
        }

        ${s.output} = vec4(${r}, 0., 0., 0.);
      }
    `}}class DP{constructor(t,e=!1){this.variableNames=["A"],this.packedInputs=!1,this.packedOutput=!0,this.customUniforms=[{name:"texShape",type:"ivec2"}];const s=De();this.outputShape=t,this.enableShapeUniforms=Ae(this.outputShape.length);let r="",o="result";e&&(o="floor(result * 255. + 0.5)");for(let i=0;i<=1;i++)for(let a=0;a<=1;a++){const c=i*2+a;r+=`
          localCoords = coords;
          if(localCoords[2] + ${a} < ${this.enableShapeUniforms?"outShape[2]":`${t[2]}`}) {
          localCoords[2] += ${a};
          if (localCoords[1] + ${i} < ${this.enableShapeUniforms?"outShape[1]":`${t[1]}`}) {
            localCoords[1] += ${i};

            flatIndex = getFlatIndex(localCoords);
            offset = imod(flatIndex, 4);

            flatIndex = idiv(flatIndex, 4, 1.);

            int r = flatIndex / texShape[1];
            int c = imod(flatIndex, texShape[1]);
            vec2 uv = (vec2(c, r) + halfCR) / vec2(texShape[1], texShape[0]);
            values = ${s.texture2D}(A, uv);

            if (offset == 0) {
              result[${c}] = values[0];
            } else if (offset == 1) {
              result[${c}] = values[1];
            } else if (offset == 2) {
              result[${c}] = values[2];
            } else {
              result[${c}] = values[3];
            }
          }
        }
        `}this.userCode=`
        ${this.enableShapeUniforms?Ep():Tp(t)}

        void main() {
          ivec3 coords = getOutputCoords();

          vec4 result = vec4(0.);
          int flatIndex, r, c, offset;
          ivec3 localCoords;
          vec2 uv;
          vec4 values;

          ${r}

          ${s.output} = ${o};
        }
    `}}function AP(n){const t=De(),e=`${t.version}
    precision highp float;
    ${t.attribute} vec3 clipSpacePos;
    ${t.attribute} vec2 uv;
    ${t.varyingVs} vec2 resultUV;

    void main() {
      gl_Position = vec4(clipSpacePos, 1);
      resultUV = uv;
    }`;return mL(n,e)}function FP(n){const t=new Float32Array([-1,1,0,0,1,-1,-1,0,0,0,1,1,0,1,1,1,-1,0,1,0]);return wL(n,t)}function OP(n){const t=new Uint16Array([0,1,2,2,1,3]);return IL(n,t)}function Ki(n,t,e,s,r,o){CL(t,e);const i=vL(n),a=n.TEXTURE_2D;return ot(n,()=>n.bindTexture(a,i)),ot(n,()=>n.texParameteri(a,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE)),ot(n,()=>n.texParameteri(a,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE)),ot(n,()=>n.texParameteri(a,n.TEXTURE_MIN_FILTER,n.NEAREST)),ot(n,()=>n.texParameteri(a,n.TEXTURE_MAG_FILTER,n.NEAREST)),W().getNumber("WEBGL_VERSION")===1?ot(n,()=>n.texImage2D(a,0,s,t,e,0,r,o,null)):ot(n,()=>n.texStorage2D(a,1,s,t,e)),ot(n,()=>n.bindTexture(n.TEXTURE_2D,null)),{texture:i,texShape:[e,t]}}function dy(n){return n.internalFormatFloat}function _P(n,t,e,s){const[r,o]=Hi(t,e);return Ki(n,r,o,dy(s),s.textureFormatFloat,n.FLOAT)}function py(n){return n.internalFormatHalfFloat}function MP(n,t,e,s){const[r,o]=Hi(t,e);return Ki(n,r,o,py(s),s.textureFormatFloat,s.textureTypeHalfFloat)}function fy(n){return n.downloadTextureFormat}function LP(n,t,e,s){const[r,o]=Hi(t,e);return Ki(n,r,o,fy(s),n.RGBA,n.UNSIGNED_BYTE)}function my(n){return n.internalFormatPackedFloat}function PP(n,t,e,s){const[r,o]=qr(t,e);return Ki(n,r,o,my(s),n.RGBA,n.FLOAT)}function gy(n){return n.internalFormatPackedHalfFloat}function BP(n,t,e,s){const[r,o]=qr(t,e);return Ki(n,r,o,gy(s),n.RGBA,s.textureTypeHalfFloat)}function zP(n,t,e){return ot(n,()=>n.bindBuffer(n.ARRAY_BUFFER,e)),Xf(n,t,"clipSpacePos",e,3,20,0)&&Xf(n,t,"uv",e,2,20,12)}function VP(n,t,e,s,r,o){ot(n,()=>n.bindTexture(n.TEXTURE_2D,t));let i,a,c;r instanceof Uint8Array?(i=new Uint8Array(e*s*4),a=n.UNSIGNED_BYTE,c=n.RGBA):(i=new Float32Array(e*s*4),a=n.FLOAT,c=o.internalFormatPackedFloat),i.set(r),W().getNumber("WEBGL_VERSION")===2?ot(n,()=>n.texSubImage2D(n.TEXTURE_2D,0,0,0,e,s,n.RGBA,a,i)):ot(n,()=>n.texImage2D(n.TEXTURE_2D,0,c,e,s,0,n.RGBA,a,i)),ot(n,()=>n.bindTexture(n.TEXTURE_2D,null))}function WP(n,t,e){ot(n,()=>n.bindTexture(n.TEXTURE_2D,t)),e.data instanceof Uint8Array?W().getNumber("WEBGL_VERSION")===2?ot(n,()=>n.texSubImage2D(n.TEXTURE_2D,0,0,0,e.width,e.height,n.RGBA,n.UNSIGNED_BYTE,e.data)):ot(n,()=>n.texImage2D(n.TEXTURE_2D,0,n.RGBA,e.width,e.height,0,n.RGBA,n.UNSIGNED_BYTE,e.data)):W().getNumber("WEBGL_VERSION")===2?ot(n,()=>n.texSubImage2D(n.TEXTURE_2D,0,0,0,n.RGBA,n.UNSIGNED_BYTE,e)):ot(n,()=>n.texImage2D(n.TEXTURE_2D,0,n.RGBA,n.RGBA,n.UNSIGNED_BYTE,e)),ot(n,()=>n.bindTexture(n.TEXTURE_2D,null))}function UP(n,t,e,s){const r=n.createBuffer();ot(n,()=>n.bindBuffer(n.PIXEL_PACK_BUFFER,r));const a=4*4*t*e;return ot(n,()=>n.bufferData(n.PIXEL_PACK_BUFFER,a,n.STREAM_READ)),ot(n,()=>n.readPixels(0,0,e,t,n.RGBA,n.FLOAT,0)),ot(n,()=>n.bindBuffer(n.PIXEL_PACK_BUFFER,null)),r}function GP(n,t,e){const s=n,r=new Float32Array(e);return s.bindBuffer(s.PIXEL_PACK_BUFFER,t),s.getBufferSubData(s.PIXEL_PACK_BUFFER,0,r),s.bindBuffer(s.PIXEL_PACK_BUFFER,null),r}function HP(n,t,e,s){const[r,o]=Hi(t,e),i=4,a=new Uint8Array(cL(t*e,i));return ot(n,()=>n.readPixels(0,0,r,o,s.downloadTextureFormat,n.UNSIGNED_BYTE,a)),new Float32Array(a.buffer)}function qP(n,t,e,s,r,o,i,a){const c=n,l=new Float32Array(lL(o,i));return c.bindBuffer(c.PIXEL_PACK_BUFFER,t),c.getBufferSubData(c.PIXEL_PACK_BUFFER,0,l),c.bindBuffer(c.PIXEL_PACK_BUFFER,null),l}function KP(n,t,e){const s=new Float32Array(t*e*4);return ot(n,()=>n.readPixels(0,0,e,t,n.RGBA,n.FLOAT,s)),s}class Zl{constructor(t){this.outputTexture=null,this.program=null,this.disposed=!1,this.vertexAttrsAreBound=!1,this.itemsToPoll=[];const e=W().getNumber("WEBGL_VERSION");t!=null?(this.gl=t,oL(e,t)):this.gl=$n(e);let s="WEBGL_color_buffer_float";const r="EXT_color_buffer_half_float";if(this.parallelCompilationExtension=this.gl.getExtension("KHR_parallel_shader_compile"),W().getNumber("WEBGL_VERSION")===1){const o="OES_texture_float",i="OES_texture_half_float";if(this.textureFloatExtension=aa(this.gl,o),on(this.gl,i))this.textureHalfFloatExtension=aa(this.gl,i);else if(W().get("WEBGL_FORCE_F16_TEXTURES"))throw new Error("GL context does not support half float textures, yet the environment flag WEBGL_FORCE_F16_TEXTURES is set to true.");if(this.colorBufferFloatExtension=this.gl.getExtension(s),on(this.gl,r))this.colorBufferHalfFloatExtension=aa(this.gl,r);else if(W().get("WEBGL_FORCE_F16_TEXTURES"))throw new Error("GL context does not support color renderable half floats, yet the environment flag WEBGL_FORCE_F16_TEXTURES is set to true.")}else if(s="EXT_color_buffer_float",on(this.gl,s))this.colorBufferFloatExtension=this.gl.getExtension(s);else if(on(this.gl,r))this.colorBufferHalfFloatExtension=this.gl.getExtension(r);else throw new Error("GL context does not support color renderable floats");this.vertexBuffer=FP(this.gl),this.indexBuffer=OP(this.gl),this.framebuffer=kL(this.gl),this.textureConfig=Np(this.gl,this.textureHalfFloatExtension)}get debug(){return W().getBool("DEBUG")}dispose(){if(this.disposed)return;this.program!=null&&console.warn("Disposing a GPGPUContext that still has a bound WebGLProgram. This is probably a resource leak, delete the program with GPGPUContext.deleteProgram before disposing."),this.outputTexture!=null&&console.warn("Disposing a GPGPUContext that still has a bound output matrix texture.  This is probably a resource leak, delete the output matrix texture with GPGPUContext.deleteMatrixTexture before disposing.");const t=this.gl;ot(t,()=>t.finish()),ot(t,()=>t.bindFramebuffer(t.FRAMEBUFFER,null)),ot(t,()=>t.deleteFramebuffer(this.framebuffer)),ot(t,()=>t.bindBuffer(t.ARRAY_BUFFER,null)),ot(t,()=>t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,null)),ot(t,()=>t.deleteBuffer(this.indexBuffer)),this.disposed=!0}createFloat32MatrixTexture(t,e){return this.throwIfDisposed(),_P(this.gl,t,e,this.textureConfig)}createFloat16MatrixTexture(t,e){return this.throwIfDisposed(),MP(this.gl,t,e,this.textureConfig)}createUnsignedBytesMatrixTexture(t,e){return this.throwIfDisposed(),LP(this.gl,t,e,this.textureConfig)}uploadPixelDataToTexture(t,e){this.throwIfDisposed(),WP(this.gl,t,e)}uploadDenseMatrixToTexture(t,e,s,r){this.throwIfDisposed(),VP(this.gl,t,e,s,r,this.textureConfig)}createFloat16PackedMatrixTexture(t,e){return this.throwIfDisposed(),BP(this.gl,t,e,this.textureConfig)}createPackedMatrixTexture(t,e){return this.throwIfDisposed(),PP(this.gl,t,e,this.textureConfig)}deleteMatrixTexture(t){this.throwIfDisposed(),this.outputTexture===t&&(Yf(this.gl,this.framebuffer),this.outputTexture=null),ot(this.gl,()=>this.gl.deleteTexture(t))}downloadByteEncodedFloatMatrixFromOutputTexture(t,e,s){return this.downloadMatrixDriver(t,()=>HP(this.gl,e,s,this.textureConfig))}downloadPackedMatrixFromBuffer(t,e,s,r,o,i){return qP(this.gl,t,e,s,r,o,i,this.textureConfig)}downloadFloat32MatrixFromBuffer(t,e){return GP(this.gl,t,e)}createBufferFromTexture(t,e,s){this.bindTextureToFrameBuffer(t);const r=UP(this.gl,e,s,this.textureConfig);return this.unbindTextureToFrameBuffer(),r}createAndWaitForFence(){const t=this.createFence(this.gl);return this.pollFence(t)}createFence(t){let e,s;if(W().getBool("WEBGL_FENCE_API_ENABLED")){const r=t,o=r.fenceSync(r.SYNC_GPU_COMMANDS_COMPLETE,0);t.flush(),s=()=>{const i=r.clientWaitSync(o,0,0);return i===r.ALREADY_SIGNALED||i===r.CONDITION_SATISFIED},e=o}else W().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION")>0?(e=this.beginQuery(),this.endQuery(),s=()=>this.isQueryAvailable(e,W().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION"))):s=()=>!0;return{query:e,isFencePassed:s}}downloadMatrixFromPackedTexture(t,e,s){return this.downloadMatrixDriver(t,()=>KP(this.gl,e,s))}createProgram(t){this.throwIfDisposed();const e=this.gl;this.vertexShader==null&&(this.vertexShader=AP(e));const s=bL(e);return ot(e,()=>e.attachShader(s,this.vertexShader)),ot(e,()=>e.attachShader(s,t)),yL(e,s),this.debug&&ql(e,s),this.vertexAttrsAreBound||(this.setProgram(s),this.vertexAttrsAreBound=zP(e,this.program,this.vertexBuffer)),s}deleteProgram(t){this.throwIfDisposed(),t===this.program&&(this.program=null),t!=null&&ot(this.gl,()=>this.gl.deleteProgram(t))}setProgram(t){this.throwIfDisposed(),this.program=t,this.program!=null&&this.debug&&ql(this.gl,this.program),ot(this.gl,()=>this.gl.useProgram(t))}getUniformLocation(t,e,s=!0){return this.throwIfDisposed(),s?SL(this.gl,t,e):NL(this.gl,t,e)}getAttributeLocation(t,e){return this.throwIfDisposed(),ot(this.gl,()=>this.gl.getAttribLocation(t,e))}getUniformLocationNoThrow(t,e){return this.throwIfDisposed(),this.gl.getUniformLocation(t,e)}setInputMatrixTexture(t,e,s){this.throwIfDisposed(),this.throwIfNoProgram(),TL(this.gl,t,e,s)}setOutputMatrixTexture(t,e,s){this.setOutputMatrixTextureDriver(t,s,e)}setOutputPackedMatrixTexture(t,e,s){this.throwIfDisposed();const[r,o]=qr(e,s);this.setOutputMatrixTextureDriver(t,r,o)}setOutputMatrixWriteRegion(t,e,s,r){this.setOutputMatrixWriteRegionDriver(s,t,r,e)}setOutputPackedMatrixWriteRegion(t,e,s,r){throw new Error("setOutputPackedMatrixWriteRegion not implemented.")}debugValidate(){this.program!=null&&ql(this.gl,this.program),ca(this.gl)}executeProgram(){this.throwIfDisposed(),this.throwIfNoProgram();const t=this.gl;this.debug&&this.debugValidate(),ot(t,()=>t.drawElements(t.TRIANGLES,6,t.UNSIGNED_SHORT,0))}blockUntilAllProgramsCompleted(){this.throwIfDisposed(),ot(this.gl,()=>this.gl.finish())}getQueryTimerExtension(){return this.disjointQueryTimerExtension==null&&(this.disjointQueryTimerExtension=aa(this.gl,W().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION")===2?"EXT_disjoint_timer_query_webgl2":"EXT_disjoint_timer_query")),this.disjointQueryTimerExtension}getQueryTimerExtensionWebGL2(){return this.getQueryTimerExtension()}getQueryTimerExtensionWebGL1(){return this.getQueryTimerExtension()}beginQuery(){if(W().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION")===2){const s=this.gl,r=this.getQueryTimerExtensionWebGL2(),o=s.createQuery();return s.beginQuery(r.TIME_ELAPSED_EXT,o),o}const t=this.getQueryTimerExtensionWebGL1(),e=t.createQueryEXT();return t.beginQueryEXT(t.TIME_ELAPSED_EXT,e),e}endQuery(){if(W().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION")===2){const e=this.gl,s=this.getQueryTimerExtensionWebGL2();e.endQuery(s.TIME_ELAPSED_EXT);return}const t=this.getQueryTimerExtensionWebGL1();t.endQueryEXT(t.TIME_ELAPSED_EXT)}async waitForQueryAndGetTime(t){return await Bp(()=>this.disposed||this.isQueryAvailable(t,W().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION"))),this.getQueryTime(t,W().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION"))}getQueryTime(t,e){if(e===0)return null;if(e===2){const s=this.gl;return s.getQueryParameter(t,s.QUERY_RESULT)/1e6}else{const s=this.getQueryTimerExtensionWebGL1();return s.getQueryObjectEXT(t,s.QUERY_RESULT_EXT)/1e6}}isQueryAvailable(t,e){if(e===0)return!0;if(e===2){const s=this.gl,r=this.getQueryTimerExtensionWebGL2(),o=s.getQueryParameter(t,s.QUERY_RESULT_AVAILABLE);return this.disjoint==null&&(this.disjoint=this.gl.getParameter(r.GPU_DISJOINT_EXT)),o&&!this.disjoint}else{const s=this.getQueryTimerExtensionWebGL1(),r=s.getQueryObjectEXT(t,s.QUERY_RESULT_AVAILABLE_EXT);return this.disjoint==null&&(this.disjoint=this.gl.getParameter(s.GPU_DISJOINT_EXT)),r&&!this.disjoint}}pollFence(t){return new Promise(e=>{this.addItemToPoll(()=>t.isFencePassed(),()=>e())})}pollItems(){const t=jP(this.itemsToPoll.map(e=>e.isDoneFn));for(let e=0;e<=t;++e){const{resolveFn:s}=this.itemsToPoll[e];s()}this.itemsToPoll=this.itemsToPoll.slice(t+1)}addItemToPoll(t,e){if(this.itemsToPoll.push({isDoneFn:t,resolveFn:e}),this.itemsToPoll.length>1)return;let s;"setTimeoutCustom"in W().platform&&(s=W().platform.setTimeoutCustom.bind(W().platform)),Bp(()=>(this.pollItems(),this.itemsToPoll.length===0),()=>0,null,s)}bindTextureToFrameBuffer(t){this.throwIfDisposed(),Kl(this.gl,t,this.framebuffer),this.debug&&ca(this.gl)}unbindTextureToFrameBuffer(){this.outputTexture!=null?(Kl(this.gl,this.outputTexture,this.framebuffer),this.debug&&ca(this.gl)):Yf(this.gl,this.framebuffer)}downloadMatrixDriver(t,e){this.bindTextureToFrameBuffer(t);const s=e();return this.unbindTextureToFrameBuffer(),s}setOutputMatrixTextureDriver(t,e,s){this.throwIfDisposed();const r=this.gl;Kl(r,t,this.framebuffer),this.debug&&ca(r),this.outputTexture=t,ot(r,()=>r.viewport(0,0,e,s)),ot(r,()=>r.scissor(0,0,e,s))}setOutputMatrixWriteRegionDriver(t,e,s,r){this.throwIfDisposed(),ot(this.gl,()=>this.gl.scissor(t,e,s,r))}throwIfDisposed(){if(this.disposed)throw new Error("Attempted to use disposed GPGPUContext.")}throwIfNoProgram(){if(this.program==null)throw new Error("No GPU program is currently set.")}}function jP(n){let t=0;for(;t<n.length&&n[t]();++t);return t-1}const{addImpl:XP,bincountImpl:xy,bincountReduceImpl:YP,castImpl:ZP,ceilImpl:JP,concatImpl:QP,equalImpl:t3,expImpl:e3,expm1Impl:n3,floorImpl:s3,gatherNdImpl:r3,gatherV2Impl:o3,greaterImpl:i3,greaterEqualImpl:a3,lessImpl:c3,lessEqualImpl:l3,linSpaceImpl:u3,logImpl:h3,maxImpl:d3,maximumImpl:p3,minimumImpl:f3,multiplyImpl:m3,negImpl:g3,notEqualImpl:x3,prodImpl:b3,raggedGatherImpl:y3,raggedTensorToTensorImpl:w3,rangeImpl:I3,rsqrtImpl:v3,scatterImpl:C3,sigmoidImpl:k3,simpleAbsImpl:by,sliceImpl:$3,sparseFillEmptyRowsImpl:S3,sparseReshapeImpl:N3,sparseSegmentReductionImpl:yy,sqrtImpl:T3,stridedSliceImpl:E3,stringNGramsImpl:R3,stringSplitImpl:D3,stringToHashBucketFastImpl:A3,subImpl:F3,tileImpl:O3,topKImpl:_3,transposeImpl:Dp,uniqueImpl:M3}=HD;function wy(n,t){return["x","y","z","w","u","v"].slice(0,t).map(e=>`${n}.${e}`)}function Te(n,t){return t===1?[n]:wy(n,t)}function L3(n,t){if(n===1)return"rc";let e="";for(let s=0;s<n;s++)e+=t[s],s<n-1&&(e+=",");return e}class P3{constructor(t){if(this.variableNames=["A"],this.packedInputs=!1,this.packedOutput=!0,this.outputShape=t,this.rank=t.length,this.enableShapeUniforms=Ae(this.outputShape.length),this.rank===0)this.userCode=`
        void main() {
          setOutput(vec4(getA(), 0., 0., 0.));
        }
      `;else{const e=Te("rc",this.rank),s=Bt(this.rank),r=this.getOutOfBoundsCondition(e),o=this.getSetup(e),i=this.getOutput(e);this.userCode=`
        void main() {
          ${s} rc = getOutputCoords();

          if(${r}) {
            setOutput(vec4(0));
          } else {
            ${o}

            setOutput(vec4(${i}));
          }
        }
      `}}getSourceCoordsArr(t){const e=[];for(let s=0;s<=1;s++)for(let r=0;r<=1;r++){let o=`${s===0?"r":"rp1"}, ${r===0?"c":"cp1"}`;for(let i=2;i<this.rank;i++)o=`${t[t.length-1-i]},`+o;e.push(o)}return e}getOutOfBoundsCondition(t){if(this.rank===1)return`rc > ${this.enableShapeUniforms?"outShape":this.outputShape[0]}`;let e="";for(let s=this.rank-2;s<this.rank;s++)e+=`${t[s]} >= ${this.enableShapeUniforms?`outShape[${s}]`:this.outputShape[s]}`,s<this.rank-1&&(e+="||");return e}getSetup(t){if(this.rank===1)return"";const e=t.slice(-2),s=this.enableShapeUniforms?`outShape[${this.rank} - 1]`:this.outputShape[this.rank-1],r=this.enableShapeUniforms?`outShape[${this.rank} - 2]`:this.outputShape[this.rank-2];return`
      int r = ${e[0]};
      int c = ${e[1]};
      int rp1 = r + 1;
      int cp1 = c + 1;

      bool cEdge = cp1 >= ${s};
      bool rEdge = rp1 >= ${r};
    `}getOutput(t){const e=this.getSourceCoordsArr(t);return this.rank===1?`getA(rc), (rc + 1 >= ${this.enableShapeUniforms?"outShape":this.outputShape[0]} ? 0. : getA(rc + 1)), 0, 0`:`getA(${e[0]}),
            cEdge ? 0. : getA(${e[1]}),
            rEdge ? 0. : getA(${e[2]}),
            rEdge || cEdge ? 0. : getA(${e[3]})`}}class Iy{constructor(t,e){this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!0,this.customUniforms=[{name:"inputShape",type:"ivec3"}],this.outputShape=t,this.enableShapeUniforms=Ae(this.outputShape.length);let s="";for(let r=0;r<4;r++){let o="thisRC = rc;";r%2===1&&(o+="thisRC.z += 1;"),r>1&&(o+="thisRC.y += 1;"),s+=`
        ${o}
        ${r>0?"if(thisRC.y < rows && thisRC.z < cols){":""}
          int flatIndex = getFlatIndex(thisRC);

          ivec3 inputRC = inputCoordsFromReshapedOutCoords(flatIndex);
          vec2 inputRCInnerDims = vec2(float(inputRC.y),float(inputRC.z));

          result[${r}] =
            getChannel(getA(inputRC.x, inputRC.y, inputRC.z), inputRCInnerDims);
        ${r>0?"}":""}
      `}this.userCode=`
      ${B3(e,this.enableShapeUniforms)}
      ${this.enableShapeUniforms?Ep():Tp(t)}

      void main() {
        ivec3 rc = getOutputCoords();

        vec4 result = vec4(0.);

        ivec3 thisRC;
        int rows = ${this.enableShapeUniforms?"outShape[1]":t[1]};
        int cols = ${this.enableShapeUniforms?"outShape[2]":t[2]};

        ${s}

        setOutput(result);
      }
    `}}function B3(n,t){return`
    ivec3 inputCoordsFromReshapedOutCoords(int index) {
      ${t?zL(["r","c","d"],"inputShape"):ir(["r","c","d"],n)}
      return ivec3(r, c, d);
    }
  `}class z3{constructor(t){this.gpgpu=t,this.numUsedTextures=0,this.numFreeTextures=0,this._numBytesAllocated=0,this._numBytesFree=0,this.freeTextures={},this.logEnabled=!1,this.usedTextures={}}acquireTexture(t,e,s){const r=tm(e,s),o=em(t,r,s);o in this.freeTextures||(this.freeTextures[o]=[]),o in this.usedTextures||(this.usedTextures[o]=[]);const i=Qf(t,r,this.gpgpu.gl,this.gpgpu.textureConfig,s);if(this.freeTextures[o].length>0){this.numFreeTextures--,this.numUsedTextures++,this._numBytesFree-=i,this.log();const c=this.freeTextures[o].shift();return this.usedTextures[o].push(c),c}let a;return r===xe.PACKED_2X2_FLOAT32?a=this.gpgpu.createPackedMatrixTexture(t[0],t[1]):r===xe.PACKED_2X2_FLOAT16?a=this.gpgpu.createFloat16PackedMatrixTexture(t[0],t[1]):r===xe.UNPACKED_FLOAT32?a=this.gpgpu.createFloat32MatrixTexture(t[0],t[1]):r===xe.UNPACKED_FLOAT16?a=this.gpgpu.createFloat16MatrixTexture(t[0],t[1]):r===xe.PACKED_4X1_UNSIGNED_BYTE&&(a=this.gpgpu.createUnsignedBytesMatrixTexture(t[0],t[1])),this.usedTextures[o].push(a),this.numUsedTextures++,this._numBytesAllocated+=i,this.log(),a}releaseTexture(t,e,s,r){if(this.freeTextures==null)return;const o=tm(s,r),i=em(e,o,r);i in this.freeTextures||(this.freeTextures[i]=[]);const a=Qf(e,o,this.gpgpu.gl,this.gpgpu.textureConfig,r),c=W().get("WEBGL_DELETE_TEXTURE_THRESHOLD");c!==-1&&this._numBytesAllocated>c?(this.gpgpu.deleteMatrixTexture(t.texture),this._numBytesAllocated-=a):(this.freeTextures[i].push(t),this.numFreeTextures++,this._numBytesFree+=a),this.numUsedTextures--;const l=this.usedTextures[i],u=l.indexOf(t);if(u<0)throw new Error("Cannot release a texture that was never provided by this texture manager");l.splice(u,1),this.log()}log(){if(!this.logEnabled)return;const t=this.numFreeTextures+this.numUsedTextures;console.log("Free/Used",`${this.numFreeTextures} / ${this.numUsedTextures}`,`(${t})`);const e=this._numBytesFree/this._numBytesAllocated;console.log(`Bytes allocated: ${this._numBytesAllocated}`),console.log(`Bytes unused: ${this._numBytesFree} (${Math.round(100*e)}%)`)}get numBytesAllocated(){return this._numBytesAllocated}get numBytesFree(){return this._numBytesFree}getNumUsedTextures(){return this.numUsedTextures}getNumFreeTextures(){return this.numFreeTextures}dispose(){if(this.freeTextures!=null){for(const t in this.freeTextures)this.freeTextures[t].forEach(e=>{this.gpgpu.deleteMatrixTexture(e.texture)});for(const t in this.usedTextures)this.usedTextures[t].forEach(e=>{this.gpgpu.deleteMatrixTexture(e.texture)});this.freeTextures=null,this.usedTextures=null,this.numUsedTextures=0,this.numFreeTextures=0,this._numBytesAllocated=0,this._numBytesFree=0}}}function V3(n,t){const e=n;if(t===e.R32F)return 4;if(t===e.R16F)return 2;if(t===e.RGBA32F)return 16;if(t===n.RGBA)return 16;if(t===e.RGBA16F)return 8;if(t===e.RGBA8)return 4;throw new Error(`Unknown internal format ${t}`)}function Qf(n,t,e,s,r){const o=W3(t,s);let i;if(r){const[c,l]=qr(n[0],n[1]);i=c*l}else{const[c,l]=Hi(n[0],n[1]);i=c*l}const a=V3(e,o);return i*a}function W3(n,t){switch(n){case xe.PACKED_2X2_FLOAT32:return my(t);case xe.PACKED_2X2_FLOAT16:return gy(t);case xe.UNPACKED_FLOAT32:return dy(t);case xe.UNPACKED_FLOAT16:return py(t);case xe.PACKED_4X1_UNSIGNED_BYTE:return fy(t);default:throw new Error(`Unknown physical texture type ${n}`)}}function U3(n){return W().getBool("WEBGL_RENDER_FLOAT32_ENABLED")?n?xe.PACKED_2X2_FLOAT32:xe.UNPACKED_FLOAT32:n?xe.PACKED_2X2_FLOAT16:xe.UNPACKED_FLOAT16}function tm(n,t){if(n===Xe.UPLOAD)return xe.PACKED_2X2_FLOAT32;if(n===Xe.RENDER||n==null)return U3(t);if(n===Xe.DOWNLOAD||n===Xe.PIXELS)return xe.PACKED_4X1_UNSIGNED_BYTE;throw new Error(`Unknown logical texture type ${n}`)}function em(n,t,e){return`${n[0]}_${n[1]}_${t}_${e}`}class Gn{constructor(t,e){this.variableNames=["A"],this.outputShape=t,this.enableShapeUniforms=Ae(this.outputShape.length),this.userCode=`
      float unaryOperation(float x) {
        ${e}
      }

      void main() {
        float x = getAAtOutCoords();
        float y = unaryOperation(x);

        setOutput(y);
      }
    `}}const fn="if (isnan(x)) return x;",G3="return x;",nm="return abs(x);",H3="return (x >= 0.0) ? x : (exp(x) - 1.0);",q3=fn+`
  return (x < 0.0) ? 0.0 : x;
`,K3=fn+`
  return (x < 0.0) ? 0.0 : min(6.0, x);
`,hr="return x;",j3="return 1.0 / (1.0 + exp(-1.0 * x));";const X3="return x;",Y3=`
  vec4 result;

  result.r = (x.r >= 0.0) ? x.r : (exp(x.r) - 1.0);
  result.g = (x.g >= 0.0) ? x.g : (exp(x.g) - 1.0);
  result.b = (x.b >= 0.0) ? x.b : (exp(x.b) - 1.0);
  result.a = (x.a >= 0.0) ? x.a : (exp(x.a) - 1.0);

  return result;
`,Z3=`
  vec4 result = x * vec4(greaterThanEqual(x, vec4(0.0)));
  bvec4 isNaN = isnan(x);

  result.r = isNaN.r ? x.r : result.r;
  result.g = isNaN.g ? x.g : result.g;
  result.b = isNaN.b ? x.b : result.b;
  result.a = isNaN.a ? x.a : result.a;

  return result;
`,J3=`
  vec4 result = min(x, vec4(6.)) * vec4(greaterThanEqual(x, vec4(0.0)));
  bvec4 isNaN = isnan(x);

  result.r = isNaN.r ? x.r : result.r;
  result.g = isNaN.g ? x.g : result.g;
  result.b = isNaN.b ? x.b : result.b;
  result.a = isNaN.a ? x.a : result.a;

  return result;
`,Q3="return 1.0 / (1.0 + exp(-1.0 * x));";class Bs{constructor(t,e){this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!0,this.outputShape=t,this.enableShapeUniforms=Ae(this.outputShape.length),this.userCode=`
      vec4 unaryOperation(vec4 x) {
        ${e}
      }

      void main() {
        vec4 x = getAAtOutCoords();
        vec4 y = unaryOperation(x);

        setOutput(y);
      }
    `}}class tB{constructor(t){this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!1,this.outputShape=t,this.enableShapeUniforms=Ae(this.outputShape.length);const e=t.length,s=Te("rc",e),r=Bt(e),o=L3(e,s),i=s.slice(-2),a=e<=1?"rc":`vec2(${i.join(",")})`;this.userCode=`
      void main() {
        ${r} rc = getOutputCoords();
        vec4 packedInput = getA(${o});

        setOutput(getChannel(packedInput, ${a}));
      }
    `}}const eB=fx,nB=1e-7,sB=1e-4,ua={};function rB(n){return n in ua||(ua[n]={}),ua[n]}const oB=W().getNumber("CPU_HANDOFF_SIZE_THRESHOLD"),iB=600;function aB(){return W().global.screen==null?1024:W().global.screen.height*W().global.screen.width*window.devicePixelRatio*iB/1024/1024}class Tl extends Uu{constructor(t){if(super(),this.pendingRead=new WeakMap,this.pendingDisposal=new WeakSet,this.dataRefCount=new WeakMap,this.numBytesInGPU=0,this.uploadWaitMs=0,this.downloadWaitMs=0,this.lastGlFlushTime=0,this.warnedAboutMemory=!1,this.pendingDeletes=0,this.disposed=!1,!W().getBool("HAS_WEBGL"))throw new Error("WebGL is not supported on this device");let e;if(t!=null){if(t instanceof Zl)e=t;else{const s=$n(W().getNumber("WEBGL_VERSION"),t);e=new Zl(s)}this.binaryCache={},this.gpgpuCreatedLocally=!1}else{const s=$n(W().getNumber("WEBGL_VERSION"));e=new Zl(s),this.binaryCache=rB(W().getNumber("WEBGL_VERSION")),this.gpgpuCreatedLocally=!0}this.gpgpu=e,this.canvas=this.gpgpu.gl.canvas,this.textureManager=new z3(this.gpgpu),this.numMBBeforeWarning=aB(),this.texData=new Pm(this,ss())}nextDataId(){return Tl.nextDataId++}numDataIds(){return this.texData.numDataIds()-this.pendingDeletes}write(t,e,s){if((W().getBool("WEBGL_CHECK_NUMERICAL_PROBLEMS")||W().getBool("DEBUG"))&&this.checkNumericalProblems(t),s==="complex64"&&t!=null)throw new Error("Cannot write to a complex64 dtype. Please use tf.complex(real, imag).");const r={id:this.nextDataId()};return this.texData.set(r,{shape:e,dtype:s,values:t,usage:Xe.UPLOAD,refCount:1}),r}refCount(t){return this.texData.has(t)?this.texData.get(t).refCount:0}incRef(t){const e=this.texData.get(t);e.refCount++}decRef(t){if(this.texData.has(t)){const e=this.texData.get(t);e.refCount--}}move(t,e,s,r,o){if(W().getBool("DEBUG")&&this.checkNumericalProblems(e),r==="complex64")throw new Error("Cannot write to a complex64 dtype. Please use tf.complex(real, imag).");this.texData.set(t,{shape:s,dtype:r,values:e,usage:Xe.UPLOAD,refCount:o})}disposeIntermediateTensorInfo(t){this.disposeData(t.dataId)}readSync(t){const e=this.texData.get(t),{values:s,dtype:r,complexTensorInfos:o,slice:i,shape:a,isPacked:c}=e;if(i!=null){let d;c?d=new Bs(a,hr):d=new Gn(a,hr);const p=this.runWebGLProgram(d,[{dataId:t,shape:a,dtype:r}],r),f=this.readSync(p.dataId);return this.disposeIntermediateTensorInfo(p),f}if(s!=null)return this.convertAndCacheOnCPU(t);if(r==="string")return s;const l=this.activeTimers!=null;let u;l&&(u=Fe());let h;if(r==="complex64"){const d=this.readSync(o.real.dataId),p=this.readSync(o.imag.dataId);h=Kn(d,p)}else h=this.getValuesFromTexture(t);return l&&(this.downloadWaitMs+=Fe()-u),this.convertAndCacheOnCPU(t,h)}async read(t){if(this.pendingRead.has(t)){const f=this.pendingRead.get(t);return new Promise(m=>f.push(m))}const e=this.texData.get(t),{values:s,shape:r,slice:o,dtype:i,complexTensorInfos:a,isPacked:c}=e;if(o!=null){let f;c?f=new Bs(r,hr):f=new Gn(r,hr);const m=this.runWebGLProgram(f,[{dataId:t,shape:r,dtype:i}],i),g=this.read(m.dataId);return this.disposeIntermediateTensorInfo(m),g}if(s!=null)return this.convertAndCacheOnCPU(t);if(W().getBool("DEBUG")&&!W().getBool("WEBGL_DOWNLOAD_FLOAT_ENABLED")&&W().getNumber("WEBGL_VERSION")===2)throw new Error("tensor.data() with WEBGL_DOWNLOAD_FLOAT_ENABLED=false and WEBGL_VERSION=2 not yet supported.");let l=null,u;if(i!=="complex64"&&W().get("WEBGL_BUFFER_SUPPORTED")){u=this.decode(t);const f=this.texData.get(u.dataId);l=this.gpgpu.createBufferFromTexture(f.texture.texture,...ia(r))}this.pendingRead.set(t,[]),i!=="complex64"&&await this.gpgpu.createAndWaitForFence();let h;if(i==="complex64"){const f=await Promise.all([this.read(a.real.dataId),this.read(a.imag.dataId)]),m=f[0],g=f[1];h=Kn(m,g)}else if(l==null)h=this.getValuesFromTexture(t);else{const f=q(r);h=this.gpgpu.downloadFloat32MatrixFromBuffer(l,f)}if(u!=null&&this.disposeIntermediateTensorInfo(u),l!=null){const f=this.gpgpu.gl;ot(f,()=>f.deleteBuffer(l))}const d=this.convertAndCacheOnCPU(t,h),p=this.pendingRead.get(t);return this.pendingRead.delete(t),p.forEach(f=>f(d)),this.pendingDisposal.has(t)&&(this.pendingDisposal.delete(t),this.disposeData(t)&&ss().removeDataId(t,this),this.pendingDeletes--),d}readToGPU(t,e={}){const s=this.texData.get(t),{values:r,shape:o,slice:i,dtype:a,isPacked:c,texture:l}=s;if(a==="complex64")throw new Error("Does not support reading texture for complex64 dtype.");if(i!=null){let p;c?p=new Bs(o,hr):p=new Gn(o,hr);const f=this.runWebGLProgram(p,[{dataId:t,shape:o,dtype:a}],a),m=this.readToGPU(f,e);return this.disposeIntermediateTensorInfo(f),m}if(l==null)throw r!=null?new Error("Data is not on GPU but on CPU."):new Error("There is no data on GPU or CPU.");const u=this.decode(t,e.customTexShape),h=ss().makeTensorFromTensorInfo(u),d=this.texData.get(u.dataId);return Object.assign({tensorRef:h},d.texture)}bufferSync(t){const e=this.readSync(t.dataId);if(t.dtype==="string")try{const s=e.map(r=>us(r));return yt(t.shape,t.dtype,s)}catch{throw new Error("Failed to decode encoded string bytes into utf-8")}return yt(t.shape,t.dtype,e)}checkNumericalProblems(t){if(t!=null)for(let e=0;e<t.length;e++){const s=t[e];if(!pL(s))throw W().getBool("WEBGL_RENDER_FLOAT32_CAPABLE")?Error(`The value ${s} cannot be represented with your current settings. Consider enabling float32 rendering: 'tf.env().set('WEBGL_RENDER_FLOAT32_ENABLED', true);'`):Error(`The value ${s} cannot be represented on this device.`)}}getValuesFromTexture(t){const{shape:e,dtype:s,isPacked:r}=this.texData.get(t),o=q(e);if(W().getBool("WEBGL_DOWNLOAD_FLOAT_ENABLED")){const d=this.decode(t),p=this.texData.get(d.dataId),f=this.gpgpu.downloadMatrixFromPackedTexture(p.texture.texture,...ia(e)).subarray(0,o);return this.disposeIntermediateTensorInfo(d),f}const i=W().getBool("WEBGL_PACK")&&r===!0,a=i?jl(e):e,c=i?new EP(a):new TP(a),l=this.runWebGLProgram(c,[{shape:a,dtype:s,dataId:t}],"float32"),u=this.texData.get(l.dataId),h=this.gpgpu.downloadByteEncodedFloatMatrixFromOutputTexture(u.texture.texture,u.texShape[0],u.texShape[1]).subarray(0,o);return this.disposeIntermediateTensorInfo(l),h}timerAvailable(){return W().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE")>0}time(t){const e=this.activeTimers,s=[];let r=!1;this.programTimersStack==null?(this.programTimersStack=s,r=!0):this.activeTimers.push(s),this.activeTimers=s,t();const o=kr(this.activeTimers.map(c=>c.query)).filter(c=>c!=null),i=kr(this.activeTimers.map(c=>c.name)).filter(c=>c!=null);this.activeTimers=e,r&&(this.programTimersStack=null);const a={uploadWaitMs:this.uploadWaitMs,downloadWaitMs:this.downloadWaitMs,kernelMs:null,wallMs:null};return(async()=>{if(W().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE")>0){const c=await Promise.all(o);a.kernelMs=Aw(c),a.getExtraProfileInfo=()=>c.map((l,u)=>({name:i[u],ms:l})).map(l=>`${l.name}: ${l.ms}`).join(", ")}else a.kernelMs={error:"WebGL query timers are not supported in this environment."};return this.uploadWaitMs=0,this.downloadWaitMs=0,a})()}memory(){return{unreliable:!1,numBytesInGPU:this.numBytesInGPU,numBytesInGPUAllocated:this.textureManager.numBytesAllocated,numBytesInGPUFree:this.textureManager.numBytesFree}}startTimer(){return W().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE")>0?this.gpgpu.beginQuery():{startMs:Fe(),endMs:null}}endTimer(t){return W().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE")>0?(this.gpgpu.endQuery(),t):(t.endMs=Fe(),t)}async getQueryTime(t){if(W().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE")>0)return this.gpgpu.waitForQueryAndGetTime(t);const e=t;return e.endMs-e.startMs}disposeData(t,e=!1){if(this.pendingDisposal.has(t))return!1;if(!this.texData.has(t))return!0;if(e?this.texData.get(t).refCount=0:this.texData.get(t).refCount--,!e&&this.texData.get(t).refCount>0)return!1;if(this.pendingRead.has(t))return this.pendingDisposal.add(t),this.pendingDeletes++,!1;this.releaseGPUData(t);const{complexTensorInfos:s}=this.texData.get(t);return s!=null&&(this.disposeData(s.real.dataId,e),this.disposeData(s.imag.dataId,e)),this.texData.delete(t),!0}releaseGPUData(t){const{texture:e,dtype:s,texShape:r,usage:o,isPacked:i,slice:a}=this.texData.get(t),c=a&&a.origDataId||t,l=this.dataRefCount.get(c);l>1?this.dataRefCount.set(c,l-1):(this.dataRefCount.delete(c),e!=null&&(this.numBytesInGPU-=this.computeBytes(r,s),this.textureManager.releaseTexture(e,r,o,i)));const u=this.texData.get(t);u.texture=null,u.texShape=null,u.isPacked=!1,u.slice=null}getTexture(t){return this.uploadToGPU(t),this.texData.get(t).texture.texture}getDataInfo(t){return this.texData.get(t)}shouldExecuteOnCPU(t,e=oB){return W().getBool("WEBGL_CPU_FORWARD")&&t.every(s=>this.texData.get(s.dataId).texture==null&&q(s.shape)<e)}getGPGPUContext(){return this.gpgpu}where(t){je("tf.where() in webgl locks the UI thread. Call tf.whereAsync() instead");const e=t.dataSync();return eB(t.shape,e)}packedUnaryOp(t,e,s){const r=new Bs(t.shape,e),o=this.compileAndRun(r,[t],s);return ss().makeTensorFromTensorInfo(o)}abs(t){if(this.shouldExecuteOnCPU([t])&&t.dtype!=="complex64"){const r=by(this.texData.get(t.dataId).values);return this.makeOutput(t.shape,t.dtype,r)}if(W().getBool("WEBGL_PACK_UNARY_OPERATIONS"))return this.packedUnaryOp(t,nm,t.dtype);const e=new Gn(t.shape,nm),s=this.compileAndRun(e,[t]);return ss().makeTensorFromTensorInfo(s)}makeTensorInfo(t,e,s){let r;if(e==="string"&&s!=null&&s.length>0&&Eo(s[0])){const o=s.map(i=>as(i));r=this.write(o,t,e)}else r=this.write(s,t,e);return this.texData.get(r).usage=null,{dataId:r,shape:t,dtype:e}}makeOutput(t,e,s){return ss().makeTensorFromTensorInfo(this.makeTensorInfo(t,e,s),this)}unpackTensor(t){const e=new tB(t.shape);return this.runWebGLProgram(e,[t],t.dtype)}packTensor(t){const e=new P3(t.shape);return this.runWebGLProgram(e,[t],t.dtype,null,!0)}packedReshape(t,e){const s=[Or(t.shape),..._r(t.shape)],r={dtype:t.dtype,shape:s,dataId:t.dataId},o=[Or(e),..._r(e)],i=new Iy(o,s),a=!0,c=[s],l=this.runWebGLProgram(i,[r],t.dtype,c,a);return{dataId:l.dataId,shape:e,dtype:l.dtype}}decode(t,e){const s=this.texData.get(t),{isPacked:r,shape:o,dtype:i}=s;if(e!=null){const d=q(o),p=e[0]*e[1]*4;S(d<=p,()=>"customTexShape is too small. Row * Column * 4 should be equal or larger than the size of the tensor data.")}const a=jl(o);let c;r?c=new NP(a):c=new SP(a);const l=!0,u=[e??ia(a)],h=this.runWebGLProgram(c,[{shape:a,dtype:i,dataId:t}],i,u,l,e);return{dtype:i,shape:o,dataId:h.dataId}}runWebGLProgram(t,e,s,r,o=!1,i){const a=this.makeTensorInfo(t.outputShape,s),c=this.texData.get(a.dataId);if(t.packedOutput&&(c.isPacked=!0),t.outPackingScheme===$o.DENSE){const x=i??ia(t.outputShape);c.texShape=x.map(b=>b*2)}if(t.outTexUsage!=null&&(c.usage=t.outTexUsage),q(a.shape)===0)return c.values=be(a.dtype,0),a;const l=[],u=e.map(x=>{if(x.dtype==="complex64")throw new Error("GPGPUProgram does not support complex64 input. For complex64 dtypes, please separate the program into real and imaginary parts.");let b=this.texData.get(x.dataId);if(b.texture==null){if(!t.packedInputs&&q(x.shape)<=W().getNumber("WEBGL_SIZE_UPLOAD_UNIFORM"))return{shape:x.shape,texData:null,isUniform:!0,uniformValues:b.values};t.packedInputs&&(b.isPacked=!0,b.shape=x.shape)}if(this.uploadToGPU(x.dataId),!!b.isPacked!=!!t.packedInputs)x=b.isPacked?this.unpackTensor(x):this.packTensor(x),l.push(x),b=this.texData.get(x.dataId);else if(b.isPacked&&!Ya(b.shape,x.shape)){const w=x,y=x.shape;x.shape=b.shape,x=this.packedReshape(x,y),l.push(x),b=this.texData.get(x.dataId),w.shape=y}return{shape:x.shape,texData:b,isUniform:!1}});this.uploadToGPU(a.dataId);const h={shape:a.shape,texData:c,isUniform:!1},d=$P(t,u,h),p=this.getAndSaveBinary(d,()=>CP(this.gpgpu,t,u,h)),f=this.activeTimers!=null;let m;f&&(m=this.startTimer()),W().get("ENGINE_COMPILE_ONLY")||kP(this.gpgpu,p,u,h,r),l.forEach(x=>this.disposeIntermediateTensorInfo(x)),f&&(m=this.endTimer(m),this.activeTimers.push({name:t.constructor.name,query:this.getQueryTime(m)}));const g=W().get("WEBGL_FLUSH_THRESHOLD");if(g>0){const x=Fe();x-this.lastGlFlushTime>g&&(this.gpgpu.gl.flush(),this.lastGlFlushTime=x)}if(!W().getBool("WEBGL_LAZILY_UNPACK")&&c.isPacked&&o===!1){const x=this.unpackTensor(a);return this.disposeIntermediateTensorInfo(a),x}return a}compileAndRun(t,e,s,r,o=!1){return s=s||e[0].dtype,this.runWebGLProgram(t,e,s,r,o)}getAndSaveBinary(t,e){return t in this.binaryCache||(this.binaryCache[t]=e()),this.binaryCache[t]}getTextureManager(){return this.textureManager}dispose(){this.disposed||(W().getBool("IS_TEST")||Object.keys(this.binaryCache).forEach(e=>{this.gpgpu.deleteProgram(this.binaryCache[e].webGLProgram),delete this.binaryCache[e]}),this.textureManager.dispose(),this.canvas!=null&&typeof HTMLCanvasElement<"u"&&this.canvas instanceof HTMLCanvasElement?this.canvas.remove():this.canvas=null,this.gpgpuCreatedLocally&&(this.gpgpu.program=null,this.gpgpu.dispose()),this.disposed=!0)}floatPrecision(){return this.floatPrecisionValue==null&&(this.floatPrecisionValue=z(()=>{if(!W().get("WEBGL_RENDER_FLOAT32_ENABLED")){const t=W().getBool("DEBUG");W().set("DEBUG",!1);const e=this.abs(ft(1e-8)).dataSync()[0];if(W().set("DEBUG",t),e>0)return 32}return 16})),this.floatPrecisionValue}epsilon(){return this.floatPrecision()===32?nB:sB}uploadToGPU(t){const e=this.texData.get(t),{shape:s,dtype:r,values:o,texture:i,usage:a,isPacked:c}=e;if(i!=null)return;const l=this.activeTimers!=null;let u;l&&(u=Fe());let h=e.texShape;if(h==null&&(h=DL(s,c),e.texShape=h),o!=null){const d=jl(s);let p,f=h[1],m=h[0];const g=o instanceof Uint8Array||o instanceof Uint8ClampedArray;(c||!g)&&([f,m]=qr(h[0],h[1])),c?p=new DP(d,g):p=new RP(d,g);const x=g?[m,f]:h,b=this.makeTensorInfo(x,r),w=this.texData.get(b.dataId);g?w.usage=Xe.PIXELS:w.usage=Xe.UPLOAD,w.texShape=x,this.gpgpu.uploadDenseMatrixToTexture(this.getTexture(b.dataId),f,m,o);const y=[[m,f]],C=this.runWebGLProgram(p,[b],r,y,!0),N=this.texData.get(C.dataId);e.texShape=N.texShape,e.isPacked=N.isPacked,e.usage=N.usage,W().get("ENGINE_COMPILE_ONLY")?this.disposeData(C.dataId):(e.texture=N.texture,e.values=null,this.texData.delete(C.dataId)),this.disposeIntermediateTensorInfo(b),l&&(this.uploadWaitMs+=Fe()-u)}else{const d=this.acquireTexture(h,a,r,c);e.texture=d}}convertAndCacheOnCPU(t,e){const s=this.texData.get(t),{dtype:r}=s;return this.releaseGPUData(t),e!=null&&(s.values=cB(e,r)),s.values}acquireTexture(t,e,s,r){if(this.numBytesInGPU+=this.computeBytes(t,s),!this.warnedAboutMemory&&this.numBytesInGPU>this.numMBBeforeWarning*1024*1024){const o=(this.numBytesInGPU/1024/1024).toFixed(2);this.warnedAboutMemory=!0,console.warn(`High memory usage in GPU: ${o} MB, most likely due to a memory leak`)}return this.textureManager.acquireTexture(t,e,r)}computeBytes(t,e){return t[0]*t[1]*ru(e)}checkCompileCompletion(){for(const[,t]of Object.entries(this.binaryCache))this.checkCompletion_(t)}async checkCompileCompletionAsync(){const t=[];if(this.gpgpu.parallelCompilationExtension){for(const[,e]of Object.entries(this.binaryCache))t.push(this.checkCompletionAsync_(e));return Promise.all(t)}else{for(const[,e]of Object.entries(this.binaryCache)){const s=new Promise(r=>{try{this.checkCompletion_(e),r(!0)}catch(o){throw o}});t.push(s)}return Promise.all(t)}}async checkCompletionAsync_(t){return this.gpgpu.gl.getProgramParameter(t.webGLProgram,this.gpgpu.parallelCompilationExtension.COMPLETION_STATUS_KHR)?this.checkCompletion_(t):(await wx(),this.checkCompletionAsync_(t))}checkCompletion_(t){if(this.gpgpu.gl.getProgramParameter(t.webGLProgram,this.gpgpu.gl.LINK_STATUS)===!1)throw console.log(this.gpgpu.gl.getProgramInfoLog(t.webGLProgram)),this.gpgpu.gl.getShaderParameter(t.fragmentShader,this.gpgpu.gl.COMPILE_STATUS)===!1?(iy(t.source,this.gpgpu.gl.getShaderInfoLog(t.fragmentShader)),new Error("Failed to compile fragment shader.")):new Error("Failed to link vertex and fragment shaders.");return!0}getUniformLocations(){for(const[,t]of Object.entries(this.binaryCache)){const{uniformLocations:e,customUniformLocations:s,infLoc:r,nanLoc:o,inShapesLocations:i,inTexShapesLocations:a,outShapeLocation:c,outShapeStridesLocation:l,outTexShapeLocation:u}=hy(this.gpgpu,t.program,t.webGLProgram);t.uniformLocations=e,t.customUniformLocations=s,t.infLoc=r,t.nanLoc=o,t.inShapesLocations=i,t.inTexShapesLocations=a,t.outShapeLocation=c,t.outShapeStridesLocation=l,t.outTexShapeLocation=u}}}Tl.nextDataId=0;function cB(n,t){if(t==="float32"||t==="complex64")return n;if(t==="int32"||t==="bool"){const e=t==="int32"?new Int32Array(n.length):new Uint8Array(n.length);for(let s=0;s<e.length;++s)e[s]=Math.round(n[s]);return e}else throw new Error(`Unknown dtype ${t}`)}wg()&&Ag("webgl",()=>new Tl,2);const Ap=`
  if (isnan(a)) return a;
  if (isnan(b)) return b;
`;class Mr{constructor(t,e,s){this.variableNames=["A","B"],this.outputShape=mt(e,s),this.enableShapeUniforms=Ae(this.outputShape.length),this.userCode=`
      float binaryOperation(float a, float b) {
        ${t}
      }

      void main() {
        float a = getAAtOutCoords();
        float b = getBAtOutCoords();
        setOutput(binaryOperation(a, b));
      }
    `}}const ji=`
  result.r = isNaN.r ? NAN : result.r;
  result.g = isNaN.g ? NAN : result.g;
  result.b = isNaN.b ? NAN : result.b;
  result.a = isNaN.a ? NAN : result.a;
`;class Xi{constructor(t,e,s,r=!1){this.variableNames=["A","B"],this.supportsBroadcasting=!0,this.packedInputs=!0,this.packedOutput=!0,this.outputShape=mt(e,s);const o=this.outputShape.length;this.enableShapeUniforms=Ae(o);let i="";if(r)if(o===0||q(this.outputShape)===1)i=`
          result.y = 0.;
          result.z = 0.;
          result.w = 0.;
        `;else if(i=`
          ${Bt(o)} coords = getOutputCoords();
        `,o===1)this.enableShapeUniforms?i+=`
            result.y = (coords + 1) >= outShape ? 0. : result.y;
            result.z = 0.;
            result.w = 0.;
          `:i+=`
            result.y = (coords + 1) >= ${this.outputShape[0]} ? 0. : result.y;
            result.z = 0.;
            result.w = 0.;
          `;else{const c=Te("coords",o);this.enableShapeUniforms?i+=`
            bool nextRowOutOfBounds =
              (${c[o-2]} + 1) >= outShape[${o} - 2];
            bool nextColOutOfBounds =
              (${c[o-1]} + 1) >= outShape[${o} - 1];
            result.y = nextColOutOfBounds ? 0. : result.y;
            result.z = nextRowOutOfBounds ? 0. : result.z;
            result.w = nextColOutOfBounds || nextRowOutOfBounds ? 0. : result.w;
          `:i+=`
            bool nextRowOutOfBounds =
              (${c[o-2]} + 1) >= ${this.outputShape[o-2]};
            bool nextColOutOfBounds =
              (${c[o-1]} + 1) >= ${this.outputShape[o-1]};
            result.y = nextColOutOfBounds ? 0. : result.y;
            result.z = nextRowOutOfBounds ? 0. : result.z;
            result.w = nextColOutOfBounds || nextRowOutOfBounds ? 0. : result.w;
          `}this.userCode=`
      vec4 binaryOperation(vec4 a, vec4 b) {
        ${t}
      }

      void main() {
        vec4 a = getAAtOutCoords();
        vec4 b = getBAtOutCoords();

        vec4 result = binaryOperation(a, b);
        ${i}

        setOutput(result);
      }
    `}}function He(n){const{inputs:t,backend:e}=n,{x:s}=t;return e.incRef(s.dataId),{dataId:s.dataId,shape:s.shape,dtype:s.dtype}}const lB={kernelName:Zo,backendName:"webgl",kernelFunc:He};function $s(n){const{inputs:t,backend:e}=n,{real:s,imag:r}=t,o=e.makeTensorInfo(s.shape,"complex64"),i=e.texData.get(o.dataId),a=He({inputs:{x:s},backend:e}),c=He({inputs:{x:r},backend:e});return i.complexTensorInfos={real:a,imag:c},o}const uB={kernelName:Qu,backendName:"webgl",kernelFunc:$s};const vy="return (a < 0.) ? b * a : a;",Cy=`
  vec4 aLessThanZero = vec4(lessThan(a, vec4(0.)));
  return (aLessThanZero * (b * a)) + ((vec4(1.0) - aLessThanZero) * a);
`;function hB(n){const{inputs:t,backend:e,attrs:s}=n,{x:r}=t,{alpha:o}=s,i=e.makeTensorInfo([],"float32",xs(o,"float32")),a=W().getBool("WEBGL_PACK_BINARY_OPERATIONS")?new Xi(Cy,r.shape,i.shape):new Mr(vy,r.shape,i.shape),c=e.runWebGLProgram(a,[r,i],"float32");return e.disposeIntermediateTensorInfo(i),c}const dB={kernelName:wc,backendName:"webgl",kernelFunc:hB};const ky="return (a < 0.) ? b * a : a;",$y=`
  vec4 aLessThanZero = vec4(lessThan(a, vec4(0.)));
  return (aLessThanZero * (b * a)) + ((vec4(1.0) - aLessThanZero) * a);
`;function pB(n){const{inputs:t,backend:e}=n,{x:s,alpha:r}=t,o=W().getBool("WEBGL_PACK_BINARY_OPERATIONS")?new Xi($y,s.shape,r.shape):new Mr(ky,s.shape,r.shape);return e.runWebGLProgram(o,[s,r],"float32")}const fB={kernelName:Bc,backendName:"webgl",kernelFunc:pB};const Zr="if (isnan(x)) return x;";function St({opSnippet:n,packedOpSnippet:t,cpuKernelImpl:e,dtype:s}){return({inputs:r,backend:o})=>{const{x:i}=r,a=o,c=s||i.dtype;if(a.shouldExecuteOnCPU([i])&&e!=null){const h=a.texData.get(i.dataId),d=e(h.values,c);return a.makeTensorInfo(i.shape,c,d)}const l=W().getBool("WEBGL_PACK_UNARY_OPERATIONS")&&t!=null;let u;return l?u=new Bs(i.shape,t):u=new Gn(i.shape,n),a.runWebGLProgram(u,[i],c)}}function Ie({opSnippet:n,packedOpSnippet:t,checkOutOfBounds:e=!1,supportsComplex:s=!1,cpuKernelImpl:r,dtype:o}){return({inputs:i,backend:a})=>{const{a:c,b:l}=i,u=a;if(s&&c.dtype==="complex64"){const f=u.texData.get(c.dataId),m=u.texData.get(l.dataId),[g,x]=[[f.complexTensorInfos.real,m.complexTensorInfos.real],[f.complexTensorInfos.imag,m.complexTensorInfos.imag]].map(w=>{const[y,I]=w,C={dataId:y.dataId,dtype:y.dtype,shape:c.shape},N={dataId:I.dataId,dtype:I.dtype,shape:l.shape},T=new Mr(n,c.shape,l.shape);return u.runWebGLProgram(T,[C,N],Ve(y.dtype,I.dtype))}),b=$s({inputs:{real:g,imag:x},backend:u});return u.disposeIntermediateTensorInfo(g),u.disposeIntermediateTensorInfo(x),b}const h=o||Ve(c.dtype,l.dtype);if((c.dtype==="string"||l.dtype==="string"||u.shouldExecuteOnCPU([c,l]))&&r!=null){const f=u.texData.get(c.dataId).values,m=u.texData.get(l.dataId).values,g=c.dtype==="string"?Qs(f):f,x=c.dtype==="string"?Qs(m):m,[b,w]=r(c.shape,l.shape,g,x,h),y=u.makeTensorInfo(w,h),I=u.texData.get(y.dataId);return I.values=b,y}const d=W().getBool("WEBGL_PACK_BINARY_OPERATIONS")&&t!=null;let p;return d?p=new Xi(t,c.shape,l.shape,e):p=new Mr(n,c.shape,l.shape),u.runWebGLProgram(p,[c,l],h)}}function So(n,t=!1){if(n==="linear")return t?X3:G3;if(n==="relu")return t?Z3:q3;if(n==="elu")return t?Y3:H3;if(n==="relu6")return t?J3:K3;if(n==="prelu")return t?$y:ky;if(n==="leakyrelu")return t?Cy:vy;if(n==="sigmoid")return t?Q3:j3;throw new Error(`Activation ${n} has not been implemented for the WebGL backend.`)}class Sy{constructor(t,e,s,r=!1,o=!1,i=!1,a=null,c=!1,l=!1){this.variableNames=["matrixA","matrixB"],this.packedInputs=!0,this.packedOutput=!0,this.outputShape=s,this.enableShapeUniforms=Ae(this.outputShape.length);const u=r?t[1]:t[2],h=Math.ceil(u/2),d=r?"i * 2, rc.y":"rc.y, i * 2",p=o?"rc.z, i * 2":"i * 2, rc.z",f=r?["a.xxyy","a.zzww"]:["a.xxzz","a.yyww"],m=o?["b.xzxz","b.ywyw"]:["b.xyxy","b.zwzw"];let g="",x="";a&&(c?g=`vec4 activation(vec4 a) {
          vec4 b = getPreluActivationWeightsAtOutCoords();
          ${a}
        }`:l?g=`vec4 activation(vec4 a) {
          vec4 b = getLeakyreluAlphaAtOutCoords();
          ${a}
        }`:g=`vec4 activation(vec4 x) {
          ${a}
        }`,x="result = activation(result);");const b=i?"result += getBiasAtOutCoords();":"";i&&this.variableNames.push("bias"),c&&this.variableNames.push("preluActivationWeights"),l&&this.variableNames.push("leakyreluAlpha");let w="rc.x",y="rc.x";t[0]<e[0]?w=`int(min(float(rc.x), ${t[0]-1}.))`:e[0]<t[0]&&(y=`int(min(float(rc.x), ${e[0]-1}.))`),this.userCode=`
      ${g}
      // Don't use uniform for sharedDimensionPacked for performance.
      const float sharedDimension = ${h}.0;

      vec4 dot2x2ARowBCol(ivec3 rc) {
        vec4 result = vec4(0);
        for (int i = 0; i < ${h}; i++) {
          int batchA = ${w};
          int batchB = ${y};
          vec4 a = getMatrixA(batchA, ${d});
          vec4 b = getMatrixB(batchB, ${p});

          // These swizzled products need to be separately added.
          // See: https://github.com/tensorflow/tfjs/issues/1735
          result += (${f[0]} * ${m[0]});
          result += (${f[1]} * ${m[1]});
        }
        return result;
      }

      void main() {
        ivec3 rc = getOutputCoords();
        vec4 result = dot2x2ARowBCol(rc);

        ${b}

        ${x}

        setOutput(result);
      }
    `}}const sm={REAL:"return areal * breal - aimag * bimag;",IMAG:"return areal * bimag + aimag * breal;"};class rm{constructor(t,e,s){this.variableNames=["AReal","AImag","BReal","BImag"],this.outputShape=mt(e,s),this.userCode=`
      float binaryOpComplex(
          float areal, float aimag, float breal, float bimag) {
        ${t}
      }

      void main() {
        float areal = getARealAtOutCoords();
        float aimag = getAImagAtOutCoords();
        float breal = getBRealAtOutCoords();
        float bimag = getBImagAtOutCoords();
        setOutput(binaryOpComplex(areal, aimag, breal, bimag));
      }
    `}}const om="return a * b;";function Fp(n){const{inputs:t,backend:e}=n,{a:s,b:r}=t,o=Ve(s.dtype,r.dtype);if(s.dtype==="complex64"){const a=e.texData.get(s.dataId),c=e.texData.get(r.dataId),l=new rm(sm.REAL,s.shape,r.shape),u=new rm(sm.IMAG,s.shape,r.shape),h=[{dataId:a.complexTensorInfos.real.dataId,dtype:a.complexTensorInfos.real.dtype,shape:s.shape},{dataId:a.complexTensorInfos.imag.dataId,dtype:a.complexTensorInfos.imag.dtype,shape:s.shape},{dataId:c.complexTensorInfos.real.dataId,dtype:c.complexTensorInfos.real.dtype,shape:r.shape},{dataId:c.complexTensorInfos.imag.dataId,dtype:c.complexTensorInfos.imag.dtype,shape:r.shape}],d=e.runWebGLProgram(l,h,"float32"),p=e.runWebGLProgram(u,h,"float32"),f=$s({inputs:{real:d,imag:p},backend:e});return e.disposeIntermediateTensorInfo(d),e.disposeIntermediateTensorInfo(p),f}if(e.shouldExecuteOnCPU([s,r])){const a=e.texData.get(s.dataId),c=e.texData.get(r.dataId),[l,u]=m3(s.shape,r.shape,a.values,c.values,o),h=e.makeTensorInfo(u,o),d=e.texData.get(h.dataId);return d.values=l,h}let i;return W().getBool("WEBGL_PACK_BINARY_OPERATIONS")?i=new Xi(om,s.shape,r.shape):i=new Mr(om,s.shape,r.shape),e.runWebGLProgram(i,[s,r],o)}const mB={kernelName:ii,backendName:"webgl",kernelFunc:Fp};function gB(n,t,e){const s=[Or(n.shape),..._r(n.shape)],r={dtype:n.dtype,shape:s,dataId:n.dataId},o=[Or(t),..._r(t)],i=new Iy(o,s),a=!0,c=[s],l=e.runWebGLProgram(i,[r],n.dtype,c,a);return{dataId:l.dataId,shape:t,dtype:l.dtype}}function et(n){const{inputs:t,backend:e,attrs:s}=n,{x:r}=t,{shape:o}=s,i=e,a=q(r.shape),c=zm(o,a),l=q(c);S(a===l,()=>`The new shape (${c}) has ${l} elements and the old shape (${r.shape}) has ${a} elements. The new shape and old shape must have the same number of elements.`);const u=i.texData.get(r.dataId);return u.isPacked&&!Ya(r.shape,c)&&!(u.texture!==null&&Ya(u.shape,c))?gB(r,c,i):(i.incRef(r.dataId),{dataId:r.dataId,shape:c,dtype:r.dtype})}const xB={kernelName:Vc,backendName:"webgl",kernelFunc:et};class im{constructor(t,e){this.variableNames=["x"];const{windowSize:s,batchSize:r,inSize:o,outSize:i}=t;this.outputShape=[r,i];const a=Math.floor(s/4)*4,c=s%4;let l="sumValue += dot(values, ones);";if(e!=null){const h=1/e;l=`sumValue += dot(values * ${$r(h)?h.toPrecision(2):h}, ones);`}let u="";o%s>0&&(u=`
        if (inIdx < 0 || inIdx >= ${o}) {
          return 0.0;
        }
      `),this.userCode=`
      const vec4 ones = vec4(1.0, 1.0, 1.0, 1.0);

      float getValue(int batch, int inIdx) {
        ${u}
        return getX(batch, inIdx);
      }

      void main() {
        ivec2 coords = getOutputCoords();
        int batch = coords[0];
        int outIdx = coords[1];
        int inOffset = outIdx * ${s};

        float sumValue = 0.0;

        for (int i = 0; i < ${a}; i += 4) {
          int inIdx = inOffset + i;
          vec4 values = vec4(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1),
            getValue(batch, inIdx + 2),
            getValue(batch, inIdx + 3)
          );

          ${l}
        }

        int inIdx = inOffset + ${a};
        if (${c===1}) {
          vec4 values = vec4(getValue(batch, inIdx), 0.0, 0.0, 0.0);

          ${l}
        } else if (${c===2}) {
          vec4 values = vec4(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1), 0.0, 0.0);

          ${l}
        } else if (${c===3}) {
          vec4 values = vec4(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1),
            getValue(batch, inIdx + 2), 0.0);

          ${l}
        }
        setOutput(sumValue);
      }
    `}}class bB{constructor(t,e){this.variableNames=["x"];const{windowSize:s,batchSize:r,inSize:o,outSize:i}=t;this.outputShape=[r,i];let a="0.0",c="";e==="prod"?a="1.0":e==="min"?(a="1.0 / 1e-20",c="min"):e==="max"&&(a="-1.0 / 1e-20",c="max");let l=`${e}(${e}(${e}(minMaxValue[0], minMaxValue[1]), minMaxValue[2]), minMaxValue[3])`;e==="sum"?l="sumValue":e==="prod"?l="prodValue":e==="all"?l="allValue":e==="any"&&(l="anyValue");const u=Math.floor(s/4)*4,h=s%4;let d=`
      if (${e==="sum"}) {
        sumValue += dot(values, ones);
      } else if (${e==="prod"}) {
        vec2 tmp = vec2(values[0], values[1]) * vec2(values[2], values[3]);
        prodValue *= tmp[0] * tmp[1];
      } else {
        minMaxValue = ${c}(values, minMaxValue);
        if (${e==="min"} || ${e==="max"}) {
          minMaxValue = ${c}(values, minMaxValue);
          bvec4 isNaN = isnan(values);
          if (isNaN.r || isNaN.g || isNaN.b || isNaN.a) {
            minMaxValue = vec4(NAN);
          }
        }
      }
    `,p="vec4";e==="all"?(a="1.0",d=`
        bool reducedAllValue = all(values);
        float floatedReducedAllValue = float(reducedAllValue);
        allValue = float(allValue >= 1.0 && floatedReducedAllValue >= 1.0);
      `,p="bvec4"):e==="any"&&(a="0.0",d=`
        bool reducedAnyValue = any(values);
        float floatedReducedAnyValue = float(reducedAnyValue);
        anyValue = float(anyValue >= 1.0 || floatedReducedAnyValue >= 1.0);
      `,p="bvec4");let f="";o%s>0&&(f=`
        if (inIdx < 0 || inIdx >= ${o}) {
          return initializationValue;
        }
      `),this.userCode=`
      const float initializationValue = ${a};
      const vec4 ones = vec4(1.0, 1.0, 1.0, 1.0);

      float getValue(int batch, int inIdx) {
        ${f}
        return getX(batch, inIdx);
      }

      void main() {
        ivec2 coords = getOutputCoords();
        int batch = coords[0];
        int outIdx = coords[1];
        int inOffset = outIdx * ${s};

        vec4 minMaxValue = vec4(${a});
        float prodValue = 1.0;
        float sumValue = 0.0;
        float allValue = 1.0;
        float anyValue = 0.0;

        for (int i = 0; i < ${u}; i += 4) {
          int inIdx = inOffset + i;
          ${p} values = ${p}(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1),
            getValue(batch, inIdx + 2),
            getValue(batch, inIdx + 3)
          );

          ${d}
        }

        int inIdx = inOffset + ${u};
        if (${h===1}) {
          ${p} values = ${p}(
            getValue(batch, inIdx),
            initializationValue,
            initializationValue,
            initializationValue
          );

          ${d}
        } else if (${h===2}) {
          ${p} values = ${p}(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1),
            initializationValue,
            initializationValue
          );

          ${d}
        } else if (${h===3}) {
          ${p} values = ${p}(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1),
            getValue(batch, inIdx + 2),
            initializationValue
          );

          ${d}
        }
        setOutput(${l});
      }
    `}}function yB(n){const t=[];for(;t.length===0||t[t.length-1].outSize!==1;){const e=t.length?t[t.length-1].outSize:n[1],s=dl(e);t.push({inSize:e,windowSize:s,outSize:Math.ceil(e/s)})}return t}function cr(n,t,e,s){const r=yB(n.shape);let o=n;for(let i=0;i<r.length;i++){const{inSize:a,windowSize:c,outSize:l}=r[i];let u,h;e==="mean"?u=i===0?new im({windowSize:c,inSize:a,batchSize:n.shape[0],outSize:l},a):new im({windowSize:c,inSize:a,batchSize:n.shape[0],outSize:l}):u=new bB({windowSize:c,inSize:a,batchSize:n.shape[0],outSize:l},e),h=o,o=s.runWebGLProgram(u,[o],t),h.dataId!==n.dataId&&s.disposeIntermediateTensorInfo(h)}return o}class wB{constructor(t,e){this.variableNames=["A"];const s=new Array(t.length);for(let i=0;i<s.length;i++)s[i]=t[e[i]];this.outputShape=s,this.rank=s.length;const r=Bt(this.rank),o=IB(e);this.userCode=`
    void main() {
      ${r} resRC = getOutputCoords();
      setOutput(getA(${o}));
    }
    `}}function IB(n){const t=n.length;if(t>6)throw Error(`Transpose for rank ${t} is not yet supported`);const e=["resRC.x","resRC.y","resRC.z","resRC.w","resRC.u","resRC.v"],s=new Array(t);for(let r=0;r<n.length;r++)s[n[r]]=e[r];return s.join()}class vB{constructor(t,e){this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!0;const s=new Array(t.length);for(let u=0;u<s.length;u++)s[u]=t[e[u]];if(this.outputShape=s,this.rank=s.length,this.rank>6)throw Error(`Packed transpose for rank ${this.rank} is not yet supported.`);const r=Bt(this.rank),o=wy("rc",this.rank),i=new Array(this.rank);for(let u=0;u<e.length;u++)i[e[u]]=o[u];const a=`vec2(${i.slice(-2).join()})`,c=`++${o[this.rank-1]} < ${s[this.rank-1]}`,l=`getChannel(getA(${i.join()}), ${a})`;this.userCode=`
    void main() {
      ${r} rc = getOutputCoords();
      vec4 result = vec4(0.);
      result[0] = ${l};
      if(${c}) {
        result[1] = ${l};
      }
      --${o[this.rank-1]};
      if(++${o[this.rank-2]} < ${s[this.rank-2]}) {
        result[2] = ${l};
        if(${c}) {
          result[3] = ${l};
        }
      }
      setOutput(result);
    }
    `}}function El(n,t,e){const s=W().getBool("WEBGL_PACK_ARRAY_OPERATIONS")?new vB(n.shape,t):new wB(n.shape,t);return e.runWebGLProgram(s,[n],n.dtype)}function CB(n,t,e,s){const r=t,o=n.shape.length,i=wt(r,n.shape);let a=i;const c=Kt(a,o),l=c!=null;let u=n;l&&(u=El(n,c,s),a=Qt(a.length,o)),we("sum",a,o);const[h,d]=fe(u.shape,a);let p=h;e&&(p=Jt(h,i));const f=q(d),g=q(n.shape)/f,x=et({inputs:{x:u},attrs:{shape:[g,f]},backend:s}),b=Lh(n.dtype),w=cr(x,b,"sum",s),y=et({inputs:{x:w},attrs:{shape:p},backend:s});return s.disposeIntermediateTensorInfo(x),s.disposeIntermediateTensorInfo(w),l&&s.disposeIntermediateTensorInfo(u),y}function Rl(n){const{inputs:t,backend:e,attrs:s}=n,{x:r}=t,{axis:o,keepDims:i}=s;return CB(r,o,i,e)}const kB={kernelName:Kc,backendName:"webgl",kernelFunc:Rl};function Re(n){const{inputs:t,backend:e,attrs:s}=n,{x:r}=t,{perm:o}=s,i=e,a=r.shape.length,c=new Array(a);for(let u=0;u<c.length;u++)c[u]=r.shape[o[u]];let l;if(i.shouldExecuteOnCPU([r])){const h=i.texData.get(r.dataId).values,d=Dp(h,r.shape,r.dtype,o,c);l=i.makeTensorInfo(c,r.dtype);const p=i.texData.get(l.dataId);p.values=d}else l=El(r,o,i);return l}const $B={kernelName:yr,backendName:"webgl",kernelFunc:Re};const Ny=1e3;function Za({a:n,b:t,transposeA:e,transposeB:s,backend:r,bias:o=null,preluActivationWeights:i=null,leakyreluAlpha:a=0,activation:c=null}){const l=n.shape.length,u=t.shape.length,h=e?n.shape[l-2]:n.shape[l-1],d=s?t.shape[u-1]:t.shape[u-2],p=e?n.shape[l-1]:n.shape[l-2],f=s?t.shape[u-2]:t.shape[u-1],m=n.shape.slice(0,-2),g=t.shape.slice(0,-2),x=q(m),b=q(g),y=mt(n.shape.slice(0,-2),t.shape.slice(0,-2)).concat([p,f]);S(h===d,()=>`Error in matMul: inner shapes (${h}) and (${d}) of Tensors with shapes ${n.shape} and ${t.shape} and transposeA=${e} and transposeB=${s} must match.`);const I=e?[x,h,p]:[x,p,h],C=s?[b,f,d]:[b,d,f],N=et({inputs:{x:n},backend:r,attrs:{shape:I}}),T=et({inputs:{x:t},backend:r,attrs:{shape:C}}),$=[N,T],k=Math.max(x,b),v=e?N.shape[1]:N.shape[2],R=o!=null,_=i!=null,P=c==="leakyrelu",L=c!=null?So(c,!0):null,B=R||_||P||L!=null;let U;if((p===1||f===1)&&v>Ny&&B===!1){let H=N,K=T;e&&(H=Re({inputs:{x:N},backend:r,attrs:{perm:[0,2,1]}}),$.push(H)),s&&(K=Re({inputs:{x:T},backend:r,attrs:{perm:[0,2,1]}}),$.push(K));const j=f!==1,Y=f===1;let Z=H;j&&(Z=et({inputs:{x:H},backend:r,attrs:{shape:[k,v,1]}}),$.push(Z));const tt=f===1?2:1;let Q=K;Y&&(Q=et({inputs:{x:K},backend:r,attrs:{shape:[k,1,v]}}),$.push(Q));const st=Fp({inputs:{a:Z,b:Q},backend:r});U=Rl({inputs:{x:st},backend:r,attrs:{axis:tt,keepDims:!0}}),$.push(st)}else{const H=Ve(n.dtype,t.dtype),K=new Sy(I,C,[k,p,f],e,s,R,L,_,P),j=[N,T];if(o!=null&&j.push(o),_&&j.push(i),P){const Y=r.makeTensorInfo([],"float32",xs(a,"float32"));j.push(Y),$.push(Y)}U=r.runWebGLProgram(K,j,H)}const V=et({inputs:{x:U},backend:r,attrs:{shape:y}});$.push(U);for(const H of $)r.disposeIntermediateTensorInfo(H);return V}function SB(n){const{inputs:t,backend:e,attrs:s}=n,{a:r,b:o,bias:i,preluActivationWeights:a}=t,{transposeA:c,transposeB:l,activation:u,leakyreluAlpha:h}=s;return Za({a:r,b:o,transposeA:c,transposeB:l,backend:e,bias:i,preluActivationWeights:a,leakyreluAlpha:h,activation:u})}const NB={kernelName:Sa,backendName:"webgl",kernelFunc:SB};const am="return abs(x);";function TB(n){const{inputs:t,backend:e}=n,{x:s}=t;if(e.shouldExecuteOnCPU([s])&&s.dtype!=="complex64"){const o=e.texData.get(s.dataId),i=by(o.values);return e.makeTensorInfo(s.shape,s.dtype,i)}let r;return W().getBool("WEBGL_PACK_UNARY_OPERATIONS")?r=new Bs(s.shape,am):r=new Gn(s.shape,am),e.runWebGLProgram(r,[s],s.dtype)}const EB={kernelName:tc,backendName:"webgl",kernelFunc:TB};const RB=fn+`
  if (abs(x) > 1.) {
    return NAN;
  }
  return acos(x);
`,DB=St({opSnippet:RB}),AB={kernelName:Do,backendName:"webgl",kernelFunc:DB};const FB=fn+`
  if (x < 1.0) return NAN;
return log(x + sqrt(x * x - 1.0));`,OB=St({opSnippet:FB}),_B={kernelName:Ao,backendName:"webgl",kernelFunc:OB};const cm="return a + b;",MB=Ie({opSnippet:cm,packedOpSnippet:cm,supportsComplex:!0,cpuKernelImpl:XP}),LB={kernelName:Pr,backendName:"webgl",kernelFunc:MB};class PB{constructor(t,e){this.outputShape=[],this.outputShape=t,this.variableNames=e.map((o,i)=>`T${i}`);const s=[];this.variableNames.forEach(o=>{s.push(`float v${o} = get${o}AtOutCoords();`)});const r=this.variableNames.map(o=>`v${o}`).join(" + ");this.userCode=`
      void main() {
        ${s.join(`
        `)}

        float result = ${r};
        setOutput(result);
      }
    `}}class BB{constructor(t,e){this.outputShape=[],this.packedInputs=!0,this.packedOutput=!0,this.outputShape=t,this.variableNames=e.map((o,i)=>`T${i}`);const s=[];this.variableNames.forEach(o=>{s.push(`vec4 v${o} = get${o}AtOutCoords();`)});const r=this.variableNames.map(o=>`v${o}`).join(" + ");this.userCode=`
      void main() {
        ${s.join(`
        `)}

        vec4 result = ${r};
        setOutput(result);
      }
    `}}function $a(n){const{inputs:t,backend:e}=n,s=t;if(s.length===1)return He({inputs:{x:s[0]},backend:e});if(s.length>W().get("WEBGL_MAX_TEXTURES_IN_SHADER")){const c=Math.floor(s.length/2),l=$a({inputs:s.slice(0,c),backend:e}),u=$a({inputs:s.slice(c),backend:e});return $a({inputs:[l,u],backend:e})}const r=s.map(c=>c.dtype).reduce((c,l)=>Ve(c,l)),o=s.map(c=>c.shape),a=W().getBool("WEBGL_PACK")?new BB(s[0].shape,o):new PB(s[0].shape,o);return e.runWebGLProgram(a,s,r)}const zB={kernelName:Ku,backendName:"webgl",kernelFunc:$a};function VB(n){const{inputs:t,backend:e,attrs:s}=n,{x:r}=t,{axis:o,keepDims:i}=s,a=r.shape.length,c=wt(o,r.shape);let l=c;const u=Kt(l,a);let h=r;u!=null&&(h=Re({inputs:{x:r},backend:e,attrs:{perm:u}}),l=Qt(l.length,a)),we("all",l,a);const[d,p]=fe(h.shape,l),f=q(p),m=et({inputs:{x:h},backend:e,attrs:{shape:[-1,f]}}),g=cr(m,m.dtype,"all",e);let x;if(i){const b=Jt(d,c);x=et({inputs:{x:g},backend:e,attrs:{shape:b}})}else x=et({inputs:{x:g},backend:e,attrs:{shape:d}});return e.disposeIntermediateTensorInfo(m),e.disposeIntermediateTensorInfo(g),u!=null&&e.disposeIntermediateTensorInfo(h),x}const WB={kernelName:ju,backendName:"webgl",kernelFunc:VB};function UB(n){const{inputs:t,backend:e,attrs:s}=n,{x:r}=t,{axis:o,keepDims:i}=s,a=r.shape.length,c=wt(o,r.shape);let l=c;const u=Kt(l,a);let h=r;u!=null&&(h=Re({inputs:{x:r},backend:e,attrs:{perm:u}}),l=Qt(l.length,a)),we("any",l,a);const[d,p]=fe(h.shape,l),f=q(p),m=et({inputs:{x:h},backend:e,attrs:{shape:[-1,f]}}),g=cr(m,m.dtype,"any",e);let x;if(i){const b=Jt(d,c);x=et({inputs:{x:g},backend:e,attrs:{shape:b}})}else x=et({inputs:{x:g},backend:e,attrs:{shape:d}});return e.disposeIntermediateTensorInfo(m),e.disposeIntermediateTensorInfo(g),u!=null&&e.disposeIntermediateTensorInfo(h),x}const GB={kernelName:Xu,backendName:"webgl",kernelFunc:UB};class HB{constructor(t,e,s){this.variableNames=["A"];const{windowSize:r,batchSize:o,outSize:i}=t;s||this.variableNames.push("bestIndicesA"),this.outputShape=[o,i];const a=e==="max"?">":"<",c=s?"inOffset + i;":"round(getBestIndicesA(batch, inOffset + i));";this.userCode=`
      void main() {
        ivec2 coords = getOutputCoords();
        int batch = coords[0];
        int outIdx = coords[1];
        int inOffset = outIdx * ${r};

        int bestIndex = inOffset;
        float bestValue = getA(batch, bestIndex);

        for (int i = 0; i < ${r}; i++) {
          int inIdx = ${c};
          float candidate = getA(batch, inIdx);
          if (candidate ${a} bestValue) {
            bestValue = candidate;
            bestIndex = inIdx;
          }
        }
        setOutput(float(bestIndex));
      }
    `}}class qB{constructor(t,e,s,r){this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!0,S(t.length>2,()=>`Packed arg${s.charAt(0).toUpperCase()+s.slice(1)} supports only inputs with rank above 2.`);const o=t[t.length-1],i=Math.ceil(o/e);this.outputShape=t.slice(0,-1),i>1&&this.outputShape.push(i),r||this.variableNames.push("bestIndicesA");const a=this.outputShape,c=a.length,l=Bt(c),u=Te("coords",c);let h,d;if(i===1){d=c+1;const T=Bt(d);h=`
        ${T} sourceLocR = ${T}(${u.join()}, 0);
        ++${u[c-1]};
        ${T} sourceLocG = ${T}(${u.join()}, 0);
        ++${u[c-2]};
        ${T} sourceLocA = ${T}(${u.join()}, 0);
        --${u[c-1]};
        ${T} sourceLocB = ${T}(${u.join()}, 0);
        --${u[c-2]};`}else d=c,h=`
        ${l} sourceLocR = coords;
        ++${u[c-1]};
        ${l} sourceLocG = coords;
        ++${u[c-2]};
        ${l} sourceLocA = coords;
        --${u[c-1]};
        ${l} sourceLocB = coords;
        --${u[c-2]};`;const p=["x","y","z","w","u","v"].slice(0,d),f="."+p[d-1],m=p.map(T=>"int "+T),g=Te("sourceLocR",d-1).concat("inIdx.r"),x=Te("sourceLocG",d-1).concat("inIdx.g"),b=Te("sourceLocB",d-1).concat("inIdx.b"),w=Te("sourceLocA",d-1).concat("inIdx.a"),y=s==="max"?"greaterThan":"lessThan",I=r?"":`
          inIdx = round(vec4(getBestIndicesAChannel(${g.join()}),
                             getBestIndicesAChannel(${x.join()}),
                             getBestIndicesAChannel(${b.join()}),
                             getBestIndicesAChannel(${w.join()})));`,C=`vec4(
            getAChannel(${g.join()}),
            hasNextCol ? getAChannel(${x.join()}) : 0.,
            hasNextRow ? getAChannel(${b.join()}) : 0.,
            hasNextRow && hasNextCol ? getAChannel(${w.join()}) : 0.)`,N=r?"":`
      float getBestIndicesAChannel(${m.join()}) {
        return getChannel(getBestIndicesA(${p.join()}),
                                          vec2(${p.slice(-2).join()}));
      }`;this.userCode=`
      float getAChannel(${m.join()}) {
        return getChannel(getA(${p.join()}),
                               vec2(${p.slice(-2).join()}));
      }
      ${N}
      void main() {
        ${l} coords = getOutputCoords();
        bool hasNextCol = ${u[c-1]} < ${a[c-1]-1};
        bool hasNextRow = ${u[c-2]} < ${a[c-2]-1};
        ${h}
        ivec4 srcIdx = ivec4(sourceLocR${f}, sourceLocG${f},
          sourceLocB${f}, sourceLocA${f}) * ${e};
        ivec4 inIdx = srcIdx;
        vec4 bestIndex = vec4(inIdx);
        vec4 bestValue = ${C};

        for (int i = 0; i < ${e}; i++) {
          inIdx = srcIdx;
          ${I}
          vec4 candidate = ${C};
          bvec4 nan = isnan(candidate);
          bvec4 replace = bvec4(
            vec4(${y}(candidate, bestValue)) * (vec4(1.0) - vec4(nan)));

          bestValue = vec4(replace.x  ? candidate.x : bestValue.x,
                           replace.y  ? candidate.y : bestValue.y,
                           replace.z  ? candidate.z : bestValue.z,
                           replace.w  ? candidate.w : bestValue.w);
          bestIndex = mix(bestIndex, vec4(inIdx), vec4(replace));
          srcIdx++;
        }
        setOutput(bestIndex);
      }
    `}}function Ty(n,t,e,s=null){let r=t.shape[0],o=t.shape[1];s!=null&&(r=s.shape[0],o=s.shape[1]);const i=dl(o),a={windowSize:i,inSize:o,batchSize:r,outSize:Math.ceil(o/i)},c=new HB(a,e,s==null),l=[t];s!=null&&l.push(s);const u=n.runWebGLProgram(c,l,"int32");if(u.shape[1]===1)return u;const h=Ty(n,t,e,u);return n.disposeIntermediateTensorInfo(u),h}function Ey(n,t,e,s=null){const r=s!=null?s.shape:t.shape,o=r[r.length-1],i=dl(o),a=new qB(r,i,e,s==null),c=s==null?[t]:[t,s],l=n.runWebGLProgram(a,c,"int32");if(l.shape.length===t.shape.length){const u=Ey(n,t,e,l);return n.disposeIntermediateTensorInfo(l),u}return l}function Ry(n,t,e,s){const r=[e];if(we("arg"+s.charAt(0).toUpperCase()+s.slice(1),r,t.shape.length),!W().getBool("WEBGL_PACK_REDUCE")||t.shape.length<=2){const o=[],i=n.texData.get(t.dataId),a=i!==null&&i.isPacked;let c=t;a&&(c=n.unpackTensor(t),o.push(c));const[l,u]=fe(c.shape,r),h=q(u),d=et({inputs:{x:c},backend:n,attrs:{shape:[-1,h]}});o.push(d);const p=Ty(n,d,s);o.push(p);const f=et({inputs:{x:p},backend:n,attrs:{shape:l}});return o.forEach(m=>n.disposeIntermediateTensorInfo(m)),f}return Ey(n,t,s)}function KB(n){const{inputs:t,backend:e,attrs:s}=n,{x:r}=t,{axis:o}=s;let i=wt(o,r.shape);const a=Kt(i,r.shape.length);let c=r;const l=[];a!=null&&(c=Re({inputs:{x:r},backend:e,attrs:{perm:a}}),l.push(c),i=Qt(i.length,c.shape.length)),we("argMax",[i[0]],c.shape.length);const u=Ry(e,c,i[0],"max");return l.forEach(h=>e.disposeIntermediateTensorInfo(h)),u}const jB={kernelName:ec,backendName:"webgl",kernelFunc:KB};function XB(n){const{inputs:t,backend:e,attrs:s}=n,{x:r}=t,{axis:o}=s;let i=wt(o,r.shape);const a=Kt(i,r.shape.length);let c=r;const l=[];a!=null&&(c=Re({inputs:{x:r},backend:e,attrs:{perm:a}}),l.push(c),i=Qt(i.length,c.shape.length)),we("argMin",[i[0]],c.shape.length);const u=Ry(e,c,i[0],"min");return l.forEach(h=>e.disposeIntermediateTensorInfo(h)),u}const YB={kernelName:nc,backendName:"webgl",kernelFunc:XB};const ZB=fn+`
  if (abs(x) > 1.) {
    return NAN;
  }
  return asin(x);
`,JB=St({opSnippet:ZB}),QB={kernelName:Fo,backendName:"webgl",kernelFunc:JB};const tz=fn+"return log(x + sqrt(x * x + 1.0));",ez=St({opSnippet:tz}),nz={kernelName:Oo,backendName:"webgl",kernelFunc:ez};const sz=fn+`
  return atan(x);
`,rz=St({opSnippet:sz}),oz={kernelName:_o,backendName:"webgl",kernelFunc:rz};const iz=Ap+`
  return atan(a, b);
`,az=`
  vec4 result = atan(a, b);
  bvec4 isNaNA = isnan(a);
  bvec4 isNaNB = isnan(b);
  bvec4 isNaN = bvec4(isNaNA.x || isNaNB.x, isNaNA.y || isNaNB.y, isNaNA.z || isNaNB.z, isNaNA.w || isNaNB.w);
  `+ji+`
  return result;
`,cz=Ie({opSnippet:iz,packedOpSnippet:az}),lz={kernelName:Lo,backendName:"webgl",kernelFunc:cz};const uz=fn+`
  if ((x < -1.0) || (x > 1.0)) return NAN;
return (log(1.0 + x) - log(1.0 - x)) / 2.0;`,hz=St({opSnippet:uz}),dz={kernelName:Mo,backendName:"webgl",kernelFunc:hz};class No{constructor(t,e,s,r=!1,o=!1){if(this.variableNames=["x"],e==="avg"&&s)throw new Error("Cannot compute positions for average pool.");const i=t.filterWidth,a=t.strideHeight,c=t.strideWidth,l=t.dilationHeight,u=t.dilationWidth,h=t.effectiveFilterHeight,d=t.effectiveFilterWidth,p=t.padInfo.top,f=t.padInfo.left;this.outputShape=t.outShape;const m=e==="avg",g=`((batch  * ${t.inHeight} + xR) * ${t.inWidth} + xC) * ${t.inChannels} + d`,x=`(xR * ${t.inWidth} + xC) * ${t.inChannels} + d`;let b="0.0";if(m||(b="-1.0 / 1e-20"),s){const T=">=";this.userCode=`
        const ivec2 strides = ivec2(${a}, ${c});
        const ivec2 pads = ivec2(${p}, ${f});

        void main() {
          ivec4 coords = getOutputCoords();
          int batch = coords[0];
          int d = coords[3];

          ivec2 xRCCorner = coords.yz * strides - pads;
          int xRCorner = xRCCorner.x;
          int xCCorner = xRCCorner.y;

          // max/min x(?, ?, d) to get y(yR, yC, d).
          // ? = to be determined
          float minMaxValue = 0.0;
          float minMaxValueFound = 0.0;
          int minMaxPosition = 0;
          float avgValue = 0.0;

          for (int wR = 0; wR < ${h};
              wR += ${l}) {
            int xR = xRCorner + wR;

            if (xR < 0 || xR >= ${t.inHeight}) {
              continue;
            }

            for (int wC = 0; wC < ${d};
                wC += ${u}) {
              int xC = xCCorner + wC;

              if (xC < 0 || xC >= ${t.inWidth}) {
                continue;
              }

              float value = getX(batch, xR, xC, d);

              // If a min / max value has already been found, use it. If not,
              // use the current value.
              float currMinMaxValue = mix(
                  value, minMaxValue, minMaxValueFound);
              if (value ${T} currMinMaxValue) {
                minMaxValue = value;
                minMaxValueFound = 1.0;
                minMaxPosition = ${r?o?g:x:`wR * ${d} + wC`};
              }
            }
          }
          setOutput(float(minMaxPosition));
        }
      `;return}const w="max";let y=`${e}(${e}(${e}(minMaxValue[0], minMaxValue[1]), minMaxValue[2]), minMaxValue[3])`;e==="avg"&&(y="avgValue / count");const I=Math.floor(i/4)*4,C=i%4,N=`
      if (${m}) {
        avgValue += dot(values, ones);
      } else {
        minMaxValue = ${w}(values, minMaxValue);
      }
    `;this.userCode=`
      const ivec2 strides = ivec2(${a}, ${c});
      const ivec2 pads = ivec2(${p}, ${f});
      const float initializationValue = ${b};
      const vec4 ones = vec4(1.0, 1.0, 1.0, 1.0);

      float count = 0.0;

      float getValue(int batch, int xR, int xC, int d) {
        if (xC < 0 || xC >= ${t.inWidth}) {
          return initializationValue;
        }
        count += 1.0;
        return getX(batch, xR, xC, d);
      }

      void main() {
        ivec4 coords = getOutputCoords();
        int batch = coords[0];
        int d = coords[3];

        ivec2 xRCCorner = coords.yz * strides - pads;
        int xRCorner = xRCCorner.x;
        int xCCorner = xRCCorner.y;

        // max/min x(?, ?, d) to get y(yR, yC, d).
        // ? = to be determined
        vec4 minMaxValue = vec4(${b});
        float avgValue = 0.0;
        count = 0.0;

        for (int wR = 0; wR < ${h};
            wR += ${l}) {
          int xR = xRCorner + wR;

          if (xR < 0 || xR >= ${t.inHeight}) {
            continue;
          }

          for (int wC = 0; wC < ${I}; wC += 4) {
            int xC = xCCorner + wC * ${u};

            vec4 values = vec4(
              getValue(batch, xR, xC, d),
              getValue(batch, xR, xC + ${u}, d),
              getValue(batch, xR, xC + 2 * ${u}, d),
              getValue(batch, xR, xC + 3 * ${u}, d)
            );

            ${N}
          }

          int xC = xCCorner + ${I};
          if (${C===1}) {
            vec4 values = vec4(
              getValue(batch, xR, xC, d),
              initializationValue,
              initializationValue,
              initializationValue
            );

            ${N}
          } else if (${C===2}) {
            vec4 values = vec4(
              getValue(batch, xR, xC, d),
              getValue(batch, xR, xC + ${u}, d),
              initializationValue,
              initializationValue
            );

            ${N}
          } else if (${C===3}) {
            vec4 values = vec4(
              getValue(batch, xR, xC, d),
              getValue(batch, xR, xC + ${u}, d),
              getValue(batch, xR, xC + 2 * ${u}, d),
              initializationValue
            );

            ${N}
          }
        }
        setOutput(${y});
      }
    `}}class Op{constructor(t,e,s,r=!1,o=!1){if(this.variableNames=["x"],e==="avg"&&s)throw new Error("Cannot compute positions for average pool.");const i=t.filterWidth,a=t.strideDepth,c=t.strideHeight,l=t.strideWidth,u=t.dilationDepth,h=t.dilationHeight,d=t.dilationWidth,p=t.effectiveFilterDepth,f=t.effectiveFilterHeight,m=t.effectiveFilterWidth,g=t.padInfo.front,x=t.padInfo.top,b=t.padInfo.left;this.outputShape=t.outShape;const w=e==="avg";let y="0.0";if(w||(y="-1.0 / 1e-20"),s){const k=">=";this.userCode=`
        const ivec3 strides =
            ivec3(${a}, ${c}, ${l});
        const ivec3 pads = ivec3(${g}, ${x}, ${b});

        void main() {
          ivec5 coords = getOutputCoords();
          int batch = coords.x;
          int ch = coords.u;

          ivec3 xCorner = ivec3(coords.y, coords.z, coords.w) * strides - pads;
          int xDCorner = xCorner.x;
          int xRCorner = xCorner.y;
          int xCCorner = xCorner.z;

          // max/min x(?, ?, ?, ch) to get y(yD, yR, yC, ch).
          // ? = to be determined
          float minMaxValue = 0.0;
          float minMaxValueFound = 0.0;
          int minMaxPosition = 0;

          for (int wD = 0; wD < ${p};
              wD += ${u}) {
            int xD = xDCorner + wD;

            if (xD < 0 || xD >= ${t.inDepth}) {
              continue;
            }

            for (int wR = 0; wR < ${f};
                wR += ${h}) {
              int xR = xRCorner + wR;

              if (xR < 0 || xR >= ${t.inHeight}) {
                continue;
              }

              for (int wC = 0; wC < ${m};
                  wC += ${d}) {
                int xC = xCCorner + wC;

                if (xC < 0 || xC >= ${t.inWidth}) {
                  continue;
                }

                float value = getX(batch, xD, xR, xC, ch);

                // If a min / max value has already been found, use it. If not,
                // use the current value.
                float currMinMaxValue = mix(
                    value, minMaxValue, minMaxValueFound);
                if (value ${k} currMinMaxValue) {
                  minMaxValue = value;
                  minMaxValueFound = 1.0;
                  minMaxPosition = ${r?o?`(((batch * ${t.inDepth} + xD) * ${t.inHeight} + xR) * ${t.inWidth} + xC) * ${t.inChannels} + ch`:`((xD * ${t.inHeight} + xR) * ${t.inWidth} + xC) * ${t.inChannels} + ch`:`wD * ${f} * ${m} +
                      wR * ${m} + wC`};
                }
              }
            }
          }
          setOutput(float(minMaxPosition));
        }
      `;return}const I="max";let C=`${e}(${e}(${e}(minMaxValue[0], minMaxValue[1]), minMaxValue[2]), minMaxValue[3])`;e==="avg"&&(C="avgValue / count");const N=Math.floor(i/4)*4,T=i%4,$=`
      if (${w}) {
        avgValue += dot(values, ones);
      } else {
        minMaxValue = ${I}(values, minMaxValue);
      }
    `;this.userCode=`
      const ivec3 strides =
        ivec3(${a}, ${c}, ${l});
      const ivec3 pads = ivec3(${g}, ${x}, ${b});
      const float initializationValue = ${y};
      const vec4 ones = vec4(1.0, 1.0, 1.0, 1.0);

      float count = 0.0;

      float getValue(int batch, int xD, int xR, int xC, int ch) {
        if (xC < 0 || xC >= ${t.inWidth}) {
          return initializationValue;
        }
        count += 1.0;
        return getX(batch, xD, xR, xC, ch);
      }

      void main() {
        ivec5 coords = getOutputCoords();
        int batch = coords.x;
        int ch = coords.u;

        ivec3 xCorner = ivec3(coords.y, coords.z, coords.w) * strides - pads;
        int xDCorner = xCorner.x;
        int xRCorner = xCorner.y;
        int xCCorner = xCorner.z;

        // max/min x(?, ?, ?, d) to get y(yD, yR, yC, ch).
        // ? = to be determined
        vec4 minMaxValue = vec4(${y});
        float avgValue = 0.0;
        count = 0.0;

        for (int wD = 0; wD < ${p};
            wD += ${u}) {
          int xD = xDCorner + wD;

          if (xD < 0 || xD >= ${t.inDepth}) {
            continue;
          }

          for (int wR = 0; wR < ${f};
            wR += ${h}) {
            int xR = xRCorner + wR;

            if (xR < 0 || xR >= ${t.inHeight}) {
              continue;
            }

            for (int wC = 0; wC < ${N}; wC += 4) {
              int xC = xCCorner + wC * ${d};

              vec4 values = vec4(
                getValue(batch, xD, xR, xC, ch),
                getValue(batch, xD, xR, xC + ${d}, ch),
                getValue(batch, xD, xR, xC + 2 * ${d}, ch),
                getValue(batch, xD, xR, xC + 3 * ${d}, ch)
              );

              ${$}
            }

            int xC = xCCorner + ${N};
            if (${T===1}) {
              vec4 values = vec4(
                getValue(batch, xD, xR, xC, ch),
                initializationValue,
                initializationValue,
                initializationValue
              );

              ${$}
            } else if (${T===2}) {
              vec4 values = vec4(
                getValue(batch, xD, xR, xC, ch),
                getValue(batch, xD, xR, xC + ${d}, ch),
                initializationValue,
                initializationValue
              );

              ${$}
            } else if (${T===3}) {
              vec4 values = vec4(
                getValue(batch, xD, xR, xC, ch),
                getValue(batch, xD, xR, xC + ${d}, ch),
                getValue(batch, xD, xR, xC + 2 * ${d}, ch),
                initializationValue
              );

              ${$}
            }
          }
          setOutput(${C});
        }
      }
    `}}function pz(n){const{inputs:t,backend:e,attrs:s}=n,{x:r}=t;qi(r,"avgPool");const{filterSize:o,strides:i,pad:a,dimRoundingMode:c}=s,l=1;S($e(i,l),()=>`Error in avgPool: Either strides or dilations must be 1. Got strides ${i} and dilations '${l}'`);const u=hn(r.shape,o,i,l,a,c);if(u.filterWidth===1&&u.filterHeight===1&&Tt(u.inShape,u.outShape))return He({inputs:{x:r},backend:e});const h=new No(u,"avg",!1);return e.runWebGLProgram(h,[r],"float32")}const fz={kernelName:sc,backendName:"webgl",kernelFunc:pz};function mz(n){const{inputs:t,backend:e,attrs:s}=n,{x:r}=t,{filterSize:o,strides:i,pad:a,dimRoundingMode:c,dataFormat:l}=s,u=[1,1,1],h=jn(r.shape,o,i,u,a,c,l),d=new Op(h,"avg",!1);return e.runWebGLProgram(d,[r],"float32")}const gz={kernelName:rc,backendName:"webgl",kernelFunc:mz};class xz{constructor(t){this.variableNames=["dy"],this.outputShape=t.inShape;const e=t.filterHeight,s=t.filterWidth,r=t.strideHeight,o=t.strideWidth,i=t.dilationHeight,a=t.dilationWidth,c=t.effectiveFilterHeight,l=t.effectiveFilterWidth,u=c-1-t.padInfo.top,h=l-1-t.padInfo.left,d=1/(e*s);this.userCode=`
      const ivec2 pads = ivec2(${u}, ${h});
      const float avgMultiplier = float(${d});

      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int d = coords[3];

        ivec2 dyRCCorner = coords.yz - pads;
        int dyRCorner = dyRCCorner.x;
        int dyCCorner = dyRCCorner.y;

        // Convolve dy(?, ?, d) with pos mask(:, :, d) to get dx(xR, xC, d).
        // ? = to be determined. : = across all values in that axis.
        float dotProd = 0.0;
        for (int wR = 0; wR < ${c};
            wR += ${i}) {
          float dyR = float(dyRCorner + wR) / ${r}.0;

          if (dyR < 0.0 || dyR >= ${t.outHeight}.0 || fract(dyR) > 0.0) {
            continue;
          }
          int idyR = int(dyR);

          for (int wC = 0; wC < ${l};
            wC+= ${a}) {
            float dyC = float(dyCCorner + wC) / ${o}.0;

            if (dyC < 0.0 || dyC >= ${t.outWidth}.0 ||
                fract(dyC) > 0.0) {
              continue;
            }
            int idyC = int(dyC);

            float dyValue = getDy(b, idyR, idyC, d);

            dotProd += dyValue * avgMultiplier;
          }
        }
        setOutput(dotProd);
      }
    `}}class bz{constructor(t){this.variableNames=["dy"],this.outputShape=t.inShape;const e=t.filterDepth,s=t.filterHeight,r=t.filterWidth,o=t.strideDepth,i=t.strideHeight,a=t.strideWidth,c=t.dilationDepth,l=t.dilationHeight,u=t.dilationWidth,h=t.effectiveFilterDepth,d=t.effectiveFilterHeight,p=t.effectiveFilterWidth,f=h-1-t.padInfo.front,m=d-1-t.padInfo.top,g=p-1-t.padInfo.left,x=1/(e*s*r);this.userCode=`
      const ivec3 pads = ivec3(${f}, ${m}, ${g});
      const float avgMultiplier = float(${x});

      void main() {
        ivec5 coords = getOutputCoords();
        int batch = coords.x;
        int ch = coords.u;

        ivec3 dyCorner = ivec3(coords.y, coords.z, coords.w) - pads;
        int dyDCorner = dyCorner.x;
        int dyRCorner = dyCorner.y;
        int dyCCorner = dyCorner.z;

        // Convolve dy(?, ?, ?, d) with pos mask(:, :, :, ch) to get
        // dx(xD, xR, xC, ch).
        // ? = to be determined. : = across all values in that axis.
        float dotProd = 0.0;

        for (int wD = 0; wD < ${h};
            wD += ${c}) {
          float dyD = float(dyDCorner + wD) / ${o}.0;

          if (dyD < 0.0 || dyD >= ${t.outDepth}.0 || fract(dyD) > 0.0) {
            continue;
          }
          int idyD = int(dyD);

          for (int wR = 0; wR < ${d};
              wR += ${l}) {
            float dyR = float(dyRCorner + wR) / ${i}.0;

            if (dyR < 0.0 || dyR >= ${t.outHeight}.0 ||
                fract(dyR) > 0.0) {
              continue;
            }
            int idyR = int(dyR);

            for (int wC = 0; wC < ${p};
                wC += ${u}) {
              float dyC = float(dyCCorner + wC) / ${a}.0;

              if (dyC < 0.0 || dyC >= ${t.outWidth}.0 ||
                  fract(dyC) > 0.0) {
                continue;
              }
              int idyC = int(dyC);

              float dyValue = getDy(batch, idyD, idyR, idyC, ch);

              dotProd += dyValue * avgMultiplier;
            }
          }
        }
        setOutput(dotProd);
      }
    `}}function yz(n){const{inputs:t,backend:e,attrs:s}=n,{dy:r,input:o}=t,i=o,{filterSize:a,strides:c,pad:l,dimRoundingMode:u}=s,h=[1,1,1],d=jn(i.shape,a,c,h,l,u),p=new bz(d);return e.runWebGLProgram(p,[r],i.dtype)}const wz={kernelName:Zu,backendName:"webgl",kernelFunc:yz};function Iz(n){const{inputs:t,backend:e,attrs:s}=n,{dy:r,input:o}=t,i=o;qi([r,o],"avgPoolGrad");const{filterSize:a,strides:c,pad:l}=s,u=hn(i.shape,a,c,1,l),h=new xz(u);return e.runWebGLProgram(h,[r],i.dtype)}const vz={kernelName:Yu,backendName:"webgl",kernelFunc:Iz};function Cz(n){const{inputs:t,backend:e,attrs:s}=n,{a:r,b:o}=t,{transposeA:i,transposeB:a}=s;return Za({a:r,b:o,transposeA:i,transposeB:a,backend:e})}const kz={kernelName:oc,backendName:"webgl",kernelFunc:Cz};class $z{constructor(t,e,s,r,o,i){this.outputShape=[],this.variableNames=["x","mean","variance"],mt(t,e),mt(t,s);let a="0.0";r!=null&&(mt(t,r),this.variableNames.push("offset"),a="getOffsetAtOutCoords()");let c="1.0";o!=null&&(mt(t,o),this.variableNames.push("scale"),c="getScaleAtOutCoords()"),this.outputShape=t,this.userCode=`
      void main() {
        float x = getXAtOutCoords();
        float mean = getMeanAtOutCoords();
        float variance = getVarianceAtOutCoords();
        float offset = ${a};
        float scale = ${c};
        float inv = scale * inversesqrt(variance + float(${i}));
        setOutput(dot(vec3(x, -mean, offset), vec3(inv, inv, 1)));
      }
    `}}class Sz{constructor(t,e,s,r,o,i){this.packedInputs=!0,this.packedOutput=!0,this.variableNames=["x","mean","variance"],mt(t,e),mt(t,s);let a="vec4(0.0)";r!=null&&(mt(t,r),this.variableNames.push("offset"),a="getOffsetAtOutCoords()");let c="vec4(1.0)";o!=null&&(mt(t,o),this.variableNames.push("scale"),c="getScaleAtOutCoords()"),this.outputShape=t,this.userCode=`
      void main() {
        vec4 offset = ${a};
        vec4 scale = ${c};

        vec4 x = getXAtOutCoords();
        vec4 mean = getMeanAtOutCoords();
        vec4 variance = getVarianceAtOutCoords();

        vec4 inv = scale * inversesqrt(variance + vec4(${i}));

        setOutput((x - mean) * inv + offset);
      }
    `}}const Nz=({inputs:n,backend:t,attrs:e})=>{const{x:s,mean:r,variance:o,offset:i,scale:a}=n;S(r.shape.length===o.shape.length,()=>"Batch normalization gradient requires mean and variance to have equal ranks."),S(i==null||r.shape.length===i.shape.length,()=>"Batch normalization gradient requires mean and offset to have equal ranks."),S(a==null||r.shape.length===a.shape.length,()=>"Batch normalization gradient requires mean and scale to have equal ranks.");let{varianceEpsilon:c}=e;c==null&&(c=.001);const l=[s,r,o];let u=null;i!=null&&(u=i.shape,l.push(i));let h=null;a!=null&&(h=a.shape,l.push(a));const d=W().getBool("WEBGL_PACK_NORMALIZATION")?new Sz(s.shape,r.shape,o.shape,u,h,c):new $z(s.shape,r.shape,o.shape,u,h,c);return t.runWebGLProgram(d,l,l[0].dtype)},Tz={kernelName:xc,backendName:"webgl",kernelFunc:Nz};class Ez{constructor(t){this.variableNames=["source"],this.outputShape=t,this.rank=t.length;const e=Bt(this.rank);this.customUniforms=[{name:"start",arrayIndex:this.rank,type:"int"}];const s=Rz(this.rank);let r;const o=t.map((i,a)=>`sourceLoc.${Bu[a]} = start[${a}] + coords.${Bu[a]};`);r=`
        ${e} sourceLoc;
        ${e} coords = getOutputCoords();
        ${o.join(`
`)}
      `,this.userCode=`
      void main() {
        ${r}
        setOutput(getSource(${s}));
      }
    `}}const Bu=["x","y","z","w","u","v"];function Rz(n){if(n===1)return"sourceLoc";if(n<=6)return Bu.slice(0,n).map(t=>"sourceLoc."+t).join(",");throw Error(`Slicing for rank ${n} is not yet supported`)}class Dz{constructor(t){this.variableNames=["source"],this.packedInputs=!0,this.packedOutput=!0,this.outputShape=t,this.rank=t.length,this.customUniforms=[{name:"start",arrayIndex:this.rank,type:"int"}];const e=Bt(this.rank),s=Te("coords",this.rank),r=Te("sourceLoc",this.rank),o=this.rank===1?"sourceLoc":`vec2(${r.slice(-2).join()})`,i=`getChannel(getSource(${r.join()}), ${o})`,a=`
      result.x = ${i};
      if (++${s[this.rank-1]} < ${t[this.rank-1]}) {
        ++${r[this.rank-1]};
        result.y = ${i};
        --${r[this.rank-1]};
      }
    `,c=this.rank===1?"":`
      --${s[this.rank-1]};
      if (++${s[this.rank-2]} < ${t[this.rank-2]}) {
        ++${r[this.rank-2]};
        result.z = ${i};
        if (++${s[this.rank-1]} < ${t[this.rank-1]}) {
          ++${r[this.rank-1]};
          result.w = ${i};
        }
      }
    `,l=this.rank<=4?`sourceLoc = coords +
            ${e}(${t.map((u,h)=>`start[${h}]`).join()});`:t.map((u,h)=>`${r[h]} = ${s[h]} + start[${h}];`).join(`
`);this.userCode=`
      void main() {
        ${e} coords = getOutputCoords();
        ${e} sourceLoc;
        ${l}
        vec4 result = vec4(0.);
        ${a}
        ${c}
        setOutput(result);
      }
    `}}function Az(n,t,e,s){const r=s.texData.get(n.dataId),o=s.makeTensorInfo(e,n.dtype),i=s.texData.get(o.dataId);Object.assign(i,r),i.refCount=1,i.shape=e,i.dtype=n.dtype;let a=Gh(t,ht(n.shape));r.slice&&(a+=r.slice.flatOffset),i.slice={flatOffset:a,origDataId:r.slice&&r.slice.origDataId||n.dataId};const c=s.dataRefCount.get(i.slice.origDataId)||1;return s.dataRefCount.set(i.slice.origDataId,c+1),o}function Jr(n){const{inputs:t,backend:e,attrs:s}=n,{x:r}=t,{begin:o,size:i}=s,[a,c]=sl(r,o,i);if(Vh(r,a,c),q(c)===0)return e.makeTensorInfo(c,r.dtype,[]);if(e.shouldExecuteOnCPU([r])||r.dtype==="string"){const h=e.texData.get(r.dataId),d=$3(h.values,a,c,r.shape,r.dtype);return e.makeTensorInfo(c,r.dtype,d)}const{isPacked:l}=e.texData.get(r.dataId),u=Uh(r.shape,a,c);if(l||!u){const h=W().getBool("WEBGL_PACK_ARRAY_OPERATIONS")?new Dz(c):new Ez(c),d=[a];return e.runWebGLProgram(h,[r],r.dtype,d)}return e.uploadToGPU(r.dataId),Az(r,a,c,e)}const Fz={kernelName:qc,backendName:"webgl",kernelFunc:Jr};const Oz=n=>{const{inputs:t,backend:e,attrs:s}=n,{x:r}=t,{blockShape:o,crops:i}=s;S(r.shape.length<=4,()=>"batchToSpaceND for rank > 4 with a WebGL backend not implemented yet");const a=o.reduce((b,w)=>b*w),c=Ai(r.shape,o,a),l=Fi(c.length,o.length),u=Oi(r.shape,o,a),h=Fd(i,o.length),d=Od(u,i,o.length),p=[],f=et({inputs:{x:r},backend:e,attrs:{shape:c}}),m=Re({inputs:{x:f},backend:e,attrs:{perm:l}}),g=et({inputs:{x:m},backend:e,attrs:{shape:u}}),x=Jr({inputs:{x:g},backend:e,attrs:{begin:h,size:d}});return p.push(f),p.push(m),p.push(g),p.forEach(b=>e.disposeIntermediateTensorInfo(b)),x},_z={kernelName:ic,backendName:"webgl",kernelFunc:Oz};function Mz(n){const{inputs:t,backend:e,attrs:s}=n,{x:r,weights:o}=t,{size:i}=s,a=e.readSync(r.dataId),c=e.readSync(o.dataId),l=xy(a,c,o.dtype,o.shape,i);return e.makeTensorInfo([i],o.dtype,l)}const Lz={kernelName:Ju,backendName:"webgl",kernelFunc:Mz};function Pz(n){const{inputs:t,backend:e}=n,{s0:s,s1:r}=t,o=e.readSync(s.dataId),i=e.readSync(r.dataId),a=mt(Array.from(o),Array.from(i));return e.makeTensorInfo([a.length],"int32",Int32Array.from(a))}const Bz={kernelName:jm,backendName:"webgl",kernelFunc:Pz};const zz="return float(a != b);",Dy=Ie({opSnippet:zz,cpuKernelImpl:x3,dtype:"bool"}),Vz={kernelName:Oc,backendName:"webgl",kernelFunc:Dy};function Yi(n){const{inputs:t,backend:e}=n,{input:s}=t,r=e.texData.get(s.dataId);return He({inputs:{x:r.complexTensorInfos.real},backend:e})}const Wz={kernelName:Ih,backendName:"webgl",kernelFunc:Yi};const Uz="return float(int(x));";function Gz(n,t){const e=new Gn(n.shape,Uz),s=t.runWebGLProgram(e,[n],"int32");return{dataId:s.dataId,shape:s.shape,dtype:s.dtype}}function zu(n){const{inputs:t,backend:e,attrs:s}=n,{x:r}=t,{dtype:o}=s;if(o==="complex64"){if(r.dtype==="complex64")return He({inputs:{x:r},backend:e});const i=he(r.shape),a=zu({inputs:{x:r},backend:e,attrs:{dtype:"float32"}}),c=$s({inputs:{real:a,imag:i},backend:e});return i.dispose(),e.disposeIntermediateTensorInfo(a),c}if(r.dtype==="complex64"){const i=Yi({inputs:{input:r},backend:e}),a=zu({inputs:{x:i},backend:e,attrs:{dtype:o}});return e.disposeIntermediateTensorInfo(i),a}if(!Vm(r.dtype,o)){const i=He({inputs:{x:r},backend:e});return{dataId:i.dataId,shape:i.shape,dtype:o}}if(e.shouldExecuteOnCPU([r])){const i=e.texData.get(r.dataId).values,[a,c,l]=ZP(i,r.shape,r.dtype,o);return e.makeTensorInfo(a,c,l)}if(o==="int32")return Gz(r,e);if(o==="bool"){const i=e.makeTensorInfo([],"bool",be("bool",1)),c=Dy({inputs:{a:r,b:i},backend:e});return e.disposeIntermediateTensorInfo(i),c}throw new Error(`Error in Cast: failed to cast ${r.dtype} to ${o}`)}const Hz={kernelName:Po,backendName:"webgl",kernelFunc:zu};const lm="return ceil(x);",qz=St({opSnippet:lm,packedOpSnippet:lm,cpuKernelImpl:JP}),Kz={kernelName:Bo,backendName:"webgl",kernelFunc:qz};class jz{constructor(t){this.variableNames=["A"],this.customUniforms=[{name:"minVal",type:"float"},{name:"maxVal",type:"float"}],this.outputShape=t,this.userCode=`

      void main() {
        float value = getAAtOutCoords();
        if (isnan(value)) {
          setOutput(value);
          return;
        }

        setOutput(clamp(value, minVal, maxVal));
      }
    `}}class Xz{constructor(t){this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!0,this.customUniforms=[{name:"minVal",type:"float"},{name:"maxVal",type:"float"}],this.outputShape=t,this.userCode=`
      void main() {
        vec4 value = getAAtOutCoords();

        if (any(isnan(value))) {
          setOutput(value);
          return;
        }

        setOutput(clamp(value, vec4(minVal), vec4(maxVal)));
      }
    `}}function Yz(n){const{inputs:t,backend:e,attrs:s}=n,{x:r}=t,{clipValueMin:o,clipValueMax:i}=s;let a;W().getBool("WEBGL_PACK_CLIP")?a=new Xz(r.shape):a=new jz(r.shape);const c=[[o],[i]];return e.runWebGLProgram(a,[r],r.dtype,c)}const Zz={kernelName:zo,backendName:"webgl",kernelFunc:Yz};class Jz{constructor(t){this.variableNames=["real","imag"],this.outputShape=t,this.userCode=`
      void main() {
        float re = abs(getRealAtOutCoords());
        float im = abs(getImagAtOutCoords());
        float mx = max(re, im);

        // sadly the length function in glsl is not underflow-safe
        // (at least not on Intel GPUs). So the safe solution is
        // to ensure underflow-safety in all cases.
        setOutput(
          mx == 0.0 ? 0.0 : mx * length(vec2(1, min(re, im)/mx))
        );
      }
    `}}function um(n,t){return{dataId:t.dataId,dtype:t.dtype,shape:n.shape}}function Qz(n){const{inputs:t,backend:e}=n,{x:s}=t,r=e.texData.get(s.dataId),o=new Jz(s.shape),i=[um(s,r.complexTensorInfos.real),um(s,r.complexTensorInfos.imag)];return e.runWebGLProgram(o,i,i[0].dtype)}const tV={kernelName:ac,backendName:"webgl",kernelFunc:Qz};class eV{constructor(t){this.outputShape=[],this.outputShape=Fn(t,1),this.variableNames=t.map((i,a)=>`T${a}`);const e=new Array(t.length-1);e[0]=t[0][1];for(let i=1;i<e.length;i++)e[i]=e[i-1]+t[i][1];const s=[`if (yC < ${e[0]}) setOutput(getT0(yR, yC));`];for(let i=1;i<e.length;i++){const a=e[i-1];s.push(`else if (yC < ${e[i]}) setOutput(getT${i}(yR, yC-${a}));`)}const r=e.length,o=e[e.length-1];s.push(`else setOutput(getT${r}(yR, yC-${o}));`),this.userCode=`
      void main() {
        ivec2 coords = getOutputCoords();
        int yR = coords.x;
        int yC = coords.y;

        ${s.join(`
        `)}
      }
    `}}class nV{constructor(t,e){this.packedInputs=!0,this.packedOutput=!0,this.outputShape=[],this.outputShape=Fn(t,e);const s=this.outputShape,r=s.length,o=Bt(r),i=Te("coords",r),a=["x","y","z","w","u","v"].slice(0,r);this.variableNames=t.map((m,g)=>`T${g}`);const c=new Array(t.length-1);c[0]=t[0][e];for(let m=1;m<c.length;m++)c[m]=c[m-1]+t[m][e];const l=a[e],u=a.slice(-2),h=a.join();let d=`if (${l} < ${c[0]}) {
        return getChannel(
            getT0(${h}), vec2(${u.join()}));
        }`;for(let m=1;m<c.length;m++){const g=c[m-1];d+=`
        if (${l} < ${c[m]}  && ${l} >= ${c[m-1]}) {
          return getChannel(
            getT${m}(${ha(a,l,g)}),
            vec2(${ha(u,l,g)}));
        }`}const p=c.length,f=c[c.length-1];d+=`
        return getChannel(
          getT${p}(${ha(a,l,f)}),
          vec2(${ha(u,l,f)}));`,this.userCode=`
      float getValue(${a.map(m=>"int "+m)}) {
        ${d}
      }

      void main() {
        ${o} coords = getOutputCoords();
        vec4 result = vec4(getValue(${i}), 0., 0., 0.);

        ${i[r-1]} = ${i[r-1]} + 1;
        if (${i[r-1]} < ${s[r-1]}) {
          result.g = getValue(${i});
        }

        ${i[r-2]} = ${i[r-2]} + 1;
        if (${i[r-2]} < ${s[r-2]}) {
          result.a = getValue(${i});
        }

        ${i[r-1]} = ${i[r-1]} - 1;
        if (${i[r-2]} < ${s[r-2]} &&
            ${i[r-1]} < ${s[r-1]}) {
          result.b = getValue(${i});
        }
        setOutput(result);
      }
    `}}function ha(n,t,e){const s=n.indexOf(t);return n.map((o,i)=>i===s?`${o} - ${e}`:o).join()}function Dl(n){const{inputs:t,backend:e}=n,{input:s}=t,r=e.texData.get(s.dataId);return He({inputs:{x:r.complexTensorInfos.imag},backend:e})}const sV={kernelName:ph,backendName:"webgl",kernelFunc:Dl};function go(n,t,e){const s=n[0].dtype;if(s==="complex64"){const h=n.map(g=>Yi({inputs:{input:g},backend:e})),d=n.map(g=>Dl({inputs:{input:g},backend:e})),p=go(h,t,e),f=go(d,t,e),m=$s({inputs:{real:p,imag:f},backend:e});return h.forEach(g=>e.disposeIntermediateTensorInfo(g)),d.forEach(g=>e.disposeIntermediateTensorInfo(g)),e.disposeIntermediateTensorInfo(p),e.disposeIntermediateTensorInfo(f),m}let r=e.shouldExecuteOnCPU(n);if(s==="string"&&(r=!0),r){const h=n.map(b=>{const y=[-1,q(b.shape.slice(t))];return et({inputs:{x:b},backend:e,attrs:{shape:y}})}),d=h.map(b=>({vals:e.readSync(b.dataId),shape:b.shape})),p=Fn(h.map(b=>b.shape),1),f=h[0].shape[0]===1,m=QP(d,p,s,f),g=Fn(n.map(b=>b.shape),t),x=e.makeTensorInfo(g,s,m);return h.forEach(b=>e.disposeIntermediateTensorInfo(b)),x}const o=W().getNumber("WEBGL_MAX_TEXTURES_IN_SHADER");if(n.length>o){const h=[];for(let p=0;p<n.length;p+=o){const f=n.slice(p,p+o);h.push(go(f,t,e))}const d=go(h,t,e);for(const p of h)e.disposeIntermediateTensorInfo(p);return d}if(W().getBool("WEBGL_PACK_ARRAY_OPERATIONS")&&n[0].shape.length>1){const h=new nV(n.map(d=>d.shape),t);return e.runWebGLProgram(h,n,s)}const{tensors2D:i,outShape:a}=rV(n,t,e),c=new eV(i.map(h=>h.shape)),l=e.runWebGLProgram(c,i,s);i.forEach(h=>e.disposeIntermediateTensorInfo(h));const u=et({inputs:{x:l},attrs:{shape:a},backend:e});return e.disposeIntermediateTensorInfo(l),u}function rV(n,t,e){const s=Fn(n.map(o=>o.shape),t);return{tensors2D:n.map(o=>et({inputs:{x:o},attrs:{shape:[-1,q(o.shape.slice(t))]},backend:e})),outShape:s}}function Ay(n){const{inputs:t,backend:e,attrs:s}=n,{axis:r}=s,o=wt(r,t[0].shape)[0],i=t.map(l=>l.shape);Rd(i,o);const a=Fn(t.map(l=>l.shape),o);if(q(a)===0)return e.makeTensorInfo(a,t[0].dtype,[]);const c=t.filter(l=>q(l.shape)>0);return c.length===1?He({inputs:{x:c[0]},backend:e}):go(c,o,e)}const oV={kernelName:cc,backendName:"webgl",kernelFunc:Ay};class Fy{constructor(t,e=!1,s=null,r=!1,o=!1){this.variableNames=["x","W"],this.outputShape=t.outShape;const i=t.padInfo.top,a=t.padInfo.left,c=t.strideHeight,l=t.strideWidth,u=t.dilationHeight,h=t.dilationWidth,d=t.filterHeight,p=t.filterWidth,f=Math.floor(t.inChannels/4)*4,m=t.inChannels%4,g=t.dataFormat==="channelsLast",x=g?1:2,b=g?2:3,w=g?3:1;let y="",I="";s&&(r?y=`float activation(float a) {
          float b = getPreluActivationWeightsAtOutCoords();
          ${s}
        }`:o?y=`float activation(float a) {
          float b = getLeakyreluAlphaAtOutCoords();
          ${s}
        }`:y=`
          float activation(float x) {
            ${s}
          }
        `,I="result = activation(result);");const C=e?"result += getBiasAtOutCoords();":"";e&&this.variableNames.push("bias"),r&&this.variableNames.push("preluActivationWeights"),o&&this.variableNames.push("leakyreluAlpha"),this.userCode=`
      ${y}

      const ivec2 strides = ivec2(${c}, ${l});
      const ivec2 pads = ivec2(${i}, ${a});

      void main() {
        ivec4 coords = getOutputCoords();
        int batch = coords[0];
        int d2 = coords[${w}];

        ivec2 xRCCorner =
            ivec2(coords[${x}], coords[${b}]) * strides - pads;
        int xRCorner = xRCCorner.x;
        int xCCorner = xRCCorner.y;

        // Convolve x(?, ?, d1) with w(:, :, d1, d2) to get y(yR, yC, d2).
        // ? = to be determined. : = across all values in that axis.
        float dotProd = 0.0;
        for (int wR = 0; wR < ${d}; wR++) {
          int xR = xRCorner + wR * ${u};

          if (xR < 0 || xR >= ${t.inHeight}) {
            continue;
          }

          for (int wC = 0; wC < ${p}; wC++) {
            int xC = xCCorner + wC * ${h};

            if (xC < 0 || xC >= ${t.inWidth}) {
              continue;
            }

            for (int d1 = 0; d1 < ${f}; d1 += 4) {
              vec4 wValues = vec4(
                getW(wR, wC, d1, d2),
                getW(wR, wC, d1 + 1, d2),
                getW(wR, wC, d1 + 2, d2),
                getW(wR, wC, d1 + 3, d2)
              );

              if (${g}) {
                vec4 xValues = vec4(
                  getX(batch, xR, xC, d1),
                  getX(batch, xR, xC, d1 + 1),
                  getX(batch, xR, xC, d1 + 2),
                  getX(batch, xR, xC, d1 + 3)
                );
                dotProd += dot(xValues, wValues);
              } else {
                vec4 xValues = vec4(
                  getX(batch, d1, xR, xC),
                  getX(batch, d1 + 1, xR, xC),
                  getX(batch, d1 + 2, xR, xC),
                  getX(batch, d1 + 3, xR, xC)
                );
                dotProd += dot(xValues, wValues);
              }
            }

            if (${m===1}) {

              if (${g}) {
                dotProd +=
                    getX(batch, xR, xC, ${f}) *
                    getW(wR, wC, ${f}, d2);
              } else {
                dotProd +=
                    getX(batch, ${f}, xR, xC) *
                    getW(wR, wC, ${f}, d2);
              }

            } else if (${m===2}) {
              vec2 wValues = vec2(
                getW(wR, wC, ${f}, d2),
                getW(wR, wC, ${f} + 1, d2)
              );

              if (${g}) {
                vec2 xValues = vec2(
                  getX(batch, xR, xC, ${f}),
                  getX(batch, xR, xC, ${f} + 1)
                );
                dotProd += dot(xValues, wValues);
              } else {
                vec2 xValues = vec2(
                  getX(batch, ${f}, xR, xC),
                  getX(batch, ${f} + 1, xR, xC)
                );
                dotProd += dot(xValues, wValues);
              }

            } else if (${m===3}) {
              vec3 wValues = vec3(
                getW(wR, wC, ${f}, d2),
                getW(wR, wC, ${f} + 1, d2),
                getW(wR, wC, ${f} + 2, d2)
              );

              if (${g}) {
                vec3 xValues = vec3(
                  getX(batch, xR, xC, ${f}),
                  getX(batch, xR, xC, ${f} + 1),
                  getX(batch, xR, xC, ${f} + 2)
                );
                dotProd += dot(xValues, wValues);
              } else {
                vec3 xValues = vec3(
                  getX(batch, ${f}, xR, xC),
                  getX(batch, ${f} + 1, xR, xC),
                  getX(batch, ${f} + 2, xR, xC)
                );
                dotProd += dot(xValues, wValues);
              }

            }
          }
        }

        float result = dotProd;
        ${C}
        ${I}
        setOutput(result);
      }
    `}}class iV{constructor(t){this.variableNames=["x","W"],this.outputShape=t.outShape;const e=t.padInfo.front,s=t.padInfo.top,r=t.padInfo.left,o=t.strideDepth,i=t.strideHeight,a=t.strideWidth,c=t.dilationDepth,l=t.dilationHeight,u=t.dilationWidth,h=t.filterDepth,d=t.filterHeight,p=t.filterWidth,f=Math.floor(t.inChannels/4)*4,m=t.inChannels%4;this.userCode=`
      const ivec3 strides = ivec3(${o}, ${i}, ${a});
      const ivec3 pads = ivec3(${e}, ${s}, ${r});

      void main() {
        ivec5 coords = getOutputCoords();
        int batch = coords.x;
        int d2 = coords.u;

        ivec3 xFRCCorner = ivec3(coords.y, coords.z, coords.w) * strides - pads;
        int xFCorner = xFRCCorner.x;
        int xRCorner = xFRCCorner.y;
        int xCCorner = xFRCCorner.z;

        // Convolve x(?, ?, ?, d1) with w(:, :, :, d1, d2) to get
        // y(yF, yR, yC, d2). ? = to be determined. : = across all
        // values in that axis.
        float dotProd = 0.0;
        for (int wF = 0; wF < ${h}; wF++) {
          int xF = xFCorner + wF * ${c};

          if (xF < 0 || xF >= ${t.inDepth}) {
            continue;
          }

          for (int wR = 0; wR < ${d}; wR++) {
            int xR = xRCorner + wR * ${l};

            if (xR < 0 || xR >= ${t.inHeight}) {
              continue;
            }

            for (int wC = 0; wC < ${p}; wC++) {
              int xC = xCCorner + wC * ${u};

              if (xC < 0 || xC >= ${t.inWidth}) {
                continue;
              }

              for (int d1 = 0; d1 < ${f}; d1 += 4) {
                vec4 xValues = vec4(
                  getX(batch, xF, xR, xC, d1),
                  getX(batch, xF, xR, xC, d1 + 1),
                  getX(batch, xF, xR, xC, d1 + 2),
                  getX(batch, xF, xR, xC, d1 + 3)
                );
                vec4 wValues = vec4(
                  getW(wF, wR, wC, d1, d2),
                  getW(wF, wR, wC, d1 + 1, d2),
                  getW(wF, wR, wC, d1 + 2, d2),
                  getW(wF, wR, wC, d1 + 3, d2)
                );

                dotProd += dot(xValues, wValues);
              }

              if (${m===1}) {
                dotProd +=
                  getX(batch, xF, xR, xC, ${f}) *
                  getW(wF, wR, wC, ${f}, d2);
              } else if (${m===2}) {
                vec2 xValues = vec2(
                  getX(batch, xF, xR, xC, ${f}),
                  getX(batch, xF, xR, xC, ${f} + 1)
                );
                vec2 wValues = vec2(
                  getW(wF, wR, wC, ${f}, d2),
                  getW(wF, wR, wC, ${f} + 1, d2)
                );
                dotProd += dot(xValues, wValues);
              } else if (${m===3}) {
                vec3 xValues = vec3(
                  getX(batch, xF, xR, xC, ${f}),
                  getX(batch, xF, xR, xC, ${f} + 1),
                  getX(batch, xF, xR, xC, ${f} + 2)
                );
                vec3 wValues = vec3(
                  getW(wF, wR, wC, ${f}, d2),
                  getW(wF, wR, wC, ${f} + 1, d2),
                  getW(wF, wR, wC, ${f} + 2, d2)
                );
                dotProd += dot(xValues, wValues);
              }
            }
          }
        }
        setOutput(dotProd);
      }
    `}}class Oy{constructor(t,e=!1,s=null,r=!1,o=!1){this.variableNames=["x","W"],this.packedInputs=!0,this.packedOutput=!0,this.customUniforms=[{name:"pads",type:"ivec2"},{name:"strides",type:"ivec2"},{name:"dilations",type:"ivec2"},{name:"inDims",type:"ivec2"}],this.outputShape=t.outShape,this.enableShapeUniforms=Ae(this.outputShape.length);const i=t.padInfo.left,a=t.strideWidth,c=t.dilationWidth,l=t.filterHeight,u=t.filterWidth,h=u;let d=`
       int xR; int xC; int xCOffset;
       vec4 wTexel; vec4 previous; vec4 final;`;for(let g=0;g<u;g++)d+=`
           vec4 xTexelC${g*2};
           int xTexelC${g*2}Ready;
           vec4 xTexelC${g*2+1};
           int xTexelC${g*2+1}Ready;
           vec4 xC${g};`;d+=`
     for (int r = 0; r < ${l}; r++) {
      for (int d1 = 0; d1 < ${t.inChannels}; d1 += 2) {
       `;for(let g=0;g<u;g++)d+=`
           xTexelC${g*2} = vec4(0.0);
           xTexelC${g*2}Ready = 0;
           xTexelC${g*2+1} = vec4(0.0);
           xTexelC${g*2+1}Ready = 0;
           xC${g} = vec4(0.0);`;d+=`
         xR = xRCorner + r * dilations[0];
         if (xR >=0 && xR < inDims[0]) {
       `;for(let g=0;g<(h+1)/2;g++){const x=g*2;if(d+=`
           xC = xCCorner + ${x*c};
           `,a===1){if(x<u&&(i%2===1?(d+=`
                 xCOffset = xC + 1;
                 if (xCOffset >= 0 && xCOffset < inDims[1] && xTexelC${x}Ready == 0) {
                   xTexelC${x} = getX(batch, xR, xCOffset, d1);

                   // Need to manually clear unused channels in case
                   // we're reading from recycled texture.
                   if (xCOffset + 1 >= inDims[1]) {
                     xTexelC${x}.zw = vec2(0.0);
                   }
                   xTexelC${x}Ready = 1;
                 }
               `,c===1&&x>0?d+=`
                 xC${x} = vec4(xTexelC${x-2}.zw, xTexelC${x}.xy);
                 `:d+=`
                   xCOffset = xC + 1 - 2;

                   if (xCOffset >= 0 && xCOffset < inDims[1]) {
                     previous = getX(batch, xR, xCOffset, d1);

                     // Need to manually clear unused channels in case
                     // we're reading from recycled texture.
                     if (xCOffset + 1 >= inDims[1]) {
                       previous.zw = vec2(0.0);
                     }

                     xC${x} = vec4(previous.zw, xTexelC${x}.xy);
                   } else {
                     xC${x} = vec4(0.0, 0.0, xTexelC${x}.xy);
                   }
                   `):d+=`
                 if (xC >= 0 && xC < inDims[1] && xTexelC${x}Ready == 0) {
                   xTexelC${x} = getX(batch, xR, xC, d1);
                   if (xC + 1 >= inDims[1]) {
                     xTexelC${x}.zw = vec2(0.0);
                   }
                   xTexelC${x}Ready = 1;
                 }

                 xC${x} = xTexelC${x};
                 `,x+1<u)){const b=i%2===0?Gu(c):c;c%2===0&&i%2===1||c%2!==0&&i%2!==1?(d+=`
                   xCOffset = xC + imod(pads[1], 2) + ${b};

                   if (xCOffset >= 0 && xCOffset < inDims[1] && xTexelC${x+1}Ready == 0) {
                     xTexelC${x+1} = getX(batch, xR, xCOffset, d1);

                     // Need to manually clear unused channels in case
                     // we're reading from recycled texture.
                     if (xCOffset + 1 >= inDims[1]) {
                       xTexelC${x+1}.zw = vec2(0.0);
                     }
                     xTexelC${x+1}Ready = 1;
                   }
                   `,c>1?d+=`
                     xCOffset -= 2;
                     if (xCOffset >= 0 && xCOffset < inDims[1]) {
                      previous = getX(batch, xR, xCOffset, d1);
                      xC${x+1} = vec4(previous.zw, xTexelC${x+1}.xy);
                     } else {
                      xC${x+1} = vec4(0.0, 0.0, xTexelC${x+1}.xy);
                     }
                     `:d+=`
                     xC${x+1} = vec4(xTexelC${x}.zw, xTexelC${x+1}.xy);
                     `):b===1?d+=`
                     xC${x+1} = xTexelC${x};
                     `:d+=`
                     xCOffset = xC + ${b};

                     if (xCOffset >= 0 && xCOffset < inDims[1] && xTexelC${x+1}Ready == 0) {
                       xTexelC${x+1} = getX(batch, xR, xCOffset, d1);
                       if (xCOffset + 1 >= inDims[1]) {
                         xTexelC${x+1}.zw = vec2(0.0);
                       }
                       xTexelC${x+1}Ready = 1;
                     }

                     xC${x+1} = xTexelC${x+1};
                     `}}else x<u&&(i%2===1?(d+=`
                 xCOffset = xC + 1 - strides[1];
                 if(xCOffset >= 0 && xCOffset < inDims[1] && xTexelC${x}Ready == 0) {
                   xTexelC${x} = getX(batch, xR, xCOffset, d1);
                   // Need to manually clear unused channels in case
                   // we're reading from recycled texture.
                   if (xCOffset + 1 >= inDims[1]) {
                     xTexelC${x}.zw = vec2(0.0);
                   }
                   xTexelC${x}Ready = 1;
                 }

                 if(xC + 1 >= 0 && xC + 1 < inDims[1] && xTexelC${x+1}Ready == 0) {
                   xTexelC${x+1} = getX(batch, xR, xC + 1, d1);
                   // Need to manually clear unused channels in case
                   // we're reading from recycled texture.
                   if (xC + 2 >= inDims[1]) {
                     xTexelC${x+1}.zw = vec2(0.0);
                   }
                   xTexelC${x+1}Ready = 1;
                 }

                 xC${x} = vec4(xTexelC${x}.zw, xTexelC${x+1}.zw);
               `,x+1<u&&(d+=`
                   final = vec4(0.0);
                   xCOffset = xC + 1 + strides[1];
                   if(xCOffset >= 0 && xCOffset < inDims[1]) {
                     final = getX(batch, xR, xCOffset, d1);
                   }
                   xC${x+1} = vec4(xTexelC${x+1}.xy, final.xy);
                 `)):(d+=`
                 if(xC >= 0 && xC < inDims[1] && xTexelC${x}Ready == 0) {
                   xTexelC${x} = getX(batch, xR, xC, d1);
                   if (xC + 1 >= inDims[1]) {
                     xTexelC${x}.zw = vec2(0.0);
                   }
                   xTexelC${x}Ready = 1;
                 }

                 xCOffset = xC + strides[1];
                 if(xCOffset >= 0 && xCOffset < inDims[1] && xTexelC${x+1}Ready == 0) {
                   xTexelC${x+1} = getX(batch, xR, xCOffset, d1);
                   if (xCOffset + 1 >= inDims[1]) {
                     xTexelC${x+1}.zw = vec2(0.);
                   }
                   xTexelC${x+1}Ready = 1;
                 }

                 xC${x} = vec4(
                   xTexelC${x}.xy, xTexelC${x+1}.xy);
               `,x+1<u&&(d+=`
                   xC${x+1} = vec4(xTexelC${x}.zw, xTexelC${x+1}.zw);
                 `)));x<u&&(d+=`
             wTexel = getW(r, ${x}, d1, d2);
             dotProd += xC${x}.xxzz * vec4(wTexel.xy, wTexel.xy);
             if(d1 + 1 < ${t.inChannels}) {
               dotProd += xC${x}.yyww * vec4(wTexel.zw, wTexel.zw);
             }
           `,x+1<u&&(d+=`
               wTexel = getW(r, ${x+1}, d1, d2);
               dotProd += xC${x+1}.xxzz * vec4(wTexel.xy, wTexel.xy);
               if(d1 + 1 < ${t.inChannels}) {
                 dotProd += xC${x+1}.yyww * vec4(wTexel.zw, wTexel.zw);
               }
             `))}d+=`
     }
   `,d+=`
     }
   `,d+=`
     }
   `;let p="",f="";s&&(r?p=`vec4 activation(vec4 a) {
           vec4 b = getPreluActivationWeightsAtOutCoords();
           ${s}
         }`:o?p=`vec4 activation(vec4 a) {
           vec4 b = getLeakyreluAlphaAtOutCoords();
           ${s}
         }`:p=`vec4 activation(vec4 x) {
           ${s}
         }`,f="result = activation(result);");const m=e?"result += getBiasAtOutCoords();":"";e&&this.variableNames.push("bias"),r&&this.variableNames.push("preluActivationWeights"),o&&this.variableNames.push("leakyreluAlpha"),this.userCode=`
       ${p}

       void main() {
         ivec4 coords = getOutputCoords();
         int batch = coords.x;
         ivec2 xRCCorner = coords.yz * strides - pads;
         int d2 = coords.w;
         int xRCorner = xRCCorner.x;
         int xCCorner = xRCCorner.y;

         //intialize dotProd with a small epsilon seems to reduce GPU accuracy loss.
         vec4 dotProd = vec4(0.000000000000001);

         ${d}

         vec4 result = dotProd - vec4(0.000000000000001);
         ${m}
         ${f}
         setOutput(result);
       }
     `}}class aV{constructor(t,e){this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!0,this.customUniforms=[{name:"inputShape",type:"ivec4"},{name:"pad",type:"ivec2"},{name:"stride",type:"ivec2"},{name:"dilation",type:"ivec2"},{name:"inChannels",type:"int"},{name:"itemsPerBlockRow",type:"int"},{name:"outWidth",type:"int"}],this.outputShape=t,this.enableShapeUniforms=Ae(this.outputShape.length);const{dataFormat:s}=e,r=De(),o=s==="channelsLast",i=o?1:2,a=o?2:3,c=this.enableShapeUniforms?"if(blockIndex < outShape[2] && pos < outShape[1]) {":`if(blockIndex < ${t[2]} && pos < ${t[1]}) {`;let l="";for(let u=0;u<=1;u++)for(let h=0;h<=1;h++)l+=`
          blockIndex = rc.z + ${h};
          pos = rc.y + ${u};

          ${c}
            offsetY = int(blockIndex / outWidth) * stride[0] - pad[0];
            d0 = offsetY + dilation[0] * (pos / itemsPerBlockRow);

            if(d0 < inputShape[${i}] && d0 >= 0) {
              // Use custom imod instead mod. On Intel GPU, mod may generate
              // unexpected value.
              // https://github.com/tensorflow/tfjs/issues/5447
              offsetX = imod(blockIndex, outWidth) * stride[1] - pad[1];
              d1 = offsetX + dilation[1] * (imod(pos, itemsPerBlockRow) /
                  inChannels);

              if(d1 < inputShape[${a}] && d1 >= 0) {

                ch = imod(pos, inChannels);

                if (${o}) {
                  innerDims = vec2(d1, ch);
                  result[${u*2+h}] = getChannel(
                    getA(rc.x, d0, int(innerDims.x),
                    int(innerDims.y)), innerDims);
                } else {
                  innerDims = vec2(d0, d1);
                  result[${u*2+h}] = getChannel(
                    getA(rc.x, ch, int(innerDims.x),
                    int(innerDims.y)), innerDims);
                }
              }
            }
          }
        `;this.userCode=`
      void main() {
        ivec3 rc = getOutputCoords();

        vec4 result = vec4(0);

        int blockIndex, pos, offsetY, d0, offsetX, d1, ch;
        vec2 innerDims;

        ${l}

        ${r.output} = result;
      }
    `}}function Ja(n,t){const e=n.length;return e>=3?t?[...n.slice(0,-3),n[e-3]*n[e-2],n[e-1]]:[...n.slice(0,-3),n[e-3],n[e-2]*n[e-1]]:!t&&e===1&&n[0]>1?[n[0],1]:null}function _y({x:n,filter:t,convInfo:e,backend:s,bias:r=null,preluActivationWeights:o=null,leakyreluAlpha:i=0,activation:a=null}){const c=n.shape,l=s.texData.get(n.dataId),u=e.inChannels,h=c[0]*c[1]*c[2],d=e.outChannels,p=e.dataFormat==="channelsLast",f=!1,m=!1;let g;const x=[];if(o!=null){const y=Ja(o.shape,p);y!=null&&(o=et({inputs:{x:o},backend:s,attrs:{shape:y}}),x.push(o))}if(r!=null){const y=Ja(r.shape,p);y!=null&&(r=et({inputs:{x:r},backend:s,attrs:{shape:y}}),x.push(r))}if(!((h===1||d===1)&&u>Ny)&&l.isPacked&&p&&l.texture!=null&&c[2]%2!==0&&Tt(l.shape.slice(-3),c.slice(-3))){const y=c[0]*c[1]*(c[2]+1),I={dataId:n.dataId,shape:[1,y,e.inChannels],dtype:n.dtype},C=l.shape;l.shape=l.shape.slice(),l.shape[l.shape.length-2]++,S(Ya(l.shape,I.shape),()=>`packed reshape ${l.shape} to ${I.shape} isn't free`);const N=et({inputs:{x:t},backend:s,attrs:{shape:[1,e.inChannels,e.outChannels]}});x.push(N);const T=Za({a:I,b:N,backend:s,transposeA:f,transposeB:m,bias:r,activation:a,preluActivationWeights:o,leakyreluAlpha:i}),$=s.texData.get(T.dataId);S($.isPacked,()=>"batchMatMul result is expected to be packed"),l.shape=C,$.shape=e.outShape,g=He({inputs:{x:T},backend:s}),g.shape=e.outShape,x.push(T)}else{const y=e.outHeight*e.outWidth,I=et({inputs:{x:n},backend:s,attrs:{shape:p?[e.batchSize,y,e.inChannels]:[e.batchSize,e.inChannels,y]}}),C=et({inputs:{x:t},backend:s,attrs:{shape:[1,e.inChannels,e.outChannels]}}),N=Za({a:p?I:C,b:p?C:I,transposeA:!p,transposeB:m,backend:s,bias:r,activation:a,preluActivationWeights:o,leakyreluAlpha:i});g=et({inputs:{x:N},backend:s,attrs:{shape:e.outShape}}),x.push(I),x.push(C),x.push(N)}for(const y of x)s.disposeIntermediateTensorInfo(y);return g}function My({x:n,filter:t,convInfo:e,backend:s,bias:r=null,preluActivationWeights:o=null,leakyreluAlpha:i=0,activation:a=null}){const{filterWidth:c,filterHeight:l,inChannels:u,outWidth:h,outHeight:d,dataFormat:p}=e,f=p==="channelsLast",m=c*l*u,g=d*h,x=[e.batchSize,m,g],b=!0,w=!1,y=[];if(o!=null){const V=Ja(o.shape,f);V!=null&&(o=et({inputs:{x:o},backend:s,attrs:{shape:V}}),y.push(o))}if(r!=null){const V=Ja(r.shape,f);V!=null&&(r=et({inputs:{x:r},backend:s,attrs:{shape:V}}),y.push(r))}const I=et({inputs:{x:t},backend:s,attrs:{shape:[1,m,q(t.shape)/m]}});y.push(I);const C=new aV(x,e),N=[n.shape,[e.padInfo.top,e.padInfo.left],[e.strideHeight,e.strideWidth],[e.dilationHeight,e.dilationWidth],[e.inChannels],[e.filterWidth*e.inChannels],[e.outWidth]],T=s.runWebGLProgram(C,[n],"float32",N),$=et({inputs:{x:T},backend:s,attrs:{shape:x}});y.push(T),y.push($);const k=r!=null,v=o!=null,R=a==="leakyrelu",_=a?So(a,!0):null,P=new Sy(f?$.shape:I.shape,f?I.shape:$.shape,f?[e.batchSize,g,e.outChannels]:[e.batchSize,e.outChannels,g],b,w,k,_,v,R),L=f?[$,I]:[I,$];if(r&&L.push(r),v&&L.push(o),R){const V=s.makeTensorInfo([],"float32",xs(i,"float32"));L.push(V),y.push(V)}const B=s.runWebGLProgram(P,L,"float32"),U=et({inputs:{x:B},backend:s,attrs:{shape:e.outShape}});y.push(B);for(const V of y)s.disposeIntermediateTensorInfo(V);return U}function cV(n){const{inputs:t,backend:e,attrs:s}=n,{x:r,filter:o}=t,{strides:i,pad:a,dataFormat:c,dilations:l,dimRoundingMode:u}=s,h=Xn(c),d=ye(r.shape,o.shape,i,l,a,u,!1,h);let p;if(d.filterHeight===1&&d.filterWidth===1&&d.dilationHeight===1&&d.dilationWidth===1&&d.strideHeight===1&&d.strideWidth===1&&(d.padInfo.type==="SAME"||d.padInfo.type==="VALID"))p=_y({x:r,filter:o,convInfo:d,backend:e});else if(d.strideWidth<=2&&h==="channelsLast"&&W().getBool("WEBGL_EXP_CONV")){const m=new Oy(d),g=[[d.padInfo.top,d.padInfo.left],[d.strideHeight,d.strideWidth],[d.dilationHeight,d.dilationWidth],[d.inHeight,d.inWidth]];p=e.runWebGLProgram(m,[r,o],"float32",g)}else if(W().getBool("WEBGL_CONV_IM2COL"))p=My({x:r,filter:o,convInfo:d,backend:e});else{const m=new Fy(d);p=e.runWebGLProgram(m,[r,o],"float32")}const f=et({inputs:{x:p},backend:e,attrs:{shape:d.outShape}});return e.disposeIntermediateTensorInfo(p),f}const lV={kernelName:lc,backendName:"webgl",kernelFunc:cV};class uV{constructor(t){this.variableNames=["x","dy"],this.outputShape=t.filterShape;const e=t.strideHeight,s=t.strideWidth,r=t.padInfo.top,o=t.padInfo.left,i=t.dataFormat==="channelsLast";this.userCode=`
      void main() {
        ivec4 coords = getOutputCoords();
        int wR = coords.x;
        int wC = coords.y;
        int d1 = coords.z;
        int d2 = coords.w;

        // Convolve x(?, ?, d1) with dy(:, :, d2) to get dw(wR, wC, d1, d2).
        // ? = to be determined. : = across all values in that axis.
        float dotProd = 0.0;

        for (int b = 0; b < ${t.batchSize}; b++) {
          for (int yR = 0; yR < ${t.outHeight}; yR++) {
            int xR = wR + yR * ${e} - ${r};

            if (xR < 0 || xR >= ${t.inHeight}) {
              continue;
            }

            for (int yC = 0; yC < ${t.outWidth}; yC++) {
              int xC = wC + yC * ${s} - ${o};

              if (xC < 0 || xC >= ${t.inWidth}) {
                continue;
              }

              if (${i}) {
                float dyValue = getDy(b, yR, yC, d2);
                float xValue = getX(b, xR, xC, d1);
                dotProd += (xValue * dyValue);
              } else {
                float dyValue = getDy(b, d2, yR, yC);
                float xValue = getX(b, d1, xR, xC);
                dotProd += (xValue * dyValue);
              }

            }
          }
        }
        setOutput(dotProd);
      }
    `}}class hV{constructor(t){this.variableNames=["dy","W"],this.outputShape=t.inShape;const e=t.filterHeight,s=t.filterWidth,r=t.strideHeight,o=t.strideWidth,i=t.dataFormat==="channelsLast",a=e-1-t.padInfo.top,c=s-1-t.padInfo.left,l=i?1:2,u=i?2:3,h=i?3:1;this.userCode=`
      const ivec2 pads = ivec2(${a}, ${c});

      void main() {
        ivec4 coords = getOutputCoords();
        int batch = coords[0];
        int d1 = coords[${h}];

        ivec2 dyCorner = ivec2(coords[${l}], coords[${u}]) - pads;
        int dyRCorner = dyCorner.x;
        int dyCCorner = dyCorner.y;

        // Convolve dy(?, ?, d2) with w(:, :, d1, d2) to compute dx(xR, xC, d1).
        // ? = to be determined. : = across all values in that axis.
        float dotProd = 0.0;
        for (int wR = 0; wR < ${e}; wR++) {
          float dyR = float(dyRCorner + wR) / ${r}.0;

          if (dyR < 0.0 || dyR >= ${t.outHeight}.0 || fract(dyR) > 0.0) {
            continue;
          }
          int idyR = int(dyR);

          int wRPerm = ${e} - 1 - wR;

          for (int wC = 0; wC < ${s}; wC++) {
            float dyC = float(dyCCorner + wC) / ${o}.0;

            if (dyC < 0.0 || dyC >= ${t.outWidth}.0 ||
                fract(dyC) > 0.0) {
              continue;
            }
            int idyC = int(dyC);

            int wCPerm = ${s} - 1 - wC;

            for (int d2 = 0; d2 < ${t.outChannels}; d2++) {

              if (${i}) {
                float xValue = getDy(batch, idyR, idyC, d2);
                float wValue = getW(wRPerm, wCPerm, d1, d2);
                dotProd += xValue * wValue;
              } else {
                float xValue = getDy(batch, d2, idyR, idyC);
                float wValue = getW(wRPerm, wCPerm, d1, d2);
                dotProd += xValue * wValue;
              }

            }
          }
        }
        setOutput(dotProd);
      }
    `}}class dV{constructor(t){this.variableNames=["x","dy"],this.outputShape=t.filterShape;const e=t.strideDepth,s=t.strideHeight,r=t.strideWidth,o=t.padInfo.front,i=t.padInfo.top,a=t.padInfo.left;this.userCode=`
      void main() {
        ivec5 coords = getOutputCoords();
        int wF = coords.x;
        int wR = coords.y;
        int wC = coords.z;
        int d1 = coords.w;
        int d2 = coords.u;

        float dotProd = 0.0;

        for (int b = 0; b < ${t.batchSize}; b++) {
          for (int yF = 0; yF < ${t.outDepth}; yF++) {
            int xF = wF + yF * ${e} - ${o};

            if (xF < 0 || xF >= ${t.inDepth}) {
              continue;
            }

            for (int yR = 0; yR < ${t.outHeight}; yR++) {
              int xR = wR + yR * ${s} - ${i};

              if (xR < 0 || xR >= ${t.inHeight}) {
                continue;
              }

              for (int yC = 0; yC < ${t.outWidth}; yC++) {
                int xC = wC + yC * ${r} - ${a};

                if (xC < 0 || xC >= ${t.inWidth}) {
                  continue;
                }

                float dyValue = getDy(b, yF, yR, yC, d2);
                float xValue = getX(b, xF, xR, xC, d1);
                dotProd += (xValue * dyValue);
              }
            }
          }
        }
        setOutput(dotProd);
      }
    `}}class pV{constructor(t){this.variableNames=["dy","W"],this.outputShape=t.inShape;const e=t.filterDepth,s=t.filterHeight,r=t.filterWidth,o=t.strideDepth,i=t.strideHeight,a=t.strideWidth,c=e-1-t.padInfo.front,l=s-1-t.padInfo.top,u=r-1-t.padInfo.left;this.userCode=`
      const ivec3 pads = ivec3(${c}, ${l}, ${u});

      void main() {
        ivec5 coords = getOutputCoords();
        int batch = coords.x;
        int d1 = coords.u;


        ivec3 dyCorner = ivec3(coords.y, coords.z, coords.w) - pads;
        int dyFCorner = dyCorner.x;
        int dyRCorner = dyCorner.y;
        int dyCCorner = dyCorner.z;

        float dotProd = 0.0;
        for (int wF = 0; wF < ${e}; wF++) {
          float dyF = float(dyFCorner + wF) / ${o}.0;

          if (dyF < 0.0 || dyF >= ${t.outDepth}.0 || fract(dyF) > 0.0) {
            continue;
          }
          int idyF = int(dyF);

          int wFPerm = ${e} - 1 - wF;

          for (int wR = 0; wR < ${s}; wR++) {
            float dyR = float(dyRCorner + wR) / ${i}.0;

            if (dyR < 0.0 || dyR >= ${t.outHeight}.0 ||
              fract(dyR) > 0.0) {
              continue;
            }
            int idyR = int(dyR);

            int wRPerm = ${s} - 1 - wR;

            for (int wC = 0; wC < ${r}; wC++) {
              float dyC = float(dyCCorner + wC) / ${a}.0;

              if (dyC < 0.0 || dyC >= ${t.outWidth}.0 ||
                  fract(dyC) > 0.0) {
                continue;
              }
              int idyC = int(dyC);

              int wCPerm = ${r} - 1 - wC;

              for (int d2 = 0; d2 < ${t.outChannels}; d2++) {
                float xValue = getDy(batch, idyF, idyR, idyC, d2);
                float wValue = getW(wFPerm, wRPerm, wCPerm, d1, d2);
                dotProd += xValue * wValue;
              }
            }
          }
        }
        setOutput(dotProd);
      }
    `}}function fV(n){const{inputs:t,backend:e,attrs:s}=n,{x:r,dy:o}=t,{strides:i,pad:a,dataFormat:c,dimRoundingMode:l,filterShape:u}=s,h=Xn(c),d=ye(r.shape,u,i,1,a,l,!1,h),p=new uV(d);return e.runWebGLProgram(p,[r,o],"float32")}const mV={kernelName:th,backendName:"webgl",kernelFunc:fV};function gV(n){const{inputs:t,backend:e,attrs:s}=n,{dy:r,filter:o}=t,{inputShape:i,strides:a,pad:c,dataFormat:l,dimRoundingMode:u}=s,h=Xn(l),d=ye(i,o.shape,a,1,c,u,!1,h),p=new hV(d);return e.runWebGLProgram(p,[r,o],"float32")}const xV={kernelName:uc,backendName:"webgl",kernelFunc:gV};function bV(n){const{inputs:t,backend:e,attrs:s}=n,{x:r,filter:o}=t,{strides:i,pad:a,dilations:c}=s,l=bs(r.shape,o.shape,i,c,a),u=new iV(l);return e.runWebGLProgram(u,[r,o],"float32")}const yV={kernelName:hc,backendName:"webgl",kernelFunc:bV};function wV(n){const{inputs:t,backend:e,attrs:s}=n,{x:r,dy:o}=t,{strides:i,pad:a,filterShape:c}=s,l=bs(r.shape,c,i,1,a),u=new dV(l);return e.runWebGLProgram(u,[r,o],"float32")}const IV={kernelName:eh,backendName:"webgl",kernelFunc:wV};function vV(n){const{inputs:t,backend:e,attrs:s}=n,{dy:r,filter:o}=t,{pad:i,strides:a,inputShape:c}=s,l=bs(c,o.shape,a,1,i),u=new pV(l);return e.runWebGLProgram(u,[r,o],"float32")}const CV={kernelName:nh,backendName:"webgl",kernelFunc:vV};const kV=Zr+`
  return cos(x);
`,$V=St({opSnippet:kV}),SV={kernelName:Vo,backendName:"webgl",kernelFunc:$V};const NV=`
  float e2x = exp(-x);
  return (e2x + 1.0 / e2x) / 2.0;
`,TV=St({opSnippet:NV}),EV={kernelName:Wo,backendName:"webgl",kernelFunc:TV};class RV{constructor(t,e,s,r,o){this.variableNames=["Image","Boxes","BoxInd"],this.outputShape=[];const[i,a,c,l]=t,[u]=e,[h,d]=s;this.outputShape=[u,h,d,l];const p=r==="bilinear"?1:0,[f,m]=[`${a-1}.0`,`${c-1}.0`],[g,x,b]=h>1?[`${(a-1)/(h-1)}`,"(y2-y1) * height_ratio",`y1*${f} + float(y)*(height_scale)`]:["0.0","0.0",`0.5 * (y1+y2) * ${f}`],[w,y,I]=d>1?[`${(c-1)/(d-1)}`,"(x2-x1) * width_ratio",`x1*${m} + float(x)*(width_scale)`]:["0.0","0.0",`0.5 * (x1+x2) * ${m}`];this.userCode=`
      const float height_ratio = float(${g});
      const float width_ratio = float(${w});
      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int y = coords[1];
        int x = coords[2];
        int d = coords[3];

        // get box vals
        float y1 = getBoxes(b,0);
        float x1 = getBoxes(b,1);
        float y2 = getBoxes(b,2);
        float x2 = getBoxes(b,3);

        // get image in batch index
        int bInd = round(getBoxInd(b));
        if(bInd < 0 || bInd >= ${i}) {
          return;
        }

        float height_scale = ${x};
        float width_scale = ${y};

        float in_y = ${b};
        if( in_y < 0.0 || in_y > ${f} ) {
          setOutput(float(${o}));
          return;
        }
        float in_x = ${I};
        if( in_x < 0.0 || in_x > ${m} ) {
          setOutput(float(${o}));
          return;
        }

        vec2 sourceFracIndexCR = vec2(in_x,in_y);
        if(${p} == 1) {
          // Compute the four integer indices.
          ivec2 sourceFloorCR = ivec2(sourceFracIndexCR);
          ivec2 sourceCeilCR = ivec2(ceil(sourceFracIndexCR));

          float topLeft = getImage(b, sourceFloorCR.y, sourceFloorCR.x, d);
          float bottomLeft = getImage(b, sourceCeilCR.y, sourceFloorCR.x, d);
          float topRight = getImage(b, sourceFloorCR.y, sourceCeilCR.x, d);
          float bottomRight = getImage(b, sourceCeilCR.y, sourceCeilCR.x, d);

          vec2 fracCR = sourceFracIndexCR - vec2(sourceFloorCR);

          float top = topLeft + (topRight - topLeft) * fracCR.x;
          float bottom = bottomLeft + (bottomRight - bottomLeft) * fracCR.x;
          float newValue = top + (bottom - top) * fracCR.y;
          setOutput(newValue);
        } else {
          // Compute the coordinators of nearest neighbor point.
          ivec2 sourceNearestCR = ivec2(floor(
            sourceFracIndexCR + vec2(0.5,0.5)));
          float newValue = getImage(b, sourceNearestCR.y, sourceNearestCR.x, d);
          setOutput(newValue);
        }
      }
    `}}const DV=n=>{const{inputs:t,backend:e,attrs:s}=n,{image:r,boxes:o,boxInd:i}=t,{cropSize:a,method:c,extrapolationValue:l}=s,u=new RV(r.shape,o.shape,a,c,l);return e.runWebGLProgram(u,[r,o,i],"float32")},AV={kernelName:rh,backendName:"webgl",kernelFunc:DV};var To;(function(n){n.Prod="*",n.Sum="+"})(To||(To={}));class hm{constructor(t,e,s,r){this.op=t,this.outputShape=e,this.variableNames=["x"],this.customUniforms=[{name:"index",type:"float"}];const o=this.outputShape.length,i=this.op===To.Prod?"1.0":"0.0",a=s?i:`getX(${dm(o,"coords",this.op)})`,c=this.outputShape[this.outputShape.length-1];let l="",u="";s?(l=r?`end != ${c-1}`:"end != 0",u=r?"end + 1":"end - 1"):(l=r?`end + pow2 < ${c}`:"end >= pow2",u=r?"end + pow2":"end - pow2"),this.userCode=`
      void main() {
        ${Bt(o)} coords = getOutputCoords();
        int end = ${pm(o,"coords",this.op)};
        float val = ${a};
        int pow2 = int(pow(2.0, index));
        if (${l}) {
          int idx = ${u};
          ${pm(o,"coords",this.op)} = idx;
          val ${this.op}= getX(${dm(o,"coords",this.op)});
        }
        setOutput(val);
      }
    `}}function dm(n,t,e){if(n===1)return`${t}`;if(n===2)return`${t}.x, ${t}.y`;if(n===3)return`${t}.x, ${t}.y, ${t}.z`;if(n===4)return`${t}.x, ${t}.y, ${t}.z, ${t}.w`;throw new Error(`Cumulative ${e} for rank ${n} is not yet supported`)}function pm(n,t,e){if(n===1)return`${t}`;if(n===2)return`${t}.y`;if(n===3)return`${t}.z`;if(n===4)return`${t}.w`;throw new Error(`Cumulative ${e} for rank ${n} is not yet supported`)}function Ly(n,t,e,s,r,o){const i=t.shape.length,a=Kt([s],i);let c=t;a!=null&&(c=Re({inputs:{x:t},backend:e,attrs:{perm:a}}));const l=Qt(1,i)[0];if(l!==i-1)throw new Error(`WebGL cumprod shader expects an inner-most axis=${t.shape.length-1} but got axis=${s}`);const u=c.shape[l];let h=He({inputs:{x:c},backend:e});for(let d=0;d<=Math.ceil(Math.log2(u))-1;d++){const p=new hm(n,c.shape,!1,o),f=[[d]],m=h;h=e.runWebGLProgram(p,[h],h.dtype,f),e.disposeIntermediateTensorInfo(m)}if(r){const d=new hm(n,c.shape,r,o),p=h;h=e.runWebGLProgram(d,[h],h.dtype),e.disposeIntermediateTensorInfo(p)}if(a!=null){const d=ys(a),p=Re({inputs:{x:h},backend:e,attrs:{perm:d}});return e.disposeIntermediateTensorInfo(h),e.disposeIntermediateTensorInfo(c),p}return h}function FV(n){const{inputs:t,backend:e,attrs:s}=n,{x:r}=t,{axis:o,exclusive:i,reverse:a}=s;return Ly(To.Prod,r,e,o,i,a)}const OV={kernelName:sh,backendName:"webgl",kernelFunc:FV};function _V(n){const{inputs:t,backend:e,attrs:s}=n,{x:r}=t,{axis:o,exclusive:i,reverse:a}=s;return Ly(To.Sum,r,e,o,i,a)}const MV={kernelName:dc,backendName:"webgl",kernelFunc:_V};function LV(n){const{inputs:t,backend:e,attrs:s}=n,{x:r,weights:o}=t,{size:i,binaryOutput:a}=s;if(r.shape.length===1){const c=e.readSync(r.dataId),l=e.readSync(o.dataId),u=xy(c,l,o.dtype,o.shape,i);return e.makeTensorInfo([i],o.dtype,u)}else if(r.shape.length===2){const c=e.bufferSync(r),l=e.bufferSync(o),u=YP(c,l,i,a);return e.makeTensorInfo(u.shape,o.dtype,u.values)}throw new Error(`Error in denseBincount: input must be at most rank 2, but got rank${r.shape.length}.`)}const PV={kernelName:Xm,backendName:"webgl",kernelFunc:LV};class BV{constructor(t,e,s){this.variableNames=["x"],this.outputShape=[],this.outputShape=t,this.blockSize=e,this.dataFormat=s,this.userCode=`
    void main() {
      ivec4 coords = getOutputCoords();
      int b = coords[0];
      int h = ${this.getHeightCoordString()};
      int w = ${this.getWidthCoordString()};
      int d = ${this.getDepthCoordString()};

      int in_h = h / ${e};
      int offset_h = imod(h, ${e});
      int in_w = w / ${e};
      int offset_w = imod(w, ${e});
      int offset_d = (offset_h * ${e} + offset_w) *
        ${this.getOutputDepthSize()};
      int in_d = d + offset_d;

      float result = ${this.getInputSamplingString()};
      setOutput(result);
    }
  `}getHeightCoordString(){return this.dataFormat==="NHWC"?"coords[1]":"coords[2]"}getWidthCoordString(){return this.dataFormat==="NHWC"?"coords[2]":"coords[3]"}getDepthCoordString(){return this.dataFormat==="NHWC"?"coords[3]":"coords[1]"}getOutputDepthSize(){return this.dataFormat==="NHWC"?this.outputShape[3]:this.outputShape[1]}getInputSamplingString(){return this.dataFormat==="NHWC"?"getX(b, in_h, in_w, in_d)":"getX(b, in_d, in_h, in_w)"}}function zV(n){const{inputs:t,backend:e,attrs:s}=n,{x:r}=t,{blockSize:o,dataFormat:i}=s,a=r.shape[0],c=i==="NHWC"?r.shape[1]:r.shape[2],l=i==="NHWC"?r.shape[2]:r.shape[3],u=i==="NHWC"?r.shape[3]:r.shape[1],h=c*o,d=l*o,p=u/(o*o),f=i==="NHWC"?[a,h,d,p]:[a,p,h,d],m=new BV(f,o,i);return e.runWebGLProgram(m,[r],r.dtype)}const VV={kernelName:oh,backendName:"webgl",kernelFunc:zV};class Py{constructor(t,e=!1,s=null,r=!1,o=!1){this.variableNames=["x","W"],this.customUniforms=[{name:"pads",type:"ivec2"},{name:"strides",type:"ivec2"},{name:"dilations",type:"ivec2"},{name:"inDims",type:"ivec2"}],this.outputShape=t.outShape,this.enableShapeUniforms=Ae(this.outputShape.length);const i=t.filterHeight,a=t.filterWidth,c=t.outChannels/t.inChannels;let l="",u="";s&&(r?l=`float activation(float a) {
          float b = getPreluActivationWeightsAtOutCoords();
          ${s}
        }`:o?l=`float activation(float a) {
          float b = getLeakyreluAlphaAtOutCoords();
          ${s}
        }`:l=`
          float activation(float x) {
            ${s}
          }
        `,u="result = activation(result);");const h=e?"result += getBiasAtOutCoords();":"";e&&this.variableNames.push("bias"),r&&this.variableNames.push("preluActivationWeights"),o&&this.variableNames.push("leakyreluAlpha"),this.userCode=`
      ${l}

      void main() {
        ivec4 coords = getOutputCoords();
        int batch = coords.x;
        ivec2 xRCCorner = coords.yz * strides - pads;
        int d2 = coords.w;
        int d1 = d2 / ${c};
        int q = d2 - d1 * ${c};

        int xRCorner = xRCCorner.x;
        int xCCorner = xRCCorner.y;

        // Convolve x(?, ?, d1) with w(:, :, d1, q) to get y(yR, yC, d2).
        // ? = to be determined. : = across all values in that axis.
        float dotProd = 0.0;
        // TO DO(dsmilkov): Flatten the two for loops and vec4 the operations.
        for (int wR = 0; wR < ${i}; wR++) {
          int xR = xRCorner + wR * dilations[0];

          if (xR < 0 || xR >= inDims[0]) {
            continue;
          }

          for (int wC = 0; wC < ${a}; wC++) {
            int xC = xCCorner + wC * dilations[1];

            if (xC < 0 || xC >= inDims[1]) {
              continue;
            }

            float xVal = getX(batch, xR, xC, d1);
            float wVal = getW(wR, wC, d1, q);
            dotProd += xVal * wVal;
          }
        }

        float result = dotProd;
        ${h}
        ${u}
        setOutput(result);
      }
    `}}class By{constructor(t,e=!1,s=null,r=!1,o=!1){this.variableNames=["x","W"],this.packedInputs=!0,this.packedOutput=!0,this.customUniforms=[{name:"pads",type:"ivec2"},{name:"strides",type:"ivec2"},{name:"dilations",type:"ivec2"},{name:"inDims",type:"ivec2"}],this.outputShape=t.outShape,this.enableShapeUniforms=Ae(this.outputShape.length);const i=t.outChannels/t.inChannels,a=t.padInfo.left,c=t.strideWidth,l=t.dilationWidth,u=t.filterHeight,h=t.filterWidth,d=h;let p=`
      int xR; int xC; int xCOffset;
      vec4 wTexel; vec4 previous; vec4 final;`;for(let x=0;x<h;x++)p+=`
          vec4 xTexelC${x*2};
          int xTexelC${x*2}Ready;
          vec4 xTexelC${x*2+1};
          int xTexelC${x*2+1}Ready;
          vec4 xC${x};`;p+=`
    for (int r = 0; r < ${u}; r++) {
      `;for(let x=0;x<h;x++)p+=`
          xTexelC${x*2} = vec4(0.0);
          xTexelC${x*2}Ready = 0;
          xTexelC${x*2+1} = vec4(0.0);
          xTexelC${x*2+1}Ready = 0;
          xC${x} = vec4(0.0);`;p+=`
        xR = xRCorner + r * dilations[0];
        if (xR >=0 && xR < inDims[0]) {
      `;for(let x=0;x<(d+1)/2;x++){const b=x*2;if(p+=`
          xC = xCCorner + ${b*l};
          `,c===1){if(b<h&&(a%2===1?(p+=`
                xCOffset = xC + 1;
                if (xCOffset >= 0 && xCOffset < inDims[1] && xTexelC${b}Ready == 0) {
                  xTexelC${b} = getX(batch, xR, xCOffset, d1);

                  // Need to manually clear unused channels in case
                  // we're reading from recycled texture.
                  if (xCOffset + 1 >= inDims[1]) {
                    xTexelC${b}.zw = vec2(0.0);
                  }
                  xTexelC${b}Ready = 1;
                }
              `,l===1&&b>0?p+=`
                xC${b} = vec4(xTexelC${b-2}.zw, xTexelC${b}.xy);
                `:p+=`
                  xCOffset = xC + 1 - 2;

                  if (xCOffset >= 0 && xCOffset < inDims[1]) {
                    previous = getX(batch, xR, xCOffset, d1);

                    // Need to manually clear unused channels in case
                    // we're reading from recycled texture.
                    if (xCOffset + 1 >= inDims[1]) {
                      previous.zw = vec2(0.0);
                    }

                    xC${b} = vec4(previous.zw, xTexelC${b}.xy);
                  } else {
                    xC${b} = vec4(0.0, 0.0, xTexelC${b}.xy);
                  }
                  `):p+=`
                if (xC >= 0 && xC < inDims[1] && xTexelC${b}Ready == 0) {
                  xTexelC${b} = getX(batch, xR, xC, d1);
                  if (xC + 1 >= inDims[1]) {
                    xTexelC${b}.zw = vec2(0.0);
                  }
                  xTexelC${b}Ready = 1;
                }

                xC${b} = xTexelC${b};
                `,b+1<h)){const w=a%2===0?Gu(l):l;l%2===0&&a%2===1||l%2!==0&&a%2!==1?(p+=`
                  xCOffset = xC + imod(pads[1], 2) + ${w};

                  if (xCOffset >= 0 && xCOffset < inDims[1] && xTexelC${b+1}Ready == 0) {
                    xTexelC${b+1} = getX(batch, xR, xCOffset, d1);

                    // Need to manually clear unused channels in case
                    // we're reading from recycled texture.
                    if (xCOffset + 1 >= inDims[1]) {
                      xTexelC${b+1}.zw = vec2(0.0);
                    }
                    xTexelC${b+1}Ready = 1;
                  }
                  `,l>1?p+=`
                    xCOffset -= 2;
                    if (xCOffset >= 0 && xCOffset < inDims[1]) {
                     previous = getX(batch, xR, xCOffset, d1);
                     xC${b+1} = vec4(previous.zw, xTexelC${b+1}.xy);
                    } else {
                     xC${b+1} = vec4(0.0, 0.0, xTexelC${b+1}.xy);
                    }
                    `:p+=`
                    xC${b+1} = vec4(xTexelC${b}.zw, xTexelC${b+1}.xy);
                    `):w===1?p+=`
                    xC${b+1} = xTexelC${b};
                    `:p+=`
                    xCOffset = xC + ${w};

                    if (xCOffset >= 0 && xCOffset < inDims[1] && xTexelC${b+1}Ready == 0) {
                      xTexelC${b+1} = getX(batch, xR, xCOffset, d1);
                      if (xCOffset + 1 >= inDims[1]) {
                        xTexelC${b+1}.zw = vec2(0.0);
                      }
                      xTexelC${b+1}Ready = 1;
                    }

                    xC${b+1} = xTexelC${b+1};
                    `}}else b<h&&(a%2===1?(p+=`
                xCOffset = xC + 1 - strides[1];
                if(xCOffset >= 0 && xCOffset < inDims[1] && xTexelC${b}Ready == 0) {
                  xTexelC${b} = getX(batch, xR, xCOffset, d1);
                  // Need to manually clear unused channels in case
                  // we're reading from recycled texture.
                  if (xCOffset + 1 >= inDims[1]) {
                    xTexelC${b}.zw = vec2(0.0);
                  }
                  xTexelC${b}Ready = 1;
                }

                if(xC + 1 >= 0 && xC + 1 < inDims[1] && xTexelC${b+1}Ready == 0) {
                  xTexelC${b+1} = getX(batch, xR, xC + 1, d1);
                  // Need to manually clear unused channels in case
                  // we're reading from recycled texture.
                  if (xC + 2 >= inDims[1]) {
                    xTexelC${b+1}.zw = vec2(0.0);
                  }
                  xTexelC${b+1}Ready = 1;
                }

                xC${b} = vec4(xTexelC${b}.zw, xTexelC${b+1}.zw);
              `,b+1<h&&(p+=`
                  final = vec4(0.0);
                  xCOffset = xC + 1 + strides[1];
                  if(xCOffset >= 0 && xCOffset < inDims[1]) {
                    final = getX(batch, xR, xCOffset, d1);
                  }
                  xC${b+1} = vec4(xTexelC${b+1}.xy, final.xy);
                `)):(p+=`
                if(xC >= 0 && xC < inDims[1] && xTexelC${b}Ready == 0) {
                  xTexelC${b} = getX(batch, xR, xC, d1);
                  if (xC + 1 >= inDims[1]) {
                    xTexelC${b}.zw = vec2(0.0);
                  }
                  xTexelC${b}Ready = 1;
                }

                xCOffset = xC + strides[1];
                if(xCOffset >= 0 && xCOffset < inDims[1] && xTexelC${b+1}Ready == 0) {
                  xTexelC${b+1} = getX(batch, xR, xCOffset, d1);
                  if (xCOffset + 1 >= inDims[1]) {
                    xTexelC${b+1}.zw = vec2(0.);
                  }
                  xTexelC${b+1}Ready = 1;
                }

                xC${b} = vec4(
                  xTexelC${b}.xy, xTexelC${b+1}.xy);
              `,b+1<h&&(p+=`
                  xC${b+1} = vec4(xTexelC${b}.zw, xTexelC${b+1}.zw);
                `)));b<h&&(p+=`
            wTexel = getW(r, ${b}, d1, q);
            dotProd += xC${b} * vec4(wTexel.xz, wTexel.xz);
          `,b+1<h&&(p+=`
              wTexel = getW(r, ${b+1}, d1, q);
              dotProd += xC${b+1} * vec4(wTexel.xz, wTexel.xz);
            `))}p+=`
    }
  `,p+=`
      }
    `;let f="",m="";s&&(r?f=`vec4 activation(vec4 a) {
          vec4 b = getPreluActivationWeightsAtOutCoords();
          ${s}
        }`:o?f=`vec4 activation(vec4 a) {
          vec4 b = getLeakyreluAlphaAtOutCoords();
          ${s}
        }`:f=`vec4 activation(vec4 x) {
          ${s}
        }`,m="result = activation(result);");const g=e?"result += getBiasAtOutCoords();":"";e&&this.variableNames.push("bias"),r&&this.variableNames.push("preluActivationWeights"),o&&this.variableNames.push("leakyreluAlpha"),this.userCode=`
      ${f}

      void main() {
        ivec4 coords = getOutputCoords();
        int batch = coords.x;
        ivec2 xRCCorner = coords.yz * strides - pads;
        int d2 = coords.w;
        int d1 = d2 / ${i};
        int q = d2 - d1 * ${i};
        int xRCorner = xRCCorner.x;
        int xCCorner = xRCCorner.y;

        //intialize dotProd with a small epsilon seems to reduce GPU accuracy loss.
        vec4 dotProd = vec4(0.000000000000001);

        ${p}

        vec4 result = dotProd - vec4(0.000000000000001);
        ${g}
        ${m}
        setOutput(result);
      }
    `}}function WV(n){const{inputs:t,backend:e,attrs:s}=n,{x:r,filter:o}=t,{strides:i,pad:a,dilations:c,dimRoundingMode:l}=s;let u=c;u==null&&(u=[1,1]),S($e(i,u),()=>`Error in depthwiseConv2d: Either strides or dilations must be 1. Got strides ${i} and dilations '${u}'`);const h=ye(r.shape,o.shape,i,u,a,l,!0);let d;W().getBool("WEBGL_PACK_DEPTHWISECONV")&&h.strideWidth<=2&&h.outChannels/h.inChannels===1?d=new By(h):d=new Py(h);const p=[[h.padInfo.top,h.padInfo.left],[h.strideHeight,h.strideWidth],[h.dilationHeight,h.dilationWidth],[h.inHeight,h.inWidth]];return e.runWebGLProgram(d,[r,o],"float32",p)}const UV={kernelName:pc,backendName:"webgl",kernelFunc:WV};class GV{constructor(t){this.variableNames=["x","dy"],this.outputShape=t.filterShape;const e=t.strideHeight,s=t.strideWidth,r=t.padInfo.top,o=t.padInfo.left,i=t.outChannels/t.inChannels;this.userCode=`
      void main() {
        ivec4 coords = getOutputCoords();
        int wR = coords.x;
        int wC = coords.y;
        int d1 = coords.z;
        int dm = coords.w;
        int d2 = d1 * ${i} + dm;

        float dotProd = 0.0;

        // TO DO: Vec4 over the batch size
        for (int b = 0; b < ${t.batchSize}; b++) {
          for (int yR = 0; yR < ${t.outHeight}; yR++) {
            int xR = wR + yR * ${e} - ${r};

            if (xR < 0 || xR >= ${t.inHeight}) {
              continue;
            }

            for (int yC = 0; yC < ${t.outWidth}; yC++) {
              int xC = wC + yC * ${s} - ${o};

              if (xC < 0 || xC >= ${t.inWidth}) {
                continue;
              }

              float dyValue = getDy(b, yR, yC, d2);
              float xValue = getX(b, xR, xC, d1);
              dotProd += (xValue * dyValue);
            }
          }
        }
        setOutput(dotProd);
      }
    `}}class HV{constructor(t){this.variableNames=["dy","W"],this.outputShape=t.inShape;const e=t.filterHeight,s=t.filterWidth,r=t.strideHeight,o=t.strideWidth,i=e-1-t.padInfo.top,a=s-1-t.padInfo.left,c=t.outChannels/t.inChannels;this.userCode=`
      const ivec2 pads = ivec2(${i}, ${a});

      void main() {
        ivec4 coords = getOutputCoords();
        int batch = coords[0];
        int d1 = coords[3];
        ivec2 dyCorner = coords.yz - pads;
        int dyRCorner = dyCorner.x;
        int dyCCorner = dyCorner.y;

        float dotProd = 0.0;

        for (int wR = 0; wR < ${e}; wR++) {
          float dyR = float(dyRCorner + wR) / ${r}.0;

          if (dyR < 0.0 || dyR >= ${t.outHeight}.0 || fract(dyR) > 0.0) {
            continue;
          }
          int idyR = int(dyR);

          int wRPerm = ${e} - 1 - wR;

          for (int wC = 0; wC < ${s}; wC++) {
            float dyC = float(dyCCorner + wC) / ${o}.0;

            if (dyC < 0.0 || dyC >= ${t.outWidth}.0 ||
                fract(dyC) > 0.0) {
              continue;
            }
            int idyC = int(dyC);

            int wCPerm = ${s} - 1 - wC;

            // TO DO: Vec4 over the channelMul
            for (int dm = 0; dm < ${c}; dm++) {
              int d2 = d1 * ${c} + dm;
              float xValue = getDy(batch, idyR, idyC, d2);
              float wValue = getW(wRPerm, wCPerm, d1, dm);
              dotProd += xValue * wValue;
            }
          }
        }
        setOutput(dotProd);
      }
    `}}function qV(n){const{inputs:t,backend:e,attrs:s}=n,{x:r,dy:o}=t,{strides:i,dilations:a,pad:c,dimRoundingMode:l,filterShape:u}=s,h=ye(r.shape,u,i,a,c,l,!0),d=new GV(h);return e.runWebGLProgram(d,[r,o],"float32")}const KV={kernelName:ih,backendName:"webgl",kernelFunc:qV};function jV(n){const{inputs:t,backend:e,attrs:s}=n,{dy:r,filter:o}=t,{strides:i,dilations:a,pad:c,dimRoundingMode:l,inputShape:u}=s,h=ye(u,o.shape,i,a,c,l,!0),d=new HV(h);return e.runWebGLProgram(d,[r,o],"float32")}const XV={kernelName:ah,backendName:"webgl",kernelFunc:jV};class YV{constructor(t){this.variableNames=["X"],this.outputShape=[t,t],this.userCode=`
      void main() {
          ivec2 coords = getOutputCoords();
          float val = coords[0] == coords[1] ? getX(coords[0]) : 0.0;
          setOutput(val);
      }
    `}}function ZV(n){const{inputs:t,backend:e}=n,{x:s}=t,r=[...s.shape,...s.shape],o=q(s.shape),i=et({inputs:{x:s},backend:e,attrs:{shape:[o]}}),a=new YV(o),c=e.runWebGLProgram(a,[i],i.dtype),l=et({inputs:{x:c},backend:e,attrs:{shape:r}});return e.disposeIntermediateTensorInfo(i),e.disposeIntermediateTensorInfo(c),l}const JV={kernelName:Ym,backendName:"webgl",kernelFunc:ZV};class QV{constructor(t){this.variableNames=["x","W"],this.outputShape=t.outShape;const{inHeight:e,inWidth:s,padInfo:r,strideHeight:o,strideWidth:i,filterHeight:a,filterWidth:c,dilationHeight:l,dilationWidth:u}=t,{top:h,left:d}=r;this.userCode=`
      const ivec2 strides = ivec2(${o}, ${i});
      const ivec2 pads = ivec2(${h}, ${d});
      const float neg_infinity = -3.4e38;

      void main() {
        ivec4 coords = getOutputCoords();
        int batch = coords.x;
        int d1 = coords.w;
        ivec2 outTopLeftCorner =
            coords.yz * strides - pads;
        int hBeg = outTopLeftCorner.x;
        int wBeg = outTopLeftCorner.y;

        float curVal = neg_infinity;
        for (int h = 0; h < ${a}; h++) {
          int hIn = hBeg + h * ${l};

          if (hIn >= 0 && hIn < ${e}) {
            for (int w = 0; w < ${c}; w++) {
              int wIn = wBeg + w * ${u};

              if (wIn >= 0 && wIn < ${s}) {
                float xVal = getX(batch, hIn, wIn, d1);
                float wVal = getW(h, w, d1);

                float val = xVal + wVal;
                if (val > curVal) {
                  curVal = val;
                }
              }
            }
          }
        }

        float result = curVal;
        setOutput(result);
      }
    `}}function t4(n){const{inputs:t,backend:e,attrs:s}=n,{x:r,filter:o}=t,{strides:i,pad:a,dilations:c}=s,l=Ni(r.shape,o.shape,i,a,"NHWC",c);let u;const h=new QV(l);u=e.runWebGLProgram(h,[r,o],"float32");const d=et({inputs:{x:u},backend:e,attrs:{shape:l.outShape}});return e.disposeIntermediateTensorInfo(u),d}const e4={kernelName:fc,backendName:"webgl",kernelFunc:t4};function n4(n){const{inputs:t,backend:e,attrs:s}=n,{equation:r}=s,o=t,{allDims:i,summedDims:a,idDims:c}=Wd(r,o.length);Gd(i.length,c,o);const{path:l,steps:u}=Hd(a,c),h=u.length;let d=null,p=i.length;const f=[];for(let m=0;m<h;++m){for(const g of u[m]){const{permutationIndices:x,expandDims:b}=Ud(p,c[g]);let w;qd(x)?w=o[g]:(w=Re({inputs:{x:o[g]},backend:e,attrs:{perm:x}}),f.push(w));const y=w.shape.slice();for(let I=0;I<b.length;++I)y.splice(b[I],0,1);Tt(w.shape,y)||(w=et({inputs:{x:w},backend:e,attrs:{shape:y}}),f.push(w)),d===null?d=w:(d=Fp({inputs:{a:w,b:d},backend:e}),f.push(d))}m<h-1&&(l[m]>=0&&(d=Rl({inputs:{x:d},backend:e,attrs:{axis:l[m]-(i.length-p),keepDims:!1}}),f.push(d)),p--)}for(const m of f)m!==d&&e.disposeIntermediateTensorInfo(m);return d}const s4={kernelName:Zm,backendName:"webgl",kernelFunc:n4};const r4="return (x >= 0.0) ? x : (exp(x) - 1.0);",o4=`
  vec4 result;

  result.r = (x.r >= 0.0) ? x.r : (exp(x.r) - 1.0);
  result.g = (x.g >= 0.0) ? x.g : (exp(x.g) - 1.0);
  result.b = (x.b >= 0.0) ? x.b : (exp(x.b) - 1.0);
  result.a = (x.a >= 0.0) ? x.a : (exp(x.a) - 1.0);

  return result;
`,i4=St({opSnippet:r4,packedOpSnippet:o4}),a4={kernelName:Go,backendName:"webgl",kernelFunc:i4};const c4="return (b >= 1.0) ? a : a * (b + 1.0);",l4=`
  vec4 bGTEZero = vec4(greaterThanEqual(b, vec4(0.)));
  return (bGTEZero * a) + ((vec4(1.0) - bGTEZero) * (a * (b + vec4(1.0))));
`,u4=n=>{const{inputs:t,backend:e}=n,{dy:s,y:r}=t,o=W().getBool("WEBGL_PACK_BINARY_OPERATIONS")?new Xi(l4,s.shape,r.shape):new Mr(c4,s.shape,r.shape);return e.runWebGLProgram(o,[s,r],s.dtype)},h4={kernelName:ch,backendName:"webgl",kernelFunc:u4};const d4=`
  return vec4(equal(a, b));
`,p4="return float(a == b);",f4=Ie({opSnippet:p4,packedOpSnippet:d4,dtype:"bool",cpuKernelImpl:t3}),m4={kernelName:mc,backendName:"webgl",kernelFunc:f4};const g4=`
  // Error function is calculated approximately with elementary function.
  // See "Handbook of Mathematical Functions with Formulas,
  // Graphs, and Mathematical Tables", Abramowitz and Stegun.
  float p = ${_d};
  float a1 = ${Md};
  float a2 = ${Ld};
  float a3 = ${Pd};
  float a4 = ${Bd};
  float a5 = ${zd};

  float sign = sign(x);
  x = abs(x);
  float t = 1.0 / (1.0 + p * x);
  return sign * (1.0 - (((((a5*t + a4)*t) + a3)*t + a2)*t + a1)*t*exp(-x*x));
`,x4=St({opSnippet:g4}),b4={kernelName:Ho,backendName:"webgl",kernelFunc:x4};const y4=Zr+`
  return exp(x);
`,w4=`
  vec4 result = exp(x);
  bvec4 isNaN = isnan(x);
  result.r = isNaN.r ? x.r : result.r;
  result.g = isNaN.g ? x.g : result.g;
  result.b = isNaN.b ? x.b : result.b;
  result.a = isNaN.a ? x.a : result.a;

  return result;
`,zy=St({opSnippet:y4,packedOpSnippet:w4,cpuKernelImpl:e3,dtype:"float32"}),I4={kernelName:qo,backendName:"webgl",kernelFunc:zy};function Vu(n){const{inputs:t,attrs:e,backend:s}=n,{dim:r}=e,{input:o}=t,i=o.shape.length,a=o.shape.slice();let c=r;return r<0&&(S(-(i+1)<=r,()=>`Axis must be in the interval [${-(i+1)}, ${i}]`),c=i+r+1),a.splice(c,0,1),et({inputs:{x:o},backend:s,attrs:{shape:a}})}const v4={kernelName:gc,backendName:"webgl",kernelFunc:Vu};const fm="return exp(x) - 1.0;",C4=St({opSnippet:fm,packedOpSnippet:fm,cpuKernelImpl:n3}),k4={kernelName:Ko,backendName:"webgl",kernelFunc:C4};class mm{constructor(t,e,s){this.variableNames=["real","imag"];const r=e[1];this.outputShape=e;const o=s?`2.0 * ${Math.PI}`:`-2.0 * ${Math.PI}`,i=s?`${r}.0`:"1.0";let a;if(t==="real")a="return real * expR - imag * expI;";else if(t==="imag")a="return real * expI + imag * expR;";else throw new Error(`FFT component must be either "real" or "imag", got ${t}.`);this.userCode=`
      const float exponentMultiplier = ${o};

      float unaryOpComplex(float real, float expR, float imag, float expI) {
        ${a}
      }

      float mulMatDFT(int batch, int index) {
        float indexRatio = float(index) / float(${r});
        float exponentMultiplierTimesIndexRatio =
            exponentMultiplier * indexRatio;

        float result = 0.0;

        for (int i = 0; i < ${r}; i++) {
          // x = (-2|2 * PI / N) * index * i;
          float x = exponentMultiplierTimesIndexRatio * float(i);
          float expR = cos(x);
          float expI = sin(x);
          float real = getReal(batch, i);
          float imag = getImag(batch, i);

          result +=
              unaryOpComplex(real, expR, imag, expI) / ${i};
        }

        return result;
      }

      void main() {
        ivec2 coords = getOutputCoords();
        setOutput(mulMatDFT(coords[0], coords[1]));
      }
    `}}function Vy(n,t,e){const s=e.texData.get(n.dataId),r=q(n.shape),o=n.shape[n.shape.length-1],i=r/o,a=et({inputs:{x:n},backend:e,attrs:{shape:[i,o]}}),c=a.shape,l=new mm("real",c,t),u=new mm("imag",c,t),h=[{dataId:s.complexTensorInfos.real.dataId,dtype:s.complexTensorInfos.real.dtype,shape:c},{dataId:s.complexTensorInfos.imag.dataId,dtype:s.complexTensorInfos.imag.dtype,shape:c}],d=e.runWebGLProgram(l,h,"float32"),p=e.runWebGLProgram(u,h,"float32"),f=$s({inputs:{real:d,imag:p},backend:e});e.disposeIntermediateTensorInfo(d),e.disposeIntermediateTensorInfo(p);const m=et({inputs:{x:f},backend:e,attrs:{shape:n.shape}});return e.disposeIntermediateTensorInfo(a),e.disposeIntermediateTensorInfo(f),m}function $4(n){const{inputs:t,backend:e}=n,{input:s}=t;return Vy(s,!1,e)}const S4={kernelName:lh,backendName:"webgl",kernelFunc:$4};class N4{constructor(t,e){this.outputShape=[],this.customUniforms=[{name:"value",type:"float"}],this.variableNames=["x"],this.outputShape=t,this.userCode=`
      void main() {
        // Input can be obtained from uniform value.
        setOutput(value);
      }
    `}}function Zi(n){const{backend:t,attrs:e}=n,{shape:s,value:r}=e;let{dtype:o}=e;if(o=o||Ro(r),o==="string"){const i=de(o,q(s));return i.fill(r),t.makeTensorInfo(s,o,i)}else{const i=new N4(s,r),a=[[r]];return t.runWebGLProgram(i,[],o,a)}}const T4={kernelName:uh,backendName:"webgl",kernelFunc:Zi};class E4{constructor(t){this.variableNames=["Image"],this.outputShape=[];const e=t[2];this.outputShape=t,this.userCode=`
        void main() {
          ivec4 coords = getOutputCoords();
          int x = coords[2];

          int coordX = ${e} - x - 1;
          float outputValue;
          if(coordX >= 0 && coordX < ${e}) {
            outputValue = getImage(coords[0], coords[1], coordX, coords[3]);
          } else {
            outputValue = getImage(coords[0], coords[1], coords[2], coords[3]);
          }
          setOutput(outputValue);
        }
    `}}const R4={kernelName:hh,backendName:"webgl",kernelFunc:({inputs:n,backend:t})=>{const{image:e}=n,s=t,r=new E4(e.shape);return s.runWebGLProgram(r,[e],e.dtype)}};const gm="return floor(x);",D4=St({opSnippet:gm,packedOpSnippet:gm,cpuKernelImpl:s3}),A4={kernelName:jo,backendName:"webgl",kernelFunc:D4};const F4=`
  float s = sign(a) * sign(b);
  int ia = round(a);
  int ib = round(b);
  if (ib != 0) {
    // Windows (D3D) wants guaranteed non-zero int division at compile-time.
    return float(idiv(ia, ib, s));
  } else {
    return NAN;
  }
`,O4=`
  ivec4 ia = round(a);
  ivec4 ib = round(b);
  bvec4 cond = notEqual(ib, ivec4(0));
  ivec4 result = ivec4(0);
  vec4 s = sign(a) * sign(b);

  // Windows (D3D) wants guaranteed non-zero int division at compile-time.
  if (cond[0]) {
    result[0] = idiv(ia[0], ib[0], s[0]);
  }
  if (cond[1]) {
    result[1] = idiv(ia[1], ib[1], s[1]);
  }
  if (cond[2]) {
    result[2] = idiv(ia[2], ib[2], s[2]);
  }
  if (cond[3]) {
    result[3] = idiv(ia[3], ib[3], s[3]);
  }
  return vec4(result);
`,_4=Ie({opSnippet:F4,packedOpSnippet:O4,dtype:"int32"}),M4={kernelName:Xo,backendName:"webgl",kernelFunc:_4};class L4{constructor(t){this.variableNames=["A"];const e=De(),[s,r]=t;this.outputShape=t,this.userCode=`
      void main() {
        ivec3 coords = getOutputCoords();
        int texR = coords[0];
        int texC = coords[1];
        int depth = coords[2];
        vec2 uv = (vec2(texC, texR) + halfCR) / vec2(${r}.0, ${s}.0);

        vec4 values = ${e.texture2D}(A, uv);
        float value;
        if (depth == 0) {
          value = values.r;
        } else if (depth == 1) {
          value = values.g;
        } else if (depth == 2) {
          value = values.b;
        } else if (depth == 3) {
          value = values.a;
        }

        setOutput(floor(value * 255.0 + 0.5));
      }
    `}}class P4{constructor(t){this.variableNames=["A"],this.packedInputs=!1,this.packedOutput=!0;const e=De(),[s,r]=t;this.outputShape=t,this.userCode=`
      void main() {
        ivec3 coords = getOutputCoords();
        int texR = coords[0];
        int texC = coords[1];
        int depth = coords[2];

        vec4 result = vec4(0.);

        for(int row=0; row<=1; row++) {
          for(int col=0; col<=1; col++) {
            texC = coords[1] + row;
            depth = coords[2] + col;

            vec2 uv = (vec2(texC, texR) + halfCR) /
                       vec2(${r}.0, ${s}.0);
            vec4 values = ${e.texture2D}(A, uv);
            float value;
            if (depth == 0) {
              value = values.r;
            } else if (depth == 1) {
              value = values.g;
            } else if (depth == 2) {
              value = values.b;
            } else if (depth == 3) {
              value = values.a;
            }

            result[row * 2 + col] = floor(value * 255.0 + 0.5);
          }
        }

        ${e.output} = result;
      }
    `}}const B4={kernelName:Hw,backendName:"webgl",kernelFunc:z4};let dr,Jl=W().getBool("CANVAS2D_WILL_READ_FREQUENTLY_FOR_GPU");function z4(n){const{inputs:t,backend:e,attrs:s}=n;let{pixels:r}=t;const{numChannels:o}=s,i=typeof HTMLVideoElement<"u"&&r instanceof HTMLVideoElement,a=typeof HTMLImageElement<"u"&&r instanceof HTMLImageElement,[c,l]=i?[r.videoWidth,r.videoHeight]:[r.width,r.height],u=[l,c],h=[l,c,o];if(a||i){const m=W().getBool("CANVAS2D_WILL_READ_FREQUENTLY_FOR_GPU");(dr==null||m!==Jl)&&(Jl=m,dr=document.createElement("canvas").getContext("2d",{willReadFrequently:Jl})),dr.canvas.width=c,dr.canvas.height=l,dr.drawImage(r,0,0,c,l),r=dr.canvas}const d=e.makeTensorInfo(u,"int32");e.texData.get(d.dataId).usage=Xe.PIXELS,e.gpgpu.uploadPixelDataToTexture(e.getTexture(d.dataId),r);const p=W().getBool("WEBGL_PACK")?new P4(h):new L4(h),f=e.runWebGLProgram(p,[d],"int32");return e.disposeData(d.dataId),f}function V4(n){const{inputs:t,backend:e,attrs:s}=n,{x:r,filter:o,bias:i,preluActivationWeights:a}=t,{strides:c,pad:l,dataFormat:u,dilations:h,dimRoundingMode:d,activation:p,leakyreluAlpha:f}=s,m=Xn(u),g=ye(r.shape,o.shape,c,h,l,d,!1,m);let x;const b=[],w=i!=null,y=a!=null,I=p==="leakyrelu",C=()=>{const T=[r,o],$=(k,v)=>{if(v==="NCHW"&&k.shape.length===1&&k.shape[0]!==1){const R=et({inputs:{x:k},backend:e,attrs:{shape:[k.shape[0],1,1]}});return b.push(R),R}return k};if(w&&T.push($(i,u)),y&&T.push($(a,u)),I){const k=e.makeTensorInfo([],"float32",xs(f,"float32"));T.push(k),b.push(k)}return T};if(g.filterHeight===1&&g.filterWidth===1&&g.dilationHeight===1&&g.dilationWidth===1&&g.strideHeight===1&&g.strideWidth===1&&(g.padInfo.type==="SAME"||g.padInfo.type==="VALID"))x=_y({x:r,filter:o,convInfo:g,backend:e,bias:i,activation:p,preluActivationWeights:a,leakyreluAlpha:f});else if(g.strideWidth<=2&&m==="channelsLast"&&W().getBool("WEBGL_EXP_CONV")){const T=p?So(p,!0):null,$=new Oy(g,w,T,y,I),k=[[g.padInfo.top,g.padInfo.left],[g.strideHeight,g.strideWidth],[g.dilationHeight,g.dilationWidth],[g.inHeight,g.inWidth]],v=C();x=e.runWebGLProgram($,v,"float32",k)}else if(W().getBool("WEBGL_CONV_IM2COL"))x=My({x:r,filter:o,convInfo:g,backend:e,bias:i,activation:p,preluActivationWeights:a,leakyreluAlpha:f});else{const T=p?So(p,!1):null,$=new Fy(g,w,T,y,I),k=C();x=e.runWebGLProgram($,k,"float32")}const N=et({inputs:{x},backend:e,attrs:{shape:g.outShape}});return b.push(x),b.forEach(T=>e.disposeIntermediateTensorInfo(T)),N}const W4={kernelName:Na,backendName:"webgl",kernelFunc:V4};function U4(n){const{inputs:t,backend:e,attrs:s}=n,{x:r,filter:o,bias:i,preluActivationWeights:a}=t,{strides:c,pad:l,dilations:u,dimRoundingMode:h,activation:d,leakyreluAlpha:p}=s,f=[];let m=u;m==null&&(m=[1,1]),S($e(c,m),()=>`Error in depthwiseConv2d: Either strides or dilations must be 1. Got strides ${c} and dilations '${m}'`);const g=ye(r.shape,o.shape,c,m,l,h,!0),x=W().getBool("WEBGL_PACK_DEPTHWISECONV")&&g.strideWidth<=2&&g.outChannels/g.inChannels===1,b=d?So(d,x):null,w=[r,o],y=i!=null,I=a!=null,C=d==="leakyrelu";if(y&&w.push(i),I&&w.push(a),C){const k=e.makeTensorInfo([],"float32",xs(p,"float32"));w.push(k),f.push(k)}let N;x?N=new By(g,y,b,I,C):N=new Py(g,y,b,I,C);const T=[[g.padInfo.top,g.padInfo.left],[g.strideHeight,g.strideWidth],[g.dilationHeight,g.dilationWidth],[g.inHeight,g.inWidth]],$=e.runWebGLProgram(N,w,"float32",T);return f.forEach(k=>e.disposeIntermediateTensorInfo(k)),$}const G4={kernelName:ag,backendName:"webgl",kernelFunc:U4};class H4{constructor(t,e,s,r){this.sliceDim=t,this.strides=e,this.paramsShape=r,this.variableNames=["x","indices"],this.outputShape=s;const o=Bt(s.length);let i=`
    int index;`;for(let a=0;a<this.sliceDim;a++)i+=`
          index = round(getIndices(coords[0], ${a}));
          out_of_bounds = out_of_bounds || index < 0;
          out_of_bounds = out_of_bounds || index >= ${this.paramsShape[a]};
          flattenIndex += index * ${this.strides[a]};`;this.userCode=`
         void main() {
          ${o} coords = getOutputCoords();
          int flattenIndex = 0;
          bool out_of_bounds = false;

          ${i}

          setOutput(out_of_bounds ? 0.0 : getX(flattenIndex, coords[1]));
        }
      `}}function q4(n){const{inputs:t,backend:e}=n,{params:s,indices:r}=t,o=r.shape,i=o[o.length-1],a=q(s.shape),[c,l,u,h]=zh(s,r),d=et({inputs:{x:r},backend:e,attrs:{shape:[l,i]}}),p=et({inputs:{x:s},backend:e,attrs:{shape:[q(s.shape)/u,u]}});if(e.shouldExecuteOnCPU([s,r])||s.dtype==="string"){const x=e.readSync(r.dataId),b=e.bufferSync(s),w=r3(x,b,s.dtype,l,i,u,h,s.shape,a);return e.makeTensorInfo(c,s.dtype,w.values)}const f=new H4(i,h,[l,u],s.shape),m=e.runWebGLProgram(f,[p,d],p.dtype),g=et({inputs:{x:m},backend:e,attrs:{shape:c}});return e.disposeIntermediateTensorInfo(d),e.disposeIntermediateTensorInfo(p),e.disposeIntermediateTensorInfo(m),g}const K4={kernelName:Jm,backendName:"webgl",kernelFunc:q4};class j4{constructor(t,e){this.variableNames=["A","indices"],this.outputShape=e,this.rank=e.length;const s=Bt(this.rank),r=X4(t);this.userCode=`
      void main() {
        ${s} resRC = getOutputCoords();
        int index = int(getIndices(resRC.x, resRC.z));
        float inBounds = (index >= 0) && (index < ${t[2]}) ? 1.0 : 0.0;
        setOutput(inBounds * getA(${r}));
      }
    `}}function X4(n,t){const e=["resRC.x","resRC.y","resRC.z","resRC.w"],s=[];for(let r=0;r<n.length;r++)r===2?s.push("index"):s.push(`${e[r]}`);return s.join()}function Wy(n){const{inputs:t,backend:e,attrs:s}=n,{x:r,indices:o}=t,{axis:i,batchDims:a}=s,c=wt(i,r.shape)[0];if(W().get("DEBUG")){const b=e.readSync(o.dataId),w=r.shape[c];for(let y=0;y<b.length;++y){const I=b[y];S(I<=w-1&&I>=0,()=>`GatherV2: the index value ${I} is not in [0, ${w-1}]`)}}const l=jd(r,o,c,a),u=q(o.shape),h=[],d=et({inputs:{x:r},backend:e,attrs:{shape:[l.batchSize,l.outerSize,l.dimSize,l.sliceSize]}}),p=et({inputs:{x:o},backend:e,attrs:{shape:[l.batchSize,u/l.batchSize]}});h.push(d),h.push(p);const f=[l.batchSize,l.outerSize,u/l.batchSize,l.sliceSize];if(e.shouldExecuteOnCPU([r,o])||r.dtype==="string"){const b=e.bufferSync(p),w=e.bufferSync(d),y=o3(w,b,f);return h.forEach(I=>e.disposeIntermediateTensorInfo(I)),e.makeTensorInfo(l.outputShape,y.dtype,y.values)}const m=new j4(d.shape,f),g=e.runWebGLProgram(m,[d,p],d.dtype);h.push(g);const x=et({inputs:{x:g},backend:e,attrs:{shape:l.outputShape}});return h.forEach(b=>e.disposeIntermediateTensorInfo(b)),x}const Y4={kernelName:bc,backendName:"webgl",kernelFunc:Wy};const Z4="return float(a > b);",J4=`
  return vec4(greaterThan(a, b));
`,Q4=Ie({opSnippet:Z4,packedOpSnippet:J4,cpuKernelImpl:i3,dtype:"bool"}),tW={kernelName:yc,backendName:"webgl",kernelFunc:Q4};const eW="return float(a >= b);",nW=`
  return vec4(greaterThanEqual(a, b));
`,sW=Ie({opSnippet:eW,packedOpSnippet:nW,dtype:"bool",cpuKernelImpl:a3}),rW={kernelName:Yo,backendName:"webgl",kernelFunc:sW};function oW(n){const{inputs:t,backend:e}=n,{input:s}=t;return Vy(s,!0,e)}const iW={kernelName:dh,backendName:"webgl",kernelFunc:oW};const aW="return float(!isnan(x) && !isinf(x));",cW=St({opSnippet:aW,dtype:"bool"}),lW={kernelName:Jo,backendName:"webgl",kernelFunc:cW};const uW="return float(isinf(x));",hW=St({opSnippet:uW,dtype:"bool"}),dW={kernelName:Qo,backendName:"webgl",kernelFunc:hW};const pW="return float(isnan(x));",fW=St({opSnippet:pW,dtype:"bool"}),mW={kernelName:ti,backendName:"webgl",kernelFunc:fW};const gW="return float(a < b);",xW=`
  return vec4(lessThan(a, b));
`,bW=Ie({opSnippet:gW,packedOpSnippet:xW,cpuKernelImpl:c3,dtype:"bool"}),yW={kernelName:Ic,backendName:"webgl",kernelFunc:bW};const wW="return float(a <= b);",IW=`
  return vec4(lessThanEqual(a, b));
`,vW=Ie({opSnippet:wW,packedOpSnippet:IW,cpuKernelImpl:l3,dtype:"bool"}),CW={kernelName:vc,backendName:"webgl",kernelFunc:vW};function kW(n){const{backend:t,attrs:e}=n,{start:s,stop:r,num:o}=e,i=u3(s,r,o);return t.makeTensorInfo([i.length],"float32",i)}const $W={kernelName:Qm,backendName:"webgl",kernelFunc:kW};const SW=Zr+`
  return x < 0.0 ? 0./0. : log(x);
`,NW=`
  vec4 result = log(x);
  bvec4 isNaN = isnan(x);
  result.r = isNaN.r ? x.r : (x.r < 0.0 ? 0./0. : result.r);
  result.g = isNaN.g ? x.g : (x.g < 0.0 ? 0./0. : result.g);
  result.b = isNaN.b ? x.b : (x.b < 0.0 ? 0./0. : result.b);
  result.a = isNaN.a ? x.a : (x.a < 0.0 ? 0./0. : result.a);
  return result;
`,TW=St({opSnippet:SW,packedOpSnippet:NW,cpuKernelImpl:h3}),EW={kernelName:ei,backendName:"webgl",kernelFunc:TW};const RW=Zr+`
  return log(1.0 + x);
`,DW=St({opSnippet:RW}),AW={kernelName:ni,backendName:"webgl",kernelFunc:DW};const FW="return float(a >= 1.0 && b >= 1.0);",OW=`
  return vec4(
    vec4(greaterThanEqual(a, vec4(1.0))) *
    vec4(greaterThanEqual(b, vec4(1.0))));
`,_W=Ie({opSnippet:FW,packedOpSnippet:OW,dtype:"bool"}),MW={kernelName:Cc,backendName:"webgl",kernelFunc:_W};const LW="return float(!(x >= 1.0));",PW=St({opSnippet:LW}),BW={kernelName:kc,backendName:"webgl",kernelFunc:PW};const zW="return float(a >= 1.0 || b >= 1.0);",VW=`
  return min(
    vec4(greaterThanEqual(a, vec4(1.0))) +
    vec4(greaterThanEqual(b, vec4(1.0))),
    vec4(1.0));
`,WW=Ie({opSnippet:zW,packedOpSnippet:VW,dtype:"bool"}),UW={kernelName:$c,backendName:"webgl",kernelFunc:WW};class GW{constructor(t,e,s,r,o){this.variableNames=["x"],this.outputShape=[];const i=e,a=t[3]-1;this.outputShape=t;let c;const l=`float(${s}) + float(${r}) * sum`;o===.5?c=`inversesqrt(${l})`:o===1?c=`1.0/(${l})`:c=`exp(log(${l}) * float(-${o}));`,this.userCode=`
      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int r = coords[1];
        int c = coords[2];
        int d = coords[3];
        float x = getX(b, r, c, d);
        float sum = 0.0;
        for (int j = -${i}; j <= ${i}; j++) {
          int idx = d + j;
          if (idx >= 0 && idx <=  ${a}) {
            float z = getX(b, r, c, idx);
            sum += z * z;
          }
        }
        float val = x * ${c};
        setOutput(val);
      }
    `}}class HW{constructor(t,e,s,r,o){this.variableNames=["x"],this.outputShape=[],this.packedInputs=!0,this.packedOutput=!0;const i=e,a=t[3]-1;this.outputShape=t;let c;const l=`float(${s}) + float(${r}) * sum`;o===.5?c=`inversesqrt(${l})`:o===1?c=`1.0/(${l})`:c=`exp(log(${l}) * float(-${o}));`,this.userCode=`
      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords.x;
        int r = coords.y;
        int c = coords.z;
        int d = coords.w;

        bool hasNextCol = d < ${this.outputShape[3]};
        bool hasNextRow = c < ${this.outputShape[2]};

        vec4 sum = vec4(0.);
        vec4 xFragAtOutputCoords = getX(b, r, c, d);

        vec4 xAtOutputCoords = vec4(
          getChannel(xFragAtOutputCoords, vec2(c, d)),
          hasNextCol ?
            getChannel(xFragAtOutputCoords, vec2(c, d + 1)) : 0.0,
          hasNextRow ?
            getChannel(xFragAtOutputCoords , vec2(c + 1, d)) : 0.0,
          (hasNextRow && hasNextCol) ?
            getChannel(xFragAtOutputCoords, vec2(c + 1, d + 1)) : 0.0
        );

        int firstChannel = d - ${i};
        vec2 cache = vec2(0.);
        if(firstChannel >= 0){
          vec4 firstChannelFrag = getX(b, r, c, firstChannel);
          cache.x = getChannel(firstChannelFrag, vec2(c, firstChannel));
            if(hasNextRow){
              cache.y = getChannel(firstChannelFrag, vec2(c + 1, firstChannel));
            }
        }

        ivec2 depth = ivec2(d, d + 1);
        for (int j = - ${i}; j <= ${i}; j++) {
          ivec2 idx = depth + j;
          bvec2 aboveLowerBound = greaterThanEqual(idx, ivec2(0));
          bvec2 belowUpperBound = lessThanEqual(idx, ivec2(${a}));

          bool depthInRange = aboveLowerBound.x && belowUpperBound.x;
          bool depthPlusOneInRange = aboveLowerBound.y && belowUpperBound.y;

          if(depthInRange || depthPlusOneInRange){
            vec4 z = vec4(0.);
            vec4 xFragAtCurrentDepth;
            z.xz = cache.xy;
            if(depthPlusOneInRange && hasNextCol){
              xFragAtCurrentDepth = idx.y != d ?
                getX(b, r, c, idx.y) : xFragAtOutputCoords;
              z.y = getChannel(xFragAtCurrentDepth, vec2(c, idx.y));
              if(hasNextRow){
                z.w = getChannel(xFragAtCurrentDepth, vec2(c + 1, idx.y));
              }
            }
            cache.xy = z.yw;
            sum += z * z;
          }
        }
        vec4 result = xAtOutputCoords * ${c};
        setOutput(result);
      }
    `}}const qW=n=>{const{inputs:t,backend:e,attrs:s}=n,{x:r}=t,{depthRadius:o,bias:i,alpha:a,beta:c}=s,l=W().getBool("WEBGL_PACK_NORMALIZATION")?new HW(r.shape,o,i,a,c):new GW(r.shape,o,i,a,c);return e.runWebGLProgram(l,[r],r.dtype)},KW={kernelName:Sc,backendName:"webgl",kernelFunc:qW};class jW{constructor(t,e,s,r,o){this.variableNames=["inputImage","outputImage","dy"],this.outputShape=[],this.outputShape=t,this.depth=t[3],this.depthRadius=e,this.bias=s,this.alpha=r,this.beta=o,this.userCode=`
      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int r = coords[1];
        int c = coords[2];

        float result = 0.0;
        for (int d = 0; d < ${this.depth}; ++d) {
          int depthBegin = int(max(0.0, float(d - ${e})));
          int depthEnd = int(min(float(${this.depth}),
              float(d + ${e} + 1)));

          const int MIN_DEPTH_BEGIN = 0;
          const int MAX_DEPTH_END = ${this.depth};

          float norm = 0.0;
          for (int k = MIN_DEPTH_BEGIN; k < MAX_DEPTH_END; ++k) {
            if (k < depthBegin){
              continue;
            }
            else if (k >= depthBegin && k < depthEnd) {
              norm += getInputImage(b, r, c, k) * getInputImage(b, r, c, k);
            }
            else {
              break;
            }
          }

          norm = float(${r}) * norm + float(${s});

          for(int k = MIN_DEPTH_BEGIN; k < MAX_DEPTH_END; ++k){
            if (k < depthBegin){
              continue;
            }
            else if (k >= depthBegin && k < depthEnd){
              float dyi = -2.0 * float(${r})
                * float(${o})
                * getInputImage(b ,r ,c, k) * getOutputImage(b, r, c, d)
                / norm;
              if (k == d) {
                dyi += pow(norm, -1.0 * ${o});
              }
              if (k == coords[3]) {
                dyi *= getDy(b, r, c, d);
                result += dyi;
              }
            }
            else {
              break;
            }
          }
      }
      setOutput(result);
      }
    `}}const XW=n=>{const{inputs:t,backend:e,attrs:s}=n,{x:r,y:o,dy:i}=t,{depthRadius:a,bias:c,alpha:l,beta:u}=s,h=new jW(r.shape,a,c,l,u);return e.runWebGLProgram(h,[r,o,i],r.dtype)},YW={kernelName:fh,backendName:"webgl",kernelFunc:XW};function ZW(n,t,e,s){const r=q(t),i=q(n.shape)/r,a=et({inputs:{x:n},attrs:{shape:[i,r]},backend:s}),c=cr(a,n.dtype,"max",s),l=et({inputs:{x:c},attrs:{shape:e},backend:s});return s.disposeIntermediateTensorInfo(a),s.disposeIntermediateTensorInfo(c),l}function Uy(n){const{inputs:t,backend:e,attrs:s}=n,{x:r}=t,{reductionIndices:o,keepDims:i}=s,a=r.shape.length,c=wt(o,r.shape);let l=c;const u=Kt(l,a),h=u!=null,d=e.shouldExecuteOnCPU([r]);let p=r;if(h){if(d){const w=e.texData.get(p.dataId).values,y=new Array(a);for(let N=0;N<y.length;N++)y[N]=r.shape[u[N]];const I=Dp(w,r.shape,r.dtype,u,y);p=e.makeTensorInfo(y,r.dtype);const C=e.texData.get(p.dataId);C.values=I}else p=El(r,u,e);l=Qt(l.length,a)}we("max",l,a);const[f,m]=fe(p.shape,l);let g=f;i&&(g=Jt(f,c));let x;if(d){const w=e.texData.get(p.dataId).values,y=d3(w,q(m),g,r.dtype);x=e.makeTensorInfo(g,r.dtype);const I=e.texData.get(x.dataId);I.values=y}else x=ZW(p,m,g,e);return h&&e.disposeIntermediateTensorInfo(p),x}const JW={kernelName:Nc,backendName:"webgl",kernelFunc:Uy};const QW=Ap+`
  return max(a, b);
`,tU=`
  vec4 result = vec4(max(a, b));
  bvec4 isNaNA = isnan(a);
  bvec4 isNaNB = isnan(b);
  bvec4 isNaN = bvec4(isNaNA.x || isNaNB.x, isNaNA.y || isNaNB.y, isNaNA.z || isNaNB.z, isNaNA.w || isNaNB.w);
  `+ji+`
  return result;
`,eU=Ie({opSnippet:QW,packedOpSnippet:tU,cpuKernelImpl:p3}),nU={kernelName:si,backendName:"webgl",kernelFunc:eU};function sU(n){const{inputs:t,backend:e,attrs:s}=n,{x:r}=t;qi(r,"maxPool");const{filterSize:o,strides:i,pad:a,dimRoundingMode:c}=s,l=1;S($e(i,l),()=>`Error in maxPool: Either strides or dilations must be 1. Got strides ${i} and dilations '${l}'`);const u=hn(r.shape,o,i,l,a,c);if(u.filterWidth===1&&u.filterHeight===1&&Tt(u.inShape,u.outShape))return He({inputs:{x:r},backend:e});const h=new No(u,"max",!1);return e.runWebGLProgram(h,[r],r.dtype)}const rU={kernelName:Tc,backendName:"webgl",kernelFunc:sU};function oU(n){const{inputs:t,backend:e,attrs:s}=n,{x:r}=t,{filterSize:o,strides:i,pad:a,dataFormat:c,dimRoundingMode:l}=s,u=[1,1,1],h=jn(r.shape,o,i,u,a,l,c),d=new Op(h,"max",!1);return e.runWebGLProgram(d,[r],r.dtype)}const iU={kernelName:Ec,backendName:"webgl",kernelFunc:oU};class aU{constructor(t){this.variableNames=["dy","maxPos"],this.outputShape=t.inShape;const e=t.strideHeight,s=t.strideWidth,r=t.dilationHeight,o=t.effectiveFilterHeight,i=t.effectiveFilterWidth,a=o-1-t.padInfo.top,c=i-1-t.padInfo.left,l=o*i-1;this.userCode=`
      const ivec2 pads = ivec2(${a}, ${c});

      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int d = coords[3];

        ivec2 dyRCCorner = coords.yz - pads;
        int dyRCorner = dyRCCorner.x;
        int dyCCorner = dyRCCorner.y;

        // Convolve dy(?, ?, d) with pos mask(:, :, d) to get dx(xR, xC, d).
        // ? = to be determined. : = across all values in that axis.
        float dotProd = 0.0;
        for (int wR = 0; wR < ${o};
          wR += ${r}) {
          float dyR = float(dyRCorner + wR) / ${e}.0;

          if (dyR < 0.0 || dyR >= ${t.outHeight}.0 || fract(dyR) > 0.0) {
            continue;
          }
          int idyR = int(dyR);

          for (int wC = 0; wC < ${i}; wC++) {
            float dyC = float(dyCCorner + wC) / ${s}.0;

            if (dyC < 0.0 || dyC >= ${t.outWidth}.0 ||
                fract(dyC) > 0.0) {
              continue;
            }
            int idyC = int(dyC);

            float dyValue = getDy(b, idyR, idyC, d);
            int maxPosValue = ${l} - int(getMaxPos(b, idyR, idyC, d));

            // Get the current value, check it against the value from the
            // position matrix.
            int curPosValue = wR * ${i} + wC;
            float mask = float(maxPosValue == curPosValue ? 1.0 : 0.0);

            dotProd += dyValue * mask;
          }
        }
        setOutput(dotProd);
      }
    `}}class cU{constructor(t){this.variableNames=["dy","maxPos"],this.outputShape=t.inShape;const e=t.strideDepth,s=t.strideHeight,r=t.strideWidth,o=t.dilationDepth,i=t.dilationHeight,a=t.dilationWidth,c=t.effectiveFilterDepth,l=t.effectiveFilterHeight,u=t.effectiveFilterWidth,h=c-1-t.padInfo.front,d=l-1-t.padInfo.top,p=u-1-t.padInfo.left,f=c*l*u-1;this.userCode=`
      const ivec3 pads = ivec3(${h}, ${d}, ${p});

      void main() {
        ivec5 coords = getOutputCoords();
        int batch = coords.x;
        int ch = coords.u;

        ivec3 dyCorner = ivec3(coords.y, coords.z, coords.w) - pads;
        int dyDCorner = dyCorner.x;
        int dyRCorner = dyCorner.y;
        int dyCCorner = dyCorner.z;

        // Convolve dy(?, ?, ?, ch) with pos mask(:, :, :, d) to get
        // dx(xD, xR, xC, ch).
        // ? = to be determined. : = across all values in that axis.
        float dotProd = 0.0;

        for (int wD = 0; wD < ${c};
           wD += ${o}) {
          float dyD = float(dyDCorner + wD) / ${e}.0;

          if (dyD < 0.0 || dyD >= ${t.outDepth}.0 || fract(dyD) > 0.0) {
            continue;
          }
          int idyD = int(dyD);

          for (int wR = 0; wR < ${l};
              wR += ${i}) {
            float dyR = float(dyRCorner + wR) / ${s}.0;

            if (dyR < 0.0 || dyR >= ${t.outHeight}.0 ||
                fract(dyR) > 0.0) {
              continue;
            }
            int idyR = int(dyR);

            for (int wC = 0; wC < ${u};
                wC += ${a}) {
              float dyC = float(dyCCorner + wC) / ${r}.0;

              if (dyC < 0.0 || dyC >= ${t.outWidth}.0 ||
                  fract(dyC) > 0.0) {
                continue;
              }
              int idyC = int(dyC);

              float dyValue = getDy(batch, idyD, idyR, idyC, ch);
              int maxPosValue = ${f} -
                  int(getMaxPos(batch, idyD, idyR, idyC, ch));

              // Get the current value, check it against the value from the
              // position matrix.
              int curPosValue =
                  wD * ${l} * ${u} +
                  wR * ${u} + wC;
              float mask = float(maxPosValue == curPosValue ? 1.0 : 0.0);

              dotProd += dyValue * mask;
            }
          }
        }
        setOutput(dotProd);
      }
    `}}function lU(n){const{inputs:t,backend:e,attrs:s}=n,{dy:r,input:o}=t,i=o,{filterSize:a,strides:c,pad:l,dimRoundingMode:u}=s,h=[1,1,1],d=jn(i.shape,a,c,h,l,u),p=new Op(d,"max",!0),f=e.runWebGLProgram(p,[i],i.dtype),m=new cU(d),g=e.runWebGLProgram(m,[r,f],i.dtype);return e.disposeIntermediateTensorInfo(f),g}const uU={kernelName:gh,backendName:"webgl",kernelFunc:lU};function hU(n){const{inputs:t,backend:e,attrs:s}=n,{dy:r,input:o,output:i}=t,a=o;qi([o,i],"maxPoolGrad");const{filterSize:c,strides:l,pad:u,dimRoundingMode:h}=s,d=hn(a.shape,c,l,1,u,h),p=!0,f=new No(d,"max",p),m=e.runWebGLProgram(f,[a],a.dtype),g=new aU(d),x=e.runWebGLProgram(g,[r,m],a.dtype);return e.disposeIntermediateTensorInfo(m),x}const dU={kernelName:mh,backendName:"webgl",kernelFunc:hU};function pU(n,t,e,s){let r=new No(e,"max",!1);const o=s.runWebGLProgram(r,[n],"float32");r=new No(e,"max",!0,!0,t);const i=s.runWebGLProgram(r,[n],"float32");return[o,i]}const fU={kernelName:tg,backendName:"webgl",kernelFunc:({inputs:n,attrs:t,backend:e})=>{const{x:s}=n,{filterSize:r,strides:o,pad:i,includeBatchInIndex:a}=t,c=e;S(s.shape.length===4,()=>`Error in maxPool: input must be rank 4 but got rank ${s.shape.length}.`);const l=[1,1];S($e(o,l),()=>`Error in maxPool: Either strides or dilations must be 1. Got strides ${o} and dilations '${l}'`);const u=hn(s.shape,r,o,l,i),[h,d]=pU(s,a,u,c);return[h,d]}};function mU(n,t,e,s){const r=q(t),i=q(n.shape)/r,a=et({inputs:{x:n},attrs:{shape:[i,r]},backend:s}),c=cr(a,"float32","mean",s),l=et({inputs:{x:c},attrs:{shape:e},backend:s});return s.disposeIntermediateTensorInfo(a),s.disposeIntermediateTensorInfo(c),l}const gU={kernelName:Rc,backendName:"webgl",kernelFunc:({inputs:n,attrs:t,backend:e})=>{const{x:s}=n,{keepDims:r,axis:o}=t,i=e,a=s.shape.length,c=wt(o,s.shape);let l=c;const u=Kt(l,a),h=u!=null,d=i.shouldExecuteOnCPU([s]),p=[];let f=s;if(h){if(d){const y=i.texData.get(f.dataId).values,I=new Array(a);for(let T=0;T<I.length;T++)I[T]=s.shape[u[T]];const C=Dp(y,s.shape,s.dtype,u,I);f=i.makeTensorInfo(I,s.dtype);const N=i.texData.get(f.dataId);N.values=C}else f=El(s,u,i);p.push(f),l=Qt(l.length,a)}we("sum",l,a);const[m,g]=fe(f.shape,l);let x=m;r&&(x=Jt(m,c));const b=mU(f,g,x,i);for(const w of p)i.disposeIntermediateTensorInfo(w);return b}};function xU(n){const{inputs:t,backend:e,attrs:s}=n,{x:r}=t,{axis:o,keepDims:i}=s,a=r.shape.length,c=wt(o,r.shape);let l=c;const u=Kt(l,a);let h=r;u!=null&&(h=Re({inputs:{x:r},backend:e,attrs:{perm:u}}),l=Qt(l.length,r.shape.length)),we("min",l,a);const[d,p]=fe(h.shape,l),f=q(p),m=et({inputs:{x:h},backend:e,attrs:{shape:[-1,f]}}),g=cr(m,m.dtype,"min",e);let x;if(i){const b=Jt(d,c);x=et({inputs:{x:g},backend:e,attrs:{shape:b}})}else x=et({inputs:{x:g},backend:e,attrs:{shape:d}});return e.disposeIntermediateTensorInfo(m),e.disposeIntermediateTensorInfo(g),u!=null&&e.disposeIntermediateTensorInfo(h),x}const bU={kernelName:Dc,backendName:"webgl",kernelFunc:xU};const yU=Ap+`
  return min(a, b);
`,wU=`
  vec4 result = vec4(min(a, b));
  bvec4 isNaNA = isnan(a);
  bvec4 isNaNB = isnan(b);
  bvec4 isNaN = bvec4(isNaNA.x || isNaNB.x, isNaNA.y || isNaNB.y, isNaNA.z || isNaNB.z, isNaNA.w || isNaNB.w);
  `+ji+`
  return result;
`,IU=Ie({opSnippet:yU,packedOpSnippet:wU,cpuKernelImpl:f3}),vU={kernelName:ri,backendName:"webgl",kernelFunc:IU};class CU{constructor(t,e,s){this.variableNames=["x"],this.outputShape=e.map((u,h)=>u[0]+t[h]+u[1]);const r=t.length,o=Bt(r),i=e.map(u=>u[0]).join(","),a=e.map((u,h)=>u[0]+t[h]).join(","),c=["coords[0]","coords[1]","coords[2]","coords[3]"].slice(0,r),l=s==="reflect"?0:1;if(r===1){this.userCode=`
        int start = ${i};
        int end = ${a};

        void main() {
          int outC = getOutputCoords();
          if (outC < start) {
            outC = start * 2 - outC - ${l};
          } else if(outC >= end) {
            outC = (end - 1) * 2 - outC + ${l};
          }
          setOutput(getX(outC - start));
        }
      `;return}this.userCode=`
      ${o} start = ${o}(${i});
      ${o} end = ${o}(${a});

      void main() {
        ${o} outC = getOutputCoords();
        for (int i = 0; i < ${r}; i++) {
          if (outC[i] < start[i]) {
            outC[i] = start[i] * 2 - outC[i] - ${l};
          } else if(outC[i] >= end[i]) {
            outC[i] = (end[i] - 1) * 2 - outC[i] + ${l};
          }
        }
        ${o} coords = outC - start;
        setOutput(getX(${c}));
      }
    `}}class kU{constructor(t,e,s){this.variableNames=["x"],this.packedInputs=!0,this.packedOutput=!0,this.outputShape=e.map((f,m)=>f[0]+t[m]+f[1]);const r=t.length,o=Bt(r),i=e.map(f=>f[0]).join(","),a=e.map((f,m)=>f[0]+t[m]).join(","),c=Te("rc",r),l=Te("source",r),u=`${c[r-1]} < ${this.outputShape[r-1]}`,h=r===1?"source":`vec2(${l.slice(-2).join()})`,d=s==="reflect"?0:1;let p="";if(r===1){const f=`
        ${o} source = rc;
        if (source < start) {
          source = start * 2 - source - ${d};
        } else if (source >= end) {
          source = (end - 1) * 2 - source + ${d};
        }
        source -= start;
      `;p=`
        ${o} rc = outputLoc;
        ${f}
        result[0] = getChannel(getX(${l.join()}), ${h});
        ${c[r-1]} += 1;
        if(${u}) {
          ${f}
          result[1] = getChannel(getX(${l.join()}), ${h});
        }
      `}else{const f=`
        ${o} source = rc;
        ${o} lt = ${o}(lessThan(source, start));
        ${o} gte = ${o}(greaterThanEqual(source, end));
        ${o} orig = 1 - (lt + gte);
        source = orig * source +
                lt * (start * 2 - source - ${d}) +
                gte * ((end - 1) * 2 - source + ${d});
        source -= start;
      `;p=`
        ${o} rc = outputLoc;
        ${f}
        result[0] = getChannel(getX(${l.join()}), ${h});
        ${c[r-1]} += 1;
        if(${u}) {
          ${f}
          result[1] = getChannel(getX(${l.join()}), ${h});
        }
        rc = outputLoc;
        ${c[r-2]} += 1;
        if(${c[r-2]} < ${this.outputShape[r-2]}) {
          ${f}
          result[2] = getChannel(getX(${l.join()}), ${h});
          ${c[r-1]} += 1;
          if(${u}) {
            ${f}
            result[3] = getChannel(getX(${l.join()}), ${h});
          }
        }
      `}this.userCode=`
      const ${o} start = ${o}(${i});
      const ${o} end = ${o}(${a});

      void main() {
        ${o} outputLoc = getOutputCoords();
        vec4 result = vec4(0.);
        ${p}
        setOutput(result);
      }
    `}}const $U=({inputs:n,backend:t,attrs:e})=>{const{x:s}=n,{paddings:r,mode:o}=e,i=W().getBool("WEBGL_PACK_ARRAY_OPERATIONS")?new kU(s.shape,r,o):new CU(s.shape,r,o);return t.runWebGLProgram(i,[s],s.dtype)},SU={kernelName:Ac,backendName:"webgl",kernelFunc:$U};const NU=`if (b == 0.0) return NAN;
  return mod(a, b);`,TU=`
  vec4 result = mod(a, b);
  bvec4 isNaN = equal(b, vec4(0.0));
  `+ji+`
  return result;
`,EU=Ie({opSnippet:NU,packedOpSnippet:TU}),RU={kernelName:oi,backendName:"webgl",kernelFunc:EU};class DU{constructor(t,e,s){this.variableNames=["probs"],this.customUniforms=[{name:"seed",type:"float"}],this.outputShape=[t,s],this.userCode=`
      void main() {
        ivec2 coords = getOutputCoords();
        int batch = coords[0];

        float r = random(seed);
        float cdf = 0.0;

        for (int i = 0; i < ${e-1}; i++) {
          cdf += getProbs(batch, i);

          if (r < cdf) {
            setOutput(float(i));
            return;
          }
        }

        // If no other event happened, last event happened.
        setOutput(float(${e-1}));
      }
    `}}const AU=`
if (a == b) {
  return 1.0;
};
return a / b;`,FU=`
  // vec4 one = vec4(equal(a, b));
  // return one + (vec4(1.0) - one) * a / b;
  vec4 result = a / b;
  if(a.x == b.x) {
    result.x = 1.;
  }
  if(a.y == b.y) {
    result.y = 1.;
  }
  if(a.z == b.z) {
    result.z = 1.;
  }
  if(a.w == b.w) {
    result.w = 1.;
  }

  return result;
`,Gy=Ie({opSnippet:AU,packedOpSnippet:FU,checkOutOfBounds:!0}),OU={kernelName:Uo,backendName:"webgl",kernelFunc:Gy};const xm="return a - b;",Hy=Ie({opSnippet:xm,packedOpSnippet:xm,supportsComplex:!0,cpuKernelImpl:F3}),_U={kernelName:Ii,backendName:"webgl",kernelFunc:Hy};function qy(n){const{inputs:t,backend:e,attrs:s}=n,{logits:r}=t,{dim:o}=s,i=wt([o],r.shape),a=Uy({inputs:{x:r},backend:e,attrs:{reductionIndices:i,keepDims:!1}}),c=Jt(a.shape,i),l=et({inputs:{x:a},backend:e,attrs:{shape:c}}),u=Hy({inputs:{a:r,b:l},backend:e}),h=zy({inputs:{x:u},backend:e}),d=Rl({inputs:{x:h},backend:e,attrs:{axis:i,keepDims:!1}}),p=et({inputs:{x:d},backend:e,attrs:{shape:c}}),f=Gy({inputs:{a:h,b:p},backend:e});return e.disposeIntermediateTensorInfo(a),e.disposeIntermediateTensorInfo(l),e.disposeIntermediateTensorInfo(u),e.disposeIntermediateTensorInfo(h),e.disposeIntermediateTensorInfo(d),e.disposeIntermediateTensorInfo(p),f}const MU={kernelName:Yc,backendName:"webgl",kernelFunc:qy};function LU(n){const{inputs:t,backend:e,attrs:s}=n,{logits:r}=t,{numSamples:o,seed:i,normalized:a}=s,c=a?r:qy({inputs:{logits:r},backend:e,attrs:{dim:r.shape.length-1}}),l=c.shape[0],u=c.shape[1],h=new DU(l,u,o),d=[[i]],p=e.runWebGLProgram(h,[c],"int32",d);return a||e.disposeIntermediateTensorInfo(c),p}const PU={kernelName:eg,backendName:"webgl",kernelFunc:LU};const BU=fn+`
  return -x;
`,zU=`
  vec4 result = -x;
  bvec4 isNaN = isnan(x);

  result.r = isNaN.r ? x.r : result.r;
  result.g = isNaN.g ? x.g : result.g;
  result.b = isNaN.b ? x.b : result.b;
  result.a = isNaN.a ? x.a : result.a;

  return result;
`;function VU(n){const{inputs:t,backend:e}=n,{x:s}=t;if(e.shouldExecuteOnCPU([s])){const o=e.texData.get(s.dataId),[i,a]=g3(o.values,s.shape,s.dtype);return e.makeTensorInfo(a,s.dtype,i)}let r;return W().getBool("WEBGL_PACK_UNARY_OPERATIONS")?r=new Bs(s.shape,zU):r=new Gn(s.shape,BU),e.runWebGLProgram(r,[s],s.dtype)}const WU={kernelName:Fc,backendName:"webgl",kernelFunc:VU};const UU=wd;function GU(n){je("tf.nonMaxSuppression() in webgl locks the UI thread. Call tf.nonMaxSuppressionAsync() instead");const{inputs:t,backend:e,attrs:s}=n,{boxes:r,scores:o}=t,{maxOutputSize:i,iouThreshold:a,scoreThreshold:c}=s,l=e.readSync(r.dataId),u=e.readSync(o.dataId),{selectedIndices:h}=UU(l,u,i,a,c);return e.makeTensorInfo([h.length],"int32",new Int32Array(h))}const HU={kernelName:xh,backendName:"webgl",kernelFunc:GU};const qU=Id;function KU(n){je("tf.nonMaxSuppression() in webgl locks the UI thread. Call tf.nonMaxSuppressionAsync() instead");const{inputs:t,backend:e,attrs:s}=n,{boxes:r,scores:o}=t,{maxOutputSize:i,iouThreshold:a,scoreThreshold:c,padToMaxOutputSize:l}=s,u=e.readSync(r.dataId),h=e.readSync(o.dataId),{selectedIndices:d,validOutputs:p}=qU(u,h,i,a,c,l);return[e.makeTensorInfo([d.length],"int32",new Int32Array(d)),e.makeTensorInfo([],"int32",new Int32Array([p]))]}const jU={kernelName:bh,backendName:"webgl",kernelFunc:KU};const XU=vd;function YU(n){je("tf.nonMaxSuppression() in webgl locks the UI thread. Call tf.nonMaxSuppressionAsync() instead");const{inputs:t,backend:e,attrs:s}=n,{boxes:r,scores:o}=t,{maxOutputSize:i,iouThreshold:a,scoreThreshold:c,softNmsSigma:l}=s,u=e.readSync(r.dataId),h=e.readSync(o.dataId),d=i,p=a,f=c,m=l,{selectedIndices:g,selectedScores:x}=XU(u,h,d,p,f,m);return[e.makeTensorInfo([g.length],"int32",new Int32Array(g)),e.makeTensorInfo([x.length],"float32",new Float32Array(x))]}const ZU={kernelName:yh,backendName:"webgl",kernelFunc:YU};class JU{constructor(t,e,s,r){this.variableNames=["indices"],this.outputShape=[t,e],this.userCode=`
      void main() {
        ivec2 coords = getOutputCoords();
        int index = round(getIndices(coords.x));
        setOutput(mix(float(${r}), float(${s}),
                      float(index == coords.y)));
      }
    `}}const QU=n=>{const{inputs:t,backend:e,attrs:s}=n,{indices:r}=t,{dtype:o,depth:i,onValue:a,offValue:c}=s,l=q(r.shape),u=new JU(l,i,a,c),h=et({inputs:{x:r},backend:e,attrs:{shape:[l]}}),d=e.runWebGLProgram(u,[h],o);e.disposeIntermediateTensorInfo(h);const p=[...r.shape,i],f=et({inputs:{x:d},backend:e,attrs:{shape:p}});return e.disposeIntermediateTensorInfo(d),f},tG={kernelName:Mc,backendName:"webgl",kernelFunc:QU};function Qa(n){const{inputs:t,backend:e}=n,{x:s}=t;if(s.dtype==="complex64"){const r=Yi({inputs:{input:s},backend:e}),o=Qa({inputs:{x:r},backend:e}),i=Dl({inputs:{input:s},backend:e}),a=Qa({inputs:{x:i},backend:e}),c=$s({inputs:{real:o,imag:a},backend:e});return e.disposeIntermediateTensorInfo(r),e.disposeIntermediateTensorInfo(o),e.disposeIntermediateTensorInfo(i),e.disposeIntermediateTensorInfo(a),c}else return Zi({attrs:{shape:s.shape,dtype:s.dtype,value:s.dtype==="string"?"":0},backend:e})}const eG={kernelName:Qc,backendName:"webgl",kernelFunc:Qa};function Ky(n){const{inputs:t,backend:e}=n,{x:s}=t;if(s.dtype==="string")throw new Error("onesLike is not supported under string dtype");if(s.dtype==="complex64"){const r=Yi({inputs:{input:s},backend:e}),o=Ky({inputs:{x:r},backend:e}),i=Dl({inputs:{input:s},backend:e}),a=Qa({inputs:{x:i},backend:e}),c=$s({inputs:{real:o,imag:a},backend:e});return e.disposeIntermediateTensorInfo(r),e.disposeIntermediateTensorInfo(o),e.disposeIntermediateTensorInfo(i),e.disposeIntermediateTensorInfo(a),c}else return Zi({attrs:{shape:s.shape,dtype:s.dtype,value:1},backend:e})}const nG={kernelName:_c,backendName:"webgl",kernelFunc:Ky};function sG(n){const{inputs:t,backend:e,attrs:s}=n,{axis:r}=s;if(t.length===1)return Vu({inputs:{input:t[0]},backend:e,attrs:{dim:r}});const o=t[0].shape,i=t[0].dtype;t.forEach(u=>{un(o,u.shape,"All tensors passed to stack must have matching shapes"),S(i===u.dtype,()=>"All tensors passed to stack must have matching dtypes")});const a=[],c=t.map(u=>{const h=Vu({inputs:{input:u},backend:e,attrs:{dim:r}});return a.push(h),h}),l=Ay({inputs:c,backend:e,attrs:{axis:r}});return a.forEach(u=>e.disposeIntermediateTensorInfo(u)),l}const rG={kernelName:Lc,backendName:"webgl",kernelFunc:sG};class oG{constructor(t,e,s){this.variableNames=["x"],this.customUniforms=[{name:"value",type:"float"}],this.outputShape=e.map((l,u)=>l[0]+t[u]+l[1]);const r=t.length,o=Bt(r),i=e.map(l=>l[0]).join(","),a=e.map((l,u)=>l[0]+t[u]).join(","),c=["coords[0]","coords[1]","coords[2]","coords[3]"].slice(0,r);if(r===1){this.userCode=`
        int start = ${i};
        int end = ${a};

        void main() {
          int outC = getOutputCoords();
          if (outC < start || outC >= end) {
            setOutput(value);
          } else {
            setOutput(getX(outC - start));
          }
        }
      `;return}this.userCode=`
      ${o} start = ${o}(${i});
      ${o} end = ${o}(${a});

      void main() {
        ${o} outC = getOutputCoords();
        if (any(lessThan(outC, start)) || any(greaterThanEqual(outC, end))) {
          setOutput(value);
        } else {
          ${o} coords = outC - start;
          setOutput(getX(${c}));
        }
      }
    `}}class iG{constructor(t,e,s){this.variableNames=["x"],this.packedInputs=!0,this.packedOutput=!0,this.customUniforms=[{name:"value",type:"float"}],this.outputShape=e.map((m,g)=>m[0]+t[g]+m[1]);const r=t.length,o=Bt(r),i=e.map(m=>m[0]).join(","),a=e.map((m,g)=>m[0]+t[g]).join(","),c=Te("rc",r),l=Te("source",r),u=`${c[r-1]} < ${this.outputShape[r-1]}`,h=r===1?"source":`vec2(${l.slice(-2).join()})`,d=[`${o} rc = outputLoc;`,`${c[r-1]} += 1;
       if(${u}) {
      `,r===1?"":`}
       rc = outputLoc;
       ${c[r-2]} += 1;
       if(${c[r-2]} < ${this.outputShape[r-2]}) {`,r===1?"":`  ${c[r-1]} += 1;
         if(${u}) {`],p=r===1?"rc < start || rc >= end":"any(lessThan(rc, start)) || any(greaterThanEqual(rc, end))";let f="";for(let m=0,g=r===1?2:4;m<g;m++)f+=`
        ${d[m]}
        if (${p}) {
          result[${m}] = float(value);
        } else {
          ${o} source = rc - start;
          result[${m}] = getChannel(getX(${l.join()}), ${h});
        }
      `;f+=r===1?"} ":"}}",this.userCode=`
      const ${o} start = ${o}(${i});
      const ${o} end = ${o}(${a});

      void main() {
        ${o} outputLoc = getOutputCoords();
        vec4 result = vec4(0.);
        ${f}
        setOutput(result);
      }
    `}}const jy=n=>{const{inputs:t,backend:e,attrs:s}=n,{x:r}=t,{paddings:o,constantValue:i}=s;if(q(r.shape)===0){const l=o.map((u,h)=>u[0]+r.shape[h]+u[1]);return Zi({backend:e,attrs:{shape:l,value:i,dtype:r.dtype}})}const a=W().getBool("WEBGL_PACK_ARRAY_OPERATIONS")?new iG(r.shape,o,i):new oG(r.shape,o,i),c=[[i]];return e.runWebGLProgram(a,[r],r.dtype,c)},aG={kernelName:Pc,backendName:"webgl",kernelFunc:jy};const cG=`
  if(a < 0.0 && floor(b) < b){
    return NAN;
  }
  if (b == 0.0) {
    return 1.0;
  }
  return (round(mod(b, 2.0)) != 1) ?
      pow(abs(a), b) : sign(a) * pow(abs(a), b);
`,lG=`
  // isModRound1 has 1 for components with round(mod(b, 2.0)) == 1, 0 otherwise.
  vec4 isModRound1 = vec4(equal(round(mod(b, 2.0)), ivec4(1)));
  vec4 multiplier = sign(a) * isModRound1 + (vec4(1.0) - isModRound1);
  vec4 result = multiplier * pow(abs(a), b);

  // Ensure that a^0 = 1, including 0^0 = 1 as this correspond to TF and JS
  bvec4 isExpZero = equal(b, vec4(0.0));
  result.r = isExpZero.r ? 1.0 : result.r;
  result.g = isExpZero.g ? 1.0 : result.g;
  result.b = isExpZero.b ? 1.0 : result.b;
  result.a = isExpZero.a ? 1.0 : result.a;

  bvec4 isNaN1 = lessThan(a, vec4(0.0));
  bvec4 isNaN2 = lessThan(floor(b), b);
  bvec4 isNaN = bvec4(isNaN1.x && isNaN2.x, isNaN1.y && isNaN2.y, isNaN1.z && isNaN2.z, isNaN1.w && isNaN2.w);
  `+ji+`
  return result;
`,uG=Ie({opSnippet:cG,packedOpSnippet:lG}),hG={kernelName:ai,backendName:"webgl",kernelFunc:uG};function dG(n){const{inputs:t,backend:e,attrs:s}=n,{x:r}=t,{axis:o,keepDims:i}=s,a=r.shape.length,c=[],l=wt(o,r.shape);let u=l;const h=Kt(u,a);let d=r;h!=null&&(d=Re({inputs:{x:r},backend:e,attrs:{perm:h}}),u=Qt(u.length,a),c.push(d)),we("prod",u,a);let p;if(e.shouldExecuteOnCPU([d])){const f=e.texData.get(d.dataId).values,{outVals:m,outShape:g,outDtype:x}=b3(d.shape,d.dtype,f,u);p=e.makeTensorInfo(g,x,m)}else{const[f,m]=fe(d.shape,u),g=q(m),x=et({inputs:{x:d},backend:e,attrs:{shape:[-1,g]}}),b=Lh(r.dtype),w=cr(x,b,"prod",e);p=et({inputs:{x:w},backend:e,attrs:{shape:f}}),c.push(x),c.push(w)}if(i){c.push(p);const f=Jt(p.shape,l);p=et({inputs:{x:p},backend:e,attrs:{shape:f}})}return c.forEach(f=>e.disposeIntermediateTensorInfo(f)),p}const pG={kernelName:zc,backendName:"webgl",kernelFunc:dG};function fG(n){const{inputs:t,backend:e,attrs:s}=n,{paramsNestedSplits:r,paramsDenseValues:o,indices:i}=t,{outputRaggedRank:a}=s,c=r.map(x=>e.readSync(x.dataId)),l=r.map(x=>x.shape),u=e.readSync(o.dataId),h=e.readSync(i.dataId),[d,p,f]=y3(c,l,u,o.shape,o.dtype,h,i.shape,a),m=d.map(x=>e.makeTensorInfo([x.length],"int32",x)),g=e.makeTensorInfo(f,o.dtype,p);return m.concat([g])}const mG={kernelName:ng,backendName:"webgl",kernelFunc:fG};function gG(n){const{inputs:t,backend:e,attrs:s}=n,{shape:r,values:o,defaultValue:i,rowPartitionTensors:a}=t,{rowPartitionTypes:c}=s,l=e.readSync(r.dataId),u=e.readSync(o.dataId),h=e.readSync(i.dataId),d=a.map(g=>e.readSync(g.dataId)),p=a.map(g=>g.shape),[f,m]=w3(l,r.shape,u,o.shape,o.dtype,h,i.shape,d,p,c);return e.makeTensorInfo(f,o.dtype,m)}const xG={kernelName:sg,backendName:"webgl",kernelFunc:gG};const Xy=n=>{const{backend:t,attrs:e}=n,{start:s,stop:r,step:o,dtype:i}=e,a=I3(s,r,o,i);return t.makeTensorInfo([a.length],i,a)},bG={kernelName:wh,backendName:"webgl",kernelFunc:Xy};const yG="return 1.0 / x;",wG=St({opSnippet:yG}),IG={kernelName:ci,backendName:"webgl",kernelFunc:wG};const vG=fn+`
  return (x < 0.0) ? 0.0 : x;
`,CG=`
  vec4 result = x * vec4(greaterThanEqual(x, vec4(0.0)));
  bvec4 isNaN = isnan(x);

  result.r = isNaN.r ? x.r : result.r;
  result.g = isNaN.g ? x.g : result.g;
  result.b = isNaN.b ? x.b : result.b;
  result.a = isNaN.a ? x.a : result.a;

  return result;
`,kG=St({opSnippet:vG,packedOpSnippet:CG}),$G={kernelName:li,backendName:"webgl",kernelFunc:kG};const SG=fn+`
  return (x < 0.0) ? 0.0 : min(6.0, x);
`,NG=`
  vec4 result = min(x, vec4(6.)) * vec4(greaterThanEqual(x, vec4(0.0)));
  bvec4 isNaN = isnan(x);

  result.r = isNaN.r ? x.r : result.r;
  result.g = isNaN.g ? x.g : result.g;
  result.b = isNaN.b ? x.b : result.b;
  result.a = isNaN.a ? x.a : result.a;

  return result;
`,TG=St({opSnippet:SG,packedOpSnippet:NG}),EG={kernelName:ui,backendName:"webgl",kernelFunc:TG};class RG{constructor(t,e,s,r,o){this.variableNames=["A"],this.outputShape=[];const[i,a,c,l]=t;this.outputShape=[i,e,s,l];const u=[r&&e>1?a-1:a,r&&s>1?c-1:c],h=[r&&e>1?e-1:e,r&&s>1?s-1:s];let d;o?d="(vec2(yRC) + vec2(0.5)) * effectiveInputOverOutputRatioRC - vec2(0.5)":d="vec2(yRC) * effectiveInputOverOutputRatioRC",this.userCode=`
      const vec2 effectiveInputOverOutputRatioRC = vec2(
          ${u[0]/h[0]},
          ${u[1]/h[1]});
      const vec2 inputShapeRC = vec2(${a}.0, ${c}.0);

      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int d = coords[3];
        ivec2 yRC = coords.yz;

        // Fractional source index.
        vec2 sourceFracIndexRC = ${d};

        // Compute the four integer indices.
        ivec2 sourceFloorRC = ivec2(max(sourceFracIndexRC, vec2(0.0)));
        ivec2 sourceCeilRC = ivec2(
          min(inputShapeRC - 1.0, ceil(sourceFracIndexRC)));

        float topLeft = getA(b, sourceFloorRC.x, sourceFloorRC.y, d);
        float bottomLeft = getA(b, sourceCeilRC.x, sourceFloorRC.y, d);
        float topRight = getA(b, sourceFloorRC.x, sourceCeilRC.y, d);
        float bottomRight = getA(b, sourceCeilRC.x, sourceCeilRC.y, d);

        vec2 fracRC = sourceFracIndexRC - vec2(sourceFloorRC);

        float top = topLeft + (topRight - topLeft) * fracRC.y;
        float bottom = bottomLeft + (bottomRight - bottomLeft) * fracRC.y;
        float newValue = top + (bottom - top) * fracRC.x;

        setOutput(newValue);
      }
    `}}class DG{constructor(t,e,s,r,o){this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!0,this.outputShape=[];const[i,a,c,l]=t;this.outputShape=[i,e,s,l];const u=[r&&e>1?a-1:a,r&&s>1?c-1:c],h=[r&&e>1?e-1:e,r&&s>1?s-1:s];let d;o?d="(vec3(yRC) + vec3(0.5)) * effectiveInputOverOutputRatioRC - vec3(0.5)":d="vec3(yRC) * effectiveInputOverOutputRatioRC",this.userCode=`
      const vec3 effectiveInputOverOutputRatioRC = vec3(
          ${u[0]/h[0]},
          ${u[1]/h[1]},
          ${u[1]/h[1]});
      const vec3 inputShapeRC = vec3(${a}.0, ${c}.0,
                                     ${c}.0);

      float getAValue(int b, int r, int c, int d) {
        return getChannel(getA(b, r, c, d), vec2(c, d));
      }

      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int d = coords[3];
        // Calculate values for next column in yRC.z.
        ivec3 yRC = coords.yzz + ivec3(0, 0, 1);

        // Fractional source index.
        vec3 sourceFracIndexRC = ${d};

        // Compute the four integer indices.
        ivec3 sourceFloorRC = ivec3(max(sourceFracIndexRC, vec3(0.0)));
        ivec3 sourceCeilRC = ivec3(
          min(inputShapeRC - 1.0, ceil(sourceFracIndexRC)));

        // Should we calculate next column and row elements in 2x2 packed cell.
        bool hasNextCol = d < ${l-1};
        bool hasNextRow = coords.z < ${s-1};

        // In parallel, construct four corners for all four components in
        // packed 2x2 cell.
        vec4 topLeft = vec4(
          getAValue(b, sourceFloorRC.x, sourceFloorRC.y, d),
          hasNextCol ? getAValue(b, sourceFloorRC.x, sourceFloorRC.y, d + 1)
                     : 0.0,
          hasNextRow ? getAValue(b, sourceFloorRC.x, sourceFloorRC.z, d)
                     : 0.0,
          (hasNextRow && hasNextCol) ?
            getAValue(b, sourceFloorRC.x, sourceFloorRC.z, d + 1) : 0.0);

        vec4 bottomLeft = vec4(
          getAValue(b, sourceCeilRC.x, sourceFloorRC.y, d),
          hasNextCol ? getAValue(b, sourceCeilRC.x, sourceFloorRC.y, d + 1)
                     : 0.0,
          hasNextRow ? getAValue(b, sourceCeilRC.x, sourceFloorRC.z, d)
                     : 0.0,
          (hasNextRow && hasNextCol) ?
            getAValue(b, sourceCeilRC.x, sourceFloorRC.z, d + 1) : 0.0);

        vec4 topRight = vec4(
          getAValue(b, sourceFloorRC.x, sourceCeilRC.y, d),
          hasNextCol ? getAValue(b, sourceFloorRC.x, sourceCeilRC.y, d + 1)
                     : 0.0,
          hasNextRow ? getAValue(b, sourceFloorRC.x, sourceCeilRC.z, d)
                     : 0.0,
          (hasNextRow && hasNextCol) ?
            getAValue(b, sourceFloorRC.x, sourceCeilRC.z, d + 1) : 0.0);

        vec4 bottomRight = vec4(
          getAValue(b, sourceCeilRC.x, sourceCeilRC.y, d),
          hasNextCol ? getAValue(b, sourceCeilRC.x, sourceCeilRC.y, d + 1)
                     : 0.0,
          hasNextRow ? getAValue(b, sourceCeilRC.x, sourceCeilRC.z, d)
                     : 0.0,
          (hasNextRow && hasNextCol) ?
            getAValue(b, sourceCeilRC.x, sourceCeilRC.z, d + 1) : 0.0);

        vec3 fracRC = sourceFracIndexRC - vec3(sourceFloorRC);

        vec4 top = mix(topLeft, topRight, fracRC.yyzz);
        vec4 bottom = mix(bottomLeft, bottomRight, fracRC.yyzz);
        vec4 newValue = mix(top, bottom, fracRC.x);

        setOutput(newValue);
      }
    `}}function AG(n){const{inputs:t,backend:e,attrs:s}=n,{images:r}=t,{alignCorners:o,halfPixelCenters:i,size:a}=s,[c,l]=a,u=W().getBool("WEBGL_PACK_IMAGE_OPERATIONS")?new DG(r.shape,c,l,o,i):new RG(r.shape,c,l,o,i);return e.runWebGLProgram(u,[r],"float32")}const FG={kernelName:Uc,backendName:"webgl",kernelFunc:AG};class OG{constructor(t,e,s){this.variableNames=["dy"],this.outputShape=[],this.outputShape=e;const[,r,o]=e,[,i,a]=t,c=[s&&i>1?r-1:r,s&&a>1?o-1:o],l=[s&&i>1?i-1:i,s&&a>1?a-1:a],u=c[0]/l[0],h=c[1]/l[1],d=1/u,p=1/h,f=Math.ceil(d)*2+2,m=Math.ceil(p)*2+2;this.userCode=`
      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int d = coords[3];
        int r = coords[1];
        int c = coords[2];

        float accumulator = 0.0;

        const float heightScale = float(${u});
        const float widthScale = float(${h});

        const float invHeightScale = float(${d});
        const float invWidthScale = float(${p});

        const int winHeight = int(${f});
        const int winWidth = int(${m});

        // Compute bounds for where in dy we will look
        float startRLerp = floor(float(r) * invHeightScale);
        int startDyR = int(startRLerp - float(winHeight / 2));

        float startCLerp = floor(float(c) * invWidthScale);
        int startDyC = int(startCLerp - float(winWidth / 2));

        // Loop over dy
        for (int dyROffset = 0; dyROffset < winHeight; dyROffset++) {
          int dyR = dyROffset + startDyR;

          // Guard against the window exceeding the bounds of dy
          if (dyR < 0 || dyR >= ${i}) {
            continue;
          }

          for (int dyCOffset = 0; dyCOffset < winWidth; dyCOffset++) {
            int dyC = dyCOffset + startDyC;

            // Guard against the window exceeding the bounds of dy
            if (dyC < 0 || dyC >= ${a}) {
              continue;
            }

            float dxR = float(dyR) * heightScale;
            int topDxRIndex = int(floor(dxR));
            int bottomDxRIndex = int(min(ceil(dxR), ${r-1}.0));
            float dxRLerp = dxR - float(topDxRIndex);
            float inverseDxRLerp = 1.0 - dxRLerp;

            float dxC = float(dyC) * widthScale;
            int leftDxCIndex = int(floor(dxC));
            int rightDxCIndex = int(min(ceil(dxC), ${o-1}.0));
            float dxCLerp = dxC - float(leftDxCIndex);
            float inverseDxCLerp = 1.0 - dxCLerp;

            if (r == topDxRIndex && c == leftDxCIndex) {
              // topLeft
              accumulator +=
                getDy(b, dyR, dyC, d) * inverseDxRLerp * inverseDxCLerp;
            }

            if (r == topDxRIndex && c == rightDxCIndex) {
              // topRight
              accumulator += getDy(b, dyR, dyC, d) * inverseDxRLerp * dxCLerp;
            }

            if (r == bottomDxRIndex && c == leftDxCIndex) {
              // bottomLeft
              accumulator += getDy(b, dyR, dyC, d) * dxRLerp * inverseDxCLerp;
            }

            if (r == bottomDxRIndex && c == rightDxCIndex) {
              // bottomRight
              accumulator += getDy(b, dyR, dyC, d) * dxRLerp * dxCLerp;
            }
          }
        }
        // End loop over dy

        setOutput(accumulator);
      }
    `}}function _G(n){const{inputs:t,backend:e,attrs:s}=n,{images:r,dy:o}=t,{alignCorners:i}=s,a=new OG(o.shape,r.shape,i);return e.runWebGLProgram(a,[o],o.dtype)}const MG={kernelName:Ch,backendName:"webgl",kernelFunc:_G};class LG{constructor(t,e,s,r,o){this.variableNames=["A"],this.outputShape=[];const[i,a,c,l]=t;this.outputShape=[i,e,s,l];const u=[r&&e>1?a-1:a,r&&s>1?c-1:c],h=[r&&e>1?e-1:e,r&&s>1?s-1:s],d=r?"0.5":"0.0";let p;o?p="max((vec2(yRC) + vec2(0.5)) * effectiveInputOverOutputRatioRC, vec2(0.0))":p="vec2(yRC) * effectiveInputOverOutputRatioRC",this.userCode=`
      const vec2 effectiveInputOverOutputRatioRC = vec2(
          ${u[0]/h[0]},
          ${u[1]/h[1]});
      const vec2 inputShapeRC = vec2(${a}.0, ${c}.0);

      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int d = coords[3];
        ivec2 yRC = coords.yz;

        // Fractional source index.
        vec2 sourceFracIndexRC = ${p};

        // Compute the coordinators of nearest neighbor point.
        ivec2 sourceNearestRC = ivec2(
          min(inputShapeRC - 1.0, floor(sourceFracIndexRC + ${d})));
        float newValue = getA(b, sourceNearestRC.x, sourceNearestRC.y, d);

        setOutput(newValue);
      }
    `}}class PG{constructor(t,e,s,r,o){this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!0,this.outputShape=[];const[i,a,c,l]=t;this.outputShape=[i,e,s,l];const u=[r&&e>1?a-1:a,r&&s>1?c-1:c],h=[r&&e>1?e-1:e,r&&s>1?s-1:s],d=r?"0.5":"0.0";let p;o?p="max((vec3(yRC) + vec3(0.5)) * effectiveInputOverOutputRatioRC, vec3(0.0))":p="vec3(yRC) * effectiveInputOverOutputRatioRC",this.userCode=`
      const vec3 effectiveInputOverOutputRatioRC = vec3(
          ${u[0]/h[0]},
          ${u[1]/h[1]},
          ${u[1]/h[1]});
      const vec3 inputShapeRC = vec3(${a}.0, ${c}.0,
                                     ${c}.0);

      float getAValue(int b, int r, int c, int d) {
        return getChannel(getA(b, r, c, d), vec2(c, d));
      }

      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int d = coords[3];
        // Calculate values for next column in yRC.z.
        ivec3 yRC = coords.yzz + ivec3(0, 0, 1);

        // Fractional source index.
        vec3 sourceFracIndexRC = ${p};

        // Compute the coordinators of nearest neighbor point.
        ivec3 sourceNearestRC = ivec3(
          min(inputShapeRC - 1.0, floor(sourceFracIndexRC + ${d})));

        // Should we calculate next column and row elements in 2x2 packed cell.
        bool hasNextCol = d < ${l-1};
        bool hasNextRow = coords.z < ${s-1};

        vec4 newValue = vec4(
          getAValue(b, sourceNearestRC.x, sourceNearestRC.y, d),
          hasNextCol ? getAValue(b, sourceNearestRC.x, sourceNearestRC.y, d + 1)
                     : 0.0,
          hasNextRow ? getAValue(b, sourceNearestRC.x, sourceNearestRC.z, d)
                     : 0.0,
          (hasNextRow && hasNextCol) ?
            getAValue(b, sourceNearestRC.x, sourceNearestRC.z, d + 1) : 0.0);

        setOutput(newValue);
      }
    `}}function BG(n){const{inputs:t,backend:e,attrs:s}=n,{images:r}=t,{alignCorners:o,halfPixelCenters:i,size:a}=s,[c,l]=a,u=W().getBool("WEBGL_PACK_IMAGE_OPERATIONS")?new PG(r.shape,c,l,o,i):new LG(r.shape,c,l,o,i);return e.runWebGLProgram(u,[r],r.dtype)}const zG={kernelName:Wc,backendName:"webgl",kernelFunc:BG};class VG{constructor(t,e,s){this.variableNames=["dy"],this.outputShape=[],this.outputShape=e;const[,r,o]=e,[,i,a]=t,c=[s&&i>1?r-1:r,s&&a>1?o-1:o],l=[s&&i>1?i-1:i,s&&a>1?a-1:a],u=c[0]/l[0],h=c[1]/l[1],d=1/u,p=1/h,f=Math.ceil(d)*2+2,m=Math.ceil(p)*2+2;this.userCode=`
      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int d = coords[3];
        int r = coords[1];
        int c = coords[2];

        float accumulator = 0.0;

        const float heightScale = float(${u});
        const float widthScale = float(${h});

        const float invHeightScale = float(${d});
        const float invWidthScale = float(${p});

        const int winHeight = int(${f});
        const int winWidth = int(${m});

        // Compute bounds for where in dy we will look
        float startRLerp = floor(float(r) * invHeightScale);
        int startDyR = int(floor(startRLerp - float(winHeight / 2)));

        float startCLerp = floor(float(c) * invWidthScale);
        int startDyC = int(floor(startCLerp - float(winWidth / 2)));

        // Loop over dy
        for (int dyROffset = 0; dyROffset < winHeight; dyROffset++) {
          int dyR = dyROffset + startDyR;

          // Guard against the window exceeding the bounds of dy
          if (dyR < 0 || dyR >= ${i}) {
            continue;
          }

          for (int dyCOffset = 0; dyCOffset < winWidth; dyCOffset++) {
            int dyC = dyCOffset + startDyC;

            // Guard against the window exceeding the bounds of dy
            if (dyC < 0 || dyC >= ${a}) {
              continue;
            }

            float sourceFracRow =
              float(${c[0]}) *
                (float(dyR) / float(${l[0]}));

            float sourceFracCol =
                float(${c[1]}) *
                  (float(dyC) / float(${l[1]}));

            int sourceNearestRow = int(min(
                float(int(${r}) - 1),
                ${s} ? float(round(sourceFracRow)) :
                                  float(floor(sourceFracRow))));

            int sourceNearestCol = int(min(
                float(int(${o}) - 1),
                ${s} ? float(round(sourceFracCol)) :
                                  float(floor(sourceFracCol))));

            if (r == sourceNearestRow && c == sourceNearestCol) {
              accumulator += getDy(b, dyR, dyC, d);
            }
          }
        }
        // End loop over dy

        setOutput(accumulator);
      }
    `}}function WG(n){const{inputs:t,backend:e,attrs:s}=n,{images:r,dy:o}=t,{alignCorners:i}=s,a=new VG(o.shape,r.shape,i);return e.runWebGLProgram(a,[o],o.dtype)}const UG={kernelName:vh,backendName:"webgl",kernelFunc:WG};class GG{constructor(t,e){this.variableNames=["x"];const s=t.length;if(s>4)throw new Error(`WebGL backend: Reverse of rank-${s} tensor is not yet supported`);if(this.outputShape=t,s===1){this.userCode=`
        void main() {
          int coord = getOutputCoords();
          setOutput(getX(${t[0]} - coord - 1));
        }
      `;return}const r=a=>e.indexOf(a)!==-1&&t[a]!==1?`${t[a]} - coords[${a}] - 1`:`coords[${a}]`,o=t.map((a,c)=>r(c)).join(","),i=Bt(s);this.userCode=`
      void main() {
        ${i} coords = getOutputCoords();
        setOutput(getX(${o}));
      }
    `}}class HG{constructor(t,e){this.variableNames=["x"],this.packedInputs=!0,this.packedOutput=!0;const s=t.length;if(s>4)throw new Error(`WebGL backend: Reverse of rank-${s} tensor is not yet supported`);this.outputShape=t;const r=Te("rc",s),o=`${r[s-1]} + 1 < ${this.outputShape[s-1]}`,i=`${r[s-2]} + 1 < ${this.outputShape[s-2]}`,a=Bt(s);s===1?this.userCode=`
        void main(){
          int rc = getOutputCoords();
          vec4 result = vec4(0.);
          result.r = getChannel(getX(${t[0]} - rc - 1),
            ${t[0]} - rc - 1);
          if(${o}){
              result.g = getChannel(getX(${t[0]} - (rc  + 1) - 1),
                ${t[0]} - (rc  + 1) - 1);
          }
          setOutput(result);
        }
      `:this.userCode=`
        void main() {
          ${a} rc = getOutputCoords();
          vec4 result = vec4(0.);
          result.r = ${c(r.slice())};
          if(${o}){
            result.g = ${l(r.slice())};
          }
          if(${i}) {
            result.b = ${u(r.slice())};
            if(${o}) {
              result.a = ${h(r.slice())};
            }
          }
          setOutput(result);
        }
    `;function c(f){return d(f)}function l(f){return f[s-1]="("+f[s-1]+" + 1)",d(f)}function u(f){return f[s-2]="("+f[s-2]+" + 1)",d(f)}function h(f){return f[s-1]="("+f[s-1]+" + 1)",f[s-2]="("+f[s-2]+" + 1)",d(f)}function d(f){const m=t.map((b,w)=>p(w,f)),g=m.join(","),x=m.slice(-2).join(",");return`getChannel(getX(${g}), vec2(${x}))`}function p(f,m){return e.indexOf(f)!==-1&&t[f]!==1?`${t[f]} - ${m[f]} - 1`:`${m[f]}`}}}function qG(n){const{inputs:t,backend:e,attrs:s}=n,{x:r}=t,{dims:o}=s,i=r.shape.length,a=wt(o,r.shape);if(i===0)return He({inputs:{x:r},backend:e});const c=W().getBool("WEBGL_PACK_ARRAY_OPERATIONS")?new HG(r.shape,a):new GG(r.shape,a);return e.runWebGLProgram(c,[r],r.dtype)}const KG={kernelName:Gc,backendName:"webgl",kernelFunc:qG};class jG{constructor(t,e){this.variableNames=["Image"],this.outputShape=[],this.customUniforms=[{name:"params",type:"vec4"}];const s=t[1],r=t[2];this.outputShape=t;let o="";typeof e=="number"?o=`float outputValue = ${e.toFixed(2)};`:o=`
        vec3 fill = vec3(${e.join(",")});
        float outputValue = fill[coords[3]];`,this.userCode=`
        void main() {
          ivec4 coords = getOutputCoords();
          int x = coords[2];
          int y = coords[1];
          float coordXFloat = (float(x) - params[0]) * params[3] -
            (float(y) - params[1]) * params[2];
          float coordYFloat = (float(x) - params[0]) * params[2] +
            (float(y) - params[1]) * params[3];
          int coordX = int(round(coordXFloat + params[0]));
          int coordY = int(round(coordYFloat + params[1]));
          ${o}
          if(coordX >= 0 && coordX < ${r} && coordY >= 0 && coordY < ${s}) {
            outputValue = getImage(coords[0], coordY, coordX, coords[3]);
          }
          setOutput(outputValue);
        }
    `}}const XG={kernelName:Mh,backendName:"webgl",kernelFunc:({inputs:n,attrs:t,backend:e})=>{const{image:s}=n,{radians:r,fillValue:o,center:i}=t,a=e,c=new jG(s.shape,o),[l,u]=Ad(i,s.shape[1],s.shape[2]),h=[[l,u,Math.sin(r),Math.cos(r)]];return a.runWebGLProgram(c,[s],s.dtype,h)}};const YG=`
  // OpenGL ES does not support round function.
  // The algorithm is based on banker's rounding.
  float base = floor(x);
  if ((x - base) < 0.5) {
    return floor(x);
  } else if ((x - base) > 0.5) {
    return ceil(x);
  } else {
    if (mod(base, 2.0) == 0.0) {
      return base;
    } else {
      return base + 1.0;
    }
  }
`,ZG=St({opSnippet:YG}),JG={kernelName:hi,backendName:"webgl",kernelFunc:ZG};const QG="return inversesqrt(x);",tH=St({opSnippet:QG,cpuKernelImpl:v3}),eH={kernelName:di,backendName:"webgl",kernelFunc:tH};class Yy{constructor(t,e,s,r,o,i,a=!0){this.variableNames=["updates","indices","defaultValue"],this.outputShape=i;const c=Bt(o.length),l=Bt(i.length);let u="";s===1?u="i":s===2&&(u="i, j");const h=`getIndices(${u})`;let d="";r===1?d="i":r===2&&(d="i, coords[1]");const p=`getUpdates(${d})`,f=e>1?"strides[j]":"strides";this.userCode=`
        ${c} strides = ${c}(${o});

        void main() {
          ${l} coords = getOutputCoords();
          float sum = 0.0;
          bool found = false;
          for (int i = 0; i < ${t}; i++) {
            int flattenedIndex = 0;
            for (int j = 0; j < ${e}; j++) {
              int index = round(${h});
              flattenedIndex += index * ${f};
            }
            if (flattenedIndex == coords[0]) {
              sum += ${p};
              found = true;
            }
          }
          setOutput(mix(getDefaultValue(), sum, float(found)));
        }
      `}}function nH(n){const{inputs:t,backend:e,attrs:s}=n,{indices:r,updates:o}=t,{shape:i}=s,{sliceRank:a,numUpdates:c,sliceSize:l,strides:u,outputSize:h}=Si(o,r,i),d=[h/l,l];if(h===0)return e.makeTensorInfo(i,r.dtype);const p=et({inputs:{x:r},backend:e,attrs:{shape:[c,a]}}),f=et({inputs:{x:o},backend:e,attrs:{shape:[c,l]}}),m=e.makeTensorInfo([],"float32",new Float32Array([0])),g=new Yy(c,a,p.shape.length,f.shape.length,u,d),x=e.runWebGLProgram(g,[f,p,m],f.dtype),b=et({inputs:{x},backend:e,attrs:{shape:i}});return e.disposeIntermediateTensorInfo(p),e.disposeIntermediateTensorInfo(f),e.disposeIntermediateTensorInfo(x),e.disposeIntermediateTensorInfo(m),b}const sH={kernelName:rg,backendName:"webgl",kernelFunc:nH};class rH{constructor(t,e,s,r){this.variableNames=["sortedSequence","values"],this.customUniforms=[{name:"numInputs",type:"int"}],this.outputShape=[t,s];const o="while (left < right) {",i=`for (int i = 0; i < ${Math.ceil(Math.log2(e+1))}; ++i) { if (left >= right) break;`,a=W().getNumber("WEBGL_VERSION")===2?o:i,c=r==="left"?"<":"<=";this.userCode=`
       int findBound(int batch, float value) {
         int left = 0;
         int right = numInputs;
         int mid;
         ${a}
           mid = (left + right) / 2;
           if (getSortedSequence(batch, mid) ${c} value) {
             left = mid + 1;
           } else {
             right = mid;
           }
         }
         return right;
       }

       void main() {
         ivec2 coords = getOutputCoords();
         int batch = coords[0];
         int valueIndex = coords[1];

         float value = getValues(batch, valueIndex);

         setOutput(float(findBound(batch, value)));
       }
     `}}function oH(n){const{inputs:t,backend:e,attrs:s}=n,{sortedSequence:r,values:o}=t,{side:i}=s,a=new rH(r.shape[0],r.shape[1],o.shape[1],i),c=[[r.shape[1]]];return e.runWebGLProgram(a,[r,o],"int32",c)}const iH={kernelName:og,backendName:"webgl",kernelFunc:oH};class aH{constructor(t,e,s){this.variableNames=["c","a","b"],this.outputShape=e;let r,o;if(s>4)throw Error(`Where for rank ${s} is not yet supported`);if(s===1)o="resRC",r="resRC";else{const a=["resRC.x","resRC.y","resRC.z","resRC.w"],c=[],l=[];for(let u=0;u<e.length;u++)l.push(`${a[u]}`),u<t&&c.push(`${a[u]}`);r=c.join(),o=l.join()}const i=Bt(s);this.userCode=`
      void main() {
        ${i} resRC = getOutputCoords();
        float cVal = getC(${r});
        if (cVal >= 1.0) {
          setOutput(getA(${o}));
        } else {
          setOutput(getB(${o}));
        }
      }
    `}}function cH(n){const{inputs:t,backend:e}=n,{condition:s,t:r,e:o}=t,i=new aH(s.shape.length,r.shape,r.shape.length);return e.runWebGLProgram(i,[s,r,o],Ve(r.dtype,o.dtype))}const lH={kernelName:Hc,backendName:"webgl",kernelFunc:cH};const uH=`
  // Stable and Attracting Fixed Point (0, 1) for Normalized Weights.
  // see: https://arxiv.org/abs/1706.02515
  float scaleAlpha = ${pl};
  float scale = ${fl};
  return (x >= 0.0) ? scale * x : scaleAlpha * (exp(x) - 1.0);
`,hH=St({opSnippet:uH}),dH={kernelName:pi,backendName:"webgl",kernelFunc:hH};const pH=Zr+`
  return 1.0 / (1.0 + exp(-1.0 * x));
`,fH=`
  vec4 result = 1.0 / (1.0 + exp(-1.0 * x));
  bvec4 isNaN = isnan(x);

  result.r = isNaN.r ? x.r : result.r;
  result.g = isNaN.g ? x.g : result.g;
  result.b = isNaN.b ? x.b : result.b;
  result.a = isNaN.a ? x.a : result.a;

  return result;
`,mH=St({opSnippet:pH,packedOpSnippet:fH,cpuKernelImpl:k3}),gH={kernelName:xi,backendName:"webgl",kernelFunc:mH};const xH=`
  if (isnan(x)) { return 0.0; }
  return sign(x);
`,bH=St({opSnippet:xH}),yH={kernelName:gi,backendName:"webgl",kernelFunc:bH};const wH=Zr+`
  return sin(x);
`,IH=St({opSnippet:wH}),vH={kernelName:fi,backendName:"webgl",kernelFunc:IH};const CH=`
  float e2x = exp(x);
  return (e2x - 1.0 / e2x) / 2.0;
`,kH=St({opSnippet:CH}),$H={kernelName:mi,backendName:"webgl",kernelFunc:kH};const SH=`
  float epsilon = 1.1920928955078125e-7;
  float threshold = log(epsilon) + 2.0;

  bool too_large = x > -threshold;
  bool too_small = x < threshold;

  float result;
  float exp_x = exp(x);

  if (too_large){
    result = x;
  }
  else if (too_small){
    result = exp_x;
  }
  else{
    result = log(exp_x + 1.0);
  }
  return result;
`,NH=St({opSnippet:SH}),TH={kernelName:bi,backendName:"webgl",kernelFunc:NH};const EH=n=>{const{inputs:t,backend:e,attrs:s}=n,{x:r}=t,{blockShape:o,paddings:i}=s;S(r.shape.length<=4,()=>"spaceToBatchND for rank > 4 with a WebGL backend not implemented yet");const a=o.reduce((x,b)=>x*b),c=[[0,0]];c.push(...i);for(let x=1+o.length;x<r.shape.length;++x)c.push([0,0]);const l=[],u=jy({inputs:{x:r},backend:e,attrs:{paddings:c,constantValue:0}}),h=Ai(u.shape,o,a,!1),d=Fi(h.length,o.length,!1),p=Oi(u.shape,o,a,!1),f=et({inputs:{x:u},backend:e,attrs:{shape:h}}),m=Re({inputs:{x:f},backend:e,attrs:{perm:d}}),g=et({inputs:{x:m},backend:e,attrs:{shape:p}});return l.push(u),l.push(f),l.push(m),l.forEach(x=>e.disposeIntermediateTensorInfo(x)),g},RH={kernelName:jc,backendName:"webgl",kernelFunc:EH};function DH(n){const{inputs:t,backend:e}=n,{indices:s,values:r,denseShape:o,defaultValue:i}=t;if(o.shape.length!==1)throw new Error(`Dense shape must be a vector, saw:
         ${o.shape}`);if(s.shape.length!==2)throw new Error(`Indices must be a matrix, saw:
         ${s.shape}`);if(r.shape.length!==1)throw new Error(`Values must be a vector, saw:
         ${r.shape}`);if(i.shape.length!==0)throw new Error(`Default value must be a scalar, saw:
        ${i.shape}`);const a=e.readSync(s.dataId),c=e.readSync(r.dataId),l=e.readSync(o.dataId),u=e.readSync(i.dataId)[0],[h,d,p,f,m]=S3(a,s.shape,s.dtype,c,r.dtype,l,u);return[e.makeTensorInfo(d,s.dtype,h),e.makeTensorInfo([d[0]],r.dtype,p),e.makeTensorInfo([f.length],"bool",new Uint8Array(f.map(g=>Number(g)))),e.makeTensorInfo([m.length],s.dtype,new Int32Array(m))]}const AH={kernelName:kh,backendName:"webgl",kernelFunc:DH};function FH(n){const{inputs:t,backend:e}=n,{inputIndices:s,inputShape:r,newShape:o}=t;if(s.shape.length!==2)throw new Error(`Input indices should be a matrix but received shape ${s.shape}`);if(r.shape.length!==1)throw new Error(`Input shape should be a vector but received shape ${r.shape}`);if(o.shape.length!==1)throw new Error(`Target shape should be a vector but received shape ${o.shape}`);const i=Array.from(e.readSync(r.dataId)),a=e.readSync(s.dataId),c=Array.from(e.readSync(o.dataId)),[l,u,h]=N3(a,s.shape,s.dtype,i,c);return[e.makeTensorInfo(u,s.dtype,l),e.makeTensorInfo([h.length],o.dtype,new Int32Array(h))]}const OH={kernelName:$h,backendName:"webgl",kernelFunc:FH};function _H(n){const{inputs:t,backend:e}=n,{data:s,indices:r,segmentIds:o}=t;if(s.shape.length<1)throw new Error("Data should be at least 1 dimensional but received scalar");if(r.shape.length!==1)throw new Error(`Indices should be a vector but received shape
              ${r.shape}`);if(o.shape.length!==1)throw new Error(`Segment ids should be a vector but received shape
              ${o.shape}`);const i=e.readSync(s.dataId),a=e.readSync(r.dataId),c=e.readSync(o.dataId),[l,u]=yy(i,s.shape,s.dtype,a,c,!0);return e.makeTensorInfo(u,s.dtype,l)}const MH={kernelName:Sh,backendName:"webgl",kernelFunc:_H};function LH(n){const{inputs:t,backend:e}=n,{data:s,indices:r,segmentIds:o}=t;if(s.shape.length<1)throw new Error("Data should be at least 1 dimensional but received scalar");if(r.shape.length!==1)throw new Error(`Indices should be a vector but received shape
             ${r.shape}`);if(o.shape.length!==1)throw new Error(`Segment ids should be a vector but received shape
             ${o.shape}`);const i=e.readSync(s.dataId),a=e.readSync(r.dataId),c=e.readSync(o.dataId),[l,u]=yy(i,s.shape,s.dtype,a,c);return e.makeTensorInfo(u,s.dtype,l)}const PH={kernelName:Nh,backendName:"webgl",kernelFunc:LH};function BH(n){const{inputs:t,backend:e,attrs:s}=n,{sparseIndices:r,sparseValues:o,defaultValue:i}=t,{outputShape:a}=s,{sliceRank:c,numUpdates:l,sliceSize:u,strides:h,outputSize:d}=Si(o,r,a),p=!1;if(o.dtype==="string"){const x=e.bufferSync(r),b=e.bufferSync(o),w=us(e.readSync(i.dataId)[0]),y=C3(x,b,a,d,u,l,c,h,w,p);return e.makeTensorInfo(a,y.dtype,y.values)}const f=new Yy(l,c,r.shape.length,o.shape.length,h,[d,1],p),m=e.runWebGLProgram(f,[o,r,i],o.dtype),g=et({inputs:{x:m},backend:e,attrs:{shape:a}});return e.disposeIntermediateTensorInfo(m),g}const zH={kernelName:ig,backendName:"webgl",kernelFunc:BH};function VH(n){const{inputs:t,backend:e,attrs:s}=n,{x:r}=t,{numOrSizeSplits:o,axis:i}=s,a=wt(i,r.shape)[0],c=Kd(r,o,a),l=r.shape.length,u=new Array(l).fill(0),h=r.shape.slice();return c.map(d=>{const p=[...h];p[a]=d;const f=Jr({inputs:{x:r},backend:e,attrs:{begin:u,size:p}});return u[a]+=d,f})}const WH={kernelName:Xc,backendName:"webgl",kernelFunc:VH};const bm="return sqrt(x);",UH=St({opSnippet:bm,packedOpSnippet:bm,cpuKernelImpl:T3}),GH={kernelName:yi,backendName:"webgl",kernelFunc:UH};const HH="return x * x;",qH=St({opSnippet:HH}),KH={kernelName:Th,backendName:"webgl",kernelFunc:qH};const ym="return (a - b) * (a - b);",jH=Ie({opSnippet:ym,packedOpSnippet:ym}),XH={kernelName:wi,backendName:"webgl",kernelFunc:jH};function YH({inputs:n,attrs:t,backend:e}){const{x:s}=n,r=fn+`
    return x > 0.0 ? 1.0 : float(${t.alpha});
  `,o=new Gn(s.shape,r);return e.runWebGLProgram(o,[s],s.dtype)}const ZH={kernelName:$i,backendName:"webgl",kernelFunc:YH};class JH{constructor(t,e,s){this.variableNames=["x"],this.outputShape=s;const r=s.length,o=Bt(s.length),i=Bt(s.length);let a="";if(r===1)a="coords * strides + begin";else{let c=0;a=s.map((l,u)=>(c++,s.length===1?`coords * strides[${u}] + begin[${u}]`:`coords[${c-1}] * strides[${u}] + begin[${u}]`)).join(",")}this.userCode=`
      ${o} begin = ${o}(${t});
      ${o} strides = ${o}(${e});

      void main() {
        ${i} coords = getOutputCoords();
        setOutput(getX(${a}));
      }
    `}}function QH(n){const{inputs:t,backend:e,attrs:s}=n,{x:r}=t,{begin:o,end:i,strides:a,beginMask:c,endMask:l,ellipsisMask:u,newAxisMask:h,shrinkAxisMask:d}=s,{finalShapeSparse:p,finalShape:f,isIdentity:m,sliceDim0:g,isSimpleSlice:x,begin:b,end:w,strides:y}=Hh(r.shape,o,i,a,c,l,u,h,d);let I;if(m)I=et({inputs:{x:r},backend:e,attrs:{shape:f}});else if(g||x){S(r.shape.length>=1,()=>`Input must have rank at least 1, got: ${r.shape.length}`);const N=Wh(b,w,y),T=Jr({inputs:{x:r},backend:e,attrs:{begin:b,size:N}});I=et({inputs:{x:T},backend:e,attrs:{shape:f}}),e.disposeIntermediateTensorInfo(T)}else if(e.shouldExecuteOnCPU([r])){const T=e.readSync(r.dataId),$=yt(r.shape,r.dtype,T),k=E3(p,$,y,b);I=e.makeTensorInfo(f,r.dtype,k.values)}else{const T=new JH(b,y,p);I=e.runWebGLProgram(T,[r],r.dtype)}const C=et({inputs:{x:I},backend:e,attrs:{shape:f}});return e.disposeIntermediateTensorInfo(I),C}const tq={kernelName:Eh,backendName:"webgl",kernelFunc:QH};function eq(n){const{inputs:t,backend:e,attrs:s}=n,{separator:r,nGramWidths:o,leftPad:i,rightPad:a,padWidth:c,preserveShortSequences:l}=s,{data:u,dataSplits:h}=t,d=e.readSync(u.dataId),p=e.readSync(h.dataId),[f,m]=R3(d,p,r,o,i,a,c,l);return[e.makeTensorInfo([f.length],"string",f),e.makeTensorInfo(h.shape,"int32",m)]}const nq={kernelName:Rh,backendName:"webgl",kernelFunc:eq};function sq(n){const{inputs:t,backend:e,attrs:s}=n,{skipEmpty:r}=s,{input:o,delimiter:i}=t;if(o.dtype!=="string")throw new Error("Input must be of datatype string");if(o.shape.length!==1)throw new Error(`Input must be a vector, got shape: ${o.shape}`);if(i.shape.length!==0)throw new Error(`Delimiter must be a scalar, got shape: ${i.shape}`);const a=e.readSync(o.dataId),c=e.readSync(i.dataId)[0],[l,u,h]=D3(a,c,r),d=u.length;return[e.makeTensorInfo([d,2],"int32",l),e.makeTensorInfo([d],"string",u),e.makeTensorInfo([2],"int32",new Int32Array(h))]}const rq={kernelName:Dh,backendName:"webgl",kernelFunc:sq};function oq(n){const{inputs:t,backend:e,attrs:s}=n,{numBuckets:r}=s,{input:o}=t;if(o.dtype!=="string")throw new Error("Input must be of datatype string");if(r<=0)throw new Error("Number of buckets must be at least 1");const i=e.readSync(o.dataId),a=A3(i,r);return e.makeTensorInfo(o.shape,"int32",a)}const iq={kernelName:Ah,backendName:"webgl",kernelFunc:oq};const aq="return tan(x);",cq=St({opSnippet:aq}),lq={kernelName:vi,backendName:"webgl",kernelFunc:cq};const uq=`
  float e2x = exp(-2.0 * abs(x));
  return sign(x) * (1.0 - e2x) / (1.0 + e2x);
`,hq=St({opSnippet:uq}),dq={kernelName:Ci,backendName:"webgl",kernelFunc:hq};class pq{constructor(t,e){this.variableNames=["A"];const s=new Array(t.length);for(let i=0;i<s.length;i++)s[i]=t[i]*e[i];this.outputShape=s,this.rank=s.length;const r=Bt(this.rank),o=fq(t);this.userCode=`
      void main() {
        ${r} resRC = getOutputCoords();
        setOutput(getA(${o}));
      }
    `}}function fq(n){const t=n.length;if(t>5)throw Error(`Tile for rank ${t} is not yet supported`);if(t===1)return`imod(resRC, ${n[0]})`;const e=["resRC.x","resRC.y","resRC.z","resRC.w","resRC.u"],s=[];for(let r=0;r<n.length;r++)s.push(`imod(${e[r]}, ${n[r]})`);return s.join()}function Zy(n){const{inputs:t,backend:e,attrs:s}=n,{x:r}=t,{reps:o}=s;if(r.dtype==="string"||r.shape.length>5){const c=e.readSync(r.dataId),l=r.dtype==="string"?c.map(d=>us(d)):c,u=yt(r.shape,r.dtype,l),h=O3(u,o);return e.makeTensorInfo(h.shape,h.dtype,h.values)}const i=new pq(r.shape,o);return e.runWebGLProgram(i,[r],r.dtype)}const mq={kernelName:ki,backendName:"webgl",kernelFunc:Zy};class gq{constructor(t){this.variableNames=["x","indices"],this.customUniforms=[{name:"n",type:"int"},{name:"firstPass",type:"int"},{name:"negativeInf",type:"float"},{name:"dir",type:"int"},{name:"inc",type:"int"}],this.outputShape=t,this.userCode=`
       void main() {
         ivec2 coords = getOutputCoords();
         int batch = coords[0];
         int elemIdx = coords[1];

         // We compare elements pair-wise within a group of size 2 * inc.
         // The comparing rule for each group alternates between ascending
         // and descending. Within each group, we compare each pair at
         // positions i and i+inc. To decide whether an element at position i
         // is x0 or x1, we mod it by 2 * inc, if the result is smaller than
         // inc, it is in the first half of the group, we denote it as x0,
         // otherwise we denote it as x1.
         // For example, as shown in the Bitonic top K paper referenced above,
         // Figure5(a) shows that element[1] is in the
         // second half of the group when group size is 2, but it is in the
         // first half of the group when group size is 4.

         bool isFirstInPair = imod(elemIdx, 2 * inc) < inc;
         int i = isFirstInPair ? elemIdx : elemIdx - inc;

         int i0 = firstPass == 1 ? i : int(getIndices(batch, i));
         int i1 = firstPass == 1 ? i + inc : int(getIndices(batch, i + inc));
         float x0 = i0 < n ? getX(batch, i0) : negativeInf;
         float x1 = i1 < n ? getX(batch, i1) : negativeInf;

         // Denotes which direction indices are in (ascending or descending).
         bool reverse = imod(elemIdx, 2 * dir) >= dir;
         bool isGreater = x0 > x1 || (x0 == x1 && i1 > i0);
         if (reverse == isGreater) { // Elements in opposite order of direction
           int iTemp = i0;
           i0 = i1;
           i1 = iTemp;
         }
         if (isFirstInPair) {
            setOutput(float(i0));
         } else {
            setOutput(float(i1));
         }
       }
     `}}class xq{constructor(t){this.variableNames=["x","indices"],this.customUniforms=[{name:"n",type:"int"},{name:"firstPass",type:"int"},{name:"k",type:"int"}],this.outputShape=t,this.userCode=`
    void main() {
         // Takes max of indices (0, k), (1, k + 1), (2, k + 2) ...
         ivec2 coords = getOutputCoords();
         int batch = coords[0];
         int elemIdx = coords[1];

         // The output size is half of the previous size.
         // If the previous sequence is | | | | _ _ _ _  | | | |  _ _ _ _ (k=4),
         // we only need to output the indices at positions |, the indices at
         // positions _ can be thrown away, see Figure5(b) After Phase 2
         // (Merge phase) in the Bitonic Top K paper referenced above.
         // For example, the paper shows we only need to output the orange bars.
         // The output sequence should look like this | | | | | | | |.
         // Because the sequence is halved, to map the output index back
         // to the previous sequence to find the corresponding value,
         // we need to double the index. When we double the index,
         // we basically interpolate a position, so 2i looks like
         // | _ | _ | _ | _ | _ | _ | _. We move the | to the first k position
         // of each 2k positions by - elemIdx % k. E.g. for output at
         // index 4,5,6,7, we want to get the corresponding element at
         // original index 8,9,10,11, for output at index 8,9,10,11,
         // we want to get the corresponding element at original index
         // 16,17,18,19, so on and so forth.

         int i = elemIdx < k ? elemIdx : (elemIdx * 2 - imod(elemIdx, k));
         int i0 = firstPass == 1 ? i : int(getIndices(batch, i));
         int i1 = firstPass == 1 ? i + k : int(getIndices(batch, i + k));

         float x0 = getX(batch, i0);
         float x1 = i1 < n ? getX(batch, i1) : x0;

         setOutput(x0 >= x1 ? float(i0) : float(i1));
       }
     `}}function Rs(n,t){t!==null&&n.disposeIntermediateTensorInfo(t)}function wm(n){let t=1;for(;t<n;)t*=2;return t}function bq(n){const{inputs:t,backend:e,attrs:s}=n,{x:r}=t,{k:o,sorted:i}=s,a=W().getNumber("TOPK_LAST_DIM_CPU_HANDOFF_SIZE_THRESHOLD"),c=W().getNumber("TOPK_K_CPU_HANDOFF_THRESHOLD"),l=r.shape,u=l[l.length-1];if(e.shouldExecuteOnCPU([r])||u<a||o>c){const k=e.readSync(r.dataId),[v,R]=_3(k,l,r.dtype,o,i);return[e.makeTensorInfo(v.shape,v.dtype,v.values),e.makeTensorInfo(R.shape,R.dtype,R.values)]}if(o===0)return l[l.length-1]=0,[e.makeTensorInfo(l,r.dtype,[]),e.makeTensorInfo(l,"int32",[])];if(u===1)return[r,Zi({attrs:{shape:l,dtype:"int32",value:0},backend:e})];const h=e.texData.get(r.dataId),d=h!==null&&h.isPacked,p=d?e.unpackTensor(r):r,m=q(l)/u,g=et({inputs:{x:p},attrs:{shape:[m,u]},backend:e});d&&Rs(e,p);const x=wm(o),b=wm(u);let w=null;const y=()=>w===null?[g,g]:[g,w],I=(k,v,R)=>{const _=y(),P=new gq(R),B=[[u],[w===null?1:0],[Number.NEGATIVE_INFINITY],[k],[v]],U=w;w=e.runWebGLProgram(P,_,"int32",B),Rs(e,U)};for(let k=1;k<x;k*=2){const v=k*2;for(let R=k;R>=1;R/=2)I(v,R,[m,b])}for(let k=b;k>x;k/=2){const v=y(),R=new xq([m,k/2]),P=[[u],[w===null?1:0],[x]],L=w;w=e.runWebGLProgram(R,v,"int32",P),Rs(e,L);const B=x/2,U=B*2;for(let V=B;V>=1;V/=2)I(U,V,w.shape)}let C=w;w=Jr({inputs:{x:w},backend:e,attrs:{begin:0,size:[m,o]}}),Rs(e,C);let N=Wy({inputs:{x:g,indices:w},backend:e,attrs:{axis:1,batchDims:1}});Rs(e,g);const T=l.slice(0,-1);T.push(o),C=w,w=et({inputs:{x:w},attrs:{shape:T},backend:e}),Rs(e,C);const $=N;return N=et({inputs:{x:N},attrs:{shape:T},backend:e}),Rs(e,$),[N,w]}const yq={kernelName:Fh,backendName:"webgl",kernelFunc:bq};class wq{constructor(t,e,s,r,o,i){this.variableNames=["Image","Transforms"],this.outputShape=i;const a=s==="nearest"?1:2;let c;switch(r){case"constant":c=1;break;case"reflect":c=2;break;case"wrap":c=3;break;case"nearest":c=4;break;default:c=1;break}this.userCode=`
            float mapCoord(float outCoord, float len) {
              float inCoord = outCoord;
              if(${c} == 2) {
                if (inCoord < 0.0) {
                  if (len <= 1.0) {
                    inCoord = 0.0;
                  } else {
                    float sz2 = 2.0 * len;
                    if (inCoord < sz2) {
                      inCoord = sz2 * float(int(float(-inCoord / sz2))) +
                      inCoord;
                    }
                    inCoord = inCoord < -len ? inCoord + sz2 : -inCoord - 1.0;
                  }
                } else if (inCoord > len - 1.0) {
                  if (len <= 1.0) {
                    inCoord = 0.0;
                  } else {
                    float sz2 = 2.0 * len;
                    inCoord -= sz2 * float(int(float(inCoord / sz2)));
                    if (inCoord >= len) {
                      inCoord = sz2 - inCoord - 1.0;
                    }
                  }
                }
                return clamp(inCoord, 0.0, len - 1.0);
              } else if (${c} == 3) {
                if (inCoord < 0.0) {
                  if (len <= 1.0) {
                    inCoord = 0.0;
                  } else {
                    float sz = len - 1.0;
                    inCoord += len * (float(int(float(-inCoord / sz))) + 1.0);
                  }
                } else if (inCoord > len - 1.0) {
                  if (len <= 1.0) {
                    inCoord = 0.0;
                  } else {
                    float sz = len - 1.0;
                    inCoord -= len * float(int(float(inCoord / sz)));
                  }
                }
                return clamp(inCoord, 0.0, len - 1.0);
              } else if (${c} == 4) {
                return clamp(outCoord, 0.0, len - 1.0);
              } else {
                return outCoord;
              }
            }

            float readWithFillValue(int batch, int coordY, int coordX,
              int channel) {
              float outputValue;
              if (0 <= coordY && coordY < ${t} && 0 <= coordX && coordX < ${e}) {
                  outputValue = getImage(batch, coordY, coordX, channel);
              } else {
                outputValue = float(${o});
              }
              return outputValue;
            }

            void main() {
              ivec4 coords = getOutputCoords();
              float outputValue;
              int batch = coords[0];
              int x = coords[2];
              int y = coords[1];
              int channel = coords[3];
              float xf = float(x);
              float yf = float(y);
              float a1 = getTransforms(batch, 0);
              float a2 = getTransforms(batch, 1);
              float a3 = getTransforms(batch, 2);
              float b1 = getTransforms(batch, 3);
              float b2 = getTransforms(batch, 4);
              float b3 = getTransforms(batch, 5);
              float c1 = getTransforms(batch, 6);
              float c2 = getTransforms(batch, 7);
              float projection = c1 * xf + c2 * yf + 1.0;
              if (projection == 0.0) {
                outputValue = float(${o});
              } else {
                float inX = (a1 * xf + a2 * yf + a3) / projection;
                float inY = (b1 * xf + b2 * yf + b3) / projection;
                float mapX = mapCoord(inX, float(${e}));
                float mapY = mapCoord(inY, float(${t}));

                if (${a} == 1) {
                  int coordY = int(round(mapY));
                  int coordX = int(round(mapX));
                  outputValue = readWithFillValue(batch, coordY, coordX,
                    channel);
                } else {
                  float yFloor = floor(mapY);
                  float xFloor = floor(mapX);
                  float yCeil = yFloor + 1.0;
                  float xCeil = xFloor + 1.0;
                  float valueYFloor = (xCeil - mapX) *
                  readWithFillValue(batch, int(yFloor), int(xFloor), channel) +
                  (mapX - xFloor) *
                  readWithFillValue(batch, int(yFloor), int(xCeil), channel);
                  float valueYCeil = (xCeil - mapX) *
                  readWithFillValue(batch, int(yCeil), int(xFloor), channel) +
                  (mapX - xFloor) *
                  readWithFillValue(batch, int(yCeil), int(xCeil), channel);
                  outputValue = (yCeil - mapY) * valueYFloor +
                  (mapY - yFloor) * valueYCeil;
                }
              }
              setOutput(outputValue);
            }
        `}}function Iq(n){const{inputs:t,backend:e,attrs:s}=n,{image:r,transforms:o}=t,{interpolation:i,fillMode:a,fillValue:c,outputShape:l}=s,[u,h,d,p]=r.shape,[f,m]=l??[h,d],g=[u,f,m,p],x=new wq(h,d,i,a,c,g);return e.runWebGLProgram(x,[r,o],"float32")}const vq={kernelName:Oh,backendName:"webgl",kernelFunc:Iq};function Cq(n){const{inputs:t,attrs:e,backend:s}=n,{axis:r}=e,{x:o}=t;qi(o,"unique"),console.warn("WARNING: ","UI might be locked temporarily as data is being downloaded");const i=s.readSync(o.dataId),{outputValues:a,outputShape:c,indices:l}=M3(i,r,o.shape,o.dtype);return[s.makeTensorInfo(c,o.dtype,a),s.makeTensorInfo([l.length],"int32",l)]}const kq={kernelName:_h,backendName:"webgl",kernelFunc:Cq};function $q(n){const{inputs:t,backend:e,attrs:s}=n,{value:r}=t;let{axis:o}=s;o<0&&(o+=r.shape.length);const i=r,a=i.shape.length,c=r.shape[o],l=new Array(a-1);let u=0;for(let m=0;m<a;m++)m!==o&&(l[u++]=i.shape[m]);const h=[],d=new Array(a).fill(0),p=i.shape.slice();p[o]=1;const f=new Array(c);for(let m=0;m<f.length;m++){d[o]=m;const g=Jr({inputs:{x:i},backend:e,attrs:{begin:d,size:p}}),x=et({inputs:{x:g},backend:e,attrs:{shape:l}});f[m]=x,h.push(g)}return h.forEach(m=>e.disposeIntermediateTensorInfo(m)),f}const Sq={kernelName:Zc,backendName:"webgl",kernelFunc:$q};class Nq{constructor(t,e){this.variableNames=["x","segmentIds"];const s=t.windowSize,r=t.batchSize,o=t.inSize,i=t.numSegments,a=i*Math.ceil(o/s);this.outputShape=[r,a];const c="0.0",l="sumValue",u=Math.floor(s/4)*4,h=s%4,d=`
        sumValue += dot(values, segFilter);
    `;let p="";o%s>0&&(p=`
        if (inIdx < 0 || inIdx >= ${o}) {
          return initializationValue;
        }
      `);let f="";o%s>0&&(f=`
        if (inIdx < 0 || inIdx >= ${o}) {
          return -1.0;
        }
      `),this.userCode=`
      const float initializationValue = ${c};

      float getValue(int batch, int inIdx) {
        ${p}
        return getX(batch, inIdx);
      }

      float getSegmentIdAtIndex(int inIdx) {
        ${f}
        return getSegmentIds(inIdx);
      }

      void main() {
        ivec2 coords = getOutputCoords();
        int batch = coords[0];
        int outIdx = coords[1];
        int inOffset = int(floor(float(outIdx) / float(
          ${i})) * float(${s}));
        int currentSeg = int(mod(float(outIdx), float(${i})));

        float sumValue = 0.0;

        for (int i = 0; i < ${u}; i += 4) {
          int inIdx = inOffset + i;
          vec4 values = vec4(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1),
            getValue(batch, inIdx + 2),
            getValue(batch, inIdx + 3)
          );

          vec4 segFilter = vec4(
            int(getSegmentIdAtIndex(inIdx)) == currentSeg ? 1 : 0,
            int(getSegmentIdAtIndex(inIdx + 1)) == currentSeg ? 1 : 0,
            int(getSegmentIdAtIndex(inIdx + 2)) == currentSeg ? 1 : 0,
            int(getSegmentIdAtIndex(inIdx + 3)) == currentSeg ? 1 : 0
          );

          ${d}
        }

        int inIdx = inOffset + ${u};
        if (${h===1}) {
          vec4 values = vec4(
            getValue(batch, inIdx),
            initializationValue,
            initializationValue,
            initializationValue
          );

          int inIdxSeg = int(getSegmentIdAtIndex(inIdx));

          vec4 segFilter = vec4(
            int(getSegmentIdAtIndex(inIdx)) == currentSeg ? 1 : 0,
            0,
            0,
            0
          );

          ${d}
        } else if (${h===2}) {
          vec4 values = vec4(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1),
            initializationValue,
            initializationValue
          );

          vec4 segFilter = vec4(
            int(getSegmentIdAtIndex(inIdx)) == currentSeg ? 1 : 0,
            int(getSegmentIdAtIndex(inIdx + 1)) == currentSeg ? 1 : 0,
              0,
              0
          );

          ${d}
        } else if (${h===3}) {
          vec4 values = vec4(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1),
            getValue(batch, inIdx + 2),
            initializationValue
          );

          vec4 segFilter = vec4(
            int(getSegmentIdAtIndex(inIdx)) == currentSeg ? 1 : 0,
            int(getSegmentIdAtIndex(inIdx + 1)) == currentSeg ? 1 : 0,
            int(getSegmentIdAtIndex(inIdx + 2)) == currentSeg ? 1 : 0,
            0
          );

          ${d}
        }
        setOutput(${l});
      }
    `}}function Tq(n){const{inputs:t,backend:e,attrs:s}=n,{x:r,segmentIds:o}=t,{numSegments:i}=s,a=r.shape.length,c=[];let l=0;const u=Kt([l],a);let h=r;u!=null&&(h=Re({inputs:{x:r},backend:e,attrs:{perm:u}}),c.push(h),l=Qt(1,a)[0]);const d=Ux(h.shape,l,i),p=q([h.shape[l]]),f=et({inputs:{x:h},backend:e,attrs:{shape:[-1,p]}});c.push(f);const m=Lh(r.dtype),g=(y,I,C,N,T)=>{const $=y.shape[0],k=y.shape[1],v=Wx(k,T),R={windowSize:v,inSize:k,batchSize:$,numSegments:T},_=new Nq(R,I),P=e.compileAndRun(_,[y,C],N);if(c.push(P),P.shape[1]===T)return P;const L=Xy({backend:e,attrs:{start:0,stop:T,step:1,dtype:"float32"}}),B=Zy({inputs:{x:L},backend:e,attrs:{reps:[k/v]}});return c.push(L),c.push(B),g(P,I,B,N,T)},x=g(f,"unsortedSegmentSum",o,m,i),b=et({inputs:{x},backend:e,attrs:{shape:d}});let w=b;if(u!=null){c.push(b);const y=ys(u);w=Re({inputs:{x:w},backend:e,attrs:{perm:y}})}return c.forEach(y=>e.disposeIntermediateTensorInfo(y)),w}const Eq={kernelName:Jc,backendName:"webgl",kernelFunc:Tq};const Rq=[NB,EB,AB,_B,LB,zB,WB,GB,jB,YB,QB,nz,oz,lz,dz,fz,gz,wz,vz,kz,Tz,_z,Lz,Bz,Hz,Kz,Zz,uB,tV,oV,lV,mV,xV,yV,IV,CV,SV,EV,AV,OV,MV,PV,VV,UV,KV,XV,JV,e4,s4,a4,h4,m4,b4,I4,v4,k4,S4,T4,R4,A4,M4,B4,W4,G4,K4,Y4,tW,rW,lB,iW,sV,lW,dW,mW,dB,yW,CW,$W,EW,AW,MW,BW,UW,KW,YW,JW,nU,rU,iU,uU,dU,fU,gU,bU,vU,SU,RU,PU,mB,WU,HU,jU,ZU,Vz,tG,nG,rG,aG,hG,fB,pG,mG,xG,bG,Wz,OU,IG,$G,EG,xB,FG,MG,zG,UG,KG,XG,JG,eH,sH,iH,lH,dH,gH,yH,vH,$H,Fz,MU,TH,RH,AH,OH,MH,PH,zH,WH,GH,KH,XH,ZH,tq,nq,rq,iq,_U,kB,lq,dq,mq,yq,vq,$B,kq,Sq,Eq,eG];for(const n of Rq)cg(n);var Ds={},da={},Ql,Im;function Dq(){if(Im)return Ql;Im=1;function n(r){var o=new s(r),i=o.readChunk();if(i.id!="MThd")throw"Bad MIDI file.  Expected 'MHdr', got: '"+i.id+"'";for(var a=t(i.data),c=[],l=0;!o.eof()&&l<a.numTracks;l++){var u=o.readChunk();if(u.id!="MTrk")throw"Bad MIDI file.  Expected 'MTrk', got: '"+u.id+"'";var h=e(u.data);c.push(h)}return{header:a,tracks:c}}function t(r){var o=new s(r),i=o.readUInt16(),a=o.readUInt16(),c={format:i,numTracks:a},l=o.readUInt16();return l&32768?(c.framesPerSecond=256-(l>>8),c.ticksPerFrame=l&255):c.ticksPerBeat=l,c}function e(r){for(var o=new s(r),i=[];!o.eof();){var a=l();i.push(a)}return i;var c;function l(){var u={};u.deltaTime=o.readVarInt();var h=o.readUInt8();if((h&240)===240)if(h===255){u.meta=!0;var d=o.readUInt8(),p=o.readVarInt();switch(d){case 0:if(u.type="sequenceNumber",p!==2)throw"Expected length for sequenceNumber event is 2, got "+p;return u.number=o.readUInt16(),u;case 1:return u.type="text",u.text=o.readString(p),u;case 2:return u.type="copyrightNotice",u.text=o.readString(p),u;case 3:return u.type="trackName",u.text=o.readString(p),u;case 4:return u.type="instrumentName",u.text=o.readString(p),u;case 5:return u.type="lyrics",u.text=o.readString(p),u;case 6:return u.type="marker",u.text=o.readString(p),u;case 7:return u.type="cuePoint",u.text=o.readString(p),u;case 32:if(u.type="channelPrefix",p!=1)throw"Expected length for channelPrefix event is 1, got "+p;return u.channel=o.readUInt8(),u;case 33:if(u.type="portPrefix",p!=1)throw"Expected length for portPrefix event is 1, got "+p;return u.port=o.readUInt8(),u;case 47:if(u.type="endOfTrack",p!=0)throw"Expected length for endOfTrack event is 0, got "+p;return u;case 81:if(u.type="setTempo",p!=3)throw"Expected length for setTempo event is 3, got "+p;return u.microsecondsPerBeat=o.readUInt24(),u;case 84:if(u.type="smpteOffset",p!=5)throw"Expected length for smpteOffset event is 5, got "+p;var f=o.readUInt8(),m={0:24,32:25,64:29,96:30};return u.frameRate=m[f&96],u.hour=f&31,u.min=o.readUInt8(),u.sec=o.readUInt8(),u.frame=o.readUInt8(),u.subFrame=o.readUInt8(),u;case 88:if(u.type="timeSignature",p!=2&&p!=4)throw"Expected length for timeSignature event is 4 or 2, got "+p;return u.numerator=o.readUInt8(),u.denominator=1<<o.readUInt8(),p===4?(u.metronome=o.readUInt8(),u.thirtyseconds=o.readUInt8()):(u.metronome=36,u.thirtyseconds=8),u;case 89:if(u.type="keySignature",p!=2)throw"Expected length for keySignature event is 2, got "+p;return u.key=o.readInt8(),u.scale=o.readUInt8(),u;case 127:return u.type="sequencerSpecific",u.data=o.readBytes(p),u;default:return u.type="unknownMeta",u.data=o.readBytes(p),u.metatypeByte=d,u}}else if(h==240){u.type="sysEx";var p=o.readVarInt();return u.data=o.readBytes(p),u}else if(h==247){u.type="endSysEx";var p=o.readVarInt();return u.data=o.readBytes(p),u}else throw"Unrecognised MIDI event type byte: "+h;else{var g;if((h&128)===0){if(c===null)throw"Running status byte encountered before status byte";g=h,h=c,u.running=!0}else g=o.readUInt8(),c=h;var x=h>>4;switch(u.channel=h&15,x){case 8:return u.type="noteOff",u.noteNumber=g,u.velocity=o.readUInt8(),u;case 9:var b=o.readUInt8();return u.type=b===0?"noteOff":"noteOn",u.noteNumber=g,u.velocity=b,b===0&&(u.byte9=!0),u;case 10:return u.type="noteAftertouch",u.noteNumber=g,u.amount=o.readUInt8(),u;case 11:return u.type="controller",u.controllerType=g,u.value=o.readUInt8(),u;case 12:return u.type="programChange",u.programNumber=g,u;case 13:return u.type="channelAftertouch",u.amount=g,u;case 14:return u.type="pitchBend",u.value=g+(o.readUInt8()<<7)-8192,u;default:throw"Unrecognised MIDI event type: "+x}}}}function s(r){this.buffer=r,this.bufferLen=this.buffer.length,this.pos=0}return s.prototype.eof=function(){return this.pos>=this.bufferLen},s.prototype.readUInt8=function(){var r=this.buffer[this.pos];return this.pos+=1,r},s.prototype.readInt8=function(){var r=this.readUInt8();return r&128?r-256:r},s.prototype.readUInt16=function(){var r=this.readUInt8(),o=this.readUInt8();return(r<<8)+o},s.prototype.readInt16=function(){var r=this.readUInt16();return r&32768?r-65536:r},s.prototype.readUInt24=function(){var r=this.readUInt8(),o=this.readUInt8(),i=this.readUInt8();return(r<<16)+(o<<8)+i},s.prototype.readInt24=function(){var r=this.readUInt24();return r&8388608?r-16777216:r},s.prototype.readUInt32=function(){var r=this.readUInt8(),o=this.readUInt8(),i=this.readUInt8(),a=this.readUInt8();return(r<<24)+(o<<16)+(i<<8)+a},s.prototype.readBytes=function(r){var o=this.buffer.slice(this.pos,this.pos+r);return this.pos+=r,o},s.prototype.readString=function(r){var o=this.readBytes(r);return String.fromCharCode.apply(null,o)},s.prototype.readVarInt=function(){for(var r=0;!this.eof();){var o=this.readUInt8();if(o&128)r+=o&127,r<<=7;else return r+o}return r},s.prototype.readChunk=function(){var r=this.readString(4),o=this.readUInt32(),i=this.readBytes(o);return{id:r,length:o,data:i}},Ql=n,Ql}var tu,vm;function Aq(){if(vm)return tu;vm=1;function n(o,i){if(typeof o!="object")throw"Invalid MIDI data";i=i||{};var a=o.header||{},c=o.tracks||[],l,u=c.length,h=new r;for(t(h,a,u),l=0;l<u;l++)e(h,c[l],i);return h.buffer}function t(o,i,a){var c=i.format==null?1:i.format,l=128;i.timeDivision?l=i.timeDivision:i.ticksPerFrame&&i.framesPerSecond?l=-(i.framesPerSecond&255)<<8|i.ticksPerFrame&255:i.ticksPerBeat&&(l=i.ticksPerBeat&32767);var u=new r;u.writeUInt16(c),u.writeUInt16(a),u.writeUInt16(l),o.writeChunk("MThd",u.buffer)}function e(o,i,a){var c=new r,l,u=i.length,h=null;for(l=0;l<u;l++)(a.running===!1||!a.running&&!i[l].running)&&(h=null),h=s(c,i[l],h,a.useByte9ForNoteOff);o.writeChunk("MTrk",c.buffer)}function s(o,i,a,c){var l=i.type,u=i.deltaTime,h=i.text||"",d=i.data||[],p=null;switch(o.writeVarInt(u),l){case"sequenceNumber":o.writeUInt8(255),o.writeUInt8(0),o.writeVarInt(2),o.writeUInt16(i.number);break;case"text":o.writeUInt8(255),o.writeUInt8(1),o.writeVarInt(h.length),o.writeString(h);break;case"copyrightNotice":o.writeUInt8(255),o.writeUInt8(2),o.writeVarInt(h.length),o.writeString(h);break;case"trackName":o.writeUInt8(255),o.writeUInt8(3),o.writeVarInt(h.length),o.writeString(h);break;case"instrumentName":o.writeUInt8(255),o.writeUInt8(4),o.writeVarInt(h.length),o.writeString(h);break;case"lyrics":o.writeUInt8(255),o.writeUInt8(5),o.writeVarInt(h.length),o.writeString(h);break;case"marker":o.writeUInt8(255),o.writeUInt8(6),o.writeVarInt(h.length),o.writeString(h);break;case"cuePoint":o.writeUInt8(255),o.writeUInt8(7),o.writeVarInt(h.length),o.writeString(h);break;case"channelPrefix":o.writeUInt8(255),o.writeUInt8(32),o.writeVarInt(1),o.writeUInt8(i.channel);break;case"portPrefix":o.writeUInt8(255),o.writeUInt8(33),o.writeVarInt(1),o.writeUInt8(i.port);break;case"endOfTrack":o.writeUInt8(255),o.writeUInt8(47),o.writeVarInt(0);break;case"setTempo":o.writeUInt8(255),o.writeUInt8(81),o.writeVarInt(3),o.writeUInt24(i.microsecondsPerBeat);break;case"smpteOffset":o.writeUInt8(255),o.writeUInt8(84),o.writeVarInt(5);var f={24:0,25:32,29:64,30:96},m=i.hour&31|f[i.frameRate];o.writeUInt8(m),o.writeUInt8(i.min),o.writeUInt8(i.sec),o.writeUInt8(i.frame),o.writeUInt8(i.subFrame);break;case"timeSignature":o.writeUInt8(255),o.writeUInt8(88),o.writeVarInt(4),o.writeUInt8(i.numerator);var g=Math.floor(Math.log(i.denominator)/Math.LN2)&255;o.writeUInt8(g),o.writeUInt8(i.metronome),o.writeUInt8(i.thirtyseconds||8);break;case"keySignature":o.writeUInt8(255),o.writeUInt8(89),o.writeVarInt(2),o.writeInt8(i.key),o.writeUInt8(i.scale);break;case"sequencerSpecific":o.writeUInt8(255),o.writeUInt8(127),o.writeVarInt(d.length),o.writeBytes(d);break;case"unknownMeta":i.metatypeByte!=null&&(o.writeUInt8(255),o.writeUInt8(i.metatypeByte),o.writeVarInt(d.length),o.writeBytes(d));break;case"sysEx":o.writeUInt8(240),o.writeVarInt(d.length),o.writeBytes(d);break;case"endSysEx":o.writeUInt8(247),o.writeVarInt(d.length),o.writeBytes(d);break;case"noteOff":var x=c!==!1&&i.byte9||c&&i.velocity==0?144:128;p=x|i.channel,p!==a&&o.writeUInt8(p),o.writeUInt8(i.noteNumber),o.writeUInt8(i.velocity);break;case"noteOn":p=144|i.channel,p!==a&&o.writeUInt8(p),o.writeUInt8(i.noteNumber),o.writeUInt8(i.velocity);break;case"noteAftertouch":p=160|i.channel,p!==a&&o.writeUInt8(p),o.writeUInt8(i.noteNumber),o.writeUInt8(i.amount);break;case"controller":p=176|i.channel,p!==a&&o.writeUInt8(p),o.writeUInt8(i.controllerType),o.writeUInt8(i.value);break;case"programChange":p=192|i.channel,p!==a&&o.writeUInt8(p),o.writeUInt8(i.programNumber);break;case"channelAftertouch":p=208|i.channel,p!==a&&o.writeUInt8(p),o.writeUInt8(i.amount);break;case"pitchBend":p=224|i.channel,p!==a&&o.writeUInt8(p);var b=8192+i.value,w=b&127,y=b>>7&127;o.writeUInt8(w),o.writeUInt8(y);break;default:throw"Unrecognized event type: "+l}return p}function r(){this.buffer=[]}return r.prototype.writeUInt8=function(o){this.buffer.push(o&255)},r.prototype.writeInt8=r.prototype.writeUInt8,r.prototype.writeUInt16=function(o){var i=o>>8&255,a=o&255;this.writeUInt8(i),this.writeUInt8(a)},r.prototype.writeInt16=r.prototype.writeUInt16,r.prototype.writeUInt24=function(o){var i=o>>16&255,a=o>>8&255,c=o&255;this.writeUInt8(i),this.writeUInt8(a),this.writeUInt8(c)},r.prototype.writeInt24=r.prototype.writeUInt24,r.prototype.writeUInt32=function(o){var i=o>>24&255,a=o>>16&255,c=o>>8&255,l=o&255;this.writeUInt8(i),this.writeUInt8(a),this.writeUInt8(c),this.writeUInt8(l)},r.prototype.writeInt32=r.prototype.writeUInt32,r.prototype.writeBytes=function(o){this.buffer=this.buffer.concat(Array.prototype.slice.call(o,0))},r.prototype.writeString=function(o){var i,a=o.length,c=[];for(i=0;i<a;i++)c.push(o.codePointAt(i));this.writeBytes(c)},r.prototype.writeVarInt=function(o){if(o<0)throw"Cannot write negative variable-length integer";if(o<=127)this.writeUInt8(o);else{var i=o,a=[];for(a.push(i&127),i>>=7;i;){var c=i&127|128;a.push(c),i>>=7}this.writeBytes(a.reverse())}},r.prototype.writeChunk=function(o,i){this.writeString(o),this.writeUInt32(i.length),this.writeBytes(i)},tu=n,tu}var Cm;function Jy(){return Cm||(Cm=1,da.parseMidi=Dq(),da.writeMidi=Aq()),da}var eu={},As={},km;function Qy(){if(km)return As;km=1,Object.defineProperty(As,"__esModule",{value:!0}),As.insert=As.search=void 0;function n(e,s,r){r===void 0&&(r="ticks");var o=0,i=e.length,a=i;if(i>0&&e[i-1][r]<=s)return i-1;for(;o<a;){var c=Math.floor(o+(a-o)/2),l=e[c],u=e[c+1];if(l[r]===s){for(var h=c;h<e.length;h++){var d=e[h];d[r]===s&&(c=h)}return c}else{if(l[r]<s&&u[r]>s)return c;l[r]>s?a=c:l[r]<s&&(o=c+1)}}return-1}As.search=n;function t(e,s,r){if(r===void 0&&(r="ticks"),e.length){var o=n(e,s[r],r);e.splice(o+1,0,s)}else e.push(s)}return As.insert=t,As}var $m;function Wu(){return $m||($m=1,function(n){Object.defineProperty(n,"__esModule",{value:!0}),n.Header=n.keySignatureKeys=void 0;var t=Qy(),e=new WeakMap;n.keySignatureKeys=["Cb","Gb","Db","Ab","Eb","Bb","F","C","G","D","A","E","B","F#","C#"];var s=function(){function r(o){var i=this;if(this.tempos=[],this.timeSignatures=[],this.keySignatures=[],this.meta=[],this.name="",e.set(this,480),o){e.set(this,o.header.ticksPerBeat),o.tracks.forEach(function(c){c.forEach(function(l){l.meta&&(l.type==="timeSignature"?i.timeSignatures.push({ticks:l.absoluteTime,timeSignature:[l.numerator,l.denominator]}):l.type==="setTempo"?i.tempos.push({bpm:6e7/l.microsecondsPerBeat,ticks:l.absoluteTime}):l.type==="keySignature"&&i.keySignatures.push({key:n.keySignatureKeys[l.key+7],scale:l.scale===0?"major":"minor",ticks:l.absoluteTime}))})});var a=0;o.tracks[0].forEach(function(c){a+=c.deltaTime,c.meta&&(c.type==="trackName"?i.name=c.text:(c.type==="text"||c.type==="cuePoint"||c.type==="marker"||c.type==="lyrics")&&i.meta.push({text:c.text,ticks:a,type:c.type}))}),this.update()}}return r.prototype.update=function(){var o=this,i=0,a=0;this.tempos.sort(function(c,l){return c.ticks-l.ticks}),this.tempos.forEach(function(c,l){var u=l>0?o.tempos[l-1].bpm:o.tempos[0].bpm,h=c.ticks/o.ppq-a,d=60/u*h;c.time=d+i,i=c.time,a+=h}),this.timeSignatures.sort(function(c,l){return c.ticks-l.ticks}),this.timeSignatures.forEach(function(c,l){var u=l>0?o.timeSignatures[l-1]:o.timeSignatures[0],h=(c.ticks-u.ticks)/o.ppq,d=h/u.timeSignature[0]/(u.timeSignature[1]/4);u.measures=u.measures||0,c.measures=d+u.measures})},r.prototype.ticksToSeconds=function(o){var i=(0,t.search)(this.tempos,o);if(i!==-1){var a=this.tempos[i],c=a.time,l=(o-a.ticks)/this.ppq;return c+60/a.bpm*l}else{var u=o/this.ppq;return 60/120*u}},r.prototype.ticksToMeasures=function(o){var i=(0,t.search)(this.timeSignatures,o);if(i!==-1){var a=this.timeSignatures[i],c=(o-a.ticks)/this.ppq;return a.measures+c/(a.timeSignature[0]/a.timeSignature[1])/4}else return o/this.ppq/4},Object.defineProperty(r.prototype,"ppq",{get:function(){return e.get(this)},enumerable:!1,configurable:!0}),r.prototype.secondsToTicks=function(o){var i=(0,t.search)(this.tempos,o,"time");if(i!==-1){var a=this.tempos[i],c=a.time,l=o-c,u=l/(60/a.bpm);return Math.round(a.ticks+u*this.ppq)}else{var h=o/.5;return Math.round(h*this.ppq)}},r.prototype.toJSON=function(){return{keySignatures:this.keySignatures,meta:this.meta,name:this.name,ppq:this.ppq,tempos:this.tempos.map(function(o){return{bpm:o.bpm,ticks:o.ticks}}),timeSignatures:this.timeSignatures}},r.prototype.fromJSON=function(o){this.name=o.name,this.tempos=o.tempos.map(function(i){return Object.assign({},i)}),this.timeSignatures=o.timeSignatures.map(function(i){return Object.assign({},i)}),this.keySignatures=o.keySignatures.map(function(i){return Object.assign({},i)}),this.meta=o.meta.map(function(i){return Object.assign({},i)}),e.set(this,o.ppq),this.update()},r.prototype.setTempo=function(o){this.tempos=[{bpm:o,ticks:0}],this.update()},r}();n.Header=s}(eu)),eu}var ro={},nu={},Sm;function tw(){return Sm||(Sm=1,function(n){Object.defineProperty(n,"__esModule",{value:!0}),n.ControlChange=n.controlChangeIds=n.controlChangeNames=void 0,n.controlChangeNames={1:"modulationWheel",2:"breath",4:"footController",5:"portamentoTime",7:"volume",8:"balance",10:"pan",64:"sustain",65:"portamentoTime",66:"sostenuto",67:"softPedal",68:"legatoFootswitch",84:"portamentoControl"},n.controlChangeIds=Object.keys(n.controlChangeNames).reduce(function(r,o){return r[n.controlChangeNames[o]]=o,r},{});var t=new WeakMap,e=new WeakMap,s=function(){function r(o,i){t.set(this,i),e.set(this,o.controllerType),this.ticks=o.absoluteTime,this.value=o.value}return Object.defineProperty(r.prototype,"number",{get:function(){return e.get(this)},enumerable:!1,configurable:!0}),Object.defineProperty(r.prototype,"name",{get:function(){return n.controlChangeNames[this.number]?n.controlChangeNames[this.number]:null},enumerable:!1,configurable:!0}),Object.defineProperty(r.prototype,"time",{get:function(){var o=t.get(this);return o.ticksToSeconds(this.ticks)},set:function(o){var i=t.get(this);this.ticks=i.secondsToTicks(o)},enumerable:!1,configurable:!0}),r.prototype.toJSON=function(){return{number:this.number,ticks:this.ticks,time:this.time,value:this.value}},r}();n.ControlChange=s}(nu)),nu}var oo={},Nm;function Fq(){if(Nm)return oo;Nm=1,Object.defineProperty(oo,"__esModule",{value:!0}),oo.createControlChanges=void 0;var n=tw();function t(){return new Proxy({},{get:function(e,s){if(e[s])return e[s];if(n.controlChangeIds.hasOwnProperty(s))return e[n.controlChangeIds[s]]},set:function(e,s,r){return n.controlChangeIds.hasOwnProperty(s)?e[n.controlChangeIds[s]]=r:e[s]=r,!0}})}return oo.createControlChanges=t,oo}var io={},Tm;function Oq(){if(Tm)return io;Tm=1,Object.defineProperty(io,"__esModule",{value:!0}),io.PitchBend=void 0;var n=new WeakMap,t=function(){function e(s,r){n.set(this,r),this.ticks=s.absoluteTime,this.value=s.value}return Object.defineProperty(e.prototype,"time",{get:function(){var s=n.get(this);return s.ticksToSeconds(this.ticks)},set:function(s){var r=n.get(this);this.ticks=r.secondsToTicks(s)},enumerable:!1,configurable:!0}),e.prototype.toJSON=function(){return{ticks:this.ticks,time:this.time,value:this.value}},e}();return io.PitchBend=t,io}var ao={},Vn={},Em;function _q(){return Em||(Em=1,Object.defineProperty(Vn,"__esModule",{value:!0}),Vn.DrumKitByPatchID=Vn.InstrumentFamilyByID=Vn.instrumentByPatchID=void 0,Vn.instrumentByPatchID=["acoustic grand piano","bright acoustic piano","electric grand piano","honky-tonk piano","electric piano 1","electric piano 2","harpsichord","clavi","celesta","glockenspiel","music box","vibraphone","marimba","xylophone","tubular bells","dulcimer","drawbar organ","percussive organ","rock organ","church organ","reed organ","accordion","harmonica","tango accordion","acoustic guitar (nylon)","acoustic guitar (steel)","electric guitar (jazz)","electric guitar (clean)","electric guitar (muted)","overdriven guitar","distortion guitar","guitar harmonics","acoustic bass","electric bass (finger)","electric bass (pick)","fretless bass","slap bass 1","slap bass 2","synth bass 1","synth bass 2","violin","viola","cello","contrabass","tremolo strings","pizzicato strings","orchestral harp","timpani","string ensemble 1","string ensemble 2","synthstrings 1","synthstrings 2","choir aahs","voice oohs","synth voice","orchestra hit","trumpet","trombone","tuba","muted trumpet","french horn","brass section","synthbrass 1","synthbrass 2","soprano sax","alto sax","tenor sax","baritone sax","oboe","english horn","bassoon","clarinet","piccolo","flute","recorder","pan flute","blown bottle","shakuhachi","whistle","ocarina","lead 1 (square)","lead 2 (sawtooth)","lead 3 (calliope)","lead 4 (chiff)","lead 5 (charang)","lead 6 (voice)","lead 7 (fifths)","lead 8 (bass + lead)","pad 1 (new age)","pad 2 (warm)","pad 3 (polysynth)","pad 4 (choir)","pad 5 (bowed)","pad 6 (metallic)","pad 7 (halo)","pad 8 (sweep)","fx 1 (rain)","fx 2 (soundtrack)","fx 3 (crystal)","fx 4 (atmosphere)","fx 5 (brightness)","fx 6 (goblins)","fx 7 (echoes)","fx 8 (sci-fi)","sitar","banjo","shamisen","koto","kalimba","bag pipe","fiddle","shanai","tinkle bell","agogo","steel drums","woodblock","taiko drum","melodic tom","synth drum","reverse cymbal","guitar fret noise","breath noise","seashore","bird tweet","telephone ring","helicopter","applause","gunshot"],Vn.InstrumentFamilyByID=["piano","chromatic percussion","organ","guitar","bass","strings","ensemble","brass","reed","pipe","synth lead","synth pad","synth effects","world","percussive","sound effects"],Vn.DrumKitByPatchID={0:"standard kit",8:"room kit",16:"power kit",24:"electronic kit",25:"tr-808 kit",32:"jazz kit",40:"brush kit",48:"orchestra kit",56:"sound fx kit"}),Vn}var Rm;function Mq(){if(Rm)return ao;Rm=1,Object.defineProperty(ao,"__esModule",{value:!0}),ao.Instrument=void 0;var n=_q(),t=new WeakMap,e=function(){function s(r,o){if(this.number=0,t.set(this,o),this.number=0,r){var i=r.find(function(a){return a.type==="programChange"});i&&(this.number=i.programNumber)}}return Object.defineProperty(s.prototype,"name",{get:function(){return this.percussion?n.DrumKitByPatchID[this.number]:n.instrumentByPatchID[this.number]},set:function(r){var o=n.instrumentByPatchID.indexOf(r);o!==-1&&(this.number=o)},enumerable:!1,configurable:!0}),Object.defineProperty(s.prototype,"family",{get:function(){return this.percussion?"drums":n.InstrumentFamilyByID[Math.floor(this.number/8)]},enumerable:!1,configurable:!0}),Object.defineProperty(s.prototype,"percussion",{get:function(){var r=t.get(this);return r.channel===9},enumerable:!1,configurable:!0}),s.prototype.toJSON=function(){return{family:this.family,number:this.number,name:this.name}},s.prototype.fromJSON=function(r){this.number=r.number},s}();return ao.Instrument=e,ao}var co={},Dm;function Lq(){if(Dm)return co;Dm=1,Object.defineProperty(co,"__esModule",{value:!0}),co.Note=void 0;function n(i){var a=Math.floor(i/12)-1;return t(i)+a.toString()}function t(i){var a=["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"],c=i%12;return a[c]}function e(i){var a=["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];return a.indexOf(i)}var s=function(){var i=/^([a-g]{1}(?:b|#|x|bb)?)(-?[0-9]+)/i,a={cbb:-2,cb:-1,c:0,"c#":1,cx:2,dbb:0,db:1,d:2,"d#":3,dx:4,ebb:2,eb:3,e:4,"e#":5,ex:6,fbb:3,fb:4,f:5,"f#":6,fx:7,gbb:5,gb:6,g:7,"g#":8,gx:9,abb:7,ab:8,a:9,"a#":10,ax:11,bbb:9,bb:10,b:11,"b#":12,bx:13};return function(c){var l=i.exec(c),u=l[1],h=l[2],d=a[u.toLowerCase()];return d+(parseInt(h,10)+1)*12}}(),r=new WeakMap,o=function(){function i(a,c,l){r.set(this,l),this.midi=a.midi,this.velocity=a.velocity,this.noteOffVelocity=c.velocity,this.ticks=a.ticks,this.durationTicks=c.ticks-a.ticks}return Object.defineProperty(i.prototype,"name",{get:function(){return n(this.midi)},set:function(a){this.midi=s(a)},enumerable:!1,configurable:!0}),Object.defineProperty(i.prototype,"octave",{get:function(){return Math.floor(this.midi/12)-1},set:function(a){var c=a-this.octave;this.midi+=c*12},enumerable:!1,configurable:!0}),Object.defineProperty(i.prototype,"pitch",{get:function(){return t(this.midi)},set:function(a){this.midi=12*(this.octave+1)+e(a)},enumerable:!1,configurable:!0}),Object.defineProperty(i.prototype,"duration",{get:function(){var a=r.get(this);return a.ticksToSeconds(this.ticks+this.durationTicks)-a.ticksToSeconds(this.ticks)},set:function(a){var c=r.get(this),l=c.secondsToTicks(this.time+a);this.durationTicks=l-this.ticks},enumerable:!1,configurable:!0}),Object.defineProperty(i.prototype,"time",{get:function(){var a=r.get(this);return a.ticksToSeconds(this.ticks)},set:function(a){var c=r.get(this);this.ticks=c.secondsToTicks(a)},enumerable:!1,configurable:!0}),Object.defineProperty(i.prototype,"bars",{get:function(){var a=r.get(this);return a.ticksToMeasures(this.ticks)},enumerable:!1,configurable:!0}),i.prototype.toJSON=function(){return{duration:this.duration,durationTicks:this.durationTicks,midi:this.midi,name:this.name,ticks:this.ticks,time:this.time,velocity:this.velocity}},i}();return co.Note=o,co}var Am;function Fm(){if(Am)return ro;Am=1,Object.defineProperty(ro,"__esModule",{value:!0}),ro.Track=void 0;var n=Qy(),t=tw(),e=Fq(),s=Oq(),r=Mq(),o=Lq(),i=new WeakMap,a=function(){function c(l,u){var h=this;if(this.name="",this.notes=[],this.controlChanges=(0,e.createControlChanges)(),this.pitchBends=[],i.set(this,u),l){var d=l.find(function(y){return y.type==="trackName"});this.name=d?d.text:""}if(this.instrument=new r.Instrument(l,this),this.channel=0,l){for(var p=l.filter(function(y){return y.type==="noteOn"}),f=l.filter(function(y){return y.type==="noteOff"}),m=function(){var y=p.shift();g.channel=y.channel;var I=f.findIndex(function(N){return N.noteNumber===y.noteNumber&&N.absoluteTime>=y.absoluteTime});if(I!==-1){var C=f.splice(I,1)[0];g.addNote({durationTicks:C.absoluteTime-y.absoluteTime,midi:y.noteNumber,noteOffVelocity:C.velocity/127,ticks:y.absoluteTime,velocity:y.velocity/127})}},g=this;p.length;)m();var x=l.filter(function(y){return y.type==="controller"});x.forEach(function(y){h.addCC({number:y.controllerType,ticks:y.absoluteTime,value:y.value/127})});var b=l.filter(function(y){return y.type==="pitchBend"});b.forEach(function(y){h.addPitchBend({ticks:y.absoluteTime,value:y.value/Math.pow(2,13)})});var w=l.find(function(y){return y.type==="endOfTrack"});this.endOfTrackTicks=w!==void 0?w.absoluteTime:void 0}}return c.prototype.addNote=function(l){var u=i.get(this),h=new o.Note({midi:0,ticks:0,velocity:1},{ticks:0,velocity:0},u);return Object.assign(h,l),(0,n.insert)(this.notes,h,"ticks"),this},c.prototype.addCC=function(l){var u=i.get(this),h=new t.ControlChange({controllerType:l.number},u);return delete l.number,Object.assign(h,l),Array.isArray(this.controlChanges[h.number])||(this.controlChanges[h.number]=[]),(0,n.insert)(this.controlChanges[h.number],h,"ticks"),this},c.prototype.addPitchBend=function(l){var u=i.get(this),h=new s.PitchBend({},u);return Object.assign(h,l),(0,n.insert)(this.pitchBends,h,"ticks"),this},Object.defineProperty(c.prototype,"duration",{get:function(){if(!this.notes.length)return 0;for(var l=this.notes[this.notes.length-1].time+this.notes[this.notes.length-1].duration,u=0;u<this.notes.length-1;u++){var h=this.notes[u].time+this.notes[u].duration;l<h&&(l=h)}return l},enumerable:!1,configurable:!0}),Object.defineProperty(c.prototype,"durationTicks",{get:function(){if(!this.notes.length)return 0;for(var l=this.notes[this.notes.length-1].ticks+this.notes[this.notes.length-1].durationTicks,u=0;u<this.notes.length-1;u++){var h=this.notes[u].ticks+this.notes[u].durationTicks;l<h&&(l=h)}return l},enumerable:!1,configurable:!0}),c.prototype.fromJSON=function(l){var u=this;this.name=l.name,this.channel=l.channel,this.instrument=new r.Instrument(void 0,this),this.instrument.fromJSON(l.instrument),l.endOfTrackTicks!==void 0&&(this.endOfTrackTicks=l.endOfTrackTicks);for(var h in l.controlChanges)l.controlChanges[h]&&l.controlChanges[h].forEach(function(d){u.addCC({number:d.number,ticks:d.ticks,value:d.value})});l.notes.forEach(function(d){u.addNote({durationTicks:d.durationTicks,midi:d.midi,ticks:d.ticks,velocity:d.velocity})})},c.prototype.toJSON=function(){for(var l={},u=0;u<127;u++)this.controlChanges.hasOwnProperty(u)&&(l[u]=this.controlChanges[u].map(function(d){return d.toJSON()}));var h={channel:this.channel,controlChanges:l,pitchBends:this.pitchBends.map(function(d){return d.toJSON()}),instrument:this.instrument.toJSON(),name:this.name,notes:this.notes.map(function(d){return d.toJSON()})};return this.endOfTrackTicks!==void 0&&(h.endOfTrackTicks=this.endOfTrackTicks),h},c}();return ro.Track=a,ro}var Fs={};function Pq(n){var t=[];return ew(n,t),t}function ew(n,t){for(var e=0;e<n.length;e++){var s=n[e];Array.isArray(s)?ew(s,t):t.push(s)}}const Bq=Object.freeze(Object.defineProperty({__proto__:null,flatten:Pq},Symbol.toStringTag,{value:"Module"})),zq=ug(Bq);var Om;function Vq(){if(Om)return Fs;Om=1;var n=Fs&&Fs.__spreadArray||function(x,b,w){if(w||arguments.length===2)for(var y=0,I=b.length,C;y<I;y++)(C||!(y in b))&&(C||(C=Array.prototype.slice.call(b,0,y)),C[y]=b[y]);return x.concat(C||Array.prototype.slice.call(b))};Object.defineProperty(Fs,"__esModule",{value:!0}),Fs.encode=void 0;var t=Jy(),e=Wu(),s=zq;function r(x,b){return[{absoluteTime:x.ticks,channel:b,deltaTime:0,noteNumber:x.midi,type:"noteOn",velocity:Math.floor(x.velocity*127)},{absoluteTime:x.ticks+x.durationTicks,channel:b,deltaTime:0,noteNumber:x.midi,type:"noteOff",velocity:Math.floor(x.noteOffVelocity*127)}]}function o(x){return(0,s.flatten)(x.notes.map(function(b){return r(b,x.channel)}))}function i(x,b){return{absoluteTime:x.ticks,channel:b,controllerType:x.number,deltaTime:0,type:"controller",value:Math.floor(x.value*127)}}function a(x){for(var b=[],w=0;w<127;w++)x.controlChanges.hasOwnProperty(w)&&x.controlChanges[w].forEach(function(y){b.push(i(y,x.channel))});return b}function c(x,b){return{absoluteTime:x.ticks,channel:b,deltaTime:0,type:"pitchBend",value:x.value}}function l(x){var b=[];return x.pitchBends.forEach(function(w){b.push(c(w,x.channel))}),b}function u(x){return{absoluteTime:0,channel:x.channel,deltaTime:0,programNumber:x.instrument.number,type:"programChange"}}function h(x){return{absoluteTime:0,deltaTime:0,meta:!0,text:x,type:"trackName"}}function d(x){return{absoluteTime:x.ticks,deltaTime:0,meta:!0,microsecondsPerBeat:Math.floor(6e7/x.bpm),type:"setTempo"}}function p(x){return{absoluteTime:x.ticks,deltaTime:0,denominator:x.timeSignature[1],meta:!0,metronome:24,numerator:x.timeSignature[0],thirtyseconds:8,type:"timeSignature"}}function f(x){var b=e.keySignatureKeys.indexOf(x.key);return{absoluteTime:x.ticks,deltaTime:0,key:b+7,meta:!0,scale:x.scale==="major"?0:1,type:"keySignature"}}function m(x){return{absoluteTime:x.ticks,deltaTime:0,meta:!0,text:x.text,type:x.type}}function g(x){var b={header:{format:1,numTracks:x.tracks.length+1,ticksPerBeat:x.header.ppq},tracks:n([n(n(n(n([{absoluteTime:0,deltaTime:0,meta:!0,text:x.header.name,type:"trackName"}],x.header.keySignatures.map(function(w){return f(w)}),!0),x.header.meta.map(function(w){return m(w)}),!0),x.header.tempos.map(function(w){return d(w)}),!0),x.header.timeSignatures.map(function(w){return p(w)}),!0)],x.tracks.map(function(w){return n(n(n([h(w.name),u(w)],o(w),!0),a(w),!0),l(w),!0)}),!0)};return b.tracks=b.tracks.map(function(w){w=w.sort(function(I,C){return I.absoluteTime-C.absoluteTime});var y=0;return w.forEach(function(I){I.deltaTime=I.absoluteTime-y,y=I.absoluteTime,delete I.absoluteTime}),w.push({deltaTime:0,meta:!0,type:"endOfTrack"}),w}),new Uint8Array((0,t.writeMidi)(b))}return Fs.encode=g,Fs}var _m;function Wq(){return _m||(_m=1,function(n){var t=Ds&&Ds.__awaiter||function(h,d,p,f){function m(g){return g instanceof p?g:new p(function(x){x(g)})}return new(p||(p=Promise))(function(g,x){function b(I){try{y(f.next(I))}catch(C){x(C)}}function w(I){try{y(f.throw(I))}catch(C){x(C)}}function y(I){I.done?g(I.value):m(I.value).then(b,w)}y((f=f.apply(h,d||[])).next())})},e=Ds&&Ds.__generator||function(h,d){var p={label:0,sent:function(){if(g[0]&1)throw g[1];return g[1]},trys:[],ops:[]},f,m,g,x;return x={next:b(0),throw:b(1),return:b(2)},typeof Symbol=="function"&&(x[Symbol.iterator]=function(){return this}),x;function b(y){return function(I){return w([y,I])}}function w(y){if(f)throw new TypeError("Generator is already executing.");for(;p;)try{if(f=1,m&&(g=y[0]&2?m.return:y[0]?m.throw||((g=m.return)&&g.call(m),0):m.next)&&!(g=g.call(m,y[1])).done)return g;switch(m=0,g&&(y=[y[0]&2,g.value]),y[0]){case 0:case 1:g=y;break;case 4:return p.label++,{value:y[1],done:!1};case 5:p.label++,m=y[1],y=[0];continue;case 7:y=p.ops.pop(),p.trys.pop();continue;default:if(g=p.trys,!(g=g.length>0&&g[g.length-1])&&(y[0]===6||y[0]===2)){p=0;continue}if(y[0]===3&&(!g||y[1]>g[0]&&y[1]<g[3])){p.label=y[1];break}if(y[0]===6&&p.label<g[1]){p.label=g[1],g=y;break}if(g&&p.label<g[2]){p.label=g[2],p.ops.push(y);break}g[2]&&p.ops.pop(),p.trys.pop();continue}y=d.call(h,p)}catch(I){y=[6,I],m=0}finally{f=g=0}if(y[0]&5)throw y[1];return{value:y[0]?y[1]:void 0,done:!0}}};Object.defineProperty(n,"__esModule",{value:!0}),n.Header=n.Track=n.Midi=void 0;var s=Jy(),r=Wu(),o=Fm(),i=Vq(),a=function(){function h(d){var p=this,f=null;if(d){var m=d instanceof ArrayBuffer?new Uint8Array(d):d;f=(0,s.parseMidi)(m),f.tracks.forEach(function(g){var x=0;g.forEach(function(b){x+=b.deltaTime,b.absoluteTime=x})}),f.tracks=u(f.tracks)}this.header=new r.Header(f),this.tracks=[],d&&(this.tracks=f.tracks.map(function(g){return new o.Track(g,p.header)}),f.header.format===1&&this.tracks[0].duration===0&&this.tracks.shift())}return h.fromUrl=function(d){return t(this,void 0,void 0,function(){var p,f;return e(this,function(m){switch(m.label){case 0:return[4,fetch(d)];case 1:return p=m.sent(),p.ok?[4,p.arrayBuffer()]:[3,3];case 2:return f=m.sent(),[2,new h(f)];case 3:throw new Error("Could not load '".concat(d,"'"))}})})},Object.defineProperty(h.prototype,"name",{get:function(){return this.header.name},set:function(d){this.header.name=d},enumerable:!1,configurable:!0}),Object.defineProperty(h.prototype,"duration",{get:function(){var d=this.tracks.map(function(p){return p.duration});return Math.max.apply(Math,d)},enumerable:!1,configurable:!0}),Object.defineProperty(h.prototype,"durationTicks",{get:function(){var d=this.tracks.map(function(p){return p.durationTicks});return Math.max.apply(Math,d)},enumerable:!1,configurable:!0}),h.prototype.addTrack=function(){var d=new o.Track(void 0,this.header);return this.tracks.push(d),d},h.prototype.toArray=function(){return(0,i.encode)(this)},h.prototype.toJSON=function(){return{header:this.header.toJSON(),tracks:this.tracks.map(function(d){return d.toJSON()})}},h.prototype.fromJSON=function(d){var p=this;this.header=new r.Header,this.header.fromJSON(d.header),this.tracks=d.tracks.map(function(f){var m=new o.Track(void 0,p.header);return m.fromJSON(f),m})},h.prototype.clone=function(){var d=new h;return d.fromJSON(this.toJSON()),d},h}();n.Midi=a;var c=Fm();Object.defineProperty(n,"Track",{enumerable:!0,get:function(){return c.Track}});var l=Wu();Object.defineProperty(n,"Header",{enumerable:!0,get:function(){return l.Header}});function u(h){for(var d=[],p=0;p<h.length;p++)for(var f=d.length,m=new Map,g=Array(16).fill(0),x=0,b=h[p];x<b.length;x++){var w=b[x],y=f,I=w.channel;if(I!==void 0){w.type==="programChange"&&(g[I]=w.programNumber);var C=g[I],N="".concat(C," ").concat(I);m.has(N)?y=m.get(N):(y=f+m.size,m.set(N,y))}d[y]||d.push([]),d[y].push(w)}return d}}(Ds)),Ds}Wq();class xr{static instance;basicPitch=null;audioContext=null;isRecording=!1;listeners=[];stream=null;sourceNode=null;processorNode=null;audioBufferQueue=[];isProcessing=!1;currentNote=null;noteConfidence=0;CONFIDENCE_THRESHOLD=3;SILENCE_THRESHOLD=5;silenceCounter=0;constructor(){}static getInstance(){return xr.instance||(xr.instance=new xr),xr.instance}async start(){if(!this.isRecording)try{if(!this.basicPitch){const{BasicPitch:t}=await Cw(async()=>{const{BasicPitch:e}=await import("./Bue_xjst.js");return{BasicPitch:e}},[],import.meta.url);this.basicPitch=new t("https://unpkg.com/@spotify/basic-pitch@1.0.1/model/model.json")}this.audioContext=new AudioContext({sampleRate:22050}),await this.audioContext.resume(),this.stream=await navigator.mediaDevices.getUserMedia({audio:!0}),this.sourceNode=this.audioContext.createMediaStreamSource(this.stream),this.processorNode=this.audioContext.createScriptProcessor(4096,1,1),this.processorNode.onaudioprocess=t=>{const e=t.inputBuffer.getChannelData(0);this.audioBufferQueue.push(new Float32Array(e)),this.processQueue()},this.sourceNode.connect(this.processorNode),this.processorNode.connect(this.audioContext.destination),this.isRecording=!0,console.log("AudioInputService started")}catch(t){throw console.error("Error starting audio input:",t),this.stop(),t}}stop(){this.isRecording&&(this.isRecording=!1,this.processorNode&&(this.processorNode.disconnect(),this.processorNode=null),this.sourceNode&&(this.sourceNode.disconnect(),this.sourceNode=null),this.stream&&(this.stream.getTracks().forEach(t=>t.stop()),this.stream=null),this.audioContext&&(this.audioContext.close(),this.audioContext=null),this.currentNote=null,this.noteConfidence=0,this.silenceCounter=0,this.audioBufferQueue=[])}addListener(t){this.listeners.push(t)}removeListener(t){this.listeners=this.listeners.filter(e=>e!==t)}async processQueue(){if(!(this.isProcessing||this.audioBufferQueue.length===0||!this.basicPitch||!this.audioContext)){this.isProcessing=!0;try{for(;this.audioBufferQueue.length>0;){const t=this.audioBufferQueue.shift();if(!t)continue;const e=this.audioContext.createBuffer(1,t.length,this.audioContext.sampleRate);e.copyToChannel(t,0),await this.basicPitch.evaluateModel(e,(s,r,o)=>{let i=0,a=-1;for(let c=0;c<s.length;c++)for(let l=0;l<s[c].length;l++)s[c][l]>i&&(i=s[c][l],a=l);if(i>.3){const c=a+21;this.handleDetectedNote(c)}else this.handleSilence()},s=>{})}}catch(t){console.error("Error processing audio chunk:",t)}finally{this.isProcessing=!1}}}handleSilence(){this.silenceCounter++,this.silenceCounter>this.SILENCE_THRESHOLD&&(this.activeNote!==null&&this.sendNoteOff(this.activeNote),this.currentNote=null,this.noteConfidence=0)}handleDetectedNote(t){const e=Math.round(t);e===this.currentNote?(this.noteConfidence++,this.silenceCounter=0):this.currentNote===null?(this.currentNote=e,this.noteConfidence=1):(this.currentNote=e,this.noteConfidence=1),this.noteConfidence>=this.CONFIDENCE_THRESHOLD&&this.sendNoteOn(e)}activeNote=null;sendNoteOn(t){this.activeNote!==t&&(this.activeNote!==null&&this.sendNoteOff(this.activeNote),this.activeNote=t,this.notifyListeners(t,100,!0))}sendNoteOff(t){this.activeNote===t&&(this.activeNote=null,this.notifyListeners(t,0,!1))}notifyListeners(t,e,s){const r=s?144:128,o=new Uint8Array([r,t,e]),i=new MIDIMessageEvent("midimessage",{data:o});this.listeners.forEach(a=>a(i))}}const pa=xr.getInstance();class Uq{midiAccess=null;virtualMidi=null;keyboardCleanup=null;eventHandlers={};errorCallbacks=[];debugMode=!1;audioInputEnabled=!1;constructor(){pa.addListener(t=>{this.handleMIDIMessage(t)})}async initialize(){try{return await this.connectMIDI(),this.setupAudioInput(),!0}catch(t){return this.handleError(t),!1}}async connectMIDI(){try{if(this.midiAccess=await this.safeRequestMidiAccess({sysex:!1}),!this.midiAccess)throw new Error("Failed to obtain MIDI access");return this.safeSetupMidiCallback(this.midiAccess,this.handleMIDIMessage.bind(this),this.handleError.bind(this)),console.debug("MIDI Manager: Connected to physical MIDI devices"),!0}catch(t){return this.handleError(t),!1}}async safeRequestMidiAccess(t){try{if(!navigator.requestMIDIAccess)return console.warn("Web MIDI API not supported in this browser"),null;const e=await navigator.requestMIDIAccess(t||{sysex:!1});return console.debug("MIDI Access obtained successfully"),e}catch(e){return console.error("Failed to obtain MIDI access:",e),null}}safeSetupMidiCallback(t,e,s){try{t.inputs.forEach(r=>{const o=`Input port [type:'${r.type}'] id:'${r.id}' manufacturer:'${r.manufacturer}' name:'${r.name}' version:'${r.version}'`;console.debug(`Setting up MIDI input: ${o}`),r.onmidimessage=i=>{try{e(i)}catch(a){console.error("Error in MIDI message callback:",a),s&&s(a)}}}),t.onstatechange=r=>{const o=r.port;console.debug(`MIDI port state changed: ${o.name} is now ${o.state}`)}}catch(r){console.error("Error setting up MIDI callback:",r),s&&s(r)}}setupVirtualKeyboard(){try{const t=Tw("Virtual Debug Keyboard");this.virtualMidi=t.getVirtualInput(),this.keyboardCleanup=Pp(this.virtualMidi,this.debugMode);const e=Array.from(t.inputs.values())[0];e&&(e.onmidimessage=this.handleMIDIMessage.bind(this)),console.debug("MIDI Manager: Virtual keyboard enabled")}catch(t){this.handleError(t)}}setDebugMode(t){this.debugMode=t,this.virtualMidi&&(this.keyboardCleanup&&(this.keyboardCleanup(),this.keyboardCleanup=null),this.keyboardCleanup=Pp(this.virtualMidi,this.debugMode),console.debug(`MIDI Manager: Debug mode ${t?"enabled":"disabled"}`))}setupAudioInput(){pa.addListener(t=>{this.audioInputEnabled&&this.handleMIDIMessage(t)})}async setAudioInput(t){this.audioInputEnabled=t,t?(await pa.start(),console.debug("MIDI Manager: Audio input enabled")):(pa.stop(),console.debug("MIDI Manager: Audio input disabled"))}getVirtualMidi(){return this.virtualMidi}safeGetMidiNote(t){try{if(!t.data||t.data.length<3)return console.warn("Invalid MIDI message data"),null;const[e,s,r]=t.data,o=e&240,i=e&15;if(o!==144&&o!==128)return null;if(s<24||s>127)return console.warn(`MIDI note ${s} out of valid range (24-127)`),null;const a=s,c=vw[a];if(!c)return console.error(`No note name found for MIDI note ${a}`),null;const l=o===144&&r>0;return{noteNumber:a,type:l?"on":"off",noteFullName:c,noteName:c.slice(0,-1),velocity:r||0,timestamp:t.timeStamp||performance.now(),channel:i}}catch(e){return console.error("Error parsing MIDI message:",e),null}}handleMIDIMessage(t){try{const e=this.safeGetMidiNote(t);if(!e)return;e.type==="on"&&this.eventHandlers.onNoteOn?this.eventHandlers.onNoteOn(e):e.type==="off"&&this.eventHandlers.onNoteOff&&this.eventHandlers.onNoteOff(e)}catch(e){this.handleError(e)}}setEventHandlers(t){this.eventHandlers={...this.eventHandlers,...t}}handleError(t){console.error("MIDI Manager Error:",t),this.errorCallbacks.forEach(e=>{try{e(t)}catch(s){console.error("Error in error callback:",s)}}),this.eventHandlers.onError&&this.eventHandlers.onError(t)}getMIDIDevices(){return this.midiAccess?{inputs:Array.from(this.midiAccess.inputs.values()),outputs:Array.from(this.midiAccess.outputs.values())}:{inputs:[],outputs:[]}}cleanup(){this.keyboardCleanup&&(this.keyboardCleanup(),this.keyboardCleanup=null),this.virtualMidi&&(this.virtualMidi.releaseAllKeys(),this.virtualMidi=null),this.midiAccess&&(this.midiAccess.inputs.forEach(t=>{t.onmidimessage=null}),this.midiAccess.onstatechange=null),this.eventHandlers={},this.errorCallbacks=[],console.debug("MIDI Manager: Cleaned up all connections")}}const S6=new Uq;export{sg as $,Tt as A,Ku as B,Ce as C,Yp as D,A as E,Nt as F,J as G,Ft as H,ee as I,D as J,zr as K,jh as L,e6 as M,jm as N,Xm as O,Ym as P,Zm as Q,Qm as R,M as S,og as T,tg as U,ne as V,Is as W,vg as X,eg as Y,id as Z,ng as _,o6 as a,eC as a$,m6 as a0,yt as a1,x$ as a2,Zs as a3,ve as a4,fx as a5,un as a6,Ri as a7,td as a8,n6 as a9,uf as aA,In as aB,zs as aC,Vf as aD,xI as aE,le as aF,dv as aG,fv as aH,Ug as aI,wu as aJ,yo as aK,yv as aL,Iv as aM,Cv as aN,$v as aO,Nv as aP,Ev as aQ,Kh as aR,Lv as aS,rl as aT,qv as aU,jv as aV,Yv as aW,Xh as aX,Jv as aY,xo as aZ,nt as a_,ft as aa,at as ab,ut as ac,Tr as ad,tv as ae,rg as af,ig as ag,Jm as ah,be as ai,ma as aj,yd as ak,Jh as al,bd as am,$e as an,Le as ao,ye as ap,Zt as aq,mt as ar,Ys as as,ag as at,js as au,gd as av,fS as aw,dS as ax,xd as ay,uS as az,r6 as b,Cu as b$,Ze as b0,Hs as b1,rC as b2,iC as b3,cC as b4,uC as b5,Gg as b6,Xs as b7,Hg as b8,gC as b9,_a as bA,Bh as bB,ta as bC,ux as bD,ok as bE,ak as bF,lk as bG,ed as bH,Jg as bI,Wr as bJ,z2 as bK,fk as bL,cn as bM,nd as bN,wk as bO,Qg as bP,tx as bQ,qn as bR,sd as bS,ex as bT,Tk as bU,b6 as bV,An as bW,rd as bX,Dk as bY,ws as bZ,Yt as b_,yC as ba,Zh as bb,Kg as bc,mx as bd,vu as be,jg as bf,$C as bg,TC as bh,FC as bi,_C as bj,iS as bk,ol as bl,aS as bm,Ln as bn,PC as bo,KC as bp,an as bq,nn as br,ZC as bs,Zg as bt,pd as bu,Ti as bv,al as bw,Wg as bx,dn as by,Vr as bz,vI as c,Lp as c$,cl as c0,Mk as c1,Pk as c2,od as c3,qt as c4,il as c5,wo as c6,Dg as c7,ln as c8,Kk as c9,g6 as cA,Ye as cB,Ee as cC,Lt as cD,hx as cE,Js as cF,Di as cG,K$ as cH,w6 as cI,it as cJ,X$ as cK,ze as cL,ka as cM,wn as cN,Z$ as cO,Ct as cP,dx as cQ,tS as cR,px as cS,Er as cT,sS as cU,Ue as cV,he as cW,$t as cX,Mn as cY,z as cZ,Hm as c_,cd as ca,HI as cb,Yk as cc,ul as cd,Fa as ce,Da as cf,w$ as cg,Yn as ch,nx as ci,fd as cj,sx as ck,rx as cl,ox as cm,ix as cn,E$ as co,x6 as cp,ax as cq,cx as cr,ud as cs,lx as ct,hd as cu,Oa as cv,dd as cw,Ei as cx,ad as cy,y6 as cz,Cg as d,W as e,S as f,i6 as g,s6 as h,a6 as i,p6 as j,Zp as k,u6 as l,S6 as m,CI as n,TI as o,h6 as p,f6 as q,l6 as r,q as s,c6 as t,d6 as u,Bm as v,el as w,nl as x,F as y,E as z};
