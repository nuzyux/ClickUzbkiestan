import React, { useState } from 'react';
import { ChevronLeft, Plus, CreditCard, Bell, Shield, Wallet, Trash2, Check, Settings2, Moon, Sun, Smartphone, Sparkles } from 'lucide-react';
import { Tab } from '../App';

interface PaymentCard {
  id: string;
  number: string;
  type: string;
  color: string;
}

export default function SettingsPage({ onNavigate }: { onNavigate: (tab: Tab) => void }) {
  const [cards, setCards] = useState<PaymentCard[]>([
    { id: '1', number: '••• 4251', type: 'Uzcard', color: 'from-blue-600 to-blue-400' },
    { id: '2', number: '••• 8910', type: 'Humo', color: 'from-emerald-600 to-emerald-400' }
  ]);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardNumber, setNewCardNumber] = useState('');

  const [notifications, setNotifications] = useState({
    push: true,
    sms: false,
    payments: true,
    marketing: false
  });

  const handleAddCard = () => {
    if (newCardNumber.length < 4) return;
    const newCard: PaymentCard = {
      id: Date.now().toString(),
      number: `••• ${newCardNumber.slice(-4)}`,
      type: 'Custom',
      color: 'from-purple-600 to-purple-400'
    };
    setCards([...cards, newCard]);
    setIsAddingCard(false);
    setNewCardNumber('');
  };

  const removeCard = (id: string) => {
    setCards(cards.filter(c => c.id !== id));
  };

  return (
    <div className="flex flex-col w-full min-h-full pb-6 bg-black relative">
      <div className="sticky top-0 z-20 flex items-center gap-3 px-4 py-4 bg-black/80 backdrop-blur-md">
        <button onClick={() => onNavigate('home')} className="text-white p-1 hover:bg-zinc-800 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-white tracking-tight">Настройки</h1>
      </div>

      <div className="px-5 pt-2 flex flex-col gap-8">
        
        {/* Profile Info */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg border-2 border-zinc-800">
            <span className="text-2xl font-bold">JD</span>
          </div>
          <div>
            <h2 className="text-white font-bold text-lg">John Doe</h2>
            <p className="text-zinc-400 text-sm font-medium">+998 90 123 45 67</p>
          </div>
        </div>

        {/* Payment Cards Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold text-lg flex items-center gap-2">
              <Wallet size={20} className="text-blue-500"/>
              Мои Карты
            </h3>
            <button 
              onClick={() => setIsAddingCard(!isAddingCard)}
              className="text-blue-500 p-1 bg-blue-500/10 rounded-full hover:bg-blue-500/20 transition-colors"
            >
              {isAddingCard ? <ChevronLeft size={18} /> : <Plus size={18} />}
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {isAddingCard && (
              <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800 animate-in fade-in slide-in-from-top-4">
                <p className="text-sm text-zinc-400 mb-3 font-medium">Добавить новую карту</p>
                <input 
                  type="text" 
                  placeholder="Номер карты (последние 4 цифры)" 
                  value={newCardNumber}
                  onChange={(e) => setNewCardNumber(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <button 
                  onClick={handleAddCard}
                  className="w-full mt-3 bg-blue-500 text-white rounded-xl py-3 font-semibold hover:bg-blue-600 transition-colors"
                >
                  Добавить
                </button>
              </div>
            )}

            {cards.map(card => (
              <div key={card.id} className={`bg-gradient-to-r ${card.color} rounded-2xl p-4 shadow-lg flex items-center justify-between`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <CreditCard size={20} className="text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold tracking-wider">{card.number}</h4>
                    <p className="text-white/80 text-xs font-medium uppercase tracking-widest">{card.type}</p>
                  </div>
                </div>
                <button 
                  onClick={() => removeCard(card.id)}
                  className="text-white/60 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Notifications Section */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Bell size={20} className="text-blue-500"/>
            <h3 className="text-white font-bold text-lg">Уведомления</h3>
          </div>

          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
            <ToggleRow 
              label="Push-уведомления" 
              description="Рекомендуется для безопасности"
              checked={notifications.push} 
              icon={<Smartphone size={18} className="text-zinc-400" />}
              onChange={(v) => setNotifications(prev => ({...prev, push: v}))} 
            />
            <div className="h-px bg-zinc-800 mx-4" />
            <ToggleRow 
              label="SMS-уведомления" 
              description="Платная услуга (500 сум/мес)"
              checked={notifications.sms} 
              icon={<Check size={18} className="text-zinc-400" />}
              onChange={(v) => setNotifications(prev => ({...prev, sms: v}))} 
            />
            <div className="h-px bg-zinc-800 mx-4" />
            <ToggleRow 
              label="Операции по картам" 
              checked={notifications.payments} 
              icon={<CreditCard size={18} className="text-zinc-400" />}
              onChange={(v) => setNotifications(prev => ({...prev, payments: v}))} 
            />
            <div className="h-px bg-zinc-800 mx-4" />
            <ToggleRow 
              label="Акции и кэшбэк" 
              checked={notifications.marketing} 
              icon={<Sparkles size={18} className="text-zinc-400" />}
              onChange={(v) => setNotifications(prev => ({...prev, marketing: v}))} 
            />
          </div>
        </section>

      </div>
    </div>
  );
}

function ToggleRow({ label, description, checked, onChange, icon }: { label: string, description?: string, checked: boolean, onChange: (val: boolean) => void, icon?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center gap-3">
        {icon && <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">{icon}</div>}
        <div className="flex flex-col">
          <span className="text-white font-medium text-sm">{label}</span>
          {description && <span className="text-xs text-zinc-500 mt-0.5">{description}</span>}
        </div>
      </div>
      <button 
        onClick={() => onChange(!checked)}
        className={`w-12 h-7 rounded-full p-1 transition-colors duration-300 relative flex items-center ${checked ? 'bg-blue-500' : 'bg-zinc-700'}`}
      >
        <div className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </div>
  );
}
