import { hierarchy, HierarchyNode, HierarchyPointNode } from "d3-hierarchy";
import { RawPhyloTreeNode, PhyloTreeNode } from "../types";

export default function () {
  let dx = 1;
  let dy = 1;
  let nodeSize: boolean | null = null;
  let separation = defaultSeparation;

  function phylotree(data: RawPhyloTreeNode) {
    // Apply the layout hierarchy.
    const root = hierarchy(data);
    // Compute the lengthFromRoot
    root.eachBefore(computeLengthFromRoot);
    const { pointPhylotreeRoot, leftNode, rightNode, deepestNode } = setRelativePosition(root);
    return setAbsolutePosition(pointPhylotreeRoot, leftNode, rightNode, deepestNode);
  }


  // Functions
  function sizeNode(node: HierarchyPointNode<PhyloTreeNode>) {
    node.x *= dx;
    node.y = node.depth * dy;
  }


  function computeLengthFromRoot(node: HierarchyNode<RawPhyloTreeNode>) {
    const { data: { branchLength } } = node;
    node.data.branchLength = parseFloat(branchLength.toFixed(10))
    node.data.lengthFromRoot = (node.parent && node.parent.data.lengthFromRoot)
      ? parseFloat((node.parent.data.lengthFromRoot + branchLength).toFixed(10))
      : branchLength;
    return node.data.lengthFromRoot;
  }


  function setRelativePosition(root: HierarchyNode<RawPhyloTreeNode>) {
    const nodeWithPoint = root as HierarchyPointNode<PhyloTreeNode>;
    nodeWithPoint.x = 0;
    nodeWithPoint.y = 0;
    let previous: HierarchyPointNode<PhyloTreeNode> | null = null;
    let leftNode = nodeWithPoint;
    let rightNode = nodeWithPoint;
    let deepestNode = nodeWithPoint;
    function computeXposition(node: HierarchyPointNode<PhyloTreeNode>) {
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
        node.y = node.data.lengthFromRoot;
        node.x = computeXposition(node);
        leftNode = (node.x <= leftNode.x) ? node : leftNode;
        rightNode = (node.x >= rightNode.x) ? node : rightNode;
        deepestNode = (node.y >= deepestNode.y) ? node : deepestNode;

      }),
      leftNode,
      rightNode,
      deepestNode
    };

  }


  function setAbsolutePosition(
    pointPhylotreeRoot: HierarchyPointNode<PhyloTreeNode>,
    leftNode: HierarchyPointNode<PhyloTreeNode>,
    rightNode: HierarchyPointNode<PhyloTreeNode>,
    deepestNode: HierarchyPointNode<PhyloTreeNode>
  ) {
    const s = leftNode === rightNode ? 1 : separation(leftNode, rightNode) / 2,
      tx = s - leftNode.x,
      kx = dx / (rightNode.x + s + tx),
      ky = dy / (deepestNode.data.lengthFromRoot || 1);


    if (nodeSize) {
      pointPhylotreeRoot.eachBefore(sizeNode)
    } else {
      pointPhylotreeRoot.eachBefore(function (node) {
        node.x = parseFloat(((node.x + tx) * kx).toFixed(1));
        node.y = parseFloat((node.data.lengthFromRoot * ky).toFixed(1));
      });

    }

    return pointPhylotreeRoot;
  }


  // PUBLIC
  phylotree.nodeSize = function (size: [number, number]) {
    nodeSize = true;
    dx = +size[0];
    dy = +size[1];
    return phylotree;
  };

  phylotree.size = function (size: [number, number]) {
    dx = +size[0];
    dy = +size[1];
    return phylotree;
  }





  return phylotree;
}

function defaultSeparation(a: HierarchyNode<PhyloTreeNode> | null, b: HierarchyNode<PhyloTreeNode> | null) {
  // return 1;
  return (a && b && a.parent === b.parent) ? 1 : 2;
}


