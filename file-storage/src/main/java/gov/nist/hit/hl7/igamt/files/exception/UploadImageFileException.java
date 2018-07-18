package gov.nist.hit.hl7.igamt.files.exception;

public class UploadImageFileException extends Exception {
	private static final long serialVersionUID = 1L;

	public UploadImageFileException(String error) {
		super(error);
	}

	public UploadImageFileException(Exception error) {
		super(error);
	}

}
