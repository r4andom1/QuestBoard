import Navbar from "../components/Navbar";
import Profile from "../components/Profile";
import "../css/ProfilePage.css";

function ProfilePage() {
  return (
    <div className="profile-page">
      <Navbar />
      <div className="profile-page-content">
        <Profile />
      </div>
    </div>
  );
}

export default ProfilePage;
