import GeneComponent from "./sequence/gene";
import ChromosomeRule from "./rules/chromosome-rule";
import SelectedChromosome from "./selected-chromosome";
import BrushableChromosomeRule from "./rules/brushable-chromosome-rule";
// D3
import { select, Selection } from "d3-selection";

//types
import { GeneData, GenomeBrowserData, GenericAxisData, BrushableAxisData, SelectedChromosomeData } from "../types";



export default function () {
  const classes = {
    chromosomeRule: "chromosome-rule",
    selectedChromosome: "selected-chromosomes"
  };
  const selectedChromosomeRule = ChromosomeRule();
  const geneComponent = GeneComponent();
  const wholeChromosomeRule = BrushableChromosomeRule();
  const selectedChromosomeComponent = SelectedChromosome();

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

      genomeBrowserE.append("g").classed(classes.chromosomeRule, true);
      genomeBrowserE.append("g")
        .classed(classes.selectedChromosome, true)
        .attr("transform", "translate(0,70)");

      //EXIT
      genomeBrowser.exit().remove();

      //UPDATE
      genomesBrowserU = genomeBrowser.merge(genomeBrowserE);


      genomesBrowserU.each(function (data) {
        const {
          chromosome: { rule: chromosomeRule },
          selectedChromosome: { genes: selectedGenes, rule: selectedChromosomeRule },
          // axis: { chromosome, global }
        } = data;
        updateWholeChromosomeAxis(chromosomeRule);
        updateSelectedChromosome(data);
      });
    });
  }

  function updateSelectedChromosome(data: GenomeBrowserData) {
    if (genomesBrowserU !== null) {
      genomesBrowserU
        .select<SVGElement>("." + classes.selectedChromosome)
        .datum<SelectedChromosomeData[]>([data.selectedChromosome])
        .call(selectedChromosomeComponent, width);
    }
  }

  function updateWholeChromosomeAxis(axis: BrushableAxisData) {
    if (genomesBrowserU) {
      genomesBrowserU
        .select<SVGElement>("." + classes.chromosomeRule)
        .datum(axis)
        .call(wholeChromosomeRule, width, 0);
    }
  }
  genomeBrowser.updateSelectedChromosome = updateSelectedChromosome;
  return genomeBrowser;
}



