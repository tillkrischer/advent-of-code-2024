import * as fs from "fs/promises";

type Direction = "up" | "down" | "left" | "right";

type Pos = {
  x: number;
  y: number;
};

// const content = await fs.readFile("day6/test-input.txt", { encoding: "utf8" });
const content = await fs.readFile("day6/input.txt", { encoding: "utf8" });

const chars = content
  .split("\n")
  .filter((l) => l.length > 0)
  .map((l) => l.split(""));

let startPos: Pos | null = getStart(chars);
let startDirection: Direction = "up";

let count = 0;

for (let y = 0; y < chars.length; y += 1) {
  for (let x = 0; x < chars[0].length; x += 1) {
    if (y !== startPos.y || x !== startPos.x) {
      const modifiedChars = chars.map((r) => [...r]);
      modifiedChars[y][x] = "O";
      if (hasLoop(modifiedChars, startPos, startDirection)) {
        // for (const line of modifiedChars) {
        //   console.log(line.join(""));
        // }
        count += 1;
      }
    }
  }
}

console.log(count);

function hasLoop(chars: string[][], pos: Pos, direction: Direction) {
  const visited = new Set<string>();

  while (pos !== null) {
    if (isBlocked(chars, pos, direction)) {
      if (!visited.has(`${pos.x},${pos.y},${direction}`)) {
        visited.add(`${pos.x},${pos.y},${direction}`);
      } else {
        return true;
      }
    }
    while (isBlocked(chars, pos, direction)) {
      direction = turn(direction);
    }
    pos = getNext(chars, pos, direction);
  }
  return false;
}

function turn(direction: Direction): Direction {
  if (direction === "up") {
    return "right";
  }
  if (direction === "right") {
    return "down";
  }
  if (direction === "down") {
    return "left";
  }
  if (direction === "left") {
    return "up";
  }
}

function isBlocked(chars: string[][], pos: Pos, direction: Direction) {
  const next = getNext(chars, pos, direction);
  return (
    next !== null &&
    (chars[next.y][next.x] === "#" || chars[next.y][next.x] === "O")
  );
}

function getNext(
  chars: string[][],
  pos: Pos,
  direction: Direction,
): Pos | null {
  if (direction === "up" && pos.y === 0) {
    return null;
  }
  if (direction === "down" && pos.y === chars.length - 1) {
    return null;
  }
  if (direction === "left" && pos.x === 0) {
    return null;
  }
  if (direction === "right" && pos.x === chars[0].length) {
    return null;
  }

  if (direction === "up") {
    return { y: pos.y - 1, x: pos.x };
  }
  if (direction === "down") {
    return { y: pos.y + 1, x: pos.x };
  }
  if (direction === "left") {
    return { y: pos.y, x: pos.x - 1 };
  }
  if (direction === "right") {
    return { y: pos.y, x: pos.x + 1 };
  }
}

function getStart(chars: string[][]): Pos {
  for (let y = 0; y < chars.length; y += 1) {
    for (let x = 0; x < chars[0].length; x += 1) {
      if (chars[y][x] === "^") {
        return { x, y };
      }
    }
  }
}
