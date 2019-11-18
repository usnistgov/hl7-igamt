package gov.nist.hit.hl7.igamt.valueset.controller;

import java.io.IOException;

import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

import gov.nist.hit.hl7.igamt.common.base.controller.BaseController;
import gov.nist.hit.hl7.igamt.common.base.domain.Resource;
import gov.nist.hit.hl7.igamt.common.base.exception.ValuesetNotFoundException;
import gov.nist.hit.hl7.igamt.common.base.model.ResponseMessage;
import gov.nist.hit.hl7.igamt.common.base.model.ResponseMessage.Status;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.ChangeItemDomain;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.DocumentType;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.EntityChangeDomain;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.EntityType;
import gov.nist.hit.hl7.igamt.common.config.service.EntityChangeService;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.valueset.exception.ValuesetException;
import gov.nist.hit.hl7.igamt.valueset.service.ValuesetService;
import gov.nist.hit.hl7.igamt.valueset.service.impl.TableCSVGenerator;

@RestController
public class ValuesetController extends BaseController {

	Logger log = LoggerFactory.getLogger(ValuesetController.class);

	@Autowired
	ValuesetService valuesetService;
	@Autowired
	EntityChangeService entityChangeService;

	private static final String STRUCTURE_SAVED = "STRUCTURE_SAVED";
	private static final String PREDEF_SAVED = "PREDEF_SAVED";
	private static final String POSTDEF_SAVED = "POSTDEF_SAVED";
	private static final String METADATA_SAVED = "METADATA_SAVED";

	public ValuesetController() {
	}

	@RequestMapping(value = "/api/valuesets/{scope}/{version:.+}", method = RequestMethod.GET, produces = {
			"application/json" })
	public @ResponseBody ResponseMessage<List<Valueset>> findDisplayFormatByScopeAndVersion(@PathVariable String version,
			@PathVariable String scope, Authentication authentication) {
		return new ResponseMessage<List<Valueset>>(Status.SUCCESS, "", "", null, false, null,
				valuesetService.findDisplayFormatByScopeAndVersion(scope, version));
	}

	@RequestMapping(value = "/api/valuesets/{scope}/info", method = RequestMethod.GET, produces = {
			"application/json" })
	public @ResponseBody ResponseMessage<List<Valueset>> findDisplayFormatByScope(
			@PathVariable String scope, Authentication authentication) {
		return new ResponseMessage<List<Valueset>>(Status.SUCCESS, "", "", null, false, null,
				valuesetService.findDisplayFormatByScope(scope));
	}

	@RequestMapping(value = "/api/valuesets/{id}/resources", method = RequestMethod.GET, produces = {
			"application/json" })

	public Set<Resource> getResources(@PathVariable("id") String id, Authentication authentication) {
		Valueset valueset = valuesetService.findById(id);
		Set<Resource> resources = new HashSet<Resource>();
		resources.add(valueset);
		return resources;
	}

	@RequestMapping(value = "/api/valuesets/{id}", method = RequestMethod.GET, produces = { "application/json" })

	public Valueset getValueSet(@PathVariable("id") String id, Authentication authentication) {
		Valueset valueset = valuesetService.findById(id);
		return valueset;
	}
	
	@RequestMapping(value = "/api/valuesets/exportCSV/{id}", method = RequestMethod.POST, produces = "text/xml", consumes = "application/x-www-form-urlencoded; charset=UTF-8")
	  public void exportCSV(@PathVariable("id") String tableId, HttpServletRequest request,
	      HttpServletResponse response) throws IOException, ValuesetNotFoundException {
	    log.info("Export table " + tableId);
	    Valueset valueset = findById(tableId);

	    InputStream content = IOUtils.toInputStream(new TableCSVGenerator().generate(valueset), "UTF-8");
	    response.setContentType("text/xml");
	    response.setHeader("Content-disposition", "attachment;filename=" + valueset.getBindingIdentifier()
	        + "-" + new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date()) + ".csv");
	    FileCopyUtils.copy(content, response.getOutputStream());
	  }

	
	private Valueset findById(String id) throws ValuesetNotFoundException {
		Valueset valueset = valuesetService.findById(id);
		if (valueset == null) {
			throw new ValuesetNotFoundException(id);
		}
		return valueset;
	}
	@RequestMapping(value = "/api/valuesets/{id}", method = RequestMethod.POST, produces = { "application/json" })
	@ResponseBody
	public ResponseMessage<?> applyStructureChanges(@PathVariable("id") String id,
			@RequestParam(name = "dId", required = true) String documentId, @RequestBody List<ChangeItemDomain> cItems,
			Authentication authentication) throws ValuesetException, IOException {
		Valueset s = this.valuesetService.findById(id);
		this.valuesetService.applyChanges(s, cItems, documentId);
		EntityChangeDomain entityChangeDomain = new EntityChangeDomain();
		entityChangeDomain.setDocumentId(documentId);
		entityChangeDomain.setDocumentType(DocumentType.IG);
		entityChangeDomain.setTargetId(id);
		entityChangeDomain.setTargetType(EntityType.VALUESET);
		entityChangeDomain.setChangeItems(cItems);
		entityChangeDomain.setTargetVersion(s.getVersion());
		entityChangeService.save(entityChangeDomain);
		return new ResponseMessage(Status.SUCCESS, STRUCTURE_SAVED, s.getId(), new Date());
	}

}
