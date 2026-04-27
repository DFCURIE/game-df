import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, RotateCcw, Sparkles, Stars } from "lucide-react";
import ChoiceButton from "../components/ChoiceButton";
import FloatingDecor from "../components/FloatingDecor";
import { breathingSteps, scenes } from "../data/scenes";
import { supabase } from "../lib/supabaseClient";

export default function HomePage() {
  const [current, setCurrent] = useState("breathing");
  const [history, setHistory] = useState(["breathing"]);
  const [breathingIndex, setBreathingIndex] = useState(0);
  const [breathingDone, setBreathingDone] = useState(false);
  const [playfulMoved, setPlayfulMoved] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [pulseGlow, setPulseGlow] = useState(false);
  const [showHearts, setShowHearts] = useState(false);
  const [resultMode, setResultMode] = useState(false);
  const [resultAnswer, setResultAnswer] = useState("");
  const [reflection, setReflection] = useState("");

  const audioContextRef = useRef(null);
  const ambientGainRef = useRef(null);
  const ambientOscillatorsRef = useRef([]);

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

  const resultContent = useMemo(() => {
    if (resultAnswer === "yes") {
      return {
        title: "Dia memilih: Aku mau ❤️",
        body: "Jawaban ini datang dari paw’s game. Ini bukan cuma jawaban, tapi awal dari obrolan yang lebih hangat dan lebih serius.",
      };
    }

    if (resultAnswer === "slow") {
      return {
        title: "Dia memilih: Aku mau, tapi pelan ya",
        body: "Ada ruang yang indah di sini. Bukan penolakan, tapi ajakan untuk berjalan dengan tenang dan tetap saling jaga.",
      };
    }

    if (resultAnswer === "time") {
      return {
        title: "Dia memilih: Aku belum siap",
        body: "Jawabannya jujur, dan itu tetap berarti. Ini bukan akhir dari rasa, tapi tanda bahwa semuanya butuh tempo yang baik.",
      };
    }

    return {
      title: "Belum ada jawaban",
      body: "Link ini belum membawa hasil jawaban.",
    };
  }, [resultAnswer]);

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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const answer = params.get("answer");
    const msg = params.get("msg");

    if (answer) {
      setResultMode(true);
      setResultAnswer(answer);
    }

    if (msg) {
      setReflection(msg);
    }
  }, []);

  const playTone = (type = "soft") => {
    if (!audioEnabled) return;

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;

      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }

      const ctx = audioContextRef.current;

      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === "success") {
        osc.frequency.setValueAtTime(520, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(
          760,
          ctx.currentTime + 0.18
        );
        osc.type = "sine";
      } else if (type === "playful") {
        osc.frequency.setValueAtTime(420, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(
          560,
          ctx.currentTime + 0.12
        );
        osc.type = "triangle";
      } else {
        osc.frequency.setValueAtTime(340, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(
          440,
          ctx.currentTime + 0.16
        );
        osc.type = "triangle";
      }

      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.03, ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.28);

      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (error) {
      console.error("Audio error:", error);
    }
  };

  const startAmbientMusic = async () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;

      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }

      const ctx = audioContextRef.current;

      if (ctx.state === "suspended") {
        await ctx.resume();
      }

      if (ambientOscillatorsRef.current.length > 0) return;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.0001, ctx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(
        0.018,
        ctx.currentTime + 2.5
      );
      masterGain.connect(ctx.destination);
      ambientGainRef.current = masterGain;

      const createLayer = (frequency, type, detune = 0) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(frequency, ctx.currentTime);
        osc.detune.setValueAtTime(detune, ctx.currentTime);

        gain.gain.setValueAtTime(0.0001, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 2);
        gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 6);

        osc.connect(gain);
        gain.connect(masterGain);
        osc.start();

        return { osc, gain };
      };

      const layer1 = createLayer(196, "sine", -4);
      const layer2 = createLayer(293.66, "triangle", 3);
      const layer3 = createLayer(392, "sine", -2);

      ambientOscillatorsRef.current = [layer1, layer2, layer3];
    } catch (error) {
      console.error("Failed to start ambient music:", error);
    }
  };

  const stopAmbientMusic = () => {
    try {
      const ctx = audioContextRef.current;
      const masterGain = ambientGainRef.current;

      if (ctx && masterGain) {
        masterGain.gain.cancelScheduledValues(ctx.currentTime);
        masterGain.gain.setValueAtTime(
          masterGain.gain.value || 0.01,
          ctx.currentTime
        );
        masterGain.gain.exponentialRampToValueAtTime(
          0.0001,
          ctx.currentTime + 1.2
        );
      }

      ambientOscillatorsRef.current.forEach(({ osc }) => {
        try {
          osc.stop((audioContextRef.current?.currentTime || 0) + 1.3);
        } catch {
          return;
        }
      });

      ambientOscillatorsRef.current = [];
      ambientGainRef.current = null;
    } catch (error) {
      console.error("Failed to stop ambient music:", error);
    }
  };

  useEffect(() => {
    if (audioEnabled) {
      startAmbientMusic();
    } else {
      stopAmbientMusic();
    }

    return () => {
      stopAmbientMusic();
    };
  }, [audioEnabled]);

  useEffect(() => {
    return () => {
      stopAmbientMusic();
    };
  }, []);

  const handleChoice = (choice) => {
    if (choice.playful && !playfulMoved) {
      playTone("playful");
      setPlayfulMoved(true);
      return;
    }

    if (choice.next === "yes") {
      playTone("success");
      setPulseGlow(true);
      setShowHearts(true);

      setTimeout(() => setPulseGlow(false), 800);
      setTimeout(() => setShowHearts(false), 2200);
    } else {
      playTone("soft");
    }

    setCurrent(choice.next);

    if (choice.restart || choice.next === "breathing") {
      setHistory(["breathing"]);
      setBreathingIndex(0);
      setBreathingDone(false);
      setPlayfulMoved(false);
      setPulseGlow(false);
      setShowHearts(false);
      setReflection("");
      return;
    }

    setHistory((prev) => [...prev, choice.next]);
  };

const handleShareWA = async () => {
  const answerMap = {
    yes: "yes",
    slow: "slow",
    time: "time",
  };

  const answer = answerMap[current] || "unknown";

  const baseUrl =
    window.location.hostname === "localhost"
      ? "https://game-df.vercel.app"
      : window.location.origin;

  const resultUrl = `${baseUrl}${window.location.pathname}?answer=${answer}&msg=${encodeURIComponent(
    reflection
  )}`;

  const { error } = await supabase.from("paw_responses").insert({
    answer,
    reflection,
    page_url: resultUrl,
    user_agent: navigator.userAgent,
  });

  if (error) {
    console.error("Failed to save response:", error);
  }

  const text = encodeURIComponent(
    `paw… aku jawab ini dari game kamu 🫶\n\nini jawaban aku:\n${resultUrl}`
  );

  window.open(`https://wa.me/?text=${text}`, "_blank");
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
    setPulseGlow(false);
    setShowHearts(false);
    setResultMode(false);
    setResultAnswer("");
    setReflection("");
    window.history.replaceState({}, "", window.location.pathname);
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
                paw’s game
              </span>
            </div>

            <div className="mt-9 max-w-xl">
              <h1 className="text-5xl font-semibold leading-[1.03] tracking-tight text-white xl:text-[3.8rem]">
                Paw’s Game.
                <br />
                Bukan cuma soal jawaban,
                <span className="bg-gradient-to-r from-rose-100 via-fuchsia-200 to-cyan-100 bg-clip-text text-transparent">
                  {" "}tapi tentang rasa yang dijawab jujur.
                </span>
              </h1>
              <p className="mt-6 max-w-lg text-base leading-8 text-white/68 xl:text-[1.04rem]">
                Sebelum mulai, tarik napas dulu ya. Pelan-pelan aja, yang
                penting jujur.
              </p>
            </div>
          </motion.div>

          <div className="relative flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.965, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className={`relative w-full max-w-xl overflow-hidden rounded-[34px] border border-white/15 bg-white/[0.075] shadow-[0_40px_120px_rgba(0,0,0,0.35)] backdrop-blur-2xl transition-all duration-700 ${
                pulseGlow
                  ? "ring-1 ring-white/30 shadow-[0_0_90px_rgba(255,255,255,0.16)]"
                  : ""
              }`}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_38%)] opacity-60" />

              {showHearts && (
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                  {[...Array(16)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{
                        opacity: 0,
                        y: 40,
                        x: 0,
                        scale: 0.6,
                        rotate: 0,
                      }}
                      animate={{
                        opacity: [0, 1, 1, 0],
                        y: -260 - i * 8,
                        x: (i % 2 === 0 ? -1 : 1) * (20 + (i % 5) * 14),
                        scale: [0.6, 1, 0.9],
                        rotate: i % 2 === 0 ? -18 : 18,
                      }}
                      transition={{
                        duration: 1.8 + (i % 4) * 0.18,
                        ease: "easeOut",
                        delay: i * 0.04,
                      }}
                      className="absolute bottom-10 left-1/2 text-white/80"
                    >
                      <Heart
                        className="h-4 w-4 md:h-5 md:w-5"
                        fill="currentColor"
                      />
                    </motion.div>
                  ))}
                </div>
              )}

              <motion.div
                className="absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),transparent_60%)]"
                animate={{ opacity: [0.35, 0.6, 0.35] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              />

              <div className="relative border-b border-white/10 px-5 py-4 md:px-7 md:py-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full border border-white/15 bg-white/10 p-2 shadow-[0_0_30px_rgba(255,255,255,0.08)]">
                      <Heart className="h-4 w-4" fill="currentColor" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.32em] text-white/45">
                        paw’s game
                      </p>
                      <p className="mt-1 text-sm text-white/72">
                        hi, aku seneng bisa kenal sama kamu
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setAudioEnabled((prev) => !prev)}
                      className={`rounded-full border px-3 py-2 text-[10px] uppercase tracking-[0.22em] transition md:text-xs ${
                        audioEnabled
                          ? "border-white/25 bg-white/15 text-white"
                          : "border-white/10 bg-white/5 text-white/55 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {audioEnabled ? "ambient on" : "ambient off"}
                    </button>

                    <button
                      onClick={handleRestart}
                      className="rounded-full border border-white/10 bg-white/5 p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
                      aria-label="Restart"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </button>
                  </div>
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
                {resultMode ? (
                  <div className="flex min-h-[490px] flex-col justify-center">
                    <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.28em] text-white/55">
                      <Sparkles className="h-3.5 w-3.5" />
                      paw’s answer
                    </div>

                    <div className="mt-7 space-y-5">
                      <h2 className="max-w-lg text-3xl font-semibold leading-tight tracking-tight text-white md:text-[2.25rem]">
                        {resultContent.title}
                      </h2>

                      <p className="max-w-lg text-base leading-8 text-white/70 md:text-[1.03rem]">
                        {resultContent.body}
                      </p>

                      {reflection && (
                        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-7 text-white/80">
                          <p className="mb-2 text-xs uppercase tracking-[0.22em] text-white/45">
                            Yang dia rasakan
                          </p>
                          {reflection}
                        </div>
                      )}

                      <div className="mt-8 text-sm leading-7 text-white/70">
                        Aku baca ini pelan-pelan…
                        <br />
                        <br />
                        Kita itu bukan soal aku dan kamu yang berdiri sendiri.
                        Tapi tentang bagaimana kita belajar jadi “kita”.
                        <br />
                        <br />
                        Apa yang kamu takutkan, apa yang masih kamu pikirkan,
                        kamu nggak harus hadapi sendirian.
                        <br />
                        <br />
                        Kalau memang kita sama-sama mau, hal-hal itu bukan jadi
                        penghalang, tapi jadi sesuatu yang kita perjuangkan
                        bareng-bareng.
                        <br />
                        <br />
                        Aku nggak butuh kamu sempurna. Aku cuma butuh kita tetap
                        saling jaga dan jalan pelan-pelan bareng.
                      </div>
                    </div>

                    <div className="mt-10">
                      <button
                        onClick={handleRestart}
                        className="rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/15"
                      >
                        Buka Paw’s Game
                      </button>
                    </div>
                  </div>
                ) : (
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
                              duration: breathingDone
                                ? 0.8
                                : currentBreathing.duration,
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
                                {breathingDone
                                  ? "Ready"
                                  : currentBreathing.label}
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
                              whileHover={{ scale: 1.005 }}
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

                        {scene.final && (
                          <>
                            <textarea
                              value={reflection}
                              onChange={(e) => setReflection(e.target.value)}
                              placeholder="Kalau boleh jujur... apa yang masih kamu takutkan atau kamu pikirkan tentang kita?"
                              className="mt-6 min-h-[120px] w-full resize-none rounded-xl border border-white/20 bg-white/10 p-4 text-sm leading-6 text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-white/30"
                            />

                            <button
                              onClick={handleShareWA}
                              className="mt-4 w-full rounded-xl bg-white py-3 text-sm font-medium text-black transition hover:bg-white/90"
                            >
                              Kirim ke aku 💌
                            </button>
                          </>
                        )}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>

              <div className="relative flex items-center justify-between border-t border-white/10 px-5 py-4 text-sm text-white/55 md:px-7">
                {resultMode ? (
                  <>
                    <span>shared result</span>
                    <span>opened from whatsapp link</span>
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}