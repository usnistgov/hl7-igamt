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

package gov.nist.hit.hl7.igamt.common.constraint.domain.assertion.complement;

public enum ComplementKey {
	 valued, 
	 notValued, 
	 containValue, 
	 notContainValue, 
	 containValueDesc, 
	 notContainValueDesc, 
	 containListValues, 
     notContainListValues,
	 containListValuesDesc,
	 notContainListValuesDesc,
	 containCode,
	 containCodeDesc,
	 containListCodes,
	 regex,
	 positiveInteger,
	 sequentially,
	 iso,
	 LOINC,
	 SNOMED,
	 cIdentical, 
	 cEarlier, 
	 cEarlierEquivalent, 
	 cTruncatedEarlier, 
	 cTruncatedEarlierEquivalent,
	 cEquivalent,
	 cTruncatedEquivalent,
	 cEquivalentLater,
	 cLater,
	 cTruncatedEquivalentLater,
	 cTruncatedLater
}
