import{r as e}from"../chunks/B3hhCj7t.js";import{B as t,C as n,I as r,K as i,L as a,N as o,P as s,Q as c,R as l,S as u,T as d,U as f,W as p,Z as m,at as h,b as ee,bt as te,ct as g,g as _,ht as v,it as y,lt as b,mt as x,nt as S,ot as C,rt as ne,st as w,v as T,vt as E,w as re,yt as D}from"../chunks/Ctk8gNnB.js";import"../chunks/CQCxd1p9.js";import{n as ie,t as O}from"../chunks/DBk2o47j.js";import{p as k}from"../chunks/C4eZexkc.js";import{n as A,t as j}from"../chunks/ijO9Hk_C.js";var M=e({load:()=>N}),N=async()=>{let e=await A();return e.length===0?{songs:[ae()]}:{songs:e}};function ae(){return{id:`autumn-leaves-fallback`,filename:`autumn-leaves-fallback.musicxml`,title:`Autumn Leaves`,composer:`Traditional`,key:`C`,tempo:120,url:``,content:`<?xml version="1.0" encoding="UTF-8"?>
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
</score-partwise>`,chords:[{measure:0,beat:0,root:`Am`,quality:`m7`,duration:4},{measure:1,beat:0,root:`D`,quality:`7`,duration:4},{measure:2,beat:0,root:`G`,quality:`maj7`,duration:4},{measure:3,beat:0,root:`C`,quality:`maj7`,duration:4}],melody:[]}}function P(e,t=4){return e.map((e,n)=>({index:n,expectedNotes:[],expectedBeats:Array.from({length:t},(e,t)=>t+1),chordName:`${e.root}${e.quality}`,melodyNotes:[]}))}function F(e,t,n){if(e.expectedNotes.length>0){let n=[...new Set(e.expectedNotes)];return n.filter(e=>t.has(e)).length===n.length}return e.expectedBeats.length>0?n.size>=e.expectedBeats.length:!1}function oe(e){return e>3?`Mistake! Restarting from previous bar in ${e}...`:e>0?`Restarting in ${e}... Get ready!`:`Restarting now!`}function se(){return`Mistake! Press any key to restart from the beginning of this bar.`}function I(e,t,n=1){return Math.max(0,e-n)}var ce=t(`<option> </option>`),le=t(`<div class="score-section svelte-1nni06b"><!></div>`),ue=t(`<span class="chord-name svelte-1nni06b"> </span>`),de=t(`<div class="countdown svelte-1nni06b"> </div>`),fe=t(`<div class="paused-message svelte-1nni06b"> </div>`),pe=t(`<div class="setting-group svelte-1nni06b"><label for="bpm-slider" class="svelte-1nni06b"> </label> <input id="bpm-slider" type="range" min="40" max="200"/></div> <div class="setting-group svelte-1nni06b"><label class="svelte-1nni06b"><input type="checkbox"/> Swing feel</label></div>`,1),me=t(`<span class="bar-chord svelte-1nni06b"> </span>`),he=t(`<div><!></div>`),ge=t(`<div class="song-rhythm-exercise svelte-1nni06b"><div class="control-section svelte-1nni06b"><div class="control-group svelte-1nni06b"><label for="song-select" class="svelte-1nni06b">Song:</label> <select id="song-select" class="svelte-1nni06b"></select></div> <div class="exercise-type-toggle svelte-1nni06b"><button>Chords</button> <button>Melody</button> <button>Full Song</button></div></div> <!> <div class="progress-section svelte-1nni06b"><div class="bar-info svelte-1nni06b"><span class="bar-number svelte-1nni06b"> </span> <!></div> <div class="progress-bar svelte-1nni06b"><div class="progress-fill svelte-1nni06b"></div></div> <!> <!></div> <div class="settings-section svelte-1nni06b"><div class="setting-group svelte-1nni06b"><label class="svelte-1nni06b"><input type="checkbox"/> Auto-restart on mistake</label> <span class="setting-hint svelte-1nni06b"> </span></div> <div class="setting-group svelte-1nni06b"><label class="svelte-1nni06b"><input type="checkbox"/> Show II-V-I annotations</label></div> <!></div> <div class="bar-visualizer svelte-1nni06b"></div></div>`);function L(e,t){v(t,!0);let f=w(`chords`),A=b(()=>t.data.songs[0]),M=w(0),N=w(`auto-restart`),ae=w(!0),L=w(100),R=w(!0),z=w(h(new Set)),B=w(h(new Set)),V=w(!1),H=w(0),U=w(!1),W=w(h([])),G=w(!0),_e=b(()=>i(G)?j(i(A)):[]);c(()=>{i(A)?.chords&&C(W,P(i(A).chords),!0)});function K(){return i(W)[i(M)]||{index:0,expectedNotes:[],expectedBeats:[]}}function ve(e){let t=K();if(i(f)===`chords`&&t.chordName){let e=t.chordName.match(/^([A-G][b#]?)(.*)$/);if(e){let t=e[1];e[2];let n=k[`${t}3`];if(n)return[n,n+4,n+7]}}return t.expectedNotes}function q(e){return{selectedNote:e,leftHand:[],rightHand:[]}}function J(e,t,n,r){if(i(V)&&i(N)===`wait-for-key`)return Se(),{isCorrect:!0,message:`Restarting...`,collected:!0,resetCollected:!0};let a=K();return n.includes(t.noteNumber)?(i(z).add(t.noteNumber),F(a,i(z),i(B))?(X(),{isCorrect:!0,message:`Bar complete! 🎵`,collected:!0,resetCollected:!0}):{isCorrect:!0,message:`${i(z).size}/${n.length} notes`,collected:!0,resetCollected:!1}):(Y(),{isCorrect:!1,message:ye(),collected:!1,resetCollected:!0})}function Y(){i(N)===`auto-restart`?be():C(V,!0)}function ye(){return i(N)===`wait-for-key`?se():`Mistake! Restarting bar...`}function be(){if(i(U))return;C(U,!0),C(H,4,!0);let e=setInterval(()=>{g(H,-1),i(H)<=0&&(clearInterval(e),xe(),C(U,!1))},1e3)}function xe(){C(M,I(i(M),i(W),1),!0),C(z,new Set,!0),C(B,new Set,!0),C(V,!1),C(U,!1)}function Se(){C(z,new Set,!0),C(B,new Set,!0),C(V,!1)}function X(){i(M)<i(W).length-1?(g(M),C(z,new Set,!0),C(B,new Set,!0)):(C(M,0),C(z,new Set,!0),C(B,new Set,!0))}function Ce(e,t){return!1}function Z(){C(M,0),C(z,new Set,!0),C(B,new Set,!0),C(V,!1),C(U,!1),C(H,0)}function we(){}function Te(e){let n=e.target.value;C(A,t.data.songs.find(e=>e.id===n)||t.data.songs[0]),Z()}function Q(e){C(f,e,!0),Z()}function Ee(){C(N,i(N)===`auto-restart`?`wait-for-key`:`auto-restart`,!0)}{let c=(e,c=te)=>{var h=ge(),g=S(h),v=S(g),x=y(S(v),2);o(x,21,()=>t.data.songs,s,(e,t)=>{var n=ce(),r=S(n);D(n);var o={};m(()=>{a(r,`${i(t).title??``} (${(i(t).composer||`Unknown`)??``})`),o!==(o=i(t).id)&&(n.value=(n.__value=i(t).id)??``)}),l(e,n)}),D(x);var w;u(x),D(v);var O=y(v,2),k=S(O);let j;var P=y(k,2);let F;var I=y(P,2);let z;D(O),D(g);var B=y(g,2),ve=e=>{var t=le();ie(S(t),{get url(){return i(A).url},get annotations(){return i(_e)}}),D(t),l(e,t)};r(B,e=>{i(A)&&e(ve)});var q=y(B,2),J=S(q),Y=S(J),ye=S(Y);D(Y);var be=y(Y,2),xe=e=>{var t=ue(),n=S(t,!0);D(t),m(e=>a(n,e),[()=>K().chordName]),l(e,t)},Se=b(()=>K().chordName);r(be,e=>{i(Se)&&e(xe)}),D(J);var X=y(J,2),Ce=S(X);D(X);var Z=y(X,2),we=e=>{var t=de(),n=S(t,!0);D(t),m(e=>a(n,e),[()=>oe(i(H))]),l(e,t)};r(Z,e=>{i(U)&&i(N)===`auto-restart`&&e(we)});var De=y(Z,2),Oe=e=>{var t=fe(),n=S(t,!0);D(t),m(e=>a(n,e),[()=>se()]),l(e,t)};r(De,e=>{i(V)&&i(N)===`wait-for-key`&&e(Oe)}),D(q);var ke=y(q,2),$=S(ke),Ae=S($),je=S(Ae);_(je),E(),D(Ae);var Me=y(Ae,2),Ne=S(Me,!0);D(Me),D($);var Pe=y($,2),Fe=S(Pe),Ie=S(Fe);_(Ie),E(),D(Fe),D(Pe);var Le=y(Pe,2),Re=e=>{var t=pe(),n=ne(t),r=S(n),o=S(r);D(r);var s=y(r,2);_(s),D(n);var c=y(n,2),u=S(c),d=S(u);_(d),E(),D(u),D(c),m(()=>{a(o,`Tempo: ${i(L)??``} BPM`),ee(s,i(L)),T(d,i(R))}),p(`input`,s,e=>C(L,parseInt(e.currentTarget.value),!0)),p(`change`,d,()=>C(R,!i(R))),l(e,t)};r(Le,e=>{i(ae)&&e(Re)}),D(ke);var ze=y(ke,2);o(ze,21,()=>i(W),s,(e,t,n)=>{var o=he();let s;var c=S(o),u=e=>{var n=me(),r=S(n,!0);D(n),m(()=>a(r,i(t).chordName)),l(e,n)};r(c,e=>{i(t).chordName&&e(u)}),D(o),m(()=>s=d(o,1,`bar-box svelte-1nni06b`,null,s,{current:n===i(M),completed:n<i(M),upcoming:n>i(M)})),l(e,o)}),D(ze),D(h),m(e=>{w!==(w=i(A).id)&&(x.value=(x.__value=i(A).id)??``,n(x,i(A).id)),j=d(k,1,`svelte-1nni06b`,null,j,{active:i(f)===`chords`}),F=d(P,1,`svelte-1nni06b`,null,F,{active:i(f)===`melody`}),z=d(I,1,`svelte-1nni06b`,null,z,{active:i(f)===`full`}),a(ye,`Bar ${i(M)+1} of ${i(W).length??``}`),re(Ce,`width: ${e??``}%`),T(je,i(N)===`auto-restart`),a(Ne,i(N)===`auto-restart`?`Gives 4 beats to refocus`:`Press any key to continue`),T(Ie,i(G))},[()=>i(M)/Math.max(1,i(W).length-1)*100]),p(`change`,x,Te),p(`click`,k,()=>Q(`chords`)),p(`click`,P,()=>Q(`melody`)),p(`click`,I,()=>Q(`full`)),p(`change`,je,Ee),p(`change`,Ie,()=>C(G,!i(G))),l(e,h)},h=b(()=>i(A)?.key?.charAt(0)||`C`);O(e,{randomMode:!1,description:`Practice songs bar by bar with rhythm. Play each chord or note on the beat. Mistakes will either auto-restart from the previous bar or pause until you press a key.`,exerciseType:`rhythm`,generateExpectedNotes:ve,generateScoreProps:q,validateNoteEvent:J,isCompleted:Ce,onReset:Z,onComplete:we,get initialNote(){return i(h)},showScore:!1,get defaultBpm(){return i(L)},perNoteTiming:!0,children:c,$$slots:{default:!0}})}x()}f([`change`,`click`,`input`]);export{L as component,M as universal};