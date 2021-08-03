import * as d3 from "d3"
import { geoPath, geoEqualEarth, GeoProjection } from "d3-geo"
import { feature } from "topojson-client";
import { Objects, Topology, } from "topojson-specification";
import { Feature, GeoJsonProperties, Geometry } from "geojson";
import { GeoPermissibleObjects } from "d3-geo"
import { IsolateCount } from "src/scripts/types";
import { Selection, select } from "d3-selection";
import { scaleQuantize } from "d3-scale";
import { extent } from "d3-array";
import { zoom, D3ZoomEvent, zoomIdentity, } from "d3-zoom";
import { schemeBlues, schemeOranges, schemePurples, schemeReds, schemeGreens, schemeGreys } from "d3-scale-chromatic"
import Legend from "../legend"


export default function () {
    let container: Selection<SVGSVGElement, Topology<Objects<GeoJsonProperties>>, any, any>;
    const unknownColor = "#ccc"
    const mapZoom = zoom<SVGSVGElement, Topology<Objects<GeoJsonProperties>>>()
        .scaleExtent([1, 8])
    let domain: [number, number] = [0, 500]
    const schemeMap = new Map([
        ["blues", schemeBlues],
        ["oranges", schemeOranges],
        ["purples", schemePurples],
        ["reds", schemeReds],
        ["greens", schemeGreens],
        ["greys", schemeGreys]
    ])
    function bigsdb(_selection: Selection<SVGSVGElement, Topology<Objects<GeoJsonProperties>>, any, any>, width: number, isolateCount: Map<string, IsolateCount>, domainParam: [number, number], scheme: "blues" | "oranges" | "purples" = "blues") {
        const isolateCounts = Array.from(isolateCount)
            .filter(([_, country]) => country.label !== "Unknown" && country.label !== "No value")
            .map(item => item[1].value)
        const extentDomain = extent(isolateCounts)
        domain = (domainParam) ? domainParam : (extentDomain[0]) ? extentDomain : [0, 0]
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

                    domain = (domain[0]) ? domain : [0, 0]
                    const theme = schemeMap.get(scheme) || schemeBlues
                    const color = scaleQuantize(domain, theme[5])
                    const getCountryColor = (d: Feature<Geometry, GeoJsonProperties>) => {
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
                    }
                    container = select(this)
                    if (container) {
                        mapZoom.on("zoom", zoomed);
                        const height = getHeight(projection)
                        container
                            .attr("viewBox", `0 0 ${width} ${height + 75}`)
                        let globalG: Selection<SVGGElement, Topology<Objects<GeoJsonProperties>>, any, any> = container.select("g");
                        if (globalG.empty()) {
                            globalG = container.append("g")
                        }
                        globalG
                            // .attr("transform", "translate(0, 75)")
                            .selectAll("path")
                            .data(countriesFeat.features)
                            .join("path")
                            .attr("stroke", "darkgrey")
                            .attr("fill", getCountryColor)
                            .attr("d", path)
                            .on("mouseover", function () {
                                select(this).attr("fill", "orange")
                            })
                            .on("mouseout", function (e, d) {
                                select(this).attr("fill", getCountryColor(d))
                            })
                            .on("click", clicked)
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


                        let legendGroup: Selection<SVGGElement, Topology<Objects<GeoJsonProperties>>, any, any> = container.select("g.legend")
                        if (!legendGroup.empty()) {
                            legendGroup.remove()
                        }
                        container.append("g").classed("legend", true)
                            .attr("transform", `translate(${width / 2 - legendWidth / 2}, ${height + 10})`)
                            .call(Legend(), { color, width: legendWidth, marginLeft: 10 })

                        container.call(mapZoom);

                        function zoomed(event: D3ZoomEvent<SVGSVGElement, Topology<Objects<GeoJsonProperties>>>) {
                            const { transform } = event;
                            globalG.attr("transform", transform.toString());
                            globalG.attr("stroke-width", 1 / transform.k);
                        }
                        function clicked(event: any, d: GeoPermissibleObjects) {
                            const [[x0, y0], [x1, y1]] = path.bounds(d);
                            event.stopPropagation();
                            container.transition().duration(750).call(
                                mapZoom.transform,
                                zoomIdentity
                                    .translate(width / 2, height / 2)
                                    .scale(Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height)))
                                    .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
                            );
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
    bigsdb.themes = () => schemeMap.keys()
    return bigsdb

}




