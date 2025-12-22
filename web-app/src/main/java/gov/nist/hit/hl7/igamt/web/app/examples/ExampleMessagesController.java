package gov.nist.hit.hl7.igamt.web.app.examples;

import gov.nist.hit.hl7.igamt.common.base.model.ResponseMessage;
import gov.nist.hit.hl7.igamt.examples.domain.ExampleMessage;
import gov.nist.hit.hl7.igamt.examples.domain.IgExampleMessages;
import gov.nist.hit.hl7.igamt.examples.dto.CreateMessageDTO;
import gov.nist.hit.hl7.igamt.examples.dto.ExampleMessageDTO;
import gov.nist.hit.hl7.igamt.examples.dto.IgExampleMessagesDTO;
import gov.nist.hit.hl7.igamt.examples.dto.SaveMessageDTO;
import gov.nist.hit.hl7.igamt.examples.dto.parser.MessageModel;
import gov.nist.hit.hl7.igamt.examples.service.ExampleMessagesService;
import gov.nist.hit.hl7.igamt.examples.service.MessageParserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Date;

@RestController
public class ExampleMessagesController {

    @Autowired
    ExampleMessagesService exampleMessagesService;
    @Autowired
    MessageParserService messageParserService;

    @RequestMapping(value = "/api/example-messages/{id}", method = RequestMethod.GET, produces = {"application/json" })
    public @ResponseBody
    IgExampleMessagesDTO getExampleMessages(
            @PathVariable("id") String id,
            Authentication authentication
    ) throws Exception {
        IgExampleMessages exampleMessages = this.exampleMessagesService.getOrCreateIgExampleMessage(id);
        return exampleMessagesService.toDTO(exampleMessages);
    }

    @RequestMapping(value = "/api/example-messages/{id}/message/{messageId}", method = RequestMethod.GET, produces = {"application/json" })
    public @ResponseBody
    ExampleMessageDTO getMessage(
            @PathVariable("id") String id,
            @PathVariable("messageId") String messageId,
            Authentication authentication
    ) throws Exception {
        ExampleMessage exampleMessage = this.exampleMessagesService.getExampleMessage(id, messageId);
        return exampleMessagesService.toDTO(exampleMessage);
    }


    @RequestMapping(value = "/api/example-messages/{id}/message/{messageId}", method = RequestMethod.POST, produces = {"application/json" })
    public @ResponseBody
    ResponseMessage<ExampleMessageDTO> saveMessage(
            @PathVariable("id") String id,
            @PathVariable("messageId") String messageId,
            @RequestBody SaveMessageDTO saveMessageDTO
    ) throws Exception {
        ExampleMessage exampleMessage = this.exampleMessagesService.saveMessage(id, messageId, saveMessageDTO);
        return new ResponseMessage<>(
                ResponseMessage.Status.SUCCESS,
                "Example Message Saved Successfully",
                messageId,
                exampleMessagesService.toDTO(exampleMessage),
                new Date()
        );
    }


    @RequestMapping(value = "/api/example-messages/{id}/message", method = RequestMethod.POST, produces = {"application/json" })
    public @ResponseBody
    ResponseMessage<IgExampleMessagesDTO> createMessage(
            @PathVariable("id") String id,
            @RequestBody CreateMessageDTO createMessageDTO,
            Authentication authentication
    ) throws Exception {
        IgExampleMessagesDTO igExampleMessages = this.exampleMessagesService.createExampleMessage(id, createMessageDTO);
        return new ResponseMessage<>(
                ResponseMessage.Status.SUCCESS,
                "Example Message Created Successfully",
                igExampleMessages.getId(),
                igExampleMessages,
                new Date()
        );
    }

    @RequestMapping(value = "/api/example-messages/{id}/message/{messageId}/parse", method = RequestMethod.GET, produces = {"application/json" })
    public @ResponseBody
    MessageModel getParsedMessage(
            @PathVariable("id") String id,
            @PathVariable("messageId") String messageId,
            Authentication authentication
    ) throws Exception {
        ExampleMessage exampleMessage = this.exampleMessagesService.getExampleMessage(id, messageId);
        return messageParserService.parseMessage(id, exampleMessage.getProfileId(), exampleMessage.getMessage());
    }

}
