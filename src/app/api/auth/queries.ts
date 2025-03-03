import { SPOTIFY_API } from "@/constants";
import axios from "axios";
import { SpotifyAuthTokenResponse } from "./types";
import { getSpotifyAuthHeader, setMinimumDelay } from "./utils";

// client credentials flow
export async function getSpotifyAuthToken(): Promise<SpotifyAuthTokenResponse | null> {
  const startTime = Date.now();
  const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
  const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

  if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error("Missing Spotify API credentials. Check your .env file.");
  }

  try {
    const response = await axios.post<SpotifyAuthTokenResponse>(
      SPOTIFY_API.TOKEN_URL,
      new URLSearchParams({ grant_type: "client_credentials" }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: getSpotifyAuthHeader(CLIENT_ID, CLIENT_SECRET),
        },
      },
    );

    await setMinimumDelay(startTime, 1400);
    return response.data;
  } catch (error) {
    console.log("Spotify API Error:", error);
    await setMinimumDelay(startTime, 1400);
    return null;
  }
}
