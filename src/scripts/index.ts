// Type 
import * as Types from "./types";
export { default as BrushableChromosomeRuler } from "./component/ruler/brushable-chromosome";
export { default as ChromosomeRuler } from "./component/ruler/chromosome";
// sequences
export * from "./component/sequence/gene-shapes";
export { default as Gene } from "./component/sequence/gene";

// Components
export { default as GenomeBrowser } from "./component/genome-browser";
export { default as Phylotree } from "./component/tree/phylotree";
export { default as GenomeScan } from "./component/qtl/genome-scan";
export { default as QtlCoefficient } from "./component/qtl/qtl-coefficient";
export { default as Haplotype } from "./component/qtl/haplotype";
export { default as Snp } from "./component/qtl/snp";
export { default as Snps } from "./component/qtl/snps";
export { default as SelectedChromosome } from "./component/selected-chromosome";
export { default as BigsdbMap } from "./component/maps/bigsdb";


// layout
export { default as linearGene } from "./layout/linear-gene";
export { default as PhylogramLayout } from "./layout/phylogram";
export { default as CladogramLayout } from "./layout/cladogram";
export { default as genomeBrowserLayout } from "./layout/genome-browser";

export { Types }