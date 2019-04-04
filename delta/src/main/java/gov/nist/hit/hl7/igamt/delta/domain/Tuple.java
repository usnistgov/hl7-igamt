package gov.nist.hit.hl7.igamt.delta.domain;

public class Tuple<T, E> {

    T key;
    E value;

    public Tuple(T key, E value) {
        this.key = key;
        this.value = value;
    }

    public T getKey() {
        return key;
    }

    public void setKey(T key) {
        this.key = key;
    }

    public E getValue() {
        return value;
    }

    public void setValue(E value) {
        this.value = value;
    }
}
