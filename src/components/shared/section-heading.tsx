interface SectionHeadingProps {
  id: string;
  eyebrow: string;
  title: string;
}

export function SectionHeading({ id, eyebrow, title }: SectionHeadingProps) {
  return (
    <div className="scroll-reveal mb-10 sm:mb-14">
      <p className="font-mono text-xs tracking-[0.2em] text-accent uppercase">
        {eyebrow}
      </p>
      <h2
        id={id}
        className="mt-3 font-serif text-4xl tracking-tight sm:text-5xl"
      >
        {title}
      </h2>
    </div>
  );
}
