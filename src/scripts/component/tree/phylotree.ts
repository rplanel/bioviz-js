import { PhyloTreeNode } from "../../types";
import { select, Selection } from "d3-selection";
import { HierarchyPointNode } from "d3-hierarchy";
import Node from "./node/generic";
import Link from "./links/rightAngle";

export default function () {
  const nodeComponent = Node();
  const linkComponent = Link();
  function phylogram(
    _selection: Selection<SVGGElement,
      HierarchyPointNode<PhyloTreeNode>[], any, any>
  ) {
    const classes = {
      root: "phylogram",
      nodes: "nodes",
      links: "links"
    };
    _selection.each(function (_data) {

      const phylogram = select(this)
        .selectAll<SVGGElement, HierarchyPointNode<PhyloTreeNode>>("g" + classes.root)
        .data(_data);


      // ENTER
      const phylogramE = phylogram
        .enter()
        .append("g")
        .classed(classes.root, true);

      phylogramE.append("g").classed(classes.links, true)
      phylogramE.append("g").classed(classes.nodes, true)


      // UPDATE
      const phylogramU = phylogram.merge(phylogramE);
      // Nodes
      phylogramU.select<SVGGElement>('.' + classes.nodes)
        .datum(d => d.descendants().reverse())
        .call(nodeComponent);
      // Links
      phylogramU.select<SVGGElement>("." + classes.links)
        .datum(d => {
          return d.links()
        })
        .call(linkComponent);


    })
  }


  return phylogram;
}