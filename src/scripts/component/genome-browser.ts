import SelectedChromosome from "./selected-chromosome";
import BrushableChromosomeRule from "./ruler/brushable-chromosome";
// D3
import { select, Selection } from "d3-selection";

//types
import { GenomeBrowserData, BrushableAxisData, SelectedChromosomeData } from "../types";



export default function () {
  const classes = {
    perDataRootContainer: "genome-browser",
    chromosomeRuler: "chromosome-ruler",
    selectedChromosome: "selected-chromosomes"
  };
  const wholeChromosomeRule = BrushableChromosomeRule();
  const selectedChromosomeComponent = SelectedChromosome();

  let width = 900;
  let genomesBrowserU: Selection<SVGGElement, GenomeBrowserData, SVGElement, any> | null = null;


  function genomeBrowser(
    _selection: Selection<SVGGElement, Array<GenomeBrowserData>, HTMLElement, any>
  ) {
    _selection.each(function (_data: Array<GenomeBrowserData>) {
      const container = select(this);
      const genomeBrowser = container
        .selectAll<SVGGElement, GenomeBrowserData>("." + classes.perDataRootContainer)
        .data(_data);

      //ENTER
      const genomeBrowserE = genomeBrowser
        .enter()
        .append<SVGGElement>("g")
        .classed(classes.perDataRootContainer, true);

      genomeBrowserE.append("g").classed(classes.chromosomeRuler, true);
      genomeBrowserE.append("g")
        .classed(classes.selectedChromosome, true)
        .attr("transform", "translate(0,70)");

      //EXIT
      genomeBrowser.exit().remove();

      //UPDATE
      genomesBrowserU = genomeBrowser.merge(genomeBrowserE);

      genomesBrowserU.each(function (data) {
        const { chromosome: { ruler: chromosomeRule }, selectedChromosome } = data;
        updateWholeChromosomeAxis(chromosomeRule);
        updateSelectedChromosome(selectedChromosome);
      });
    });
  }

  function updateSelectedChromosome(data: SelectedChromosomeData) {
    if (genomesBrowserU !== null) {
      genomesBrowserU
        .select<SVGGElement>("." + classes.selectedChromosome)
        .datum<SelectedChromosomeData[]>([data])
        .call(selectedChromosomeComponent, width);
    }
  }

  function updateWholeChromosomeAxis(axis: BrushableAxisData) {
    if (genomesBrowserU) {
      genomesBrowserU
        .select<SVGGElement>("." + classes.chromosomeRuler)
        .datum(axis)
        .call(wholeChromosomeRule, width, 0);
    }
  }
  genomeBrowser.updateSelectedChromosome = updateSelectedChromosome;
  genomeBrowser.updateWholeChromosomeAxis = updateWholeChromosomeAxis;
  return genomeBrowser;
}



