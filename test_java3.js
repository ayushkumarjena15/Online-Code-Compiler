import axios from 'axios';

const run = async () => {
  try {
    const listRes = await axios.get('https://wandbox.org/api/list.json');
    const javaCompilers = listRes.data.filter(c => c.language === 'Java' && !c.name.includes('head'));
    const compiler = javaCompilers[0].name;
    console.log("Compiler:", compiler);

    const codes = {
      code1: "import java.util.*;\nclass Main {\n  public static void main(String[] args) {\n    System.out.println(\"Hello 1\");\n  }\n}",
      code2: "import java.util.*;\nclass Main {\n  record Address(String x) {}\n  public static void main(String[] args) {\n    System.out.println(new Address(\"123\"));\n  }\n}"
    };

    for (const name of Object.keys(codes)) {
      console.log("Testing", name);
      const res = await axios.post('https://wandbox.org/api/compile.json', {
        compiler: compiler,
        code: codes[name]
      });
      console.log(res.data);
    }
  } catch(e) { console.error(e.response ? e.response.data : e.message); }
}
run();
