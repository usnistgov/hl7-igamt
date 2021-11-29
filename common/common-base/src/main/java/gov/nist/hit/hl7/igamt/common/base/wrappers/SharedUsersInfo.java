package gov.nist.hit.hl7.igamt.common.base.wrappers;

import java.util.List;

public class SharedUsersInfo {

	private String currentAuthor;
	private List<String> sharedUsers;

	public SharedUsersInfo() {
		super();
	}

	public String getCurrentAuthor() {
		return currentAuthor;
	}

	public void setCurrentAuthor(String currentAuthor) {
		this.currentAuthor = currentAuthor;
	}

	public List<String> getSharedUsers() {
		return sharedUsers;
	}

	public void setSharedUsers(List<String> sharedUsers) {
		this.sharedUsers = sharedUsers;
	}

}
