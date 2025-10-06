import { createContext, useEffect, useState, useContext } from "react";
import supabase from "../../services/supabase-client";
import { createUserProfile } from "../utils/createUserProfile";

// A lot of authentication code was borrowed from supabase documentation
// And i borrowed elements from this guide to make it work: https://www.youtube.com/watch?v=1KBV8M0mpYI&ab_channel=CodeCommerce

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      // checks if user is logged in already
      setSession(session);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      // listens to any changes (if user logs in, out, token refreshes etc and updates session)
      setSession(session);
    });
  }, []);

  const signUpUser = async (email, password, username) => {
    // Signs up a new user by adding them to the supabase auth table
    // Also creats a corresponding the custom user_stats table thats linked with the auth table (so that we can give a user coins, xp etc)
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    // console.log(data) // debug

    if (error) {
      console.log("Error signing up new user: ", error);
      return { success: false, error };
    } else {
      if (data.user) {
        // console.log("username: ", username);
        const result = await createUserProfile(data.user.id, username);
        if (!result.success) {
          console.log("Failed to create user profile: ", error);
        }
      }
      return { success: true, data };
    }
  };

  const signInUser = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (error) {
        console.log("Error signing in user: ", error);
        return { success: false, error };
      } else {
        // console.log("Signed in successfully: ", data) // remove before deploy
        return { success: true, data };
      }
    } catch (error) {
      console.log("Error with signing in user: ", error);
    }
  };

  const signOutUser = async () => {
    // Removes current session, JWTs
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log("Error signing out user: ", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ session, signUpUser, signOutUser, signInUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};
