package gov.nist.hit.hl7.igamt.web.app.ig;

import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.newModel.ExportFilterDecision;
import gov.nist.hit.hl7.igamt.export.configuration.service.ExportConfigurationService;
import gov.nist.hit.hl7.igamt.export.domain.ExportedFile;
import gov.nist.hit.hl7.igamt.export.service.IgNewExportService;
import gov.nist.hit.hl7.igamt.ig.domain.ExportShareConfiguration;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.IgDataModel;
import gov.nist.hit.hl7.igamt.ig.service.IgService;

import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.nio.charset.StandardCharsets;
import java.util.Objects;

@Controller
public class PublicIgController {

	@Autowired
	public IgService igService;
	@Autowired
	public IgNewExportService igExportService;
	@Autowired
	public ExportConfigurationService exportConfigurationService;

	@RequestMapping(value = "/public/ig/{igId}/{exportId}/content")
	public @ResponseBody void getIg(
			@PathVariable("igId") String id,
			@PathVariable("exportId") String exportId,
			HttpServletResponse response,
			HttpServletRequest request
	) throws Exception {

		try {
			Ig ig = igService.findById(id);
			if(ig != null && ig.getShareLinks() != null && !ig.getShareLinks().isEmpty() && ig.getShareLinks().containsKey(exportId)) {
				ExportShareConfiguration exportShareConfiguration = ig.getShareLinks().get(exportId);
				if(exportShareConfiguration != null) {
					ExportConfiguration exportConfiguration = exportConfigurationService.getExportConfiguration(exportShareConfiguration.getConfigurationId());
					ExportFilterDecision filterDecision = exportShareConfiguration.getExportDecision();
					IgDataModel igDataModel = igService.generateDataModel(ig);
					ExportedFile exportedFile = igExportService.exportIgDocumentToHtml(ig.getUsername(), igDataModel, filterDecision, exportConfiguration.getId());
					response.setContentType("text/html");
					FileCopyUtils.copy(exportedFile.getContent(), response.getOutputStream());
				}
			} else {
				response.setStatus(HttpServletResponse.SC_NOT_FOUND);
				response.setContentType("text/html");
				IOUtils.copy(Objects.requireNonNull(PublicIgController.class.getResourceAsStream("/public-ig-not-found.html")), response.getOutputStream());
			}
		} catch(Exception e) {
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			response.setContentType("text/html");
			IOUtils.copy(Objects.requireNonNull(PublicIgController.class.getResourceAsStream("/public-ig-error.html")), response.getOutputStream());
		}
	}

	@RequestMapping(value = "/public/ig/{igId}/{exportId}")
	public @ResponseBody void getLoadIgPage(
			@PathVariable("igId") String id,
			@PathVariable("exportId") String exportId,
			HttpServletResponse response,
			HttpServletRequest request
	) throws Exception {
		try {
			Ig ig = igService.findById(id);
			if(ig != null && ig.getShareLinks() != null && !ig.getShareLinks().isEmpty() && ig.getShareLinks().containsKey(exportId) && ig.getShareLinks().get(exportId) != null) {
				String URL = request.getRequestURL() + "/content";
				String page = IOUtils.resourceToString("/public-ig-loading.html", StandardCharsets.UTF_8);
				String content = page.replace("{{URL}}", URL).replace("{{NAME}}", ig.getMetadata().getTitle());
				response.setContentType("text/html");
				response.getWriter().write(content);
			} else {
				response.setStatus(HttpServletResponse.SC_NOT_FOUND);
				response.setContentType("text/html");
				IOUtils.copy(Objects.requireNonNull(PublicIgController.class.getResourceAsStream("/public-ig-not-found.html")), response.getOutputStream());
			}
		} catch(Exception e) {
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			response.setContentType("text/html");
			IOUtils.copy(Objects.requireNonNull(PublicIgController.class.getResourceAsStream("/public-ig-error.html")), response.getOutputStream());
		}
	}
}
