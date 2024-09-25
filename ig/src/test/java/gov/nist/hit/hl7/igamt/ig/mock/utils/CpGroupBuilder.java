package gov.nist.hit.hl7.igamt.ig.mock.utils;

import com.google.common.base.Strings;
import gov.nist.hit.hl7.igamt.common.base.domain.Ref;
import gov.nist.hit.hl7.igamt.common.base.domain.Usage;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.Group;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.SegmentRef;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.SegmentRefOrGroup;

import java.util.HashSet;
import java.util.Set;

public class CpGroupBuilder {
	ConformanceProfileMockBuilder parentConformanceProfileMockBuilder;
	CpGroupBuilder parentGroupBuilder;
	String groupId;
	Group group = new Group();
	private final Set<SegmentRefOrGroup> structure = new HashSet<>();

	public CpGroupBuilder(ConformanceProfileMockBuilder parentConformanceProfileMockBuilder, String name, Usage usage, int min, String max, String parentId, int position) {
		this.parentConformanceProfileMockBuilder = parentConformanceProfileMockBuilder;
		groupId = Strings.isNullOrEmpty(parentId) ? String.valueOf(position) : parentId + "." + position;
		group.setId(groupId);
		group.setPosition(position);
		group.setName(name);
		group.setMin(min);
		group.setMax(max);
		group.setUsage(usage);
		group.setChildren(structure);
	}

	public CpGroupBuilder(CpGroupBuilder parentGroupBuilder, String name, Usage usage, int min, String max, String parentId, int position) {
		this.parentGroupBuilder = parentGroupBuilder;
		groupId = Strings.isNullOrEmpty(parentId) ? String.valueOf(position) : parentId + "." + position;
		group.setId(groupId);
		group.setPosition(position);
		group.setName(name);
		group.setMin(min);
		group.setMax(max);
		group.setUsage(usage);
		group.setChildren(structure);
	}

	public CpGroupBuilder withSegRef(String name, Usage usage, int min, String max, String segRef) {
		SegmentRef segmentRef = new SegmentRef();
		int position = structure.size() + 1;
		String id = groupId + "." + position;
		segmentRef.setId(id);
		segmentRef.setPosition(position);
		segmentRef.setName(name);
		segmentRef.setUsage(usage);
		segmentRef.setMin(min);
		segmentRef.setMax(max);
		Ref ref = new Ref();
		ref.setId(segRef);
		segmentRef.setRef(ref);
		structure.add(segmentRef);
		return this;
	}

	public CpGroupBuilder addGroup(Group group) {
		this.structure.add(group);
		return this;
	}

	public CpGroupBuilder withNestedGroup(String name, Usage usage, int min, String max) {
		return new CpGroupBuilder(this, name, usage, min, max, groupId, this.structure.size() + 1);
	}

	public CpGroupBuilder closeNestedGroup() {
		this.parentGroupBuilder.addGroup(group);
		return this.parentGroupBuilder;
	}

	public ConformanceProfileMockBuilder closeGroup() {
		return this.parentConformanceProfileMockBuilder.addGroup(group);
	}
}
