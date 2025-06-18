package gov.nist.hit.hl7.igamt.valueset.model;

public class PropertyDelta<T> {
	private T current;
	private T previous;
	private DeltaChange change;

	public PropertyDelta(DeltaChange change, T current, T previous) {
		this.change = change;
		this.current = current;
		this.previous = previous;
	}

	public PropertyDelta(T current, T previous) {
		this.current = current;
		this.previous = previous;
	}

	public PropertyDelta() {
	}

	public DeltaChange getChange() {
		return change;
	}

	public void setChange(DeltaChange change) {
		this.change = change;
	}

	public T getCurrent() {
		return current;
	}

	public void setCurrent(T current) {
		this.current = current;
	}

	public T getPrevious() {
		return previous;
	}

	public void setPrevious(T previous) {
		this.previous = previous;
	}
}
