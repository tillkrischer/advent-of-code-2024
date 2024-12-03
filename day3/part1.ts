import * as fs from "fs/promises";

// const content = await fs.readFile("day3/test-input.txt", { encoding: "utf8" });
const content = await fs.readFile("day3/input.txt", { encoding: "utf8" });

const matches = content.matchAll(/mul\((\d{1,3}),(\d{1,3})\)/g);

let sum = 0;
for (const match of matches) {
  const a = Number.parseInt(match[1]);
  const b = Number.parseInt(match[2]);
  sum += a * b;
}

console.log(sum)
