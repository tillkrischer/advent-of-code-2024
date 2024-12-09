import * as fs from "fs/promises";

// const content = await fs.readFile("day9/test-input.txt", { encoding: "utf8" });
const content = await fs.readFile("day9/input.txt", { encoding: "utf8" });

type Segment = {
  id: number | null;
  length: number;
};

const nums = content
  .split("\n")[0]
  .split("")
  .map((n) => Number.parseInt(n));

let [segments, lastId] = parseToSegments(nums);

for (let id = lastId; id >= 0; id -= 1) {
  const fileIndex = segments.findIndex((s) => s.id === id);
  const space = findSpace(segments, segments[fileIndex].length, fileIndex);
  if (space !== null) {
    segments = move(segments, fileIndex, space);
    // segments = clean(segments); // not necessary
  }
  // print(segments);
}

const checksum = computeChecksum(segments);

console.log(checksum);

function print(segments: Segment[]) {
  let s = "";
  for (const segment of segments) {
    if (segment.id === null) {
      s += ".".repeat(segment.length);
    } else {
      s += segment.id.toString().repeat(segment.length);
    }
  }
  console.log(s);
}

function computeChecksum(segments: Segment[]) {
  let checksum = 0;
  let i = 0;
  let index = 0;
  while (i < segments.length) {
    if (segments[i].id === null) {
      index += segments[i].length;
    } else {
      for (let j = 0; j < segments[i].length; j += 1) {
        checksum += index * segments[i].id;
        index += 1;
      }
    }
    i += 1;
  }
  return checksum;
}

function clean(segments: Segment[]): Segment[] {
  const cleanSegments: Segment[] = [];
  let i = 0;

  while (i < segments.length) {
    if (segments[i].id !== null) {
      cleanSegments.push(segments[i]);
      i += 1;
    } else {
      let combinedLength = 0;
      while (i < segments.length && segments[i].id === null) {
        combinedLength += segments[i].length;
        i += 1;
      }
      cleanSegments.push({ id: null, length: combinedLength });
    }
  }

  return cleanSegments;
}

function move(segments: Segment[], file: number, space: number): Segment[] {
  return [
    ...segments.slice(0, space),
    segments[file],
    { id: null, length: segments[space].length - segments[file].length },
    ...segments.slice(space + 1, file),
    { id: null, length: segments[file].length },
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
