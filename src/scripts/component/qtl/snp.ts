import Plotly, { Data, Layout } from "plotly.js-dist";
import { SnpData } from "src/scripts/types";
import { Selection } from "d3-selection";
import { group } from "d3-array"
// import { nest } from "d3-collection";

export default function () {
    function snp(_selection: Selection<HTMLDivElement, SnpData[], any, any>) {
        _selection.each(function (_data: SnpData[]) {
            const container = this;
            const perGenotypeMap = group(_data, d => d.genotype)
            const perGenotype = Array.from(perGenotypeMap, ([key, values]) => ({ key, values }))
            const traces = perGenotype.map((genotype, i) => {
                const j = i + 1;
                const initTrace: Data & { boxpoints: string } = {
                    type: "box",
                    marker: {
                        size: 4,
                    },
                    boxpoints: "all",
                    boxmean: true,
                    xaxis: "x" + j,
                    yaxis: "y",
                    name: genotype.key,
                };
                const axisData: { x: string[], y: number[], text: string[] } = {
                    x: [],
                    y: [],
                    text: [],
                };

                for (let item of genotype.values) {
                    axisData.x.push(item.genotype);
                    axisData.y.push(item.phenotype);
                    axisData.text.push(item.line);
                }
                return { ...initTrace, ...axisData };
            })
            const layout: Partial<Layout> & { grid: { rows: number, columns: number, pattern: string } } = {
                height: 600,
                grid: {
                    rows: 1,
                    columns: perGenotype.length,
                    pattern: 'coupled',

                },
            };
            Plotly.react(container, traces, layout, { responsive: true });

        });
    }
    return snp;
}