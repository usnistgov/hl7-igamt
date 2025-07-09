package gov.nist.hit.hl7.igamt.valueset.domain.registry;

import java.util.HashMap;

import gov.nist.hit.hl7.igamt.common.base.domain.*;

public class ValueSetRegistry extends Registry {
  /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
    private ValueSetConfigForExport exportConfig;
    private HashMap<String, Boolean> codesPresence = new HashMap<String, Boolean>();
    private GroupedId groupedData;


    public GroupedId getGroupedData() {
       return groupedData;
    }

    public void setGroupedData(GroupedId groupedData) {
       this.groupedData = groupedData;
    }



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

  public Link findOneTableById(String id) {
    for(Link link:this.getChildren()){
      if(link.getId().equals(id)) return link;
    }
    return null;
  }

}
