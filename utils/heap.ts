export function heappush<T>(heap: [number, T][], item: [number, T]) {
  heap.push(item);
  let i = heap.length - 1;
  while (i > 0) {
    const parent = ((i - 1) / 2) | 0;
    if (heap[i][0] >= heap[parent][0]) {
      break;
    }
    [heap[i], heap[parent]] = [heap[parent], heap[i]];
    i = parent;
  }
}

export function heappop<T>(heap: [number, T][]): [number, T] {
  if (heap.length === 0) {
    return undefined;
  }
  const last = heap.pop();
  if (heap.length === 0) {
    return last;
  }
  const first = heap[0];
  heap[0] = last;
  let i = 0;
  while (i < heap.length) {
    let min = i;
    const left = i * 2 + 1;
    const right = i * 2 + 2;
    if (left < heap.length && heap[left][0] < heap[min][0]) {
      min = left;
    }
    if (right < heap.length && heap[right][0] < heap[min][0]) {
      min = right;
    }
    if (min === i) {
      break;
    }
    [heap[i], heap[min]] = [heap[min], heap[i]];
    i = min;
  }

  return first;
}

// const nums = [
//   7, 47, 77, 20, 16, 22, 90, 74, 98, 58, 12, 28, 75, 26, 57, 67, 86, 61, 44, 38,
// ];
//
// const Q = [];
// for (const n of nums) {
//   heappush(Q, [n, n.toString()]);
// }
//
// while (Q.length > 0) {
//   const e = heappop(Q);
//   console.log(e);
// }
