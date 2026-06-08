const DATABASE_ERROR_PATTERNS = [
  /ENOTFOUND/i,
  /ECONNREFUSED/i,
  /ETIMEDOUT/i,
  /getaddrinfo/i,
  /tenant\/user/i,
  /could not translate host name/i,
  /server closed the connection unexpectedly/i,
  /password authentication failed/i,
];

export function getRouteError(error: unknown, fallbackMessage: string) {
  const rawMessage = error instanceof Error ? error.message : String(error ?? "");

  if (DATABASE_ERROR_PATTERNS.some((pattern) => pattern.test(rawMessage))) {
    console.error("[RouteError][Database]", rawMessage);
    return {
      message: "数据库连接失败，请检查 .env.local 里的 DATABASE_URL 和 Supabase 连接配置后重试",
      status: 503,
    };
  }

  return {
    message: error instanceof Error ? error.message : fallbackMessage,
    status: 500,
  };
}
