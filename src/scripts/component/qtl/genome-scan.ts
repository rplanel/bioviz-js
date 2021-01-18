import Plotly, { Layout, Data } from "plotly.js-dist";
import { Selection } from "d3-selection";
import { max, group, extent } from "d3-array";
import { scaleLinear, ScaleLinear } from "d3-scale";

import { GenomeScanData, SignificanceThreshold } from "../../types";
import { text } from "d3";
import { sign } from "crypto";

export default function () {
    function genomeScan(_selection: Selection<HTMLDivElement, GenomeScanData, any, any>, legendClickCallback: (event: Plotly.LegendClickEvent) => boolean, legendDoubleClickCallback: (event: Plotly.LegendClickEvent) => boolean) {
        _selection.each(function ({ lod_score_per_chromosome, significance_thresholds }: GenomeScanData) {
            const container = this;
            if (container) {
                const maxLodScoreStr = max(lod_score_per_chromosome, d => d.lod);
                if (maxLodScoreStr) {
                    const thresholdColor = scaleLinear<string, string>().domain([80, 100]).range(["orange", "green"])
                    const maxLodScore = maxLodScoreStr;
                    const chrDatasMap = group(lod_score_per_chromosome, d => d.chr);
                    const chrDatas = Array.from(chrDatasMap, ([key, values]) => ({ key, values }))
                    const chrCount = chrDatas.length;
                    let traces = chrDatas.map((dataPerChr, i): Data => {
                        const j = i + 1;

                        return {
                            type: "scattergl",
                            xaxis: `x${j}`,
                            yaxis: "y",
                            name: "chr " + dataPerChr.key,
                            mode: "lines",
                            x: dataPerChr.values.map(d => {
                                return d.pos
                            }),
                            y: dataPerChr.values.map(d => d.lod),
                            text: dataPerChr.values.map(d => d.marker),
                        }
                    });
                    for (const thres of thresholdInterval(significance_thresholds, maxLodScore, thresholdColor)) {
                        const tresholdTraces = chrDatas.map((dataPerChr, i): Data => {
                            const j = i + 1;
                            const [min, max] = extent(dataPerChr.values.map(d => {
                                return d.pos
                            }))
                            if (typeof min !== "undefined" && typeof max != "undefined") {
                                let to = min
                                return {
                                    type: "scattergl",
                                    xaxis: `x${j}`,
                                    yaxis: "y",
                                    name: `Significance ${thres.threshold}%`,
                                    mode: "lines",
                                    legendgroup: `${thres.threshold}`,
                                    showlegend: i === 0 ? true : false,
                                    x: [min, max],
                                    y: [thres.significance, thres.significance],
                                    line: {
                                        dash: "dot",
                                        color: thresholdColor(thres.threshold)
                                    },
                                    text: ["80%", "80%"],
                                }
                            }
                            else {
                                return {
                                    type: "scattergl",
                                    xaxis: `x${j}`,
                                    yaxis: "y",
                                    name: "threholds" + dataPerChr.key,
                                    mode: "lines",
                                    x: [0, 1],
                                    y: [4.5, 4.5],
                                    text: ["80%", "80%"],
                                }
                            }
                        })
                        traces = [...traces, ...tresholdTraces]
                    }
                    // const thresholdShapes: Partial<Plotly.Shape>[] = thresholdInterval(significance_thresholds, maxLodScore, thresholdColor).map((significance_threshold, i) => {
                    //     return {
                    //         layer: 'below',
                    //         type: 'line',
                    //         xref: 'paper',
                    //         x0: 0,
                    //         y0: significance_threshold.y0,
                    //         x1: 1,
                    //         y1: significance_threshold.y0,
                    //         line: {
                    //             width: 1,
                    //             color: significance_threshold.color,
                    //             dash: "solid"
                    //         },
                    //         name: significance_threshold.significance.toString(),
                    //     }
                    // })

                    // const trace1 = {
                    //     x: [0, 2, 3, 4],
                    //     y: [4, 15, 13, 17],
                    //     mode: 'markers',
                    //     name: 'Scatter'
                    //   };


                    // const initPartialThresholdData: { x: number[], y: number[], text: string[] } = { x: [], y: [], text: [] }
                    // const textThresholdTraces: { x: number[], y: number[], text: string[] } = thresholdInterval(significance_thresholds, maxLodScore, thresholdColor).reduce((acc, significance_threshold, i) => {
                    //     console.log(significance_threshold)
                    //     acc.x.push(5)
                    //     acc.y.push(significance_threshold.y0)
                    //     acc.text.push(`${significance_threshold.significance.toString()} % ${significance_threshold.threshold}`)
                    //     return acc
                    // }, initPartialThresholdData)



                    // const initThresholdTrace: Plotly.Data = { x: textThresholdTraces.x, y: textThresholdTraces.y, text: textThresholdTraces.text, mode: 'text+lines', textposition: 'bottom center', type: "scatter" }
                    // traces.push(initThresholdTrace)
                    const layout: Partial<Layout> & { grid: { rows: number, columns: number, pattern: string } } = {
                        height: 608,
                        // shapes: thresholdShapes,
                        showlegend: true,
                        grid: {
                            rows: 1,
                            columns: chrCount,
                            pattern: 'coupled',

                        },
                        autosize: true,
                    }
                    Array.from(chrDatas).forEach((curr, i) => {
                        const xaxisIndex: string = (i === 0) ? "" : (i + 1).toString();
                        const xaxisKey = "xaxis" + xaxisIndex;
                        // @ts-ignore
                        layout[xaxisKey] = {
                            title: curr.key,
                            type: "category",
                            showticklabels: false,
                            showgrid: false,
                            zeroline: false,
                        }
                    });
                    const yaxis = layout.yaxis;
                    layout.yaxis = {
                        ...yaxis,
                        title: "LOD score",
                    }
                    Plotly.react(container, traces, layout, { responsive: true, autosizable: true }).then(function (root) {
                        console.log(root);
                        root.removeAllListeners('plotly_legendclick')
                        root.removeAllListeners('plotly_legenddoubleclick')
                        root.on('plotly_legenddoubleclick', legendDoubleClickCallback)
                        root.on('plotly_legendclick', legendClickCallback)

                    })

                }
            }

        })
    }

    function thresholdInterval(significanceThresholds: SignificanceThreshold[], max: number, colorScale: ScaleLinear<string, string>) {
        const significanceThresholdsLength = significanceThresholds.length;
        return significanceThresholds.map((st, i, arr) => {
            return {
                ...st,
                y0: st.threshold,
                y1: (i < significanceThresholdsLength - 1) ? arr[i + 1].threshold : max,
                color: colorScale(st.significance)
            }
        })
    }



    return genomeScan;
}