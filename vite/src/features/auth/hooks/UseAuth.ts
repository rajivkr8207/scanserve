import { useSelector, useDispatch } from 'react-redux'
import { AuthServices } from '../services/auth.service'
import { setLoading, setUser, setError, setSuccess, resetState } from '../auth.slice'

const UseAuth = () => {
    const dispatch = useDispatch()
    const { user, isLoading, isError, isSuccess, message } = useSelector((state: any) => state.auth)

    const handleRegister = async (formData: any) => {
        dispatch(setLoading(true));
        try {
            const data = await AuthServices.RegisterUser(formData);
            dispatch(setSuccess(data.message || 'Registration successful'));
            return data;
        } catch (error: any) {
            dispatch(setError(error.response?.data?.message || 'Registration failed'));
            throw error;
        }
    }

    const handlerLogin = async (formData: any) => {
        dispatch(setLoading(true));
        try {
            const data = await AuthServices.LoginUser(formData);
            dispatch(setUser(data.data?.user));
            dispatch(setSuccess(data.message || 'Login successful'));
            return data;
        } catch (error: any) {
            dispatch(setError(error.response?.data?.message || 'Login failed'));
            throw error;
        }
    }

    const handlerLogout = async () => {
        dispatch(setLoading(true));
        try {
            await AuthServices.LogoutUser();
            dispatch(setUser(null));
            dispatch(setSuccess('Logout successful'));
        } catch (error: any) {
            dispatch(setError(error.response?.data?.message || 'Logout failed'));
            throw error;
        }
    }

    const handleVerifyOtp = async (email: string, otp: string) => {
        dispatch(setLoading(true));
        try {
            const data = await AuthServices.VerifyOtp(email, otp);
            dispatch(setUser(data.data?.user));
            dispatch(setSuccess(data.message || 'Verification successful'));
            return data;
        } catch (error: any) {
            dispatch(setError(error.response?.data?.message || 'Verification failed'));
            throw error;
        }
    }
    
    const handleGetCurrentUser = async () => {
        dispatch(setLoading(true));
        try {
            const data = await AuthServices.getCurrentUser();
            dispatch(setUser(data.data));
            dispatch(setLoading(false));
            return data;
        } catch (error: any) {
            dispatch(setError(error.response?.data?.message || 'Failed to fetch profile'));
            throw error;
        }
    }

    const handleForgotPassword = async (email: string) => {
        dispatch(setLoading(true));
        try {
            const data = await AuthServices.forgotPassword(email);
            dispatch(setSuccess(data.message || 'OTP sent successfully'));
            return data;
        } catch (error: any) {
            dispatch(setError(error.response?.data?.message || 'Failed to send OTP'));
            throw error;
        }
    }

    const handleVerifyResetOtp = async (email: string, otp: string) => {
        dispatch(setLoading(true));
        try {
            const data = await AuthServices.verifyResetOtp(email, otp);
            dispatch(setSuccess(data.message || 'OTP verified successfully'));
            return data;
        } catch (error: any) {
            dispatch(setError(error.response?.data?.message || 'Invalid OTP'));
            throw error;
        }
    }

    const handleResetPassword = async (email: string, otp: string, password: string) => {
        dispatch(setLoading(true));
        try {
            const data = await AuthServices.resetPassword(email, otp, password);
            dispatch(setSuccess(data.message || 'Password reset successfully'));
            return data;
        } catch (error: any) {
            dispatch(setError(error.response?.data?.message || 'Failed to reset password'));
            throw error;
        }
    }

    const handleResendOtp = async (email: string) => {
        dispatch(setLoading(true));
        try {
            const data = await AuthServices.ResendOtp(email);
            dispatch(setSuccess(data.message || 'OTP resent successfully'));
            return data;
        } catch (error: any) {
            dispatch(setError(error.response?.data?.message || 'Failed to resend OTP'));
            throw error;
        }
    }

    return {
        user,
        isLoading,
        isError,
        isSuccess,
        message,
        handleRegister,
        handlerLogin,
        handlerLogout,
        handleVerifyOtp,
        handleGetCurrentUser,
        handleForgotPassword,
        handleVerifyResetOtp,
        handleResetPassword,
        handleResendOtp,
        resetState: () => dispatch(resetState())
    }
}

export default UseAuth