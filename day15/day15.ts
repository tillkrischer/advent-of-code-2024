import * as fs from "fs/promises";

const content = await fs.readFile(Bun.argv[2], { encoding: "utf8" });

const [split1, split2] = content.split("\n\n");
const room = split1.split("\n").map((row) => row.split(""));
const moves = split2.split("").filter((c) => !!getDir(c));

let [y, x] = getStart();
for (const m of moves) {
  [y, x] = move(m);
}
printRoom();
const score = getScore();
console.log(score);

function getScore() {
  let score = 0;
  for (let y = 0; y < room.length; y++) {
    for (let x = 0; x < room[0].length; x++) {
      if (room[y][x] === "O") {
        score += 100 * y + x;
      }
    }
  }
  return score;
}

function printRoom() {
  for (const row of room) {
    console.log(row.join(""));
  }
}

function move(dir: string) {
  const [dy, dx] = getDir(dir);
  let ty = y + dy;
  let tx = x + dx;

  while (room[ty][tx] === "O") {
    [ty, tx] = [ty + dy, tx + dx];
  }
  if (room[ty][tx] === "#") {
    return [y, x];
  }
  while (ty !== y || tx !== x) {
    const [ny, nx] = [ty + -1 * dy, tx + -1 * dx];
    const temp = room[ty][tx];
    room[ty][tx] = room[ny][nx];
    room[ny][nx] = temp;
    [ty, tx] = [ny, nx];
  }
  return [y + dy, x + dx];
}

function getStart() {
  for (let y = 0; y < room.length; y++) {
    for (let x = 0; x < room[0].length; x++) {
      if (room[y][x] === "@") {
        return [y, x];
      }
    }
  }
}

function getDir(c: string): [number, number] {
  if (c === "^") return [-1, 0];
  if (c === ">") return [0, 1];
  if (c === "v") return [1, 0];
  if (c === "<") return [0, -1];
}
