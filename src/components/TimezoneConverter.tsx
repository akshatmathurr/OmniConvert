import React, { useState, useMemo } from 'react';
import { DateTime } from 'luxon';
import { Globe, Calendar, Clock, ChevronRight, Search, Plus, X, MapPin, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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

const ABBREVIATIONS: Record<string, string> = {
  'IST': 'Asia/Kolkata',
  'EST': 'America/New_York',
  'EDT': 'America/New_York',
  'CST': 'America/Chicago',
  'CDT': 'America/Chicago',
  'MST': 'America/Denver',
  'MDT': 'America/Denver',
  'PST': 'America/Los_Angeles',
  'PDT': 'America/Los_Angeles',
  'GMT': 'UTC',
  'UTC': 'UTC',
  'CET': 'Europe/Paris',
  'JST': 'Asia/Tokyo',
  'AEST': 'Australia/Sydney',
  'AEDT': 'Australia/Sydney',
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
    const abbrZone = ABBREVIATIONS[s.toUpperCase()];
    
    return ALL_TIMEZONES.filter(tz => {
      const targetString = `${tz.city} ${tz.zone} ${tz.abbr} ${tz.longName}`.toLowerCase();
      return searchTerms.every(term => targetString.includes(term)) || (abbrZone && tz.zone === abbrZone);
    }).slice(0, 100);
  }, [search]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
    >
      <div className="glass w-full max-w-sm rounded-[2.5rem] overflow-hidden flex flex-col max-h-[80vh]">
        <div className="p-6 border-b border-white/20 flex items-center justify-between">
          <h3 className="text-xl font-bold">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4 bg-white/20 backdrop-blur-xl border-b border-white/20">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              autoFocus
              type="text"
              placeholder="Search city or timezone (e.g. IST, London)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/40 border border-white/30 rounded-2xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-blue-500/40 transition-all font-medium placeholder:text-slate-400 text-slate-800"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 no-scrollbar bg-white/10 backdrop-blur-md">
          {filteredZones.map((tz) => (
            <button
              key={tz.zone}
              onClick={() => {
                onSelect(tz.zone);
                onClose();
              }}
              className="w-full flex items-center gap-3 p-4 hover:bg-white/30 rounded-[1.5rem] transition-all text-left border border-transparent hover:border-white/30 mb-1"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/20">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="font-bold text-slate-800">{tz.city}</div>
                <div className="text-xs text-slate-500 font-medium">{tz.abbr} • {tz.zone}</div>
              </div>
            </button>
          ))}
          {filteredZones.length === 0 && (
            <div className="p-8 text-center text-slate-400 font-medium">
              No results found
            </div>
          )}
        </div>
      </div>
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
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      className="fixed inset-x-0 bottom-0 z-[100] p-4 flex justify-center"
    >
      <div className="glass w-full max-w-sm rounded-[2.5rem] p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold">Adjust Time & Date</h3>
          <button onClick={onClose} className="bg-blue-500 text-white px-4 py-1.5 rounded-full text-sm font-bold">Done</button>
        </div>

        <div className="space-y-8">
          {/* Date Selector */}
          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 text-center block">Date</label>
            <div className="flex items-center justify-between bg-white/40 rounded-2xl p-2">
              <button onClick={() => adjustDate(-1)} className="p-3 hover:bg-white/40 rounded-xl transition-colors"><ChevronLeft className="w-5 h-5" /></button>
              <div className="text-center">
                <div className="font-bold text-slate-800">{dt.toFormat('cccc')}</div>
                <div className="text-sm text-slate-500">{dt.toFormat('d LLL yyyy')}</div>
              </div>
              <button onClick={() => adjustDate(1)} className="p-3 hover:bg-white/40 rounded-xl transition-colors"><ChevronRight className="w-5 h-5" /></button>
            </div>
          </div>

          {/* Time Selector */}
          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 text-center block">Time</label>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/40 rounded-2xl p-2 flex flex-col items-center">
                <button onClick={() => adjustTime(1)} className="p-2 hover:bg-white/40 rounded-xl transition-colors"><ChevronRight className="w-4 h-4 -rotate-90" /></button>
                <div className="text-2xl font-black text-blue-600 py-1">{dt.toFormat('HH')}</div>
                <button onClick={() => adjustTime(-1)} className="p-2 hover:bg-white/40 rounded-xl transition-colors"><ChevronRight className="w-4 h-4 rotate-90" /></button>
                <div className="text-[10px] font-bold text-slate-400 uppercase">Hours</div>
              </div>
              <div className="bg-white/40 rounded-2xl p-2 flex flex-col items-center">
                <button onClick={() => adjustTime(0, 5)} className="p-2 hover:bg-white/40 rounded-xl transition-colors"><ChevronRight className="w-4 h-4 -rotate-90" /></button>
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
                  className="w-16 text-2xl font-black text-blue-600 py-1 bg-transparent text-center outline-none"
                />
                <button onClick={() => adjustTime(0, -5)} className="p-2 hover:bg-white/40 rounded-xl transition-colors"><ChevronRight className="w-4 h-4 rotate-90" /></button>
                <div className="text-[10px] font-bold text-slate-400 uppercase">Minutes</div>
              </div>
            </div>
          </div>
        </div>
      </div>
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
            {targetZones.map((zone) => {
              const targetDateTime = sourceDateTime.setZone(zone);
              const diffHours = (targetDateTime.offset - sourceDateTime.offset) / 60;
              
              const dayDiff = Math.floor(targetDateTime.startOf('day').diff(sourceDateTime.startOf('day'), 'days').days);
              
              return (
                <motion.div 
                  key={zone}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="glass rounded-[2rem] p-5 relative group"
                >
                  <button 
                    onClick={() => removeTargetZone(zone)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-white shadow-md rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="text-xl font-black tracking-tight text-slate-800">
                        {zone.split('/').pop()?.replace(/_/g, ' ')}
                      </div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
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
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Difference
                    </div>
                    <div className="text-xs font-bold text-blue-500 bg-blue-50 px-2.5 py-1 rounded-xl">
                      {diffHours > 0 ? '+' : ''}{diffHours} hrs
                    </div>
                  </div>
                </motion.div>
              );
            })}
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
