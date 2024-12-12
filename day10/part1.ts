import * as fs from "fs/promises";

// const content = await fs.readFile("day10/test-input.txt", { encoding: "utf8" });
const content = await fs.readFile("day10/input.txt", { encoding: "utf8" });

const nums = content
  .split("\n")
  .filter((r) => r.length > 0)
  .map((r) => r.split("").map((n) => Number.parseInt(n)));

const reachableDests: Set<number>[][] = new Array(nums.length)
  .fill(0)
  .map((_) => new Array(nums[0].length).fill(0).map((_) => new Set<number>()));

let sum = 0;
for (let i = 9; i >= 0; i--) {
  for (let y = 0; y < nums.length; y++) {
    for (let x = 0; x < nums[0].length; x++) {
      if (nums[y][x] === i) {
        const reachable = getReachable(y, x, i);
        reachableDests[y][x] = reachable;
        if (i === 0) {
          sum += reachable.size;
        }
      }
    }
  }
}

console.log(sum);

function getReachable(y: number, x: number, value: number): Set<number> {
  const directions = [
    [0, -1],
    [0, 1],
    [-1, 0],
    [1, 0],
  ];

  if (value === 9) {
    return new Set([y*nums[0].length+x]);
  }

  let reachable = new Set<number>();
  for (let [dy, dx] of directions) {
    const ny = y + dy;
    const nx = x + dx;
    if (
      nx >= 0 &&
      nx < nums[0].length &&
      ny >= 0 &&
      ny < nums.length &&
      nums[ny][nx] === value + 1
    ) {
      reachable = reachable.union(reachableDests[ny][nx]);
    }
  }

  return reachable;
}
