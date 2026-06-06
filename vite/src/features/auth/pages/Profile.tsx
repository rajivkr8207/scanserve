import { useEffect } from "react";
import { useNavigate } from "react-router";
import UseAuth from "../hooks/UseAuth";

export default function Profile() {
    const { user, handleGetCurrentUser, handlerLogout, isLoading } = UseAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            handleGetCurrentUser().catch(() => {
                navigate("/login");
            });
        }
    }, [user, navigate]);

    const onLogout = async () => {
        await handlerLogout();
        navigate("/login");
    };

    if (isLoading && !user) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
            <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg text-center">
                <h1 className="text-3xl font-bold mb-4">Profile</h1>
                <div className="space-y-4 text-left">
                    <p><strong>Name:</strong> {user.fullName}</p>
                    <p><strong>Username:</strong> {user.username}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Phone:</strong> {user.phoneno}</p>
                </div>
                <button
                    onClick={onLogout}
                    disabled={isLoading}
                    className="mt-6 w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 disabled:opacity-50"
                >
                    {isLoading ? "Logging out..." : "Logout"}
                </button>
            </div>
        </div>
    );
}
