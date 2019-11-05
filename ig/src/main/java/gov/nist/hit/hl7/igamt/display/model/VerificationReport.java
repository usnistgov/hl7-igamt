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
package gov.nist.hit.hl7.igamt.display.model;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.io.IOUtils;

/**
 * @author jungyubw
 *
 */
public class VerificationReport {

  private boolean success;

  private XSDVerificationResult profileXSDValidationResult;
  private XSDVerificationResult valueSetXSDValidationResult;
  private XSDVerificationResult constraintsXSDValidationResult;

  List<CustomProfileError> profileErrors;

  public VerificationReport() {
    this.success = true;
  }

  public boolean isSuccess() {
    return success;
  }

  public void setSuccess(boolean success) {
    this.success = success;
  }

  public XSDVerificationResult getProfileXSDValidationResult() {
    return profileXSDValidationResult;
  }

  public void setProfileXSDValidationResult(XSDVerificationResult profileXSDValidationResult) {
    this.profileXSDValidationResult = profileXSDValidationResult;
    if (!this.profileXSDValidationResult.isSuccess())
      this.success = false;
  }

  public XSDVerificationResult getValueSetXSDValidationResult() {
    return valueSetXSDValidationResult;
  }

  public void setValueSetXSDValidationResult(XSDVerificationResult valueSetXSDValidationResult) {
    this.valueSetXSDValidationResult = valueSetXSDValidationResult;
    if (!this.valueSetXSDValidationResult.isSuccess())
      this.success = false;
  }

  public XSDVerificationResult getConstraintsXSDValidationResult() {
    return constraintsXSDValidationResult;
  }

  public void setConstraintsXSDValidationResult(
      XSDVerificationResult constraintsXSDValidationResult) {
    this.constraintsXSDValidationResult = constraintsXSDValidationResult;
    if (!this.constraintsXSDValidationResult.isSuccess())
      this.success = false;
  }

  public List<CustomProfileError> getProfileErrors() {
    return profileErrors;
  }

  public void setProfileErrors(List<CustomProfileError> profileErrors) {
    this.profileErrors = profileErrors;
  }


  public void addProfileError(CustomProfileError error) {
    if (profileErrors == null)
      profileErrors = new ArrayList<CustomProfileError>();
    profileErrors.add(error);
    this.success = false;
  }

  @Override
  public String toString() {
    return "ProfileValidationReport [success=" + success + ", profileXSDValidationResult="
        + profileXSDValidationResult + ", valueSetXSDValidationResult="
        + valueSetXSDValidationResult + ", constraintsXSDValidationResult="
        + constraintsXSDValidationResult + ", profileErrors=" + profileErrors + "]";
  }
  
  public String generateHTML(){
    String reportHTML = "";
    
    ClassLoader classLoader = getClass().getClassLoader();
    try {
      reportHTML = IOUtils.toString(classLoader.getResourceAsStream("report.html"));
    } catch (IOException e) {
        e.printStackTrace();
    }
    
    if(this.success){
      reportHTML = reportHTML.replace("$Overall-Result$", "No error found.");
    }else {
      reportHTML = reportHTML.replace("$Overall-Result$", "Invalid");
    }
    
    if(this.profileXSDValidationResult.isSuccess()){
      String profileResult = "<div id=\"mvrTestingToolBox\" style=\"display:block;\">" 
          + "<br/>"
          + "<table width=\"100%\" cellpadding=\"2\" cellspacing=\"1\" border=\"0\" class=\"forumline\">"
          + "<tr>" 
          + "<td class=\"row1\" valign=\"top\">Profile XSD Validation</td>"
          + "<td class=\"row2\">Valid Profile XML</td>"
          + "</tr>"
          + "</table>"
          + "</div>";
      
      reportHTML = reportHTML.replace("$Profile-Result$", profileResult);
    }else {
      String profileResult = "<div id=\"mvrTestingToolBox\" style=\"display:block;\">" 
          + "<br/>"
          + "<table width=\"100%\" cellpadding=\"2\" cellspacing=\"1\" border=\"0\" class=\"forumline\">"
          + "<tr>" 
          + "<td class=\"row1\" rowspan=\"2\" valign=\"top\">Profile XSD Validation</td>"
          + "<td class=\"row2\">Invalid Profile XML</td>"
          + "</tr>"
          + "<tr>"
          + "<td class=\"row3\">" + this.profileXSDValidationResult.getE().getMessage() + "</td>"
          + "</tr>"
          + "</table>"
          + "</div>";
      
      reportHTML = reportHTML.replace("$Profile-Result$", profileResult);
    }
    
    if(this.getConstraintsXSDValidationResult().isSuccess()){
      String constraintseResult = "<div id=\"mvrTestingToolBox\" style=\"display:block;\">" 
          + "<br/>"
          + "<table width=\"100%\" cellpadding=\"2\" cellspacing=\"1\" border=\"0\" class=\"forumline\">"
          + "<tr>" 
          + "<td class=\"row1\" valign=\"top\">Constraints XSD Validation</td>"
          + "<td class=\"row2\">Valid Constraint XML</td>"
          + "</tr>"
          + "</table>"
          + "</div>";
      
      reportHTML = reportHTML.replace("$Constraints-Result$", constraintseResult);
    }else {
      String constraintseResult = "<div id=\"mvrTestingToolBox\" style=\"display:block;\">" 
          + "<br/>"
          + "<table width=\"100%\" cellpadding=\"2\" cellspacing=\"1\" border=\"0\" class=\"forumline\">"
          + "<tr>" 
          + "<td class=\"row1\" rowspan=\"2\" valign=\"top\">Constraints XSD Validation</td>"
          + "<td class=\"row2\">Invalid Constraint XML</td>"
          + "</tr>"
          + "<tr>"
          + "<td class=\"row3\">" + this.getConstraintsXSDValidationResult().getE().getMessage() + "</td>"
          + "</tr>"
          + "</table>"
          + "</div>";
      
      reportHTML = reportHTML.replace("$Constraints-Result$", constraintseResult);
    }
    
    if(this.getValueSetXSDValidationResult().isSuccess()){
      String valueSetsResult = "<div id=\"mvrTestingToolBox\" style=\"display:block;\">" 
          + "<br/>"
          + "<table width=\"100%\" cellpadding=\"2\" cellspacing=\"1\" border=\"0\" class=\"forumline\">"
          + "<tr>" 
          + "<td class=\"row1\" valign=\"top\">ValueSets XSD Validation</td>"
          + "<td class=\"row2\">Valid ValueSets XML</td>"
          + "</tr>"
          + "</table>"
          + "</div>";
      
      reportHTML = reportHTML.replace("$ValueSets-Result$", valueSetsResult);
    }else {
      String valueSetsResult = "<div id=\"mvrTestingToolBox\" style=\"display:block;\">" 
          + "<br/>"
          + "<table width=\"100%\" cellpadding=\"2\" cellspacing=\"1\" border=\"0\" class=\"forumline\">"
          + "<tr>" 
          + "<td class=\"row1\" rowspan=\"2\" valign=\"top\">ValueSets XSD Validation</td>"
          + "<td class=\"row2\">Invalid ValueSets XML</td>"
          + "</tr>"
          + "<tr>"
          + "<td class=\"row3\">" + this.getValueSetXSDValidationResult().getE().getMessage() + "</td>"
          + "</tr>"
          + "</table>"
          + "</div>";
      
      reportHTML = reportHTML.replace("$ValueSets-Result$", valueSetsResult);
    }
    
    if(this.getProfileErrors() == null || this.getProfileErrors().size() == 0){
      reportHTML = reportHTML.replace("$Custom-Result$", "");
    }else{
      String customResult = "<div id=\"mvrTestingToolBox\" style=\"display:block;\">"
            + "<br />"
            + "<table width=\"100%\" cellpadding=\"2\" cellspacing=\"1\" border=\"0\" class=\"forumline\">"
            + "<tr>"
            + "<td class=\"row1\" rowspan=\"" + (this.getProfileErrors().size() + 1) +"\" valign=\"top\">Custom Verifications</td>"
            + "<td class=\"row2\">Target</td>"
            + "<td class=\"row2\">Error Type</td>"
            + "<td class=\"row2\">Location</td>"
            + "<td class=\"row2\">Error Message</td>"
            + "</tr>";
      
      for(CustomProfileError e :this.getProfileErrors()){
        String part = "<tr>"
            + "<td class=\"row6\">" + e.getTarget() + "</td>"
            + "<td class=\"row6\">" + e.getErrorType() + "</td>"
            + "<td class=\"row4\">" + e.getLocation() + "</td>"
            + "<td class=\"row5\">" + e.getErrorMessage() + "</td>"
            + "</tr>";
        customResult = customResult + part;
      }
      
      
      customResult = customResult + "</table></div>";
      reportHTML = reportHTML.replace("$Custom-Result$", customResult);
    }
    
    return reportHTML;
  }

  public enum DocumentTarget {

    PROFILE, MESSAGE, SEGMENT, DATATYPE, VALUESET, CONSTRAINT
  }
  public enum ErrorType {

    FiveLevelComponent, MissingValueSet, DuplicatedDynamicMapping, Unknown, CoreParsingError
  }

}


