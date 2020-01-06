import Plotly, { Data } from "plotly.js-dist";
import { SnpData } from "src/scripts/types";
import { Selection } from "d3-selection";

export default function () {
    function snp(_selection: Selection<HTMLDivElement, SnpData[], any, any>) {
        _selection.each(function (_data: SnpData[]) {
            const container = this;
            console.log(_data);
            // const trace = [_data].map(data => {
            //     const x: number[] = [];
            //     const y: number[] = [];
            //     const text: string[] = [];
            //     const initTrace: Data & { boxpoints: string } = {
            //         type: "box",
            //         boxpoints: "all",
            //         marker: {
            //             size: 4,
            //         },
            //     };
            //     const axisData = {
            //         x,
            //         y,
            //         text,
            //     }
            //     for (let item of data) {
            //         axisData.x.push(item.pos);
            //         axisData.y.push(item.lod);
            //         axisData.text.push(item.snp_id);
            //     }
            //     return { ...initTrace, ...axisData };
            // })
            // const layout = {
            //     height: 600,
            //     xaxis: {
            //         title: " Positions chromosome 6 "
            //     },
            //     yaxis: {
            //         title: " Lod Score"
            //     },
            // };
            // Plotly.react(container, trace, layout, { responsive: true });

        });
    }
    return snp;
}