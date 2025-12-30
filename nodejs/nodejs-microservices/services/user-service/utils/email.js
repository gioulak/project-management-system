const { createTransport } = require("nodemailer");

const createPasswordResetUrl = (id, token) => 
    `${process.env.CLIENT_URL}/reset-password/${id}/${token}`;

const transporter = createTransport({
    service: process.env.EMAIL_HOST,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

const passwordResetTemplate = (user, url) => {
    const { username, email } = user;
    return {
        from: `Project Management App - <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `Reset Password`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 6oopx; margin: 0 auto;">
            <h2 style="color: #5b0fdfff;">Password Reset Link</h2>
            <p>Hello,</p>
            <p>Reset your password by clicking on the link below:</p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="${url}" 
                    style="background-color: #459dd8ff;
                        color: white;
                        padding: 12px 30px;
                        text-decoration: none;
                        border-radius: 5px;
                        display: inline-block;">
                    Reset Password
                </a>
            </div>
            <p style="color: #7f8c8d; font-size: 14px;">Or copu this link:</p>
            <p style="word-break: break-all; color: #459dd8ff; font-size: 12px;">
                ${url}
            </p>
            <p style="color: #e74c3c; margin-top: 20px;">
                <strong>⚠️ The link will expire in 15 mins!</strong>
            </p>
            <p style="color: #7f8c8d; font-size: 12px; margin-top: 30px;">
                If you haven't requested password reset, please ignore!
            </p>
            <hr style="border: none; border-top: 1px solid #ecf0f1; margin: 30px 0;">
                <p style="color: #95a5a6; font-size: 12px;">
                    Project Management System
                </p>
        </div>
        `,
    };
};

const passwordResetConfirmationTemplate = (user) => {
    const { email } = user;
    return {
        from: `Project Management App - <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `Password Reset Successful`,
        html: `
            <h2>Password Reset Successful</h2>
        <p>You've successfully updated your password for your account <${email}>. </p>
        <small>If you did not change your password, reset it from your account.</small>
        <br /><br />
        <p>Thanks,</p>
        <p>Authentication API</p>`,
    };
};

module.exports = { transporter, createPasswordResetUrl, passwordResetTemplate, passwordResetConfirmationTemplate };