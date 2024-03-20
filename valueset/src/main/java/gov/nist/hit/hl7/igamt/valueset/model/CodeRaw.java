package gov.nist.hit.hl7.igamt.valueset.model;

import gov.nist.hit.hl7.igamt.valueset.domain.Code;
import gov.nist.hit.hl7.igamt.valueset.domain.CodeUsage;

public class CodeRaw {

	public String value;
	public String description;
	public String codeSystem;
	public String codeSystemOid;
	public String comments;
	public String usage;
	public boolean hasPattern = false;
	public String pattern;
	public boolean deprecated = false;
	
	
	
	public Code convertToCode(){
		
        Code code = new Code();
        code.setValue(this.value);
        code.setPattern(this.pattern);
        code.setDescription(this.description);
        code.setCodeSystem(this.codeSystem);
            code.setUsage(CodeUsage.fromString(this.usage)); // Manually convert String to Enum
        code.setComments(this.comments);
        return code;
		
	}



	public CodeRaw() {
		super();
	}
}
