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
  private Set<Section> content= new HashSet<Section>() ;
  


  public IgMetaData getMetaData() {
    return metaData;
  }

  public void setMetaData(IgMetaData metaData) {
    this.metaData = metaData;
  }
  public Set<Section> getContent() {
    return content;
  }
  public void setContent(Set<Section> content) {
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

	public TextSection getProfile(){
		for( Section  t : this.content) {
		if(t instanceof TextSection) {
			if(t.getType().equals(Type.PROFILE)) {
				return (TextSection)t;
			}
		}
		}
		return null;
		
	}
	
	
    public Registry getDatatypeLibrary() {
		
		for(Section s : this.getProfile().getChildren()) {
			if(s instanceof Registry) {
				if(s.getType().equals(Type.DATATYPEREGISTRY)) {
					return (Registry)s;
				}
			}
		}
		return null;
		
	}
	
	public Registry getSegmentLibrary() {
		
		for(Section s : this.getProfile().getChildren()) {
			if(s instanceof Registry) {
				if(s.getType().equals(Type.SEGMENTRGISTRY)) {
					return (Registry)s;
				}
			}
		}
		return null;
		
	}
	
	
	public Registry getConformanceProfileLibrary() {
		
		for(Section s : this.getProfile().getChildren()) {
			if(s instanceof Registry) {
				if(s.getType().equals(Type.CONFORMANCEPROFILEREGISTRY)) {
					return (Registry)s;
				}
			}
		}
		return null;
		
	}

	public Registry getCompositeProfileLibrary() {
		for(Section s : this.getProfile().getChildren()) {
			if(s instanceof Registry) {
				if(s.getType().equals(Type.CONFORMANCEPROFILEREGISTRY)) {
					return (Registry)s;
				}
			}
		}
		return null;
		
	}
	
	public Registry getProfileComponentLibrary() {	
		for(Section s : this.getProfile().getChildren()) {
			if(s instanceof Registry) {
				if(s.getType().equals(Type.PROFILECOMPONENTREGISTRY)) {
					return (Registry)s;
				}
			}
		}
		return null;
		
	}
	public Registry getValueSetLibrary() {
		for(Section s : this.getProfile().getChildren()) {
			if(s instanceof ValueSetRegistry) {
					return (ValueSetRegistry)s;
				}
			}
		return null;
	}
	
	public void setValueSetLibrary( ValueSetRegistry valueSetRegistry) {
		for(Section s : this.getProfile().getChildren()) {
			if(s instanceof ValueSetRegistry) {
				s= valueSetRegistry;
				}
			}
	}
	public void setProfileComponentLibrary(Registry profileComponentRegistry ) {	
		for(Section s : this.getProfile().getChildren()) {
			if(s instanceof Registry) {
				if(s.getType().equals(Type.PROFILECOMPONENTREGISTRY)) {
					s= profileComponentRegistry;
				}
			}
		}		
	}
	public void setCompositeProfileLibrary(Registry compositeProfileRegistry ) {	
		for(Section s : this.getProfile().getChildren()) {
			if(s instanceof Registry) {
				if(s.getType().equals(Type.PROFILECOMPONENTREGISTRY)) {
					s= compositeProfileRegistry;
				}
			}
		}		
	}
	
	
	public void  setSegmentLibrary(Registry segmentRegistry) {
		
		for(Section s : this.getProfile().getChildren()) {
			if(s instanceof Registry) {
				if(s.getType().equals(Type.SEGMENTRGISTRY)) {
					s=segmentRegistry;
				}
			}
		}		
	}
	
	public void setDatatypeLibrary(Registry datatypeRegistry ) {
		
		for(Section s : this.getProfile().getChildren()) {
			if(s instanceof Registry) {
				if(s.getType().equals(Type.DATATYPEREGISTRY)) {
					 s= datatypeRegistry;
				}
			}
		}
	}
	
	public void setConformanceProfileLibrary(Registry segmentRegistry) {
		
		for(Section s : this.getProfile().getChildren()) {
			if(s instanceof Registry) {
				if(s.getType().equals(Type.CONFORMANCEPROFILEREGISTRY)) {
					s= segmentRegistry;
				}
			}
		}
	}
	
	public void setProfile(TextSection s){
		for( Section  t : this.content) {
		if(t instanceof TextSection) {
			if(t.getType().equals(Type.PROFILE)) {
				t=s;
			}
		}
		}
		
	}
	
	
	
	

  
}