import Plotly, { Layout } from "plotly.js-dist";

import { Selection } from "d3-selection";
export default function () {
    function qtlCoefficient(_selection: Selection<HTMLDivElement, any, any, any>) {
        _selection.each(function (_data) {
            const container = this;
            console.log(_data);
            const traces = ["A", "B", "C", "D", "E", "F", "G", "H"].map((key) => {
                return extractTrace(_data, key);
            })
            const traceLod = extractTrace(_data, "lod");
            // // traceLod.xaxis = "x2";
            traceLod.yaxis = "y2";
            traces.push(traceLod);
            // const trace = extractTrace(_data, "A");
            console.log(traces);
            const layout = {
                height: 650,
                grid: {
                    rows: 2,
                    columns: 1,
                    subplots: [['xy'], ['xy2']],
                    pattern: 'coupled',
                    roworder: 'top to bottom'
                },
                yaxis: {
                    title: "QTL Effects"
                },
                yaxis2: {
                    title: "LOD score"
                },
                xaxis: { title: "Chr 16 position" }

            };
            console.log(layout);
            console.log(traces);
            Plotly.react(container, traces, layout, { responsive: true })

        })

    }


    function extractTrace(data: any, key: string) {
        const [x, y, markers] = data.reduce((acc, curr) => {
            // get x
            acc[0].push(curr.pos);
            acc[1].push(curr[key]);
            acc[2].push(curr.marker);
            return acc;
        }, [[], [], []]);


        return {
            x,
            y,
            name: key,
            type: "scatter",
            mode: "lines",
            text: markers,
        }
    }

    return qtlCoefficient;
}