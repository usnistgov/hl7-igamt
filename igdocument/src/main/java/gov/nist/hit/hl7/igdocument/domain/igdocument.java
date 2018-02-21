package gov.nist.hit.hl7.igdocument.domain;

import java.util.Set;

import org.springframework.data.mongodb.core.mapping.Document;

import gov.nist.hit.hl7.igamt.shared.domain.AbstractDomain;
import gov.nist.hit.hl7.igamt.shared.domain.Section;

@Document(collection = "igdocument")
public class igdocument extends AbstractDomain {

  private IgDocumentMetaData metaData;
  private Set<Section> content;

  public IgDocumentMetaData getMetaData() {
    return metaData;
  }

  public void setMetaData(IgDocumentMetaData metaData) {
    this.metaData = metaData;
  }
  public Set<Section> getContent() {
    return content;
  }
  public void setContent(Set<Section> content) {
    this.content = content;
  }

}
