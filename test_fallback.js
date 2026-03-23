import axios from 'axios';

const langs = [
  { id: 'scala', c: 'scala-3.3.4', snippet: 'object Main { def main(args: Array[String]): Unit = println("Hello") }' },
  { id: 'ocaml', c: 'ocaml-4.14.2', snippet: 'print_endline "Hello"' },
  { id: 'erlang', c: 'erlang-26.2.5.3', snippet: '-module(prog).\\n-export([main/0]).\\nmain() -> io:format("Hello~n").' },
  { id: 'swift', c: 'swift-5.10.1', snippet: 'print("Hello")' },
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
