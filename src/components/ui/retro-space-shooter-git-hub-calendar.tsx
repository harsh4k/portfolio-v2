"use client";

import { memo, useMemo, useState, useEffect, useId, useRef, type CSSProperties } from "react";
import { cn } from "../../lib/utils";

export type ContributionLevel = 0 | 1 | 2 | 3 | 4;

export type ContributionData = {
  [date: string]: {
    level: ContributionLevel;
    label?: string;
    count?: number;
  };
};

export type ThemeColors = {
  level0: string;
  level1: string;
  level2: string;
  level3: string;
  level4: string;
};

export type CellShape = "rounded" | "circle";

export type GithubCalendarProps = {
  username?: string;
  data?: ContributionData;
  startDate?: string;
  endDate?: string;
  startsOnSunday?: boolean;
  cellSize?: number;
  cellGap?: number;
  cellShape?: CellShape;
  theme?: "github" | ThemeColors;
  showMonthLabels?: boolean;
  showStats?: boolean;
  showLegend?: boolean;
  className?: string;
};

const THEMES: Record<string, ThemeColors> = {
  github: {
    level0: "#ffffff",
    level1: "#0e4429",
    level2: "#006d32",
    level3: "#26a641",
    level4: "#39d353",
  },
};

const DARK_THEMES: Record<string, ThemeColors> = {
  github: {
    level0: "#0a0a0a",
    level1: "#0e4429",
    level2: "#006d32",
    level3: "#26a641",
    level4: "#39d353",
  },
};

function parseDate(dateStr: string): Date {
  const parts = dateStr.split("-").map(Number);
  const y = parts[0] ?? 0;
  const m = parts[1] ?? 1;
  const d = parts[2] ?? 1;
  return new Date(y, m - 1, d);
}

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const FULL_MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function getOrdinalSuffix(day: number): string {
  if (day > 3 && day < 21) return "th";
  switch (day % 10) {
    case 1: return "st";
    case 2: return "nd";
    case 3: return "rd";
    default: return "th";
  }
}

function formatTooltipDate(dateStr: string): string {
  try {
    const date = parseDate(dateStr);
    const month = FULL_MONTH_NAMES[date.getMonth()];
    const day = date.getDate();
    const suffix = getOrdinalSuffix(day);
    return `${month} ${day}${suffix}`;
  } catch {
    return dateStr;
  }
}

async function fetchContributions(username: string): Promise<ContributionData> {
  const res = await fetch(
    `https://github-contributions-api.jogruber.de/v4/${username}`,
  );
  if (!res.ok) {
    throw new Error(
      `Could not fetch contributions for "${username}" (${res.status})`,
    );
  }
  const json: { total: Record<string, number>; contributions: { date: string; count: number; level: number }[] } = await res.json();

  const result: ContributionData = {};
  for (const entry of json.contributions) {
    result[entry.date] = {
      level: Math.min(4, Math.max(0, entry.level)) as ContributionLevel,
      count: entry.count,
    };
  }
  return result;
}

function buildGrid(
  startDate: string,
  endDate: string,
  startsOnSunday: boolean,
): {
  weeks: (string | null)[][];
  monthLabels: { label: string; weekIndex: number }[];
  gridStart: string;
} {
  const start = parseDate(startDate);
  const end = parseDate(endDate);

  const startDay = startsOnSunday ? 0 : 1;
  const startDow = start.getDay();
  const offset = (startDow - startDay + 7) % 7;
  const gridStart = addDays(start, -offset);

  const weeks: (string | null)[][] = [];
  const monthLabels: { label: string; weekIndex: number }[] = [];

  let current = new Date(gridStart);
  let weekIndex = 0;
  let lastMonth = -1;

  while (
    current <= end ||
    (weeks.length > 0 && (weeks[weeks.length - 1]?.length ?? 0) < 7)
  ) {
    const week: (string | null)[] = [];

    for (let d = 0; d < 7; d++) {
      const dateStr = formatDate(current);
      const isInRange = current >= start && current <= end;
      week.push(isInRange ? dateStr : null);

      if (isInRange && current.getMonth() !== lastMonth) {
        lastMonth = current.getMonth();
        monthLabels.push({
          label: MONTH_NAMES[current.getMonth()]!,
          weekIndex,
        });
      }

      current = addDays(current, 1);
    }

    weeks.push(week);
    weekIndex++;

    if (
      current > end &&
      weeks.length > 0 &&
      (weeks[weeks.length - 1]?.every(
        (d) => d === null || parseDate(d) > end,
      ) ?? false)
    )
      break;
  }

  return { weeks, monthLabels, gridStart: formatDate(gridStart) };
}

type TooltipState = {
  visible: boolean;
  date: string;
  count: number | undefined;
  label: string | undefined;
  x: number;
  y: number;
};

function CalendarSkeleton({
  cellSize = 12,
  cellGap = 3,
  className,
}: {
  cellSize?: number;
  cellGap?: number;
  className?: string;
}) {
  const step = cellSize + cellGap;
  const weeks = 53;
  const days = 7;
  return (
    <div className={cn("w-fit mx-auto space-y-3 animate-pulse", className)}>
      <div className="flex gap-6">
        <div className="h-4 w-32 rounded bg-ink/10" />
        <div className="h-4 w-20 rounded bg-ink/10" />
        <div className="h-4 w-24 rounded bg-ink/10" />
      </div>
      <div className="overflow-x-auto">
        <svg
          width={weeks * step - cellGap}
          height={16 + days * step - cellGap}
          className="overflow-visible"
        >
          {Array.from({ length: weeks }).map((_, wi) =>
            Array.from({ length: days }).map((_, di) => (
              <rect
                key={`${wi}-${di}`}
                x={wi * step}
                y={16 + di * step}
                width={cellSize}
                height={cellSize}
                rx={cellSize * 0.2}
                className="fill-ink/8"
              />
            )),
          )}
        </svg>
      </div>
    </div>
  );
}

export const GithubCalendar = memo(function GithubCalendar({
  username,
  data: dataProp,
  startDate,
  endDate,
  startsOnSunday = true,
  cellSize = 12,
  cellGap = 3,
  cellShape = "rounded",
  theme = "github",
  showMonthLabels = true,
  showStats = true,
  showLegend = true,
  className,
}: GithubCalendarProps) {
  const id = useId();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDark, setIsDark] = useState(false);
  const [gameActive, setGameActive] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const checkDark = () => {
      setIsDark(
        document.documentElement.classList.contains("dark") ||
          document.body.classList.contains("dark"),
      );
    };

    checkDark();

    const observer = new MutationObserver(checkDark);
    const opts = { attributes: true, attributeFilter: ["class"] };
    observer.observe(document.documentElement, opts);
    observer.observe(document.body, opts);

    return () => observer.disconnect();
  }, []);

  const [fetchedData, setFetchedData] = useState<ContributionData | null>(null);
  const [loading, setLoading] = useState(!!username);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) return;
    setFetchedData(null);
    setFetchError(null);
    setLoading(true);

    fetchContributions(username)
      .then((d) => setFetchedData(d))
      .catch((e) => setFetchError(e instanceof Error ? e.message : String(e)))
      .finally(() => setLoading(false));
  }, [username]);

  const data: ContributionData = dataProp ?? fetchedData ?? {};

  const resolvedEnd = endDate ?? formatDate(new Date());
  const resolvedStart = useMemo(() => {
    if (startDate) return startDate;
    const d = parseDate(resolvedEnd);
    d.setFullYear(d.getFullYear() - 1);
    d.setDate(d.getDate() + 1);
    return formatDate(d);
  }, [startDate, resolvedEnd]);

  const activeColors = useMemo(() => {
    if (typeof theme === "object") return theme;
    return isDark ? DARK_THEMES.github : THEMES.github;
  }, [theme, isDark]);

  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    date: "",
    count: undefined,
    label: undefined,
    x: 0,
    y: 0,
  });

  const { weeks, monthLabels, gridStart } = useMemo(
    () => buildGrid(resolvedStart, resolvedEnd, startsOnSunday),
    [resolvedStart, resolvedEnd, startsOnSunday],
  );

  const stats = useMemo(() => {
    const entries = Object.entries(data);
    const total = entries.reduce(
      (sum, [, v]) => sum + (v.count ?? (v.level > 0 ? 1 : 0)),
      0,
    );
    const activeDays = entries.filter(([, v]) => v.level > 0).length;
    const maxStreak = (() => {
      let max = 0;
      let cur = 0;
      const sorted = entries
        .filter(([, v]) => v.level > 0)
        .map(([d]) => d)
        .sort();
      for (let i = 0; i < sorted.length; i++) {
        if (i === 0) {
          cur = 1;
          max = 1;
          continue;
        }
        const prev = parseDate(sorted[i - 1]!);
        const curr = parseDate(sorted[i]!);
        const diff = (curr.getTime() - prev.getTime()) / 86400000;
        if (diff === 1) {
          cur++;
          max = Math.max(max, cur);
        } else cur = 1;
      }
      return max;
    })();
    return { total, activeDays, maxStreak };
  }, [data]);

  const step = cellSize + cellGap;
  const monthLabelHeight = showMonthLabels && !gameActive ? 20 : 0;
  const svgWidth = weeks.length * step - cellGap;
  const svgHeight = monthLabelHeight + 7 * step - cellGap;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [fetchedData, dataProp]);

  // Game loop
  useEffect(() => {
    if (!gameActive) {
      weeks.forEach((week) => {
        week.forEach((date) => {
          if (!date) return;
          const rect = document.getElementById(`cell-${id}-${date}`);
          if (rect) {
            rect.style.opacity = "1";
            rect.style.pointerEvents = "auto";
            const originalLevel = data[date]?.level ?? 0;
            const originalColor =
              activeColors[`level${originalLevel}` as keyof ThemeColors] ||
              activeColors.level0;
            rect.setAttribute("fill", originalColor);
          }
        });
      });
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    const width = svgWidth;
    const height = svgHeight + 80;
    canvas.width = width;
    canvas.height = height;

    const cellLevels = new Map<string, number>();
    weeks.forEach((week) => {
      week.forEach((date) => {
        if (!date) return;
        const entry = data[date];
        const initialLevel = entry?.level ?? 0;
        cellLevels.set(date, initialLevel);
        const rect = document.getElementById(`cell-${id}-${date}`);
        if (rect) {
          if (initialLevel === 0) {
            rect.style.opacity = "0";
            rect.style.pointerEvents = "none";
          } else {
            rect.style.opacity = "1";
            rect.style.pointerEvents = "auto";
          }
        }
      });
    });

    let mouseX = width / 2;

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = (e.clientX - rect.left) * (width / rect.width);
    };

    canvas.addEventListener("mousemove", onMouseMove);

    // Ship center follows mouse across full width
    const shipHalf = 15;
    const player = {
      cx: width / 2,
      y: height - 25,
      width: 30,
      height: 20,
      color: "#38bdf8",
    };

    type GameBullet = {
      x: number;
      y: number;
      vy: number;
      h: number;
      color: string;
    };
    let bullets: GameBullet[] = [];

    const shoot = () => {
      bullets.push({
        x: player.cx,
        y: player.y - 4,
        vy: -6,
        h: 8,
        color: "#fbbf24",
      });
    };

    const stars = Array.from({ length: 140 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      speed: Math.random() * 0.4 + 0.1,
      size: Math.random() * 1.2 + 0.5,
      alpha: Math.random() * 0.5 + 0.1,
    }));

    type GameParticle = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      size: number;
      alpha: number;
      life: number;
      maxLife: number;
    };
    let particles: GameParticle[] = [];
    const explode = (x: number, y: number, color: string) => {
      for (let i = 0; i < 12; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2.5 + 1.2;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color,
          size: Math.random() * 2 + 1,
          alpha: 1,
          life: 0,
          maxLife: Math.random() * 15 + 15,
        });
      }
    };

    let lastShot = 0;
    const cooldown = 150;

    const update = () => {
      player.cx = Math.max(0, Math.min(width, mouseX));

      const now = performance.now();
      if (now - lastShot >= cooldown) {
        shoot();
        lastShot = now;
      }

      let anyActive = false;
      cellLevels.forEach((level) => {
        if (level > 0) anyActive = true;
      });

      if (!anyActive) {
        weeks.forEach((week) => {
          week.forEach((date) => {
            if (!date) return;
            const originalLevel = data[date]?.level ?? 0;
            cellLevels.set(date, originalLevel);
            const rect = document.getElementById(`cell-${id}-${date}`);
            if (rect) {
              const originalColor =
                activeColors[`level${originalLevel}` as keyof ThemeColors] ||
                activeColors.level0;
              rect.setAttribute("fill", originalColor);
              if (originalLevel === 0) {
                rect.style.opacity = "0";
                rect.style.pointerEvents = "none";
              } else {
                rect.style.opacity = "1";
                rect.style.pointerEvents = "auto";
              }
            }
          });
        });
      }

      stars.forEach((s) => {
        s.y += s.speed;
        if (s.y > height) {
          s.y = 0;
          s.x = Math.random() * width;
        }
      });

      for (let bi = 0; bi < bullets.length; bi++) {
        bullets[bi]!.y += bullets[bi]!.vy;
        if (bullets[bi]!.y + bullets[bi]!.h < 0) {
          bullets.splice(bi, 1);
          bi--;
        }
      }

      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        p.alpha = 1 - p.life / p.maxLife;
      });
      particles = particles.filter((p) => p.life < p.maxLife);

      for (let bi = bullets.length - 1; bi >= 0; bi--) {
        const bullet = bullets[bi]!;
        let hit = false;

        for (let wi = 0; wi < weeks.length && !hit; wi++) {
          const week = weeks[wi]!;
          for (let di = 0; di < week.length && !hit; di++) {
            const date = week[di];
            if (!date) continue;

            const currentLevel = cellLevels.get(date) ?? 0;
            if (currentLevel === 0) continue;

            const cellX = wi * step;
            const cellY = monthLabelHeight + di * step;
            const hitMargin = 2;

            if (
              bullet.x > cellX - hitMargin &&
              bullet.x < cellX + cellSize + hitMargin &&
              bullet.y < cellY + cellSize &&
              bullet.y + bullet.h > cellY
            ) {
              hit = true;
              bullets.splice(bi, 1);

              const newLevel = currentLevel - 1;
              cellLevels.set(date, newLevel);

              const rect = document.getElementById(`cell-${id}-${date}`);
              if (rect) {
                if (newLevel === 0) {
                  rect.style.opacity = "0";
                  rect.style.pointerEvents = "none";
                } else {
                  const newColor =
                    activeColors[`level${newLevel}` as keyof ThemeColors] ||
                    activeColors.level0;
                  rect.setAttribute("fill", newColor);
                }
              }

              const hitColor =
                activeColors[`level${currentLevel}` as keyof ThemeColors] ||
                activeColors.level0;
              explode(cellX + cellSize / 2, cellY + cellSize / 2, hitColor);
            }
          }
        }
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      ctx.fillStyle = "#ffffff";
      stars.forEach((s) => {
        ctx.globalAlpha = s.alpha;
        ctx.fillRect(s.x, s.y, s.size, s.size);
      });
      ctx.globalAlpha = 1.0;

      bullets.forEach((b) => {
        ctx.fillStyle = b.color;
        ctx.fillRect(b.x - 1.5, b.y, 3, b.h);
      });

      particles.forEach((p) => {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      });
      ctx.globalAlpha = 1.0;

      ctx.fillStyle = player.color;
      ctx.shadowColor = player.color;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.moveTo(player.cx, player.y);
      ctx.lineTo(player.cx + shipHalf, player.y + player.height);
      ctx.lineTo(
        player.cx + shipHalf * 0.7,
        player.y + player.height * 0.75,
      );
      ctx.lineTo(
        player.cx - shipHalf * 0.7,
        player.y + player.height * 0.75,
      );
      ctx.lineTo(player.cx - shipHalf, player.y + player.height);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;
    };

    const loop = () => {
      update();
      render();
      if (gameActive) {
        animationFrameId = requestAnimationFrame(loop);
      }
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener("mousemove", onMouseMove);
    };
  }, [
    gameActive,
    data,
    weeks,
    step,
    cellSize,
    cellGap,
    monthLabelHeight,
    activeColors,
    id,
    svgWidth,
    svgHeight,
  ]);

  if (loading) {
    return (
      <CalendarSkeleton
        cellSize={cellSize}
        cellGap={cellGap}
        className={className}
      />
    );
  }

  if (fetchError) {
    return (
      <div
        className={cn(
          "w-fit mx-auto flex items-center gap-2 rounded-md border border-signal/30 bg-signal/10 px-4 py-3 text-sm text-signal",
          className,
        )}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        {fetchError}
      </div>
    );
  }

  const cellRx = cellShape === "circle" ? cellSize / 2 : cellSize * 0.2;

  return (
    <div
      className={cn(
        "w-fit mx-auto overflow-x-hidden transition-all duration-500",
        gameActive ? "bg-[#0a0a0a] rounded-lg" : "",
        className,
      )}
    >
      <div className="w-fit mx-auto max-w-full flex flex-col gap-3 p-3">
        <div
          ref={scrollRef}
          className={cn(
            "relative overflow-x-auto transition-all duration-500",
            gameActive ? "pb-[80px]" : "",
          )}
          style={
            { scrollbarWidth: "none", msOverflowStyle: "none" } as CSSProperties
          }
        >
          <svg
            width={svgWidth}
            height={svgHeight}
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="overflow-visible"
          >
            {showMonthLabels &&
              !gameActive &&
              (() => {
                const byWeek = new Map<number, string>();
                monthLabels.forEach(({ label, weekIndex }) =>
                  byWeek.set(weekIndex, label),
                );
                const entries = Array.from(byWeek.entries());
                const validEntries: [number, string][] = [];
                for (let i = 0; i < entries.length; i++) {
                  const current = entries[i]!;
                  const next = entries[i + 1];
                  if (i === 0 && next && next[0] - current[0] < 3) continue;
                  const lastValid = validEntries[validEntries.length - 1];
                  if (lastValid && current[0] - lastValid[0] < 3) continue;
                  validEntries.push(current);
                }
                return validEntries.map(([weekIndex, label]) => (
                  <text
                    key={`${label}-${weekIndex}`}
                    x={weekIndex * step}
                    y={10}
                    fontSize={14}
                    fill={isDark ? "#fafafa" : "#0a0a0a"}
                    fontFamily="inherit"
                  >
                    {label}
                  </text>
                ));
              })()}

            {weeks.map((week, wi) =>
              week.map((date, di) => {
                const entry = date ? data[date] : undefined;
                const level: ContributionLevel = entry?.level ?? 0;
                const cellCenterX = wi * step + cellSize / 2;
                const cellTopY = monthLabelHeight + di * step;

                if (!date) {
                  const cellDate = formatDate(
                    addDays(parseDate(gridStart), wi * 7 + di),
                  );
                  if (cellDate > resolvedEnd) return null;
                }

                return (
                  <rect
                    key={`${wi}-${di}`}
                    id={date ? `cell-${id}-${date}` : undefined}
                    x={wi * step}
                    y={cellTopY}
                    width={cellSize}
                    height={cellSize}
                    rx={cellRx}
                    fill={activeColors[`level${level}` as keyof ThemeColors]}
                    style={{
                      transition: "opacity 0.1s",
                      opacity: gameActive ? (level === 0 || !date ? 0 : 1) : 1,
                      pointerEvents: gameActive
                        ? level === 0 || !date
                          ? "none"
                          : "auto"
                        : "auto",
                    }}
                    onMouseEnter={() => {
                      if (!date || gameActive) return;
                      setTooltip({
                        visible: true,
                        date,
                        count: entry?.count,
                        label: entry?.label,
                        x: cellCenterX,
                        y: cellTopY,
                      });
                    }}
                    onMouseLeave={() =>
                      setTooltip((t) => ({ ...t, visible: false }))
                    }
                  />
                );
              }),
            )}
          </svg>

          {gameActive && (
            <canvas
              ref={canvasRef}
              className="absolute inset-0 pointer-events-auto z-10 cursor-none"
              style={{ width: svgWidth, height: svgHeight + 80 }}
            />
          )}

          {tooltip.visible &&
            (() => {
              const count = tooltip.count ?? 0;
              const formattedDate = formatTooltipDate(tooltip.date);
              const tooltipText = tooltip.label
                ? `${tooltip.label} on ${formattedDate}.`
                : count === 0
                  ? `No contributions on ${formattedDate}.`
                  : `${count} contribution${count !== 1 ? "s" : ""} on ${formattedDate}.`;

              return (
                <div
                  className="pointer-events-none absolute z-50 rounded bg-ink px-2.5 py-1 text-[11px] font-medium text-paper shadow-md border border-ink/20 whitespace-nowrap"
                  style={{
                    left: tooltip.x,
                    top: tooltip.y,
                    transform: "translate(-50%, calc(-100% - 6px))",
                  }}
                >
                  {tooltipText}
                  <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 w-1.5 h-1.5 rotate-45 bg-ink border-r border-b border-ink/20" />
                </div>
              );
            })()}
        </div>

        <div className="flex items-center justify-between gap-x-4">
          {showLegend && (
            <div className="flex flex-wrap items-center gap-4 text-xs text-ink/50 shrink-0 mt-0.5">
              <div className="flex items-center gap-1.5">
                <span>Less</span>
                {([0, 1, 2, 3, 4] as ContributionLevel[]).map((level) => (
                  <svg key={level} width={cellSize} height={cellSize}>
                    <rect
                      width={cellSize}
                      height={cellSize}
                      rx={cellRx}
                      fill={activeColors[`level${level}`]}
                    />
                  </svg>
                ))}
                <span>More</span>
              </div>

              <div className="flex items-center gap-2 border-l border-ink/15 pl-4">
                <span className="text-[11px] text-ink/40 select-none">Game Mode</span>
                <button
                  onClick={() => setGameActive(!gameActive)}
                  className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none data-[state=active]:bg-signal data-[state=inactive]:bg-ink/20"
                  data-state={gameActive ? "active" : "inactive"}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      gameActive ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {showStats && (
            <div className="flex flex-1 flex-wrap justify-end ml-auto text-sm">
              <a
                href={`https://github.com/${username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-x-1 text-ink/50 hover:text-ink transition-colors no-underline"
              >
                <span className="font-semibold">{username}</span>
                <span>contributed</span>
                <span className="font-bold text-[#0e4429]">{stats.total.toLocaleString()}</span>
                <span>contributions this year</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

GithubCalendar.displayName = "GithubCalendar";

export default GithubCalendar;
