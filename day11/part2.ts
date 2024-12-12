import * as fs from "fs/promises";

// const content = await fs.readFile("day11/test-input.txt", { encoding: "utf8" });
const content = await fs.readFile("day11/input.txt", { encoding: "utf8" });

let nums = content
  .split("\n")[0]
  .split(/\s+/)
  .map((n) => Number.parseInt(n));

let SIZE = 1_000_000;

let store = new Array(SIZE).fill(0).map((_) => new Array(75).fill(0));

let sum = 0;
for (const n of nums) {
  sum += count(n, 75);
}
console.log(sum);

function count(n: number, iters: number): number {
  if (n < SIZE && store[n][iters] > 0) {
    return store[n][iters];
  }

  let result = 0;
  if (iters === 0) {
    result = 1;
  } else if (n === 0) {
    result = count(1, iters - 1);
  } else {
    const s = n.toString();
    if (s.length % 2 === 0) {
      result =
        count(Number.parseInt(s.slice(0, s.length / 2)), iters - 1) +
        count(Number.parseInt(s.slice(s.length / 2)), iters - 1);
    } else {
      result = count(n * 2024, iters - 1);
    }
  }

  if (n < SIZE) {
    store[n][iters] = result;
  }
  return result;
}
