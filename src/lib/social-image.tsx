import { ImageResponse } from "next/og";

import { siteConfig } from "@/config/site";
import { theme } from "@/config/theme";

export const SOCIAL_IMAGE_SIZE = { width: 1200, height: 630 } as const;

/**
 * 1200x630 link-preview card shown when the site is shared on LinkedIn,
 * WhatsApp, X and similar. Built from the site config, so it updates when
 * you change your name or role. Used by opengraph-image.tsx and
 * twitter-image.tsx in src/app.
 */
export function renderSocialImage() {
  const { name, roles, location, headline } = siteConfig;
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: theme.background,
        color: "#e8e9ee",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 28,
          letterSpacing: 6,
          textTransform: "uppercase",
          color: theme.accent,
        }}
      >
        {[roles[0], location].filter(Boolean).join("  /  ")}
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", fontSize: 128, lineHeight: 1 }}>
          {name}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 32,
            fontSize: 36,
            lineHeight: 1.3,
            color: "#9a9db0",
            maxWidth: 940,
          }}
        >
          {headline}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          height: 4,
          width: 160,
          background: theme.accent,
        }}
      />
    </div>,
    SOCIAL_IMAGE_SIZE,
  );
}
