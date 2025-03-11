import nodemailer from "nodemailer";

class EmailAdapter {

  async sendEmail(email: string, message: string, subject) {

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for port 465, false for other ports
      auth: {
        user: "nikitadevmode@gmail.com",
        pass: "tvbt ipsb dzjh kgud",
      },
    });

    const info = await transporter.sendMail({
      from: 'Nikita', // sender address
      to: email, // list of receivers
      subject: subject, // Subject line
      // text: req.body.text, // plain text body
      html: message, // html body
    });

    return info
  }
}

export default new EmailAdapter()