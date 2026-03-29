import { useEffect, useMemo, useRef, useState } from "react";

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
  blobPath: string;
  blobColor: string;
}

function Scene({ imgSrc, text, textTop, textBottom, shake, blobPath, blobColor }: SceneProps) {
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
        <svg
          width="300"
          height="300"
          viewBox="-150 -150 300 300"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 0,
            opacity: 0.85,
            pointerEvents: "none",
          }}
        >
          <path d={blobPath} fill={blobColor} />
        </svg>
        <img
          src={imgSrc}
          alt=""
          style={{
            maxWidth: 320,
            width: "100%",
            display: "block",
            margin: "0 auto",
            position: "relative",
            zIndex: 1,
            mixBlendMode: "multiply",
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
    "Horário: 16h",
    "Endereço: [SEU ENDEREÇO]",
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
        <Scene
          imgSrc={img("eai_pobre.png")}
          text="E aí, pobre"
          blobPath="M60,-70C75,-50,80,-25,78,5C76,35,65,70,45,85C25,100,-5,95,-30,80C-55,65,-75,40,-78,12C-81,-16,-67,-47,-48,-68C-29,-89,0,-100,30,-95C60,-90,45,-90,60,-70Z"
          blobColor="#FFE8F0"
        />
        <Scene
          imgSrc={img("ta_chegando.png")}
          text="Tá chegando o melhor dia do ano pra você..."
          blobPath="M55,-75C70,-55,82,-30,78,0C74,30,62,65,38,82C14,99,-18,98,-44,82C-70,66,-88,35,-88,4C-88,-27,-70,-58,-48,-76C-26,-94,0,-102,28,-96C56,-90,40,-95,55,-75Z"
          blobColor="#FFF3E0"
        />
        <Scene
          imgSrc={img("presentear.png")}
          text="O dia de me presentear. Bom né?"
          blobPath="M70,-60C82,-38,85,-10,78,18C71,46,54,74,28,88C2,102,-32,102,-58,82C-84,62,-100,22,-96,-14C-92,-50,-78,-82,-52,-94C-26,-106,10,-98,40,-86C70,-74,58,-82,70,-60Z"
          blobColor="#E8F5E9"
        />
        <Scene
          imgSrc={img("comida_detalhe.png")}
          text="Vai ter comida também... mas isso é detalhe."
          blobPath="M50,-80C68,-62,85,-38,88,-10C91,18,80,50,58,72C36,94,4,106,-28,100C-60,94,-92,70,-104,38C-116,6,-108,-34,-88,-62C-68,-90,-36,-106,-4,-106C28,-106,32,-98,50,-80Z"
          blobColor="#EDE7F6"
        />
        <Scene
          imgSrc={img("sem_presente.png")}
          text="Sem presente, sem comida"
          blobPath="M62,-72C78,-52,88,-26,84,4C80,34,62,68,34,84C6,100,-30,98,-58,80C-86,62,-106,28,-106,-8C-106,-44,-86,-82,-58,-96C-30,-110,6,-100,36,-90C66,-80,46,-92,62,-72Z"
          blobColor="#E3F2FD"
        />
        <Scene
          imgSrc={img("brincadeira.png")}
          text="Brincadeira"
          shake
          blobPath="M44,-82C60,-66,78,-44,84,-18C90,8,84,38,68,62C52,86,26,104,-4,106C-34,108,-68,94,-88,68C-108,42,-114,4,-104,-30C-94,-64,-68,-94,-38,-104C-8,-114,28,-100,44,-82Z"
          blobColor="#FCE4EC"
        />
        <Scene
          imgSrc={img("me_confirma.png")}
          text=""
          textTop="Você vem na minha festa?"
          textBottom="09/05/2026"
          blobPath="M58,-68C74,-46,84,-20,80,8C76,36,58,66,32,84C6,102,-28,108,-56,94C-84,80,-106,46,-108,12C-110,-22,-92,-56,-68,-78C-44,-100,-14,-110,18,-106C50,-102,42,-90,58,-68Z"
          blobColor="#F3E5F5"
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
