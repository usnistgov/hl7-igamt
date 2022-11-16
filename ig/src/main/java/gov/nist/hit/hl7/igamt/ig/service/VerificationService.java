package gov.nist.hit.hl7.igamt.ig.service;

import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.display.model.XMLVerificationReport;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.domain.verification.CPVerificationResult;
import gov.nist.hit.hl7.igamt.ig.domain.verification.DTSegVerificationResult;
import gov.nist.hit.hl7.igamt.ig.domain.verification.VSVerificationResult;
import gov.nist.hit.hl7.igamt.ig.domain.verification.VerificationReport;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;

@Service("verificationService")
public interface VerificationService {

  XMLVerificationReport verifyXMLs(String profileXML, String constraintXML, String valuesetXML);

  VSVerificationResult verifyValueset(Valueset valueset);

  DTSegVerificationResult verifyDatatype(Datatype datatype);

  DTSegVerificationResult verifySegment(Segment segment);

  CPVerificationResult verifyConformanceProfile(ConformanceProfile conformanceProfile, boolean needDeep);
  
  VerificationReport verifyIg(String documentId, boolean needDeep);
  
  VerificationReport verifyIg(Ig ig, boolean needDeep);
}
