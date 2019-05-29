import { arrowShape } from "../src/scripts/component/sequence/gene-shapes";
import { scaleLinear } from "d3-scale";
import { GeneData } from "../src/scripts/types";
import linearGene from "../src/scripts/layout/linear-gene";
import { line } from "d3";



describe("Test gene shapes", () => {
  const data: GeneData[] = [{
    name: "gene 1",
    strand: "-",
    begin: 10,
    end: 50,
    gene: "insA",
  },
  {
    name: "gene 2",
    strand: "+",
    begin: 60,
    end: 90,
    gene: "yaaY",
  },
  {
    name: "gene 3",
    strand: "+",
    begin: 200,
    end: 228,
    gene: "bioB",
  },

  ];

  const pathResults = [
    "M0,0L0,50L190,50L200,25L190,0Z",
    "M0,0L0,50L140,50L150,25L140,0Z",
    "M0,0L0,50L130,50L140,25L130,0Z"

  ];

  const xScale = scaleLinear()
    .domain([0, 250])
    .range([0, 1250]);


  const linearGeneWithPostion = linearGene(data, xScale);
  const testsWithResults = linearGeneWithPostion.map((genePostition, i) => {
    return [arrowShape(genePostition, 50), pathResults[i]];
  })
  testsWithResults.forEach(([res, expected], i) => {
    test("Test Arrow Shape gene " + i, () => {
      expect(res).toBe(expected);
    });
  });
});