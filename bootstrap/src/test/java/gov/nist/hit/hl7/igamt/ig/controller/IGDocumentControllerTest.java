package gov.nist.hit.hl7.igamt.ig.controller;


import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.RequestBuilder;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import gov.nist.hit.hl7.TestApplication;
import gov.nist.hit.hl7.igamt.common.base.domain.CompositeKey;
import gov.nist.hit.hl7.igamt.common.base.domain.DocumentMetadata;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.domain.TextSection;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.model.IgSummary;
import gov.nist.hit.hl7.igamt.ig.service.IgService;
import gov.nist.hit.hl7.igamt.xreference.DataMongoConfig;


// @RunWith(SpringRunner.class)
// @SpringBootTest
// @Import(TestMongoConfig.class)
// @RunWith(SpringJUnit4ClassRunner.class)
// @SpringBootTest(classes = {TestApplication.class, TestMongoConfig.class})
@RunWith(SpringRunner.class)
@Import(DataMongoConfig.class)
@SpringBootTest(classes = TestApplication.class)
public class IGDocumentControllerTest {

  private MockMvc mockMvc;

  @MockBean
  private IgService mockIgService;


  @Before
  public void setUp() {
    IGDocumentController controller = new IGDocumentController();
    controller.setIgService(mockIgService);
    mockMvc = MockMvcBuilders.standaloneSetup(controller).build();

  }


  private List<Ig> igs() {
    List<Ig> igs = new ArrayList<Ig>();
    Ig ig = new Ig();
    igs.add(ig);
    DocumentMetadata metaData = new DocumentMetadata();
    ig.setMetadata(metaData);
    TextSection p = new TextSection();
    ig.setName("Ig1 name");
    ig.setDescription("Ig1 desc");
    ig.setCreationDate(new Date());
    CompositeKey id = new CompositeKey();
    id.setId("1");
    id.setVersion(1);
    ig.setId(id);

    ig = new Ig();
    igs.add(ig);
    metaData = new DocumentMetadata();
    ig.setMetadata(metaData);
    p = new TextSection();
    ig.setName("Ig2 name");
    ig.setDescription("Ig2 desc");
    ig.setCreationDate(new Date());
    id = new CompositeKey();
    id.setId("2");
    id.setVersion(1);
    ig.setId(id);

    return igs;

  }


  private List<IgSummary> summaries(java.util.List<Ig> igdocuments) {
    List<IgSummary> igs = new ArrayList<IgSummary>();
    for (Ig ig : igdocuments) {
      IgSummary element = new IgSummary();
      element.setCoverpage(ig.getMetadata().getCoverPicture());
      element.setDateUpdated(ig.getUpdateDate());
      element.setTitle(ig.getMetadata().getTitle());
      element.setSubtitle(ig.getMetadata().getSubTitle());
      element.setCoverpage(ig.getMetadata().getCoverPicture());
      element.setId(ig.getId());
      element.setUsername(ig.getUsername());
      List<String> conformanceProfileNames = new ArrayList<String>();
      element.setConformanceProfiles(conformanceProfileNames);
      igs.add(element);
    }
    return igs;
  }


  @Test
  @WithMockUser(username = "test", password = "test", roles = "USER")
  public void testGetIgDocuments() throws Exception {

    List<Ig> igs = igs();

    Mockito.when(mockIgService.findByUsername(Mockito.anyString(), Scope.USER))
        .thenReturn(igs);
    Mockito.when(mockIgService.convertListToDisplayList(Mockito.anyList()))
        .thenReturn(summaries(igs));
    RequestBuilder requestBuilder =
        MockMvcRequestBuilders.get("/api/igdocuments").accept(MediaType.APPLICATION_JSON);
    ResultActions result = mockMvc.perform(requestBuilder);
    result.andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
        .andExpect(jsonPath("$", hasSize(2)));
    // .andExpect(jsonPath("$[0].version", is(key.getVersion())))
    // .andExpect(jsonPath("$[0].description", is(mockSegment.getDescription())))
    // .andExpect(jsonPath("$[0].name", is(mockSegment.getName())))
    // .andExpect(jsonPath("$[0].ext", is(mockSegment.getExt())))
    // .andExpect(jsonPath("$[1].authorNote", is(mockSegment.getComment())))

  }

}
