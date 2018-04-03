package gov.nist.hit.hl7.igamt.ig.domain;

import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

import org.springframework.data.mongodb.core.mapping.Document;

import gov.nist.hit.hl7.igamt.shared.domain.AbstractDomain;
import gov.nist.hit.hl7.igamt.shared.domain.CompositeKey;
import gov.nist.hit.hl7.igamt.shared.domain.DomainInfo;
import gov.nist.hit.hl7.igamt.shared.domain.PublicationInfo;
import gov.nist.hit.hl7.igamt.shared.domain.Registry;
import gov.nist.hit.hl7.igamt.shared.domain.Section;
import gov.nist.hit.hl7.igamt.shared.domain.TextSection;
import gov.nist.hit.hl7.igamt.shared.domain.Type;
import gov.nist.hit.hl7.igamt.shared.domain.ValueSetRegistry;

@Document
public class Ig extends AbstractDomain {

  private IgMetaData metaData;
  private Set<TextSection> content= new HashSet<TextSection>() ;
  


  public IgMetaData getMetaData() {
    return metaData;
  }

  public void setMetaData(IgMetaData metaData) {
    this.metaData = metaData;
  }
  public Set<TextSection> getContent() {
    return content;
  }
  public void setContent(Set<TextSection> content) {
    this.content = content;
  }

 
  @Override
  public int hashCode() {
    return Objects.hash(this.getId());
  }

public Ig() {
	super();
	// TODO Auto-generated constructor stub
}

public Ig(CompositeKey id, String version, String name, PublicationInfo publicationInfo, DomainInfo domainInfo,
		String username, String comment, String description) {
	super(id, version, name, publicationInfo, domainInfo, username, comment, description);
	// TODO Auto-generated constructor stub
}

	@SuppressWarnings({ "unused", "unchecked" })
	private TextSection getProfile(){
		for( TextSection  t : this.content) {
		if(t instanceof TextSection) {
			if(t.getType().equals(Type.PROFILE)) {
				return (TextSection)t;
			}
		}
		}
		return null;
		
	}
	
	
	@SuppressWarnings("unused")
	private Registry getDatatypeLibrary() {
		
		for(Section s : this.getProfile().getChildren()) {
			if(s instanceof Registry) {
				if(s.getType().equals(Type.DATATYPEREGISTRY)) {
					return (Registry)s;
				}
			}
		}
		return null;
		
	}
	
	@SuppressWarnings("unused")
	private Registry getSegmentLibrary() {
		
		for(Section s : this.getProfile().getChildren()) {
			if(s instanceof Registry) {
				if(s.getType().equals(Type.SEGMENTRGISTRY)) {
					return (Registry)s;
				}
			}
		}
		return null;
		
	}
	
	
	@SuppressWarnings("unused")
	private Registry getConformanceProfileLibrary() {
		
		for(Section s : this.getProfile().getChildren()) {
			if(s instanceof Registry) {
				if(s.getType().equals(Type.CONFORMANCEPROFILEREGISTRY)) {
					return (Registry)s;
				}
			}
		}
		return null;
		
	}

	@SuppressWarnings("unused")
	private Registry getCompositeProfileLibrary() {
		for(Section s : this.getProfile().getChildren()) {
			if(s instanceof Registry) {
				if(s.getType().equals(Type.CONFORMANCEPROFILEREGISTRY)) {
					return (Registry)s;
				}
			}
		}
		return null;
		
	}
	
	@SuppressWarnings("unused")
	private Registry getProfileComponentLibrary() {	
		for(Section s : this.getProfile().getChildren()) {
			if(s instanceof Registry) {
				if(s.getType().equals(Type.PROFILECOMPONENTREGISTRY)) {
					return (Registry)s;
				}
			}
		}
		return null;
		
	}
	@SuppressWarnings("unused")
	private Registry getValueSetLibrary() {
		for(Section s : this.getProfile().getChildren()) {
			if(s instanceof ValueSetRegistry) {
					return (ValueSetRegistry)s;
				}
			}
		return null;
	}
	
	@SuppressWarnings("unused")
	private void setValueSetLibrary( ValueSetRegistry valueSetRegistry) {
		for(Section s : this.getProfile().getChildren()) {
			if(s instanceof ValueSetRegistry) {
				s= valueSetRegistry;
				}
			}
	}
	@SuppressWarnings("unused")
	private void setProfileComponentLibrary(Registry profileComponentRegistry ) {	
		for(Section s : this.getProfile().getChildren()) {
			if(s instanceof Registry) {
				if(s.getType().equals(Type.PROFILECOMPONENTREGISTRY)) {
					s= profileComponentRegistry;
				}
			}
		}		
	}
	@SuppressWarnings("unused")
	private void setCompositeProfileLibrary(Registry compositeProfileRegistry ) {	
		for(Section s : this.getProfile().getChildren()) {
			if(s instanceof Registry) {
				if(s.getType().equals(Type.PROFILECOMPONENTREGISTRY)) {
					s= compositeProfileRegistry;
				}
			}
		}		
	}
	
	
	@SuppressWarnings("unused")
	private void  setSegmentLibrary(Registry segmentRegistry) {
		
		for(Section s : this.getProfile().getChildren()) {
			if(s instanceof Registry) {
				if(s.getType().equals(Type.SEGMENTRGISTRY)) {
					s=segmentRegistry;
				}
			}
		}		
	}
	
	@SuppressWarnings("unused")
	private void setDatatypeLibrary(Registry datatypeRegistry ) {
		
		for(Section s : this.getProfile().getChildren()) {
			if(s instanceof Registry) {
				if(s.getType().equals(Type.DATATYPEREGISTRY)) {
					 s= datatypeRegistry;
				}
			}
		}
	}
	
	@SuppressWarnings("unused")
	private void setConformanceProfileLibrary(Registry segmentRegistry) {
		
		for(Section s : this.getProfile().getChildren()) {
			if(s instanceof Registry) {
				if(s.getType().equals(Type.CONFORMANCEPROFILEREGISTRY)) {
					s= segmentRegistry;
				}
			}
		}
	}
	
	@SuppressWarnings({ "unused" })
	private void setProfile(TextSection s){
		for( TextSection  t : this.content) {
		if(t instanceof TextSection) {
			if(t.getType().equals(Type.PROFILE)) {
				t=s;
			}
		}
		}
		
	}
	
	
	
	

  
}