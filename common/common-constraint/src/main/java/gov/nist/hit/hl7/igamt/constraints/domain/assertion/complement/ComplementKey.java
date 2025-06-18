/*****************************************************************
* project : constraint
* program name : gov.nist.hit.hl7.igamt.constraints.domain.assertion.complement.ComplementKey.java
* description :
* version : 2.0.0
* @author : Jungyub Woo
* created date : Jul 27, 2019
* modification log
* ================================================================
*  date        name             description
* ----------------------------------------------------------------
* Jul 27, 2019    jungy           first generated
*****************************************************************/

package gov.nist.hit.hl7.igamt.constraints.domain.assertion.complement;

public enum ComplementKey {
	 valued, 
	 notValued, 
	 containValue(true, false, false, false),
	 notContainValue(true, false, false, false),
	containValueDesc(true, true, false, false),
	notContainValueDesc(true, true, false, false),
	containListValues(true, false, false, true),
	notContainListValues(true, false, false, true),
	 containListValuesDesc(true, true, false, true),
	 notContainListValuesDesc(true, false, false, true),
	 containCode(true, false, true, false),
	 containCodeDesc(true, true, true, false),
	 containListCodes(true, false, true, true),
	 containListCodesDesc(true, true, true, true),
	 regex(true, false, false, false),
	 positiveInteger,
	 sequentially,
	 iso,
	 LOINC,
	 SNOMED,
	 cIdentical(false),
	 cEarlier(true),
	cEarlierEquivalent(true),
	 cTruncatedEarlier(true),
	 cTruncatedEarlierEquivalent(true),
	 cEquivalent(false),
	 cTruncatedEquivalent(false),
	 cEquivalentLater(true),
	 cLater(true),
	 cTruncatedEquivalentLater(true),
	 cTruncatedLater(true);

	 private boolean comparison;
	 private boolean value;
	 private boolean description;
	 private boolean codeSys;
	 private boolean multi;
	 private boolean dateTime;


	ComplementKey(boolean value, boolean description, boolean codeSys, boolean multi) {
		this.value = value;
		this.description = description;
		this.codeSys = codeSys;
		this.multi = multi;
	}

	ComplementKey(boolean dateTime) {
		this.comparison = true;
		this.dateTime = dateTime;
	}

	ComplementKey() {
	}

	public boolean isComparison() {
		return comparison;
	}

	public boolean isValue() {
		return value;
	}


	public boolean isDescription() {
		return description;
	}

	public boolean isCodeSys() {
		return codeSys;
	}

	public boolean isMulti() {
		return multi;
	}

	public boolean isDateTime() {
		return dateTime;
	}
}
