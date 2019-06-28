
import PhylogramLayout from "../../scripts/layout/phylogram";
import CladogramLayout from "../../scripts/layout/cladogram";
import { RawPhyloTreeNode, } from "../../scripts/types";
import { select } from "d3-selection";
import Phylotree from "../../scripts/component/tree/phylotree";
import { cluster, hierarchy } from "d3-hierarchy";
import { defaultSeparation } from "../../scripts/layout/phylotree";

// CSS
import '../../styles/phylotree.css';

// Code
const phylotreeComponent = Phylotree();
const data: RawPhyloTreeNode = {
  "name": "",
  branchLength: 0,
  node: { r: 0 },
  "children": [
    {
      "name": "Level-1-0",
      branchLength: 0.9,
      node: {
        fill: "blue"
      }
    },
    {
      "name": "Level-1-1",
      branchLength: 0.4,
      node: {
        r: 8,
        fill: "red"
      },
      link: {
        strokeColor: "black"
      },
      "children": [
        {
          "name": "Level-2-0",
          branchLength: 1.2
        },
        {
          "name": "0123456dddddddddddddddddddddddddd789",
          branchLength: 1.8,
          node: {
            fill: "darkgreen",
            r: 30
          }
        }
      ]
    }
  ]
};
const marginLeft =
  (data.node && data.node.r)
    ? data.node.r
    : 4;
const width = 1000;
const height = 200;
const size: [number, number] = [height, width - marginLeft];


const isPhylogram = true;
const phylotreeData = (isPhylogram)
  ? PhylogramLayout()
    // .nodeSize([40, width - marginLeft])
    .size(size)(data)
  : cluster<RawPhyloTreeNode>()
    .separation(defaultSeparation)
    .size(size)(hierarchy(data))

console.log(phylotreeData)

select("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g")
  .classed("phylotree", true)
  // .attr("transform", `translate(${marginLeft},0)`)
  .datum([phylotreeData])
  .call(phylotreeComponent);

