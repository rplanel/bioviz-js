import ChromosomeRuler from "../src/scripts/component/ruler/chromosome";
import { GenericAxisData } from "../src/scripts/types";
import { select } from "d3-selection";

describe("Test Chromosome Ruler", () => {
  const result = '<g class="genome-axis"><g class="title"><text style="fill: black; font-family: monospace;" transform="translate(790,20)">Chromosome</text></g><g class="axis-elems" transform="translate(0, 50)" fill="none" font-size="10" font-family="sans-serif" text-anchor="middle"><path class="domain" stroke="currentColor" d="M0.5,-6V0.5H1500.5V-6"></path><g class="tick" opacity="1" transform="translate(0.5,0)"><line stroke="currentColor" y2="-6"></line><text fill="currentColor" y="-9" dy="0em">0.00</text></g><g class="tick" opacity="1" transform="translate(150.5,0)"><line stroke="currentColor" y2="-6"></line><text fill="currentColor" y="-9" dy="0em">100k</text></g><g class="tick" opacity="1" transform="translate(300.5,0)"><line stroke="currentColor" y2="-6"></line><text fill="currentColor" y="-9" dy="0em">200k</text></g><g class="tick" opacity="1" transform="translate(450.5,0)"><line stroke="currentColor" y2="-6"></line><text fill="currentColor" y="-9" dy="0em">300k</text></g><g class="tick" opacity="1" transform="translate(600.5,0)"><line stroke="currentColor" y2="-6"></line><text fill="currentColor" y="-9" dy="0em">400k</text></g><g class="tick" opacity="1" transform="translate(750.5,0)"><line stroke="currentColor" y2="-6"></line><text fill="currentColor" y="-9" dy="0em">500k</text></g><g class="tick" opacity="1" transform="translate(900.5,0)"><line stroke="currentColor" y2="-6"></line><text fill="currentColor" y="-9" dy="0em">600k</text></g><g class="tick" opacity="1" transform="translate(1050.5,0)"><line stroke="currentColor" y2="-6"></line><text fill="currentColor" y="-9" dy="0em">700k</text></g><g class="tick" opacity="1" transform="translate(1200.5,0)"><line stroke="currentColor" y2="-6"></line><text fill="currentColor" y="-9" dy="0em">800k</text></g><g class="tick" opacity="1" transform="translate(1350.5,0)"><line stroke="currentColor" y2="-6"></line><text fill="currentColor" y="-9" dy="0em">900k</text></g><g class="tick" opacity="1" transform="translate(1500.5,0)"><line stroke="currentColor" y2="-6"></line><text fill="currentColor" y="-9" dy="0em">1.00M</text></g></g></g>'
  document.body.innerHTML =
    '<div><svg width="500"><g id="container"></g></svg></div>';
  const genericAxisData: GenericAxisData = { title: "Chromosome", interval: [0, 1000000] };
  const chromosomeRulerComponent = ChromosomeRuler();
  test("Test data to DOM Element", () => {

    const container = select("svg")
      .select<SVGGElement>("g");

    container
      .datum<GenericAxisData>(genericAxisData)
      .call(chromosomeRulerComponent, 1500);

    expect(container.html()).toBe(result);

  })
})