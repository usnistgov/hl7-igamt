package gov.nist.hit.hl7.igamt.ig.domain;

import java.util.Objects;
import java.util.Set;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import gov.nist.hit.hl7.igamt.shared.domain.AbstractDomain;
import gov.nist.hit.hl7.igamt.shared.domain.CompositeKey;
import gov.nist.hit.hl7.igamt.shared.domain.Section;

@Document(collection = "igdocument")
public class Ig extends AbstractDomain {

  @Id
  private CompositeKey id;
  

  private IgMetaData metaData;
  private Set<Section> content;
  


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
  public CompositeKey getId() {
    return id;
  }

  public void setId(CompositeKey id) {
    this.id = id;
  }
  @Override
  public boolean equals(Object o) {

      if (o == this) return true;
      if (!(o instanceof Ig)) {
          return false;
      }

      Ig ig = (Ig) o;

      return ig.getId().equals(id);
  }
  @Override
  public int hashCode() {
    return Objects.hash(id);
  }
}