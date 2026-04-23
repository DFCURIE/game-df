export const breathingSteps = [
  { label: "Inhale", duration: 4, scale: 1.18, hint: "Tarik napas perlahan" },
  { label: "Hold", duration: 2, scale: 1.18, hint: "Tahan sebentar" },
  { label: "Exhale", duration: 4, scale: 0.92, hint: "Lepas pelan-pelan" },
];

export const scenes = {
  breathing: {
    id: "breathing",
    eyebrow: "slow down",
    title: "Paw’s Game dimulai dari sini...",
    body: "Tarik napas pelan ya. Kamu nggak perlu jadi siap, cukup jadi tenang dulu aja.",
    choices: [{ label: "Aku siap", next: "intro", tone: "primary" }],
  },
  intro: {
    id: "intro",
    eyebrow: "for you",
    title: "Aku lagi mikirin kita... tapi dengan cara yang ringan",
    body: "Bukan buat bikin kamu mikir keras. Aku cuma pengen ngobrol dengan cara yang lebih jujur, tapi tetap nyaman.",
    choices: [
      { label: "Tentang apa?", next: "playful" },
      { label: "Serius amat ", next: "playful" },
    ],
  },
  playful: {
    id: "playful",
    eyebrow: "tiny joke",
    title: "Sebelum serius... aku tes kamu dulu yaa",
    body: "Kadang yang kelihatan santai justru yang paling deg-degan ya. Kamu tipe yang langsung maju, atau pura-pura jual mahal dulu?",
    choices: [
      { label: "Lanjut dong", next: "journey", tone: "primary" },
      { label: "Nanti aja", next: "journey", tone: "ghost", playful: true },
    ],
  },
  journey: {
    id: "journey",
    eyebrow: "step 1",
    title: "Lucu ya... kita sampai di titik ini",
    body: "Tanpa sadar, kita udah saling ngerti banyak hal. Nggak sempurna, tapi cukup nyata buat dirasain.",
    choices: [
      { label: "Iya…", next: "fear" },
      { label: "Aku ngerasa itu", next: "fear" },
    ],
  },
  fear: {
    id: "fear",
    eyebrow: "step 2",
    title: "Dan aku tahu... kamu punya banyak rasa yang kamu simpan",
    body: "Kadang kamu ngerasa belum cukup, atau takut nggak bisa jadi yang kamu bayangin. Itu wajar banget, dan kamu nggak sendirian di situ.",
    choices: [
      { label: "Aku masih ngerasa takut", next: "reassure" },
      { label: "Aku paham…", next: "reassure" },
    ],
  },
  reassure: {
    id: "reassure",
    eyebrow: "step 3",
    title: "Tapi jujur ya...",
    body: "Kamu nggak perlu jadi versi terbaik dulu buat layak disayang. Versi kamu sekarang aja... udah cukup berarti.",
    choices: [
      { label: "Terus?", next: "clarity" },
      { label: "Aku dengerin", next: "clarity" },
    ],
  },
  clarity: {
    id: "clarity",
    eyebrow: "step 4",
   title: "Aku cuma nggak mau kita jadi ‘hampir’ terus",
    body: "Bukan soal buru-buru. Tapi tentang punya arah, supaya kita nggak terus jalan sambil nebak-nebak perasaan sendiri.",
    choices: [
      { label: "Maksud kamu?", next: "question" },
      { label: "Hmm…", next: "question" },
    ],
  },
  question: {
    id: "question",
    eyebrow: "the question",
    title: "Kalau kita jalan pelan-pelan, tapi sama-sama serius...",
    body: "Kamu mau nggak kita mulai kasih arti ke ini semua? Nggak harus sempurna, cukup kita sama-sama milih untuk tetap ada.",
    choices: [
      { label: "Aku mau!", next: "yes", tone: "primary" },
      { label: "Aku mau, tapi pelan ya", next: "slow", tone: "secondary" },
      { label: "Aku belum siap", next: "time", tone: "ghost" },
    ],
  },
  yes: {
    id: "yes",
    eyebrow: "our answer",
    title: "Kalau gitu... kita mulai dari sini yaa",
    body: "Nggak harus buru-buru, nggak harus sempurna. Tapi ada kamu, ada aku, dan kita jalan bareng.",
    choices: [{ label: "Lihat lagi dari awal", next: "breathing", restart: true }],
    final: true,
  },
  slow: {
    id: "slow",
    eyebrow: "our answer",
    title: "Pelan-pelan itu juga indah",
    body: "Aku nggak butuh cepat. Aku cuma butuh tahu kita sama-sama nggak pergi ke arah yang berbeda.",
    choices: [{ label: "Lihat lagi dari awal", next: "breathing", restart: true }],
    final: true,
  },
  time: {
    id: "time",
    eyebrow: "still us",
    title: "Makasih ya udah jujur",
    body: "Aku nggak akan maksa. Tapi kamu perlu tahu, kamu itu cukup... bahkan sebelum kamu ngerasa siap.",
    choices: [{ label: "Baca lagi dari awal", next: "breathing", restart: true }],
    final: true,
  },
};