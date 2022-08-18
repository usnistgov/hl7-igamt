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
package gov.nist.hit.hl7.igamt.ig.model;

import java.util.HashSet;
import java.util.Set;

import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintGroup;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;

/**
 * @author ena3
 *
 */
public class AddMessageResponseObject {


  Set<ConformanceProfile> conformanceProfiles = new HashSet<ConformanceProfile>();
  Set<Datatype> datatypes = new HashSet< Datatype>();
  Set<Segment> segments = new HashSet<Segment>();
  Set<Valueset> valueSets = new HashSet<Valueset>();
  Set<CoConstraintGroup> coConstraints = new HashSet<CoConstraintGroup>();

  public Set<ConformanceProfile> getConformanceProfiles() {
    return conformanceProfiles;
  }

  public void setConformanceProfiles(Set<ConformanceProfile> conformanceProfiles) {
    this.conformanceProfiles = conformanceProfiles;
  }

  public Set<Datatype> getDatatypes() {
    return datatypes;
  }

  public void setDatatypes(Set<Datatype> datatypesMap) {
    this.datatypes = datatypesMap;
  }

  public Set<Segment> getSegments() {
    return segments;
  }

  public void setSegments(Set<Segment> segments) {
    this.segments = segments;
  }

  public Set<Valueset> getValueSets() {
    return valueSets;
  }

  public void setValueSets(Set<Valueset> valueSets) {
    this.valueSets = valueSets;
  }
  public Set<CoConstraintGroup> getCoConstraints() {
    return coConstraints;
  }

  public void setCoConstraints(Set<CoConstraintGroup> coConstraints) {
    this.coConstraints = coConstraints;
  }




}
