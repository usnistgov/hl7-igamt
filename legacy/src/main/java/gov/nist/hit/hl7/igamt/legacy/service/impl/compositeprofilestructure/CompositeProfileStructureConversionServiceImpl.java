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
package gov.nist.hit.hl7.igamt.legacy.service.impl.compositeprofilestructure;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.ApplyInfo;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.CompositeProfileStructure;
import gov.nist.hit.hl7.igamt.compositeprofile.domain.OrderedProfileComponentLink;
import gov.nist.hit.hl7.igamt.compositeprofile.service.CompositeProfileStructureService;
import gov.nist.hit.hl7.igamt.legacy.repository.CompositeProfileStructureRepository;
import gov.nist.hit.hl7.igamt.legacy.service.ConversionService;
import gov.nist.hit.hl7.igamt.legacy.service.util.ConversionUtil;
import gov.nist.hit.hl7.igamt.shared.domain.CompositeKey;
import gov.nist.hit.hl7.igamt.shared.domain.DomainInfo;
import gov.nist.hit.hl7.igamt.shared.domain.PublicationInfo;

/**
 *
 * @author Jungyub Woo on Mar 15, 2018.
 */
public class CompositeProfileStructureConversionServiceImpl implements ConversionService {

  @Autowired
  private CompositeProfileStructureRepository oldCompositeProfileStructureRepository =
      (CompositeProfileStructureRepository) legacyContext
          .getBean("compositeProfileStructureRepository");

  @Autowired
  private CompositeProfileStructureService convertedCompositeProfileStructureService =
      (CompositeProfileStructureService) context.getBean("compositeProfileStructureService");

  @Override
  public void convert() {
    init();
    List<CompositeProfileStructure> oldCompositeProfileStructures =
        oldCompositeProfileStructureRepository.findAll();
    for (CompositeProfileStructure oldCompositeProfileStructure : oldCompositeProfileStructures) {
      gov.nist.hit.hl7.igamt.compositeprofile.domain.CompositeProfileStructure convertedCompositeProfileStructure =
          this.convertCompositeProfileStructure(oldCompositeProfileStructure);
      convertedCompositeProfileStructureService.save(convertedCompositeProfileStructure);
    }
    List<gov.nist.hit.hl7.igamt.compositeprofile.domain.CompositeProfileStructure> compositeProfileStructures =
        convertedCompositeProfileStructureService.findAll();
    System.out.println(oldCompositeProfileStructures.size() + " will be coverted!");
    System.out.println(compositeProfileStructures.size() + " have be coverted!");
  }

  private gov.nist.hit.hl7.igamt.compositeprofile.domain.CompositeProfileStructure convertCompositeProfileStructure(
      CompositeProfileStructure oldCompositeProfileStructure) {
    gov.nist.hit.hl7.igamt.compositeprofile.domain.CompositeProfileStructure convertedCompositeProfileStructure =
        new gov.nist.hit.hl7.igamt.compositeprofile.domain.CompositeProfileStructure();

    for (ApplyInfo applyInfo : oldCompositeProfileStructure.getProfileComponentsInfo()) {
      OrderedProfileComponentLink link = new OrderedProfileComponentLink();
      link.setProfileComponentId(applyInfo.getId());
      link.setPosition(applyInfo.getPosition());
      convertedCompositeProfileStructure.addOrderedProfileComponents(link);
    }


    DomainInfo domainInfo = new DomainInfo();
    domainInfo.setScope(ConversionUtil.convertScope(oldCompositeProfileStructure.getScope()));
    PublicationInfo publicationInfo = new PublicationInfo();

    convertedCompositeProfileStructure.setComment(oldCompositeProfileStructure.getComment());
    convertedCompositeProfileStructure
        .setConformanceProfileId(oldCompositeProfileStructure.getCoreProfileId());
    convertedCompositeProfileStructure.setCreatedFrom(null);
    convertedCompositeProfileStructure
        .setDescription(oldCompositeProfileStructure.getDescription());
    convertedCompositeProfileStructure.setDomainInfo(domainInfo);
    convertedCompositeProfileStructure
        .setId(new CompositeKey(oldCompositeProfileStructure.getId()));
    convertedCompositeProfileStructure.setName(oldCompositeProfileStructure.getName());
    convertedCompositeProfileStructure.setPostDef(oldCompositeProfileStructure.getDefPostText());
    convertedCompositeProfileStructure.setPreDef(oldCompositeProfileStructure.getDefPreText());
    convertedCompositeProfileStructure.setPublicationInfo(publicationInfo);
    convertedCompositeProfileStructure.setUsername(null);

    return convertedCompositeProfileStructure;
  }

  private void init() {
    convertedCompositeProfileStructureService.removeCollection();
  }
}
