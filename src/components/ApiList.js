import React from "react";

function ApiList({ apiList }) {
    return (
        <div className="bg-white shadow rounded-xl p-6 mt-6">
            <h2 className="text-lg font-semibold mb-4">Developed APIs</h2>

            <table className="w-full text-left">
                <thead className="bg-purple-600 text-white">
                    <tr>
                        <th className="p-3">API Name</th>
                        <th className="p-3">API URL</th>
                    </tr>
                </thead>

                <tbody>
                    {apiList.map((api, index) => (
                        <tr key={index} className="border-b">
                            <td className="p-3">{api.name}</td>
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
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ApiList;