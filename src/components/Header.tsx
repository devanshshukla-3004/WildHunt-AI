import { Leaf, Settings } from "lucide-react";
import type { AIStatus } from "../types";

export function Header({ status, onSettings }: { status: AIStatus; onSettings: () => void }) {
  const ready = status.state === "ready";
  return <header className="header">
    <div className="brand"><div className="brand-mark"><Leaf size={20}/></div><div><strong>WildHunt</strong><span>AI</span></div></div>
    <div className={`status-pill ${ready ? "ready" : ""}`}><i/> {ready ? "Local AI ready" : status.state === "checking" ? "Checking AI…" : "Local AI offline"}</div>
    <button className="icon-button" onClick={onSettings} aria-label="Open settings"><Settings size={19}/></button>
  </header>;
}