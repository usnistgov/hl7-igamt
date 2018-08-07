/**
 * This software was developed at the National Institute of Standards and Technology by employees of
 * the Federal Government in the course of their official duties. Pursuant to title 17 Section 105
 * of the United States Code this software is not subject to copyright protection and is in the
 * public domain. This is an experimental system. NIST assumes no responsibility whatsoever for its
 * use by other parties, and makes no guarantees, expressed or implied, about its quality,
 * reliability, or any other characteristic. We would appreciate acknowledgement if the software is
 * used. This software can be redistributed and/or modified freely provided that any derivative
 * works bear some notice that they are derived from it, and any modified versions bear some notice
 * that they have been modified.
 */
package gov.nist.hit.hl7.igamt.datatypeLibrary.domain;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.GeneratedValue;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * @author ena3
 *
 */
@Document
public class DatatypeClassification {

  @Id
  @GeneratedValue
  private String id;

  private String name;

  private Set<DatatypeVersionGroup> classes = new HashSet<DatatypeVersionGroup>();

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public Set<DatatypeVersionGroup> getClasses() {
    return classes;
  }

  public void setClasses(Set<DatatypeVersionGroup> classes) {
    this.classes = classes;
  }



}
