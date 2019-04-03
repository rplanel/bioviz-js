import GeneComponent, { GeneData } from "./component/sequence/gene";
import { select } from "d3-selection";
const genes = [
    { name: "gene 1", strand: "-", begin: 20815, end: 21078, gene: "insA" },
    { name: "gene 2", strand: "+", begin: 21181, end: 21399, gene: "yaaY" },
    { name: "gene 3", strand: "+", begin: 21407, end: 22348, gene: "ribF" },
    { name: "gene 4", strand: "+", begin: 22391, end: 25207, gene: "ileS" }



]

const geneComponent = GeneComponent();


const myGenes = select<SVGGElement, Array<GeneData>>("g#genes");

myGenes.datum(genes).call(geneComponent, 1000, 10, 50);

