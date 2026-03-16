import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Dashboard() {

  const navigate = useNavigate();

  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  const [users, setUsers] = useState([]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  // FETCH USERS FROM API
  const fetchUsers = async () => {
    try {

      const res = await axios.get(
        "https://us-central1-pdf-merge-a77ae.cloudfunctions.net/api/users"
      );

      setUsers(res.data);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {

    fetchUsers();

    // Disable browser back button
    const handleBackButton = () => {
      window.history.pushState(null, null, window.location.href);
    };

    window.history.pushState(null, null, window.location.href);
    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };

  }, []);

  return (
    <div className="min-h-screen bg-gray-100">

      {/* NAVBAR */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 flex justify-between items-center shadow">

        <h1 className="text-xl font-bold tracking-wide">
          User Dashboard
        </h1>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition"
        >
          Logout
        </button>

      </div>

      {/* DASHBOARD CONTENT */}
      <div className="max-w-auto mx-auto mt-16 px-6">

        {/* USER CARD */}
        <div className="bg-white shadow-lg rounded-2xl p-8 flex items-center gap-6 mb-10">

          {/* AVATAR */}
          <div className="w-16 h-16 bg-blue-500 text-white flex items-center justify-center rounded-full text-xl font-bold">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>

          <div>
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              Welcome {user?.name || "User"}

              {user?.premium && (
                <span className="text-yellow-500 flex items-center gap-1">
                  <i className="fa-solid fa-crown"></i>
                  Premium
                </span>
              )}

            </h2>

            <p className="text-gray-500">
              {user?.email}
            </p>
          </div>

        </div>

        {/* USERS LIST */}
        <div className="bg-white shadow-lg rounded-2xl p-8">

          <h2 className="text-xl font-semibold mb-4">
            Registered Users
          </h2>

          <table className="w-full border border-gray-200">

            <thead className="bg-gray-200">
              <tr>
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Email</th>
                <th className="p-3 border">Status</th>
              </tr>
            </thead>

            <tbody>

              {users.length > 0 ? (
                users.map((u, index) => (
                  <tr key={index} className="text-center">

                    <td className="p-3 border">
                      {u.name}
                    </td>

                    <td className="p-3 border">
                      {u.email}
                    </td>

                    <td className="p-3 border">
                      {u.premium ? (

                        <span className="text-yellow-500 font-semibold flex items-center justify-center gap-1">
                          <i className="fa-solid fa-crown"></i> Premium
                        </span>

                      ) : (

                        <span className="text-gray-400">
                          Free
                        </span>

                      )}
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="p-4 text-center">
                    No users found
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;