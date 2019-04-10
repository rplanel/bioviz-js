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
  eventHandler?: {
    brushed: (scale: ScaleLinear<number, number>) => void
  }
}



export interface GenomeBrowserData {
  width: number,
  genomeWindow: {
    center: number,
    size: number
  },
  currentMousePosition: number,
  chromosome: {
    size: number,
    genes: GeneData[]
  },
  axis: {
    global: BrushableAxisData,
    chromosome: GenericAxisData

  }
  eventHandler?: {
    dragstarted: (elem: SVGElement) => void,
    dragged: () => void,
    dragended: (elem: SVGElement) => void
  }
}
