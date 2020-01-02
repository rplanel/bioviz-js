import Plotly from "plotly.js-dist";
import { Data, Layout } from "plotly.js";
import { Selection } from "d3-selection";
import { nest } from "d3-collection";
import { GenomeScanData } from "../../types";

export default function () {
    function genomeScan(_selection: Selection<HTMLDivElement, GenomeScanData[], any, any>) {
        const container = _selection.node();
        _selection.each(function (_data) {
            const chrDatas: Array<{ key: string, values: GenomeScanData[] }> = nest<GenomeScanData>()
                .key(d => d.chr)
                .entries(_data);
            console.log(chrDatas);
            const chrCount = chrDatas.length;
            const traces = chrDatas.map((dataPerChr, i): Data => {
                let j = i + 1;
                // const type = "scatter";
                // const mode = "lines";
                return {
                    type: "scatter",
                    xaxis: "x" + j,
                    yaxis: "y",
                    name: "chr. " + dataPerChr.key,
                    mode: "lines",
                    x: dataPerChr.values.map(d => {
                        return parseFloat(d.pos)
                    }),
                    y: dataPerChr.values.map(d => parseFloat(d.lod)),
                    text: dataPerChr.values.map(d => d.marker),
                }
            });
            var layout = chrDatas.reduce((acc, curr, i) => {
                const xaxisIndex = (i === 0) ? "" : i + 1;
                const xaxisKey = "xaxis" + xaxisIndex;
                acc[xaxisKey] = {
                    ...acc[xaxisKey],
                    title: curr.key,
                    showticklabels: false,
                    showgrid: false,
                    zeroline: false,
                }
                return acc;

            }, {
                grid: {
                    rows: 1,
                    columns: chrCount,
                    pattern: 'coupled',
                }
            });
            if (container) {
                Plotly.newPlot(container, traces, layout);
            }
        })
    }

    return genomeScan;
}