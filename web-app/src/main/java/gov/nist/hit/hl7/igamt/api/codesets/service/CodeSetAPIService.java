package gov.nist.hit.hl7.igamt.api.codesets.service;


import com.google.common.base.Strings;
import com.mongodb.BasicDBList;
import com.mongodb.BasicDBObject;
import gov.nist.hit.hl7.igamt.access.exception.ResourceNotFoundAPIException;
import gov.nist.hit.hl7.igamt.api.codesets.model.*;
import gov.nist.hit.hl7.igamt.api.security.domain.AccessKey;
import gov.nist.hit.hl7.igamt.valueset.repository.CodeSetRepository;
import gov.nist.hit.hl7.igamt.workspace.domain.*;
import gov.nist.hit.hl7.igamt.workspace.service.WorkspaceService;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.*;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class CodeSetAPIService {

	@Autowired
	MongoTemplate mongoTemplate;
	@Autowired
	WorkspaceService workspaceService;
	@Autowired
	CodeSetRepository codeSetRepository;

	// Reusable MongoDB Aggregation Query Stages
	private final AggregationOperation mapCodeSetVersionsDBRefToObjectId = context -> {
		BasicDBList arrayElemAtArgs = new BasicDBList();
		arrayElemAtArgs.add(new BasicDBObject("$objectToArray", "$$this"));
		arrayElemAtArgs.add(1);
		return new Document(
				"$project",
				new BasicDBObject(
						"codeSetVersions",
						new BasicDBObject(
								"$map",
								new BasicDBObject(
										"input",
										new BasicDBObject(
												"$map",
												new BasicDBObject("input", "$codeSetVersions")
														.append("in", new BasicDBObject(
																"$arrayElemAt",
																arrayElemAtArgs
														))
										)
								).append("in", "$$this.v")
						)
				).append("name", 1).append("latest", 1).append("dateUpdated", 1)
		);
	};

	private final LookupOperation joinWithCodeSetVersions = Aggregation.lookup(
			"codeSetVersion",
			"codeSetVersions",
			"_id",
			"versions"
	);

	public List<CodeSetInfo> getAllUserAccessCodeSet(AccessKey accessKey) {
		Criteria cases = new Criteria();
		Criteria privateCodeSet = new Criteria();
		Criteria editorOrViewer = new Criteria();
		Criteria workspace = new Criteria();
		Criteria workspaceOptions = new Criteria();
		Map<String, Map<String, WorkspacePermissionType>> workspacesPermissions = workspaceService.getUserWorkspacesPermissions(accessKey.getUsername());
		List<Criteria> workspaceAudiences = new ArrayList<>();
		for(String workspaceId: workspacesPermissions.keySet()) {
			Criteria workspaceMatch = new Criteria();
			workspaceMatch.andOperator(
					Criteria.where("audience.workspaceId").is(workspaceId),
					Criteria.where("audience.folderId").in(workspacesPermissions.get(workspaceId).keySet())
			);
			workspaceAudiences.add(workspaceMatch);
		}

		cases.orOperator(
				// Private Editor or Viewer
				privateCodeSet.andOperator(
						Criteria.where("audience.type").is("PRIVATE"),
						editorOrViewer.orOperator(
								Criteria.where("audience.editor").is(accessKey.getUsername()),
								Criteria.where("audience.viewers").is(accessKey.getUsername())
						)

				),
				// Public
				Criteria.where("audience.type").is("PUBLIC"),
				// Workspace
				workspace.andOperator(
						Criteria.where("audience.type").is("WORKSPACE"),
						workspaceOptions.orOperator(
								workspaceAudiences.toArray(new Criteria[] {})
						)
				)
		);

		List<AggregationOperation> pipeline = new ArrayList<>();
		// Filter by user
		MatchOperation filterByUser = Aggregation.match(cases);
		pipeline.add(filterByUser);
		// Get the latest version $latestVersion
		this.lookupLatestVersion(pipeline);
		// Project Code Set Info Fields
		AggregationOperation projectFields = context -> new Document(
				"$project",
				new BasicDBObject(
						"latestStableVersion",
						new BasicDBObject("version", "$latestVersion.version")
								.append("date", "$latestVersion.dateCommitted")
				)
				 .append("name", "$name")
		);
		pipeline.add(projectFields);

		Aggregation aggregation = Aggregation.newAggregation(CodeSetQueryResult.class, pipeline);
		AggregationResults<CodeSetInfo> results = mongoTemplate.aggregate(aggregation, "codeSet", CodeSetInfo.class);
		return results.getMappedResults();
	}

	public CodeSetMetadata getCodeSetMetadata(String codeSetId) throws ResourceNotFoundAPIException {
		List<AggregationOperation> pipeline = new ArrayList<>();
		matchCodeSetAndLookupLatestVersionAndVersionList(pipeline, codeSetId);

		// Project Code Set Info Fields
		AggregationOperation projectFields = context -> new Document(
				"$project",
				new BasicDBObject(
						"latestStableVersion",
						new BasicDBObject("version", "$latestVersion.version")
								.append("date", "$latestVersion.dateCommitted")
				)
						.append("name", "$name")
						.append("versions", new BasicDBObject(
								"$map",
								new BasicDBObject(
										"input",
										new BasicDBObject(
												"$filter",
												new BasicDBObject("input", "$versions")
														.append("as", "version")
														.append(
																"cond",
																new BasicDBObject(
																		"$ne",
																		list(
																				new BasicDBObject(
																						"$ifNull",
																						list("$$version.dateCommitted", false)
																				),
																				false
																		)
																))
										))
										.append(
												"in",
												new BasicDBObject("version", "$$this.version")
														.append("date", "$$this.dateCommitted")
										)
						))
		);
		pipeline.add(projectFields);

		Aggregation aggregation = Aggregation.newAggregation(CodeSetQueryResult.class, pipeline);
		AggregationResults<CodeSetMetadata> results = mongoTemplate.aggregate(aggregation, "codeSet", CodeSetMetadata.class);
		List<CodeSetMetadata> queryList = results.getMappedResults();
		if(queryList.size() != 1) {
			throw new ResourceNotFoundAPIException("Code set (id='"+codeSetId+"') not found.");
		}
		return queryList.get(0);
	}

	public CodeSetQueryResult getCodeSetByQuery(String codeSetId, String version, String value) throws ResourceNotFoundAPIException {
		List<AggregationOperation> pipeline = new ArrayList<>();

		matchCodeSetAndLookupLatestVersionAndVersionList(pipeline, codeSetId);

		// Filter version to either the selected one of the latest
		ComparisonOperators.Eq versionValue;
		if(Strings.isNullOrEmpty(version)) {
			versionValue = ComparisonOperators.Eq.valueOf("elm._id").equalToValue("$latestId");
		} else {
			versionValue = ComparisonOperators.Eq.valueOf("elm.version").equalToValue(version);
		}

		ComparisonOperators.Ne dateCommittedNotNull =
				ComparisonOperators.valueOf(
						ConditionalOperators.ifNull("elm.dateCommitted").then(false)
				).notEqualToValue(false);

		ProjectionOperation filterVersion = Aggregation.project().and(
				ArrayOperators.Filter.filter("$versions")
				                     .as("elm")
				                     .by(
											 BooleanOperators.And.and(versionValue, dateCommittedNotNull)
				                     )
		).as("versions").and("name").as("name").and("latestVersion").as("latestVersion");
		pipeline.add(filterVersion);

		// Unwind $versions
		pipeline.add(Aggregation.unwind("$versions", true));

		// Add Codes Field
		AggregationOperation codes = context -> {
			BasicDBObject latestId = new BasicDBObject(
					"codes",
					"$versions.codes"
			);
			return new Document(
					"$addFields",
					latestId
			);
		};
		pipeline.add(codes);

		if(!Strings.isNullOrEmpty(value)) {
			// Match Code from list of codes based on pattern or not pattern
			AggregationOperation matchCode = context -> {
				BasicDBList concatArray = new BasicDBList();
				concatArray.add("^");
				concatArray.add("$$code.pattern");
				concatArray.add(new BasicDBObject("$literal", "$"));
				BasicDBList andNotPattern = new BasicDBList();
				andNotPattern.add(new BasicDBObject(
						"$eq",
						list("$$code.hasPattern", false)
				));
				andNotPattern.add(new BasicDBObject(
						"$eq",
						list("$$code.value", value)
				));

				BasicDBList andPattern = new BasicDBList();
				andPattern.add(new BasicDBObject(
						"$eq",
						list("$$code.hasPattern", true)
				));
				andPattern.add(
					new BasicDBObject(
							"$regexMatch",
							new BasicDBObject("input", value)
									.append(
											"regex",
											new BasicDBObject(
													"$concat",
													concatArray
											)
									)
					)
				);
				BasicDBList orPattern = new BasicDBList();
				orPattern.add(new BasicDBObject("$and", andNotPattern));
				orPattern.add(new BasicDBObject("$and", andPattern));
				BasicDBObject codesFilter = new BasicDBObject(
						"$filter",
						new BasicDBObject(
								"input",
								"$codes"
						).append("as", "code")
						 .append("cond", new BasicDBObject("$or", orPattern))
				);
				BasicDBObject ifNull = new BasicDBObject(
						"$ifNull",
						list(codesFilter, new BasicDBList())
				);
				return new Document(
						"$addFields",
						new BasicDBObject(
							"codes",
							ifNull
						)
				);
			};
			pipeline.add(matchCode);
		}

		AggregationOperation projectFields = context -> new Document(
					"$project",
					new BasicDBObject(
							"latestStableVersion",
							new BasicDBObject("version", "$latestVersion.version")
									.append("date", "$latestVersion.dateCommitted")
					).append(
							"version",
							new BasicDBObject("version", "$versions.version")
									.append("date", "$versions.dateCommitted")
					).append("codeMatchValue", value)
							.append("name", "$name")
							.append("codes", new BasicDBObject(
									"$map",
									new BasicDBObject("input", "$codes")
											.append(
													"in",
													new BasicDBObject("value", "$$this.value")
															.append("displayText", "$$this.description")
															.append("usage", "$$this.usage")
															.append("isPattern", "$$this.hasPattern")
															.append("regularExpression", "$$this.pattern")
															.append("codeSystem", "$$this.codeSystem")
											)
							))
			);

		pipeline.add(projectFields);

		Aggregation aggregation = Aggregation.newAggregation(CodeSetQueryResult.class, pipeline);
		AggregationResults<CodeSetQueryResult> results = mongoTemplate.aggregate(aggregation, "codeSet", CodeSetQueryResult.class);
		List<CodeSetQueryResult> queryList = results.getMappedResults();
		if(queryList.size() != 1) {
			throw new ResourceNotFoundAPIException("Code set (id='"+codeSetId+"') not found.");
		} else {
			CodeSetQueryResult result = queryList.get(0);
			if(result.getVersion() == null || result.getVersion().getVersion() == null && !Strings.isNullOrEmpty(version)) {
				throw new ResourceNotFoundAPIException("Code set version "+version+" not found.");
			} else {
				result.setLatestStable(result.getVersion().equals(result.getLatestStableVersion()));
				return result;
			}
		}
	}

	BasicDBList list(Object... elms) {
		BasicDBList basicDBList = new BasicDBList();
		basicDBList.addAll(Arrays.asList(elms));
		return basicDBList;
	}

	void matchCodeSetAndLookupLatestVersionAndVersionList(List<AggregationOperation> pipeline, String codeSetId) {
		// Select the code set by ID
		MatchOperation selectCodeSetById = Aggregation.match(Criteria.where("id").is(codeSetId));
		pipeline.add(selectCodeSetById);
		// Map the code set's version's array DBRef -> Object ID
		pipeline.add(mapCodeSetVersionsDBRefToObjectId);
		// Join Code Set to Code Set Version using ObjectId (as versions)
		pipeline.add(joinWithCodeSetVersions);
		// Get latest version as $latestVersion
		this.lookupLatestVersion(pipeline);
	}

	void lookupLatestVersion(List<AggregationOperation> pipeline) {
		// Transform latest to Object ID
		AggregationOperation latestToObjID = context -> {
			BasicDBObject latestId = new BasicDBObject(
					"latestId",
					new BasicDBObject(
							"$toObjectId",
							"$latest"
					)
			);
			return new Document(
					"$addFields",
					latestId
			);
		};
		pipeline.add(latestToObjID);
		// Lookup latest version
		LookupOperation latestJoinWithCodeSetVersions = Aggregation.lookup(
				"codeSetVersion",
				"latestId",
				"_id",
				"latestVersion"
		);
		pipeline.add(latestJoinWithCodeSetVersions);
		pipeline.add(Aggregation.unwind("$latestVersion"));
	}
}