package gov.nist.hit.hl7.igamt.datatype.service.newrobexport;

import java.util.List;
import java.util.Map;
import java.util.Set;

import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;

public class Tools {

	public void emptyListFromRoot(MyExportObject myExportObject) {
		for(String version : myExportObject.getDatatypesbyVersionThenName().keySet()) {
			for(String name : myExportObject.getDatatypesbyVersionThenName().get(version).keySet()) {
				for(Datatype datatype : myExportObject.getDatatypesbyVersionThenName().get(version).get(name)) {
					if(datatype.getExt().isEmpty()) {
						myExportObject.getDatatypesbyVersionThenName().get(version).get(name).remove(datatype);
					}
				}
			}
		}
		
		for(String name : myExportObject.getDatatypesbyNameThenVersion().keySet()) {
			for(Set<String> versionSet : myExportObject.getDatatypesbyNameThenVersion().get(name).keySet()) {
				for(Datatype datatype : myExportObject.getDatatypesbyNameThenVersion().get(name).get(versionSet)) {
					if(datatype.getExt().isEmpty()) {
						myExportObject.getDatatypesbyNameThenVersion().get(name).get(versionSet).remove(datatype);
					}
				}
			}
		}
	}
}
