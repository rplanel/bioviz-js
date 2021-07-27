import { hierarchy, HierarchyPointNode, HierarchyNode } from "d3-hierarchy";
import { RawPhyloTreeNode, PhyloTreeNode, PartialNodeInfo, PartialLinkInfo } from "../types";
import { defaultSeparation, defaultNodeR, defaultNodeFill, defaultNodeStrokeWidth, defaultLinkColor, defaultLinkWidth } from "./phylotree"

export default function () {
  let dx = 1;
  let dy = 1;
  let nodeSize: boolean | null = null;
  let separation: (a: HierarchyPointNode<PhyloTreeNode>, b: HierarchyPointNode<PhyloTreeNode>) => number = defaultSeparation;
  function phylogram(data: RawPhyloTreeNode) {
    // Apply the layout hierarchy.
    const root = hierarchy(data);
    // Compute the lengthFromRoot
    const maxLengthFromRoot = computeLengthFromRoot(root);
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

  function computeLengthFromRoot(root: HierarchyNode<RawPhyloTreeNode>) {
    let maxLengthFromRoot = 0;
    const phyloTreeNode = root as HierarchyNode<PhyloTreeNode>;
    phyloTreeNode.eachBefore(currNode => {
      const { data: { branchLength, node, link } } = currNode;
      currNode.data.node = setNodeInfo(node);
      currNode.data.link = setLinkInfo(link);
      const labelWidth = (currNode.data.name.length * 8 + currNode.data.node.r) / dy;

      currNode.data.branchLength = parseFloat(branchLength.toFixed(10));
      currNode.data.width = 0;

      currNode.data.labelWidth = labelWidth;


      currNode.data.lengthFromRoot = (currNode.parent && currNode.parent.data.lengthFromRoot)
        ? parseFloat((currNode.parent.data.lengthFromRoot + branchLength).toFixed(10))
        : branchLength;
      maxLengthFromRoot = (currNode.data.lengthFromRoot >= maxLengthFromRoot)
        ? currNode.data.lengthFromRoot
        : maxLengthFromRoot;
      // console.log(currNode.y);
    });
    return maxLengthFromRoot
  }



  function setRelativePosition(
    root: HierarchyNode<RawPhyloTreeNode>,
    maxLengthFromRoot: number,
  ) {
    const nodeWithPoint = root as HierarchyPointNode<PhyloTreeNode>;
    nodeWithPoint.x = 0;
    nodeWithPoint.y = 0;
    let previous: HierarchyPointNode<PhyloTreeNode> | null = null;
    let leftNode = nodeWithPoint;
    let rightNode = nodeWithPoint;
    let deepestNodeWithLabel = nodeWithPoint;
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
    maxLengthFromRoot += nodeWithPoint.data.node.r / dy;
    return {
      pointPhylotreeRoot: nodeWithPoint.eachAfter((node) => {
        node.y = node.data.lengthFromRoot  / maxLengthFromRoot;
        // console.log(node.y);

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
    pointPhylotreeRoot: HierarchyPointNode<PhyloTreeNode>,
    leftNode: HierarchyPointNode<PhyloTreeNode>,
    rightNode: HierarchyPointNode<PhyloTreeNode>,
    deepestNodeWithLabel: HierarchyPointNode<PhyloTreeNode>
  ) {
    const margin = leftNode === rightNode ? 1 : separation(leftNode, rightNode) / 2;
    const marginTop = pointPhylotreeRoot.data.node.r + pointPhylotreeRoot.data.link.strokeWidth / 2;
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
        node.y = parseFloat((node.y * ky).toFixed(1) + marginTop) ;
      })
    } else {
      pointPhylotreeRoot.eachBefore(function (node) {
        node.x = parseFloat(((node.x + tx) * kx).toFixed(1));
        node.y = parseFloat((node.y * ky).toFixed(1)) + marginTop;
        node.data.width *= ky;
        node.data.labelWidth *= ky;
      });

    }

    return pointPhylotreeRoot;
  }

  function setNodeInfo(node: PartialNodeInfo | undefined) {
    let newNode;
    if (node) {
      newNode = {
        r: (node.r != undefined) ? node.r : defaultNodeR,
        fill: (node.fill != undefined) ? node.fill : defaultNodeFill,
        strokeWidth: (node.strokeWidth != undefined) ? node.strokeWidth : defaultNodeStrokeWidth
      }
    }
    else {
      newNode = {
        r: defaultNodeR,
        fill: defaultNodeFill,
        strokeWidth: defaultNodeStrokeWidth
      }
    }
    return newNode;
  }

  function setLinkInfo(link: PartialLinkInfo | undefined) {
    let newLink;
    if (link) {
      newLink = {
        strokeColor: (link.strokeColor != undefined) ? link.strokeColor : defaultLinkColor,
        strokeWidth: (link.strokeWidth != undefined) ? link.strokeWidth : defaultLinkWidth
      }
    }
    else {
      newLink = {
        strokeColor: defaultLinkColor,
        strokeWidth: defaultLinkWidth
      }
    }
    return newLink;
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

  phylogram.separation = function (
    separationCb: (a: HierarchyPointNode<PhyloTreeNode>, b: HierarchyPointNode<PhyloTreeNode>) => number
  ) {
    separation = separationCb;
  }




  return phylogram;
}



