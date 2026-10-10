(function(root){
'use strict';
function username(name){if(typeof name!=='string'||! /^[A-Za-z0-9 _-]{1,39}$/.test(name)||!name.trim())throw Error('Username must contain 1–39 letters, numbers, spaces, underscores or hyphens.');return name.trim()}
function player(name){return {username:username(name),regions:new Map()}}
function add(p,x,y,plane=0){if(!Number.isInteger(x)||!Number.isInteger(y)||x<0||y<0||x>65535||y>65535||!Number.isInteger(plane)||plane<0||plane>3)throw Error('Coordinates must be integers from 0 to 65535; plane must be 0–3.');const key=`${plane}_${Math.floor(x/64)}_${Math.floor(y/64)}`;if(!p.regions.has(key))p.regions.set(key,new Set());p.regions.get(key).add((y%64)*64+x%64)}
function merge(a,b){for(const [key,tiles] of b.regions){if(!a.regions.has(key))a.regions.set(key,new Set());for(const tile of tiles)a.regions.get(key).add(tile)}return a}
function count(p){let total=0;for(const tiles of p.regions.values())total+=tiles.size;return total}
function fromJSON(value,identity){if(!value||!Array.isArray(value.tiles)||value.tiles.length>1000000)throw Error('JSON must contain up to 1,000,000 tiles: [[x,y,plane], …].');const p=player(identity===undefined?value.username:identity);for(const tile of value.tiles){if(!Array.isArray(tile)||tile.length<2||tile.length>3)throw Error('Each tile must be [x,y,plane].');add(p,tile[0],tile[1],tile[2]===undefined?0:tile[2])}return p}
function toJSON(p){const tiles=[];for(const [key,region] of p.regions){const [plane,rx,ry]=key.split('_').map(Number);for(const i of region)tiles.push([rx*64+i%64,ry*64+Math.floor(i/64),plane])}tiles.sort((a,b)=>a[2]-b[2]||a[1]-b[1]||a[0]-b[0]);return {username:p.username,tiles}}
function stringify(p,includeIdentity=true){const value=toJSON(p);return '{\n'+(includeIdentity?'  "username": '+JSON.stringify(value.username)+',\n':'')+'  "tiles": ['+(value.tiles.length?'\n'+value.tiles.map(t=>'    '+JSON.stringify(t)).join(',\n')+'\n  ':'')+']\n}\n'}
const api={player,add,merge,count,fromJSON,toJSON,stringify};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.DigData=api;
})(globalThis);

