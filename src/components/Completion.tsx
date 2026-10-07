import { Trophy } from "lucide-react";

export function Completion({ count, onHome }: { count: number; onHome: () => void }) {
  return <div className="complete"><div className="trophy"><Trophy size={34}/></div><div className="kicker">HUNT COMPLETE</div><h1>You touched grass.</h1><p>You verified {count} real-world discoveries with local open-weight vision AI.</p><div className="quote">“The screen gives you the mission. The real world gives you the answers.”</div><button className="primary-button" onClick={onHome}>Start another hunt</button></div>;
}