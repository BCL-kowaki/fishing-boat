type Props = {
  label: string;
  title: string;
  description?: string;
  light?: boolean;
  center?: boolean;
};

export default function SectionHeader({
  label,
  title,
  description,
  light = false,
  center = true,
}: Props) {
  return (
    <div className={center ? "text-center" : ""}>
      <span
        className={`block text-[0.7rem] sm:text-[0.75rem] tracking-[0.2em] uppercase mb-4 ${
          light ? "text-primary" : "text-primary"
        }`}
      >
        {label}
      </span>
      <h2
        className={`font-serif font-semibold mb-6 text-[clamp(1.25rem,3vw,2.125rem)] leading-[1.5] tracking-[0.08em] ${
          light ? "text-white" : "text-black"
        }`}
      >
        {title}
      </h2>
      {/* Accent line */}
      <div
        className={`w-10 h-px bg-primary mb-8 ${center ? "mx-auto" : ""}`}
      />
      {description && (
        <p
          className={`text-sm leading-[2] max-w-[600px] mb-12 ${
            center ? "mx-auto" : ""
          } ${light ? "text-white/60" : "text-muted"}`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
