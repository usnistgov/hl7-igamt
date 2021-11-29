/**
 * This software was developed at the National Institute of Standards and Technology by employees of
 * the Federal Government in the course of their official duties. Pursuant to title 17 Section 105
 * of the United States Code this software is not subject to copyright protection and is in the
 * public domain. This is an experimental system. NIST assumes no responsibility whatsoever for its
 * use by other parties, and makes no guarantees, expressed or implied, about its quality,
 * reliability, or any other characteristic. We would appreciate acknowledgement if the software is
 * used. This software can be redistributed and/or modified freely provided that any derivative
 * works bear some notice that they are derived from it, and any modified versions bear some notice
 * that they have been modified.
 */
package gov.nist.hit.hl7.igamt.conformanceprofile.repository;

import java.util.List;
import java.util.Set;

import gov.nist.hit.hl7.igamt.common.base.domain.Status;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import gov.nist.hit.hl7.igamt.conformanceprofile.domain.MessageStructure;


/**
 * @author Abdelghani El Ouakili
 *
 */
@Repository
public interface MessageStructureRepository  extends MongoRepository<MessageStructure, String> {

    public List<MessageStructure> findByIdentifier(String identifier);

    public List<MessageStructure> findByMessageType(String messageType);
    
    public List<MessageStructure> findByStructID(String messageType);

    public List<MessageStructure> findByCustomTrue();

    public List<MessageStructure> findByDomainInfoVersion(String version);

    public List<MessageStructure> findByDomainInfoScope(String scope);

    public List<MessageStructure> findByDomainInfoScopeAndDomainInfoVersion(String scope,
        String verion);

    public List<MessageStructure> findByName(String name);

    public List<MessageStructure> findByDomainInfoScopeAndDomainInfoVersionAndName(String scope,
        String version, String name);

    public List<MessageStructure> findByDomainInfoVersionAndName(String version, String name);

    public List<MessageStructure> findByDomainInfoScopeAndName(String scope, String name);

    @Query(value = "{ '_id' : ?0 }",
        fields = "{name : 1,messageType:1,identifier:1, structID:1, events:1, description:1,_id:1,domainInfo:1}")
    public List<MessageStructure> findDisplayFormat(String id);

    @Query(value = "{ '_id._id' : ?0 }")
    public List<MessageStructure> findLatestById(ObjectId id, Sort sort);

    public MessageStructure findOneById(String key);
    
    public List<MessageStructure> findAllById(List<String> id);

    public List<MessageStructure> findByIdIn(Set<String> ids);

    public List<MessageStructure> findByParticipantsContaining(String username);

    public List<MessageStructure> findByCustomTrueAndParticipantsContaining(String username);

    public List<MessageStructure> findByCustomTrueAndParticipantsContainingAndStatus(String username, Status status);

    public MessageStructure findByCustomTrueAndParticipantsContainingAndId(String username, String id);



}
