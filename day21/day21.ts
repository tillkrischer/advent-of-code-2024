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
};

const positionalCords = {
  "^": [0, 1],
  A: [0, 2],
  "<": [1, 0],
  v: [1, 1],
  ">": [1, 2],
};

const LEVELS = 2;

const content = await fs.readFile(Bun.argv[2], { encoding: "utf8" });

const lines = content.split("\n").filter((l) => l.length > 0);

let part1 = 0;
for (const code of lines) {
  const l = getMinLength(code);
  const num = Number(code.slice(0, 3));
  part1 += l * num;
}
console.log(part1);

function getMinLength(code: string) {
  function getSequence(code: string, pos: string, res: string, depth: number) {
    if (code.length === 0 && depth === 0) {
      min = Math.min(min, res.length);
      return;
    }
    if (code.length === 0) {
      getSequence(res, "A", "", depth - 1);
      // console.log(depth, res)
      return;
    }
    const c = code.charAt(0);
    if (depth === LEVELS) {
      for (const trns of numericTransform(pos, c)) {
        getSequence(code.slice(1), c, res + trns, depth);
      }
    } else {
      for (const trns of positionalTransform(pos, c)) {
        getSequence(code.slice(1), c, res + trns, depth);
      }
    }
  }

  let min = Number.POSITIVE_INFINITY;
  getSequence(code, "A", "", LEVELS);
  return min;
}

function numericTransform(start: string, dest: string): string[] {
  const [sy, sx] = numericCords[start];
  const [dy, dx] = numericCords[dest];

  let vert = "";
  if (dy > sy) {
    vert += "v".repeat(Math.abs(dy - sy));
  } else {
    vert += "^".repeat(Math.abs(dy - sy));
  }
  let horiz = "";
  if (dx > sx) {
    horiz += ">".repeat(Math.abs(dx - sx));
  } else {
    horiz += "<".repeat(Math.abs(dx - sx));
  }

  if (vert.length === 0 || horiz.length === 0) {
    return [vert + horiz + "A"];
  }

  let result = [];
  if (sx !== 0 || dy !== 3) {
    result.push(vert + horiz + "A");
  }
  if (sy !== 3 || dx !== 0) {
    result.push(horiz + vert + "A");
  }
  return result;
}

function positionalTransform(start: string, dest: string): string[] {
  const [sy, sx] = positionalCords[start];
  const [dy, dx] = positionalCords[dest];

  let vert = "";
  if (dy > sy) {
    vert += "v".repeat(Math.abs(dy - sy));
  } else {
    vert += "^".repeat(Math.abs(dy - sy));
  }
  let horiz = "";
  if (dx > sx) {
    horiz += ">".repeat(Math.abs(dx - sx));
  } else {
    horiz += "<".repeat(Math.abs(dx - sx));
  }

  if (vert.length === 0 || horiz.length === 0) {
    return [vert + horiz + "A"];
  }

  let result = [];
  if (sx !== 0 || dy !== 0) {
    result.push(vert + horiz + "A");
  }
  if (sy !== 0 || dx !== 0) {
    result.push(horiz + vert + "A");
  }

  return result;
}
