const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, '..', 'data', 'toolsRegistry.json');
const registryPath = path.join(__dirname, '..', 'src', 'components', 'tools', 'registry.tsx');

const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const registry = fs.readFileSync(registryPath, 'utf8');

// extract keys from componentMap
const mapMatch = registry.match(/const componentMap[\s\S]*?=\s*{([\s\S]*?)};/m);
let keys = [];
if (mapMatch) {
  const body = mapMatch[1];
  const re = /['"`]([a-z0-9\-]+)['"`]\s*:\s*[^,\n]+/gi;
  let mm;
  while ((mm = re.exec(body)) !== null) keys.push(mm[1]);
}

console.log('# Tool audit: id \t type \t title');
for (const t of data) {
  const hasComp = keys.includes(t.id);
  console.log(`${t.id}\t${hasComp ? 'local component' : 'embed'}\t${t.title}`);
}
