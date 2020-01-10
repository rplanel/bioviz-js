// import { GenomeScanData, HaplotypeData, PlotCoefData, SnpsData, SnpData } from "bioviz-js";
import { select } from "d3-selection";

import { Types, GenomeScan, QtlCoefficient, Haplotype, Snps, Snp } from "bioviz-js";

// import GenomeScan from "../../scripts/component/qtl/genome-scan";
// import QtlCoef from "../../scripts/component/qtl/qtl-coefficient";
// import Haplotype from "../../scripts/component/qtl/haplotype";
// import Snps from "../../scripts/component/qtl/snps";
// import Snp from "../../scripts/component/qtl/snp";


import { csv } from "d3-fetch";

// Csv data file
const genomeScanFile = require('./data/lod_tab.csv');
const significanceThresholdsFile = require('./data/sifgnificance-thresholds.csv');
const qtlCoefCsv = require('./data/dat-plotcoef.csv');
const haplotypeCsv = require('./data/dat_plot_haplo.csv');
const snpsCsv = require('./data/dat_plot_snps.csv');
const snpCsv = require("./data/dat_plot_snp_boxplot.csv");

// Code
Promise.all([
  csv(genomeScanFile),
  csv(significanceThresholdsFile),
  csv(qtlCoefCsv),
  csv(haplotypeCsv),
  csv(snpsCsv),
  csv(snpCsv),
]).then(([genomeScanData, significanceThresholds, rawPlotCoefData, rawHaplotypeData, rawSnpsData, rawSnpData]) => {
  // Plot component
  const genomeScan = GenomeScan();
  const qtlCoefPlot = QtlCoefficient();
  const haplotypePlot = Haplotype();
  const snpsPlot = Snps();
  const snpPlot = Snp();

  // Data
  const haplotypeData: Types.HaplotypeData[] = rawHaplotypeData.map(item => ({
    ...item,
    Phenotype: parseFloat(item.Phenotype),
    Haplotype: item.Haplotype,
    Line: item.Line,
  }))
  const data: Types.GenomeScanData = {
    lod_score_per_chromosome: genomeScanData.map(item => ({
      ...item,
      pos: parseInt(item.pos),
      chr: item.chr,
      marker: item.marker,
      lod: parseFloat(item.lod)
    })),
    significance_thresholds: significanceThresholds.map(item => ({
      ...item,
      significance: parseFloat(item.significance),
      threshold: parseFloat(item.threshold)
    })),
  };
  const plotCoefData: Types.PlotCoefData[] = rawPlotCoefData.map(item => ({
    ...item,
    marker: item.marker,
    chr: item.chr,
    pos: parseFloat(item.pos),
    lod: parseFloat(item.lod),
    A: parseFloat(item.A),
    B: parseFloat(item.B),
    C: parseFloat(item.C),
    D: parseFloat(item.D),
    E: parseFloat(item.E),
    F: parseFloat(item.F),
    G: parseFloat(item.D),
    H: parseFloat(item.H),
  }));


  const snpsData: Types.SnpsData[] = rawSnpsData.map(item => ({
    ...item,
    snp_id: item.snp_id,
    chr: item.chr,
    pos: parseFloat(item.pos),
    lod: parseFloat(item.lod)
  }));
  const snpData: Types.SnpData[] = rawSnpData.map(item => {
    return {
      ...item,
      line: item.line,
      phenotype: parseFloat(item.phenotype),
      genotype: item.genotype,
      strains: item.strains
    }
  })
  select(".lod-score-chromosomes").datum(data).call(genomeScan);
  select(".qtl-coefficient").datum(plotCoefData).call(qtlCoefPlot);
  select(".haplotype").datum(haplotypeData).call(haplotypePlot);
  select(".snps").datum(snpsData).call(snpsPlot);
  select(".snp").datum(snpData).call(snpPlot);

})
