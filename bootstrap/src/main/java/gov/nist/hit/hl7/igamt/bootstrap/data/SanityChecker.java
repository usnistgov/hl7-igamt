package gov.nist.hit.hl7.igamt.bootstrap.data;

import java.util.Arrays;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.common.base.domain.DocumentInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.DocumentType;
import gov.nist.hit.hl7.igamt.common.base.domain.Link;
import gov.nist.hit.hl7.igamt.common.base.domain.Resource;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.util.RelationShip;
import gov.nist.hit.hl7.igamt.common.exception.EntityNotFound;
import gov.nist.hit.hl7.igamt.compositeprofile.service.CompositeProfileStructureService;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.repository.IgRepository;
import gov.nist.hit.hl7.igamt.ig.service.IgService;
import gov.nist.hit.hl7.igamt.ig.service.ResourceHelper;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import gov.nist.hit.hl7.igamt.serialization.newImplementation.service.ProfileComponentSerializationService;
import gov.nist.hit.hl7.igamt.valueset.service.ValuesetService;

@Service
public class SanityChecker {

	@Autowired
	ConformanceProfileService conformanceProfileService;

	@Autowired
	SegmentService segmentService;

	@Autowired
	DatatypeService datatypeService;

	@Autowired
	ValuesetService valuesetService;

	@Autowired
	IgService igService;

	@Autowired
	IgRepository igRepo;

	@Autowired
	ResourceHelper helper;

	@Autowired
	ProfileComponentSerializationService profileComponentSerializationService;

	@Autowired
	CompositeProfileStructureService compositeProfileStructureService;



	public void checkBrokenLinks(Ig ig) {

		for ( Link l: ig.getConformanceProfileRegistry().getChildren()) {
			if(l.getId() == null) {
				System.out.println("BROKEN  CP LINK"+ ig.getId());
			}else {
				ConformanceProfile cp = this.conformanceProfileService.findById(l.getId());
				if(cp == null) {
					System.out.println("CP NOT FOUND"+ ig.getId());

				}

			}
		}
		for ( Link l: ig.getSegmentRegistry().getChildren()) {
			if(l.getId() == null) {
				System.out.println("BROKEN  SEG LINK"+ ig.getId());
			}else {


			}


		}

		for ( Link l: ig.getDatatypeRegistry().getChildren()) {
			if(l.getId() == null) {
				System.out.println("BROKEN  DT LINK"+ ig.getId());
			}
		}
		for ( Link l: ig.getValueSetRegistry().getChildren()) {
			if(l.getId() == null) {
				System.out.println("BROKEN  VS LINK"+ ig.getId());
			}  
		}
		for ( Link l: ig.getCoConstraintGroupRegistry().getChildren()) {
			if(l.getId() == null) {
				System.out.println("BROKEN  CCG LINK"+ ig.getId());
			}
		}
		for ( Link l: ig.getProfileComponentRegistry().getChildren()) {
			if(l.getId() == null) {
				System.out.println("BROKEN  PC LINK"+ ig.getId());
			}
		}	
		for ( Link l: ig.getCompositeProfileRegistry().getChildren()) {
			if(l.getId() == null) {
				System.out.println("BROKEN  CP LINK"+ ig.getId());
			}
		}	
	}

	public void checkUnfoundLinkReferences(Ig ig) {

		for ( Link l: ig.getConformanceProfileRegistry().getChildren()) {
			if(l.getId() != null) {
				Resource res = this.getResouce(l.getId(), Type.CONFORMANCEPROFILE);
				if(res == null) {
					System.out.println("IGID:"+ ig.getId()+ "Type:"+ l.getType() +",ResourceID:"+ l.getId());
				}

			}
		}
		for ( Link l: ig.getSegmentRegistry().getChildren()) {
			if(l.getId() != null) {
				Resource res = this.getResouce(l.getId(), Type.SEGMENT);
				if(res ==null) {
					System.out.println("IGID:"+ ig.getId()+ "Type:"+ l.getType() +",ResourceID:"+ l.getId());
				}

			}
		}

		for ( Link l: ig.getDatatypeRegistry().getChildren()) {
			if(l.getId() != null) {
				Resource res = this.getResouce(l.getId(), Type.DATATYPE);
				if(res ==null) {
					System.out.println("IGID:"+ ig.getId()+ "Type:"+ l.getType() +",ResourceID:"+ l.getId());
				}
			}
		}
		for ( Link l: ig.getValueSetRegistry().getChildren()) {
			if(l.getId() != null) {
				Resource res = this.getResouce(l.getId(), Type.VALUESET);
				if(res ==null) {
					System.out.println("IGID:"+ ig.getId()+ "Type:"+ l.getType() +",ResourceID:"+ l.getId());
				}


			}  
		}
		for ( Link l: ig.getCoConstraintGroupRegistry().getChildren()) {
			if(l.getId() != null) {
				Resource res = this.getResouce(l.getId(), Type.COCONSTRAINTGROUP);
				if(res ==null) {
					System.out.println("IGID:"+ ig.getId()+ "Type:"+ l.getType() +",ResourceID:"+ l.getId());

				}
			}
		}
		for ( Link l: ig.getProfileComponentRegistry().getChildren()) {
			if(l.getId() != null) {
				Resource res = this.getResouce(l.getId(), Type.PROFILECOMPONENT);
				if(res ==null) {
					System.out.println("IGID:"+ ig.getId()+ "Type:"+ l.getType() +",ResourceID:"+ l.getId());

				}

			}
		}	
		for ( Link l: ig.getCompositeProfileRegistry().getChildren()) {
			if(l.getId() != null) {
				Resource res = this.getResouce(l.getId(), Type.COMPOSITEPROFILE);
				if(res ==null) {
					System.out.println("IGID:"+ ig.getId()+ "Type:"+ l.getType() +",ResourceID:"+ l.getId());

				}

			}
		}	
	}




	public void checkWrongDomainInfo(Ig ig) {

		for ( Link l: ig.getConformanceProfileRegistry().getChildren()) {
			if(l.getId() != null) {
				Resource res = this.getResouce(l.getId(), Type.CONFORMANCEPROFILE);
				if(!res.getDomainInfo().getScope().equals(l.getDomainInfo().getScope())) {
					System.out.println("IGID:"+ ig.getId()+ "Type:"+ res.getType() +",ResourceID:"+ res.getId());
				}

			}
		}
		for ( Link l: ig.getSegmentRegistry().getChildren()) {
			if(l.getId() != null) {
				Resource res = this.getResouce(l.getId(), Type.SEGMENT);
				if(!res.getDomainInfo().getScope().equals(l.getDomainInfo().getScope())) {
					System.out.println("IGID:"+ ig.getId()+ "Type:"+ res.getType() +",ResourceID:"+ res.getId());
				}

			}
		}

		for ( Link l: ig.getDatatypeRegistry().getChildren()) {
			if(l.getId() != null) {
				Resource res = this.getResouce(l.getId(), Type.DATATYPE);
				if(!res.getDomainInfo().getScope().equals(l.getDomainInfo().getScope())) {
					System.out.println("IGID:"+ ig.getId()+ "Type:"+ res.getType() +",ResourceID:"+ res.getId());
				}
			}
		}
		for ( Link l: ig.getValueSetRegistry().getChildren()) {
			if(l.getId() != null) {
				Resource res = this.getResouce(l.getId(), Type.VALUESET);
				if(!res.getDomainInfo().getScope().equals(l.getDomainInfo().getScope())) {
					System.out.println("IGID:"+ ig.getId()+ "Type:"+ res.getType() +",ResourceID:"+ res.getId());
				}

			}  
		}
		for ( Link l: ig.getCoConstraintGroupRegistry().getChildren()) {
			if(l.getId() != null) {
				Resource res = this.getResouce(l.getId(), Type.COCONSTRAINTGROUP);
				if(!res.getDomainInfo().getScope().equals(l.getDomainInfo().getScope())) {
					System.out.println("IGID:"+ ig.getId()+ "Type:"+ res.getType() +",ResourceID:"+ res.getId());
				}
			}
		}
		for ( Link l: ig.getProfileComponentRegistry().getChildren()) {
			if(l.getId() != null) {
				Resource res = this.getResouce(l.getId(), Type.PROFILECOMPONENT);
				if(!res.getDomainInfo().getScope().equals(l.getDomainInfo().getScope())) {
					System.out.println("IGID:"+ ig.getId()+ "Type:"+ res.getType() +",ResourceID:"+ res.getId());
				}

			}
		}	
		for ( Link l: ig.getCompositeProfileRegistry().getChildren()) {
			if(l.getId() != null) {
				Resource res = this.getResouce(l.getId(), Type.COMPOSITEPROFILE);
				if(!res.getDomainInfo().getScope().equals(l.getDomainInfo().getScope())) {
					System.out.println("IGID:"+ ig.getId()+ "Type:"+ res.getType() +",ResourceID:"+ res.getId());
				}

			}
		}	
	}




	private Resource getResouce(String id, Type type) {
		try {
			return this.helper.getResourceByType(id, type);
		} catch (EntityNotFound e) {
			return null;
		}
	}

	public void checkNullDocumentInfo(Ig ig) {

		for ( Link l: ig.getConformanceProfileRegistry().getChildren()) {

			Resource res = this.getResouce(l.getId(), Type.CONFORMANCEPROFILE);
			if(res.getDocumentInfo() == null && res.getDomainInfo().getScope().equals(Scope.USER)) {
				System.out.println("IGID:"+ ig.getId()+ "Type:"+ l.getType() +",ResourceID:"+ l.getId());
			}

		}
		for ( Link l: ig.getSegmentRegistry().getChildren()) {
			Resource res = this.getResouce(l.getId(), Type.SEGMENT);
			if(res.getDocumentInfo() == null && res.getDomainInfo().getScope().equals(Scope.USER)) {
				System.out.println("IGID:"+ ig.getId()+ "Type:"+ l.getType() +",ResourceID:"+ l.getId());
			}
		}

		for ( Link l: ig.getDatatypeRegistry().getChildren()) {
			Resource res = this.getResouce(l.getId(), Type.DATATYPE);
			if(res.getDocumentInfo() == null && res.getDomainInfo().getScope().equals(Scope.USER)) {
				System.out.println("IGID:"+ ig.getId()+ "Type:"+ l.getType() +",ResourceID:"+ l.getId());
			}

		}
		for ( Link l: ig.getValueSetRegistry().getChildren()) {
			Resource res = this.getResouce(l.getId(), Type.VALUESET);
			if(res.getDocumentInfo() == null && res.getDomainInfo().getScope().equals(Scope.USER)) {
				System.out.println("IGID:"+ ig.getId()+ "Type:"+ l.getType() +",ResourceID:"+ l.getId());
			}
		}  

		for ( Link l: ig.getCoConstraintGroupRegistry().getChildren()) {
			Resource res = this.getResouce(l.getId(), Type.COCONSTRAINTGROUP);
			if(res.getDocumentInfo() == null && res.getDomainInfo().getScope().equals(Scope.USER)) {
				System.out.println("IGID:"+ ig.getId()+ "Type:"+ l.getType() +",ResourceID:"+ l.getId());
			}

		}
		for ( Link l: ig.getProfileComponentRegistry().getChildren()) {
			Resource res = this.getResouce(l.getId(), Type.PROFILECOMPONENT);
			if(res.getDocumentInfo() == null && res.getDomainInfo().getScope().equals(Scope.USER)) {
				System.out.println("IGID:"+ ig.getId()+ "Type:"+ l.getType() +",ResourceID:"+ l.getId());
			}

		}	
		for ( Link l: ig.getCompositeProfileRegistry().getChildren()) {

			Resource res = this.getResouce(l.getId(), Type.COMPOSITEPROFILE);
			if(res.getDocumentInfo() == null && res.getDomainInfo().getScope().equals(Scope.USER)) {
				System.out.println("IGID:"+ ig.getId()+ "Type:"+ l.getType() +",ResourceID:"+ l.getId());
			}

		}	
	}


	public void checkWrongDocumentInfo(Ig ig) {


		DocumentInfo documentInfo = new DocumentInfo(ig.getId(), DocumentType.IGDOCUMENT);

		for ( Link l: ig.getConformanceProfileRegistry().getChildren()) {

			Resource res = this.getResouce(l.getId(), Type.CONFORMANCEPROFILE);
			if(res.getDocumentInfo() != null) {
				if(!documentInfo.equals(res.getDocumentInfo())) {
					System.out.println("IGID:"+ ig.getId()+ "Type:"+ l.getType() +",ResourceID:"+ l.getId());
				}
			}

		}
		for ( Link l: ig.getSegmentRegistry().getChildren()) {
			Resource res = this.getResouce(l.getId(), Type.SEGMENT);
			if(res.getDocumentInfo() != null) {
				if(!documentInfo.equals(res.getDocumentInfo())) {
					System.out.println("IGID:"+ ig.getId()+ "Type:"+ l.getType() +",ResourceID:"+ l.getId());
				}
			}
		}

		for ( Link l: ig.getDatatypeRegistry().getChildren()) {
			Resource res = this.getResouce(l.getId(), Type.DATATYPE);
			if(res.getDocumentInfo() != null) {
				if(!documentInfo.equals(res.getDocumentInfo())) {
					System.out.println("IGID:"+ ig.getId()+ "Type:"+ l.getType() +",ResourceID:"+ l.getId());
				}
			}

		}
		for ( Link l: ig.getValueSetRegistry().getChildren()) {
			Resource res = this.getResouce(l.getId(), Type.VALUESET);
			if(res.getDocumentInfo() != null) {
				if(!documentInfo.equals(res.getDocumentInfo())) {
					System.out.println("IGID:"+ ig.getId()+ "Type:"+ l.getType() +",ResourceID:"+ l.getId());
				}
			}
		}  

		for ( Link l: ig.getCoConstraintGroupRegistry().getChildren()) {
			Resource res = this.getResouce(l.getId(), Type.COCONSTRAINTGROUP);
			if(res.getDocumentInfo() != null) {
				if(!documentInfo.equals(res.getDocumentInfo())) {
					System.out.println("IGID:"+ ig.getId()+ "Type:"+ l.getType() +",ResourceID:"+ l.getId());
				}
			}

		}
		for ( Link l: ig.getProfileComponentRegistry().getChildren()) {
			Resource res = this.getResouce(l.getId(), Type.PROFILECOMPONENT);
			if(res.getDocumentInfo() != null) {
				if(!documentInfo.equals(res.getDocumentInfo())) {
					System.out.println("IGID:"+ ig.getId()+ "Type:"+ l.getType() +",ResourceID:"+ l.getId());
				}
			}
		}	
		for ( Link l: ig.getCompositeProfileRegistry().getChildren()) {

			Resource res = this.getResouce(l.getId(), Type.COMPOSITEPROFILE);
			if(res.getDocumentInfo() != null) {
				if(!documentInfo.equals(res.getDocumentInfo())) {
					System.out.println("IGID:"+ ig.getId()+ "Type:"+ l.getType() +",ResourceID:"+ l.getId());
				}
			}

		}	
	}



	public void checkCustomStructures() {

		List<Ig> igs = this.igService.findAll();
		System.out.println("IGID, IG TITLE, USERNAME, RESOURCE TYPE, RESOUCE ID,RESOURCE LABEL, Used");
		for( Ig ig: igs ) {

			for ( Link l: ig.getConformanceProfileRegistry().getChildren()) {

				if(l.getDomainInfo().getScope().equals(Scope.USERCUSTOM)) {
					Resource res = this.getResouce(l.getId(), Type.CONFORMANCEPROFILE);
					List<String> list = Arrays.asList(ig.getId(),ig.getMetadata().getTitle(), ig.getUsername(), res.getType().toString(), res.getId(),res.getLabel());
					String result = String.join(",", list);
					System.out.println(result);
				}
			}
			for ( Link l: ig.getSegmentRegistry().getChildren()) {
				if(l.getDomainInfo().getScope().equals(Scope.USERCUSTOM)) {
					
					Set<RelationShip> rels = this.igService.buildRelationShip(ig, Type.SEGMENT);
					Set<RelationShip> used = this.igService.findUsage(rels,  Type.SEGMENT, l.getId());
					
					
					Resource res = this.getResouce(l.getId(), Type.SEGMENT);
					
					List<String> list = Arrays.asList(ig.getId(),ig.getMetadata().getTitle(), ig.getUsername(), res.getType().toString(), res.getId(),res.getLabel(), String.valueOf(used.size()));
					String result = String.join(",", list);
					System.out.println(result);

				}
			}  

		}
	}



}
