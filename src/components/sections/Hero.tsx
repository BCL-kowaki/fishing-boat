export default function Hero() {
  return (
    <section
      id="top"
      className="relative h-screen min-h-[500px] max-h-[1000px] bg-black overflow-hidden flex items-center justify-center"
    >
      {/* Background video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/mv.mp4" type="video/mp4" />
      </video>

      {/* Overlay — 視認性確保 */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Bottom gradient — さらに下部を暗く */}
      <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-gradient-to-t from-black/70 to-transparent" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-[800px]">
        <p className="text-primary text-[0.7rem] sm:text-[0.75rem] tracking-[0.25em] uppercase mb-6 sm:mb-8">
          鹿児島 東串良 波見港
        </p>

        <h1 className="font-serif text-white text-[clamp(1.8rem,5vw,3.5rem)] font-semibold leading-[1.4] tracking-[0.1em] mb-6 sm:mb-8 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
          大物を、その手に。
        </h1>

        <p className="text-white/70 text-sm sm:text-base leading-[2] tracking-[0.05em] mb-10 sm:mb-12 max-w-[500px] mx-auto drop-shadow-[0_1px_4px_rgba(0,0,0,0.4)]">
          泳がせ・ジギングで、大型カンパチ・大型底物を
          メインに狙う遊漁船ヤマトです。
        </p>

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
