
import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, Sparkles } from 'lucide-react';
import { Transaction, BankAccount } from '../types';
import { createFinanceChat } from '../gemini';
import { Chat } from '@google/genai';

interface AIChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
  accounts: BankAccount[];
}

const AIChatDrawer: React.FC<AIChatDrawerProps> = ({ isOpen, onClose, transactions, accounts }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string }[]>([
    { role: 'ai', content: '您好！我是您的 AI 財務助手。我可以幫您分析收支、建議存錢計畫，或解答理財疑問。請問今天想聊些什麼？' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<Chat | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && !chatRef.current) {
      chatRef.current = createFinanceChat(transactions, accounts, []);
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      if (!chatRef.current) throw new Error('Chat session not started');
      
      const result = await chatRef.current.sendMessage({ message: userMsg });
      setMessages(prev => [...prev, { role: 'ai', content: result.text || '我暫時無法回應，請稍後再試。' }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', content: '對不起，目前與 AI 連線出現問題。' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60]" onClick={onClose}></div>
      )}
      
      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full md:w-[450px] bg-white shadow-2xl z-[70] transform transition-transform duration-500 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <header className="p-6 border-b border-slate-100 flex justify-between items-center bg-indigo-600 text-white">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="font-black">智慧財務助手</h2>
              <p className="text-[10px] text-indigo-100 font-bold uppercase tracking-widest">Powered by Gemini 3.0</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <X size={24} />
          </button>
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600'}`}>
                  {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                </div>
                <div className={`p-4 rounded-[24px] text-sm leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white text-slate-700 rounded-tl-none'}`}>
                  {msg.content}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white text-indigo-600 flex items-center justify-center shadow-sm">
                  <Bot size={20} />
                </div>
                <div className="bg-white p-4 rounded-[24px] rounded-tl-none shadow-sm flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-100"></span>
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-200"></span>
                </div>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSend} className="p-6 bg-white border-t border-slate-100 flex gap-3">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="詢問財務分析或建議..."
            className="flex-1 bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-600"
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isLoading}
            className="bg-indigo-600 text-white p-4 rounded-2xl hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:scale-95"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </>
  );
};

export default AIChatDrawer;
