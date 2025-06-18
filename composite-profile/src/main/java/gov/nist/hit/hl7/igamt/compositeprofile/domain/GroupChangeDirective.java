package gov.nist.hit.hl7.igamt.compositeprofile.domain;

import java.util.HashMap;
import java.util.Map;

public class GroupChangeDirective extends SegRefOrGroupChangeDirective {
	Map<String, SegRefOrGroupChangeDirective> children;

	public Map<String, SegRefOrGroupChangeDirective> getChildren() {
		if(children == null) {
			children = new HashMap<>();
		}
		return children;
	}

	public void setChildren(Map<String, SegRefOrGroupChangeDirective> children) {
		this.children = children;
	}
}
