import { Camera, ShieldCheck } from "lucide-react";
import type { HuntTarget } from "../types";

export function Mission({ target, step, total, onCapture, onBack }: { target: HuntTarget; step: number; total: number; onCapture: () => void; onBack: () => void }) {
  return <div className="mission-page"><button className="text-button" onClick={onBack}>← Change hunt</button><div className="progress"><span style={{width:`${(step/total)*100}%`}}/></div><div className="mission-card"><div className="mission-meta"><span>{target.category}</span><span>{target.difficulty}</span></div><div className="kicker">MISSION {step} / {total}</div><h1>{target.title}</h1><p>{target.prompt}</p><div className="safety"><ShieldCheck size={17}/><div><strong>Stay curious, stay safe.</strong>{target.safety.map(x => <span key={x}>• {x}</span>)}</div></div><button className="primary-button" onClick={onCapture}><Camera size={20}/> Capture discovery</button></div></div>;
}