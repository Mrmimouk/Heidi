import { useState } from "react";

const palette = {
  bg: "#F0EEF8",
  card: "#FFFFFF",
  primary: "#7C6BC9",
  primaryLight: "#A899E0",
  primaryDark: "#5A4BAA",
  accent: "#E8A0BF",
  accentGreen: "#7BBFA5",
  accentOrange: "#F4A261",
  text: "#2D2B3D",
  textMuted: "#7A7890",
  border: "#E2DFF5",
};

const SCREENS = {
  HOME: "home",
  GAME: "game",
  CHAT: "chat",
  RESOURCES: "resources",
  BREATHE: "breathe",
  CHAT_ROOM: "chat_room",
};

// ─── Breathing Exercise ───────────────────────────────────────
function BreatheScreen({ onBack }) {
  const [phase, setPhase] = useState("idle"); // idle | inhale | hold | exhale
  const [count, setCount] = useState(0);
  const [running, setRunning] = useState(false);

  const phases = [
    { name: "inhale", label: "Inspire…", duration: 4, color: palette.primary },
    { name: "hold", label: "Retiens…", duration: 4, color: palette.accentGreen },
    { name: "exhale", label: "Expire…", duration: 6, color: palette.accent },
  ];

  const startBreathing = () => {
    setRunning(true);
    let phaseIndex = 0;
    let countDown = phases[0].duration;
    setPhase(phases[0].name);
    setCount(countDown);

    const interval = setInterval(() => {
      countDown--;
      if (countDown <= 0) {
        phaseIndex = (phaseIndex + 1) % phases.length;
        countDown = phases[phaseIndex].duration;
        setPhase(phases[phaseIndex].name);
      }
      setCount(countDown);
    }, 1000);

    setTimeout(() => {
      clearInterval(interval);
      setRunning(false);
      setPhase("idle");
      setCount(0);
    }, 60000);
  };

  const currentPhase = phases.find((p) => p.name === phase) || phases[0];
  const circleSize = phase === "inhale" ? 160 : phase === "exhale" ? 90 : 130;

  return (
    <div style={styles.screen}>
      <button onClick={onBack} style={styles.backBtn}>← Retour</button>
      <h2 style={{ ...styles.title, marginTop: 12 }}>Respiration guidée</h2>
      <p style={styles.subtitle}>Technique 4-4-6 pour calmer le système nerveux</p>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 32 }}>
        <div
          style={{
            width: circleSize,
            height: circleSize,
            borderRadius: "50%",
            background: running ? currentPhase.color : palette.border,
            transition: "all 1s ease-in-out",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: running ? `0 0 40px ${currentPhase.color}66` : "none",
          }}
        >
          <span style={{ color: "#fff", fontSize: 32, fontWeight: 700 }}>
            {running ? count : ""}
          </span>
        </div>

        <p style={{ fontSize: 22, fontWeight: 600, color: palette.text, marginTop: 24, minHeight: 32 }}>
          {running ? currentPhase.label : "Prêt·e ?"}
        </p>

        {!running && (
          <button onClick={startBreathing} style={styles.primaryBtn}>
            Commencer (1 minute)
          </button>
        )}
        {running && (
          <p style={{ color: palette.textMuted, fontSize: 14, marginTop: 12 }}>
            Laisse-toi guider…
          </p>
        )}
      </div>

      <div style={{ ...styles.card, marginTop: 40, padding: 20 }}>
        <p style={{ color: palette.textMuted, fontSize: 14, lineHeight: 1.6 }}>
          💡 La respiration 4-4-6 active le système parasympathique, celui qui calme le corps et l'esprit. Pratiquée régulièrement, elle réduit l'anxiété et améliore la qualité du sommeil.
        </p>
      </div>
    </div>
  );
}

// ─── Chat Room ───────────────────────────────────────────────
function ChatRoomScreen({ contact, onBack }) {
  const [messages, setMessages] = useState([
    {
      from: "them",
      text: `Bonjour ! Je suis ${contact.name}. Comment puis-je vous aider aujourd'hui ?`,
      time: "maintenant",
    },
  ]);
  const [input, setInput] = useState("");

  const send = () => {
    if (!input.trim()) return;
    setMessages((m) => [
      ...m,
      { from: "me", text: input, time: "maintenant" },
    ]);
    setInput("");
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          from: "them",
          text: "Merci de me partager ça. Je suis là pour vous écouter. Pouvez-vous m'en dire un peu plus ?",
          time: "maintenant",
        },
      ]);
    }, 1500);
  };

  return (
    <div style={{ ...styles.screen, padding: 0, display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ padding: "16px 20px", borderBottom: `1px solid ${palette.border}`, display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={onBack} style={{ ...styles.backBtn, margin: 0 }}>←</button>
        <div style={{ width: 40, height: 40, borderRadius: "50%", background: palette.primary, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700 }}>
          {contact.name[0]}
        </div>
        <div>
          <div style={{ fontWeight: 700, color: palette.text }}>{contact.name}</div>
          <div style={{ fontSize: 12, color: accentGreenDot() }}>{contact.role}</div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.from === "me" ? "flex-end" : "flex-start" }}>
            <div style={{
              maxWidth: "75%",
              padding: "10px 14px",
              borderRadius: m.from === "me" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
              background: m.from === "me" ? palette.primary : palette.card,
              color: m.from === "me" ? "#fff" : palette.text,
              fontSize: 14,
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
              border: m.from !== "me" ? `1px solid ${palette.border}` : "none",
            }}>
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: "12px 20px", borderTop: `1px solid ${palette.border}`, display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Écrivez votre message…"
          style={{ flex: 1, padding: "10px 14px", borderRadius: 24, border: `1px solid ${palette.border}`, outline: "none", fontSize: 14, background: palette.bg }}
        />
        <button onClick={send} style={{ ...styles.primaryBtn, padding: "10px 18px", margin: 0, borderRadius: 24 }}>
          ↑
        </button>
      </div>
    </div>
  );
}

function accentGreenDot() { return palette.accentGreen; }

// ─── Main App ────────────────────────────────────────────────
export default function MentalBloom() {
  const [screen, setScreen] = useState(SCREENS.HOME);
  const [chatContact, setChatContact] = useState(null);

  const contacts = [
    { name: "Dr. Sophie Martin", role: "Psychiatre", available: true, specialty: "Anxiété, dépression", color: palette.primary },
    { name: "Kévin Assoc.", role: "Bénévole — Ligne d'écoute", available: true, specialty: "Écoute, orientation", color: palette.accentGreen },
    { name: "Marie Dupont", role: "Psychologue clinicienne", available: false, specialty: "Trauma, TCC", color: palette.accent },
    { name: "Asso. Psycom", role: "Association nationale", available: true, specialty: "Ressources, droits", color: palette.accentOrange },
  ];

  const resources = [
    { icon: "📞", title: "3114 — Numéro national prévention suicide", desc: "Disponible 24h/24, 7j/7. Gratuit.", tag: "Urgence", color: "#FFE5E5" },
    { icon: "💬", title: "SOS Amitié", desc: "Écoute anonyme et bienveillante.", tag: "Écoute", color: "#E5F0FF" },
    { icon: "🏥", title: "Trouver un psychiatre", desc: "Annuaire des professionnels près de chez vous.", tag: "Soins", color: "#E5FFE5" },
    { icon: "📖", title: "Comprendre les troubles anxieux", desc: "Guide pratique illustré.", tag: "Info", color: "#FFF5E5" },
    { icon: "🤝", title: "Groupes de parole locaux", desc: "Rencontrer d'autres personnes concernées.", tag: "Communauté", color: "#F0E5FF" },
    { icon: "⚖️", title: "Vos droits en santé mentale", desc: "Tout savoir sur l'accompagnement et le remboursement.", tag: "Droits", color: "#E5FFF5" },
  ];

  const games = [
    { icon: "🌬️", title: "Respiration guidée", desc: "Technique 4-4-6 pour calmer l'anxiété en 1 minute", screen: SCREENS.BREATHE, color: palette.primary },
    { icon: "🌿", title: "Scan corporel", desc: "Reconnecte-toi à ton corps, étape par étape", screen: null, color: palette.accentGreen, soon: true },
    { icon: "📓", title: "Journal des émotions", desc: "Pose tes pensées, observe tes humeurs", screen: null, color: palette.accentOrange, soon: true },
    { icon: "🌟", title: "Gratitude du jour", desc: "3 petites choses qui ont été bien aujourd'hui", screen: null, color: palette.accent, soon: true },
  ];

  if (screen === SCREENS.BREATHE) return <BreatheScreen onBack={() => setScreen(SCREENS.GAME)} />;
  if (screen === SCREENS.CHAT_ROOM && chatContact) return <ChatRoomScreen contact={chatContact} onBack={() => setScreen(SCREENS.CHAT)} />;

  return (
    <div style={styles.app}>
      {/* Content */}
      <div style={styles.content}>
        {screen === SCREENS.HOME && (
          <div style={styles.screen}>
            {/* Hero */}
            <div style={styles.hero}>
              <div style={styles.heroOrb} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ fontSize: 48, marginBottom: 8 }}>🌸</div>
                <h1 style={styles.heroTitle}>MentalBloom</h1>
                <p style={styles.heroSub}>Un espace pour toi, à ton rythme</p>
              </div>
            </div>

            {/* Quick access */}
            <p style={{ ...styles.sectionLabel, marginTop: 28 }}>Par où commencer ?</p>
            <div style={styles.quickGrid}>
              {[
                { icon: "🎮", label: "Activités", sub: "Jeux & exercices", screen: SCREENS.GAME, color: palette.primary },
                { icon: "💬", label: "Parler", sub: "Soignants & associations", screen: SCREENS.CHAT, color: palette.accentGreen },
                { icon: "📚", label: "Ressources", sub: "Infos & guides", screen: SCREENS.RESOURCES, color: palette.accentOrange },
                { icon: "🆘", label: "Urgence", sub: "3114 maintenant", screen: null, color: "#E05A5A", urgent: true },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => item.screen && setScreen(item.screen)}
                  style={{
                    ...styles.quickCard,
                    borderTop: `4px solid ${item.color}`,
                    cursor: item.urgent ? "pointer" : "pointer",
                  }}
                >
                  <span style={{ fontSize: 26 }}>{item.icon}</span>
                  <span style={{ fontWeight: 700, fontSize: 14, color: palette.text }}>{item.label}</span>
                  <span style={{ fontSize: 11, color: palette.textMuted }}>{item.sub}</span>
                </button>
              ))}
            </div>

            {/* Daily tip */}
            <p style={{ ...styles.sectionLabel, marginTop: 28 }}>Conseil du jour</p>
            <div style={{ ...styles.card, background: `linear-gradient(135deg, ${palette.primary}18, ${palette.accent}18)`, border: `1px solid ${palette.primaryLight}44` }}>
              <p style={{ margin: 0, color: palette.text, lineHeight: 1.7, fontSize: 15 }}>
                ✨ <strong>Prendre soin de soi n'est pas un luxe.</strong> Même 5 minutes de respiration consciente peuvent changer la couleur d'une journée difficile.
              </p>
            </div>

            {/* How it works */}
            <p style={{ ...styles.sectionLabel, marginTop: 28 }}>Comment ça marche ?</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { step: "01", text: "Explore les activités à ton rythme, sans pression" },
                { step: "02", text: "Discute avec des soignants ou des bénévoles formés" },
                { step: "03", text: "Accède à des ressources fiables et adaptées" },
              ].map((item) => (
                <div key={item.step} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: palette.primary, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 12, flexShrink: 0 }}>
                    {item.step}
                  </div>
                  <p style={{ margin: 0, color: palette.text, fontSize: 14 }}>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {screen === SCREENS.GAME && (
          <div style={styles.screen}>
            <h2 style={styles.title}>Activités & jeux</h2>
            <p style={styles.subtitle}>Des exercices conçus avec des professionnels de santé mentale</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 20 }}>
              {games.map((game) => (
                <button
                  key={game.title}
                  onClick={() => !game.soon && game.screen && setScreen(game.screen)}
                  style={{
                    ...styles.card,
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    cursor: game.soon ? "default" : "pointer",
                    opacity: game.soon ? 0.7 : 1,
                    border: `1px solid ${palette.border}`,
                    textAlign: "left",
                    background: palette.card,
                  }}
                >
                  <div style={{ width: 52, height: 52, borderRadius: 16, background: `${game.color}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>
                    {game.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: palette.text, fontSize: 15 }}>{game.title}</div>
                    <div style={{ fontSize: 13, color: palette.textMuted, marginTop: 2 }}>{game.desc}</div>
                  </div>
                  {game.soon
                    ? <span style={{ fontSize: 11, background: palette.border, padding: "3px 8px", borderRadius: 8, color: palette.textMuted }}>Bientôt</span>
                    : <span style={{ color: palette.primary, fontSize: 18 }}>→</span>
                  }
                </button>
              ))}
            </div>
          </div>
        )}

        {screen === SCREENS.CHAT && (
          <div style={styles.screen}>
            <h2 style={styles.title}>Parler à quelqu'un</h2>
            <p style={styles.subtitle}>Des professionnels et bénévoles disponibles pour vous écouter</p>
            <div style={{ ...styles.card, background: "#FFF8E1", border: "1px solid #FFE082", marginTop: 16 }}>
              <p style={{ margin: 0, fontSize: 13, color: "#795548" }}>
                ⚠️ Ce service n'est pas un service d'urgence. En cas de crise, appelez le <strong>3114</strong> (numéro national prévention suicide, gratuit, 24h/24).
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 20 }}>
              {contacts.map((c) => (
                <button
                  key={c.name}
                  onClick={() => { setChatContact(c); setScreen(SCREENS.CHAT_ROOM); }}
                  disabled={!c.available}
                  style={{
                    ...styles.card,
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    cursor: c.available ? "pointer" : "default",
                    opacity: c.available ? 1 : 0.5,
                    textAlign: "left",
                    border: `1px solid ${palette.border}`,
                  }}
                >
                  <div style={{ width: 48, height: 48, borderRadius: "50%", background: c.color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 18, flexShrink: 0 }}>
                    {c.name[0]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: palette.text }}>{c.name}</div>
                    <div style={{ fontSize: 13, color: palette.textMuted }}>{c.role}</div>
                    <div style={{ fontSize: 12, color: palette.textMuted, marginTop: 2 }}>🏷 {c.specialty}</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: c.available ? palette.accentGreen : "#ccc" }} />
                    <span style={{ fontSize: 11, color: c.available ? palette.accentGreen : palette.textMuted }}>
                      {c.available ? "Disponible" : "Absent·e"}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {screen === SCREENS.RESOURCES && (
          <div style={styles.screen}>
            <h2 style={styles.title}>Ressources</h2>
            <p style={styles.subtitle}>Informations fiables, droits et soutien</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 20 }}>
              {resources.map((r) => (
                <div key={r.title} style={{ ...styles.card, background: r.color, border: "none", display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 28, flexShrink: 0 }}>{r.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: palette.text, fontSize: 14 }}>{r.title}</div>
                    <div style={{ fontSize: 13, color: palette.textMuted, marginTop: 3 }}>{r.desc}</div>
                  </div>
                  <span style={{ fontSize: 11, background: "rgba(255,255,255,0.7)", padding: "3px 8px", borderRadius: 8, color: palette.textMuted, whiteSpace: "nowrap", flexShrink: 0 }}>
                    {r.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      {screen !== SCREENS.BREATHE && screen !== SCREENS.CHAT_ROOM && (
        <nav style={styles.nav}>
          {[
            { icon: "🏠", label: "Accueil", s: SCREENS.HOME },
            { icon: "🎮", label: "Activités", s: SCREENS.GAME },
            { icon: "💬", label: "Chat", s: SCREENS.CHAT },
            { icon: "📚", label: "Ressources", s: SCREENS.RESOURCES },
          ].map((item) => (
            <button
              key={item.s}
              onClick={() => setScreen(item.s)}
              style={{
                ...styles.navItem,
                color: screen === item.s ? palette.primary : palette.textMuted,
                fontWeight: screen === item.s ? 700 : 400,
              }}
            >
              <span style={{ fontSize: 20 }}>{item.icon}</span>
              <span style={{ fontSize: 11 }}>{item.label}</span>
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────
const styles = {
  app: {
    fontFamily: "'Inter', system-ui, sans-serif",
    background: palette.bg,
    minHeight: "100vh",
    maxWidth: 420,
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    position: "relative",
  },
  content: {
    flex: 1,
    overflowY: "auto",
    paddingBottom: 80,
  },
  screen: {
    padding: "24px 20px",
  },
  hero: {
    background: `linear-gradient(135deg, ${palette.primary}, ${palette.primaryLight})`,
    borderRadius: 24,
    padding: "32px 24px",
    textAlign: "center",
    position: "relative",
    overflow: "hidden",
  },
  heroOrb: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.1)",
    top: -60,
    right: -60,
  },
  heroTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: 800,
    margin: 0,
    letterSpacing: "-0.5px",
  },
  heroSub: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 15,
    margin: "8px 0 0",
  },
  quickGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
  },
  quickCard: {
    background: palette.card,
    border: "none",
    borderRadius: 16,
    padding: "16px 12px",
    display: "flex",
    flexDirection: "column",
    gap: 4,
    alignItems: "center",
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    transition: "transform 0.1s",
  },
  card: {
    background: palette.card,
    borderRadius: 16,
    padding: 16,
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
  title: {
    fontSize: 22,
    fontWeight: 800,
    color: palette.text,
    margin: 0,
    letterSpacing: "-0.4px",
  },
  subtitle: {
    fontSize: 14,
    color: palette.textMuted,
    margin: "6px 0 0",
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: 700,
    color: palette.textMuted,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    margin: "0 0 10px",
  },
  primaryBtn: {
    background: palette.primary,
    color: "#fff",
    border: "none",
    borderRadius: 50,
    padding: "12px 28px",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    marginTop: 20,
  },
  backBtn: {
    background: "none",
    border: "none",
    color: palette.primary,
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    padding: 0,
    marginBottom: 8,
  },
  nav: {
    position: "fixed",
    bottom: 0,
    left: "50%",
    transform: "translateX(-50%)",
    width: "100%",
    maxWidth: 420,
    background: palette.card,
    borderTop: `1px solid ${palette.border}`,
    display: "flex",
    justifyContent: "space-around",
    padding: "8px 0 16px",
  },
  navItem: {
    background: "none",
    border: "none",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 3,
    cursor: "pointer",
    padding: "4px 12px",
    transition: "color 0.15s",
  },
};
