import * as fs from "fs/promises";

const numericCords = {
  "0": [3, 1],
  "1": [2, 0],
  "2": [2, 1],
  "3": [2, 2],
  "4": [1, 0],
  "5": [1, 1],
  "6": [1, 2],
  "7": [0, 0],
  "8": [0, 1],
  "9": [0, 2],
  A: [3, 2],
  D: [3, 0],
};

const positionalCords = {
  "^": [0, 1],
  A: [0, 2],
  "<": [1, 0],
  v: [1, 1],
  ">": [1, 2],
  D: [0, 0],
};

const DP: Map<string, number>[] = new Array(27).fill(0).map((_) => new Map());

const content = await fs.readFile(Bun.argv[2], { encoding: "utf8" });

const lines = content.split("\n").filter((l) => l.length > 0);

let part1 = 0;
let part2 = 0;
for (const code of lines) {
  const l1 = minLength(code, 3);
  const l2 = minLength(code, 26);
  const num = Number(code.slice(0, 3));
  part1 += l1 * num;
  part2 += l2 * num;
}
console.log(part1);
console.log(part2);

function minLength(code: string, its: number) {
  if (its === 0) {
    return code.length;
  }
  if (DP[its].has(code)) {
    return DP[its].get(code);
  }
  const splits = code
    .split("A")
    .slice(0, -1)
    .map((s) => s + "A");

  let sum = 0;
  for (const split of splits) {
    let min = Number.POSITIVE_INFINITY;
    for (const seq of sequences(split)) {
      min = Math.min(min, minLength(seq, its - 1));
    }
    sum += min;
  }
  DP[its].set(code, sum);
  return sum;
}

function sequences(initCode: string): string[] {
  const type = /\d/.test(initCode) ? "num" : "pos";

  const S = [[initCode, "A", ""]];
  const results = [];
  while (S.length > 0) {
    const [code, pos, res] = S.pop();
    if (code.length === 0) {
      results.push(res);
      continue;
    }
    const c = code.charAt(0);
    for (const trns of transform(pos, c, type)) {
      S.push([code.slice(1), c, res + trns]);
    }
  }
  return results;
}

function transform(start: string, end: string, type: "num" | "pos"): string[] {
  const cords = type === "num" ? numericCords : positionalCords;
  const [sy, sx] = cords[start];
  const [ey, ex] = cords[end];
  const [dy, dx] = cords["D"];

  let vert = "";
  if (ey > sy) {
    vert += "v".repeat(Math.abs(ey - sy));
  } else {
    vert += "^".repeat(Math.abs(ey - sy));
  }
  let horiz = "";
  if (ex > sx) {
    horiz += ">".repeat(Math.abs(ex - sx));
  } else {
    horiz += "<".repeat(Math.abs(ex - sx));
  }

  if (vert.length === 0 || horiz.length === 0) {
    return [vert + horiz + "A"];
  }

  let result = [];
  if (sx !== dx || ey !== dy) {
    result.push(vert + horiz + "A");
  }
  if (sy !== dy || ex !== dx) {
    result.push(horiz + vert + "A");
  }
  return result;
}

