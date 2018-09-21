package gov.nist.hit.hl7.igamt.coconstraints.domain;

public class CoConstraintTableGroup {
	
	private CoConstraintGroupData data;
	private CoConstraintTableContent content;
	
	public CoConstraintGroupData getData() {
		return data;
	}
	public void setData(CoConstraintGroupData data) {
		this.data = data;
	}
	public CoConstraintTableContent getContent() {
		return content;
	}
	public void setContent(CoConstraintTableContent content) {
		this.content = content;
	}
	
	public CoConstraintTableGroup clone(){
		CoConstraintTableGroup data = new CoConstraintTableGroup();
		
		data.data = this.data.clone();
		data.content = this.content.clone();
		
		
		return data;
	}

}
