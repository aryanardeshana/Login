import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [showPopup, setShowPopup] = useState(false);

    const [showForgot, setShowForgot] = useState(false);
    const [resetEmail, setResetEmail] = useState("");
    const [resetLoading, setResetLoading] = useState(false);
    const [resetMessage, setResetMessage] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {

            const res = await axios.post("https://us-central1-pdf-merge-a77ae.cloudfunctions.net/api/login", {
                email,
                password,
            });

            console.log(res.data);

            localStorage.setItem("user", JSON.stringify(res.data.user));

            setLoading(false);
            setShowPopup(true);

        } catch (err) {

            console.log(err.response?.data?.message);
            setLoading(false);
            alert(err.response?.data?.message || "Login failed");
        }
    };

    const handleResetPassword = async (e) => {

        e.preventDefault();
        setResetLoading(true);
        setResetMessage("");

        try {

            const res = await axios.post(
                "https://us-central1-pdf-merge-a77ae.cloudfunctions.net/api/reset-password",
                { email: resetEmail }
            );

            setResetMessage(res.data.message);

        } catch (err) {

            setResetMessage(
                err.response?.data?.message || "Something went wrong"
            );

        }

        setResetLoading(false);
    };

    return (
        <>

            <div className="min-h-screen flex items-center justify-center bg-gray-100">

                <div className="bg-white shadow-lg rounded-2xl p-8 w-96">

                    <h2 className="text-3xl font-bold text-center mb-6">
                        Login
                    </h2>

                    <form onSubmit={handleLogin} className="space-y-4">

                        {/* EMAIL */}
                        <div>

                            <label className="text-sm text-gray-600">
                                Email
                            </label>

                            <input
                                type="email"
                                placeholder="Enter email"
                                className="w-full mt-1 border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                            />

                        </div>


                        {/* PASSWORD */}
                        <div>

                            <label className="text-sm text-gray-600">
                                Password
                            </label>

                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter password"
                                className="w-full mt-1 border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loading}
                            />

                            {/* SHOW PASSWORD */}
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


                        {/* LOGIN BUTTON */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded flex items-center justify-center"
                        >

                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                "Login"
                            )}

                        </button>

                    </form>


                    {/* FORGOT PASSWORD */}
                    <p
                        className="text-sm mt-3 text-center text-blue-500 cursor-pointer hover:underline"
                        onClick={() => setShowForgot(true)}
                    >
                        Forgot Password?
                    </p>


                    {/* REGISTER LINK */}
                    <p className="text-sm mt-4 text-center">

                        Don’t have account?{" "}

                        <Link to="/" className="text-blue-500">
                            Register
                        </Link>

                    </p>

                </div>

            </div>


            {/* FORGOT PASSWORD MODAL */}
            {showForgot && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

                    <div className="bg-white p-6 rounded-xl shadow-lg w-80 text-center">

                        <h3 className="text-lg font-semibold mb-4">
                            Reset Password
                        </h3>

                        <form onSubmit={handleResetPassword}>

                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full border p-2 rounded mb-4"
                                value={resetEmail}
                                onChange={(e) => setResetEmail(e.target.value)}
                                required
                                disabled={resetLoading}
                            />

                            <button
                                type="submit"
                                disabled={resetLoading}
                                className="bg-blue-500 text-white px-4 py-2 rounded w-full"
                            >
                                {resetLoading ? "Sending..." : "Send Reset Link"}
                            </button>

                        </form>

                        {resetMessage && (

                            <p className="mt-4 text-sm text-gray-700">
                                {resetMessage}
                            </p>

                        )}

                        <button
                            onClick={() => {
                                setShowForgot(false);
                                setResetEmail("");
                                setResetMessage("");
                            }}
                            className="mt-4 text-red-500 text-sm"
                        >
                            Close
                        </button>

                    </div>

                </div>

            )}


            {/* LOGIN SUCCESS POPUP */}
            {showPopup && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">

                    <div className="bg-white p-6 rounded-xl shadow-2xl w-80 text-center">

                        <h3 className="text-xl font-semibold text-green-600 mb-4">
                            Login Successful
                        </h3>

                        <p className="text-gray-600 mb-6">
                            Welcome back! You have logged in successfully.
                        </p>

                        <button
                            onClick={() => {
                                setShowPopup(false);
                                navigate("/dashboard");
                            }}
                            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition duration-300"
                        >
                            OK
                        </button>

                    </div>

                </div>

            )}

        </>
    );
}

export default Login;