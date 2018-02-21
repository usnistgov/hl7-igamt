package gov.nist.hit.hl7.igamt.shared.domain;

import java.util.Set;

public class Binding {

  protected String elementId;
  protected Set<Binding> children;
  protected Set<Comment> comments;
  protected Set<ValuesetBinding> valuesetBindings;
  protected String codeId;
  
  protected Predicate predicate;
  protected Set<ConformanceStatement> conformanceStatements;
  protected Set<CrossRef> crossRefs;
}
