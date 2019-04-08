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
        .selectAll<SVGGElement, GenomeBrowserData>("g.genome-browser")
        .data(_data);

      //ENTER
      const genomeBrowerE = genomeBrowser
        .enter()
        .append<SVGGElement>("g")
        .classed("genome-browser", true);

      genomeBrowerE.append("rect")
        .classed("genome-browser-background", true)
        .style("fill-opacity", 0);


      genomeBrowerE.append("g").classed("axis", true);
      genomeBrowerE.append("g").classed("genes", true);

      //EXIT
      genomeBrowser.exit().remove();

      //UPDATE
      const genomesBrowserU = genomeBrowser.merge(genomeBrowerE);
      genomesBrowserU
        .select<SVGRectElement>("rect.genome-browser-background")
        .attr("width", width)
        .attr("height", height)
        .call(
          drag<SVGRectElement, GenomeBrowserData>()
            .on("start", d => {
              if (d.eventHandler) {
                console.log(this);
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