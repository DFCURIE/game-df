import { motion } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";

export default function BackgroundDecor() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-white/15 blur-3xl"
        animate={{ x: [0, 18, -10, 0], y: [0, 20, -8, 0] }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-0 top-1/4 h-80 w-80 rounded-full bg-fuchsia-300/20 blur-3xl"
        animate={{ x: [0, -24, 0], y: [0, -18, 10, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-white/20"
          style={{ left: `${8 + i * 11}%`, top: `${12 + (i % 4) * 18}%` }}
          animate={{ y: [0, -14, 0], opacity: [0.15, 0.45, 0.15] }}
          transition={{ duration: 6 + i, repeat: Infinity, ease: "easeInOut" }}
        >
          {i % 2 === 0 ? <Heart size={16} fill="currentColor" /> : <Sparkles size={16} />}
        </motion.div>
      ))}
    </div>
  );
}