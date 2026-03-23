import axios from 'axios';

const run = async () => {
  try {
    const listRes = await axios.get('https://wandbox.org/api/list.json');
    const javaCompilers = listRes.data.filter(c => c.language === 'Java');
    const compiler = javaCompilers[0].name;
    console.log("Compiler:", compiler);

    const code1 = `import java.util.*;
class Main {
    public static void main(String[] args) {
        System.out.println("Hello");
    }
}`;

    const code2 = `import java.util.*;
class Main {
    record Address(String x) {}
    public static void main(String[] args) {
        System.out.println(new Address("123"));
    }
}`;

    for (const [name, c] of Object.entries({code1, code2})) {
      console.log(\`Testing \${name}\`);
      const res = await axios.post('https://wandbox.org/api/compile.json', {
        compiler: compiler,
        code: c
      });
      console.log(res.data);
    }
  } catch(e) { console.error(e.response ? e.response.data : e.message); }
}
run();
