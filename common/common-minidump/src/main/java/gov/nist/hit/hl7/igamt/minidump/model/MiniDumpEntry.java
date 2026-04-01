package gov.nist.hit.hl7.igamt.minidump.model;

public class MiniDumpEntry {
  private String collection;
  private String document;

  public MiniDumpEntry() {
  }

  public MiniDumpEntry(String collection, String document) {
    this.collection = collection;
    this.document = document;
  }

  public String getCollection() {
    return collection;
  }

  public void setCollection(String collection) {
    this.collection = collection;
  }

  public String getDocument() {
    return document;
  }

  public void setDocument(String document) {
    this.document = document;
  }
}

