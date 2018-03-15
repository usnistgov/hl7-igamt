package gov.nist.hit.hl7.igamt.ig.domain;

import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

import org.springframework.data.mongodb.core.mapping.Document;

import gov.nist.hit.hl7.igamt.shared.domain.AbstractDomain;
import gov.nist.hit.hl7.igamt.shared.domain.CompositeKey;
import gov.nist.hit.hl7.igamt.shared.domain.DomainInfo;
import gov.nist.hit.hl7.igamt.shared.domain.PublicationInfo;
import gov.nist.hit.hl7.igamt.shared.domain.Section;

@Document
public class Ig<T extends Section> extends AbstractDomain {

  private IgMetaData metaData;
  private Set<T> content= new HashSet<T>() ;
  


  public IgMetaData getMetaData1() {
    return metaData;
  }

  public void setMetaData(IgMetaData metaData) {
    this.metaData = metaData;
  }
  public Set<T> getContent() {
    return content;
  }
  public void setContent(Set<T> content) {
    this.content = content;
  }

  @Override
  public boolean equals(Object o) {

      if (o == this) return true;
      if (!(o instanceof Ig)) {
          return false;
      }

      Ig<T> ig = (Ig<T>) o;

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