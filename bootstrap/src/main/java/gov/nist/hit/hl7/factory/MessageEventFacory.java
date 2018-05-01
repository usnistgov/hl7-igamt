package gov.nist.hit.hl7.factory;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.service.IgService;
import gov.nist.hit.hl7.igamt.shared.domain.CompositeKey;
import gov.nist.hit.hl7.igamt.shared.domain.Link;
import gov.nist.hit.hl7.igamt.shared.domain.Registry;
import gov.nist.hit.hl7.igamt.shared.messageEvent.MessageEvent;
import gov.nist.hit.hl7.igamt.shared.messageEvent.MessageEventService;
import gov.nist.hit.hl7.igamt.valueset.domain.Code;
import gov.nist.hit.hl7.igamt.valueset.domain.CodeSystem;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.valueset.domain.property.Constant.SCOPE;
import gov.nist.hit.hl7.igamt.valueset.service.CodeSystemService;
import gov.nist.hit.hl7.igamt.valueset.service.ValuesetService;
import io.jsonwebtoken.lang.Collections;


@Service
public class MessageEventFacory {
	@Autowired
	ConformanceProfileService conformanceProfileService;
	
	@Autowired

	MessageEventService messageEventService ;
	@Autowired
	CodeSystemService codeSystemService;
	
	@Autowired
	ValuesetService valueSetService;
	
	@Autowired
	IgService igdocumentService;
	
	
	public void  createMessageEvent(){
		List<Ig> standardIgs= igdocumentService.finByScope(SCOPE.HL7STANDARD.toString());
		for( Ig ig:standardIgs) {
		Registry messages= ig.getConformanceProfileLibrary();
		List<ConformanceProfile> shortConformanceProfiles=new ArrayList<ConformanceProfile> ();
		for(Link l:messages.getChildren()) {
			ConformanceProfile  cp  = conformanceProfileService.findDisplayFormat(l.getId());
			if(cp !=null) {
				shortConformanceProfiles.add(cp);
				createMessageEvent(shortConformanceProfiles,cp.getDomainInfo().getVersion());

				}
			
			}
		}		
				
	}


	private void createMessageEvent(List<ConformanceProfile> shortConformanceProfiles, String version) {
		
		 
		 List<CodeSystem> HL70354s = codeSystemService.findByDomainInfoScopeAndDomainInfoVersionAndIdentifier(SCOPE.HL7STANDARD.toString(), version, "HL70354");
		 CodeSystem HL70354=null;
		 if(HL70354s !=null) {
			 if( !HL70354s.isEmpty()) {
				 HL70354=HL70354s.get(0);
				 for(ConformanceProfile cp:shortConformanceProfiles ) {
					 
					  Code c = findCodeByValue(HL70354,fixUnderscore(cp.getStructID()));
					  if(c !=null) {

				      String label = c.getDescription();
				      label = label == null ? "Varies" : label; // Handle ACK
				      String[] ss = label.split(",");
				      
				      Set<String> events = new HashSet<String>(Arrays.asList(ss));
				      
				      MessageEvent messageEvent= new MessageEvent(cp.getId(),cp.getStructID(),  events,cp.getDescription(),version); 
				      messageEventService.save(messageEvent);

				      }
			      }
			
			 }
			 
		 }
		// TODO Auto-generated method stub
		
	}


	private Code findCodeByValue(CodeSystem codeSystem, String structID) {
		if (codeSystem.getCodes() != null)
		      for (Code c : codeSystem.getCodes()) {
		        if (structID.equals(c.getValue())) {
		          return c;
		        }
		      }
		    return null;
	}

	  public String fixUnderscore(String structID) {
	    if (structID.endsWith("_")) {
	      int pos = structID.length();
	      return structID.substring(0, pos - 1);
	    } else {
	      return structID;
	    }
	  }
	
	
	
	
	
	
	
}
