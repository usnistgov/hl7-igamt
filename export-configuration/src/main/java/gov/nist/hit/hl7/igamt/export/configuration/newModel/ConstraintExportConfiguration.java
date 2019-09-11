package gov.nist.hit.hl7.igamt.export.configuration.newModel;

public class ConstraintExportConfiguration {

	private boolean conformanceStatement;
	private boolean predicate;
	
	public ConstraintExportConfiguration(boolean conformanceStatement, boolean predicate) {
		this.predicate=predicate;
		this.conformanceStatement=conformanceStatement;
	}
	public Boolean getConformanceStatement() {
		return conformanceStatement;
	}
	public void setConformanceStatement(Boolean conformanceStatement) {
		this.conformanceStatement = conformanceStatement;
	}
	public Boolean getPredicate() {
		return predicate;
	}
	public void setPredicate(Boolean predicate) {
		this.predicate = predicate;
	}
	
	
}
