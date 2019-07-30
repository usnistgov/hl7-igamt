package gov.nist.hit.hl7.igamt.export.configuration.newModel;

import java.util.HashMap;
import java.util.Map;

import gov.nist.hit.hl7.igamt.export.configuration.display.tableOptions.DatatypeTableOptionsDisplay;
import gov.nist.hit.hl7.igamt.export.configuration.display.tableOptions.SegmentTableOptionsDisplay;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportConfiguration;

public class ExportFilterDecision {

	private Map<String, Boolean> datatypesFilterMap;
	private Map<String, DatatypeExportConfiguration> OveriddedDatatypesMap;
	
	private Map<String, Boolean> segmentFilterMap;
	private Map<String, SegmentExportConfiguration> OveriddedSegmentMap;
	
	private Map<String, Boolean> conformanceProfileFilterMap;
	private Map<String, ConformanceProfileExportConfiguration> OveriddedConformanceProfileMap;
	
	private Map<String, Boolean> valueSetFilterMap;
	private Map<String, ValueSetExportConfiguration> OveriddedValueSetMap;
	
	public static ExportFilterDecision CreateExportFilterDecision(ExportConfiguration exportConfiguration) {
		ExportFilterDecision exportFilterDecision = new ExportFilterDecision();
		Map<String, Boolean> segmentFilterMap = new HashMap<>();
		Map<String, SegmentExportConfiguration> overiddedSegmentMap = new HashMap<>();
		exportConfiguration.getSegmentExportConfiguration().getFieldsExport().setR(true);
		exportConfiguration.getSegmentExportConfiguration().getFieldsExport().setRe(false);
		exportConfiguration.getSegmentExportConfiguration().getFieldsExport().setO(false);
		exportFilterDecision.setOveriddedSegmentMap(overiddedSegmentMap);
		overiddedSegmentMap.put("579654555455fa34e848e353", exportConfiguration.getSegmentExportConfiguration());
		return exportFilterDecision;		
		}
	
	public Map<String, Boolean> getDatatypesFilterMap() {
		return datatypesFilterMap;
	}
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
	


	
}
