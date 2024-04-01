package gov.nist.hit.hl7.igamt.valueset.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.common.base.domain.Audience;
import gov.nist.hit.hl7.igamt.common.base.domain.AudienceType;
import gov.nist.hit.hl7.igamt.common.base.domain.Link;
import gov.nist.hit.hl7.igamt.common.base.domain.PrivateAudience;
import gov.nist.hit.hl7.igamt.common.base.domain.PublicAudience;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.exception.ForbiddenOperationException;
import gov.nist.hit.hl7.igamt.common.base.exception.ResourceNotFoundException;
import gov.nist.hit.hl7.igamt.common.base.model.DocumentSummary;
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
import java.util.Iterator;
import java.util.List;
import java.util.Set;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;


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
		codeSet.setUsername(username);
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
		info.setExposed(codeSet.isExposed());
		info.setDefaultVersion(username);
		info.setDefaultVersion(codeSet.getLatest());
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
		codeSetVersionInfo.setDeprecated(version.isDeprecated());
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
	public CodeSetVersion saveCodeSetVersionContent(String id, String versionId, CodeSetVersionContent content, String username)
			throws ResourceNotFoundException, ForbiddenOperationException {
		CodeSetVersion codeSetVersion =	this.codeSetVersionRepo.findById(versionId).orElseThrow(() -> new ResourceNotFoundException(versionId, Type.CODESETVERSION));
	
		
		applyCodeSet(content, codeSetVersion );
		
		return codeSetVersionRepo.save(codeSetVersion);
		
	}
	
	
	@Override
	public CodeSetVersion findById(String id)throws ResourceNotFoundException {
		return	this.codeSetVersionRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException(id, Type.CODESETVERSION));
	
		
	}
	
	
	@Override
	public CodeSetVersion commit(String id, String versionId, CodeSetVersionContent content, String username)
			throws ResourceNotFoundException, ForbiddenOperationException {
		
		CodeSet codeSet = this.codeSetRepo.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException(id, Type.CODESET));
		CodeSetVersion codeSetVersion =	this.codeSetVersionRepo.findById(versionId).orElseThrow(() -> new ResourceNotFoundException(versionId, Type.CODESETVERSION));
	
		
		applyCodeSet(content, codeSetVersion );
		codeSetVersion.setDateCommitted(new Date());
		
		
		if(content.isLatest()) {
			codeSet.setLatest(versionId);
		}
		
		CodeSetVersion starting = new CodeSetVersion();
		starting.setCodes(codeSetVersion.getCodes());
		starting.setVersion(generateLatest(codeSet.getCodeSetVersions()));		
		codeSet.getCodeSetVersions().add(this.codeSetVersionRepo.save(starting));
		
		this.codeSetRepo.save(codeSet);
		
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
		
		for (CodeSet codeSet : codesets) {
			CodeSetListItem element = new CodeSetListItem();
			element.setId(codeSet.getId());
			element.setResourceType(Type.CODESET);
			element.setTitle(codeSet.getName());
	

			if(codeSet.getAudience() != null && codeSet.getAudience() instanceof PrivateAudience) {
				element.setSharedUsers(((PrivateAudience) codeSet.getAudience()).getViewers());
				PrivateAudience audience = (PrivateAudience) codeSet.getAudience();
				element.setSharedUsers(audience.getViewers());
				element.setCurrentAuthor(audience.getEditor());
				element.setUsername(audience.getEditor());

			}

			ret.add(element);
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
	public void addCodeSetVersion(String id, CodeSetVersion from) throws ResourceNotFoundException {
		CodeSet codeSet = this.codeSetRepo.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException(id, Type.CODESET));	
		
		
		CodeSetVersion starting = new CodeSetVersion();
		starting.setCodes(from.getCodes());
		starting.setVersion(generateLatest(codeSet.getCodeSetVersions()));		
		codeSet.getCodeSetVersions().add(this.codeSetVersionRepo.save(starting));
		this.codeSetRepo.save(codeSet);
		
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
	
	@Override
	public CodeSet saveCodeSetContent(String id, CodeSetInfo content, String username)
			throws ResourceNotFoundException, ForbiddenOperationException {
		CodeSet codeSet =	this.codeSetRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException(id, Type.CODESET));
		toCodeSetInfo(content,  codeSet);
		
		codeSet = this.codeSetRepo.save(codeSet);
		
		return codeSet;
	

		
	}
	
	
	private void toCodeSetInfo(CodeSetInfo info, CodeSet codeSet) {
		
		codeSet.setName(info.getMetadata().getTitle());
		codeSet.setDescription(info.getMetadata().getTitle());
		
		mergeCodeSetVersions(codeSet.getCodeSetVersions(),info.getChildren());		

		codeSetRepo.save(codeSet);
	
	}
	
	private boolean mergeCodeSetVersions(Set<CodeSetVersion> children, List<CodeSetVersionInfo> infoChildren) {
		boolean modified = false;
	    Map<String, CodeSetVersionInfo> infoMap = infoChildren.stream()
	            .collect(Collectors.toMap(CodeSetVersionInfo::getId, Function.identity()));

	    Iterator<CodeSetVersion> iterator = children.iterator();
	    while (iterator.hasNext()) {
	        CodeSetVersion child = iterator.next();
	        CodeSetVersionInfo info = infoMap.get(child.getId());
	        if(!infoMap.containsKey(child.getId())) {
	        	  iterator.remove();
	        	  modified = true;
	        	  codeSetVersionRepo.deleteById(child.getId());
	        }

	        else if (info.isDeprecated()) {
	            child.setDeprecated(true);
	        	codeSetVersionRepo.save(child);


	        }
	    }
		return modified;
	}

	
	@Override
	public void updateViewers(String id, List<String> viewers, String username) throws Exception {
		CodeSet codeSet =	this.codeSetRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException(id, Type.CODESET));


			if(codeSet.getUsername().equals(username)) {

				// The owner can't be in the viewers list
				if(viewers != null) {
					viewers.remove(username);
				}

				Audience audience = codeSet.getAudience();

				if(audience instanceof PrivateAudience) {
					((PrivateAudience) audience).setViewers(new HashSet<>(viewers != null ? viewers : new ArrayList<>()));
				} else {
					throw new Exception("Invalid operation");
				}

			} else {
				throw new ForbiddenOperationException();
			}

		
		this.codeSetRepo.save(codeSet);
	}
	@Override
	public void  deleteCodeSet(String id, String username) throws ForbiddenOperationException, ResourceNotFoundException {
		CodeSet codeSet =	this.codeSetRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException(id, Type.CODESET));


		if(codeSet.getUsername().equals(username)) {
			if(codeSet.getCodeSetVersions() != null) {
			for(CodeSetVersion version: codeSet.getCodeSetVersions()) {
				this.codeSetVersionRepo.deleteById(version.getId());
			}
			this.codeSetRepo.delete(codeSet);
			
			}
		} else {
			throw new ForbiddenOperationException();
		}

	
	}
//	@Override
//	public List<CodeSet> findByPublicAudienceAndStatusPublished() {
//		return this.codeSetRepo.findByPublicAudienceAndStatusPublished();
//	}
//	

	@Override
	public CodeSet clone(String id, String username) throws ForbiddenOperationException, ResourceNotFoundException {
		
		CodeSet originalCodeSet =	this.codeSetRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException(id, Type.CODESET));

	    CodeSet clonedCodeSet = new CodeSet();
	    clonedCodeSet.setAudience(originalCodeSet.getAudience());
	    clonedCodeSet.setExposed(originalCodeSet.isExposed());
	    clonedCodeSet.setLatest(originalCodeSet.getLatest());
	    clonedCodeSet.setDateUpdated(originalCodeSet.getDateUpdated());
	    clonedCodeSet.setSlug(originalCodeSet.getSlug());
	    clonedCodeSet.setName(originalCodeSet.getName() + "[Clone]");
	    clonedCodeSet.setDescription(originalCodeSet.getDescription());
	    clonedCodeSet.setUsername(originalCodeSet.getUsername());
	    Set<CodeSetVersion> clonedVersions = new HashSet<>();
	    for (CodeSetVersion originalVersion : originalCodeSet.getCodeSetVersions()) {
	    	CodeSetVersion clonedVersion = this.codeSetVersionRepo.save(this.cloneVersion(originalVersion));
	        clonedVersions.add(clonedVersion);
	        
	    }
	    
	    clonedCodeSet.setCodeSetVersions(clonedVersions);
	    return codeSetRepo.save(clonedCodeSet);
	}

	private CodeSetVersion cloneVersion(CodeSetVersion originalVersion) {
		
	    CodeSetVersion clonedVersion = new CodeSetVersion();
        clonedVersion.setVersion(originalVersion.getVersion());
        clonedVersion.setExposed(originalVersion.isExposed());
        clonedVersion.setDateCommitted(originalVersion.getDateCommitted());
        clonedVersion.setDateCreated(originalVersion.getDateCreated());
        clonedVersion.setDateUpdated(originalVersion.getDateUpdated());
        clonedVersion.setComments(originalVersion.getComments());
        clonedVersion.setCodes(new HashSet<>(originalVersion.getCodes()));
        clonedVersion.setDeprecated(originalVersion.isDeprecated());
        
        return clonedVersion;
	}

	@Override
	public CodeSet publish(String id, String username) throws ForbiddenOperationException, ResourceNotFoundException {
		
		CodeSet codeSet =	this.codeSetRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException(id, Type.CODESET));
		codeSet.setAudience(new PublicAudience());

	    return codeSetRepo.save(codeSet);

	}
	
	
	
}
