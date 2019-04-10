import { BrushableAxisData, GenericAxisData } from "../../types";
import { select, Selection } from "d3-selection";
import { scaleLinear } from "d3-scale";
import GenomeAxis from "./genome-rule";
import { brushX, BrushBehavior } from "d3-brush";
import { html } from "d3";


export default function () {
  const genomeAxisComponent = GenomeAxis();
  const htmlClassName = {
    componentContainer: "whole-chromosome-rule",
    genericRule: "generic-rule",
    brushSelection: "brush-selection"
  };

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
        .selectAll<SVGElement, BrushableAxisData>("." + htmlClassName.componentContainer)
        .data([_data]);

      const globalAxisEnter = globalAxis
        .enter()
        .append<SVGElement>("g")
        .classed(htmlClassName.componentContainer, true);

      globalAxisEnter.append("g")
        .classed(htmlClassName.genericRule, true);


      globalAxisEnter.append("g")
        .attr("transform", "translate(0,25)")
        .classed(htmlClassName.brushSelection, true);

      globalAxis.exit().remove();

      const globalAxisUpdate = globalAxis.merge(globalAxisEnter);


      globalAxisUpdate.select<any>("." + htmlClassName.brushSelection)
        .call(brush)
        .call(brush.move, [xScale(_data.window[0]), xScale(_data.window[1])]);

      globalAxisUpdate
        .select<SVGElement>("." + htmlClassName.genericRule)
        .datum((d: BrushableAxisData): GenericAxisData => ({ title: d.title, interval: [d.interval[0], d.interval[1]] }))
        .call(genomeAxisComponent, width, yPosition);

    });
  }
  return globalGenomeAxis;
}