import { GeneData } from "./component/sequence/gene";
import { select, event } from "d3-selection";
import { scaleLinear } from "d3-scale";
import GenomeBrowser, { GenomeBrowserData } from "./component/genome-browser";

const width = 1500;
const height = 300;
const genomeBrowserComponent = GenomeBrowser();
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
    end: 21399,
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
    end: 25207,
    gene: "ileS"
  }
];

const genomeBrowserData: GenomeBrowserData[] = [{
  width: 1500,
  genomeWindow: {
    center: 23000,
    size: 6000
  },
  currentMousePosition: 0,
  genes: geneData,
  x: 0,
  y: 0
}];

draw();



select("#zoom-in").on("click", function () {
  genomeBrowserData[0].genomeWindow.size -= 1000;
  draw()
});
select("#zoom-out").on("click", function () {
  genomeBrowserData[0].genomeWindow.size += 1000;
  draw()
});

/*
    FUNCTIONS
*/
function draw() {
  // 
  const computedGenomeBrowserData: GenomeBrowserData[] = genomeBrowserData
    .map(function (genomesBrowser, i) {
      const { width, genomeWindow: { center, size }, genes } = genomesBrowser;
      const genomeWindowBoundaries = getGenomeWindow(center, size);
      const xScale = scaleLinear()
        .domain(genomeWindowBoundaries)
        .range([0, width]);
      // Construct clickHandler function that depends of the current window.
      const clickHandler = function ([begin, end]: [number, number]) {
        genomesBrowser.genomeWindow.center = (end + begin) / 2;
        draw();
      };

      // Filter genes in order to display those visible
      const visibleGenes = genes.filter(
        gene => gene.end > genomeWindowBoundaries[0] || gene.begin < genomeWindowBoundaries[1]
      );


      const dragStartCallback = function (elem: SVGElement) {
        select(elem).classed("active", true);
        genomesBrowser.currentMousePosition = xScale
          .invert(event.x);
      }

      const draggedCallback = function () {
        const mousePosition = xScale
          .invert(event.x);

        const diff = genomesBrowser.currentMousePosition - mousePosition;
        genomesBrowser.currentMousePosition = mousePosition;
        genomeBrowserData[i].genomeWindow.center += diff;
        draw();
      };
      const dragendedCallback = function (elem: SVGElement) {
        select(elem).classed("active", false);
      }

      const newGenomeBrowser = {
        ...genomesBrowser,
        genes: visibleGenes.map(function (gene) {
          gene.eventHandler = {
            click: clickHandler
          };
          return gene;
        }),
        scale: xScale,
        eventHandler: {
          dragged: draggedCallback,
          dragstarted: dragStartCallback,
          dragended: dragendedCallback
        }
      };

      return newGenomeBrowser;

    });
  const svg = select<SVGElement, any>("svg")
    .attr("width", width + 1)
    .attr("height", height);

  svg
    .datum(computedGenomeBrowserData)
    .call(genomeBrowserComponent, width, height);

}
function getGenomeWindow(center: number, genomeWindowSize: number): [number, number] {
  const halfWindow = genomeWindowSize / 2;
  return [center - halfWindow, center + halfWindow]

}


