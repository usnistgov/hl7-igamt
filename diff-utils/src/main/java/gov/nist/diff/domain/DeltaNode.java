package gov.nist.diff.domain;

public abstract class DeltaNode<T> {

	private DeltaAction action;
	private boolean diff;
	
	public DeltaNode(DeltaAction action) {
		this();
		this.setAction(action);
	}

	public DeltaAction getAction() {
		return action;
	}
	
	public void setAction(DeltaAction action) {
		this.diff = !DeltaAction.UNCHANGED.equals(action) && !DeltaAction.NOT_SET.equals(action);
		this.action = action;
	}
	
	public boolean isDiff() {
		return diff;
	}
		
	public DeltaNode() {
		super();
	}
}
