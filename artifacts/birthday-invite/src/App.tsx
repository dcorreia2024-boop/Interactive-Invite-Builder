import { useEffect, useMemo, useRef, useState, useCallback } from "react";

const BASE = import.meta.env.BASE_URL;

function img(name: string) {
  return `${BASE}${name}`;
}

const API_URL = "/api/rsvps";

const GCAL_URL =
  "https://calendar.google.com/calendar/render?action=TEMPLATE" +
  "&text=Anivers%C3%A1rio%20%F0%9F%8E%82" +
  "&dates=20260509T190000%2F20260509T220000" +
  "&location=R.%20Vanderli%20Rosa%20Gomes%2C%20125%20-%20Shopping%20Park";

function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return { ref, visible };
}

function TypewriterText({
  text,
  active,
  className,
  style,
}: {
  text: string;
  active: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    if (!active || !text) return;
    setDisplayed("");
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(timer);
    }, 40);
    return () => clearInterval(timer);
  }, [active, text]);
  if (!active && !displayed) return null;
  return (
    <p className={className} style={style}>
      {displayed}
    </p>
  );
}

const DECOR_ITEMS = [
  { content: "✦", left: "2%",  top: "5%",   size: 14, color: "#FFB3C6" },
  { content: "●", left: "6%",  top: "18%",  size: 8,  color: "#FFD6A5" },
  { content: "✦", left: "3%",  top: "33%",  size: 16, color: "#C7B8EA" },
  { content: "●", left: "5%",  top: "50%",  size: 10, color: "#FFB3C6" },
  { content: "✦", left: "2%",  top: "67%",  size: 12, color: "#FFD6A5" },
  { content: "●", left: "7%",  top: "82%",  size: 8,  color: "#C7B8EA" },
  { content: "✦", left: "4%",  top: "93%",  size: 14, color: "#FFB3C6" },
  { content: "✦", left: "91%", top: "8%",   size: 16, color: "#FFD6A5" },
  { content: "●", left: "94%", top: "22%",  size: 10, color: "#FFB3C6" },
  { content: "✦", left: "92%", top: "40%",  size: 12, color: "#C7B8EA" },
  { content: "●", left: "95%", top: "58%",  size: 8,  color: "#FFD6A5" },
  { content: "✦", left: "90%", top: "74%",  size: 14, color: "#FFB3C6" },
  { content: "●", left: "93%", top: "90%",  size: 10, color: "#C7B8EA" },
  { content: "✦", left: "20%", top: "1%",   size: 10, color: "#FFD6A5" },
  { content: "●", left: "50%", top: "0.8%", size: 8,  color: "#FFB3C6" },
  { content: "✦", left: "76%", top: "2%",   size: 12, color: "#C7B8EA" },
  { content: "●", left: "30%", top: "98%",  size: 8,  color: "#FFD6A5" },
  { content: "✦", left: "65%", top: "97%",  size: 12, color: "#FFB3C6" },
];

function DecorativeElements() {
  return (
    <>
      {DECOR_ITEMS.map((el, i) => (
        <span
          key={i}
          style={{
            position: "fixed",
            left: el.left,
            top: el.top,
            fontSize: el.size,
            color: el.color,
            opacity: 0.3,
            pointerEvents: "none",
            zIndex: 0,
            userSelect: "none",
          }}
        >
          {el.content}
        </span>
      ))}
    </>
  );
}

const CONFETTI_COLORS = ["#FFB3C6", "#FFD6A5", "#B5EAD7", "#C7B8EA"];

function PermanentConfetti() {
  const particles = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        left: Math.round((i / 14) * 98 + Math.random() * 6),
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        duration: +(7 + Math.random() * 5).toFixed(2),
        delay: +(-Math.random() * 12).toFixed(2),
      })),
    []
  );

  return (
    <>
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: "fixed",
            left: `${p.left}%`,
            top: "-10px",
            width: 6,
            height: 10,
            borderRadius: 2,
            backgroundColor: p.color,
            opacity: 0.45,
            pointerEvents: "none",
            zIndex: 0,
            willChange: "transform",
            animationName: "permanentConfettiFall",
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
          }}
        />
      ))}
    </>
  );
}

interface SceneProps {
  imgSrc: string;
  text: string;
  textTop?: string;
  textBottom?: string;
  shake?: boolean;
}

function Scene({ imgSrc, text, textTop, textBottom, shake }: SceneProps) {
  const { ref, visible } = useInView();
  const [animClass, setAnimClass] = useState("");

  useEffect(() => {
    if (!visible) return;
    setAnimClass("swing-in");
    let t1: ReturnType<typeof setTimeout>;
    let t2: ReturnType<typeof setTimeout>;
    if (shake) {
      t1 = setTimeout(() => setAnimClass("shake"), 650);
      t2 = setTimeout(() => setAnimClass("breathe"), 1400);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    } else {
      t1 = setTimeout(() => setAnimClass("breathe"), 650);
      return () => clearTimeout(t1);
    }
  }, [visible, shake]);

  return (
    <div
      ref={ref}
      className="scene"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: "opacity 0.6s ease, transform 0.6s ease",
      }}
    >
      {textTop && (
        <TypewriterText text={textTop} active={visible} className="scene-text" />
      )}

      <div className={`img-wrapper ${animClass}`}>
        <img
          src={imgSrc}
          alt=""
          style={{
            maxWidth: 320,
            width: "100%",
            display: "block",
            margin: "0 auto",
          }}
        />
      </div>

      {text && (
        <TypewriterText text={text} active={visible} className="scene-text" />
      )}
      {textBottom && (
        <TypewriterText
          text={textBottom}
          active={visible}
          className="scene-text"
          style={{ fontSize: "2.8rem" }}
        />
      )}
    </div>
  );
}

function launchConfetti() {
  const emojis = ["🎉", "🎂", "🎈"];
  for (let i = 0; i < 40; i++) {
    const span = document.createElement("span");
    span.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    span.style.cssText = `
      position: fixed;
      left: ${Math.random() * 100}vw;
      top: -40px;
      font-size: ${1.5 + Math.random()}rem;
      pointer-events: none;
      z-index: 9999;
      animation: confettiFall ${2 + Math.random()}s linear forwards;
    `;
    document.body.appendChild(span);
    setTimeout(() => span.remove(), 3000);
  }
}

type Answer = "sim" | "nao" | null;

function ResponseSection({ answer, onReset }: { answer: Answer; onReset: () => void }) {
  const [showReaction, setShowReaction]     = useState(false);
  const [showCard, setShowCard]             = useState(false);
  const [showFinal, setShowFinal]           = useState(false);
  const [showCalendar, setShowCalendar]     = useState(false);
  const [showClose, setShowClose]           = useState(false);
  const [naoTexts, setNaoTexts]             = useState<string[]>([]);
  const [animClass, setAnimClass]           = useState("");

  const naoLines = [
    "Não vem né...",
    "Bom que sobra mais pra mim",
    "Mas o presente tu pode mandar ainda",
    "Tu sabe né?",
  ];

  useEffect(() => {
    if (answer === "sim") launchConfetti();

    setAnimClass("swing-in");
    setTimeout(() => setAnimClass("breathe"), 650);

    if (answer === "sim") {
      const delay = 600;
      setTimeout(() => setShowReaction(true),  delay);
      setTimeout(() => setShowCard(true),       delay * 2);
      setTimeout(() => setShowFinal(true),      delay * 3);
      setTimeout(() => setShowCalendar(true),   delay * 4);
      setTimeout(() => setShowClose(true),      delay * 5);
      // 6. Segundo burst de confetti
      setTimeout(() => launchConfetti(),        2500);
    } else {
      const delay = 700;
      naoLines.forEach((_, i) => {
        setTimeout(() => {
          setNaoTexts((prev) => [...prev, naoLines[i]]);
        }, delay * (i + 1));
      });
      setTimeout(() => setShowClose(true), delay * (naoLines.length + 1));
    }
  }, [answer]);

  const naoTextStyles: Record<number, React.CSSProperties> = {
    0: { fontSize: "2rem" },
    1: { fontSize: "1.5rem" },
    2: { fontSize: "1.3rem" },
    3: { fontSize: "1.2rem" },
  };

  return (
    <div className="scene" style={{ opacity: 1, transform: "none", minHeight: "auto", paddingBottom: 60 }}>
      <div className={`img-wrapper ${animClass}`}>
        <div className="img-circle" />
        <img
          src={img(answer === "sim" ? "resposta_sim.png" : "resposta_nao.png")}
          alt=""
          style={{
            maxWidth: 300,
            width: "100%",
            display: "block",
            margin: "0 auto",
            position: "relative",
            zIndex: 1,
          }}
        />
      </div>

      {/* ── SIM flow ── */}
      {answer === "sim" && (
        <>
          {showReaction && (
            <p className="scene-text fade-in-text" style={{ fontSize: "2rem" }}>
              SABIA QUE VOCÊ NÃO RESISTIA
            </p>
          )}

          {/* 3. Card de evento */}
          {showCard && (
            <div className="event-card fade-in-text">
              <div className="event-card-row">
                <span className="event-card-icon">📅</span>
                <span>Te espero dia 09/05/2026!</span>
              </div>
              <div className="event-card-row">
                <span className="event-card-icon">🕖</span>
                <span>Horário: 19h</span>
              </div>
              <div className="event-card-row">
                <span className="event-card-icon">📍</span>
                <span>R. Vanderli Rosa Gomes, 125 - Shopping Park</span>
              </div>
            </div>
          )}

          {showFinal && (
            <p className="scene-text fade-in-text" style={{ fontSize: "1.1rem" }}>
              Chega na hora tá?
            </p>
          )}

          {/* 4. Botão Google Calendar */}
          {showCalendar && (
            <a
              href={GCAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline fade-in-text"
              style={{ marginTop: 20, textDecoration: "none", display: "inline-block" }}
            >
              📅 Salvar na agenda
            </a>
          )}
        </>
      )}

      {/* ── NÃO flow ── */}
      {answer === "nao" &&
        naoTexts.map((t, i) => (
          <p
            key={i}
            className="scene-text fade-in-text"
            style={naoTextStyles[i] || { fontSize: "1.2rem" }}
          >
            {t}
          </p>
        ))}

      {showClose && (
        <button
          className="btn btn-outline fade-in-text"
          style={{ marginTop: 32 }}
          onClick={() => {
            onReset();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          Fechar 👋
        </button>
      )}
    </div>
  );
}

function RSVPSection({ onSubmit }: { onSubmit: (answer: Answer) => void }) {
  const { ref, visible } = useInView();
  const [name, setName]       = useState("");
  const [error, setError]     = useState("");
  const [step, setStep]       = useState<"name" | "answer">("name");
  const [shaking, setShaking] = useState(false);
  const [naoDisabled, setNaoDisabled] = useState(false);

  function handleConfirmName() {
    if (!name.trim()) {
      setError("Ei, esqueceu seu nome!");
      return;
    }
    setError("");
    setStep("answer");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleConfirmName();
  }

  async function handleClick(answer: "sim" | "nao") {
    try {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), answer }),
      });
    } catch {}
    onSubmit(answer);
  }

  // 5. Botão NÃO dramático — shake antes de confirmar
  function handleNaoClick() {
    setNaoDisabled(true);
    setShaking(true);
    setTimeout(() => {
      setShaking(false);
      setNaoDisabled(false);
      handleClick("nao");
    }, 800);
  }

  return (
    <div
      ref={ref}
      id="rsvp"
      style={{
        minHeight: "85vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        scrollSnapAlign: "center",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: "opacity 0.6s ease, transform 0.6s ease",
      }}
    >
      {step === "name" ? (
        <>
          <input
            type="text"
            placeholder="Seu nome..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{
              border: "2px solid #1a1a1a",
              borderRadius: 12,
              padding: "14px 20px",
              fontSize: "1.2rem",
              fontFamily: "'Chango', cursive",
              width: "100%",
              maxWidth: 360,
              marginBottom: 8,
              outline: "none",
              boxSizing: "border-box",
            }}
          />
          {error && (
            <p
              style={{
                color: "red",
                fontFamily: "'Chango', cursive",
                fontSize: "1rem",
                marginBottom: 12,
                textAlign: "center",
              }}
            >
              {error}
            </p>
          )}
          <button
            className="btn btn-primary"
            style={{ marginTop: 12 }}
            onClick={handleConfirmName}
          >
            Confirmar
          </button>
        </>
      ) : (
        // Wrap the answer step to apply shake
        <div
          className={shaking ? "shake" : ""}
          style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
        >
          <p
            style={{
              fontFamily: "'Chango', cursive",
              fontSize: "1.6rem",
              textAlign: "center",
              marginBottom: 32,
            }}
          >
            Você vai comparecer, {name.trim()}?
          </p>
          <div style={{ display: "flex", gap: 16 }}>
            <button className="btn btn-primary" onClick={() => handleClick("sim")}>
              SIM 🎉
            </button>
            <button
              className="btn btn-outline"
              onClick={handleNaoClick}
              disabled={naoDisabled}
            >
              Não 😢
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ScrollHint() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 80) setVisible(false);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 28,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        opacity: visible ? 1 : 0,
        transition: "opacity 0.5s ease",
        pointerEvents: "none",
        zIndex: 50,
      }}
    >
      <span
        style={{
          fontFamily: "'Chango', cursive",
          fontSize: "0.75rem",
          color: "#aaa",
          letterSpacing: "0.05em",
        }}
      >
        role para baixo
      </span>
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#bbb"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="scroll-arrow"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </div>
  );
}

export default function App() {
  const [submitted, setSubmitted] = useState(false);
  const [answer, setAnswer] = useState<Answer>(null);

  function handleSubmit(ans: Answer) {
    setAnswer(ans);
    setSubmitted(true);
    // Desativa scroll-snap temporariamente para o scrollIntoView funcionar
    document.documentElement.style.scrollSnapType = "none";
    setTimeout(() => {
      document.getElementById("response-section")?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => {
        document.documentElement.style.scrollSnapType = "";
      }, 800);
    }, 100);
  }

  function handleReset() {
    setSubmitted(false);
    setAnswer(null);
  }

  return (
    <>
      <DecorativeElements />
      <PermanentConfetti />
      <ScrollHint />
      <div
        style={{
          background: "transparent",
          maxWidth: 600,
          margin: "0 auto",
          fontFamily: "'Chango', cursive",
          position: "relative",
          zIndex: 1,
          boxShadow: "0 0 60px rgba(255,100,150,0.08)",
        }}
      >
        <Scene imgSrc={img("eai_pobre.png")} text="E aí, pobre" />
        <Scene
          imgSrc={img("ta_chegando.png")}
          text="Tá chegando o melhor dia do ano pra você..."
        />
        <Scene
          imgSrc={img("presentear.png")}
          text="O dia de me presentear. Bom né?"
        />
        <Scene
          imgSrc={img("comida_detalhe.png")}
          text="Vai ter comida também... mas isso é detalhe."
        />
        <Scene imgSrc={img("sem_presente.png")} text="Sem presente, sem comida" />
        <Scene imgSrc={img("brincadeira.png")} text="Brincadeira" shake />
        <Scene
          imgSrc={img("me_confirma.png")}
          text=""
          textTop="Você vem na minha festa?"
          textBottom="09/05/2026"
        />

        {!submitted ? (
          <RSVPSection onSubmit={handleSubmit} />
        ) : (
          <div id="response-section">
            <ResponseSection answer={answer} onReset={handleReset} />
          </div>
        )}
      </div>
    </>
  );
}
