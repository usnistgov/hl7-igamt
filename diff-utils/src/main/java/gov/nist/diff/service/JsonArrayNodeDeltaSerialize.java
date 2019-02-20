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
    serializer.defaultSerializeValue(object.getItems(), json);
  }

}
