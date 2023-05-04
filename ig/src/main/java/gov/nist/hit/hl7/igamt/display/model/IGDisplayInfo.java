package gov.nist.hit.hl7.igamt.display.model;

import java.util.HashSet;
import java.util.Set;

import gov.nist.hit.hl7.igamt.common.base.domain.display.DisplayElement;
import gov.nist.hit.hl7.igamt.common.base.model.EntityLocation;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;

public class IGDisplayInfo {

	private Ig ig;
	private String resourceVersionSyncToken;
	private Set<DisplayElement> messages = new HashSet<DisplayElement>();
	private Set<DisplayElement> segments = new HashSet<DisplayElement>();
	private Set<DisplayElement> datatypes = new HashSet<DisplayElement>();
	private Set<DisplayElement> valueSets = new HashSet<DisplayElement>();
	private Set<DisplayElement> coConstraintGroups = new HashSet<DisplayElement>();
	private Set<DisplayElement> profileComponents = new HashSet<DisplayElement>();
	private Set<DisplayElement> compositeProfiles = new HashSet<DisplayElement>();
	private String targetResourceId;
	private Set<EntityLocation> documentLocation;
	public Ig getIg() {
		return ig;
	}
	public void setIg(Ig ig) {
		this.ig = ig;
	}
	public Set<DisplayElement> getMessages() {
		return messages;
	}
	public void setMessages(Set<DisplayElement> messages) {
		this.messages = messages;
	}
	public Set<DisplayElement> getSegments() {
		return segments;
	}
	public void setSegments(Set<DisplayElement> segments) {
		this.segments = segments;
	}
	public Set<DisplayElement> getDatatypes() {
		return datatypes;
	}
	public void setDatatypes(Set<DisplayElement> datatypes) {
		this.datatypes = datatypes;
	}
	public Set<DisplayElement> getValueSets() {
		return valueSets;
	}
	public void setValueSets(Set<DisplayElement> valueSets) {
		this.valueSets = valueSets;
	}
	public Set<DisplayElement> getCoConstraintGroups() {
		return coConstraintGroups;
	}
	public void setCoConstraintGroups(Set<DisplayElement> coConstraintGroups) {
		this.coConstraintGroups = coConstraintGroups;
	}
  public Set<DisplayElement> getProfileComponents() {
    return profileComponents;
  }
  public void setProfileComponents(Set<DisplayElement> profileComponents) {
    this.profileComponents = profileComponents;
  }
  public Set<DisplayElement> getCompositeProfiles() {
    return compositeProfiles;
  }
  public void setCompositeProfiles(Set<DisplayElement> compositePofiles) {
    this.compositeProfiles = compositePofiles;
  }
  public String getTargetResourceId() {
    return targetResourceId;
  }
  public void setTargetResourceId(String targetResourceId) {
    this.targetResourceId = targetResourceId;
  }

	public Set<EntityLocation> getDocumentLocation() {
		return documentLocation;
	}

	public void setDocumentLocation(Set<EntityLocation> documentLocation) {
		this.documentLocation = documentLocation;
	}

	public String getResourceVersionSyncToken() {
		return resourceVersionSyncToken;
	}

	public void setResourceVersionSyncToken(String resourceVersionSyncToken) {
		this.resourceVersionSyncToken = resourceVersionSyncToken;
	}
}
