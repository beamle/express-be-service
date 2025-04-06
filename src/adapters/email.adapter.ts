import nodemailer from "nodemailer";

class EmailAdapter {

  async sendEmail(email: string, message: string, subject?: string) {

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: "smtp.ethereal.email",
      // port: 587,
      // secure: false, // true for port 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    try {
      const info = await transporter.sendMail({
        from: 'Nikita', // sender address
        to: email, // list of receivers
        subject: subject, // Subject line
        html: message, // html body
      });
      return info
    } catch (e) {
      console.log('Error sending email: ', e)
    }
  }
}

export default new EmailAdapter()