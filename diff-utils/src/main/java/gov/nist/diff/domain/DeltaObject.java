package gov.nist.diff.domain;

import java.util.HashMap;
import java.util.Map;
import com.fasterxml.jackson.annotation.JsonUnwrapped;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import gov.nist.diff.service.JsonNodeDeltaSerialize;

@JsonSerialize(using = JsonNodeDeltaSerialize.class)
public class DeltaObject<T> extends DeltaNode<T> {

  @JsonUnwrapped
  private Map<String, DeltaNode> objectDelta;

  public DeltaObject(DeltaAction action) {
    super(action);
    this.objectDelta = new HashMap<>();
  }

  public boolean put(String key, DeltaNode value) {
    if (value != null && !objectDelta.containsKey(key)) {
      objectDelta.put(key, value);
      if (value.isDiff() && !this.isDiff()) {
        this.setAction(DeltaAction.UPDATED);
      }
      return true;
    }
    return false;
  }

  public boolean putAll(Map<? extends String, ? extends DeltaNode> m) {
    boolean hasNull = m.values().stream().filter(node -> node == null).findFirst().isPresent();
    boolean hasDiff = m.values().stream().filter(node -> node.isDiff()).findFirst().isPresent();
    boolean hasDup =
        m.keySet().stream().filter(k -> this.objectDelta.containsKey(k)).findFirst().isPresent();

    if (hasNull || hasDup) {
      return false;
    } else {
      objectDelta.putAll(m);
      if (hasDiff && !this.isDiff()) {
        this.setAction(DeltaAction.UPDATED);
      }
      return true;
    }
  }

  @JsonUnwrapped
  public Map<String, DeltaNode> getObjectDelta() {
    return objectDelta;
  }
}
