import { SpotifyAuthTokenResponse } from "@/app/api/auth/types";
import { setMinimumDelay } from "@/app/api/auth/utils";
import { SPOTIFY_API } from "@/constants";
import axios from "axios";

export const MINIMUM_DELAY = 1400;

export const tokenStore = {
  cachedToken: null as SpotifyAuthTokenResponse | null,
  tokenExpiry: null as number | null,

  setCachedToken(token: SpotifyAuthTokenResponse) {
    this.cachedToken = token;
    this.tokenExpiry = Date.now() + token.expires_in * 1000;
  },

  clearCachedToken() {
    this.cachedToken = null;
    this.tokenExpiry = null;
  },
};

export const getCachedToken = (): SpotifyAuthTokenResponse | null => {
  const { cachedToken, tokenExpiry } = tokenStore;

  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  return null;
};

export const fetchNewToken =
  async (): Promise<SpotifyAuthTokenResponse | null> => {
    const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
    const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

    if (!CLIENT_ID || !CLIENT_SECRET) {
      console.warn("Missing Spotify API credentials. Skipping token fetch.");
      return null;
    }

    const startTime = Date.now();

    try {
      const response = await axios.post<SpotifyAuthTokenResponse>(
        SPOTIFY_API.TOKEN_URL,
        "grant_type=client_credentials",
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64")}`,
          },
        },
      );

      if (!response.data?.access_token || !response.data?.expires_in) {
        return null;
      }

      const newToken = response.data;
      tokenStore.setCachedToken(newToken);

      await setMinimumDelay(startTime, MINIMUM_DELAY);

      return newToken;
    } catch (error) {
      console.error("Spotify API Error:", error);
      await setMinimumDelay(startTime, MINIMUM_DELAY);
      return null;
    }
  };

export const getSpotifyAuthToken = async () => {
  const cachedToken = getCachedToken();

  if (cachedToken) {
    return cachedToken;
  }

  return await fetchNewToken();
};
