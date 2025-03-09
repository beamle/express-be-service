import emailAdapter from "../adapters/email.adapter";

export class EmailManager {
  async sendEmailRecoveryMessage(user: any, password, message) {
      await emailAdapter.sendEmail("user email", "password recovery", "<div> message</div>")
  }
}

export default new EmailManager()