import * as fs from "fs/promises";

// const content = await fs.readFile("day5/test-input.txt", { encoding: "utf8" });
const content = await fs.readFile("day5/input.txt", { encoding: "utf8" });

const lines = content.split("\n");

let i = 0;
const rules = new Map<number, Set<number>>();
while (i < lines.length && lines[i] !== "") {
  const [before, after] = lines[i].split("|").map((r) => Number.parseInt(r));
  const current = rules.get(after) ?? new Set<number>();
  rules.set(after, current.add(before));

  i += 1;
}

// console.log(rules);

let sum = 0;
i += 1;
while (i < lines.length && lines[i] !== "") {
  const seq = lines[i].split(",").map((n) => Number.parseInt(n));
  if (checkSeq(seq, rules)) {
    sum += seq[Math.floor(seq.length / 2)];
  }
  i += 1;
}

console.log(sum);

function checkSeq(seq: number[], rules: Map<number, Set<number>>) {
  const seqSet = new Set(seq);

  const visited = new Set<number>();
  for (const elem of seq) {
    const allPreds = rules.get(elem) ?? new Set<number>();
    const reqPreds = intersect(allPreds, seqSet);
    if (!isSubsetOf(reqPreds, visited)) {
      return false;
    }
    visited.add(elem);
  }
  return true;
}

function intersect<T>(a: Set<T>, b: Set<T>) {
  return new Set([...a].filter((i) => b.has(i)));
}

function isSubsetOf<T>(a: Set<T>, b: Set<T>) {
  return [...a].every((i) => b.has(i));
}

