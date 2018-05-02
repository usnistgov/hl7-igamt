package gov.nist.hit.hl7.igamt.segment.domain.display;

import java.util.HashSet;
import java.util.Set;

import gov.nist.hit.hl7.igamt.shared.domain.Ref;
import gov.nist.hit.hl7.igamt.shared.domain.Type;
import gov.nist.hit.hl7.igamt.shared.domain.Usage;
import gov.nist.hit.hl7.igamt.shared.domain.binding.ExternalSingleCode;
import gov.nist.hit.hl7.igamt.shared.domain.binding.InternalSingleCode;
import gov.nist.hit.hl7.igamt.shared.domain.constraint.Predicate;

public class ComponentDisplayData {
  private String maxLength;
  private String minLength;
  private String confLength;
  private Ref ref;
  private String id;
  private String name;
  private int position;
  private Usage usage;
  private Type type;
  private String text;
  private boolean custom = false;
  private DatatypeDisplayLink datatype;

  private Set<CommentDisplay> comments;
  private String constantValue;
  private ExternalSingleCode externalSingleCode;
  private InternalSingleCode internalSingleCode;
  private Set<ValueSetDisplayLink> valueSets;
  private Predicate predicate;

  private boolean possibleConstantValue;
  private boolean possibleSingleCodeValueSet;
  private boolean possibleMultipleValueSets;
  private boolean codedElementDT;

  public String getMaxLength() {
    return maxLength;
  }

  public void setMaxLength(String maxLength) {
    this.maxLength = maxLength;
  }

  public String getMinLength() {
    return minLength;
  }

  public void setMinLength(String minLength) {
    this.minLength = minLength;
  }

  public String getConfLength() {
    return confLength;
  }

  public void setConfLength(String confLength) {
    this.confLength = confLength;
  }

  public Ref getRef() {
    return ref;
  }

  public void setRef(Ref ref) {
    this.ref = ref;
  }

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public int getPosition() {
    return position;
  }

  public void setPosition(int position) {
    this.position = position;
  }

  public Usage getUsage() {
    return usage;
  }

  public void setUsage(Usage usage) {
    this.usage = usage;
  }

  public Type getType() {
    return type;
  }

  public void setType(Type type) {
    this.type = type;
  }

  public String getText() {
    return text;
  }

  public void setText(String text) {
    this.text = text;
  }

  public boolean isCustom() {
    return custom;
  }

  public void setCustom(boolean custom) {
    this.custom = custom;
  }

  public DatatypeDisplayLink getDatatype() {
    return datatype;
  }

  public void setDatatype(DatatypeDisplayLink datatype) {
    this.datatype = datatype;
  }

  public Set<CommentDisplay> getComments() {
    return comments;
  }

  public void setComments(Set<CommentDisplay> comments) {
    this.comments = comments;
  }

  public String getConstantValue() {
    return constantValue;
  }

  public void setConstantValue(String constantValue) {
    this.constantValue = constantValue;
  }

  public ExternalSingleCode getExternalSingleCode() {
    return externalSingleCode;
  }

  public void setExternalSingleCode(ExternalSingleCode externalSingleCode) {
    this.externalSingleCode = externalSingleCode;
  }

  public InternalSingleCode getInternalSingleCode() {
    return internalSingleCode;
  }

  public void setInternalSingleCode(InternalSingleCode internalSingleCode) {
    this.internalSingleCode = internalSingleCode;
  }

  public Set<ValueSetDisplayLink> getValueSets() {
    return valueSets;
  }

  public void setValueSets(Set<ValueSetDisplayLink> valueSets) {
    this.valueSets = valueSets;
  }

  public Predicate getPredicate() {
    return predicate;
  }

  public void setPredicate(Predicate predicate) {
    this.predicate = predicate;
  }

  public boolean isPossibleConstantValue() {
    return possibleConstantValue;
  }

  public void setPossibleConstantValue(boolean possibleConstantValue) {
    this.possibleConstantValue = possibleConstantValue;
  }

  public boolean isPossibleSingleCodeValueSet() {
    return possibleSingleCodeValueSet;
  }

  public void setPossibleSingleCodeValueSet(boolean possibleSingleCodeValueSet) {
    this.possibleSingleCodeValueSet = possibleSingleCodeValueSet;
  }

  public boolean isPossibleMultipleValueSets() {
    return possibleMultipleValueSets;
  }

  public void setPossibleMultipleValueSets(boolean possibleMultipleValueSets) {
    this.possibleMultipleValueSets = possibleMultipleValueSets;
  }

  public boolean isCodedElementDT() {
    return codedElementDT;
  }

  public void setCodedElementDT(boolean codedElementDT) {
    this.codedElementDT = codedElementDT;
  }

  public void addValueSet(ValueSetDisplayLink valueSetDisplayLink) {
    if (this.valueSets == null)
      this.valueSets = new HashSet<ValueSetDisplayLink>();
    this.valueSets.add(valueSetDisplayLink);
  }

  public void addComment(CommentDisplay commentDisplay) {
    if (this.comments == null)
      this.comments = new HashSet<CommentDisplay>();
    this.comments.add(commentDisplay);
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }
}
