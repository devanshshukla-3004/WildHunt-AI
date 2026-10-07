import { CheckCircle2, Cpu, Download, ExternalLink, RefreshCw, WifiOff } from "lucide-react";
import type { AIStatus } from "../types";

export function AIStatusCard({ status, onRefresh }: { status: AIStatus; onRefresh: () => void }) {
  const ready = status.state === "ready";
  const missing = status.state === "model-missing";
  return <section className={`ai-card ${ready ? "ai-ready" : ""}`}>
    <div className="ai-icon">{ready ? <CheckCircle2/> : missing ? <Download/> : <WifiOff/>}</div>
    <div className="ai-copy">
      <div className="eyebrow">LOCAL VISION ENGINE</div>
      <h3>{ready ? "Ollama is ready" : missing ? "Vision model required" : status.state === "checking" ? "Checking local AI" : "Local AI not reachable"}</h3>
      <p>{status.message}</p>
      {ready && <small><Cpu size={13}/> {status.model}</small>}
      {missing && <code>ollama pull granite3.2-vision</code>}
    </div>
    {!ready && <button className="small-button" onClick={onRefresh}><RefreshCw size={15}/> Retry</button>}
  </section>;
}

export function OllamaHelp() {
  return <div className="help-note"><ExternalLink size={15}/><span>Ollama runs on your machine. Photos stay local and are sent only to your local vision model.</span></div>;
}