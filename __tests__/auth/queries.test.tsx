import { SpotifyAuthTokenResponse } from "@/app/api/auth/types";
import { setMinimumDelay } from "@/app/api/auth/utils";
import { SPOTIFY_API } from "@/constants";
import axios from "axios";

jest.mock("axios");

jest.mock("@/app/api/auth/utils", () => ({
  ...jest.requireActual("@/app/api/auth/utils"),
  setMinimumDelay: jest.fn(),
}));

describe("getSpotifyAuthToken API Query", () => {
  let getSpotifyAuthToken: () => Promise<SpotifyAuthTokenResponse | null>;

  const mockTokenResponse: SpotifyAuthTokenResponse = {
    access_token: "mocked_access_token",
    token_type: "Bearer",
    expires_in: 3600,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    process.env.SPOTIFY_CLIENT_ID = "test-client-id";
    process.env.SPOTIFY_CLIENT_SECRET = "test-client-secret";

    const authModule = require("@/app/api/auth/queries");
    getSpotifyAuthToken = authModule.getSpotifyAuthToken;
  });

  describe("Successful API requests", () => {
    it("returns a valid token when the API request is successful", async () => {
      (axios.post as jest.Mock).mockResolvedValueOnce({
        data: mockTokenResponse,
      });

      const result = await getSpotifyAuthToken();

      expect(result).toEqual(mockTokenResponse);
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledWith(
        SPOTIFY_API.TOKEN_URL,
        "grant_type=client_credentials",
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: expect.any(String),
          },
        },
      );
    });

    it("calls `setMinimumDelay` to enforce a minimum response time", async () => {
      (axios.post as jest.Mock).mockResolvedValueOnce({
        data: mockTokenResponse,
      });

      await getSpotifyAuthToken();

      expect(setMinimumDelay).toHaveBeenCalledTimes(1);
      expect(setMinimumDelay).toHaveBeenCalledWith(expect.any(Number), 1000);
    });
  });

  describe("API request failures", () => {
    it("returns null if the API request fails", async () => {
      (axios.post as jest.Mock).mockRejectedValueOnce(new Error("API Error"));

      const result = await getSpotifyAuthToken();

      expect(result).toBeNull();
      expect(axios.post).toHaveBeenCalledTimes(1);
    });

    it("returns null if the network request fails", async () => {
      (axios.post as jest.Mock).mockRejectedValueOnce(
        new Error("Network error"),
      );

      await expect(getSpotifyAuthToken()).resolves.toBeNull();
      expect(axios.post).toHaveBeenCalledTimes(1);
    });

    it("does NOT call `setMinimumDelay` if the API request fails", async () => {
      (axios.post as jest.Mock).mockRejectedValueOnce(new Error("API Error"));

      await getSpotifyAuthToken();
      expect(setMinimumDelay).not.toHaveBeenCalled();
    });

    it("handles an unexpected empty object `{}` response by returning null", async () => {
      (axios.post as jest.Mock).mockResolvedValueOnce({ data: {} });

      const result = await getSpotifyAuthToken();

      expect(result).toEqual({});
      expect(axios.post).toHaveBeenCalledTimes(1);
    });
  });

  describe("Env variables validation", () => {
    it("throws an error if SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET is missing", async () => {
      delete process.env.SPOTIFY_CLIENT_ID;
      delete process.env.SPOTIFY_CLIENT_SECRET;

      await expect(getSpotifyAuthToken()).rejects.toThrow(
        "Missing Spotify API credentials. Check your .env file.",
      );

      expect(axios.post).not.toHaveBeenCalled();
    });
  });
});
