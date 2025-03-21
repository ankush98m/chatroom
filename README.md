# chatroom Application
This project is a simple real-time chat application using WebSockets, Express, and SQLite. Users can join the chat, send and receive messages, and leave the chat room. The backend stores chat history and manages users connected to the WebSocket server.

## Feature
- Real-time messaging: Messages are sent and received instantly through WebSockets.
- Chat history: Messages are stored in an SQLite database and can be fetched when a new user joins the chat.
- User typing notifications: Users can see when others are typing.
- Leave chat: Users can leave the chat, and other users will be notified when someone leaves.

## Architecture
### Frontend
- React (Client-Side): The frontend is built using React and Material UI. The app interacts with the WebSocket server to send messages, display incoming messages, and handle user interactions.
- WebSocket (Client-Side): Uses WebSockets to establish a real-time connection with the backend, allowing for instant message delivery.

### Backend
- Express (Server-Side): The backend is a Node.js Express server responsible for managing WebSocket connections.
- WebSocket (Server-Side): The server uses the ws WebSocket library to handle real-time communication between the clients and the backend.
- SQLite (Database): The chat history is stored in an SQLite database. Messages are saved to the database when sent and fetched when a new user joins.

## Flow of Communication
1. User joins the chat:
- When a user enters the chat room, the frontend sends a WebSocket message of type join with the username.
- If the username is available, the backend accepts the connection, adds the user to the clients map, and sends back the chat history.

2. Sending a message:
- When a user sends a message, the frontend sends a WebSocket message of type message with the username and message content.
- The backend stores the message in the database and broadcasts it to all other connected clients.

3. Typing notifications:
- When a user starts typing, the frontend sends a WebSocket message of type typing with the username.
- The backend broadcasts this information to all clients, notifying others that a user is typing.

4. User leaves the chat:

- When a user chooses to leave the chat, the frontend sends a WebSocket message of type leave with the username.
- The backend removes the user from the clients map and broadcasts that the user has left the chat.

## Setup Guide 
### Prerequisites
- Node.js: Make sure you have Node.js installed. You can download it from here.
- SQLite: The backend uses SQLite, which is included by default in the project.

### backend or server setup
1. clone repository
2. open terminal and go to the server directory
3. run npm install in terminal
4. run ts-node index.ts to start the server

### Frontend or client setup
1. Change directory to chatroomapp
2. run npm install 
3. run npm start to start the react app
4. The application will start running at http://localhost:3000

## Technologies Used
- Node.js: Server-side JavaScript runtime.
- Express: Web framework for handling HTTP requests.
- WebSockets: Real-time communication between the frontend and backend.
- SQLite: A lightweight database to store chat history.
- React: Frontend UI library.
- Material UI: React components for building a responsive UI.

## Design
1. Real-time Communication:
- WebSocket connections allow for low-latency, real-time messaging.
- Each message is sent and received instantly by all connected clients.

2. User Authentication:
- Basic username-based authentication is used. The server checks if the username is already taken before allowing a new connection.

3. Message Storage:
- Messages are stored in SQLite, allowing the application to fetch recent chat history for new users.

4. Typing Notifications:
- Users are notified when another user is typing a message, improving the real-time experience.