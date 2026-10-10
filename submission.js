(function(root){
'use strict';
function link(repo,p){if(!/^[\w.-]+\/[\w.-]+$/.test(repo||''))throw Error('Repository is not configured.');const count=DigData.count(p);if(!count)return {url:'https://github.com/'+repo+'/issues/new?template=dig-upload.yml',empty:true};const data=DigData.toJSON(p),body='### Player JSON\n\n```json\n'+JSON.stringify({tiles:data.tiles})+'\n```\n',url='https://github.com/'+repo+'/issues/new?'+new URLSearchParams({title:'[Dig upload] '+count+' dug tiles',body}).toString();return url.length<=7500?{url,empty:false,attachment:false}:{url:'https://github.com/'+repo+'/issues/new?template=dig-upload.yml',empty:false,attachment:true}}
if(typeof module!=='undefined'&&module.exports)module.exports={link};else root.DigSubmission={link};
})(globalThis);
