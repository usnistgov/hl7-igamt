package gov.nist.hit.hl7.igamt.bootstrap.factory;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.common.base.domain.Link;
import gov.nist.hit.hl7.igamt.common.base.domain.Registry;
import gov.nist.hit.hl7.igamt.common.config.service.ConfigService;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.event.Event;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.event.MessageEvent;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.event.MessageEventService;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.service.IgService;
import gov.nist.hit.hl7.igamt.valueset.domain.Code;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.valueset.domain.property.Constant.SCOPE;
import gov.nist.hit.hl7.igamt.valueset.service.ValuesetService;


@Service
public class MessageEventFacory {
//  @Autowired
//  ConformanceProfileService conformanceProfileService;
//
//  @Autowired
//  MessageEventService messageEventService;
//
//
//  @Autowired
//  ValuesetService valueSetService;
//
//  @Autowired
//  IgService igdocumentService;
//
//  
//  @Autowired
//  ConfigService configService;
//
//  public void createMessageEvent() {
//    messageEventService.deleteAll();
//    List<String> hl7Versions = configService.findOne().getHl7Versions();
//
//    for(String s: hl7Versions) {
//      createProfileInfo(s);
//    }
//  }
//  
//  
//  
//  
//  public void createProfileInfo(String version) {
//    List<ConformanceProfile> cps = conformanceProfileService.findByDomainInfoScopeAndDomainInfoVersion(SCOPE.HL7STANDARD.toString(), version);
//    Valueset vsStructure = valueSetService.findByDomainInfoScopeAndDomainInfoVersionAndBindingIdentifier(
//        SCOPE.HL7STANDARD.toString(), version, "0354").get(0);
//    
//    Valueset profileDescriptions = valueSetService.findByDomainInfoScopeAndDomainInfoVersionAndBindingIdentifier(
//        SCOPE.HL7STANDARD.toString(), version, "0003").get(0);
//    HashMap<String, String> descriptions = mapTable(profileDescriptions);
//    
//    for(ConformanceProfile p : cps) {
//      createMessageEvents(p, vsStructure, descriptions, version);
//    }
//  }
//
//
//  /**
//   * @param p
//   * @param vsStructure
//   * @param profileDescriptions
//   */
//  private void createMessageEvents(ConformanceProfile cp, Valueset vsStructure,
//      HashMap<String, String> descriptions, String version) {
//    // TODO Auto-generated method stub
//    
//    Code c = findCodeByValue(vsStructure, fixUnderscore(cp.getStructID()));
//    if (c != null) {
//      String label = c.getDescription();
//      label = label == null ? "Varies" : label; // Handle ACK
//      label =label.replaceAll("\\s+","");
//      String[] ss = label.trim().split(",");
//      List<String> events = Arrays.asList(ss);
//      
//      
//      MessageEvent messageEvent = createParentEvent(cp.getId(), cp.getStructID(), events,
//          cp.getDescription(), version, descriptions);
//          messageEventService.save(messageEvent);
//    }
//  }
//
//  
//  public MessageEvent createParentEvent(String profileId, String structId, List<String> events, String description,
//      String hl7Version, HashMap<String, String> descriptions) {
//    MessageEvent  parent= new MessageEvent();
//    parent.setId(profileId);
//    parent.setName(structId);
//    parent.setHl7Version(hl7Version);
//    parent.setDescription(description);
//    parent.setChildren(createEvents(profileId, events, structId,hl7Version,descriptions));
//    return parent;
//
//  }
//
//  public  List<Event> createEvents(String id, List<String> events, String parentStructId,String hl7Version, HashMap<String, String> descriptions ) { 
//    List<Event> ret = new ArrayList<Event>();
//    for (int i=0;i< events.size() ; i++) {
//            Event newEvent= new Event(id, events.get(i), parentStructId,hl7Version);
//            if(descriptions.containsKey(events.get(i).toLowerCase().trim()))
//            newEvent.setDescription(descriptions.get(events.get(i).toLowerCase().trim()));
//            ret.add(newEvent);
//    }
//    return ret;
//  }
//
//
//
//
//  /**
//   * @param profileDescriptions
//   * @return
//   */
//  private HashMap<String, String> mapTable(Valueset profileDescriptions) {
//    HashMap<String, String> descriptionMap = new HashMap<String, String>();
//    if(profileDescriptions != null) {
//        for(Code c: profileDescriptions.getCodes()){
//            if(c.getValue() !=null){
//                descriptionMap.put(c.getValue().toLowerCase().trim(), c.getDescription());
//            }
//        }
//    }
//    return descriptionMap;
//  }
//
//
//
//
//  private void createMessageEvent(List<ConformanceProfile> shortConformanceProfiles,
//      String version) {
//
//
//    List<Valueset> HL70354s =
//        valueSetService.findByDomainInfoScopeAndDomainInfoVersionAndBindingIdentifier(
//            SCOPE.HL7STANDARD.toString(), version, "0354");
//    Valueset HL70354 = null;
//    if (HL70354s != null) {
//      if (!HL70354s.isEmpty()) {
//        HL70354 = HL70354s.get(0);
//        for (ConformanceProfile cp : shortConformanceProfiles) {
//
//          Code c = findCodeByValue(HL70354, fixUnderscore(cp.getStructID()));
//          if (c != null) {
//
//            String label = c.getDescription();
//            label = label == null ? "Varies" : label; // Handle ACK
//            label =label.replaceAll("\\s+","");
//
//            String[] ss = label.trim().split(",");
//  
//            List<String> events = Arrays.asList(ss);
//
//            MessageEvent messageEvent = new MessageEvent(cp.getId(), cp.getStructID(), events,
//                cp.getDescription(), version);
//            messageEventService.save(messageEvent);
//
//          }
//        }
//
//      }
//
//    }
//    // TODO Auto-generated method stub
//
//  }
//
//
//  private Code findCodeByValue(Valueset vs, String structID) {
//    if (vs.getCodes() != null)
//      for (Code c : vs.getCodes()) {
//        if (structID.equals(c.getValue())) {
//          return c;
//        }
//      }
//    return null;
//  }
//
//  public String fixUnderscore(String structID) {
//    if (structID.endsWith("_")) {
//      int pos = structID.length();
//      return structID.substring(0, pos - 1);
//    } else {
//      return structID;
//    }
//  }
//
//

}
