type LogStack = "backend" | "frontend";
type LogLevel = "debug" | "info" | "warn" | "error" | "fatal";
type BackendPackage = "controller" | "service" | "repository" | "handler" | "db" | "middleware";
type FrontendPackage = "component" | "hook" | "api" | "state" | "page";
type LogPackage = BackendPackage | FrontendPackage;

export const Log = async (stack: LogStack, level: LogLevel, pkg: LogPackage, message: string): Promise<void> => {
  const isValidBackendPkg = stack === "backend" && ["controller", "service", "repository", "handler", "db", "middleware"].includes(pkg);
  const isValidFrontendPkg = stack === "frontend" && ["component", "hook", "api", "state", "page"].includes(pkg);

  if (!isValidBackendPkg && !isValidFrontendPkg) {
    console.warn(`[Logger Warning]: Invalid package '${pkg}' used with stack '${stack}'`);
  }

  const logPayload = {
    stack,
    level,
    package: pkg,
    message,
    timestamp: new Date().toISOString()
  };

  try {
    const logApiUrl = process.env.NEXT_PUBLIC_EXTERNAL_LOG_API_URL 
      || process.env.EXTERNAL_LOG_API_URL 
      || 'https://mock-log-api.example.com/logs';
    
    await fetch(logApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
