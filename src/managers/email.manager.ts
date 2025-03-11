import emailAdapter from "../adapters/email.adapter";

export class EmailManager {
  async sendEmailRecoveryMessage(user: any, password, message) {
    await emailAdapter.sendEmail("user email", "password recovery", "<div> message</div>")
  }

  async sendEmailConfirmationMessage(user: any, message?: string, password?: string, ) {
    await emailAdapter.sendEmail(user.email, message || "", password)
  }
}

export default new EmailManager()