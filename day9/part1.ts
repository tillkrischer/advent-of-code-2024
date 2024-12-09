import * as fs from "fs/promises";

// const content = await fs.readFile("day9/test-input.txt", { encoding: "utf8" });
const content = await fs.readFile("day9/input.txt", { encoding: "utf8" });

const nums = content
  .split("\n")[0]
  .split("")
  .map((n) => Number.parseInt(n));

const blocks: (number | null)[] = [];

let i = 0;
let id = 0;
let isBlocks = true;
while (i < nums.length) {
  if (isBlocks) {
    blocks.push(...new Array<number>(nums[i]).fill(id));
    isBlocks = false;
    id += 1;
  } else {
    blocks.push(...new Array<number>(nums[i]).fill(null));
    isBlocks = true;
  }
  i += 1;
}

let [firstFree, lastOcc] = advance(blocks, 0, blocks.length - 1);

while (firstFree < lastOcc) {
  [blocks[firstFree], blocks[lastOcc]] = [blocks[lastOcc], blocks[firstFree]];
  [firstFree, lastOcc] = advance(blocks, firstFree, lastOcc);
}

// console.log(blocks)

let checksum = 0;
i = 0;
while (i < blocks.length && blocks[i] !== null) {
  checksum += i * blocks[i];
  i += 1;
}

console.log(checksum);

function advance(
  blocks: (number | null)[],
  firstFree: number,
  lastOcc: number,
) {
  while (firstFree < blocks.length && blocks[firstFree] !== null) {
    firstFree += 1;
  }
  while (lastOcc >= 0 && blocks[lastOcc] === null) {
    lastOcc -= 1;
  }
  return [firstFree, lastOcc];
}
