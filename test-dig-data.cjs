'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),D=require('./dig-data.js');
const alice=D.fromJSON({username:'Alice',tiles:[[3222,3218,0],[3222,3218,0],[63,63],[64,64,1],[65535,65535,3]]});assert.equal(D.count(alice),4);assert.equal(D.count(D.fromJSON(JSON.parse(D.stringify(alice)))),4);assert.deepEqual(D.toJSON(D.fromJSON(D.toJSON(alice))),D.toJSON(alice));
const bob=D.fromJSON({username:'Bob',tiles:[[3222,3218,0],[3223,3218,0]]}),union=D.player('Community');D.merge(union,alice);D.merge(union,bob);D.merge(union,bob);assert.equal(D.count(union),5);assert.equal(D.count(alice),4);
for(const value of [null,{}, {username:'Bad',tiles:[[1,'2']]},{username:'Bad',tiles:[[1,2,4]]},{username:'Bad',tiles:[[-1,2]]},{username:'Bad',tiles:[[1.5,2]]},{username:'<script>',tiles:[]}])assert.throws(()=>D.fromJSON(value));
const example=JSON.parse(fs.readFileSync('data/example-player.json','utf8').replace(/^\uFEFF/,''));assert.equal(D.count(D.fromJSON(example)),3);assert.equal(D.stringify(D.player('Empty')),'{\n  "username": "Empty",\n  "tiles": []\n}\n');
console.log('PASS: readable JSON round trip, duplicates, community union, plane/coordinate validation and sample import.');
