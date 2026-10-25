"use client";

import { useEffect, useRef } from "react";

import { backgroundEffect, theme } from "@/config/theme";
import {
  createParticles,
  hexToRgbTriplet,
  linkStrength,
  particleCount,
  stepParticle,
  type Particle,
} from "@/lib/particles";

const rgb = hexToRgbTriplet(theme.accent) ?? "124 134 255";

/**
 * Subtle particle network behind the page.
 *
 * - Decorative only: `aria-hidden`, no pointer events.
 * - Pauses while the tab is hidden; one static frame under
 *   `prefers-reduced-motion`.
 * - Particle count scales with screen area and is capped (see theme.ts).
 */
export function NeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const { linkDistance, pointerDistance, dotOpacity, lineOpacity } =
      backgroundEffect;

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let frameId = 0;
    let lastTime = 0;
    const pointer = { x: -9999, y: -9999 };

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const strength = linkStrength(
            Math.hypot(a.x - b.x, a.y - b.y),
            linkDistance,
          );
          if (strength === 0) continue;
          ctx.strokeStyle = `rgb(${rgb} / ${(strength * lineOpacity).toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
        const toPointer = linkStrength(
          Math.hypot(a.x - pointer.x, a.y - pointer.y),
          pointerDistance,
        );
        if (toPointer > 0) {
          ctx.strokeStyle = `rgb(${rgb} / ${(toPointer * 0.45).toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(pointer.x, pointer.y);
          ctx.stroke();
        }
      }

      ctx.fillStyle = `rgb(${rgb} / ${dotOpacity})`;
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function resize() {
      if (!canvas || !ctx) return;
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.lineWidth = 1;
      particles = createParticles(
        particleCount(width, height, { max: backgroundEffect.maxParticles }),
        width,
        height,
      );
      draw();
    }

    function frame(time: number) {
      const dt = lastTime ? Math.min((time - lastTime) / 16.67, 3) : 1;
      lastTime = time;
      for (const p of particles) stepParticle(p, width, height, dt);
      draw();
      frameId = requestAnimationFrame(frame);
    }

    function start() {
      if (frameId || reducedMotion.matches || document.hidden) return;
      lastTime = 0;
      frameId = requestAnimationFrame(frame);
    }

    function stop() {
      cancelAnimationFrame(frameId);
      frameId = 0;
    }

    function onVisibility() {
      if (document.hidden) stop();
      else start();
    }

    function onMotionChange() {
      if (reducedMotion.matches) {
        stop();
        draw();
      } else start();
    }

    function onPointerMove(event: PointerEvent) {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    }

    function onPointerLeave() {
      pointer.x = pointer.y = -9999;
    }

    let resizeTimer = 0;
    function onResize() {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resize, 150);
    }

    resize();
    start();

    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("visibilitychange", onVisibility);
    reducedMotion.addEventListener("change", onMotionChange);

    return () => {
      stop();
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener(
        "pointerleave",
        onPointerLeave,
      );
      document.removeEventListener("visibilitychange", onVisibility);
      reducedMotion.removeEventListener("change", onMotionChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 size-full"
    />
  );
}
