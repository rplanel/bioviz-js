import { GeneData, GenomeBrowserData } from "./types";
import { select, event } from "d3-selection";
import { scaleLinear } from "d3-scale";
import GenomeBrowser from "./component/genome-browser";
import { color } from "d3";
import genomeBrowser from "./component/genome-browser";
import { filter } from "rxjs/operators";
import { schemeSet1 } from "d3-scale-chromatic";

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
    end: 25207,
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
const chromosomeSize = 75000;
const genomeBrowserData: GenomeBrowserData[] = [{
  width: 1500,
  genomeWindow: {
    center: 23000,
    size: 6000
  },
  currentMousePosition: 0,
  chromosome: {
    size: chromosomeSize,
    genes: geneData
  },
  axis: {
    global: {
      title: "Genome XXXX (" + chromosomeSize + " bp)",
      interval: [0, chromosomeSize],
      window: [0, 0],

    },
    chromosome: {
      title: "Chromosome X ",
      interval: [0, 0]
    }
  }
}];
const svg = select<SVGElement, any>("svg")
  .attr("width", width + 1)
  .attr("height", height);


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
  const computedGenomeBrowserData: GenomeBrowserData[] = updateGenomeBrowserData(genomeBrowserData);
  svg
    .datum(computedGenomeBrowserData)
    .call(genomeBrowserComponent, width, height);

}

function updateGenomeBrowserData(genomeBrowserData: GenomeBrowserData[]) {
  return genomeBrowserData
    .map(function (genomesBrowser: GenomeBrowserData, i) {
      const { width, genomeWindow: { center, size }, chromosome: { genes } } = genomesBrowser;
      const genomeWindowBoundaries = getChromosomeInterval(center, size);
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
      // Callback when brushed => modify data and redraw the genome + axis
      const brushedCallback = function (scale: any) {
        if (!event.sourceEvent) return;
        if (event.selection) {
          const { selection: [x1, x2] } = event;
          const window = [scale.invert(x1), scale.invert(x2)];
          genomeBrowserData[i].genomeWindow.center = (window[0] + window[1]) / 2;
          genomeBrowserData[i].genomeWindow.size = window[1] - window[0];
          const newData = updateGenomeBrowserData(genomeBrowserData);
          newData.forEach(function (data) {
            genomeBrowserComponent.updateGenome(data.axis.chromosome, data.chromosome.genes);
          })
        }
      };


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
      const globalAxisWindow = getChromosomeInterval(center, size);
      const newGenomeBrowser = {
        ...genomesBrowser,
        chromosome: {
          ...genomesBrowser.chromosome,
          genes: visibleGenes.map(function (gene) {
            // const fillPalette = schemeSet1(gene.strand);
            const fill = gene.strand === "+" ? color("darkred") : color("darkblue");
            const stroke = (fill) ? fill.darker(1).toString() : "lighgray"
            return {
              ...gene,
              eventHandler: {
                click: clickHandler
              },
              fill: (fill) ? fill.toString() : "lightgray",
              stroke
            }
          })
        },
        scale: xScale,
        axis: {
          ...genomesBrowser.axis,
          global: {
            ...genomesBrowser.axis.global,
            window: globalAxisWindow,
            eventHandler: {
              brushed: brushedCallback
            }
          },
          chromosome: {
            ...genomesBrowser.axis.chromosome,
            interval: globalAxisWindow

          }

        },
        eventHandler: {
          dragged: draggedCallback,
          dragstarted: dragStartCallback,
          dragended: dragendedCallback
        }
      };

      return newGenomeBrowser;

    });


}

function getChromosomeInterval(center: number, genomeWindowSize: number): [number, number] {
  const halfWindow = genomeWindowSize / 2;
  return [center - halfWindow, center + halfWindow]

}


