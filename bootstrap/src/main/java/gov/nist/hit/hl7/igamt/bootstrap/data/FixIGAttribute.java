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

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.repository.IgRepository;
import gov.nist.hit.hl7.igamt.ig.service.IgService;

/**
 * @author Abdelghani El Ouakili
 *
 */
@Service
public class FixIGAttribute {

  @Autowired
  IgService igService;


  @Autowired
  IgRepository igRepository;

  //public void createJson() throws JSONException {

  //    List<Ig> igs = igService.findAll();
  //    
  //    
  //    JSONObject dates= new JSONObject();
  //    
  //    for(Ig ig: igs) {
  //      dates.put(ig.getId(), ig.getUpdateDate().getTime());
  //    }
  //   

  //WriteJsonFile
  //    try(FileWriter file = new FileWriter("dates.json")){
  //        file.write(dates.toString());
  //        file.flush();
  //         
  //    }catch(IOException e){
  //        e.printStackTrace();
  //    }
  // }

  /**
   * @throws IOException 
   * @throws JsonMappingException 
   * @throws JsonParseException 
   * 
   */
  public void updateDates() throws JsonParseException, JsonMappingException, IOException {
    ObjectMapper objectMapper = new ObjectMapper();
    objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    Map<String, Long> map =
        objectMapper.readValue(FixIGAttribute.class.getResourceAsStream("/dates.json"),
            new TypeReference<Map<String, Long>>() {});


    String date = "2021-11-21";

    List<Ig> igs = this.igService.findAll();
    for(Ig ig: igs) {

      String format = new SimpleDateFormat("yyyy-MM-dd").format(ig.getUpdateDate());
      System.out.println(format);
      if(map.containsKey(ig.getId())) {
        Date s = new Date(map.get(ig.getId()));
        System.out.println(s);

        if(format.equalsIgnoreCase(date)) {
          ig.setUpdateDate(s);
          igRepository.save(ig);
        }
      }
    }

  }

}
