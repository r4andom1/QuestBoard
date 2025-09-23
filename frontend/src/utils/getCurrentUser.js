import { UserAuth } from "../context/Authentication";

export const getCurrentUserData = () => {
  const authContext = UserAuth();
  return {
    currentUserData: authContext.session.user,
    currentUserID: authContext.session.user.id,
  };
};
