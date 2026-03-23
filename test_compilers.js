import axios from 'axios';

const ALL_LANGUAGES = [
  { id: 'javascript', wandbox: 'JavaScript', snippet: `console.log("Hello, Web-Based Code Compiler!");` },
  { id: 'python', wandbox: 'Python', snippet: `print("Hello, Web-Based Code Compiler!")` },
  { id: 'java', wandbox: 'Java', snippet: `class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, Web-Based Code Compiler!");\n    }\n}\n` },
  { id: 'cpp', wandbox: 'C++', snippet: `#include <iostream>\n\nusing namespace std;\n\nint main() {\n    cout << "Hello, Web-Based Code Compiler!" << endl;\n    return 0;\n}\n` },
  { id: 'c', wandbox: 'C', snippet: `#include <stdio.h>\n\nint main() {\n    printf("Hello, Web-Based Code Compiler!\\n");\n    return 0;\n}\n` },
  { id: 'csharp', wandbox: 'C#', snippet: `using System;\n\nclass MainClass {\n    public static void Main (string[] args) {\n        Console.WriteLine ("Hello, Web-Based Code Compiler!");\n    }\n}\n` },
  { id: 'go', wandbox: 'Go', snippet: `package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, Web-Based Code Compiler!")\n}\n` },
  { id: 'rust', wandbox: 'Rust', snippet: `fn main() {\n    println!("Hello, Web-Based Code Compiler!");\n}\n` },
  { id: 'ruby', wandbox: 'Ruby', snippet: `puts "Hello, Web-Based Code Compiler!"` },
  { id: 'typescript', wandbox: 'TypeScript', snippet: `const message: string = "Hello, Web-Based Code Compiler!";\nconsole.log(message);\n` },
  { id: 'php', wandbox: 'PHP', snippet: `<?php\n    echo "Hello, Web-Based Code Compiler!";\n?>\n` },
  { id: 'swift', wandbox: 'Swift', snippet: `print("Hello, Web-Based Code Compiler!")\n` },
  { id: 'scala', wandbox: 'Scala', snippet: `object Main {\n  def main(args: Array[String]): Unit = {\n    println("Hello, Web-Based Code Compiler!")\n  }\n}\n` },
  { id: 'nim', wandbox: 'Nim', snippet: `echo "Hello, Web-Based Code Compiler!"\n` },
  { id: 'r', wandbox: 'R', snippet: `print("Hello, Web-Based Code Compiler!")\n` },
  { id: 'julia', wandbox: 'Julia', snippet: `println("Hello, Web-Based Code Compiler!")\n` },
  { id: 'bash', wandbox: 'Bash script', snippet: `echo "Hello, Web-Based Code Compiler!"\n` },
  { id: 'sql', wandbox: 'SQL', snippet: `CREATE TABLE test (id INTEGER, name TEXT);\nINSERT INTO test VALUES (1, 'Hello, Web-Based Code Compiler!');\nSELECT * FROM test;\n` },
  { id: 'lua', wandbox: 'Lua', snippet: `print("Hello, Web-Based Code Compiler!")\n` },
  { id: 'perl', wandbox: 'Perl', snippet: `print "Hello, Web-Based Code Compiler!\\n";\n` },
  { id: 'haskell', wandbox: 'Haskell', snippet: `main :: IO ()\nmain = putStrLn "Hello, Web-Based Code Compiler!"\n` },
  { id: 'elixir', wandbox: 'Elixir', snippet: `IO.puts "Hello, Web-Based Code Compiler!"\n` },
  { id: 'erlang', wandbox: 'Erlang', snippet: `-module(prog).\n-export([main/0]).\nmain() ->\n    io:format("Hello, Web-Based Code Compiler!~n").\n` },
  { id: 'd', wandbox: 'D', snippet: `import std.stdio;\n\nvoid main()\n{\n    writeln("Hello, Web-Based Code Compiler!");\n}\n` },
  { id: 'groovy', wandbox: 'Groovy', snippet: `println "Hello, Web-Based Code Compiler!"\n` },
  { id: 'ocaml', wandbox: 'OCaml', snippet: `print_endline "Hello, Web-Based Code Compiler!"\n` },
  { id: 'zig', wandbox: 'Zig', snippet: `const std = @import("std");\n\npub fn main() !void {\n    const stdout = std.io.getStdOut().writer();\n    try stdout.print("Hello, Web-Based Code Compiler!\\\\n", .{});\n}\n` },
  { id: 'crystal', wandbox: 'Crystal', snippet: `puts "Hello, Web-Based Code Compiler!"\n` },
  { id: 'pascal', wandbox: 'Pascal', snippet: `program Hello;\nbegin\n  writeln ('Hello, Web-Based Code Compiler!');\nend.\n` },
  { id: 'lisp', wandbox: 'Lisp', snippet: `(print "Hello, Web-Based Code Compiler!")\n` }
];

async function runTests() {
  try {
    const listRes = await axios.get('https://wandbox.org/api/list.json');
    const mapping = {};
    listRes.data.forEach(c => {
      if (!mapping[c.language]) mapping[c.language] = [];
      mapping[c.language].push(c.name);
    });

    const results = [];
    for (const lang of ALL_LANGUAGES) {
      const compilerId = mapping[lang.wandbox]?.[0];
      if (!compilerId) {
        console.error(`Compiler ID not found for ${lang.id}`);
        continue;
      }
      try {
        const res = await axios.post('https://wandbox.org/api/compile.json', {
          compiler: compilerId,
          code: lang.snippet,
          save: false
        });
        if (res.data.status !== '0' || res.data.compiler_error || res.data.program_error) {
          console.error(`FAIL [${lang.id}]:`, res.data.compiler_error || res.data.program_error);
          results.push({ lang: lang.id, pass: false, error: res.data.compiler_error || res.data.program_error });
        } else {
          console.log(`PASS [${lang.id}]`);
          results.push({ lang: lang.id, pass: true });
        }
      } catch (err) {
        console.error(`ERROR [${lang.id}]:`, err.message);
        results.push({ lang: lang.id, pass: false, error: err.message });
      }
    }
  } catch (err) {
    console.error("Failed to list APIs", err.message);
  }
}

runTests();
