package gov.nist.hit.hl7.igamt.web.app.broker;

import gov.nist.hit.hl7.igamt.access.active.ActiveUsersService;
import gov.nist.hit.hl7.igamt.web.app.model.ActiveUser;
import gov.nist.hit.hl7.igamt.web.app.model.UserAction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.Message;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;

import java.util.*;

@Controller
public class ActiveUserController {

    @Autowired
    private ActiveUsersService activeUsersService;

    @MessageMapping("/ig/{igId}/interact")
    @SendTo("/listeners/ig/{igId}/users")
    public Set<ActiveUser> interact(@DestinationVariable String igId, @Header("simpSessionId") String sessionId, Message<UserAction> message, @AuthenticationPrincipal UsernamePasswordAuthenticationToken token) throws Exception {
        if(message.getPayload().equals(UserAction.OPEN)) {
            this.activeUsersService.open(sessionId, igId, token);
        } else {
            this.activeUsersService.close(sessionId, igId, token.getName());
        }
        return this.activeUsersService.getActiveUsers(igId);
    }

}