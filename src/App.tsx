/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, animate } from 'motion/react';
import { Mail, Lock, Heart, Sparkles, X, ChevronRight, ChevronLeft, Play, Pause, Volume2, VolumeX, Image as ImageIcon, ChevronDown, Filter, Search } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Letter {
  id: string;
  title: string;
  date: string;
  content: string;
  excerpt: string;
  color: string;
  audioUrl?: string;
  images?: string[];
  occasion: string;
  theme: string;
  keywords: string[];
}

const LETTERS: Letter[] = [
  {
    id: '1',
    title: 'The First Rain',
    date: 'October 14, 2023',
    excerpt: 'I remember the way the sky looked just before it broke...',
    content: `My Dearest Amore,\n\nI remember the way the sky looked just before it broke. It wasn't gray, not exactly. It was a deep, bruised violet, the kind of color that feels like a secret. You were standing under that old awning, trying to keep your books dry, and I was just... staring. \n\nI think that was the moment I realized that some things are worth getting soaked for. You looked up, caught my eye, and smiled. The rain started then, but I didn't feel cold. I just felt found.\n\nYours always.`,
    color: 'bg-[#e8e4dc]',
    images: ['https://picsum.photos/seed/rain1/800/600', 'https://picsum.photos/seed/rain2/800/600'],
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    occasion: 'First Meeting',
    theme: 'Rainy Day',
    keywords: ['rain', 'violet', 'smile']
  },
  {
    id: '2',
    title: 'Midnight Coffee',
    date: 'December 02, 2023',
    excerpt: 'The world was asleep, but we were just beginning...',
    content: `Amore,\n\nThree in the morning is a strange time. The world is asleep, but we were just beginning. The coffee was bitter, the neon sign outside was flickering, and you were explaining the plot of a book you hadn't even finished yet. \n\nI wasn't listening to the words, not really. I was listening to the way your voice softened when you got excited. I was watching the way your hands moved. \n\nI hope we never finish that book.\n\nAlways.`,
    color: 'bg-[#f0ece4]',
    images: ['https://picsum.photos/seed/coffee/800/600'],
    occasion: 'Late Night',
    theme: 'Coffee Shop',
    keywords: ['coffee', 'midnight', 'book']
  },
  {
    id: '3',
    title: 'A Promise in Ink',
    date: 'January 20, 2024',
    excerpt: 'I found this scrap of paper in my pocket today...',
    content: `My Love,\n\nI found this scrap of paper in my pocket today. It's just a grocery list, but on the back, you'd doodled a tiny heart and written "don't forget the stars." \n\nI won't. I promise. Even when the clouds are thick and the city lights are too bright, I'll remember where they are. Because you're the one who pointed them out to me.\n\nForever yours.`,
    color: 'bg-[#e5e1d8]',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    occasion: 'Anniversary',
    theme: 'Stars',
    keywords: ['stars', 'promise', 'heart']
  },
  {
    id: '4',
    title: 'The Last Train Home',
    date: 'February 14, 2024',
    excerpt: 'The station was empty, just the echo of our footsteps...',
    content: `Dearest,\n\nThe station was empty, just the echo of our footsteps and the hum of the tracks. You leaned your head on my shoulder, and for a second, the whole world stopped moving. \n\nWe didn't say anything. We didn't have to. The silence was enough. It was a full, heavy silence, like a blanket. \n\nI'm still wearing that sweater. It still smells like you.\n\nWith all my heart.`,
    color: 'bg-[#dfdbd2]',
    images: ['https://picsum.photos/seed/train/800/600'],
    occasion: 'Valentine\'s Day',
    theme: 'Travel',
    keywords: ['train', 'silence', 'sweater']
  }
];

const FallingHearts = () => {
  const [hearts, setHearts] = useState<{ id: number; x: number; size: number; duration: number; delay: number }[]>([]);

  useEffect(() => {
    const newHearts = Array.from({ length: 75 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 20 + 10,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 10,
    }));
    setHearts(newHearts);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          initial={{ y: -50, opacity: 0 }}
          animate={{ 
            y: ['0vh', '110vh'],
            opacity: [0, 0.4, 0.4, 0],
            x: [`${heart.x}vw`, `${heart.x + (Math.random() * 10 - 5)}vw`],
            rotate: [0, 360]
          }}
          transition={{
            duration: heart.duration,
            repeat: Infinity,
            delay: heart.delay,
            ease: "linear"
          }}
          className="absolute"
          style={{ left: `${heart.x}vw`, top: '-50px' }}
        >
          <Heart 
            size={heart.size} 
            className="text-romantic fill-romantic" 
          />
        </motion.div>
      ))}
    </div>
  );
};

const HeartBubbles = () => {
  const [bubbles, setBubbles] = useState<{ id: number; x: number; size: number; duration: number; delay: number }[]>([]);

  useEffect(() => {
    const newBubbles = Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 15 + 8,
      duration: Math.random() * 10 + 5,
      delay: Math.random() * 5,
    }));
    setBubbles(newBubbles);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {bubbles.map((bubble) => (
        <motion.div
          key={bubble.id}
          initial={{ y: '110vh', opacity: 0 }}
          animate={{ 
            y: ['110vh', '-10vh'],
            opacity: [0, 0.3, 0.3, 0],
            x: [`${bubble.x}vw`, `${bubble.x + (Math.random() * 6 - 3)}vw`],
          }}
          transition={{
            duration: bubble.duration,
            repeat: Infinity,
            delay: bubble.delay,
            ease: "easeOut"
          }}
          className="absolute"
          style={{ left: `${bubble.x}vw` }}
        >
          <Heart 
            size={bubble.size} 
            className="text-white fill-white" 
          />
        </motion.div>
      ))}
    </div>
  );
};

const PassphraseGate = ({ onUnlock }: { onUnlock: () => void }) => {
  const [passphrase, setPassphrase] = useState('');
  const [error, setError] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = passphrase.toLowerCase().replace(/\s/g, '').replace(/'/g, '').replace(/’/g, '');
    if (normalized === 'wowyourehot') {
      setIsExiting(true);
      setTimeout(onUnlock, 1000);
    } else {
      setError(true);
      setTimeout(() => setError(false), 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a0505] overflow-hidden">
      <HeartBubbles />
      
      {/* Starry Background overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 3}px`,
              height: `${Math.random() * 3}px`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={isExiting ? { opacity: 0, scale: 1.05, y: -20 } : { opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-xl w-full p-1 mx-4 z-20 relative"
      >
        <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[40px] p-8 md:p-14 shadow-2xl text-center">
          <div className="mb-8 flex justify-center">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner">
              <Sparkles className="w-6 h-6 text-white/80" />
            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-white tracking-tight">Restricted Romance Archive</h1>
          <p className="text-white/50 mb-10 text-sm font-sans">
            Enter the passphrase. The curtains will judge you.
          </p>
          
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 mb-8 text-left">
            <h3 className="text-white font-bold text-sm mb-2">Hint</h3>
            <p className="text-white/60 text-sm leading-relaxed font-sans">
              Please put the first thing I said when I first met you.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="password"
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                placeholder="Passphrase"
                className={cn(
                  "w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-romantic/40 transition-all font-sans text-white placeholder:text-white/20",
                  error && "border-romantic/50 text-romantic animate-shake"
                )}
              />
            </div>
            <motion.button 
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-romantic hover:bg-romantic/90 text-white px-10 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-romantic/20"
            >
              Unlock Archives
            </motion.button>
          </form>
          
          <p className="mt-12 text-white/30 text-[11px] font-sans uppercase tracking-[0.2em]">
            If you're not amore, this page will pretend it doesn't know you.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

const Envelope = ({ letter, isRead, onClick }: { letter: Letter, isRead: boolean, onClick: () => void }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isBursting, setIsBursting] = useState(false);

  const handleClick = () => {
    setIsBursting(true);
    setTimeout(() => {
      setIsBursting(false);
      onClick();
    }, 400);
  };

  return (
    <motion.div
      layoutId={`envelope-${letter.id}`}
      onClick={handleClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -15, scale: 1.1, rotate: 2 }}
      className={cn(
        "relative w-full md:w-64 h-44 cursor-pointer shadow-lg transition-all duration-300 hover:shadow-[0_20px_50px_rgba(240,67,67,0.3)] flex flex-col justify-between p-6 overflow-hidden border border-black/5",
        "bg-linear-to-br from-accent to-success text-deep",
        isRead && "opacity-90"
      )}
    >
      <AnimatePresence>
        {isHovered && (
          <motion.div 
            key="sparkles-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none"
          >
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={`sparkle-${letter.id}-${i}`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 1, 0], 
                  scale: [0, 1, 0],
                  x: Math.random() * 200 - 100,
                  y: Math.random() * 150 - 75
                }}
                transition={{ 
                  duration: 1, 
                  repeat: Infinity, 
                  delay: i * 0.1,
                  ease: "easeOut"
                }}
                className="absolute left-1/2 top-1/2"
              >
                <Sparkles className="w-3 h-3 text-romantic/30" />
              </motion.div>
            ))}
          </motion.div>
        )}
        {isBursting && (
          <motion.div 
            key="burst-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center"
          >
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={`burst-${letter.id}-${i}`}
                initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                animate={{ 
                  opacity: 0, 
                  scale: [0, 1.5, 0],
                  x: (Math.cos(i * 30 * Math.PI / 180) * 100),
                  y: (Math.sin(i * 30 * Math.PI / 180) * 100)
                }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="absolute"
              >
                <Heart className="w-4 h-4 text-romantic fill-romantic" />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-start">
        <div className="relative">
          <div className={cn(
            "w-8 h-8 rounded-full border border-deep/10 flex items-center justify-center transition-colors",
            isRead ? "bg-deep/10 border-deep/20" : "bg-transparent"
          )}>
            <Heart className={cn(
              "w-3 h-3 transition-colors",
              isRead ? "text-deep fill-deep" : "text-deep/40"
            )} />
          </div>
          {isRead && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-3 h-3 bg-romantic rounded-full border border-accent flex items-center justify-center"
            >
              <div className="w-1 h-1 bg-accent rounded-full" />
            </motion.div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {letter.audioUrl && (
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-deep/10 border border-deep/20">
              <Volume2 className="w-2.5 h-2.5 text-deep" />
              <span className="text-[8px] font-sans uppercase tracking-tighter text-deep">Voice</span>
            </div>
          )}
          <span className="text-[10px] font-sans uppercase tracking-widest text-deep/60">{letter.date}</span>
        </div>
      </div>
      
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h3 className="text-xl italic font-medium text-deep">{letter.title}</h3>
          {isRead && <span className="text-[8px] font-sans uppercase tracking-[0.2em] text-romantic font-bold">Read</span>}
        </div>
        <p className="text-xs text-deep/60 line-clamp-2 font-serif leading-relaxed italic">
          {letter.excerpt}
        </p>
      </div>
      
      <div className="absolute top-0 right-0 w-12 h-12 bg-deep/5 rotate-45 translate-x-6 -translate-y-6" />
      <div className="absolute bottom-0 left-0 w-8 h-8 flex items-center justify-center">
        <Sparkles className="w-3 h-3 text-deep/10" />
      </div>
    </motion.div>
  );
};

const LetterModal = ({ letter, onClose }: { letter: Letter, onClose: () => void }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Auto-play audio when modal opens (user interaction already happened by clicking envelope)
    if (letter.audioUrl && audioRef.current) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          setIsPlaying(true);
        }).catch(error => {
          console.log("Auto-play prevented:", error);
        });
      }
    }
  }, [letter.audioUrl]);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8 bg-paper/90 backdrop-blur-sm"
    >
      <motion.div
        layoutId={`envelope-${letter.id}`}
      className={cn(
          "relative w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 md:p-16 flex flex-col border border-white/10",
          "bg-romantic text-paper"
        )}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 md:top-6 md:right-6 p-2 hover:bg-white/10 rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5 text-white/60" />
        </button>
        
        <div className="mb-8 md:mb-12 text-center">
          <span className="text-xs font-sans uppercase tracking-[0.2em] text-white/40 mb-4 block">
            {letter.date}
          </span>
          <h2 className="text-3xl md:text-5xl italic mb-2 text-white">{letter.title}</h2>
          <div className="w-12 h-px bg-white/20 mx-auto mt-6 md:mt-8" />
        </div>

        {/* Voicemail Section */}
        {letter.audioUrl && (
          <div className="mb-8 md:mb-12 p-4 md:p-6 bg-white/[0.05] border border-white/10 rounded-2xl flex items-center gap-4 md:gap-6">
            <button 
              onClick={toggleAudio}
              className="w-12 h-12 rounded-full bg-accent text-romantic flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-accent/20"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
            </button>
            <div className="flex-1">
              <p className="text-[10px] font-sans uppercase tracking-widest text-white/40 mb-1">Voicemail Attachment</p>
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-white/20" />
                <div className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    animate={isPlaying ? { x: ['0%', '100%'] } : { x: '0%' }}
                    transition={isPlaying ? { duration: 30, repeat: Infinity, ease: "linear" } : {}}
                    className="h-full w-1/3 bg-accent/60 rounded-full"
                  />
                </div>
              </div>
            </div>
            <audio 
              ref={audioRef} 
              src={letter.audioUrl} 
              onEnded={() => setIsPlaying(false)}
              className="hidden" 
            />
          </div>
        )}
        
        <div className="max-w-none mb-12">
          {letter.content.split('\n\n').map((paragraph, i) => (
            <p key={`para-${letter.id}-${i}`} className="text-lg md:text-xl leading-relaxed italic mb-6 text-white/90">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Images Section */}
        {letter.images && letter.images.length > 0 && (
          <div className="mt-8 space-y-6">
            <div className="flex items-center gap-2 text-white/40 mb-4">
              <ImageIcon className="w-4 h-4" />
              <span className="text-[10px] font-sans uppercase tracking-widest">Captured Memories</span>
            </div>
            <div className={cn(
              "grid gap-4",
              letter.images.length === 1 ? "grid-cols-1" : "grid-cols-2"
            )}>
              {letter.images.map((img, idx) => (
                <motion.div 
                  key={`img-${letter.id}-${idx}`}
                  whileHover={{ scale: 1.02 }}
                  className="relative aspect-[4/3] overflow-hidden rounded-xl border border-white/10 shadow-sm"
                >
                  <img 
                    src={img} 
                    alt={`Memory ${idx + 1}`} 
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-12 pt-12 border-t border-white/10 flex justify-center">
          <Heart className="w-6 h-6 text-white/20" />
        </div>
      </motion.div>
    </motion.div>
  );
};

const Navbar = ({ 
  onLock, 
  searchQuery, 
  onSearchChange,
  occasions,
  themes,
  keywords,
  activeFilter,
  onFilterChange,
  isMuted,
  onToggleMute
}: { 
  onLock: () => void, 
  searchQuery: string, 
  onSearchChange: (query: string) => void,
  occasions: string[],
  themes: string[],
  keywords: string[],
  activeFilter: { type: string, value: string },
  onFilterChange: (type: string, value: string) => void,
  isMuted: boolean,
  onToggleMute: () => void
}) => {
  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1, duration: 0.8 }}
      className="fixed top-0 left-0 right-0 z-40 px-4 md:px-8 py-4 md:py-6 flex justify-between items-center bg-paper/80 backdrop-blur-md border-b border-ink/5"
    >
      <div className="flex items-center gap-2">
        <Heart className="w-4 h-4 text-romantic" />
        <span className="font-display italic text-lg tracking-tight">Letters to Amore</span>
      </div>

      <div className="flex-1 max-w-md mx-8 hidden sm:block">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink/20 group-focus-within:text-romantic transition-colors" />
          <input
            type="text"
            placeholder="Search the archives..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search letters"
            className="w-full bg-ink/5 border border-transparent focus:border-romantic/20 focus:bg-white/50 rounded-full py-2 pl-10 pr-4 text-[10px] font-sans uppercase tracking-widest outline-none transition-all placeholder:text-ink/20"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={onToggleMute}
          className="p-2 rounded-full hover:bg-ink/5 transition-colors text-ink/40 hover:text-romantic"
          aria-label={isMuted ? "Unmute background music" : "Mute background music"}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        <div className="hidden lg:flex gap-3 items-center">
          {/* Theme Filter */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="relative group"
          >
            <select 
              value={activeFilter.type === 'theme' ? activeFilter.value : 'All'}
              onChange={(e) => onFilterChange('theme', e.target.value)}
              aria-label="Filter by theme"
              className="appearance-none bg-ink/5 border border-ink/10 rounded-full px-4 py-1.5 pr-8 text-[9px] font-sans uppercase tracking-widest outline-none focus:border-romantic/30 transition-all cursor-pointer hover:bg-ink/10 text-ink/60"
            >
              <option value="All">Themes</option>
              {themes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 text-ink/20 pointer-events-none" />
          </motion.div>

          {/* Occasion Filter */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="relative group"
          >
            <select 
              value={activeFilter.type === 'occasion' ? activeFilter.value : 'All'}
              onChange={(e) => onFilterChange('occasion', e.target.value)}
              aria-label="Filter by occasion"
              className="appearance-none bg-ink/5 border border-ink/10 rounded-full px-4 py-1.5 pr-8 text-[9px] font-sans uppercase tracking-widest outline-none focus:border-romantic/30 transition-all cursor-pointer hover:bg-ink/10 text-ink/60"
            >
              <option value="All">Occasions</option>
              {occasions.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 text-ink/20 pointer-events-none" />
          </motion.div>

          {/* Keyword Filter */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="relative group"
          >
            <select 
              value={activeFilter.type === 'keyword' ? activeFilter.value : 'All'}
              onChange={(e) => onFilterChange('keyword', e.target.value)}
              aria-label="Filter by keyword"
              className="appearance-none bg-ink/5 border border-ink/10 rounded-full px-4 py-1.5 pr-8 text-[9px] font-sans uppercase tracking-widest outline-none focus:border-romantic/30 transition-all cursor-pointer hover:bg-ink/10 text-ink/60"
            >
              <option value="All">Keywords</option>
              {keywords.map(k => <option key={k} value={k}>{k}</option>)}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 text-ink/20 pointer-events-none" />
          </motion.div>
        </div>

        <motion.button 
          whileHover={{ scale: 1.05, backgroundColor: 'rgba(240, 67, 67, 0.05)' }}
          whileTap={{ scale: 0.95 }}
          onClick={onLock}
          aria-label="Lock archive"
          className="group flex items-center gap-2 px-3 py-1.5 rounded-full border border-ink/10 hover:border-romantic/30 transition-all text-[10px] font-sans uppercase tracking-widest text-ink/40 hover:text-romantic"
          title="Lock Archive"
        >
          <Lock className="w-3 h-3 transition-transform group-hover:scale-110" />
          <span className="hidden sm:inline">Lock</span>
        </motion.button>
      </div>
    </motion.nav>
  );
};

const Carousel = ({ 
  letters, 
  readLetterIds, 
  onOpenLetter 
}: { 
  letters: Letter[], 
  readLetterIds: Set<string>, 
  onOpenLetter: (letter: Letter) => void 
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Reset active index when letters change (e.g. filtering)
  useEffect(() => {
    setActiveIndex(0);
  }, [letters.length]);

  const handleNext = () => {
    setActiveIndex((prev) => Math.min(prev + 1, letters.length - 1));
  };

  const handlePrev = () => {
    setActiveIndex((prev) => Math.max(prev - 1, 0));
  };

  if (letters.length === 0) {
    return (
      <div className="h-[400px] flex items-center justify-center italic text-ink/40">
        No letters found matching this filter.
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 group perspective-1000 py-20 overflow-hidden">
      {/* Navigation Buttons */}
      <motion.button 
        onClick={handlePrev}
        disabled={activeIndex === 0}
        whileHover={{ scale: 1.1, backgroundColor: 'rgba(253, 245, 230, 0.4)' }}
        whileTap={{ scale: 0.9 }}
        className={cn(
          "absolute left-4 md:left-10 top-1/2 -translate-y-1/2 z-50 p-4 rounded-full bg-paper/20 backdrop-blur-xl border border-white/10 text-white transition-all disabled:opacity-0 disabled:pointer-events-none",
          "opacity-0 group-hover:opacity-100"
        )}
        aria-label="Previous"
      >
        <ChevronLeft className="w-8 h-8" />
      </motion.button>
      <motion.button 
        onClick={handleNext}
        disabled={activeIndex === letters.length - 1}
        whileHover={{ scale: 1.1, backgroundColor: 'rgba(253, 245, 230, 0.4)' }}
        whileTap={{ scale: 0.9 }}
        className={cn(
          "absolute right-4 md:right-10 top-1/2 -translate-y-1/2 z-50 p-4 rounded-full bg-paper/20 backdrop-blur-xl border border-white/10 text-white transition-all disabled:opacity-0 disabled:pointer-events-none",
          "opacity-0 group-hover:opacity-100"
        )}
        aria-label="Next"
      >
        <ChevronRight className="w-8 h-8" />
      </motion.button>

      <div 
        ref={containerRef}
        className="relative h-[450px] flex items-center justify-center preserve-3d"
      >
        <AnimatePresence mode="popLayout">
          {letters.map((letter, index) => {
            const offset = index - activeIndex;
            const absOffset = Math.abs(offset);
            
            // Only show items within a certain range to keep it clean but showing "more than 3"
            if (absOffset > 4) return null;

            return (
              <motion.div
                key={letter.id}
                initial={{ opacity: 0, scale: 0.5, x: offset * 300 }}
                animate={{ 
                  opacity: 1 - absOffset * 0.2,
                  scale: 1 - absOffset * 0.15,
                  x: offset * (window.innerWidth < 768 ? 180 : 280),
                  zIndex: 100 - absOffset,
                  rotateY: offset * -25,
                  translateZ: absOffset * -100,
                }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ 
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                  mass: 1
                }}
                onClick={() => {
                  if (index === activeIndex) {
                    onOpenLetter(letter);
                  } else {
                    setActiveIndex(index);
                  }
                }}
                className="absolute cursor-pointer preserve-3d"
              >
                <div className={cn(
                  "transition-all duration-500",
                  index !== activeIndex && "pointer-events-none md:pointer-events-auto"
                )}>
                  <Envelope 
                    letter={letter} 
                    isRead={readLetterIds.has(letter.id)}
                    onClick={() => {}} // Handled by parent div
                  />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Progress Indicator */}
      <div className="flex justify-center gap-1.5 mt-8">
        {letters.map((_, idx) => (
          <motion.button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            whileHover={{ scale: 1.2, backgroundColor: 'rgba(240, 67, 67, 0.4)' }}
            className={cn(
              "h-1 transition-all duration-300 rounded-full",
              idx === activeIndex ? "w-8 bg-romantic" : "w-2 bg-ink/10"
            )}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

const ArchiveDesk = ({ 
  letters, 
  readLetterIds, 
  onOpenLetter
}: { 
  letters: Letter[], 
  readLetterIds: Set<string>, 
  onOpenLetter: (letter: Letter) => void
}) => {
  return (
    <div className="max-w-7xl mx-auto mt-4 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative bg-linear-to-br from-romantic/80 to-romantic/60 border border-romantic/10 rounded-[40px] p-4 md:p-16 min-h-[700px] flex flex-col justify-center shadow-2xl shadow-romantic/20 overflow-hidden backdrop-blur-sm"
      >
        {/* Subtle Sparkles for the Desk */}
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full animate-pulse" />
          <div className="absolute top-1/2 left-3/4 w-1 h-1 bg-white rounded-full animate-pulse delay-700" />
          <div className="absolute top-3/4 left-1/3 w-1 h-1 bg-white rounded-full animate-pulse delay-1000" />
          <div className="absolute top-1/3 left-2/3 w-1 h-1 bg-white rounded-full animate-pulse delay-300" />
        </div>

        <div className="relative z-10 w-full h-full flex items-center justify-center">
          <Carousel 
            letters={letters}
            readLetterIds={readLetterIds}
            onOpenLetter={onOpenLetter}
          />
        </div>
      </motion.div>

      <div className="mt-8 text-center">
        <p className="text-black font-sans text-[9px] uppercase tracking-[0.4em]">
          Hover for sparkle. Click to open. Emotional safety not guaranteed.
        </p>
      </div>
    </div>
  );
};

export default function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);
  const [readLetterIds, setReadLetterIds] = useState<Set<string>>(new Set());
  const [activeFilter, setActiveFilter] = useState({ type: 'occasion', value: 'All' });
  const [searchQuery, setSearchQuery] = useState('');
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
      if (!isMuted && isUnlocked) {
        audioRef.current.play().catch(() => {
          console.log("Autoplay blocked. Waiting for interaction.");
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isMuted, isUnlocked]);

  const occasions = Array.from(new Set(LETTERS.map(l => l.occasion)));
  const themes = Array.from(new Set(LETTERS.map(l => l.theme)));
  const keywords = Array.from(new Set(LETTERS.flatMap(l => l.keywords)));

  const filteredLetters = LETTERS.filter(letter => {
    // Search filter
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = searchQuery === '' || 
      letter.title.toLowerCase().includes(searchLower) || 
      letter.excerpt.toLowerCase().includes(searchLower) || 
      letter.content.toLowerCase().includes(searchLower);

    if (!matchesSearch) return false;

    // Category filter
    if (activeFilter.value === 'All') return true;
    if (activeFilter.type === 'occasion') return letter.occasion === activeFilter.value;
    if (activeFilter.type === 'theme') return letter.theme === activeFilter.value;
    if (activeFilter.type === 'keyword') return letter.keywords.includes(activeFilter.value);
    return true;
  });

  const handleOpenLetter = (letter: Letter) => {
    setSelectedLetter(letter);
    setReadLetterIds(prev => new Set(prev).add(letter.id));
  };

  const handleFilterChange = (type: string, value: string) => {
    setActiveFilter({ type, value });
  };

  return (
    <div className="min-h-screen bg-paper selection:bg-romantic/10 selection:text-romantic" onClick={() => {
      if (isMuted && isUnlocked) {
        // Optional: Auto-unmute on first click if unlocked
        // setIsMuted(false);
      }
    }}>
      <audio 
        ref={audioRef}
        src="https://cdn.pixabay.com/audio/2022/05/27/audio_1808f30302.mp3" 
        loop 
      />
      <FallingHearts />
      <AnimatePresence>
        {!isUnlocked && (
          <PassphraseGate onUnlock={() => setIsUnlocked(true)} />
        )}
      </AnimatePresence>

      {isUnlocked && (
        <Navbar 
          onLock={() => setIsUnlocked(false)} 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          occasions={occasions}
          themes={themes}
          keywords={keywords}
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
          isMuted={isMuted}
          onToggleMute={() => setIsMuted(!isMuted)}
        />
      )}

      <main className={cn(
        "transition-all duration-1000 p-4 md:p-8 pt-24 md:pt-32",
        !isUnlocked && "blur-xl scale-95 opacity-0"
      )}>
        {isUnlocked && (
          <ArchiveDesk 
            letters={filteredLetters}
            readLetterIds={readLetterIds}
            onOpenLetter={handleOpenLetter}
          />
        )}

        <footer className="max-w-6xl mx-auto mt-24 pb-12 text-center">
          <p className="text-ink/10 font-sans text-[8px] uppercase tracking-[0.5em]">
            &copy; {new Date().getFullYear()} The Amore Archives &bull; Forever Yours
          </p>
        </footer>
      </main>

      <AnimatePresence>
        {selectedLetter && (
          <LetterModal 
            letter={selectedLetter} 
            onClose={() => setSelectedLetter(null)} 
          />
        )}
      </AnimatePresence>

      {/* Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-romantic/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[120px]" />
      </div>
    </div>
  );
}
