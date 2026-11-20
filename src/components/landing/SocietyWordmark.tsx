import { useEffect, useRef, useState, type PointerEvent } from "react";

type Glyph = { char: string; x: number; width: number };
type Spring = { x: number; y: number; r: number; vx: number; vy: number; vr: number };
const word = 'SOCIETYHUB';
const typeStyle = { fontFamily: 'inherit', fontSize: 170, fontWeight: 900, letterSpacing: '-0.025em' };

export function SocietyWordmark({ liquid = false }: { liquid?: boolean }) {
  const source = useRef<SVGTextElement>(null);
  const letters = useRef<(SVGGElement | null)[]>([]);
  const springs = useRef<Spring[]>([]);
  const pointer = useRef({ x: 0, y: 75, inside: false });
  const frame = useRef(0);
  const reduced = useRef(false);
  const [glyphs, setGlyphs] = useState<Glyph[]>([]);
  const glyphData = useRef<Glyph[]>([]);
  useEffect(() => {
    if (!liquid) return;
    let disposed = false;
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => { reduced.current = media.matches; if (media.matches) { pointer.current.inside = false; cancelAnimationFrame(frame.current); frame.current = 0; letters.current.forEach(el => el?.removeAttribute('transform')); springs.current.forEach(s => Object.assign(s, { x:0, y:0, r:0, vx:0, vy:0, vr:0 })); } };
    sync(); media.addEventListener('change', sync);
    document.fonts.ready.then(() => {
      if (disposed || !source.current) return;
      const node = source.current;
      const data = [...word].map((char, i) => ({ char, x: node.getStartPositionOfChar(i).x, width: node.getEndPositionOfChar(i).x - node.getStartPositionOfChar(i).x }));
      glyphData.current = data;
      springs.current = data.map(() => ({ x:0, y:0, r:0, vx:0, vy:0, vr:0 }));
      setGlyphs(data);
    });
    return () => { disposed = true; cancelAnimationFrame(frame.current); frame.current = 0; media.removeEventListener('change', sync); };
  }, [liquid]);
  function animate() {
    let moving = false;
    const mouse = pointer.current;
    glyphData.current.forEach((glyph, i) => {
      const s = springs.current[i];
      const center = glyph.x + glyph.width / 2;
      const dx = center - mouse.x;
      const influence = mouse.inside ? Math.max(0, 1 - Math.abs(dx) / 250) ** 2 : 0;
      const tx = Math.sign(dx || 1) * influence * 30;
      const ty = ((75 - mouse.y) * .42 + Math.sin(i * 1.8) * 27) * influence;
      const tr = Math.sign(dx || 1) * influence * 13;
      s.vx = (s.vx + (tx - s.x) * .075) * .79;
      s.vy = (s.vy + (ty - s.y) * .075) * .79;
      s.vr = (s.vr + (tr - s.r) * .075) * .79;
      s.x += s.vx; s.y += s.vy; s.r += s.vr;
      letters.current[i]?.setAttribute('transform', `translate(${s.x.toFixed(2)} ${s.y.toFixed(2)}) rotate(${s.r.toFixed(2)} ${center} 75)`);
      if (Math.abs(tx - s.x) + Math.abs(ty - s.y) + Math.abs(tr - s.r) + Math.abs(s.vx) + Math.abs(s.vy) > .05) moving = true;
    });
    frame.current = moving ? requestAnimationFrame(animate) : 0;
  }
  function start() { if (!frame.current && !reduced.current) frame.current = requestAnimationFrame(animate); }
  function move(event: PointerEvent<SVGSVGElement>) {
    if (!liquid || event.pointerType !== 'mouse' || reduced.current) return;
    const box = event.currentTarget.getBoundingClientRect();
    pointer.current = { x: (event.clientX - box.left) / box.width * 1100, y: (event.clientY - box.top) / box.height * 150, inside: true };
    start();
  }
  function leave() { pointer.current.inside = false; start(); }
  return <svg className={`society-wordmark ${liquid ? 'fluid-letter-wordmark' : ''}`} viewBox="0 0 1100 150" aria-hidden="true" focusable="false" onPointerMove={move} onPointerLeave={leave} onPointerCancel={leave}>
    <text ref={source} x="0" y="132" textLength="1100" lengthAdjust="spacingAndGlyphs" fill="currentColor" style={{ ...typeStyle, opacity: liquid && glyphs.length ? 0 : 1 }}>{word}</text>
    {liquid && glyphs.map((glyph, i) => <g key={i} ref={el => { letters.current[i] = el; }} className="fluid-letter"><text x={glyph.x} y="132" textLength={glyph.width} lengthAdjust="spacingAndGlyphs" fill="currentColor" style={typeStyle}>{glyph.char}</text></g>)}
  </svg>;
}
