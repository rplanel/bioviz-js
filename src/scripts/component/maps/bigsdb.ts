import { geoPath, geoEqualEarth, GeoProjection } from "d3-geo"
import { feature } from "topojson-client";
import { Objects, Topology, GeometryCollection, GeometryObject } from "topojson-specification";
import * as GeoJSON from "geojson";
import { json } from "d3-fetch"
import { IsolateCount } from "src/scripts/types";
import { Selection, select } from "d3-selection";
import { scaleSequential } from "d3-scale";
import { extent } from "d3-array";
import { interpolateBlues } from "d3";

export default function () {



    console.log("dans document fffff")

    function bigsdb(_selection: Selection<SVGGElement, Topology, any, any>, width: number, isolateCount: Map<string, IsolateCount>) {

        function getHeight(projection: GeoProjection) {
            const outline = { type: "Sphere", geometries: [] }
            const [[x0, y0], [x1, y1]] = geoPath(projection.fitWidth(width, outline)).bounds(outline);
            const dy = Math.ceil(y1 - y0), l = Math.min(Math.ceil(x1 - x0), dy);
            projection.scale(projection.scale() * (l - 1) / l).precision(0.2);
            return dy;

        }
        _selection.each(function (_data) {

            if (_data) {
                console.log('world')
                console.log(_data)

                const countriesFeat = feature(_data, _data.objects.units)
                if (countriesFeat.type === "FeatureCollection") {
                    const projection = geoEqualEarth()
                    const path = geoPath(projection)
                    console.log(countriesFeat)


                    const domain = extent(Array.from(isolateCount, d => d[1].value)).map(d => d ? d : 0)
                    // let color = colorbrewer.Blues[5]
                    const color = scaleSequential()
                        .domain(domain)
                        .interpolator(interpolateBlues)
                        .unknown("#ccc")
                    const container = select(this);
                    const genomeBrowser = container
                    container
                        .attr("width", width)
                        .attr("height", getHeight(projection))
                    container.append("g")
                        .selectAll("path")
                        .data(countriesFeat.features)
                        .join("path")
                        .attr("stroke", "darkgrey")
                        .attr("fill", d => {
                            if (d && d.properties && d.properties.name) {
                                // console.log(d.properties.name)
                                console.log(isolateCount)
                                console.log(d.properties.name)
                                console.log(isolateCount.get(d.properties.name))
                                const value = isolateCount.get(d.properties.name) ? isolateCount.get(d.properties.name).value : null
                                if (!value) { console.log(d.properties.name) }
                                return color(value)
                            }
                            else { color(-1) }
                        })
                        .attr("d", path)
                        .append("title")
                        .text(d => `${d.properties.name}
${isolateCount.has(d.properties.name) ? isolateCount.get(d.properties.name).value : "N/A"}`);
                }
            }
        })
    }
    return bigsdb

}




