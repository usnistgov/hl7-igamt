package gov.nist.hit.hl7.igamt.valueset.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import gov.nist.hit.hl7.igamt.valueset.domain.Code;
import gov.nist.hit.hl7.igamt.valueset.domain.CodeUsage;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;

public class TableCSVGenerator {

	private static final char DEFAULT_SEPARATOR = ',';

	public String generate(Valueset t) {
		String csvString = "";
		List<String> values = new ArrayList<String>();
		values.add("Value Set Metadata");
		values.add("");
		csvString = this.writeLine(csvString, values, ',', '"');
		
		values = new ArrayList<String>();
		values.add("Mapping Identifier");
		values.add(t.getBindingIdentifier());
		csvString = this.writeLine(csvString, values, ',', '"');
		
		values = new ArrayList<String>();
		values.add("Name");
		values.add(t.getName());
		csvString = this.writeLine(csvString, values, ',', '"');
		
		values = new ArrayList<String>();
		values.add("Description");
		values.add(this.escapeNull(t.getDescription()));
		csvString = this.writeLine(csvString, values, ',', '"');
		
		values = new ArrayList<String>();
		values.add("OID");
		values.add(this.escapeNull(t.getOid()));
		csvString = this.writeLine(csvString, values, ',', '"');
		
		values = new ArrayList<String>();
		values.add("Version");
		values.add(this.escapeNull(t.getDomainInfo().getVersion()));
		csvString = this.writeLine(csvString, values, ',', '"');
		
		values = new ArrayList<String>();
		values.add("Extensibility");
		values.add(this.escapeNull(t.getExtensibility().name()));
		csvString = this.writeLine(csvString, values, ',', '"');
		
		values = new ArrayList<String>();
		values.add("Stability");
		values.add(this.escapeNull(t.getStability().name()));
		csvString = this.writeLine(csvString, values, ',', '"');
		
		values = new ArrayList<String>();
		values.add("Content Definition");
		values.add(this.escapeNull(t.getContentDefinition().name()));
		csvString = this.writeLine(csvString, values, ',', '"');
		
		values = new ArrayList<String>();
		values.add("Comment");
		values.add(this.escapeNull(t.getComment()));
		csvString = this.writeLine(csvString, values, ',', '"');
		
		values = new ArrayList<String>();
		values.add("");
		values.add("");
		csvString = this.writeLine(csvString, values, ',', '"');
		
		values = new ArrayList<String>();
		values.add("Value Set Definition");
		values.add("");
		csvString = this.writeLine(csvString, values, ',', '"');
		
		values = new ArrayList<String>();
		values.add("Value");
		values.add("Description");
		values.add("CodeSystem");
		values.add("Usage");
		values.add("Comments");
		csvString = this.writeLine(csvString, values, ',', '"');
		
		for(Code c:t.getCodes()){
			values = new ArrayList<String>();
			values.add(c.getValue());
			values.add(c.getDescription());
			values.add(c.getCodeSystem());
			if(c.getUsage() == null) c.setUsage(CodeUsage.P);
			values.add(c.getUsage().toString());
			values.add(c.getComments());
			csvString = this.writeLine(csvString, values, ',', '"');	
		}
		
		return csvString;
	}
	
	private String escapeNull(String s){
		if(s == null) return "";
		return s;
	}

	public String writeLine(String w, List<String> values) {
        return writeLine(w, values, DEFAULT_SEPARATOR, ' ');
    }

	public String writeLine(String w, List<String> values, char separators) {
    	return writeLine(w, values, separators, ' ');
    }

	public String writeLine(String w, List<String> values, char separators, char customQuote) {

        boolean first = true;

        //default customQuote is empty

        if (separators == ' ') {
            separators = DEFAULT_SEPARATOR;
        }

        StringBuilder sb = new StringBuilder();
        for (String value : values) {
            if (!first) {
                sb.append(separators);
            }
            if (customQuote == ' ') {
                sb.append(followCVSformat(value));
            } else {
                sb.append(customQuote).append(followCVSformat(value)).append(customQuote);
            }

            first = false;
        }
        sb.append("\n");
        return w + sb.toString();
    }
    
    private static String followCVSformat(String value) {

        String result = value;
        if(result == null) result = "";
        if (result.contains("\"")) {
            result = result.replace("\"", "\"\"");
        }
        return result;

    }
    
    public String generate(Set<Code> codes) {
    	
    	
    	String csvString = "";
		List<String> values = new ArrayList<String>();

		
		values = new ArrayList<String>();
		values.add("Value");
		values.add("Pattern");

		values.add("Description");
		values.add("CodeSystem");
		values.add("Usage");
		values.add("Comments");
		csvString = this.writeLine(csvString, values, ',', '"');
		
		for(Code c: codes){
			values = new ArrayList<String>();
			values.add(c.getValue());
			values.add(c.getDescription());
			values.add(c.getPattern());
			values.add(c.getCodeSystem());
			if(c.getUsage() == null) c.setUsage(CodeUsage.P);
			values.add(c.getUsage().toString());
			values.add(c.getComments());
			csvString = this.writeLine(csvString, values, ',', '"');	
		}
		
		return csvString;
	}
    	
    
    
}
