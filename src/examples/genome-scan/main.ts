import { GenomeScanData } from "../../scripts/types";
import { select } from "d3-selection";
import GenomeScan from "../../scripts/component/genome/genome-scan";

import { csv } from "d3-fetch";


const csv_file = require('./lod_tab.csv');

// Code
const data = {};
csv(csv_file).then(function (genomeScanData) {
  const genomeScan = GenomeScan();
  select(".genome-scan").datum(genomeScanData).call(genomeScan)
})
