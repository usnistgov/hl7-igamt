package gov.nist.hit.hl7.igamt.service.impl.exception;

public class CoConstraintSerializationException extends SerializationException {

		private final static String label = "Co-Constraint";

		public CoConstraintSerializationException(Exception originalException, String location, String message) {
			super(originalException, location, message);
		}

    public CoConstraintSerializationException(Exception originalException, String location) {
        super(originalException, location);
    }

    @Override public String getLabel() {
				return this.label;
		}

}
