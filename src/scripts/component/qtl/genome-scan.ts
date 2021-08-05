import Plotly, { Layout, Data } from "plotly.js-dist";
import * as d3Selection from "d3-selection";
import * as d3Array from "d3-array";
import * as d3Format from "d3-format";
import * as d3Scale from "d3-scale";
import * as d3ScaleChromatic from "d3-scale-chromatic";
import { GenomeScanData, SignificanceThreshold } from "../../types";


export default function () {
    function genomeScan(_selection: d3Selection.Selection<HTMLDivElement, GenomeScanData, any, any>, legendClickCallback: (event: Plotly.LegendClickEvent) => boolean, legendDoubleClickCallback: (event: Plotly.LegendClickEvent) => boolean) {
        const threholdFormat = d3Format.format(".2f");
        _selection.each(function ({ lod_score_per_chromosome, significance_thresholds }: GenomeScanData) {
            const container = this;
            if (container) {
                const maxLodScoreStr = d3Array.max(lod_score_per_chromosome, d => d.lod);
                if (maxLodScoreStr) {
                    const thresholdColor = d3Scale.scaleSequential(d3ScaleChromatic.interpolatePlasma).domain([80, 100])
                    // const thresholdColor = scaleLinear<string, string>().domain([80, 100]).range(["red", "blue"])
                    const maxLodScore = maxLodScoreStr;
                    const chrDatasMap = d3Array.group(lod_score_per_chromosome, d => d.chr);
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
                    for (const thresholdPartialTrace of thresholdInterval(significance_thresholds, maxLodScore, thresholdColor)) {
                        const tresholdTraces = chrDatas.map((dataPerChr, i): Data => {
                            const j = i + 1;
                            const [min, max] = d3Array.extent(dataPerChr.values.map(d => {
                                return d.pos
                            }))
                            if (typeof min !== "undefined" && typeof max != "undefined") {
                                let to = min
                                return {
                                    type: "scattergl",
                                    xaxis: `x${j}`,
                                    yaxis: "y",
                                    name: `Significance ${thresholdPartialTrace.significance}% (${threholdFormat(thresholdPartialTrace.threshold)})`,
                                    mode: "lines",
                                    legendgroup: `${thresholdPartialTrace.significance}`,
                                    showlegend: i === 0 ? true : false,
                                    x: [min, max],
                                    y: [thresholdPartialTrace.threshold, thresholdPartialTrace.threshold],
                                    line: {
                                        dash: "dot",
                                        color: thresholdPartialTrace.color
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
                    const layout: Partial<Layout> & { grid: { rows: number, columns: number, pattern: string } } = {
                        height: 800,
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

    function thresholdInterval(significanceThresholds: SignificanceThreshold[], max: number, colorScale: d3Scale.ScaleSequential<string>) {
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