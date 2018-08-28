package gov.nist.hit.hl7.igamt.ig.util;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.List;

import org.springframework.core.io.ClassPathResource;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;


public class App {
  public static void main(String[] args)
      throws JsonParseException, JsonMappingException, FileNotFoundException, IOException {


    File ig = new ClassPathResource("IgTemplate.json").getFile();


    ObjectMapper objectMapper = new ObjectMapper();
    objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);


    List<SectionTemplate> igTemplate =
        objectMapper.readValue(ig, new TypeReference<List<SectionTemplate>>() {});

    for (SectionTemplate section : igTemplate) {
      printSection(section);

    }



  }

  static void printSection(SectionTemplate s) {
    System.out.println(s.getPosition() + "." + s.getLabel() + ":" + s.getType());

    if (s.getChildren() != null && !s.getChildren().isEmpty()) {
      for (SectionTemplate section : s.getChildren()) {
        printSection(section);

      }
    }


  }

}
