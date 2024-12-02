import * as fs from "fs/promises";

function isSafe(nums: number[]) {
  let sign = 0;
  for (let i = 0; i < nums.length - 1; i++) {
    const diff = nums[i + 1] - nums[i];
    if (i === 0) {
      sign = Math.sign(diff);
    }

    if (i !== 0 && Math.sign(diff) !== sign) {
      return false;
    }
    if (Math.abs(diff) > 3) {
      return false;
    }
  }
  return true;
}

// const content = await fs.readFile("day2/test-input.txt", { encoding: "utf8" });
const content = await fs.readFile("day2/input.txt", { encoding: "utf8" });
const lines = content.split("\n");

let count = 0;
for (let line of lines) {
  let split = line.split(/\s+/);
  if (split.length > 1) {
    const nums = split.map((s) => Number.parseInt(s));
    if (isSafe(nums)) {
      count += 1;
    }
  }
}

console.log(count);
