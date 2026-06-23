import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, Search, Sparkles, Send, BrainCircuit, Globe, Loader2 } from 'lucide-react';
import { Tab } from '../App';
import ReactMarkdown from 'react-markdown';

type Message = {
  role: 'user' | 'assistant';
  content: string;
  type: 'search' | 'think' | 'fast';
};

export default function AssistantPage({ onNavigate }: { onNavigate: (tab: Tab) => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'search' | 'think' | 'fast'>('fast');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: input, type: mode };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      let endpoint = '';
      if (mode === 'search') endpoint = '/api/ai/search';
      else if (mode === 'think') endpoint = '/api/ai/think';
      else endpoint = '/api/ai/fast';

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userMessage.content }),
      });
      
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setMessages(prev => [...prev, { role: 'assistant', content: data.text, type: mode }]);
    } catch (e: any) {
      setMessages(prev => [...prev, { role: 'assistant', content: `**Ошибка:** ${e.message}`, type: mode }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-black relative">
      <div className="flex items-center justify-between px-4 py-4 bg-zinc-900 border-b border-zinc-800">
        <button onClick={() => onNavigate('home')} className="text-white hover:bg-zinc-800 p-2 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-bold text-white flex items-center gap-2">
          <Sparkles size={20} className="text-blue-500" /> AI Assistant
        </h1>
        <div className="w-10"></div>
      </div>

      {/* Mode Selector */}
      <div className="flex px-4 py-3 gap-2 bg-zinc-900/50 justify-center">
        <ModeButton 
          active={mode === 'fast'} 
          onClick={() => setMode('fast')} 
          icon={<Sparkles size={16} />} 
          label="Быстрый" 
          color="blue"
        />
        <ModeButton 
          active={mode === 'search'} 
          onClick={() => setMode('search')} 
          icon={<Globe size={16} />} 
          label="Поиск" 
          color="green"
        />
        <ModeButton 
          active={mode === 'think'} 
          onClick={() => setMode('think')} 
          icon={<BrainCircuit size={16} />} 
          label="Анализ" 
          color="purple"
        />
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-5">
        {messages.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6 opacity-60">
            <Sparkles size={48} className="text-blue-500 mb-4 opacity-50" />
            <h2 className="text-xl font-bold text-white mb-2">Начните диалог</h2>
            <p className="text-sm text-zinc-400">Спросите меня о чем угодно. Выберите режим "Поиск" для актуальной информации или "Анализ" для сложных задач.</p>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
              m.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-zinc-800 text-zinc-100 rounded-bl-none'
            }`}>
              {m.role === 'assistant' && (
                <div className="flex items-center gap-1.5 mb-2 opacity-50 text-[10px] uppercase font-bold tracking-wider">
                  {m.type === 'search' && <><Globe size={10} /> С учетом интернета</>}
                  {m.type === 'think' && <><BrainCircuit size={10} /> Глубокий анализ</>}
                  {m.type === 'fast' && <><Sparkles size={10} /> Быстрый ответ</>}
                </div>
              )}
              <div className="text-sm prose prose-invert prose-p:leading-relaxed prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-700 max-w-none">
                <ReactMarkdown>{m.content}</ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex justify-start">
            <div className="bg-zinc-800 rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-2 text-zinc-400 text-sm">
              <Loader2 size={16} className="animate-spin text-blue-500" />
              <span>Генерирую...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-zinc-900 border-t border-zinc-800 pb-8">
        <div className="flex items-center gap-2 bg-black rounded-full p-1.5 border border-zinc-700 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Задайте вопрос..." 
            className="flex-1 bg-transparent border-none outline-none text-white text-sm px-4 placeholder-zinc-500"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white disabled:opacity-50 disabled:bg-zinc-700 hover:bg-blue-500 transition-colors shrink-0"
          >
            <Send size={18} className="translate-y-[1px] translate-x-[-1px]" />
          </button>
        </div>
      </div>
    </div>
  );
}

function ModeButton({ active, onClick, icon, label, color }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, color: string }) {
  const colorMap: Record<string, string> = {
    blue: active ? 'bg-blue-500/20 text-blue-400 border-blue-500/50' : 'bg-zinc-800 text-zinc-400 border-transparent',
    green: active ? 'bg-green-500/20 text-green-400 border-green-500/50' : 'bg-zinc-800 text-zinc-400 border-transparent',
    purple: active ? 'bg-purple-500/20 text-purple-400 border-purple-500/50' : 'bg-zinc-800 text-zinc-400 border-transparent',
  };

  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${colorMap[color]}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
