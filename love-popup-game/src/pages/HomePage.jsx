import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, RotateCcw, Sparkles, Stars } from "lucide-react";
import ChoiceButton from "../components/ChoiceButton";
import FloatingDecor from "../components/FloatingDecor";
import { breathingSteps, scenes } from "../data/scenes";

export default function HomePage() {
  const [current, setCurrent] = useState("breathing");
  const [history, setHistory] = useState(["breathing"]);
  const [breathingIndex, setBreathingIndex] = useState(0);
  const [breathingDone, setBreathingDone] = useState(false);
  const [playfulMoved, setPlayfulMoved] = useState(false);

  const scene = scenes[current];
  const currentBreathing =
    breathingSteps[Math.min(breathingIndex, breathingSteps.length - 1)];

  const progress = useMemo(() => {
    const map = {
      breathing: 4,
      intro: 10,
      playful: 16,
      journey: 28,
      fear: 42,
      reassure: 58,
      clarity: 74,
      question: 90,
      yes: 100,
      slow: 100,
      time: 100,
    };
    return map[current] ?? 0;
  }, [current]);

  useEffect(() => {
    if (current !== "breathing") return;
    if (breathingDone) return;

    const timer = setTimeout(() => {
      if (breathingIndex < breathingSteps.length - 1) {
        setBreathingIndex((prev) => prev + 1);
      } else {
        setBreathingDone(true);
      }
    }, currentBreathing.duration * 1000);

    return () => clearTimeout(timer);
  }, [current, breathingIndex, breathingDone, currentBreathing.duration]);

  const handleChoice = (choice) => {
    if (choice.playful && !playfulMoved) {
      setPlayfulMoved(true);
      return;
    }

    setCurrent(choice.next);

    if (choice.restart || choice.next === "breathing") {
      setHistory(["breathing"]);
      setBreathingIndex(0);
      setBreathingDone(false);
      setPlayfulMoved(false);
      return;
    }

    setHistory((prev) => [...prev, choice.next]);
  };

  const handleBack = () => {
    if (history.length <= 1) return;

    const copy = [...history];
    copy.pop();
    const previous = copy[copy.length - 1];

    setHistory(copy);
    setCurrent(previous);

    if (previous !== "playful") {
      setPlayfulMoved(false);
    }
  };

  const handleRestart = () => {
    setCurrent("breathing");
    setHistory(["breathing"]);
    setBreathingIndex(0);
    setBreathingDone(false);
    setPlayfulMoved(false);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050816] text-white">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at top, rgba(244,114,182,0.22), transparent 28%), radial-gradient(circle at 80% 20%, rgba(216,180,254,0.16), transparent 28%), radial-gradient(circle at 20% 90%, rgba(103,232,249,0.12), transparent 24%), linear-gradient(135deg, #050816 0%, #0b1020 35%, #140d22 100%)",
        }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:72px_72px] opacity-[0.06]" />

      <FloatingDecor />

      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-8 md:px-8">
        <div className="grid w-full items-center gap-6 lg:grid-cols-[1.06fr_0.94fr]">
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75 }}
            className="hidden rounded-[36px] border border-white/10 bg-white/[0.045] p-8 shadow-[0_30px_120px_rgba(0,0,0,0.25)] backdrop-blur-2xl lg:block"
          >
            <div className="flex items-center gap-3 text-white/80">
              <div className="rounded-full border border-white/15 bg-white/10 p-2.5 shadow-[0_0_40px_rgba(255,255,255,0.06)]">
                <Stars className="h-5 w-5" />
              </div>
              <span className="text-sm uppercase tracking-[0.3em] text-white/55">
                Paw's Game
              </span>
            </div>

            <div className="mt-9 max-w-xl">
              <h1 className="text-5xl font-semibold leading-[1.03] tracking-tight text-white xl:text-[3.8rem]">
                Bukan game biasa.
                <br />
                Gakerasa ya kita sudah lumayan lama kenal dekat,
                <span className="bg-gradient-to-r from-rose-100 via-fuchsia-200 to-cyan-100 bg-clip-text text-transparent">
                  {" "}“aku mau kita punya arah.”
                </span>
              </h1>
              <p className="mt-6 max-w-lg text-base leading-8 text-white/68 xl:text-[1.04rem]">
                 Ini bukan sesuatu yang harus kamu jawab cepat.
                Cuma ruang kecil... buat kita jujur,
                tanpa takut dinilai, tanpa harus sempurna.
              </p>
            </div>
          </motion.div>

          <div className="relative flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.965, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative w-full max-w-xl overflow-hidden rounded-[34px] border border-white/15 bg-white/[0.075] shadow-[0_40px_120px_rgba(0,0,0,0.35)] backdrop-blur-2xl"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_38%)] opacity-60" />

              <div className="relative border-b border-white/10 px-5 py-4 md:px-7 md:py-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full border border-white/15 bg-white/10 p-2 shadow-[0_0_30px_rgba(255,255,255,0.08)]">
                      <Heart className="h-4 w-4" fill="currentColor" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.32em] text-white/45">
                        Create By DF
                      </p>
                      <p className="mt-1 text-sm text-white/72">
                        for someone special
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleRestart}
                    className="rounded-full border border-white/10 bg-white/5 p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
                    aria-label="Restart"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between text-[11px] uppercase tracking-[0.22em] text-white/45">
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-rose-200 via-fuchsia-200 to-cyan-100 shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                      animate={{ width: `${progress}%` }}
                      transition={{ type: "spring", stiffness: 84, damping: 18 }}
                    />
                  </div>
                </div>
              </div>

              <div className="relative min-h-[560px] px-5 py-6 md:px-7 md:py-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={scene.id}
                    initial={{ opacity: 0, y: 14, filter: "blur(10px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -10, filter: "blur(10px)" }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="flex min-h-[490px] flex-col"
                  >
                    <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.28em] text-white/55">
                      <Sparkles className="h-3.5 w-3.5" />
                      {scene.eyebrow}
                    </div>

                    {scene.id === "breathing" && (
                      <div className="mt-8 flex flex-col items-center justify-center pb-2">
                        <motion.div
                          animate={{
                            scale: breathingDone ? 1 : currentBreathing.scale,
                            boxShadow: breathingDone
                              ? "0 0 100px rgba(255,255,255,0.12)"
                              : "0 0 80px rgba(255,255,255,0.08)",
                            opacity: breathingDone ? 1 : [0.78, 1, 0.88],
                          }}
                          transition={{
                            duration: breathingDone ? 0.8 : currentBreathing.duration,
                            ease: "easeInOut",
                          }}
                          className="relative flex h-48 w-48 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-xl md:h-56 md:w-56"
                        >
                          <div className="absolute inset-3 rounded-full border border-white/10" />
                          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.18),transparent_65%)]" />
                          <div className="relative text-center">
                            <p className="text-[11px] uppercase tracking-[0.28em] text-white/45">
                              breathing
                            </p>
                            <p className="mt-3 text-3xl font-semibold text-white">
                              {breathingDone ? "Ready" : currentBreathing.label}
                            </p>
                            <p className="mt-2 text-sm text-white/60">
                              {breathingDone
                                ? "Sekarang kita mulai pelan-pelan."
                                : currentBreathing.hint}
                            </p>
                          </div>
                        </motion.div>
                      </div>
                    )}

                    <div className="mt-7 space-y-5">
                      <h2 className="max-w-lg text-3xl font-semibold leading-tight tracking-tight text-white md:text-[2.25rem]">
                        {scene.title}
                      </h2>
                      <p className="max-w-lg text-base leading-8 text-white/70 md:text-[1.03rem]">
                        {scene.body}
                      </p>
                    </div>

                    <div className="mt-auto space-y-3 pt-10">
                      {scene.choices.map((choice, index) => {
                        const isPlayfulGhost =
                          scene.id === "playful" && choice.playful;

                        return (
                          <motion.div
                            key={choice.label}
                            animate={
                              isPlayfulGhost && playfulMoved
                                ? {
                                    x: index === 1 ? 26 : 0,
                                    y: index === 1 ? -10 : 0,
                                    rotate: index === 1 ? -2 : 0,
                                  }
                                : { x: 0, y: 0, rotate: 0 }
                            }
                            transition={{
                              type: "spring",
                              stiffness: 240,
                              damping: 16,
                            }}
                          >
                            <ChoiceButton
                              label={
                                isPlayfulGhost && playfulMoved
                                  ? "Eh jangan yang ini 😝"
                                  : choice.label
                              }
                              tone={choice.tone}
                              onClick={() => handleChoice(choice)}
                            />
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="relative flex items-center justify-between border-t border-white/10 px-5 py-4 text-sm text-white/55 md:px-7">
                <button
                  onClick={handleBack}
                  disabled={history.length <= 1}
                  className="transition hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                >
                  Back
                </button>
                <span>
                  {scene.final
                    ? "one honest answer can change everything"
                    : "take your time reading this"}
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}