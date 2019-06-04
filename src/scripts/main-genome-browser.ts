import { GeneData, GenomeBrowserData, State } from "./types";
import { select, event, BaseEvent, ClientPointEvent } from "d3-selection";
import { scaleOrdinal } from "d3-scale";
import GenomeBrowser from "./component/genome-browser";
import { color } from "d3";
import { format as d3Format } from "d3-format";
import { schemeSet1 } from "d3-scale-chromatic";
import genomeBrowserLayout from "./layout/genome-browser";


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


const genomeBrowsers = select<SVGElement, any>("svg")
  .attr("width", width + 1)
  .attr("height", height)
  .append<SVGGElement>("g")
  .classed("genome-browsers", true);

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
    genomeBrowserLayout(state, brushHandler, clickHandler);

  genomeBrowsers
    .datum([computedGenomeBrowserData])
    .call(genomeBrowserComponent, width, height);

}

function clickHandler([begin, end]: [number, number], state: State) {
  const centerGene = (end + begin) / 2;
  const sizeWindow = state.window[1] - state.window[0];
  state.window = [centerGene - sizeWindow / 2, centerGene + sizeWindow / 2];
  draw();
}

function brushHandler(scale: any, state: State) {
  if (!event.sourceEvent) return;
  if (event.selection) {
    const { selection: [x1, x2] } = event;
    const newwindow: [number, number] = [scale.invert(x1), scale.invert(x2)];
    state.window = newwindow;
    genomeBrowserComponent.updateSelectedChromosome(
      genomeBrowserLayout(state, brushHandler, clickHandler)
    );
  }
}


