import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, DollarSign, Footprints } from 'lucide-react';
import TimezoneConverter from './components/TimezoneConverter';
import CurrencyConverter from './components/CurrencyConverter';
import ShoeSizeConverter from './components/ShoeSizeConverter';
import { DateTime } from 'luxon';

type Tab = 'timezone' | 'currency' | 'shoe';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('timezone');

  // Timezone State
  const [sourceZone, setSourceZone] = useState('Asia/Kolkata');
  const [targetZones, setTargetZones] = useState<string[]>(['America/Toronto']);
  const [sourceDate, setSourceDate] = useState(DateTime.now().toFormat("yyyy-MM-dd"));
  const [sourceTime, setSourceTime] = useState(DateTime.now().toFormat("HH:mm"));

  // Currency State
  const [currencyAmount, setCurrencyAmount] = useState<string>('100');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');

  const tabs = [
    { id: 'timezone' as Tab, label: 'Timezone', icon: Clock, color: 'bg-blue-100 text-blue-600' },
    { id: 'currency' as Tab, label: 'Currency', icon: DollarSign, color: 'bg-emerald-100 text-emerald-600' },
    { id: 'shoe' as Tab, label: 'Shoe Size', icon: Footprints, color: 'bg-purple-100 text-purple-600' },
  ];

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-transparent relative font-sans">
      {/* Simulated iOS Status Bar */}
      <div className="fixed top-0 left-0 right-0 h-12 flex items-center justify-between px-8 z-[60] pointer-events-none text-slate-900">
        <span className="text-sm font-bold">9:41</span>
        <div className="flex items-center gap-1.5">
          <div className="flex gap-0.5 items-end h-3">
            <div className="w-0.5 h-[30%] bg-current rounded-full" />
            <div className="w-0.5 h-[50%] bg-current rounded-full" />
            <div className="w-0.5 h-[70%] bg-current rounded-full" />
            <div className="w-0.5 h-[100%] bg-current rounded-full" />
          </div>
          <span className="text-[10px] font-bold">5G</span>
          <div className="w-6 h-3 rounded-[4px] border border-current/30 relative ml-1">
            <div className="absolute inset-[1.5px] bg-current rounded-[1px] w-[80%]" />
            <div className="absolute -right-[3px] top-1/2 -translate-y-1/2 w-[2px] h-[4px] bg-current/30 rounded-r-full" />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto no-scrollbar pt-12 pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
          >
            {activeTab === 'timezone' && (
              <TimezoneConverter 
                sourceZone={sourceZone} setSourceZone={setSourceZone}
                targetZones={targetZones} setTargetZones={setTargetZones}
                sourceDate={sourceDate} setSourceDate={setSourceDate}
                sourceTime={sourceTime} setSourceTime={setSourceTime}
              />
            )}
            {activeTab === 'currency' && (
              <CurrencyConverter 
                amount={currencyAmount} setAmount={setCurrencyAmount}
                fromCurrency={fromCurrency} setFromCurrency={setFromCurrency}
                toCurrency={toCurrency} setToCurrency={setToCurrency}
              />
            )}
            {activeTab === 'shoe' && <ShoeSizeConverter />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-8 left-4 right-4 z-50">
        <div className="glass rounded-[2.5rem] p-2 flex items-center justify-between shadow-2xl shadow-black/10">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="relative flex-1 flex flex-col items-center gap-1 py-3 transition-all outline-none"
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className={`absolute inset-0 ${tab.color.split(' ')[0]} rounded-[2rem] -z-10`}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon 
                  className={`w-6 h-6 transition-colors duration-300 ${
                    isActive ? tab.color.split(' ')[1] : 'text-slate-400'
                  }`} 
                />
                <span className={`text-[10px] font-bold uppercase tracking-widest transition-colors duration-300 ${
                  isActive ? tab.color.split(' ')[1] : 'text-slate-400'
                }`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Background Decorative Elements */}
      <div className="fixed inset-0 -z-20 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[40%] bg-blue-200/30 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[40%] bg-emerald-200/30 blur-[120px] rounded-full" />
        <div className="absolute top-[30%] right-[-5%] w-[40%] h-[30%] bg-purple-200/30 blur-[100px] rounded-full" />
      </div>
    </div>
  );
}
