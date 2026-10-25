import Link from "next/link";

import { Container } from "@/components/shared/container";

export default function NotFound() {
  return (
    <Container className="pt-32">
      <p className="font-mono text-xs tracking-[0.2em] text-accent uppercase">
        404
      </p>
      <h1 className="mt-4 font-serif text-5xl tracking-tight">
        Page not found.
      </h1>
      <p className="mt-4 max-w-lg text-muted">
        The page you are looking for does not exist or has not been published
        yet.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
      >
        Back to home
      </Link>
    </Container>
  );
}
