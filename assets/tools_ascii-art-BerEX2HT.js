import"./modulepreload-polyfill-B5Qt9EMX.js";import{r as c,j as e,N as O,c as P}from"./NavMenu-CVJvOks0.js";const v={standard:" .:-=+*#%@",blocks:" ░▒▓█",detailed:' .",:;!~+-<>i?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$',simple:" .-+*#@"};function F(){const[n,I]=c.useState(null),[s,C]=c.useState(""),[o,S]=c.useState(""),[i,A]=c.useState(100),[d,T]=c.useState("standard"),[r,N]=c.useState(!1),g=c.useRef(null),E=c.useCallback(t=>{const l=t.target.files?.[0];if(l){S(l.name);const a=new FileReader;a.onload=h=>{I(h.target?.result),C("")},a.readAsDataURL(l)}},[]),R=c.useCallback(()=>{n&&(N(!0),setTimeout(()=>{const t=new Image;t.onload=()=>{const l=document.createElement("canvas"),a=l.getContext("2d");if(!a)return;const h=t.height/t.width,m=Math.floor(i*h*.5);l.width=i,l.height=m,a.drawImage(t,0,0,i,m);const u=a.getImageData(0,0,i,m).data,f=v[d];let x="";for(let p=0;p<m;p++){for(let b=0;b<i;b++){const j=(p*i+b)*4,L=u[j],U=u[j+1],D=u[j+2],M=(L+U+D)/3,y=Math.floor(M/255*(f.length-1));x+=f[y]}x+=`
`}C(x),N(!1)},t.src=n},10))},[n,i,d]),w=c.useCallback(()=>{s&&(navigator.clipboard.writeText(s),alert("ASCII art copied to clipboard!"))},[s]),k=c.useCallback(()=>{if(s){const t=new Blob([s],{type:"text/plain"}),l=URL.createObjectURL(t),a=document.createElement("a");a.href=l,a.download=`ascii-${o||"art"}.txt`,document.body.appendChild(a),a.click(),document.body.removeChild(a),URL.revokeObjectURL(l)}},[s,o]);return e.jsxs("div",{className:"terminal",children:[e.jsx(O,{}),e.jsxs("div",{className:"terminal-header",children:[e.jsx("div",{className:"terminal-title",children:"ASCII-FY v1.0"}),e.jsx("div",{className:"terminal-subtitle",children:"Image to ASCII Art Converter"})]}),e.jsxs("div",{className:"terminal-content",children:[e.jsxs("div",{className:"controls-section",children:[e.jsxs("div",{className:"control-group",children:[e.jsx("label",{className:"control-label",children:"► SELECT IMAGE FILE:"}),e.jsxs("div",{className:"file-input-wrapper",children:[e.jsx("input",{ref:g,type:"file",accept:"image/*",onChange:E,className:"file-input"}),e.jsx("button",{className:"file-button",onClick:()=>g.current?.click(),children:"Browse Files"}),o&&e.jsx("span",{className:"file-name",children:o})]}),n&&e.jsx("img",{src:n,alt:"Preview",className:"preview-image"})]}),e.jsxs("div",{className:"control-group",children:[e.jsxs("label",{className:"control-label",children:["► OUTPUT WIDTH: ",i," chars"]}),e.jsxs("div",{className:"slider-group",children:[e.jsx("input",{type:"range",min:"40",max:"200",value:i,onChange:t=>A(Number(t.target.value)),className:"slider"}),e.jsx("span",{className:"slider-value",children:i})]}),e.jsx("div",{className:"info-text",children:"Adjust the width to control detail level (40-200 characters)"})]}),e.jsxs("div",{className:"control-group",children:[e.jsx("label",{className:"control-label",children:"► CHARACTER SET:"}),e.jsx("div",{className:"charset-buttons",children:Object.keys(v).map(t=>e.jsx("button",{className:`charset-button ${d===t?"active":""}`,onClick:()=>T(t),children:t},t))}),e.jsxs("div",{className:"info-text",children:["Preview: ",v[d]]})]}),e.jsxs("div",{className:"action-buttons",children:[e.jsx("button",{className:"action-button",onClick:R,disabled:!n||r,children:r?"Processing...":"► Generate ASCII Art"}),e.jsx("button",{className:"action-button",onClick:w,disabled:!s,children:"Copy to Clipboard"}),e.jsx("button",{className:"action-button",onClick:k,disabled:!s,children:"Download .TXT"})]})]}),r&&e.jsx("div",{className:"loading",children:"░░░ PROCESSING IMAGE ░░░"}),s&&!r&&e.jsxs("div",{className:"output-section",children:[e.jsx("div",{className:"output-header",children:"► OUTPUT:"}),e.jsx("div",{className:"ascii-output",children:s}),e.jsxs("div",{className:"info-text",children:["Lines: ",s.split(`
`).length-1," | Characters: ",s.length]})]}),!n&&!r&&e.jsxs("div",{className:"output-section",children:[e.jsx("div",{className:"output-header",children:"► INSTRUCTIONS:"}),e.jsx("div",{className:"ascii-output",children:`
╔═══════════════════════════════════════════════════════════╗
║                   ASCII-FY v1.0                           ║
║              Image to ASCII Art Converter                 ║
╚═══════════════════════════════════════════════════════════╝

SYSTEM READY

1. Click "BROWSE FILES" to select an image
2. Adjust OUTPUT WIDTH for desired detail level
3. Choose a CHARACTER SET:
   - STANDARD: Classic ASCII art style
   - BLOCKS: Use block characters for solid look
   - DETAILED: Maximum detail with extended charset
   - SIMPLE: Minimalist 6-character set
4. Click "GENERATE ASCII ART" to convert
5. Copy to clipboard or download as .TXT file

TIPS:
• Smaller images work better (< 1MB recommended)
• High contrast images produce clearer results
• Larger width = more detail but harder to view
• Try different character sets for various effects

Ready for input_
`})]})]})]})}P.createRoot(document.getElementById("root")).render(e.jsx(c.StrictMode,{children:e.jsx(F,{})}));
