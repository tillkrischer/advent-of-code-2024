import * as fs from "fs/promises";

// const content = await fs.readFile("day11/test-input.txt", { encoding: "utf8" });
const content = await fs.readFile("day11/input.txt", { encoding: "utf8" });

let nums = content
  .split("\n")[0]
  .split(/\s+/)
  .map((n) => Number.parseInt(n));

for (let i = 0; i < 25; i++) {
  nums = blink(nums);
}

console.log(nums.length);

function blink(nums: number[]): number[] {
  const result = [];
  for (let n of nums) {
    result.push(...processNumber(n));
  }
  return result;
}

function processNumber(n: number): number[] {
  if (n === 0) {
    return [1];
  }
  const s = n.toString();
  if (s.length % 2 === 0) {
    return [
      Number.parseInt(s.slice(0, s.length / 2)),
      Number.parseInt(s.slice(s.length / 2)),
    ];
  }
  return [n * 2024];
}
