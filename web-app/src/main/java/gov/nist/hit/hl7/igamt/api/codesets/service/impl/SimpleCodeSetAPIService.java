package gov.nist.hit.hl7.igamt.api.codesets.service.impl;

import com.google.common.base.Strings;
import gov.nist.hit.hl7.igamt.access.exception.ResourceNotFoundAPIException;
import gov.nist.hit.hl7.igamt.api.codesets.exception.LatestVersionNotFoundException;
import gov.nist.hit.hl7.igamt.api.codesets.model.*;
import gov.nist.hit.hl7.igamt.api.codesets.service.CodeSetAPIService;
import gov.nist.hit.hl7.igamt.api.codesets.service.model.QueryCodeSetVersionMetadata;
import gov.nist.hit.hl7.igamt.api.security.domain.AccessKey;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.exception.ResourceNotFoundException;
import gov.nist.hit.hl7.igamt.valueset.domain.CodeSet;
import gov.nist.hit.hl7.igamt.valueset.domain.CodeSetVersion;
import gov.nist.hit.hl7.igamt.valueset.repository.CodeSetRepository;
import gov.nist.hit.hl7.igamt.valueset.service.CodeSetService;
import gov.nist.hit.hl7.igamt.workspace.domain.WorkspacePermissionType;
import gov.nist.hit.hl7.igamt.workspace.service.WorkspaceService;
import org.apache.commons.io.IOUtils;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.*;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.lang.reflect.Field;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class SimpleCodeSetAPIService implements CodeSetAPIService {

	@Autowired
	WorkspaceService workspaceService;
	@Autowired
	MongoTemplate mongoTemplate;
	@Autowired
	CodeSetService codeSetService;
	@Autowired
	CodeSetRepository codeSetRepository;

	private final Set<String> codeSetVersionMetadataFields = Arrays.stream(QueryCodeSetVersionMetadata.class.getDeclaredFields())
	                                                        .map(Field::getName)
	                                                        .collect(Collectors.toSet());

	@Override
	public List<CodeSetInfo> getAllUserAccessCodeSet(AccessKey accessKey) {
		List<Criteria> clauses = new ArrayList<>();
		Criteria search = new Criteria();

		// All the public code sets
		clauses.add(Criteria.where("audience.type").is("PUBLIC"));

		// If we have an access key
		if(accessKey != null) {

			// All the user's code sets
			clauses.add(new Criteria().andOperator(
					Criteria.where("audience.type").is("PRIVATE"),
					new Criteria().orOperator(
							Criteria.where("audience.editor").is(accessKey.getUsername()),
							Criteria.where("audience.viewers").is(accessKey.getUsername())
					)

			));

			Map<String, Map<String, WorkspacePermissionType>> workspacesPermissions = workspaceService.getUserWorkspacesPermissions(accessKey.getUsername());
			List<Criteria> workspaces = new ArrayList<>();
			for(String workspaceId: workspacesPermissions.keySet()) {
				Criteria workspace = new Criteria();
				workspace.andOperator(
						Criteria.where("audience.workspaceId").is(workspaceId),
						Criteria.where("audience.folderId").in(workspacesPermissions.get(workspaceId).keySet())
				);
				workspaces.add(workspace);
			}

			// All the user's code sets in an accessible workspace
			clauses.add(
					new Criteria().andOperator(
							Criteria.where("audience.type").is("WORKSPACE"),
							new Criteria().orOperator(
									workspaces.toArray(new Criteria[] {})
							)
					)
			);
		}

		// Filter the resulting code sets to the ones allowed by the access key
		if(accessKey != null && accessKey.getResources() != null && accessKey.getResources().get(Type.CODESET) != null && !accessKey.getResources().get(Type.CODESET).isEmpty()) {
			search.andOperator(
					// All the search clauses
					new Criteria().orOperator(clauses.toArray(new Criteria[] {})),
					// Filter resulting
					Criteria.where("_id").in(accessKey.getResources().get(Type.CODESET))
			);
		} else {
			search.orOperator(clauses.toArray(new Criteria[] {}));
		}

		MatchOperation match = Aggregation.match(search);
		List<CodeSet> codeSets = getCodeSetMetadata(match);
		return codeSets.stream().map(this::getCodeSetInfoFromCodeSetMetadata).collect(Collectors.toList());
	}

	private CodeSetInfo getCodeSetInfoFromCodeSetMetadata(CodeSet codeSet) {
		CodeSetInfo codeSetInfo = new CodeSetInfo();
		codeSetInfo.setName(codeSet.getName());
		codeSetInfo.setId(codeSet.getId());
		codeSetInfo.setLatestStableVersion(getLatestStableVersion(codeSet));
		return codeSetInfo;
	}

	private Version getLatestStableVersion(CodeSet codeSet) {
		if(!Strings.isNullOrEmpty(codeSet.getLatest())) {
			MatchOperation match = Aggregation.match(Criteria.where("_id").is(codeSet.getLatest()));
			QueryCodeSetVersionMetadata versionMetadata = one(getCodeSetVersionMetadata(match));
			if(versionMetadata == null) {
				return null;
			} else {
				Version version = new Version();
				version.setVersion(versionMetadata.getVersion());
				version.setDate(versionMetadata.getDateCommitted());
				version.setId(versionMetadata.getId());
				return version;
			}
		} else if(codeSet.getCodeSetVersions() != null && !codeSet.getCodeSetVersions().isEmpty()) {
			AggregationOperation match = Aggregation.match(new Criteria().andOperator(
					Criteria.where("_id").in(codeSet.getCodeSetVersions()),
					Criteria.where("dateCommitted").ne(null)
			));
			AggregationOperation sort = Aggregation.sort(Sort.Direction.DESC, "dateCommitted");
			AggregationOperation project = Aggregation.project(this.codeSetVersionMetadataFields.toArray(new String[0]));
			Aggregation aggregation = Aggregation.newAggregation(match, sort, Aggregation.limit(1), project);
			AggregationResults<QueryCodeSetVersionMetadata> results = mongoTemplate.aggregate(aggregation, this.mongoTemplate.getCollectionName(CodeSetVersion.class), QueryCodeSetVersionMetadata.class);
			if(results.getUniqueMappedResult() != null) {
				Version version = new Version();
				version.setVersion(results.getUniqueMappedResult().getVersion());
				version.setDate(results.getUniqueMappedResult().getDateCommitted());
				version.setId(results.getUniqueMappedResult().getId());
				return version;
			}
		}
		return null;
	}

	@Override
	public CodeSetMetadata getCodeSetMetadata(String codeSetId) throws ResourceNotFoundAPIException {
		CodeSet codeSet = one(getCodeSetMetadata(Aggregation.match(Criteria.where("_id").is(codeSetId))));
		if(codeSet == null) {
			throw new ResourceNotFoundAPIException("CodeSet with id " + codeSetId + " not found");
		}

		CodeSetMetadata codeSetMetadata = new CodeSetMetadata();
		codeSetMetadata.setId(codeSet.getId());
		codeSetMetadata.setName(codeSet.getName());


		// Get code set versions
		List<Version> versions = new ArrayList<>();
		MatchOperation versionsMatch = Aggregation.match(new Criteria().andOperator(
				Criteria.where("_id").in(codeSet.getCodeSetVersions()),
				Criteria.where("dateCommitted").ne(null)
		));
		List<QueryCodeSetVersionMetadata> versionsResult = getCodeSetVersionMetadata(versionsMatch);
		if(versionsResult != null && !versionsResult.isEmpty()) {
			versionsResult.forEach(result -> {
				Version version = new Version();
				version.setVersion(result.getVersion());
				version.setDate(result.getDateCommitted());
				version.setId(result.getId());
				versions.add(version);
			});
		}
		codeSetMetadata.setVersions(versions);

		// Latest Stable
		if(!Strings.isNullOrEmpty(codeSet.getLatest())){
			assert versionsResult != null;
			QueryCodeSetVersionMetadata latest = versionsResult.stream().filter((version) -> version.getId().equals(codeSet.getLatest())).findFirst().orElse(null);
			if(latest != null) {
				Version version = new Version();
				version.setVersion(latest.getVersion());
				version.setDate(latest.getDateCommitted());
				version.setId(latest.getId());
				codeSetMetadata.setLatestStableVersion(version);
			}
		}

		if(codeSetMetadata.getLatestStableVersion() == null) {
			Version latest = Collections.max(versions, Comparator.comparing(Version::getDate));
			codeSetMetadata.setLatestStableVersion(latest);
		}

		return codeSetMetadata;
	}

	public List<QueryCodeSetVersionMetadata> getCodeSetVersionMetadata(MatchOperation match) {
		AggregationOperation project = Aggregation.project(this.codeSetVersionMetadataFields.toArray(new String[0]));
		Aggregation versionAggregation = Aggregation.newAggregation(match, project);
		AggregationResults<QueryCodeSetVersionMetadata> results = mongoTemplate.aggregate(versionAggregation, this.mongoTemplate.getCollectionName(CodeSetVersion.class), QueryCodeSetVersionMetadata.class);
		return results.getMappedResults();
	}

	public List<CodeSet> getCodeSetMetadata(MatchOperation match) {
		Aggregation aggregation = Aggregation.newAggregation(match);
		AggregationResults<CodeSet> results = this.mongoTemplate.aggregate(aggregation, this.mongoTemplate.getCollectionName(CodeSet.class), CodeSet.class);
		return results.getMappedResults();
	}

	public <T> T one(List<T> results) {
		if(results == null || results.isEmpty()) {
			return null;
		}
		return results.get(0);
	}

	@Override
	public CodeSetQueryResult getCodeSetByQuery(String codeSetId, String version, String value) throws ResourceNotFoundAPIException, LatestVersionNotFoundException {
		CodeSetMetadata codeSetMetadata = getCodeSetMetadata(codeSetId);
		if(codeSetMetadata == null) {
			throw new ResourceNotFoundAPIException("CodeSet with id " + codeSetId + " not found");
		}

		Version targetVersion = null;
		if(!Strings.isNullOrEmpty(version)) {
			targetVersion = codeSetMetadata.getVersions().stream().filter(v -> v.getVersion().equals(version)).findFirst()
					.orElseThrow(() -> new ResourceNotFoundAPIException("CodeSet id " + codeSetId + " with version " + version + " not found"));
		} else if(codeSetMetadata.getLatestStableVersion() != null) {
			targetVersion = codeSetMetadata.getLatestStableVersion();
		} else {
			throw new LatestVersionNotFoundException("Error while trying to determine latest version of code set id "+ codeSetId);
		}

		List<AggregationOperation> pipeline = new ArrayList<>();
		// Match target version
		pipeline.add(Aggregation.match(Criteria.where("_id").is(targetVersion.getId())));
		// Unwind Codes
		pipeline.add(Aggregation.unwind("$codes", true));

		if(!Strings.isNullOrEmpty(value)) {
			// Match Code from list of codes based on pattern or not pattern
			try {
				final String matchCodeQuery = IOUtils.toString(
						Objects.requireNonNull(SimpleCodeSetAPIService.class.getResourceAsStream("/code_match_aggregation.json")),
						StandardCharsets.UTF_8
				).replaceAll("\\{\\{VALUE}}", value);
				pipeline.add(context -> Document.parse(matchCodeQuery));
			} catch(IOException e) {
				throw new RuntimeException(e);
			}
		}

		AggregationOperation projectCodeFields = Aggregation.project()
				.and("$codes.value").as("value")
				.and("$codes.codeSystem").as("codeSystem")
				.and("$codes.description").as("displayText")
				.and("$codes.hasPattern").as("isPattern")
				.and("$codes.pattern").as("regularExpression")
				.and("$codes.usage").as("usage");
		pipeline.add(projectCodeFields);

		Aggregation aggregation = Aggregation.newAggregation(pipeline);
		AggregationResults<ExternalCode> codes = mongoTemplate.aggregate(aggregation, this.mongoTemplate.getCollectionName(CodeSetVersion.class), ExternalCode.class);

		CodeSetQueryResult codeSetQueryResult = new CodeSetQueryResult();
		codeSetQueryResult.setCodeMatchValue(value);
		codeSetQueryResult.setId(codeSetId);
		codeSetQueryResult.setName(codeSetMetadata.getName());
		codeSetQueryResult.setCodes(codes.getMappedResults());
		codeSetQueryResult.setVersion(targetVersion);
		codeSetQueryResult.setLatestStableVersion(codeSetMetadata.getLatestStableVersion());
		codeSetQueryResult.setLatestStable(codeSetMetadata.getLatestStableVersion() != null && codeSetMetadata.getLatestStableVersion().getId().equals(targetVersion.getId()));
		return codeSetQueryResult;
	}

	@Override
	public CodeSetVersionMetadata getCodeSetVersionMetadata(String codeSetId, String version) throws ResourceNotFoundAPIException {
		String cleanedVersion = version.toLowerCase().trim();
		CodeSet codeSet = this.codeSetRepository.findById(codeSetId).orElseThrow(() -> new ResourceNotFoundAPIException("CodeSet with id " + codeSetId + " not found"));
		List<gov.nist.hit.hl7.igamt.valueset.model.CodeSetVersionMetadata> versions = this.codeSetService.getCodeSetVersionMetadata(codeSet);
		gov.nist.hit.hl7.igamt.valueset.model.CodeSetVersionMetadata match = versions.stream().filter((v) -> v.isCommitted() && v.getVersion().equals(cleanedVersion)).findFirst().orElse(null);
		if(match == null) {
			throw new ResourceNotFoundAPIException("CodeSet version '"+ cleanedVersion +"' not found");
		}
		try {
			CodeSetVersion codeSetVersion = this.codeSetService.findCodeSetVersionById(match.getId());
			gov.nist.hit.hl7.igamt.api.codesets.model.CodeSetVersionMetadata metadata = new gov.nist.hit.hl7.igamt.api.codesets.model.CodeSetVersionMetadata();
			metadata.setId(codeSetId);
			metadata.setVersion(cleanedVersion);
			metadata.setDate(codeSetVersion.getDateCommitted());
			metadata.setNumberOfCodes(codeSetVersion.getCodes().size());
			metadata.setName(codeSet.getName());
			return metadata;
		} catch(ResourceNotFoundException e) {
			throw new ResourceNotFoundAPIException("CodeSet version '"+ cleanedVersion +"' not found");
		}

	}
}