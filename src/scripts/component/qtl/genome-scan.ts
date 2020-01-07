import Plotly, { Layout, Data } from "plotly.js-dist";
import { Selection } from "d3-selection";
import { nest } from "d3-collection";
import { max } from "d3-array";
import { scaleLinear, ScaleLinear } from "d3-scale";

import { LodScoreOnChromosome, GenomeScanData, SignificanceThreshold } from "../../types";

export default function () {
    function genomeScan(_selection: Selection<HTMLDivElement, GenomeScanData, any, any>) {
        _selection.each(function ({ lod_score_on_chromosome, significance_thresholds }: GenomeScanData) {
            const container = this;
            if (container) {
                const maxLodScoreStr = max(lod_score_on_chromosome, d => d.lod);
                if (maxLodScoreStr) {
                    const thresholdColor = scaleLinear<string, string>().domain([90, 100]).range(["orange", "green"])
                    const maxLodScore = maxLodScoreStr;
                    const chrDatas: Array<{ key: string, values: LodScoreOnChromosome[] }> = nest<LodScoreOnChromosome>()
                        .key(d => d.chr)
                        .entries(lod_score_on_chromosome);
                    const chrCount = chrDatas.length;
                    const traces = chrDatas.map((dataPerChr, i): Data => {
                        const j = i + 1;
                        return {
                            type: "scattergl",
                            xaxis: "x" + j,
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

                    const layout: Partial<Layout> & { grid: { rows: number, columns: number, pattern: string }} = {
                        height: 608,
                        shapes: thresholdInterval(significance_thresholds, maxLodScore, thresholdColor).map((significance_threshold, i) => {
                            return {
                                layer: 'below',
                                type: 'rect',
                                xref: 'paper',
                                x0: 0,
                                y0: significance_threshold.y0,
                                x1: 1,
                                y1: significance_threshold.y1,
                                opacity: 0.2,
                                fillcolor: significance_threshold.color,
                                line: {
                                    width: 0,
                                },
                                name: significance_threshold.significance,
                            }
                        }),
                        showlegend: true,
                        grid: {
                            rows: 1,
                            columns: chrCount,
                            pattern: 'coupled',

                        },
                    }
                    chrDatas.forEach((curr, i) => {
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
                    console.log(layout);
                    Plotly.react(container, traces, layout, { responsive: true });

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
                color: colorScale(parseFloat(st.significance))
            }
        })
    }



    return genomeScan;
}