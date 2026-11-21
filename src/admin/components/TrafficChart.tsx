import { useMemo, useState } from "react";
import { formatNumber, formatShortDate } from "../format";
import type { TrafficPoint } from "../types";
import styles from "./TrafficChart.module.css";

type ChartMetric = "users" | "sessions" | "pageViews";

interface TrafficChartProps {
  data: TrafficPoint[];
  rangeLabel: string;
}

const METRIC_LABELS: Record<ChartMetric, string> = {
  users: "Users",
  sessions: "Sessions",
  pageViews: "Page Views",
};

function getCurrentValue(point: TrafficPoint, metric: ChartMetric): number {
  if (metric === "users") return point.users;
  if (metric === "sessions") return point.sessions;
  return point.pageViews;
}

function getPreviousValue(point: TrafficPoint, metric: ChartMetric): number {
  if (metric === "users") return point.previousUsers;
  if (metric === "sessions") return point.previousSessions;
  return point.previousPageViews;
}

export const TrafficChart = ({ data, rangeLabel }: TrafficChartProps) => {
  const [metric, setMetric] = useState<ChartMetric>("users");
  const [showCompare, setShowCompare] = useState(true);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const width = 820;
  const height = 250;
  const pad = { top: 18, right: 16, bottom: 32, left: 46 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;

  const { maxVal, currentPath, areaPath, previousPath, coords, yTicks, xTickIndices, totalCurrent } =
    useMemo(() => {
      if (data.length === 0) {
        return {
          maxVal: 1,
          currentPath: "",
          areaPath: "",
          previousPath: "",
          coords: [] as Array<{ x: number; y: number; prevY: number }>,
          yTicks: [0, 1],
          xTickIndices: [] as number[],
          totalCurrent: 0,
        };
      }

      let peak = 0;
      let sum = 0;
      for (const point of data) {
        const cur = getCurrentValue(point, metric);
        const prev = getPreviousValue(point, metric);
        sum += cur;
        if (cur > peak) peak = cur;
        if (showCompare && prev > peak) peak = prev;
      }

      const niceMax = peak <= 0 ? 4 : Math.ceil(peak * 1.15);
      const stepX = data.length > 1 ? plotW / (data.length - 1) : 0;

      const points = data.map((point, idx) => {
        const x =
          data.length > 1 ? pad.left + idx * stepX : pad.left + plotW / 2;
        const cur = getCurrentValue(point, metric);
        const prev = getPreviousValue(point, metric);
        const y = pad.top + plotH - (cur / niceMax) * plotH;
        const prevY = pad.top + plotH - (prev / niceMax) * plotH;
        return { x, y, prevY };
      });

      const curD = points
        .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
        .join(" ");

      const prevD = points
        .map(
          (p, i) =>
            `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.prevY.toFixed(1)}`
        )
        .join(" ");

      const baselineY = pad.top + plotH;
      const areaD =
        points.length > 1
          ? `${curD} L${points[points.length - 1].x.toFixed(1)},${baselineY} L${points[0].x.toFixed(1)},${baselineY} Z`
          : "";

      const ticks = [0, Math.round(niceMax / 2), niceMax];
      const maxXLabels = Math.min(6, data.length);
      const xIndices: number[] = [];
      if (data.length === 1) {
        xIndices.push(0);
      } else {
        for (let i = 0; i < maxXLabels; i++) {
          const idx = Math.round((i * (data.length - 1)) / (maxXLabels - 1));
          if (!xIndices.includes(idx)) xIndices.push(idx);
        }
      }

      return {
        maxVal: niceMax,
        currentPath: curD,
        areaPath: areaD,
        previousPath: prevD,
        coords: points,
        yTicks: ticks,
        xTickIndices: xIndices,
        totalCurrent: sum,
      };
    }, [data, metric, showCompare, pad.left, pad.top, plotH, plotW]);

  const activePoint = hoverIdx !== null ? data[hoverIdx] : null;
  const activeCoord = hoverIdx !== null ? coords[hoverIdx] : null;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <h3 className={styles.title}>Activity Over Time</h3>
          <span className={styles.subtitle}>
            {rangeLabel} · {formatNumber(totalCurrent)} total{" "}
            {METRIC_LABELS[metric].toLowerCase()}
          </span>
        </div>

        <div className={styles.controls}>
          <div className={styles.metricTabs} role="tablist" aria-label="Chart metric">
            {(["users", "sessions", "pageViews"] as ChartMetric[]).map((key) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={metric === key}
                onClick={() => setMetric(key)}
                className={`${styles.metricTab} ${
                  metric === key ? styles.metricTabActive : ""
                }`}
              >
                {METRIC_LABELS[key]}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setShowCompare((v) => !v)}
            className={`${styles.compareToggle} ${
              showCompare ? styles.compareToggleActive : ""
            }`}
            aria-pressed={showCompare}
          >
            <span className={styles.compareSwatch} aria-hidden="true" />
            <span>Compare</span>
          </button>
        </div>
      </div>

      {data.length === 0 ? (
        <div className={styles.empty}>
          <span>No traffic series recorded for this period yet.</span>
        </div>
      ) : (
        <div
          className={styles.chartWrap}
          onMouseLeave={() => setHoverIdx(null)}
        >
          {activePoint && (
            <div className={styles.tooltip}>
              <span className={styles.tooltipDate}>
                {formatShortDate(activePoint.date)}
              </span>
              <div className={styles.tooltipRow}>
                <span className={styles.tooltipPrev}>
                  Current {METRIC_LABELS[metric]}
                </span>
                <span className={styles.tooltipCurrent}>
                  {formatNumber(getCurrentValue(activePoint, metric))}
                </span>
              </div>
              {showCompare && activePoint.previousDate && (
                <div className={styles.tooltipRow}>
                  <span className={styles.tooltipPrev}>
                    Prev ({formatShortDate(activePoint.previousDate)})
                  </span>
                  <span className={styles.tooltipPrev}>
                    {formatNumber(getPreviousValue(activePoint, metric))}
                  </span>
                </div>
              )}
            </div>
          )}

          <svg
            viewBox={`0 0 ${width} ${height}`}
            className={styles.svg}
            role="img"
            aria-label={`${METRIC_LABELS[metric]} activity chart for ${rangeLabel}`}
          >
            <defs>
              <linearGradient id="adminBurgundyFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8F2638" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#8F2638" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Horizontal Gridlines & Y labels */}
            {yTicks.map((tick) => {
              const y = pad.top + plotH - (tick / maxVal) * plotH;
              return (
                <g key={tick}>
                  <line
                    x1={pad.left}
                    y1={y}
                    x2={width - pad.right}
                    y2={y}
                    stroke="#242424"
                    strokeWidth="1"
                  />
                  <text
                    x={pad.left - 10}
                    y={y + 4}
                    textAnchor="end"
                    fill="#707070"
                    fontSize="11"
                    fontFamily="Geist, sans-serif"
                  >
                    {formatNumber(tick)}
                  </text>
                </g>
              );
            })}

            {/* Area Fill */}
            {areaPath && <path d={areaPath} fill="url(#adminBurgundyFill)" />}

            {/* Previous Period Comparison Line */}
            {showCompare && previousPath && (
              <path
                d={previousPath}
                fill="none"
                stroke="#646464"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
            )}

            {/* Current Period Line */}
            {currentPath && data.length > 1 && (
              <path
                d={currentPath}
                fill="none"
                stroke="#B3394E"
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            )}

            {/* Single-day dot fallback */}
            {data.length === 1 && coords[0] && (
              <circle cx={coords[0].x} cy={coords[0].y} r="5" fill="#B3394E" />
            )}

            {/* Hover Crosshair & Active Point */}
            {activeCoord && (
              <g>
                <line
                  x1={activeCoord.x}
                  y1={pad.top}
                  x2={activeCoord.x}
                  y2={pad.top + plotH}
                  stroke="#383838"
                  strokeWidth="1"
                />
                {showCompare && (
                  <circle
                    cx={activeCoord.x}
                    cy={activeCoord.prevY}
                    r="3.5"
                    fill="#181818"
                    stroke="#8A8A8A"
                    strokeWidth="1.5"
                  />
                )}
                <circle
                  cx={activeCoord.x}
                  cy={activeCoord.y}
                  r="4.5"
                  fill="#B3394E"
                  stroke="#F4F2EE"
                  strokeWidth="1.5"
                />
              </g>
            )}

            {/* X-Axis Labels */}
            {xTickIndices.map((idx) => {
              const point = data[idx];
              const coord = coords[idx];
              if (!point || !coord) return null;
              return (
                <text
                  key={point.date}
                  x={coord.x}
                  y={height - 6}
                  textAnchor="middle"
                  fill="#707070"
                  fontSize="11"
                  fontFamily="Geist, sans-serif"
                >
                  {formatShortDate(point.date)}
                </text>
              );
            })}

            {/* Interactive Hit Zones */}
            {coords.map((coord, idx) => {
              const sliceW =
                data.length > 1 ? plotW / (data.length - 1) : plotW;
              const rx = Math.max(pad.left, coord.x - sliceW / 2);
              return (
                <rect
                  key={data[idx].date}
                  x={rx}
                  y={pad.top}
                  width={Math.max(12, sliceW)}
                  height={plotH}
                  fill="transparent"
                  onMouseEnter={() => setHoverIdx(idx)}
                  onFocus={() => setHoverIdx(idx)}
                />
              );
            })}
          </svg>
        </div>
      )}

      <div className={styles.legend}>
        <div className={styles.legendItems}>
          <span className={styles.legendItem}>
            <span className={styles.dotCurrent} />
            <span>Current period</span>
          </span>
          {showCompare && (
            <span className={styles.legendItem}>
              <span className={styles.linePrev} />
              <span>Previous equivalent period</span>
            </span>
          )}
        </div>
        <span>Hover chart points for exact daily values</span>
      </div>
    </div>
  );
};

export default TrafficChart;
