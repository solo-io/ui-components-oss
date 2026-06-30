/** Helper: emotion `styled` shouldForwardProp blocking the given prop names. */
export function dontForwardProps(...props: string[]) {
  return { shouldForwardProp: (propName: string) => !props.includes(propName) };
}

export type ElementOf<T> = T extends ReadonlyArray<infer E> ? E : never;

/** Emit `prop:value;` when the value is defined, else an empty string. */
export function cssProp(prop: string, value: string | number | undefined, isImportant = false) {
  return value !== undefined ? `${prop}:${value}${isImportant ? ' !important' : ''};` : '';
}
