import { GeneData, PositionedGeneData } from "./gene";
import { path } from "d3-path";
export function arrowShape(
    data: PositionedGeneData,
    geneHeight: number,
    arrowWidth: number = 20
) {
    const { position: { x, y, width } } = data;
    const genePath = path();
    if (width < arrowWidth) {
        genePath.moveTo(0, 0)
        genePath.moveTo(0, geneHeight)
        genePath.moveTo(width, geneHeight / 2)
        genePath.closePath();
    }
    else {
        genePath.moveTo(0, 0);
        genePath.lineTo(0, geneHeight);
        genePath.lineTo(width - arrowWidth, geneHeight);
        genePath.lineTo(width, geneHeight / 2);
        genePath.lineTo(width - arrowWidth, 0);
        genePath.closePath();
    }
    return genePath.toString();
}