import { axisTop } from "d3-axis";
import { Selection, select } from "d3-selection";
import { scaleLinear } from "d3-scale";
import { format } from "d3-format";
import { GenericAxisData } from "../../types";


export default function () {
  let xScale = scaleLinear()
    .domain([0, 0])
    .range([0, 0])

  function genomeAxis(
    _selection: Selection<SVGGElement, GenericAxisData, any, any>,
    width: number,
    yPosition: number = 0
  ) {

    _selection.each(function (_data) {
      const container = select(this)
        .attr("transform", "translate(0," + yPosition + ")");

      xScale = scaleLinear()
        .domain(_data.interval)
        .range([0, width])

      const genomeAxisComponent = axisTop(xScale)
        .tickFormat(format(".3s"));

      const genomeAxisSelection = container
        .selectAll<SVGElement, GenericAxisData>("g.genome-axis")
        .data([_data]);

      // ENTER
      const genomeAxisSelectionEnter = genomeAxisSelection
        .enter()
        .append<SVGElement>("g")
        .classed("genome-axis", true);

      genomeAxisSelectionEnter
        .append("g")
        .classed("title", true)
        .append("text");

      genomeAxisSelectionEnter
        .append("g")
        .classed("axis-elems", true);


      // REMOVE 
      genomeAxisSelection.exit().remove();

      //UPDATE
      const genomeAxisSelectionUpdate = genomeAxisSelection
        .merge(genomeAxisSelectionEnter);

      genomeAxisSelectionUpdate
        .select<SVGTextElement>(".title > text")
        .style("fill", "black")
        .style("font-family", "monospace")
        .attr("transform", d => "translate(" + (width / 2 + d.title.length * 8 / 2) + ",20)")
        .text(d => d.title);


      genomeAxisSelectionUpdate
        .select<SVGSVGElement>("g.axis-elems")
        .attr("transform", "translate(0, 50)")
        .call(genomeAxisComponent);
    });

  }
  genomeAxis.scale = function () {
    return xScale;
  }
  return genomeAxis;
}

