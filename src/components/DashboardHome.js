import React from "react";

function DashboardHome({ user, totalUsers, premiumUsers, freeUsers }) {
    return (
        <>
            {/* USER CARD */}
            <div className="bg-white shadow rounded-xl p-6 mb-6">
                <h2 className="text-xl font-semibold">
                    Welcome {user?.name}
                </h2>
                <p className="text-gray-500">{user?.email}</p>
            </div>

            {/* STATS */}
            <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-blue-400 text-white p-6 rounded-xl shadow">
                    <p>Total Users</p>
                    <h2 className="text-3xl font-bold">{totalUsers}</h2>
                </div>

                <div className="bg-gradient-to-r from-yellow-500 to-orange-400 text-white p-6 rounded-xl shadow">
                    <p>Premium Users</p>
                    <h2 className="text-3xl font-bold">{premiumUsers}</h2>
                </div>

                <div className="bg-gradient-to-r from-green-500 to-green-400 text-white p-6 rounded-xl shadow">
                    <p>Free Users</p>
                    <h2 className="text-3xl font-bold">{freeUsers}</h2>
                </div>
            </div>
        </>
    );
}

export default DashboardHome;