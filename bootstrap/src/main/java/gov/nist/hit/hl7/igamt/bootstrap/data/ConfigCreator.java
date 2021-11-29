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
package gov.nist.hit.hl7.igamt.bootstrap.data;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.config.domain.BindingInfo;
import gov.nist.hit.hl7.igamt.common.config.domain.BindingLocationInfo;
import gov.nist.hit.hl7.igamt.common.config.domain.BindingLocationOption;
import gov.nist.hit.hl7.igamt.common.config.domain.Config;
import gov.nist.hit.hl7.igamt.common.config.domain.ConnectingInfo;
import gov.nist.hit.hl7.igamt.common.config.service.ConfigService;

/**
 * @author Abdelghani El Ouakili
 *
 */
@Service
public class ConfigCreator {
  @Autowired
  ConfigService sharedConstantService;

  
  public void updateGVTURL() {
    Config constant =  this.sharedConstantService.findOne();
    String redirectToken = "#/uploadTokens";
    String loginEndpoint = "api/accounts/login";
    String createDomainInput = "api/domains/new";

    List<ConnectingInfo> connection = new ArrayList<ConnectingInfo>();
    connection.add(new ConnectingInfo("GVT", "https://hl7v2.gvt.nist.gov/gvt/", redirectToken, loginEndpoint,createDomainInput, 1));

    connection.add(new ConnectingInfo("GVT-DEV", "https://hit-dev.nist.gov:8092/gvt/", redirectToken, loginEndpoint,createDomainInput, 2));

    connection.add(new ConnectingInfo("IZ-TOOL-DEV", "https://hit-dev.nist.gov:8098/iztool/", redirectToken, loginEndpoint,createDomainInput, 3));

    connection.add(new ConnectingInfo("IZ-TOOL", "https://hl7v2-iz-r1.5-testing.nist.gov/iztool/", redirectToken, loginEndpoint,createDomainInput, 4)); 
    constant.setConnection(connection); 
    this.sharedConstantService.save(constant);
  }

  public void createSharedConstant() {
    Config constant = new Config();
    this.sharedConstantService.deleteAll();

    List<String> hl7Versions = new ArrayList<String>();
    hl7Versions.add("2.3.1");
    hl7Versions.add("2.4");
    hl7Versions.add("2.5");
    hl7Versions.add("2.5.1");
    hl7Versions.add("2.6");
    hl7Versions.add("2.7");
    hl7Versions.add("2.7.1");
    hl7Versions.add("2.8");
    hl7Versions.add("2.8.1");
    hl7Versions.add("2.8.2");

    List<String> usages = new ArrayList<String>();

    usages.add("R");
    usages.add("RE");
    usages.add("RC");
    usages.add("C");
    usages.add("X");
    constant.setHl7Versions(hl7Versions);
    constant.setUsages(usages);
    String redirectToken = "#/uploadTokens";
    String loginEndpoint = "api/accounts/login";
    String createDomainInput = "api/domains/new";


    List<ConnectingInfo> connection = new ArrayList<ConnectingInfo>();
    connection.add(new ConnectingInfo("GVT", "https://hl7v2.gvt.nist.gov/gvt/", redirectToken, loginEndpoint,createDomainInput, 1));

    connection.add(new ConnectingInfo("GVT-DEV", "https://hit-dev.nist.gov:8092/gvt/", redirectToken, loginEndpoint,createDomainInput, 2));

    connection.add(new ConnectingInfo("IZ-TOOL-DEV", "https://hit-dev.nist.gov:8098/iztool/", redirectToken, loginEndpoint,createDomainInput, 3));

    connection.add(new ConnectingInfo("IZ-TOOL", "https://hl7v2-iz-r1.5-testing.nist.gov/iztool/", redirectToken, loginEndpoint,createDomainInput, 4)); 
    constant.setConnection(connection);    
    constant.setPhinvadsUrl("https://phinvads.cdc.gov/vads/ViewValueSet.action?oid=");

    constant.setValueSetBindingConfig(generateValueSetConfig(constant.getHl7Versions()));

    HashMap<String, Object> froalaConfig = new HashMap<>();
    constant.setFroalaConfig(froalaConfig);
    sharedConstantService.save(constant);

  }
  public HashMap<String, BindingInfo> generateValueSetConfig(List<String> versions) {
    HashMap<String,BindingInfo> ret= new HashMap<String,BindingInfo>();


    ret.put("ID", BindingInfo.createSimple());
    ret.put("IS", BindingInfo.createSimple());

    BindingLocationOption location1 = new BindingLocationOption();
    location1.setValue(Arrays.asList(1));
    location1.setLabel("1");

    BindingLocationOption location2 = new BindingLocationOption();
    location2.setValue(Arrays.asList(2));
    location2.setLabel("2");


    BindingLocationOption location4 = new BindingLocationOption();
    location4.setValue(Arrays.asList(4));
    location4.setLabel("4");

    BindingLocationOption location5 = new BindingLocationOption();
    location5.setValue(Arrays.asList(5));
    location5.setLabel("5");

    BindingLocationOption location2_5 = new BindingLocationOption();
    location2_5.setValue(Arrays.asList(2,5));
    location2_5.setLabel("2 or 5");


    BindingLocationOption location10= new BindingLocationOption();
    location10.setValue(Arrays.asList(10));
    location10.setLabel("10");

    BindingLocationOption location1_4 = new BindingLocationOption();
    location1_4.setValue(Arrays.asList(1,4));
    location1_4.setLabel("1 or 4");

    BindingLocationOption location1_4_10 = new BindingLocationOption();
    location1_4_10.setValue(Arrays.asList(1,4,10));
    location1_4_10.setLabel("1 or 4 or 10");    

    HashMap<String, List<BindingLocationOption>> allowedBindingLocations_coded =new HashMap<String, List<BindingLocationOption>>();


    List<BindingLocationOption> oldOptions1= Arrays.asList(location1,location4, location1_4);
    List<BindingLocationOption> newOption1= Arrays.asList(location1,location4,location10, location1_4, location1_4_10);
    List<BindingLocationOption> optionsHD= Arrays.asList(location1);
    List<BindingLocationOption> optionsCSU= Arrays.asList(location2,location5,location2_5);
    allowedBindingLocations_coded.put("2-3-1", oldOptions1);
    allowedBindingLocations_coded.put("2-4", oldOptions1);

    allowedBindingLocations_coded.put("2-5", oldOptions1);

    allowedBindingLocations_coded.put("2-5-1", oldOptions1);
    allowedBindingLocations_coded.put("2-6", oldOptions1);

    allowedBindingLocations_coded.put("2-7", newOption1);

    allowedBindingLocations_coded.put("2-7-1", newOption1);
    allowedBindingLocations_coded.put("2-8", newOption1);

    allowedBindingLocations_coded.put("2-8-1", newOption1);
    allowedBindingLocations_coded.put("2-8-2", oldOptions1);
    BindingInfo coded =  BindingInfo.createCoded();
    coded.setAllowedBindingLocations(allowedBindingLocations_coded);

    ret.put("CE", coded);
    ret.put("CWE", coded);
    ret.put("CNE", coded);
    ret.put("CF", coded);
    BindingInfo CSUInfo =  BindingInfo.createCoded();

    HashMap<String, List<BindingLocationOption>> allowedBindingLocations_CSU =new HashMap<String, List<BindingLocationOption>>();
    for(String v: versions) {
      allowedBindingLocations_CSU.put(v.replace('.', '-'), optionsCSU);
    }
    CSUInfo.setAllowedBindingLocations(allowedBindingLocations_CSU);
    ret.put("CSU", CSUInfo);

    BindingInfo HDInfo =  BindingInfo.createCoded();
    HDInfo.setCoded(false);
    HashMap<String, List<BindingLocationOption>> allowedBindingLocations_hd =new HashMap<String, List<BindingLocationOption>>();

    for(String v: versions) {
      allowedBindingLocations_hd.put(v.replace('.', '-'), optionsHD);
    }
    HDInfo.setAllowedBindingLocations(allowedBindingLocations_hd);
    ret.put("HD",HDInfo);

    BindingInfo stInfo = BindingInfo.createSimple();
    stInfo.setLocationIndifferent(false);

    Set<BindingLocationInfo> stExceptions = new HashSet<BindingLocationInfo>();
    stExceptions.add(new BindingLocationInfo(Type.DATATYPE,"AD", 3, versions ));
    stExceptions.add(new BindingLocationInfo(Type.DATATYPE,"AD", 4, versions ));
    stExceptions.add(new BindingLocationInfo(Type.DATATYPE,"AD", 5, versions ));
    stExceptions.add(new BindingLocationInfo(Type.DATATYPE,"AUI", 1, versions ));
    stExceptions.add(new BindingLocationInfo(Type.DATATYPE,"CNN", 1, versions ));
    stExceptions.add(new BindingLocationInfo(Type.DATATYPE,"CX", 1, versions ));
    stExceptions.add(new BindingLocationInfo(Type.DATATYPE,"EI", 1, versions ));
    stExceptions.add(new BindingLocationInfo(Type.DATATYPE,"ERL", 1, versions ));
    stExceptions.add(new BindingLocationInfo(Type.DATATYPE,"LA2", 11, versions ));
    stExceptions.add(new BindingLocationInfo(Type.DATATYPE,"LA2", 12, versions ));
    stExceptions.add(new BindingLocationInfo(Type.DATATYPE,"LA2", 13, versions ));
    stExceptions.add(new BindingLocationInfo(Type.DATATYPE,"ELD", 1, versions ));
    stExceptions.add(new BindingLocationInfo(Type.DATATYPE,"OSD", 2, versions ));
    stExceptions.add(new BindingLocationInfo(Type.DATATYPE,"OSD", 3, versions ));
    stExceptions.add(new BindingLocationInfo(Type.DATATYPE,"PLN", 1, versions ));
    stExceptions.add(new BindingLocationInfo(Type.DATATYPE,"PPN", 1, versions ));
    stExceptions.add(new BindingLocationInfo(Type.DATATYPE,"XAD", 1, versions ));
    stExceptions.add(new BindingLocationInfo(Type.DATATYPE,"XAD", 4, versions ));
    stExceptions.add(new BindingLocationInfo(Type.DATATYPE,"XAD",5, versions ));
    stExceptions.add(new BindingLocationInfo(Type.DATATYPE,"XAD", 8, versions ));
    stExceptions.add(new BindingLocationInfo(Type.DATATYPE,"XCN", 1, versions ));
    stExceptions.add(new BindingLocationInfo(Type.DATATYPE,"XON", 3, versions ));
    stExceptions.add(new BindingLocationInfo(Type.DATATYPE,"XON", 10, versions ));
    stExceptions.add(new BindingLocationInfo(Type.SEGMENT,"PID", 23, versions ));
    stInfo.setLocationExceptions(stExceptions);
    ret.put("ST", stInfo);

    BindingInfo nmInfo = BindingInfo.createSimple();
    nmInfo.setLocationIndifferent(false);
    Set<BindingLocationInfo> nmExceptions = new HashSet<BindingLocationInfo>();
    nmExceptions.add(new BindingLocationInfo(Type.DATATYPE,"CK", 1, versions ));
    ret.put("NM", nmInfo);

    return ret;
  }
}
