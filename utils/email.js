const nodemailer = require("nodemailer");
const pug = require("pug");
const htmlToText = require("html-to-text");

module.exports = class Email {
    constructor(user, url){
        this.to = user.email,
        this.firstName  = user.name.split(" ")[0],
        this.url = url,
        this.from = `Jay Sharma <${process.env.EMAIL_FROM}>`
    }

    newTransport(){
        if(process.env.NODE_ENV === "production"){
            console.log("email from production")
            // sendgrid 
            return nodemailer.createTransport({
                host: process.env.SENDGRID_EMAILHOST,
                port: process.env.SENDGRID_PORT,
                // service: "SendGrid",
                auth: {
                    user: process.env.SENDGRID_USERNAME,
                    pass: process.env.SENDGRID_PASSWORD
                    // api_key: process.env.SENDGRID_PASSWORD
                  }

            })
        }

        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
              }
        });
    }

    // Send the actual mail
    async send(template, subject){
        const html = pug.renderFile(`${__dirname}/../views/emails/${template}.pug`, {
            firstName: this.firstName,
            url: this.url
        });

        // Define email options
        const emailOption = {
            from : this.from,
            to : this.to,
            subject: subject,
            html: html,
            text: htmlToText.fromString(html)
        }

        // Create the transport and send the mail
        await this.newTransport().sendMail(emailOption);
    }

    // Send welcome email method

    async sendWelcome(){
        await this.send("welcome", "Welcome to the Holidays Family");
    }

    // Send reset password email method

    async resetPasswordEmail(){
        await this.send("forgetPassword", "Reset password instructions");
    }

}
