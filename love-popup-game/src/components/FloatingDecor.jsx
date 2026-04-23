import { motion } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";

export default function FloatingDecor() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute -left-20 top-8 h-72 w-72 rounded-full bg-rose-300/16 blur-3xl"
        animate={{ x: [0, 30, -12, 0], y: [0, 18, -8, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-0 top-1/4 h-80 w-80 rounded-full bg-fuchsia-300/16 blur-3xl"
        animate={{ x: [0, -24, 0], y: [0, -18, 10, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-cyan-200/10 blur-3xl"
        animate={{ scale: [1, 1.08, 0.96, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-white/14"
          style={{ left: `${8 + i * 9}%`, top: `${10 + (i % 5) * 16}%` }}
          animate={{ y: [0, -10, 0], opacity: [0.15, 0.4, 0.15], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut" }}
        >
          {i % 2 === 0 ? <Heart size={15} fill="currentColor" /> : <Sparkles size={15} />}
        </motion.div>
      ))}
    </div>
  );
}