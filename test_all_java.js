import fs from 'fs';
import axios from 'axios';

const fileStr = fs.readFileSync('src/Explore.jsx', 'utf-8');
const snippets = fileStr.split("language: 'java',").slice(1).map(s => {
  return s.split('code: `')[1].split('`')[0];
});

const run = async () => {
    const listRes = await axios.get('https://wandbox.org/api/list.json');
    const javaCompilers = listRes.data.filter(c => c.language === 'Java' && !c.name.includes('head'));
    const compiler = javaCompilers[0].name;
    
    for (let i = 0; i < snippets.length; i++) {
        console.log(\`Running snippet \${i+1}...\`);
        const res = await axios.post('https://wandbox.org/api/compile.json', {
          compiler: compiler,
          code: snippets[i]
        });
        if (res.data.status !== '0') {
           console.log(\`FAILED Snippet \${i+1}: \${res.data.program_error || res.data.compiler_error}\`);
        } else {
           console.log(\`SUCCESS Snippet \${i+1}\`);
        }
    }
};
run();
