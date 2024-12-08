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
        count += setAntinode(antinodes, y2 + dy, x2 + dx);
        count += setAntinode(antinodes, y - dy, x - dx);
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

function setAntinode(antinodes: string[][], y: number, x: number): number {
  if (x < 0 || y < 0 || y >= antinodes.length || x >= antinodes[y].length) {
    return 0;
  }
  if (antinodes[y][x] === "#") {
    return 0;
  }
  antinodes[y][x] = "#";
  return 1;
}
