import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import UseAuth from "../hooks/UseAuth";

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const email = searchParams.get("email") || "";
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const { handleResetPassword, handleVerifyResetOtp, isLoading } = UseAuth();
    const navigate = useNavigate();
    const [errorMsg, setErrorMsg] = useState("");
    const [isOtpVerified, setIsOtpVerified] = useState(false);

    const onVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!otp || !email) return;
        try {
            setErrorMsg("");
            await handleVerifyResetOtp(email, otp);
            setIsOtpVerified(true);
        } catch (error: any) {
            setErrorMsg(error.response?.data?.message || "Invalid OTP");
        }
    };

    const onResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!otp || !email || !password) return;
        try {
            setErrorMsg("");
            await handleResetPassword(email, otp, password);
            navigate("/login");
        } catch (error: any) {
            setErrorMsg(error.response?.data?.message || "Failed to reset password");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
            <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg">
                <h1 className="text-3xl font-bold text-center mb-6">Reset Password</h1>
                {errorMsg && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                        <span className="block sm:inline">{errorMsg}</span>
                    </div>
                )}
                {!email && <p className="text-red-500 text-center mb-4">No email provided in URL.</p>}
                
                {!isOtpVerified ? (
                    <form onSubmit={onVerifyOtp} className="space-y-4">
                        <div>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="Enter 6-digit Reset OTP"
                                className="w-full border rounded-lg p-3"
                                maxLength={6}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading || !email}
                            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {isLoading ? "Verifying..." : "Verify OTP"}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={onResetPassword} className="space-y-4">
                        <div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter new password"
                                className="w-full border rounded-lg p-3"
                                minLength={6}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {isLoading ? "Resetting..." : "Set New Password"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
