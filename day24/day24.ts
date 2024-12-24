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
const zWires: string[] = [];
const gatesByOut = new Map<string, Gate>();

for (const line of initValuesInput.split("\n")) {
  const [wire, value] = line.split(": ");
  wires.set(wire, Number.parseInt(value));
}

for (const line of gatesInput.split("\n").filter((l) => l.length > 0)) {
  const [inA, operator, inB, _, out] = line.split(/\s+/);
  const gate = { inA, inB, operator, out } as Gate;
  gatesByOut.set(gate.out, gate);
  if (out.startsWith("z")) {
    zWires.push(out);
  }
}
zWires.sort();

let z = getZ();
while (z === undefined) {
  for (const gate of gatesByOut.values()) {
    processGate(gate);
  }

  z = getZ();
}
const part1 = z;
console.log(part1);

/*
 * 5 gates per digit
 * t1 = A ^ B
 * zout = t1 ^ cin
 * t2 = t1 & cin
 * t3 = A & B
 * cout = t2 | t3
 *
 * observation: 3 incorrect zout + 1 incorrect t1
 * look for replacements for these
 */

const swaps: [string, string][] = [];

const zwireSwaps: [string, string][] = [];
for (const zwire of zWires.slice(1, -1)) {
  const g = gatesByOut.get(zwire);
  if (g.operator !== "XOR") {
    const correct = findCorrectZGate(zwire);
    zwireSwaps.push([zwire, correct]);
  }
}

performSwaps(zwireSwaps);
swaps.push(...zwireSwaps);

const inputXorSwaps: [string, string][] = [];
for (const zwire of zWires.slice(2, -1)) {
  const g = gatesByOut.get(zwire);
  const ga = gatesByOut.get(g.inA);
  const inputXor = ga.operator !== "OR" ? g.inA : g.inB;
  const gx = gatesByOut.get(inputXor);
  if (gx.operator !== "XOR") {
    const correct = findCorrectInputXorGate(zwire);
    inputXorSwaps.push([inputXor, correct]);
  }
}
performSwaps(zwireSwaps);
swaps.push(...zwireSwaps);

const part2 = swaps
  .flatMap((e) => e)
  .toSorted()
  .join(",");
console.log(part2);

function findCorrectInputXorGate(zwire: string) {
  const gparentXin = zwire.replace("z", "x");
  const gparentYin = zwire.replace("z", "y");
  for (const g of gatesByOut.values()) {
    const gparents = [g.inA, g.inB];
    if (
      g.operator === "XOR" &&
      gparents.includes(gparentXin) &&
      gparents.includes(gparentYin)
    ) {
      return g.out;
    }
  }
}

function findCorrectZGate(zout: string) {
  const gparentXin = zout.replace("z", "x");
  const gparentYin = zout.replace("z", "y");
  for (const g of gatesByOut.values()) {
    const ga = gatesByOut.get(g.inA);
    const gb = gatesByOut.get(g.inB);
    if (ga && gb) {
      const gparents = [ga.inA, ga.inB, gb.inA, gb.inB];
      if (
        g.operator === "XOR" &&
        gparents.includes(gparentXin) &&
        gparents.includes(gparentYin)
      ) {
        return g.out;
      }
    }
  }
}

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

function performSwaps(swaps: [string, string][]) {
  for (const [a, b] of swaps) {
    const ga = gatesByOut.get(a);
    const gb = gatesByOut.get(b);
    ga.out = b;
    gb.out = a;
    gatesByOut.set(b, ga);
    gatesByOut.set(a, gb);
  }
}
