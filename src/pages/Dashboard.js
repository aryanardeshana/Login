import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Users from "../components/Users";
import ApiList from "../components/ApiList";
import Charts from "../components/Charts";
import DashboardHome from "../components/DashboardHome";
import Layout from "../components/Layout"; 

function Dashboard() {

  const navigate = useNavigate();
  const userData = Cookies.get("user");
  const user = userData ? JSON.parse(userData) : null;

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [apiList, setApiList] = useState([]);
  const [active, setActive] = useState("dashboard");

  const usersPerPage = 5;

  useEffect(() => {
    axios.get("https://us-central1-pdf-merge-a77ae.cloudfunctions.net/api/users")
      .then(res => setUsers(res.data));

    axios.get("https://us-central1-pdf-merge-a77ae.cloudfunctions.net/api/all-apis")
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

  const handleLogout = () => {
    Cookies.remove("user");
    navigate("/");
  };

  return (
    <Layout setActive={setActive}> 

      <Navbar
        user={user}
        navigate={navigate}
        handleLogout={handleLogout}
      />

      <div className="p-6">

        {active === "dashboard" && (
          <DashboardHome
            user={user}
            totalUsers={totalUsers}
            premiumUsers={premiumUsers}
            freeUsers={freeUsers}
          />
        )}

        {active === "users" && (
          <Users
            search={search}
            setSearch={setSearch}
            currentUsers={currentUsers}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
          />
        )}

        {active === "apis" && (
          <ApiList apiList={apiList} />
        )}

        {active === "charts" && (
          <Charts chartData={chartData} COLORS={COLORS} />
        )}

      </div>

    </Layout>
  );
}

export default Dashboard;