import React from "react";

function Navbar({ user, navigate, handleLogout }) {
    return (
        <div className="bg-blue-600 text-white flex flex-wrap items-center justify-between gap-2 px-4 md:px-6 py-4 shadow">

            {/* Title */}
            <h1 className="text-lg md:text-xl font-bold">
                Admin Dashboard
            </h1>

            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-2 md:gap-4">

                {/* Avatar */}
                <div className="w-8 h-8 md:w-10 md:h-10 bg-orange-400 rounded-full flex items-center justify-center font-bold text-sm md:text-base">
                    {user?.name?.charAt(0).toUpperCase()}
                </div>

            </div>
        </div>
    );
}

export default Navbar;