import { ArrowRight } from "lucide-react";
import type { HuntDefinition } from "../types";

export function HuntPicker({ hunts, onSelect }: { hunts: HuntDefinition[]; onSelect: (hunt: HuntDefinition) => void }) {
  return <div className="page-stack"><div className="hero"><div className="kicker">TOUCH GRASS · LOCAL AI</div><h1>Let the screen give you a reason to leave it.</h1><p>WildHunt turns your surroundings into a scavenger hunt. Find something real, photograph it, and let open-weight vision AI verify the discovery on your own machine.</p></div><div className="section-head"><div><div className="kicker">CHOOSE A HUNT</div><h2>Where will you look?</h2></div></div><div className="hunt-grid">{hunts.map(hunt => <button className="hunt-card" key={hunt.id} onClick={() => onSelect(hunt)}><span className="hunt-icon">{hunt.icon}</span><div><h3>{hunt.name}</h3><p>{hunt.description}</p></div><ArrowRight size={19}/></button>)}</div></div>;
}