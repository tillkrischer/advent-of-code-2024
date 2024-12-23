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

const combs = new Set<string>();
for (const v of edges.keys()) {
  if (/^t/.test(v)) {
    const nbhs = [...edges.get(v)];
    for (let i = 0; i < nbhs.length; i++) {
      for (let j = i + 1; j < nbhs.length; j++) {
        const v1 = nbhs[i];
        const v2 = nbhs[j];
        if (v1 !== v2 && edges.get(v1)?.has(v2)) {
          const comb = [v, v1, v2].toSorted().join(",");
          combs.add(comb);
        }
      }
    }
  }
}
const part1 = combs.size;
console.log(part1);
