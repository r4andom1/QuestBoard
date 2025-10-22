import { calculateTimeLeft, formatTime, timeLeft } from "../../utils/timeBasedTask.js";
import { describe, it, expect } from "vitest";

describe("Time based calculations (timeBasedTask.js)", () => {
  describe("calculateTimeLeft()", () => {
    it("Calculates the time left between right now and 10 seconds from now, returns difference of time in seconds", () => {
      const start = new Date();
      const expirationTimeInTenSeconds = new Date(start.getTime() + 10000);
      const timeLeft = calculateTimeLeft(expirationTimeInTenSeconds, start);

      expect(timeLeft).toBe(10);
    });

    it("Calculates the time left between right now and 24 hours from now, returns difference of time in seconds", () => {
      const currentTime = new Date();
      const expirationTime = new Date(currentTime);
      expirationTime.setTime(currentTime.getTime() + 24 * 60 * 60 * 1000);
      const timeLeft = calculateTimeLeft(expirationTime, currentTime);
      const tomorrowInSeconds = 86400;

      expect(timeLeft).toBe(tomorrowInSeconds);
    });
  });

  describe("formatTime()", () => {
    it("Formats time correctly, if seconds is equal to 0", () => {
      const secondsToFormat = 0;
      const formattedTime = formatTime(secondsToFormat);

      expect(formattedTime).toBe("Expired");
    });

    it("Formats time correctly, if time is less than an hour", () => {
      const secondsToFormat = 90;
      const formattedTime = formatTime(secondsToFormat);

      expect(formattedTime).toBe("1m 30s");
    });

    it("Formats time correctly, if time is more than an hour but less than a day", () => {
      const secondsToFormat = 7200; // 2 hours in seconds
      const formattedTime = formatTime(secondsToFormat);

      expect(formattedTime).toBe("2h 0m");
    });
  });

  describe("timeLeft()", () => {
    it("Calculates time left from two different dates and returns formatted time", () => {
      const currentTime = new Date();
      const expirationTime = new Date(currentTime);
      expirationTime.setTime(currentTime.getTime() + 24 * 60 * 60 * 1000);
      const formattedTime = timeLeft(expirationTime, currentTime);

      expect(formattedTime).toBe("1 days");
    });
  });
});
