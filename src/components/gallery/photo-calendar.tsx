import Link from "next/link";
import type { PhotoDisplayItem } from "@/lib/photos/types";
import { formatMonthYear } from "@/lib/photos/format";

type PhotoCalendarProps = {
  photos: PhotoDisplayItem[];
};

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

type DayBucket = {
  dayNum: number;
  photos: PhotoDisplayItem[];
};

type MonthBucket = {
  key: string;
  label: string;
  year: number;
  monthIndex: number;
  days: Map<number, PhotoDisplayItem[]>;
};

function monthKey(year: number, monthIndex: number): string {
  return `${year}-${String(monthIndex + 1).padStart(2, "0")}`;
}

function groupByMonth(photos: PhotoDisplayItem[]): MonthBucket[] {
  const months = new Map<string, MonthBucket>();
  for (const photo of photos) {
    if (!photo.eventDate) continue;
    const d = new Date(photo.eventDate);
    if (Number.isNaN(d.getTime())) continue;
    const year = d.getFullYear();
    const monthIndex = d.getMonth();
    const dayNum = d.getDate();
    const key = monthKey(year, monthIndex);

    let bucket = months.get(key);
    if (!bucket) {
      bucket = {
        key,
        label: formatMonthYear(photo.eventDate),
        year,
        monthIndex,
        days: new Map(),
      };
      months.set(key, bucket);
    }

    const dayList = bucket.days.get(dayNum) ?? [];
    dayList.push(photo);
    bucket.days.set(dayNum, dayList);
  }
  return Array.from(months.values()).sort((a, b) => b.key.localeCompare(a.key));
}

function buildMonthCells(bucket: MonthBucket): (DayBucket | null)[] {
  const firstDay = new Date(bucket.year, bucket.monthIndex, 1);
  const lastDay = new Date(bucket.year, bucket.monthIndex + 1, 0);
  const startOffset = firstDay.getDay();
  const cells: (DayBucket | null)[] = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= lastDay.getDate(); d++) {
    cells.push({ dayNum: d, photos: bucket.days.get(d) ?? [] });
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export function PhotoCalendar({ photos }: PhotoCalendarProps) {
  const months = groupByMonth(photos);

  const undated = photos.filter((p) => !p.eventDate);

  if (months.length === 0 && undated.length === 0) {
    return null;
  }

  return (
    <div className="photo-calendar">
      {months.map((month) => {
        const cells = buildMonthCells(month);
        return (
          <section key={month.key} className="cal" aria-label={month.label}>
            <header className="cal-head">
              <h2 className="cal-title">{month.label}</h2>
              <span className="cal-meta">
                {month.days.size === 1 ? "1 dia" : `${month.days.size} dias`} com fotos
              </span>
            </header>
            <div className="cal-weekdays">
              {WEEKDAYS.map((w) => (
                <span key={w} className="wd">
                  {w}
                </span>
              ))}
            </div>
            <div className="cal-grid">
              {cells.map((cell, idx) => {
                if (!cell) {
                  return <div key={idx} className="day day-empty" aria-hidden />;
                }
                const count = cell.photos.length;
                if (count === 0) {
                  return (
                    <div key={idx} className="day day-quiet">
                      <span className="day-num">{cell.dayNum}</span>
                    </div>
                  );
                }
                const first = cell.photos[0];
                return (
                  <Link
                    key={idx}
                    href={`/photo/${first.id}`}
                    className="day day-has"
                  >
                    <span
                      className="day-thumb"
                      style={{ backgroundImage: `url(${first.thumbnailUrl})` }}
                      aria-hidden
                    />
                    <span className="day-num">{cell.dayNum}</span>
                    {count > 1 ? (
                      <span className="day-count">+{count - 1}</span>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}

      {undated.length > 0 ? (
        <section className="cal cal-undated" aria-label="Sem data">
          <header className="cal-head">
            <h2 className="cal-title">Sem data definida</h2>
            <span className="cal-meta">{undated.length} fotos</span>
          </header>
          <div className="cal-undated-grid">
            {undated.map((photo) => (
              <Link
                key={photo.id}
                href={`/photo/${photo.id}`}
                className="day day-has day-undated"
              >
                <span
                  className="day-thumb"
                  style={{ backgroundImage: `url(${photo.thumbnailUrl})` }}
                  aria-hidden
                />
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
