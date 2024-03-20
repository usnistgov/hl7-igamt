package gov.nist.hit.hl7.igamt.valueset.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.repository.Query;
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
		codeSet.getCodeSetVersions().add(this.codeSetVersionRepo.save(starting));


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
		
		return children.stream()
                .sorted((v1, v2) -> v2.getDateCreated().compareTo(v1.getDateCreated()))
                .collect(Collectors.toList());
        
	}

	private void setVersionInfo(CodeSetVersion version, CodeSetVersionInfo codeSetVersionInfo,  String parent) {
		
		codeSetVersionInfo.setId(version.getId());
		codeSetVersionInfo.setVersion(version.getVersion());
		codeSetVersionInfo.setExposted(false);
		codeSetVersionInfo.setComments(version.getComments());
		codeSetVersionInfo.setParentId(parent);
		codeSetVersionInfo.setDateUpdated(version.getDateUpdated());
		codeSetVersionInfo.setDateCreated(version.getDateCreated());
		codeSetVersionInfo.setDateCommitted(version.getDateCommitted());
	}
	
	

	@Override
	public CodeSetVersionContent getCodeSetVersionContent(String parentId, String codeSetVersionId, String username) throws ResourceNotFoundException {
		
		CodeSetVersion codeSetVersion =	this.codeSetVersionRepo.findById(codeSetVersionId).orElseThrow(() -> new ResourceNotFoundException(codeSetVersionId, Type.CODESETVERSION));
		CodeSetVersionContent ret = new CodeSetVersionContent();
		this.setVersionInfo(codeSetVersion, ret,  parentId);
			
		
		ret.setCodes(codeSetVersion.getCodes());
		return ret;
	}

	@Override
	public CodeSetVersion saveCodeSetContent(String id, String versionId, CodeSetVersionContent content, String username)
			throws ResourceNotFoundException, ForbiddenOperationException {
		CodeSetVersion codeSetVersion =	this.codeSetVersionRepo.findById(versionId).orElseThrow(() -> new ResourceNotFoundException(versionId, Type.CODESETVERSION));
	
		
		applyCodeSet(content, codeSetVersion );
		
		return codeSetVersionRepo.save(codeSetVersion);
		
	}
	
	
	@Override
	public CodeSetVersion findById(String id)throws ResourceNotFoundException, ForbiddenOperationException {
		return	this.codeSetVersionRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException(id, Type.CODESETVERSION));
	
		
	}
	
	
	@Override
	public CodeSetVersion commit(String id, String versionId, CodeSetVersionContent content, String username)
			throws ResourceNotFoundException, ForbiddenOperationException {
		CodeSetVersion codeSetVersion =	this.codeSetVersionRepo.findById(versionId).orElseThrow(() -> new ResourceNotFoundException(versionId, Type.CODESETVERSION));
	
		
		applyCodeSet(content, codeSetVersion );
		
		codeSetVersion.setDateCommitted(new Date());
		return codeSetVersionRepo.save(codeSetVersion);
		
	}
	

	public void applyCodeSet(CodeSetVersionContent content, CodeSetVersion codeSetVersion) {
		
		codeSetVersion.setCodes(content.getCodes());
		codeSetVersion.setComments(content.getComments());
		codeSetVersion.setVersion(content.getVersion());
		codeSetVersion.setExposed(content.isExposted());
		
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

	@Override
	public void addCodeSetVersion(String id) throws ResourceNotFoundException {
		CodeSet codeSet = this.codeSetRepo.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException(id, Type.CODESET));	
		
		
		CodeSetVersion starting = new CodeSetVersion();
		starting.setVersion(generateLatest(codeSet.getCodeSetVersions()));		
		codeSet.getCodeSetVersions().add(this.codeSetVersionRepo.save(starting));
		 this.codeSetRepo.save(codeSet);

		
		
	}

	private String generateLatest(Set<CodeSetVersion> codeSetVersions) {
		return codeSetVersions.size()+1+"";
	}

	@Override
	public List<CodeSet> findByPublicAudienceAndStatusPublished() {
		// TODO Auto-generated method stub
		return this.codeSetRepo.findByPublicAudienceAndStatusPublished();
	}
	
	
	

	
//	@Override
//	public List<CodeSet> findByPublicAudienceAndStatusPublished() {
//		return this.codeSetRepo.findByPublicAudienceAndStatusPublished();
//	}
//	
	
}
