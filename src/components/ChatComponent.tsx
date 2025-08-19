import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle, X } from 'lucide-react';

interface Message {
  id: string;
  user: string;
  text: string;
  timestamp: Date;
  isOrganizer?: boolean;
}

interface ChatComponentProps {
  tripId: string;
  userName: string;
  isOrganizer?: boolean;
}

export const ChatComponent: React.FC<ChatComponentProps> = ({ 
  tripId, 
  userName, 
  isOrganizer = false 
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatKey = `chat_${tripId}`;

  // Carregar mensagens do localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem(chatKey);
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, [chatKey]);

  // Simular tempo real checando localStorage a cada 2 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      const savedMessages = localStorage.getItem(chatKey);
      if (savedMessages) {
        const parsedMessages = JSON.parse(savedMessages);
        setMessages(parsedMessages);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [chatKey]);

  // Auto scroll para última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      user: userName,
      text: newMessage,
      timestamp: new Date(),
      isOrganizer
    };

    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    localStorage.setItem(chatKey, JSON.stringify(updatedMessages));
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
      >
        <MessageCircle size={24} />
        {messages.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
            {messages.length}
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-80 h-96 bg-white border border-gray-300 rounded-lg shadow-xl z-50 flex flex-col sm:w-80 sm:h-96 max-sm:w-[calc(100vw-2rem)] max-sm:h-[70vh] max-sm:right-2 max-sm:bottom-2">
      {/* Header */}
      <div className="bg-blue-600 text-white p-3 rounded-t-lg flex justify-between items-center">
        <h3 className="font-semibold flex items-center gap-2">
          <MessageCircle size={18} />
          Chat da Viagem
        </h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white hover:text-gray-200"
        >
          <X size={18} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-3 overflow-y-auto space-y-2">
        {messages.length === 0 ? (
          <p className="text-gray-500 text-center text-sm">
            Nenhuma mensagem ainda. Seja o primeiro a falar!
          </p>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex flex-col ${
                message.user === userName ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[75%] p-2 rounded-lg text-sm break-words ${
                  message.user === userName
                    ? 'bg-blue-600 text-white'
                    : message.isOrganizer
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {message.user !== userName && (
                  <p className="font-semibold text-xs mb-1">
                    {message.user} {message.isOrganizer && '(Organizador)'}
                  </p>
                )}
                <p>{message.text}</p>
              </div>
              <span className="text-xs text-gray-500 mt-1">
                {new Date(message.timestamp).toLocaleTimeString('pt-BR', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua mensagem..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};