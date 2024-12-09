import * as fs from "fs/promises";

const content = await fs.readFile("day9/test-input.txt", { encoding: "utf8" });
// const content = await fs.readFile("day9/input.txt", { encoding: "utf8" });

type Segment = {
  id: number | null;
  length: number;
};

const nums = content
  .split("\n")[0]
  .split("")
  .map((n) => Number.parseInt(n));

let [segments, lastId] = parseToSegments(nums);
console.log(segments);

for (let id = lastId; id >= 0; id -= 1) {
  const fileIndex = segments.findIndex((s) => s.id === id);
  const space = findSpace(segments, segments[fileIndex].length, fileIndex);
  if (space !== null) {
    segments = move(segments, fileIndex, space);
  }

  console.log(segments);

  break;
}

function move(segments: Segment[], file: number, space: number): Segment[] {
  return [
    ...segments.slice(0, space),
    segments[file],
    { id: null, length: segments[space].length - segments[file].length },
    ...segments.slice(space + 1, file),
    ...segments.slice(file + 1, segments.length),
  ];
}

function findSpace(segments: Segment[], length: number, end: number) {
  let i = 0;
  while (i < end) {
    if (segments[i].id === null && segments[i].length >= length) {
      return i;
    }
    i += 1;
  }
  return null;
}

function parseToSegments(nums: number[]): [Segment[], number] {
  const segments: Segment[] = [];

  let i = 0;
  let id = 0;
  let isBlocks = true;
  while (i < nums.length) {
    if (isBlocks) {
      segments.push({ id, length: nums[i] });
      isBlocks = false;
      id += 1;
    } else {
      segments.push({ id: null, length: nums[i] });
      isBlocks = true;
    }
    i += 1;
  }

  return [segments, id - 1];
}
//
// let [firstFree, lastOcc] = advance(blocks, 0, blocks.length - 1);
//
// while (firstFree < lastOcc) {
//   [blocks[firstFree], blocks[lastOcc]] = [blocks[lastOcc], blocks[firstFree]];
//   [firstFree, lastOcc] = advance(blocks, firstFree, lastOcc);
// }
//
// // console.log(blocks)
//
// let checksum = 0;
// i = 0;
// while (i < blocks.length && blocks[i] !== null) {
//   checksum += i * blocks[i];
//   i += 1;
// }
//
// console.log(checksum);
//
// function advance(
//   blocks: (number | null)[],
//   firstFree: number,
//   lastOcc: number,
// ) {
//   while (firstFree < blocks.length && blocks[firstFree] !== null) {
//     firstFree += 1;
//   }
//   while (lastOcc >= 0 && blocks[lastOcc] === null) {
//     lastOcc -= 1;
//   }
