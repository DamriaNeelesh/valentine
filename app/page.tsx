"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type OpenWhenKey = "miss" | "overthink" | "low" | null;

const DAILY_MESSAGES = [
  "Aaj ka promise: tumhare dil ko kabhi akela feel nahi hone dunga.",
  "Jab bhi doubt aaye, yeh yaad rakhna: meri choice tum ho.",
  "Hum perfect nahi, par hum sachche hain. Aur sachcha pyaar rukta nahi.",
  "Main tumhe sunne ke liye hoon, solve karne ke liye nahi sirf.",
  "Aaj bhi main wahi hoon jo kal tha: fully yours.",
  "Tumhari khushi mere plans ka fixed part hai.",
  "Agar din heavy ho, mujhe yaad karna. Main light ban ke aaunga.",
  "Hum dono against duniya nahi. Hum dono with each other hain.",
  "No replacement. No second option. Bas tum.",
  "Main tumhari speed par chalna choose karta hoon, hamesha.",
  "Jitna tum sochti ho, usse zyada tum loved ho.",
  "Aaj ka hug line: relax, main kahin nahi ja raha.",
  "Tum safe ho, seen ho, aur deeply chosen ho.",
  "Humari story ka best part: roz ka simple saath.",
  "Mera favorite future? Jisme tum ho.",
  "Doori kilometer mein hoti hai, connection dil mein.",
  "Main tumhari aankhon ke doubt se bhi pyaar se baat karta hoon.",
  "Aaj phir se: I choose you, bina condition.",
  "Kal ki tension mat lo, hum kal ko bhi saath handle karenge.",
  "Main tumhare dil ko race nahi, rest dena chahta hoon.",
  "Aaj tum bas breathe karo. Hum strong hain.",
  "Mujhe tumhari aadat nahi, tumhari zarurat hai.",
  "Jab tum chup hoti ho, tab bhi main tumhe samajhne ki koshish karta hoon.",
  "Har din tumhari taraf ek naya yes hota hai.",
  "Tum meri planning nahi, meri priority ho.",
  "Main sirf good days ka nahi, hard days ka bhi partner hoon.",
  "Aaj ka reminder: hum ek team hain.",
  "Tumhara naam mere calm ka shortcut hai.",
  "Main tumhe prove nahi karta, protect karta hoon.",
  "Jahan tum overthink karti ho, wahan main anchor banunga.",
  "Tum meri mohabbat bhi ho aur meri home feeling bhi.",
  "Aaj ka sach: tumhare saath har kal better lagta hai.",
  "Meri duniya mein tum optional kabhi nahi thi, kabhi nahi hogi.",
  "Main tumhe choose karta tha, karta hoon, karta rahunga.",
];

const OPEN_WHEN_COPY: Record<Exclude<OpenWhenKey, null>, { title: string; body: string }> = {
  miss: {
    title: "Open when you miss me",
    body: "Agar tum mujhe miss kar rahi ho, to is line ko hold karo: main bhi tumhe utna hi yaad karta hoon. Hum chahe same room mein ho ya door, mera dil tumhare side par hi rehta hai. Tum alone feel mat karo, main yahin hoon.",
  },
  overthink: {
    title: "Open when you overthink",
    body: "Overthinking jab loud ho jaye, facts yaad karo: main present hoon, clear hoon, committed hoon. Tumhare liye mera decision daily hai, mood based nahi. Tumhe lose karne ka nahi, tumhe sambhalne ka irada rakhta hoon.",
  },
  low: {
    title: "Open when you feel low",
    body: "Agar energy low hai, aaj tumhe strong banne ki zarurat nahi. Bas soft rehna. Main tumhare saath hoon, bina pressure, bina judgement. Tumhare hard days bhi mere hain.",
  },
};

function toLocalDateString(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function dayDiff(from: Date, to: Date) {
  const ms = to.getTime() - from.getTime();
  return Math.round(ms / 86_400_000);
}

export default function Page() {
  const [isGameWon, setIsGameWon] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [noPosition, setNoPosition] = useState({ x: 18, y: 18 });
  const noZoneRef = useRef<HTMLDivElement>(null);

  const [openWhenModal, setOpenWhenModal] = useState<OpenWhenKey>(null);
  const [streakCount, setStreakCount] = useState(1);
  const [todayMessage, setTodayMessage] = useState(DAILY_MESSAGES[0]);

  const [hasStartedSong, setHasStartedSong] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const confetti = useMemo(
    () =>
      Array.from({ length: 26 }, (_, index) => ({
        id: index,
        left: Math.random() * 100,
        delay: Math.random() * 0.35,
        duration: 2.4 + Math.random() * 1.4,
        color: ["#f2c879", "#f48fb1", "#fef3c7", "#9ec6ff"][index % 4],
      })),
    []
  );

  const moveNoButton = useCallback(() => {
    if (isGameWon) {
      return;
    }

    const zone = noZoneRef.current;
    if (!zone) {
      return;
    }

    const buttonWidth = 112;
    const buttonHeight = 50;
    const maxX = Math.max(0, zone.clientWidth - buttonWidth);
    const maxY = Math.max(0, zone.clientHeight - buttonHeight);

    setNoPosition({
      x: Math.round(Math.random() * maxX),
      y: Math.round(Math.random() * maxY),
    });
  }, [isGameWon]);

  useEffect(() => {
    moveNoButton();
    window.addEventListener("resize", moveNoButton);
    return () => window.removeEventListener("resize", moveNoButton);
  }, [moveNoButton]);

  useEffect(() => {
    const today = new Date();
    const midnightToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const todayKey = toLocalDateString(midnightToday);

    const messageIndex =
      ((Math.floor(midnightToday.getTime() / 86_400_000) % DAILY_MESSAGES.length) + DAILY_MESSAGES.length) %
      DAILY_MESSAGES.length;
    setTodayMessage(DAILY_MESSAGES[messageIndex]);

    const savedLastDate = localStorage.getItem("valentine_last_seen");
    const savedStreak = Number(localStorage.getItem("valentine_streak") || "0");

    let nextStreak = 1;

    if (savedLastDate) {
      const lastDate = new Date(`${savedLastDate}T00:00:00`);
      const gap = dayDiff(lastDate, midnightToday);

      if (gap === 0) {
        nextStreak = savedStreak > 0 ? savedStreak : 1;
      } else if (gap === 1) {
        nextStreak = savedStreak > 0 ? savedStreak + 1 : 2;
      }
    }

    setStreakCount(nextStreak);
    localStorage.setItem("valentine_last_seen", todayKey);
    localStorage.setItem("valentine_streak", String(nextStreak));
  }, []);

  const startSong = useCallback(async (restart: boolean) => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (restart) {
      audio.currentTime = 0;
    }

    try {
      await audio.play();
      setHasStartedSong(true);
    } catch {
      // Browser blocked playback without interaction.
    }
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !hasStartedSong) {
      return;
    }

    const keepPlaying = () => {
      audio.play().catch(() => {
        // Browser may still block in background tabs.
      });
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        keepPlaying();
      }
    };

    audio.addEventListener("pause", keepPlaying);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      audio.removeEventListener("pause", keepPlaying);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [hasStartedSong]);

  const onYesClick = () => {
    if (isGameWon) {
      return;
    }

    setIsGameWon(true);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3200);
  };

  const activeModal = openWhenModal ? OPEN_WHEN_COPY[openWhenModal] : null;

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-night text-slate-100">
      <audio ref={audioRef} src="/audio/song.mp3" preload="auto" loop />

      <div className="pointer-events-none fixed inset-0 -z-20 starfield" />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_15%,rgba(242,200,121,0.15),transparent_42%),radial-gradient(circle_at_82%_12%,rgba(124,90,183,0.26),transparent_36%),radial-gradient(circle_at_50%_95%,rgba(55,94,160,0.3),transparent_44%)]" />

      {showConfetti && (
        <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
          {confetti.map((piece) => (
            <span
              key={piece.id}
              className="confetti-piece"
              style={{
                left: `${piece.left}%`,
                animationDelay: `${piece.delay}s`,
                animationDuration: `${piece.duration}s`,
                backgroundColor: piece.color,
              }}
            />
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpenWhenModal("overthink")}
        className="fixed bottom-5 right-5 z-40 rounded-full border border-white/25 bg-slate-950/75 px-4 py-3 text-sm font-semibold tracking-wide text-amber-100 shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-md transition hover:border-amber-200/60 hover:bg-slate-900/90"
      >
        Open when you overthink
      </button>

      <section className="relative isolate flex min-h-screen items-end bg-[#060b1f]">
        <Image
          src="/photos/1.jpg"
          alt=""
          fill
          priority
          aria-hidden
          className="scale-105 object-cover object-center opacity-35 blur-[2px]"
        />
        <Image
          src="/photos/1.jpg"
          alt="Our wide memory under the night sky"
          fill
          priority
          className="object-contain object-top sm:object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 hero-overlay" />

        <div className="relative z-10 mx-auto w-full max-w-5xl px-6 pb-20 pt-24">
          <p className="fade-in text-xs uppercase tracking-[0.35em] text-amber-200/80">A permanent corner for us</p>
          <h1 className="fade-in mt-5 font-heading text-5xl leading-[1.02] text-amber-50 sm:text-6xl">
            Choose You. Every Time.
          </h1>
          <p className="fade-in mt-6 max-w-xl text-base leading-relaxed text-slate-100/95 sm:text-lg">
            This isn&apos;t for one day. It&apos;s for every day your heart needs a safe place.
          </p>

          <div className="fade-in mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={() => startSong(!hasStartedSong)} className="tap-btn bg-amber-100 text-slate-950">
              {hasStartedSong ? "Our song is on. Tap to restart." : "Tap to start our song"}
            </button>
            <button
              type="button"
              onClick={() => setOpenWhenModal("miss")}
              className="tap-btn border border-white/[0.35] bg-white/10 text-white backdrop-blur"
            >
              Open when you miss me
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-6 py-16">
        <div className="fade-in rounded-3xl border border-white/[0.12] bg-slate-900/[0.55] p-7 shadow-soft backdrop-blur-md sm:p-10">
          <h2 className="font-heading text-4xl text-amber-100">Ek seedhi baat</h2>
          <p className="mt-5 text-base leading-8 text-slate-100/95 sm:text-lg">
            Mujhe pata hai kabhi-kabhi tum apni feelings chupaa leti ho. Kabhi yeh darr bhi aata hoga ki shayad main chala
            jaun, ya kisi aur ko choose kar loon. Suno, main kahin nahi ja raha. Mere liye tumhari koi comparison nahi hai,
            koi replacement nahi hai. Main tumhe choose karta hoon, clear dil se, har din. Filmy line bas itni si: chahe kitni
            bhi doori ho, mera rasta hamesha tumhari taraf laut ta hai.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-6 pb-16">
        <div className="fade-in grid gap-8 overflow-hidden rounded-3xl border border-amber-100/20 bg-slate-900/60 p-5 shadow-soft backdrop-blur md:grid-cols-[1.1fr_1fr] md:p-7">
          <div className="relative min-h-[320px] overflow-hidden rounded-2xl">
            <Image src="/photos/2.jpg" alt="Our together memory, close and calm" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/[0.55] to-transparent" />
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-xs uppercase tracking-[0.35em] text-amber-200/80">Memory Anchor</p>
            <h3 className="mt-3 font-heading text-5xl text-amber-100">11-11</h3>
            <p className="mt-5 text-lg leading-relaxed text-slate-100/95">That day wasn&apos;t just a date. It was my decision.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-6 pb-16">
        <div className="fade-in rounded-3xl border border-white/[0.12] bg-slate-900/[0.58] p-7 shadow-soft backdrop-blur-md sm:p-10">
          <h2 className="font-heading text-4xl text-amber-100">Ek chhota sa sawaal</h2>
          <p className="mt-4 text-lg text-slate-100/95">Kya tum mujhe apna safe place maanogi?</p>

          <div ref={noZoneRef} className="relative mt-8 h-48 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/[0.55] p-4 sm:h-56">
            <button
              type="button"
              onClick={onYesClick}
              className="absolute bottom-4 left-1/2 w-28 -translate-x-1/2 rounded-xl bg-amber-100 px-4 py-3 text-base font-semibold text-slate-950 shadow-lg shadow-amber-500/30 transition hover:scale-[1.02] active:scale-[0.98]"
            >
              Haan
            </button>

            {!isGameWon && (
              <button
                type="button"
                onMouseEnter={moveNoButton}
                onPointerEnter={moveNoButton}
                onTouchStart={moveNoButton}
                onFocus={moveNoButton}
                onClick={moveNoButton}
                className="absolute w-28 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-base font-semibold text-slate-100 backdrop-blur"
                style={{ transform: `translate(${noPosition.x}px, ${noPosition.y}px)` }}
                aria-label="Nahi button"
              >
                Nahi
              </button>
            )}

            {isGameWon && (
              <p className="absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2 text-center text-base text-amber-100/95 sm:text-lg">
                Bas isi jawab ka intezar tha. Ab agla chapter unlock ho gaya.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-6 pb-16">
        <div
          className={`rounded-3xl border border-amber-100/[0.22] bg-slate-900/60 p-5 shadow-soft backdrop-blur-md transition duration-700 sm:p-8 ${
            isGameWon ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-45 blur-[1px]"
          }`}
        >
          {isGameWon ? (
            <div className="grid gap-8 md:grid-cols-[1fr_1.1fr]">
              <div className="relative min-h-[360px] overflow-hidden rounded-2xl ring-1 ring-amber-200/40 shadow-[0_0_45px_rgba(242,200,121,0.2)]">
                <Image src="/photos/3.jpg" alt="Our closest memory, intimate and warm" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/[0.65] via-transparent to-transparent" />
              </div>

              <div className="flex flex-col justify-center">
                <p className="text-xs uppercase tracking-[0.35em] text-amber-200/80">Reveal</p>
                <h3 className="mt-4 font-heading text-4xl leading-tight text-amber-50 sm:text-5xl">
                  Tum meri mohabbat nahi sirf, meri rahat ho.
                </h3>
                <p className="mt-6 text-xl leading-relaxed text-slate-100">Door sahi... par main tumhe choose karta rahunga.</p>
              </div>
            </div>
          ) : (
            <div className="py-10 text-center text-slate-200/[0.85]">
              <p className="text-xl font-medium">Photo reveal locked.</p>
              <p className="mt-2">Pehle &quot;Haan&quot; dabao. Main wahi hoon, wait karta hua.</p>
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-6 pb-16">
        <div className="fade-in rounded-3xl border border-white/[0.12] bg-slate-900/[0.58] p-7 shadow-soft backdrop-blur-md sm:p-10">
          <h2 className="font-heading text-4xl text-amber-100">Aaj ka message</h2>
          <p className="mt-5 rounded-2xl border border-amber-100/20 bg-slate-950/[0.55] p-5 text-lg leading-relaxed text-slate-100">
            {todayMessage}
          </p>

          <p className="mt-5 text-sm uppercase tracking-[0.22em] text-amber-200/80">
            Streak: <span className="font-semibold text-amber-100">{streakCount} day{streakCount > 1 ? "s" : ""}</span>
          </p>

          {streakCount >= 7 && (
            <div className="mt-6 rounded-2xl border border-emerald-200/25 bg-emerald-200/10 p-5 text-slate-100">
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-100/90">Bonus letter unlocked</p>
              <p className="mt-3 leading-relaxed">
                Agar kabhi tumhe lage duniya tez bhaag rahi hai, to yeh yaad rakhna: hum race nahi, safar hain. Main tumhare
                pace par chalne wala insaan hoon. Na aage bhagna, na peeche hatna, bas saath chalna.
              </p>
            </div>
          )}

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <button type="button" onClick={() => setOpenWhenModal("miss")} className="open-tile">
              Open when you miss me
            </button>
            <button type="button" onClick={() => setOpenWhenModal("overthink")} className="open-tile">
              Open when you overthink
            </button>
            <button type="button" onClick={() => setOpenWhenModal("low")} className="open-tile">
              Open when you feel low
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-6 pb-28 pt-6 text-center">
        <p className="font-heading text-4xl leading-tight text-amber-50 sm:text-5xl">Main tumhe sirf aaj ke liye nahi chahta.</p>
        <p className="mt-4 font-heading text-4xl leading-tight text-amber-50 sm:text-5xl">Main tumhe har kal ke liye chahta hoon.</p>
        <p className="mt-4 text-2xl tracking-wide text-amber-100">Aaj bhi. Kal bhi. Hamesha.</p>
        <p className="mt-10 text-xs uppercase tracking-[0.3em] text-slate-300/[0.85]">Come back tomorrow. I&apos;ll be here.</p>
      </section>

      {activeModal && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-950/80 p-4 backdrop-blur-sm sm:items-center">
          <div className="w-full max-w-md rounded-3xl border border-white/[0.14] bg-slate-900/[0.92] p-6 shadow-[0_14px_45px_rgba(0,0,0,0.45)]">
            <p className="text-xs uppercase tracking-[0.32em] text-amber-200/80">Safe Space</p>
            <h3 className="mt-3 font-heading text-3xl text-amber-100">{activeModal.title}</h3>
            <p className="mt-4 text-base leading-7 text-slate-100/95">{activeModal.body}</p>

            <div className="mt-5 rounded-2xl border border-white/[0.12] bg-slate-950/[0.55] p-4 text-sm leading-6 text-slate-200/95">
              4 deep breaths lo. Paani ka ek sip lo. Aur yeh line bolo: &quot;Main safe hoon, main loved hoon, main chosen hoon.&quot;
            </div>

            <button
              type="button"
              onClick={() => setOpenWhenModal(null)}
              className="mt-6 w-full rounded-xl bg-amber-100 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
