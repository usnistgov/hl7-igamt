package gov.nist.diff.service;

import java.io.IOException;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import gov.nist.diff.domain.DeltaArray;

public class JsonArrayNodeDeltaSerialize extends JsonSerializer<DeltaArray<?>> {


  @Override
  public void serialize(DeltaArray<?> object, JsonGenerator json, SerializerProvider serializer)
      throws IOException {
    // json.writeStartArray();
    // json.writeStringField("_.operation", object.getAction().toString());
    // json.writeBooleanField("_.diff", object.isDiff());
    // System.out.println(serializer.get);
    serializer.defaultSerializeValue(object.getItems(), json);
    // json.writeEndArray();
  }

}
