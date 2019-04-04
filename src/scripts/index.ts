import GeneComponent, { GeneData } from "./component/sequence/gene";
import GenomeAxis from "./component/sequence/genome-axis";
import { select } from "d3-selection";
import { drag } from "d3-drag";

const width = 1500;
let genomeWindowSize = 6000;
let centerWindow = 23000;
const geneComponent = GeneComponent();
const genomeAxis = GenomeAxis();
const clickHandler = ([begin, end]: [number, number]) => {
    centerWindow = (end + begin) / 2;
    draw();
};
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


draw();



select("#zoom-in").on("click", function () {
    genomeWindowSize -= 1000;
    draw()
});
select("#zoom-out").on("click", function () {
    genomeWindowSize += 1000;
    draw()
});

/*
    FUNCTIONS
*/
function draw() {
    const svg = select<SVGSVGElement, any>("svg").attr("width", width + 1).attr("height", 900);
    const genomeAxisElem = svg.select<SVGElement>("#axis");
    const geneElem = svg.select<SVGElement>("#genes");
    genomeAxisElem
        .datum(getGenomeWindow(centerWindow, genomeWindowSize))
        .call(genomeAxis, width, 0);
    geneElem
        .datum<Array<GeneData>>(genes)
        .call(geneComponent, genomeAxis.scale(), 40);
}

function getGenomeWindow(middle: number, genomeWindowSize: number): [number, number] {
    const halfWindow = genomeWindowSize / 2;
    return [middle - halfWindow, middle + halfWindow]

}

