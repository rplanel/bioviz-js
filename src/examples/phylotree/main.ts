import PhylogramLayout from "../../scripts/layout/phylogram";
import CladogramLayout from "../../scripts/layout/cladogram";
import { RawPhyloTreeNode, PhyloTreeNode } from "../../scripts/types";
import { select } from "d3-selection";
import Phylotree from "../../scripts/component/tree/phylotree";
import { cluster, hierarchy, HierarchyNode } from "d3-hierarchy";
import { defaultSeparation } from "../../scripts/layout/phylotree";

const phylotreeComponent = Phylotree();
const data: RawPhyloTreeNode = {
  "name": "Root",
  branchLength: 0,
  nodes: { r: 10 },
  "children": [
    {
      "name": "Level-1-0",
      branchLength: 0.9,
      nodes: {
        fill: "blue"
      }
    },
    {
      "name": "Level-1-1",
      branchLength: 0.4,
      nodes: {
        r: 8,
        fill: "red"
      },
      "children": [
        {
          "name": "Level-2-0",
          branchLength: 1.2
        },
        {
          "name": "Level-2-1",
          branchLength: 1.8,
          nodes: {
            fill: "darkgreen",
            r: 5
          }
        }
      ]
    }
  ]
};
const marginLeft =
  (data.nodes && data.nodes.r)
    ? data.nodes.r
    : 4;
const width = 1000;
const height = 200;
const size: [number, number] = [height, width - marginLeft];


const isPhylogram = true;
const phylotreeData = (isPhylogram)
  ? PhylogramLayout()
  // .nodeSize([40, width - marginLeft])
  .size(size)(data)
  : cluster()
    .separation(defaultSeparation)
    .size(size)(hierarchy(data))



select("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g")
  .attr("transform", `translate(${marginLeft},0)`)
  .datum([phylotreeData])
  .call(phylotreeComponent);

