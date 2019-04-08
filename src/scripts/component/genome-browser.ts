import { select, Selection } from "d3-selection"

import GeneComponent, { GeneData } from "./sequence/gene";
import GenomeAxis from "./sequence/genome-axis";
import { drag } from "d3-drag";



export interface GenomeBrowserData {
  width: number,
  genomeWindow: {
    center: number,
    size: number
  },
  eventHandler?: {
    dragstarted: (elem: SVGElement) => void,
    dragged: () => void,
    dragended: (elem: SVGElement) => void
  },
  currentMousePosition: number,
  genes: GeneData[],
  x: number,
  y: number
}


export default function () {
  const genomeAxis = GenomeAxis();
  const geneComponent = GeneComponent();

  function genomeBrowser(
    _selection: Selection<SVGElement, Array<GenomeBrowserData>, HTMLElement, any>,
    width: number,
    height: number
  ) {
    _selection.each(function (_data: Array<GenomeBrowserData>) {
      const container = select(this);
      const genomeBrowser = container
        .selectAll<SVGElement, GenomeBrowserData>(".genome-browser")
        .data(_data);

      //ENTER
      const genomeBrowserE = genomeBrowser
        .enter()
        .append<SVGElement>("g")
        .classed("genome-browser", true);

      genomeBrowserE.append("rect")
        .classed("genome-browser-background", true);


      genomeBrowserE.append("g").classed("axis", true);
      genomeBrowserE.append("g").classed("genes", true);

      //EXIT
      genomeBrowser.exit().remove();

      //UPDATE
      const genomesBrowserU = genomeBrowser.merge(genomeBrowserE);
      genomesBrowserU
        .select<SVGRectElement>("rect.genome-browser-background")
        .attr("width", width)
        .attr("height", height).call(
          drag<SVGRectElement, GenomeBrowserData>()
            .on("start", (d: GenomeBrowserData) => {

              if (d.eventHandler) {
                d.eventHandler.dragstarted(this);
              }
            })
            .on("drag", d => {
              if (d.eventHandler) {
                d.eventHandler.dragged();
              }
            })
            .on("end", d => {
              if (d.eventHandler) {
                d.eventHandler.dragended(this);
              }
            })
        );
      genomesBrowserU
        .select<SVGElement>("g.axis")
        .datum(({ genomeWindow: { center, size } }): [number, number] => getGenomeWindow(center, size))
        .call(genomeAxis, width, 0);

      genomesBrowserU
        .select<SVGElement>(".genes")
        .datum(({ genes }) => genes)
        .call(geneComponent, genomeAxis.scale(), 40)


    });
  }
  return genomeBrowser;
}


function getGenomeWindow(center: number, genomeWindowSize: number): [number, number] {
  const halfWindow = genomeWindowSize / 2;
  return [center - halfWindow, center + halfWindow]

}