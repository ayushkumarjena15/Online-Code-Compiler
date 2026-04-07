import os

filepath = r"src/problemData.js"
with open(filepath, "r", encoding="utf-8") as f:
    data = f.read()

idx = data.find("export const SQL_PROBLEMS")
header = data[:idx]

def gen(lang, prefix, tpl, start_id):
    res = f"export const {lang}_PROBLEMS = [\n"
    ctr = 0
    for star in range(1, 6):
        for q in range(1, 4):
            num = (star-1)*3 + q
            star_str = "1 Star" if star == 1 else f"{star} Stars"
            res += f"""  {{
    id: {start_id + ctr},
    title: '{prefix} Problem {num}',
    difficulty: '{star_str}',
    topic: 'Core {prefix}',
    url: '#',
    description: `This is problem {num} for {prefix}\\n\\nDifficulty Level: {star_str}.\\n\\nPlease write your solution below to solve the given task.`,
    examples: [
      {{ input: 'None', output: 'None', explanation: 'Generic explanation' }}
    ],
    constraints: 'Standard constraints apply.',
    templateCode: `{tpl}`
  }},
"""
            ctr += 1
    res += "];\n\n"
    return res

tpl_sql = "-- Write your MySQL query statement\\nSELECT * FROM dual;"
tpl_py = "class Solution:\\n    def solve(self):\\n        # Your code here\\n        pass"
tpl_java = "public class Solution {\\n    public static void main(String[] args) {\\n        // Your code here\\n    }\\n}"
tpl_js = "function solve() {\\n    // Your code here\\n}\\n"

new_data = header + gen('SQL', 'SQL', tpl_sql, 2000) + gen('PYTHON', 'Python', tpl_py, 3000) + gen('JAVA', 'Java', tpl_java, 4000) + gen('JS', 'JavaScript', tpl_js, 5000)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(new_data)

print(f"Successfully generated arrays into {filepath}")
