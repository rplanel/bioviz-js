import { GeneData, PositionedGeneData } from "../types";
import { extent } from "d3-array";
import { ScaleLinear } from "d3-scale";

export default function linearGene(
  data: Array<GeneData>,
  xScale: ScaleLinear<number, number>,
  yPosition: number = 20
) {
  return data.reduce(function (
    accum: PositionedGeneData[],
    gene: GeneData
  ) {
    const x = xScale(gene.begin);
    const width = xScale(gene.end) - x;
    accum.push({
      ...gene,
      position: {
        x,
        y: yPosition,
        width
      }
    });
    return accum;
  }, []);

}