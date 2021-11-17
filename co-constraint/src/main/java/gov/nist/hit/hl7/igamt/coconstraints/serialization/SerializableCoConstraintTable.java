package gov.nist.hit.hl7.igamt.coconstraints.serialization;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintTable;

public class SerializableCoConstraintTable extends CoConstraintTable {
    protected SerializableHeaders headers;

    @Override
    public SerializableHeaders getHeaders() {
        return headers;
    }

    public void setHeaders(SerializableHeaders headers) {
        this.headers = headers;
    }
}