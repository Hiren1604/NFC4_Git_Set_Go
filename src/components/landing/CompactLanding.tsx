import { tilt, resetTilt } from "./utils";
import { PORTALS as portals } from "./constants";
import { SocietyWordmark } from "./SocietyWordmark";
import { AIShowcase } from "./AIShowcase";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Building2, Check, CreditCard, ShieldCheck, Users, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import "./compact-landing.css";
import { AICore, LiveDashboard } from "./LiveExperience";
import { LandingEssentials } from "./LandingEssentials";
import { LandingMarquee, useLandingMotion } from "./LandingMotion";
import { InspoMegaFooter } from "./InspoMegaFooter";

type Role = "resident" | "admin" | "technician";

export function CompactLanding({ onAuthenticate }: { onAuthenticate: (view: "login" | "signup", role: Role) => void }) {
  const [role, setRole] = useState<Role>("resident");
  const portal = portals[role];
  const root = useLandingMotion();
  const nav = useRef<HTMLElement>(null);
  useEffect(() => {
    let frame = 0;
    function update() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const panel = document.querySelector('.portal-stage')?.getBoundingClientRect();
        const y = (nav.current?.getBoundingClientRect().bottom ?? 70) - 15;
        if (nav.current) nav.current.dataset.surface = panel && panel.top < y && panel.bottom > y ? role : 'page';
      });
    }
    update(); window.addEventListener('scroll', update, { passive: true }); window.addEventListener('resize', update);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, [role]);
  return (
    <div ref={root} className="compact-landing bg-background text-foreground">
      <header ref={nav} className="landing-nav"><div className="nav-pill">
        <a href="#" className="flex items-center gap-2 text-lg font-bold tracking-tight"><Building2 className="h-6 w-6" />SocietyHub<span className="text-primary">.</span></a>
        <div className="flex items-center gap-3 sm:gap-6"><nav className="nav-section-links" aria-label="Main navigation"><a href="#features">Features</a><a href="#ai-usecases-title">AI core</a><a href="#treasury-showcase">Payments</a></nav><ThemeToggle /><Button variant="outline" onClick={() => onAuthenticate("login", role)}>Log in <ArrowRight className="ml-2 h-4 w-4" /></Button></div>
      </div></header>
      <main>
        <section id="hero" className="landing-hero" aria-labelledby="hero-title">
          <div className="hero-intro"><h1 id="hero-title" aria-label="SocietyHub" className="font-black uppercase tracking-tight text-neutral-300 dark:text-neutral-700"><SocietyWordmark /></h1></div>
          <div id="roles" data-role={role} className="portal-stage bg-[#FEF08A] dark:bg-[#FDE047] text-neutral-950">
            <div className="portal-copy">
              <span className="landing-eyebrow">AI-FIRST SOCIETY MANAGEMENT</span>
              <div className="portal-tabs" role="group" aria-label="Choose your role">{(Object.keys(portals) as Role[]).map(key => { const Icon = portals[key].icon; return <button key={key} type="button" aria-pressed={role === key} onClick={() => setRole(key)}><Icon size={15} />{portals[key].label}</button>; })}</div>
              <h2 className="font-black uppercase tracking-tighter text-neutral-950">{portal.title}</h2><p className="font-mono font-bold uppercase text-neutral-900">{portal.subtitle}</p>
              <div className="flex flex-wrap items-center gap-3 pt-2"><Button className="bg-neutral-950 text-white hover:bg-neutral-800" onClick={() => onAuthenticate("login", role)}>Log in as {portal.label.toLowerCase()} <ArrowRight className="ml-2 h-4 w-4" /></Button><Button variant="ghost" className="text-neutral-900 hover:bg-black/5" onClick={() => onAuthenticate("signup", role)}>Sign up</Button></div>
            </div>
            <LiveDashboard key={role} role={role} />
          </div>
        </section>
        <section id="features" className="landing-features" aria-labelledby="features-title"><div className="features-heading"><h2 id="features-title" className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tighter text-foreground leading-[0.9]">WHAT<br />SOCIETYHUB<br />DOES <AICore /></h2><div className="ai-manifesto"><span className="section-kicker">BUILT AROUND AI. BUILT FOR REAL LIFE.</span><p><span>Reads the issue.</span> <span>Finds the right person.</span> <span>Keeps everyone in sync.</span></p><div>From a resident's first report to the team's final update, AI helps turn everyday requests into clear next steps.</div></div></div>
          <div className="feature-bento">
            <div className="bento-reveal"><article className="border border-white/60 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl text-foreground bento-tile bento-maintenance" onPointerMove={tilt} onPointerLeave={resetTilt} onPointerCancel={resetTilt}><div className="bento-content"><Wrench className="mb-5 text-primary" /><h3 className="text-lg font-bold text-foreground tracking-tight leading-snug">From reported to resolved.</h3><p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">Report an issue, prioritize it with AI triage, and connect with the right personnel.</p></div><div className="maintenance-example"><span className="text-[10px] font-mono text-muted-foreground">REQUEST PREVIEW</span><div className="maintenance-ticket"><Wrench size={18} className="text-primary" /><div><span className="text-sm font-bold">Kitchen tap repair</span><span className="block text-[11px] text-muted-foreground mt-1">Tower A / Plumbing</span></div><span className="ticket-badge">Assigned</span></div><div className="maintenance-ticket ticket-back" aria-hidden="true"><Check size={18} className="text-emerald-600" /><span className="text-xs font-bold">Personnel notified</span></div></div><div className="card-scene repair-flow" aria-hidden="true"><span><Check size={15} />Reported</span><i /><span><Wrench size={15} />Assigned</span><i /><span><Check size={15} />Resolved</span></div></article></div>
            <div className="bento-reveal"><article className="border border-white/60 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl text-foreground bento-tile bento-payments" onPointerMove={tilt} onPointerLeave={resetTilt} onPointerCancel={resetTilt}><CreditCard className="mb-5 text-emerald-600" /><h3 className="text-lg font-bold text-foreground tracking-tight leading-snug">Payments, without the follow-up.</h3><p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">Keep maintenance dues and payment records together.</p><div className="card-scene payment-slip" aria-hidden="true"><span>Maintenance</span><span className="flex items-center gap-1"><Check size={15} />Paid</span></div></article></div>
            <div className="bento-reveal"><article className="border border-white/60 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl text-foreground bento-tile bento-community" onPointerMove={tilt} onPointerLeave={resetTilt} onPointerCancel={resetTilt}><Users className="mb-5 text-amber-500" /><h3 className="text-lg font-bold text-foreground tracking-tight leading-snug">A more connected community.</h3><p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">Keep residents, admins, and personnel on the same page.</p><div className="card-scene community-people" aria-hidden="true"><span>R</span><span>A</span><span>P</span><span className="community-caption">One society. Together.</span></div></article></div>
          </div>
        </section>
        <AIShowcase />
        <LandingMarquee />
        <LandingEssentials onLogin={() => onAuthenticate("login", role)} />
      </main>
      <InspoMegaFooter onQuickLogin={(selectedRole) => onAuthenticate("login", selectedRole)} />
    </div>
  );
}
