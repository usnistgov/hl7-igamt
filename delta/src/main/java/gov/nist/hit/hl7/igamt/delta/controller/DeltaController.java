package gov.nist.hit.hl7.igamt.delta.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.delta.domain.DiffableResult;
import gov.nist.hit.hl7.igamt.delta.domain.EntityDelta;
import gov.nist.hit.hl7.igamt.delta.service.DeltaService;

@RestController
public class DeltaController {

  @Autowired
  private DeltaService deltaService;

  @RequestMapping(value = "/api/delta/{type}/{ig}/{id}", method = RequestMethod.GET,
      produces = {"application/json"})
  public <T> EntityDelta<T> deltaConformanceProfile(@PathVariable("type") Type type,
      @PathVariable("ig") String ig, @PathVariable("id") String id, Authentication authentication)
      throws Exception {

    return deltaService.computeDelta(type, ig, id);
  }

  @RequestMapping(value = "/api/delta/{type}/{igId}/diffable/{idSource}/{idTarget}",
      method = RequestMethod.GET, produces = {"application/json"})
  public DiffableResult diffable(@PathVariable("type") Type type, @PathVariable("igId") String ig,
      @PathVariable("idSource") String source, @PathVariable("idTarget") String target,
      Authentication authentication) throws Exception {
    return this.deltaService.diffable(type, ig, source, target);
  }

}
