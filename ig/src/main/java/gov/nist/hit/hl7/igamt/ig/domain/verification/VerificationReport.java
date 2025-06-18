/**
 * This software was developed at the National Institute of Standards and Technology by employees of
 * the Federal Government in the course of their official duties. Pursuant to title 17 Section 105
 * of the United States Code this software is not subject to copyright protection and is in the
 * public domain. This is an experimental system. NIST assumes no responsibility whatsoever for its
 * use by other parties, and makes no guarantees, expressed or implied, about its quality,
 * reliability, or any other characteristic. We would appreciate acknowledgement if the software is
 * used. This software can be redistributed and/or modified freely provided that any derivative
 * works bear some notice that they are derived from it, and any modified versions bear some notice
 * that they have been modified.
 */
package gov.nist.hit.hl7.igamt.ig.domain.verification;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * @author jungyubw
 *
 */
public class VerificationReport implements Serializable {

	/**
	 */
	private static final long serialVersionUID = -5775165964558251622L;

	private ErrorStats stats = new ErrorStats();

	private IgVerificationResult igVerificationResult;

	private List<VSVerificationResult> valuesetVerificationResults;

	private List<DTSegVerificationResult> datatypeVerificationResults;

	private List<DTSegVerificationResult> segmentVerificationResults;

	private List<CPVerificationResult> conformanceProfileVerificationResults;

	public IgVerificationResult getIgVerificationResult() {
		return igVerificationResult;
	}

	public void addValuesetVerificationResult(VSVerificationResult valuesetVerificationResult) {
		if (this.valuesetVerificationResults == null)
			this.valuesetVerificationResults = new ArrayList<VSVerificationResult>();
		this.valuesetVerificationResults.add(valuesetVerificationResult);
	}

	public void addDatatypeVerificationResult(DTSegVerificationResult datatypeVerificationResult) {
		if (this.datatypeVerificationResults == null)
			this.datatypeVerificationResults = new ArrayList<DTSegVerificationResult>();
		this.datatypeVerificationResults.add(datatypeVerificationResult);
	}

	public void addSegmentVerificationResult(DTSegVerificationResult segmentVerificationResult) {
		if (this.segmentVerificationResults == null)
			this.segmentVerificationResults = new ArrayList<DTSegVerificationResult>();
		this.segmentVerificationResults.add(segmentVerificationResult);
	}

	public void addConformanceProfileVerificationResult(CPVerificationResult conformanceProfileVerificationResult) {
		if (this.conformanceProfileVerificationResults == null)
			this.conformanceProfileVerificationResults = new ArrayList<CPVerificationResult>();
		this.conformanceProfileVerificationResults.add(conformanceProfileVerificationResult);
	}

	public void setIgVerificationResult(IgVerificationResult igVerificationResult) {
		this.igVerificationResult = igVerificationResult;
	}

	public List<VSVerificationResult> getValuesetVerificationResults() {
		return valuesetVerificationResults;
	}

	public void setValuesetVerificationResults(List<VSVerificationResult> valuesetVerificationResults) {
		this.valuesetVerificationResults = valuesetVerificationResults;
	}

	public List<DTSegVerificationResult> getDatatypeVerificationResults() {
		return datatypeVerificationResults;
	}

	public void setDatatypeVerificationResults(List<DTSegVerificationResult> datatypeVerificationResults) {
		this.datatypeVerificationResults = datatypeVerificationResults;
	}

	public List<DTSegVerificationResult> getSegmentVerificationResults() {
		return segmentVerificationResults;
	}

	public void setSegmentVerificationResults(List<DTSegVerificationResult> segmentVerificationResults) {
		this.segmentVerificationResults = segmentVerificationResults;
	}

	public List<CPVerificationResult> getConformanceProfileVerificationResults() {
		return conformanceProfileVerificationResults;
	}

	public void setConformanceProfileVerificationResults(
			List<CPVerificationResult> conformanceProfileVerificationResults) {
		this.conformanceProfileVerificationResults = conformanceProfileVerificationResults;
	}

	public ErrorStats getStats() {
		return stats;
	}

	public void setStats(ErrorStats stats) {
		this.stats = stats;
	}

	public void addStats(ErrorStats add) {
		this.stats.setTotal(this.stats.getTotal() + add.getTotal());
		this.stats.setFatal(this.stats.getFatal() + add.getFatal());
		this.stats.setError(this.stats.getError() + add.getError());
		this.stats.setWarning(this.stats.getWarning() + add.getWarning());
		this.stats.setInformational(this.stats.getInformational() + add.getInformational());
		
	}

}
