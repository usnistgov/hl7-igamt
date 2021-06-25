package gov.nist.hit.hl7.igamt.common.base.service.impl;

import gov.nist.hit.hl7.igamt.common.base.domain.Resource;

public class DataFragment<T extends Resource> {
    private T payload;
    private DataExtension context;


    public DataFragment(T payload, DataExtension context) {
        super();
        this.payload = payload;
        this.context = context;
    }

    public T getPayload() {
        return payload;
    }

    public void setPayload(T payload) {
        this.payload = payload;
    }

    public DataExtension getContext() {
        return context;
    }

    public void setContext(DataExtension context) {
        this.context = context;
    }
}
