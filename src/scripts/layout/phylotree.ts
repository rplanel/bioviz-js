
export function defaultSeparation<T>(
  a: d3.HierarchyPointNode<T>, b: d3.HierarchyPointNode<T>
): number {
  return 1;
  // return (a && b && a.parent === b.parent) ? 1 : 2;
}