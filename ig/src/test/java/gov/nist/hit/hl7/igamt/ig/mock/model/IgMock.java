package gov.nist.hit.hl7.igamt.ig.mock.model;

import gov.nist.hit.hl7.igamt.common.base.domain.DocumentInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.DocumentType;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;

public class IgMock {
	private final Ig ig;
	private final ResourceSet resources;

	public IgMock(Ig ig, ResourceSet resources) {
		this.ig = ig;
		this.resources = resources;
	}

	public void addResources(ResourceSet resources, boolean updateDocumentInfo) {
		if(updateDocumentInfo && ig != null) {
			resources.getResources().forEach((r) -> r.setDocumentInfo(new DocumentInfo(ig.getId(), DocumentType.IGDOCUMENT)));
		}
		this.resources.add(resources);
		resources.getDatatypeRegistry().getChildren().forEach((l) -> {
			l.setPosition(ig.getDatatypeRegistry().getChildren().size());
			if(ig.getDatatypeRegistry().getChildren().stream().noneMatch((existing) -> existing.getId().equals(l.getId()))) {
				ig.getDatatypeRegistry().getChildren().add(l);
			}
		});
		resources.getSegmentRegistry().getChildren().forEach((l) -> {
			l.setPosition(ig.getSegmentRegistry().getChildren().size());
			if(ig.getSegmentRegistry().getChildren().stream().noneMatch((existing) -> existing.getId().equals(l.getId()))) {
				ig.getSegmentRegistry().getChildren().add(l);
			}
		});
		resources.getConformanceProfileRegistry().getChildren().forEach((l) -> {
			l.setPosition(ig.getConformanceProfileRegistry().getChildren().size());
			if(ig.getConformanceProfileRegistry().getChildren().stream().noneMatch((existing) -> existing.getId().equals(l.getId()))) {
				ig.getConformanceProfileRegistry().getChildren().add(l);
			}
		});
		resources.getValuesetRegistry().getChildren().forEach((l) -> {
			l.setPosition(ig.getValueSetRegistry().getChildren().size());
			if(ig.getValueSetRegistry().getChildren().stream().noneMatch((existing) -> existing.getId().equals(l.getId()))) {
				ig.getValueSetRegistry().getChildren().add(l);
			}
		});
		resources.getCoConstraintGroupRegistry().getChildren().forEach((l) -> {
			l.setPosition(ig.getCoConstraintGroupRegistry().getChildren().size());
			if(ig.getCoConstraintGroupRegistry().getChildren().stream().noneMatch((existing) -> existing.getId().equals(l.getId()))) {
				ig.getCoConstraintGroupRegistry().getChildren().add(l);
			}
		});
	}

	public Ig getIg() {
		return ig;
	}

	public ResourceSet getResources() {
		return resources;
	}
}
