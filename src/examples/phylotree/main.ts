import Phylotree from "../../scripts/layout/phylotree";
import { tree, hierarchy, HierarchyPointNode } from "d3-hierarchy";
import { RawPhyloTreeNode, PhyloTreeNode } from "../../scripts/types";
import { select } from "d3-selection";

const treeLayout = tree();
const data: RawPhyloTreeNode = {
  "name": "Eve",
  branchLength: 0,
  "children": [
    {
      "name": "Cain",
      branchLength: 0.8,
    },
    {
      "name": "Seth",
      branchLength: 0.6,
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
const root = hierarchy(data);
const myTree = treeLayout(root);
// myTree.eachBefore(n => console.log("d3 ", n.data.name, ' - ', n.x, ', ', n.y))
// console.log(myTree);
// draw(myTree);
const width = 900;
const height = 400;
const size: [number, number] = [height - 10, width - 50];
const phylotreeLayout = Phylotree()
  // .nodeSize([50, 200]);
  .size(size);
const phylotreeData = phylotreeLayout(data);
draw(phylotreeData);
console.log(phylotreeData.links());


function draw(source: HierarchyPointNode<PhyloTreeNode>) {
  const phylotree = select<SVGElement, any>("svg")
    .attr("width", width)
    .attr("height", height)
    .append<SVGGElement>("g")
    .attr("transform", "translate(" + 10 + ',0)')
    .classed("phylotree", true);


  const node = phylotree
    .selectAll<SVGGElement, HierarchyPointNode<PhyloTreeNode>[]>("g.node")
    .data(source.descendants().reverse());


  // ENTER 
  const nodeE = node
    .enter()
    .append("g")
    .classed("node", true);

  nodeE.append("circle")
    .attr("r", 2.5)
    .attr("fill", d => d.children ? "#555" : "#999")
    .attr("stroke-width", 10);

  nodeE.append("text")
    .attr("dy", "0.31em")
    .attr("x", 6)
    // .attr("x",d => d.children ? -6 : 6)
    // .attr("text-anchor", d => d.children ? "end" : "start")
    .text(d => d.data.name)
    .clone(true).lower()
    .attr("stroke-linejoin", "round")
    .attr("stroke-width", 3)
    .attr("stroke", "white");

  // Update
  const nodeU = node
    .merge(nodeE)
    .attr("transform", d => {
      console.log(d.data.name, '-', d.x);
      return `translate(${d.y},${d.x})`
    })
    .attr("fill-opacity", 1)
    .attr("stroke-opacity", 1);


  // Transition exiting nodes to the parent's new position.
  const nodeExit = node
    .exit()
    .remove();


  // Update the links…
  // const link = gLink.selectAll("path")
  //   .data(links, d => d.target.id);

  // // Enter any new links at the parent's previous position.
  // const linkEnter = link.enter().append("path")
  //   .attr("d", d => {
  //     const o = { x: source.x0, y: source.y0 };
  //     return diagonal({ source: o, target: o });
  //   });

  // // Transition links to their new position.
  // link.merge(linkEnter).transition(transition)
  //   .attr("d", diagonal);

  // // Transition exiting nodes to the parent's new position.
  // link.exit().transition(transition).remove()
  //   .attr("d", d => {
  //     const o = { x: source.x, y: source.y };
  //     return diagonal({ source: o, target: o });
  //   });

}