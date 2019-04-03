import { select, Selection } from "d3-selection"
import { scaleLinear } from "d3-scale";
import { arrowShape } from "./gene-shapes";
import linearGene from "../../layout/linear-gene";


type Strand = "+" | "-";

export interface GeneData {
  name: string,
  length: number,
  strand: Strand,
  begin: number,
  end: number,
  gene: string
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
    _selection: Selection<SVGGElement, Array<GeneData>, HTMLElement, any>,
    width: number = 1000,
    geneOffset: number = 5,
    geneHeight: number = 20
  ) {
    _selection.each(function (_data: Array<GeneData>) {
      const container = select(this);
      const genes = container
        .selectAll<SVGGElement, PositionedGeneData>('.gene')
        .data(linearGene(_data, width, geneOffset));

      // ENTER
      const enterGenes = genes.enter().append('g').classed("gene", true);

      enterGenes.append("path");
      // EXIT
      genes.exit().remove()

      // UPDATE
      const updateGenes = genes.merge(enterGenes);

      // set the positions
      updateGenes.attr("transform", d => "translate(" + d.position.x + ",0)");
      updateGenes
        .select("path")
        .style("fill", "lightgrey")
        .attr(
          "transform",
          ({ strand, position: { width } }) => (strand === "-")
            ? "translate(" + width + "," + geneHeight + ") rotate(180)"
            : null
        )
        .attr("d", d => arrowShape(d, geneHeight))




    })
  }

  return gene;

}



