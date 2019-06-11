import Phylogram from "../src/scripts/layout/phylogram";
import { RawPhyloTreeNode } from "../src/scripts/types";

describe("Test layout", () => {
  const data: RawPhyloTreeNode = {
    "name": "root",
    branchLength: 0,
    nodes: {
      r: 2,
      fill: "green"
    },
    "children": [
      {
        "name": "child0",
        branchLength: 0.5,
        nodes: {
          fill: "blue"
        }
      },
      {
        "name": "child1",
        branchLength: 0.6,
        nodes: {
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
  const child0 = (pointData.children) ? pointData.children[0] : { y: false };
  const child10 = pointData.leaves().reduce((acc, curr) => {
    return (curr.data.name === "child10") ? curr : acc;
  }, pointData)
  test("Root node middle height", () => {
    expect(pointData.x).toBe(375);
  })

  // Test X
  if (child0) {
    test("Child 0", () => {
      expect(child0.y).toBe(500);
    });
  }

  // Test y
  test("child10", () => {
    expect(child10.y).toBe(width);
  })

  //test nodes object
  test("root", () => {
    const nodes = pointData.data.nodes;
    if (nodes) {
      expect(nodes.r).toBe(2);
    }
  })

  // Change how define size
  test("nodeSize", () => {
    const xStep = 50;
    const newData = phylogramLayout.nodeSize([xStep, 100])(data);
    let yExpected = 0;
    newData.leaves().forEach(leaf => {
      expect(leaf.x).toBe(yExpected);
      yExpected += xStep;
    });
  });

})