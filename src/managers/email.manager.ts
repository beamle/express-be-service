import emailAdapter from "../adapters/email.adapter";

export class EmailManager {
  async sendEmailConfirmationMessage(user: any, message?: string, subject?: string, ) {
    await emailAdapter.sendEmail(user.email, message || "", subject)
  }
}

export default new EmailManager()