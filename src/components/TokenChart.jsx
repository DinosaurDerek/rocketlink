/** @jsxImportSource @emotion/react */
"use client";

import { useEffect, useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import dayjs from "dayjs";

import { fetchPriceHistory } from "@/utils/fetchPriceHistory";
import {
  formatCompactPrice,
  formatDateTime,
  formatPrice,
} from "@/utils/format";
import Message from "@/components/Message";
import Loader from "@/components/Loader";

export default function TokenChart({ tokenId }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!tokenId) return;
    let cancelled = false;

    setLoading(true);
    setError(null);

    fetchPriceHistory(tokenId, setError)
      .then((history) => {
        if (!cancelled) setData(history);
      })
      .catch((e) => {
        if (!cancelled) setError(e);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [tokenId]);

  const { chartData, xAxisTicks } = useMemo(() => {
    const seen = new Set();
    const points = data.map(({ timestamp, price }) => {
      const day = dayjs(timestamp).format("MMM D");
      seen.add(day);
      return { time: day, price, timestamp };
    });
    return { chartData: points, xAxisTicks: Array.from(seen) };
  }, [data]);

  if (error) return <Message text={error.message} />;
  if (loading) return <Loader />;

  return (
    <div css={styles.container} data-testid="token-chart">
      <ResponsiveContainer>
        <LineChart data={chartData}>
          <XAxis dataKey="time" ticks={xAxisTicks.slice(1)} />
          <YAxis
            domain={["auto", "auto"]}
            tickFormatter={(value) => formatCompactPrice(value)}
            padding={{ bottom: 16 }}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const { timestamp, price } = payload[0].payload;
              return (
                <div css={styles.tooltip}>
                  <div>
                    <strong>{formatDateTime(timestamp)}</strong>
                  </div>
                  <div>
                    Price:{" "}
                    <span css={styles.priceValue}>{formatPrice(price)}</span>
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
