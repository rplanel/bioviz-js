import { GeneData } from "./gene";
import { ScaleLinear } from "d3-scale";

export function arrowShape(data: GeneData, xScale: ScaleLinear<number, number>, geneHeight: number) {
    const geneWidth = xScale(data.length);
    return "M 0 0 V " + (-geneHeight) + " H " + geneWidth + " V " + geneHeight + " H " + (-geneWidth) + " Z";
}