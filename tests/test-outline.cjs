const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),D=require('../dig-data.js');
const source=fs.readFileSync('layers.js','utf8'),start=source.indexOf('function hasDig('),end=source.indexOf('function drawDigs(',start);let edges=0;
const context={view:{x:0,y:0,zoom:4,plane:0},width:800,height:600,ctx:{save(){},restore(){},beginPath(){},moveTo(){},lineTo(){edges++},stroke(){}}};vm.createContext(context);vm.runInContext(source.slice(start,end),context);
function check(tiles,expected){const p=D.player('Check');for(const tile of tiles)D.add(p,...tile);edges=0;context.outlineDigs(p,{x:-1,y:-1},{x:200,y:200});assert.equal(edges,expected)}
check([[1,1,0]],4);check([[1,1,0],[2,1,0]],6);check([[63,1,0],[64,1,0]],6);check([[1,63,0],[1,64,0]],6);check([[1,1,0],[2,1,1]],4);
const ring=[];for(let x=1;x<=3;x++)for(let y=1;y<=3;y++)if(x!==2||y!==2)ring.push([x,y,0]);check(ring,16);
console.log('PASS: area edges, adjacent tiles, both region seams, planes, and holes.');


