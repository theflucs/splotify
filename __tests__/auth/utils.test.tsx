import { setMinimumDelay } from "@/app/api/auth/utils";

describe("setMinimumDelay", () => {
  const originalDateNow = Date.now;
  let fakeTime = 0; // always return a controlled value for predictable tests

  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(global, "setTimeout");

    global.Date.now = jest.fn(() => fakeTime); // overrides Date.now() to always return fakeTime
  });

  afterEach(() => {
    global.Date.now = originalDateNow;
    jest.useRealTimers();
  });

  it("does not add any delay if the required minimum time has already passed", async () => {
    fakeTime = 1201;

    const startTime = 0;
    const delayPromise = setMinimumDelay(startTime, 1200);

    jest.runAllTimers();
    await delayPromise;

    expect(setTimeout).not.toHaveBeenCalled();
  });

  it("adds the correct delay if the required minimum time has not yet passed", async () => {
    fakeTime = 1000;

    const startTime = 0;
    const delayPromise = setMinimumDelay(startTime, 1200);

    fakeTime = 1200;
    jest.advanceTimersByTime(200);

    await delayPromise;

    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 200);
  });
});
