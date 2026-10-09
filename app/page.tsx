'use client';

import Link from 'next/link';
import { ArrowRight, TrendingUp, TrendingDown, Brain, BarChart3, MessageSquare, Shield, Check, Zap, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect, useMemo } from 'react';
import NumberFlow from '@number-flow/react';
import { motion, AnimatePresence } from 'framer-motion';

/* ------------------------------------------------------------------ */
/*  Design tokens — "Ultra Legend" fintech palette                     */
/* ------------------------------------------------------------------ */
const BULL_FROM = '#00F2FE';
const BULL_TO = '#00FF88';
const BULL_SOLID = '#00FF88';
const BEAR_FROM = '#FF416C';
const BEAR_TO = '#FF4B2B';
const BEAR_SOLID = '#FF416C';
const INK = '#050506';
const PANEL = '#0A0B10';

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
const dataToPath = (data: number[], width: number, height: number) => {
  const xStep = width / (data.length - 1);
  const points = data.map((y, i) => `${i * xStep},${y}`);
  return `M${points.join(' L')}`;
};

const dataToAreaPath = (data: number[], width: number, height: number) => {
  const xStep = width / (data.length - 1);
  const points = data.map((y, i) => `${i * xStep},${y}`);
  return `M${points.join(' L')} L${width},${height} L0,${height} Z`;
};

const genSpark = (len: number, base: number, vol: number) => {
  const out: number[] = [];
  let v = base;
  for (let i = 0; i < len; i++) {
    v = v + (Math.random() - 0.5) * vol;
    out.push(v);
  }
  return out;
};

export default function Home() {
  /* Hero chart --------------------------------------------------- */
  const [chartData, setChartData] = useState<number[]>([120, 110, 100, 90, 85, 80, 75, 70, 65, 60, 55, 50, 55, 50, 45, 40, 35, 40, 35, 32]);
  const [price, setPrice] = useState(189.84);
  const [change, setChange] = useState(2.34);
  const [high, setHigh] = useState(192.53);
  const [rsi, setRsi] = useState(62.4);
  const [macd, setMacd] = useState(1.23);
  const [volume, setVolume] = useState(45.2);

  /* Feature carousel ----------------------------------------------- */
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  /* Pricing ---------------------------------------------------------*/
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  /* Bento dashboard: live chart panel -------------------------------*/
  const [dashPrice, setDashPrice] = useState(892.45);
  const [dashChange, setDashChange] = useState(0.0);
  const [dashRsi, setDashRsi] = useState(68.2);
  const [dashMacd, setDashMacd] = useState(2.45);
  const [dashVol, setDashVol] = useState(89);
  const [dashChartData, setDashChartData] = useState([50, 45, 48, 35, 38, 25, 28, 15, 18, 8, 12]);
  const [aiInsight, setAiInsight] = useState('Strong momentum with RSI at 68. Consider taking profits at $920 resistance.');

  /* Watchlist with micro-sparklines ---------------------------------*/
  const [watchlist, setWatchlist] = useState([
    { symbol: 'AAPL', name: 'Apple Inc.', price: 189.84, change: 2.34, spark: genSpark(16, 20, 4) },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.67, change: -2.18, spark: genSpark(16, 20, 5) },
    { symbol: 'NVDA', name: 'NVIDIA Corp', price: 892.45, change: 5.67, spark: genSpark(16, 20, 6) },
    { symbol: 'META', name: 'Meta Platforms', price: 505.12, change: 0.45, spark: genSpark(16, 20, 3) },
    { symbol: 'AMD', name: 'Advanced Micro', price: 178.34, change: 4.21, spark: genSpark(16, 20, 4) },
  ]);

  /* Quick Trade panel -------------------------------------------------*/
  const [tradeSide, setTradeSide] = useState<'buy' | 'sell'>('buy');
  const [tradeSymbol, setTradeSymbol] = useState('NVDA');
  const [tradeQty, setTradeQty] = useState(10);

  const aiInsights = [
    'Strong momentum with RSI at 68. Consider taking profits at $920 resistance.',
    'Bullish MACD crossover detected. Volume confirms upward trend continuation.',
    'Price testing key support at $880. Watch for bounce or breakdown signals.',
    'Overbought conditions emerging. Consider reducing position size gradually.',
    'Positive earnings sentiment driving momentum. Target price raised to $950.',
  ];

  const featureCards = [
    { icon: BarChart3, title: 'Real-Time Charts', desc: 'Interactive candlestick charts with 50+ technical indicators', color: BULL_SOLID, tags: ['Live Data', '50+ Indicators'] },
    { icon: Brain, title: 'AI Explanations', desc: 'Human-readable AI insights and technical analysis', color: '#4FACFE', tags: ['Model-Driven', 'Actionable'] },
    { icon: MessageSquare, title: 'News Sentiment', desc: 'Real-time sentiment analysis and news summaries', color: '#FFB020', tags: ['Real-Time', 'Summaries'] },
    { icon: TrendingUp, title: 'Price Predictions', desc: 'ML-powered forecasting with confidence bands', color: BULL_SOLID, tags: ['ML Models', 'Alerts'] },
    { icon: Shield, title: 'Risk Alerts', desc: 'Instant volatility spikes and portfolio risk signals', color: BEAR_SOLID, tags: ['Risk Score', 'Stops'] },
    { icon: BarChart3, title: 'Portfolio Heatmap', desc: 'See sector exposure and diversification at a glance', color: '#4FACFE', tags: ['Sectors', 'Diversify'] },
  ];

  const hotTickers = [
    { symbol: 'NVDA', price: 892.45, change: 5.67 },
    { symbol: 'AMD', price: 178.34, change: 4.21 },
    { symbol: 'TSLA', price: 248.67, change: -2.18 },
    { symbol: 'AAPL', price: 189.84, change: 2.34 },
    { symbol: 'MSFT', price: 415.23, change: 1.12 },
    { symbol: 'META', price: 505.12, change: 0.45 },
    { symbol: 'AMZN', price: 178.92, change: 3.45 },
    { symbol: 'INTC', price: 42.18, change: -0.56 },
    { symbol: 'GOOGL', price: 141.56, change: -0.89 },
    { symbol: 'NFLX', price: 628.90, change: -1.23 },
  ];

  /* --------------------------- live ticking effects --------------------------- */
  useEffect(() => {
    const interval = setInterval(() => {
      setChartData(prev => {
        const newData = [...prev.slice(1)];
        const lastValue = prev[prev.length - 1];
        const newValue = Math.max(25, Math.min(130, lastValue + (Math.random() - 0.45) * 12));
        newData.push(newValue);
        return newData;
      });
      setPrice(prev => Math.round((prev + (Math.random() - 0.45) * 0.8) * 100) / 100);
      setChange(prev => Math.round((prev + (Math.random() - 0.5) * 0.15) * 100) / 100);
      setHigh(prev => (Math.random() > 0.7 ? Math.round((prev + (Math.random() - 0.3) * 0.5) * 100) / 100 : prev));
      setRsi(prev => Math.round((prev + (Math.random() - 0.5) * 2) * 10) / 10);
      setMacd(prev => Math.round((prev + (Math.random() - 0.5) * 0.1) * 100) / 100);
      setVolume(prev => Math.round((prev + (Math.random() - 0.5) * 0.5) * 10) / 10);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const cardInterval = setInterval(() => {
      setActiveCardIndex(prev => (prev + 1) % featureCards.length);
    }, 3000);
    return () => clearInterval(cardInterval);
  }, [featureCards.length]);

  useEffect(() => {
    const dashInterval = setInterval(() => {
      setDashPrice(prev => {
        const next = Math.round((prev + (Math.random() - 0.5) * 14) * 100) / 100;
        const diff = next - prev;
        const pct = prev === 0 ? 0 : (diff / prev) * 100;
        setDashChange(Math.round(pct * 100) / 100);
        return next;
      });
      setDashRsi(prev => Math.max(30, Math.min(85, Math.round((prev + (Math.random() - 0.5) * 3) * 10) / 10)));
      setDashMacd(prev => Math.round((prev + (Math.random() - 0.5) * 0.2) * 100) / 100);
      setDashVol(prev => Math.max(50, Math.min(150, Math.round(prev + (Math.random() - 0.5) * 5))));
      setDashChartData(prev => {
        const newData = [...prev.slice(1)];
        const lastVal = prev[prev.length - 1];
        const newVal = Math.max(5, Math.min(55, lastVal + (Math.random() - 0.45) * 8));
        newData.push(newVal);
        return newData;
      });
      if (Math.random() > 0.85) setAiInsight(aiInsights[Math.floor(Math.random() * aiInsights.length)]);
    }, 2000);
    return () => clearInterval(dashInterval);
  }, []);

  useEffect(() => {
    const wlInterval = setInterval(() => {
      setWatchlist(prev =>
        prev.map(s => {
          const delta = (Math.random() - 0.48) * (s.price * 0.004);
          const newPrice = Math.round((s.price + delta) * 100) / 100;
          const newChange = Math.round((s.change + (Math.random() - 0.5) * 0.2) * 100) / 100;
          const spark = [...s.spark.slice(1), Math.max(2, Math.min(38, s.spark[s.spark.length - 1] + (Math.random() - 0.48) * 6))];
          return { ...s, price: newPrice, change: newChange, spark };
        })
      );
    }, 1800);
    return () => clearInterval(wlInterval);
  }, []);

  const chartPath = dataToPath(chartData, 380, 140);
  const areaPath = dataToAreaPath(chartData, 380, 140);
  const lastPoint = chartData[chartData.length - 1];
  const lastX = 380;

  const priceTone = dashChange > 0.3 ? BULL_SOLID : dashChange < -0.3 ? BEAR_SOLID : '#FFB020';
  const tradeQuote = watchlist.find(s => s.symbol === tradeSymbol)?.price ?? 892.45;
  const estTotal = useMemo(() => Math.round(tradeQuote * tradeQty * 100) / 100, [tradeQuote, tradeQty]);

  return (
    <div className="min-h-screen text-white relative font-sans" style={{ background: INK }}>
      {/* ================= Global backdrop ================= */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0" style={{ background: INK }} />
        {/* fine technical grid */}
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        {/* neon glow orbs */}
        <div className="absolute -top-40 right-0 w-[560px] h-[560px] rounded-full blur-[140px] opacity-[0.16]" style={{ background: BULL_SOLID }} />
        <div className="absolute top-[40%] -left-40 w-[480px] h-[480px] rounded-full blur-[140px] opacity-[0.10]" style={{ background: BEAR_SOLID }} />
        <div className="absolute bottom-0 right-1/4 w-[420px] h-[420px] rounded-full blur-[130px] opacity-[0.08]" style={{ background: '#4FACFE' }} />
        {/* vignette */}
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)' }} />
      </div>

      <div className="relative z-10">
        {/* ================= Nav ================= */}
        <nav className="fixed top-0 w-full z-50 backdrop-blur-xl border-b border-white/[0.06]" style={{ background: 'rgba(5,5,6,0.72)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${BULL_FROM}, ${BULL_TO})`, boxShadow: `0 0 18px ${BULL_SOLID}55` }}
              >
                <TrendingUp className="w-4.5 h-4.5 text-black" strokeWidth={2.5} />
              </div>
              <span className="text-lg font-semibold tracking-tight">Stonks</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-white/60 hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm text-white/60 hover:text-white transition-colors">How it Works</a>
              <Link href="/#pricing" className="text-sm text-white/60 hover:text-white transition-colors">Pricing</Link>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/[0.06]">Login</Button>
              </Link>
              <Link href="/signup">
                <Button
                  size="sm"
                  className="font-medium text-black border-0 transition-all hover:scale-[1.03]"
                  style={{ background: `linear-gradient(135deg, ${BULL_FROM}, ${BULL_TO})`, boxShadow: `0 0 20px ${BULL_SOLID}40` }}
                >
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </nav>

        {/* ================= Hero ================= */}
        <section className="pt-36 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="max-w-7xl mx-auto relative">
            <div className="grid lg:grid-cols-2 gap-14 lg:gap-8 items-center">
              {/* Left */}
              <div className="text-center lg:text-left">
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-8 backdrop-blur-md"
                  style={{ borderColor: `${BULL_SOLID}33`, background: `${BULL_SOLID}0D` }}
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: BULL_SOLID }} />
                    <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: BULL_SOLID }} />
                  </span>
                  <span className="text-xs font-mono tracking-wide text-white/70">LIVE MARKET INTELLIGENCE</span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.05 }}
                  className="text-4xl sm:text-5xl lg:text-[3.6rem] font-bold mb-6 leading-[1.08] tracking-tight"
                >
                  <span className="block">Trade with signal,</span>
                  <span className="block mt-1">
                    not{' '}
                    <span
                      className="text-transparent bg-clip-text"
                      style={{ backgroundImage: `linear-gradient(90deg, ${BEAR_FROM}, ${BEAR_TO})` }}
                    >
                      noise
                    </span>
                    .
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-lg text-white/55 mb-9 max-w-xl mx-auto lg:mx-0 leading-relaxed"
                >
                  Institutional-grade charting, AI-generated insight, and live sentiment — built for traders who need clarity at the speed of the market.
                </motion.p>

                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10">
                  <Link href="/signup">
                    <Button
                      size="lg"
                      className="gap-2 h-14 px-8 text-base font-semibold text-black border-0 transition-all hover:scale-[1.02]"
                      style={{ background: `linear-gradient(135deg, ${BULL_FROM}, ${BULL_TO})`, boxShadow: `0 0 30px ${BULL_SOLID}45` }}
                    >
                      Get Started Free
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </Link>
                  <Link href="/demo">
                    <Button
                      variant="outline"
                      size="lg"
                      className="h-14 px-8 text-base font-semibold border-white/[0.12] text-white/80 hover:text-white hover:bg-white/[0.04] hover:border-white/25 transition-all"
                    >
                      Try Demo
                    </Button>
                  </Link>
                </div>

                <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/[0.08]">
                  {[['1M+', 'Data Points'], ['50+', 'Indicators'], ['24/7', 'AI Analysis']].map(([n, l]) => (
                    <div key={l} className="group">
                      <div className="text-2xl sm:text-3xl font-bold font-mono tracking-tight group-hover:text-[color:var(--tone)] transition-colors" style={{ ['--tone' as any]: BULL_SOLID }}>{n}</div>
                      <div className="text-sm text-white/45 mt-1">{l}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right — hero live chart card */}
              <div className="relative lg:pl-8">
                <div
                  className="absolute -inset-6 rounded-3xl blur-3xl opacity-70"
                  style={{ background: `linear-gradient(120deg, ${BULL_SOLID}22, transparent 40%, ${BEAR_SOLID}18)` }}
                />
                <div
                  className="relative rounded-2xl p-6 backdrop-blur-xl border"
                  style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)', boxShadow: '0 30px 80px -20px rgba(0,0,0,0.7)' }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${BULL_SOLID}1A`, border: `1px solid ${BULL_SOLID}30` }}>
                        <TrendingUp className="w-5 h-5" style={{ color: BULL_SOLID }} />
                      </div>
                      <div>
                        <div className="font-semibold font-mono">AAPL</div>
                        <div className="text-sm text-white/40">Apple Inc.</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-xl font-mono transition-all duration-300">${price.toFixed(2)}</div>
                      <div
                        className="text-sm font-medium font-mono transition-all duration-300 flex items-center justify-end gap-1"
                        style={{ color: change >= 0 ? BULL_SOLID : BEAR_SOLID }}
                      >
                        {change >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                        {change >= 0 ? '+' : ''}{change.toFixed(2)}%
                      </div>
                    </div>
                  </div>

                  <div className="relative h-48 mb-6 rounded-xl p-4 overflow-hidden border border-white/[0.04]" style={{ background: 'rgba(0,0,0,0.35)' }}>
                    <svg className="w-full h-full" viewBox="0 0 400 150" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor={BULL_SOLID} stopOpacity="0.35" />
                          <stop offset="100%" stopColor={BULL_SOLID} stopOpacity="0.02" />
                        </linearGradient>
                        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor={BULL_FROM} />
                          <stop offset="100%" stopColor={BULL_TO} />
                        </linearGradient>
                        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                          <feGaussianBlur stdDeviation="3.2" result="blur" />
                          <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                      </defs>
                      {[0, 37.5, 75, 112.5, 150].map((y, i) => (
                        <line key={i} x1="0" y1={y} x2="400" y2={y} stroke="rgba(255,255,255,0.045)" strokeWidth="1" />
                      ))}
                      <path d={areaPath} fill="url(#chartGradient)" className="transition-all duration-500 ease-out" />
                      <path
                        d={chartPath}
                        fill="none"
                        stroke="url(#lineGradient)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        filter="url(#glow)"
                        className="transition-all duration-500 ease-out"
                      />
                      <circle cx={lastX} cy={lastPoint} r="12" fill={BULL_SOLID} fillOpacity="0.18" className="animate-ping" />
                      <circle cx={lastX} cy={lastPoint} r="5" fill={BULL_SOLID} className="animate-pulse" />
                      <circle cx={lastX} cy={lastPoint} r="2.4" fill="#fff" />
                    </svg>
                    <div className="absolute top-4 right-6 rounded-lg px-3 py-2 backdrop-blur-md border" style={{ background: 'rgba(10,11,16,0.7)', borderColor: 'rgba(255,255,255,0.06)' }}>
                      <div className="text-[10px] text-white/40 font-mono">TODAY&apos;S HIGH</div>
                      <div className="font-semibold font-mono transition-all duration-300" style={{ color: BULL_SOLID }}>${high.toFixed(2)}</div>
                    </div>
                    <div className="absolute bottom-1 left-4 right-4 flex justify-between text-[10px] text-white/25 font-mono">
                      <span>9:30</span><span>11:00</span><span>12:30</span><span>14:00</span><span>15:30</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {[['RSI', rsi.toFixed(1), '#fff'], ['MACD', `${macd >= 0 ? '+' : ''}${macd.toFixed(2)}`, macd >= 0 ? BULL_SOLID : BEAR_SOLID], ['VOL', `${volume.toFixed(1)}M`, '#fff']].map(([label, val, color]) => (
                      <div key={label as string} className="rounded-xl p-3 text-center border border-white/[0.05]" style={{ background: 'rgba(255,255,255,0.02)' }}>
                        <div className="text-[10px] text-white/35 mb-1 font-mono tracking-wide">{label}</div>
                        <div className="font-semibold font-mono transition-all duration-300" style={{ color: color as string }}>{val}</div>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-xl p-4 border" style={{ background: `${BULL_SOLID}0D`, borderColor: `${BULL_SOLID}30` }}>
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="w-4 h-4" style={{ color: BULL_SOLID }} />
                      <span className="text-sm font-medium" style={{ color: BULL_SOLID }}>AI Insight</span>
                    </div>
                    <p className="text-sm text-white/50">Strong bullish momentum detected. RSI indicates healthy growth potential with support at $185.</p>
                  </div>
                </div>

                <div
                  className="absolute -top-4 -right-4 rounded-xl px-3 py-2 backdrop-blur-md border animate-bounce"
                  style={{ background: 'rgba(10,11,16,0.85)', borderColor: 'rgba(255,255,255,0.08)', animationDuration: '3s' }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: BULL_SOLID }} />
                    <span className="text-sm font-medium font-mono">LIVE</span>
                  </div>
                </div>
                <div className="absolute -bottom-2 -left-2 rounded-xl px-4 py-2 backdrop-blur-md border" style={{ background: 'rgba(10,11,16,0.85)', borderColor: 'rgba(255,255,255,0.08)' }}>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" style={{ color: '#4FACFE' }} />
                    <span className="text-sm text-white/50 font-mono">50+ Indicators</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= Bento Trading Deck ================= */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-5" style={{ borderColor: `${BULL_SOLID}30`, background: `${BULL_SOLID}0D` }}>
                <Zap className="w-3.5 h-3.5" style={{ color: BULL_SOLID }} />
                <span className="text-xs font-mono tracking-wide text-white/70">TRADING DECK</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">Everything on one screen</h2>
              <p className="text-white/45 max-w-xl mx-auto">Your chart, your book, your trade — live and in sync.</p>
            </div>

            {/* Bento grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Live chart — large panel */}
              <div
                className="lg:col-span-2 lg:row-span-2 rounded-2xl p-6 border backdrop-blur-xl relative overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${BULL_SOLID}1A`, border: `1px solid ${BULL_SOLID}30` }}>
                      <TrendingUp className="w-4 h-4" style={{ color: BULL_SOLID }} />
                    </div>
                    <div>
                      <div className="text-sm font-semibold font-mono">NVDA</div>
                      <div className="text-xs text-white/40">NVIDIA Corp</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold font-mono transition-all duration-300" style={{ color: priceTone }}>${dashPrice.toFixed(2)}</div>
                    <div className="text-xs font-mono transition-all duration-300" style={{ color: priceTone }}>
                      {dashChange >= 0 ? '+' : ''}{dashChange.toFixed(2)}%
                    </div>
                  </div>
                </div>

                <div className="rounded-xl p-4 mb-4 border border-white/[0.04]" style={{ background: 'rgba(0,0,0,0.35)' }}>
                  <svg className="w-full h-40" viewBox="0 0 200 60" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="miniChartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor={priceTone} stopOpacity="0.32" />
                        <stop offset="100%" stopColor={priceTone} stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d={`M${dashChartData.map((val, i) => `${(i * 200) / (dashChartData.length - 1)},${val}`).join(' L')} L200,60 L0,60 Z`}
                      fill="url(#miniChartGrad)"
                      className="transition-all duration-500"
                    />
                    <path
                      d={`M${dashChartData.map((val, i) => `${(i * 200) / (dashChartData.length - 1)},${val}`).join(' L')}`}
                      fill="none"
                      stroke={priceTone}
                      strokeWidth="2"
                      strokeLinecap="round"
                      className="transition-all duration-500"
                    />
                    <circle cx="200" cy={dashChartData[dashChartData.length - 1]} r="4" fill={priceTone} className="animate-pulse" />
                  </svg>
                </div>

                <div className="rounded-xl p-4 mb-4 border" style={{ background: 'rgba(79,172,254,0.08)', borderColor: 'rgba(79,172,254,0.25)' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-4 h-4" style={{ color: '#4FACFE' }} />
                    <span className="text-xs font-medium" style={{ color: '#4FACFE' }}>AI Analysis</span>
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#4FACFE' }} />
                  </div>
                  <p className="text-xs text-white/50 transition-all duration-500">{aiInsight}</p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[['RSI', dashRsi.toFixed(1), '#fff'], ['MACD', `${dashMacd >= 0 ? '+' : ''}${dashMacd.toFixed(2)}`, dashMacd >= 0 ? BULL_SOLID : BEAR_SOLID], ['VOL', `${dashVol}M`, '#fff']].map(([l, v, c]) => (
                    <div key={l as string} className="rounded-lg p-2.5 text-center border border-white/[0.05]" style={{ background: 'rgba(255,255,255,0.02)' }}>
                      <div className="text-[10px] text-white/35 font-mono">{l}</div>
                      <div className="text-sm font-semibold font-mono transition-all duration-300" style={{ color: c as string }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Trade panel */}
              <div
                className="rounded-2xl p-6 border backdrop-blur-xl"
                style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}
              >
                <div className="flex items-center justify-between mb-5">
                  <span className="text-sm font-semibold">Quick Trade</span>
                  <span className="text-xs font-mono text-white/35">{tradeSymbol}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-5">
                  <button
                    onClick={() => setTradeSide('buy')}
                    className="rounded-xl py-3 text-sm font-semibold transition-all duration-300 border"
                    style={
                      tradeSide === 'buy'
                        ? { background: `linear-gradient(135deg, ${BULL_FROM}, ${BULL_TO})`, color: '#050506', borderColor: 'transparent', boxShadow: `0 0 24px ${BULL_SOLID}55` }
                        : { background: 'rgba(255,255,255,0.02)', color: 'rgba(255,255,255,0.5)', borderColor: 'rgba(255,255,255,0.08)' }
                    }
                  >
                    Buy
                  </button>
                  <button
                    onClick={() => setTradeSide('sell')}
                    className="rounded-xl py-3 text-sm font-semibold transition-all duration-300 border"
                    style={
                      tradeSide === 'sell'
                        ? { background: `linear-gradient(135deg, ${BEAR_FROM}, ${BEAR_TO})`, color: '#050506', borderColor: 'transparent', boxShadow: `0 0 24px ${BEAR_SOLID}55` }
                        : { background: 'rgba(255,255,255,0.02)', color: 'rgba(255,255,255,0.5)', borderColor: 'rgba(255,255,255,0.08)' }
                    }
                  >
                    Sell
                  </button>
                </div>

                <div className="space-y-3 mb-5">
                  <div>
                    <div className="text-[10px] text-white/35 font-mono mb-1.5">QUANTITY</div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setTradeQty(q => Math.max(1, q - 1))}
                        className="w-8 h-8 rounded-lg border border-white/10 text-white/60 hover:text-white hover:border-white/25 transition-colors"
                      >
                        –
                      </button>
                      <div className="flex-1 text-center font-mono font-semibold text-lg">{tradeQty}</div>
                      <button
                        onClick={() => setTradeQty(q => q + 1)}
                        className="w-8 h-8 rounded-lg border border-white/10 text-white/60 hover:text-white hover:border-white/25 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm pt-3 border-t border-white/[0.06]">
                    <span className="text-white/40">Est. Total</span>
                    <span className="font-mono font-semibold">
                      $<NumberFlow value={estTotal} transformTiming={{ duration: 400, easing: 'ease-out' }} />
                    </span>
                  </div>
                </div>

                <button
                  className="w-full rounded-xl py-3.5 text-sm font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background: tradeSide === 'buy' ? `linear-gradient(135deg, ${BULL_FROM}, ${BULL_TO})` : `linear-gradient(135deg, ${BEAR_FROM}, ${BEAR_TO})`,
                    color: '#050506',
                    boxShadow: tradeSide === 'buy' ? `0 0 30px ${BULL_SOLID}50` : `0 0 30px ${BEAR_SOLID}50`,
                  }}
                >
                  {tradeSide === 'buy' ? 'Execute Buy' : 'Execute Sell'}
                </button>
              </div>

              {/* Watchlist with sparklines */}
              <div
                className="rounded-2xl p-6 border backdrop-blur-xl"
                style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold">Watchlist</span>
                  <span className="text-xs text-white/35 font-mono">{watchlist.length} assets</span>
                </div>
                <div className="space-y-1">
                  {watchlist.map(s => {
                    const up = s.change >= 0;
                    const tone = up ? BULL_SOLID : BEAR_SOLID;
                    const sparkPath = dataToPath(s.spark, 60, 24);
                    return (
                      <button
                        key={s.symbol}
                        onClick={() => setTradeSymbol(s.symbol)}
                        className="w-full flex items-center justify-between gap-3 rounded-xl px-2.5 py-2.5 transition-all duration-200 border"
                        style={{
                          background: tradeSymbol === s.symbol ? `${tone}0F` : 'transparent',
                          borderColor: tradeSymbol === s.symbol ? `${tone}35` : 'transparent',
                        }}
                      >
                        <div className="text-left">
                          <div className="text-sm font-semibold font-mono">{s.symbol}</div>
                          <div className="text-[10px] text-white/35">{s.name}</div>
                        </div>
                        <svg width="60" height="24" viewBox="0 0 60 24" className="opacity-90">
                          <path d={sparkPath} fill="none" stroke={tone} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="text-right">
                          <div className="text-sm font-mono font-semibold">${s.price.toFixed(2)}</div>
                          <div className="text-[11px] font-mono flex items-center justify-end gap-0.5" style={{ color: tone }}>
                            {up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                            {up ? '+' : ''}{s.change.toFixed(2)}%
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Hot Tickers glowing marquee */}
            <div
              className="mt-4 py-4 rounded-2xl border overflow-hidden relative"
              style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}
            >
              <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none" style={{ background: `linear-gradient(to right, ${PANEL}, transparent)` }} />
              <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none" style={{ background: `linear-gradient(to left, ${PANEL}, transparent)` }} />
              <div className="flex animate-marquee whitespace-nowrap">
                {[...hotTickers, ...hotTickers].map((t, i) => {
                  const up = t.change >= 0;
                  const tone = up ? BULL_SOLID : BEAR_SOLID;
                  return (
                    <div key={i} className="flex items-center gap-2.5 mx-6">
                      <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: tone, boxShadow: `0 0 8px ${tone}` }} />
                      <span className="text-sm font-semibold font-mono">{t.symbol}</span>
                      <span className="text-sm text-white/40 font-mono">${t.price.toFixed(2)}</span>
                      <span className="text-sm font-medium font-mono" style={{ color: tone }}>{up ? '+' : ''}{t.change.toFixed(2)}%</span>
                      <div className="w-px h-4 bg-white/10 ml-3.5" />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <style jsx>{`
            @keyframes marquee {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .animate-marquee { animation: marquee 32s linear infinite; }
          `}</style>
        </section>

        {/* ================= Features ================= */}
        <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6" style={{ borderColor: `${BULL_SOLID}30`, background: `${BULL_SOLID}0D` }}>
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: BULL_SOLID }} />
                <span className="text-sm font-medium" style={{ color: BULL_SOLID }}>Features</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold mb-6 tracking-tight">Powerful, precise, instant</h2>
              <p className="text-white/45 max-w-2xl mx-auto text-lg">Everything you need for intelligent stock analysis</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featureCards.map((feature, index) => {
                const Icon = feature.icon;
                const active = index === activeCardIndex;
                return (
                  <motion.div
                    key={feature.title}
                    animate={{ scale: active ? 1.02 : 1 }}
                    transition={{ duration: 0.5 }}
                    className="relative p-6 rounded-2xl border backdrop-blur-xl overflow-hidden"
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      borderColor: active ? `${feature.color}45` : 'rgba(255,255,255,0.06)',
                      boxShadow: active ? `0 0 40px ${feature.color}25` : 'none',
                    }}
                  >
                    <div
                      className="absolute inset-0 transition-opacity duration-700"
                      style={{ background: `radial-gradient(circle at top left, ${feature.color}20, transparent 60%)`, opacity: active ? 1 : 0.15 }}
                    />
                    <div className="relative z-10">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                        style={{ background: `linear-gradient(135deg, ${feature.color}30, ${feature.color}10)`, border: `1px solid ${feature.color}30` }}
                      >
                        <Icon className="w-6 h-6" style={{ color: feature.color }} />
                      </div>
                      <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                      <p className="text-white/45 text-sm mb-4">{feature.desc}</p>
                      <div className="flex gap-2">
                        {feature.tags.map(tag => (
                          <span key={tag} className="px-2.5 py-1 rounded-full text-xs font-medium font-mono" style={{ background: `${feature.color}15`, color: feature.color }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================= How It Works ================= */}
        <section id="how-it-works" className="py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6" style={{ borderColor: `${BULL_SOLID}30`, background: `${BULL_SOLID}0D` }}>
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: BULL_SOLID }} />
                <span className="text-sm font-medium" style={{ color: BULL_SOLID }}>Simple Process</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold mb-6 tracking-tight">How It Works</h2>
              <p className="text-white/45 max-w-2xl mx-auto text-lg">Four steps to start analyzing stocks like a pro</p>
            </div>

            <div className="relative">
              <div
                className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px md:-translate-x-1/2"
                style={{ background: `linear-gradient(to bottom, ${BULL_SOLID}, #4FACFE, ${BEAR_SOLID})` }}
              />
              <div className="space-y-10 md:space-y-16">
                {[
                  { n: 1, side: 'left', color: BULL_SOLID, title: 'Create Your Account', body: 'Sign up with email or Google in seconds. Set your market preferences, risk tolerance, and investment goals.', tags: ['Quick Setup', 'Secure'] },
                  { n: 2, side: 'right', color: '#4FACFE', title: 'Build Your Watchlist', body: 'Search thousands of stocks and add them to your personalized watchlist. Get tailored insights based on your portfolio.', tags: ['Custom Lists', 'Alerts'] },
                  { n: 3, side: 'left', color: '#FFB020', title: 'Analyze & Learn', body: 'Explore interactive charts, AI-powered insights, real-time news sentiment, and ML-based price predictions.', tags: ['AI Insights', 'Charts'] },
                  { n: 4, side: 'right', color: BULL_TO, title: 'Make Smarter Decisions', body: 'Use data-driven insights to time your entries and exits. Track performance and refine your strategy over time.', tags: ['Performance', 'Strategy'] },
                ].map(step => (
                  <div key={step.n} className="relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-0">
                    {step.side === 'left' ? (
                      <>
                        <div className="md:pr-16 pl-12 md:pl-0">
                          <StepCard color={step.color} n={step.n} title={step.title} body={step.body} tags={step.tags} />
                        </div>
                        <div className="hidden md:block" />
                      </>
                    ) : (
                      <>
                        <div className="hidden md:block" />
                        <div className="md:pl-16 pl-12">
                          <StepCard color={step.color} n={step.n} title={step.title} body={step.body} tags={step.tags} />
                        </div>
                      </>
                    )}
                    <div
                      className="absolute left-4 md:left-1/2 top-8 -translate-x-1/2 w-6 h-6 rounded-full border-4"
                      style={{ background: step.color, borderColor: INK, boxShadow: `0 0 20px ${step.color}80` }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ================= Pricing ================= */}
        <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-medium mb-6" style={{ borderColor: `${BULL_SOLID}30`, background: `${BULL_SOLID}0D`, color: BULL_SOLID }}>
                <TrendingUp className="w-4 h-4" />
                Simple Pricing
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight">
                Choose Your <span style={{ color: BULL_SOLID }}>Plan</span>
              </h2>
              <p className="text-white/45 max-w-2xl mx-auto text-lg">Start free and upgrade as you grow. No hidden fees, cancel anytime.</p>
            </div>

            <div className="flex justify-center mb-12">
              <div className="inline-flex items-center gap-1 p-1 rounded-full border border-white/[0.08]" style={{ background: 'rgba(255,255,255,0.02)' }}>
                {(['monthly', 'yearly'] as const).map(period => (
                  <button
                    key={period}
                    onClick={() => setBillingPeriod(period)}
                    className="px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2"
                    style={
                      billingPeriod === period
                        ? { background: `linear-gradient(135deg, ${BULL_FROM}, ${BULL_TO})`, color: '#050506', boxShadow: `0 0 20px ${BULL_SOLID}40` }
                        : { color: 'rgba(255,255,255,0.5)' }
                    }
                  >
                    {period === 'monthly' ? 'Monthly' : 'Yearly'}
                    {period === 'yearly' && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: 'rgba(255,176,32,0.18)', color: '#FFB020' }}>-20%</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {/* Free */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="relative p-6 lg:p-8 rounded-2xl border backdrop-blur-xl transition-all duration-500 hover:border-white/[0.16]"
                style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.08)' }}
              >
                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-2">Free</h3>
                  <p className="text-white/40 text-sm">Perfect for getting started</p>
                </div>
                <div className="mb-6 flex items-baseline gap-1">
                  <span className="text-4xl font-bold font-mono">$0</span>
                  <span className="text-white/35">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {['5 stocks in watchlist', 'Basic chart analysis', 'Daily market summary', 'Email support'].map(f => (
                    <li key={f} className="flex items-center gap-3 text-white/60 text-sm">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `${BULL_SOLID}1A` }}>
                        <Check className="w-3 h-3" style={{ color: BULL_SOLID }} />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/signup" className="block">
                  <Button className="w-full bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/10 hover:border-white/20 transition-all duration-300">Get Started</Button>
                </Link>
              </motion.div>

              {/* Pro — featured */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="relative p-6 lg:p-8 rounded-2xl border-2 backdrop-blur-xl transition-all duration-500"
                style={{ background: 'rgba(255,255,255,0.03)', borderColor: `${BULL_SOLID}55`, boxShadow: `0 0 60px ${BULL_SOLID}22` }}
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 rounded-full text-black text-xs font-semibold" style={{ background: BULL_SOLID, boxShadow: `0 0 20px ${BULL_SOLID}70` }}>
                    Most Popular
                  </span>
                </div>
                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-2">Pro</h3>
                  <p className="text-white/40 text-sm">For serious traders</p>
                </div>
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold font-mono">$</span>
                    <NumberFlow value={billingPeriod === 'monthly' ? 19 : 15} className="text-4xl font-bold font-mono" transformTiming={{ duration: 500, easing: 'ease-out' }} />
                    <span className="text-white/35">/month</span>
                  </div>
                  <AnimatePresence mode="wait">
                    {billingPeriod === 'yearly' && (
                      <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-sm mt-1" style={{ color: BULL_SOLID }}>
                        Billed $180/year (save $48)
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
                <ul className="space-y-3 mb-8">
                  {['Unlimited watchlist stocks', 'AI-powered insights', '50+ technical indicators', 'Real-time price alerts', 'News sentiment analysis', 'Priority support'].map(f => (
                    <li key={f} className="flex items-center gap-3 text-white/70 text-sm">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `${BULL_SOLID}1A` }}>
                        <Check className="w-3 h-3" style={{ color: BULL_SOLID }} />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/signup" className="block">
                  <Button
                    className="w-full text-black font-semibold border-0 transition-all duration-300 hover:scale-[1.02]"
                    style={{ background: `linear-gradient(135deg, ${BULL_FROM}, ${BULL_TO})`, boxShadow: `0 0 30px ${BULL_SOLID}45` }}
                  >
                    Start Pro Trial
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </motion.div>

              {/* Enterprise */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative p-6 lg:p-8 rounded-2xl border backdrop-blur-xl transition-all duration-500 hover:border-[#4FACFE]/30"
                style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.08)' }}
              >
                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-2">Enterprise</h3>
                  <p className="text-white/40 text-sm">For teams & institutions</p>
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-bold font-mono">Custom</span>
                  <p className="text-white/35 text-sm mt-1">Tailored to your needs</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {['Everything in Pro', 'API access', 'Custom integrations', 'Team collaboration', 'Advanced analytics', 'Dedicated account manager'].map(f => (
                    <li key={f} className="flex items-center gap-3 text-white/60 text-sm">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(79,172,254,0.15)' }}>
                        <Check className="w-3 h-3" style={{ color: '#4FACFE' }} />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/signup" className="block">
                  <Button className="w-full bg-white/[0.04] hover:bg-white/[0.08] text-white border border-[#4FACFE]/25 hover:border-[#4FACFE]/50 transition-all duration-300">Contact Sales</Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ================= Footer ================= */}
        <footer className="pt-16 pb-10 px-4 sm:px-6 lg:px-8 border-t border-white/[0.06]">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
              <div className="lg:col-span-2">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${BULL_FROM}, ${BULL_TO})` }}>
                    <TrendingUp className="w-4 h-4 text-black" />
                  </div>
                  <span className="text-lg font-semibold">Stonks</span>
                </div>
                <p className="text-white/40 text-sm leading-relaxed mb-6">
                  AI-powered market intelligence for modern investors. Track trends, uncover signals, and make confident decisions with real-time insights.
                </p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">Product</h4>
                <ul className="space-y-3 text-sm text-white/40">
                  <li><Link href="/#features" className="hover:text-white transition-colors">Features</Link></li>
                  <li><Link href="/#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                  <li><Link href="/login" className="hover:text-white transition-colors">Login</Link></li>
                  <li><Link href="/signup" className="hover:text-white transition-colors">Get Started</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">Company</h4>
                <ul className="space-y-3 text-sm text-white/40">
                  <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                  <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                  <li><Link href="/press" className="hover:text-white transition-colors">Press</Link></li>
                  <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">Legal</h4>
                <ul className="space-y-3 text-sm text-white/40">
                  <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                  <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                  <li><Link href="/security" className="hover:text-white transition-colors">Security</Link></li>
                  <li><Link href="/compliance" className="hover:text-white transition-colors">Compliance</Link></li>
                </ul>
              </div>
            </div>
            <div className="mt-12 pt-8 border-t border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-xs text-white/30 font-mono">© 2026 Stonks, Inc. All rights reserved.</p>
              <div className="flex items-center gap-4 text-xs text-white/30 font-mono">
                <span>FINRA #STK-4821</span>
                <span>SEC Registered</span>
                <span>SOC 2 Type II</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Timeline step card                                                 */
/* ------------------------------------------------------------------ */
function StepCard({ color, n, title, body, tags }: { color: string; n: number; title: string; body: string; tags: string[] }) {
  return (
    <div
      className="group relative p-6 rounded-2xl border backdrop-blur-xl transition-all duration-500"
      style={{ background: 'rgba(255,255,255,0.02)', borderColor: `${color}30` }}
    >
      <div className="absolute inset-0 rounded-2xl" style={{ background: `linear-gradient(135deg, ${color}12, transparent)` }} />
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${color}30, ${color}10)`, border: `1px solid ${color}30` }}>
            <span className="text-2xl font-bold font-mono" style={{ color }}>{n}</span>
          </div>
          <h3 className="text-xl font-bold transition-colors" style={{ color: undefined }}>{title}</h3>
        </div>
        <p className="text-white/45 leading-relaxed">{body}</p>
        <div className="flex gap-2 mt-4">
          {tags.map(tag => (
            <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium font-mono" style={{ background: `${color}15`, color }}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}