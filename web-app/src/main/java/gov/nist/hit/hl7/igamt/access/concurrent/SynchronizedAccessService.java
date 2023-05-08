package gov.nist.hit.hl7.igamt.access.concurrent;

import gov.nist.hit.hl7.igamt.access.common.ResourceAccessInfoFetcher;
import gov.nist.hit.hl7.igamt.access.model.DocumentAccessInfo;
import gov.nist.hit.hl7.igamt.access.model.OpSyncType;
import gov.nist.hit.hl7.igamt.access.model.ResourceInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.exception.ResourceNotFoundException;
import gov.nist.hit.hl7.igamt.ig.service.IgService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;

@Service
public class SynchronizedAccessService {

    @Autowired
    private ResourceAccessInfoFetcher resourceAccessInfoFetcher;
    @Autowired
    private IgService igService;

    private static final String DOCUMENT_SYNC_HEADER = "Document-Sync-Version";

    public static HttpServletRequest getCurrentHttpRequest(){
        RequestAttributes requestAttributes = RequestContextHolder.getRequestAttributes();
        if (requestAttributes instanceof ServletRequestAttributes) {
            return ((ServletRequestAttributes)requestAttributes).getRequest();
        }
        return null;
    }

    public OpSyncType getOperationSyncType(Type type, String id) throws ResourceNotFoundException {
        String currentDocumentSyncToken = getDocumentSyncToken(type, id);
        String retrievedDocumentSyncToken = getRequestDocumentLastUpdate();

        if(currentDocumentSyncToken == null || retrievedDocumentSyncToken == null) {
            return OpSyncType.INCONCLUSIVE;
        } else {
            if(currentDocumentSyncToken.equals(retrievedDocumentSyncToken)) {
                return OpSyncType.SYNC;
            } else {
                return OpSyncType.NOT_SYNC;
            }
        }
    }

    public String getRequestDocumentLastUpdate() {
        HttpServletRequest request = getCurrentHttpRequest();
        if(request == null) {
            return null;
        } else {
            return request.getHeader(DOCUMENT_SYNC_HEADER);
        }
    }

    public String getDocumentSyncToken(Type type, String id) throws ResourceNotFoundException {
        if(resourceAccessInfoFetcher.isDocument(type)) {
            DocumentAccessInfo documentAccessInfo = resourceAccessInfoFetcher.getDocument(type, id);
            return this.igService.getResourceVersionSyncToken(documentAccessInfo.getUpdateDate());
        } else {
            ResourceInfo resourceInfo = resourceAccessInfoFetcher.getResourceInfo(type, id);
            DocumentAccessInfo documentAccessInfo = resourceAccessInfoFetcher.getDocumentAccessInfo(resourceInfo.getDocumentInfo());
            return this.igService.getResourceVersionSyncToken(documentAccessInfo.getUpdateDate());
        }
    }

}
