package gov.nist.hit.hl7.igamt.ig.model;

import java.util.Date;

public class TreeData {
	
	private String label;
	private Date dateUpdated;
	private int position; 
	

	public String getLabel() {
		return label;
	}

	public void setLabel(String label) {
		this.label = label;
	}

	public TreeData() {
		super();
		// TODO Auto-generated constructor stub
	}

	public Date getDateUpdated() {
		return dateUpdated;
	}

	public void setDateUpdated(Date dateUpdated) {
		this.dateUpdated = dateUpdated;
	}

	public int getPosition() {
		return position;
	}

	public void setPosition(int position) {
		this.position = position;
	} 


	

}
