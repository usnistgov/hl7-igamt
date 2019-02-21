package gov.nist.diff.service;

import java.io.IOException;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import gov.nist.diff.domain.DeltaAction;
import gov.nist.diff.domain.DeltaNodeSimple;

public class JsonSimpleNodeDeltaSerialize extends JsonSerializer<DeltaNodeSimple<?>> {

  public static class JsonUnWrappingSimpleNodeDeltaSerialize
      extends JsonSerializer<DeltaNodeSimple<?>> {

    @Override
    public void serialize(DeltaNodeSimple<?> object, JsonGenerator json,
        SerializerProvider serializer) throws IOException {
      if (object.getAction().equals(DeltaAction.NOT_SET)) {
        serializer.defaultSerializeValue(null, json);
      } else {
        json.writeStringField("_.operation", object.getAction().toString());
        json.writeBooleanField("_.diff", object.isDiff());
        serializer.defaultSerializeField("current", object.getNew(), json);
        serializer.defaultSerializeField("previous", object.getOld(), json);
      }
    }
  }

  private final JsonSerializer<DeltaNodeSimple<?>> delegate =
      new JsonUnWrappingSimpleNodeDeltaSerialize();


  @Override
  public void serialize(DeltaNodeSimple<?> object, JsonGenerator json,
      SerializerProvider serializer) throws IOException {
    if (object.getAction().equals(DeltaAction.NOT_SET)) {
      serializer.defaultSerializeValue(null, json);
    } else {
      json.writeStartObject();
      this.delegate.serialize(object, json, serializer);
      json.writeEndObject();
    }
  }

}

