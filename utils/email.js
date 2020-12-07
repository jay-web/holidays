const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
    // Create the transporter USING EMAIL SERVICE PROVIDER LIKE GMAIL OR SOMETHING ELSE
    // Here using EMAIL TRAP SERVICE PROVIDER FOR TESTING
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
    })

    // Create the mail with options

    const emailOption = {
        from : "'Jay Sharma' <holidays.com>",
        to : options.email,
        subject: options.subject,
        text: options.message
    }

    // Send the email

    await transporter.sendMail(emailOption);
}

module.exports = sendEmail;