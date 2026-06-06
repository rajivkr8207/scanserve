import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import UseAuth from "../hooks/UseAuth";

export default function Verifyotp() {
    const [searchParams] = useSearchParams();
    const email = searchParams.get("email") || "";
    const [otp, setOtp] = useState("");
    const { handleVerifyOtp, handleResendOtp, isLoading } = UseAuth();
    const navigate = useNavigate();
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!otp || !email) return;
        try {
            setErrorMsg("");
            setSuccessMsg("");
            await handleVerifyOtp(email, otp);
            navigate("/login");
        } catch (error: any) {
            setErrorMsg(error.response?.data?.message || "Verification failed");
        }
    };

    const onResend = async () => {
        if (!email) return;
        try {
            setErrorMsg("");
            setSuccessMsg("");
            await handleResendOtp(email);
            setSuccessMsg("OTP has been resent to your email");
        } catch (error: any) {
            setErrorMsg(error.response?.data?.message || "Failed to resend OTP");
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
            <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg">
                <h1 className="text-3xl font-bold text-center mb-6">Verify OTP</h1>
                {errorMsg && <p className="text-red-500 text-center mb-4">{errorMsg}</p>}
                {successMsg && <p className="text-green-500 text-center mb-4">{successMsg}</p>}
                {!email && <p className="text-red-500 text-center mb-4">No email provided in url.</p>}
                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="Enter 6-digit OTP"
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
                        {isLoading ? "Verifying..." : "Verify"}
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <button 
                        type="button" 
                        onClick={onResend} 
                        disabled={isLoading || !email} 
                        className="text-indigo-600 hover:text-indigo-800 disabled:opacity-50"
                    >
                        Resend OTP
                    </button>
                </div>
            </div>
        </div>
    );
}
