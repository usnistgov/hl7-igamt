package gov.nist.hit.hl7.igamt.verification.service;

import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.verification.domain.VerificationReport;
import gov.nist.hit.hl7.igamt.verification.service.impl.VerificationResult;

@Service("verificationService")
public interface VerificationService {

  VerificationReport verifyXMLs(String profileXML, String constraintXML, String valuesetXML);

  VerificationResult verifyValueset(Valueset valueset, String documentId);

  VerificationResult verifyDatatype(Datatype datatype, String documentId);

  VerificationResult verifySegment(Segment segment, String documentId);

  VerificationResult verifyConformanceProfile(ConformanceProfile conformanceProfile, String documentId);

}
