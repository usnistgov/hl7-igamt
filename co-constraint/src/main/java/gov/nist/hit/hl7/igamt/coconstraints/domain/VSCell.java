package gov.nist.hit.hl7.igamt.coconstraints.domain;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonTypeName;

@JsonTypeName("ValueSet")
public class VSCell extends CoConstraintTableCell {
	
	private List<VSValue> vs;

	public List<VSValue> getVs() {
		return vs;
	}

	public void setVs(List<VSValue> vs) {
		this.vs = vs;
	}
	
	public VSCell clone(){
		VSCell cell = new VSCell();
		cell.type = this.type;
		cell.vs = new ArrayList<>(vs);
		return cell;
	}

}
