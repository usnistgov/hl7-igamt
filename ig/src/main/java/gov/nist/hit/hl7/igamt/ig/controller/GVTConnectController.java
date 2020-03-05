package gov.nist.hit.hl7.igamt.ig.controller;

import java.io.InputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import gov.nist.hit.hl7.igamt.common.base.controller.BaseController;
import gov.nist.hit.hl7.igamt.ig.controller.wrappers.ReqId;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.IgDataModel;
import gov.nist.hit.hl7.igamt.ig.exceptions.IGNotFoundException;
import gov.nist.hit.hl7.igamt.ig.model.GVTDomain;
import gov.nist.hit.hl7.igamt.ig.service.GVTService;
import gov.nist.hit.hl7.igamt.ig.service.IgService;
import gov.nist.hit.hl7.igamt.service.impl.exception.GVTExportException;
import gov.nist.hit.hl7.igamt.service.impl.exception.GVTLoginException;

@RestController
public class GVTConnectController extends BaseController {

  Logger log = LoggerFactory.getLogger(GVTConnectController.class);


  @Autowired
  private GVTService gvtService;
  
  @Autowired
  IgService igService;

  @RequestMapping(value = "/api/testing/login", method = RequestMethod.GET, produces = {"application/json"})
  public boolean validCredentials(@RequestHeader("target-auth") String authorization, @RequestHeader("target-url") String host) throws GVTLoginException {
    log.info("Logging to " + host);
    try {
      // SSLHL7v2ResourceClient client = new SSLHL7v2ResourceClient(host, authorization);
      return gvtService.validCredentials(authorization, host);
    } catch (Exception e) {
      throw new GVTLoginException(e.getMessage());
    }
  }
  
  


  @RequestMapping(value = "/api/testing/domains", method = RequestMethod.GET, produces = {"application/json"})
  public List<GVTDomain> getDomains(@RequestHeader("target-url") String url, @RequestHeader("target-auth") String authorization) throws GVTLoginException {
    return gvtService.getDomains(authorization, url);
  }

  @RequestMapping(value = "/api/testing/createDomain", method = RequestMethod.POST, produces = "application/json")
  public ResponseEntity<?> createDomain(@RequestHeader("target-auth") String authorization, @RequestHeader("target-url") String url, @RequestBody HashMap<String, String> params, HttpServletRequest request, HttpServletResponse response) throws GVTExportException {
    try {
      log.info("Creating domain with name " + params.get("name") + ", key=" + params.get("key") + ",url=" + url);
      return gvtService.createDomain(authorization, url, params.get("key"), params.get("name"), params.get("homeTitle"));
    } catch (Exception e) {
      throw new GVTExportException(e);
    }
  }

  @RequestMapping(value = "/api/testing/{id}/push/{domain}", method = RequestMethod.POST, produces = "application/json")
  public Map<String, Object> exportToGVT(
      @PathVariable("id") String id,
      @RequestBody ReqId reqIds, 
      @PathVariable("domain") String domain,
      @RequestHeader("target-auth") String authorization,
      @RequestHeader("target-url") String url, 
      HttpServletRequest request, HttpServletResponse response) throws GVTExportException {
    try {
      log.info("Exporting messages to GVT from IG Document with id=" + id);

      Ig ig = findIgById(id);
      IgDataModel igModel = this.igService.generateDataModel(ig);

  
      InputStream content = this.igService.exportValidationXMLByZip(igModel, reqIds.getConformanceProfilesId(), reqIds.getCompositeProfilesId());
      ResponseEntity<?> rsp = gvtService.send(content, authorization, url, domain);
      Map<String, Object> res = (Map<String, Object>) rsp.getBody();
      return res;
    } catch (Exception e) {
      throw new GVTExportException(e);
    }
  }
  
  private Ig findIgById(String id) throws IGNotFoundException {
    Ig ig = igService.findById(id);
    if (ig == null) {
      throw new IGNotFoundException(id);
    }
    return ig;
  }
}
