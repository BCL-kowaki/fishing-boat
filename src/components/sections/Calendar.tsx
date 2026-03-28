"use client";

import { useState, useMemo } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import scheduleData from "@/data/schedule.json";

type ScheduleStatus = "available" | "booked";
const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

function getDaysInMonth(y: number, m: number) {
  return new Date(y, m + 1, 0).getDate();
}
function getFirstDayOfWeek(y: number, m: number) {
  return new Date(y, m, 1).getDay();
}
function formatKey(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

export default function Calendar() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const schedule = scheduleData as Record<string, ScheduleStatus>;

  const { days, offset } = useMemo(
    () => ({
      days: getDaysInMonth(year, month),
      offset: getFirstDayOfWeek(year, month),
    }),
    [year, month]
  );

  const prev = () => {
    if (month === 0) { setYear((y) => y - 1); setMonth(11); }
    else setMonth((m) => m - 1);
  };
  const next = () => {
    if (month === 11) { setYear((y) => y + 1); setMonth(0); }
    else setMonth((m) => m + 1);
  };

  return (
    <section id="calendar" className="py-[clamp(2.5rem,8vw,9.375rem)] px-5 bg-bg-alt">
      <div className="max-w-[700px] mx-auto">
        <SectionHeader
          label="Schedule"
          title="出船カレンダー"
          description="空き状況をご確認ください。予約はお電話にて承ります。"
        />

        <div className="bg-white p-5 sm:p-10 border border-border">
          {/* Month nav */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-serif text-lg tracking-[0.08em] text-black">
              {year}年 {month + 1}月
            </h3>
            <div className="flex gap-2">
              <button onClick={prev} className="w-9 h-9 border border-border flex items-center justify-center text-muted text-xs hover:bg-bg-alt transition-colors" aria-label="前月">◀</button>
              <button onClick={next} className="w-9 h-9 border border-border flex items-center justify-center text-muted text-xs hover:bg-bg-alt transition-colors" aria-label="次月">▶</button>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-7 gap-1">
            {WEEKDAYS.map((d) => (
              <div key={d} className="text-center text-[0.6rem] sm:text-[0.65rem] font-medium text-muted py-2 tracking-[0.1em]">
                {d}
              </div>
            ))}
            {Array.from({ length: offset }).map((_, i) => (
              <div key={`e-${i}`} />
            ))}
            {Array.from({ length: days }).map((_, i) => {
              const day = i + 1;
              const status = schedule[formatKey(year, month, day)];
              let style = "text-black hover:bg-bg-alt";
              let badge = "";
              if (status === "available") {
                style = "bg-primary/5 text-primary font-medium";
                badge = "◎";
              } else if (status === "booked") {
                style = "bg-red-50 text-red-400";
                badge = "満";
              }
              return (
                <div key={day} className={`aspect-square flex flex-col items-center justify-center text-xs sm:text-sm transition-colors cursor-pointer gap-0.5 ${style}`}>
                  {day}
                  {badge && <span className="text-[0.45rem] sm:text-[0.5rem]">{badge}</span>}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex gap-5 mt-6 justify-center">
            <span className="flex items-center gap-1.5 text-[0.65rem] text-muted">
              <span className="w-2.5 h-2.5 bg-primary/20" /> 空きあり
            </span>
            <span className="flex items-center gap-1.5 text-[0.65rem] text-muted">
              <span className="w-2.5 h-2.5 bg-red-100" /> 満船
            </span>
            <span className="flex items-center gap-1.5 text-[0.65rem] text-muted">
              <span className="w-2.5 h-2.5 bg-gray-100" /> 要問い合わせ
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
