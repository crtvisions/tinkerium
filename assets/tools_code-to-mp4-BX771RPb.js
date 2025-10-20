import"./modulepreload-polyfill-B5Qt9EMX.js";import{R as st,j as e,r as a,N as wt,a as jt}from"./NavMenu-CVJvOks0.js";const Ne=`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TYPE YOUR CODE - VHS</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #000;
            overflow: hidden;
            font-family: 'Press Start 2P', cursive; /* A retro pixel font */
        }
        canvas {
            display: block;
            background-color: #050510; /* Very dark blue */
            max-width: 100%;
            border: 2px solid #202040;
            box-shadow: 0 0 30px rgba(0,255,0,0.2), inset 0 0 10px rgba(0,255,0,0.1);
        }
        /* Import a retro font for better effect if available */
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
    </style>
</head>
<body>
    <canvas id="vhs-canvas"></canvas>

    <script>
        /**
         * A JavaScript and HTML Canvas animation displaying "TYPE YOUR CODE"
         * with a strong retro VHS aesthetic.
         *
         * Key Features:
         * - Text with a flickering, glitched appearance.
         * - Chromatic aberration (RGB splitting) effect on the text.
         * - Animated scan lines and static/noise overlay.
         * - Vertical screen jitter and horizontal displacement to simulate a worn tape.
         * - Pulsating glow around the text.
         */
        const canvas = document.getElementById('vhs-canvas');
        const ctx = canvas.getContext('2d');

        let width = 960;
        let height = 540; // 16:9 aspect ratio

        let frameCount = 0;
        const text = "TYPE YOUR CODE";
        const fontSize = 70; // Adjust based on canvas size
        const charWidth = fontSize * 0.6; // Approximate width of a character

        function resizeCanvas() {
            const aspectRatio = width / height;
            const newWidth = Math.min(window.innerWidth * 0.9, width);
            const newHeight = newWidth / aspectRatio;
            canvas.width = newWidth;
            canvas.height = newHeight;
        }

        function drawText(scale, frame) {
            ctx.save();
            // Text color base
            const baseColor = \`rgb(0, 255, 0)\`; // Green
            const shadowColor = \`rgba(0, 150, 0, 0.7)\`;

            const textX = canvas.width / 2;
            const textY = canvas.height / 2;

            ctx.font = \`\${fontSize * scale}px 'Press Start 2P', cursive\`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            // --- Text Shadow/Glow ---
            const glowIntensity = (Math.sin(frame * 0.05) + 1.5) * 0.5; // Pulsating glow
            ctx.shadowBlur = 15 * scale * glowIntensity;
            ctx.shadowColor = \`rgba(0, 255, 0, \${0.4 * glowIntensity})\`;
            ctx.fillStyle = baseColor;
            ctx.fillText(text, textX, textY);
            ctx.shadowBlur = 0; // Reset shadow for main text

            // --- Glitch Effect (random character displacement/flicker) ---
            const glitchFactor = 0.5; // How often glitches occur
            if (Math.random() < glitchFactor) {
                const charIndex = Math.floor(Math.random() * text.length);
                const char = text[charIndex];
                const charOffset = (charIndex - text.length / 2 + 0.5) * charWidth * scale;
                const glitchShiftX = (Math.random() - 0.5) * 15 * scale;
                const glitchShiftY = (Math.random() - 0.5) * 10 * scale;

                ctx.fillStyle = 'rgba(0, 255, 0, 0.5)';
                ctx.fillText(char, textX + charOffset + glitchShiftX, textY + glitchShiftY);
            }

            // --- Chromatic Aberration (RGB split) ---
            ctx.globalCompositeOperation = 'lighter';
            
            const abFactor = (Math.sin(frame * 0.03) + 1) * 0.5; // Pulsating aberration
            const abOffset = 3 * scale * abFactor;

            // Red channel
            ctx.fillStyle = 'rgba(255, 0, 0, 0.7)';
            ctx.fillText(text, textX - abOffset, textY);
            
            // Blue channel
            ctx.fillStyle = 'rgba(0, 0, 255, 0.7)';
            ctx.fillText(text, textX + abOffset, textY);

            ctx.globalCompositeOperation = 'source-over'; // Reset blend mode
            ctx.restore();
        }

        function drawVhsEffects(scale, frame) {
            // Scan Lines
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'; // Darker scan lines
            for (let i = 0; i < canvas.height; i += 3 * scale) {
                ctx.fillRect(0, i, canvas.width, 1 * scale);
            }

            // Static/Noise
            ctx.globalAlpha = 0.1;
            for (let i = 0; i < 300; i++) {
                const x = Math.random() * canvas.width;
                const y = Math.random() * canvas.height;
                const size = (Math.random() * 2 + 0.5) * scale;
                ctx.fillStyle = \`rgba(255, 255, 255, \${Math.random() * 0.4})\`;
                ctx.fillRect(x, y, size, size);
            }
            ctx.globalAlpha = 1.0;

            // Horizontal color bands (faint)
            if (frame % 5 === 0) {
                ctx.globalAlpha = 0.05;
                ctx.fillStyle = \`rgb(\${Math.random() * 50}, \${Math.random() * 50}, \${Math.random() * 50})\`;
                ctx.fillRect(0, Math.random() * canvas.height, canvas.width, 5 * scale);
                ctx.globalAlpha = 1.0;
            }
        }

        function animate() {
            const scale = canvas.width / width;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#050510'; // Background color
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // --- Apply global VHS distortions ---
            ctx.save();
            const jitterY = (Math.sin(frameCount * 0.1) * 0.5 + Math.random() * 0.5 - 0.25) * 5 * scale; // Vertical jitter
            const shiftX = (Math.sin(frameCount * 0.05) * 0.5 + Math.random() * 0.5 - 0.25) * 3 * scale; // Horizontal shift
            
            ctx.translate(shiftX, jitterY);

            drawText(scale, frameCount);
            
            ctx.restore(); // Restore context before drawing overlays
            
            drawVhsEffects(scale, frameCount);

            frameCount++;
            requestAnimationFrame(animate);
        }

        // Initial setup and start animation
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        animate();
    <\/script>
</body>
</html>`,ne={FPS:24,DURATION_SECONDS:3,DEFAULT_WIDTH:500,DEFAULT_HEIGHT:350},Ze={brightness:100,contrast:100,saturate:100,grayscale:0,sepia:0,invert:0};function St(n){const s=/animation(?:-duration)?\s*:\s*[^;}]*?([0-9\.]+)(s|ms)/g;let t;const i=[];for(;(t=s.exec(n))!==null;){let o=parseFloat(t[1]);t[2]==="ms"&&(o/=1e3),i.push(o)}const d=/animation\s*:\s*[^0-9]*([0-9\.]+)(s|ms)/g;for(;(t=d.exec(n))!==null;){let o=parseFloat(t[1]);t[2]==="ms"&&(o/=1e3),i.push(o)}return i.length>0?Math.max(...i):null}function Ct(n){const s=/\.scene\s*\{[^\}]*?width:\s*(\d+)px;[^\}]*?height:\s*(\d+)px;/s;let t=n.match(s);if(t&&t[1]&&t[2])return{width:parseInt(t[1],10),height:parseInt(t[2],10)};const i=/(?:let|const|var)\s+width\s*=\s*(\d+)/,d=/(?:let|const|var)\s+height\s*=\s*(\d+)/,o=n.match(i),l=n.match(d);if(o&&l)return{width:parseInt(o[1],10),height:parseInt(l[1],10)};const j=/setSize\(\s*(\d+)\s*,\s*(\d+)\s*\)/;if(t=n.match(j),t&&t[1]&&t[2])return{width:parseInt(t[1],10),height:parseInt(t[2],10)};const b=/<canvas[^>]*?width\s*=\s*"(\d+)"[^>]*?height\s*=\s*"(\d+)"/i;return t=n.match(b),t&&t[1]&&t[2]?{width:parseInt(t[1],10),height:parseInt(t[2],10)}:null}function Me(n,s,t=!1){const i=t?`
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Force restart all animations
            const animatedElements = document.querySelectorAll('*');
            animatedElements.forEach(el => {
                const computedStyle = window.getComputedStyle(el);
                if (computedStyle.animationName !== 'none' || el.style.animationName) {
                    el.style.animation = 'none';
                    el.offsetHeight; // Force reflow
                    el.style.animation = '';
                }
            });
        });
    <\/script>`:"",d="dynamic-filter-styles",o=s.includes("@keyframes")||s.includes("body {")?`<style id="${d}">${s}</style>`:`<style id="${d}">body { ${s} }</style>`,l=`
    <script>
        // Function to update styles without restarting animations
        window.updateFilterStyles = function(styleContent) {
            const styleElement = document.getElementById('${d}');
            if (styleElement) {
                const isFullCss = styleContent.includes('@keyframes') || styleContent.includes('body {');
                styleElement.textContent = isFullCss ? styleContent : 'body { ' + styleContent + ' }';
            }
        };
    <\/script>`;return n.includes("</head>")?n.replace("</head>",`${o}${l}${i}</head>`):`<html><head>${o}${l}${i}</head><body>${n}</body></html>`}function et(n){const s=n.match(/<style>([\s\S]*?)<\/style>/),t=n.match(/<body>([\s\S]*?)<\/body>/),i=n.match(/<script>([\s\S]*?)<\/script>/),d=s?s[1].trim():"",o=t?t[1].trim():"",l=i?i[1].trim():"";return{html:o,css:d,js:l}}function Re(n,s,t){return`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Animation Preview</title>
    <link href="https://fonts.googleapis.com/css2?family=VT323&display=swap" rel="stylesheet">
    <style>
        body {
            margin: 0;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            font-family: 'VT323', monospace;
            background: #1a113c; /* Fallback background */
        }
        ${s}
    </style>
</head>
<body>
    ${n}
    ${t?`<script>${t}<\/script>`:""}
</body>
</html>`}const kt=({children:n,className:s,style:t})=>e.jsx("svg",{className:s,style:t,xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"currentColor",children:n}),Nt=({className:n})=>e.jsx(kt,{className:n,children:e.jsx("path",{d:"M5 20h14v-2H5v2zM19 9h-4V3H9v6H5l7 7 7-7z"})}),Mt=({className:n})=>e.jsxs("svg",{className:n,xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M3 2v6h6"}),e.jsx("path",{d:"M3 13a9 9 0 1 0 3-7.7L3 8"})]}),Te=({children:n,variant:s="primary",className:t,...i})=>{const d="px-4 py-2 focus:outline-none transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed",o=s==="primary"?"primary-action":"";return e.jsx("button",{className:`${d} ${o} ${t||""}`,...i,children:n})},$t=`
.menu {
  font-size: 16px;
  color: #0f0;
  list-style: none;
  position: relative;
  margin: 0;
  padding: 0;
  font-family: 'VT323', monospace;
}

.menu .item {
  position: relative;
  display: inline-block;
}

.menu .link {
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: none;
  border: none;
  color: #0f0;
  font-size: 16px;
  font-family: 'VT323', monospace;
  text-transform: uppercase;
  letter-spacing: 1px;
  opacity: 0.8;
}

.menu .link:hover {
  opacity: 1;
}

.menu .link svg {
  width: 10px;
  height: 10px;
  transition: transform 0.2s ease;
  fill: currentColor;
  opacity: 0.5;
}

.menu .item:hover .link svg {
  transform: rotate(180deg);
}

.menu .submenu {
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 140px;
  background: #000;
  opacity: 0;
  visibility: hidden;
  transform: translateY(0);
  transition: all 0.2s ease;
  z-index: 1000;
  pointer-events: none;
  border: 1px solid rgba(0, 255, 0, 0.5);
  padding: 4px 0;
  margin-top: 8px;
}

.menu .submenu::before {
  content: '';
  position: absolute;
  top: -8px;
  left: 0;
  right: 0;
  height: 8px;
  background: transparent;
  pointer-events: auto;
}

.menu .item:hover .submenu,
.menu .submenu:hover {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}

.submenu-link {
  display: block;
  padding: 6px 14px;
  color: #0f0;
  font-size: 16px;
  font-family: 'VT323', monospace;
  transition: all 0.15s ease;
  cursor: pointer;
  text-align: left;
  width: 100%;
  background: transparent;
  border: none;
  margin: 0;
  white-space: nowrap;
  text-transform: uppercase;
  letter-spacing: 1px;
  opacity: 0.7;
}

.submenu-link:hover {
  opacity: 1;
  background-color: rgba(0, 255, 0, 0.1);
}`,Rt=({title:n="editor.js",editorMode:s="combined",onEditorModeChange:t,onGenerate:i,onClear:d,isGenerating:o=!1})=>(st.useEffect(()=>{const l=document.createElement("style");return l.textContent=$t,document.head.appendChild(l),()=>{document.head.removeChild(l)}},[]),e.jsx("header",{className:"w-full px-6 py-3 sticky top-0",style:{background:"#000",borderBottom:"1px solid rgba(0, 255, 0, 0.3)",zIndex:1,paddingLeft:"90px"},children:e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx("h1",{style:{fontSize:"18px",color:"#0f0",textTransform:"uppercase",letterSpacing:"2px",fontWeight:"normal",opacity:.9},children:n}),t&&e.jsx("div",{className:"ml-4 pl-4 h-full flex items-center",style:{borderLeft:"1px solid rgba(0, 255, 0, 0.2)"},children:e.jsx("div",{className:"menu",children:e.jsxs("div",{className:"item",children:[e.jsxs("button",{className:"link",children:[e.jsxs("span",{style:{fontSize:"16px",opacity:.8},children:["Mode: ",e.jsx("span",{style:{opacity:1},children:s==="combined"?"Combined":"Split"})]}),e.jsx("svg",{viewBox:"0 0 360 360",children:e.jsx("path",{d:"M325.607,79.393c-5.857-5.857-15.355-5.858-21.213,0.001l-139.39,139.393L25.607,79.393c-5.857-5.857-15.355-5.858-21.213,0.001c-5.858,5.858-5.858,15.355,0,21.213l150.004,150c2.813,2.813,6.628,4.393,10.606,4.393s7.794-1.581,10.606-4.394l149.996-150C331.465,94.749,331.465,85.251,325.607,79.393z"})})]}),e.jsxs("div",{className:"submenu",children:[e.jsxs("button",{className:"submenu-link",onClick:()=>t("combined"),children:[s==="combined"?"▸ ":"  ","Combined"]}),e.jsxs("button",{className:"submenu-link",onClick:()=>t("split"),children:[s==="split"?"▸ ":"  ","Split"]})]})]})})})]}),e.jsxs("div",{className:"flex items-center gap-3",children:[d&&e.jsx("button",{onClick:d,className:"px-3 py-1",style:{fontSize:"16px",opacity:.7},children:"Clear"}),i&&e.jsx("button",{onClick:i,disabled:o,className:"px-4 py-1.5 font-semibold primary-action",style:{fontSize:"16px"},children:o?"Generating...":"▸ Generate"})]})]})})),Tt=({code:n,setCode:s})=>e.jsx("div",{className:"h-full flex flex-col",children:e.jsx("textarea",{id:"code-editor",value:n,onChange:t=>s(t.target.value),className:"w-full flex-grow bg-gray-900 text-gray-300 p-4 focus:ring-2 focus:ring-orange-500 focus:outline-none font-mono text-sm resize-none border-0",spellCheck:"false"})}),Et=({html:n,onHtmlChange:s,css:t,onCssChange:i,js:d,onJsChange:o})=>{const[l,j]=a.useState("html"),b=[{lang:"html",value:n,onChange:s},{lang:"css",value:t,onChange:i},{lang:"js",value:d,onChange:o}],y=b.find(g=>g.lang===l);return e.jsxs("div",{className:"h-full flex flex-col",children:[e.jsx("div",{className:"flex-shrink-0 border-b border-gray-700 bg-gray-800",children:b.map(({lang:g})=>e.jsx("button",{onClick:()=>j(g),className:`px-4 py-2 text-sm font-medium transition-colors duration-200 focus:outline-none ${l===g?"bg-gray-900 text-orange-400 border-b-2 border-orange-400":"text-gray-400 hover:bg-gray-700/50"}`,children:g.toUpperCase()},g))}),e.jsx("textarea",{value:y?.value,onChange:g=>y?.onChange(g.target.value),className:"w-full flex-grow bg-gray-900 text-gray-300 p-4 focus:ring-2 focus:ring-orange-500 focus:outline-none font-mono text-sm resize-none border-0",spellCheck:"false","aria-label":`${l} code editor`})]})},Ft=({previewCode:n,mp4Url:s,isGenerating:t,progress:i,iframeRef:d,onDownload:o,dimensions:l,backgroundColor:j,cropTop:b=0,cropBottom:y=0,cropLeft:g=0,cropRight:w=0})=>{const C=a.useRef(null),[u,x]=a.useState({w:0,h:0});a.useEffect(()=>{if(!C.current)return;const I=new ResizeObserver(_=>{const N=_[0].contentRect;x({w:N.width,h:N.height})});return I.observe(C.current),()=>I.disconnect()},[]);const h=l.width,v=l.height,S=u.w>0&&u.h>0?Math.min(u.w/h,u.h/v,1):1,k=b>0||y>0||g>0||w>0,D={width:`${h*S}px`,height:`${v*S}px`,position:"relative"},L={position:"absolute",top:0,left:0,width:`${h}px`,height:`${v}px`,overflow:"hidden",backgroundColor:j,transform:`scale(${S})`,transformOrigin:"top left"},ae={width:`${h}px`,height:`${v}px`,transform:"scale(1)",transformOrigin:"top left",border:"none",position:"absolute",top:0,left:0,clipPath:`inset(${b}px ${w}px ${y}px ${g}px)`},M=k?{position:"absolute",top:`${b}px`,left:`${g}px`,width:`${Math.max(0,h-g-w)}px`,height:`${Math.max(0,v-b-y)}px`,border:"2px dashed rgba(122, 162, 247, 0.5)",pointerEvents:"none"}:void 0;return e.jsxs("div",{ref:C,className:"relative w-full h-full bg-gray-900 overflow-hidden flex items-center justify-center",children:[e.jsx("div",{style:D,children:e.jsxs("div",{style:L,children:[e.jsx("iframe",{ref:d,srcDoc:n,title:"Animation Preview",className:`transition-opacity duration-300 ${s?"opacity-0":"opacity-100"}`,sandbox:"allow-scripts allow-same-origin",style:ae}),k&&e.jsx("div",{style:M})]})}),(t||s)&&e.jsxs("div",{className:"absolute inset-0 flex flex-col items-center justify-center bg-gray-900 p-4",children:[t&&e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"w-16 h-16 border-4 border-dashed rounded-full animate-spin border-orange-500"}),e.jsx("p",{className:"mt-4 text-gray-300",children:i})]}),s&&!t&&e.jsxs("div",{className:"w-full h-full flex flex-col items-center justify-center gap-4",children:[e.jsx("video",{src:s,className:"max-w-full max-h-[80%] object-contain rounded-lg shadow-lg",controls:!0,autoPlay:!0,loop:!0,muted:!0,playsInline:!0}),e.jsxs(Te,{onClick:o,className:"rounded-full border-2 border-[#7aa2f7] bg-gradient-to-r from-[#7aa2f7] to-[#c0caf5] text-[#1a1b26] uppercase tracking-wide px-6 py-3 text-sm shadow-[0_12px_24px_rgba(122,162,247,0.35)] hover:shadow-[0_16px_32px_rgba(122,162,247,0.45)] hover:translate-y-[-2px] transition-all duration-200",children:[e.jsx(Nt,{className:"w-5 h-5"}),"Download MP4"]})]})]})]})},It=({cropTop:n,setCropTop:s,cropBottom:t,setCropBottom:i,cropLeft:d,setCropLeft:o,cropRight:l,setCropRight:j,loopCount:b,setLoopCount:y,playbackSpeed:g,setPlaybackSpeed:w,backgroundColor:C,setBackgroundColor:u,colorScheme:x,setColorScheme:h,filters:v,setFilterValue:S,onResetEffects:k,aiPrompt:D,onPromptChange:L,onGenerateAI:ae,aiIsGenerating:M,aiResult:I,aiError:_,onApplyAICode:N})=>{const[U,p]=a.useState("export");return e.jsxs("div",{className:"h-full flex flex-col bg-gray-900 relative",children:[e.jsxs("div",{className:"flex-shrink-0 border-b border-gray-700 flex",children:[e.jsx("button",{onClick:()=>p("export"),className:`relative flex-1 px-4 py-3 text-sm font-medium transition-colors duration-200 focus:outline-none ${U==="export"?"bg-gray-800 text-gray-200":"text-gray-400 hover:bg-gray-800/50"}`,children:"Export"}),e.jsx("button",{onClick:()=>p("effects"),className:`relative flex-1 px-4 py-3 text-sm font-medium transition-colors duration-200 focus:outline-none ${U==="effects"?"bg-gray-800 text-gray-200":"text-gray-400 hover:bg-gray-800/50"}`,children:"Effects"}),e.jsx("button",{onClick:()=>p("ai"),className:`relative flex-1 px-4 py-3 text-sm font-medium transition-colors duration-200 focus:outline-none ${U==="ai"?"bg-gray-800 text-gray-200":"text-gray-400 hover:bg-gray-800/50"}`,children:"AI Assistant"})]}),e.jsxs("div",{className:"flex-grow overflow-y-auto p-4 space-y-4",children:[U==="export"&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{children:[e.jsxs("label",{htmlFor:"crop-top",className:"block text-xs font-medium text-gray-400 mb-2",children:["TOP: ",e.jsxs("span",{className:"font-bold text-white",children:[n,"px"]})]}),e.jsx("input",{type:"range",id:"crop-top",min:"0",max:"200",value:n,onChange:f=>s(parseInt(f.target.value,10)),className:"w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500"})]}),e.jsxs("div",{children:[e.jsxs("label",{htmlFor:"crop-bottom",className:"block text-xs font-medium text-gray-400 mb-2",children:["BOTTOM: ",e.jsxs("span",{className:"font-bold text-white",children:[t,"px"]})]}),e.jsx("input",{type:"range",id:"crop-bottom",min:"0",max:"200",value:t,onChange:f=>i(parseInt(f.target.value,10)),className:"w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500"})]}),e.jsxs("div",{children:[e.jsxs("label",{htmlFor:"crop-left",className:"block text-xs font-medium text-gray-400 mb-2",children:["LEFT: ",e.jsxs("span",{className:"font-bold text-white",children:[d,"px"]})]}),e.jsx("input",{type:"range",id:"crop-left",min:"0",max:"200",value:d,onChange:f=>o(parseInt(f.target.value,10)),className:"w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500"})]}),e.jsxs("div",{children:[e.jsxs("label",{htmlFor:"crop-right",className:"block text-xs font-medium text-gray-400 mb-2",children:["RIGHT: ",e.jsxs("span",{className:"font-bold text-white",children:[l,"px"]})]}),e.jsx("input",{type:"range",id:"crop-right",min:"0",max:"200",value:l,onChange:f=>j(parseInt(f.target.value,10)),className:"w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500"})]}),e.jsxs("div",{children:[e.jsxs("label",{htmlFor:"loop",className:"block text-xs font-medium text-gray-400 mb-2",children:["LOOP COUNT: ",e.jsx("span",{className:"font-bold text-white",children:b})]}),e.jsx("input",{type:"range",id:"loop",min:"1",max:"10",value:b,onChange:f=>y(parseInt(f.target.value,10)),className:"w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500"})]}),e.jsxs("div",{children:[e.jsxs("label",{htmlFor:"speed",className:"block text-xs font-medium text-gray-400 mb-2",children:["PLAYBACK SPEED: ",e.jsxs("span",{className:"font-bold text-white",children:[g.toFixed(1),"x"]})]}),e.jsx("input",{type:"range",id:"speed",min:"0.25",max:"4",step:"0.25",value:g,onChange:f=>w(parseFloat(f.target.value)),className:"w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500"})]}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"background-color",className:"block text-xs font-medium text-gray-400 mb-2",children:"BACKGROUND COLOR"}),e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("input",{type:"color",id:"background-color",value:C,onChange:f=>u(f.target.value),className:"w-10 h-8 rounded border border-gray-600 bg-gray-700 cursor-pointer"}),e.jsx("span",{className:"text-gray-300 font-mono text-xs",children:C})]})]})]}),U==="effects"&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"flex justify-between items-center mb-2",children:[e.jsx("h4",{className:"text-xs font-semibold text-gray-300",children:"Effects"}),e.jsxs("button",{onClick:k,className:"px-2 py-1 text-xs font-semibold text-gray-300 bg-gray-700 hover:bg-gray-600 rounded transition-colors duration-200 flex items-center gap-1","aria-label":"Reset effects",children:[e.jsx(Mt,{className:"w-3 h-3"}),"Reset"]})]}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"color-scheme",className:"block text-xs font-medium text-gray-400 mb-2",children:"Color Scheme"}),e.jsxs("select",{id:"color-scheme",value:x,onChange:f=>h(f.target.value),className:"w-full bg-gray-800 text-gray-300 p-2 rounded border border-gray-600 focus:ring-2 focus:ring-orange-500 focus:outline-none text-xs",children:[e.jsx("option",{value:"none",children:"None"}),e.jsx("option",{value:"grayscale",children:"Grayscale"}),e.jsx("option",{value:"sepia",children:"Sepia"}),e.jsx("option",{value:"invert",children:"Invert"}),e.jsx("option",{value:"vhs",children:"VHS Retro"})]})]}),e.jsxs("div",{children:[e.jsxs("label",{htmlFor:"brightness",className:"block text-xs font-medium text-gray-400 mb-2",children:["Brightness: ",e.jsxs("span",{className:"font-bold text-white",children:[v.brightness,"%"]})]}),e.jsx("input",{type:"range",id:"brightness",min:"0",max:"200",value:v.brightness,onChange:f=>S("brightness",parseInt(f.target.value)),className:"w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500"})]}),e.jsxs("div",{children:[e.jsxs("label",{htmlFor:"contrast",className:"block text-xs font-medium text-gray-400 mb-2",children:["Contrast: ",e.jsxs("span",{className:"font-bold text-white",children:[v.contrast,"%"]})]}),e.jsx("input",{type:"range",id:"contrast",min:"0",max:"200",value:v.contrast,onChange:f=>S("contrast",parseInt(f.target.value)),className:"w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500"})]}),e.jsxs("div",{children:[e.jsxs("label",{htmlFor:"saturate",className:"block text-xs font-medium text-gray-400 mb-2",children:["Saturation: ",e.jsxs("span",{className:"font-bold text-white",children:[v.saturate,"%"]})]}),e.jsx("input",{type:"range",id:"saturate",min:"0",max:"200",value:v.saturate,onChange:f=>S("saturate",parseInt(f.target.value)),className:"w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500"})]})]}),U==="ai"&&e.jsxs("div",{className:"space-y-4",children:[e.jsx("div",{className:"bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mb-4",children:e.jsxs("p",{className:"text-xs text-blue-200 leading-relaxed",children:[e.jsx("strong",{children:"✨ AI Animation Generator"}),e.jsx("br",{}),"Describe what you want and the AI will create a working animation with HTML, CSS, and JavaScript."]})}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"ai-prompt",className:"block text-sm font-medium text-gray-300 mb-2",children:"What do you want to animate?"}),e.jsx("textarea",{id:"ai-prompt",value:D,onChange:f=>L(f.target.value),className:"w-full min-h-[120px] bg-gray-800 text-gray-200 p-3 rounded border border-gray-600 focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm resize-y",placeholder:'Example: "A cat in a hat retro style" or "Floating geometric shapes with neon colors"'})]}),_&&e.jsx("div",{className:"text-xs text-red-400 bg-red-500/10 border border-red-500/40 rounded px-3 py-2",children:_}),e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx(Te,{onClick:ae,disabled:M||!D.trim(),className:"px-5 py-2.5 text-sm font-semibold uppercase tracking-wide flex-1",children:M?"⚡ Generating…":"✨ Generate Animation"}),I&&e.jsx(Te,{onClick:N,variant:"secondary",className:"px-5 py-2.5 text-sm font-semibold uppercase tracking-wide",children:"Apply"})]}),I&&e.jsxs("div",{className:"bg-green-500/10 border border-green-500/30 rounded-lg p-3",children:[e.jsx("div",{className:"flex items-center gap-2 mb-2",children:e.jsx("span",{className:"text-xs font-semibold text-green-300",children:"✓ Animation Generated"})}),e.jsx("p",{className:"text-[11px] text-gray-400 mb-2",children:'Preview the animation above, then click "Apply" to load it into the editor.'}),e.jsxs("details",{className:"text-[11px] text-gray-400",children:[e.jsx("summary",{className:"cursor-pointer hover:text-gray-300",children:"View generated code"}),e.jsx("pre",{className:"mt-2 text-[10px] leading-relaxed text-gray-300 whitespace-pre-wrap break-words max-h-48 overflow-auto bg-gray-900/70 p-2 rounded",children:I.combined??I.raw})]})]})]})]})]})},tt=.2126,nt=.7152,at=.0722,$e=n=>Math.max(0,Math.min(255,n)),At=(n,s,t)=>{const i=n.data,d=i.length;let o=Math.max(0,s.brightness)/100,l=Math.max(0,s.contrast)/100,j=Math.max(0,s.saturate)/100,b=Math.min(1,Math.max(0,s.grayscale/100)),y=Math.min(1,Math.max(0,s.sepia/100));const g=Math.min(1,Math.max(0,s.invert/100));t==="vhs"&&(o*=.9,l*=1.2,j*=1.4,y=Math.max(y,.3));const w=128*(1-l);for(let C=0;C<d;C+=4){let u=i[C],x=i[C+1],h=i[C+2];u*=o,x*=o,h*=o,u=u*l+w,x=x*l+w,h=h*l+w;const v=tt*u+nt*x+at*h;if(u=v+(u-v)*j,x=v+(x-v)*j,h=v+(h-v)*j,b>0){const S=tt*u+nt*x+at*h;u=u*(1-b)+S*b,x=x*(1-b)+S*b,h=h*(1-b)+S*b}if(y>0){const S=u*.393+x*.769+h*.189,k=u*.349+x*.686+h*.168,D=u*.272+x*.534+h*.131;u=u*(1-y)+S*y,x=x*(1-y)+k*y,h=h*(1-y)+D*y}if(g>0){const S=255-u,k=255-x,D=255-h;u=u*(1-g)+S*g,x=x*(1-g)+k*g,h=h*(1-g)+D*g}i[C]=$e(u),i[C+1]=$e(x),i[C+2]=$e(h)}},Pt=(n,s,t)=>{n.save(),n.globalAlpha=.08,n.fillStyle="#000000";for(let d=0;d<t;d+=2)n.fillRect(0,d,s,1);n.globalAlpha=.2;const i=n.createRadialGradient(s/2,t/2,0,s/2,t/2,Math.max(s,t)/2);i.addColorStop(0,"transparent"),i.addColorStop(.75,"transparent"),i.addColorStop(1,"rgba(0, 0, 0, 0.65)"),n.fillStyle=i,n.fillRect(0,0,s,t),n.restore()},zt=n=>{const s=n.trim(),t={raw:s},i=/```(\w+)?\s*([\s\S]*?)```/g;let d;for(;(d=i.exec(n))!==null;){const o=(d[1]||"").toLowerCase(),l=d[2].trim();(o==="html"||o==="htm"||o==="xml")&&!t.html?t.html=l:o==="css"&&!t.css?t.css=l:(o==="javascript"||o==="js"||o==="ts"||o==="jsx"||o==="tsx")&&!t.js?t.js=l:t.combined||(t.combined=l)}if(!t.combined)if(t.html||t.css||t.js){const o=t.html??"",l=t.css??"",j=t.js??"";t.combined=Re(o,l,j)}else t.combined=s;return t};function Dt(){const[n,s]=a.useState("combined"),[t,i]=a.useState(Ne),[d,o]=a.useState(""),[l,j]=a.useState(""),[b,y]=a.useState(""),[g,w]=a.useState(!1),[C,u]=a.useState(""),[x,h]=a.useState(null),[v,S]=a.useState("mp4"),[k,D]=a.useState("#000000"),[L,ae]=a.useState(ne.DURATION_SECONDS),[M]=a.useState(ne.FPS),[I,_]=a.useState({width:ne.DEFAULT_WIDTH,height:ne.DEFAULT_HEIGHT}),[N,U]=a.useState("none"),[p,f]=a.useState(Ze),[rt,Ee]=a.useState(Ne),[se,ot]=a.useState(""),[re,fe]=a.useState(null),[xe,Fe]=a.useState(!1),[be,ye]=a.useState(null),T=a.useRef(null),J=a.useRef(!1),G=a.useRef(null),A=a.useRef(null),de=a.useRef(!1),oe=a.useRef([]),K=a.useRef(null),[ie,Ie]=a.useState(0),[me,Ae]=a.useState(0),[le,Pe]=a.useState(0),[ue,ze]=a.useState(0),[ve]=a.useState(2),[it]=a.useState(30),[De]=a.useState(!0),[he,Oe]=a.useState(1),[pe,He]=a.useState(1);a.useEffect(()=>{const{html:r,css:m,js:E}=et(Ne);o(r),j(m),y(E)},[]);const P=a.useMemo(()=>n==="combined"?t:Re(d,l,b),[n,t,d,l,b]);a.useEffect(()=>{const r=St(P);r!==null&&r>0&&ae(r);const m=Ct(P);_(m||{width:ne.DEFAULT_WIDTH,height:ne.DEFAULT_HEIGHT})},[P]);const lt=a.useCallback((r,m)=>{f(E=>({...E,[r]:m}))},[]),ct=a.useCallback(()=>{f(r=>({...Ze,grayscale:r.grayscale,sepia:r.sepia,invert:r.invert}))},[]);a.useEffect(()=>{f(r=>({...r,grayscale:N==="grayscale"?100:0,sepia:N==="sepia"?100:0,invert:N==="invert"?100:0}))},[N]);const Le=a.useMemo(()=>{let r=`filter: brightness(${p.brightness}%) contrast(${p.contrast}%) saturate(${p.saturate}%) grayscale(${p.grayscale}%) sepia(${p.sepia}%) invert(${p.invert}%);`;return N==="vhs"?`
                body {
                    filter: brightness(${p.brightness*.9}%) contrast(${p.contrast*1.2}%) saturate(${p.saturate*1.4}%) sepia(30%) hue-rotate(320deg) grayscale(${p.grayscale}%) invert(${p.invert}%);
                    position: relative;
                    animation: vhs-distortion 3s infinite;
                    background-color: ${k} !important;
                }
                
                body::before {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: 
                        repeating-linear-gradient(
                            0deg,
                            transparent,
                            transparent 1px,
                            rgba(0, 0, 0, 0.15) 1px,
                            rgba(0, 0, 0, 0.15) 2px
                        ),
                        repeating-linear-gradient(
                            90deg,
                            rgba(255, 0, 150, 0.06) 0px,
                            rgba(255, 0, 150, 0.06) 1px,
                            rgba(0, 255, 255, 0.06) 1px,
                            rgba(0, 255, 255, 0.06) 2px
                        );
                    pointer-events: none;
                    z-index: 9998;
                    animation: vhs-flicker 0.05s infinite;
                }
                
                body::after {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: 
                        radial-gradient(
                            ellipse at center,
                            transparent 30%,
                            rgba(0, 0, 0, 0.3) 100%
                        ),
                        linear-gradient(
                            45deg,
                            rgba(255, 0, 100, 0.04) 0%,
                            transparent 30%,
                            transparent 70%,
                            rgba(0, 255, 200, 0.04) 100%
                        );
                    pointer-events: none;
                    z-index: 9999;
                    animation: vhs-noise 0.1s infinite;
                }
                
                @keyframes vhs-flicker {
                    0% { opacity: 0.9; }
                    50% { opacity: 1; }
                    95% { opacity: 0.95; }
                    100% { opacity: 0.88; }
                }
                
                @keyframes vhs-distortion {
                    0% { transform: translateX(0) skewX(0deg); }
                    2% { transform: translateX(-1.5px) skewX(0.05deg); }
                    4% { transform: translateX(1.5px) skewX(-0.05deg); }
                    6% { transform: translateX(0) skewX(0deg); }
                    94% { transform: translateX(0) skewX(0deg); }
                    96% { transform: translateX(-1px) skewX(0.02deg); }
                    98% { transform: translateX(1px) skewX(-0.02deg); }
                    100% { transform: translateX(0) skewX(0deg); }
                }
                
                @keyframes vhs-noise {
                    0% { opacity: 0.85; }
                    25% { opacity: 0.92; }
                    50% { opacity: 0.88; }
                    75% { opacity: 0.95; }
                    100% { opacity: 0.82; }
                }
            `:r},[p,N]),We=a.useMemo(()=>`background-color: ${k} !important;`,[k]),Q=a.useMemo(()=>Le+" "+We,[Le,We]),we=a.useRef(!0),Be=a.useCallback(()=>{we.current?(Ee(Me(P,Q,!0)),we.current=!1):T.current?.contentWindow?.updateFilterStyles?T.current.contentWindow.updateFilterStyles(Q):Ee(Me(P,Q,!1))},[P,Q]),Xe=a.useRef(P);a.useEffect(()=>{Xe.current!==P&&(we.current=!0,Xe.current=P),Be()},[Be,P]);const dt=a.useCallback(r=>{be&&ye(null),ot(r)},[be]),mt=a.useCallback(async()=>{if(!se.trim()||xe){console.log("Skipping generation - missing prompt or already generating");return}Fe(!0),ye(null),fe(null),console.log("Starting AI generation with prompt:",se);try{console.log("Sending request to /api/generate-code");const r=await fetch("/api/generate-code",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({prompt:se})});console.log("Received response status:",r.status);const m=await r.json();if(console.log("Response data:",m),!r.ok){const Z=typeof m?.error=="string"&&m.error.length>0?m.error:"Failed to generate code";throw console.error("API Error:",Z,m),new Error(Z)}if(typeof m?.html=="string"&&typeof m?.css=="string"&&typeof m?.js=="string"){const Z=Re(m.html,m.css,m.js);fe({html:m.html,css:m.css,js:m.js,combined:Z,raw:Z});return}const E=m?.choices?.[0]?.message?.content??"";if(!E.trim())throw new Error("The AI response did not include any content");const $=zt(E);fe($)}catch(r){const m=r instanceof Error?r.message:String(r);ye(m)}finally{Fe(!1)}},[se,xe]),ut=a.useCallback(()=>{if(!re)return;let r=re.combined?.trim()??"";r||(r=re.raw),s("combined"),i(r);const m=et(r);o(m.html),j(m.css),y(m.js),h(null)},[re]),ht=()=>{if(!x)return;const r=document.createElement("a");r.href=x,r.download=`animation-${Date.now()}.${v}`,document.body.appendChild(r),r.click(),document.body.removeChild(r)},pt=a.useCallback(()=>{if(J.current=!0,A.current!==null){try{clearTimeout(A.current)}catch{}A.current=null}if(G.current&&G.current.state!=="inactive")try{G.current.stop()}catch(r){console.warn("Error stopping MediaRecorder:",r)}G.current=null,K.current&&(K.current.getTracks().forEach(r=>r.stop()),K.current=null),oe.current=[],de.current=!1,w(!1),u(""),h(null),S("mp4"),Ie(0),Ae(0),Pe(0),ze(0),Oe(1),He(1),D("#000000")},[]),gt=a.useCallback(async()=>{if(!T.current?.contentWindow?.document.body){alert("Preview window is not ready.");return}if(typeof MediaRecorder>"u"){alert("MediaRecorder API is not available in your browser. Please use a modern browser.");return}console.log("MediaRecorder availability:",{MediaRecorder:typeof MediaRecorder<"u",supportedTypes:[MediaRecorder.isTypeSupported("video/webm;codecs=vp9"),MediaRecorder.isTypeSupported("video/webm;codecs=vp8"),MediaRecorder.isTypeSupported("video/mp4")],userAgent:navigator.userAgent}),w(!0),h(null);let r=I.width,m=I.height;const E=document.createElement("canvas");E.width=r,E.height=m;const $=E.getContext("2d");if(!$){alert("Failed to get canvas context."),w(!1);return}const Ge=Me(P,Q,!1)+`
            <script>
                // Pause all animations immediately (do not alter layout)
                document.addEventListener('DOMContentLoaded', function() {
                    // Pause all animations
                    const style = document.createElement('style');
                    style.textContent = '* { animation-play-state: paused; }';
                    document.head.appendChild(style);
                    window.animationStyleElement = style;
                });
                
                // Robust function: rebuild the animation shorthand per element with negative delays
                window.seekToTime = function(timeInSeconds) {
                    const elements = document.querySelectorAll('*');
                    elements.forEach(el => {
                        const cs = window.getComputedStyle(el);
                        if (!cs.animationName || cs.animationName === 'none') return;
                        const names = cs.animationName.split(',');
                        if (!names.length) return;
                        const durations = cs.animationDuration.split(',');
                        const timingFns = cs.animationTimingFunction.split(',');
                        const counts = cs.animationIterationCount.split(',');
                        const directions = cs.animationDirection.split(',');
                        const fillModes = cs.animationFillMode.split(',');
                        const assembled = names.map((n, i) => {
                            const durStr = (durations[Math.min(i, durations.length - 1)] || '1s').trim();
                            const dur = parseFloat(durStr) || 1;
                            const tf = (timingFns[Math.min(i, timingFns.length - 1)] || 'linear').trim();
                            const cntStr = (counts[Math.min(i, counts.length - 1)] || '1').trim();
                            const dir = (directions[Math.min(i, directions.length - 1)] || 'normal').trim();
                            const fm = (fillModes[Math.min(i, fillModes.length - 1)] || 'none').trim();
                            const infinite = cntStr === 'infinite' || parseFloat(cntStr) > 1;
                            const nd = -(infinite ? (timeInSeconds % dur) : timeInSeconds);
                            return n.trim() + ' ' + durStr + ' ' + tf + ' ' + nd + 's ' + cntStr + ' ' + dir + ' ' + fm + ' running';
                        }).join(', ');
                        el.style.animation = assembled;
                        void el.offsetWidth; // force reflow
                        
                    });
                    // Pause on the very next frame to freeze at sampled time
                    window.requestAnimationFrame(() => {
                        const elements2 = document.querySelectorAll('*');
                        elements2.forEach(el => { try { el.style.animationPlayState = 'paused'; } catch {} });
                    });
                };
<\/script>
        `;console.log("Capture code:",Ge.substring(0,500)+"..."),T.current.srcdoc=Ge,await new Promise(c=>{T.current&&(T.current.onload=c)}),await new Promise(c=>setTimeout(c,500));let F=T.current.contentWindow;F&&F.document&&F.document.body&&(F.document.body.style.display="none",F.document.body.offsetHeight,F.document.body.style.display="",await new Promise(c=>setTimeout(c,200))),F=T.current.contentWindow;const je=F.document;let V=je.querySelector(".scene");if(!V){const c=je.querySelector("canvas");c?(console.warn('Capture selector ".scene" not found. Using canvas element.'),V=c):(console.warn('Capture selector ".scene" not found. Falling back to document.body.'),V=je.body)}const ge=V.getBoundingClientRect();r=Math.round(ge.width),m=Math.round(ge.height),console.log(`Detected scene dimensions: ${r}x${m}`),console.log(`Will capture at ${M} FPS for ${L} seconds (${Math.floor(L*M)} frames)`);let W=Math.max(2,Math.floor(ge.width)),B=Math.max(2,Math.floor(ge.height));W%2!==0&&(W+=1),B%2!==0&&(B+=1),E.width=W,E.height=B,J.current=!1,de.current=!1,oe.current=[],console.log(`Initializing MediaRecorder at ${W}x${B}, ${M}FPS`);const Ue=E.captureStream(M);K.current=Ue;let z="video/mp4",ee="mp4";if(!MediaRecorder.isTypeSupported(z)&&(z='video/mp4; codecs="avc1.42E01E"',!MediaRecorder.isTypeSupported(z)&&(z="video/webm;codecs=vp9",ee="webm",!MediaRecorder.isTypeSupported(z)&&(z="video/webm;codecs=vp8",!MediaRecorder.isTypeSupported(z)&&(z="video/webm",!MediaRecorder.isTypeSupported(z)))))){alert("Your browser does not support video recording. Please try Chrome or Firefox."),w(!1);return}console.log(`Using codec: ${z} (${ee} format)`);const ft=N==="vhs"?ve*1.5:ve,ce=new MediaRecorder(Ue,{mimeType:z,videoBitsPerSecond:ft*1e6});G.current=ce,ce.ondataavailable=c=>{c.data&&c.data.size>0&&(console.log(`MediaRecorder chunk received: ${c.data.size} bytes`),oe.current.push(c.data))},ce.onstop=()=>{if(console.log("MediaRecorder stopped, processing final video..."),oe.current.length===0){console.error("No video chunks recorded"),alert("No video data was recorded. Please try again."),w(!1);return}const c=new Blob(oe.current,{type:z});console.log(`Final video blob created: ${c.size} bytes, format: ${ee}`);const te=URL.createObjectURL(c);h(te),S(ee),u(`Done! (${ee.toUpperCase()} format)`),w(!1),ee==="webm"&&console.warn("Generated WebM format - QuickTime may not support this. Try VLC or Chrome for playback."),console.log("Video generation completed successfully")},ce.onerror=c=>{console.error("MediaRecorder error:",c),alert("Recording error occurred. Please try again."),w(!1)},console.log("MediaRecorder configured successfully, preparing to record..."),u("Preparing animation..."),T.current?.contentWindow?.seekToTime&&T.current.contentWindow.seekToTime(0),await new Promise(c=>setTimeout(c,300)),console.log("Starting MediaRecorder..."),ce.start(1e3);let O=0;const Ye=Math.max(1,Math.floor(L*M/Math.max(.001,pe))),q=Ye*Math.max(1,he);u("Capturing frames..."),console.log(`Starting capture of ${q} frames (${Ye} frames x ${Math.max(1,he)} loops) at ${M} FPS`);const _e=async()=>{if(J.current||O>=q){if(console.log(`Finalization triggered: abort=${J.current}, frameCount=${O}, totalFrames=${q}`),A.current!==null){try{clearTimeout(A.current)}catch{}A.current=null}if(!de.current){de.current=!0;try{console.log("Stopping MediaRecorder..."),G.current&&G.current.state==="recording"&&G.current.stop(),K.current&&K.current.getTracks().forEach(c=>c.stop()),console.log("Recording finalization initiated")}catch(c){console.error("Error finalizing recording:",{error:c instanceof Error?c.message:String(c),stack:c instanceof Error?c.stack:void 0,recorderState:G.current?.state,frameCount:O,timestamp:Date.now()});const te=c instanceof Error?c.message:String(c);alert("Error finalizing recording: "+te),w(!1)}}return}try{const c=O/M*pe,te=L>0?c%L:0;console.log(`[Frame ${O+1}/${q}] Seeking to time ${te.toFixed(3)}s`),T.current?.contentWindow?.seekToTime&&T.current.contentWindow.seekToTime(te),await new Promise(R=>setTimeout(R,2)),await new Promise(R=>{const H=F.requestAnimationFrame.bind(F);H(De?()=>R():()=>H(()=>R()))}),console.log(`[Frame ${O+1}/${q}] Capturing...`);let X;if(V.tagName&&V.tagName.toLowerCase()==="canvas")X=V;else{const R=F.document.body;X=await window.html2canvas(R,{scale:2,useCORS:!0,allowTaint:!0,logging:!1,backgroundColor:k,letterRendering:!0,imageTimeout:0,width:R.scrollWidth,height:R.scrollHeight,ignoreElements:H=>!1,onclone:(H,Qe)=>{const ke=F.getComputedStyle(F.document.body);H.body&&(H.body.style.filter=ke.filter,H.body.style.backgroundColor=ke.backgroundColor,H.body.style.animation=ke.animation)},foreignObjectRendering:!0,removeContainer:!1})}if(!X||X.width===0||X.height===0)throw new Error(`Frame ${O+1}: Invalid canvas capture`);console.log(`[Frame ${O+1}/${q}] Captured canvas: ${X.width}x${X.height}`),$.clearRect(0,0,W,B);const Se=X.width-le-ue,Ce=X.height-ie-me,xt=W/Se,bt=B/Ce,Ve=Math.min(xt,bt),qe=Se*Ve,Je=Ce*Ve,yt=(W-qe)/2,vt=(B-Je)/2;$.fillStyle=k,$.fillRect(0,0,W,B),$.save();let Y="";if(Y+=`brightness(${p.brightness}%) `,Y+=`contrast(${p.contrast}%) `,Y+=`saturate(${p.saturate}%) `,Y+=`grayscale(${p.grayscale}%) `,Y+=`sepia(${p.sepia}%) `,Y+=`invert(${p.invert}%)`,N==="vhs"){const R=p.brightness*.9,H=p.contrast*1.2,Qe=p.saturate*1.4;Y=`brightness(${R}%) contrast(${H}%) saturate(${Qe}%) sepia(30%) hue-rotate(320deg) grayscale(${p.grayscale}%) invert(${p.invert}%)`}$.filter=Y,$.drawImage(X,le,ie,Se,Ce,yt,vt,qe,Je),$.filter="none";const Ke=$.getImageData(0,0,W,B);if(At(Ke,p,N),$.putImageData(Ke,0,0),N==="vhs"&&Pt($,W,B),$.restore(),console.log(`[Frame ${O+1}] Frame drawn to canvas - MediaRecorder will capture it automatically`),await new Promise(R=>setTimeout(R,5)),u(`Capturing frame ${O+1} of ${q}`),O++,!J.current){try{A.current!==null&&clearTimeout(A.current)}catch{}const R=1e3/M;A.current=window.setTimeout(_e,R)}}catch(c){console.error("Error capturing frame:",c),J.current=!0,w(!1),alert("An error occurred during frame capture: "+(c instanceof Error?c.message:String(c)))}};try{A.current!==null&&clearTimeout(A.current)}catch{}A.current=window.setTimeout(_e,0)},[P,Q,p,N,k,L,M,I,g,ie,me,le,ue,ve,it,De,he,pe]);return e.jsxs("div",{className:"min-h-screen bg-gray-950 text-gray-100 flex flex-col",style:{position:"relative"},children:[e.jsx("div",{style:{position:"fixed",top:0,left:0,zIndex:999999,pointerEvents:"none"},children:e.jsx("div",{style:{pointerEvents:"auto"},children:e.jsx(wt,{})})}),e.jsx(Rt,{title:"editor.js",editorMode:n,onEditorModeChange:r=>s(r),onGenerate:gt,onClear:pt,isGenerating:g}),e.jsxs("main",{className:"flex-grow w-full px-0 py-0 flex flex-col lg:flex-row gap-0 h-[calc(100vh-52px)] overflow-hidden",children:[e.jsx("div",{className:"lg:w-1/2 flex flex-col gap-0 min-h-0 border-r border-gray-700",children:e.jsx("div",{className:"flex-grow min-h-0 flex flex-col bg-gray-900 overflow-hidden",children:n==="combined"?e.jsx(Tt,{code:t,setCode:i}):e.jsx(Et,{html:d,onHtmlChange:o,css:l,onCssChange:j,js:b,onJsChange:y})})}),e.jsxs("div",{className:"lg:w-1/2 flex flex-col gap-0 min-h-0",children:[e.jsx("div",{className:"flex-1 min-h-0 flex flex-col bg-gray-900 overflow-hidden",children:e.jsx(Ft,{previewCode:rt,mp4Url:x,isGenerating:g,progress:C,iframeRef:T,dimensions:I,backgroundColor:k,onDownload:ht,cropTop:ie,cropBottom:me,cropLeft:le,cropRight:ue})}),e.jsx("div",{className:"flex-1 min-h-0 flex flex-col",children:e.jsx(It,{cropTop:ie,setCropTop:Ie,cropBottom:me,setCropBottom:Ae,cropLeft:le,setCropLeft:Pe,cropRight:ue,setCropRight:ze,loopCount:he,setLoopCount:Oe,playbackSpeed:pe,setPlaybackSpeed:He,backgroundColor:k,setBackgroundColor:D,colorScheme:N,setColorScheme:U,filters:p,setFilterValue:lt,onResetEffects:ct,aiPrompt:se,onPromptChange:dt,onGenerateAI:mt,aiIsGenerating:xe,aiResult:re,aiError:be,onApplyAICode:ut})})]})]})]})}jt.createRoot(document.getElementById("root")).render(e.jsx(st.StrictMode,{children:e.jsx(Dt,{})}));
