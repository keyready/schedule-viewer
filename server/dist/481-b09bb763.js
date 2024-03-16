"use strict";(self.webpackChunkschedule_viewer=self.webpackChunkschedule_viewer||[]).push([[481],{2481:(e,t,r)=>{r.r(t),r.d(t,{default:()=>L});var n=r(885),o=r(1762),a=r(7294),s=r(8669),i=r(1955),l=r(3329),c=r(4942),u=r(5987),d=r(3379),p=r.n(d),f=r(7795),h=r.n(f),b=r(569),v=r.n(b),m=r(3565),g=r.n(m),y=r(9216),x=r.n(y),j=r(4589),w=r.n(j),Z=r(6408),O={};O.styleTagTransform=w(),O.setAttributes=g(),O.insert=v().bind(null,"head"),O.domAPI=h(),O.insertStyleElement=x(),p()(Z.Z,O);const k=Z.Z&&Z.Z.locals?Z.Z.locals:void 0;var S=r(5893),P=["value","onChange","type","autoFocus","readonly"];function D(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}var A=(0,a.memo)((function(e){var t=(0,a.useRef)(null),r=e.value,n=e.onChange,o=e.type,s=void 0===o?"text":o,i=e.autoFocus,l=e.readonly,d=(0,u.Z)(e,P);return(0,a.useEffect)((function(){var e;i&&(null===(e=t.current)||void 0===e||e.focus())}),[i]),(0,S.jsx)("input",function(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?D(Object(r),!0).forEach((function(t){(0,c.Z)(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):D(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}({ref:t,value:r||"",onChange:function(e){null==n||n(e.target.value)},className:k.Input,type:s,readOnly:l},d))})),C=r(9400),E=(0,a.memo)((function(e){var t=e.setScheduleDir,r=(0,a.useState)(""),o=(0,n.Z)(r,2),s=o[0],c=o[1];(0,a.useEffect)((function(){var e=i.Z.get("workDir");e&&(t(e),c(e))}),[t]);var u=(0,a.useCallback)((function(e){e.preventDefault(),t(s),i.Z.set("workDir",s)}),[s,t]);return(0,S.jsx)("form",{onSubmit:u,children:(0,S.jsxs)(l.U,{maxW:!0,gap:"32",children:[(0,S.jsx)(A,{placeholder:"Введите путь до папки с расписаниями",onChange:c,value:s}),(0,S.jsx)(C.z,{type:"submit",children:"Загрузить"})]})})})),T=r(8502),I=r(2445),N={};N.styleTagTransform=w(),N.setAttributes=g(),N.insert=v().bind(null,"head"),N.domAPI=h(),N.insertStyleElement=x(),p()(I.Z,N);const W=I.Z&&I.Z.locals?I.Z.locals:void 0;var z=function(e){var t=e.className,r={width:e.width,height:e.height,borderRadius:e.border};return(0,S.jsx)("div",{className:(0,T.A)(W.Skeleton,{},[t]),style:r})},F=r(9952),R={};R.styleTagTransform=w(),R.setAttributes=g(),R.insert=v().bind(null,"head"),R.domAPI=h(),R.insertStyleElement=x(),p()(F.Z,R);const _=F.Z&&F.Z.locals?F.Z.locals:void 0;var G=(0,a.memo)((function(e){return(0,S.jsx)("div",{className:_.groupsWrapper,children:new Array(5).fill(0).map((function(e,t){return(0,S.jsx)(z,{width:"100%",height:"150px",border:"10px"},t)}))})}));const L=function(){var e=(0,a.useState)(i.Z.get("workDir")||"../files/"),t=(0,n.Z)(e,2),r=t[0],l=t[1],c=(0,a.useState)(!1),u=(0,n.Z)(c,2),d=u[0],p=u[1];return(0,S.jsxs)(o.T,{children:[(0,S.jsx)(E,{setScheduleDir:l}),d&&(0,S.jsx)(G,{}),(0,S.jsx)(s.cv,{directory:r,setIsGroupsLoading:p})]})}},9952:(e,t,r)=>{r.d(t,{Z:()=>i});var n=r(8081),o=r.n(n),a=r(3645),s=r.n(a)()(o());s.push([e.id,".ebaaa{display:grid;align-items:stretch;margin-top:20px;grid-template-columns:repeat(3, 1fr);grid-gap:10px;justify-items:stretch}",""]),s.locals={groupsWrapper:"ebaaa"};const i=s},6408:(e,t,r)=>{r.d(t,{Z:()=>i});var n=r(8081),o=r.n(n),a=r(3645),s=r.n(a)()(o());s.push([e.id,".d3816{width:100%;padding:5px 10px;border:none;color:inherit;background:rgba(0,0,0,0);font:var(--font-m);transition:200ms;margin-bottom:5px;border-bottom:2px solid var(--card-bg);outline:none}.d3816:active,.d3816:focus{border-bottom:2px solid var(--inverted-bg-color)}",""]),s.locals={Input:"d3816"};const i=s},2445:(e,t,r)=>{r.d(t,{Z:()=>i});var n=r(8081),o=r.n(n),a=r(3645),s=r.n(a)()(o());s.push([e.id,'.f3902{width:100%;height:50px;position:relative;box-shadow:0 2px 10px 0 var(--skeleton-shadow);overflow:hidden;outline:2px solid var(--primary-color)}.f3902::before{width:80%;height:100%;background:linear-gradient(to right, transparent 0%, var(--skeleton-color) 50%, transparent 100%);display:block;content:"";position:absolute;left:-150px;top:0;animation:c5699 1s cubic-bezier(0.4, 0, 0.2, 1) infinite}@keyframes c5699{from{left:-150px}to{left:100%}}',""]),s.locals={Skeleton:"f3902",load:"c5699"};const i=s}}]);