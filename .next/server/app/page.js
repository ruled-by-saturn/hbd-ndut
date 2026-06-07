(()=>{var e={};e.id=931,e.ids=[931],e.modules={7849:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external")},2934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},5403:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external")},4580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},4749:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external")},5869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},957:(e,t,r)=>{"use strict";r.r(t),r.d(t,{GlobalError:()=>s.a,__next_app__:()=>p,originalPathname:()=>m,pages:()=>c,routeModule:()=>u,tree:()=>d}),r(5480),r(2029),r(5866);var a=r(3191),n=r(8716),i=r(7922),s=r.n(i),o=r(5231),l={};for(let e in o)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(l[e]=()=>o[e]);r.d(t,l);let d=["",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(r.bind(r,5480)),"/home/claude/hbd-ndut/src/app/page.tsx"]}]},{layout:[()=>Promise.resolve().then(r.bind(r,2029)),"/home/claude/hbd-ndut/src/app/layout.tsx"],"not-found":[()=>Promise.resolve().then(r.t.bind(r,5866,23)),"next/dist/client/components/not-found-error"]}],c=["/home/claude/hbd-ndut/src/app/page.tsx"],m="/page",p={require:r,loadChunk:()=>Promise.resolve()},u=new a.AppPageRouteModule({definition:{kind:n.x.APP_PAGE,page:"/page",pathname:"/",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:d}})},3221:(e,t,r)=>{Promise.resolve().then(r.t.bind(r,2994,23)),Promise.resolve().then(r.t.bind(r,6114,23)),Promise.resolve().then(r.t.bind(r,9727,23)),Promise.resolve().then(r.t.bind(r,9671,23)),Promise.resolve().then(r.t.bind(r,1868,23)),Promise.resolve().then(r.t.bind(r,4759,23))},6061:()=>{},9741:(e,t,r)=>{Promise.resolve().then(r.bind(r,4497))},4497:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>l});var a=r(326),n=r(434),i=r(7577);let s=["#FFB3C6","#B5EAD7","#C7CEEA","#FFDAC1","#FFD6E0","#E2F0CB","#F9D4B6","#D4E9FF","#ECD9FA"];function o({style:e}){return a.jsx("div",{style:{position:"fixed",borderRadius:"50%",opacity:.5,pointerEvents:"none",...e}})}function l(){let[e]=(0,i.useState)(()=>Array.from({length:18},(e,t)=>({id:t,size:20+60*Math.random(),left:100*Math.random(),color:s[t%s.length],delay:8*Math.random(),duration:6+6*Math.random()})));return(0,a.jsxs)("main",{style:{minHeight:"100vh",background:"var(--bg)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"2rem",overflow:"hidden",position:"relative"},children:[e.map(e=>a.jsx(o,{style:{width:e.size,height:e.size,left:`${e.left}%`,top:`${20+60*Math.random()}%`,background:e.color,animation:`floatBlob ${e.duration}s ease-in-out ${e.delay}s infinite alternate`}},e.id)),a.jsx("style",{children:`
        @keyframes floatBlob {
          0% { transform: translateY(0px) scale(1); }
          100% { transform: translateY(-30px) scale(1.08); }
        }
        @keyframes titleFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .menu-card {
          background: white;
          border-radius: 24px;
          padding: 2.5rem 2rem;
          width: 100%;
          max-width: 280px;
          text-align: center;
          border: 2.5px solid var(--green);
          cursor: pointer;
          text-decoration: none;
          color: var(--green);
          box-shadow: 6px 6px 0px var(--green);
          transition: transform 0.2s, box-shadow 0.2s;
          animation: cardIn 0.7s ease both;
          display: block;
        }
        .menu-card:hover {
          transform: translate(-3px, -3px);
          box-shadow: 9px 9px 0px var(--green);
        }
        .menu-card:active {
          transform: translate(2px, 2px);
          box-shadow: 3px 3px 0px var(--green);
        }
        .card-icon {
          font-size: 3.5rem;
          margin-bottom: 1rem;
          display: block;
        }
        .card-title {
          font-family: Georgia, serif;
          font-weight: bold;
          font-size: 1.4rem;
          color: var(--green);
          margin-bottom: 0.5rem;
        }
        .card-desc {
          font-family: Helvetica, sans-serif;
          font-size: 0.9rem;
          color: #557a2d;
          line-height: 1.5;
        }
        .page-title {
          font-family: Georgia, serif;
          font-weight: bold;
          font-size: clamp(2rem, 6vw, 3.5rem);
          color: var(--green);
          text-align: center;
          margin-bottom: 0.6rem;
          animation: titleFloat 3s ease-in-out infinite;
          position: relative;
          z-index: 2;
        }
        .page-subtitle {
          font-family: Helvetica, sans-serif;
          font-size: clamp(0.85rem, 2.5vw, 1.05rem);
          color: #557a2d;
          text-align: center;
          margin-bottom: 3rem;
          font-style: italic;
          position: relative;
          z-index: 2;
          letter-spacing: 0.02em;
        }
        .cards-row {
          display: flex;
          flex-direction: row;
          gap: 2rem;
          justify-content: center;
          position: relative;
          z-index: 2;
          flex-wrap: wrap;
        }
        @media (max-width: 600px) {
          .cards-row { flex-direction: column; align-items: center; }
        }
      `}),(0,a.jsxs)("div",{style:{position:"relative",zIndex:2,display:"flex",flexDirection:"column",alignItems:"center",width:"100%"},children:[a.jsx("div",{style:{fontSize:"2.5rem",marginBottom:"0.5rem"},children:"\uD83C\uDF82"}),a.jsx("h1",{className:"page-title",children:"Happy Birthday, Ndut!"}),a.jsx("p",{className:"page-subtitle",children:"thank you for being born — from your friends"}),(0,a.jsxs)("div",{className:"cards-row",children:[(0,a.jsxs)(n.default,{href:"/board",className:"menu-card",style:{animationDelay:"0.1s"},children:[a.jsx("span",{className:"card-icon",children:"\uD83D\uDC8C"}),a.jsx("div",{className:"card-title",children:"Birthday Board"}),a.jsx("p",{className:"card-desc",children:"Read all the love and wishes from people who adore you"})]}),(0,a.jsxs)(n.default,{href:"/msg",className:"menu-card",style:{animationDelay:"0.3s"},children:[a.jsx("span",{className:"card-icon",children:"✍️"}),a.jsx("div",{className:"card-title",children:"Leave a Wish"}),a.jsx("p",{className:"card-desc",children:"Send your birthday message and a favorite memory"})]})]}),a.jsx("div",{style:{marginTop:"3rem",fontSize:"0.8rem",color:"#99b87a",fontFamily:"Helvetica, sans-serif",position:"relative",zIndex:2},children:"made with \uD83D\uDC9A for ndut"})]})]})}},2029:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>i,metadata:()=>n});var a=r(9510);r(5023);let n={title:"Happy Birthday, Ndut!",description:"Birthday wishes for the most wonderful person \uD83C\uDF82"};function i({children:e}){return a.jsx("html",{lang:"en",children:a.jsx("body",{children:e})})}},5480:(e,t,r)=>{"use strict";r.r(t),r.d(t,{$$typeof:()=>s,__esModule:()=>i,default:()=>o});var a=r(8570);let n=(0,a.createProxy)(String.raw`/home/claude/hbd-ndut/src/app/page.tsx`),{__esModule:i,$$typeof:s}=n;n.default;let o=(0,a.createProxy)(String.raw`/home/claude/hbd-ndut/src/app/page.tsx#default`)},5023:()=>{}};var t=require("../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),a=t.X(0,[819,434],()=>r(957));module.exports=a})();