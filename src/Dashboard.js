import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

function Dashboard() {

  const navigate = useNavigate();

  const userData = Cookies.get("user");
  const user = userData ? JSON.parse(userData) : null;

  //state
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [apiList, setApiList] = useState([]);
  const usersPerPage = 5;

  //  API LIST
  // const apiList = [
  //   { name: "Register API", url: "https://us-central1-pdf-merge-a77ae.cloudfunctions.net/api/register" },
  //   { name: "Login API", url: "https://us-central1-pdf-merge-a77ae.cloudfunctions.net/api/login" },
  //   { name: "Get Users API", url: "https://us-central1-pdf-merge-a77ae.cloudfunctions.net/api/users" },
  //   { name: "Base API", url: "https://us-central1-pdf-merge-a77ae.cloudfunctions.net/api" },
  //   { name: "Upgrade Premium API", url: "https://us-central1-pdf-merge-a77ae.cloudfunctions.net/api/upgrade-premium" },
  //   { name: "Delete User API", url: "https://us-central1-pdf-merge-a77ae.cloudfunctions.net/api/delete-user" },
  //   { name: "Stickers API", url: "https://us-central1-pdf-merge-a77ae.cloudfunctions.net/api/stickers" },
  //   { name: "Effects API", url: "https://us-central1-pdf-merge-a77ae.cloudfunctions.net/api/effects" },
  //   { name: "Change Password API", url: "https://us-central1-pdf-merge-a77ae.cloudfunctions.net/api/change-password" },
  //   { name: "Backgrounds API", url: "https://us-central1-pdf-merge-a77ae.cloudfunctions.net/api/backgrounds" },
  //   { name: "Graphics API", url: "https://us-central1-pdf-merge-a77ae.cloudfunctions.net/api/graphics" },
  //   { name: "Categories API", url: "https://us-central1-pdf-merge-a77ae.cloudfunctions.net/api/categories" }
  // ];

  const totalApis = apiList.length;

  const handleLogout = () => {
    Cookies.remove("user");
    navigate("/");
  };

  useEffect(() => {

    // USERS
    axios
      .get("https://us-central1-pdf-merge-a77ae.cloudfunctions.net/api/users")
      .then(res => setUsers(res.data));

    // APIs LIST
    axios
      .get("https://us-central1-pdf-merge-a77ae.cloudfunctions.net/api/all-apis")
      .then(res => setApiList(res.data.data));

  }, []);

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;

  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const totalUsers = users.length;
  const premiumUsers = users.filter(u => u.premium).length;
  const freeUsers = users.filter(u => !u.premium).length;

  const chartData = [
    { name: "Total", value: totalUsers },
    { name: "Premium", value: premiumUsers },
    { name: "Free", value: freeUsers }
  ];

  const COLORS = ["#3b82f6", "#f59e0b", "#22c55e"];

  return (

    <div className="min-h-screen bg-gray-100">

      {/* NAVBAR */}

      <div className="bg-blue-600 text-white flex justify-between items-center px-6 py-4 shadow">

        <h1 className="text-xl font-bold">
          Admin Dashboard
        </h1>

        <div className="flex items-center gap-4">

          <button
            onClick={() => navigate("/change-password")}
            className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg"
          >
            Change Password
          </button>

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg"
          >
            Logout
          </button>

          <div className="w-10 h-10 bg-orange-400 rounded-full flex items-center justify-center font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>

        </div>

      </div>

      <div className="p-6">

        {/* USER CARD */}

        <div className="bg-white shadow rounded-xl p-6 mb-6">

          <h2 className="text-xl font-semibold">
            Welcome {user?.name}
          </h2>

          <p className="text-gray-500">
            {user?.email}
          </p>

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

        {/* SEARCH */}

        <input
          type="text"
          placeholder="Search Users..."
          className="w-full mb-4 p-3 border rounded-lg"
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* TABLE */}

        <div className="bg-white shadow rounded-xl overflow-hidden">

          <table className="w-full">

            <thead className="bg-blue-600 text-white">

              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Status</th>
              </tr>

            </thead>

            <tbody>

              {currentUsers.map((u, index) => (
                <tr key={index} className="text-center border-b">

                  <td className="p-3">{u.name}</td>
                  <td className="p-3">{u.email}</td>

                  <td className="p-3">

                    {u.premium ? (
                      <span className="bg-yellow-400 px-3 py-1 rounded-full text-sm">
                        Premium
                      </span>
                    ) : (
                      <span className="bg-green-400 px-3 py-1 rounded-full text-sm">
                        Free
                      </span>
                    )}

                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

        {/* ADVANCED PAGINATION */}

        <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">

          <button
            onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
            className="px-4 py-2 border border-blue-500 text-blue-600 rounded hover:bg-blue-500 hover:text-white"
          >
            Prev
          </button>

          <button
            onClick={() => setCurrentPage(1)}
            className={`px-4 py-2 rounded border ${currentPage === 1
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
          >
            1
          </button>

          {currentPage > 4 && <span className="px-2 text-gray-500">...</span>}

          {Array.from({ length: 5 }, (_, i) => currentPage - 2 + i)
            .filter(p => p > 1 && p < totalPages)
            .map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded border ${currentPage === page
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                  }`}
              >
                {page}
              </button>
            ))}

          {currentPage < totalPages - 3 && (
            <span className="px-2 text-gray-500">...</span>
          )}

          <button
            onClick={() => setCurrentPage(totalPages)}
            className={`px-4 py-2 rounded border ${currentPage === totalPages
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
          >
            {totalPages}
          </button>

          <button
            onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
            className="px-4 py-2 border border-blue-500 text-blue-600 rounded hover:bg-blue-500 hover:text-white"
          >
            Next
          </button>

        </div>

        {/* API LIST */}

        <div className="bg-white shadow rounded-xl p-6 mt-6">

          <h2 className="text-lg font-semibold mb-4">
            Developed APIs
          </h2>

          <table className="w-full text-left">

            <thead className="bg-purple-600 text-white">
              <tr>
                <th className="p-3">API Name</th>
                <th className="p-3">API URL</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>

              {apiList.map((api, index) => (
                <tr key={index} className="border-b">

                  <td className="p-3 font-medium">
                    {api.name}
                  </td>

                  <td className="p-3 text-blue-600">
                    <a
                      href={api.url}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:underline"
                    >
                      {api.url}
                    </a>
                  </td>

                  <td className="p-3 text-center">
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Add
                    </button>
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

        {/* BAR CHART */}

        <div className="bg-white shadow rounded-xl p-6 mt-6">

          <h2 className="text-lg font-semibold mb-4">
            User Statistics
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>

        </div>

        {/* PIE CHART */}

        <div className="bg-white shadow rounded-xl p-6 mt-6">

          <h2 className="text-lg font-semibold mb-4">
            User Distribution
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>

              <Pie data={chartData} dataKey="value" outerRadius={100}>

                {chartData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}

              </Pie>

              <Tooltip />

            </PieChart>
          </ResponsiveContainer>

        </div>

        {/* LINE CHART */}

        <div className="bg-white shadow rounded-xl p-6 mt-6">

          <h2 className="text-lg font-semibold mb-4">
            User Growth
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>

        </div>

      </div>

    </div>

  );

}

export default Dashboard;