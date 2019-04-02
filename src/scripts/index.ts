import GeneComponent, { GeneData } from "./component/sequence/gene";
import { select, Selection } from "d3-selection";
const genes = [
    { name: "gene 1", length: 1000, strand: 1 },
    { name: "gene 2", length: 500, strand: -1 }
]

const geneComponent = GeneComponent();


const myGenes = select<SVGGElement, Array<GeneData>>("g#genes");

myGenes.datum(genes).call(geneComponent, 1000, 5, 10);

