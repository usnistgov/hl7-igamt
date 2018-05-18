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
package gov.nist.hit.hl7.igamt.ig.service;

import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.compositeprofile.model.CompositeProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.model.AddMessageResponseDisplay;
import gov.nist.hit.hl7.igamt.ig.model.AddMessageResponseObject;
import gov.nist.hit.hl7.igamt.ig.model.AddSegmentResponseDisplay;
import gov.nist.hit.hl7.igamt.ig.model.AddSegmentResponseObject;
import gov.nist.hit.hl7.igamt.ig.model.IGDisplay;
import gov.nist.hit.hl7.igamt.ig.model.TreeNode;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.ProfileComponent;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;

/**
 * @author ena3
 *
 */
@Service
public interface DisplayConverterService {

  public IGDisplay convertDomainToModel(Ig ig);

  public Ig ConvertModelToDomain(IGDisplay ig);

  public List<TreeNode> getDatatypesNodes(Set<Datatype> datatypes);

  public List<TreeNode> getSegmentNodes(Set<Segment> segments);

  public List<TreeNode> getValueSetNodes(Set<Valueset> valuesets);

  public List<TreeNode> getCompositeProfileNodes(Set<CompositeProfile> compositeProfiles);

  public List<TreeNode> getProfileCompoenents(Set<ProfileComponent> profileComponents);


  public List<TreeNode> getConformaneProfile(Set<ConformanceProfile> conformanceProfiles);

  public AddMessageResponseDisplay convertMessageAddResponseToDisplay(
      AddMessageResponseObject addMessageResponse);

  /**
   * @param objects
   * @return
   */
  public AddSegmentResponseDisplay convertSegmentResponseToDisplay(
      AddSegmentResponseObject objects);

}
