import dayjs from "dayjs";

export function formatPrice(value) {
  const num = Number(value);

  if (num >= 10) {
    return `$${num.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;
  }

  return `$${num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  })}`;
}

export function formatHeadingPrice(value) {
  const num = Number(value);

  return `$${num.toLocaleString(undefined, {
    minimumFractionDigits: num >= 10 ? 0 : 2,
    maximumFractionDigits: 12,
  })}`;
}

export function formatCompactPrice(value) {
  const num = Number(value);

  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(2)}M`;
  }

  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(2)}k`;
  }

  if (num >= 100) {
    return num.toFixed(0);
  }

  if (num >= 10) {
    return num.toFixed(2);
  }

  if (num >= 0.01) {
    return num.toFixed(3);
  }

  return num.toFixed(4);
}

export function formatPercent(value) {
  return `${Number(value).toFixed(2)}%`;
}

export function formatDateTime(timestamp) {
  return dayjs(timestamp).format("MMM D, h:mm A");
}
