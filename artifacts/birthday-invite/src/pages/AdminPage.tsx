import { useEffect, useState } from "react";

interface Rsvp {
  id: number;
  name: string;
  answer: string;
  createdAt: string;
}

interface Summary {
  total: number;
  sim: number;
  nao: number;
  rsvps: Rsvp[];
}

export default function AdminPage() {
  const [data, setData] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/rsvps")
      .then((r) => {
        if (!r.ok) throw new Error("Erro ao carregar");
        return r.json() as Promise<Summary>;
      })
      .then(setData)
      .catch(() => setError("Não foi possível carregar as confirmações."))
      .finally(() => setLoading(false));
  }, []);

  const refresh = () => {
    setLoading(true);
    setError("");
    fetch("/api/rsvps")
      .then((r) => r.json() as Promise<Summary>)
      .then(setData)
      .catch(() => setError("Erro ao atualizar."))
      .finally(() => setLoading(false));
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#fafafa",
        padding: "32px 16px",
        fontFamily: "'Chango', cursive",
      }}
    >
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 24,
          }}
        >
          <h1 style={{ fontSize: "1.8rem", margin: 0 }}>🎂 Confirmações</h1>
          <button
            onClick={refresh}
            style={{
              background: "#1a1a1a",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              padding: "10px 20px",
              fontFamily: "'Chango', cursive",
              fontSize: "0.9rem",
              cursor: "pointer",
            }}
          >
            Atualizar
          </button>
        </div>

        {loading && (
          <p style={{ textAlign: "center", color: "#888" }}>Carregando...</p>
        )}

        {error && (
          <p style={{ textAlign: "center", color: "red" }}>{error}</p>
        )}

        {data && !loading && (
          <>
            {/* Resumo */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 12,
                marginBottom: 28,
              }}
            >
              <Card label="Total" value={data.total} color="#1a1a1a" />
              <Card label="✅ Vão" value={data.sim} color="#22c55e" />
              <Card label="❌ Não vão" value={data.nao} color="#ef4444" />
            </div>

            {/* Lista */}
            {data.rsvps.length === 0 ? (
              <p style={{ textAlign: "center", color: "#aaa" }}>
                Nenhuma confirmação ainda.
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {data.rsvps.map((r) => (
                  <div
                    key={r.id}
                    style={{
                      background: "#fff",
                      border: "2px solid #eee",
                      borderRadius: 14,
                      padding: "14px 18px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <span style={{ fontSize: "1.1rem" }}>{r.name}</span>
                      <br />
                      <span style={{ fontSize: "0.75rem", color: "#999" }}>
                        {new Date(r.createdAt).toLocaleString("pt-BR")}
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: "1.3rem",
                        background: r.answer === "sim" ? "#dcfce7" : "#fee2e2",
                        color: r.answer === "sim" ? "#16a34a" : "#dc2626",
                        borderRadius: 8,
                        padding: "4px 12px",
                        fontFamily: "'Chango', cursive",
                        fontSize: "0.85rem",
                      }}
                    >
                      {r.answer === "sim" ? "Vai! 🎉" : "Não vai 😢"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function Card({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div
      style={{
        background: "#fff",
        border: `2px solid ${color}22`,
        borderRadius: 14,
        padding: "16px 12px",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: "2rem", color, fontFamily: "'Chango', cursive" }}>
        {value}
      </div>
      <div style={{ fontSize: "0.8rem", color: "#666", marginTop: 4 }}>
        {label}
      </div>
    </div>
  );
}
