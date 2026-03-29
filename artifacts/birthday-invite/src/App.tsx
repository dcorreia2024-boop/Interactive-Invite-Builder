import { useEffect, useMemo, useRef, useState, useCallback } from "react";

const BASE = import.meta.env.BASE_URL;

function img(name: string) {
  return `${BASE}${name}`;
}

const FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSfmf-U9xVFhQXKJNNHFl8WzJcPSazfr5ELVyx6j0D_amjWPcQ/formResponse";

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
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        left: Math.round(Math.random() * 98),
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        duration: +(6 + Math.random() * 6).toFixed(2),
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
            opacity: 0.5,
            pointerEvents: "none",
            zIndex: 0,
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
  const [texts, setTexts] = useState<string[]>([]);
  const [showClose, setShowClose] = useState(false);
  const [animClass, setAnimClass] = useState("");

  const simTexts = [
    "SABIA QUE VOCÊ NÃO RESISTIA",
    "Te espero dia 09/05/2026!",
    "Horário: 19h",
    "Endereço: R. Vanderli Rosa Gomes, 125 - Shopping Park",
    "Chega na hora tá?",
  ];

  const naoTexts = [
    "Não vem né...",
    "Bom que sobra mais pra mim",
    "Mas o presente tu pode mandar ainda",
    "Tu sabe né?",
  ];

  const allTexts = answer === "sim" ? simTexts : naoTexts;
  const delay = answer === "sim" ? 600 : 700;

  useEffect(() => {
    if (answer === "sim") launchConfetti();
    setAnimClass("swing-in");
    const tb = setTimeout(() => setAnimClass("breathe"), 650);

    const timers: ReturnType<typeof setTimeout>[] = [tb];
    allTexts.forEach((_, i) => {
      timers.push(
        setTimeout(() => {
          setTexts((prev) => [...prev, allTexts[i]]);
        }, delay * (i + 1))
      );
    });
    timers.push(
      setTimeout(() => setShowClose(true), delay * (allTexts.length + 1))
    );
    return () => timers.forEach(clearTimeout);
  }, [answer]);

  const textStyles: Record<number, React.CSSProperties> = {
    0: { fontSize: "2rem" },
    1: { fontSize: "1.5rem" },
    2: { fontSize: "1.3rem" },
    3: { fontSize: "1.3rem" },
    4: { fontSize: "1.1rem" },
  };

  return (
    <div className="scene" style={{ opacity: 1, transform: "none" }}>
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
      {texts.map((t, i) => (
        <p
          key={i}
          className="scene-text fade-in-text"
          style={textStyles[i] || { fontSize: "1.2rem" }}
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
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState<"name" | "answer">("name");

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
    const body = new URLSearchParams({
      "entry.1964878530": name.trim(),
      "entry.83163696": answer === "sim" ? "Sim, vou!" : "Não vou conseguir...",
    });
    try {
      await fetch(FORM_URL, { method: "POST", mode: "no-cors", body });
    } catch {}
    onSubmit(answer);
  }

  return (
    <div
      ref={ref}
      id="rsvp"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
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
        <>
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
            <button className="btn btn-outline" onClick={() => handleClick("nao")}>
              Não 😢
            </button>
          </div>
        </>
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
    setTimeout(() => {
      document.getElementById("response-section")?.scrollIntoView({ behavior: "smooth" });
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
          background: "#ffffff",
          maxWidth: 600,
          margin: "0 auto",
          fontFamily: "'Chango', cursive",
          position: "relative",
          zIndex: 1,
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
