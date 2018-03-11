package gov.nist.hit.hl7.igamt.ig.domain;

import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

import org.springframework.data.mongodb.core.mapping.Document;

import gov.nist.hit.hl7.igamt.shared.domain.AbstractDomain;
import gov.nist.hit.hl7.igamt.shared.domain.CompositeKey;
import gov.nist.hit.hl7.igamt.shared.domain.DomainInfo;
import gov.nist.hit.hl7.igamt.shared.domain.PublicationInfo;

@Document
public class Ig<TextSection> extends AbstractDomain {

  
  

  private IgMetaData metaData;
  private Set<TextSection> content= new HashSet<TextSection>() ;
  


  public IgMetaData getMetaData1() {
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
  public boolean equals(Object o) {

      if (o == this) return true;
      if (!(o instanceof Ig)) {
          return false;
      }

      Ig<TextSection> ig = (Ig<TextSection>) o;

      return ig.getId().equals(this.getId());
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
  
}