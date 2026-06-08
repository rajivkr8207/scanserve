
type Config = {
    Backend_URL: string
    RAZORPAY_KEY: string
}

export const Env: Config = {
    Backend_URL: import.meta.env.VITE_BACKEND_URL || "http://localhost:8000",
    RAZORPAY_KEY: import.meta.env.VITE_RAZORPAY_KEY || "rzp_test_SsgBpfBuDqqkQW",
}