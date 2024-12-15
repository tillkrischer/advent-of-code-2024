import * as fs from "fs/promises";

const content = await fs.readFile(Bun.argv[2], { encoding: "utf8" });

const [split1, split2] = content.split("\n\n");
const room = split1.split("\n").map((row) => row.split(""));
const moves = split2.split("").filter((c) => !!getDir(c));

part1();
part2();

function part1() {
  let [y, x] = getStart();
  for (const m of moves) {
    [y, x] = move(m);
  }
  // printRoom();
  const score = getScore();
  console.log(score);

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
}

function part2() {
  const walls: [number, number][] = [];
  const boxes: [number, number][] = [];
  let robot: [number, number] = [0, 0];
  for (let y = 0; y < room.length; y++) {
    for (let x = 0; x < room[0].length; x++) {
      if (room[y][x] === "#") {
        walls.push([y, 2 * x], [y, 2 * x + 1]);
      }
      if (room[y][x] === "O") {
        boxes.push([y, 2 * x]);
      }
      if (room[y][x] === "@") {
        robot = [y, 2 * x];
      }
    }
  }

  // printRoom2(walls, boxes, robot);

  for (const m of moves) {
    const dir = getDir(m);
    if (canMoveRobot(walls, boxes, robot, dir)) {
      moveRobot(walls, boxes, robot, dir);
    }
    // printRoom2(walls, boxes, robot);
  }

  const s = score2(boxes);
  console.log(s);
}

function score2(boxes: [number, number][]) {
  let score = 0;
  for (const [y, x] of boxes) {
    score += 100 * y + x;
  }
  return score;
}

function moveRobot(
  walls: [number, number][],
  boxes: [number, number][],
  robot: [number, number],
  dir: [number, number],
) {
  const [y, x] = robot;
  const [dy, dx] = dir;
  const [ny, nx] = [y + dy, x + dx];
  const adjBoxes = boxesIntersectRobot(boxes, [ny, nx]);
  for (const adjBox of adjBoxes) {
    moveBox(walls, boxes, adjBox, dir);
  }
  robot[0] = ny;
  robot[1] = nx;
}

function moveBox(
  walls: [number, number][],
  boxes: [number, number][],
  box: [number, number],
  dir: [number, number],
) {
  const [y, x] = box;
  const [dy, dx] = dir;
  const [ny, nx] = [y + dy, x + dx];
  const adjBoxes = boxesIntersectBox(boxes, [ny, nx]);
  for (const adjBox of adjBoxes) {
    if (adjBox[0] !== y || adjBox[1] !== x) {
      moveBox(walls, boxes, adjBox, dir);
    }
  }
  box[0] = ny;
  box[1] = nx;
}

function printRoom2(
  walls: [number, number][],
  boxes: [number, number][],
  robot: [number, number],
) {
  const room2: string[][] = new Array(room.length)
    .fill(0)
    .map((_) => new Array(room[0].length * 2).fill("."));

  for (const [wally, wallx] of walls) {
    room2[wally][wallx] = "#";
  }
  for (const [boxy, boxx] of boxes) {
    room2[boxy][boxx] = "[";
    room2[boxy][boxx + 1] = "]";
  }
  room2[robot[0]][robot[1]] = "@";

  for (const row of room2) {
    console.log(row.join(""));
  }
}

function canMoveRobot(
  walls: [number, number][],
  boxes: [number, number][],
  robot: [number, number],
  dir: [number, number],
) {
  const [y, x] = robot;
  const [dy, dx] = dir;
  const [ny, nx] = [y + dy, x + dx];
  if (wallsIntersectRobot(walls, [ny, nx]).length > 0) {
    return false;
  }
  const adjBoxes = boxesIntersectRobot(boxes, [ny, nx]);
  let res = true;
  for (const adjBox of adjBoxes) {
    res &&= canMoveBox(walls, boxes, adjBox, dir);
  }
  return res;
}

function canMoveBox(
  walls: [number, number][],
  boxes: [number, number][],
  box: [number, number],
  dir: [number, number],
) {
  const [y, x] = box;
  const [dy, dx] = dir;
  const [ny, nx] = [y + dy, x + dx];
  if (wallsIntersectBox(walls, [ny, nx]).length > 0) {
    return false;
  }
  const adjBoxes = boxesIntersectBox(boxes, [ny, nx]);
  let res = true;
  for (const adjBox of adjBoxes) {
    if (adjBox[0] !== y || adjBox[1] !== x) {
      res &&= canMoveBox(walls, boxes, adjBox, dir);
    }
  }
  return res;
}

function boxesIntersectRobot(
  boxes: [number, number][],
  robot: [number, number],
) {
  const [y, x] = robot;
  return boxes.filter(([by, bx]) => by === y && (bx === x || bx + 1 === x));
}

function wallsIntersectRobot(
  walls: [number, number][],
  robot: [number, number],
) {
  const [y, x] = robot;
  return walls.filter(([by, bx]) => by === y && bx === x);
}

function boxesIntersectBox(boxes: [number, number][], box: [number, number]) {
  const [y, x] = box;
  return boxes.filter(
    ([by, bx]) => by === y && (bx === x || bx === x + 1 || bx === x - 1),
  );
}

function wallsIntersectBox(walls: [number, number][], box: [number, number]) {
  const [y, x] = box;
  return walls.filter(([by, bx]) => by === y && (bx === x || bx === x + 1));
}

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
