// Functions for calculating and setting up streaks and badges, reset logic etc

import { useUser } from "../context/UserContext.jsx";
const { fetchUserData, userStats } = useUser();

const incrementQuestStreak = async (user, type) => {
  // 1. User logs in
  // 2. checks database for last_logged_in, todays date should be now()
  // 3. if user does not log in for a day, the streak should reset
  // 4. only update last logged in if the date has changed
  // 5. check if new date since last logged in
  // 6. if that new date is right after yesterday (so they logged in yesterday)
  // 7. increment daily_streak
  // Also have a longest_login_streak column that updates if daily_streak > longest_login_streak
};

async function checkAndAwardBadge(userID, type, streakValue) {}

async function resetQuestStreak(userID, type) {}
