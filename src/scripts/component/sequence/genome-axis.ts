import { axisTop } from "d3-axis";
import { Selection, select } from "d3-selection";
import { scaleLinear, ScaleLinear } from "d3-scale";
import { format } from "d3-format";

export default function () {
  let xScale = scaleLinear()
    .domain([0, 0])
    .range([0,0])
  function genomeAxis(
    _selection: Selection<SVGElement, [number, number], SVGElement, any>,
    width: number,
    yPosition: number = 0
  ) {

    _selection.each(function (_data: [number, number]) {
      const container = select(this)
        .attr("transform", "translate(0," + yPosition + ")");

      const title = "Genome XXX (bp)";

      xScale = scaleLinear()
        .domain([_data[0], _data[1]])
        .range([0, width])

      const genomeAxisComponent = axisTop(xScale)
        .tickFormat(format(".3s"));

      const genomeAxisSelection = container
        .selectAll<SVGGElement, [number, number]>("g.genome-axis")
        .data([_data]);

      // ENTER
      const genomeAxisSelectionEnter = genomeAxisSelection
        .enter()
        .append<SVGGElement>("g")
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
        .attr("transform", "translate(" + (width / 2 + title.length * 8 / 2) + ",20)")
        .text(title);


      const test = genomeAxisSelectionUpdate
        .select<SVGElement>("g.axis-elems")
        .attr("transform", "translate(0, 50)");

      test.call(genomeAxisComponent);
      //test.transition().call(genomeAxisComponent);



    });

  }
  genomeAxis.scale = function () {
    return xScale;
  }
  return genomeAxis;
}

