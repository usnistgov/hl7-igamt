package gov.nist.hit.hl7.igamt.export.controller;

import java.io.IOException;
import java.io.InputStream;
import java.sql.Types;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Set;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.domain.Usage;
import gov.nist.hit.hl7.igamt.common.base.util.RelationShip;
import gov.nist.hit.hl7.igamt.common.exception.IGNotFoundException;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportConfigurationGlobal;
import gov.nist.hit.hl7.igamt.export.configuration.newModel.ExportFilterDecision;
import gov.nist.hit.hl7.igamt.export.domain.ExportedFile;
import gov.nist.hit.hl7.igamt.export.exception.ExportException;
import gov.nist.hit.hl7.igamt.export.service.IgNewExportService;
import gov.nist.hit.hl7.igamt.export.util.WordUtil;
import gov.nist.hit.hl7.igamt.ig.controller.FormData;
import gov.nist.hit.hl7.igamt.ig.controller.wrappers.ReqId;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.IgDataModel;
import gov.nist.hit.hl7.igamt.ig.service.IgService;

@RestController
public class ExportController {

	@Autowired
	IgNewExportService igExportService;

	@Autowired
	IgService igService;

	@RequestMapping(value = "/api/export/ig/{id}/{format}", method = RequestMethod.POST, produces = { "application/json" }, consumes = "application/x-www-form-urlencoded; charset=UTF-8")
	public @ResponseBody void exportIgDocument(@PathVariable("id") String id,@PathVariable("format") String format,
			HttpServletResponse response, FormData formData) throws ExportException {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication != null) {
			try {
				String username = authentication.getPrincipal().toString();
				if(format.toLowerCase().equals("html")) {
					
					ObjectMapper mapper = new ObjectMapper();
					mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
					ExportFilterDecision decision = mapper.readValue(formData.getJson(), ExportFilterDecision.class);
				ExportedFile exportedFile = igExportService.exportIgDocumentToHtml(username, id, decision);
				response.setContentType("text/html");
				response.setHeader("Content-disposition",
						"attachment;filename=" + exportedFile.getFileName());

				FileCopyUtils.copy(exportedFile.getContent(), response.getOutputStream());
				}
				
				if(format.toLowerCase().equals("word")) {					
					ObjectMapper mapper = new ObjectMapper();
					mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
					ExportFilterDecision decision = mapper.readValue(formData.getJson(), ExportFilterDecision.class);
				ExportedFile exportedFile = igExportService.exportIgDocumentToWord(username, id, decision);
//			    Ig igDocument = igService.findById(id);
//			    ExportedFile wordFile = WordUtil.convertHtmlToWord(exportedFile, igDocument.getMetadata(), igDocument.getUpdateDate(), igDocument.getDomainInfo() != null ? igDocument.getDomainInfo().getVersion() : null);

				response.setContentType("application/vnd.openxmlformats-officedocument.wordprocessingml.document");
				response.setHeader("Content-disposition",
						"attachment;filename=" + exportedFile.getFileName());

				System.out.println("ICI : " + exportedFile.getFileName());
				FileCopyUtils.copy(exportedFile.getContent(), response.getOutputStream());
				}
				
				
			} catch (Exception e) {
				throw new ExportException(e, "Error while sending back exported IG Document with id " + id);
			}
		} else {
			throw new AuthenticationCredentialsNotFoundException("No Authentication");
		}
	}
	

	@RequestMapping(value = "/api/export/igdocuments/{id}/getFilteredDocument", method = RequestMethod.GET)
	public @ResponseBody ExportConfigurationGlobal getFilteredDocument(@PathVariable("id") String id,
			HttpServletResponse response) throws ExportException, IGNotFoundException {

		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication != null) {
			ExportConfiguration config = ExportConfiguration.getBasicExportConfiguration(false);
			Ig ig = igService.findById(id);
			if (ig == null) {
				throw  new IGNotFoundException(id);
			} else {	
				ExportConfigurationGlobal exportConfigurationGlobal = new ExportConfigurationGlobal();
				ExportFilterDecision exportFilterDecision = igExportService.getExportFilterDecision(ig, config);
				exportConfigurationGlobal.setExportConfiguration(config);
				exportConfigurationGlobal.setExportFilterDecision(exportFilterDecision);
				return exportConfigurationGlobal;
			}
		} else {
			throw new AuthenticationCredentialsNotFoundException("No Authentication ");
		}
	}

}
