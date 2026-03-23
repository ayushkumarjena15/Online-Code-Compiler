import axios from 'axios';

const testJava = async () => {
  try {
    const code = `import java.util.*;

class Main {
    public static void main(String[] args) {
        System.out.println("Hello Java!");
    }
}`;

    const res = await axios.post('https://wandbox.org/api/compile.json', {
      compiler: 'openjdk-head',
      code: code
    });
    
    console.log(res.data);
  } catch(e) { console.error(e.response ? e.response.data : e.message); }
};
testJava();
