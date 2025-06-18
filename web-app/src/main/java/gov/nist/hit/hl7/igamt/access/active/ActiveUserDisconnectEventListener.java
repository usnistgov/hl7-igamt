package gov.nist.hit.hl7.igamt.access.active;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.Set;

@Component
public class ActiveUserDisconnectEventListener implements ApplicationListener<SessionDisconnectEvent> {

    @Autowired
    private ActiveUsersService activeUsersService;
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @Override
    public void onApplicationEvent(SessionDisconnectEvent event) {
        Set<String> igs = activeUsersService.terminate(event.getSessionId());
        igs.forEach((igId) -> {
            simpMessagingTemplate.convertAndSend("/listeners/ig/"+ igId +"/users", this.activeUsersService.getActiveUsers(igId));
        });
    }
}