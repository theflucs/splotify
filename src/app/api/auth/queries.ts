import { setMinimumDelay } from "@/app/api/auth/utils";
import { fetchNewToken, getCachedToken } from "@/app/api/tokenManager";

export const getSpotifyAuthToken = async () => {
  const cachedToken = getCachedToken();

  if (cachedToken) {
    return cachedToken;
  }

  const startTime = Date.now();
  const newToken = await fetchNewToken();

  await setMinimumDelay(startTime, 1400);

  return newToken;
};
