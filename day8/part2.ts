import * as fs from "fs/promises";

// const content = await fs.readFile("day8/test-input.txt", { encoding: "utf8" });
const content = await fs.readFile("day8/input.txt", { encoding: "utf8" });

const chars = content
  .split("\n")
  .filter((l) => l.length > 0)
  .map((l) => l.split(""));

const antennas = new Map<string, [number, number][]>();
const antinodes: string[][] = new Array(chars.length)
  .fill(0)
  .map(() => new Array(chars[0].length).fill("."));

let count = 0;
for (let y = 0; y < chars.length; y++) {
  for (let x = 0; x < chars[y].length; x++) {
    const c = chars[y][x];
    if (c !== ".") {
      const current = antennas.get(c) ?? [];
      for (const [y2, x2] of current) {
        const dy = y2 - y;
        const dx = x2 - x;
        count += setAntinodes(antinodes, y, x, dy, dx);
        count += setAntinodes(antinodes, y, x, -1 * dy, -1 * dx);
      }

      antennas.set(c, [...current, [y, x]]);
    }
  }
}

// console.log(antennas);
// console.log();
//
// for (const line of antinodes) {
//   console.log(line.join(""));
// }
console.log(count);

function setAntinodes(
  antinodes: string[][],
  y: number,
  x: number,
  dy: number,
  dx: number,
): number {
  let count = 0;
  while (x >= 0 && y >= 0 && y < antinodes.length && x < antinodes[y].length) {
    if (antinodes[y][x] !== "#") {
      count += 1;
    }
    antinodes[y][x] = "#";
    x += dx;
    y += dy;
  }
  return count;
}
