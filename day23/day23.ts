import * as fs from "fs/promises";

const content = await fs.readFile(Bun.argv[2], { encoding: "utf8" });

const edges = new Map<string, Set<string>>();

const pairs = content
  .split("\n")
  .filter((l) => l.length > 0)
  .map((l) => l.split("-"));

for (const pair of pairs) {
  addEdge(pair[0], pair[1]);
  addEdge(pair[1], pair[0]);
}

function addEdge(v1: string, v2: string) {
  const current = edges.get(v1) || new Set<string>();
  edges.set(v1, current.add(v2));
}

function isClique(c: Set<string>) {
  for (const v of c) {
    const nbhs = edges.get(v);
    const edgesAndSelf = new Set([...nbhs, v]);
    if (!edgesAndSelf.isSupersetOf(c)) {
      return false;
    }
  }
  return true;
}

let part2 = "";
const combs = new Set<string>();
for (const v of edges.keys()) {
  const nbhs = edges.get(v);
  if (/^t/.test(v)) {
    for (const subs of getSubsets(nbhs, 2)) {
      const s = new Set([...subs, v]);
      if (isClique(s)) {
        const comb = [...s].toSorted().join(",");
        combs.add(comb);
      }
    }
  }
  for (const subs of getSubsets(nbhs, 12)) {
    const s = new Set([...subs, v]);
    if (isClique(s)) {
      part2 = [...s].toSorted().join(",");
    }
  }
}
const part1 = combs.size;
console.log(part1);
console.log(part2);

function* getSubsets(
  set: Set<string>,
  size: number,
): IterableIterator<Set<string>> {
  if (size === 0) {
    yield new Set();
    return;
  }
  if (set.size === size) {
    yield set;
    return;
  }
  const elems = [...set];
  for (const s of getSubsets(new Set(elems.slice(1)), size)) {
    yield s;
  }
  for (const s of getSubsets(new Set(elems.slice(1)), size - 1)) {
    yield new Set([elems[0], ...s]);
  }
}
