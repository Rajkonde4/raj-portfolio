"use client";

import { Container } from "@/components/shared/container";

export default function ErrorPage({ retry }: { retry: () => void }) {
  return (
    <Container className="pt-32">
      <p className="font-mono text-xs tracking-[0.2em] text-accent uppercase">
        Something went wrong
      </p>
      <h1 className="mt-4 font-serif text-5xl tracking-tight">
        This page failed to load.
      </h1>
      <p className="mt-4 max-w-lg text-muted">
        An unexpected error occurred. You can try again, or return to the home
        page.
      </p>
      <button
        type="button"
        onClick={() => retry()}
        className="mt-8 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
      >
        Try again
      </button>
    </Container>
  );
}
