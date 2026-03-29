import { useEffect, useRef, useState } from "react";

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

interface SceneProps {
  imgSrc: string;
  text: string;
  textTop?: string;
  textBottom?: string;
  shake?: boolean;
}

function Scene({ imgSrc, text, textTop, textBottom, shake }: SceneProps) {
  const { ref, visible } = useInView();
  const [doShake, setDoShake] = useState(false);

  useEffect(() => {
    if (visible && shake) {
      setDoShake(true);
      const t = setTimeout(() => setDoShake(false), 700);
      return () => clearTimeout(t);
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
      {textTop && <p className="scene-text">{textTop}</p>}
      <img
        src={imgSrc}
        alt=""
        className={doShake ? "shake" : ""}
        style={{
          maxWidth: 320,
          width: "100%",
          display: "block",
          margin: "0 auto",
        }}
      />
      {text && <p className="scene-text">{text}</p>}
      {textBottom && (
        <p className="scene-text" style={{ fontSize: "2.8rem", fontWeight: "bold" }}>
          {textBottom}
        </p>
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

function ResponseSection({ answer }: { answer: Answer }) {
  const [texts, setTexts] = useState<string[]>([]);
  const [showClose, setShowClose] = useState(false);

  const simTexts = [
    "SABIA QUE VOCÊ NÃO RESISTIA 🎉",
    "Te espero dia 09/05/2026!",
    "⏰ Horário: 16h",
    "📍 Endereço: [SEU ENDEREÇO]",
    "Chega na hora tá? 😂",
  ];

  const naoTexts = [
    "Não vem né...",
    "Bom que sobra mais pra mim 😏",
    "Mas o presente tu pode mandar ainda",
    "Tu sabe né? 🎁",
  ];

  const allTexts = answer === "sim" ? simTexts : naoTexts;
  const delay = answer === "sim" ? 600 : 700;

  useEffect(() => {
    if (answer === "sim") launchConfetti();

    const timers: ReturnType<typeof setTimeout>[] = [];
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
    0: { fontSize: "2rem", fontWeight: "bold" },
    1: { fontSize: "1.5rem" },
    2: { fontSize: "1.3rem" },
    3: { fontSize: "1.3rem" },
    4: { fontSize: "1.1rem" },
  };

  return (
    <div className="scene" style={{ opacity: 1, transform: "none" }}>
      <img
        src={img(answer === "sim" ? "resposta_sim.png" : "resposta_nao.png")}
        alt=""
        style={{ maxWidth: 300, width: "100%", display: "block", margin: "0 auto" }}
      />
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
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          Fechar 👋
        </button>
      )}
    </div>
  );
}

function RSVPSection({
  onSubmit,
}: {
  onSubmit: (answer: Answer) => void;
}) {
  const { ref, visible } = useInView();
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  async function handleClick(answer: "sim" | "nao") {
    if (!name.trim()) {
      setError("Ei, esqueceu seu nome! 😅");
      return;
    }
    setError("");

    const body = new URLSearchParams({
      "entry.1964878530": name.trim(),
      "entry.83163696": answer === "sim" ? "Sim, vou!" : "Não vou conseguir...",
    });

    try {
      await fetch(FORM_URL, {
        method: "POST",
        mode: "no-cors",
        body,
      });
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
      <input
        type="text"
        placeholder="Seu nome..."
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{
          border: "2px solid #1a1a1a",
          borderRadius: 12,
          padding: "14px 20px",
          fontSize: "1.2rem",
          fontFamily: "Boogaloo, sans-serif",
          width: "100%",
          maxWidth: 360,
          marginBottom: 8,
          outline: "none",
          boxSizing: "border-box",
        }}
      />
      {error && (
        <p style={{ color: "red", fontFamily: "Boogaloo, sans-serif", fontSize: "1rem", marginBottom: 12 }}>
          {error}
        </p>
      )}
      <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
        <button
          className="btn btn-primary"
          onClick={() => handleClick("sim")}
        >
          SIM 🎉
        </button>
        <button
          className="btn btn-outline"
          onClick={() => handleClick("nao")}
        >
          Não 😢
        </button>
      </div>
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

  return (
    <div
      style={{
        background: "#ffffff",
        maxWidth: 600,
        margin: "0 auto",
        fontFamily: "Boogaloo, sans-serif",
      }}
    >
      <Scene imgSrc={img("eai_pobre.png")} text="E aí, pobre 👀" />
      <Scene
        imgSrc={img("ta_chegando.png")}
        text="Tá chegando o melhor dia do ano pra você..."
      />
      <Scene
        imgSrc={img("presentear.png")}
        text="O dia de me presentear. Bom né? 🎁"
      />
      <Scene
        imgSrc={img("comida_detalhe.png")}
        text="Vai ter comida também... mas isso é detalhe."
      />
      <Scene
        imgSrc={img("sem_presente.png")}
        text="Sem presente, sem comida 😐"
      />
      <Scene
        imgSrc={img("brincadeira.png")}
        text="Brincadeira 😂😂😂"
        shake
      />
      <Scene
        imgSrc={img("me_confirma.png")}
        text=""
        textTop="Você vem na minha festa?"
        textBottom="09/05/2026 🎂"
      />

      {!submitted ? (
        <RSVPSection onSubmit={handleSubmit} />
      ) : (
        <div id="response-section">
          <ResponseSection answer={answer} />
        </div>
      )}
    </div>
  );
}
