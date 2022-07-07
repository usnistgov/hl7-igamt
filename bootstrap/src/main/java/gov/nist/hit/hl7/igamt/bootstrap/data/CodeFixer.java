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

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.ResourceUtils;

import com.opencsv.CSVReader;

import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.exception.ForbiddenOperationException;
import gov.nist.hit.hl7.igamt.datatype.repository.DatatypeRepository;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.valueset.service.ValuesetService;

/**
 * @author Abdelghani El Ouakili
 *
 */
@Service
public class CodeFixer {

  @Autowired
  private DatatypeRepository datatypeRepository;
  
  @Autowired
  private ValuesetService valueSetService;
  
  public void fixTableHL70125() throws ForbiddenOperationException {
   List<Valueset> vss = valueSetService.findByDomainInfoScopeAndBindingIdentifier(Scope.HL7STANDARD.toString(), "HL70125");
   
   for(Valueset vs: vss) {
     vs.getCodes().removeIf((x) -> !datatypeRepository.existsByNameAndDomainInfoScopeAndDomainInfoVersion(x.getValue(), Scope.HL7STANDARD, vs.getDomainInfo().getVersion()));
     vs.setNumberOfCodes(vs.getCodes().size());
     valueSetService.save(vs);

   }
  }
  
  public void fixFromCSV() throws FileNotFoundException, ForbiddenOperationException {
   
    File file = ResourceUtils.getFile("classpath:deprecatedCodes.csv");
    System.out.println(file.exists());
    CSVReader reader = null;
    Map<String, Set<String>> map = new HashMap<String, Set<String>>();
    try {
      reader = new CSVReader(new FileReader(file));
      String[] line1= reader.readNext();
      while ((line1 = reader.readNext()) != null) {
          String id = line1[1]+"V"+line1[0].replaceAll("\\.", "-");
          if(map.containsKey(id)) {
            Set<String> codes = map.get(id);
                if(codes != null) {
                  codes.add(line1[2]);
                }
          
          }else {
            Set<String> codes = new HashSet<String>();
            codes.add(line1[2]);
            map.put(id, codes);         
          }
        
      }
      fix(map);
    } catch (IOException e) {
      e.printStackTrace();
    }
  }

  /**
   * @param map
   */
  private void fix(Map<String, Set<String>> map) throws ForbiddenOperationException {
    // TODO Auto-generated method stub
   List<Valueset> valuesets= valueSetService.findByIdIn(map.keySet());
  
   valuesets.forEach(x -> {     
     x.getCodes().forEach((c) -> {
       if(map.get(x.getId()).contains(c.getValue())) {
         c.setDeprecated(true);
       }     
     });      
     try {
		valueSetService.save(x);
	} catch (ForbiddenOperationException e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	}
   });
  }
  
}
