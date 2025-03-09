import emailAdapter from "../../adapters/email.adapter";
import emailManager from "../../managers/email.manager";

export const PostErrors = {
  NO_POSTS: { message: "Something went wrong, try again.", field: "", status: 404 },
  NO_BLOG_WITH_SUCH_ID: { message: "No blog with such id has been found!", field: "blogId", status: 404 },
  POST_NOT_CREATED: { message: "Post was not created!", field: "", status: 404 },
  NO_POST_WITH_SUCH_ID: { message: "Post with such id was not found!", field: "id", status: 404 },
  INTERNAL_SERVER_ERROR: { message: "Internal server error", field: "", status: 500 },
  DID_NOT_CREATE_COMMENT: { message: "Didn't create comment", field: "", status: 400 }
}

class EmailService {

  async sendEmail(userEmail, password, message) {

    // savet orepo
    // get usr  from repo
    await emailManager.sendEmailRecoveryMessage(userEmail, password, message)
  }
}

export default new EmailService();