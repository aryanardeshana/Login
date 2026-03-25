import React from "react";

function Sidebar({ setActive, isOpen, setIsOpen }) {
  return (
    <div className={`${isOpen ? "w-64" : "w-20"} h-screen fixed top-0 left-0 bg-gray-900 text-white p-5 transition-all duration-300`}>

      {/* TOGGLE BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="mb-6 bg-gray-700 px-3 py-1 rounded"
      >
        ☰
      </button>

      {/* TITLE */}
      {isOpen && <h2 className="text-xl font-bold mb-6">Menu</h2>}

      {/* MENU */}
      <ul className="space-y-4">
        <li onClick={() => setActive("dashboard")} className="cursor-pointer">
          {isOpen ? "Dashboard" : "Dash"}
        </li>

        <li onClick={() => setActive("users")} className="cursor-pointer">
          {isOpen ? "Users" : "User"}
        </li>

        <li onClick={() => setActive("apis")} className="cursor-pointer">
          {isOpen ? "APIs" : "API"}
        </li>

        <li onClick={() => setActive("charts")} className="cursor-pointer">
          {isOpen ? "Charts" : "Charts"}
        </li>
      </ul>

    </div>
  );
}

export default Sidebar;