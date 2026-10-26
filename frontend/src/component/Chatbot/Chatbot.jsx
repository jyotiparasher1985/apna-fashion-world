import React, { useState, useRef, useEffect } from 'react';
import './Chatbot.css';
import { API_BASE } from '../../api';

const WELCOME =
  "नमस्ते! 👋 Welcome to Apna Fashion World!\n\n" +
  "मैं आपका shopping assistant हूँ। 😊\n\n" +
  "मैं आपकी मदद कर सकता हूँ:\n" +
  "- 👗 Products और latest collection खोजने में\n" +
  "- 💰 Price, size और colour की जानकारी पाने में\n" +
  "- 🛍️ Order और payment से जुड़े सवालों में\n" +
  "- 🚚 Delivery, cancellation, return और refund की जानकारी में\n" +
  "- 🙋 Customer support तक पहुँचने में\n\n" +
  "बताइए, मैं आपकी क्या मदद कर सकता हूँ?";

// Render plain text with clickable URLs.
const renderText = (text) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = String(text || '').split(urlRegex);
  return parts.map((part, i) => {
    if (urlRegex.test(part)) {
      // reset lastIndex (global regex state)
      urlRegex.lastIndex = 0;
      return (
        <a key={i} href={part} target="_blank" rel="noopener noreferrer">
          {part}
        </a>
      );
    }
    urlRegex.lastIndex = 0;
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, role: 'assistant', text: WELCOME }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { id: Date.now(), role: 'user', text: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.text,
          history: messages.map((m) => ({ role: m.role, content: m.text }))
        })
      });

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'assistant',
          text: data.reply || 'Kripya thodi der baad prayas karein.'
        }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'assistant',
          text: 'Server se connect karne me samasya aayi. Kripya backend status check karein.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-wrapper">
      <button
        className={`chatbot-toggle-btn ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Chat"
      >
        {isOpen ? '✕' : '👩'}
      </button>

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-title">
              <span className="status-dot"></span>
              <h4>Apna Buddy</h4>
            </div>
            <button className="chatbot-close-icon" onClick={() => setIsOpen(false)}>
              ✕
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`chat-bubble-row ${msg.role}`}>
                <div className={`chat-bubble ${msg.role}`}>
                  {renderText(msg.text)}
                </div>
              </div>
            ))}
            {loading && (
              <div className="chat-bubble-row assistant">
                <div className="chat-bubble assistant typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="chatbot-input-bar" onSubmit={handleSend}>
            <input
              type="text"
              placeholder="Apna sawal yahan likhein..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              autoFocus
            />
            <button type="submit" disabled={loading || !input.trim()}>
              ➤
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;