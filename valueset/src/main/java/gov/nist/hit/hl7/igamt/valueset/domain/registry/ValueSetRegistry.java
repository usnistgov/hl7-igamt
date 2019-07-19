package gov.nist.hit.hl7.igamt.valueset.domain.registry;

import java.util.HashMap;

import gov.nist.hit.hl7.igamt.common.base.domain.Link;
import gov.nist.hit.hl7.igamt.common.base.domain.Registry;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;

public class ValueSetRegistry extends Registry {
  private ValueSetConfigForExport exportConfig;
  private HashMap<String, Boolean> codesPresence;

  public ValueSetRegistry() {
    super();
    this.type = Type.VALUESETREGISTRY;
  }


  public HashMap<String, Boolean> getCodesPresence() {
    return codesPresence;
  }

  public void setCodesPresence(HashMap<String, Boolean> codesPresence) {
    this.codesPresence = codesPresence;
  }

  public ValueSetConfigForExport getExportConfig() {
    return exportConfig;
  }

  public void setExportConfig(ValueSetConfigForExport exportConfig) {
    this.exportConfig = exportConfig;
  }


  /**
   * @param id
   * @return
   */
  public Link findOneTableById(String id) {
    for(Link link:this.getChildren()){
      if(link.getId().equals(id)) return link;
    }
    return null;
  }
}
