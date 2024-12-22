import * as fs from "fs/promises";

const content = await fs.readFile(Bun.argv[2], { encoding: "utf8" });

const positions = content
  .split("\n")
  .filter((l) => l.length > 0)
  .map((l) => l.split(",").map((n) => Number.parseInt(n)));

// const R = 7;
// const C = 7;
const R = 71;
const C = 71;

const G = new Array(R).fill(0).map((_) => new Array(C).fill("."));

const parents = new Map<number, number>();
const ranks = new Map<number, number>();

for (let i = 0; i < positions.length; i++) {
  const [x, y] = positions[i];
  G[y][x] = "#";
}

for (let y = 0; y < R; y++) {
  for (let x = 0; x < R; x++) {
    if (G[y][x] === ".") {
      makeSet(y * C + x);
    }
  }
}

for (let y = 0; y < R; y++) {
  for (let x = 0; x < R; x++) {
    if (G[y][x] === ".") {
      for (const nbh of nbhs(y * C + x)) {
        union(y * C + x, nbh);
      }
    }
  }
}

const s = 0;
const e = R * C - 1;

let part2 = "";
for (const pos of positions.toReversed()) {
  const [x, y] = pos;
  G[y][x] = ".";
  makeSet(y * C + x);
  for (const nbh of nbhs(y * C + x)) {
    union(y * C + x, nbh);
  }

  if (find(s) === find(e)) {
    part2 = x + "," + y;
    break;
  }
}
console.log(part2);

function nbhs(u: number) {
  const dirs = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];

  const y = (u / R) | 0;
  const x = u % R;
  const res: number[] = [];
  for (const [dy, dx] of dirs) {
    const [ny, nx] = [y + dy, x + dx];
    if (ny >= 0 && ny < R && nx >= 0 && nx < C && G[ny][nx] !== "#") {
      res.push(ny * C + nx);
    }
  }
  return res;
}

function makeSet(x: number) {
  parents.set(x, x);
  ranks.set(x, 0);
}

function find(x: number) {
  if (parents.get(x) !== x) {
    parents.set(x, find(parents.get(x)));
  }
  return parents.get(x);
}

function union(x: number, y: number) {
  const rootX = find(x);
  const rootY = find(y);
  if (rootX !== rootY) {
    if (ranks.get(rootX) > ranks.get(rootY)) {
      parents.set(rootY, rootX);
    } else if (ranks.get(rootX) < ranks.get(rootY)) {
      parents.set(rootX, rootY);
    } else {
      parents.set(rootY, rootX);
      ranks.set(rootX, ranks.get(rootX) + 1);
    }
  }
}
