import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, CheckCircle2, Sparkles, Pause, Play, Cpu, ScanLine, ShieldCheck, Users, Wrench } from "lucide-react";

export function DemoOperations({ role, stage, onAdvance }: { role: 'resident' | 'admin' | 'technician'; stage: number; onAdvance: () => void }) {
  const stages = role === 'admin' ? ['Incoming', 'AI review', 'Assigned', 'Resolved'] : role === 'technician' ? ['Matched', 'Accepted', 'Working', 'Complete'] : ['Reported', 'AI triage', 'Assigned', 'Resolved'];
  return <div className={`demo-operations operations-${role}`}>
    <div className="operations-header"><span><Cpu size={13} />{role === 'admin' ? 'LIVE DISPATCH' : role === 'technician' ? 'JOB PROGRESS' : 'YOUR REQUEST, IN MOTION'}</span><span>DEMO / 0{stage + 1}</span></div>
    <div className="operations-lanes">{stages.map((label, i) => <div key={label} className={stage >= i ? 'lane-reached' : ''}><span>{stage > i ? <Check size={11} /> : `0${i + 1}`}</span><b>{label}</b></div>)}</div>
    <div className="moving-ticket-track"><div className="moving-ticket" style={{ left: `${stage * 25}%` }}><Wrench size={13} /><b>A-204</b><small>{stage === 0 ? 'New issue' : stage === 1 ? 'AI matched' : stage === 2 ? 'Ravi / on job' : 'Fixed'}</small></div></div>
    <div className="operations-bottom"><div className="operations-meter"><span>{role === 'admin' ? 'Queue cleared' : role === 'technician' ? 'Checklist complete' : 'Resolution progress'}</span><div><i style={{ width: `${(stage + 1) * 25}%` }} /></div></div><strong>{(stage + 1) * 25}%</strong><button onClick={onAdvance} aria-label="Advance demo to next stage">{stage === 3 ? 'Replay' : 'Next'}<ArrowRight size={12} /></button></div>
    <div className="operations-event" key={stage}><span className="event-check"><Check size={12} /></span>{role === 'admin' ? ['New request added to queue', 'Category and priority suggested', 'Ravi assigned / queue updated', 'Resolution logged / resident notified'][stage] : role === 'technician' ? ['AI matched your plumbing skills', 'Assignment accepted / resident notified', 'Inspection complete / repair started', 'Completion shared with the society'][stage] : ['Your report is now in the queue', 'AI identified plumbing / standard priority', 'Ravi accepted your repair request', 'Repair complete / confirmation ready'][stage]}</div>
  </div>;
}

const capabilities = [
  { icon: ScanLine, name: 'Understand the issue', input: '"Water is leaking under my kitchen sink."', result: 'Plumbing', detail: 'AI turns the resident description into a category so the request reaches the right team.', tag: 'CATEGORY DETECTION', example: ['Input: resident description', 'Output: plumbing category'] },
  { icon: ShieldCheck, name: 'Surface what needs attention', input: '"The lift is stuck with someone inside."', result: 'Urgent attention', detail: 'AI suggests priority and an estimated resolution time. Your team can review the recommendation.', tag: 'PRIORITY & ESTIMATES', example: ['Input: issue context', 'Output: priority + time estimate'] },
  { icon: Users, name: 'Find the right specialist', input: 'Plumbing request / available personnel', result: 'Ravi Kumar', detail: 'Match the work to personnel skills and availability, with the assignment visible to everyone involved.', tag: 'PERSONNEL MATCHING', example: ['Input: category + available skills', 'Output: suggested technician'] },
  { icon: CheckCircle2, name: 'Close the loop', input: '', result: 'Resolved', detail: 'Your technician completes the work and shares an update. The resident can follow the request through to resolution.', tag: 'TRACK & RESOLVE', example: ['Technician: completion update', 'Resident: notified'] },
];
export function AIShowcase() {
  const [active, setActive] = useState(0);
  const [scenario, setScenario] = useState(0);
  const orb = useRef<HTMLDivElement>(null);
  const examples = [
    { label: 'Leaking tap', text: 'Water is leaking under my kitchen sink.', category: 'Plumbing', person: 'Ravi Kumar', initials: 'RK', priority: 'Standard', location: 'A-204' },
    { label: 'Lift issue', text: 'The lift is stuck with someone inside.', category: 'Lift service', person: 'Meera Patel', initials: 'MP', priority: 'Urgent', location: 'Tower B' },
    { label: 'Broken light', text: 'The lobby light is flickering.', category: 'Electrical', person: 'Arjun Shah', initials: 'AS', priority: 'Standard', location: 'Tower C' },
  ];
  const example = examples[scenario];
  const [paused, setPaused] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(media.matches);
    sync(); media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);
  const stopped = paused || interacting || reduced;
  useEffect(() => {
    if (stopped) return;
    const timer = window.setInterval(() => { if (!document.hidden) setActive(i => (i + 1) % capabilities.length); }, 6500);
    return () => clearInterval(timer);
  }, [stopped, active]);
  const item = capabilities[active];
  return <section id="how-it-works" className="ai-usecases merged-journey" aria-labelledby="ai-usecases-title" onPointerMove={e => { if (e.pointerType !== 'mouse' || reduced) return; const r = e.currentTarget.getBoundingClientRect(); orb.current?.style.setProperty('--follow-x', `${e.clientX-r.left}px`); orb.current?.style.setProperty('--follow-y', `${e.clientY-r.top}px`); }}><div className="cursor-ai" ref={orb} aria-hidden="true"><Sparkles size={16} />AI at work</div><div className="ai-usecases-heading"><span className="section-kicker"><Cpu size={15} /> INTELLIGENCE WITH A JOB TO DO</span><h2 id="ai-usecases-title">AI does the sorting.<br />Your people do the fixing.</h2><p>One request, from the first report to the final fix. See where AI helps and where your people take over.</p><div className="journey-scenarios" role="group" aria-label="Choose a request scenario">{examples.map((entry,i) => <button key={entry.label} aria-pressed={scenario === i} onClick={() => { setScenario(i); setActive(0); }}>{entry.label}<ArrowRight size={12} /></button>)}</div></div><div className="ai-usecases-grid" onMouseEnter={() => setInteracting(true)} onMouseLeave={() => setInteracting(false)} onFocus={() => setInteracting(true)} onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setInteracting(false); }}>
    <div className="ai-cycle-controls"><div className="ai-usecase-tabs" role="group" aria-label="Explore where AI is used">{capabilities.map(({ icon: Icon, name, tag }, i) => <button key={tag} onClick={() => setActive(i)} aria-pressed={active === i}><span>0{i + 1}</span><Icon size={18} /><div><small>{tag}</small><b>{name}</b></div><ArrowRight size={16} />{active === i && <i key={`${active}-${stopped}`} className="ai-cycle-progress" style={{ animationPlayState: stopped ? 'paused' : 'running' }} />}</button>)}</div><button className="ai-cycle-toggle" onClick={() => setPaused(p => !p)} aria-pressed={paused}>{paused || reduced ? <Play size={12} /> : <Pause size={12} />}{reduced ? 'Select an example above' : paused ? 'Resume tour' : 'Pause tour'}<span>0{active + 1} / 04</span></button></div>
    <article className={`ai-proof-card ai-scene-${active}`} key={`${active}-${scenario}`}><div className="proof-top"><Cpu size={17} /><span>{item.tag}</span><span>EXAMPLE / 0{active + 1}</span></div>
      {active === 0 ? <div className="classification-scene"><div className="scan-document"><span>RESIDENT REPORT / {example.location}</span><p>{example.text}</p><div className="scan-line" /></div><div className="category-results">{[[example.category, 96], ['Other categories', 3], ['Unclassified', 1]].map(([name, value]) => <div key={name}><span>{name}</span><i><b style={{ width: `${value}%` }} /></i><small>{value}%</small></div>)}</div><span className="scene-demo-note">Illustrative classification scores</span></div> : active === 1 ? <div className="priority-scene"><div className="urgency-dial"><ShieldCheck size={30} /><strong>{example.priority}</strong><span>{scenario === 1 ? "REVIEW FIRST" : "ROUTINE REVIEW"}</span></div><div className="priority-queue"><div><span className="priority-dot" /><b>{example.label} / {example.location}</b><span>01</span></div><div><span /><b>Other maintenance requests</b><span>02</span></div><div><span /><b>Lobby light flickering</b><span>03</span></div></div><span className="scene-demo-note">Suggested priority / human review</span></div> : active === 2 ? <div className="matching-scene"><div className="match-request"><Wrench size={18} /><div><small>REQUEST NEEDS</small><b>{example.category} specialist</b></div><span>{example.location}</span></div><div className="match-connector"><i /><Cpu size={20} /><i /></div><div className="specialist-match"><span className="specialist-avatar">{example.initials}</span><div><b>{example.person}</b><span>{example.category} / Available today</span></div><Check size={19} /></div><div className="match-alternatives"><span>AS <small>Electrical</small></span><span>MP <small>Lift service</small></span></div></div> : <div className="resolution-scene"><div className="resolution-seal"><CheckCircle2 size={46} /></div><h3>Reported. Repaired. Resolved.</h3><div className="resolution-record"><span>{example.label} / {example.location}</span><b><Check size={13} />Complete</b></div><div className="resolution-people"><span>{example.person}<small>Completion shared</small></span><ArrowRight size={18} /><span>Resident<small>Update received</small></span></div><button onClick={() => setActive(0)}>Replay this request <ArrowRight size={13} /></button></div>}
      <p>{item.detail}</p><div className="proof-foot">{item.example.map(text => <span key={text}>{text}</span>)}</div></article></div></section>;
}
