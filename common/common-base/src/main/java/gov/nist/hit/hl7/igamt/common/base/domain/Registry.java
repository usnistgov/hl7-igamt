package gov.nist.hit.hl7.igamt.common.base.domain;

import java.io.Serializable;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

public class Registry implements Serializable{



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

  public Set<String> getLinksAsIds(){

    Set<String> ret = this.children.stream()
        .map( element -> {
          return element.getId();
        })
        .collect(Collectors.toSet());

    return ret;
  }

  public Map<String, Link> getLinksAsMap(){
    Map<String, Link> ret  = new HashMap<String, Link>();
    for(Link l : this.children) {
      if(l.getId() != null) {
        ret.put(l.getId(), l);
      }
    }
    return ret;
  }

  public Link getLinkById(String id) {
    for(Link l : this.children) {
      if(l.getId().equals(id)) return l;
    }
    return null;
  }

  /**
   * @return
   */
  public Type getType() {
    // TODO Auto-generated method stub
    return type;
  }

  public void setType(Type type) {
    this.type = type;
  }
}
