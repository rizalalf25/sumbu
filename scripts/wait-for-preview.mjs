const url = process.env.E2E_BASE_URL || "http://127.0.0.1:8081";
for (let i = 0; i < 120; i++) {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(1000) });
    if (response.ok) process.exit(0);
  } catch {
    /* Server still starting. */
  }
  await new Promise((resolve) => setTimeout(resolve, 500));
}
throw new Error("Preview did not start within the readiness budget.");
