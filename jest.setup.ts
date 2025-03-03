import "@testing-library/jest-dom";
import { setupServer } from "msw/node";

export const server = setupServer();

beforeAll(() => {
  server.listen();
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  server.resetHandlers();
  jest.clearAllMocks();
});

afterAll(() => {
  server.close();
  // restore console.error to its original state after all tests are complete
  (console.error as jest.Mock).mockRestore();
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
