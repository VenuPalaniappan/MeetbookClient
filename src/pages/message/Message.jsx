import React, { useState } from 'react';

function Message({ onSend }) {
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setMessage(e.target.value);
    };

    const handleSend = (e) => {
        e.preventDefault();
        if (message.trim()) {
            onSend(message);
            setMessage('');
        }
    };

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            {/* Left bar */}
            <div style={{ width: '60px', background: '#222', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 0' }}>
                <button style={{ background: 'none', border: 'none', color: '#fff', marginBottom: '16px', cursor: 'pointer', fontSize: '24px' }}>
                    💬
                </button>
                {/* Additional icons can be added here */}
            </div>

            {/* Message panel */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#f0f0f0' }}>
                {/* Messages display area (placeholder) */}
                <div style={{ flex: 1, padding: '16px', overflowY: 'auto' }}>
                    {/* Messages would be listed here */}
                    <p style={{ color: '#888' }}>Start the conversation...</p>
                </div>

                {/* Input area */}
                <form onSubmit={handleSend} style={{ display: 'flex', padding: '12px', background: '#fff', borderTop: '1px solid #ccc' }}>
                    <input
                        type="text"
                        value={message}
                        onChange={handleChange}
                        placeholder="Type your message..."
                        style={{ flex: 1, padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc', marginRight: '8px' }}
                    />
                    <button type="submit" style={{ padding: '10px 16px', fontSize: '16px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px' }}>
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Message;
