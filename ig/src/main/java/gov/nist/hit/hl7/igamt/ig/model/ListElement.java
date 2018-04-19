package gov.nist.hit.hl7.igamt.ig.model;

import java.util.Date;
import java.util.List;

public class ListElement {

	private String title;
	private int position;
	private String coverpage;
	private String subtitle;
	private Date dateUpdated;
	private List<String> confrmanceProfiles;
	private String username;

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getCoverpage() {
		return coverpage;
	}

	public void setCoverpage(String coverpage) {
		this.coverpage = coverpage;
	}

	public String getSubtitle() {
		return subtitle;
	}

	public void setSubtitle(String subtitle) {
		this.subtitle = subtitle;
	}

	public Date getDateUpdated() {
		return dateUpdated;
	}

	public void setDateUpdated(java.util.Date date) {
		this.dateUpdated = date;
	}

	public List<String> getConfrmanceProfiles() {
		return confrmanceProfiles;
	}

	public void setConfrmanceProfiles(List<String> confrmanceProfiles) {
		this.confrmanceProfiles = confrmanceProfiles;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public ListElement() {
		// TODO Auto-generated constructor stub
	}

	public int getPosition() {
		return position;
	}

	public void setPosition(int position) {
		this.position = position;
	}

}
