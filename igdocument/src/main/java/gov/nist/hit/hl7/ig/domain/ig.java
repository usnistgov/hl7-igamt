package gov.nist.hit.hl7.ig.domain;

import java.util.Set;

import org.springframework.data.mongodb.core.mapping.Document;

import gov.nist.hit.hl7.igamt.shared.domain.AbstractDomain;
import gov.nist.hit.hl7.igamt.shared.domain.Section;

@Document(collection = "igdocument")
public class ig extends AbstractDomain {

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

}
