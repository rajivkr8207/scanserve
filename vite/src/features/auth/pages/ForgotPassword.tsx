import { useState } from "react";
import { Link, useNavigate } from "react-router";
import UseAuth from "../hooks/UseAuth";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const { handleForgotPassword, isLoading } = UseAuth();
    const navigate = useNavigate();
    const [errorMsg, setErrorMsg] = useState("");

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        try {
            setErrorMsg("");
            await handleForgotPassword(email);
            navigate("/reset-password?email=" + email);
        } catch (error: any) {
            setErrorMsg(error.response?.data?.message || "Failed to send reset email");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
            <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg">
                <h1 className="text-3xl font-bold text-center mb-6">Forgot Password</h1>
                {errorMsg && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                        <span className="block sm:inline">{errorMsg}</span>
                    </div>
                )}
                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="w-full border rounded-lg p-3"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading || !email}
                        className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {isLoading ? "Sending..." : "Send Reset OTP"}
                    </button>
                </form>
                <p className="text-center mt-4">
                    Remember your password?{" "}
                    <Link to="/login" className="text-indigo-600">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}
