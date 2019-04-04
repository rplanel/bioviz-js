import GeneComponent, { GeneData } from "./component/sequence/gene";
import GenomeAxis from "./component/sequence/genome-axis";

export default function () {
  function genomeBrowser(_selection) { 
    _selection.each();
  }
  return genomeBrowser;
}