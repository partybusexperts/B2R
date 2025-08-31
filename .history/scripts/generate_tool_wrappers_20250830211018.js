const fs = require('fs');
const path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname,'..','data','toolsRegistry.json'),'utf8'));
const genDir = path.join(__dirname,'..','src','components','tools','generated');
if(!fs.existsSync(genDir)) fs.mkdirSync(genDir,{recursive:true});
let created = 0;
for(const t of data){
  const id = t.id;
  const file = path.join(genDir, id + '.tsx');
  if(fs.existsSync(file)) continue;
  const funcName = id.replace(/-/g,'_');
  const content = `import React from 'react';\nimport EmbedTool from '../EmbedTool';\nexport default function ${funcName}() { return <EmbedTool href=\"${t.href}\" label=\"Open ${t.title}\" />; }\n`;
  fs.writeFileSync(file,content,'utf8');
  created++;
}
console.log('created',created,'wrapper files');
