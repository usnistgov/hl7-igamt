package gov.nist.hit.hl7.igamt.common.base.domain;

import java.util.HashSet;
import java.util.Set;

import org.springframework.data.mongodb.core.mapping.Document;

import gov.nist.hit.hl7.igamt.common.base.domain.Link;
import gov.nist.hit.hl7.igamt.common.base.domain.Section;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
public class Registry{
  
  private Set<Link> children = new HashSet<Link>();
  protected Type type;
 

  public Set<Link> getChildren() {
    return children;
  }
  public void setChildren(Set<Link> children) {
    this.children = children;
  }
  public Registry() {
 
  }
  /**
   * @return
   */
  public Type getType() {
    // TODO Auto-generated method stub
    return type;
  }


}
