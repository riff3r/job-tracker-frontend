export interface DonutSegment {
  color: string;
  value: number;
  label: string;
}

interface DonutChartProps {
  segments: DonutSegment[];
  total: number;
}

export function DonutChart({ segments, total }: DonutChartProps) {
  const r = 38;
  const cx = 50;
  const cy = 50;
  const circumference = 2 * Math.PI * r;
  let cumulativeAngle = -90;

  return (
    <svg viewBox="0 0 100 100" width="120" height="120">
      {total === 0 ? (
        <circle r={r} cx={cx} cy={cy} fill="none" stroke="#E2E8F0" strokeWidth="16" />
      ) : (
        segments.map((seg, i) => {
          const angle = (seg.value / total) * 360;
          const dash = (seg.value / total) * circumference;
          const gap = circumference - dash;
          const rotation = cumulativeAngle;
          cumulativeAngle += angle;
          return (
            <circle
              key={i}
              r={r}
              cx={cx}
              cy={cy}
              fill="none"
              stroke={seg.color}
              strokeWidth="16"
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={0}
              transform={`rotate(${rotation} ${cx} ${cy})`}
            />
          );
        })
      )}
      <text x={cx} y={cy - 5} textAnchor="middle" fontSize="14" fontWeight="700" fill="#1E293B">
        {total}
      </text>
      <text x={cx} y={cy + 9} textAnchor="middle" fontSize="7" fill="#94A3B8" letterSpacing="0.5">
        TOTAL
      </text>
    </svg>
  );
}
