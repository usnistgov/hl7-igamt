package gov.nist.hit.hl7.igamt.bootstrap.app.forwarding;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;

@RestController
@RequestMapping("/sse")
public class SseController {

    private static final Logger logger = LoggerFactory.getLogger(SseController.class);

    // This will be used to handle the Server-Sent Events stream
    private final SseEmitter sseEmitter = new SseEmitter();

    @GetMapping(produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter handleSseConnection() {
        logger.info("New SSE connection established on /sse");
        return sseEmitter;
    }

    @PostMapping(path = "/mcp/messages", consumes = MediaType.APPLICATION_JSON_VALUE)
    public void handleMcpMessage(@RequestBody String message) {
        logger.info("Received MCP message: {}", message);
        try {
            // Here you would add the logic to process the message and send a response back
            // For now, we will simply echo a message back to the client
            sseEmitter.send(SseEmitter.event().name("message").data("Message received: " + message));
        } catch (IOException e) {
            logger.error("Error sending SSE message", e);
        }
    }
}
