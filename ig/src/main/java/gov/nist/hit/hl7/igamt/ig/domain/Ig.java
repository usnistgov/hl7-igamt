package gov.nist.hit.hl7.igamt.ig.domain;

import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

import org.springframework.data.mongodb.core.mapping.Document;

import gov.nist.hit.hl7.igamt.common.base.domain.AbstractDomain;
import gov.nist.hit.hl7.igamt.common.base.domain.CompositeKey;
import gov.nist.hit.hl7.igamt.common.base.domain.DocumentMetadata;
import gov.nist.hit.hl7.igamt.common.base.domain.DomainInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.PublicationInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.TextSection;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.compositeprofile.domain.registry.CompositeProfileRegistry;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.registry.ConformanceProfileRegistry;
import gov.nist.hit.hl7.igamt.datatype.domain.registry.DatatypeRegistry;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.registry.ProfileComponentRegistry;
import gov.nist.hit.hl7.igamt.segment.domain.registry.SegmentRegistry;
import gov.nist.hit.hl7.igamt.valueset.domain.registry.ValueSetRegistry;



@Document
public class Ig extends AbstractDomain {

  private DocumentMetadata metadata = new DocumentMetadata();
  private Set<TextSection> content = new HashSet<TextSection>();
  private DatatypeRegistry datatypeRegistry = new DatatypeRegistry();
  private SegmentRegistry segmentRegistry = new SegmentRegistry();
  private ProfileComponentRegistry profileComponentRegistry = new ProfileComponentRegistry();
  private CompositeProfileRegistry compositeProfileRegistry = new CompositeProfileRegistry();
  private ConformanceProfileRegistry conformanceProfileRegistry = new ConformanceProfileRegistry();

  private ValueSetRegistry valueSetRegistry = new ValueSetRegistry();

  public DocumentMetadata getMetadata() {
    return metadata;
  }

  public void setMetadata(DocumentMetadata metadata) {
    this.metadata = metadata;
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

  public Ig(CompositeKey id, String version, String name, PublicationInfo publicationInfo,
      DomainInfo domainInfo, String username, String comment, String description) {
    super(id, version, name, publicationInfo, domainInfo, username, comment, description);
    // TODO Auto-generated constructor stub
  }

  @SuppressWarnings({"unused"})
  public TextSection getProfile() {
    for (TextSection t : this.content) {
      if (t instanceof TextSection) {
        if (t.getType().equals(Type.PROFILE)) {
          return t;
        }
      }
    }
    return null;

  }

  public DatatypeRegistry getDatatypeRegistry() {
    return datatypeRegistry;
  }

  public void setDatatypeRegistry(DatatypeRegistry datatypeRegistry) {
    this.datatypeRegistry = datatypeRegistry;
  }

  public SegmentRegistry getSegmentRegistry() {
    return segmentRegistry;
  }

  public void setSegmentRegistry(SegmentRegistry segmentRegistry) {
    this.segmentRegistry = segmentRegistry;
  }

  public ProfileComponentRegistry getProfileComponentRegistry() {
    return profileComponentRegistry;
  }

  public void setProfileComponentRegistry(ProfileComponentRegistry profileComponentRegistry) {
    this.profileComponentRegistry = profileComponentRegistry;
  }

  public CompositeProfileRegistry getCompositeProfileRegistry() {
    return compositeProfileRegistry;
  }

  public void setCompositeProfileRegistry(CompositeProfileRegistry compositeProfileRegistry) {
    this.compositeProfileRegistry = compositeProfileRegistry;
  }

  public ConformanceProfileRegistry getConformanceProfileRegistry() {
    return conformanceProfileRegistry;
  }

  public void setConformanceProfileRegistry(ConformanceProfileRegistry conformanceProfileRegistry) {
    this.conformanceProfileRegistry = conformanceProfileRegistry;
  }

  public ValueSetRegistry getValueSetRegistry() {
    return valueSetRegistry;
  }

  public void setValueSetRegistry(ValueSetRegistry valueSetRegistry) {
    this.valueSetRegistry = valueSetRegistry;
  }

  /*
   * (non-Javadoc)
   * 
   * @see gov.nist.hit.hl7.igamt.shared.domain.AbstractDomain#getLabel()
   */
  @Override
  public String getLabel() {
    return this.getName();
  }


}
