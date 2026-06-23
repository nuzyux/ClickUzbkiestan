import React, { useState, useEffect, useRef } from 'react';
import { User, Search, QrCode, ScanBarcode, Smartphone, Plus, Car, Home, Phone, Flame, Zap, Wallet, Plane, Ticket, ShoppingBag, Landmark, Heart, EyeOff, Bell, ArrowRight, ShieldAlert, Star, ChevronRight, LayoutGrid, Award, CheckCircle2, Trophy, Clock, Loader2, Edit3 } from 'lucide-react';
import { Tab } from '../App';
import { motion, useAnimation } from 'motion/react';

export default function HomePage({ onNavigate }: { onNavigate: (tab: Tab) => void }) {
  const [totalBalance, setTotalBalance] = useState('107 657');
  const [walletBalance, setWalletBalance] = useState('3 239');
  
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullY, setPullY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);

  const controls = useAnimation();

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      touchStartY.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (window.scrollY > 0 || isRefreshing) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - touchStartY.current;
    if (diff > 0) {
       // Slow down the pull effect
       setPullY(Math.min(diff * 0.4, 100));
    }
  };

  const handleTouchEnd = async () => {
    if (pullY > 60) {
      setIsRefreshing(true);
      setPullY(60); // Hold it there
      // Simulate network wait
      await new Promise(r => setTimeout(r, 1500));
      setIsRefreshing(false);
    }
    setPullY(0);
  };

  return (
    <div 
      className="flex flex-col w-full min-h-full pb-6 bg-[#0a0a0a] relative"
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div 
        className="absolute top-0 left-0 w-full flex items-center justify-center opacity-0 z-10"
        style={{ 
          height: 60, 
          transform: `translateY(${Math.max(0, pullY - 60)}px)`,
          opacity: pullY > 10 ? (pullY / 60) : 0 
        }}
      >
        <Loader2 className={`text-[#007BFF] w-6 h-6 ${isRefreshing ? 'animate-spin' : ''}`} style={{ transform: `rotate(${pullY * 3}deg)` }} />
      </div>

      <motion.div 
        animate={{ y: pullY }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="flex flex-col w-full h-full relative z-20 bg-[#0a0a0a]"
      >
      {/* Top Bar */}
      <div className="sticky top-0 z-20 flex items-center gap-3 px-4 py-3 bg-[#0a0a0a]">
        <button 
          onClick={() => onNavigate('settings')}
          className="w-12 h-12 rounded-full bg-[#007BFF] text-white flex items-center justify-center shrink-0 relative">
          <User size={28} />
          {/* Status check badge */}
          <div className="absolute bottom-0 right-0 w-4 h-4 bg-white rounded-full flex items-center justify-center">
            <CheckCircle2 size={16} className="text-[#007BFF] fill-current" />
          </div>
        </button>
        
        <div className="flex-1 flex items-center bg-[#1e1e1e] rounded-xl h-11 px-3 text-zinc-400">
          <Search size={20} className="shrink-0 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search" 
            className="bg-transparent border-none outline-none w-full px-2 text-[15px] text-white placeholder-zinc-500"
            onClick={() => onNavigate('assistant')}
            readOnly
          />
        </div>

        <button className="text-[#007BFF] w-11 h-11 flex items-center justify-center relative">
          <Bell size={24} className="fill-current" />
          <div className="absolute top-2.5 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#0a0a0a]" />
        </button>
      </div>

      <div className="flex px-4 pt-1 pb-4">
        {/* Click Business side badge */}
        <div className="w-8 flex flex-col items-center justify-start pr-2">
           <div className="-rotate-90 origin-center translate-y-12 whitespace-nowrap text-[11px] font-bold tracking-wider text-black bg-white rounded flex items-center gap-1 px-2 py-0.5 mt-8">
             <div className="w-2.5 h-2.5 rounded-full bg-[#007BFF]" />
             click<span className="text-[#007BFF]">Business</span>
           </div>
        </div>

        <div className="flex-1 flex flex-col">
          {/* Balance Section */}
          <div className="flex justify-between items-start mt-2">
            <div className="flex flex-col w-full">
              <span className="text-[#888888] text-[13px] font-normal tracking-wide">Total balance</span>
              <div className="flex items-baseline gap-2 mt-0.5 group relative">
                <input 
                  type="text"
                  value={totalBalance}
                  onChange={(e) => setTotalBalance(e.target.value)}
                  className="text-[34px] font-bold tracking-tight text-white leading-none bg-transparent outline-none w-[160px] border-b border-transparent focus:border-[#333] transition-colors"
                />
                <span className="text-xl font-medium text-white">UZS</span>
                <Edit3 size={14} className="text-zinc-600 opacity-50 ml-1 absolute right-6 top-2" />
              </div>
            </div>
            <button className="text-zinc-500 hover:text-zinc-300 transition-colors mt-1 pr-1 shrink-0">
              <EyeOff size={22} className="opacity-80" />
            </button>
          </div>

          <div className="mt-5 flex items-center justify-between">
            <div className="flex flex-col gap-0.5 relative">
              <span className="text-[13px] text-[#888888] font-normal">My wallet</span>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="w-5 h-5 bg-[#007BFF] rounded-full flex items-center justify-center shrink-0">
                  <div className="w-2.5 h-2.5 bg-[#0a0a0a] rounded-full border border-[#007BFF]" />
                </div>
                <input 
                  type="text"
                  value={walletBalance}
                  onChange={(e) => setWalletBalance(e.target.value)}
                  className="font-bold text-[17px] text-white bg-transparent outline-none w-[60px] text-right border-b border-transparent focus:border-[#333] transition-colors"
                />
                <span className="font-normal text-[15px] text-white">UZS</span>
                <Edit3 size={12} className="text-zinc-600 opacity-50 absolute right-[-20px]" />
              </div>
            </div>

            <button className="bg-gradient-to-r from-[#2176ff] to-[#7f00ff] rounded-full pl-3 pr-4 h-[38px] flex items-center gap-2 relative overflow-hidden">
              <Trophy size={16} className="text-white/80" />
              <span className="text-white font-bold text-[13px] leading-none text-left">
                Watch 2026<br/>World Cup
              </span>
              <div className="absolute right-0 top-0 bottom-0 w-3 bg-[#aaff00] transform skew-x-12 translate-x-1 rounded-sm shadow-sm" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="flex justify-between items-stretch gap-2.5 px-4 mt-2">
        <QuickAction icon={<ScanBarcode size={28} className="text-[#007BFF]" />} label="Click\nPass" />
        <QuickAction icon={<Smartphone size={28} className="text-[#007BFF]" />} label="Click\nBoom" />
        <QuickAction icon={<Wallet size={28} className="text-[#007BFF]" />} label="Cards and\nwallet" />
        <QuickAction icon={<QrCode size={28} className="text-[#007BFF]" />} label="QR\nscanner" />
      </div>

      {/* My Click Banner */}
      <div className="px-4 mt-4">
         <div className="bg-[#1c1c1e] rounded-[20px] p-4 flex items-center gap-3 relative">
            <div className="w-10 h-10 bg-[#007BFF] rounded-full flex items-center justify-center shrink-0">
               <div className="w-4 h-4 bg-white rotate-45 transform scale-x-75" />
            </div>
            <div className="flex flex-col flex-1 overflow-hidden">
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-base">My Click</span>
                <span className="px-1.5 py-0.5 bg-[#007BFF] text-white text-[10px] font-bold rounded shrink-0">NEW</span>
              </div>
              <span className="text-[#888888] text-[13px] truncate">Add a Home or Car and track important even...</span>
            </div>
            <ChevronRight size={20} className="text-zinc-500" />
         </div>
      </div>

      {/* World Cup Banner */}
      <div className="px-4 mt-4">
        <div className="w-full bg-[#1e2336] rounded-[20px] h-32 flex items-center justify-between overflow-hidden relative">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518605368461-1ee71168f8ce?auto=format&fit=crop&q=80&w=600')] bg-cover bg-center mix-blend-overlay opacity-60" />
          <div className="relative z-10 p-4 pl-0">
             <div className="bg-[#007BFF] rounded-r-xl py-3 px-4 shadow-lg w-[180px]">
               <h3 className="text-white font-extrabold text-[17px] leading-tight italic">
                 WC2026<br/>Match Schedule
               </h3>
             </div>
          </div>
          <img src="https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?auto=format&fit=crop&q=80&w=200&h=200" alt="Players" className="absolute right-0 h-full w-auto object-cover opacity-80" style={{ maskImage: 'linear-gradient(to right, transparent, black 40%)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 40%)' }} />
        </div>
      </div>

      {/* Mini Apps Section */}
      <div className="px-4 mt-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-bold text-xl tracking-tight">Mini Apps</h2>
          <button className="text-[#007BFF] text-[15px] font-medium hover:text-blue-400 transition-colors">See all</button>
        </div>

        <div className="grid grid-cols-4 gap-y-7 gap-x-2">
          <MiniApp icon={<Heart size={26} className="text-[#ff6b00]" />} title="Inson Uchun" color="#fff" iconColor="#ff6b00" />
          <MiniApp icon={<Home size={26} className="text-[#7f00ff]" />} title="Click Home" color="#fff" iconColor="#7f00ff" />
          <MiniApp icon={<Plane size={26} className="text-white fill-current" />} badge="-15%" badgeColor="bg-[#ff0055]" title="Click Travel" bgColor="#a020f0" />
          <MiniApp icon={<Award size={26} className="text-white fill-current" />} title="Click\nSubcriptions" bgColor="#333" />
          
          <MiniApp icon={<Clock size={26} className="text-[#007BFF]" />} title="Card\nmonitoring" color="#fff" iconColor="#007BFF" />
          <MiniApp icon={<Car size={26} className="text-[#00C254]" />} title="Click Avto" color="#fff" iconColor="#00C254" />
          <MiniApp icon={<div className="font-bold text-white leading-none text-center"><span className="text-[10px]">max</span><br/><span className="text-[12px]">way</span></div>} title="MaxWay" badge="0 sum" badgeColor="bg-[#00C254]" bgColor="#7f00ff" />
          <MiniApp icon={<div className="font-bold text-white text-[10px]">Bellissimo</div>} title="Bellissimo\nPizza" badge="0 sum" badgeColor="bg-[#00C254]" bgColor="#ff3300" />
          
          <MiniApp image="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100&h=100" title="Safia" badge="New" badgeColor="bg-[#007BFF]" />
          <MiniApp icon={<span className="font-bold text-[#ffdd00]">Go</span>} title="Goinvest" color="#fff" iconColor="#ffdd00" />
          <MiniApp icon={<span className="font-bold text-[#007BFF]">%</span>} title="Special Offers" badge="New" badgeColor="bg-[#007BFF]" />
          <MiniApp icon={<UsersIcon />} title="My Family" />
          
          <MiniApp icon={<ShieldAlert size={26} className="text-[#ff6b00]" />} title="Report fraud" badge="New" badgeColor="bg-[#007BFF]" />
          <MiniApp icon={<Star size={26} className="text-[#ff00ff] fill-current" />} title="Favorite\nPayments" />
        </div>
      </div>

      {/* Payment for mobile communication */}
      <div className="px-4 mt-8">
        <h2 className="text-white font-bold text-[17px] mb-3">Payment for mobile communication</h2>
        <div className="flex gap-2 h-[52px]">
          <div className="flex-1 bg-[#1e1e1e] rounded-xl flex items-center px-4 border border-[#333]">
            <input type="text" defaultValue="+998 99 406 05 44" className="bg-transparent text-white w-full outline-none text-[15px]" />
            <button className="w-7 h-7 rounded-full bg-[#007BFF] flex items-center justify-center shrink-0">
               <User size={16} className="text-white" />
            </button>
          </div>
          <button className="bg-[#007BFF] text-white font-medium px-6 rounded-xl text-[15px]">
            Payment
          </button>
        </div>
      </div>

      {/* Transfers */}
      <div className="px-4 mt-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white font-bold text-[17px]">Transfers</h2>
          <button className="text-[#007BFF] text-[15px] font-medium hover:text-blue-400">See all</button>
        </div>
        <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
          <TransferAvatar icon={<Plus size={36} className="text-[#007BFF]" />} name="New\ntransfer" border borderClass="border-[#007BFF]" />
          <TransferAvatar icon={<div className="flex flex-col items-center"><div className="flex gap-0.5 mb-1"><div className="w-1 h-4 bg-white/80"/><div className="w-1 h-5 bg-white/80"/><div className="w-1 h-4 bg-white/80"/></div><span className="text-[10px] font-bold text-white">NBU</span></div>} name="Islomjon A." bgColor="bg-[#245f9e]" />
          <TransferAvatar text="AA" name="Abduaziz A." bgColor="bg-[#333]" />
          <TransferAvatar icon={<div className="flex gap-1 -rotate-12"><div className="w-2.5 h-6 bg-[#4ade80] rounded-sm transform -skew-y-12"/><div className="w-2.5 h-6 bg-[#4ade80] rounded-sm transform skew-y-12"/></div>} name="Abdijappar\nI." bgColor="bg-[#222]" />
        </div>
      </div>

      {/* Stories/Banners */}
      <div className="px-4 mt-4">
         <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
            <StoryCard image="https://images.unsplash.com/photo-1551280857-2b9bbe5204ad?auto=format&fit=crop&q=80&w=200&h=200" title="2 0" subtitle="" />
            <StoryCard image="https://images.unsplash.com/photo-1633398466650-7170e0e13768?auto=format&fit=crop&q=80&w=200&h=200" title="" subtitle="" customContent={<div className="w-full h-full bg-blue-500 rounded-2xl flex items-center justify-center p-2"><div className="w-16 h-16 bg-white/20 rounded-xl" /></div>} />
            <StoryCard image="https://images.unsplash.com/photo-1601597111158-2fceff292cdc?auto=format&fit=crop&q=80&w=200&h=200" title="Cashless payment" isLight />
            <StoryCard image="https://images.unsplash.com/photo-1620189507195-68309c04c4d0?auto=format&fit=crop&q=80&w=200&h=200" title="VISA SUM" isLight />
         </div>
      </div>

      {/* Payment on spot */}
      <div className="px-4 mt-8 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white font-bold text-[17px]">Payment on spot</h2>
          <button className="text-[#007BFF] text-[15px] font-medium hover:text-blue-400">See all</button>
        </div>
        <div className="flex flex-col gap-3">
          <SpotItem title="Tuxtaaxunova Odinaxon Q" dist="417 m" icon={<div className="w-6 h-6 rounded-full border-4 border-zinc-200 bg-white" />} />
          <SpotItem title="My Comp Game Club" dist="474 m" icon={<div className="w-full h-full rounded-full bg-white flex items-center justify-center text-[8px] font-bold text-black border border-zinc-200">MC</div>} />
        </div>
      </div>

      <div className="w-full flex justify-center mt-6 mb-8 pt-4 pb-20">
        <button className="flex items-center gap-2 text-[#007BFF] font-medium text-[15px]">
          <LayoutGrid size={20} />
          <span>Set up the screen</span>
        </button>
      </div>

      </motion.div>
    </div>
  );
}

function QuickAction({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <button className="flex-1 aspect-[0.85] bg-[#1c1c1e] hover:bg-[#252528] transition-colors rounded-[20px] p-2 flex flex-col items-center justify-center gap-2 active:scale-95">
      <div className="flex items-center justify-center h-8">
        {icon}
      </div>
      <span 
        className="text-[12px] text-white font-medium text-center leading-[1.2] whitespace-pre-line"
        dangerouslySetInnerHTML={{ __html: label.replace('\\n', '<br/>') }} 
      />
    </button>
  );
}

function MiniApp({ icon, image, title, badge, badgeColor, bgColor, color, iconColor }: any) {
  return (
    <button className="flex flex-col items-center justify-start gap-2 relative group w-full">
      {badge && (
        <span className={`absolute -top-1.5 -right-1.5 z-10 ${badgeColor} text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-black shadow-sm`}>
          {badge}
        </span>
      )}
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-200 active:scale-90 ${bgColor ? bgColor : 'bg-[#1c1c1e]'}`} style={{ backgroundColor: bgColor || '' }}>
        {image ? (
          <img src={image} alt={title} className="w-14 h-14 rounded-2xl object-cover" />
        ) : (
          icon
        )}
      </div>
      <span 
        className="text-[11.5px] text-[#e0e0e0] text-center leading-[1.1] px-0.5 font-normal tracking-tight whitespace-pre-line"
        dangerouslySetInnerHTML={{ __html: title.replace('\\n', '<br/>') }} 
      />
    </button>
  );
}

function TransferAvatar({ icon, image, text, name, border, borderClass, bgColor }: any) {
  return (
    <div className="flex flex-col items-center gap-2 shrink-0">
      <button className={`w-[68px] h-[68px] rounded-full flex items-center justify-center overflow-hidden transition-transform active:scale-95 ${border ? `border border-dashed ${borderClass}` : ''} ${bgColor || 'bg-transparent'}`}>
         {image && <img src={image} alt="" className="w-full h-full object-cover" />}
         {icon && icon}
         {text && <span className="text-white font-medium text-lg">{text}</span>}
      </button>
      <span 
        className="text-[13px] text-white text-center leading-[1.2] whitespace-pre-line px-1"
        dangerouslySetInnerHTML={{ __html: name.replace('\\n', '<br/>') }} 
      />
    </div>
  )
}

function StoryCard({ image, title, subtitle, customContent, isLight }: any) {
  return (
    <button className="w-[110px] h-[110px] rounded-[22px] shrink-0 relative overflow-hidden active:scale-95 transition-transform border-2 border-blue-500 p-0.5">
      <div className={`w-full h-full rounded-[18px] overflow-hidden bg-zinc-800 relative ${isLight ? 'bg-white' : ''}`}>
        {customContent ? customContent : (
          <img src={image} alt={title} className="w-full h-full object-cover opacity-90" />
        )}
        <div className="absolute inset-0 p-2 flex flex-col justify-between">
           {title && <span className={`text-[12px] font-bold leading-tight text-left ${isLight ? 'text-black' : 'text-white'}`}>{title}</span>}
        </div>
      </div>
    </button>
    )
}

function SpotItem({ title, dist, icon }: any) {
  return (
    <button className="w-full bg-[#1e1e1e] rounded-2xl p-4 flex items-center gap-4 active:bg-[#252528] transition-colors">
      <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0 border border-zinc-200 overflow-hidden">
        {icon}
      </div>
      <div className="flex flex-col items-start gap-0.5">
        <span className="text-white font-bold text-[15px]">{title}</span>
        <span className="text-[#888888] text-[13px]">{dist}</span>
      </div>
    </button>
  )
}

function UsersIcon() {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="text-[#ff6b00] flex -space-x-2">
         <User size={20} className="fill-current text-[#ff6b00]" />
         <User size={26} className="fill-current text-[#ff6b00] z-10" />
         <User size={20} className="fill-current text-[#ff6b00]" />
      </div>
    </div>
  )
}
