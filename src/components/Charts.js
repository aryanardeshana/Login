import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

function Charts({ chartData, COLORS }) {
    return (
        <>
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
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#3b82f6"
                            strokeWidth={3}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </>
    );
}

export default Charts;