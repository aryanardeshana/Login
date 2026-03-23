import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

function UpdateProfile() {

    const navigate = useNavigate();

    const userData = Cookies.get("user");
    const user = userData ? JSON.parse(userData) : null;

    const [name, setName] = useState(user?.name || "");

    const handleUpdate = async () => {

        try {

            const res = await axios.post(
                "https://us-central1-pdf-merge-a77ae.cloudfunctions.net/api/update-profile",
                {
                    email: user.email,
                    name: name
                }
            );

            alert(res.data.message);

            // cookie update
            Cookies.set("user", JSON.stringify({
                ...user,
                name: name
            }));

            navigate("/dashboard");

        } catch (err) {
            alert("Error updating profile");
        }

    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100">

            <div className="bg-white p-6 rounded-xl shadow w-96">

                <h2 className="text-xl font-bold mb-4">
                    Update Profile
                </h2>

                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 border rounded mb-4"
                />

                <button
                    onClick={handleUpdate}
                    className="w-full bg-purple-500 text-white py-2 rounded"
                >
                    Update
                </button>

            </div>

        </div>
    );

}

export default UpdateProfile;