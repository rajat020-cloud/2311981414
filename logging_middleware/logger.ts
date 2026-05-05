type LogStack = "backend" | "frontend";
type LogLevel = "debug" | "info" | "warn" | "error" | "fatal";
type BackendPackage = "cache" | "controller" | "cron_job" | "db" | "domain" | "handler" | "repository" | "route" | "service";
type FrontendPackage = "api" | "component" | "hook" | "page" | "state" | "style";
type CommonPackage = "auth" | "config" | "middleware" | "utils";
type LogPackage = BackendPackage | FrontendPackage | CommonPackage;

export const Log = async (stack: LogStack, level: LogLevel, pkg: LogPackage, message: string): Promise<void> => {
  const logPayload = {
    stack,
    level,
    package: pkg,
    message
  };

  try {
    const accessToken = process.env.VITE_ACCESS_TOKEN || process.env.NEXT_PUBLIC_ACCESS_TOKEN || process.env.ACCESS_TOKEN || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJyYWo1NTVAeC5jb20iLCJleHAiOjE3Nzc5NjAxMjAsImlhdCI6MTc3Nzk1OTIyMCwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6ImFiNjJiOWEwLTFlMTAtNDFmYy1hYmRhLTdjMTUxNWRkZTA3OSIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6InJhamF0MTIzIiwic3ViIjoiMjc1NTE2MmUtZDY0Yy00ZTU1LTlkZTYtZjkyMjJjMDY5MzVhIn0sImVtYWlsIjoicmFqNTU1QHguY29tIiwibmFtZSI6InJhamF0MTIzIiwicm9sbE5vIjoieDEyNTU1IiwiYWNjZXNzQ29kZSI6IkVYZnZEcCIsImNsaWVudElEIjoiMjc1NTE2MmUtZDY0Yy00ZTU1LTlkZTYtZjkyMjJjMDY5MzVhIiwiY2xpZW50U2VjcmV0IjoiTkh1akV0elBHWEVjUGN2UiJ9.HkY_nsVI23C54GNeLy3FyzOx7Ja1scAaSKAD13e8guI";
    const logApiUrl = 'http://20.207.122.201/evaluation-service/logs';
    
    await fetch(logApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(logPayload),
    });

    if (process.env.NODE_ENV !== 'production') {
       console.log(`[${stack.toUpperCase()}] [${level.toUpperCase()}] [${pkg}]: ${message}`);
    }
  } catch (error) {
    console.error('Failed to push log to external logging service:', error);
  }
};
