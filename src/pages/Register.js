import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Register() {

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [error, setError] = useState("");

    const handleRegister = async (e) => {

        e.preventDefault();

        setError("");

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setLoading(true);

        try {

            await axios.post(
                "https://us-central1-pdf-merge-a77ae.cloudfunctions.net/api/register",
                {
                    name,
                    email,
                    password
                }
            );

            setTimeout(() => {

                setLoading(false);
                setShowPopup(true);

            }, 800);

            setTimeout(() => {

                navigate("/login");

            }, 2000);

        } catch (err) {

            console.log(err);
            setError(err.response?.data?.message || "Registration failed");
            setLoading(false);

        }

    };

    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-gray-100">

                <div className="bg-white shadow-lg rounded-xl p-8 w-96">

                    <h2 className="text-2xl font-bold text-center mb-6">
                        Register
                    </h2>

                    {error && (
                        <p className="text-red-500 text-sm mb-3 text-center">
                            {error}
                        </p>
                    )}

                    <form onSubmit={handleRegister} className="space-y-4">

                        {/* NAME */}
                        <div>
                            <label className="text-sm text-gray-600">
                                Name
                            </label>

                            <input
                                type="text"
                                placeholder="Enter your name"
                                className="w-full mt-1 border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disabled={loading}
                                required
                            />
                        </div>

                        {/* EMAIL */}
                        <div>
                            <label className="text-sm text-gray-600">
                                Email
                            </label>

                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full mt-1 border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                                required
                            />
                        </div>

                        {/* PASSWORD */}
                        <div>
                            <label className="text-sm text-gray-600">
                                Password
                            </label>

                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                className="w-full mt-1 border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                                required
                            />

                            <div className="flex items-center mt-2">

                                <input
                                    type="checkbox"
                                    className="mr-2"
                                    checked={showPassword}
                                    onChange={() =>
                                        setShowPassword(!showPassword)
                                    }
                                />

                                <label className="text-sm text-gray-600">
                                    Show Password
                                </label>

                            </div>

                        </div>

                        {/* BUTTON */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md flex justify-center items-center transition"
                        >

                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                "Register"
                            )}

                        </button>

                    </form>

                    <p className="text-sm text-center mt-4">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="text-blue-600 hover:underline"
                        >
                            Login
                        </Link>
                    </p>

                </div>

            </div>


            {/* SUCCESS POPUP */}
            {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/40">

                    <div className="bg-white p-6 rounded-lg shadow-lg text-center w-80">

                        <h3 className="text-lg font-semibold text-green-600 mb-3">
                            Registration Successful
                        </h3>

                        <p className="text-gray-600 mb-4">
                            Your account has been created successfully
                        </p>

                        <button
                            onClick={() => navigate("/login")}
                            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded"
                        >
                            Go to Login
                        </button>

                    </div>

                </div>
            )}
        </>
    );
}

export default Register;