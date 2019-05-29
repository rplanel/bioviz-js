import SelectedChromosome from "../src/scripts/component/selected-chromosome";
import { select } from "d3-selection";
import { SelectedChromosomeData } from "../src/scripts/types";

describe("Test Selected Chromosome", () => {
  const result = '<g class="selected-chromosome"><rect class="genome-browser-background" width="1500" height="150"></rect><g class="chromosome-ruler" transform="translate(0,0)"><g class="genome-axis"><g class="title"><text style="fill: black; font-family: monospace;" transform="translate(790,20)">Chromosome</text></g><g class="axis-elems" transform="translate(0, 50)" fill="none" font-size="10" font-family="sans-serif" text-anchor="middle"><path class="domain" stroke="currentColor" d="M0.5,-6V0.5H1500.5V-6"></path><g class="tick" opacity="1" transform="translate(79.44736842105263,0)"><line stroke="currentColor" y2="-6"></line><text fill="currentColor" y="-9" dy="0em">30.0</text></g><g class="tick" opacity="1" transform="translate(237.3421052631579,0)"><line stroke="currentColor" y2="-6"></line><text fill="currentColor" y="-9" dy="0em">40.0</text></g><g class="tick" opacity="1" transform="translate(395.2368421052631,0)"><line stroke="currentColor" y2="-6"></line><text fill="currentColor" y="-9" dy="0em">50.0</text></g><g class="tick" opacity="1" transform="translate(553.1315789473684,0)"><line stroke="currentColor" y2="-6"></line><text fill="currentColor" y="-9" dy="0em">60.0</text></g><g class="tick" opacity="1" transform="translate(711.0263157894736,0)"><line stroke="currentColor" y2="-6"></line><text fill="currentColor" y="-9" dy="0em">70.0</text></g><g class="tick" opacity="1" transform="translate(868.921052631579,0)"><line stroke="currentColor" y2="-6"></line><text fill="currentColor" y="-9" dy="0em">80.0</text></g><g class="tick" opacity="1" transform="translate(1026.8157894736842,0)"><line stroke="currentColor" y2="-6"></line><text fill="currentColor" y="-9" dy="0em">90.0</text></g><g class="tick" opacity="1" transform="translate(1184.7105263157896,0)"><line stroke="currentColor" y2="-6"></line><text fill="currentColor" y="-9" dy="0em">100</text></g><g class="tick" opacity="1" transform="translate(1342.6052631578948,0)"><line stroke="currentColor" y2="-6"></line><text fill="currentColor" y="-9" dy="0em">110</text></g><g class="tick" opacity="1" transform="translate(1500.5,0)"><line stroke="currentColor" y2="-6"></line><text fill="currentColor" y="-9" dy="0em">120</text></g></g></g></g><g class="genes"><g class="gene" transform="translate(-236.8421052631579,70)"><path style="fill-opacity: 0.85; stroke-width: 1px; stroke-opacity: 0.8;" transform="translate(0,25) translate(631.578947368421,20) rotate(180)" d="M0,0L0,20L621.578947368421,20L631.578947368421,10L621.578947368421,0Z"></path></g><g class="gene" transform="translate(552.6315789473684,70)"><path style="fill-opacity: 0.85; stroke-width: 1px; stroke-opacity: 0.8;" d="M0,0L0,20L621.5789473684212,20L631.5789473684212,10L621.5789473684212,0Z"></path></g></g></g>'
  const selectedChromosomeComponent = SelectedChromosome();
  const window: [number, number] = [25, 120];
  const data: SelectedChromosomeData[] = [
    {
      window,
      genes: [{
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
      }],
      ruler: {
        title: "Chromosome",
        interval: window
      }
    }
  ];
  document.body.innerHTML =
    '<div><svg width="500"><g id="container"></g></svg></div>';
  const container = select("svg")
    .select<SVGGElement>("g");
  const width = 1500;
  container
    .datum<SelectedChromosomeData[]>(data)
    .call(selectedChromosomeComponent, width);

  // Start tests
  test("Test data to DOM elements", () => {
    expect(container.html()).toBe(result);
  })
  test("Width background rectangle", () => {
    const displayWidth = parseInt(container.select(".genome-browser-background").attr("width"));
    expect(displayWidth).toBe(width);
  })
})