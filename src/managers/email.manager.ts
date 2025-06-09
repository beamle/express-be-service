import emailAdapter from "../adapters/email.adapter";

export class EmailManager {
  async sendEmailConfirmationMessage(user: any, message?: string, subject?: string,) {
    await emailAdapter.sendEmail(user.email, message || "", subject)
  }
}

export default new EmailManager()

/** utils */
export const generateEmailConfirmationMessage = (code: string) => {
  return "<h1>Thank you for your registration</h1>\n" +
    " <p>To finish registration please follow the link below:\n" +
    `     <a href=https://some.com/confirm-registration?code=${code}>complete registration</a>\n` +
    " </p>\n"
}

export const generateEmailConfirmationResendMessage = (code: string) => {
  return "<h1>Thank you for your registration(1)</h1>\n" +
    " <p>To finish registration please follow the link below:\n" +
    `     <a href=https://some.resend.com/confirm-registration?code=${code}>resending registration code</a>\n` +
    " </p>\n"
}