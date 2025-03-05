export function getSpotifyAuthHeader(
  clientId: string,
  clientSecret: string,
): string {
  return `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`;
}

// ensures a minimum execution time for smoother transitions and better perceived performance (useful for loaders, spinners, etc.)
export async function setMinimumDelay(startTime: number, minTime = 1200) {
  const elapsedTime = Date.now() - startTime;
  if (elapsedTime < minTime) {
    await new Promise((resolve) => setTimeout(resolve, minTime - elapsedTime));
  }
}
