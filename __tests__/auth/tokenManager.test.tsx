import { SpotifyAuthTokenResponse } from "@/app/api/auth/types";
import { setMinimumDelay } from "@/app/api/auth/utils";
import {
  fetchNewToken,
  getCachedToken,
  getSpotifyAuthToken,
  tokenStore,
} from "@/app/api/tokenManager";
import { SPOTIFY_API } from "@/constants";
import axios from "axios";

// Mock dependencies
jest.mock("axios");
jest.mock("@/app/api/auth/utils", () => ({
  setMinimumDelay: jest.fn(),
}));

const mockAxios = axios as jest.Mocked<typeof axios>;
const mockSetMinimumDelay = setMinimumDelay as jest.MockedFunction<
  typeof setMinimumDelay
>;

describe("Token Manager Tests", () => {
  let mockTokenResponse: SpotifyAuthTokenResponse;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.useFakeTimers();
    process.env.SPOTIFY_CLIENT_ID = "test-client-id";
    process.env.SPOTIFY_CLIENT_SECRET = "test-client-secret";

    // Initialize mockTokenResponse here
    mockTokenResponse = {
      access_token: "mocked_access_token",
      token_type: "Bearer",
      expires_in: 3600,
    };

    // Clear token store before each test
    tokenStore.clearCachedToken();
  });

  afterEach(() => {
    jest.useRealTimers();
    delete process.env.SPOTIFY_CLIENT_ID;
    delete process.env.SPOTIFY_CLIENT_SECRET;
  });

  describe("getCachedToken", () => {
    it("returns cached token if not expired", () => {
      tokenStore.setCachedToken(mockTokenResponse);

      const result = getCachedToken();
      expect(result).toEqual(mockTokenResponse);
    });

    it("returns null if token is expired", () => {
      tokenStore.setCachedToken(mockTokenResponse);
      jest.advanceTimersByTime(3600000); // Advance time by 1 hour

      const result = getCachedToken();
      expect(result).toBeNull();
    });
  });

  describe("fetchNewToken", () => {
    it("successfully fetches a new token", async () => {
      mockAxios.post.mockResolvedValue({
        data: mockTokenResponse,
      });
      mockSetMinimumDelay.mockResolvedValue(undefined);

      const result = await fetchNewToken();

      expect(mockAxios.post).toHaveBeenCalledWith(
        SPOTIFY_API.TOKEN_URL,
        "grant_type=client_credentials",
        expect.objectContaining({
          headers: expect.any(Object),
        }),
      );
      expect(result).toEqual(mockTokenResponse);
      expect(mockSetMinimumDelay).toHaveBeenCalledWith(
        expect.any(Number),
        1400,
      );
    });

    it("returns null on token fetch failure", async () => {
      mockAxios.post.mockRejectedValue(new Error("Network error"));
      mockSetMinimumDelay.mockResolvedValue(undefined);

      const result = await fetchNewToken();

      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe("getSpotifyAuthToken", () => {
    it("returns cached token if available", async () => {
      tokenStore.setCachedToken(mockTokenResponse);

      const result = await getSpotifyAuthToken();
      expect(result).toEqual(mockTokenResponse);
    });

    it("fetches new token if no cached token", async () => {
      mockAxios.post.mockResolvedValue({
        data: mockTokenResponse,
      });
      mockSetMinimumDelay.mockResolvedValue(undefined);

      const result = await getSpotifyAuthToken();
      expect(result).toEqual(mockTokenResponse);
    });
  });
});
