/**
 * 
 * This software was developed at the National Institute of Standards and Technology by employees of
 * the Federal Government in the course of their official duties. Pursuant to title 17 Section 105
 * of the United States Code this software is not subject to copyright protection and is in the
 * public domain. This is an experimental system. NIST assumes no responsibility whatsoever for its
 * use by other parties, and makes no guarantees, expressed or implied, about its quality,
 * reliability, or any other characteristic. We would appreciate acknowledgement if the software is
 * used. This software can be redistributed and/or modified freely provided that any derivative
 * works bear some notice that they are derived from it, and any modified versions bear some notice
 * that they have been modified.
 * 
 */
package gov.nist.hit.hl7.igamt.legacy.service.impl.profilecomponent;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.ProfileComponent;
import gov.nist.hit.hl7.igamt.legacy.repository.ProfileComponentRepository;
import gov.nist.hit.hl7.igamt.legacy.service.ConversionService;
import gov.nist.hit.hl7.igamt.legacy.service.util.ConversionUtil;
import gov.nist.hit.hl7.igamt.profilecomponent.service.ProfileComponentService;
import gov.nist.hit.hl7.igamt.shared.domain.CompositeKey;
import gov.nist.hit.hl7.igamt.shared.domain.DomainInfo;
import gov.nist.hit.hl7.igamt.shared.domain.PublicationInfo;

/**
 *
 * @author Jungyub Woo on Mar 15, 2018.
 */
public class ProfileComponentConversionServiceImpl implements ConversionService {

  @Autowired
  private ProfileComponentRepository oldProfileComponentRepository =
      (ProfileComponentRepository) legacyContext.getBean("profileComponentRepository");

  @Autowired
  private ProfileComponentService convertedProfileComponentService =
      (ProfileComponentService) context.getBean("profileComponentService");

  @Override
  public void convert() {
    init();
    List<ProfileComponent> oldProfileComponents = oldProfileComponentRepository.findAll();
    for (ProfileComponent oldProfileComponent : oldProfileComponents) {
      gov.nist.hit.hl7.igamt.profilecomponent.domain.ProfileComponent convertedProfileComponent =
          this.convertProfileComponent(oldProfileComponent);
      convertedProfileComponentService.save(convertedProfileComponent);
    }
    List<gov.nist.hit.hl7.igamt.profilecomponent.domain.ProfileComponent> profileComponents =
        convertedProfileComponentService.findAll();
    System.out.println(oldProfileComponents.size() + " will be coverted!");
    System.out.println(profileComponents.size() + " have be coverted!");
  }

  /**
   * @param oldProfileComponent
   * @return
   */
  private gov.nist.hit.hl7.igamt.profilecomponent.domain.ProfileComponent convertProfileComponent(
      ProfileComponent oldProfileComponent) {

    gov.nist.hit.hl7.igamt.profilecomponent.domain.ProfileComponent convertedProfileComponent =
        new gov.nist.hit.hl7.igamt.profilecomponent.domain.ProfileComponent();

    // convertedProfileComponent.setProfileComponentItems(profileComponentItems);
    // convertedProfileComponent.setLevel(level);
    // convertedProfileComponent.setSourceId(sourceId);
    // convertedProfileComponent.setStructure(structure);

    
    DomainInfo domainInfo = new DomainInfo();
    domainInfo.setScope(ConversionUtil.convertScope(oldProfileComponent.getScope()));
    PublicationInfo publicationInfo = new PublicationInfo();

    convertedProfileComponent.setId(new CompositeKey(oldProfileComponent.getId()));
    convertedProfileComponent.setComment(oldProfileComponent.getComment());
    convertedProfileComponent.setCreatedFrom(null);
    convertedProfileComponent.setDescription(oldProfileComponent.getDescription());
    convertedProfileComponent.setDomainInfo(domainInfo);
    convertedProfileComponent.setName(oldProfileComponent.getName());
    convertedProfileComponent.setPostDef(oldProfileComponent.getDefPostText());
    convertedProfileComponent.setPreDef(oldProfileComponent.getDefPreText());
    convertedProfileComponent.setPublicationInfo(publicationInfo);
    convertedProfileComponent.setUsername(null);

    return convertedProfileComponent;
  }

  private void init() {
    convertedProfileComponentService.removeCollection();
  }
}
