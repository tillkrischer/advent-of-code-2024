import * as fs from "fs/promises";

// const content = await fs.readFile("day12/test-input.txt", { encoding: "utf8" });
const content = await fs.readFile("day12/input.txt", { encoding: "utf8" });

let grid = content
  .split("\n")
  .filter((l) => l.length > 0)
  .map((r) => r.split(""));

const seen: boolean[][] = new Array(grid.length)
  .fill(0)
  .map((_) => new Array(grid[0].length).fill(false));

let price = 0;
for (let y = 0; y < grid.length; y++) {
  for (let x = 0; x < grid.length; x++) {
    if (!seen[y][x]) {
      const elems = dfs(y, x);
      const boundary = getBoundary(elems);
      price += elems.length * boundary;
    }
  }
}
console.log(price);

function dfs(y: number, x: number): [number, number][] {
  seen[y][x] = true;
  const elems: [number, number][] = [[y, x]];

  const directions = [
    [0, -1],
    [0, 1],
    [-1, 0],
    [1, 0],
  ];
  for (const [dy, dx] of directions) {
    const ny = y + dy;
    const nx = x + dx;
    if (
      nx >= 0 &&
      nx < grid[0].length &&
      ny >= 0 &&
      ny < grid.length &&
      grid[ny][nx] === grid[y][x] &&
      !seen[ny][nx]
    ) {
      elems.push(...dfs(ny, nx));
    }
  }

  return elems;
}

function getBoundary(elems: [number, number][]) {
  const seenBoundaries = new Set<string>();
  let count = 0;
  for (const [y, x] of elems) {
    // top
    if (
      (y === 0 || grid[y][x] !== grid[y - 1][x]) &&
      !seenBoundaries.has("v" + y + "," + x)
    ) {
      seenBoundaries.add("v" + y + "," + x);
      count += 1;
    }
    // bottom
    if (
      (y === grid.length - 1 || grid[y][x] !== grid[y + 1][x]) &&
      !seenBoundaries.has("v" + y + 1 + "," + x)
    ) {
      seenBoundaries.add("v" + y + 1 + "," + x);
      count += 1;
    }
    // left
    if (
      (x === 0 || grid[y][x] !== grid[y][x - 1]) &&
      !seenBoundaries.has("h" + y + "," + x)
    ) {
      seenBoundaries.add("h" + y + "," + x);
      count += 1;
    }
    // right
    if (
      (x === grid[0].length - 1 || grid[y][x] !== grid[y][x + 1]) &&
      !seenBoundaries.has("h" + y + "," + x + 1)
    ) {
      seenBoundaries.add("h" + y + "," + x + 1);
      count += 1;
    }
  }
  return count;
}

// function dfs(y: number, x: number): [number, number] {
//   seen[y][x] = true;
//   // const elems: [number, number][] = [[y, x]];
//   let count = 1;
//   let interiors = 0;
//   if (isInterior(y, x)) {
//     interiors = 1;
//   }
//
//   const directions = [
//     [0, -1],
//     [0, 1],
//     [-1, 0],
//     [1, 0],
//   ];
//
//   for (const [dy, dx] of directions) {
//     const ny = y + dy;
//     const nx = x + dx;
//     if (
//       nx >= 0 &&
//       nx < grid[0].length &&
//       ny >= 0 &&
//       ny < grid.length &&
//       grid[ny][nx] === grid[y][x] &&
//       !seen[ny][nx]
//     ) {
//       const [ncount, ninteriors] = dfs(ny, nx);
//       count += ncount;
//       interiors += ninteriors;
//     }
//   }
//
//   return [count, interiors];
// }
//
// function isInterior(y: number, x: number) {
//   if (y === 0 || x === 0) {
//     return false;
//   }
//
//   const nbhs = [
//     [-1, 0],
//     [0, -1],
//     [-1, -1],
//   ];
//   for (const [dy, dx] of nbhs) {
//     if (grid[y + dy][x + dx] != grid[y][x]) {
//       return false;
//     }
//   }
//   return true;
// }
