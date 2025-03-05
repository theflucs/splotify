import "@testing-library/jest-dom";
import { setupServer } from "msw/node";

// suppress console logs during Jest tests
jest.spyOn(console, "log").mockImplementation(() => {});
jest.spyOn(console, "error").mockImplementation(() => {});

export const server = setupServer();

beforeAll(() => {
  server.listen();
});

afterEach(() => {
  server.resetHandlers();
  jest.clearAllMocks();
});

afterAll(() => {
  server.close();
  jest.restoreAllMocks();
});

jest.mock("@tanstack/react-query", () => ({
  ...(jest.requireActual("@tanstack/react-query") as {}),
  useQuery: jest.fn(),
  useQueryClient: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
  usePathname: jest.fn(() => "/mocked-path"),
}));

jest.mock("*.svg", () => ({
  __esModule: true,
  default: "svg-mock",
  ReactComponent: jest.fn(() => "svg-component"),
}));
