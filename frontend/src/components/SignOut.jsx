import { UserAuth } from "../context/Authentication";
import { useNavigate } from "react-router-dom";

function SignOut() {
  const navigate = useNavigate();
  const authContext = UserAuth();

  // prevents crashing if context not ready
  if (!authContext) {
    return null;
  }
  const { session, signOutUser } = authContext;

  const handleSignOut = async (event) => {
    event.preventDefault();
    try {
      await signOutUser();
      navigate("/sign-in");
    } catch (error) {
      console.log("Error signing out: ", error);
    }
  };

  return (
    <div>
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
}

export default SignOut;
