package gov.nist.hit.hl7.igdocument;

import gov.nist.hit.hl7.igamt.shared.domain.AbstractDomain;
import gov.nist.hit.hl7.igamt.shared.domain.Resgistry;
import gov.nist.hit.hl7.igamt.shared.domain.ValueSetRegistry;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "igdocument")
public class igdocument extends AbstractDomain {

  private String usageNode;
  private IgDocumentMetaData metaData;
  private Resgistry datatypes;
  private Resgistry segments;

  private Resgistry conformanceProfiles;

  private Resgistry profileComponents;

  private Resgistry compositeProfiles;
  
  private ValueSetRegistry valueSets;

  public String getUsageNode() {
    return usageNode;
  }

  public void setUsageNode(String usageNode) {
    this.usageNode = usageNode;
  }

  public IgDocumentMetaData getMetaData() {
    return metaData;
  }

  public void setMetaData(IgDocumentMetaData metaData) {
    this.metaData = metaData;
  }

  public Resgistry getDatatypes() {
    return datatypes;
  }

  public void setDatatypes(Resgistry datatypes) {
    this.datatypes = datatypes;
  }

  public Resgistry getSegments() {
    return segments;
  }

  public void setSegments(Resgistry segments) {
    this.segments = segments;
  }

  public Resgistry getConformanceProfiles() {
    return conformanceProfiles;
  }

  public void setConformanceProfiles(Resgistry conformanceProfiles) {
    this.conformanceProfiles = conformanceProfiles;
  }

  public Resgistry getProfileComponents() {
    return profileComponents;
  }

  public void setProfileComponents(Resgistry profileComponents) {
    this.profileComponents = profileComponents;
  }

  public Resgistry getCompositeProfiles() {
    return compositeProfiles;
  }

  public void setCompositeProfiles(Resgistry compositeProfiles) {
    this.compositeProfiles = compositeProfiles;
  }

  public ValueSetRegistry getValueSets() {
    return valueSets;
  }

  public void setValueSets(ValueSetRegistry valueSets) {
    this.valueSets = valueSets;
  }

}
