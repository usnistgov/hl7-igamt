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
package gov.nist.hit.hl7.igamt.datatype.test.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.fail;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyString;

import java.util.Optional;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import gov.nist.hit.hl7.igamt.common.base.service.CommonService;
import gov.nist.hit.hl7.igamt.common.base.service.InMemoryDomainExtentionService;
import gov.nist.hit.hl7.igamt.common.binding.service.BindingService;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.repository.DatatypeRepository;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.datatype.service.impl.DatatypeServiceImpl;
import gov.nist.hit.hl7.igamt.valueset.service.ValuesetService;

/**
 * @author Abdelghani El Ouakili
 *
 */
@RunWith(SpringJUnit4ClassRunner.class)
public class DatatypeServiceTest {
  
  @InjectMocks
  DatatypeServiceImpl datatypeService;
  @Mock
  private DatatypeRepository datatypeRepository;
  @Mock
  private InMemoryDomainExtentionService domainExtention;
  @Mock
  CommonService commonService;
  @Mock
  private MongoTemplate mongoTemplate;
  @Mock
  ValuesetService valueSetService;
  @Mock
  BindingService bindingService;
  
  
  @Test
  public void findById_Test() {
    Mockito.when(domainExtention.findById(anyString(), any())).thenReturn(null);
    Mockito.when(datatypeRepository.findById(anyString())).thenReturn(Optional.of(new Datatype()) );

    Datatype d = datatypeService.findById("test");
    Mockito.verify(datatypeRepository).findById(anyString());

    assertNotNull(d);
    
  }

}
