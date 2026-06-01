import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { breakingNews } from '../data/newsData';

export default function BreakingNewsBanner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % breakingNews.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-[#c40000] text-white py-2.5 px-4">
      <div className="max-w-7xl mx-auto flex items-center gap-3">
        <div className="flex items-center gap-2 shrink-0">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <AlertCircle size={16} className="text-white" />
          </motion.div>
          <span className="font-black text-xs uppercase tracking-widest bg-white text-[#c40000] px-2 py-0.5 rounded">
            BREAKING
          </span>
        </div>
        <div className="flex-1 overflow-hidden h-6 flex items-center">
          <AnimatePresence mode="wait">
            <motion.span
              key={current}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="text-xs sm:text-sm font-medium"
            >
              {breakingNews[current]}
            </motion.span>
          </AnimatePresence>
        </div>
        <div className="flex gap-1 shrink-0">
          {breakingNews.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${i === current ? 'bg-white w-4' : 'bg-white/40'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
