import { GeneData, GenomeBrowserData, State } from "./types";
import { select, event } from "d3-selection";
import { scaleOrdinal } from "d3-scale";
import GenomeBrowser from "./component/genome-browser";
import { color } from "d3";
import { format as d3Format } from "d3-format";
import { schemeSet1, schemeDark2, schemeCategory10 } from "d3-scale-chromatic";

const width = 1500;
const height = 300;
const genomeBrowserComponent = GenomeBrowser();
const geneColor = scaleOrdinal(
  // schemeDark2
  // schemeCategory10
  schemeSet1
);

const geneData: GeneData[] = [
  {
    name: "gene 1",
    strand: "-",
    begin: 20815,
    end: 21078,
    gene: "insA",
  },
  {
    name: "gene 2",
    strand: "+",
    begin: 21181,
    end: 21400,
    gene: "yaaY",
  },
  {
    name: "gene 3",
    strand: "+",
    begin: 21407,
    end: 22348,
    gene: "ribF"
  },
  {
    name: "gene 4",
    strand: "+",
    begin: 22391,
    end: 23207,
    gene: "ileS"
  },
  {
    name: "gene 4",
    strand: "+",
    begin: 23391,
    end: 24207,
    gene: "ileS"
  },
  {
    name: "gene 4",
    strand: "-",
    begin: 25304,
    end: 25956,
    gene: "foo"
  },
  {
    name: "gene 4",
    strand: "+",
    begin: 26004,
    end: 26329,
    gene: "foo"
  },
  {
    name: "gene 4",
    strand: "+",
    begin: 29004,
    end: 29429,
    gene: "foo"
  },

];


const state: State = {
  width: 1500,
  chromosomeSize: 75000,
  window: [20000, 26000],
  genes: geneData,
  chromosome: {
    title: "Genome XXXX",
  },
  selectedChromosome: {
    title: "Chromosome X"
  }
}


const svg = select<SVGElement, any>("svg")
  .attr("width", width + 1)
  .attr("height", height);

draw();

select("#zoom-in").on("click", function () {
  const [start, end] = state.window;
  state.window = [start + 500, end - 500];
  draw()
});
select("#zoom-out").on("click", function () {
  const [start, end] = state.window;
  state.window = [start - 500, end + 500];
  draw()
});

/*
    FUNCTIONS
*/
function draw() {
  // 
  const computedGenomeBrowserData: GenomeBrowserData =
    getGenomeBrowserData(state);
  svg
    .datum([computedGenomeBrowserData])
    .call(genomeBrowserComponent, width, height);

}

function getGenomeBrowserData(state: State) {
  const {
    window,
    width,
    chromosomeSize,
    genes,
    chromosome: { title: chromosomeTitle },
    selectedChromosome: { title: selectedChromosomeTitle }
  } = state;
  const intervalFormatter = d3Format(".3s");
  // Callback when brushed => modify data and redraw the genome + axis
  const brushedCallback = function (scale: any) {
    if (!event.sourceEvent) return;
    if (event.selection) {
      const { selection: [x1, x2] } = event;
      const newwindow: [number, number] = [scale.invert(x1), scale.invert(x2)];
      state.window = newwindow;
      genomeBrowserComponent.updateSelectedChromosome(
        getGenomeBrowserData(state)
      );
    }
  };
  const clickHandler = function ([begin, end]: [number, number]) {
    const centerGene = (end + begin) / 2;
    const sizeWindow = window[1] - window[0];
    state.window = [centerGene - sizeWindow / 2, centerGene + sizeWindow / 2];
    draw();
  };

  const chromInterval: [number, number] = [0, chromosomeSize]
  return {
    width,
    chromosome: {
      size: chromosomeSize,
      genes,
      rule: {
        title: chromosomeTitle + " (" + chromosomeSize + " bp)",
        interval: chromInterval,
        window,
        eventHandler: {
          brushed: brushedCallback
        }
      }
    },
    selectedChromosome: {
      window,
      genes: genes.filter(
        (gene: GeneData) => gene.end > window[0] && gene.begin < window[1]
      ).map(function (gene) {
        const fill = color(geneColor(gene.strand));
        const stroke = (fill) ? fill.darker(1).toString() : "lighgray";
        return {
          ...gene,
          eventHandler: {
            click: clickHandler
          },
          fill: (fill) ? fill.toString() : "lightgray",
          stroke
        }
      }),
      rule: {
        title: selectedChromosomeTitle
          + " [" + intervalFormatter(window[0]) + ", " + intervalFormatter(window[1]) + "]",
        interval: window
      }
    },
  }
}

