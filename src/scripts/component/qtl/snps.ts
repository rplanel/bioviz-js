import Plotly, { Data } from "plotly.js-dist";
import { SnpsData } from "src/scripts/types";
import * as d3Selection from "d3-selection";

export default function () {
    function snps(_selection: d3Selection.Selection<HTMLDivElement, SnpsData[], any, any>, xAxisTitle = "") {
        _selection.each(function (_data: SnpsData[]) {
            const container = this;
            const trace = [_data].map(data => {
                const initTrace: Data = {
                    type: "scattergl",
                    mode: "markers",
                    marker: {
                        size: 5,
                    },
                    name: "Chromosome 6",
                };
                const axisData: { x: number[], y: number[], text: string[] } = {
                    x: [],
                    y: [],
                    text: [],
                }
                for (let item of data) {
                    axisData.x.push(item.pos);
                    axisData.y.push(item.lod);
                    axisData.text.push(item.snp_id);
                }
                return { ...initTrace, ...axisData };
            })
            const layout: Partial<Plotly.Layout> = {
                height: 600,
                xaxis: {
                    title: xAxisTitle
                },
                yaxis: {
                    title: "Lod Score",
                    rangemode: "nonnegative",
                },
            };
            Plotly.react(container, trace, layout, { responsive: true });

        });
    }
    return snps;
}