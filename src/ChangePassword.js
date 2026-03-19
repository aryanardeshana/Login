import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

            const res = await axios.post(
                "https://us-central1-pdf-merge-a77ae.cloudfunctions.net/api/change-password",
                {
                    email,
                    oldPassword,
                    newPassword
                }
            );

            setMessage(res.data.message);

            setOldPassword("");
            setNewPassword("");

            // 2 seconds pachi login page ma redirect
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

                    {/* EMAIL */}
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    {/* OLD PASSWORD */}
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Old Password"
                        className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                    />

                    {/* NEW PASSWORD */}
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="New Password"
                        className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />

                    {/* SHOW PASSWORD */}
                    <div className="flex items-center mt-2">

                        <input
                            type="checkbox"
                            className="mr-2"
                            checked={showPassword}
                            onChange={() => setShowPassword(!showPassword)}
                        />

                        <label className="text-sm text-gray-600">
                            Show Password
                        </label>

                    </div>

                    {/* BUTTON */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded flex justify-center items-center"
                    >

                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            "Update Password"
                        )}

                    </button>

                </form>

                {message && (
                    <p className="text-center text-sm mt-4 text-gray-700">
                        {message}
                    </p>
                )}

            </div>

        </div>

    );

}

export default ChangePassword;

