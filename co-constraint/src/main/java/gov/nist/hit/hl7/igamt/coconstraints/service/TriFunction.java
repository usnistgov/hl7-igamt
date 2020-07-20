package gov.nist.hit.hl7.igamt.coconstraints.service;

@FunctionalInterface
public interface TriFunction<A, B, C, D> {
    D apply(A a, B b, C c);
}
