import * as fs from "fs/promises";

const content = await fs.readFile(Bun.argv[2], { encoding: "utf8" });

const grid = content
  .split("\n")
  .filter((l) => l.length > 0)
  .map((l) => l.split(""));

const dirs = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
];

const R = grid.length;
const C = grid[0].length;

let start = 0;
let end = 0;
for (let y = 0; y < R; y++) {
  for (let x = 0; x < C; x++) {
    if (grid[y][x] === "S") {
      start = y * C * 4 + x * 4 + 0;
    }
    if (grid[y][x] === "E") {
      end = y * C * 4 + x * 4 + 0;
    }
  }
}

const dists = new Array(R * C * 4).fill(Number.POSITIVE_INFINITY);
dists[start] = 0;
const Q = new Set(dists.keys());

while (Q.size > 0) {
  const u = minDist();
  Q.delete(u);
  for (const [v, duv] of nbhs(u)) {
    const alt = dists[u] + duv;
    if (alt < dists[v]) {
      dists[v] = alt;
    }
  }
}

const shortest = Math.min(dists[end], dists[end + 1], dists[end + 2], dists[end + 3])
console.log(shortest)

function minDist() {
  let min = null;
  let minN = 0;
  for (const n of Q) {
    if (min === null || dists[n] < min) {
      min = dists[n];
      minN = n;
    }
  }
  return minN;
}

function nbhs(n: number): [number, number][] {
  const y = (n / (C * 4)) | 0;
  const x = ((n % (C * 4)) / 4) | 0;
  const d = n % 4;
  if (grid[y][x] === '#') {
    return []
  }

  const res: [number, number][] = [];
  res.push([n - d + ((d + 1) % 4), 1000]);
  res.push([n - d + ((d + 3) % 4), 1000]);
  const [dy, dx] = dirs[d];
  const [ny, nx] = [y + dy, x + dx];
  if (grid[ny][nx] !== "#") {
    res.push([ny * C * 4 + nx * 4 + d, 1]);
  }
  return res;
}
