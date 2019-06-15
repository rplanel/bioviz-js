import { hierarchy } from "d3-hierarchy";
import { RawPhyloTreeNode, PhyloTreeNode } from "../types";
import { defaultSeparation } from "./phylotree"
export default function () {
  let dx = 1;
  let dy = 1;
  let nodeSize: boolean | null = null;
  let separation = defaultSeparation;
  function phylogram(data: RawPhyloTreeNode) {
    // Apply the layout hierarchy.
    const root = hierarchy(data);
    // Compute the lengthFromRoot
    const { maxLengthFromRoot } = computeLengthFromRoot(root);
    const { pointPhylotreeRoot, leftNode, rightNode, deepestNodeWithLabel } =
      setRelativePosition(root, maxLengthFromRoot);
    return setAbsolutePosition(
      pointPhylotreeRoot,
      leftNode,
      rightNode,
      deepestNodeWithLabel
    );
  }


  // Functions

  function computeLengthFromRoot(root: d3.HierarchyNode<RawPhyloTreeNode>) {
    let maxLengthFromRoot = 0;
    let maxLabel = 0;
    const phyloTreeNode = root as d3.HierarchyNode<PhyloTreeNode>;
    phyloTreeNode.eachBefore(node => {
      const { data: { branchLength } } = node;
      const labelWidth = (node.data.name.length + 1) * 8.2 / dy;
      node.data.branchLength = parseFloat(branchLength.toFixed(10));
      node.data.width = 0;
      node.data.lengthFromRoot = (node.parent && node.parent.data.lengthFromRoot)
        ? parseFloat((node.parent.data.lengthFromRoot + branchLength).toFixed(10))
        : branchLength;

      node.data.labelWidth = labelWidth;
      maxLengthFromRoot = (node.data.lengthFromRoot >= maxLengthFromRoot) ? node.data.lengthFromRoot : maxLengthFromRoot;
      maxLabel = (node.data.labelWidth >= maxLabel) ? node.data.labelWidth : maxLabel;
    });
    return { maxLengthFromRoot, maxLabel }
  }

  function setRelativePosition(
    root: d3.HierarchyNode<RawPhyloTreeNode>,
    maxLengthFromRoot: number,
  ) {
    const nodeWithPoint = root as d3.HierarchyPointNode<PhyloTreeNode>;
    nodeWithPoint.x = 0;
    nodeWithPoint.y = 0;
    let previous: d3.HierarchyPointNode<PhyloTreeNode> | null = null;
    let leftNode = nodeWithPoint;
    let rightNode = nodeWithPoint;
    let deepestNodeWithLabel = nodeWithPoint;
    function computeXposition(node: d3.HierarchyPointNode<PhyloTreeNode>) {
      const children = node.children;
      if (children) {
        node.x = parseFloat(((children[0].x + children[children.length - 1].x) / 2).toFixed(10));
        return node.x
      }
      else {
        node.x = (previous) ? previous.x + separation(node, previous) : 0;
        previous = node;
        return node.x;
      }
    }
    return {
      pointPhylotreeRoot: nodeWithPoint.eachAfter((node) => {
        // node.data.labelWidth = node.data.labelWidth;
        node.y = node.data.lengthFromRoot / maxLengthFromRoot;
        node.data.width = node.data.labelWidth + node.y;
        node.x = computeXposition(node);
        leftNode = (node.x <= leftNode.x) ? node : leftNode;
        rightNode = (node.x >= rightNode.x) ? node : rightNode;
        deepestNodeWithLabel = (node.data.width >= deepestNodeWithLabel.data.width) ? node : deepestNodeWithLabel;
      }),
      leftNode,
      rightNode,
      deepestNodeWithLabel
    };

  }


  function setAbsolutePosition(
    pointPhylotreeRoot: d3.HierarchyPointNode<PhyloTreeNode>,
    leftNode: d3.HierarchyPointNode<PhyloTreeNode>,
    rightNode: d3.HierarchyPointNode<PhyloTreeNode>,
    deepestNodeWithLabel: d3.HierarchyPointNode<PhyloTreeNode>
  ) {
    const margin = leftNode === rightNode ? 1 : separation(leftNode, rightNode) / 2;
    const tx = margin - leftNode.x;
    // Reajust the position after adding the margin (s)
    const kx = dx / (rightNode.x + margin + tx);
    const ky = parseFloat((dy * (1 - deepestNodeWithLabel.data.labelWidth) / deepestNodeWithLabel.y).toFixed(10)
    );
    // Walk that computes the label size in order to get 
    // a new coef

    if (nodeSize) {
      pointPhylotreeRoot.eachBefore(function (node) {
        node.x = (node.x + tx) * dx;
        node.y = parseFloat((node.y * ky).toFixed(1));
      })
    } else {
      pointPhylotreeRoot.eachBefore(function (node) {
        node.x = parseFloat(((node.x + tx) * kx).toFixed(1));
        node.y = parseFloat((node.y * ky).toFixed(1));
        node.data.width *= ky;
        node.data.labelWidth *= ky;
      });

    }

    return pointPhylotreeRoot;
  }


  // PUBLIC
  phylogram.nodeSize = function (size: [number, number]) {
    nodeSize = true;
    dx = +size[0];
    dy = +size[1];
    return phylogram;
  };

  phylogram.size = function (size: [number, number]) {
    dx = +size[0];
    dy = +size[1];
    return phylogram;
  }

  phylogram.separation = function <T>(
    separationCb: (a: d3.HierarchyNode<T>, b: d3.HierarchyNode<T>) => number
  ) {
    separation = separationCb;
  }




  return phylogram;
}



