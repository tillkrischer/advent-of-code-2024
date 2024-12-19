import * as fs from "fs/promises";

const content = await fs.readFile(Bun.argv[2], { encoding: "utf8" });

const [towelinput, patterninput] = content.split("\n\n");

const towels = towelinput.split(", ");
const patterns = patterninput.split("\n").filter((l) => l.length > 0);

const DP = new Map<string, boolean>();

let part1 = 0;
for (const pattern of patterns) {
  if (isPossible(pattern)) {
    part1 += 1;
  }
}
console.log(part1);

function isPossible(pattern: string): boolean {
  if (DP.has(pattern)) {
    return DP.get(pattern);
  }
  let result = false;
  if (pattern.length === 0) {
    result = true;
  } else {
    for (const towel of towels) {
      if (pattern.startsWith(towel)) {
        result ||= isPossible(pattern.slice(towel.length));
      }
    }
  }
  DP.set(pattern, result);
  return result;
}
