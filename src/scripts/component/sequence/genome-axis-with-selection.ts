import { GlobalAxisData, GenericAxisData } from "../../types";
import { select, Selection } from "d3-selection";
import { scaleLinear } from "d3-scale";
import GenomeAxis from "./genome-axis";


export default function () {
  const GenomeAxisComponent = GenomeAxis();
  function globalGenomeAxis(
    _selection: Selection<SVGElement, GlobalAxisData, SVGElement, any>,
    width: number,
    yPosition: number
  ) {
    _selection.each(function (_data) {
      const xScale = scaleLinear()
        .domain(_data.interval)
        .range([0, width]);

      const container = select(this)
        .attr("transform", "translate(0," + yPosition + ")");
      const globalAxis = container
        .selectAll<SVGElement, GlobalAxisData>("g.global-axis-container")
        .data([_data]);

      const globalAxisEnter = globalAxis
        .enter()
        .append<SVGElement>("g")
        .classed("global-axis-container", true);

      globalAxisEnter.append("g").classed("generic-axis", true);
      globalAxisEnter.append("rect").classed("genome-axis-window", true);



      globalAxis.exit().remove();

      const globalAxisUpdate = globalAxis.merge(globalAxisEnter);

      globalAxisUpdate
        .select("rect")
        .attr("transform", function(d: GlobalAxisData) {
          const x = xScale(d.window[0])
          return "translate(" + x + ", 25)";
        })
        .attr("width", function(d) {
          return xScale(d.window[1] - d.window[0]);
        })
        .attr("height", 50);

      globalAxisUpdate
        .select<SVGElement>("g.generic-axis")
        .datum((d: GlobalAxisData): GenericAxisData => ({ title: d.title, interval: [d.interval[0], d.interval[1]] }))
        .call(GenomeAxisComponent, width, yPosition);

  });
}
return globalGenomeAxis;
}