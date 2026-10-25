import Link from "next/link";

import { DesktopNav } from "@/components/layout/desktop-nav";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Container } from "@/components/shared/container";
import { getEnabledSections } from "@/config/navigation";
import { siteConfig } from "@/config/site";

export function SiteHeader() {
  const items = getEnabledSections();
  const navItems = items.map(({ id, label, anchor }) => ({
    id,
    label,
    anchor,
  }));

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Link
          href="/"
          className="rounded-sm font-mono text-sm tracking-tight transition-colors hover:text-accent"
        >
          {siteConfig.name}
        </Link>
        {items.length > 0 && <DesktopNav items={navItems} />}
        <MobileNav items={navItems} />
      </Container>
    </header>
  );
}
