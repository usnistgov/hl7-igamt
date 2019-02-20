package gov.nist.diff.domain;

import java.util.Map;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import gov.nist.diff.service.JsonDeltaListItemSerializer;


@JsonSerialize(using = JsonDeltaListItemSerializer.class)
public class DeltaListItem<T> {

  public static class IndexDelta {
    private int current;
    private int previous;

    public IndexDelta(int current, int previous) {
      super();
      this.current = current;
      this.previous = previous;
    }

    public int getCurrent() {
      return current;
    }

    public void setCurrent(int current) {
      this.current = current;
    }

    public int getPrevious() {
      return previous;
    }

    public void setPrevious(int previous) {
      this.previous = previous;
    }
  }

  private Map<String, String> key;
  private IndexDelta index;
  private DeltaNode<T> item;

  public DeltaListItem(Map<String, String> key, int oldIndex, int currentIndex,
      DeltaNode<T> content) {
    super();
    this.key = key;
    this.index = new IndexDelta(currentIndex, oldIndex);
    this.item = content;
  }

  public DeltaNode<T> getItem() {
    return item;
  }

  public void setItem(DeltaNode<T> content) {
    this.item = content;
  }

  public Map<String, String> getKey() {
    return key;
  }

  public void setKey(Map<String, String> key) {
    this.key = key;
  }

  public IndexDelta getIndex() {
    return index;
  }

  public void setIndex(IndexDelta index) {
    this.index = index;
  }
}
