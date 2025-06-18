package gov.nist.hit.hl7.igamt.valueset.service.impl;

import java.lang.reflect.Field;
import java.util.*;
import java.util.stream.Collectors;

import com.google.common.base.Strings;
import gov.nist.hit.hl7.igamt.valueset.domain.Code;
import gov.nist.hit.hl7.igamt.valueset.domain.CodeUsage;
import gov.nist.hit.hl7.igamt.valueset.exception.CodeSetCommitException;
import gov.nist.hit.hl7.igamt.valueset.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationOperation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.common.base.domain.Audience;
import gov.nist.hit.hl7.igamt.common.base.domain.AudienceType;
import gov.nist.hit.hl7.igamt.common.base.domain.PrivateAudience;
import gov.nist.hit.hl7.igamt.common.base.domain.PublicAudience;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.exception.ForbiddenOperationException;
import gov.nist.hit.hl7.igamt.common.base.exception.ResourceNotFoundException;
import gov.nist.hit.hl7.igamt.valueset.domain.CodeSet;
import gov.nist.hit.hl7.igamt.valueset.domain.CodeSetVersion;
import gov.nist.hit.hl7.igamt.valueset.repository.CodeSetRepository;
import gov.nist.hit.hl7.igamt.valueset.repository.CodeSetVersionRepository;
import gov.nist.hit.hl7.igamt.valueset.service.CodeSetService;

import java.util.List;
import java.util.Set;

@Service
public class CodeSetServiceImpl implements CodeSetService {
	
	@Autowired
	CodeSetRepository codeSetRepo;
	@Autowired
	CodeSetVersionRepository  codeSetVersionRepo;
	@Autowired
	MongoTemplate mongoTemplate;
	private final Set<String> codeSetVersionMetadataFields = Arrays.stream(CodeSetVersionMetadata.class.getDeclaredFields())
	                                                               .map(Field::getName)
	                                                               .collect(Collectors.toSet());

	@Override
	public List<CodeSetVersionMetadata> getCodeSetVersionMetadata(CodeSet codeSet) {
		AggregationOperation match = Aggregation.match(Criteria.where("_id").in(codeSet.getCodeSetVersions()));
		AggregationOperation project = Aggregation.project(this.codeSetVersionMetadataFields.toArray(new String[0]));
		Aggregation versionAggregation = Aggregation.newAggregation(match, project);
		AggregationResults<CodeSetVersionMetadata> results = mongoTemplate.aggregate(
				versionAggregation,
				this.mongoTemplate.getCollectionName(CodeSetVersion.class),
				CodeSetVersionMetadata.class
		);
		return results.getMappedResults();
	}

	public CodeSetVersionMetadata getCodeSetVersionMetadataInCodeSetById(CodeSet codeSet, String codeSetVersionId) {
		if(codeSet.getCodeSetVersions().stream().noneMatch(codeSetVersionId::equals)) {
			return null;
		}
		AggregationOperation match = Aggregation.match(Criteria.where("_id").is(codeSetVersionId));
		AggregationOperation project = Aggregation.project(this.codeSetVersionMetadataFields.toArray(new String[0]));
		Aggregation versionAggregation = Aggregation.newAggregation(match, project);
		AggregationResults<CodeSetVersionMetadata> results = mongoTemplate.aggregate(
				versionAggregation,
				this.mongoTemplate.getCollectionName(CodeSetVersion.class),
				CodeSetVersionMetadata.class
		);
		return results.getUniqueMappedResult();
	}

	@Override
	public CodeSet createCodeSet(CodeSetCreateRequest codeSetCreateRequest, String username) {
		CodeSet codeSet = new CodeSet();
		codeSet.setDescription(codeSetCreateRequest.getDescription());
		codeSet.setName(codeSetCreateRequest.getTitle());
		codeSet.setCodeSetVersions(new HashSet<>());
		codeSet.setAudience(new PrivateAudience(AudienceType.PRIVATE, username, new HashSet<>()));
		codeSet.setUsername(username);
		CodeSetVersion starting = new CodeSetVersion();
		starting.setVersion("");
		this.codeSetVersionRepo.save(starting);
		codeSet.getCodeSetVersions().add(starting.getId());
		return this.codeSetRepo.save(codeSet);
	}
	
	@Override
	public CodeSetInfo getCodeSetInfo(String id, boolean includeInProgress, boolean viewOnly) throws ResourceNotFoundException {
		CodeSet codeSet = findCodeSetById(id);
		return this.toCodeSetInfo(codeSet, includeInProgress, viewOnly);
	}

	private CodeSetInfo toCodeSetInfo(CodeSet codeSet, boolean includeInProgress, boolean viewOnly) {
		CodeSetInfo info = new CodeSetInfo();
		info.setId(codeSet.getId());
		CodeSetMetadata metadata = new CodeSetMetadata();
		metadata.setDescription(codeSet.getDescription());
		metadata.setTitle(codeSet.getName());
		info.setDefaultVersion(codeSet.getLatest());
		info.setDisableKeyProtection(codeSet.isDisableKeyProtection());
		List<CodeSetVersionMetadata> codeSetVersionMetadata = getCodeSetVersionMetadata(codeSet)
				.stream()
				.filter((version) -> version.isCommitted() || (includeInProgress && !version.isCommitted()))
				.collect(Collectors.toList());
		List<CodeSetVersionInfo> children = this.toCodeSetVersionInfo(codeSetVersionMetadata, codeSet.getId());
		String latestStableId = getLatestStableId(codeSet, codeSetVersionMetadata);
		if(latestStableId != null) {
			children.forEach((child) -> {
				if(child.getId().equals(latestStableId)) {
					child.setLatestStable(true);
				}
			});
		}
		info.setChildren(children);	
		info.setMetadata(metadata);
		info.setViewOnly(viewOnly);
		info.setPublished(codeSet.getAudience() instanceof PublicAudience);
		return info;
	}

	private String getLatestStableId(CodeSet codeSet, List<CodeSetVersionMetadata> codeSetVersions) {
		if(!Strings.isNullOrEmpty(codeSet.getLatest())) {
			CodeSetVersionMetadata codeSetVersionMetadata = getCodeSetVersionMetadataInCodeSetById(codeSet, codeSet.getLatest());
			if(codeSetVersionMetadata != null) {
				return codeSetVersionMetadata.getId();
			}
		} else {
			CodeSetVersionMetadata mostRecent = getMostRecentlyCommitted(codeSetVersions);
			if(mostRecent != null) {
				return mostRecent.getId();
			}
		}
		return null;
	}

	private List<CodeSetVersionInfo> toCodeSetVersionInfo(List<CodeSetVersionMetadata> codeSetVersionMetadata, String codeSetId) {
		List<CodeSetVersionInfo> children = new ArrayList<>();
		if(codeSetVersionMetadata != null) {
			for (CodeSetVersionMetadata version: codeSetVersionMetadata) {
				CodeSetVersionInfo codeSetVersionInfo = new CodeSetVersionInfo();
				setVersionInfo(version, codeSetVersionInfo, codeSetId);
				children.add(codeSetVersionInfo);
			}
		}
		return children.stream()
                .sorted((v1, v2) -> v2.getDateCreated().compareTo(v1.getDateCreated()))
                .collect(Collectors.toList());
	}

	private void setVersionInfo(CodeSetVersionMetadata version,  CodeSetVersionInfo codeSetVersionInfo, String codeSetId) {
		codeSetVersionInfo.setId(version.getId());
		codeSetVersionInfo.setVersion(version.getVersion());
		codeSetVersionInfo.setComments(version.getComments());
		codeSetVersionInfo.setParentId(codeSetId);
		codeSetVersionInfo.setDateUpdated(version.getDateUpdated());
		codeSetVersionInfo.setDateCreated(version.getDateCreated());
		codeSetVersionInfo.setDateCommitted(version.getDateCommitted());
	}

	@Override
	public CodeSetVersionContent getCodeSetVersionContent(String codeSetId, String codeSetVersionId) throws ResourceNotFoundException {
		CodeSetVersion codeSetVersion = findCodeSetVersion(codeSetId, codeSetVersionId);
		CodeSetVersionContent codeSetVersionContent = new CodeSetVersionContent();
		this.setVersionInfo(codeSetVersion, codeSetVersionContent,  codeSetId);
		if(codeSetVersion.getCodes() != null ) {
			codeSetVersionContent.setCodeSystems(
					codeSetVersion.getCodes().stream()
					              .map(Code::getCodeSystem)
					              .collect(Collectors.toList())
			);
		} else {
			codeSetVersionContent.setCodeSystems(new ArrayList<>());
		}
		codeSetVersionContent.setCodes(codeSetVersion.getCodes());
		return codeSetVersionContent;
	}

	@Override
	public CodeSetVersion saveCodeSetVersionContent(String codeSetId, String versionId, Set<Code> codes) throws ResourceNotFoundException, ForbiddenOperationException {
		CodeSetVersion codeSetVersion =	findCodeSetVersion(codeSetId, versionId);
		if(codeSetVersion.isCommitted()) {
			throw new ForbiddenOperationException("This code set version is already committed.");
		}
		codeSetVersion.setCodes(codes);
		return codeSetVersionRepo.save(codeSetVersion);
	}

	@Override
	public CodeSetVersion findCodeSetVersionById(String id)throws ResourceNotFoundException {
		return this.codeSetVersionRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException(id, Type.CODESETVERSION));
	}

	@Override
	public CodeSet findCodeSetById(String id)throws ResourceNotFoundException {
		return this.codeSetRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException(id, Type.CODESETVERSION));
	}

	@Override
	public CodeSetVersion findCodeSetVersion(String codeSetId, String codeSetVersionId)throws ResourceNotFoundException {
		CodeSet codeSet = this.codeSetRepo.findById(codeSetId).orElseThrow(() -> new ResourceNotFoundException(codeSetId, Type.CODESET));
		if(!codeSet.getCodeSetVersions().contains(codeSetVersionId)) {
			throw new ResourceNotFoundException(codeSetVersionId, Type.CODESETVERSION);
		}
		return findCodeSetVersionById(codeSetVersionId);
	}

	@Override
	public CodeSetVersion commit(
			String codeSetId,
			String codeSetVersionId,
			CodeSetVersionCommit commit
	) throws ResourceNotFoundException, CodeSetCommitException {
		CodeSet codeSet = this.codeSetRepo.findById(codeSetId).orElseThrow(() -> new ResourceNotFoundException(codeSetId, Type.CODESET));
		if(!codeSet.getCodeSetVersions().contains(codeSetVersionId)) {
			throw new ResourceNotFoundException(codeSetVersionId, Type.CODESETVERSION);
		}
		CodeSetVersion codeSetVersion = findCodeSetVersionById(codeSetVersionId);
		// Validate version
		if(commit.getVersion() == null) {
			throw new CodeSetCommitException("CodeSet Version is required.");
		}
		String cleanedVersion = commit.getVersion().trim().toLowerCase();
		if(cleanedVersion.isEmpty()) {
			throw new CodeSetCommitException("CodeSet Version is required.");
		}
		CodeSetVersionMetadata duplicate = getCodeSetVersionMetadata(codeSet).stream().filter((version) -> version.isCommitted() && version.getVersion().equals(cleanedVersion))
		                                  .findFirst()
		                                  .orElse(null);
		if(duplicate != null) {
			throw new CodeSetCommitException("CodeSet Version number "+cleanedVersion+" already exists.");
		}

		// Check if already committed
		if(codeSetVersion.isCommitted()) {
			throw new CodeSetCommitException("CodeSet Version is already committed.");
		}

		codeSetVersion.setVersion(cleanedVersion);
		codeSetVersion.setDateCommitted(new Date());
		codeSetVersion.setComments(commit.getComments());
		codeSetVersionRepo.save(codeSetVersion);
		CodeSetVersion starting = new CodeSetVersion();
		starting.setCodes(codeSetVersion.getCodes());
		starting.setVersion("");
		this.codeSetVersionRepo.save(starting);

		if(commit.isMarkAsLatestStable()) {
			codeSet.setLatest(codeSetVersionId);
		}
		codeSet.getCodeSetVersions().add(starting.getId());
		this.codeSetRepo.save(codeSet);
		return codeSetVersion;
	}

	@Override
	public List<CodeSetListItem> convertToDisplayList(List<CodeSet> codeSets) {
		List<CodeSetListItem> codeSetListItems = new ArrayList<>();
		for (CodeSet codeSet: codeSets) {
			CodeSetListItem element = new CodeSetListItem();
			element.setId(codeSet.getId());
			element.setResourceType(Type.CODESET);
			element.setTitle(codeSet.getName());
			element.setDisableKeyProtection(codeSet.isDisableKeyProtection());
			if(codeSet.getAudience() != null && codeSet.getAudience() instanceof PrivateAudience) {
				element.setSharedUsers(((PrivateAudience) codeSet.getAudience()).getViewers());
				PrivateAudience audience = (PrivateAudience) codeSet.getAudience();
				element.setSharedUsers(audience.getViewers());
				element.setCurrentAuthor(audience.getEditor());
				element.setUsername(audience.getEditor());
			}
			element.setPublished(codeSet.getAudience() instanceof PublicAudience);
			element.setChildren(generateChildrenInfo(codeSet));
			codeSetListItems.add(element);
		}
		return codeSetListItems;
	}

	private List<CodeSetVersionListInfo> generateChildrenInfo(CodeSet codeSet) {
		List<CodeSetVersionListInfo> CodeSetVersionListInfo = new ArrayList<>();
		List<CodeSetVersionMetadata> codeSetVersionMetadataList = getCodeSetVersionMetadata(codeSet);
		for(CodeSetVersionMetadata codeSetVersionMetadata: codeSetVersionMetadataList) {
			if(codeSetVersionMetadata.isCommitted()) {
				CodeSetVersionListInfo info = new CodeSetVersionListInfo();
				info.setDateCommitted(codeSetVersionMetadata.getDateCommitted());
				info.setId(codeSetVersionMetadata.getId());
				info.setVersion(codeSetVersionMetadata.getVersion());
				CodeSetVersionListInfo.add(info);
			}
		}
		return CodeSetVersionListInfo;
	}

	@Override
	public List<CodeSet> findByPrivateAudienceEditor(String username) {
		return this.codeSetRepo.findByPrivateAudienceEditor(username);
	}

	@Override
	public List<CodeSet> findAllPrivateCodeSet() {
		return this.codeSetRepo.findAllPrivateCodeSet();
	}

	@Override
	public List<CodeSet> findByPublicAudienceAndStatusPublished() {
		return this.codeSetRepo.findByPublicAudienceAndStatusPublished();
	}

	@Override
	public List<CodeSet> findByPrivateAudienceViewer(String username) {
		return this.codeSetRepo.findByPrivateAudienceViewer(username);
	}

	@Override
	public CodeSet saveCodeSetContent(String id, CodeSetInfo content) throws Exception {
		CodeSet codeSet = findCodeSetById(id);
		codeSet.setName(content.getMetadata().getTitle());
		codeSet.setDescription(content.getMetadata().getDescription());
		if(!Strings.isNullOrEmpty(content.getDefaultVersion())) {
			List<CodeSetVersionMetadata> codeSetVersionMetadataList = getCodeSetVersionMetadata(codeSet);
			CodeSetVersionMetadata found = codeSetVersionMetadataList.stream().filter((version) -> version.getId().equals(content.getDefaultVersion()))
			                          .findFirst().orElse(null);
			if(found == null || !found.isCommitted()) {
				throw new Exception("Latest stable version is not found.");
			}
		}
		codeSet.setLatest(content.getDefaultVersion());
		codeSet.setDisableKeyProtection(content.isDisableKeyProtection());
		return this.codeSetRepo.save(codeSet);
	}
	
	@Override
	public void updateViewers(String id, List<String> viewers) throws Exception {
		CodeSet codeSet = findCodeSetById(id);
		// The owner can't be in the viewers list
		if(viewers != null) {
			viewers.remove(codeSet.getUsername());
		}

		Audience audience = codeSet.getAudience();

		if(audience instanceof PrivateAudience) {
			((PrivateAudience) audience).setViewers(new HashSet<>(viewers != null ? viewers : new ArrayList<>()));
		} else {
			throw new Exception("Invalid operation");
		}
		this.codeSetRepo.save(codeSet);
	}

	@Override
	public void deleteCodeSet(String codeSetId) throws ResourceNotFoundException {
		CodeSet codeSet = findCodeSetById(codeSetId);
		if(codeSet.getCodeSetVersions() != null) {
			for(String versionId: codeSet.getCodeSetVersions()) {
				this.codeSetVersionRepo.deleteById(versionId);
			}
			this.codeSetRepo.delete(codeSet);
		}
	}

	@Override
	public CodeSet clone(String codeSetId, boolean includeInProgress, String username) throws Exception {
		CodeSet originalCodeSet = findCodeSetById(codeSetId);
		CodeSet clonedCodeSet = new CodeSet();
	    clonedCodeSet.setAudience(new PrivateAudience(AudienceType.PRIVATE, username, new HashSet<>()));
	    clonedCodeSet.setLatest(originalCodeSet.getLatest());
	    clonedCodeSet.setDateUpdated(originalCodeSet.getDateUpdated());
	    clonedCodeSet.setName("[Clone] "+ originalCodeSet.getName());
	    clonedCodeSet.setDescription(originalCodeSet.getDescription());
	    clonedCodeSet.setUsername(username);
		String latestStableId = originalCodeSet.getLatest();
	    Set<String> clonedVersionIds = new HashSet<>();
	    for (String originalVersionId : originalCodeSet.getCodeSetVersions()) {
			CodeSetVersion originalVersion = findCodeSetVersionById(originalVersionId);
			if(originalVersion != null) {
				if((!originalVersion.isCommitted() && includeInProgress) || originalVersion.isCommitted()) {
					CodeSetVersion clonedVersion = this.codeSetVersionRepo.save(this.cloneVersion(originalVersion));
					clonedVersionIds.add(clonedVersion.getId());
					if(latestStableId != null && latestStableId.equals(originalVersionId)) {
						clonedCodeSet.setLatest(clonedVersion.getId());
					}
				}
			}
	    }
		if(!includeInProgress) {
			CodeSetVersionContent latest = getLatestCodeVersion(codeSetId);
			CodeSetVersion starting = new CodeSetVersion();
			starting.setCodes(latest.getCodes());
			starting.setVersion("");
			this.codeSetVersionRepo.save(starting);
			clonedVersionIds.add(starting.getId());
		}

	    clonedCodeSet.setCodeSetVersions(clonedVersionIds);
	    return codeSetRepo.save(clonedCodeSet);
	}

	private CodeSetVersion cloneVersion(CodeSetVersion originalVersion) {
	    CodeSetVersion clonedVersion = new CodeSetVersion();
        clonedVersion.setVersion(originalVersion.getVersion());
        clonedVersion.setDateCommitted(originalVersion.getDateCommitted());
        clonedVersion.setDateCreated(originalVersion.getDateCreated());
        clonedVersion.setDateUpdated(originalVersion.getDateUpdated());
        clonedVersion.setComments(originalVersion.getComments());
        clonedVersion.setCodes(new HashSet<>(originalVersion.getCodes()));
        return clonedVersion;
	}

	@Override
	public CodeSet publish(String id) throws ResourceNotFoundException {
		CodeSet codeSet = findCodeSetById(id);
		codeSet.setAudience(new PublicAudience());
	    return codeSetRepo.save(codeSet);
	}

	@Override
	public CodeSetVersionContent getLatestCodeVersion(String codeSetId) throws Exception {
		CodeSet codeSet = findCodeSetById(codeSetId);
		CodeSetVersion latestCodeSetVersion = null;
		if(!Strings.isNullOrEmpty(codeSet.getLatest())) {
			CodeSetVersion markedLatestCodeSetVersion = findCodeSetVersionById(codeSet.getLatest());
			if(markedLatestCodeSetVersion != null && markedLatestCodeSetVersion.isCommitted()) {
				latestCodeSetVersion = markedLatestCodeSetVersion;
			}
		} else {
			List<CodeSetVersionMetadata> versions = getCodeSetVersionMetadata(codeSet);
			CodeSetVersionMetadata mostRecentlyCommitted = getMostRecentlyCommitted(versions);
			if(mostRecentlyCommitted != null) {
				latestCodeSetVersion = findCodeSetVersionById(mostRecentlyCommitted.getId());
			}
		}

		if(latestCodeSetVersion == null) {
			throw new Exception("No latest version found.");
		}

		CodeSetVersionContent codeSetVersionContent = new CodeSetVersionContent();
		this.setVersionInfo(latestCodeSetVersion, codeSetVersionContent,  codeSetId);
		codeSetVersionContent.setParentName(codeSet.getName());
		codeSetVersionContent.setCodes(latestCodeSetVersion.getCodes());
		return codeSetVersionContent;
	}

	public CodeSetVersionMetadata getMostRecentlyCommitted(List<CodeSetVersionMetadata> versions) {
		return versions.stream().filter(CodeSetVersionMetadata::isCommitted)
		        .max(Comparator.comparing(CodeSetVersionMetadata::getDateCommitted))
		        .orElse(null);
	}

	@Override
	public void deleteCodeSetVersion(String codeSetId, String codeSetVersionId) throws Exception {
		CodeSet codeSet = this.codeSetRepo.findById(codeSetId).orElseThrow(() -> new ResourceNotFoundException(codeSetId, Type.CODESET));
		if(!codeSet.getCodeSetVersions().contains(codeSetVersionId)) {
			throw new ResourceNotFoundException(codeSetVersionId, Type.CODESETVERSION);
		}
		CodeSetVersion codeSetVersion = findCodeSetVersionById(codeSetVersionId);
		if(codeSetVersion.getId().equals(codeSet.getLatest())) {
			throw new Exception("Cannot delete the version marked as latest.");
		}
		if(!codeSetVersion.isCommitted()) {
			throw new Exception("Cannot delete the version in progress.");
		}
		codeSet.getCodeSetVersions().remove(codeSetVersionId);
		this.codeSetRepo.save(codeSet);
		this.codeSetVersionRepo.deleteById(codeSetVersionId);
	}

	@Override
	public List<CodeDelta> getCodeDelta(String codeSetId, String codeSetVersionId, String targetId) throws Exception {
		CodeSet codeSet = findCodeSetById(codeSetId);
		List<CodeSetVersionMetadata> versions = getCodeSetVersionMetadata(codeSet);
		CodeSetVersionMetadata sourceVersion = versions.stream().filter((v) -> v.getId().equals(codeSetVersionId)).findFirst().orElseThrow(() -> new ResourceNotFoundException(codeSetVersionId, Type.CODESETVERSION));
		CodeSetVersionMetadata targetVersion = versions.stream().filter((v) -> v.getId().equals(targetId)).findFirst().orElseThrow(() -> new ResourceNotFoundException(targetId, Type.CODESETVERSION));

		if(!targetVersion.isCommitted()) {
			throw new Exception("You can only compare against a committed version");
		}
		if(sourceVersion.isCommitted() && sourceVersion.getDateCommitted().before(targetVersion.getDateCommitted())) {
			throw new Exception("You can only compare against a previous version");
		}
		CodeSetVersion source = findCodeSetVersionById(sourceVersion.getId());
		CodeSetVersion target = findCodeSetVersionById(targetVersion.getId());
		return compareCodes(source.getCodes(), target.getCodes());
	}

	public List<CodeDelta> compareCodes(Set<Code> source, Set<Code> target) {
		List<CodeDelta> codes = new ArrayList<>();
		Set<Code> targetCopy = new HashSet<>(target);
		for(Code code: source) {
			Code compareTo = findCandidate(targetCopy, code);
			if(compareTo != null) {
				targetCopy.remove(compareTo);
			}
			codes.add(compare(code, compareTo));
		}
		for(Code code: targetCopy) {
			codes.add(compare(null, code));
		}
		return codes;
	}

	public CodeDelta compare(Code source, Code target) {
		CodeDelta delta = new CodeDelta();
		delta.setChange(DeltaChange.NONE);

		// Value
		String sourceValue = source != null ? source.getValue() : null;
		String targetValue = target != null ? target.getValue() : null;
		PropertyDelta<String> value = compareStringValues(sourceValue, targetValue);
		delta.setValue(value);
		setChangeType(delta, value);

		// Code System
		String sourceCodeSystem = source != null ? source.getCodeSystem() : null;
		String targetCodeSystem = target != null ? target.getCodeSystem() : null;
		PropertyDelta<String> codeSystem = compareStringValues(sourceCodeSystem, targetCodeSystem);
		delta.setCodeSystem(codeSystem);
		setChangeType(delta, codeSystem);

		// Description
		String sourceDesc = source != null ? source.getDescription() : null;
		String targetDesc = target != null ? target.getDescription() : null;
		PropertyDelta<String> description = compareStringValues(sourceDesc, targetDesc);
		delta.setDescription(description);
		setChangeType(delta, description);

		// Comments
		String sourceComments = source != null ? source.getComments() : null;
		String targetComments = target != null ? target.getComments() : null;
		PropertyDelta<String> comments = compareStringValues(sourceComments, targetComments);
		delta.setComments(comments);
		setChangeType(delta, comments);

		// Usage
		CodeUsage sourceUsage = source != null ? source.getUsage() : null;
		CodeUsage targetUsage = target != null ? target.getUsage() : null;
		PropertyDelta<CodeUsage> usage = compareCodeUsageValues(sourceUsage, targetUsage);
		delta.setUsage(usage);
		setChangeType(delta, usage);

		// Has Pattern
		Boolean sourceHasPattern = source != null ? source.isHasPattern() : null;
		Boolean targetHasPattern = target != null ? target.isHasPattern() : null;
		PropertyDelta<Boolean> hasPattern = compareBooleanValues(sourceHasPattern, targetHasPattern);
		delta.setHasPattern(hasPattern);
		setChangeType(delta, hasPattern);

		// Pattern
		String sourcePattern = source != null ? source.getPattern() : null;
		String targetPattern = target != null ? target.getPattern() : null;
		PropertyDelta<String> pattern = compareStringValues(sourcePattern, targetPattern);
		delta.setPattern(pattern);
		setChangeType(delta, pattern);

		if(source == null && target != null) {
			delta.setChange(DeltaChange.DELETED);
		} else if(target == null && source != null) {
			delta.setChange(DeltaChange.ADDED);
		}

		return delta;
	}

	public void setChangeType(CodeDelta delta, PropertyDelta propertyDelta) {
		if(!propertyDelta.getChange().equals(DeltaChange.NONE)) {
			delta.setChange(DeltaChange.CHANGED);
		}
	}

	public PropertyDelta<String> compareStringValues(String source, String target) {
		PropertyDelta<String> delta = new PropertyDelta<>(source, target);
		if(Strings.isNullOrEmpty(target) && !Strings.isNullOrEmpty(source)) {
			delta.setChange(DeltaChange.ADDED);
		} else if(!Strings.isNullOrEmpty(target) && Strings.isNullOrEmpty(source)) {
			delta.setChange(DeltaChange.DELETED);
		} else if(Strings.isNullOrEmpty(source) && Strings.isNullOrEmpty(target)) {
			delta.setChange(DeltaChange.NONE);
		} else if(source.equals(target)) {
			delta.setChange(DeltaChange.NONE);
		} else {
			delta.setChange(DeltaChange.CHANGED);
		}
		return delta;
	}

	public PropertyDelta<CodeUsage> compareCodeUsageValues(CodeUsage source, CodeUsage target) {
		PropertyDelta<CodeUsage> delta = new PropertyDelta<>(source, target);
		if(target == null && source != null) {
			delta.setChange(DeltaChange.ADDED);
		} else if(target != null && source == null) {
			delta.setChange(DeltaChange.DELETED);
		} else if(target == null && source == null) {
			delta.setChange(DeltaChange.NONE);
		} else if(source.equals(target)) {
			delta.setChange(DeltaChange.NONE);
		} else {
			delta.setChange(DeltaChange.CHANGED);
		}
		return delta;
	}

	public PropertyDelta<Boolean> compareBooleanValues(Boolean source, Boolean target) {
		PropertyDelta<Boolean> delta = new PropertyDelta<>(source, target);
		if((truthy(target) && truthy(source)) || (falsy(target) && falsy(source))) {
			delta.setChange(DeltaChange.NONE);
		} else {
			delta.setChange(DeltaChange.CHANGED);
		}
		return delta;
	}

	public boolean truthy(Boolean b) {
		return b != null && b;
	}

	public boolean falsy(Boolean b) {
		return b == null || !b;
	}

	public Code findCandidate(Set<Code> list, Code code) {
		List<Code> codeMatch = list.stream().filter((candidate) -> !Strings.isNullOrEmpty(code.getValue()) && !Strings.isNullOrEmpty(candidate.getValue()) && code.getValue().equals(candidate.getValue()))
		                           .collect(Collectors.toList());
		if(codeMatch.size() == 1) {
			return codeMatch.get(0);
		}
		List<Code> codeSystemMatch = codeMatch.stream().filter((candidate) -> !Strings.isNullOrEmpty(code.getCodeSystem()) && !Strings.isNullOrEmpty(candidate.getCodeSystem()) && code.getCodeSystem().equals(candidate.getCodeSystem()))
				.collect(Collectors.toList());
		if(codeSystemMatch.size() == 1) {
			return codeSystemMatch.get(0);
		}
		List<Code> idMatch = codeMatch.stream().filter((candidate) -> !Strings.isNullOrEmpty(code.getId()) && !Strings.isNullOrEmpty(candidate.getId()) && code.getId().equals(candidate.getId()))
		                                      .collect(Collectors.toList());
		if(idMatch.size() == 1) {
			return idMatch.get(0);
		} else if(codeSystemMatch.size() > 1) {
			return codeSystemMatch.get(0);
		} else if(codeMatch.size() > 1) {
			return codeMatch.get(0);
		} else {
			return null;
		}
	}
}
