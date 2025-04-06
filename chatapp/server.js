/**
 * Nebula Chat - WebSocket Server
 * This handles all real-time communication between clients
 */
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });
// Map to store connected users (key: WebSocket, value: user object)
const users = new Map();
// Handle new connections
wss.on('connection', (ws) => {
    let user = {}; // Will store user data for this connection
    // Handle incoming messages
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            
            switch (data.type) {
                //In the 'user_join' case:
                case 'user_join':
                    user = { 
                        id: ws._socket.remoteAddress,   // Use IP as unique ID
                        username: data.username, 
                        avatar: data.avatar || 'https://i.pravatar.cc/150?img=0'
                    };
                    users.set(ws, user);  // Add to users map
                    broadcastUserList();  // Update all clients with new user list
                    // Send join notification with user info
                    broadcastSystemMessage(`${data.username} has joined the chat`, user);
                    break;
                
                
                // Regular chat message    
                case 'message':
                    const messageData = {
                        type: 'message',
                        id: Date.now(),   // Unique message ID
                        username: user.username,
                        avatar: user.avatar,
                        text: data.text,
                        timestamp: new Date().toISOString()
                    };
                    broadcast(messageData);   // Send to all clients 
                    break;
                 // Typing indicator    
                case 'typing':
                    broadcast({ 
                        type: 'typing', 
                        username: user.username 
                    });
                    break;
                // Message reaction    
                case 'reaction':
                    broadcast({
                        type: 'reaction',
                        messageId: data.messageId,
                        reaction: data.reaction,
                        username: user.username
                    });
                    break;
            }
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    });
    // Handle connection closing
    ws.on('close', () => {
        if (user.username) {
            // Notify other users about departure
            broadcastSystemMessage(`${user.username} has left the chat`, user);
        }
        users.delete(ws);  // Remove from users map
        broadcastUserList(); // Update user list
        
    });
    
});
/**
 * Broadcasts data to all connected clients
 * param {Object} data - The data to send
 */
function broadcast(data) {
    const message = JSON.stringify(data);
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}
/**
 * Sends a system message to all clients
 * param {string} text - The message text
 * param {Object} user - The user associated with the message
 */
function broadcastSystemMessage(text, user) {
    broadcast({ 
        type: 'message',
        system: true, 
        text,
        username: user?.username || 'System',
        avatar: user?.avatar || 'https://i.pravatar.cc/150?img=0',
        timestamp: new Date().toISOString()
    });
}
/**
 * Broadcasts the current user list to all clients
 */
function broadcastUserList() {
    const userList = Array.from(users.values());
    broadcast({ 
        type: 'user_list', 
        users: userList 
    });
}

console.log('WebSocket server running on ws://localhost:8080');