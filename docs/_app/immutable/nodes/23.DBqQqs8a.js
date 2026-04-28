import{l as et,M as tt,g as rt}from"../chunks/CzbHW52d.js";import{f as x,a as y}from"../chunks/Cb0pIHsK.js";import{p as at,W as m,X as ie,w as st,z as e,Z as le,_ as t,Y as nt,a as ot,a0 as we,s as l,c as n,t as k,r,a1 as ce,f as it}from"../chunks/BYcXKYqS.js";import{d as lt,s as M}from"../chunks/Dmb0cE_1.js";import{e as ke,i as Me}from"../chunks/1hdA8Ihl.js";import{i as R}from"../chunks/Di4D_4Er.js";import{i as ct,a as ut,s as z,c as dt,g as ue,r as X,h as vt}from"../chunks/CuGrRQUb.js";import{B as pt}from"../chunks/B-g-DhD1.js";import{N as mt}from"../chunks/BsiAFI2A.js";const ft=async()=>{const i=await et();return i.length===0?{songs:[bt()]}:{songs:i}};function bt(){return{id:"autumn-leaves-fallback",filename:"autumn-leaves-fallback.musicxml",title:"Autumn Leaves",composer:"Traditional",key:"C",tempo:120,url:"",content:`<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 4.0 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">
<score-partwise version="4.0">
  <work>
    <work-title>Autumn Leaves</work-title>
  </work>
  <identification>
    <creator type="composer">Traditional</creator>
  </identification>
  <part-list>
    <score-part id="P1">
      <part-name>Piano</part-name>
    </score-part>
  </part-list>
  <part id="P1">
    <measure number="1">
      <attributes>
        <divisions>1</divisions>
        <key>
          <fifths>0</fifths>
        </key>
        <time>
          <beats>4</beats>
          <beat-type>4</beat-type>
        </time>
        <clef>
          <sign>G</sign>
          <line>2</line>
        </clef>
      </attributes>
      <harmony>
        <root>
          <root-step>A</root-step>
        </root>
        <kind text="m7">minor-seventh</kind>
      </harmony>
      <note>
        <pitch>
          <step>C</step>
          <octave>4</octave>
        </pitch>
        <duration>4</duration>
        <type>whole</type>
      </note>
    </measure>
    <measure number="2">
      <harmony>
        <root>
          <root-step>D</root-step>
        </root>
        <kind text="7">dominant</kind>
      </harmony>
      <note>
        <pitch>
          <step>D</step>
          <octave>4</octave>
        </pitch>
        <duration>4</duration>
        <type>whole</type>
      </note>
    </measure>
    <measure number="3">
      <harmony>
        <root>
          <root-step>G</root-step>
        </root>
        <kind text="maj7">major-seventh</kind>
      </harmony>
      <note>
        <pitch>
          <step>G</step>
          <octave>4</octave>
        </pitch>
        <duration>4</duration>
        <type>whole</type>
      </note>
    </measure>
    <measure number="4">
      <harmony>
        <root>
          <root-step>C</root-step>
        </root>
        <kind text="maj7">major-seventh</kind>
      </harmony>
      <note>
        <pitch>
          <step>C</step>
          <octave>4</octave>
        </pitch>
        <duration>4</duration>
        <type>whole</type>
      </note>
    </measure>
  </part>
</score-partwise>`,chords:[{measure:0,beat:0,root:"Am",quality:"m7",duration:4},{measure:1,beat:0,root:"D",quality:"7",duration:4},{measure:2,beat:0,root:"G",quality:"maj7",duration:4},{measure:3,beat:0,root:"C",quality:"maj7",duration:4}],melody:[]}}const Gt=Object.freeze(Object.defineProperty({__proto__:null,load:ft},Symbol.toStringTag,{value:"Module"}));function ht(i,b=4){return i.map((f,c)=>({index:c,expectedNotes:[],expectedBeats:Array.from({length:b},(d,p)=>p+1),chordName:`${f.root}${f.quality}`,melodyNotes:[]}))}function gt(i,b,f){if(i.expectedNotes.length>0){const c=[...new Set(i.expectedNotes)];return c.filter(p=>b.has(p)).length===c.length}return i.expectedBeats.length>0?f.size>=i.expectedBeats.length:!1}function _t(i){return i>3?`Mistake! Restarting from previous bar in ${i}...`:i>0?`Restarting in ${i}... Get ready!`:"Restarting now!"}function Ne(){return"Mistake! Press any key to restart from the beginning of this bar."}function yt(i,b,f=1){return Math.max(0,i-f)}var xt=x("<option> </option>"),wt=x('<div class="score-section svelte-1nni06b"><!></div>'),kt=x('<span class="chord-name svelte-1nni06b"> </span>'),Mt=x('<div class="countdown svelte-1nni06b"> </div>'),Nt=x('<div class="paused-message svelte-1nni06b"> </div>'),Ct=x('<div class="setting-group svelte-1nni06b"><label for="bpm-slider" class="svelte-1nni06b"> </label> <input id="bpm-slider" type="range" min="40" max="200"/></div> <div class="setting-group svelte-1nni06b"><label class="svelte-1nni06b"><input type="checkbox"/> Swing feel</label></div>',1),St=x('<span class="bar-chord svelte-1nni06b"> </span>'),Bt=x("<div><!></div>"),Pt=x('<div class="song-rhythm-exercise svelte-1nni06b"><div class="control-section svelte-1nni06b"><div class="control-group svelte-1nni06b"><label for="song-select" class="svelte-1nni06b">Song:</label> <select id="song-select" class="svelte-1nni06b"></select></div> <div class="exercise-type-toggle svelte-1nni06b"><button>Chords</button> <button>Melody</button> <button>Full Song</button></div></div> <!> <div class="progress-section svelte-1nni06b"><div class="bar-info svelte-1nni06b"><span class="bar-number svelte-1nni06b"> </span> <!></div> <div class="progress-bar svelte-1nni06b"><div class="progress-fill svelte-1nni06b"></div></div> <!> <!></div> <div class="settings-section svelte-1nni06b"><div class="setting-group svelte-1nni06b"><label class="svelte-1nni06b"><input type="checkbox"/> Auto-restart on mistake</label> <span class="setting-hint svelte-1nni06b"> </span></div> <div class="setting-group svelte-1nni06b"><label class="svelte-1nni06b"><input type="checkbox"/> Show II-V-I annotations</label></div> <!></div> <div class="bar-visualizer svelte-1nni06b"></div></div>');function Lt(i,b){at(b,!0);let f=m("chords"),c=le(()=>b.data.songs[0]),d=m(0),p=m("auto-restart"),Ce=m(!0),D=m(100),O=m(!0),Se=4,w=m(ie(new Set)),P=m(ie(new Set)),T=m(!1),$=m(0),A=m(!1),N=m(ie([])),F=m(!0),Be=le(()=>e(F)?rt(e(c)):[]);st(()=>{e(c)?.chords&&t(N,ht(e(c).chords),!0)});function G(){return e(N)[e(d)]||{index:0,expectedNotes:[],expectedBeats:[]}}function Pe(v){const h=G();if(e(f)==="chords"&&h.chordName){const g=h.chordName.match(/^([A-G][b#]?)(.*)$/);if(g){const j=g[1];g[2];const _=mt[`${j}3`];if(_)return[_,_+4,_+7]}}return h.expectedNotes}function Te(v){return{selectedNote:v,leftHand:[],rightHand:[]}}function Ae(v,h,g,j){if(e(T)&&e(p)==="wait-for-key")return Ee(),{isCorrect:!0,message:"Restarting...",collected:!0,resetCollected:!0};const _=G();return g.includes(h.noteNumber)?(e(w).add(h.noteNumber),gt(_,e(w),e(P))?(De(),{isCorrect:!0,message:"Bar complete! 🎵",collected:!0,resetCollected:!0}):{isCorrect:!0,message:`${e(w).size}/${g.length} notes`,collected:!0,resetCollected:!1}):(Ie(),{isCorrect:!1,message:Re(),collected:!1,resetCollected:!0})}function Ie(){e(p)==="auto-restart"?$e():t(T,!0)}function Re(){return e(p)==="wait-for-key"?Ne():"Mistake! Restarting bar..."}function $e(){if(e(A))return;t(A,!0),t($,Se,!0);const v=setInterval(()=>{we($,-1),e($)<=0&&(clearInterval(v),je(),t(A,!1))},1e3)}function je(){const v=yt(e(d),e(N),1);t(d,v,!0),t(w,new Set,!0),t(P,new Set,!0),t(T,!1),t(A,!1)}function Ee(){t(w,new Set,!0),t(P,new Set,!0),t(T,!1)}function De(){e(d)<e(N).length-1?(we(d),t(w,new Set,!0),t(P,new Set,!0)):(t(d,0),t(w,new Set,!0),t(P,new Set,!0))}function Fe(v,h){return!1}function U(){t(d,0),t(w,new Set,!0),t(P,new Set,!0),t(T,!1),t(A,!1),t($,0)}function Ge(){}function Le(v){const g=v.target.value;t(c,b.data.songs.find(j=>j.id===g)||b.data.songs[0]),U()}function H(v){t(f,v,!0),U()}function qe(){t(p,e(p)==="auto-restart"?"wait-for-key":"auto-restart",!0)}const ze="Practice songs bar by bar with rhythm. Play each chord or note on the beat. Mistakes will either auto-restart from the previous bar or pause until you press a key.";{const v=(g,j=nt)=>{var _=Pt(),L=n(_),W=n(L),C=l(n(W),2);C.__change=Le,ke(C,21,()=>b.data.songs,Me,(s,a)=>{var o=xt(),u=n(o);r(o);var S={};k(()=>{M(u,`${e(a).title??""} (${e(a).composer||"Unknown"})`),S!==(S=e(a).id)&&(o.value=(o.__value=e(a).id)??"")}),y(s,o)}),r(C);var de;ct(C),r(W);var ve=l(W,2),Y=n(ve);Y.__click=()=>H("chords");let pe;var K=l(Y,2);K.__click=()=>H("melody");let me;var fe=l(K,2);fe.__click=()=>H("full");let be;r(ve),r(L);var he=l(L,2);{var Xe=s=>{var a=wt(),o=n(a);tt(o,{get url(){return e(c).url},get annotations(){return e(Be)}}),r(a),y(s,a)};R(he,s=>{e(c)&&s(Xe)})}var V=l(he,2),Z=n(V),J=n(Z),Oe=n(J);r(J);var Ue=l(J,2);{var He=s=>{var a=kt(),o=n(a,!0);r(a),k(u=>M(o,u),[()=>G().chordName]),y(s,a)};R(Ue,s=>{G().chordName&&s(He)})}r(Z);var Q=l(Z,2),We=n(Q);r(Q);var ge=l(Q,2);{var Ye=s=>{var a=Mt(),o=n(a,!0);r(a),k(u=>M(o,u),[()=>_t(e($))]),y(s,a)};R(ge,s=>{e(A)&&e(p)==="auto-restart"&&s(Ye)})}var Ke=l(ge,2);{var Ve=s=>{var a=Nt(),o=n(a,!0);r(a),k(u=>M(o,u),[Ne]),y(s,a)};R(Ke,s=>{e(T)&&e(p)==="wait-for-key"&&s(Ve)})}r(V);var ee=l(V,2),te=n(ee),re=n(te),ae=n(re);X(ae),ae.__change=qe,ce(),r(re);var _e=l(re,2),Ze=n(_e,!0);r(_e),r(te);var se=l(te,2),ye=n(se),ne=n(ye);X(ne),ne.__change=()=>t(F,!e(F)),ce(),r(ye),r(se);var Je=l(se,2);{var Qe=s=>{var a=Ct(),o=it(a),u=n(o),S=n(u);r(u);var E=l(u,2);X(E),E.__input=oe=>t(D,parseInt(oe.currentTarget.value),!0),r(o);var q=l(o,2),I=n(q),B=n(I);X(B),B.__change=()=>t(O,!e(O)),ce(),r(I),r(q),k(()=>{M(S,`Tempo: ${e(D)??""} BPM`),vt(E,e(D)),ue(B,e(O))}),y(s,a)};R(Je,s=>{e(Ce)&&s(Qe)})}r(ee);var xe=l(ee,2);ke(xe,21,()=>e(N),Me,(s,a,o)=>{var u=Bt();let S;var E=n(u);{var q=I=>{var B=St(),oe=n(B,!0);r(B),k(()=>M(oe,e(a).chordName)),y(I,B)};R(E,I=>{e(a).chordName&&I(q)})}r(u),k(()=>S=z(u,1,"bar-box svelte-1nni06b",null,S,{current:o===e(d),completed:o<e(d),upcoming:o>e(d)})),y(s,u)}),r(xe),r(_),k(s=>{de!==(de=e(c).id)&&(C.value=(C.__value=e(c).id)??"",ut(C,e(c).id)),pe=z(Y,1,"svelte-1nni06b",null,pe,{active:e(f)==="chords"}),me=z(K,1,"svelte-1nni06b",null,me,{active:e(f)==="melody"}),be=z(fe,1,"svelte-1nni06b",null,be,{active:e(f)==="full"}),M(Oe,`Bar ${e(d)+1} of ${e(N).length??""}`),dt(We,`width: ${s??""}%`),ue(ae,e(p)==="auto-restart"),M(Ze,e(p)==="auto-restart"?"Gives 4 beats to refocus":"Press any key to continue"),ue(ne,e(F))},[()=>e(d)/Math.max(1,e(N).length-1)*100]),y(g,_)};let h=le(()=>e(c)?.key?.charAt(0)||"C");pt(i,{randomMode:!1,description:ze,exerciseType:"rhythm",generateExpectedNotes:Pe,generateScoreProps:Te,validateNoteEvent:Ae,isCompleted:Fe,onReset:U,onComplete:Ge,get initialNote(){return e(h)},showScore:!1,get defaultBpm(){return e(D)},perNoteTiming:!0,children:v,$$slots:{default:!0}})}ot()}lt(["change","click","input"]);export{Lt as component,Gt as universal};
