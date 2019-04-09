import { select, Selection } from "d3-selection"

import GeneComponent from "./sequence/gene";
import GenomeAxis from "./sequence/genome-axis";
import GlobalGenomeAxis from "./sequence/genome-axis-with-selection";
import { drag } from "d3-drag";

//types
import { GenomeBrowserData } from "../types";



export default function () {
  const genomeAxis = GenomeAxis();
  const geneComponent = GeneComponent();
  const globalGenomeAxisComponent = GlobalGenomeAxis();

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


      genomeBrowserE.append("g").classed("chromosome-axis", true);
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
        .select<SVGElement>("g.chromosome-axis")
        .datum(({ axis: { global } }) => global)
        .call(globalGenomeAxisComponent, width, 0);

      genomesBrowserU
        .select<SVGElement>("g.axis")
        .datum(({ axis: { chromosome } }) => chromosome)
        .call(genomeAxis, width, 70);

      genomesBrowserU
        .select<SVGElement>(".genes")
        .attr("transform", "translate(0, 80)")
        .datum(({ chromosome: { genes } }) => genes)
        .call(geneComponent, genomeAxis.scale(), 40)


    });
  }
  return genomeBrowser;
}

