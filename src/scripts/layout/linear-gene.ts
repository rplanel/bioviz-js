import { GeneData, PositionedGeneData } from "../component/sequence/gene";
import { scaleLinear } from "d3-scale";

export default function linearGene(
  data: Array<GeneData>,
  width: number,
  geneOffset: number
) {
  const sumLength = data.reduce((accum, gene) => accum + gene.length, 0);
  const sumGeneOffset = (data.length - 1) * geneOffset;
  const xScale = scaleLinear().domain([0, sumLength - sumGeneOffset]).range([0, width])

  return data.reduce(function (
    accum: PositionedGeneData[],
    gene: GeneData,
    i: number,
    data: GeneData[]
  ) {
    if (i > 0) {
      const previousGene = accum[i - 1];
      accum.push({
        ...gene,
        position: {
          x: previousGene.position.x + previousGene.position.width + geneOffset,
          y: 0,
          width: xScale(gene.length)
        }
      });
      return accum;

    }
    else {
      accum.push({
        ...gene,
        position: {
          x: 0,
          y: 0,
          width: xScale(gene.length)
        }
      });
      return accum;

    }

  }, []);

}