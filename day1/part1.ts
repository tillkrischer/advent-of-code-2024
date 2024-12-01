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

a.sort();
b.sort();

let sum = 0;

for (let i = 0; i < a.length; i++) {
  sum += Math.abs(a[i] - b[i]);
}

console.log(sum);
