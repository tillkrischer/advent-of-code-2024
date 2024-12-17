import * as fs from "fs/promises";

const content = await fs.readFile(Bun.argv[2], { encoding: "utf8" });

let [A, B, C, ...ops] = content
  .matchAll(/\d+/g)
  .map((m) => Number.parseInt(m[0]));

const output: number[] = [];
let ip = 0;
while (ip < ops.length) {
  const opcode = ops[ip++];
  // adv
  if (opcode === 0) {
    const operand = getOperand("combo");
    A = (A / (1 << operand)) | 0;
  }
  // bxl
  if (opcode === 1) {
    const operand = getOperand("literal");
    B = B ^ operand;
  }
  // bst
  if (opcode === 2) {
    const operand = getOperand("combo");
    B = operand % 8;
  }
  // jnz
  if (opcode === 3) {
    const operand = getOperand("literal");
    if (A !== 0) {
      ip = operand;
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
    output.push(operand % 8);
  }
  // bdv
  if (opcode === 6) {
    const operand = getOperand("combo");
    B = (A / (1 << operand)) | 0;
  }
  // cdv
  if (opcode === 7) {
    const operand = getOperand("combo");
    C = (A / (1 << operand)) | 0;
  }
}

const part1 = output.join(",");
console.log(part1);

function getOperand(type: "literal" | "combo") {
  if (ip >= ops.length) {
    throw new Error();
  }
  const value = ops[ip++];
  if (type === "literal") {
    return value;
  }
  if (value >= 0 && value <= 3) {
    return value;
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
