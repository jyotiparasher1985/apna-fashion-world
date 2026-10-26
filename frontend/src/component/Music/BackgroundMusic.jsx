import { useEffect, useRef, useState } from "react";

// Light mall-style background music (bright welcoming — Kevin MacLeod)
// Baaki options (swap karne ke liye):
//   Wholesome.mp3   — soft warm ukulele
//   Carefree.mp3    — breezy happy
//   Beach%20Bum.mp3 — sunny beach vibe
//   Smooth%20Lovin.mp3 — smooth lounge
const TRACK =
  "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Life%20of%20Riley.mp3";

function BackgroundMusic() {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const start = () => {
    const a = audioRef.current;
    if (!a || playing) return;
    a.play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false)); // browser block kare to chup rehna
  };

  useEffect(() => {
    // 1) Pehle khud autoplay try karo
    start();

    // 2) Browser autoplay block kare -> pehli user interaction par turant shuru
    const events = ["click", "keydown", "touchstart", "scroll"];
    const onFirst = () => {
      start();
      events.forEach((e) => window.removeEventListener(e, onFirst));
    };
    events.forEach((e) => window.addEventListener(e, onFirst, { passive: true }));

    return () => events.forEach((e) => window.removeEventListener(e, onFirst));
    // eslint-disable-next-line
  }, []);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      a.play()
        .then(() => setPlaying(true))
        .catch(() => {});
    }
  };

  return (
    <>
      <audio ref={audioRef} src={TRACK} loop preload="auto" style={{ display: "none" }} />
      {/* Music on/off button (floating) */}
      <button
        onClick={toggle}
        title={playing ? "Music band karo" : "Music chalu karo"}
        style={{
          position: "fixed",
          bottom: "20px",
          left: "20px",
          zIndex: 9999,
          width: "46px",
          height: "46px",
          borderRadius: "50%",
          border: "none",
          cursor: "pointer",
          fontSize: "20px",
          background: playing ? "#004c8f" : "#888",
          color: "#fff",
          boxShadow: "0 4px 12px rgba(0,0,0,.25)",
        }}
      >
        {playing ? "🔊" : "🔇"}
      </button>
    </>
  );
}

export default BackgroundMusic;
