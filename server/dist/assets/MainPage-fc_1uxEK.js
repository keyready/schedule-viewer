import{r as a,j as t,a as l,H as h,B as m,c as x,P as f,G as g}from"./index-D7uLg_kg.js";const j="_Input_n7k2j_1",k={Input:j},S=a.memo(n=>{const e=a.useRef(null),{value:s,onChange:r,type:c="text",autoFocus:o,readonly:p,...i}=n;a.useEffect(()=>{var u;o&&((u=e.current)==null||u.focus())},[o]);const d=u=>{r==null||r(u.target.value)};return t.jsx("input",{ref:e,value:s||"",onChange:d,className:k.Input,type:c,readOnly:p,...i})}),y=a.memo(n=>{const{setScheduleDir:e}=n,[s,r]=a.useState("");a.useEffect(()=>{const o=l.get("workDir");o&&(e(o),r(o))},[e]);const c=a.useCallback(o=>{o.preventDefault(),e(s),l.set("workDir",s)},[s,e]);return t.jsx("form",{onSubmit:c,children:t.jsxs(h,{maxW:!0,gap:"32",children:[t.jsx(S,{placeholder:"Введите путь до папки с расписаниями",onChange:r,value:s}),t.jsx(m,{type:"submit",children:"Загрузить"})]})})}),_="_Skeleton_9zedp_1",D={Skeleton:_},v=n=>{const{className:e,width:s,height:r,border:c}=n,o={width:s,height:r,borderRadius:c};return t.jsx("div",{className:x(D.Skeleton,{},[e]),style:o})},w="_groupsWrapper_wr8hv_1",b={groupsWrapper:w},G=a.memo(n=>t.jsx("div",{className:b.groupsWrapper,children:new Array(5).fill(0).map((e,s)=>t.jsx(v,{width:"100%",height:"150px",border:"10px"},s))})),N=()=>{const[n,e]=a.useState(l.get("workDir")||"../files/"),[s,r]=a.useState(!1);return t.jsxs(f,{children:[t.jsx(y,{setScheduleDir:e}),s&&t.jsx(G,{}),t.jsx(g,{directory:n,setIsGroupsLoading:r})]})};export{N as default};
