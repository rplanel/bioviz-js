import { BrushableAxisData, GenericAxisData } from "../../types";
import { select, Selection } from "d3-selection";
import { scaleLinear } from "d3-scale";
import GenomeAxis from "./genome-axis";
import { brushX, BrushBehavior } from "d3-brush";


export default function () {
  const genomeAxisComponent = GenomeAxis();
  function globalGenomeAxis(
    _selection: Selection<SVGElement, BrushableAxisData, SVGElement, any>,
    width: number,
    yPosition: number
  ) {
    _selection.each(function (_data) {
      const xScale = scaleLinear()
        .domain(_data.interval)
        .range([0, width]);

      const brush: BrushBehavior<any> = brushX()
        .extent([[0, 0], [width, 50]])
        .on("brush", () => {
          if (_data.eventHandler) {
            _data.eventHandler.brushed(genomeAxisComponent.scale())
          }
        });

      const container = select(this)
        .attr("transform", "translate(0," + yPosition + ")");
      const globalAxis = container
        .selectAll<SVGElement, BrushableAxisData>("g.global-axis-container")
        .data([_data]);

      const globalAxisEnter = globalAxis
        .enter()
        .append<SVGElement>("g")
        .classed("global-axis-container", true);

      globalAxisEnter.append("g")
        .classed("generic-axis", true);


      globalAxisEnter.append("g")
        .attr("transform", "translate(0,25)")
        .classed("brush-selection", true);

      globalAxis.exit().remove();

      const globalAxisUpdate = globalAxis.merge(globalAxisEnter);


      globalAxisUpdate.select<any>("g.brush-selection")
        .call(brush)
        .call(brush.move, [xScale(_data.window[0]), xScale(_data.window[1])]);

      globalAxisUpdate
        .select<SVGElement>("g.generic-axis")
        .datum((d: BrushableAxisData): GenericAxisData => ({ title: d.title, interval: [d.interval[0], d.interval[1]] }))
        .call(genomeAxisComponent, width, yPosition);

    });
  }
  return globalGenomeAxis;
}