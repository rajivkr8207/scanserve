import { api } from "../../../lib/api"

const RegisterUser = async (user: any) => {
    const res = await api.post("/auth/register", user)
    return res.data
}

const LoginUser = async (user: any) => {
    const res = await api.post("/auth/login", user)
    return res.data
}

const LogoutUser = async () => {
    const res = await api.post("/auth/logout")
    return res.data
}

const refreshAccessToken = async () => {
    const res = await api.post("/auth/refresh-token")
    return res.data
}

const getCurrentUser = async () => {
    const res = await api.get("/auth/profile")
    return res.data
}

const VerifyOtp = async (email: string, otp: string) => {
    const res = await api.post(`/auth/verify/${email}`, { otp })
    return res.data
}

const ResendOtp = async (email: string) => {
    const res = await api.post(`/auth/resend-otp/${email}`)
    return res.data
}

const forgotPassword = async (email: string) => {
    const res = await api.post("/auth/forgot-password", { email })
    return res.data
}

const verifyResetOtp = async (email: string, otp: string) => {
    const res = await api.post(`/auth/verify-reset/${email}`, { otp })
    return res.data
}

const resetPassword = async (email: string, otp: string, password: string) => {
    const res = await api.post(`/auth/reset-password/${email}`, { otp, password })
    return res.data
}

export const AuthServices = {
    RegisterUser,
    LoginUser,
    LogoutUser,
    refreshAccessToken,
    getCurrentUser,
    VerifyOtp,
    ResendOtp,
    forgotPassword,
    verifyResetOtp,
    resetPassword
}