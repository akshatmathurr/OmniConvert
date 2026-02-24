import React, { useState, useMemo } from 'react';
import { DateTime } from 'luxon';
import { Globe, Calendar, Clock, ChevronRight, Search, Plus, X, MapPin, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';

// Comprehensive list of timezones using Intl API
const ALL_TIMEZONES = Intl.supportedValuesOf('timeZone').map(zone => {
  const parts = zone.split('/');
  const city = parts[parts.length - 1].replace(/_/g, ' ');
  const region = parts[0];
  
  // Try to get abbreviation and long name
  let abbr = '';
  let longName = '';
  try {
    const now = new Date();
    const shortFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: zone,
      timeZoneName: 'short'
    });
    abbr = shortFormatter.formatToParts(now).find(p => p.type === 'timeZoneName')?.value || '';

    const longFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: zone,
      timeZoneName: 'long'
    });
    longName = longFormatter.formatToParts(now).find(p => p.type === 'timeZoneName')?.value || '';
  } catch (e) {}

  return { zone, city, region, abbr, longName };
});

const ABBREVIATIONS: Record<string, string[]> = {
  'IST': ['Asia/Kolkata', 'Asia/Calcutta'],
  'EST': ['America/New_York'],
  'EDT': ['America/New_York'],
  'CST': ['America/Chicago'],
  'CDT': ['America/Chicago'],
  'MST': ['America/Denver'],
  'MDT': ['America/Denver'],
  'PST': ['America/Los_Angeles'],
  'PDT': ['America/Los_Angeles'],
  'GMT': ['UTC'],
  'UTC': ['UTC'],
  'CET': ['Europe/Paris'],
  'JST': ['Asia/Tokyo'],
  'AEST': ['Australia/Sydney'],
  'AEDT': ['Australia/Sydney'],
};

interface TimezonePickerProps {
  onSelect: (zone: string) => void;
  onClose: () => void;
  title: string;
}

function TimezonePicker({ onSelect, onClose, title }: TimezonePickerProps) {
  const [search, setSearch] = useState('');

  const filteredZones = useMemo(() => {
    const s = search.toLowerCase().trim();
    if (!s) return ALL_TIMEZONES.slice(0, 50);

    const searchTerms = s.split(/\s+/);
    const abbrZones = ABBREVIATIONS[s.toUpperCase()] || [];
    
    return ALL_TIMEZONES.filter(tz => {
      const targetString = `${tz.city} ${tz.zone} ${tz.abbr} ${tz.longName}`.toLowerCase();
      const matchesSearch = searchTerms.every(term => targetString.includes(term));
      const matchesAbbr = abbrZones.includes(tz.zone);
      return matchesSearch || matchesAbbr;
    }).slice(0, 100);
  }, [search]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div 
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="glass w-full max-w-md rounded-t-[2.5rem] sm:rounded-[2.5rem] overflow-hidden flex flex-col max-h-[85vh] shadow-2xl border-white/30"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 flex items-center justify-between">
          <h3 className="text-xl font-black tracking-tight text-slate-800">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="px-6 pb-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              autoFocus
              type="text"
              placeholder="Search city, country or timezone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/60 border border-white/50 rounded-2xl py-4 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-bold text-slate-700 placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-8 no-scrollbar">
          <div className="space-y-2">
            {filteredZones.map((tz) => (
              <button
                key={tz.zone}
                onClick={() => {
                  onSelect(tz.zone);
                  onClose();
                }}
                className="w-full flex items-center gap-4 p-4 bg-white/40 hover:bg-white/60 rounded-2xl transition-all text-left group border border-white/20 hover:border-white/40"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  <MapPin className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-black text-slate-800 truncate">{tz.city}</div>
                  <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest truncate">
                    {tz.abbr} • {tz.zone}
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
              </button>
            ))}
            {filteredZones.length === 0 && (
              <div className="py-12 text-center">
                <div className="text-slate-300 font-black uppercase tracking-widest text-xs">No results found</div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

interface CustomDateTimePickerProps {
  date: string;
  time: string;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
  onClose: () => void;
}

function CustomDateTimePicker({ date, time, onDateChange, onTimeChange, onClose }: CustomDateTimePickerProps) {
  const dt = DateTime.fromISO(`${date}T${time}`);
  
  const adjustDate = (days: number) => {
    onDateChange(dt.plus({ days }).toFormat('yyyy-MM-dd'));
  };

  const adjustTime = (hours: number, minutes: number = 0) => {
    onTimeChange(dt.plus({ hours, minutes }).toFormat('HH:mm'));
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div 
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="bg-white/95 backdrop-blur-2xl w-full max-w-sm rounded-[2.5rem] p-6 shadow-2xl border border-white/50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-black tracking-tight text-slate-800">Adjust Time & Date</h3>
          <button onClick={onClose} className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 active:scale-95 transition-transform">Done</button>
        </div>

        <div className="space-y-8">
          {/* Date Selector */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-center block">Date</label>
            <div className="flex items-center justify-between bg-slate-50 rounded-2xl p-2 border border-slate-100">
              <button onClick={() => adjustDate(-1)} className="p-3 hover:bg-white rounded-xl transition-colors text-slate-400 hover:text-blue-600"><ChevronLeft className="w-5 h-5" /></button>
              <div className="text-center">
                <div className="font-black text-slate-800">{dt.toFormat('cccc')}</div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-tight">{dt.toFormat('d LLL yyyy')}</div>
              </div>
              <button onClick={() => adjustDate(1)} className="p-3 hover:bg-white rounded-xl transition-colors text-slate-400 hover:text-blue-600"><ChevronRight className="w-5 h-5" /></button>
            </div>
          </div>

          {/* Time Selector */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-center block">Time</label>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-2xl p-3 flex flex-col items-center border border-slate-100">
                <button onClick={() => adjustTime(1)} className="p-2 hover:bg-white rounded-xl transition-colors text-slate-300 hover:text-blue-600"><ChevronRight className="w-5 h-5 -rotate-90" /></button>
                <div className="text-3xl font-black text-blue-600 py-1 tracking-tighter">{dt.toFormat('HH')}</div>
                <button onClick={() => adjustTime(-1)} className="p-2 hover:bg-white rounded-xl transition-colors text-slate-300 hover:text-blue-600"><ChevronRight className="w-5 h-5 rotate-90" /></button>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hours</div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-3 flex flex-col items-center border border-slate-100">
                <button onClick={() => adjustTime(0, 5)} className="p-2 hover:bg-white rounded-xl transition-colors text-slate-300 hover:text-blue-600"><ChevronRight className="w-5 h-5 -rotate-90" /></button>
                <input 
                  type="number"
                  min="0"
                  max="59"
                  value={dt.toFormat('mm')}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (!isNaN(val) && val >= 0 && val <= 59) {
                      onTimeChange(dt.set({ minute: val }).toFormat('HH:mm'));
                    }
                  }}
                  className="w-16 text-3xl font-black text-blue-600 py-1 bg-transparent text-center outline-none tracking-tighter"
                />
                <button onClick={() => adjustTime(0, -5)} className="p-2 hover:bg-white rounded-xl transition-colors text-slate-300 hover:text-blue-600"><ChevronRight className="w-5 h-5 rotate-90" /></button>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Minutes</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

interface TimezoneConverterProps {
  sourceZone: string;
  setSourceZone: (zone: string) => void;
  targetZones: string[];
  setTargetZones: (zones: string[]) => void;
  sourceDate: string;
  setSourceDate: (date: string) => void;
  sourceTime: string;
  setSourceTime: (time: string) => void;
}

interface TargetZoneCardProps {
  zone: string;
  sourceDateTime: any;
  onRemove: (zone: string) => void;
  key?: React.Key;
}

function TargetZoneCard({ zone, sourceDateTime, onRemove }: TargetZoneCardProps) {
  const targetDateTime = sourceDateTime.setZone(zone);
  const dayDiff = Math.floor(targetDateTime.startOf('day').diff(sourceDateTime.startOf('day'), 'days').days);
  const x = useMotionValue(0);
  const deleteOpacity = useTransform(x, [-100, -20], [1, 0]);

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="relative group"
    >
      {/* Delete Background */}
      <motion.div 
        style={{ opacity: deleteOpacity }}
        className="absolute inset-0 bg-rose-500 rounded-[2rem] flex items-center justify-end px-8 text-white font-black uppercase tracking-widest text-xs"
      >
        Delete
      </motion.div>

      <motion.div
        drag="x"
        style={{ x }}
        dragConstraints={{ left: -100, right: 0 }}
        dragElastic={0.1}
        onDragEnd={(_, info) => {
          if (info.offset.x < -60) {
            onRemove(zone);
          } else {
            x.set(0);
          }
        }}
        className="bg-white rounded-[2rem] p-5 relative z-10 touch-pan-y border border-white/50 shadow-sm"
      >
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-xl font-black tracking-tight text-slate-800">
              {zone.split('/').pop()?.replace(/_/g, ' ')}
            </div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              {targetDateTime.offsetNameLong}
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-3xl font-black tracking-tighter text-blue-600">
              {targetDateTime.toFormat('HH:mm')}
            </div>
            <div className="flex items-center justify-end gap-1.5">
              <div className="text-[10px] font-bold text-slate-500 uppercase">
                {targetDateTime.toFormat('ccc, d LLL')}
              </div>
              {dayDiff !== 0 && (
                <div className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${dayDiff > 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                  {dayDiff > 0 ? '+' : ''}{dayDiff} DAY
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-white/20 flex items-center justify-between">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Difference
          </div>
          <div className="text-xs font-bold text-blue-500 bg-blue-50 px-2.5 py-1 rounded-xl">
            {(targetDateTime.offset - sourceDateTime.offset) / 60 > 0 ? '+' : ''}{(targetDateTime.offset - sourceDateTime.offset) / 60} hrs
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function TimezoneConverter({
  sourceZone, setSourceZone,
  targetZones, setTargetZones,
  sourceDate, setSourceDate,
  sourceTime, setSourceTime
}: TimezoneConverterProps) {
  const [pickerMode, setPickerMode] = useState<'source' | 'target' | 'datetime' | null>(null);

  const sourceDateTime = DateTime.fromISO(`${sourceDate}T${sourceTime}`, { zone: sourceZone });

  const addTargetZone = (zone: string) => {
    if (!targetZones.includes(zone)) {
      setTargetZones([...targetZones, zone]);
    }
  };

  const removeTargetZone = (zone: string) => {
    setTargetZones(targetZones.filter(z => z !== zone));
  };

  return (
    <div className="flex flex-col gap-6 p-4">
      <header className="mb-2">
        <h1 className="text-3xl font-bold tracking-tight">Timezone</h1>
        <p className="text-slate-500 text-sm">Convert time across the world</p>
      </header>

      {/* Source Section */}
      <div className="glass rounded-[2.5rem] p-6 flex flex-col gap-6">
        <div className="space-y-4">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-400">From</label>
          
          <button 
            onClick={() => setPickerMode('source')}
            className="w-full bg-white/50 hover:bg-white/70 rounded-2xl py-4 px-5 flex items-center justify-between transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/5">
                <Globe className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-lg font-bold text-slate-800">
                  {sourceZone.split('/').pop()?.replace(/_/g, ' ')}
                </div>
                <div className="text-xs text-slate-500 font-medium">{sourceZone}</div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors" />
          </button>
          
          <button 
            onClick={() => setPickerMode('datetime')}
            className="w-full bg-white/50 hover:bg-white/70 rounded-2xl py-4 px-5 flex items-center justify-between transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-lg font-bold text-slate-800">
                  {sourceDateTime.toFormat('HH:mm')}
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  {sourceDateTime.toFormat('cccc, d LLL yyyy')}
                </div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors" />
          </button>
        </div>
      </div>

      {/* Target Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-400">To</label>
          <button 
            onClick={() => setPickerMode('target')}
            className="flex items-center gap-1.5 text-blue-600 font-bold text-xs bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add City
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <AnimatePresence mode="popLayout">
            {targetZones.map((zone) => (
              <TargetZoneCard 
                key={zone}
                zone={zone}
                sourceDateTime={sourceDateTime}
                onRemove={removeTargetZone}
              />
            ))}
          </AnimatePresence>

          {targetZones.length === 0 && (
            <div className="glass rounded-[2rem] p-10 text-center border-dashed border-2 border-white/40">
              <div className="text-slate-400 font-medium">No target cities added</div>
              <button 
                onClick={() => setPickerMode('target')}
                className="mt-4 text-blue-600 font-bold text-sm"
              >
                Add your first city
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Picker Modal */}
      <AnimatePresence>
        {pickerMode === 'source' || pickerMode === 'target' ? (
          <TimezonePicker 
            title={pickerMode === 'source' ? 'Change Home City' : 'Add Target City'}
            onClose={() => setPickerMode(null)}
            onSelect={(zone) => {
              if (pickerMode === 'source') setSourceZone(zone);
              else addTargetZone(zone);
            }}
          />
        ) : pickerMode === 'datetime' ? (
          <CustomDateTimePicker 
            date={sourceDate}
            time={sourceTime}
            onDateChange={setSourceDate}
            onTimeChange={setSourceTime}
            onClose={() => setPickerMode(null)}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
