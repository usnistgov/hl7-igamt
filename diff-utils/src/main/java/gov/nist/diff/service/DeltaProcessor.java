package gov.nist.diff.service;

import static org.reflections.ReflectionUtils.getAllFields;
import static org.reflections.ReflectionUtils.withAnnotation;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import java.util.stream.Stream;
import org.apache.commons.lang3.ClassUtils;
import gov.nist.diff.annotation.DeltaField;
import gov.nist.diff.annotation.DeltaIdentity;
import gov.nist.diff.domain.DeltaAction;
import gov.nist.diff.domain.DeltaArray;
import gov.nist.diff.domain.DeltaKey;
import gov.nist.diff.domain.DeltaListItem;
import gov.nist.diff.domain.DeltaMode;
import gov.nist.diff.domain.DeltaNode;
import gov.nist.diff.domain.DeltaNodeSimple;
import gov.nist.diff.domain.DeltaObject;
import gov.nist.diff.exception.UnassignableDeltaFieldException;

public class DeltaProcessor {

  public <T> DeltaObject<T> objectDelta(T a, T b, DeltaMode mode)
      throws IllegalArgumentException, IllegalAccessException, UnassignableDeltaFieldException {
    Class<?> clazz = typeOfAOrB(a, b);
    Set<Field> fields = Stream
        .of(getAllFields(clazz, withAnnotation(DeltaField.class)),
            getAllFields(clazz, withAnnotation(DeltaIdentity.class)))
        .flatMap(Set::stream).collect(Collectors.toSet());

    DeltaObject<T> delta = new DeltaObject<>(this.action(a, b));

    for (Field field : fields) {
      boolean access = field.isAccessible();
      field.setAccessible(true);
      DeltaNode<?> node =
          this.delta(a == null ? null : field.get(a), b == null ? null : field.get(b), mode);
      field.setAccessible(access);
      if (approve(node, mode))
        delta.put(field.getName(), node);
    }
    return delta;
  }

  public <T> DeltaArray<T> arrayDelta(Collection<T> a, Collection<T> b, DeltaMode mode)
      throws IllegalArgumentException, IllegalAccessException, UnassignableDeltaFieldException {
    DeltaArray<T> array = new DeltaArray<>(this.action(a, b));
    Class<?> type = this.collectionClassType(a, b);

    if (type == null)
      return array;

    List<DeltaKey> keyFields = processIdentity(type);

    List<T> aList = a == null ? new ArrayList<>() : new ArrayList<>(a);
    List<T> bList = b == null ? new ArrayList<>() : new ArrayList<>(b);

    List<Map<String, String>> aKeys = this.processIdentity(aList, keyFields);
    List<Map<String, String>> bKeys = this.processIdentity(bList, keyFields);

    List<Integer> matchedB = new ArrayList<>();

    for (int i = 0; i < aKeys.size(); i++) {
      final Map<String, String> matchKey = aKeys.get(i);
      int nIndex = IntStream.range(0, bKeys.size()).filter(j -> bKeys.get(j).equals(matchKey))
          .findFirst().orElse(-1);

      if (nIndex != -1 && !matchedB.contains(nIndex)) {
        DeltaNode<T> node = this.delta(aList.get(i), bList.get(nIndex), mode);
        if (approve(node, mode))
          array.add(new DeltaListItem<>(matchKey, i, i, node));
        matchedB.add(nIndex);
      } else {
        DeltaNode<T> node = this.delta(aList.get(i), null, mode);
        if (approve(node, mode)) {
          matchKey.put("source", "origin");
          array.add(new DeltaListItem<>(matchKey, i, -1, node));
        }
      }
    }

    if (matchedB.size() != bKeys.size()) {
      for (int j = 0; j < bKeys.size(); j++) {
        if (!matchedB.contains(j)) {
          DeltaNode<T> node = this.delta(null, bList.get(j), mode);
          if (approve(node, mode)) {
            bKeys.get(j).put("source", "target");
            array.add(new DeltaListItem<>(bKeys.get(j), -1, j, node));
          }
        }
      }
    }

    return array;
  }

  public <T> DeltaNodeSimple<T> primitiveDelta(T a, T b) throws UnassignableDeltaFieldException {
    Class<?> clazz = typeOfAOrB(a, b);
    if (clazz == null || isPrimitive(clazz)) {
      return new DeltaNodeSimple<T>(a, b);
    } else {
      throw new UnassignableDeltaFieldException();
    }
  }

  public boolean approve(DeltaNode node, DeltaMode mode) {
    return node.isDiff() || (!node.isDiff() && mode.equals(DeltaMode.INCLUSIVE));
  }

  public <T> DeltaNode delta(T a, T b, DeltaMode mode)
      throws UnassignableDeltaFieldException, IllegalArgumentException, IllegalAccessException {
    Class<?> clazz = typeOfAOrB(a, b);
    if (clazz == null || isPrimitive(clazz)) {
      return this.primitiveDelta(a, b);
    } else if (Collection.class.isAssignableFrom(clazz)) {
      return this.arrayDelta((Collection) a, (Collection) b, mode);
    } else {
      return this.objectDelta(a, b, mode);
    }
  }

  private <T> DeltaAction action(T a, T b) {
    return a == null ? b == null ? DeltaAction.NOT_SET : DeltaAction.ADDED
        : b == null ? DeltaAction.DELETED : DeltaAction.UNCHANGED;
  }

  private <T> Class<?> collectionClassType(Collection a, Collection b)
      throws UnassignableDeltaFieldException {
    boolean aIsSet = (a != null && a.size() > 0);
    boolean bIsSet = (b != null && b.size() > 0);

    if (aIsSet && !bIsSet) {
      return typeOf(a);
    }

    if (!aIsSet && bIsSet) {
      return typeOf(b);
    }

    if (aIsSet && bIsSet) {
      Class<?> typeOfA = typeOf(a);
      Class<?> typeOfB = typeOf(b);
      if (!typeOfA.equals(typeOfB))
        throw new UnassignableDeltaFieldException();
      else
        return typeOfA;
    }

    return null;
  }

  private Class<?> typeOf(Collection x) {
    return x.toArray()[0].getClass();
  }

  private static <T> Class<?> typeOfAOrB(T a, T b) {
    return a == null ? b == null ? null : b.getClass() : a.getClass();
  }

  private <T> boolean isPrimitive(Class<T> clazz) {
    return ClassUtils.isPrimitiveOrWrapper(clazz) || String.class.isAssignableFrom(clazz)
        || clazz.isEnum();
  }

  private <T> List<Map<String, String>> processIdentity(List<T> a, List<DeltaKey> keys) {
    List<Map<String, String>> indexes = new ArrayList<>();
    boolean hasKeys = keys != null && keys.size() > 0;
    boolean hasElm = a != null && a.size() > 0;
    if (hasElm) {
      for (int i = 0; i < a.size(); i++) {
        Map<String, String> key = new HashMap<>();
        if (hasKeys) {
          key = processIdentity(a.get(i), keys);
        } else {
          key.put("&index", i + "");
        }
        indexes.add(key);
      }
    }
    return indexes;
  }

  private <T> List<DeltaKey> processIdentity(Class<T> clazz) {
    return getAllFields(clazz, withAnnotation(DeltaIdentity.class)).stream().map(f -> {
      if (isPrimitive(f.getType())) {
        return new DeltaKey(f, null);
      } else {
        return new DeltaKey(f, processIdentity(f.getType()));
      }
    }).collect(Collectors.toList());
  }

  private <T> Map<String, String> processIdentity(T obj, List<DeltaKey> keys) {
    if (obj != null) {
      Map<String, String> map = keys.stream().map(key -> {
        try {
          Field field = key.getField();
          String name = field.getName();
          boolean access = field.isAccessible();
          field.setAccessible(true);
          Object value = field.get(obj);
          field.setAccessible(access);
          if (isPrimitive(value.getClass()) && key.getChildren() == null
              || key.getChildren().size() == 0) {
            Set<Entry<String, String>> set =
                Stream.of(name).collect(Collectors.toMap(n -> n, v -> value.toString())).entrySet();
            return set;
          } else if (key.getChildren() != null && key.getChildren().size() > 0) {
            Set<Entry<String, String>> set =
                this.processIdentity(value, key.getChildren()).entrySet().stream()
                    .collect(Collectors.toMap(e -> name + "." + e.getKey(), e -> e.getValue()))
                    .entrySet();
            return set;
          }
        } catch (IllegalArgumentException | IllegalAccessException e1) {
          return new HashMap<String, String>().entrySet();
        }
        return new HashMap<String, String>().entrySet();
      }).flatMap(Set::stream).collect(Collectors.toMap(e -> e.getKey(), e -> e.getValue()));
      return map;
    }
    return new HashMap<>();
  }



}
