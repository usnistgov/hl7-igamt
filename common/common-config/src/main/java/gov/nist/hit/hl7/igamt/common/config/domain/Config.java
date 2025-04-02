package gov.nist.hit.hl7.igamt.common.config.domain;

import java.util.ArrayList;
import java.util.HashMap;
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
	private List<ConnectingInfo> connection = new ArrayList<ConnectingInfo>();
	private HashMap<String, BindingInfo> valueSetBindingConfig = new HashMap<String, BindingInfo>();
	private HashMap<String,Object> froalaConfig; 
	private String phinvadsReferenceUrl;
	private Integer codesLimit;
	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public HashMap<String, BindingInfo> getValueSetBindingConfig() {
		return valueSetBindingConfig;
	}

	public void setValueSetBindingConfig(HashMap<String, BindingInfo> valueSetBindingConfig) {
		this.valueSetBindingConfig = valueSetBindingConfig;
	}

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

	public List<ConnectingInfo> getConnection() {
		return connection;
	}

	public void setConnection(List<ConnectingInfo> connection) {
		this.connection = connection;
	}

	public HashMap<String, Object> getFroalaConfig() {
    return froalaConfig;
  }

    public void setFroalaConfig(HashMap<String, Object> froalaConfig) {
    this.froalaConfig = froalaConfig;
  }

	public Integer getCodesLimit() {
		return codesLimit;
	}

	public void setCodesLimit(Integer codesLimit) {
		this.codesLimit = codesLimit;
	}

	public String getPhinvadsReferenceUrl() {
		return phinvadsReferenceUrl;
	}

	public void setPhinvadsReferenceUrl(String phinvadsReference) {
		this.phinvadsReferenceUrl = phinvadsReference;
	}
}
