// D3
import { select, Selection } from "d3-selection";
import { SelectedChromosomeData, GenericAxisData, GeneData } from "../types";
import ChromosomeRule from "./rules/chromosome-rule";
import Gene from "./sequence/gene";
import { drag } from "d3-drag";




export default function () {
  const classes = {
    selectedChromosome: "selected-chromosome",
    rule: "rule",
    genes: "genes"
  };
  const ruleComponent = ChromosomeRule();
  const geneComponent = Gene();

  function selectedChromosome(
    _selection: Selection<SVGElement, SelectedChromosomeData[], SVGElement, any>,
    width: number
  ) {
    _selection.each(function (_data: SelectedChromosomeData[]) {
      const wrapper = select(this);
      const selectedChromosome = wrapper
        .selectAll<SVGElement, SelectedChromosomeData>("." + classes.selectedChromosome)
        .data(_data);

      // ENTER
      const selectedChromosomeEnter = selectedChromosome
        .enter()
        .append<SVGElement>("g")
        .classed(classes.selectedChromosome, true);


      selectedChromosomeEnter.append("rect")
        .classed("genome-browser-background", true);

      selectedChromosomeEnter
        .append("g")
        .classed(classes.rule, true);

      selectedChromosomeEnter
        .append("g")
        .classed(classes.genes, true);

      // EXIT
      selectedChromosome.exit().remove();

      //UPDATE
      const selectedChromosomeUpdate = selectedChromosome
        .merge(selectedChromosomeEnter);


      selectedChromosomeUpdate
        .select<SVGRectElement>("rect.genome-browser-background")
        .attr("width", width)
        .attr("height", 150)
        .call(
          drag<SVGRectElement, SelectedChromosomeData>()
            .on("start", (d: SelectedChromosomeData) => {

              // if (d.eventHandler) {
              //   d.eventHandler.dragstarted(this);
              // }
            })
            .on("drag", d => {
              // if (d.eventHandler) {
              //   d.eventHandler.dragged();
              // }
            })
            .on("end", d => {
              // if (d.eventHandler) {
              //   d.eventHandler.dragended(this);
              // }
            })
        );

      selectedChromosomeUpdate
        .select<SVGGElement>("." + classes.rule)
        .datum<GenericAxisData>(d => d.rule)
        .call(ruleComponent, width, 0)

      selectedChromosomeUpdate
        .select<SVGGElement>("." + classes.genes)
        .datum<GeneData[]>(d => d.genes)
        .call(geneComponent, ruleComponent.scale(), 20, 70);

    });

  }
  return selectedChromosome;

}
