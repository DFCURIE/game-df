import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function ChoiceButton({ label, onClick, tone = "secondary" }) {
  const toneClass = {
    primary:
      "border-white/40 bg-white text-slate-900 shadow-[0_10px_30px_rgba(255,255,255,0.14)] hover:bg-white/92",
    secondary:
      "border-white/18 bg-white/10 text-white hover:bg-white/16 shadow-[0_10px_30px_rgba(0,0,0,0.12)]",
    ghost:
      "border-white/10 bg-black/10 text-white/80 hover:bg-black/20",
  };

  return (
    <motion.button
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={`group flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-left text-sm font-medium backdrop-blur-xl transition-all md:px-5 md:py-4 md:text-base ${toneClass[tone]}`}
    >
      <span>{label}</span>
      <ArrowRight className="h-4 w-4 opacity-60 transition-transform group-hover:translate-x-1" />
    </motion.button>
  );
}