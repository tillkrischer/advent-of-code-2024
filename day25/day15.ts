import * as fs from "fs/promises";

const R = 7;
const C = 5;

const content = await fs.readFile(Bun.argv[2], { encoding: "utf8" });

const blocks = content.split("\n\n");

const keys: number[][] = [];
const locks: number[][] = [];

for (const block of blocks) {
  const G = block
    .split("\n")
    .filter((r) => r.length > 0)
    .map((r) => r.split(""));
  if (block.charAt(0) === ".") {
    parseKey(G);
  } else {
    parseLock(G);
  }
}


let part1 = 0;
for (let i = 0; i < keys.length; i++) {
  for (let j = 0; j < locks.length; j++) {
    const key = keys[i];
    const lock = locks[j];
    if (fit(key, lock)) {
      part1 += 1;
    }
  }
}
console.log(part1);

function fit(key: number[], lock: number[]) {
  for (let i = 0; i < C; i++) {
    if (key[i] + lock[i] > R) {
      return false;
    }
  }
  return true;
}

function parseKey(G: string[][]) {
  const heights = [];
  for (let x = 0; x < C; x++) {
    let h = 0;
    while (G[R - h - 1][x] === "#") {
      h += 1;
    }
    heights.push(h);
  }
  keys.push(heights);
}

function parseLock(G: string[][]) {
  const heights = [];
  for (let x = 0; x < C; x++) {
    let h = 0;
    while (G[h][x] === "#") {
      h += 1;
    }
    heights.push(h);
  }
  locks.push(heights);
}
