import { useEffect, useRef, useState } from "react";

interface Point {
  x: number;
  y: number;
}

export function LiquidCursorBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef<Point>({ x: -200, y: -200 });
  const targetRef = useRef<Point>({ x: -200, y: -200 });

  // 4 Fluid droplets with staggered elasticity
  const dropletsRef = useRef<
    { x: number; y: number; vx: number; vy: number; size: number; color: string }[]
  >([
    { x: -200, y: -200, vx: 0, vy: 0, size: 280, color: "rgba(254, 240, 138, 0.45)" }, // butter yellow
    { x: -200, y: -200, vx: 0, vy: 0, size: 240, color: "rgba(56, 189, 248, 0.35)" },  // cyan
    { x: -200, y: -200, vx: 0, vy: 0, size: 210, color: "rgba(129, 140, 248, 0.35)" }, // indigo
    { x: -200, y: -200, vx: 0, vy: 0, size: 170, color: "rgba(52, 211, 153, 0.35)" },  // emerald
  ]);

  const [hasInteracted, setHasInteracted] = useState(false);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    let animId: number;
    let isMoving = false;
    let idleTimer: any = null;

    const handleMouseMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
      if (!hasInteracted) {
        setHasInteracted(true);
        // Initialize droplets at cursor on first move
        dropletsRef.current.forEach((d) => {
          d.x = e.clientX;
          d.y = e.clientY;
        });
      }
      isMoving = true;
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        isMoving = false;
      }, 2000);
    };

    const handleClick = (e: MouseEvent) => {
      const id = Date.now();
      setRipples((prev) => [...prev.slice(-3), { id, x: e.clientX, y: e.clientY }]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 1000);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("click", handleClick, { passive: true });

    // Smooth physics loop
    const springWeights = [0.18, 0.12, 0.08, 0.05];
    const elements = containerRef.current?.children;

    const animate = () => {
      const target = targetRef.current;
      const droplets = dropletsRef.current;

      droplets.forEach((droplet, i) => {
        // Follow target or previous droplet with spring lag
        const lead = i === 0 ? target : droplets[i - 1];
        const weight = springWeights[i];

        droplet.x += (lead.x - droplet.x) * weight;
        droplet.y += (lead.y - droplet.y) * weight;

        if (elements && elements[i]) {
          const el = elements[i] as HTMLElement;
          const offset = droplet.size / 2;
          el.style.transform = `translate3d(${droplet.x - offset}px, ${droplet.y - offset}px, 0)`;
        }
      });

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
      cancelAnimationFrame(animId);
      clearTimeout(idleTimer);
    };
  }, [hasInteracted]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* SVG Gooey Liquid Filter Definition */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          <filter id="liquid-cursor-goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="36" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="
                1 0 0 0 0
                0 1 0 0 0
                0 0 1 0 0
                0 0 0 28 -10"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      {/* Liquid Metaballs Container with Liquid Goo Filter */}
      <div
        ref={containerRef}
        className="absolute inset-0 w-full h-full opacity-60 dark:opacity-35 transition-opacity duration-700"
        style={{
          filter: "url(#liquid-cursor-goo)",
        }}
      >
        {dropletsRef.current.map((d, i) => (
          <div
            key={i}
            className="absolute top-0 left-0 rounded-full will-change-transform"
            style={{
              width: `${d.size}px`,
              height: `${d.size}px`,
              background: `radial-gradient(circle at 35% 35%, ${d.color}, transparent 70%)`,
              opacity: 0.9,
            }}
          />
        ))}
      </div>

      {/* Expanding Click Ripples */}
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="absolute rounded-full border border-primary/30 pointer-events-none animate-ping"
          style={{
            left: `${ripple.x - 40}px`,
            top: `${ripple.y - 40}px`,
            width: "80px",
            height: "80px",
            animationDuration: "800ms",
          }}
        />
      ))}
    </div>
  );
}
