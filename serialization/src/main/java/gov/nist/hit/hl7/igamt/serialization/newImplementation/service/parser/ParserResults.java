package gov.nist.hit.hl7.igamt.serialization.newImplementation.service.parser;

import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintTable;
import gov.nist.hit.hl7.igamt.ig.domain.verification.VerificationResult;

public class ParserResults {

	private CoConstraintTable coConstraintTable;
	private VerificationResult verificationResult;
	
	
	public CoConstraintTable getCoConstraintTable() {
		return coConstraintTable;
	}
	public void setCoConstraintTable(CoConstraintTable coConstraintTable) {
		this.coConstraintTable = coConstraintTable;
	}
	public VerificationResult getVerificationResult() {
		return verificationResult;
	}
	public void setVerificationResult(VerificationResult verificationResult) {
		this.verificationResult = verificationResult;
	}
	
	
}
