function ProfilePage() {
  return (
    <div className="profile-page">
      <h1>My Profile</h1>
      <div className="profile-info">
        <div className="profile-picture">
          <img src="https://via.placeholder.com/150" alt="Profile" />
        </div>
        <div className="user-details">
          <h2>John Doe</h2>
          <p>Email: john.doe@example.com</p>
          <p>Member since: January 1, 2023</p>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage; 