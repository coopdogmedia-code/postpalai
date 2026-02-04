const usageMap = new Map<string, { count: number; month: string }>();

function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
}

function getMonthResetTimestamp(): string {
  const now = new Date();
  const nextMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1, 0, 0, 0, 0));
  return nextMonth.toISOString();
}

export function getClientIp(request: Request): string {
  const headers = request.headers;
  
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }
  
  const realIp = headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  
  return "unknown";
}

export function enforceMonthlyCap({
  key,
  limit,
}: {
  key: string;
  limit: number;
}): {
  allowed: boolean;
  remaining: number;
  limit: number;
  reset: string;
} {
  const currentMonth = getCurrentMonth();
  const reset = getMonthResetTimestamp();
  
  const record = usageMap.get(key);
  
  // Reset if new month or no record
  if (!record || record.month !== currentMonth) {
    usageMap.set(key, { count: 1, month: currentMonth });
    return {
      allowed: true,
      remaining: limit - 1,
      limit,
      reset,
    };
  }
  
  // Check if over limit
  if (record.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      limit,
      reset,
    };
  }
  
  // Increment and allow
  record.count += 1;
  usageMap.set(key, record);
  
  return {
    allowed: true,
    remaining: limit - record.count,
    limit,
    reset,
  };
}