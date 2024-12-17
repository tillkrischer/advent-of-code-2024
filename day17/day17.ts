import * as fs from "fs/promises";

const content = await fs.readFile(Bun.argv[2], { encoding: "utf8" });

let [origA, _, __, ...ops] = content
  .matchAll(/\d+/g)
  .map((m) => Number.parseInt(m[0]));

const part1 = getOutput(BigInt(origA));
console.log(part1);

const opstring = ops.join(",");
let A = 0n;
let i = 0n;
let o = getOutput(8n * A + i);
while (o !== opstring) {
  i = 0n;
  o = getOutput(8n * A + i);
  while (!opstring.endsWith(o)) {
    i += 1n;
    o = getOutput(8n * A + i);
  }
  A = 8n * A + i;
}

const part2 = Number(A);
console.log(part2);


function getOutput(initA: bigint): string {
  let A = BigInt(initA);
  let B = 0n;
  let C = 0n;
  const output: bigint[] = [];
  let ip = 0;

  function getOperand(type: "literal" | "combo"): bigint {
    if (ip >= ops.length) {
      throw new Error();
    }
    const value = ops[ip++];
    if (type === "literal") {
      return BigInt(value);
    }
    if (value >= 0 && value <= 3) {
      return BigInt(value);
    }
    if (value === 4) {
      return A;
    }
    if (value === 5) {
      return B;
    }
    if (value === 6) {
      return C;
    }
    throw new Error();
  }

  while (ip < ops.length) {
    const opcode = ops[ip++];
    // adv
    if (opcode === 0) {
      const operand = getOperand("combo");
      A = A >> operand;
      // A = Math.trunc(A * Math.pow(2, -1 * operand));
    }
    // bxl
    if (opcode === 1) {
      const operand = getOperand("literal");
      B = B ^ operand;
    }
    // bst
    if (opcode === 2) {
      const operand = getOperand("combo");
      B = operand % 8n;
    }
    // jnz
    if (opcode === 3) {
      const operand = getOperand("literal");
      if (A !== 0n) {
        ip = Number(operand);
      }
    }
    // bxc
    if (opcode === 4) {
      getOperand("literal");
      B = B ^ C;
    }
    // out
    if (opcode === 5) {
      const operand = getOperand("combo");
      output.push(operand % 8n);
    }
    // bdv
    if (opcode === 6) {
      const operand = getOperand("combo");
      B = A >> operand;
    }
    // cdv
    if (opcode === 7) {
      const operand = getOperand("combo");
      C = A >> operand;
    }
  }
  return output.map((b) => Number(b)).join(",");
}
