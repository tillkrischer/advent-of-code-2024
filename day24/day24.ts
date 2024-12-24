import * as fs from "fs/promises";

type Gate = {
  inA: string;
  inB: string;
  operator: "AND" | "XOR" | "OR";
  out: string;
};

const content = await fs.readFile(Bun.argv[2], { encoding: "utf8" });

const [initValuesInput, gatesInput] = content.split("\n\n");

const wires = new Map<string, number>();
const gates: Gate[] = [];
const zWires: string[] = [];

for (const line of initValuesInput.split("\n")) {
  const split = line.split(": ");
  const wire = split[0];
  const value = Number.parseInt(split[1]);
  wires.set(wire, value);
}

for (const line of gatesInput.split("\n").filter((l) => l.length > 0)) {
  const split = line.split(/\s+/);
  gates.push({
    inA: split[0],
    inB: split[2],
    operator: split[1],
    out: split[4],
  } as Gate);
  if (split[4].startsWith("z")) {
    zWires.push(split[4]);
  }
}
zWires.sort();

let z = getZ();
while (z === undefined) {
  for (const gate of gates) {
    processGate(gate);
  }

  z = getZ();
}
console.log(z);

function processGate(gate: Gate) {
  const a = wires.get(gate.inA);
  const b = wires.get(gate.inB);
  if (a === undefined || b === undefined) {
    return undefined;
  }
  let output = undefined;
  if (gate.operator === "OR") {
    output = a | b;
  } else if (gate.operator === "AND") {
    output = a & b;
  } else if (gate.operator === "XOR") {
    output = a ^ b;
  }
  wires.set(gate.out, output);
}

function getZ() {
  let sum = 0;
  for (let i = 0; i < zWires.length; i++) {
    const value = wires.get(zWires[i]);
    if (value === undefined) {
      return undefined;
    }
    sum += value * Math.pow(2, i);
  }
  return sum;
}
