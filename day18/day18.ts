import * as fs from "fs/promises";

const content = await fs.readFile(Bun.argv[2], { encoding: "utf8" });

const positions = content
  .split("\n")
  .filter((l) => l.length > 0)
  .map((l) => l.split(",").map((n) => Number.parseInt(n)));

// const R = 7;
// const C = 7;
// const STPS = 12;
const R = 71;
const C = 71;
const FLN = 1024;

const G = gridAfter(FLN);
// print(G);

const dists = new Array(R)
  .fill(0)
  .map((_) => new Array(C).fill(Number.POSITIVE_INFINITY));
const seen = new Array(R).fill(0).map((_) => new Array(C).fill(false));
dists[0][0] = 0;

const Q = [[0, 0]];
while (Q.length > 0) {
  const [uy, ux] = removeMin();
  seen[uy][ux] = true;
  for (const [ny, nx] of nbhs(uy, ux)) {
    if (!seen[ny][nx]) {
      Q.push([ny, nx]);
    }
    const alt = dists[uy][ux] + 1;
    if (alt < dists[ny][nx]) {
      dists[ny][nx] = alt;
    }
  }
}

const part1 = dists[R-1][C-1];
console.log(part1)

function removeMin() {
  let min: number | null = null;
  let minCords = [0, 0];
  for (let y = 0; y < R; y++) {
    for (let x = 0; x < R; x++) {
      if (!seen[y][x] && (min === null || dists[y][x] < min)) {
        min = dists[y][x];
        minCords = [y, x];
      }
    }
  }
  const removeIndex = Q.findIndex(
    (e) => e[0] === minCords[0] && e[1] === minCords[1],
  );
  Q.splice(removeIndex, 1);
  return minCords;
}

function nbhs(y: number, x: number) {
  const res: [number, number][] = [];
  if (y > 0 && G[y - 1][x] === ".") {
    res.push([y - 1, x]);
  }
  if (x > 0 && G[y][x - 1] === ".") {
    res.push([y, x - 1]);
  }
  if (y < R - 1 && G[y + 1][x] === ".") {
    res.push([y + 1, x]);
  }
  if (x < C - 1 && G[y][x + 1] === ".") {
    res.push([y, x + 1]);
  }
  return res;
}

function gridAfter(steps: number) {
  const G = new Array(R).fill(0).map((_) => new Array(C).fill("."));

  for (let i = 0; i < steps; i++) {
    const [x, y] = positions[i];
    G[y][x] = "#";
  }

  return G;
}

function print(G: string[][]) {
  for (const r of G) {
    console.log(r.join(""));
  }
}
