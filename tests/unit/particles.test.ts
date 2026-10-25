import { describe, expect, it } from "vitest";

import {
  createParticles,
  hexToRgbTriplet,
  linkStrength,
  particleCount,
  stepParticle,
} from "@/lib/particles";

describe("particleCount", () => {
  it("scales with area but stays within bounds", () => {
    expect(particleCount(360, 640)).toBeLessThan(particleCount(1920, 1080));
    expect(particleCount(100, 100)).toBe(14);
    expect(particleCount(10_000, 10_000)).toBe(90);
  });

  it("respects a custom maximum", () => {
    expect(particleCount(10_000, 10_000, { max: 40 })).toBe(40);
  });
});

describe("createParticles", () => {
  it("creates the requested number inside the bounds", () => {
    const particles = createParticles(50, 800, 600);
    expect(particles).toHaveLength(50);
    for (const p of particles) {
      expect(p.x).toBeGreaterThanOrEqual(0);
      expect(p.x).toBeLessThanOrEqual(800);
      expect(p.y).toBeGreaterThanOrEqual(0);
      expect(p.y).toBeLessThanOrEqual(600);
    }
  });

  it("is deterministic with an injected random source", () => {
    const fixed = () => 0.5;
    expect(createParticles(1, 100, 100, fixed)[0]).toEqual({
      x: 50,
      y: 50,
      vx: 0,
      vy: 0,
    });
  });
});

describe("stepParticle", () => {
  it("moves by velocity times dt", () => {
    const p = { x: 10, y: 10, vx: 1, vy: -2 };
    stepParticle(p, 100, 100, 2);
    expect(p).toMatchObject({ x: 12, y: 6 });
  });

  it("bounces off edges and stays inside", () => {
    const p = { x: 99, y: 1, vx: 5, vy: -5 };
    stepParticle(p, 100, 100, 1);
    expect(p.x).toBe(100);
    expect(p.y).toBe(0);
    expect(p.vx).toBe(-5);
    expect(p.vy).toBe(5);
  });
});

describe("linkStrength", () => {
  it("fades linearly and is zero at and beyond the maximum", () => {
    expect(linkStrength(0, 100)).toBe(1);
    expect(linkStrength(50, 100)).toBe(0.5);
    expect(linkStrength(100, 100)).toBe(0);
    expect(linkStrength(250, 100)).toBe(0);
  });
});

describe("hexToRgbTriplet", () => {
  it("converts valid hex and rejects anything else", () => {
    expect(hexToRgbTriplet("#7c86ff")).toBe("124 134 255");
    expect(hexToRgbTriplet("7c86ff")).toBeNull();
    expect(hexToRgbTriplet("#fff")).toBeNull();
  });
});
