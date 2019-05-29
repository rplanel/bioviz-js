import BrushableChromosomeRuler from "../src/scripts/component/ruler/brushable-chromosome";
import { BrushableAxisData } from "../src/scripts/types";
import { select } from "d3-selection";


describe("Test Chromosome Ruler", () => {
  const result = '<g class="whole-chromosome-rule"><g class="generic-rule" transform="translate(0,20)"><g class="genome-axis"><g class="title"><text style="fill: black; font-family: monospace;" transform="translate(830,20)">brushable chromosome</text></g><g class="axis-elems" transform="translate(0, 50)" fill="none" font-size="10" font-family="sans-serif" text-anchor="middle"><path class="domain" stroke="currentColor" d="M0.5,-6V0.5H1500.5V-6"></path><g class="tick" opacity="1" transform="translate(0.5,0)"><line stroke="currentColor" y2="-6"></line><text fill="currentColor" y="-9" dy="0em">0.00</text></g><g class="tick" opacity="1" transform="translate(150.5,0)"><line stroke="currentColor" y2="-6"></line><text fill="currentColor" y="-9" dy="0em">100k</text></g><g class="tick" opacity="1" transform="translate(300.5,0)"><line stroke="currentColor" y2="-6"></line><text fill="currentColor" y="-9" dy="0em">200k</text></g><g class="tick" opacity="1" transform="translate(450.5,0)"><line stroke="currentColor" y2="-6"></line><text fill="currentColor" y="-9" dy="0em">300k</text></g><g class="tick" opacity="1" transform="translate(600.5,0)"><line stroke="currentColor" y2="-6"></line><text fill="currentColor" y="-9" dy="0em">400k</text></g><g class="tick" opacity="1" transform="translate(750.5,0)"><line stroke="currentColor" y2="-6"></line><text fill="currentColor" y="-9" dy="0em">500k</text></g><g class="tick" opacity="1" transform="translate(900.5,0)"><line stroke="currentColor" y2="-6"></line><text fill="currentColor" y="-9" dy="0em">600k</text></g><g class="tick" opacity="1" transform="translate(1050.5,0)"><line stroke="currentColor" y2="-6"></line><text fill="currentColor" y="-9" dy="0em">700k</text></g><g class="tick" opacity="1" transform="translate(1200.5,0)"><line stroke="currentColor" y2="-6"></line><text fill="currentColor" y="-9" dy="0em">800k</text></g><g class="tick" opacity="1" transform="translate(1350.5,0)"><line stroke="currentColor" y2="-6"></line><text fill="currentColor" y="-9" dy="0em">900k</text></g><g class="tick" opacity="1" transform="translate(1500.5,0)"><line stroke="currentColor" y2="-6"></line><text fill="currentColor" y="-9" dy="0em">1.00M</text></g></g></g></g><g transform="translate(0,25)"><g class="brush-selection" fill="none" pointer-events="all"><rect class="overlay" pointer-events="all" cursor="crosshair" x="0" y="0" width="1500" height="50"></rect><rect class="selection" cursor="move" fill="#777" fill-opacity="0.3" stroke="#fff" shape-rendering="crispEdges" style="" x="150" y="0" width="75" height="50"></rect><rect class="handle handle--e" cursor="ew-resize" style="" x="222" y="-3" width="6" height="56"></rect><rect class="handle handle--w" cursor="ew-resize" style="" x="147" y="-3" width="6" height="56"></rect></g><g style="font-size: 9;" class="brush-selection-boundaries"><text class="start" style="text-anchor: end;" transform="translate(150,60)">100k</text><text class="end" transform="translate(225,60)" style="text-anchor: start;">150k</text></g></g></g>'
  const brushableChromosomeRulerComponent = BrushableChromosomeRuler();
  document.body.innerHTML =
    '<div><svg width="500"><g id="container"></g></svg></div>';

  const data: BrushableAxisData = {
    title: "brushable chromosome",
    interval: [0, 1000000],
    window: [100000, 150000],
    maxWindowSize: 500000
  };
  // Start tests
  test("Test data to DOM Element", () => {

    const container = select("svg")
      .select<SVGGElement>("g");

    container
      .datum<BrushableAxisData>(data)
      .call(brushableChromosomeRulerComponent, 1500, 20);
    expect(container.html()).toBe(result);
  })

});


