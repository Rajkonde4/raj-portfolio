import { describe, expect, it } from "vitest";

import { formatMonth, formatRange } from "@/lib/format";

describe("formatMonth", () => {
  it("formats YYYY-MM", () => {
    expect(formatMonth("2026-05")).toBe("May 2026");
    expect(formatMonth("2024-12")).toBe("Dec 2024");
  });

  it("leaves other input unchanged", () => {
    expect(formatMonth("soon")).toBe("soon");
    expect(formatMonth("2026-13")).toBe("2026-13");
  });
});

describe("formatRange", () => {
  it("joins start and end", () => {
    expect(formatRange("2026-05", "2026-08")).toBe("May 2026 – Aug 2026");
  });

  it("supports an open-ended range", () => {
    expect(formatRange("2026-05", "present")).toBe("May 2026 – Present");
    expect(formatRange(undefined, "present")).toBe("Present");
  });

  it("collapses identical months", () => {
    expect(formatRange("2026-05", "2026-05")).toBe("May 2026");
  });

  it("shows only the start when there is no end", () => {
    expect(formatRange("2026-05")).toBe("May 2026");
  });

  it("returns undefined when there are no dates", () => {
    expect(formatRange()).toBeUndefined();
  });
});
