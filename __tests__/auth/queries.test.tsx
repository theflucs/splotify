import { getSpotifyAuthToken } from "@/app/api/auth/queries";
import { SpotifyAuthTokenResponse } from "@/app/api/auth/types";
import { fetchNewToken, getCachedToken } from "@/app/api/tokenManager";

jest.mock("@/app/api/tokenManager", () => ({
  getCachedToken: jest.fn(),
  fetchNewToken: jest.fn(),
}));

const mockGetCachedToken = getCachedToken as jest.MockedFunction<
  typeof getCachedToken
>;
const mockFetchNewToken = fetchNewToken as jest.MockedFunction<
  typeof fetchNewToken
>;

jest.mock("@/app/api/auth/utils", () => ({
  setMinimumDelay: jest.fn(),
}));

const mockSetMinimumDelay = require("@/app/api/auth/utils").setMinimumDelay;

describe("getSpotifyAuthToken", () => {
  const mockTokenResponse: SpotifyAuthTokenResponse = {
    access_token: "mocked_access_token",
    token_type: "Bearer",
    expires_in: 3600,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockSetMinimumDelay.mockClear();
  });

  describe("when a cached token is available", () => {
    it("returns the cached token", async () => {
      mockGetCachedToken.mockReturnValueOnce(mockTokenResponse);

      const result = await getSpotifyAuthToken();

      expect(result).toEqual(mockTokenResponse);
      expect(mockGetCachedToken).toHaveBeenCalledTimes(1);
      expect(mockFetchNewToken).not.toHaveBeenCalled();
    });
  });

  describe("when no cached token is available", () => {
    it("fetches and returns a new token", async () => {
      mockGetCachedToken.mockReturnValueOnce(null);
      mockFetchNewToken.mockResolvedValueOnce(mockTokenResponse);

      const result = await getSpotifyAuthToken();

      expect(result).toEqual(mockTokenResponse);
      expect(mockGetCachedToken).toHaveBeenCalledTimes(1);
      expect(mockFetchNewToken).toHaveBeenCalledTimes(1);
    });

    it("returns null when fetching the new token fails", async () => {
      mockGetCachedToken.mockReturnValueOnce(null);
      mockFetchNewToken.mockResolvedValueOnce(null);

      const result = await getSpotifyAuthToken();

      expect(result).toBeNull();
      expect(mockGetCachedToken).toHaveBeenCalledTimes(1);
      expect(mockFetchNewToken).toHaveBeenCalledTimes(1);
    });
  });

  describe("setMinimumDelay", () => {
    it("delays when fetching a new token", async () => {
      mockGetCachedToken.mockReturnValueOnce(null);
      mockFetchNewToken.mockResolvedValueOnce(mockTokenResponse);

      await getSpotifyAuthToken();

      expect(mockSetMinimumDelay).toHaveBeenCalledTimes(1);
    });

    it("delays even when the API request fails", async () => {
      mockGetCachedToken.mockReturnValueOnce(null);
      mockFetchNewToken.mockResolvedValueOnce(null);

      await getSpotifyAuthToken();

      expect(mockSetMinimumDelay).toHaveBeenCalledTimes(1);
    });

    it("does not call setMinimumDelay when returning a cached token", async () => {
      mockGetCachedToken.mockReturnValueOnce(mockTokenResponse);

      await getSpotifyAuthToken();

      expect(mockSetMinimumDelay).not.toHaveBeenCalled();
    });
  });
});
