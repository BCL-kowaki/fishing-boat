import { prisma } from "./prisma";

export type ScheduleStatus = "available" | "booked";
export type MonthSchedule = Record<string, ScheduleStatus>;

export async function getMonthSchedule(yearMonth: string): Promise<MonthSchedule> {
  const rows = await prisma.schedule.findMany({
    where: {
      id: { startsWith: yearMonth },
    },
  });

  const result: MonthSchedule = {};
  for (const row of rows) {
    result[row.id] = row.status as ScheduleStatus;
  }
  return result;
}

export async function setMonthSchedule(
  yearMonth: string,
  schedule: MonthSchedule
): Promise<void> {
  // 該当月の既存データを全削除
  await prisma.schedule.deleteMany({
    where: { id: { startsWith: yearMonth } },
  });

  // 新しいデータを一括作成
  const entries = Object.entries(schedule).filter(
    ([, status]) => status === "available" || status === "booked"
  );

  if (entries.length > 0) {
    await prisma.schedule.createMany({
      data: entries.map(([id, status]) => ({ id, status })),
    });
  }
}
