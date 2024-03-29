export function NodeCleanup(callback: any) {
  [`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `SIGTERM`].forEach((eventType) => {
    process.on(eventType, callback.bind(null, eventType));
  });
}
