package gov.nist.hit.hl7.igamt.coconstraints.model;

import gov.nist.hit.hl7.igamt.common.base.domain.Type;

public class CoConstraintGrouper extends WithDelta {
    private DeltaField<String> nameDelta;
    private DeltaField<Type> typeDelta;
    private DeltaField<String> pathIdDelta;
    @Deprecated
    private String name;
    private String pathId;
    @Deprecated
    private String description;
    @Deprecated
    private String version;
    @Deprecated
    private String datatype;
    @Deprecated
    private Type type;

    @Deprecated
    public String getName() {
        return name;
    }
    @Deprecated
    public void setName(String name) {
        this.name = name;
    }

    public String getPathId() {
        return pathId;
    }

    public void setPathId(String pathId) {
        this.pathId = pathId;
    }

    @Deprecated
    public String getDescription() {
        return description;
    }
    @Deprecated
    public void setDescription(String description) {
        this.description = description;
    }
    @Deprecated
    public String getVersion() {
        return version;
    }
    @Deprecated
    public void setVersion(String version) {
        this.version = version;
    }
    @Deprecated
    public String getDatatype() {
        return datatype;
    }
    @Deprecated
    public void setDatatype(String datatype) {
        this.datatype = datatype;
    }
    @Deprecated
    public Type getType() {
        return type;
    }
    @Deprecated
    public void setType(Type type) {
        this.type = type;
    }
    @Deprecated
    public DeltaField<String> getNameDelta() {
        return nameDelta;
    }
    @Deprecated
    public void setNameDelta(DeltaField<String> nameDelta) {
        this.nameDelta = nameDelta;
    }
    @Deprecated
    public DeltaField<Type> getTypeDelta() {
        return typeDelta;
    }
    @Deprecated
    public void setTypeDelta(DeltaField<Type> typeDelta) {
        this.typeDelta = typeDelta;
    }

    public DeltaField<String> getPathIdDelta() {
        return pathIdDelta;
    }

    public void setPathIdDelta(DeltaField<String> pathIdDelta) {
        this.pathIdDelta = pathIdDelta;
    }
}
