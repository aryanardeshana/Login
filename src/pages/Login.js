import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
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
            Cookies.set("token", res.data.token, { expires: 1 });
            Cookies.set("user", JSON.stringify(res.data.user), { expires: 1 });

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

        try {
            const res = await axios.post(
                "https://us-central1-pdf-merge-a77ae.cloudfunctions.net/api/forgot-password",
                { email: resetEmail }
            );

            setResetMessage(res.data.message);

            // OTP page par ja
            navigate("/otp-reset", { state: { email: resetEmail } });

        } catch (err) {
            setResetMessage(err.response?.data?.message || "Error");
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

                        <Link to="/" className="text-blue-500 hover:underline cursor-pointer">
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

                        <div className="flex gap-3 justify-center">

                            <button
                                onClick={() => {
                                    setShowPopup(false);
                                    navigate("/dashboard");
                                }}
                                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
                            >
                                Skip
                            </button>

                            <button
                                onClick={async () => {

                                    const userData = JSON.parse(Cookies.get("user"));

                                    try {

                                        await axios.post(
                                            "https://us-central1-pdf-merge-a77ae.cloudfunctions.net/api/upgrade-premium",
                                            {
                                                email: userData.email
                                            }
                                        );

                                        userData.premium = true;
                                        Cookies.set("user", JSON.stringify(userData), { expires: 1 });

                                        let premiumUsers = JSON.parse(localStorage.getItem("premiumUsers")) || [];

                                        if (!premiumUsers.includes(userData.email)) {
                                            premiumUsers.push(userData.email);
                                        }

                                        localStorage.setItem("premiumUsers", JSON.stringify(premiumUsers));

                                    } catch (error) {
                                        console.log(error);
                                    }

                                    setShowPopup(false);
                                    navigate("/dashboard");

                                }}
                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
                            >
                                Upgrade
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </>
    );
}

export default Login;