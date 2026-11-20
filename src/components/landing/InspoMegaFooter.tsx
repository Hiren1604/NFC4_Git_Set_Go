import { SocietyWordmark } from "./SocietyWordmark";
import { ArrowUpRight, Building2, ShieldCheck, Wrench } from "lucide-react";

interface InspoMegaFooterProps {
  onQuickLogin: (role: "admin" | "resident" | "technician") => void;
}

export function InspoMegaFooter({ onQuickLogin }: InspoMegaFooterProps) {
  return (
    <footer className="landing-mega-footer bg-background text-foreground pb-8">
      <div className="footer-card-stage">
        <div className="footer-invitation"><span className="section-kicker">ONE SOCIETY. THREE WAYS IN.</span><h2>Your people.<br />Your place.<br /><span>Your portal.</span></h2></div>
        <div className="footer-portal-stack">
          {[{ role: 'resident' as const, icon: Building2, label: '01 / RESIDENT', title: 'Make yourself at home.', detail: 'Your requests. Your payments. Your community.', cta: 'Enter resident portal' }, { role: 'admin' as const, icon: ShieldCheck, label: '02 / ADMIN', title: 'See the whole picture.', detail: 'Bring your people, priorities, and payments together.', cta: 'Open admin workspace' }, { role: 'technician' as const, icon: Wrench, label: '03 / PERSONNEL', title: 'Get to the good work.', detail: 'Clear assignments. Shared updates. A job well done.', cta: 'Enter personnel portal' }].map(({ role, icon: Icon, label, title, detail, cta }) => <article className={`footer-portal-card footer-card-${role}`} key={role}><div><span>{label}</span><Icon size={26} /></div><h3>{title}</h3><p>{detail}</p><button onClick={() => onQuickLogin(role)}>{cta}<ArrowUpRight size={20} /></button></article>)}
        </div>
      </div>
      <div className="footer-content-width space-y-12 sm:space-y-16">
        
        {/* Top 3-Column Minimalist Technical Grid (Video frame 00:15) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 text-xs font-mono">
          {/* Navigation Links Column */}
          <div className="md:col-span-3 space-y-2.5">
            <div className="font-bold text-foreground uppercase tracking-wider mb-3">
              [ NAVIGATION ]
            </div>
            <div className="space-y-1.5 text-muted-foreground flex flex-col">
              <a href="#hero" className="hover:text-foreground transition-colors">HOME</a>
              <a href="#features" className="hover:text-foreground transition-colors">WHAT SOCIETYHUB DOES</a>
              <a href="#treasury-showcase" className="hover:text-foreground transition-colors">PAYMENTS & RECORDS</a>
              <a href="#how-it-works" className="hover:text-foreground transition-colors">HOW IT WORKS</a>
              <a href="#roles" className="hover:text-foreground transition-colors">ROLE PORTALS</a>
            </div>
          </div>

          {/* Socials & Portals Column */}
          <div className="md:col-span-4 space-y-2.5">
            <div className="font-bold text-foreground uppercase tracking-wider mb-3">
              [ QUICK ACCESS ]
            </div>
            <div className="space-y-1.5 text-muted-foreground flex flex-col">
              <button
                onClick={() => onQuickLogin("admin")}
                className="text-left hover:text-primary transition-colors font-medium"
              >
                → SOCIETY ADMINISTRATOR DASHBOARD
              </button>
              <button
                onClick={() => onQuickLogin("resident")}
                className="text-left hover:text-primary transition-colors font-medium"
              >
                → RESIDENT PORTAL
              </button>
              <button
                onClick={() => onQuickLogin("technician")}
                className="text-left hover:text-primary transition-colors font-medium"
              >
                → PERSONNEL PORTAL
              </button>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">
                GITHUB REPOSITORY
              </a>
            </div>
          </div>

          {/* Editorial Mission Statement Column */}
          <div className="md:col-span-5 space-y-3">
            <p className="text-muted-foreground leading-relaxed uppercase">
              ONE PLACE FOR RESIDENTS, ADMINS, AND PERSONNEL TO MANAGE REQUESTS, PAYMENTS, AND EVERYDAY SOCIETY LIFE.
            </p>
            <div className="pt-2 text-foreground font-bold">
              GOT A RESIDENTIAL SOCIETY TO ONBOARD? LET'S TALK.
            </div>
            <div className="text-primary font-bold text-sm">
              HELLO@SOCIETYHUB.IO
            </div>
            <div className="text-[11px] text-muted-foreground">
              COPYRIGHT 2026 // SOCIETYHUB PLATFORM V2.4
            </div>
          </div>
        </div>

        <div className="footer-wordmark border-y border-border/60" aria-label="SocietyHub"><SocietyWordmark liquid /></div>

        {/* Technical Bottom Edge Ticker Line */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] sm:text-[11px] font-mono text-muted-foreground pt-2">
          <div className="flex items-center gap-2">
            <span>[ // WE PREDICT & RESOLVE RESIDENTIAL GRIEVANCES ]</span>
            <span>[ 2026 ]</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hover:text-foreground cursor-pointer">[ TERMS ]</span>
            <span>+</span>
            <span className="hover:text-foreground cursor-pointer">[ PRIVACY ]</span>
            <span>+</span>
            <span className="hover:text-foreground cursor-pointer">[ COOKIES ]</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
