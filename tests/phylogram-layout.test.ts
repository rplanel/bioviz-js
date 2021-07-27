/**
 * @jest-environment jsdom
 */

import Phylogram from "../src/scripts/layout/phylogram";
import { RawPhyloTreeNode } from "../src/scripts/types";

describe("Test layout", () => {
  const strokeRootWidth = 4;
  const child10Name = "";
  const data: RawPhyloTreeNode = {
    "name": "root",
    branchLength: 0,
    node: {
      r: 2,
      fill: "green"
    },
    link: {
      strokeWidth: strokeRootWidth
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
        "name": "",
        branchLength: 0.6,
        node: {
          r: 8,
          fill: "red"
        },
        "children": [
          {
            "name": child10Name,
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
    return (curr.data.name === child10Name) ? curr : acc;
  }, pointData)
  test("Root node middle height", () => {
    expect(pointData.x).toBe(375);
  })

  // Test X
  if (child0) {
    test("Child 0", () => {
      expect(child0.y).toBe(500 + strokeRootWidth / 2);
    });
  }

  // Test y
  if (child10) {
    test("child10", () => {
      expect(child10.y).toBe(width);
    })
  }
  //test nodes object
  test("root", () => {
    const nodes = pointData.data.node;
    if (nodes) {
      expect(nodes.r).toBe(2);
    }
  })
  test("root", () => {
    expect(pointData.y).toBe(4);
  })
  // Change how define size
  test("nodeSize", () => {
    const xStep = 50;
    const newData = phylogramLayout.nodeSize([xStep, 100])(data);
    let yExpected = xStep / 2;
    newData.leaves().forEach(leaf => {
      expect(leaf.x).toBe(yExpected);
      yExpected += xStep;
    });
  });

})