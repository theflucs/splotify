import { SPOTIFY_API } from "@/constants";
import { SpotifyAuthTokenResponse } from "./types";

// client credential flow for non-logged-in users
export async function getSpotifyAuthToken(): Promise<SpotifyAuthTokenResponse | null> {
  const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!;
  const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!;

  try {
    const response = await fetch(SPOTIFY_API.TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
      }).toString(),
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Spotify API Error:", response.status, response.statusText);
      return null;
    }

    return response.json();
  } catch (error) {
    console.error("Network or Fetch Error:", error);
    return null;
  }
}
