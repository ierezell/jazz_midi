import{x as f,av as p,aw as h,ax as E,O as _,h as d,C as o,y as T,q as i,w}from"./Dpbo9POk.js";function x(n){var t=document.createElement("template");return t.innerHTML=n,t.content}function r(n,t){var e=_;e.nodes_start===null&&(e.nodes_start=n,e.nodes_end=t)}function M(n,t){var e=(t&h)!==0,c=(t&E)!==0,a,m=!n.startsWith("<!>");return()=>{if(d)return r(o,null),o;a===void 0&&(a=x(m?n:"<!>"+n),e||(a=f(a)));var s=c||p?document.importNode(a,!0):a.cloneNode(!0);if(e){var l=f(s),v=s.lastChild;r(l,v)}else r(s,s);return s}}function N(n=""){if(!d){var t=i(n+"");return r(t,t),t}var e=o;return e.nodeType!==3&&(e.before(e=i()),w(e)),r(e,e),e}function C(){if(d)return r(o,null),o;var n=document.createDocumentFragment(),t=document.createComment(""),e=i();return n.append(t,e),r(t,e),n}function L(n,t){if(d){_.nodes_end=o,T();return}n!==null&&n.before(t)}const y="5";var u;typeof window<"u"&&((u=window.__svelte??(window.__svelte={})).v??(u.v=new Set)).add(y);export{L as a,r as b,C as c,N as d,M as t};
