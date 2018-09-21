package gov.nist.hit.hl7.igamt.coconstraints.domain;


import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;

public class CoConstraintTableRow {

	private Map<String, CoConstraintTableCell> cells;
	private CoConstraintTableRequirement requirements;

	public CoConstraintTableCell get(String key) {
		return cells.get(key);
	}

	public CoConstraintTableRequirement getRequirements() {
		return requirements;
	}

	public void setRequirements(CoConstraintTableRequirement requirements) {
		this.requirements = requirements;
	}

	public Map<String, CoConstraintTableCell> getCells() {
		return cells;
	}

	public void setCells(Map<String, CoConstraintTableCell> cells) {
		this.cells = cells;
	}
	
	public CoConstraintTableRow clone() throws CloneNotSupportedException{
		CoConstraintTableRow row = new CoConstraintTableRow();
		row.requirements = this.requirements.clone();
		Map<String, CoConstraintTableCell> cells = new HashMap<>();
		for(Entry<String, CoConstraintTableCell> entry : cells.entrySet()){
			cells.put(entry.getKey(), entry.getValue().cloneCell());
		}
		row.cells = cells;
		return row;
	}
	
}
