export function isDeepFrozen(obj: any, visited = new Set<any>()): boolean {
  if (!Object.isFrozen(obj)) {
    return false;
  }
  visited.add(obj);
  for (const key in obj) {
    if (Object.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      if (typeof value === "object") {
        if (visited.has(value)) {
          continue;
        }
        if (!isDeepFrozen(value, visited)) {
          return false;
        }
      }
    }
  }
  return true;
}
