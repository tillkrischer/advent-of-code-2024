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
for (let y = 0; y < R; y++) {
  for (let x = 0; x < R; x++) {
    if (G[y][x] === ".") {
      part1 += trySkips(y, x);
    }
  }
}
console.log(part1);

function trySkips(y: number, x: number) {
  let res = 0;
  for (const [dy, dx] of dirs) {
    const [ny, nx] = [y + 2 * dy, x + 2 * dx];
    if (ny >= 0 && ny < R && nx >= 0 && nx < C && G[ny][nx] === ".") {
      if (dists[ny][nx] - dists[y][x] - 2 >= TIME_SAVE) {
        res += 1;
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

// let s = 0;
// let e = 0;
// for (let y = 0; y < R; y++) {
//   for (let x = 0; x < R; x++) {
//     if (G[y][x] === "S") {
//       s = R * C + y * R + x;
//       G[y][x] = ".";
//     }
//     if (G[y][x] === "E") {
//       e = y * R + x;
//       G[y][x] = ".";
//     }
//   }
// }
//
//
//
// const dists = new Array<number>(2 * R * C).fill(Number.POSITIVE_INFINITY);
// dists[s] = 0;
// const Q: [number, number][] = [];
// heappush(Q, [0, s]);
// while (Q.length > 0) {
//   const [_, u] = heappop(Q);
//   for (const [v, d] of nbhs(u)) {
//     const alt = dists[u] + d;
//     if (alt < dists[v]) {
//       dists[v] = alt;
//       heappush(Q, [alt, v]);
//     }
//   }
// }
//
// const part1 = dists[R*C+e] - dists[e];
// console.log(part1);
//
// function nbhs(u: number): [number, number][] {
//   const dirs = [
//     [0, 1],
//     [1, 0],
//     [0, -1],
//     [-1, 0],
//   ];
//   const s = (u / (R * C)) | 0;
//   const y = ((u % (R * C)) / R) | 0;
//   const x = u % R;
//   const res: [number, number][] = [];
//   for (const [dy, dx] of dirs) {
//     const [ny, nx] = [y + dy, x + dx];
//     if (ny >= 0 && ny < R && nx >= 0 && nx < C && G[y][x] !== "#") {
//       res.push([s * R * C + ny * C + nx, 1]);
//     }
//     if (s === 1) {
//       const [ny, nx] = [y + 2 * dy, x + 2 * dx];
//       if (ny >= 0 && ny < R && nx >= 0 && nx < C && G[y][x] !== "#") {
//         res.push([ny * C + nx, 2]);
//       }
//     }
//   }
//   return res;
// }
