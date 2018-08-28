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

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;

import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.ApplyInfo;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.CompositeProfileStructure;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.CompositeProfiles;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.IGDocument;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.ProfileComponent;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.ProfileComponentLink;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.SubProfileComponent;
import gov.nist.hit.hl7.auth.domain.Account;
import gov.nist.hit.hl7.auth.repository.AccountRepository;
import gov.nist.hit.hl7.igamt.common.base.domain.CompositeKey;
import gov.nist.hit.hl7.igamt.common.base.domain.DomainInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.PublicationInfo;
import gov.nist.hit.hl7.igamt.compositeprofile.domain.OrderedProfileComponentLink;
import gov.nist.hit.hl7.igamt.compositeprofile.service.CompositeProfileStructureService;
import gov.nist.hit.hl7.igamt.legacy.repository.CompositeProfileStructureRepository;
import gov.nist.hit.hl7.igamt.legacy.repository.IGDocumentRepository;
import gov.nist.hit.hl7.igamt.legacy.repository.ProfileComponentLibraryRepository;
import gov.nist.hit.hl7.igamt.legacy.repository.ProfileComponentRepository;
import gov.nist.hit.hl7.igamt.legacy.service.ConversionService;
import gov.nist.hit.hl7.igamt.legacy.service.util.ConversionUtil;


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
  private ProfileComponentRepository oldProfileComponentRepository =
      (ProfileComponentRepository) legacyContext.getBean("profileComponentRepository");

  @Autowired
  private IGDocumentRepository oldIGDocumentRepository =
      (IGDocumentRepository) legacyContext.getBean("igDocumentRepository");

  @Autowired
  private ProfileComponentLibraryRepository oldProfileComponentLibraryRepository =
      (ProfileComponentLibraryRepository) legacyContext
          .getBean("profileComponentLibraryRepository");

  @Autowired
  private CompositeProfileStructureService convertedCompositeProfileStructureService =
      (CompositeProfileStructureService) context.getBean("compositeProfileStructureService");

  private AccountRepository accountRepository = userContext.getBean(AccountRepository.class);

  @Override
  public void convert() {
    init();

    Map<String, List<String>> map = new HashMap<String, List<String>>();

    List<IGDocument> oldIGDocuments = oldIGDocumentRepository.findAll();

    for (IGDocument ig : oldIGDocuments) {
      Set<ProfileComponentLink> newProfileComponentLinkSet = new HashSet<ProfileComponentLink>();
      for (ProfileComponentLink link : ig.getProfile().getProfileComponentLibrary().getChildren()) {
        ProfileComponent pc = null;
        Optional<ProfileComponent> optional = oldProfileComponentRepository.findById(link.getId());
        if(optional.isPresent()) {
          pc = optional.get();
        }
        if (pc != null && pc.getChildren() != null && pc.getChildren().size() > 0) {
          List<String> spcList = new ArrayList<String>();

          int index = 0;
          for (SubProfileComponent spc : pc.getChildren()) {
            spcList.add(spc.getId());
            index = index + 1;
            ProfileComponentLink newLink = new ProfileComponentLink();
            newLink.setComment(link.getComment());
            newLink.setDescription(link.getDescription());
            newLink.setName(link.getName() + "_" + index);
            newLink.setId(spc.getId());
            newProfileComponentLinkSet.add(newLink);
          }
          map.put(pc.getId(), spcList);
        }
      }
      ig.getProfile().getProfileComponentLibrary().setChildren(newProfileComponentLinkSet);
      oldProfileComponentLibraryRepository.save(ig.getProfile().getProfileComponentLibrary());

      for (CompositeProfileStructure cps : ig.getProfile().getCompositeProfiles().getChildren()) {
        int index = 0;
        List<ApplyInfo> newApplyInfoList = new ArrayList<ApplyInfo>();
        for (ApplyInfo applyInfo : cps.getProfileComponentsInfo()) {
          List<String> spcList = map.get(applyInfo.getId());
          for (String newId : spcList) {
            index = index + 1;
            ApplyInfo newApplyInfo = new ApplyInfo();
            newApplyInfo.setId(newId);
            newApplyInfo.setPcDate(applyInfo.getPcDate());
            newApplyInfo.setPosition(index);
            newApplyInfoList.add(newApplyInfo);
          }
        }
        cps.setProfileComponentsInfo(newApplyInfoList);
        oldCompositeProfileStructureRepository.save(cps);
      }



      CompositeProfiles compositeProfiles = ig.getProfile().getCompositeProfiles();

      for (CompositeProfileStructure oldCompositeProfileStructure : compositeProfiles
          .getChildren()) {
        gov.nist.hit.hl7.igamt.compositeprofile.domain.CompositeProfileStructure convertedCompositeProfileStructure =
            this.convertCompositeProfileStructure(oldCompositeProfileStructure);
        if (ig.getAccountId() != null) {
          Account acc = accountRepository.findByAccountId(ig.getAccountId());
          if (acc != null && acc.getAccountId() != null) {
            if (acc.getUsername() != null) {
              convertedCompositeProfileStructure.setUsername(acc.getUsername());
            }
          }
        }
        convertedCompositeProfileStructureService.save(convertedCompositeProfileStructure);
      }
    }

    System.out
        .println(oldCompositeProfileStructureRepository.findAll().size() + " will be coverted!");
    System.out
        .println(convertedCompositeProfileStructureService.findAll().size() + " have be coverted!");
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

    return convertedCompositeProfileStructure;
  }

  private void init() {
    convertedCompositeProfileStructureService.removeCollection();
  }
}
