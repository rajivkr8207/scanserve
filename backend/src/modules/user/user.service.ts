import { User } from './user.model.js';

export const AuthService = {

    async findUserForLogin(usernameOrEmail: string) {
        const user = await User.findOne({
            $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
        }).select("+password")
        return user;
    },
    async findByUserNameOrEmail(username: string, email: string) {
        const user = await User.findOne({
            $or: [{ username }, { email }],
        });
        return user;
    },
    async findByEmail(email: string) {
        const user = await User.findOne({ email });
        return user;
    },

    async registerUser(
        fullName: string,
        username: string,
        email: string,
        phoneno: string,
        password: string,
        otp: string,
    ) {
        const user = await User.create({
            fullName,
            username,
            email,
            phoneno,
            password,
            otp,
            otpExpire: new Date(Date.now() + 1000 * 60 * 15),
        });
        return user;
    },

    async findById(id: string) {
        const user = await User.findById(id);
        return user;
    },
};
