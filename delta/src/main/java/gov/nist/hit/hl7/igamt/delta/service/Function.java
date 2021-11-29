package gov.nist.hit.hl7.igamt.delta.service;

@FunctionalInterface
interface Function<A, B, C> {
  public C apply(A a, B b);
}
