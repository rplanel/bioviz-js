import linearGene from "../src/scripts/layout/linear-gene";
import { scaleLinear } from "d3-scale";
import { GeneData } from "../src/scripts/types";


describe("Test linear gene layout", () => {
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
    end: 100,
    gene: "yaaY",
  }];
  const xScale = scaleLinear()
    .domain([0, 120])
    .range([0, 1200])
  const linearGeneWithPostion = linearGene(data, xScale);
  describe("Test gene 1", () => {
    const { position: { x, width } } = linearGeneWithPostion[0]
    test("Test x position", () => {
      expect(x).toBe(100);
    });
    test("Test width", () => {
      expect(width).toBe(400);
    })
  });
  describe("Test gene 2", () => {
    const { position: { x, width } } = linearGeneWithPostion[1]
    test("Test x position", () => {
      expect(x).toBe(600);
    })
    test("Test width", () => {
      expect(width).toBe(400);
    })
  });
});