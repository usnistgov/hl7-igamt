package gov.nist.hit.hl7.igamt.ig.service;

import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.display.model.VerificationReport;
import gov.nist.hit.hl7.igamt.ig.domain.verification.VerificationResult;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;

@Service("verificationService")
public interface VerificationService {

  VerificationReport verifyXMLs(String profileXML, String constraintXML, String valuesetXML);

  VerificationResult verifyValueset(Valueset valueset, String documentId, VerificationResult vr);

  VerificationResult verifyDatatype(Datatype datatype, String documentId, VerificationResult vr);

  VerificationResult verifySegment(Segment segment, String documentId, VerificationResult vr);

  VerificationResult verifyConformanceProfile(ConformanceProfile conformanceProfile, String documentId, VerificationResult vr);
  
  VerificationResult verifyIg(String documentId);

}
