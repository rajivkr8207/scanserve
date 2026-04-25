import nodemailer from 'nodemailer'
import { ENV } from './env.js';
const MailTranspoter = nodemailer.createTransport({
    host: ENV.SMTP_HOST,
    port: 587,
    secure: false,
    auth: {
        user: ENV.SMTP_USER,
        pass: ENV.SMTP_PASS,
    },
});
export default MailTranspoter;