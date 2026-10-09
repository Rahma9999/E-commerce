const nodemailer = require('nodemailer');
// const pug = require('pug');
const fs = require('fs')
const htmlToText = require('html-to-text')

module.exports = class Email {
    constructor(user, otp, url) {
        this.to = user.email,
        this.firstName = user.firstName,
        this.url = url,
        this.from = `Rahma store <${process.env.EMAIL_FROM}>`,
        this.otp = otp
    }

    newTransport() {
        if(process.env.NODE_ENV === 'production'){

            return nodemailer.createTransport({
                service: 'sendGrid',
                auth: {
                    user: process.env.SENDGRID_USERNAME, 
                    pass: process.env.SENDGRID_PASSWORD, 
                }
            });
        }
        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_POST,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }

    async send(templete, subject) {
        // 1) Render HTML based on a pug
        // const html = pug.renderFile(`${__dirname}/../../view/email/${templete}.pug`, {
        //     firstName: this.firstName,
        //     url: this.url,
        //     subject
        // });
        let html = fs.readFileSync(`${__dirname}/../views/email/${templete}.html`, 'utf-8');
        html = html
            .replace('{{firstName}}', this.firstName)
            .replace('{{otp}}', this.otp || '')
            .replace('{{url}}', this.url || '');
    
        // 2) Define mail option
        const mailOption = {
        from: this.from,
        to: this.to,
        subject,
        html,
        text: htmlToText.convert(html)
        }

        // 3) create a transport and send mail
        await this.newTransport().sendMail(mailOption);
    }

    async sendOTP() {
        await this.send('sendOTP', 'Send OTP verification');
    }

    async sendResetPassword() {
        await this.send('resetPassword', 'Reset your password');
    }
}