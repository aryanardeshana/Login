import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Dashboard() {

  const navigate = useNavigate();

  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

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

    const handleBackButton = () => {
      window.history.pushState(null, null, window.location.href);
    };

    window.history.pushState(null, null, window.location.href);
    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };

  }, []);

  // PAGINATION LOGIC
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;

  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(users.length / usersPerPage);

  // ADVANCED PAGINATION
  const getPagination = () => {

    const pages = [];

    if (totalPages <= 7) {

      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }

    } else {

      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        if (i > 1 && i < totalPages) {
          pages.push(i);
        }
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

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
      <div className="max-w-9xl mx-auto mt-16 px-6">

        {/* USER CARD */}
        <div className="bg-white shadow-lg rounded-2xl p-8 flex items-center gap-6 mb-10">

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

          <table className="w-full border border-gray-200 text-center">

            <thead className="bg-gray-200">
              <tr>
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Email</th>
                <th className="p-3 border">Status</th>
              </tr>
            </thead>

            <tbody>

              {users.length > 0 ? (

                currentUsers.map((u, index) => (

                  <tr key={index}>

                    <td className="p-3 border">
                      {u.name}
                    </td>

                    <td className="p-3 border">
                      {u.email}
                    </td>

                    <td className="p-3 border">

                      {u.premium ? (

                        <span className="text-yellow-500 font-semibold inline-flex items-center justify-center gap-1">
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

          {/* PAGINATION */}
          <div className="flex justify-center mt-6 gap-2">

            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Prev
            </button>

            {getPagination().map((page, index) =>
              page === "..." ? (

                <span key={index} className="px-3 py-2">
                  ...
                </span>

              ) : (

                <button
                  key={index}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded ${currentPage === page
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                    }`}
                >
                  {page}
                </button>

              )
            )}

            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Next
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;