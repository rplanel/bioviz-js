import { select, Selection } from "d3-selection"
import { ScaleLinear, scaleLinear } from "d3-scale";
import { arrowShape } from "./gene-shapes";
import linearGene from "../../layout/linear-gene";
import { of } from "rxjs";
import { mergeMap } from "rxjs/operators";

import { GeneData, PositionedGeneData } from "../../types";


export default function () {
  function gene(
    _selection: Selection<SVGElement, Array<GeneData>, SVGElement, any>,
    xScale: ScaleLinear<number, number>,
    geneHeight: number = 30,
    yPosition: number = 60
  ) {
    _selection.each(function (_data: Array<GeneData>) {
      const container = select(this);
      const genes = container
        .selectAll<SVGGElement, PositionedGeneData>('.gene')
        .data(linearGene(_data, xScale, yPosition));

      // ENTER
      const enterGenes = genes
        .enter()
        .append<SVGGElement>('g')
        .classed("gene", true);

      enterGenes.append("path");

      // EXIT
      genes.exit().remove()

      // UPDATE
      const updateGenes = genes.merge(enterGenes);

      // set the positions
      updateGenes.attr("transform", d => "translate(" + d.position.x + "," + d.position.y + ")");
      updateGenes
        .select<SVGPathElement>("path")
        .style("fill", d => d.fill || null)
        .style("fill-opacity", 0.85)
        .style("stroke", d => d.stroke || null)
        .style("stroke-width", '1px')
        .style("stroke-opacity", 0.8)
        .attr(
          "transform",
          ({ strand, position: { width } }) => (strand === "-")
            ? "translate(0," + (geneHeight + 5) + ") translate(" + width + "," + geneHeight + ") rotate(180)"
            : null
        )
        .attr("d", d => arrowShape(d, geneHeight))
        .on("click", d => {
          if (d.eventHandler) {
            return of(d)
              .pipe(mergeMap(d => of<[number, number]>([d.begin, d.end])))
              .subscribe(d.eventHandler.click);
          }
        });
    })
  }
  return gene;

}



