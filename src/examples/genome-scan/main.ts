import { GenomeScanData, HaplotypeData, PlotCoefData, SnpsData, SnpData } from "../../scripts/types";
import { select } from "d3-selection";
import GenomeScan from "../../scripts/component/genome/genome-scan";
import QtlCoef from "../../scripts/component/genome/chromosome/qtl-coefficient";
import Haplotype from "../../scripts/component/genome/chromosome/haplotype";
import Snps from "../../scripts/component/genome/chromosome/snps";
import { csv } from "d3-fetch";
import { cpus } from "os";

// Csv data file
const genomeScanFile = require('./data/lod_tab.csv');
const significanceThresholdsFile = require('./data/sifgnificance-thresholds.csv');
const qtlCoefCsv = require('./data/dat-plotcoef.csv');
const haplotypeCsv = require('./data/dat_plot_haplo.csv');
const snpsCsv = require('./data/dat_plot_snps.csv');
const snpCsv = require("./data/dat_plot_snp_boxplot.csv");

// Code
const data = {};
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
  const qtlCoefPlot = QtlCoef();
  const haplotypePlot = Haplotype();
  const snpPlot = Snps();
  // Data
  const haplotypeData: HaplotypeData[] = rawHaplotypeData.map(item => ({
    ...item,
    Phenotype: parseFloat(item.Phenotype),
    Haplotype: item.Haplotype,
    Line: item.Line,
  }))
  const data: GenomeScanData = {
    lod_score_on_chromosome: genomeScanData.map(item => ({
      ...item,
      pos: parseInt(item.pos),
      chr: item.chr,
      marker: item.marker,
      lod: parseFloat(item.lod)
    })),
    significance_thresholds: significanceThresholds.map(item => ({
      ...item,
      significance: item.significance,
      threshold: parseFloat(item.threshold)
    })),
  };
  const plotCoefData: PlotCoefData[] = rawPlotCoefData.map(item => ({
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


  const snpsData: SnpsData[] = rawSnpsData.map(item => ({
    ...item,
    snp_id: item.snp_id,
    chr: item.chr,
    pos: parseFloat(item.pos),
    lod: parseFloat(item.lod)
  }));
  const snpData: SnpData[] = rawSnpData.map(item => {
    return {
      ...item,
      line: item.line,
      phenotype: parseFloat(item.phenotype),
      genotype: item.genotype,
      strains: item.strains
    }
  })
  console.log(snpData);

  select(".lod-score-chromosomes").datum(data).call(genomeScan);
  select(".qtl-coefficient").datum(plotCoefData).call(qtlCoefPlot);
  select(".haplotype").datum(haplotypeData).call(haplotypePlot);
  select(".snps").datum(snpsData).call(snpPlot);

})
