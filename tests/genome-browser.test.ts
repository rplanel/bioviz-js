import GenomeBrowser from "../src/scripts/component/genome-browser";
import genomeBrowserDataLayout from "../src/scripts/layout/genome-browser";
import { GenomeBrowserData, GeneData, GenomeBrowserState } from "../src/scripts/types";
import { select } from "d3-selection";

describe("Test Genome Browser", () => {
  const result = '<g class="genome-browser"><g class="chromosome-ruler" transform="translate(0,0)"><g class="whole-chromosome-ruler"><g class="generic-ruler" transform="translate(0,0)"><g class="genome-axis"><g class="title"><text style="fill: black; font-family: monospace;" transform="translate(574,20)">chromosome ruler title (300 bp)</text></g><g class="axis-elems" transform="translate(0, 50)" fill="none" font-size="10" font-family="sans-serif" text-anchor="middle"><path class="domain" stroke="currentColor" d="M0.5,-6V0.5H900.5V-6"></path><g class="tick" opacity="1" transform="translate(0.5,0)"><line stroke="currentColor" y2="-6"></line><text fill="currentColor" y="-9" dy="0em">0.00</text></g><g class="tick" opacity="1" transform="translate(60.5,0)"><line stroke="currentColor" y2="-6"></line><text fill="currentColor" y="-9" dy="0em">20.0</text></g><g class="tick" opacity="1" transform="translate(120.5,0)"><line stroke="currentColor" y2="-6"></line><text fill="currentColor" y="-9" dy="0em">40.0</text></g><g class="tick" opacity="1" transform="translate(180.5,0)"><line stroke="currentColor" y2="-6"></line><text fill="currentColor" y="-9" dy="0em">60.0</text></g><g class="tick" opacity="1" transform="translate(240.5,0)"><line stroke="currentColor" y2="-6"></line><text fill="currentColor" y="-9" dy="0em">80.0</text></g><g class="tick" opacity="1" transform="translate(300.5,0)"><line stroke="currentColor" y2="-6"></line><text fill="currentColor" y="-9" dy="0em">100</text></g><g class="tick" opacity="1" transform="translate(360.5,0)"><line stroke="currentColor" y2="-6"></line><text fill="currentColor" y="-9" dy="0em">120</text></g><g class="tick" opacity="1" transform="translate(420.5,0)"><line stroke="currentColor" y2="-6"></line><text fill="currentColor" y="-9" dy="0em">140</text></g><g class="tick" opacity="1" transform="translate(480.5,0)"><line stroke="currentColor" y2="-6"></line><text fill="currentColor" y="-9" dy="0em">160</text></g><g class="tick" opacity="1" transform="translate(540.5,0)"><line stroke="currentColor" y2="-6"></line><text fill="currentColor" y="-9" dy="0em">180</text></g><g class="tick" opacity="1" transform="translate(600.5,0)"><line stroke="currentColor" y2="-6"></line><text fill="currentColor" y="-9" dy="0em">200</text></g><g class="tick" opacity="1" transform="translate(660.5,0)"><line stroke="currentColor" y2="-6"></line><text fill="currentColor" y="-9" dy="0em">220</text></g><g class="tick" opacity="1" transform="translate(720.5,0)"><line stroke="currentColor" y2="-6"></line><text fill="currentColor" y="-9" dy="0em">240</text></g><g class="tick" opacity="1" transform="translate(780.5,0)"><line stroke="currentColor" y2="-6"></line><text fill="currentColor" y="-9" dy="0em">260</text></g><g class="tick" opacity="1" transform="translate(840.5,0)"><line stroke="currentColor" y2="-6"></line><text fill="currentColor" y="-9" dy="0em">280</text></g><g class="tick" opacity="1" transform="translate(900.5,0)"><line stroke="currentColor" y2="-6"></line><text fill="currentColor" y="-9" dy="0em">300</text></g></g></g></g><g transform="translate(0,25)"><g class="brush-selection" fill="none" pointer-events="all"><rect class="overlay" pointer-events="all" cursor="crosshair" x="0" y="0" width="900" height="50"></rect><rect class="selection" cursor="move" fill="#777" fill-opacity="0.3" stroke="#fff" shape-rendering="crispEdges" style="" x="75" y="0" width="285" height="50"></rect><rect class="handle handle--e" cursor="ew-resize" style="" x="357" y="-3" width="6" height="56"></rect><rect class="handle handle--w" cursor="ew-resize" style="" x="72" y="-3" width="6" height="56"></rect></g><g style="font-size: 9;" class="brush-selection-boundaries"><text class="start" style="text-anchor: end;" transform="translate(75,60)">25.0</text><text class="end" transform="translate(360,60)" style="text-anchor: start;">120</text></g></g></g></g><g class="selected-chromosomes" transform="translate(0,70)"><g class="selected-chromosome"><rect class="genome-browser-background" width="900" height="150"></rect><g class="chromosome-ruler" transform="translate(0,0)"><g class="genome-axis"><g class="title"><text style="fill: black; font-family: monospace;" transform="translate(538,20)">Chromosome [25.0, 120]</text></g><g class="axis-elems" transform="translate(0, 50)" fill="none" font-size="10" font-family="sans-serif" text-anchor="middle"><path class="domain" stroke="currentColor" d="M0.5,-6V0.5H900.5V-6"></path><g class="tick" opacity="1" transform="translate(47.868421052631575,0)"><line stroke="currentColor" y2="-6"></line><text fill="currentColor" y="-9" dy="0em">30.0</text></g><g class="tick" opacity="1" transform="translate(142.60526315789474,0)"><line stroke="currentColor" y2="-6"></line><text fill="currentColor" y="-9" dy="0em">40.0</text></g><g class="tick" opacity="1" transform="translate(237.3421052631579,0)"><line stroke="currentColor" y2="-6"></line><text fill="currentColor" y="-9" dy="0em">50.0</text></g><g class="tick" opacity="1" transform="translate(332.07894736842104,0)"><line stroke="currentColor" y2="-6"></line><text fill="currentColor" y="-9" dy="0em">60.0</text></g><g class="tick" opacity="1" transform="translate(426.81578947368416,0)"><line stroke="currentColor" y2="-6"></line><text fill="currentColor" y="-9" dy="0em">70.0</text></g><g class="tick" opacity="1" transform="translate(521.5526315789474,0)"><line stroke="currentColor" y2="-6"></line><text fill="currentColor" y="-9" dy="0em">80.0</text></g><g class="tick" opacity="1" transform="translate(616.2894736842105,0)"><line stroke="currentColor" y2="-6"></line><text fill="currentColor" y="-9" dy="0em">90.0</text></g><g class="tick" opacity="1" transform="translate(711.0263157894736,0)"><line stroke="currentColor" y2="-6"></line><text fill="currentColor" y="-9" dy="0em">100</text></g><g class="tick" opacity="1" transform="translate(805.7631578947369,0)"><line stroke="currentColor" y2="-6"></line><text fill="currentColor" y="-9" dy="0em">110</text></g><g class="tick" opacity="1" transform="translate(900.5,0)"><line stroke="currentColor" y2="-6"></line><text fill="currentColor" y="-9" dy="0em">120</text></g></g></g></g><g class="genes"><g class="gene" transform="translate(-142.10526315789474,70)"><path style="fill: rgb(228, 26, 28); fill-opacity: 0.85; stroke: rgb(160, 18, 20); stroke-width: 1px; stroke-opacity: 0.8;" transform="translate(0,25) translate(378.9473684210526,20) rotate(180)" d="M0,0L0,20L368.9473684210526,20L378.9473684210526,10L368.9473684210526,0Z"></path></g><g class="gene" transform="translate(331.57894736842104,70)"><path style="fill: rgb(55, 126, 184); fill-opacity: 0.85; stroke: rgb(39, 88, 129); stroke-width: 1px; stroke-opacity: 0.8;" d="M0,0L0,20L368.9473684210526,20L378.9473684210526,10L368.9473684210526,0Z"></path></g></g></g></g></g>';
  const genomeBrowserComponent = GenomeBrowser();
  const width = 1500;
  const window: [number, number] = [25, 120];
  const chromosomeSize = 300;

  const genes: GeneData[] = [
    {
      name: "gene 1",
      strand: "-",
      begin: 10,
      end: 50,
      gene: "insA",
    },
    {
      name: "gene 2",
      strand: "+",
      begin: 60,
      end: 100,
      gene: "yaaY",
    },

    {
      name: "gene 3",
      strand: "+",
      begin: 150,
      end: 280,
      gene: "foo",
    }
  ];
  const genomeBrowserState = {
    width,
    chromosomeSize,
    window,
    genes,
    chromosome: {
      title: "chromosome ruler title"
    },
    selectedChromosome: {
      title: "Chromosome"
    }
  }


  const genomeBrowserData = genomeBrowserDataLayout(
    genomeBrowserState,
    (scale, state: GenomeBrowserState) => [scale, state],
    (geneLocation, state: GenomeBrowserState) => console.log(geneLocation)
  );
  const data: GenomeBrowserData[] = [genomeBrowserData];
  document.body.innerHTML =
    '<div><svg width="500"><g id="container"></g></svg></div>';
  const container = select("svg")
    .select<SVGGElement>("g");
  container
    .datum<GenomeBrowserData[]>(data)
    .call(genomeBrowserComponent);


  // 
  test("Test all dom element", () => {
    // This is test is too much. Should find a smarter one that won't break
    // for small changement.
    expect(container.html()).toBe(result);
  })


  // 
  test("Test transform data", () => {
    expect(genomeBrowserData.selectedChromosome.genes.length).toBe(2);
  });


  // 
  test("test window data", () => {
    expect(genomeBrowserData.selectedChromosome.window).toBe(genomeBrowserState.window);
    expect(genomeBrowserData.selectedChromosome.window).toBe(genomeBrowserData.chromosome.ruler.window);
    expect(genomeBrowserData.selectedChromosome.window).toBe(genomeBrowserData.selectedChromosome.ruler.interval)
  });
})