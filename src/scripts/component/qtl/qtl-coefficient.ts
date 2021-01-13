
import Plotly, { Data, PlotData } from "plotly.js-dist";

import { Selection } from "d3-selection";
import { PlotCoefData, CoefType } from "src/scripts/types";
export default function () {
    function qtlCoefficient(_selection: Selection<HTMLDivElement, PlotCoefData[], any, any>, xTitle = "") {
        _selection.each(function (_data: PlotCoefData[]) {
            const container = this;
            const coefTypes: CoefType[] = ["A", "B", "C", "D", "E", "F", "G", "H"];
            const traces = coefTypes.map(
                (key: CoefType) => {
                    return extractTrace(_data, key);
                })
            const traceLod = extractTrace(_data, "lod");
            traceLod.yaxis = "y2";
            traces.push(traceLod);

            const layout: Partial<Plotly.Layout> = {
                height: 650,
                grid: {
                    rows: 2,
                    columns: 1,
                    subplots: ['xy', 'xy2'],
                    roworder: 'top to bottom'
                },
                yaxis: {
                    title: "QTL Effects"
                },
                yaxis2: {
                    title: "LOD score"
                },
                xaxis: { title: xTitle }

            };
            Plotly.react(container, traces, layout, { responsive: true });
        })

    }

    function extractTrace(data: PlotCoefData[], key: CoefType): Partial<PlotData> {
        // const key = "lod"
        const traceProperties: { x: number[], y: number[], text: string[] } = {
            "x": [],
            "y": [],
            "text": []
        };
        for (let item of data) {
            traceProperties.x.push(item.pos);
            traceProperties.y.push(item[key]);
            traceProperties.text.push(item.marker);
        }
        return {
            ...traceProperties,
            name: key,
            type: "scattergl",
            mode: "lines",
            yaxis: "y",

        }
    }

    return qtlCoefficient;
}