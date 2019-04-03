import { GeneData, PositionedGeneData } from "../component/sequence/gene";
import { scaleLinear } from "d3-scale";
import { extent } from "d3-array";

export default function linearGene(
  data: Array<GeneData>,
  width: number,
  geneOffset: number
) {
  const sequenceInterval = extent(data.reduce(
    (accum, gene) => [...accum, gene.begin, gene.end],
    [] as Array<number>
  ));
  
  const xScale = scaleLinear()
    .domain([sequenceInterval[0] || 0, sequenceInterval[1] || 0])
    .range([0, width])

  return data.reduce(function (
    accum: PositionedGeneData[],
    gene: GeneData,
    i: number,
    data: GeneData[]
  ) {
    const x = xScale(gene.begin);
    const width = xScale(gene.end) - x;
    accum.push({
      ...gene,
      position: {
        x,
        y: 0,
        width
      }
    });
    return accum;
  }, []);

}