package gov.nist.hit.hl7.igamt.service.impl.exception;

public class GVTExportException extends Exception {
	private static final long serialVersionUID = 1L;

	public GVTExportException(String error) {
		super(error);
	}

	public GVTExportException(Exception error) {
		super(error);
	}

}
