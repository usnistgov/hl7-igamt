package gov.nist.hit.hl7.igamt.xreference.util;

import org.springframework.data.mongodb.core.aggregation.AggregationOperation;
import org.springframework.data.mongodb.core.aggregation.AggregationOperationContext;

import com.mongodb.DBObject;

public class CustomAggregationOperation implements AggregationOperation {
  private DBObject operation;

  public CustomAggregationOperation(DBObject operation) {
    this.operation = operation;
  }

  @Override
  public DBObject toDBObject(AggregationOperationContext context) {
    return context.getMappedObject(operation);
  }
}
