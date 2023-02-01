package com.chatApp.websocketTutorial.model;

import lombok.Builder;
import lombok.Getter;

@Builder
public class ChatMessage {
    @Getter
    private MessageType type;

    @Getter
    private String content;

    @Getter
    private String sender;

    //TODO - change to use moment js instead of just string
    @Getter
    private String time;
}
