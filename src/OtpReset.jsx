import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function OtpReset() {

    const location = useLocation();
    const navigate = useNavigate();

    const email = location.state?.email;

    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

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

            setTimeout(() => {
                navigate("/login");
            }, 2000);

        } catch (err) {
            setMessage(err.response?.data?.message || "Error");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-80">

                <h2 className="text-xl mb-4 text-center">Enter OTP</h2>

                <input
                    type="text"
                    placeholder="Enter OTP"
                    className="border p-2 mb-3 w-full"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="New Password"
                    className="border p-2 mb-3 w-full"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button className="bg-blue-500 text-white w-full p-2 rounded">
                    Reset Password
                </button>

                {message && <p className="mt-3 text-center">{message}</p>}

            </form>
        </div>
    );
}

export default OtpReset;