import GeneComponent from "./sequence/gene";
import ChromosomeRule from "./rules/chromosome-rule";
import BrushableChromosomeRule from "./rules/brushable-chromosome-rule";
// D3
import { select, Selection } from "d3-selection";
import { drag } from "d3-drag";

//types
import { GeneData, GenomeBrowserData, GenericAxisData, BrushableAxisData } from "../types";



export default function () {
  const selectedChromosomeRule = ChromosomeRule();
  const geneComponent = GeneComponent();
  const wholeChromosomeRule = BrushableChromosomeRule();
  let width = 900;
  let genomesBrowserU: Selection<SVGElement, GenomeBrowserData, SVGElement, any> | null = null;

  function genomeBrowser(
    _selection: Selection<SVGElement, Array<GenomeBrowserData>, HTMLElement, any>,
    w: number,
    height: number
  ) {
    width = w;
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
      genomeBrowserE.append("g").classed("selected-chromosome", true);
      genomeBrowserE.append("g").classed("axis", true);
      genomeBrowserE.append("g").classed("genes", true);

      //EXIT
      genomeBrowser.exit().remove();

      //UPDATE
      genomesBrowserU = genomeBrowser.merge(genomeBrowserE);
      genomesBrowserU
        .select<SVGRectElement>("rect.genome-browser-background")
        .attr("width", width)
        .attr("height", height)
        .call(
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
      genomesBrowserU.each(function (data) {
        const {
          chromosome: { rule: chromosomeRule },
          selectedChromosome: { genes: selectedGenes, rule: selectedChromosomeRule },
          // axis: { chromosome, global }
        } = data;
        updateWholeChromosomeAxis(chromosomeRule);
        updateSelectedChromosome(selectedChromosomeRule, selectedGenes);
      });
    });
  }
  function updateSelectedChromosome(axis: GenericAxisData, genes: GeneData[]) {
    if (genomesBrowserU !== null) {
      genomesBrowserU
        .select<SVGElement>("g.axis")
        .datum(axis)
        .call(selectedChromosomeRule, width, 70);

      genomesBrowserU
        .select<SVGElement>(".genes")
        .attr("transform", "translate(0, 80)")
        .datum(genes)
        .call(geneComponent, selectedChromosomeRule.scale(), 30)
    }
  };

  function updateWholeChromosomeAxis(axis: BrushableAxisData) {
    if (genomesBrowserU) {
      genomesBrowserU
        .select<SVGElement>("g.chromosome-axis")
        .datum(axis)
        .call(wholeChromosomeRule, width, 0);
    }
  }

  genomeBrowser.updateSelectedChromosome = updateSelectedChromosome;
  return genomeBrowser;
}



