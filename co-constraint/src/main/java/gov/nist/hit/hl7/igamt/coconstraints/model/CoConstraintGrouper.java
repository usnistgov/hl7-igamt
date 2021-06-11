package gov.nist.hit.hl7.igamt.coconstraints.model;

import gov.nist.hit.hl7.igamt.common.base.domain.Type;

public class CoConstraintGrouper extends WithDelta {
    private DeltaField<String> nameDelta;
    private DeltaField<Type> typeDelta;

    private String name;
    private String pathId;
    private String description;
    private String version;
    private String datatype;
    private Type type;


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPathId() {
        return pathId;
    }

    public void setPathId(String pathId) {
        this.pathId = pathId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getDatatype() {
        return datatype;
    }

    public void setDatatype(String datatype) {
        this.datatype = datatype;
    }

    public Type getType() {
        return type;
    }

    public void setType(Type type) {
        this.type = type;
    }

    public DeltaField<String> getNameDelta() {
        return nameDelta;
    }

    public void setNameDelta(DeltaField<String> nameDelta) {
        this.nameDelta = nameDelta;
    }

    public DeltaField<Type> getTypeDelta() {
        return typeDelta;
    }

    public void setTypeDelta(DeltaField<Type> typeDelta) {
        this.typeDelta = typeDelta;
    }
}
