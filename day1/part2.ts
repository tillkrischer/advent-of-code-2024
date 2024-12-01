import * as fs from "fs/promises";

// const content = await fs.readFile("day1/test-input.txt", { encoding: "utf8" });
const content = await fs.readFile("day1/input.txt", { encoding: "utf8" });
const lines = content.split("\n");

let a: number[] = [];
let b: number[] = [];

for (let line of lines) {
  let split = line.split(/\s+/);
  if (split.length === 2) {
    a.push(Number.parseInt(split[0]));
    b.push(Number.parseInt(split[1]));
  }
}

const boccs = new Map<number, number>();
for (let n of b) {
  const curr = boccs.get(n) ?? 0;
  boccs.set(n, curr + 1)
}

let sum = 0;
for (let n of a) {
  const occs = boccs.get(n) ?? 0;
  sum += n * occs;
}

console.log(sum)
