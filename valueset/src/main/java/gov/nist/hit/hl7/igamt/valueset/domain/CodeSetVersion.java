package gov.nist.hit.hl7.igamt.valueset.domain;

import java.util.Date;
import java.util.Set;

import gov.nist.hit.hl7.igamt.valueset.model.CodeSetVersionMetadata;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
public class CodeSetVersion extends CodeSetVersionMetadata {

	private Set<Code> codes;
	
	public CodeSetVersion() {
		super();
	}

	public Set<Code> getCodes() {
		return codes;
	}

	public void setCodes(Set<Code> codes) {
		this.codes = codes;
	}
}
