import React, { useState } from 'react';
import { Footprints, Info, Ruler, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

const SHOE_SIZES = [
  { us: 6, uk: 5.5, eu: 39, cm: 24 },
  { us: 6.5, uk: 6, eu: 39.5, cm: 24.5 },
  { us: 7, uk: 6.5, eu: 40, cm: 25 },
  { us: 7.5, uk: 7, eu: 40.5, cm: 25.5 },
  { us: 8, uk: 7.5, eu: 41, cm: 26 },
  { us: 8.5, uk: 8, eu: 42, cm: 26.5 },
  { us: 9, uk: 8.5, eu: 42.5, cm: 27 },
  { us: 9.5, uk: 9, eu: 43, cm: 27.5 },
  { us: 10, uk: 9.5, eu: 44, cm: 28 },
  { us: 10.5, uk: 10, eu: 44.5, cm: 28.5 },
  { us: 11, uk: 10.5, eu: 45, cm: 29 },
  { us: 12, uk: 11.5, eu: 46, cm: 30 },
];

type Region = 'us' | 'uk' | 'eu' | 'cm';

export default function ShoeSizeConverter() {
  const [selectedSize, setSelectedSize] = useState(SHOE_SIZES[4]);
  const [activeRegion, setActiveRegion] = useState<Region>('us');

  const regions: { id: Region; label: string }[] = [
    { id: 'us', label: 'US' },
    { id: 'uk', label: 'UK' },
    { id: 'eu', label: 'EU' },
    { id: 'cm', label: 'CM' },
  ];

  return (
    <div className="flex flex-col gap-6 p-4">
      <header className="mb-2">
        <h1 className="text-3xl font-bold tracking-tight">Shoe Size</h1>
        <p className="text-slate-500 text-sm">International size conversion</p>
      </header>

      <div className="glass rounded-[2.5rem] p-6 flex flex-col gap-8">
        <div className="flex bg-purple-50 p-1 rounded-2xl border border-purple-100/50">
          {regions.map(r => (
            <button
              key={r.id}
              onClick={() => setActiveRegion(r.id)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                activeRegion === r.id 
                  ? 'bg-white shadow-sm text-purple-600' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col items-center gap-8">
          <div className="relative w-56 h-56 flex items-center justify-center">
            <div className="absolute inset-0 bg-purple-500/5 rounded-full animate-pulse" />
            <div className="absolute inset-4 border-2 border-dashed border-purple-200 rounded-full" />
            <div className="absolute inset-8 bg-white/40 backdrop-blur-md rounded-full shadow-inner" />
            <motion.div 
              key={selectedSize[activeRegion]}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative text-7xl font-black text-purple-600 tracking-tighter z-10"
            >
              {selectedSize[activeRegion]}
            </motion.div>
            <div className="absolute bottom-12 text-[10px] font-black text-purple-400 uppercase tracking-[0.2em]">
              {activeRegion} Size
            </div>
          </div>

          <div className="w-full space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-center block">Select Size</label>
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-4 px-2 -mx-2">
              {SHOE_SIZES.map((size, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedSize(size)}
                  className={`flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center font-black text-lg transition-all border-2 ${
                    selectedSize === size
                      ? 'bg-purple-600 text-white border-purple-600 shadow-xl shadow-purple-500/30 scale-110'
                      : 'bg-white/50 text-slate-500 border-transparent hover:border-purple-200'
                  }`}
                >
                  {size[activeRegion]}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/20">
          {regions.filter(r => r.id !== activeRegion).map(r => (
            <div key={r.id} className="text-center space-y-1 bg-white/30 py-3 rounded-2xl">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{r.label}</div>
              <div className="text-xl font-black text-slate-800 tracking-tight">{selectedSize[r.id]}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-[2rem] p-5 flex items-start gap-4 border border-white/40">
        <div className="bg-purple-100 p-2.5 rounded-xl">
          <Info className="w-5 h-5 text-purple-600" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-black text-slate-800">Pro Tip</h4>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            Sizes may vary slightly between brands. For the best fit, measure your foot length in centimeters.
          </p>
        </div>
      </div>
    </div>
  );
}
