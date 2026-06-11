import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import UseAuth from "../hooks/UseAuth";
import { useState } from "react";

export default function Login() {
    const { handlerLogin, isLoading } = UseAuth();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const [errorMsg, setErrorMsg] = useState("");

    const onSubmit = async (data: any) => {
        try {
            setErrorMsg("");
            await handlerLogin(data);
            navigate("/profile");
        } catch (error: any) {
            setErrorMsg(error.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
            <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg">
                <h1 className="text-3xl font-bold text-center mb-6">
                    Login
                </h1>

                {errorMsg && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                        <span className="block sm:inline">{errorMsg}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <input
                            type="text"
                            placeholder="Username or Email"
                            {...register("usernameOrEmail", {
                                required: "Username or Email is required",
                            })}
                            className="w-full border rounded-lg p-3"
                        />
                        {errors.usernameOrEmail && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.usernameOrEmail.message as string}
                            </p>
                        )}
                    </div>

                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            {...register("password", {
                                required: "Password is required",
                            })}
                            className="w-full border rounded-lg p-3"
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.password.message as string}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {isLoading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p className="text-center mt-4">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-indigo-600">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}