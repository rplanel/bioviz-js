import { select } from "d3-selection";
import { json } from "d3-fetch";
import { BvMaps } from "bioviz-js";
import { Topology, Objects } from "topojson-specification";
import { IsolateCount } from "../../lib/types";

console.log("testttt")
const BigsdbMapComponent = BvMaps()
const bigsdbMap = select("svg")
    .attr("width", 1280)
    .attr("height", 800);


// const countryUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json"
const countryUrl = "https://bigsdb.pasteur.fr/javascript/topojson/countries.json"
const dataCountUrl = "https://bigsdb.pasteur.fr/cgi-bin/bigsdb/bigsdb.pl?db=pubmlst_klebsiella_isolates&page=plugin&name=FieldBreakdown&field=country"
console.log(bigsdbMap)
json<IsolateCount[]>(dataCountUrl).then((dataCount) => {
    json<Topology<Objects<GeoJSON.GeoJsonProperties>>>(countryUrl).then((world) => {
        const dataCountMap: Map<string, IsolateCount> = new Map(dataCount.map(d => [d.label, d]))
        console.log([...dataCountMap.keys()].sort())
        sumIsolateValues(dataCountMap, "United States", "USA")
        sumIsolateValues(dataCountMap, "Spain", "SPAIN")
        sumIsolateValues(dataCountMap, "Brazil", "BRAZIL")
        sumIsolateValues(dataCountMap, "China", "CHINA")
        bigsdbMap.datum(world).call(BigsdbMapComponent, window.innerWidth, dataCountMap);

    })
})


function sumIsolateValues(dataCountMap, countryName, nameSumWith) {
    console.log(dataCountMap.get(nameSumWith))
    console.log(dataCountMap.get(countryName))
    const newValue = dataCountMap.get(countryName).value + dataCountMap.get(nameSumWith).value
    dataCountMap.set(countryName, { ...dataCountMap.get(countryName), value: newValue })
}