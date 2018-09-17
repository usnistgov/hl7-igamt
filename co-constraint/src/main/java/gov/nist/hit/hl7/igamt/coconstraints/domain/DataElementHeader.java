package gov.nist.hit.hl7.igamt.coconstraints.domain;

public class DataElementHeader {
	
	private String path;
	private String elmType;
	private boolean coded;
	private boolean complex;
	private String version;
	private boolean varies;
	private CellType type;
	
	public String getPath() {
		return path;
	}
	public void setPath(String path) {
		this.path = path;
	}
	public String getElmType() {
		return elmType;
	}
	public void setElmType(String elmType) {
		this.elmType = elmType;
	}
	public CellType getType() {
		return type;
	}
	public void setType(CellType type) {
		this.type = type;
	}
	public boolean isCoded() {
		return coded;
	}
	public void setCoded(boolean coded) {
		this.coded = coded;
	}
	public boolean isComplex() {
		return complex;
	}
	public void setComplex(boolean complex) {
		this.complex = complex;
	}
	public String getVersion() {
		return version;
	}
	public void setVersion(String version) {
		this.version = version;
	}
	public boolean isVaries() {
		return varies;
	}
	public void setVaries(boolean varies) {
		this.varies = varies;
	}
	
	public DataElementHeader clone(){
		DataElementHeader deh = new DataElementHeader();
		deh.path = path;
		deh.elmType = elmType;
		deh.coded = coded;
		deh.complex = complex;
		deh.version = version;
		deh.varies = varies;
		deh.type = type;
		return deh;
	}
	
}
