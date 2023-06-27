package gov.nist.hit.hl7.igamt.access.common;

import gov.nist.hit.hl7.igamt.access.model.DocumentAccessInfo;
import gov.nist.hit.hl7.igamt.access.model.ExportConfigurationInfo;
import gov.nist.hit.hl7.igamt.access.model.ResourceInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.DocumentInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.DocumentType;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.exception.ResourceNotFoundException;
import gov.nist.hit.hl7.igamt.compositeprofile.domain.CompositeProfileStructure;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.MessageStructure;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatypeLibrary.domain.DatatypeLibrary;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportConfiguration;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.ProfileComponent;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.workspace.domain.Workspace;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.lang.reflect.Field;
import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ResourceAccessInfoFetcher {

    @Autowired
    private MongoTemplate mongoTemplate;

    private final Set<String> resourceInfoFields = Arrays.stream(ResourceInfo.class.getDeclaredFields())
            .map(Field::getName)
            .collect(Collectors.toSet());
    private final Set<String> documentAccessInfoFields  = Arrays.stream(DocumentAccessInfo.class.getDeclaredFields())
            .map(Field::getName)
            .collect(Collectors.toSet());
    private final Set<String> exportConfigurationInfoFields  = Arrays.stream(ExportConfigurationInfo.class.getDeclaredFields())
            .map(Field::getName)
            .collect(Collectors.toSet());


    public DocumentAccessInfo getDocument(Type type, String id) throws ResourceNotFoundException {
        switch (type) {
            case DATATYPELIBRARY:
                return this.getDocumentAccessInfo(new DocumentInfo(id, DocumentType.DATATYPELIBRARY));
            case IGDOCUMENT:
                return this.getDocumentAccessInfo(new DocumentInfo(id, DocumentType.IGDOCUMENT));
            default:
                return this.getDocumentAccessInfo(getResourceInfo(type, id).getDocumentInfo());
        }
    }

    public ResourceInfo getResourceInfo(Type type, String id) throws ResourceNotFoundException {
        Query query = Query.query(Criteria.where("_id").is(id));
        this.resourceInfoFields.forEach((field) -> {
            query.fields().include(field);
        });
        ResourceInfo resource = this.mongoTemplate.findOne(query, ResourceInfo.class, getResourceCollectionName(type));

        if(resource != null) {
            return resource;
        } else {
            throw new ResourceNotFoundException(id, type);
        }
    }

    public Workspace getWorkspace(String id) throws ResourceNotFoundException {
        Query query = Query.query(Criteria.where("_id").is(id));
        Workspace resource = this.mongoTemplate.findOne(query, Workspace.class, "workspace");

        if(resource != null) {
            return resource;
        } else {
            throw new ResourceNotFoundException(id, Type.WORKSPACE);
        }
    }

    public DocumentAccessInfo getDocumentAccessInfo(DocumentInfo documentInfo) throws ResourceNotFoundException {
        Query query = Query.query(Criteria.where("_id").is(documentInfo.getDocumentId()));
        this.documentAccessInfoFields.forEach((field) -> {
            query.fields().include(field);
        });
        DocumentAccessInfo resource = this.mongoTemplate.findOne(query, DocumentAccessInfo.class, getDocumentCollectionName(documentInfo.getType()));

        if(resource != null) {
            return resource;
        } else {
            throw new ResourceNotFoundException(documentInfo.getDocumentId(),
                    documentInfo.getType().equals(DocumentType.DATATYPELIBRARY) ? Type.DATATYPELIBRARY : Type.IGDOCUMENT
            );
        }
    }

    private String getResourceCollectionName(Type type) {
        switch (type) {
            case SEGMENT:
                return formatCollectionName(Segment.class);
            case DATATYPE:
                return formatCollectionName(Datatype.class);
            case CONFORMANCEPROFILE:
                return formatCollectionName(ConformanceProfile.class);
            case VALUESET:
                return formatCollectionName(Valueset.class);
            case PROFILECOMPONENT:
                return formatCollectionName(ProfileComponent.class);
            case COMPOSITEPROFILE:
                return formatCollectionName(CompositeProfileStructure.class);
            case COCONSTRAINTGROUP:
                return "coconstraints";
            case MESSAGESTRUCTURE:
                return formatCollectionName(MessageStructure.class);
        }
        throw new IllegalArgumentException("Unhandled resource type " + type);
    }

    public ExportConfigurationInfo getExportConfigurationInfo(String id) throws ResourceNotFoundException {
        Query query = Query.query(Criteria.where("_id").is(id));
        this.exportConfigurationInfoFields.forEach((field) -> {
            query.fields().include(field);
        });
        ExportConfigurationInfo resource = this.mongoTemplate.findOne(query, ExportConfigurationInfo.class, formatCollectionName(ExportConfiguration.class));

        if(resource != null) {
            return resource;
        } else {
            throw new ResourceNotFoundException(id, null);
        }
    }

    private String getDocumentCollectionName(DocumentType type) {
        switch (type) {
            case DATATYPELIBRARY:
                return formatCollectionName(DatatypeLibrary.class);
            case IGDOCUMENT:
                return formatCollectionName(Ig.class);
        }
        throw new IllegalArgumentException("Unhandled type " + type);
    }

    public String formatCollectionName(Class<?> clazz) {
        String name = clazz.getSimpleName();
        return name.substring(0, 1).toLowerCase() + name.substring(1);
    }

    public boolean isDocument(Type type) {
        switch (type) {
            case DATATYPELIBRARY:
                return true;
            case IGDOCUMENT:
                return true;
            default:
                return false;
        }
    }
}
