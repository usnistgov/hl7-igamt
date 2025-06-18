package gov.nist.hit.hl7.igamt.bootstrap.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/listeners");
        config.setApplicationDestinationPrefixes("/ws-hook");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.setOrder(0);
        registry.addEndpoint("/api/ig-ws")
                .setAllowedOrigins("*")
                .withSockJS();
    }
}