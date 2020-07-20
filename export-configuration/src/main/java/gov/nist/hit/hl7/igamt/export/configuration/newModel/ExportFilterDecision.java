package gov.nist.hit.hl7.igamt.export.configuration.newModel;

import java.util.HashMap;
import java.util.Map;

import gov.nist.hit.hl7.igamt.export.configuration.display.tableOptions.DatatypeTableOptionsDisplay;
import gov.nist.hit.hl7.igamt.export.configuration.display.tableOptions.SegmentTableOptionsDisplay;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportConfiguration;

public class ExportFilterDecision {


  //	private Map<String, Boolean> datatypesLibraryFilterMap = new HashMap<String, Boolean>();
  //	private Map<String, DatatypeLibraryExportConfiguration> OveriddedDatatypesLibraryMap = new HashMap<String, DatatypeLibraryExportConfiguration>();
  private Map<String, Boolean> datatypesFilterMap = new HashMap<String, Boolean>();
  private Map<String, DatatypeExportConfiguration> OveriddedDatatypesMap = new HashMap<String, DatatypeExportConfiguration>();

  private Map<String, Boolean> segmentFilterMap = new HashMap<String, Boolean>();
  private Map<String, SegmentExportConfiguration> OveriddedSegmentMap = new HashMap<String, SegmentExportConfiguration>();

  private Map<String, Boolean> conformanceProfileFilterMap = new HashMap<String, Boolean>();
  private Map<String, ConformanceProfileExportConfiguration> OveriddedConformanceProfileMap = new HashMap<String, ConformanceProfileExportConfiguration>();

  private Map<String, Boolean> valueSetFilterMap = new HashMap<String, Boolean>();
  private Map<String, ValueSetExportConfiguration> OveriddedValueSetMap = new HashMap<String, ValueSetExportConfiguration>();

  boolean delta;
  private Map<String, Boolean> added = new HashMap<String, Boolean>();

  public Map<String, Boolean> getChanged() {
    return changed;
  }

  public void setChanged(Map<String, Boolean> changed) {
    this.changed = changed;
  }

  private Map<String, Boolean> changed = new HashMap<String, Boolean>();




  public ExportFilterDecision(
      Map<String, Boolean> datatypesFilterMap,
      Map<String, DatatypeExportConfiguration> overiddedDatatypesMap, Map<String, Boolean> segmentFilterMap,
      Map<String, SegmentExportConfiguration> overiddedSegmentMap,
      Map<String, Boolean> conformanceProfileFilterMap,
      Map<String, ConformanceProfileExportConfiguration> overiddedConformanceProfileMap,
      Map<String, Boolean> valueSetFilterMap, Map<String, ValueSetExportConfiguration> overiddedValueSetMap) {
    super();
    //		this.datatypesLibraryFilterMap = datatypesLibraryFilterMap;
    //		OveriddedDatatypesLibraryMap = overiddedDatatypesLibraryMap;
    this.datatypesFilterMap = datatypesFilterMap;
    OveriddedDatatypesMap = overiddedDatatypesMap;
    this.segmentFilterMap = segmentFilterMap;
    OveriddedSegmentMap = overiddedSegmentMap;
    this.conformanceProfileFilterMap = conformanceProfileFilterMap;
    OveriddedConformanceProfileMap = overiddedConformanceProfileMap;
    this.valueSetFilterMap = valueSetFilterMap;
    OveriddedValueSetMap = overiddedValueSetMap;
  }

  public ExportFilterDecision() {
    super();
  }

  //	public static ExportFilterDecision CreateExportFilterDecision(ExportConfiguration exportConfiguration) {
  //		ExportFilterDecision exportFilterDecision = new ExportFilterDecision();
  //		Map<String, Boolean> segmentFilterMap = new HashMap<>();
  //		Map<String, SegmentExportConfiguration> overiddedSegmentMap = new HashMap<>();
  //		exportConfiguration.getSegmentExportConfiguration().getFieldsExport().setR(true);
  //		exportConfiguration.getSegmentExportConfiguration().getFieldsExport().setRe(false);
  //		exportConfiguration.getSegmentExportConfiguration().getFieldsExport().setO(false);
  //		exportFilterDecision.setOveriddedSegmentMap(overiddedSegmentMap);
  //		overiddedSegmentMap.put("579654555455fa34e848e353", exportConfiguration.getSegmentExportConfiguration());
  //		return exportFilterDecision;		
  //		}
  //	


  public Map<String, Boolean> getDatatypesFilterMap() {
    return datatypesFilterMap;
  }
  //	public Map<String, Boolean> getDatatypesLibraryFilterMap() {
  //		return datatypesLibraryFilterMap;
  //	}
  //
  //	public void setDatatypesLibraryFilterMap(Map<String, Boolean> datatypesLibraryFilterMap) {
  //		this.datatypesLibraryFilterMap = datatypesLibraryFilterMap;
  //	}
  //
  //	public Map<String, DatatypeLibraryExportConfiguration> getOveriddedDatatypesLibraryMap() {
  //		return OveriddedDatatypesLibraryMap;
  //	}
  //
  //	public void setOveriddedDatatypesLibraryMap(
  //			Map<String, DatatypeLibraryExportConfiguration> overiddedDatatypesLibraryMap) {
  //		OveriddedDatatypesLibraryMap = overiddedDatatypesLibraryMap;
  //	}

  public void setDatatypesFilterMap(Map<String, Boolean> datatypesFilterMap) {
    this.datatypesFilterMap = datatypesFilterMap;
  }
  public Map<String, DatatypeExportConfiguration> getOveriddedDatatypesMap() {
    return OveriddedDatatypesMap;
  }
  public void setOveriddedDatatypesMap(Map<String, DatatypeExportConfiguration> overiddedDatatypesMap) {
    OveriddedDatatypesMap = overiddedDatatypesMap;
  }
  public Map<String, Boolean> getSegmentFilterMap() {
    return segmentFilterMap;
  }
  public void setSegmentFilterMap(Map<String, Boolean> segmentFilterMap) {
    this.segmentFilterMap = segmentFilterMap;
  }
  public Map<String, SegmentExportConfiguration> getOveriddedSegmentMap() {
    return OveriddedSegmentMap;
  }
  public void setOveriddedSegmentMap(Map<String, SegmentExportConfiguration> overiddedSegmentMap) {
    OveriddedSegmentMap = overiddedSegmentMap;
  }
  public Map<String, Boolean> getConformanceProfileFilterMap() {
    return conformanceProfileFilterMap;
  }
  public void setConformanceProfileFilterMap(Map<String, Boolean> conformanceProfileFilterMap) {
    this.conformanceProfileFilterMap = conformanceProfileFilterMap;
  }
  public Map<String, ConformanceProfileExportConfiguration> getOveriddedConformanceProfileMap() {
    return OveriddedConformanceProfileMap;
  }
  public void setOveriddedConformanceProfileMap(
      Map<String, ConformanceProfileExportConfiguration> overiddedConformanceProfileMap) {
    OveriddedConformanceProfileMap = overiddedConformanceProfileMap;
  }
  public Map<String, Boolean> getValueSetFilterMap() {
    return valueSetFilterMap;
  }
  public void setValueSetFilterMap(Map<String, Boolean> valueSetFilterMap) {
    this.valueSetFilterMap = valueSetFilterMap;
  }
  public Map<String, ValueSetExportConfiguration> getOveriddedValueSetMap() {
    return OveriddedValueSetMap;
  }
  public void setOveriddedValueSetMap(Map<String, ValueSetExportConfiguration> overiddedValueSetMap) {
    OveriddedValueSetMap = overiddedValueSetMap;
  }

  public Map<String, Boolean> getAdded() {
    return added;
  }

  public void setAdded(Map<String, Boolean> added) {
    this.added = added;
  }

  public boolean isDelta() {
    return delta;
  }

  public void setDelta(boolean delta) {
    this.delta = delta;
  }


}
