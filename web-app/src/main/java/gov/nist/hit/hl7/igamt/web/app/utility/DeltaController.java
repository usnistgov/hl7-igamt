package gov.nist.hit.hl7.igamt.web.app.utility;

import gov.nist.hit.hl7.igamt.delta.domain.Delta;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.delta.domain.DiffableResult;
import gov.nist.hit.hl7.igamt.delta.domain.EntityDelta;
import gov.nist.hit.hl7.igamt.delta.exception.IGDeltaException;
import gov.nist.hit.hl7.igamt.delta.service.DeltaService;
import gov.nist.hit.hl7.igamt.display.model.IGDisplayInfo;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.exceptions.IGNotFoundException;
import gov.nist.hit.hl7.igamt.ig.service.IgService;

@RestController
public class DeltaController {

  @Autowired
  private DeltaService deltaService;
  @Autowired
  private IgService igService;
  

  @RequestMapping(value = "/api/delta/{type}/{ig}/{id}", method = RequestMethod.GET,
      produces = {"application/json"})
  @PreAuthorize("AccessResource(type.toString(), #id, READ)")
  public Delta deltaConformanceProfile(@PathVariable("type") Type type,
                                       @PathVariable("ig") String ig, @PathVariable("id") String id, Authentication authentication)
      throws Exception {

    return deltaService.delta(type, ig, id);
  }

  
  @RequestMapping(value = "/api/delta/display/{id}", method = RequestMethod.GET, produces = {
  "application/json" })
  @PreAuthorize("AccessResource('IGDOCUMENT', #id, READ)")
  public @ResponseBody IGDisplayInfo getDeltaDisplay(@PathVariable("id") String id, Authentication authentication)
      throws IGNotFoundException, IGDeltaException {

    Ig ig = igService.findById(id);
    Ig origin = igService.findById(ig.getOrigin());

   return this.deltaService.delta(ig, origin);
    
  }


  @RequestMapping(value = "/api/delta/{type}/{igId}/diffable/{idSource}/{idTarget}",
      method = RequestMethod.GET, produces = {"application/json"})
  @PreAuthorize("AccessResource('IGDOCUMENT', #ig, READ)")
  public DiffableResult diffable(@PathVariable("type") Type type, @PathVariable("igId") String ig,
      @PathVariable("idSource") String source, @PathVariable("idTarget") String target,
      Authentication authentication) throws Exception {
    return this.deltaService.diffable(type, ig, source, target);
  }

}
