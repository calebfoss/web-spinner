export function isReadOnly(obj: {}, propertyKey: PropertyKey) {
  const descriptor = Object.getOwnPropertyDescriptor(obj, propertyKey);

  if (descriptor === undefined) {
    const prototype = Object.getPrototypeOf(obj);

    if (prototype === null)
      throw new Error(
        `Could not find property with key: ${String(propertyKey)}`
      );

    return isReadOnly(prototype, propertyKey);
  }

  if (descriptor.writable) return false;

  return descriptor.set === undefined;
}
