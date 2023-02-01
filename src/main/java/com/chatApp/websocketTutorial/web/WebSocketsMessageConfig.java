package com.chatApp.websocketTutorial.web;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketsMessageConfig implements WebSocketMessageBrokerConfigurer {
    @Override
    // STOMP = Stream Text Oriented Messaging Protocol
    public void registerStompEndpoints(final StompEndpointRegistry registry){
        registry.addEndpoint("/chat-example").withSockJS(); //brower javascript library
    }

    @Override
    public void configureMessageBroker(final MessageBrokerRegistry registry){
        registry.setApplicationDestinationPrefixes("/app"); //message mapping annotations
        registry.enableSimpleBroker("/topic"); //memory based memory broker
    }
}
