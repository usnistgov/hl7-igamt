package gov.nist.hit.hl7.igamt.export.configuration.newModel;

public class StructuredNarrative {
	
	private boolean definitionText = false;
	private boolean comments = false ;
	private boolean postDefinition = false ;
	private boolean preDefinition = false ;
	
	
	
	public boolean isDefinitionText() {
		return definitionText;
	}
	public void setDefinitionText(boolean definitionText) {
		this.definitionText = definitionText;
	}
	public boolean isComments() {
		return comments;
	}
	public void setComments(boolean comments) {
		this.comments = comments;
	}
	public boolean isPostDefinition() {
		return postDefinition;
	}
	public void setPostDefinition(boolean postDefinition) {
		this.postDefinition = postDefinition;
	}
	public boolean isPreDefinition() {
		return preDefinition;
	}
	public void setPreDefinition(boolean preDefinition) {
		this.preDefinition = preDefinition;
	}
	
	

}
