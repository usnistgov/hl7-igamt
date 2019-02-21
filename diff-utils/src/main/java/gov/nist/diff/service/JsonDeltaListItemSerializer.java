package gov.nist.diff.service;

import java.io.IOException;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import gov.nist.diff.domain.DeltaArray;
import gov.nist.diff.domain.DeltaListItem;
import gov.nist.diff.domain.DeltaNode;
import gov.nist.diff.domain.DeltaNodeSimple;
import gov.nist.diff.domain.DeltaObject;
import gov.nist.diff.service.JsonNodeDeltaSerialize.JsonUnWrappingNodeDeltaSerialize;
import gov.nist.diff.service.JsonSimpleNodeDeltaSerialize.JsonUnWrappingSimpleNodeDeltaSerialize;

public class JsonDeltaListItemSerializer extends JsonSerializer<DeltaListItem> {

  JsonUnWrappingNodeDeltaSerialize objectUnwrap = new JsonUnWrappingNodeDeltaSerialize();
  JsonUnWrappingSimpleNodeDeltaSerialize simpleUnwrap =
      new JsonUnWrappingSimpleNodeDeltaSerialize();



  @Override
  public void serialize(DeltaListItem node, JsonGenerator json, SerializerProvider serializer)
      throws IOException {
    json.writeStartObject();
    serializer.defaultSerializeField("_.deltakey", node.getKey(), json);
    serializer.defaultSerializeField("_.index", node.getIndex(), json);
    DeltaNode object = node.getItem();

    if (object instanceof DeltaObject) {
      this.objectUnwrap.serialize((DeltaObject) object, json, serializer);
    } else if (object instanceof DeltaNodeSimple) {
      this.simpleUnwrap.serialize((DeltaNodeSimple) object, json, serializer);
    } else if (object instanceof DeltaArray) {

    } else {
      serializer.defaultSerializeField("item", object, json);
    }

    json.writeEndObject();

  }

}
