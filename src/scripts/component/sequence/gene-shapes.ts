import { PositionedGeneData} from "../../types";
import { path } from "d3-path";
export function arrowShape(
    data: PositionedGeneData,
    geneHeight: number,
    arrowWidth: number = 10
) {
    const { position: { width } } = data;
    return (width < arrowWidth)
        ? generatePath([[0, geneHeight], [width, geneHeight / 2]])
        : generatePath([[0, geneHeight], [width - arrowWidth, geneHeight], [width, geneHeight / 2], [width - arrowWidth, 0]])
}

function generatePath(linesTo: Array<[number, number]>) {
    const addLineTo = ([x, y]: [number, number]) => genePath.lineTo(x, y);
    const genePath = path();
    genePath.moveTo(0, 0);
    linesTo.forEach(addLineTo);
    genePath.closePath();
    return genePath.toString();
}