import GeneComponent, { GeneData } from "./component/sequence/gene";
import GenomeAxis from "./component/sequence/genome-axis";
import { select } from "d3-selection";
import { of } from "rxjs";

const width = 1500;
const genomeWindowSize = 6000;
const geneComponent = GeneComponent();
const genomeAxis = GenomeAxis();
const clickHandler = ([begin, end]: [number, number]) => draw((end + begin) / 2);
const genes: Array<GeneData> = [
    {
        name: "gene 1",
        strand: "-",
        begin: 20815,
        end: 21078,
        gene: "insA",
        eventHandler: {
            click: clickHandler
        }
    },
    {
        name: "gene 2",
        strand: "+",
        begin: 21181,
        end: 21399,
        gene: "yaaY",
        eventHandler: {
            click: clickHandler
        }
    },
    {
        name: "gene 3", strand: "+", begin: 21407, end: 22348, gene: "ribF", eventHandler: {
            click: clickHandler
        }
    },
    {
        name: "gene 4", strand: "+", begin: 22391, end: 25207, gene: "ileS", eventHandler: {
            click: clickHandler
        }
    }
]



function draw(centerGenome: number) {
    const svg = select<SVGSVGElement, any>("svg").attr("width", width + 1).attr("height", 900);
    const genomeAxisElem = svg.select<SVGElement>("#axis");
    const geneElem = svg.select<SVGElement>("#genes");
    genomeAxisElem
        .datum(getGenomeWindow(centerGenome, genomeWindowSize))
        .call(genomeAxis, width, 0);
    geneElem
        .datum<Array<GeneData>>(genes)
        .call(geneComponent, genomeAxis.scale(), 40);
}
draw(23000);
function getGenomeWindow(middle: number, genomeWindowSize: number): [number, number] {
    const halfWindow = genomeWindowSize / 2;
    return [middle - halfWindow, middle + halfWindow]

}