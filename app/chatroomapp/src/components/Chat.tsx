import React, {useState, useEffect} from "react";
import { useWebSocket } from "../hooks/useWebSocket";
import { Container, Paper, Button, Typography, TextField } from "@mui/material";

export function Chat(){
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const {socket, messages} = useWebSocket('ws://localhost:8000');
    const [typingUser, setTypingUser] = useState(null);

    useEffect(() => {
        console.log("socket:");
        if(!socket) return;
        // socket.onmessage = (event) => {
        //     const data = JSON.parse(event.data);
        //     console.log("Received message:", data);
    
        //     if (data.type === 'error') {
        //         alert(data.message);
        //         setIsConnected(false);
        //         setUsername('');
        //         return;
        //     }
    
        //     if (data.type === 'history') {
        //         console.log("Chat History:", data.messages);
        //     }
        // };
        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if(data.type === 'typing'){
                setTypingUser(data.username);
                setTimeout(() => setTypingUser(null), 2000);
            }
        }
        if (username && isConnected) {
            socket.send(JSON.stringify({type: 'join', username}));
        }
        
        
        // return () => {
        //     if(socket){
        //         socket.onmessage = null;
        //     }
        // }
    }, [socket, isConnected]);

    const sendMessage = () => {
        if(socket && message.trim() !== ''){
            socket.send(JSON.stringify({type: 'message', username, message}));
            setMessage('');
        }
    }

    const handleTyping = () => {
        if(socket && username){
            socket.send(JSON.stringify({type: 'typing', username}));    
        }
    }

    return (
        <Container>
            {
                !isConnected ? (
                    <Paper elevation={3} sx={{ p: 3, mt: 5 }}>
                        {/* <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} /> */}
                        <Typography variant="h6">Enter your username</Typography>
                        <TextField fullWidth value={username} onChange={(e)=>setUsername(e.target.value)}/>
                        <Button variant="contained" sx={{ mt: 2 }}  onClick={() => setIsConnected(true)}>Connect</Button>
                    </Paper>  
                ): (
                    <Paper elevation={3} sx={{ p: 3, mt: 5 }}>
                        <Typography variant="h6">Chat Room</Typography>
                        <div style={{height: "300px", overflowY: 'auto', border: '1px solid #ccc', padding: 10}}>
                            {
                                messages.map((msg, index) => (
                                    <Typography key={index}><strong>{msg.username}</strong>: {msg.message}</Typography>
                                ))
                            }
                            {typingUser && <Typography><em>{typingUser} is typing...</em></Typography>}
                        </div>
                        <TextField
                            label="Message"
                            value={message}
                            onChange={(e) => {
                                setMessage(e.target.value)
                                handleTyping();
                            }}
                            fullWidth
                            />
                        <Button variant="contained" sx={{ mt: 2 }} onClick={() => sendMessage()}>Send</Button>
                    </Paper>
                )
            }
        </Container>
    )
}