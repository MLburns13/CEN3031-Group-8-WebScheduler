const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
})

async function sendVerificationEmail(email, token) {
    const link = `http://localhost:3000/verify-email/${token}`

    await transporter.sendMail({
        from: '"Web Scheduler Email Verification" <no-reply@yourapp.com>',
        to: email,
        subject: 'Verify your email',
        html: `<p>Click <a href="${link}">here</a> to verify your email.</p>`
    })
}

async function sendPasswordResetEmail(email, token) {
    const link = `http://localhost:3000/reset-password/${token}`

    await transporter.sendMail({
        from: '"Web Scheduler Password Reset" <no-reply@yourapp.com>',
        to: email,
        subject: 'Password Reset',
        html: `<p>Click <a href="${link}">here</a> to reset your password.</p>`
    })
}

module.exports = {
    sendVerificationEmail,
    sendPasswordResetEmail
}