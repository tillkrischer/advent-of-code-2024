import * as fs from "fs/promises";

const dirs = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
];

const content = await fs.readFile(Bun.argv[2], { encoding: "utf8" });

const G = content
  .split("\n")
  .filter((l) => l.length > 0)
  .map((l) => l.split(""));

const R = G.length;
const C = G[0].length;
const TIME_SAVE = 100;

let [sy, sx] = [0, 0];
let [ey, ex] = [0, 0];
for (let y = 0; y < R; y++) {
  for (let x = 0; x < R; x++) {
    if (G[y][x] === "S") {
      [sy, sx] = [y, x];
      G[y][x] = ".";
    }
    if (G[y][x] === "E") {
      [ey, ex] = [y, x];
      G[y][x] = ".";
    }
  }
}

const inf = Number.POSITIVE_INFINITY;
let i = 0;
const Q = [[sy, sx]];
const dists = new Array(R).fill(0).map((_) => new Array(C).fill(inf));
while (Q.length > 0) {
  const [ey, ex] = Q.shift();
  dists[ey][ex] = i;
  i += 1;
  for (const [ny, nx] of nbhs(ey, ex)) {
    if (dists[ny][nx] === inf) {
      Q.push([ny, nx]);
    }
  }
}

let part1 = 0;
let part2 = 0;
for (let y = 0; y < R; y++) {
  for (let x = 0; x < R; x++) {
    if (G[y][x] === ".") {
      part1 += trySkips(y, x, 2);
      part2 += trySkips(y, x, 20);
    }
  }
}
console.log(part1);
console.log(part2);

function trySkips(y: number, x: number, maxD: number) {
  let res = 0;
  for (let dy = -1 * maxD; dy <= maxD; dy++) {
    const maxDx = maxD - Math.abs(dy);
    for (let dx = -1 * maxDx; dx <= maxDx; dx++) {
      const [ny, nx] = [y + dy, x + dx];
      const d = Math.abs(dy) + Math.abs(dx);
      if (ny >= 0 && ny < R && nx >= 0 && nx < C && G[ny][nx] === ".") {
        if (dists[ny][nx] - dists[y][x] - d >= TIME_SAVE) {
          res += 1;
        }
      }
    }
  }
  return res;
}

function nbhs(y: number, x: number) {
  const res: [number, number][] = [];
  for (const [dy, dx] of dirs) {
    const [ny, nx] = [y + dy, x + dx];
    if (ny >= 0 && ny < R && nx >= 0 && nx < C && G[ny][nx] === ".") {
      res.push([ny, nx]);
    }
  }
  return res;
}
