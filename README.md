![Screenshot 2025-04-07 031224](https://github.com/user-attachments/assets/e6d8be6f-aa8d-42b5-90a4-44775d24a237)# Nebula-Chat-App
Nebula Chat - A real-time chat application built with Vue.js and WebSockets featuring private messaging, typing indicators, online user lists, and cosmic-themed UI. Perfect for learning real-time communication or as a base for chat applications.
# 🌌 Nebula Chat - Real-Time WebSocket Chat Application
A feature-rich real-time chat application with Vue.js and WebSockets, offering a cosmic-themed UI with modern chat features.
![Screenshot 2025-04-07 031531](https://github.com/user-attachments/assets/fe513861-75f8-4f72-a41c-8068971068e0)
## ✨ Features

- **Real-time messaging** via WebSocket protocol
- **Online user list** with avatars
- **Private messaging** (@mention tagging)
- **Typing indicators** when users are composing
- **Emoji picker** with categorized emojis
- **Message reactions** (click to react)
- **Responsive design** works on mobile/desktop
- **Message history** with timestamps
- **User authentication** with local storage persistence

## 🛠️ Tech Stack

- **Frontend**: Vue.js 3, HTML5, CSS3
- **Backend**: Node.js with `ws` WebSocket library
- **Deployment**: Ready for Vercel/Netlify (frontend) + Render/Heroku (backend)

## 🚀 Quick Start

### Prerequisites
- Node.js v16+
- Git

### Installation
1. Clone the repo:
   ```bash
   git clone https://github.com/Tejpraval/Nebula-Chat-App.git
   cd nebula-chat
   *** node.js  (for Windows/Mac: https://nodejs.org/en)
2. cd server
  npm install ws
  node server.js
3. Open index.html in a browser (use Live Server extension in VS Code for best experience)

### STEP BY STEP PROCESS
1. Download and store the file in a folder
2. open that folder in vs code
3. Make sure your file structure looks like:
/project
  index.html
  styles.css
  app.js
  server.js
  /avatars
    alien1.png
    alien2.png
    ... (all avatar images)
4. make sure you installed node.js  (for Windows/Mac: https://nodejs.org/en) and git bash
5. Verify Installation
   ```bash
   * npm install ws
   After installing, check if node and npm are available:
   
   ```bash
   * node -v  # Should show version (e.g., v18.x.x)
   or
   * npm -v   # Should show version (e.g., 9.x.x)
6. Alternative: Use npx (if you only need a temporary server)
  If you don’t want to install Node.js permanently, you can use npx (comes with Node.js) to run the WebSocket server temporarily:
  bash
  * npx ws --port 8080
  This will start a basic WebSocket server without needing npm install
7. If You Still Get npm: command not found
  Windows: Ensure Node.js is added to PATH (reinstall if needed).
8. How to Navigate to the Correct Directory or PATH
   # Check current directory
   * pwd

   # List folders to verify the path
   * dir  # Windows
   * ls   # Mac/Linux
   # Change directory (cd) to where your server.js is located:
   * cd path/to/your/project/folder
   (Replace path/to/your/project/folder with the actual folder where server.js exists)
9. Run the server
  * node server.js
after giving the top commands it should visible like this in bash
WebSocket server running on ws://localhost:8080
and then run in 


### Advanced Setup 🌟 
  Environment Variables
  Create .env in server directory:

  '''env
  * WS_PORT=8080
  Production Deployment
  Frontend: Host index.html and app.js on Netlify/Vercel
  Backend: Deploy server.js to Render/Heroku

## 📸 Screenshots

| Feature | Preview |
|---------|---------|
| Login Screen | ![Screenshot 2025-04-07 031224](https://github.com/user-attachments/assets/b51fa371-3ddd-4742-967d-02e40d3d403b) |
| Chat Interface | ![Screenshot 2025-04-07 031531](https://github.com/user-attachments/assets/eab01b48-ab71-4891-8c44-0ef9c22bd9f3) |


## 📚 Learning Resources
WebSocket MDN Docs : https://developer.mozilla.org/en-US/docs/Web/API/WebSocket
Vue.js Composition API : https://vuejs.org/guide/extras/composition-api-faq.html
ws Library Docs : https://github.com/websockets/ws

## 📜 License
MIT © [Tej Praval]


## 🤝 Contributing
PRs welcome! Please open an issue first to discuss changes.

### Key Features of This README:
1. **Visual Appeal**: Space-themed emojis and clear sections
2. **Demo-Ready**: Placeholders for GIF/screenshots
3. **Comprehensive Setup**: Covers all installation scenarios
4. **Learning Focus**: Links to relevant docs
5. **Mobile-Friendly**: Clean markdown formatting


