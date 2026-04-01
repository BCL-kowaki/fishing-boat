"use client";

import { useState, useEffect, useMemo } from "react";

type ScheduleStatus = "available" | "booked";
type MonthSchedule = Record<string, ScheduleStatus | undefined>;

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
function formatMonth(y: number, m: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}`;
}

export default function CalendarAdmin() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [schedule, setSchedule] = useState<MonthSchedule>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const { days, offset } = useMemo(
    () => ({
      days: getDaysInMonth(year, month),
      offset: getFirstDayOfWeek(year, month),
    }),
    [year, month]
  );

  // 月変更時にデータ取得
  useEffect(() => {
    const ym = formatMonth(year, month);
    fetch(`/api/schedule?month=${ym}`)
      .then((r) => r.json())
      .then((data) => setSchedule(data));
    setSaved(false);
  }, [year, month]);

  const prev = () => {
    if (month === 0) { setYear((y) => y - 1); setMonth(11); }
    else setMonth((m) => m - 1);
  };
  const next = () => {
    if (month === 11) { setYear((y) => y + 1); setMonth(0); }
    else setMonth((m) => m + 1);
  };

  // クリックで3状態サイクル: なし → available → booked → なし
  const toggleDay = (day: number) => {
    const key = formatKey(year, month, day);
    const current = schedule[key];
    let next: ScheduleStatus | undefined;
    if (!current) next = "available";
    else if (current === "available") next = "booked";
    else next = undefined;

    setSchedule((prev) => {
      const updated = { ...prev };
      if (next) {
        updated[key] = next;
      } else {
        delete updated[key];
      }
      return updated;
    });
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const ym = formatMonth(year, month);
    await fetch("/api/schedule", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ month: ym, schedule }),
    });
    setSaving(false);
    setSaved(true);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-black tracking-[0.05em] mb-8">
        カレンダー管理
      </h1>

      <div className="bg-white border border-gray-200 p-5 sm:p-8 max-w-[600px]">
        {/* Month nav */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold tracking-[0.05em] text-black">
            {year}年 {month + 1}月
          </h3>
          <div className="flex gap-2">
            <button onClick={prev} className="w-9 h-9 border border-gray-200 flex items-center justify-center text-gray-500 text-xs hover:bg-gray-50 transition-colors">◀</button>
            <button onClick={next} className="w-9 h-9 border border-gray-200 flex items-center justify-center text-gray-500 text-xs hover:bg-gray-50 transition-colors">▶</button>
          </div>
        </div>

        <p className="text-xs text-gray-400 mb-4">
          日付をクリック: なし → 空きあり → 満船 → なし
        </p>

        {/* Grid */}
        <div className="grid grid-cols-7 gap-1">
          {WEEKDAYS.map((d) => (
            <div key={d} className="text-center text-[0.65rem] font-bold text-gray-400 py-2">
              {d}
            </div>
          ))}
          {Array.from({ length: offset }).map((_, i) => (
            <div key={`e-${i}`} />
          ))}
          {Array.from({ length: days }).map((_, i) => {
            const day = i + 1;
            const key = formatKey(year, month, day);
            const status = schedule[key];

            let bg = "bg-white hover:bg-gray-50 border border-gray-100";
            let text = "text-gray-600";
            let badge = "";

            if (status === "available") {
              bg = "bg-green-50 border border-green-200";
              text = "text-green-700 font-bold";
              badge = "◎ 空き";
            } else if (status === "booked") {
              bg = "bg-red-50 border border-red-200";
              text = "text-red-500";
              badge = "満船";
            }

            return (
              <button
                key={day}
                onClick={() => toggleDay(day)}
                className={`aspect-square flex flex-col items-center justify-center text-xs transition-colors cursor-pointer gap-0.5 ${bg} ${text}`}
              >
                <span>{day}</span>
                {badge && <span className="text-[0.5rem]">{badge}</span>}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex gap-4 mt-4 text-[0.65rem] text-gray-400">
          <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-50 border border-green-200" /> 空きあり</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-50 border border-red-200" /> 満船</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 bg-white border border-gray-100" /> 未設定</span>
        </div>

        {/* Save */}
        <div className="mt-6 flex items-center gap-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-primary text-white px-8 py-3 text-sm font-bold tracking-[0.1em] hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {saving ? "保存中..." : "保存する"}
          </button>
          {saved && <span className="text-sm text-green-600">保存しました</span>}
        </div>
      </div>
    </div>
  );
}
