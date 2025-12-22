package gov.nist.hit.hl7.igamt.examples.service;

import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.domain.display.DisplayElement;
import gov.nist.hit.hl7.igamt.common.base.exception.ResourceNotFoundException;
import gov.nist.hit.hl7.igamt.compositeprofile.domain.CompositeProfileStructure;
import gov.nist.hit.hl7.igamt.compositeprofile.repository.CompositeProfileStructureRepository;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.repository.ConformanceProfileRepository;
import gov.nist.hit.hl7.igamt.display.service.DisplayInfoService;
import gov.nist.hit.hl7.igamt.examples.domain.ExampleMessage;
import gov.nist.hit.hl7.igamt.examples.domain.IgExampleMessages;
import gov.nist.hit.hl7.igamt.examples.domain.ProfileInfo;
import gov.nist.hit.hl7.igamt.examples.dto.*;
import gov.nist.hit.hl7.igamt.examples.repository.IgExampleMessagesRepository;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.repository.IgRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExampleMessagesService {

    @Autowired
    private IgExampleMessagesRepository exampleMessagesRepository;
    @Autowired
    private IgRepository igRepository;
    @Autowired
    private ConformanceProfileRepository conformanceProfileRepository;
    @Autowired
    private CompositeProfileStructureRepository compositeProfileStructureRepository;
    @Autowired
    private DisplayInfoService displayInfoService;

    public IgExampleMessages getOrCreateIgExampleMessage(String igId) {
        IgExampleMessages igExampleMessages = this.exampleMessagesRepository.findById(igId).orElse(null);
        if(igExampleMessages == null) {
            igExampleMessages = new IgExampleMessages();
            igExampleMessages.setId(igId);
            this.exampleMessagesRepository.save(igExampleMessages);
        }
        return igExampleMessages;
    }

    public ExampleMessage getExampleMessage(String igId, String messageId) throws ResourceNotFoundException {
        IgExampleMessages igExampleMessages = this.exampleMessagesRepository.findById(igId).orElse(null);
        if(igExampleMessages == null) {
            throw new ResourceNotFoundException(igId, Type.EXAMPLEMESSAGES);
        }

        return igExampleMessages.getExampleMessages().stream().filter((m) -> m.getId().equals(messageId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException(messageId, Type.EXAMPLEMESSAGE));
    }

    public ExampleMessage saveMessage(String igId, String messageId, SaveMessageDTO saveMessageDTO) throws ResourceNotFoundException {
        IgExampleMessages igExampleMessages = this.exampleMessagesRepository.findById(igId).orElse(null);
        if(igExampleMessages == null) {
            throw new ResourceNotFoundException(igId, Type.EXAMPLEMESSAGES);
        }

        ExampleMessage exampleMessage = igExampleMessages.getExampleMessages().stream().filter((m) -> m.getId().equals(messageId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException(messageId, Type.EXAMPLEMESSAGE));

        exampleMessage.setMessage(saveMessageDTO.getMessage());
        exampleMessage.setNarrativeHTML(saveMessageDTO.getNarrative());

        this.exampleMessagesRepository.save(igExampleMessages);
        return exampleMessage;
    }


    public IgExampleMessagesDTO toDTO(IgExampleMessages igExampleMessages) throws ResourceNotFoundException {
        Ig ig = this.igRepository.findById(igExampleMessages.getId()).orElse(null);
        if(ig == null) {
            throw new ResourceNotFoundException(igExampleMessages.getId(), Type.IGDOCUMENT);
        }
        IgExampleMessagesDTO igExampleMessagesDTO = new IgExampleMessagesDTO();
        igExampleMessagesDTO.setId(igExampleMessages.getId());
        igExampleMessagesDTO.setTitle(ig.getMetadata().getTitle());
        List<DisplayElement> profiles = new ArrayList<>();
        profiles.addAll(this.displayInfoService.convertConformanceProfileRegistry(ig.getConformanceProfileRegistry()));
        profiles.addAll(this.displayInfoService.convertCompositeProfileRegistry(ig.getCompositeProfileRegistry()));
        for(DisplayElement profile: profiles) {
            ProfileExampleMessages profileExampleMessages = new ProfileExampleMessages();
            profileExampleMessages.setProfile(profile);
            profileExampleMessages.setExampleMessages(
                    igExampleMessages.getExampleMessages().stream()
                            .filter((em) -> em.getProfileId().equals(profile.getId()))
                            .collect(Collectors.toList())
            );
            igExampleMessagesDTO.getProfileExampleMessages().add(profileExampleMessages);
        }
        return igExampleMessagesDTO;
    }

    public ExampleMessageDTO toDTO(ExampleMessage exampleMessage) {
        ExampleMessageDTO exampleMessageDTO = new ExampleMessageDTO();
        exampleMessageDTO.setId(exampleMessage.getId());
        exampleMessageDTO.setName(exampleMessage.getName());
        exampleMessageDTO.setNarrativeHTML(exampleMessage.getNarrativeHTML());
        exampleMessageDTO.setMessage(exampleMessage.getMessage());

        ProfileInfo profileInfo = getProfileInfo(exampleMessage.getProfileId());
        if(profileInfo != null) {
            exampleMessageDTO.setProfile(profileInfo.getDisplayInfo());
        }

        return exampleMessageDTO;
    }

    public IgExampleMessagesDTO createExampleMessage(String id, CreateMessageDTO createMessageDTO) throws ResourceNotFoundException {
        ProfileInfo profile = this.getProfileInfo(createMessageDTO.getProfileId());
        if(profile == null) {
            throw new ResourceNotFoundException(createMessageDTO.getProfileId(), Type.PROFILE);
        }

        if(!id.equals(profile.getDocumentInfo().getDocumentId())) {
            throw new ResourceNotFoundException(createMessageDTO.getProfileId(), Type.PROFILE);
        }

        IgExampleMessages igExampleMessages = this.getOrCreateIgExampleMessage(id);
        ExampleMessage exampleMessage = new ExampleMessage();
        exampleMessage.setId(new ObjectId().toString());
        exampleMessage.setName(createMessageDTO.getName());
        exampleMessage.setProfileId(createMessageDTO.getProfileId());
        igExampleMessages.getExampleMessages().add(exampleMessage);
        this.exampleMessagesRepository.save(igExampleMessages);
        return this.toDTO(igExampleMessages);
    }

    private ProfileInfo getProfileInfo(String profileId) {
        ProfileInfo profileInfo = new ProfileInfo();
        ConformanceProfile conformanceProfile = this.conformanceProfileRepository.findById(profileId).orElse(null);
        if(conformanceProfile == null) {
            CompositeProfileStructure compositeProfileStructure = this.compositeProfileStructureRepository.findById(profileId).orElse(null);
            if(compositeProfileStructure != null) {
                DisplayElement display = this.displayInfoService.convertCompositeProfile(compositeProfileStructure, 1);
                profileInfo.setDisplayInfo(display);
                profileInfo.setDocumentInfo(compositeProfileStructure.getDocumentInfo());
                return profileInfo;
            }
        } else {
            DisplayElement display =  this.displayInfoService.convertConformanceProfile(conformanceProfile, 1);
            profileInfo.setDisplayInfo(display);
            profileInfo.setDocumentInfo(conformanceProfile.getDocumentInfo());
            return profileInfo;
        }
        return null;
    }



}
