import Plotly from "plotly.js-dist";
import { HaplotypeData } from "src/scripts/types";
import * as d3Selection from "d3-selection";
import * as d3Array from "d3-array";

export default function () {
    function haplotype(_selection: d3Selection.Selection<HTMLDivElement, HaplotypeData[], any, any>, colors: Map<string, string>) {
        const getColor = function (key: string) {
            const defaultColor = "#343434"

            if (colors.has(key)) {
                return colors.get(key)
            } else {
                return defaultColor
            }

        }
        _selection.each(function (_data: HaplotypeData[]) {
            const container = this;
            const perHaplotypesMap = d3Array.group(_data, d => d.haplotype)
            // nest<HaplotypeData>()
            //     .key(d => d.Haplotype)
            //     .entries(_data);
            const perHaplotypes = Array.from(perHaplotypesMap, ([key, values]) => ({ key, values }))
            const traces = perHaplotypes.map((haplotype, i) => {
                const j = i + 1;
                const initTrace: Plotly.Data & { boxpoints: string } = {
                    type: "box",
                    marker: {
                        size: 4,
                        color: getColor(haplotype.key)
                    },
                    boxpoints: "all",
                    pointpos: 0,
                    xaxis: "x" + j,
                    yaxis: "y",
                    name: haplotype.key,
                };

                const axisData: { x: string[], y: number[] } = {
                    x: [],
                    y: [],
                    // text: [],
                };

                for (let item of haplotype.values) {
                    axisData.x.push(item.line);
                    axisData.y.push(item.phenotype);
                    // axisData.text.push(item.Line);
                }
                return { ...initTrace, ...axisData };
            });

            const layout: Partial<Plotly.Layout> & { grid: { rows: number, columns: number, pattern: string } } = {
                height: 600,
                grid: {
                    rows: 1,
                    columns: perHaplotypes.length,
                    pattern: 'coupled',

                },
            };
            // perHaplotypes.forEach((item, i) => {
            //     const xaxisIndex = (i === 0) ? "" : i + 1;
            //     const xaxisKey = "xaxis" + xaxisIndex;
            //     layout[xaxisKey] = {
            //         title: item.key,
            //         type: "category"
            //     }
            // })
            layout.yaxis = {
                ...layout.yaxis,
                title: "Phenotype",
            }
            Plotly.react(container, traces, layout, { responsive: true });

        });
    }
    return haplotype;
}