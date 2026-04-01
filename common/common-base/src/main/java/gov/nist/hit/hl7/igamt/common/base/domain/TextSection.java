package gov.nist.hit.hl7.igamt.common.base.domain;

import java.util.HashSet;
import java.util.Set;

import org.bson.types.ObjectId;



public class TextSection extends Section {

  private Set<TextSection> children = new HashSet<TextSection>();
  // For MESSAGESECTION type: references to example messages feature
  private String messageId;
  private String snippetId;

  public TextSection(String id, String description, Type type, int position, String label) {
    super(id, description, type, position, label);
  }



  public TextSection() {
    super();
  }

  public Set<TextSection> getChildren() {
    return children;
  }

  public void setChildren(Set<TextSection> children) {
    this.children = children;
  }

  public String getMessageId() {
    return messageId;
  }

  public void setMessageId(String messageId) {
    this.messageId = messageId;
  }

  public String getSnippetId() {
    return snippetId;
  }

  public void setSnippetId(String snippetId) {
    this.snippetId = snippetId;
  }

  @Override
  public TextSection clone() {
    TextSection clone = new TextSection();
    clone.setId(new ObjectId().toString());
    clone.setDescription(this.getDescription());
    clone.setType(this.getType());
    clone.setLabel(this.getLabel());
    clone.setMessageId(this.messageId);
    clone.setSnippetId(this.snippetId);
    if (this.children != null && !this.children.isEmpty()) {
      clone.children = new HashSet<TextSection>();
      for (TextSection s : this.children) {
        clone.getChildren().add(s.clone());
      }
    }

    return clone;


  };



}
