import React, { useState, useEffect, useMemo } from 'react';
import { DollarSign, RefreshCw, TrendingUp, ArrowRightLeft, Calendar, Search, X, ChevronRight, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DateTime } from 'luxon';

const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', flag: '🇦🇪' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr', flag: '🇨🇭' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', flag: '🇳🇿' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', flag: '🇭🇰' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', flag: '🇸🇪' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', flag: '🇰🇷' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', flag: '🇿🇦' },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$', flag: '🇲🇽' },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽', flag: '🇷🇺' },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺', flag: '🇹🇷' },
  { code: 'THB', name: 'Thai Baht', symbol: '฿', flag: '🇹🇭' },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', flag: '🇮🇩' },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', flag: '🇲🇾' },
  { code: 'PHP', name: 'Philippine Peso', symbol: '₱', flag: '🇵🇭' },
  { code: 'ILS', name: 'Israeli New Shekel', symbol: '₪', flag: '🇮🇱' },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr', flag: '🇩🇰' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', flag: '🇳🇴' },
  { code: 'PLN', name: 'Polish Zloty', symbol: 'zł', flag: '🇵🇱' },
  { code: 'CZK', name: 'Czech Koruna', symbol: 'Kč', flag: '🇨🇿' },
  { code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft', flag: '🇭🇺' },
  { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼', flag: '🇸🇦' },
  { code: 'QAR', name: 'Qatari Rial', symbol: '﷼', flag: '🇶🇦' },
  { code: 'KWD', name: 'Kuwaiti Dinar', symbol: 'د.ك', flag: '🇰🇼' },
  { code: 'EGP', name: 'Egyptian Pound', symbol: 'E£', flag: '🇪🇬' },
  { code: 'VND', name: 'Vietnamese Dong', symbol: '₫', flag: '🇻🇳' },
  { code: 'TWD', name: 'New Taiwan Dollar', symbol: 'NT$', flag: '🇹🇼' },
];

interface CurrencyPickerProps {
  onSelect: (code: string) => void;
  onClose: () => void;
  title: string;
}

function CurrencyPicker({ onSelect, onClose, title }: CurrencyPickerProps) {
  const [search, setSearch] = useState('');

  const filteredCurrencies = useMemo(() => {
    const s = search.toLowerCase().trim();
    if (!s) return CURRENCIES;
    return CURRENCIES.filter(c => 
      c.code.toLowerCase().includes(s) || 
      c.name.toLowerCase().includes(s)
    );
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
        
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              autoFocus
              type="text"
              placeholder="Search currency or code"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/40 border-none rounded-2xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 no-scrollbar">
          {filteredCurrencies.map((c) => (
            <button
              key={c.code}
              onClick={() => {
                onSelect(c.code);
                onClose();
              }}
              className="w-full flex items-center gap-3 p-4 hover:bg-white/30 rounded-2xl transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-xl">
                {c.flag}
              </div>
              <div>
                <div className="font-bold text-slate-800">{c.code}</div>
                <div className="text-xs text-slate-500">{c.name}</div>
              </div>
              <div className="ml-auto font-bold text-emerald-600">{c.symbol}</div>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

type TimeRange = '1D' | '5D' | '6M';

interface CurrencyConverterProps {
  amount: string;
  setAmount: (amount: string) => void;
  fromCurrency: string;
  setFromCurrency: (currency: string) => void;
  toCurrency: string;
  setToCurrency: (currency: string) => void;
}

export default function CurrencyConverter({
  amount, setAmount,
  fromCurrency, setFromCurrency,
  toCurrency, setToCurrency
}: CurrencyConverterProps) {
  const [rates, setRates] = useState<Record<string, number>>({});
  const [history, setHistory] = useState<{ date: string; rate: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>('5D');
  const [pickerMode, setPickerMode] = useState<'from' | 'to' | null>(null);

  // Fetch current rates
  useEffect(() => {
    setLoading(true);
    fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`)
      .then(res => res.json())
      .then(data => {
        setRates(data.rates);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch rates', err);
        setLoading(false);
      });
  }, [fromCurrency]);

  // Fetch historical data
  useEffect(() => {
    const end = DateTime.now();
    let start = end.minus({ days: 5 });
    
    if (timeRange === '1D') start = end.minus({ days: 1 });
    else if (timeRange === '6M') start = end.minus({ months: 6 });

    const startStr = start.toFormat('yyyy-MM-dd');
    const endStr = end.toFormat('yyyy-MM-dd');

    fetch(`https://api.frankfurter.app/${startStr}..${endStr}?from=${fromCurrency}&to=${toCurrency}`)
      .then(res => res.json())
      .then(data => {
        if (data.rates) {
          const historyData = Object.entries(data.rates).map(([date, rates]: [string, any]) => ({
            date,
            rate: rates[toCurrency]
          }));
          setHistory(historyData);
        }
      })
      .catch(err => console.error('History fetch failed', err));
  }, [fromCurrency, toCurrency, timeRange]);

  const result = useMemo(() => {
    if (!rates[toCurrency]) return 0;
    return parseFloat(amount) * rates[toCurrency];
  }, [amount, rates, toCurrency]);

  const chartPoints = useMemo(() => {
    if (history.length < 2) return '';
    const min = Math.min(...history.map(h => h.rate));
    const max = Math.max(...history.map(h => h.rate));
    const range = max - min || 1;
    
    return history.map((h, i) => {
      const x = (i / (history.length - 1)) * 100;
      const y = 100 - ((h.rate - min) / range) * 100;
      return `${x},${y}`;
    }).join(' ');
  }, [history]);

  const fromInfo = CURRENCIES.find(c => c.code === fromCurrency);
  const toInfo = CURRENCIES.find(c => c.code === toCurrency);

  return (
    <div className="flex flex-col gap-6 p-4">
      <header className="mb-2">
        <h1 className="text-3xl font-bold tracking-tight">Currency</h1>
        <p className="text-slate-500 text-sm">Real-time exchange rates</p>
      </header>

      <div className="glass rounded-[2.5rem] p-6 flex flex-col gap-6">
        {/* From & To Selection */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setPickerMode('from')}
            className="flex-1 bg-white/50 hover:bg-white/70 rounded-2xl p-4 flex flex-col items-center gap-1 transition-all group border border-white/20"
          >
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">From</span>
            <div className="flex items-center gap-2">
              <span className="text-xl">{fromInfo?.flag}</span>
              <span className="text-lg font-black text-slate-800">{fromCurrency}</span>
            </div>
          </button>

          <button 
            onClick={() => {
              const temp = fromCurrency;
              setFromCurrency(toCurrency);
              setToCurrency(temp);
            }}
            className="bg-emerald-100 text-emerald-600 w-10 h-10 flex items-center justify-center rounded-full shadow-lg shadow-emerald-500/10 active:scale-95 transition-transform z-10 border border-white/50 shrink-0"
          >
            <ArrowRightLeft className="w-4 h-4" />
          </button>

          <button 
            onClick={() => setPickerMode('to')}
            className="flex-1 bg-white/50 hover:bg-white/70 rounded-2xl p-4 flex flex-col items-center gap-1 transition-all group border border-white/20"
          >
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">To</span>
            <div className="flex items-center gap-2">
              <span className="text-xl">{toInfo?.flag}</span>
              <span className="text-lg font-black text-slate-800">{toCurrency}</span>
            </div>
          </button>
        </div>

        {/* Amount Input */}
        <div className="space-y-4">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-2">Amount</label>
          <div className="relative">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-emerald-600/30">
              {fromInfo?.symbol}
            </div>
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-white/50 border-none rounded-2xl py-5 pl-14 pr-6 text-3xl font-black outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all text-slate-800"
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Result Display */}
        <div className="bg-emerald-50 rounded-[2rem] p-8 text-center space-y-2 border border-emerald-100/50">
          <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Converted Amount</div>
          <div className="text-5xl font-black tracking-tighter text-emerald-700">
            {toInfo?.symbol}
            {result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-emerald-600/40 font-bold text-xs">
            1 {fromCurrency} = {rates[toCurrency]?.toFixed(4)} {toCurrency}
          </div>
        </div>
      </div>

      {/* Market Trends */}
      <div className="glass rounded-[2.5rem] p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-sm font-black text-slate-700 uppercase tracking-tight">Market Trends</span>
          </div>
          
          <div className="flex bg-slate-100 p-1 rounded-xl">
            {(['1D', '5D', '6M'] as TimeRange[]).map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded-lg text-[10px] font-black transition-all ${
                  timeRange === range ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-400'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        <div className="h-32 relative px-2">
          {history.length > 1 ? (
            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                </linearGradient>
              </defs>
              <polyline
                fill="none"
                stroke="#10b981"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={chartPoints}
                className="drop-shadow-[0_4px_8px_rgba(16,185,129,0.3)]"
              />
              <polygon
                fill="url(#chartGradient)"
                points={`0,100 ${chartPoints} 100,100`}
              />
            </svg>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 text-xs font-bold animate-pulse">
              Loading trend data...
            </div>
          )}
        </div>
        
        <div className="flex justify-between px-2">
          <div className="text-[9px] font-black text-slate-400 uppercase">{history[0]?.date}</div>
          <div className="text-[9px] font-black text-slate-400 uppercase">{history[history.length-1]?.date}</div>
        </div>
      </div>

      {/* Picker Modal */}
      <AnimatePresence>
        {pickerMode && (
          <CurrencyPicker 
            title={pickerMode === 'from' ? 'Select Base Currency' : 'Select Target Currency'}
            onClose={() => setPickerMode(null)}
            onSelect={(code) => {
              if (pickerMode === 'from') setFromCurrency(code);
              else setToCurrency(code);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
