package gov.nist.hit.hl7.igamt.web.app.ig;

import java.io.InputStream;
import java.security.Principal;
import java.util.*;

import gov.nist.hit.hl7.igamt.ig.controller.wrappers.XmlExportRequest;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.IgDataModelConfiguration;
import gov.nist.hit.hl7.igamt.service.impl.IgXmlExportConfigurationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import gov.nist.hit.hl7.igamt.common.base.controller.BaseController;
import gov.nist.hit.hl7.igamt.common.base.service.impl.InMemoryDomainExtensionServiceImpl;
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

	@Autowired
	InMemoryDomainExtensionServiceImpl inMemoryDomainExtensionService;

	@Autowired
	IgXmlExportConfigurationService igXmlExportConfigurationService;

	@RequestMapping(value = "/api/testing/login", method = RequestMethod.GET, produces = {"application/json"})
	public boolean validCredentials(
			@RequestHeader("target-auth") String authorization,
			@RequestHeader("target-url") String host
	) throws GVTLoginException {
		log.info("Logging to " + host);
		try {
			return gvtService.validCredentials(authorization, host);
		} catch(Exception e) {
			throw new GVTLoginException(e.getMessage());
		}
	}

	@RequestMapping(value = "/api/testing/domains", method = RequestMethod.GET, produces = {"application/json"})
	public List<GVTDomain> getDomains(
			@RequestHeader("target-url") String url,
			@RequestHeader("target-auth") String authorization
	) throws GVTLoginException {
		return gvtService.getDomains(authorization, url);
	}

	@RequestMapping(value = "/api/testing/createDomain", method = RequestMethod.POST, produces = "application/json")
	public ResponseEntity<?> createDomain(
			@RequestHeader("target-auth") String authorization,
			@RequestHeader("target-url") String url,
			@RequestBody HashMap<String, String> params
	) throws GVTExportException {
		try {
			log.info("Creating domain with name " + params.get("name") + ", key=" + params.get("key") + ",url=" + url);
			return gvtService.createDomain(
					authorization,
					url,
					params.get("key"),
					params.get("name"),
					params.get("homeTitle")
			);
		} catch(Exception e) {
			throw new GVTExportException(e);
		}
	}

	@RequestMapping(value = "/api/testing/{id}/push/{domain}", method = RequestMethod.POST, produces = "application/json")
	@PreAuthorize("AccessResource('IGDOCUMENT', #id, READ)")
	public Map<String, Object> exportToGVT(
			@PathVariable("id") String id,
			@RequestBody XmlExportRequest xmlExportRequest,
			@PathVariable("domain") String domain,
			@RequestHeader("target-auth") String authorization,
			@RequestHeader("target-url") String url,
			@AuthenticationPrincipal Principal user
	) throws GVTExportException {
		Set<String> dataExtensionTokens = new HashSet<>();
		try {
			log.info("Exporting messages to GVT from IG Document with id=" + id);
			ReqId reqIds = xmlExportRequest.getSelected();
			Ig subSetIg = this.igService.getIgProfileResourceSubSetAsIg(
					findIgById(id),
					new HashSet<>(Arrays.asList(reqIds.getConformanceProfilesId())),
					new HashSet<>(Arrays.asList(reqIds.getCompositeProfilesId()))
			);
			if(xmlExportRequest.isRememberExternalValueSetExportMode()) {
				this.igXmlExportConfigurationService.saveExternalValueSetExportConfiguration(
						id,
						user.getName(),
						xmlExportRequest.getExportType(),
						xmlExportRequest.getExternalValueSetsExportMode()
				);
			}
			IgDataModelConfiguration igDataModelConfiguration = new IgDataModelConfiguration();
			igDataModelConfiguration.setExternalValueSetExportMode(xmlExportRequest.getExternalValueSetsExportMode());
			IgDataModel igModel = this.igService.generateDataModel(subSetIg, igDataModelConfiguration);
			dataExtensionTokens.addAll(igModel.getDataExtensionTokens());
			InputStream content = this.igService.exportValidationXMLByZip(
					igModel,
					reqIds.getConformanceProfilesId(),
					reqIds.getCompositeProfilesId()
			);
			ResponseEntity<?> rsp = gvtService.send(content, authorization, url, domain);
			return (Map<String, Object>) rsp.getBody();
		} catch(Exception e) {
			throw new GVTExportException(e);
		} finally {
			dataExtensionTokens.forEach(token -> inMemoryDomainExtensionService.clear(token));
		}
	}

	private Ig findIgById(String id) throws IGNotFoundException {
		Ig ig = igService.findById(id);
		if(ig == null) {
			throw new IGNotFoundException(id);
		}
		return ig;
	}
}
