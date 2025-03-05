import { NextResponse } from "next/server";
import { getSpotifyAuthToken } from "./queries";

export async function GET() {
  try {
    const tokenData = await getSpotifyAuthToken();

    if (!tokenData?.access_token) {
      console.error("No access token from Spotify");
      return NextResponse.json(
        { error: "Failed to get Spotify token" },
        { status: 500 },
      );
    }

    // Create response
    const response = NextResponse.json({
      access_token: tokenData.access_token,
      expires_in: tokenData.expires_in,
    });

    // Set HTTP-only, Secure cookie with token via headers
    const secureFlag = process.env.NODE_ENV === "production" ? "Secure" : "";
    response.headers.set(
      "Set-Cookie",
      `spotify_auth_token=${tokenData.access_token}; HttpOnly; ${secureFlag}; Max-Age=${tokenData.expires_in}; Path=/; SameSite=Strict`,
    );

    return response;
  } catch (error) {
    console.error("Spotify Token API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
