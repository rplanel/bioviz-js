
export function defaultSeparation<T>(
  a: d3.HierarchyPointNode<T>, b: d3.HierarchyPointNode<T>
): number {
  return 1;
  // return (a && b && a.parent === b.parent) ? 1 : 2;
}

export const defaultNodeR = 4;
export const defaultNodeFill = "#000";
export const defaultNodeStrokeWidth = 2;
export const defaultLinkColor = "#696969";
export const defaultLinkWidth = 2;

