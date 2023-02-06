package gov.nist.hit.hl7.igamt.ig.domain.verification;

public class ErrorStats {

	int fatal;
	int error;
	int warning;
	int informational;
	int total;

	public ErrorStats() {
		super();

		this.total = this.fatal = this.error = this.warning = this.informational = 0;
	}

	public int getTotal() {
		return total;
	}

	public void setTotal(int total) {
		this.total = total;
	}

	public int getFatal() {
		return fatal;
	}

	public void setFatal(int fatal) {
		this.fatal = fatal;
	}

	public int getError() {
		return error;
	}

	public void setError(int error) {
		this.error = error;
	}

	public int getWarning() {
		return warning;
	}

	public void setWarning(int warning) {
		this.warning = warning;
	}

	public int getInformational() {
		return informational;
	}

	public void setInformational(int informational) {
		this.informational = informational;
	}

}
