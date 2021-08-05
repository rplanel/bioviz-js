import Plotly, { Data, Layout } from "plotly.js-dist";
import { SnpDataPerGenotype } from "src/scripts/types";
import * as d3Selection from "d3-selection";

export default function () {
    function snp(_selection: d3Selection.Selection<HTMLDivElement, SnpDataPerGenotype[], any, any>, colors: Map<string, string>) {
        const getColor = function (key: string) {
            const defaultColor = "#343434"

            if (colors.has(key)) {
                return colors.get(key)
            } else {
                return defaultColor
            }

        }
        _selection.each(function (_data: SnpDataPerGenotype[]) {
            const container = this;
            const traces: Partial<Plotly.PlotData>[] = _data.map((genotype, i) => {
                const j = i + 1;
                const initTrace: Data & { boxpoints: string } = {
                    type: "box",
                    marker: {
                        size: 4,
                        color: getColor(genotype.key)
                    },
                    boxpoints: "all",
                    pointpos: 0,
                    boxmean: true,
                    // xaxis: "x" + j,
                    yaxis: "y",
                    name: genotype.key,
                };
                const axisData: { y: number[], text: string[] } = {
                    // x: [],
                    y: [],
                    text: [],
                };
                for (let item of genotype.values) {
                    // axisData.x.push(item.genotype);
                    axisData.y.push(item.phenotype);
                    axisData.text.push(item.line);
                }
                return { ...initTrace, ...axisData };
            })
            const layout: Partial<Layout> = {
                height: 600,
                // grid: {
                //     rows: 1,
                //     columns: _data.length,
                //     pattern: 'coupled',
                // },
                yaxis: { title: "Phenotype" },
                xaxis: { fixedrange: true }
            };
            Plotly.react(container, traces, layout, { responsive: true });
        });
    }
    return snp;
}