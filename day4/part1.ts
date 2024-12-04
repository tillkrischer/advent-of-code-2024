import * as fs from "fs/promises";

// const content = await fs.readFile("day4/test-input.txt", { encoding: "utf8" });
const content = await fs.readFile("day4/input.txt", { encoding: "utf8" });

function checkDirection(
  chars: string[][],
  x: number,
  y: number,
  dx: number,
  dy: number,
  search: string,
) {
  if (search.length === 0) {
    return 1;
  }
  if (x < 0 || x >= chars[0].length) {
    return 0;
  }
  if (y < 0 || y >= chars.length) {
    return 0;
  }
  const c = chars[y][x];
  if (c != search.charAt(0)) {
    return 0;
  }
  return checkDirection(chars, x + dx, y + dy, dx, dy, search.substring(1));
}

function check(chars: string[][], x: number, y: number) {
  let result = 0;
  result += checkDirection(chars, x, y, -1, -1, "XMAS");
  result += checkDirection(chars, x, y, -1, 0, "XMAS");
  result += checkDirection(chars, x, y, -1, 1, "XMAS");
  result += checkDirection(chars, x, y, 0, -1, "XMAS");
  result += checkDirection(chars, x, y, 0, 1, "XMAS");
  result += checkDirection(chars, x, y, 1, -1, "XMAS");
  result += checkDirection(chars, x, y, 1, 0, "XMAS");
  result += checkDirection(chars, x, y, 1, 1, "XMAS");
  return result;
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
