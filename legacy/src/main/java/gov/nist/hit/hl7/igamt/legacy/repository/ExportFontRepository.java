package gov.nist.hit.hl7.igamt.legacy.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.ExportFont;

@Repository("exportFontRepository")
public interface ExportFontRepository extends MongoRepository<ExportFont, String> {
  
}
