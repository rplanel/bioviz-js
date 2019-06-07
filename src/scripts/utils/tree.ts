import { HierarchyPointNode } from "d3-hierarchy";
import { PhyloTreeNode } from "../types";


export function getLeftNode(node: HierarchyPointNode<PhyloTreeNode>): HierarchyPointNode<PhyloTreeNode> {
  return node.leaves().reduce((acc, curr) => {
    return acc.x < curr.x ? acc : curr;
  }, node);
}

export function getRightNode(node: HierarchyPointNode<PhyloTreeNode>): HierarchyPointNode<PhyloTreeNode> {
  return node.leaves().reduce((acc, curr) => {
    return acc.x > curr.x ? acc : curr;
  }, node);
}

export function getDeepestNode(node: HierarchyPointNode<PhyloTreeNode>): HierarchyPointNode<PhyloTreeNode> {
  return node.leaves().reduce((acc, curr) => {
    return acc.data.lengthFromRoot > curr.data.lengthFromRoot ? acc : curr;
  }, node);
}