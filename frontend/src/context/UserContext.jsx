import { createContext, useState, useContext, useEffect } from "react";
import supabase from "../../services/supabase-client";
import { getCurrentUserData } from "../utils/getCurrentUser.js";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userStats, setUserStats] = useState(null); // will refresh affected components
  const [profilePicture, setProfilePicture] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const { currentUserID } = getCurrentUserData();

  const fetchUserData = async () => {
    // gotta check if userID has been fetched so it doesnt crash
    if (!currentUserID) {
      setUserStats(null);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);

    const { data, error } = await supabase
      .from("user_stats")
      .select("*")
      .eq("user_id", currentUserID)
      .maybeSingle();

    if (error) {
      console.log("Error fetching user data", error);
      setIsLoading(false);
    } else {
      setUserStats(data); // triggers the refresh when calling function manually
      return data;
    }
  };

  const updateProfilePicture = async (picture) => {
    const { data, error } = await supabase
      .from("user_stats")
      .update({ profile_picture: picture })
      .eq("user_id", currentUserID)
      .single();

    if (error) {
      console.log("error updating profile picture", error);
    } else {
      setProfilePicture(picture);
      updateUserStats({ profile_picture: picture });
      // console.log("Profile picture changed to: ", picture);
    }
  };

  const updateUserStats = (newStats) => {
    setUserStats((prev) => ({ ...prev, ...newStats }));
  };

  useEffect(() => {
    // only fetch when we have userID
    if (currentUserID) {
      fetchUserData();
    }
    setIsLoading(false);
  }, [currentUserID]);

  if (isLoading) {
    return <div>Loading user data...</div>;
  }

  return (
    <UserContext.Provider
      value={{
        userStats,
        profilePicture,
        updateProfilePicture,
        updateUserStats,
        fetchUserData,
      }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
