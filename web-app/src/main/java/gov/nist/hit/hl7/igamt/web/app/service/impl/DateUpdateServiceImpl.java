package gov.nist.hit.hl7.igamt.web.app.service.impl; 
 
import java.util.Date; 
 
import org.bson.types.ObjectId; 
import org.springframework.beans.factory.annotation.Autowired; 
import org.springframework.data.mongodb.core.MongoTemplate; 
import org.springframework.data.mongodb.core.query.Criteria; 
import org.springframework.data.mongodb.core.query.Query; 
import org.springframework.data.mongodb.core.query.Update; 
import org.springframework.stereotype.Service; 
 
import gov.nist.hit.hl7.igamt.common.base.domain.DocumentInfo; 
import gov.nist.hit.hl7.igamt.common.base.domain.DocumentType; 
import gov.nist.hit.hl7.igamt.datatypeLibrary.domain.DatatypeLibrary; 
import gov.nist.hit.hl7.igamt.datatypeLibrary.service.DatatypeLibraryService; 
import gov.nist.hit.hl7.igamt.ig.domain.Ig; 
import gov.nist.hit.hl7.igamt.ig.service.IgService; 
import gov.nist.hit.hl7.igamt.web.app.service.DateUpdateService; 
 
@Service 
public class DateUpdateServiceImpl implements DateUpdateService { 
 
	@Autowired 
	DatatypeLibraryService datatypeLibraryService; 
 
	@Autowired 
	IgService igService; 
 
 
	@Autowired 
	MongoTemplate mongoTemplate; 
 
 
	@Override 
	public void updateDate(DocumentInfo info) { 
 
		Query query = new Query(); 
		query.addCriteria(Criteria.where("_id").is(new ObjectId(info.getDocumentId()))); 
		Update update = new Update(); 
		update.set("updateDate", new Date()); 
 
		if(info.getType().equals(DocumentType.DATATYPELIBRARY)) { 
			mongoTemplate.updateFirst(query, update, DatatypeLibrary.class); 
 
		}else if(info.getType().equals(DocumentType.IGDOCUMENT)) { 
			mongoTemplate.updateFirst(query, update, Ig.class); 
		} 
 
	} 
 
} 
