package gov.nist.hit.hl7.igamt.serialization.predicate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import gov.nist.hit.hl7.igamt.constraints.domain.DisplayPredicate;


public class ConstraintExportMaps {
	
	private Map<String,Set<DisplayPredicate>> datatypePredicateMap = new HashMap<>();
	private Map<String,Set<DisplayPredicate>> segmentPredicateMap = new HashMap<>();
	private Map<String,Set<DisplayPredicate>> conformanceProfilePredicateMap = new HashMap<>();
	
	public Map<String, Set<DisplayPredicate>> getDatatypePredicateMap() {
		return datatypePredicateMap;
	}
	public void setDatatypePredicateMap(Map<String, Set<DisplayPredicate>> datatypePredicateMap) {
		this.datatypePredicateMap = datatypePredicateMap;
	}
	public Map<String, Set<DisplayPredicate>> getSegmentPredicateMap() {
		return segmentPredicateMap;
	}
	public void setSegmentPredicateMap(Map<String, Set<DisplayPredicate>> segmentPredicateMap) {
		this.segmentPredicateMap = segmentPredicateMap;
	}
	public Map<String, Set<DisplayPredicate>> getConformanceProfilePredicateMap() {
		return conformanceProfilePredicateMap;
	}
	public void setConformanceProfilePredicateMap(Map<String, Set<DisplayPredicate>> conformanceProfilePredicateMap) {
		this.conformanceProfilePredicateMap = conformanceProfilePredicateMap;
	}
	
	

	

}
