import React from "react";

function Users({
    search,
    setSearch,
    currentUsers,
    currentPage,
    setCurrentPage,
    totalPages
}) {
    return (
        <>
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

            {/* ADVANCED PAGINATION (OLD UI ) */}
            <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">

                {/* PREV */}
                <button
                    onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                    className="px-4 py-2 border border-blue-500 text-blue-600 rounded hover:bg-blue-500 hover:text-white"
                >
                    Prev
                </button>

                {/* FIRST PAGE */}
                <button
                    onClick={() => setCurrentPage(1)}
                    className={`px-4 py-2 rounded border ${currentPage === 1
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                        }`}
                >
                    1
                </button>

                {/* LEFT DOTS */}
                {currentPage > 4 && (
                    <span className="px-2 text-gray-500">...</span>
                )}

                {/* MIDDLE PAGES */}
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

                {/* RIGHT DOTS */}
                {currentPage < totalPages - 3 && (
                    <span className="px-2 text-gray-500">...</span>
                )}

                {/* LAST PAGE */}
                <button
                    onClick={() => setCurrentPage(totalPages)}
                    className={`px-4 py-2 rounded border ${currentPage === totalPages
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                        }`}
                >
                    {totalPages}
                </button>

                {/* NEXT */}
                <button
                    onClick={() =>
                        setCurrentPage(Math.min(currentPage + 1, totalPages))
                    }
                    className="px-4 py-2 border border-blue-500 text-blue-600 rounded hover:bg-blue-500 hover:text-white"
                >
                    Next
                </button>

            </div>
        </>
    );
}

export default Users;