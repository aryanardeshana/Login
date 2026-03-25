import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

function ChangePassword() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {

            const token = Cookies.get("token");

            const res = await axios.post(
                "https://us-central1-pdf-merge-a77ae.cloudfunctions.net/api/change-password",
                {
                    email,
                    oldPassword,
                    newPassword
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setMessage(res.data.message);

            setOldPassword("");
            setNewPassword("");

            setTimeout(() => {
                navigate("/login");
            }, 2000);

        } catch (error) {

            setMessage(error?.response?.data?.message || "Something went wrong");

        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white shadow-xl rounded-xl p-8 w-96">

                <h2 className="text-2xl font-bold text-center mb-6">
                    Change Password
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="w-full border p-2 rounded"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Old Password"
                        className="w-full border p-2 rounded"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                    />

                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="New Password"
                        className="w-full border p-2 rounded"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            className="mr-2"
                            checked={showPassword}
                            onChange={() => setShowPassword(!showPassword)}
                        />
                        <label>Show Password</label>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white p-2 rounded"
                    >
                        {loading ? "Loading..." : "Update Password"}
                    </button>

                </form>

                {message && (
                    <p className="text-center text-sm mt-4">
                        {message}
                    </p>
                )}

            </div>
        </div>
    );
}

export default ChangePassword;