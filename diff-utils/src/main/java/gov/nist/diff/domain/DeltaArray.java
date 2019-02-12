package gov.nist.diff.domain;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import gov.nist.diff.service.JsonArrayNodeDeltaSerialize;

@JsonSerialize(using = JsonArrayNodeDeltaSerialize.class)
public class DeltaArray<T> extends DeltaNode<T> {

  private List<DeltaListItem<T>> items;

  public DeltaArray(DeltaAction action) {
    super(action);
    this.items = new ArrayList<>();
  }

  public boolean add(DeltaListItem<T> elm) {
    if (elm != null && items.add(elm)) {
      if (elm.getItem().isDiff() && !this.isDiff()) {
        this.setAction(DeltaAction.UPDATED);
      }
      return true;
    }
    return false;
  }

  public boolean addAll(Collection<? extends DeltaListItem<T>> elms) {
    boolean hasNull = elms.stream().filter(node -> node == null).findFirst().isPresent();
    boolean hasDup = elms.stream().distinct().count() != elms.size();
    boolean hasDiff = elms.stream().filter(node -> node.getItem().isDiff()).findFirst().isPresent();

    if (hasNull || hasDup) {
      return false;
    } else {
      if (items.addAll(elms)) {
        if (hasDiff && !this.isDiff()) {
          this.setAction(DeltaAction.UPDATED);
        }
        return true;
      }
      return false;
    }
  }

  public List<DeltaListItem<T>> getItems() {
    return items;
  }


}
