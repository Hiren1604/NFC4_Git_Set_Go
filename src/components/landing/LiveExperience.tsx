import { DemoOperations } from "./AIShowcase";
import { CompactDemoSummary } from "./CompactDemoSummary";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { ArrowRight, Bot, Building2, Check, CheckCircle2, Cpu, LayoutDashboard, Pause, Play, RotateCcw, Send, Sparkles, Users, Wrench } from "lucide-react";

export function AICore() {
  return <span className="ai-core"><Cpu size={22} /><span>AI<br />CORE</span></span>;
}

function useDemoClock(delay: number) {
  const [tick, setTick] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update(); media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (paused || reduced) return;
    const timer = window.setInterval(() => { if (!document.hidden) setTick(t => t + 1); }, delay);
    return () => window.clearInterval(timer);
  }, [delay, paused, reduced]);
  return { tick, paused: paused || reduced, toggle: () => setPaused(p => !p), advance: () => setTick(t => t + 1) };
}

export function TypedText({ text, paused = false }: { text: string; paused?: boolean }) {
  const [length, setLength] = useState(0);
  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setLength(text.length); return; }
    setLength(0);
    const timer = window.setInterval(() => setLength(n => { if (n >= text.length) window.clearInterval(timer); return Math.min(n + 1, text.length); }), 28);
    return () => window.clearInterval(timer);
  }, [text, paused]);
  return <span aria-label={text}><span aria-hidden="true">{text.slice(0, length)}<span className="typing-caret">▍</span></span></span>;
}

const events = ["Reading the request. Identifying plumbing issue…", "Priority detected. Matching an available specialist…", "Plumber assigned. Keeping the resident updated…", "Repair verified. Another request, resolved."];
export function LiveDashboard({ role }: { role: "resident" | "admin" | "technician" }) {
  const { tick, paused, toggle, advance } = useDemoClock(4200);
  const stage = tick % 4;
  const heading = role === "admin" ? "Your society, in sync." : role === "technician" ? "Your next move, sorted." : "Good morning, Aarav.";
  return <div className="dashboard-preview live-dashboard" data-paused={paused} aria-label={`${role} interactive dashboard demo`}>
    <div className="preview-top"><span className="flex items-center gap-2 font-semibold"><Building2 size={17} />SocietyHub<span className="tiny-ai">AI</span></span><div className="demo-controls"><span className="live-label"><i />PRODUCT DEMO</span><button onClick={toggle} aria-label={paused ? "Play dashboard animation" : "Pause dashboard animation"}>{paused ? <Play size={13} /> : <Pause size={13} />}</button></div></div>
    <div className="preview-body"><aside aria-hidden="true"><LayoutDashboard /><Bot /><Wrench /><Users /></aside><div className="preview-content">
      <div className="dashboard-greeting"><span>GREENWOOD RESIDENCES / {role.toUpperCase()}</span><span className="preview-avatar">{role === "resident" ? "AK" : role === "admin" ? "AD" : "RK"}</span></div><h3>{heading}</h3>
      <DemoOperations role={role} stage={stage} onAdvance={advance} />
      <CompactDemoSummary role={role} stage={stage} />
      <div className="role-ai-note"><Sparkles size={13} /><TypedText paused={paused} text={role === 'resident' ? events[stage] : role === 'admin' ? ['AI sorted incoming requests by urgency.', 'Lift issue flagged for priority review.', 'Available specialists matched to open jobs.', 'Daily request summary is ready.'][stage] : ['AI matched this job to your plumbing skills.', 'Job details and location are ready.', 'Resident updated on your progress.', 'Ready to add your completion note.'][stage]} /></div>

    </div></div>
  </div>;
}

const scenarios = [
  { label: "Leaking tap", message: "My kitchen tap is leaking in A-204.", category: "Plumbing", person: "Ravi · Plumbing specialist", result: "Tap repaired. No more drips." },
  { label: "Lift issue", message: "The lift in Tower B is stuck on floor 3.", category: "Lift maintenance", person: "Meera · Lift technician", result: "Lift serviced. Back in motion." },
  { label: "Broken light", message: "The lobby light in Tower C is flickering.", category: "Electrical", person: "Arjun · Electrician", result: "Light replaced. A brighter welcome." },
];
export function RequestPlayground() {
  const [scenario, setScenario] = useState(0);
  const [step, setStep] = useState(0);
  const orb = useRef<HTMLDivElement>(null);
  const current = scenarios[scenario];
  function follow(event: PointerEvent<HTMLElement>) {
    if (event.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    orb.current?.style.setProperty("--follow-x", `${event.clientX - rect.left}px`);
    orb.current?.style.setProperty("--follow-y", `${event.clientY - rect.top}px`);
  }
  return <section id="how-it-works" className="request-playground" onPointerMove={follow}>
    <div className="cursor-ai" ref={orb} aria-hidden="true"><Sparkles size={20} /><span>AI at work</span></div>
    <div className="request-layout"><div className="request-story"><span className="section-kicker"><Sparkles size={15} /> LESS CHASING. MORE LIVING.</span><h2>You report it.<br /><span>AI connects<br />the dots.</span></h2><p>No guessing who to call. See how one everyday issue becomes a clear next step for everyone.</p><div className="scenario-picker" role="group" aria-label="Choose an example request">{scenarios.map((item, i) => <button key={item.label} aria-pressed={scenario === i} onClick={() => { setScenario(i); setStep(0); }}>{item.label}<ArrowRight size={13} /></button>)}</div><span className="demo-caption">TRY A REQUEST → WATCH THE HANDOFF</span></div>
    <div className="workflow-console"><div className="workflow-toolbar"><span><Cpu size={16} /> THE RESOLUTION ENGINE</span><span>INTERACTIVE DEMO</span></div><div className="workflow-steps" role="group" aria-label="Request stages">{['You report', 'AI triages', 'Team resolves'].map((label, i) => <button key={label} aria-pressed={step === i} onClick={() => setStep(i)}><span>{step > i ? <Check size={15} /> : `0${i + 1}`}</span>{label}</button>)}</div>
      <div className="workflow-scene" key={`${scenario}-${step}`} aria-live="polite">
        {step === 0 ? <><span className="scene-label">01 / START WITH YOUR WORDS</span><div className="resident-message"><span className="message-avatar">YOU</span><p><TypedText text={current.message} /></p></div><div className="message-meta"><span>Location attached</span><span>Resident request</span></div><div className="scene-explanation"><h3>Just tell us what’s wrong.</h3><p>A simple description is all it takes to get the right people moving.</p></div></> : step === 1 ? <><span className="scene-label">02 / A LITTLE INTELLIGENCE. A LOT LESS EFFORT.</span><div className="triage-orbit"><AICore /><span className="orbit-ring" /></div><div className="triage-chips"><span><Check size={13} />{current.category}</span><span><Check size={13} />{scenario === 1 ? 'Urgent' : 'Standard'} priority</span></div><div className="scene-explanation"><h3>The right request. The right person.</h3><p><TypedText text={`AI identifies ${current.category.toLowerCase()} and suggests ${current.person.split(' · ')[0]} for the job.`} /></p></div></> : <><span className="scene-label">03 / EVERYONE’S IN THE LOOP</span><div className="resolved-mark"><CheckCircle2 size={48} /></div><div className="assigned-person"><span className="message-avatar">{current.person[0]}</span><div><b>{current.person}</b><small>Completion update shared</small></div><CheckCircle2 size={18} /></div><div className="scene-explanation"><h3>{current.result}</h3><p>Work completed. Resident notified. One shared record from start to finish.</p></div></>}
      </div><div className="workflow-bottom"><span>{step === 0 ? 'Your request, ready to go.' : step === 1 ? 'AI suggests. Your team takes it forward.' : 'A small fix. A better day.'}</span><button onClick={() => setStep((step + 1) % 3)}>{step === 0 ? 'Send to AI' : step === 1 ? 'See the resolution' : 'Try again'}{step === 0 ? <Send size={15} /> : step === 1 ? <ArrowRight size={15} /> : <RotateCcw size={15} />}</button></div>
    </div></div>
  </section>;
}
