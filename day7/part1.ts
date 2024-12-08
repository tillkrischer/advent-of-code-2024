import * as fs from "fs/promises";

// const content = await fs.readFile("day7/test-input.txt", { encoding: "utf8" });
const content = await fs.readFile("day7/input.txt", { encoding: "utf8" });

const lines = content.split("\n").filter((l) => l.length > 0);

let sum = 0;
for (const line of lines) {
  const [result, ...operands] = line
    .split(/:?\s+/)
    .map((d) => Number.parseInt(d));

  if (test(result, operands)) {
    sum += result;
  }
}
console.log(sum);

function test(result: number, operands: number[]): boolean {
  if (operands.length === 1) {
    return result === operands[0];
  }

  const addOps = [operands[0] + operands[1], ...operands.slice(2)];
  const mulOps = [operands[0] * operands[1], ...operands.slice(2)];

  return test(result, addOps) || test(result, mulOps);
}
