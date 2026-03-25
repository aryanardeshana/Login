import React from "react";

function Navbar({ user, navigate, handleLogout }) {
    return (
        <div className="bg-blue-600 text-white flex justify-between items-center px-6 py-4 shadow">
            <h1 className="text-xl font-bold">Admin Dashboard</h1>

            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate("/change-password")}
                    className="bg-green-500 px-4 py-2 rounded-lg"
                >
                    Change Password
                </button>

                <button
                    onClick={() => navigate("/update-profile")}
                    className="bg-purple-500 px-4 py-2 rounded-lg"
                >
                    Update Profile
                </button>

                <button
                    onClick={handleLogout}
                    className="bg-red-500 px-4 py-2 rounded-lg"
                >
                    Logout
                </button>

                <div className="w-10 h-10 bg-orange-400 rounded-full flex items-center justify-center font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                </div>
            </div>
        </div>
    );
}

export default Navbar;