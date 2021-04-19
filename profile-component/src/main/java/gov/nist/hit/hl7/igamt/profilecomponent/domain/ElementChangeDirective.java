package gov.nist.hit.hl7.igamt.profilecomponent.domain;

import java.util.List;
import java.util.Set;

import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.ItemProperty;

public class ElementChangeDirective {

	private String directiveId;
	private String profileComponentSourceId;
	private String targetElementId;
	private Set<ItemProperty> items;
	protected List<ElementChangeDirective> children;
	
	public ElementChangeDirective(String targetElementId,
								  String directiveId,
								  String profileComponentSourceId,
								  Set<ItemProperty> items,
								  List<ElementChangeDirective> permutation) {
		super();
		this.targetElementId = targetElementId;
		this.directiveId = directiveId;
		this.profileComponentSourceId = profileComponentSourceId;
		this.items = items;
		this.children = permutation;
	}

	public String getDirectiveId() {
		return directiveId;
	}

	public void setDirectiveId(String directiveId) {
		this.directiveId = directiveId;
	}

	public Set<ItemProperty> getItems() {
		return items;
	}

	public void setItems(Set<ItemProperty> items) {
		this.items = items;
	}

	public List<ElementChangeDirective> getChildren() {
		return children;
	}

	public void setChildren(List<ElementChangeDirective> children) {
		this.children = children;
	}

	public String getTargetElementId() {
		return targetElementId;
	}

	public void setTargetElementId(String targetElementId) {
		this.targetElementId = targetElementId;
	}

	public String getProfileComponentSourceId() {
		return profileComponentSourceId;
	}

	public void setProfileComponentSourceId(String profileComponentSourceId) {
		this.profileComponentSourceId = profileComponentSourceId;
	}
}
