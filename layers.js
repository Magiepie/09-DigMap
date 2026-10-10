'use strict';
const players=new Map(),selectedPlayers=new Set();let community=DigData.player('Community');
const message=document.querySelector('#upload-status');
function showMessage(text){message.textContent=text}
function rebuild(){community=DigData.player('Community');for(const p of players.values())DigData.merge(community,p);document.querySelector('#community-count').textContent=DigData.count(community).toLocaleString()+' tiles';renderPlayers();requestDraw()}
function download(p){const url=URL.createObjectURL(new Blob([DigData.stringify(p)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download=p.username.replace(/[^a-z0-9_-]/gi,'_')+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
function renderPlayers(){const list=document.querySelector('#results'),query=document.querySelector('#search').value.trim().toLowerCase();list.replaceChildren();for(const [key,p] of [...players].sort((a,b)=>a[0].localeCompare(b[0]))){if(!key.includes(query))continue;const row=document.createElement('div');row.className='player-row';const label=document.createElement('label'),check=document.createElement('input');check.type='checkbox';check.checked=selectedPlayers.has(key);check.onchange=()=>{check.checked?selectedPlayers.add(key):selectedPlayers.delete(key);requestDraw()};label.append(check,document.createTextNode(p.username+'_Layer'));const meta=document.createElement('small');meta.textContent=DigData.count(p)+' tiles';label.append(meta);const button=document.createElement('button');button.textContent='↓';button.title='Export '+p.username;button.onclick=()=>download(p);row.append(label,button);list.append(row)}if(!list.childNodes.length)list.textContent=players.size?'No matching players.':'No player uploads yet.'}
function paintTiles(p,color,min,max){ctx.fillStyle=color;for(const [key,tiles] of p.regions){const [plane,rx,ry]=key.split('_').map(Number);if(plane!==view.plane||rx*64>max.x||rx*64+64<min.x||ry*64>max.y||ry*64+64<min.y)continue;for(const i of tiles){const x=rx*64+i%64,y=ry*64+Math.floor(i/64);if(x<min.x-1||x>max.x||y<min.y-1||y>max.y)continue;ctx.fillRect(width/2+(x-view.x)*view.zoom,height/2-(y+1-view.y)*view.zoom,Math.max(1,view.zoom),Math.max(1,view.zoom))}}}
function hasDig(p,x,y,plane){if(x<0||y<0||x>65535||y>65535)return false;const tiles=p.regions.get(`${plane}_${Math.floor(x/64)}_${Math.floor(y/64)}`);return !!tiles&&tiles.has((y%64)*64+x%64)}
function outlineDigs(p,min,max){ctx.save();ctx.strokeStyle='#b8ffea';ctx.lineWidth=2;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();
const edge=(x1,y1,x2,y2)=>{ctx.moveTo(width/2+(x1-view.x)*view.zoom,height/2-(y1-view.y)*view.zoom);ctx.lineTo(width/2+(x2-view.x)*view.zoom,height/2-(y2-view.y)*view.zoom)};
for(const [key,tiles] of p.regions){const [plane,rx,ry]=key.split('_').map(Number);if(plane!==view.plane||rx*64>max.x+1||rx*64+64<min.x-1||ry*64>max.y+1||ry*64+64<min.y-1)continue;
for(const i of tiles){const x=rx*64+i%64,y=ry*64+Math.floor(i/64);if(x<min.x-1||x>max.x+1||y<min.y-1||y>max.y+1)continue;
if(!hasDig(p,x-1,y,plane))edge(x,y,x,y+1);
if(!hasDig(p,x+1,y,plane))edge(x+1,y,x+1,y+1);
if(!hasDig(p,x,y-1,plane))edge(x,y,x+1,y);
if(!hasDig(p,x,y+1,plane))edge(x,y+1,x+1,y+1);
}}ctx.stroke();ctx.restore()}
function drawDigs(min,max){if(document.querySelector('#community').checked)paintTiles(community,'#eac56a99',min,max);for(const key of selectedPlayers){const p=players.get(key);if(p)paintTiles(p,'#64e4c3bb',min,max)}for(const key of selectedPlayers){const p=players.get(key);if(p)outlineDigs(p,min,max)}if(typeof draft!=='undefined'){paintTiles(draft,'#76b5ffbb',min,max);outlineDigs(draft,min,max)}}
document.querySelector('#search').oninput=renderPlayers;
document.querySelector('#community').onchange=requestDraw;
document.querySelector('#export-community').onclick=()=>download(community);
const submit=document.querySelector('#submit-digs'),repo=window.GITHUB_REPOSITORY;
async function loadPublished(){try{if(location.protocol==='file:'){showMessage('Preview through a local web server or GitHub Pages to load shared player JSON.');rebuild();return}const response=await fetch('data/atlas.json',{cache:'no-cache'});if(!response.ok)throw Error('Unable to load shared player data.');const atlas=await response.json();if(!Array.isArray(atlas.players))throw Error('Invalid published atlas.');const loaded=atlas.players.map(value=>DigData.fromJSON(value));players.clear();for(const p of loaded){const key=p.username.toLowerCase();if(players.has(key))DigData.merge(players.get(key),p);else players.set(key,p)}rebuild();showMessage(players.size?'Showing published community data. Submit an Issue to add your digs.':'No published uploads yet. Be the first to submit your digs.')}catch(error){showMessage('Shared data could not be loaded. Refresh to retry.');rebuild()}}
loadPublished();

// Drafts are coordinate-only JSON. Attribution is added by the Issue Action.
let draft=DigData.player('Draft');
function updateDraft(){updateSubmissionLink();document.querySelector('#draft-count').textContent=DigData.count(draft).toLocaleString()+' tiles selected';document.querySelector('#export-draft').disabled=DigData.count(draft)===0;try{localStorage.setItem('09scape-draft',DigData.stringify(draft,false));document.querySelector('#draft-status').textContent='Draft saved in this browser.'}catch(e){document.querySelector('#draft-status').textContent='Browser storage unavailable. Download your draft to keep it.'}requestDraw()}
function toggleDraftDig(x,y,plane){try{const key=`${plane}_${Math.floor(x/64)}_${Math.floor(y/64)}`,i=(y%64)*64+x%64;if(hasDig(draft,x,y,plane)){const tiles=draft.regions.get(key);tiles.delete(i);if(!tiles.size)draft.regions.delete(key)}else DigData.add(draft,x,y,plane);updateDraft()}catch(error){document.querySelector('#draft-status').textContent=error.message}}
document.querySelector('#export-draft').onclick=()=>{const url=URL.createObjectURL(new Blob([DigData.stringify(draft,false)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download='my-digs.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)};
document.querySelector('#undo-draft').onclick=()=>{draft=DigData.player('Draft');updateDraft()};
try{const saved=localStorage.getItem('09scape-draft');if(saved)draft=DigData.fromJSON(JSON.parse(saved),'Draft')}catch(e){document.querySelector('#draft-status').textContent='Could not restore your draft.'}
updateDraft();

let editMode=false;
document.querySelector('#edit-mode').onclick=()=>{editMode=!editMode;drag=null;const button=document.querySelector('#edit-mode');button.textContent='Editing mode: '+(editMode?'On':'Off');button.setAttribute('aria-pressed',String(editMode));canvas.style.cursor=editMode?'crosshair':''};

function updateSubmissionLink(){const state=DigSubmission.link(window.GITHUB_REPOSITORY,draft);submit.href=state.url;submit.textContent=state.attachment?'Submit digs (attach JSON) ↗':'Submit digs ↗';document.querySelector('#submission-help').textContent=state.empty?'Mark tiles above, then Submit digs will prefill your Issue.':state.attachment?'This draft is too large to prefill a link. Download your JSON and attach it in the Issue.':'Your '+DigData.count(draft).toLocaleString()+' dug tiles will be filled into the Issue automatically. Just review and submit.'}

