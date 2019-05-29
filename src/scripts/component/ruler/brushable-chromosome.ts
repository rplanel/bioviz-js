import { BrushableAxisData, GenericAxisData } from "../../types";
import { select, Selection, event } from "d3-selection";
import { scaleLinear } from "d3-scale";
import GenomeAxis from "./chromosome";
import { brushX, BrushBehavior } from "d3-brush";
import { format } from "d3-format";

export default function () {
  const genomeAxisComponent = GenomeAxis();
  const htmlClassName = {
    componentContainer: "whole-chromosome-rule",
    genericRule: "generic-rule",
    brushSelection: "brush-selection"
  };

  const tickFormat = format(".3s");
  const brushHeight = 50;
  function globalGenomeAxis(
    _selection: Selection<SVGElement, BrushableAxisData, SVGElement, any>,
    width: number,
    yPosition: number,
  ) {
    _selection.each(function (_data) {
      const { interval, maxWindowSize } = _data;
      const genomicToPx = scaleLinear()
        .domain(interval)
        .range([0, width]);

      const brush: BrushBehavior<any> = brushX()
        .extent([[0, 0], [width, brushHeight]])
        .on("brush", () => {
          const { selection: [start, end] } = event;
          globalAxisUpdate
            .select(".brush-selection-boundaries")
            .select("text.start")
            .style("text-anchor", "end")
            .attr("transform", "translate(" + start + "," + (brushHeight + 10) + ")")
            .text(tickFormat(genomicToPx.invert(start)));

          globalAxisUpdate
            .select(".brush-selection-boundaries")
            .select("text.end")
            .attr("transform", "translate(" + end + "," + (brushHeight + 10) + ")")
            .style("text-anchor", "start")
            .text(tickFormat(genomicToPx.invert(end)));


          if (_data.eventHandler) {
            _data.eventHandler.brushed(genomicToPx)
          }
        })
        .on("end", function () {
          const { selection: [pxStart, pxEnd] } = event;
          const currentGenomicWindowSize = Math.ceil(genomicToPx.invert(pxEnd) - genomicToPx.invert(pxStart));
          const maxPixelWindowSize = Math.floor(genomicToPx(maxWindowSize));
          if (currentGenomicWindowSize > maxWindowSize) {
            const roundedStart = Math.ceil(pxStart);
            brushSelection
              .transition()
              .duration(400)
              .call(brush.move, [roundedStart, roundedStart + maxPixelWindowSize])
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


      const brushSelectionEnter = globalAxisEnter.append("g")
        .attr("transform", "translate(0,25)");
      brushSelectionEnter
        .append("g")
        .classed(htmlClassName.brushSelection, true);

      const boundaries = brushSelectionEnter
        .append("g")
        .style("font-size", "9")
        .classed("brush-selection-boundaries", true)

      boundaries.append("text").classed("start", true);
      boundaries.append("text").classed("end", true);

      globalAxis.exit().remove();

      const globalAxisUpdate = globalAxis.merge(globalAxisEnter);


      const brushSelection = globalAxisUpdate
        .select<any>("." + htmlClassName.brushSelection);
      brushSelection
        .call(brush)
        .call(brush.move, [genomicToPx(_data.window[0]), genomicToPx(_data.window[1])]);

      globalAxisUpdate
        .select<SVGGElement>("." + htmlClassName.genericRule)
        .datum((d: BrushableAxisData): GenericAxisData => ({ title: d.title, interval: [d.interval[0], d.interval[1]] }))
        .call(genomeAxisComponent, width, yPosition);




    });
  }
  return globalGenomeAxis;
}