package gov.nist.hit.hl7.igamt.segment.domain;

import java.util.Set;

import org.springframework.data.mongodb.core.mapping.Document;

import gov.nist.hit.hl7.igamt.shared.domain.Field;
import gov.nist.hit.hl7.igamt.shared.domain.Resource;
import gov.nist.hit.hl7.igamt.shared.domain.binding.ResourceBinding;

@Document(collection = "segment")

public class Segment extends Resource {
  private ResourceBinding binding;

  private Set<Field> children;

  public Segment() {
    super();
  }

  public ResourceBinding getBinding() {
    return binding;
  }

  public void setBinding(ResourceBinding binding) {
    this.binding = binding;
  }

  public Set<Field> getChildren() {
    return children;
  }

  public void setChildren(Set<Field> children) {
    this.children = children;
  }


}
