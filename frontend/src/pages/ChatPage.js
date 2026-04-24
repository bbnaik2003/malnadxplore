import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

let socket;

const ChatPage = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [online, setOnline] = useState(1);
  const [room] = useState('general');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || (process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000');
    socket = io(SOCKET_URL, { transports: ['websocket', 'polling'] });

    socket.emit('joinRoom', { room, user: user.name });

    socket.on('message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    socket.on('roomData', ({ users }) => {
      setOnline(users?.length || 1);
    });

    // Welcome message
    setMessages([{
      id: 'welcome',
      text: `Welcome to the MalnadXplore community chat, ${user.name}! 👋 Connect with fellow travelers.`,
      user: 'MalnadXplore Bot',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSystem: true,
    }]);

    return () => { socket.disconnect(); };
  }, [user.name, room]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const msg = {
      id: Date.now(),
      text: input.trim(),
      user: user.name,
      userId: user._id,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      room,
    };
    socket.emit('chatMessage', msg);
    setMessages(prev => [...prev, { ...msg, isMine: true }]);
    setInput('');
  };

  return (
    <div style={{ paddingTop: 80, height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="container" style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingBottom: 24, maxWidth: 860 }}>
        {/* Header */}
        <div className="glass-card" style={{ padding: '16px 24px', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20 }}>Traveler Community Chat</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent3)', animation: 'glow 2s infinite' }} />
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{online} online · #general</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['general', 'trips', 'tips'].map(r => (
              <span key={r} className={`tag ${r === room ? '' : ''}`} style={{ cursor: 'pointer', fontSize: 12 }}>#{r}</span>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="glass-card" style={{ flex: 1, padding: '20px', overflowY: 'auto', marginBottom: 16 }}>
          {messages.map((msg, i) => {
            const isMine = msg.isMine || msg.userId === user._id;
            const isSystem = msg.isSystem;

            if (isSystem) return (
              <div key={msg.id || i} style={{ textAlign: 'center', margin: '12px 0' }}>
                <span style={{ fontSize: 12, color: 'var(--text-dim)', background: 'rgba(255,255,255,0.03)', padding: '4px 12px', borderRadius: 100 }}>{msg.text}</span>
              </div>
            );

            return (
              <div key={msg.id || i} style={{ display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start', marginBottom: 16, gap: 10, alignItems: 'flex-end' }}>
                {!isMine && (
                  <div className="avatar" style={{ width: 32, height: 32, fontSize: 12, flexShrink: 0 }}>
                    {msg.user?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div style={{ maxWidth: '65%' }}>
                  {!isMine && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4, marginLeft: 4 }}>{msg.user}</div>}
                  <div style={{
                    padding: '10px 14px', borderRadius: isMine ? '14px 4px 14px 14px' : '4px 14px 14px 14px',
                    background: isMine ? 'linear-gradient(135deg, #4299e1, #3182ce)' : 'rgba(255,255,255,0.06)',
                    border: isMine ? 'none' : '1px solid var(--border)',
                    fontSize: 14, lineHeight: 1.6,
                    boxShadow: isMine ? '0 4px 12px rgba(66,153,225,0.25)' : 'none',
                  }}>
                    {msg.text}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-dim)', marginTop: 4, textAlign: isMine ? 'right' : 'left', marginRight: isMine ? 4 : 0, marginLeft: !isMine ? 4 : 0 }}>{msg.time}</div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={sendMessage}>
          <div style={{ display: 'flex', gap: 10 }}>
            <input
              className="input-3d"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Message the community..."
              style={{ flex: 1 }}
            />
            <button type="submit" className="btn-primary" style={{ padding: '12px 20px', flexShrink: 0 }}>
              Send ➤
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;
