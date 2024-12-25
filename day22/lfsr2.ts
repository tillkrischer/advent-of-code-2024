let poly = 0x171;
let x = performLfsr(1, poly);
let lfsr = 1;
let mul = 1;

for (let i = 0; i < 1000; i++) {
  lfsr = performLfsr(lfsr, poly);
  mul = performMul(mul, x, poly);

  if (lfsr !== mul) {
    throw new Error("not equal");
  }

  console.log(lfsr, mul);
}

function performLfsr(v: number, poly: number) {
  const lsb = v & 1;
  v >>= 1;
  if (lsb === 1) {
    v ^= poly >> 1;
  }
  return v;
}

function performMul(v: number, x: number, mod: number) {
  return peasant(v, x, mod);
}

function peasant(a: number, b: number, m: number) {
  const secDig = Math.trunc(Math.log(m) / Math.log(2)) - 1;
  let p = 0;
  while (a !== 0 && b !== 0) {
    if (b & 1) {
      p ^= a;
    }
    if (a & (1 << secDig)) {
      a = (a << 1) ^ m;
    } else {
      a <<= 1;
    }
    b >>= 1;
  }
  return p;
}
