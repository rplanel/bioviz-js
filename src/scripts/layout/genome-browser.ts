import { State, GeneData } from "../types";

import { event } from "d3-selection";
import { format as d3Format } from "d3-format";
import { scaleOrdinal } from "d3-scale";
import { color } from "d3";
import { schemeSet1 } from "d3-scale-chromatic";

const geneColor = scaleOrdinal(
  // schemeDark2
  // schemeCategory10
  schemeSet1
);
export default function genomeBrowserData(
  state: State,
  brushHandler: any,
  clickHandler: any
) {
  const {
    window,
    width,
    chromosomeSize,
    genes,
    chromosome: { title: chromosomeTitle },
    selectedChromosome: { title: selectedChromosomeTitle }
  } = state;
  const intervalFormatter = d3Format(".3s");
  const chromInterval: [number, number] = [0, chromosomeSize]
  return {
    width,
    chromosome: {
      size: chromosomeSize,
      genes,
      ruler: {
        title: chromosomeTitle + " (" + chromosomeSize + " bp)",
        interval: chromInterval,
        window,
        maxWindowSize: chromosomeSize,
        eventHandler: {
          brushed: (scale: any) => brushHandler(scale, state)
        }
      }
    },
    selectedChromosome: {
      window,
      genes: state.genes.filter(
        (gene: GeneData) => gene.end > window[0] && gene.begin < window[1]
      ).map(function (gene) {
        const fill = color(geneColor(gene.strand));
        const stroke = (fill) ? fill.darker(1).toString() : "lighgray";
        return {
          ...gene,
          eventHandler: {
            click: (geneLocation: [number, number]) => clickHandler(geneLocation, state)
          },
          fill: (fill) ? fill.toString() : "lightgray",
          stroke
        }
      }),
      ruler: {
        title: selectedChromosomeTitle
          + " [" + intervalFormatter(window[0]) + ", " + intervalFormatter(window[1]) + "]",
        interval: window
      }
    },
  }
}
