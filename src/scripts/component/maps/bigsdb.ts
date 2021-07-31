import { geoPath, geoEqualEarth, GeoProjection } from "d3-geo"
import { feature } from "topojson-client";
import { Objects, Topology, GeometryCollection, GeometryObject } from "topojson-specification";
import * as GeoJSON from "geojson";
import { json } from "d3-fetch"
import { IsolateCount } from "src/scripts/types";
import { Selection, select } from "d3-selection";
import { scaleQuantize, scaleSequential } from "d3-scale";
import { extent } from "d3-array";
import { interpolateBlues, interpolateViridis } from "d3";
import { schemeBlues } from "d3-scale-chromatic"
import Legend from "../legend"






export default function () {



    const unknownColor = "#ccc"
    function bigsdb(_selection: Selection<SVGSVGElement, Topology<Objects<GeoJSON.GeoJsonProperties>>, any, any>, width: number, isolateCount: Map<string, IsolateCount>) {

        function getHeight(projection: GeoProjection) {
            const outline = { type: "Sphere", geometries: [] }
            const [[x0, y0], [x1, y1]] = geoPath(projection.fitWidth(width, outline)).bounds(outline);
            const dy = Math.ceil(y1 - y0), l = Math.min(Math.ceil(x1 - x0), dy);
            projection.scale(projection.scale() * (l - 1) / l).precision(0.2);
            return dy;

        }
        const _data = _selection.datum()
        if (_data) {
            console.log('world')
            console.log(_data)

            const countriesFeat = feature(_data, _data.objects.units)
            if (countriesFeat.type === "FeatureCollection") {

                const projection = geoEqualEarth()
                const path = geoPath(projection)
                const color = scaleQuantize([0, 500], schemeBlues[5])
                const containerNode = _selection.node()
                if (containerNode) {
                    const container = select(containerNode);
                    // draw legend
                    const legendWidthUnit = width / 4
                    container.call(Legend(), { color, width: 3 * legendWidthUnit, marginLeft: 1 * legendWidthUnit })
                    container
                        .attr("viewBox", `0 0 ${width} ${getHeight(projection)}`)
                        // .attr("width", width)
                        // .attr("height", getHeight(projection))
                    container.append("g")
                        .attr("transform", "translate(0, 75)")
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
                }
            }
        }

    }
    return bigsdb

}




