import { PHONE_NUMBER, PHONE_TEL } from "@/lib/constants";

export default function Topbar() {
  return (
    <div className="bg-black text-white/60 text-[0.65rem] tracking-[0.15em] py-2 text-center">
      <a href={PHONE_TEL} className="hover:text-primary transition-colors">
        TEL {PHONE_NUMBER}
      </a>
    </div>
  );
}
