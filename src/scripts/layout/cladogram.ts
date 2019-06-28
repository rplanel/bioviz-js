import { hierarchy, cluster } from "d3-hierarchy";
import { RawPhyloTreeNode, PhyloTreeNode } from "../types";
import { defaultSeparation } from "./phylotree";
export default function () {
  let dx = 1;
  let dy = 1;
  let nodeSize: boolean | null = null;
  let separation: (a: d3.HierarchyPointNode<RawPhyloTreeNode>, b:d3.HierarchyPointNode<RawPhyloTreeNode>) => number = defaultSeparation;
  function cladogram(data: RawPhyloTreeNode) {
    // Apply the layout hierarchy.
    cluster<RawPhyloTreeNode>()
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

  cladogram.separation = function(
    separationCb: (a: d3.HierarchyPointNode<RawPhyloTreeNode>, b:d3.HierarchyPointNode<RawPhyloTreeNode>) => number
  ) {
    separation = separationCb;
  }


  return cladogram;

}