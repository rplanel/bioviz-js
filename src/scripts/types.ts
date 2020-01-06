import { ScaleLinear } from "d3-scale";
export type Strand = "+" | "-";

export interface GeneData {
  eventHandler?: {
    click: ([begin, end]: [number, number]) => void
  },
  name: string,
  strand: Strand,
  begin: number,
  end: number,
  gene: string,
  fill?: string,
  stroke?: string
}
export interface PositionedGeneData extends GeneData {
  position: {
    x: number,
    y: number,
    width: number
  }
}


export interface GenericAxisData {
  title: string,
  interval: [number, number]
}

export interface BrushableAxisData extends GenericAxisData {
  window: [number, number],
  maxWindowSize: number,
  eventHandler?: {
    brushed: (scale: ScaleLinear<number, number>) => void
  }
}

export interface GenomeBrowserState {
  width: number,
  chromosomeSize: number,
  window: [number, number],
  genes: GeneData[],
  chromosome: {
    title: string,
  },
  selectedChromosome: {
    title: string
  }
}


export interface SelectedChromosomeData {
  window: [number, number],
  genes: GeneData[],
  ruler: GenericAxisData
}

export interface GenomeBrowserData {
  width: number,
  //currentMousePosition: number,
  chromosome: {
    size: number,
    genes: GeneData[],
    ruler: BrushableAxisData
  },
  selectedChromosome: SelectedChromosomeData,
  eventHandler?: {
    dragstarted: (elem: SVGElement) => void,
    dragged: () => void,
    dragended: (elem: SVGElement) => void
  }
}


// Phyotree

export interface RawPhyloTreeNode {
  name: string,
  branchLength: number,
  children?: RawPhyloTreeNode[],
  node?: PartialNodeInfo,
  link?: PartialLinkInfo
}

export type PartialNodeInfo = {
  r?: number,
  fill?: string,
  strokeWidth?: number
}

export type PartialLinkInfo = {
  strokeWidth?: number,
  strokeColor?: string
}

export interface PhyloTreeNode {
  name: string;
  branchLength: number;
  lengthFromRoot: number;
  labelWidth: number;
  width: number;
  children?: RawPhyloTreeNode[];
  node: {
    r: number;
    fill: string;
    strokeWidth: number;
  };
  link: {
    strokeWidth: number;
    strokeColor: string;
  };
}

export interface Phylotree {
  marginLeft: number,

}


// Genome Scan

export interface LodScoreOnChromosome {
  marker: string;
  chr: string;
  pos: number;
  lod: number
}

export interface SignificanceThreshold {
  significance: string;
  threshold: number;
}

export interface SignificanceThresholdRaw {
  significance: string;
  threshold: string;
}

export interface GenomeScanData {
  lod_score_on_chromosome: LodScoreOnChromosome[];
  significance_thresholds: SignificanceThreshold[];
}



export type CoefType = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "lod"

export interface PlotCoefData {
  marker: string;
  chr: string;
  pos: number;
  lod: number;
  A: number;
  B: number;
  C: number;
  D: number;
  E: number;
  F: number;
  G: number;
  H: number;
}

export interface HaplotypeData {
  Phenotype: number;
  Haplotype: string;
  Line: string;
}

export interface SnpsData {
  snp_id: string;
  chr: string;
  pos: number;
  lod: number;
}

export interface SnpData {
  line: string;
  phenotype: number;
  genotype: string;
  strains: string;
}