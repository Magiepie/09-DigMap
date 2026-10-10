'use strict';
const canvas=document.querySelector('#map'),ctx=canvas.getContext('2d'),available=new Set(window.MAP_TILES||[]),cache=new Map();
const view={x:3222,y:3218,zoom:4,plane:0},$=s=>document.querySelector(s);
let width=1,height=1,pending=false,drag=null,hover=null;
function requestDraw(){if(!pending){pending=true;requestAnimationFrame(draw)}}
function world(x,y){return {x:view.x+(x-width/2)/view.zoom,y:view.y-(y-height/2)/view.zoom}}
function local(e){const r=canvas.getBoundingClientRect();return {x:e.clientX-r.left,y:e.clientY-r.top}}
function image(key){if(cache.has(key))return cache.get(key);const img=new Image();img.onload=requestDraw;img.onerror=()=>{img.failed=true;requestDraw()};img.src=`map_image/${key}.png`;cache.set(key,img);return img}
function draw(){pending=false;ctx.fillStyle='#101c1c';ctx.fillRect(0,0,width,height);ctx.imageSmoothingEnabled=view.zoom<4;const min=world(0,height),max=world(width,0);let visible=0;
for(let x=Math.floor(min.x/64);x<=Math.floor(max.x/64);x++)for(let y=Math.floor(min.y/64);y<=Math.floor(max.y/64);y++){const key=`${view.plane}_${x}_${y}`;if(!available.has(key))continue;visible++;const img=image(key);if(img.complete&&img.naturalWidth&&!img.failed)ctx.drawImage(img,width/2+(x*64-view.x)*view.zoom,height/2-(y*64+64-view.y)*view.zoom,64*view.zoom,64*view.zoom)}
if(typeof drawDigs==='function')drawDigs(min,max);
if(view.zoom>=10){ctx.strokeStyle='#ffffff15';ctx.lineWidth=1;ctx.beginPath();for(let x=Math.ceil(min.x);x<max.x;x++){const px=width/2+(x-view.x)*view.zoom;ctx.moveTo(px,0);ctx.lineTo(px,height)}for(let y=Math.ceil(min.y);y<max.y;y++){const py=height/2-(y-view.y)*view.zoom;ctx.moveTo(0,py);ctx.lineTo(width,py)}ctx.stroke()}
if(hover){ctx.strokeStyle='#edd8a2';ctx.lineWidth=1.5;ctx.strokeRect(width/2+(Math.floor(hover.x)-view.x)*view.zoom,height/2-(Math.floor(hover.y)+1-view.y)*view.zoom,view.zoom,view.zoom)}
$('#status').textContent=`${available.size.toLocaleString()} supplied regions · ${visible?'Plane '+view.plane:'No map regions here'}`;$('#scale').textContent=`${view.zoom.toFixed(1)} pixels / tile`;
if(cache.size>240)for(const key of cache.keys()){const [p,x,y]=key.split('_').map(Number);if(p!==view.plane||x*64<min.x-128||x*64>max.x+128||y*64<min.y-128||y*64>max.y+128)cache.delete(key);if(cache.size<=180)break}}
function zoom(factor,x=width/2,y=height/2){const anchor=world(x,y);view.zoom=Math.max(.3,Math.min(24,view.zoom*factor));view.x=anchor.x-(x-width/2)/view.zoom;view.y=anchor.y+(y-height/2)/view.zoom;requestDraw()}
new ResizeObserver(()=>{const r=canvas.getBoundingClientRect(),dpr=devicePixelRatio||1;width=r.width;height=r.height;canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);requestDraw()}).observe(canvas);
canvas.onpointerdown=e=>{if(e.button!==0)return;canvas.focus();if(e.ctrlKey||(typeof editMode!=='undefined'&&editMode)){e.preventDefault();const point=local(e),tile=world(point.x,point.y);if(typeof toggleDraftDig==='function')toggleDraftDig(Math.floor(tile.x),Math.floor(tile.y),view.plane);return}canvas.setPointerCapture(e.pointerId);drag={...local(e),id:e.pointerId}};
canvas.onpointermove=e=>{const p=local(e);if(drag&&drag.id===e.pointerId){view.x-=(p.x-drag.x)/view.zoom;view.y+=(p.y-drag.y)/view.zoom;drag={...p,id:e.pointerId}}hover=world(p.x,p.y);$('#coords').textContent=`X ${Math.floor(hover.x)} · Y ${Math.floor(hover.y)} · Plane ${view.plane}`;requestDraw()};
for(const event of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(event,()=>drag=null);
canvas.onpointerleave=()=>{if(!drag){hover=null;requestDraw()}};
canvas.addEventListener('wheel',e=>{e.preventDefault();const p=local(e);zoom(Math.exp(-e.deltaY*.0015),p.x,p.y)},{passive:false});
canvas.onkeydown=e=>{const step=80/view.zoom;if(e.key==='ArrowLeft')view.x-=step;else if(e.key==='ArrowRight')view.x+=step;else if(e.key==='ArrowUp')view.y+=step;else if(e.key==='ArrowDown')view.y-=step;else if(e.key==='+'||e.key==='=')zoom(1.3);else if(e.key==='-')zoom(1/1.3);else return;e.preventDefault();requestDraw()};
$('#plus').onclick=()=>zoom(1.3);$('#minus').onclick=()=>zoom(1/1.3);$('#home').onclick=()=>{Object.assign(view,{x:3222,y:3218,zoom:4,plane:0});$('#plane').value='0';hover=null;requestDraw()};
$('#goto').onsubmit=e=>{e.preventDefault();Object.assign(view,{x:Number($('#x').value),y:Number($('#y').value),plane:Number($('#plane').value)});hover=null;$('#coords').textContent=`X ${view.x} · Y ${view.y} · Plane ${view.plane}`;requestDraw()};
$('#plane').onchange=()=>{view.plane=Number($('#plane').value);requestDraw()};
$('#search').oninput=e=>$('#results').textContent=e.target.value?'No matching players. No uploads yet.':'No player uploads yet.';
requestDraw();



