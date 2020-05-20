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
package gov.nist.hit.hl7.igamt.constraints.domain.assertion.complement;

import gov.nist.hit.hl7.igamt.constraints.domain.assertion.Path;

/**
 * @author jungyubw
 *
 */

public class Complement {

	private ComplementKey complementKey;

	private String occurenceType;
	private int occurenceValue;
	private String occurenceIdPath;
	private String occurenceLocationStr;

	private Path path;

	private String value;
	private String desc;
	private String codesys;

	private String[] values;
	private String[] descs;
	private String[] codesyses;

	private boolean ignoreCase;

	public Complement() {
		super();
	}

	public ComplementKey getComplementKey() {
		return complementKey;
	}

	public void setComplementKey(ComplementKey complementKey) {
		this.complementKey = complementKey;
	}

	public String getOccurenceType() {
		return occurenceType;
	}

	public void setOccurenceType(String occurenceType) {
		this.occurenceType = occurenceType;
	}

	public int getOccurenceValue() {
		return occurenceValue;
	}

	public void setOccurenceValue(int occurenceValue) {
		this.occurenceValue = occurenceValue;
	}

	public String getOccurenceIdPath() {
		return occurenceIdPath;
	}

	public void setOccurenceIdPath(String occurenceIdPath) {
		this.occurenceIdPath = occurenceIdPath;
	}

	public String getOccurenceLocationStr() {
		return occurenceLocationStr;
	}

	public void setOccurenceLocationStr(String occurenceLocationStr) {
		this.occurenceLocationStr = occurenceLocationStr;
	}

	public Path getPath() {
		return path;
	}

	public void setPath(Path path) {
		this.path = path;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}

	public String[] getValues() {
		return values;
	}

	public void setValues(String[] values) {
		this.values = values;
	}

	public String getDesc() {
		return desc;
	}

	public void setDesc(String desc) {
		this.desc = desc;
	}

	public String[] getDescs() {
		return descs;
	}

	public void setDescs(String[] descs) {
		this.descs = descs;
	}

	public boolean isIgnoreCase() {
		return ignoreCase;
	}

	public void setIgnoreCase(boolean ignoreCase) {
		this.ignoreCase = ignoreCase;
	}

	public String[] getCodesyses() {
		return codesyses;
	}

	public void setCodesyses(String[] codesyses) {
		this.codesyses = codesyses;
	}

	public String getCodesys() {
		return codesys;
	}

	public void setCodesys(String codesys) {
		this.codesys = codesys;
	}

}