package gov.nist.hit.hl7.igamt.export.controller;

import java.io.IOException;
import java.sql.Types;
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

import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.domain.Usage;
import gov.nist.hit.hl7.igamt.common.base.util.RelationShip;
import gov.nist.hit.hl7.igamt.common.exception.IGNotFoundException;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.newModel.ExportFilterDecision;
import gov.nist.hit.hl7.igamt.export.domain.ExportedFile;
import gov.nist.hit.hl7.igamt.export.exception.ExportException;
import gov.nist.hit.hl7.igamt.export.service.IgNewExportService;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.service.IgService;

@RestController
public class ExportController {

	@Autowired
	IgNewExportService igExportService;

	@Autowired
	IgService igService;

	@RequestMapping(value = "/api/export/igdocuments/{id}/export/html", method = RequestMethod.GET)
	public @ResponseBody void exportIgDocumentToHtml(@PathVariable("id") String id,
			HttpServletResponse response) throws ExportException {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication != null) {
			try {
				String username = authentication.getPrincipal().toString();
				ExportedFile exportedFile = igExportService.exportIgDocumentToHtml(username, id);
				response.setContentType("text/html");
				response.setHeader("Content-disposition",
						"attachment;filename=" + exportedFile.getFileName());

				FileCopyUtils.copy(exportedFile.getContent(), response.getOutputStream());
			} catch (Exception e) {
				throw new ExportException(e, "Error while sending back exported IG Document with id " + id);
			}
		} else {
			throw new AuthenticationCredentialsNotFoundException("No Authentication ");
		}
	}

	@RequestMapping(value = "/api/export/igdocuments/{id}/getFilteredDocument", method = RequestMethod.GET)
	public @ResponseBody ExportFilterDecision getFilteredDocument(@PathVariable("id") String id,
			HttpServletResponse response) throws ExportException, IGNotFoundException {

		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication != null) {
			ExportConfiguration config = ExportConfiguration.getBasicExportConfiguration(false);
			Ig ig = igService.findById(id);
			if (ig == null) {
				throw new IGNotFoundException(id);
			} else {	
				return igExportService.getExportFilterDecision(ig, config);
			}
		} else {
			throw new AuthenticationCredentialsNotFoundException("No Authentication ");
		}
	}

}
