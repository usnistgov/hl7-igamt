package gov.nist.diff.service;

import static org.reflections.ReflectionUtils.getAllFields;
import static org.reflections.ReflectionUtils.withAnnotation;

import java.lang.reflect.Field;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import java.util.stream.Stream;

import com.google.common.collect.Sets;
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

    public enum CompareType {
        PRIMITIVE, COLLECTION, OBJECT
    }

    // Calculates DELTA between to objects
    public <T> DeltaObject<T> objectDelta(T a, T b, DeltaMode mode)
            throws IllegalArgumentException, IllegalAccessException, UnassignableDeltaFieldException {

        // Get Classes of each object
        Class<?> classOfA = a == null ? null : a.getClass();
        Class<?> classOfB = b == null ? null : b.getClass();

        // Get List of DELTA Fields for A
        Set<Field> fieldsOfA = classOfA == null ? new HashSet<>() : Stream
                .of(
                        getAllFields(classOfA, withAnnotation(DeltaField.class)),
                        getAllFields(classOfA, withAnnotation(DeltaIdentity.class))
                )
                .flatMap(Set::stream).collect(Collectors.toSet());

        // Get List of DELTA Fields for B
        Set<Field> fieldsOfB = classOfB == null ? new HashSet<>() : Stream
                .of(
                        getAllFields(classOfB, withAnnotation(DeltaField.class)),
                        getAllFields(classOfB, withAnnotation(DeltaIdentity.class))
                )
                .flatMap(Set::stream).collect(Collectors.toSet());

        // Calculate DELTA Fields in common
        Set<Field> intersection = Sets.intersection(fieldsOfA, fieldsOfB);

        // Calculate DELTA Fields unique to A
        Set<Field> uniqueA = Sets.difference(fieldsOfA, intersection);

        // Calculate DELTA Fields unique to B
        Set<Field> uniqueB = Sets.difference(fieldsOfB, intersection);

        // Init a DELTA Object
        DeltaObject<T> delta = new DeltaObject<>(this.action(a, b));

        // Calculate DELTA for fields in common
        for (Field commonField : intersection) {
            boolean access = commonField.isAccessible();
            commonField.setAccessible(true);
            DeltaNode<?> node =
                    this.delta(a == null ? null : commonField.get(a), b == null ? null : commonField.get(b), mode);
            commonField.setAccessible(access);
            if (approve(node, mode))
                delta.put(commonField.getName(), node);
        }

        // Calculate DELTA for fields unique to A
        for (Field fieldOfA : uniqueA) {
            boolean access = fieldOfA.isAccessible();
            fieldOfA.setAccessible(true);
            DeltaNode<?> node =
                    this.delta(a == null ? null : fieldOfA.get(a), null, mode);
            fieldOfA.setAccessible(access);
            delta.put(fieldOfA.getName(), node);
        }

        // Calculate DELTA for fields unique to B
        for (Field fieldOfB : uniqueB) {
            boolean access = fieldOfB.isAccessible();
            fieldOfB.setAccessible(true);
            DeltaNode<?> node =
                    this.delta(null, b == null ? null : fieldOfB.get(b), mode);
            fieldOfB.setAccessible(access);
            delta.put(fieldOfB.getName(), node);
        }
        return delta;
    }

    // Calculates DELTA between two Collections
    private <T> DeltaArray<T> arrayDelta(Collection<T> a, Collection<T> b, DeltaMode mode)
            throws IllegalArgumentException, IllegalAccessException, UnassignableDeltaFieldException {

        // Init a DELTA Array
        DeltaArray<T> array = new DeltaArray<>(this.action(a, b));

        // Transform Collections to Lists
        List<T> aList = a == null ? new ArrayList<>() : new ArrayList<>(a);
        List<T> bList = b == null ? new ArrayList<>() : new ArrayList<>(b);

        // Process the identity map for each element of the lists
        List<Map<String, String>> aKeys = this.processIdentity(aList);
        List<Map<String, String>> bKeys = this.processIdentity(bList);

        List<Integer> matchedB = new ArrayList<>();

        // for each element in source list
        for (int i = 0; i < aKeys.size(); i++) {

            // Get identity map for element
            final Map<String, String> matchKey = aKeys.get(i);

            // Look for matching identity from target list
            int nIndex = IntStream.range(0, bKeys.size()).filter(j -> bKeys.get(j).equals(matchKey))
                    .findFirst().orElse(-1);

            // If matching identity found
            if (nIndex != -1 && !matchedB.contains(nIndex)) {

                // Calculate delta between source element and target element
                DeltaNode<T> node = this.delta(aList.get(i), bList.get(nIndex), mode);

                // Approve node depending on mode
                if (approve(node, mode))
                    array.add(new DeltaListItem<>(matchKey, i, i, node));

                // Add matched index to list of matched elements
                matchedB.add(nIndex);
            }
            // If no matching identity found
            else {

                // Calculate delta node for source with no matching element
                DeltaNode<T> node = this.delta(aList.get(i), null, mode);
                if (approve(node, mode)) {

                    // add attribute to identity specifying the source of the non matched element
                    matchKey.put("source", "origin");
                    array.add(new DeltaListItem<>(matchKey, i, -1, node));
                }
            }
        }

        // If not all elements from B have been matched
        if (matchedB.size() != bKeys.size()) {

            // for each element from B
            for (int j = 0; j < bKeys.size(); j++) {

                // If it's a not matched element
                if (!matchedB.contains(j)) {

                    // Calculate delta node for target with no matching element
                    DeltaNode<T> node = this.delta(null, bList.get(j), mode);
                    if (approve(node, mode)) {
                        // add attribute to identity specifying the source of the non matched element
                        bKeys.get(j).put("source", "target");
                        array.add(new DeltaListItem<>(bKeys.get(j), -1, j, node));
                    }
                }
            }
        }

        return array;
    }

    private <T> DeltaNodeSimple<T> primitiveDelta(T a, T b) {
        return new DeltaNodeSimple<T>(a, b);
    }

    // Determine if delta node is to add or not depending on selected MODE
    private boolean approve(DeltaNode node, DeltaMode mode) {
        return node.isDiff() || (!node.isDiff() && mode.equals(DeltaMode.INCLUSIVE));
    }

    // Delta of two objects (can be Primitives, Collections or Objects)
    public <T> DeltaNode delta(T a, T b, DeltaMode mode)
            throws UnassignableDeltaFieldException, IllegalArgumentException, IllegalAccessException {

        Class<?> classOfA = a == null ? null : a.getClass();
        Class<?> classOfB = b == null ? null : b.getClass();

        CompareType compareType = null;

        // Both Elements are NULL
        if(classOfA == null && classOfB == null) {
            compareType = CompareType.PRIMITIVE;
        }
        // If one is Null
        else if(classOfA == null || classOfB == null) {
            // Find the valued one
            Class<?> valued = classOfA == null ? classOfB : classOfA;
            if(isPrimitive(valued)) {
                compareType = CompareType.PRIMITIVE;
            }
            else if(Collection.class.isAssignableFrom(valued)) {
                compareType = CompareType.COLLECTION;
            }
            else {
                compareType = CompareType.OBJECT;
            }
        }
        // Both Elements are primitive and assignable
        else if(isPrimitive(classOfA) && isPrimitive(classOfB) && (classOfA.isAssignableFrom(classOfB) || classOfB.isAssignableFrom(classOfA))) {
            compareType = CompareType.PRIMITIVE;
        }
        // Both Elements are Collections
        else if(Collection.class.isAssignableFrom(classOfA) && Collection.class.isAssignableFrom(classOfB)) {
            compareType = CompareType.COLLECTION;
        }
        // Both Elements are Objects and are related
        else if(areRelated(classOfA, classOfB)) {
            compareType = CompareType.OBJECT;
        }

        switch (compareType) {
            case OBJECT:
                return this.objectDelta(a,b,mode);
            case PRIMITIVE:
                return this.primitiveDelta(a,b);
            case COLLECTION:
                return this.arrayDelta((Collection) a, (Collection) b,mode);
                default:
                    throw new UnassignableDeltaFieldException();
        }
    }

    // Determines if field was added or deleted, by default considered as unchanged
    private <T> DeltaAction action(T a, T b) {
        return a == null ? b == null ? DeltaAction.NOT_SET : DeltaAction.ADDED
                : b == null ? DeltaAction.DELETED : DeltaAction.UNCHANGED;
    }

    // Return true when class is primitive or string or enum
    private <T> boolean isPrimitive(Class<T> clazz) {
        return ClassUtils.isPrimitiveOrWrapper(clazz) || String.class.isAssignableFrom(clazz)
                || clazz.isEnum();
    }

    /*  Computes map of key / value for identifying fields of each item in a list
        If no identifying fields defined for element class key '&index' will be identifying
        the element with value of element index in the list

        By default a key '&class' is added to identify an element with value of element
        class name, its goal is to avoid matching elements with different class types
     */
    private <T> List<Map<String, String>> processIdentity(List<T> a) {
        List<Map<String, String>> indexes = new ArrayList<>();
        Map<Class<?>, List<DeltaKey>> keysMap = new HashMap<>();
        boolean hasElm = a != null && a.size() > 0;
        if (hasElm) {
            for (int i = 0; i < a.size(); i++) {
                Map<String, String> key = new HashMap<>();
                if (!keysMap.containsKey(a.get(i).getClass())) {
                    keysMap.put(a.get(i).getClass(), processIdentity(a.get(i).getClass()));
                }
                List<DeltaKey> keys = keysMap.get(a.get(i).getClass());
                if (keys.size() > 0) {
                    key = processIdentity(a.get(i), keys);
                } else {
                    key.put("&index", i + "");
                }
                key.put("&class", a.get(i).getClass().getName());
                indexes.add(key);
            }
        }
        return indexes;
    }

    // Get list of identifying keys for a class
    private <T> List<DeltaKey> processIdentity(Class<T> clazz) {

        // Collect list of keys identifying a class (Annotated with DeltaIdentity)
        return getAllFields(clazz, withAnnotation(DeltaIdentity.class)).stream().map(f -> {
            // If field is primitive create a leaf key
            if (isPrimitive(f.getType())) {
                return new DeltaKey(f, null);
            }
            // If field is complex create a DeltaKey node amd process children
            else {
                return new DeltaKey(f, processIdentity(f.getType()));
            }
        }).collect(Collectors.toList());
    }

    // Populate identifying keys for an object instance
    private <T> Map<String, String> processIdentity(T obj, List<DeltaKey> keys) {
        if (obj != null) {
            return keys.stream().map(key -> {
                try {

                    // Key Field
                    Field field = key.getField();

                    // Get field name
                    String name = field.getName();

                    // Save access type
                    boolean access = field.isAccessible();

                    // Make field accessible
                    field.setAccessible(true);

                    // Get Field value
                    Object value = field.get(obj);

                    // Restore access type
                    field.setAccessible(access);

                    // When field is primitive and key is leaf
                    if (isPrimitive(value.getClass()) && key.getChildren() == null
                            || key.getChildren().size() == 0) {

                        // Create Entry of the field name / field value
                        return Stream.of(name)
                                .collect(Collectors.toMap(n -> n, v -> value.toString()))
                                .entrySet();
                    }
                    // When field is not primitive and key is not primitive
                    else if (key.getChildren() != null && key.getChildren().size() > 0) {

                        // Create Entry of the field name . [children names] / [children values]
                        return this.processIdentity(value, key.getChildren()).entrySet().stream()
                                .collect(Collectors.toMap(e -> name + "." + e.getKey(), e -> e.getValue()))
                                .entrySet();
                    }

                } catch (IllegalArgumentException | IllegalAccessException e1) {

                    // Error while processing field return empty key map
                    return new HashMap<String, String>().entrySet();
                }
                return new HashMap<String, String>().entrySet();
            })      // flatten set of entries as streams
                    .flatMap(Set::stream)
                    // Collect entries in a map
                    .collect(Collectors.toMap(e -> e.getKey(), e -> e.getValue()));
        }
        return new HashMap<>();
    }

    // Checks if two classes share an ancestor
    boolean areRelated(Class<?> a, Class<?> b) {
        return Sets.intersection(this.getAncestors(a), this.getAncestors(b)).size() > 0;
    }

    // Calculates a class ancestor
    Set<Class<?>> getAncestors(Class<?> clazz) {
        Set<Class<?>> classes = new HashSet<>();
        if(clazz != null && !clazz.equals(Object.class)) {
            classes.add(clazz);
            classes.addAll(this.getAncestors(clazz.getSuperclass()));
        }
        return classes;
    }


}
