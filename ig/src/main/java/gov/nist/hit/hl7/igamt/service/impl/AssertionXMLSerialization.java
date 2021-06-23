package gov.nist.hit.hl7.igamt.service.impl;

import gov.nist.hit.hl7.igamt.common.base.domain.Level;
import gov.nist.hit.hl7.igamt.constraints.domain.assertion.*;
import gov.nist.hit.hl7.igamt.constraints.domain.assertion.complement.Complement;
import gov.nist.hit.hl7.igamt.constraints.domain.assertion.complement.ComplementKey;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AssertionXMLSerialization {

    @Autowired
    GeneratePathService generatePathService;

    public String generateSingleAssertionScript(SingleAssertion assertion, Level level,
                                                 String targetId, InstancePath context, boolean presenceCheckOn) {
        Complement complement = assertion.getComplement();
        ComplementKey key = complement.getComplementKey();
        boolean notAssertion = assertion.getVerbKey().contains("NOT");

        boolean atLeastOnce = false;
        boolean noOccurrence = false;

        String sPathStr = this.generatePathService.generatePath(assertion.getSubject().getPath(), targetId, level, context);
        String cPathStr = null;
        if (complement.getPath() != null) {
            cPathStr = this.generatePathService.generatePath(complement.getPath(), targetId, level, context);
        }

        String notPresentBehaviorStr;
        if(presenceCheckOn) notPresentBehaviorStr = "FAIL";
        else notPresentBehaviorStr = "PASS";


        if (assertion.getSubject().getOccurenceType() != null) {
            if (assertion.getSubject().getOccurenceType().equals("atLeast")) {
                atLeastOnce = true;
            } else if (assertion.getSubject().getOccurenceType().equals("instance")) {
                sPathStr = this.generatePathService.replaceLast(sPathStr, "[*]", "" + assertion.getSubject().getOccurenceValue());
            } else if (assertion.getSubject().getOccurenceType().equals("noOccurrence")) {
                noOccurrence = true;
            }
        }

        if (complement.getOccurenceType() != null && cPathStr != null) {
            if (complement.getOccurenceType().equals("instance")) {
                cPathStr = this.generatePathService.replaceLast(cPathStr, "[*]", "" + complement.getOccurenceValue());
            }
        }


        String result = "";
        switch (key) {
            case valued:
                result = "<Presence Path=\"" + sPathStr + "\"/>";
                break;
            case notValued:
                result = "<NOT><Presence Path=\"" + sPathStr + "\"/></NOT>";
                break;
            case containValue:
                result = "<PlainText Path=\"" + sPathStr + "\" Text=\"" + complement.getEscapeXml()
                        + "\" IgnoreCase=\"" + complement.isIgnoreCase() + "\" AtLeastOnce=\"" + atLeastOnce
                        + "\" NotPresentBehavior=\"" + notPresentBehaviorStr
                        + "\"/>";
                break;
            case notContainValue:
                result = "<NOT><PlainText Path=\"" + sPathStr + "\" Text=\"" + complement.getEscapeXml()
                        + "\" IgnoreCase=\"" + complement.isIgnoreCase() + "\" AtLeastOnce=\"" + atLeastOnce
                        + "\" NotPresentBehavior=\"" + notPresentBehaviorStr
                        + "\"/></NOT>";
                break;
            case containValueDesc:
                result = "<PlainText Path=\"" + sPathStr + "\" Text=\"" + complement.getEscapeXml()
                        + "\" IgnoreCase=\"" + complement.isIgnoreCase() + "\" AtLeastOnce=\"" + atLeastOnce
                        + "\" NotPresentBehavior=\"" + notPresentBehaviorStr
                        + "\"/>";
                break;
            case notContainValueDesc:
                result = "<NOT><PlainText Path=\"" + sPathStr + "\" Text=\"" + complement.getEscapeXml()
                        + "\" IgnoreCase=\"" + complement.isIgnoreCase() + "\" AtLeastOnce=\"" + atLeastOnce
                        + "\" NotPresentBehavior=\"" + notPresentBehaviorStr
                        + "\"/></NOT>";
                break;
            case containListValues:
                result = "<StringList Path=\"" + sPathStr + "\" CSV=\""
                        + String.join(",", complement.getValues()) + "\" IgnoreCase=\""
                        + complement.isIgnoreCase() + "\" AtLeastOnce=\"" + atLeastOnce
                        + "\" NotPresentBehavior=\"" + notPresentBehaviorStr
                        + "\"/>";
                break;
            case notContainListValues:
                result = "<NOT><StringList Path=\"" + sPathStr + "\" CSV=\""
                        + String.join(",", complement.getValues()) + "\" IgnoreCase=\""
                        + complement.isIgnoreCase() + "\" AtLeastOnce=\"" + atLeastOnce
                        + "\" NotPresentBehavior=\"" + notPresentBehaviorStr
                        + "\"/></NOT>";
                break;
            case containListValuesDesc:
                result = "<StringList Path=\"" + sPathStr + "\" CSV=\""
                        + String.join(",", complement.getValues()) + "\" IgnoreCase=\""
                        + complement.isIgnoreCase() + "\" AtLeastOnce=\"" + atLeastOnce
                        + "\" NotPresentBehavior=\"" + notPresentBehaviorStr
                        + "\"/>";
                break;
            case notContainListValuesDesc:
                result = "<NOT><StringList Path=\"" + sPathStr + "\" CSV=\""
                        + String.join(",", complement.getValues()) + "\" IgnoreCase=\""
                        + complement.isIgnoreCase() + "\" AtLeastOnce=\"" + atLeastOnce
                        + "\" NotPresentBehavior=\"" + notPresentBehaviorStr
                        + "\"/></NOT>";
                break;
            case containCode:
                result = "<PlainText Path=\"" + sPathStr + "\" Text=\"" + complement.getEscapeXml()
                        + "\" IgnoreCase=\"" + false + "\" AtLeastOnce=\"" + atLeastOnce
                        + "\" NotPresentBehavior=\"" + notPresentBehaviorStr
                        + "\"/>";
                break;
            case containCodeDesc:
                result = "<PlainText Path=\"" + sPathStr + "\" Text=\"" + complement.getValue()
                        + "\" IgnoreCase=\"" + false + "\" AtLeastOnce=\"" + atLeastOnce
                        + "\" NotPresentBehavior=\"" + notPresentBehaviorStr
                        + "\"/>";
                break;
            case containListCodes:
                result = "<StringList Path=\"" + sPathStr + "\" CSV=\""
                        + String.join(",", complement.getValues()) + "\" IgnoreCase=\"" + false
                        + "\" AtLeastOnce=\"" + atLeastOnce
                        + "\" NotPresentBehavior=\"" + notPresentBehaviorStr
                        + "\"/>";
                break;

            case containListCodesDesc:
                result = "<StringList Path=\"" + sPathStr + "\" CSV=\""
                        + String.join(",", complement.getValues()) + "\" IgnoreCase=\"" + false
                        + "\" AtLeastOnce=\"" + atLeastOnce
                        + "\" NotPresentBehavior=\"" + notPresentBehaviorStr
                        + "\"/>";
                break;
            case regex:
                result = "<Format Path=\"" + sPathStr + "\" Regex=\"" + complement.getValue()
                        + "\" AtLeastOnce=\"" + atLeastOnce
                        + "\" NotPresentBehavior=\"" + notPresentBehaviorStr
                        + "\"/>";
                break;
            case positiveInteger:
                result = "<Format Path=\"" + sPathStr + "\" Regex=\"" + "^[1-9]\\d*$"
                        + "\" AtLeastOnce=\"" + atLeastOnce
                        + "\" NotPresentBehavior=\"" + notPresentBehaviorStr
                        + "\"/>";
                break;
            case LOINC:
                result = "<StringFormat Path=\"" + sPathStr + "\" Format=\"" + "LOINC"
                        + "\" AtLeastOnce=\"" + atLeastOnce
                        + "\" NotPresentBehavior=\"" + notPresentBehaviorStr
                        + "\"/>";
                break;
            case SNOMED:
                result = "<StringFormat Path=\"" + sPathStr + "\" Format=\"" + "SNOMED"
                        + "\" AtLeastOnce=\"" + atLeastOnce
                        + "\" NotPresentBehavior=\"" + notPresentBehaviorStr
                        + "\"/>";
                break;
            case sequentially:
                result = "<SetID Path=\"" + sPathStr + "\"/>";
                break;
            case iso:
                result = "<Format Path=\"" + sPathStr + "\" Regex=\"" + "[0-2](\\.(0|[1-9][0-9]*))*"
                        + "\" AtLeastOnce=\"" + atLeastOnce
                        + "\" NotPresentBehavior=\"" + notPresentBehaviorStr
                        + "\"/>";
                break;
            case cEarlier:
                result = "<PathValue Path1=\"" + sPathStr + "\" Operator=\"" + "LT" + "\" Path2=\""
                        + cPathStr
                        + "\" NotPresentBehavior=\"" + notPresentBehaviorStr
                        + "\"/>";
                break;
            case cEarlierEquivalent:
                result = "<PathValue Path1=\"" + sPathStr + "\" Operator=\"" + "LE" + "\" Path2=\""
                        + cPathStr
                        + "\" NotPresentBehavior=\"" + notPresentBehaviorStr
                        + "\"/>";
                break;
            case cEquivalent:
                result = "<PathValue Path1=\"" + sPathStr + "\" Operator=\"" + "EQ" + "\" Path2=\""
                        + cPathStr
                        + "\" NotPresentBehavior=\"" + notPresentBehaviorStr
                        + "\"/>";
                break;
            case cEquivalentLater:
                result = "<PathValue Path1=\"" + sPathStr + "\" Operator=\"" + "GE" + "\" Path2=\""
                        + cPathStr
                        + "\" NotPresentBehavior=\"" + notPresentBehaviorStr
                        + "\"/>";
                break;
            case cIdentical:
                result = "<PathValue Path1=\"" + sPathStr + "\" Operator=\"" + "EQ" + "\" Path2=\""
                        + cPathStr
                        + "\" NotPresentBehavior=\"" + notPresentBehaviorStr
                        + "\"/>";
                break;
            case cLater:
                result = "<PathValue Path1=\"" + sPathStr + "\" Operator=\"" + "GT" + "\" Path2=\""
                        + cPathStr
                        + "\" NotPresentBehavior=\"" + notPresentBehaviorStr
                        + "\"/>";
                break;
            case cTruncatedEarlier:
                result = "<PathValue Path1=\"" + sPathStr + "\" Operator=\"" + "LT" + "\" Path2=\""
                        + cPathStr
                        + "\" NotPresentBehavior=\"" + notPresentBehaviorStr
                        + "\"/>";
                break;
            case cTruncatedEarlierEquivalent:
                result = "<PathValue Path1=\"" + sPathStr + "\" Operator=\"" + "LE" + "\" Path2=\""
                        + cPathStr
                        + "\" NotPresentBehavior=\"" + notPresentBehaviorStr
                        + "\"/>";
                break;
            case cTruncatedEquivalent:
                result = "<PathValue Path1=\"" + sPathStr + "\" Operator=\"" + "EQ" + "\" Path2=\""
                        + cPathStr
                        + "\" NotPresentBehavior=\"" + notPresentBehaviorStr
                        + "\"/>";
                break;
            case cTruncatedEquivalentLater:
                result = "<PathValue Path1=\"" + sPathStr + "\" Operator=\"" + "GE" + "\" Path2=\""
                        + cPathStr
                        + "\" NotPresentBehavior=\"" + notPresentBehaviorStr
                        + "\"/>";
                break;
            case cTruncatedLater:
                result = "<PathValue Path1=\"" + sPathStr + "\" Operator=\"" + "GT" + "\" Path2=\""
                        + cPathStr
                        + "\" NotPresentBehavior=\"" + notPresentBehaviorStr
                        + "\"/>";
                break;
            default:
                break;
        }

        if (noOccurrence)
            result = "<NOT>" + result + "</NOT>";
        if (notAssertion)
            result = "<NOT>" + result + "</NOT>";

        return result;
    }

    public String generateAssertionScript(Assertion assertion, Level level, String targetId,
                                           InstancePath context, boolean presenceCheckOn) {
        if (assertion instanceof NotAssertion) {
            return "<NOT>" + this.generateAssertionScript(((NotAssertion) assertion).getChild(), level,
                    targetId, context, presenceCheckOn) + "</NOT>";
        } else if (assertion instanceof IfThenAssertion) {
            return "<IMPLY>"
                    + this.generateAssertionScript(((IfThenAssertion) assertion).getIfAssertion(), level,
                    targetId, context, true)
                    + this.generateAssertionScript(((IfThenAssertion) assertion).getThenAssertion(), level,
                    targetId, context, true)
                    + "</IMPLY>";
        } else if (assertion instanceof OperatorAssertion) {
            OperatorAssertion oAssertion = (OperatorAssertion) assertion;
            if (oAssertion.getOperator().equals(OperatorAssertion.Operator.AND)) {
                if (oAssertion.getAssertions().size() == 2) {
                    String script = "<AND>";
                    for (Assertion a : oAssertion.getAssertions()) {
                        script = script + this.generateAssertionScript(a, level, targetId, context, presenceCheckOn);
                    }
                    return script + "</AND>";
                } else if (oAssertion.getAssertions().size() > 2) {
                    String script = "<FORALL>";
                    for (Assertion a : oAssertion.getAssertions()) {
                        script = script + this.generateAssertionScript(a, level, targetId, context, presenceCheckOn);
                    }
                    return script + "</FORALL>";
                }

            } else if (oAssertion.getOperator().equals(OperatorAssertion.Operator.OR)) {
                if (oAssertion.getAssertions().size() == 2) {
                    String script = "<OR>";
                    for (Assertion a : oAssertion.getAssertions()) {
                        script = script + this.generateAssertionScript(a, level, targetId, context, presenceCheckOn);
                    }
                    return script + "</OR>";
                } else if (oAssertion.getAssertions().size() > 2) {
                    String script = "<EXIST>";
                    for (Assertion a : oAssertion.getAssertions()) {
                        script = script + this.generateAssertionScript(a, level, targetId, context, presenceCheckOn);
                    }
                    return script + "</EXIST>";
                }
            } else if (oAssertion.getOperator().equals(OperatorAssertion.Operator.XOR)) {
                if (oAssertion.getAssertions().size() == 2) {
                    String script = "<XOR>";
                    for (Assertion a : oAssertion.getAssertions()) {
                        script = script + this.generateAssertionScript(a, level, targetId, context, presenceCheckOn);
                    }
                    return script + "</XOR>";
                }
            }

        } else if (assertion instanceof SingleAssertion) {
            return this.generateSingleAssertionScript((SingleAssertion) assertion, level, targetId,
                    context, presenceCheckOn);
        }

        return null;
    }
}
