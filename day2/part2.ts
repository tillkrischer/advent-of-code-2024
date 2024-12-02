import * as fs from "fs/promises";
import { plot, Plot } from "nodeplotlib";

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
    if (Math.abs(diff) > 3 || diff === 0) {
      return false;
    }
  }
  return true;
}

//   const diffs: number[] = [];
//   for (let i = 0; i < nums.length - 1; i++) {
//     diffs.push(nums[i + 1] - nums[i]);
//   }
//
//   return (
//     diffs.every((d) => Math.abs(d) <= 3) &&
//     diffs.every((d) => Math.sign(d) === Math.sign(diffs[0]))
//   );
// }

function isSaveExcluding(nums: number[], exclude: number) {
  const modified = [
    ...nums.slice(0, exclude),
    ...nums.slice(exclude + 1, nums.length),
  ];

  return isSafe(modified);
}

function isSafeAny(nums: number[]) {
  if (isSafe(nums)) {
    return true;
  }
  for (let i = 0; i < nums.length; i++) {
    if (isSaveExcluding(nums, i)) {
      // console.log(JSON.stringify(nums));
      // plot([{ y: nums }]);
      // console.log(`safe excluding ${i}`);
      return true;
    }
  }
  return false;
}

// const content = await fs.readFile("day2/test-input.txt", { encoding: "utf8" });
// const content = await fs.readFile("day2/test-input2.txt", { encoding: "utf8" });
const content = await fs.readFile("day2/input.txt", { encoding: "utf8" });
const lines = content.split("\n");

let count = 0;
let lineCount = 0;
for (let line of lines) {
  let split = line.split(/\s+/);
  if (split.length > 1) {
    lineCount += 1;
    const nums = split.map((s) => Number.parseInt(s));
    if (isSafeAny(nums)) {
      count += 1;
    }
  }
}

console.log(count);
