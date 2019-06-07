import { hierarchy, HierarchyNode, HierarchyPointNode } from "d3-hierarchy";
import { RawPhyloTreeNode, PhyloTreeNode } from "../types";
import { scaleLinear } from "d3-scale";
import { getLeftNode, getRightNode, getDeepestNode } from "../utils/tree";

export default function () {
  let dx = 1;
  let dy = 1;
  let nodeSize: boolean | null = null;
  let separation = defaultSeparation;

  function phylotree(data: RawPhyloTreeNode) {
    // Apply the layout hierarchy.
    const root = hierarchy(data);

    root.eachBefore(computeLengthFromRoot);

    function setRelativePosition() {
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
          node.x = (children[0].x + children[children.length - 1].x) / 2;
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
    // const maxLengthFromRoot = getMaxLenghtFromRoot();
    const { pointPhylotreeRoot, leftNode, rightNode, deepestNode } = setRelativePosition();
    pointPhylotreeRoot.eachBefore(n => {
      console.log(n.data.name, ' - [', n.x, ', ' + n.y + ']', " => ", n.data.lengthFromRoot);
    })
    console.log('left = ', leftNode.data.name, ' - ', leftNode.x);
    console.log('right = ', rightNode.data.name, ' - ', rightNode.x);
    console.log('deep = ', deepestNode.data.name, ' -', deepestNode.y);
    const s = leftNode === rightNode ? 1 : separation(leftNode, rightNode) / 2,
      tx = s - leftNode.x,
      kx = dx / (rightNode.x + s + tx),
      ky = dy / (deepestNode.data.lengthFromRoot || 1);


    if (nodeSize) {
      pointPhylotreeRoot.eachBefore(sizeNode)
    } else {
      pointPhylotreeRoot.eachBefore(function (node) {
        node.x = (node.x + tx) * kx;
        node.y = node.data.lengthFromRoot * ky;
      });

    }

    pointPhylotreeRoot.eachBefore(n => {
      console.log(n.data.name, ' - [', n.x, ', ' + n.y + ']');
    })
    return pointPhylotreeRoot;

  }




  // FUnctions
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


