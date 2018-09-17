package gov.nist.hit.hl7.igamt.coconstraints.domain;

import java.util.ArrayList;
import java.util.List;


public class CoConstraintTableHeaders {
	
	private List<CoConstraintTableHeader> selectors;
	private List<CoConstraintTableHeader> data;
	private List<CoConstraintTableHeader> user;
	
	public List<CoConstraintTableHeader> getSelectors() {
		return selectors;
	}
	public void setSelectors(List<CoConstraintTableHeader> selectors) {
		this.selectors = selectors;
	}
	public List<CoConstraintTableHeader> getData() {
		return data;
	}
	public void setData(List<CoConstraintTableHeader> data) {
		this.data = data;
	}
	public List<CoConstraintTableHeader> getUser() {
		return user;
	}
	public void setUser(List<CoConstraintTableHeader> user) {
		this.user = user;
	}
	
	public CoConstraintTableHeaders clone(){
		CoConstraintTableHeaders headers = new CoConstraintTableHeaders();
		List<CoConstraintTableHeader> selectors = new ArrayList<>();
		List<CoConstraintTableHeader> data = new ArrayList<>();
		List<CoConstraintTableHeader> user = new ArrayList<>();
		
		for(CoConstraintTableHeader eH : this.selectors){
			selectors.add(eH.clone());
		}
		for(CoConstraintTableHeader eH : this.data){
			data.add(eH.clone());
		}
		for(CoConstraintTableHeader eH : this.user){
			user.add(eH.clone());
		}
		
		headers.selectors = selectors;
		headers.data = data;
		headers.user = user;
		
		return headers;
	}

}
