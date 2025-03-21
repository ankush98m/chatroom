import React, { useState, useEffect, useRef } from "react";
import { useWebSocket } from "../hooks/useWebSocket";
import { Container, Paper, Button, Typography, TextField } from "@mui/material";

export function Chat() {
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const { socket, messages, error, setError, typingUser } = useWebSocket('ws://localhost:8000');
    const chatWindowRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (error) {
            alert(error);
            setIsConnected(false);
            setUsername('')
            setError(null);
        }
        if (socket && username && isConnected) {
            socket.send(JSON.stringify({ type: 'join', username }));
        }
    }, [socket, isConnected, error]);

    useEffect(() => {
        if (chatWindowRef.current) {
            chatWindowRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const sendMessage = () => {
        if (socket && message.trim() !== '') {
            socket.send(JSON.stringify({ type: 'message', username, message }));
            setMessage('');
        }
    }

    const handleTyping = () => {
        if (socket && username) {
            socket.send(JSON.stringify({ type: 'typing', username }));
        }
    }

    return (
        <Container>
            {
                !isConnected ? (
                    <Paper elevation={3} sx={{ p: 3, mt: 5 }}>
                        {/* <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} /> */}
                        <Typography variant="h6">Enter your username</Typography>
                        <TextField
                            fullWidth
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            error={!!error}
                            helperText={error} />
                        <Button variant="contained" sx={{ mt: 2 }} onClick={() => setIsConnected(true)}>Connect</Button>
                    </Paper>
                ) : (
                    <Paper elevation={3} sx={{ p: 3, mt: 5 }}>
                        <Typography variant="h6">Chat Room</Typography>
                        <div style={{
                            height: "300px",
                            overflowY: 'auto',
                            border: '1px solid #ccc',
                            padding: 10,
                        }}
                        >
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column-reverse'
                            }}>
                                {
                                    [...messages].map((msg, index) => (
                                        <Typography key={index} sx={{
                                            textAlign: msg.username === username ? 'right' : 'left',
                                            backgroundColor: msg.username === username ? '#f0f0f0' : '#e0e0e0',
                                            padding: '10px',
                                            alignSelf: msg.username === username ? 'flex-end' : 'flex-start',
                                            borderRadius: 5,
                                            margin: '5px 0',
                                            maxWidth: '50%',
                                            width: 'fit-content',
                                            marginBottom: '5px',
                                            marginLeft: msg.username === username ? '0' : '10px',
                                            marginRight: msg.username === username ? '10px' : '0'
                                        }}><strong>{msg.username}</strong>: {msg.message}</Typography>
                                    ))
                                }

                            </div>
                            {typingUser && typingUser !== username && <Typography><em>{typingUser} is typing...</em></Typography>}
                            <div ref={chatWindowRef}/>
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