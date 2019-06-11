import { select, Selection } from "d3-selection";
import { HierarchyPointLink } from "d3-hierarchy";
import { PhyloTreeNode } from "../../../types";



export default function () {

  function rightAngle(
    _selection: Selection<SVGGElement, HierarchyPointLink<PhyloTreeNode>[], any, any>
  ) {
    const classes = {
      link: "link"
    };
    _selection.each(function (_data) {
      const links = select(this)
        .selectAll<SVGPathElement, HierarchyPointLink<PhyloTreeNode>>("." + classes.link)
        .data(_data);

      // ENTER
      const linksE = links
        .enter()
        .append<SVGPathElement>("path")
        .classed(classes.link, true);

      // EXIT
      links.exit().remove()

      // UPDATE
      const linksU = links.merge(linksE);

      linksU
      .attr("d", ({ source, target }) => {
        return "M" + target.y + " " + target.x
          + " H" + source.y
          + " V" + source.x;
      })
      .attr("fill", "none")
      .attr("stroke-width", 2)
      .attr("stroke", "black");

    });
  }
  return rightAngle;
}

