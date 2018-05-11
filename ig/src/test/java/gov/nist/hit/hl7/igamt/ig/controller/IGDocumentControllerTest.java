package gov.nist.hit.hl7.igamt.ig.controller;


import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.RequestBuilder;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.model.IgSummary;
import gov.nist.hit.hl7.igamt.ig.service.IgService;
import gov.nist.hit.hl7.igamt.shared.domain.CompositeKey;
import gov.nist.hit.hl7.igamt.shared.domain.Registry;

@ContextConfiguration
@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest
public class IGDocumentControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @MockBean
  private IgService mockIgService;


  private List<Ig> getIgs() {
    List<Ig> igs = new ArrayList<Ig>();
    Ig ig = new Ig();
    igs.add(ig);
    ig.setName("Ig1 name");
    ig.setDescription("Ig1 desc");
    ig.setCreationDate(new Date());
    CompositeKey id = new CompositeKey();
    id.setId("1");
    id.setVersion(1);
    ig.setId(id);

    ig = new Ig();
    igs.add(ig);
    ig.setName("Ig2 name");
    ig.setDescription("Ig2 desc");
    ig.setCreationDate(new Date());
    id = new CompositeKey();
    id.setId("2");
    id.setVersion(1);
    ig.setId(id);

    return igs;

  }

  private List<IgSummary> getIgSummaries(java.util.List<Ig> igdocuments) {
    List<IgSummary> igs = new ArrayList<IgSummary>();
    for (Ig ig : igdocuments) {
      IgSummary element = new IgSummary();

      element.setCoverpage(ig.getMetaData().getCoverPicture());
      element.setDateUpdated(ig.getUpdateDate());
      element.setTitle(ig.getMetaData().getTitle());
      element.setSubtitle(ig.getMetaData().getSubTitle());
      // element.setConfrmanceProfiles(confrmanceProfiles);
      element.setCoverpage(ig.getMetaData().getCoverPicture());
      element.setId(ig.getId());
      element.setUsername(ig.getUsername());
      List<String> conformanceProfileNames = new ArrayList<String>();
      Registry conformanceProfileRegistry = ig.getConformanceProfileLibrary();
      element.setConformanceProfiles(conformanceProfileNames);
      igs.add(element);
    }
    return igs;
  }



  @Test
  public void retrieveDetailsForCourse() throws Exception {

    List<Ig> igs = getIgs();


    Mockito.when(mockIgService.findLatestByUsername(Mockito.anyString())).thenReturn(igs);
    Mockito.when(mockIgService.convertListToDisplayList(Mockito.anyList()))
        .thenReturn(getIgSummaries(igs));

    RequestBuilder requestBuilder =
        MockMvcRequestBuilders.get("/api/igdocuments").accept(MediaType.APPLICATION_JSON);
    ResultActions result = mockMvc.perform(requestBuilder);
    result.andExpect(status().isOk()).andExpect(content().contentType(MediaType.APPLICATION_JSON))
    // .andExpect(jsonPath("$", hasSize(1)))
    // .andExpect(jsonPath("$[0].version", is(key.getVersion())))
    // .andExpect(jsonPath("$[0].description", is(mockSegment.getDescription())))
    // .andExpect(jsonPath("$[0].name", is(mockSegment.getName())))
    // .andExpect(jsonPath("$[0].ext", is(mockSegment.getExt())))
    // .andExpect(jsonPath("$[1].authorNote", is(mockSegment.getComment())))
    ;

    verify(mockIgService, times(1)).findLatestByUsername("unit");
    verify(mockIgService, times(1)).convertListToDisplayList(igs);
    verifyNoMoreInteractions(mockIgService);
  }

}
