package gov.nist.hit.hl7.igamt.datatype.domain;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import gov.nist.hit.hl7.igamt.common.base.domain.DomainInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;


/**
 *
 * @author Maxence Lefort on Feb 21, 2018.
 */
public class ComplexDatatype extends Datatype {

  private Set<Component> components = new HashSet<Component>();

  public ComplexDatatype() {
    super();
  }



  public Set<Component> getComponents() {
    return components;
  }

  public void setComponents(Set<Component> components) {
    this.components = components;
  }

  @Override
  public Datatype clone() {

    ComplexDatatype clone = new ComplexDatatype();
    clone.setComponents(components);
    clone.setBinding(this.getBinding());
    clone.setComment(this.getComment());
    clone.setCreatedFrom(this.getId());
    clone.setDescription(this.getDescription());
    DomainInfo domainInfo = this.getDomainInfo();
    domainInfo.setScope(Scope.USER);
    clone.setId(null);
    clone.setPostDef(this.getPostDef());
    clone.setPreDef(this.getPreDef());
    clone.setName(this.getName());
    clone.setDomainInfo(domainInfo);
    clone.setCreationDate(new Date());
    clone.setUpdateDate(new Date());
    return clone;


  };

}
