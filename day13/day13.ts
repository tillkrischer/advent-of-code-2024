import * as fs from "fs/promises";

const content = await fs.readFile(Bun.argv[2], { encoding: "utf8" });

let lines = content.split("\n").filter((l) => l.length > 0);

let i = 0;
let part1 = 0;
let part2 = 0;
while (i < lines.length) {
  processEntry();
}

console.log(part1);
console.log(part2);

function processEntry() {
  const buttonRegex = /X\+(\d+), Y\+(\d+)/;
  const priceRegex = /X=(\d+), Y=(\d+)/;
  const [_, ax, ay] = lines[i]
    .match(buttonRegex)
    .map((s) => Number.parseInt(s));
  i += 1;
  const [__, bx, by] = lines[i]
    .match(buttonRegex)
    .map((s) => Number.parseInt(s));
  i += 1;
  const [___, px, py] = lines[i]
    .match(priceRegex)
    .map((s) => Number.parseInt(s))
  i += 1;

  const e = 10_000_000_000_000;
  part1 += tokens(ax, ay, bx, by, px, py)
  part2 += tokens(ax, ay, bx, by, px+e, py+e)
}

function tokens(
  ax: number,
  ay: number,
  bx: number,
  by: number,
  px: number,
  py: number,
) {
  const b = (px * ay - py * ax) / (bx * ay - by * ax);
  const a = (px - bx * b) / ax;
  if (Number.isInteger(a) && Number.isInteger(b)) {
    return  3 * a + b;
  }
  return 0;
}

