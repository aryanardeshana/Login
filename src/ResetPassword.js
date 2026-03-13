import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function ResetPassword() {

    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {

            const res = await axios.post(
                `https://us-central1-pdf-merge-a77ae.cloudfunctions.net/api/reset-password/${token}`,
                {
                    newPassword: password
                }
            );

            setMessage(res.data.message);
            setPassword("");

            setTimeout(() => {
                navigate("/login");
            }, 2000);

        } catch (err) {

            console.log(err);

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
                    Set New Password
                </h2>

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