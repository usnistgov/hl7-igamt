//package gov.nist.hit.hl7.igamt.mcp;
//
//import java.io.IOException;
//import java.util.UUID;
//import org.springframework.http.MediaType;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
//
//@RestController
//public class McpSseController {
//
//  // SSE subscription endpoint that mcpo connects to
//  @GetMapping(value = "/ss", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
//  public SseEmitter stream() {
//    // 0L = no timeout; adjust if you prefer
//    SseEmitter emitter = new SseEmitter(0L);
//    try {
//      // mcpo expects an initial "endpoint" event that tells it where to POST messages
//      String sessionId = UUID.randomUUID().toString();
//      emitter.send(SseEmitter.event()
//          .name("endpoint")
//          .data("/mcp/messages?sessionId=" + sessionId));
//      // (optional) keepalive pings if needed:
//      // emitter.send(SseEmitter.event().comment("keepalive"));
//    } catch (IOException e) {
//      emitter.completeWithError(e);
//    }
//    return emitter;
//  }
//
//  // mcpo will POST messages here
//  @PostMapping("/mcp/messages")
//  public ResponseEntity<Void> messages(
//      @RequestParam String sessionId,
//      @RequestBody(required = false) String body) {
//    // TODO: handle/route the message; do not throw
//    // System.out.println("sessionId=" + sessionId + " body=" + body);
//    return ResponseEntity.ok().build();
//  }
//
//
//
//
//
//
//}