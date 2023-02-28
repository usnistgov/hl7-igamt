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

        String sPathStr = this.generatePathService.generatePath(assertion.getSubject().getPath(), targetId, level, context);
        String cPathStr = null;
        String occurenceStr = "";
        String strPath1Mode = "";
        String strPath2Mode = "";
        
        if (complement.getPath() != null) {
            cPathStr = this.generatePathService.generatePath(complement.getPath(), targetId, level, context);
        }

        String notPresentBehaviorStr;
        if(presenceCheckOn) notPresentBehaviorStr = "FAIL";
        else notPresentBehaviorStr = "PASS";


        if (assertion.getSubject().getOccurenceType() != null) {
            if (assertion.getSubject().getOccurenceType().equals("atLeast")) {
            	if(notAssertion) {
                	occurenceStr = "AtLeastOnce=\"false\"";
                	strPath1Mode = "Path1Mode=\"All\"";
            	} else {
                	occurenceStr = "AtLeastOnce=\"true\"";
                	strPath1Mode = "Path1Mode=\"AtLeastOne\"";            		
            	}

            } else if (assertion.getSubject().getOccurenceType().equals("noOccurrence")) {
            	occurenceStr = "Min=\"0\" Max\"0\"";
            	strPath1Mode = "Path1Mode=\"0\"";
            } else if (assertion.getSubject().getOccurenceType().equals("exactlyOne")) {
            	occurenceStr = "Min=\"1\" Max\"1\"";
            	strPath1Mode = "Path1Mode=\"1\"";
            } else if (assertion.getSubject().getOccurenceType().equals("count")) {
            	occurenceStr = "Min=\"" + assertion.getSubject().getOccurenceValue() + "\" Max\"" + assertion.getSubject().getOccurenceValue()+ "\"";
            	strPath1Mode = "Path1Mode=\"" + assertion.getSubject().getOccurenceValue() + "\"";
            } else if (assertion.getSubject().getOccurenceType().equals("all")) {
            	if(notAssertion) {
            		occurenceStr = "AtLeastOnce=\"true\"";
                	strPath1Mode = "Path1Mode=\"AtLeastOne\"";
            	} else {
            		occurenceStr = "AtLeastOnce=\"false\"";
                	strPath1Mode = "Path1Mode=\"All\"";	
            	}
            	
            } else if (assertion.getSubject().getOccurenceType().equals("instance")) {
                sPathStr = this.generatePathService.replaceLast(sPathStr, "[*]", "" + assertion.getSubject().getOccurenceValue());
            }
        
        }

        if (complement.getOccurenceType() != null && cPathStr != null) {
        	
        	
        	if (complement.getOccurenceType().equals("atLeast")) {
        		strPath2Mode = "Path2Mode=\"AtLeastOne\"";
            } else if (complement.getOccurenceType().equals("noOccurrence")) {
            	strPath2Mode = "Path2Mode=\"0\"";
            } else if (complement.getOccurenceType().equals("exactlyOne")) {
            	strPath2Mode = "Path2Mode=\"1\"";
            } else if (complement.getOccurenceType().equals("count")) {
            	strPath2Mode = "Path2Mode=\"" + complement.getOccurenceValue() + "\"";
            } else if (complement.getOccurenceType().equals("all")) {
            	strPath2Mode = "Path2Mode=\"All\"";
            } else if (complement.getOccurenceType().equals("instance")) {
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
                        + "\" IgnoreCase=\"" + complement.isIgnoreCase() + "\" " + occurenceStr
                        + " NotPresentBehavior=\"" + notPresentBehaviorStr
                        + "\"/>";
                break;
            case notContainValue:
                result = "<NOT><PlainText Path=\"" + sPathStr + "\" Text=\"" + complement.getEscapeXml()
                        + "\" IgnoreCase=\"" + complement.isIgnoreCase() + "\" " + occurenceStr
                        + " NotPresentBehavior=\"" + notPresentBehaviorStr
                        + "\"/></NOT>";
                break;
            case containValueDesc:
                result = "<PlainText Path=\"" + sPathStr + "\" Text=\"" + complement.getEscapeXml()
                        + "\" IgnoreCase=\"" + complement.isIgnoreCase() + "\" " + occurenceStr
                        + " NotPresentBehavior=\"" + notPresentBehaviorStr
                        + "\"/>";
                break;
            case notContainValueDesc:
                result = "<NOT><PlainText Path=\"" + sPathStr + "\" Text=\"" + complement.getEscapeXml()
                        + "\" IgnoreCase=\"" + complement.isIgnoreCase() + "\" " + occurenceStr
                        + " NotPresentBehavior=\"" + notPresentBehaviorStr
                        + "\"/></NOT>";
                break;
            case containListValues:
                result = "<StringList Path=\"" + sPathStr + "\" CSV=\""
                        + String.join(",", complement.getValues()) + "\" IgnoreCase=\""
                        + complement.isIgnoreCase() + "\" " + occurenceStr
                        + " NotPresentBehavior=\"" + notPresentBehaviorStr
                        + "\"/>";
                break;
            case notContainListValues:
                result = "<NOT><StringList Path=\"" + sPathStr + "\" CSV=\""
                        + String.join(",", complement.getValues()) + "\" IgnoreCase=\""
                        + complement.isIgnoreCase() + "\" " + occurenceStr
                        + " NotPresentBehavior=\"" + notPresentBehaviorStr
                        + "\"/></NOT>";
                break;
            case containListValuesDesc:
                result = "<StringList Path=\"" + sPathStr + "\" CSV=\""
                        + String.join(",", complement.getValues()) + "\" IgnoreCase=\""
                        + complement.isIgnoreCase() + "\" " + occurenceStr
                        + " NotPresentBehavior=\"" + notPresentBehaviorStr
                        + "\"/>";
                break;
            case notContainListValuesDesc:
                result = "<NOT><StringList Path=\"" + sPathStr + "\" CSV=\""
                        + String.join(",", complement.getValues()) + "\" IgnoreCase=\""
                        + complement.isIgnoreCase() + "\" " + occurenceStr
                        + " NotPresentBehavior=\"" + notPresentBehaviorStr
                        + "\"/></NOT>";
                break;
            case containCode:
                result = "<PlainText Path=\"" + sPathStr + "\" Text=\"" + complement.getEscapeXml()
                        + "\" IgnoreCase=\"" + false + "\" " + occurenceStr
                        + " NotPresentBehavior=\"" + notPresentBehaviorStr
                        + "\"/>";
                break;
            case containCodeDesc:
                result = "<PlainText Path=\"" + sPathStr + "\" Text=\"" + complement.getValue()
                        + "\" IgnoreCase=\"" + false + "\" " + occurenceStr
                        + " NotPresentBehavior=\"" + notPresentBehaviorStr
                        + "\"/>";
                break;
            case containListCodes:
                result = "<StringList Path=\"" + sPathStr + "\" CSV=\""
                        + String.join(",", complement.getValues()) + "\" IgnoreCase=\"" + false
                        + "\" " + occurenceStr
                        + " NotPresentBehavior=\"" + notPresentBehaviorStr
                        + "\"/>";
                break;

            case containListCodesDesc:
                result = "<StringList Path=\"" + sPathStr + "\" CSV=\""
                        + String.join(",", complement.getValues()) + "\" IgnoreCase=\"" + false
                        + "\" " + occurenceStr
                        + " NotPresentBehavior=\"" + notPresentBehaviorStr
                        + "\"/>";
                break;
            case regex:
                result = "<Format Path=\"" + sPathStr + "\" Regex=\"" + complement.getValue()
                		+ "\" " + occurenceStr
                        + " NotPresentBehavior=\"" + notPresentBehaviorStr
                        + "\"/>";
                break;
            case positiveInteger:
                result = "<Format Path=\"" + sPathStr + "\" Regex=\"" + "^[1-9]\\d*$"
                		+ "\" " + occurenceStr
                        + " NotPresentBehavior=\"" + notPresentBehaviorStr
                        + "\"/>";
                break;
            case LOINC:
                result = "<StringFormat Path=\"" + sPathStr + "\" Format=\"" + "LOINC"
                		+ "\" " + occurenceStr
                        + " NotPresentBehavior=\"" + notPresentBehaviorStr
                        + "\"/>";
                break;
            case SNOMED:
                result = "<StringFormat Path=\"" + sPathStr + "\" Format=\"" + "SNOMED"
                		+ "\" " + occurenceStr
                        + " NotPresentBehavior=\"" + notPresentBehaviorStr
                        + "\"/>";
                break;
            case sequentially:
                result = "<SetID Path=\"" + sPathStr + "\"/>";
                break;
            case iso:
                result = "<Format Path=\"" + sPathStr + "\" Regex=\"" + "[0-2](\\.(0|[1-9][0-9]*))*"
                		+ "\" " + occurenceStr
                        + " NotPresentBehavior=\"" + notPresentBehaviorStr
                        + "\"/>";
                break;
            //be earlier than     
            case cEarlier:
                result = "<PathValue Path1=\"" + sPathStr + "\" Operator=\"" + "LT" + "\" Path2=\""
                        + cPathStr
                        + "\" NotPresentBehavior=\"" + notPresentBehaviorStr + "\" Truncated=\"false\" "
                        + strPath1Mode + " " + strPath2Mode
                        + "/>";
                break;
            //be earlier than or equivalent to 
            case cEarlierEquivalent:
                result = "<PathValue Path1=\"" + sPathStr + "\" Operator=\"" + "LE" + "\" Path2=\""
                        + cPathStr
                        + "\" NotPresentBehavior=\"" + notPresentBehaviorStr + "\" Truncated=\"false\" IdenticalEquality=\"false\" "
                        + strPath1Mode + " " + strPath2Mode
                        + "/>";
                break;
            //be equivalent to 
            case cEquivalent:
                result = "<PathValue Path1=\"" + sPathStr + "\" Operator=\"" + "EQ" + "\" Path2=\""
                        + cPathStr
                        + "\" NotPresentBehavior=\"" + notPresentBehaviorStr + "\" Truncated=\"false\" IdenticalEquality=\"false\" "
                        + strPath1Mode + " " + strPath2Mode
                        + "/>";
                break;
            //be equivalent to or later than 
            case cEquivalentLater:
                result = "<PathValue Path1=\"" + sPathStr + "\" Operator=\"" + "GE" + "\" Path2=\""
                        + cPathStr
                        + "\" NotPresentBehavior=\"" + notPresentBehaviorStr + "\" Truncated=\"false\" IdenticalEquality=\"false\" "
                        + strPath1Mode + " " + strPath2Mode
                        + "/>";
                break;
            //Be identical to 
            case cIdentical:
                result = "<PathValue Path1=\"" + sPathStr + "\" Operator=\"" + "EQ" + "\" Path2=\""
                        + cPathStr
                        + "\" NotPresentBehavior=\"" + notPresentBehaviorStr + "\" Truncated=\"false\" IdenticalEquality=\"true\" "
                        + strPath1Mode + " " + strPath2Mode
                        + "/>";
                break;
            //be later than 
            case cLater:
                result = "<PathValue Path1=\"" + sPathStr + "\" Operator=\"" + "GT" + "\" Path2=\""
                        + cPathStr
                        + "\" NotPresentBehavior=\"" + notPresentBehaviorStr + "\" Truncated=\"false\" "
                        + strPath1Mode + " " + strPath2Mode
                        + "/>";
                break;
            //be truncated earlier than 
            case cTruncatedEarlier:
                result = "<PathValue Path1=\"" + sPathStr + "\" Operator=\"" + "LT" + "\" Path2=\""
                        + cPathStr
                        + "\" NotPresentBehavior=\"" + notPresentBehaviorStr + "\" Truncated=\"true\" "
                        + strPath1Mode + " " + strPath2Mode
                        + "/>";
                break;
            //be truncated earlier than or truncated equivalent to 
            case cTruncatedEarlierEquivalent:
                result = "<PathValue Path1=\"" + sPathStr + "\" Operator=\"" + "LE" + "\" Path2=\""
                        + cPathStr
                        + "\" NotPresentBehavior=\"" + notPresentBehaviorStr + "\" Truncated=\"true\" IdenticalEquality=\"false\" "
                        + strPath1Mode + " " + strPath2Mode
                        + "/>";
                break;
            //be truncated equivalent to 
            case cTruncatedEquivalent:
                result = "<PathValue Path1=\"" + sPathStr + "\" Operator=\"" + "EQ" + "\" Path2=\""
                        + cPathStr
                        + "\" NotPresentBehavior=\"" + notPresentBehaviorStr + "\" Truncated=\"true\" IdenticalEquality=\"false\" "
                        + strPath1Mode + " " + strPath2Mode
                        + "/>";
                break;
            //be truncated equivalent to or truncated later than 
            case cTruncatedEquivalentLater:
                result = "<PathValue Path1=\"" + sPathStr + "\" Operator=\"" + "GE" + "\" Path2=\""
                        + cPathStr
                        + "\" NotPresentBehavior=\"" + notPresentBehaviorStr + "\" Truncated=\"true\" IdenticalEquality=\"false\" "
                        + strPath1Mode + " " + strPath2Mode
                        + "/>";
                break;
            //be truncated later than 
            case cTruncatedLater:
                result = "<PathValue Path1=\"" + sPathStr + "\" Operator=\"" + "GT" + "\" Path2=\""
                        + cPathStr
                        + "\" NotPresentBehavior=\"" + notPresentBehaviorStr + "\" Truncated=\"true\" "
                        + strPath1Mode + " " + strPath2Mode
                        + "/>";
                break;
            default:
                break;
        }

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

        } else if (assertion instanceof SubContextAssertion) {
        	SubContextAssertion sAssertion = (SubContextAssertion) assertion;
        	String occurenceStr = "";
        	String sPathStr = this.generatePathService.generatePath(sAssertion.getContext().getPath(), targetId, level, context);
        	
        	if (sAssertion.getContext().getOccurenceType() != null) {
                if (sAssertion.getContext().getOccurenceType().equals("atLeast")) {
                	occurenceStr = "AtLeastOnce=\"true\"";
                } else if (sAssertion.getContext().getOccurenceType().equals("noOccurrence")) {
                	occurenceStr = "Min=\"0\" Max\"0\"";
                } else if (sAssertion.getContext().getOccurenceType().equals("exactlyOne")) {
                	occurenceStr = "MinOccurrence=\"1\" MaxOccurrence=\"1\"";
                } else if (sAssertion.getContext().getOccurenceType().equals("count")) {
                	occurenceStr = "MinOccurrence=\"" + sAssertion.getContext().getOccurenceValue() + "\" MaxOccurrence=\"" + sAssertion.getContext().getOccurenceValue()+ "\"";
                } else if (sAssertion.getContext().getOccurenceType().equals("all")) {
                	occurenceStr = "AtLeastOnce=\"false\"";
                } else if (sAssertion.getContext().getOccurenceType().equals("instance")) {
                    sPathStr = this.generatePathService.replaceLast(sPathStr, "[*]", "" + sAssertion.getContext().getOccurenceValue());
                }
            }
        	
        	Subcon subcon = this.generatePathService.generateSubCon(sAssertion.getContext().getPath(), targetId, level, context);
        	
            return "<SubContext Path=\"" + sPathStr + "\" " + occurenceStr + ">"
            		+ this.generateAssertionScript(sAssertion.getChild(), subcon.getLevel(), subcon.getTargetId(), subcon.getContext(), presenceCheckOn)
            		+ "</SubContext>";
        } else if (assertion instanceof SingleAssertion) {
            return this.generateSingleAssertionScript((SingleAssertion) assertion, level, targetId,
                    context, presenceCheckOn);
        } 

        return null;
    }
}
