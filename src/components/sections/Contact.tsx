"use client";

import SectionHeader from "@/components/ui/SectionHeader";
import { PHONE_NUMBER, PHONE_TEL, INSTAGRAM_HANDLE, INSTAGRAM_URL } from "@/lib/constants";

export default function Contact() {
  return (
    <section id="contact" className="py-[clamp(2.5rem,8vw,9.375rem)] px-5 bg-white">
      <div className="max-w-[1130px] mx-auto">
        <SectionHeader
          label="Contact"
          title="ご予約・お問い合わせ"
          description="ご予約は電話が確実です。フォームからもお気軽にどうぞ。"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Left — dark info panel */}
          <div className="bg-black text-white p-8 sm:p-14 flex flex-col justify-center">
            <h3 className="font-sans text-xl sm:text-2xl tracking-[0.08em] mb-6 leading-[1.6]">
              まずはお気軽に
              <br />
              お電話ください
            </h3>
            <p className="text-white/40 text-sm leading-[2] mb-10">
              ご予約、空き状況の確認、ご質問など
              何でもお気軽にお問い合わせください。
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <span className="text-primary text-xs tracking-[0.15em]">TEL</span>
                <a href={PHONE_TEL} className="text-lg sm:text-xl font-sans tracking-[0.1em] hover:text-primary transition-colors">
                  {PHONE_NUMBER}
                </a>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-primary text-xs tracking-[0.15em]">IG</span>
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="font-sans tracking-[0.05em] hover:text-primary transition-colors">
                  {INSTAGRAM_HANDLE}
                </a>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-primary text-xs tracking-[0.15em]">LINE</span>
                <span className="text-white/30 text-sm">※確認中</span>
              </div>
            </div>
          </div>

          {/* Right — form */}
          <div className="bg-bg-alt p-8 sm:p-14 flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[0.7rem] text-muted tracking-[0.1em]">お名前</label>
                <input type="text" placeholder="山田 太郎" className="px-4 py-3 border border-border bg-white text-sm outline-none focus:border-primary transition-colors" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[0.7rem] text-muted tracking-[0.1em]">電話番号</label>
                <input type="tel" placeholder="090-0000-0000" className="px-4 py-3 border border-border bg-white text-sm outline-none focus:border-primary transition-colors" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[0.7rem] text-muted tracking-[0.1em]">メールアドレス</label>
              <input type="email" placeholder="example@email.com" className="px-4 py-3 border border-border bg-white text-sm outline-none focus:border-primary transition-colors" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[0.7rem] text-muted tracking-[0.1em]">希望日</label>
                <input type="date" className="px-4 py-3 border border-border bg-white text-sm outline-none focus:border-primary transition-colors" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[0.7rem] text-muted tracking-[0.1em]">コース</label>
                <select className="px-4 py-3 border border-border bg-white text-sm outline-none focus:border-primary transition-colors">
                  <option>内之浦（乗合）</option>
                  <option>種子島（乗合）</option>
                  <option>チャーター</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[0.7rem] text-muted tracking-[0.1em]">人数</label>
              <select className="px-4 py-3 border border-border bg-white text-sm outline-none focus:border-primary transition-colors">
                <option>1名</option><option>2名</option><option>3名</option><option>4名</option><option>5名以上</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[0.7rem] text-muted tracking-[0.1em]">メッセージ</label>
              <textarea placeholder="ご質問やご要望をご記入ください" className="px-4 py-3 border border-border bg-white text-sm outline-none focus:border-primary transition-colors min-h-[100px] resize-y" />
            </div>
            <button type="button" className="btn-tcd w-full leading-[50px] sm:leading-[60px] text-sm border border-black text-black tracking-[0.15em] mt-2">
              SEND
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
