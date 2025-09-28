export function objx(input: any, depth = 0): any {
  if (depth > 6) return input;
  if (Array.isArray(input)) {
    return input.map((item) => objx(item, depth + 1)).flat();
  }
  if (input && typeof input === 'object') {
    return Object.keys(input).map((k) => objx((input as any)[k], depth + 1)).flat();
  }
  return input;
}
