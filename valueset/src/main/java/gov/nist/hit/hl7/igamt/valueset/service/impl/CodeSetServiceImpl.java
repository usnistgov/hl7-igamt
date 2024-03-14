package gov.nist.hit.hl7.igamt.valueset.service.impl;

import java.util.ArrayList;
import java.util.Date;
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
import gov.nist.hit.hl7.igamt.valueset.model.CodeSetListItem;
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
		CodeSetVersion second = new CodeSetVersion();
		second.setDateCommited(new Date());
		second.setVersion("2");
		
		CodeSetVersion third = new CodeSetVersion();
		third.setDateCommited(null);
		third.setVersion("3");
		
		codeSet.getCodeSetVersions().add(this.codeSetVersionRepo.save(starting));
		codeSet.getCodeSetVersions().add(this.codeSetVersionRepo.save(second));

		codeSet.getCodeSetVersions().add(this.codeSetVersionRepo.save(third));

		return this.codeSetRepo.save(codeSet);
	}
	
	@Override
	public CodeSetInfo getCodeSetInfo(String id, String username) throws ResourceNotFoundException, ForbiddenOperationException {
		CodeSet codeSet = this.codeSetRepo.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException(id, Type.CODESET));
			return this.toCodeSetInfo(codeSet, username);
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
	
		
		ret.setCodes(codeSetVersion.getCodes());
		return ret;
	}

	@Override
	public CodeSetVersion saveCodeSetContent(String id, String versionId, CodeSetVersionContent content, String username)
			throws ResourceNotFoundException, ForbiddenOperationException {
		CodeSetVersion codeSetVersion =	this.codeSetVersionRepo.findById(versionId).orElseThrow(() -> new ResourceNotFoundException(versionId, Type.CODESETVERSION));
		codeSetVersion.setCodes(content.getCodes());
		return codeSetVersionRepo.save(codeSetVersion);
		
	}

	@Override
	public List<CodeSet> findByUsername(String username) {
		return null;
	}

	@Override
	public List<CodeSet> findAll() {
		return null;
	}

	@Override
	public List<CodeSetListItem> convertToDisplayList(List<CodeSet> codesets) {
		
		List<CodeSetListItem> ret = new ArrayList<CodeSetListItem>();
		for(CodeSet codeSet: codesets) {
			CodeSetListItem item = new CodeSetListItem();
			item.setId(codeSet.getId());
			item.setTitle(codeSet.getName());
			item.setDescription(codeSet.getDescription());
			//item.setUsername(codeSet.getUsername());
//			item.setCoverPicture();
			item.setDateUpdated(codeSet.getDateUpdated() != null? codeSet.getDateUpdated().toString(): "");
			ret.add(item);
		}
		return ret;
		
	}
	
	@Override
	public List<CodeSet> findByPrivateAudienceEditor(String username) {
		return this.codeSetRepo.findByPrivateAudienceEditor(username);
	}

	@Override
	public List<CodeSet> findByPrivateAudienceViewer(String username) {
		return this.codeSetRepo.findByPrivateAudienceViewer(username);
	}
	
	
	@Override
	public List<CodeSet> findAllPrivateCodeSet() {
		return this.codeSetRepo.findAllPrivateCodeSet();
	}

	
//	@Override
//	public List<CodeSet> findByPublicAudienceAndStatusPublished() {
//		return this.codeSetRepo.findByPublicAudienceAndStatusPublished();
//	}
//	
	
}
