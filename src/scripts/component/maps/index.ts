import * as d3Geo from "d3-geo"
import { feature } from "topojson-client";
import { Objects, Topology, } from "topojson-specification";
import { Feature, GeoJsonProperties, Geometry } from "geojson";
import { IsolateCount } from "src/scripts/types";
import * as d3Selection from "d3-selection";
import * as d3Scale from "d3-scale";
import * as d3Array from "d3-array";
import * as d3Zoom from "d3-zoom";
import * as d3ScaleChromatic from "d3-scale-chromatic"
import Legend from "../legend"


export default function () {
    let container: d3Selection.Selection<SVGSVGElement, Topology<Objects<GeoJsonProperties>>, any, any>
    let globalG: d3Selection.Selection<SVGGElement, Topology<Objects<GeoJsonProperties>>, any, any>
    let reset = () => { }
    const unknownColor = "#ccc"
    const mapZoom = d3Zoom.zoom<SVGSVGElement, Topology<Objects<GeoJsonProperties>>>()
        .scaleExtent([1, 8])
    let domain: [number, number] = [0, 500]
    const schemeMap = new Map([
        ["blues", d3ScaleChromatic.schemeBlues],
        ["oranges", d3ScaleChromatic.schemeOranges],
        ["purples", d3ScaleChromatic.schemePurples],
        ["reds", d3ScaleChromatic.schemeReds],
        ["greens", d3ScaleChromatic.schemeGreens],
        ["greys", d3ScaleChromatic.schemeGreys]
    ])
    function bigsdb(_selection: d3Selection.Selection<SVGSVGElement, Topology<Objects<GeoJsonProperties>>, any, any>, width: number, isolateCount: Map<string, IsolateCount>, domainParam: [number, number], scheme: "blues" | "oranges" | "purples" = "blues") {
        const isolateCounts = Array.from(isolateCount)
            .filter(([_, country]) => country.label !== "Unknown" && country.label !== "No value")
            .map(item => item[1].value)
        const extentDomain = d3Array.extent(isolateCounts)
        domain = (domainParam) ? domainParam : (extentDomain[0]) ? extentDomain : [0, 0]
        function getHeight(projection: d3Geo.GeoProjection) {
            const outline = { type: "Sphere", geometries: [] }
            const [[x0, y0], [x1, y1]] = d3Geo.geoPath(projection.fitWidth(width, outline)).bounds(outline);
            const dy = Math.ceil(y1 - y0), l = Math.min(Math.ceil(x1 - x0), dy);
            projection.scale(projection.scale() * (l - 1) / l).precision(0.2);
            return dy;

        }

        // const _data = _selection.datum()
        _selection.each(function (_data) {
            if (_data) {
                const countriesFeat = feature(_data, _data.objects.units)
                if (countriesFeat.type === "FeatureCollection") {
                    const projection = d3Geo.geoEqualEarth()
                    const path = d3Geo.geoPath(projection)
                    domain = (domain[0]) ? domain : [0, 0]
                    const theme = schemeMap.get(scheme) || d3ScaleChromatic.schemeBlues
                    const color = d3Scale.scaleQuantize(domain, theme[5])
                    const getCountryColor = (d: Feature<Geometry, GeoJsonProperties>) => {
                        if (d?.properties?.iso3) {
                            const iso3 = d.properties.iso3
                            if (isolateCount.has(iso3)) {
                                const country = isolateCount.get(iso3)
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
                    container = d3Selection.select(this)
                    if (container) {
                        mapZoom.on("zoom", zoomed);
                        const height = getHeight(projection)
                        container
                            .attr("viewBox", `0 0 ${width} ${height + 75}`)

                        globalG = container.select("g");
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
                                d3Selection.select(this).attr("fill", "orange")
                            })
                            .on("mouseout", function (e, d) {
                                d3Selection.select(this).attr("fill", getCountryColor(d))
                            })
                            .on("click", clicked)
                            .append("title")
                            .text(d => {
                                if (d?.properties?.iso3 && d?.properties?.name) {
                                    if (isolateCount.has(d.properties.iso3)) {
                                        const country = isolateCount.get(d.properties.iso3)
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


                        let legendGroup: d3Selection.Selection<SVGGElement, Topology<Objects<GeoJsonProperties>>, any, any> = container.select("g.legend")
                        if (!legendGroup.empty()) {
                            legendGroup.remove()
                        }
                        container.append("g").classed("legend", true)
                            .attr("transform", `translate(${width / 2 - legendWidth / 2}, ${height + 10})`)
                            .call(Legend(), { color, width: legendWidth, marginLeft: 10 })

                        container.call(mapZoom);

                        function zoomed(event: d3Zoom.D3ZoomEvent<SVGSVGElement, Topology<Objects<GeoJsonProperties>>>) {
                            const { transform } = event;
                            globalG.attr("transform", transform.toString());
                            globalG.attr("stroke-width", 1 / transform.k);
                        }
                        function clicked(event: any, d: d3Geo.GeoPermissibleObjects) {
                            const [[x0, y0], [x1, y1]] = path.bounds(d);
                            event.stopPropagation();
                            container.transition().duration(750).call(
                                mapZoom.transform,
                                d3Zoom.zoomIdentity
                                    .translate(width / 2, height / 2)
                                    .scale(Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height)))
                                    .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
                            );
                        }
                        reset = () => {
                            globalG.transition().style("fill", null);
                            const node = container.node()
                            if (node) {
                                container.transition().duration(750).call(
                                    mapZoom.transform,
                                    d3Zoom.zoomIdentity,
                                    d3Zoom.zoomTransform(node).invert([width / 2, height / 2])
                                );
                            }
                        }
                        container.on("click", reset)

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
    bigsdb.reset = () => reset()
    bigsdb.themes = () => schemeMap.keys()
    return bigsdb

}




