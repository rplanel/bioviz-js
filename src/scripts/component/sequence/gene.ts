import { select, Selection } from "d3-selection"
import { ScaleLinear, scaleLinear } from "d3-scale";
import { arrowShape } from "./gene-shapes";
import linearGene from "../../layout/linear-gene";
import { of } from "rxjs";
import { mergeMap } from "rxjs/operators";

type Strand = "+" | "-";

export interface GeneData {
  name: string,
  strand: Strand,
  begin: number,
  end: number,
  gene: string
  eventHandler: {
    click: ([begin, end]: [number, number]) => void
  }
}
export interface PositionedGeneData extends GeneData {
  position: {
    x: number,
    y: number,
    width: number
  }
}


export default function () {
  function gene(
    _selection: Selection<SVGElement, Array<GeneData>, HTMLElement, any>,
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
        .style("fill", "lightgrey")
        .attr(
          "transform",
          ({ strand, position: { width } }) => (strand === "-")
            ? "translate(" + width + "," + geneHeight + ") rotate(180)"
            : null
        )
        .attr("d", d => arrowShape(d, geneHeight))
        .on("click", d => of(d).pipe(
          mergeMap(d => of<[number, number]>([d.begin, d.end])
          )
        ).subscribe(d.eventHandler.click)
        );
    })
  }
  return gene;

}



