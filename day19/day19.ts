import * as fs from "fs/promises";

const content = await fs.readFile(Bun.argv[2], { encoding: "utf8" });

const [towelinput, patterninput] = content.split("\n\n");

const towels = towelinput.split(", ");
const patterns = patterninput.split("\n").filter((l) => l.length > 0);

const DP = new Map<string, number>();

let part1 = 0;
let part2 = 0;
for (const pattern of patterns) {
  const combs = combinations(pattern);
  part1 += Math.sign(combs);
  part2 += combs;
}
console.log(part1);
console.log(part2);

function combinations(pattern: string): number {
  if (DP.has(pattern)) {
    return DP.get(pattern);
  }
  let result = 0;
  if (pattern.length === 0) {
    result = 1;
  } else {
    for (const towel of towels) {
      if (pattern.startsWith(towel)) {
        result += combinations(pattern.slice(towel.length));
      }
    }
  }
  DP.set(pattern, result);
  return result;
}
