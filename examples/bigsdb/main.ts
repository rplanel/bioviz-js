import { select } from "d3-selection";
import { json } from "d3-fetch";
import { IsolateCount, BigsdbMap } from "bioviz-js";
import { Topology } from "topojson-specification";

console.log("testttt")
const BigsdbMapComponent = BigsdbMap()
const bigsdbMap = select("svg")
    .attr("width", 1280)
    .attr("height", 800);

// const countryUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json"
const countryUrl = "https://bigsdb.pasteur.fr/javascript/topojson/countries.json"
const dataCountUrl = "https://bigsdb.pasteur.fr/cgi-bin/bigsdb/bigsdb.pl?db=pubmlst_klebsiella_isolates&page=plugin&name=FieldBreakdown&field=country"
console.log(bigsdbMap)
json<Array<IsolateCount>>(dataCountUrl).then(dataCount => {
    json<Topology>(countryUrl).then((world) => {
        console.log(dataCount)
        const dataCountMap = new Map(dataCount.map(d => [d.label, d]))
        console.log(dataCountMap)
        console.log(world)
        bigsdbMap.datum(world).call(BigsdbMapComponent, window.innerWidth, dataCountMap);

    })
})


