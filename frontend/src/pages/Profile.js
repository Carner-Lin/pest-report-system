function Profile() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");

    return (
        <main className="main-content">
            <div className="auth-card">
                <h2>Profile</h2>

                {currentUser ? (
                    <div className="profile-info">
                        <p><strong>Username:</strong> {currentUser.username}</p>
                        <p><strong>Email:</strong> {currentUser.email}</p>
                        <p><strong>User ID:</strong> {currentUser.id}</p>
                    </div>
                ) : (
                    <p>No user is currently logged in.</p>
                )}
            </div>
        </main>
    );
}

export default Profile;