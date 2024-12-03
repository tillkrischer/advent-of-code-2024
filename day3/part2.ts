import * as fs from "fs/promises";

// const content = await fs.readFile("day3/test-input2.txt", { encoding: "utf8" });
const content = await fs.readFile("day3/input.txt", { encoding: "utf8" });

const matches = content.matchAll(
  /(mul\((\d{1,3}),(\d{1,3})\)|don\'t\(\)|do\(\))/g,
);

let enabled = true;
let sum = 0;
for (const match of matches) {
  if (match[0] === "do()") {
    enabled = true;
  } else if (match[1] === "don't()") {
    enabled = false;
  } else if (enabled) {
    const a = Number.parseInt(match[2]);
    const b = Number.parseInt(match[3]);
    sum += a * b;
  }
}

console.log(sum);
