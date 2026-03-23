import axios from 'axios';

const langs = [
  { id: 'python_head', c: 'cpython-head', snippet: 'print("Hello")' },
  { id: 'python_314', c: 'cpython-3.14.0', snippet: 'print("Hello")' },
  { id: 'python_27', c: 'cpython-2.7-head', snippet: 'print("Hello")' },
  { id: 'python_313', c: 'cpython-3.13.2', snippet: 'print("Hello")' },
  { id: 'scala', c: 'scala-3.5.1', snippet: 'object Main { def main(args: Array[String]): Unit = println("Hello") }' },
  { id: 'nim', c: 'nim-2.2.8', snippet: 'echo "Hello"' },
  { id: 'ocaml', c: 'ocaml-5.2.0', snippet: 'print_endline "Hello"' },
  { id: 'crystal', c: 'crystal-1.13.3', snippet: 'puts "Hello"' },
  { id: 'erlang', c: 'erlang-27.1', snippet: '-module(prog).\\n-export([main/0]).\\nmain() -> io:format("Hello~n").' },
  { id: 'swift', c: 'swift-6.0.1', snippet: 'print("Hello")' },
  { id: 'cpp', c: 'gcc-13.2.0', snippet: '#include <iostream>\\n\\nusing namespace std;\\n\\nint main() {\\n    cout << "Hello" << endl;\\n    return 0;\\n}' }
];

async function run() {
  for(const l of langs) {
    try {
      const res = await axios.post('https://wandbox.org/api/compile.json', {compiler: l.c, code: l.snippet});
      console.log(l.id, '->', res.data.status === '0' ? 'PASS' : 'FAIL', res.data.compiler_error || res.data.program_error ? res.data.compiler_error || res.data.program_error : '');
    } catch(e) { console.log(l.id, '-> ERR', e.message); }
  }
}
run();
