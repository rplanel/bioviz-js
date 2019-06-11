import PhylogramLayout from "../../scripts/layout/phylogram";
import { RawPhyloTreeNode } from "../../scripts/types";
import { select } from "d3-selection";
import Phylotree from "../../scripts/component/tree/phylotree";
const phylotreeComponent = Phylotree();
const data: RawPhyloTreeNode = {
  "name": "Eve",
  branchLength: 0,
  "children": [
    {
      "name": "Cain",
      branchLength: 0.8,
      nodes: {
        fill: "blue"
      }
    },
    {
      "name": "Seth",
      branchLength: 0.6,
      nodes: {
        r: 8,
        fill: "red"
      },
      "children": [
        {
          "name": "Enos",
          branchLength: 0.3
        },
        {
          "name": "Noam",
          branchLength: 0.1
        }
      ]
    }
  ]
};
const width = 900;
const height = 400;
const size: [number, number] = [height - 10, width - 60];
const phylotreeLayout = PhylogramLayout()
  // .nodeSize([50, 200]);
  .size(size);
const phylotreeData = phylotreeLayout(data);


select("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g")
  .attr("transform", 'translate(10,0)')
  .datum([phylotreeData])
  .call(phylotreeComponent);

