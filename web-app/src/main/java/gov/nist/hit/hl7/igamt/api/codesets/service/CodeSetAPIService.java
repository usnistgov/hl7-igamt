package gov.nist.hit.hl7.igamt.api.codesets.service;


import com.google.common.base.Strings;
import com.mongodb.BasicDBList;
import com.mongodb.BasicDBObject;
import gov.nist.hit.hl7.igamt.api.codesets.model.Code;
import gov.nist.hit.hl7.igamt.api.codesets.model.CodeSetInfo;
import gov.nist.hit.hl7.igamt.api.codesets.model.CodeSetMetadata;
import gov.nist.hit.hl7.igamt.api.codesets.model.CodeSetVersionInfo;
import gov.nist.hit.hl7.igamt.valueset.domain.CodeSet;
import gov.nist.hit.hl7.igamt.valueset.repository.CodeSetRepository;
import gov.nist.hit.hl7.igamt.workspace.domain.*;
import gov.nist.hit.hl7.igamt.workspace.service.WorkspaceService;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.*;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

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
				).append("name", 1).append("latest", 1)
		);
	};
	private final LookupOperation joinWithCodeSetVersions = Aggregation.lookup(
			"codeSetVersion",
			"codeSetVersions",
			"_id",
			"versions"
	);
	private final UnwindOperation unwindVersions = Aggregation.unwind("$versions");
	private final UnwindOperation unwindCodes = Aggregation.unwind("$versions.codes");
	private final ProjectionOperation projectCodeFields = Aggregation.project(
			Fields
					.fields()
					.and(Fields.field("value", "$versions.codes.value"))
					.and(Fields.field("codeSystem", "$versions.codes.codeSystem"))
					.and(Fields.field("displayText", "$versions.codes.description"))
					.and(Fields.field("usage", "$versions.codes.usage"))
					.and(Fields.field("isPattern", "$versions.codes.hasPattern"))
					.and(Fields.field("regularExpression", "$versions.codes.pattern"))
	);



	public List<CodeSetInfo> getAllUserAccessCodeSet(String username) {
		Criteria cases = new Criteria();
		Criteria privateCodeSet = new Criteria();
		Criteria editorOrViewer = new Criteria();
		Criteria workspace = new Criteria();
		Criteria workspaceOptions = new Criteria();
		Map<String, Map<String, WorkspacePermissionType>> workspacesPermissions = workspaceService.getUserWorkspacesPermissions(username);
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
								Criteria.where("audience.editor").is(username),
								Criteria.where("audience.viewers").is(username)
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

		Query query = Query.query(cases);
		List<CodeSet> codeSets = this.mongoTemplate.find(query, CodeSet.class);
		return codeSets.stream().map((cs) -> new CodeSetInfo(
				cs.getId(),
				cs.getName(),
				cs.getDateUpdated(),
				cs.getLatest()
		)).collect(Collectors.toList());
	}

	public CodeSetMetadata getCodeSetMetadata(String id) {
		CodeSet codeSet = this.codeSetRepository.findById(id).orElse(null);
		if(codeSet != null) {
			return new CodeSetMetadata(
					codeSet.getId(),
					codeSet.getName(),
					codeSet.getDateUpdated(),
					codeSet.getLatest(),
					codeSet.getCodeSetVersions().stream().map((v) -> new CodeSetVersionInfo(
							v.getVersion(),
							v.getDateCommitted(),
							v.getCodes().size()
					)).collect(Collectors.toList())
			);
		} else {
			return null;
		}
	}

	public List<Code> getCodeMatches(String codeSetId, String version, String value) {
		List<AggregationOperation> pipeline = new ArrayList<>();

		// Select the code set by ID
		MatchOperation selectCodeSetById = Aggregation.match(Criteria.where("id").is(codeSetId));
		pipeline.add(selectCodeSetById);
		// Map the code set's version's array DBRef -> Object ID
		pipeline.add(mapCodeSetVersionsDBRefToObjectId);
		// Join Code Set to Code Set Version using ObjectId (as versions)
		pipeline.add(joinWithCodeSetVersions);

		// Filter version to either the selected one of the latest
		ComparisonOperators.Eq versionValue;
		if(Strings.isNullOrEmpty(version)) {
			versionValue = ComparisonOperators.Eq.valueOf("elm.version").equalToValue("$latest");
		} else {
			versionValue = ComparisonOperators.Eq.valueOf("elm.version").equalToValue(version);
		}
		ProjectionOperation filterVersion = Aggregation.project().and(
				ArrayOperators.Filter.filter("$versions")
				                     .as("elm")
				                     .by(versionValue)
		).as("versions");
		pipeline.add(filterVersion);

		// Unwind $versions
		pipeline.add(unwindVersions);
		// Unwind codes
		pipeline.add(unwindCodes);

		if(!Strings.isNullOrEmpty(value)) {
			// Match Code from list of codes based on pattern or not pattern
			AggregationOperation matchCode = context -> {
				BasicDBList concatArray = new BasicDBList();
				concatArray.add("^");
				concatArray.add("$versions.codes.pattern");
				concatArray.add(new BasicDBObject("$literal", "$"));
				BasicDBList andNotPattern = new BasicDBList();
				andNotPattern.add(new BasicDBObject("versions.codes.hasPattern", false));
				andNotPattern.add(new BasicDBObject("versions.codes.value", value));
				BasicDBList andPattern = new BasicDBList();
				andPattern.add(new BasicDBObject("versions.codes.hasPattern", true));
				andPattern.add(
						new BasicDBObject(
								"$expr",
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
						)
				);
				BasicDBList orPattern = new BasicDBList();
				orPattern.add(new BasicDBObject("$and", andNotPattern));
				orPattern.add(new BasicDBObject("$and", andPattern));
				return new Document(
						"$match",
						new BasicDBObject("$or", orPattern)
				);
			};
			pipeline.add(matchCode);
		}

		// Project Code Fields
		pipeline.add(projectCodeFields);

		Aggregation aggregation = Aggregation.newAggregation(CodeSet.class, pipeline);
		AggregationResults<Code> results = mongoTemplate.aggregate(aggregation, "codeSet", Code.class);
		return results.getMappedResults();
	}
}