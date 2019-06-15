import { select, Selection } from "d3-selection";
import { HierarchyPointNode } from "d3-hierarchy";
import { PhyloTreeNode } from "../../../types";


export default function () {
  function genericNode(
    _selection: Selection<SVGGElement, HierarchyPointNode<PhyloTreeNode>[], any, any>
  ) {
    const defaultR = 4;
    const defaultFill = "#000";
    const classes = {
      node: "generic-node",
      label: "label"
    }

    _selection.each(function (_data) {

      const node = select(this)
        .selectAll<SVGGElement, HierarchyPointNode<PhyloTreeNode>>("g." + classes.node)
        .data(_data);

      const nodeE = node
        .enter()
        .append("g")
        .classed(classes.node, true)

      // circle 
      nodeE.append<SVGCircleElement>("circle")
        .attr("r",
          ({ data: { nodes } }) => (nodes && nodes.r) ? nodes.r : defaultR
        )
        .attr("fill",
          ({ data: { nodes } }) => (nodes && nodes.fill) ? nodes.fill : defaultFill
        )
        .attr(
          "stroke-width",
          ({ data: { nodes } }) => (nodes && nodes.strokeWidth) ? nodes.strokeWidth : 10
        )
      // text
      nodeE.append<SVGTextElement>("text")
        .classed(classes.label, true)
        .attr("dy", "0.31em")
        .attr("font-family","monospace")
        .attr("x", ({ data: { nodes } }) => (nodes && nodes.r) ? (nodes.r) + 2 : defaultR + 2);

      const nodeU = node.merge(nodeE)
        .attr("transform", d => `translate(${d.y}, ${d.x})`)
        .attr("fill-opacity", 1)
        .attr("stroke-opacity", 1);

      nodeU
        .select("." + classes.label)
        .text(d => d.data.name)

        // Create a white background for text
        // to make it better if text appear on
        // tree elements
        .clone(true)
        .lower()
        .attr("stroke-linejoin", "round")
        .attr("stroke-width", 3)
        .attr("stroke", "white");

      const nodeExit = node
        .exit()
        .remove();

    });

  }
  return genericNode
}