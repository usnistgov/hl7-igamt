package gov.nist.hit.hl7.igamt.access.security;

import gov.nist.hit.hl7.igamt.access.model.AccessLevel;
import gov.nist.hit.hl7.igamt.access.model.DocumentAccessInfo;
import gov.nist.hit.hl7.igamt.access.model.ExportConfigurationInfo;
import gov.nist.hit.hl7.igamt.access.model.ResourceInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.*;
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
import gov.nist.hit.hl7.igamt.workspace.domain.WorkspacePermissionType;
import gov.nist.hit.hl7.igamt.workspace.service.WorkspacePermissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import java.lang.reflect.Field;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AccessControlService {

    @Autowired
    private MongoTemplate mongoTemplate;
    @Autowired
    private WorkspacePermissionService workspacePermissionService;

    private final Set<String> resourceInfoFields = Arrays.stream(ResourceInfo.class.getDeclaredFields())
            .map(Field::getName)
            .collect(Collectors.toSet());
    private final Set<String> documentAccessInfoFields  = Arrays.stream(DocumentAccessInfo.class.getDeclaredFields())
            .map(Field::getName)
            .collect(Collectors.toSet());
    private final Set<String> exportConfigurationInfoFields  = Arrays.stream(ExportConfigurationInfo.class.getDeclaredFields())
            .map(Field::getName)
            .collect(Collectors.toSet());

    public boolean evaluateAccessLevel(Set<AccessLevel> granted, AccessLevel requested) {
        if(granted == null)
            return false;
        if(granted.contains(requested) || granted.contains(AccessLevel.ALL)) {
            return true;
        }
        return false;
    }

    public boolean checkResourceAccessPermission(Type type, String id, UsernamePasswordAuthenticationToken user, AccessLevel requested) throws ResourceNotFoundException {
        if(isDocument(type)) {
            return this.evaluateAccessLevel(this.checkDocumentAccessPermission(getDocument(type, id), user), requested);
        } else {
            return this.evaluateAccessLevel(this.checkResourceAccessPermission(getResourceInfo(type, id), user), requested);
        }
    }

    public Set<AccessLevel> checkDocumentAccessPermission(DocumentAccessInfo document, UsernamePasswordAuthenticationToken user) {
        // If document is published
        if(document.getStatus() != null && document.getStatus().equals(Status.PUBLISHED)) {
            // Grant READ access
            return L(AccessLevel.READ);
        }

        // If document is archived
        if(document.getStatus() != null && document.getStatus().equals(Status.ARCHIVED)) {
            // Grant No access
            return null;
        }

        // If the user is the OWNER of the document
        if(document.getUsername().equals(user.getName())) {
            // Grant ALL access
            return L(AccessLevel.ALL);
        }

        // If the document is shared with the user
        if(document.getSharedUsers() != null && document.getSharedUsers().contains(user.getName())) {
            // Grant READ access
            return L(AccessLevel.READ);
        }

        if(document.getAudience() != null) {
            return this.checkAudience(document.getAudience(), user);
        }

        if(isAdmin(user)) {
            return L(AccessLevel.READ);
        }

        return null;
    }

    public Set<AccessLevel> checkResourceAccessPermission(ResourceInfo resourceInfo, UsernamePasswordAuthenticationToken user) throws ResourceNotFoundException {
        // If the resource is an HL7 resource, can READ only
        if(resourceInfo.getDomainInfo().getScope().equals(Scope.HL7STANDARD)) {
            // Grant READ access
            return L(AccessLevel.READ);
        }

        // If the resource is archived
        if(resourceInfo.getDomainInfo().getScope().equals(Scope.ARCHIVED)) {
            // Grant NO access
            return null;
        }

        // If the resource is a user custom element
        if(resourceInfo.getDomainInfo().getScope().equals(Scope.USERCUSTOM)) {
            // If user is the owner
            if(
                    (resourceInfo.getUsername() != null && resourceInfo.getUsername().equals(user.getName()))
                            ||
                            (resourceInfo.getParticipants() != null && resourceInfo.getParticipants().contains(user.getName()))
            ) {
                // If it's published
                if(resourceInfo.getStatus() != null && resourceInfo.getStatus().equals(Status.PUBLISHED)) {
                    // Grant READ access
                    return L(AccessLevel.READ, AccessLevel.UNLOCK);
                } else {
                    // Grant ALL access
                    return L(AccessLevel.ALL);
                }
            } else {
                return null;
            }
        }

        // If document Info is not available
        if(resourceInfo.getDocumentInfo() == null) {
            // Grant NO access
            return null;
        }

        return this.checkDocumentAccessPermission(
                getDocumentAccessInfo(resourceInfo.getDocumentInfo()),
                user
        );
    }

    public Set<AccessLevel> checkAudience(Audience audience, UsernamePasswordAuthenticationToken user) {
        switch (audience.getType()) {
            case PUBLIC:
                return this.checkPublicAudience((PublicAudience) audience, user);
            case PRIVATE:
                return this.checkPrivateAudience((PrivateAudience) audience, user);
            case WORKSPACE:
                return this.checkWorkspaceAudience((WorkspaceAudience) audience, user);
        }
        return null;
    }

    public Set<AccessLevel> checkPrivateAudience(PrivateAudience audience, UsernamePasswordAuthenticationToken user) {
        // If user is editor
        if(user.getName().equals(audience.getEditor())) {
            // Grant all access
            return L(AccessLevel.ALL);
        }

        // If user is viewer
        if(audience.getViewers().contains(user.getName())) {
            // Grant user access
            return L(AccessLevel.READ);
        }

        return null;
    }

    public Set<AccessLevel> checkPublicAudience(PublicAudience audience, UsernamePasswordAuthenticationToken user) {
        return L(AccessLevel.READ);
    }

    public Set<AccessLevel> checkWorkspaceAudience(WorkspaceAudience audience, UsernamePasswordAuthenticationToken user) {
        WorkspacePermissionType permissionType = this.workspacePermissionService.getWorkspacePermissionTypeByFolder(audience.getWorkspaceId(), user.getName(), audience.getFolderId());
        if (permissionType != null) {
            switch (permissionType) {
                case EDIT:
                    return L(AccessLevel.ALL);
                case VIEW:
                    return L(AccessLevel.READ);
            }
        }
        return null;
    }

    private Set<AccessLevel> L(AccessLevel... levels) {
        return new HashSet<>(Arrays.asList(levels));
    }

    public boolean checkExportConfigurationAccessPermission(String exportConfigurationId, UsernamePasswordAuthenticationToken user, AccessLevel level) throws ResourceNotFoundException {
        ExportConfigurationInfo exportConfigurationInfo = getExportConfigurationInfo(exportConfigurationId);

        if(exportConfigurationInfo.getUsername() != null && !exportConfigurationInfo.getUsername().isEmpty()) {
            // If user is owner
            if(exportConfigurationInfo.getUsername().equals(user.getName())) {
                // Grant ALL access
                return true;
            }
        } else {
            // If configuration is original
            if(exportConfigurationInfo.isOriginal()) {
                // Grant READ access
                return level.equals(AccessLevel.READ);
            }
        }

        return false;
    }

    private ExportConfigurationInfo getExportConfigurationInfo(String id) throws ResourceNotFoundException {
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


    private DocumentAccessInfo getDocument(Type type, String id) throws ResourceNotFoundException {
        switch (type) {
            case DATATYPELIBRARY:
                return this.getDocumentAccessInfo(new DocumentInfo(id, DocumentType.DATATYPELIBRARY));
            case IGDOCUMENT:
                return this.getDocumentAccessInfo(new DocumentInfo(id, DocumentType.IGDOCUMENT));
            default:
                return this.getDocumentAccessInfo(getResourceInfo(type, id).getDocumentInfo());
        }
    }

    private ResourceInfo getResourceInfo(Type type, String id) throws ResourceNotFoundException {
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

    private DocumentAccessInfo getDocumentAccessInfo(DocumentInfo documentInfo) throws ResourceNotFoundException {
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

    private String getDocumentCollectionName(DocumentType type) {
        switch (type) {
            case DATATYPELIBRARY:
                return formatCollectionName(DatatypeLibrary.class);
            case IGDOCUMENT:
                return formatCollectionName(Ig.class);
        }
        throw new IllegalArgumentException("Unhandled type " + type);
    }

    private String formatCollectionName(Class<?> clazz) {
        String name = clazz.getSimpleName();
        return name.substring(0, 1).toLowerCase() + name.substring(1);
    }

    private boolean isDocument(Type type) {
        switch (type) {
            case DATATYPELIBRARY:
            case IGDOCUMENT:
                return true;
            default:
                return false;
        }
    }

    public boolean isAdmin(UsernamePasswordAuthenticationToken user) {
        return user.getAuthorities() != null && user.getAuthorities().stream().anyMatch((a) -> a.getAuthority().equals("ADMIN"));
    }

}