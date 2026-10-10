const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),D=require('../dig-data.js');const nodes=new Map(),saved=new Map();let captures=0;
const context={DigData:D,updateSubmissionLink(){},document:{querySelector(selector){if(!nodes.has(selector))nodes.set(selector,{textContent:'',disabled:false,setAttribute(k,v){this[k]=v}});return nodes.get(selector)}},localStorage:{getItem:k=>saved.get(k)||null,setItem:(k,v)=>saved.set(k,v)},requestDraw(){},hasDig(p,x,y,plane){return p.regions.get(`${plane}_${Math.floor(x/64)}_${Math.floor(y/64)}`)?.has((y%64)*64+x%64)||false},canvas:{style:{},focus(){},setPointerCapture(){captures++}},local:e=>({x:e.x,y:e.y}),world:(x,y)=>({x,y}),view:{plane:0}};
vm.createContext(context);const layers=fs.readFileSync('layers.js','utf8');vm.runInContext(layers.slice(layers.indexOf('// Drafts are coordinate-only'),layers.indexOf('function updateSubmissionLink()')),context);const app=fs.readFileSync('app.js','utf8');vm.runInContext(app.split('\n').find(line=>line.startsWith('canvas.onpointerdown=')),context);
context.canvas.onpointerdown({button:0,ctrlKey:true,x:3222.7,y:3218.2,preventDefault(){}});assert.equal(captures,0);let json=JSON.parse(saved.get('09scape-draft'));assert.deepEqual(json,{tiles:[[3222,3218,0]]});
context.canvas.onpointerdown({button:0,ctrlKey:true,x:3222.7,y:3218.2,preventDefault(){}});assert.deepEqual(JSON.parse(saved.get('09scape-draft')),{tiles:[]});
context.canvas.onpointerdown({button:0,ctrlKey:false,x:1,y:1,pointerId:5});assert.equal(captures,1);
console.log('PASS: Ctrl-click toggles exact tiles, username-free draft persistence, export state and ordinary drag capture.');

nodes.get('#edit-mode').onclick();assert.equal(nodes.get('#edit-mode')['aria-pressed'],'true');assert.equal(context.canvas.style.cursor,'crosshair');context.canvas.onpointerdown({button:0,ctrlKey:false,x:100.1,y:200.2,preventDefault(){}});assert.equal(captures,1);assert.deepEqual(JSON.parse(saved.get('09scape-draft')),{tiles:[[100,200,0]]});nodes.get('#edit-mode').onclick();assert.equal(nodes.get('#edit-mode')['aria-pressed'],'false');assert.equal(context.canvas.style.cursor,'');context.canvas.onpointerdown({button:0,ctrlKey:false,x:100,y:200,pointerId:6});assert.equal(captures,2);console.log('PASS: editing toggle enables plain-click marking and restores drag mode.');



