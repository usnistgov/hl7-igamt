package gov.nist.hit.hl7.igamt.coconstraints.domain;

public class CoConstraintTableHeader {
	
	private String id;
	private String label;
	private boolean keep;
	private CellTemplateType template;
	private DataElementHeader content;
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getLabel() {
		return label;
	}
	public void setLabel(String label) {
		this.label = label;
	}
	public boolean isKeep() {
		return keep;
	}
	public void setKeep(boolean keep) {
		this.keep = keep;
	}
	public DataElementHeader getContent() {
		return content;
	}
	public void setContent(DataElementHeader content) {
		this.content = content;
	}
	public CellTemplateType getTemplate() {
		return template;
	}
	public void setTemplate(CellTemplateType template) {
		this.template = template;
	}
	
	public CoConstraintTableHeader clone(){
		CoConstraintTableHeader header = new CoConstraintTableHeader();
		header.setId(this.getId());
		header.keep = this.keep;
		header.setTemplate(this.template);
		if(this.content != null){
			header.content = this.content.clone();
		}
		
		return header;
	}

}
