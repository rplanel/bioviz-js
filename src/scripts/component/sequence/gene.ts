import { select, Selection } from "d3-selection"
import { scaleLinear } from "d3-scale";
import { arrowShape } from "./gene-shapes";

export interface GeneData {
  name: string,
  length: number,
  strand: number
}

export default function () {
  function gene(_selection: Selection<SVGGElement, Array<GeneData>, SVGElement, any>, width: number = 1000, geneOffset: number = 5, geneHeight: number = 20) {
    _selection.each(function (_data: Array<GeneData>) {
      const sumGeneOffset = (_data.length - 1) * geneOffset;
      const sumLength = _data.reduce((accum, gene) => accum + gene.length, 0);
      const xScale = scaleLinear().domain([0, sumLength - sumGeneOffset]).range([0, width])
      const container = select(this);
      const genes = container.selectAll('.gene').data(_data);

      // ENTER
      const enterGenes = genes.enter().append('g').classed("gene", true);
      enterGenes.append("path");

      // EXIT
      genes.exit().remove()

      // UPDATE
      const updateGenes = genes.merge(enterGenes);
      updateGenes.select("path").attr("d", d => arrowShape(d, xScale, geneHeight))





    })
  }

  return gene;

}



