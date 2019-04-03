import GeneComponent, { GeneData } from "./component/sequence/gene";
import GenomeAxis from "./component/sequence/genome-axis";
import { select } from "d3-selection";

const width = 1500;
const genes: Array<GeneData> = [
    { name: "gene 1", strand: "-", begin: 20815, end: 21078, gene: "insA" },
    { name: "gene 2", strand: "+", begin: 21181, end: 21399, gene: "yaaY" },
    { name: "gene 3", strand: "+", begin: 21407, end: 22348, gene: "ribF" },
    { name: "gene 4", strand: "+", begin: 22391, end: 25207, gene: "ileS" }
]

const geneComponent = GeneComponent();
const genomeAxis = GenomeAxis();
const svg = select<SVGSVGElement, any>("svg").attr("width", width + 100).attr("height", 900);
const genomeAxisElem = svg.select<SVGElement>("#axis");
const geneElem = svg.select<SVGElement>("#genes");

genomeAxisElem
    .datum<[number, number]>([20000, 26000])
    .call(genomeAxis, width, 0);

geneElem
    .datum<Array<GeneData>>(genes)
    .call(geneComponent, genomeAxis.scale(), 40);

