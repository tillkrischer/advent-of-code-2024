import * as fs from "fs/promises";

const content = await fs.readFile(Bun.argv[2], { encoding: "utf8" });

let lines = content.split("\n").filter((l) => l.length > 0);

const w = 101;
const h = 103;

const robots: [number, number, number, number][] = [];

for (const line of lines) {
  let [_, px, py, vx, vy] = line
    .match(/p=(-?\d+),(-?\d+) v=(-?\d+),(-?\d+)/)
    .map((n) => Number.parseInt(n));
  robots.push([px, py, vx, vy]);
}

const room100 = roomAt(100);
const part1 = safetyFactor(room100);

console.log(part1);

const roomTree = roomAt(8087);
for (const row of roomTree) {
  console.log(row.map((n) => (n > 0 ? "X" : " ")).join(""));
}

function roomAt(time: number) {
  const room = new Array(103).fill(0).map((_) => new Array(101).fill(0));
  for (const [px, py, vx, vy] of robots) {
    const x = (px + time * vx) % w;
    const y = (py + time * vy) % h;
    room[(y + h) % h][(x + w) % w] += 1;
  }
  return room;
}

function safetyFactor(room: number[][]) {
  const quadrants = [0, 0, 0, 0];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (y < Math.floor(h / 2) && x < Math.floor(w / 2)) {
        quadrants[0] += room[y][x];
      }
      if (y < Math.floor(h / 2) && x > Math.floor(w / 2)) {
        quadrants[1] += room[y][x];
      }
      if (y > Math.floor(h / 2) && x < Math.floor(w / 2)) {
        quadrants[2] += room[y][x];
      }
      if (y > Math.floor(h / 2) && x > Math.floor(w / 2)) {
        quadrants[3] += room[y][x];
      }
    }
  }
  return quadrants[0] * quadrants[1] * quadrants[2] * quadrants[3];
}

const pos = firstMeet(7, 101, 53, 103);
console.log(pos);

/*
 * p=a+da*x
 * p=b+db*y
 * find first p with integer x,y
 * assuming all positive + da,db coprime
 */
function firstMeet(a: number, da: number, b: number, db: number) {
  const c = b - a;
  const [n1] = extdEuclid(da, -db);
  const x0 = n1 * c;
  const n = Math.trunc(x0 / (-1 * Math.abs(db)));
  const x = x0 + n * db;
  const p = a + da * x;
  return p;
}

/*
 * a*x + b*y =1
 * integers for x,y
 */
function extdEuclid(a: number, b: number) {
  let q = Math.trunc(a / b);
  let r = a % b;
  let s1 = 1;
  let s2 = 0;
  let s3 = s1 - q * s2;
  let t1 = 0;
  let t2 = 1;
  let t3 = t1 - q * t2;

  while (r !== 0) {
    a = b;
    b = r;
    s1 = s2;
    s2 = s3;
    t1 = t2;
    t2 = t3;
    q = Math.trunc(a / b);
    r = a % b;
    s3 = s1 - q * s2;
    t3 = t1 - q * t2;
  }

  return [s2, t2];
}
