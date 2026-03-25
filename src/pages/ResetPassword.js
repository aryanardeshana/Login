import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function ResetPassword() {

    const location = useLocation();
    const navigate = useNavigate();

    const email = location.state?.email;

    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {

            const res = await axios.post(
                "https://us-central1-pdf-merge-a77ae.cloudfunctions.net/api/verify-otp-reset",
                {
                    email,
                    otp,
                    newPassword: password
                }
            );

            setMessage(res.data.message);
            setOtp("");
            setPassword("");

            setTimeout(() => {
                navigate("/login");
            }, 2000);

        } catch (err) {

            if (err.response) {
                setMessage(err.response.data.message);
            } else {
                setMessage("Reset failed");
            }

        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">

            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 shadow rounded w-80"
            >

                <h2 className="text-xl mb-4 text-center">
                    Reset Password (OTP)
                </h2>

                <input
                    type="text"
                    placeholder="Enter OTP"
                    className="border p-2 mb-3 w-full"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="New Password"
                    className="border p-2 mb-4 w-full"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full flex justify-center items-center"
                >

                    {loading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        "Reset Password"
                    )}

                </button>

                {message && (
                    <p className="mt-3 text-center text-gray-700">
                        {message}
                    </p>
                )}

            </form>

        </div>
    );
}

export default ResetPassword;