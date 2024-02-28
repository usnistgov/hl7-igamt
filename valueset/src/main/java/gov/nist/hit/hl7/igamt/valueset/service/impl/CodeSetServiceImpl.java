package gov.nist.hit.hl7.igamt.valueset.service.impl;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.common.base.domain.AudienceType;
import gov.nist.hit.hl7.igamt.common.base.domain.PrivateAudience;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.exception.ForbiddenOperationException;
import gov.nist.hit.hl7.igamt.common.base.exception.ResourceNotFoundException;
import gov.nist.hit.hl7.igamt.valueset.domain.Code;
import gov.nist.hit.hl7.igamt.valueset.domain.CodeSet;
import gov.nist.hit.hl7.igamt.valueset.domain.CodeSetVersion;
import gov.nist.hit.hl7.igamt.valueset.domain.CodeUsage;
import gov.nist.hit.hl7.igamt.valueset.model.CodeSetCreateRequest;
import gov.nist.hit.hl7.igamt.valueset.model.CodeSetInfo;
import gov.nist.hit.hl7.igamt.valueset.model.CodeSetMetadata;
import gov.nist.hit.hl7.igamt.valueset.model.CodeSetVersionContent;
import gov.nist.hit.hl7.igamt.valueset.model.CodeSetVersionInfo;
import gov.nist.hit.hl7.igamt.valueset.repository.CodeSetRepository;
import gov.nist.hit.hl7.igamt.valueset.repository.CodeSetVersionRepository;
import gov.nist.hit.hl7.igamt.valueset.service.CodeSetService;


@Service
public class CodeSetServiceImpl implements CodeSetService {
	
	@Autowired
	CodeSetRepository codeSetRepo;
	
	@Autowired
	CodeSetVersionRepository  codeSetVersionRepo;

	@Override
	public CodeSet createCodeSet(CodeSetCreateRequest codeSetCreateRequest, String username) {
		
		
		CodeSet codeSet = new CodeSet();
		codeSet.setDescription(codeSetCreateRequest.getDescription());
		codeSet.setName(codeSetCreateRequest.getTitle());
		codeSet.setCodeSetVersions(new HashSet<CodeSetVersion>());
		codeSet.setAudience(new PrivateAudience(AudienceType.PRIVATE, username, new HashSet<String>()));
		
		CodeSetVersion starting = new CodeSetVersion();
		starting.setVersion("1");
		
		codeSet.getCodeSetVersions().add(this.codeSetVersionRepo.save(starting));
		return this.codeSetRepo.save(codeSet);
	}
	
	@Override
	public CodeSetInfo getCodeSetInfo(String id, String username) throws ResourceNotFoundException, ForbiddenOperationException {
		CodeSet codeSet = this.codeSetRepo.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException(id, Type.CODESET));
		//if(this.workspacePermissionService.hasAccessTo(workspace, username)) {
			return this.toCodeSetInfo(codeSet, username);
		//}
		//throw new ForbiddenOperationException();
	}

	private CodeSetInfo toCodeSetInfo(CodeSet codeSet, String username) {
		
		CodeSetInfo info = new CodeSetInfo();
		info.setId(codeSet.getId());
		CodeSetMetadata metadata = new CodeSetMetadata();
		metadata.setDescription(codeSet.getDescription());
		metadata.setTitle(codeSet.getName());
		List<CodeSetVersionInfo> children = new ArrayList<CodeSetVersionInfo>();
		children = this.generateChildren(codeSet.getCodeSetVersions(),  codeSet.getId() );
		
		
		info.setChildren(children);	
		info.setMetadata(metadata);
		
		return info;
	
	}

	private List<CodeSetVersionInfo> generateChildren(Set<CodeSetVersion> codeSetVersions, String parentId) {
		List<CodeSetVersionInfo> children = new ArrayList<CodeSetVersionInfo>();
		if(codeSetVersions != null) {
			for (CodeSetVersion version: codeSetVersions) {
				
				CodeSetVersionInfo info = new CodeSetVersionInfo();

				this.setVersionInfo(version,info,  parentId);
				children.add(info);
			}
		}
		
		return children;
	}

	private void setVersionInfo(CodeSetVersion version,CodeSetVersionInfo codeSetVersionInfo,  String parent) {
		
		codeSetVersionInfo.setId(version.getId());
		codeSetVersionInfo.setVersion(version.getVersion());
		codeSetVersionInfo.setExposted(false);
		codeSetVersionInfo.setComments(version.getComments());
		codeSetVersionInfo.setParentId(parent);
	
	}
	
	

	@Override
	public CodeSetVersionContent getCodeSetVersionContent(String parentId, String codeSetVersionId, String username) throws ResourceNotFoundException {
		
		CodeSetVersion codeSetVersion =	this.codeSetVersionRepo.findById(codeSetVersionId).orElseThrow(() -> new ResourceNotFoundException(codeSetVersionId, Type.CODESETVERSION));
		CodeSetVersionContent ret = new CodeSetVersionContent();
		this.setVersionInfo(codeSetVersion, ret,  parentId);
		
		//temp 
		
		Set<Code> codes = new HashSet<Code>();
		Code code = new Code();
		code.setId("id");
		code.setCodeSystem("idsyss");
		code.setValue("test");
		code.setUsage(CodeUsage.R);
		codes.add(code);
		
		ret.setCodes(codes);
		return ret;
	}
	
}
