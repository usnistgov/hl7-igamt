package gov.nist.diff.service;

import java.io.IOException;
import java.util.Map.Entry;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import gov.nist.diff.domain.DeltaNode;
import gov.nist.diff.domain.DeltaObject;

public class JsonNodeDeltaSerialize extends JsonSerializer<DeltaObject<?>> {

  public static class JsonUnWrappingNodeDeltaSerialize extends JsonSerializer<DeltaObject<?>> {

    @Override
    public void serialize(DeltaObject<?> object, JsonGenerator json, SerializerProvider serializer)
        throws IOException {
      json.writeStringField("_.operation", object.getAction().toString());
      json.writeBooleanField("_.diff", object.isDiff());
      for (Entry<String, DeltaNode> entry : object.getObjectDelta().entrySet()) {
        serializer.defaultSerializeField(entry.getKey(), entry.getValue(), json);
      }
    }
  }

  private final JsonSerializer<DeltaObject<?>> delegate = new JsonUnWrappingNodeDeltaSerialize();

  @Override
  public void serialize(DeltaObject<?> object, JsonGenerator json, SerializerProvider serializer)
      throws IOException {
    json.writeStartObject();
    this.delegate.serialize(object, json, serializer);
    json.writeEndObject();
  }

}
