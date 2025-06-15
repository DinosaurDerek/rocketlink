/** @jsxImportSource @emotion/react */
"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useMemo } from "react";
import dayjs from "dayjs";

import {
  formatCompactPrice,
  formatDateTime,
  formatPrice,
} from "@/utils/format";

export default function TokenChart({ data }) {
  const { chartData, xAxisTicks } = useMemo(() => {
    const seenDays = new Set();
    const dataPoints = data.map(({ timestamp, price }) => {
      const formattedDay = dayjs(timestamp).format("MMM D");
      if (!seenDays.has(formattedDay)) {
        seenDays.add(formattedDay);
      }
      return {
        timestamp,
        time: formattedDay,
        price,
      };
    });
    return { chartData: dataPoints, xAxisTicks: [...seenDays] };
  }, [data]);

  return (
    <div css={styles.container} data-testid="token-chart">
      <ResponsiveContainer>
        <LineChart data={chartData}>
          <XAxis dataKey="time" ticks={xAxisTicks.slice(1)} />
          <YAxis
            domain={["auto", "auto"]}
            tickFormatter={(val) => formatCompactPrice(val)}
            padding={{ bottom: 16 }}
          />
          <Tooltip
            // Custom tooltip shows full date and time
            content={({ active, payload, label }) => {
              const dataPoint = payload?.[0]?.payload;

              if (!active || !dataPoint) return null;

              return (
                <div css={styles.tooltip}>
                  <div>
                    <strong>
                      {formatDateTime(dataPoint.timestamp) || label}
                    </strong>
                  </div>
                  <div>
                    Price:{" "}
                    <span css={styles.priceValue}>
                      {formatPrice(dataPoint.price)}
                    </span>
                  </div>
                </div>
              );
            }}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#4f46e5"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

const styles = {
  container: (theme) => ({
    width: "100%",
    height: 300,
    marginTop: theme.spacing(2),
  }),
  tooltip: (theme) => ({
    background: theme.colors.card,
    color: theme.colors.text,
    padding: `${theme.spacing(1)} ${theme.spacing(1.5)}`,
    border: `1px solid ${theme.colors.focusOutline}`,
    borderRadius: theme.spacing(1),
    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
    fontSize: theme.fontSizes.small,
  }),
  priceValue: (theme) => ({
    color: "#bcb4f7",
    fontWeight: "bold",
  }),
};
