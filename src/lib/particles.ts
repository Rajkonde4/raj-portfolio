/**
 * Pure helpers for the background animation. Kept free of DOM access so they
 * can be unit tested (tests/unit/particles.test.ts).
 */

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

/** More area gets more particles, within [min, max], so phones stay light. */
export function particleCount(
  width: number,
  height: number,
  { max = 90, areaPerParticle = 16000, min = 14 } = {},
): number {
  const count = Math.round((width * height) / areaPerParticle);
  return Math.min(max, Math.max(min, count));
}

export function createParticles(
  count: number,
  width: number,
  height: number,
  random: () => number = Math.random,
  maxSpeed = 0.25,
): Particle[] {
  return Array.from({ length: count }, () => ({
    x: random() * width,
    y: random() * height,
    vx: (random() - 0.5) * 2 * maxSpeed,
    vy: (random() - 0.5) * 2 * maxSpeed,
  }));
}

/** Advance one particle by `dt` frames (1 = 16.7ms), bouncing at the edges. */
export function stepParticle(
  p: Particle,
  width: number,
  height: number,
  dt: number,
): void {
  p.x += p.vx * dt;
  p.y += p.vy * dt;
  if (p.x < 0 || p.x > width) {
    p.vx *= -1;
    p.x = Math.min(width, Math.max(0, p.x));
  }
  if (p.y < 0 || p.y > height) {
    p.vy *= -1;
    p.y = Math.min(height, Math.max(0, p.y));
  }
}

/** 1 when touching, fading linearly to 0 at `maxDistance`. */
export function linkStrength(distance: number, maxDistance: number): number {
  if (distance >= maxDistance) return 0;
  return 1 - distance / maxDistance;
}

/** "#7c86ff" to "124 134 255". Returns null for anything else. */
export function hexToRgbTriplet(hex: string): string | null {
  const match = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!match) return null;
  const n = parseInt(match[1], 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}
