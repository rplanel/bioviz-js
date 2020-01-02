import Phylotree from "../src/scripts/component/tree/phylotree";
import Phylogram from "../src/scripts/layout/phylogram";
import { RawPhyloTreeNode, PhyloTreeNode } from "../src/scripts/types";
import { select } from "d3-selection";
import { HierarchyPointNode } from "d3";

const rootName = "root";
const rootRadius = 2;
const rootFill = "green"
const data: RawPhyloTreeNode = {
  "name": rootName,
  branchLength: 0,
  node: {
    r: rootRadius,
    fill: rootFill
  },
  "children": [
    {
      "name": "child0",
      branchLength: 0.5,
      node: {
        fill: "blue"
      }
    },
    {
      "name": "child1",
      branchLength: 0.6,
      node: {
        r: 8,
        fill: "red"
      },
      "children": [
        {
          "name": "child10",
          branchLength: 0.4
        },
        {
          "name": "child11",
          branchLength: 0.1
        }
      ]
    }
  ]
};
const height = 900;
const width = 1000;
const phylogramLayout = Phylogram().size([height, width]);
const pointData = phylogramLayout(data);
document.body.innerHTML =
  '<div><svg width="500"><g id="container"></g></svg></div>';
const container = select("svg")
  .select<SVGGElement>("g");
const phylotreeComponent = Phylotree()

container
  .datum<HierarchyPointNode<PhyloTreeNode>[]>([pointData]).call(phylotreeComponent);

describe("Test phylotree component", () => {

  const phylogramGroup = container.selectAll(".phylotree");
  const rootNode = container
    .selectAll<SVGGElement, HierarchyPointNode<PhyloTreeNode>>(".phylotree")
    .selectAll<SVGGElement, HierarchyPointNode<PhyloTreeNode>>(".generic-node")
    .filter(d => d.data.name === "root");


  test("Look at root node", () => {

    const node = rootNode.select<SVGTextElement>("text").node();
    if (node) {
      expect(node.textContent).toBe(rootName)
    }
  })


  test("phylogram group", () => {
    expect(phylogramGroup.empty()).toBe(false);
  });

  test("nodes group", () => {
    const nodes = phylogramGroup.select(".nodes");
    expect(nodes.empty()).toBe(false);
    expect(nodes.selectAll(".generic-node").size()).toBe(5);
  });

  test("nodes group", () => {
    const links = phylogramGroup.select(".links");
    expect(links.empty()).toBe(false);
    expect(links.selectAll(".link").size()).toBe(4);
  });


  // Test if nodes attribute are in the svg
  test("Test radius root node", () => {
    expect(parseInt(rootNode.select("circle").attr("r"))).toBe(rootRadius);
  });

  test("Test radius root fill", () => {
    expect(rootNode.select("circle").attr("fill")).toBe(rootFill);
  });
})