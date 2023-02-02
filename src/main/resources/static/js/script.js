'use strict'

let stompClient
let username

const connect = (event) => {
    username = document.querySelector('#username').value.trim()

    if (username) {
        const login = document.querySelector('#login')
        login.classList.add('hide')

        const chatPage = document.querySelector('#chat-page')
        chatPage.classList.remove('hide')

        const socket = new SockJS('/chat-example')
        stompClient = Stomp.over(socket)
        stompClient.connect({}, onConnected, onError)
    }
    event.preventDefault()
}

const onConnected = () => {
    stompClient.subscribe('/topic/public', onMessageReceived)
    stompClient.send("/app/chat.newUser",
        {},
        JSON.stringify({sender: username, type: 'CONNECTED'})
    )
    const status = document.querySelector('#status')
    status.className = 'hide'
}

const onError = (error) => {
    const status = document.querySelector('#status')
    status.innerHTML = 'Could not find the connection you were looking for. Move along. Or, Refresh the page!'
    status.style.color = 'red'
}

const sendMessage = (event) => {
    const messageInput = document.querySelector('#message')
    const messageContent = messageInput.value.trim()

    if (messageContent && stompClient) {
        const chatMessage = {
            sender: username,
            content: messageInput.value,
            type: 'CHAT',
            time: moment().calendar()
        }
        stompClient.send("/app/chat.send", {}, JSON.stringify(chatMessage))
        messageInput.value = ''
    }
    event.preventDefault();
}


const onMessageReceived = (payload) => {
    const message = JSON.parse(payload.body);

    const chatCard = document.createElement('div') //chat 
    chatCard.className = 'card-body'

    const flexBox = document.createElement('div') //message container
    flexBox.className = 'msg'

    const messageElement = document.createElement('div') //user sent message
    messageElement.className = 'msg_container_send'

    const info = document.createElement('div') //user info and time
    info.className = 'credentials'

    chatCard.appendChild(flexBox) //adds message container to chat
    flexBox.appendChild(info) //adds user info and time
    flexBox.appendChild(messageElement) //adds message

    if (message.type === 'CONNECTED') {
        messageElement.classList.add('event-message')
        message.content = message.sender + ' has joined the chat!'
    } else if (message.type === 'DISCONNECTED') {
        messageElement.classList.add('event-message')
        message.content = message.sender + ' has left the chat!'
    } else {
        messageElement.classList.add('chat-message')

        const avatarContainer = document.createElement('div')
        avatarContainer.className = 'img_cont_msg'
        const avatarElement = document.createElement('div')
        avatarElement.className = 'circle user_img_msg'
        const avatarText = document.createTextNode(message.sender[0])
        avatarElement.appendChild(avatarText);
        avatarElement.style['background-color'] = getAvatarColor(message.sender)
        avatarContainer.appendChild(avatarElement)

        messageElement.style['background-color'] = getAvatarColor(message.sender)

        let time = document.createElement('p')
        time.className = 'msg_time_send'
        time.innerHTML = message.time
        console.log(time)
        info.appendChild(time)

        info.appendChild(avatarContainer)
    }

    messageElement.innerHTML = message.content
    const chat = document.querySelector('#chat')
    chat.appendChild(flexBox)
    chat.scrollBottom = chat.scrollHeight
}

const hashCode = (str) => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
       hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }
    return hash
}


const getAvatarColor = (messageSender) => {
    const colours = ['#2196F3', '#32c787', '#1BC6B4', '#A1B4C4']
    const index = Math.abs(hashCode(messageSender) % colours.length)
    return colours[index]
}

const loginForm = document.querySelector('#login-form')
loginForm.addEventListener('submit', connect, true)
const messageControls = document.querySelector('#message-controls')
messageControls.addEventListener('submit', sendMessage, true)