package gov.nist.hit.hl7.igamt.web.app.ig;

import gov.nist.hit.hl7.igamt.common.base.service.InMemoryDomainExtensionService;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportType;
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
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Controller
public class PublicIgController {

	@Autowired
	public IgService igService;
	@Autowired
	public IgNewExportService igExportService;
	@Autowired
	public ExportConfigurationService exportConfigurationService;
	@Autowired
	public InMemoryDomainExtensionService inMemoryDomainExtensionService;

	// Differential ShareLink Public Endpoints (more specific routes first)
	@RequestMapping(value = "/public/ig/{igId}/differential/{exportId}/content")
	public @ResponseBody void getDifferentialIg(
			@PathVariable("igId") String id,
			@PathVariable("exportId") String exportId,
			HttpServletResponse response,
			HttpServletRequest request
	) throws Exception {
		System.out.println("========== DIFFERENTIAL CONTENT ENDPOINT CALLED ==========");
		System.out.println("IG ID: " + id);
		System.out.println("Export ID: " + exportId);
		Set<String> dataExtensionTokens = new HashSet<>();
		try {
			Ig ig = igService.findById(id);
			System.out.println("IG Found: " + (ig != null));
			if(ig != null && ig.getShareLinks() != null && !ig.getShareLinks().isEmpty() && ig.getShareLinks().containsKey(exportId)) {
				ExportShareConfiguration exportShareConfiguration = ig.getShareLinks().get(exportId);
				System.out.println("ShareLink isDifferential: " + (exportShareConfiguration != null ? exportShareConfiguration.isDifferential() : "null"));
				if(exportShareConfiguration != null && exportShareConfiguration.isDifferential()) {
					// Export as differential HTML with delta calculation
					ExportConfiguration exportConfiguration = exportConfigurationService.getExportConfiguration(exportShareConfiguration.getConfigurationId());
					System.out.println("Original Export Configuration Type: " + exportConfiguration.getType());

					// Force the configuration type to DIFFERENTIAL for delta calculation
					exportConfiguration.setType(ExportType.DIFFERENTIAL);
					System.out.println("Forced Export Configuration Type to: " + exportConfiguration.getType());
					System.out.println("IG Origin ID: " + ig.getOrigin());
					System.out.println("Will calculate delta: " + (ig.getOrigin() != null));

					// Get or recalculate the filter decision with delta
					System.out.println("Calling getExportFilterDecision to calculate delta...");
					ExportFilterDecision filterDecision = igExportService.getExportFilterDecision(ig, exportConfiguration);
					System.out.println("Delta calculation complete. isDelta: " + (filterDecision != null ? filterDecision.isDelta() : "null"));

					IgDataModel igDataModel = igService.generateDataModel(ig);
					dataExtensionTokens.addAll(igDataModel.getDataExtensionTokens());

					System.out.println("Calling exportIgDocumentToHtml...");
					ExportedFile exportedFile = igExportService.exportIgDocumentToHtml(ig.getUsername(), igDataModel, filterDecision, exportConfiguration.getId());

					// Print debug info
					System.out.println("========== DIFFERENTIAL EXPORT DEBUG ==========");
					System.out.println("IG ID: " + ig.getId());
					System.out.println("IG Title: " + ig.getMetadata().getTitle());
					System.out.println("Origin ID: " + ig.getOrigin());
					System.out.println("Export Configuration ID: " + exportConfiguration.getId());
					System.out.println("Export Configuration Type: " + exportConfiguration.getType());
					System.out.println("Filter Decision Delta: " + (filterDecision != null ? filterDecision.isDelta() : "null"));
					System.out.println("Exported File Name: " + exportedFile.getFileName());
					System.out.println("========== END DEBUG ==========");

					// Write the response
					response.setContentType("text/html");
					FileCopyUtils.copy(exportedFile.getContent(), response.getOutputStream());
				} else {
					response.setStatus(HttpServletResponse.SC_NOT_FOUND);
					response.setContentType("text/html");
					IOUtils.copy(Objects.requireNonNull(PublicIgController.class.getResourceAsStream("/public-ig-not-found.html")), response.getOutputStream());
				}
			} else {
				response.setStatus(HttpServletResponse.SC_NOT_FOUND);
				response.setContentType("text/html");
				IOUtils.copy(Objects.requireNonNull(PublicIgController.class.getResourceAsStream("/public-ig-not-found.html")), response.getOutputStream());
			}
		} catch(Exception e) {
			System.out.println("ERROR ACCESSING DIFFERENTIAL SHARE LINK: " + e.getMessage() + "\n" + e.getStackTrace());
			e.printStackTrace();
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			response.setContentType("text/html");
			IOUtils.copy(Objects.requireNonNull(PublicIgController.class.getResourceAsStream("/public-ig-error.html")), response.getOutputStream());
		} finally {
			dataExtensionTokens.forEach(token -> inMemoryDomainExtensionService.clear(token));
		}
	}

	@RequestMapping(value = "/public/ig/{igId}/differential/{exportId}")
	public @ResponseBody void getLoadDifferentialIgPage(
			@PathVariable("igId") String id,
			@PathVariable("exportId") String exportId,
			HttpServletResponse response,
			HttpServletRequest request
	) throws Exception {
		System.out.println("========== DIFFERENTIAL LOADING PAGE DEBUG ==========");
		System.out.println("IG ID: " + id);
		System.out.println("Export ID: " + exportId);
		try {
			Ig ig = igService.findById(id);
			System.out.println("IG Found: " + (ig != null));
			if(ig != null) {
				System.out.println("ShareLinks: " + (ig.getShareLinks() != null ? ig.getShareLinks().keySet() : "null"));
				if(ig.getShareLinks() != null && ig.getShareLinks().containsKey(exportId)) {
					ExportShareConfiguration config = ig.getShareLinks().get(exportId);
					System.out.println("ShareLink found: " + (config != null));
					System.out.println("ShareLink isDifferential: " + (config != null ? config.isDifferential() : "null"));
				}
			}
			System.out.println("========== END DEBUG ==========");

			if(ig != null && ig.getShareLinks() != null && !ig.getShareLinks().isEmpty() && ig.getShareLinks().containsKey(exportId)) {
				ExportShareConfiguration exportShareConfiguration = ig.getShareLinks().get(exportId);
				if(exportShareConfiguration != null && exportShareConfiguration.isDifferential()) {
					// Show loading page for differential HTML export
					String URL = request.getRequestURL() + "/content";
					// Only force https if not localhost
					if(!URL.contains("https") && !URL.contains("localhost")){
						URL = URL.replace("http", "https");
					}
					String page = IOUtils.resourceToString("/public-ig-loading.html", StandardCharsets.UTF_8);
					// Add differential message - replace the loading text with a more descriptive one
					String differentialMessage = ig.getMetadata().getTitle() + " (Differential Export)<br/><small style='color: #666;'>Calculating differences from the origin IG. This may take a moment...</small>";
					String content = page.replace("{{URL}}", URL).replace("{{NAME}}", differentialMessage);
					response.setContentType("text/html");
					response.getWriter().write(content);
				} else {
					response.setStatus(HttpServletResponse.SC_NOT_FOUND);
					response.setContentType("text/html");
					IOUtils.copy(Objects.requireNonNull(PublicIgController.class.getResourceAsStream("/public-ig-not-found.html")), response.getOutputStream());
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

	// Regular ShareLink Public Endpoints
	@RequestMapping(value = "/public/ig/{igId}/{exportId}/content")
	public @ResponseBody void getIg(
			@PathVariable("igId") String id,
			@PathVariable("exportId") String exportId,
			HttpServletResponse response,
			HttpServletRequest request
	) throws Exception {
		Set<String> dataExtensionTokens = new HashSet<>();
		try {
			Ig ig = igService.findById(id);
			if(ig != null && ig.getShareLinks() != null && !ig.getShareLinks().isEmpty() && ig.getShareLinks().containsKey(exportId)) {
				ExportShareConfiguration exportShareConfiguration = ig.getShareLinks().get(exportId);
				if(exportShareConfiguration != null) {
					ExportConfiguration exportConfiguration = exportConfigurationService.getExportConfiguration(exportShareConfiguration.getConfigurationId());
					ExportFilterDecision filterDecision = exportShareConfiguration.getExportDecision();
					IgDataModel igDataModel = igService.generateDataModel(ig);
					dataExtensionTokens.addAll(igDataModel.getDataExtensionTokens());
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
			System.out.println("ERROR ACCESSING SHARE LINK: " + e.getMessage() + "\n" + e.getStackTrace());
			e.printStackTrace();
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			response.setContentType("text/html");
			IOUtils.copy(Objects.requireNonNull(PublicIgController.class.getResourceAsStream("/public-ig-error.html")), response.getOutputStream());
		} finally {
			dataExtensionTokens.forEach(token -> inMemoryDomainExtensionService.clear(token));
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
				// Only force https if not localhost
				if(!URL.contains("https") && !URL.contains("localhost")){
					URL = URL.replace("http", "https");
				}
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
