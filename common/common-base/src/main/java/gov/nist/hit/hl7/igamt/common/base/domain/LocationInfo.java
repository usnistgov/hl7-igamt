package gov.nist.hit.hl7.igamt.common.base.domain;

public class LocationInfo {
    private String name; // Administered Vaccine
    private String hl7Path; // RXA-5
    private Type type; // Component
    private String positionalPath; // 1.2.3
    private String pathId;

    public LocationInfo() {
    }

    public LocationInfo(String name, String hl7Path, String pathId, Type type, String positionalPath) {
        this.name = name;
        this.hl7Path = hl7Path;
        this.type = type;
        this.positionalPath = positionalPath;
        this.pathId = pathId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getHl7Path() {
        return hl7Path;
    }

    public void setHl7Path(String hl7Path) {
        this.hl7Path = hl7Path;
    }

    public Type getType() {
        return type;
    }

    public void setType(Type type) {
        this.type = type;
    }

    public String getPositionalPath() {
        return positionalPath;
    }

    public void setPositionalPath(String positionalPath) {
        this.positionalPath = positionalPath;
    }

    public String getPathId() {
        return pathId;
    }

    public void setPathId(String pathId) {
        this.pathId = pathId;
    }
    
    public LocationInfo clone() {
    	LocationInfo info = new LocationInfo();
    	info.setHl7Path(this.hl7Path);
    	info.setName(this.getName());
    	info.setPathId(this.pathId);
    	info.setPositionalPath(this.getPositionalPath());
    	info.setType(this.type);
    	
    	return info;
    }
}
