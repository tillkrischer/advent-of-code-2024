import * as fs from "fs/promises";

// const content = await fs.readFile("day4/test-input.txt", { encoding: "utf8" });
const content = await fs.readFile("day4/input.txt", { encoding: "utf8" });

function check(chars: string[][], x: number, y: number) {
  if (x <= 0 || x >= chars[0].length - 1) {
    return 0;
  }
  if (y <= 0 || y >= chars.length - 1) {
    return 0;
  }
  if (chars[x][y] !== "A") {
    return 0;
  }
  const rightDownDiag =
    (chars[x - 1][y - 1] === "M" && chars[x + 1][y + 1] === "S") ||
    (chars[x - 1][y - 1] === "S" && chars[x + 1][y + 1] === "M");
  const rightUpDiag =
    (chars[x - 1][y + 1] === "M" && chars[x + 1][y - 1] === "S") ||
    (chars[x - 1][y + 1] === "S" && chars[x + 1][y - 1] === "M");
  if (rightDownDiag && rightUpDiag) {
    return 1;
  }
  return 0;
}

let count = 0;
const chars = content
  .split("\n")
  .filter((l) => l.length > 1)
  .map((l) => l.split(""));

for (let y = 0; y < chars.length; y++) {
  for (let x = 0; x < chars[0].length; x++) {
    count += check(chars, x, y);
  }
}

console.log(count);
