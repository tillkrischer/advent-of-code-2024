import * as fs from "fs/promises";

const content = await fs.readFile(Bun.argv[2], { encoding: "utf8" });

const nums = content
  .split("\n")
  .filter((l) => l.length > 0)
  .map((n) => Number.parseInt(n));

const totals = new Map<string, number>();
let part1 = 0;
let part2 = 0;
for (let n of nums) {
  let d = [0, 0, 0, 0];
  let p = n % 10;
  let seen = new Set<string>();
  for (let i = 0; i < 2000; i++) {
    if (i >= 4) {
      if (!seen.has(d.join(","))) {
        const newTotal = (totals.get(d.join(",")) || 0) + p;
        part2 = Math.max(part2, newTotal);
        totals.set(d.join(","), newTotal);

        seen.add(d.join(","));
      }
    }

    n = evolve(n);
    d = [d[1], d[2], d[3], (n % 10) - p];
    p = n % 10;
  }
  part1 += n;
}
console.log(part1);
console.log(part2);

function evolve(n: number) {
  n = (((n * 64) ^ n) >>> 0) % 16777216;
  n = ((Math.trunc(n / 32) ^ n) >>> 0) % 16777216;
  n = (((n * 2048) ^ n) >>> 0) % 16777216;
  return n;
}
