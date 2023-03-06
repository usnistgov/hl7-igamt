package gov.nist.hit.hl7.igamt.common.config.domain;

import java.util.Set;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Id;


@Document(collection = "userConfig")
public class UserConfig {
	@Id
	private String id;
	
	private String username;
	
	private Boolean includeIX = false;

	public UserConfig() {
		super();
	}

	public Boolean getIncludeIX() {
		return includeIX;
	}

	public void setIncludeIX(Boolean includeIX) {
		this.includeIX = includeIX;
	}

	public String getUsername() {
		return username;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public static UserConfig GenerateDefault() {
		UserConfig defaultConfig = new UserConfig();
		defaultConfig.setIncludeIX(false);
		
		return defaultConfig;
	}

}
