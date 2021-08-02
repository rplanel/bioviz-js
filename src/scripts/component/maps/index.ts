import { geoPath, geoEqualEarth, GeoProjection } from "d3-geo"
import { feature } from "topojson-client";
import { Objects, Topology } from "topojson-specification";
import { GeoJsonProperties } from "geojson";
import { IsolateCount } from "src/scripts/types";
import { Selection, select } from "d3-selection";
import { scaleQuantize } from "d3-scale";
import { extent } from "d3-array";
import { zoom, D3ZoomEvent } from "d3-zoom";
import { schemeBlues } from "d3-scale-chromatic"
import Legend from "../legend"


export default function () {
    let container: Selection<SVGSVGElement, Topology<Objects<GeoJsonProperties>>, any, any>;
    const unknownColor = "#ccc"
    const mapZoom = zoom<SVGSVGElement, Topology<Objects<GeoJsonProperties>>>()
        .scaleExtent([1, 8])

    function bigsdb(_selection: Selection<SVGSVGElement, Topology<Objects<GeoJsonProperties>>, any, any>, width: number, isolateCount: Map<string, IsolateCount>) {
        function getHeight(projection: GeoProjection) {
            const outline = { type: "Sphere", geometries: [] }
            const [[x0, y0], [x1, y1]] = geoPath(projection.fitWidth(width, outline)).bounds(outline);
            const dy = Math.ceil(y1 - y0), l = Math.min(Math.ceil(x1 - x0), dy);
            projection.scale(projection.scale() * (l - 1) / l).precision(0.2);
            return dy;

        }
        // const _data = _selection.datum()
        _selection.each(function (_data) {
            if (_data) {
                const countriesFeat = feature(_data, _data.objects.units)
                if (countriesFeat.type === "FeatureCollection") {
                    const projection = geoEqualEarth()
                    const path = geoPath(projection)
                    const isolateCounts = Array.from(isolateCount)
                        .filter(([_, country]) => country.label !== "Unknown" && country.label !== "No value")
                        .map(item => item[1].value)
                    let domain = extent(isolateCounts)
                    domain = (domain[0]) ? domain : [0, 0]
                    const color = scaleQuantize(domain, schemeBlues[5])

                    container = select(this)
                    if (container) {
                        mapZoom.on("zoom", zoomed);
                        const height = getHeight(projection)
                        container
                            .attr("viewBox", `0 0 ${width} ${height + 75}`)
                        const globalG = container.append("g");
                        globalG
                            // .attr("transform", "translate(0, 75)")
                            .selectAll("path")
                            .data(countriesFeat.features)
                            .join("path")
                            .attr("stroke", "darkgrey")
                            .attr("fill", d => {
                                if (d?.properties?.name) {
                                    if (isolateCount.has(d.properties.name)) {
                                        const country = isolateCount.get(d.properties.name)
                                        if (country && country.value) {
                                            return color(country.value)
                                        }
                                        else {
                                            return unknownColor
                                        }
                                    } else { return unknownColor }
                                }
                                else { return unknownColor }
                            })
                            .attr("d", path)
                            .append("title")
                            .text(d => {
                                if (d?.properties?.name) {
                                    if (isolateCount.has(d.properties.name)) {
                                        const country = isolateCount.get(d.properties.name)
                                        if (country && country.value) {
                                            return `${d.properties.name} - ${country.value}`
                                        }
                                        else { return `${d.properties.name} - N/A` }
                                    }
                                    else { return `${d.properties.name} - N/A` }
                                }
                                else { return "N/A" }
                            });



                        // Draw Legend
                        // const legendWidthUnit = width / 4
                        const legendWidth = width < 450 ? width - width / 3 : 450
                        container
                            .append("g")
                            .attr("transform", `translate(${width / 2 - legendWidth / 2}, ${height + 10})`)
                            .call(Legend(), { color, width: legendWidth, marginLeft: 10 })

                        container.call(mapZoom);

                        function zoomed(event: D3ZoomEvent<SVGSVGElement, Topology<Objects<GeoJsonProperties>>>) {
                            const { transform } = event;
                            globalG.attr("transform", transform.toString());
                            globalG.attr("stroke-width", 1 / transform.k);
                        }
                    }
                    else { console.log("No container defined") }
                } else {
                    console.log("No FeatureCollection")
                }
            } else { console.log("no data") }
        })

    }
    bigsdb.zoomIn = () => container.transition().call(mapZoom.scaleBy, 2)
    bigsdb.zoomOut = () => container.transition().call(mapZoom.scaleBy, 0.5)
    return bigsdb

}




