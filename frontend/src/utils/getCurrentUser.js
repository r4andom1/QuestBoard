import { UserAuth } from "../context/Authentication";

export const getCurrentUserData = () => {
  const authContext = UserAuth();

  // check session first
  if (!authContext.session || !authContext.session.user) {
    return {
      currentUserData: null,
      currentUserID: null,
    };
  }
  return {
    currentUserData: authContext.session.user,
    currentUserID: authContext.session.user.id,
  };
};
