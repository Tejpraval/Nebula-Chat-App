/**
 * Nebula Chat - Client Application
 * This is the main Vue.js application that handles the chat interface
 */
const { createApp, ref, onMounted, nextTick } = Vue;

createApp({
    setup() {
        // Reactive state variables
        const socket = ref(null);              // WebSocket connection
        const isConnected = ref(false);        // Connection status
        const connecting = ref(false);         // Connecting animation state
        const username = ref('');             // Current username
        const tempUsername = ref('');         // Temporary username during setup
        const selectedAvatar = ref('');       // Selected avatar
        const newMessage = ref('');           // Current message being typed
        const messages = ref([]);             // Array of all messages
        const onlineUsers = ref([]);          // Array of online users
        const userTyping = ref(null);         // Currently typing user
        const typingTimeout = ref(null);      // Timeout for typing indicator
        const showEmojiPicker = ref(false);   // Emoji picker visibility
        const messageHistory = ref(null);     // Reference to message history div
        
        // Avatar options
        const avatars = ref([
            'alien1', 'alien2', 'astronaut', 'spaceship', 
            'planet', 'comet', 'satellite', 'ufo', 'rocket'
        ]);
        // Emoji categories for picker
        const emojiCategories = ref({
            'Smileys': ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇'],
            'Animals': ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯'],
            'Food': ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍒', '🍑'],
            'Travel': ['🚀', '🛸', '🌕', '⭐', '🌌', '🪐', '🔭', '👽', '👾', '🤖'],
            'Symbols': ['❤️', '✨', '🔥', '🌟', '💫', '⚡', '🌈', '🌠', '💥', '🛰️']
        });

        // Methods
        /**
         * Handles image loading errors
         * param{Event} event - The error event
         */
        const handleImageError = (event) => {
            event.target.src = selectedAvatar.value;
        };
        /**
         * Establishes WebSocket connection
         */
        const connectWebSocket = () => {
            connecting.value = true;
            socket.value = new WebSocket('ws://localhost:8080');
            // Connection opened
            socket.value.onopen = () => {
                isConnected.value = true;
                connecting.value = false;
                console.log('WebSocket connected');
                // Send join message if username is set
                if (username.value) {
                    socket.value.send(JSON.stringify({
                        type: 'user_join',
                        username: username.value, 
                        avatar: selectedAvatar.value
                    }));
                }
            };
            // Connection closed
            socket.value.onclose = () => {
                isConnected.value = false;
                setTimeout(connectWebSocket, 5000);
            };
            // Connection error
            socket.value.onerror = (error) => {
                console.error('WebSocket error:', error);
                connecting.value = false;
            };
            /**
             * Handles incoming WebSocket messages
             * param {MessageEvent} event - The message event
             */
             socket.value.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    
                    switch (data.type) {
                        // Regular chat message
                        case 'message':
                            messages.value.push({
                                id: data.id,
                                username: data.username,
                                avatar: data.avatar || 'https://i.pravatar.cc/150?img=0',
                                text: data.text,
                                timestamp: data.timestamp,
                                private: data.private || data.text.includes('@' + username.value),
                                reactions: data.reactions || [] ,
                                system: data.system || false
                            });
                            scrollToBottom();
                            break;
                        // Updated user list    
                        case 'user_list':
                            onlineUsers.value = data.users.map(user => ({
                                ...user,
                                avatar: user.avatar || 'https://i.pravatar.cc/150?img=0'
                            }));
                            break;
                            
                        case 'user_join':
                            messages.value.push({
                                system: true,
                                text: `${data.username} has joined the chat`
                            });
                            scrollToBottom();
                            break;
                            
                        case 'user_leave':
                            messages.value.push({
                                system: true,
                                text: `${data.username} has left the chat`
                            });
                            scrollToBottom();
                            break;
                        // Typing indicator    
                        case 'typing':
                            if (data.username !== username.value) {
                                userTyping.value = data;
                                clearTimeout(typingTimeout.value);
                                typingTimeout.value = setTimeout(() => {
                                    userTyping.value = null;
                                }, 2000);
                            }
                            break;
                    }
                } catch (error) {
                    console.error('Error parsing message:', error);
                }
            };
        };
        /**
         * Sets the username and connects to chat
         */
        const setUsername = () => {
            if (tempUsername.value.trim()) {
                username.value = tempUsername.value.trim();
                localStorage.setItem('chat_username', username.value);
                localStorage.setItem('chat_avatar', selectedAvatar.value);
                connectWebSocket();
            }
        };
        /**
         * Sends a chat message
         */
        const sendMessage = () => {
            const messageText = newMessage.value.trim();
            if (messageText && socket.value?.readyState === WebSocket.OPEN) {
                const message = {
                    type: 'message',
                    text: messageText,
                    timestamp: new Date().toISOString(),
                    avatar: selectedAvatar.value
                };
                socket.value.send(JSON.stringify(message));
                newMessage.value = '';
                showEmojiPicker.value = false;
                scrollToBottom();
            }
        };
         /**
         * Handles typing indicator
         */
        const handleTyping = () => {
            if (socket.value?.readyState === WebSocket.OPEN) {
                socket.value.send(JSON.stringify({
                    type: 'typing',
                    username: username.value
                }));
            }
        };
        /**
         * Starts a private message with another user
         * param {string} targetUsername - The username to message
         */
        const startPrivateMessage = (targetUsername) => {
            if (targetUsername !== username.value) {
                newMessage.value = `@${targetUsername} `;
                const input = document.querySelector('.message-input input');
                if (input) input.focus();
            }
        };
        /**
         * Toggles emoji picker visibility
         */
        const toggleEmojiPicker = () => {
            showEmojiPicker.value = !showEmojiPicker.value;
        };
        
        /**
         * Adds an emoji to the message input
         * param {string} emoji - The emoji to add
         */
        const addEmoji = (emoji) => {
            newMessage.value += emoji;
            const input = document.querySelector('.message-input input');
            if (input) input.focus();
        };  
        

        /**
         * Adds a reaction to a message
         * param {number} messageId - The ID of the message to react to
         * param {string} reaction - The reaction emoji
         */
        const addReaction = (messageId, reaction) => {
            if (socket.value?.readyState === WebSocket.OPEN) {
                socket.value.send(JSON.stringify({
                    type: 'reaction',
                    messageId: messageId,
                    reaction: reaction
                }));
            }
        };
        /**
         * Formats a timestamp into a readable time
         * param {string} timestamp - ISO timestamp string
         * returns {string} Formatted time (e.g. "2:30 PM")
         */
        const formatTime = (timestamp) => {
            const date = new Date(timestamp);
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        };
        /**
         * Scrolls the message history to the bottom
         */
        const scrollToBottom = () => {
            nextTick(() => {
                if (messageHistory.value) {
                    messageHistory.value.scrollTop = messageHistory.value.scrollHeight;
                }
            });
        };
        
        

        // Lifecycle hooks - runs when component mounts
        onMounted(() => {
            // Check for saved username/avatar in localStorage
            const savedUsername = localStorage.getItem('chat_username');
            const savedAvatar = localStorage.getItem('chat_avatar');
            
            if (savedUsername) {
                tempUsername.value = savedUsername;
            }
            
            if (savedAvatar) {
                selectedAvatar.value = savedAvatar;
            }
            // Connect to WebSocket
            connectWebSocket();
            // Show welcome message after a short delay
            setTimeout(() => {
                messages.value.push({
                    system: true,
                    text: 'Welcome to Nebula Chat! Connect with travelers across the cosmos.'
                });
                scrollToBottom();
            }, 1000);
            document.addEventListener('click', handleClickOutside);
        });
        
        // Expose all variables and methods to template
        return {
            socket,
            isConnected,
            connecting,
            username,
            tempUsername,
            selectedAvatar,
            newMessage,
            messages,
            onlineUsers,
            userTyping,
            showEmojiPicker,
            messageHistory,
            avatars,
            emojiCategories,
            onMounted,
            connectWebSocket,
            setUsername,
            sendMessage,
            handleTyping,
            startPrivateMessage,
            toggleEmojiPicker,
            addEmoji,
            addReaction,
            formatTime,
            scrollToBottom,
            handleImageError
        };
    }
}).mount('#app');