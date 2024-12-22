const parents = new Map<number, number>();
const ranks = new Map<number, number>();

function makeSet(x: number) {
  parents.set(x, x);
  ranks.set(x, 0);
}

function find(x: number) {
  if (parents.get(x) !== x) {
    parents.set(x, find(parents.get(x)));
  }
  return parents.get(x);
}

function union(x: number, y: number) {
  const rootX = find(x);
  const rootY = find(y);
  if (rootX !== rootY) {
    if (ranks.get(rootX) > ranks.get(rootY)) {
      parents.set(rootY, rootX);
    } else if (ranks.get(rootX) < ranks.get(rootY)) {
      parents.set(rootX, rootY);
    } else {
      parents.set(rootY, rootX);
      ranks.set(rootX, ranks.get(rootX) + 1);
    }
  }
}
