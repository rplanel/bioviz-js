import { hierarchy, cluster } from "d3-hierarchy";
import { RawPhyloTreeNode, PhyloTreeNode } from "../types";
import { defaultSeparation } from "./phylotree";
export default function () {
  const clusterLayout = cluster<RawPhyloTreeNode>();

  let separation: (a: d3.HierarchyPointNode<RawPhyloTreeNode>, b: d3.HierarchyPointNode<RawPhyloTreeNode>) => number = defaultSeparation;
  function cladogram(data: RawPhyloTreeNode) {


    // Depending on the labels and the differen;ts visual parameters
    // compute the size dedicated to the tree itself
    const hierarchyData = hierarchy(data);
    // console.log(hierarchyData);
    hierarchyData.each(node => console.log(node))

    const clusterLayoutSize = clusterLayout.size();
    if (clusterLayoutSize) {
      const [height, width] = clusterLayoutSize;

      // Compute the size of the labels
      const leaves = hierarchyData.leaves();
      const maxLabelLength = leaves.reduce((acc, l) => l.data.name.length > acc ? l.data.name.length : acc, 0)
      // const maxRadius = leaves.reduce((acc, {data:{ r }}) => l.data., 0)
      // NEED TO PUT THE RADIUS, STROKE WIDTH IN THE DATA
      // NEED TO CREATE A FUNCTION TO DO THAT WILL BE SHARED BETWEEN THE LAYOUTS ! 
      // (CF. computeLengthFromRoot : need to split this function and extract the behavior that
      // put that information in the data
      console.log(maxLabelLength)
      const maxWidth = maxLabelLength * 8
      // Apply the layout hierarchy.

      return clusterLayout
        .size([height, width - maxWidth])
        .separation(separation)
        (hierarchyData)
        ;
    }
    else {
      throw "No cluster layout size defined";

    }
  }

  // PUBLIC
  cladogram.nodeSize = function (size: [number, number]) {
    clusterLayout.nodeSize(size)
    return cladogram;
  };

  cladogram.size = function (size: [number, number]) {
    clusterLayout.size(size);
    return cladogram;
  }

  cladogram.separation = function (
    separationCb: (a: d3.HierarchyPointNode<RawPhyloTreeNode>, b: d3.HierarchyPointNode<RawPhyloTreeNode>) => number
  ) {
    separation = separationCb;
  }


  return cladogram;

}