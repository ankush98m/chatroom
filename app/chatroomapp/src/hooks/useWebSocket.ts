import { useEffect, useState } from "react";

export function useWebSocket(url: string) {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [messages, setMessages] = useState<{username: string, message: string}[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const ws = new WebSocket(url);
        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.type === 'history') {
                setMessages(message.messages);
            } else if (message.type === 'message') {
                setMessages((prev) => [...prev, {username: message.username, message: message.message}]);
            } else if (message.type === 'error') {
                setError(message.message);
            }
        }
        setSocket(ws);
        return () => {
            ws.close();
        }
    }, [url]);
    return { socket, messages, error, setError };
}