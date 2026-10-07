import { useRef, useState } from "react";
import { Camera, CheckCircle2, LoaderCircle, RotateCcw, Sparkles, X } from "lucide-react";
import type { HuntTarget, VerificationResult } from "../types";
import { fileToDataUrl } from "../services/image";
import { verifyImageWithOllama } from "../services/ai";

export function PhotoFlow({ target, onVerified, onCancel }: { target: HuntTarget; onVerified: (result: VerificationResult, dataUrl: string) => void; onCancel: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<string>();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();
  const [result, setResult] = useState<VerificationResult>();
  const pick = async (file?: File) => {
    if (!file) return;
    setError(undefined); setResult(undefined);
    const url = await fileToDataUrl(file);
    setImage(url);
  };
  const verify = async () => {
    if (!image) return;
    setBusy(true); setError(undefined);
    try { const value = await verifyImageWithOllama(target.prompt, image); setResult(value); onVerified(value, image); }
    catch (e) { setError(e instanceof Error ? e.message : "Verification failed."); }
    finally { setBusy(false); }
  };
  return <div className="photo-page"><button className="text-button" onClick={onCancel}><X size={16}/> Back</button><div className="photo-head"><div className="kicker">VERIFY DISCOVERY</div><h1>{target.title}</h1><p>WildHunt sends this photo to Ollama running on your machine — not to a WildHunt server.</p></div><div className="capture-frame">{image ? <img src={image} alt="Your discovery"/> : <div className="capture-empty"><Camera size={42}/><strong>Show us what you found</strong><span>Use your camera or choose a photo.</span></div>}</div>{error && <div className="error-box">{error}</div>}{result && <div className={`result-box ${result.matched ? "match" : "miss"}`}><div className="result-title">{result.matched ? <CheckCircle2/> : <RotateCcw/>}<strong>{result.matched ? "Discovery verified" : "Not quite — try again"}</strong><span>{Math.round(result.confidence*100)}% model confidence</span></div><p>{result.explanation}</p>{result.evidence.length > 0 && <ul>{result.evidence.map(x => <li key={x}>{x}</li>)}</ul>}</div>}<div className="photo-actions">{!image && <><input ref={inputRef} type="file" accept="image/*" capture="environment" hidden onChange={e => pick(e.target.files?.[0])}/><button className="primary-button" onClick={() => inputRef.current?.click()}><Camera size={20}/> Take / choose photo</button></>}{image && !result && <><button className="secondary-button" onClick={() => setImage(undefined)}>Retake</button><button className="primary-button" disabled={busy} onClick={verify}>{busy ? <><LoaderCircle className="spin" size={20}/> Asking local AI…</> : <><Sparkles size={20}/> Verify with Ollama</>}</button></>}</div></div>;
}