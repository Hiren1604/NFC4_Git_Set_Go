import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Bell, CheckCircle2, CreditCard, ShieldCheck, Users, Wrench, Pause, Play } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);
const items = [
  { icon: Wrench, title: "Report. Assign. Resolve.", detail: "Maintenance requests" },
  { icon: CreditCard, title: "Every payment in view.", detail: "Dues & records" },
  { icon: ShieldCheck, title: "Audit & governance.", detail: "Ledger accuracy & disputes" },
  { icon: Bell, title: "Keep everyone informed.", detail: "Community notices" },
  { icon: Users, title: "The right people, connected.", detail: "Resident & personnel portals" },
  { icon: CheckCircle2, title: "Follow every update.", detail: "Request tracking" },
];

export function LandingMarquee() {
  const root = useRef<HTMLDivElement>(null);
  const motion = useRef<gsap.core.Tween[]>([]);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  useEffect(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const tracks = root.current?.querySelectorAll<HTMLElement>(".feature-marquee-track") ?? [];
      motion.current = Array.from(tracks).map((track, index) => gsap.fromTo(track, { xPercent: index ? -50 : 0 }, { xPercent: index ? 0 : -50, duration: index ? 45 : 38, ease: "none", repeat: -1 }));
      return () => { motion.current = []; };
    });
    return () => media.revert();
  }, []);
  useEffect(() => { motion.current.forEach(tween => tween.paused(paused || hovered || focused)); }, [paused, hovered, focused]);
  return <section className="feature-marquee-section border-y border-border/60" aria-label="Explore SocietyHub features">
    <div className="max-w-6xl mx-auto px-6 mb-5 flex items-center justify-between gap-4"><span className="text-[11px] font-mono uppercase text-muted-foreground">[ YOUR EVERYDAY. WORKING TOGETHER. ]</span><button type="button" aria-pressed={paused} onClick={() => setPaused(!paused)} className="flex items-center gap-2 text-xs text-muted-foreground rounded-md p-2 hover:bg-secondary focus-visible:outline focus-visible:outline-primary">{paused ? <Play size={13} /> : <Pause size={13} />}{paused ? "Resume" : "Pause"}</button></div>
    <div ref={root} className="feature-marquee-window" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocus={() => setFocused(true)} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false); }}>
      {[0, 1].map(row => <div key={row} className="feature-marquee-track">{[0, 1].map(copy => <div className="feature-marquee-group" key={copy} aria-hidden={copy === 1 || row === 1 ? true : undefined}>{(row ? [...items].reverse() : items).map(({ icon: Icon, title, detail }) => <div key={title} className="marquee-feature-card bg-card border border-border/70"><Icon className="h-5 w-5 text-primary shrink-0" /><div><span className="block text-xs font-bold text-foreground">{title}</span><span className="block text-[10px] font-mono text-muted-foreground mt-1">{detail}</span></div></div>)}</div>)}</div>)}
    </div>
  </section>;
}

export function useLandingMotion() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        gsap.from(".hero-intro", { y: 45, opacity: 0, duration: .9, ease: "expo.out" });
        gsap.from(".portal-stage", { y: 60, opacity: 0, duration: 1, delay: .15, ease: "expo.out" });
        gsap.from(".portal-copy > *", { y: 20, opacity: 0, stagger: .09, duration: .7, delay: .4 });
        gsap.from(".dashboard-preview", { y: 40, rotate: 4, opacity: 0, duration: 1.1, delay: .5, ease: "expo.out", clearProps: "transform" });
        gsap.to(".hero-intro", { yPercent: -18, ease: "none", scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: 1 } });
        gsap.utils.toArray<HTMLElement>(".features-heading, .bento-reveal, .payment-editorial, .footer-invitation").forEach((element, index) => {
          gsap.from(element, { y: 55, opacity: .15, duration: 1, ease: "none", scrollTrigger: { trigger: element, start: "top 96%", end: "top 60%", scrub: .65 } });
        });
        gsap.from(".ai-manifesto p span", { opacity: .2, y: 16, stagger: .25, ease: "none", scrollTrigger: { trigger: ".ai-manifesto", start: "top 82%", end: "bottom 48%", scrub: .7 } });
        gsap.fromTo(".ledger-card", { y: 70, rotation: -14 }, { y: 0, rotation: -7, ease: "none", scrollTrigger: { trigger: ".payment-collage", start: "top bottom", end: "center 55%", scrub: .7 } });
        gsap.fromTo(".receipt-card", { y: 120, rotation: 12 }, { y: 0, rotation: 5, ease: "none", scrollTrigger: { trigger: ".payment-collage", start: "top 85%", end: "center 45%", scrub: .7 } });
        gsap.from(".ai-usecase-tabs button", { y: 35, opacity: .2, stagger: .12, ease: "none", scrollTrigger: { trigger: ".ai-usecases-grid", start: "top 92%", end: "top 55%", scrub: .7 } });
        gsap.from(".ai-proof-card", { y: 45, opacity: .2, ease: "none", scrollTrigger: { trigger: ".ai-usecases-grid", start: "top 92%", end: "top 55%", scrub: .7 } });
        gsap.from(".ai-usecases-heading", { y: 35, opacity: .2, ease: "none", scrollTrigger: { trigger: ".ai-usecases-heading", start: "top 95%", end: "top 62%", scrub: .7 } });
        gsap.from(".payment-stage-card", { y: 45, ease: "none", scrollTrigger: { trigger: ".payment-experience", start: "top bottom", end: "top 40%", scrub: .8 } });
        gsap.from(".footer-wordmark", { y: 50, opacity: .3, ease: "none", scrollTrigger: { trigger: ".footer-wordmark", start: "top 98%", end: "bottom 95%", scrub: .8 } });
        gsap.utils.toArray<HTMLElement>(".footer-portal-card").forEach((card, index, cards) => {
          if (index < cards.length - 1) gsap.to(card, { scale: .94,  transformOrigin: "center top", ease: "none", scrollTrigger: { trigger: cards[index + 1], start: "top 75%", end: "top 24%", scrub: .8 } });
        });
        gsap.from(".repair-flow i", { scaleX: 0, transformOrigin: "left", stagger: .25, duration: .8, scrollTrigger: { trigger: ".bento-maintenance", start: "top 80%", toggleActions: "play none none reverse" } });
      }, root);
      return () => ctx.revert();
    });
    return () => media.revert();
  }, []);
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const media = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    const selector = ".bento-tile, .live-dashboard, .workflow-console, .ai-proof-card, .ledger-card, .receipt-card, .payment-note, .footer-portal-card, .marquee-feature-card, .ai-usecase-tabs button";
    let current: HTMLElement | null = null;
    let frame = 0;
    function reset() {
      if (current) { current.style.setProperty("--tilt-angle", "0deg"); current.removeAttribute("data-tilting"); }
      current = null;
    }
    function move(event: PointerEvent) {
      if (!media.matches || event.pointerType !== "mouse") return;
      const card = event.target instanceof Element ? event.target.closest<HTMLElement>(selector) : null;
      if (card !== current) { reset(); current = card; }
      cancelAnimationFrame(frame);
      if (!card) return;
      const { clientX, clientY } = event;
      frame = requestAnimationFrame(() => {
        const box = card.getBoundingClientRect();
        const x = (clientX - box.left) / box.width - .5;
        const y = (clientY - box.top) / box.height - .5;
        card.style.setProperty("--tilt-axis-x", String(-y));
        card.style.setProperty("--tilt-axis-y", String(x));
        card.style.setProperty("--tilt-angle", `${Math.min(Math.hypot(x, y) * 14, 9)}deg`);
        card.style.setProperty("--pointer-x", `${(x + .5) * 100}%`);
        card.style.setProperty("--pointer-y", `${(y + .5) * 100}%`);
        card.setAttribute("data-tilting", "true");
      });
    }
    function leave() { cancelAnimationFrame(frame); reset(); }
    element.addEventListener("pointermove", move);
    element.addEventListener("pointerleave", leave);
    element.addEventListener("pointercancel", leave);
    media.addEventListener("change", leave);
    return () => { leave(); element.removeEventListener("pointermove", move); element.removeEventListener("pointerleave", leave); element.removeEventListener("pointercancel", leave); media.removeEventListener("change", leave); };
  }, []);
  return root;
}
