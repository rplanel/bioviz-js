import { LodScoreOnChromosome } from "../../scripts/types";
import { select } from "d3-selection";
import GenomeScan from "../../scripts/component/genome/genome-scan";
import QtlCoef from "../../scripts/component/genome/chromosome/qtl-coefficient";
import { csv } from "d3-fetch";


const genomeScanFile = require('./data/lod_tab.csv');
const significanceThresholdsFile = require('./data/sifgnificance-thresholds.csv');
const qtlCoefCsv = require('./data/dat-plotcoef.csv');

// Code
const data = {};
Promise.all([
  csv(genomeScanFile),
  csv(significanceThresholdsFile),
  csv(qtlCoefCsv),
]).then(([genomeScanData, significanceThresholds, plotCoefData]) => {
  const genomeScan = GenomeScan();
  const data = {
    lod_score_on_chromosome: genomeScanData,
    significance_thresholds: significanceThresholds,
  };

  const qtlCoefPlot = QtlCoef();
  select(".lod-score-chromosomes").datum(data).call(genomeScan);
  select(".qtl-coefficient").datum(plotCoefData).call(qtlCoefPlot);
})

// csv(genomeScanFile).then(function (genomeScanData) {
//   const genomeScan = GenomeScan();
//   select(".genome-scan").datum(genomeScanData).call(genomeScan)
// })
