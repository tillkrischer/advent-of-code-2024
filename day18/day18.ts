import * as fs from "fs/promises";
import { heappop, heappush } from "../utils/heap";

const content = await fs.readFile(Bun.argv[2], { encoding: "utf8" });

const positions = content
  .split("\n")
  .filter((l) => l.length > 0)
  .map((l) => l.split(",").map((n) => Number.parseInt(n)));

// const R = 7;
// const C = 7;
// const FLN = 12;
const R = 71;
const C = 71;
const FLN = 1024;

const G = new Array(R).fill(0).map((_) => new Array(C).fill("."));

let path = getPathToEnd();
for (let i = 0; i < positions.length; i++) {
  const [x, y] = positions[i];
  G[y][x] = "#";

  if (path.has(y * C + x)) {
    path = getPathToEnd();
    if (path === null) {
      const part2 = x + "," + y;
      console.log(part2);
      break;
    }
  }

  if (i === FLN) {
    const part1 = path.size - 1;
    console.log(part1);
  }
}

function getPathToEnd(): Set<number> | null {
  const dists = new Array<number>(R * C).fill(Number.POSITIVE_INFINITY);
  const prev = new Array<number>(R * C).fill(0);
  dists[0] = 0;
  const Q: [number, number][] = [];
  heappush(Q, [0, 0]);
  while (Q.length > 0) {
    const [_, u] = heappop(Q);
    for (const v of nbhs(u)) {
      const alt = dists[u] + 1;
      if (alt < dists[v]) {
        dists[v] = alt;
        prev[v] = u;
        heappush(Q, [alt, v])
      }
    }
  }

  if (dists[R * C - 1] === Number.POSITIVE_INFINITY) {
    return null;
  }

  const path = new Set<number>();
  let u = R * C - 1;
  path.add(u);
  while (u !== 0) {
    u = prev[u];
    path.add(u);
  }
  return path;
}

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
    if (ny >= 0 && ny < R && nx >= 0 && nx < C && G[y][x] === ".") {
      res.push(ny * C + nx);
    }
  }
  return res;
}
