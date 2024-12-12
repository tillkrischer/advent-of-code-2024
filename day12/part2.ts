import * as fs from "fs/promises";

// const content = await fs.readFile("day12/test-input.txt", { encoding: "utf8" });
// const content = await fs.readFile("day12/test-input2.txt", { encoding: "utf8" });
// const content = await fs.readFile("day12/test-input3.txt", { encoding: "utf8" });
// const content = await fs.readFile("day12/test-input4.txt", { encoding: "utf8" });
// const content = await fs.readFile("day12/test-input5.txt", { encoding: "utf8" });
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
      const boundary = getBoundary(elems, grid[y][x]);
      // console.log({ area: elems.length, boundary });
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

function getBoundary(elems: [number, number][], value: string) {
  const vBoundaries: boolean[][] = new Array(grid.length)
    .fill(0)
    .map((_) => new Array(grid[0].length + 1).fill(false));
  const hBoundaries: boolean[][] = new Array(grid.length + 1)
    .fill(0)
    .map((_) => new Array(grid[0].length).fill(false));

  for (const [y, x] of elems) {
    // top
    if (y === 0 || grid[y][x] !== grid[y - 1][x]) {
      hBoundaries[y][x] = true;
    }
    // bottom
    if (y === grid.length - 1 || grid[y][x] !== grid[y + 1][x]) {
      hBoundaries[y + 1][x] = true;
    }
    // left
    if (x === 0 || grid[y][x] !== grid[y][x - 1]) {
      vBoundaries[y][x] = true;
    }
    // right
    if (x === grid[0].length - 1 || grid[y][x] !== grid[y][x + 1]) {
      vBoundaries[y][x + 1] = true;
    }
  }

  let count = 0;
  for (let x = 0; x < vBoundaries[0].length; x++) {
    let y = 0;
    while (y < vBoundaries.length) {
      while (y < vBoundaries.length && !vBoundaries[y][x]) {
        y += 1;
      }
      if (y === vBoundaries.length) {
        break;
      }
      count += 1;
      // left
      let inside = x - 1;
      // right
      if (x !== vBoundaries[0].length - 1 && grid[y][x] === value) {
        inside = x;
      }
      while (
        y < vBoundaries.length &&
        vBoundaries[y][x] &&
        grid[y][inside] === value
      ) {
        y += 1;
      }
    }
  }
  for (let y = 0; y < hBoundaries.length; y++) {
    let x = 0;
    while (x < hBoundaries[0].length) {
      while (x < hBoundaries[0].length && !hBoundaries[y][x]) {
        x += 1;
      }
      if (x === hBoundaries[0].length) {
        break;
      }
      count += 1;
      // below
      let inside = y - 1;
      // above
      if (y !== hBoundaries.length - 1 && grid[y][x] === value) {
        inside = y;
      }
      while (
        x < hBoundaries[0].length &&
        hBoundaries[y][x] &&
        grid[inside][x] === value
      ) {
        x += 1;
      }
    }
  }
  return count;
}
