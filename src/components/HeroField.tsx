import { useEffect, useRef, type RefObject } from 'react';

/**
 * A quiet generative "ontology graph" behind the hero: small square nodes
 * drifting slowly, with hairline links between near neighbours. Ink colour is
 * read from the band's `--text` so it follows whatever band it sits in.
 *
 * Nodes ease away from the pointer. The pointer is tracked on `hostRef` (the
 * section) because the canvas itself ignores pointer events. Pauses when
 * offscreen or the tab is hidden; draws a single static frame under reduced
 * motion. No allocations inside the frame loop (opacity via globalAlpha).
 */
export function HeroField({ hostRef }: { hostRef: RefObject<HTMLElement> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = hostRef.current;
    if (!canvas || !host) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const MAX = 90;
    const xs = new Float32Array(MAX);
    const ys = new Float32Array(MAX);
    const vxs = new Float32Array(MAX);
    const vys = new Float32Array(MAX);
    let count = 0;
    let width = 0;
    let height = 0;
    let linkDist = 140;
    let inkSolid = 'rgb(30, 33, 36)';

    const pointer = { x: -9999, y: -9999, active: false };

    const readInk = () => {
      const raw = getComputedStyle(canvas).getPropertyValue('--text').trim();
      const probe = raw || getComputedStyle(canvas).color;
      const triplet = toRgbTriplet(probe);
      if (triplet) inkSolid = `rgb(${triplet})`;
    };

    const seed = () => {
      // Density scales with area: ~60 on a phone, ~90 on a wide desktop.
      count = Math.max(48, Math.min(MAX, Math.round((width * height) / 14000)));
      linkDist = Math.max(110, Math.min(170, width / 9));
      for (let i = 0; i < count; i++) {
        xs[i] = Math.random() * width;
        ys[i] = Math.random() * height;
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.06 + Math.random() * 0.12;
        vxs[i] = Math.cos(angle) * speed;
        vys[i] = Math.sin(angle) * speed;
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const nextW = Math.max(1, Math.round(rect.width));
      const nextH = Math.max(1, Math.round(rect.height));
      const first = width === 0;
      const sx = first ? 1 : nextW / width;
      const sy = first ? 1 : nextH / height;
      width = nextW;
      height = nextH;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (first) {
        seed();
      } else {
        for (let i = 0; i < count; i++) {
          xs[i] *= sx;
          ys[i] *= sy;
        }
      }
      readInk();
      draw();
    };

    const step = () => {
      const repel = 120;
      const repel2 = repel * repel;
      for (let i = 0; i < count; i++) {
        let x = xs[i] + vxs[i];
        let y = ys[i] + vys[i];
        if (pointer.active) {
          const dx = x - pointer.x;
          const dy = y - pointer.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < repel2 && d2 > 0.01) {
            const d = Math.sqrt(d2);
            const force = (1 - d / repel) * 1.6;
            x += (dx / d) * force;
            y += (dy / d) * force;
          }
        }
        // Wrap around the edges with a small margin so nodes never pop.
        if (x < -10) x = width + 10;
        else if (x > width + 10) x = -10;
        if (y < -10) y = height + 10;
        else if (y > height + 10) y = -10;
        xs[i] = x;
        ys[i] = y;
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const link2 = linkDist * linkDist;
      ctx.lineWidth = 1;
      ctx.strokeStyle = inkSolid;
      for (let i = 0; i < count; i++) {
        for (let j = i + 1; j < count; j++) {
          const dx = xs[i] - xs[j];
          const dy = ys[i] - ys[j];
          const d2 = dx * dx + dy * dy;
          if (d2 > link2) continue;
          ctx.globalAlpha = (1 - Math.sqrt(d2) / linkDist) * 0.08;
          ctx.beginPath();
          ctx.moveTo(xs[i], ys[i]);
          ctx.lineTo(xs[j], ys[j]);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 0.14;
      ctx.fillStyle = inkSolid;
      for (let i = 0; i < count; i++) {
        ctx.fillRect(Math.round(xs[i]) - 1, Math.round(ys[i]) - 1, 2, 2);
      }
      ctx.globalAlpha = 1;
    };

    let raf = 0;
    let visible = false;
    const loop = () => {
      step();
      draw();
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (reduce || raf || !visible || document.hidden) return;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(canvas);

    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVisibility);

    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active = true;
    };
    const onLeave = () => {
      pointer.active = false;
    };
    if (!reduce) {
      host.addEventListener('pointermove', onMove, { passive: true });
      host.addEventListener('pointerleave', onLeave);
    }

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerleave', onLeave);
    };
  }, [hostRef]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full text-[var(--text)]"
    />
  );
}

/** "#1e2124", "#fff" or "rgb(30, 33, 36)" → "30, 33, 36". */
function toRgbTriplet(value: string): string | null {
  const v = value.trim();
  if (v.startsWith('#')) {
    let hex = v.slice(1);
    if (hex.length === 3) hex = hex.split('').map((c) => c + c).join('');
    if (hex.length < 6) return null;
    const n = parseInt(hex.slice(0, 6), 16);
    if (Number.isNaN(n)) return null;
    return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
  }
  const match = v.match(/rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/);
  return match ? `${match[1]}, ${match[2]}, ${match[3]}` : null;
}
