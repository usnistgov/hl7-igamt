package gov.nist.hit.hl7.igamt.web.app.codeset;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.opencsv.bean.ColumnPositionMappingStrategy;
import com.opencsv.bean.CsvToBean;
import com.opencsv.bean.CsvToBeanBuilder;

import gov.nist.hit.hl7.igamt.access.active.NotifySave;
import gov.nist.hit.hl7.igamt.common.base.domain.AccessType;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.domain.SourceType;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.exception.ForbiddenOperationException;
import gov.nist.hit.hl7.igamt.common.base.exception.ResourceNotFoundException;
import gov.nist.hit.hl7.igamt.common.base.exception.ValuesetNotFoundException;
import gov.nist.hit.hl7.igamt.common.base.model.ResponseMessage;
import gov.nist.hit.hl7.igamt.common.base.model.ResponseMessage.Status;
import gov.nist.hit.hl7.igamt.common.base.service.CommonService;
import gov.nist.hit.hl7.igamt.common.base.wrappers.AddResourceResponse;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.ChangeItemDomain;
import gov.nist.hit.hl7.igamt.common.config.domain.Config;
import gov.nist.hit.hl7.igamt.common.exception.EntityNotFound;
import gov.nist.hit.hl7.igamt.display.model.CopyInfo;
import gov.nist.hit.hl7.igamt.display.model.PublishingInfo;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.exceptions.IGNotFoundException;
import gov.nist.hit.hl7.igamt.ig.exceptions.IGUpdateException;
import gov.nist.hit.hl7.igamt.ig.exceptions.ImportValueSetException;
import gov.nist.hit.hl7.igamt.valueset.domain.Code;
import gov.nist.hit.hl7.igamt.valueset.domain.CodeSet;
import gov.nist.hit.hl7.igamt.valueset.domain.CodeSetVersion;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.valueset.exception.ValuesetException;
import gov.nist.hit.hl7.igamt.valueset.model.CodeRaw;
import gov.nist.hit.hl7.igamt.valueset.model.CodeSetCreateRequest;
import gov.nist.hit.hl7.igamt.valueset.model.CodeSetInfo;
import gov.nist.hit.hl7.igamt.valueset.model.CodeSetListItem;
import gov.nist.hit.hl7.igamt.valueset.model.CodeSetListType;
import gov.nist.hit.hl7.igamt.valueset.model.CodeSetVersionContent;
import gov.nist.hit.hl7.igamt.valueset.service.CodeSetService;
import gov.nist.hit.hl7.igamt.valueset.service.impl.TableCSVGenerator;
import gov.nist.hit.hl7.igamt.workspace.domain.Workspace;
import gov.nist.hit.hl7.igamt.workspace.exception.WorkspaceForbidden;
import gov.nist.hit.hl7.igamt.workspace.exception.WorkspaceNotFound;
import gov.nist.hit.hl7.igamt.workspace.model.AddFolderRequest;
import gov.nist.hit.hl7.igamt.workspace.model.FolderContent;
import gov.nist.hit.hl7.igamt.workspace.model.WorkspaceInfo;
import gov.nist.hit.hl7.igamt.workspace.model.WorkspaceListItem;
import gov.nist.hit.hl7.igamt.workspace.model.WorkspaceListType;

@RestController
public class CodeSetController {


	@Autowired
	CodeSetService codeSetService;
	
	

	@Autowired
	CommonService commonService;


	@RequestMapping(value = "/api/code-set/create", method = RequestMethod.POST, produces = { "application/json" })
	public ResponseMessage<String> createWorkspace(
			@RequestBody CodeSetCreateRequest CodeSetCreateRequest,
			Authentication authentication
			) {
		CodeSet ws = this.codeSetService.createCodeSet(CodeSetCreateRequest, authentication.getName());
		return new ResponseMessage<>(ResponseMessage.Status.SUCCESS, "Code Set Created Successfully",  ws.getId(), ws.getId(), new Date());
	}


	@RequestMapping(value = "/api/code-set/{id}/state", method = RequestMethod.GET, produces = { "application/json" })
	@ResponseBody
	//	@PreAuthorize("AccessWorkspace(#id, READ)")
	public CodeSetInfo getWorkspaceInfo(
			Authentication authentication,
			@PathVariable("id") String id
			) throws  ResourceNotFoundException, ForbiddenOperationException {
		String username = authentication.getPrincipal().toString();
		return codeSetService.getCodeSetInfo(id, username);
	}


	@RequestMapping(value = "/api/code-set/{id}/applyInfo", method = RequestMethod.POST, produces = { "application/json" })
	@ResponseBody
	//	@PreAuthorize("AccessWorkspace(#id, READ)")
	public ResponseMessage<?> SaveCodeSet(
			Authentication authentication,
			@PathVariable("id") String id,  @RequestBody CodeSetInfo content
			) throws  ResourceNotFoundException, ForbiddenOperationException {
		String username = authentication.getPrincipal().toString();
		CodeSet ret =  codeSetService.saveCodeSetContent(id, content, username);


		return new ResponseMessage(Status.SUCCESS, "Code set Saved", ret.getId(), null);
	}

	@RequestMapping(value = "/api/code-set/{id}/updateViewers", method = RequestMethod.POST, produces = { "application/json" })
	//	@PreAuthorize("AccessResource('IGDOCUMENT', #id, WRITE)")
	public @ResponseBody ResponseMessage<String> updateViewers(@PathVariable("id") String id, @RequestBody List<String> viewers, Authentication authentication) throws Exception {
		this.codeSetService.updateViewers(id, viewers, authentication.getName());
		return new ResponseMessage<>(Status.SUCCESS, "", "Code Set Shared Users Successfully Updated", id, false, new Date(), id);
	}



	@RequestMapping(value = "/api/code-set/{id}/code-set-version/{versionId}", method = RequestMethod.GET, produces = { "application/json" })
	@ResponseBody
	//	@PreAuthorize("AccessWorkspaceFolder(#id, #folderId, READ)")
	public CodeSetVersionContent getFolderContent(
			Authentication authentication,
			@PathVariable("id") String id,
			@PathVariable("versionId") String versionId
			) throws ResourceNotFoundException {
		String username = authentication.getPrincipal().toString();
		return codeSetService.getCodeSetVersionContent(id, versionId, username);
	}


	@RequestMapping(value = "/api/code-set/{id}/code-set-version/{versionId}", method = RequestMethod.POST, produces = { "application/json" })
	@ResponseBody
	public ResponseMessage<?> applyStructureChanges(@PathVariable("id") String id,
			@PathVariable("versionId") String versionId, @RequestBody CodeSetVersionContent content,
			Authentication authentication) throws ValuesetException, IOException, ForbiddenOperationException, ResourceNotFoundException {
		String username = authentication.getPrincipal().toString();

		CodeSetVersion ret = codeSetService.saveCodeSetVersionContent(id, versionId, content, username);
		return new ResponseMessage(Status.SUCCESS, "Code set Saved", ret.getId(), null);
	}


	@RequestMapping(value = "/api/code-set/{id}/code-set-version/{versionId}/commit", method = RequestMethod.POST, produces = { "application/json" })
	@ResponseBody
	public ResponseMessage<?> commit(@PathVariable("id") String id,
			@PathVariable("versionId") String versionId, @RequestBody CodeSetVersionContent content,
			Authentication authentication) throws ValuesetException, IOException, ForbiddenOperationException, ResourceNotFoundException {
		String username = authentication.getPrincipal().toString();

		CodeSetVersion ret = codeSetService.commit(id, versionId, content, username);

		//this.codeSetService.addCodeSetVersion(id);
		return new ResponseMessage(Status.SUCCESS, "Code set Saved", ret.getId(), null);
	}

	@RequestMapping(value = "/api/code-sets", method = RequestMethod.GET, produces = { "application/json" })
	public @ResponseBody List<CodeSetListItem> getUserWorkspaces(
			Authentication authentication,
			@RequestParam("type") CodeSetListType type
			) throws ForbiddenOperationException {
		String username = authentication.getPrincipal().toString();
		List<CodeSet> codesets = new ArrayList<>();

		if (type != null) {
			if (type.equals(CodeSetListType.PRIVATE)) {

				codesets = codeSetService.findByPrivateAudienceEditor(username);

			}

			else if (type.equals(CodeSetListType.PUBLIC)) {

				codesets = codeSetService.findByPublicAudienceAndStatusPublished();

			} else if (type.equals(CodeSetListType.SHARED)) {
				
				codesets = codeSetService.findByPrivateAudienceViewer(username);
			}

			else if (type.equals(CodeSetListType.ALL)) {

				commonService.checkAuthority(authentication, "ADMIN");
				codesets = codeSetService.findAllPrivateCodeSet();

			}
			return codeSetService.convertToDisplayList(codesets);
		} else {
			codesets = codeSetService.findByPrivateAudienceEditor(username);
			return codeSetService.convertToDisplayList(codesets);
		}

	}


	@RequestMapping(value = "/api/code-sets/exportCSV/{id}", method = RequestMethod.POST, consumes = "application/x-www-form-urlencoded; charset=UTF-8")
	public void exportCSV(@PathVariable("id") String tableId, HttpServletRequest request, HttpServletResponse response)
			throws IOException, ResourceNotFoundException, ForbiddenOperationException {
		CodeSetVersion codeSetVersion = this.codeSetService.findById(tableId);
		if (codeSetVersion == null) {
			response.sendError(HttpServletResponse.SC_NOT_FOUND, "CodeSetVersion not found for ID: " + tableId);
			return;
		}

		String csvContent = new TableCSVGenerator().generate(codeSetVersion.getCodes());

		try (InputStream content = IOUtils.toInputStream(csvContent, "UTF-8")) {
			response.setContentType("text/csv");

			response.setHeader("Content-disposition", "attachment;filename=" + codeSetVersion.getVersion()
			+ "-" + new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date()) + ".csv");

			FileCopyUtils.copy(content, response.getOutputStream());
		} 
	}

	@RequestMapping(value = "/api/code-sets/importCSV", method = RequestMethod.POST)

	public List<Code> uploadCSVFile(@RequestParam("file") MultipartFile file, Authentication authentication) {
		if (file.isEmpty()) {
		} else {

			try (Reader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
				ColumnPositionMappingStrategy<CodeRaw> strategy = new ColumnPositionMappingStrategy<>();
				strategy.setType(CodeRaw.class);


				//strategy.setColumnMapping(new String[]{"Value",	"Pattern", 	"Description", "CodeSystem",	"Usage",	"Comments"});
				strategy.setColumnMapping(new String[]{"value",	"pattern", 	"description", "codeSystem",	"usage",	"comments"});

				CsvToBean<CodeRaw> csvToBean = new CsvToBeanBuilder<CodeRaw>(reader)
						.withMappingStrategy(strategy)
						.withIgnoreLeadingWhiteSpace(true)
						.withSkipLines(1)
						.build();



				List<CodeRaw> rawCodes = csvToBean.parse();



				List<Code> codes = rawCodes.stream().map(rawCode -> {
					return rawCode.convertToCode();     
				}).collect(Collectors.toList());

				return codes;
			} catch (Exception ex) {

				ex.printStackTrace();
			}

		}
		return null;
	}


	
	@RequestMapping(value = "/api/code-set/{id}", method = RequestMethod.DELETE, produces = { "application/json" })
	public ResponseMessage<String> deleteCodeSet(
			Authentication authentication,
			@PathVariable("id") String id
	) throws ForbiddenOperationException, ResourceNotFoundException {
		
		String username = authentication.getPrincipal().toString();
		this.codeSetService.deleteCodeSet(id, username);
		
		return new ResponseMessage<>(ResponseMessage.Status.SUCCESS, "Code Set  Deleted Successfully",  id, id, new Date());
	}

	@RequestMapping(value = "/api/code-set/{id}/clone", method = RequestMethod.POST, produces = {
	"application/json" })
	public @ResponseBody ResponseMessage<String> copy(@PathVariable("id") String id,  Authentication authentication)
			throws  ResourceNotFoundException, ForbiddenOperationException {
		String username = authentication.getPrincipal().toString();
		CodeSet clone = codeSetService.clone(id, username);
		return new ResponseMessage<String>(Status.SUCCESS, "", "Code Set Cloned Successfully", clone.getId(), false,
				clone.getDateUpdated(), clone.getId());
	}
	
	
	@RequestMapping(value = "/api/code-set/{id}/publish", method = RequestMethod.POST, produces = {
	"application/json" })
	public @ResponseBody ResponseMessage<String> publish(@PathVariable("id") String id,  Authentication authentication) throws
	ForbiddenOperationException, ResourceNotFoundException {
		String username = authentication.getPrincipal().toString();
		commonService.checkAuthority(authentication, "ADMIN");

		CodeSet published = codeSetService.publish(id, username);
		return new ResponseMessage<String>(Status.SUCCESS, "", "Code Set Published Successfully", published.getId(), false,
				published.getDateUpdated(), published.getId());
	}

}
