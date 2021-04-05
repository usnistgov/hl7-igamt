package gov.nist.hit.hl7.igamt.constraints.domain.assertion;

public class SubContext {
    private InstancePath path;
    private String occurenceType;
    private int occurenceValue;
    private String occurenceIdPath;
    private String occurenceLocationStr;
    private String description;

    public InstancePath getPath() {
        return path;
    }

    public void setPath(InstancePath path) {
        this.path = path;
    }

    public String getOccurenceType() {
        return occurenceType;
    }

    public void setOccurenceType(String occurenceType) {
        this.occurenceType = occurenceType;
    }

    public int getOccurenceValue() {
        return occurenceValue;
    }

    public void setOccurenceValue(int occurenceValue) {
        this.occurenceValue = occurenceValue;
    }

    public String getOccurenceIdPath() {
        return occurenceIdPath;
    }

    public void setOccurenceIdPath(String occurenceIdPath) {
        this.occurenceIdPath = occurenceIdPath;
    }

    public String getOccurenceLocationStr() {
        return occurenceLocationStr;
    }

    public void setOccurenceLocationStr(String occurenceLocationStr) {
        this.occurenceLocationStr = occurenceLocationStr;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

	@Override
	public String toString() {
		return "SubContext [path=" + path + ", occurenceType=" + occurenceType + ", occurenceValue=" + occurenceValue
				+ ", occurenceIdPath=" + occurenceIdPath + ", occurenceLocationStr=" + occurenceLocationStr
				+ ", description=" + description + "]";
	}
    
    
}
