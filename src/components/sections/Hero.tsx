export default function Hero() {
  return (
    <section
      id="top"
      className="relative h-screen min-h-[500px] max-h-[1000px] bg-black overflow-hidden flex items-center justify-center"
    >
      {/* Background image placeholder with overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a1a2e] via-[#1a2a3e] to-[#0a0a0a]" />
      <div className="absolute inset-0 bg-black/40" />
      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-gradient-to-t from-black/80 to-transparent" />

      {/* Content — centered like TCD */}
      <div className="relative z-10 text-center px-6 max-w-[800px]">
        {/* Sub label */}
        <p className="text-primary text-[0.7rem] sm:text-[0.75rem] tracking-[0.25em] uppercase mb-6 sm:mb-8">
          鹿児島 東串良 波見港
        </p>

        {/* Main copy */}
        <h1 className="font-serif text-white text-[clamp(1.8rem,5vw,3.5rem)] font-semibold leading-[1.4] tracking-[0.1em] mb-6 sm:mb-8">
          大物を、その手に。
        </h1>

        {/* Description */}
        <p className="text-white/60 text-sm sm:text-base leading-[2] tracking-[0.05em] mb-10 sm:mb-12 max-w-[500px] mx-auto">
          泳がせ・ジギングで、大型カンパチ・大型底物を
          メインに狙う遊漁船ヤマトです。
        </p>

        {/* CTA — TCD style button */}
        <a
          href="#contact"
          className="btn-tcd inline-block w-[240px] sm:w-[270px] leading-[50px] sm:leading-[60px] text-sm sm:text-base border border-white/80 text-white tracking-[0.15em]"
        >
          RESERVATION
        </a>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
        <span className="text-white/40 text-[0.6rem] tracking-[0.2em]">
          SCROLL
        </span>
        <span className="block w-px h-8 bg-white/30 animate-bounce-down" />
      </div>
    </section>
  );
}
