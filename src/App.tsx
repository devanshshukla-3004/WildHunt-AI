import { useEffect, useState } from "react";
import { hunts } from "./data/hunts";
import { targets } from "./data/targets";
import type { AIStatus, HuntDefinition, HuntTarget, VerificationResult, SessionState } from "./types";
import { checkOllama } from "./services/ai";
import { createSession, currentTargetId, markVerified } from "./services/session";
import { Header } from "./components/Header";
import { AIStatusCard, OllamaHelp } from "./components/AIStatus";
import { HuntPicker } from "./components/HuntPicker";
import { Mission } from "./components/Mission";
import { PhotoFlow } from "./components/PhotoFlow";
import { Completion } from "./components/Completion";
import { Settings } from "./components/Settings";
import "./styles.css";

type Screen = "home" | "mission" | "photo" | "complete";

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [hunt, setHunt] = useState<HuntDefinition>();
  const [session, setSession] = useState<SessionState>();
  const [status, setStatus] = useState<AIStatus>({ state: "checking", message: "Checking your local Ollama instance…" });
  const [settings, setSettings] = useState(false);

  const refreshAI = async () => {
    setStatus({ state: "checking", message: "Checking your local Ollama instance…" });
    try {
      const result = await checkOllama();
      setStatus({ state: "ready", message: "Local vision inference is available.", model: result.model });
    } catch (e) {
      const err = e as Error & { code?: string };
      if (err.code === "MODEL_MISSING") setStatus({ state: "model-missing", message: err.message, models: [] });
      else if (err.code === "OFFLINE") setStatus({ state: "offline", message: "Start Ollama on this computer, then retry." });
      else setStatus({ state: "error", message: err.message || "Unable to connect to Ollama." });
    }
  };

  useEffect(() => { void refreshAI(); }, []);

  const startHunt = (selected: HuntDefinition) => {
    setHunt(selected);
    setSession(createSession(selected.id, selected.targets));
    setScreen("mission");
  };

  const target: HuntTarget | undefined = session
    ? targets.find(x => x.id === currentTargetId(session))
    : undefined;

  const verified = (result: VerificationResult) => {
    if (!result.matched || !session) return;
    const next = markVerified(session);
    setSession(next);
    if (next.currentIndex >= next.targetIds.length) setScreen("complete");
    else setScreen("mission");
  };

  return (
    <div className="app-shell">
      <Header status={status} onSettings={() => setSettings(true)} />
      <main>
        {screen === "home" && (
          <>
            <HuntPicker hunts={hunts} onSelect={startHunt} />
            <AIStatusCard status={status} onRefresh={() => void refreshAI()} />
            <OllamaHelp />
          </>
        )}
        {screen === "mission" && target && session && (
          <Mission target={target} step={session.currentIndex + 1} total={session.targetIds.length} onCapture={() => setScreen("photo")} onBack={() => setScreen("home")} />
        )}
        {screen === "photo" && target && (
          <PhotoFlow target={target} onVerified={verified} onCancel={() => setScreen("mission")} />
        )}
        {screen === "complete" && (
          <Completion count={session?.verified.length ?? 0} onHome={() => { setSession(undefined); setHunt(undefined); setScreen("home"); }} />
        )}
      </main>
      {settings && <Settings status={status} onRefresh={() => void refreshAI()} onClose={() => setSettings(false)} />}
    </div>
  );
}
