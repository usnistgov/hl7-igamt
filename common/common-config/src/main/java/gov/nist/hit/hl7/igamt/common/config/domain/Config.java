package gov.nist.hit.hl7.igamt.common.config.domain;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
public class Config {
	@Id
	String id;
	
	List<String> hl7Versions=new ArrayList<String>();
	List<String> usages=new ArrayList<String>();
	private String phinvadsUrl; 

	

	public List<String> getHl7Versions() {
		return hl7Versions;
	}



	public void setHl7Versions(List<String> hl7Versions) {
		this.hl7Versions = hl7Versions;
	}



	public List<String> getUsages() {
		return usages;
	}



	public void setUsages(List<String> usages) {
		this.usages = usages;
	}



	public Config() {
		
	}



	public String getPhinvadsUrl() {
		return phinvadsUrl;
	}



	public void setPhinvadsUrl(String phinvadsUrl) {
		this.phinvadsUrl = phinvadsUrl;
	}

}
