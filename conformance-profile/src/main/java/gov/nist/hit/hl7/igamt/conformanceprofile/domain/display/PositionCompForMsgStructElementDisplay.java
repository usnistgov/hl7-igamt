package gov.nist.hit.hl7.igamt.conformanceprofile.domain.display;

import java.util.Comparator;

public class PositionCompForMsgStructElementDisplay implements Comparator<MsgStructElementDisplay> {
  @Override
  public int compare(MsgStructElementDisplay e1, MsgStructElementDisplay e2) {
    if (e1.getData().getPosition() > e2.getData().getPosition()) {
      return 1;
    } else {
      return -1;
    }
  }
}
