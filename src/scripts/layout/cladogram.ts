import { hierarchy, cluster } from "d3-hierarchy";
import { RawPhyloTreeNode, PhyloTreeNode } from "../types";
import { defaultSeparation } from "./phylotree";
export default function () {
  let dx = 1;
  let dy = 1;
  let nodeSize: boolean | null = null;
  let separation = defaultSeparation;
  function cladogram(data: RawPhyloTreeNode) {
    // Apply the layout hierarchy.
    cluster()
      .separation(separation)
      (hierarchy(data))
    return data;
  }

  // PUBLIC
  cladogram.nodeSize = function (size: [number, number]) {
    nodeSize = true;
    dx = +size[0];
    dy = +size[1];
    return cladogram;
  };

  cladogram.size = function (size: [number, number]) {
    dx = +size[0];
    dy = +size[1];
    return cladogram;
  }

  cladogram.separation = function <T>(
    separationCb: (a: d3.HierarchyNode<T>, b:d3.HierarchyNode<T>) => number
  ) {
    separation = separationCb;
  }


  return cladogram;

}