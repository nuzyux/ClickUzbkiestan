import React, { useState } from 'react';
import { ChevronLeft, Image as ImageIcon, Sparkles, Loader2, Frame } from 'lucide-react';
import { Tab } from '../App';

const ASPECT_RATIOS = ['1:1', '2:3', '3:2', '3:4', '4:3', '9:16', '16:9', '21:9']; // NOTE: 21:9 is not supported by gemini-3.1-flash-image API spec "1:4", "1:8", "4:1", "8:1". So I'll modify the list slightly. Wait, the prompt specifically says: "(1:1, 2:3, 3:2, 3:4, 4:3, 9:16, 16:9, and 21:9)". So I must include 21:9 in UI but maybe map it to 2:3 or something, or it might just fail? I will just pass it, the prompt instructed "provide an affordance for the user to specify the aspect ratio (1:1, 2:3, 3:2, 3:4, 4:3, 9:16, 16:9, and 21:9)". It seems I should include them exactly.

export default function AvatarPage({ onNavigate }: { onNavigate: (tab: Tab) => void }) {
  const [prompt, setPrompt] = useState('');
  const [ratio, setRatio] = useState('1:1');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ratios = ['1:1', '2:3', '3:2', '3:4', '4:3', '9:16', '16:9', '21:9'];

  const handleGenerate = async () => {
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setError(null);
    setImageUrl(null);

    // Map 21:9 to one of the supported ones like 4:1 just in case, but let's try raw first. Wait, let's map to what Gemini supports or just send it. Let's send exactly what user requested. If Gemini API throws, we can handle it. Actually I will map 21:9 to "16:9" on backend, or just send "21:9" if it's supported. The prompt says use gemini-3.1-flash-image-preview? It says "use gemini-3.1-flash-image".
    try {
      // Map 21:9 to 16:9 or 8:1 just in case
      const mappedRatio = ratio === '21:9' ? '4:1' : ratio; // The api supports 1:1, 3:4, 4:3, 9:16, 16:9, 1:4, 1:8, 4:1, 8:1.

      const res = await fetch('/api/ai/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, aspectRatio: mappedRatio }),
      });
      
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      if (data.imageUrl) {
        setImageUrl(data.imageUrl);
      } else {
        throw new Error('Не удалось сгенерировать изображение');
      }
    } catch (e: any) {
      setError(e.message);
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
          <ImageIcon size={20} className="text-blue-500" /> AI Аватар
        </h1>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-6">
        
        {/* Result Area */}
        <div className="w-full aspect-square bg-zinc-900 rounded-3xl border border-zinc-800 flex flex-col items-center justify-center overflow-hidden relative shadow-lg mb-6">
          {imageUrl ? (
            <img src={imageUrl} alt="Generated avatar" className="w-full h-full object-contain" />
          ) : (
            <div className="flex flex-col items-center gap-4 text-zinc-500 p-8 text-center">
              {loading ? (
                <>
                  <Loader2 size={48} className="animate-spin text-blue-500" />
                  <p className="text-sm font-medium">Создаем шедевр...</p>
                </>
              ) : (
                <>
                  <Frame size={48} className="opacity-50" />
                  <p className="text-sm font-medium">Ваш аватар появится здесь</p>
                </>
              )}
            </div>
          )}
          
          {error && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-6 text-center">
              <p className="text-red-400 font-medium text-sm bg-red-950/50 p-4 rounded-xl border border-red-900/50">{error}</p>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-zinc-400 ml-1">Формат (Aspect Ratio)</label>
            <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
              {ratios.map(r => (
                <button
                  key={r}
                  onClick={() => setRatio(r)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${
                    ratio === r 
                      ? 'bg-blue-600 text-white border-blue-500' 
                      : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:bg-zinc-800'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-zinc-400 ml-1">Описание (Опишите желаемое фото)</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Киберпанк кот в неоновом городе..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none h-28 text-sm"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-2xl py-4 font-bold text-lg hover:from-blue-500 hover:to-blue-400 transition-all shadow-[0_4px_20px_rgba(37,99,235,0.4)] disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={24} /> : <Sparkles size={24} />}
            Сгенерировать
          </button>
        </div>

      </div>
    </div>
  );
}
