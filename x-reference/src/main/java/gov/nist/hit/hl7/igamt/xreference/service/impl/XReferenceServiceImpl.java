package gov.nist.hit.hl7.igamt.xreference.service.impl;

import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;

import com.mongodb.BasicDBObject;

import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.xreference.service.XReferenceService;
import gov.nist.hit.hl7.igamt.xreference.util.CustomAggregationOperation;

@Service
public class XReferenceServiceImpl implements XReferenceService {

  private Aggregation getDatatypeReferencersAggregation(Datatype datatype) {
    return newAggregation(match(Criteria.where("id").is(datatype.getId().getId())),
        new CustomAggregationOperation(new BasicDBObject("$graphLookup",
            new BasicDBObject("from", "datatype").append("connectFromField", "_id")
                .append("connectToField", "datatype._id").append("as", "results"))));
  }

}
