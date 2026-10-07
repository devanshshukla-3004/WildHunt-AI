import { useState } from "react";
import { CheckCircle2, Copy, Cpu, RefreshCw, Terminal, X } from "lucide-react";
import type { AIStatus } from "../types";
import { getOllamaConfig } from "../services/ai";

export function Settings({ status, onRefresh, onClose }: { status: AIStatus; onRefresh: () => void; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const config = getOllamaConfig();
  const copy = async () => { await navigator.clipboard?.writeText(`ollama pull ${config.model}`); setCopied(true); setTimeout(() => setCopied(false), 1400); };
  return <div className="modal-backdrop"><div className="modal"><div className="modal-head"><div><div className="kicker">SETTINGS</div><h2>Local AI</h2></div><button className="icon-button" onClick={onClose}><X size={19}/></button></div><div className="setting-row"><div className="setting-icon"><Cpu size={19}/></div><div><strong>Ollama endpoint</strong><span>{config.baseUrl}</span></div></div><div className="setting-row"><div className="setting-icon"><CheckCircle2 size={19}/></div><div><strong>Vision model</strong><span>{config.model}</span></div></div><div className={`setting-state ${status.state === "ready" ? "ok" : "bad"}`}><span>{status.state === "ready" ? "● Ready" : "● Not ready"}</span><small>{status.message}</small></div><div className="command"><Terminal size={17}/><code>ollama pull {config.model}</code><button onClick={copy} aria-label="Copy model command"><Copy size={15}/>{copied ? "Copied" : ""}</button></div><button className="secondary-button full" onClick={onRefresh}><RefreshCw size={16}/> Test Ollama connection</button><p className="privacy-copy">WildHunt is local-first. Images are sent to the Ollama endpoint shown above for verification and are not uploaded to a WildHunt backend.</p></div></div>;
}