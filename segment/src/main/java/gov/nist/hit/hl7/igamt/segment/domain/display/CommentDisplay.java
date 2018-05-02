package gov.nist.hit.hl7.igamt.segment.domain.display;

import gov.nist.hit.hl7.igamt.shared.domain.binding.Comment;

public class CommentDisplay {

  private Comment comment;
  private Level level;

  public CommentDisplay() {
  }
  
  public CommentDisplay(Comment comment, Level level) {
    this.comment = comment;
    this.level = level;
  }

  public Comment getComment() {
    return comment;
  }

  public void setComment(Comment comment) {
    this.comment = comment;
  }

  public Level getLevel() {
    return level;
  }

  public void setLevel(Level level) {
    this.level = level;
  }


}
