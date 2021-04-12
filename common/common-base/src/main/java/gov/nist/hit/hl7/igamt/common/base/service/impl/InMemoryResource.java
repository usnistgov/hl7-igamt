package gov.nist.hit.hl7.igamt.common.base.service.impl;

import gov.nist.hit.hl7.igamt.common.base.domain.Resource;

public class InMemoryResource {
    String id;
    byte[] bytes;
    Class<? extends Resource> type;

    public InMemoryResource(String id, byte[] bytes, Class<? extends Resource> type) {
        this.id = id;
        this.bytes = bytes;
        this.type = type;
    }

    public byte[] getBytes() {
        return bytes;
    }

    public void setBytes(byte[] bytes) {
        this.bytes = bytes;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Class<? extends Resource> getType() {
        return type;
    }

    public void setType(Class<? extends Resource> type) {
        this.type = type;
    }
}
