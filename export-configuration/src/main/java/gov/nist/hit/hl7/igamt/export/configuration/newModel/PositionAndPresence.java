package gov.nist.hit.hl7.igamt.export.configuration.newModel;

public class PositionAndPresence {

	private boolean presence=true;
	private int position=1;
	
	
	public boolean isPresence() {
		return presence;
	}
	public void setPresence(boolean presence) {
		this.presence = presence;
	}
	public int getPosition() {
		return position;
	}
	public void setPosition(int position) {
		this.position = position;
	}
	
	
}
