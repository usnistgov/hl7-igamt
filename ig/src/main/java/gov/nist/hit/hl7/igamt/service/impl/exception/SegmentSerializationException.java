package gov.nist.hit.hl7.igamt.service.impl.exception;


public class SegmentSerializationException extends SerializationException {

    private String label = "Segment";

    public SegmentSerializationException(Exception originalException, String location) {
        this(originalException, location, null);
    }

    public SegmentSerializationException(Exception originalException, String location,
        String message) {
        super(originalException, location, message);
    }

    @Override public String getLabel() {
        return this.label;
    }

}
